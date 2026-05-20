import type { ExamQuestion } from "./types";

export const npExamBatch08Questions: ExamQuestion[] = [
  {
    q: "A 35-year-old female presents with fatigue and pallor. CBC shows hemoglobin 9.2 g/dL, MCV 68 fL, ferritin 8 ng/mL, and iron saturation 10%. She has heavy menstrual periods. What is the most appropriate management?",
    o: ["Oral ferrous sulfate 325 mg daily on empty stomach with vitamin C; evaluate for menorrhagia cause", "Refer for bone marrow biopsy", "Start erythropoietin injections", "Prescribe vitamin B12 injections"],
    a: 0,
    r: "Microcytic anemia with low ferritin and low iron saturation confirms iron deficiency anemia. In a premenopausal female, menorrhagia is the most common cause. Treatment is oral iron supplementation (ferrous sulfate with vitamin C to enhance absorption) and evaluation of the underlying menorrhagia. Bone marrow biopsy is unnecessary when the diagnosis is clear. EPO is for renal-associated anemia. B12 deficiency causes macrocytic anemia.",
    s: "Hematology"
  },
  {
    q: "A 62-year-old male on warfarin for atrial fibrillation presents with INR of 6.2 and no active bleeding. He takes his warfarin as prescribed. What is the appropriate management?",
    o: ["Hold warfarin, administer oral vitamin K 2.5-5 mg, and recheck INR in 24 hours", "Administer IV vitamin K 10 mg and fresh frozen plasma", "Continue warfarin at current dose and recheck INR in 1 week", "Switch to aspirin permanently"],
    a: 0,
    r: "Supratherapeutic INR (greater than 4.5-10) without bleeding warrants holding warfarin and administering low-dose oral vitamin K (2.5-5 mg) to gradually reduce INR. IV vitamin K and FFP are reserved for major bleeding or INR greater than 10 with bleeding. Continuing warfarin at the current dose is dangerous. Switching to aspirin abandons the indication for anticoagulation.",
    s: "Hematology"
  },
  {
    q: "A 28-year-old female at 8 weeks gestation has a hemoglobin of 10.8 g/dL with MCV of 72 fL. Ferritin is 12 ng/mL. She has no bleeding. What is the recommended treatment?",
    o: ["Oral iron supplementation (ferrous sulfate 27-65 mg elemental iron daily) with follow-up CBC in 4 weeks", "IV iron infusion immediately", "Blood transfusion", "No treatment needed as anemia is normal in pregnancy"],
    a: 0,
    r: "Iron deficiency anemia in pregnancy (low MCV, low ferritin) is treated with oral iron supplementation as first-line. The recommended elemental iron dose is 27-65 mg daily. Response is monitored with CBC at 4 weeks. IV iron is reserved for oral intolerance or non-response. Transfusion is for severe symptomatic anemia. While physiologic anemia occurs in pregnancy (hemodilution), this patient has true iron deficiency requiring treatment.",
    s: "Hematology"
  },
  {
    q: "A nurse practitioner in a state with full practice authority receives a call from a patient's employer requesting information about the patient's diagnosis and treatment plan. The employer states the patient gave verbal consent. What is the NP's appropriate response?",
    o: ["Decline to release information and inform the employer that a signed written HIPAA authorization is required from the patient", "Provide the information since verbal consent was given", "Confirm only the diagnosis but not treatment details", "Request the employer to submit a subpoena"],
    a: 0,
    r: "HIPAA requires written authorization from the patient before releasing protected health information to a third party, including employers. Verbal consent is insufficient. The NP should decline the request and instruct the employer to obtain a signed HIPAA-compliant authorization from the patient. Partial disclosure (diagnosis only) still violates HIPAA without proper authorization.",
    s: "Professional Practice"
  },
  {
    q: "An NP discovers that a colleague has been prescribing controlled substances to a family member without proper documentation or an established patient relationship. What is the NP's ethical and legal obligation?",
    o: ["Report the concern to the practice supervisor or compliance officer and to the state licensing board as required by mandatory reporting obligations", "Confront the colleague privately and give them an opportunity to self-correct", "Ignore the situation as it does not directly involve the NP's patients", "Discuss the situation with other colleagues to gather opinions"],
    a: 0,
    r: "Prescribing controlled substances without proper documentation, outside an established provider-patient relationship, and to family members violates prescriptive authority regulations and DEA requirements. NPs have ethical and legal obligations to report such behavior through proper channels -- practice leadership, compliance, and the state licensing board. Failure to report can constitute complicity. Private confrontation alone is insufficient for a violation of this magnitude.",
    s: "Professional Practice"
  },
  {
    q: "A 16-year-old presents requesting STI testing and treatment without parental involvement. The state allows minor consent for STI services. The teen's parent calls requesting test results. What should the NP do?",
    o: ["Decline to provide results to the parent, citing the minor consent statute that protects confidentiality for STI-related services", "Provide the results since the parent is the legal guardian", "Ask the teen for permission before releasing results", "Release only negative results but withhold positive findings"],
    a: 0,
    r: "Most states have minor consent laws allowing adolescents to consent for STI testing and treatment without parental involvement, which includes confidentiality protections. The NP must uphold these protections regardless of parental request. Guardian status does not override minor consent statutes for STI services. Selectively releasing results violates the confidentiality principle.",
    s: "Professional Practice"
  },
  {
    q: "An NP working in a collaborative practice model receives a patient with a complex cardiac condition that exceeds the NP's current knowledge and experience. The collaborating physician is unavailable for consultation for the next 48 hours. What is the most appropriate action?",
    o: ["Refer the patient to a cardiologist or emergency department based on acuity and document the referral rationale", "Attempt to manage the condition independently using online resources", "Prescribe conservative treatment and schedule follow-up in 1 week", "Have the patient wait until the collaborating physician returns"],
    a: 0,
    r: "The NP scope of practice requires practicing within one's competence level. When a condition exceeds the NP's expertise and collaboration is unavailable, the standard of care requires appropriate referral. Attempting to manage beyond competence or delaying care puts the patient at risk and exposes the NP to liability. Documentation of the clinical reasoning for referral is essential.",
    s: "Professional Practice"
  },
  {
    q: "An NP is asked to provide a letter of medical necessity for a patient requesting disability benefits. The patient's clinical findings do not support the level of disability claimed. What is the NP's appropriate action?",
    o: ["Document the clinical findings objectively and provide an honest assessment that accurately reflects the patient's functional limitations", "Write the letter as requested to maintain the patient-provider relationship", "Refuse to provide any documentation", "Refer the patient to another provider to write the letter"],
    a: 0,
    r: "NPs have an ethical obligation to provide honest, accurate documentation regardless of patient requests. Falsifying medical records or disability claims constitutes fraud and can result in criminal charges, license revocation, and civil liability. The NP should document objective findings accurately and explain to the patient that the documentation must reflect clinical reality. Refusing all documentation is inappropriate; the patient deserves honest assessment.",
    s: "Professional Practice"
  }
];
