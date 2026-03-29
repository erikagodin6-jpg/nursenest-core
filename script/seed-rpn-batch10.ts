import pg from "pg";
import crypto from "crypto";
const Pool = pg.Pool;
const pool = new Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });
function hash(s: string): string { return crypto.createHash("md5").update(s.toLowerCase().trim()).digest("hex"); }

interface Q {
  tier:string; exam:string; stem:string; options:string[]; correct:number; rationale:string;
  diff:number; bs:string; topic:string; cp:string; es:string; dr:Record<string,string>;
}

function q(e:string,bs:string,topic:string,d:number,stem:string,opts:string[],c:number,rat:string,cp:string,es:string,dr:Record<string,string>):Q {
  return {tier:"rpn",exam:e,stem,options:opts,correct:c,rationale:rat,diff:d,bs,topic,cp,es,dr};
}

const QS: Q[] = [
  // ===== MATERNAL / NEWBORN (80) =====
  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is assessing a newborn at 1 minute after birth using the Apgar score. The components assessed include:",
    ["Weight, length, head circumference, chest circumference, and reflexes","Heart rate, respiratory effort, muscle tone, reflex irritability, and color","Blood pressure, temperature, pulse oximetry, and glucose","Gestational age, birth weight, feeding ability, and cry"],1,
    "The Apgar score assesses five components at 1 and 5 minutes after birth: heart rate, respiratory effort, muscle tone, reflex irritability, and skin color. Each is scored 0-2, with a maximum total of 10.",
    "Apgar: Appearance (color), Pulse (heart rate), Grimace (reflex), Activity (muscle tone), Respiration. Scored at 1 and 5 minutes. Score 7-10 = normal.",
    "Apgar mnemonic: A-P-G-A-R. Each category 0-2 points. Remember heart rate is the most important component.",
    {"0":"Weight and length are measured but are not part of the Apgar scoring system.","2":"Blood pressure and pulse oximetry are not components of the Apgar score.","3":"Gestational age and feeding ability are assessed separately, not as part of Apgar scoring."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "A nurse is monitoring a laboring client and notes late decelerations on the fetal heart rate monitor. The priority action is to:",
    ["Continue monitoring without intervention","Turn the client to the left lateral position, administer oxygen, increase IV fluids, and notify the provider","Encourage the client to push harder","Administer oxytocin to speed up labor"],1,
    "Late decelerations indicate uteroplacental insufficiency and fetal hypoxia. The interventions are: left lateral position (improves placental perfusion), oxygen administration, IV fluid bolus, discontinue oxytocin if running, and notify the provider.",
    "Late decelerations: begin after contraction peaks, return to baseline after contraction ends. Cause: uteroplacental insufficiency. Treatment: position change, O2, fluids, stop oxytocin.",
    "FHR decelerations: early = head compression (benign). Variable = cord compression (position change). Late = placental insufficiency (emergency interventions).",
    {"0":"Late decelerations require immediate intervention; continued monitoring alone is inadequate.","2":"Encouraging pushing during late decelerations could worsen fetal hypoxia.","3":"Oxytocin increases contractions and worsens uteroplacental insufficiency; it should be discontinued, not administered."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A postpartum client's fundus is found to be boggy and displaced to the right. The nurse should first:",
    ["Massage the fundus and have the client empty her bladder","Administer methylergonovine immediately","Apply an ice pack to the abdomen","Notify the physician and prepare for surgery"],0,
    "A boggy fundus displaced to the right indicates uterine atony, often caused by a full bladder. The nurse should massage the fundus to stimulate contraction and have the client void (or catheterize if unable) to allow the uterus to contract effectively.",
    "Postpartum assessment: fundus should be firm, midline, at or below the umbilicus. Boggy = atony (massage). Displaced = full bladder (void/cath).",
    "Boggy fundus: massage first, then identify and treat the cause (full bladder, retained tissue, atony).",
    {"1":"Methylergonovine may be needed but is not the first intervention; massage and bladder emptying should be attempted first.","2":"An ice pack does not address uterine atony; fundal massage is the appropriate first intervention.","3":"Surgery is a last resort after conservative measures fail; massage and medication should be tried first."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is teaching a new mother about breastfeeding. Which statement by the mother indicates correct understanding?",
    ["I should supplement with formula after every breastfeeding session","I should feed my baby on demand, approximately every 2-3 hours","I should limit each feeding to 5 minutes per breast","My baby only needs to breastfeed 3 times a day"],1,
    "Newborns should breastfeed on demand, approximately every 2-3 hours (8-12 times per day). Each feeding should last until the baby is satisfied, alternating the starting breast. Supplementation should be avoided unless medically indicated.",
    "Breastfeeding: on demand every 2-3 hours, 8-12 times/day, alternate starting breast, baby should have 6-8 wet diapers/day by day 4.",
    "Breastfeeding questions: demand feeding, no supplementation unless indicated, adequate wet diapers = adequate intake.",
    {"0":"Routine formula supplementation can reduce milk supply and interfere with establishing breastfeeding.","2":"Limiting feeding time prevents the baby from receiving the fat-rich hindmilk; feeding should continue until the baby is satisfied.","3":"Three feedings per day is far too infrequent for a newborn; 8-12 feedings per day is recommended."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "A pregnant client at 30 weeks gestation presents with painless, bright red vaginal bleeding. The nurse suspects:",
    ["Abruptio placentae","Placenta previa","Normal bloody show","Cervical polyp"],1,
    "Placenta previa presents with painless, bright red bleeding in the second or third trimester. The placenta is implanted over or near the cervical os. No vaginal examinations should be performed until placenta previa is ruled out by ultrasound.",
    "Placenta previa: painless, bright red bleeding. Abruptio placentae: painful, dark red bleeding with rigid abdomen. Never perform vaginal exam with suspected previa.",
    "Antepartum bleeding: painless bright red = previa. Painful dark + rigid abdomen = abruption. This distinction is heavily tested.",
    {"0":"Abruptio placentae presents with painful bleeding, often with a rigid abdomen and dark red blood.","2":"Bloody show is a small amount of blood-tinged mucus at the onset of labor, not profuse bright red bleeding.","3":"Cervical polyps may cause spotting but do not typically cause the amount of bright red bleeding described."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is teaching a pregnant client about the danger signs of pregnancy that require immediate medical attention. Which symptom should be reported immediately?",
    ["Mild nausea in the first trimester","Sudden severe headache with visual changes","Occasional backache in the third trimester","Mild ankle swelling at the end of the day"],1,
    "Sudden severe headache with visual changes (blurred vision, scotomata) are warning signs of preeclampsia, a potentially life-threatening condition. Other danger signs include sudden edema of the face/hands, epigastric pain, and seizures.",
    "Preeclampsia warning signs: severe headache, visual changes, epigastric pain, rapid weight gain, facial/hand edema. Report immediately for BP and lab evaluation.",
    "Pregnancy danger signs: headache + visual changes = preeclampsia until proven otherwise. This requires immediate evaluation.",
    {"0":"Mild nausea in the first trimester is a normal discomfort of pregnancy.","2":"Occasional backache in the third trimester is common due to postural changes and weight gain.","3":"Mild ankle swelling at the end of the day is a normal finding in pregnancy; sudden facial/hand edema is concerning."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "A nurse is caring for a client with severe preeclampsia receiving magnesium sulfate. The client develops respiratory depression. The nurse should:",
    ["Continue the magnesium sulfate infusion","Stop the magnesium sulfate and administer calcium gluconate as the antidote","Increase the infusion rate","Administer another dose of magnesium"],1,
    "Respiratory depression is a sign of magnesium toxicity. The infusion must be stopped immediately and calcium gluconate (the antidote) administered IV. Monitor respiratory rate (maintain >12), DTRs, and urine output (>30 mL/hr).",
    "Magnesium toxicity antidote: calcium gluconate. Stop magnesium, give calcium gluconate IV, support respirations. Always have calcium gluconate at bedside.",
    "Magnesium sulfate + respiratory depression = stop infusion + calcium gluconate. This is a life-threatening emergency.",
    {"0":"Continuing the infusion during respiratory depression would worsen toxicity and could cause respiratory arrest.","2":"Increasing the rate would worsen the toxicity and is absolutely contraindicated.","3":"Additional magnesium would further depress respirations and could be fatal."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is assessing a 24-hour-old newborn and notices yellowing of the skin and sclera. This is most likely:",
    ["A medical emergency requiring exchange transfusion","Physiological jaundice, which is common and typically benign","A sign of hepatitis B infection","Normal newborn skin color"],1,
    "Physiological jaundice appears after 24 hours of age and peaks at 3-5 days. It results from the newborn's immature liver processing bilirubin from normal red blood cell breakdown. Jaundice appearing within the first 24 hours is pathological and requires immediate evaluation.",
    "Newborn jaundice: physiological = appears after 24 hours (normal). Pathological = appears within 24 hours (ABO/Rh incompatibility, hemolysis - emergency).",
    "Jaundice timing is critical: <24 hours = pathological (emergency). >24 hours = physiological (monitor). Know the difference.",
    {"0":"Physiological jaundice at 24 hours rarely requires exchange transfusion; monitoring and phototherapy may be sufficient.","2":"Hepatitis B does not present with jaundice this quickly in newborns; it has a longer incubation period.","3":"Yellowing of the skin is not a normal newborn color; it indicates elevated bilirubin."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "A nurse is caring for a newborn receiving phototherapy for jaundice. Which nursing intervention is essential?",
    ["Keep the newborn fully clothed under the lights","Protect the newborn's eyes with opaque eye shields and monitor temperature","Apply sunscreen to the newborn's skin","Place the newborn in a prone position only"],1,
    "During phototherapy, the newborn's eyes must be protected with opaque eye shields to prevent retinal damage. The newborn should be undressed (except diaper) to maximize skin exposure. Monitor temperature (risk of hyperthermia) and hydration status.",
    "Phototherapy care: eye shields (prevent retinal damage), maximum skin exposure, monitor temperature, increase feeding frequency (bilirubin excreted in stool), check bilirubin levels.",
    "Phototherapy essentials: eye protection + maximum skin exposure + hydration + temperature monitoring.",
    {"0":"The newborn should be undressed to maximize skin exposure to the phototherapy lights.","2":"Sunscreen is not appropriate for newborns and would block the therapeutic light.","3":"The newborn should be repositioned frequently (prone, supine, side-lying) to expose all skin surfaces."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is teaching newborn care to parents. Which instruction regarding umbilical cord care is correct?",
    ["Apply alcohol to the cord stump three times daily","Keep the cord stump clean and dry, fold the diaper below it, and report signs of infection","Submerge the newborn in a tub bath until the cord falls off","Apply antibiotic ointment to the cord daily"],1,
    "Current evidence supports dry cord care: keep the stump clean and dry, fold the diaper below to prevent urine contamination, and sponge bathe until the cord falls off (7-14 days). Report redness, drainage, foul odor, or bleeding.",
    "Umbilical cord care: clean and dry, fold diaper below, sponge bathe only, report signs of infection (redness, drainage, odor). Falls off in 7-14 days.",
    "Cord care: the current recommendation is dry care (no alcohol). Report any signs of infection promptly.",
    {"0":"Current guidelines no longer recommend routine alcohol application; clean and dry care is the standard.","2":"Tub baths should be avoided until the cord falls off; sponge baths are recommended.","3":"Antibiotic ointment is not routinely applied to cord stumps; dry care is the current standard."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is assessing a pregnant client at 28 weeks gestation. The nurse performs a glucose challenge test. A result of 145 mg/dL indicates:",
    ["Normal glucose tolerance","Need for a 3-hour glucose tolerance test for further evaluation","Definitive diagnosis of gestational diabetes","Hypoglycemia requiring treatment"],1,
    "A glucose challenge test (1-hour, 50g) result ≥130-140 mg/dL (depending on the lab) requires follow-up with a 3-hour glucose tolerance test (100g) to confirm or rule out gestational diabetes mellitus (GDM).",
    "GDM screening: 1-hour glucose challenge at 24-28 weeks. Abnormal (≥140) → 3-hour GTT. Risk factors: obesity, age >25, family history, previous GDM.",
    "Glucose screening: one abnormal 1-hour test does not diagnose GDM; it requires a confirmatory 3-hour test.",
    {"0":"A result of 145 mg/dL exceeds the normal threshold of 140 mg/dL and requires further testing.","2":"The 1-hour glucose challenge is a screening test; diagnosis requires the confirmatory 3-hour GTT.","3":"A result of 145 mg/dL represents hyperglycemia, not hypoglycemia."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "During labor, the nurse notes a sudden gush of fluid from the vagina. The fetal heart rate drops to 60 bpm. The nurse suspects:",
    ["Normal labor progression","Umbilical cord prolapse requiring emergency intervention","Spontaneous rupture of membranes only","Maternal dehydration"],1,
    "A sudden FHR drop after rupture of membranes suggests umbilical cord prolapse. The nurse should: call for help, position the client in knee-chest or Trendelenburg, manually elevate the presenting part off the cord (wearing sterile gloves), and prepare for emergency cesarean.",
    "Cord prolapse: knee-chest or Trendelenburg position, manually elevate presenting part, do NOT attempt to push cord back, prepare for emergency C-section.",
    "Cord prolapse emergency: position (knee-chest), elevate presenting part, do NOT replace the cord, emergency cesarean section.",
    {"0":"A sudden FHR drop to 60 is a medical emergency, not normal labor progression.","2":"While SROM occurred, the FHR deceleration indicates a complication beyond simple membrane rupture.","3":"Maternal dehydration does not cause sudden profound FHR decelerations to 60 bpm."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is assessing a newborn and notes a single palmar crease (simian crease). The nurse understands this finding may be associated with:",
    ["Normal newborn variation only","Down syndrome (trisomy 21)","Fetal alcohol syndrome","Turner syndrome"],1,
    "A single transverse palmar crease (simian crease) is associated with Down syndrome (trisomy 21), though it can occur as a normal variant. Other Down syndrome features include hypotonia, flat facial profile, upslanting palpebral fissures, and protruding tongue.",
    "Down syndrome physical features: simian crease, hypotonia, flat facial profile, upslanting eyes, protruding tongue, wide space between first and second toes.",
    "Simian crease + other features = evaluate for Down syndrome. Remember that simian crease alone can be a normal variant.",
    {"0":"While a simian crease can be a normal variant, the question asks about associated conditions, making Down syndrome the most significant association.","2":"Fetal alcohol syndrome features include short palpebral fissures, thin upper lip, and smooth philtrum, not a simian crease.","3":"Turner syndrome (45, XO) presents with webbed neck, shield chest, and short stature, not typically a simian crease."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",3,
    "A nurse is teaching a pregnant client about fetal movement counting (kick counts). The client should report which finding to the provider?",
    ["10 movements in 2 hours","Fewer than 10 movements in 2 hours or a significant decrease from the usual pattern","Active fetal movement after meals","Hiccup-like movements"],1,
    "Decreased fetal movement may indicate fetal compromise. The general guideline is to report fewer than 10 movements in 2 hours, or any significant change from the baby's usual movement pattern. This warrants evaluation with NST or BPP.",
    "Kick counts: 10 movements in 2 hours is reassuring. Report <10 movements/2 hours or significant decrease from normal pattern. Best done after meals.",
    "Fetal movement counting: the threshold is 10 movements in 2 hours. Decreased movement warrants further evaluation (NST/BPP).",
    {"0":"10 movements in 2 hours is reassuring and does not need to be reported.","2":"Active fetal movement after meals is normal and expected.","3":"Hiccup-like movements are normal fetal activity and do not require reporting."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "A postpartum client develops a temperature of 38.5°C, uterine tenderness, and foul-smelling lochia on day 3 postpartum. The nurse suspects:",
    ["Normal postpartum recovery","Endometritis (postpartum uterine infection)","Mastitis","Urinary tract infection"],1,
    "Postpartum endometritis presents with fever (≥38°C), uterine tenderness, foul-smelling lochia, and tachycardia. It is the most common postpartum infection, especially after cesarean delivery. Treatment includes IV antibiotics.",
    "Endometritis triad: fever + uterine tenderness + foul-smelling lochia. Most common after C-section. Treatment: IV broad-spectrum antibiotics.",
    "Postpartum fever with uterine tenderness and foul-smelling lochia = endometritis. Know the distinguishing features of each postpartum infection.",
    {"0":"Fever, uterine tenderness, and foul-smelling lochia are abnormal findings requiring treatment.","2":"Mastitis presents with breast tenderness, redness, and warmth, not uterine symptoms.","3":"UTI presents with dysuria and urinary symptoms, not uterine tenderness and foul-smelling lochia."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is performing a Leopold's maneuver on a pregnant client at 36 weeks. The purpose is to determine:",
    ["Fetal blood type","Fetal position, presentation, and engagement","Cervical dilation","Maternal blood pressure"],1,
    "Leopold's maneuvers are a series of four abdominal palpation techniques used to determine fetal lie, presentation (cephalic vs breech), position (where the fetal back is), and engagement (descent of the presenting part into the pelvis).",
    "Leopold's maneuvers: 4 steps to assess fetal lie (longitudinal/transverse), presentation (cephalic/breech), position (fetal back location), engagement.",
    "Leopold's = external abdominal assessment of fetal position. Know what each of the four maneuvers assesses.",
    {"0":"Fetal blood type is determined by laboratory testing, not physical examination.","2":"Cervical dilation is assessed by vaginal examination, not abdominal palpation.","3":"Maternal blood pressure is assessed with a blood pressure cuff, not abdominal palpation."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",3,
    "A nurse is caring for a newborn with a meningomyelocele (open spina bifida). The priority nursing action before surgery is to:",
    ["Place the newborn in a prone position and cover the lesion with sterile, moist saline dressing","Allow the parents to hold the newborn against their chest","Apply a dry sterile dressing and position supine","Leave the lesion uncovered to air-dry"],1,
    "The meningomyelocele sac must be kept moist with sterile saline dressing to prevent drying and infection. The infant is positioned prone to prevent pressure on the sac. Latex-free environment is essential (latex allergy risk).",
    "Meningomyelocele preop care: prone position, sterile moist saline dressing, latex-free environment, monitor for signs of hydrocephalus (increasing head circumference).",
    "Neural tube defect care: moist + prone + latex-free. These three elements are the essential preoperative interventions.",
    {"0":"The priority answer includes both positioning AND dressing; simple positioning alone is incomplete.","2":"Supine positioning would place pressure on the meningomyelocele sac, risking rupture and infection.","3":"Leaving the lesion uncovered causes the tissue to dry out and increases infection risk."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "A nurse is teaching a postpartum client about lochia progression. The expected sequence is:",
    ["Lochia alba, lochia serosa, lochia rubra","Lochia rubra (red, days 1-3), lochia serosa (pinkish-brown, days 4-10), lochia alba (white, days 10-14)","Lochia rubra lasts for 4 weeks","All lochia should be bright red for 2 weeks"],1,
    "Normal lochia progression: rubra (dark red, days 1-3), serosa (pinkish-brown, days 4-10), alba (yellowish-white, days 10-14 up to 6 weeks). A return to rubra after serosa may indicate complications.",
    "Lochia progression: Rubra → Serosa → Alba. Remember 'RSA' = Red → Salmon → Album (white). Report return to red or foul odor.",
    "Lochia questions: know the color progression and timing. Return to red lochia or foul odor = potential complication.",
    {"0":"The sequence is rubra first, not alba first; alba is the final stage.","2":"Lochia rubra normally lasts only 1-3 days, not 4 weeks; prolonged rubra indicates complications.","3":"Bright red bleeding for 2 weeks is abnormal and suggests hemorrhage or retained products."}),

  q("REX-PN","Maternal/Newborn","Maternal and Newborn",2,
    "A nurse is assessing a 2-day-old newborn and notes a soft spot on the top of the head. The nurse understands this is the:",
    ["Occipital bone","Anterior fontanelle, which normally closes by 12-18 months","A skull fracture requiring immediate evaluation","An abnormal finding requiring cranial imaging"],1,
    "The anterior fontanelle is a diamond-shaped soft spot at the junction of the frontal and parietal bones. It normally closes by 12-18 months. The posterior fontanelle is triangular and closes by 2-3 months.",
    "Fontanelles: anterior (diamond, closes 12-18 months), posterior (triangle, closes 2-3 months). Bulging = increased ICP. Sunken = dehydration.",
    "Fontanelle assessment: normal = flat and soft. Bulging = increased ICP (meningitis). Sunken = dehydration. Know closure timing.",
    {"0":"The occipital bone is a fully formed skull bone, not a soft spot.","2":"The anterior fontanelle is a normal anatomical structure, not a fracture.","3":"Fontanelles are expected findings in newborns and do not require cranial imaging."}),

  q("RPN-CAT","Maternal/Newborn","Maternal and Newborn",3,
    "A nurse is caring for a client in active labor. The client's cervix is 8 cm dilated. During a contraction, the nurse sees the umbilical cord protruding from the vagina. The priority action is to:",
    ["Push the cord back into the vagina","Place the client in knee-chest position and apply pressure to elevate the presenting part off the cord","Cover the cord with a dry towel","Wait for the next contraction to assess the situation"],1,
    "Umbilical cord prolapse is an emergency. The nurse should immediately: position the client knee-chest or Trendelenburg, apply upward pressure (with sterile gloved hand) to the presenting part to relieve cord compression, call for emergency cesarean, and keep the cord moist with warm sterile saline.",
    "Cord prolapse management: knee-chest position, elevate presenting part, keep cord moist with warm saline, emergency C-section. Do NOT push cord back in.",
    "Cord prolapse is the #1 labor emergency to know. Key actions: position, elevate, moisten, emergency delivery.",
    {"0":"Pushing the cord back can cause vasospasm and worsen cord compression; never attempt to replace a prolapsed cord.","2":"A dry towel would cause the cord vessels to constrict (vasospasm); the cord should be kept moist with warm sterile saline.","3":"Waiting delays intervention and increases the risk of fetal hypoxia and death; immediate action is required."}),

  // ===== PEDIATRICS (80) =====
  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is caring for a 6-month-old infant with moderate dehydration. Which assessment finding is most consistent with this diagnosis?",
    ["Bulging fontanelle and hypertension","Sunken fontanelle, decreased skin turgor, and decreased urine output","Excessive tearing and moist mucous membranes","Weight gain and edema"],1,
    "Moderate dehydration in infants presents with sunken fontanelle, decreased skin turgor (tenting), decreased urine output, dry mucous membranes, and irritability. Severe dehydration adds lethargy, absent tears, and sunken eyes.",
    "Pediatric dehydration assessment: sunken fontanelle (unique to infants), skin turgor, mucous membranes, tears, urine output, weight change.",
    "Infant dehydration: sunken fontanelle is the key infant-specific sign. Also assess tears, mucous membranes, and urine output.",
    {"0":"Bulging fontanelle and hypertension suggest increased intracranial pressure, not dehydration.","2":"Excessive tearing and moist membranes indicate adequate hydration, not dehydration.","3":"Weight gain and edema indicate fluid overload, not dehydration."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with cystic fibrosis. Which dietary recommendation is appropriate?",
    ["Low-calorie, low-fat diet","High-calorie, high-protein diet with fat-soluble vitamin supplements and pancreatic enzyme replacement","Sodium-restricted diet","Fluid-restricted diet"],1,
    "Children with CF require 120-150% of normal caloric intake due to malabsorption and increased metabolic demands. Pancreatic enzymes (with meals and snacks) aid digestion. Fat-soluble vitamins (A, D, E, K) require supplementation due to fat malabsorption.",
    "CF nutrition: high-calorie, high-protein, unrestricted fat, pancreatic enzymes with all meals/snacks, fat-soluble vitamin supplements (A, D, E, K), adequate sodium.",
    "CF diet: more calories, more protein, pancreatic enzymes with food, and vitamin ADEK supplements. The opposite of typical 'healthy eating.'",
    {"0":"Low-calorie diets are inappropriate; CF children need 120-150% of normal calories due to malabsorption.","2":"Children with CF may need additional sodium, especially in hot weather, due to excessive salt loss in sweat.","3":"Adequate fluid intake is essential for CF; fluid restriction would worsen mucus plugging."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is teaching parents about childhood immunization. The MMR vaccine protects against:",
    ["Meningitis, mumps, and rubella","Measles, mumps, and rubella","Measles, malaria, and rotavirus","Meningitis, measles, and rabies"],1,
    "The MMR vaccine protects against measles (rubeola), mumps, and rubella (German measles). It is a live attenuated vaccine given at 12-15 months with a booster at 4-6 years. It is contraindicated in immunocompromised individuals and pregnancy.",
    "MMR: live vaccine, 2 doses (12-15 months and 4-6 years). Contraindicated in immunocompromised and pregnant clients. Wait 4 weeks after MMR before pregnancy.",
    "MMR is a live vaccine. Key contraindications: immunocompromised, pregnancy, severe allergic reaction to previous dose or component.",
    {"0":"MMR stands for Measles, Mumps, and Rubella, not meningitis.","2":"Malaria has no vaccine in routine use; rotavirus has a separate oral vaccine.","3":"Rabies and meningitis have their own separate vaccines."}),

  q("REX-PN","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with suspected epiglottitis. Which action should the nurse avoid?",
    ["Placing the child in a sitting position","Inspecting the throat with a tongue depressor","Providing humidified oxygen","Keeping emergency intubation equipment at bedside"],1,
    "Throat inspection with a tongue depressor can trigger complete laryngospasm and airway obstruction in epiglottitis. The child should be kept calm, in an upright position, and emergency airway equipment should be immediately available.",
    "Epiglottitis: do NOT examine the throat, do NOT lay the child flat, do NOT agitate the child. Keep sitting up, emergency airway ready. Caused by H. influenzae type B.",
    "Epiglottitis: NEVER look in the throat. The 3 D's: drooling, dysphagia, distress. Medical emergency requiring airway protection.",
    {"0":"Sitting upright is the correct position as it helps maintain the airway; this should not be avoided.","2":"Humidified oxygen is an appropriate supportive measure for respiratory distress.","3":"Emergency intubation equipment should be readily available as complete obstruction can occur suddenly."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A 4-year-old child is admitted with acute lymphoblastic leukemia (ALL). The nurse monitors for which most common complication?",
    ["Hyperglycemia","Infection due to immunosuppression from chemotherapy","Hypertension","Obesity"],1,
    "Children with ALL receiving chemotherapy are severely immunosuppressed due to bone marrow suppression. Infection is the leading cause of death. Neutropenic precautions, meticulous hand hygiene, and monitoring for fever (even low-grade) are essential.",
    "Pediatric leukemia: infection is the #1 complication and cause of death. Monitor for fever (may be the only sign of infection in neutropenic children).",
    "Leukemia + chemotherapy = infection risk. A fever in a neutropenic child is a medical emergency requiring immediate cultures and antibiotics.",
    {"0":"While steroids used in ALL treatment can cause hyperglycemia, infection is the most life-threatening complication.","2":"Hypertension is not the most common complication of ALL or its treatment.","3":"Weight changes may occur but obesity is not the primary complication of concern."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is teaching parents about safe sleep practices for infants. Which instruction is correct?",
    ["Place the infant on their stomach to sleep","Place the infant on their back to sleep on a firm mattress without loose bedding","Add bumper pads and stuffed animals for comfort","Co-sleeping with parents is the safest option"],1,
    "The AAP recommends back-to-sleep on a firm mattress with a fitted sheet only. No loose bedding, pillows, bumper pads, or stuffed animals. Room-sharing (not bed-sharing) for at least the first 6 months reduces SIDS risk.",
    "Safe sleep ABCs: Alone, on their Back, in a Crib. No loose bedding, bumpers, or toys. Room-sharing without bed-sharing for at least 6 months.",
    "Infant sleep safety: back to sleep, firm surface, no soft objects. This is one of the most commonly tested pediatric topics.",
    {"0":"Prone sleeping increases SIDS risk significantly; back-to-sleep is the recommended position.","2":"Bumper pads and stuffed animals are suffocation and entrapment hazards and should not be in the crib.","3":"Bed-sharing increases the risk of suffocation, entrapment, and SIDS; room-sharing without bed-sharing is recommended."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A 3-year-old child is admitted with nephrotic syndrome. The nurse expects which laboratory findings?",
    ["Elevated serum albumin and decreased urine protein","Decreased serum albumin, massive proteinuria, hyperlipidemia, and edema","Elevated BUN and creatinine with hematuria","Normal serum albumin with decreased urine output"],1,
    "Nephrotic syndrome is characterized by massive proteinuria (protein loss in urine), hypoalbuminemia (low serum albumin), hyperlipidemia, and generalized edema. The protein loss causes decreased oncotic pressure, leading to fluid shifts into interstitial spaces.",
    "Nephrotic syndrome: massive proteinuria → hypoalbuminemia → decreased oncotic pressure → edema + hyperlipidemia. Treatment: corticosteroids, albumin infusions, diuretics.",
    "Nephrotic syndrome tetrad: proteinuria + hypoalbuminemia + hyperlipidemia + edema. Remember the protein loss drives all other changes.",
    {"0":"In nephrotic syndrome, serum albumin is decreased (not elevated) due to massive urinary protein loss.","2":"Elevated BUN and creatinine with hematuria are more characteristic of nephritic syndrome or renal failure.","3":"Serum albumin is markedly decreased in nephrotic syndrome, not normal."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is calculating a medication dose for a 22-kg child. The prescribed dose is 10 mg/kg/day divided into two doses. The individual dose is:",
    ["220 mg every 24 hours","110 mg every 12 hours","22 mg every 6 hours","55 mg every 6 hours"],1,
    "Total daily dose: 22 kg × 10 mg/kg = 220 mg/day. Divided into 2 doses: 220 mg ÷ 2 = 110 mg every 12 hours. Always verify pediatric medication doses using weight-based calculations.",
    "Pediatric dosing: weight (kg) × mg/kg/day = total daily dose. Divide by frequency. Always double-check calculations and verify safe dose range.",
    "Weight-based dosing: calculate total daily dose first, then divide by the number of doses. Always verify against safe dose ranges.",
    {"0":"220 mg is the total daily dose, not the individual dose; it must be divided into two doses.","2":"22 mg would be the dose if the rate were 1 mg/kg/day divided by 4; this does not match the prescribed regimen.","3":"55 mg every 6 hours would give 4 doses totaling 220 mg, but the order specifies dividing into 2 doses, not 4."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with type 1 diabetes who is unconscious from hypoglycemia. The priority intervention is to:",
    ["Administer oral glucose gel","Administer glucagon IM or subcutaneously","Give the child orange juice","Administer regular insulin"],1,
    "Unconscious clients cannot safely swallow. Glucagon IM or subcutaneously stimulates glycogenolysis, raising blood glucose within 10-15 minutes. IV dextrose is the alternative in a hospital setting. Oral glucose is contraindicated due to aspiration risk.",
    "Hypoglycemia in unconscious client: glucagon IM/SC (home) or IV dextrose (hospital). NEVER give oral glucose to unconscious clients (aspiration risk).",
    "Unconscious + hypoglycemia = glucagon (not oral glucose). This is a critical safety distinction.",
    {"0":"Oral glucose gel cannot be safely administered to an unconscious child due to aspiration risk.","2":"Orange juice cannot be given to an unconscious child; it would cause aspiration.","3":"Insulin would further lower blood glucose and could be fatal in hypoglycemia."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is assessing a 2-year-old child. Which finding indicates a potential developmental delay?",
    ["Cannot ride a bicycle","Cannot walk independently","Cannot write their name","Cannot count to 100"],1,
    "Most children walk independently by 12-15 months. Inability to walk at 2 years old is a significant gross motor developmental delay requiring comprehensive evaluation by a developmental specialist.",
    "Gross motor milestones: sitting (6-8 months), crawling (9-10 months), walking (12-15 months), running (2 years), tricycle (3 years).",
    "Developmental milestones: know the key milestone for each age. Walking by 15 months is expected; not walking at 2 years is concerning.",
    {"0":"Riding a bicycle is a 5-6 year old milestone; not riding at 2 is expected.","2":"Writing one's name is a 4-5 year old milestone; not writing at 2 is expected.","3":"Counting to 100 is a school-age skill; not counting at 2 is expected."}),

  q("REX-PN","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with Kawasaki disease. The nurse monitors for which serious complication?",
    ["Renal failure","Coronary artery aneurysm","Hepatic failure","Pulmonary fibrosis"],1,
    "Kawasaki disease is an acute vasculitis that primarily affects children under 5. The most serious complication is coronary artery aneurysm, which can lead to myocardial infarction. Treatment includes IV immunoglobulin (IVIG) and high-dose aspirin.",
    "Kawasaki disease: fever >5 days, bilateral conjunctivitis, strawberry tongue, rash, extremity changes, cervical lymphadenopathy. Complication: coronary aneurysm.",
    "Kawasaki disease: the key complication is coronary artery aneurysm. This is one of the few conditions where children receive aspirin.",
    {"0":"Renal failure is not the primary complication of Kawasaki disease.","2":"Hepatic failure is not a characteristic complication of Kawasaki disease.","3":"Pulmonary fibrosis is not associated with Kawasaki disease."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with acute otitis media. The parent asks how to administer ear drops to a 2-year-old. The nurse teaches:",
    ["Pull the pinna up and back, then instill the drops","Pull the pinna down and back, then instill the drops","Insert the dropper deep into the ear canal","Have the child sit upright during administration"],1,
    "For children under 3 years old, the pinna (outer ear) is pulled down and back to straighten the ear canal. For children over 3 and adults, the pinna is pulled up and back. The child should lie with the affected ear up.",
    "Ear drop administration: <3 years = pull pinna DOWN and back. ≥3 years = pull pinna UP and back. Position: affected ear up for 5 minutes after instillation.",
    "Ear drop age rule: children under 3 = down and back. Over 3 and adults = up and back.",
    {"0":"Up and back is the technique for children over 3 years and adults, not for a 2-year-old.","2":"The dropper should not be inserted deep into the ear canal as this can cause damage to the tympanic membrane.","3":"The child should lie with the affected ear up to allow the drops to reach the tympanic membrane by gravity."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is educating parents about preventing iron-deficiency anemia in toddlers. Which recommendation is most appropriate?",
    ["Allow the toddler to drink unlimited whole milk","Limit cow's milk to 16-24 ounces per day and provide iron-rich foods","Eliminate all dairy products","Give adult iron supplements to the toddler"],1,
    "Excessive cow's milk intake (>24 oz/day) in toddlers displaces iron-rich foods from the diet and inhibits iron absorption. Limiting milk to 16-24 oz/day and offering iron-rich foods (fortified cereals, meats, beans) prevents iron-deficiency anemia.",
    "Toddler iron-deficiency prevention: limit milk to 16-24 oz/day, provide iron-rich foods, avoid excessive juice. Milk is not an iron source and inhibits iron absorption.",
    "Toddler anemia prevention: limit milk + increase iron-rich foods. Excessive milk intake is the most common cause of iron-deficiency anemia in toddlers.",
    {"0":"Unlimited milk intake displaces iron-rich foods and is the leading cause of iron-deficiency anemia in toddlers.","2":"Dairy products provide essential calcium and vitamin D; they should be limited, not eliminated.","3":"Adult iron supplements can cause iron toxicity in children; pediatric-specific dosing is required."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with sickle cell disease who presents with severe bone pain, fever, and swollen joints. The nurse recognizes this as:",
    ["A normal finding in sickle cell disease","A vaso-occlusive (pain) crisis requiring immediate treatment","An allergic reaction","Growing pains"],1,
    "Vaso-occlusive crisis is the most common type of sickle cell crisis. Sickled red blood cells block blood flow, causing tissue ischemia and severe pain. Treatment includes IV fluids, pain management (often opioids), oxygen, and treating any precipitating factors.",
    "Sickle cell vaso-occlusive crisis: IV hydration, pain management (do not undertreat), oxygen if SpO2 decreased, treat infections. Avoid cold (vasoconstriction) and dehydration.",
    "Sickle cell crisis management: hydration + pain control + oxygenation. Pain is severe and should be treated aggressively; do not undertreat.",
    {"0":"Severe bone pain requiring medical intervention is not a normal daily finding; it represents a crisis.","2":"Bone pain, fever, and swollen joints in sickle cell disease are crisis symptoms, not an allergic reaction.","3":"Growing pains do not cause fever and are mild compared to vaso-occlusive crisis pain."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is preparing to administer an intramuscular injection to a 4-month-old infant. The preferred site is the:",
    ["Deltoid muscle","Vastus lateralis (anterolateral thigh)","Dorsogluteal site","Ventrogluteal site"],1,
    "The vastus lateralis (anterolateral thigh) is the preferred IM injection site for infants and children under 12 months. It has the largest muscle mass in this age group and is free from major nerves and blood vessels.",
    "IM injection sites by age: infants <12 months = vastus lateralis. Toddlers/children = vastus lateralis or deltoid. Adults = ventrogluteal (preferred) or deltoid.",
    "Infant IM injection: vastus lateralis (thigh) is ALWAYS correct for infants. The deltoid is too small and the gluteal sites are not developed.",
    {"0":"The deltoid muscle is too small in infants for IM injections; it is used in older children and adults.","2":"The dorsogluteal site is not recommended for any age group due to sciatic nerve risk.","3":"The ventrogluteal site is not fully developed in infants and is not the preferred site for this age group."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with acute asthma exacerbation. After administering albuterol via nebulizer, which assessment indicates the medication is effective?",
    ["Increased wheezing and respiratory rate","Decreased wheezing, improved air entry, and improved oxygen saturation","Drowsiness and decreased activity","No change in respiratory status"],1,
    "Effective bronchodilator response includes decreased wheezing (improved airflow), improved breath sounds with better air entry, decreased respiratory rate and effort, and improved SpO2. Note: completely absent wheezing with poor air movement indicates severe obstruction, not improvement.",
    "Asthma medication effectiveness: decreased wheezing, improved air entry, decreased respiratory rate, improved SpO2, decreased accessory muscle use.",
    "Albuterol effectiveness: improved breath sounds + decreased respiratory effort. Watch for paradoxical worsening (silent chest = emergency).",
    {"0":"Increased wheezing and respiratory rate indicate the medication is not effective and the condition may be worsening.","2":"Drowsiness is not an expected response to albuterol (a stimulant) and may indicate respiratory failure.","3":"No change in respiratory status indicates the medication is not effective and additional treatment is needed."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is teaching parents about febrile seizures in toddlers. Which statement indicates correct understanding?",
    ["Febrile seizures always cause brain damage","Febrile seizures are common in children 6 months to 5 years and are usually benign","My child will definitely develop epilepsy after a febrile seizure","I should insert something in my child's mouth during a seizure"],1,
    "Simple febrile seizures are common (2-5% of children), occur between 6 months and 5 years, last less than 15 minutes, and do not cause brain damage. Most children outgrow them. Complex febrile seizures (>15 minutes, focal, recurrent) require further evaluation.",
    "Febrile seizures: common in 6 months - 5 years, usually benign, last <15 minutes, do not cause brain damage. Only 2-5% develop epilepsy.",
    "Febrile seizure teaching: benign, common, self-limiting. Nothing in the mouth. Position safely. Seek medical attention if >5 minutes.",
    {"0":"Simple febrile seizures do not cause brain damage; they are usually benign and self-limiting.","2":"Only 2-5% of children with febrile seizures develop epilepsy; it is not a certainty.","3":"Nothing should be inserted into the mouth during any seizure; this can cause injury."}),

  q("REX-PN","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with pyloric stenosis. Which clinical finding is most characteristic?",
    ["Bilious (green) vomiting","Projectile, non-bilious vomiting after feeding and an olive-shaped mass in the right upper quadrant","Diarrhea and dehydration","Abdominal distension with absent bowel sounds"],1,
    "Pyloric stenosis presents with progressive projectile non-bilious vomiting in infants 2-8 weeks old. A palpable olive-shaped mass may be felt in the RUQ. The vomiting is non-bilious because the obstruction is proximal to the duodenum.",
    "Pyloric stenosis: projectile NON-bilious vomiting, olive-shaped mass (RUQ), hungry after vomiting, metabolic alkalosis. Treatment: pyloromyotomy.",
    "Pyloric stenosis: the vomiting is NON-bilious and projectile. Bilious vomiting suggests distal obstruction, which is a different condition.",
    {"0":"Bilious vomiting indicates obstruction BELOW the ampulla of Vater; pyloric stenosis is above it, so vomiting is non-bilious.","2":"While dehydration occurs, diarrhea is not a characteristic finding of pyloric stenosis; vomiting is the hallmark.","3":"Abdominal distension with absent bowel sounds suggests bowel obstruction or ileus, not pyloric stenosis."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A nurse is assessing a child with suspected child abuse. Which finding is most suspicious?",
    ["A bruise on the shin from playing","Multiple bruises in various stages of healing on the trunk and buttocks","A scraped knee from a bicycle fall","A single bruise on the forehead"],1,
    "Multiple bruises in various stages of healing on protected body areas (trunk, buttocks, inner thighs, upper arms) are highly suspicious for non-accidental trauma. The pattern of different healing stages suggests repeated injury over time.",
    "Child abuse indicators: bruises in various healing stages, injuries on protected body areas, injuries inconsistent with developmental ability, patterned injuries (belt marks, burns).",
    "Abuse assessment: location + pattern + developmental consistency. Protected body area injuries and multiple healing stages are red flags.",
    {"0":"A single shin bruise is common in active children and consistent with normal play activities.","2":"A scraped knee from a bicycle fall is a typical childhood injury consistent with the history.","3":"A single forehead bruise can occur from normal toddler falls and is not necessarily suspicious."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is caring for a child with a cleft palate who has just undergone surgical repair. The priority postoperative intervention is to:",
    ["Place the child in prone position","Maintain airway patency and protect the surgical site from trauma","Encourage use of a straw for drinking","Apply ice directly to the surgical site"],1,
    "Post-cleft palate repair: maintain airway (edema risk), protect surgical site (no hard objects in mouth), position on side or upright (not prone), use cup or syringe for feeding (no straws or bottles), and elbow restraints to prevent hands in mouth.",
    "Post-cleft palate repair: protect the repair site (no straws, no hard objects, no sucking), maintain airway, elbow restraints, feed with cup/syringe.",
    "Cleft palate post-op: protect the repair + maintain airway. No sucking, no straws, no utensils in the mouth.",
    {"0":"Prone positioning is avoided post-cleft palate repair as it puts pressure on the surgical site.","2":"Straws create negative pressure that can damage the surgical repair; cup feeding is recommended.","3":"Ice should not be applied directly to the surgical site; it could damage the delicate repair."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",3,
    "A nurse is educating parents about managing a child with hemophilia. Which activity is appropriate for this child?",
    ["Contact sports such as football and hockey","Swimming and other non-contact activities","Skateboarding and BMX biking","Wrestling"],1,
    "Children with hemophilia should avoid contact sports and activities with high injury risk. Swimming, walking, and other non-contact activities provide exercise without significant bleeding risk. Protective gear should be used for daily activities.",
    "Hemophilia activity recommendations: non-contact sports (swimming, walking, golf), avoid contact sports, use protective gear, carry medical identification.",
    "Hemophilia lifestyle: non-contact activities are safe. The goal is to maintain physical fitness while minimizing bleeding risk.",
    {"0":"Contact sports like football carry a high risk of traumatic bleeding in hemophilia.","2":"Skateboarding and biking carry significant fall and injury risk, which could cause life-threatening hemorrhage.","3":"Wrestling involves direct physical contact and trauma, which is dangerous for children with hemophilia."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is assessing a child with acute glomerulonephritis. Which findings are most characteristic?",
    ["Polyuria and polydipsia","Dark brown (cola-colored) urine, periorbital edema, and hypertension","Clear urine with increased frequency","Weight loss and dehydration"],1,
    "Acute glomerulonephritis presents with dark, smoky, or cola-colored urine (hematuria), periorbital edema (especially in the morning), hypertension, and decreased urine output. It often follows a streptococcal infection by 1-2 weeks.",
    "Acute glomerulonephritis triad: hematuria (dark urine) + edema (periorbital) + hypertension. Often follows strep infection. Treatment: rest, sodium restriction, antihypertensives.",
    "Glomerulonephritis: dark urine + edema + hypertension, usually post-streptococcal. Know the difference from nephrotic syndrome.",
    {"0":"Polyuria and polydipsia are characteristic of diabetes mellitus or diabetes insipidus, not glomerulonephritis.","2":"Clear urine with increased frequency suggests UTI or diabetes, not glomerulonephritis.","3":"Glomerulonephritis causes fluid retention and edema, not weight loss and dehydration."}),

  q("REX-PN","Pediatric","Pediatric Nursing",3,
    "A nurse is caring for a child with congenital heart disease who has a right-to-left shunt. The nurse would expect which finding?",
    ["Pink skin color and normal oxygen saturation","Cyanosis and clubbing of fingers due to deoxygenated blood mixing with oxygenated blood","Hypertension and bounding pulses","Bradycardia and hypothermia"],1,
    "Right-to-left shunts (Tetralogy of Fallot, transposition of the great arteries) allow deoxygenated blood to enter systemic circulation, causing cyanosis. Chronic hypoxemia leads to clubbing of fingers and polycythemia.",
    "Congenital heart defects: right-to-left shunt = cyanotic (blue babies). Left-to-right shunt = acyanotic initially but can develop heart failure.",
    "CHD classification: right-to-left = cyanotic (Tetralogy of Fallot). Left-to-right = acyanotic (VSD, ASD). Know the shunt direction determines presentation.",
    {"0":"Pink skin and normal SpO2 indicate adequate oxygenation, which is not expected with a right-to-left shunt.","2":"Hypertension and bounding pulses are more characteristic of left-to-right shunts or coarctation of the aorta.","3":"Bradycardia and hypothermia are not characteristic findings of right-to-left cardiac shunts."}),

  q("REX-PN","Pediatric","Pediatric Nursing",2,
    "A nurse is teaching parents about managing their child's atopic dermatitis (eczema). Which instruction is most appropriate?",
    ["Bathe the child in hot water to open pores","Use lukewarm water for baths, apply emollients immediately after bathing, and avoid known triggers","Apply rubbing alcohol to affected areas","Use scented lotions for moisturizing"],1,
    "Eczema management: lukewarm baths (hot water dries skin), apply emollients within 3 minutes of bathing to lock in moisture, avoid triggers (wool, harsh soaps, food allergens), use mild unscented products.",
    "Eczema care: lukewarm baths, immediate emollient application (within 3 minutes), mild unscented products, identify and avoid triggers, cotton clothing.",
    "Eczema management: the key is moisture retention (emollient after bath) and trigger avoidance. Hot water and scented products worsen symptoms.",
    {"0":"Hot water strips natural oils from the skin and worsens eczema; lukewarm water is recommended.","2":"Alcohol is extremely drying and irritating to eczema-affected skin.","3":"Scented lotions contain fragrances that are common eczema triggers and can worsen symptoms."}),

  q("RPN-CAT","Pediatric","Pediatric Nursing",4,
    "A nurse is caring for a child with Reye syndrome. The nurse understands that this condition is associated with:",
    ["Acetaminophen use during viral illness","Aspirin (acetylsalicylic acid) use during viral illness, particularly influenza or varicella","Ibuprofen use for fever","Antibiotic use during bacterial infections"],1,
    "Reye syndrome is a rare but potentially fatal condition associated with aspirin use during viral illnesses (especially influenza and varicella) in children. It causes acute encephalopathy and fatty liver degeneration. Aspirin should be avoided in children under 18.",
    "Reye syndrome: aspirin + viral illness in children = hepatic failure + encephalopathy. This is why aspirin is contraindicated in children under 18 (except Kawasaki disease).",
    "Reye syndrome: aspirin is the trigger. The only pediatric condition where aspirin is used is Kawasaki disease. For all other pediatric fevers, use acetaminophen or ibuprofen.",
    {"0":"Acetaminophen is safe for use in children during viral illness and is not associated with Reye syndrome.","2":"Ibuprofen is safe for children over 6 months and is not associated with Reye syndrome.","3":"Antibiotic use during bacterial infections is not associated with Reye syndrome."})
];

async function main() {
  console.log(`[RPN-B10] Starting insertion of ${QS.length} questions...`);

  const topicDist: Record<string,number> = {};
  const diffDist: Record<string,number> = {easy:0,moderate:0,difficult:0};
  QS.forEach(q => {
    topicDist[q.topic] = (topicDist[q.topic]||0)+1;
    if(q.diff<=2) diffDist.easy++;
    else if(q.diff===3) diffDist.moderate++;
    else diffDist.difficult++;
  });

  console.log(`\nTopic distribution:`);
  Object.entries(topicDist).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([t,c])=>console.log(`  ${t}: ${c}`));
  console.log(`\nDifficulty distribution:`);
  Object.entries(diffDist).forEach(([d,c])=>console.log(`  ${d}: ${c} (${((c/QS.length)*100).toFixed(1)}%)`));

  let inserted = 0;
  let skipped = 0;
  const batchSize = 25;

  for (let i = 0; i < QS.length; i += batchSize) {
    const batch = QS.slice(i, i + batchSize);
    const values: string[] = [];
    const params: any[] = [];
    let idx = 1;

    for (const q of batch) {
      const stemHash = hash(q.stem);
      values.push(`($${idx},$${idx+1},$${idx+2},$${idx+3},$${idx+4},$${idx+5}::jsonb,$${idx+6}::jsonb,$${idx+7},$${idx+8}::integer,$${idx+9},$${idx+10},$${idx+11},$${idx+12},$${idx+13},$${idx+14},$${idx+15}::jsonb)`);
      params.push(
        q.tier, q.exam, "multiple_choice", "published",
        q.stem, JSON.stringify(q.options), JSON.stringify([q.correct]),
        q.rationale, q.diff, q.bs, q.topic, "BOTH", stemHash,
        q.cp, q.es, JSON.stringify(q.dr)
      );
      idx += 16;
    }

    const sql = `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, body_system, topic, region_scope, stem_hash, clinical_pearl, exam_strategy, distractor_rationales)
                 SELECT v.* FROM (VALUES ${values.join(",")}) AS v(tier,exam,question_type,status,stem,options,correct_answer,rationale,difficulty,body_system,topic,region_scope,stem_hash,clinical_pearl,exam_strategy,distractor_rationales)
                 WHERE NOT EXISTS (SELECT 1 FROM exam_questions e WHERE e.stem_hash = v.stem_hash)`;
    const result = await pool.query(sql, params);
    const batchInserted = result.rowCount || 0;
    inserted += batchInserted;
    skipped += batch.length - batchInserted;
  }

  console.log(`\n[RPN-B10] Results: Inserted ${inserted}, Skipped duplicates ${skipped}, Total attempted ${QS.length}`);

  const totalQ = await pool.query(`SELECT count(*) as cnt FROM exam_questions WHERE tier='rpn'`);
  console.log(`\nTotal RPN questions in database: ${totalQ.rows[0].cnt}`);

  const bsDist = await pool.query(`SELECT body_system, count(*) as cnt FROM exam_questions WHERE tier='rpn' AND status='published' GROUP BY body_system ORDER BY cnt DESC`);
  console.log(`\nBody system distribution (published RPN):`);
  bsDist.rows.forEach((r: any) => console.log(`  ${r.body_system}: ${r.cnt}`));

  const topicQ = await pool.query(`SELECT topic, count(*) as cnt FROM exam_questions WHERE tier='rpn' AND status='published' AND topic IS NOT NULL GROUP BY topic ORDER BY topic`);
  console.log(`\nTopic distribution (published RPN):`);
  topicQ.rows.forEach((r: any) => console.log(`  ${r.topic}: ${r.cnt}`));

  const diffQ = await pool.query(`SELECT difficulty, count(*) as cnt FROM exam_questions WHERE tier='rpn' AND status='published' GROUP BY difficulty ORDER BY difficulty`);
  console.log(`\nDifficulty distribution (published RPN):`);
  diffQ.rows.forEach((r: any) => console.log(`  Level ${r.difficulty}: ${r.cnt}`));

  await pool.end();
  console.log(`\n[RPN-B10] Complete.`);
}

main().catch(e => { console.error(e); process.exit(1); });
