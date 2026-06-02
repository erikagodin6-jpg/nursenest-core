export interface PharmTechLawPage {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; content: string; keyPoints: string[] }[];
  practiceQuestions: { stem: string; options: string[]; correctIndex: number; rationale: string }[];
  faqs: { q: string; a: string }[];
  relatedPages: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const PHARMTECH_LAW_PAGES: PharmTechLawPage[] = [
  {
    slug: "controlled-substances",
    title: "DEA Controlled Substance Schedules & Regulations",
    description: "Comprehensive guide to DEA schedules I-V, prescription requirements, refill rules, and transfer regulations for the PTCB and ExCPT exams.",
    sections: [
      {
        heading: "The Controlled Substances Act (CSA)",
        content: "The Controlled Substances Act of 1970 (CSA) established the federal framework for regulating substances with potential for abuse. The DEA (Drug Enforcement Administration) enforces these regulations. All practitioners who prescribe, dispense, or handle controlled substances must have a valid DEA registration number.",
        keyPoints: [
          "CSA established in 1970 — creates 5 schedules based on abuse potential and medical use",
          "DEA number required for all prescribers of controlled substances",
          "State laws may be MORE restrictive than federal law (state takes precedence when stricter)",
          "Pharmacies must maintain a DEA registration and perform biennial (every 2 years) inventory",
        ],
      },
      {
        heading: "Schedule I (C-I)",
        content: "Highest abuse potential with NO accepted medical use in the United States. These substances are not available by prescription and are used only for research under strict DEA protocols.",
        keyPoints: [
          "Examples: heroin, LSD, MDMA (ecstasy), peyote, marijuana (federal level)",
          "No accepted medical use — cannot be prescribed",
          "Available only for DEA-approved research",
          "Marijuana remains Schedule I federally despite state-level legalization",
        ],
      },
      {
        heading: "Schedule II (C-II)",
        content: "High abuse potential with currently accepted medical use. These substances can lead to severe psychological or physical dependence.",
        keyPoints: [
          "Examples: oxycodone (OxyContin), hydrocodone (Vicodin), fentanyl, morphine, amphetamine (Adderall), methylphenidate (Ritalin)",
          "NO refills permitted — new prescription required each time",
          "Prescriptions valid for a specific time period (varies by state, often 6 months or 90 days)",
          "Emergency oral/phone prescriptions allowed with limitations (72-hour supply, written follow-up required)",
          "E-prescribing (EPCS) required in most states",
          "Partial fills allowed in specific circumstances (long-term care, terminally ill, unable to supply full quantity)",
        ],
      },
      {
        heading: "Schedule III (C-III)",
        content: "Moderate to low physical dependence potential or high psychological dependence potential. Has accepted medical use.",
        keyPoints: [
          "Examples: testosterone, anabolic steroids, ketamine, Tylenol with codeine (#3)",
          "Up to 5 refills within 6 months from date of issue",
          "Prescriptions can be called in, faxed, or e-prescribed",
          "Partial fills count toward the 5-refill limit",
        ],
      },
      {
        heading: "Schedule IV (C-IV)",
        content: "Low abuse potential relative to Schedule III. Has accepted medical use.",
        keyPoints: [
          "Examples: alprazolam (Xanax), lorazepam (Ativan), diazepam (Valium), zolpidem (Ambien), tramadol",
          "Up to 5 refills within 6 months from date of issue",
          "Same prescription requirements as C-III",
          "Tramadol reclassified to C-IV in 2014",
        ],
      },
      {
        heading: "Schedule V (C-V)",
        content: "Lowest abuse potential of controlled substances. Has accepted medical use. Some may be available OTC with restrictions in certain states.",
        keyPoints: [
          "Examples: cough preparations with <200 mg codeine/100 mL (Robitussin AC), pregabalin (Lyrica), lacosamide (Vimpat)",
          "Up to 5 refills within 6 months",
          "Some states allow OTC sale with pharmacist involvement (e.g., codeine cough syrup)",
          "Gabapentin is C-V in some states but not federally",
        ],
      },
      {
        heading: "DEA Number Verification",
        content: "Pharmacy technicians should know how to verify a DEA number. A valid DEA number has 2 letters followed by 7 digits. The first letter indicates registrant type, the second is the first letter of the prescriber's last name.",
        keyPoints: [
          "Format: 2 letters + 7 digits (e.g., AB1234563)",
          "First letter: A or B = dispensers/prescribers, F = distributors, M = mid-level practitioners",
          "Second letter = first letter of prescriber's last name",
          "Check digit verification: Add digits 1+3+5, then add (2+4+6)×2. Last digit of sum = 7th digit of DEA number",
        ],
      },
    ],
    practiceQuestions: [
      { stem: "How many refills are allowed for a Schedule II controlled substance?", options: ["1 refill", "5 refills in 6 months", "None — a new prescription is required", "11 refills in 1 year"], correctIndex: 2, rationale: "Schedule II controlled substances do not allow any refills. A brand new prescription must be issued for each dispensing." },
      { stem: "Which controlled substance schedule allows up to 5 refills within 6 months?", options: ["Schedule II", "Schedule III, IV, and V", "Schedule I", "All schedules"], correctIndex: 1, rationale: "Schedules III, IV, and V all allow up to 5 refills within 6 months from the date the prescription was issued." },
      { stem: "Which of the following is a Schedule II controlled substance?", options: ["Alprazolam (Xanax)", "Tramadol (Ultram)", "Oxycodone (OxyContin)", "Pregabalin (Lyrica)"], correctIndex: 2, rationale: "Oxycodone is Schedule II. Alprazolam and tramadol are Schedule IV. Pregabalin is Schedule V." },
      { stem: "A DEA number starts with 'BJ'. The second letter indicates:", options: ["The state of registration", "The drug schedule", "The first letter of the prescriber's last name", "The type of practice"], correctIndex: 2, rationale: "The second letter of a DEA number corresponds to the first letter of the registrant's last name. 'BJ' indicates a prescriber whose last name starts with 'J.'" },
      { stem: "How often must a pharmacy conduct a controlled substance inventory?", options: ["Annually", "Biennially (every 2 years)", "Quarterly", "Monthly"], correctIndex: 1, rationale: "Federal law requires a controlled substance inventory at least biennially (every 2 years). Some states require annual inventory." },
    ],
    faqs: [
      { q: "What is the difference between Schedule II and Schedule III?", a: "Schedule II has the highest abuse potential of prescribed drugs (no refills, new Rx each time). Schedule III has moderate abuse potential (5 refills in 6 months). The key practical difference for pharmacy techs is the refill restriction." },
      { q: "Can a Schedule II prescription be called in by phone?", a: "Only in an emergency. The prescriber can authorize up to a 72-hour supply by phone, but must provide a written prescription within 7 days (timeframe varies by state). E-prescribing (EPCS) is now the standard method." },
      { q: "Is marijuana a controlled substance?", a: "Federally, marijuana remains a Schedule I controlled substance. However, many states have legalized medical and/or recreational use. State pharmacies follow state law for state-authorized programs, but it remains illegal under federal law." },
    ],
    relatedPages: ["medication-safety", "pharmacy-operations", "hipaa-patient-privacy"],
    metaTitle: "DEA Controlled Substance Schedules - Pharmacy Tech Guide | PTCB Exam",
    metaDescription: "Master DEA controlled substance schedules I-V for the PTCB exam. Refill rules, prescription requirements, DEA number verification, and practice questions.",
    keywords: "controlled substances, DEA schedules, Schedule II, refill rules, pharmacy technician, PTCB exam",
  },
  {
    slug: "medication-safety",
    title: "Medication Safety & Error Prevention",
    description: "Essential medication safety practices, LASA drugs, Tall Man Lettering, error prevention strategies, and ISMP guidelines for the PTCB exam.",
    sections: [
      {
        heading: "Types of Medication Errors",
        content: "Medication errors can occur at any point in the medication-use process: prescribing, transcribing, dispensing, administering, and monitoring. Pharmacy technicians play a critical role in preventing errors at the dispensing stage.",
        keyPoints: [
          "Prescribing errors: wrong drug, dose, route, or patient",
          "Dispensing errors: wrong drug, strength, quantity, or label",
          "Administration errors: wrong time, route, or technique",
          "Most pharmacy errors involve look-alike/sound-alike (LASA) drug names",
          "Root cause analysis identifies systemic causes, not individual blame",
        ],
      },
      {
        heading: "Look-Alike / Sound-Alike (LASA) Medications",
        content: "LASA drugs have names that look or sound similar, creating confusion during prescribing, dispensing, and administration. ISMP maintains a list of commonly confused drug names.",
        keyPoints: [
          "Prilosec (omeprazole) ↔ Prozac (fluoxetine)",
          "Cozaar (losartan) ↔ Zocor (simvastatin)",
          "Celebrex (celecoxib) ↔ Celexa (citalopram) ↔ Cerebyx (fosphenytoin)",
          "HumaLOG (insulin lispro) ↔ HumuLIN (insulin NPH/regular)",
          "PredniSONE ↔ PrednisoLONE",
          "OxyCODONE ↔ OxyMORphone",
          "ClonazePAM ↔ ClonaZePAM ↔ CloniDINE",
          "HydrALAZINE ↔ HydrOXYzine",
        ],
      },
      {
        heading: "Tall Man Lettering (TML)",
        content: "FDA and ISMP recommend using uppercase letters within drug names to highlight differences between commonly confused medications. This visual cue helps differentiate LASA pairs.",
        keyPoints: [
          "Uses uppercase letters to distinguish similar drug names",
          "FDA-approved and ISMP-recommended practice",
          "Examples: predniSONE vs prednisoLONE, buPROPion vs busPIRone",
          "Implemented in pharmacy software, labels, and storage labels",
        ],
      },
      {
        heading: "Error Prevention Strategies",
        content: "Multiple strategies work together to create a culture of safety in the pharmacy. No single strategy eliminates all errors — it requires a systems-based approach.",
        keyPoints: [
          "Barcode scanning at point of dispensing — verifies correct drug/strength",
          "Independent double-checks — second person verifies critical steps",
          "Separate storage of LASA drugs on pharmacy shelves",
          "Use of leading zeros (0.5 mg) and avoidance of trailing zeros (1.0 mg → 1 mg)",
          "Automated dispensing machines reduce manual selection errors",
          "Patient counseling as a final safety checkpoint",
          "MedGuides required for specific high-risk medications",
        ],
      },
      {
        heading: "Reporting Medication Errors",
        content: "Reporting errors is essential for system improvement. Pharmacy technicians should know the internal and external reporting mechanisms.",
        keyPoints: [
          "Internal: report through facility's incident/event reporting system",
          "External: ISMP Medication Errors Reporting Program (MERP)",
          "External: FDA MedWatch for adverse events and product problems",
          "Non-punitive reporting culture encourages honest reporting",
          "Near-misses (caught before reaching patient) should also be reported",
        ],
      },
    ],
    practiceQuestions: [
      { stem: "Which pair of medications requires Tall Man Lettering to differentiate?", options: ["Lipitor / Lisinopril", "PredniSONE / PrednisoLONE", "Metformin / Metoprolol", "Amoxicillin / Azithromycin"], correctIndex: 1, rationale: "PredniSONE and prednisoLONE are a classic LASA pair that uses Tall Man Lettering to highlight the different portions of the drug name." },
      { stem: "What is the primary purpose of barcode scanning during dispensing?", options: ["To update inventory", "To verify the correct drug and strength are being dispensed", "To calculate the price", "To check insurance coverage"], correctIndex: 1, rationale: "Barcode scanning at the point of dispensing is a critical safety check that verifies the correct drug, strength, and NDC are being used, preventing dispensing errors." },
      { stem: "A pharmacy technician notices that Cozaar (losartan) and Zocor (simvastatin) are stored next to each other. What should they do?", options: ["Nothing — alphabetical order is standard", "Separate them to reduce the risk of a LASA dispensing error", "Move both to a different shelf", "Label them with red stickers"], correctIndex: 1, rationale: "LASA drug pairs should be stored separately on pharmacy shelves to reduce the risk of accidental selection of the wrong product." },
      { stem: "Where should a pharmacy technician report a medication error that reached the patient?", options: ["Only to the pharmacist", "Through the facility's incident reporting system and to ISMP/FDA MedWatch", "To the patient only", "No reporting is needed if the patient is unharmed"], correctIndex: 1, rationale: "Medication errors should be reported internally through the facility's event reporting system and can also be reported externally to ISMP's MERP and/or FDA MedWatch." },
    ],
    faqs: [
      { q: "What is a medication error?", a: "A medication error is any preventable event that may cause or lead to inappropriate medication use or patient harm. This includes errors in prescribing, transcribing, dispensing, administering, and monitoring medications." },
      { q: "What should I do if I catch a dispensing error before it reaches the patient?", a: "This is called a 'near-miss.' Report it through your facility's reporting system. Near-misses are valuable for identifying system weaknesses and preventing future errors that might reach patients." },
      { q: "What are MedGuides?", a: "MedGuides are FDA-required patient information handouts for specific high-risk medications. They must be dispensed with each fill. Examples include SSRIs/antidepressants (suicidality warning), NSAIDs (cardiovascular risk), and warfarin (bleeding risk)." },
    ],
    relatedPages: ["controlled-substances", "pharmacy-operations", "hipaa-patient-privacy"],
    metaTitle: "Medication Safety & Error Prevention - Pharmacy Tech Guide | PTCB Exam",
    metaDescription: "Master medication safety for the PTCB exam. LASA drugs, Tall Man Lettering, error prevention strategies, ISMP guidelines, and practice questions.",
    keywords: "medication safety, LASA drugs, Tall Man Lettering, error prevention, ISMP, pharmacy technician, PTCB exam",
  },
  {
    slug: "pharmacy-operations",
    title: "Pharmacy Operations & Prescription Processing",
    description: "Complete guide to pharmacy workflow, prescription processing, insurance billing, NDC numbers, and inventory management for the PTCB exam.",
    sections: [
      {
        heading: "Prescription Processing Workflow",
        content: "Understanding the pharmacy workflow from receipt to dispensing is fundamental for pharmacy technicians. Each step has specific responsibilities and quality checkpoints.",
        keyPoints: [
          "Step 1: Receive and verify prescription (patient info, prescriber info, drug/dose/route/quantity/refills, date, signature)",
          "Step 2: Patient profile review (allergies, current medications, insurance, DOB)",
          "Step 3: Data entry / transcription into pharmacy system",
          "Step 4: Drug utilization review (DUR) — system checks for interactions, allergies, duplications",
          "Step 5: Fill/count/pour the medication",
          "Step 6: Pharmacist verification (final check before patient receives medication)",
          "Step 7: Patient counseling (by pharmacist) and dispensing",
        ],
      },
      {
        heading: "NDC Numbers (National Drug Code)",
        content: "The NDC number is a unique 10-digit, 3-segment identifier for every drug product in the United States.",
        keyPoints: [
          "Format: XXXXX-XXXX-XX (5-4-2, though variations exist displayed as 11 digits)",
          "First segment (labeler code): identifies manufacturer or distributor",
          "Second segment (product code): identifies drug, strength, dosage form",
          "Third segment (package code): identifies package size and type",
          "Used for insurance billing, inventory management, and drug identification",
          "Barcode scanning reads the NDC to verify correct product",
        ],
      },
      {
        heading: "Insurance & Third-Party Billing",
        content: "Processing insurance claims is a major pharmacy technician responsibility. Understanding common rejection codes and troubleshooting is essential.",
        keyPoints: [
          "BIN number: identifies the insurance processor",
          "PCN (Processor Control Number): routing number for claims",
          "Group number: identifies the employer/plan group",
          "Person code: identifies the individual within the plan (01 = cardholder, 02 = spouse, 03+ = dependents)",
          "DAW (Dispense as Written) codes: DAW 0 = no preference, DAW 1 = prescriber requests brand, DAW 2 = patient requests brand",
          "Common rejections: refill too soon, prior authorization needed, drug not covered, NDC not valid",
        ],
      },
      {
        heading: "Inventory Management",
        content: "Proper inventory management ensures medications are available when needed while minimizing waste from expired products.",
        keyPoints: [
          "Perpetual inventory: continuously updated with each transaction",
          "Point-of-sale (POS) system: tracks sales in real-time",
          "Par levels: minimum and maximum quantities to maintain",
          "First-in, first-out (FIFO): dispense oldest stock first to minimize expiration waste",
          "Drug recalls: Class I (serious risk), Class II (temporary/reversible), Class III (unlikely harm)",
          "Beyond-use dating (BUD): compounded medications have shorter expiration than manufactured",
        ],
      },
      {
        heading: "Drug Recall Classification",
        content: "The FDA classifies drug recalls by severity to guide the urgency of response.",
        keyPoints: [
          "Class I: reasonable probability of serious adverse health consequences or death",
          "Class II: may cause temporary or medically reversible adverse health consequences",
          "Class III: not likely to cause adverse health consequences",
          "Pharmacies must have procedures to remove recalled products from shelves",
          "Patients who received recalled products should be notified",
        ],
      },
    ],
    practiceQuestions: [
      { stem: "What are the three segments of an NDC number?", options: ["Drug-Dose-Route", "Labeler-Product-Package", "State-Pharmacy-Drug", "Manufacturer-Lot-Expiration"], correctIndex: 1, rationale: "The NDC has three segments: Labeler (manufacturer/distributor), Product (drug/strength/form), and Package (size/type)." },
      { stem: "What does DAW 1 indicate on a prescription?", options: ["No product selection preference", "Prescriber requests brand name only", "Patient requests brand name", "Pharmacy selects generic"], correctIndex: 1, rationale: "DAW 1 means the prescriber has specifically requested the brand name product. The pharmacy cannot substitute a generic." },
      { stem: "Which drug recall class indicates the most serious health risk?", options: ["Class I", "Class II", "Class III", "Class IV"], correctIndex: 0, rationale: "Class I recalls have a reasonable probability of serious adverse health consequences or death. This is the most urgent recall classification." },
      { stem: "What does FIFO stand for in inventory management?", options: ["Fill In, Fill Out", "First In, First Out", "Final Inventory, First Order", "Fast Inventory, Fast Output"], correctIndex: 1, rationale: "First In, First Out means the oldest stock (first in) is dispensed first (first out) to minimize expiration waste." },
      { stem: "In the pharmacy workflow, who performs the final verification before dispensing?", options: ["Pharmacy technician", "Pharmacist", "Pharmacy clerk", "The patient"], correctIndex: 1, rationale: "The pharmacist performs the final verification check, reviewing the prescription, filled medication, and patient profile before the medication is dispensed to the patient." },
    ],
    faqs: [
      { q: "What is a DUR (Drug Utilization Review)?", a: "A DUR is an automated system check performed when a prescription is entered. It screens for drug interactions, therapeutic duplications, allergy conflicts, incorrect dosing, and other safety concerns. Alerts must be reviewed by the pharmacist." },
      { q: "What is an NDC number used for?", a: "The NDC (National Drug Code) is used to identify specific drug products for insurance billing, inventory management, barcode scanning during dispensing, and regulatory tracking." },
      { q: "What should a pharmacy do when a drug recall is issued?", a: "The pharmacy should immediately identify affected products using lot numbers, remove them from shelves, quarantine them for return, notify affected patients (for Class I recalls), and document all actions taken." },
    ],
    relatedPages: ["controlled-substances", "medication-safety", "hipaa-patient-privacy"],
    metaTitle: "Pharmacy Operations & Prescription Processing | PTCB Exam Prep",
    metaDescription: "Master pharmacy operations for the PTCB exam. Prescription workflow, NDC numbers, insurance billing, inventory management, and practice questions.",
    keywords: "pharmacy operations, prescription processing, NDC number, insurance billing, PTCB exam, pharmacy technician",
  },
  {
    slug: "hipaa-patient-privacy",
    title: "HIPAA & Patient Privacy for Pharmacy Technicians",
    description: "Essential HIPAA regulations, PHI handling, patient rights, and privacy practices every pharmacy technician must know for the PTCB exam.",
    sections: [
      {
        heading: "What is HIPAA?",
        content: "The Health Insurance Portability and Accountability Act (1996) establishes national standards for protecting patient health information. It applies to all covered entities including pharmacies.",
        keyPoints: [
          "Enacted in 1996, Privacy Rule effective 2003",
          "Applies to covered entities: health plans, healthcare clearinghouses, healthcare providers (including pharmacies)",
          "Business associates who handle PHI on behalf of covered entities are also bound",
          "Violations can result in civil penalties ($100-$50,000 per violation) and criminal penalties (up to $250,000 and imprisonment)",
        ],
      },
      {
        heading: "Protected Health Information (PHI)",
        content: "PHI is any individually identifiable health information that relates to a person's past, present, or future health condition, healthcare, or payment for healthcare.",
        keyPoints: [
          "Includes: name, DOB, address, phone number, SSN, medical record numbers, prescription information, diagnosis, insurance ID",
          "PHI can be in any form: paper, electronic (ePHI), or verbal",
          "De-identified data (all 18 identifiers removed) is NOT PHI",
          "18 HIPAA identifiers include: name, dates, phone/fax, email, SSN, MRN, health plan beneficiary number, account numbers, vehicle/device identifiers, web URLs, IP addresses, biometric data, photos, and any other unique identifier",
        ],
      },
      {
        heading: "Minimum Necessary Standard",
        content: "HIPAA requires that only the minimum amount of PHI necessary to accomplish the intended purpose should be used or disclosed.",
        keyPoints: [
          "Access only the PHI needed for your specific job function",
          "Do not access patient records out of curiosity",
          "Limit disclosures to what is relevant for the specific purpose",
          "Applies to uses, disclosures, and requests for PHI",
        ],
      },
      {
        heading: "Patient Rights Under HIPAA",
        content: "Patients have specific rights regarding their health information under the HIPAA Privacy Rule.",
        keyPoints: [
          "Right to access their own health records",
          "Right to request amendments to their records",
          "Right to an accounting of disclosures (who has accessed their PHI)",
          "Right to request restrictions on uses and disclosures",
          "Right to receive a Notice of Privacy Practices (NPP)",
          "Right to request confidential communications (e.g., call a specific phone number)",
        ],
      },
      {
        heading: "Permitted Disclosures (TPO)",
        content: "PHI can be used and disclosed without patient authorization for Treatment, Payment, and healthcare Operations (TPO).",
        keyPoints: [
          "Treatment: sharing information with other providers for patient care (e.g., calling prescriber about a drug interaction)",
          "Payment: submitting claims to insurance companies for reimbursement",
          "Operations: quality improvement, auditing, staff training with de-identified data",
          "Patient authorization required for: marketing, sale of PHI, psychotherapy notes, most research",
          "Other exceptions: public health, law enforcement, judicial proceedings (with proper authorization/court order)",
        ],
      },
    ],
    practiceQuestions: [
      { stem: "Which of the following is NOT protected health information (PHI)?", options: ["Patient's prescription history", "Patient's insurance ID number", "De-identified aggregate data", "Patient's date of birth"], correctIndex: 2, rationale: "De-identified data (all 18 HIPAA identifiers removed) is NOT considered PHI. All other options contain individually identifiable health information." },
      { stem: "A pharmacy technician's friend asks about a patient's prescription. What should the technician do?", options: ["Share the information since they know the friend", "Decline — this would violate HIPAA", "Share only the drug name", "Check with the pharmacist first"], correctIndex: 1, rationale: "Disclosing any patient information to an unauthorized person, including friends and family, violates HIPAA. The technician must decline and explain they cannot share patient information." },
      { stem: "Which HIPAA standard requires accessing only the minimum PHI needed for a task?", options: ["Privacy Rule", "Minimum Necessary Standard", "Security Rule", "Breach Notification Rule"], correctIndex: 1, rationale: "The Minimum Necessary Standard requires that covered entities limit uses, disclosures, and requests for PHI to the minimum amount necessary to accomplish the intended purpose." },
      { stem: "Which of the following is a permitted use of PHI without patient authorization?", options: ["Marketing a new pharmacy service", "Submitting an insurance claim for prescription payment", "Posting patient success stories on social media", "Sharing records with the patient's employer"], correctIndex: 1, rationale: "Payment (submitting insurance claims) is one of the three TPO exceptions that allow PHI use without specific patient authorization." },
    ],
    faqs: [
      { q: "What happens if a pharmacy technician violates HIPAA?", a: "HIPAA violations can result in disciplinary action from the employer, civil monetary penalties ($100-$50,000 per violation, up to $1.5 million per year), and criminal penalties for willful violations (fines up to $250,000 and imprisonment up to 10 years)." },
      { q: "Can I discuss a patient's prescription with their family member?", a: "Only if the patient is present and does not object, or if the patient has given prior authorization. In emergency situations, a provider may use professional judgment to share information with family members involved in care." },
      { q: "What is a Notice of Privacy Practices (NPP)?", a: "An NPP is a document that pharmacies must provide to patients describing how their PHI may be used and disclosed, their rights under HIPAA, and the pharmacy's legal duties regarding PHI protection." },
    ],
    relatedPages: ["controlled-substances", "medication-safety", "pharmacy-operations"],
    metaTitle: "HIPAA & Patient Privacy for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master HIPAA regulations for the PTCB exam. PHI protection, patient rights, permitted disclosures, minimum necessary standard, and practice questions.",
    keywords: "HIPAA, patient privacy, PHI, protected health information, pharmacy technician, PTCB exam",
  },
];

export function getLawPageBySlug(slug: string): PharmTechLawPage | undefined {
  return PHARMTECH_LAW_PAGES.find(p => p.slug === slug);
}
