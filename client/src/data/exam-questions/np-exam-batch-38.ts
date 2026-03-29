import type { ExamQuestion } from "./types";

export const npExamBatch38Questions: ExamQuestion[] = [
  {
    q: "An NP is managing a diabetic patient who refuses to check blood glucose levels due to fear of needles. The NP has thoroughly explained the medical necessity of glucose monitoring. The patient is competent and understands the risks. What ethical principle is being exercised?",
    o: ["Patient autonomy; the NP must respect the competent patient's right to refuse even recommended medical interventions", "Beneficence; the NP must override the patient's decision for their own good", "Nonmaleficence; the NP should discontinue diabetes medications", "Justice; the NP should refer the patient to another provider"],
    a: 0,
    r: "Autonomy is the ethical principle that competent patients have the right to make informed decisions about their own care, including the right to refuse recommended treatments. The NP's role is to: 1) Ensure informed consent (the patient understands risks), 2) Explore alternatives (CGM instead of fingersticks), 3) Document the discussion and patient's decision, 4) Continue to provide care without coercion or abandonment. Beneficence (doing good) does not override autonomy in a competent patient. The NP should explore CGM technology as a needle-free alternative.",
    s: "Professional Practice"
  },
  {
    q: "An NP working in a rural health clinic is the sole provider for a community of 3,000 patients. A patient presents with a condition outside the NP's scope of knowledge. There is no specialist available within 150 miles. What should the NP do?",
    o: ["Provide initial stabilization, utilize telehealth/teleconsultation with specialists, and arrange transport if the condition requires in-person specialist care", "Refuse to treat the patient since it is outside scope", "Treat the patient based on best guess without consultation", "Refer the patient to the emergency department 150 miles away without any initial evaluation"],
    a: 0,
    r: "Rural NPs often encounter conditions that push the boundaries of their training. The appropriate response: 1) Provide initial assessment and stabilization within competence, 2) Utilize telehealth/teleconsultation resources (expanding rapidly in rural areas), 3) Engage in just-in-time learning using evidence-based resources, 4) Arrange appropriate referral or transport when needed, 5) Document clinical reasoning and consultation. The NP has an obligation not to abandon the patient while recognizing limitations. Telehealth has transformed rural healthcare access to specialist consultation.",
    s: "Professional Practice"
  },
  {
    q: "A 45-year-old average-risk patient asks when to start colorectal cancer screening. They have no family history of CRC and no personal history of inflammatory bowel disease or polyps. What does the USPSTF recommend?",
    o: ["Begin screening at age 45 with colonoscopy every 10 years, or annual FIT, or FIT-DNA (Cologuard) every 1-3 years", "Begin at age 50 with colonoscopy every 5 years", "No screening needed until age 55", "Annual CEA blood test beginning at age 40"],
    a: 0,
    r: "The USPSTF updated its recommendation in 2021 to begin average-risk CRC screening at age 45 (previously 50), reflecting increasing CRC incidence in younger adults. Options include: colonoscopy every 10 years, annual high-sensitivity FIT (fecal immunochemical test), FIT-DNA (Cologuard) every 1-3 years, CT colonography every 5 years, or flexible sigmoidoscopy every 5-10 years. All positive non-colonoscopy tests require follow-up colonoscopy. Screening continues through age 75 (shared decision-making 76-85).",
    s: "Preventive Medicine"
  },
  {
    q: "A 50-year-old postmenopausal female asks about osteoporosis screening. She has no risk factors other than age and postmenopausal status. BMI is 26. She does not smoke and has no family history of hip fracture. When should DEXA screening be performed?",
    o: ["Age 65 for average-risk postmenopausal women per USPSTF; consider earlier screening using FRAX tool if 10-year fracture risk is 9.3% or greater", "Age 50 at menopause onset", "Age 70 when osteoporosis is most common", "Only if she sustains a fragility fracture"],
    a: 0,
    r: "USPSTF recommends DEXA screening for all women 65 and older. For postmenopausal women younger than 65, screening is recommended if the FRAX 10-year major osteoporotic fracture risk equals or exceeds 9.3% (the threshold equivalent to a 65-year-old white woman). This patient at 50 without additional risk factors does not meet the threshold for early screening. Risk factors that would trigger earlier screening include: low BMI, smoking, excessive alcohol, glucocorticoid use, parent with hip fracture, or rheumatoid arthritis.",
    s: "Preventive Medicine"
  },
  {
    q: "A 60-year-old male with a 35-pack-year smoking history who quit smoking 5 years ago asks about lung cancer screening. His 10-year risk using a validated calculator is significant. What does the USPSTF recommend?",
    o: ["Annual low-dose CT chest for adults aged 50-80 with 20 or more pack-year smoking history who currently smoke or quit within the past 15 years", "Chest X-ray annually as adequate screening", "No screening indicated since he quit smoking", "Sputum cytology every 6 months"],
    a: 0,
    r: "USPSTF (2021) recommends annual LDCT for adults aged 50-80 with a 20+ pack-year history who currently smoke or quit within the past 15 years. This patient qualifies (35 pack-years, quit 5 years ago). The NLST trial demonstrated 20% lung cancer mortality reduction with LDCT vs. CXR. The NELSON trial confirmed this benefit. Screening should be discontinued when the individual has not smoked for 15 years or has a limited life expectancy. CXR is inadequate for lung cancer screening. Sputum cytology has poor sensitivity.",
    s: "Preventive Medicine"
  }
];
