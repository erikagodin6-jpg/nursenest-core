import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgTonsillectomy = getAssetUrl("tonsillectomy_1773340545537.png");

export const clinicalConditionsBatchKLessons: Record<string, LessonContent> = {
  "pancreatitis-management-rpn": {
    title: "Pancreatitis",
    cellular: {
      title: "Pancreatic Autodigestion",
      content: "Pancreatitis occurs when premature activation of pancreatic enzymes (trypsin, lipase, elastase) causes autodigestion of pancreatic tissue. The pancreas normally produces digestive enzymes in inactive forms that activate only in the duodenum. When the pancreatic duct is obstructed by gallstones or damaged by alcohol, enzymes activate within the gland, causing inflammation, edema, necrosis, and hemorrhage. Systemic release of cytokines increases capillary permeability and vasodilation, potentially leading to hypovolemic shock from third-spacing. The nurse monitors vital signs, pain characteristics, and intake/output, reporting changes promptly to the nursing team."
    },
    riskFactors: [
      "Chronic alcohol use (direct pancreatic injury)",
      "Gallstones (duct obstruction trapping enzymes)",
      "Thiazide diuretics",
      "Viral infections",
      "Abdominal trauma",
      "Hypertriglyceridemia",
      "ERCP procedures"
    ],
    diagnostics: [
      "Monitor vital signs and report tachycardia or hypotension",
      "Report escalating epigastric or left upper quadrant pain",
      "Monitor and report elevated lipase and amylase results as communicated",
      "Monitor blood glucose levels as ordered",
      "Report nausea and vomiting patterns"
    ],
    management: [
      "Maintain NPO status as ordered",
      "Administer IV fluids as directed",
      "Administer IV opioid analgesics as ordered for pain",
      "Administer antiemetics as ordered",
      "Monitor blood glucose and administer insulin PRN as ordered",
      "Reinforce alcohol cessation education"
    ],
    nursingActions: [
      "Assess pain using a standardized scale and report worsening or unrelieved pain",
      "Position patient in a side-lying position with knees flexed or leaning forward for comfort",
      "Maintain strict NPO status and monitor IV fluid infusion rates as ordered",
      "Monitor strict intake and output and report urine output <30 mL/hr",
      "Assess abdomen for distension, tenderness, and guarding",
      "Report signs of hypovolemic shock: tachycardia, hypotension, pallor, diaphoresis",
      "Monitor for flank ecchymosis (Grey Turner sign) or periumbilical ecchymosis (Cullen sign)"
    ],
    signs: {
      left: [
        "Severe epigastric pain after eating",
        "Pain radiating to the back",
        "Pain worsened by lying flat",
        "Pain relieved by leaning forward",
        "Nausea and vomiting",
        "Elevated lipase and amylase"
      ],
      right: [
        "Grey Turner sign (flank ecchymosis)",
        "Cullen sign (periumbilical ecchymosis)",
        "Hypovolemic shock from third-spacing",
        "Hypocalcemia (Chvostek/Trousseau signs)",
        "Hyperglycemia",
        "ARDS"
      ]
    },
    medications: [
      { name: "Hydromorphone", type: "Opioid analgesic", action: "Binds mu-opioid receptors to reduce severe pain perception", sideEffects: "Respiratory depression, sedation, constipation, nausea", contra: "Severe respiratory depression, paralytic ileus", pearl: "Preferred over morphine in pancreatitis. Administer as ordered and monitor sedation level and respiratory rate." },
      { name: "Ondansetron", type: "Antiemetic", action: "Blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone", sideEffects: "Headache, constipation, QT prolongation", contra: "Known QT prolongation", pearl: "Administer as ordered for nausea. Monitor for effectiveness and report continued vomiting." }
    ],
    pearls: [
      "Epigastric pain radiating to the back that worsens when lying flat is classic for pancreatitis",
      "Grey Turner sign and Cullen sign indicate retroperitoneal hemorrhage, a serious complication",
      "NPO status is essential to rest the pancreas and reduce enzyme secretion",
      "Monitor calcium levels: hypocalcemia can cause tetany and cardiac arrhythmias"
    ],
    quiz: [
      { question: "A patient with pancreatitis reports that pain is worse when lying flat. Which position should the nurse suggest?", options: ["Supine with legs elevated", "Side-lying with knees flexed or leaning forward", "Prone position", "Trendelenburg position"], correct: 1, rationale: "Leaning forward or side-lying with knees flexed reduces tension on the inflamed pancreas and provides pain relief." },
      { question: "Which assessment finding should the nurse report immediately in a patient with acute pancreatitis?", options: ["Blood glucose of 6.5 mmol/L", "Flank ecchymosis with tachycardia", "Mild epigastric tenderness", "Temperature of 37.2°C"], correct: 1, rationale: "Flank ecchymosis (Grey Turner sign) combined with tachycardia suggests retroperitoneal hemorrhage and potential hypovolemic shock." },
      { question: "Why is NPO status ordered for a patient with acute pancreatitis?", options: ["To prepare for emergency surgery", "To rest the pancreas and reduce enzyme secretion", "To prevent aspiration during vomiting", "To facilitate weight loss"], correct: 1, rationale: "NPO status eliminates the stimulus for pancreatic enzyme secretion, allowing the inflamed pancreas to rest and heal." }
    ]
  },

  "pancreatitis-management-rn": {
    title: "Pancreatitis",
    cellular: {
      title: "Pathophysiology of Pancreatic Inflammation",
      content: "Acute pancreatitis results from premature activation of trypsinogen to trypsin within the pancreatic acinar cells, triggering a cascade of enzyme activation that leads to autodigestion of pancreatic tissue. Gallstone migration through the ampulla of Vater and chronic alcohol toxicity are the two most common causes. The inflammatory response releases cytokines (TNF-alpha, IL-6), increasing capillary permeability and causing massive third-space fluid shifts. Severe cases progress to systemic inflammatory response syndrome (SIRS), multiorgan dysfunction, and necrotizing pancreatitis. Chronic pancreatitis involves repeated inflammation leading to fibrosis, exocrine insufficiency (malabsorption), and endocrine failure (diabetes). The nurse must manage aggressive fluid resuscitation, multimodal pain control, monitor for organ dysfunction, and coordinate nutritional support."
    },
    riskFactors: [
      "Gallstones (most common cause globally)",
      "Alcohol abuse (most common cause in males)",
      "Hypertriglyceridemia (>1000 mg/dL)",
      "Post-ERCP procedure",
      "Medications (thiazides, valproic acid, azathioprine)",
      "Autoimmune pancreatitis",
      "Abdominal trauma or surgery",
      "Smoking"
    ],
    diagnostics: [
      "Evaluate serum lipase (most specific; elevated >3x upper limit of normal is diagnostic)",
      "Monitor serum amylase (elevated but less specific than lipase)",
      "Assess Ranson criteria at admission and at 48 hours for severity prognostication",
      "Monitor CBC for leukocytosis and hemoconcentration (hematocrit >44%)",
      "Evaluate BMP: BUN elevation, creatinine for renal function, glucose for hyperglycemia",
      "Monitor calcium levels (hypocalcemia indicates fat saponification and severity)",
      "Interpret CT abdomen with contrast for necrosis, pseudocyst, or abscess",
      "Monitor ABGs for respiratory compromise and ARDS development"
    ],
    management: [
      "Initiate aggressive IV fluid resuscitation with lactated Ringer's (250-500 mL/hr initially)",
      "Implement NPO status initially; advance to oral feeding when pain improves and appetite returns",
      "Administer IV opioid analgesics with scheduled dosing and PRN supplementation",
      "Monitor for and manage hyperglycemia with sliding scale insulin",
      "Replace calcium IV if symptomatic hypocalcemia develops",
      "Initiate enteral nutrition via nasojejunal tube if NPO exceeds 5-7 days",
      "Coordinate ERCP referral if gallstone pancreatitis with biliary obstruction is suspected",
      "Administer IV antibiotics only if infected necrosis is confirmed"
    ],
    nursingActions: [
      "Perform comprehensive abdominal assessment every 2-4 hours: bowel sounds, distension, guarding",
      "Implement multimodal pain management and evaluate effectiveness using pain scales",
      "Monitor strict I&O with goal of adequate urine output >0.5 mL/kg/hr",
      "Assess for signs of organ dysfunction: respiratory (SpO2, work of breathing), renal (UO, creatinine), cardiovascular (BP, HR)",
      "Monitor for Grey Turner sign and Cullen sign indicating hemorrhagic pancreatitis",
      "Provide oral hygiene during NPO status to maintain comfort",
      "Educate patient on alcohol cessation and dietary modifications (low-fat diet)",
      "Monitor for pseudocyst development: persistent pain, palpable mass, fever"
    ],
    signs: {
      left: [
        "Severe epigastric pain radiating to back",
        "Pain worse when supine, better leaning forward",
        "Nausea, vomiting, anorexia",
        "Elevated lipase >3x normal",
        "Abdominal tenderness with guarding",
        "Low-grade fever",
        "Tachycardia"
      ],
      right: [
        "Grey Turner sign (flank ecchymosis)",
        "Cullen sign (periumbilical ecchymosis)",
        "Hypovolemic shock from third-spacing",
        "ARDS (dyspnea, hypoxemia, bilateral infiltrates)",
        "Hypocalcemia (tetany, Chvostek/Trousseau signs)",
        "DIC (petechiae, prolonged PT/PTT)",
        "Pancreatic pseudocyst or abscess"
      ]
    },
    medications: [
      { name: "Hydromorphone", type: "Opioid analgesic", action: "Mu-opioid receptor agonist providing potent analgesia", sideEffects: "Respiratory depression, sedation, constipation, hypotension", contra: "Severe respiratory depression, paralytic ileus", pearl: "Preferred opioid for pancreatitis pain. Use PCA pump for severe cases. Monitor respiratory rate and sedation." },
      { name: "Lactated Ringer's", type: "Isotonic crystalloid", action: "Volume expansion and correction of third-space fluid losses", sideEffects: "Fluid overload, pulmonary edema if excessive", contra: "Decompensated heart failure, severe hepatic insufficiency", pearl: "Preferred over normal saline for resuscitation in pancreatitis. Aggressive early resuscitation (250-500 mL/hr) improves outcomes." },
      { name: "Pancrelipase", type: "Pancreatic enzyme replacement", action: "Replaces deficient exocrine enzymes (lipase, protease, amylase) for fat digestion", sideEffects: "Nausea, abdominal cramping, diarrhea", contra: "Acute pancreatitis (used in chronic phase)", pearl: "Used in chronic pancreatitis for malabsorption. Must be taken with every meal and snack. Evaluate effectiveness by monitoring for steatorrhea." },
      { name: "Calcium Gluconate", type: "Electrolyte replacement", action: "Replaces calcium depleted by fat saponification in severe pancreatitis", sideEffects: "Bradycardia, hypotension if infused too rapidly", contra: "Hypercalcemia, digitalis toxicity", pearl: "Administer IV slowly with cardiac monitoring. Assess for Chvostek and Trousseau signs before and after infusion." }
    ],
    pearls: [
      "Lipase is more specific than amylase for pancreatitis and remains elevated longer",
      "Ranson criteria ≥3 at 48 hours indicates severe pancreatitis with significant mortality risk",
      "Hypocalcemia in pancreatitis results from calcium binding to fatty acids released during fat necrosis (saponification)",
      "Early enteral nutrition (nasojejunal) is preferred over TPN when oral intake is not possible",
      "Infected pancreatic necrosis is suspected when fever and leukocytosis persist beyond 7-10 days"
    ],
    quiz: [
      { question: "Which lab value is most specific for diagnosing acute pancreatitis?", options: ["Serum amylase", "Serum lipase", "Alkaline phosphatase", "ALT"], correct: 1, rationale: "Serum lipase is the most specific marker for pancreatitis. It rises within 4-8 hours of onset and remains elevated longer than amylase." },
      { question: "A patient with acute pancreatitis develops facial twitching when the cheek is tapped. What does this indicate?", options: ["Hyperkalemia", "Hypocalcemia (positive Chvostek sign)", "Hypernatremia", "Hypomagnesemia"], correct: 1, rationale: "Facial twitching when the facial nerve is tapped (Chvostek sign) indicates hypocalcemia, which occurs in severe pancreatitis due to calcium binding to fatty acids during fat necrosis." },
      { question: "Which IV fluid is preferred for initial resuscitation in acute pancreatitis?", options: ["D5W", "Normal saline", "Lactated Ringer's", "D5 half-normal saline"], correct: 2, rationale: "Lactated Ringer's is preferred over normal saline for resuscitation in pancreatitis. Studies show it reduces SIRS and improves outcomes compared to normal saline." }
    ]
  },

  "pancreatitis-management-np": {
    title: "Pancreatitis",
    cellular: {
      title: "Pathophysiology and Evidence-Based Management",
      content: "Acute pancreatitis involves premature intracellular activation of trypsinogen to trypsin, initiating a proteolytic cascade that autodigests pancreatic parenchyma. The two predominant etiologies are biliary (gallstone impaction at the ampulla of Vater, 40%) and alcoholic (direct acinar cell toxicity, 30%). Trypsin activation triggers complement and kinin cascades, releasing proinflammatory cytokines (TNF-α, IL-1β, IL-6) that produce a systemic inflammatory response. Third-space fluid losses can exceed 6-8 liters in severe cases. The revised Atlanta classification distinguishes mild (no organ failure), moderately severe (transient organ failure <48 hours), and severe (persistent organ failure >48 hours) pancreatitis. Chronic pancreatitis results in progressive fibrosis with loss of exocrine function (steatorrhea, malabsorption) and endocrine function (pancreatogenic diabetes, type 3c). The clinician must classify severity using validated scoring systems, prescribe goal-directed fluid therapy, manage complications including infected necrosis, and coordinate long-term enzyme replacement and lifestyle modification."
    },
    riskFactors: [
      "Gallstones (40% of cases; biliary pancreatitis)",
      "Alcohol abuse (30% of cases; dose-dependent toxicity)",
      "Hypertriglyceridemia (>1000 mg/dL; triglyceride-induced pancreatitis)",
      "Post-ERCP (5-15% incidence)",
      "Medications (azathioprine, valproic acid, thiazides, GLP-1 agonists)",
      "Autoimmune pancreatitis (IgG4-related disease)",
      "Pancreas divisum (anatomic variant)",
      "Genetic mutations (PRSS1, SPINK1, CFTR)"
    ],
    diagnostics: [
      "Order serum lipase (most sensitive and specific; diagnostic if >3x upper limit of normal)",
      "Order comprehensive metabolic panel: BUN, creatinine, glucose, calcium, LFTs",
      "Calculate Ranson criteria at admission and 48 hours for prognostication",
      "Order BISAP score (Bedside Index for Severity in Acute Pancreatitis) for rapid risk stratification",
      "Order CT abdomen with IV contrast at 72-96 hours if severity worsens (CT severity index)",
      "Order MRCP or endoscopic ultrasound if biliary etiology suspected but ultrasound equivocal",
      "Order triglyceride level to rule out hypertriglyceridemia-induced pancreatitis",
      "Order fecal elastase-1 for chronic pancreatitis to assess exocrine function (<200 mcg/g = insufficiency)"
    ],
    management: [
      "Prescribe aggressive IV fluid resuscitation with LR 250-500 mL/hr for first 12-24 hours; titrate to UO >0.5 mL/kg/hr",
      "Prescribe multimodal analgesia: IV hydromorphone PCA ± ketorolac ± acetaminophen",
      "Order early oral feeding with low-fat diet when pain improves (within 24 hours if tolerated)",
      "Prescribe nasojejunal enteral nutrition if oral intake not tolerated by day 5-7",
      "Order urgent ERCP within 24 hours for gallstone pancreatitis with cholangitis or persistent biliary obstruction",
      "Prescribe antibiotics (imipenem or meropenem) only for confirmed infected necrosis",
      "Refer for cholecystectomy during same admission for mild gallstone pancreatitis",
      "Prescribe pancreatic enzyme replacement (pancrelipase 25,000-75,000 units lipase per meal) for chronic pancreatitis with exocrine insufficiency"
    ],
    nursingActions: [
      "Classify pancreatitis severity using revised Atlanta classification at presentation and 48 hours",
      "Monitor Modified Marshall score for organ failure (respiratory, renal, cardiovascular)",
      "Titrate fluid resuscitation based on hemodynamic parameters, UO, and hematocrit trend",
      "Coordinate multidisciplinary care: gastroenterology, interventional radiology, surgery",
      "Screen for alcohol use disorder and initiate brief intervention or referral to addiction services",
      "Prescribe long-term management for chronic pancreatitis: enzyme replacement, fat-soluble vitamin supplementation (A, D, E, K), diabetes management",
      "Monitor for pseudocyst development and refer for drainage if symptomatic or >6 cm",
      "Order bone density screening in chronic pancreatitis patients on long-term enzyme replacement"
    ],
    signs: {
      left: [
        "Severe epigastric pain radiating to back",
        "Lipase >3x upper limit of normal",
        "Nausea, vomiting, anorexia",
        "Abdominal guarding and tenderness",
        "Tachycardia and hypotension (early volume depletion)",
        "Low-grade fever"
      ],
      right: [
        "Hemorrhagic pancreatitis (Grey Turner, Cullen signs)",
        "Organ failure (ARDS, AKI, DIC)",
        "Pancreatic necrosis (infected vs. sterile)",
        "Pseudocyst formation",
        "Pancreatic abscess",
        "Splenic vein thrombosis",
        "Pancreatogenic diabetes (type 3c)"
      ]
    },
    medications: [
      { name: "Hydromorphone PCA", type: "Opioid analgesic", action: "Mu-opioid agonist providing patient-controlled analgesia for severe pancreatic pain", sideEffects: "Respiratory depression, sedation, pruritus, constipation", contra: "Severe respiratory compromise, paralytic ileus", pearl: "Set demand dose 0.2-0.4 mg with 6-10 min lockout. Add scheduled acetaminophen 1g q6h and ketorolac 15-30 mg q6h for opioid-sparing effect." },
      { name: "Imipenem/Cilastatin", type: "Carbapenem antibiotic", action: "Broad-spectrum bactericidal activity against gram-positive, gram-negative, and anaerobes; penetrates pancreatic necrosis", sideEffects: "Seizures (high doses), GI disturbance, C. diff, rash", contra: "Carbapenem allergy, concurrent valproic acid use", pearl: "Reserved for confirmed infected pancreatic necrosis. Not recommended prophylactically. Obtain CT-guided FNA culture before starting." },
      { name: "Pancrelipase (Creon)", type: "Pancreatic enzyme replacement", action: "Supplies exogenous lipase, protease, and amylase to compensate for exocrine insufficiency", sideEffects: "Nausea, abdominal cramping, fibrosing colonopathy (high doses in CF)", contra: "Acute pancreatitis (use in chronic phase only)", pearl: "Dose 25,000-75,000 units lipase per meal, half-dose with snacks. Must swallow capsules whole with meals. Assess steatorrhea resolution and weight gain as efficacy markers." },
      { name: "Rectal Indomethacin", type: "NSAID", action: "Inhibits phospholipase A2 and COX, reducing pancreatic inflammation", sideEffects: "GI bleeding, renal impairment", contra: "Active GI bleed, CKD, aspirin-sensitive asthma", pearl: "100 mg PR immediately post-ERCP reduces post-ERCP pancreatitis incidence by 50%. Standard prophylaxis for high-risk ERCP." }
    ],
    pearls: [
      "The revised Atlanta classification: mild (no organ failure), moderately severe (transient organ failure <48h), severe (persistent organ failure >48h)",
      "Early oral feeding within 24 hours (when tolerated) is now standard; prolonged NPO is no longer recommended",
      "Prophylactic antibiotics are NOT indicated in acute pancreatitis without evidence of infected necrosis",
      "Rectal indomethacin 100 mg is standard prophylaxis for post-ERCP pancreatitis in high-risk patients",
      "Fecal elastase-1 <200 mcg/g confirms exocrine insufficiency in chronic pancreatitis"
    ],
    quiz: [
      { question: "According to the revised Atlanta classification, what defines severe acute pancreatitis?", options: ["Lipase >10x upper limit of normal", "Ranson score ≥5", "Persistent organ failure lasting >48 hours", "CT evidence of pancreatic necrosis"], correct: 2, rationale: "The revised Atlanta classification defines severe pancreatitis by persistent organ failure (respiratory, renal, or cardiovascular) lasting longer than 48 hours." },
      { question: "When should antibiotics be prescribed in acute pancreatitis?", options: ["Prophylactically in all severe cases", "When lipase is >5x normal", "Only when infected pancreatic necrosis is confirmed", "At admission for all hospitalized patients"], correct: 2, rationale: "Current guidelines recommend antibiotics only for confirmed infected pancreatic necrosis. Prophylactic antibiotics have not shown benefit and increase risk of resistant organisms." },
      { question: "Which prophylactic measure reduces post-ERCP pancreatitis incidence?", options: ["IV octreotide", "Rectal indomethacin 100 mg", "Prophylactic imipenem", "Pancreatic enzyme supplementation"], correct: 1, rationale: "Rectal indomethacin 100 mg administered immediately after ERCP reduces post-ERCP pancreatitis incidence by approximately 50% in high-risk patients." }
    ]
  },

  "cirrhosis-management-rpn": {
    title: "Cirrhosis",
    cellular: {
      title: "Hepatic Fibrosis and Portal Hypertension",
      content: "Cirrhosis is the end stage of chronic liver disease characterized by progressive replacement of functional hepatocytes with fibrous scar tissue. This fibrosis disrupts normal hepatic architecture, impeding blood flow through the liver and causing portal hypertension. As portal pressure rises, blood is diverted through collateral vessels, creating esophageal varices, caput medusae, and hemorrhoids. Impaired hepatocyte function leads to decreased albumin synthesis (causing edema and ascites), decreased clotting factor production (causing bleeding), decreased bile production (causing jaundice and pruritus), and impaired ammonia detoxification (causing hepatic encephalopathy). The nurse monitors vital signs, mental status, skin integrity, and fluid balance, reporting changes to the nursing team."
    },
    riskFactors: [
      "Chronic alcohol abuse",
      "Chronic hepatitis B or C infection",
      "Non-alcoholic fatty liver disease (NAFLD/NASH)",
      "Autoimmune hepatitis",
      "Biliary obstruction",
      "Medication-induced hepatotoxicity",
      "Hemochromatosis"
    ],
    diagnostics: [
      "Monitor vital signs and report hypotension or tachycardia",
      "Assess mental status and orientation and report changes (confusion, asterixis)",
      "Monitor for jaundice (scleral icterus, dark urine, clay-colored stools)",
      "Measure abdominal girth daily and report increases",
      "Monitor for signs of bleeding: bruising, petechiae, melena, hematemesis",
      "Report pruritus severity and skin integrity changes"
    ],
    management: [
      "Administer lactulose as ordered for elevated ammonia levels",
      "Administer diuretics as ordered (spironolactone, furosemide)",
      "Implement sodium-restricted diet as ordered",
      "Administer cholestyramine as ordered for pruritus",
      "Administer prescribed vitamins and supplements",
      "Reinforce alcohol cessation education"
    ],
    nursingActions: [
      "Assess neurological status for hepatic encephalopathy: orientation, asterixis (liver flap), confusion",
      "Monitor daily weights and abdominal girth for ascites progression",
      "Assess skin for jaundice, bruising, petechiae, and spider angiomas",
      "Monitor stool color and consistency (clay-colored stools indicate biliary obstruction)",
      "Count and document number of lactulose-induced bowel movements (goal: 2-3 soft stools/day)",
      "Provide skin care: keep nails short, use knuckles for itching, apply moisturizer, tepid baths",
      "Report any signs of GI bleeding: hematemesis, melena, or bright red blood in vomit"
    ],
    signs: {
      left: [
        "Jaundice and scleral icterus",
        "Pruritus",
        "Ascites and peripheral edema",
        "Spider angiomas",
        "Palmar erythema",
        "Easy bruising",
        "Fatigue and weakness"
      ],
      right: [
        "Esophageal variceal hemorrhage",
        "Hepatic encephalopathy (confusion, asterixis)",
        "Hepatorenal syndrome",
        "Spontaneous bacterial peritonitis",
        "Coagulopathy (elevated INR)",
        "Caput medusae"
      ]
    },
    medications: [
      { name: "Lactulose", type: "Osmotic laxative/ammonia reducer", action: "Converts ammonia to ammonium in the colon, preventing absorption; promotes excretion via osmotic diarrhea", sideEffects: "Diarrhea, flatulence, abdominal cramping, electrolyte imbalances", contra: "Galactosemia", pearl: "Goal is 2-3 soft stools per day. Too few stools means ammonia is accumulating; too many cause dehydration. Administer as ordered." },
      { name: "Cholestyramine", type: "Bile acid sequestrant", action: "Binds bile acids in the intestine, reducing reabsorption and decreasing pruritus", sideEffects: "Constipation, bloating, decreased absorption of other medications", contra: "Complete biliary obstruction", pearl: "Administer 1 hour after other medications as it can impair their absorption. Monitor for effectiveness in reducing itching." }
    ],
    pearls: [
      "Asterixis (liver flap) is a hallmark sign of hepatic encephalopathy from ammonia accumulation",
      "Count lactulose-induced bowel movements: goal is 2-3 soft stools daily",
      "Cholestyramine should be given 1 hour after other medications to avoid drug interaction",
      "Report any vomiting of bright red blood or coffee-ground emesis immediately as it may indicate variceal bleeding"
    ],
    quiz: [
      { question: "A patient with cirrhosis becomes confused and develops a flapping tremor of the hands. What should the nurse suspect?", options: ["Hypoglycemia", "Hepatic encephalopathy", "Alcohol withdrawal", "Stroke"], correct: 1, rationale: "Confusion and asterixis (flapping tremor) are hallmark signs of hepatic encephalopathy caused by ammonia accumulation in the blood due to impaired liver detoxification." },
      { question: "What is the goal number of bowel movements per day for a patient on lactulose therapy?", options: ["1 formed stool", "2-3 soft stools", "4-5 watery stools", "No specific goal"], correct: 1, rationale: "Lactulose therapy aims for 2-3 soft stools per day to adequately excrete ammonia while avoiding dehydration from excessive diarrhea." },
      { question: "When should cholestyramine be administered in relation to other medications?", options: ["At the same time", "1 hour before", "1 hour after", "2 hours before"], correct: 2, rationale: "Cholestyramine binds many medications in the GI tract, reducing their absorption. It should be given 1 hour after other medications." }
    ]
  },

  "cirrhosis-management-rn": {
    title: "Cirrhosis",
    cellular: {
      title: "Hepatic Decompensation and Complications",
      content: "Cirrhosis represents irreversible hepatic fibrosis where regenerative nodules replace normal lobular architecture. Portal hypertension develops when fibrotic tissue increases intrahepatic vascular resistance (sinusoidal pressure >5 mmHg gradient). This drives formation of portosystemic collaterals, most dangerously esophageal varices. Decreased hepatocyte mass reduces albumin synthesis (oncotic pressure falls, causing ascites and edema), clotting factor production (coagulopathy), bile conjugation (jaundice), and ammonia metabolism to urea (hepatic encephalopathy). Hepatorenal syndrome occurs when severe portal hypertension causes splanchnic vasodilation, reducing effective circulating volume and triggering renal vasoconstriction. The nurse must manage fluid overload with diuretics, titrate lactulose for encephalopathy, monitor for variceal hemorrhage, coordinate paracentesis, and implement bleeding precautions."
    },
    riskFactors: [
      "Chronic hepatitis C (leading cause requiring transplant)",
      "Alcohol-associated liver disease",
      "Non-alcoholic steatohepatitis (NASH)",
      "Chronic hepatitis B",
      "Primary biliary cholangitis",
      "Hemochromatosis",
      "Wilson disease",
      "Alpha-1 antitrypsin deficiency"
    ],
    diagnostics: [
      "Evaluate LFTs: elevated AST/ALT (AST:ALT ratio >2 suggests alcoholic etiology), elevated bilirubin, decreased albumin",
      "Monitor PT/INR for coagulopathy (INR >1.5 indicates significant synthetic dysfunction)",
      "Calculate MELD score (Model for End-Stage Liver Disease) using bilirubin, INR, creatinine",
      "Assess serum ammonia level for hepatic encephalopathy (correlate with clinical grade)",
      "Monitor CBC for thrombocytopenia (splenic sequestration) and anemia",
      "Evaluate renal function (creatinine, BUN) for hepatorenal syndrome",
      "Assess diagnostic paracentesis fluid: cell count, albumin, culture for spontaneous bacterial peritonitis",
      "Order upper endoscopy for variceal screening"
    ],
    management: [
      "Administer spironolactone (100 mg) and furosemide (40 mg) in 100:40 ratio for ascites management",
      "Implement sodium restriction (<2 g/day) for ascites control",
      "Titrate lactulose to achieve 2-3 soft stools per day for hepatic encephalopathy",
      "Add rifaximin 550 mg BID as adjunctive therapy for encephalopathy prevention",
      "Coordinate therapeutic paracentesis for tense ascites; administer albumin replacement (6-8 g per liter removed if >5L)",
      "Implement bleeding precautions: soft toothbrush, electric razor, avoid IM injections",
      "Administer propranolol or nadolol for primary/secondary prophylaxis of variceal bleeding",
      "Coordinate urgent endoscopy with band ligation for acute variceal hemorrhage"
    ],
    nursingActions: [
      "Assess neurological status using West Haven criteria for hepatic encephalopathy grading",
      "Monitor strict I&O, daily weights, and abdominal girth measurements",
      "Implement fall precautions due to encephalopathy, coagulopathy, and ascites-related mobility changes",
      "Assess for signs of variceal bleeding: hematemesis, melena, tachycardia, hypotension",
      "Provide post-paracentesis monitoring: vital signs, drainage amount, albumin administration",
      "Implement dietary education: sodium restriction, adequate protein (1-1.5 g/kg unless grade 3-4 encephalopathy)",
      "Coordinate hepatology referral for transplant evaluation when MELD ≥15",
      "Monitor for spontaneous bacterial peritonitis: fever, abdominal pain, worsening encephalopathy in ascitic patients"
    ],
    signs: {
      left: [
        "Jaundice and scleral icterus",
        "Ascites (fluid wave, shifting dullness)",
        "Spider angiomas on chest and face",
        "Palmar erythema",
        "Gynecomastia and testicular atrophy",
        "Caput medusae",
        "Fetor hepaticus"
      ],
      right: [
        "Esophageal variceal hemorrhage",
        "Hepatic encephalopathy (asterixis, confusion, coma)",
        "Hepatorenal syndrome (oliguria, rising creatinine)",
        "Spontaneous bacterial peritonitis",
        "Hepatopulmonary syndrome",
        "Portal hypertensive gastropathy",
        "Hepatocellular carcinoma"
      ]
    },
    medications: [
      { name: "Lactulose", type: "Osmotic laxative/ammonia reducer", action: "Acidifies colonic pH converting ammonia to non-absorbable ammonium; osmotic effect increases fecal excretion", sideEffects: "Diarrhea, dehydration, electrolyte imbalances, flatulence", contra: "Galactosemia, bowel obstruction", pearl: "Titrate to 2-3 soft stools/day. Can be given via NG tube or retention enema for acute encephalopathy. Monitor for dehydration and hypokalemia." },
      { name: "Rifaximin (Xifaxan)", type: "Non-absorbable antibiotic", action: "Reduces ammonia-producing gut bacteria without systemic absorption", sideEffects: "Flatulence, headache, abdominal pain", contra: "Hypersensitivity to rifamycins", pearl: "550 mg BID as adjunctive therapy with lactulose for prevention of recurrent hepatic encephalopathy. Reduces recurrence by 50%." },
      { name: "Spironolactone", type: "Aldosterone antagonist", action: "Blocks aldosterone in the distal tubule, promoting sodium and water excretion while retaining potassium", sideEffects: "Hyperkalemia, gynecomastia, GI upset", contra: "K+ >5.5, severe renal failure, Addison disease", pearl: "First-line diuretic for cirrhotic ascites. Use 100:40 mg ratio with furosemide. Goal weight loss: 0.5 kg/day without edema, 1 kg/day with edema." },
      { name: "Octreotide", type: "Somatostatin analogue", action: "Reduces splanchnic blood flow and portal pressure, controls variceal bleeding", sideEffects: "Hyperglycemia, bradycardia, abdominal pain", contra: "Hypersensitivity", pearl: "IV bolus 50 mcg then 50 mcg/hr infusion for acute variceal hemorrhage. Continue for 3-5 days. Bridge to endoscopic band ligation." }
    ],
    pearls: [
      "The spironolactone:furosemide ratio of 100:40 mg maintains potassium balance in cirrhotic ascites",
      "Protein restriction is no longer recommended for most encephalopathy patients; adequate protein intake improves outcomes",
      "When removing >5L during paracentesis, administer 6-8 g albumin per liter removed to prevent post-paracentesis circulatory dysfunction",
      "Rifaximin plus lactulose reduces hepatic encephalopathy recurrence by approximately 50% compared to lactulose alone",
      "MELD score ≥15 warrants referral for liver transplant evaluation"
    ],
    quiz: [
      { question: "What is the recommended diuretic ratio for management of cirrhotic ascites?", options: ["Furosemide 100 mg : spironolactone 40 mg", "Spironolactone 100 mg : furosemide 40 mg", "Equal doses of both", "Spironolactone alone without furosemide"], correct: 1, rationale: "The 100:40 ratio of spironolactone to furosemide is recommended to maintain potassium balance while promoting natriuresis in cirrhotic ascites." },
      { question: "During a large-volume paracentesis removing 7 liters, what should be administered?", options: ["IV normal saline bolus", "IV albumin 6-8 g per liter removed", "Packed red blood cells", "Fresh frozen plasma"], correct: 1, rationale: "When >5 liters are removed during paracentesis, IV albumin (6-8 g per liter) should be given to prevent post-paracentesis circulatory dysfunction." },
      { question: "A patient with cirrhosis develops fever, abdominal pain, and worsening confusion with ascites. What complication should the nurse suspect?", options: ["Hepatorenal syndrome", "Spontaneous bacterial peritonitis", "Esophageal variceal rupture", "Portal vein thrombosis"], correct: 1, rationale: "Fever, abdominal pain, and worsening encephalopathy in a patient with ascites are classic indicators of spontaneous bacterial peritonitis, which requires diagnostic paracentesis and empiric antibiotics." }
    ]
  },

  "cirrhosis-management-np": {
    title: "Cirrhosis",
    cellular: {
      title: "Hepatology and Decompensation Management",
      content: "Cirrhosis represents the final common pathway of chronic liver injury, characterized by diffuse fibrosis, regenerative nodules, and distortion of hepatic vasculature. The hepatic stellate cell is the key mediator of fibrogenesis, transforming from a quiescent vitamin A-storing cell to an activated myofibroblast that produces excess collagen. Portal hypertension develops when the hepatic venous pressure gradient (HVPG) exceeds 5 mmHg; clinically significant portal hypertension occurs at ≥10 mmHg, and variceal hemorrhage risk increases at ≥12 mmHg. Decompensation is defined by the development of ascites, variceal hemorrhage, encephalopathy, or jaundice. The clinician must calculate MELD-Na scores for transplant prioritization, prescribe evidence-based pharmacotherapy for each complication, manage primary and secondary variceal prophylaxis, initiate SBP prophylaxis, and coordinate multidisciplinary hepatology care including transplant evaluation."
    },
    riskFactors: [
      "Chronic hepatitis C (most common indication for liver transplant historically)",
      "Alcohol-associated liver disease (rising prevalence)",
      "NASH/metabolic-associated steatotic liver disease (fastest growing etiology)",
      "Chronic hepatitis B (preventable with vaccination)",
      "Autoimmune hepatitis",
      "Primary biliary cholangitis/Primary sclerosing cholangitis",
      "Hereditary hemochromatosis (iron overload)",
      "Wilson disease (copper overload)"
    ],
    diagnostics: [
      "Calculate MELD-Na score (bilirubin, INR, creatinine, sodium) for transplant prioritization",
      "Order liver biopsy or FibroScan (transient elastography) for staging fibrosis",
      "Order hepatic venous pressure gradient (HVPG) measurement if clinically indicated",
      "Order upper endoscopy for variceal screening at diagnosis of cirrhosis and every 2-3 years if none found",
      "Order AFP and liver ultrasound every 6 months for hepatocellular carcinoma surveillance",
      "Order diagnostic paracentesis for new-onset ascites: cell count with differential, albumin, total protein, culture",
      "Calculate serum-ascites albumin gradient (SAAG ≥11 g/L confirms portal hypertension)",
      "Order serum ammonia, but correlate with clinical presentation for encephalopathy management"
    ],
    management: [
      "Prescribe non-selective beta-blocker (propranolol or nadolol, target HR 55-60) for primary variceal prophylaxis",
      "Consider carvedilol 6.25-12.5 mg/day as alternative NSBB with greater portal pressure reduction",
      "Prescribe spironolactone 100 mg + furosemide 40 mg daily for ascites; titrate by doubling doses every 3-5 days (max spironolactone 400 mg, furosemide 160 mg)",
      "Prescribe norfloxacin 400 mg daily for SBP prophylaxis in high-risk patients (prior SBP, ascitic protein <15 g/L with renal impairment)",
      "Prescribe lactulose + rifaximin 550 mg BID for secondary prevention of hepatic encephalopathy",
      "Order TIPS (transjugular intrahepatic portosystemic shunt) evaluation for refractory ascites or recurrent variceal bleeding",
      "Initiate hepatocellular carcinoma surveillance with ultrasound and AFP every 6 months",
      "Refer for liver transplant evaluation when MELD-Na ≥15 or first episode of decompensation"
    ],
    nursingActions: [
      "Classify cirrhosis as compensated vs. decompensated and document Child-Pugh score at each visit",
      "Screen for minimal hepatic encephalopathy using psychometric testing (Stroop, animal naming)",
      "Monitor medication safety: avoid hepatotoxins (acetaminophen >2g/day, NSAIDs, sedatives)",
      "Prescribe vaccination schedule: hepatitis A and B, pneumococcal, influenza",
      "Screen for malnutrition using validated tools; prescribe high-protein diet (1.2-1.5 g/kg/day)",
      "Coordinate multidisciplinary care: hepatology, nutrition, addiction medicine, social work, transplant team",
      "Monitor for sarcopenia and prescribe exercise and branched-chain amino acid supplementation",
      "Prescribe zinc supplementation (220 mg BID) as adjunct for hepatic encephalopathy"
    ],
    signs: {
      left: [
        "Jaundice, scleral icterus",
        "Ascites (SAAG ≥11 g/L)",
        "Spider angiomas, palmar erythema",
        "Thrombocytopenia (<150,000)",
        "Elevated INR (>1.5)",
        "Hypoalbuminemia (<35 g/L)",
        "Elevated bilirubin"
      ],
      right: [
        "Variceal hemorrhage (HVPG ≥12 mmHg)",
        "Hepatic encephalopathy (West Haven grade 1-4)",
        "Hepatorenal syndrome (type 1 and type 2)",
        "Spontaneous bacterial peritonitis",
        "Hepatocellular carcinoma",
        "Hepatopulmonary syndrome (platypnea-orthodeoxia)",
        "Portopulmonary hypertension"
      ]
    },
    medications: [
      { name: "Carvedilol", type: "Non-selective beta-blocker", action: "Blocks beta-1, beta-2, and alpha-1 receptors, reducing portal pressure more effectively than propranolol", sideEffects: "Hypotension, bradycardia, fatigue, dizziness", contra: "SBP <90, HR <50, refractory ascites, hepatorenal syndrome, SBP", pearl: "6.25-12.5 mg daily. Greater HVPG reduction than propranolol. Discontinue if SBP develops, refractory ascites occurs, or SBP <90. NSBB window concept: beneficial in compensated cirrhosis, potentially harmful in advanced decompensation." },
      { name: "Rifaximin", type: "Non-absorbable antibiotic", action: "Alters gut microbiome, reducing ammonia-producing bacteria without systemic absorption", sideEffects: "Flatulence, headache, nausea", contra: "Rifamycin hypersensitivity", pearl: "550 mg BID with lactulose for secondary prevention of hepatic encephalopathy. Reduces recurrence by 50% and hospitalizations by 50%. Minimal drug interactions due to no systemic absorption." },
      { name: "Albumin (25%)", type: "Plasma volume expander", action: "Increases intravascular oncotic pressure, prevents circulatory dysfunction after large-volume paracentesis", sideEffects: "Fluid overload, allergic reactions, fever", contra: "Severe heart failure", pearl: "8 g per liter removed when >5L paracentesis. Also used in SBP treatment (1.5 g/kg day 1, 1 g/kg day 3) and hepatorenal syndrome (with vasopressors)." },
      { name: "Terlipressin", type: "Vasopressin analogue", action: "Splanchnic vasoconstriction improves effective circulating volume and renal perfusion in hepatorenal syndrome", sideEffects: "Abdominal cramping, peripheral ischemia, cardiac arrhythmias", contra: "Coronary artery disease, peripheral vascular disease", pearl: "First FDA-approved treatment for hepatorenal syndrome type 1. Combine with IV albumin. Monitor for ischemic complications." }
    ],
    pearls: [
      "MELD-Na score determines transplant priority; recalculate at every visit for decompensated patients",
      "SAAG ≥11 g/L (1.1 g/dL) confirms portal hypertension as the cause of ascites",
      "The NSBB window: beta-blockers are beneficial for variceal prophylaxis but may be harmful in patients with SBP, refractory ascites, or severe hypotension",
      "SBP diagnosis: ascitic fluid PMN count ≥250 cells/mm3 warrants empiric cefotaxime even before culture results",
      "Hepatocellular carcinoma surveillance (US + AFP every 6 months) is mandatory in all cirrhotics regardless of etiology"
    ],
    quiz: [
      { question: "A patient with cirrhosis has ascitic fluid analysis showing PMN count of 300 cells/mm3. What is the most appropriate action?", options: ["Repeat paracentesis in 48 hours", "Start empiric cefotaxime and IV albumin", "Increase diuretic doses", "Order CT abdomen"], correct: 1, rationale: "Ascitic fluid PMN ≥250 cells/mm3 is diagnostic of spontaneous bacterial peritonitis. Empiric cefotaxime should be started immediately along with IV albumin to prevent hepatorenal syndrome." },
      { question: "When should non-selective beta-blockers be discontinued in a cirrhotic patient?", options: ["When heart rate drops below 70 bpm", "When SBP occurs, refractory ascites develops, or SBP <90 mmHg", "After 6 months of therapy", "When varices are no longer present on endoscopy"], correct: 1, rationale: "The NSBB window concept indicates that beta-blockers should be discontinued when patients develop SBP, refractory ascites, or hypotension (SBP <90), as they may worsen hemodynamics in advanced decompensation." },
      { question: "What is the recommended hepatocellular carcinoma surveillance protocol for patients with cirrhosis?", options: ["Annual CT abdomen", "MRI every 2 years", "Liver ultrasound and AFP every 6 months", "CT and AFP annually"], correct: 2, rationale: "All patients with cirrhosis should undergo hepatocellular carcinoma surveillance with liver ultrasound and serum AFP every 6 months, regardless of etiology." }
    ]
  },

  "chronic-kidney-disease-rpn": {
    title: "Chronic Kidney Disease",
    cellular: {
      title: "Progressive Nephron Loss",
      content: "Chronic kidney disease (CKD) is the progressive and irreversible loss of kidney function over months to years. As nephrons are destroyed, the remaining nephrons undergo compensatory hyperfiltration, which initially maintains function but eventually accelerates further damage. The kidneys lose their ability to filter waste products, regulate fluid and electrolytes, produce erythropoietin (causing anemia), activate vitamin D (causing bone disease), and maintain acid-base balance. Hyperkalemia, fluid overload, and uremia develop as GFR declines. The nurse monitors vital signs, dietary compliance, fluid balance, and reports changes in the patient's condition."
    },
    riskFactors: [
      "Diabetes mellitus (most common cause)",
      "Hypertension (second most common cause)",
      "Glomerulonephritis",
      "Polycystic kidney disease",
      "Recurrent pyelonephritis",
      "Prolonged NSAID use",
      "Lupus nephritis",
      "Family history of CKD"
    ],
    diagnostics: [
      "Monitor vital signs and report hypertension",
      "Monitor and report daily weights and fluid intake/output",
      "Report signs of fluid overload: edema, dyspnea, crackles",
      "Monitor for signs of hyperkalemia: muscle weakness, irregular pulse",
      "Report changes in urine output or appearance",
      "Monitor for signs of uremia: confusion, nausea, pruritus"
    ],
    management: [
      "Assist with dietary restrictions as ordered: low sodium, low potassium, low phosphorus",
      "Monitor fluid intake restrictions as ordered",
      "Administer medications as ordered",
      "Report signs of electrolyte imbalance",
      "Encourage compliance with diet and medication regimen",
      "Assist with dialysis access site care as directed"
    ],
    nursingActions: [
      "Monitor daily weights at the same time each day and report significant changes",
      "Assess for peripheral edema, periorbital edema, and signs of fluid overload",
      "Monitor for hyperkalemia signs: muscle weakness, paresthesias, irregular pulse",
      "Reinforce dietary teaching: avoid high-potassium foods (bananas, oranges, tomatoes, potatoes)",
      "Avoid salt substitutes (contain potassium chloride)",
      "Protect dialysis access (AV fistula/graft): no BP, venipuncture, or restrictive clothing on that arm",
      "Assess for signs of uremia: metallic taste, nausea, pruritus, fatigue, confusion"
    ],
    signs: {
      left: [
        "Fatigue and weakness",
        "Decreased urine output",
        "Peripheral and periorbital edema",
        "Hypertension",
        "Nausea, anorexia, metallic taste",
        "Pruritus",
        "Pallor (anemia)"
      ],
      right: [
        "Hyperkalemia (cardiac arrhythmias)",
        "Fluid overload (pulmonary edema)",
        "Uremic encephalopathy (confusion, seizures)",
        "Metabolic acidosis",
        "Uremic pericarditis",
        "Renal osteodystrophy"
      ]
    },
    medications: [
      { name: "Calcium Carbonate (Tums)", type: "Phosphate binder", action: "Binds dietary phosphorus in the GI tract preventing absorption", sideEffects: "Constipation, hypercalcemia", contra: "Hypercalcemia", pearl: "Must be taken with meals to bind phosphorus in food. Administer as ordered and monitor calcium levels." },
      { name: "Epoetin Alfa (Epogen)", type: "Erythropoiesis-stimulating agent", action: "Stimulates red blood cell production to treat anemia of CKD", sideEffects: "Hypertension, headache, thrombotic events", contra: "Uncontrolled hypertension, pure red cell aplasia", pearl: "Administer as ordered. Monitor blood pressure as it can worsen hypertension. Report headache or vision changes." }
    ],
    pearls: [
      "Never take blood pressure, draw blood, or start an IV on the arm with a dialysis access",
      "Salt substitutes contain potassium chloride and can cause dangerous hyperkalemia in CKD patients",
      "Monitor for a thrill (vibration) and bruit (whooshing sound) at the AV fistula site to confirm patency",
      "Fluid intake includes all liquids: popsicles, gelatin, ice cream, and soup"
    ],
    quiz: [
      { question: "A patient with CKD asks about using a salt substitute. What should the nurse advise?", options: ["Salt substitutes are a healthy alternative", "Avoid salt substitutes as they contain potassium chloride", "Use half the amount of regular salt", "Salt substitutes are safe in small amounts"], correct: 1, rationale: "Salt substitutes typically contain potassium chloride, which can cause hyperkalemia in CKD patients who already have impaired potassium excretion." },
      { question: "Which action is contraindicated on the arm with an AV fistula?", options: ["Palpating for a thrill", "Taking blood pressure", "Encouraging hand exercises", "Assessing skin temperature"], correct: 1, rationale: "Blood pressure measurements, venipuncture, and IV insertion are contraindicated on the arm with a dialysis access to prevent damage to the fistula or graft." },
      { question: "Which food should a CKD patient avoid due to high potassium content?", options: ["Apples", "White rice", "Bananas", "Green beans"], correct: 2, rationale: "Bananas are high in potassium and should be avoided by CKD patients who are on potassium restriction to prevent hyperkalemia." }
    ]
  },

  "chronic-kidney-disease-rn": {
    title: "Chronic Kidney Disease",
    cellular: {
      title: "Nephron Loss and Systemic Complications",
      content: "Chronic kidney disease involves progressive destruction of nephrons from sustained glomerular and tubulointerstitial injury. As GFR declines, the kidneys lose the ability to excrete nitrogenous waste (uremia), regulate electrolytes (hyperkalemia, hyperphosphatemia, hypocalcemia), maintain fluid balance (volume overload), produce erythropoietin (normocytic normochromic anemia), and activate vitamin D to calcitriol (secondary hyperparathyroidism and renal osteodystrophy). CKD is staged by GFR: Stage 1 (≥90, with kidney damage), Stage 2 (60-89), Stage 3a (45-59), Stage 3b (30-44), Stage 4 (15-29), Stage 5 (<15, kidney failure). The nurse must manage complex medication regimens, monitor for electrolyte derangements, implement dietary and fluid restrictions, assess dialysis access patency, and provide comprehensive patient education."
    },
    riskFactors: [
      "Diabetes mellitus (leading cause, 44% of new ESKD cases)",
      "Hypertension (second leading cause, 28%)",
      "Glomerulonephritis",
      "Polycystic kidney disease",
      "Prolonged nephrotoxic medication use (NSAIDs, aminoglycosides)",
      "Recurrent urinary tract infections/pyelonephritis",
      "Lupus nephritis",
      "Obesity and metabolic syndrome"
    ],
    diagnostics: [
      "Monitor serum creatinine and calculate estimated GFR (eGFR) for staging",
      "Evaluate BMP: potassium (hyperkalemia risk), sodium, bicarbonate (metabolic acidosis), BUN",
      "Monitor phosphorus (elevated) and calcium (decreased) levels",
      "Assess PTH level for secondary hyperparathyroidism",
      "Monitor hemoglobin/hematocrit for anemia of CKD",
      "Evaluate urine albumin-to-creatinine ratio (UACR) for proteinuria",
      "Monitor lipid panel (CKD increases cardiovascular risk)",
      "Assess iron studies (ferritin, TSAT) before starting ESA therapy"
    ],
    management: [
      "Implement dietary restrictions: sodium <2 g/day, potassium restriction per GFR stage, low phosphorus",
      "Restrict protein to 0.8 g/kg/day in non-dialysis CKD; increase to 1.2 g/kg/day on hemodialysis",
      "Administer phosphate binders with meals (calcium carbonate, sevelamer, or lanthanum)",
      "Administer erythropoiesis-stimulating agents (ESA) for Hgb <10 g/dL with iron repletion first",
      "Administer active vitamin D (calcitriol) or vitamin D analogues for secondary hyperparathyroidism",
      "Manage hypertension with ACE inhibitors or ARBs (renoprotective; target BP <130/80)",
      "Coordinate vascular access placement (AV fistula preferred) at Stage 4 for hemodialysis preparation",
      "Initiate dialysis discussions at Stage 4 and plan modality (hemodialysis vs. peritoneal dialysis)"
    ],
    nursingActions: [
      "Perform comprehensive assessment: vital signs, daily weight, I&O, edema, lung sounds",
      "Assess AV fistula/graft every shift: palpate for thrill, auscultate for bruit, assess for infection",
      "Monitor potassium levels and assess for signs of hyperkalemia: peaked T waves on ECG, muscle weakness",
      "Administer sodium polystyrene sulfonate (Kayexalate) as prescribed for hyperkalemia",
      "Implement fluid restriction as ordered; help patient plan fluid distribution throughout the day",
      "Educate on dietary modifications: provide lists of high-potassium and high-phosphorus foods to avoid",
      "Monitor for uremic symptoms: pericardial friction rub, Kussmaul respirations, uremic frost, confusion",
      "Coordinate with nephrology, dietitian, and social work for comprehensive CKD management"
    ],
    signs: {
      left: [
        "Decreased GFR and elevated creatinine/BUN",
        "Hypertension and fluid overload",
        "Peripheral and periorbital edema",
        "Anemia (pallor, fatigue, dyspnea on exertion)",
        "Nausea, anorexia, metallic taste",
        "Pruritus and dry skin",
        "Muscle cramps"
      ],
      right: [
        "Hyperkalemia with ECG changes (peaked T waves, widened QRS)",
        "Pulmonary edema from fluid overload",
        "Uremic pericarditis (friction rub, chest pain)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Renal osteodystrophy (bone pain, fractures)",
        "Uremic encephalopathy (confusion, seizures, coma)",
        "Uremic frost (rare, late finding)"
      ]
    },
    medications: [
      { name: "Sevelamer (Renagel)", type: "Non-calcium phosphate binder", action: "Binds dietary phosphorus in the GI tract without adding calcium load", sideEffects: "Nausea, constipation, flatulence", contra: "Bowel obstruction, hypophosphatemia", pearl: "Preferred over calcium-based binders to avoid vascular calcification. Must be taken with meals for effectiveness. Monitor phosphorus levels." },
      { name: "Epoetin Alfa (Epogen)", type: "Erythropoiesis-stimulating agent", action: "Stimulates erythropoiesis by mimicking endogenous erythropoietin", sideEffects: "Hypertension (most common), headache, thrombotic events, pure red cell aplasia", contra: "Uncontrolled hypertension, Hgb >11 g/dL", pearl: "Target Hgb 10-11 g/dL; do not exceed 11 g/dL (increased cardiovascular risk). Ensure adequate iron stores before starting (ferritin >100, TSAT >20%)." },
      { name: "Calcitriol", type: "Active vitamin D", action: "Increases intestinal calcium absorption and suppresses PTH secretion", sideEffects: "Hypercalcemia, hyperphosphatemia", contra: "Hypercalcemia, vitamin D toxicity", pearl: "Monitor calcium and phosphorus closely. The calcium × phosphorus product should not exceed 55 to prevent metastatic calcification." },
      { name: "Sodium Bicarbonate", type: "Alkalinizing agent", action: "Corrects metabolic acidosis by buffering hydrogen ions", sideEffects: "Fluid retention, metabolic alkalosis, hypokalemia", contra: "Severe pulmonary edema, hypocalcemia", pearl: "Used for chronic metabolic acidosis when bicarbonate consistently <22 mEq/L. May slow CKD progression." }
    ],
    pearls: [
      "ACE inhibitors and ARBs are renoprotective but require monitoring of potassium and creatinine (acceptable 30% rise in creatinine)",
      "ESA target hemoglobin is 10-11 g/dL; exceeding 11 increases stroke, MI, and thrombotic event risk",
      "AV fistula is preferred vascular access: takes 2-3 months to mature, assess for thrill and bruit",
      "Calcium × phosphorus product >55 increases risk of metastatic calcification (calcium deposits in soft tissues)",
      "Patients on hemodialysis need increased protein (1.2 g/kg/day) to replace losses during dialysis"
    ],
    quiz: [
      { question: "When should phosphate binders be administered to a patient with CKD?", options: ["On an empty stomach in the morning", "With meals", "At bedtime", "Two hours before meals"], correct: 1, rationale: "Phosphate binders must be taken with meals to bind dietary phosphorus in the GI tract and prevent absorption." },
      { question: "What is the target hemoglobin range when using ESA therapy in CKD?", options: ["8-9 g/dL", "10-11 g/dL", "12-13 g/dL", "14-15 g/dL"], correct: 1, rationale: "The target hemoglobin for ESA therapy is 10-11 g/dL. Exceeding 11 g/dL increases the risk of cardiovascular events including stroke and MI." },
      { question: "The nurse assesses a patient's AV fistula and cannot palpate a thrill or hear a bruit. What is the priority action?", options: ["Apply warm compresses", "Notify the provider immediately", "Elevate the arm", "Take blood pressure on that arm"], correct: 1, rationale: "Absence of thrill and bruit indicates fistula thrombosis or failure, which requires immediate provider notification for urgent intervention." }
    ]
  },

  "chronic-kidney-disease-np": {
    title: "Chronic Kidney Disease",
    cellular: {
      title: "Nephrology and Evidence-Based CKD Management",
      content: "Chronic kidney disease involves progressive glomerulosclerosis, tubulointerstitial fibrosis, and vascular injury driven by the final common pathways of hyperfiltration, proteinuria, and inflammation. The RAAS plays a central role: angiotensin II increases glomerular efferent arteriolar tone, raising intraglomerular pressure and accelerating nephron damage. ACE inhibitors/ARBs reduce intraglomerular pressure and proteinuria, slowing progression. SGLT2 inhibitors provide additional nephroprotection through tubuloglomerular feedback restoration, reducing hyperfiltration. As GFR declines, secondary complications develop: anemia from reduced erythropoietin, mineral bone disease (CKD-MBD) from phosphate retention and vitamin D deficiency driving secondary hyperparathyroidism, metabolic acidosis from impaired acid excretion, and cardiovascular disease (the leading cause of death in CKD). The clinician must initiate nephroprotective therapy, manage CKD-MBD, prescribe ESAs with iron optimization, plan renal replacement therapy, and coordinate transplant referral."
    },
    riskFactors: [
      "Diabetic nephropathy (most common cause of ESKD globally)",
      "Hypertensive nephrosclerosis",
      "Glomerulonephritis (IgA nephropathy most common worldwide)",
      "Autosomal dominant polycystic kidney disease",
      "Chronic nephrotoxin exposure (NSAIDs, lithium, calcineurin inhibitors)",
      "Lupus nephritis",
      "Obstructive uropathy",
      "Low birth weight/reduced nephron mass"
    ],
    diagnostics: [
      "Order and trend eGFR using CKD-EPI equation for accurate staging",
      "Order urine albumin-to-creatinine ratio (UACR) to quantify proteinuria (A1 <30, A2 30-300, A3 >300 mg/g)",
      "Order comprehensive metabolic panel with special attention to potassium, bicarbonate, calcium, phosphorus",
      "Order intact PTH level (target varies by CKD stage; 2-9x upper limit of normal for Stage 5)",
      "Order 25-hydroxyvitamin D level and replete if <30 ng/mL",
      "Order iron studies (ferritin, TSAT) before initiating ESA: target ferritin >100 (>200 on HD), TSAT >20%",
      "Order lipid panel for cardiovascular risk assessment",
      "Order renal ultrasound to assess kidney size, cortical thickness, and rule out obstruction"
    ],
    management: [
      "Prescribe ACE inhibitor or ARB for all CKD patients with albuminuria (UACR >30); titrate to maximum tolerated dose",
      "Prescribe SGLT2 inhibitor (dapagliflozin or empagliflozin) for CKD with eGFR ≥20 regardless of diabetes status (DAPA-CKD, EMPA-KIDNEY trials)",
      "Prescribe finerenone (non-steroidal MRA) for diabetic CKD with persistent albuminuria on max ACEi/ARB",
      "Manage CKD-MBD: phosphate binders with meals, calcitriol or active vitamin D analogue, cinacalcet for uncontrolled hyperparathyroidism",
      "Prescribe ESA (epoetin or darbepoetin) when Hgb <10 g/dL after iron optimization; target 10-11 g/dL",
      "Prescribe IV iron (ferric carboxymaltose or iron sucrose) when ferritin <100 or TSAT <20%",
      "Prescribe sodium bicarbonate for chronic metabolic acidosis (serum bicarbonate <22 mEq/L)",
      "Refer for AV fistula creation when eGFR <20 or expected to need dialysis within 12 months"
    ],
    nursingActions: [
      "Classify CKD by cause, GFR category (G1-G5), and albuminuria category (A1-A3) using KDIGO framework",
      "Optimize cardiovascular risk: prescribe statin for all CKD patients >50 years (SHARP trial)",
      "Manage diabetes with individualized HbA1c target (generally <7% but individualize in advanced CKD)",
      "Prescribe blood pressure target <130/80 using ACEi/ARB as first-line",
      "Monitor for ACEi/ARB adverse effects: hyperkalemia (tolerate K+ up to 5.5), creatinine rise (tolerate up to 30%)",
      "Coordinate nephrology referral at eGFR <30 and transplant evaluation at eGFR <20",
      "Prescribe dietary counseling: sodium <2 g/day, potassium individualized, protein 0.8 g/kg/day pre-dialysis",
      "Review and adjust all medications for renal dosing at each visit"
    ],
    signs: {
      left: [
        "Declining eGFR trend",
        "Increasing proteinuria (UACR)",
        "Hypertension resistant to treatment",
        "Anemia unresponsive to iron alone",
        "Elevated phosphorus and PTH",
        "Metabolic acidosis (low bicarbonate)",
        "Hyperkalemia"
      ],
      right: [
        "Cardiovascular events (leading cause of death in CKD)",
        "Uremic syndrome (pericarditis, encephalopathy, neuropathy)",
        "Severe hyperkalemia with cardiac arrhythmias",
        "Renal osteodystrophy and calciphylaxis",
        "Volume overload refractory to diuretics",
        "Malnutrition-inflammation-atherosclerosis syndrome",
        "Dialysis disequilibrium syndrome"
      ]
    },
    medications: [
      { name: "Dapagliflozin (Farxiga)", type: "SGLT2 inhibitor", action: "Restores tubuloglomerular feedback, reducing glomerular hyperfiltration and intraglomerular pressure; anti-inflammatory and anti-fibrotic effects", sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA", contra: "eGFR <20 (for initiation), type 1 diabetes, prior DKA", pearl: "DAPA-CKD trial: 39% reduction in sustained eGFR decline, ESKD, or renal/cardiovascular death regardless of diabetes. Continue until dialysis or transplant. Expect initial eGFR dip of 3-5 (hemodynamic, not structural)." },
      { name: "Finerenone (Kerendia)", type: "Non-steroidal MRA", action: "Selectively blocks mineralocorticoid receptor, reducing inflammation and fibrosis in the kidney and heart", sideEffects: "Hyperkalemia (monitor K+ closely), hypotension", contra: "K+ >5.0, eGFR <25, severe hepatic impairment, concurrent strong CYP3A4 inhibitors", pearl: "FIDELIO-DKD and FIGARO-DKD trials showed renal and cardiovascular benefit in diabetic CKD. Add to max-dose ACEi/ARB and SGLT2i. Non-steroidal = less hyperkalemia risk than spironolactone." },
      { name: "Darbepoetin Alfa (Aranesp)", type: "Long-acting ESA", action: "Stimulates erythropoiesis with longer half-life than epoetin, allowing less frequent dosing", sideEffects: "Hypertension, thrombotic events, pure red cell aplasia (rare)", contra: "Uncontrolled hypertension, Hgb >11 g/dL", pearl: "Longer half-life allows every 2-4 week dosing vs. weekly epoetin. Target Hgb 10-11 g/dL. Optimize iron first (ferritin >100, TSAT >20%). ESA hyporesponsiveness workup: iron deficiency, infection, malignancy." },
      { name: "Cinacalcet (Sensipar)", type: "Calcimimetic", action: "Activates calcium-sensing receptor on parathyroid gland, reducing PTH secretion", sideEffects: "Nausea, vomiting, hypocalcemia, QT prolongation", contra: "Serum calcium <8.4 mg/dL", pearl: "Used for secondary hyperparathyroidism refractory to vitamin D and phosphate binders. Monitor calcium closely; do not initiate if calcium <8.4. Reduces PTH, calcium, and phosphorus simultaneously." }
    ],
    pearls: [
      "SGLT2 inhibitors are now recommended for ALL CKD patients with eGFR ≥20 regardless of diabetes status (KDIGO 2024)",
      "The initial eGFR dip (3-5 mL/min) with SGLT2 inhibitors is hemodynamic, not structural damage; long-term trajectory improves",
      "Finerenone provides additional cardiorenal protection on top of ACEi/ARB + SGLT2i in diabetic CKD",
      "ESA hyporesponsiveness: most common cause is iron deficiency; also consider infection, malignancy, aluminum toxicity, hyperparathyroidism",
      "Cardiovascular disease is the leading cause of death in CKD patients at every stage, not ESKD itself"
    ],
    quiz: [
      { question: "Which medication class provides nephroprotection in CKD regardless of diabetes status?", options: ["Calcium channel blockers", "SGLT2 inhibitors", "Thiazide diuretics", "Statins"], correct: 1, rationale: "SGLT2 inhibitors (dapagliflozin, empagliflozin) have demonstrated nephroprotective effects in CKD patients regardless of diabetes status, as shown in the DAPA-CKD and EMPA-KIDNEY trials." },
      { question: "An NP starts dapagliflozin for a CKD patient. The eGFR drops from 35 to 31 after 2 weeks. What is the appropriate action?", options: ["Discontinue dapagliflozin immediately", "Continue medication; this is an expected hemodynamic effect", "Switch to a different SGLT2 inhibitor", "Add a loop diuretic"], correct: 1, rationale: "An initial eGFR dip of 3-5 mL/min is expected with SGLT2 inhibitors and reflects reduced glomerular hyperfiltration (hemodynamic effect), not structural kidney damage. The long-term trajectory improves." },
      { question: "What is the most common cause of ESA hyporesponsiveness in CKD?", options: ["Aluminum toxicity", "Iron deficiency", "Secondary hyperparathyroidism", "Folate deficiency"], correct: 1, rationale: "Iron deficiency is the most common cause of ESA hyporesponsiveness. Iron stores should be optimized (ferritin >100, TSAT >20%) before and during ESA therapy." }
    ]
  },

  "tonsillectomy-care-rpn": {
    title: "Tonsillectomy Care",
    image: imgTonsillectomy,
    cellular: {
      title: "Tonsil Tissue and Surgical Healing",
      content: "Tonsillectomy is the surgical removal of the palatine tonsils, performed most commonly for recurrent tonsillitis or obstructive sleep apnea in children. The tonsillar fossa is a highly vascular area supplied by branches of the external carotid artery. After surgical excision, a fibrin clot (white eschar) forms over the wound bed and sloughs off naturally over 7-10 days. The greatest risk is post-operative hemorrhage, which can occur within the first 24 hours (primary) or 5-10 days post-operatively (secondary) when the eschar separates. The nurse monitors for bleeding, pain, hydration status, and dietary progression, reporting concerns immediately."
    },
    riskFactors: [
      "Recurrent tonsillitis (≥7 episodes in 1 year, ≥5/year for 2 years, or ≥3/year for 3 years)",
      "Peritonsillar abscess",
      "Obstructive sleep apnea from tonsillar hypertrophy",
      "Young age (most common in pediatric patients)",
      "Bleeding disorders",
      "History of post-operative bleeding"
    ],
    diagnostics: [
      "Monitor vital signs and report tachycardia or hypotension (signs of hemorrhage)",
      "Inspect throat for excessive bleeding or fresh blood",
      "Monitor oral intake and report inability to swallow or excessive drooling",
      "Report frequent swallowing (may indicate posterior bleeding)",
      "Monitor for signs of dehydration: decreased urine output, dry mucous membranes"
    ],
    management: [
      "Maintain patient in lateral or side-lying position to prevent aspiration",
      "Administer pain medications as ordered (avoid aspirin and NSAIDs)",
      "Encourage cool, clear fluids when patient is alert",
      "Progress diet from cool liquids to soft foods as tolerated",
      "Apply ice collar to the neck as ordered for comfort",
      "Administer antiemetics as ordered to prevent vomiting"
    ],
    nursingActions: [
      "Position patient on their side (recovery position) post-operatively to prevent aspiration",
      "Monitor for frequent swallowing, which may indicate bleeding from the posterior oropharynx",
      "Assess for hematemesis or dark brown (coffee-ground) vomit indicating swallowed blood",
      "Encourage oral fluids: cool water, popsicles, gelatin; avoid hot, acidic, or rough-textured foods",
      "Avoid using straws (suction can disrupt the clot)",
      "Report any active bleeding, frequent swallowing, or restlessness immediately",
      "Reinforce activity restrictions: no contact sports or strenuous activity for 7-14 days"
    ],
    signs: {
      left: [
        "Sore throat and ear pain (referred)",
        "Low-grade fever",
        "Halitosis (from healing tissue)",
        "White eschar at surgical site (normal healing)",
        "Decreased oral intake",
        "Mild nausea"
      ],
      right: [
        "Active bleeding from throat",
        "Frequent swallowing (occult bleeding)",
        "Hematemesis or coffee-ground emesis",
        "Tachycardia and restlessness",
        "Hypotension (hemorrhagic shock)",
        "Airway compromise"
      ]
    },
    medications: [
      { name: "Acetaminophen", type: "Non-opioid analgesic/antipyretic", action: "Inhibits prostaglandin synthesis in the CNS for pain relief and fever reduction", sideEffects: "Hepatotoxicity in overdose", contra: "Severe hepatic disease", pearl: "First-line pain management post-tonsillectomy. Avoid aspirin and ibuprofen as they increase bleeding risk. Administer as ordered." },
      { name: "Ondansetron", type: "Antiemetic", action: "Blocks serotonin 5-HT3 receptors to prevent nausea and vomiting", sideEffects: "Headache, constipation", contra: "QT prolongation", pearl: "Preventing vomiting is critical post-tonsillectomy as retching can disrupt the clot and cause hemorrhage." }
    ],
    pearls: [
      "Frequent swallowing in a post-tonsillectomy patient is the earliest sign of bleeding",
      "A white eschar over the tonsil bed is normal healing tissue, not infection",
      "Avoid aspirin and NSAIDs: they inhibit platelet function and increase bleeding risk",
      "The highest risk period for secondary hemorrhage is days 5-10 when the eschar separates"
    ],
    quiz: [
      { question: "What is the earliest sign of post-tonsillectomy hemorrhage?", options: ["Fever", "Frequent swallowing", "Sore throat", "Decreased appetite"], correct: 1, rationale: "Frequent swallowing indicates the patient is swallowing blood from the posterior oropharynx, which is the earliest sign of post-tonsillectomy hemorrhage." },
      { question: "Which position should the nurse place a post-tonsillectomy patient in immediately after surgery?", options: ["Supine", "High Fowler's", "Side-lying (recovery position)", "Trendelenburg"], correct: 2, rationale: "Side-lying (recovery position) prevents aspiration of blood and secretions during the immediate post-operative period." },
      { question: "Which pain medication should be avoided after tonsillectomy?", options: ["Acetaminophen", "Aspirin", "Oral sucrose", "Codeine"], correct: 1, rationale: "Aspirin inhibits platelet aggregation and increases the risk of post-operative hemorrhage. Acetaminophen is the preferred analgesic." }
    ]
  },

  "tonsillectomy-care-rn": {
    title: "Tonsillectomy Care",
    image: imgTonsillectomy,
    cellular: {
      title: "Surgical Hemostasis and Wound Healing",
      content: "Tonsillectomy involves dissection and removal of the palatine tonsils from the pharyngeal musculature. The tonsillar fossa receives its blood supply primarily from the tonsillar branch of the facial artery, ascending pharyngeal artery, and dorsal lingual artery. Intraoperative hemostasis is achieved through electrocautery, suture ligation, or chemical cauterization. A fibrin eschar forms over the wound bed within 24 hours and provides a biological dressing during the 10-14 day healing period. Primary hemorrhage occurs within the first 24 hours from inadequate hemostasis. Secondary hemorrhage occurs at days 5-10 when the eschar separates from the healing granulation tissue below. The nurse must implement comprehensive hemorrhage surveillance, manage multimodal analgesia, ensure adequate hydration, coordinate discharge education, and recognize signs of airway compromise."
    },
    riskFactors: [
      "Recurrent tonsillitis meeting Paradise criteria",
      "Peritonsillar abscess (quinsy)",
      "Obstructive sleep apnea (most common indication in children <3)",
      "Suspected tonsillar malignancy",
      "Coagulation disorders or anticoagulant use",
      "Age >12 (higher bleeding risk than younger children)",
      "Obesity",
      "History of post-tonsillectomy hemorrhage"
    ],
    diagnostics: [
      "Assess vital signs every 15 minutes in the immediate post-operative period, then per protocol",
      "Inspect posterior oropharynx using penlight for active bleeding or excessive clot",
      "Monitor hemoglobin and hematocrit if hemorrhage is suspected",
      "Evaluate swallowing frequency as objective hemorrhage surveillance",
      "Assess hydration status: mucous membranes, urine output, skin turgor",
      "Monitor pulse oximetry for airway adequacy",
      "Evaluate pain using age-appropriate pain scales"
    ],
    management: [
      "Implement multimodal pain management: scheduled acetaminophen ± weight-appropriate opioid",
      "Administer IV fluids until adequate oral intake is established",
      "Advance diet progressively: ice chips → cool clear liquids → soft foods → regular diet over 10-14 days",
      "Avoid hot, acidic, spicy, or crunchy foods during healing",
      "Administer prophylactic antiemetics to prevent vomiting-induced hemorrhage",
      "Apply ice collar to anterior neck for comfort and mild vasoconstriction",
      "Ensure suction equipment is at bedside for airway management",
      "Prepare for possible return to OR if active hemorrhage does not resolve with conservative measures"
    ],
    nursingActions: [
      "Position in lateral recovery position until fully conscious; then elevate HOB",
      "Perform frequent swallowing assessments and oropharyngeal inspection",
      "Monitor for signs of hemorrhage: tachycardia, restlessness, frequent swallowing, hematemesis, pallor",
      "Provide adequate hydration: encourage popsicles, cool fluids, avoid straws",
      "Coordinate discharge education with caregivers: activity restrictions, dietary progression, bleeding precautions",
      "Educate on signs requiring emergency return: active bleeding, inability to swallow, drooling, high fever",
      "Ensure caregivers understand medication schedule: acetaminophen around the clock for first 48-72 hours",
      "Educate on expected findings: white eschar (normal), halitosis (normal), referred ear pain (normal)"
    ],
    signs: {
      left: [
        "Sore throat (expected 7-14 days)",
        "Referred ear pain (CN IX and X)",
        "Low-grade fever (<38.5°C)",
        "Halitosis from fibrin eschar",
        "White/gray eschar on tonsil beds (normal)",
        "Decreased appetite and dysphagia",
        "Uvular edema"
      ],
      right: [
        "Primary hemorrhage (<24 hours post-op)",
        "Secondary hemorrhage (days 5-10)",
        "Hematemesis (bright red or coffee-ground)",
        "Airway obstruction (stridor, desaturation)",
        "Dehydration from poor oral intake",
        "Post-obstructive pulmonary edema (rare)",
        "Velopharyngeal insufficiency (rare, nasal speech)"
      ]
    },
    medications: [
      { name: "Acetaminophen", type: "Non-opioid analgesic", action: "Central inhibition of prostaglandin synthesis for analgesia and antipyresis", sideEffects: "Hepatotoxicity at supratherapeutic doses", contra: "Severe hepatic impairment, acetaminophen allergy", pearl: "Administer around the clock for 48-72 hours post-op. IV formulation used in PACU. Maximum 75 mg/kg/day in pediatrics, 4 g/day in adults." },
      { name: "Oxycodone elixir", type: "Opioid analgesic", action: "Mu-opioid receptor agonist for moderate to severe pain", sideEffects: "Respiratory depression, sedation, constipation, nausea", contra: "Respiratory depression, severe asthma, paralytic ileus", pearl: "Used as adjunct to acetaminophen for breakthrough pain. Use lowest effective dose. Contraindicated in children <12 for tonsillectomy per FDA. Monitor closely for respiratory depression in OSA patients." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces post-operative edema, nausea, and pain", sideEffects: "Hyperglycemia, delayed wound healing, adrenal suppression", contra: "Active infection, uncontrolled diabetes", pearl: "Single intraoperative dose (0.5 mg/kg, max 10 mg) reduces post-operative nausea, vomiting, and pain. May slightly increase bleeding risk but benefit outweighs risk." },
      { name: "Tranexamic Acid", type: "Antifibrinolytic", action: "Inhibits plasminogen activation, stabilizing fibrin clots at the surgical site", sideEffects: "GI upset, rarely thrombotic events", contra: "Active thromboembolic disease, subarachnoid hemorrhage", pearl: "Topical application or oral solution used to reduce post-tonsillectomy bleeding. Evidence supports both intraoperative and post-operative use." }
    ],
    pearls: [
      "Codeine is contraindicated in children <12 undergoing tonsillectomy (FDA Black Box Warning) due to CYP2D6 ultra-rapid metabolism causing fatal respiratory depression",
      "Secondary hemorrhage at days 5-10 occurs when the eschar naturally sloughs; families must be educated to return to ED if bleeding occurs",
      "OSA patients are at higher risk for respiratory depression from opioids; use lowest effective dose with continuous pulse oximetry",
      "Referred ear pain after tonsillectomy is due to shared innervation (CN IX and X) and does not indicate ear infection",
      "Do not mistake the white eschar for infection; it is normal fibrin formation and will resolve in 10-14 days"
    ],
    quiz: [
      { question: "A child returns to the ED on post-operative day 7 with bright red blood from the mouth. What type of hemorrhage is this?", options: ["Primary hemorrhage", "Secondary hemorrhage", "Mucosal erosion", "Traumatic injury"], correct: 1, rationale: "Secondary hemorrhage occurs at days 5-10 post-tonsillectomy when the fibrin eschar naturally separates from the healing granulation tissue, exposing the underlying vessels." },
      { question: "Which medication is contraindicated in children under 12 undergoing tonsillectomy?", options: ["Acetaminophen", "Ondansetron", "Codeine", "Dexamethasone"], correct: 2, rationale: "The FDA issued a Black Box Warning contraindicating codeine for post-tonsillectomy pain in children under 12 due to risk of fatal respiratory depression from CYP2D6 ultra-rapid metabolism." },
      { question: "A parent calls concerned about white patches on the child's tonsil beds 5 days after tonsillectomy. What should the nurse advise?", options: ["Come to the ED immediately for infection evaluation", "This is normal fibrin eschar formation and will resolve in 10-14 days", "Start antibiotics immediately", "Apply hydrogen peroxide to the area"], correct: 1, rationale: "White/gray patches (fibrin eschar) on the tonsil beds are a normal part of the healing process after tonsillectomy and will slough off naturally over 10-14 days." }
    ]
  },

  "tonsillectomy-care-np": {
    title: "Tonsillectomy Care",
    image: imgTonsillectomy,
    cellular: {
      title: "Evidence-Based Perioperative Management",
      content: "Tonsillectomy remains one of the most common surgical procedures in pediatric and adult otolaryngology. Indications include recurrent acute tonsillitis meeting Paradise criteria (≥7 episodes in 1 year, ≥5/year for 2 years, ≥3/year for 3 years), peritonsillar abscess, obstructive sleep-disordered breathing, and suspected malignancy. Surgical techniques include cold dissection, electrocautery, coblation, and intracapsular (partial) tonsillectomy. Post-operative hemorrhage is the most significant complication, occurring in 2-4% of cases. Post-operative hemorrhage is classified as primary (<24 hours, from inadequate surgical hemostasis) or secondary (5-10 days, from premature eschar separation). The clinician must perform pre-operative risk assessment, prescribe evidence-based perioperative protocols, manage post-operative analgesia according to current guidelines, and coordinate follow-up for complications."
    },
    riskFactors: [
      "Paradise criteria for recurrent tonsillitis",
      "Obstructive sleep apnea with adenotonsillar hypertrophy (polysomnography-confirmed)",
      "Peritonsillar abscess (quinsy)",
      "Asymmetric tonsillar enlargement (malignancy concern)",
      "Coagulopathy or anticoagulant/antiplatelet therapy",
      "Family history of malignant hyperthermia or bleeding disorders",
      "Obesity (increased surgical and anesthetic risk)",
      "Age <3 or >12 (increased complication risk)"
    ],
    diagnostics: [
      "Order pre-operative CBC, PT/INR, and PTT (especially with bleeding history)",
      "Review medication history for anticoagulants, NSAIDs, and herbal supplements affecting hemostasis",
      "Order polysomnography for sleep-disordered breathing evaluation before surgery",
      "Assess Mallampati score and airway anatomy pre-operatively",
      "Evaluate pre-operative hemoglobin to establish baseline",
      "Order type and screen if significant hemorrhage risk factors present",
      "Post-operatively: CBC if hemorrhage suspected; monitor SpO2 continuously in OSA patients"
    ],
    management: [
      "Prescribe intraoperative dexamethasone 0.5 mg/kg (max 10 mg) for post-operative nausea and edema",
      "Prescribe multimodal analgesia: scheduled acetaminophen 15 mg/kg q4-6h (max 75 mg/kg/day) ± ibuprofen (if protocol allows, per recent evidence supporting safety)",
      "Prescribe opioid rescue: oxycodone 0.05-0.1 mg/kg q4-6h PRN for breakthrough pain (children ≥12 only for post-tonsillectomy per FDA)",
      "Avoid codeine in all children undergoing tonsillectomy (FDA Black Box Warning)",
      "Prescribe ondansetron 0.15 mg/kg (max 4 mg) for post-operative nausea prophylaxis",
      "Prescribe antibiotics only if peritonsillar abscess or active infection at time of surgery",
      "Order continuous pulse oximetry monitoring for OSA patients post-operatively",
      "Prescribe dietary progression: cool clear liquids → soft bland foods; avoid hot, acidic, crunchy foods for 14 days"
    ],
    nursingActions: [
      "Perform pre-operative assessment: bleeding history, family anesthesia history, current medications, NPO status",
      "Calculate and document pediatric weight-based medication doses",
      "Develop post-operative monitoring protocol based on risk stratification (OSA severity, age, comorbidities)",
      "Coordinate overnight observation for high-risk patients (age <3, severe OSA with AHI >10, comorbidities)",
      "Prescribe detailed discharge instructions: activity restrictions (14 days), dietary progression, medication schedule",
      "Schedule follow-up visit at 2-3 weeks post-operatively",
      "Educate caregivers on emergency signs: active bleeding, inability to swallow, stridor, high fever",
      "Review and update immunization status at pre-operative visit"
    ],
    signs: {
      left: [
        "Expected post-operative course",
        "Odynophagia (peak days 3-5)",
        "Referred otalgia (CN IX/X shared innervation)",
        "Halitosis (fibrin eschar metabolism)",
        "Low-grade fever (inflammatory response)",
        "Transient velopharyngeal insufficiency"
      ],
      right: [
        "Post-tonsillectomy hemorrhage (2-4% incidence)",
        "Dehydration requiring IV fluid resuscitation",
        "Airway obstruction (rare, more common in severe OSA)",
        "Post-obstructive pulmonary edema",
        "Nasopharyngeal stenosis (rare, long-term)",
        "Atlantoaxial subluxation (Grisel syndrome, very rare)"
      ]
    },
    medications: [
      { name: "Acetaminophen", type: "Non-opioid analgesic", action: "Central prostaglandin synthesis inhibition", sideEffects: "Hepatotoxicity at supratherapeutic doses", contra: "Severe hepatic disease", pearl: "Foundation of post-tonsillectomy analgesia. Schedule around the clock 15 mg/kg q4-6h (max 75 mg/kg/day pediatric, 4 g/day adult). IV formulation in immediate post-op period." },
      { name: "Ibuprofen", type: "NSAID", action: "COX-1 and COX-2 inhibition providing anti-inflammatory and analgesic effects", sideEffects: "GI upset, platelet inhibition, renal effects", contra: "Active bleeding, renal impairment, aspirin allergy", pearl: "Recent meta-analyses (2023-2024) support ibuprofen safety post-tonsillectomy with no increased bleeding risk. AAO-HNS now conditionally recommends it. 10 mg/kg q6-8h. Provides superior analgesia vs. acetaminophen alone." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Potent anti-inflammatory reducing post-operative edema, nausea, and pain", sideEffects: "Hyperglycemia, post-operative bleeding (debated), adrenal suppression", contra: "Peritonsillar abscess with active infection (relative)", pearl: "Single IV dose 0.5 mg/kg (max 10 mg) intraoperatively. NNT=4 for preventing PONV, NNT=5 for earlier oral intake. Cochrane review confirms benefit outweighs minimal bleeding risk." },
      { name: "Tranexamic Acid", type: "Antifibrinolytic", action: "Inhibits conversion of plasminogen to plasmin, stabilizing fibrin clots", sideEffects: "Nausea, diarrhea, rarely thromboembolic events", contra: "Active thromboembolic disease, DIC", pearl: "Emerging evidence supports topical (soaked gauze on tonsil beds) and oral use to reduce post-tonsillectomy hemorrhage. Dose: 15-25 mg/kg IV intraoperatively or oral TID for 5 days post-op." }
    ],
    pearls: [
      "Recent evidence supports ibuprofen safety post-tonsillectomy: AAO-HNS conditionally recommends its use",
      "Codeine is absolutely contraindicated in children <12 for tonsillectomy pain (FDA Black Box Warning 2013)",
      "Overnight pulse oximetry monitoring is recommended for OSA patients with AHI >10 or age <3",
      "Grisel syndrome (atlantoaxial subluxation) is a rare but serious complication presenting with torticollis and neck pain 1-2 weeks post-operatively",
      "The most effective hemorrhage reduction strategy combines intraoperative dexamethasone, careful surgical technique, and avoidance of aspirin"
    ],
    quiz: [
      { question: "According to current evidence, what is the recommended first-line analgesic protocol after tonsillectomy in children?", options: ["Codeine and acetaminophen combination", "Scheduled acetaminophen with ibuprofen as adjunct", "Morphine PCA", "Aspirin and oxycodone"], correct: 1, rationale: "Current guidelines recommend scheduled acetaminophen as the foundation with ibuprofen as an adjunct. Recent evidence supports ibuprofen safety post-tonsillectomy. Codeine is contraindicated in children <12, and aspirin increases bleeding risk." },
      { question: "Which patients require overnight pulse oximetry monitoring after tonsillectomy?", options: ["All tonsillectomy patients", "Patients with OSA and AHI >10 or age <3", "Only patients over age 18", "Only patients with bleeding disorders"], correct: 1, rationale: "Children under 3 and those with severe OSA (AHI >10) are at higher risk for post-operative respiratory complications and require overnight monitoring with continuous pulse oximetry." },
      { question: "What is the evidence-based intraoperative dose of dexamethasone for tonsillectomy?", options: ["0.1 mg/kg (max 4 mg)", "0.25 mg/kg (max 8 mg)", "0.5 mg/kg (max 10 mg)", "1 mg/kg (max 20 mg)"], correct: 2, rationale: "The evidence-based dose is 0.5 mg/kg IV (maximum 10 mg) given intraoperatively. This reduces post-operative nausea, vomiting, and pain with a favorable risk-benefit profile." }
    ]
  }
};
