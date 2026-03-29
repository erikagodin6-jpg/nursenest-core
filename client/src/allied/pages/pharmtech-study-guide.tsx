import { Link } from "wouter";
import { ChevronRight, BookOpen, Brain, Pill, FileText, Target, Shield, Beaker, ClipboardList, AlertTriangle } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const SECTIONS = [
  {
    id: "pharmacology",
    title: "Pharmacology & Drug Classifications",
    icon: Pill,
    content: [
      "Understanding drug classifications is the foundation of pharmacy practice. The Top 200 drugs account for the majority of PTCB exam questions.",
      "Key drug classes include: analgesics (acetaminophen, NSAIDs, opioids), antibiotics (penicillins, cephalosporins, fluoroquinolones, macrolides), cardiovascular agents (ACE inhibitors, ARBs, beta-blockers, statins, calcium channel blockers), CNS agents (SSRIs, SNRIs, benzodiazepines, antipsychotics), endocrine agents (insulin, metformin, levothyroxine), and respiratory agents (bronchodilators, corticosteroids).",
      "Brand/generic name pairs you must know: atorvastatin (Lipitor), lisinopril (Zestril/Prinivil), metformin (Glucophage), amlodipine (Norvasc), omeprazole (Prilosec), levothyroxine (Synthroid), amoxicillin (Amoxil), metoprolol (Lopressor/Toprol-XL).",
      "Drug suffixes help identify classes: -pril (ACE inhibitors), -sartan (ARBs), -olol (beta-blockers), -statin (HMG-CoA reductase inhibitors), -prazole (proton pump inhibitors), -mycin/-micin (antibiotics), -ine (many antihistamines).",
    ],
    links: ["/allied-health/pharmacy-technician/lessons", "/allied-health/pharmacy-technician/flashcards"],
  },
  {
    id: "dosage-calculations",
    title: "Dosage Calculations & Math",
    icon: Target,
    content: [
      "Pharmaceutical calculations are tested heavily on the PTCB exam. Master unit conversions, ratio-proportion, and dimensional analysis methods.",
      "Essential conversions: 1 kg = 2.2 lb, 1 oz = 30 mL (28.35 g), 1 tsp = 5 mL, 1 tbsp = 15 mL, 1 cup = 240 mL, 1 grain = 65 mg, 1 L = 1000 mL.",
      "Concentration calculations: percent strength (w/v = g/100mL, v/v = mL/100mL, w/w = g/100g), ratio strength (1:1000 = 1g/1000mL), parts per million (mg/L).",
      "Alligation method: Used when mixing two concentrations to get a desired concentration. Draw a tic-tac-toe grid with higher concentration top-left, lower bottom-left, desired in center. Cross-subtract to get parts.",
      "IV flow rate calculations: Flow rate (mL/hr) = Total volume (mL) / Time (hr). Drip rate (gtt/min) = Volume (mL) × Drop factor (gtt/mL) / Time (min).",
      "Pediatric dosing: Often weight-based. Dose = Weight (kg) × Dose per kg. Young's Rule: Child dose = [Age / (Age + 12)] × Adult dose. Clark's Rule: Child dose = [Weight in lb / 150] × Adult dose.",
    ],
    links: ["/allied-health/pharmacy-technician/lessons", "/allied-health/pharmacy-technician/practice-questions"],
  },
  {
    id: "pharmacy-law",
    title: "Pharmacy Law & Regulations",
    icon: FileText,
    content: [
      "Federal pharmacy law is a significant portion of the PTCB exam. Key legislation includes the Federal Food, Drug, and Cosmetic Act, the Controlled Substances Act (CSA), HIPAA, and the Drug Supply Chain Security Act (DSCSA).",
      "DEA Schedules: Schedule I (no medical use, high abuse potential — heroin, LSD), Schedule II (high abuse potential — oxycodone, amphetamine, fentanyl), Schedule III (moderate abuse potential — testosterone, ketamine, codeine combinations), Schedule IV (lower abuse potential — benzodiazepines, zolpidem, tramadol), Schedule V (lowest abuse potential — pregabalin, cough syrups with codeine).",
      "Controlled substance prescriptions: C-II prescriptions cannot be refilled and require a new prescription each time. C-III through C-V can be refilled up to 5 times within 6 months of the date written.",
      "DEA numbers: The second-to-last digit checksum method: Add digits 1, 3, 5 → Sum A. Add digits 2, 4, 6 → Sum B. (A + 2B) mod 10 should equal the last digit. First letter: A/B/F for practitioners, M for mid-level practitioners.",
      "HIPAA: Protected Health Information (PHI) includes any individually identifiable health information. Minimum necessary standard applies — only access what's needed for the task. Patients have the right to access their records and request amendments.",
      "Recall classifications: Class I (serious adverse health consequences or death), Class II (temporary or reversible adverse effects), Class III (not likely to cause adverse health consequences).",
    ],
    links: ["/allied-health/pharmacy-technician/lessons", "/allied-health/pharmacy-technician/practice-questions"],
  },
  {
    id: "compounding",
    title: "Sterile & Non-Sterile Compounding",
    icon: Beaker,
    content: [
      "USP <795> governs non-sterile compounding, USP <797> governs sterile compounding, and USP <800> governs hazardous drug handling. These are critical exam topics.",
      "USP <797> key concepts: Primary Engineering Controls (PECs) include laminar airflow workbenches (LAFWs) and compounding aseptic isolators (CAIs). LAFWs must be in an ISO Class 5 environment. Buffer rooms are ISO Class 7, ante rooms are ISO Class 8.",
      "Beyond-use dating (BUD): Non-sterile compounding — based on stability data or defaults. Sterile compounding BUD depends on risk level: Low-risk (48 hr room temp, 14 days refrigerated), Medium-risk (30 hr room temp, 9 days refrigerated), High-risk (24 hr room temp, 3 days refrigerated) — unless sterility testing extends BUD.",
      "Aseptic technique: Hand hygiene with soap and water, then alcohol-based hand rub. Garbing order: shoe covers, hair cover, face mask, gown, gloves. Work at least 6 inches inside the LAFW. Never block first air between HEPA filter and critical sites.",
      "USP <800>: Applies to all healthcare settings handling hazardous drugs. Requires assessment of risk, containment strategies, use of closed-system transfer devices (CSTDs), proper PPE, deactivation/decontamination procedures, and medical surveillance.",
    ],
    links: ["/allied-health/pharmacy-technician/lessons", "/allied-health/pharmacy-technician/flashcards"],
  },
  {
    id: "prescription-processing",
    title: "Prescription Processing & Billing",
    icon: ClipboardList,
    content: [
      "Prescription processing is a core pharmacy technician function. Understanding sig codes, DAW codes, and insurance billing is essential.",
      "Common sig codes: PO (by mouth), SL (sublingual), PR (rectally), IM (intramuscular), IV (intravenous), SC/SubQ (subcutaneous), QD (daily), BID (twice daily), TID (three times daily), QID (four times daily), PRN (as needed), QHS (at bedtime), AC (before meals), PC (after meals), UD (as directed).",
      "DAW codes: DAW 0 (no product selection indicated — substitution allowed), DAW 1 (substitution not allowed by prescriber), DAW 2 (substitution allowed — patient requested brand), DAW 3-9 (various substitution scenarios).",
      "Insurance billing: BIN (Bank Identification Number), PCN (Processor Control Number), Group Number, ID Number. Common rejections: drug not covered (formulary issue), prior authorization required, refill too soon, quantity limits exceeded, step therapy required.",
      "NDC numbers: 10-digit code in 5-4-1, 5-3-2, or 4-4-2 format. First segment = labeler/manufacturer, second = product/strength/dosage form, third = package size.",
    ],
    links: ["/allied-health/pharmacy-technician/lessons", "/allied-health/pharmacy-technician/practice-questions"],
  },
  {
    id: "patient-safety",
    title: "Patient Safety & Quality Assurance",
    icon: Shield,
    content: [
      "Medication safety is paramount in pharmacy practice. Pharmacy technicians play a critical role in preventing medication errors.",
      "Look-alike/sound-alike (LASA) drugs: Tall Man Lettering differentiates similar drug names (e.g., hydrOXYzine vs. hydrALAZINE, predniSONE vs. prednisoLONE, DOBUTamine vs. DOPamine). ISMP maintains the official list.",
      "Error prevention strategies: Use barcode verification, check drug against the original prescription (right patient, right drug, right dose, right route, right time), independent double-checks for high-alert medications.",
      "High-alert medications: Insulin, opioids, anticoagulants (heparin, warfarin), potassium chloride concentrate, neuromuscular blocking agents, chemotherapy agents. These require extra verification steps.",
      "Adverse Drug Reactions (ADRs): Report to FDA MedWatch. Severity ranges from mild (rash, GI upset) to severe (anaphylaxis, Stevens-Johnson syndrome). Black box warnings indicate the most serious risks.",
      "Medication Guides: Required for certain medications with serious risks. Must be dispensed with each fill. Examples: isotretinoin (iPLEDGE program), clozapine (REMS), opioid analgesics.",
    ],
    links: ["/allied-health/pharmacy-technician/lessons", "/allied-health/pharmacy-technician/flashcards"],
  },
  {
    id: "inventory",
    title: "Inventory Management & Operations",
    icon: BookOpen,
    content: [
      "Effective inventory management ensures drug availability while minimizing waste and controlling costs.",
      "Inventory methods: Perpetual inventory (continuous tracking), periodic inventory (point-in-time counts). Par levels determine minimum and maximum quantities to stock. Just-in-time (JIT) ordering minimizes on-hand inventory.",
      "Drug storage: Most drugs stored at controlled room temperature (20-25°C / 68-77°F). Refrigerated drugs: 2-8°C (36-46°F). Frozen drugs: -25 to -10°C (-13 to 14°F). Light-sensitive drugs stored in amber containers.",
      "Drug recalls: Initiated by manufacturer or FDA. Class I (most serious), Class II (moderate), Class III (least serious). Pharmacy must quarantine recalled products, notify patients if necessary, and document the recall process.",
      "Controlled substance inventory: Biennial (every 2 years) inventory of all controlled substances required by DEA. C-II inventory must be exact count. C-III through C-V can be estimated if container holds ≤1000 units.",
      "Formulary management: Pharmacy and Therapeutics (P&T) committee manages hospital formularies. Therapeutic substitution, generic substitution, and therapeutic interchange are key concepts.",
    ],
    links: ["/allied-health/pharmacy-technician/lessons"],
  },
  {
    id: "drug-interactions",
    title: "Drug Interactions & Contraindications",
    icon: AlertTriangle,
    content: [
      "Drug interactions can be pharmacokinetic (affecting absorption, distribution, metabolism, or excretion) or pharmacodynamic (affecting drug action at the receptor level).",
      "Common drug-drug interactions: Warfarin + NSAIDs (increased bleeding risk), MAOIs + tyramine-rich foods (hypertensive crisis), Methotrexate + NSAIDs (increased methotrexate toxicity), Digoxin + amiodarone (increased digoxin levels), Statins + gemfibrozil (increased rhabdomyolysis risk).",
      "CYP450 enzyme system: CYP3A4 metabolizes ~50% of drugs. Key inhibitors: grapefruit juice, ketoconazole, erythromycin, ritonavir. Key inducers: rifampin, carbamazepine, St. John's Wort, phenytoin.",
      "Drug-food interactions: Tetracyclines + dairy (decreased absorption), Warfarin + vitamin K-rich foods (decreased anticoagulant effect), MAOIs + tyramine (hypertensive crisis), Grapefruit + statins/CCBs (increased drug levels).",
      "Contraindications: Metformin in renal impairment (lactic acidosis risk), ACE inhibitors in pregnancy (teratogenic), Fluoroquinolones in children (tendon damage risk), Methotrexate in pregnancy (teratogenic), Thalidomide in pregnancy (phocomelia risk).",
    ],
    links: ["/allied-health/pharmacy-technician/lessons", "/allied-health/pharmacy-technician/practice-questions"],
  },
];

export default function PharmtechStudyGuidePage() {
  const { t } = useI18n();
  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechStudyGuide.pharmacyTechnicianStudyGuideComplete")}
        description={t("allied.pharmtechStudyGuide.comprehensivePharmacyTechnicianStudyGuide")}
        keywords="pharmacy technician study guide, PTCB study guide, ExCPT study guide, pharmacy tech review, pharmacy technician exam topics"
        canonicalPath="/allied-health/pharmacy-technician/study-guide"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Allied", item: "https://www.nursenest.ca/allied-health" },
            { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
            { "@type": "ListItem", position: 3, name: "Study Guide", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/study-guide" },
          ],
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-study-guide">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600">{t("allied.pharmtechStudyGuide.pharmacyTechnician")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-green-700 font-medium">{t("allied.pharmtechStudyGuide.studyGuide")}</span>
        </div>

        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-study-guide-title">{t("allied.pharmtechStudyGuide.pharmacyTechnicianStudyGuide")}</h1>
          <p className="text-gray-600 leading-relaxed">{t("allied.pharmtechStudyGuide.completeReviewOfAllPtcb")}</p>
        </div>

        <nav className="bg-green-50 rounded-2xl p-6 border border-green-100 mb-10">
          <h2 className="font-semibold text-green-800 mb-3">{t("allied.pharmtechStudyGuide.tableOfContents")}</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {SECTIONS.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-sm text-green-700 hover:text-green-900 hover:underline flex items-center gap-2" data-testid={`toc-${section.id}`}>
                  <span className="w-5 h-5 rounded bg-green-200 text-green-800 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {SECTIONS.map((section, sIndex) => (
            <section key={section.id} id={section.id} className="scroll-mt-20" data-testid={`section-${section.id}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
                  <section.icon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{sIndex + 1}. {section.title}</h2>
              </div>

              <div className="space-y-4 mb-6">
                {section.content.map((para, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed text-sm">{para}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {section.links.map(link => (
                  <Link key={link} href={link} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-100 hover:bg-green-100 transition-colors">
                    {link.includes("lessons") ? <BookOpen className="w-3 h-3" /> : link.includes("flashcards") ? <Brain className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                    {link.includes("lessons") ? "Related Lessons" : link.includes("flashcards") ? "Flashcard Decks" : "Practice Questions"}
                  </Link>
                ))}
              </div>

              {sIndex < SECTIONS.length - 1 && <hr className="mt-10 border-gray-100" />}
            </section>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mt-12 border border-green-200 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("allied.pharmtechStudyGuide.readyToTestYourKnowledge")}</h2>
          <p className="text-gray-600 text-sm mb-6">{t("allied.pharmtechStudyGuide.takeAPracticeExamOr")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/allied-health/pharmacy-technician/exams" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700" data-testid="button-take-exam">
              <FileText className="w-4 h-4" /> Take Practice Exam
            </Link>
            <Link href="/allied-health/pharmacy-technician/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50" data-testid="button-practice-from-guide">
              <Target className="w-4 h-4" /> Practice Questions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
