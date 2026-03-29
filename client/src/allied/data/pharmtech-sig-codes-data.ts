export interface SigCode {
  abbreviation: string;
  latin: string;
  meaning: string;
  category: string;
  examples: string[];
  dangerousAbbreviation?: boolean;
  doNotUseAlternative?: string;
}

export interface SigCodePage {
  slug: string;
  title: string;
  description: string;
  codes: SigCode[];
  practiceQuestions: { stem: string; options: string[]; correctIndex: number; rationale: string }[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const PHARMTECH_SIG_CODES: SigCodePage[] = [
  {
    slug: "common-sig-codes",
    title: "Common Sig Codes Every Pharmacy Tech Must Know",
    description: "Complete reference of the most frequently used prescription sig codes (abbreviations) for the PTCB, ExCPT, and PEBC exams.",
    codes: [
      { abbreviation: "PO", latin: "Per os", meaning: "By mouth", category: "Route", examples: ["Take 1 tab PO BID = Take 1 tablet by mouth twice daily"] },
      { abbreviation: "SL", latin: "Sublingual", meaning: "Under the tongue", category: "Route", examples: ["Nitroglycerin 1 tab SL PRN chest pain"] },
      { abbreviation: "PR", latin: "Per rectum", meaning: "Rectally", category: "Route", examples: ["Acetaminophen suppository PR Q4-6H PRN fever"] },
      { abbreviation: "SubQ / SC", latin: "Subcutaneous", meaning: "Under the skin", category: "Route", examples: ["Insulin 30 units SubQ QHS"] },
      { abbreviation: "IM", latin: "Intramuscular", meaning: "Into the muscle", category: "Route", examples: ["Vitamin B12 1000 mcg IM monthly"] },
      { abbreviation: "IV", latin: "Intravenous", meaning: "Into the vein", category: "Route", examples: ["NS 1000 mL IV over 8 hours"] },
      { abbreviation: "TOP", latin: "Topical", meaning: "Applied to the skin", category: "Route", examples: ["Apply cream TOP to affected area BID"] },
      { abbreviation: "INH", latin: "Inhalation", meaning: "By inhalation", category: "Route", examples: ["Albuterol 2 puffs INH Q4-6H PRN"] },
      { abbreviation: "OU", latin: "Oculus uterque", meaning: "Both eyes", category: "Route", examples: ["1 gtt OU BID"] },
      { abbreviation: "OD", latin: "Oculus dexter", meaning: "Right eye", category: "Route", examples: ["1 gtt OD TID"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'right eye'" },
      { abbreviation: "OS", latin: "Oculus sinister", meaning: "Left eye", category: "Route", examples: ["1 gtt OS QID"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'left eye'" },
      { abbreviation: "AU", latin: "Auris uterque", meaning: "Both ears", category: "Route", examples: ["2 gtts AU BID"] },
      { abbreviation: "AD", latin: "Auris dextra", meaning: "Right ear", category: "Route", examples: ["3 gtts AD TID"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'right ear'" },
      { abbreviation: "AS", latin: "Auris sinistra", meaning: "Left ear", category: "Route", examples: ["3 gtts AS TID"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'left ear'" },
      { abbreviation: "QD", latin: "Quaque die", meaning: "Every day / once daily", category: "Frequency", examples: ["Lisinopril 10 mg PO QD"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'daily'" },
      { abbreviation: "BID", latin: "Bis in die", meaning: "Twice daily", category: "Frequency", examples: ["Metoprolol 50 mg PO BID"] },
      { abbreviation: "TID", latin: "Ter in die", meaning: "Three times daily", category: "Frequency", examples: ["Amoxicillin 500 mg PO TID"] },
      { abbreviation: "QID", latin: "Quater in die", meaning: "Four times daily", category: "Frequency", examples: ["Ibuprofen 400 mg PO QID"] },
      { abbreviation: "Q4H", latin: "Quaque 4 hora", meaning: "Every 4 hours", category: "Frequency", examples: ["Acetaminophen 500 mg PO Q4H PRN pain"] },
      { abbreviation: "Q6H", latin: "Quaque 6 hora", meaning: "Every 6 hours", category: "Frequency", examples: ["Amoxicillin 250 mg PO Q6H"] },
      { abbreviation: "Q8H", latin: "Quaque 8 hora", meaning: "Every 8 hours", category: "Frequency", examples: ["Cephalexin 500 mg PO Q8H"] },
      { abbreviation: "Q12H", latin: "Quaque 12 hora", meaning: "Every 12 hours", category: "Frequency", examples: ["Metformin 500 mg PO Q12H"] },
      { abbreviation: "QHS", latin: "Quaque hora somni", meaning: "At bedtime", category: "Frequency", examples: ["Insulin glargine 30 units SubQ QHS"] },
      { abbreviation: "QAM", latin: "Quaque ante meridiem", meaning: "Every morning", category: "Frequency", examples: ["Levothyroxine 50 mcg PO QAM"] },
      { abbreviation: "QPM", latin: "Quaque post meridiem", meaning: "Every evening", category: "Frequency", examples: ["Montelukast 10 mg PO QPM"] },
      { abbreviation: "PRN", latin: "Pro re nata", meaning: "As needed", category: "Frequency", examples: ["Ibuprofen 200 mg PO Q6H PRN pain"] },
      { abbreviation: "STAT", latin: "Statim", meaning: "Immediately", category: "Frequency", examples: ["Epinephrine 0.3 mg IM STAT"] },
      { abbreviation: "AC", latin: "Ante cibum", meaning: "Before meals", category: "Timing", examples: ["Glipizide 5 mg PO AC breakfast"] },
      { abbreviation: "PC", latin: "Post cibum", meaning: "After meals", category: "Timing", examples: ["Metformin 500 mg PO PC"] },
      { abbreviation: "gtt(s)", latin: "Guttae", meaning: "Drop(s)", category: "Dosage Form", examples: ["1 gtt OU BID = 1 drop in both eyes twice daily"] },
      { abbreviation: "tab", latin: "Tabella", meaning: "Tablet", category: "Dosage Form", examples: ["1 tab PO QD"] },
      { abbreviation: "cap", latin: "Capsula", meaning: "Capsule", category: "Dosage Form", examples: ["1 cap PO TID"] },
      { abbreviation: "supp", latin: "Suppositorium", meaning: "Suppository", category: "Dosage Form", examples: ["1 supp PR Q6H PRN"] },
      { abbreviation: "sol", latin: "Solutio", meaning: "Solution", category: "Dosage Form", examples: ["10 mL sol PO QD"] },
      { abbreviation: "susp", latin: "Suspensio", meaning: "Suspension", category: "Dosage Form", examples: ["5 mL susp PO TID"] },
      { abbreviation: "ung", latin: "Unguentum", meaning: "Ointment", category: "Dosage Form", examples: ["Apply ung to affected area BID"] },
      { abbreviation: "cr", latin: "Crema", meaning: "Cream", category: "Dosage Form", examples: ["Apply cr TOP BID"] },
      { abbreviation: "tsp", latin: "", meaning: "Teaspoonful (5 mL)", category: "Measurement", examples: ["1 tsp PO TID = 5 mL by mouth three times daily"] },
      { abbreviation: "tbsp", latin: "", meaning: "Tablespoonful (15 mL)", category: "Measurement", examples: ["1 tbsp PO BID = 15 mL by mouth twice daily"] },
      { abbreviation: "mL", latin: "", meaning: "Milliliter", category: "Measurement", examples: ["10 mL PO BID"] },
      { abbreviation: "mg", latin: "", meaning: "Milligram", category: "Measurement", examples: ["500 mg PO TID"] },
      { abbreviation: "mcg", latin: "", meaning: "Microgram", category: "Measurement", examples: ["50 mcg PO QD"] },
      { abbreviation: "NKA", latin: "", meaning: "No known allergies", category: "Clinical", examples: ["Chart documentation: NKA"] },
      { abbreviation: "NKDA", latin: "", meaning: "No known drug allergies", category: "Clinical", examples: ["Patient profile: NKDA"] },
      { abbreviation: "DAW", latin: "", meaning: "Dispense as written", category: "Dispensing", examples: ["DAW 1 = physician requests brand only"] },
      { abbreviation: "NR", latin: "", meaning: "No refills", category: "Dispensing", examples: ["Oxycodone 5 mg #30, NR"] },
      { abbreviation: "UD", latin: "Ut dictum", meaning: "As directed", category: "Dispensing", examples: ["Use UD = use as directed by prescriber"] },
      { abbreviation: "aa", latin: "Ana", meaning: "Of each", category: "Compounding", examples: ["Mix ingredients aa = equal parts of each"] },
      { abbreviation: "qs", latin: "Quantum sufficiat", meaning: "A sufficient quantity", category: "Compounding", examples: ["Water qs to 100 mL = add water to reach 100 mL"] },
      { abbreviation: "NTE", latin: "", meaning: "Not to exceed", category: "Clinical", examples: ["Acetaminophen NTE 4 g/day"] },
      { abbreviation: "D/C", latin: "", meaning: "Discontinue (or discharge)", category: "Clinical", examples: ["D/C lisinopril — can mean discontinue or discharge depending on context"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'discontinue' or 'discharge'" },
    ],
    practiceQuestions: [
      { stem: "What does 'i tab PO BID AC' mean?", options: ["1 tablet by mouth twice daily before meals", "1 tablet by mouth twice daily after meals", "1 tablet by injection twice daily", "1 tablet by mouth at bedtime"], correctIndex: 0, rationale: "PO = by mouth, BID = twice daily, AC = before meals (ante cibum). So: take 1 tablet by mouth twice daily before meals." },
      { stem: "The sig reads '1 gtt OU TID.' How many total drops per day?", options: ["3 drops", "6 drops", "2 drops", "4 drops"], correctIndex: 1, rationale: "1 gtt (drop) in OU (both eyes) TID (three times daily) = 1 drop × 2 eyes × 3 times = 6 drops per day." },
      { stem: "Which abbreviation means 'as needed'?", options: ["STAT", "PRN", "NTE", "UD"], correctIndex: 1, rationale: "PRN (pro re nata) means 'as needed.' STAT means immediately, NTE means not to exceed, UD means as directed." },
      { stem: "What does 'QHS' mean?", options: ["Every hour", "Four times daily", "At bedtime", "Every other day"], correctIndex: 2, rationale: "QHS (quaque hora somni) means 'at bedtime' or 'every night at the hour of sleep.'" },
      { stem: "'Qs ad 100 mL' in a compounding formula means:", options: ["Add exactly 100 mL", "Add a sufficient quantity to make 100 mL total", "Mix 100 mL of each ingredient", "Discard after 100 mL"], correctIndex: 1, rationale: "'qs' (quantum sufficiat) means 'a sufficient quantity.' 'qs ad 100 mL' means add enough diluent to bring the total volume to 100 mL." },
    ],
    faqs: [
      { q: "What is a sig code in pharmacy?", a: "A sig code (from Latin 'signa' meaning 'label') is an abbreviation used on prescriptions to communicate dosing instructions. For example, 'PO BID' means 'by mouth twice daily.' Pharmacy technicians must know these to accurately process prescriptions." },
      { q: "How many sig codes do I need to know for the PTCB exam?", a: "You should know approximately 40-50 common sig codes covering routes of administration, frequency, timing, dosage forms, and measurements. Focus on the most commonly tested ones: PO, BID, TID, QID, PRN, QD, QHS, AC, PC, and all eye/ear abbreviations." },
      { q: "What are the ISMP 'Do Not Use' abbreviations?", a: "The Institute for Safe Medication Practices (ISMP) and The Joint Commission (TJC) have a list of error-prone abbreviations including: QD (write 'daily'), QOD (write 'every other day'), U (write 'units'), IU (write 'international units'), MS/MSO4/MgSO4 (write full drug names), trailing zeros (1.0 → write 1), and lack of leading zeros (.5 → write 0.5)." },
    ],
    metaTitle: "Common Pharmacy Sig Codes - Complete Reference | PTCB Exam Prep",
    metaDescription: "Master all common pharmacy sig codes for the PTCB exam. Complete list of prescription abbreviations with Latin origins, meanings, and practice questions.",
    keywords: "sig codes, pharmacy abbreviations, prescription abbreviations, PTCB exam, pharmacy technician",
  },
  {
    slug: "dangerous-abbreviations",
    title: "Dangerous Abbreviations & ISMP Do-Not-Use List",
    description: "Learn the error-prone abbreviations every pharmacy technician must recognize to prevent medication errors — critical PTCB/ExCPT exam content.",
    codes: [
      { abbreviation: "U", latin: "", meaning: "Units", category: "Do Not Use", examples: ["Insulin 10 U → can be misread as '10 0' (100)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'units'" },
      { abbreviation: "IU", latin: "", meaning: "International Units", category: "Do Not Use", examples: ["Vitamin D 1000 IU → 'IU' can be misread as 'IV'"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'international units'" },
      { abbreviation: "QD", latin: "Quaque die", meaning: "Daily", category: "Do Not Use", examples: ["Lisinopril 10 mg QD → period after Q can be misread as QID"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'daily'" },
      { abbreviation: "QOD", latin: "Quaque altera die", meaning: "Every other day", category: "Do Not Use", examples: ["Prednisone QOD → can be misread as QD (daily)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'every other day'" },
      { abbreviation: "MS, MSO4", latin: "", meaning: "Morphine sulfate", category: "Do Not Use", examples: ["MS 10 mg → could mean morphine sulfate OR magnesium sulfate"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'morphine sulfate'" },
      { abbreviation: "MgSO4", latin: "", meaning: "Magnesium sulfate", category: "Do Not Use", examples: ["MgSO4 can be confused with MSO4 (morphine)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'magnesium sulfate'" },
      { abbreviation: "Trailing zero (X.0)", latin: "", meaning: "Number with unnecessary decimal", category: "Do Not Use", examples: ["1.0 mg can be misread as 10 mg if decimal is missed"], dangerousAbbreviation: true, doNotUseAlternative: "Write '1 mg' (no trailing zero)" },
      { abbreviation: "Lack of leading zero (.X)", latin: "", meaning: "Decimal without leading zero", category: "Do Not Use", examples: [".5 mg can be misread as 5 mg if decimal is missed"], dangerousAbbreviation: true, doNotUseAlternative: "Write '0.5 mg' (use leading zero)" },
      { abbreviation: "µg", latin: "", meaning: "Microgram", category: "Do Not Use", examples: ["µg can be misread as mg (1000x overdose)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'mcg'" },
      { abbreviation: "cc", latin: "", meaning: "Cubic centimeter", category: "Do Not Use", examples: ["cc can be misread as 'U' (units)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'mL'" },
      { abbreviation: "D/C", latin: "", meaning: "Discontinue or Discharge", category: "Do Not Use", examples: ["D/C medications — does it mean stop them or send them home with them?"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'discontinue' or 'discharge'" },
      { abbreviation: "HS", latin: "", meaning: "Half strength or at bedtime", category: "Do Not Use", examples: ["HS can mean 'half strength' (compounding) or 'hora somni' (bedtime)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'half strength' or 'at bedtime'" },
      { abbreviation: "SC / SQ", latin: "", meaning: "Subcutaneous", category: "Do Not Use", examples: ["SC can be misread as SL (sublingual)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'subcutaneous' or 'SubQ'" },
      { abbreviation: "AD, AS, AU", latin: "", meaning: "Right ear, Left ear, Both ears", category: "Do Not Use", examples: ["AD can be confused with OD (right eye)"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'right ear,' 'left ear,' 'both ears'" },
      { abbreviation: "OD, OS, OU", latin: "", meaning: "Right eye, Left eye, Both eyes", category: "Do Not Use", examples: ["OD can be confused with AD (right ear) or 'overdose'"], dangerousAbbreviation: true, doNotUseAlternative: "Write 'right eye,' 'left eye,' 'both eyes'" },
    ],
    practiceQuestions: [
      { stem: "A prescription reads 'Insulin 10 U SubQ QD.' What error-prone abbreviation is used?", options: ["SubQ", "QD and U", "Insulin", "10"], correctIndex: 1, rationale: "Both 'U' (should be 'units') and 'QD' (should be 'daily') are on the Joint Commission's Do-Not-Use list. 'U' can be misread as '0' and 'QD' can be misread as 'QID.'" },
      { stem: "Why is a trailing zero dangerous in medication orders?", options: ["It makes the number look smaller", "The decimal point can be missed, causing a 10x overdose", "It is grammatically incorrect", "It wastes space on the prescription"], correctIndex: 1, rationale: "A trailing zero (e.g., 1.0 mg) can be misread as 10 mg if the decimal point is not seen. This represents a potential 10-fold overdose. Always write '1 mg' not '1.0 mg.'" },
      { stem: "What should be written instead of 'MSO4'?", options: ["MS", "Morphine SO4", "Morphine sulfate", "MgSO4"], correctIndex: 2, rationale: "'MSO4' can be confused with 'MgSO4' (magnesium sulfate). Both should be written out completely: 'morphine sulfate' or 'magnesium sulfate.'" },
      { stem: "A prescription reads '.5 mg.' What correction is needed?", options: ["Write 5 mg", "Write 0.5 mg (add a leading zero)", "Write 50 mg", "No correction needed"], correctIndex: 1, rationale: "A 'naked' decimal point (.5) can be misread as 5 (a 10x overdose). A leading zero must be added: 0.5 mg. This makes the decimal point visible." },
    ],
    faqs: [
      { q: "What is the Joint Commission Do-Not-Use list?", a: "The Joint Commission (TJC) requires accredited hospitals to implement an official 'Do Not Use' list of dangerous abbreviations. The minimum list includes: U, IU, QD, QOD, trailing zeros, lack of leading zeros, and MS/MSO4/MgSO4." },
      { q: "Why are error-prone abbreviations important for the PTCB exam?", a: "Medication safety is a core PTCB knowledge domain. Questions about identifying and correcting dangerous abbreviations appear frequently on the exam. Understanding why these abbreviations cause errors demonstrates patient safety competency." },
      { q: "What is ISMP?", a: "The Institute for Safe Medication Practices (ISMP) is a nonprofit organization dedicated to preventing medication errors. They maintain an expanded list of error-prone abbreviations that goes beyond the TJC minimum requirement." },
    ],
    metaTitle: "Dangerous Pharmacy Abbreviations - ISMP Do-Not-Use List | PTCB Exam",
    metaDescription: "Master the ISMP and Joint Commission Do-Not-Use abbreviation list for the PTCB exam. Error-prone abbreviations, safety concerns, and practice questions.",
    keywords: "dangerous abbreviations, do not use list, ISMP, Joint Commission, medication safety, PTCB exam",
  },
  {
    slug: "sig-code-practice",
    title: "Sig Code Practice: Translate Full Prescriptions",
    description: "Practice translating complete prescription sig codes into plain English — the ultimate PTCB exam preparation for sig interpretation.",
    codes: [],
    practiceQuestions: [
      { stem: "Translate: 'Amoxicillin 500 mg, i cap PO TID x 10d'", options: ["Take 1 capsule by mouth 3 times daily for 10 days", "Take 5 capsules by mouth daily for 10 days", "Take 1 capsule by injection 3 times daily", "Take 1 capsule by mouth at bedtime for 10 days"], correctIndex: 0, rationale: "i = 1, cap = capsule, PO = by mouth, TID = three times daily, x 10d = for 10 days." },
      { stem: "Translate: 'Prednisone 10 mg, ii tabs PO QAM x 5d, then i tab PO QAM x 5d'", options: ["Take 2 tablets by mouth every morning for 5 days, then 1 tablet every morning for 5 days", "Take 10 tablets by mouth daily", "Take 2 tablets at bedtime for 10 days", "Take 1 tablet by mouth twice daily for 10 days"], correctIndex: 0, rationale: "ii = 2, tabs = tablets, PO = by mouth, QAM = every morning, x 5d = for 5 days. This is a taper schedule." },
      { stem: "Translate: '1 gtt OU QID x 7d'", options: ["1 drop in the right eye 4 times daily for 7 days", "1 drop in both eyes 4 times daily for 7 days", "1 drop in the left eye twice daily for 7 days", "4 drops in both eyes daily for 7 days"], correctIndex: 1, rationale: "gtt = drop, OU = both eyes (oculus uterque), QID = four times daily, x 7d = for 7 days." },
      { stem: "Translate: 'Nitroglycerin 0.4 mg, i tab SL Q5min PRN chest pain, NTE 3 tabs in 15 min'", options: ["1 tablet under the tongue every 5 minutes as needed for chest pain, not to exceed 3 tablets in 15 minutes", "1 tablet by mouth every 5 hours for chest pain", "3 tablets under the tongue immediately for chest pain", "1 tablet rectally as needed"], correctIndex: 0, rationale: "i = 1, tab = tablet, SL = sublingual (under the tongue), Q5min = every 5 minutes, PRN = as needed, NTE = not to exceed." },
      { stem: "Translate: 'Insulin glargine 25 units SubQ QHS'", options: ["25 units injected into the muscle every morning", "25 units injected under the skin at bedtime", "25 units by mouth at bedtime", "25 units injected under the skin twice daily"], correctIndex: 1, rationale: "SubQ = subcutaneous (under the skin), QHS = at bedtime (hora somni)." },
      { stem: "Translate: 'Apply ung to affected area BID'", options: ["Apply ointment to affected area twice daily", "Apply cream to affected area once daily", "Apply solution to both eyes twice daily", "Apply ointment to affected area four times daily"], correctIndex: 0, rationale: "ung = ointment (unguentum), BID = twice daily." },
      { stem: "Translate: 'ii puffs INH Q4-6H PRN SOB'", options: ["2 puffs by inhalation every 4-6 hours as needed for shortness of breath", "2 puffs by mouth every 4 hours", "1 puff by inhalation twice daily", "2 puffs by inhalation at bedtime"], correctIndex: 0, rationale: "ii = 2, INH = by inhalation, Q4-6H = every 4 to 6 hours, PRN = as needed, SOB = shortness of breath." },
      { stem: "Translate: 'Metformin 500 mg, i tab PO BID PC'", options: ["1 tablet by mouth twice daily after meals", "1 tablet by mouth twice daily before meals", "2 tablets by mouth daily with food", "1 tablet by mouth at bedtime"], correctIndex: 0, rationale: "i = 1, tab = tablet, PO = by mouth, BID = twice daily, PC = after meals (post cibum)." },
      { stem: "What is the total daily dose: 'Amoxicillin 250 mg/5 mL, 1 tsp PO TID'?", options: ["250 mg", "500 mg", "750 mg", "1000 mg"], correctIndex: 2, rationale: "1 tsp = 5 mL = 250 mg per dose. TID = 3 times daily. 250 mg × 3 = 750 mg total daily dose." },
      { stem: "How many drops per day: '2 gtts AS TID'?", options: ["2 drops", "4 drops", "6 drops", "8 drops"], correctIndex: 2, rationale: "2 gtts (drops) in AS (left ear) TID (three times daily). Since it's one ear: 2 × 3 = 6 drops per day." },
    ],
    faqs: [
      { q: "How do I get faster at reading sig codes?", a: "Practice is the key. Start by memorizing the most common abbreviations (PO, BID, TID, QID, PRN, QD, QHS), then practice translating complete prescription sigs. With repetition, you will read them as naturally as plain English." },
      { q: "Will the PTCB exam ask me to translate full sigs?", a: "Yes. The PTCB exam includes questions where you must interpret complete prescription directions, calculate days supply from sig codes, and identify errors in prescription abbreviations." },
    ],
    metaTitle: "Sig Code Practice Questions - Translate Prescriptions | PTCB Exam Prep",
    metaDescription: "Practice translating full prescription sig codes to plain English. PTCB exam preparation with 10+ practice questions and detailed rationales.",
    keywords: "sig code practice, translate prescriptions, pharmacy abbreviations, PTCB exam practice, pharmacy technician",
  },
];

export function getSigCodePageBySlug(slug: string): SigCodePage | undefined {
  return PHARMTECH_SIG_CODES.find(p => p.slug === slug);
}
