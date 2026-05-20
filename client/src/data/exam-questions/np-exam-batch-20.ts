import type { ExamQuestion } from "./types";

export const npExamBatch20Questions: ExamQuestion[] = [
  {
    q: "An NP in a rural health clinic is the sole provider. A patient presents with a surgical emergency requiring immediate intervention beyond the NP's scope. The nearest hospital is 90 minutes away. What should the NP do?",
    o: ["Stabilize the patient within scope of practice, activate emergency medical services for transport, provide relevant clinical information for the receiving facility, and maintain care until transfer is complete", "Attempt the surgical procedure despite being outside scope", "Send the patient to drive themselves to the hospital", "Close the clinic and have the patient call 911 from home"],
    a: 0,
    r: "In an emergency, the NP's obligation is to stabilize the patient within their scope of practice, activate emergency transport, and maintain continuity of care until transfer. EMTALA principles apply -- stabilizing treatment must be provided regardless of scope limitations. Performing procedures outside scope creates liability. Having an unstable patient self-transport is unsafe. Abandoning the patient violates ethical and legal obligations.",
    s: "Professional Practice"
  },
  {
    q: "A 50-year-old male with a 10-year ASCVD risk of 8.5% asks about aspirin for primary prevention. He has no history of GI bleeding. What does the NP recommend based on current USPSTF guidelines?",
    o: ["Aspirin is not generally recommended for primary prevention in adults over 60; for ages 40-59 with 10% or greater ASCVD risk, it is an individualized decision with modest net benefit", "Start aspirin 81 mg daily for all adults over 50", "Prescribe aspirin 325 mg daily for cardiovascular protection", "Aspirin is recommended for all patients with any cardiovascular risk factors"],
    a: 0,
    r: "USPSTF (2022) recommends against initiating aspirin for primary CVD prevention in adults 60 and older (D recommendation). For adults 40-59 with 10% or greater 10-year ASCVD risk, the decision is individualized (C recommendation). At 8.5% risk, the net benefit is marginal. The risk of GI bleeding and hemorrhagic stroke must be weighed against potential cardiovascular benefit. Low-dose aspirin (81 mg) is used when indicated.",
    s: "Preventive Medicine"
  },
  {
    q: "A 25-year-old male asks about hepatitis B vaccination. He has no prior vaccination history and works as a phlebotomist. Hepatitis B surface antigen, surface antibody, and core antibody are all negative. What vaccination schedule is recommended?",
    o: ["Three-dose hepatitis B vaccine series (0, 1, and 6 months) or two-dose Heplisav-B series (0 and 1 month); check anti-HBs titer 1-2 months after completion", "Single dose of hepatitis B vaccine", "No vaccination needed since he has no markers of infection", "Hepatitis A vaccine instead"],
    a: 0,
    r: "Healthcare workers are at high risk for hepatitis B exposure and require vaccination. The standard schedule is 3 doses (0, 1, 6 months) or the 2-dose Heplisav-B schedule (0 and 1 month). Post-vaccination serologic testing (anti-HBs) is recommended for healthcare workers 1-2 months after completing the series to confirm immunity (anti-HBs 10 mIU/mL or greater). All-negative hepatitis B serologies confirm susceptibility and the need for vaccination.",
    s: "Preventive Medicine"
  },
  {
    q: "A 70-year-old female who has never received a pneumococcal vaccine asks about immunization. She has well-controlled hypertension and type 2 diabetes. What is the recommended pneumococcal vaccination schedule?",
    o: ["PCV20 (Prevnar 20) single dose, or PCV15 followed by PPSV23 at least 1 year later", "PPSV23 alone every 5 years", "PCV13 and PPSV23 simultaneously", "No pneumococcal vaccination until age 75"],
    a: 0,
    r: "ACIP recommends PCV20 (single dose) or PCV15 followed by PPSV23 (at least 1 year later) for adults 65 and older who have not previously received pneumococcal vaccination. PCV20 provides the broadest serotype coverage as a single dose. Diabetes and age 65+ are both indications for vaccination. PPSV23 alone does not provide the conjugate vaccine's T-cell-dependent immune response. Simultaneous administration of PCV and PPSV is not recommended.",
    s: "Preventive Medicine"
  },
  {
    q: "A 45-year-old female with a BMI of 28 asks about cervical cancer screening. Her last Pap smear was 3 years ago and was normal. HPV co-testing was negative. What is the recommended screening interval?",
    o: ["Next cervical cancer screening in 5 years (Pap + HPV co-testing every 5 years, or HPV primary testing every 5 years, is acceptable for ages 30-65)", "Annual Pap smear", "Repeat Pap smear in 3 years without HPV testing", "No further screening needed until age 65"],
    a: 0,
    r: "For women ages 30-65, USPSTF recommends cervical cancer screening with one of three strategies: cytology alone every 3 years, HPV testing alone every 5 years, or cytology plus HPV co-testing every 5 years. Since this patient had negative co-testing 3 years ago, she can wait until 5 years from the last co-test. Annual Pap smears are no longer recommended for average-risk women. Screening continues until age 65 with adequate prior negative results.",
    s: "Preventive Medicine"
  },
  {
    q: "A 60-year-old male asks about abdominal aortic aneurysm screening. He smoked for 25 years but quit 10 years ago. He has no symptoms. What does the NP recommend?",
    o: ["One-time abdominal ultrasound screening for AAA (USPSTF recommends for men 65-75 who have ever smoked)", "CT angiography annually", "No screening since he quit smoking", "Screening only if he develops symptoms"],
    a: 0,
    r: "USPSTF recommends one-time screening for AAA with abdominal ultrasound in men aged 65-75 who have ever smoked. This patient will qualify in 5 years. Smoking history (not current status) determines eligibility. CT angiography is not used for screening due to radiation exposure and cost. Waiting for symptoms (rupture presents with sudden death in 80% of cases) defeats the purpose of screening.",
    s: "Preventive Medicine"
  }
];
