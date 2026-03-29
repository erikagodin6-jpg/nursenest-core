import type { ExamQuestion } from "./types";

export const rpnExpansionCQuestions: ExamQuestion[] = [
  // ===== PRENATAL CARE (Questions 1-10) =====
  {
    q: "A pregnant client at 10 weeks gestation reports nausea and vomiting that occurs mostly in the morning. Which nursing intervention is most appropriate?",
    o: ["Suggest eating dry crackers before getting out of bed", "Advise the client to skip breakfast entirely", "Recommend increasing fluid intake during meals", "Instruct the client to lie flat after eating"],
    a: 0,
    r: "Eating dry crackers or toast before rising helps absorb stomach acid and reduces morning nausea. Skipping meals can worsen nausea due to an empty stomach. Drinking large amounts of fluid during meals can increase gastric distension and nausea. Lying flat after eating can promote gastroesophageal reflux.",
    s: "Maternal"
  },
  {
    q: "A nurse is assisting with the initial prenatal visit for a client at 8 weeks gestation. Which laboratory test is essential to obtain at this visit?",
    o: ["Blood type, Rh factor, and antibody screen", "Glucose tolerance test", "Group B Streptococcus culture", "Fetal fibronectin test"],
    a: 0,
    r: "Blood type, Rh factor, and antibody screen are obtained at the first prenatal visit to identify Rh incompatibility risk and plan for RhoGAM administration if needed. The glucose tolerance test is typically done at 24-28 weeks. GBS culture is performed at 35-37 weeks. Fetal fibronectin is used to assess preterm labor risk, not as a routine first-visit test.",
    s: "Maternal"
  },
  {
    q: "A client at 28 weeks gestation is Rh-negative and her partner is Rh-positive. The nurse anticipates which intervention?",
    o: ["Administration of RhoGAM (Rh immunoglobulin)", "Scheduling an immediate cesarean section", "Initiating oxytocin to induce labor", "Ordering a fetal scalp blood sample"],
    a: 0,
    r: "RhoGAM is administered at 28 weeks gestation and within 72 hours postpartum to Rh-negative mothers with Rh-positive partners to prevent isoimmunization. Cesarean section is not indicated solely for Rh incompatibility. Induction is not warranted at 28 weeks. Fetal scalp sampling is performed during labor, not prophylactically.",
    s: "Maternal"
  },
  {
    q: "During a prenatal visit, a client asks why she needs to take folic acid supplements. The nurse explains that folic acid primarily helps prevent which condition?",
    o: ["Neural tube defects such as spina bifida", "Gestational diabetes mellitus", "Preeclampsia", "Placenta previa"],
    a: 0,
    r: "Folic acid supplementation before and during early pregnancy significantly reduces the risk of neural tube defects such as spina bifida and anencephaly. Folic acid does not prevent gestational diabetes, preeclampsia, or placenta previa. These conditions have different etiologies unrelated to folate status.",
    s: "Maternal"
  },
  {
    q: "A nurse is reviewing prenatal warning signs with a client at 32 weeks gestation. Which symptom should the nurse instruct the client to report immediately?",
    o: ["Sudden swelling of the face and hands with a persistent headache", "Occasional Braxton-Hicks contractions", "Mild ankle swelling at the end of the day", "Increased urinary frequency"],
    a: 0,
    r: "Sudden facial and hand edema with a persistent headache are warning signs of preeclampsia, which requires immediate evaluation. Braxton-Hicks contractions are normal irregular contractions of pregnancy. Mild ankle swelling in the third trimester is a common physiological finding. Increased urinary frequency is expected due to uterine pressure on the bladder.",
    s: "Maternal"
  },
  {
    q: "A pregnant client at 20 weeks gestation has a blood pressure of 148/96 mmHg and 2+ proteinuria. The nurse recognizes these findings as indicative of which condition?",
    o: ["Preeclampsia", "Gestational diabetes", "Placental abruption", "Hyperemesis gravidarum"],
    a: 0,
    r: "Elevated blood pressure (140/90 mmHg or higher) with proteinuria after 20 weeks gestation is the hallmark presentation of preeclampsia. Gestational diabetes is characterized by glucose intolerance, not hypertension. Placental abruption presents with vaginal bleeding and abdominal pain. Hyperemesis gravidarum involves severe nausea and vomiting.",
    s: "Maternal"
  },
  {
    q: "A nurse is educating a prenatal client about nutrition during pregnancy. Which dietary recommendation is most appropriate?",
    o: ["Increase iron-rich foods such as lean meats and dark leafy greens", "Eliminate all dairy products to prevent excess weight gain", "Restrict caloric intake to 1,200 calories per day", "Avoid all fish due to mercury content"],
    a: 0,
    r: "Iron requirements increase during pregnancy to support expanded blood volume and fetal development. Lean meats and dark leafy greens are excellent iron sources. Dairy provides essential calcium and should not be eliminated. Caloric restriction to 1,200 calories is insufficient for pregnancy. Low-mercury fish such as salmon is recommended for omega-3 fatty acids.",
    s: "Maternal"
  },
  {
    q: "A client at 36 weeks gestation reports decreased fetal movement over the past 24 hours. What is the most appropriate initial nursing action?",
    o: ["Instruct the client to perform a fetal kick count and report findings", "Reassure the client that decreased movement is normal near term", "Schedule an appointment for the following week", "Advise the client to drink cold water and rest"],
    a: 0,
    r: "Decreased fetal movement can indicate fetal distress and requires prompt evaluation. A fetal kick count (counting movements over a specific time period) is the appropriate first step, with the expectation of at least 10 movements in 2 hours. Reassurance without assessment is unsafe. Delaying evaluation could compromise fetal well-being. While hydration may help, a structured kick count provides more reliable data.",
    s: "Maternal"
  },
  {
    q: "A nurse is reviewing the results of a prenatal glucose screening test. The client's 1-hour glucose challenge test result is 10.2 mmol/L. What is the next step?",
    o: ["Schedule a 3-hour oral glucose tolerance test", "Diagnose the client with gestational diabetes", "Repeat the 1-hour test in 2 weeks", "Start the client on insulin therapy"],
    a: 0,
    r: "A 1-hour glucose challenge result above 7.8 mmol/L (140 mg/dL) is abnormal and requires a confirmatory 3-hour oral glucose tolerance test. A single screening test does not diagnose gestational diabetes. Repeating the test delays diagnosis. Insulin is not started without a confirmed diagnosis.",
    s: "Maternal"
  },
  {
    q: "A pregnant client asks the nurse which over-the-counter medication is generally considered safe during pregnancy for mild headaches. Which response is most appropriate?",
    o: ["Acetaminophen is considered the safest option for pain relief during pregnancy", "Ibuprofen is the preferred choice throughout pregnancy", "Aspirin can be taken freely during any trimester", "Naproxen is safe at all stages of pregnancy"],
    a: 0,
    r: "Acetaminophen (Tylenol) is considered the safest analgesic during pregnancy when used as directed. NSAIDs such as ibuprofen and naproxen are generally avoided, especially in the third trimester, as they can cause premature closure of the ductus arteriosus. Aspirin is not recommended unless specifically prescribed for medical indications such as preeclampsia prevention.",
    s: "Maternal"
  },

  // ===== LABOR & DELIVERY BASICS (Questions 11-20) =====
  {
    q: "A laboring client's cervix is 4 cm dilated, 80% effaced, and the fetal station is -1. In which stage and phase of labor is this client?",
    o: ["First stage, active phase", "First stage, latent phase", "Second stage", "Third stage"],
    a: 0,
    r: "The active phase of the first stage of labor is characterized by cervical dilation from 4-7 cm (some sources say 6 cm) with increasing effacement and descent. The latent phase involves 0-3 cm dilation. The second stage begins at complete dilation (10 cm) and ends with delivery. The third stage involves delivery of the placenta.",
    s: "Maternal"
  },
  {
    q: "A nurse is monitoring a laboring client and notes that the fetal heart rate drops after the peak of each contraction and returns to baseline after the contraction ends. What type of deceleration is this?",
    o: ["Late deceleration", "Early deceleration", "Variable deceleration", "Prolonged deceleration"],
    a: 0,
    r: "Late decelerations occur after the peak of the contraction, with the nadir of the deceleration occurring after the peak of the contraction, and return to baseline after the contraction ends. Late decelerations are caused by uteroplacental insufficiency and require intervention. Early decelerations mirror the contraction and are caused by fetal head compression. Variable decelerations are abrupt drops caused by cord compression.",
    s: "Maternal"
  },
  {
    q: "A laboring client has her membranes spontaneously rupture. The nurse's priority assessment is to:",
    o: ["Check the fetal heart rate immediately", "Measure the amount of amniotic fluid", "Assess the color of the client's skin", "Time the duration of the next contraction"],
    a: 0,
    r: "After spontaneous rupture of membranes, the priority is to assess fetal heart rate immediately because cord prolapse can occur, especially if the presenting part is not well engaged. This would cause fetal heart rate changes indicating cord compression. While assessing fluid characteristics is important, fetal well-being is the priority. Skin assessment and contraction timing are secondary.",
    s: "Maternal"
  },
  {
    q: "A nurse observes a loop of umbilical cord protruding from the vagina after rupture of membranes. What is the priority nursing action?",
    o: ["Place the client in Trendelenburg or knee-chest position and call for emergency help", "Attempt to push the cord back into the uterus", "Apply oxygen via nasal cannula at 2 L/min", "Begin timing contractions more frequently"],
    a: 0,
    r: "Cord prolapse is a life-threatening emergency. Placing the client in Trendelenburg or knee-chest position uses gravity to relieve pressure on the cord. The nurse should apply upward pressure on the presenting part (not push the cord back) and prepare for emergency cesarean delivery. Pushing the cord back risks vasospasm. Low-flow oxygen is insufficient. Timing contractions does not address the emergency.",
    s: "Maternal"
  },
  {
    q: "During labor, a client's contractions are 2-3 minutes apart, lasting 60-90 seconds, and the client reports an urge to push. The nurse should first:",
    o: ["Check cervical dilation before allowing the client to push", "Instruct the client to begin pushing immediately", "Administer pain medication to reduce the urge", "Encourage the client to walk to speed labor"],
    a: 0,
    r: "Before allowing pushing, the nurse must verify complete cervical dilation (10 cm). Pushing before full dilation can cause cervical edema, lacerations, and maternal exhaustion. Instructing to push without checking dilation is unsafe. Pain medication at this stage may not be appropriate. Walking is not recommended with the urge to push and frequent contractions.",
    s: "Maternal"
  },
  {
    q: "A nurse is assessing a newborn immediately after birth using the Apgar scoring system. Which parameters are evaluated?",
    o: ["Heart rate, respiratory effort, muscle tone, reflex irritability, and color", "Weight, length, head circumference, chest circumference, and temperature", "Blood glucose, oxygen saturation, blood pressure, temperature, and heart rate", "Gestational age, birth weight, feeding ability, cry, and reflexes"],
    a: 0,
    r: "The Apgar score evaluates five parameters at 1 and 5 minutes after birth: heart rate (Pulse), respiratory effort (Respiration), muscle tone (Activity), reflex irritability (Grimace), and skin color (Appearance). The other answer choices describe routine newborn measurements or assessments that are not part of the Apgar scoring system.",
    s: "Maternal"
  },
  {
    q: "A client in labor receives an epidural for pain management. Which nursing assessment is most important immediately after placement?",
    o: ["Monitor blood pressure for hypotension", "Assess for urinary retention", "Check the epidural insertion site for bleeding", "Evaluate the client's level of consciousness"],
    a: 0,
    r: "Epidural anesthesia causes sympathetic blockade, which can lead to vasodilation and hypotension. Blood pressure monitoring is the priority immediately after placement to detect and treat hypotension promptly. Urinary retention is a concern but develops over time. Insertion site bleeding is uncommon. Level of consciousness is not typically affected by epidural anesthesia.",
    s: "Maternal"
  },
  {
    q: "A nurse notes that amniotic fluid is greenish-brown in color after rupture of membranes. This finding indicates:",
    o: ["Meconium-stained amniotic fluid suggesting possible fetal distress", "Normal amniotic fluid in late-term pregnancy", "Maternal urinary tract infection", "Blood-tinged mucus from cervical dilation"],
    a: 0,
    r: "Green or brownish-green amniotic fluid indicates the presence of meconium, which can be a sign of fetal distress. Meconium passage in utero increases the risk of meconium aspiration syndrome. Normal amniotic fluid is clear to pale yellow. Maternal UTI does not change amniotic fluid color. Bloody show from cervical dilation produces pink or red-tinged mucus.",
    s: "Maternal"
  },
  {
    q: "A laboring client at 39 weeks gestation is receiving oxytocin (Pitocin) augmentation. The nurse notes contractions lasting 100 seconds with less than 60 seconds between them. What is the appropriate action?",
    o: ["Stop the oxytocin infusion and notify the healthcare provider", "Increase the oxytocin rate to strengthen contractions", "Continue the current rate and document findings", "Reposition the client and increase IV fluid rate only"],
    a: 0,
    r: "Contractions lasting longer than 90 seconds with less than 60 seconds of rest indicate uterine tachysystole, which can compromise fetal oxygenation. The oxytocin infusion must be stopped immediately, the provider notified, and the client repositioned with left lateral positioning. Increasing the rate would worsen the situation. Continuing without intervention puts the fetus at risk.",
    s: "Maternal"
  },
  {
    q: "A nurse is caring for a client who is 6 cm dilated and experiencing moderate pain. The client requests pain relief but wants to remain mobile. Which non-pharmacological intervention is most appropriate?",
    o: ["Encourage use of a birthing ball and position changes", "Administer IV morphine as ordered", "Apply a cold pack to the client's forehead only", "Recommend that the client remain in bed on her left side"],
    a: 0,
    r: "A birthing ball allows the client to remain upright and mobile while providing comfort through gentle movement and positioning. IV morphine is pharmacological and may limit mobility. A cold pack alone may provide minimal relief. Remaining in bed restricts mobility, which the client wishes to maintain. Non-pharmacological methods that promote movement can aid labor progression.",
    s: "Maternal"
  },

  // ===== POSTPARTUM & NEWBORN (Questions 21-30) =====
  {
    q: "A nurse is assessing a postpartum client 2 hours after a vaginal delivery. The fundus is located 2 cm above the umbilicus and deviated to the right. What is the most appropriate initial action?",
    o: ["Have the client empty her bladder", "Massage the fundus vigorously", "Administer oxytocin immediately", "Position the client in Trendelenburg"],
    a: 0,
    r: "A fundus that is above the umbilicus and deviated to the side most commonly indicates a full bladder displacing the uterus. Having the client empty her bladder should resolve the displacement. If the fundus remains boggy after bladder emptying, then fundal massage would be appropriate. Oxytocin may be needed if the uterus does not contract after bladder emptying and massage. Trendelenburg is not indicated.",
    s: "Maternal"
  },
  {
    q: "A postpartum client reports soaking through more than one perineal pad per hour with bright red blood. The nurse recognizes this as a sign of:",
    o: ["Postpartum hemorrhage requiring immediate assessment", "Normal lochia rubra in the first 24 hours", "Expected finding after an epidural", "Urinary tract infection"],
    a: 0,
    r: "Saturating more than one pad per hour with bright red blood indicates excessive bleeding and possible postpartum hemorrhage, which requires immediate assessment and intervention. Normal lochia rubra is steady but should not saturate pads this rapidly. Epidurals do not cause hemorrhage. UTI presents with dysuria and frequency, not heavy vaginal bleeding.",
    s: "Maternal"
  },
  {
    q: "A nurse is teaching a new mother about breastfeeding. Which instruction indicates effective latch technique?",
    o: ["The infant's mouth should cover most of the areola, not just the nipple", "The infant should latch only onto the tip of the nipple", "The mother should hear clicking sounds during feeding", "The infant should be fed on a strict schedule of every 6 hours"],
    a: 0,
    r: "An effective latch involves the infant's mouth covering a large portion of the areola, not just the nipple. This ensures adequate milk transfer and prevents nipple trauma. Latching only onto the nipple causes soreness and ineffective feeding. Clicking sounds indicate a poor latch. Newborns should feed on demand, approximately every 2-3 hours, not every 6 hours.",
    s: "Maternal"
  },
  {
    q: "A newborn is being assessed at 24 hours of age. The nurse notes yellowish discoloration of the skin and sclera. Which action is most appropriate?",
    o: ["Report the finding to the healthcare provider for bilirubin level assessment", "Reassure the parents that this is always a normal finding", "Begin phototherapy immediately without further assessment", "Withhold breastfeeding until jaundice resolves"],
    a: 0,
    r: "Jaundice appearing within the first 24 hours of life is considered pathological and requires prompt evaluation with serum bilirubin levels. It may indicate hemolytic disease or other serious conditions. While physiological jaundice is common after 24 hours, early-onset jaundice requires investigation. Phototherapy decisions depend on bilirubin levels. Breastfeeding should continue as it helps with bilirubin excretion.",
    s: "Maternal"
  },
  {
    q: "A nurse is caring for a newborn and notes that the umbilical cord stump has a foul odor and the surrounding skin is red and warm. The nurse should:",
    o: ["Notify the healthcare provider as these are signs of infection", "Clean the area with rubbing alcohol and apply a bandage", "Apply antibiotic ointment from the unit supply", "Continue routine care as this is a normal finding"],
    a: 0,
    r: "Foul odor, redness, warmth, and purulent drainage around the umbilical cord stump are signs of omphalitis (umbilical cord infection), which can lead to sepsis in newborns. The healthcare provider must be notified promptly. Alcohol is no longer recommended for cord care. The nurse should not apply medications without an order. These findings are not normal and require medical evaluation.",
    s: "Maternal"
  },
  {
    q: "A postpartum client on day 3 reports feeling overwhelmed, tearful, and having mood swings. She is sleeping and eating adequately. The nurse recognizes this as most consistent with:",
    o: ["Postpartum blues, which typically resolves within 2 weeks", "Postpartum depression requiring immediate psychiatric referral", "Postpartum psychosis requiring hospitalization", "Normal emotional adjustment that does not require monitoring"],
    a: 0,
    r: "Postpartum blues (baby blues) typically begin 2-3 days after delivery and involve mood swings, tearfulness, and feeling overwhelmed. It usually resolves within 2 weeks without treatment. Postpartum depression involves more severe symptoms lasting beyond 2 weeks with functional impairment. Postpartum psychosis involves hallucinations, delusions, or disorganized behavior. While monitoring is still important, these symptoms are characteristic of postpartum blues.",
    s: "Maternal"
  },
  {
    q: "A nurse is performing a newborn assessment and notes a soft, fluctuant swelling on the newborn's head that crosses suture lines. This finding is most consistent with:",
    o: ["Caput succedaneum", "Cephalohematoma", "Hydrocephalus", "Craniosynostosis"],
    a: 0,
    r: "Caput succedaneum is a soft, edematous swelling of the scalp that crosses suture lines, caused by pressure during delivery. It typically resolves within a few days. Cephalohematoma is a collection of blood beneath the periosteum that does NOT cross suture lines. Hydrocephalus involves increased head circumference with bulging fontanelles. Craniosynostosis is premature fusion of cranial sutures.",
    s: "Maternal"
  },
  {
    q: "A nurse is teaching a postpartum client about lochia progression. Which sequence correctly describes the normal pattern?",
    o: ["Lochia rubra (red), lochia serosa (pinkish-brown), lochia alba (white-yellow)", "Lochia alba (white), lochia serosa (pink), lochia rubra (red)", "Lochia serosa (pink), lochia rubra (red), lochia alba (white)", "Lochia rubra (red), lochia alba (white), lochia serosa (pink)"],
    a: 0,
    r: "Normal lochia progression follows: rubra (dark red, days 1-3), serosa (pinkish-brown, days 4-10), and alba (whitish-yellow, days 11-21 or longer). A return to bright red bleeding after progression to serosa or alba may indicate retained placental fragments or overexertion and should be reported.",
    s: "Maternal"
  },
  {
    q: "A newborn screening reveals a positive result for phenylketonuria (PKU). The nurse should educate the parents that management of PKU involves:",
    o: ["A lifelong diet low in phenylalanine", "Daily insulin injections", "Iron supplementation for the first year", "Avoidance of all carbohydrates"],
    a: 0,
    r: "PKU is an inborn error of metabolism in which the body cannot properly metabolize phenylalanine. Management requires a lifelong low-phenylalanine diet to prevent intellectual disability. Insulin is used for diabetes, not PKU. Iron supplementation is unrelated. Carbohydrate restriction is not the treatment for PKU.",
    s: "Maternal"
  },
  {
    q: "A nurse is assessing a postpartum client's perineum using the REEDA scale. Which components does this scale evaluate?",
    o: ["Redness, Edema, Ecchymosis, Discharge, and Approximation", "Respirations, Extremity movement, Edema, Dilation, and Appearance", "Range of motion, Elimination, Energy, Diet, and Activity", "Reflex, Effort, Evaluation, Documentation, and Assessment"],
    a: 0,
    r: "The REEDA scale is used to assess perineal healing and evaluates Redness, Edema, Ecchymosis (bruising), Discharge, and Approximation (how well wound edges are aligned). Each component is scored 0-3, with higher scores indicating more complications. This is a standardized tool specific to postpartum perineal assessment.",
    s: "Maternal"
  },

  // ===== PEDIATRIC GROWTH & DEVELOPMENT (Questions 31-40) =====
  {
    q: "According to Erikson's theory of psychosocial development, the primary developmental task for an infant (birth to 1 year) is:",
    o: ["Trust vs. mistrust", "Autonomy vs. shame and doubt", "Initiative vs. guilt", "Industry vs. inferiority"],
    a: 0,
    r: "Erikson identified trust vs. mistrust as the developmental task for infancy (birth to 1 year). Consistent, responsive caregiving helps infants develop a sense of trust. Autonomy vs. shame and doubt occurs during the toddler years (1-3). Initiative vs. guilt is the preschool stage (3-6). Industry vs. inferiority is the school-age stage (6-12).",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a 6-month-old infant during a well-child visit. Which developmental milestone should the nurse expect to observe?",
    o: ["Sitting with support and transferring objects between hands", "Walking independently and saying 2-3 words", "Running and climbing stairs", "Building a tower of 6 blocks"],
    a: 0,
    r: "At 6 months, infants typically sit with support, transfer objects between hands, and begin to babble. Walking and speaking 2-3 words are milestones for 12 months. Running and climbing stairs are expected around 18-24 months. Building a tower of 6 blocks is a milestone for approximately 2 years of age.",
    s: "Pediatrics"
  },
  {
    q: "A parent asks the nurse when their child should be able to ride a tricycle. The nurse correctly responds that this milestone is typically achieved at which age?",
    o: ["3 years", "18 months", "5 years", "12 months"],
    a: 0,
    r: "Riding a tricycle is a gross motor milestone typically achieved around 3 years of age. At 18 months, children are typically walking well and may begin to run. At 5 years, children can skip and ride a bicycle with training wheels. At 12 months, children are typically just beginning to walk.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is teaching parents about age-appropriate play for a toddler (1-3 years). Which type of play is most characteristic of this age group?",
    o: ["Parallel play", "Cooperative play", "Organized team sports", "Solitary play exclusively"],
    a: 0,
    r: "Parallel play, where children play alongside but not directly with each other, is characteristic of toddlers. Cooperative play, involving shared goals and rules, develops in preschool and school-age children. Organized team sports are appropriate for school-age children. While toddlers do engage in some solitary play, parallel play is the distinguishing feature of this developmental stage.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is evaluating a 4-year-old child's language development. Which finding would require further assessment?",
    o: ["The child speaks in 2-word sentences only", "The child uses sentences of 4-5 words", "The child asks many questions", "The child can tell a simple story"],
    a: 0,
    r: "By age 4, children should be speaking in sentences of 4-5 words or more. Speaking only in 2-word sentences at age 4 is significantly below expected language development and warrants further evaluation for speech delay or hearing impairment. Asking many questions, using full sentences, and telling simple stories are all expected for a 4-year-old.",
    s: "Pediatrics"
  },
  {
    q: "A school-age child (8 years old) tells the nurse they are worried about not being as good at math as their classmates. According to Erikson, this child is working through which developmental stage?",
    o: ["Industry vs. inferiority", "Identity vs. role confusion", "Initiative vs. guilt", "Trust vs. mistrust"],
    a: 0,
    r: "Industry vs. inferiority is the developmental task for school-age children (6-12 years). During this stage, children develop competence through academic and social achievements. Feelings of inadequacy can lead to a sense of inferiority. Identity vs. role confusion occurs during adolescence. Initiative vs. guilt is the preschool stage. Trust vs. mistrust is the infant stage.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is screening a 2-year-old for autism spectrum disorder. Which behavior would be a concerning finding?",
    o: ["Absence of pointing to share interest or communicate needs", "Engaging in parallel play with another toddler", "Having occasional temper tantrums", "Showing stranger anxiety"],
    a: 0,
    r: "Lack of pointing or joint attention behaviors by 12-18 months is an early red flag for autism spectrum disorder. By age 2, children should be using pointing to communicate interest and needs. Parallel play is normal for toddlers. Temper tantrums are common in the toddler period. Stranger anxiety typically peaks around 8-12 months and is a normal developmental phenomenon.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is providing anticipatory guidance to parents of a 9-month-old. Which safety concern is the highest priority for this age?",
    o: ["Choking and aspiration hazards from small objects", "Bicycle safety and helmet use", "Water safety during independent swimming", "Firearm safety and storage"],
    a: 0,
    r: "At 9 months, infants are exploring their environment through mouthing objects, crawling, and beginning to pull to stand. Choking on small objects is a primary safety concern as infants put everything in their mouths. Bicycle safety and independent swimming are relevant for older children. While firearm safety is always important, choking prevention is the age-specific priority.",
    s: "Pediatrics"
  },
  {
    q: "A parent reports that their 15-month-old child is not yet walking independently. The nurse should:",
    o: ["Reassure the parent that walking typically develops between 12-18 months", "Immediately refer the child for physical therapy", "Recommend the child be evaluated for cerebral palsy", "Advise the parent to use a baby walker to promote walking"],
    a: 0,
    r: "Independent walking typically develops between 12-18 months of age, so not walking at 15 months is within the normal range. The nurse should reassure the parent while continuing to monitor development. Immediate referral for physical therapy is premature unless other developmental delays are present. A cerebral palsy evaluation is not warranted based solely on this finding. Baby walkers are not recommended as they can delay walking and pose safety risks.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing an adolescent during a health visit. Which behavior indicates a normal developmental task for this age group?",
    o: ["Seeking independence from parents and forming a strong peer group identity", "Preferring to play alone rather than with peers", "Demonstrating complete financial independence", "Showing no interest in personal appearance"],
    a: 0,
    r: "According to Erikson, adolescents are in the identity vs. role confusion stage, which involves establishing a sense of self, seeking independence from parents, and forming strong peer relationships. Preferring solitary play is more characteristic of younger children. Complete financial independence is an adult milestone. Adolescents typically show increased interest in personal appearance.",
    s: "Pediatrics"
  },

  // ===== PEDIATRIC COMMON CONDITIONS (Questions 41-50) =====
  {
    q: "A nurse is caring for a 3-year-old child diagnosed with acute otitis media. Which finding does the nurse expect to observe?",
    o: ["Pulling or tugging at the affected ear with irritability and fever", "Clear rhinorrhea without fever", "Painless hearing loss in both ears", "Swollen lymph nodes in the groin area"],
    a: 0,
    r: "Acute otitis media commonly presents with ear pulling or tugging (especially in young children who cannot verbalize pain), irritability, fever, and possible purulent drainage. Clear rhinorrhea alone suggests allergic rhinitis. Painless bilateral hearing loss suggests a chronic condition. Inguinal lymphadenopathy is not associated with ear infections.",
    s: "Pediatrics"
  },
  {
    q: "A child with asthma is prescribed a metered-dose inhaler with albuterol and an inhaled corticosteroid. The nurse teaches the parent that the albuterol should be administered:",
    o: ["Before the corticosteroid inhaler to open airways for better medication delivery", "After the corticosteroid inhaler", "Only at bedtime", "Only when the child is having a severe attack"],
    a: 0,
    r: "The bronchodilator (albuterol) should be administered before the corticosteroid inhaler. Albuterol opens the airways, allowing the corticosteroid to be delivered more effectively to the lower airways. Using the corticosteroid first may result in less effective distribution. Albuterol should be used as prescribed, not just at bedtime or during severe attacks only.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a 5-year-old child who presents with a barking cough, inspiratory stridor, and mild retractions. These findings are most consistent with:",
    o: ["Croup (laryngotracheobronchitis)", "Epiglottitis", "Pneumonia", "Bronchiolitis"],
    a: 0,
    r: "Croup (laryngotracheobronchitis) classically presents with a barking (seal-like) cough, inspiratory stridor, and hoarseness. It is most common in children ages 6 months to 3 years but can occur up to age 5. Epiglottitis presents with drooling, high fever, and tripod positioning. Pneumonia presents with productive cough and crackles. Bronchiolitis typically affects infants with wheezing and tachypnea.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is teaching a parent about caring for a child with a febrile seizure. Which instruction is most important?",
    o: ["Place the child on their side and do not put anything in the mouth during the seizure", "Restrain the child to prevent injury during the seizure", "Place a padded tongue blade between the teeth", "Immerse the child in cold water to reduce the fever quickly"],
    a: 0,
    r: "During a febrile seizure, the child should be placed on their side to maintain airway patency and prevent aspiration. Nothing should be placed in the mouth as it can cause injury. Restraining the child can cause musculoskeletal injury. Cold water immersion can cause shivering, which generates more heat and can cause shock.",
    s: "Pediatrics"
  },
  {
    q: "A 2-year-old child is brought to the clinic with a 2-day history of watery diarrhea and decreased oral intake. The nurse notes decreased skin turgor, dry mucous membranes, and decreased urine output. The priority intervention is:",
    o: ["Initiate oral rehydration therapy", "Administer an antidiarrheal medication", "Start the child on a clear liquid diet for 48 hours", "Restrict all oral intake to rest the bowel"],
    a: 0,
    r: "The child is showing signs of dehydration (decreased skin turgor, dry mucous membranes, decreased urine output). Oral rehydration therapy with appropriate electrolyte solutions is the first-line treatment for mild to moderate dehydration in children. Antidiarrheal medications are generally not recommended for young children. A clear liquid diet alone may not provide adequate electrolytes. Restricting oral intake worsens dehydration.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a child with type 1 diabetes mellitus who is irritable, trembling, and sweating. Blood glucose is 3.2 mmol/L. What is the priority intervention?",
    o: ["Give the child 15 grams of a fast-acting carbohydrate such as juice", "Administer rapid-acting insulin", "Have the child eat a full meal", "Encourage the child to rest and recheck glucose in 1 hour"],
    a: 0,
    r: "Blood glucose of 3.2 mmol/L with symptoms of irritability, trembling, and sweating indicates hypoglycemia. The priority is to administer 15 grams of fast-acting carbohydrate (such as 4 oz of juice or glucose tablets) and recheck glucose in 15 minutes. Administering insulin would worsen hypoglycemia. A full meal takes too long to raise blood glucose. Waiting an hour could lead to loss of consciousness or seizures.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a child with suspected appendicitis. Which finding most strongly supports this diagnosis?",
    o: ["Rebound tenderness at McBurney's point with guarding", "Diffuse abdominal tenderness that improves with eating", "Left lower quadrant pain with diarrhea", "Epigastric pain that radiates to the back"],
    a: 0,
    r: "Appendicitis classically presents with rebound tenderness at McBurney's point (one-third the distance from the right anterior superior iliac spine to the umbilicus) with abdominal guarding. Diffuse tenderness improving with eating suggests gastritis. Left lower quadrant pain with diarrhea may suggest colitis. Epigastric pain radiating to the back is more consistent with pancreatitis.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for an infant diagnosed with respiratory syncytial virus (RSV) bronchiolitis. Which intervention is most important?",
    o: ["Maintain adequate hydration and monitor respiratory status closely", "Administer antibiotics as ordered", "Encourage vigorous coughing and deep breathing", "Place the infant in a prone position to improve ventilation"],
    a: 0,
    r: "RSV bronchiolitis is a viral infection, so treatment is primarily supportive. Maintaining hydration and closely monitoring respiratory status (including oxygen saturation, respiratory rate, and signs of respiratory distress) are the priorities. Antibiotics are ineffective against viral infections. Infants cannot perform coughing and deep breathing exercises. Prone positioning is not standard for bronchiolitis management.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is teaching parents about iron deficiency anemia prevention in toddlers. Which dietary recommendation is most appropriate?",
    o: ["Limit cow's milk to 500 mL per day and offer iron-rich foods", "Encourage unlimited cow's milk intake to promote growth", "Avoid all meat products until age 3", "Give the toddler iron supplements instead of dietary modifications"],
    a: 0,
    r: "Excessive cow's milk intake (more than 500-720 mL/day) is a common cause of iron deficiency anemia in toddlers because milk is low in iron and can decrease appetite for iron-rich foods. Cow's milk also interferes with iron absorption. Limiting milk and offering iron-rich foods such as fortified cereals, lean meats, and beans is the recommended approach. Supplements may be needed but dietary modification is the first-line intervention.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a child with a new diagnosis of celiac disease. The nurse teaches the parents that the child must avoid which food?",
    o: ["Wheat bread and pasta", "Rice and corn", "Fresh fruits and vegetables", "Potatoes and sweet potatoes"],
    a: 0,
    r: "Celiac disease is an autoimmune disorder triggered by gluten, which is found in wheat, barley, and rye. Wheat bread and pasta contain gluten and must be eliminated from the diet. Rice, corn, potatoes, sweet potatoes, fresh fruits, and vegetables are naturally gluten-free and safe for children with celiac disease.",
    s: "Pediatrics"
  },

  // ===== GERIATRIC CARE (Questions 51-60) =====
  {
    q: "A nurse is assessing an 82-year-old client who has been admitted after a fall. Which age-related change most contributes to fall risk in older adults?",
    o: ["Decreased proprioception and balance", "Increased bone density", "Enhanced night vision", "Improved muscle strength"],
    a: 0,
    r: "Aging causes decreased proprioception (position sense), balance impairment, and reduced reaction time, all of which increase fall risk. Bone density decreases with age (osteopenia/osteoporosis), making fractures more likely with falls. Night vision declines with age. Muscle strength decreases (sarcopenia) rather than improves.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is caring for an elderly client who reports difficulty swallowing solid foods and occasionally chokes on liquids. Which intervention is most appropriate?",
    o: ["Request a swallowing evaluation by a speech-language pathologist", "Encourage the client to eat quickly to reduce fatigue", "Provide only thin liquids to prevent choking", "Insert a nasogastric tube for all feedings"],
    a: 0,
    r: "Dysphagia (difficulty swallowing) in the elderly requires evaluation by a speech-language pathologist to determine the type and severity of the swallowing dysfunction and recommend appropriate diet modifications. Eating quickly increases aspiration risk. Thin liquids are often more difficult to control and may worsen aspiration risk. A nasogastric tube is not the first intervention for new-onset dysphagia.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is reviewing medications for a 78-year-old client. Which medication is most commonly associated with increased fall risk in the elderly?",
    o: ["Benzodiazepines", "Acetaminophen", "Vitamin D supplements", "Calcium carbonate"],
    a: 0,
    r: "Benzodiazepines cause sedation, impaired coordination, and dizziness, significantly increasing fall risk in older adults. They are listed on the Beers Criteria as potentially inappropriate medications for elderly patients. Acetaminophen does not typically cause dizziness or sedation. Vitamin D and calcium supplements actually help prevent falls by supporting bone and muscle health.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is assessing an elderly client for delirium. Which characteristic distinguishes delirium from dementia?",
    o: ["Delirium has an acute onset with fluctuating levels of consciousness", "Delirium develops gradually over months to years", "Dementia presents with acute confusion and hallucinations", "Dementia is always reversible with treatment"],
    a: 0,
    r: "Delirium is characterized by acute onset (hours to days), fluctuating levels of consciousness, inattention, and often an identifiable cause (infection, medication, dehydration). Dementia has a gradual onset over months to years with stable consciousness. While dementia may include behavioral symptoms, acute confusion with fluctuating awareness is the hallmark of delirium. Most dementias are irreversible.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is providing skin care for an elderly client who is at risk for pressure injuries. Which intervention is most effective for prevention?",
    o: ["Reposition the client at least every 2 hours", "Massage bony prominences vigorously to improve circulation", "Keep the skin moist at all times", "Use a donut-shaped cushion when the client is sitting"],
    a: 0,
    r: "Repositioning at least every 2 hours is the cornerstone of pressure injury prevention, as it relieves sustained pressure on bony prominences. Massaging bony prominences can damage fragile capillaries and worsen tissue injury. Excessive moisture increases skin breakdown risk. Donut cushions concentrate pressure around the edges and increase risk of pressure injury rather than preventing it.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is caring for a 75-year-old client with urinary incontinence. The client is embarrassed and limits fluid intake. Which nursing intervention is most appropriate?",
    o: ["Educate the client that adequate fluid intake is important and establish a toileting schedule", "Agree that limiting fluids will help reduce incontinence", "Apply an indwelling urinary catheter for comfort", "Advise the client to avoid all social activities"],
    a: 0,
    r: "Fluid restriction can lead to dehydration and concentrated urine, which can irritate the bladder and worsen incontinence. A scheduled toileting program (prompted voiding or timed voiding) helps manage incontinence while maintaining adequate hydration. Indwelling catheters increase infection risk and are not appropriate for managing incontinence alone. Social isolation is detrimental to mental health.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is assessing nutritional status in an elderly client. Which finding is most concerning for malnutrition?",
    o: ["Unintentional weight loss of 5% in the past month", "Body mass index of 24", "Eating three meals per day with occasional snacks", "Having dentures that fit properly"],
    a: 0,
    r: "Unintentional weight loss of 5% or more in one month is a significant indicator of malnutrition in the elderly and requires further evaluation. A BMI of 24 is within the normal range. Eating three meals with snacks suggests adequate intake. Well-fitting dentures support adequate nutrition rather than indicating concern.",
    s: "Geriatrics"
  },
  {
    q: "An elderly client with early-stage Alzheimer's disease becomes agitated and confused in the late afternoon. The nurse recognizes this pattern as:",
    o: ["Sundowning", "Delirium", "Depression", "Medication side effect"],
    a: 0,
    r: "Sundowning refers to increased confusion, agitation, and behavioral disturbances that typically occur in the late afternoon or evening in clients with dementia. It may be related to fatigue, decreased lighting, or disruption of circadian rhythms. While delirium can cause confusion, the consistent late-afternoon pattern is characteristic of sundowning. Depression and medication effects typically do not follow this specific time pattern.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is educating a family about caring for their elderly parent with osteoporosis. Which instruction is most important for fracture prevention?",
    o: ["Remove throw rugs and ensure adequate lighting to prevent falls", "Encourage bed rest to protect fragile bones", "Advise wearing high-heeled shoes for better posture", "Recommend avoiding all physical activity"],
    a: 0,
    r: "Environmental modifications such as removing throw rugs, ensuring adequate lighting, and installing grab bars are essential for fall prevention in clients with osteoporosis. Falls are the leading cause of fractures in this population. Bed rest worsens bone loss and muscle weakness. High-heeled shoes increase fall risk. Weight-bearing physical activity actually helps maintain bone density.",
    s: "Geriatrics"
  },
  {
    q: "A nurse is assessing an elderly client for elder abuse. Which finding raises the greatest concern?",
    o: ["Multiple bruises in various stages of healing on the arms and trunk", "A single bruise on the shin from bumping into furniture", "Mild forgetfulness about recent events", "Preference for having a family member present during the visit"],
    a: 0,
    r: "Multiple bruises in various stages of healing on areas not typically associated with accidental injury (arms, trunk) are a red flag for physical elder abuse. A single bruise on the shin from a known mechanism is consistent with an accidental injury. Mild forgetfulness can be a normal age-related change. While caregiver presence during visits can sometimes indicate controlling behavior, it is not in itself a definitive sign of abuse.",
    s: "Geriatrics"
  },

  // ===== COMMUNITY HEALTH & HOME CARE (Questions 61-70) =====
  {
    q: "A home care nurse is conducting an initial home safety assessment for an elderly client recently discharged after a hip fracture. Which finding requires the most urgent intervention?",
    o: ["Loose throw rugs on hardwood floors throughout the home", "A well-stocked kitchen with canned goods", "A bathroom located on the same floor as the bedroom", "A telephone within reach of the client's bed"],
    a: 0,
    r: "Loose throw rugs on hardwood floors are a significant fall hazard, especially for an elderly client recovering from a hip fracture. This requires immediate intervention (removal or securing with non-slip backing). A well-stocked kitchen, same-floor bathroom, and accessible telephone are positive safety features that do not require intervention.",
    s: "Community Health"
  },
  {
    q: "A community health nurse is planning a health education program for a senior center. Which topic is most relevant for this population?",
    o: ["Fall prevention and medication safety", "Prenatal nutrition and exercise", "Adolescent substance abuse prevention", "Pediatric immunization schedules"],
    a: 0,
    r: "Fall prevention and medication safety are the most relevant topics for a senior population, as falls and medication errors/interactions are leading causes of morbidity in the elderly. Prenatal nutrition is relevant for pregnant women. Adolescent substance abuse is relevant for teens. Pediatric immunizations are relevant for children and their parents.",
    s: "Community Health"
  },
  {
    q: "A home care nurse visits a client with diabetes who lives alone. The nurse discovers that the client has been reusing insulin syringes multiple times. The nurse should:",
    o: ["Educate the client about the risks of reusing syringes and assess barriers to obtaining new supplies", "Report the client to adult protective services", "Discontinue home care visits", "Ignore the finding as it is the client's personal choice"],
    a: 0,
    r: "Reusing insulin syringes increases the risk of infection, inaccurate dosing (due to dulled needles), and lipodystrophy at injection sites. The nurse should educate the client about these risks and assess potential barriers (financial, access, knowledge) to using new syringes. This is not a reportable situation for protective services. Discontinuing visits is not appropriate. Ignoring the finding is a missed opportunity for patient education.",
    s: "Community Health"
  },
  {
    q: "A public health nurse is investigating a foodborne illness outbreak at a community event. What is the first step in the investigation?",
    o: ["Identify and interview all persons who are ill to determine common exposures", "Close all restaurants in the area", "Vaccinate all attendees", "Prescribe antibiotics prophylactically to all attendees"],
    a: 0,
    r: "The first step in an outbreak investigation is to identify and interview affected individuals to determine common exposures (food, water, location, timing) and establish a case definition. Closing all restaurants is premature without identifying the source. There are no vaccines for most foodborne illnesses. Prophylactic antibiotics are not indicated without identifying the causative organism.",
    s: "Community Health"
  },
  {
    q: "A community health nurse is providing education about carbon monoxide poisoning prevention. Which instruction is most important?",
    o: ["Install carbon monoxide detectors on every level of the home", "Open windows only during the summer months", "Use a gas oven to heat the home during cold weather", "Run a car engine in a closed garage to warm it up"],
    a: 0,
    r: "Carbon monoxide detectors should be installed on every level of the home, especially near sleeping areas. Carbon monoxide is an odorless, colorless gas that can be lethal. Opening windows seasonally does not provide consistent protection. Using a gas oven for heating produces carbon monoxide. Running a car in a closed garage is a leading cause of carbon monoxide poisoning.",
    s: "Community Health"
  },
  {
    q: "A home health nurse is teaching wound care to a client's family member who will be changing dressings at home. Which principle is most important to emphasize?",
    o: ["Perform hand hygiene before and after wound care", "Use the same gloves for wound cleaning and dressing application", "Store wound care supplies in the bathroom for convenience", "Dispose of used dressings in the kitchen trash can"],
    a: 0,
    r: "Hand hygiene before and after wound care is the most important infection prevention principle. Clean technique (medical asepsis) is appropriate for most home wound care. Gloves should be changed between wound cleaning and dressing application to prevent contamination. Supplies should be stored in a clean, dry area, not the bathroom. Used dressings should be double-bagged and disposed of properly.",
    s: "Community Health"
  },
  {
    q: "A community nurse is working with a family that has limited access to healthy food options. This situation is best described as:",
    o: ["Food insecurity", "Food contamination", "Malabsorption syndrome", "Eating disorder"],
    a: 0,
    r: "Food insecurity is the lack of consistent access to enough food for an active, healthy life. This is a significant social determinant of health that affects nutrition, chronic disease management, and overall well-being. Food contamination refers to the presence of harmful substances in food. Malabsorption syndrome is a medical condition. Eating disorders are psychiatric conditions involving abnormal eating behaviors.",
    s: "Community Health"
  },
  {
    q: "A home care nurse notices that a client's living environment has excessive clutter, spoiled food in the refrigerator, and the client appears unkempt. The client lives alone and has mild cognitive impairment. The nurse's priority is to:",
    o: ["Assess the client's ability to perform activities of daily living and arrange appropriate support services", "Clean the entire house for the client", "Immediately relocate the client to a long-term care facility", "Contact law enforcement to report the living conditions"],
    a: 0,
    r: "The nurse should assess the client's functional abilities (ADLs and IADLs) to determine the level of support needed. Arranging home services such as home health aides, meal delivery, or housekeeping can help maintain independence safely. Cleaning for the client does not address the underlying issue. Relocation should be a last resort. Law enforcement involvement is not appropriate unless there is an immediate safety threat.",
    s: "Community Health"
  },
  {
    q: "A nurse is developing a discharge plan for a client going home with a new colostomy. Which community resource is most appropriate to include in the referral?",
    o: ["A certified wound, ostomy, and continence nurse for follow-up education", "A physical therapist for strengthening exercises", "A nutritionist for weight loss counseling", "A social worker for housing assistance"],
    a: 0,
    r: "A certified wound, ostomy, and continence (WOC) nurse specializes in ostomy care and can provide ongoing education, support, and troubleshooting for new ostomy patients. While physical therapy, nutrition counseling, and social work may be beneficial depending on the client's needs, WOC nursing is the most directly relevant resource for colostomy management.",
    s: "Community Health"
  },
  {
    q: "A community health nurse is educating residents about emergency preparedness. Which recommendation is most important to include?",
    o: ["Maintain a supply of essential medications for at least 72 hours", "Store emergency supplies in the attic only", "Rely solely on emergency services for assistance during disasters", "Keep all important documents in a single unsecured location"],
    a: 0,
    r: "During emergencies, access to pharmacies and healthcare may be disrupted. Maintaining at least a 72-hour supply of essential medications ensures continuity of care. Supplies should be stored in accessible locations, not just the attic. Self-sufficiency for at least 72 hours is recommended because emergency services may be overwhelmed. Important documents should be kept in waterproof, secure containers.",
    s: "Community Health"
  },

  // ===== IMMUNIZATIONS & HEALTH PROMOTION (Questions 71-80) =====
  {
    q: "A parent asks the nurse when their newborn should receive the first hepatitis B vaccine. The nurse correctly responds:",
    o: ["Within 24 hours of birth", "At 2 months of age", "At 6 months of age", "At 12 months of age"],
    a: 0,
    r: "The hepatitis B vaccine is recommended within 24 hours of birth as the first dose. This is especially important because newborns exposed to hepatitis B during delivery are at high risk for chronic infection. The second dose is given at 1-2 months, and the third dose at 6-18 months. Delaying the first dose beyond 24 hours increases the risk of perinatal transmission.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is preparing to administer vaccines to a 2-month-old infant. The parent reports the infant had a mild cold with a low-grade fever of 37.8 degrees Celsius yesterday but is afebrile today. What is the appropriate action?",
    o: ["Administer the vaccines as scheduled", "Postpone all vaccines until the infant is completely symptom-free for 2 weeks", "Administer only half the recommended doses", "Cancel the appointment and reschedule in 6 months"],
    a: 0,
    r: "A mild illness with low-grade fever is not a contraindication to vaccination. Vaccines can be administered as scheduled. Postponing vaccines for minor illnesses can leave children unprotected during critical periods. Reducing doses is not recommended and would not provide adequate immunity. A 6-month delay could leave the infant vulnerable to vaccine-preventable diseases.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is educating parents about the MMR vaccine. Which statement by the parent indicates a correct understanding?",
    o: ["The first dose is given at 12-15 months and the second dose at 4-6 years", "The vaccine should be given at birth", "Only one dose is needed for lifetime protection", "The vaccine protects against chickenpox"],
    a: 0,
    r: "The MMR (measles, mumps, rubella) vaccine first dose is given at 12-15 months and the second dose at 4-6 years. It is not given at birth because maternal antibodies may interfere with the immune response. Two doses are required for adequate protection. The MMR vaccine does not protect against chickenpox; the varicella vaccine is given for that purpose.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is conducting a health screening at a community fair. Which screening test is recommended annually for adults aged 50 and older?",
    o: ["Colorectal cancer screening", "Bone density scan", "Cardiac catheterization", "Chest X-ray"],
    a: 0,
    r: "Colorectal cancer screening is recommended beginning at age 45-50, with various methods including annual fecal occult blood testing or fecal immunochemical testing, or colonoscopy every 10 years. Bone density scans are recommended for women at age 65 and men at age 70, or earlier with risk factors. Cardiac catheterization is a diagnostic procedure, not a screening test. Routine chest X-rays are not recommended for asymptomatic adults.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is teaching a group of adolescents about human papillomavirus (HPV) vaccination. Which information is most accurate?",
    o: ["The HPV vaccine is recommended for both males and females starting at age 11-12", "The HPV vaccine is only for females", "The vaccine is given as a single dose with no boosters needed", "The vaccine should be administered after the onset of sexual activity"],
    a: 0,
    r: "The HPV vaccine is recommended for both males and females starting at ages 11-12, before the onset of sexual activity, for maximum effectiveness. It is a 2- or 3-dose series depending on age at initiation. The vaccine prevents HPV-related cancers in both sexes. Ideally, vaccination occurs before potential HPV exposure.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is providing health promotion education to an adult client. Which recommendation is consistent with current guidelines for cardiovascular health?",
    o: ["Engage in at least 150 minutes of moderate-intensity aerobic activity per week", "Exercise vigorously for 30 minutes once per week", "Avoid all physical activity if blood pressure is elevated", "Limit exercise to stretching and flexibility activities only"],
    a: 0,
    r: "Current guidelines recommend at least 150 minutes per week of moderate-intensity aerobic activity (such as brisk walking) or 75 minutes of vigorous-intensity activity for cardiovascular health. Exercising only once per week is insufficient. Physical activity is generally recommended even with elevated blood pressure (with medical clearance). A comprehensive exercise program should include aerobic, strength, and flexibility components.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is educating a client about the importance of the annual influenza vaccine. The client states they got the flu from the vaccine last year. Which response is most accurate?",
    o: ["The injectable influenza vaccine contains inactivated virus and cannot cause the flu", "The influenza vaccine does contain live virus that can cause mild flu symptoms", "The client should not receive the vaccine again if they had a reaction", "The vaccine is only needed once in a lifetime"],
    a: 0,
    r: "The injectable influenza vaccine is made from inactivated (killed) virus particles and cannot cause influenza. Some people experience mild side effects (soreness, low-grade fever) that may be mistaken for flu symptoms. The nasal spray version contains weakened live virus but is not the injectable form. Annual vaccination is recommended because influenza strains change each year.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is performing a health risk assessment for a 45-year-old female client. Which screening is recommended at this age?",
    o: ["Annual mammography screening for breast cancer", "Colonoscopy every 2 years", "Prostate-specific antigen testing", "Bone density scan"],
    a: 0,
    r: "Mammography screening for breast cancer is generally recommended to begin at age 40-50 depending on guidelines and risk factors. For a 45-year-old woman, annual or biennial mammography is appropriate. Colonoscopy begins at age 45-50 but is typically every 10 years, not 2 years. PSA testing is for males. Bone density scans are recommended at age 65 for women without risk factors.",
    s: "Health Promotion"
  },
  {
    q: "A community nurse is promoting smoking cessation. Which approach is most effective as a first-line intervention?",
    o: ["Combining behavioral counseling with pharmacotherapy such as nicotine replacement", "Recommending the client switch to smokeless tobacco", "Advising the client to reduce consumption by one cigarette per day", "Telling the client smoking is harmful and leaving the decision to them"],
    a: 0,
    r: "Evidence shows that combining behavioral counseling with pharmacotherapy (nicotine replacement therapy, bupropion, or varenicline) is the most effective approach to smoking cessation. Switching to smokeless tobacco does not eliminate cancer risk. Gradual reduction alone is less effective than combined therapy. Simply advising without offering support and resources is less likely to result in successful cessation.",
    s: "Health Promotion"
  },
  {
    q: "A nurse is teaching a client about the pneumococcal vaccine. Which client should receive the pneumococcal polysaccharide vaccine (PPSV23)?",
    o: ["A 68-year-old adult with chronic obstructive pulmonary disease", "A healthy 25-year-old with no chronic conditions", "A 10-year-old child with no risk factors", "A 30-year-old athlete with no medical history"],
    a: 0,
    r: "PPSV23 is recommended for all adults aged 65 and older and for adults aged 19-64 with certain chronic conditions such as COPD, heart disease, diabetes, or immunocompromising conditions. A 68-year-old with COPD meets both age and condition criteria. Healthy young adults and children without risk factors do not typically need this vaccine.",
    s: "Health Promotion"
  },

  // ===== RENAL & URINARY (Questions 81-90) =====
  {
    q: "A nurse is caring for a client with a urinary tract infection (UTI). Which instruction is most important to include in the client's education?",
    o: ["Complete the full course of prescribed antibiotics even if symptoms improve", "Stop taking antibiotics as soon as symptoms resolve", "Reduce fluid intake to decrease urinary frequency", "Use scented bath products to mask odor"],
    a: 0,
    r: "Completing the full antibiotic course is essential to eradicate the infection completely and prevent antibiotic resistance. Stopping early can lead to recurrent or resistant infections. Increased (not decreased) fluid intake helps flush bacteria from the urinary tract. Scented bath products can irritate the urethra and worsen symptoms.",
    s: "Renal"
  },
  {
    q: "A nurse is monitoring a client with chronic kidney disease (CKD). Which laboratory finding is most consistent with worsening kidney function?",
    o: ["Rising serum creatinine and blood urea nitrogen (BUN) levels", "Decreasing serum potassium levels", "Increasing hemoglobin levels", "Decreasing serum phosphorus levels"],
    a: 0,
    r: "Rising creatinine and BUN indicate decreased glomerular filtration and worsening kidney function. CKD typically causes hyperkalemia (elevated potassium), not hypokalemia. Hemoglobin typically decreases in CKD due to reduced erythropoietin production. Phosphorus levels typically increase in CKD because the kidneys cannot excrete phosphorus effectively.",
    s: "Renal"
  },
  {
    q: "A client with a urinary catheter develops cloudy, foul-smelling urine with sediment. The nurse should first:",
    o: ["Assess the client's temperature and report findings to the healthcare provider", "Flush the catheter with sterile saline", "Remove the catheter immediately", "Increase the IV fluid rate"],
    a: 0,
    r: "Cloudy, foul-smelling urine with sediment in a catheterized client suggests a catheter-associated urinary tract infection (CAUTI). The nurse should assess for additional signs of infection (fever, suprapubic tenderness) and notify the provider for urine culture and treatment orders. Flushing may introduce more bacteria. Removing the catheter requires a provider order. Increasing fluids alone does not address the infection.",
    s: "Renal"
  },
  {
    q: "A nurse is educating a client about preventing kidney stones. Which dietary recommendation is most appropriate?",
    o: ["Increase fluid intake to at least 2-3 liters per day", "Restrict all calcium-containing foods", "Increase intake of high-oxalate foods", "Decrease daily fluid intake"],
    a: 0,
    r: "Adequate hydration (2-3 liters/day) is the most important preventive measure for kidney stones, as it dilutes urine and reduces stone formation. Moderate dietary calcium is actually protective against calcium oxalate stones. High-oxalate foods (spinach, chocolate, nuts) may increase stone risk in susceptible individuals. Restricting fluids increases urine concentration and stone risk.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client receiving peritoneal dialysis who reports abdominal pain and the dialysate return is cloudy. The nurse suspects:",
    o: ["Peritonitis", "Bowel obstruction", "Urinary retention", "Normal dialysis finding"],
    a: 0,
    r: "Cloudy dialysate return with abdominal pain is the hallmark of peritonitis, a serious complication of peritoneal dialysis. The nurse should obtain a sample of the effluent for culture and sensitivity and notify the provider immediately. Bowel obstruction presents differently. Urinary retention is unrelated to dialysate. Clear dialysate return is normal; cloudy return is always abnormal.",
    s: "Renal"
  },
  {
    q: "A client with end-stage renal disease asks why they must limit potassium in their diet. The nurse explains that excess potassium can lead to:",
    o: ["Life-threatening cardiac arrhythmias", "Increased bone density", "Improved muscle strength", "Enhanced nerve conduction"],
    a: 0,
    r: "Hyperkalemia (elevated potassium) is a life-threatening complication of renal failure because it can cause fatal cardiac arrhythmias including ventricular fibrillation and cardiac arrest. The kidneys normally excrete potassium; when they fail, potassium accumulates. Excess potassium does not improve bone density, muscle strength, or nerve conduction; it impairs cardiac conduction.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client with an indwelling urinary catheter. Which practice is essential for preventing catheter-associated urinary tract infection?",
    o: ["Keep the drainage bag below the level of the bladder at all times", "Clamp the catheter for 2 hours at a time to train the bladder", "Disconnect the tubing regularly to empty small amounts", "Irrigate the catheter with antiseptic solution daily"],
    a: 0,
    r: "Keeping the drainage bag below bladder level prevents backflow of urine into the bladder, reducing infection risk. Clamping the catheter increases stasis and infection risk. Breaking the closed drainage system by disconnecting tubing introduces bacteria. Routine catheter irrigation with antiseptic has not been shown to prevent infection and may cause irritation.",
    s: "Renal"
  },
  {
    q: "A client is diagnosed with acute glomerulonephritis. Which assessment finding does the nurse expect?",
    o: ["Periorbital edema, dark-colored urine, and hypertension", "Polyuria and polydipsia", "Clear and dilute urine output", "Weight loss and dehydration"],
    a: 0,
    r: "Acute glomerulonephritis presents with periorbital and peripheral edema, dark or cola-colored urine (due to hematuria and proteinuria), hypertension, and oliguria. Polyuria and polydipsia are associated with diabetes. Clear dilute urine suggests adequate hydration, not kidney inflammation. Weight gain from fluid retention, not weight loss, is expected.",
    s: "Renal"
  },
  {
    q: "A nurse is teaching a female client about urinary tract infection prevention. Which instruction is most appropriate?",
    o: ["Wipe from front to back after toileting", "Take prophylactic antibiotics daily", "Use douches regularly for hygiene", "Wear nylon underwear to prevent moisture"],
    a: 0,
    r: "Wiping from front to back prevents the transfer of bacteria from the rectal area to the urethral opening, reducing UTI risk. Prophylactic antibiotics are not recommended routinely and contribute to resistance. Douching disrupts normal vaginal flora and can increase infection risk. Cotton underwear is preferred over nylon because it allows moisture to evaporate, keeping the area dry.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client on hemodialysis. Which assessment finding at the arteriovenous fistula site indicates the fistula is functioning properly?",
    o: ["A palpable thrill and audible bruit over the fistula", "Absence of any sound or vibration at the site", "Cool temperature and pale skin over the fistula", "Edema and redness around the fistula site"],
    a: 0,
    r: "A properly functioning AV fistula should have a palpable thrill (vibration felt on palpation) and an audible bruit (swishing sound heard with stethoscope) indicating adequate blood flow. Absence of thrill or bruit suggests clotting. Cool temperature and pallor indicate impaired circulation. Edema and redness may indicate infection or stenosis.",
    s: "Renal"
  },

  // ===== HEMATOLOGY & LAB VALUES (Questions 91-100) =====
  {
    q: "A nurse is reviewing laboratory results for a client. Which hemoglobin level indicates anemia in an adult female?",
    o: ["100 g/L", "130 g/L", "140 g/L", "155 g/L"],
    a: 0,
    r: "Normal hemoglobin for adult females is approximately 120-160 g/L (12-16 g/dL). A hemoglobin of 100 g/L (10 g/dL) is below the normal range and indicates anemia. Values of 130, 140, and 155 g/L are all within the normal range for adult females.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client receiving a blood transfusion. Ten minutes after starting the transfusion, the client develops chills, fever, and low back pain. What is the nurse's priority action?",
    o: ["Stop the transfusion immediately and maintain IV access with normal saline", "Slow the transfusion rate and continue monitoring", "Administer acetaminophen and continue the transfusion", "Increase the transfusion rate to finish more quickly"],
    a: 0,
    r: "Chills, fever, and low back pain shortly after starting a blood transfusion indicate a transfusion reaction (possibly hemolytic). The transfusion must be stopped immediately, IV access maintained with normal saline (using new tubing), and the provider and blood bank notified. Slowing the rate or continuing the transfusion could be fatal. Increasing the rate would worsen the reaction.",
    s: "Hematology"
  },
  {
    q: "A client's laboratory results show a platelet count of 40 x 10^9/L. Which nursing intervention is most appropriate?",
    o: ["Implement bleeding precautions including use of a soft toothbrush and electric razor", "Encourage vigorous exercise to stimulate platelet production", "Administer aspirin for pain management", "Perform firm rectal temperature measurements"],
    a: 0,
    r: "Normal platelet count is 150-400 x 10^9/L. A count of 40 x 10^9/L indicates severe thrombocytopenia with high bleeding risk. Bleeding precautions include using a soft toothbrush, electric razor, avoiding invasive procedures, and monitoring for bleeding. Vigorous exercise could cause bleeding. Aspirin inhibits platelet function. Rectal procedures risk mucosal bleeding.",
    s: "Hematology"
  },
  {
    q: "A nurse is interpreting a client's complete blood count (CBC). An elevated white blood cell count of 18.5 x 10^9/L most likely indicates:",
    o: ["An active infection or inflammatory process", "Dehydration", "Iron deficiency anemia", "Chronic liver disease"],
    a: 0,
    r: "Normal WBC count is 4.5-11.0 x 10^9/L. An elevated WBC count (leukocytosis) of 18.5 x 10^9/L most commonly indicates infection or inflammation as the immune system produces more white blood cells to fight the threat. Dehydration may cause hemoconcentration but does not typically cause this level of leukocytosis. Iron deficiency affects red blood cells, not white. Chronic liver disease may cause leukopenia.",
    s: "Hematology"
  },
  {
    q: "A nurse is monitoring a client receiving warfarin therapy. Which laboratory test is used to monitor the therapeutic effect of warfarin?",
    o: ["International Normalized Ratio (INR)", "Activated partial thromboplastin time (aPTT)", "Platelet count", "Fibrinogen level"],
    a: 0,
    r: "INR (International Normalized Ratio) is the standard test for monitoring warfarin therapy, with a therapeutic range typically between 2.0-3.0 for most indications. aPTT is used to monitor heparin therapy. Platelet count measures platelet numbers but not warfarin effect. Fibrinogen measures a clotting factor but is not used to monitor warfarin specifically.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client with sickle cell disease who presents with sudden severe bone pain, fever, and swelling of the hands and feet. The nurse recognizes this as:",
    o: ["Vaso-occlusive (pain) crisis", "Aplastic crisis", "Sequestration crisis", "Hemolytic crisis"],
    a: 0,
    r: "A vaso-occlusive (pain) crisis is the most common type of sickle cell crisis and occurs when sickled red blood cells obstruct blood flow, causing ischemia and severe pain, often in the bones and joints. Fever and extremity swelling accompany the pain. Aplastic crisis involves bone marrow suppression. Sequestration crisis involves sudden splenic pooling of blood. Hemolytic crisis involves accelerated RBC destruction.",
    s: "Hematology"
  },
  {
    q: "A nurse is reviewing a client's coagulation studies. The aPTT is 85 seconds (normal: 25-35 seconds) while the client is receiving IV heparin. What action should the nurse take?",
    o: ["Hold the heparin infusion and notify the healthcare provider", "Continue the infusion at the current rate", "Increase the heparin infusion rate", "Administer vitamin K intramuscularly"],
    a: 0,
    r: "An aPTT of 85 seconds is significantly above the therapeutic range (typically 1.5-2.5 times normal, or approximately 46-70 seconds), indicating over-anticoagulation and increased bleeding risk. The heparin should be held, and the provider notified for further orders. Continuing or increasing the rate risks hemorrhage. Vitamin K reverses warfarin, not heparin; protamine sulfate is the heparin antidote.",
    s: "Hematology"
  },
  {
    q: "A client is diagnosed with iron deficiency anemia. The nurse teaches the client to take iron supplements with which beverage to enhance absorption?",
    o: ["Orange juice", "Milk", "Coffee", "Tea"],
    a: 0,
    r: "Vitamin C (ascorbic acid) found in orange juice enhances iron absorption by converting ferric iron to the more absorbable ferrous form. Milk contains calcium, which inhibits iron absorption. Coffee and tea contain tannins and polyphenols that reduce iron absorption. Taking iron supplements with vitamin C-rich foods or beverages is a standard recommendation.",
    s: "Hematology"
  },
  {
    q: "A nurse is assessing a client and notes petechiae, ecchymoses, and prolonged bleeding from a venipuncture site. These findings are most suggestive of:",
    o: ["Disseminated intravascular coagulation (DIC)", "Iron deficiency anemia", "Polycythemia vera", "Chronic lymphocytic leukemia"],
    a: 0,
    r: "DIC involves simultaneous widespread clotting and bleeding due to consumption of clotting factors and platelets. Petechiae, ecchymoses, and prolonged bleeding from puncture sites are classic signs. Iron deficiency anemia causes fatigue and pallor but not coagulation abnormalities. Polycythemia vera involves increased red blood cell production. CLL primarily affects white blood cells.",
    s: "Hematology"
  },
  {
    q: "A nurse is preparing to administer packed red blood cells (PRBCs) to a client. Which action is essential before starting the transfusion?",
    o: ["Verify blood type and cross-match with two nurses at the bedside using two client identifiers", "Administer a test dose of 50 mL rapidly over 5 minutes", "Mix the PRBCs with dextrose 5% in water for infusion", "Warm the blood in a microwave before administration"],
    a: 0,
    r: "Proper identification verification is the most critical step before blood transfusion. Two nurses must independently verify the client's identity using two identifiers and confirm the blood product matches the compatibility report. A test dose is not standard practice. PRBCs are infused with normal saline only (not dextrose, which can cause hemolysis). Blood should never be warmed in a microwave; approved blood warmers are used when needed.",
    s: "Hematology"
  }
];
