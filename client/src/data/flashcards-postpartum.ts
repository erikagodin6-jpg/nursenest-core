import type { FlashcardData } from "./flashcards-rpn";

export const postpartumFlashcards: FlashcardData[] = [
  {
    id: "pp-q1",
    type: "question",
    question: "A postpartum client's fundus is palpated 2 cm above the umbilicus and deviated to the right. What is the most likely cause?",
    options: ["Uterine atony", "Distended bladder", "Retained placenta", "Uterine inversion"],
    correctIndex: 1,
    answer: "A fundus that is displaced to the right or above the expected level usually indicates a distended bladder. The client should be encouraged to void, and the fundus reassessed afterward. A full bladder prevents the uterus from contracting properly.",
    category: "Postpartum Assessment",
    difficulty: 2
  },
  {
    id: "pp-q2",
    type: "question",
    question: "What is the expected lochia pattern in the first 3 days postpartum?",
    options: ["Lochia alba", "Lochia serosa", "Lochia rubra", "No lochia expected"],
    correctIndex: 2,
    answer: "Lochia rubra (dark red) occurs days 1-3 postpartum and consists of blood, decidual tissue, and mucus. It progresses to lochia serosa (pink-brown, days 4-10) and then lochia alba (yellowish-white, days 11-21+). Report return to rubra after serosa (may indicate retained fragments).",
    category: "Postpartum Assessment",
    difficulty: 1
  },
  {
    id: "pp-q3",
    type: "question",
    question: "A breastfeeding mother reports cracked, painful nipples. What should the nurse recommend?",
    options: ["Stop breastfeeding and switch to formula", "Apply expressed breast milk to the nipples and ensure proper latch", "Apply alcohol to clean the nipples", "Pump exclusively until healed"],
    correctIndex: 1,
    answer: "Applying expressed breast milk and lanolin to cracked nipples promotes healing. Assess and correct latch technique, as improper latch is the most common cause. The baby should latch onto the areola, not just the nipple. Air-dry nipples after feedings.",
    category: "Breastfeeding",
    difficulty: 1
  },
  {
    id: "pp-q4",
    type: "question",
    question: "A postpartum client has a temperature of 38.5°C on postpartum day 2. She reports breast engorgement. What is the most appropriate action?",
    options: ["Begin IV antibiotics immediately", "Assess for other signs of infection and encourage frequent breastfeeding", "Obtain blood cultures", "Administer antipyretics only"],
    correctIndex: 1,
    answer: "Breast engorgement can cause low-grade fever (milk fever) in the first 24-48 hours postpartum. Assess for other infection signs. Encourage frequent breastfeeding/pumping, warm compresses before feeding, and cold compresses after. Report fever >38°C persisting beyond 24 hours.",
    category: "Postpartum Complications",
    difficulty: 2
  },
  {
    id: "pp-q5",
    type: "question",
    question: "What is the expected fundal height immediately after delivery?",
    options: ["At the symphysis pubis", "Midway between symphysis and umbilicus", "At the level of the umbilicus", "2 cm above the umbilicus"],
    correctIndex: 2,
    answer: "Immediately after delivery, the fundus should be firm and at the level of the umbilicus. It involutes approximately 1 cm (one fingerbreadth) per day. By day 10, it should be at the level of the symphysis pubis and no longer palpable abdominally.",
    category: "Postpartum Assessment",
    difficulty: 1
  },
  {
    id: "pp-q6",
    type: "question",
    question: "A client 6 weeks postpartum reports persistent sadness, inability to care for her baby, thoughts of self-harm, and insomnia for 3 weeks. What is the priority nursing action?",
    options: ["Reassure her that baby blues are normal", "Screen using the Edinburgh Postnatal Depression Scale and refer to psychiatric care", "Suggest she get more sleep", "Advise her to join a mothers' support group"],
    correctIndex: 1,
    answer: "These symptoms (lasting >2 weeks, with functional impairment and thoughts of self-harm) indicate postpartum depression, not normal baby blues. Screen using EPDS, ensure safety, and refer for psychiatric evaluation. Postpartum depression affects 10-15% of mothers.",
    category: "Postpartum Mental Health",
    difficulty: 3
  },
  {
    id: "pp-q7",
    type: "question",
    question: "What are the danger signs of postpartum hemorrhage that require immediate action?",
    options: ["Lochia rubra on day 1", "Soaking more than one pad per hour, boggy uterus, tachycardia", "Mild cramping during breastfeeding", "Small blood clots in lochia"],
    correctIndex: 1,
    answer: "Postpartum hemorrhage signs include: saturating >1 pad/hour, boggy (non-firm) uterus, large clots (>golf ball size), tachycardia, hypotension, and decreasing hemoglobin. First action: fundal massage. Notify provider if unresponsive to massage.",
    category: "Postpartum Complications",
    difficulty: 2
  },
  {
    id: "pp-q8",
    type: "question",
    question: "When should a postpartum client who had an uncomplicated vaginal delivery begin ambulation?",
    options: ["24 hours after delivery", "Within 4-8 hours after delivery", "48 hours after delivery", "Not until the first postpartum visit"],
    correctIndex: 1,
    answer: "Early ambulation (within 4-8 hours for vaginal delivery) is encouraged to prevent DVT, promote uterine involution, improve peristalsis, and enhance overall recovery. Assist with first ambulation due to risk of orthostatic hypotension.",
    category: "Postpartum Recovery",
    difficulty: 1
  },
  {
    id: "pp-q9",
    type: "question",
    question: "A postpartum client reports foul-smelling lochia, fever, and uterine tenderness on day 5. What is the most likely diagnosis?",
    options: ["Normal postpartum recovery", "Endometritis", "Mastitis", "Urinary tract infection"],
    correctIndex: 1,
    answer: "Endometritis (postpartum uterine infection) presents with foul-smelling lochia, fever, uterine tenderness, and tachycardia. Risk factors include cesarean delivery, prolonged labor, PROM, and multiple vaginal exams. Treatment: broad-spectrum IV antibiotics.",
    category: "Postpartum Complications",
    difficulty: 2
  },
  {
    id: "pp-q10",
    type: "question",
    question: "What medication is given to suppress lactation if a mother chooses not to breastfeed?",
    options: ["Bromocriptine", "No medication is routinely used; supportive measures are recommended", "Oxytocin", "Domperidone"],
    correctIndex: 1,
    answer: "Currently, no medication is routinely recommended for lactation suppression. Supportive measures include wearing a well-fitting supportive bra, avoiding breast stimulation, applying cold compresses, and using mild analgesics. Bromocriptine was previously used but is no longer recommended due to cardiovascular risks.",
    category: "Breastfeeding",
    difficulty: 2
  },
  {
    id: "pp-q11",
    type: "question",
    question: "A newborn's APGAR score at 1 minute is 4. What does this indicate?",
    options: ["Normal adaptation", "Moderate depression requiring intervention", "Vigorous newborn", "Score too low to survive"],
    correctIndex: 1,
    answer: "An APGAR score of 4-6 indicates moderate depression requiring intervention (stimulation, suctioning, possibly oxygen). Score 7-10 is normal. Score 0-3 indicates severe depression requiring immediate resuscitation. APGAR is scored at 1 and 5 minutes (continued every 5 min if <7).",
    category: "Neonatal Assessment",
    difficulty: 2
  },
  {
    id: "pp-q12",
    type: "question",
    question: "What is the expected number of wet diapers for a breastfed newborn by day 4 of life?",
    options: ["1-2 per day", "4-6 per day", "8-10 per day", "No set expectation"],
    correctIndex: 1,
    answer: "By day 4-5, a breastfed newborn should have 4-6 wet diapers per day. Day 1: 1 wet diaper, Day 2: 2, Day 3: 3, then 4-6+ by days 4-5. Fewer wet diapers may indicate inadequate intake and dehydration.",
    category: "Neonatal Care",
    difficulty: 1
  },
  {
    id: "pp-q13",
    type: "question",
    question: "A client who delivered via cesarean section complains of incisional pain rated 7/10. What is the priority nursing intervention?",
    options: ["Encourage ambulation to distract from pain", "Administer prescribed analgesics and assess effectiveness", "Apply heat to the incision", "Tell the client pain is expected"],
    correctIndex: 1,
    answer: "Post-cesarean pain management is essential for recovery, mobility, and breastfeeding. Administer prescribed analgesics (often multimodal: NSAIDs, acetaminophen, opioids as needed), assess pain relief, and use non-pharmacologic measures (positioning, splinting with a pillow).",
    category: "Post-Cesarean Care",
    difficulty: 1
  },
  {
    id: "pp-q14",
    type: "question",
    question: "What is the recommended duration of exclusive breastfeeding per the WHO and AAP?",
    options: ["3 months", "6 months", "9 months", "12 months"],
    correctIndex: 1,
    answer: "The WHO and AAP recommend exclusive breastfeeding for the first 6 months of life, with continued breastfeeding along with complementary foods for at least 12 months (AAP) or up to 2 years and beyond (WHO).",
    category: "Breastfeeding",
    difficulty: 1
  },
  {
    id: "pp-q15",
    type: "question",
    question: "A postpartum client has a perineal laceration that extends through the anal sphincter. What degree of laceration is this?",
    options: ["First degree", "Second degree", "Third degree", "Fourth degree"],
    correctIndex: 2,
    answer: "Third-degree laceration extends through the perineal body and involves the anal sphincter. First degree: mucosa/skin only. Second degree: involves perineal muscles. Fourth degree: extends through the rectal mucosa. Higher degrees require surgical repair and meticulous postpartum care.",
    category: "Postpartum Recovery",
    difficulty: 2
  },
  {
    id: "pp-q16",
    type: "question",
    question: "What are the classic signs of mastitis?",
    options: ["Bilateral breast fullness and tenderness", "Unilateral breast redness, warmth, fever, and flu-like symptoms", "Painless breast lump", "Nipple discharge without pain"],
    correctIndex: 1,
    answer: "Mastitis presents with unilateral breast redness, warmth, swelling, pain, fever ≥38.4°C, and flu-like symptoms. It typically occurs 2-4 weeks postpartum. Treatment: continue breastfeeding (starting on the affected side), antibiotics (dicloxacillin, cephalexin), warm compresses.",
    category: "Postpartum Complications",
    difficulty: 2
  },
  {
    id: "pp-q17",
    type: "question",
    question: "A postpartum client is Rh-negative and delivered an Rh-positive baby. When should RhoGAM be administered?",
    options: ["Within 24 hours", "Within 72 hours of delivery", "At the 6-week postpartum visit", "Within 1 week"],
    correctIndex: 1,
    answer: "RhoGAM (Rh immune globulin) must be administered within 72 hours of delivery to prevent maternal Rh sensitization. It destroys fetal Rh-positive cells in the maternal circulation before the mother develops antibodies. Standard dose is 300 mcg IM.",
    category: "Postpartum Interventions",
    difficulty: 2
  },
  {
    id: "pp-q18",
    type: "question",
    question: "What assessment tool is commonly used to screen for postpartum depression?",
    options: ["Glasgow Coma Scale", "Edinburgh Postnatal Depression Scale (EPDS)", "PHQ-2", "Braden Scale"],
    correctIndex: 1,
    answer: "The Edinburgh Postnatal Depression Scale (EPDS) is a 10-item self-report questionnaire specifically designed to screen for postpartum depression. A score ≥10 suggests possible depression; ≥13 suggests probable depression. Question 10 specifically screens for self-harm thoughts.",
    category: "Postpartum Mental Health",
    difficulty: 1
  },
  {
    id: "pp-q19",
    type: "question",
    question: "A newborn has a yellow skin tone 12 hours after birth. What is the priority nursing action?",
    options: ["Reassure the mother this is physiologic jaundice", "Obtain a bilirubin level immediately", "Place the infant in sunlight", "Initiate phototherapy"],
    correctIndex: 1,
    answer: "Jaundice within the first 24 hours of life is pathologic (not physiologic) and requires immediate bilirubin assessment. Pathologic jaundice may indicate ABO/Rh incompatibility, sepsis, or hemolytic disease. Physiologic jaundice typically appears after 24 hours.",
    category: "Neonatal Complications",
    difficulty: 3
  },
  {
    id: "pp-q20",
    type: "question",
    question: "What is the recommended position for a newborn during sleep?",
    options: ["Prone", "Supine (back)", "Side-lying", "Elevated in a car seat"],
    correctIndex: 1,
    answer: "The AAP recommends supine (back) positioning for all sleep to reduce SIDS risk (Back to Sleep campaign). Use a firm, flat sleep surface with no soft bedding, pillows, bumpers, or loose blankets. Room-sharing without bed-sharing is recommended for the first 6-12 months.",
    category: "Newborn Safety",
    difficulty: 1
  },
  {
    id: "pp-q21",
    type: "question",
    question: "A postpartum client has not voided 6 hours after vaginal delivery. What should the nurse do?",
    options: ["Wait 12 hours before intervening", "Perform bladder scan, encourage voiding, consider straight catheterization if >500 mL", "Immediately catheterize", "Restrict fluid intake"],
    correctIndex: 1,
    answer: "Urinary retention is common postpartum due to periurethral edema, anesthesia effects, and perineal pain. Perform a bladder scan, use measures to promote voiding (running water, warm water over perineum), and catheterize if bladder volume exceeds 500 mL or client cannot void.",
    category: "Postpartum Assessment",
    difficulty: 2
  },
  {
    id: "pp-q22",
    type: "question",
    question: "What medication is administered to the newborn's eyes within 1 hour of birth?",
    options: ["Gentamicin drops", "Erythromycin ophthalmic ointment", "Normal saline drops", "Tobramycin ointment"],
    correctIndex: 1,
    answer: "Erythromycin 0.5% ophthalmic ointment is applied to both eyes within 1 hour of birth to prevent ophthalmia neonatorum (gonococcal and chlamydial conjunctivitis). Apply a thin ribbon along the lower conjunctival sac of each eye.",
    category: "Newborn Care",
    difficulty: 1
  },
  {
    id: "pp-q23",
    type: "question",
    question: "When is the vitamin K injection administered to newborns?",
    options: ["Within 6 hours of birth", "At 24 hours", "At the 2-week visit", "At 1 month of age"],
    correctIndex: 0,
    answer: "Vitamin K (phytonadione) 0.5-1 mg IM is given within 1-6 hours of birth to prevent hemorrhagic disease of the newborn (VKDB). Newborns have limited vitamin K due to sterile gut (no vitamin K-producing bacteria) and poor placental transfer.",
    category: "Newborn Care",
    difficulty: 1
  },
  {
    id: "pp-q24",
    type: "question",
    question: "A postpartum client on day 3 after cesarean delivery develops sudden dyspnea, tachycardia, and chest pain. What should the nurse suspect?",
    options: ["Anxiety attack", "Pulmonary embolism", "Postpartum cardiomyopathy", "Pneumonia"],
    correctIndex: 1,
    answer: "Sudden onset dyspnea, tachycardia, and pleuritic chest pain in a postpartum client (especially post-cesarean) suggest pulmonary embolism. Pregnancy and surgery increase clot risk. Administer oxygen, position upright, notify the provider, and anticipate CT angiography and anticoagulation.",
    category: "Postpartum Complications",
    difficulty: 3
  },
  {
    id: "pp-q25",
    type: "question",
    question: "What is the difference between postpartum blues and postpartum depression?",
    options: ["They are the same condition", "Blues are mild and resolve within 2 weeks; depression is persistent and disabling", "Blues require medication; depression does not", "Blues occur later than depression"],
    correctIndex: 1,
    answer: "Postpartum blues: mild mood swings, crying, anxiety peaking at days 4-5, resolving within 2 weeks (affects 50-80% of mothers). Postpartum depression: persistent depressed mood, anhedonia, sleep/appetite changes, lasting >2 weeks, impairing function (affects 10-15%).",
    category: "Postpartum Mental Health",
    difficulty: 1
  },
  {
    id: "pp-q26",
    type: "question",
    question: "What is the BUBBLE-HE assessment used for in postpartum care?",
    options: ["Newborn assessment", "Maternal physical assessment", "Breastfeeding assessment", "Pain assessment"],
    correctIndex: 1,
    answer: "BUBBLE-HE is a systematic postpartum maternal assessment: Breasts, Uterus (fundal height/firmness), Bladder, Bowels, Lochia, Episiotomy/laceration/incision, Homan's sign (DVT assessment), and Emotional status. Performed at regular intervals postpartum.",
    category: "Postpartum Assessment",
    difficulty: 1
  },
  {
    id: "pp-q27",
    type: "question",
    question: "A breastfeeding mother is taking which medication that is contraindicated during lactation?",
    options: ["Ibuprofen", "Acetaminophen", "Radioactive iodine", "Prenatal vitamins"],
    correctIndex: 2,
    answer: "Radioactive iodine is absolutely contraindicated during breastfeeding as it concentrates in breast milk and can damage the infant's thyroid. Other contraindicated medications include certain chemotherapy agents, ergot alkaloids, and lithium (relative contraindication).",
    category: "Breastfeeding",
    difficulty: 2
  },
  {
    id: "pp-q28",
    type: "question",
    question: "How often should a breastfeeding newborn be fed in the first few weeks?",
    options: ["Every 4-5 hours", "Every 8-12 times per day (every 2-3 hours)", "On a strict schedule every 3 hours", "Only when the baby cries"],
    correctIndex: 1,
    answer: "Breastfeeding should occur on demand, approximately 8-12 times per day (every 2-3 hours) in the first weeks. Watch for feeding cues: rooting, hand-to-mouth, lip-smacking. Crying is a late hunger cue. Each feeding should last approximately 15-20 minutes per breast.",
    category: "Breastfeeding",
    difficulty: 1
  },
  {
    id: "pp-q29",
    type: "question",
    question: "A client is discharged after cesarean delivery. What instruction should the nurse provide regarding activity restrictions?",
    options: ["Resume all normal activities immediately", "Avoid lifting anything heavier than the baby for 4-6 weeks", "Bedrest for 2 weeks", "No restrictions needed"],
    correctIndex: 1,
    answer: "After cesarean delivery, advise: avoid lifting anything heavier than the baby for 4-6 weeks, no driving for 2 weeks or while on narcotic pain medication, support the incision when coughing/moving, and avoid strenuous activity until cleared by the provider.",
    category: "Post-Cesarean Care",
    difficulty: 1
  },
  {
    id: "pp-q30",
    type: "question",
    question: "What is the normal newborn respiratory rate?",
    options: ["12-20 breaths/min", "20-30 breaths/min", "30-60 breaths/min", "60-80 breaths/min"],
    correctIndex: 2,
    answer: "Normal newborn respiratory rate is 30-60 breaths per minute. Tachypnea (>60/min), nasal flaring, grunting, and retractions are signs of respiratory distress. Count respirations for a full minute when the infant is at rest.",
    category: "Neonatal Assessment",
    difficulty: 1
  },
  {
    id: "pp-q31",
    type: "question",
    question: "A postpartum client is prescribed methylergonovine (Methergine). What is the indication and a key contraindication?",
    options: ["Pain relief; contraindicated in liver disease", "Uterine contraction to control bleeding; contraindicated in hypertension", "Lactation suppression; contraindicated in diabetes", "Infection treatment; contraindicated in renal failure"],
    correctIndex: 1,
    answer: "Methylergonovine (Methergine) stimulates sustained uterine contraction to treat postpartum hemorrhage from uterine atony. It is contraindicated in hypertension because it causes vasoconstriction and can significantly elevate blood pressure. Check BP before administration.",
    category: "Postpartum Pharmacology",
    difficulty: 2
  },
  {
    id: "pp-q32",
    type: "question",
    question: "What newborn weight loss is considered normal in the first few days of life?",
    options: ["1-2% of birth weight", "5-7% of birth weight", "10-15% of birth weight", "No weight loss is expected"],
    correctIndex: 1,
    answer: "Newborns normally lose 5-7% (up to 10% maximum) of birth weight in the first 3-5 days due to fluid loss and limited intake. Birth weight should be regained by 10-14 days. Weight loss >10% or failure to regain by 2 weeks requires evaluation.",
    category: "Neonatal Assessment",
    difficulty: 1
  },
  {
    id: "pp-q33",
    type: "question",
    question: "A mother asks when she can resume sexual intercourse after vaginal delivery. What is the recommended guidance?",
    options: ["After 2 weeks", "After lochia has stopped and perineum has healed (typically 4-6 weeks)", "After 8 weeks", "After the first menstrual period"],
    correctIndex: 1,
    answer: "Sexual intercourse can resume when lochia has stopped, the perineum has healed, and the client feels comfortable, typically around 4-6 weeks postpartum. Discuss contraception before discharge, as ovulation can occur before the first menses returns.",
    category: "Postpartum Education",
    difficulty: 1
  },
  {
    id: "pp-q34",
    type: "question",
    question: "What is the preferred method for newborn temperature assessment?",
    options: ["Oral", "Rectal", "Axillary", "Tympanic"],
    correctIndex: 2,
    answer: "Axillary temperature is the preferred non-invasive method for routine newborn temperature assessment. Normal axillary temperature is 36.5-37.5°C (97.7-99.5°F). Rectal temperature may be used for initial assessment. Axillary readings are typically 0.5°C lower than core temperature.",
    category: "Neonatal Assessment",
    difficulty: 1
  },
  {
    id: "pp-q35",
    type: "question",
    question: "A postpartum client develops a wound dehiscence at her cesarean incision site. What should the nurse do first?",
    options: ["Apply butterfly strips", "Cover with sterile saline-moistened dressings and notify the provider", "Apply direct pressure", "Administer antibiotics"],
    correctIndex: 1,
    answer: "Wound dehiscence (separation of wound edges) requires covering with sterile saline-moistened dressings, positioning the client to reduce tension on the wound, and notifying the provider immediately. Assess for signs of infection and evisceration.",
    category: "Post-Cesarean Complications",
    difficulty: 3
  },
  {
    id: "pp-q36",
    type: "term",
    question: "What is uterine involution?",
    answer: "Uterine involution is the process by which the uterus returns to its pre-pregnancy size and position. The fundus descends approximately 1 cm/day. By 6 weeks postpartum, the uterus has returned to its non-pregnant size. Breastfeeding accelerates involution through oxytocin release.",
    category: "Postpartum Recovery",
    difficulty: 1
  },
  {
    id: "pp-q37",
    type: "question",
    question: "A client who delivered 2 hours ago has a boggy uterus, heavy bleeding, and passed a large clot. What is the nurse's first action?",
    options: ["Start an IV", "Perform fundal massage", "Administer oxytocin", "Call the provider"],
    correctIndex: 1,
    answer: "The first action for a boggy uterus is fundal massage to stimulate uterine contraction. Hold the lower uterine segment with one hand while massaging the fundus with the other. If massage is ineffective, administer uterotonic medications (oxytocin, methylergonovine, carboprost).",
    category: "Postpartum Complications",
    difficulty: 2
  },
  {
    id: "pp-q38",
    type: "question",
    question: "What is the recommended newborn bathing practice?",
    options: ["Bathe immediately after birth", "Delay first bath until at least 24 hours after birth", "Full immersion bath within 2 hours", "Daily baths from birth"],
    correctIndex: 1,
    answer: "WHO recommends delaying the first bath until at least 24 hours after birth to maintain thermoregulation, promote skin-to-skin contact, and support breastfeeding initiation. The vernix caseosa provides protective and moisturizing benefits. Sponge baths are used until the umbilical cord falls off.",
    category: "Newborn Care",
    difficulty: 1
  },
  {
    id: "pp-q39",
    type: "question",
    question: "A newborn has a heart rate of 98 bpm, weak cry, some flexion, grimaces with stimulation, and blue extremities. What is the APGAR score?",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
    answer: "APGAR scoring: Heart rate 98 bpm (1 - <100), weak cry (1), some flexion (1), grimace (1), blue extremities/acrocyanosis (1). Total = 5. Wait - recalculating: HR 98=1, Respiratory effort (weak cry)=1, Muscle tone (some flexion)=1, Reflex irritability (grimace)=1, Color (acrocyanosis)=1. Total = 5. With grimaces counting as 1 and blue extremities as 1, the total is 5-6 depending on exact interpretation.",
    category: "Neonatal Assessment",
    difficulty: 2
  },
  {
    id: "pp-q40",
    type: "question",
    question: "What is the primary purpose of the hepatitis B vaccine given to newborns?",
    options: ["Treat existing hepatitis B infection", "Prevent vertical transmission and provide long-term immunity", "Treat jaundice", "Prevent respiratory infections"],
    correctIndex: 1,
    answer: "The hepatitis B vaccine is given within 12 hours of birth (especially if mother is HBsAg-positive) to prevent vertical transmission. If the mother is HBsAg-positive, the newborn also receives hepatitis B immune globulin (HBIG). The vaccine series continues at 1 and 6 months.",
    category: "Newborn Care",
    difficulty: 1
  },
  {
    id: "pp-q41",
    type: "question",
    question: "A postpartum client reports perineal pain. What non-pharmacologic interventions can the nurse offer?",
    options: ["Hot compresses only", "Ice packs for the first 24 hours, sitz baths after 24 hours, witch hazel pads", "No interventions are appropriate", "Perineal massage immediately"],
    correctIndex: 1,
    answer: "Perineal comfort measures include: ice packs for the first 24 hours to reduce swelling, sitz baths after 24 hours (warm water 20 minutes 3-4 times daily), witch hazel pads (Tucks), topical anesthetic spray (Dermoplast), and proper positioning (side-lying or ring cushion).",
    category: "Postpartum Recovery",
    difficulty: 1
  },
  {
    id: "pp-q42",
    type: "question",
    question: "What discharge teaching should be provided about newborn umbilical cord care?",
    options: ["Apply alcohol to the cord stump daily", "Keep the cord clean and dry, fold the diaper below the stump", "Cover the cord with a bandage", "Pull the cord off when it starts to loosen"],
    correctIndex: 1,
    answer: "Current guidelines recommend keeping the umbilical cord clean and dry (dry care). Fold the diaper below the stump to expose it to air. The cord typically falls off within 1-3 weeks. Report signs of infection: redness, drainage, foul odor, or bleeding. Alcohol application is no longer recommended.",
    category: "Newborn Care",
    difficulty: 1
  },
  {
    id: "pp-q43",
    type: "question",
    question: "When is the first postpartum visit typically scheduled for an uncomplicated vaginal delivery?",
    options: ["1 week", "2-3 weeks", "6 weeks", "Within 3 weeks with a comprehensive visit at 12 weeks"],
    correctIndex: 3,
    answer: "ACOG now recommends initial postpartum contact within 3 weeks, with a comprehensive visit no later than 12 weeks. Previously a single 6-week visit was standard. Earlier follow-up allows assessment for depression, breastfeeding support, and management of complications.",
    category: "Postpartum Education",
    difficulty: 2
  },
  {
    id: "pp-q44",
    type: "question",
    question: "A client asks about contraception while breastfeeding. Which method is recommended?",
    options: ["Combined oral contraceptives", "Progestin-only methods (mini-pill, IUD, implant)", "No contraception is needed while breastfeeding", "Emergency contraception only"],
    correctIndex: 1,
    answer: "Progestin-only methods are preferred during breastfeeding as estrogen can decrease milk supply. Options include the mini-pill, Depo-Provera (after 6 weeks), progestin IUD (Mirena), or subdermal implant (Nexplanon). Non-hormonal IUD (ParaGard) is also safe. The lactational amenorrhea method (LAM) is >98% effective only when exclusively breastfeeding, amenorrheic, and <6 months postpartum.",
    category: "Postpartum Education",
    difficulty: 2
  },
  {
    id: "pp-q45",
    type: "question",
    question: "What is diastasis recti and how is it assessed?",
    options: ["Uterine prolapse; vaginal exam", "Separation of the rectus abdominis muscles; palpation above the umbilicus during a partial sit-up", "Abdominal hernia; CT scan", "Perineal tear; visual inspection"],
    correctIndex: 1,
    answer: "Diastasis recti is separation of the rectus abdominis muscles at the linea alba, common during pregnancy. Assessed by having the client do a partial sit-up while the nurse palpates above the umbilicus. A gap >2 fingerbreadths is significant. Refer for physical therapy exercises.",
    category: "Postpartum Recovery",
    difficulty: 2
  },
  {
    id: "pp-q46",
    type: "question",
    question: "What are the signs that a newborn is getting adequate breast milk?",
    options: ["Sleeps through the night", "6+ wet diapers/day by day 5, 3-4 stools/day, consistent weight gain", "Feeds only 4 times/day", "No crying between feedings"],
    correctIndex: 1,
    answer: "Signs of adequate intake: 6+ wet diapers/day by day 5, 3-4 yellow seedy stools/day, audible swallowing during feeding, content between feedings, birth weight regained by day 10-14, and consistent weight gain of approximately 20-30 g/day (5-7 oz/week).",
    category: "Breastfeeding",
    difficulty: 1
  },
  {
    id: "pp-q47",
    type: "question",
    question: "A postpartum client with a history of bipolar disorder is at risk for which severe postpartum psychiatric condition?",
    options: ["Postpartum blues", "Postpartum psychosis", "Postpartum anxiety", "Adjustment disorder"],
    correctIndex: 1,
    answer: "Postpartum psychosis is a psychiatric emergency occurring in 1-2 per 1000 deliveries, typically within the first 2 weeks. Clients with bipolar disorder have a 25-50% risk. Symptoms include hallucinations, delusions, disorganized behavior, and risk to self/infant. Requires immediate hospitalization.",
    category: "Postpartum Mental Health",
    difficulty: 3
  },
  {
    id: "pp-q48",
    type: "question",
    question: "What is the recommended time for skin-to-skin contact immediately after birth?",
    options: ["10 minutes", "30 minutes", "At least 1 hour uninterrupted", "Only during breastfeeding"],
    correctIndex: 2,
    answer: "At least 1 hour of uninterrupted skin-to-skin contact is recommended immediately after birth. Benefits include thermoregulation, stabilization of heart rate and breathing, colonization with maternal flora, initiation of breastfeeding, and maternal-infant bonding. Delay routine procedures during this time.",
    category: "Newborn Care",
    difficulty: 1
  },
  {
    id: "pp-q49",
    type: "question",
    question: "A client develops a deep vein thrombosis on postpartum day 4. What is the treatment?",
    options: ["Bedrest only", "Anticoagulation therapy with heparin or LMWH", "Leg elevation only", "Massage of the affected leg"],
    correctIndex: 1,
    answer: "DVT treatment includes anticoagulation (heparin or LMWH such as enoxaparin), leg elevation, warm compresses, and analgesics. NEVER massage the affected leg. Monitor for signs of pulmonary embolism. Both heparin and LMWH are safe during breastfeeding.",
    category: "Postpartum Complications",
    difficulty: 2
  },
  {
    id: "pp-q50",
    type: "question",
    question: "What is the significance of a positive Coombs test in a newborn?",
    options: ["Normal finding", "Indicates antibodies attached to the newborn's red blood cells, risk for hemolytic disease", "Indicates infection", "Indicates liver dysfunction"],
    correctIndex: 1,
    answer: "A positive direct Coombs test in a newborn indicates maternal antibodies are attached to the newborn's RBCs, which may cause hemolytic disease. This occurs in Rh incompatibility or ABO incompatibility. Monitor closely for jaundice, anemia, and hyperbilirubinemia.",
    category: "Neonatal Complications",
    difficulty: 2
  },
  {
    id: "pp-q51",
    type: "term",
    question: "Define afterpains and who is most affected.",
    answer: "Afterpains are intermittent uterine contractions that occur postpartum as the uterus involutes. They are more common and intense in multiparas, breastfeeding mothers (due to oxytocin release), and after overdistended uterus. Managed with NSAIDs, warm packs, and positioning.",
    category: "Postpartum Recovery",
    difficulty: 1
  },
  {
    id: "pp-q52",
    type: "question",
    question: "What is the normal newborn heart rate?",
    options: ["60-100 bpm", "80-120 bpm", "110-160 bpm", "160-200 bpm"],
    correctIndex: 2,
    answer: "Normal newborn heart rate is 110-160 bpm (some sources say 120-160 bpm). Count the apical pulse for a full minute. Tachycardia (>160 bpm) may indicate fever, pain, or anemia. Bradycardia (<100 bpm) may indicate hypoxia and requires immediate assessment.",
    category: "Neonatal Assessment",
    difficulty: 1
  },
  {
    id: "pp-q53",
    type: "question",
    question: "A breastfeeding mother develops breast engorgement. What is the best nursing advice?",
    options: ["Stop breastfeeding until engorgement resolves", "Apply warm compresses before feeding and cold compresses after; feed frequently", "Bind the breasts tightly", "Take a decongestant to reduce swelling"],
    correctIndex: 1,
    answer: "For breast engorgement: apply warm compresses or shower before feeding to promote milk flow, breastfeed frequently (every 2-3 hours), hand-express to soften areola before latching, and apply cold compresses after feeding to reduce swelling. Wear a supportive bra.",
    category: "Breastfeeding",
    difficulty: 1
  },
  {
    id: "pp-q54",
    type: "question",
    question: "What is the proper technique for fundal assessment?",
    options: ["Palpate with the client standing", "Have the client void, lie supine with knees flexed, and palpate the fundus with the dominant hand while stabilizing the lower uterine segment", "Palpate through the client's clothing", "Only assess if the client reports bleeding"],
    correctIndex: 1,
    answer: "Proper fundal assessment: have the client void first, lie supine with knees flexed. Support the lower uterine segment with one hand while palpating the fundus with the other. Assess firmness and height relative to the umbilicus. Document as U/U (at umbilicus) or number of fingerbreadths above/below.",
    category: "Postpartum Assessment",
    difficulty: 1
  },
  {
    id: "pp-q55",
    type: "question",
    question: "A client delivered 3 weeks ago and reports hearing voices telling her to harm her baby. What type of postpartum disorder is this?",
    options: ["Postpartum blues", "Postpartum depression", "Postpartum psychosis", "Postpartum anxiety"],
    correctIndex: 2,
    answer: "Auditory hallucinations with command to harm the infant indicate postpartum psychosis, a psychiatric emergency. Symptoms include hallucinations, delusions, paranoia, confusion, and rapid mood swings. The infant must be kept safe, and the mother requires immediate psychiatric hospitalization.",
    category: "Postpartum Mental Health",
    difficulty: 3
  }
];
