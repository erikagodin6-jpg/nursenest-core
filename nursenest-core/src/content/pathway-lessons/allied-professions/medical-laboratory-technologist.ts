function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const hematologySections = [
  {
    id: 'clinical-meaning',
    heading: 'Clinical Meaning',
    kind: 'clinical_meaning',
    body: 'Hematology interpretation is not isolated memorization. MLS professionals correlate CBC indices, morphology, analyzer flags, coagulation abnormalities, and specimen integrity before validating results. Exams increasingly reward mechanism-first reasoning rather than flat recall.'
  },
  {
    id: 'core-concept',
    heading: 'Core Concept',
    kind: 'core_concept',
    body: 'A CBC should be interpreted systematically: hemoglobin and hematocrit for severity, MCV for cell size, RDW for variability, platelet count for bleeding risk, and WBC differential for inflammatory or malignant patterns. Morphology findings must correlate with analyzer data and clinical context.'
  },
  {
    id: 'workflow',
    heading: 'Laboratory Workflow',
    kind: 'clinical_scenario',
    body: 'A potassium result is critically elevated on a visibly hemolyzed specimen. The MLS should evaluate specimen integrity, hemolysis indices, analyzer flags, and redraw requirements before verification or provider notification. Technical accuracy without workflow judgment can create patient harm.'
  },
  {
    id: 'exam-relevance',
    heading: 'Exam Relevance',
    kind: 'exam_relevance',
    body: 'CSMLS and ASCP questions frequently combine morphology, analyzer interpretation, coagulation reasoning, and escalation judgment. Expect questions that test what the laboratorian should do next, not only identification.'
  }
];

const bloodBankSections = [
  {
    id: 'clinical-meaning',
    heading: 'Clinical Meaning',
    kind: 'clinical_meaning',
    body: 'Blood bank testing directly affects transfusion safety. MLS professionals must interpret antibody reactions, evaluate compatibility risk, and escalate unsafe transfusion situations immediately.'
  },
  {
    id: 'core-concept',
    heading: 'Core Concept',
    kind: 'core_concept',
    body: 'ABO/Rh interpretation, antibody screening, crossmatching, DAT/IAT interpretation, and transfusion reaction investigation form the foundation of transfusion medicine workflow. Reaction strength patterns help narrow likely antibodies.'
  },
  {
    id: 'workflow',
    heading: 'Workflow Scenario',
    kind: 'clinical_scenario',
    body: 'A trauma patient requires emergency uncrossmatched blood while antibody identification remains unresolved. The MLS must balance urgency, compatibility risk, inventory constraints, and escalation policy simultaneously.'
  },
  {
    id: 'exam-relevance',
    heading: 'Exam Relevance',
    kind: 'exam_relevance',
    body: 'Blood bank exams reward elimination logic, reaction interpretation, and escalation judgment under pressure. Questions often focus on the safest operational decision rather than ideal laboratory conditions.'
  }
];

export const medicalLaboratoryTechnologistLessons = [
  {
    pathwayId: 'us-allied-core',
    slug: 'mlt-hematology-cbc-and-morphology-foundations',
    title: 'Hematology: CBC and Morphology Foundations',
    topic: 'Hematology',
    topicSlug: 'hematology-cbc-interpretation',
    system: 'hematology',
    bodySystem: 'hematology',
    previewSectionCount: 2,
    seoTitle: 'MLT Hematology CBC and Morphology Foundations',
    seoDescription: 'MLS and MLT hematology lesson covering CBC interpretation, morphology correlation, analyzer flags, specimen integrity, and escalation reasoning.',
    alliedProfessionKey: 'mlt',
    sections: hematologySections,
    studyTakeaways: [
      'Interpret CBC values systematically instead of memorizing isolated ranges.',
      'Correlate morphology with analyzer findings and specimen quality.',
      'Critical values require workflow judgment and escalation discipline.'
    ],
    studyCommonTraps: [
      'Ignoring specimen hemolysis during chemistry interpretation',
      'Memorizing morphology without disease correlation',
      'Reporting implausible analyzer results without verification'
    ],
    preTest: [
      quiz('A severely hemolyzed specimen shows critically elevated potassium. What should the MLS evaluate first?', ['Room temperature only', 'Specimen integrity and analyzer flags', 'Patient insurance status', 'ABO compatibility'], 1, 'Hemolysis can produce pseudohyperkalemia and requires specimen integrity evaluation before verification.')
    ],
    postTest: [
      quiz('Which finding most strongly suggests fragmentation hemolysis?', ['Target cells', 'Schistocytes', 'Howell-Jolly bodies', 'Spherocytes only'], 1, 'Schistocytes suggest RBC fragmentation processes such as DIC or TTP.')
    ]
  },
  {
    pathwayId: 'us-allied-core',
    slug: 'mlt-blood-bank-and-transfusion-workflow',
    title: 'Blood Bank and Transfusion Workflow',
    topic: 'Blood Bank',
    topicSlug: 'blood-banking-crossmatch',
    system: 'transfusion',
    bodySystem: 'hematology',
    previewSectionCount: 2,
    seoTitle: 'MLT Blood Bank and Transfusion Workflow',
    seoDescription: 'MLS and MLT transfusion medicine lesson covering ABO/Rh, antibody screening, crossmatching, emergency release, and transfusion safety.',
    alliedProfessionKey: 'mlt',
    sections: bloodBankSections,
    studyTakeaways: [
      'Blood bank reasoning prioritizes transfusion safety and escalation.',
      'Reaction patterns guide antibody narrowing workflows.',
      'Emergency transfusion scenarios require operational judgment under pressure.'
    ],
    studyCommonTraps: [
      'Assuming compatibility without full reaction interpretation',
      'Ignoring urgency escalation pathways',
      'Treating transfusion medicine as memorization only'
    ],
    preTest: [
      quiz('Which blood bank principle is most important during emergency uncrossmatched transfusion?', ['Perfect antibody identification before release', 'Balancing urgency with compatibility risk', 'Ignoring reaction strength', 'Avoiding provider communication'], 1, 'Emergency release workflows balance life-threatening urgency against transfusion compatibility risk.')
    ],
    postTest: [
      quiz('What is the purpose of antibody screening?', ['Measure potassium', 'Identify unexpected RBC antibodies', 'Evaluate platelet aggregation', 'Measure fibrinogen'], 1, 'Antibody screening detects clinically significant unexpected RBC antibodies before transfusion.')
    ]
  }
];

export default { lessons: medicalLaboratoryTechnologistLessons };
