import type { LessonContent } from "./types";

const postpartumAssessment: LessonContent = {
  title: "Comprehensive Postpartum Assessment",
  cellular: {
    title: "Fourth Trimester Physiology",
    content: "The postpartum period (puerperium) encompasses the first 6 weeks after delivery, during which the maternal body undergoes dramatic physiological changes to return to its pre-pregnant state. Systematic postpartum assessment uses the BUBBLE-HE framework: Breasts (engorgement, nipple integrity, colostrum/milk production), Uterus (fundal height, consistency, position), Bladder (voiding, distension, retention), Bowel (function, hemorrhoids, episiotomy), Lochia (type, amount, odor, clots), Episiotomy/perineum (REEDA: Redness, Edema, Ecchymosis, Discharge, Approximation), Homan's sign (DVT assessment), and Emotional status (bonding, mood, anxiety, signs of postpartum depression). Uterine involution is the process by which the uterus returns to its pre-pregnant size: immediately after delivery the fundus is at or just below the umbilicus; it descends approximately one fingerbreadth per day, becoming a pelvic organ by 10-14 days. Lochia progresses from rubra (red, days 1-3) to serosa (pinkish-brown, days 4-10) to alba (white/yellowish, days 10-14 to 6 weeks)."
  },
  signs: {
    left: [
      "BUBBLE-HE: Breasts, Uterus, Bladder, Bowel, Lochia, Episiotomy, Homan's, Emotional",
      "Fundus firm at or below umbilicus, midline, descending daily",
      "Lochia progression: rubra → serosa → alba",
      "Voiding adequate, no bladder distension",
      "Perineum REEDA assessment: healing without signs of infection"
    ],
    right: [
      "Boggy uterus: uterine atony, risk of hemorrhage",
      "Fundus displaced to one side: full bladder pushing uterus",
      "Return to lochia rubra after it had progressed: subinvolution, retained tissue",
      "Foul-smelling lochia: endometritis",
      "Inability to void: urinary retention from perineal edema or epidural effects"
    ]
  },
  medications: [
    { name: "Ibuprofen", type: "NSAID", action: "Reduces postpartum pain, inflammation, and uterine cramping (afterpains)", sideEffects: "GI upset, potential bleeding risk", contra: "Active bleeding, aspirin-sensitive asthma, renal impairment", pearl: "Preferred postpartum analgesic: effectively treats uterine cramping (afterpains) and perineal pain; schedule q6-8 hours for best effect" },
    { name: "Docusate Sodium (Colace)", type: "Stool softener", action: "Reduces straining with bowel movements to protect perineal repairs", sideEffects: "Mild GI cramping", contra: "Intestinal obstruction", pearl: "Routinely ordered postpartum to prevent straining with first bowel movement, especially after episiotomy or laceration repair" }
  ],
  pearls: [
    "BUBBLE-HE assessment should be performed systematically at each postpartum evaluation",
    "Fundus should be firm, midline, and at or below the umbilicus immediately postpartum",
    "If fundus is displaced laterally: assess bladder — full bladder displaces the uterus",
    "Lochia rubra >3 days or return to rubra after progression: evaluate for subinvolution or retained tissue",
    "Foul-smelling lochia + fever + uterine tenderness = endometritis until proven otherwise",
    "Afterpains (uterine cramping) are MORE intense in multiparous women and during breastfeeding",
    "Ice packs and sitz baths provide perineal comfort in the first 24-48 hours",
    "Emotional assessment at every visit: screen for postpartum depression, anxiety, and psychosis"
  ],
  quiz: [
    { question: "A postpartum patient's fundus is firm but palpated 2 cm to the right of midline. What is the most likely cause?", options: ["Uterine atony", "Distended bladder", "Retained placental fragments", "Normal finding"], correct: 1, rationale: "A distended bladder pushes the uterus to one side (usually to the right). The nurse should assist the patient to void and then reassess the fundal position." },
    { question: "On postpartum day 5, a patient has pinkish-brown, moderate lochia with no odor. What is this type?", options: ["Lochia rubra", "Lochia serosa", "Lochia alba", "Abnormal lochia"], correct: 1, rationale: "Lochia serosa (pinkish-brown, serous discharge) normally appears on days 4-10 postpartum as the uterine lining continues to heal." }
  ]
};

const breastfeedingSupport: LessonContent = {
  title: "Breastfeeding Support and Lactation",
  cellular: {
    title: "Lactation Physiology",
    content: "Lactation is a complex neuroendocrine process involving two key hormones: prolactin and oxytocin. During pregnancy, prolactin levels rise significantly but lactation is suppressed by high estrogen and progesterone levels from the placenta. After delivery of the placenta, the sudden drop in estrogen and progesterone allows prolactin to stimulate milk production in the alveolar cells of the mammary glands. Prolactin is released from the anterior pituitary in response to infant suckling (the prolactin reflex). Oxytocin is released from the posterior pituitary and causes contraction of myoepithelial cells surrounding the alveoli, ejecting milk into the ducts (the let-down or milk ejection reflex). Oxytocin release can be triggered by infant suckling, hearing the baby cry, or thinking about the baby, and can be inhibited by stress, pain, or fatigue. Colostrum (the first milk, produced days 1-3) is rich in immunoglobulins (especially secretory IgA), white blood cells, proteins, and fat-soluble vitamins. Transitional milk appears days 3-14, and mature milk by 2 weeks. Breast milk provides complete nutrition, passive immunity, and promotes maternal-infant bonding. Supply is determined by demand: frequent effective emptying stimulates continued production."
  },
  signs: {
    left: [
      "Proper latch: wide-open mouth, flanged lips, areola covered, no pain after initial latch",
      "Audible swallowing during feeding indicates effective milk transfer",
      "Adequate output: 6+ wet diapers and 3-4 stools per day by day 4",
      "Weight gain: regain birth weight by 10-14 days",
      "Breast softening after feeds indicates effective emptying"
    ],
    right: [
      "Engorgement: firm, painful, swollen breasts (days 3-5); warm compress before feeding, cold after",
      "Cracked or bleeding nipples: usually indicates poor latch — assess and correct",
      "Mastitis: localized breast redness, warmth, pain, fever, flu-like symptoms",
      "Insufficient milk supply: poor infant weight gain, decreased output",
      "Breast abscess: fluctuant mass requiring drainage"
    ]
  },
  medications: [
    { name: "Lanolin cream", type: "Nipple emollient", action: "Protects and moisturizes cracked, sore nipples", sideEffects: "Rare wool allergy", contra: "Wool/lanolin allergy", pearl: "Applied after each feeding; does NOT need to be removed before next feed (safe for infant)" },
    { name: "Dicloxacillin or Cephalexin", type: "Antibiotic", action: "Treats mastitis caused by Staphylococcus aureus", sideEffects: "GI upset, allergic reaction", contra: "Penicillin/cephalosporin allergy", pearl: "10-14 day course; patient should CONTINUE breastfeeding during treatment — emptying the breast is essential for resolution" }
  ],
  pearls: [
    "Breastfeeding is supply and demand: the more the baby feeds, the more milk is produced",
    "Skin-to-skin contact within the first hour after birth (golden hour) promotes breastfeeding initiation",
    "Proper latch is the foundation: asymmetric latch with more areola visible above the upper lip",
    "Feed on demand, typically every 2-3 hours (8-12 times per day) in the first weeks",
    "Mastitis: continue breastfeeding — emptying the breast is therapeutic; antibiotics + NSAIDs + rest",
    "Contraindications to breastfeeding: HIV (in developed countries), active herpes on breast, certain medications, infant galactosemia",
    "Alcohol: pump and dump is NOT necessary — wait 2 hours per drink before feeding",
    "Breastfeeding reduces maternal risk of breast cancer, ovarian cancer, type 2 diabetes, and cardiovascular disease"
  ],
  quiz: [
    { question: "A breastfeeding mother has a red, warm, painful area on her left breast with fever of 101°F. What is the diagnosis and management?", options: ["Engorgement: apply ice and stop breastfeeding", "Mastitis: antibiotics, continue breastfeeding, NSAIDs, rest", "Breast abscess: immediate surgery", "Normal breast changes: reassure and observe"], correct: 1, rationale: "Localized redness, warmth, pain, and fever indicate mastitis. Treatment includes antibiotics (usually dicloxacillin), continued breastfeeding (emptying the breast is therapeutic), NSAIDs for pain, and rest." },
    { question: "What hormone is responsible for the 'let-down' or milk ejection reflex?", options: ["Prolactin", "Estrogen", "Oxytocin", "Progesterone"], correct: 2, rationale: "Oxytocin, released from the posterior pituitary, causes contraction of myoepithelial cells around the alveoli, ejecting milk into the ducts. Prolactin stimulates milk production, but oxytocin causes milk ejection." }
  ]
};

const postpartumDepressionScreening: LessonContent = {
  title: "Postpartum Depression and Mood Disorders",
  cellular: {
    title: "Perinatal Mood Disorder Pathophysiology",
    content: "Perinatal mood and anxiety disorders (PMADs) encompass a spectrum of psychological conditions affecting women during pregnancy and the postpartum period. Postpartum 'baby blues' affects up to 80% of women: it is mild, transient (resolving by 2 weeks), and characterized by mood swings, tearfulness, irritability, and anxiety. Postpartum depression (PPD) affects 10-20% of women and involves persistent depressed mood, loss of interest, sleep disturbance (beyond normal newborn care disruption), changes in appetite, feelings of worthlessness or guilt, difficulty concentrating, and in severe cases, suicidal ideation. PPD can develop anytime in the first year postpartum. Postpartum anxiety, OCD, and PTSD (especially after traumatic birth) are increasingly recognized. Postpartum psychosis is the most severe and rare form (1-2 per 1000 births), typically presenting within the first 2 weeks with hallucinations, delusions, disorganized behavior, and rapid mood cycling. It is a psychiatric emergency due to risk of infanticide and suicide. The Edinburgh Postnatal Depression Scale (EPDS) is the standard screening tool: scores ≥10 suggest possible depression, and any positive response to question 10 (self-harm thoughts) requires immediate assessment. Risk factors include prior depression/anxiety, history of PPD, inadequate social support, stressful life events, birth complications, and hormonal sensitivity."
  },
  signs: {
    left: [
      "Baby blues: mood swings, tearfulness, anxiety, peaks day 3-5, resolves by 2 weeks",
      "PPD: persistent sadness, loss of interest, sleep/appetite changes, guilt, duration >2 weeks",
      "EPDS score ≥10: indicates need for further evaluation",
      "Postpartum anxiety: excessive worry, panic attacks, intrusive thoughts",
      "Screen ALL postpartum patients at discharge, 2-week, and 6-week visits"
    ],
    right: [
      "Postpartum psychosis: hallucinations, delusions, disorganized behavior — EMERGENCY",
      "Suicidal ideation: any positive self-harm screening requires immediate intervention",
      "Infanticidal ideation: risk of harm to infant in psychosis — psychiatric emergency",
      "Impaired bonding: inability to connect with or care for the newborn",
      "Untreated PPD: long-term effects on maternal-child relationship and child development"
    ]
  },
  medications: [
    { name: "Sertraline (Zoloft)", type: "SSRI antidepressant", action: "Inhibits serotonin reuptake, improving mood and reducing anxiety", sideEffects: "Nausea, insomnia, sexual dysfunction, headache", contra: "MAO inhibitor use, QT prolongation", pearl: "First-line SSRI for postpartum depression: low transfer to breast milk, well-studied in breastfeeding mothers" },
    { name: "Brexanolone (Zulresso)", type: "Neuroactive steroid (GABA-A modulator)", action: "First medication specifically approved for PPD; synthetic form of allopregnanolone", sideEffects: "Sedation, loss of consciousness, dizziness", contra: "Requires REMS program — only administered as 60-hour IV infusion in certified healthcare facilities", pearl: "FDA-approved specifically for PPD: works rapidly (within 48-60 hours) by restoring GABA-ergic signaling disrupted by the postpartum hormonal shift" }
  ],
  pearls: [
    "Screen ALL postpartum patients for depression using EPDS at every visit",
    "Baby blues ≠ PPD: blues resolve by 2 weeks; PPD persists and worsens without treatment",
    "Question 10 on EPDS (thoughts of self-harm): any positive response requires immediate safety assessment",
    "Postpartum psychosis is a PSYCHIATRIC EMERGENCY: onset typically within first 2 weeks postpartum",
    "Previous history of bipolar disorder significantly increases postpartum psychosis risk",
    "PPD can develop anytime in the first YEAR postpartum — not just the first few weeks",
    "SSRIs (sertraline preferred) are first-line treatment and compatible with breastfeeding",
    "Support, therapy (CBT/IPT), and medication are all effective treatments — often combined"
  ],
  quiz: [
    { question: "A patient at her 6-week postpartum visit scores 14 on the Edinburgh Postnatal Depression Scale and endorses question 10 (thoughts of self-harm). What is the priority action?", options: ["Schedule a follow-up in 2 weeks", "Perform an immediate safety assessment and refer for psychiatric evaluation", "Reassure her that baby blues are normal", "Suggest she get more sleep"], correct: 1, rationale: "An EPDS score ≥10 with a positive response to question 10 (self-harm thoughts) requires immediate safety assessment. This is not baby blues — this is postpartum depression with suicidal ideation requiring urgent psychiatric evaluation and intervention." },
    { question: "What distinguishes postpartum psychosis from postpartum depression?", options: ["Psychosis has later onset", "Psychosis includes hallucinations, delusions, and disorganized behavior", "Depression is more dangerous", "Psychosis only occurs in first-time mothers"], correct: 1, rationale: "Postpartum psychosis is characterized by hallucinations, delusions, disorganized thought and behavior, and rapid mood cycling. It is a psychiatric emergency due to risk of harm to self and infant. PPD involves depressed mood but not psychotic features." }
  ]
};

const newbornAssessment: LessonContent = {
  title: "Newborn Assessment and Transition",
  cellular: {
    title: "Neonatal Transition Physiology",
    content: "The transition from intrauterine to extrauterine life involves dramatic physiological changes in the first hours after birth. In utero, fetal circulation bypasses the lungs (foramen ovale, ductus arteriosus, ductus venosus) because the placenta performs gas exchange. At birth, the first breath inflates the lungs, dramatically reducing pulmonary vascular resistance. The increase in systemic vascular resistance (from clamping the umbilical cord) and decrease in pulmonary resistance reverses the pressure gradient across the foramen ovale, causing functional closure. Rising oxygen levels and falling prostaglandin levels trigger constriction and closure of the ductus arteriosus (within 24-48 hours). The ductus venosus closes when umbilical venous blood flow ceases. APGAR scoring at 1 and 5 minutes assesses five parameters (Appearance/color, Pulse, Grimace/reflex irritability, Activity/muscle tone, Respirations) each scored 0-2, total 0-10. Comprehensive newborn assessment includes vital signs (axillary temperature 36.5-37.5°C, HR 120-160 bpm, RR 30-60), gestational age assessment (Ballard score), weight, head-to-toe physical examination, and screening tests."
  },
  signs: {
    left: [
      "APGAR scoring at 1 and 5 minutes: Appearance, Pulse, Grimace, Activity, Respirations",
      "Normal vitals: T 36.5-37.5°C axillary, HR 120-160, RR 30-60",
      "Normal weight range: 2500-4000g (5.5-8.8 lbs) at term",
      "Head circumference 33-35 cm; proportionate to body",
      "Reflexes present: Moro, rooting, sucking, grasp, Babinski"
    ],
    right: [
      "Respiratory distress: tachypnea, grunting, flaring, retracting, cyanosis",
      "Hypothermia: axillary temp <36.5°C — increases oxygen consumption and hypoglycemia risk",
      "Hypoglycemia: jitteriness, poor feeding, lethargy, seizures",
      "Congenital anomalies: cardiac murmurs, cleft lip/palate, neural tube defects",
      "Birth injuries: cephalohematoma, caput succedaneum, brachial plexus injury"
    ]
  },
  medications: [
    { name: "Vitamin K (Phytonadione)", type: "Fat-soluble vitamin", action: "Prevents hemorrhagic disease of the newborn by activating clotting factors II, VII, IX, X", sideEffects: "Injection site pain, rare anaphylaxis", contra: "None for neonatal prophylaxis", pearl: "0.5-1 mg IM in the vastus lateralis within 1 hour of birth; newborns have sterile GI tract and cannot produce vitamin K" },
    { name: "Erythromycin ophthalmic ointment 0.5%", type: "Macrolide antibiotic", action: "Prevents ophthalmia neonatorum from Neisseria gonorrhoeae and Chlamydia trachomatis", sideEffects: "Transient blurred vision, mild irritation", contra: "Known macrolide allergy (extremely rare)", pearl: "Applied to both eyes within 1 hour of birth; delay slightly for skin-to-skin and eye contact during golden hour" },
    { name: "Hepatitis B Vaccine", type: "Recombinant vaccine", action: "Initiates immunization against hepatitis B virus", sideEffects: "Injection site soreness, mild fever", contra: "Severe allergic reaction to prior dose or yeast allergy", pearl: "Given within 12-24 hours of birth; if mother is HBsAg-positive, also give hepatitis B immune globulin (HBIG) within 12 hours" }
  ],
  pearls: [
    "Golden hour: skin-to-skin, delayed cord clamping (30-60 sec), initial breastfeeding within first hour",
    "APGAR is an assessment tool, NOT an indication for resuscitation — resuscitation begins based on clinical assessment",
    "Vitamin K IM within 1 hour: prevents hemorrhagic disease of the newborn",
    "Thermoregulation is critical: dry immediately, skin-to-skin, warm blankets — hypothermia increases oxygen consumption",
    "Cephalohematoma does NOT cross suture lines (subperiosteal bleeding); caput succedaneum DOES cross sutures (edema)",
    "Newborn screening: metabolic screening (PKU, hypothyroidism, etc.), hearing screening, pulse oximetry (CCHD screening)",
    "Critical congenital heart disease (CCHD) screening: pulse oximetry on right hand AND foot at 24-48 hours",
    "Weight loss up to 7-10% of birth weight is normal in the first 3-5 days; should regain by 10-14 days"
  ],
  quiz: [
    { question: "A newborn at 1 minute has a heart rate of 90 bpm, slow grimace to stimulation, blue extremities with pink body, limp tone, and slow irregular breathing. What is the APGAR score?", options: ["3", "4", "5", "7"], correct: 1, rationale: "HR 90 = 1 (below 100), Grimace slow = 1, Color acrocyanotic = 1, Tone limp = 0, Respirations slow/irregular = 1. Total APGAR = 4." },
    { question: "Why is vitamin K given to all newborns within the first hour of life?", options: ["To prevent anemia", "To prevent hemorrhagic disease — newborns lack vitamin K-dependent clotting factors", "To promote weight gain", "To prevent infection"], correct: 1, rationale: "Newborns have a sterile GI tract (no bacteria to produce vitamin K) and low stores of vitamin K-dependent clotting factors (II, VII, IX, X). Without supplementation, they are at risk for hemorrhagic disease of the newborn." }
  ]
};

const postpartumComplicationsOverview: LessonContent = {
  title: "Postpartum Complications Overview",
  cellular: {
    title: "Early Recognition and Management",
    content: "Postpartum complications can be life-threatening and require vigilant nursing assessment. The major postpartum complications include hemorrhage (leading cause of maternal death globally), infection (endometritis, wound infection, mastitis, urinary tract infection), thromboembolic disease (DVT, PE — leading cause of maternal death in developed countries), hypertensive disorders (postpartum preeclampsia/eclampsia can occur up to 6 weeks postpartum), and psychiatric disorders (postpartum depression, anxiety, psychosis). Endometritis is the most common postpartum infection, presenting with fever, uterine tenderness, and foul-smelling lochia. Risk factors include cesarean delivery (most significant), prolonged labor, prolonged rupture of membranes, multiple vaginal examinations, and chorioamnionitis. Wound infections present with erythema, warmth, edema, drainage, and dehiscence. Sepsis is the most feared infectious complication, presenting with fever or hypothermia, tachycardia, tachypnea, and altered mental status. The postpartum period is also a high-risk time for domestic violence escalation, substance use relapse, and mental health crises."
  },
  signs: {
    left: [
      "Hemorrhage: boggy uterus, excessive bleeding, tachycardia, hypotension",
      "Infection: fever >100.4°F, uterine tenderness, foul lochia, wound changes",
      "VTE: unilateral leg swelling, pain, warmth (DVT); dyspnea, chest pain (PE)",
      "Postpartum preeclampsia: headache, visual changes, elevated BP, edema",
      "Depression/psychosis: mood changes, hopelessness, hallucinations, disconnection"
    ],
    right: [
      "Hemorrhagic shock requiring massive transfusion",
      "Sepsis from untreated endometritis or wound infection",
      "Pulmonary embolism: leading cause of maternal death in developed countries",
      "Eclamptic seizures postpartum (can occur up to 6 weeks after delivery)",
      "Maternal death from delayed recognition of complications"
    ]
  },
  medications: [
    { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "First-line treatment and prevention of postpartum hemorrhage", sideEffects: "Water intoxication, hypotension", contra: "None absolute in hemorrhage emergency", pearl: "Routinely administered after placental delivery to promote uterine contraction and prevent hemorrhage" },
    { name: "Broad-spectrum Antibiotics", type: "Anti-infective", action: "Treat postpartum infections (endometritis, wound infection, sepsis)", sideEffects: "GI upset, allergic reactions, C. difficile risk", contra: "Known allergy to specific antibiotic class", pearl: "Endometritis: ampicillin + gentamicin ± clindamycin/metronidazole; wound infection: cephalosporin or based on culture" }
  ],
  pearls: [
    "Postpartum vital signs: monitor q15 min x1 hr, q30 min x2 hr, then q4-8 hr (or per facility policy)",
    "Early ambulation reduces VTE risk — most important preventive measure",
    "Teach ALL postpartum patients warning signs: heavy bleeding, fever, severe headache, vision changes, chest pain, leg pain, thoughts of self-harm",
    "Postpartum preeclampsia can develop WITHOUT any history of preeclampsia during pregnancy",
    "Red flags for postpartum hemorrhage: boggy uterus, soaking a pad in <1 hour, large clots",
    "PE is the leading cause of maternal death in the developed world: sudden dyspnea is an emergency",
    "Domestic violence screening: postpartum period is a high-risk time for escalation",
    "Follow-up: comprehensive postpartum visit at 3-6 weeks; earlier if high-risk"
  ],
  quiz: [
    { question: "What is the leading cause of maternal death in developed countries?", options: ["Hemorrhage", "Infection", "Pulmonary embolism", "Preeclampsia"], correct: 2, rationale: "In developed countries, pulmonary embolism (thromboembolic disease) is the leading cause of maternal death. The hypercoagulable state of pregnancy, combined with immobility from delivery (especially cesarean), significantly increases VTE risk." },
    { question: "A postpartum patient 5 days after cesarean delivery develops fever of 101.5°F and uterine tenderness. What is the most likely complication?", options: ["Normal postpartum recovery", "Endometritis", "Mastitis", "Urinary tract infection"], correct: 1, rationale: "Fever + uterine tenderness after cesarean delivery is the classic presentation of endometritis, the most common postpartum infection. Cesarean delivery is the single greatest risk factor." }
  ]
};

const maternalInfantBonding: LessonContent = {
  title: "Maternal-Infant Bonding and Attachment",
  cellular: {
    title: "Attachment Theory and Neurobiology",
    content: "Maternal-infant bonding is the emotional connection formed between a mother and her newborn, beginning during pregnancy and intensifying after birth. This process is mediated by neurobiological mechanisms: oxytocin ('the bonding hormone') is released during skin-to-skin contact, breastfeeding, and eye contact, promoting maternal caregiving behaviors and emotional connection. Endorphins released during bonding reinforce the rewarding nature of the relationship. The infant's brain is wired for attachment: preferential response to the mother's voice (heard in utero), face recognition within hours, and rooting/sucking reflexes that facilitate feeding and proximity. John Bowlby's attachment theory describes how the infant's attachment to the primary caregiver provides a secure base for emotional regulation and exploration. Sensitive, responsive caregiving in the first year promotes secure attachment, which predicts better cognitive, emotional, and social development. Conversely, maternal depression, substance use, traumatic birth, NICU separation, and inadequate social support can impair bonding. Klaus and Kennell's bonding theory emphasizes the importance of the early postpartum period (sensitive period) for parent-infant contact."
  },
  signs: {
    left: [
      "En face position: mother holds infant face-to-face, making eye contact",
      "Fingertip to palmar touch progression: exploring then embracing",
      "Calling infant by name, speaking in high-pitched voice (motherese)",
      "Responding to infant cues: crying, hunger, alertness",
      "Expressing positive feelings about the infant"
    ],
    right: [
      "Minimal eye contact or touching: possible bonding difficulty",
      "Negative comments about the infant's appearance or behavior",
      "Failure to respond to infant cues or distress",
      "Reluctance to hold, feed, or care for the infant",
      "Expressed disinterest, hostility, or fear toward the infant"
    ]
  },
  medications: [],
  pearls: [
    "Golden hour: uninterrupted skin-to-skin contact immediately after birth promotes bonding and breastfeeding",
    "Rooming-in (infant stays in room with mother) supports bonding and breastfeeding — avoid unnecessary separation",
    "Maternal depression is the most common barrier to healthy bonding — screen and treat early",
    "NICU stays: facilitate bonding through kangaroo care (skin-to-skin), involvement in care, and expressed milk",
    "Cultural considerations: bonding behaviors vary across cultures — assess within cultural context",
    "Paternal/partner bonding is equally important: encourage skin-to-skin, feeding participation, and involvement",
    "Bonding difficulties do NOT mean the mother is a bad parent — they indicate a need for support",
    "Refer to lactation consultant, social worker, or mental health provider when bonding concerns arise"
  ],
  quiz: [
    { question: "A new mother avoids eye contact with her newborn and makes negative comments about the baby's appearance. What is the most appropriate nursing response?", options: ["Ignore it as normal adjustment", "Document bonding concerns and provide support while assessing for postpartum depression", "Tell her she needs to bond with her baby", "Separate the baby from the mother for safety"], correct: 1, rationale: "These behaviors suggest bonding difficulty, which may be related to postpartum depression, traumatic birth, or other psychosocial factors. The nurse should document concerns, provide supportive care, screen for depression, and involve appropriate resources." },
    { question: "Which hormone is primarily responsible for promoting maternal bonding behaviors?", options: ["Estrogen", "Progesterone", "Oxytocin", "Prolactin"], correct: 2, rationale: "Oxytocin, released during skin-to-skin contact, breastfeeding, and eye contact, promotes maternal caregiving behaviors and emotional bonding. It is often called 'the bonding hormone' or 'the love hormone.'" }
  ]
};

const newbornFeeding: LessonContent = {
  title: "Newborn Feeding and Nutrition",
  cellular: {
    title: "Neonatal Nutritional Needs",
    content: "Adequate nutrition in the neonatal period is essential for growth, brain development, immune function, and establishing healthy metabolic patterns. Breast milk is the ideal nutrition for the first 6 months of life, providing complete macronutrients, micronutrients, antibodies, enzymes, hormones, and growth factors. Colostrum (days 1-3) is small in volume but concentrated with immunoglobulins (IgA), lactoferrin, white blood cells, and growth factors that protect the immature gut (the 'first vaccine'). Transitional milk (days 3-14) increases in volume and fat content. Mature milk composition changes dynamically during a feeding (foremilk is lower fat, hindmilk is higher fat) and across the day. For formula-fed infants, iron-fortified formula provides adequate nutrition when breast milk is unavailable. Feeding assessment includes monitoring for adequate intake (8-12 feedings per day for breastfed, q3-4 hours for formula-fed), adequate output (by day 4: ≥6 wet diapers and 3-4 stools per day), and appropriate weight gain (15-30g/day after initial loss). Feeding difficulties may indicate tongue-tie (ankyloglossia), cleft palate, neurological impairment, or cardiac defects."
  },
  signs: {
    left: [
      "Feeding cues: hand-to-mouth, rooting, lip smacking (feed before crying stage)",
      "Adequate latch: wide mouth, flanged lips, rhythmic suck-swallow pattern",
      "Output: ≥6 wet diapers/day, 3-4 stools/day by day 4",
      "Weight: normal loss up to 7-10% in first 3-5 days; regain by 10-14 days",
      "Formula-fed: 1-2 oz per feeding initially, increasing to 2-3 oz by 2 weeks"
    ],
    right: [
      "Excessive weight loss (>10% of birth weight): dehydration, insufficient intake",
      "Jaundice: inadequate feeding reduces bilirubin excretion through stool",
      "Hypoglycemia: poor feeding, jitteriness, lethargy",
      "Aspiration: choking, cyanosis, tachypnea during feeding",
      "Failure to thrive: inadequate weight gain beyond the first week"
    ]
  },
  medications: [
    { name: "Vitamin D supplement", type: "Fat-soluble vitamin", action: "Prevents rickets in exclusively breastfed infants (breast milk has insufficient vitamin D)", sideEffects: "Hypercalcemia at very high doses", contra: "Hypercalcemia, hypervitaminosis D", pearl: "400 IU daily for all breastfed infants starting within the first few days of life; formula-fed infants receive adequate vitamin D in formula" }
  ],
  pearls: [
    "Breast milk is the gold standard nutrition for all infants: WHO recommends exclusive breastfeeding for 6 months",
    "Feed on cue, not on schedule: watch for early feeding cues (hand-to-mouth, rooting) before crying",
    "A crying baby is a LATE hunger cue — calm the baby before attempting to feed",
    "Normal breastfed stool: yellow, seedy, soft — after meconium is passed (by day 3-4)",
    "Formula preparation: always follow manufacturer's instructions; over-dilution causes water intoxication, under-dilution causes dehydration",
    "Never prop a bottle or put cereal in the bottle (aspiration risk, overfeeding)",
    "All breastfed infants need vitamin D supplementation (400 IU/day) — breast milk has insufficient vitamin D",
    "Weight loss >10% of birth weight by day 3-5: evaluate for dehydration and feeding adequacy"
  ],
  quiz: [
    { question: "A 4-day-old breastfed newborn has lost 12% of birth weight. What is the nursing concern?", options: ["Normal finding: reassure the mother", "Excessive weight loss: evaluate for dehydration and assess breastfeeding effectiveness", "Overfeeding: reduce feeding frequency", "Formula should replace breast milk immediately"], correct: 1, rationale: "Weight loss >10% of birth weight in the first 3-5 days is excessive and suggests insufficient intake. The nurse should assess breastfeeding technique (latch, milk transfer), hydration status, and involve a lactation consultant." },
    { question: "Why do exclusively breastfed infants need vitamin D supplementation?", options: ["Breast milk contains too much vitamin D", "Breast milk has insufficient vitamin D for the infant's needs", "To treat jaundice", "To prevent anemia"], correct: 1, rationale: "Breast milk, while nutritionally complete in most respects, contains insufficient vitamin D to prevent rickets. All breastfed infants should receive 400 IU of vitamin D daily." }
  ]
};

const neonatalJaundice: LessonContent = {
  title: "Neonatal Jaundice and Hyperbilirubinemia",
  cellular: {
    title: "Bilirubin Metabolism in the Newborn",
    content: "Neonatal jaundice (icterus) is the yellow discoloration of the skin and sclera caused by elevated unconjugated (indirect) bilirubin levels. Bilirubin is a breakdown product of heme from red blood cell destruction. Newborns are predisposed to jaundice due to: high RBC volume with shorter RBC lifespan (70-90 days vs. 120 days in adults), immature hepatic conjugation enzyme (UDP-glucuronosyltransferase, or UGT), and increased enterohepatic circulation (unconjugated bilirubin is reabsorbed from the intestine before it can be excreted in stool). Physiological jaundice is the most common type, appearing after 24 hours of life, peaking at days 3-5 in term infants, and resolving by 1-2 weeks. Pathological jaundice appears within the first 24 hours (always abnormal — suggests hemolytic disease such as Rh or ABO incompatibility) or reaches dangerously high levels. The critical concern is kernicterus: unconjugated bilirubin crosses the blood-brain barrier and deposits in the basal ganglia, causing permanent neurological damage (hearing loss, cerebral palsy, intellectual disability). Risk factors include prematurity, hemolytic disease (Rh/ABO incompatibility, G6PD deficiency), bruising/cephalohematoma, poor feeding, Asian/Mediterranean ethnicity, and sibling with severe jaundice."
  },
  signs: {
    left: [
      "Yellow skin and sclera progressing cephalocaudally (head → trunk → extremities)",
      "Physiological jaundice: appears after 24 hours, peaks day 3-5, resolves by 1-2 weeks",
      "Breastfeeding jaundice: inadequate intake causing dehydration and poor bilirubin excretion",
      "Breast milk jaundice: substances in breast milk inhibit conjugation (appears after day 5-7, benign)",
      "Assess by blanching the skin (press gently) — underlying yellow indicates jaundice"
    ],
    right: [
      "Jaundice within first 24 hours: ALWAYS pathological — evaluate for hemolytic disease",
      "Total serum bilirubin crossing critical threshold on Bhutani nomogram",
      "Kernicterus: high-pitched cry, lethargy, poor feeding, opisthotonos, seizures",
      "Permanent neurological damage: hearing loss, cerebral palsy, intellectual disability",
      "Exchange transfusion needed if bilirubin reaches critical levels despite phototherapy"
    ]
  },
  medications: [
    { name: "Phototherapy", type: "Light therapy", action: "Blue-green light (wavelength 430-490 nm) converts unconjugated bilirubin in the skin to water-soluble isomers that can be excreted without hepatic conjugation", sideEffects: "Dehydration, temperature instability, skin rash, retinal damage (eye protection needed), loose green stools", contra: "Conjugated (direct) hyperbilirubinemia (porphyria may also contraindicate)", pearl: "Cover eyes with opaque eye shields; maximize skin exposure; feed frequently (q2-3 hrs) to promote stooling and bilirubin excretion; monitor temp, I&O, and bilirubin levels q4-8h" },
    { name: "Intravenous Immunoglobulin (IVIG)", type: "Immunoglobulin therapy", action: "Reduces hemolysis in isoimmune (Rh/ABO) hemolytic disease by blocking Fc receptors on RBCs", sideEffects: "Allergic reaction, fluid overload, renal impairment", contra: "IgA deficiency with anti-IgA antibodies", pearl: "Used when bilirubin continues to rise despite intensive phototherapy in hemolytic disease; reduces need for exchange transfusion" }
  ],
  pearls: [
    "Jaundice within first 24 hours is ALWAYS pathological — never dismiss early jaundice",
    "Physiological jaundice peaks day 3-5: ensure follow-up within 24-48 hours after discharge",
    "Phototherapy: maximize skin exposure, protect eyes, feed frequently, monitor temperature and I&O",
    "Adequate feeding is the BEST prevention: frequent feeding promotes stooling which eliminates bilirubin",
    "Breast milk jaundice (after day 5-7) is benign: do NOT stop breastfeeding",
    "Breastfeeding jaundice (first 3-5 days) is from inadequate intake: increase feeding frequency, assess latch",
    "Kernicterus is PREVENTABLE with early detection and treatment — universal screening is essential",
    "Cephalocaudal progression of jaundice correlates with bilirubin level: face (5), trunk (10), extremities (15+)"
  ],
  quiz: [
    { question: "A newborn develops visible jaundice at 18 hours of life. What is the significance?", options: ["Normal physiological jaundice", "Pathological jaundice requiring immediate evaluation for hemolytic disease", "Breast milk jaundice", "Dehydration jaundice"], correct: 1, rationale: "Jaundice within the first 24 hours of life is ALWAYS pathological and requires immediate evaluation. The most common cause is hemolytic disease (Rh or ABO incompatibility). Blood type, direct Coombs test, and bilirubin levels should be obtained urgently." },
    { question: "During phototherapy, what is essential nursing care?", options: ["Cover the infant completely with blankets", "Apply opaque eye shields, maximize skin exposure, feed frequently", "Limit feeding to reduce stool output", "Turn off lights every hour for rest"], correct: 1, rationale: "During phototherapy: protect eyes with opaque shields (prevent retinal damage), maximize skin exposure (more skin = more bilirubin conversion), and feed frequently (promotes stooling which eliminates bilirubin). Monitor temperature, I&O, and bilirubin levels." }
  ]
};

const postpartumInfection: LessonContent = {
  title: "Postpartum Infections",
  cellular: {
    title: "Puerperal Infection Pathophysiology",
    content: "Puerperal (postpartum) infections are infections of the genital tract occurring within 28 days of delivery. The large, raw placental wound site in the uterus provides an ideal entry point for bacteria. Endometritis (infection of the uterine lining) is the most common puerperal infection, occurring in 1-3% of vaginal deliveries and 5-15% of cesarean deliveries. The most common organisms are polymicrobial: group A and B streptococci, E. coli, Staphylococcus aureus, anaerobes (Bacteroides, Peptostreptococcus), and enterococci. Wound infections occur at the cesarean incision site or episiotomy/laceration repair site. Urinary tract infections are common due to catheterization and perineal trauma. Mastitis is breast infection, usually caused by S. aureus entering through cracked nipples. Sepsis is the most severe manifestation: systemic inflammatory response to infection causing organ dysfunction. Sepsis can progress rapidly, with mortality rates increasing significantly with each hour of delayed antibiotic administration."
  },
  signs: {
    left: [
      "Endometritis: fever >100.4°F, uterine tenderness, foul-smelling lochia, tachycardia",
      "Wound infection: redness, warmth, swelling, purulent drainage, wound separation",
      "UTI: dysuria, frequency, urgency, suprapubic tenderness, cloudy/foul urine",
      "Mastitis: localized breast pain, redness, warmth, fever, flu-like symptoms",
      "Monitor temperature q4 hours in the first 48 hours postpartum"
    ],
    right: [
      "Sepsis: fever/hypothermia, tachycardia, tachypnea, altered mental status, hypotension",
      "Wound dehiscence and evisceration (rare but emergent)",
      "Peritonitis from spread of endometritis",
      "Breast abscess requiring surgical drainage",
      "Septic shock: multiorgan failure, DIC, death"
    ]
  },
  medications: [
    { name: "Ampicillin + Gentamicin + Clindamycin", type: "Broad-spectrum antibiotic regimen", action: "Covers gram-positive, gram-negative, and anaerobic organisms in endometritis", sideEffects: "GI upset, nephrotoxicity (gentamicin), C. difficile (clindamycin)", contra: "Allergy to components; adjust gentamicin for renal function", pearl: "Standard 'triple therapy' for postpartum endometritis; continue until afebrile for 24-48 hours" },
    { name: "Cephalexin or Dicloxacillin", type: "Antibiotic", action: "Treats wound infections and mastitis caused by staphylococcal organisms", sideEffects: "GI upset, allergic reaction", contra: "Beta-lactam allergy (use clindamycin or TMP-SMX as alternatives)", pearl: "Mastitis: 10-14 day course; CONTINUE breastfeeding during treatment (safe for infant and therapeutic for mother)" }
  ],
  pearls: [
    "Postpartum fever >100.4°F (38°C) on 2 of the first 10 postpartum days (excluding first 24 hours) = puerperal morbidity",
    "Cesarean delivery is the single greatest risk factor for endometritis",
    "Endometritis treatment: continue IV antibiotics until afebrile for 24-48 hours; no oral antibiotics needed after",
    "Mastitis: CONTINUE breastfeeding — stopping increases abscess risk; affected breast should be emptied completely",
    "Wound infection: open, debride, irrigate, pack — healing by secondary intention; antibiotics as indicated",
    "Hand hygiene is the single most important infection prevention measure",
    "Assess perineum using REEDA scale: Redness, Edema, Ecchymosis, Discharge, Approximation",
    "Teach patients to report fever, foul-smelling discharge, worsening pain, or redness at any wound site"
  ],
  quiz: [
    { question: "What is the single greatest risk factor for postpartum endometritis?", options: ["Prolonged labor", "Cesarean delivery", "Breastfeeding", "Advanced maternal age"], correct: 1, rationale: "Cesarean delivery increases endometritis risk 5-20 fold compared to vaginal delivery. The surgical incision provides an entry point for bacteria, and manipulation of the uterus during surgery introduces organisms." },
    { question: "A postpartum patient with mastitis asks if she should stop breastfeeding. What is the correct advice?", options: ["Stop breastfeeding from the affected breast", "Continue breastfeeding from both breasts — emptying the breast is therapeutic", "Switch to formula for both breasts", "Pump and discard milk from the affected breast"], correct: 1, rationale: "Breastfeeding should CONTINUE during mastitis treatment. Emptying the breast is therapeutic and prevents abscess formation. The antibiotics used (dicloxacillin, cephalexin) are safe during breastfeeding." }
  ]
};

const contraceptionPostpartum: LessonContent = {
  title: "Postpartum Contraception",
  cellular: {
    title: "Contraceptive Options After Delivery",
    content: "Postpartum contraception counseling is an essential component of discharge planning. Ovulation can return as early as 25 days postpartum in non-breastfeeding women, making contraception necessary before the traditional 6-week postpartum visit. The lactational amenorrhea method (LAM) provides 98% contraceptive effectiveness when ALL three criteria are met: exclusive breastfeeding (no supplements), amenorrhea (no return of menses), and infant is less than 6 months old. However, LAM is temporary and should be supplemented with another method when any criterion is no longer met. Contraceptive options include: progestin-only methods (safe during breastfeeding — mini-pill, Depo-Provera injection, etonogestrel implant, levonorgestrel IUD), combined hormonal methods (estrogen-containing pills, patch, ring — avoid in breastfeeding women in first 4-6 weeks as estrogen may decrease milk supply), copper IUD (non-hormonal, can be placed immediately postpartum or at 6-week visit), permanent sterilization (tubal ligation during cesarean or within 48 hours postpartum), and barrier methods (condoms). The etonogestrel implant (Nexplanon) and IUDs can be placed immediately postpartum before hospital discharge, improving contraceptive access and reducing unintended pregnancies."
  },
  signs: {
    left: [
      "LAM criteria: exclusive breastfeeding + amenorrhea + infant <6 months",
      "Progestin-only methods: safe during breastfeeding (mini-pill, implant, Depo-Provera, hormonal IUD)",
      "Combined hormonal methods: delay until 4-6 weeks postpartum (may decrease milk supply)",
      "Copper IUD: non-hormonal, effective immediately, can be placed before discharge",
      "Immediate postpartum LARC placement: improves access and reduces unintended pregnancy"
    ],
    right: [
      "Unintended pregnancy: ovulation can return as early as 25 days postpartum",
      "Estrogen-containing methods in early breastfeeding: may decrease milk supply",
      "IUD perforation risk: slightly higher with immediate postpartum placement",
      "Depo-Provera: may delay return of fertility (average 10 months after last injection)",
      "Short interpregnancy interval (<18 months): increased risk of preterm birth and complications"
    ]
  },
  medications: [
    { name: "Etonogestrel Implant (Nexplanon)", type: "Progestin-only LARC", action: "Suppresses ovulation and thickens cervical mucus for 3 years", sideEffects: "Irregular bleeding, headache, weight gain, mood changes", contra: "Breast cancer, liver disease, unexplained vaginal bleeding", pearl: "Can be placed immediately postpartum or at any postpartum visit; safe during breastfeeding; 99.9% effective" },
    { name: "Depot Medroxyprogesterone Acetate (Depo-Provera)", type: "Progestin-only injectable", action: "Suppresses ovulation for 12-14 weeks per injection", sideEffects: "Weight gain, irregular bleeding, bone density loss (reversible), mood changes", contra: "Breast cancer, liver disease, unexplained bleeding", pearl: "Can be given immediately postpartum; safe during breastfeeding; may delay return to fertility (avg 10 months)" }
  ],
  pearls: [
    "Contraception counseling should begin PRENATALLY and be finalized before discharge",
    "Ovulation can return as early as 25 days postpartum: don't wait for the 6-week visit",
    "Progestin-only methods are safe during breastfeeding and can be started immediately postpartum",
    "Combined (estrogen-containing) methods: delay 4-6 weeks if breastfeeding; 3 weeks if not breastfeeding (VTE risk)",
    "Immediate postpartum IUD or implant placement before discharge improves contraceptive access",
    "LAM is effective ONLY when ALL three criteria are strictly met — educate thoroughly",
    "Recommended interpregnancy interval: ≥18 months from delivery to next conception",
    "Emergency contraception: available if unprotected intercourse occurs before contraception is established"
  ],
  quiz: [
    { question: "A breastfeeding mother asks about starting combination oral contraceptive pills at 2 weeks postpartum. What is the concern?", options: ["No concern — safe to start anytime", "Estrogen may decrease milk supply in early breastfeeding; recommend progestin-only method", "The pills are ineffective during breastfeeding", "She must wait 6 months"], correct: 1, rationale: "Estrogen-containing methods can decrease milk supply, especially in the first 4-6 weeks postpartum when lactation is being established. Progestin-only methods (mini-pill, implant, Depo-Provera, hormonal IUD) are safe during breastfeeding." },
    { question: "When can ovulation return in a non-breastfeeding postpartum woman?", options: ["Not until the 6-week postpartum visit", "As early as 25 days postpartum", "Only after menstruation returns", "At 3 months postpartum"], correct: 1, rationale: "Ovulation can return as early as 25 days postpartum in non-breastfeeding women, before the traditional 6-week postpartum visit. This is why contraception counseling and initiation before discharge is important." }
  ]
};

const neonatalHypoglycemia: LessonContent = {
  title: "Neonatal Hypoglycemia",
  cellular: {
    title: "Neonatal Glucose Metabolism",
    content: "Neonatal hypoglycemia is defined as blood glucose <40-45 mg/dL in the first 24 hours or <50 mg/dL after 24 hours (institutional protocols vary). In utero, the fetus receives a continuous glucose supply from the maternal circulation via placental transfer. At birth, this supply is abruptly discontinued, and the neonate must mobilize its own glucose through glycogenolysis (breakdown of glycogen stores) and gluconeogenesis (production of new glucose from non-carbohydrate sources). Term, appropriately grown newborns typically have adequate glycogen stores and can maintain blood glucose through these mechanisms. However, certain populations are at high risk: infants of diabetic mothers (IDMs) produce excess insulin from fetal hyperglycemia, which persists after birth; small for gestational age (SGA) and intrauterine growth restricted (IUGR) infants have inadequate glycogen stores; large for gestational age (LGA) infants may have relative hyperinsulinism; premature infants have immature gluconeogenic enzymes and low glycogen stores; and stressed or cold-stressed infants consume glucose more rapidly. The brain is highly dependent on glucose: prolonged or severe hypoglycemia can cause permanent neurological injury including seizures, brain damage, and developmental delay."
  },
  signs: {
    left: [
      "Jitteriness, tremors (most common early sign)",
      "Poor feeding, weak suck",
      "Hypothermia (cold stress increases glucose consumption)",
      "Lethargy, hypotonia, decreased activity",
      "High-pitched or weak cry"
    ],
    right: [
      "Seizures from severe hypoglycemia",
      "Apnea and cyanosis",
      "Permanent brain damage from prolonged hypoglycemia",
      "Developmental delays and intellectual disability",
      "Coma and death in extreme cases"
    ]
  },
  medications: [
    { name: "Oral glucose gel (40% dextrose gel)", type: "Glucose supplement", action: "Rapidly raises blood glucose when applied to buccal mucosa for transmucosal absorption", sideEffects: "Choking risk if swallowed improperly", contra: "NPO status, inability to feed", pearl: "Massage into buccal mucosa; follow with breastfeeding or formula; non-invasive first-line intervention for mild hypoglycemia" },
    { name: "IV Dextrose 10% (D10W)", type: "Intravenous glucose", action: "Provides immediate glucose for severe or refractory neonatal hypoglycemia", sideEffects: "Hyperglycemia, rebound hypoglycemia, infiltration injury", contra: "None in severe hypoglycemia", pearl: "D10W 2 mL/kg IV bolus for severe symptoms; followed by continuous infusion 4-8 mg/kg/min; NEVER use D25W or D50W in neonates (hyperosmolar, causes tissue injury)" }
  ],
  pearls: [
    "Risk groups for screening: IDMs, SGA, LGA, preterm, stressed/septic, hypothermic neonates",
    "Feed within 1 hour of birth: early feeding prevents hypoglycemia",
    "Screen at-risk infants: glucose at 1 hour of age, then before feeds for 12-24 hours",
    "Jitteriness in a newborn: think hypoglycemia first — check glucose immediately",
    "Oral glucose gel to buccal mucosa is a first-line non-invasive treatment for mild hypoglycemia",
    "NEVER use D25W or D50W in neonates — hyperosmolar solutions cause severe tissue injury",
    "Skin-to-skin contact and breastfeeding help maintain thermoregulation and glucose levels",
    "Monitor for rebound hypoglycemia after treatment — glucose may drop again as insulin response continues"
  ],
  quiz: [
    { question: "An infant of a diabetic mother (IDM) at 2 hours of age has a blood glucose of 35 mg/dL and appears jittery. What is the first intervention?", options: ["Observe and recheck in 1 hour", "Apply oral glucose gel to buccal mucosa and feed immediately", "Start IV D50W bolus", "Administer IM glucagon"], correct: 1, rationale: "For mild-moderate neonatal hypoglycemia with symptoms, oral glucose gel applied to the buccal mucosa followed by immediate feeding (breastfeeding or formula) is the recommended first-line intervention." },
    { question: "Why are infants of diabetic mothers at high risk for neonatal hypoglycemia?", options: ["Their livers cannot produce glucose", "Fetal hyperinsulinemia from maternal hyperglycemia persists after birth when glucose supply stops", "They are always premature", "Breast milk causes hypoglycemia"], correct: 1, rationale: "During pregnancy, maternal hyperglycemia crosses the placenta and causes the fetal pancreas to produce excess insulin (fetal hyperinsulinemia). After birth, when the maternal glucose supply stops, the persistent hyperinsulinemia causes rapid glucose consumption and hypoglycemia." }
  ]
};

const dischargeTeaching: LessonContent = {
  title: "Postpartum and Newborn Discharge Teaching",
  cellular: {
    title: "Comprehensive Discharge Education",
    content: "Discharge teaching is a critical nursing responsibility that ensures parents can safely care for themselves and their newborn at home. The content must be individualized, culturally sensitive, and delivered using teach-back methodology to confirm understanding. Maternal education includes: warning signs requiring immediate medical attention (fever >100.4°F, heavy bleeding, severe headache, visual changes, chest pain, leg pain/swelling, thoughts of self-harm), incision or perineal care, activity restrictions, nutrition and hydration, contraception, follow-up appointment scheduling, and emotional health resources. Newborn education includes: feeding (breastfeeding or formula preparation), diaper output monitoring, umbilical cord care (keep clean and dry, fold diaper below stump, no submersion bathing until cord falls off), circumcision care if applicable, safe sleep practices (ABCs: Alone, on Back, in Crib — no co-sleeping, no loose bedding, firm flat mattress), car seat safety, immunization schedule, newborn screening results follow-up, temperature taking, jaundice recognition, and when to call the pediatrician (fever >100.4°F, poor feeding, lethargy, difficulty breathing, excessive jaundice)."
  },
  signs: {
    left: [
      "Maternal warning signs: fever, heavy bleeding, severe headache, visual changes, chest/leg pain, self-harm thoughts",
      "Newborn warning signs: fever >100.4°F, poor feeding, lethargy, difficulty breathing, jaundice",
      "Safe sleep: ABCs — Alone, on Back, in Crib, firm flat mattress, no loose bedding",
      "Car seat safety: rear-facing in back seat until age 2 or maximum height/weight",
      "Follow-up: maternal 3-6 weeks, newborn within 48-72 hours after discharge"
    ],
    right: [
      "Failure to recognize warning signs leading to delayed care",
      "Unsafe sleep practices: leading cause of infant death after NICU discharge",
      "Improper formula preparation: over-dilution (water intoxication) or under-dilution (dehydration)",
      "Shaken baby syndrome: teach about coping with infant crying, never shake a baby",
      "Missed newborn screening or follow-up appointments"
    ]
  },
  medications: [],
  pearls: [
    "Use teach-back method: 'Can you tell me in your own words what you would do if...?'",
    "Safe sleep: Back to Sleep campaign reduced SIDS deaths by 50% — reinforce at every opportunity",
    "Never shake a baby: teach the 'Period of PURPLE Crying' — the crying pattern is normal and temporary",
    "Umbilical cord: keep clean and dry, fold diaper below cord, no alcohol (outdated practice), falls off in 1-3 weeks",
    "Car seat: rear-facing in the back seat; never place in front of an active airbag",
    "Newborn follow-up within 48-72 hours of discharge: especially important for jaundice monitoring",
    "Postpartum follow-up: comprehensive visit at 3-6 weeks; earlier if cesarean, hypertension, or complications",
    "Provide written materials in the patient's language and at an appropriate reading level"
  ],
  quiz: [
    { question: "A new mother asks how to position her newborn for sleep. What is the correct recommendation?", options: ["On the stomach to prevent aspiration", "On the back, alone, in a crib with a firm flat mattress and no loose bedding", "On the side with pillows for support", "In bed with the parents for easy feeding access"], correct: 1, rationale: "The ABCs of safe sleep: Alone (not co-sleeping), on Back (supine position reduces SIDS risk), in a Crib (with firm flat mattress, fitted sheet only, no pillows, blankets, bumpers, or toys). Back to Sleep has reduced SIDS deaths by 50%." },
    { question: "Which postpartum warning sign requires immediate medical attention?", options: ["Mild breast tenderness", "Lochia serosa on day 5", "Severe headache with visual changes", "Afterpains during breastfeeding"], correct: 2, rationale: "Severe headache with visual changes in the postpartum period may indicate postpartum preeclampsia/eclampsia, which can develop up to 6 weeks after delivery. This requires immediate medical evaluation." }
  ]
};

const perinatalLoss: LessonContent = {
  title: "Perinatal Loss and Grief Support",
  cellular: {
    title: "Grief and Bereavement Care",
    content: "Perinatal loss encompasses miscarriage, stillbirth, neonatal death, and termination for medical reasons. These losses are among the most profound grief experiences, often complicated by the contrast between expected joy and devastating loss, disenfranchised grief (society may minimize the loss), hormonal shifts amplifying emotional responses, and the physical recovery from pregnancy/delivery occurring simultaneously with grief. The Kubler-Ross model describes grief stages (denial, anger, bargaining, depression, acceptance), though grief is not linear. Complicated grief may develop when the bereaved person remains 'stuck' in intense grief beyond the expected timeframe, significantly impacting daily functioning. Nursing care for perinatal loss requires sensitivity, presence, and therapeutic communication. Evidence-based practices include: offering the family time with the infant (memory-making), creating keepsakes (photographs, footprints, lock of hair, cap, blanket), acknowledging the loss by using the baby's name, providing physical comfort care for the mother, facilitating spiritual/cultural rituals, arranging bereavement follow-up, and providing referrals to support groups and mental health services."
  },
  signs: {
    left: [
      "Normal grief reactions: crying, anger, guilt, numbness, disbelief, yearning",
      "Physical grief symptoms: fatigue, insomnia, appetite changes, chest tightness",
      "Desire to see, hold, and spend time with the deceased infant",
      "Questions about what happened and why",
      "Need for memory-making: photographs, footprints, keepsakes"
    ],
    right: [
      "Complicated grief: persistent intense grief significantly impairing function beyond 6-12 months",
      "Postpartum depression and PTSD following loss",
      "Suicidal ideation related to the loss",
      "Relationship strain: partners grieve differently",
      "Anxiety in subsequent pregnancies"
    ]
  },
  medications: [],
  pearls: [
    "Say the baby's name — acknowledging the baby validates the parents' grief",
    "Avoid platitudes: 'Everything happens for a reason,' 'You can have another baby,' 'At least you have other children'",
    "Offer opportunities to see, hold, and spend time with the baby — follow the family's wishes",
    "Memory-making: photographs, footprints, handprints, lock of hair, blanket, cap — priceless to families",
    "Provide a private room away from the sounds of newborn babies",
    "Lactation suppression may be needed: ice packs, firm bra, cabbage leaves; dopamine agonists if needed",
    "Bereavement follow-up: phone call within 1-2 weeks, sympathy card, follow-up appointment",
    "Refer to perinatal loss support groups and mental health services",
    "Butterfly or other symbol on the door: alerts staff to the loss without requiring repeated explanations"
  ],
  quiz: [
    { question: "A mother whose baby was stillborn asks to hold her baby. What is the appropriate nursing response?", options: ["Discourage her as it will make grief worse", "Support her desire and facilitate time with the baby, offering memory-making opportunities", "Tell her it's not allowed for infection control", "Allow it briefly but then quickly take the baby away"], correct: 1, rationale: "Evidence supports offering bereaved parents the opportunity to see, hold, and spend time with their baby. This facilitates the grieving process and creates lasting memories. The nurse should support the family's wishes and offer memory-making (photos, footprints, keepsakes)." },
    { question: "Which statement by a nurse to a grieving mother after stillbirth is MOST therapeutic?", options: ["At least you know you can get pregnant again", "Everything happens for a reason", "I am so sorry for the loss of [baby's name]. I am here with you", "The baby is in a better place now"], correct: 2, rationale: "Using the baby's name, expressing genuine sympathy, and offering presence are therapeutic responses. Platitudes ('everything happens for a reason,' 'at least...') minimize the loss and are not helpful." }
  ]
};

const postpartumPhysiologicalChanges: LessonContent = {
  title: "Postpartum Physiological Changes",
  cellular: {
    title: "Maternal Recovery Physiology",
    content: "The postpartum period involves the reversal of pregnancy-induced physiological changes across every organ system. Cardiovascular: cardiac output peaks immediately after delivery (due to autotransfusion from uterine contraction) then gradually returns to pre-pregnant levels by 6-12 weeks. Blood volume decreases through diuresis and diaphoresis in the first week. Hematologic: pregnancy-induced hypercoagulability persists for 6-8 weeks postpartum, maintaining elevated VTE risk. WBC count may be elevated (up to 25,000-30,000) from stress of labor without indicating infection. Reproductive: uterine involution reduces the 1000g uterus to 60g by 6 weeks. Lochia transitions from rubra (1-3 days) to serosa (4-10 days) to alba (10 days-6 weeks). The cervix closes by 1 week, and the internal os by 6 weeks. Ovulation returns in 6-12 weeks without breastfeeding, later with breastfeeding. Renal: the dilated ureters and renal pelvis return to normal by 6-8 weeks. Diuresis in the first 2-3 days eliminates excess fluid. GI: motility returns gradually; constipation is common from decreased motility, dehydration, fear of pain, and iron supplementation."
  },
  signs: {
    left: [
      "Diuresis and diaphoresis (sweating) in the first 2-3 days: eliminating excess pregnancy fluid",
      "Uterine involution: fundus descends ~1 fingerbreadth per day",
      "Afterpains: uterine cramping, especially during breastfeeding and in multiparas",
      "WBC elevation (up to 25,000-30,000): stress response, NOT necessarily infection",
      "Hair loss (telogen effluvium): normal, temporary, peaks at 3-6 months postpartum"
    ],
    right: [
      "Subinvolution: uterus larger than expected, prolonged bleeding",
      "Persistent hypertension: monitor for postpartum preeclampsia",
      "DVT/PE: hypercoagulability persists 6-8 weeks postpartum",
      "Urinary retention: common after epidural or operative delivery",
      "Diastasis recti: separation of rectus abdominis muscles"
    ]
  },
  medications: [],
  pearls: [
    "Diuresis and diaphoresis in the first 2-3 days is NORMAL: the body is eliminating excess pregnancy fluid",
    "WBC up to 25,000-30,000 can be normal postpartum — use clinical signs (fever, tenderness) to assess for infection",
    "Afterpains are more intense in multiparous women and during breastfeeding (oxytocin stimulates contraction)",
    "VTE risk persists for 6-8 weeks postpartum — early ambulation and awareness of DVT symptoms",
    "Hair loss at 3-6 months postpartum is normal (telogen effluvium): hair grows back",
    "Diastasis recti: assess by having the patient lift her head while supine — gap between rectus muscles",
    "First postpartum void should occur within 6-8 hours of delivery — assess for retention",
    "Monitor for orthostatic hypotension due to fluid shifts and blood loss"
  ],
  quiz: [
    { question: "A postpartum patient on day 2 has profuse sweating at night and frequent urination. Is this normal?", options: ["No, this suggests infection", "Yes, postpartum diaphoresis and diuresis are normal mechanisms to eliminate excess pregnancy fluid", "No, this indicates renal failure", "Yes, but only after cesarean delivery"], correct: 1, rationale: "Postpartum diaphoresis (sweating) and diuresis are normal physiological processes by which the body eliminates the approximately 6-8 pounds of extra fluid accumulated during pregnancy." },
    { question: "A postpartum patient has a WBC count of 24,000 with no fever, uterine tenderness, or other signs of infection. What is the interpretation?", options: ["Clear sign of infection requiring immediate antibiotics", "Likely a normal stress response to labor; monitor clinically", "Indicates hemorrhage", "Leukemia should be ruled out"], correct: 1, rationale: "WBC counts up to 25,000-30,000 can be a normal stress response to labor and delivery. In the absence of clinical signs of infection (fever, tenderness, foul lochia), an elevated WBC alone does not indicate infection." }
  ]
};

export const postpartumLessons: Record<string, LessonContent> = {
  "postpartum-assessment": postpartumAssessment,
  "breastfeeding-support": breastfeedingSupport,
  "postpartum-depression-screening": postpartumDepressionScreening,
  "newborn-assessment-transition": newbornAssessment,
  "postpartum-complications-overview": postpartumComplicationsOverview,
  "maternal-infant-bonding": maternalInfantBonding,
  "newborn-feeding-nutrition": newbornFeeding,
  "neonatal-jaundice": neonatalJaundice,
  "postpartum-infections": postpartumInfection,
  "postpartum-contraception": contraceptionPostpartum,
  "neonatal-hypoglycemia": neonatalHypoglycemia,
  "discharge-teaching": dischargeTeaching,
  "perinatal-loss-grief": perinatalLoss,
  "postpartum-physiological-changes": postpartumPhysiologicalChanges,
};
