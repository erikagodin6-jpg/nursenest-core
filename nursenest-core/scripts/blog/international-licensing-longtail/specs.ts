import type { InternationalLicensingTopicSpec } from "./types";
import {
  buildAustraliaObaTopic,
  buildCanadaNclexProvincial,
  buildGlobalCrossCuttingTopic,
  buildIndiaIncOverseasTopic,
  buildMiddleEastAuthorityTopic,
  buildNewZealandCapTopic,
  buildPhilippinesPnleTopic,
  buildUkNmcTopic,
  buildUsNclexTopic,
} from "./spec-builders";

function ca(
  slug: string,
  province: string,
  regulator: string,
  authorityUrl: string,
  extraOverview: string,
): InternationalLicensingTopicSpec {
  const short = regulator.replace(/\s*\([^)]+\)\s*$/, "").trim();
  return buildCanadaNclexProvincial(
    slug,
    `NCLEX-RN registration orientation for internationally educated nurses: ${province} (${short})`,
    province,
    regulator,
    authorityUrl,
    `Educational overview for IENs comparing ${province} registration themes with NCLEX-RN preparation, document timing, and clinical judgment study priorities.`,
    `NCLEX-RN and ${short}: IEN registration overview (${province})`,
    `Plan NCLEX-RN study alongside ${province} regulator requirements, clinical judgment drills, and document verification timelines for internationally educated nurses.`,
    extraOverview,
  );
}

export function getInternationalLicensingLongtailSpecs(): InternationalLicensingTopicSpec[] {
  const specs: InternationalLicensingTopicSpec[] = [];

  specs.push(
    ca(
      "intl-canada-nclex-rn-ontario-cno-ien-registration-overview",
      "Ontario",
      "College of Nurses of Ontario (CNO)",
      "https://www.cno.org/en/become-a-nurse/registration-tools-and-resources/internationally-educated-nurses/",
      "Ontario remains a high-volume destination for IENs; the CNO pathway emphasizes evidence of safe practice, language proficiency where required, and completion of NCLEX-RN where applicable before registration.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-british-columbia-bccnm-ien-overview",
      "British Columbia",
      "British Columbia College of Nurses and Midwives (BCCNM)",
      "https://www.bccnm.ca/Registration/BecomeANurse/",
      "British Columbia combines nursing and midwifery regulation under BCCNM; IENs should read both RN entry requirements and any practice readiness expectations published for their cohort.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-alberta-crna-ien-overview",
      "Alberta",
      "College of Registered Nurses of Alberta (CRNA)",
      "https://www.nurses.ab.ca/becoming-a-nurse/",
      "Alberta’s college emphasizes competence and conduct standards aligned with provincial law; map your gap analysis results to focused study on acute care priorities common in NCLEX-style items.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-manitoba-ien-registration-overview",
      "Manitoba",
      "College of Registered Nurses of Manitoba (CRNM)",
      "https://www.manitobanurses.ca/",
      "Manitoba pathways may include additional learning if your education or practice gap analysis indicates need; treat those assignments as part of your safety competency portfolio, not as unrelated busywork.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-saskatchewan-ien-registration-overview",
      "Saskatchewan",
      "College of Registered Nurses of Saskatchewan (CRNS)",
      "https://www.crns.ca/",
      "Saskatchewan’s rural and remote contexts appear often in clinical judgment practice; prioritize sepsis, maternity emergencies, and transport decision communication.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-nova-scotia-ien-registration-overview",
      "Nova Scotia",
      "College of Registered Nurses of Nova Scotia (CRNS)",
      "https://www.crnns.ca/",
      "Nova Scotia emphasizes professional accountability and continuing competence; align your study plan with public health and community nursing themes that surface frequently in Canadian practice exams.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-new-brunswick-ien-registration-overview",
      "New Brunswick",
      "Nurses Association of New Brunswick (NANB)",
      "https://www.nanb.nb.ca/",
      "New Brunswick registration materials should be read alongside any bilingual service expectations; confirm language evidence requirements directly from NANB pages.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-newfoundland-labrador-ien-overview",
      "Newfoundland and Labrador",
      "College of Registered Nurses of Newfoundland and Labrador (CRNNL)",
      "https://www.crnnl.ca/",
      "Atlantic Canada employers may include smaller hospitals with blended roles; practice prioritization scenarios where the nurse must stabilize and coordinate transfer.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-prince-edward-island-ien-overview",
      "Prince Edward Island",
      "College of Registered Nurses of Prince Edward Island (CRNPEI)",
      "https://www.crnpei.ca/",
      "PEI’s smaller regulatory volume can still have seasonal processing peaks; submit documents early before summer relocation windows.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-quebec-oiiq-international-nurse-overview",
      "Quebec",
      "Ordre des infirmières et infirmiers du Québec (OIIQ)",
      "https://www.oiiq.org/",
      "Quebec has distinct language and regulatory frameworks; internationally educated nurses should read OIIQ pathways for French proficiency, bridging programmes, and any exam components applicable to their category.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-northwest-territories-ien-overview",
      "Northwest Territories",
      "Registered Nurses Association of Northwest Territories and Nunavut (RNANT/NU)",
      "https://www.rnantnu.ca/",
      "Northern practice contexts amplify aeromedical transport, cold exposure injuries where relevant, and culturally safe care with Indigenous communities; integrate those themes into judgment practice.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-nunavut-ien-registration-overview",
      "Nunavut",
      "Registered Nurses Association of Northwest Territories and Nunavut (RNANT/NU)",
      "https://www.rnantnu.ca/",
      "Nunavut staffing often relies on fly-in rotations; exam preparation should still emphasize universal safety priorities while respecting community-specific policies you will learn during orientation.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-nclex-rn-yukon-ien-registration-overview",
      "Yukon",
      "Yukon Registered Nurses Association (YRNA)",
      "https://www.yrna.ca/",
      "Yukon registration steps should be verified on the official territorial association pages; combine regulatory reading with remote nursing triage practice items.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-nclex-rn-national-ien-document-evaluation-nnas-overview",
      "NNAS credential evaluation for Canadian nursing regulators: educational overview for IENs",
      "Canada (national service)",
      "National Nursing Assessment Service (NNAS) for Canadian regulators",
      "https://nnas.ca/",
      "Understand how NNAS fits between your school documents and provincial college review before NCLEX-RN authorization and registration decisions.",
      "NNAS for Canadian IEN registration: what to expect",
      "Learn how NNAS document evaluation supports provincial nursing colleges and how to parallel NCLEX-RN preparation without losing months to administrative gaps.",
      "NNAS is a shared service many Canadian regulators use to structure international academic and registration documents into an comparable report. It is not an exam; it is an administrative gateway that affects when your provincial college can finalize gap analysis and next steps such as refresher education or NCLEX eligibility communication.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-nclex-rn-historical-crne-transition-ien-guide",
      "Canada (historical context)",
      "Canadian Council of Registered Nurse Regulators historical context and current NCLEX-RN",
      "https://www.councilofnurses.ca/",
      "Accurate historical framing: Canada transitioned RN entry assessment to NCLEX-RN; avoid outdated CRNE study plans while respecting why older forum posts still mention CRNE.",
      "From CRNE history to NCLEX-RN: Canadian IEN exam framing",
      "Understand the Canadian RN exam transition context so IENs do not follow obsolete CRNE resources while preparing for NCLEX-RN and provincial registration.",
      "Until the national transition to NCLEX-RN, many provinces used the Canadian Registered Nurse Examination (CRNE) as part of RN entry. That history matters because some mentors still reference CRNE pacing even though current candidates must align with NCLEX-RN item types and the NCSBN test plan. Use historical awareness to filter advice, not to study retired exam formats.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-rex-pn-practical-nurse-registration-exam-overview",
      "Canada",
      "Canadian practical nurse regulatory exams (REx-PN / provincial pathways)",
      "https://www.ncsbn.org/exams/rex-pn",
      "Practical nursing candidates in Canada should verify whether REx-PN applies in their jurisdiction and how provincial colleges define eligibility and bridging.",
      "REx-PN and Canadian practical nurse registration overview",
      "Educational orientation for Canadian PN candidates comparing REx-PN preparation with provincial college requirements and clinical judgment expectations.",
      "Practical nursing regulation remains provincial. Some jurisdictions use the REx-PN while others may use alternate assessments depending on timing and policy. Always read your college’s practical nurse pages alongside NCSBN materials for REx-PN so you are not mixing RN and PN item styles accidentally.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-cpnre-practical-nurse-exam-educational-overview",
      "Canada",
      "Canadian Practical Nurse Registration Examination (CPNRE) historical and jurisdictional context",
      "https://www.cpnre.ca/",
      "CPNRE may still appear in older study guides; confirm whether your province still uses CPNRE or has moved to REx-PN before purchasing expensive materials.",
      "CPNRE context for Canadian PN licensure preparation",
      "Understand CPNRE versus evolving PN exam options in Canada and how to study safely without relying on obsolete exam labels.",
      "The CPNRE brand remains recognizable in study communities, but exam migration toward REx-PN means you must confirm your regulator’s current authorized examination. Educational strategy still centers on safe PN scope, chronic disease, gerontology, mental health, and community care priorities.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-ncas-nursing-assessment-supplement-education-overview",
      "British Columbia (NCAS context)",
      "Nursing Community Assessment Service (NCAS) — BC assessment context",
      "https://www.ncasbc.ca/",
      "NCAS provides supplemental assessment services used in some Canadian pathways; treat results as a study map for remediation rather than as a personal judgment of your worth.",
      "NCAS supplemental assessment: study implications for IENs",
      "Learn how NCAS-style assessments can shape bridging priorities while you continue NCLEX-RN preparation and communication practice.",
      "NCAS offers standardized assessment options that some regulatory pathways reference when determining whether additional education or practice is needed. Results should guide focused remediation in communication, clinical skills, or professional accountability domains rather than random topic surfing.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-care-practice-readiness-bc-ien-educational-overview",
      "British Columbia",
      "CARE Centre practice readiness supports (educational; verify current programmes)",
      "https://www.care4nurses.ca/",
      "Practice readiness programmes can accelerate confidence; combine them with NurseNest drills for clinical judgment under time pressure.",
      "CARE Centre practice readiness themes for BC IENs",
      "Educational overview of practice readiness supports sometimes used by IENs in British Columbia alongside regulator requirements.",
      "Non-regulatory practice readiness organizations can help with communication, resume conventions, and simulation practice. They do not replace BCCNM decisions; treat them as coaching layers while your official pathway remains defined by the college and any authorized assessment providers.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-celban-nursing-english-test-overview",
      "Canada",
      "CELBAN English assessment for nursing (where accepted)",
      "https://www.celban.org/",
      "CELBAN is healthcare-context English testing accepted by some regulators; pair it with clinical judgment practice in English even if your first language is strong.",
      "CELBAN overview for Canadian nursing registration preparation",
      "Plan CELBAN preparation alongside NCLEX-RN study when your regulator lists CELBAN as an acceptable English evidence option.",
      "CELBAN uses scenarios closer to nursing communication than general academic tests, which can make it attractive for IENs. Still verify score thresholds on your regulator list and schedule early because seating can be limited in some regions.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-ien-bridging-program-competency-refresher-overview",
      "Canada",
      "Provincial bridging and refresher programmes (varies)",
      "https://nnas.ca/",
      "Bridging courses teach Canadian documentation, ethics, and skills gaps identified in your assessment; take detailed notes that become flashcards for exam week.",
      "Canadian IEN bridging and refresher programmes: exam linkage",
      "Understand how bridging assignments connect to NCLEX-RN clinical judgment expectations and provincial scope education.",
      "Bridging programmes are not merely paperwork delays; they are structured competence recovery when gap analysis shows differences between your training and Canadian entry-to-practice competencies. Engage actively because bridging assignments often preview the same safety themes NCLEX rewards.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-nurse-practitioner-exam-context-educational-overview",
      "Canada",
      "Nurse practitioner licensure (provincial; exam components vary)",
      "https://www.councilofnurses.ca/",
      "NP routes are separate from RN NCLEX; this orientation helps IENs avoid confusing RN and NP application materials.",
      "Canadian nurse practitioner registration: educational context for IENs",
      "High-level orientation to Canadian NP registration complexity for IENs who may hold advanced practice abroad.",
      "Canada’s nurse practitioner designation is regulated provincially with additional graduate education and examination expectations that differ from RN NCLEX-RN. If you were an advanced practitioner overseas, still assume you must meet Canadian graduate credentials unless a regulator publishes a rare equivalency pathway.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-licensed-practical-nurse-scope-vs-rn-scope-exam-prep",
      "Canada",
      "Practical nurse versus registered nurse scope (educational comparison)",
      "https://www.ncsbn.org/",
      "PN versus RN scope questions appear on exams and in orientation; learn delegation boundaries before you sit either test.",
      "Canadian PN versus RN scope: licensing exam preparation lens",
      "Clarify Canadian PN and RN scope differences to avoid dangerous delegation errors on exams and in future practice.",
      "Canadian practice distinguishes clearly between practical nursing and registered nursing scopes. Exam items may test which tasks can be delegated, what requires an RN assessment first, and how to supervise assistive personnel safely.",
    ),
  );
  specs.push(
    buildCanadaNclexProvincial(
      "intl-canada-compact-nursing-mobility-us-license-endorsement-overview",
      "Canada–United States crosswalk (educational)",
      "Nurse Licensure Compact (NLC) contrasted with Canadian provincial registration",
      "https://www.ncsbn.org/nurse-licensure-compact.htm",
      "US compact rules do not replace Canadian provincial licensure; this article helps dual-intent candidates organize two playbooks without mixing instructions.",
      "US Nurse Licensure Compact versus Canadian provincial registration",
      "Educational comparison for nurses considering mobility across the Canada–US border without confusing compact rules with Canadian colleges.",
      "The NLC allows multistate practice for eligible US licenses under specific conditions. Canada does not use the NLC; each province remains sovereign for RN registration. If you pursue both countries, maintain two checklists and two primary regulator portals.",
    ),
  );
  specs.push(
    ca(
      "intl-canada-cultural-safety-indigenous-health-ien-exam-prep-overview",
      "Cultural safety and Indigenous health expectations for IENs preparing for Canadian practice (educational)",
      "Canada",
      "Provincial standards of practice referencing cultural safety and anti-Indigenous racism (varies by college)",
      "https://www.cno.org/en/standards-learn/standards-and-guidelines/",
      "Canadian regulatory standards increasingly emphasize culturally safe care, trauma-informed communication, and accountability for addressing systemic barriers. IENs should study the college’s practice standards and any assigned Indigenous health modules as serious professional obligations, not optional soft skills. Exam preparation still requires clinical safety fundamentals, but communication stems may explicitly test respectful engagement, advocacy, and collaboration with Indigenous patients and families.",
    ),
  );

  // United States (25)
  const us = (
    slug: string,
    title: string,
    excerpt: string,
    seoTitle: string,
    seoDescription: string,
    boardHint: string,
    overviewExtra: string,
  ) =>
    buildUsNclexTopic(slug, title, excerpt, seoTitle, seoDescription, boardHint, overviewExtra);

  specs.push(
    us(
      "intl-us-nclex-rn-internationally-educated-nurse-overview",
      "NCLEX-RN for internationally educated nurses: US registration overview",
      "Educational map of CGFNS evaluations, state board applications, ATT, and NCLEX-RN preparation for nurses trained outside the US.",
      "NCLEX-RN for international nurses | US pathway overview",
      "Plan CGFNS verification, state board eligibility, ATT timing, and clinical judgment preparation for NCLEX-RN as an internationally educated nurse.",
      "Your intended US state board of nursing",
      "Start from the board’s international graduate checklist, then align NCSBN test plan study with any state-specific jurisprudence or coursework conditions.",
    ),
  );
  specs.push(
    us(
      "intl-us-next-generation-nclex-clinical-judgment-overview",
      "Next Generation NCLEX (NGN) clinical judgment overview for international candidates",
      "Understand bowtie, trend, and case items as an internationally educated nurse preparing for US licensure exams.",
      "NGN clinical judgment overview for IEN NCLEX candidates",
      "Learn how NGN item types test clinical judgment and how IENs can train safely with timed cases.",
      "NCSBN NGN documentation and your state board",
      "NGN rewards structured thinking: notice risk, act within scope, communicate, and reassess. International candidates benefit from explicit training on case-length stems common in US exams.",
    ),
  );
  specs.push(
    us(
      "intl-us-cgfns-credentials-evaluation-service-overview",
      "CGFNS credentials evaluation for US nursing licensure: educational overview",
      "Understand CES reports, verification timing, and how CGFNS fits before state board approval and NCLEX-RN.",
      "CGFNS credentials evaluation for international nurses",
      "Organize transcripts and registrations for CGFNS services used on many US international routes.",
      "CGFNS international credentials services",
      "CES-type reports summarize your education for boards; they do not replace board decisions. Build buffer weeks for school responses, especially if your institution is slower to verify.",
    ),
  );
  specs.push(
    us(
      "intl-us-visascreen-certificate-overview-educational",
      "VisaScreen® certificate: educational overview for international nurses bound for the US",
      "Separate immigration screening timelines from board exam study so neither surprises you at the last minute.",
      "VisaScreen for international nurses: educational overview",
      "Plan VisaScreen documentation alongside NCLEX preparation without confusing immigration steps with licensure steps.",
      "VisaScreen / CGFNS Alliance guidance",
      "VisaScreen is an immigration-related screening certificate for certain US visa classifications; it is not the NCLEX. Still, delays in primary source verification can affect both threads, so parallelize early.",
    ),
  );
  specs.push(
    us(
      "intl-us-authorization-to-test-att-pearson-vue-overview",
      "Authorization to Test (ATT) and Pearson VUE scheduling for NCLEX-RN",
      "Practical scheduling guidance for international candidates sitting NCLEX-RN in the US or international test centres.",
      "ATT and Pearson VUE NCLEX scheduling tips",
      "Understand ATT windows, name matching on IDs, and rescheduling fees for NCLEX-RN.",
      "Pearson VUE NCLEX candidate services",
      "ATT has a finite validity window; schedule promptly while still leaving time for a retake plan if you need one.",
    ),
  );
  specs.push(
    us(
      "intl-us-california-board-international-nurse-documentation-overview",
      "California Board of Registered Nursing: international nurse documentation themes (educational)",
      "California often publishes detailed international graduate guidance; read for refresher coursework and fingerprinting themes.",
      "California BRN international nurse pathway overview",
      "Educational orientation to common California documentation expectations for international nurses alongside NCLEX-RN prep.",
      "California Board of Registered Nursing",
      "Large states may add unique requirements beyond NCSBN minimums; treat those as additional projects in your timeline.",
    ),
  );
  specs.push(
    us(
      "intl-us-florida-board-international-nurse-english-evidence-overview",
      "Florida Board of Nursing: English proficiency evidence for international candidates (educational)",
      "Verify accepted English tests and scores on the Florida board site rather than relying on outdated charts.",
      "Florida nursing board English requirements overview",
      "Plan English evidence for Florida international nurse applications while studying for NCLEX-RN.",
      "Florida Board of Nursing",
      "English evidence is a common stall point; schedule tests early enough for retakes if needed.",
    ),
  );
  specs.push(
    us(
      "intl-us-new-york-education-verification-international-nurse-overview",
      "New York nursing licensure: CGFNS NY verification program context (educational)",
      "Some international graduates interact with CGFNS before New York licensure steps; confirm current instructions on official sites.",
      "New York international nurse verification overview",
      "Educational notes on CGFNS-related verification sometimes referenced in New York international nurse pathways.",
      "New York State Education Department / nursing profession pages",
      "New York pathways have historically involved specific verification expectations; always read the current memo for your cohort.",
    ),
  );
  specs.push(
    us(
      "intl-us-texas-nursing-jurisprudence-exam-prep-overview",
      "Texas nursing jurisprudence preparation for new licensees (educational)",
      "Jurisprudence exams test law and ethics; study them separately from clinical drills but on the same calendar.",
      "Texas nursing jurisprudence exam study overview",
      "Prepare for Texas jurisprudence expectations alongside NCLEX-RN clinical judgment training.",
      "Texas Board of Nursing",
      "Jurisprudence items reward careful reading of practice acts, delegation rules, and disciplinary processes.",
    ),
  );
  specs.push(
    us(
      "intl-us-illinois-international-nurse-license-application-overview",
      "Illinois international nurse licensure application themes (educational)",
      "Use Illinois IDFPR nursing pages for fingerprinting, education, and NCLEX verification sequencing.",
      "Illinois international nurse licensure overview",
      "Educational orientation for Illinois application sequencing with NCLEX-RN preparation.",
      "Illinois Department of Financial and Professional Regulation (IDFPR)",
      "Midwestern boards still demand meticulous transcript matching; keep course syllabi accessible.",
    ),
  );
  specs.push(
    us(
      "intl-us-nclex-pn-international-candidate-overview",
      "NCLEX-PN for international practical nursing candidates (educational)",
      "PN licensure has distinct scope; align PN test plans with your state board checklist.",
      "NCLEX-PN international candidate overview",
      "Study NCLEX-PN scope, delegation, and community nursing priorities as an international candidate.",
      "Your state board of nursing (PN)",
      "PN exams emphasize chronic care, foundations, and safe delegation under RN supervision contexts.",
    ),
  );
  specs.push(
    us(
      "intl-us-nurse-licensure-compact-nlc-explainer-for-ien",
      "Nurse Licensure Compact (NLC) explainer for internationally educated nurses (educational)",
      "Compact participation is state-specific; verify whether your primary state issues a multistate license.",
      "Nurse Licensure Compact overview for international nurses",
      "Understand compact basics without assuming every US license is multistate.",
      "National Council of State Boards of Nursing (NLC pages)",
      "Multistate privileges depend on meeting compact rules in your primary state of residence; IENs must still satisfy each board’s initial licensure requirements.",
    ),
  );
  specs.push(
    us(
      "intl-us-nclex-fail-remediation-strategy-educational",
      "After a NCLEX-RN fail: ethical remediation planning for international candidates",
      "Use board rules on waiting periods, focused deficit review, and mentor support without shame spirals.",
      "NCLEX-RN fail remediation plan for IENs",
      "Rebuild study systems after a fail with data-driven review and official board waiting rules.",
      "Your state board of nursing candidate bulletin",
      "A fail is statistically common enough that boards publish retake policies; treat it as quality data about item style gaps.",
    ),
  );
  specs.push(
    us(
      "intl-us-state-board-endorsement-license-transfer-overview",
      "US nursing license endorsement between states: educational overview for IENs",
      "Endorsement moves an existing license; it is not a shortcut around initial qualification.",
      "Nursing license endorsement between US states",
      "Understand endorsement versus examination applications after you hold one US license.",
      "Destination state board of nursing",
      "Endorsement still requires verification and sometimes additional courses or fingerprints.",
    ),
  );
  specs.push(
    us(
      "intl-us-international-nclex-test-center-experience-overview",
      "International NCLEX test centres: travel, ID, and anxiety planning (educational)",
      "Pearson VUE centres worldwide have strict ID policies; rehearse check-in steps.",
      "International Pearson VUE NCLEX testing tips",
      "Reduce test-day surprises for international NCLEX appointments with ID and travel planning.",
      "Pearson VUE / NCSBN candidate rules",
      "Name spelling mismatches between passport and application are a preventable failure mode.",
    ),
  );
  specs.push(
    us(
      "intl-us-oet-vs-ielts-nursing-board-english-overview",
      "OET versus IELTS for US nursing board English evidence: educational comparison",
      "Board lists specify acceptable tests and minimums; do not assume interchangeability without verification.",
      "OET vs IELTS for US nursing boards",
      "Pick English tests aligned to your board’s published list as an internationally educated nurse.",
      "Your state board of nursing English proficiency page",
      "OET mirrors healthcare communication more closely, but boards may still prefer specific IELTS modules and scores.",
    ),
  );
  specs.push(
    us(
      "intl-us-refugee-asylee-nursing-credential-pathway-overview",
      "Refugee and asylee nurses: credential pathway stressors in the US (educational)",
      "Document loss, name changes, and interrupted training require creative verification; work with boards patiently.",
      "Refugee nurse US credential pathway overview",
      "Educational orientation to documentation challenges and study continuity for refugee and asylee nurses.",
      "State board of nursing international office contacts",
      "Boards may publish humanitarian guidance; keep primary source verification agencies updated with any legal name documents.",
    ),
  );
  specs.push(
    us(
      "intl-us-military-spouse-nursing-license-portability-overview",
      "Military spouse nursing license portability: educational overview with compact context",
      "PCS moves create urgency; know compact eligibility and temporary permits where law allows.",
      "Military spouse nursing license portability overview",
      "Plan licensure portability across US states when your family receives military relocation orders.",
      "Defense State Liaison Office / state board FAQs",
      "Temporary practice authorities vary; never assume a spouse license transfers automatically.",
    ),
  );
  specs.push(
    us(
      "intl-us-board-nursing-discipline-self-reporting-overview",
      "US board nursing applications: self-reporting discipline and criminal history (educational)",
      "Honesty timelines matter; learn how to gather court documents and explanatory statements without panic.",
      "US nursing board self-reporting educational overview",
      "Understand why boards ask about prior discipline and how IENs should prepare transparent disclosures.",
      "State board of nursing enforcement FAQ pages",
      "Mis-reporting or omitting history is often more serious than the underlying event; follow lawyer advice when needed.",
    ),
  );
  specs.push(
    us(
      "intl-us-academic-credentials-transcript-authentication-overview",
      "International transcript authentication for US boards: educational workflow",
      "Sealed transcripts, English translations, and slow registrar replies are schedule risks.",
      "Transcript authentication for US nursing licensure",
      "Organize school authentication early for US board applications as an international graduate.",
      "Your nursing school registrar and board instructions",
      "Some schools only issue paper transcripts; courier tracking reduces anxiety.",
    ),
  );
  specs.push(
    us(
      "intl-us-nclex-calculator-and-medication-items-overview",
      "NCLEX calculation and medication safety items: international student drill plan",
      "Unit conversions and rounding rules trip many IENs; drill daily in small sets.",
      "NCLEX medication math drill plan",
      "Build safer medication calculation speed for NCLEX-RN and PN items.",
      "NCSBN medication administration test plan emphasis",
      "Use dimensional analysis until it is automatic, then add distraction stems.",
    ),
  );
  specs.push(
    us(
      "intl-us-clinical-placement-documentation-for-boards-overview",
      "Clinical hour documentation for US boards: educational tips for international schools",
      "Hour logs and syllabi should match board templates where provided.",
      "Clinical hour documentation for US nursing boards",
      "Prepare clinical documentation packages that boards can verify without endless back-and-forth.",
      "State board of nursing international graduate checklist",
      "Gap analysis sometimes focuses on pediatrics, psychiatry, or community hours; know your transcript totals.",
    ),
  );
  specs.push(
    us(
      "intl-us-nclex-debrief-journal-method-ien-study-habit",
      "NCLEX debrief journal method for internationally educated nurses",
      "Turn each practice block into structured learning with a three-line debrief.",
      "NCLEX debrief journal method for IENs",
      "Build retention with low-tech journaling alongside digital practice.",
      "Independent study discipline systems",
      "Journals reduce repeated mistakes more than passive rationales.",
    ),
  );
  specs.push(
    us(
      "intl-us-healthcare-english-handoff-drills-for-nclex",
      "Healthcare English handoff drills for NCLEX clinical judgment",
      "Practice SBAR-style handoffs aloud to build speed reading long stems.",
      "SBAR handoff drills for NCLEX preparation",
      "Improve English processing speed for US-style nursing exam narratives.",
      "Joint Commission communication safety themes (educational)",
      "Handoff clarity is both a workplace skill and an exam reading skill.",
    ),
  );
  specs.push(
    us(
      "intl-us-board-nursing-fingerprinting-clearance-overview",
      "Fingerprinting and background clearance for US nursing licensure (educational)",
      "Live scan rejections delay ATT; follow vendor instructions exactly.",
      "US nursing license fingerprinting overview",
      "Plan fingerprint appointments and tracking numbers for board applications.",
      "IdentoGO or state-specified vendor pages",
      "Smudged prints or wrong ORI codes cause silent delays.",
    ),
  );

  // United Kingdom (20)
  const uk = (
    slug: string,
    title: string,
    excerpt: string,
    seoTitle: string,
    seoDescription: string,
    angle: string,
  ) => buildUkNmcTopic(slug, title, excerpt, seoTitle, seoDescription, angle);

  specs.push(
    uk(
      "intl-uk-nmc-test-of-competence-cbt-overview-for-overseas-nurses",
      "NMC Test of Competence computer-based test (CBT) overview for overseas nurses",
      "Plan CBT preparation with official NMC reading lists and judgment-heavy practice.",
      "NMC CBT overview for overseas nurses",
      "Study for the NMC CBT with clinical judgment and UK practice context awareness.",
      "The CBT samples across domains relevant to UK entry practice; combine reading with timed questions and rationale review.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-osce-station-prep-strategy-for-international-nurses",
      "NMC OSCE station preparation strategy for international nurses",
      "Use mark scheme thinking: safety, effectiveness, communication, documentation.",
      "NMC OSCE prep strategy for overseas nurses",
      "Structure OSCE rehearsal with timed circuits and respectful communication habits.",
      "OSCE examiners reward structured assessments and safe skill execution under pressure.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-english-language-requirements-oet-ielts-overview",
      "NMC English language requirements: OET and IELTS overview for international nurses",
      "Confirm accepted tests and grades on NMC pages before paying for classes.",
      "NMC English requirements: OET and IELTS",
      "Match your English evidence plan to NMC-approved tests and validity rules.",
      "NMC lists acceptable tests and combinations; follow the list for your application year.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-good-character-and-health-declaration-overview",
      "NMC good character and health declarations: educational overview for overseas nurses",
      "Declarations are legal attestations; gather police certificates and occupational health forms early.",
      "NMC good character and health declarations overview",
      "Prepare documentation for NMC character and health requirements without last-minute courier stress.",
      "NMC guidance documents for international applicants",
      "Incomplete declarations can pause an otherwise-ready OSCE seat.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-field-specific-competencies-adult-nursing-overview",
      "NMC adult nursing field competencies: exam preparation lens for overseas nurses",
      "Adult nursing emphasizes acute deterioration, comorbidity, and discharge planning.",
      "NMC adult nursing competencies overview",
      "Align study with adult field competencies before CBT and OSCE attempts.",
      "Field-specific learning outcomes shape both tests and future NHS preceptorship.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-mental-nursing-field-competencies-overview",
      "NMC mental health nursing field: competence themes for international nurses",
      "Therapeutic communication, legal frameworks, and safety in agitation are high yield.",
      "NMC mental health nursing field overview",
      "Study UK mental health law themes alongside communication drills for OSCE success.",
      "Mental health fields include legal literacy around detention and capacity in UK contexts.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-child-field-competencies-overview-for-international-nurses",
      "NMC child field nursing competencies overview for international nurses",
      "Family-centered care, safeguarding, and growth-focused assessment appear often.",
      "NMC child field nursing overview",
      "Prepare for child-field CBT and OSCE expectations as an overseas nurse.",
      "Safeguarding is non-negotiable; practice explicit escalation language.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-learning-disabilities-field-overview",
      "NMC learning disabilities nursing field: competence overview for international nurses",
      "Reasonable adjustments, advocacy, and capacity-support communication are central.",
      "NMC learning disabilities nursing field overview",
      "Understand UK learning disability nursing values before selecting field-specific preparation.",
      "Person-centered planning differs from purely biomedical framing; study accordingly.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nhs-preceptorship-for-internationally-educated-nurses-overview",
      "NHS preceptorship for internationally educated nurses: educational overview",
      "Preceptorship supports transition; it is distinct from NMC registration tests.",
      "NHS preceptorship overview for IENs",
      "Plan preceptorship learning goals alongside OSCE preparation for smoother transition.",
      "NHS England preceptorship framework publications",
      "Employers may structure preceptorship differently; ask for a written learning plan.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-revalidation-basics-for-new-registrants-overview",
      "NMC revalidation basics for new registrants: educational orientation",
      "Revalidation is ongoing; start habits for reflective practice and practice hours tracking early.",
      "NMC revalidation basics for new UK nurses",
      "Understand revalidation as a long-term professional responsibility after initial NMC registration.",
      "NMC revalidation microsite guidance",
      "Portfolio discipline begins in year one, not month five before deadline.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-osce-medication-administration-high-yield-safety",
      "NMC OSCE medication administration: high-yield safety themes for international nurses",
      "Rights of medication, infection control, and patient education must appear in your routine.",
      "NMC OSCE medication administration safety",
      "Practice medication checks aloud until they feel automatic under OSCE time pressure.",
      "UK monographs and local policy training will continue after OSCE; examiners want safe universal habits.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-osce-infection-prevention-universal-precautions-overview",
      "NMC OSCE infection prevention: universal precautions overview for international nurses",
      "Hand hygiene moments and PPE sequence are easy marks if rehearsed.",
      "NMC OSCE infection prevention overview",
      "Train PPE donning and doffing with a clock to avoid rushing errors on exam day.",
      "Infection prevention is both patient safety and professional expectation in NHS settings.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-osce-communication-de-escalation-overview",
      "NMC OSCE communication: de-escalation and agitated patient themes",
      "Tone, space, and clear limits matter more than memorized phrases.",
      "NMC OSCE de-escalation communication overview",
      "Practice respectful de-escalation scripts for OSCE-style communication stations.",
      "Examiners notice whether you listen before you persuade.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-osce-pediatric-safeguarding-clue-recognition",
      "NMC OSCE safeguarding clues in child scenarios: educational orientation",
      "Use professional curiosity without jumping to accusations in role-play.",
      "NMC OSCE child safeguarding clue recognition",
      "Prepare for subtle safeguarding stems in child-focused OSCE scenarios.",
      "Safeguarding is multidisciplinary; your role is recognition, documentation, and escalation.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-cbt-pharmacology-high-yield-review-plan",
      "NMC CBT pharmacology high-yield review plan for international nurses",
      "Anticoagulants, insulin, opioids, and antibiotics dominate high-stakes stems.",
      "NMC CBT pharmacology review plan",
      "Organize pharmacology study by mechanism and monitoring rather than brand memorization.",
      "BNF access is workplace-based later; for exams, use reputable course materials aligned to UK practice.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-cbt-acute-deterioration-recognition-study-plan",
      "NMC CBT acute deterioration recognition study plan for international nurses",
      "NEWS2 concepts and escalation pathways appear frequently in UK-oriented preparation.",
      "NMC CBT acute deterioration study plan",
      "Train early warning score thinking for UK acute care exam stems.",
      "Deterioration drills pair well with sepsis, bleeding, and respiratory failure scenarios.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-cbt-ethics-law-boundary-questions-overview",
      "NMC CBT law and ethics boundary questions for international nurses",
      "Consent, capacity, confidentiality, and duty of candour appear as decision points.",
      "NMC CBT law and ethics overview",
      "Study UK legal framing at a nurse-applicable depth for CBT items.",
      "Avoid importing unrelated legal frameworks from other countries when choosing answers.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-nmc-osce-documentation-and-charting-habits-overview",
      "NMC OSCE documentation habits: educational overview for international nurses",
      "Clear concise charting is a scored behavior in many mark schemes.",
      "NMC OSCE documentation overview",
      "Practice SOAP-style rapid charting without sacrificing safety details.",
      "Documentation shows your thinking, not just your handwriting speed.",
    ),
  );
  specs.push(
    uk(
      "intl-uk-international-nurse-bank-shift-readiness-overview",
      "UK bank shifts for international nurses: competence and scope orientation (educational)",
      "Bank work demands rapid orientation to unfamiliar wards; build universal safety habits.",
      "UK bank nursing shift readiness overview",
      "Prepare for flexible NHS staffing models as an internationally educated nurse.",
      "Agency and bank rules vary by trust; always verify induction and supervision.",
    ),
  );

  // Australia (12)
  const au = (
    slug: string,
    title: string,
    excerpt: string,
    seoTitle: string,
    seoDescription: string,
    angle: string,
  ) => buildAustraliaObaTopic(slug, title, excerpt, seoTitle, seoDescription, angle);

  specs.push(
    au(
      "intl-australia-nmba-ahpra-oba-pathway-overview-for-internationally-qualified-nurses",
      "Australia NMBA Ahpra OBA pathway overview for internationally qualified nurses",
      "Orient to MCQ and practical assessment components as described by official Ahpra/NMBA guidance.",
      "Australia OBA pathway for IQNMs",
      "Plan OBA preparation with culturally safe practice and acute care judgment drills.",
      "Australia’s national model means one registration framework with consistent ethical standards.",
    ),
  );
  specs.push(
    au(
      "intl-australia-oba-mcq-study-calendar-12-week-example",
      "Australia OBA MCQ component: example 12-week study calendar (educational)",
      "Rotate systems weekly and include calculations and ECG basics.",
      "OBA MCQ 12-week study calendar example",
      "Use a paced calendar for OBA MCQ preparation as an internationally qualified nurse.",
      "Calendars should include two full-length practice days and one weak-topic half day weekly.",
    ),
  );
  specs.push(
    au(
      "intl-australia-oba-osce-style-practical-prep-overview",
      "Australia OBA practical assessment preparation: educational overview",
      "Rehearse sterile technique, medication checks, and rapid escalation language.",
      "OBA practical assessment prep overview",
      "Build muscle memory for skills stations alongside clinical reasoning speaking habits.",
      "Practical stations often combine skill plus communication plus documentation.",
    ),
  );
  specs.push(
    au(
      "intl-australia-english-evidence-nmba-iqnm-overview",
      "English evidence for NMBA IQNM pathways: educational overview",
      "Verify accepted tests and scores for your cohort on Ahpra pages.",
      "NMBA English evidence overview for IQNMs",
      "Schedule English exams with retake buffers before OBA booking deadlines.",
      "English evidence delays are a preventable reason to lose assessment slots.",
    ),
  );
  specs.push(
    au(
      "intl-australia-culturally-safe-practice-iqnm-study-lens",
      "Culturally safe nursing practice: Australian study lens for IQNMs",
      "Respect Aboriginal and Torres Strait Islander patient priorities and advocacy norms.",
      "Cultural safety for Australian nursing exams",
      "Integrate culturally safe communication into OBA preparation, not as an afterthought.",
      "Cultural safety is a professional competency, not a checkbox quote.",
    ),
  );
  specs.push(
    au(
      "intl-australia-rural-remote-nursing-readiness-for-iqnm",
      "Rural and remote nursing readiness themes for IQNMs in Australia (educational)",
      "Telehealth, retrieval, and low-resource improvisation appear as judgment themes.",
      "Rural remote nursing readiness Australia",
      "Prepare for Australian rural contexts that influence clinical prioritization items.",
      "Even if you test in a city, exam content may reference remote realities.",
    ),
  );
  specs.push(
    au(
      "intl-australia-medication-brand-generic-study-tip-for-iqnm",
      "Australian medication names: generic-first study tip for IQNMs (educational)",
      "Build a crosswalk table from your home country brand names to Australian generics.",
      "Australian medication naming study tip",
      "Reduce medication errors on exams by learning Australian generic naming conventions.",
      "This reduces confusion on stems that use Australian formulary language.",
    ),
  );
  specs.push(
    au(
      "intl-australia-infection-outbreak-isolation-precautions-overview",
      "Australian infection prevention and outbreak precautions: IQNM study overview",
      "Droplet, contact, and airborne precautions appear as clusters.",
      "Infection prevention overview for Australian nursing exams",
      "Train isolation reasoning with Australian guideline references your course provides.",
      "Outbreak communication includes notifying chain of command promptly.",
    ),
  );
  specs.push(
    au(
      "intl-australia-ahpra-notifications-vs-nmba-registration-overview",
      "Ahpra notifications versus NMBA registration: educational distinction for IQNMs",
      "Understand which portal messages require urgent action.",
      "Ahpra vs NMBA portal navigation overview",
      "Avoid missing deadlines by knowing which agency message means what.",
      "Misreading a notification can forfeit an assessment fee window.",
    ),
  );
  specs.push(
    au(
      "intl-australia-iqnm-supervised-practice-context-overview",
      "Supervised practice contexts for IQNMs in Australia: educational orientation",
      "Some pathways include supervised practice expectations; treat them as competency evidence.",
      "IQNM supervised practice overview Australia",
      "Link supervised practice learning objectives to OBA clinical domains.",
      "Supervision is not surveillance; it is structured skill growth.",
    ),
  );
  specs.push(
    au(
      "intl-australia-oba-retake-planning-resilience-overview",
      "OBA retake planning and resilience for internationally qualified nurses (educational)",
      "Normalize retakes as data; adjust calendar and sleep before paying again.",
      "OBA retake planning resilience overview",
      "Rebuild confidence after a component fail with structured deficit targeting.",
      "Resilience includes financial planning for another attempt.",
    ),
  );
  specs.push(
    au(
      "intl-australia-iqnm-family-relocation-timeline-with-oba",
      "Family relocation timelines alongside OBA: planning article for IQNMs (educational)",
      "Align school enrollment for children with uncertain exam dates using conservative assumptions.",
      "OBA and family relocation timeline planning",
      "Reduce household stress by date-budgeting OBA attempts and school terms.",
      "Communication with partners about worst-case timelines prevents conflict during study.",
    ),
  );

  // New Zealand (6)
  const nz = (
    slug: string,
    title: string,
    excerpt: string,
    seoTitle: string,
    seoDescription: string,
    angle: string,
  ) => buildNewZealandCapTopic(slug, title, excerpt, seoTitle, seoDescription, angle);

  specs.push(
    nz(
      "intl-new-zealand-cap-programme-overview-for-internationally-qualified-nurses",
      "New Zealand CAP programme overview for internationally qualified nurses",
      "Understand theory, simulation, and placement components before you arrive.",
      "New Zealand CAP programme overview",
      "Plan CAP study around Nursing Council competencies and Te Tiriti-informed practice.",
      "CAP is intensive; treat it like a full-time job plus homework.",
    ),
  );
  specs.push(
    nz(
      "intl-new-zealand-nursing-council-english-evidence-overview",
      "Nursing Council of New Zealand English evidence overview for IQNMs",
      "Match tests and scores to published lists; schedule early.",
      "New Zealand nursing English requirements overview",
      "Prepare English evidence alongside CAP clinical skills training.",
      "English delays can push placement timing into less ideal seasons.",
    ),
  );
  specs.push(
    nz(
      "intl-new-zealand-cap-clinical-placement-safety-priorities-overview",
      "CAP clinical placement safety priorities for internationally qualified nurses",
      "Fatigue management and escalation habits protect patients and your evaluation.",
      "CAP clinical placement safety overview",
      "Build safe habits for New Zealand placement evaluation periods.",
      "Preceptors watch for self-awareness and willingness to ask questions.",
    ),
  );
  specs.push(
    nz(
      "intl-new-zealand-te-tiriti-informed-care-study-primer",
      "Te Tiriti o Waitangi informed care: study primer for IQNMs in New Zealand (educational)",
      "Engage assigned readings seriously; avoid performative phrases in OSCE-style interactions.",
      "Te Tiriti informed nursing study primer",
      "Connect historical context to contemporary practice expectations in Aotearoa New Zealand.",
      "Cultural safety includes accountability, not only politeness.",
    ),
  );
  specs.push(
    nz(
      "intl-new-zealand-iqnm-scope-of-practice-readiness-overview",
      "New Zealand nursing scope readiness for IQNMs (educational)",
      "Learn prescribing boundaries and interprofessional titles early.",
      "New Zealand nursing scope overview for IQNMs",
      "Map scope differences between your home country and New Zealand practice.",
      "Scope misunderstandings create risk on placements and exams.",
    ),
  );
  specs.push(
    nz(
      "intl-new-zealand-cap-assessment-milestones-time-management-overview",
      "CAP assessment milestones and time management for IQNMs (educational)",
      "Track assignment due dates alongside placement shifts to avoid collisions.",
      "CAP milestone time management overview",
      "Use calendar buffers around high-stakes CAP assessments.",
      "Milestone cramming reduces sleep and increases patient risk; avoid it.",
    ),
  );

  // Middle East (25) — educational; verify each authority portal
  const me = buildMiddleEastAuthorityTopic;
  specs.push(
    me(
      "intl-uae-dha-nursing-licensing-exam-overview-dubai",
      "Dubai Health Authority nursing licensing exam orientation (educational)",
      "United Arab Emirates",
      "Dubai Health Authority (DHA) nursing licensing assessment (verify current syllabus)",
      "Educational overview for nurses targeting Dubai health authority licensing steps alongside clinical review.",
      "DHA nursing licensing exam orientation",
      "Study clinical priorities for Dubai licensing routes while confirming official DHA bulletins.",
      "Dubai Health Authority (DHA)",
      "https://www.dha.gov.ae/",
      "UAE licensing uses structured verification plus examinations for many categories; never rely on memorized third-party question banks alone.",
    ),
  );
  specs.push(
    me(
      "intl-uae-doh-abu-dhabi-nursing-licensing-overview",
      "Department of Health Abu Dhabi nursing licensing overview (educational)",
      "United Arab Emirates",
      "Department of Health — Abu Dhabi (DOH) nursing licensing processes (verify current categories)",
      "Orient to DOH licensing themes for nurses planning Abu Dhabi employment.",
      "DOH Abu Dhabi nursing licensing overview",
      "Compare DOH documentation expectations with clinical exam preparation schedules.",
      "Department of Health — Abu Dhabi (DOH)",
      "https://www.doh.gov.ae/",
      "Abu Dhabi categories and fees differ from Dubai; read the correct portal for your emirate.",
    ),
  );
  specs.push(
    me(
      "intl-uae-mohap-federal-health-nursing-licensing-overview",
      "UAE Ministry of Health and Prevention federal licensing themes for nurses (educational)",
      "United Arab Emirates",
      "MOHAP / federal health licensing contexts (verify current profession categories)",
      "High-level orientation for nurses navigating federal UAE health licensing vocabulary.",
      "UAE MOHAP nursing licensing overview",
      "Clarify federal versus emirate-level licensing vocabulary before paying agencies.",
      "United Arab Emirates Ministry of Health and Prevention",
      "https://www.mohap.gov.ae/",
      "Federal routes may differ from Dubai or Abu Dhabi routes; confirm with your employer sponsor.",
    ),
  );
  specs.push(
    me(
      "intl-saudi-scfhs-nursing-classification-exam-overview",
      "Saudi Commission for Classification of Health Professions nursing pathway overview (educational)",
      "Saudi Arabia",
      "SCFHS classification and professional registration themes for nurses (verify current)",
      "Educational orientation for nurses planning Saudi Arabia classification and examination steps.",
      "Saudi SCFHS nursing classification overview",
      "Study clinically while tracking SCFHS dataflow and exam announcements.",
      "Saudi Commission for Classification of Health Professions (SCFHS)",
      "https://www.scfhs.org.sa/",
      "Saudi pathways emphasize verification discipline; treat every document request as a hard deadline.",
    ),
  );
  specs.push(
    me(
      "intl-qatar-moph-nursing-licensing-overview",
      "Qatar Ministry of Public Health nursing licensing overview (educational)",
      "Qatar",
      "Qatar MOPH nursing licensing and examination themes (verify current)",
      "Plan Qatar licensing documentation alongside clinical priority review.",
      "Qatar MOPH nursing licensing overview",
      "Understand Qatar health authority licensing vocabulary for international nurses.",
      "Ministry of Public Health — Qatar",
      "https://www.moph.gov.qa/",
      "Qatar uses structured online portals; screenshot confirmations for your records.",
    ),
  );
  specs.push(
    me(
      "intl-kuwait-moh-nursing-licensing-overview",
      "Kuwait Ministry of Health nursing licensing overview (educational)",
      "Kuwait",
      "Kuwait MOH nursing licensing examination themes (verify current)",
      "Educational orientation for nurses targeting Kuwait MOH licensing routes.",
      "Kuwait MOH nursing licensing overview",
      "Prepare clinically while confirming Kuwait-specific bulletin updates.",
      "Kuwait Ministry of Health",
      "https://www.moh.gov.kw/",
      "Kuwait timelines can be seasonal; align family plans conservatively.",
    ),
  );
  specs.push(
    me(
      "intl-bahrain-nhra-nursing-licensing-overview",
      "Bahrain National Health Regulatory Authority nursing licensing overview (educational)",
      "Bahrain",
      "NHRA nursing licensing themes (verify current)",
      "Orient to NHRA documentation and exam preparation for Bahrain practice.",
      "Bahrain NHRA nursing licensing overview",
      "Study for Bahrain licensing assessments with official NHRA guidance.",
      "National Health Regulatory Authority (NHRA) Bahrain",
      "https://www.nhra.bh/",
      "NHRA categories evolve; re-download bulletins before paying exam fees.",
    ),
  );
  specs.push(
    me(
      "intl-oman-moh-nursing-licensing-overview",
      "Oman Ministry of Health nursing licensing overview (educational)",
      "Oman",
      "Oman MOH nursing licensing examination themes (verify current)",
      "Educational orientation for nurses planning Oman MOH licensing.",
      "Oman MOH nursing licensing overview",
      "Prepare for Oman clinical exams with community and acute care balance.",
      "Oman Ministry of Health",
      "https://www.moh.gov.om/",
      "Oman may publish category-specific syllabi; match your job offer category exactly.",
    ),
  );
  specs.push(
    me(
      "intl-jordan-moh-nursing-licensing-overview",
      "Jordan Ministry of Health nursing licensing overview (educational)",
      "Jordan",
      "Jordan MOH nursing licensing themes (verify current)",
      "Orient to Jordan licensing expectations for internationally trained nurses.",
      "Jordan nursing licensing overview",
      "Plan Jordan MOH steps alongside clinical systems review.",
      "Jordan Ministry of Health",
      "https://www.moh.gov.jo/",
      "Arabic and English document requirements vary; confirm translations early.",
    ),
  );
  specs.push(
    me(
      "intl-lebanon-moph-nursing-registration-overview",
      "Lebanon Ministry of Public Health nursing registration overview (educational)",
      "Lebanon",
      "Lebanon nursing registration themes (verify current)",
      "Educational overview for nurses navigating Lebanon registration vocabulary.",
      "Lebanon nursing registration overview",
      "Confirm current Lebanese regulatory steps with official ministry pages.",
      "Lebanon Ministry of Public Health",
      "https://www.moph.gov.lb/",
      "Institutional instability can affect processing; keep backups of all submissions.",
    ),
  );
  specs.push(
    me(
      "intl-iraq-moh-nursing-licensing-overview",
      "Iraq Ministry of Health nursing licensing overview (educational)",
      "Iraq",
      "Iraq MOH nursing licensing themes (verify current)",
      "High-level orientation for nurses exploring Iraq licensing routes.",
      "Iraq nursing licensing overview",
      "Treat Iraq licensing as highly variable by region and institution; verify with official sources.",
      "Iraq Ministry of Health",
      "https://moh.gov.iq/",
      "Security and logistics affect testing; follow employer guidance closely.",
    ),
  );
  specs.push(
    me(
      "intl-egypt-moh-nursing-syndicate-registration-overview",
      "Egypt nursing registration and syndicate themes for international mobility (educational)",
      "Egypt",
      "Egyptian nursing registration documentation themes (verify current)",
      "Understand Egyptian registration documents often requested for Gulf applications.",
      "Egypt nursing registration mobility overview",
      "Prepare Egyptian syndicate and ministry documents early for overseas employers.",
      "Egyptian Ministry of Health and Population",
      "https://www.mohp.gov.eg/",
      "Many Egyptian nurses pursue GCC roles; keep attestation chains organized.",
    ),
  );
  specs.push(
    me(
      "intl-pakistan-pnc-nursing-council-registration-overview",
      "Pakistan Nursing Council registration overview for overseas job applications (educational)",
      "Pakistan",
      "PNC registration and good standing themes (verify current)",
      "Orient to Pakistan nursing council documentation used in international verification.",
      "Pakistan Nursing Council registration overview",
      "Plan PNC good standing letters alongside destination exam study.",
      "Pakistan Nursing Council",
      "https://www.pnc.org.pk/",
      "Primary source verification agencies will contact PNC; keep contact info updated.",
    ),
  );
  specs.push(
    me(
      "intl-saudi-dataflow-primary-source-verification-overview-nurses",
      "DataFlow primary source verification overview for nurses targeting Saudi Arabia (educational)",
      "Saudi Arabia",
      "DataFlow verification as part of SCFHS-related workflows (verify current)",
      "Understand verification timelines while studying clinically for classification exams.",
      "DataFlow verification overview for nurses",
      "Track DataFlow statuses weekly to avoid surprises before exam authorization.",
      "DataFlow Group",
      "https://www.dataflowgroup.com/",
      "Verification is not studying; schedule admin time so it does not steal clinical blocks.",
    ),
  );
  specs.push(
    me(
      "intl-uae-prometric-test-day-logistics-nursing-exam",
      "Prometric test day logistics for UAE nursing exams (educational)",
      "United Arab Emirates",
      "Prometric-delivered nursing examinations in UAE contexts (verify current)",
      "Reduce test-day friction with ID, timing, and travel rehearsal.",
      "Prometric UAE nursing exam logistics",
      "Practice clinical items under test-centre time discipline for UAE routes.",
      "Prometric",
      "https://www.prometric.com/",
      "Arrive early; biometric checks can queue unexpectedly.",
    ),
  );
  specs.push(
    me(
      "intl-qatar-prometric-nursing-exam-study-habits-overview",
      "Qatar nursing exam study habits for Prometric-style assessments (educational)",
      "Qatar",
      "Prometric-style nursing assessments in Qatar (verify current)",
      "Blend mixed-topic practice with sleep-protected review blocks.",
      "Qatar nursing Prometric study habits",
      "Prepare for multiple-choice clinical exams common in Gulf hiring pipelines.",
      "Prometric",
      "https://www.prometric.com/",
      "Use official syllabi as topic filters for question banks.",
    ),
  );
  specs.push(
    me(
      "intl-kuwait-moh-exam-content-high-yield-systems-review",
      "Kuwait MOH nursing exam high-yield systems review (educational)",
      "Kuwait",
      "Kuwait MOH nursing examination study themes (verify current)",
      "Prioritize cardiology, endocrine emergencies, and post-op complications in mixed sets.",
      "Kuwait MOH nursing exam systems review",
      "Study high-yield systems for Kuwait clinical licensing assessments.",
      "Kuwait Ministry of Health",
      "https://www.moh.gov.kw/",
      "Pair each study block with ten legal-ethical Gulf-style stems if your bulletin includes them.",
    ),
  );
  specs.push(
    me(
      "intl-bahrain-nhra-exam-english-arabic-study-tips",
      "Bahrain NHRA nursing exam language and study tips (educational)",
      "Bahrain",
      "NHRA nursing examination preparation (verify current)",
      "If your exam language is English, still learn key Arabic consent phrases used locally.",
      "Bahrain NHRA nursing exam study tips",
      "Blend language confidence with clinical safety drills for NHRA assessments.",
      "National Health Regulatory Authority (NHRA) Bahrain",
      "https://www.nhra.bh/",
      "Language confidence reduces misreads under time pressure.",
    ),
  );
  specs.push(
    me(
      "intl-oman-moh-community-health-nursing-priority-overview",
      "Oman MOH community health nursing priorities for licensing study (educational)",
      "Oman",
      "Oman MOH nursing examination community themes (verify current)",
      "Community outbreaks, immunization, and maternal-child themes appear often.",
      "Oman MOH community nursing priorities",
      "Weight community nursing alongside acute care for Oman exam study.",
      "Oman Ministry of Health",
      "https://www.moh.gov.om/",
      "Middle Eastern exams often include preventable disease priorities.",
    ),
  );
  specs.push(
    me(
      "intl-saudi-scfhs-pediatric-emergency-high-yield-overview",
      "Saudi SCFHS pediatric emergency high-yield topics for nursing exams (educational)",
      "Saudi Arabia",
      "SCFHS nursing examination pediatric emergency themes (verify current)",
      "Dehydration, sepsis, respiratory distress, and safe medication math are classic.",
      "Saudi nursing exam pediatric emergency topics",
      "Prepare pediatric emergency recognition for SCFHS-style clinical multiple choice.",
      "Saudi Commission for Classification of Health Professions (SCFHS)",
      "https://www.scfhs.org.sa/",
      "Use growth-chart reasoning where stems include weight-based doses.",
    ),
  );
  specs.push(
    me(
      "intl-uae-doh-mental-health-nursing-stigma-aware-study-overview",
      "DOH Abu Dhabi mental health nursing study overview (educational)",
      "United Arab Emirates",
      "DOH nursing examination mental health themes (verify current)",
      "Therapeutic communication, suicide risk, and legal holds may appear as scenarios.",
      "DOH Abu Dhabi mental health nursing exam prep",
      "Study stigma-aware communication for UAE mental health licensing stems.",
      "Department of Health — Abu Dhabi (DOH)",
      "https://www.doh.gov.ae/",
      "Mental health stems test tone and safety sequencing.",
    ),
  );
  specs.push(
    me(
      "intl-qatar-moph-infection-outbreak-nursing-judgment-overview",
      "Qatar MOPH infection outbreak nursing judgment overview (educational)",
      "Qatar",
      "Qatar nursing examination infection control themes (verify current)",
      "Isolation, PPE, and notification chains are frequent priority topics.",
      "Qatar MOPH infection control exam overview",
      "Train outbreak judgment for Qatar licensing-style clinical items.",
      "Ministry of Public Health — Qatar",
      "https://www.moph.gov.qa/",
      "Outbreak questions reward rapid escalation, not silent heroics.",
    ),
  );
  specs.push(
    me(
      "intl-kuwait-moh-med-safety-high-alert-medications-overview",
      "Kuwait MOH high-alert medication safety overview for nursing exams (educational)",
      "Kuwait",
      "Kuwait MOH nursing examination pharmacology safety themes (verify current)",
      "Insulin, anticoagulants, chemo, and electrolytes dominate high-alert stems.",
      "Kuwait MOH high-alert medication exam topics",
      "Study high-alert medication safety for Kuwait clinical licensing items.",
      "Kuwait Ministry of Health",
      "https://www.moh.gov.kw/",
      "Double-check units and conversions on every pharmacology item.",
    ),
  );
  specs.push(
    me(
      "intl-bahrain-nhra-obstetric-hemorrhage-priority-overview",
      "Bahrain NHRA obstetric hemorrhage priority topics for nursing exams (educational)",
      "Bahrain",
      "NHRA nursing examination maternal emergency themes (verify current)",
      "Postpartum hemorrhage recognition and escalation are high yield.",
      "Bahrain NHRA obstetric hemorrhage exam prep",
      "Prepare maternal emergency priorities for NHRA-style assessments.",
      "National Health Regulatory Authority (NHRA) Bahrain",
      "https://www.nhra.bh/",
      "Obstetric emergencies test massive transfusion and fundal massage knowledge carefully within scope.",
    ),
  );
  specs.push(
    me(
      "intl-saudi-scfhs-dialysis-nursing-safety-overview",
      "Saudi SCFHS dialysis nursing safety topics for licensing study (educational)",
      "Saudi Arabia",
      "SCFHS nursing examination renal replacement themes (verify current)",
      "Electrolytes, fluid shifts, and access infection control appear often.",
      "Saudi nursing exam dialysis safety overview",
      "Study dialysis safety for SCFHS clinical multiple-choice preparation.",
      "Saudi Commission for Classification of Health Professions (SCFHS)",
      "https://www.scfhs.org.sa/",
      "Dialysis stems often hide potassium and fluid shifts in the narrative.",
    ),
  );
  specs.push(
    me(
      "intl-uae-dha-trauma-nursing-triage-overview",
      "Dubai DHA trauma triage nursing overview for exam preparation (educational)",
      "United Arab Emirates",
      "DHA nursing examination trauma triage themes (verify current)",
      "ABCs, hemorrhage control, and spine precautions are classic sequences.",
      "DHA trauma triage nursing exam overview",
      "Practice trauma prioritization for Dubai clinical licensing items.",
      "Dubai Health Authority (DHA)",
      "https://www.dha.gov.ae/",
      "Triage questions punish skipping airway for dramatic extremity injuries.",
    ),
  );

  // Philippines (8)
  const ph = (
    slug: string,
    title: string,
    excerpt: string,
    seoTitle: string,
    seoDescription: string,
    angle: string,
  ) => buildPhilippinesPnleTopic(slug, title, excerpt, seoTitle, seoDescription, angle);

  specs.push(
    ph(
      "intl-philippines-pnle-overview-for-first-time-nursing-candidates",
      "Philippine Nursing Licensure Examination (PNLE) overview for first-time candidates",
      "Understand blueprint domains and professional nursing law weighting before review classes.",
      "PNLE overview for first-time nursing candidates",
      "Plan PNLE study with community health, MS, maternal, psych, and ethics balance.",
      "PNLE rewards comprehensive foundations; start early if you are weak in math or English reading speed.",
    ),
  );
  specs.push(
    ph(
      "intl-philippines-pnle-community-health-nursing-high-yield-review",
      "PNLE community health nursing high-yield review plan (educational)",
      "Immunization schedules, outbreak steps, and nutrition programs appear frequently.",
      "PNLE community health review plan",
      "Boost PNLE scores with community health drills tied to Philippine programs.",
      "Community health is a differentiator for top decile scores.",
    ),
  );
  specs.push(
    ph(
      "intl-philippines-pnle-ms-nursing-pharmacology-safety-drills",
      "PNLE medical-surgical pharmacology safety drills (educational)",
      "Antibiotics, heart failure meds, and insulin safety dominate MS stems.",
      "PNLE pharmacology safety drills",
      "Train medication safety speed for PNLE medical-surgical sections.",
      "Read questions for contraindications hidden in pregnancy or renal clues.",
    ),
  );
  specs.push(
    ph(
      "intl-philippines-pnle-maternal-child-priority-topics-overview",
      "PNLE maternal-child priority topics overview (educational)",
      "Labor stages, postpartum hemorrhage, and newborn thermoregulation are classic.",
      "PNLE maternal-child priority topics",
      "Prepare maternal-newborn PNLE items with emergency priority practice.",
      "Pair pathophysiology with nursing actions and teaching points.",
    ),
  );
  specs.push(
    ph(
      "intl-philippines-pnle-psychiatric-nursing-communication-overview",
      "PNLE psychiatric nursing communication overview (educational)",
      "Therapeutic versus non-therapeutic communication distractors are frequent traps.",
      "PNLE psychiatric nursing communication prep",
      "Train communication judgment for PNLE psych sections.",
      "Avoid false reassurance and advice-giving answer choices.",
    ),
  );
  specs.push(
    ph(
      "intl-philippines-pnle-nursing-ethics-and-law-overview",
      "PNLE nursing ethics and law overview (educational)",
      "Scope, malpractice basics, and patient rights appear as scenario questions.",
      "PNLE nursing ethics and law overview",
      "Study Philippine nursing law contexts alongside clinical scenarios.",
      "Law questions reward the most patient-protective compliant option.",
    ),
  );
  specs.push(
    ph(
      "intl-philippines-pnle-overseas-employer-cgfns-documentation-bridge",
      "From PNLE pass to overseas CGFNS documentation: educational bridge for Filipino nurses",
      "Treat PRC license issuance as the start of an international paper trail, not the end.",
      "PNLE to CGFNS documentation bridge",
      "Plan CGFNS verification after PNLE for US-bound Filipino nurses.",
      "Scan documents in high resolution once; reuse for multiple agencies with naming discipline.",
    ),
  );
  specs.push(
    ph(
      "intl-philippines-pnle-self-care-and-burnout-prevention-while-studying",
      "PNLE study burnout prevention and self-care for nursing students (educational)",
      "Sleep-protected schedules beat heroic cramming for cumulative exams.",
      "PNLE study burnout prevention tips",
      "Protect mental health during PNLE preparation with sustainable study design.",
      "Short walks and daylight exposure improve focus more than extra late hours.",
    ),
  );

  // India (8)
  const ind = (
    slug: string,
    title: string,
    excerpt: string,
    seoTitle: string,
    seoDescription: string,
    angle: string,
  ) => buildIndiaIncOverseasTopic(slug, title, excerpt, seoTitle, seoDescription, angle);

  specs.push(
    ind(
      "intl-india-inc-state-council-good-standing-for-overseas-jobs-overview",
      "India INC and state nursing councils: good standing certificates for overseas jobs (educational)",
      "Start state council letters early; employers may want recent dates.",
      "India nursing good standing certificates overview",
      "Organize Indian nursing council documentation for international employer verification.",
      "Good standing delays are common; track courier receipts.",
    ),
  );
  specs.push(
    ind(
      "intl-india-nclex-us-route-study-plan-for-indian-nurses",
      "NCLEX-RN US route study plan for Indian-trained nurses (educational)",
      "Shift from memorization-first education to judgment-first practice gradually.",
      "NCLEX study plan for Indian nurses",
      "Build NCLEX clinical judgment skills as an Indian-trained nurse targeting the US.",
      "Use timed mixed sets early even if they feel demoralizing; they are diagnostic.",
    ),
  );
  specs.push(
    ind(
      "intl-india-nmc-uk-route-study-plan-for-indian-nurses",
      "NMC UK route study plan for Indian-trained nurses (educational)",
      "Add OSCE communication rehearsal early, not only after CBT pass.",
      "NMC UK route study plan for Indian nurses",
      "Parallelize CBT and OSCE skill training for UK-bound Indian nurses.",
      "UK employers value explicit consent language and escalation clarity.",
    ),
  );
  specs.push(
    ind(
      "intl-india-gulf-route-credential-timeline-for-indian-nurses",
      "Gulf employer credential timelines for Indian nurses: educational planning",
      "Attestation chains involve universities, state councils, MEA, and embassies.",
      "Gulf credential timeline for Indian nurses",
      "Backwards-plan attestation and DataFlow steps for Gulf contracts.",
      "Never book a one-way flight before verifying license eligibility timelines.",
    ),
  );
  specs.push(
    ind(
      "intl-india-canada-route-nnas-first-steps-for-indian-nurses",
      "Canada NNAS first steps for Indian-trained nurses (educational)",
      "University responses may be slower; polite persistence helps.",
      "NNAS first steps for Indian nurses to Canada",
      "Start NNAS while building NCLEX-RN foundations if Canada is your goal.",
      "Translate documents only through methods your university accepts.",
    ),
  );
  specs.push(
    ind(
      "intl-india-english-listening-drift-nclex-nmc-prep",
      "English listening drift prevention for Indian nurses preparing NCLEX or NMC tests (educational)",
      "Daily listening to clinical podcasts reduces misread stems under stress.",
      "English listening practice for Indian nurses abroad",
      "Protect listening comprehension gains during long NCLEX or NMC preparation.",
      "Use 1.0x speed for learning; avoid always speeding up content.",
    ),
  );
  specs.push(
    ind(
      "intl-india-clinical-math-confidence-for-international-licensing-exams",
      "Clinical math confidence for Indian nurses on international licensing exams (educational)",
      "Dimensional analysis drills reduce conversion panic on test day.",
      "Clinical math for international nursing exams",
      "Rebuild dosage calculation confidence for US and Gulf style items.",
      "Practice rounding rules exactly as your target exam states.",
    ),
  );
  specs.push(
    ind(
      "intl-india-family-expectations-and-study-boundaries-overview",
      "Family expectations and study boundaries for Indian nurses preparing abroad (educational)",
      "Negotiate protected study windows to prevent resentment during long prep.",
      "Family boundaries during international nursing exam prep",
      "Communicate study schedules clearly while preparing for overseas licensing.",
      "Shared calendars reduce interruptions during simulation days.",
    ),
  );

  // Global cross-cutting (11)
  const gl = (
    slug: string,
    title: string,
    exam: string,
    excerpt: string,
    seoTitle: string,
    seoDescription: string,
    angle: string,
    refs: string[],
  ) => buildGlobalCrossCuttingTopic(slug, title, exam, excerpt, seoTitle, seoDescription, angle, refs);

  specs.push(
    gl(
      "intl-global-who-health-workforce-migration-ethics-overview-nurses",
      "WHO health workforce and ethical migration overview for nurses (educational)",
      "Global health workforce policy context",
      "Connect WHO workforce ethics language to your personal migration decisions without replacing legal advice.",
      "WHO nurse workforce migration ethics overview",
      "Understand global workforce ethics framing while preparing for national licensing exams.",
      "WHO publications provide population-level framing, not personal visa answers.",
      ["World Health Organization. (2026). Health workforce. https://www.who.int/health-topics/health-workforce"],
    ),
  );
  specs.push(
    gl(
      "intl-global-cgfns-vs-visa-screen-which-first-overview",
      "CGFNS services versus VisaScreen sequencing overview for international nurses (educational)",
      "US-bound documentation sequencing",
      "Avoid paying for the wrong service first; read official CGFNS product descriptions.",
      "CGFNS versus VisaScreen sequencing overview",
      "Plan CGFNS products in the right order for US licensure and immigration threads.",
      "Parallelize only when timelines allow; both threads may need the same transcripts.",
      [
        "CGFNS International. (2026). Credentials evaluation services. https://www.cgfns.org/",
        "ECFMG | CGFNS Alliance. (2026). VisaScreen: Visa credentials assessment. https://www.cgfns.org/services/visascreen/",
      ],
    ),
  );
  specs.push(
    gl(
      "intl-global-oet-for-healthcare-professionals-nursing-overview",
      "OET for healthcare professionals: nursing-focused overview (educational)",
      "OET healthcare communication exams",
      "Use OET-style role-plays to strengthen patient education answers on licensing exams.",
      "OET for nurses overview",
      "Prepare healthcare-context English exams alongside clinical judgment practice.",
      "OET Ltd publishes sample materials; pair them with your regulator’s accepted list.",
      ["Occupational English Test. (2026). OET for nurses. https://oet.com/"],
    ),
  );
  specs.push(
    gl(
      "intl-global-ielts-academic-vs-general-for-nursing-registration",
      "IELTS academic versus general training for nursing registration: educational comparison",
      "IELTS modules for regulators",
      "Pick the module your regulator names; never assume academic is always required.",
      "IELTS academic vs general for nursing registration",
      "Avoid costly IELTS mistakes by matching module to regulator instructions.",
      "British Council and IDP publish official guidance on modules and scoring.",
      ["IELTS. (2026). IELTS for migration and registration. https://www.ielts.org/"],
    ),
  );
  specs.push(
    gl(
      "intl-global-osce-generic-station-timekeeping-drills",
      "OSCE generic station timekeeping drills for any country (educational)",
      "OSCE timing skills",
      "Use kitchen timers to rehearse 8–10 minute stations until closure phrases feel natural.",
      "OSCE timekeeping drills for international nurses",
      "Build OSCE timing discipline transferable across UK, Australia, NZ, and Middle East assessments.",
      "Timekeeping is a scored behavior in many OSCE mark schemes worldwide.",
      ["Nursing and Midwifery Council. (2026). Test of Competence information. https://www.nmc.org.uk/registration/joining-the-register/toc/"],
    ),
  );
  specs.push(
    gl(
      "intl-global-nclex-style-priority-versus-assessment-answer-discipline",
      "NCLEX-style priority versus assessment answer discipline for global candidates (educational)",
      "Clinical judgment universal skills",
      "Train yourself to notice when the stem asks for assessment before action even if an intervention answer looks attractive.",
      "Priority versus assessment NCLEX discipline",
      "Improve international exam performance with universal priority frameworks.",
      "This skill transfers to many countries’ multiple-choice licensing exams.",
      [APA_NCSBN],
    ),
  );
  specs.push(
    gl(
      "intl-global-transcript-authentication-chain-overview-nurses",
      "Transcript authentication chain overview for internationally mobile nurses (educational)",
      "Credential logistics",
      "Draw a literal chain diagram from university to embassy to verifier to board.",
      "Transcript authentication chain for nurses",
      "Reduce anxiety by visualizing each attestation hop for international licensing.",
      "Photograph envelopes and tracking numbers for every courier send.",
      [APA CGFNS],
    ),
  );
  specs.push(
    gl(
      "intl-global-social-media-misinformation-defense-for-nursing-licensing",
      "Social media misinformation defense while preparing for nursing licensing (educational)",
      "Information hygiene",
      "When a post cannot link to a primary PDF on a regulator site, treat it as gossip until verified.",
      "Avoid nursing licensing misinformation on social media",
      "Protect your timeline and mental health from licensing rumor accounts.",
      "Mute keywords that trigger panic during exam week.",
      [APA_NCSBN],
    ),
  );
  specs.push(
    gl(
      "intl-global-study-partner-structures-for-remote-nursing-candidates",
      "Remote study partner structures for nursing licensing candidates (educational)",
      "Accountability systems",
      "Use weekly synchronous sessions for OSCE practice and async chats for quick MCQ debates.",
      "Remote study partner structures for nursing exams",
      "Build accountability across time zones while preparing for licensing tests.",
      "Written agendas prevent unstructured vent sessions that steal study time.",
      [APA_NCSBN],
    ),
  );
  specs.push(
    gl(
      "intl-global-financial-budgeting-for-multi-step-licensing-pathways",
      "Financial budgeting for multi-step international nursing licensing pathways (educational)",
      "Exam economics",
      "Spreadsheet every fee: exams, translations, courier, verification, flights, and lost wages.",
      "Budgeting for international nursing licensing fees",
      "Reduce money surprises during NCLEX, NMC, OBA, or Gulf sequences.",
      "Financial stress reduces working memory; budget early to protect scores.",
      [APA CGFNS],
    ),
  );
  specs.push(
    gl(
      "intl-global-mental-health-for-long-distance-licensing-stress",
      "Mental health support options during long-distance licensing stress (educational)",
      "Wellbeing while studying",
      "Professional counseling can coexist with ambitious exam schedules if you book recurring slots.",
      "Mental health during nursing licensing preparation",
      "Protect wellbeing during multi-year international licensing journeys.",
      "Brief therapy can target test anxiety without derailing your study calendar.",
      ["World Health Organization. (2026). Mental health. https://www.who.int/health-topics/mental-health"],
    ),
  );

  if (specs.length !== 140) {
    throw new Error(`Expected 140 international licensing specs, got ${specs.length}`);
  }
  const slugs = specs.map((s) => s.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Duplicate slug detected in international licensing specs");
  }
  return specs;
}
