function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const imagingSections = {
  radiationSafety: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Radiation safety is the foundation of diagnostic imaging practice. Imaging professionals must balance diagnostic image quality with dose reduction, shielding decisions, pregnancy screening, repeat-image prevention, and occupational exposure control. Exam questions reward ALARA reasoning, not memorized slogans."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "ALARA means keeping exposure as low as reasonably achievable while still producing a diagnostic study. Time, distance, shielding, collimation, exposure selection, positioning accuracy, communication, and repeat prevention all reduce dose. Radiation safety applies to the patient, the technologist, nearby staff, and in some contexts family or support persons. Always follow facility and regulatory policy for pregnancy screening, gonadal or fetal shielding, portable exams, fluoroscopy, and occupational dosimetry."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A portable chest radiograph is requested in a crowded ICU room. The technologist should verify the patient, explain the exposure, position accurately, collimate appropriately, ask nonessential personnel to step back or leave, use shielding where policy requires, and avoid repeats through careful setup. The safest answer is rarely speed alone; it is controlled speed with dose-aware positioning."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Radiography and imaging exams frequently ask which action reduces dose or prevents repeats. Common traps include over-collimating so anatomy is missed, ignoring pregnancy screening, staying close during exposure, repeating images without correcting the cause, and prioritizing image aesthetics over diagnostic adequacy and safety."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Dose reduction is a workflow: correct patient, correct exam, correct positioning, correct exposure, collimation, distance, shielding by policy, and repeat prevention."
    }
  ],
  positioning: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Positioning is clinical reasoning expressed physically. A diagnostic image depends on patient preparation, anatomy alignment, central ray placement, receptor selection, breathing instructions, immobilization, and adaptation for pain, trauma, mobility limitations, or critical illness."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Positioning starts with the exam indication and required anatomy. The technologist must center the correct region, include required joints or landmarks, reduce rotation, choose the correct projection, and modify technique when a patient cannot safely assume the standard position. In trauma or unstable patients, do not force anatomy into ideal positioning; obtain the best diagnostic image without worsening injury."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with suspected hip fracture cannot internally rotate the leg because of severe pain. The technologist should not force rotation to match a routine image. The safer workflow is to follow trauma-safe positioning, document limitations, and communicate image constraints so interpretation remains clinically useful."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam items often test the best modification when routine positioning is unsafe. Common traps include forcing painful movement, failing to include the correct anatomy, ignoring rotation, using poor breathing instructions, and repeating images without fixing centering or motion."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Good positioning is safe, diagnostic, and adapted to the patient. Never sacrifice patient safety for textbook alignment."
    }
  ],
  contrastSafety: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Contrast studies add diagnostic value but introduce risk. Imaging professionals must recognize screening issues, allergy history, renal-risk flags, extravasation signs, medication interactions by policy, and acute reaction patterns that require escalation."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Contrast safety begins before injection: verify the order, patient identity, allergies or prior reactions, pregnancy or lactation policy where relevant, renal function screening according to protocol, IV patency, site assessment, informed workflow, and emergency readiness. Mild reactions may include itching, hives, nausea, or warmth. Severe reactions may include airway swelling, wheeze, hypotension, altered level of consciousness, or anaphylaxis-like presentation. Extravasation requires stopping injection and following local treatment and documentation protocol."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "During contrast injection, the patient reports increasing pain and swelling at the IV site. The technologist should stop the injection, assess the site, notify the radiologist or supervising clinician per protocol, document the event, and provide aftercare instructions according to policy. Continuing because the scan is nearly complete is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Contrast questions often ask what to do first when a reaction or extravasation occurs. Prioritize airway, breathing, circulation, stopping the injection when appropriate, emergency response activation, radiologist notification, and documentation."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Contrast workflow is screening, patency, monitoring, recognition, escalation, and documentation. Do not minimize airway, hypotension, or extravasation clues."
    }
  ],
  modalitySelection: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Imaging teams must understand why a modality is selected. Radiography, CT, MRI, ultrasound, nuclear medicine, and fluoroscopy answer different clinical questions and have different safety constraints. Exams test whether learners can match modality logic to patient risk."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Plain radiography is fast and useful for many bone, chest, and device-position questions. CT gives cross-sectional detail and is common in trauma, stroke, PE workup, and acute abdomen pathways but uses ionizing radiation and may use contrast. MRI gives excellent soft-tissue contrast but requires strict screening for implants, ferromagnetic objects, and patient tolerance. Ultrasound is portable, non-ionizing, and useful for obstetric, vascular, abdominal, and procedural guidance contexts. Nuclear medicine evaluates physiology and tracer distribution rather than anatomy alone."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with a suspected ferromagnetic implant is scheduled for MRI. The safest action is not to proceed and hope the screening form is wrong. MRI safety requires verification before entry into the controlled zone, because projectile risk, device malfunction, heating, or image artifact can create serious harm."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Modality questions often hide safety flags. Watch for MRI implants, CT contrast renal or reaction concerns, ultrasound probe and anatomy limitations, pregnancy considerations by policy, fluoroscopy dose, and nuclear medicine radiation precautions."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Every modality has a clinical purpose and a safety profile. The safest modality is the one that answers the question without ignoring patient-specific risk."
    }
  ],
  imageQuality: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Image quality is not about making a picture look pretty; it is about producing diagnostic information. Exposure, contrast, noise, motion, rotation, artifact, collimation, receptor position, and processing all affect whether the radiologist can answer the clinical question."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      body: "Artifacts and poor technique create diagnostic uncertainty and repeated exposure. Motion can blur anatomy; rotation changes apparent alignment; grid cutoff can reduce density; poor collimation increases scatter; wrong exposure selection can increase noise or dose; incorrect marker placement can create side confusion. Digital imaging can mask exposure errors, so exposure indicators and technique review still matter.",
      kind: "core_concept"
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A chest radiograph has clipped costophrenic angles and rotation. Repeating without changing setup would likely reproduce the same problem. The technologist should identify the failed criterion, correct centering and rotation, coach breathing if needed, and repeat only when the benefit justifies the exposure."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Image quality questions often ask the cause of artifact or the best correction. Traps include blaming the patient without correcting instructions, ignoring exposure indicators, accepting missing anatomy, or repeating for minor aesthetic issues that do not affect diagnostic adequacy."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Assess whether the image answers the clinical question. Correct the cause before repeating, and always balance repeat exposure against diagnostic need."
    }
  ],
  patientCare: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Imaging professionals provide patient care, not only image acquisition. Safe imaging requires communication, infection prevention, transfer safety, oxygen and line awareness, emergency recognition, privacy, consent workflow, and support for anxious or pediatric patients."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Before moving a patient, inspect tubes, drains, IV lines, oxygen, monitors, isolation status, fall risk, pain, and mobility restrictions. Explain the exam in plain language. Use two identifiers. Preserve dignity. Follow isolation precautions. Escalate deterioration such as chest pain, shortness of breath, syncope, seizure, sudden confusion, allergic reaction, or unstable vital signs."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient becomes acutely short of breath while being positioned for imaging. The technologist should stop positioning, assess safety, call for help according to emergency protocol, maintain oxygen and monitoring supports within role, and communicate the change. Continuing the exam because the room is booked is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Patient-care questions test prioritization. Safety, identity, infection control, airway or breathing issues, falls, contrast reactions, and line/tube protection outrank workflow speed or room turnover."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "The patient comes before the image. Protect identity, dignity, lines, isolation precautions, and physiologic stability."
    }
  ]
};

export const medicalImagingLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "imaging-radiation-safety-alara-and-dose-reduction",
    title: "Radiation Safety, ALARA, and Dose Reduction",
    topic: "Radiation Safety",
    topicSlug: "radiation-safety",
    system: "imaging",
    bodySystem: "radiology",
    previewSectionCount: 2,
    seoTitle: "Radiation Safety and ALARA for Imaging Exams",
    seoDescription: "Radiography and medical imaging lesson on ALARA, collimation, distance, shielding policy, pregnancy screening, portable exams, and repeat prevention.",
    alliedProfessionKey: "imaging",
    sections: imagingSections.radiationSafety,
    studyTakeaways: ["ALARA means diagnostic quality with dose control.", "Distance, collimation, and repeat prevention reduce exposure.", "Pregnancy and shielding workflows follow policy."],
    studyCommonTraps: ["Repeating without correcting the cause", "Ignoring pregnancy screening", "Standing too close during exposure"],
    preTest: [quiz("Which action best reflects ALARA during a portable radiograph?", ["Expose quickly without checking positioning", "Collimate appropriately and ask nonessential staff to step back", "Repeat all images for appearance", "Ignore distance because exposure is brief"], 1, "Collimation, distance, and careful positioning reduce dose while preserving diagnostic value.")],
    postTest: [quiz("What is the best way to reduce unnecessary repeat exposure?", ["Correct positioning before exposure", "Always use the highest technique", "Skip patient instructions", "Crop the image afterward only"], 0, "Accurate positioning before exposure prevents repeats and reduces dose.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "imaging-positioning-projections-and-trauma-modification",
    title: "Positioning, Projections, and Trauma Modification",
    topic: "Imaging Positioning",
    topicSlug: "imaging-positioning",
    system: "imaging",
    bodySystem: "radiology",
    previewSectionCount: 2,
    seoTitle: "Radiography Positioning and Trauma Modification",
    seoDescription: "Medical imaging lesson on projections, centering, rotation, anatomy inclusion, breathing instructions, trauma-safe positioning, and diagnostic adaptation.",
    alliedProfessionKey: "imaging",
    sections: imagingSections.positioning,
    studyTakeaways: ["Positioning must be safe and diagnostic.", "Include required anatomy and reduce rotation.", "Modify technique rather than force injured patients."],
    studyCommonTraps: ["Forcing painful movement", "Missing required anatomy", "Repeating without correcting centering"],
    preTest: [quiz("A patient with suspected hip fracture cannot tolerate routine rotation. What is safest?", ["Force the leg into position", "Use trauma-safe modification and document limitation", "Cancel all imaging without notifying anyone", "Ignore patient pain"], 1, "Trauma-safe modification protects the patient while preserving diagnostic intent.")],
    postTest: [quiz("Which positioning issue commonly makes an image nondiagnostic?", ["Required anatomy clipped from the image", "Correct side marker", "Clear breathing instruction", "Stable receptor placement"], 0, "Missing required anatomy may prevent diagnosis and can require repeat imaging.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "imaging-contrast-safety-reactions-and-extravasation",
    title: "Contrast Safety, Reactions, and Extravasation",
    topic: "Contrast Safety",
    topicSlug: "contrast-safety",
    system: "imaging",
    bodySystem: "radiology",
    previewSectionCount: 2,
    seoTitle: "Contrast Safety for CT and Medical Imaging Exams",
    seoDescription: "Medical imaging lesson on contrast screening, renal-risk checks, allergy history, IV patency, acute reactions, extravasation, escalation, and documentation.",
    alliedProfessionKey: "imaging",
    sections: imagingSections.contrastSafety,
    studyTakeaways: ["Screen before contrast administration.", "Airway symptoms and hypotension are urgent.", "Extravasation requires stopping and escalating by policy."],
    studyCommonTraps: ["Continuing after extravasation symptoms", "Minimizing airway swelling", "Skipping IV patency assessment"],
    preTest: [quiz("During contrast injection, the patient reports pain and swelling at the IV site. What should happen first?", ["Continue injection", "Stop injection and assess per protocol", "Ignore it until after scanning", "Tell the patient swelling is always normal"], 1, "Pain and swelling suggest possible extravasation; stop and follow protocol.")],
    postTest: [quiz("Which contrast reaction sign is most urgent?", ["Mild warmth", "Brief metallic taste", "Airway swelling", "Mild nausea only"], 2, "Airway swelling may indicate a severe reaction and requires urgent escalation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "imaging-modality-selection-ct-mri-ultrasound-and-nuclear-medicine",
    title: "Modality Selection: CT, MRI, Ultrasound, and Nuclear Medicine",
    topic: "Imaging Modalities",
    topicSlug: "imaging-modalities",
    system: "imaging",
    bodySystem: "radiology",
    previewSectionCount: 2,
    seoTitle: "Imaging Modality Selection for Allied Health Exams",
    seoDescription: "Medical imaging lesson comparing radiography, CT, MRI, ultrasound, fluoroscopy, and nuclear medicine with safety constraints and clinical-use logic.",
    alliedProfessionKey: "imaging",
    sections: imagingSections.modalitySelection,
    studyTakeaways: ["Each modality answers a different clinical question.", "MRI screening is a hard safety stop.", "CT and fluoroscopy use ionizing radiation; ultrasound does not."],
    studyCommonTraps: ["Proceeding with unsafe MRI screening", "Ignoring contrast risk", "Choosing modality without considering the question"],
    preTest: [quiz("A patient has a possible ferromagnetic implant before MRI. What is safest?", ["Proceed quickly", "Verify implant safety before MRI-zone entry", "Use extra pillows only", "Ignore the form"], 1, "MRI safety screening must be verified before entry because ferromagnetic objects and devices can create serious harm.")],
    postTest: [quiz("Which modality is non-ionizing and commonly portable?", ["Ultrasound", "CT", "Fluoroscopy", "Plain radiography"], 0, "Ultrasound is non-ionizing and portable in many clinical settings.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "imaging-image-quality-artifacts-and-repeat-analysis",
    title: "Image Quality, Artifacts, and Repeat Analysis",
    topic: "Image Quality",
    topicSlug: "image-quality",
    system: "imaging",
    bodySystem: "radiology",
    previewSectionCount: 2,
    seoTitle: "Image Quality Artifacts and Repeat Analysis for Imaging Exams",
    seoDescription: "Radiography lesson on motion, rotation, collimation, exposure indicators, grid cutoff, missing anatomy, artifacts, and repeat-decision safety.",
    alliedProfessionKey: "imaging",
    sections: imagingSections.imageQuality,
    studyTakeaways: ["Diagnostic adequacy matters more than appearance alone.", "Correct the cause before repeating.", "Exposure indicators still matter in digital imaging."],
    studyCommonTraps: ["Repeating for minor aesthetics", "Ignoring clipped anatomy", "Blaming the patient without changing instructions"],
    preTest: [quiz("An image has missing required anatomy. What is the main concern?", ["It may be nondiagnostic", "It is always acceptable", "It proves overexposure", "It removes all radiation risk"], 0, "If required anatomy is missing, the image may not answer the clinical question.")],
    postTest: [quiz("Before repeating a motion-blurred image, the technologist should first:", ["Correct instructions or immobilization", "Repeat with no change", "Delete the order", "Ignore motion blur always"], 0, "Correct the cause of motion before repeating to avoid another nondiagnostic exposure.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "imaging-patient-care-lines-tubes-isolation-and-emergencies",
    title: "Patient Care: Lines, Tubes, Isolation, and Emergencies",
    topic: "Imaging Patient Care",
    topicSlug: "imaging-patient-care",
    system: "imaging",
    bodySystem: "patient-care",
    previewSectionCount: 2,
    seoTitle: "Patient Care for Medical Imaging Exams",
    seoDescription: "Medical imaging lesson on patient identifiers, transfer safety, oxygen, lines, tubes, isolation precautions, emergency recognition, privacy, and patient communication.",
    alliedProfessionKey: "imaging",
    sections: imagingSections.patientCare,
    studyTakeaways: ["The patient comes before the image.", "Protect lines, tubes, oxygen, and isolation precautions.", "Deterioration requires stopping and escalating."],
    studyCommonTraps: ["Moving patients without line awareness", "Continuing during acute shortness of breath", "Skipping two identifiers"],
    preTest: [quiz("A patient becomes acutely short of breath during positioning. What should the technologist do?", ["Continue because positioning is almost finished", "Stop and activate help per emergency protocol", "Remove oxygen without asking", "Tell the patient to wait"], 1, "Acute respiratory distress outranks workflow; stop and escalate according to protocol.")],
    postTest: [quiz("Before transferring a patient for imaging, which is essential?", ["Assess lines, tubes, oxygen, mobility, and safety needs", "Ignore monitors", "Pull all drains out of the way", "Skip identity checks"], 0, "Transfer safety requires checking supports, identity, mobility, and physiologic risk before movement.")]
  }
];

export default { lessons: medicalImagingLessons };
