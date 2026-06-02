import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "communicable-disease-reporting-rpn": {
    title: "Communicable Disease Reporting for Practical Nurses",
    cellular: {
      title: "Foundations of Communicable Disease Surveillance and Reporting",
      content: "Communicable disease reporting is a cornerstone of public health practice that enables the detection, monitoring, and control of infectious disease outbreaks within communities. The system relies on a legal framework of mandatory reporting laws that require healthcare providers, laboratories, and institutions to notify designated public health authorities when specific diseases are diagnosed or suspected. In Canada, the Public Health Agency of Canada (PHAC) maintains the nationally notifiable diseases list, while individual provinces and territories have their own reporting requirements that may include additional conditions. In the United States, the Centers for Disease Control and Prevention (CDC) publishes the Nationally Notifiable Conditions list, and each state maintains its own reportable disease registry with specific timelines and procedures. The chain of infection provides the biological framework for understanding disease transmission and informs reporting priorities. The six links of the chain are: the infectious agent (pathogen), the reservoir (where the organism lives and multiplies), the portal of exit (how the pathogen leaves the reservoir), the mode of transmission (contact, droplet, airborne, vehicle, or vector-borne), the portal of entry (how the pathogen enters the susceptible host), and the susceptible host (the person who develops infection). Breaking any link in this chain can prevent disease transmission, and reporting enables public health authorities to identify and intervene at multiple points. Reportable diseases are classified by urgency of notification. Immediately reportable conditions (within 24 hours or less) typically include diseases with high morbidity or mortality, epidemic potential, or bioterrorism significance such as measles, meningococcal disease, botulism, anthrax, cholera, plague, and viral hemorrhagic fevers. Routine reportable conditions (within specified timeframes, typically 5 to 7 business days) include diseases such as tuberculosis, hepatitis B and C, pertussis, salmonellosis, Lyme disease, and sexually transmitted infections. The practical nurse plays a critical role in the reporting chain by recognizing clinical presentations suggestive of reportable diseases, accurately documenting assessment findings, collecting appropriate specimens for laboratory confirmation, implementing required isolation precautions, and notifying the supervising registered nurse or physician who will initiate the formal report to public health authorities. Contact tracing is the systematic process of identifying, notifying, and monitoring individuals who have been exposed to a person with a confirmed or suspected communicable disease. The purpose of contact tracing is to interrupt disease transmission by identifying exposed individuals early, providing prophylactic treatment or vaccination when available, educating contacts about symptoms to watch for, and recommending quarantine or monitoring periods. The practical nurse may assist with contact tracing activities under the direction of public health officials, including interviewing patients about their contacts, documenting exposure timelines, and providing education to identified contacts about disease symptoms, incubation periods, and when to seek medical attention. Accurate and complete documentation is essential throughout the reporting process to establish disease timelines, track epidemiological patterns, and support legal and regulatory compliance."
    },
    riskFactors: [
      "Healthcare workers with occupational exposure to blood, body fluids, and respiratory secretions from infected patients",
      "Individuals living in congregate settings (long-term care facilities, shelters, correctional institutions, dormitories) where close contact facilitates transmission",
      "International travelers returning from regions with endemic communicable diseases (malaria, dengue, cholera, tuberculosis)",
      "Immunocompromised individuals (HIV/AIDS, organ transplant recipients, chemotherapy patients) with increased susceptibility to opportunistic infections",
      "Unvaccinated or under-vaccinated individuals and communities with declining vaccination rates creating susceptible population clusters",
      "Children in daycare and school settings where fecal-oral and respiratory transmission routes are common",
      "Intravenous drug users sharing needles and equipment, increasing risk for bloodborne pathogens (HIV, hepatitis B, hepatitis C)"
    ],
    diagnostics: [
      "Complete blood count with differential: elevated WBC with left shift (increased bands and immature neutrophils) suggests acute bacterial infection; lymphocytosis may indicate viral infection",
      "Blood cultures (aerobic and anaerobic): obtained before antibiotic administration to identify causative organism and guide targeted antimicrobial therapy; collect two sets from separate venipuncture sites",
      "Polymerase chain reaction (PCR) testing: highly sensitive and specific nucleic acid amplification test used for rapid identification of specific pathogens including influenza, COVID-19, tuberculosis, and meningococcal disease",
      "Serology (antibody testing): detects IgM antibodies (acute/recent infection) and IgG antibodies (past infection/immunity) for diseases including hepatitis, HIV, measles, and varicella",
      "Tuberculin skin test (Mantoux/PPD) or interferon-gamma release assay (IGRA): screens for Mycobacterium tuberculosis infection; positive result indicates exposure but does not distinguish latent from active disease",
      "Stool culture and ova/parasite examination: identifies enteric pathogens (Salmonella, Shigella, Campylobacter, E. coli O157:H7) and parasitic infections in patients with diarrheal illness"
    ],
    management: [
      "Implement appropriate isolation precautions immediately upon suspicion of communicable disease: airborne (negative pressure room for TB, measles, varicella), droplet (mask within 2 meters for influenza, pertussis, meningococcal disease), or contact (gown and gloves for C. difficile, MRSA, norovirus)",
      "Administer prescribed antimicrobial therapy promptly after specimen collection; note that timing of antibiotic administration is critical -- delays beyond recommended timeframes increase morbidity and mortality",
      "Initiate the formal reporting process by notifying the supervising RN or physician who will complete and submit the reportable disease form to the designated public health authority within required timelines",
      "Coordinate with public health authorities to facilitate contact tracing by obtaining patient consent (where required), documenting close contacts with dates and duration of exposure, and providing patient education about the process",
      "Provide patient and family education about disease transmission, isolation requirements, expected duration of infectivity, and when it is safe to return to work, school, or daycare",
      "Administer post-exposure prophylaxis (PEP) to identified contacts as ordered: examples include rifampin or ciprofloxacin for meningococcal contacts, MMR vaccine within 72 hours for measles contacts, and hepatitis B immune globulin plus vaccine for hepatitis B exposures",
      "Document all reporting activities, specimen collection, isolation implementation, contact notification, and patient education in the medical record with dates, times, and responsible parties"
    ],
    nursingActions: [
      "Recognize clinical presentations that may indicate reportable communicable diseases: unexplained rash with fever (measles, varicella), prolonged cough with hemoptysis (tuberculosis), acute jaundice (hepatitis), petechial rash with meningeal signs (meningococcal disease)",
      "Implement standard precautions for ALL patient encounters and transmission-based precautions immediately when communicable disease is suspected -- do not wait for laboratory confirmation",
      "Collect specimens accurately using proper technique, labeling, and transport conditions as specified by the laboratory; note that improper collection can yield false-negative results and delay diagnosis",
      "Monitor patients in isolation for signs of psychological distress including anxiety, depression, and social withdrawal; provide emotional support and facilitate virtual communication with family when possible",
      "Maintain accurate exposure logs documenting dates, duration, and nature of contact between the infected patient and healthcare workers, visitors, and other patients for occupational health follow-up",
      "Verify vaccination status of patient contacts and recommend catch-up vaccination or post-exposure prophylaxis as directed by the physician or public health authority",
      "Report any suspected outbreaks (two or more epidemiologically linked cases) to the infection control practitioner and public health authority immediately, even before laboratory confirmation"
    ],
    assessmentFindings: [
      "Fever pattern assessment: intermittent (rises and falls to baseline), remittent (fluctuates but does not return to baseline), sustained (remains elevated with minimal variation), or relapsing (fever returns after afebrile period) -- each pattern may suggest different infectious etiologies",
      "Lymphadenopathy: enlarged, tender lymph nodes indicating immune response to infection; location may suggest source (cervical nodes in upper respiratory infection, inguinal nodes in sexually transmitted infection, generalized in systemic viral illness)",
      "Skin manifestations: maculopapular rash (measles, rubella), vesicular rash (varicella, herpes), petechial or purpuric rash (meningococcemia, Rocky Mountain spotted fever), or target lesions (erythema migrans in Lyme disease)",
      "Respiratory findings: productive cough lasting more than 2 to 3 weeks (tuberculosis suspicion), paroxysmal cough with inspiratory whoop (pertussis), or acute onset cough with fever and dyspnea (influenza, COVID-19)",
      "Gastrointestinal symptoms: acute onset diarrhea (bloody or watery), vomiting, and abdominal cramping suggesting foodborne or waterborne illness requiring stool specimen collection and potential reporting",
      "Hepatic involvement: jaundice (yellowing of skin and sclera), dark urine (tea or cola-colored), clay-colored stools, right upper quadrant tenderness, and hepatomegaly suggesting viral hepatitis requiring mandatory reporting",
      "Neurological changes: headache with nuchal rigidity and photophobia (meningitis), altered mental status, seizures, or focal neurological deficits suggesting central nervous system infection"
    ],
    signs: {
      left: [
        "Low-grade fever (38.0 to 38.5 degrees Celsius) with mild malaise and fatigue",
        "Localized lymphadenopathy (one or two palpable nodes in a single region)",
        "Mild nonproductive cough or rhinorrhea",
        "Localized skin rash without systemic symptoms",
        "Mild gastrointestinal symptoms (nausea, loose stools) without dehydration",
        "Patient reports recent exposure to known communicable disease"
      ],
      right: [
        "High fever (above 39.5 degrees Celsius) with rigors and altered mental status",
        "Petechial or purpuric rash (suspect meningococcemia -- medical emergency)",
        "Nuchal rigidity with positive Kernig and Brudzinski signs (meningitis)",
        "Acute respiratory failure requiring supplemental oxygen or ventilation",
        "Hemoptysis with cavitary lesion on chest X-ray (active pulmonary tuberculosis)",
        "Hemorrhagic manifestations (bleeding from multiple sites, DIC in viral hemorrhagic fever)"
      ]
    },
    medications: [
      {
        name: "Reportable Disease Notification Form",
        type: "Documentation Tool",
        action: "Standardized form used to transmit required patient and disease information from healthcare facilities to designated public health authorities; captures patient demographics, diagnosis, laboratory confirmation, onset date, hospitalization status, and treating clinician information to enable surveillance, case investigation, and outbreak response",
        sideEffects: "Administrative burden on healthcare staff; potential for incomplete or inaccurate data if forms are not filled correctly; delays in submission may compromise outbreak detection and response timeliness",
        contra: "Should not be used as a substitute for immediate telephone notification when urgently reportable conditions (meningococcal disease, measles, botulism, anthrax) are suspected; electronic reporting systems are replacing paper forms in many jurisdictions",
        pearl: "Immediately reportable diseases (typically within 1 to 24 hours) require phone notification to public health BEFORE the written form is submitted; routine reportable diseases are typically submitted within 5 to 7 business days; know your jurisdiction-specific list and timelines"
      },
      {
        name: "Contact Tracing Log",
        type: "Documentation Tool",
        action: "Systematic documentation tool used to record all individuals who had significant exposure to a confirmed or suspected case of communicable disease during the infectious period; captures contact names, relationship to case, dates and duration of exposure, contact information, vaccination status, and follow-up actions taken to enable public health monitoring and prophylaxis administration",
        sideEffects: "Privacy and confidentiality concerns require careful handling of personal health information; contacts may experience anxiety or stigma upon notification; resource-intensive process requiring trained personnel and follow-up capacity",
        contra: "Should not be conducted without proper authorization from public health authorities and in compliance with privacy legislation (PHIPA in Ontario, HIPAA in the United States); should not disclose the identity of the index case to contacts without consent or legal authority",
        pearl: "The infectious period varies by disease and determines which contacts require notification; for example, measles contacts include anyone sharing airspace within 2 hours of the case, while meningococcal contacts include those with direct exposure to respiratory secretions; always verify the defined exposure window with public health"
      },
      {
        name: "Public Health Notification Protocol",
        type: "Documentation Tool",
        action: "Structured communication protocol that defines the chain of notification from healthcare facility to local public health unit to provincial/territorial/state health department to national agency (PHAC or CDC); ensures standardized, timely, and complete information transfer to enable coordinated surveillance, outbreak investigation, and public health response across jurisdictions",
        sideEffects: "Multiple levels of reporting may create communication delays if systems are not well integrated; jurisdictional differences in reporting requirements can create confusion for healthcare providers working across boundaries; electronic reporting systems require reliable internet connectivity and staff training",
        contra: "Must not replace clinical judgment and immediate patient care priorities; reporting obligations do not override the need to stabilize the patient first; should not delay treatment initiation while awaiting public health guidance",
        pearl: "The practical nurse should know the location of reporting forms, the phone number for the local public health unit, and the facility-specific reporting protocol; in an emergency (suspected bioterrorism agent, novel pathogen outbreak), contact the public health duty officer immediately by phone rather than relying on electronic reporting"
      }
    ],
    pearls: [
      "The chain of infection has six links: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host -- breaking any single link can prevent disease transmission",
      "Immediately reportable diseases (meningococcal disease, measles, botulism, anthrax, cholera, plague) require PHONE notification to public health within 1 to 24 hours -- do not wait for laboratory confirmation if clinical suspicion is high",
      "Contact tracing effectiveness depends on speed -- the sooner contacts are identified and notified, the more effectively transmission chains can be broken through prophylaxis, vaccination, or quarantine",
      "Standard precautions apply to ALL patients regardless of diagnosis; transmission-based precautions (airborne, droplet, contact) are added when specific communicable diseases are suspected or confirmed",
      "The practical nurse is legally obligated to report suspected communicable diseases through the appropriate facility chain of command; failure to report is a regulatory violation that can result in professional discipline",
      "Tuberculosis requires airborne precautions with an N95 respirator (not a surgical mask) and negative pressure isolation room; the patient must wear a surgical mask when transported outside the isolation room",
      "Post-exposure prophylaxis timing is critical and disease-specific: measles vaccine within 72 hours of exposure, hepatitis B immune globulin within 24 hours, and HIV PEP ideally within 2 hours (no later than 72 hours) of exposure"
    ],
    quiz: [
      {
        question: "A practical nurse suspects that a patient has measles based on the clinical presentation of high fever, cough, coryza, conjunctivitis, and a spreading maculopapular rash. What is the most appropriate initial nursing action?",
        options: [
          "Wait for laboratory confirmation before implementing isolation precautions",
          "Implement airborne precautions immediately and notify the supervising RN for reporting",
          "Place the patient on contact precautions and continue routine assessment",
          "Discharge the patient home with instructions to self-isolate"
        ],
        correct: 1,
        rationale: "Measles requires airborne precautions (negative pressure room, N95 respirator) and is an immediately reportable disease. Precautions must be implemented on clinical suspicion -- do not wait for laboratory confirmation. The supervising RN or physician must be notified immediately to initiate reporting to public health."
      },
      {
        question: "A patient is diagnosed with active pulmonary tuberculosis. Which type of isolation precaution must the practical nurse implement?",
        options: [
          "Contact precautions with gown and gloves",
          "Droplet precautions with surgical mask within 2 meters",
          "Airborne precautions with N95 respirator and negative pressure room",
          "Standard precautions only with enhanced hand hygiene"
        ],
        correct: 2,
        rationale: "Active pulmonary tuberculosis is transmitted via airborne droplet nuclei that remain suspended in the air for prolonged periods. Airborne precautions require a negative pressure isolation room and an N95 respirator (fitted and seal-checked) for all healthcare personnel entering the room. A surgical mask is insufficient for airborne pathogens."
      },
      {
        question: "The practical nurse is assisting with contact tracing for a patient diagnosed with meningococcal meningitis. Which group of individuals should be identified as close contacts requiring prophylaxis?",
        options: [
          "Anyone who was in the same hospital building during the patient's admission",
          "Individuals with direct exposure to the patient's respiratory secretions within the 7 days before symptom onset",
          "Only family members who live in the same household",
          "All patients who were admitted to the hospital on the same day"
        ],
        correct: 1,
        rationale: "Close contacts of meningococcal disease include those with direct exposure to respiratory secretions (kissing, sharing utensils, mouth-to-mouth resuscitation) or prolonged close contact (household members, daycare contacts) within 7 days before symptom onset. Casual contact in the same building does not constitute significant exposure."
      }
    ]
  },

  "community-resources-rpn": {
    title: "Community Resources and Referral Navigation for Practical Nurses",
    cellular: {
      title: "Social Determinants of Health and Community Resource Navigation",
      content: "Community resource navigation is an essential competency for practical nurses that involves identifying patient needs beyond clinical care, connecting patients and families with appropriate community services, and following up to ensure that referrals result in actual service access. The social determinants of health (SDOH) framework provides the theoretical foundation for this practice, recognizing that health outcomes are shaped by the conditions in which people are born, grow, live, work, and age. Research consistently demonstrates that social determinants account for 30 to 55 percent of health outcomes, exceeding the contribution of clinical healthcare services (estimated at 10 to 20 percent). The practical nurse encounters patients whose health is profoundly affected by these determinants daily, making SDOH screening and resource referral a core nursing function. The five key domains of social determinants include economic stability (employment, income, food security, housing stability), education access and quality (literacy, language, early childhood education), healthcare access and quality (insurance coverage, provider availability, health literacy), neighborhood and built environment (housing quality, transportation, safety, environmental conditions), and social and community context (social support, discrimination, civic participation, incarceration history). Poverty is the single most powerful predictor of poor health outcomes across the lifespan. Individuals living below the poverty line experience higher rates of chronic disease, mental illness, substance use disorders, and premature mortality. Food insecurity affects approximately one in eight households and is associated with increased hospitalization rates, poorer chronic disease control (particularly diabetes), and adverse childhood developmental outcomes. Housing instability and homelessness create cascading health effects including increased exposure to communicable diseases, inability to store medications properly, barriers to wound care and chronic disease management, and severe psychological distress. The SDOH screening process uses validated tools such as the PRAPARE (Protocol for Responding to and Assessing Patients' Assets, Risks, and Experiences) screening tool, the Health Leads screening tool, or the Accountable Health Communities screening tool to systematically identify social risk factors. The practical nurse administers these screening tools, documents findings, initiates referrals to appropriate community resources, and follows up to determine whether patients successfully accessed services. Effective referral navigation requires knowledge of available community resources, established relationships with community organizations, understanding of eligibility criteria and application processes, and the ability to advocate on behalf of patients who face barriers to access. The 211 information and referral service, available across North America, provides a comprehensive database of health and human services organized by category and geography, serving as a starting point for resource identification."
    },
    riskFactors: [
      "Poverty and low socioeconomic status creating barriers to healthcare access, medication adherence, nutritious food, and safe housing",
      "Language barriers and limited English proficiency reducing ability to navigate healthcare systems, understand discharge instructions, and access community services",
      "Social isolation and limited social support networks, particularly among elderly persons living alone, recent immigrants, and individuals with mental illness",
      "Chronic illness requiring complex care coordination across multiple providers, specialists, and community services",
      "Substance use disorders creating barriers to housing stability, employment, healthcare engagement, and social support",
      "Recent discharge from hospital or emergency department without adequate discharge planning or community follow-up arrangements",
      "Caregiver burden and burnout in family members providing unpaid care to individuals with chronic illness, disability, or cognitive impairment"
    ],
    diagnostics: [
      "PRAPARE screening tool: validated 21-question instrument assessing social determinants across domains of personal characteristics, family and home, money and resources, social and emotional health, and optional measures; identifies actionable social needs for referral",
      "Health literacy assessment (Newest Vital Sign or REALM-SF): evaluates patient ability to read, understand, and act on health information; low health literacy is associated with higher hospitalization rates and poorer health outcomes",
      "PHQ-2 and PHQ-9 depression screening: identifies patients with depressive symptoms that may require mental health referral; PHQ-2 is used for initial screening and PHQ-9 for severity assessment",
      "CAGE or AUDIT-C alcohol screening: brief validated tools to identify at-risk drinking and alcohol use disorder requiring referral to addiction services",
      "Fall risk assessment (Morse Fall Scale): identifies community-dwelling patients at increased risk for falls who may benefit from home safety modification referrals and community exercise programs",
      "Nutritional screening (MNA-SF or MUST): identifies patients at risk for malnutrition who may benefit from referral to meal programs, food banks, or dietitian services"
    ],
    management: [
      "Conduct systematic SDOH screening at admission, during home visits, and at care transitions using validated screening tools to identify unmet social needs",
      "Maintain and regularly update a community resource directory organized by category (food, housing, transportation, mental health, financial assistance, legal services) with current contact information, eligibility criteria, and hours of operation",
      "Initiate warm referrals (direct connection between patient and service provider) rather than cold referrals (providing a phone number) whenever possible, as warm referrals significantly increase service access rates",
      "Coordinate with social workers, case managers, and community health workers to develop comprehensive care plans that address both clinical and social needs",
      "Follow up with patients within 48 to 72 hours after referral to determine whether they successfully contacted the resource, identify barriers to access, and provide additional assistance as needed",
      "Document all screening results, referrals, and follow-up outcomes in the medical record using standardized SDOH coding (ICD-10-CM Z codes) to support data tracking and program evaluation",
      "Advocate for patients experiencing barriers to service access by contacting agencies directly, assisting with application forms, arranging transportation, and providing language interpretation services"
    ],
    nursingActions: [
      "Administer SDOH screening tools in a private, nonjudgmental setting using trauma-informed communication principles; explain the purpose of screening and how information will be used to connect them with helpful services",
      "Assess patient readiness to engage with community resources and tailor referrals to the patient's stated priorities rather than imposing the nurse's assessment of needs",
      "Provide culturally and linguistically appropriate resource information using plain language materials, translated documents, and professional interpreter services as needed",
      "Coordinate transportation arrangements for patients who identify transportation as a barrier to accessing services or attending medical appointments",
      "Educate patients about available financial assistance programs including medication assistance programs, sliding-scale clinics, government benefits (disability, social assistance), and charitable organizations",
      "Facilitate connections between isolated patients and community social programs (senior centers, support groups, volunteer visitor programs, faith-based organizations) to reduce social isolation",
      "Monitor patients receiving community services for ongoing needs, changes in social circumstances, and gaps in service delivery; reassess and adjust referrals as needed"
    ],
    assessmentFindings: [
      "Food insecurity indicators: patient reports skipping meals, choosing between food and medication, relying on food banks, or eating expired or inadequate food; observed empty refrigerator or lack of food in the home during home visits",
      "Housing instability: patient reports difficulty paying rent, frequent moves, doubling up with family or friends, staying in shelters, or living in substandard conditions (mold, pest infestation, no heat or hot water)",
      "Medication nonadherence due to cost: patient reports not filling prescriptions, cutting pills in half, or rationing medications due to inability to afford copayments or drug costs",
      "Transportation barriers: patient reports missing medical appointments, delayed emergency care, or inability to access pharmacy, grocery store, or community services due to lack of reliable transportation",
      "Caregiver stress indicators: family caregiver reports sleep deprivation, weight loss or gain, social withdrawal, irritability, health decline, or expressed feelings of being overwhelmed and unable to continue caregiving",
      "Social isolation indicators: patient reports having no visitors, no phone calls from family or friends, no participation in social activities, and feelings of loneliness or abandonment"
    ],
    signs: {
      left: [
        "Patient expresses concern about affording medications or groceries",
        "Missed or delayed medical appointments due to transportation issues",
        "Patient reports feeling lonely or socially disconnected",
        "Family members asking about available support services",
        "Patient shows mild signs of nutritional deficiency (weight loss, fatigue)",
        "Recent change in living situation (relocation, loss of roommate, family changes)"
      ],
      right: [
        "Evidence of severe food insecurity with malnutrition and dehydration requiring medical intervention",
        "Homelessness with exposure-related illness (hypothermia, frostbite, heat stroke)",
        "Suspected elder abuse or neglect requiring mandatory reporting (unexplained injuries, financial exploitation, caregiver hostility)",
        "Patient expressing suicidal ideation related to social circumstances requiring immediate mental health crisis intervention",
        "Child welfare concerns (inadequate supervision, unsafe living conditions, malnutrition) requiring mandatory child protection reporting",
        "Acute medication toxicity from rationing or incorrect self-dosing due to inability to afford proper medication"
      ]
    },
    medications: [
      {
        name: "SDOH Screening and Referral Form",
        type: "Assessment Tool",
        action: "Standardized instrument that combines validated social determinants screening questions with an integrated referral tracking system; documents identified needs across all SDOH domains (housing, food, transportation, utilities, safety, employment, education, childcare, financial strain), records patient consent and readiness for referral, tracks referral status (initiated, accepted, completed, declined), and generates aggregate data for population health management and program planning",
        sideEffects: "Screening may identify more needs than available resources can address, potentially causing frustration for patients and providers; patients may experience screening fatigue if tools are administered at every encounter without clear benefit; incomplete follow-up after screening may erode patient trust in the healthcare system",
        contra: "Should not be administered without referral pathways in place to address identified needs; must not be used punitively or to make judgments about patient compliance; requires staff training in trauma-informed administration to avoid retraumatizing patients with histories of adverse experiences",
        pearl: "Embed SDOH screening into routine clinical workflows at standardized touchpoints (admission, annual visits, care transitions) rather than relying on ad hoc screening; use ICD-10-CM Z codes (Z55-Z65) to document identified social risk factors in the medical record for continuity and billing purposes"
      },
      {
        name: "Community Resource Directory",
        type: "Assessment Tool",
        action: "Comprehensive, regularly updated catalog of local and regional health and human services organized by category (food assistance, housing, transportation, financial aid, mental health, substance use, legal services, employment, childcare, disability services) with detailed information including eligibility criteria, application procedures, contact information, hours of operation, languages served, and geographic service boundaries; serves as the practical nurse's primary reference for matching patient needs with appropriate community resources",
        sideEffects: "Directories require regular maintenance to remain accurate as organizations change hours, eligibility criteria, or close programs; may not capture informal community resources (faith-based groups, mutual aid networks, neighborhood support) that are important for some populations; printed directories become outdated quickly",
        contra: "Should not be used as a substitute for personalized assessment of patient needs and preferences; resource listings should be verified before sharing with patients to avoid referring to programs that have closed or changed eligibility criteria; must respect patient autonomy in choosing which services to access",
        pearl: "The 211 helpline (available in the US and Canada by dialing 2-1-1) provides free, confidential information and referral to local services 24 hours a day, 7 days a week, in multiple languages; this is the single most useful resource for practical nurses who need to connect patients with community services quickly"
      },
      {
        name: "Patient Education and Health Literacy Tool",
        type: "Assessment Tool",
        action: "Collection of plain language health education materials, visual aids, teach-back scripts, and multilingual resources designed to communicate health information effectively to patients with varying levels of health literacy; uses the teach-back method (asking patients to explain information in their own words) to verify understanding and identify knowledge gaps; supports informed decision-making and self-management across health conditions and community service navigation",
        sideEffects: "Materials must be culturally appropriate and available in the patient's preferred language to be effective; reliance on written materials alone is insufficient for patients with low literacy; teach-back method requires adequate time and may not be feasible in time-pressured settings",
        contra: "Should not replace individualized patient education; generic materials may not address patient-specific concerns or cultural beliefs; should not be used as evidence that education was provided without documenting the teach-back verification process",
        pearl: "Health education materials should be written at a Grade 5 to 6 reading level maximum; use the teach-back method by asking open-ended questions such as 'Can you tell me in your own words what we discussed?' rather than yes/no questions like 'Do you understand?' to accurately assess comprehension"
      }
    ],
    pearls: [
      "Social determinants of health account for 30 to 55 percent of health outcomes -- addressing these factors through community resource referral is as important to patient health as clinical interventions",
      "Warm referrals (directly connecting the patient with the service provider by phone or in person) are significantly more effective than cold referrals (handing the patient a phone number) at ensuring service access",
      "The 211 helpline is a free, confidential, 24/7 information and referral service available across North America that connects callers with local health and human services in multiple languages",
      "Follow up within 48 to 72 hours after making a referral to determine whether the patient successfully accessed the service; if not, identify barriers and provide additional assistance",
      "Use ICD-10-CM Z codes (Z55 through Z65) to document social determinants in the medical record -- this supports continuity of care, population health tracking, and may support reimbursement for SDOH-related interventions",
      "Health literacy affects approximately 36 percent of adults -- always use plain language (Grade 5 to 6 reading level), visual aids, and the teach-back method when providing patient education",
      "Food insecurity is independently associated with higher HbA1c levels in patients with diabetes, increased emergency department utilization, and longer hospital stays -- screening and referral to food assistance programs is a clinical priority"
    ],
    quiz: [
      {
        question: "A practical nurse is screening a patient using a validated social determinants of health tool. The patient reports difficulty affording both food and prescribed medications. Which nursing action should be taken first?",
        options: [
          "Document the finding and move on to the next patient",
          "Advise the patient to prioritize medications over food",
          "Initiate a warm referral to a medication assistance program and food bank, and document the identified needs",
          "Report the patient to social services for noncompliance with medication regimen"
        ],
        correct: 2,
        rationale: "When SDOH screening identifies food insecurity and medication cost barriers, the practical nurse should initiate warm referrals to appropriate resources (medication assistance programs, food banks) and document findings using SDOH codes. Advising patients to choose between food and medication is inappropriate, and labeling cost-related nonadherence as noncompliance is inaccurate."
      },
      {
        question: "Which type of referral is most effective at ensuring patients successfully access community resources?",
        options: [
          "Cold referral: providing the patient with a written phone number and address",
          "Warm referral: directly connecting the patient with the service provider by phone or in person",
          "Passive referral: posting resource brochures in the waiting room",
          "Self-referral: instructing the patient to search for resources online"
        ],
        correct: 1,
        rationale: "Warm referrals, in which the healthcare provider directly connects the patient with the community resource by phone or in-person introduction, are significantly more effective than cold referrals at ensuring patients actually access services. This approach reduces barriers related to health literacy, language, transportation, and system navigation."
      },
      {
        question: "A practical nurse completes a social determinants screening and identifies that a patient has no reliable transportation to medical appointments. Which resource should the nurse recommend first?",
        options: [
          "Suggest the patient purchase a personal vehicle",
          "Cancel the patient's upcoming appointments",
          "Arrange medical transportation services and explore community transit options available in the patient's area",
          "Advise the patient to rely on family members for all transportation needs"
        ],
        correct: 2,
        rationale: "Transportation barriers are a common social determinant affecting healthcare access. The practical nurse should explore available options including medical transportation services, community transit programs, and volunteer driver programs. Suggesting vehicle purchase is unrealistic for low-income patients, and relying solely on family may not be sustainable."
      }
    ]
  },

  "cultural-competence-rpn": {
    title: "Cultural Competence and Humility in Nursing Practice",
    cellular: {
      title: "Foundations of Cultural Competence and Health Equity",
      content: "Cultural competence in nursing is the ongoing process of developing the awareness, knowledge, skills, and attitudes necessary to provide effective, equitable, and respectful care to patients from diverse cultural, ethnic, linguistic, religious, and socioeconomic backgrounds. The concept has evolved from a static endpoint (cultural competence) toward a dynamic, lifelong process (cultural humility) that emphasizes self-reflection, recognition of power imbalances in healthcare relationships, and institutional accountability for health equity. Madeleine Leininger's Theory of Culture Care Diversity and Universality, developed in the 1950s and refined over subsequent decades, provided the foundational framework for transcultural nursing. Leininger proposed that care is the essence of nursing and that culturally congruent care requires understanding the patient's cultural values, beliefs, and practices. Her Sunrise Enabler model identifies seven dimensions influencing health and care: technological factors, religious and philosophical factors, kinship and social factors, cultural values and lifeways, political and legal factors, economic factors, and educational factors. Campinha-Bacote's Process of Cultural Competence in the Delivery of Healthcare Services describes five interconnected constructs: cultural awareness (self-examination of biases and assumptions), cultural knowledge (seeking and obtaining information about diverse groups), cultural skill (ability to conduct culturally sensitive assessments), cultural encounters (direct engagement with individuals from diverse backgrounds), and cultural desire (genuine motivation to engage in the process of cultural competence). The concept of cultural humility, introduced by Tervalon and Murray-Garcia in 1998, shifts the focus from acquiring knowledge about specific cultures to developing a lifelong orientation of self-reflection, recognizing the limitations of one's own cultural perspective, and addressing power imbalances in clinical relationships. Cultural humility acknowledges that no provider can be fully competent in all cultures and instead emphasizes the patient as the expert on their own cultural experience. Implicit bias refers to unconscious attitudes and stereotypes that influence perception, judgment, and behavior without conscious awareness. Research demonstrates that healthcare providers, despite explicit commitments to equality, harbor implicit biases related to race, ethnicity, gender, age, weight, disability, and socioeconomic status that can affect clinical decision-making, communication quality, and health outcomes. The Implicit Association Test (IAT) is a tool used to measure implicit biases. Health disparities are preventable differences in health outcomes and healthcare access that are closely linked to social, economic, and environmental disadvantage. In Canada, Indigenous peoples experience significantly higher rates of diabetes, tuberculosis, suicide, and infant mortality compared to non-Indigenous Canadians, reflecting the ongoing impact of colonization, residential schools, and systemic racism on health. Black, Indigenous, and People of Color (BIPOC) communities in the United States experience disproportionately higher rates of chronic disease, maternal mortality, and COVID-19 mortality. The practical nurse must understand these disparities as products of structural and systemic factors rather than individual or cultural deficits, and must advocate for equitable care at the point of service."
    },
    riskFactors: [
      "Language barriers between patient and healthcare provider leading to miscommunication, missed symptoms, medication errors, and reduced patient satisfaction",
      "Health beliefs and traditional healing practices that may conflict with or delay evidence-based medical treatment (use of traditional remedies, faith healing, hot-cold theory of disease)",
      "Low health literacy compounded by cultural and linguistic barriers reducing patient ability to navigate healthcare systems, understand consent forms, and follow treatment plans",
      "Implicit bias among healthcare providers leading to disparities in pain assessment, diagnostic workup, treatment recommendations, and communication quality",
      "Structural racism and systemic discrimination creating barriers to healthcare access, insurance coverage, and equitable treatment for marginalized populations",
      "Immigration and refugee status creating unique health challenges including pre-migration trauma, torture-related injuries, limited healthcare history, and fear of engaging with institutions",
      "Religious dietary restrictions, modesty requirements, gender preferences for caregivers, and end-of-life practices that may not be accommodated by standard institutional protocols"
    ],
    diagnostics: [
      "Cultural assessment using validated frameworks (Purnell Model, Giger and Davidhizar Transcultural Assessment, Leininger Sunrise Enabler): systematic evaluation of patient's cultural identity, health beliefs, communication preferences, family roles, and spiritual practices",
      "Health literacy assessment (Newest Vital Sign, REALM-SF, or Single Item Literacy Screener): evaluates patient's ability to read, understand, and act on health information; low health literacy is independently associated with poorer health outcomes",
      "Language needs assessment: identifying patient's preferred language, English proficiency level, and preferred mode of interpretation (in-person, telephone, video) to ensure effective communication during all clinical encounters",
      "Implicit bias self-assessment (Implicit Association Test or structured reflection exercises): healthcare providers examine their own unconscious attitudes and assumptions that may affect clinical decision-making and patient interactions",
      "Patient satisfaction and experience surveys disaggregated by race, ethnicity, and language: identifies disparities in care quality and communication effectiveness across patient populations",
      "Social determinants of health screening (PRAPARE or similar): identifies social and economic factors affecting health that may be influenced by cultural and structural determinants"
    ],
    management: [
      "Use professional medical interpreters (certified, trained in medical terminology and confidentiality) for all clinical encounters with patients who have limited English proficiency; never use family members, children, or untrained staff as interpreters for medical conversations",
      "Perform a cultural assessment at the initial encounter and update it at subsequent visits; ask open-ended questions such as 'What do you think caused your illness?' and 'What treatment are you hoping for?' to understand patient perspectives",
      "Accommodate religious and cultural practices in the care plan whenever clinically safe: dietary restrictions (halal, kosher, vegetarian), prayer times, modesty requirements (same-gender caregivers, appropriate draping), and end-of-life rituals",
      "Develop individualized education plans using plain language materials available in the patient's preferred language, visual aids, and the teach-back method to verify understanding",
      "Address health disparities at the point of care by ensuring equitable assessment, treatment, and follow-up regardless of patient's race, ethnicity, language, religion, or socioeconomic status",
      "Create a safe, welcoming environment that reflects the diversity of the patient population through multilingual signage, diverse imagery in educational materials, and visible nondiscrimination policies",
      "Engage in ongoing cultural humility practice through self-reflection, continuing education, community engagement, and seeking feedback from patients and colleagues about cultural responsiveness"
    ],
    nursingActions: [
      "Introduce yourself, state your role, and ask the patient how they would like to be addressed (preferred name, title, pronouns) at the beginning of every encounter",
      "Ask about cultural health beliefs and practices using open-ended, nonjudgmental questions: 'Are there any cultural or religious practices that are important for us to know about as we plan your care?'",
      "Arrange professional interpreter services before the clinical encounter begins; verify that the interpreter speaks the patient's specific dialect and is acceptable to the patient (some patients may prefer a same-gender interpreter)",
      "Document cultural assessment findings, language preferences, interpreter use, and accommodations provided in the medical record to ensure continuity across providers and care settings",
      "Recognize and respond to cultural expressions of pain, grief, and illness that may differ from Western biomedical expectations (stoicism, vocal expression, somatic complaints, spiritual interpretations)",
      "Advocate for patients who experience discrimination or cultural insensitivity within the healthcare system by reporting incidents through appropriate channels and supporting institutional policy changes",
      "Incorporate traditional healing practices into the care plan when they do not conflict with medical treatment; collaborate with traditional healers when the patient requests and it is clinically appropriate"
    ],
    assessmentFindings: [
      "Communication barriers: patient nods agreement but cannot explain treatment plan back (indicating comprehension gap), limited eye contact (may be cultural norm rather than disengagement), use of nonverbal communication that differs from provider expectations",
      "Medication nonadherence related to cultural beliefs: patient uses traditional remedies in place of or alongside prescribed medications, follows culturally influenced dosing patterns (taking medications only when symptomatic), or avoids medications due to cultural stigma around certain diagnoses",
      "Dietary patterns influenced by cultural practices: religious fasting (Ramadan, Lent, Yom Kippur), traditional food beliefs (hot-cold theory affecting food choices during illness), vegetarian or vegan diets based on religious principles (Hinduism, Buddhism, Seventh-Day Adventist)",
      "Family decision-making dynamics: in some cultures, healthcare decisions are made collectively by the family or by the eldest male family member rather than by the individual patient; understanding these dynamics is essential for effective care planning and informed consent",
      "Expressions of distress that differ from biomedical expectations: somatization (presenting psychological distress as physical symptoms), culturally specific idioms of distress (nervios in Latino cultures, susto or fright illness), spiritual explanations for illness (evil eye, spirit possession)",
      "Modesty and gender-related concerns: patient requests same-gender healthcare providers, refuses examination by opposite-gender provider, requires additional covering during physical examination, or declines procedures perceived as culturally inappropriate"
    ],
    signs: {
      left: [
        "Patient requests information about their care in a language other than English",
        "Patient declines specific foods on the meal tray due to dietary restrictions",
        "Family members wish to be present and involved in all care discussions",
        "Patient uses traditional remedies alongside prescribed medications",
        "Patient requests accommodation for prayer times or religious observances",
        "Patient demonstrates limited understanding of discharge instructions despite verbal agreement"
      ],
      right: [
        "Patient refuses life-saving treatment based on cultural or religious beliefs requiring ethics consultation",
        "Language barrier contributing to medication error or adverse event",
        "Suspected honor-based violence or forced marriage requiring safety assessment and mandatory reporting",
        "Patient in acute distress but unable to communicate symptoms due to complete language barrier with no interpreter available",
        "Cultural practice causing direct physical harm (female genital cutting complications, toxic traditional remedy ingestion)",
        "Discrimination or bias-related mistreatment by healthcare staff requiring immediate intervention and incident reporting"
      ]
    },
    medications: [
      {
        name: "Cultural Assessment Framework",
        type: "Assessment Tool",
        action: "Structured clinical tool based on Campinha-Bacote, Purnell, or Leininger models that guides the practical nurse through systematic assessment of patient's cultural identity, health beliefs, communication preferences, family and social structure, spiritual practices, dietary customs, and healthcare expectations to enable development of a culturally congruent care plan",
        sideEffects: "Risk of stereotyping if assessment is applied rigidly to cultural groups rather than to individual patients; may feel intrusive to patients if questions are not framed sensitively; requires adequate time allocation that may be challenging in fast-paced clinical environments",
        contra: "Should never be used to make assumptions about individual patients based on their cultural or ethnic background; must be applied with cultural humility recognizing the patient as the expert on their own experience; should not replace the clinical assessment but complement it",
        pearl: "Use Kleinman's explanatory model questions as a starting framework: 'What do you think caused your problem?', 'Why do you think it started when it did?', 'What do you think your illness does to you?', 'What kind of treatment do you think you should receive?', 'What are the chief problems your illness has caused?'"
      },
      {
        name: "Language Services Request Form",
        type: "Assessment Tool",
        action: "Standardized form used to request and document professional medical interpreter services for patients with limited English proficiency; captures patient's preferred language and dialect, preferred interpretation modality (in-person, telephone, video), patient consent for interpretation services, and interpreter identification for the medical record; ensures compliance with language access regulations and standards",
        sideEffects: "Interpreter availability may cause delays in care delivery, particularly for less common languages or in emergency situations; telephone and video interpretation may be less effective than in-person interpretation for complex medical discussions; patients may have concerns about interpreter confidentiality, particularly in small communities",
        contra: "Professional interpreter services must NEVER be replaced by family members (including children), friends, or untrained bilingual staff for medical conversations; exceptions may apply only in genuine emergencies when no professional interpreter is available, and this exception must be documented; patient consent for specific interpreter should be obtained",
        pearl: "Federal law (Title VI of the Civil Rights Act in the US) and provincial human rights legislation in Canada require healthcare facilities to provide language services at no cost to patients with limited English proficiency; failure to provide interpreter services is a patient safety issue and a legal and regulatory violation"
      },
      {
        name: "Patient Education and Teach-Back Tool",
        type: "Assessment Tool",
        action: "Structured teaching tool that combines culturally adapted health education materials with the teach-back method to verify patient comprehension; materials are available in multiple languages at Grade 5 to 6 reading level with visual aids and pictographs; the teach-back script guides the nurse through the verification process by asking patients to explain information in their own words",
        sideEffects: "Teach-back requires additional time and may need to be repeated multiple times before adequate comprehension is achieved; patients may feel embarrassed or perceive being asked to repeat information as patronizing if the purpose is not explained respectfully; translated materials may contain inaccuracies if not reviewed by native speakers with medical knowledge",
        contra: "Should not be used as the sole method of education for patients with cognitive impairment who may require caregiver-focused education; written materials alone are insufficient for patients with low literacy regardless of language; should not be assumed that a patient who speaks English prefers English-language materials",
        pearl: "Frame the teach-back as a check on your own teaching effectiveness rather than a test of the patient's intelligence: 'I want to make sure I explained this clearly. Can you tell me in your own words what we discussed about your medication?' This phrasing reduces stigma and increases patient willingness to participate"
      }
    ],
    pearls: [
      "Cultural humility is a lifelong process of self-reflection and learning -- it is not a fixed endpoint or a checklist to complete; it requires ongoing examination of one's own biases, power, and privilege in clinical relationships",
      "Professional medical interpreters must be used for all clinical encounters with patients who have limited English proficiency; NEVER use family members, children, or untrained bilingual staff as interpreters for medical conversations",
      "Kleinman's explanatory model questions help elicit the patient's understanding of their illness: 'What do you think caused your problem?', 'What kind of treatment do you think you should receive?', and 'What are you most worried about?'",
      "Implicit bias affects all healthcare providers regardless of training or good intentions; recognizing this is the first step toward mitigating its impact on clinical decision-making and patient outcomes",
      "Health disparities experienced by Indigenous, Black, and other marginalized communities are products of structural and systemic factors (colonization, racism, poverty) -- not cultural deficits",
      "Nodding and verbal agreement ('yes, I understand') do not confirm comprehension -- always use the teach-back method to verify understanding, especially when language or literacy barriers are present",
      "Accommodating cultural practices (dietary restrictions, prayer times, modesty requirements, family involvement in decisions) is not optional -- it is a professional and legal obligation that directly affects patient safety and outcomes"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient who speaks limited English. The patient's adult daughter offers to interpret during the discharge teaching. What is the most appropriate nursing action?",
        options: [
          "Accept the daughter's offer since she knows the patient best",
          "Proceed with discharge teaching in English and provide written materials",
          "Arrange for a professional medical interpreter and decline the daughter's offer for clinical interpretation",
          "Ask the daughter to translate only the medication instructions"
        ],
        correct: 2,
        rationale: "Professional medical interpreters must be used for clinical encounters with patients who have limited English proficiency. Family members should not serve as medical interpreters because they may lack medical vocabulary, may filter or modify information, and the patient may not disclose sensitive information through a family member. Professional interpreters are trained in medical terminology, accuracy, and confidentiality."
      },
      {
        question: "A practical nurse asks a patient from a different cultural background, 'What do you think caused your illness?' This question is an example of which approach?",
        options: [
          "Ethnocentric assessment",
          "Kleinman's explanatory model",
          "Stereotyping the patient's cultural beliefs",
          "Implicit bias assessment"
        ],
        correct: 1,
        rationale: "Kleinman's explanatory model uses open-ended questions to elicit the patient's own understanding and beliefs about their illness, including perceived cause, expected course, and desired treatment. This patient-centered approach honors the patient as the expert on their own experience and helps the nurse develop a culturally congruent care plan."
      },
      {
        question: "A practical nurse recognizes that she has an unconscious preference for providing more detailed explanations to patients who speak English fluently compared to those with limited English proficiency. This recognition reflects which concept?",
        options: [
          "Cultural competence",
          "Cultural desire",
          "Implicit bias awareness",
          "Ethnocentrism"
        ],
        correct: 2,
        rationale: "Implicit bias refers to unconscious attitudes and stereotypes that affect perception and behavior without conscious awareness. Recognizing one's own implicit biases is a critical first step in cultural humility, enabling the practical nurse to consciously counteract these biases and ensure equitable care for all patients regardless of language or cultural background."
      }
    ]
  },

  "ebv-complications-rpn": {
    title: "Epstein-Barr Virus Complications for Practical Nurses",
    cellular: {
      title: "Virology and Pathophysiology of Epstein-Barr Virus Infection",
      content: "Epstein-Barr virus (EBV), also known as human herpesvirus 4 (HHV-4), is a member of the Herpesviridae family and is one of the most common human viruses worldwide, infecting approximately 95 percent of the adult population globally. EBV has a particular tropism for B lymphocytes and oropharyngeal epithelial cells. Primary infection typically occurs during childhood (often subclinical) or adolescence/young adulthood, when it commonly manifests as infectious mononucleosis (IM), colloquially known as the 'kissing disease.' The virus is transmitted primarily through saliva (oral secretions), making kissing, sharing utensils, and sharing drinking containers the most common modes of transmission. After primary infection, EBV establishes lifelong latency in memory B lymphocytes, with periodic reactivation and asymptomatic viral shedding in saliva. The pathophysiology of infectious mononucleosis involves EBV infection of B lymphocytes in the oropharyngeal lymphoid tissue (Waldeyer ring). The virus stimulates polyclonal B cell proliferation, which triggers a robust cytotoxic T lymphocyte (CD8+) response. These activated T lymphocytes are the 'atypical lymphocytes' (Downey cells) seen on the peripheral blood smear, which is a hallmark laboratory finding of infectious mononucleosis. The intense immune response causes lymph node enlargement (lymphadenopathy), pharyngitis with tonsillar exudates, fever, and profound fatigue. The spleen is involved in over 50 percent of cases, with splenomegaly resulting from lymphocyte infiltration and congestion of the splenic red pulp. Splenic rupture is the most feared acute complication of infectious mononucleosis, occurring in approximately 0.1 to 0.5 percent of cases. Rupture typically occurs between days 4 and 21 of illness and may be spontaneous or triggered by abdominal trauma, including contact sports. This is why activity restriction, particularly avoidance of contact sports and heavy lifting, is critically important during the acute illness and for at least 3 to 4 weeks after onset or until splenomegaly resolves. Other acute complications include airway obstruction from massive tonsillar enlargement, autoimmune hemolytic anemia (cold agglutinin disease), thrombocytopenia, hepatitis (elevated liver enzymes occur in up to 80 percent of cases), myocarditis, pericarditis, neurological complications (Guillain-Barre syndrome, meningoencephalitis, cranial nerve palsies), and rash following ampicillin or amoxicillin administration (occurring in 70 to 100 percent of mononucleosis patients who receive these antibiotics). The long-term oncological significance of EBV is substantial. EBV is classified as a Group 1 carcinogen by the International Agency for Research on Cancer (IARC) and is etiologically associated with several malignancies including Burkitt lymphoma (endemic in sub-Saharan Africa, strongly associated with EBV and Plasmodium falciparum coinfection), nasopharyngeal carcinoma, Hodgkin lymphoma (particularly mixed cellularity subtype), post-transplant lymphoproliferative disorder (PTLD) in immunosuppressed organ transplant recipients, and gastric carcinoma. The practical nurse must understand these complications to provide appropriate monitoring, patient education, and timely reporting of concerning findings."
    },
    riskFactors: [
      "Adolescents and young adults (15 to 25 years) experiencing primary EBV infection, which is more likely to manifest as symptomatic infectious mononucleosis compared to childhood infection",
      "Immunocompromised patients (organ transplant recipients on immunosuppressive therapy, HIV/AIDS patients, chemotherapy patients) at increased risk for EBV reactivation and post-transplant lymphoproliferative disorder",
      "Close contact with saliva of infected individuals through kissing, sharing utensils, sharing drinking containers, or exposure to respiratory droplets in crowded environments",
      "Collegiate athletes and military recruits in communal living environments where close contact facilitates transmission",
      "Patients with active mononucleosis who participate in contact sports or heavy physical activity, increasing risk of traumatic splenic rupture",
      "Individuals with X-linked lymphoproliferative disease (Duncan syndrome), a rare genetic condition causing severe, potentially fatal immune response to EBV infection",
      "Patients receiving ampicillin or amoxicillin during acute EBV infection, at high risk (70 to 100 percent) for developing a diffuse maculopapular rash"
    ],
    diagnostics: [
      "Complete blood count with differential: lymphocytosis (greater than 50 percent lymphocytes) with atypical lymphocytes (greater than 10 percent) on peripheral blood smear; total WBC typically 10,000 to 20,000 cells/mcL; mild thrombocytopenia may be present",
      "Monospot test (heterophile antibody test): rapid screening test detecting heterophile antibodies produced during EBV infection; sensitivity 70 to 92 percent in adults but may be negative in children under 4 and in the first week of illness (false-negative period)",
      "EBV-specific serology: VCA-IgM (viral capsid antigen IgM, positive in acute infection), VCA-IgG (positive in acute and past infection), EA-D (early antigen, positive in acute infection), EBNA (Epstein-Barr nuclear antigen, positive 6 to 8 weeks after onset, indicates past infection); this panel differentiates acute from past infection",
      "Liver function tests (AST, ALT, ALP, bilirubin): elevated transaminases occur in up to 80 percent of mononucleosis cases; significant elevation (greater than 3 times upper normal) suggests EBV hepatitis",
      "Abdominal ultrasound: evaluates spleen size to guide activity restriction decisions; splenomegaly is present in over 50 percent of mononucleosis cases; serial measurements may be needed to confirm resolution before return to contact sports",
      "Throat culture or rapid strep test: performed to rule out concurrent Group A Streptococcus pharyngitis (coinfection occurs in approximately 5 to 30 percent of mononucleosis cases)"
    ],
    management: [
      "Enforce strict activity restriction: no contact sports, heavy lifting, or strenuous physical activity for a minimum of 3 to 4 weeks from illness onset or until splenomegaly is confirmed resolved by ultrasound -- splenic rupture is the most life-threatening complication",
      "Provide supportive care as the mainstay of treatment: adequate rest, hydration, antipyretics and analgesics for fever and pain, and nutritional support with soft foods if swallowing is painful",
      "Administer corticosteroids ONLY for specific indications as prescribed: impending airway obstruction from tonsillar enlargement, autoimmune hemolytic anemia, severe thrombocytopenia with bleeding, or myocarditis -- routine corticosteroid use is NOT recommended",
      "Avoid prescribing or administering ampicillin or amoxicillin to patients with suspected or confirmed mononucleosis due to the 70 to 100 percent incidence of a diffuse maculopapular rash; use azithromycin if concurrent bacterial pharyngitis requires treatment",
      "Monitor liver function and educate patients to avoid alcohol, acetaminophen in excess, and hepatotoxic medications until transaminases normalize",
      "Provide return-to-activity guidelines: gradual return to light non-contact activity after acute symptoms resolve; return to contact sports only after physician clearance with documented resolution of splenomegaly",
      "Educate patients and families about the self-limiting nature of mononucleosis (fatigue may persist 2 to 6 months), transmission prevention (no kissing, no sharing utensils or drinking containers), and symptoms requiring emergency evaluation (sudden severe left upper quadrant pain, lightheadedness, syncope)"
    ],
    nursingActions: [
      "Assess vital signs every 4 hours during acute illness with particular attention to temperature trends, heart rate (tachycardia may indicate dehydration, anemia, or splenic hemorrhage), and blood pressure (hypotension may indicate hemorrhage)",
      "Perform abdominal assessment at each shift, palpating gently for splenic tenderness and enlargement; report any new or worsening left upper quadrant pain, Kehr sign (left shoulder pain suggesting diaphragmatic irritation from splenic pathology), or signs of peritoneal irritation immediately",
      "Monitor intake and output; encourage oral fluid intake of at least 2 to 3 liters per day; administer IV fluids as ordered for patients unable to maintain adequate oral hydration due to severe pharyngitis",
      "Assess oropharynx for degree of tonsillar enlargement, presence of exudates, uvular deviation, and signs of peritonsillar abscess; report any signs of airway compromise (stridor, drooling, inability to swallow, muffled 'hot potato' voice) immediately",
      "Provide comfort measures for pharyngitis: salt water gargles, throat lozenges, cool liquids, soft bland diet, and analgesics as prescribed; elevate head of bed 30 to 45 degrees to reduce pharyngeal edema",
      "Monitor for neurological complications: headache with nuchal rigidity (meningitis), ascending weakness (Guillain-Barre syndrome), cranial nerve deficits, and altered mental status; report any neurological changes immediately",
      "Reinforce activity restrictions at every encounter and document patient and family understanding using teach-back method; emphasize that splenic rupture can occur even with minimal trauma and may be fatal"
    ],
    assessmentFindings: [
      "Classic triad of infectious mononucleosis: fever (temperature 38.3 to 40 degrees Celsius, lasting 1 to 2 weeks), pharyngitis (severe sore throat with tonsillar exudates, often described as the worst sore throat of the patient's life), and lymphadenopathy (bilateral posterior cervical chain most characteristic, also anterior cervical, axillary, and inguinal)",
      "Splenomegaly: palpable spleen tip below the left costal margin (present in 50 to 60 percent of cases); tenderness in the left upper quadrant; patients may report a feeling of fullness or pressure in the left abdomen",
      "Hepatomegaly and hepatitis: right upper quadrant tenderness, elevated liver enzymes (AST, ALT), jaundice in approximately 5 to 10 percent of cases",
      "Fatigue: profound exhaustion that is often the most debilitating symptom, typically lasting 2 to 4 weeks acutely but may persist for 2 to 6 months in some patients",
      "Skin rash: occurs in approximately 5 percent of uncomplicated cases spontaneously; however, a diffuse, pruritic, maculopapular rash appears in 70 to 100 percent of patients who receive ampicillin or amoxicillin during the illness",
      "Periorbital edema: bilateral swelling around the eyes, occurring in approximately 30 percent of cases and sometimes the earliest recognizable clinical sign",
      "Palatal petechiae: small hemorrhagic spots on the soft palate at the junction of the hard and soft palate, present in approximately 25 to 50 percent of cases and considered a classic though not pathognomonic finding"
    ],
    signs: {
      left: [
        "Low-grade fever with sore throat and mild cervical lymphadenopathy",
        "Fatigue and malaise with decreased activity tolerance",
        "Mild pharyngeal erythema with small tonsillar exudates",
        "Bilateral posterior cervical lymph node enlargement (shotty nodes)",
        "Mild appetite reduction with difficulty swallowing solids",
        "Periorbital edema (puffy eyelids, particularly in the morning)"
      ],
      right: [
        "Sudden severe left upper quadrant abdominal pain with rebound tenderness (suspect splenic rupture -- surgical emergency)",
        "Kehr sign: referred left shoulder pain indicating diaphragmatic irritation from splenic hemorrhage",
        "Stridor, drooling, or inability to swallow indicating airway obstruction from massive tonsillar enlargement",
        "Signs of hemorrhagic shock: tachycardia, hypotension, pallor, diaphoresis, altered mental status (splenic rupture with intraperitoneal hemorrhage)",
        "Ascending bilateral weakness with areflexia (Guillain-Barre syndrome complication)",
        "Severe jaundice with coagulopathy indicating acute hepatic failure"
      ]
    },
    medications: [
      {
        name: "Acyclovir (Zovirax)",
        type: "Antiviral (nucleoside analogue)",
        action: "Selectively phosphorylated by viral thymidine kinase and subsequently by cellular enzymes to the active triphosphate form, which competitively inhibits viral DNA polymerase and incorporates into the growing viral DNA chain, causing chain termination; active against herpesviruses including EBV, though clinical benefit in uncomplicated infectious mononucleosis is limited",
        sideEffects: "Nausea, vomiting, diarrhea, headache; nephrotoxicity (crystalline nephropathy) with IV administration if patient is dehydrated; neurotoxicity (tremors, confusion, hallucinations) in renal impairment",
        contra: "Known hypersensitivity to acyclovir or valacyclovir; use with caution in renal impairment (dose adjustment required based on creatinine clearance); ensure adequate hydration during IV administration to prevent crystalline nephropathy",
        pearl: "Acyclovir reduces EBV oropharyngeal shedding during treatment but does NOT shorten the clinical course of uncomplicated infectious mononucleosis; it may be considered for severe EBV complications such as EBV encephalitis, EBV-associated hemophagocytic lymphohistiocytosis, or chronic active EBV infection in immunocompromised patients"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis to lower the hypothalamic set point for temperature regulation (antipyretic effect) and modulating pain perception pathways; preferred over NSAIDs in mononucleosis because it does not affect platelet function (important given thrombocytopenia risk) and has no risk of splenic bleeding",
        sideEffects: "Hepatotoxicity at doses exceeding recommended maximum (greater than 4 grams per day in healthy adults); nausea; allergic reaction (rare); may mask fever as an indicator of disease progression",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use (increased hepatotoxicity risk); maximum dose should be reduced to 2 grams per day in patients with liver disease or concurrent EBV hepatitis",
        pearl: "Acetaminophen is the preferred analgesic and antipyretic in infectious mononucleosis because EBV hepatitis is common (elevated transaminases in up to 80 percent of cases) and NSAIDs carry additional risk of bleeding in patients with thrombocytopenia; monitor liver function tests and adjust dosing accordingly"
      },
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Binds intracellular glucocorticoid receptors and modulates gene transcription to suppress inflammatory and immune responses; reduces tonsillar and lymphoid tissue swelling, suppresses autoimmune hemolysis and thrombocytopenia, and decreases airway edema in cases of impending obstruction",
        sideEffects: "Hyperglycemia, insomnia, mood changes, increased appetite, gastric irritation, immunosuppression (may prolong viral shedding), fluid retention, hypertension, adrenal suppression with prolonged use",
        contra: "Active systemic fungal infection; use with caution in diabetes mellitus (worsens glycemic control), peptic ulcer disease, and immunocompromised patients; avoid prolonged use due to risk of adrenal suppression",
        pearl: "Corticosteroids are NOT recommended for routine treatment of infectious mononucleosis; indications are limited to specific complications: impending airway obstruction from tonsillar enlargement, autoimmune hemolytic anemia, severe thrombocytopenia with hemorrhage, and myocarditis; typical dose for airway compromise is prednisone 1 mg/kg/day for 5 to 7 days with taper"
      }
    ],
    pearls: [
      "Splenic rupture is the most life-threatening complication of infectious mononucleosis -- enforce strict avoidance of contact sports, heavy lifting, and strenuous activity for at least 3 to 4 weeks or until splenomegaly is confirmed resolved",
      "The ampicillin/amoxicillin rash occurs in 70 to 100 percent of mononucleosis patients who receive these antibiotics -- always check for suspected mononucleosis before prescribing aminopenicillins for pharyngitis in adolescents and young adults",
      "The Monospot test may be falsely negative in the first week of illness and in children under 4 years of age -- if clinical suspicion is high, obtain EBV-specific serology (VCA-IgM, VCA-IgG, EA, EBNA) for definitive diagnosis",
      "Atypical lymphocytes (greater than 10 percent on peripheral smear) are the hallmark hematological finding of infectious mononucleosis -- these are activated cytotoxic T lymphocytes (CD8+ cells) responding to EBV-infected B lymphocytes, not the infected cells themselves",
      "Kehr sign (referred left shoulder pain) in a patient with mononucleosis is a critical warning sign suggesting diaphragmatic irritation from splenic hemorrhage -- report immediately and prepare for emergency intervention",
      "EBV hepatitis occurs in up to 80 percent of mononucleosis cases (elevated transaminases) -- advise patients to avoid alcohol and hepatotoxic medications; reduce acetaminophen maximum to 2 grams per day until liver enzymes normalize",
      "EBV establishes lifelong latency in B lymphocytes -- the virus is never eliminated from the body, and periodic asymptomatic shedding in saliva can occur throughout life, making prevention of primary transmission challenging"
    ],
    quiz: [
      {
        question: "A 19-year-old college student diagnosed with infectious mononucleosis asks when he can return to playing rugby. What is the most appropriate nursing response?",
        options: [
          "You can return to rugby once your fever has resolved",
          "You can return to rugby in one week if you feel better",
          "You must avoid contact sports for at least 3 to 4 weeks and until your physician confirms your spleen has returned to normal size",
          "You can return to rugby when your sore throat resolves"
        ],
        correct: 2,
        rationale: "Contact sports must be avoided for a minimum of 3 to 4 weeks from illness onset and until splenomegaly is confirmed resolved (typically by ultrasound) because splenic rupture can occur even with minimal abdominal trauma during the period of splenomegaly. Splenic rupture is the most life-threatening acute complication of infectious mononucleosis."
      },
      {
        question: "A patient with suspected infectious mononucleosis is prescribed amoxicillin for pharyngitis. The practical nurse should take which action?",
        options: [
          "Administer the amoxicillin as prescribed without question",
          "Question the order and notify the prescriber that amoxicillin is contraindicated in suspected mononucleosis due to the high risk of rash",
          "Hold the medication until blood cultures return",
          "Administer the amoxicillin with an antihistamine to prevent the rash"
        ],
        correct: 1,
        rationale: "Administering ampicillin or amoxicillin to patients with infectious mononucleosis causes a diffuse maculopapular rash in 70 to 100 percent of cases. The practical nurse should question this order and notify the prescriber. If antibiotic therapy is needed for concurrent bacterial pharyngitis, azithromycin is the preferred alternative."
      },
      {
        question: "A patient with infectious mononucleosis reports sudden, severe pain in the left upper abdomen with radiation to the left shoulder. The practical nurse should recognize this as which potential complication?",
        options: [
          "EBV hepatitis with liver enlargement",
          "Peritonsillar abscess formation",
          "Splenic rupture with diaphragmatic irritation (Kehr sign)",
          "Autoimmune hemolytic anemia"
        ],
        correct: 2,
        rationale: "Sudden severe left upper quadrant pain with referred left shoulder pain (Kehr sign) in a patient with mononucleosis suggests splenic rupture with intraperitoneal hemorrhage causing diaphragmatic irritation. This is a surgical emergency requiring immediate notification of the physician, IV access, and preparation for possible surgical intervention."
      }
    ]
  },

  "hand-foot-mouth-disease-rpn": {
    title: "Hand, Foot, and Mouth Disease for Practical Nurses",
    cellular: {
      title: "Virology and Pathophysiology of Hand, Foot, and Mouth Disease",
      content: "Hand, foot, and mouth disease (HFMD) is a common, highly contagious viral illness caused primarily by enteroviruses, most frequently Coxsackievirus A16 (the most common cause in North America and Europe) and Enterovirus 71 (EV-A71, more commonly associated with severe neurological complications in the Asia-Pacific region). Other causative agents include Coxsackievirus A6 (associated with more extensive and atypical rash presentations), Coxsackievirus A10, and other enterovirus serotypes. HFMD predominantly affects children under 5 years of age, with peak incidence between 1 and 3 years, though older children, adolescents, and adults can also be infected. The disease occurs most commonly in summer and early fall in temperate climates but may occur year-round in tropical regions. Transmission occurs through multiple routes: fecal-oral route (the primary mode, through contact with stool from infected individuals), direct contact with vesicular fluid from skin lesions, respiratory droplet spread from oropharyngeal secretions, and contact with contaminated surfaces (fomites). The virus can be shed in stool for weeks to months after clinical recovery, which has important implications for infection control in daycare and household settings. The pathophysiology of HFMD begins with viral entry through the oropharyngeal mucosa or intestinal epithelium. After initial replication in the lymphoid tissue of the pharynx (tonsils) and Peyer patches of the small intestine, the virus enters the bloodstream (primary viremia), disseminates to the reticuloendothelial system (liver, spleen, lymph nodes) for further replication, and then undergoes a second viremic phase (secondary viremia) that distributes the virus to target organs including the oral mucosa, skin of the hands and feet, and in severe cases, the central nervous system. The characteristic oral lesions begin as erythematous macules on the buccal mucosa, tongue, hard palate, and gums that progress to vesicles and then painful shallow ulcers (enanthem). These oral ulcers are the primary cause of odynophagia (painful swallowing) and are the main reason children refuse oral intake, leading to the most common complication of HFMD: dehydration. The skin lesions (exanthem) appear as erythematous macules or papules that may evolve into vesicles on an erythematous base, distributed on the palms, soles, dorsal surfaces of hands and feet, and buttocks (particularly in younger children wearing diapers). The lesions are typically 2 to 8 mm in diameter, oval or football-shaped, and surrounded by a thin halo of erythema. They are usually not pruritic and resolve within 7 to 10 days without scarring. Coxsackievirus A6 can cause a more widespread and atypical presentation with larger vesiculobullous lesions extending to the trunk and extremities, perioral distribution, and subsequent nail changes (onychomadesis or nail shedding occurring 3 to 8 weeks after illness). The most concerning complication of HFMD, particularly when caused by Enterovirus 71, is neurological involvement. EV-A71 has a predilection for the central nervous system and can cause aseptic meningitis, brainstem encephalitis (rhombencephalitis), acute flaccid paralysis (similar to poliomyelitis), and cardiopulmonary failure from neurogenic pulmonary edema. Brainstem encephalitis is the most severe neurological complication and can be rapidly fatal; clinical features include myoclonus (brief involuntary muscle jerks), tremor, ataxia, cranial nerve palsies, and autonomic instability (fluctuating blood pressure and heart rate). The practical nurse must be vigilant for these neurological warning signs, particularly during HFMD outbreaks, as early recognition and supportive care can be lifesaving."
    },
    riskFactors: [
      "Children under 5 years of age, particularly those between 1 and 3 years, due to immature immune systems and increased hand-to-mouth contact behaviors",
      "Attendance at daycare centers, nurseries, or preschools where close contact and shared toys facilitate fecal-oral and direct contact transmission",
      "Household contacts of infected children, including parents, siblings, and caregivers who may develop symptomatic or asymptomatic infection",
      "Immunocompromised individuals (primary immunodeficiency, HIV, organ transplant recipients) at risk for prolonged, severe, or disseminated enterovirus infection",
      "Summer and early fall seasonality in temperate climates when enterovirus circulation peaks",
      "Poor hand hygiene practices, inadequate diaper changing protocols, and insufficient environmental cleaning in childcare settings",
      "Living in or traveling to Southeast Asian countries where Enterovirus 71 strains associated with severe neurological complications are more prevalent"
    ],
    diagnostics: [
      "Clinical diagnosis: HFMD is primarily diagnosed clinically based on the characteristic combination of fever, oral ulcers, and vesicular rash on the hands, feet, and buttocks; laboratory confirmation is not routinely required for typical cases",
      "Viral culture or RT-PCR from throat swab, vesicle fluid, or stool: identifies the specific enterovirus serotype; most useful during outbreaks to determine if Enterovirus 71 is circulating (implications for severity and public health response)",
      "Complete blood count: typically shows normal or mildly elevated WBC; lymphocyte predominance is common; thrombocytopenia may occur in severe cases",
      "Basic metabolic panel (electrolytes, BUN, creatinine): assesses hydration status and electrolyte balance in children with poor oral intake; elevated BUN-to-creatinine ratio suggests dehydration",
      "Lumbar puncture and cerebrospinal fluid analysis: indicated when neurological complications are suspected (meningitis, encephalitis); typical findings in viral meningitis include lymphocytic pleocytosis, normal or slightly elevated protein, and normal glucose",
      "MRI of brain and brainstem: indicated for suspected brainstem encephalitis (rhombencephalitis); may show T2-weighted hyperintensity in the dorsal brainstem, particularly the pons and medulla"
    ],
    management: [
      "Provide supportive care as the primary treatment: there is no specific antiviral therapy for HFMD; management focuses on symptom relief, hydration maintenance, and monitoring for complications",
      "Maintain adequate hydration: offer frequent small volumes of cool, non-acidic fluids (water, milk, ice chips, popsicles); avoid citrus juices and carbonated beverages that irritate oral ulcers; monitor urine output (minimum 1 mL/kg/hour in children) as an indicator of hydration status",
      "Administer analgesics and antipyretics as prescribed: acetaminophen or ibuprofen for fever and pain management; cold foods (ice cream, chilled yogurt, smoothies) may provide additional comfort for oral pain",
      "Apply topical oral pain relief as ordered: viscous lidocaine (diluted, applied sparingly with cotton swab to ulcers in children over 2 years under direct supervision) or combination oral rinses (magic mouthwash containing diphenhydramine, aluminum-magnesium hydroxide, and viscous lidocaine)",
      "Implement contact and droplet precautions in healthcare settings; enforce strict hand hygiene with soap and water (alcohol-based hand sanitizers are less effective against non-enveloped enteroviruses)",
      "Exclude infected children from daycare until fever has resolved and oral lesions have healed sufficiently to prevent drooling; educate parents about the prolonged fecal shedding (weeks to months) requiring ongoing hand hygiene after diaper changes",
      "Monitor for neurological complications, particularly in outbreaks involving Enterovirus 71: report any myoclonus, tremor, ataxia, persistent vomiting, lethargy, or signs of autonomic instability immediately"
    ],
    nursingActions: [
      "Assess hydration status at each encounter: skin turgor, mucous membrane moisture, fontanelle (if applicable), capillary refill time, urine output and concentration, weight comparison to baseline; report signs of moderate to severe dehydration (sunken eyes, decreased urine output, tachycardia, lethargy) immediately",
      "Perform oral assessment to evaluate extent and severity of mucosal ulceration; document number, size, and location of lesions; assess ability to swallow and tolerate oral intake",
      "Monitor temperature and administer antipyretics as prescribed; document temperature trends and report persistent fever beyond 3 to 5 days (may indicate secondary bacterial infection or complication)",
      "Assess skin lesions: document distribution, stage of development (macule, papule, vesicle, crusted), and any signs of secondary bacterial infection (increasing erythema, warmth, purulent drainage, or cellulitis surrounding lesions)",
      "Perform neurological assessment at each encounter during the acute phase: level of consciousness (AVPU or GCS), pupillary response, motor function, gait (if age-appropriate), presence of myoclonus or tremor, and cranial nerve function; report any abnormalities immediately",
      "Educate parents and caregivers about disease course (typically self-limiting within 7 to 10 days), transmission prevention (hand hygiene with soap and water, avoid sharing utensils, disinfect contaminated surfaces and toys), and warning signs requiring emergency evaluation",
      "Implement and reinforce infection control measures: contact precautions with gown and gloves, meticulous hand hygiene with soap and water after all patient contact, enhanced environmental cleaning of surfaces and shared equipment with appropriate disinfectants effective against enteroviruses"
    ],
    assessmentFindings: [
      "Oral enanthem: erythematous macules progressing to vesicles and then shallow painful ulcers (2 to 8 mm) on the buccal mucosa, tongue, hard palate, and gums; ulcers have an erythematous border and grayish-yellow base; child refuses to eat or drink due to pain",
      "Skin exanthem: erythematous macules or papules evolving into vesicles on an erythematous base, characteristically distributed on the palms, soles, dorsal surfaces of the hands and feet, and buttocks (especially in diaper-age children); lesions are oval or football-shaped, non-pruritic, and resolve without scarring",
      "Fever: typically 38.0 to 39.0 degrees Celsius, present for 1 to 3 days; usually the first symptom appearing 3 to 6 days after exposure (incubation period); fever precedes rash onset by 1 to 2 days",
      "Dehydration signs in children: decreased urine output (fewer than 4 to 6 wet diapers per 24 hours in infants), concentrated urine, dry mucous membranes, decreased skin turgor, sunken fontanelle in infants, tachycardia, and lethargy",
      "Irritability and excessive crying in infants and toddlers who cannot verbalize oral pain; drooling (inability to swallow saliva due to pain from oral ulcers)",
      "Coxsackievirus A6 atypical presentation: more extensive and larger vesiculobullous lesions that may extend beyond the classic distribution to include the trunk, extremities, and perioral area; subsequent onychomadesis (painless nail shedding) occurring 3 to 8 weeks after illness"
    ],
    signs: {
      left: [
        "Low-grade fever (38.0 to 38.5 degrees Celsius) with mild malaise",
        "Few scattered vesicular lesions on palms or soles without pain",
        "Mild oral erythema with minimal impact on oral intake",
        "Child is active and playful with adequate urine output",
        "Parent reports mild decrease in appetite over 1 to 2 days",
        "Mild irritability related to discomfort from oral lesions"
      ],
      right: [
        "Persistent high fever (above 39.5 degrees Celsius) beyond 3 days or recurrence of fever after initial resolution",
        "Signs of moderate to severe dehydration (sunken fontanelle, absent tears, decreased urine output, tachycardia, lethargy)",
        "Myoclonus (sudden involuntary muscle jerks), tremor, or ataxia suggesting brainstem encephalitis (Enterovirus 71 neurological complication)",
        "Persistent vomiting with inability to tolerate any oral fluids requiring IV hydration",
        "Signs of secondary bacterial skin infection (expanding erythema, warmth, purulent drainage, cellulitis) surrounding vesicular lesions",
        "Altered level of consciousness, seizures, or acute flaccid paralysis indicating central nervous system involvement"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol/Tempra)",
        type: "Analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis and lowering the hypothalamic thermoregulatory set point (antipyretic effect) and modulating pain perception (analgesic effect); preferred first-line agent for fever and pain in children with HFMD",
        sideEffects: "Hepatotoxicity at doses exceeding recommended maximum; nausea, vomiting (rare at therapeutic doses); allergic skin reactions (rare)",
        contra: "Severe hepatic impairment or active liver disease; weight-based dosing must be calculated accurately in pediatric patients (10 to 15 mg/kg/dose every 4 to 6 hours, maximum 5 doses per day); do not exceed 75 mg/kg/day or 4 grams/day",
        pearl: "Always calculate pediatric acetaminophen dose by weight (not age) using 10 to 15 mg/kg/dose; verify concentration of liquid formulation (infant drops vs. children's suspension have different concentrations); educate parents to use the measuring device provided with the product, not household teaspoons"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits both COX-1 and COX-2 enzymes, reducing prostaglandin synthesis to produce antipyretic, analgesic, and anti-inflammatory effects; provides longer duration of fever control (6 to 8 hours) compared to acetaminophen (4 to 6 hours) and may be more effective for pain associated with oral mucosal inflammation",
        sideEffects: "GI irritation (nausea, abdominal pain, gastritis), renal impairment (particularly in dehydrated patients), increased bleeding risk; allergic reactions including bronchospasm in aspirin-sensitive patients",
        contra: "Infants under 6 months of age; significant dehydration (risk of acute kidney injury); active GI bleeding; known allergy to NSAIDs or aspirin; use with caution in patients with renal impairment, asthma, or bleeding disorders",
        pearl: "Do NOT administer ibuprofen to dehydrated children -- ensure adequate hydration first, as NSAIDs can cause acute kidney injury in the dehydrated state; pediatric dose is 5 to 10 mg/kg/dose every 6 to 8 hours; can be alternated with acetaminophen for persistent fever, but educate parents carefully to avoid dosing errors when alternating two medications"
      },
      {
        name: "Viscous Lidocaine 2% (topical oral anesthetic)",
        type: "Local anesthetic (amide type)",
        action: "Blocks sodium channels in sensory nerve fibers of the oral mucosa, preventing pain signal transmission and providing temporary topical analgesia to painful oral ulcers; onset of action within 2 to 5 minutes with duration of 15 to 30 minutes",
        sideEffects: "Numbness of the tongue and oropharynx (aspiration risk), systemic absorption leading to CNS toxicity (drowsiness, confusion, seizures) and cardiac toxicity (bradycardia, arrhythmias) if excessive amounts are swallowed; local tissue irritation",
        contra: "Children under 2 years of age (FDA warning due to serious adverse events including seizures and death from inadvertent overdose); known allergy to amide-type local anesthetics; should not be used in patients with swallowing difficulties as numbness increases aspiration risk",
        pearl: "If prescribed for children over 2 years, apply sparingly with a cotton swab directly to ulcers rather than swishing and spitting; use the lowest effective dose and do not exceed recommended frequency; supervise closely after application due to numbness-related aspiration risk; combination oral rinses (magic mouthwash) may be preferred alternatives in some facilities"
      }
    ],
    pearls: [
      "HFMD is primarily a clinical diagnosis based on the characteristic triad of fever, oral ulcers, and vesicular rash on the hands, feet, and buttocks -- laboratory confirmation is not routinely needed for typical cases",
      "Dehydration from poor oral intake is the MOST COMMON complication of HFMD in children -- aggressive oral hydration with cool, non-acidic fluids is the priority intervention; monitor urine output closely",
      "Alcohol-based hand sanitizers are LESS effective against non-enveloped enteroviruses -- soap and water hand washing is the preferred hand hygiene method for HFMD infection control",
      "Enterovirus 71 (EV-A71) is associated with the most severe neurological complications including brainstem encephalitis, acute flaccid paralysis, and neurogenic pulmonary edema -- be vigilant for myoclonus, tremor, ataxia, and altered consciousness during outbreaks",
      "Fecal viral shedding continues for weeks to months after clinical recovery, making ongoing hand hygiene after diaper changes essential to prevent household and daycare transmission even after symptoms resolve",
      "Do NOT administer ibuprofen to dehydrated children -- NSAIDs can cause acute kidney injury in the setting of dehydration; ensure adequate hydration status before NSAID administration",
      "Onychomadesis (painless nail shedding) occurring 3 to 8 weeks after HFMD is a recognized sequela, particularly associated with Coxsackievirus A6; reassure parents that nails will regrow normally without treatment"
    ],
    quiz: [
      {
        question: "A 2-year-old child in daycare is diagnosed with hand, foot, and mouth disease. The child is refusing to drink due to painful oral ulcers. Which nursing intervention should be prioritized?",
        options: [
          "Administer prescribed antibiotics to treat the viral infection",
          "Offer cool, non-acidic fluids in small frequent amounts and monitor urine output for signs of dehydration",
          "Apply viscous lidocaine liberally to all oral lesions every hour",
          "Restrict all oral intake until the oral ulcers heal completely"
        ],
        correct: 1,
        rationale: "Dehydration from poor oral intake is the most common complication of HFMD. The priority intervention is to maintain hydration by offering cool, non-acidic fluids in small frequent amounts and closely monitoring urine output. Antibiotics are ineffective against viral infections. Restricting oral intake would worsen dehydration. Excessive lidocaine application poses toxicity and aspiration risks."
      },
      {
        question: "A practical nurse is caring for a child with HFMD during a known Enterovirus 71 outbreak. Which assessment finding requires immediate reporting to the physician?",
        options: [
          "Vesicular lesions on the palms and soles",
          "Fever of 38.5 degrees Celsius",
          "Myoclonus (sudden involuntary muscle jerks) and unsteady gait",
          "Mild decrease in appetite"
        ],
        correct: 2,
        rationale: "Myoclonus and ataxia (unsteady gait) are warning signs of brainstem encephalitis (rhombencephalitis), the most severe neurological complication of Enterovirus 71 infection. This requires immediate physician notification as it can progress rapidly to cardiopulmonary failure. Vesicular lesions, mild fever, and decreased appetite are expected findings in HFMD."
      },
      {
        question: "Which hand hygiene method is MOST effective for preventing transmission of hand, foot, and mouth disease in a daycare setting?",
        options: [
          "Alcohol-based hand sanitizer applied for 20 seconds",
          "Hand washing with soap and water for at least 20 seconds",
          "Wiping hands with antibacterial wipes",
          "Using gloves without hand washing"
        ],
        correct: 1,
        rationale: "Enteroviruses are non-enveloped viruses, making them resistant to alcohol-based hand sanitizers. Soap and water hand washing for at least 20 seconds is the most effective method for removing enteroviruses from hands. This is particularly important after diaper changes, before food preparation, and after contact with oral secretions or vesicular fluid."
      }
    ]
  }
};

let ok = 0;
let skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else skip++;
}
console.log(`Done: ${ok} injected, ${skip} skipped`);
