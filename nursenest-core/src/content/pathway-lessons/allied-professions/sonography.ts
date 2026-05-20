function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const sonographySections = {
  physics: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Sonography depends on physics at the bedside. Frequency, wavelength, attenuation, reflection, refraction, resolution, gain, depth, focus, Doppler angle, and artifact recognition all affect whether an ultrasound image is diagnostic. Exams reward applied physics, not abstract formulas alone."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Higher-frequency transducers improve resolution but reduce penetration. Lower-frequency transducers improve penetration but reduce detail. Depth, gain, time-gain compensation, focus, dynamic range, and harmonics must be adjusted to the patient and target. Artifacts can help or mislead: shadowing can identify stones, enhancement can support fluid-filled structures, reverberation can mimic pathology, and mirror artifact can create false anatomy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A deep abdominal structure is poorly visualized with a high-frequency linear probe. The safer technical adjustment is not simply to increase gain until noise fills the image. The sonographer should select a lower-frequency curvilinear probe, adjust depth and focal zone, and optimize gain to improve penetration while preserving diagnostic quality."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Sonography exams often ask which knob or probe choice fixes a poor image. Common traps include confusing gain with penetration, using a high-frequency probe for deep structures, ignoring Doppler angle, and treating every artifact as an error rather than a diagnostic clue."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Image optimization is physics plus anatomy: pick the right probe, use the right frequency, set depth and focus, then adjust gain and Doppler settings deliberately."
    }
  ],
  abdominal: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Abdominal sonography connects organ anatomy, scanning windows, patient preparation, pathology pattern recognition, and communication with the interpreting provider. Gallbladder, liver, biliary tree, pancreas, spleen, kidneys, bladder, aorta, and free fluid are common exam anchors."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Abdominal ultrasound requires systematic sweeps in longitudinal and transverse planes. Gallstones often produce echogenic foci with posterior acoustic shadowing. Biliary obstruction may show ductal dilation. Hydronephrosis appears as dilation of the renal collecting system. Aortic aneurysm screening requires outer-wall-to-outer-wall measurement. Free fluid collects in dependent spaces and must be recognized quickly in acute settings."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with right upper quadrant pain has an echogenic mobile focus in the gallbladder with clean posterior shadowing. This pattern supports gallstone recognition. The sonographer should document representative images, assess gallbladder wall, pericholecystic fluid, sonographic Murphy sign per protocol, and biliary dilation rather than stopping after a single stone image."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Abdominal exam questions frequently test gallstones versus polyps, hydronephrosis versus renal cysts, aortic measurement technique, liver texture patterns, biliary dilation, and the need for systematic scanning rather than isolated still images."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Scan abdominal organs systematically, identify hallmark artifacts, and document pathology with measurements, planes, and adjacent findings."
    }
  ],
  obGyn: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "OB/GYN sonography requires safety, anatomy, dating, viability assessment, fetal and pelvic anatomy recognition, and careful communication. The sonographer gathers diagnostic images but should avoid unsupported reassurance or diagnosis outside role."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Early pregnancy assessment may include gestational sac location, yolk sac, embryo, cardiac activity by protocol, crown-rump length, adnexa, and free fluid. Later pregnancy scanning includes fetal lie, placenta location, amniotic fluid, biometry, anatomy survey, and maternal structures. GYN imaging evaluates uterus, endometrium, ovaries, adnexa, masses, cysts, torsion clues, fibroids, and pelvic fluid. ALARA and appropriate output settings remain essential."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with positive pregnancy test, pelvic pain, and no confirmed intrauterine pregnancy has adnexal tenderness and free fluid. The sonographer should treat this as potentially urgent, obtain protocol images, and escalate immediately to the interpreting provider because ectopic pregnancy must be considered."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "OB/GYN questions often test ectopic red flags, placenta location, fetal dating measurements, ovarian torsion clues, cyst patterns, uterine fibroids, and role-safe communication. A common trap is offering reassurance before the exam is interpreted."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "OB/GYN ultrasound combines systematic imaging, ALARA, urgent red-flag recognition, and careful communication within scope."
    }
  ],
  vascular: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Vascular sonography evaluates flow, obstruction, stenosis, thrombosis, reflux, and perfusion. Doppler technique is central: poor angle correction, wrong sample placement, or excessive probe pressure can create misleading findings."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Vascular exams integrate grayscale, color Doppler, spectral Doppler, compression, augmentation when appropriate, and waveform analysis. Venous thrombosis assessment commonly relies on compressibility, intraluminal echoes, color fill, and flow response. Arterial studies consider peak systolic velocity, waveform shape, turbulence, and velocity ratios. Doppler angle should generally be kept at or below 60 degrees for velocity measurements, according to lab protocol."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A femoral vein does not fully compress and contains echogenic material. The sonographer should document noncompressibility, grayscale findings, color Doppler flow, and extent according to protocol. Pressing harder until the vessel appears smaller risks false reassurance and patient discomfort."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Vascular exam traps include poor Doppler angle correction, mistaking low color gain for absent flow, applying too much pressure during venous compression, ignoring waveform changes, and failing to document proximal and distal extent of abnormal findings."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Vascular ultrasound is technique-sensitive. Compression, color, spectral Doppler, waveform shape, and angle correction must tell the same story."
    }
  ],
  smallParts: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Small-parts sonography includes thyroid, breast, scrotal, superficial soft tissue, lymph nodes, and procedural-support contexts. High-frequency imaging provides detail but requires careful depth, focal zone, compression, and documentation technique."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Small-parts exams assess lesion size, echogenicity, margins, vascularity, posterior features, relationship to surrounding structures, and tenderness or compressibility where relevant. Thyroid nodules require standardized measurements and feature documentation. Scrotal exams prioritize testicular perfusion in torsion concerns. Superficial collections may show complex fluid, debris, hyperemia, or surrounding cellulitis changes."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A young patient presents with acute testicular pain. The sonographer should prioritize bilateral grayscale and Doppler assessment of testicular perfusion and escalate concerning findings urgently. Delayed imaging or incomplete Doppler comparison can miss a time-sensitive torsion pattern."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Small-parts questions often test high-frequency probe choice, thyroid nodule measurement, torsion urgency, abscess versus cellulitis patterns, lymph node morphology, and documentation of posterior acoustic features."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Small-parts imaging needs high resolution, precise measurements, vascular assessment when relevant, and rapid escalation for torsion or urgent perfusion findings."
    }
  ],
  patientCare: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Sonographers perform patient-facing clinical care. Safe exams require identity checks, consent workflow, privacy, positioning, infection control, probe disinfection, pain-aware scanning, and communication that does not overstep interpretation boundaries."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Before scanning, verify two identifiers, exam indication, relevant history, pregnancy or procedure status where applicable, mobility limitations, isolation precautions, pain, and ability to tolerate positioning. Probe disinfection must match exam type and exposure risk. During scanning, explain what the patient can expect, preserve dignity, respond to deterioration, and escalate urgent findings through approved pathways."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient asks, 'Is my baby okay?' during an OB scan. The sonographer should respond with empathy but stay within role, explaining that images must be reviewed according to the facility's interpretation process. Giving unsupported reassurance or alarming conclusions can be unsafe and outside scope."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Patient-care questions often test privacy, role boundaries, probe cleaning, isolation precautions, chaperone or consent workflow, urgent escalation, and communication under emotional pressure."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Sonography is technical and relational. Protect privacy, clean probes correctly, scan safely, and communicate within scope."
    }
  ]
};

export const sonographyLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "sonography-physics-probes-artifacts-and-image-optimization",
    title: "Sonography Physics, Probes, Artifacts, and Image Optimization",
    topic: "Sonography Physics",
    topicSlug: "sonography-physics",
    system: "imaging",
    bodySystem: "sonography",
    previewSectionCount: 2,
    seoTitle: "Sonography Physics Probes Artifacts and Image Optimization",
    seoDescription: "Sonography lesson on frequency, penetration, resolution, gain, depth, focus, artifacts, transducer selection, and diagnostic image optimization.",
    alliedProfessionKey: "sonography",
    sections: sonographySections.physics,
    studyTakeaways: ["Higher frequency improves resolution but lowers penetration.", "Artifacts can help or mislead interpretation.", "Depth, gain, focus, and probe choice must match the target."],
    studyCommonTraps: ["Using gain to fix penetration", "Choosing high-frequency probes for deep targets", "Ignoring diagnostic artifacts"],
    preTest: [quiz("A deep abdominal target is poorly visualized with a high-frequency probe. What is the best technical change?", ["Switch to a lower-frequency curvilinear probe", "Only increase gain until noise fills the screen", "Ignore the target", "Use Doppler only"], 0, "Lower-frequency curvilinear probes improve penetration for deeper structures.")],
    postTest: [quiz("Posterior shadowing behind an echogenic gallstone is best understood as:", ["A useful artifact", "Always machine failure", "Patient movement only", "A Doppler angle error"], 0, "Shadowing is an artifact that can support stone recognition.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "sonography-abdominal-organs-gallbladder-kidney-and-aorta",
    title: "Abdominal Sonography: Gallbladder, Kidney, Liver, and Aorta",
    topic: "Abdominal Sonography",
    topicSlug: "abdominal-sonography",
    system: "imaging",
    bodySystem: "abdominal-sonography",
    previewSectionCount: 2,
    seoTitle: "Abdominal Sonography Gallbladder Kidney Liver and Aorta",
    seoDescription: "Sonography lesson on abdominal scanning, gallstones, biliary dilation, hydronephrosis, liver patterns, aortic measurement, free fluid, and documentation.",
    alliedProfessionKey: "sonography",
    sections: sonographySections.abdominal,
    studyTakeaways: ["Scan in two planes systematically.", "Gallstones often shadow; hydronephrosis dilates the collecting system.", "Aortic measurement technique matters."],
    studyCommonTraps: ["Stopping after one stone image", "Confusing cysts with hydronephrosis", "Measuring the aorta incorrectly"],
    preTest: [quiz("A mobile echogenic gallbladder focus with clean posterior shadowing suggests:", ["Gallstone", "Simple renal cyst", "Mirror artifact only", "Normal bowel gas only"], 0, "Gallstones often appear echogenic and produce posterior acoustic shadowing.")],
    postTest: [quiz("Aortic aneurysm screening measurement should generally use:", ["Outer-wall-to-outer-wall measurement", "Random luminal color only", "Only patient-reported pain", "No measurement"], 0, "Aortic diameter is measured outer wall to outer wall according to standard technique.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "sonography-ob-gyn-early-pregnancy-pelvic-and-urgent-red-flags",
    title: "OB/GYN Sonography: Early Pregnancy, Pelvic Imaging, and Red Flags",
    topic: "OB/GYN Sonography",
    topicSlug: "ob-gyn-sonography",
    system: "imaging",
    bodySystem: "ob-gyn-sonography",
    previewSectionCount: 2,
    seoTitle: "OB/GYN Sonography Early Pregnancy Pelvic Imaging and Red Flags",
    seoDescription: "Sonography lesson on early pregnancy imaging, ectopic red flags, fetal dating, placenta location, adnexa, ovarian torsion clues, cysts, fibroids, and role-safe communication.",
    alliedProfessionKey: "sonography",
    sections: sonographySections.obGyn,
    studyTakeaways: ["Ectopic red flags require urgent escalation.", "OB/GYN scanning follows ALARA.", "Communication must stay within role."],
    studyCommonTraps: ["Reassuring before interpretation", "Missing free fluid with no confirmed IUP", "Ignoring torsion clues"],
    preTest: [quiz("Positive pregnancy test, pelvic pain, no confirmed IUP, and free fluid should raise concern for:", ["Possible ectopic pregnancy", "Normal imaging always", "Machine artifact only", "No urgency ever"], 0, "This pattern requires urgent consideration of ectopic pregnancy and escalation by protocol.")],
    postTest: [quiz("When a patient asks for diagnostic reassurance during an OB scan, the sonographer should:", ["Communicate empathetically within role and follow interpretation workflow", "Invent a diagnosis", "Promise everything is normal", "Refuse all communication"], 0, "The sonographer should be empathetic while staying within scope and interpretation policy.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "sonography-vascular-doppler-dvt-and-arterial-waveforms",
    title: "Vascular Sonography: Doppler, DVT, and Arterial Waveforms",
    topic: "Vascular Sonography",
    topicSlug: "vascular-sonography",
    system: "imaging",
    bodySystem: "vascular-sonography",
    previewSectionCount: 2,
    seoTitle: "Vascular Sonography Doppler DVT and Arterial Waveforms",
    seoDescription: "Sonography lesson on venous compression, DVT findings, color Doppler, spectral Doppler, waveform analysis, arterial stenosis, Doppler angle, and documentation.",
    alliedProfessionKey: "sonography",
    sections: sonographySections.vascular,
    studyTakeaways: ["Compression is central to DVT assessment.", "Doppler angle affects velocity accuracy.", "Waveform shape adds clinical meaning."],
    studyCommonTraps: ["Poor angle correction", "Excessive compression pressure", "Mistaking low color gain for absent flow"],
    preTest: [quiz("A femoral vein does not fully compress and contains echogenic material. This supports concern for:", ["Venous thrombosis", "Normal compressibility", "Bone fracture only", "No vascular abnormality"], 0, "Noncompressibility with intraluminal material is concerning for venous thrombosis.")],
    postTest: [quiz("For Doppler velocity measurement, poor angle correction mainly affects:", ["Velocity accuracy", "Patient identity", "Room temperature only", "Probe disinfection level only"], 0, "Doppler angle directly affects velocity measurement accuracy.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "sonography-small-parts-thyroid-scrotal-and-soft-tissue",
    title: "Small Parts Sonography: Thyroid, Scrotal, and Soft Tissue",
    topic: "Small Parts Sonography",
    topicSlug: "small-parts-sonography",
    system: "imaging",
    bodySystem: "small-parts-sonography",
    previewSectionCount: 2,
    seoTitle: "Small Parts Sonography Thyroid Scrotal and Soft Tissue",
    seoDescription: "Sonography lesson on thyroid nodules, scrotal Doppler, torsion urgency, superficial soft tissue, abscess patterns, lymph nodes, high-frequency probes, and measurements.",
    alliedProfessionKey: "sonography",
    sections: sonographySections.smallParts,
    studyTakeaways: ["High-frequency probes support superficial detail.", "Acute torsion concerns are time-sensitive.", "Lesion features and measurements must be documented carefully."],
    studyCommonTraps: ["Incomplete Doppler comparison in acute scrotal pain", "Missing posterior features", "Using too much depth for superficial anatomy"],
    preTest: [quiz("Acute testicular pain requires urgent comparison of:", ["Bilateral testicular perfusion", "Only room lighting", "Patient shoe size", "No Doppler information"], 0, "Torsion concerns require urgent bilateral grayscale and Doppler perfusion assessment.")],
    postTest: [quiz("A superficial thyroid nodule is best evaluated initially with:", ["High-frequency linear transducer", "Low-frequency curvilinear only", "No measurements", "Doppler angle only"], 0, "High-frequency linear probes provide detail for superficial structures such as the thyroid.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "sonography-patient-care-probe-disinfection-and-role-boundaries",
    title: "Patient Care, Probe Disinfection, and Role Boundaries",
    topic: "Sonography Patient Care",
    topicSlug: "sonography-patient-care",
    system: "imaging",
    bodySystem: "patient-care",
    previewSectionCount: 2,
    seoTitle: "Sonography Patient Care Probe Disinfection and Role Boundaries",
    seoDescription: "Sonography lesson on two identifiers, privacy, probe disinfection, isolation precautions, patient positioning, emotional communication, urgent escalation, and scope boundaries.",
    alliedProfessionKey: "sonography",
    sections: sonographySections.patientCare,
    studyTakeaways: ["Probe disinfection must match exam risk.", "Communication should be empathetic and within role.", "Urgent findings follow escalation pathways."],
    studyCommonTraps: ["Giving unsupported diagnostic reassurance", "Using low-level cleaning after high-risk exposure", "Skipping identifiers"],
    preTest: [quiz("A patient asks whether the scan is normal before interpretation. What is the safest response?", ["Empathetic role-safe explanation of interpretation workflow", "Promise it is normal", "Invent findings", "Ignore the patient completely"], 0, "Sonographers should communicate supportively while staying within role and facility interpretation process.")],
    postTest: [quiz("Probe cleaning requirements depend most on:", ["Exam type and exposure risk", "The sonographer's favorite color", "Whether the room is busy", "Patient age only"], 0, "Disinfection level depends on exam type, contact, and exposure risk according to policy.")]
  }
];

export default { lessons: sonographyLessons };
