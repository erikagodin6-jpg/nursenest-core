export type MltRbcMorphologyReference = {
  id: string;
  morphology: string;
  aliases: string[];
  description: string;
  associatedConditions: string[];
  differentialMorphologies: string[];
  clinicalMeaning: string;
  workflowImplications: string[];
  escalationTriggers: string[];
  examRelevance: string;
  morphologyTags: string[];
};

function morphology(
  id: string,
  morphologyName: string,
  aliases: string[],
  description: string,
  associatedConditions: string[],
  differentialMorphologies: string[],
  clinicalMeaning: string,
  workflowImplications: string[],
  escalationTriggers: string[],
  examRelevance: string,
  morphologyTags: string[] = [],
): MltRbcMorphologyReference {
  return {
    id,
    morphology: morphologyName,
    aliases,
    description,
    associatedConditions,
    differentialMorphologies,
    clinicalMeaning,
    workflowImplications,
    escalationTriggers,
    examRelevance,
    morphologyTags,
  };
}

export const mltRbcMorphologyReference: MltRbcMorphologyReference[] = [
  morphology(
    "schistocyte",
    "Schistocyte",
    ["helmet cell", "fragmented RBC"],
    "Fragmented red blood cells with irregular sharp edges caused by mechanical destruction.",
    ["DIC", "TTP", "HUS", "mechanical hemolysis", "MAHA"],
    ["keratocyte", "bite cell"],
    "Schistocytes may indicate life-threatening fragmentation hemolysis and require clinical correlation.",
    ["smear review", "critical morphology escalation", "hemolysis correlation"],
    ["high schistocyte burden", "DIC pattern", "thrombocytopenia with fragmentation"],
    "High-yield MLS morphology pattern associated with fragmentation hemolysis and urgent escalation workflows.",
    ["fragmentation", "hemolysis", "critical-smear"],
  ),
  morphology(
    "spherocyte",
    "Spherocyte",
    ["dense RBC"],
    "Small dense RBC lacking central pallor.",
    ["hereditary spherocytosis", "autoimmune hemolytic anemia"],
    ["microcyte"],
    "Spherocytes correlate with membrane loss and hemolysis patterns.",
    ["DAT correlation", "hemolysis workup", "smear confirmation"],
    ["suspected autoimmune hemolysis", "severe hemolytic picture"],
    "Frequently tested alongside DAT interpretation and hereditary hemolysis disorders.",
    ["hemolysis", "membrane-loss"],
  ),
  morphology(
    "target-cell",
    "Target Cell",
    ["codocyte"],
    "RBC with central staining target appearance.",
    ["thalassemia", "hemoglobinopathy", "liver disease", "post-splenectomy"],
    ["hypochromic RBC", "leptocyte"],
    "Target cells correlate with membrane-to-volume abnormalities and hemoglobinopathies.",
    ["hemoglobinopathy correlation", "anemia differential review"],
    ["marked target-cell burden with anemia"],
    "Frequently tested in anemia differential and hemoglobinopathy morphology questions.",
    ["hemoglobinopathy", "anemia"],
  ),
  morphology(
    "sickle-cell",
    "Sickle Cell",
    ["drepanocyte"],
    "Elongated crescent-shaped RBC caused by hemoglobin S polymerization.",
    ["sickle cell disease"],
    ["boat cell"],
    "Sickled cells reflect hemoglobin polymerization and vaso-occlusive disease.",
    ["critical hemoglobinopathy communication", "smear review"],
    ["sickle crisis patterns", "severe hemolysis"],
    "Classic morphology association for hemoglobin S disorders and vaso-occlusive pathology.",
    ["hemoglobin-s", "sickling"],
  ),
  morphology(
    "bite-cell",
    "Bite Cell",
    ["degmacyte"],
    "RBC with semicircular membrane defects from splenic removal of Heinz bodies.",
    ["G6PD deficiency", "oxidative stress hemolysis"],
    ["blister cell", "schistocyte"],
    "Bite cells suggest oxidative injury and Heinz body processing.",
    ["oxidative hemolysis review", "drug exposure correlation"],
    ["acute hemolytic episodes"],
    "Often tested in oxidative hemolysis and enzyme deficiency scenarios.",
    ["oxidative-stress", "hemolysis"],
  ),
];
