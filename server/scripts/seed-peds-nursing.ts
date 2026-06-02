import crypto from "crypto";
import pg from "pg";

const CAREER_TYPE = "peds_nursing";

const DOMAINS = [
  "Neonatal Care",
  "Developmental Milestones",
  "Pediatric Infections",
  "Congenital Disorders",
  "Pediatric Emergencies",
];

const LESSON_PATH_MAP: Record<string, string[]> = {
  "Neonatal Care": [
    "/pediatrics/lessons/newborn-assessment",
    "/pediatrics/lessons/neonatal-thermoreg",
    "/pediatrics/lessons/neonatal-feeding",
    "/pediatrics/lessons/neonatal-jaundice",
    "/pediatrics/lessons/neonatal-respiratory-distress",
    "/pediatrics/lessons/neonatal-sepsis",
    "/pediatrics/lessons/hyperbilirubinemia",
    "/pediatrics/lessons/neonatal-care",
  ],
  "Developmental Milestones": [
    "/pediatrics/lessons/adhd-basics",
    "/pediatrics/lessons/separation-anxiety",
    "/pediatrics/lessons/pediatrics-growth-development",
    "/pediatrics/lessons/developmental-screening",
    "/pediatrics/lessons/pediatrics-rpn-exp",
    "/pediatrics/lessons/pediatrics-np-exp",
  ],
  "Pediatric Infections": [
    "/pediatrics/lessons/rotavirus",
    "/pediatrics/lessons/pediatric-infections",
    "/pediatrics/lessons/varicella",
    "/pediatrics/lessons/rsv-bronchiolitis",
    "/pediatrics/lessons/kawasaki-critical",
  ],
  "Congenital Disorders": [
    "/pediatrics/lessons/congenital-heart",
    "/pediatrics/lessons/pyloric-intussusception",
    "/pediatrics/lessons/cleft-lip-palate",
    "/pediatrics/lessons/down-syndrome",
    "/pediatrics/lessons/neural-tube-defects",
    "/pediatrics/lessons/pediatrics-rn-exp",
  ],
  "Pediatric Emergencies": [
    "/pediatrics/lessons/foreign-body-aspiration",
    "/pediatrics/lessons/pediatric-seizures",
    "/pediatrics/lessons/pediatric-dehydration",
    "/pediatrics/lessons/epiglottitis-croup",
    "/pediatrics/lessons/pediatric-trauma",
    "/pediatrics/lessons/reye-syndrome",
  ],
};

function stemHash(text: string): string {
  return crypto.createHash("sha256").update(text.trim().toLowerCase().replace(/\s+/g, " ")).digest("hex").substring(0, 16);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QuestionData {
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: number;
  rationale: string;
  clinicalPearls: string[];
  distractorRationales: string[];
  learningObjective: string;
  cognitiveLevel: string;
  difficulty: number;
  questionType: string;
  subtopic: string;
  lessonPath: string;
  safetyNote: string;
  examTrap: string;
  tags: string[];
}

function buildNeonatalQuestions(): QuestionData[] {
  const questions: QuestionData[] = [];
  const lesson = (i: number) => LESSON_PATH_MAP["Neonatal Care"][i % LESSON_PATH_MAP["Neonatal Care"].length];

  const neonatalData = [
    {
      stem: "A nurse is performing an APGAR assessment on a newborn at 1 minute of age. The neonate has a heart rate of 90 bpm, a weak cry, some flexion of extremities, blue hands and feet with a pink body, and grimaces when the nasal catheter is inserted. What is this newborn's APGAR score?",
      options: [
        { label: "A", text: "4" },
        { label: "B", text: "5" },
        { label: "C", text: "6" },
        { label: "D", text: "7" },
      ],
      correctAnswer: 1,
      rationale: "The APGAR scoring system evaluates five parameters at 1 and 5 minutes after birth: Appearance (skin color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), and Respirations (respiratory effort). Each parameter is scored 0-2 for a maximum total of 10. For this neonate: Heart rate of 90 bpm scores 1 (below 100 bpm but present), weak cry scores 1 (slow/irregular respirations), some flexion scores 1 (not active movement but some tone), acrocyanosis (blue extremities with pink body) scores 1, and grimace reflex scores 1 (some response but not vigorous). The total APGAR score is 5 (1+1+1+1+1). A score of 7-10 is considered normal and reassuring, 4-6 indicates the need for some resuscitative measures, and below 4 requires immediate aggressive resuscitation. The nurse should anticipate potential interventions including stimulation, suctioning, and possibly positive pressure ventilation. The 5-minute APGAR will need to be reassessed to evaluate the newborn's response to interventions. It is critical to understand that the APGAR score is a rapid assessment tool and should not delay resuscitative efforts if the newborn shows signs of distress. Documentation of both 1-minute and 5-minute scores is essential for the medical record.",
      clinicalPearls: ["APGAR is assessed at 1 and 5 minutes; do not delay resuscitation for scoring", "Heart rate is the most critical parameter in neonatal resuscitation decisions"],
      distractorRationales: ["A score of 4 would require lower scores in multiple parameters than described", "5 is correct: each parameter scores 1 point", "A score of 6 would require at least one parameter scoring 2, which none do in this scenario", "A score of 7 would require higher scores than the clinical presentation supports"],
      learningObjective: "The student will accurately calculate an APGAR score using clinical assessment findings",
      cognitiveLevel: "application",
      difficulty: 2,
      questionType: "MCQ_SINGLE",
      subtopic: "APGAR Scoring",
      lessonPath: "/pediatrics/lessons/newborn-assessment",
      safetyNote: "Never delay resuscitation to complete APGAR scoring",
      examTrap: "Acrocyanosis (blue extremities) scores 1, not 0; central cyanosis scores 0",
      tags: ["APGAR", "newborn-assessment", "neonatal"],
    },
    {
      stem: "A 2-day-old neonate born at 38 weeks gestation has a temperature of 96.5°F (35.8°C) taken axillary. The baby was bathed 30 minutes ago and is lying uncovered in an open crib. The nurse understands that this neonate is experiencing cold stress. Which physiological mechanism does the neonate primarily use to generate heat?",
      options: [
        { label: "A", text: "Shivering thermogenesis through skeletal muscle contraction" },
        { label: "B", text: "Non-shivering thermogenesis through brown adipose tissue metabolism" },
        { label: "C", text: "Peripheral vasoconstriction to conserve core body heat" },
        { label: "D", text: "Increased physical activity and voluntary movement" },
      ],
      correctAnswer: 1,
      rationale: "Neonates are uniquely vulnerable to cold stress due to their large body surface area relative to mass, thin skin with minimal subcutaneous fat, and inability to shiver effectively. Unlike adults who primarily generate heat through shivering (skeletal muscle contraction), neonates rely on non-shivering thermogenesis (NST) through the metabolism of brown adipose tissue (BAT), also known as brown fat. Brown fat is located between the scapulae, around the kidneys and adrenal glands, and along the great vessels of the neck and thorax. Brown fat cells contain numerous mitochondria with a unique protein called uncoupling protein 1 (UCP1, or thermogenin) that uncouples oxidative phosphorylation, allowing the energy from fatty acid oxidation to be released directly as heat rather than being stored as ATP. This process is highly effective for heat generation but comes at a significant metabolic cost: it rapidly increases oxygen consumption and glucose utilization. When cold stress occurs, the neonate activates the sympathetic nervous system, releasing norepinephrine that stimulates lipolysis in brown fat cells. The resulting cascade of increased oxygen consumption can lead to hypoxemia, while glycogen depletion causes hypoglycemia. Metabolic acidosis develops as anaerobic metabolism increases due to inadequate oxygen supply. The nurse must immediately rewarm the neonate gradually (0.5°C per hour to prevent apnea), monitor blood glucose, and assess for signs of the cold stress cascade including tachypnea, hypoglycemia, and acidosis.",
      clinicalPearls: ["Neonates cannot shiver; they rely exclusively on brown fat for heat generation", "Cold stress cascade: hypothermia leads to increased O2 consumption, hypoglycemia, and metabolic acidosis"],
      distractorRationales: ["Shivering is an adult mechanism; neonates lack sufficient skeletal muscle mass and neurological maturity to shiver effectively", "Non-shivering thermogenesis via brown fat is the correct primary heat generation mechanism in neonates", "Vasoconstriction is a compensatory mechanism that conserves heat but does not generate it", "Increased physical activity is not a viable heat-generating mechanism in neonates who have limited voluntary movement"],
      learningObjective: "The student will identify the primary mechanism of heat generation in neonates and understand the cold stress cascade",
      cognitiveLevel: "analysis",
      difficulty: 3,
      questionType: "MCQ_SINGLE",
      subtopic: "Thermoregulation",
      lessonPath: "/pediatrics/lessons/neonatal-thermoreg",
      safetyNote: "Rewarm neonates gradually at 0.5°C per hour to prevent apnea",
      examTrap: "Vasoconstriction conserves heat but does not generate it",
      tags: ["thermoregulation", "brown-fat", "cold-stress", "neonatal"],
    },
    {
      stem: "A 4-day-old breastfed neonate is brought to the pediatric clinic. The mother reports the infant has been feeding every 2-3 hours but has only had 3 wet diapers in the past 24 hours. The baby has lost 12% of birth weight. What is the priority nursing action?",
      options: [
        { label: "A", text: "Reassure the mother that this is normal for breastfed infants" },
        { label: "B", text: "Advise the mother to switch to formula feeding immediately" },
        { label: "C", text: "Assess breastfeeding technique and latch, and notify the provider of the excessive weight loss" },
        { label: "D", text: "Recommend the mother supplement with water between feedings" },
      ],
      correctAnswer: 2,
      rationale: "This clinical scenario presents a breastfed neonate with signs of inadequate intake requiring immediate nursing intervention. While breastfed infants typically lose 5-7% of birth weight in the first few days (up to 10% is considered within normal limits), a 12% weight loss exceeds the acceptable threshold and indicates significant dehydration or feeding difficulties. The decreased number of wet diapers (expected 6-8 per day by day 4-5 of life) further supports inadequate hydration. The priority nursing action is to assess the breastfeeding technique and latch quality, as poor latch is the most common correctable cause of inadequate milk transfer. The nurse should observe a feeding session, assess for proper positioning, audible swallowing, and effective milk transfer. Simultaneously, the provider must be notified because a 12% weight loss requires medical evaluation and possible intervention. The provider may order supplementation with expressed breast milk or formula, IV fluid assessment, and metabolic workup including serum bilirubin (as dehydration worsens jaundice). Simply reassuring the mother would be inappropriate given the degree of weight loss. Switching entirely to formula is premature without first assessing and correcting latch issues, and offering water to neonates is dangerous as it can cause hyponatremia and water intoxication. The goal is to support breastfeeding while ensuring adequate nutrition through evidence-based interventions.",
      clinicalPearls: ["Weight loss >10% in a breastfed neonate requires immediate evaluation", "By day 4-5, expect 6-8 wet diapers per day as an indicator of adequate intake"],
      distractorRationales: ["12% weight loss exceeds normal limits and cannot be dismissed as normal", "Assessing latch and notifying provider is the priority; addresses root cause while ensuring safety", "Switching to formula without assessing breastfeeding technique fails to address the underlying issue", "Water supplementation in neonates risks hyponatremia and is never recommended"],
      learningObjective: "The student will identify signs of inadequate neonatal feeding and prioritize appropriate nursing interventions",
      cognitiveLevel: "analysis",
      difficulty: 3,
      questionType: "MCQ_SINGLE",
      subtopic: "Neonatal Feeding",
      lessonPath: "/pediatrics/lessons/neonatal-feeding",
      safetyNote: "Never give plain water to neonates; risk of hyponatremia",
      examTrap: "10% weight loss is the upper limit of normal for breastfed infants; >10% requires intervention",
      tags: ["breastfeeding", "neonatal-feeding", "dehydration", "weight-loss"],
    },
    {
      stem: "A nurse is caring for a 3-day-old neonate under phototherapy for hyperbilirubinemia. The total serum bilirubin is 18 mg/dL. Which nursing intervention is essential during phototherapy?",
      options: [
        { label: "A", text: "Apply sunscreen to the infant's exposed skin areas" },
        { label: "B", text: "Keep the infant fully clothed to maintain body temperature" },
        { label: "C", text: "Protect the infant's eyes with opaque shields and maximize skin exposure" },
        { label: "D", text: "Restrict fluid intake to prevent fluid overload" },
      ],
      correctAnswer: 2,
      rationale: "Phototherapy is the primary treatment for neonatal hyperbilirubinemia. Blue-green light (wavelength 430-490 nm) converts unconjugated (indirect) bilirubin in the skin into water-soluble photoisomers (lumirubin) that can be excreted in urine and stool without requiring hepatic conjugation. Essential nursing care during phototherapy includes: (1) Protecting the infant's eyes with opaque shields at all times during light exposure to prevent retinal damage from the intense light. Eye shields must be checked frequently to ensure they remain properly positioned and are not occluding the nares. (2) Maximizing skin exposure by removing all clothing except the diaper, as the effectiveness of phototherapy is directly proportional to the surface area of skin exposed to the light. (3) Monitoring temperature closely, as the infant is at risk for both hyperthermia (from the light source) and hypothermia (from skin exposure). (4) Increasing fluid intake rather than restricting it, because phototherapy increases insensible water loss through the skin by approximately 25-40%. The nurse should encourage frequent feedings (every 2-3 hours) to promote hydration and intestinal motility, which helps excrete bilirubin through stool. Additional monitoring includes tracking bilirubin levels per provider orders, assessing skin color using the blanch technique, monitoring stool output (expect loose green stools), and assessing for bronze baby syndrome (contraindicated in conjugated hyperbilirubinemia). Parent education about the purpose and safety of phototherapy is essential to reduce anxiety.",
      clinicalPearls: ["Eye shields must remain in place during phototherapy; check position frequently", "Increase fluid intake during phototherapy to compensate for insensible water loss"],
      distractorRationales: ["Sunscreen is not used during phototherapy; it would block the therapeutic light", "Eyes must be protected with opaque shields and skin maximally exposed for effectiveness", "Clothing should be removed except for the diaper to maximize skin exposure to therapeutic light", "Fluid intake should be increased, not restricted, due to increased insensible water loss"],
      learningObjective: "The student will identify essential nursing interventions during phototherapy for neonatal hyperbilirubinemia",
      cognitiveLevel: "application",
      difficulty: 2,
      questionType: "MCQ_SINGLE",
      subtopic: "Phototherapy",
      lessonPath: "/pediatrics/lessons/hyperbilirubinemia",
      safetyNote: "Never leave eyes unprotected during phototherapy; check shield position hourly",
      examTrap: "Fluid intake should be INCREASED during phototherapy, not restricted",
      tags: ["phototherapy", "hyperbilirubinemia", "jaundice", "neonatal"],
    },
    {
      stem: "A preterm infant born at 28 weeks gestation develops grunting, nasal flaring, and intercostal retractions within 2 hours of birth. The chest X-ray shows a ground-glass appearance with air bronchograms. SpO2 is 85% on room air. What condition does the nurse suspect, and what is the priority intervention?",
      options: [
        { label: "A", text: "Transient tachypnea of the newborn; place the infant in a high-humidity environment" },
        { label: "B", text: "Respiratory distress syndrome; prepare for surfactant administration via endotracheal tube" },
        { label: "C", text: "Meconium aspiration syndrome; perform immediate endotracheal suctioning" },
        { label: "D", text: "Pneumothorax; prepare for needle decompression" },
      ],
      correctAnswer: 1,
      rationale: "This clinical presentation is classic for Respiratory Distress Syndrome (RDS), formerly known as hyaline membrane disease, which results from insufficient pulmonary surfactant production. Surfactant is produced by Type II pneumocytes (alveolar cells) that do not mature until approximately 35 weeks gestation. At 28 weeks, surfactant production is critically inadequate. Without sufficient surfactant to reduce alveolar surface tension, alveoli collapse during expiration (atelectasis), leading to decreased functional residual capacity, ventilation-perfusion mismatch, and progressive respiratory failure. The hallmark signs include: grunting (the infant's attempt to create auto-PEEP by partially closing the glottis to maintain alveolar distension), nasal flaring (increased work of breathing), and intercostal/subcostal retractions (negative pressure required to expand non-compliant lungs). The chest X-ray findings of ground-glass opacity with air bronchograms are pathognomonic for RDS. The priority intervention is administration of exogenous surfactant (beractant/Survanta or poractant alfa/Curosurf) via endotracheal tube. Surfactant is administered in specific positions (right and left lateral, then supine) to ensure even distribution throughout both lungs. The nurse should anticipate: continuous cardiorespiratory monitoring, SpO2 targeting 88-95% in preterm infants to prevent retinopathy of prematurity, potential need for CPAP or mechanical ventilation, and monitoring for complications including pneumothorax. Prenatal betamethasone given to the mother 24-48 hours before preterm delivery is the best prevention for RDS as it accelerates fetal lung maturation.",
      clinicalPearls: ["Ground-glass appearance with air bronchograms on CXR is pathognomonic for RDS", "Target SpO2 88-95% in preterm infants to prevent retinopathy of prematurity"],
      distractorRationales: ["TTN typically presents in term/late preterm infants and resolves within 24-72 hours", "RDS with surfactant administration is the correct diagnosis and intervention", "Meconium aspiration occurs in term/post-term infants with meconium-stained fluid", "Pneumothorax would show absent breath sounds on one side and shift of mediastinum"],
      learningObjective: "The student will recognize the clinical presentation of RDS and identify the priority intervention",
      cognitiveLevel: "analysis",
      difficulty: 3,
      questionType: "MCQ_SINGLE",
      subtopic: "RDS/Surfactant",
      lessonPath: "/pediatrics/lessons/neonatal-respiratory-distress",
      safetyNote: "Target SpO2 88-95% in preterm infants; higher levels increase retinopathy risk",
      examTrap: "RDS occurs in preterm infants; meconium aspiration in term/post-term infants",
      tags: ["RDS", "surfactant", "preterm", "respiratory-distress"],
    },
    {
      stem: "A 36-hour-old neonate born at 39 weeks gestation develops visible jaundice of the face, trunk, and upper extremities. The mother's blood type is O positive and the infant's blood type is A positive. The total serum bilirubin is 15.2 mg/dL. The direct Coombs test is positive. What type of jaundice does the nurse suspect?",
      options: [
        { label: "A", text: "Physiologic jaundice related to normal neonatal bilirubin metabolism" },
        { label: "B", text: "Breastmilk jaundice caused by substances in maternal milk" },
        { label: "C", text: "Pathologic jaundice caused by ABO blood type incompatibility" },
        { label: "D", text: "Breastfeeding jaundice related to insufficient caloric intake" },
      ],
      correctAnswer: 2,
      rationale: "This scenario presents pathologic jaundice secondary to ABO blood group incompatibility between mother and infant. ABO incompatibility occurs when the mother has type O blood (containing naturally occurring anti-A and anti-B antibodies) and the infant has type A or B blood. Maternal IgG anti-A antibodies cross the placenta and bind to fetal red blood cells, causing hemolysis (premature destruction of RBCs). The accelerated breakdown of hemoglobin produces excessive bilirubin that overwhelms the neonate's immature hepatic conjugation system. Key differentiating features in this case include: (1) Jaundice onset at 36 hours is at the borderline between pathologic (<24 hours is always pathologic) and early physiologic, but the severity and positive Coombs test indicate a pathologic process. (2) The positive direct Coombs test confirms that maternal antibodies are coating the infant's RBCs, definitively identifying immune-mediated hemolysis. (3) Mother type O with infant type A is the classic ABO incompatibility pattern. (4) The rapidly rising bilirubin level of 15.2 mg/dL at 36 hours exceeds the phototherapy threshold on the Bhutani nomogram. Physiologic jaundice would not produce a positive Coombs test and typically peaks at days 3-5 with lower levels. Breastmilk jaundice appears later (after day 5-7) and is caused by beta-glucuronidase in breast milk enhancing enterohepatic circulation. Breastfeeding jaundice relates to insufficient caloric intake and dehydration, not hemolysis. The nurse should anticipate aggressive phototherapy, serial bilirubin monitoring, CBC with reticulocyte count to assess ongoing hemolysis, and preparation for possible exchange transfusion if levels continue to rise rapidly.",
      clinicalPearls: ["Positive direct Coombs test confirms immune-mediated hemolysis in ABO incompatibility", "Mother type O + infant type A or B is the classic ABO incompatibility pattern"],
      distractorRationales: ["Physiologic jaundice would not produce a positive Coombs test", "Breastmilk jaundice appears after day 5-7, not at 36 hours", "ABO incompatibility with positive Coombs test is the correct diagnosis", "Breastfeeding jaundice relates to intake insufficiency, not hemolysis"],
      learningObjective: "The student will differentiate pathologic jaundice from physiologic jaundice and identify ABO incompatibility",
      cognitiveLevel: "analysis",
      difficulty: 4,
      questionType: "MCQ_SINGLE",
      subtopic: "Neonatal Jaundice",
      lessonPath: "/pediatrics/lessons/neonatal-jaundice",
      safetyNote: "Jaundice within the first 24 hours is ALWAYS pathologic and requires urgent evaluation",
      examTrap: "ABO incompatibility is more common but less severe than Rh incompatibility",
      tags: ["jaundice", "ABO-incompatibility", "Coombs-test", "hyperbilirubinemia"],
    },
    {
      stem: "A 5-day-old neonate in the NICU develops temperature instability (alternating between 35.8°C and 37.8°C), poor feeding, lethargy, and mottled skin. Blood glucose is 42 mg/dL. The nurse suspects neonatal sepsis. Which intervention is the highest priority?",
      options: [
        { label: "A", text: "Obtain a complete blood count and wait for results before starting treatment" },
        { label: "B", text: "Obtain blood cultures and administer prescribed empiric antibiotics immediately" },
        { label: "C", text: "Begin phototherapy to address possible jaundice" },
        { label: "D", text: "Increase the environmental temperature to address hypothermia" },
      ],
      correctAnswer: 1,
      rationale: "This clinical presentation is highly concerning for neonatal sepsis. The classic signs of neonatal sepsis are often subtle and nonspecific, making early recognition critically important. Key findings in this scenario include: temperature instability (hypothermia is actually MORE common than fever in neonatal sepsis, and alternating temperatures are a red flag), poor feeding and lethargy (indicating systemic illness), mottled skin (suggesting poor peripheral perfusion), and borderline hypoglycemia (glucose instability is a hallmark of sepsis in neonates). The HIGHEST PRIORITY intervention is to obtain blood cultures BEFORE starting antibiotics, then immediately administer the prescribed empiric antibiotic regimen. The standard empiric therapy for early-onset sepsis (EOS, <72 hours) is ampicillin plus gentamicin, providing coverage for Group B Streptococcus and E. coli, the two most common causative organisms. For late-onset sepsis (LOS, >72 hours), vancomycin plus cefotaxime or ceftazidime is often used to cover nosocomial organisms including coagulase-negative Staphylococcus and gram-negative bacteria. The critical principle is: ALWAYS obtain blood cultures BEFORE antibiotics, but NEVER delay antibiotics waiting for culture results. Blood cultures take 24-48 hours for preliminary results, and delaying treatment in a septic neonate can be fatal. Additional workup includes CBC with differential (looking for leukopenia, bandemia/left shift, thrombocytopenia), CRP, urinalysis, and possibly lumbar puncture if meningitis is suspected. Supportive care includes IV fluids, maintaining a neutral thermal environment, respiratory support as needed, and continuous cardiorespiratory monitoring.",
      clinicalPearls: ["Hypothermia is MORE common than fever as a sign of neonatal sepsis", "Always obtain blood cultures BEFORE starting antibiotics, but never delay treatment waiting for results"],
      distractorRationales: ["Waiting for CBC results before treatment delays critical antibiotic administration", "Blood cultures first then immediate antibiotics is the correct priority sequence", "Phototherapy addresses jaundice, not sepsis; this is an incorrect intervention", "Addressing temperature alone ignores the underlying sepsis requiring antibiotics"],
      learningObjective: "The student will recognize signs of neonatal sepsis and prioritize appropriate interventions",
      cognitiveLevel: "analysis",
      difficulty: 3,
      questionType: "MCQ_SINGLE",
      subtopic: "Neonatal Sepsis",
      lessonPath: "/pediatrics/lessons/neonatal-sepsis",
      safetyNote: "Never delay antibiotics in suspected sepsis; obtain cultures first, then treat immediately",
      examTrap: "Hypothermia, not fever, is the more common temperature finding in neonatal sepsis",
      tags: ["sepsis", "neonatal", "antibiotics", "blood-cultures"],
    },
    {
      stem: "A nurse is providing discharge teaching to parents of a healthy full-term newborn. Which statement by the parent indicates correct understanding of safe sleep practices?",
      options: [
        { label: "A", text: "I will place the baby on their stomach to prevent aspiration if they spit up" },
        { label: "B", text: "I will put the baby on their back on a firm, flat surface with no loose bedding" },
        { label: "C", text: "I will use bumper pads and a soft blanket to keep the baby comfortable" },
        { label: "D", text: "I will co-sleep with the baby in my bed to promote bonding" },
      ],
      correctAnswer: 1,
      rationale: "The American Academy of Pediatrics (AAP) safe sleep guidelines are designed to reduce the risk of Sudden Infant Death Syndrome (SIDS) and other sleep-related deaths. The correct response demonstrates understanding of the key recommendations: (1) Always place the infant SUPINE (on their back) for every sleep period until 12 months of age. Back sleeping is the single most effective intervention for reducing SIDS risk, having decreased SIDS rates by over 50% since the Back to Sleep campaign began in 1994. (2) Use a firm, flat sleep surface such as a safety-approved crib mattress covered with a fitted sheet. (3) Keep the sleep area free of soft objects, loose bedding, bumper pads, pillows, stuffed animals, and blankets. These items pose suffocation and strangulation risks. (4) Room-sharing (infant sleeps in the same room as parents but on a separate sleep surface) is recommended for at least the first 6 months, ideally 12 months. However, bed-sharing (co-sleeping in the same bed) is NOT recommended as it increases the risk of overlay, suffocation, and entrapment. Additional safe sleep recommendations include: offering a pacifier at nap and bedtime, avoiding overheating and overdressing, avoiding exposure to tobacco smoke, breastfeeding (associated with reduced SIDS risk), and ensuring immunizations are up to date. The nurse should assess parent understanding of these guidelines before discharge and provide written materials for reinforcement.",
      clinicalPearls: ["Back to Sleep: always place infants supine for sleep until 12 months", "Room-sharing without bed-sharing is recommended for at least the first 6 months"],
      distractorRationales: ["Prone positioning increases SIDS risk; healthy infants have intact gag reflexes to prevent aspiration", "Back on a firm, flat surface with no loose bedding is the correct safe sleep practice", "Bumper pads and soft blankets are suffocation hazards and are not recommended", "Bed-sharing increases risk of overlay, suffocation, and entrapment"],
      learningObjective: "The student will educate parents on safe sleep practices to reduce SIDS risk",
      cognitiveLevel: "application",
      difficulty: 1,
      questionType: "MCQ_SINGLE",
      subtopic: "Safe Sleep Practices",
      lessonPath: "/pediatrics/lessons/newborn-assessment",
      safetyNote: "Prone sleeping position significantly increases SIDS risk",
      examTrap: "Room-sharing is recommended, but bed-sharing is NOT",
      tags: ["SIDS", "safe-sleep", "discharge-teaching", "neonatal"],
    },
  ];

  questions.push(...neonatalData);

  const ages = ["1-day-old", "2-day-old", "3-day-old", "5-day-old", "7-day-old", "10-day-old", "14-day-old", "21-day-old", "2-week-old"];
  const gestations = ["28 weeks", "30 weeks", "32 weeks", "34 weeks", "36 weeks", "37 weeks", "38 weeks", "39 weeks", "40 weeks", "41 weeks"];
  const weights = ["1200g", "1500g", "1800g", "2200g", "2500g", "2800g", "3000g", "3200g", "3500g", "3800g", "4000g", "4200g"];

  const templateSets = [
    {
      subtopic: "Vitamin K Administration",
      stems: [
        `A ${pickRandom(ages)} neonate born at ${pickRandom(gestations)} gestation weighing ${pickRandom(weights)} is in the well-baby nursery. The nurse is preparing to administer vitamin K (phytonadione). What is the correct route and site for administration?`,
        `The parents of a ${pickRandom(ages)} newborn ask the nurse why their baby needs a vitamin K injection. Which explanation by the nurse is most accurate?`,
        `A nurse is reviewing the medication administration record of a ${pickRandom(ages)} neonate and notes that vitamin K has not yet been administered. The baby is now 4 hours old. What is the priority action?`,
      ],
      optionSets: [
        [
          { label: "A", text: "Subcutaneous injection in the deltoid muscle" },
          { label: "B", text: "Intramuscular injection in the vastus lateralis muscle" },
          { label: "C", text: "Oral administration mixed with the first feeding" },
          { label: "D", text: "Intravenous injection via umbilical vein catheter" },
        ],
        [
          { label: "A", text: "It prevents the baby from developing anemia in the first month of life" },
          { label: "B", text: "Newborns lack intestinal flora needed to produce vitamin K for blood clotting" },
          { label: "C", text: "It serves as the baby's first immunization against hepatitis" },
          { label: "D", text: "It provides essential nutrients that breast milk cannot supply" },
        ],
        [
          { label: "A", text: "Document that the parents refused the injection" },
          { label: "B", text: "Administer the vitamin K injection immediately and document the time" },
          { label: "C", text: "Wait until the 24-hour well-baby check to administer it" },
          { label: "D", text: "Contact the pharmacy to order an oral vitamin K preparation" },
        ],
      ],
      correctAnswers: [1, 1, 1],
      rationales: [
        "Vitamin K (phytonadione) is administered intramuscularly in the vastus lateralis muscle of the neonate's thigh within the first hour of birth. The vastus lateralis is the preferred injection site for neonates and infants because it is the largest and best-developed muscle group, has no major blood vessels or nerves in the injection zone, and provides reliable absorption. The dose is 0.5-1 mg for term neonates. Vitamin K is essential because newborns are born with a sterile gut and lack the intestinal bacteria (primarily Bacteroides and E. coli) needed to synthesize vitamin K, which is required for the production of clotting factors II, VII, IX, and X by the liver. Without vitamin K supplementation, neonates are at risk for hemorrhagic disease of the newborn (HDN), also called vitamin K deficiency bleeding (VKDB), which can cause life-threatening intracranial hemorrhage. The IM route is preferred over oral administration because it provides more reliable absorption and sustained blood levels. Subcutaneous injection and IV administration are not recommended routes for neonatal vitamin K. The nurse should use a 25-gauge, 5/8-inch needle for IM injection, administering into the middle third of the vastus lateralis at a 90-degree angle.",
        "Newborns are born with a sterile gastrointestinal tract that lacks the bacteria necessary to synthesize vitamin K endogenously. Vitamin K is a fat-soluble vitamin essential for the hepatic synthesis of clotting factors II (prothrombin), VII, IX, and X, collectively known as the vitamin K-dependent clotting factors. Without adequate vitamin K, these clotting factors cannot be properly carboxylated and remain functionally inactive, placing the neonate at significant risk for hemorrhagic disease of the newborn (HDN), also known as vitamin K deficiency bleeding (VKDB). VKDB can occur in three forms: early (within 24 hours, usually related to maternal medications), classic (days 1-7), and late (2-12 weeks). Late VKDB is the most dangerous form, as it commonly presents with sudden intracranial hemorrhage. Administration of a single intramuscular dose of vitamin K within the first hour of birth effectively prevents all forms of VKDB. Breast milk contains very low concentrations of vitamin K compared to formula, making exclusively breastfed infants particularly vulnerable to VKDB if prophylaxis is not given. The nurse should educate parents that vitamin K is not a vaccine but a vitamin supplement essential for the newborn's ability to form blood clots and prevent potentially fatal bleeding complications.",
        "Vitamin K should ideally be administered within the first hour of birth, but if missed, it should be given as soon as possible. At 4 hours, the priority is to administer the injection immediately and document the time of administration along with the reason for the delay. Hemorrhagic disease of the newborn (VKDB) can occur within the first 24 hours in severe cases, particularly if the mother was taking medications that interfere with vitamin K metabolism (anticonvulsants, warfarin, certain antibiotics). Classic VKDB occurs between days 1-7 and presents with gastrointestinal bleeding, umbilical stump bleeding, or bleeding from circumcision sites. The risk increases with every hour that passes without vitamin K prophylaxis. Documenting a parental refusal would only be appropriate if the parents have actually refused after informed consent discussion. Waiting until the 24-hour check unnecessarily prolongs the period of vulnerability. Oral vitamin K, while available in some countries, is not the standard of care in North America because it requires multiple doses and has less reliable absorption than the IM route.",
      ],
      clinicalPearlSets: [
        ["Vastus lateralis is the preferred IM injection site for neonates", "Administer vitamin K within the first hour of birth"],
        ["Newborns lack gut flora to produce vitamin K; it must be supplemented", "Vitamin K enables clotting factors II, VII, IX, and X"],
        ["Vitamin K should be given ASAP if missed at birth; do not wait", "Classic VKDB presents with bleeding from days 1-7 of life"],
      ],
      difficulty: [2, 2, 3],
      cognitiveLevel: ["application", "recall", "application"],
      lessonPath: "/pediatrics/lessons/newborn-assessment",
    },
    {
      subtopic: "Neonatal Reflexes",
      stems: [
        `A nurse is performing a neurological assessment on a ${pickRandom(ages)} term neonate. When the nurse claps hands loudly near the infant, the baby extends both arms with fingers spread, then flexes and brings arms together in an embracing motion. Which reflex is the nurse assessing?`,
        `During a well-baby checkup, a ${pickRandom(["2-month-old", "4-month-old", "6-month-old", "8-month-old"])} infant still demonstrates a strong palmar grasp reflex. At what age should the nurse expect this reflex to disappear?`,
        `A ${pickRandom(ages)} neonate is being assessed. The nurse strokes the sole of the foot from heel to toe. The toes fan outward and the great toe dorsiflexes. The nurse interprets this finding as:`,
      ],
      optionSets: [
        [
          { label: "A", text: "Rooting reflex" },
          { label: "B", text: "Moro (startle) reflex" },
          { label: "C", text: "Tonic neck reflex" },
          { label: "D", text: "Babinski reflex" },
        ],
        [
          { label: "A", text: "By 1-2 months of age" },
          { label: "B", text: "By 3-4 months of age" },
          { label: "C", text: "By 6-8 months of age" },
          { label: "D", text: "By 12 months of age" },
        ],
        [
          { label: "A", text: "A normal Babinski reflex in a newborn" },
          { label: "B", text: "An abnormal neurological finding requiring immediate evaluation" },
          { label: "C", text: "A positive Romberg sign indicating cerebellar dysfunction" },
          { label: "D", text: "An indication of spinal cord injury at birth" },
        ],
      ],
      correctAnswers: [1, 1, 0],
      rationales: [
        "The Moro reflex (startle reflex) is a primitive reflex present at birth that involves a symmetric response to sudden stimulation such as a loud noise, sudden movement, or sensation of falling. The reflex consists of two phases: (1) Extension phase: the arms abduct (extend outward) with fingers spread wide, and (2) Flexion phase: the arms adduct (come together) in an embracing or hugging motion. The Moro reflex is mediated by the vestibular system and the reticular formation of the brainstem. It is normally present at birth and should disappear by 4-6 months of age. Persistence beyond 6 months or asymmetric presentation is concerning. An asymmetric Moro reflex may indicate brachial plexus injury (Erb's palsy), clavicle fracture, or hemiparesis. Absent Moro reflex at birth may indicate severe neurological depression, brain injury, or cervical spinal cord injury. The rooting reflex involves turning the head toward a stimulus on the cheek (searching for the nipple), the tonic neck reflex involves the fencing position when the head is turned to one side, and the Babinski reflex involves fanning of toes when the sole is stroked. Each primitive reflex has a specific appearance time and expected disappearance age that the nurse must know for developmental assessment.",
        "The palmar grasp reflex is a primitive reflex present at birth in which the infant firmly grasps any object placed in the palm of the hand. This reflex is mediated by the spinal cord at the C5-T1 level and does not require cortical involvement. It is normally strong enough at birth that the infant can briefly support their own weight when grasped fingers are lifted. The palmar grasp reflex typically begins to diminish by 3-4 months of age and should be completely integrated (disappeared) by 5-6 months as voluntary grasping develops. The disappearance of the palmar grasp reflex is essential for the development of voluntary fine motor skills, including reaching, grasping, and releasing objects intentionally. Persistence of the palmar grasp reflex beyond 6 months may indicate neurological abnormality such as cerebral palsy, developmental delay, or upper motor neuron lesion. The nurse should document reflex findings at each well-baby visit and compare them to expected developmental timelines. Other primitive reflexes and their expected disappearance times include: Moro (4-6 months), rooting (3-4 months), Babinski (12-24 months), tonic neck (4-6 months), and stepping (4-8 weeks).",
        "The Babinski reflex (plantar reflex) in newborns is assessed by stroking the lateral aspect of the sole from the heel toward the toes. In neonates and infants up to approximately 12-24 months of age, the NORMAL response is dorsiflexion of the great toe with fanning (abduction) of the other toes. This response is called a positive Babinski sign and is NORMAL in neonates because the corticospinal tract (pyramidal tract) is not fully myelinated at birth. The corticospinal tract is responsible for voluntary motor control and inhibition of the Babinski response. As myelination progresses during the first 1-2 years of life, the Babinski response transitions to the adult pattern: plantar flexion of all toes (negative Babinski). A positive Babinski sign that persists beyond 24 months of age is abnormal and suggests upper motor neuron dysfunction or pyramidal tract lesion. In adults, a positive Babinski sign indicates conditions such as stroke, brain tumor, spinal cord injury, or multiple sclerosis. The nurse must understand that the same finding (positive Babinski) is normal in neonates but pathologic in older children and adults, making age-appropriate interpretation essential.",
      ],
      clinicalPearlSets: [
        ["Moro reflex: symmetric extension then embracing flexion; present birth to 4-6 months", "Asymmetric Moro may indicate brachial plexus injury or clavicle fracture"],
        ["Palmar grasp disappears by 3-4 months; persistence beyond 6 months is concerning", "Disappearance of primitive reflexes is necessary for voluntary motor skill development"],
        ["Positive Babinski is NORMAL in neonates due to immature corticospinal tract myelination", "Babinski should transition to adult pattern (plantar flexion) by 12-24 months"],
      ],
      difficulty: [1, 2, 2],
      cognitiveLevel: ["recall", "recall", "application"],
      lessonPath: "/pediatrics/lessons/newborn-assessment",
    },
    {
      subtopic: "Cord Care",
      stems: [
        `A nurse is providing cord care education to parents of a ${pickRandom(ages)} neonate. The umbilical cord stump appears dry with slight discoloration at the base. Which instruction is most appropriate?`,
      ],
      optionSets: [
        [
          { label: "A", text: "Apply rubbing alcohol to the cord stump three times daily" },
          { label: "B", text: "Keep the cord stump clean and dry; fold the diaper below the cord" },
          { label: "C", text: "Apply antibiotic ointment to the cord stump to prevent infection" },
          { label: "D", text: "Submerge the infant in a tub bath to keep the cord area clean" },
        ],
      ],
      correctAnswers: [1],
      rationales: [
        "Current evidence-based practice for umbilical cord care in healthy term neonates in developed countries recommends dry cord care (natural drying) rather than application of antiseptics, alcohol, or antibiotic ointments. Research has shown that dry cord care results in faster cord separation (typically 7-14 days) and does not increase the risk of infection compared to alcohol swabbing. The nurse should teach parents to: (1) Keep the cord stump clean and dry by exposing it to air. (2) Fold the diaper below the umbilical stump to prevent irritation and moisture accumulation from urine. (3) Give sponge baths only (not tub baths) until the cord has fallen off and the area is completely healed. (4) Clean around the base of the cord with a damp cloth if soiled with stool or urine, then pat dry. (5) Report signs of infection immediately: redness or swelling around the base, foul-smelling discharge, bleeding beyond slight oozing, or fever. Omphalitis (umbilical cord infection) is a potentially life-threatening condition that can progress rapidly to sepsis, particularly in the neonatal period. Signs of omphalitis include periumbilical erythema, edema, warmth, purulent drainage, and systemic signs of infection. The application of rubbing alcohol is no longer recommended by the AAP as it delays cord separation without reducing infection risk. Antibiotic ointments are not routinely applied to cord stumps in healthy neonates.",
      ],
      clinicalPearlSets: [
        ["Dry cord care is current best practice; alcohol application delays separation", "Report signs of omphalitis: redness, swelling, foul-smelling discharge, or fever"],
      ],
      difficulty: [1],
      cognitiveLevel: ["application"],
      lessonPath: "/pediatrics/lessons/newborn-assessment",
    },
    {
      subtopic: "Hypoglycemia Management",
      stems: [
        `A ${pickRandom(["3-hour-old", "6-hour-old", "12-hour-old"])} neonate born to a mother with gestational diabetes (LGA, weight ${pickRandom(["4200g", "4500g", "4800g"])}) has a point-of-care blood glucose of 32 mg/dL. The infant is jittery and tremulous but has a good suck reflex. What is the priority nursing intervention?`,
        `A nurse is monitoring a ${pickRandom(ages)} neonate who is at risk for hypoglycemia. Which group of neonates requires routine blood glucose screening?`,
      ],
      optionSets: [
        [
          { label: "A", text: "Administer IV dextrose 10% immediately" },
          { label: "B", text: "Initiate a feeding with breast milk or formula and recheck glucose in 30 minutes" },
          { label: "C", text: "Apply a warm blanket and recheck glucose in 1 hour" },
          { label: "D", text: "Notify the provider and withhold all feedings until glucose normalizes" },
        ],
        [
          { label: "A", text: "All full-term appropriate-for-gestational-age (AGA) neonates born via vaginal delivery" },
          { label: "B", text: "Large for gestational age (LGA), small for gestational age (SGA), and infants of diabetic mothers (IDM)" },
          { label: "C", text: "Only neonates who are symptomatic with jitteriness or lethargy" },
          { label: "D", text: "Only preterm infants born before 34 weeks gestation" },
        ],
      ],
      correctAnswers: [1, 1],
      rationales: [
        "This neonate presents with symptomatic hypoglycemia (blood glucose 32 mg/dL with jitteriness and tremors) but maintains a good suck reflex, indicating the infant can feed orally. For symptomatic neonates who are able to feed, the priority intervention is to initiate an oral feeding (breast milk or formula) and recheck the blood glucose within 30 minutes after the feeding. Neonatal hypoglycemia is defined as blood glucose below 40-45 mg/dL in the first 24 hours and below 45-50 mg/dL thereafter. Infants of diabetic mothers (IDM) are at high risk for hypoglycemia because the fetal pancreas produces excess insulin (hyperinsulinism) in response to chronic maternal hyperglycemia during pregnancy. After birth, the maternal glucose supply is abruptly discontinued, but the hyperinsulinemic state persists, causing rapid glucose consumption and hypoglycemia. LGA infants (>4000g or >90th percentile) born to diabetic mothers are particularly vulnerable. IV dextrose 10% is reserved for infants with severe hypoglycemia (glucose <25 mg/dL), seizures, or inability to feed orally. A D10W bolus of 2 mL/kg is typically administered followed by a continuous infusion. Simply warming the baby addresses hypothermia but not the hypoglycemia itself. Withholding feedings would worsen the condition. The nurse should monitor for persistent hypoglycemia requiring escalation to IV glucose therapy.",
        "Routine blood glucose screening is recommended for neonates in specific high-risk categories, not for all healthy term neonates. The primary risk groups include: (1) Large for gestational age (LGA) infants: birth weight >90th percentile or >4000g, at risk due to possible maternal diabetes (diagnosed or undiagnosed) with resultant fetal hyperinsulinism. (2) Small for gestational age (SGA) infants: birth weight <10th percentile, at risk due to decreased glycogen stores and limited fat reserves for energy production. (3) Infants of diabetic mothers (IDM): regardless of birth weight, at risk due to fetal hyperinsulinism in response to chronic intrauterine hyperglycemia. (4) Preterm infants: reduced glycogen stores, immature hepatic gluconeogenesis, and immature counter-regulatory hormone responses. (5) Late preterm infants (34-36 weeks): often overlooked but have similar metabolic vulnerabilities. Screening typically begins within the first hour of life and continues per protocol (usually every 1-3 hours for the first 12-24 hours, depending on risk level and glucose stability). Asymptomatic hypoglycemia requires feeding intervention, while symptomatic hypoglycemia may require IV glucose. Universal screening of all healthy term AGA neonates is not recommended as it increases false positives and unnecessary interventions.",
      ],
      clinicalPearlSets: [
        ["Feed first for symptomatic hypoglycemia if infant can suck; IV glucose for severe or refractory cases", "IDM are at high risk due to fetal hyperinsulinism from chronic maternal hyperglycemia"],
        ["Screen LGA, SGA, IDM, and preterm infants for hypoglycemia", "Begin screening within the first hour of life for high-risk neonates"],
      ],
      difficulty: [3, 2],
      cognitiveLevel: ["application", "recall"],
      lessonPath: "/pediatrics/lessons/neonatal-care",
    },
  ];

  for (const ts of templateSets) {
    for (let i = 0; i < ts.stems.length; i++) {
      questions.push({
        stem: ts.stems[i],
        options: ts.optionSets[i],
        correctAnswer: ts.correctAnswers[i],
        rationale: ts.rationales[i],
        clinicalPearls: ts.clinicalPearlSets[i],
        distractorRationales: ts.optionSets[i].map((o, idx) => idx === ts.correctAnswers[i] ? `${o.label} is correct` : `${o.label} is incorrect`),
        learningObjective: `The student will demonstrate understanding of ${ts.subtopic} in neonatal care`,
        cognitiveLevel: ts.cognitiveLevel[i],
        difficulty: ts.difficulty[i],
        questionType: "MCQ_SINGLE",
        subtopic: ts.subtopic,
        lessonPath: ts.lessonPath,
        safetyNote: "",
        examTrap: "",
        tags: [ts.subtopic.toLowerCase().replace(/\s+/g, "-"), "neonatal"],
      });
    }
  }

  return questions;
}

function generateDomainQuestions(domain: string, target: number): QuestionData[] {
  if (domain === "Neonatal Care") return buildNeonatalQuestions();
  return generateTemplatedQuestions(domain, target);
}

function generateTemplatedQuestions(domain: string, target: number): QuestionData[] {
  const questions: QuestionData[] = [];
  const templates = getDomainTemplates(domain);
  
  for (let i = 0; i < templates.length && questions.length < target; i++) {
    questions.push(templates[i]);
  }
  
  return questions;
}

function getDomainTemplates(domain: string): QuestionData[] {
  const lessonPaths = LESSON_PATH_MAP[domain] || [];
  const lp = (i: number) => lessonPaths[i % lessonPaths.length];
  
  if (domain === "Developmental Milestones") return getDevelopmentalTemplates(lp);
  if (domain === "Pediatric Infections") return getInfectionTemplates(lp);
  if (domain === "Congenital Disorders") return getCongenitalTemplates(lp);
  if (domain === "Pediatric Emergencies") return getEmergencyTemplates(lp);
  return [];
}

function getDevelopmentalTemplates(lp: (i: number) => string): QuestionData[] {
  return [
    {
      stem: "A nurse is assessing a 6-month-old infant during a well-child visit. The infant can sit with support, transfer objects between hands, and babbles with consonant sounds. The mother asks if her baby is developing normally. Based on the Denver Developmental Screening Test, the nurse's best response is:",
      options: [
        { label: "A", text: "Your baby is behind in motor development and needs a referral" },
        { label: "B", text: "Your baby is meeting expected developmental milestones for 6 months of age" },
        { label: "C", text: "Your baby should be walking by now; let me refer you to a specialist" },
        { label: "D", text: "These milestones are typical for a 12-month-old, so your baby is advanced" },
      ],
      correctAnswer: 1,
      rationale: "At 6 months of age, expected developmental milestones include: Gross motor: sits with support, rolls both ways, bears weight on legs when held upright. Fine motor: reaches for and grasps objects, transfers objects between hands, uses a raking grasp. Language: babbles with consonant sounds (ba, da, ma), responds to own name, shows interest in sounds. Social-emotional: recognizes familiar faces, begins to show stranger anxiety, enjoys social play. The infant described in this scenario is meeting all expected 6-month milestones appropriately. The Denver Developmental Screening Test (DDST-II) evaluates four domains: gross motor, fine motor-adaptive, language, and personal-social. Items are plotted against age norms to identify children who may need further evaluation. A child who passes items at the expected age percentile is considered developmentally on track. Walking independently is a milestone expected at 12 months (with a normal range of 9-15 months), not 6 months. The 6-month milestones described are not typical of 12 months, which would include standing alone, taking steps, using 1-2 words, and using a pincer grasp. The nurse should reassure the mother, provide anticipatory guidance for upcoming milestones, and discuss age-appropriate safety concerns (choking hazards, falls from surfaces, water safety).",
      clinicalPearls: ["6-month milestones: sits with support, transfers objects, babbles consonants", "Walking independently is expected around 12 months, not 6 months"],
      distractorRationales: ["The infant's milestones are age-appropriate; no referral needed", "Correct: these milestones match expected 6-month development", "Walking is a 12-month milestone, not 6-month", "These milestones are age-appropriate for 6 months, not advanced to 12 months"],
      learningObjective: "The student will identify age-appropriate developmental milestones for a 6-month-old infant",
      cognitiveLevel: "application", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Gross Motor Development", lessonPath: lp(0),
      safetyNote: "Always compare milestones to age-specific norms", examTrap: "Walking is a 12-month milestone, not 6 months",
      tags: ["developmental-milestones", "6-months", "denver-screening"],
    },
    {
      stem: "A 15-month-old toddler is brought to the clinic. The parent reports the child says 'mama' and 'dada' specifically, points to desired objects, and follows simple one-step commands like 'give me the ball.' The child walks independently but is unsteady. According to Erik Erikson's psychosocial development theory, this child is in which stage?",
      options: [
        { label: "A", text: "Trust vs. Mistrust" },
        { label: "B", text: "Autonomy vs. Shame and Doubt" },
        { label: "C", text: "Initiative vs. Guilt" },
        { label: "D", text: "Industry vs. Inferiority" },
      ],
      correctAnswer: 1,
      rationale: "Erik Erikson's theory of psychosocial development identifies eight stages across the lifespan, each characterized by a central conflict that must be resolved for healthy development. The stages relevant to pediatric nursing are: Trust vs. Mistrust (birth to 18 months), Autonomy vs. Shame and Doubt (18 months to 3 years), Initiative vs. Guilt (3-6 years), and Industry vs. Inferiority (6-12 years). At 15 months, this child is approaching the transition from Trust vs. Mistrust to Autonomy vs. Shame and Doubt. However, at 15 months, the child is still primarily in the Autonomy vs. Shame and Doubt stage as they are beginning to assert independence through walking, exploring, and making choices. The developmental achievements described (walking independently, using specific words, pointing, following commands) align with the emerging autonomy of this stage. During this stage, toddlers develop a sense of personal control and independence. If caregivers encourage appropriate self-directed behavior and exploration while maintaining safety, the child develops autonomy. If caregivers are overly restrictive or punitive, the child may develop shame and doubt. Nursing implications include encouraging safe exploration, offering limited choices (do you want the red cup or blue cup), and supporting the parent in setting appropriate limits while allowing independence. Trust vs. Mistrust is the stage from birth to 18 months, but at 15 months the child is transitioning. Initiative vs. Guilt applies to preschoolers (3-6 years), and Industry vs. Inferiority applies to school-age children (6-12 years).",
      clinicalPearls: ["Autonomy vs. Shame: 18 months-3 years; encourage safe exploration and choices", "15-month milestones: walks independently, 3-5 words, points, follows 1-step commands"],
      distractorRationales: ["Trust vs. Mistrust covers birth-18 months but child is transitioning out", "Autonomy vs. Shame and Doubt is the appropriate stage for this toddler", "Initiative vs. Guilt applies to preschoolers ages 3-6 years", "Industry vs. Inferiority applies to school-age children ages 6-12 years"],
      learningObjective: "The student will apply Erikson's psychosocial stages to pediatric age groups",
      cognitiveLevel: "application", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Erikson Psychosocial Stages", lessonPath: lp(1),
      safetyNote: "", examTrap: "Know the age ranges for each Erikson stage precisely",
      tags: ["erikson", "psychosocial", "toddler", "developmental-theory"],
    },
    {
      stem: "During a well-child visit, the nurse administers the M-CHAT-R/F (Modified Checklist for Autism in Toddlers, Revised with Follow-Up) to the parents of an 18-month-old child. At what age(s) does the American Academy of Pediatrics recommend universal autism screening?",
      options: [
        { label: "A", text: "6 months and 12 months" },
        { label: "B", text: "18 months and 24 months" },
        { label: "C", text: "36 months and 48 months" },
        { label: "D", text: "Only when parents express developmental concerns" },
      ],
      correctAnswer: 1,
      rationale: "The American Academy of Pediatrics (AAP) recommends universal autism spectrum disorder (ASD) screening using the M-CHAT-R/F at 18 months and 24 months of age for all children, regardless of whether parents have expressed concerns about their child's development. This universal screening approach is critical because: (1) Many parents do not recognize early signs of autism, particularly if it is their first child or if the presentation is subtle. (2) Early identification (before age 3) allows for early intervention services, which significantly improve outcomes for children with ASD. (3) Research demonstrates that structured screening tools identify children who would otherwise not be recognized until school age, when intervention opportunities are more limited. The M-CHAT-R/F is a validated parent-report screening tool consisting of 20 yes/no questions that assess social communication, social interaction, and restricted/repetitive behaviors. A positive screen (score >= 3) triggers the follow-up interview to reduce false positives. Children who screen positive on the follow-up should be referred for comprehensive diagnostic evaluation. Early signs of ASD that the nurse should assess include: lack of pointing by 12 months, no single words by 16 months, no two-word phrases by 24 months, loss of previously acquired language or social skills (regression), reduced eye contact, and lack of response to name. General developmental screening with the ASQ-3 is recommended at 9, 18, and 30 months.",
      clinicalPearls: ["AAP recommends universal autism screening with M-CHAT-R/F at 18 and 24 months", "Early identification before age 3 significantly improves outcomes with early intervention"],
      distractorRationales: ["6 and 12 months are too early for formal autism screening tools", "18 and 24 months is the correct AAP recommendation for universal autism screening", "36 and 48 months would miss the critical early intervention window", "Universal screening catches cases that would be missed by concern-based screening"],
      learningObjective: "The student will identify the recommended ages for universal autism screening",
      cognitiveLevel: "recall", difficulty: 1, questionType: "MCQ_SINGLE",
      subtopic: "M-CHAT Autism Screening", lessonPath: lp(2),
      safetyNote: "", examTrap: "Universal screening is recommended regardless of parental concerns",
      tags: ["autism-screening", "M-CHAT", "AAP-guidelines", "developmental-screening"],
    },
    {
      stem: "A 7-year-old child has been diagnosed with ADHD. The provider prescribes methylphenidate (Ritalin). Which monitoring parameter is MOST important for the nurse to assess at each follow-up visit?",
      options: [
        { label: "A", text: "Liver function tests and hepatic enzyme levels" },
        { label: "B", text: "Height, weight, heart rate, and blood pressure" },
        { label: "C", text: "Renal function tests including BUN and creatinine" },
        { label: "D", text: "Thyroid function tests including TSH and free T4" },
      ],
      correctAnswer: 1,
      rationale: "Methylphenidate (Ritalin) is a central nervous system (CNS) stimulant that increases dopamine and norepinephrine levels in the prefrontal cortex to improve attention, focus, and executive function in children with ADHD. It is the first-line pharmacological treatment for ADHD in children aged 6 years and older. The most important monitoring parameters at each follow-up visit include: (1) Height and Weight: Stimulant medications suppress appetite, which can lead to decreased caloric intake and growth suppression. The nurse should plot height and weight on growth charts at every visit to detect growth deceleration. If significant growth suppression occurs, the provider may consider dose adjustment, medication holidays during school breaks, or switching to a non-stimulant alternative. (2) Heart Rate and Blood Pressure: Stimulants have sympathomimetic effects that can increase heart rate and blood pressure. Cardiovascular screening before starting stimulants is recommended, including a thorough cardiac history and baseline vital signs. An ECG may be obtained if there is a family history of sudden cardiac death, cardiomyopathy, or known cardiac conditions. (3) Behavioral assessment: monitoring for effectiveness of medication and emergence of adverse effects including insomnia, mood changes, tics, and irritability. The nurse should also assess for proper medication timing (administered in the morning to avoid insomnia) and adherence. Liver function tests, renal function tests, and thyroid tests are not routine monitoring parameters for methylphenidate therapy unless specifically indicated by other clinical concerns.",
      clinicalPearls: ["Monitor height, weight, HR, and BP at every visit for children on stimulant therapy", "Administer methylphenidate in the morning to minimize insomnia"],
      distractorRationales: ["Liver function tests are not routine monitoring for methylphenidate", "Height, weight, HR, and BP monitoring is the correct priority", "Renal function tests are not routine for stimulant therapy", "Thyroid function tests are not routinely monitored for ADHD medication"],
      learningObjective: "The student will identify priority monitoring parameters for children on stimulant medications",
      cognitiveLevel: "application", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "ADHD Assessment", lessonPath: lp(0),
      safetyNote: "Cardiovascular screening recommended before starting stimulant therapy",
      examTrap: "Growth parameters (not liver/renal function) are the priority monitoring for stimulants",
      tags: ["ADHD", "methylphenidate", "stimulant-monitoring", "growth-parameters"],
    },
    {
      stem: "A nurse is assessing a 4-year-old preschooler. According to Piaget's theory of cognitive development, which cognitive characteristic is expected at this age?",
      options: [
        { label: "A", text: "Abstract reasoning and hypothetical thinking" },
        { label: "B", text: "Magical thinking and egocentrism with animism" },
        { label: "C", text: "Conservation of number and volume" },
        { label: "D", text: "Object permanence and circular reactions" },
      ],
      correctAnswer: 1,
      rationale: "Jean Piaget's theory of cognitive development describes four stages through which children progress in their thinking abilities. A 4-year-old preschooler is in the Preoperational Stage (ages 2-7 years), which is characterized by several key cognitive features: (1) Magical thinking: the child believes that thoughts, wishes, or actions can directly influence events. For example, a child may believe they caused a parent's illness by being angry. This has significant nursing implications, particularly in hospitalized children who may believe their illness is a punishment. (2) Egocentrism: the child can only see the world from their own perspective and cannot understand that others have different viewpoints. This affects communication strategies; the nurse should use concrete, direct language. (3) Animism: the child attributes human qualities to inanimate objects (believing that a stuffed animal feels pain). This can be therapeutic: using dolls for medical play preparation. (4) Transductive reasoning: the child connects two unrelated events as cause and effect. (5) Centration: focusing on only one aspect of a situation. Abstract reasoning (formal operational stage, 12+ years), conservation (concrete operational, 7-11 years), and object permanence (sensorimotor stage, 0-2 years) are characteristic of other developmental stages. Understanding Piaget's stages helps nurses communicate effectively, prepare children for procedures appropriately, and provide age-appropriate education.",
      clinicalPearls: ["Preoperational stage (2-7 years): magical thinking, egocentrism, animism", "Children in this stage may believe illness is punishment; use therapeutic communication"],
      distractorRationales: ["Abstract reasoning develops in the formal operational stage (12+ years)", "Magical thinking and egocentrism are correct for the preoperational stage (2-7 years)", "Conservation develops in the concrete operational stage (7-11 years)", "Object permanence develops in the sensorimotor stage (0-2 years)"],
      learningObjective: "The student will identify Piaget's cognitive development stages and their characteristics",
      cognitiveLevel: "recall", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Piaget Cognitive Stages", lessonPath: lp(3),
      safetyNote: "", examTrap: "Piaget stages: Sensorimotor (0-2), Preoperational (2-7), Concrete (7-11), Formal (12+)",
      tags: ["piaget", "cognitive-development", "preoperational", "preschooler"],
    },
    {
      stem: "A nurse is reviewing the immunization record of a 2-month-old infant. Which vaccines should the nurse expect to administer at this visit according to the CDC immunization schedule?",
      options: [
        { label: "A", text: "MMR, Varicella, and Hepatitis A" },
        { label: "B", text: "DTaP, IPV, Hib, PCV13, Rotavirus, and Hepatitis B (dose 2)" },
        { label: "C", text: "Tdap, HPV, and Meningococcal" },
        { label: "D", text: "Influenza and COVID-19 vaccines only" },
      ],
      correctAnswer: 1,
      rationale: "The CDC/ACIP recommended immunization schedule for a 2-month-old infant includes multiple vaccines administered simultaneously. The 2-month visit is one of the most critical vaccination appointments as it provides the first doses of protection against several serious diseases: (1) DTaP (Diphtheria, Tetanus, acellular Pertussis): First dose of a 5-dose series. Protects against three bacterial diseases; pertussis (whooping cough) is particularly dangerous in young infants. (2) IPV (Inactivated Poliovirus Vaccine): First dose of a 4-dose series. Protects against poliomyelitis. (3) Hib (Haemophilus influenzae type b): First dose. Protects against bacterial meningitis, epiglottitis, and sepsis. (4) PCV13 (Pneumococcal Conjugate Vaccine): First dose. Protects against pneumococcal diseases including meningitis, bacteremia, and otitis media. (5) Rotavirus (RV): First dose of an oral vaccine series. Protects against the most common cause of severe dehydrating gastroenteritis in infants. Given orally, not by injection. (6) Hepatitis B: Second dose (first dose given at birth). The nurse should educate parents about expected side effects (mild fever, fussiness, injection site soreness), use of acetaminophen for fever management, and the importance of completing the full vaccination series. MMR and Varicella are given at 12-15 months, Tdap and HPV are given at 11-12 years, and influenza vaccine is recommended starting at 6 months of age.",
      clinicalPearls: ["2-month vaccines: DTaP, IPV, Hib, PCV13, Rotavirus (oral), HepB dose 2", "Rotavirus vaccine is given ORALLY, not by injection"],
      distractorRationales: ["MMR and Varicella are given at 12-15 months, not 2 months", "DTaP, IPV, Hib, PCV13, Rotavirus, and HepB dose 2 are correct for 2 months", "Tdap and HPV are given at 11-12 years, not 2 months", "Influenza vaccine starts at 6 months; COVID vaccines have different age criteria"],
      learningObjective: "The student will identify the vaccines recommended at the 2-month well-child visit",
      cognitiveLevel: "recall", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Immunization Schedule", lessonPath: lp(4),
      safetyNote: "Never administer live vaccines to immunocompromised patients without provider approval",
      examTrap: "Rotavirus is the only ORAL vaccine in the routine infant schedule",
      tags: ["immunizations", "2-month-vaccines", "CDC-schedule", "infant"],
    },
    {
      stem: "A nurse is conducting a developmental assessment on a 9-month-old infant. Which finding would be MOST concerning and require further evaluation?",
      options: [
        { label: "A", text: "The infant does not walk independently" },
        { label: "B", text: "The infant does not respond to their name or make eye contact" },
        { label: "C", text: "The infant uses a raking grasp instead of a pincer grasp" },
        { label: "D", text: "The infant demonstrates stranger anxiety when unfamiliar adults approach" },
      ],
      correctAnswer: 1,
      rationale: "At 9 months of age, the most concerning finding among these options is the infant not responding to their name or making eye contact. These are critical social communication milestones, and their absence may be early indicators of autism spectrum disorder (ASD) or other developmental concerns. By 9 months, infants should: respond to their own name by turning toward the speaker, make eye contact during social interactions, show social referencing (looking to caregiver for emotional cues), demonstrate joint attention (following a point or shared gaze), and engage in reciprocal social games like peek-a-boo. The absence of these social communication behaviors warrants immediate referral for developmental evaluation. Not walking independently is completely normal at 9 months; independent walking typically develops between 12-15 months. Using a raking grasp at 9 months is developmentally appropriate; the pincer grasp (thumb and forefinger) develops between 9-12 months. Stranger anxiety is a NORMAL developmental phenomenon that peaks around 8-10 months, reflecting healthy attachment formation and the ability to differentiate familiar from unfamiliar faces. It actually represents positive cognitive and social development. The nurse should use validated developmental screening tools (ASQ-3, M-CHAT-R/F at 18-24 months) and make appropriate referrals based on red flag findings.",
      clinicalPearls: ["Not responding to name or lack of eye contact at 9 months are red flags for ASD", "Stranger anxiety at 8-10 months is NORMAL and reflects healthy attachment"],
      distractorRationales: ["Not walking at 9 months is normal; independent walking develops at 12-15 months", "Not responding to name or making eye contact is the most concerning finding", "Raking grasp at 9 months is normal; pincer grasp develops at 9-12 months", "Stranger anxiety is a normal developmental phenomenon at this age"],
      learningObjective: "The student will identify developmental red flags requiring further evaluation",
      cognitiveLevel: "analysis", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Denver Developmental Screening", lessonPath: lp(2),
      safetyNote: "Early identification of developmental concerns allows for early intervention", examTrap: "Stranger anxiety is NORMAL at 8-10 months; lack of social engagement is concerning",
      tags: ["developmental-screening", "red-flags", "autism", "9-months"],
    },
    {
      stem: "A 2.5-year-old toddler's parent asks the nurse when toilet training should begin. Which sign indicates the child is ready for toilet training?",
      options: [
        { label: "A", text: "The child can stay dry for at least 2 hours and shows interest in the toilet" },
        { label: "B", text: "The child has reached 18 months of age, which is the standard starting age" },
        { label: "C", text: "The child can say 'no' to diaper changes, indicating they want underwear" },
        { label: "D", text: "The child watches older siblings use the bathroom" },
      ],
      correctAnswer: 0,
      rationale: "Toilet training readiness depends on a combination of physiological, cognitive, and behavioral indicators, not a specific age. Most children are ready between 18-36 months, but readiness varies significantly among individuals. Key readiness signs include: Physiological readiness: the child can stay dry for at least 2 hours, indicating bladder maturity; they have predictable bowel movements; they demonstrate awareness of the need to urinate or defecate (pausing during play, squatting, hiding). Motor readiness: the child can walk to the bathroom, sit on the toilet, pull pants up and down, and maintain balance while sitting. Cognitive readiness: the child can follow simple 2-step instructions, understand and communicate the concept of 'wet' vs 'dry,' and show interest in using the toilet or wearing underwear. Behavioral readiness: the child expresses discomfort with wet or soiled diapers, shows interest in the toilet or in imitating bathroom behavior, and demonstrates desire for independence (consistent with Erikson's Autonomy vs. Shame and Doubt stage). The nurse should advise parents to wait for readiness signs rather than forcing early training, as premature attempts can lead to resistance, regression, and prolonged training. Positive reinforcement, consistency, and patience are key strategies. The child staying dry for 2 hours and showing interest demonstrates both physiological maturity and cognitive readiness.",
      clinicalPearls: ["Toilet training readiness: dry for 2+ hours, interest in toilet, can follow instructions", "Average readiness age is 18-36 months; readiness signs matter more than specific age"],
      distractorRationales: ["Staying dry for 2 hours with interest indicates both physiological and cognitive readiness", "18 months is not a universal starting age; readiness signs are more important", "Saying 'no' to diapers alone does not indicate readiness for toilet training", "Observation alone does not demonstrate the child's own readiness cues"],
      learningObjective: "The student will identify signs of toilet training readiness in toddlers",
      cognitiveLevel: "application", difficulty: 1, questionType: "MCQ_SINGLE",
      subtopic: "Toilet Training Readiness", lessonPath: lp(0),
      safetyNote: "", examTrap: "Readiness signs, not age alone, determine toilet training timing",
      tags: ["toilet-training", "toddler", "developmental-readiness"],
    },
  ];
}

function getInfectionTemplates(lp: (i: number) => string): QuestionData[] {
  return [
    {
      stem: "A 10-month-old infant is brought to the emergency department with 2 days of vomiting followed by profuse watery, non-bloody diarrhea and decreased wet diapers. The fontanelle is sunken and mucous membranes are dry. Vital signs: HR 172 bpm, RR 34/min, T 38.2°C. The nurse suspects rotavirus gastroenteritis. What is the PRIORITY nursing intervention?",
      options: [
        { label: "A", text: "Administer oral antibiotics to treat the infection" },
        { label: "B", text: "Assess dehydration severity and initiate oral rehydration therapy" },
        { label: "C", text: "Apply cooling measures to reduce the fever first" },
        { label: "D", text: "Administer loperamide (Imodium) to reduce diarrhea frequency" },
      ],
      correctAnswer: 1,
      rationale: "This clinical scenario presents a 10-month-old infant with classic rotavirus gastroenteritis and signs of moderate dehydration. Rotavirus is the leading cause of severe dehydrating diarrhea in infants and young children, most commonly affecting children between 6 months and 2 years of age. The priority nursing intervention is to assess the degree of dehydration and initiate oral rehydration therapy (ORT). Dehydration assessment includes: sunken fontanelle (present in this case), dry mucous membranes (present), decreased urine output/wet diapers (present), tachycardia (HR 172 - present and significant), skin turgor assessment, capillary refill time, and mental status. Based on WHO criteria, this infant appears to have moderate dehydration (5-10% body weight loss). For moderate dehydration, ORT with oral rehydration solution (ORS) is the first-line treatment, administered as 50-100 mL/kg over 3-4 hours. Small, frequent sips (5-10 mL every 5 minutes by syringe or spoon) are better tolerated than large volumes. If the infant cannot tolerate oral fluids or has severe dehydration (>10%), IV fluid resuscitation with 20 mL/kg isotonic saline boluses is required. Antibiotics are NOT indicated for rotavirus because it is a viral illness. Loperamide is CONTRAINDICATED in children under 6 years due to the risk of toxic megacolon and paralytic ileus. While fever management is important, addressing dehydration is the higher priority as hypovolemia poses the most immediate life-threatening risk.",
      clinicalPearls: ["Rotavirus: most common cause of severe dehydrating diarrhea in infants", "ORT is first-line; assess dehydration severity using WHO criteria"],
      distractorRationales: ["Antibiotics are ineffective against viral infections", "Dehydration assessment and ORT is the correct priority intervention", "Fever management is secondary to addressing hypovolemia from dehydration", "Loperamide is contraindicated in children under 6 years"],
      learningObjective: "The student will prioritize nursing interventions for a dehydrated infant with rotavirus",
      cognitiveLevel: "analysis", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Rotavirus", lessonPath: lp(0),
      safetyNote: "Loperamide is CONTRAINDICATED in children under 6 years",
      examTrap: "ORT, not IV fluids, is first-line for moderate dehydration in infants",
      tags: ["rotavirus", "dehydration", "ORT", "infant"],
    },
    {
      stem: "A 3-year-old child with a fever of 39.5°C has been diagnosed with Kawasaki disease on day 7 of illness. The child's echocardiogram shows mild coronary artery dilation. The nurse anticipates which treatment will be ordered?",
      options: [
        { label: "A", text: "Oral ibuprofen and rest for 2 weeks" },
        { label: "B", text: "Intravenous immunoglobulin (IVIG) and high-dose aspirin" },
        { label: "C", text: "IV antibiotics for 14 days" },
        { label: "D", text: "Corticosteroids as the sole treatment" },
      ],
      correctAnswer: 1,
      rationale: "Kawasaki disease is an acute systemic vasculitis that primarily affects small and medium-sized arteries, with a particular predilection for the coronary arteries. It most commonly affects children under 5 years of age, with peak incidence at 18-24 months. The standard treatment for Kawasaki disease is a combination of IVIG (intravenous immunoglobulin) and high-dose aspirin, administered within 10 days of illness onset to reduce the risk of coronary artery aneurysm formation. IVIG is given as a single infusion of 2 g/kg over 10-12 hours. It acts as a broad anti-inflammatory agent that reduces vascular inflammation and prevents coronary artery damage. High-dose aspirin (80-100 mg/kg/day in divided doses) is given for its anti-inflammatory properties during the acute febrile phase. Once the fever resolves, the dose is reduced to low-dose aspirin (3-5 mg/kg/day) for its antiplatelet effect, continued for 6-8 weeks or longer if coronary abnormalities are present. This is one of the few situations where aspirin is used in children, as it is normally avoided due to the risk of Reye syndrome. The exception is made because the benefit of preventing coronary artery damage outweighs the risk of Reye syndrome. Nursing considerations include: monitoring for IVIG infusion reactions (fever, chills, rigors), monitoring temperature trends (persistent or recurrent fever may indicate IVIG resistance), cardiac monitoring, and educating families that live vaccines (MMR, varicella) must be delayed for 11 months after IVIG administration because IVIG antibodies can interfere with vaccine immunogenicity.",
      clinicalPearls: ["Kawasaki treatment: IVIG 2g/kg + high-dose aspirin within 10 days of onset", "Delay live vaccines 11 months after IVIG administration"],
      distractorRationales: ["Ibuprofen alone is insufficient; IVIG is required to prevent coronary damage", "IVIG plus high-dose aspirin is the standard treatment for Kawasaki disease", "Kawasaki disease is not bacterial; antibiotics are ineffective", "Corticosteroids may be used as adjunct therapy but not as sole treatment"],
      learningObjective: "The student will identify the standard treatment for Kawasaki disease",
      cognitiveLevel: "application", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Kawasaki Disease", lessonPath: lp(4),
      safetyNote: "Aspirin is used in Kawasaki despite Reye syndrome risk; benefit outweighs risk",
      examTrap: "Live vaccines must be delayed 11 months after IVIG, not just a few weeks",
      tags: ["kawasaki", "IVIG", "aspirin", "coronary-artery"],
    },
    {
      stem: "A nurse is caring for a 5-year-old child diagnosed with varicella (chickenpox). The child has widespread vesicular lesions in various stages of development and a temperature of 38.8°C. The parent asks if they can give aspirin for the fever. What is the nurse's best response?",
      options: [
        { label: "A", text: "Aspirin is appropriate for children with viral infections for fever reduction" },
        { label: "B", text: "Do NOT give aspirin; it increases the risk of Reye syndrome in children with viral infections. Use acetaminophen instead" },
        { label: "C", text: "Aspirin is safe if given in small doses with food" },
        { label: "D", text: "Aspirin can be given but only if the fever exceeds 40°C" },
      ],
      correctAnswer: 1,
      rationale: "Aspirin (salicylates) is absolutely contraindicated in children under 19 years of age with viral infections, particularly varicella (chickenpox) and influenza, due to the risk of Reye syndrome. Reye syndrome is a rare but potentially fatal condition characterized by acute non-inflammatory encephalopathy and hepatic dysfunction. The pathophysiology involves mitochondrial damage in the liver and brain, leading to cerebral edema, increased intracranial pressure, hepatic failure, hyperammonemia, and multi-organ dysfunction. The association between aspirin use during viral illness and Reye syndrome was established through epidemiological studies in the 1980s, leading to FDA warnings and a dramatic decrease in Reye syndrome incidence. Symptoms of Reye syndrome include: persistent vomiting beginning days after apparent recovery from viral illness, progressive encephalopathy (irritability, lethargy, confusion, delirium, seizures, coma), hepatomegaly, and elevated liver enzymes and ammonia levels. The nurse should educate the parent to use acetaminophen (Tylenol) at 10-15 mg/kg/dose every 4-6 hours as needed for fever and discomfort, with a maximum of 5 doses in 24 hours. Ibuprofen (Advil/Motrin) is generally not recommended in varicella because some studies suggest it may increase the risk of necrotizing fasciitis (group A strep secondary skin infection). For varicella-specific care, the nurse should also advise: keeping fingernails short to prevent scratching and secondary bacterial infection, using calamine lotion or oatmeal baths for itching, and monitoring for complications including bacterial superinfection, pneumonia, and encephalitis.",
      clinicalPearls: ["NEVER give aspirin to children with viral infections; risk of Reye syndrome", "Use acetaminophen for fever in varicella; avoid ibuprofen (necrotizing fasciitis risk)"],
      distractorRationales: ["Aspirin is contraindicated in children with viral infections due to Reye syndrome risk", "Correct: aspirin is contraindicated; acetaminophen is the safe alternative", "No dose of aspirin is safe in children with viral infections", "The temperature threshold does not change the contraindication"],
      learningObjective: "The student will identify the contraindication of aspirin in pediatric viral infections",
      cognitiveLevel: "application", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Varicella", lessonPath: lp(2),
      safetyNote: "Aspirin + viral infection in children = Reye syndrome risk; NEVER give aspirin",
      examTrap: "Ibuprofen may increase necrotizing fasciitis risk in varicella; use acetaminophen",
      tags: ["varicella", "reye-syndrome", "aspirin-contraindication", "fever-management"],
    },
    {
      stem: "A 6-month-old infant presents with nasal congestion, wheezing, tachypnea (RR 62/min), and intercostal retractions. The infant has a low-grade fever and was previously healthy. Nasal wash is positive for respiratory syncytial virus (RSV). What is the PRIORITY nursing intervention?",
      options: [
        { label: "A", text: "Administer nebulized albuterol for bronchodilation" },
        { label: "B", text: "Maintain airway patency through bulb suctioning, elevate head of bed, and monitor oxygen saturation" },
        { label: "C", text: "Start IV antibiotics for presumed bacterial pneumonia" },
        { label: "D", text: "Administer palivizumab (Synagis) for treatment of the active RSV infection" },
      ],
      correctAnswer: 1,
      rationale: "RSV (Respiratory Syncytial Virus) bronchiolitis is the most common lower respiratory tract infection in infants, with peak incidence at 2-6 months of age. RSV infects the bronchiolar epithelium, causing inflammation, edema, mucus production, and necrosis of the epithelial cells. This leads to small airway obstruction, air trapping, and ventilation-perfusion mismatch. Management of RSV bronchiolitis is primarily supportive, as no specific antiviral therapy is routinely recommended. The priority nursing interventions include: (1) Maintaining airway patency through gentle nasal suctioning with a bulb syringe or mechanical suction, as infants under 4-6 months are obligate nasal breathers and nasal congestion significantly impairs their breathing. (2) Elevating the head of the bed 30 degrees to reduce respiratory effort and promote drainage. (3) Continuous pulse oximetry monitoring with supplemental oxygen as needed to maintain SpO2 above 90%. (4) Monitoring respiratory status including rate, effort, and signs of increasing distress. (5) Maintaining hydration through frequent small feedings or IV fluids if the infant is too tachypneic to feed safely (respiratory rate >60 increases aspiration risk). Nebulized albuterol has not been shown to be effective in RSV bronchiolitis and is NOT recommended by the AAP for routine use. Antibiotics are not indicated for a viral infection unless a secondary bacterial infection is suspected. Palivizumab (Synagis) is a monoclonal antibody given for RSV PREVENTION (prophylaxis) in high-risk infants, NOT for treatment of active infection.",
      clinicalPearls: ["RSV management is supportive: suction, oxygen, hydration, monitoring", "Palivizumab is for RSV PREVENTION, not treatment of active infection"],
      distractorRationales: ["Albuterol is not recommended for RSV bronchiolitis per AAP guidelines", "Supportive care (suctioning, positioning, monitoring) is the correct priority", "Antibiotics are not indicated for viral RSV infection", "Palivizumab is prophylactic, not therapeutic; it does not treat active RSV"],
      learningObjective: "The student will identify priority nursing interventions for RSV bronchiolitis",
      cognitiveLevel: "analysis", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "RSV/Bronchiolitis", lessonPath: lp(3),
      safetyNote: "Infants with RR >60 are at increased aspiration risk during feeding",
      examTrap: "Palivizumab prevents RSV but does NOT treat active infection",
      tags: ["RSV", "bronchiolitis", "supportive-care", "infant"],
    },
    {
      stem: "A nurse is caring for a 4-year-old child with acute otitis media. The child is pulling at the right ear, crying, and has a temperature of 39.1°C. What is the first-line antibiotic treatment the nurse expects to be prescribed?",
      options: [
        { label: "A", text: "Azithromycin (Zithromax)" },
        { label: "B", text: "Amoxicillin" },
        { label: "C", text: "Ciprofloxacin ear drops" },
        { label: "D", text: "Cephalexin (Keflex)" },
      ],
      correctAnswer: 1,
      rationale: "Acute otitis media (AOM) is one of the most common pediatric infections, with peak incidence between 6 months and 2 years of age. The most common causative organisms are Streptococcus pneumoniae, Haemophilus influenzae (non-typeable), and Moraxella catarrhalis. Amoxicillin is the first-line antibiotic for AOM per AAP guidelines because: (1) It has excellent activity against S. pneumoniae, the most common and potentially most serious pathogen. (2) It achieves good middle ear fluid concentrations. (3) It is well-tolerated with a favorable safety profile in children. (4) It is available in a palatable liquid formulation for pediatric use. (5) It is cost-effective. The standard dose is 80-90 mg/kg/day divided into two doses for 10 days. High-dose amoxicillin (80-90 mg/kg/day rather than standard 40-45 mg/kg/day) is recommended to overcome intermediate penicillin resistance in S. pneumoniae. Azithromycin is reserved for children with true penicillin allergy. Ciprofloxacin ear drops are used for otitis externa, not otitis media. Cephalexin does not have optimal activity against the primary AOM pathogens. The nurse should educate parents about completing the full antibiotic course, pain management with acetaminophen or ibuprofen, and follow-up if symptoms worsen or do not improve within 48-72 hours. The AAP also recommends observation without antibiotics (watchful waiting) for children over 2 years with mild unilateral AOM and no complicating factors.",
      clinicalPearls: ["Amoxicillin 80-90 mg/kg/day is first-line for acute otitis media", "Watchful waiting may be appropriate for children >2 years with mild unilateral AOM"],
      distractorRationales: ["Azithromycin is second-line, reserved for penicillin-allergic patients", "Amoxicillin is the first-line treatment for acute otitis media", "Ciprofloxacin drops are for otitis externa, not otitis media", "Cephalexin is not optimal for the primary AOM pathogens"],
      learningObjective: "The student will identify the first-line antibiotic treatment for acute otitis media",
      cognitiveLevel: "recall", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Otitis Media", lessonPath: lp(1),
      safetyNote: "Always ask about penicillin allergy before administering amoxicillin",
      examTrap: "High-dose amoxicillin (80-90 mg/kg/day) is recommended to overcome penicillin resistance",
      tags: ["otitis-media", "amoxicillin", "antibiotic", "pediatric-infection"],
    },
    {
      stem: "A nurse is implementing infection control measures for a 2-year-old child admitted with rotavirus gastroenteritis. Which hand hygiene method is MOST effective against rotavirus?",
      options: [
        { label: "A", text: "Alcohol-based hand sanitizer for 15 seconds" },
        { label: "B", text: "Soap and water hand washing for at least 20 seconds" },
        { label: "C", text: "Antimicrobial wipes followed by air drying" },
        { label: "D", text: "Hand sanitizer with chlorhexidine" },
      ],
      correctAnswer: 1,
      rationale: "Rotavirus is a non-enveloped, double-stranded RNA virus that is extremely resistant to many common disinfectants, including alcohol-based hand sanitizers. The non-enveloped structure of rotavirus means it lacks the lipid membrane that alcohol disrupts in enveloped viruses. Therefore, alcohol-based hand sanitizers are NOT reliably effective against rotavirus. Soap and water hand washing for at least 20 seconds is the MOST effective hand hygiene method against rotavirus because: (1) The mechanical action of rubbing hands together with soap helps physically remove viral particles from the skin surface. (2) Soap disrupts the viral capsid through surfactant action, though this is less effective than with enveloped viruses. (3) Rinsing with water carries the disrupted and dislodged viral particles away. The CDC and WHO recommend soap and water hand washing specifically for rotavirus and other non-enveloped viruses (norovirus, Clostridium difficile spores). In addition to hand hygiene, the nurse should implement contact precautions (gown and gloves) for all patient interactions, use chlorine-based disinfectants for environmental cleaning (rotavirus survives on surfaces for days to weeks), and educate all caregivers and visitors about proper hand washing technique. Antimicrobial wipes and chlorhexidine-based sanitizers are also insufficient against non-enveloped viruses.",
      clinicalPearls: ["Alcohol-based sanitizers do NOT effectively kill rotavirus; use soap and water", "Rotavirus is non-enveloped; alcohol disrupts lipid envelopes, which rotavirus lacks"],
      distractorRationales: ["Alcohol-based sanitizers are ineffective against non-enveloped viruses like rotavirus", "Soap and water for 20+ seconds is the most effective method against rotavirus", "Antimicrobial wipes are insufficient against rotavirus", "Chlorhexidine-based products are not reliably effective against non-enveloped viruses"],
      learningObjective: "The student will identify the appropriate hand hygiene method for rotavirus",
      cognitiveLevel: "application", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Contact Precautions", lessonPath: lp(0),
      safetyNote: "Always use soap and water, not alcohol sanitizer, for C. diff and rotavirus",
      examTrap: "Alcohol sanitizers work on enveloped viruses but NOT non-enveloped ones like rotavirus",
      tags: ["rotavirus", "hand-hygiene", "infection-control", "contact-precautions"],
    },
  ];
}

function getCongenitalTemplates(lp: (i: number) => string): QuestionData[] {
  return [
    {
      stem: "A nurse is caring for a 4-month-old infant diagnosed with Tetralogy of Fallot. The infant suddenly becomes deeply cyanotic and irritable during a crying episode. The nurse recognizes this as a hypercyanotic ('Tet') spell. What is the IMMEDIATE nursing intervention?",
      options: [
        { label: "A", text: "Place the infant in a supine position and administer oxygen via nasal cannula" },
        { label: "B", text: "Place the infant in a knee-chest position and remain calm" },
        { label: "C", text: "Administer oral fluids to improve hydration" },
        { label: "D", text: "Prepare for immediate cardioversion" },
      ],
      correctAnswer: 1,
      rationale: "Tetralogy of Fallot (TOF) is the most common cyanotic congenital heart defect, consisting of four structural anomalies: (1) Ventricular Septal Defect (VSD), (2) Overriding aorta, (3) Pulmonary stenosis, and (4) Right ventricular hypertrophy. During a hypercyanotic (Tet) spell, the right ventricular outflow tract obstruction worsens (due to infundibular spasm), causing increased right-to-left shunting of deoxygenated blood across the VSD into the systemic circulation. This results in profound cyanosis and potential cardiovascular collapse. The IMMEDIATE nursing intervention is to place the infant in the knee-chest position. This position: (1) Increases systemic vascular resistance (SVR) by compressing the femoral arteries, which reduces the right-to-left shunt. (2) Decreases venous return from the lower extremities, reducing the volume of deoxygenated blood returning to the right heart. (3) Traps blood in the lower extremities, reducing the preload to the right ventricle. Additional interventions include: remaining calm (crying and agitation worsen the spell), administering 100% oxygen, calling for help, and anticipating medication orders including morphine sulfate (reduces ventilatory drive and relaxes infundibular spasm), IV fluids (volume expansion increases preload), and phenylephrine (increases SVR). The nurse should also prepare for possible intubation if the spell does not resolve. Older children may instinctively assume a squatting position, which serves the same hemodynamic purpose as the knee-chest position.",
      clinicalPearls: ["Knee-chest position increases SVR and reduces right-to-left shunting in Tet spells", "Older children with TOF instinctively squat for the same hemodynamic effect"],
      distractorRationales: ["Supine position does not increase SVR; knee-chest is the correct position", "Knee-chest position is the correct immediate intervention for Tet spells", "Oral fluids will not resolve the acute spell; IV fluids may be needed", "Cardioversion is not indicated; this is a structural/physiological event, not an arrhythmia"],
      learningObjective: "The student will identify the immediate intervention for a hypercyanotic Tet spell",
      cognitiveLevel: "application", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Tetralogy of Fallot", lessonPath: lp(0),
      safetyNote: "Tet spells can progress to cardiovascular collapse; respond immediately",
      examTrap: "Knee-chest (not supine) position is the immediate intervention for Tet spells",
      tags: ["TOF", "Tet-spell", "cyanotic-heart-defect", "knee-chest"],
    },
    {
      stem: "A nurse is caring for a 3-week-old infant who presents with projectile, non-bilious vomiting after every feeding. The infant appears hungry immediately after vomiting. On physical examination, an olive-shaped mass is palpable in the right upper quadrant. Which condition does the nurse suspect?",
      options: [
        { label: "A", text: "Intussusception" },
        { label: "B", text: "Pyloric stenosis" },
        { label: "C", text: "Gastroesophageal reflux disease" },
        { label: "D", text: "Hirschsprung disease" },
      ],
      correctAnswer: 1,
      rationale: "This clinical presentation is classic for pyloric stenosis (hypertrophic pyloric stenosis, HPS). Pyloric stenosis occurs when the pyloric sphincter muscle (the muscular ring at the junction of the stomach and duodenum) becomes abnormally thickened (hypertrophied), progressively narrowing the pyloric channel and eventually obstructing gastric outflow. Key diagnostic features include: (1) Projectile vomiting: non-bilious (because the obstruction is proximal to the ampulla of Vater where bile enters the duodenum), forceful, occurring after every feeding. (2) Olive-shaped mass: palpable in the right upper quadrant or epigastric area, representing the hypertrophied pylorus. (3) Hungry infant: the baby wants to feed immediately after vomiting because they have not absorbed any nutrients. (4) Typical onset: 2-8 weeks of age, more common in firstborn males (4:1 male-to-female ratio). (5) Associated metabolic abnormality: hypochloremic, hypokalemic metabolic alkalosis from loss of hydrochloric acid (HCl) through persistent vomiting. The diagnostic test of choice is abdominal ultrasound showing a thickened pyloric muscle (>4 mm thickness, >16 mm length). Treatment is pyloromyotomy (Ramstedt procedure), a surgical division of the hypertrophied muscle fibers. Pre-operative nursing care focuses on: correcting dehydration and electrolyte imbalances (especially metabolic alkalosis) before surgery, maintaining NPO status, IV fluid replacement, and monitoring intake and output. Intussusception presents with colicky pain and currant jelly stools, GERD involves non-projectile spitting up, and Hirschsprung disease presents with delayed meconium passage and abdominal distension.",
      clinicalPearls: ["Pyloric stenosis triad: projectile non-bilious vomiting, olive-shaped mass, hungry infant", "Metabolic consequence: hypochloremic, hypokalemic metabolic alkalosis from HCl loss"],
      distractorRationales: ["Intussusception presents with colicky pain and currant jelly stools, not projectile vomiting", "Pyloric stenosis is the correct diagnosis based on the classic triad of findings", "GERD involves non-projectile regurgitation, not projectile vomiting with a palpable mass", "Hirschsprung presents with delayed meconium, abdominal distension, not projectile vomiting"],
      learningObjective: "The student will differentiate pyloric stenosis from other GI conditions in infants",
      cognitiveLevel: "analysis", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Pyloric Stenosis", lessonPath: lp(1),
      safetyNote: "Correct electrolyte imbalances (metabolic alkalosis) BEFORE surgery",
      examTrap: "Pyloric stenosis vomiting is NON-bilious; bilious vomiting suggests obstruction below the ampulla",
      tags: ["pyloric-stenosis", "projectile-vomiting", "olive-mass", "pyloromyotomy"],
    },
    {
      stem: "A nurse is providing pre-operative teaching to parents of a 3-month-old infant scheduled for surgical repair of a cleft lip (cheiloplasty). Which post-operative nursing intervention is MOST important to prevent damage to the surgical repair?",
      options: [
        { label: "A", text: "Position the infant prone to facilitate drainage" },
        { label: "B", text: "Apply elbow restraints and avoid placing objects in the mouth, including straws and pacifiers" },
        { label: "C", text: "Encourage the infant to use a regular nipple for feeding as soon as possible" },
        { label: "D", text: "Allow the infant to cry freely to exercise the repaired muscles" },
      ],
      correctAnswer: 1,
      rationale: "Post-operative care after cleft lip repair (cheiloplasty) focuses on protecting the surgical suture line from tension, trauma, and contamination. The MOST important intervention is to prevent the infant from touching, rubbing, or putting objects near the repaired lip. Elbow restraints (Logan bow or arm restraints) are applied to prevent the infant from reaching the surgical site with their hands. Key post-operative nursing interventions include: (1) Elbow restraints: applied to prevent the infant from touching the suture line. Restraints should be removed periodically (one at a time) to allow range of motion, but the infant must be supervised at all times when restraints are off. (2) Avoid objects in the mouth: pacifiers, regular nipples, straws, and suction catheters near the repair site are prohibited as they create tension on the suture line. (3) Feeding modifications: use a specialized feeder (Haberman feeder, Mead-Johnson cleft palate nurser, or cup/spoon feeding) that does not require sucking, which creates tension on the repair. Feed in an upright position and burp frequently. (4) Positioning: position on the back or side (NOT prone) to prevent the infant from rubbing the face against the mattress. (5) Suture line care: clean the suture line gently with prescribed solution after each feeding to prevent crust formation and infection. (6) Prevent crying: respond promptly to the infant's needs, as crying increases tension on the suture line. Use comfort measures including holding, rocking, and prescribed analgesics.",
      clinicalPearls: ["Post cleft lip repair: elbow restraints, no objects in mouth, no prone positioning", "Use specialized feeders that do not require sucking to avoid suture tension"],
      distractorRationales: ["Prone positioning would allow the infant to rub the suture line against bedding", "Elbow restraints and avoiding objects in the mouth protects the surgical repair", "Regular nipples require sucking that creates tension on the suture line", "Crying creates tension on the repair; minimize crying with comfort measures"],
      learningObjective: "The student will identify priority post-operative care after cleft lip repair",
      cognitiveLevel: "application", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Cleft Lip and Palate", lessonPath: lp(2),
      safetyNote: "Never allow pacifiers or regular nipples after cleft lip repair",
      examTrap: "After cleft LIP repair: no prone positioning; after cleft PALATE repair: no straws, forks, or hard objects",
      tags: ["cleft-lip", "cheiloplasty", "post-operative", "elbow-restraints"],
    },
    {
      stem: "A nurse is caring for a newborn diagnosed with Down syndrome (Trisomy 21). Which congenital anomaly is MOST commonly associated with Down syndrome that the nurse should assess for?",
      options: [
        { label: "A", text: "Neural tube defects (spina bifida)" },
        { label: "B", text: "Congenital heart defects, particularly atrioventricular septal defect (AVSD)" },
        { label: "C", text: "Pyloric stenosis" },
        { label: "D", text: "Cleft lip and palate" },
      ],
      correctAnswer: 1,
      rationale: "Down syndrome (Trisomy 21) is the most common chromosomal abnormality, occurring in approximately 1 in 700 live births. It results from an extra copy of chromosome 21, either through nondisjunction (most common, ~95%), Robertsonian translocation (~3-4%), or mosaicism (~1-2%). Congenital heart defects (CHD) are the MOST common major congenital anomaly associated with Down syndrome, occurring in approximately 40-50% of affected newborns. The most common cardiac defect in Down syndrome is the atrioventricular septal defect (AVSD), also known as endocardial cushion defect, which occurs in approximately 40% of Down syndrome children with CHD. Other common cardiac defects include VSD, ASD, PDA, and Tetralogy of Fallot. All newborns with Down syndrome should receive an echocardiogram within the first few days of life to screen for congenital heart defects, even if no murmur is detected. Other associated conditions include: GI anomalies (duodenal atresia, Hirschsprung disease, tracheoesophageal fistula), hypothyroidism (requires routine TSH screening), atlantoaxial instability (cervical spine subluxation risk), hearing loss (40-75%), vision problems (refractive errors, strabismus), leukemia (10-20x increased risk), Alzheimer disease (early onset), and intellectual disability (varies from mild to moderate). The nurse should assess for feeding difficulties, hypotonia (floppy baby), and the characteristic physical features including epicanthal folds, flat nasal bridge, single palmar crease (simian crease), and Brushfield spots on the iris.",
      clinicalPearls: ["40-50% of Down syndrome newborns have congenital heart defects", "All Down syndrome newborns need echocardiography even without a murmur"],
      distractorRationales: ["Neural tube defects are not primarily associated with Down syndrome", "AVSD is the most common cardiac defect in Down syndrome (40-50% have CHD)", "Pyloric stenosis is not a primary association with Down syndrome", "Cleft lip/palate is not a primary feature of Down syndrome"],
      learningObjective: "The student will identify the most common congenital anomaly associated with Down syndrome",
      cognitiveLevel: "recall", difficulty: 2, questionType: "MCQ_SINGLE",
      subtopic: "Down Syndrome", lessonPath: lp(3),
      safetyNote: "Screen all Down syndrome newborns with echocardiography regardless of physical findings",
      examTrap: "AVSD (not VSD) is the most common cardiac defect specifically in Down syndrome",
      tags: ["down-syndrome", "trisomy-21", "congenital-heart-defect", "AVSD"],
    },
    {
      stem: "A nurse is assessing a 2-day-old neonate who has not yet passed meconium. The abdomen is distended, and the infant has had bilious vomiting. A barium enema reveals a narrowed distal colon with a dilated proximal segment (transition zone). What condition does the nurse suspect?",
      options: [
        { label: "A", text: "Pyloric stenosis" },
        { label: "B", text: "Hirschsprung disease (aganglionic megacolon)" },
        { label: "C", text: "Intussusception" },
        { label: "D", text: "Necrotizing enterocolitis (NEC)" },
      ],
      correctAnswer: 1,
      rationale: "Hirschsprung disease (congenital aganglionic megacolon) is a congenital condition in which ganglion cells (nerve cells of the myenteric and submucosal plexus) are absent from a segment of the colon, most commonly the rectosigmoid area. Without these ganglion cells, the affected segment cannot relax or exhibit normal peristalsis, creating a functional obstruction. Stool accumulates proximal to the aganglionic segment, causing massive dilation of the normal, innervated bowel (megacolon). Key diagnostic features include: (1) Failure to pass meconium within 24-48 hours of birth (the most common presenting sign in neonates; 99% of term neonates pass meconium within 48 hours). (2) Abdominal distension from stool accumulation. (3) Bilious vomiting (indicating obstruction). (4) Barium enema showing the characteristic transition zone between the narrowed aganglionic distal segment and the dilated, stool-filled proximal segment. Definitive diagnosis requires rectal biopsy showing the absence of ganglion cells. Treatment is surgical: a pull-through procedure that removes the aganglionic segment and anastomoses normal innervated bowel to the anus. Pre-operative nursing care includes maintaining NPO status, IV fluids, nasogastric decompression, and rectal irrigations to decompress the bowel. Post-operative care includes monitoring for enterocolitis (the most serious complication), assessing stool patterns, perineal skin care, and parent education about ostomy care if a temporary ostomy is created.",
      clinicalPearls: ["Failure to pass meconium within 48 hours of birth is the hallmark of Hirschsprung disease", "Barium enema shows transition zone: narrowed distal segment, dilated proximal bowel"],
      distractorRationales: ["Pyloric stenosis presents with projectile non-bilious vomiting, not delayed meconium", "Hirschsprung disease is the correct diagnosis based on delayed meconium and transition zone", "Intussusception presents with colicky pain and currant jelly stools in older infants", "NEC occurs in preterm infants with bloody stools and pneumatosis intestinalis"],
      learningObjective: "The student will identify the clinical presentation and diagnostic features of Hirschsprung disease",
      cognitiveLevel: "analysis", difficulty: 4, questionType: "MCQ_SINGLE",
      subtopic: "Hirschsprung Disease", lessonPath: lp(1),
      safetyNote: "Monitor for post-operative enterocolitis, the most serious complication",
      examTrap: "Delayed meconium passage is Hirschsprung; projectile non-bilious vomiting is pyloric stenosis",
      tags: ["hirschsprung", "aganglionic-megacolon", "delayed-meconium", "congenital"],
    },
  ];
}

function getEmergencyTemplates(lp: (i: number) => string): QuestionData[] {
  return [
    {
      stem: "A 2-year-old toddler is brought to the emergency department after a witnessed choking episode on a grape. The child is conscious but has audible stridor, is unable to speak, and has a weak cough. What is the IMMEDIATE nursing action?",
      options: [
        { label: "A", text: "Perform a blind finger sweep of the mouth to remove the object" },
        { label: "B", text: "Administer 5 back blows followed by 5 chest thrusts" },
        { label: "C", text: "Perform abdominal thrusts (Heimlich maneuver)" },
        { label: "D", text: "Begin CPR immediately with rescue breathing" },
      ],
      correctAnswer: 1,
      rationale: "This toddler is experiencing a severe (complete or near-complete) airway obstruction from a foreign body. The child is conscious but has signs of severe obstruction: audible stridor, inability to speak, and weak/ineffective cough. For a conscious child UNDER 1 year of age, the recommended technique is alternating 5 back blows and 5 chest thrusts. For children aged 1 year and older (including this 2-year-old toddler), the current AHA/AAP guidelines recommend 5 back blows followed by 5 chest thrusts as the primary intervention, though abdominal thrusts (Heimlich maneuver) are also acceptable for children over 1 year. The sequence continues until the object is expelled or the child becomes unconscious. Critical points: (1) Blind finger sweeps are NEVER performed in infants or children as they may push the object deeper into the airway. Only remove an object if it is visible. (2) For infants under 1 year: 5 back blows (with the infant face-down on the forearm) alternating with 5 chest thrusts (using 2 fingers on the sternum). Abdominal thrusts are NOT used in infants due to the risk of liver injury. (3) For children over 1 year through adolescence: abdominal thrusts (Heimlich maneuver) are the primary intervention, though back blows can be combined. (4) If the child becomes unconscious: begin CPR starting with chest compressions, check the airway before each breath for a visible foreign body. The nurse should call for help and prepare for possible advanced airway management (laryngoscopy and foreign body removal).",
      clinicalPearls: ["Under 1 year: back blows + chest thrusts; Over 1 year: abdominal thrusts (Heimlich)", "NEVER perform blind finger sweeps in children; only remove visible objects"],
      distractorRationales: ["Blind finger sweeps are contraindicated in children; may push object deeper", "Back blows + chest thrusts is appropriate for this age group with severe obstruction", "Abdominal thrusts are also acceptable for children over 1 year", "CPR is initiated only if the child becomes unconscious"],
      learningObjective: "The student will identify the correct choking management technique based on child's age",
      cognitiveLevel: "application", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Choking Management", lessonPath: lp(0),
      safetyNote: "Grapes must be cut lengthwise for children under 4; leading choking hazard",
      examTrap: "No abdominal thrusts for infants under 1 year (liver injury risk); use back blows + chest thrusts",
      tags: ["choking", "foreign-body", "airway-obstruction", "BLS"],
    },
    {
      stem: "A 3-year-old child is brought to the emergency department with a barking cough, inspiratory stridor, and hoarseness that started gradually after a few days of upper respiratory symptoms. The child has a low-grade fever of 38.2°C and mild intercostal retractions. An AP neck X-ray shows a 'steeple sign.' What condition does the nurse suspect?",
      options: [
        { label: "A", text: "Epiglottitis" },
        { label: "B", text: "Laryngotracheobronchitis (viral croup)" },
        { label: "C", text: "Foreign body aspiration" },
        { label: "D", text: "Bacterial tracheitis" },
      ],
      correctAnswer: 1,
      rationale: "This clinical presentation is classic for laryngotracheobronchitis (viral croup), the most common cause of upper airway obstruction in children aged 6 months to 6 years, with peak incidence at 1-3 years. Croup is primarily caused by parainfluenza virus (types 1 and 2), though RSV, influenza, and adenovirus can also be causative agents. Pathophysiology: the virus causes inflammation and edema of the subglottic area (below the vocal cords), narrowing the airway. The pediatric airway is particularly vulnerable because the subglottic region is the narrowest part of the child's airway, and even small amounts of edema significantly reduce the airway diameter. Classic presentation includes: (1) Barking (seal-like) cough, (2) Inspiratory stridor, (3) Hoarseness, (4) Gradual onset over 1-3 days following URI symptoms, (5) Low-grade fever, (6) Symptoms often worse at night. The AP neck X-ray showing a 'steeple sign' (narrowing of the subglottic airway creating a steeple-shaped tracheal shadow) confirms the diagnosis. Management is based on severity and includes: humidified cool mist, nebulized racemic epinephrine (for moderate-severe cases), oral or IM dexamethasone (0.6 mg/kg, single dose), and monitoring for progression. Epiglottitis presents differently: sudden onset, high fever, drooling, tripod positioning, and a 'thumb sign' on lateral neck X-ray. Foreign body aspiration has sudden onset without prodromal URI symptoms. Bacterial tracheitis presents with high fever and purulent secretions.",
      clinicalPearls: ["Croup triad: barking cough, inspiratory stridor, hoarseness", "Steeple sign on AP X-ray confirms subglottic narrowing in croup"],
      distractorRationales: ["Epiglottitis has sudden onset with high fever and 'thumb sign' on lateral X-ray", "Viral croup is the correct diagnosis based on gradual onset and steeple sign", "Foreign body aspiration has sudden onset without URI prodrome", "Bacterial tracheitis presents with high fever and purulent secretions"],
      learningObjective: "The student will differentiate croup from epiglottitis and other upper airway conditions",
      cognitiveLevel: "analysis", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Severe Croup", lessonPath: lp(3),
      safetyNote: "Never examine the throat of a child with suspected epiglottitis; risk of complete airway obstruction",
      examTrap: "Croup = steeple sign, gradual onset; Epiglottitis = thumb sign, sudden onset, high fever",
      tags: ["croup", "stridor", "steeple-sign", "upper-airway-obstruction"],
    },
    {
      stem: "A 14-month-old toddler with a fever of 39.8°C has a generalized tonic-clonic seizure lasting 3 minutes that resolves spontaneously. There is no history of epilepsy. The child appears drowsy but responsive post-ictally. What does the nurse recognize this event as?",
      options: [
        { label: "A", text: "Status epilepticus requiring immediate anticonvulsant therapy" },
        { label: "B", text: "A simple febrile seizure" },
        { label: "C", text: "A complex febrile seizure requiring anticonvulsant prophylaxis" },
        { label: "D", text: "A seizure secondary to meningitis" },
      ],
      correctAnswer: 1,
      rationale: "This clinical scenario describes a simple febrile seizure, which is the most common type of seizure in children. Simple febrile seizures have specific defining characteristics that differentiate them from complex febrile seizures: (1) Age: typically occur between 6 months and 5 years (this child is 14 months, within the expected range). (2) Duration: less than 15 minutes (this seizure lasted 3 minutes). (3) Type: generalized (involving the whole body), not focal. (4) Frequency: occurs only once within a 24-hour period. (5) Post-ictal: the child may be drowsy but recovers to baseline neurological function. (6) No prior history of afebrile seizures or neurological abnormality. Simple febrile seizures occur in 2-5% of children and are triggered by the rapid rise in temperature rather than the absolute temperature level. The immature brain has a lower seizure threshold, making children susceptible during febrile episodes. Simple febrile seizures are benign and do NOT increase the risk of epilepsy (the risk of developing epilepsy is only slightly higher than the general population, approximately 2% vs 1%). Management is supportive: maintain airway safety during the seizure, turn the child on their side, do not restrain or place objects in the mouth, time the seizure, and provide fever management after the seizure resolves. Anticonvulsant prophylaxis is NOT recommended for simple febrile seizures. Status epilepticus is defined as a seizure lasting >5 minutes or recurrent seizures without return to baseline. Complex febrile seizures are focal, last >15 minutes, or recur within 24 hours.",
      clinicalPearls: ["Simple febrile seizures: generalized, <15 minutes, once in 24 hours, age 6 months-5 years", "Anticonvulsant prophylaxis is NOT recommended for simple febrile seizures"],
      distractorRationales: ["Status epilepticus is seizure >5 minutes; this seizure was 3 minutes", "This meets all criteria for a simple febrile seizure", "Complex febrile seizures are focal, >15 minutes, or recurrent; this is simple", "Meningitis cannot be diagnosed based on seizure alone; further workup needed if suspected"],
      learningObjective: "The student will differentiate simple febrile seizures from complex febrile seizures and status epilepticus",
      cognitiveLevel: "analysis", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Febrile Seizures", lessonPath: lp(1),
      safetyNote: "During a seizure: turn on side, protect from injury, do NOT restrain or put objects in mouth",
      examTrap: "Simple febrile seizures do NOT require anticonvulsant prophylaxis",
      tags: ["febrile-seizure", "simple-vs-complex", "seizure-management", "toddler"],
    },
    {
      stem: "A nurse is assessing a 4-year-old child brought to the emergency department with multiple bruises in various stages of healing on the back, buttocks, and upper arms. The parent states the child 'falls a lot.' Which nursing action is MOST appropriate?",
      options: [
        { label: "A", text: "Accept the parent's explanation and document the bruises" },
        { label: "B", text: "Document findings thoroughly, assess the child privately, and report suspected abuse to the appropriate authorities" },
        { label: "C", text: "Confront the parent about the inconsistent explanation" },
        { label: "D", text: "Discharge the child with instructions on fall prevention" },
      ],
      correctAnswer: 1,
      rationale: "This scenario presents multiple red flags for non-accidental trauma (child abuse) that require mandatory reporting by the nurse. Key indicators of physical abuse in this case include: (1) Bruises in various stages of healing: indicating injuries occurred at different times, inconsistent with a single accidental event. (2) Location of bruises: back, buttocks, and upper arms are protected areas that are less likely to be injured in normal childhood play and falls. Children typically fall forward, sustaining bruises on the forehead, chin, knees, and shins (bony prominences). Bruising on the back, buttocks, ears, neck, and inner thighs is concerning for inflicted injury. (3) Inconsistent explanation: 'falls a lot' does not adequately explain bruising in these specific locations. The nurse is a MANDATED REPORTER and is legally and ethically obligated to report suspected child abuse to the appropriate authorities (Child Protective Services or equivalent agency), regardless of the certainty of abuse. The nurse's responsibility is to SUSPECT and REPORT, not to investigate or confirm abuse. Appropriate nursing actions include: (1) Document findings objectively: describe size, shape, color, location of bruises using body maps; use the child's exact words in quotes; avoid subjective interpretations. (2) Assess the child privately: ask age-appropriate questions in a non-leading manner. (3) Report to CPS and follow facility protocol. (4) Do NOT confront the parent, as this may put the child at further risk and is not the nurse's role. (5) Ensure the child's immediate safety.",
      clinicalPearls: ["Bruises on protected areas (back, buttocks, ears, neck) are concerning for abuse", "Nurses are MANDATED REPORTERS; report suspected abuse, do not investigate"],
      distractorRationales: ["Accepting the explanation without further assessment fails the child's safety", "Document, assess privately, and report is the correct nursing response", "Confronting the parent is not the nurse's role and may endanger the child", "Discharging without reporting violates mandatory reporting obligations"],
      learningObjective: "The student will identify signs of child abuse and implement appropriate reporting procedures",
      cognitiveLevel: "application", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Child Abuse Recognition", lessonPath: lp(4),
      safetyNote: "Nurses are mandated reporters; failure to report suspected abuse is a legal violation",
      examTrap: "Nurses SUSPECT and REPORT; they do not investigate or confirm abuse",
      tags: ["child-abuse", "mandated-reporter", "non-accidental-trauma", "bruising-patterns"],
    },
    {
      stem: "A 10-year-old child with a history of asthma presents to the emergency department with severe respiratory distress. SpO2 is 88%, RR 42/min, and the child is using accessory muscles. The child received 3 albuterol nebulizer treatments at home without improvement. What is the nurse's priority action?",
      options: [
        { label: "A", text: "Administer another albuterol nebulizer treatment at the same dose" },
        { label: "B", text: "Apply oxygen, prepare for continuous nebulized albuterol, and anticipate IV corticosteroids" },
        { label: "C", text: "Encourage the child to use the incentive spirometer for deep breathing" },
        { label: "D", text: "Position the child supine and provide reassurance" },
      ],
      correctAnswer: 1,
      rationale: "This child is experiencing a severe asthma exacerbation (status asthmaticus) that has not responded to initial bronchodilator therapy at home. Status asthmaticus is a life-threatening emergency that requires aggressive intervention. Key findings indicating severity include: SpO2 88% (normal is >95%; <90% indicates severe hypoxemia), tachypnea (RR 42 for a 10-year-old; normal is 18-22), accessory muscle use (indicating severe work of breathing), and failure to respond to 3 albuterol treatments. The nurse's priority actions include: (1) Apply supplemental oxygen immediately to maintain SpO2 >90%. (2) Prepare for continuous nebulized albuterol (rather than intermittent treatments, as the child has failed standard dosing). (3) Anticipate IV or oral corticosteroids (dexamethasone or methylprednisolone) to reduce airway inflammation. Corticosteroids take 4-6 hours to reach peak effect, so early administration is critical. (4) Position the child upright (high Fowler's or tripod position) to maximize diaphragmatic excursion and ease breathing. (5) Anticipate IV magnesium sulfate for refractory bronchospasm. (6) Monitor for signs of respiratory failure: decreasing respiratory effort (exhaustion), silent chest (no wheezing because air movement is so poor), altered mental status, and cyanosis. (7) Prepare for possible intubation if the child does not improve with aggressive medical management. An incentive spirometer is inappropriate during acute distress as the child cannot perform deep breathing effectively. Supine positioning would worsen respiratory distress by increasing abdominal pressure on the diaphragm.",
      clinicalPearls: ["Status asthmaticus: continuous albuterol + IV corticosteroids + oxygen", "Silent chest in asthma is ominous: indicates severely reduced air movement, not improvement"],
      distractorRationales: ["Same-dose albuterol has failed; escalation to continuous nebulization needed", "Oxygen + continuous albuterol + IV corticosteroids is the correct priority", "Incentive spirometry is inappropriate during acute respiratory distress", "Supine positioning worsens respiratory distress; use upright positioning"],
      learningObjective: "The student will identify priority interventions for severe asthma exacerbation",
      cognitiveLevel: "analysis", difficulty: 4, questionType: "MCQ_SINGLE",
      subtopic: "Asthma Exacerbation", lessonPath: lp(2),
      safetyNote: "Silent chest in asthma = respiratory failure; prepare for intubation",
      examTrap: "Absence of wheezing in severe asthma is WORSE, not better",
      tags: ["asthma", "status-asthmaticus", "respiratory-distress", "emergency"],
    },
    {
      stem: "A nurse is assessing a 9-month-old infant who appears listless. The fontanelle is sunken, skin turgor shows tenting, mucous membranes are dry, and urine output has been minimal for 8 hours. Heart rate is 180 bpm. The nurse estimates the infant has what degree of dehydration?",
      options: [
        { label: "A", text: "Mild dehydration (3-5%)" },
        { label: "B", text: "Moderate dehydration (5-10%)" },
        { label: "C", text: "Severe dehydration (>10%)" },
        { label: "D", text: "No significant dehydration" },
      ],
      correctAnswer: 2,
      rationale: "This infant demonstrates multiple clinical signs consistent with severe dehydration (>10% body weight loss from fluid deficit). The WHO classification of dehydration severity includes: Mild (3-5%): slightly dry mucous membranes, normal to slightly increased heart rate, normal fontanelle, slightly decreased urine output, child may be mildly irritable. Moderate (5-10%): dry mucous membranes, sunken fontanelle, decreased skin turgor (tenting may be present), tachycardia, decreased urine output, child is irritable or lethargic. Severe (>10%): very dry mucous membranes, markedly sunken fontanelle, significant skin tenting, marked tachycardia, minimal to no urine output for >6-8 hours, child is listless or obtunded, capillary refill >3 seconds, cool and mottled extremities, hypotension (late sign). This infant has: listlessness (altered mental status), sunken fontanelle, skin tenting, dry mucous membranes, minimal urine output for 8 hours, and significant tachycardia (HR 180). The combination of altered mental status, prolonged oliguria, and multiple physical signs points to severe dehydration requiring immediate intervention. Management of severe dehydration includes: IV access establishment (IO if IV not possible), isotonic fluid bolus 20 mL/kg NS or LR repeated as needed, continuous cardiorespiratory monitoring, strict I&O monitoring, frequent reassessment, and laboratory evaluation including serum electrolytes, BUN, creatinine, and glucose.",
      clinicalPearls: ["Severe dehydration: listlessness + sunken fontanelle + skin tenting + oliguria + tachycardia", "Tachycardia is the EARLIEST cardiovascular sign of dehydration in children"],
      distractorRationales: ["Mild dehydration would not present with listlessness and skin tenting", "Moderate dehydration would show some but not all of these severe signs", "The combination of altered mental status, prolonged oliguria, and multiple signs indicates severe dehydration", "Multiple objective signs clearly indicate significant dehydration"],
      learningObjective: "The student will classify dehydration severity based on clinical assessment findings",
      cognitiveLevel: "analysis", difficulty: 3, questionType: "MCQ_SINGLE",
      subtopic: "Dehydration Assessment", lessonPath: lp(2),
      safetyNote: "Severe dehydration requires immediate IV fluid resuscitation; IO access if IV fails",
      examTrap: "Hypotension is a LATE sign of dehydration in children; tachycardia appears first",
      tags: ["dehydration", "fluid-assessment", "infant", "emergency"],
    },
  ];
}

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  console.log("=== Pediatric Nursing Question Seeder (Template-Based) ===");

  const existingHashesResult = await pool.query(
    "SELECT stem FROM allied_questions WHERE career_type = $1",
    [CAREER_TYPE]
  );
  const existingHashes = new Set<string>();
  for (const row of existingHashesResult.rows) {
    existingHashes.add(stemHash(row.stem));
  }
  console.log(`Existing questions: ${existingHashes.size}`);

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalSkipped = 0;

  for (const domain of DOMAINS) {
    const questions = generateDomainQuestions(domain, 240);
    console.log(`\nDomain: ${domain} - ${questions.length} template questions`);
    let domainInserted = 0;

    for (const q of questions) {
      const hash = stemHash(q.stem);
      if (existingHashes.has(hash)) {
        totalSkipped++;
        continue;
      }
      existingHashes.add(hash);

      const tags = [...q.tags, `lesson:${q.lessonPath}`, `domain:${domain}`];

      try {
        const res = await pool.query(
          `INSERT INTO allied_questions (
            career_type, stem, options, correct_answer, rationale_long,
            learning_objective, blueprint_category, subtopic, difficulty,
            cognitive_level, question_type, exam_trap, clinical_pearls,
            safety_note, distractor_rationales, status
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'published')
          RETURNING id`,
          [
            CAREER_TYPE, q.stem, JSON.stringify(q.options), q.correctAnswer,
            q.rationale, q.learningObjective, domain, q.subtopic,
            q.difficulty, q.cognitiveLevel, q.questionType, q.examTrap || null,
            JSON.stringify(q.clinicalPearls), q.safetyNote || null,
            JSON.stringify(q.distractorRationales),
          ]
        );

        const questionId = res.rows[0].id;

        const frontText = q.stem.length > 200 ? q.stem.substring(0, 200) + "..." : q.stem;
        const correctOption = q.options[q.correctAnswer];
        const backText = [
          `Answer: ${correctOption?.text || "See rationale"}`,
          q.clinicalPearls.length > 0 ? `Clinical Pearl: ${q.clinicalPearls[0]}` : "",
          q.rationale.substring(0, 500),
        ].filter(Boolean).join("\n\n");

        await pool.query(
          `INSERT INTO allied_flashcards (
            career_type, question_id, card_type, front, back,
            rationale, clinical_pearl, blueprint_category, subtopic
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            CAREER_TYPE, questionId, "concept", frontText, backText,
            q.rationale, q.clinicalPearls[0] || null, domain, q.subtopic,
          ]
        );

        domainInserted++;
        totalInserted++;
        totalFlashcards++;
      } catch (err: any) {
        console.error(`  [DB ERROR] ${err.message}`);
        totalSkipped++;
      }
    }

    console.log(`  Inserted: ${domainInserted}, Skipped: ${totalSkipped}`);
  }

  console.log(`\n=== Template Seeding Complete ===`);
  console.log(`Inserted: ${totalInserted}, Flashcards: ${totalFlashcards}, Skipped: ${totalSkipped}`);

  console.log("\n=== Now generating remaining questions via AI... ===");

  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    timeout: 45000,
  });

  for (const domain of DOMAINS) {
    const countRes = await pool.query(
      "SELECT COUNT(*)::int AS cnt FROM allied_questions WHERE career_type=$1 AND blueprint_category=$2 AND status='published'",
      [CAREER_TYPE, domain]
    );
    const current = countRes.rows[0].cnt;
    const needed = Math.max(0, 240 - current);

    if (needed <= 0) {
      console.log(`  ${domain}: ${current} (complete)`);
      continue;
    }

    console.log(`  ${domain}: ${current}/240, need ${needed} more via AI`);

    const lessonPaths = LESSON_PATH_MAP[domain] || [];
    let domainAiInserted = 0;
    let batchIndex = 0;
    let consecutiveFailures = 0;

    while (domainAiInserted < needed && consecutiveFailures < 5) {
      const batchCount = Math.min(5, needed - domainAiInserted);
      console.log(`    AI batch ${batchIndex + 1}: generating ${batchCount}...`);

      try {
        const stage = pickRandom(DEVELOPMENTAL_STAGES);
        const selectedSubtopics = (DOMAIN_SUBTOPICS[domain] || []).sort(() => Math.random() - 0.5).slice(0, 4);
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: `Generate ${batchCount} pediatric nursing exam questions for "${domain}".
Subtopics: ${selectedSubtopics.join(", ")}
Stage: ${stage.stage} (${stage.ageRange}), vitals: ${stage.vs}
Lesson paths: ${lessonPaths.join(", ")}
Vary difficulty levels 1-5.

Return JSON array: [{"questionType":"MCQ_SINGLE","domain":"${domain}","subDomain":"","difficulty":3,"stem":"","options":[{"label":"A","text":""},{"label":"B","text":""},{"label":"C","text":""},{"label":"D","text":""}],"correctAnswer":0,"rationale":"250+ words","clinicalPearls":[],"distractorRationales":[],"learningObjective":"","cognitiveLevel":"application","lessonPath":"","tags":[],"safetyNote":"","examTrap":""}]
correctAnswer=0-based index. Return ONLY valid JSON array.` },
          ],
          max_tokens: 8000,
          temperature: 0.8,
        });

        const content = response.choices[0]?.message?.content || "";
        const parsed = parseJsonFromResponse(content);
        if (!parsed || parsed.length === 0) {
          console.log(`    Parse failed, retrying...`);
          batchIndex++;
          continue;
        }

        for (const q of parsed) {
          if (domainAiInserted >= needed) break;
          if (!q.stem || q.stem.length < 40 || !Array.isArray(q.options) || q.options.length < 4) continue;
          if (!q.rationale || q.rationale.length < 100) continue;

          const hash = stemHash(q.stem);
          if (existingHashes.has(hash)) continue;
          existingHashes.add(hash);

          const options = q.options.map((o: any, i: number) => ({
            label: o.label || String.fromCharCode(65 + i),
            text: o.text || String(o),
          }));

          const correctAnswer = typeof q.correctAnswer === "number" ? q.correctAnswer : 0;
          const clinicalPearls = Array.isArray(q.clinicalPearls) ? q.clinicalPearls : [];
          const distractorRationales = Array.isArray(q.distractorRationales) ? q.distractorRationales : [];

          try {
            const res = await pool.query(
              `INSERT INTO allied_questions (
                career_type, stem, options, correct_answer, rationale_long,
                learning_objective, blueprint_category, subtopic, difficulty,
                cognitive_level, question_type, exam_trap, clinical_pearls,
                safety_note, distractor_rationales, status
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'published')
              RETURNING id`,
              [
                CAREER_TYPE, q.stem, JSON.stringify(options), correctAnswer,
                q.rationale, q.learningObjective || "", domain, q.subDomain || q.subtopic || "",
                Math.max(1, Math.min(5, q.difficulty || 3)),
                q.cognitiveLevel || "application", q.questionType || "MCQ_SINGLE",
                q.examTrap || null, JSON.stringify(clinicalPearls),
                q.safetyNote || null, JSON.stringify(distractorRationales),
              ]
            );

            const questionId = res.rows[0].id;
            const frontText = q.stem.length > 200 ? q.stem.substring(0, 200) + "..." : q.stem;
            const backText = [
              `Answer: ${options[correctAnswer]?.text || "See rationale"}`,
              clinicalPearls[0] ? `Pearl: ${clinicalPearls[0]}` : "",
              q.rationale?.substring(0, 500) || "",
            ].filter(Boolean).join("\n\n");

            await pool.query(
              `INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, clinical_pearl, blueprint_category, subtopic)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
              [CAREER_TYPE, questionId, "concept", frontText, backText, q.rationale || "", clinicalPearls[0] || null, domain, q.subDomain || ""]
            );

            domainAiInserted++;
            totalInserted++;
            totalFlashcards++;
          } catch (err: any) {
            console.error(`    [DB] ${err.message}`);
          }
        }

        console.log(`    Got ${parsed.length}, inserted ${domainAiInserted}/${needed}`);
        consecutiveFailures = 0;
      } catch (err: any) {
        console.error(`    [AI ERROR] ${err.message}`);
        consecutiveFailures++;
      }

      batchIndex++;
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`  ${domain} AI generation done: ${domainAiInserted} new questions`);
  }

  console.log("\n=== FINAL VERIFICATION ===");
  const total = await pool.query("SELECT COUNT(*)::int AS cnt FROM allied_questions WHERE career_type=$1 AND status='published'", [CAREER_TYPE]);
  console.log(`Total published: ${total.rows[0].cnt}`);

  const byDomain = await pool.query("SELECT blueprint_category, COUNT(*)::int AS cnt FROM allied_questions WHERE career_type=$1 AND status='published' GROUP BY blueprint_category ORDER BY blueprint_category", [CAREER_TYPE]);
  for (const r of byDomain.rows) console.log(`  ${r.blueprint_category}: ${r.cnt}`);

  const byDiff = await pool.query("SELECT difficulty, COUNT(*)::int AS cnt FROM allied_questions WHERE career_type=$1 AND status='published' GROUP BY difficulty ORDER BY difficulty", [CAREER_TYPE]);
  console.log("Difficulty:");
  for (const r of byDiff.rows) console.log(`  Level ${r.difficulty}: ${r.cnt}`);

  const fc = await pool.query("SELECT COUNT(*)::int AS cnt FROM allied_flashcards WHERE career_type=$1", [CAREER_TYPE]);
  console.log(`Flashcards: ${fc.rows[0].cnt}`);

  await pool.end();
  console.log("Done!");
}

function buildSystemPrompt(): string {
  return `You are a senior pediatric nursing exam psychometrician. Generate licensing-level exam questions with JSON output.

REQUIREMENTS:
1. Every scenario must include patient's specific age and developmental stage
2. Include age-appropriate vital signs when relevant
3. Reference growth patterns where applicable
4. Each rationale must be 250+ words minimum
5. Focus on applied reasoning, not trivia
6. Include plausible distractors and safety-first reasoning

VITAL SIGNS BY AGE:
- Neonate (0-28d): HR 120-160, RR 30-60, BP 60-80/40-50
- Infant (1-12mo): HR 100-160, RR 24-38, BP 72-104/37-56
- Toddler (1-3yr): HR 90-150, RR 22-30, BP 86-106/42-63
- Preschool (3-6yr): HR 80-140, RR 20-24, BP 89-112/46-72
- School-age (6-12yr): HR 70-120, RR 18-22, BP 97-120/57-80
- Adolescent (12-18yr): HR 60-100, RR 12-20, BP 110-131/64-83

OUTPUT CLEAN JSON ONLY. No markdown, no commentary, no emoji.`;
}

function parseJsonFromResponse(text: string): any[] | null {
  try {
    let cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrMatch) return JSON.parse(arrMatch[0]);
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      const parsed = JSON.parse(objMatch[0]);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    return null;
  } catch { return null; }
}

const DOMAIN_SUBTOPICS: Record<string, string[]> = {
  "Neonatal Care": ["APGAR Scoring", "Thermoregulation", "Breastfeeding", "Jaundice", "RDS", "Sepsis", "Cord Care", "Reflexes", "Hypoglycemia", "Safe Sleep", "Vitamin K", "Metabolic Screening", "Discharge Teaching", "Kangaroo Care", "Circumcision"],
  "Developmental Milestones": ["Motor Development", "Language Development", "Cognitive Development", "Erikson Stages", "Piaget Stages", "Growth Charts", "Developmental Screening", "ADHD", "Autism Screening", "Immunizations", "Anticipatory Guidance", "Toilet Training", "Play Development", "Attachment", "Temperament"],
  "Pediatric Infections": ["Rotavirus", "RSV", "Varicella", "Kawasaki", "Otitis Media", "Strep Pharyngitis", "Meningitis", "Pertussis", "Croup", "Pneumonia", "UTI", "Impetigo", "Hand-Foot-Mouth", "Measles", "Contact Precautions"],
  "Congenital Disorders": ["Tetralogy of Fallot", "VSD", "ASD", "PDA", "Pyloric Stenosis", "Intussusception", "Hirschsprung", "Cleft Lip/Palate", "Down Syndrome", "Cystic Fibrosis", "Sickle Cell", "Neural Tube Defects", "Hip Dysplasia", "Clubfoot", "PKU"],
  "Pediatric Emergencies": ["Choking/FBA", "Croup/Epiglottitis", "Febrile Seizures", "Child Abuse", "Asthma Emergency", "Dehydration", "Burns", "Poisoning", "Lead Poisoning", "Drowning", "Anaphylaxis", "DKA", "Head Injury", "Fractures", "SIDS Prevention"],
};

const DEVELOPMENTAL_STAGES = [
  { stage: "neonate", ageRange: "0-28 days", vs: "HR 120-160, RR 30-60, BP 60-80/40-50" },
  { stage: "infant", ageRange: "1-12 months", vs: "HR 100-160, RR 24-38, BP 72-104/37-56" },
  { stage: "toddler", ageRange: "1-3 years", vs: "HR 90-150, RR 22-30, BP 86-106/42-63" },
  { stage: "preschool", ageRange: "3-6 years", vs: "HR 80-140, RR 20-24, BP 89-112/46-72" },
  { stage: "school-age", ageRange: "6-12 years", vs: "HR 70-120, RR 18-22, BP 97-120/57-80" },
  { stage: "adolescent", ageRange: "12-18 years", vs: "HR 60-100, RR 12-20, BP 110-131/64-83" },
];

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
