import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "neonatal-rpn": {
    title: "Neonatal Nursing Foundations for Practical Nurses",
    cellular: {
      title: "Transition to Extrauterine Life and Neonatal Physiology",
      content: "The transition from intrauterine to extrauterine life represents the most dramatic physiological adaptation a human being will ever undergo. During fetal life, the placenta serves as the organ of gas exchange, nutrient delivery, and waste removal. At birth, the newborn must rapidly establish independent respiratory function, circulatory adaptation, thermoregulation, and metabolic homeostasis within minutes. The first breath is triggered by multiple stimuli including the sudden exposure to cooler ambient air, tactile stimulation, mild hypoxia, and hypercarbia. Lung fluid, which fills the alveoli in utero, must be cleared through a combination of thoracic compression during vaginal delivery and active lymphatic and capillary reabsorption. The first effective breath generates a negative intrathoracic pressure of approximately -40 to -100 cmH2O, which inflates the alveoli and establishes the functional residual capacity. With the initiation of breathing, pulmonary vascular resistance drops dramatically as oxygen causes pulmonary arteriolar vasodilation. Simultaneously, systemic vascular resistance rises as the low-resistance placental circuit is removed when the umbilical cord is clamped. These pressure changes cause functional closure of the three fetal shunts: the foramen ovale closes as left atrial pressure exceeds right atrial pressure; the ductus arteriosus constricts in response to rising PaO2 and falling prostaglandin E2 levels (functional closure within 10-15 hours, anatomical closure by 2-3 weeks); and the ductus venosus closes as umbilical venous flow ceases. Thermoregulation is a critical concern because neonates have a high body surface area-to-mass ratio, limited subcutaneous fat stores (especially in preterm infants), an inability to shiver effectively, and reliance on non-shivering thermogenesis through brown adipose tissue (BAT) metabolism. Brown fat, located between the scapulae, around the kidneys, and in the axillae, generates heat through uncoupled oxidative phosphorylation in mitochondria. Cold stress increases oxygen consumption and glucose utilization, potentially leading to hypoxia, hypoglycemia, and metabolic acidosis. The Ballard scoring system (New Ballard Score) estimates gestational age by evaluating six neuromuscular maturity criteria (posture, square window, arm recoil, popliteal angle, scarf sign, heel-to-ear) and six physical maturity criteria (skin texture, lanugo, plantar surface, breast tissue, eye/ear development, genitalia). Scores are combined to determine gestational age within a range of 20 to 44 weeks. This assessment is ideally performed within the first 12-24 hours of life. The practical nurse plays an essential role in monitoring neonatal vital signs, maintaining thermoregulation, facilitating immediate newborn care procedures, supporting breastfeeding initiation, and performing systematic head-to-toe assessments to identify deviations from normal that require physician notification."
    },
    riskFactors: [
      "Prematurity (gestational age less than 37 weeks increases risk for respiratory distress, hypothermia, hypoglycemia, and feeding difficulties)",
      "Low birth weight (less than 2500 grams) or macrosomia (greater than 4000 grams, associated with birth trauma and hypoglycemia)",
      "Maternal diabetes (gestational or pre-existing, causing neonatal hypoglycemia, macrosomia, and polycythemia)",
      "Prolonged rupture of membranes exceeding 18 hours (increased risk of neonatal sepsis, especially Group B Streptococcus)",
      "Meconium-stained amniotic fluid (risk of meconium aspiration syndrome causing chemical pneumonitis and air trapping)",
      "Maternal substance use during pregnancy (neonatal abstinence syndrome, intrauterine growth restriction, developmental concerns)",
      "Perinatal asphyxia (Apgar score less than 7 at 5 minutes, cord pH less than 7.0, need for resuscitation at delivery)"
    ],
    diagnostics: [
      "Apgar scoring at 1 and 5 minutes: evaluates heart rate, respiratory effort, muscle tone, reflex irritability, and color on a 0-10 scale; scores below 7 at 5 minutes indicate need for continued monitoring and potential intervention",
      "Ballard Maturational Assessment: combines neuromuscular and physical maturity criteria to estimate gestational age; perform within first 12-24 hours for accuracy",
      "Capillary blood glucose screening: heel prick sample within 1-2 hours of birth for at-risk neonates; normal neonatal glucose is 40-60 mg/dL in the first 24 hours, rising to 50-90 mg/dL thereafter",
      "Pulse oximetry screening: pre-ductal (right hand) and post-ductal (either foot) oxygen saturation measured after 24 hours of age; normal is 95% or greater with less than 3% difference between sites",
      "Total serum bilirubin or transcutaneous bilirubinometry: assess for hyperbilirubinemia risk; plot on Bhutani nomogram to determine risk zone and need for phototherapy",
      "Complete blood count with differential: baseline assessment; elevated WBC may indicate infection, low hemoglobin suggests anemia, polycythemia (hematocrit above 65%) requires monitoring"
    ],
    management: [
      "Maintain thermoregulation: dry neonate immediately at birth, skin-to-skin contact with mother, radiant warmer use, maintain axillary temperature 36.5-37.5 degrees Celsius (97.7-99.5 degrees Fahrenheit)",
      "Administer vitamin K (phytonadione) 1 mg intramuscularly in the vastus lateralis within 1 hour of birth to prevent hemorrhagic disease of the newborn",
      "Apply erythromycin 0.5% ophthalmic ointment to both eyes within 1 hour of birth to prevent gonococcal ophthalmia neonatorum",
      "Administer hepatitis B vaccine (first dose) within 12 hours of birth per immunization schedule; obtain maternal hepatitis B surface antigen status",
      "Initiate breastfeeding within the first hour of life (golden hour); support proper latch technique and positioning",
      "Perform cord care per facility protocol: keep stump clean and dry, fold diaper below cord, cord clamp removal when stump is dry and well-sealed",
      "Monitor urine and stool output: expect first void within 24 hours and first meconium stool within 24-48 hours; document transition from meconium to transitional to yellow seedy stools in breastfed infants"
    ],
    nursingActions: [
      "Perform immediate newborn assessment: clear airway as needed (mouth before nose), assess breathing effort, assign Apgar scores, verify identification bands match mother and infant",
      "Maintain continuous temperature monitoring during initial stabilization period; report axillary temperature below 36.5 degrees Celsius (hypothermia) or above 37.5 degrees Celsius (hyperthermia) immediately",
      "Assess for birth injuries: cephalohematoma (does not cross suture lines, resolves in weeks to months), caput succedaneum (crosses suture lines, resolves within days), clavicle fracture (crepitus, asymmetric Moro reflex)",
      "Monitor respiratory status: normal neonatal respiratory rate is 30-60 breaths per minute; report tachypnea, grunting, nasal flaring, or retractions immediately as signs of respiratory distress",
      "Perform head-to-toe assessment: check fontanelles (anterior open until 12-18 months, posterior closes by 2-3 months), red reflex bilaterally, palate integrity, hip stability (Barlow and Ortolani maneuvers), umbilical cord vessels (two arteries, one vein)",
      "Document feeding pattern, duration, and effectiveness every 2-3 hours; weigh infant daily and report weight loss exceeding 7% of birth weight in first 5 days",
      "Implement fall prevention and infant security measures: verify identification bands at every handoff, educate parents on safe sleep positioning (back to sleep, firm surface, no loose bedding)"
    ],
    assessmentFindings: [
      "Normal neonatal vital signs: heart rate 120-160 bpm (count apical pulse for full minute), respiratory rate 30-60 breaths per minute (count for full minute, periodic breathing is normal), temperature 36.5-37.5 degrees Celsius axillary",
      "Acrocyanosis (bluish discoloration of hands and feet): normal in first 24-48 hours due to peripheral vasomotor instability; central cyanosis (trunk, lips, tongue) is ALWAYS abnormal and requires immediate intervention",
      "Physiologic jaundice: appears after 24 hours of age, peaks at 3-5 days, resolves by 2 weeks; pathologic jaundice appears within first 24 hours and requires urgent evaluation",
      "Moro reflex (startle): symmetric abduction and extension of arms followed by adduction (embracing); absent or asymmetric response may indicate brachial plexus injury or fracture",
      "Epstein pearls (small white cysts on palate), milia (white papules on nose/face), erythema toxicum (red blotchy rash with white/yellow papules): all benign and self-resolving findings",
      "Mongolian spots: blue-gray pigmented macules typically over sacrum and buttocks, common in infants with darker skin tones; benign and typically fade by school age; document carefully to distinguish from bruising"
    ],
    signs: {
      left: [
        "Mild acrocyanosis of hands and feet in first 24 hours",
        "Physiologic weight loss (up to 7% in first 5 days)",
        "Periodic breathing with brief pauses (less than 20 seconds)",
        "Transient tachypnea resolving within 2-4 hours after birth",
        "Regurgitation of small amounts of milk after feeding",
        "Mild jaundice appearing after 24 hours of age"
      ],
      right: [
        "Central cyanosis (blue lips, tongue, trunk) indicating hypoxemia",
        "Apnea lasting longer than 20 seconds with bradycardia or desaturation",
        "Persistent grunting, nasal flaring, and intercostal retractions (respiratory distress)",
        "Temperature instability with axillary temp below 36.0 degrees Celsius despite warming measures",
        "Bulging anterior fontanelle (increased intracranial pressure) or sunken fontanelle (severe dehydration)",
        "Seizure activity: subtle eye deviations, lip smacking, bicycling movements, or tonic-clonic jerking"
      ]
    },
    medications: [
      {
        name: "Vitamin K (Phytonadione)",
        type: "Fat-soluble vitamin / coagulation factor precursor",
        action: "Provides exogenous vitamin K1 required for hepatic synthesis of clotting factors II (prothrombin), VII, IX, and X. Neonates are born with sterile intestinal tracts and lack the gut flora needed to synthesize vitamin K endogenously. Without supplementation, inadequate vitamin K levels lead to vitamin K deficiency bleeding (VKDB), previously called hemorrhagic disease of the newborn, which can cause intracranial hemorrhage, gastrointestinal bleeding, and umbilical stump hemorrhage.",
        sideEffects: "Pain and swelling at injection site, rare anaphylactoid reaction (extremely rare with IM administration), transient flushing",
        contra: "Known hypersensitivity to phytonadione or any component of the formulation; no absolute contraindications exist for routine neonatal prophylaxis",
        pearl: "Administer 1 mg IM in the vastus lateralis (anterolateral thigh) within 1 hour of birth using a 25-gauge 5/8-inch needle; never administer IV in neonates due to risk of severe hypotension and anaphylaxis; parents who decline should be counseled on the risk of late VKDB (intracranial hemorrhage at 2-12 weeks of age)"
      },
      {
        name: "Erythromycin Ophthalmic Ointment (0.5%)",
        type: "Macrolide antibiotic (topical ophthalmic)",
        action: "Inhibits bacterial protein synthesis by binding to the 50S ribosomal subunit of susceptible organisms, specifically preventing gonococcal ophthalmia neonatorum (Neisseria gonorrhoeae) and chlamydial conjunctivitis (Chlamydia trachomatis) acquired during passage through the birth canal. Untreated gonococcal ophthalmia can cause corneal ulceration, perforation, and permanent blindness within 24-48 hours.",
        sideEffects: "Mild chemical conjunctivitis (transient eye irritation and tearing lasting 24-48 hours), temporary blurred vision that may briefly interfere with initial eye contact between parent and newborn",
        contra: "Known hypersensitivity to erythromycin; no other absolute contraindications for neonatal prophylaxis",
        pearl: "Apply a thin ribbon (1-2 cm) of ointment to the lower conjunctival sac of each eye within 1 hour of birth; gently close eyelids and massage to distribute; do NOT irrigate eyes after application; this is a legally mandated prophylaxis in most jurisdictions regardless of maternal infection status or method of delivery"
      },
      {
        name: "Hepatitis B Vaccine (Recombinant)",
        type: "Inactivated recombinant vaccine",
        action: "Contains purified hepatitis B surface antigen (HBsAg) produced by recombinant DNA technology in yeast cells. Stimulates active immunity by inducing production of anti-HBs antibodies, providing long-term protection against hepatitis B virus infection. Hepatitis B can be transmitted vertically from infected mother to infant during birth (perinatal transmission), with a 70-90% risk of chronic infection if the infant is not immunized.",
        sideEffects: "Injection site pain, redness, and swelling; low-grade fever (less than 38 degrees Celsius); irritability and fussiness lasting 24-48 hours; severe allergic reactions are extremely rare",
        contra: "Confirmed anaphylaxis to a previous dose or to yeast (Saccharomyces cerevisiae); birth weight less than 2000 grams may require modified schedule per institutional protocol; do NOT withhold if maternal HBsAg status is positive or unknown",
        pearl: "Administer 0.5 mL IM in the anterolateral thigh (vastus lateralis) within 12 hours of birth; if mother is HBsAg-positive or status unknown, also administer hepatitis B immune globulin (HBIG) 0.5 mL IM at a different injection site within 12 hours; this is the first dose of a 3-dose series (birth, 1 month, 6 months)"
      }
    ],
    pearls: [
      "The golden hour refers to the first 60 minutes after birth when skin-to-skin contact, breastfeeding initiation, and maternal-infant bonding should be prioritized while still completing essential assessments and prophylactic medications",
      "Always count the umbilical cord vessels: a normal cord has TWO arteries and ONE vein (mnemonic: AVA - Artery, Vein, Artery). A single umbilical artery is associated with renal anomalies and warrants further evaluation",
      "Neonatal temperature should be monitored axillary (not rectally) to avoid risk of rectal perforation; axillary temperature below 36.5 degrees Celsius requires immediate warming intervention and reassessment within 30 minutes",
      "Periodic breathing (brief pauses less than 20 seconds without bradycardia or color change) is normal in neonates and differs from true apnea (cessation longer than 20 seconds or any pause accompanied by bradycardia, cyanosis, or oxygen desaturation)",
      "Jaundice appearing within the first 24 hours of life is ALWAYS pathologic and requires immediate investigation for hemolytic disease (Rh or ABO incompatibility), infection, or other causes -- never assume early jaundice is physiologic",
      "The Ballard score is most accurate when performed between 12-24 hours of age; earlier assessment may underestimate gestational age due to postnatal neurological recovery from the stress of labor and delivery",
      "Hypoglycemia is a leading preventable cause of neonatal brain injury; at-risk neonates (preterm, SGA, LGA, infants of diabetic mothers) should have blood glucose checked within 1-2 hours of birth and before feeds until glucose stabilizes above 45 mg/dL"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a full-term newborn in the first hour of life. Which intervention is the HIGHEST priority?",
        options: [
          "Administer the hepatitis B vaccine",
          "Perform a complete Ballard maturational assessment",
          "Dry the newborn thoroughly and place skin-to-skin with the mother",
          "Obtain a capillary blood glucose level"
        ],
        correct: 2,
        rationale: "Drying the newborn and initiating skin-to-skin contact is the highest priority immediately after birth. This prevents hypothermia (neonates lose heat rapidly through evaporation), promotes thermoregulation through body heat transfer, and facilitates breastfeeding initiation and bonding. While vitamin K, erythromycin eye ointment, and hepatitis B vaccine are important, thermoregulation takes precedence."
      },
      {
        question: "A newborn at 18 hours of age develops visible jaundice of the face and chest. The practical nurse should recognize this finding as:",
        options: [
          "Physiologic jaundice that will resolve without intervention",
          "A normal finding related to breastfeeding establishment",
          "Pathologic jaundice requiring immediate physician notification",
          "Carotenemia from maternal dietary intake during pregnancy"
        ],
        correct: 2,
        rationale: "Jaundice appearing within the first 24 hours of life is ALWAYS considered pathologic and requires immediate investigation. Causes include hemolytic disease (Rh or ABO incompatibility), sepsis, and other serious conditions. Physiologic jaundice appears AFTER 24 hours and peaks at 3-5 days. Early jaundice can indicate rapidly rising bilirubin levels requiring urgent phototherapy or exchange transfusion."
      },
      {
        question: "When administering vitamin K (phytonadione) to a newborn, which action by the practical nurse is correct?",
        options: [
          "Administer 1 mg intravenously within the first hour of birth",
          "Inject 1 mg intramuscularly into the deltoid muscle",
          "Administer 1 mg intramuscularly into the vastus lateralis within 1 hour of birth",
          "Give 1 mg orally mixed with the first feeding"
        ],
        correct: 2,
        rationale: "Vitamin K 1 mg is administered intramuscularly into the vastus lateralis (anterolateral thigh) within 1 hour of birth. The vastus lateralis is the preferred injection site for neonates due to adequate muscle mass and absence of major nerves and blood vessels. IV administration is contraindicated in neonates due to risk of severe hypotension and anaphylaxis. The deltoid is not used in neonates due to insufficient muscle mass."
      }
    ]
  },

  "neonatal-screening-rpn": {
    title: "Newborn Metabolic and Critical Congenital Screening for Practical Nurses",
    cellular: {
      title: "Principles of Newborn Screening and Inborn Errors of Metabolism",
      content: "Newborn screening (NBS) is a public health program designed to identify infants with serious but treatable genetic, metabolic, endocrine, and structural conditions before clinical symptoms develop. The rationale is based on the principle that early detection and treatment during the pre-symptomatic period can prevent intellectual disability, organ damage, metabolic crises, and death. The blood specimen for metabolic screening is collected via heel prick (capillary blood) and applied to a standardized filter paper card (Guthrie card). The blood is analyzed using tandem mass spectrometry (MS/MS), which can simultaneously screen for dozens of metabolic conditions from a single dried blood spot. The optimal collection window is 24-48 hours after birth; collection before 24 hours may yield false-negative results because the infant has not yet been exposed to sufficient protein feeding to trigger metabolic pathway abnormalities. Phenylketonuria (PKU) is an autosomal recessive disorder caused by a deficiency of phenylalanine hydroxylase (PAH), the hepatic enzyme that converts phenylalanine to tyrosine. Without this enzyme, phenylalanine accumulates to neurotoxic levels, causing irreversible intellectual disability, seizures, musty body odor, fair coloring (due to impaired melanin synthesis from tyrosine deficiency), and behavioral disturbances. Treatment requires lifelong adherence to a phenylalanine-restricted diet (avoidance of high-protein foods such as meat, dairy, eggs, nuts, and aspartame-containing products), supplemented with specialized phenylalanine-free medical formulas providing essential amino acids and nutrients. Congenital hypothyroidism results from absent, ectopic, or dysfunctional thyroid tissue leading to insufficient thyroid hormone production. Thyroid hormones (T3 and T4) are essential for brain development, linear growth, and metabolic regulation. Untreated congenital hypothyroidism results in cretinism, characterized by severe intellectual disability, growth failure, constipation, prolonged physiologic jaundice, large posterior fontanelle, macroglossia, and umbilical hernia. Screening detects elevated thyroid-stimulating hormone (TSH) and low free T4. Treatment with daily oral levothyroxine must begin within the first 2 weeks of life to prevent irreversible neurological damage. Galactosemia is an autosomal recessive deficiency of galactose-1-phosphate uridylyltransferase (GALT), preventing conversion of galactose to glucose. Galactose and its metabolites accumulate, causing hepatic damage (jaundice, hepatomegaly, coagulopathy), renal tubular dysfunction, cataracts, sepsis (especially Escherichia coli), and intellectual disability. Treatment requires complete elimination of galactose from the diet (no breast milk, no cow milk-based formula); soy-based formula is the standard substitute. Critical congenital heart disease (CCHD) screening uses pulse oximetry to detect ductal-dependent cardiac lesions before clinical deterioration. Pre-ductal (right hand) and post-ductal (either foot) oxygen saturations are compared after 24 hours of age; a positive screen (saturation less than 95% in either extremity, or greater than 3% difference between pre-ductal and post-ductal readings) requires echocardiography and cardiology consultation."
    },
    riskFactors: [
      "Family history of metabolic or genetic disorders (autosomal recessive inheritance patterns increase risk in consanguineous families)",
      "Prematurity or low birth weight (may require repeat screening due to immature metabolic pathways and altered reference ranges)",
      "Inadequate protein intake before initial screening (early discharge before 24 hours may yield false-negative results for PKU and other amino acid disorders)",
      "Maternal thyroid disease or iodine deficiency (affects neonatal thyroid function and may complicate interpretation of thyroid screening results)",
      "Ethnicity-specific prevalence patterns (galactosemia more common in Irish descent populations; sickle cell disease in African, Mediterranean, and Middle Eastern descent)",
      "Blood transfusion before screening collection (may cause false-negative results for hemoglobinopathy screening; repeat specimen needed 90-120 days after transfusion)",
      "Delayed specimen collection beyond 7 days of life (reduced sensitivity for certain time-dependent metabolic markers)"
    ],
    diagnostics: [
      "Newborn blood spot screening (Guthrie card): capillary blood from lateral heel applied to filter paper; collect after 24 hours of age and after adequate protein feeding; screen panels vary by jurisdiction but typically include 25-50 conditions",
      "Tandem mass spectrometry (MS/MS): identifies elevated amino acids (phenylalanine for PKU), acylcarnitines (medium-chain acyl-CoA dehydrogenase deficiency), and organic acids from a single dried blood spot",
      "TSH and free T4 levels: primary screening for congenital hypothyroidism; elevated TSH with low free T4 confirms diagnosis; thyroid ultrasound or radionuclide scan determines thyroid gland anatomy",
      "Galactose-1-phosphate uridylyltransferase (GALT) enzyme assay: confirmatory test for classic galactosemia; quantifies enzyme activity in red blood cells",
      "Pulse oximetry CCHD screening: performed after 24 hours of age; pre-ductal (right hand) and post-ductal (either foot) SpO2; pass requires both readings 95% or greater with 3% or less difference",
      "Hearing screening (otoacoustic emissions or auditory brainstem response): universal screening before hospital discharge; identifies congenital hearing loss for early intervention"
    ],
    management: [
      "PKU: immediate initiation of phenylalanine-restricted diet; special phenylalanine-free formula (Lofenalac or Phenex) for infants; frequent serum phenylalanine monitoring to maintain levels between 2-6 mg/dL",
      "Congenital hypothyroidism: daily oral levothyroxine (10-15 mcg/kg/day) started within the first 2 weeks of life; crush tablet and mix with small amount of breast milk or water; do NOT mix with soy formula (impairs absorption)",
      "Classic galactosemia: immediate cessation of breast milk and lactose-containing formula; initiate soy-based formula (Isomil, ProSobee); lifelong galactose-free diet",
      "Positive CCHD screen: obtain urgent echocardiogram and pediatric cardiology consultation; maintain pulse oximetry monitoring; prepare for potential prostaglandin E1 infusion to maintain ductal patency if ductal-dependent lesion is identified",
      "Ensure timely follow-up for abnormal screening results: contact family within 24 hours of abnormal result; arrange confirmatory testing within 1 week",
      "Coordinate genetic counseling referral for confirmed metabolic disorders to address inheritance patterns, recurrence risk, and family planning",
      "Ensure repeat screening for premature infants, infants who received blood transfusions, or those screened before 24 hours of age"
    ],
    nursingActions: [
      "Perform heel prick using proper technique: warm heel with warm cloth for 3-5 minutes to increase blood flow, lance the lateral or medial aspect of the heel (avoid the central area to prevent calcaneal bone injury), apply blood drops directly to designated circles on filter paper without squeezing excessively",
      "Verify that the infant has been feeding (breast milk or formula) for at least 24 hours before specimen collection to ensure adequate protein exposure for accurate metabolic screening",
      "Document the exact time and date of specimen collection, infant age at collection, feeding status, and any transfusions received; label card with correct patient identifiers",
      "Educate parents about the purpose of newborn screening: explain that a positive screen requires confirmatory testing and does not necessarily mean the infant has the condition (screening vs. diagnosis)",
      "Monitor for early clinical signs that may appear before screening results return: poor feeding, lethargy, vomiting, jaundice, seizures, and failure to thrive should be reported immediately",
      "Perform CCHD pulse oximetry screening after 24 hours of age: place probe on right hand (pre-ductal) and either foot (post-ductal); ensure infant is calm and warm for accurate readings",
      "Report any abnormal screening results to the physician immediately and document notification; ensure follow-up appointments are scheduled before discharge"
    ],
    assessmentFindings: [
      "PKU (if untreated): musty or mousy body odor, fair skin and hair (impaired melanin production), eczematous rash, irritability, developmental delay, seizures, microcephaly",
      "Congenital hypothyroidism (if untreated): prolonged physiologic jaundice beyond 2 weeks, large posterior fontanelle, macroglossia (large tongue), poor feeding, constipation, hoarse cry, hypothermia, umbilical hernia",
      "Classic galactosemia (if untreated): vomiting and diarrhea after milk feedings, jaundice, hepatomegaly, failure to thrive, cataracts, Escherichia coli sepsis in the neonatal period",
      "Positive CCHD screen: oxygen saturation below 95%, greater than 3% difference between pre-ductal and post-ductal readings, central cyanosis that does not improve with supplemental oxygen",
      "Failed hearing screen: absent otoacoustic emissions or abnormal auditory brainstem response; requires follow-up diagnostic audiological evaluation within 3 months",
      "Signs of metabolic crisis in undiagnosed inborn errors: acute encephalopathy, severe vomiting, metabolic acidosis, hyperammonemia, seizures, abnormal tone"
    ],
    signs: {
      left: [
        "Poor feeding or weak suck requiring frequent encouragement",
        "Excessive sleepiness or difficulty rousing for feedings",
        "Mild jaundice appearing after 24 hours of age",
        "Slight temperature instability requiring additional warming measures",
        "Weight loss within normal parameters (up to 7% in first 5 days)",
        "Mild abdominal distension without bilious vomiting"
      ],
      right: [
        "Seizures or abnormal repetitive movements (lip smacking, eye deviations, bicycling)",
        "Central cyanosis that persists or worsens despite supplemental oxygen",
        "Bilious (green) vomiting in a neonate (suggests intestinal obstruction until proven otherwise)",
        "Severe lethargy with inability to rouse for feeding (possible metabolic crisis or sepsis)",
        "Rapidly progressing jaundice within first 24 hours (hemolytic disease emergency)",
        "Oxygen saturation below 90% with signs of cardiovascular collapse (ductal-dependent cardiac lesion)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid/Eltroxin)",
        type: "Synthetic thyroid hormone (T4 replacement)",
        action: "Provides exogenous levothyroxine (T4) that is converted to triiodothyronine (T3) in peripheral tissues. T3 binds to nuclear receptors in virtually all cells, activating gene transcription essential for brain myelination, neuronal migration, synaptogenesis, and linear growth. In congenital hypothyroidism, the absent or dysfunctional thyroid gland cannot produce adequate T4, making exogenous replacement critical for preventing irreversible intellectual disability (cretinism).",
        sideEffects: "Tachycardia, irritability, diarrhea, excessive weight loss, fever, sweating (signs of overreplacement/thyrotoxicosis); bone age advancement with chronic overtreatment",
        contra: "Uncorrected adrenal insufficiency (thyroid hormone replacement increases cortisol metabolism and can precipitate adrenal crisis); recent myocardial infarction (not applicable to neonates but important in pharmacology knowledge)",
        pearl: "Crush tablet and mix with small amount of breast milk or water using a syringe; do NOT mix with soy formula or iron supplements (impair absorption); administer at the same time daily on an empty stomach; initial neonatal dose is 10-15 mcg/kg/day; monitor TSH and free T4 levels at 2 weeks after starting, then at 1, 2, 4, 6, and 12 months"
      },
      {
        name: "Phenylalanine-Free Infant Formula (Lofenalac/Phenex)",
        type: "Medical nutritional supplement (specialized metabolic formula)",
        action: "Provides complete nutrition including essential amino acids, fats, carbohydrates, vitamins, and minerals WITHOUT phenylalanine. In PKU, the phenylalanine hydroxylase enzyme is deficient, causing toxic accumulation of phenylalanine in the blood and brain. This formula serves as the primary protein source for infants with PKU, preventing neurotoxic phenylalanine levels while ensuring adequate nutrition for growth and development.",
        sideEffects: "Gastrointestinal intolerance (constipation, gas, fussiness) during initial transition; potential nutritional deficiencies if formula preparation is incorrect; poor taste may affect acceptance in older infants",
        contra: "Infants without confirmed PKU diagnosis should not be placed on phenylalanine-restricted formula as phenylalanine is an essential amino acid required for normal growth; inadequate phenylalanine intake causes growth failure",
        pearl: "Prepare formula exactly according to manufacturer directions to ensure proper nutrient concentration; some breast milk may be permitted in measured amounts to provide controlled phenylalanine intake (typically 20-50 mg phenylalanine/kg/day); blood phenylalanine levels should be monitored weekly in infancy with a target range of 2-6 mg/dL; the diet must be maintained for life"
      },
      {
        name: "Biotin (Vitamin B7)",
        type: "Water-soluble B vitamin / enzyme cofactor",
        action: "Serves as an essential cofactor for four carboxylase enzymes involved in gluconeogenesis, fatty acid synthesis, and amino acid catabolism: pyruvate carboxylase, propionyl-CoA carboxylase, 3-methylcrotonyl-CoA carboxylase, and acetyl-CoA carboxylase. Biotinidase deficiency (detected on newborn screening) prevents recycling of biotin from biocytin, leading to functional deficiency of all four carboxylases. Without treatment, accumulating organic acids cause seizures, hypotonia, developmental delay, skin rash (perioral and perianal dermatitis), alopecia, and metabolic acidosis.",
        sideEffects: "No significant adverse effects at therapeutic doses; biotin is water-soluble and excess is excreted renally; very high doses may interfere with certain laboratory immunoassays (troponin, TSH) causing falsely abnormal results",
        contra: "No absolute contraindications; safe for neonatal use at recommended doses",
        pearl: "Biotinidase deficiency is one of the most treatable conditions detected by newborn screening; daily oral biotin supplementation (5-20 mg/day depending on severity) completely prevents all clinical manifestations if started before symptoms develop; treatment is lifelong and inexpensive; ensure parents understand the critical importance of daily adherence"
      }
    ],
    pearls: [
      "The heel prick for newborn screening should target the lateral or medial plantar surface of the heel only -- never lance the central heel area (posterior curvature) because the calcaneus bone is very superficial and puncture can cause osteomyelitis, calcaneal bone damage, or abscess formation",
      "A newborn screening result is a SCREENING test, not a diagnostic test -- abnormal results require confirmatory diagnostic testing before a definitive diagnosis is made; communicate this distinction clearly to parents to avoid unnecessary panic",
      "For PKU management, aspartame (NutraSweet) is absolutely prohibited because it is metabolized to phenylalanine -- check all food and medication labels for aspartame content, including liquid medications and chewable tablets",
      "Congenital hypothyroidism treatment must begin within the first 2 weeks of life to prevent irreversible intellectual disability -- even a few weeks of delay can result in measurable IQ reduction; this creates urgency for timely follow-up of abnormal TSH screening results",
      "Infants with galactosemia must NOT receive breast milk or any lactose-containing formula -- galactose is a component of lactose (lactose = glucose + galactose), so ANY milk exposure causes toxic galactose accumulation",
      "CCHD pulse oximetry screening should be performed when the infant is awake, calm, and warm to ensure accurate readings -- cold, crying, or moving infants may have artificially low saturations causing false-positive results",
      "If a newborn is discharged before 24 hours of age, the metabolic screening blood sample should be collected before discharge with a mandatory repeat specimen at 1-2 weeks of age to catch conditions requiring protein feeding exposure for detection"
    ],
    quiz: [
      {
        question: "A practical nurse is collecting a newborn metabolic screening specimen. Which site should the heel prick be performed on?",
        options: [
          "The central area of the heel pad",
          "The lateral or medial aspect of the heel",
          "The dorsal surface of the foot",
          "The plantar surface directly over the arch"
        ],
        correct: 1,
        rationale: "The heel prick should be performed on the lateral or medial aspect of the heel to avoid the central heel area where the calcaneus bone is superficial. Puncturing the central heel can cause osteomyelitis, abscess formation, or calcaneal bone damage. The lateral and medial aspects have adequate soft tissue depth for safe capillary blood collection."
      },
      {
        question: "An infant with confirmed classic galactosemia is being prepared for feeding. Which type of formula should the practical nurse prepare?",
        options: [
          "Standard cow milk-based formula",
          "Breast milk supplemented with glucose",
          "Soy-based formula",
          "Hydrolyzed cow milk formula"
        ],
        correct: 2,
        rationale: "Infants with classic galactosemia require soy-based formula because they cannot metabolize galactose. Lactose (found in breast milk and cow milk-based formulas) is composed of glucose and galactose. Any exposure to galactose causes toxic accumulation leading to liver damage, cataracts, sepsis risk, and intellectual disability. Soy-based formulas are galactose-free and provide adequate nutrition."
      },
      {
        question: "A newborn fails the critical congenital heart disease (CCHD) pulse oximetry screening with pre-ductal saturation of 97% and post-ductal saturation of 89%. Which action should the practical nurse take FIRST?",
        options: [
          "Document the findings and rescreen in 24 hours",
          "Notify the physician immediately and prepare for echocardiography",
          "Apply supplemental oxygen at 2 liters per minute via nasal cannula",
          "Reassure the parents that the screening will be repeated after the next feeding"
        ],
        correct: 1,
        rationale: "A difference greater than 3% between pre-ductal and post-ductal oxygen saturation (in this case 8% difference) is a positive CCHD screen suggesting a ductal-dependent cardiac lesion. The practical nurse must notify the physician immediately for urgent echocardiography and cardiology consultation. Delaying notification could result in cardiovascular collapse when the ductus arteriosus closes. The physician may order prostaglandin E1 to maintain ductal patency."
      }
    ]
  },

  "neonatal-sepsis-awareness-rpn": {
    title: "Neonatal Sepsis Awareness and Early Recognition for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neonatal Sepsis and Immune Vulnerability",
      content: "Neonatal sepsis is a systemic bloodstream infection occurring within the first 28 days of life that carries significant morbidity and mortality. The neonatal immune system is functionally immature, with several critical vulnerabilities that predispose newborns to infection. Neonates have decreased neutrophil storage pools (approximately 20% of adult capacity), reduced neutrophil chemotaxis and phagocytic killing capacity, diminished complement system activity (both classic and alternative pathways are at 50% of adult levels), low immunoglobulin production (neonates rely primarily on maternally transferred IgG that crosses the placenta during the third trimester, meaning premature infants have significantly lower protective antibody levels), and immature T-cell function with a predominance of naive T-cells over memory T-cells. Neonatal sepsis is classified by timing of onset. Early-onset sepsis (EOS) occurs within the first 72 hours of life (some definitions extend to 7 days) and is typically caused by organisms acquired from the maternal genital tract during labor and delivery. Group B Streptococcus (GBS, Streptococcus agalactiae) is the most common cause of early-onset sepsis in term infants, followed by Escherichia coli (the leading cause in preterm and very low birth weight infants). Other causative organisms include Listeria monocytogenes, Haemophilus influenzae, and Enterococcus species. The pathogenesis of EOS involves ascending infection from the vaginal canal through ruptured or intact membranes, aspiration of infected amniotic fluid, or direct contact with vaginal flora during passage through the birth canal. Risk factors for EOS include maternal GBS colonization without adequate intrapartum antibiotic prophylaxis (IAP), prolonged rupture of membranes (greater than 18 hours), chorioamnionitis (maternal fever, uterine tenderness, foul-smelling amniotic fluid), prematurity, and low birth weight. Late-onset sepsis (LOS) occurs from 72 hours to 28 days of life and is typically associated with nosocomial (hospital-acquired) organisms, particularly in infants requiring prolonged hospitalization in the neonatal intensive care unit (NICU). Common LOS organisms include coagulase-negative Staphylococci (most common cause of LOS in NICU patients), Staphylococcus aureus (including MRSA), gram-negative bacilli (Klebsiella, Pseudomonas, Serratia), and Candida species (especially in very low birth weight infants receiving prolonged antibiotics). The clinical presentation of neonatal sepsis is notoriously subtle and nonspecific. Unlike older children and adults who mount classic febrile responses, septic neonates frequently present with temperature instability (hypothermia is more common than fever), poor feeding, lethargy, respiratory distress, apnea, bradycardia, glucose instability (hypoglycemia or hyperglycemia), and a general appearance described as the baby just does not look right. This nonspecific presentation demands a high index of clinical suspicion and low threshold for sepsis workup."
    },
    riskFactors: [
      "Maternal Group B Streptococcus (GBS) colonization without adequate intrapartum antibiotic prophylaxis (at least 4 hours of IV penicillin or ampicillin before delivery)",
      "Prolonged rupture of membranes exceeding 18 hours (allows ascending bacterial migration from the vaginal canal to the amniotic cavity)",
      "Chorioamnionitis (maternal fever greater than 38.0 degrees Celsius during labor, uterine tenderness, foul-smelling amniotic fluid, maternal/fetal tachycardia)",
      "Prematurity (gestational age less than 37 weeks) with immature immune function, reduced transplacental IgG transfer, and fragile skin/mucosal barriers",
      "Very low birth weight (less than 1500 grams) associated with prolonged NICU hospitalization, central line use, and mechanical ventilation",
      "Invasive procedures and indwelling devices (central venous catheters, endotracheal tubes, urinary catheters providing portals of entry for nosocomial pathogens)",
      "Prolonged antibiotic exposure (disrupts normal flora colonization, increases risk of resistant organisms and fungal superinfection)"
    ],
    diagnostics: [
      "Blood culture (gold standard): obtained BEFORE starting antibiotics; minimum 1 mL of blood inoculated into pediatric blood culture bottles (aerobic); may take 24-48 hours for growth; negative culture at 48 hours with well-appearing infant allows consideration of antibiotic discontinuation",
      "Complete blood count with differential: total WBC (normal 5,000-30,000 in neonates), immature-to-total neutrophil ratio (I:T ratio greater than 0.2 suggests bacterial infection), absolute neutrophil count, platelet count (thrombocytopenia is an ominous sign in neonatal sepsis)",
      "C-reactive protein (CRP): acute phase reactant that rises 6-12 hours after infection onset; serial measurements (at presentation and 24-48 hours later) have better sensitivity than a single value; rising CRP supports infection diagnosis",
      "Lumbar puncture with cerebrospinal fluid analysis: indicated in all infants with suspected sepsis to rule out meningitis; obtain cell count, protein, glucose, Gram stain, and culture; meningitis occurs in 10-15% of neonates with positive blood cultures",
      "Urinalysis and urine culture (catheterized specimen): more relevant in late-onset sepsis evaluation; suprapubic aspiration or catheterized specimen required (bag specimens are unreliable due to high contamination rates)",
      "Chest X-ray: indicated if respiratory symptoms are present; may reveal pneumonia, pleural effusion, or air leak syndromes"
    ],
    management: [
      "Initiate empiric antibiotic therapy immediately after cultures are obtained -- DO NOT delay antibiotics while awaiting culture results in a symptomatic neonate",
      "Early-onset sepsis empiric regimen: ampicillin (covers GBS, Listeria, Enterococcus) PLUS gentamicin (covers gram-negative organisms, provides synergistic killing with ampicillin against GBS); this is the standard first-line combination",
      "Late-onset sepsis empiric regimen: vancomycin (covers coagulase-negative Staphylococci, MRSA, and other gram-positive organisms) PLUS an aminoglycoside or third-generation cephalosporin (covers gram-negative organisms); add antifungal coverage if risk factors for Candida are present",
      "Narrow antibiotic spectrum based on culture and sensitivity results at 48-72 hours; discontinue antibiotics if cultures are negative, infant is well-appearing, and clinical suspicion is low",
      "Provide supportive care: IV fluid resuscitation for hemodynamic instability, respiratory support (supplemental oxygen, CPAP, or mechanical ventilation as needed), glucose monitoring and correction, thermoregulation",
      "Monitor for complications: disseminated intravascular coagulation (DIC), necrotizing enterocolitis (NEC), persistent pulmonary hypertension of the newborn (PPHN), multiorgan dysfunction",
      "Implement strict infection prevention: hand hygiene, central line bundle compliance, minimal handling during acute illness, breast milk promotion (provides immunoglobulins and lactoferrin)"
    ],
    nursingActions: [
      "Maintain a high index of suspicion for sepsis: the neonatal presentation is subtle and nonspecific -- if the baby does not look right, report concerns to the physician immediately even without classic infection signs",
      "Obtain blood cultures BEFORE the first dose of antibiotics is administered; use aseptic technique, clean the site with antiseptic, and collect the minimum required volume (typically 1 mL for neonatal blood culture bottles)",
      "Monitor vital signs at minimum every 2-4 hours (or more frequently as ordered): watch for temperature instability (hypothermia below 36.5 degrees Celsius is more common than fever in neonatal sepsis), tachycardia, tachypnea, and apneic episodes",
      "Assess perfusion by monitoring capillary refill time (normal less than 3 seconds in neonates), skin color and mottling, urine output (normal greater than 1 mL/kg/hour), and blood pressure",
      "Administer IV antibiotics on time and at the correct dose; verify gentamicin dosing based on weight and gestational age; monitor for peak and trough levels as ordered to prevent nephrotoxicity and ototoxicity",
      "Monitor strict intake and output; weigh diapers to determine urine output (1 gram = 1 mL); report urine output less than 1 mL/kg/hour as this may indicate renal hypoperfusion or acute kidney injury",
      "Support family at the bedside: explain procedures, provide updates on diagnostic results, encourage kangaroo care (skin-to-skin) when the infant is stable, and facilitate bonding during a stressful hospitalization"
    ],
    assessmentFindings: [
      "Temperature instability: hypothermia (below 36.5 degrees Celsius axillary) is MORE common than fever in neonatal sepsis; temperature instability with inability to maintain normothermia despite environmental control is a significant warning sign",
      "Poor feeding and feeding intolerance: weak suck, decreased oral intake, abdominal distension, gastric residuals with tube feedings, vomiting (especially bilious vomiting which may indicate NEC)",
      "Respiratory distress: tachypnea (RR greater than 60), apnea (pauses longer than 20 seconds or any pause with bradycardia/cyanosis), nasal flaring, grunting, intercostal and subcostal retractions, oxygen desaturation",
      "Cardiovascular compromise: tachycardia (HR greater than 180 bpm) or bradycardia (HR less than 100 bpm), hypotension, poor capillary refill (greater than 3 seconds), mottled or pale skin, weak peripheral pulses",
      "Neurological changes: lethargy, irritability, high-pitched or weak cry, hypotonia (floppy infant), seizures, bulging fontanelle (if meningitis is present)",
      "Skin changes: jaundice (bilirubin metabolism affected by sepsis), petechiae or purpura (may indicate DIC), mottled or dusky skin appearance, delayed capillary refill",
      "Glucose instability: hypoglycemia (glucose less than 40 mg/dL) due to increased metabolic demands or hyperglycemia (glucose greater than 150 mg/dL) due to stress response and insulin resistance"
    ],
    signs: {
      left: [
        "Subtle decrease in feeding vigor requiring encouragement",
        "Mild temperature instability requiring additional warming",
        "Tachypnea without retractions or desaturation",
        "Mild irritability or increased crying episodes",
        "Slightly prolonged capillary refill (2-3 seconds)",
        "Single apneic episode resolving with gentle stimulation"
      ],
      right: [
        "Recurrent apnea with bradycardia below 100 bpm and oxygen desaturation",
        "Hypotension with poor perfusion (capillary refill greater than 4 seconds, mottled skin)",
        "Seizures (subtle: lip smacking, eye deviations, or tonic-clonic activity)",
        "Petechiae or purpura spreading rapidly (possible DIC)",
        "Abdominal distension with bilious vomiting (possible NEC)",
        "Complete refusal to feed with severe lethargy and unresponsiveness to stimulation"
      ]
    },
    medications: [
      {
        name: "Ampicillin",
        type: "Aminopenicillin (broad-spectrum beta-lactam antibiotic)",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs) and blocking transpeptidation, the final step of peptidoglycan cross-linking. This weakens the cell wall, leading to osmotic lysis and bacterial death. Ampicillin has excellent activity against Group B Streptococcus (the most common cause of early-onset neonatal sepsis), Listeria monocytogenes, Enterococcus species, and many gram-negative organisms including susceptible Escherichia coli strains.",
        sideEffects: "Diarrhea, rash (maculopapular rash occurs in 5-10% of patients), candidal superinfection (oral thrush, diaper dermatitis), allergic reactions (urticaria, anaphylaxis in rare cases), seizures with very high doses",
        contra: "Known anaphylaxis to penicillin or other beta-lactam antibiotics; use with caution in patients with a history of cephalosporin allergy (approximately 1-2% cross-reactivity)",
        pearl: "In early-onset neonatal sepsis, ampicillin is ALWAYS paired with an aminoglycoside (gentamicin) for synergistic bactericidal activity against GBS and gram-negative coverage; neonatal dosing is weight-based and adjusted for gestational and postnatal age; administer IV over 15-30 minutes"
      },
      {
        name: "Gentamicin",
        type: "Aminoglycoside antibiotic",
        action: "Binds irreversibly to the 30S ribosomal subunit of bacterial ribosomes, causing misreading of mRNA codons and production of nonfunctional proteins, leading to bactericidal killing. Gentamicin is particularly effective against aerobic gram-negative organisms (Escherichia coli, Klebsiella, Pseudomonas). When combined with ampicillin, it provides synergistic killing of Group B Streptococcus by allowing greater aminoglycoside penetration through the damaged cell wall.",
        sideEffects: "Nephrotoxicity (monitor serum creatinine and urine output), ototoxicity (both cochlear and vestibular damage, may be irreversible), neuromuscular blockade (rare, risk increases with concurrent neuromuscular blocking agents)",
        contra: "Known hypersensitivity to aminoglycosides; use with extreme caution in renal impairment (requires dose adjustment based on renal function); avoid concurrent use with other nephrotoxic or ototoxic agents when possible",
        pearl: "Neonatal dosing is based on gestational age, postnatal age, and weight; extended-interval dosing (every 24-48 hours in neonates) maximizes bactericidal peak concentrations while allowing drug clearance between doses; monitor trough levels (goal less than 2 mcg/mL) to prevent toxicity; duration is typically 48-72 hours pending culture results"
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to the D-alanyl-D-alanine terminus of peptidoglycan precursors, preventing transglycosylation and transpeptidation. This mechanism is distinct from beta-lactams, making vancomycin effective against methicillin-resistant organisms. Vancomycin is the drug of choice for late-onset neonatal sepsis caused by coagulase-negative Staphylococci (the most common cause of catheter-related bloodstream infections in the NICU), MRSA, and other resistant gram-positive organisms.",
        sideEffects: "Red man syndrome (histamine-mediated flushing of face, neck, and upper trunk caused by rapid infusion -- preventable by infusing over at least 60 minutes), nephrotoxicity (monitor serum creatinine), ototoxicity, thrombophlebitis at IV site",
        contra: "Known hypersensitivity to vancomycin; dose adjustment required in renal impairment; avoid concurrent use with other nephrotoxic agents (aminoglycosides) when possible or monitor renal function closely",
        pearl: "Infuse over a minimum of 60 minutes to prevent red man syndrome (this is NOT a true allergy but a rate-related histamine reaction -- slowing the infusion rate resolves symptoms); monitor trough levels (goal 10-20 mcg/mL depending on infection site); used primarily for late-onset sepsis, NOT as first-line for early-onset sepsis"
      }
    ],
    pearls: [
      "The cardinal rule of neonatal sepsis: if the baby does not look right, initiate a sepsis evaluation -- neonatal sepsis presents with subtle, nonspecific signs and a high index of suspicion saves lives",
      "Hypothermia is MORE common than fever as a sign of neonatal sepsis -- do not dismiss temperature instability or inability to maintain normothermia as simply an environmental issue without considering infection",
      "Blood cultures must be obtained BEFORE the first dose of antibiotics -- once antibiotics are administered, organisms may be suppressed enough to produce false-negative culture results, delaying diagnosis and appropriate targeted therapy",
      "Group B Streptococcus (GBS) prevention relies on intrapartum antibiotic prophylaxis (IAP): adequate prophylaxis requires at least 4 hours of IV penicillin or ampicillin before delivery; if IAP was inadequate, the neonate requires enhanced clinical observation or sepsis workup per institutional guidelines",
      "An immature-to-total neutrophil ratio (I:T ratio) greater than 0.2 on the CBC differential suggests bacterial infection; however, no single lab value can reliably confirm or exclude neonatal sepsis -- clinical judgment combined with serial assessments is essential",
      "Late-onset sepsis in NICU patients is most commonly caused by coagulase-negative Staphylococci from central venous catheter biofilm; strict central line bundle compliance (hand hygiene, maximal barrier precautions, chlorhexidine skin prep, optimal catheter site, daily line necessity review) reduces infection rates significantly",
      "Breast milk provides significant immunological protection against neonatal sepsis through secretory IgA, lactoferrin, lysozyme, and oligosaccharides -- promote and support breast milk provision even for critically ill infants receiving IV antibiotics"
    ],
    quiz: [
      {
        question: "A practical nurse caring for a 36-hour-old neonate notes temperature of 36.0 degrees Celsius axillary despite being under a radiant warmer, poor feeding, and mild tachypnea. Which action should the nurse take FIRST?",
        options: [
          "Increase the radiant warmer temperature and add an extra blanket",
          "Notify the physician immediately and anticipate a sepsis workup",
          "Offer a supplemental bottle feeding to improve caloric intake",
          "Document the findings and reassess vital signs in 4 hours"
        ],
        correct: 1,
        rationale: "The combination of hypothermia despite warming measures, poor feeding, and tachypnea in a neonate within the first 72 hours of life represents the classic subtle, nonspecific presentation of early-onset neonatal sepsis. The practical nurse must notify the physician immediately. The physician will likely order blood cultures and empiric antibiotics (ampicillin and gentamicin). Delaying notification to observe further could allow rapid clinical deterioration."
      },
      {
        question: "When preparing to collect blood cultures for a neonatal sepsis workup, which nursing action is MOST important?",
        options: [
          "Collect the blood culture specimen after the first dose of antibiotics is administered",
          "Obtain the blood culture specimen before administering any antibiotics",
          "Use a bag specimen collection method for convenience",
          "Wait until the infant has been feeding for at least 8 hours before collection"
        ],
        correct: 1,
        rationale: "Blood cultures MUST be obtained BEFORE the first dose of antibiotics is administered. Antibiotics in the bloodstream can suppress bacterial growth in the culture medium, leading to false-negative results. This delays identification of the causative organism and appropriate antibiotic selection. The blood culture is the gold standard diagnostic test for sepsis and its accuracy depends on proper timing of collection."
      },
      {
        question: "A neonate receiving IV vancomycin for late-onset sepsis develops flushing of the face, neck, and upper chest during the infusion. The practical nurse should FIRST:",
        options: [
          "Stop the infusion permanently and document an allergy to vancomycin",
          "Slow the infusion rate and notify the physician",
          "Administer epinephrine for anaphylaxis",
          "Increase the infusion rate to complete the dose more quickly"
        ],
        correct: 1,
        rationale: "Flushing of the face, neck, and upper trunk during vancomycin infusion is red man syndrome, a rate-related histamine release reaction that is NOT a true allergic reaction. The appropriate first action is to slow the infusion rate (vancomycin should be infused over at least 60 minutes) and notify the physician. The reaction typically resolves when the rate is decreased. This should not be documented as a drug allergy, as the patient can safely receive vancomycin at a slower rate."
      }
    ]
  },

  "neonatal-vital-signs-rpn": {
    title: "Neonatal Vital Signs Assessment and Monitoring for Practical Nurses",
    cellular: {
      title: "Physiological Basis of Neonatal Vital Sign Parameters",
      content: "Neonatal vital signs differ significantly from pediatric and adult parameters, reflecting the unique cardiovascular, respiratory, and thermoregulatory physiology of the newborn period. Understanding these normal ranges and the physiological reasons behind them is essential for the practical nurse to distinguish normal variation from pathological deviation. The neonatal heart rate (HR) normally ranges from 120 to 160 beats per minute during quiet wakefulness, with a resting heart rate during sleep as low as 100 bpm and reactive increases up to 180 bpm during crying or feeding. The neonatal myocardium has limited capacity to increase stroke volume (the amount of blood ejected with each heartbeat) because it is less compliant and has fewer contractile elements compared to the mature heart. Therefore, cardiac output in neonates is primarily rate-dependent -- the heart compensates for increased metabolic demand by increasing heart rate rather than stroke volume. This means that tachycardia is an early compensatory sign of physiological stress (hypoxia, hypovolemia, pain, fever, sepsis), while bradycardia (HR below 100 bpm) is an ominous sign that may indicate severe hypoxia, vagal stimulation, or impending cardiac arrest. The neonatal respiratory rate (RR) ranges from 30 to 60 breaths per minute. Neonates are obligate nasal breathers for approximately the first 4-6 months of life, meaning nasal obstruction (from mucus, edema, or congenital choanal atresia) can cause significant respiratory compromise. Neonatal breathing patterns include periodic breathing, defined as brief respiratory pauses of less than 20 seconds duration without associated bradycardia, cyanosis, or oxygen desaturation -- this is a normal finding in healthy term and near-term infants. True apnea is defined as cessation of breathing for 20 seconds or longer, OR any pause accompanied by bradycardia (HR below 100 bpm), cyanosis, or oxygen desaturation. Respiratory effort is assessed by observing for nasal flaring, expiratory grunting (auto-PEEP mechanism to maintain functional residual capacity), and retractions (intercostal, subcostal, suprasternal, or substernal), which indicate increased work of breathing. Neonatal temperature regulation depends on maintaining a narrow thermoneutral zone -- the ambient temperature range in which metabolic rate and oxygen consumption are minimized. The normal neonatal axillary temperature is 36.5 to 37.5 degrees Celsius (97.7 to 99.5 degrees Fahrenheit). Axillary temperature measurement is standard in neonates because rectal thermometry carries risk of rectal perforation (the neonatal rectum is only 2-3 cm long with a thinner mucosal wall). Blood pressure is not routinely measured in healthy term newborns but is monitored in critically ill or premature infants. Normal term newborn mean arterial pressure (MAP) is approximately equal to the gestational age in weeks (e.g., MAP of 40 mmHg for a 40-week infant). Systolic blood pressure in a term newborn is approximately 60-80 mmHg and diastolic 30-50 mmHg. The practical nurse must understand that vital signs in neonates are most accurate when the infant is in a quiet, resting state. Vital signs taken during crying, feeding, or active movement will be artificially elevated and may not reflect the true clinical picture."
    },
    riskFactors: [
      "Prematurity (immature autonomic nervous system regulation, limited brown adipose tissue for thermogenesis, higher surface area-to-body mass ratio increasing heat loss)",
      "Low birth weight or small-for-gestational-age (reduced metabolic reserves, higher risk of hypothermia and hypoglycemia affecting vital sign stability)",
      "Perinatal asphyxia or birth depression (altered autonomic regulation, risk of hypoxic-ischemic encephalopathy affecting respiratory drive and cardiovascular stability)",
      "Congenital heart defects (abnormal heart rate patterns, oxygen saturation differentials, and blood pressure discrepancies between upper and lower extremities)",
      "Maternal medication exposure during labor (opioids causing neonatal respiratory depression, magnesium sulfate causing hypotonia and respiratory depression, beta-blockers causing neonatal bradycardia)",
      "Neonatal sepsis or infection (temperature instability is often the first vital sign change in neonatal infection, preceding other clinical signs by hours)",
      "Environmental factors (cold delivery room, inadequate drying at birth, delayed skin-to-skin contact, prolonged bathing before thermal stability is established)"
    ],
    diagnostics: [
      "Continuous cardiorespiratory monitoring: provides real-time heart rate and respiratory rate via chest lead electrodes; set appropriate alarm parameters (HR 100-180, RR 25-70 for term neonates); respond to all alarms promptly",
      "Pulse oximetry (SpO2): continuous or intermittent monitoring of oxygen saturation; normal neonatal SpO2 is 95-100% in term infants after transition; pre-ductal (right hand) and post-ductal (foot) comparison for CCHD screening",
      "Axillary temperature measurement: use a digital thermometer placed in the axilla with the arm held gently against the body for the manufacturer-recommended time; document temperature with the route of measurement",
      "Non-invasive blood pressure (NIBP): use appropriately sized cuff (width covers two-thirds of the upper arm length); oscillometric measurement; compare upper and lower extremity pressures if coarctation of the aorta is suspected",
      "Vital signs flow sheet documentation: standardized tracking tool recording HR, RR, temperature, SpO2, and blood pressure at prescribed intervals; enables trending and early identification of deterioration patterns",
      "Growth monitoring tools: daily weight measurement on the same scale at the same time of day (before feeding, with only a dry diaper), head circumference (occipitofrontal measurement weekly), and length measurement"
    ],
    management: [
      "Tachycardia (HR greater than 180 bpm at rest): assess for reversible causes (pain, fever, hypovolemia, hypoxia, agitation); address underlying cause before assuming cardiac pathology; provide comfort measures and reassess",
      "Bradycardia (HR less than 100 bpm): this is an emergency -- assess airway, breathing, and circulation; provide stimulation; if persistent, initiate neonatal resuscitation per NRP guidelines; bradycardia in neonates is most commonly caused by hypoxia",
      "Tachypnea (RR greater than 60 bpm sustained): assess for respiratory distress signs (grunting, flaring, retractions); position infant with head of bed slightly elevated; administer oxygen as prescribed; prepare for potential respiratory support",
      "Hypothermia (axillary temp below 36.5 degrees Celsius): initiate rewarming measures (skin-to-skin contact, radiant warmer, pre-warmed blankets, hat placement); increase ambient temperature; recheck temperature every 15-30 minutes; investigate for sepsis if hypothermia persists despite warming",
      "Hyperthermia (axillary temp above 37.5 degrees Celsius): remove excess clothing/blankets, reduce radiant warmer or incubator temperature, check environmental causes first; if temperature remains elevated, investigate for infection, dehydration, or drug reaction",
      "Oxygen desaturation (SpO2 below 90%): assess airway patency, suction if needed, reposition, stimulate if apneic, administer supplemental oxygen as prescribed; persistent desaturation requires urgent physician notification",
      "Apneic episodes: provide tactile stimulation (gently rub the back or flick the sole of the foot); if unresponsive to stimulation, initiate positive pressure ventilation; document the duration, associated bradycardia, intervention required, and recovery time"
    ],
    nursingActions: [
      "Count the apical heart rate for a full 60 seconds using a stethoscope placed at the fourth intercostal space, left midclavicular line; neonatal heart rates are rapid and may be irregular, making shorter counts inaccurate",
      "Count respirations for a full 60 seconds by observing abdominal movements (neonates are diaphragmatic breathers); do this when the infant is at rest (not crying or feeding) as activity significantly alters respiratory rate",
      "Measure axillary temperature (NOT rectal) as the standard route in neonates; rectal temperature measurement risks perforation of the thin neonatal rectal wall; tympanic thermometry is unreliable in neonates due to the small ear canal",
      "Ensure vital signs are obtained when the infant is in a quiet, resting state for the most accurate baseline assessment; note the infant's behavioral state (awake-active, awake-quiet, sleeping) when documenting vital signs",
      "Report any single episode of apnea lasting longer than 20 seconds or any apnea accompanied by bradycardia (HR below 100 bpm), cyanosis, or oxygen desaturation to the physician immediately",
      "Cluster nursing care activities to minimize handling and reduce physiological stress; frequent disruption causes tachycardia, tachypnea, oxygen desaturation, and increased caloric expenditure",
      "Trend vital signs over time using the vital signs flow sheet and growth chart; a single abnormal reading may be situational, but a TREND of deterioration (increasing heart rate, temperature instability, worsening oxygen requirements) warrants immediate escalation"
    ],
    assessmentFindings: [
      "Normal neonatal heart rate: 120-160 bpm at rest (may drop to 100 bpm during sleep and rise to 180 bpm during crying); count apical pulse for a full minute; point of maximum impulse (PMI) is at the fourth intercostal space, left midclavicular line",
      "Normal neonatal respiratory rate: 30-60 breaths per minute; abdominal (diaphragmatic) breathing pattern is normal; periodic breathing (brief pauses less than 20 seconds without bradycardia or color change) is a normal variant in healthy term infants",
      "Normal neonatal axillary temperature: 36.5-37.5 degrees Celsius (97.7-99.5 degrees Fahrenheit); hypothermia is more clinically significant than fever in neonates and is a common early sign of sepsis",
      "Normal neonatal oxygen saturation: 95-100% after the transitional period (first 10-15 minutes of life); pre-ductal and post-ductal difference should be less than 3%",
      "Normal term newborn blood pressure: systolic 60-80 mmHg, diastolic 30-50 mmHg; mean arterial pressure approximately equals gestational age in weeks; significant difference between upper and lower extremity BPs suggests coarctation of the aorta",
      "Normal neonatal weight patterns: birth weight regained by 10-14 days of life; expected weight gain is 15-30 grams per day (approximately 1% of body weight daily) after initial physiologic weight loss of up to 7% in breastfed and 5% in formula-fed infants"
    ],
    signs: {
      left: [
        "Mild tachycardia (160-180 bpm) during feeding or activity that resolves at rest",
        "Periodic breathing with pauses less than 20 seconds and no associated bradycardia",
        "Axillary temperature 36.3-36.5 degrees Celsius requiring one additional warming intervention",
        "Mild acrocyanosis of hands and feet in first 24-48 hours",
        "SpO2 fluctuating between 92-95% during transitional period (first few hours of life)",
        "Mild tachypnea (60-70 bpm) during first 2-4 hours after birth resolving spontaneously"
      ],
      right: [
        "Sustained bradycardia below 100 bpm unresponsive to stimulation (impending cardiac arrest)",
        "Apnea exceeding 20 seconds with cyanosis and oxygen desaturation below 85%",
        "Temperature below 36.0 degrees Celsius unresponsive to rewarming measures (severe hypothermia suggesting sepsis)",
        "Sustained tachypnea with grunting, nasal flaring, and intercostal retractions (respiratory failure)",
        "Persistent central cyanosis with SpO2 below 85% despite supplemental oxygen (possible cyanotic heart defect)",
        "Blood pressure differential greater than 20 mmHg between upper and lower extremities (coarctation of the aorta)"
      ]
    },
    medications: [
      {
        name: "Vital Signs Flow Sheet (Assessment Tool)",
        type: "Clinical documentation and trending instrument",
        action: "Provides a standardized format for recording heart rate, respiratory rate, temperature, oxygen saturation, blood pressure, and weight at prescribed intervals. Enables pattern recognition and early identification of clinical deterioration through vital sign trending. The flow sheet organizes time-series data to reveal trends that may not be apparent from individual assessments, such as gradually increasing heart rate, progressive temperature instability, or worsening oxygen requirements.",
        sideEffects: "No direct patient side effects; documentation errors (incorrect values, missed entries, wrong patient identification) can lead to missed deterioration patterns and delayed intervention",
        contra: "No contraindications to vital sign documentation; however, flow sheets must never replace direct clinical assessment and nursing judgment",
        pearl: "Document the infant's behavioral state at the time of vital sign measurement (sleeping, quiet alert, crying) to enable accurate interpretation; a heart rate of 180 bpm during vigorous crying has a completely different clinical significance than 180 bpm during quiet sleep"
      },
      {
        name: "Growth Chart (Assessment Tool)",
        type: "Anthropometric monitoring and developmental tracking instrument",
        action: "Plots weight, length, and head circumference against age-appropriate percentile curves (WHO growth standards for term infants, Fenton growth charts for preterm infants) to assess growth trajectory over time. Serial measurements detect growth faltering (dropping across two or more percentile lines), excessive weight gain, and disproportionate growth patterns that may indicate nutritional deficiency, metabolic disease, endocrine dysfunction, or neurological conditions (microcephaly or macrocephaly).",
        sideEffects: "No direct patient side effects; measurement technique errors (inconsistent scale calibration, inaccurate head circumference technique, measuring length on a curved surface) produce unreliable data points that can trigger unnecessary interventions or miss genuine growth concerns",
        contra: "No contraindications; growth monitoring is a fundamental component of neonatal and pediatric care",
        pearl: "Always weigh the infant on the same calibrated scale, at the same time of day, with only a clean dry diaper; a weight change of 30 grams or more between consecutive daily weights in a term infant is clinically significant; head circumference should be measured using a non-stretchable measuring tape placed at the widest occipitofrontal diameter"
      },
      {
        name: "Neonatal Assessment Tool (Assessment Tool)",
        type: "Standardized clinical assessment and scoring instrument",
        action: "Provides a systematic framework for comprehensive neonatal evaluation including the Apgar score (heart rate, respiratory effort, muscle tone, reflex irritability, color at 1 and 5 minutes), Ballard Maturational Assessment (neuromuscular and physical maturity criteria for gestational age estimation), and the Neonatal Early Warning Score (NEWS, which assigns numerical values to vital sign deviations to generate a composite score indicating risk of clinical deterioration). These tools standardize assessment, reduce subjective variation between assessors, and create a common language for communicating clinical status.",
        sideEffects: "No direct patient side effects; over-reliance on scoring tools without incorporating clinical judgment can result in delayed recognition of atypical presentations that do not trigger scoring thresholds",
        contra: "No contraindications; assessment tools supplement but do not replace clinical judgment and comprehensive physical assessment",
        pearl: "The Apgar score at 5 minutes is more predictive of neonatal outcome than the 1-minute score; a score below 7 at 5 minutes warrants continued resuscitative efforts and extended scoring at 10, 15, and 20 minutes; the Ballard score is most accurate at 12-24 hours of age; Neonatal Early Warning Scores should trigger escalation protocols when thresholds are exceeded"
      }
    ],
    pearls: [
      "Neonatal heart rate must be counted apically for a full 60 seconds -- shorter counts and peripheral pulse assessment are unreliable in neonates due to the rapid heart rate and normal rate variability",
      "Bradycardia (HR below 100 bpm) in a neonate is almost always caused by HYPOXIA -- always assess airway and breathing first before considering cardiac causes; the sequence is always: ventilate, oxygenate, then evaluate",
      "Neonates are obligate nasal breathers for the first 4-6 months of life -- even mild nasal congestion from mucus or edema can cause significant respiratory distress; gentle suctioning with a bulb syringe may dramatically improve breathing",
      "Axillary temperature is the standard measurement route in neonates because rectal thermometry carries a real risk of rectal perforation -- the neonatal rectum is only 2-3 cm long and the mucosa is thin and easily damaged",
      "Hypothermia in a neonate who should be warm (in an incubator or under a warmer) is a RED FLAG for sepsis -- cold stress triggers a cascade of increased oxygen consumption, metabolic acidosis, hypoglycemia, and worsening of the underlying condition",
      "Cluster care (grouping assessments and interventions together) reduces the number of handling episodes, minimizing energy expenditure, oxygen consumption, and physiological stress responses in neonates -- this is especially important for premature and sick infants",
      "A TREND in vital signs is more clinically significant than any single measurement -- a gradually increasing heart rate from 140 to 160 to 180 over 6 hours, even if each individual value is within normal limits, may indicate early compensation for hypovolemia, sepsis, or pain"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a 2-day-old term newborn and notes a respiratory rate of 52 breaths per minute with no nasal flaring, grunting, or retractions. The infant is pink with oxygen saturation of 98%. How should the nurse interpret this finding?",
        options: [
          "The respiratory rate is dangerously elevated and requires immediate intervention",
          "This is a normal neonatal respiratory rate and no action is needed",
          "The infant should be placed on supplemental oxygen as a precaution",
          "The physician should be notified for a chest X-ray order"
        ],
        correct: 1,
        rationale: "A respiratory rate of 52 breaths per minute is within the normal neonatal range of 30-60 breaths per minute. Combined with the absence of respiratory distress signs (no grunting, flaring, or retractions), pink color, and normal oxygen saturation, this finding represents normal neonatal breathing. The nurse should document the finding and continue routine monitoring."
      },
      {
        question: "Which route should the practical nurse use to measure a newborn's temperature?",
        options: [
          "Rectal, for the most accurate core temperature reading",
          "Axillary, to avoid the risk of rectal perforation",
          "Tympanic, for rapid and reliable measurement",
          "Oral, as the standard route for all age groups"
        ],
        correct: 1,
        rationale: "Axillary temperature is the standard route for neonatal temperature measurement. Rectal thermometry is avoided in neonates due to the risk of rectal perforation -- the neonatal rectum is only 2-3 cm long with a thin mucosal wall. Tympanic thermometry is unreliable in neonates due to the small ear canal. Oral temperature measurement is not appropriate for neonates. Normal axillary temperature range is 36.5-37.5 degrees Celsius."
      },
      {
        question: "A neonate on a cardiorespiratory monitor has a heart rate that has been trending upward from 150 to 168 to 182 bpm over the past 6 hours while at rest. Which nursing action is MOST appropriate?",
        options: [
          "No action is needed because each individual heart rate is within normal limits",
          "Report the trending tachycardia to the physician and perform a comprehensive assessment",
          "Administer a PRN dose of acetaminophen for presumed pain",
          "Increase the IV fluid rate to compensate for possible dehydration"
        ],
        correct: 1,
        rationale: "An upward trend in heart rate over 6 hours, even when individual values may fall within the broader normal range, is clinically significant and suggests compensatory tachycardia. Possible causes include developing sepsis, hypovolemia, pain, or other physiological stress. The practical nurse should report this trending change to the physician and perform a comprehensive assessment including temperature, perfusion assessment, feeding history, and urine output. A trend of deterioration is often more significant than any single vital sign value."
      }
    ]
  },

  "neuroblastoma-rpn": {
    title: "Neuroblastoma: Recognition and Nursing Care for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neuroblastoma and Neural Crest Cell Tumors",
      content: "Neuroblastoma is the most common extracranial solid tumor in children and the most common cancer diagnosed during infancy, accounting for approximately 8-10% of all childhood cancers. It arises from primitive neural crest cells, which are embryonic precursor cells that normally differentiate into sympathetic ganglia, adrenal medulla chromaffin cells, and other components of the sympathetic nervous system. During embryogenesis, neural crest cells migrate from the neural tube to populate the sympathetic chain ganglia, adrenal medulla, and paraganglia throughout the body. Malignant transformation of these undifferentiated or partially differentiated neural crest cells produces neuroblastoma. The most common primary site is the adrenal medulla (approximately 40% of cases), followed by the retroperitoneal sympathetic ganglia (25%), posterior mediastinum (15%), pelvis (5%), and neck (5%). The tumor produces and secretes catecholamines (dopamine, norepinephrine, and their metabolites), which are metabolized to vanillylmandelic acid (VMA) and homovanillic acid (HVA). These metabolites can be measured in 24-hour urine collections or spot urine samples and serve as tumor markers for diagnosis and treatment monitoring. Elevated urinary VMA and HVA are found in approximately 90% of neuroblastoma cases, making them highly sensitive screening tools. The biological behavior of neuroblastoma is uniquely variable among human cancers. It spans a spectrum from highly aggressive metastatic disease to spontaneous regression and maturation. Several molecular markers determine prognosis: MYCN oncogene amplification (found in approximately 25% of cases) is the single most important adverse prognostic factor and is associated with rapid tumor progression and poor outcome regardless of age or stage; tumor DNA ploidy (hyperdiploid/near-triploid tumors have a more favorable prognosis than diploid tumors); and segmental chromosomal aberrations (deletions of 1p, 11q, and gain of 17q are associated with aggressive disease). The International Neuroblastoma Staging System (INSS) classifies tumors from Stage 1 (localized, completely resectable) through Stage 4 (distant metastatic disease). A unique category, Stage 4S (special), applies to infants under 12 months of age with localized primary tumor and metastases limited to skin, liver, and bone marrow (less than 10% involvement); Stage 4S tumors have a remarkably favorable prognosis with high rates of spontaneous regression. Opsoclonus-myoclonus syndrome (OMS, also called dancing eyes-dancing feet) is a paraneoplastic condition occurring in approximately 2-4% of neuroblastoma patients, characterized by rapid, involuntary, multidirectional eye movements (opsoclonus), myoclonic jerks of the limbs and trunk, and cerebellar ataxia. Paradoxically, patients with OMS-associated neuroblastoma tend to have more favorable tumor biology but may develop long-term neurological and developmental sequelae. The practical nurse plays a critical role in assessment, family support, chemotherapy safety monitoring, and recognition of oncological emergencies."
    },
    riskFactors: [
      "Age: median age at diagnosis is 17-18 months; 90% of cases are diagnosed before age 5; infants under 12 months generally have more favorable tumor biology and better outcomes",
      "Familial neuroblastoma: rare (1-2% of cases) but associated with germline ALK (anaplastic lymphoma kinase) mutations and bilateral adrenal tumors; typically presents at a younger age",
      "Associated genetic conditions: neurofibromatosis type 1 (NF1), Beckwith-Wiedemann syndrome, and Hirschsprung disease have weak associations with increased neuroblastoma risk",
      "MYCN oncogene amplification: present in approximately 25% of tumors; strongest single adverse prognostic factor; associated with rapid progression and treatment resistance regardless of other clinical features",
      "Unfavorable histology (undifferentiated or poorly differentiated tumors with high mitosis-karyorrhexis index) indicates more aggressive disease behavior",
      "Diploid tumor DNA content: tumors with near-diploid DNA content have worse prognosis compared to hyperdiploid tumors, which respond better to chemotherapy",
      "Advanced stage at diagnosis (Stage 3 or 4): metastatic disease involving cortical bone, distant lymph nodes, or extensive bone marrow involvement carries the poorest prognosis"
    ],
    diagnostics: [
      "24-hour urine collection for VMA and HVA (catecholamine metabolites): elevated in approximately 90% of neuroblastoma cases; used for diagnosis and monitoring treatment response; spot urine VMA/HVA-to-creatinine ratios can also be used",
      "CT scan or MRI of the primary tumor site: defines tumor extent, relationship to surrounding structures, and presence of intraspinal extension; MRI is preferred for evaluating spinal canal involvement",
      "MIBG (metaiodobenzylguanidine) scintigraphy: a nuclear medicine scan using radiolabeled MIBG that is specifically taken up by catecholamine-producing cells; highly sensitive and specific for detecting neuroblastoma primary tumors and metastases throughout the body",
      "Bone marrow aspirate and biopsy (bilateral iliac crest): mandatory staging procedure; evaluates for marrow metastasis; provides tissue for molecular studies (MYCN amplification, DNA ploidy, segmental chromosomal aberrations)",
      "Tumor tissue biopsy: open surgical biopsy or core needle biopsy provides tissue for histological classification (favorable vs. unfavorable histology), MYCN status, and biological risk stratification",
      "Complete blood count: may reveal cytopenias (anemia, thrombocytopenia) if bone marrow is infiltrated with tumor cells; baseline values needed before chemotherapy initiation"
    ],
    management: [
      "Risk stratification determines treatment intensity: low-risk disease may require observation only (especially Stage 4S in infants) or surgical resection alone; intermediate-risk requires moderate chemotherapy plus surgery; high-risk requires intensive multimodal therapy",
      "Surgical resection: complete tumor removal when feasible; avoid damage to surrounding vital structures; may be primary (at diagnosis) or delayed (after neoadjuvant chemotherapy to shrink the tumor)",
      "Chemotherapy for intermediate and high-risk disease: induction regimens include combinations of cyclophosphamide, doxorubicin, cisplatin, etoposide, and vincristine administered in cycles; monitor blood counts, renal function, and cardiac function throughout",
      "High-risk protocol includes: induction chemotherapy, surgical resection, high-dose chemotherapy with autologous stem cell transplant, radiation therapy to the primary tumor bed, and maintenance therapy with isotretinoin (cis-retinoic acid) to promote tumor cell differentiation",
      "Anti-GD2 immunotherapy (dinutuximab) for high-risk neuroblastoma: targets GD2 disialoganglioside expressed on neuroblastoma cell surfaces; administered during maintenance phase; causes significant pain requiring opioid analgesia",
      "Manage treatment side effects: antiemetics for chemotherapy-induced nausea, blood product support for cytopenias, infection prevention during neutropenia, nutritional support, pain management",
      "Long-term follow-up: monitor for late effects including hearing loss (cisplatin), cardiac dysfunction (doxorubicin), renal impairment (cisplatin), growth abnormalities, secondary malignancies, and neurodevelopmental outcomes"
    ],
    nursingActions: [
      "Perform baseline and ongoing abdominal assessments: palpate gently for abdominal mass (firm, irregular, often crossing the midline); measure and document abdominal girth at the level of the umbilicus; report increasing distension",
      "Monitor vital signs with attention to blood pressure: catecholamine-secreting tumors may cause hypertension, tachycardia, and diaphoresis; report unexplained hypertension in a child to the physician promptly",
      "Handle chemotherapy drugs using closed-system transfer devices and personal protective equipment (double gloves, gown, eye protection); follow facility policies for safe handling, administration, and disposal of cytotoxic agents",
      "Monitor for chemotherapy side effects: nausea and vomiting (administer antiemetics proactively), mucositis (oral care every 2-4 hours with soft toothbrush and non-alcohol mouthwash), diarrhea, and alopecia (provide emotional support and prepare family)",
      "Monitor complete blood count results: report absolute neutrophil count (ANC) below 500/mm3 (severe neutropenia requiring protective precautions), hemoglobin below 7 g/dL (may need transfusion), platelets below 20,000/mm3 (bleeding precautions and possible platelet transfusion)",
      "Provide family-centered care: explain the diagnosis, treatment plan, and expected side effects in age-appropriate and family-appropriate language; connect family with child life specialists, social workers, and support groups",
      "Implement infection prevention measures during neutropenic episodes: strict hand hygiene, no fresh flowers or plants in the room, neutropenic diet (no raw fruits/vegetables, no undercooked meats), limit visitors with signs of illness, monitor temperature every 4 hours and report fever (38.0 degrees Celsius or higher) immediately"
    ],
    assessmentFindings: [
      "Abdominal mass: firm, non-tender, irregular mass that often crosses the midline (unlike Wilms tumor, which typically does NOT cross the midline); most commonly located in the adrenal or retroperitoneal region",
      "Periorbital ecchymosis (raccoon eyes): bilateral bruising around the eyes caused by orbital metastases; a characteristic finding that should raise immediate suspicion for neuroblastoma",
      "Proptosis (protrusion of the eye): caused by retro-orbital tumor metastasis; may be unilateral or bilateral",
      "Opsoclonus-myoclonus syndrome: rapid involuntary eye movements in all directions (opsoclonus), myoclonic jerking of limbs and trunk, and cerebellar ataxia (unsteady gait); a paraneoplastic phenomenon",
      "Skin nodules (blueberry muffin spots): blue-purple subcutaneous nodules representing cutaneous metastases; typically seen in infants with Stage 4S disease",
      "Hypertension, tachycardia, and flushing: caused by excessive catecholamine secretion from the tumor; may mimic pheochromocytoma symptoms",
      "Bone pain and limping: may indicate bony metastases; young children may present with irritability, refusal to walk, or limping without a clear traumatic cause"
    ],
    signs: {
      left: [
        "Increasing abdominal distension or palpable mass noted during routine care",
        "Mild irritability or fussiness without obvious cause",
        "Decreased appetite or mild weight loss over days to weeks",
        "Intermittent low-grade fever not explained by other infection sources",
        "Mild constipation from retroperitoneal mass effect",
        "Fatigue and decreased activity level compared to baseline"
      ],
      right: [
        "Respiratory distress from mediastinal mass or massive hepatomegaly (Stage 4S liver metastases)",
        "Acute spinal cord compression: bilateral lower extremity weakness, urinary retention, and saddle anesthesia (oncological emergency)",
        "Severe hypertension with headache and visual changes from catecholamine crisis",
        "Uncontrolled bleeding or hemorrhage from severe thrombocytopenia",
        "Fever with ANC below 500/mm3 (febrile neutropenia requiring immediate broad-spectrum antibiotics)",
        "Signs of tumor lysis syndrome: oliguria, hyperkalemia, hyperphosphatemia, hypocalcemia, and cardiac dysrhythmias"
      ]
    },
    medications: [
      {
        name: "Cyclophosphamide",
        type: "Alkylating agent (nitrogen mustard derivative / antineoplastic)",
        action: "A prodrug activated by hepatic cytochrome P450 enzymes to its active metabolites (phosphoramide mustard and acrolein). Phosphoramide mustard forms interstrand and intrastrand DNA cross-links, preventing DNA strand separation during replication and transcription, leading to cell cycle arrest and apoptosis. Effective against rapidly dividing tumor cells but also affects normal rapidly dividing cells (bone marrow, GI mucosa, hair follicles). Used in combination chemotherapy regimens for neuroblastoma induction therapy.",
        sideEffects: "Myelosuppression (nadir at 7-14 days), nausea and vomiting, alopecia, hemorrhagic cystitis (caused by the acrolein metabolite irritating the bladder mucosa), immunosuppression, increased infection risk, gonadal toxicity (may affect future fertility)",
        contra: "Severe bone marrow suppression (ANC below 1000/mm3 before planned cycle), active untreated infection, known hypersensitivity; requires dose adjustment in renal impairment",
        pearl: "Hemorrhagic cystitis prevention is CRITICAL: ensure aggressive IV hydration (at least 1.5-2x maintenance fluids), administer mesna (sodium 2-mercaptoethane sulfonate) concurrently to neutralize acrolein in the bladder, and encourage frequent voiding or maintain continuous bladder irrigation as ordered; monitor urine for hematuria and report immediately"
      },
      {
        name: "Doxorubicin (Adriamycin)",
        type: "Anthracycline antineoplastic antibiotic",
        action: "Intercalates between DNA base pairs and inhibits topoisomerase II, preventing DNA replication and RNA transcription. Also generates free radicals that cause oxidative damage to cellular membranes and DNA. Particularly effective against a wide range of solid tumors including neuroblastoma. The DNA damage triggers p53-mediated apoptosis in cancer cells.",
        sideEffects: "Dose-dependent cardiotoxicity (cumulative lifetime dose limit of 450-550 mg/m2; causes cardiomyopathy and heart failure), severe myelosuppression, nausea and vomiting, mucositis, alopecia (nearly universal), red-orange discoloration of urine (harmless but must warn family), severe tissue necrosis if extravasation occurs (vesicant)",
        contra: "Severe cardiac dysfunction (ejection fraction below 50%), recent myocardial infarction, cumulative dose exceeding lifetime limits, severe hepatic impairment (dose reduction required); pre-existing severe myelosuppression",
        pearl: "Doxorubicin is a VESICANT -- extravasation causes severe tissue necrosis requiring plastic surgery intervention; always verify IV patency before and during administration; infuse through a central venous access device when possible; if extravasation occurs, stop infusion immediately, aspirate residual drug, apply cold compresses (NOT warm), and administer dexrazoxane (Totect) within 6 hours as the antidote; monitor cardiac function (echocardiogram) before treatment initiation and at regular intervals throughout therapy"
      },
      {
        name: "Cisplatin (Platinol)",
        type: "Platinum-based alkylating-like antineoplastic agent",
        action: "Forms platinum-DNA adducts (intrastrand and interstrand cross-links) that distort the DNA double helix, preventing normal DNA replication and transcription. The DNA damage is recognized by cellular repair mechanisms; when damage exceeds repair capacity, the cell undergoes apoptosis. Cisplatin is cell-cycle nonspecific and is highly effective against neuroblastoma, particularly in combination with other chemotherapy agents.",
        sideEffects: "Nephrotoxicity (dose-limiting toxicity; damages proximal renal tubules causing decreased GFR, electrolyte wasting of magnesium, potassium, and calcium), severe nausea and vomiting (one of the most emetogenic chemotherapy agents), ototoxicity (sensorineural hearing loss, especially high-frequency loss; may be irreversible), peripheral neuropathy, myelosuppression",
        contra: "Pre-existing significant renal impairment (GFR below 60 mL/min), pre-existing hearing loss (relative contraindication; requires risk-benefit discussion), known hypersensitivity to platinum compounds; severe dehydration",
        pearl: "Aggressive pre-hydration and post-hydration with IV normal saline (typically 200 mL/m2/hour for 6-8 hours before and after cisplatin) is MANDATORY to prevent nephrotoxicity; monitor urine output strictly (target greater than 100 mL/m2/hour); check serum creatinine, BUN, magnesium, and electrolytes before each cycle; obtain baseline and serial audiograms to monitor for ototoxicity; administer potent antiemetics (ondansetron PLUS dexamethasone PLUS fosaprepitant) to prevent the severe emesis"
      }
    ],
    pearls: [
      "Neuroblastoma is the most common extracranial solid tumor in children and the most common cancer diagnosed in infancy -- always consider neuroblastoma when a child under 5 presents with an abdominal mass, particularly if it crosses the midline",
      "Periorbital ecchymosis (raccoon eyes) in a child without a history of trauma should raise immediate suspicion for neuroblastoma with orbital metastases -- this is a hallmark presentation that the practical nurse should recognize",
      "Elevated urinary VMA and HVA (catecholamine metabolites) are found in approximately 90% of neuroblastoma cases -- ensure proper 24-hour urine collection technique: use a collection bag that does not contain preservatives that interfere with the assay, keep specimen refrigerated, and submit promptly",
      "Stage 4S neuroblastoma in infants under 12 months is a remarkable exception in oncology -- despite having metastatic disease (to skin, liver, and/or bone marrow), these tumors frequently undergo spontaneous regression without treatment and have a very favorable prognosis",
      "Opsoclonus-myoclonus syndrome (dancing eyes-dancing feet) is a paraneoplastic condition associated with neuroblastoma -- paradoxically, children with this syndrome often have favorable tumor biology but may develop long-term neurodevelopmental problems requiring ongoing support",
      "Doxorubicin is a VESICANT: if extravasation occurs during IV infusion, stop the infusion immediately, aspirate any residual drug from the IV line, apply cold compresses (NOT warm), and administer dexrazoxane (Totect) within 6 hours -- document the event thoroughly and notify the physician immediately",
      "Hemorrhagic cystitis from cyclophosphamide is preventable: ensure adequate IV hydration, administer mesna as ordered, encourage frequent voiding (every 2 hours while awake), and monitor every void for blood -- report any hematuria immediately as it may indicate bladder mucosal damage from the acrolein metabolite"
    ],
    quiz: [
      {
        question: "A 2-year-old child presents with a firm, irregular abdominal mass that crosses the midline. The practical nurse should recognize this finding as most consistent with which condition?",
        options: [
          "Wilms tumor (nephroblastoma)",
          "Neuroblastoma",
          "Hepatoblastoma",
          "Pyloric stenosis"
        ],
        correct: 1,
        rationale: "Neuroblastoma characteristically presents as a firm, irregular abdominal mass that CROSSES the midline, originating from the adrenal medulla or sympathetic ganglia. This is an important distinguishing feature from Wilms tumor (nephroblastoma), which typically does NOT cross the midline because it arises from a single kidney. The practical nurse should report this finding immediately for urgent diagnostic workup."
      },
      {
        question: "A practical nurse is caring for a child receiving cyclophosphamide chemotherapy. Which nursing intervention is essential to prevent hemorrhagic cystitis?",
        options: [
          "Restrict fluid intake to reduce urinary frequency",
          "Administer mesna as ordered and ensure aggressive IV hydration",
          "Apply warm compresses to the suprapubic area",
          "Limit the child's physical activity during infusion"
        ],
        correct: 1,
        rationale: "Hemorrhagic cystitis is a serious complication of cyclophosphamide caused by the metabolite acrolein irritating the bladder mucosa. Prevention requires aggressive IV hydration (1.5-2x maintenance fluids) to dilute urinary acrolein concentration and administration of mesna (sodium 2-mercaptoethane sulfonate), which binds and neutralizes acrolein in the urine. Fluid restriction would worsen the risk by concentrating the toxic metabolite."
      },
      {
        question: "During IV infusion of doxorubicin, the practical nurse notices swelling and redness at the IV insertion site. Which action should the nurse take FIRST?",
        options: [
          "Apply warm compresses to the site and continue the infusion at a slower rate",
          "Stop the infusion immediately and aspirate any residual drug from the IV line",
          "Flush the IV line with normal saline to verify patency and resume the infusion",
          "Elevate the affected extremity and continue monitoring"
        ],
        correct: 1,
        rationale: "Doxorubicin is classified as a vesicant, meaning extravasation causes severe tissue necrosis that may require surgical intervention. At the first sign of extravasation (swelling, redness, pain at the IV site), the nurse must STOP the infusion immediately and aspirate any residual drug from the IV line. Cold compresses should be applied (NOT warm), and the physician must be notified urgently. The antidote dexrazoxane (Totect) should be administered within 6 hours if available."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count}/${Object.keys(lessons).length} lessons injected.`);
