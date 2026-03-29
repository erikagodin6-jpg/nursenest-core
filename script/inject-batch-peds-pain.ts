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
  "pavlik-harness-rpn": {
    title: "Pavlik Harness and Developmental Dysplasia of the Hip",
    cellular: {
      title: "Anatomy and Pathophysiology of Developmental Dysplasia of the Hip",
      content: "Developmental dysplasia of the hip (DDH) encompasses a spectrum of abnormalities affecting the hip joint in neonates and infants, ranging from mild acetabular immaturity to complete dislocation of the femoral head from the acetabulum. The hip joint is a ball-and-socket synovial joint formed by the articulation of the femoral head (ball) with the acetabulum (socket) of the pelvis. In the developing fetus and neonate, both the femoral head and acetabulum are primarily cartilaginous structures that undergo progressive ossification during the first years of life. Normal hip development requires the femoral head to be concentrically seated within the acetabulum, providing the mechanical stimulus necessary for proper acetabular deepening and femoral head sphericity. When the femoral head is displaced or subluxated, the acetabulum fails to develop its normal depth and curvature, and the femoral head may become flattened or irregularly shaped. The ligamentum teres, joint capsule, and labrum provide stability to the neonatal hip, but these structures are relatively lax in the newborn period due to the influence of maternal relaxin hormone, which crosses the placenta and softens connective tissues. This physiological laxity, combined with positioning factors during fetal development and the postnatal period, creates vulnerability for hip instability. DDH is classified into three categories based on severity: dysplasia (the acetabulum is shallow but the femoral head remains in the socket), subluxation (the femoral head is partially displaced from the acetabulum but maintains some contact), and dislocation (the femoral head is completely displaced from the acetabulum). Two clinical maneuvers form the cornerstone of newborn hip screening. The Barlow maneuver is a provocative test that attempts to dislocate an unstable hip by adducting the flexed hip while applying gentle posterior pressure on the knee; a positive Barlow indicates the hip is currently located but can be dislocated. The Ortolani maneuver is a reduction test that attempts to relocate a dislocated hip by abducting the flexed hip while applying gentle anterior pressure on the greater trochanter; a positive Ortolani produces a palpable clunk as the femoral head slides back into the acetabulum. The Pavlik harness is a dynamic splinting device designed to maintain the infant's hips in flexion (approximately 100 to 110 degrees) and abduction (approximately 50 to 70 degrees), positioning the femoral head within the acetabulum to promote normal joint development. The harness allows some movement within a safe zone while preventing hip extension and adduction, which could cause redislocation. Treatment is most effective when initiated before 6 weeks of age, with success rates exceeding 90 percent in this age group. The harness is typically worn continuously for 6 to 12 weeks, followed by a period of part-time wear, with total treatment duration guided by ultrasonographic confirmation of hip stability and acetabular development. Complications of Pavlik harness treatment include avascular necrosis of the femoral head (the most serious complication, occurring when excessive abduction compresses the medial circumflex femoral artery), femoral nerve palsy from excessive flexion, and skin breakdown beneath the harness straps. The practical nurse plays a critical role in monitoring harness application, assessing for complications, and educating parents on proper harness maintenance and skin care."
    },
    riskFactors: [
      "Female sex (four to eight times more common in females due to greater susceptibility to maternal relaxin)",
      "Breech presentation (particularly frank breech with hips flexed and knees extended, placing sustained pressure on the hip joint)",
      "Family history of DDH (first-degree relatives increase risk twenty to forty fold)",
      "First-born infant (tighter uterine musculature restricts fetal movement)",
      "Oligohydramnios (decreased amniotic fluid limits fetal movement and increases joint compression)",
      "History of swaddling with hips extended and adducted (tight wrapping that forces legs straight increases dislocation risk)",
      "Associated musculoskeletal conditions such as torticollis or metatarsus adductus (suggest intrauterine positional forces)"
    ],
    diagnostics: [
      "Barlow maneuver: performed by flexing the infant's hip to 90 degrees, then gently adducting while applying posterior pressure; positive result is a palpable clunk as the femoral head slips posteriorly out of the acetabulum",
      "Ortolani maneuver: performed by flexing the infant's hip to 90 degrees, then gently abducting while lifting the greater trochanter anteriorly; positive result is a palpable clunk as the dislocated femoral head reduces back into the acetabulum",
      "Hip ultrasound (preferred for infants under 4 to 6 months): gold standard imaging for DDH in young infants; evaluates acetabular morphology (alpha angle) and femoral head position without radiation exposure",
      "Hip radiograph (AP pelvis, used after 4 to 6 months when ossification centers are visible): evaluates Shenton line continuity, acetabular index, and position of ossific nucleus",
      "Asymmetric gluteal or thigh skin folds: observed during inspection; unequal folds suggest hip asymmetry but are not diagnostic alone",
      "Galeazzi sign (Allis sign): with both hips and knees flexed and feet flat on the table, apparent shortening of the femur on the affected side indicates posterior displacement of the femoral head"
    ],
    management: [
      "Apply Pavlik harness as prescribed, maintaining hip flexion between 100 and 110 degrees and abduction between 50 and 70 degrees; verify strap positioning at each visit",
      "Instruct parents on proper diapering technique within the harness: place the diaper under the harness straps, not over them, to prevent soiling of the device",
      "Schedule follow-up ultrasound or radiograph at intervals determined by the orthopedic provider (typically every 2 to 4 weeks initially) to assess hip reduction and acetabular development",
      "Monitor for signs of avascular necrosis of the femoral head: persistent irritability, decreased movement of the affected limb, or asymmetric limb growth",
      "Educate parents that the harness should be worn continuously (23 to 24 hours per day) during the initial treatment phase unless otherwise directed by the provider",
      "Refer to pediatric orthopedics if Pavlik harness treatment fails after 3 to 4 weeks of appropriate use; alternative interventions include closed reduction under anesthesia or spica casting",
      "Provide emotional support to parents adjusting to harness use; address concerns about bathing (sponge bath only while harness is worn), feeding positions, and clothing modifications"
    ],
    nursingActions: [
      "Assess skin beneath all harness straps at every visit or shift, checking for redness, breakdown, or pressure areas; place a thin cotton onesie under the harness to protect skin",
      "Verify correct harness positioning: the chest strap should be at nipple level, the shoulder straps should be snug but allow one finger beneath, and the leg straps should maintain the prescribed flexion and abduction angles",
      "Monitor bilateral lower extremity circulation by checking capillary refill, skin color, warmth, and pedal pulses distal to the harness straps",
      "Assess for femoral nerve palsy: observe for decreased active knee extension or absent knee jerk reflex on the affected side, which may indicate excessive hip flexion",
      "Document and report any parental difficulty with harness application or signs that the harness has been removed or repositioned incorrectly",
      "Reinforce teaching about safe swaddling practices: hips should always be free to flex and abduct naturally; avoid tight wrapping with legs extended",
      "Monitor infant growth parameters including weight and length at each visit to ensure the harness is adjusted appropriately as the infant grows"
    ],
    assessmentFindings: [
      "Positive Barlow maneuver: palpable clunk as the femoral head dislocates posteriorly during hip adduction and posterior pressure",
      "Positive Ortolani maneuver: palpable clunk as the dislocated femoral head reduces into the acetabulum during hip abduction and anterior lift",
      "Asymmetric gluteal and thigh skin folds: extra or deeper folds on the affected side suggest leg length discrepancy from hip displacement",
      "Limited hip abduction on the affected side: inability to abduct the hip beyond 60 degrees compared to the unaffected side",
      "Positive Galeazzi sign: apparent shortening of the femur on the affected side when both hips and knees are flexed",
      "Telescoping or pistoning of the hip: the femoral head moves in and out of the acetabulum with axial pressure, indicating instability",
      "Trendelenburg gait in older untreated children: the pelvis drops on the unaffected side when standing on the affected leg due to weakened hip abductor muscles"
    ],
    signs: {
      left: [
        "Mild hip click (not a clunk) on examination without instability",
        "Asymmetric skin folds without other abnormal findings",
        "Slight decrease in hip abduction range of motion",
        "Mild skin redness under harness straps resolving with repositioning",
        "Parental anxiety about harness use and infant comfort",
        "Normal capillary refill and circulation in lower extremities"
      ],
      right: [
        "Positive Ortolani or Barlow clunk (hip instability confirmed)",
        "Sudden loss of active knee extension suggesting femoral nerve palsy",
        "Skin breakdown with blistering or ulceration under harness straps",
        "Signs of avascular necrosis: persistent irritability, refusal to move limb, limb shortening",
        "Harness removal by parents with hip found redislocated on examination",
        "Complete loss of hip abduction with femoral head palpable posteriorly"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol Infant)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase enzymes primarily in the central nervous system, reducing prostaglandin synthesis to decrease pain perception and lower the hypothalamic thermoregulatory set point for fever reduction",
        sideEffects: "Hepatotoxicity at supratherapeutic doses, rare allergic skin reactions, nausea at higher doses",
        contra: "Severe hepatic impairment or active liver disease; caution in glucose-6-phosphate dehydrogenase (G6PD) deficiency; avoid exceeding maximum daily dose based on weight",
        pearl: "Dose for infants is 10 to 15 mg/kg/dose every 4 to 6 hours as needed; always use weight-based dosing and the measuring device provided with the product; maximum 5 doses in 24 hours"
      },
      {
        name: "Ibuprofen (Advil Infant)",
        type: "Non-steroidal anti-inflammatory drug (NSAID)",
        action: "Non-selectively inhibits cyclooxygenase-1 and cyclooxygenase-2 enzymes, blocking prostaglandin synthesis to produce analgesic, anti-inflammatory, and antipyretic effects in both peripheral tissues and the central nervous system",
        sideEffects: "Gastrointestinal irritation, nausea, vomiting, increased bleeding risk, renal impairment with prolonged use or dehydration",
        contra: "Infants under 6 months of age; active gastrointestinal bleeding or ulceration; significant renal impairment; use with caution in dehydrated patients due to risk of acute kidney injury",
        pearl: "Not recommended for infants under 6 months; dose is 5 to 10 mg/kg/dose every 6 to 8 hours; administer with food to reduce GI upset; ensure adequate hydration before administration"
      },
      {
        name: "Vitamin D (Cholecalciferol)",
        type: "Fat-soluble vitamin supplement",
        action: "Promotes intestinal absorption of calcium and phosphorus, supports bone mineralization by maintaining adequate serum calcium and phosphorus levels, and is essential for normal skeletal development and ossification of the femoral head and acetabulum in infants",
        sideEffects: "Hypercalcemia at excessive doses (nausea, vomiting, constipation, polyuria, nephrocalcinosis), hypervitaminosis D with prolonged high-dose supplementation",
        contra: "Hypercalcemia, hyperphosphatemia, evidence of vitamin D toxicity; use caution in granulomatous diseases (sarcoidosis) where vitamin D conversion is unregulated",
        pearl: "All breastfed infants should receive 400 IU daily beginning shortly after birth; adequate vitamin D is critical for bone development and may support acetabular ossification in infants with DDH; formula-fed infants receiving less than 1 liter of formula daily also need supplementation"
      }
    ],
    pearls: [
      "The Barlow test is a provocative maneuver (tries to dislocate the hip) while the Ortolani test is a reduction maneuver (tries to relocate a dislocated hip) -- remember B for Barlow = Bad (dislocates) and O for Ortolani = OK (relocates)",
      "A soft hip click during newborn examination is common and usually benign (caused by ligament snapping), but a true clunk indicates bony movement of the femoral head and requires further evaluation",
      "The Pavlik harness must NEVER force the hips into extreme abduction -- the safe zone is approximately 50 to 70 degrees of abduction; excessive abduction compresses the medial circumflex femoral artery and risks avascular necrosis",
      "Parents should be taught to check their infant's toes for warmth, color, and movement every time they adjust the harness or change a diaper -- cold, pale, or blue toes indicate compromised circulation",
      "If the infant develops sudden loss of active knee extension while in the Pavlik harness, the practical nurse should suspect femoral nerve palsy from excessive flexion and report immediately -- the harness may need loosening or removal",
      "Skin care under the harness is critical: a thin cotton undershirt should be worn beneath the harness, and skin should be inspected daily for redness, irritation, or breakdown at every strap contact point",
      "DDH screening should be performed at every well-baby visit until the child is walking; late-detected DDH after 6 months has significantly lower treatment success rates and may require surgical intervention"
    ],
    quiz: [
      {
        question: "A practical nurse is assisting with a newborn examination. During the Ortolani maneuver, a palpable clunk is felt as the examiner abducts the infant's hip. What does this finding indicate?",
        options: [
          "The hip is stable and normally positioned",
          "The hip was dislocated and has been reduced back into the acetabulum",
          "The hip is currently located but can be dislocated",
          "The infant has a benign hip click with no clinical significance"
        ],
        correct: 1,
        rationale: "A positive Ortolani maneuver produces a palpable clunk as the dislocated femoral head slides back into the acetabulum during abduction. The Ortolani is a reduction maneuver. A positive Barlow maneuver (not Ortolani) indicates a hip that can be provoked into dislocation."
      },
      {
        question: "An infant in a Pavlik harness is being assessed by the practical nurse. Which finding should be reported to the registered nurse immediately?",
        options: [
          "The infant is irritable during diaper changes",
          "A thin cotton onesie is visible under the harness straps",
          "The infant has no active knee extension on the left side",
          "Mild skin redness under the chest strap that resolves with repositioning"
        ],
        correct: 2,
        rationale: "Absent active knee extension suggests femoral nerve palsy, a complication of excessive hip flexion in the Pavlik harness. This requires immediate reporting as the harness positioning may need adjustment or the harness may need to be temporarily removed. Mild redness that resolves with repositioning is expected."
      },
      {
        question: "A practical nurse is educating parents about Pavlik harness care. Which statement by the parent indicates a need for additional teaching?",
        options: [
          "I will check my baby's toes for warmth and color each time I change the diaper",
          "I will place the diaper under the harness straps to keep them clean",
          "I should tighten the leg straps to make sure the legs are spread as wide as possible",
          "I will put a thin cotton shirt under the harness to protect the skin"
        ],
        correct: 2,
        rationale: "The leg straps should maintain the prescribed abduction angle (50 to 70 degrees) and should never be tightened to force maximum abduction. Excessive abduction compresses the medial circumflex femoral artery and risks avascular necrosis of the femoral head. The other statements reflect correct harness care."
      }
    ]
  },

  "pca-pumps-rpn": {
    title: "Patient-Controlled Analgesia Pumps for Practical Nurses",
    cellular: {
      title: "Physiology of Pain and Patient-Controlled Analgesia",
      content: "Patient-controlled analgesia (PCA) is a method of pain management that allows patients to self-administer predetermined doses of analgesic medication, typically opioids, by pressing a button connected to a programmable infusion pump. The physiological basis of PCA therapy rests on the pharmacokinetics and pharmacodynamics of opioid medications and the neurobiology of pain transmission. When tissue damage occurs, nociceptors (specialized pain receptors in peripheral tissues) are activated by chemical mediators including bradykinin, prostaglandins, substance P, and histamine. These nociceptors generate electrical signals that travel along A-delta fibers (fast, sharp pain) and C fibers (slow, burning, aching pain) to the dorsal horn of the spinal cord. In the dorsal horn, pain signals are modulated by interneurons and transmitted via ascending pathways (primarily the spinothalamic tract) to the thalamus and cerebral cortex, where pain is perceived. The descending pain modulation system originates in the periaqueductal gray matter and rostral ventromedial medulla, releasing endogenous opioids (endorphins, enkephalins, and dynorphins) that bind to opioid receptors in the spinal cord to inhibit pain transmission. Exogenous opioid medications used in PCA therapy mimic these endogenous opioids by binding primarily to mu-opioid receptors located throughout the central nervous system and gastrointestinal tract. Mu-receptor activation in the brain and spinal cord produces analgesia by inhibiting the release of excitatory neurotransmitters (substance P, glutamate) from presynaptic pain-transmitting neurons and by hyperpolarizing postsynaptic neurons, effectively reducing pain signal transmission. However, mu-receptor activation also produces dose-dependent respiratory depression by reducing the sensitivity of brainstem respiratory centers to carbon dioxide, which represents the most dangerous adverse effect of opioid therapy. PCA pump programming includes several critical parameters. The demand dose (also called the PCA dose or bolus dose) is the amount of medication delivered each time the patient presses the button, typically 1 to 2 mg of morphine or 0.2 to 0.4 mg of hydromorphone. The lockout interval is the minimum time between delivered doses during which the pump will not administer medication regardless of button presses, typically 6 to 10 minutes, serving as a safety mechanism to prevent overdose. The continuous (basal) rate is an optional constant infusion that runs regardless of patient demand, providing baseline pain relief but increasing the risk of respiratory depression; it is generally avoided in opioid-naive patients. The one-hour or four-hour dose limit is the maximum cumulative dose the pump will deliver within a specified time period, providing an additional safety ceiling. The PCA concept rests on the principle of patient self-regulation: a patient in pain is alert enough to press the button and receive medication, but as the opioid takes effect and produces sedation, the patient becomes too drowsy to press the button again, creating a natural safety mechanism against overdose. This self-limiting feature is why ONLY the patient should press the PCA button -- family members, visitors, or staff pressing the button for a sleeping or sedated patient (known as PCA by proxy) bypasses this safety mechanism and dramatically increases the risk of fatal respiratory depression. The practical nurse must understand these principles to monitor PCA therapy safely, assess for complications, and report concerns about pain management or adverse effects to the registered nurse or physician promptly."
    },
    riskFactors: [
      "Opioid-naive patients (no prior opioid exposure increases sensitivity to respiratory depression)",
      "Advanced age (decreased hepatic and renal clearance prolongs opioid duration of action)",
      "Obstructive sleep apnea or obesity hypoventilation syndrome (baseline respiratory compromise increases apnea risk with opioids)",
      "Concurrent use of sedating medications (benzodiazepines, antihistamines, muscle relaxants compound respiratory depression risk)",
      "Renal impairment (accumulation of active metabolites, particularly morphine-6-glucuronide, prolongs and intensifies opioid effects)",
      "Hepatic impairment (decreased first-pass metabolism increases bioavailability and prolongs drug half-life)",
      "History of substance use disorder (altered pain perception, tolerance, or risk of medication diversion)"
    ],
    diagnostics: [
      "Pain assessment using validated scales: numeric rating scale (NRS 0-10) for adults, Wong-Baker FACES scale for patients with communication difficulties; assess pain at rest and with movement",
      "Sedation scale monitoring (Pasero Opioid-Induced Sedation Scale or Richmond Agitation-Sedation Scale): assess level of sedation before and after PCA doses to detect oversedation early",
      "Continuous pulse oximetry (SpO2): monitors oxygen saturation continuously; desaturation below 92% may indicate respiratory depression requiring intervention",
      "Capnography (end-tidal CO2 monitoring) when available: more sensitive than pulse oximetry for detecting hypoventilation; rising ETCO2 indicates CO2 retention before oxygen desaturation occurs",
      "Respiratory rate monitoring: count respirations for a full 60 seconds; respiratory rate below 10 breaths per minute is a critical threshold requiring immediate intervention",
      "PCA pump history review: evaluate the number of demands versus deliveries (demand-to-delivery ratio) to assess pain control adequacy and potential overuse patterns"
    ],
    management: [
      "Verify PCA pump settings with two licensed practitioners against the physician order at initiation and with each syringe or cassette change: confirm drug, concentration, demand dose, lockout interval, continuous rate (if any), and dose limit",
      "Assess pain level and sedation score at minimum every 2 hours, within 30 minutes after any dose change, and whenever the patient reports unrelieved pain",
      "Maintain naloxone (Narcan) at the bedside or readily accessible on the unit at all times during PCA therapy for emergency reversal of opioid-induced respiratory depression",
      "Implement multimodal analgesia as ordered: administer scheduled non-opioid analgesics (acetaminophen, NSAIDs) and adjuvant medications to reduce opioid requirements and improve pain control",
      "Ensure the patient understands how to use the PCA device correctly: press the button when pain begins to increase, do not wait until pain is severe, and understand that the lockout interval is a safety feature",
      "Discontinue PCA and transition to oral analgesics when the patient is tolerating oral intake and pain is well-controlled, as ordered by the physician",
      "Document PCA usage data including total doses delivered, total demands, pain scores, sedation scores, and respiratory assessments at prescribed intervals"
    ],
    nursingActions: [
      "Educate the patient preoperatively on PCA use: explain the demand button, lockout interval, and the importance of pressing the button ONLY when awake and in pain; emphasize that no one else should press the button for them",
      "Monitor respiratory rate, depth, and pattern every 1 to 2 hours; immediately report respiratory rate below 10 breaths per minute, oxygen saturation below 92%, or increasing sedation to the RN or physician",
      "Assess for common opioid side effects at each assessment: constipation (auscultate bowel sounds, ask about last bowel movement), nausea and vomiting (administer antiemetics as ordered), pruritus (may indicate histamine release), and urinary retention (assess bladder distension)",
      "Verify the PCA tubing has an anti-siphon valve and is connected directly to the patient's IV access without Y-site connections that could allow free-flow of opioid medication",
      "Never administer additional opioid medications (oral or IV) without first checking with the RN or physician and reviewing total opioid intake from the PCA pump within the past 4 hours",
      "Implement fall prevention measures: raise side rails, ensure the call bell is within reach, assist with ambulation, and educate the patient that opioids cause dizziness and impaired coordination",
      "Report any signs of PCA malfunction including pump alarms, failure to deliver doses, unexpected free-flow, or discrepancies between programmed and actual medication volume delivered"
    ],
    assessmentFindings: [
      "Adequate pain control: patient reports pain at acceptable level (commonly 4 or below on NRS), is able to participate in recovery activities (deep breathing, ambulation), and demonstrates relaxed body posture",
      "Sedation progression (early warning of respiratory depression): alert and oriented (S1), slightly drowsy but easily aroused (S2), frequently drowsy but arousable (S3), somnolent with minimal response to stimulation (S4 -- requires immediate intervention)",
      "Respiratory depression: respiratory rate below 10 breaths per minute, shallow or irregular breathing pattern, snoring or obstructive breathing sounds, oxygen saturation below 92%",
      "Opioid-induced constipation: absent or hypoactive bowel sounds, abdominal distension, no bowel movement for 48 hours or more, patient reports straining or discomfort",
      "Pruritus (opioid-induced itching): generalized itching without rash, particularly involving the face, nose, and trunk; caused by histamine release from mast cell degranulation",
      "Urinary retention: bladder distension on palpation, inability to void, small frequent voids (overflow incontinence), reported suprapubic discomfort",
      "Nausea and vomiting: opioid stimulation of the chemoreceptor trigger zone in the medulla; more common with initial doses and movement"
    ],
    signs: {
      left: [
        "Mild sedation with easy arousability (Pasero S2)",
        "Pain rated 3 to 4 on numeric scale with functional improvement",
        "Mild nausea controlled with prescribed antiemetics",
        "Pruritus without skin breakdown",
        "Mild constipation responding to bowel regimen",
        "Slight dizziness with position changes"
      ],
      right: [
        "Respiratory rate below 10 breaths per minute",
        "Oxygen saturation below 92% despite supplemental oxygen",
        "Somnolence with difficulty arousing (Pasero S3 or S4)",
        "Pinpoint pupils with unresponsiveness",
        "Snoring or obstructive breathing pattern during sleep",
        "PCA button pressed by family member for sleeping patient (PCA by proxy)"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate (PCA formulation)",
        type: "Opioid analgesic (mu-opioid receptor agonist)",
        action: "Binds to mu-opioid receptors in the brain (periaqueductal gray, thalamus, limbic system) and spinal cord (dorsal horn substantia gelatinosa), inhibiting ascending pain pathways and activating descending inhibitory pathways to produce dose-dependent analgesia, sedation, and euphoria",
        sideEffects: "Respiratory depression (most dangerous), constipation (most common with chronic use), nausea and vomiting, sedation, pruritus, urinary retention, hypotension, miosis (pinpoint pupils)",
        contra: "Severe respiratory depression or acute severe asthma without monitoring; paralytic ileus; known hypersensitivity; concurrent use of MAO inhibitors within 14 days; use with extreme caution in renal impairment (active metabolite morphine-6-glucuronide accumulates)",
        pearl: "Standard PCA demand dose is 1 to 2 mg with 6 to 10 minute lockout; morphine-6-glucuronide is an active metabolite that accumulates in renal failure and can cause prolonged respiratory depression; always have naloxone available at bedside"
      },
      {
        name: "Hydromorphone (Dilaudid PCA formulation)",
        type: "Opioid analgesic (semisynthetic mu-opioid receptor agonist)",
        action: "Binds to mu-opioid receptors with approximately 5 to 7 times the analgesic potency of morphine on a milligram-per-milligram basis; produces analgesia through the same central and spinal mechanisms as morphine but with a slightly faster onset and shorter duration of action",
        sideEffects: "Respiratory depression, sedation, nausea, vomiting, constipation, pruritus, hypotension, dizziness; less histamine release than morphine (may be preferred in patients with morphine-related pruritus or hypotension)",
        contra: "Severe respiratory depression, acute severe asthma, known hypersensitivity to hydromorphone, paralytic ileus, obstetric analgesia (may cause neonatal respiratory depression)",
        pearl: "Standard PCA demand dose is 0.2 to 0.4 mg with 6 to 10 minute lockout; preferred over morphine in renal impairment because it does not produce neurotoxic active metabolites; high-potency formulations exist -- always verify concentration to prevent dosing errors"
      },
      {
        name: "Fentanyl (PCA formulation)",
        type: "Opioid analgesic (synthetic mu-opioid receptor agonist)",
        action: "Highly lipophilic synthetic opioid that rapidly crosses the blood-brain barrier to bind mu-opioid receptors; approximately 80 to 100 times more potent than morphine; fast onset (within 1 to 2 minutes IV) and short duration of action (30 to 60 minutes) due to rapid redistribution from the brain to peripheral fat stores",
        sideEffects: "Respiratory depression (rapid onset due to high potency), chest wall rigidity (rare, associated with rapid high-dose IV administration), bradycardia, nausea, sedation, constipation, muscle rigidity",
        contra: "Severe respiratory depression, known hypersensitivity; use with extreme caution with other CNS depressants; concurrent or recent MAO inhibitor use (within 14 days); chest wall rigidity risk increases with rapid bolus of high doses",
        pearl: "Standard PCA demand dose is 10 to 25 micrograms with 6 to 10 minute lockout; preferred in patients with renal failure (no active metabolites) and hemodynamic instability (minimal histamine release); always use microgram dosing -- never confuse with milligram dosing used for other opioids"
      }
    ],
    pearls: [
      "The MOST IMPORTANT safety principle in PCA therapy: ONLY the patient should press the PCA button -- PCA by proxy (family, visitors, or staff pressing the button for a sleeping patient) bypasses the self-limiting safety mechanism and is the leading cause of PCA-related deaths",
      "The demand-to-delivery ratio on the PCA pump history provides valuable information: a high ratio (many demands but few deliveries) suggests inadequate pain control and may indicate the need for dose adjustment or reassessment",
      "Sedation precedes respiratory depression -- monitor sedation level as an early warning sign; if the patient is difficult to arouse (Pasero S3 or higher), hold PCA and notify the physician BEFORE respiratory depression develops",
      "Continuous (basal) rate infusions are generally NOT recommended for opioid-naive adult patients because they increase the risk of respiratory depression without significantly improving pain control; basal rates may be appropriate for opioid-tolerant patients",
      "Naloxone (Narcan) must be immediately available during PCA therapy; emergency dose is 0.4 mg IV, diluted and given slowly in 0.04 mg increments to reverse respiratory depression without completely reversing analgesia",
      "Constipation is the one opioid side effect to which patients do NOT develop tolerance -- always initiate a preventive bowel regimen (stool softener plus stimulant laxative) when PCA therapy begins",
      "When transitioning from PCA to oral opioids, calculate the total PCA usage over the past 24 hours and use equianalgesic conversion tables to determine the appropriate oral dose, accounting for incomplete cross-tolerance (typically reduce calculated dose by 25 to 50 percent)"
    ],
    quiz: [
      {
        question: "A practical nurse enters a patient's room and finds the patient's spouse pressing the PCA button while the patient is sleeping. What is the most appropriate immediate action?",
        options: [
          "Allow the spouse to continue because the patient needs pain relief",
          "Instruct the spouse to stop pressing the button and assess the patient's respiratory status immediately",
          "Increase the lockout interval on the PCA pump",
          "Document the finding and continue with routine care"
        ],
        correct: 1,
        rationale: "PCA by proxy (anyone other than the patient pressing the button) bypasses the self-limiting safety mechanism of PCA therapy. The patient is sleeping and may already be oversedated. The practical nurse must immediately stop the proxy administration and assess respiratory status, sedation level, and oxygen saturation, then report to the RN."
      },
      {
        question: "A patient on a morphine PCA has a respiratory rate of 8 breaths per minute and is difficult to arouse. The practical nurse should take which action FIRST?",
        options: [
          "Increase the supplemental oxygen flow rate",
          "Stop the PCA pump and stimulate the patient while calling for help",
          "Administer the next scheduled dose of stool softener",
          "Document the finding and reassess in 30 minutes"
        ],
        correct: 1,
        rationale: "A respiratory rate below 10 breaths per minute with excessive sedation indicates opioid-induced respiratory depression, a life-threatening emergency. The first action is to stop the PCA pump to prevent further opioid administration and stimulate the patient (sternal rub, call name loudly) while calling for the RN or rapid response team. Naloxone may be needed for reversal."
      },
      {
        question: "Which PCA pump parameter serves as the primary safety mechanism to prevent opioid overdose between patient-initiated doses?",
        options: [
          "The continuous basal rate",
          "The demand dose amount",
          "The lockout interval",
          "The four-hour dose limit"
        ],
        correct: 2,
        rationale: "The lockout interval is the minimum time between delivered doses during which the pump will not administer medication regardless of how many times the patient presses the button. This prevents dose stacking by ensuring adequate time for the previous dose to take effect before another dose can be delivered. The four-hour limit is a secondary safety mechanism."
      }
    ]
  },

  "peak-flow-monitoring-rpn": {
    title: "Peak Flow Monitoring and Asthma Zone Management",
    cellular: {
      title: "Physiology of Airflow and Peak Expiratory Flow Measurement",
      content: "Peak expiratory flow rate (PEFR) is a measurement of the maximum speed at which air can be forcefully expelled from the lungs after a maximal inspiration, expressed in liters per minute (L/min). The measurement reflects the caliber of the large and medium airways, the elastic recoil of the lungs, and the force generated by the expiratory muscles (primarily the internal intercostals and abdominal muscles). In a healthy individual, peak flow values depend on age, sex, height, and ethnicity, with predicted normal values available on standardized reference charts. However, the most clinically relevant value in asthma management is the patient's personal best, which is the highest peak flow reading achieved over a two-to-three-week period when asthma is well-controlled and the patient is feeling their best. The personal best serves as the baseline against which all subsequent readings are compared. The pathophysiology underlying reduced peak flow in asthma involves three mechanisms that collectively narrow the airways: bronchospasm (contraction of airway smooth muscle triggered by allergens, exercise, cold air, irritants, or viral infections), airway inflammation (edema of the bronchial mucosa, infiltration of eosinophils, mast cells, and T-lymphocytes, and increased vascular permeability from inflammatory mediators including histamine, leukotrienes, and prostaglandins), and mucus hypersecretion (goblet cell hyperplasia and increased mucus production that plugs the airway lumen). These three mechanisms reduce airway diameter and increase resistance to airflow, resulting in decreased peak flow readings, wheezing, chest tightness, cough, and dyspnea. The asthma zone system, modeled after a traffic light, uses peak flow readings as a percentage of personal best to guide daily treatment decisions. The green zone (80 to 100 percent of personal best) indicates well-controlled asthma: the patient has no symptoms, can perform normal activities, and should continue their current maintenance medications. The yellow zone (50 to 79 percent of personal best) indicates caution: the patient is experiencing symptoms such as cough, wheeze, or chest tightness, and should initiate their action plan interventions, typically adding a rescue inhaler and possibly increasing controller medications. The red zone (below 50 percent of personal best) represents a medical emergency: the patient has severe symptoms, the rescue inhaler is not providing adequate relief, and the patient should take their rescue medication immediately and seek emergency medical care. Peak flow monitoring empowers patients to detect airway narrowing before symptoms become severe, enabling early intervention that can prevent emergency department visits and hospitalizations. The practical nurse plays a vital role in teaching patients correct peak flow meter technique, helping establish the personal best value, educating about the zone system, and reinforcing adherence to the asthma action plan. Common errors in peak flow technique include inadequate inhalation before blowing, not sealing lips around the mouthpiece, coughing during the maneuver, and not standing upright, all of which can produce falsely low readings. Each measurement session should include three attempts, with the highest of the three readings recorded as the official peak flow value."
    },
    riskFactors: [
      "Personal or family history of atopic conditions (asthma, allergic rhinitis, eczema, food allergies) reflecting genetic predisposition to IgE-mediated hypersensitivity",
      "Environmental allergen exposure (dust mites, mold, pet dander, cockroach antigen, pollen) triggering airway inflammation and bronchospasm",
      "Tobacco smoke exposure (active smoking or secondhand smoke damages airway epithelium and increases airway hyperresponsiveness)",
      "Occupational exposures (chemicals, dust, fumes, gases) causing occupational asthma or worsening existing asthma",
      "Viral respiratory infections (rhinovirus, respiratory syncytial virus) that trigger airway inflammation and exacerbations",
      "Exercise, particularly in cold dry air (evaporative water loss from airway mucosa triggers mast cell mediator release and bronchospasm)",
      "Gastroesophageal reflux disease (microaspiration of gastric acid irritates airways; vagally mediated reflex bronchospasm)"
    ],
    diagnostics: [
      "Peak expiratory flow rate (PEFR) using a handheld peak flow meter: patient stands upright, takes a maximal deep breath, places lips tightly around the mouthpiece, and blows as hard and fast as possible; record the highest of three attempts",
      "Spirometry (pulmonary function testing): the gold standard for diagnosing asthma; measures FEV1 (forced expiratory volume in one second) and FVC (forced vital capacity); FEV1/FVC ratio below 0.70 indicates obstruction; reversibility (12% or greater improvement in FEV1 after bronchodilator) confirms asthma",
      "Asthma action plan review: a written document created by the provider that outlines personalized instructions for green, yellow, and red zone management based on the patient's personal best peak flow",
      "Symptom diary review: daily documentation of symptoms (cough, wheeze, chest tightness, nocturnal awakenings, rescue inhaler use) correlated with peak flow readings to identify patterns and triggers",
      "Allergy testing (skin prick test or serum specific IgE): identifies specific allergen triggers to guide environmental control measures",
      "Fractional exhaled nitric oxide (FeNO): elevated levels (above 25 ppb in adults) indicate eosinophilic airway inflammation and predict response to inhaled corticosteroids"
    ],
    management: [
      "Teach correct peak flow meter technique: stand upright, reset indicator to zero, take the deepest possible breath, seal lips around the mouthpiece, blow out as fast and hard as possible in one blast, and record the reading; repeat three times and document the highest value",
      "Establish personal best peak flow over a two-to-three-week period when asthma is well-controlled: measure twice daily (morning and evening) and record the highest reading achieved as the personal best for zone calculations",
      "Implement the green zone plan (80-100% of personal best): continue current controller medications as prescribed; no changes needed; monitor peak flow daily",
      "Implement the yellow zone plan (50-79% of personal best): administer rescue bronchodilator (2 to 4 puffs albuterol via MDI with spacer); recheck peak flow in 20 minutes; if not improved, contact the healthcare provider; may need to increase controller medication dose as directed in the action plan",
      "Implement the red zone plan (below 50% of personal best): administer rescue bronchodilator immediately (4 to 8 puffs albuterol via MDI with spacer); call 911 or proceed to emergency department; this is a medical emergency",
      "Encourage daily peak flow monitoring at the same time each day, preferably in the morning before taking medications, to establish consistent trend data",
      "Review and update the asthma action plan with the healthcare provider at least annually or whenever asthma control changes"
    ],
    nursingActions: [
      "Demonstrate peak flow meter technique to the patient and observe return demonstration to verify correct use; correct any errors in technique before relying on readings for clinical decisions",
      "Record peak flow readings and compare to the patient's personal best to determine the current zone status; report any readings in the yellow or red zone to the RN or provider",
      "Assess inhaler technique for both rescue and controller medications: ensure proper use of metered-dose inhaler (MDI) with spacer or dry powder inhaler (DPI); incorrect technique reduces drug delivery by up to 90%",
      "Monitor for signs of an acute asthma exacerbation: increased respiratory rate, accessory muscle use (sternocleidomastoid, intercostal retractions), prolonged expiratory phase, audible wheezing, inability to speak in full sentences, and decreasing peak flow readings",
      "Educate the patient on trigger avoidance strategies specific to their identified triggers: allergen-proof bedding covers, HEPA air filters, avoiding outdoor activity on high pollen days, smoking cessation, and exercise pre-treatment with albuterol",
      "Reinforce the importance of daily controller medication adherence even when feeling well: inhaled corticosteroids reduce airway inflammation and prevent exacerbations but provide no immediate symptom relief; patients often discontinue them when asymptomatic",
      "Monitor for signs of a silent chest in severe exacerbation: absence of wheezing in a patient with severe respiratory distress indicates insufficient airflow to generate wheezing and represents a life-threatening emergency requiring immediate intervention"
    ],
    assessmentFindings: [
      "Green zone (80-100% personal best): peak flow within normal range, no cough or wheeze, able to perform usual activities, sleeping through the night without symptoms, rescue inhaler used less than twice per week",
      "Yellow zone (50-79% personal best): cough, mild to moderate wheezing, chest tightness, nocturnal awakening from symptoms, reduced exercise tolerance, rescue inhaler use increasing",
      "Red zone (below 50% personal best): severe dyspnea at rest, unable to speak in full sentences, accessory muscle use, diaphoresis, cyanosis, rescue inhaler providing no relief or relief lasting less than 4 hours",
      "Proper peak flow technique indicators: patient stands upright, takes maximal inspiration, seals lips around mouthpiece, produces a sharp forceful exhalation, and readings are reproducible (within 20 L/min of each other across three attempts)",
      "Poor peak flow technique indicators: coughing during the blow, spitting into the mouthpiece, air leak around the mouthpiece, not standing upright, or inconsistent readings with greater than 40 L/min variation between attempts",
      "Morning dip pattern: peak flow readings consistently lower in the early morning than evening, suggesting nocturnal airway narrowing and poorly controlled asthma"
    ],
    signs: {
      left: [
        "Peak flow in green zone (80-100% personal best)",
        "Occasional dry cough without wheeze",
        "Mild chest tightness with exercise that resolves quickly with rest",
        "Using rescue inhaler once or twice per week",
        "Able to sleep through the night without coughing",
        "Peak flow variability less than 20% between morning and evening"
      ],
      right: [
        "Peak flow below 50% of personal best (red zone)",
        "Severe dyspnea with inability to speak in full sentences",
        "Silent chest (no audible breath sounds despite respiratory effort)",
        "Cyanosis (circumoral or peripheral)",
        "Altered level of consciousness or confusion (indicates hypoxia and CO2 retention)",
        "Rescue inhaler providing no relief with repeated dosing"
      ]
    },
    medications: [
      {
        name: "Albuterol (Ventolin/Proventil)",
        type: "Short-acting beta-2 adrenergic agonist (SABA) -- rescue bronchodilator",
        action: "Selectively stimulates beta-2 adrenergic receptors on bronchial smooth muscle cells, activating adenylyl cyclase and increasing intracellular cyclic AMP (cAMP), which causes smooth muscle relaxation and rapid bronchodilation within 5 to 15 minutes; also inhibits mast cell mediator release and increases mucociliary clearance",
        sideEffects: "Tachycardia, palpitations, skeletal muscle tremor (especially hands), nervousness, headache, hypokalemia (beta-2 stimulation drives potassium into cells)",
        contra: "Known hypersensitivity to albuterol; use caution in patients with cardiovascular disease (tachyarrhythmias), hyperthyroidism, diabetes (may cause transient hyperglycemia), and hypokalemia",
        pearl: "Using a rescue inhaler more than 2 days per week (excluding exercise pre-treatment) indicates uncontrolled asthma requiring step-up of controller therapy; always use with a spacer for MDI formulation to improve drug delivery to the lungs from approximately 10% to 20% of the dose"
      },
      {
        name: "Fluticasone (Flovent)",
        type: "Inhaled corticosteroid (ICS) -- controller medication",
        action: "Suppresses airway inflammation by binding to intracellular glucocorticoid receptors, inhibiting transcription of pro-inflammatory genes (cytokines, chemokines, adhesion molecules), reducing eosinophil infiltration, decreasing mucus production, and restoring beta-2 receptor sensitivity on airway smooth muscle; takes 1 to 4 weeks for full anti-inflammatory effect",
        sideEffects: "Oral candidiasis (thrush), dysphonia (hoarseness), pharyngeal irritation, cough; systemic effects rare at standard doses but possible with high doses (adrenal suppression, decreased bone density, growth suppression in children)",
        contra: "Not for acute bronchospasm relief (not a rescue medication); active untreated oral or respiratory fungal infection; known hypersensitivity",
        pearl: "MUST rinse mouth with water and spit after EVERY use to prevent oral candidiasis and systemic absorption; use a spacer with MDI formulation; patients must understand this is a daily preventive medication and will NOT provide immediate relief during an acute attack"
      },
      {
        name: "Montelukast (Singulair)",
        type: "Leukotriene receptor antagonist (LTRA) -- controller medication",
        action: "Blocks cysteinyl leukotriene receptor type 1 (CysLT1) on airway smooth muscle, eosinophils, and other inflammatory cells, preventing the bronchoconstrictive, pro-inflammatory, and mucus-secretory effects of leukotrienes C4, D4, and E4 that are released from mast cells and eosinophils during the inflammatory cascade",
        sideEffects: "Headache, abdominal pain, pharyngitis; neuropsychiatric effects have been reported including behavioral changes, agitation, depression, suicidal ideation (FDA boxed warning); sleep disturbances",
        contra: "Known hypersensitivity to montelukast; not indicated for acute bronchospasm; FDA boxed warning requires discussion of neuropsychiatric risks with patient or parent before prescribing",
        pearl: "Taken once daily in the evening (leukotrienes peak at night); particularly effective for exercise-induced bronchospasm and aspirin-exacerbated respiratory disease; monitor for behavioral or mood changes and report immediately; available as chewable tablet for children"
      }
    ],
    pearls: [
      "The personal best peak flow is MORE clinically useful than predicted normal values based on age, sex, and height -- always compare current readings to the patient's own personal best for accurate zone assessment",
      "The traffic light zone system makes asthma self-management accessible: Green = Go (doing well, continue current plan), Yellow = Caution (take action now per the asthma action plan), Red = Stop and get emergency help",
      "Morning peak flow readings are typically the lowest of the day due to circadian variation in airway caliber and cortisol levels -- if morning readings consistently differ from evening readings by more than 20%, asthma is poorly controlled",
      "A silent chest (absence of wheezing) in a patient with severe respiratory distress is MORE dangerous than audible wheezing -- it means airflow is so severely reduced that there is insufficient air movement to generate wheezing sounds",
      "Correct peak flow meter technique is essential for accurate readings: the most common errors are not taking a maximal breath before blowing, air leaking around the mouthpiece, and blowing slowly rather than in one sharp forceful blast",
      "Rescue inhaler use is a key indicator of asthma control: using albuterol more than 2 days per week or more than 2 nights per month indicates inadequately controlled asthma requiring step-up of controller therapy",
      "The rinse-and-spit technique after using inhaled corticosteroids is not optional -- it prevents oral candidiasis (thrush) and reduces systemic absorption; patients who skip this step are at significantly higher risk for oral fungal infections"
    ],
    quiz: [
      {
        question: "A patient's personal best peak flow is 400 L/min. Today's reading is 180 L/min. According to the asthma zone system, this patient is in which zone?",
        options: [
          "Green zone -- continue current medications",
          "Yellow zone -- increase medications per action plan",
          "Red zone -- seek emergency medical care",
          "Normal variation -- no action needed"
        ],
        correct: 2,
        rationale: "180 L/min is 45% of the personal best of 400 L/min (180/400 = 0.45). A reading below 50% of personal best places the patient in the red zone, which indicates a medical emergency. The patient should use their rescue inhaler immediately and seek emergency medical care."
      },
      {
        question: "A practical nurse is teaching a patient how to use a peak flow meter. Which instruction is correct?",
        options: [
          "Blow slowly and steadily into the mouthpiece for as long as possible",
          "Perform two attempts and record the average of both readings",
          "Stand upright, take a maximal deep breath, and blow out as hard and fast as possible in one sharp blast",
          "Sit in a chair and breathe normally into the mouthpiece three times"
        ],
        correct: 2,
        rationale: "Correct peak flow technique requires standing upright, taking the deepest possible breath, sealing lips around the mouthpiece, and blowing out as hard and fast as possible in one sharp blast. Three attempts should be performed, and the highest reading is recorded. Slow, steady blowing or normal breathing will produce inaccurate results."
      },
      {
        question: "A patient using an inhaled corticosteroid (fluticasone) asks why they need to rinse their mouth after each use. Which response by the practical nurse is most accurate?",
        options: [
          "Rinsing removes the unpleasant taste of the medication",
          "Rinsing prevents oral fungal infection (thrush) caused by the steroid depositing in the mouth and throat",
          "Rinsing increases the effectiveness of the medication in the lungs",
          "Rinsing is recommended only if the patient develops symptoms"
        ],
        correct: 1,
        rationale: "Inhaled corticosteroids deposited in the oropharynx suppress local immune defenses and promote overgrowth of Candida albicans, causing oral candidiasis (thrush). Rinsing with water and spitting after each use removes residual medication from the mouth and throat, significantly reducing the risk of thrush. This should be done after every use, not just when symptoms develop."
      }
    ]
  },

  "pediatric-pain-rpn": {
    title: "Pediatric Pain Assessment and Management for Practical Nurses",
    cellular: {
      title: "Neurophysiology of Pain in the Pediatric Population",
      content: "Pain in the pediatric population involves the same basic neurophysiological mechanisms as adult pain but is complicated by developmental differences in the nervous system, cognitive ability, language, and behavioral expression across age groups. Neonates and infants have fully functional nociceptive pathways from approximately 24 weeks of gestation, meaning they can perceive pain from birth. In fact, neonates may experience enhanced pain sensitivity compared to adults because their descending inhibitory pain pathways (which modulate and dampen pain signals) are not fully myelinated until several months after birth, while their excitatory pain pathways are already functional. This maturational imbalance means that neonates transmit pain signals effectively but cannot modulate or suppress them as efficiently as older children or adults, potentially resulting in amplified pain perception. The nociceptive process in children follows the same four-step pathway as in adults: transduction (conversion of tissue-damaging stimuli into electrical signals by nociceptors), transmission (propagation of pain signals along A-delta and C fibers to the dorsal horn of the spinal cord), perception (conscious awareness of pain in the cerebral cortex and limbic system), and modulation (enhancement or inhibition of pain signals by descending pathways and endogenous opioids). However, the behavioral expression of pain varies dramatically across developmental stages, requiring age-appropriate assessment tools. The FLACC scale (Face, Legs, Activity, Cry, Consolability) is a behavioral pain assessment tool validated for infants and pre-verbal children from 2 months to 7 years of age. Each of the five categories is scored from 0 to 2, yielding a total score of 0 to 10. A score of 0 indicates no pain, 1 to 3 mild discomfort, 4 to 6 moderate pain, and 7 to 10 severe pain. The Wong-Baker FACES Pain Rating Scale uses six cartoon faces ranging from a smiling face (0, no hurt) to a crying face (10, hurts worst), designed for children approximately 3 years and older who can understand the concept of comparing their pain to a facial expression. The numeric rating scale (NRS, 0 to 10) can be used for children approximately 8 years and older who understand numerical concepts. The Neonatal Infant Pain Scale (NIPS) is used specifically for neonates and infants under 1 year, scoring facial expression, cry, breathing patterns, arm and leg movement, and state of arousal. Pharmacological management of pediatric pain is guided by the World Health Organization (WHO) analgesic ladder adapted for children, which begins with non-opioid analgesics (acetaminophen, ibuprofen) for mild pain, progresses to weak opioids or low-dose strong opioids for moderate pain, and uses strong opioids (morphine) for severe pain. A critical principle in pediatric pharmacology is weight-based dosing: ALL medication doses for children must be calculated based on the child's actual body weight in kilograms, and the calculated dose must not exceed the maximum recommended adult dose. The practical nurse must also employ non-pharmacological pain interventions appropriate to the child's developmental stage, including distraction (bubbles, videos, music for toddlers and preschoolers), guided imagery and deep breathing for school-age children, comfort positioning (facilitated tucking in neonates, parent holding), sucrose pacifier for procedural pain in neonates, and therapeutic touch. Untreated or undertreated pain in children has been shown to cause long-term negative consequences including pain sensitization (hyperalgesia), altered stress response systems, impaired immune function, behavioral changes, and increased pain sensitivity later in life, making adequate pain assessment and management an ethical and clinical imperative in pediatric nursing."
    },
    riskFactors: [
      "Pre-verbal age or developmental delay (inability to self-report pain leads to underrecognition and undertreatment)",
      "Neonatal period (immature descending pain inhibitory pathways result in amplified pain perception despite full nociceptive function)",
      "Chronic or recurrent painful conditions (sickle cell disease, juvenile arthritis, cancer) leading to pain sensitization and tolerance",
      "History of previous painful procedures without adequate analgesia (creates anxiety, anticipatory pain, and needle phobia)",
      "Cognitive or communication impairment (autism spectrum disorder, intellectual disability) making standard pain scales unreliable",
      "Cultural or family beliefs that children do not experience pain the same as adults, or that pain builds character, leading to underreporting",
      "Healthcare provider bias assuming children exaggerate pain or that opioids are too dangerous for pediatric use, resulting in inadequate prescribing"
    ],
    diagnostics: [
      "FLACC scale (Face, Legs, Activity, Cry, Consolability): behavioral pain assessment for infants and pre-verbal children ages 2 months to 7 years; score 0-10; observe the child before, during, and after painful stimuli",
      "Wong-Baker FACES Pain Rating Scale: self-report tool for children approximately 3 years and older; six faces from happy (0) to crying (10); let the child point to the face that matches their pain",
      "Numeric Rating Scale (NRS 0-10): self-report for children approximately 8 years and older who understand number concepts; ask the child to rate their pain from 0 (no pain) to 10 (worst possible pain)",
      "Neonatal Infant Pain Scale (NIPS): behavioral assessment specifically for neonates and infants under 1 year; scores facial expression, cry, breathing, arm movement, leg movement, and arousal state",
      "CRIES scale (Crying, Requires oxygen, Increased vital signs, Expression, Sleeplessness): neonatal postoperative pain assessment tool; score 0-10",
      "Vital sign trending: tachycardia, tachypnea, and hypertension may accompany acute pain but vital sign changes alone are NOT reliable indicators of pain intensity; they must be correlated with behavioral and self-report measures"
    ],
    management: [
      "Use the WHO analgesic ladder adapted for children: mild pain (1-3) -- acetaminophen or ibuprofen; moderate pain (4-6) -- consider adding low-dose opioid as ordered; severe pain (7-10) -- opioid analgesic with continued non-opioid and non-pharmacological measures",
      "ALWAYS calculate pediatric medication doses using weight-based dosing (mg/kg); verify that the calculated dose does not exceed the maximum recommended adult dose; have a second nurse independently verify the calculation",
      "Administer analgesics proactively before painful procedures (pre-emptive analgesia) rather than waiting until the child is already in pain; analgesics are more effective at preventing pain than treating established pain",
      "Implement age-appropriate non-pharmacological interventions: facilitated tucking and sucrose pacifier for neonates; distraction with bubbles, music, or videos for toddlers; guided imagery, deep breathing, and counting for school-age children; music therapy and relaxation techniques for adolescents",
      "Reassess pain within 30 minutes after oral analgesic administration and within 15 minutes after IV analgesic administration to evaluate effectiveness",
      "Apply topical anesthetic cream (EMLA or LMX 4%) to intact skin 30 to 60 minutes before anticipated needle procedures (venipuncture, IV insertion, lumbar puncture) to reduce procedural pain",
      "Involve parents and caregivers in comfort measures: parental presence, holding, skin-to-skin contact, breastfeeding during minor procedures, and coaching the child through coping strategies"
    ],
    nursingActions: [
      "Select the age-appropriate pain assessment tool for each patient: NIPS or CRIES for neonates, FLACC for infants and toddlers, Wong-Baker FACES for children 3 years and older, NRS for children 8 years and older",
      "Assess pain at regular intervals: at minimum every 4 hours, with each new report of pain, before and after analgesic administration, before and after procedures, and at each shift change",
      "Document pain score using the validated tool, location of pain, quality of pain (if child can describe), interventions performed, and response to interventions",
      "Observe behavioral cues in pre-verbal or non-verbal children: facial grimacing, guarding, splinting, pulling at affected body part, changes in feeding or sleeping patterns, inconsolable crying, and withdrawal from interaction",
      "Monitor for opioid adverse effects in children: respiratory depression (most critical -- monitor respiratory rate for age-appropriate normals), excessive sedation, nausea and vomiting, pruritus, constipation, and urinary retention",
      "Advocate for adequate pain management: if a child's pain score indicates uncontrolled pain despite current interventions, report to the RN or physician and request reassessment of the pain management plan",
      "Provide education to parents about pain assessment and medication administration at home: correct dosing with the provided measuring device (never use household spoons), timing of doses, when to contact the provider, and signs of adverse reactions"
    ],
    assessmentFindings: [
      "Neonatal pain indicators (NIPS): brow bulge, eye squeeze, nasolabial furrow, open mouth (cry face), flexion and extension of arms and legs, changes in breathing pattern (irregular, held breath), high-pitched or vigorous crying",
      "Infant and toddler pain behaviors (FLACC): facial grimacing or furrowed brow, kicking or drawing legs up, squirming or rigidity, crying (high-pitched, inconsolable), and difficulty being comforted despite holding or rocking",
      "Preschool pain behaviors: may verbalize pain in simple terms (boo-boo, owie), regression to earlier behaviors (thumb-sucking, clinging), aggression or withdrawal, refusal to eat or play, guarding the painful area",
      "School-age pain expression: able to describe pain location and quality, may use coping strategies (deep breathing, distraction), may deny pain to avoid injections or procedures, may have detailed fear of the unknown",
      "Adolescent pain expression: similar to adult self-report but may minimize pain around peers, may catastrophize pain when alone, mood changes (irritability, withdrawal), sleep disturbances, decreased appetite",
      "Physiological pain responses (supportive data only): tachycardia, tachypnea, elevated blood pressure, diaphoresis, pallor; these signs habituate over time and are absent in chronic pain, making them unreliable as sole indicators"
    ],
    signs: {
      left: [
        "Mild pain score (1-3 on age-appropriate scale)",
        "Child playing or interacting despite discomfort",
        "Pain relieved within expected time frame after analgesic",
        "Child using age-appropriate coping strategies effectively",
        "Normal vital signs for age with mild behavioral changes",
        "Adequate oral intake and normal sleep pattern"
      ],
      right: [
        "Severe pain score (7-10 on age-appropriate scale) unresponsive to prescribed analgesics",
        "Inconsolable crying or screaming in infant or toddler despite comfort measures",
        "Respiratory depression from opioid administration (respiratory rate below age-appropriate normal)",
        "Splinting or refusal to move a body part suggesting fracture or compartment syndrome",
        "Signs of pain crisis in sickle cell disease (severe limb or chest pain with tachycardia and hypoxia)",
        "Behavioral regression with refusal to eat, drink, or interact"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol Pediatric)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase enzymes primarily in the central nervous system, reducing prostaglandin E2 synthesis in the hypothalamus to lower the thermoregulatory set point (antipyretic effect) and decreasing pain signal transmission at the spinal cord level (analgesic effect); minimal peripheral anti-inflammatory activity",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (the most critical adverse effect), nausea, rare allergic skin reactions; chronic use may cause analgesic nephropathy",
        contra: "Severe hepatic impairment or active liver disease; known hypersensitivity; caution in patients with G6PD deficiency; caution with concurrent use of other acetaminophen-containing products (many combination cold and flu medications contain acetaminophen)",
        pearl: "Pediatric dose: 10 to 15 mg/kg/dose every 4 to 6 hours as needed, maximum 75 mg/kg/day or 4 g/day (whichever is less); ALWAYS use weight-based dosing and the calibrated measuring device provided; never use household teaspoons as they are inaccurate and can lead to overdose"
      },
      {
        name: "Ibuprofen (Advil/Motrin Pediatric)",
        type: "Non-steroidal anti-inflammatory drug (NSAID)",
        action: "Non-selectively inhibits cyclooxygenase-1 and cyclooxygenase-2 enzymes in peripheral tissues and the central nervous system, blocking prostaglandin synthesis to produce analgesic, anti-inflammatory, and antipyretic effects; the anti-inflammatory action makes it superior to acetaminophen for pain with an inflammatory component (musculoskeletal injuries, ear infections, dental pain)",
        sideEffects: "Gastrointestinal irritation, nausea, vomiting, abdominal pain, increased bleeding risk (reversible platelet inhibition), renal impairment with dehydration or prolonged use, rare allergic reactions including bronchospasm in aspirin-sensitive patients",
        contra: "Infants under 6 months of age; active GI bleeding or ulceration; significant renal impairment; dehydration (risk of acute kidney injury); perioperative use in patients undergoing cardiac surgery; aspirin-sensitive asthma",
        pearl: "Pediatric dose: 5 to 10 mg/kg/dose every 6 to 8 hours as needed; can be alternated with acetaminophen for enhanced pain control (give acetaminophen, then 3 hours later give ibuprofen, then 3 hours later acetaminophen); always administer with food and ensure adequate hydration"
      },
      {
        name: "Morphine Sulfate (Pediatric formulation)",
        type: "Opioid analgesic (mu-opioid receptor agonist)",
        action: "Binds to mu-opioid receptors in the brain and spinal cord, inhibiting ascending pain transmission and activating descending pain inhibitory pathways; produces dose-dependent analgesia, sedation, anxiolysis, and euphoria; also reduces the emotional and affective component of pain perception through limbic system effects",
        sideEffects: "Respiratory depression (most dangerous, dose-limiting adverse effect), sedation, constipation, nausea, vomiting, pruritus, urinary retention, hypotension; neonates are particularly susceptible to respiratory depression due to immature hepatic metabolism and blood-brain barrier permeability",
        contra: "Severe respiratory depression, acute or severe bronchial asthma without monitoring equipment, paralytic ileus, known hypersensitivity; extreme caution in neonates (reduced clearance, prolonged half-life); concurrent use with MAO inhibitors",
        pearl: "Pediatric IV dose: 0.05 to 0.1 mg/kg/dose every 2 to 4 hours as needed for severe pain; ALWAYS calculate weight-based dose and verify with a second nurse; monitor respiratory rate closely -- age-appropriate respiratory rate normals must be known; keep naloxone (0.01 mg/kg) readily available for reversal"
      }
    ],
    pearls: [
      "The most reliable indicator of pain intensity is the child's self-report when developmentally possible -- ALWAYS use self-report tools (Wong-Baker FACES, NRS) when the child is old enough to use them, even if behavioral assessment tools are also available",
      "Neonates DO feel pain -- their nociceptive pathways are fully functional by 24 weeks gestation; the myth that neonates do not experience pain has been definitively disproven and has no place in clinical practice",
      "The FLACC scale mnemonic: F = Face (grimace), L = Legs (kicking, drawn up), A = Activity (squirming, rigid), C = Cry (whimper to screaming), C = Consolability (reassured to inconsolable) -- each scored 0 to 2 for a total of 0 to 10",
      "Weight-based dosing is NON-NEGOTIABLE in pediatric pharmacology -- NEVER estimate a child's weight; weigh the child in kilograms at each visit; verify that the calculated dose does not exceed the adult maximum dose",
      "Non-pharmacological interventions are NOT substitutes for analgesics in moderate to severe pain but are powerful ADJUNCTS: combining distraction, positioning, and parental comfort with appropriate medications produces better pain relief than either approach alone",
      "Children may deny pain to avoid injections -- when a child says they are not in pain but exhibits guarding, facial grimacing, or vital sign changes, further assessment is needed; offering oral medication may yield a more honest self-report",
      "The concept of pre-emptive analgesia is critical in pediatrics: applying topical anesthetic cream 30 to 60 minutes before needle procedures and administering oral analgesics before anticipated painful events prevents pain from developing rather than treating it after it is established"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 2-year-old child after a surgical procedure. Which pain assessment tool is most appropriate for this patient?",
        options: [
          "Numeric Rating Scale (0-10)",
          "Wong-Baker FACES Pain Rating Scale",
          "FLACC scale",
          "Visual Analog Scale"
        ],
        correct: 2,
        rationale: "The FLACC scale (Face, Legs, Activity, Cry, Consolability) is the appropriate behavioral pain assessment tool for pre-verbal and early verbal children from 2 months to 7 years of age. A 2-year-old cannot reliably self-report using numeric or faces scales. The Wong-Baker FACES scale is designed for children approximately 3 years and older."
      },
      {
        question: "A 5-year-old child weighing 20 kg is prescribed acetaminophen for mild postoperative pain. The dose is 15 mg/kg. What is the correct dose for this child?",
        options: [
          "150 mg",
          "200 mg",
          "300 mg",
          "500 mg"
        ],
        correct: 2,
        rationale: "Weight-based dosing: 15 mg/kg multiplied by 20 kg = 300 mg. This falls within the recommended range for acetaminophen (10 to 15 mg/kg per dose). The practical nurse must always perform weight-based calculations and verify with a second nurse before administering medications to pediatric patients."
      },
      {
        question: "A practical nurse observes a 4-month-old infant with a FLACC score of 8 after a painful procedure. The nurse notes the infant has clenched fists, rigid body posture, and high-pitched inconsolable crying. Which action is most appropriate?",
        options: [
          "Document the findings and reassess in 2 hours",
          "Administer the prescribed analgesic and implement comfort measures such as facilitated tucking and parental holding",
          "Apply a cold pack to the procedure site",
          "Offer a bottle of formula to distract the infant"
        ],
        correct: 1,
        rationale: "A FLACC score of 8 indicates severe pain requiring both pharmacological and non-pharmacological intervention. The most appropriate action is to administer the prescribed analgesic immediately and implement comfort measures such as facilitated tucking (holding the infant in a flexed, contained position) and encouraging parental holding. Waiting 2 hours would leave the infant in severe unmanaged pain."
      }
    ]
  },

  "pediatrics-rpn": {
    title: "Pediatric Nursing Fundamentals for Practical Nurses",
    cellular: {
      title: "Growth, Development, and Physiological Principles in Pediatric Nursing",
      content: "Pediatric nursing encompasses the care of patients from birth through adolescence (typically 0 to 18 years of age), requiring an understanding of the physiological, developmental, and psychosocial differences that distinguish children from adults. Children are not small adults; their organ systems are developmentally immature, their metabolic rates are proportionally higher, their fluid and electrolyte balance is more precarious, and their immune systems are developing, making them uniquely vulnerable to illness, dehydration, and infection. Growth refers to quantitative physical changes measured through anthropometric data: weight, length or height, and head circumference. Normal growth parameters follow predictable patterns plotted on standardized growth charts (WHO growth charts for children under 2 years, CDC growth charts for children 2 to 20 years). Expected growth milestones include: birth weight doubles by 4 to 6 months and triples by 12 months; birth length increases by 50 percent by 12 months; the posterior fontanelle closes by 2 to 3 months and the anterior fontanelle closes by 12 to 18 months; head circumference equals chest circumference at approximately 1 to 2 years of age. Development refers to qualitative functional changes in skills and abilities that follow a predictable sequence but vary in timing across individual children. Development proceeds in a cephalocaudal direction (head to toe: head control before sitting before walking) and proximodistal direction (center to periphery: trunk control before fine motor hand skills). Major developmental theorists relevant to pediatric nursing include Erik Erikson (psychosocial development: trust vs. mistrust in infancy, autonomy vs. shame and doubt in toddlerhood, initiative vs. guilt in preschool, industry vs. inferiority in school age, identity vs. role confusion in adolescence) and Jean Piaget (cognitive development: sensorimotor stage 0-2 years, preoperational stage 2-7 years, concrete operational stage 7-11 years, formal operational stage 11+ years). Vital sign ranges in children are age-dependent and differ significantly from adult values. Neonatal heart rate ranges from 100 to 160 beats per minute, decreasing to 60 to 100 beats per minute by adolescence. Respiratory rate ranges from 30 to 60 breaths per minute in neonates, decreasing to 12 to 20 breaths per minute in adolescents. Blood pressure is lower in younger children and increases with age; hypotension is a LATE sign of shock in children because pediatric patients can maintain blood pressure through compensatory tachycardia and peripheral vasoconstriction until approximately 25 to 30 percent of blood volume is lost, at which point cardiovascular decompensation occurs rapidly. Temperature can be measured rectally (most accurate in infants and young children), axillary (less accurate but non-invasive), temporally, or orally (in children old enough to keep the thermometer under the tongue). Fluid and electrolyte balance is more tenuous in children due to their proportionally higher body water content (75 to 80 percent in neonates compared to 60 percent in adults), higher metabolic rate requiring more fluid per kilogram, greater insensible water losses through the skin (larger body surface area to weight ratio), and immature renal concentrating ability in infants. Dehydration is classified as mild (3 to 5 percent body weight loss), moderate (6 to 9 percent), or severe (10 percent or greater) and is assessed by clinical signs including mucous membrane moisture, skin turgor, anterior fontanelle status (sunken in dehydration), urine output, capillary refill time, and mental status. Family-centered care is the foundational philosophy of pediatric nursing, recognizing that the family is the constant in the child's life and that parents or guardians are essential partners in the child's care. This approach involves including families in decision-making, providing transparent communication about the child's condition and treatment plan, encouraging rooming-in and parental participation in care activities, and respecting cultural and family values. The practical nurse's role in pediatric care includes performing age-appropriate assessments, administering weight-based medications safely, monitoring growth and development parameters, providing anticipatory guidance to parents, implementing safety measures appropriate to the child's developmental level, and reporting changes in the child's condition promptly to the registered nurse."
    },
    riskFactors: [
      "Prematurity (immature organ systems, increased susceptibility to infection, respiratory distress, temperature instability, and feeding difficulties)",
      "Low birth weight or failure to thrive (inadequate caloric intake or absorption, social determinants of health, metabolic disorders)",
      "Incomplete immunization status (increased risk of vaccine-preventable diseases including measles, pertussis, and invasive pneumococcal disease)",
      "Exposure to secondhand tobacco smoke (increased risk of respiratory infections, asthma, otitis media, and sudden infant death syndrome)",
      "Socioeconomic factors including food insecurity and inadequate access to healthcare (delayed screening, missed immunizations, late presentation of illness)",
      "Congenital anomalies or genetic conditions (cardiac defects, chromosomal abnormalities requiring ongoing specialized care)",
      "Developmental delay or disability (communication barriers affecting pain assessment, increased fall risk, medication dosing challenges)"
    ],
    diagnostics: [
      "Growth chart plotting: measure weight, length/height, and head circumference at every visit; plot on age-appropriate WHO or CDC growth charts; investigate any crossing of two or more percentile lines or measurements below the 3rd or above the 97th percentile",
      "Developmental screening tools: Ages and Stages Questionnaire (ASQ) at 9, 18, 24, and 30 months; Denver Developmental Screening Test II (DDST-II) assesses gross motor, fine motor, language, and personal-social domains",
      "Vital signs assessment with age-appropriate normals: heart rate (neonate 100-160, infant 80-140, toddler 80-130, preschool 80-120, school age 70-110, adolescent 60-100); respiratory rate (neonate 30-60, infant 25-50, toddler 20-30, school age 18-25, adolescent 12-20)",
      "Dehydration assessment: skin turgor (tenting indicates moderate to severe dehydration), mucous membrane moisture, anterior fontanelle status (sunken in dehydration), capillary refill time (greater than 2 seconds is abnormal), urine output (less than 1 mL/kg/hour in infants is oliguria)",
      "Immunization status review: compare current immunizations against the recommended schedule; identify missed or delayed vaccines; assess contraindications before administration",
      "Basic laboratory values with pediatric reference ranges: CBC with age-adjusted WBC and hemoglobin normals (newborn hemoglobin 14-24 g/dL declining to nadir of 9-11 g/dL at 2-3 months); electrolytes; urinalysis for hydration status"
    ],
    management: [
      "Administer all medications using strict weight-based dosing calculated in mg/kg; verify the dose does not exceed the maximum adult dose; have a second nurse independently verify calculations before administration",
      "Calculate maintenance fluid requirements using the Holliday-Segar method: 100 mL/kg/day for the first 10 kg, 50 mL/kg/day for the next 10 kg, 20 mL/kg/day for each additional kg over 20 kg; convert to hourly rate for IV administration (4-2-1 rule)",
      "Implement age-appropriate safety measures: crib side rails up at all times for infants, choking hazard assessment for toddlers, playground and bicycle safety education for school-age children, risk-taking behavior counseling for adolescents",
      "Provide oral rehydration therapy (ORT) as first-line treatment for mild to moderate dehydration: offer small, frequent volumes of oral rehydration solution (ORS) containing appropriate glucose and electrolyte concentrations; avoid fruit juices, sports drinks, and plain water which have inappropriate osmolarity",
      "Administer immunizations according to the recommended schedule, following proper storage, reconstitution, route, and site guidelines; monitor for adverse reactions for the recommended observation period",
      "Implement family-centered care principles: include parents in plan of care, encourage rooming-in, teach parents medication administration and symptom monitoring, provide discharge education in understandable language",
      "Provide anticipatory guidance to parents at each well-child visit: nutrition recommendations, sleep safety (back to sleep for infants), car seat safety, poison prevention, injury prevention specific to the child's developmental stage"
    ],
    nursingActions: [
      "Weigh the child in kilograms at each visit using the same scale and minimal clothing; this weight is the basis for ALL medication dosing and fluid calculations -- an inaccurate weight leads to medication errors",
      "Assess vital signs using age-appropriate technique and equipment: use appropriately sized blood pressure cuff (bladder width should cover approximately 40% of the arm circumference), count respiratory rate for a full 60 seconds in infants, and measure temperature by the route indicated for the age group",
      "Monitor fluid balance closely: record all intake (oral, IV, formula) and output (urine, stool, emesis) accurately; weigh diapers (1 gram = 1 mL urine); assess for signs of dehydration or fluid overload at each assessment",
      "Perform age-appropriate assessment modifications: assess the anterior fontanelle in infants (bulging suggests increased intracranial pressure, sunken suggests dehydration), observe respiratory pattern for abdominal breathing in infants (normal), and assess capillary refill centrally (sternum or forehead) rather than peripherally for accuracy",
      "Apply atraumatic care principles to minimize distress: use therapeutic play to prepare children for procedures, allow choices when possible, perform painful procedures in a treatment room (not the bed, which should remain a safe space), and offer comfort items",
      "Administer oral medications to infants using an oral syringe directed toward the inner cheek (never the back of the throat to prevent aspiration); for young children, mix medications with a small amount of palatable food only when pharmacologically appropriate",
      "Report and document any signs of child maltreatment: unexplained bruises in non-mobile infants, patterned burns, inconsistent history for injuries, delayed seeking of care, or inappropriate parent-child interaction; mandatory reporting applies in all jurisdictions"
    ],
    assessmentFindings: [
      "Normal newborn assessment findings: respiratory rate 30-60, heart rate 100-160, weight loss up to 10% in first week with regain by day 10-14, physiological jaundice appearing after 24 hours, Moro reflex, rooting reflex, Babinski reflex (normal in infants), positive grasp reflex",
      "Dehydration assessment: mild (3-5% loss) -- slightly dry mucous membranes, slightly decreased urine output, normal skin turgor; moderate (6-9% loss) -- dry mucous membranes, sunken fontanelle, decreased skin turgor, tachycardia, oliguria; severe (10%+ loss) -- very dry mucous membranes, deeply sunken fontanelle and eyes, poor skin turgor with tenting, hypotension, minimal or absent urine output, lethargy",
      "Respiratory distress in children: nasal flaring (indicates increased respiratory effort), grunting (indicates attempt to maintain positive end-expiratory pressure), retractions (substernal, intercostal, supraclavicular indicating increased work of breathing), head bobbing in infants, tripod positioning in older children",
      "Developmental red flags requiring referral: no social smile by 2 months, not reaching for objects by 5 months, not sitting independently by 9 months, not walking by 18 months, no words by 16 months, no two-word phrases by 24 months, loss of previously acquired skills at any age",
      "Signs of circulatory compromise in children: tachycardia (earliest sign), prolonged capillary refill time (greater than 2 seconds), mottled or cool extremities, altered mental status (irritability progressing to lethargy), weak peripheral pulses; hypotension is a LATE and ominous sign",
      "Normal fontanelle findings: anterior fontanelle should be flat and soft; best assessed with infant in upright position while calm; normally closes between 12 and 18 months of age"
    ],
    signs: {
      left: [
        "Growth parameters tracking along expected percentile curves",
        "Achieving developmental milestones within expected time frames",
        "Mild upper respiratory symptoms (clear rhinorrhea, occasional cough) with normal activity level",
        "Mild dehydration responding to oral rehydration therapy",
        "Low-grade fever (38.0-38.5 C) with known viral illness and active, playful child",
        "Normal fontanelle (flat, soft) with no signs of increased intracranial pressure"
      ],
      right: [
        "Severe dehydration (greater than 10% weight loss, absent urine output, hypotension, lethargy)",
        "Signs of meningitis (bulging fontanelle, nuchal rigidity, fever, irritability or lethargy, petechial rash)",
        "Respiratory failure (cyanosis, severe retractions, grunting, decreased level of consciousness, bradycardia)",
        "Signs of shock (persistent tachycardia, prolonged capillary refill, hypotension, altered mental status)",
        "Fever in infant under 28 days of age (38.0 C or greater rectally requires immediate sepsis workup)",
        "Suspected non-accidental trauma (bruising in non-mobile infant, patterned injuries, inconsistent history)"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol Pediatric/Infant)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase enzymes centrally in the brain and spinal cord, reducing prostaglandin E2 synthesis to lower the hypothalamic thermoregulatory set point (antipyretic) and decrease pain signal transmission (analgesic); lacks significant peripheral anti-inflammatory activity, making it safe for use in infants from birth",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (the most critical risk), nausea, rare allergic reactions; chronic excessive use may cause analgesic nephropathy",
        contra: "Severe hepatic impairment, active liver disease, known hypersensitivity; caution with concurrent acetaminophen-containing products; caution in G6PD deficiency",
        pearl: "Dose 10-15 mg/kg/dose every 4-6 hours (maximum 75 mg/kg/day or 4 g/day); safe from birth; always use the calibrated measuring device provided; infant drops and children's liquid have DIFFERENT concentrations -- always verify the formulation before dosing"
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin antibiotic (bactericidal)",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs) in the bacterial cell wall, preventing cross-linking of peptidoglycan polymers; the resulting weakness in the cell wall leads to osmotic lysis and bacterial death; effective against many gram-positive and some gram-negative organisms commonly causing pediatric infections",
        sideEffects: "Diarrhea (most common), diaper dermatitis (yeast overgrowth), nausea, vomiting, maculopapular rash (especially with concurrent EBV infection), allergic reactions (urticaria, anaphylaxis in penicillin-allergic patients)",
        contra: "History of anaphylaxis or serious allergic reaction to penicillin or other beta-lactam antibiotics; concurrent infectious mononucleosis (EBV) due to high incidence of non-allergic maculopapular rash",
        pearl: "First-line for acute otitis media (standard dose 40-45 mg/kg/day divided twice daily; high-dose 80-90 mg/kg/day for resistant organisms), streptococcal pharyngitis, and community-acquired pneumonia in children; complete the FULL prescribed course even if symptoms improve to prevent antibiotic resistance"
      },
      {
        name: "Oral Rehydration Solution (ORS -- Pedialyte)",
        type: "Electrolyte and glucose replacement solution",
        action: "Provides an optimal ratio of glucose, sodium, potassium, chloride, and citrate that leverages the sodium-glucose co-transport mechanism in the small intestinal epithelium; the active co-transport of glucose and sodium across the brush border membrane creates an osmotic gradient that enhances water absorption even in the presence of diarrheal illness, restoring intravascular volume and correcting electrolyte imbalances",
        sideEffects: "Vomiting if administered too quickly or in large volumes; hypernatremia if prepared incorrectly (never dilute or mix with additional water); abdominal distension if given in excess",
        contra: "Severe dehydration with hemodynamic instability (requires IV fluid resuscitation); persistent vomiting unresponsive to small frequent volumes; suspected surgical abdomen; altered level of consciousness preventing safe oral intake",
        pearl: "Administer in small frequent volumes (5-10 mL every 5 minutes via syringe or teaspoon) to reduce vomiting risk; for mild dehydration give 50 mL/kg over 4 hours, for moderate give 100 mL/kg over 4 hours; do NOT substitute fruit juice, soda, or sports drinks which have inappropriate sugar and electrolyte concentrations and can worsen diarrhea via osmotic effect"
      }
    ],
    pearls: [
      "Children are NOT small adults -- their vital sign ranges, medication doses, fluid requirements, and disease presentations differ significantly from adults and vary across pediatric age groups; always use age-specific reference ranges",
      "Hypotension is a LATE sign of shock in children -- by the time blood pressure drops, the child has lost approximately 25 to 30 percent of blood volume; tachycardia, prolonged capillary refill, and mottled skin are EARLY warning signs that must be recognized and reported immediately",
      "The anterior fontanelle is a clinical window into the infant's intracranial pressure and hydration status: a bulging fontanelle may indicate increased intracranial pressure (meningitis, hydrocephalus), while a sunken fontanelle suggests dehydration",
      "Weight in kilograms is the single most important measurement in pediatric nursing -- it determines medication doses, fluid calculations, and nutritional requirements; ALWAYS weigh the child at each visit and verify the weight is recorded correctly",
      "Fever in a neonate (under 28 days of age) with a rectal temperature of 38.0 C or greater is a medical emergency requiring immediate medical evaluation and full sepsis workup -- neonatal immune immaturity makes them highly susceptible to rapidly progressive bacterial infections",
      "Family-centered care is not optional in pediatrics -- parents are partners in care, not visitors; encourage parental presence during procedures when appropriate, include families in care planning, and provide education in language they can understand",
      "Oral rehydration therapy is the first-line treatment for mild to moderate dehydration in children and is as effective as IV fluids for most cases -- the key is small frequent volumes (teaspoon or syringe) rather than large amounts that trigger vomiting"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a 6-month-old infant and notes that the anterior fontanelle is sunken and the mucous membranes are dry. The infant has had decreased wet diapers for the past 12 hours. These findings are most consistent with which condition?",
        options: [
          "Increased intracranial pressure",
          "Dehydration",
          "Meningitis",
          "Normal developmental finding"
        ],
        correct: 1,
        rationale: "A sunken anterior fontanelle combined with dry mucous membranes and decreased urine output (fewer wet diapers) are classic signs of dehydration in an infant. A bulging fontanelle would suggest increased intracranial pressure. These findings should be reported to the RN and the infant's fluid status should be monitored closely."
      },
      {
        question: "A 3-year-old child weighing 15 kg is prescribed amoxicillin 45 mg/kg/day divided twice daily for acute otitis media. What is the correct dose per administration?",
        options: [
          "225 mg every 12 hours",
          "337.5 mg every 12 hours",
          "675 mg every 12 hours",
          "45 mg every 12 hours"
        ],
        correct: 1,
        rationale: "Total daily dose = 45 mg/kg/day x 15 kg = 675 mg/day. Divided twice daily: 675 mg / 2 = 337.5 mg per dose every 12 hours. Weight-based dosing must always be calculated using the child's actual weight in kilograms, and the result verified before administration."
      },
      {
        question: "A practical nurse observes that an 8-month-old infant in the emergency department has a heart rate of 180 beats per minute, capillary refill time of 4 seconds, and mottled extremities. The blood pressure is within normal limits. What do these findings suggest?",
        options: [
          "The infant is in pain and needs analgesics",
          "The infant is in compensated shock and requires immediate intervention",
          "The vital signs are within normal range for this age",
          "The infant has a fever causing the elevated heart rate"
        ],
        correct: 1,
        rationale: "Tachycardia, prolonged capillary refill (greater than 2 seconds), and mottled extremities with maintained blood pressure indicate compensated shock in a pediatric patient. Children compensate for hypovolemia through tachycardia and vasoconstriction, maintaining blood pressure until decompensation occurs. This is an urgent finding requiring immediate reporting and intervention."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} skipped.`);
