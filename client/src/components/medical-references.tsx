import { BookOpen, ExternalLink } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface Reference {
  source: string;
  title: string;
  url?: string;
  year?: string;
}

const COMMON_REFERENCES: Reference[] = [
  {
    source: "World Health Organization (WHO)",
    title: "International Classification of Diseases and Clinical Guidelines",
    url: "https://www.who.int",
  },
  {
    source: "Centers for Disease Control and Prevention (CDC)",
    title: "Clinical Practice Guidelines and Disease Prevention",
    url: "https://www.cdc.gov",
  },
  {
    source: "National Institutes of Health (NIH)",
    title: "National Library of Medicine Clinical Resources",
    url: "https://www.nih.gov",
  },
  {
    source: "Registered Nurses' Association of Ontario (RNAO)",
    title: "Best Practice Guidelines for Clinical Nursing",
    url: "https://rnao.ca/bpg",
  },
];

const TOPIC_REFERENCES: Record<string, Reference[]> = {
  cardiovascular: [
    { source: "American Heart Association (AHA)", title: "Guidelines for Cardiovascular Disease Prevention and Management", url: "https://www.heart.org", year: "2024" },
    { source: "Heart & Stroke Foundation of Canada", title: "Clinical Practice Guidelines for Heart Disease", url: "https://www.heartandstroke.ca" },
  ],
  respiratory: [
    { source: "American Thoracic Society (ATS)", title: "Clinical Practice Guidelines for Respiratory Care", url: "https://www.thoracic.org" },
    { source: "Canadian Thoracic Society", title: "Respiratory Disease Management Guidelines", url: "https://cts-sct.ca" },
  ],
  pharmacology: [
    { source: "Health Canada Drug Product Database", title: "Approved Drug Information and Safety Alerts", url: "https://www.canada.ca/en/health-canada.html" },
    { source: "Institute for Safe Medication Practices (ISMP)", title: "Medication Safety Resources and High-Alert Medications", url: "https://www.ismp.org" },
  ],
  neurological: [
    { source: "American Academy of Neurology (AAN)", title: "Clinical Practice Guidelines for Neurological Disorders", url: "https://www.aan.com" },
  ],
  pediatrics: [
    { source: "Canadian Paediatric Society (CPS)", title: "Position Statements and Practice Guidelines", url: "https://cps.ca" },
    { source: "American Academy of Pediatrics (AAP)", title: "Clinical Practice Guidelines for Pediatric Care", url: "https://www.aap.org" },
  ],
  maternity: [
    { source: "Society of Obstetricians and Gynaecologists of Canada (SOGC)", title: "Clinical Practice Guidelines for Maternal-Fetal Medicine", url: "https://www.sogc.org" },
  ],
  "mental-health": [
    { source: "American Psychiatric Association (APA)", title: "Practice Guidelines for Mental Health Disorders", url: "https://www.psychiatry.org" },
    { source: "Mental Health Commission of Canada", title: "Standards and Guidelines for Mental Health Nursing", url: "https://mentalhealthcommission.ca" },
  ],
  oncology: [
    { source: "Canadian Cancer Society", title: "Clinical Practice Guidelines for Cancer Care", url: "https://cancer.ca" },
    { source: "Oncology Nursing Society (ONS)", title: "Evidence-Based Practice Resources", url: "https://www.ons.org" },
  ],
  "infection-control": [
    { source: "Public Health Agency of Canada (PHAC)", title: "Infection Prevention and Control Guidelines", url: "https://www.canada.ca/en/public-health.html" },
    { source: "Association for Professionals in Infection Control (APIC)", title: "Infection Prevention Resources", url: "https://apic.org" },
  ],
  endocrine: [
    { source: "Canadian Diabetes Association (Diabetes Canada)", title: "Clinical Practice Guidelines for Diabetes Management", url: "https://www.diabetes.ca" },
    { source: "American Association of Clinical Endocrinology (AACE)", title: "Endocrine Practice Guidelines", url: "https://www.aace.com" },
  ],
  gastrointestinal: [
    { source: "Canadian Association of Gastroenterology (CAG)", title: "Clinical Practice Guidelines for GI Disorders", url: "https://www.cag-acg.org" },
  ],
  renal: [
    { source: "Kidney Foundation of Canada", title: "Clinical Practice Guidelines for Kidney Disease", url: "https://kidney.ca" },
  ],
  hematology: [
    { source: "Canadian Blood Services", title: "Clinical Guide to Transfusion", url: "https://www.blood.ca" },
  ],
  laboratory: [
    { source: "Clinical and Laboratory Standards Institute (CLSI)", title: "Laboratory Standards and Guidelines", url: "https://clsi.org" },
    { source: "American Association for Clinical Chemistry (AACC)", title: "Lab Test Reference Ranges and Interpretation", url: "https://www.aacc.org" },
    { source: "Canadian Society for Medical Laboratory Science (CSMLS)", title: "Medical Laboratory Practice Standards", url: "https://www.csmls.org" },
  ],
  medication: [
    { source: "Health Canada Drug Product Database", title: "Approved Drug Information and Safety Alerts", url: "https://www.canada.ca/en/health-canada.html" },
    { source: "Institute for Safe Medication Practices (ISMP)", title: "Medication Safety Resources and High-Alert Medications", url: "https://www.ismp.org" },
    { source: "United States Pharmacopeia (USP)", title: "Drug Standards and Compounding Guidelines", url: "https://www.usp.org" },
    { source: "CPhA Compendium of Pharmaceuticals and Specialties", title: "Canadian Drug Reference Standards", url: "https://www.pharmacists.ca" },
  ],
  "critical-care": [
    { source: "Society of Critical Care Medicine (SCCM)", title: "ICU Clinical Practice Guidelines", url: "https://www.sccm.org" },
    { source: "American Association of Critical-Care Nurses (AACN)", title: "Evidence-Based Practice Standards for Critical Care Nursing", url: "https://www.aacn.org" },
    { source: "Canadian Critical Care Society", title: "Critical Care Guidelines and Standards", url: "https://canadiancriticalcare.org" },
  ],
  "allied-health": [
    { source: "Canadian Interprofessional Health Collaborative (CIHC)", title: "National Interprofessional Competency Framework", url: "https://www.cihc-cpis.com" },
    { source: "Health Professions Regulatory Advisory Council (HPRAC)", title: "Scope of Practice and Regulatory Standards", url: "https://www.ontario.ca/page/health-professions-regulatory-advisory-council" },
    { source: "World Health Organization (WHO)", title: "Health Workforce and Interprofessional Education Guidelines", url: "https://www.who.int" },
  ],
  "respiratory-therapy": [
    { source: "Canadian Society of Respiratory Therapists (CSRT)", title: "Clinical Practice Guidelines for Respiratory Therapy", url: "https://www.csrt.com" },
    { source: "American Association for Respiratory Care (AARC)", title: "Evidence-Based Clinical Practice Guidelines", url: "https://www.aarc.org" },
  ],
  "emergency-medical": [
    { source: "Paramedic Association of Canada (PAC)", title: "National Occupational Competency Profile for Paramedics", url: "https://www.paramedic.ca" },
    { source: "National Association of Emergency Medical Technicians (NAEMT)", title: "Prehospital Care Standards and Guidelines", url: "https://www.naemt.org" },
  ],
  "occupational-therapy": [
    { source: "Canadian Association of Occupational Therapists (CAOT)", title: "Occupational Therapy Practice Guidelines", url: "https://www.caot.ca" },
    { source: "American Occupational Therapy Association (AOTA)", title: "Evidence-Based Practice Resources", url: "https://www.aota.org" },
  ],
  "physical-therapy": [
    { source: "Canadian Physiotherapy Association (CPA)", title: "Clinical Practice Guidelines for Physiotherapy", url: "https://physiotherapy.ca" },
    { source: "American Physical Therapy Association (APTA)", title: "Evidence-Based Practice Guidelines", url: "https://www.apta.org" },
  ],
  "social-work": [
    { source: "Canadian Association of Social Workers (CASW)", title: "Social Work Practice Standards and Guidelines", url: "https://www.casw-acts.ca" },
    { source: "National Association of Social Workers (NASW)", title: "Standards for Social Work Practice", url: "https://www.socialworkers.org" },
  ],
  encyclopedia: [
    { source: "MedlinePlus — National Library of Medicine", title: "Medical Encyclopedia and Health Information", url: "https://medlineplus.gov" },
    { source: "Merck Manual Professional Edition", title: "Clinical Reference for Healthcare Professionals", url: "https://www.merckmanuals.com/professional" },
  ],
  specialty: [
    { source: "Canadian Nurses Association (CNA)", title: "Nursing Specialty Certification Standards", url: "https://www.cna-aiic.ca" },
    { source: "American Nurses Credentialing Center (ANCC)", title: "Specialty Certification and Practice Standards", url: "https://www.nursingworld.org/ancc/" },
  ],
};

function getTopicReferences(lessonId: string): Reference[] {

  const id = lessonId.toLowerCase();
  for (const [topic, refs] of Object.entries(TOPIC_REFERENCES)) {
    if (id.includes(topic)) return refs;
  }
  if (id.includes("cardiac") || id.includes("heart") || id.includes("aortic") || id.includes("arrhythmia") || id.includes("dvt") || id.includes("hypertens"))
    return TOPIC_REFERENCES.cardiovascular || [];
  if (id.includes("lung") || id.includes("asthma") || id.includes("copd") || id.includes("pneumo") || id.includes("bronch"))
    return TOPIC_REFERENCES.respiratory || [];
  if (id.includes("drug") || id.includes("medic") || id.includes("pharma"))
    return TOPIC_REFERENCES.pharmacology || [];
  if (id.includes("neuro") || id.includes("stroke") || id.includes("seizure") || id.includes("brain"))
    return TOPIC_REFERENCES.neurological || [];
  if (id.includes("pedia") || id.includes("child") || id.includes("neonat") || id.includes("infant"))
    return TOPIC_REFERENCES.pediatrics || [];
  if (id.includes("matern") || id.includes("pregn") || id.includes("obstet") || id.includes("postpartum") || id.includes("labor"))
    return TOPIC_REFERENCES.maternity || [];
  if (id.includes("psych") || id.includes("mental") || id.includes("anxiety") || id.includes("depress"))
    return TOPIC_REFERENCES["mental-health"] || [];
  if (id.includes("cancer") || id.includes("tumor") || id.includes("chemo") || id.includes("oncol"))
    return TOPIC_REFERENCES.oncology || [];
  if (id.includes("infect") || id.includes("sepsis") || id.includes("sterili"))
    return TOPIC_REFERENCES["infection-control"] || [];
  if (id.includes("diabet") || id.includes("thyroid") || id.includes("adrenal") || id.includes("insulin"))
    return TOPIC_REFERENCES.endocrine || [];
  if (id.includes("liver") || id.includes("bowel") || id.includes("gastro") || id.includes("pancrea"))
    return TOPIC_REFERENCES.gastrointestinal || [];
  if (id.includes("kidney") || id.includes("renal") || id.includes("dialysis"))
    return TOPIC_REFERENCES.renal || [];
  if (id.includes("blood") || id.includes("anemia") || id.includes("transfus") || id.includes("hemato"))
    return TOPIC_REFERENCES.hematology || [];
  if (id.includes("lab") || id.includes("cbc") || id.includes("electrolyte") || id.includes("bmp") || id.includes("cmp"))
    return TOPIC_REFERENCES.laboratory || [];
  if (id.includes("icu") || id.includes("critical") || id.includes("ventilat") || id.includes("intubat"))
    return TOPIC_REFERENCES["critical-care"] || [];
  if (id.includes("rrt") || id.includes("respiratory-therap"))
    return TOPIC_REFERENCES["respiratory-therapy"] || [];
  if (id.includes("paramedic") || id.includes("emt") || id.includes("prehospital"))
    return TOPIC_REFERENCES["emergency-medical"] || [];
  if (id.includes("occupational-therap") || id.includes("-ot"))
    return TOPIC_REFERENCES["occupational-therapy"] || [];
  if (id.includes("physical-therap") || id.includes("physiother") || id.includes("-pt"))
    return TOPIC_REFERENCES["physical-therapy"] || [];
  if (id.includes("social-work") || id.includes("counsell") || id.includes("psychotherap") || id.includes("addiction"))
    return TOPIC_REFERENCES["social-work"] || [];
  return [];
}

function getPageTypeReferences(pageType?: string): Reference[] {
  if (!pageType) return [];
  const refs = TOPIC_REFERENCES[pageType];
  return refs || [];
}

interface MedicalReferencesProps {
  lessonId: string;
  pageType?: string;
  className?: string;
}

export function MedicalReferences({ lessonId, pageType, className = "" }: MedicalReferencesProps) {
  const { t } = useI18n();
  const topicRefs = getTopicReferences(lessonId);
  const pageTypeRefs = getPageTypeReferences(pageType);
  const seen = new Set<string>();
  const deduped: Reference[] = [];
  for (const ref of [...topicRefs, ...pageTypeRefs, ...COMMON_REFERENCES]) {
    if (!seen.has(ref.source)) {
      seen.add(ref.source);
      deduped.push(ref);
    }
  }
  const allRefs = deduped;

  return (
    <section className={`rounded-xl border border-gray-200 bg-gray-50/50 p-6 ${className}`} data-testid="section-medical-references">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{t("components.medicalReferences.referencesClinicalSources")}</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        This content is based on evidence from peer-reviewed clinical guidelines and recognized healthcare authorities.
      </p>
      <ol className="space-y-2 list-decimal list-inside">
        {allRefs.map((ref, i) => (
          <li key={i} className="text-sm text-gray-700 leading-relaxed">
            <span className="font-medium">{ref.source}</span>
            {ref.year && <span className="text-gray-400"> ({ref.year})</span>}
            . <span className="italic">{ref.title}</span>.
            {ref.url && (
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 ml-1 text-primary hover:underline"
                data-testid={`link-reference-${i}`}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </li>
        ))}
      </ol>
      <p className="text-xs text-gray-400 mt-4 border-t border-gray-200 pt-3">
        Content is for educational purposes and nursing exam preparation. Always refer to current institutional protocols and clinical guidelines in practice.
      </p>
    </section>
  );
}
