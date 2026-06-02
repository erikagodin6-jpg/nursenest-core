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
  "mastitis-basics-rpn": {
    title: "Lactational Mastitis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Lactational Mastitis",
      content: "Lactational mastitis is an inflammatory condition of the breast tissue that occurs most commonly during the first six weeks of breastfeeding, though it can develop at any point during lactation. The condition arises when milk stasis creates a favorable environment for bacterial proliferation within the breast ducts and surrounding tissue. Staphylococcus aureus is the most common causative organism, entering through cracked or damaged nipples and colonizing the stagnant milk within the ductal system. The pathophysiological process begins with inadequate breast emptying, which causes milk to accumulate within the lactiferous ducts. This stagnant milk exerts retrograde pressure on the alveolar epithelium, disrupting tight junctions between epithelial cells and allowing milk components (including lactose, proteins, and fatty acids) to leak into the surrounding interstitial tissue. These milk components trigger a robust inflammatory response, recruiting neutrophils, macrophages, and inflammatory cytokines (interleukin-1, interleukin-6, tumor necrosis factor-alpha) to the affected area. The inflammatory cascade produces the classic signs of localized erythema, warmth, swelling, and tenderness. When bacteria are present, the inflammatory process intensifies, and the infection can progress from cellulitis to abscess formation if left untreated. A breast abscess develops when bacteria create a walled-off collection of purulent material within the breast parenchyma, requiring incision and drainage rather than antibiotics alone. Risk factors for progression include delayed treatment, inadequate antibiotic therapy, and continued milk stasis. The practical nurse plays a critical role in early identification of mastitis signs, reinforcing proper breastfeeding technique to prevent milk stasis, and monitoring for complications such as abscess formation or sepsis. It is essential to understand that breastfeeding should continue during mastitis treatment, as continued milk removal is therapeutic and does not harm the infant. The antibiotics prescribed for mastitis are safe during breastfeeding. Abrupt cessation of breastfeeding worsens milk stasis and increases the risk of abscess formation."
    },
    riskFactors: [
      "Cracked, fissured, or damaged nipples (portal of entry for Staphylococcus aureus)",
      "Inadequate breast emptying or infrequent feeding (promotes milk stasis)",
      "Improper infant latch technique (causes nipple trauma and incomplete drainage)",
      "Use of tight-fitting bras or clothing that compresses breast tissue",
      "Previous history of mastitis (recurrence rate approximately 8-12%)",
      "Maternal fatigue, stress, and nutritional deficiency (impairs immune response)",
      "Primiparity (first-time breastfeeding with limited experience in technique)"
    ],
    diagnostics: [
      "Clinical diagnosis based on history and physical examination: unilateral breast erythema, warmth, swelling, and tenderness with fever above 38.5 degrees Celsius",
      "Complete blood count (CBC): elevated white blood cell count with left shift (neutrophilia) indicates bacterial infection",
      "Blood cultures: obtained if sepsis is suspected (fever above 39 degrees Celsius, tachycardia, hypotension); identifies causative organism and guides antibiotic therapy",
      "Breast ultrasound: indicated when abscess is suspected (fluctuant mass, failure to respond to 48-72 hours of antibiotics); differentiates cellulitis from abscess",
      "Breast milk culture: obtained from expressed milk of the affected breast if antibiotic therapy fails; identifies organism and antibiotic sensitivities",
      "C-reactive protein (CRP): elevated in bacterial mastitis; can help differentiate infectious from non-infectious inflammation"
    ],
    management: [
      "Continue breastfeeding or breast milk expression from the affected breast every 2-3 hours to promote drainage and resolve milk stasis",
      "Apply warm compresses to the affected breast for 15-20 minutes before feeding to promote milk flow and reduce discomfort",
      "Administer prescribed antibiotics for the full course (typically 10-14 days); early discontinuation increases recurrence risk",
      "Encourage adequate hydration (minimum 2-3 liters daily) and nutritional support to promote healing and maintain milk production",
      "Position infant with chin or nose pointing toward the area of inflammation during feeding to maximize drainage of the affected duct",
      "Apply cold compresses after feeding for 15-20 minutes to reduce swelling and provide analgesic comfort",
      "Refer to lactation consultant for latch assessment and breastfeeding technique optimization"
    ],
    nursingActions: [
      "Assess both breasts systematically at each encounter: inspect for erythema, swelling, and skin changes; palpate for warmth, tenderness, induration, and fluctuance",
      "Monitor vital signs every 4 hours during acute infection: fever trending above 39 degrees Celsius or new-onset tachycardia may indicate progression to sepsis",
      "Reinforce that breastfeeding must continue during treatment -- abrupt weaning worsens milk stasis and increases abscess risk",
      "Administer analgesics and antipyretics as prescribed (ibuprofen and acetaminophen are safe during breastfeeding) and document pain scores before and after",
      "Educate patient on proper hand hygiene before breastfeeding and breast pump use to prevent reinfection and cross-contamination",
      "Report failure to improve after 48-72 hours of antibiotic therapy to the physician -- this may indicate abscess formation requiring ultrasound evaluation",
      "Document breast assessment findings including location, size of affected area, color changes, drainage characteristics, and patient-reported pain level"
    ],
    assessmentFindings: [
      "Unilateral breast erythema in a wedge-shaped pattern corresponding to the affected ductal segment, with well-demarcated borders",
      "Localized warmth and tenderness on palpation over the affected area, with possible induration of underlying breast tissue",
      "Fever (temperature 38.5 degrees Celsius or higher) with associated chills, malaise, and body aches resembling flu-like symptoms",
      "Palpable firm, tender mass indicating a plugged duct; fluctuant mass suggests abscess formation requiring drainage",
      "Cracked, fissured, or bleeding nipples on the affected breast with possible purulent nipple discharge",
      "Axillary lymphadenopathy (enlarged, tender lymph nodes in the ipsilateral axilla) indicating regional lymphatic involvement",
      "Decreased milk output from the affected breast despite adequate stimulation"
    ],
    signs: {
      left: [
        "Localized breast tenderness with mild erythema",
        "Low-grade fever (37.5-38.5 degrees Celsius)",
        "Fatigue and general malaise",
        "Mild breast engorgement with palpable firm area",
        "Decreased milk flow from the affected breast",
        "Mild nipple soreness or superficial cracks"
      ],
      right: [
        "High fever above 39 degrees Celsius with rigors (sepsis risk)",
        "Rapidly spreading erythema with purple or dusky discoloration",
        "Fluctuant breast mass (abscess requiring surgical drainage)",
        "Purulent nipple discharge (green, yellow, or foul-smelling)",
        "Hemodynamic instability (tachycardia above 110, hypotension)",
        "Altered mental status or signs of systemic sepsis"
      ]
    },
    medications: [
      {
        name: "Dicloxacillin",
        type: "Penicillinase-resistant penicillin antibiotic",
        action: "Binds to penicillin-binding proteins (PBPs) on bacterial cell walls, inhibiting transpeptidation and disrupting cell wall synthesis. Resistant to beta-lactamase produced by Staphylococcus aureus, making it effective against penicillin-resistant staphylococci that cause most lactational mastitis cases.",
        sideEffects: "Gastrointestinal upset (nausea, vomiting, diarrhea), allergic reactions (rash, urticaria), oral candidiasis, elevated liver enzymes",
        contra: "Known penicillin or cephalosporin allergy (cross-reactivity risk); severe hepatic impairment; history of cholestatic jaundice with previous penicillin use",
        pearl: "Take on an empty stomach (1 hour before or 2 hours after meals) for optimal absorption; safe during breastfeeding -- do not discontinue nursing; complete full 10-14 day course even if symptoms resolve"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase-1 and cyclooxygenase-2 enzymes, reducing prostaglandin synthesis. Decreases inflammation, pain, and fever. The anti-inflammatory action is particularly beneficial in mastitis because it addresses the inflammatory component of the disease process.",
        sideEffects: "Gastrointestinal irritation, nausea, increased bleeding risk, renal impairment with prolonged use, cardiovascular risk with chronic use",
        contra: "Active GI bleeding or peptic ulcer disease; third trimester of pregnancy (premature ductus arteriosus closure); severe renal impairment; aspirin-sensitive asthma",
        pearl: "Preferred over acetaminophen as first-line in mastitis because it provides both anti-inflammatory AND analgesic effects; transfers to breast milk in minimal amounts (less than 1% of maternal dose); take with food to reduce GI irritation"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase enzymes primarily in the central nervous system, reducing prostaglandin E2 synthesis in the hypothalamic thermoregulatory center. Provides analgesia and antipyresis but has minimal peripheral anti-inflammatory activity compared to NSAIDs.",
        sideEffects: "Hepatotoxicity at doses exceeding 4 grams per day (2 grams per day with liver disease), nausea, rare allergic reactions including Stevens-Johnson syndrome",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use (increased hepatotoxicity risk); allergy to acetaminophen",
        pearl: "Can be alternated with ibuprofen every 3 hours (ibuprofen every 6 hours, acetaminophen every 6 hours, staggered) for superior pain and fever control; check all combination products for hidden acetaminophen to avoid unintentional overdose; safe during breastfeeding"
      }
    ],
    pearls: [
      "Breastfeeding MUST continue during mastitis treatment -- continued milk removal is therapeutic and the prescribed antibiotics are safe for the nursing infant",
      "The classic triad of lactational mastitis is unilateral breast erythema, localized warmth/tenderness, and systemic fever with flu-like symptoms",
      "Staphylococcus aureus is the most common causative organism, entering through cracked nipples -- proper latch technique is the best prevention",
      "If symptoms do not improve within 48-72 hours of appropriate antibiotic therapy, suspect breast abscess and obtain ultrasound evaluation",
      "Ibuprofen is preferred over acetaminophen as first-line analgesia because it addresses both inflammation and pain; both are safe during breastfeeding",
      "A plugged duct (milk stasis without infection) presents with a firm, tender lump WITHOUT fever -- this is a precursor to mastitis if not resolved promptly",
      "Teach patients to begin breastfeeding on the affected side first when the infant's suck is strongest to maximize drainage of the inflamed area"
    ],
    quiz: [
      {
        question: "A breastfeeding patient presents with unilateral breast erythema, fever of 38.8 degrees Celsius, and flu-like symptoms. She asks the practical nurse if she should stop breastfeeding. What is the most appropriate response?",
        options: [
          "Stop breastfeeding immediately and switch to formula until the infection resolves",
          "Continue breastfeeding on the unaffected breast only and pump the affected side",
          "Continue breastfeeding on both breasts, starting with the affected breast to promote drainage",
          "Discontinue breastfeeding permanently because the infection will recur"
        ],
        correct: 2,
        rationale: "Breastfeeding should continue during mastitis treatment, and the patient should begin feeding on the affected side first when the infant's suck is strongest. Continued milk removal is therapeutic, helps resolve milk stasis, and the prescribed antibiotics are safe for the infant. Stopping breastfeeding worsens stasis and increases abscess risk."
      },
      {
        question: "A patient with lactational mastitis has been on dicloxacillin for 72 hours but reports worsening pain, persistent fever, and a new palpable fluctuant mass in the affected breast. What should the practical nurse report to the physician?",
        options: [
          "The antibiotic is working and symptoms will resolve within another 48 hours",
          "The patient may have developed a breast abscess requiring ultrasound evaluation and possible drainage",
          "The patient should discontinue breastfeeding to allow the breast to heal",
          "The antibiotic dose should be doubled to achieve faster resolution"
        ],
        correct: 1,
        rationale: "Failure to improve after 48-72 hours of appropriate antibiotic therapy with a new fluctuant mass strongly suggests breast abscess formation. The practical nurse should report this finding immediately because abscesses require ultrasound confirmation and incision and drainage; antibiotics alone cannot resolve a walled-off abscess."
      },
      {
        question: "Which organism is the most common cause of lactational mastitis?",
        options: [
          "Escherichia coli",
          "Streptococcus pyogenes",
          "Staphylococcus aureus",
          "Pseudomonas aeruginosa"
        ],
        correct: 2,
        rationale: "Staphylococcus aureus is the most common causative organism in lactational mastitis. It typically enters through cracked or damaged nipples and colonizes stagnant milk within the ductal system. This is why penicillinase-resistant antibiotics such as dicloxacillin or cephalexin are first-line treatment choices."
      }
    ]
  },

  "maternity-rpn": {
    title: "Prenatal Care Essentials for Practical Nurses",
    cellular: {
      title: "Physiology of Pregnancy and Prenatal Care",
      content: "Pregnancy involves profound physiological adaptations across virtually every organ system, all orchestrated to support fetal growth and development over approximately 40 weeks of gestation. Understanding these normal adaptations is essential for the practical nurse to differentiate expected changes from pathological findings during prenatal assessments. The cardiovascular system undergoes dramatic changes: blood volume increases by 40-50% (approximately 1.5 liters) to perfuse the growing uteroplacental unit, cardiac output increases by 30-50%, heart rate increases by 10-20 beats per minute, and peripheral vascular resistance decreases due to progesterone-mediated smooth muscle relaxation and increased nitric oxide production. These changes explain the physiological anemia of pregnancy (hemodilution), the sensation of palpitations, and the slight decrease in blood pressure during the second trimester. The respiratory system adapts through progesterone-stimulated increases in tidal volume (30-40% increase) and minute ventilation, creating a mild respiratory alkalosis (PaCO2 approximately 30 mmHg) that facilitates CO2 transfer from the fetal to the maternal circulation. The growing uterus elevates the diaphragm by approximately 4 cm, reducing functional residual capacity. The renal system experiences a 50% increase in glomerular filtration rate (GFR), which lowers serum creatinine and BUN levels. The ureters dilate (more prominent on the right due to dextrorotation of the uterus), increasing the risk of urinary tract infections and pyelonephritis. The endocrine system is central to pregnancy maintenance: human chorionic gonadotropin (hCG) from the trophoblast maintains the corpus luteum during early pregnancy, progesterone maintains the endometrium and suppresses uterine contractions, and human placental lactogen (hPL) promotes maternal insulin resistance to ensure glucose availability for the fetus. Prenatal care follows a structured schedule: monthly visits until 28 weeks, biweekly visits from 28-36 weeks, and weekly visits from 36 weeks until delivery. Leopold maneuvers are external palpation techniques used to determine fetal lie, presentation, position, and engagement. Fundal height measurement (in centimeters from the symphysis pubis to the uterine fundus) should approximate the gestational age in weeks between 20-36 weeks. The practical nurse assists with routine prenatal assessments, reinforces patient education on warning signs, administers prescribed prenatal supplements, and reports deviations from expected findings to the registered nurse or physician."
    },
    riskFactors: [
      "Advanced maternal age (35 years or older) associated with increased risk of chromosomal abnormalities, gestational diabetes, and preeclampsia",
      "Pre-existing chronic conditions including hypertension, diabetes mellitus, and autoimmune disorders",
      "History of previous pregnancy complications (preeclampsia, preterm labor, gestational diabetes, stillbirth)",
      "Multiple gestation (twins, triplets) increasing risk of preterm delivery, preeclampsia, and postpartum hemorrhage",
      "Substance use during pregnancy including tobacco (placental insufficiency), alcohol (fetal alcohol spectrum disorder), and illicit drugs",
      "Inadequate prenatal care or late initiation of prenatal visits (missed screening opportunities)",
      "Body mass index extremes (underweight increases SGA risk; obesity increases gestational diabetes, preeclampsia, and cesarean delivery risk)"
    ],
    diagnostics: [
      "First prenatal visit labs: CBC, blood type and Rh factor, antibody screen, rubella titer, hepatitis B surface antigen, HIV screening, syphilis (RPR/VDRL), urinalysis and culture, Pap smear if due",
      "Gestational diabetes screening: 1-hour glucose challenge test (50g glucola) at 24-28 weeks; abnormal result (above 7.8 mmol/L or 140 mg/dL) requires 3-hour glucose tolerance test for confirmation",
      "Group B Streptococcus (GBS) screening: vaginal-rectal swab at 35-37 weeks; positive result requires intrapartum antibiotic prophylaxis (penicillin G) to prevent neonatal sepsis",
      "Fundal height measurement: measured in centimeters from symphysis pubis to uterine fundus; should equal gestational age in weeks (plus or minus 2 cm) between 20-36 weeks; discrepancies require further evaluation",
      "Fetal heart tones: auscultated with Doppler from 10-12 weeks gestation; normal range 110-160 beats per minute; report sustained bradycardia or tachycardia",
      "Ultrasound: dating scan (first trimester), anatomy scan (18-20 weeks), growth scans as indicated; confirms gestational age, fetal anatomy, placental location, and amniotic fluid volume"
    ],
    management: [
      "Administer prescribed prenatal vitamins and supplements daily; ensure folic acid supplementation begins ideally before conception and continues throughout pregnancy",
      "Monitor weight gain according to pre-pregnancy BMI guidelines: underweight 12.5-18 kg, normal weight 11.5-16 kg, overweight 7-11.5 kg, obese 5-9 kg total",
      "Perform Leopold maneuvers at each visit after 36 weeks to determine fetal lie (longitudinal vs transverse), presentation (cephalic vs breech), and engagement",
      "Reinforce warning signs requiring immediate medical attention: vaginal bleeding, severe headache, visual changes, epigastric pain, decreased fetal movement, rupture of membranes, regular contractions before 37 weeks",
      "Screen for intimate partner violence at each prenatal visit using validated screening tools in a private setting",
      "Provide anticipatory guidance on labor signs: regular contractions increasing in frequency and intensity, rupture of membranes, bloody show (mucus plug passage with blood-tinged mucus)",
      "Coordinate referrals to dietitian, social worker, or mental health provider as indicated for high-risk pregnancies"
    ],
    nursingActions: [
      "Obtain and document maternal vital signs at each prenatal visit: blood pressure (report systolic above 140 or diastolic above 90 for preeclampsia screening), weight, and fundal height",
      "Auscultate fetal heart tones at each visit using Doppler after 10-12 weeks; document rate, rhythm, and location; report rate below 110 or above 160 beats per minute",
      "Perform dipstick urinalysis at each visit: report proteinuria (possible preeclampsia), glucosuria (possible gestational diabetes), or nitrites/leukocyte esterase (possible UTI)",
      "Assess for edema at each visit: mild pedal edema is normal in pregnancy; report facial edema, periorbital swelling, or sudden severe edema (preeclampsia warning signs)",
      "Document Naegele rule calculation for estimated date of delivery: first day of last menstrual period minus 3 months plus 7 days plus 1 year",
      "Reinforce patient education on fetal kick counts starting at 28 weeks: instruct patient to count 10 movements within 2 hours during a time of usual fetal activity; report fewer than 10 movements",
      "Report any vaginal bleeding, regardless of amount, during pregnancy -- distinguish between first-trimester bleeding (threatened abortion) and third-trimester bleeding (placenta previa, placental abruption)"
    ],
    assessmentFindings: [
      "Normal cardiovascular changes: resting heart rate increase of 10-20 bpm, mild decrease in blood pressure during second trimester, physiological heart murmur (systolic flow murmur)",
      "Normal respiratory changes: mild dyspnea on exertion (progesterone-mediated hyperventilation), nasal congestion (estrogen-induced mucosal edema)",
      "Fundal height landmarks: 12 weeks at symphysis pubis, 20 weeks at umbilicus, 36 weeks at xiphoid process; then drops with fetal engagement (lightening)",
      "Normal GI changes: nausea and vomiting (morning sickness, peaks 8-12 weeks), heartburn (progesterone relaxes lower esophageal sphincter), constipation (progesterone slows peristalsis)",
      "Skin changes: linea nigra (dark line from umbilicus to pubis), chloasma (mask of pregnancy on face), striae gravidarum (stretch marks), spider angiomas",
      "Braxton Hicks contractions: irregular, painless uterine contractions that do not cause cervical change; normal after 20 weeks; distinguish from true labor contractions"
    ],
    signs: {
      left: [
        "Mild nausea and vomiting in first trimester",
        "Fatigue and increased need for rest",
        "Breast tenderness and enlargement",
        "Mild pedal edema in third trimester",
        "Braxton Hicks contractions (irregular, painless)",
        "Increased urinary frequency"
      ],
      right: [
        "Vaginal bleeding at any gestational age (placental emergency)",
        "Severe headache with visual changes (eclampsia risk)",
        "Blood pressure above 160/110 with proteinuria (severe preeclampsia)",
        "Decreased or absent fetal movement (fetal distress)",
        "Rupture of membranes before 37 weeks (preterm PROM)",
        "Epigastric or right upper quadrant pain (HELLP syndrome)"
      ]
    },
    medications: [
      {
        name: "Prenatal Vitamins with Folic Acid",
        type: "Nutritional supplement / vitamin-mineral complex",
        action: "Folic acid (400-800 mcg daily) is essential for DNA synthesis and neural tube closure, which occurs by day 28 of embryonic development (often before pregnancy is recognized). Folic acid deficiency impairs nucleotide synthesis in rapidly dividing fetal neural cells, leading to neural tube defects such as spina bifida and anencephaly. Prenatal vitamins also provide iron, calcium, vitamin D, and DHA for fetal development.",
        sideEffects: "Nausea, constipation (from iron component), dark-colored stools (normal with iron), metallic taste, stomach upset",
        contra: "Known allergy to any component; hemochromatosis (iron overload disorder); vitamin A-containing formulations should not exceed 10,000 IU daily due to teratogenic risk",
        pearl: "Take at bedtime with a small snack if nausea occurs; folic acid supplementation should ideally begin 1-3 months before conception; women with history of neural tube defect-affected pregnancy require 4 mg daily (10x the standard dose)"
      },
      {
        name: "Ferrous Sulfate (Iron Supplement)",
        type: "Iron replacement / hematologic agent",
        action: "Provides elemental iron necessary for hemoglobin synthesis in both maternal and fetal red blood cells. During pregnancy, iron requirements increase from 18 mg to 27 mg daily due to expanded maternal blood volume, fetal erythropoiesis, and placental development. Iron deficiency anemia (hemoglobin below 110 g/L in first trimester, below 105 g/L in second/third trimester) is the most common nutritional deficiency in pregnancy.",
        sideEffects: "Constipation (most common), nausea, abdominal cramping, dark/black stools (normal), diarrhea, metallic taste",
        contra: "Hemochromatosis or hemosiderosis; hemolytic anemias (iron will accumulate without benefit); concurrent IV iron administration; GI obstruction",
        pearl: "Take on an empty stomach with vitamin C (orange juice) to enhance absorption; separate from calcium, antacids, and dairy products by at least 2 hours; stool softeners may be prescribed concurrently to manage constipation"
      },
      {
        name: "Folic Acid",
        type: "Water-soluble B vitamin (Vitamin B9)",
        action: "Serves as a coenzyme in single-carbon transfer reactions essential for purine and pyrimidine synthesis (DNA and RNA building blocks). Critical during periods of rapid cell division, particularly during embryonic neural tube formation (days 21-28 post-conception). Adequate folate levels reduce neural tube defect risk by 50-70%.",
        sideEffects: "Generally well tolerated; rare allergic reactions; may mask vitamin B12 deficiency (treats anemia but not neurological damage) -- important in patients with pernicious anemia risk",
        contra: "Known hypersensitivity; untreated vitamin B12 deficiency (must be ruled out before high-dose supplementation to avoid masking pernicious anemia)",
        pearl: "Standard dose is 0.4-0.8 mg daily for all women of childbearing age; increase to 4 mg daily for women with prior NTD-affected pregnancy, diabetes, epilepsy on valproate/carbamazepine, or BMI above 35; found naturally in dark leafy greens, legumes, and fortified grains"
      }
    ],
    pearls: [
      "Naegele rule for estimated due date: first day of LMP minus 3 months plus 7 days -- this assumes a 28-day cycle with ovulation on day 14",
      "Fundal height should equal gestational age in weeks (plus or minus 2 cm) between 20-36 weeks -- a discrepancy of more than 3 cm requires ultrasound evaluation for growth abnormalities or dating error",
      "Leopold maneuvers consist of four steps: first maneuver (fundal grip identifies presenting part at fundus), second maneuver (lateral grip locates fetal back), third maneuver (Pawlik grip confirms presenting part at pelvis), fourth maneuver (pelvic grip assesses engagement)",
      "The prenatal visit schedule is: monthly until 28 weeks, biweekly from 28-36 weeks, weekly from 36 weeks to delivery -- more frequent visits allow closer monitoring as pregnancy progresses",
      "Folic acid supplementation must begin BEFORE conception for maximum neural tube protection because the neural tube closes by day 28 post-conception, often before pregnancy is confirmed",
      "Report ANY vaginal bleeding during pregnancy immediately -- first trimester bleeding may indicate threatened abortion or ectopic pregnancy; third trimester bleeding suggests placenta previa or placental abruption",
      "Blood pressure above 140/90 mmHg after 20 weeks gestation with proteinuria defines preeclampsia -- this requires urgent physician notification and close monitoring"
    ],
    quiz: [
      {
        question: "A practical nurse is measuring fundal height on a patient at 30 weeks gestation. The measurement is 24 cm. What is the most appropriate action?",
        options: [
          "Document the finding as normal for this gestational age",
          "Report the discrepancy to the physician because fundal height should approximate gestational age in weeks",
          "Remeasure using a different technique to confirm the finding",
          "Advise the patient to increase caloric intake to promote fetal growth"
        ],
        correct: 1,
        rationale: "Fundal height should approximate gestational age in weeks between 20-36 weeks, with an acceptable variance of plus or minus 2 cm. A measurement of 24 cm at 30 weeks represents a 6 cm discrepancy, which requires physician notification and ultrasound evaluation to assess for intrauterine growth restriction, oligohydramnios, or dating error."
      },
      {
        question: "A prenatal patient at 26 weeks gestation reports sudden onset of painless bright red vaginal bleeding. Which condition should the practical nurse suspect?",
        options: [
          "Placental abruption",
          "Placenta previa",
          "Bloody show indicating labor onset",
          "Normal cervical changes of pregnancy"
        ],
        correct: 1,
        rationale: "Painless, bright red vaginal bleeding in the second or third trimester is the hallmark presentation of placenta previa (abnormal placental implantation over or near the cervical os). Placental abruption typically presents with painful bleeding and a rigid abdomen. This is a medical emergency requiring immediate physician notification."
      },
      {
        question: "At what gestational age should Group B Streptococcus (GBS) screening be performed during prenatal care?",
        options: [
          "12-16 weeks gestation",
          "24-28 weeks gestation",
          "35-37 weeks gestation",
          "At the onset of labor only"
        ],
        correct: 2,
        rationale: "GBS screening via vaginal-rectal swab is performed at 35-37 weeks gestation. A positive result requires intrapartum antibiotic prophylaxis (typically penicillin G IV) during labor to prevent vertical transmission and neonatal GBS sepsis, which can cause pneumonia, meningitis, and death in newborns."
      }
    ]
  },

  "measles-rpn": {
    title: "Measles (Rubeola) for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Measles (Rubeola) Infection",
      content: "Measles is a highly contagious viral illness caused by the rubeola virus, a single-stranded RNA paramyxovirus that is transmitted exclusively between humans through respiratory droplets and airborne particles. Measles is one of the most contagious infectious diseases known, with a basic reproduction number (R0) of 12-18, meaning one infected person can transmit the virus to 12-18 susceptible individuals. The virus enters the body through the respiratory epithelium or conjunctival mucosa and initially replicates in local lymphoid tissue. Within 2-3 days, a primary viremia distributes the virus to the reticuloendothelial system (liver, spleen, lymph nodes), where it undergoes massive amplification. A secondary viremia then disseminates the virus to the skin, respiratory tract, and other organs, producing the characteristic clinical syndrome. The pathognomonic feature of measles is Koplik spots -- small, white-blue papules on an erythematous base that appear on the buccal mucosa opposite the molars 2-3 days before the rash onset. These represent focal areas of epithelial necrosis and mononuclear cell infiltration. The classic measles prodrome includes the 3 Cs: cough (from tracheobronchitis), coryza (runny nose from upper respiratory inflammation), and conjunctivitis (typically non-purulent). The characteristic maculopapular rash appears 3-5 days after the prodrome, beginning on the face and hairline and spreading cephalocaudally (head to trunk to extremities) over 3-4 days. The rash represents a T-cell-mediated immune response to viral antigens in the skin. Measles causes transient but significant immunosuppression lasting 4-6 weeks after infection by depleting memory B and T lymphocytes (immune amnesia), leaving patients vulnerable to secondary bacterial infections. Complications include otitis media (most common), pneumonia (most common cause of measles death), encephalitis (1 in 1,000 cases), and subacute sclerosing panencephalitis (SSPE, a fatal degenerative neurological disease occurring years later). The practical nurse plays a vital role in recognizing measles symptoms, implementing airborne isolation precautions, administering supportive care, monitoring for complications, and reinforcing the importance of MMR vaccination for prevention."
    },
    riskFactors: [
      "Unvaccinated status or incomplete MMR vaccination series (primary risk factor for susceptibility)",
      "Immunocompromised individuals (HIV/AIDS, chemotherapy, organ transplant recipients) who cannot receive live vaccines",
      "Infants under 12 months of age who have not yet received first MMR dose",
      "International travel to endemic regions (Africa, Southeast Asia, parts of Europe)",
      "Vitamin A deficiency (associated with increased severity, complications, and mortality -- especially in developing countries)",
      "Living in crowded or congregate settings (dormitories, shelters, refugee camps) facilitating airborne spread",
      "Healthcare workers without documented immunity or vaccination"
    ],
    diagnostics: [
      "Clinical diagnosis based on classic presentation: prodromal 3 Cs (cough, coryza, conjunctivitis), Koplik spots, and cephalocaudal maculopapular rash with high fever",
      "Measles IgM antibody: positive within 3 days of rash onset; the primary serological test for acute measles diagnosis",
      "Measles IgG antibody: indicates previous infection or vaccination; a 4-fold rise in paired acute and convalescent titers confirms recent infection",
      "Viral culture or RT-PCR (reverse transcription polymerase chain reaction): obtained from nasopharyngeal swab or urine; confirms diagnosis and enables genotyping for epidemiological tracking",
      "Complete blood count (CBC): typically shows leukopenia (decreased WBC) with lymphopenia, reflecting measles-induced immune suppression",
      "Chest X-ray: obtained if pneumonia is suspected; may show interstitial infiltrates (viral) or lobar consolidation (secondary bacterial pneumonia)"
    ],
    management: [
      "Implement airborne isolation precautions immediately: negative-pressure room, N95 respirator for all entering staff, restrict visitors; maintain isolation for 4 days after rash onset",
      "Administer vitamin A supplementation as prescribed: WHO recommends 200,000 IU orally for children over 12 months (reduced doses for younger children); reduces mortality by up to 50%",
      "Provide aggressive antipyretic therapy (acetaminophen or ibuprofen) to manage high fevers, which can exceed 40 degrees Celsius during the acute phase",
      "Maintain adequate hydration through oral or IV fluids; high fevers and decreased oral intake place patients at significant dehydration risk",
      "Monitor for secondary bacterial infections, particularly otitis media and pneumonia, which are the most common complications and leading causes of measles-related morbidity",
      "Provide comfort measures: dim room lighting for photophobia, humidified air for respiratory symptoms, cool compresses for fever",
      "Report all confirmed or suspected measles cases to public health authorities as required by law -- measles is a reportable disease in all jurisdictions"
    ],
    nursingActions: [
      "Implement and maintain airborne precautions: negative-pressure room, door closed at all times, N95 respirator fitted and worn by all staff entering the room",
      "Monitor temperature every 4 hours and administer antipyretics as prescribed; document peak temperatures and response to medication",
      "Assess respiratory status every 4 hours: auscultate lung sounds, monitor respiratory rate, observe for signs of pneumonia (productive cough, tachypnea, decreased SpO2)",
      "Inspect oral mucosa daily for Koplik spots (white-blue papules on buccal mucosa opposite molars) and document rash progression from face to trunk to extremities",
      "Maintain strict intake and output monitoring; encourage oral fluids; report urine output below 0.5 mL/kg/hour (dehydration indicator)",
      "Perform neurological assessments every shift: level of consciousness, orientation, pupil reactivity, headache severity -- report any changes immediately (encephalitis risk)",
      "Verify measles immunity status of all contacts and healthcare workers; report to infection prevention and control for post-exposure prophylaxis coordination"
    ],
    assessmentFindings: [
      "Prodromal phase (2-4 days): high fever (often above 39 degrees Celsius), the 3 Cs (cough, coryza, conjunctivitis), malaise, anorexia -- resembles severe upper respiratory infection",
      "Koplik spots: pathognomonic finding -- small white-blue papules on an erythematous base on the buccal mucosa opposite the molars; appear 2-3 days before the rash",
      "Maculopapular rash: begins on the face at the hairline, spreads cephalocaudally to trunk and extremities over 3-4 days; confluent on face, discrete on extremities; fades in order of appearance",
      "Fever pattern: characteristically spikes with rash onset (may reach 40-40.5 degrees Celsius) and begins to decline 3-4 days after rash appears",
      "Conjunctivitis: bilateral, non-purulent with photophobia; eyes appear red and watery without discharge",
      "Generalized lymphadenopathy: particularly cervical and postauricular lymph nodes; tender on palpation",
      "Desquamation: fine, brownish desquamation follows rash resolution, occurring in the same cephalocaudal pattern"
    ],
    signs: {
      left: [
        "Fever onset with cough, coryza, and conjunctivitis (prodrome)",
        "Koplik spots on buccal mucosa (pathognomonic early sign)",
        "Maculopapular rash beginning on face and spreading downward",
        "Mild photophobia and watery eyes",
        "Fatigue, malaise, and decreased appetite",
        "Cervical and postauricular lymphadenopathy"
      ],
      right: [
        "Temperature above 40.5 degrees Celsius unresponsive to antipyretics",
        "Respiratory distress with tachypnea and decreased SpO2 (pneumonia)",
        "Altered level of consciousness or seizures (encephalitis)",
        "Severe dehydration with oliguria and hemodynamic instability",
        "Stridor or upper airway obstruction (laryngotracheobronchitis/croup)",
        "Hemorrhagic rash with petechiae or DIC (hemorrhagic measles)"
      ]
    },
    medications: [
      {
        name: "Vitamin A (Retinol)",
        type: "Fat-soluble vitamin supplement / immunomodulator",
        action: "Vitamin A is essential for maintaining epithelial cell integrity, T-lymphocyte function, and mucosal immune responses. Measles depletes hepatic vitamin A stores and damages epithelial barriers. Supplementation restores immune function, promotes epithelial repair in the respiratory and gastrointestinal tracts, and reduces measles-related mortality by up to 50% in vitamin A-deficient populations.",
        sideEffects: "Nausea, vomiting, headache, transient bulging fontanelle in infants, blurred vision; chronic excessive intake causes hepatotoxicity and teratogenicity",
        contra: "Known hypersensitivity; pregnancy (high-dose vitamin A is teratogenic -- Category X); severe hepatic disease; hypervitaminosis A",
        pearl: "WHO-recommended dosing for measles: 200,000 IU orally for children over 12 months, 100,000 IU for 6-12 months, 50,000 IU for under 6 months; give two doses -- one immediately and one the next day; this is considered standard of care in measles treatment"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase enzymes in the central nervous system, reducing prostaglandin E2 production in the hypothalamic thermoregulatory center. Lowers the febrile set point and promotes heat dissipation through peripheral vasodilation and sweating. Does not have significant anti-inflammatory activity.",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (above 4 g/day in adults, above 75 mg/kg/day in children), nausea, rare allergic reactions, rare blood dyscrasias",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use disorder (reduced hepatic glutathione stores increase toxicity risk); known acetaminophen allergy",
        pearl: "Use weight-based dosing in pediatric patients (10-15 mg/kg every 4-6 hours, maximum 5 doses per 24 hours); always check combination products for hidden acetaminophen; preferred antipyretic in children (aspirin is contraindicated due to Reye syndrome risk)"
      },
      {
        name: "Ribavirin",
        type: "Nucleoside analogue antiviral (guanosine analogue)",
        action: "Interferes with viral RNA synthesis through multiple mechanisms: inhibits inosine monophosphate dehydrogenase (depleting intracellular GTP pools), acts as a direct RNA-dependent RNA polymerase inhibitor, causes lethal mutagenesis of the viral genome, and enhances T-helper type 1 immune responses against the virus.",
        sideEffects: "Hemolytic anemia (dose-limiting), fatigue, headache, insomnia, teratogenicity (absolutely contraindicated in pregnancy and requires reliable contraception for 6 months after therapy)",
        contra: "Pregnancy (Category X -- potent teratogen); partners of pregnant women; severe renal impairment (creatinine clearance below 50 mL/min); hemoglobinopathies; autoimmune hepatitis; concurrent didanosine use",
        pearl: "Reserved for severe or complicated measles in immunocompromised patients (not standard treatment for uncomplicated cases); administered as IV or aerosolized form; monitor hemoglobin every 2 weeks during therapy due to hemolytic anemia risk"
      }
    ],
    pearls: [
      "Measles is transmitted via airborne route -- it requires negative-pressure room isolation with N95 respirators; droplet precautions alone are INSUFFICIENT",
      "Koplik spots are pathognomonic for measles and appear 2-3 days BEFORE the rash -- recognizing them allows early identification and isolation before rash-stage contagiousness peaks",
      "The classic prodrome mnemonic is the 3 Cs: Cough, Coryza (runny nose), and Conjunctivitis -- these precede the rash by 2-4 days",
      "The maculopapular rash follows a cephalocaudal spread pattern: face and hairline first, then trunk, then extremities -- and fades in the same order",
      "Vitamin A supplementation reduces measles mortality by up to 50% and is considered standard of care by the WHO for all children with measles",
      "Measles causes immune amnesia by depleting memory lymphocytes for 4-6 weeks after infection, increasing vulnerability to secondary bacterial infections",
      "Pneumonia is the most common cause of death from measles -- monitor respiratory status closely and report tachypnea, productive cough, or declining oxygen saturation immediately"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a child admitted with suspected measles. Which type of isolation precautions must be implemented?",
        options: [
          "Contact precautions with gown and gloves",
          "Droplet precautions with surgical mask",
          "Airborne precautions with N95 respirator and negative-pressure room",
          "Standard precautions only with hand hygiene"
        ],
        correct: 2,
        rationale: "Measles is transmitted via the airborne route, meaning viral particles can remain suspended in the air for up to 2 hours after an infected person has left the area. Airborne precautions require a negative-pressure room with the door closed and N95 respirators for all staff entering the room. Droplet precautions alone are insufficient."
      },
      {
        question: "The practical nurse identifies small white-blue spots on the buccal mucosa of a febrile child with cough and runny nose. What are these spots called?",
        options: [
          "Fordyce spots",
          "Koplik spots",
          "Epstein pearls",
          "Aphthous ulcers"
        ],
        correct: 1,
        rationale: "Koplik spots are pathognomonic for measles. They are small, white-blue papules on an erythematous base found on the buccal mucosa opposite the molars. They appear 2-3 days before the characteristic maculopapular rash and are a critical early diagnostic finding."
      },
      {
        question: "Which supplement has been shown to reduce measles-related mortality by up to 50% and is recommended by the WHO for all children with measles?",
        options: [
          "Vitamin C",
          "Zinc",
          "Vitamin A",
          "Vitamin D"
        ],
        correct: 2,
        rationale: "Vitamin A supplementation is recommended by the WHO for all children diagnosed with measles. It restores immune function, promotes epithelial repair, and has been shown to reduce mortality by up to 50%, particularly in populations with vitamin A deficiency."
      }
    ]
  },

  "medication-errors-rpn": {
    title: "Medication Error Prevention for Practical Nurses",
    cellular: {
      title: "Understanding Medication Errors and Safety Systems",
      content: "Medication errors are defined as any preventable event that may cause or lead to inappropriate medication use or patient harm while the medication is in the control of the healthcare professional, patient, or consumer. Medication errors can occur at any stage of the medication use process: prescribing, transcribing, dispensing, administering, and monitoring. The practical nurse is most directly involved in the administration and monitoring stages, where errors are both common and potentially interceptable. Research consistently demonstrates that medication errors affect approximately 5-10% of hospitalized patients, with administration errors accounting for 26-32% of all medication errors. The most common types of medication errors include wrong dose (most frequent), wrong drug, wrong route, wrong time, wrong patient, omission errors, and documentation errors. Root cause analysis (RCA) is a systematic approach used to identify the underlying system failures that contribute to errors, rather than focusing on individual blame. The Swiss Cheese Model (James Reason model) conceptualizes healthcare safety as multiple layers of defense (like slices of Swiss cheese), each with inherent weaknesses (holes). An error reaches the patient only when the holes in multiple defense layers align simultaneously. This model emphasizes that errors result from system failures rather than individual negligence and forms the foundation of the Just Culture model. The Just Culture model differentiates between human error (inadvertent slip or mistake deserving consolation and system improvement), at-risk behavior (conscious deviation from standard practice without awareness of risk, deserving coaching and education), and reckless behavior (conscious disregard for known substantial risk, deserving disciplinary action). This framework encourages error reporting by removing punitive responses to honest mistakes while maintaining accountability for reckless choices. The practical nurse must understand and utilize multiple error prevention strategies: adherence to the rights of medication administration, independent double-checks for high-alert medications, barcode medication administration (BCMA) systems, medication reconciliation at transitions of care, and the ISMP (Institute for Safe Medication Practices) high-alert medication list. Timely and accurate reporting of medication errors and near-misses through incident reporting systems is essential for organizational learning and system improvement."
    },
    riskFactors: [
      "Look-alike/sound-alike (LASA) medications stored adjacently (e.g., hydroxyzine vs hydralazine, metformin vs metronidazole)",
      "High-alert medications with narrow therapeutic indices (insulin, heparin, warfarin, opioids, chemotherapy)",
      "Interruptions and distractions during medication preparation and administration",
      "Nurse fatigue from extended shifts, overtime, or inadequate rest between shifts",
      "Incomplete or illegible medication orders, verbal orders without read-back verification",
      "Patient transitions of care (admission, transfer, discharge) where medication reconciliation gaps occur",
      "Polypharmacy in elderly patients (5 or more medications increasing drug interaction and confusion risk)"
    ],
    diagnostics: [
      "Incident report review: documents the circumstances, type of error, contributing factors, patient outcome, and interventions taken; provides data for trend analysis and system improvement",
      "Root cause analysis (RCA): systematic investigation identifying the sequence of events, human factors, system failures, and latent conditions that allowed the error to occur; results in actionable recommendations",
      "Medication reconciliation audit: comparison of the patient's current medication list against ordered medications at each transition of care; identifies discrepancies, duplications, and omissions",
      "Failure Mode and Effects Analysis (FMEA): proactive risk assessment tool that evaluates medication processes BEFORE errors occur to identify vulnerabilities and implement preventive measures",
      "Barcode medication administration (BCMA) system reports: technology-generated data identifying scan failures, overrides, and workarounds that may indicate system vulnerabilities",
      "Adverse drug event (ADE) surveillance: ongoing monitoring of patient outcomes for evidence of drug-related harm including laboratory abnormalities, clinical deterioration, and allergic reactions"
    ],
    management: [
      "Implement and consistently follow the rights of medication administration: right patient (two identifiers), right medication, right dose, right route, right time, right documentation, right reason, right response",
      "Perform independent double-checks for all high-alert medications (insulin, heparin, opioids, chemotherapy, IV potassium) with a second licensed nurse verifying the five rights before administration",
      "Complete medication reconciliation at every transition of care: admission, transfer between units, and discharge; compare home medications with inpatient orders and resolve all discrepancies",
      "Use ISMP tall-man lettering to differentiate look-alike/sound-alike medications (e.g., DOBUTamine vs DOPamine, hydrOXYzine vs hydrALAZINE)",
      "Report all medication errors and near-misses through the facility incident reporting system within the established timeframe; focus on system improvement rather than individual blame",
      "Implement a dedicated no-interruption zone around medication preparation areas to reduce distraction-related errors",
      "Participate in ongoing medication safety education and competency validation, including annual high-alert medication training"
    ],
    nursingActions: [
      "Verify patient identity using two independent identifiers (name and date of birth OR name and medical record number) before every medication administration -- NEVER use room number as an identifier",
      "Check the medication label THREE times: when removing from storage, when preparing the dose, and at the bedside before administration; compare against the medication administration record (MAR)",
      "Perform an independent double-check with a second nurse for all high-alert medications: both nurses independently verify the drug, dose, route, concentration, pump rate, and patient identity",
      "Use the SBAR format to communicate medication errors to the physician: Situation (what error occurred), Background (patient's relevant history), Assessment (patient's current condition), Recommendation (what you need)",
      "Document medication errors according to facility policy: complete an incident report, document the error in the patient's medical record factually (without referencing the incident report), and notify the physician",
      "Perform medication reconciliation by comparing the patient's home medication list with current orders at admission, transfer, and discharge; clarify all discrepancies with the prescriber",
      "Monitor patients for adverse drug reactions after medication administration: assess for expected therapeutic effects and potential side effects within the appropriate timeframe for the medication given"
    ],
    assessmentFindings: [
      "Signs of adverse drug reaction: new-onset rash, urticaria, pruritus, angioedema, bronchospasm, hypotension, tachycardia -- may indicate allergic reaction or medication error",
      "Unexpected change in patient condition temporally related to medication administration: altered mental status, respiratory depression, hypoglycemia, bleeding -- assess for dose error or drug interaction",
      "Documentation discrepancies: medication administered but not documented, or documented but not administered (omission error); discrepancy between ordered dose and administered dose",
      "Patient or family report of unfamiliar medication, unexpected side effects, or missed doses -- always investigate patient concerns about their medications",
      "Laboratory value abnormalities: supratherapeutic drug levels, INR above therapeutic range (warfarin), blood glucose below 4.0 mmol/L (insulin), aPTT above target (heparin)",
      "Near-miss events identified before reaching the patient: wrong medication pulled from dispensing cabinet, incorrect dose calculated, wrong patient's medication in hand"
    ],
    signs: {
      left: [
        "Minor documentation discrepancy (wrong time recorded)",
        "Patient questions about an unfamiliar medication (intercepted error)",
        "Near-miss identified during barcode scanning (wrong patient)",
        "Delayed medication administration (outside scheduled window)",
        "Omission of a non-critical medication (non-time-sensitive vitamin)",
        "Incorrect storage or labeling identified before administration"
      ],
      right: [
        "Anaphylactic reaction after medication administration (airway emergency)",
        "Severe hypoglycemia from insulin overdose (blood glucose below 2.2 mmol/L)",
        "Respiratory depression from opioid overdose (respiratory rate below 8)",
        "Major hemorrhage from anticoagulant overdose (uncontrolled bleeding)",
        "Wrong-patient medication administered (high-alert medication given to wrong individual)",
        "Cardiac arrest or death related to medication error"
      ]
    },
    medications: [
      {
        name: "Documentation Tools: Incident Report Form",
        type: "Documentation and Safety Reporting Tool",
        action: "The incident report (also called occurrence report or safety event report) is a confidential, factual document that captures the details of a medication error or near-miss event. It records what happened, when it happened, who was involved, what interventions were taken, and the patient outcome. The report is submitted to risk management and quality improvement departments for analysis, trending, and system improvement. It is a quality improvement document, NOT part of the patient's medical record.",
        sideEffects: "Potential for underreporting due to fear of punitive consequences; time required for completion; emotional distress for involved staff requiring support",
        contra: "Should never be referenced in the patient's medical record (only factual documentation of what occurred belongs in the chart); should not be used for punitive action against staff who report in good faith (Just Culture model)",
        pearl: "Complete incident reports as soon as possible while details are fresh; document FACTS only (what you observed, what you did, patient response) -- do not include opinions, blame, or speculation; in the medical record, document the error factually without referencing the incident report"
      },
      {
        name: "Documentation Tools: Medication Reconciliation Form",
        type: "Transition of Care Safety Tool",
        action: "A systematic process of comparing all medications the patient is currently taking (including prescription, over-the-counter, herbal, and supplements) with medications ordered at each transition of care (admission, transfer, discharge). The form creates a comprehensive, accurate medication list that identifies discrepancies including omissions, duplications, interactions, and dosage changes. It serves as the authoritative source for medication orders during care transitions.",
        sideEffects: "Time-intensive process requiring thorough patient/family interview and pharmacy verification; potential for incomplete information if patient cannot provide accurate history; risk of transcription errors during manual reconciliation",
        contra: "Should not be performed in isolation without patient or family input; should not bypass pharmacy verification for complex regimens; incomplete reconciliation should not be accepted -- all discrepancies must be resolved with the prescriber",
        pearl: "Best practice is to complete medication reconciliation within 24 hours of admission and at every subsequent transition of care; use at least two sources to verify the home medication list (patient interview, pharmacy records, medication bottles); always include dose, frequency, and route for every medication"
      },
      {
        name: "Documentation Tools: Error Reporting System (Safety Event Database)",
        type: "Organizational Safety and Quality Improvement System",
        action: "A centralized electronic database that collects, categorizes, and analyzes medication error and near-miss reports from across the organization. The system uses standardized classification (NCC MERP Index for Categorizing Medication Errors: Category A through I, from no error to patient death) to grade severity and track trends. Aggregate data identifies systemic vulnerabilities, high-risk processes, and opportunities for targeted interventions. Reports are shared with pharmacy, nursing leadership, and safety committees to drive system-wide improvements.",
        sideEffects: "Requires organizational commitment to non-punitive reporting culture; resource-intensive to maintain and analyze; potential for report fatigue if staff do not see resulting improvements",
        contra: "Should never be used as a tool for individual punishment or disciplinary action in cases of human error (Just Culture model); data should not be disclosed in legal discovery if protected under quality improvement privilege",
        pearl: "Near-miss reports are equally valuable as actual error reports because they reveal system vulnerabilities before patient harm occurs; organizations with higher reporting rates paradoxically have BETTER safety cultures because staff feel safe to report"
      }
    ],
    pearls: [
      "The three most common medication errors at the administration stage are wrong dose, wrong time, and omission errors -- following the rights of medication administration prevents the majority of these errors",
      "The Just Culture model distinguishes between human error (consolation and system fix), at-risk behavior (coaching), and reckless behavior (disciplinary action) -- this framework encourages error reporting without fear",
      "High-alert medications (insulin, heparin, warfarin, opioids, concentrated electrolytes, chemotherapy) require an independent double-check by two licensed nurses before administration",
      "NEVER use room number as a patient identifier -- always verify identity using two independent identifiers (name and date of birth, or name and medical record number)",
      "The Swiss Cheese Model (James Reason) teaches that errors reach patients only when holes in multiple defense layers align -- each safety check (barcode scanning, double-check, reconciliation) is a layer of defense",
      "Incident reports are quality improvement documents and should NEVER be referenced in the patient's medical record -- the chart should contain only factual documentation of what occurred",
      "Near-miss reports are as valuable as actual error reports because they reveal system vulnerabilities before patient harm occurs -- always report near-misses"
    ],
    quiz: [
      {
        question: "A practical nurse discovers that the wrong dose of insulin was administered to a patient. After assessing the patient and notifying the physician, what is the next priority action?",
        options: [
          "Discuss the error with coworkers to prevent similar mistakes",
          "Complete an incident report and document the event factually in the medical record",
          "Wait to see if the patient develops symptoms before taking further action",
          "Alter the medication administration record to reflect the correct dose"
        ],
        correct: 1,
        rationale: "After ensuring patient safety (assessing the patient and notifying the physician), the practical nurse must complete an incident report AND document the error factually in the patient's medical record. The incident report supports quality improvement; the chart documents what happened for continuity of care. Altering records is falsification and is never acceptable."
      },
      {
        question: "According to the Just Culture model, a nurse who unknowingly administers a medication to which the patient has a documented allergy because the allergy was not entered in the electronic health record would be classified as which type of behavior?",
        options: [
          "Reckless behavior requiring disciplinary action",
          "At-risk behavior requiring coaching",
          "Human error requiring system improvement and consolation",
          "Criminal negligence requiring legal action"
        ],
        correct: 2,
        rationale: "Under the Just Culture model, this scenario represents human error -- an inadvertent mistake made despite the nurse's intent to provide safe care. The system failure (allergy not entered in the EHR) was the root cause. The appropriate response is consolation for the nurse and system improvement (ensuring allergy documentation processes are reliable)."
      },
      {
        question: "Which medications are classified as high-alert medications requiring an independent double-check by two licensed nurses before administration?",
        options: [
          "Acetaminophen, multivitamins, and stool softeners",
          "Insulin, heparin, opioids, and concentrated electrolytes",
          "Oral antibiotics, antacids, and topical creams",
          "Antihistamines, cough suppressants, and laxatives"
        ],
        correct: 1,
        rationale: "High-alert medications include insulin, heparin/anticoagulants, opioids, concentrated electrolytes (IV potassium, IV magnesium), and chemotherapy agents. These medications carry a heightened risk of causing significant patient harm when used in error. The Institute for Safe Medication Practices (ISMP) maintains the definitive high-alert medication list."
      }
    ]
  },

  "menieres-disease-basics-rpn": {
    title: "Meniere's Disease for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Meniere's Disease (Endolymphatic Hydrops)",
      content: "Meniere's disease is a chronic disorder of the inner ear characterized by the classic triad of episodic vertigo, fluctuating sensorineural hearing loss, and tinnitus, with a sensation of aural fullness (pressure in the ear). The underlying pathology is endolymphatic hydrops -- an abnormal accumulation of endolymph within the membranous labyrinth of the inner ear. The inner ear contains two fluid compartments: the endolymph (potassium-rich fluid within the membranous labyrinth, including the cochlea and vestibular organs) and the perilymph (sodium-rich fluid surrounding the membranous labyrinth within the bony labyrinth). Under normal conditions, endolymph is produced by the stria vascularis in the cochlea and absorbed by the endolymphatic sac. In Meniere's disease, either overproduction of endolymph or impaired absorption by the endolymphatic sac (or both) causes progressive distension of the membranous labyrinth. This distension disrupts the normal ionic gradients between endolymph and perilymph that are essential for hair cell mechanotransduction (the conversion of sound waves and head movement into neural signals). When the membranous labyrinth reaches critical distension, Reissner's membrane (separating endolymph from perilymph in the cochlea) may rupture, allowing potassium-rich endolymph to mix with sodium-rich perilymph. This ionic contamination paralyzes the vestibular and cochlear hair cells, producing the acute attack of vertigo, hearing loss, and tinnitus. The rupture then heals, endolymph reaccumulates, and the cycle repeats. Attacks typically last 20 minutes to several hours (not seconds and not days), which helps differentiate Meniere's disease from benign paroxysmal positional vertigo (BPPV, lasting seconds) and vestibular neuritis (lasting days). Over time, repeated episodes cause cumulative damage to cochlear hair cells, resulting in progressive, permanent sensorineural hearing loss, typically in the low-frequency range initially. The practical nurse plays an important role in patient safety during acute vertigo episodes (fall prevention), medication administration, dietary counseling (sodium restriction), and monitoring for complications including progressive hearing loss and the psychological impact of chronic vestibular disease."
    },
    riskFactors: [
      "High dietary sodium intake (promotes endolymph fluid retention and membrane distension)",
      "Family history of Meniere's disease (genetic predisposition identified in 5-15% of cases)",
      "Autoimmune conditions (autoimmune inner ear disease may trigger or coexist with Meniere's)",
      "History of viral inner ear infections (viral labyrinthitis may damage the endolymphatic sac)",
      "Allergies and atopic conditions (histamine-mediated inflammation may affect endolymph regulation)",
      "Stress and fatigue (act as triggers for acute attacks in susceptible individuals)",
      "Migraine history (vestibular migraine and Meniere's disease share overlapping mechanisms)"
    ],
    diagnostics: [
      "Audiometry (pure tone audiogram): demonstrates low-frequency sensorineural hearing loss in the affected ear during early disease; pattern shifts to flat or pan-frequency loss as disease progresses",
      "Electronystagmography (ENG) or videonystagmography (VNG): measures involuntary eye movements (nystagmus) during caloric testing to evaluate vestibular function; reduced vestibular response on the affected side",
      "MRI of internal auditory canal with gadolinium: rules out vestibular schwannoma (acoustic neuroma) and other structural causes; may show endolymphatic hydrops on high-resolution sequences",
      "Electrocochleography (ECochG): measures electrical potentials generated in the inner ear; elevated summating potential to action potential ratio suggests endolymphatic hydrops",
      "Comprehensive metabolic panel: assesses electrolytes, thyroid function, and glucose to exclude metabolic causes of vertigo and hearing changes",
      "Glycerol dehydration test: administration of oral glycerol followed by repeat audiometry; temporary hearing improvement confirms endolymphatic hydrops (rarely used clinically)"
    ],
    management: [
      "Implement dietary sodium restriction to 1500-2000 mg daily to reduce endolymph volume and prevent attacks; provide patient with sodium counting education and food label reading skills",
      "Administer prescribed vestibular suppressants during acute attacks (meclizine, dimenhydrinate) to reduce vertigo intensity; medications are for acute management only, not daily prophylaxis",
      "Ensure patient safety during acute vertigo episodes: assist to a safe position (lying down with eyes closed), raise side rails, maintain clear path to bathroom, implement fall precautions",
      "Encourage avoidance of identified triggers: caffeine, alcohol, tobacco, excessive salt, stress, fatigue, and barometric pressure changes",
      "Coordinate referral to audiology for hearing aid evaluation when progressive hearing loss affects communication and quality of life",
      "Perform the Epley maneuver ONLY if concurrent benign paroxysmal positional vertigo (BPPV) is diagnosed -- this maneuver treats canalithiasis, not Meniere's disease itself",
      "Provide psychosocial support and refer to support groups; chronic unpredictable vertigo attacks cause significant anxiety, depression, and social isolation"
    ],
    nursingActions: [
      "Assess for the classic Meniere's triad at each encounter: vertigo (duration, intensity, triggers), tinnitus (constant vs intermittent, pitch, laterality), and hearing changes (fluctuating vs progressive)",
      "Implement fall prevention measures during and after acute attacks: bed in low position, call bell within reach, non-skid footwear, assist with ambulation until vertigo resolves",
      "Monitor for nystagmus (involuntary rhythmic eye movements) during acute episodes; document direction (horizontal, rotary), duration, and associated symptoms",
      "Administer antiemetics as prescribed for nausea and vomiting associated with acute vertigo episodes; ensure IV access if severe vomiting prevents oral medication absorption",
      "Educate patient on low-sodium diet: avoid processed foods, canned soups, deli meats, soy sauce, and restaurant meals; read nutrition labels for sodium content per serving",
      "Instruct patient on safety precautions: avoid driving during and immediately after attacks, avoid climbing ladders or working at heights, avoid swimming alone",
      "Document hearing assessment findings at each visit using consistent methods (whispered voice test or audiometric results) to track progressive hearing loss over time"
    ],
    assessmentFindings: [
      "Episodic vertigo lasting 20 minutes to several hours: true rotational sensation (room spinning), not lightheadedness; patient appears distressed and may be diaphoretic and pale",
      "Fluctuating unilateral sensorineural hearing loss: initially affects low frequencies; hearing may partially recover between attacks early in disease but progressively worsens",
      "Tinnitus: typically described as low-pitched roaring, buzzing, or ocean-like sound in the affected ear; intensifies before and during acute attacks",
      "Aural fullness: sensation of pressure or congestion in the affected ear, often described as similar to altitude pressure changes; frequently precedes acute vertigo attacks",
      "Horizontal or rotary nystagmus during acute attacks: fast phase initially toward the affected ear, then reverses as vestibular function recovers",
      "Nausea, vomiting, and diaphoresis during acute vertigo episodes from vestibular-autonomic reflex activation",
      "Romberg test positive: patient sways or falls toward the affected side when standing with eyes closed, indicating unilateral vestibular dysfunction"
    ],
    signs: {
      left: [
        "Aural fullness or pressure sensation in one ear",
        "Intermittent low-pitched tinnitus (roaring or buzzing)",
        "Mild unsteadiness or disequilibrium between attacks",
        "Fluctuating hearing difficulty, especially in noisy environments",
        "Mild nausea during position changes",
        "Sensitivity to loud sounds (recruitment phenomenon)"
      ],
      right: [
        "Severe vertigo with inability to stand or walk (fall risk)",
        "Projectile vomiting with severe dehydration risk",
        "Sudden complete hearing loss in the affected ear (cochlear emergency)",
        "Drop attacks (Tumarkin otolithic crisis -- sudden fall without warning)",
        "Severe nystagmus with inability to fixate gaze",
        "Signs of suicidal ideation from chronic debilitating symptoms"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert/Bonamine)",
        type: "Antihistamine / vestibular suppressant (H1 receptor antagonist)",
        action: "Blocks histamine H1 receptors in the vomiting center and vestibular nuclei of the brainstem, reducing neural activity responsible for the sensation of vertigo, nausea, and vomiting. Also has weak anticholinergic properties that further suppress vestibular input. Reduces the severity and duration of acute vertigo episodes but does not treat the underlying endolymphatic hydrops.",
        sideEffects: "Drowsiness (most common), dry mouth, blurred vision, urinary retention, constipation (anticholinergic effects)",
        contra: "Narrow-angle glaucoma; urinary retention or prostatic hypertrophy (anticholinergic effects worsen obstruction); caution in elderly patients due to increased fall risk from sedation",
        pearl: "Use ONLY during acute attacks, not as a daily maintenance medication -- chronic vestibular suppressant use delays central vestibular compensation and prolongs recovery; take 30-60 minutes before anticipated trigger situations (car travel, known trigger exposure)"
      },
      {
        name: "Dimenhydrinate (Gravol/Dramamine)",
        type: "Antihistamine / antiemetic (H1 receptor antagonist with anticholinergic properties)",
        action: "Combines diphenhydramine (H1 antihistamine) with 8-chlorotheophylline (a mild stimulant to partially offset drowsiness). Suppresses vestibular end-organ stimulation and depresses labyrinthine function through both antihistamine and anticholinergic mechanisms. Reduces vertigo-associated nausea and vomiting by acting on the chemoreceptor trigger zone and vomiting center.",
        sideEffects: "Significant drowsiness and sedation, dry mouth, blurred vision, urinary retention, paradoxical excitability in children, tachycardia",
        contra: "Narrow-angle glaucoma; concurrent use with other CNS depressants or anticholinergics (additive effects); neonates and premature infants; severe hepatic impairment",
        pearl: "Available in oral, rectal (suppository), and injectable forms -- use rectal or IM route when vomiting prevents oral administration; monitor elderly patients closely for excessive sedation and fall risk; instruct patients not to drive or operate machinery while taking this medication"
      },
      {
        name: "Hydrochlorothiazide (HCTZ/Microzide)",
        type: "Thiazide diuretic",
        action: "Inhibits sodium-chloride cotransporter in the distal convoluted tubule of the kidney, promoting sodium, chloride, and water excretion. In Meniere's disease, the rationale is to reduce overall body fluid volume, which may indirectly decrease endolymph production and lower endolymphatic pressure, reducing the frequency and severity of vertigo attacks.",
        sideEffects: "Hypokalemia (most clinically significant), hyponatremia, hyperuricemia (gout risk), hyperglycemia, hypercalcemia, photosensitivity, orthostatic hypotension",
        contra: "Anuria or severe renal impairment; sulfonamide allergy (cross-sensitivity); hypokalemia; severe hepatic disease (risk of hepatic encephalopathy); pregnancy (may cause neonatal jaundice and thrombocytopenia)",
        pearl: "Monitor serum potassium closely -- hypokalemia is common and can cause cardiac dysrhythmias; encourage potassium-rich foods (bananas, oranges, potatoes) unless contraindicated; take in the morning to avoid nocturia; weigh daily and report weight gain exceeding 1 kg per day (fluid retention)"
      }
    ],
    pearls: [
      "The classic Meniere's disease triad is episodic vertigo, fluctuating sensorineural hearing loss, and tinnitus, with aural fullness as a frequent fourth symptom",
      "Meniere's attacks typically last 20 minutes to several hours -- vertigo lasting only seconds suggests BPPV; vertigo lasting days suggests vestibular neuritis",
      "Low-sodium diet (1500-2000 mg daily) is the cornerstone of Meniere's disease management -- excess sodium promotes endolymph retention and triggers attacks",
      "Vestibular suppressants (meclizine, dimenhydrinate) are for ACUTE attacks only -- chronic daily use delays central vestibular compensation and worsens long-term balance",
      "The Epley maneuver treats BPPV (canalithiasis), NOT Meniere's disease -- these are different conditions with different pathophysiology despite both causing vertigo",
      "Fall prevention is the highest nursing priority during acute vertigo episodes -- patients are at extreme risk for injury due to severe disequilibrium and disorientation",
      "Monitor for psychological impact: chronic unpredictable vertigo attacks cause significant anxiety, depression, and social withdrawal -- screen for mental health concerns at each visit"
    ],
    quiz: [
      {
        question: "A patient with Meniere's disease is experiencing an acute vertigo episode with severe nausea and vomiting. What is the practical nurse's priority action?",
        options: [
          "Administer the prescribed vestibular suppressant and ensure patient safety with fall precautions",
          "Encourage the patient to walk to the bathroom for vomiting",
          "Perform the Epley maneuver to reposition displaced otoliths",
          "Restrict all oral fluids until the vertigo episode resolves"
        ],
        correct: 0,
        rationale: "The priority during an acute Meniere's attack is patient safety (fall prevention, safe positioning) and symptom management (administering prescribed vestibular suppressants and antiemetics). The Epley maneuver is used for BPPV, not Meniere's disease. Encouraging ambulation during severe vertigo increases fall risk."
      },
      {
        question: "Which dietary modification is the cornerstone of Meniere's disease management and should be reinforced by the practical nurse?",
        options: [
          "High-protein, low-carbohydrate diet",
          "Gluten-free diet",
          "Low-sodium diet (1500-2000 mg daily)",
          "Low-fat, high-fiber diet"
        ],
        correct: 2,
        rationale: "Sodium restriction to 1500-2000 mg daily is the dietary cornerstone of Meniere's disease management. Excess dietary sodium promotes fluid retention, which increases endolymph volume and triggers attacks. The practical nurse should teach patients to read food labels, avoid processed foods, and track daily sodium intake."
      },
      {
        question: "A patient with Meniere's disease reports episodes of vertigo lasting 30 seconds when turning in bed. The practical nurse recognizes this presentation is more consistent with which condition?",
        options: [
          "Meniere's disease acute attack",
          "Benign paroxysmal positional vertigo (BPPV)",
          "Vestibular neuritis",
          "Labyrinthitis"
        ],
        correct: 1,
        rationale: "Vertigo lasting seconds triggered by position changes is characteristic of BPPV, not Meniere's disease. Meniere's attacks typically last 20 minutes to several hours and are not specifically position-triggered. This distinction is important because BPPV is treated with the Epley maneuver, while Meniere's disease requires different management strategies."
      }
    ]
  }
};

let ok = 0;
let skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else skip++;
}
console.log(`\nDone: ${ok} injected, ${skip} skipped`);
