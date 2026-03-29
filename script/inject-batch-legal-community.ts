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
  "hipaa-phipa-rpn": {
    title: "HIPAA and PHIPA Privacy Legislation for Practical Nurses",
    cellular: {
      title: "Understanding Health Privacy Legislation: HIPAA and PHIPA",
      content: "Health information privacy is a foundational legal and ethical obligation for every practical nurse. Two major privacy frameworks govern the handling of patient health information in North America: the Health Insurance Portability and Accountability Act (HIPAA) in the United States and the Personal Health Information Protection Act (PHIPA) in Ontario, Canada. While each jurisdiction has its own specific legislation, the underlying principles of patient privacy, data security, and controlled information sharing are remarkably similar and form the backbone of professional nursing practice in any setting. HIPAA was enacted in 1996 and has been amended multiple times, most significantly by the Health Information Technology for Economic and Clinical Health (HITECH) Act of 2009, which strengthened enforcement and introduced breach notification requirements. HIPAA applies to covered entities including healthcare providers, health plans, and healthcare clearinghouses, as well as their business associates. The Privacy Rule within HIPAA establishes national standards for the protection of individually identifiable health information, known as Protected Health Information (PHI). PHI encompasses any information that can identify a patient and relates to their past, present, or future physical or mental health condition, the provision of healthcare, or payment for healthcare services. This includes obvious identifiers such as name, date of birth, Social Security number, and medical record number, but also extends to photographs, biometric data, IP addresses, and any combination of data elements that could reasonably identify an individual. The Security Rule within HIPAA mandates specific administrative, physical, and technical safeguards to protect electronic PHI (ePHI). Administrative safeguards include workforce training, access management policies, and security incident procedures. Physical safeguards address facility access controls, workstation security, and device disposal protocols. Technical safeguards encompass access controls, audit controls, integrity controls, and transmission security including encryption requirements. PHIPA, enacted in Ontario in 2004, governs the collection, use, and disclosure of personal health information by health information custodians (HICs). HICs include healthcare practitioners, hospitals, long-term care facilities, pharmacies, laboratories, and public health agencies. Under PHIPA, personal health information includes information about an individuals physical or mental health, family health history, healthcare history, health plan eligibility, health number, substitute decision-maker information, and donation-related information. A critical concept under both HIPAA and PHIPA is the circle of care, which refers to the group of healthcare providers who are directly involved in providing care to a patient and who may share information for that purpose without explicit patient consent, provided the information sharing is necessary for the provision of care. Under PHIPA, this implied consent within the circle of care is a key feature, meaning healthcare providers involved in a patients treatment may access and share relevant health information without obtaining express consent each time, as long as the patient has not expressly withheld or withdrawn consent. However, providers outside the circle of care -- such as insurance companies, employers, family members not involved in care decisions, or researchers -- require express written consent before accessing patient information. The minimum necessary standard (HIPAA) and the principle of limiting collection, use, and disclosure to what is necessary (PHIPA) both require that healthcare workers access only the information they need to perform their specific job functions. A practical nurse caring for a patient on a medical unit does not need to access the psychiatric records of a patient on another unit. Both HIPAA and PHIPA mandate breach notification when unauthorized access, use, or disclosure of health information occurs. Under HIPAA, breaches affecting 500 or more individuals must be reported to the Department of Health and Human Services (HHS) and prominent media outlets within 60 days, while smaller breaches must be logged and reported annually. Under PHIPA, health information custodians must notify affected individuals at the first reasonable opportunity and report the breach to the Information and Privacy Commissioner of Ontario (IPC) if the breach meets certain thresholds of significance. Practical nurses must understand that privacy violations carry serious consequences. Under HIPAA, civil penalties range from 100 to 50,000 dollars per violation, with annual maximums of 1.5 million dollars per violation category, and criminal penalties can include fines up to 250,000 dollars and imprisonment up to 10 years for offenses committed with intent to sell or use PHI for personal gain. Under PHIPA, individuals who willfully contravene the Act can be fined up to 200,000 dollars for individuals and 1,000,000 dollars for organizations. Healthcare facilities may also face regulatory sanctions, loss of accreditation, and civil lawsuits from affected patients. Common privacy breaches in nursing practice include discussing patient information in public areas such as elevators, cafeterias, or hallways; leaving computer screens with patient information visible and unattended; sharing login credentials; accessing medical records of patients not under the nurses direct care (including those of family members, friends, coworkers, or public figures); posting patient information or identifiable photographs on social media; sending unencrypted patient information via text message or personal email; and improper disposal of documents containing PHI (failure to shred or use secure disposal bins). The practical nurse plays a critical role in maintaining privacy through consistent daily practices: always logging out of electronic health records before leaving a workstation, verifying patient identity before disclosing information over the telephone, positioning computer screens away from public view, using privacy curtains during assessments and conversations, speaking quietly during bedside shift reports, and promptly reporting any suspected or actual breach through the facilitys incident reporting system."
    },
    riskFactors: [
      "High-volume patient care environments where information is frequently exchanged verbally and electronically",
      "Use of portable electronic devices (smartphones, tablets, USB drives) that may be lost, stolen, or accessed by unauthorized individuals",
      "Shared workstation environments where multiple staff access the same computers without consistent log-off practices",
      "Open-concept nursing stations where conversations can be overheard by visitors, patients, or non-clinical staff",
      "Inadequate staff training on privacy policies, breach reporting procedures, and secure communication methods",
      "Use of personal email, text messaging, or social media for patient-related communication without encryption or authorization",
      "High staff turnover or use of temporary/agency staff unfamiliar with facility-specific privacy protocols"
    ],
    diagnostics: [
      "Privacy impact assessment (PIA): systematic evaluation conducted before implementing new systems or processes that involve personal health information to identify and mitigate privacy risks",
      "Access audit logs: electronic health record systems generate audit trails showing who accessed what information and when; regular review identifies unauthorized access patterns",
      "Breach risk assessment: structured evaluation following a suspected or confirmed privacy incident to determine scope, severity, and notification requirements",
      "Staff competency evaluation: annual testing of healthcare workers on privacy policies, procedures, and obligations under applicable legislation",
      "Physical security assessment: evaluation of workstation placement, screen visibility, document disposal practices, and facility access controls",
      "Communication channel audit: review of all channels used for transmitting patient information (fax, email, electronic messaging) to confirm encryption and security compliance"
    ],
    management: [
      "Implement mandatory annual privacy training for all healthcare workers including practical nurses, with documented completion and competency testing",
      "Establish clear policies for minimum necessary access and role-based access controls in electronic health record systems",
      "Deploy automatic session timeout and screen lock on all workstations after a defined period of inactivity (typically 2-5 minutes)",
      "Maintain documented breach response protocols including immediate containment, investigation, notification procedures, and corrective action plans",
      "Require encryption for all electronic transmission of patient information including email, messaging, and portable media devices",
      "Install privacy screens on computer monitors in areas visible to patients, visitors, or unauthorized personnel",
      "Conduct regular random audits of electronic health record access logs to detect and address unauthorized access"
    ],
    nursingActions: [
      "Log out of all electronic health record sessions before leaving a workstation, even temporarily -- never share login credentials with colleagues",
      "Verify the identity of any person requesting patient information by telephone using at least two patient identifiers before releasing any information",
      "Use only facility-approved secure communication channels (encrypted messaging, secure fax) for transmitting patient health information",
      "Ensure bedside conversations about patient conditions occur with privacy curtains drawn and voices kept at a level that prevents overhearing by others",
      "Report any suspected or confirmed privacy breach immediately through the facilitys incident reporting system, regardless of perceived severity",
      "Dispose of all documents containing patient information using designated secure disposal methods (locked shredding bins, approved shredding services)",
      "Never access the medical records of any patient not under your direct care, including records of family members, coworkers, or public figures"
    ],
    assessmentFindings: [
      "Unattended computer screens displaying patient information in areas accessible to visitors or unauthorized staff",
      "Staff discussing identifiable patient details in public areas (elevators, cafeterias, hallways, parking lots)",
      "Documents containing PHI found in regular waste receptacles rather than secure shredding bins",
      "Evidence of shared login credentials or generic login accounts being used by multiple staff members",
      "Patient complaints regarding perceived privacy violations during care delivery or information sharing",
      "Social media posts or personal electronic messages containing identifiable patient information or photographs",
      "Failure to close or lock medication carts, chart racks, or paper records when not in active use"
    ],
    signs: {
      left: [
        "Staff unsure of which information can be shared within the circle of care",
        "Inconsistent workstation log-off practices across units",
        "Privacy curtains not consistently used during assessments",
        "Patients overhearing staff conversations about other patients",
        "Minor delays in reporting privacy concerns to supervisors",
        "Uncertainty about proper disposal methods for printed PHI"
      ],
      right: [
        "Confirmed unauthorized access to patient records (snooping)",
        "PHI disclosed to unauthorized individuals or posted publicly on social media",
        "Loss or theft of unencrypted devices containing patient data",
        "Intentional access of records for personal or financial gain",
        "Failure to report a known breach resulting in harm to patients",
        "Systematic breach affecting large numbers of patient records"
      ]
    },
    medications: [
      {
        name: "Incident Report Form",
        type: "Documentation Tool",
        action: "Standardized form used to document suspected or confirmed privacy breaches including the date, time, nature of the incident, individuals involved, information compromised, and immediate actions taken; serves as the official record for investigation and regulatory reporting",
        sideEffects: "Potential staff anxiety about documentation; possible delayed reporting if form is perceived as complex; requires accurate and honest completion to be effective",
        contra: "Should not replace verbal notification to supervisor; should not be used as a punitive instrument in a just culture environment; incomplete or inaccurate forms impede investigation",
        pearl: "Complete the incident report as soon as possible after discovering the breach while details are fresh; include objective facts only without speculation or blame; the report is a quality improvement tool not a disciplinary document"
      },
      {
        name: "Privacy Impact Assessment",
        type: "Documentation Tool",
        action: "Systematic prospective analysis conducted before implementing new programs, technologies, or processes that involve personal health information to identify privacy risks, evaluate their likelihood and impact, and recommend mitigations before launch",
        sideEffects: "Time-intensive to complete thoroughly; may delay implementation timelines; requires input from multiple stakeholders including clinical, IT, and legal teams",
        contra: "Should not be treated as a one-time exercise; must be revisited when significant changes occur to the system or process being assessed; inadequate PIAs may create a false sense of compliance",
        pearl: "A well-conducted PIA identifies risks before they become breaches; practical nurses may be asked to provide frontline input on workflow risks; document all identified risks and corresponding mitigation strategies"
      },
      {
        name: "Breach Notification Protocol",
        type: "Documentation Tool",
        action: "Structured procedure that outlines the steps required to notify affected individuals, regulatory bodies, and organizational leadership following a confirmed privacy breach; includes templated notification letters, regulatory filing procedures, and remediation action plans",
        sideEffects: "Notification may cause patient distress or erode trust in the healthcare organization; media attention for large-scale breaches; potential regulatory scrutiny and financial penalties",
        contra: "Must not be activated without proper investigation confirming a breach has occurred; premature notification without facts may cause unnecessary alarm; must comply with jurisdiction-specific timelines and requirements",
        pearl: "Under HIPAA, breaches affecting 500 or more individuals require notification within 60 days and reporting to media; under PHIPA, notification must occur at the first reasonable opportunity; practical nurses should know their facilitys internal escalation pathway"
      }
    ],
    pearls: [
      "The circle of care includes only those healthcare providers directly involved in the patients current treatment -- implied consent allows information sharing within this circle, but express consent is needed for anyone outside it",
      "The minimum necessary standard requires accessing only the specific patient information needed to perform your current nursing duties -- curiosity is never a valid reason to access a medical record",
      "HIPAA civil penalties can reach 1.5 million dollars per violation category per year; PHIPA fines can reach 200,000 dollars for individuals -- privacy violations carry real legal and financial consequences",
      "Common nursing privacy mistakes include discussing patients in elevators, leaving screens unlocked, sharing passwords, and texting patient information on personal phones -- all are preventable",
      "Under both HIPAA and PHIPA, patients have the right to access their own health information, request corrections, and receive an accounting of disclosures made without their authorization",
      "Social media is a high-risk area for privacy breaches -- never post patient stories, photographs, or any combination of details that could identify a patient, even if the name is not used",
      "A just culture approach to privacy breaches distinguishes between human error (system improvement), at-risk behavior (coaching), and reckless behavior (disciplinary action) -- this encourages reporting and learning"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient and a family member calls requesting information about the patients condition. What should the nurse do first?",
        options: [
          "Provide the information since family members are part of the circle of care",
          "Verify the callers identity and check whether the patient has authorized information sharing with that individual",
          "Refuse to provide any information over the telephone under any circumstances",
          "Transfer the call to the physician to handle the disclosure"
        ],
        correct: 1,
        rationale: "The nurse must verify the callers identity and confirm that the patient has authorized disclosure to that individual. Family members are not automatically part of the circle of care. Patients have the right to restrict who receives their health information. Simply refusing or transferring the call does not fulfill the nurses responsibility to follow privacy protocols."
      },
      {
        question: "A practical nurse accidentally sends a fax containing patient lab results to an incorrect fax number. Which action should the nurse take first?",
        options: [
          "Wait to see if anyone at the wrong number contacts the facility",
          "Notify the supervisor and complete an incident report immediately",
          "Resend the fax to the correct number and disregard the error",
          "Delete the sent fax record from the machine log"
        ],
        correct: 1,
        rationale: "Any misdirected patient health information constitutes a potential privacy breach and must be reported immediately. The nurse should notify the supervisor and complete an incident report so that the breach can be investigated, the recipient contacted to request destruction of the information, and appropriate notifications made as required by HIPAA or PHIPA."
      },
      {
        question: "Under the minimum necessary standard, which action by a practical nurse would be considered a privacy violation?",
        options: [
          "Reviewing the medication administration record for a patient currently assigned to the nurse",
          "Accessing the medical record of a neighboring units patient who is a personal friend of the nurse",
          "Documenting assessment findings in the electronic health record for an assigned patient",
          "Reading the care plan of an assigned patient before providing morning care"
        ],
        correct: 1,
        rationale: "The minimum necessary standard requires that healthcare workers access only the information needed to perform their job duties. Accessing the record of a patient on another unit who is a personal friend constitutes unauthorized access (snooping) and violates both HIPAA and PHIPA, regardless of the nurses intent."
      }
    ]
  },

  "hospice-vs-palliative-rpn": {
    title: "Hospice Care Versus Palliative Care for Practical Nurses",
    cellular: {
      title: "Understanding Hospice and Palliative Care Models",
      content: "Hospice care and palliative care are two distinct but closely related approaches to caring for patients with serious, life-limiting, or terminal illnesses. While these terms are sometimes used interchangeably in casual conversation, they represent fundamentally different models of care delivery with different eligibility criteria, goals, timing, and reimbursement structures. Understanding these distinctions is essential for practical nurses who provide direct care to patients and families navigating end-of-life decisions. Palliative care is a specialized approach that focuses on providing relief from the symptoms, pain, and stress of a serious illness regardless of the diagnosis or stage of disease. The World Health Organization defines palliative care as an approach that improves the quality of life of patients and their families facing problems associated with life-threatening illness, through the prevention and relief of suffering by means of early identification, impeccable assessment, and treatment of pain and other problems including physical, psychosocial, and spiritual needs. A critical distinction is that palliative care can be provided at any point in the illness trajectory, including at the time of diagnosis, alongside curative or life-prolonging treatments. A patient receiving chemotherapy for cancer, for example, can simultaneously receive palliative care services to manage pain, nausea, fatigue, and psychological distress. Palliative care is not limited to end-of-life situations and does not require the patient to forgo curative treatment. Hospice care, by contrast, is a specific model of palliative care designed for patients who are in the terminal phase of their illness. In the United States, Medicare hospice benefit eligibility requires that a physician certify the patient has a prognosis of six months or less if the disease follows its normal course, and the patient must elect to forgo curative treatment in favor of comfort-focused care. In Canada, hospice care models vary by province but generally share the principle that the focus shifts entirely to comfort, dignity, and quality of life when curative treatment is no longer beneficial or desired by the patient. Hospice care can be delivered in multiple settings including the patients home (the most common setting), dedicated hospice facilities (freestanding hospice houses), hospital-based hospice units, and long-term care facilities. The hospice model emphasizes a holistic, interdisciplinary approach. The hospice team typically includes the attending physician, hospice medical director, registered nurses, practical nurses, social workers, chaplains or spiritual counselors, trained volunteers, bereavement counselors, home health aides, and therapists (physical, occupational, speech) as needed. This interdisciplinary team develops an individualized plan of care that addresses the patients physical, emotional, social, and spiritual needs while also providing support to the family and caregivers throughout the dying process and into the bereavement period (typically for 13 months after the patients death). Symptom management is the cornerstone of both hospice and palliative care. The practical nurse plays a vital role in assessing and managing symptoms including pain, dyspnea, nausea, constipation, anxiety, delirium, and terminal secretions. Pain management follows the World Health Organization analgesic ladder, starting with non-opioid analgesics and advancing to strong opioids as needed. In hospice and palliative care, there is often concern about opioid use, but the principle of double effect provides ethical justification: administering medication with the primary intent of relieving suffering is ethically permissible even if a foreseeable but unintended secondary effect is hastening death. This principle is widely accepted in nursing ethics and is supported by professional regulatory bodies. The practical nurse must also understand the emotional and psychological dimensions of end-of-life care. Patients and families experience a range of emotions including denial, anger, bargaining, depression, and acceptance (Kubler-Ross model), though these stages are not linear and individuals may move between them or experience multiple stages simultaneously. Anticipatory grief -- grief experienced before the actual death -- affects both patients and family members and is a normal response to impending loss. The practical nurse can support patients and families by providing active listening, being present, validating emotions, providing honest and compassionate information, and facilitating connections with spiritual care providers, social workers, and bereavement services. Advance care planning is integral to both hospice and palliative care. Key documents include advance directives (living will and durable power of attorney for healthcare or substitute decision-maker designation), do-not-resuscitate (DNR) orders, and Medical Assistance in Dying (MAID) documentation in Canadian jurisdictions where applicable. The practical nurse should ensure that these documents are present in the patients chart, that the healthcare team is aware of the patients wishes, and that care is delivered in accordance with those wishes. The nurse must never impose personal values or beliefs on the patients end-of-life decisions. Comfort measures at end of life include oral care (moist swabs for dry mouth), skin care (repositioning to prevent pressure injuries, gentle cleansing), eye care (artificial tears for corneal drying), management of terminal secretions (repositioning, scopolamine), temperature management, and maintaining a calm, quiet environment. The practical nurse should educate family members about expected changes during the dying process including Cheyne-Stokes respirations, mottling of the skin, decreased urine output, decreased level of consciousness, and the death rattle (noisy breathing due to secretion accumulation in the airway), reassuring them that these are normal physiological processes and that the patient is typically not in distress."
    },
    riskFactors: [
      "Late referral to hospice services (average hospice length of stay is often less than 30 days despite 6-month eligibility, limiting the benefit patients and families receive)",
      "Inadequate pain and symptom management due to fear of opioid use, regulatory concerns, or insufficient prescribing in end-of-life care",
      "Cultural or religious beliefs that may conflict with hospice philosophy, leading to delayed acceptance or refusal of comfort-focused care",
      "Caregiver burnout and compassion fatigue in family members providing home-based hospice care without adequate support services",
      "Ambiguous or absent advance directives leading to unwanted aggressive interventions at end of life",
      "Healthcare provider discomfort with end-of-life discussions resulting in delayed goals-of-care conversations",
      "Financial concerns or misunderstanding of hospice benefit coverage leading patients to delay or decline enrollment"
    ],
    diagnostics: [
      "Palliative Performance Scale (PPS): validated tool measuring ambulation, activity level, self-care, intake, and consciousness to quantify functional decline and estimate prognosis",
      "Edmonton Symptom Assessment System (ESAS): patient-reported screening tool rating nine common symptoms (pain, fatigue, nausea, depression, anxiety, drowsiness, appetite, wellbeing, dyspnea) on 0-10 scales",
      "Palliative Prognostic Index (PPI): combines PPS score with clinical symptoms (oral intake, edema, dyspnea at rest, delirium) to estimate survival in weeks",
      "CAGE questionnaire and opioid risk assessment: screening tools used before initiating opioid therapy to identify patients at risk for substance use disorder even in palliative settings",
      "Spiritual assessment (FICA tool): Faith, Importance, Community, Address -- structured assessment of patients spiritual needs and preferences to guide chaplaincy referrals",
      "Caregiver burden assessment (Zarit Burden Interview): standardized tool measuring the physical, emotional, and financial impact of caregiving to identify families needing additional support"
    ],
    management: [
      "Establish individualized symptom management plans addressing pain, dyspnea, nausea, constipation, anxiety, delirium, and terminal secretions using evidence-based protocols",
      "Facilitate early and ongoing goals-of-care discussions with patients and families to ensure care aligns with patient values, preferences, and advance directives",
      "Coordinate interdisciplinary team meetings (at minimum every 15 days in hospice) to review and update the plan of care based on changing patient needs",
      "Provide anticipatory guidance to families about expected physiological changes during the dying process to reduce fear and prevent unnecessary emergency calls",
      "Ensure 24-hour on-call nursing support is available for hospice patients and families experiencing symptom crises or emotional distress",
      "Implement bowel regimen prophylactically for all patients receiving opioid therapy (stimulant laxative plus stool softener) to prevent opioid-induced constipation",
      "Initiate bereavement support for family members beginning before the patients death and continuing for at least 13 months afterward"
    ],
    nursingActions: [
      "Assess pain using validated tools at every visit and before and after interventions; titrate medications as prescribed to achieve the patients comfort goal",
      "Monitor for and manage terminal secretions using repositioning (side-lying with head slightly elevated) and anticholinergic medications as ordered; reassure families that the death rattle does not indicate patient distress",
      "Provide meticulous oral care using moist swabs, lip balm, and small ice chips (if patient can swallow) to maintain comfort for patients who are no longer taking oral fluids",
      "Educate family caregivers on medication administration, including sublingual and rectal routes for patients who can no longer swallow oral medications",
      "Document patient wishes regarding resuscitation status, preferred place of death, spiritual practices, and after-death care preferences in the medical record",
      "Assess caregiver coping and wellbeing at each visit; provide respite care referrals and emotional support to prevent caregiver burnout",
      "Report any signs of uncontrolled symptoms (intractable pain rated above patient goal, respiratory distress, agitation, seizures) to the hospice team immediately for medication adjustment"
    ],
    assessmentFindings: [
      "Declining Palliative Performance Scale score indicating progressive functional deterioration (ambulation, self-care, intake, consciousness)",
      "Increased sleep and decreased responsiveness as death approaches, progressing from drowsiness to obtundation to unresponsiveness",
      "Changes in breathing pattern including Cheyne-Stokes respirations (alternating apnea and hyperpnea), terminal apnea, and mandibular breathing (jaw movement without effective ventilation)",
      "Peripheral cyanosis and mottling of extremities progressing proximally, indicating circulatory shutdown",
      "Decreased urine output progressing to anuria, with urine becoming concentrated and dark",
      "Terminal secretions (death rattle) caused by accumulation of secretions in the oropharynx and trachea that the patient can no longer clear",
      "Cool extremities with preserved warmth of trunk, loss of radial pulse with preserved carotid pulse"
    ],
    signs: {
      left: [
        "Increasing fatigue and need for rest throughout the day",
        "Decreased appetite and oral intake",
        "Social withdrawal and decreased interest in activities",
        "Mild intermittent pain managed with current regimen",
        "Increased time in bed with preserved ability to communicate",
        "Mild anxiety about disease progression or death"
      ],
      right: [
        "Intractable pain not responsive to current analgesic regimen requiring urgent reassessment",
        "Severe dyspnea or air hunger causing visible distress",
        "Terminal agitation or delirium with restlessness, moaning, or grimacing",
        "Active hemorrhage (hematemesis, hemoptysis, massive rectal bleeding)",
        "Status epilepticus or recurrent seizures in terminal phase",
        "Acute respiratory distress or choking requiring immediate intervention"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system and peripheral tissues, inhibiting ascending pain pathways, altering pain perception and emotional response to pain, and reducing the sensation of dyspnea by decreasing the central respiratory drive response to hypoxia and hypercapnia",
        sideEffects: "Constipation (most common, does not develop tolerance), nausea and vomiting (usually transient), sedation, respiratory depression (dose-dependent), pruritus, urinary retention, myoclonus at high doses",
        contra: "Severe respiratory depression without monitoring capability; known hypersensitivity; paralytic ileus; use with extreme caution in renal impairment (active metabolites accumulate causing neurotoxicity)",
        pearl: "In hospice and palliative care, there is no ceiling dose for morphine -- the correct dose is the dose that controls the patients symptoms; always initiate a prophylactic bowel regimen when starting opioid therapy; oral morphine is available in immediate-release (onset 30 minutes) and sustained-release (onset 2-4 hours) formulations"
      },
      {
        name: "Scopolamine (Hyoscine)",
        type: "Anticholinergic (muscarinic receptor antagonist)",
        action: "Blocks muscarinic acetylcholine receptors in smooth muscle, secretory glands, and the central nervous system, reducing salivary, bronchial, and gastrointestinal secretions; used in end-of-life care to manage terminal secretions (death rattle) and to reduce nausea",
        sideEffects: "Dry mouth, urinary retention, blurred vision, tachycardia, drowsiness, confusion, paradoxical agitation (especially in elderly patients), constipation",
        contra: "Angle-closure glaucoma; myasthenia gravis; severe prostatic hypertrophy with urinary obstruction; tachyarrhythmias",
        pearl: "Available as transdermal patch (applied behind the ear, effective for 72 hours) or subcutaneous injection for terminal secretions; most effective when started early before large volumes of secretions accumulate; reassure families that the death rattle does not indicate the patient is choking or suffering"
      },
      {
        name: "Haloperidol (Haldol)",
        type: "Antipsychotic (dopamine D2 receptor antagonist)",
        action: "Blocks dopamine D2 receptors in the mesolimbic pathway and chemoreceptor trigger zone, reducing psychotic symptoms, agitation, and nausea; used in palliative care for terminal delirium, agitation, and refractory nausea and vomiting",
        sideEffects: "Extrapyramidal symptoms (dystonia, akathisia, parkinsonism), QT prolongation, sedation, orthostatic hypotension, neuroleptic malignant syndrome (rare but life-threatening with hyperthermia, rigidity, altered consciousness, autonomic instability)",
        contra: "Parkinson disease or Lewy body dementia (severe worsening of motor symptoms); severe QT prolongation or concurrent use of other QT-prolonging drugs; CNS depression from other agents; known hypersensitivity",
        pearl: "Low-dose haloperidol (0.5-2 mg PO, SC, or IV every 4-8 hours) is first-line for terminal delirium and agitation in palliative care; monitor ECG for QT prolongation; can be administered subcutaneously when IV access is unavailable and oral route is not possible"
      }
    ],
    pearls: [
      "Palliative care can begin at diagnosis and coexist with curative treatment; hospice care requires a 6-month prognosis (US Medicare) and a shift to comfort-focused goals with discontinuation of curative interventions",
      "The principle of double effect permits administering opioids and sedatives to relieve suffering even if a foreseeable but unintended effect may be hastening death -- the primary intent must be symptom relief",
      "Late hospice referral is one of the most common barriers to quality end-of-life care -- the average hospice length of stay is often under 30 days, far shorter than the 6-month eligibility window",
      "Always initiate a prophylactic bowel regimen (stimulant laxative plus stool softener) when starting opioid therapy in palliative care -- opioid-induced constipation does not develop tolerance over time",
      "Terminal secretions (death rattle) are distressing to families but typically do not cause patient discomfort -- gentle repositioning and anticholinergic medications are first-line management",
      "Educate families about expected physiological changes during the dying process (Cheyne-Stokes breathing, mottling, decreased urine output, decreased consciousness) to reduce fear and prevent unnecessary 911 calls",
      "Bereavement support is a core component of hospice care and should begin before the patients death with anticipatory grief support and continue for at least 13 months after death for surviving family members"
    ],
    quiz: [
      {
        question: "A patient with stage IV pancreatic cancer asks the practical nurse about the difference between palliative care and hospice care. Which response by the nurse is most accurate?",
        options: [
          "Palliative care and hospice care are the same thing and can be used interchangeably",
          "Palliative care can be provided at any stage of illness alongside curative treatment, while hospice care is for patients with a terminal prognosis who have chosen comfort-focused goals",
          "Hospice care provides aggressive treatment to cure the disease, while palliative care focuses only on pain management",
          "Palliative care is only available in hospitals, while hospice care is only available at home"
        ],
        correct: 1,
        rationale: "Palliative care can begin at any point during a serious illness and can be provided concurrently with curative or life-prolonging treatments. Hospice care is a specialized form of palliative care for patients with a terminal prognosis (typically 6 months or less) who have elected to focus on comfort rather than cure."
      },
      {
        question: "A family member of a hospice patient is distressed by the rattling sound in the patients breathing. Which nursing action is most appropriate?",
        options: [
          "Suction the patient aggressively every 30 minutes to clear secretions",
          "Explain that the sound (death rattle) is caused by secretion accumulation and typically does not cause patient distress, then reposition the patient and administer anticholinergic medication as ordered",
          "Increase the patients IV fluid rate to thin the secretions",
          "Call 911 for emergency respiratory support"
        ],
        correct: 1,
        rationale: "Terminal secretions (death rattle) are caused by the patients inability to clear normal oropharyngeal secretions as consciousness declines. The sound is typically more distressing to families than to the patient. Management includes gentle repositioning (side-lying), anticholinergic medications (scopolamine or glycopyrrolate), and family education. Aggressive suctioning is not recommended as it is uncomfortable and typically ineffective."
      },
      {
        question: "A practical nurse is administering morphine to a hospice patient for dyspnea. The patients respiratory rate is 10 breaths per minute and the patient reports feeling comfortable. What should the nurse do?",
        options: [
          "Withhold the morphine because the respiratory rate is below 12",
          "Continue administering morphine as prescribed since the patient is comfortable and the respiratory rate is adequate for oxygenation",
          "Administer naloxone immediately to reverse the opioid effects",
          "Notify the physician of an emergency and request transfer to the hospital"
        ],
        correct: 1,
        rationale: "In hospice and palliative care, the goal is patient comfort. A respiratory rate of 10 with the patient reporting comfort is an acceptable and expected effect of opioid therapy. Withholding medication would cause unnecessary suffering. Naloxone is reserved for true respiratory emergencies (fewer than 8 breaths per minute with cyanosis or unresponsiveness). The patients comfort is the primary outcome measure."
      }
    ]
  },

  "community-health-rpn": {
    title: "Community Health Nursing for Practical Nurses",
    cellular: {
      title: "Foundations of Community Health Nursing Practice",
      content: "Community health nursing is a specialized area of nursing practice that focuses on the health of populations, communities, and aggregates rather than solely on individual patients within institutional settings. The practical nurse working in community health settings applies nursing knowledge and skills within a public health framework, addressing the health needs of defined populations through health promotion, disease prevention, health education, and coordination of community resources. The fundamental philosophy underlying community health nursing is that the health of individuals cannot be separated from the health of the communities in which they live, work, learn, and play. This ecological perspective recognizes that health outcomes are determined not only by individual biology and behavior but also by the broader social, economic, environmental, and political contexts that shape the conditions of daily life. The social determinants of health represent the conditions in which people are born, grow, live, work, and age. These determinants include income and social status, education, employment and working conditions, early childhood development, food security, housing, social inclusion, access to healthcare services, gender, culture, race, and the physical environment. Research consistently demonstrates that these social determinants account for a larger proportion of health outcomes than healthcare services alone. For example, individuals living in poverty experience higher rates of chronic disease, mental illness, infectious disease, and premature mortality compared to those with higher socioeconomic status, even when controlling for access to healthcare. The practical nurse must understand these determinants to effectively assess community health needs and advocate for policies and programs that address root causes of health disparities. The Ottawa Charter for Health Promotion, developed at the first International Conference on Health Promotion in 1986, remains the foundational framework for health promotion practice worldwide. The Charter identifies five key action areas: building healthy public policy (integrating health considerations into policy decisions across all sectors), creating supportive environments (ensuring that living and working conditions promote rather than harm health), strengthening community action (empowering communities to set priorities, make decisions, and plan and implement strategies to achieve better health), developing personal skills (providing information, education, and life skills to enable individuals to make healthy choices), and reorienting health services (shifting the health system toward prevention and health promotion rather than focusing exclusively on treatment of disease). Community health assessment is a systematic process of collecting, analyzing, and interpreting data about the health status and health needs of a defined community. The practical nurse participates in community health assessment by collecting data through multiple methods including epidemiological analysis (disease incidence, prevalence, morbidity, and mortality rates), windshield surveys (systematic observation of a community from a vehicle to identify environmental conditions, housing quality, access to services, safety concerns, and social dynamics), key informant interviews (conversations with community leaders, healthcare providers, educators, and residents to understand community perspectives on health needs), focus groups, and analysis of existing data sources including census data, vital statistics, hospital discharge data, and public health surveillance reports. Primary prevention aims to prevent disease or injury before it occurs and includes health education, immunization programs, safety promotion (seatbelt use, bicycle helmets, fall prevention), nutritional counseling, prenatal care, and environmental health measures (clean water, sanitation, air quality). Secondary prevention focuses on early detection and treatment of disease to minimize severity and includes screening programs (blood pressure screening, cancer screening, vision and hearing testing, developmental screening in children), case finding, and prompt treatment initiation. Tertiary prevention aims to minimize disability and maximize function for individuals already living with disease and includes rehabilitation programs, chronic disease management, support groups, and strategies to prevent complications and recurrence. Vulnerable populations require particular attention in community health nursing. These groups include the homeless, individuals with mental illness or substance use disorders, recent immigrants and refugees, Indigenous populations, elderly persons living alone, individuals with disabilities, and children in families experiencing poverty or violence. The practical nurse must approach vulnerable populations with cultural humility, recognizing that each individual and community brings unique strengths, values, and perspectives that influence health beliefs and healthcare utilization patterns. Cultural competence requires ongoing self-reflection, education, and engagement rather than a fixed checklist of cultural practices. Home health nursing is a common community health nursing role for practical nurses. Home visits allow the nurse to assess the patients living environment, identify safety hazards (fall risks, medication storage issues, fire hazards, inadequate heating or cooling), evaluate family dynamics and caregiver capacity, provide skilled nursing care (wound care, medication administration, vital sign monitoring, catheter care), and teach patients and families self-management skills. The home visit follows a structured process: pre-visit planning (reviewing the referral, identifying goals, gathering supplies), initiating the visit (establishing rapport, verifying identity, obtaining consent), implementing the visit (performing assessment, providing care, teaching), and terminating the visit (summarizing what was done, scheduling follow-up, documenting findings). Documentation in community health nursing must be thorough and includes assessment data, interventions performed, patient and family education provided, response to interventions, referrals made, and plans for follow-up. Community health nurses serve as advocates for individuals and populations, connecting patients with resources including food banks, housing assistance, mental health services, substance use treatment programs, transportation services, financial assistance programs, and legal aid. The practical nurse must maintain current knowledge of available community resources and how to access them."
    },
    riskFactors: [
      "Social determinants of health including poverty, food insecurity, inadequate housing, and limited access to education and employment",
      "Geographic isolation in rural or remote communities with limited access to healthcare services, specialists, and emergency care",
      "Language barriers and low health literacy that impede understanding of health information, medication instructions, and navigation of the healthcare system",
      "Cultural beliefs and practices that may delay healthcare seeking or conflict with evidence-based medical recommendations",
      "Homelessness and housing instability creating barriers to medication adherence, wound care, nutrition, and follow-up appointments",
      "Substance use disorders and mental illness reducing engagement with preventive services and chronic disease management",
      "Elderly persons living alone with limited social support, mobility challenges, and increased risk for falls, malnutrition, and medication errors"
    ],
    diagnostics: [
      "Community health needs assessment: systematic collection and analysis of demographic, epidemiological, and environmental data to identify priority health needs of a defined population",
      "Windshield survey: organized observational assessment of a community conducted from a vehicle, documenting housing conditions, infrastructure, safety, recreational resources, healthcare facilities, and environmental hazards",
      "Epidemiological data analysis: review of disease incidence, prevalence, morbidity, and mortality rates to identify patterns, trends, and disparities in community health outcomes",
      "Social determinants screening (using validated tools such as the PRAPARE protocol): systematic screening of individual patients for social risk factors including housing instability, food insecurity, transportation barriers, and interpersonal safety",
      "Home safety assessment: structured evaluation of the home environment identifying fall hazards, medication storage issues, fire risks, sanitation concerns, and accessibility barriers",
      "Functional assessment tools (Katz ADL, Lawton IADL): standardized evaluation of patients ability to perform basic and instrumental activities of daily living independently in the community setting"
    ],
    management: [
      "Develop and implement population-based health promotion programs targeting identified community health priorities (immunization campaigns, chronic disease screening, health education workshops)",
      "Coordinate interdisciplinary care across settings by communicating with physicians, social workers, pharmacists, therapists, and community organizations to ensure continuity of care",
      "Connect patients and families with appropriate community resources including food banks, housing programs, transportation services, mental health services, and financial assistance programs",
      "Implement culturally appropriate health education using plain language, visual aids, teach-back method, and materials translated into the patients preferred language",
      "Conduct regular home safety assessments and implement modifications (grab bars, non-slip mats, improved lighting, medication organizers) to prevent injuries and promote independent living",
      "Advocate for policy changes that address social determinants of health at the local, regional, and national levels through participation in public health planning and community coalitions",
      "Maintain accurate surveillance data and report notifiable diseases to public health authorities as required by law"
    ],
    nursingActions: [
      "Perform comprehensive home assessments including evaluation of the physical environment, medication management, nutritional status, functional ability, caregiver capacity, and psychosocial wellbeing",
      "Apply the levels of prevention framework: implement primary prevention (education, immunization), secondary prevention (screening, early detection), and tertiary prevention (rehabilitation, chronic disease management) interventions as appropriate",
      "Use culturally appropriate communication techniques including professional interpreters (not family members) for language-discordant encounters, culturally sensitive health education materials, and awareness of cultural health beliefs",
      "Document all community health nursing activities thoroughly including assessments, interventions, patient education, referrals, and follow-up plans in accordance with professional and regulatory standards",
      "Screen all patients for social determinants of health using validated tools and initiate referrals to address identified needs (food insecurity, housing instability, transportation, interpersonal violence)",
      "Participate in emergency preparedness planning and response activities including pandemic planning, disaster response, and community evacuation procedures",
      "Report suspected child abuse, elder abuse, or intimate partner violence to appropriate authorities as mandated by law, and connect victims with safety planning resources"
    ],
    assessmentFindings: [
      "Environmental health hazards identified during windshield survey or home visit (unsafe housing, contaminated water, industrial pollution, lack of sidewalks or safe play areas)",
      "Evidence of food insecurity (empty refrigerator, expired food, reliance on food banks, skipping meals) identified during home assessment",
      "Medication non-adherence indicators (unfilled prescriptions, incorrect pill counts, expired medications, medications stored improperly) observed during medication reconciliation",
      "Social isolation indicators (limited social contacts, no visitors, declined participation in activities, neglected self-care) observed during home visits to elderly or homebound patients",
      "Caregiver stress and burnout symptoms (fatigue, irritability, neglect of own health needs, expressed feelings of being overwhelmed) identified during caregiver assessment",
      "Developmental delays or growth abnormalities identified through screening programs for children in at-risk populations"
    ],
    signs: {
      left: [
        "Community residents reporting limited access to fresh food and grocery stores",
        "Patients expressing difficulty affording prescribed medications",
        "Families requesting information about available community support services",
        "Elderly patients reporting occasional missed meals or difficulty cooking",
        "Patients expressing transportation barriers to medical appointments",
        "Caregivers reporting mild fatigue and occasional feelings of being overwhelmed"
      ],
      right: [
        "Evidence of child neglect or abuse requiring mandatory reporting (unexplained injuries, malnutrition, unsafe living conditions)",
        "Elder abuse indicators (unexplained bruising, financial exploitation, caregiver hostility, patient fearfulness)",
        "Acute mental health crisis (suicidal ideation, psychosis, severe self-harm) requiring immediate intervention",
        "Disease outbreak requiring urgent public health notification and contact tracing",
        "Unsafe living conditions posing immediate health risk (no heat in winter, structural collapse risk, raw sewage exposure)",
        "Intimate partner violence with immediate safety concerns requiring safety planning and reporting"
      ]
    },
    medications: [
      {
        name: "Community Health Needs Assessment (CHNA)",
        type: "Assessment Tool",
        action: "Systematic process of collecting and analyzing quantitative and qualitative data about a defined communitys health status, resources, and needs to identify priority health issues and guide program planning, resource allocation, and policy development",
        sideEffects: "Resource-intensive process requiring significant time, personnel, and community engagement; may raise community expectations for services that cannot be immediately delivered; data may become outdated quickly in rapidly changing communities",
        contra: "Should not be conducted without meaningful community participation; must not be used to justify predetermined conclusions; results must be shared transparently with the community; should not be a one-time exercise but part of an ongoing assessment cycle",
        pearl: "Non-profit hospitals are required to conduct a CHNA every three years under the Affordable Care Act; practical nurses can contribute by conducting windshield surveys, facilitating focus groups, and collecting data during home visits and community interactions"
      },
      {
        name: "PRAPARE Social Determinants Screening Tool",
        type: "Assessment Tool",
        action: "Standardized patient-level screening instrument developed by the National Association of Community Health Centers that assesses social determinants of health across domains including race/ethnicity, education, employment, housing, food security, transportation, social integration, stress, safety, and refugee/immigrant status to identify actionable social needs",
        sideEffects: "Screening may identify needs that existing services cannot fully address, potentially causing frustration for patients and providers; requires staff training for sensitive administration; patients may be reluctant to disclose personal information about social circumstances",
        contra: "Should not be administered without a referral pathway in place to address identified needs; must be administered in a private, non-judgmental manner; results must be documented securely and used only for care coordination purposes",
        pearl: "Integrating PRAPARE screening into routine nursing assessments increases identification of social risk factors by 300% compared to unstructured assessment; always follow up positive screens with concrete referrals to community resources"
      },
      {
        name: "Home Safety Assessment Checklist",
        type: "Assessment Tool",
        action: "Structured evaluation instrument used during home visits to systematically identify environmental hazards and safety risks including fall hazards (loose rugs, poor lighting, lack of grab bars), fire risks (blocked exits, faulty wiring, absent smoke detectors), medication safety concerns (improper storage, expired medications, look-alike/sound-alike confusion), and accessibility barriers (stairs without railings, narrow doorways, inaccessible bathrooms)",
        sideEffects: "May identify hazards that require financial resources the patient cannot afford to correct; patients may feel judged about their home environment; findings must be communicated sensitively and with respect for patient autonomy",
        contra: "Should not be used to force unwanted modifications on patients; must respect patient autonomy and right to refuse recommendations; findings should be documented as objective observations with recommended actions rather than judgments",
        pearl: "Falls are the leading cause of injury-related death in adults over 65; practical nurses conducting home safety assessments can reduce fall risk by up to 40% through simple environmental modifications (removing throw rugs, installing grab bars, improving lighting, securing electrical cords)"
      }
    ],
    pearls: [
      "Social determinants of health (income, education, housing, food security, social inclusion) account for a greater proportion of health outcomes than healthcare services alone -- addressing these factors is central to community health nursing",
      "The Ottawa Charter identifies five strategies for health promotion: building healthy public policy, creating supportive environments, strengthening community action, developing personal skills, and reorienting health services toward prevention",
      "The three levels of prevention guide community health interventions: primary (prevent disease before it occurs), secondary (detect and treat disease early), and tertiary (minimize disability and maximize function in existing disease)",
      "Windshield surveys provide rapid visual assessment of community conditions including housing quality, transportation infrastructure, safety, access to services, and environmental hazards -- practical nurses can conduct these during routine travel in the community",
      "Cultural humility is an ongoing process of self-reflection and learning, not a fixed endpoint -- it requires recognizing ones own cultural biases, respecting diverse health beliefs, and engaging communities as partners in care",
      "Mandatory reporting obligations for child abuse, elder abuse, and intimate partner violence apply in community settings -- practical nurses must know their jurisdictions reporting requirements and procedures",
      "Home visits allow direct assessment of the patients living environment, revealing safety hazards, medication management challenges, nutritional deficits, and social isolation that may not be apparent in clinic-based encounters"
    ],
    quiz: [
      {
        question: "A practical nurse conducting a home visit notices that an elderly patient has throw rugs on hardwood floors, no grab bars in the bathroom, and poor lighting in the hallway. Which level of prevention does addressing these hazards represent?",
        options: [
          "Primary prevention",
          "Secondary prevention",
          "Tertiary prevention",
          "Quaternary prevention"
        ],
        correct: 0,
        rationale: "Addressing fall hazards in the home environment before a fall occurs is primary prevention -- preventing disease or injury before it happens. Secondary prevention involves early detection and treatment (such as screening for osteoporosis), and tertiary prevention involves rehabilitation after injury has occurred."
      },
      {
        question: "A practical nurse is conducting a community health needs assessment. Which data collection method involves driving through a community to observe housing conditions, infrastructure, and available resources?",
        options: [
          "Key informant interview",
          "Focus group discussion",
          "Windshield survey",
          "Epidemiological analysis"
        ],
        correct: 2,
        rationale: "A windshield survey is a systematic observational assessment conducted from a vehicle, documenting housing conditions, road quality, safety features, recreational spaces, commercial resources, healthcare facilities, and environmental hazards. Key informant interviews and focus groups involve direct conversation with community members, while epidemiological analysis involves reviewing statistical health data."
      },
      {
        question: "According to the Ottawa Charter for Health Promotion, which action area focuses on empowering communities to set their own priorities and implement strategies for better health?",
        options: [
          "Building healthy public policy",
          "Creating supportive environments",
          "Strengthening community action",
          "Reorienting health services"
        ],
        correct: 2,
        rationale: "Strengthening community action involves empowering communities to take ownership of their health priorities, make decisions, and plan and implement strategies to achieve better health outcomes. This area recognizes that meaningful health improvement requires community participation and ownership rather than top-down approaches imposed by external agencies."
      }
    ]
  },

  "fall-risk-elderly-rpn": {
    title: "Fall Risk Assessment and Prevention in Elderly Patients",
    cellular: {
      title: "Pathophysiology and Epidemiology of Falls in the Elderly",
      content: "Falls represent one of the most significant and preventable causes of morbidity and mortality in the elderly population. Approximately one in three adults aged 65 and older falls each year, and this rate increases to one in two for adults over age 80. Falls are the leading cause of injury-related emergency department visits and hospitalizations in older adults, and the leading cause of injury-related death in persons over 65 years of age. The consequences of falls extend far beyond the immediate physical injury: falls lead to functional decline, loss of independence, increased fear of falling (which paradoxically increases fall risk by causing reduced activity and deconditioning), social isolation, depression, long-term care placement, and death. Hip fractures are among the most devastating consequences of falls, with a one-year mortality rate of approximately 20-30% following hip fracture in elderly patients. The pathophysiology of falls in the elderly is multifactorial, involving the interaction of intrinsic (patient-related) and extrinsic (environmental) risk factors. Intrinsic factors include age-related physiological changes such as decreased visual acuity (presbyopia, cataracts, glaucoma, macular degeneration), reduced vestibular function (impaired balance and spatial orientation), decreased proprioception (reduced ability to sense body position, particularly in the feet and ankles due to peripheral neuropathy), sarcopenia (age-related loss of muscle mass and strength), decreased bone density (osteoporosis and osteopenia increasing fracture risk with minimal trauma), cognitive impairment (dementia, delirium affecting judgment, attention, and spatial navigation), orthostatic hypotension (impaired baroreceptor response leading to blood pressure drops upon standing), and gait abnormalities (shuffling gait, decreased step height, widened base of support). Medications are a major modifiable risk factor for falls. Polypharmacy (use of five or more medications) significantly increases fall risk, and certain medication classes are particularly hazardous: benzodiazepines and sedative-hypnotics (drowsiness, impaired coordination, cognitive impairment), opioid analgesics (sedation, dizziness, impaired balance), antihypertensives (orthostatic hypotension), diuretics (volume depletion, orthostatic hypotension, electrolyte imbalances), antidepressants including SSRIs and tricyclics (orthostatic hypotension, sedation, hyponatremia), antipsychotics (sedation, extrapyramidal symptoms affecting gait), antihistamines (sedation, anticholinergic effects), and hypoglycemic agents (hypoglycemia causing weakness, confusion, and unsteadiness). Extrinsic factors include environmental hazards such as loose rugs and carpets, cluttered walkways, poor lighting (especially at night), wet or slippery floors, lack of grab bars and handrails, uneven surfaces, inappropriate footwear (loose slippers, high heels, shoes with smooth soles), and stairs without non-slip treads. In healthcare settings, additional extrinsic risks include bed height set too high, locked wheels on beds and wheelchairs not engaged, call lights out of reach, wet bathroom floors, and inadequate staffing limiting patient supervision. Fall risk assessment tools provide standardized, evidence-based methods for identifying patients at risk. The Morse Fall Scale (MFS) is the most widely used tool in acute care settings and evaluates six variables: history of falling within the past three months, presence of a secondary diagnosis, use of ambulatory aids (none, crutches/cane/walker, furniture), presence of an IV line or heparin lock, gait characteristics (normal/bedrest/wheelchair, weak, impaired), and mental status (oriented to own ability vs. forgets limitations). Scores are categorized as low risk (0-24), moderate risk (25-44), and high risk (45 or greater). The Hendrich II Fall Risk Model evaluates eight risk factors including confusion/disorientation, depression, altered elimination, dizziness/vertigo, gender (male), administration of antiepileptics or benzodiazepines, and the Get Up and Go test performance. This model incorporates a functional mobility component (the Get Up and Go test) which assesses the patients ability to rise from a chair, walk a short distance, turn, return, and sit down, providing a practical measure of balance and mobility that purely checklist-based tools may miss. Fall prevention is fundamentally an interdisciplinary effort requiring collaboration among nurses, physicians, pharmacists, physical therapists, occupational therapists, and family members. Evidence-based fall prevention strategies include comprehensive fall risk assessment on admission and with any change in condition, medication review and reduction of fall-risk-increasing medications, exercise and physical therapy programs targeting balance, strength, and gait training, environmental modifications (adequate lighting, non-slip surfaces, grab bars, bed alarms, appropriate footwear), management of orthostatic hypotension (gradual position changes, compression stockings, adequate hydration), vision correction (ensuring current prescription glasses are worn and available), management of underlying conditions contributing to fall risk (treating urinary tract infections causing confusion, managing pain, correcting electrolyte abnormalities), use of assistive devices (walkers, canes fitted to proper height), patient and family education about fall risk factors and prevention strategies, and toileting schedules to reduce urgency-related falls. Post-fall assessment is equally important. When a fall occurs, the practical nurse must assess the patient for injuries (head injury, fractures, lacerations), perform neurological assessment, obtain vital signs including orthostatic measurements, document the circumstances of the fall (time, location, activity at time of fall, witnesses, environmental conditions), notify the physician, complete an incident report, and implement additional fall prevention interventions as indicated."
    },
    riskFactors: [
      "Advanced age (risk doubles every decade after age 65 due to cumulative physiological decline in vision, balance, strength, and reaction time)",
      "History of previous falls (the single strongest predictor of future falls; a patient who has fallen once has a 2-3 times increased risk of falling again)",
      "Polypharmacy (use of 5 or more medications, especially psychotropics, antihypertensives, diuretics, opioids, and sedative-hypnotics)",
      "Cognitive impairment including dementia and delirium (impaired judgment, inattention, spatial disorientation, and inability to recognize environmental hazards)",
      "Orthostatic hypotension (systolic blood pressure drop of 20 mmHg or more or diastolic drop of 10 mmHg or more within 3 minutes of standing)",
      "Gait and balance disorders (shuffling gait, decreased step height, impaired proprioception, vestibular dysfunction, musculoskeletal weakness)",
      "Environmental hazards (loose rugs, poor lighting, cluttered walkways, wet floors, lack of grab bars, inappropriate footwear, bed height set too high)"
    ],
    diagnostics: [
      "Morse Fall Scale (MFS): standardized 6-item assessment tool scoring history of falls, secondary diagnosis, ambulatory aid use, IV access, gait, and mental status; scores classify risk as low (0-24), moderate (25-44), or high (45+)",
      "Hendrich II Fall Risk Model: 8-factor assessment including confusion, depression, altered elimination, dizziness, gender, specific medication classes, and Get Up and Go test performance",
      "Timed Up and Go (TUG) test: patient rises from a seated position, walks 3 meters, turns, walks back, and sits down; time greater than 12 seconds indicates increased fall risk",
      "Orthostatic vital signs: blood pressure and heart rate measured lying, sitting, and standing at 1 and 3 minutes; systolic drop of 20 mmHg or more or diastolic drop of 10 mmHg or more is positive for orthostatic hypotension",
      "Comprehensive medication review: pharmacist-led review identifying fall-risk-increasing drugs (FRIDs) including sedatives, antihypertensives, diuretics, opioids, psychotropics, and anticholinergics",
      "Bone density scan (DEXA): identifies osteoporosis and osteopenia quantifying fracture risk; T-score of -2.5 or below indicates osteoporosis"
    ],
    management: [
      "Implement individualized fall prevention care plan based on identified risk factors, with interventions targeting each specific risk (medication adjustment, physical therapy, environmental modification)",
      "Conduct medication review with pharmacy and reduce or eliminate fall-risk-increasing medications when clinically possible; taper benzodiazepines and sedative-hypnotics rather than abrupt discontinuation",
      "Refer to physical therapy for individualized balance training, strength exercises (particularly lower extremity), and gait training with appropriate assistive devices fitted to proper height",
      "Implement environmental modifications: ensure adequate lighting (especially at night with nightlights), remove loose rugs and clutter, install grab bars in bathrooms, apply non-slip strips to floors, set bed to lowest position",
      "Manage orthostatic hypotension: instruct patient to change positions slowly (sit on edge of bed for 1-2 minutes before standing), use compression stockings as ordered, ensure adequate hydration, review causative medications",
      "Ensure proper footwear: non-skid, flat, enclosed-heel shoes during ambulation; avoid slippers, socks without grips, and high-heeled shoes",
      "Implement toileting schedule (every 2 hours or based on pattern) to reduce urgency-related falls, especially for patients with urinary urgency or nocturia"
    ],
    nursingActions: [
      "Perform fall risk assessment using validated tool (Morse Fall Scale or Hendrich II) on admission, every shift, after a fall, and with any change in patient condition or medications",
      "Ensure call light is within reach at all times and verify patient understands how to use it; respond to call lights promptly to prevent patients from attempting to ambulate unassisted",
      "Keep bed in lowest position with brakes locked, side rails per policy (note: full side rails are considered a restraint in many jurisdictions), and personal items within easy reach",
      "Implement fall precaution signage (yellow wristband, door sign, bedside alert) per facility protocol so all staff members are aware of the patients fall risk status",
      "Assist with ambulation using gait belt for patients identified as fall risk; walk beside the patient on their weaker side with the gait belt secured around the waist",
      "Conduct intentional hourly rounding addressing the 4 Ps (pain, potty, position, possessions within reach) to proactively meet patient needs and reduce unassisted ambulation attempts",
      "After any fall, perform immediate assessment (neurological check, vital signs, injury assessment), notify physician, complete incident report, and update fall prevention plan"
    ],
    assessmentFindings: [
      "Unsteady gait with shuffling, decreased step height, widened base of support, or inability to tandem walk (heel-to-toe) indicating balance impairment",
      "Positive orthostatic vital signs (systolic BP drop greater than 20 mmHg or diastolic drop greater than 10 mmHg within 3 minutes of standing) with or without symptoms of dizziness or lightheadedness",
      "Timed Up and Go test result greater than 12 seconds indicating impaired functional mobility and increased fall risk",
      "Visual impairment (decreased acuity, reduced depth perception, limited peripheral vision) that may not be apparent until formal screening is performed",
      "Lower extremity weakness, decreased grip strength, or inability to rise from a chair without using arms indicating sarcopenia and deconditioning",
      "Cognitive impairment evidenced by confusion, disorientation, impaired judgment, or inability to recognize personal limitations (overestimation of abilities)"
    ],
    signs: {
      left: [
        "Patient reports feeling unsteady or dizzy when changing positions",
        "Observed slow, cautious gait with reliance on furniture for support",
        "Mild lower extremity weakness on manual muscle testing",
        "Patient expresses fear of falling limiting daily activities",
        "Evidence of vitamin D deficiency on laboratory results",
        "Nocturia requiring multiple nighttime bathroom trips"
      ],
      right: [
        "Witnessed fall with head strike requiring neurological assessment and possible imaging",
        "Suspected hip fracture after fall (shortened and externally rotated leg, severe pain with movement, inability to bear weight)",
        "Post-fall altered level of consciousness or new neurological deficits suggesting intracranial hemorrhage",
        "Fall with anticoagulant therapy requiring urgent assessment for internal bleeding",
        "Recurrent falls despite implemented interventions requiring comprehensive reassessment and care plan revision",
        "Fall resulting in loss of consciousness even if brief duration requiring urgent medical evaluation"
      ]
    },
    medications: [
      {
        name: "Vitamin D (Cholecalciferol/Ergocalciferol)",
        type: "Fat-soluble vitamin and bone health supplement",
        action: "Promotes intestinal absorption of calcium and phosphorus, supports bone mineralization and remodeling, and maintains adequate serum calcium levels necessary for muscle function; vitamin D deficiency is associated with muscle weakness, impaired balance, osteoporosis, and increased fall risk in elderly populations",
        sideEffects: "Hypercalcemia (at excessive doses): nausea, vomiting, constipation, polyuria, confusion, kidney stones; generally well-tolerated at recommended supplementation doses (800-2000 IU daily)",
        contra: "Hypercalcemia; hypervitaminosis D; malabsorption syndromes may require higher doses or parenteral administration; renal impairment requires monitoring of calcium and phosphorus levels",
        pearl: "Current evidence recommends 800-1000 IU daily of vitamin D3 for fall prevention in elderly adults; combined vitamin D and calcium supplementation reduces hip fracture risk by approximately 20%; check serum 25-hydroxyvitamin D level and supplement to achieve levels above 75 nmol/L (30 ng/mL)"
      },
      {
        name: "Calcium Carbonate",
        type: "Mineral supplement / antite electrolyte replacement",
        action: "Provides elemental calcium essential for bone mineral density maintenance, muscle contraction, nerve transmission, and coagulation; adequate calcium intake combined with vitamin D reduces osteoporotic fracture risk and supports the skeletal framework that protects against fracture injury from falls",
        sideEffects: "Constipation (most common), bloating, flatulence, hypercalcemia (rare with supplementation doses), kidney stones in predisposed individuals, possible cardiovascular risk with high supplemental calcium intake (controversial)",
        contra: "Hypercalcemia; hypercalciuria; renal calculi (calcium-containing stones); severe renal impairment; concurrent use with thiazide diuretics (increased calcium reabsorption may cause hypercalcemia)",
        pearl: "Take calcium carbonate with food for optimal absorption (requires gastric acid); do not exceed 500-600 mg elemental calcium per dose as absorption efficiency decreases with larger doses; separate from iron supplements, thyroid medications, and certain antibiotics by at least 2 hours to prevent drug interactions"
      },
      {
        name: "Bisacodyl",
        type: "Stimulant laxative",
        action: "Stimulates peristalsis by direct action on the colonic mucosa and myenteric plexus, increasing intestinal motility and promoting bowel evacuation; relevant to fall prevention because constipation increases straining (Valsalva maneuver causing vasovagal syncope) and urgency-related falls, and many fall-risk medications (opioids, calcium supplements) cause constipation",
        sideEffects: "Abdominal cramping, diarrhea, electrolyte imbalances (hypokalemia with chronic use), rectal irritation (suppository form), dependency with prolonged use, nausea",
        contra: "Intestinal obstruction; acute surgical abdomen; severe dehydration; appendicitis; fecal impaction (oral form); rectal fissures or hemorrhoids (suppository form)",
        pearl: "Use for short-term relief of constipation; do not crush or chew enteric-coated tablets (causes gastric irritation); suppository form works within 15-60 minutes while oral form takes 6-12 hours (administer oral dose at bedtime for morning effect); encourage adequate fluid intake and dietary fiber as first-line constipation management before pharmacological intervention"
      }
    ],
    pearls: [
      "The single strongest predictor of future falls is a history of previous falls -- always ask patients about fall history during initial and ongoing assessments",
      "Abdominal assessment sequence is Inspect-Auscultate-Percuss-Palpate, but fall risk assessment follows: Assess on admission, Reassess every shift, Reassess after any change in condition or medications, and Reassess after every fall",
      "Polypharmacy (5 or more medications) significantly increases fall risk; fall-risk-increasing drugs (FRIDs) include sedatives, opioids, antihypertensives, diuretics, psychotropics, and anticholinergics -- advocate for medication review with pharmacy",
      "Orthostatic hypotension is assessed by measuring BP and HR lying, sitting, and standing; a systolic drop of 20 mmHg or more or diastolic drop of 10 mmHg or more is positive -- teach patients to rise slowly and sit at the bedside before standing",
      "Intentional hourly rounding addressing the 4 Ps (Pain, Potty, Position, Possessions within reach) reduces fall rates by up to 50% in acute care settings by proactively addressing common reasons patients attempt to get up unassisted",
      "Hip fractures from falls carry a one-year mortality rate of 20-30% in elderly patients -- fall prevention is literally a life-saving nursing intervention",
      "Full side rails are considered a physical restraint in many jurisdictions and can actually increase fall risk (patients climb over them and fall from a greater height) -- use half rails and keep bed in lowest position instead"
    ],
    quiz: [
      {
        question: "A practical nurse is performing a fall risk assessment using the Morse Fall Scale. Which score range indicates a patient is at high risk for falls?",
        options: [
          "0 to 24",
          "25 to 44",
          "45 or greater",
          "10 to 20"
        ],
        correct: 2,
        rationale: "On the Morse Fall Scale, scores of 0-24 indicate low risk, 25-44 indicate moderate risk, and 45 or greater indicate high risk for falls. High-risk patients require comprehensive fall prevention interventions including fall precaution signage, assistive devices, environmental modifications, and increased supervision."
      },
      {
        question: "A practical nurse is measuring orthostatic vital signs on an elderly patient. Which finding indicates positive orthostatic hypotension?",
        options: [
          "Heart rate increase of 5 beats per minute upon standing",
          "Systolic blood pressure increase of 15 mmHg upon standing",
          "Systolic blood pressure decrease of 25 mmHg upon standing with dizziness",
          "Diastolic blood pressure increase of 10 mmHg upon standing"
        ],
        correct: 2,
        rationale: "Orthostatic hypotension is defined as a systolic blood pressure drop of 20 mmHg or more, or a diastolic drop of 10 mmHg or more, within 3 minutes of standing from a supine or seated position. A 25 mmHg systolic drop with symptoms of dizziness is a positive finding that increases fall risk and should be reported and addressed."
      },
      {
        question: "Which nursing intervention has been shown to reduce fall rates by up to 50% in acute care settings?",
        options: [
          "Placing all patients on continuous bed alarm monitoring",
          "Implementing intentional hourly rounding addressing pain, potty, position, and possessions within reach",
          "Applying bilateral wrist restraints to all high-risk patients",
          "Administering sedative medications at bedtime to ensure uninterrupted sleep"
        ],
        correct: 1,
        rationale: "Intentional hourly rounding addressing the 4 Ps (Pain, Potty, Position, Possessions within reach) proactively meets patient needs that commonly cause patients to attempt unassisted ambulation. Studies show this structured approach can reduce fall rates by up to 50%. Restraints and sedatives actually increase fall risk."
      }
    ]
  },

  "incident-reporting-rpn": {
    title: "Incident Reporting and Patient Safety for Practical Nurses",
    cellular: {
      title: "Foundations of Incident Reporting and Patient Safety Culture",
      content: "Incident reporting is a cornerstone of patient safety systems in healthcare organizations worldwide. An incident (also called an occurrence, adverse event, or safety event) is any event or circumstance that resulted in, or could have resulted in, unnecessary harm to a patient, visitor, or staff member. Incident reporting systems provide the mechanism through which healthcare workers identify, document, and communicate safety events so that organizations can analyze patterns, identify system vulnerabilities, implement corrective actions, and prevent recurrence. The practical nurse plays a critical role in incident reporting because frontline nursing staff are often the first to identify safety events and near misses during direct patient care. Understanding the terminology of patient safety is essential for accurate reporting and communication. A near miss (also called a close call or good catch) is an event that could have resulted in harm but was caught before reaching the patient. For example, a nurse preparing to administer a medication notices the wrong drug has been dispensed by pharmacy and catches the error before administration -- this is a near miss. A no-harm event is an incident that reached the patient but did not cause detectable harm. For example, a patient receives the wrong medication but experiences no adverse effects. An adverse event is an incident that results in harm to the patient, ranging from minor (temporary discomfort) to severe (permanent injury or death). A sentinel event is a specific category of adverse event that results in death or serious physical or psychological injury, or the risk thereof. The Joint Commission (in the United States) defines sentinel events to include patient death or serious harm not related to the natural course of the patients illness, wrong-site surgery, retained foreign objects after surgery, patient suicide in a 24-hour care setting, infant abduction or discharge to the wrong family, and other events that signal the need for immediate investigation and response. In Canada, critical incidents are defined by provincial legislation and typically require mandatory reporting to the provincial health authority or regulatory college. Root cause analysis (RCA) is a structured, systematic investigation method used following serious adverse events and sentinel events to identify the fundamental underlying causes (root causes) that contributed to the event rather than merely identifying the surface-level human error. RCA recognizes that most healthcare errors result from system failures rather than individual negligence. The analysis examines contributing factors across multiple categories including human factors (fatigue, distraction, inadequate training, communication failures), system factors (inadequate staffing, equipment failures, poorly designed processes, missing safety checks), environmental factors (noise, lighting, workspace design), and organizational factors (safety culture, leadership commitment, resource allocation). RCA produces actionable recommendations for system improvements that reduce the likelihood of similar events occurring in the future. The concept of just culture is fundamental to effective incident reporting systems. A just culture recognizes that healthcare workers are human and will inevitably make errors, and that punishing individuals for honest mistakes creates a culture of fear that suppresses reporting and prevents organizational learning. Just culture draws clear distinctions between three categories of behavior. Human error is an inadvertent, unintentional action that results from factors such as fatigue, distraction, stress, or inadequate information -- the appropriate response is system improvement (redesigning processes to make errors harder to make or easier to catch). At-risk behavior involves conscious choices that increase risk, often motivated by shortcuts that become normalized over time (such as bypassing a barcode scanning step because the scanner is slow) -- the appropriate response is coaching and removing incentives for the risky behavior. Reckless behavior involves conscious disregard for a substantial and unjustifiable risk (such as knowingly administering a medication to the wrong patient) -- the appropriate response is disciplinary or remedial action. By categorizing behaviors accurately, organizations can respond proportionately and maintain a reporting culture where staff feel safe bringing safety concerns forward. The incident reporting process typically follows a standardized workflow. When an incident or near miss occurs, the healthcare worker first ensures patient safety by providing any immediate care needed. The worker then notifies the supervisor or charge nurse and the patients physician if the event resulted in or could result in patient harm. An incident report (also called an occurrence report or safety event report) is completed as soon as possible, ideally within the same shift, while details are fresh. The report includes objective, factual information: date, time, and location of the event; description of what happened (without subjective opinions, blame, or speculation); patient identification; immediate actions taken; notifications made; and the reporters name and contact information. Critically, the incident report is an internal quality improvement document and should NOT be referenced or documented in the patients medical record. The patients medical record should contain only objective clinical documentation of the patients condition, assessments performed, interventions provided, and notifications made -- it should never reference that an incident report was filed. This separation protects the incident reporting system from legal discovery in many jurisdictions, encouraging honest and complete reporting. Healthcare organizations are required to analyze incident reports systematically, identify trends and patterns, and implement corrective actions. Common corrective actions include process redesign (adding verification steps, simplifying complex procedures), technology solutions (barcode medication administration, smart pump drug libraries, clinical decision support alerts), education and training (competency validation, simulation-based training), policy revision (updating procedures based on lessons learned), staffing adjustments (addressing workload and fatigue-related risks), and environmental modifications (improving lighting, reducing noise, redesigning workspace layout). Disclosure of adverse events to patients and families is an ethical and legal obligation in most jurisdictions. Disclosure should be honest, timely, compassionate, and factual, explaining what happened, what is being done to address the harm, and what is being done to prevent recurrence. Disclosure is distinct from incident reporting -- disclosure is communication with the patient while incident reporting is communication within the organizations quality improvement system. The practical nurse may participate in disclosure conversations and should provide emotional support to the patient and family while ensuring that disclosure follows the organizations established disclosure protocol. Regulatory reporting requirements vary by jurisdiction. In the United States, certain events must be reported to state health departments, the Joint Commission, CMS, and the FDA (for device-related events). In Canada, critical incidents must be reported to provincial health authorities, and medication errors involving certain controlled substances must be reported to Health Canada. Nurses have a professional obligation to report incidents regardless of whether they believe the event was significant -- near misses are particularly valuable because they reveal system vulnerabilities before patients are harmed."
    },
    riskFactors: [
      "Organizational culture that punishes or stigmatizes error reporting, creating fear and suppressing disclosure of safety events",
      "High workload, inadequate staffing ratios, and mandatory overtime leading to fatigue, distraction, and increased error rates",
      "Complex medication regimens, look-alike/sound-alike drug names, and high-alert medications requiring multiple verification steps",
      "Communication failures during care transitions (handoffs, transfers, discharges) where critical information may be lost or distorted",
      "Inadequate orientation and training for new staff, agency/temporary personnel, or staff reassigned to unfamiliar units",
      "Equipment malfunction, unavailability of safety technology (barcode scanners, smart pumps), or workaround behaviors bypassing safety systems",
      "Production pressure and time constraints that incentivize shortcuts and normalize at-risk behaviors"
    ],
    diagnostics: [
      "Incident report review and trending: systematic analysis of filed incident reports over time to identify patterns, high-risk areas, contributing factors, and recurring event types",
      "Root cause analysis (RCA): structured investigation methodology used after sentinel events to identify fundamental system failures contributing to the event and generate actionable corrective recommendations",
      "Failure mode and effects analysis (FMEA): prospective risk assessment tool that systematically identifies potential failure points in a process before they cause harm, evaluating likelihood, severity, and detectability of each failure mode",
      "Safety culture survey (e.g., AHRQ Hospital Survey on Patient Safety Culture): validated instrument measuring staff perceptions of patient safety including teamwork, communication openness, non-punitive response to error, and management support for safety",
      "Morbidity and mortality (M&M) conference review: structured peer review of adverse outcomes to identify learning opportunities and system improvement strategies in a non-punitive educational setting",
      "Medication error category analysis (NCC MERP Index): classification of medication errors by severity from Category A (no error, capacity to cause error) through Category I (error contributing to patient death) to prioritize improvement efforts"
    ],
    management: [
      "Establish and maintain a just culture framework that distinguishes between human error (system improvement), at-risk behavior (coaching), and reckless behavior (disciplinary action) to encourage reporting",
      "Implement standardized incident reporting systems (electronic preferred) that are easily accessible, user-friendly, and allow anonymous or confidential reporting options",
      "Conduct root cause analysis for all sentinel events and serious adverse events within mandated timeframes, with interdisciplinary participation including frontline staff",
      "Develop and implement corrective action plans based on RCA findings with clear accountability, timelines, and effectiveness monitoring",
      "Provide regular feedback to staff on reported incidents including aggregate data, identified trends, and implemented improvements to demonstrate that reporting leads to meaningful change",
      "Implement evidence-based safety practices including barcode medication administration, standardized handoff communication (SBAR), surgical safety checklists, and medication reconciliation",
      "Conduct proactive risk assessments (FMEA) for high-risk processes before implementing new procedures, technologies, or workflow changes"
    ],
    nursingActions: [
      "Report all incidents, near misses, and unsafe conditions through the facilitys incident reporting system promptly -- ideally within the same shift while details are accurate and complete",
      "Ensure immediate patient safety first: assess the patient, provide necessary interventions, and notify the physician and supervisor before completing the incident report",
      "Document objective, factual information in the incident report: what happened, when, where, who was involved, what actions were taken, and what notifications were made -- avoid opinions, blame, or speculation",
      "Do NOT reference the incident report in the patients medical record; chart objective clinical findings, assessments, interventions, and notifications in the medical record without mentioning the incident report",
      "Participate in root cause analysis when requested, providing honest and detailed accounts of the event and contributing to the identification of system-level contributing factors",
      "Implement corrective actions as assigned following incident analysis, including updated procedures, additional training, and modified workflows",
      "Support colleagues involved in adverse events by providing emotional support and encouraging reporting without judgment, recognizing that second victim syndrome (emotional distress in the healthcare worker involved) is common after serious events"
    ],
    assessmentFindings: [
      "Pattern of similar incident types recurring on the same unit or during the same time periods indicating systemic contributing factors (staffing, workflow, equipment, training gaps)",
      "Increased frequency of near-miss reports in a specific process area suggesting system vulnerability that has not yet caused patient harm but is likely to if not addressed",
      "Staff reluctance to report incidents or express safety concerns indicating a punitive safety culture that suppresses disclosure and organizational learning",
      "Communication breakdown during handoffs evidenced by incomplete or inaccurate information transfer leading to care omissions or errors",
      "Workaround behaviors observed in clinical practice (bypassing barcode scanning, overriding smart pump alerts, skipping verification steps) indicating process design issues",
      "Medication errors clustered around specific drug names, formulations, or administration times suggesting look-alike/sound-alike confusion or workflow-related risk factors",
      "Staff exhibiting signs of second victim syndrome (guilt, anxiety, insomnia, withdrawal, self-doubt) following involvement in a serious adverse event"
    ],
    signs: {
      left: [
        "Near-miss events reported promptly and used for system learning",
        "Staff questions about proper reporting procedures indicating engagement with safety systems",
        "Minor process deviations identified during routine quality audits",
        "Patients or families expressing concerns about perceived errors or communication gaps",
        "Increasing near-miss reporting rates (indicates improving safety culture, not worsening safety)",
        "Staff seeking clarification on medication orders or policies before proceeding"
      ],
      right: [
        "Sentinel event resulting in patient death or serious permanent harm requiring immediate investigation and regulatory notification",
        "Wrong-site, wrong-procedure, or wrong-patient surgery or invasive procedure",
        "Retained surgical instrument or sponge discovered post-operatively",
        "Patient suicide or attempted suicide in an inpatient care setting",
        "Major medication error resulting in life-threatening harm (wrong drug, wrong dose by 10x or more, wrong route causing organ damage)",
        "Systematic failure pattern identified (multiple similar events in a short period) indicating a broken process requiring immediate intervention"
      ]
    },
    medications: [
      {
        name: "Incident Report (Occurrence Report)",
        type: "Documentation Tool",
        action: "Standardized form (paper or electronic) used to document any event that resulted in or could have resulted in harm to a patient, visitor, or staff member; captures objective factual details including date, time, location, description of the event, individuals involved, immediate actions taken, and notifications made; serves as the foundational data source for incident analysis and quality improvement",
        sideEffects: "Incomplete or delayed reporting reduces data quality and delays system improvements; staff anxiety about perceived consequences may inhibit thorough completion; excessive narrative detail may delay timely submission",
        contra: "Must NOT be referenced in the patients medical record (to preserve quality improvement privilege); must NOT be used as a punitive tool against the reporting individual; must NOT contain subjective opinions, blame, or speculation about fault",
        pearl: "Complete the report within the same shift while details are fresh; include only objective facts (who, what, when, where, how); the incident report is a quality improvement document, NOT part of the medical record; in the medical record, document only the patients clinical condition, assessments performed, interventions provided, and notifications made"
      },
      {
        name: "Root Cause Analysis (RCA) Report",
        type: "Documentation Tool",
        action: "Structured investigation document produced following a systematic analysis of a serious adverse event or sentinel event; identifies contributing factors at multiple levels (individual, team, task, environment, organization), determines fundamental root causes of the event, and generates specific actionable recommendations for system changes to prevent recurrence",
        sideEffects: "Time-intensive process requiring dedicated team participation; may identify uncomfortable organizational deficiencies; recommendations require sustained leadership commitment and resources for implementation; delayed analysis diminishes recall accuracy",
        contra: "Must not be conducted as a blame-finding exercise; participation must be voluntary and psychologically safe; findings must be acted upon (conducting RCA without implementing recommendations erodes trust in the safety system); must not replace regulatory reporting obligations",
        pearl: "RCA should be initiated within 72 hours of a sentinel event and completed within 45-60 days; use the 5 Whys technique (asking why iteratively until the root cause is identified) and fishbone (Ishikawa) diagrams to organize contributing factors; the goal is to identify system failures not individual blame"
      },
      {
        name: "Safety Event Classification Tool (NCC MERP Index)",
        type: "Documentation Tool",
        action: "Standardized classification system developed by the National Coordinating Council for Medication Error Reporting and Prevention that categorizes medication errors by severity from Category A (circumstances with capacity to cause error, no event occurred) through Category I (error contributing to patient death); provides consistent language for communicating error severity, prioritizing improvement efforts, and tracking outcomes across the organization and over time",
        sideEffects: "Classification requires clinical judgment that may vary between reviewers; potential for under-classification to minimize perceived severity; requires training for consistent application across the organization",
        contra: "Should not be used in isolation without root cause analysis; classification alone does not prevent recurrence; must be paired with action plans addressing identified contributing factors; should not be used to rank individual performance",
        pearl: "Categories A-D involve no patient harm (near misses and no-harm events); Categories E-I involve patient harm of increasing severity; tracking the ratio of near-miss reports (A-D) to harm events (E-I) over time is a key indicator of safety culture maturity -- a high ratio of near-miss reporting indicates staff are catching errors before they reach patients"
      }
    ],
    pearls: [
      "Near misses are the most valuable safety reports because they reveal system vulnerabilities before patients are harmed -- a culture that celebrates good catches prevents future adverse events",
      "Just culture distinguishes three behaviors: human error (system improvement), at-risk behavior (coaching), and reckless behavior (accountability) -- this framework replaces blanket punishment with proportionate responses",
      "NEVER reference the incident report in the patients medical record -- the incident report is a quality improvement document; the medical record should contain only objective clinical documentation of the patients condition and care provided",
      "Root cause analysis asks WHY an event happened (system factors) rather than WHO caused it (individual blame) -- most healthcare errors result from system failures, not individual negligence",
      "Disclosure of adverse events to patients is an ethical and legal obligation -- be honest, timely, and compassionate; explain what happened, what is being done, and how recurrence will be prevented",
      "Second victim syndrome refers to the emotional distress experienced by healthcare workers involved in adverse events (guilt, anxiety, insomnia, self-doubt) -- support colleagues and access peer support resources",
      "An increasing rate of near-miss reporting is a positive indicator of safety culture maturity, not evidence of deteriorating safety -- it means staff feel safe reporting and the organization is catching errors before harm occurs"
    ],
    quiz: [
      {
        question: "A practical nurse administers a medication to the wrong patient but the patient experiences no adverse effects. How should the nurse classify this event?",
        options: [
          "Near miss",
          "No-harm event",
          "Sentinel event",
          "No event occurred because there was no harm"
        ],
        correct: 1,
        rationale: "A no-harm event is an incident that reached the patient but did not cause detectable harm. The medication reached the wrong patient (so it is not a near miss, which would have been caught before reaching the patient), but no harm resulted (so it is not an adverse event). Regardless of the lack of harm, this event must be reported through the incident reporting system because it reveals a system vulnerability."
      },
      {
        question: "After a medication error occurs, the practical nurse documents the patients clinical condition, vital signs, physician notification, and interventions in the medical record. The nurse also completes an incident report. Which additional documentation action is correct?",
        options: [
          "Write in the medical record: Incident report filed regarding medication error",
          "Attach a copy of the incident report to the patients medical record",
          "Do not reference the incident report in the patients medical record",
          "Document the names of all staff witnesses in the incident report and the medical record"
        ],
        correct: 2,
        rationale: "The incident report is a quality improvement document and must NOT be referenced in the patients medical record. Referencing the incident report in the medical record could compromise its quality improvement privilege and make it discoverable in legal proceedings. The medical record should contain only objective clinical documentation of the patients condition, assessments, interventions, and notifications."
      },
      {
        question: "In a just culture framework, a nurse consistently bypasses the barcode medication scanning step because the scanner is slow, and this practice has become routine on the unit. How should this behavior be categorized?",
        options: [
          "Human error requiring system improvement",
          "At-risk behavior requiring coaching and removal of incentives for the risky behavior",
          "Reckless behavior requiring disciplinary action",
          "Acceptable practice if no errors have resulted from the shortcut"
        ],
        correct: 1,
        rationale: "In a just culture framework, at-risk behavior involves conscious choices that increase risk, often motivated by perceived efficiency gains or workarounds that become normalized over time. The appropriate response is coaching (helping the nurse understand the risk), removing incentives for the risky behavior (fixing the slow scanner, addressing time pressures), and reinforcing the importance of the safety step. This differs from human error (inadvertent) and reckless behavior (conscious disregard of known substantial risk)."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nDone: ${injected} injected, ${skipped} skipped`);
