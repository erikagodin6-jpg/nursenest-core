import { useI18n } from "@/lib/i18n";
import {
  MicroLesson,
  CognitiveCard,
  HoverReveal,
  MatchingExercise,
  SelfCheckQuiz,
  ProgressiveReveal,
} from "@/components/interactive-learning";
import { EditableModuleText, useEditableText } from "@/components/module-edit-context";
import { Building, Users, Shield, Network, HeartPulse } from "lucide-react";

export function HealthcareStructureModule() {
  const { t } = useI18n();
  const scopeOfPracticeContent = useEditableText("hcs-scope-practice-content", "Scope of practice defines the legal boundaries of what each healthcare professional is authorized to do based on their education, certification, and licensure. Working outside your scope is a legal and ethical violation. RNs can assess, plan, implement, and evaluate care, administer medications, and delegate to LPNs/CNAs. LPNs/LVNs provide direct care under RN or physician supervision, administer certain medications, and perform focused assessments. CNAs/PCAs perform basic care tasks (bathing, feeding, vital signs, ambulation) under nurse supervision. NPs have advanced practice authority including diagnosis, prescribing, and autonomous practice (varies by state/province). PAs practice medicine under physician collaboration. The key principle: always practice within YOUR scope and delegate appropriately within THEIR scope.");
  const deliveryModelsContent = useEditableText("hcs-delivery-models-content", "Healthcare delivery models determine how care is organized, financed, and delivered. Fee-for-service: providers are paid for each service rendered — can incentivize volume over quality. Managed care (HMOs, PPOs): organizations manage cost and quality by requiring referrals, using networks, and implementing utilization review. Accountable Care Organizations (ACOs): groups of providers jointly accountable for quality and cost of care for a patient population. Patient-Centered Medical Home (PCMH): coordinated primary care model with a team approach, emphasizing prevention and chronic disease management. Value-based care: reimbursement tied to patient outcomes rather than volume of services — the direction healthcare is moving globally.");
  const patientRightsContent = useEditableText("hcs-patient-rights-content", "Patient rights are legally protected and include: the right to informed consent (understanding risks, benefits, alternatives before treatment), the right to refuse treatment (even life-saving treatment for competent adults), the right to privacy and confidentiality (HIPAA in the US, PIPEDA in Canada), the right to access medical records, the right to be informed of diagnosis and treatment options, the right to participate in care decisions, the right to be treated with dignity and respect regardless of background, the right to file grievances without retaliation. Advance directives (living will, healthcare power of attorney) extend these rights to situations when patients cannot speak for themselves. Nurses are patient advocates — protecting these rights is a core nursing responsibility.");

  return (
    <div className="space-y-10" data-testid="module-healthcare-structure">
      <div>
        <EditableModuleText sectionKey="hcs-title" defaultText="Healthcare System Structure & Organization" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="hcs-desc" defaultText="Understand how healthcare is organized, including levels of care, unit types, scope of practice for healthcare team members, interprofessional roles, healthcare delivery models, and patient rights." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Levels of Healthcare" subtitle="Primary through quaternary care" icon={<Building className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hcs-levels-intro" defaultText="Healthcare is organized into levels based on the complexity of care provided. Understanding these levels helps nurses appreciate where their role fits within the broader system and how patients move through the continuum of care." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_healthcare_structure.levelsOfCare")}
          cards={[
            {
              id: "hcs-primary",
              title: "Primary Care",
              summary: "First point of contact — prevention and routine management",
              detail: "Primary care is the foundation of the healthcare system. It includes health promotion, disease prevention, routine health maintenance, screening, immunizations, and management of common acute and chronic conditions. Provided by family physicians, nurse practitioners, pediatricians, and internists in clinics, community health centers, and physician offices. Most healthcare encounters occur at this level. Primary care reduces emergency department visits and hospitalizations through early intervention.",
            },
            {
              id: "hcs-secondary",
              title: "Secondary Care",
              summary: "Specialist consultation and acute hospital care",
              detail: "Secondary care involves specialized medical services typically accessed through referral from primary care. Includes specialist consultations (cardiologist, endocrinologist, orthopedist), acute care hospitalization on medical-surgical units, emergency department services, and routine surgical procedures. Most general hospitals provide secondary-level care. Patients are referred when their conditions require expertise beyond primary care scope.",
            },
            {
              id: "hcs-tertiary",
              title: "Tertiary Care",
              summary: "Highly specialized and complex care",
              detail: "Tertiary care involves highly specialized treatment requiring advanced technology and expertise. Examples: cardiac surgery, neurosurgery, cancer treatment centers, burn units, neonatal intensive care, organ transplantation, and specialized rehabilitation. Provided at large medical centers and teaching hospitals. Patients are referred from secondary care when they need advanced interventions unavailable at community hospitals.",
            },
            {
              id: "hcs-quaternary",
              title: "Quaternary Care",
              summary: "Experimental, cutting-edge, and rare procedures",
              detail: "Quaternary care represents the most specialized level — experimental treatments, clinical trials, highly unusual and complex surgical procedures, and rare disease management. Only available at select academic medical centers or specialized institutions. Examples: gene therapy, experimental cancer protocols, complex multi-organ transplants, and specialized pediatric conditions requiring one-of-a-kind expertise.",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Hospital Units & Care Settings" subtitle="ICU, med-surg, step-down, and beyond" icon={<HeartPulse className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hcs-units-intro" defaultText="Different hospital units serve patients with varying acuity levels. Understanding unit types helps nurses prepare for the type of patients they will encounter, the nurse-to-patient ratios, the monitoring capabilities, and the pace of care delivery in each setting." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Intensive Care Unit (ICU/CCU)</p>
            <p className="text-xs text-red-600">Highest acuity patients requiring continuous monitoring and life-sustaining interventions. Nurse-to-patient ratio typically 1:1 or 1:2. Features: continuous cardiac monitoring, mechanical ventilation, vasoactive drips, invasive hemodynamic monitoring (arterial lines, central venous catheters). Types include: Medical ICU, Surgical ICU, Cardiac Care Unit (CCU), Neuro ICU, Pediatric ICU (PICU), Neonatal ICU (NICU). Patients are critically ill and unstable.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Step-Down/Progressive Care Unit (PCU)</p>
            <p className="text-xs text-amber-600">Intermediate level between ICU and med-surg. Patients are stable enough to leave ICU but still need closer monitoring than a general floor. Nurse-to-patient ratio typically 1:3 or 1:4. Features: continuous telemetry monitoring, may have non-invasive ventilation (BiPAP/CPAP). Patients may be weaning from ICU-level interventions or at risk for decompensation requiring close observation.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Medical-Surgical (Med-Surg) Unit</p>
            <p className="text-xs text-blue-600">The most common inpatient unit. Cares for patients with a wide range of medical and post-surgical conditions. Nurse-to-patient ratio typically 1:4 to 1:6. Patients are generally stable but require nursing care including medication administration, wound care, education, and discharge planning. This is where most new graduate nurses begin their careers.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Other Settings</p>
            <p className="text-xs text-green-600">Emergency Department (ED): acute, undifferentiated patients requiring triage and stabilization. Operating Room (OR): surgical procedures with specialized perioperative nursing. Post-Anesthesia Care Unit (PACU): immediate post-surgical recovery. Labor & Delivery (L&D): obstetric care. Rehabilitation: recovery of function after illness/injury. Long-term care (LTC): chronic care for those unable to live independently. Home health: nursing care delivered in the patient's home. Community/public health: population-focused care.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Scope of Practice & Interprofessional Team" subtitle="Who does what — and why it matters" icon={<Users className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hcs-team-intro" defaultText="Modern healthcare is delivered by interprofessional teams. Each member brings unique expertise, and effective collaboration improves patient outcomes. Understanding roles prevents scope-of-practice violations and optimizes delegation. The nurse is often the coordinator of the care team at the bedside." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Nursing Roles</p>
            <p className="text-xs text-indigo-600"><strong>RN:</strong> Full assessment, care planning, medication administration, IV therapy, patient education, delegation, and evaluation. <strong>LPN/LVN:</strong> Focused assessment, stable patient care, medication administration (varies by jurisdiction), data collection. Works under RN/provider supervision. <strong>CNA/PCA:</strong> Basic care — vital signs, hygiene, ambulation, feeding, I&O recording. Cannot assess, plan, or administer medications. <strong>NP:</strong> Advanced practice — diagnoses, prescribes, orders tests, manages care independently or collaboratively.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Allied Health Team Members</p>
            <p className="text-xs text-teal-600"><strong>Physical Therapist (PT):</strong> Mobility, strength, gait training, rehabilitation. <strong>Occupational Therapist (OT):</strong> Activities of daily living (ADLs), fine motor skills, adaptive equipment. <strong>Respiratory Therapist (RT):</strong> Airway management, ventilator settings, breathing treatments, ABG collection. <strong>Registered Dietitian (RD):</strong> Nutritional assessment, therapeutic diets, tube feeding. <strong>Social Worker:</strong> Discharge planning, community resources, psychosocial support, insurance navigation. <strong>Pharmacist:</strong> Medication safety, interactions, dosing, patient education.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_healthcare_structure.scopeOfPracticeKnowYour")}
          content={scopeOfPracticeContent}
        />
      </MicroLesson>

      <MicroLesson title="Healthcare Delivery Models & Patient Rights" subtitle="How care is organized and what patients are entitled to" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="hcs-delivery-intro" defaultText="Healthcare delivery models shape how care is financed, accessed, and coordinated. Understanding these models helps nurses navigate the system and advocate for patients. Equally important, patient rights form the ethical and legal foundation of all nursing care — nurses serve as the primary advocates for these rights." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Chain of Command</p>
            <p className="text-xs text-purple-600">The chain of command provides a structured process for escalating patient safety concerns. If a nurse identifies a safety issue: first notify the charge nurse, then the nursing supervisor, then the nurse manager, then the medical director/chief nursing officer. The chain exists to protect patients — nurses have an ethical and legal obligation to escalate concerns even when met with resistance. Document all communication and responses.</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-700 mb-1">Advance Directives</p>
            <p className="text-xs text-rose-600">Legal documents expressing a patient's healthcare wishes when they cannot communicate. Living will: specifies desired or refused treatments (e.g., mechanical ventilation, tube feeding, CPR). Healthcare power of attorney (proxy): designates a decision-maker. Do Not Resuscitate (DNR): specifies no CPR if cardiac/respiratory arrest occurs. POLST/MOLST: medical orders based on patient wishes for seriously ill patients. Nurses must verify and honor advance directives.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_healthcare_structure.healthcareDeliveryModels")}
          content={deliveryModelsContent}
        />
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_healthcare_structure.patientRightsACoreNursing")}
          content={patientRightsContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_healthcare_structure.matchTheHealthcareRole")}
        pairs={[
          { term: "RN", definition: "Full assessment, care planning, delegation, and medication administration", id: "rn" },
          { term: "LPN/LVN", definition: "Focused assessment and stable patient care under supervision", id: "lpn" },
          { term: "CNA/PCA", definition: "Basic care tasks — vital signs, hygiene, ambulation", id: "cna" },
          { term: "Respiratory Therapist", definition: "Airway management, ventilator settings, breathing treatments", id: "rt" },
          { term: "Social Worker", definition: "Discharge planning, community resources, psychosocial support", id: "sw" },
          { term: "Physical Therapist", definition: "Mobility, strength, gait training, and rehabilitation", id: "pt" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_healthcare_structure.healthcareStructureQuiz")}
        questions={[
          {
            id: "hcs1",
            question: "A patient with a complex brain tumor requiring specialized surgery would be treated at which level of care?",
            options: ["Primary care", "Secondary care", "Tertiary care", "Home health care"],
            correctIndex: 2,
            rationale: "Tertiary care involves highly specialized treatment requiring advanced technology and expertise, such as neurosurgery, cancer treatment centers, and organ transplantation. Complex brain surgery requires a specialized medical center.",
          },
          {
            id: "hcs2",
            question: "The nurse-to-patient ratio in the ICU is typically:",
            options: ["1:1 or 1:2", "1:4 to 1:6", "1:8 to 1:10", "1:12 to 1:15"],
            correctIndex: 0,
            rationale: "ICU patients are critically ill and require continuous monitoring and frequent interventions. The typical nurse-to-patient ratio is 1:1 for the most unstable patients or 1:2 for slightly more stable ICU patients.",
          },
          {
            id: "hcs3",
            question: "Which healthcare team member is responsible for assessing nutritional needs and planning therapeutic diets?",
            options: ["Physical therapist", "Respiratory therapist", "Registered dietitian", "Social worker"],
            correctIndex: 2,
            rationale: "Registered dietitians (RDs) are the experts in nutritional assessment, therapeutic diet planning, enteral/parenteral nutrition management, and nutrition education for patients with specific dietary needs.",
          },
          {
            id: "hcs4",
            question: "A CNA reports that a patient's blood pressure is 80/50 mmHg. The RN should:",
            options: ["Document the finding and continue with other tasks", "Delegate reassessment to another CNA", "Assess the patient immediately", "Wait until the next scheduled vital signs"],
            correctIndex: 2,
            rationale: "The CNA can measure vital signs but cannot assess or interpret findings. A blood pressure of 80/50 is critically low and requires immediate RN assessment. Assessment cannot be delegated — it is within the RN's scope only.",
          },
          {
            id: "hcs5",
            question: "Which care setting is where most new graduate nurses begin their careers?",
            options: ["ICU", "Operating room", "Medical-surgical unit", "Neonatal ICU"],
            correctIndex: 2,
            rationale: "Medical-surgical (med-surg) units are the most common inpatient setting and expose new nurses to a wide variety of conditions and skills. This foundational experience builds the clinical judgment needed for specialized areas.",
          },
          {
            id: "hcs6",
            question: "A patient who is competent refuses a blood transfusion due to religious beliefs. The nurse should:",
            options: ["Administer the transfusion anyway — it is medically necessary", "Respect the patient's right to refuse treatment", "Call security to restrain the patient", "Discharge the patient for noncompliance"],
            correctIndex: 1,
            rationale: "Competent adult patients have the legal right to refuse any treatment, including life-saving interventions. The nurse must respect this right, ensure the patient understands the consequences, document the refusal, and advocate for the patient's autonomy.",
          },
          {
            id: "hcs7",
            question: "The step-down/progressive care unit serves patients who:",
            options: ["Are ready for discharge", "Need less monitoring than ICU but more than med-surg", "Require routine surgical procedures", "Are receiving primary care only"],
            correctIndex: 1,
            rationale: "Step-down (progressive care) units bridge the gap between ICU and med-surg. Patients are stable enough to leave ICU but still require closer monitoring (such as continuous telemetry) than a general medical-surgical floor can provide.",
          },
          {
            id: "hcs8",
            question: "Which delegation is INAPPROPRIATE?",
            options: ["RN delegates vital signs to a CNA", "RN delegates ambulation to a CNA", "RN delegates initial patient assessment to an LPN", "RN delegates bathing to a CNA"],
            correctIndex: 2,
            rationale: "Initial comprehensive assessment is within the RN's scope only and cannot be delegated to an LPN or CNA. LPNs can perform focused assessments on stable patients, but the initial assessment and care planning must be done by the RN.",
          },
          {
            id: "hcs9",
            question: "A healthcare power of attorney becomes active when:",
            options: ["The document is signed", "The patient is admitted to the hospital", "The patient cannot make their own decisions", "The patient turns 65"],
            correctIndex: 2,
            rationale: "A healthcare power of attorney (proxy) designates a person to make medical decisions on behalf of the patient. It becomes active only when the patient is determined to be unable to make their own decisions (incapacitated).",
          },
          {
            id: "hcs10",
            question: "Primary care focuses on:",
            options: ["Complex surgical procedures", "Health promotion, prevention, and routine care management", "Experimental treatments and clinical trials", "Critical care and life support"],
            correctIndex: 1,
            rationale: "Primary care is the first point of contact and foundation of the healthcare system. It emphasizes health promotion, disease prevention, screening, immunizations, and management of common acute and chronic conditions.",
          },
          {
            id: "hcs11",
            question: "The chain of command should be used when:",
            options: ["A nurse wants to request time off", "A patient safety concern is not being addressed", "A nurse disagrees with a coworker's personality", "Scheduling conflicts arise"],
            correctIndex: 1,
            rationale: "The chain of command exists to escalate patient safety concerns through the organizational hierarchy. Nurses have an ethical and legal obligation to use it when they identify a safety issue that is not being adequately addressed.",
          },
          {
            id: "hcs12",
            question: "Which healthcare delivery model ties reimbursement to patient outcomes rather than volume of services?",
            options: ["Fee-for-service", "Value-based care", "Indemnity insurance", "Cash-pay model"],
            correctIndex: 1,
            rationale: "Value-based care reimburses providers based on the quality of patient outcomes rather than the quantity of services provided. This model incentivizes prevention, efficient care, and better health outcomes.",
          },
          {
            id: "hcs13",
            question: "The occupational therapist (OT) primarily helps patients with:",
            options: ["Mobility and gait training", "Activities of daily living and fine motor skills", "Breathing treatments and airway management", "Medication management and dosing"],
            correctIndex: 1,
            rationale: "Occupational therapists help patients regain independence in activities of daily living (ADLs) such as dressing, eating, grooming, and using adaptive equipment. They focus on fine motor skills and functional independence in everyday tasks.",
          },
          {
            id: "hcs14",
            question: "HIPAA (or PIPEDA in Canada) protects the patient's right to:",
            options: ["Free healthcare", "Privacy and confidentiality of health information", "Choose their own surgeon", "Unlimited hospital stays"],
            correctIndex: 1,
            rationale: "HIPAA (Health Insurance Portability and Accountability Act) in the US and PIPEDA (Personal Information Protection and Electronic Documents Act) in Canada protect patient health information privacy and confidentiality. Violations can result in legal penalties.",
          },
          {
            id: "hcs15",
            question: "A DNR (Do Not Resuscitate) order means:",
            options: ["No treatment of any kind should be given", "CPR should not be performed if cardiac/respiratory arrest occurs", "The patient is being discharged to hospice", "All medications should be discontinued"],
            correctIndex: 1,
            rationale: "A DNR specifically means that cardiopulmonary resuscitation (CPR) should not be performed if the patient experiences cardiac or respiratory arrest. It does NOT mean withholding all other treatments — the patient still receives all other appropriate medical care.",
          },
          {
            id: "hcs16",
            question: "Which professional can diagnose conditions and prescribe medications?",
            options: ["RN", "LPN", "CNA", "Nurse Practitioner (NP)"],
            correctIndex: 3,
            rationale: "Nurse Practitioners (NPs) have advanced practice authority that includes diagnosing conditions, ordering diagnostic tests, prescribing medications, and managing patient care. The degree of independence varies by state/province but NPs have prescriptive authority.",
          },
          {
            id: "hcs17",
            question: "A managed care organization (HMO) typically requires:",
            options: ["No insurance coverage", "Referrals to see specialists and use of network providers", "Payment only at the time of service", "Direct access to any specialist without restrictions"],
            correctIndex: 1,
            rationale: "Health Maintenance Organizations (HMOs) manage costs by requiring patients to use network providers and obtain referrals from a primary care physician before seeing specialists. This gatekeeping approach aims to control utilization and costs.",
          },
          {
            id: "hcs18",
            question: "The respiratory therapist's role includes all of the following EXCEPT:",
            options: ["Ventilator management", "Breathing treatments administration", "Wound care and dressing changes", "ABG collection and analysis"],
            correctIndex: 2,
            rationale: "Wound care is within the nursing scope, not the respiratory therapist's role. Respiratory therapists manage airways, ventilators, administer breathing treatments (nebulizers, inhalers), collect and analyze ABGs, and provide respiratory assessments.",
          },
          {
            id: "hcs19",
            question: "Informed consent requires that the patient understands:",
            options: ["Only the name of the procedure", "Risks, benefits, alternatives, and the right to refuse", "Only the cost of the procedure", "Only the recovery time"],
            correctIndex: 1,
            rationale: "Informed consent requires that the patient receives and understands information about the procedure's nature, risks, benefits, alternatives, and the right to refuse. The healthcare provider explains; the nurse witnesses the signature and ensures the patient's questions are answered.",
          },
          {
            id: "hcs20",
            question: "A nurse has concerns about a physician's order that seems unsafe. After notifying the charge nurse with no resolution, the NEXT step is to:",
            options: ["Carry out the order as written", "Refuse to provide any further care", "Escalate to the nursing supervisor (continue up the chain of command)", "Post about it on social media"],
            correctIndex: 2,
            rationale: "When a safety concern is unresolved at one level, the nurse must continue up the chain of command: charge nurse → nursing supervisor → nurse manager → chief nursing officer. Patient safety is the priority, and nurses are legally and ethically obligated to advocate.",
          },
        ]}
      />
    </div>
  );
}