export type MltGramStainReference = {
  id: string;
  pattern: string;
  morphology: string;
  arrangement: string;
  description: string;
  commonOrganismGroups: string[];
  specimenContext: string[];
  differentialPatterns: string[];
  workflowImplications: string[];
  escalationTriggers: string[];
  examRelevance: string;
  gramStainTags: string[];
};

function gramStain(
  id: string,
  pattern: string,
  morphologyName: string,
  arrangement: string,
  description: string,
  commonOrganismGroups: string[],
  specimenContext: string[],
  differentialPatterns: string[],
  workflowImplications: string[],
  escalationTriggers: string[],
  examRelevance: string,
  gramStainTags: string[] = [],
): MltGramStainReference {
  return {
    id,
    pattern,
    morphology: morphologyName,
    arrangement,
    description,
    commonOrganismGroups,
    specimenContext,
    differentialPatterns,
    workflowImplications,
    escalationTriggers,
    examRelevance,
    gramStainTags,
  };
}

export const mltGramStainReference: MltGramStainReference[] = [
  gramStain(
    "gram-positive-cocci-clusters",
    "Gram-positive cocci in clusters",
    "cocci",
    "clusters",
    "Purple cocci arranged in grape-like clusters, raising concern for Staphylococcus species depending on specimen source.",
    ["Staphylococcus aureus", "coagulase-negative Staphylococcus"],
    ["blood culture", "wound culture", "catheter specimen"],
    ["gram-positive cocci in chains", "yeast", "mixed skin flora"],
    ["preliminary blood culture communication", "catalase/coagulase or rapid identification workflow", "contamination assessment by source"],
    ["positive sterile-site culture", "possible Staphylococcus aureus bacteremia", "multiple positive blood culture bottles"],
    "High-yield because learners must connect Gram stain appearance, source significance, contamination risk, and urgent preliminary reporting.",
    ["gram-positive", "cocci", "clusters", "blood-culture"],
  ),
  gramStain(
    "gram-positive-cocci-chains",
    "Gram-positive cocci in chains or pairs",
    "cocci",
    "chains/pairs",
    "Purple cocci arranged in chains or pairs, suggesting Streptococcus or Enterococcus patterns depending on source and follow-up testing.",
    ["Streptococcus species", "Enterococcus species"],
    ["blood culture", "throat culture", "urine culture", "wound culture"],
    ["gram-positive cocci in clusters", "gram-negative diplococci"],
    ["preliminary reporting", "catalase testing", "source-specific significance assessment"],
    ["positive blood culture", "suspected invasive streptococcal infection", "possible enterococcal bacteremia"],
    "Commonly tested because arrangement changes the next narrowing step and likely organism group.",
    ["gram-positive", "cocci", "chains", "pairs"],
  ),
  gramStain(
    "gram-negative-rods",
    "Gram-negative rods",
    "bacilli",
    "rods",
    "Pink/red rod-shaped organisms that require source-specific interpretation and follow-up identification workflows.",
    ["Enterobacterales", "Pseudomonas species", "Haemophilus species"],
    ["urine culture", "blood culture", "respiratory culture", "wound culture"],
    ["gram-positive rods", "gram-negative coccobacilli", "mixed flora"],
    ["oxidase or biochemical narrowing", "susceptibility workflow", "contamination versus pathogen assessment"],
    ["positive blood culture", "sepsis workup", "multidrug resistance concern"],
    "High-yield because Gram-negative rods are common in urine, blood, and respiratory workflows and often connect to susceptibility reasoning.",
    ["gram-negative", "rods", "enteric", "susceptibility"],
  ),
  gramStain(
    "gram-positive-rods",
    "Gram-positive rods",
    "bacilli",
    "rods",
    "Purple rod-shaped organisms with significance that depends heavily on specimen source, morphology, and clinical context.",
    ["Bacillus species", "Corynebacterium species", "Listeria monocytogenes", "Clostridium species"],
    ["blood culture", "wound culture", "sterile body fluid", "environmental contamination context"],
    ["gram-negative rods", "yeast forms", "diptheroid-like contaminants"],
    ["source significance review", "aerobic/anaerobic workflow", "contamination assessment"],
    ["sterile-site gram-positive rods", "possible Listeria in high-risk patient", "anaerobic infection concern"],
    "Exam items often test whether learners overcall contaminants or under-recognize important sterile-site findings.",
    ["gram-positive", "rods", "sterile-site", "contamination-risk"],
  ),
  gramStain(
    "yeast-budding",
    "Budding yeast",
    "yeast",
    "budding forms",
    "Oval budding forms that may indicate Candida or other yeast depending on specimen source and patient context.",
    ["Candida species", "other yeast"],
    ["blood culture", "urine culture", "respiratory specimen", "wound culture"],
    ["gram-positive cocci", "artifact", "mixed flora"],
    ["preliminary reporting", "fungal identification workflow", "clinical significance by source"],
    ["yeast in blood culture", "immunocompromised patient", "sterile-site yeast"],
    "High-yield because yeast in a sterile source is clinically significant and must not be dismissed as routine contamination.",
    ["yeast", "budding", "fungal", "sterile-site"],
  ),
];
