import type { InternationalLicensingTopicSpec } from "./types";

const APA_NCSBN =
  "National Council of State Boards of Nursing. (2026). NCLEX & other examinations. https://www.ncsbn.org/exams";
const APA_NNAS =
  "National Nursing Assessment Service. (2026). NNAS: Applying to a Canadian nursing regulatory body. https://nnas.ca/";
const APA_NMC =
  "Nursing and Midwifery Council. (2026). Test of Competence (ToC) information. https://www.nmc.org.uk/registration/joining-the-register/toc/";
const APA_NMBA =
  "Nursing and Midwifery Board of Australia. (2026). Internationally qualified nurses and midwives. https://www.nursingmidwiferyboard.gov.au/Registration-and-Endorsement/Registration-Standards/Internationally-qualified-nurses-and-midwives.aspx";
const APA_AHPRA =
  "Australian Health Practitioner Regulation Agency. (2026). International practitioners. https://www.ahpra.gov.au/Registration/International.aspx";
const APA_NCNZ =
  "Nursing Council of New Zealand. (2026). Internationally qualified nurses. https://www.nursingcouncil.org.nz/Internationally-qualified-nurses";
const APA_PRC =
  "Professional Regulation Commission (Philippines). (2026). Nursing licensure examination information. https://www.prc.gov.ph/";
const APA_INC =
  "Indian Nursing Council. (2026). Information for nurses. https://www.indiannursingcouncil.org/";
const APA_CGFNS =
  "CGFNS International. (2026). Credentials evaluation services. https://www.cgfns.org/";
const APA_ECFMG =
  "ECFMG | CGFNS Alliance. (2026). VisaScreen: Visa credentials assessment. https://www.cgfns.org/services/visascreen/";

function t8(
  exam: string,
  country: string,
  regulator: string,
  extra?: string,
): string[] {
  const e = extra ? ` ${extra}` : "";
  return [
    `Treat ${regulator} as the source of truth for eligibility, fees, and document checklists in ${country}.${e}`,
    `Pair ${exam} preparation with healthcare communication practice, not only textbook theory.`,
    `Build a retake plan before attempt one: buffer time, finances, and emotional support matter for international routes.`,
    `Use timed practice so interface skills and pacing match computer-delivered high-stakes formats.`,
    `Organize transcripts, registration verifications, and identification early to avoid administrative delays.`,
    `Study clinical judgment as safety sequencing: assessment, escalation, scope-appropriate interventions, then teaching.`,
    `Compare your intended practice setting (acute care, community, long-term care) to the case mix you practiced abroad.`,
    `Track official updates: licensing bodies publish changes to pathways, English tests, and assessment formats regularly.`,
  ];
}

export function buildCanadaNclexProvincial(
  slug: string,
  title: string,
  province: string,
  regulator: string,
  authorityUrl: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  extraOverview: string,
  examOverride?: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "Canada",
    exam: examOverride ?? "NCLEX-RN (within provincial RN registration)",
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["Canada", "NCLEX-RN", "IEN", province, "Nursing regulation", "Clinical judgment"],
    regulatorLabel: regulator,
    authorityUrl,
    takeaways: t8("NCLEX-RN", "Canada", regulator, `Focus on ${province}-specific instructions when they differ from other provinces.`),
    overview: `${extraOverview} Canada regulates registered nursing at the provincial and territorial level, so the same NCLEX-RN outcome must be interpreted alongside ${regulator} policies, jurisprudence requirements, and any additional orientation or assessment assigned to internationally educated applicants. Historically, some provinces used predecessor exams before moving to the NCLEX-RN; understanding that history helps IENs interpret older forum posts without confusing them with current requirements.`,
    eligibility: `Typical eligibility themes include proof of nursing education comparable to a Canadian baccalaureate nursing program, language proficiency where required, good character and conduct questions, and registration history from every jurisdiction where you have held or applied for a license. ${regulator} may require credential evaluation through NNAS for some application streams, then provincial review of your courses and practice hours. Some candidates must complete additional education, supervised practice, or competency assessment depending on gap analysis results.`,
    structure: `The NCLEX-RN is a computerized exam that samples across the test plan with management-of-care emphasis. Items may include multiple response, charts, and case clusters that reward prioritization, therapeutic communication, pharmacology safety, and delegation boundaries. Provincial registration may also include separate jurisprudence or ethics modules, orientation courses, or practice readiness assessments depending on the pathway assigned to you.`,
    clinicalJudgment: `Clinical judgment items often test whether you identify the evolving risk: sepsis, bleeding, airway compromise, electrolyte catastrophe, or medication error patterns. For Canadian practice contexts, also watch for interprofessional collaboration, Indigenous cultural safety expectations where applicable in your jurisdiction’s standards, and clear therapeutic communication when patients refuse or question care.`,
    mistakes: `Common mistakes include relying on outdated threads about predecessor exams, underestimating document translation timelines, and studying content without timed blocks. Another trap is assuming US NCLEX study resources map one-to-one to Canadian scope language—many concepts overlap, but prioritize ${regulator} practice standards and any provincial documentation on medication administration, delegation, and reporting obligations.`,
    studyStrategies: `Use an 8-to-12 week baseline plan if you are close to exam readiness, and longer if you are rebuilding fundamentals or English fluency. Weekly mix: two systems deep dives, two priority-safety drills, one pharmacology session, and one full-length practice day. After each practice test, tag misses by system and by cognitive skill (priority versus teaching versus delegation) so your next week is data-driven.`,
    timeManagement: `Use a visible calendar that includes work shifts, childcare, and credentialing deadlines. Split weekday sessions into 45-minute focused blocks with a two-minute movement break. Reserve longer weekend sessions for case clusters and review of rationale. Avoid “zero days” for language exposure: even 20 minutes of listening to clinical handoff podcasts in English or French (per your pathway) preserves momentum.`,
    practiceStrategy: `Train with elimination discipline: rule out options that are outside nursing scope, options that delay urgent assessment, and options that teach before the patient is stable. For case clusters, skim the chart first for allergies, code status, vitals trend, and recent labs—those anchors prevent impulsive clicks when the narrative is long.`,
    countryNursing: `Canadian nursing emphasizes patient-centered care, safety reporting culture, and interprofessional teamwork. Documentation is often electronic; privacy obligations under relevant health privacy law are taken seriously. ${province} employers may also require union orientation, mask fit testing, violence prevention training, and pathway-specific onboarding beyond registration.`,
    registration: `After passing the NCLEX-RN where applicable, registration still requires completing ${regulator} requirements such as jurisprudence, practice permits, and any provisional conditions. Pay attention to timelines for supplying final transcripts, employer confirmations, or additional competency remediation if requested. Bookmark ${authorityUrl} and review changes quarterly while you are in the application pipeline.`,
    faq: [
      ["Is the NCLEX-RN the same in every Canadian province?", "The exam is national, but registration steps, fees, and additional requirements are provincial through your regulator."],
      ["Do I need NNAS for every province?", "Not always; requirements vary by regulator and stream. Confirm on the regulator’s official IEN page."],
      ["How should I verify rumors about ‘faster’ provinces?", "Compare official eligibility matrices rather than social media anecdotes, because pathways change."],
    ],
    references: [APA_NCSBN, APA_NNAS, `${regulator}. (2026). Official registration resources. ${authorityUrl}`],
  };
}

export function buildUsNclexTopic(
  slug: string,
  title: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  boardHint: string,
  overviewExtra: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "United States",
    exam: "NCLEX-RN / Next Generation NCLEX (context varies by state board)",
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["United States", "NCLEX-RN", "NGN", "IEN", "NCSBN", "Clinical judgment"],
    regulatorLabel: boardHint,
    authorityUrl: "https://www.ncsbn.org/",
    takeaways: t8("NCLEX-RN", "the United States", boardHint),
    overview: `${overviewExtra} In the US, registered nursing is regulated by state boards of nursing under the umbrella guidance of the National Council of State Boards of Nursing (NCSBN). Internationally educated candidates usually complete credentials evaluation, meet state-specific coursework or English requirements, obtain authorization to test, and then pass the NCLEX-RN before receiving a license.`,
    eligibility: `Eligibility is not identical across states. Common elements include transcript review, criminal background checks, fingerprinting, English proficiency demonstrations where applicable, and sometimes remedial coursework if a board identifies gaps relative to a US nursing program graduate. Some states publish separate checklists for international graduates; treat those PDFs as your working project plan.`,
    structure: `The NCLEX uses computerized delivery with variable length and includes newer item types aligned with clinical judgment measurement. Expect case-style contexts that require multi-step reasoning rather than isolated knowledge recall. Many candidates also complete a separate jurisprudence or state law exam if required by the board where they apply.`,
    clinicalJudgment: `US-style items frequently test delegation to assistive personnel, informed consent, safe medication administration, and escalation when a patient deteriorates. For IENs, also watch for distractors that assume US default resources—choose answers consistent with safe nursing fundamentals rather than memorized hospital brand protocols.`,
    mistakes: `Avoid choosing an answer because it sounds “more medical.” Boards reward the licensed nurse’s role: assessment, communication, advocacy, safe administration within orders, and appropriate delegation. Another mistake is ignoring mental health, substance use, or infection control stems that embed stigma—choose respectful, safety-forward options.`,
    studyStrategies: `Use a three-pass system: first pass for recall foundations by system, second pass for mixed-topic timed sets, third pass for full simulations under strict timing with review only after the block ends. Keep an error log categorized by trap type: scope, priority, communication, calculation, or infection control.`,
    timeManagement: `If you work night shifts, anchor study to your circadian best window and protect sleep before practice tests. Use Pomodoro cycles for rationales on workdays and reserve three-hour weekend blocks for cumulative review.`,
    practiceStrategy: `After each question, articulate the rule in one sentence without looking at the explanation. If you cannot, add that topic to a “definitions” deck. For SATA items, decide whether each option is independently true for the scenario rather than hunting for a secret pair pattern.`,
    countryNursing: `US healthcare includes Magnet-designated hospitals, unionized workplaces, travel nursing contracts, and wide variation in staffing ratios by state and facility. Employers may require BLS and ACLS certifications, specialty certifications later, and competency validations on equipment. None of that replaces the board license, but it affects your first-year reality.`,
    registration: `Follow your board’s instructions for registering an application, paying fees, and monitoring a candidate portal. If you move states, understand endorsement versus examination applications and compact participation rules where applicable. CGFNS-related services are common on international routes; use official CGFNS guidance for document timelines.`,
    faq: [
      ["Is NCLEX the same in every state?", "The exam is national, but eligibility and post-pass registration steps are state-specific."],
      ["What is NGN in simple terms?", "It is an exam evolution that emphasizes clinical judgment measurement with richer item types and case contexts."],
      ["Can I study only US textbooks?", "Use board test plans and reputable prep, but keep practicing priority reasoning, not memorization alone."],
    ],
    references: [APA_NCSBN, APA_CGFNS],
  };
}

export function buildUkNmcTopic(
  slug: string,
  title: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  angle: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "United Kingdom",
    exam: "NMC Test of Competence (CBT and OSCE) and NMC registration requirements",
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["United Kingdom", "NMC", "OSCE", "CBT", "IEN", "NHS"],
    regulatorLabel: "Nursing and Midwifery Council (NMC)",
    authorityUrl: "https://www.nmc.org.uk/",
    takeaways: t8("NMC ToC", "the UK", "NMC", angle),
    overview: `${angle} The NMC maintains the UK register for nurses and midwives. Internationally educated nurses typically demonstrate English proficiency, complete a computer-based test (CBT), submit health and character declarations, pass an objective structured clinical examination (OSCE), and meet any additional skills or programme requirements outlined in NMC guidance.`,
    eligibility: `Eligibility depends on where you trained, whether your programme is recognized, and whether you meet English language standards acceptable to the NMC. You will also need evidence of health and good character. Because policy details change, treat the NMC’s international registration pages as the checklist for your cohort.`,
    structure: `The Test of Competence is delivered in two parts: a computer-based component and a practical OSCE that samples clinical and communication skills under standardized conditions. Preparation often includes simulation lab time, communication drills, and medication safety practice aligned to UK protocols and documentation norms.`,
    clinicalJudgment: `OSCE stations reward safe sequencing, consent, infection prevention, escalation when findings are abnormal, and compassionate communication. Written-style clinical judgment still appears in CBT content, so maintain UK-relevant pharmacology and acute care priorities alongside communication skills.`,
    mistakes: `Candidates sometimes rehearse scripts so rigidly that they fail to respond to patient cues in role-play. Others underestimate documentation language or the importance of showing a structured assessment rather than jumping to intervention.`,
    studyStrategies: `Blend communication coaching with clinical skills repetition. Record yourself in timed stations (with consent and privacy-safe practice partners) and debrief against mark scheme themes: safety, effectiveness, communication, documentation, and professionalism.`,
    timeManagement: `Backwards-plan from your OSCE date: reserve the final week for sleep hygiene and light review rather than cramming new skills. Earlier weeks should include repeated full circuits to build stamina.`,
    practiceStrategy: `Use a checklist template for every station: introduce, wash hands when indicated, gain consent, assess, explain plan, execute skill, reassure, and close with safety netting. Practice closing phrases that tell the patient what to report urgently.`,
    countryNursing: `NHS employers emphasize duty of candour, safeguarding, multidisciplinary teamwork, and continuing professional development. Revalidation is an ongoing professional responsibility after registration; understanding that framework early helps IENs plan continuing learning realistically.`,
    registration: `After successful tests and evidence review, follow NMC portal instructions carefully for registration fees and final declarations. Employer onboarding may include supernumerary periods and preceptorship; those are distinct from NMC registration but shape your first months.`,
    faq: [
      ["What is the difference between CBT and OSCE?", "CBT is computer-based knowledge and decision-making sampling; OSCE is a structured practical demonstration of skills and communication."],
      ["Do I need UK work experience before the OSCE?", "Policies and approved preparation providers evolve; follow current NMC and approved test centre guidance."],
      ["How do I confirm English evidence?", "Use the NMC’s published list of acceptable English tests and scores rather than informal advice."],
    ],
    references: [APA_NMC, `Nursing and Midwifery Council. (2026). English language requirements. https://www.nmc.org.uk/registration/joining-the-register/english-language-requirements/`],
  };
}

export function buildAustraliaObaTopic(
  slug: string,
  title: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  angle: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "Australia",
    exam: "Outcome-Based Assessment (OBA) pathway context (MCQ and OSCE-style components as published by Ahpra/NMBA)",
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["Australia", "Ahpra", "NMBA", "OBA", "IEN", "OSCE"],
    regulatorLabel: "Nursing and Midwifery Board of Australia (NMBA) / Ahpra",
    authorityUrl: "https://www.nursingmidwiferyboard.gov.au/",
    takeaways: t8("OBA", "Australia", "NMBA", angle),
    overview: `${angle} Australia’s national registration model uses Ahpra and the NMBA to set standards for internationally qualified nurses. The Outcome-Based Assessment pathway is designed to determine whether candidates demonstrate the competencies expected of an Australian entry-level registered nurse, commonly including a multi-choice exam component and a practical assessment component as described in official guidance materials.`,
    eligibility: `Eligibility typically includes proof of identity, qualification comparability, English language skills, registration history, and fitness to practise declarations. Because intake rules and exam availability can change, use Ahpra’s international graduate pathways pages for the authoritative sequence and fees.`,
    structure: `Official publications describe how assessment components sample knowledge and skills. Expect clinically authentic scenarios that integrate medication safety, escalation, documentation themes, and culturally safe communication aligned with Australian practice expectations.`,
    clinicalJudgment: `Australian items often emphasize teamwork with medical officers and allied health, rural and remote context awareness, and respectful care with Aboriginal and Torres Strait Islander peoples. Prioritize culturally safe approaches when stems include identity, mistrust of systems, or interpreter needs.`,
    mistakes: `Underestimating documentation nuance, confusing state employment rules with national registration, or assuming UK and Australian OSCE marking are identical. Each system has distinct mark schemes and station styles.`,
    studyStrategies: `Pair guideline reading with timed clinical scenarios. Focus on common high-acuity themes: sepsis recognition, fluid resuscitation principles within scope, ECG changes, and post-operative complications.`,
    timeManagement: `If you are migrating across time zones, shift your practice clocks gradually before high-stakes attempts so sleep and alertness match exam timing.`,
    practiceStrategy: `Train with written rationales spoken aloud to build fluency under pressure. For calculations, practice one method until automatic, then verify with a second check step as taught in medication safety frameworks.`,
    countryNursing: `Australian healthcare mixes public and private systems; staffing and skill mix vary. National registration is consistent, but local employer credentialing still matters for scope in specialty areas.`,
    registration: `After meeting assessment and qualification requirements, follow Ahpra’s application workflow for registration. Maintain a clean scanned archive of every submitted document for future renewals or endorsements.`,
    faq: [
      ["Is Australian registration national?", "Yes, nursing registration is national through Ahpra with the NMBA as the profession-specific board."],
      ["Where do I find the official OBA handbook?", "Use Ahpra and NMBA pages for internationally qualified nurses rather than unofficial PDF mirrors."],
      ["Do I need an employer before registration?", "Requirements vary by pathway and personal circumstances; confirm on official guidance."],
    ],
    references: [APA_NMBA, APA_AHPRA],
  };
}

export function buildNewZealandCapTopic(
  slug: string,
  title: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  angle: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "New Zealand",
    exam: "Competence Assessment Programme (CAP) and Nursing Council of New Zealand registration context",
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["New Zealand", "CAP", "IEN", "Nursing Council of New Zealand"],
    regulatorLabel: "Nursing Council of New Zealand",
    authorityUrl: "https://www.nursingcouncil.org.nz/",
    takeaways: t8("CAP", "New Zealand", "Nursing Council of New Zealand", angle),
    overview: `${angle} New Zealand uses the Nursing Council of New Zealand to set registration standards. Many internationally qualified nurses complete an approved Competence Assessment Programme that combines theory and supervised practice to demonstrate entry-level competence consistent with Te Tiriti o Waitangi expectations and local scope.`,
    eligibility: `Eligibility includes evidence of qualifications, registration history, good character, fitness to practise, and English language proficiency as specified by the Council. Some candidates may need refresher education depending on background and gap analysis.`,
    structure: `CAP structure varies by approved provider but generally blends coursework, simulation, and clinical placement with assessment milestones. Expect both written and practical evaluation aligned to New Zealand nursing competencies.`,
    clinicalJudgment: `Items and placements reward holistic assessment, family-inclusive care where appropriate, clear escalation, and culturally safe practice. Māori health models may appear in education; engage respectfully and avoid tokenistic phrases.`,
    mistakes: `Treating CAP as “only orientation” rather than a high-stakes competence demonstration. Another mistake is neglecting documentation standards used in local electronic health records.`,
    studyStrategies: `Integrate Te Tiriti-informed learning resources recommended by your educator, not random internet summaries. Pair communication practice with clinical skills drills.`,
    timeManagement: `Plan placement commuting and shift fatigue into your study calendar so exam-style review continues during clinical weeks without burnout.`,
    practiceStrategy: `Use debrief journals after each placement day: one success, one risk avoided, one learning goal for tomorrow.`,
    countryNursing: `New Zealand nursing roles may differ from your home country in delegation patterns, interprofessional titles, and medication brand names. Build a personal glossary early.`,
    registration: `After CAP completion and Council approval steps, follow online instructions for practising certificates and ongoing competency requirements.`,
    faq: [
      ["Is CAP always required?", "It depends on your pathway and Council assessment outcomes; verify for your cohort."],
      ["Where do I find approved CAP providers?", "Use the Nursing Council of New Zealand official lists."],
      ["Can I work before full registration?", "Only within lawful pathways; confirm with the Council and employers."],
    ],
    references: [APA_NCNZ],
  };
}

export function buildPhilippinesPnleTopic(
  slug: string,
  title: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  angle: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "Philippines",
    exam: "Philippine Nursing Licensure Examination (PNLE) and overseas placement prerequisites",
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["Philippines", "PNLE", "PRC", "Overseas nursing", "IEN"],
    regulatorLabel: "Professional Regulation Commission (PRC) — Board of Nursing",
    authorityUrl: "https://www.prc.gov.ph/",
    takeaways: t8("PNLE", "the Philippines", "PRC", angle),
    overview: `${angle} The PNLE is the national licensure examination for Filipino nursing graduates and is administered within the regulatory framework of the PRC. For nurses aiming abroad, PNLE licensure is often paired with additional verification, English testing, and employer or destination-country requirements.`,
    eligibility: `Eligibility for first-time takers is defined in PRC examination advisories, including completion of an accredited nursing programme and related application windows. Always read the official application memorandum for your testing cycle.`,
    structure: `The examination samples major nursing content domains using a national blueprint published for candidates. Preparation blends community health, medical-surgical, maternal-child, psychiatric, and professional nursing topics with legal and ethical foundations.`,
    clinicalJudgment: `Items reward prioritization, community-oriented prevention, and ethical obligations under Philippine nursing law contexts. For overseas intent, also begin building familiarity with destination-country practice standards early without confusing two legal systems.`,
    mistakes: `Memorizing recall lists without application, ignoring professional nursing and ethics sections, or delaying board application paperwork until the last week.`,
    studyStrategies: `Use group accountability with timed drills, then solo full-length practice. Maintain a running “trap notebook” for legal boundary questions.`,
    timeManagement: `Balance review with sleep before exam week; cognitive performance drops sharply with all-nighters.`,
    practiceStrategy: `Practice marking items in two passes: first pass fast enough to finish, second pass for flagged items only if your practice model allows.`,
    countryNursing: `Philippine nursing education is often cited for strong community health foundations; leverage that strength when studying population health and prevention-heavy items.`,
    registration: `After passing, follow PRC registration steps for professional identification and good standing certificates needed for many international employers and regulators.`,
    faq: [
      ["Is PNLE required for every overseas job?", "Many destinations require a license from your home country; verify each employer and regulator."],
      ["Where are official announcements posted?", "Rely on PRC memoranda rather than unverified social reposts."],
      ["Do I still need CGFNS or similar services?", "Depends on destination; US-bound routes frequently use CGFNS services for verification."],
    ],
    references: [APA_PRC, APA_CGFNS],
  };
}

export function buildIndiaIncOverseasTopic(
  slug: string,
  title: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  angle: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "India",
    exam: "Indian nursing regulation context and overseas licensing preparation for Indian-trained nurses",
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["India", "INC", "Overseas nursing", "IEN", "NCLEX", "NMC"],
    regulatorLabel: "Indian Nursing Council (INC) and state nursing councils",
    authorityUrl: "https://www.indiannursingcouncil.org/",
    takeaways: t8("Overseas licensing", "India", "INC and state nursing councils", angle),
    overview: `${angle} India trains large cohorts of nurses who pursue domestic registration and many who later seek overseas opportunities. The INC sets model standards while state nursing councils handle registration details. Overseas routes add destination-country exams, English tests, and credential verification services.`,
    eligibility: `Domestic registration and transcript issuance are foundational for many international applications. Destination countries may ask for detailed course descriptions, clinical hour logs, and good standing letters. Start those requests early because university and council processing times vary.`,
    structure: `Destination exams vary: US NCLEX, UK NMC tests, Gulf health authority exams, Canadian provincial routes, and others. Each has distinct blueprints; build a study plan mapped to the official test plan you are targeting rather than generic nursing trivia.`,
    clinicalJudgment: `International exams increasingly emphasize safety, prioritization, therapeutic communication, and scope. Indian-trained nurses often excel at knowledge breadth; complement that strength with timed judgment drills and communication framing in the destination language.`,
    mistakes: `Choosing unofficial “guaranteed pass” coaching without verifying quality, mixing outdated syllabus rumors with current INC or university requirements, or delaying English preparation until after technical review.`,
    studyStrategies: `Parallel-path your weeks: three technical sessions, two language sessions, and one administrative session for documents. Use spaced repetition for pharmacology and infection control because they recur across systems.`,
    timeManagement: `Batch administrative tasks on one weekday evening to protect weekend deep work blocks for simulations.`,
    practiceStrategy: `For SATA-style international items, practice identifying independent truths rather than pattern guessing.`,
    countryNursing: `Indian healthcare contexts can differ in nurse–physician collaboration norms, family involvement in decisions, and medication formulary names. Build flexible mental models that transfer to patient autonomy–forward frameworks used in many Western destination exams.`,
    registration: `Maintain state nursing council registration and understand renewal cycles. For overseas employers, keep notarized copies and digital backups of transcripts and registration certificates.`,
    faq: [
      ["Does INC replace state council registration?", "You need to understand both national standards and your state council’s operational steps."],
      ["Which exam should Indian nurses take?", "It depends on your destination country’s regulator; there is no universal single exam."],
      ["How do I avoid document fraud pitfalls?", "Use official channels for attestations and never alter academic records."],
    ],
    references: [APA_INC, APA_CGFNS],
  };
}

export function buildMiddleEastAuthorityTopic(
  slug: string,
  title: string,
  country: string,
  exam: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  regulatorLabel: string,
  authorityUrl: string,
  angle: string,
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country,
    exam,
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: [country, "Gulf nursing", "Prometric", "Dataflow", "IEN", "Clinical judgment"],
    regulatorLabel,
    authorityUrl,
    takeaways: t8(exam, country, regulatorLabel, angle),
    overview: `${angle} Many Middle Eastern health authorities use structured licensing workflows that can include primary source verification, Prometric-style examinations, and occupational classification steps. Names and workflows evolve, so treat employer HR and the regulator portal as paired sources of truth.`,
    eligibility: `Eligibility often includes authenticated educational certificates, experience letters, license verification from home countries, language requirements where stated, and fitness-to-practice declarations. Some routes require embassy or consular steps for attestation.`,
    structure: `Examinations may be multiple-choice clinical exams delivered at authorized test centres, sometimes paired with oral or practical assessments depending on category and authority. Read the candidate bulletin for your specific profession category rather than assuming RN rules from another country apply one-to-one.`,
    clinicalJudgment: `Items frequently emphasize emergency triage, medication safety, infection control in hospital outbreaks, chronic disease complications, and respectful communication across languages. Interpreters and family presence policies may appear as ethics stems.`,
    mistakes: `Buying outdated question banks as substitutes for official syllabi, skipping Dataflow or verification steps until a job offer arrives, or assuming a tourist visa status can convert to work licensing without legal guidance.`,
    studyStrategies: `Anchor to emergency care, medical-surgical, maternal-child, and community priorities common in international licensing item banks, then add local notifiable disease priorities if your bulletin lists them.`,
    timeManagement: `Verification pipelines can take months; start early and track each agency’s status portal weekly.`,
    practiceStrategy: `Train with mixed-topic 75-question blocks if your bulletin suggests that volume, then review misses by organ system.`,
    countryNursing: `Gulf healthcare systems often include large expatriate workforces; teamwork across languages is routine. Expect rapid patient turnover in some hospitals and strong protocols for escalation to senior medical staff.`,
    registration: `After passing required exams and verification, follow the health authority portal for license card issuance, renewals, and employer sponsorship steps where applicable.`,
    faq: [
      ["Are Middle East exams identical across countries?", "No. Each authority publishes its own categories, fees, and syllabi."],
      ["What is primary source verification?", "It is a documented check with your school and licensing bodies; timelines vary by agency workload."],
      ["Should I trust third-party ‘visa plus exam’ packages?", "Verify each step against regulator requirements; packages vary in quality."],
    ],
    references: [
      `${regulatorLabel}. (2026). Official licensing information portal. ${authorityUrl}`,
      APA_CGFNS,
    ],
  };
}

export function buildGlobalCrossCuttingTopic(
  slug: string,
  title: string,
  exam: string,
  excerpt: string,
  seoTitle: string,
  seoDescription: string,
  angle: string,
  refs: string[],
): InternationalLicensingTopicSpec {
  return {
    slug,
    title,
    country: "International (multi-country)",
    exam,
    excerpt,
    seoTitle,
    seoDescription,
    category: "International nursing licensure",
    tags: ["IEN", "Global nursing", "Licensure", "Exam preparation", "Clinical judgment"],
    regulatorLabel: "Multiple regulators (compare official portals)",
    authorityUrl: "https://www.who.int/news-room/fact-sheets/detail/health-workforce",
    takeaways: t8(exam, "multiple countries", "your destination regulator", angle),
    overview: `${angle} This article is intentionally cross-national: it helps you build portable study habits while you finalize a destination. Licensing is national or subnational law, so always branch from orientation content to official regulator instructions before making financial commitments.`,
    eligibility: `Eligibility patterns repeat: verified education, language evidence, good character, registration history, and sometimes refresher education. The ordering of steps differs; draw your own flowchart from official PDFs rather than copying a stranger’s timeline screenshot.`,
    structure: `Most high-stakes routes combine a knowledge test, communication evidence, and administrative verification. Some add supervised practice or adaptation programmes. Map components on a calendar with realistic buffers.`,
    clinicalJudgment: `Cross-national exams still reward the same patient safety spine: assessment first, escalate when red flags appear, protect airway and circulation, respect autonomy, and communicate clearly.`,
    mistakes: `Treating Facebook groups as authoritative, mixing immigration advice with licensure advice without professionals, or assuming one English exam score satisfies every country.`,
    studyStrategies: `Build a bilingual glossary of the top 200 nursing verbs used in stems and rationales. Pair it with weekly simulated cases spoken aloud.`,
    timeManagement: `Use “administrative Fridays” for emails and uploads; keep “clinical Saturdays” for practice tests.`,
    practiceStrategy: `Rotate formats weekly: standalone, case cluster, SATA, and calculation blocks.`,
    countryNursing: `Wherever you land, learn local scope rules early: who can prescribe, how verbal orders are handled, and what mandatory reporting requires.`,
    registration: `Keep a single cloud folder with dated filenames for every PDF you submit. Future endorsement applications will reuse that archive.`,
    faq: [
      ["Is there one global nursing license?", "No. Registration remains jurisdiction-specific."],
      ["Which English test should I take?", "Choose the test and score band accepted by your regulator list, not the easiest rumor."],
      ["How do I pick a destination?", "Weight family, immigration feasibility, employer demand, and licensure pathway length together."],
    ],
    references: refs.length ? refs : [APA_NCSBN, APA_CGFNS],
  };
}
