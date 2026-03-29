import type { ExamQuestion } from "./types";

export const longTermCareQuestions: ExamQuestion[] = [
  // ===== GERIATRIC ASSESSMENT (Questions 1-60) =====
  {
    q: "A nurse is performing a comprehensive geriatric assessment on a newly admitted 82-year-old resident. Which validated tool should the nurse use to screen for functional status in activities of daily living?",
    o: ["Katz Index of Independence in ADLs", "Mini-Mental State Examination", "Braden Scale", "Morse Fall Scale"],
    a: 0,
    r: "The Katz Index of Independence in ADLs assesses six functions: bathing, dressing, toileting, transferring, continence, and feeding. The MMSE screens cognition, not functional status. The Braden Scale assesses pressure injury risk. The Morse Fall Scale assesses fall risk.",
    s: "Geriatric Assessment"
  },
  {
    q: "An 87-year-old resident scores 18/30 on the Mini-Mental State Examination. The nurse should interpret this score as indicating which level of cognitive impairment?",
    o: ["Mild cognitive impairment", "Moderate cognitive impairment", "Severe cognitive impairment", "Normal cognitive function"],
    a: 0,
    r: "MMSE scores of 18-23 indicate mild cognitive impairment, 10-17 indicate moderate impairment, and less than 10 indicate severe impairment. Scores of 24-30 are considered normal. A score of 18 falls in the mild impairment range.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is assessing nutritional status in a long-term care resident who has lost 10 pounds over the past 3 months. The resident's BMI is 19. Which action should the nurse take first?",
    o: ["Obtain a comprehensive dietary intake history and calorie count", "Start a high-calorie supplement three times daily", "Request a speech therapy evaluation", "Place the resident on a pureed diet"],
    a: 0,
    r: "Before implementing interventions, the nurse must first assess the cause of weight loss through dietary history and calorie count. A BMI of 19 is underweight. Starting supplements without assessing cause may miss underlying problems such as dysphagia, depression, or medication side effects.",
    s: "Geriatric Assessment"
  },
  {
    q: "During a medication reconciliation for a 79-year-old new admission, the nurse identifies that the resident takes 14 medications. Which concern is most important to address?",
    o: ["Polypharmacy and potential drug interactions", "The resident's ability to swallow pills", "The cost of all medications", "Whether generic alternatives are available"],
    a: 0,
    r: "Polypharmacy (taking 5 or more medications) significantly increases the risk of adverse drug reactions, drug interactions, falls, and cognitive impairment in older adults. While swallowing ability and cost are relevant, the priority is assessing for potentially inappropriate medications and interactions.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse uses the Geriatric Depression Scale to screen an 84-year-old resident. The resident scores 12 out of 15. What should the nurse do next?",
    o: ["Notify the healthcare provider of the positive depression screen", "Rescreen the resident in one week", "Encourage the resident to participate in group activities", "Document the finding and continue routine care"],
    a: 0,
    r: "A score of 10 or higher on the 15-item Geriatric Depression Scale indicates probable depression requiring further evaluation and treatment. The nurse should notify the provider for diagnostic workup and potential treatment. Delaying or only encouraging activities is insufficient for a positive screen.",
    s: "Geriatric Assessment"
  },
  {
    q: "An 80-year-old resident with a history of heart failure presents with increased confusion over the past 24 hours. Vital signs are stable. Which assessment should the nurse prioritize?",
    o: ["Evaluate for delirium by assessing for acute onset and fluctuating course", "Administer a sedative for agitation", "Assume worsening dementia and increase supervision", "Order a CT scan of the head immediately"],
    a: 0,
    r: "Acute-onset confusion in an older adult should be evaluated for delirium, which has reversible causes (infection, medication changes, dehydration, constipation). The Confusion Assessment Method (CAM) can help differentiate delirium from dementia. Sedation can worsen delirium. Assuming dementia delays identifying treatable causes.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is assessing hearing in an 85-year-old resident who frequently asks for questions to be repeated. Which screening method is most appropriate in the long-term care setting?",
    o: ["Whispered voice test at 2 feet from the ear", "Weber and Rinne tuning fork tests", "Pure tone audiometry", "Acoustic immittance testing"],
    a: 0,
    r: "The whispered voice test is a simple, valid bedside screening tool for hearing loss in older adults. The nurse whispers three words or numbers at 2 feet from the ear while occluding the opposite ear. Tuning fork tests and audiometry require specialized equipment or referral.",
    s: "Geriatric Assessment"
  },
  {
    q: "A 90-year-old resident is being assessed for pain but has moderate dementia and cannot reliably self-report. Which pain assessment tool should the nurse use?",
    o: ["PAINAD (Pain Assessment in Advanced Dementia) scale", "Numeric Rating Scale (0-10)", "Wong-Baker FACES scale", "Brief Pain Inventory"],
    a: 0,
    r: "The PAINAD scale is specifically designed for patients with advanced dementia who cannot self-report. It assesses five behavioral indicators: breathing, vocalization, facial expression, body language, and consolability. Numeric and FACES scales require self-report ability. The Brief Pain Inventory is too complex for dementia patients.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse notes that a 78-year-old resident has an unsteady gait and takes small shuffling steps. The resident holds onto furniture while walking. Which assessment tool should the nurse use to evaluate this resident's mobility?",
    o: ["Timed Up and Go (TUG) test", "Braden Scale", "Glasgow Coma Scale", "Barthel Index"],
    a: 0,
    r: "The Timed Up and Go test assesses mobility by timing how long it takes a person to rise from a chair, walk 3 meters, turn, walk back, and sit down. A time greater than 12 seconds suggests increased fall risk. The Braden Scale assesses pressure injury risk. The GCS assesses consciousness. The Barthel Index assesses broader ADL function.",
    s: "Geriatric Assessment"
  },
  {
    q: "During a skin assessment on a 92-year-old resident, the nurse notes paper-thin skin on the forearms with purple discoloration. What is the most likely explanation?",
    o: ["Senile purpura from age-related capillary fragility", "Physical abuse requiring immediate reporting", "Disseminated intravascular coagulation", "Vitamin K deficiency"],
    a: 0,
    r: "Senile purpura is common in elderly individuals due to loss of subcutaneous tissue and decreased collagen support of blood vessels, resulting in easy bruising, especially on the forearms and dorsal hands. While abuse should always be considered, the pattern and location are consistent with normal aging changes.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is performing a nutritional screening on a long-term care resident using the MNA (Mini Nutritional Assessment). Which finding indicates the resident is at risk for malnutrition?",
    o: ["BMI of 20 with recent 3-pound weight loss in the past month", "BMI of 26 with stable weight", "Consuming three full meals daily", "Albumin level of 4.0 g/dL"],
    a: 0,
    r: "A BMI under 23 combined with unintentional weight loss indicates nutritional risk in older adults. A BMI of 26 with stable weight and full meal consumption suggest adequate nutrition. An albumin of 4.0 g/dL is within normal limits and suggests adequate protein status.",
    s: "Geriatric Assessment"
  },
  {
    q: "An 83-year-old resident reports difficulty seeing at night and frequently bumps into objects in dimly lit areas. Which age-related eye change is most likely contributing to this problem?",
    o: ["Decreased ability of the pupil to dilate in dim light", "Increased intraocular pressure", "Detachment of the retina", "Clouding of the vitreous humor"],
    a: 0,
    r: "Age-related changes include decreased pupil size and reduced ability of the pupil to dilate in dim light, leading to impaired dark adaptation. This is a normal aging change, not pathological. Increased intraocular pressure suggests glaucoma. Retinal detachment presents with flashes and floaters. Vitreous clouding is not the primary cause of night vision difficulty.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is evaluating an 88-year-old resident's ability to perform instrumental activities of daily living (IADLs). Which activity is classified as an IADL?",
    o: ["Managing medications independently", "Bathing without assistance", "Feeding oneself", "Transferring from bed to chair"],
    a: 0,
    r: "IADLs are more complex activities needed for independent living: medication management, telephone use, shopping, cooking, housekeeping, laundry, transportation, and finances. Bathing, feeding, and transferring are basic ADLs assessed by the Katz Index.",
    s: "Geriatric Assessment"
  },
  {
    q: "A 76-year-old resident is admitted to the long-term care facility after a hip fracture repair. The nurse should prioritize screening for which condition that is common after hip fracture in the elderly?",
    o: ["Delirium", "Diabetes mellitus", "Hypothyroidism", "Chronic obstructive pulmonary disease"],
    a: 0,
    r: "Delirium occurs in up to 50% of elderly patients after hip fracture surgery due to anesthesia, pain medications, immobility, and metabolic changes. Early identification and treatment of delirium improves outcomes. While other conditions are important, delirium is the most acute post-operative concern.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is assessing orthostatic vital signs in a 81-year-old resident who reports dizziness upon standing. Which finding confirms orthostatic hypotension?",
    o: ["Systolic BP drop of 20 mmHg or more upon standing", "Heart rate increase of 5 bpm upon standing", "Diastolic BP increase of 10 mmHg upon standing", "Systolic BP drop of 5 mmHg upon standing"],
    a: 0,
    r: "Orthostatic hypotension is defined as a drop of 20 mmHg or more in systolic BP or 10 mmHg or more in diastolic BP within 3 minutes of standing. A heart rate increase of 5 bpm and small BP changes are within normal limits.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is reviewing lab results for a 85-year-old resident with poor oral intake. The serum albumin is 2.8 g/dL. This level indicates which condition?",
    o: ["Protein-calorie malnutrition", "Adequate nutritional status", "Acute inflammation only", "Normal age-related decline"],
    a: 0,
    r: "Normal serum albumin is 3.5-5.0 g/dL. A level of 2.8 g/dL indicates protein-calorie malnutrition. While albumin is also an acute-phase reactant that decreases with inflammation, in the context of poor oral intake it primarily reflects inadequate nutrition.",
    s: "Geriatric Assessment"
  },
  {
    q: "During a comprehensive assessment, a 79-year-old resident demonstrates difficulty following a three-step command. The nurse should assess further for which condition?",
    o: ["Cognitive impairment or early dementia", "Hearing loss", "Depression", "Medication side effects"],
    a: 0,
    r: "Difficulty following multi-step commands is a hallmark of cognitive impairment. While hearing loss, depression, and medication side effects can affect comprehension, the inability to follow sequential instructions warrants formal cognitive screening with tools like the MMSE or MoCA.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is assessing a 91-year-old resident who has been losing weight despite eating well. The resident's dentures appear loose. What should the nurse do first?",
    o: ["Assess the fit of the dentures and oral cavity condition", "Increase caloric supplements between meals", "Request a dietary consult for texture modification", "Order a barium swallow study"],
    a: 0,
    r: "Ill-fitting dentures can significantly impair food intake and lead to weight loss in elderly residents. Assessment should come first before implementing interventions. Loose dentures can cause pain, poor chewing, and food avoidance.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is performing a pain assessment on a cognitively intact 86-year-old resident. The resident rates pain as 2/10 but is grimacing and guarding the right hip. What should the nurse do?",
    o: ["Explore the discrepancy between verbal report and nonverbal cues", "Accept the verbal report of 2/10 as accurate", "Document the pain as 2/10 and offer no intervention", "Administer the maximum dose of prescribed analgesic"],
    a: 0,
    r: "When verbal pain reports conflict with nonverbal behavior (grimacing, guarding), the nurse should explore this discrepancy. Older adults may underreport pain due to stoicism, fear of addiction, or belief that pain is expected with aging. Simply accepting or ignoring either signal is incomplete assessment.",
    s: "Geriatric Assessment"
  },
  {
    q: "A 77-year-old resident is admitted with a history of frequent urinary tract infections. Which assessment finding is most consistent with UTI presentation in older adults?",
    o: ["New onset confusion and behavioral changes", "Burning with urination and flank pain", "High fever of 103°F with rigors", "Gross hematuria"],
    a: 0,
    r: "In older adults, UTIs frequently present atypically with confusion, behavioral changes, agitation, or functional decline rather than the classic symptoms of dysuria, frequency, and fever seen in younger adults. The nurse should suspect UTI when acute confusion develops.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is assessing swallowing function in a 84-year-old resident who coughs during meals. Which bedside screening should the nurse perform first?",
    o: ["Water swallow test with 3 ounces of water", "Offer a cracker and observe for difficulty", "Insert a nasogastric tube for feeding", "Place the resident on NPO status permanently"],
    a: 0,
    r: "The 3-ounce water swallow test is a validated bedside screening for dysphagia. The nurse observes for coughing, choking, or wet voice quality during and after swallowing. A failed screen warrants speech therapy referral for formal evaluation. NPO status should not be implemented without proper assessment.",
    s: "Geriatric Assessment"
  },
  {
    q: "During a review of systems for a 89-year-old resident, the nurse notes the resident has not had a bowel movement in 5 days. The resident reports no discomfort. What should the nurse do?",
    o: ["Perform an abdominal assessment and review medications for constipating agents", "Administer a Fleet enema immediately", "Document the finding and continue monitoring", "Start daily stool softeners without further assessment"],
    a: 0,
    r: "Assessment should precede intervention. The nurse should evaluate the abdomen for distension, bowel sounds, and tenderness, and review medications (opioids, calcium channel blockers, anticholinergics) that may cause constipation. Interventions should be based on assessment findings.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is assessing a 82-year-old resident's risk for social isolation. Which factor most significantly increases this risk?",
    o: ["Recent death of a spouse and limited family visits", "Preference for reading alone in the room", "Hearing aid use", "History of introversion"],
    a: 0,
    r: "Recent spousal loss combined with limited family contact is the strongest risk factor for social isolation and associated depression in long-term care residents. Personal preferences for solitude and hearing aid use (which helps communication) are less concerning. Introversion alone does not equal isolation.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is evaluating the visual acuity of an 80-year-old resident using a Snellen chart. The resident reads the 20/70 line with corrective lenses. What does this indicate?",
    o: ["Legal visual impairment that may affect daily function", "Normal vision for the resident's age", "Blindness requiring immediate ophthalmology referral", "Need for stronger corrective lenses only"],
    a: 0,
    r: "Visual acuity of 20/70 means the resident sees at 20 feet what a person with normal vision sees at 70 feet. This is classified as moderate visual impairment that affects daily activities like reading and navigation. It warrants ophthalmology evaluation but does not constitute legal blindness (20/200).",
    s: "Geriatric Assessment"
  },
  {
    q: "A 78-year-old resident has a body mass index of 17. Which nutritional intervention should the nurse implement first?",
    o: ["Consult with a registered dietitian for an individualized nutrition plan", "Start total parenteral nutrition", "Place a percutaneous gastrostomy tube", "Restrict fluid intake to concentrate nutrients"],
    a: 0,
    r: "A BMI of 17 indicates underweight status. The first step is a dietitian consult to develop an individualized plan including calorie-dense foods, supplements, and addressing any barriers to eating. TPN and PEG tubes are reserved for patients who cannot eat orally. Fluid restriction is not appropriate.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is performing a comprehensive fall risk assessment on a newly admitted 86-year-old resident. Which combination of factors represents the highest fall risk?",
    o: ["History of previous falls, use of psychotropic medications, and gait instability", "Age over 80, female sex, and wearing glasses", "Hypertension, diabetes, and obesity", "Mild hearing loss and use of a cane"],
    a: 0,
    r: "The strongest predictors of falls in older adults include history of previous falls, psychotropic medication use (sedatives, antidepressants, antipsychotics), and gait or balance problems. Age and sex alone are weaker predictors. Cane use actually reduces fall risk.",
    s: "Geriatric Assessment"
  },
  {
    q: "An 83-year-old resident presents with a temperature of 99.2°F. The nurse should interpret this finding as which of the following?",
    o: ["Potentially significant fever requiring further investigation", "Normal temperature variation in the elderly", "Insignificant finding requiring no action", "Indication of hypothermia"],
    a: 0,
    r: "Older adults have lower baseline body temperatures (96.4-98.5°F). A temperature of 99.2°F in an elderly person may represent a significant fever equivalent to 101°F or higher in a younger adult. This warrants assessment for infection, especially UTI or pneumonia.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is reviewing the Minimum Data Set (MDS) for a resident. What is the primary purpose of this assessment tool?",
    o: ["To provide a comprehensive standardized assessment for care planning", "To determine Medicare reimbursement only", "To document daily nursing notes", "To replace physician orders"],
    a: 0,
    r: "The MDS is a federally mandated, standardized comprehensive assessment tool used in long-term care to evaluate residents' functional, cognitive, and psychosocial needs for individualized care planning. While it is used in reimbursement calculations, its primary purpose is comprehensive assessment and care planning.",
    s: "Geriatric Assessment"
  },
  {
    q: "A 75-year-old resident is being screened for dehydration. Which clinical finding is the most reliable indicator of dehydration in older adults?",
    o: ["Elevated BUN-to-creatinine ratio with concentrated urine", "Poor skin turgor on the forearm", "Dry mucous membranes", "Decreased blood pressure only"],
    a: 0,
    r: "In older adults, skin turgor is unreliable due to age-related loss of elasticity. The most reliable indicators of dehydration are laboratory values (elevated BUN-to-creatinine ratio >20:1, concentrated urine with high specific gravity). Mucous membranes may be dry from mouth breathing.",
    s: "Geriatric Assessment"
  },
  {
    q: "A nurse is assessing a 88-year-old resident for frailty. Which finding is characteristic of frailty syndrome?",
    o: ["Unintentional weight loss, exhaustion, low physical activity, slow walking speed, and weak grip strength", "Obesity and hypertension", "Preserved muscle mass with joint stiffness", "Normal gait speed with occasional fatigue"],
    a: 0,
    r: "Frailty syndrome is defined by the Fried criteria: unintentional weight loss (>10 lbs/year), self-reported exhaustion, low physical activity, slow walking speed, and weak grip strength. Meeting 3 or more criteria indicates frailty. Obesity and hypertension are separate conditions.",
    s: "Geriatric Assessment"
  },
  // ===== FALL PREVENTION (Questions 31-90) =====
  {
    q: "A nurse is developing a fall prevention plan for a 84-year-old resident who scored high on the Morse Fall Scale. Which intervention is the highest priority?",
    o: ["Ensure the call light is within reach and the bed is in the lowest position", "Apply bilateral wrist restraints", "Administer a sedative at bedtime", "Keep the resident in bed at all times"],
    a: 0,
    r: "Evidence-based fall prevention includes keeping the call light within reach, bed in lowest position, and environment clutter-free. Restraints increase injury risk and agitation. Sedatives increase fall risk. Prolonged bed rest leads to deconditioning and actually increases fall risk.",
    s: "Fall Prevention"
  },
  {
    q: "A resident falls in the hallway and the nurse is first to arrive. What is the nurse's priority action?",
    o: ["Assess the resident for injuries before moving them", "Help the resident stand up immediately", "Call the family to report the fall", "Complete an incident report"],
    a: 0,
    r: "The priority after a fall is to assess for injuries before moving the resident, as movement could worsen fractures or spinal injuries. After assessment and stabilization, the nurse should notify the provider, complete an incident report, and notify the family.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse is reviewing medications for a resident who fell twice in the past month. Which medication class is most strongly associated with increased fall risk?",
    o: ["Benzodiazepines", "ACE inhibitors", "Proton pump inhibitors", "Thyroid hormones"],
    a: 0,
    r: "Benzodiazepines are strongly associated with falls in older adults due to sedation, impaired balance, cognitive impairment, and muscle relaxation. ACE inhibitors may cause orthostatic hypotension but are less strongly linked to falls. PPIs and thyroid hormones have minimal impact on fall risk.",
    s: "Fall Prevention"
  },
  {
    q: "A long-term care facility is implementing a fall prevention program. Which environmental modification is most effective in reducing falls?",
    o: ["Installing grab bars in bathrooms and ensuring adequate lighting", "Waxing floors to a high shine for visibility", "Removing all furniture from resident rooms", "Keeping hallway doors closed at all times"],
    a: 0,
    r: "Environmental modifications proven to reduce falls include grab bars in bathrooms, adequate lighting especially at night, non-slip flooring, removal of clutter, and handrails in hallways. Waxed floors are slippery. Removing furniture limits independence. Closed doors impede monitoring.",
    s: "Fall Prevention"
  },
  {
    q: "A 79-year-old resident uses a walker but frequently forgets to use it. The nurse should implement which intervention?",
    o: ["Place the walker within the resident's view and provide regular reminders", "Take the walker away since the resident doesn't use it", "Apply a lap belt when the resident is seated", "Assign a staff member to accompany the resident at all times"],
    a: 0,
    r: "Visual cues (placing the walker in sight) and regular verbal reminders help residents with memory impairment remember to use assistive devices. Removing the device increases fall risk. Lap belts are restraints. One-to-one staffing is not sustainable.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse is educating staff about fall prevention. Which statement by a nursing assistant requires further teaching?",
    o: ["\"I should let residents wear socks without non-skid soles for comfort.\"", "\"I will keep the call light within the resident's reach.\"", "\"I will assist residents to the bathroom when they request help.\"", "\"I will report any changes in a resident's mobility to the nurse.\""],
    a: 0,
    r: "Socks without non-skid soles are a significant slip and fall hazard. Residents should wear non-skid footwear at all times. The other statements demonstrate appropriate fall prevention practices.",
    s: "Fall Prevention"
  },
  {
    q: "A resident with Parkinson's disease has a festinating gait. Which fall prevention strategy is most appropriate?",
    o: ["Use a wide-based gait with conscious step initiation and visual cues on the floor", "Encourage the resident to walk faster to build momentum", "Recommend the resident shuffle to maintain balance", "Discourage walking and use a wheelchair exclusively"],
    a: 0,
    r: "Festinating gait in Parkinson's involves involuntary acceleration of short, shuffling steps. Visual floor cues (lines or markers), wide-based gait, conscious large steps, and rhythmic verbal cues help control movement. Walking faster worsens festination. Shuffling perpetuates the problem. Exclusive wheelchair use promotes deconditioning.",
    s: "Fall Prevention"
  },
  {
    q: "After implementing a fall prevention program, the nurse notes that fall rates have not decreased. Which quality improvement step should the nurse take?",
    o: ["Analyze fall incident data to identify patterns and modify the program", "Continue the same program for another 6 months", "Apply physical restraints to high-risk residents", "Discontinue the program as ineffective"],
    a: 0,
    r: "Quality improvement requires data analysis to identify patterns (time of day, location, contributing factors) and modify interventions accordingly. Simply continuing without modification, applying restraints, or abandoning the program are not evidence-based approaches.",
    s: "Fall Prevention"
  },
  {
    q: "A 90-year-old resident with nocturia gets up multiple times at night to use the bathroom. Which intervention best reduces nighttime fall risk?",
    o: ["Provide a bedside commode and leave a nightlight on", "Restrict evening fluid intake completely", "Administer a sleeping pill at bedtime", "Place the resident in a low bed with floor mats"],
    a: 0,
    r: "A bedside commode reduces the distance the resident must walk at night, and a nightlight improves visibility without disrupting sleep. Complete fluid restriction can cause dehydration. Sleeping pills increase fall risk. While a low bed helps, a commode directly addresses the reason for getting up.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse is assessing a resident who fell and hit their head. The resident takes warfarin. Which assessment finding warrants immediate emergency evaluation?",
    o: ["Headache with progressive drowsiness", "Small bruise on the forehead without neurological changes", "Resident states they feel fine and wants to return to their room", "Slight redness at the impact site"],
    a: 0,
    r: "A resident on anticoagulant therapy who falls and hits their head is at high risk for intracranial hemorrhage. Progressive drowsiness with headache suggests increasing intracranial pressure from bleeding and requires emergent CT scan and evaluation. Even minor head trauma in anticoagulated patients needs careful monitoring.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse is conducting post-fall huddle with staff. What is the primary purpose of a post-fall huddle?",
    o: ["Identify contributing factors and implement immediate preventive measures", "Assign blame for the fall incident", "Complete required documentation", "Notify the family of the fall"],
    a: 0,
    r: "A post-fall huddle is a quality improvement tool where staff immediately gather to identify what contributed to the fall and implement measures to prevent recurrence. It is not about blame but about learning and prevention. Documentation and family notification are separate processes.",
    s: "Fall Prevention"
  },
  {
    q: "A resident with dementia repeatedly attempts to climb over bed side rails. What is the safest nursing intervention?",
    o: ["Lower the bed to its lowest position and place a floor mat beside the bed", "Raise all four side rails", "Apply a vest restraint", "Sedate the resident with PRN lorazepam"],
    a: 0,
    r: "Climbing over raised side rails significantly increases fall height and injury severity. Lowering the bed with floor mats reduces injury risk if the resident does get out of bed. Four raised side rails constitute a restraint. Vest restraints and sedation increase agitation and complications.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse is implementing a toileting schedule for a resident at high risk for falls. Which schedule is most appropriate?",
    o: ["Offer toileting assistance every 2 hours during waking hours", "Assist only when the resident requests help", "Schedule toileting only after meals", "Wait until the resident is incontinent to assist"],
    a: 0,
    r: "Scheduled toileting every 2 hours anticipates the resident's needs and reduces the urgency that leads to unassisted bathroom trips and falls. Waiting for requests may result in urgent, unsafe attempts. Meal-based scheduling is too infrequent. Waiting for incontinence is not preventive.",
    s: "Fall Prevention"
  },
  {
    q: "A 82-year-old resident has vitamin D level of 15 ng/mL. How does this relate to fall prevention?",
    o: ["Low vitamin D is associated with muscle weakness and increased fall risk", "Vitamin D levels have no relationship to falls", "Low vitamin D only affects bone density, not falls", "The level is within normal range for the elderly"],
    a: 0,
    r: "Vitamin D deficiency (<30 ng/mL) is associated with proximal muscle weakness, impaired balance, and increased fall risk. Supplementation has been shown to reduce falls in deficient older adults. Normal vitamin D is 30-100 ng/mL. The relationship extends beyond bone density to neuromuscular function.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse identifies that most falls in the facility occur during shift change. Which intervention addresses this pattern?",
    o: ["Implement enhanced monitoring and staffing overlap during shift changes", "Restrict resident mobility during shift changes", "Skip shift report to maintain constant presence", "Lock resident rooms during shift changes"],
    a: 0,
    r: "Shift changes are high-risk times for falls due to reduced staff presence. Overlapping shifts, staggering breaks, and enhanced monitoring during transitions address the root cause. Restricting mobility violates resident rights. Skipping report compromises communication. Locking rooms is a safety hazard.",
    s: "Fall Prevention"
  },
  {
    q: "A resident who uses a cane is observed placing it on the wrong side. The cane should be held on which side?",
    o: ["The opposite side of the affected or weaker leg", "The same side as the affected leg", "Whichever hand is dominant", "It does not matter which side"],
    a: 0,
    r: "A cane should be held on the opposite side of the affected leg to provide a wider base of support and shift weight away from the affected side. Using it on the same side does not provide adequate support. Hand dominance and random placement do not ensure proper biomechanics.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse is evaluating the effectiveness of a bed alarm for a confused resident. The alarm sounds but staff cannot respond for 3 minutes. What modification is needed?",
    o: ["Reposition the resident closer to the nursing station for faster response", "Remove the alarm since it is not effective", "Increase the alarm volume", "Add additional bed alarms"],
    a: 0,
    r: "Bed alarms are only effective when staff can respond promptly. If response time is delayed, repositioning the resident closer to the nursing station or adjusting staffing assignments is necessary. Simply increasing volume or adding more alarms without addressing response time is ineffective.",
    s: "Fall Prevention"
  },
  {
    q: "A physical therapist recommends a hip protector for a resident at high risk for hip fracture. What should the nurse know about hip protectors?",
    o: ["They reduce hip fracture risk from falls but compliance is often poor", "They eliminate all risk of fracture from falls", "They are a form of physical restraint", "They replace the need for other fall prevention measures"],
    a: 0,
    r: "Hip protectors are padded undergarments that absorb and distribute the force of a fall, reducing hip fracture risk. However, compliance is often poor due to discomfort and difficulty donning. They do not eliminate fracture risk, are not restraints, and should supplement other fall prevention strategies.",
    s: "Fall Prevention"
  },
  {
    q: "A 85-year-old resident takes furosemide 40 mg every morning. When should the nurse schedule this medication to reduce fall risk?",
    o: ["Early morning so the peak diuretic effect occurs during waking hours when staff are available", "At bedtime to prevent nighttime edema", "At noon to split the day", "At dinner time for convenience"],
    a: 0,
    r: "Diuretics should be given early in the day so the peak effect (increased urination) occurs when the resident is awake and staff can assist with toileting. Bedtime dosing increases nighttime bathroom trips and fall risk. The timing should align with staffing and the resident's waking routine.",
    s: "Fall Prevention"
  },
  {
    q: "A nurse is reviewing a fall that occurred when a resident slipped on a wet bathroom floor. Which systemic change should be implemented?",
    o: ["Install non-slip mats and ensure floors are dried immediately after cleaning", "Prohibit residents from using the bathroom independently", "Assign blame to the housekeeping staff", "Document the incident and take no further action"],
    a: 0,
    r: "Systemic environmental changes like non-slip mats, immediate floor drying, and wet floor signage address the root cause of the fall. Prohibiting bathroom use violates autonomy. Blame does not prevent future falls. Documentation alone is insufficient without corrective action.",
    s: "Fall Prevention"
  },
  // ===== PRESSURE INJURY PREVENTION (Questions 91-150) =====
  {
    q: "A nurse is assessing a resident's pressure injury risk using the Braden Scale. Which subscale score indicates the highest risk?",
    o: ["A total score of 9", "A total score of 18", "A total score of 23", "A total score of 20"],
    a: 0,
    r: "The Braden Scale ranges from 6-23. Lower scores indicate higher risk: 15-18 is mild risk, 13-14 is moderate risk, 10-12 is high risk, and 9 or below is very high risk. A score of 9 indicates the highest level of pressure injury risk among the options.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse identifies a Stage 2 pressure injury on a resident's sacrum. Which description matches a Stage 2 injury?",
    o: ["Partial-thickness loss with exposed dermis; wound bed is pink/red and moist", "Intact skin with non-blanchable redness", "Full-thickness skin loss with visible fat", "Full-thickness loss with exposed bone or tendon"],
    a: 0,
    r: "Stage 2 pressure injury involves partial-thickness loss of skin with exposed dermis. The wound bed is viable, pink or red, and moist. It may also present as an intact or ruptured serum-filled blister. Stage 1 has intact skin. Stage 3 has visible fat. Stage 4 has exposed bone or tendon.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is repositioning a resident to prevent pressure injuries. How often should an immobile resident be repositioned?",
    o: ["At least every 2 hours", "Every 4 hours", "Every 8 hours with each shift", "Only when the resident requests it"],
    a: 0,
    r: "Evidence-based guidelines recommend repositioning immobile residents at least every 2 hours to relieve pressure and prevent tissue ischemia. Every 4 or 8 hours is insufficient. Waiting for requests may not be appropriate for residents with cognitive impairment or decreased sensation.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A resident has a pressure injury with black eschar covering the wound base. How should the nurse stage this injury?",
    o: ["Unstageable", "Stage 2", "Stage 3", "Stage 4"],
    a: 0,
    r: "A pressure injury covered with eschar (black, dry necrotic tissue) or slough that obscures the wound base cannot be staged until the tissue is removed. It is classified as unstageable because the depth and severity cannot be determined.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is selecting an appropriate support surface for a resident with a Stage 3 pressure injury on the sacrum. Which surface is most appropriate?",
    o: ["Low-air-loss mattress", "Standard hospital mattress with an egg crate overlay", "Alternating pressure pad", "Air ring or donut cushion"],
    a: 0,
    r: "A low-air-loss mattress provides continuous pressure redistribution and moisture management for residents with existing pressure injuries (Stage 3 or 4). Standard mattresses with overlays provide insufficient pressure relief. Alternating pressure pads are for prevention. Donut cushions concentrate pressure around the wound edge and are contraindicated.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nursing assistant asks why a donut-shaped cushion should not be used for a resident with a pressure injury on the coccyx. What is the nurse's best response?",
    o: ["\"Donut cushions increase pressure around the wound edges and reduce blood flow.\"", "\"Donut cushions are too expensive for routine use.\"", "\"Donut cushions are only for residents without skin breakdown.\"", "\"Donut cushions are effective but not available in our facility.\""],
    a: 0,
    r: "Donut or ring cushions concentrate pressure around the wound perimeter, reducing blood flow to the wound edges and impeding healing. They are contraindicated for all pressure injury care. Pressure redistribution surfaces that distribute weight evenly are recommended.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is performing a head-to-toe skin assessment on a dark-skinned resident. What is the best technique to identify early pressure injury (Stage 1) in dark skin?",
    o: ["Assess for temperature changes, firmness, and bogginess compared to surrounding tissue", "Look for redness or blanching", "Use a flashlight to check for color changes", "Skip the assessment since pressure injuries are less common in dark skin"],
    a: 0,
    r: "In dark-skinned individuals, erythema may not be visible. The nurse should assess for temperature changes (warmth or coolness), firmness, bogginess (soft, spongy feel), and pain compared to adjacent tissue. These changes indicate early tissue damage. Pressure injuries occur in all skin tones.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A resident is at high risk for heel pressure injuries due to immobility. Which preventive intervention is most effective?",
    o: ["Elevate the heels off the bed surface using pillows or heel suspension devices", "Place an egg crate overlay under the heels", "Apply heel protector socks", "Massage the heels with lotion every shift"],
    a: 0,
    r: "The most effective heel pressure prevention is offloading by elevating the calves on pillows to float the heels completely off the mattress surface. Egg crate overlays do not provide adequate heel pressure relief. Heel protector socks may reduce friction but do not redistribute pressure. Massage over bony prominences is contraindicated.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is documenting wound measurements for a pressure injury. In what order should measurements be taken?",
    o: ["Length (head to toe), width (side to side), and depth", "Width, length, then depth", "Depth, width, then length", "Circumference only"],
    a: 0,
    r: "Wound measurements follow the body clock method: length is measured head to toe (12 to 6 o'clock), width is measured side to side (3 to 9 o'clock) perpendicular to length, and depth is measured with a cotton-tipped applicator at the deepest point. Consistent measurement technique ensures accurate tracking.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse notes that a resident's Stage 2 pressure injury has a bright red, granulating wound bed with no signs of infection. Which wound care approach is most appropriate?",
    o: ["Apply a moisture-retentive dressing such as a hydrocolloid", "Pack the wound with iodoform gauze", "Leave the wound open to air", "Apply a dry sterile gauze dressing changed every 4 hours"],
    a: 0,
    r: "A clean, granulating Stage 2 wound heals best in a moist environment. Hydrocolloid dressings maintain moisture, protect the wound bed, and promote autolytic debridement. Iodoform gauze is for deeper wounds. Open air dries the wound. Dry gauze dressings can damage granulation tissue during removal.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is developing a nutrition plan to support pressure injury healing. Which nutrient is most critical for wound healing?",
    o: ["Protein", "Carbohydrates", "Fats", "Fiber"],
    a: 0,
    r: "Protein is essential for wound healing as it provides amino acids for collagen synthesis, immune function, and tissue repair. Recommendations for pressure injury patients are 1.25-1.5 g/kg/day of protein. Carbohydrates provide energy, fats support cell membranes, and fiber aids bowel function but protein is most critical.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A resident who sits in a wheelchair for extended periods develops redness over both ischial tuberosities. What should the nurse recommend?",
    o: ["Weight shifts every 15-30 minutes and a pressure-redistributing wheelchair cushion", "Limit wheelchair use to 1 hour per day", "Apply barrier cream to the ischial tuberosities", "Place a folded towel on the wheelchair seat"],
    a: 0,
    r: "Wheelchair-bound residents should perform weight shifts every 15-30 minutes to relieve pressure on the ischial tuberosities. A pressure-redistributing cushion helps distribute weight. Limiting wheelchair use restricts mobility and socialization. Barrier cream and towels do not address the pressure problem.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse finds that a nursing assistant has been massaging the reddened area over a resident's sacral bony prominence. What should the nurse instruct?",
    o: ["\"Do not massage reddened areas over bony prominences as it can cause further tissue damage.\"", "\"Continue massaging to increase blood flow to the area.\"", "\"Massage is helpful if you use lotion.\"", "\"Only massage if the redness is blanchable.\""],
    a: 0,
    r: "Massage over bony prominences with redness is contraindicated because it can cause additional tissue damage and shearing forces on already compromised tissue. Evidence shows massage increases tissue destruction in areas at risk for or already experiencing pressure injury.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse observes a deep tissue pressure injury on a resident's heel. Which description is consistent with this type of injury?",
    o: ["Intact skin with a deep purple or maroon localized area", "Open wound with exposed bone", "Superficial abrasion with clear drainage", "Blanchable redness that resolves with pressure relief"],
    a: 0,
    r: "A deep tissue pressure injury presents as intact skin with persistent, non-blanchable, deep purple or maroon discoloration, or a blood-filled blister. It indicates damage to underlying soft tissue from pressure or shear. The area may be preceded by pain, firmness, or temperature change.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is teaching a nursing assistant about proper positioning to prevent pressure injuries. Which position should be avoided?",
    o: ["Lying directly on the trochanter (90-degree side-lying)", "30-degree lateral position", "Supine with head of bed elevated 30 degrees", "Prone position if tolerated"],
    a: 0,
    r: "Lying directly on the greater trochanter at 90 degrees concentrates pressure over this bony prominence and increases pressure injury risk. The 30-degree lateral position distributes pressure more evenly. Supine with slight elevation and prone position (if tolerated) are acceptable alternatives.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A wound care nurse is assessing a pressure injury and notes undermining at the 3 o'clock to 6 o'clock positions. What does undermining indicate?",
    o: ["Tissue destruction extending under intact skin at the wound edge", "Normal wound healing process", "Superficial wound with no deep involvement", "Wound infection requiring antibiotics"],
    a: 0,
    r: "Undermining is tissue destruction that extends under intact skin surrounding the wound margin, creating a pocket or space. It occurs from shearing forces and can indicate progressive tissue damage. It requires proper documentation (clock positions and depth) and appropriate wound packing.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is caring for a resident with a Stage 4 pressure injury with exposed bone. Which finding indicates osteomyelitis?",
    o: ["Elevated ESR and CRP with bone visible at the wound base", "Clean granulation tissue covering the bone", "Decreasing wound size over two weeks", "Normal white blood cell count"],
    a: 0,
    r: "Osteomyelitis (bone infection) should be suspected when bone is visible or palpable in a pressure injury, especially with elevated inflammatory markers (ESR, CRP), persistent drainage, and failure to heal. The gold standard diagnosis is bone biopsy. Clean granulation and decreasing size indicate healing.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is selecting a dressing for a heavily exudative Stage 3 pressure injury. Which dressing type is most appropriate?",
    o: ["Alginate or foam dressing", "Transparent film dressing", "Hydrocolloid dressing", "Dry gauze dressing"],
    a: 0,
    r: "Alginate and foam dressings are highly absorptive and appropriate for wounds with heavy exudate. They maintain a moist wound environment while managing excess moisture. Transparent films and hydrocolloids cannot handle heavy exudate. Dry gauze can adhere to the wound bed and damage tissue.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A resident's family asks why the nurse is turning their loved one so frequently. What is the best response?",
    o: ["\"Frequent repositioning prevents prolonged pressure on the skin, which can cause tissue breakdown and painful wounds.\"", "\"It's hospital policy to turn patients every 2 hours.\"", "\"We turn patients to prevent blood clots.\"", "\"Turning helps with digestion.\""],
    a: 0,
    r: "Explaining the rationale in understandable terms helps families understand the importance of repositioning. Prolonged pressure causes tissue ischemia and breakdown. While repositioning has other benefits (DVT prevention, respiratory function), the primary reason is pressure injury prevention.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse notes yellow, stringy tissue in a pressure injury wound bed. What type of tissue is this?",
    o: ["Slough (non-viable tissue requiring debridement)", "Healthy granulation tissue", "Epithelial tissue indicating healing", "Fibrin from normal clotting"],
    a: 0,
    r: "Slough is yellow, tan, or gray, stringy or mucinous non-viable tissue that adheres to the wound bed. It impedes healing and may need debridement. Healthy granulation tissue is beefy red and bumpy. Epithelial tissue is pink and appears at wound edges. Slough indicates the wound needs intervention.",
    s: "Pressure Injury Prevention"
  },
  {
    q: "A nurse is implementing a skin care protocol for incontinent residents. Which intervention is most important for preventing moisture-associated skin damage?",
    o: ["Apply a moisture barrier cream or ointment after each episode of incontinence", "Use soap and water to cleanse after each episode", "Allow the skin to air dry after cleansing", "Use adult diapers and change them every 4 hours"],
    a: 0,
    r: "Moisture barrier products (dimethicone-based or zinc oxide creams) protect the skin from the irritating effects of urine and stool. Soap can strip natural skin oils. Air drying prolongs moisture exposure. Incontinent products should be changed promptly, not on a fixed 4-hour schedule.",
    s: "Pressure Injury Prevention"
  },
  // ===== DEMENTIA CARE (Questions 151-220) =====
  {
    q: "A nurse is caring for a resident with moderate Alzheimer's disease who becomes agitated every evening. This behavior is best described as which phenomenon?",
    o: ["Sundowning", "Delirium", "Psychosis", "Akathisia"],
    a: 0,
    r: "Sundowning refers to increased confusion, agitation, and behavioral disturbance that occurs in the late afternoon and evening in patients with dementia. Contributing factors include fatigue, decreased light, and disruption of circadian rhythms. It is different from delirium (acute, fluctuating) and psychosis.",
    s: "Dementia Care"
  },
  {
    q: "A resident with dementia is wandering and attempting to exit the facility. What is the most appropriate initial intervention?",
    o: ["Redirect the resident with a calm approach and engage in a meaningful activity", "Physically restrain the resident", "Lock the resident in their room", "Administer PRN haloperidol"],
    a: 0,
    r: "Redirection is the first-line non-pharmacological intervention for wandering. Approaching calmly, validating the resident's feelings, and engaging in a meaningful activity addresses the behavior without restricting rights. Physical restraint and room confinement violate resident rights. Antipsychotics should be a last resort.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is developing a care plan for a resident with dementia who refuses to bathe. Which approach is most therapeutic?",
    o: ["Offer bathing at the resident's preferred time and use a consistent routine", "Insist the resident bathe at the scheduled time", "Skip bathing altogether", "Have multiple staff members assist to complete the bath quickly"],
    a: 0,
    r: "Person-centered care for dementia includes respecting preferences, maintaining consistent routines, and offering choices. Bathing at the resident's preferred time reduces resistance. Insisting or forcing increases agitation. Skipping hygiene compromises dignity. Multiple staff can be overwhelming.",
    s: "Dementia Care"
  },
  {
    q: "A resident with advanced dementia begins to cry and repeatedly call out for their mother who died 30 years ago. What is the most therapeutic response?",
    o: ["\"You are thinking about your mother. Tell me about her.\"", "\"Your mother died a long time ago.\"", "\"Stop crying, your mother isn't here.\"", "\"I'll call your mother for you right now.\""],
    a: 0,
    r: "Validation therapy acknowledges the resident's emotions without correcting or reinforcing false beliefs. Asking about the mother redirects to positive memories and provides comfort. Reality orientation (telling them their mother is dead) causes repeated grief. Lying creates false expectations. Dismissing feelings is not therapeutic.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is training staff on communication techniques for residents with dementia. Which technique is most effective?",
    o: ["Use short, simple sentences and allow extra time for response", "Speak loudly and repeat instructions rapidly", "Ask open-ended questions about complex topics", "Use medical terminology to be precise"],
    a: 0,
    r: "Effective communication with dementia patients includes short simple sentences, one-step instructions, allowing processing time, maintaining eye contact, and using a calm tone. Speaking loudly can be perceived as aggression. Complex open-ended questions and medical jargon increase confusion.",
    s: "Dementia Care"
  },
  {
    q: "A resident with dementia is observed eating non-food items such as napkins and flowers. This behavior is known as which term?",
    o: ["Pica", "Dysphagia", "Bulimia", "Rumination"],
    a: 0,
    r: "Pica is the persistent eating of non-nutritive, non-food substances. It can occur in advanced dementia due to loss of judgment and inability to distinguish edible from non-edible items. Dysphagia is difficulty swallowing. Bulimia involves binge-purge cycles. Rumination involves regurgitating food.",
    s: "Dementia Care"
  },
  {
    q: "A resident with moderate dementia has difficulty finding the bathroom and is experiencing urinary incontinence. Which intervention should the nurse implement first?",
    o: ["Place visual cues such as pictures of a toilet on the bathroom door", "Apply an indwelling urinary catheter", "Start the resident on oxybutynin for incontinence", "Limit fluid intake to reduce urine output"],
    a: 0,
    r: "Visual cues help residents with dementia locate the bathroom independently, addressing the cause of incontinence (disorientation, not bladder dysfunction). Catheters increase UTI risk. Anticholinergics can worsen confusion. Fluid restriction causes dehydration and does not address the underlying problem.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is evaluating a resident with dementia for pain. The resident is grimacing, moaning, and pulling away during repositioning. Using the PAINAD scale, what score would these behaviors likely indicate?",
    o: ["A score of 6-10 indicating moderate to severe pain", "A score of 0 indicating no pain", "A score of 1-2 indicating mild discomfort", "The scale cannot be used for this resident"],
    a: 0,
    r: "The PAINAD scale (0-10) assesses five domains: breathing, negative vocalization, facial expression, body language, and consolability. Grimacing (facial expression = 2), moaning (vocalization = 2), and pulling away (body language = 2) would yield a score of at least 6, indicating moderate to severe pain.",
    s: "Dementia Care"
  },
  {
    q: "A family member asks the nurse about the stages of Alzheimer's disease. Which symptom is most characteristic of the early stage?",
    o: ["Difficulty with short-term memory and finding words", "Inability to recognize family members", "Complete dependence in all ADLs", "Inability to communicate verbally"],
    a: 0,
    r: "Early Alzheimer's is characterized by short-term memory loss, word-finding difficulty (anomia), difficulty with complex tasks, and mild personality changes. Failure to recognize family (prosopagnosia), complete ADL dependence, and loss of verbal communication occur in the late/severe stage.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is implementing a structured daily routine for a resident with dementia. Which rationale best supports this approach?",
    o: ["Consistent routines reduce anxiety and confusion by providing predictability", "Routines make it easier for staff to manage their workload", "Routines prevent the resident from making any decisions", "Routines eliminate all behavioral symptoms of dementia"],
    a: 0,
    r: "Structured routines provide predictability and security for dementia patients, reducing anxiety and behavioral disturbances. While routines do help with staffing, the primary purpose is resident benefit. Residents should still have choices within the routine. Routines reduce but do not eliminate behavioral symptoms.",
    s: "Dementia Care"
  },
  {
    q: "A resident with dementia is resistive to care during morning hygiene. The nursing assistant reports being hit when trying to dress the resident. What should the nurse instruct?",
    o: ["Approach the resident from the front, explain each step simply, and offer choices", "Approach quickly to complete the task before the resident can resist", "Skip morning care to avoid confrontation", "Request a PRN antipsychotic before each hygiene session"],
    a: 0,
    r: "Resistive behavior often stems from fear, confusion, or feeling threatened. Approaching from the front, explaining actions simply, offering choices, and performing care slowly reduces fear and resistance. Rushing increases agitation. Skipping care compromises dignity. Routine antipsychotic use for ADL care is inappropriate.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is creating an environment that supports residents with dementia. Which environmental modification is most beneficial?",
    o: ["Consistent room layout with familiar objects and personal belongings", "Frequently rearranging furniture for variety", "Bright fluorescent overhead lighting throughout the day", "Loud background music in common areas"],
    a: 0,
    r: "Familiar, consistent environments reduce confusion and anxiety in dementia patients. Personal belongings provide comfort and orientation. Rearranging furniture causes disorientation. Harsh fluorescent lighting can cause glare and agitation. Loud background noise increases confusion and sensory overload.",
    s: "Dementia Care"
  },
  {
    q: "A resident with late-stage Alzheimer's disease develops dysphagia. The family wants the resident to continue eating. What should the nurse recommend?",
    o: ["Modified texture diet with thickened liquids and upright positioning during meals", "Insert a nasogastric tube for feeding", "Continue regular diet and monitor for aspiration", "Discontinue all oral intake and start IV fluids"],
    a: 0,
    r: "For residents with late-stage dementia and dysphagia, modified texture diets (pureed food, thickened liquids) with upright positioning reduce aspiration risk while respecting the family's wishes for continued oral feeding. Tube feeding in advanced dementia has not been shown to improve outcomes or prevent aspiration.",
    s: "Dementia Care"
  },
  {
    q: "A nurse observes a resident with dementia rummaging through another resident's belongings. What is the most appropriate intervention?",
    o: ["Gently redirect the resident to a rummaging box with safe items", "Scold the resident for taking others' belongings", "Lock the other resident's room", "Apply a wrist restraint to prevent the behavior"],
    a: 0,
    r: "Rummaging is a common dementia behavior driven by boredom, anxiety, or past habits. Providing a safe rummaging box (box with familiar items to sort through) redirects the behavior without restricting the resident. Scolding causes distress. Locking rooms and restraints are inappropriate responses.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is educating a family member about Lewy body dementia. Which feature distinguishes it from Alzheimer's disease?",
    o: ["Visual hallucinations and fluctuating cognition early in the disease", "Gradual memory loss as the primary early symptom", "Absence of motor symptoms", "Better response to antipsychotic medications"],
    a: 0,
    r: "Lewy body dementia is characterized by early visual hallucinations, fluctuating cognition, REM sleep behavior disorder, and parkinsonism. Alzheimer's presents primarily with gradual memory loss. Lewy body dementia patients are extremely sensitive to antipsychotics, which can cause severe neuroleptic reactions.",
    s: "Dementia Care"
  },
  {
    q: "A resident with vascular dementia has a stepwise decline in cognitive function. What does the nurse understand about this pattern?",
    o: ["Cognitive decline occurs in sudden steps, often following cerebrovascular events", "Decline is slow and gradual as in Alzheimer's disease", "The resident will fully recover between episodes", "Vascular dementia does not progress over time"],
    a: 0,
    r: "Vascular dementia is characterized by a stepwise decline where cognition worsens suddenly (often after a stroke or TIA) and then plateaus before the next event. Unlike Alzheimer's gradual decline, the progression is abrupt and stepwise. Full recovery does not occur, and the condition is progressive.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is implementing a music therapy program for residents with dementia. What is the primary therapeutic benefit?",
    o: ["Reducing agitation and improving mood and social engagement", "Curing the underlying dementia", "Replacing the need for all medications", "Improving short-term memory"],
    a: 0,
    r: "Music therapy has strong evidence for reducing agitation, improving mood, decreasing behavioral symptoms, and promoting social engagement in dementia patients. Music from the person's past can evoke memories and positive emotions. It does not cure dementia, replace medications, or restore short-term memory.",
    s: "Dementia Care"
  },
  {
    q: "A resident with frontotemporal dementia exhibits socially inappropriate behavior such as making offensive comments to other residents. What should the nurse understand?",
    o: ["The behavior is caused by damage to the frontal lobe affecting impulse control and social judgment", "The resident is intentionally being rude", "This behavior indicates Alzheimer's disease", "The behavior will resolve with behavioral modification"],
    a: 0,
    r: "Frontotemporal dementia causes degeneration of the frontal and temporal lobes, leading to loss of social inhibition, impaired judgment, personality changes, and inappropriate behavior. The behavior is neurological, not intentional. It is distinct from Alzheimer's. Traditional behavioral modification is generally ineffective.",
    s: "Dementia Care"
  },
  {
    q: "A resident with moderate dementia becomes increasingly agitated in the late afternoon. Which non-pharmacological intervention should the nurse try first?",
    o: ["Reduce environmental stimulation and offer a calming activity such as folding towels", "Turn on the television to provide distraction", "Place the resident in a busy common area", "Offer caffeinated beverages"],
    a: 0,
    r: "Reducing environmental stimulation during sundowning helps decrease sensory overload. Familiar, repetitive activities (folding towels, sorting) provide purposeful engagement. Television can overstimulate. Busy common areas increase agitation. Caffeine worsens agitation and sleep disturbance.",
    s: "Dementia Care"
  },
  {
    q: "A nurse is discussing end-of-life care with the family of a resident with end-stage dementia. The resident has stopped eating. What should the nurse explain?",
    o: ["Loss of appetite and decreased intake is a natural part of the dying process in advanced dementia", "The resident must be tube fed to prevent starvation", "This indicates the resident is depressed and needs antidepressants", "The family is not providing enough encouragement at mealtimes"],
    a: 0,
    r: "In end-stage dementia, decreased appetite and food refusal are part of the natural dying process as the body loses the ability to process nutrition. Research shows tube feeding does not prolong life or improve comfort in this population and may increase complications such as aspiration and agitation.",
    s: "Dementia Care"
  },
  // ===== MEDICATION MANAGEMENT IN ELDERLY (Questions 221-290) =====
  {
    q: "A nurse is reviewing the Beers Criteria for a 78-year-old resident. Which medication on the list is considered potentially inappropriate for older adults?",
    o: ["Diphenhydramine (Benadryl)", "Acetaminophen (Tylenol)", "Metformin", "Amlodipine"],
    a: 0,
    r: "The Beers Criteria identifies medications that are potentially inappropriate for older adults. Diphenhydramine (an anticholinergic) is on the list due to risks of confusion, sedation, urinary retention, constipation, and falls. Acetaminophen, metformin, and amlodipine are generally considered safe.",
    s: "Medication Management"
  },
  {
    q: "An 82-year-old resident is prescribed a new medication. The nurse knows that age-related changes in pharmacokinetics affect drug metabolism. Which change is most significant?",
    o: ["Decreased hepatic metabolism leading to prolonged drug half-life", "Increased renal clearance of medications", "Faster gastric emptying increasing absorption", "Increased muscle mass enhancing drug distribution"],
    a: 0,
    r: "Age-related decreases in liver blood flow and hepatic enzyme activity reduce drug metabolism, prolonging half-life and increasing risk of toxicity. Renal clearance decreases (not increases). Gastric emptying slows. Muscle mass decreases while fat increases, affecting drug distribution.",
    s: "Medication Management"
  },
  {
    q: "A nurse is assessing a 85-year-old resident who has been taking digoxin 0.25 mg daily. The resident reports nausea, blurred vision, and seeing yellow halos. What should the nurse suspect?",
    o: ["Digoxin toxicity", "Normal side effects of digoxin", "Allergic reaction to digoxin", "Digoxin deficiency"],
    a: 0,
    r: "Nausea, visual disturbances (blurred vision, yellow-green halos), anorexia, and cardiac dysrhythmias are classic signs of digoxin toxicity. Older adults are at higher risk due to decreased renal clearance. The nurse should hold the medication, check digoxin level (therapeutic 0.5-2.0 ng/mL), and notify the provider.",
    s: "Medication Management"
  },
  {
    q: "A nurse is performing medication reconciliation for a new admission who takes 12 medications. Using the STOPP/START criteria, what should the nurse assess for?",
    o: ["Potentially inappropriate medications to stop and beneficial medications to start", "The cost of each medication", "Whether the resident can swallow all pills", "If all medications are covered by insurance"],
    a: 0,
    r: "STOPP/START criteria are screening tools for potentially inappropriate prescribing in older adults. STOPP identifies medications that should be discontinued. START identifies medications that should be initiated but are omitted. This dual approach optimizes the medication regimen.",
    s: "Medication Management"
  },
  {
    q: "An 80-year-old resident has a GFR of 28 mL/min. The nurse should be most concerned about which medication adjustment?",
    o: ["Reducing doses of renally cleared medications", "Increasing doses to compensate for poor absorption", "Switching all medications to IV route", "Discontinuing all medications"],
    a: 0,
    r: "A GFR of 28 mL/min indicates Stage 4 CKD with significantly reduced renal clearance. Medications cleared by the kidneys (metformin, gabapentin, certain antibiotics) need dose reduction or avoidance to prevent accumulation and toxicity. Simply increasing doses or switching routes is not appropriate.",
    s: "Medication Management"
  },
  {
    q: "A nurse is teaching a nursing assistant about recognizing anticholinergic side effects in elderly residents. Which combination of symptoms should be reported?",
    o: ["Dry mouth, constipation, urinary retention, and confusion", "Diarrhea, excessive salivation, and urinary frequency", "Bradycardia, miosis, and increased sweating", "Hypotension, bronchospasm, and wheezing"],
    a: 0,
    r: "Anticholinergic side effects include dry mouth, constipation, urinary retention, blurred vision, tachycardia, and cognitive impairment/confusion. These are remembered as 'hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter.' The other options describe cholinergic or other effects.",
    s: "Medication Management"
  },
  {
    q: "A resident's family brings in an herbal supplement (St. John's Wort) and asks the nurse to give it with the resident's regular medications, which include warfarin. What should the nurse do?",
    o: ["Notify the healthcare provider before administering due to potential drug interactions", "Add the supplement to the medication administration record", "Give the supplement since it is natural and safe", "Refuse to give any herbal supplements"],
    a: 0,
    r: "St. John's Wort is a potent enzyme inducer that can reduce warfarin effectiveness and increase bleeding risk when discontinued. The provider must be notified of all supplements to assess for drug-herb interactions before administration. Natural does not mean safe.",
    s: "Medication Management"
  },
  {
    q: "A nurse is caring for a 79-year-old resident who has been started on a new blood pressure medication. The resident's standing BP is 90/56 and the resident feels lightheaded. What should the nurse do?",
    o: ["Hold the medication, place the resident safely in bed, and notify the provider", "Give the next dose as scheduled", "Encourage the resident to stand up slowly and continue the medication", "Administer a fluid bolus and continue the medication"],
    a: 0,
    r: "Symptomatic hypotension (standing BP 90/56 with lightheadedness) after starting a new antihypertensive requires holding the medication, ensuring patient safety, and provider notification. The medication likely needs dose adjustment. Starting low and titrating slowly ('start low, go slow') is essential in geriatrics.",
    s: "Medication Management"
  },
  {
    q: "A nurse is administering medications to a resident with dysphagia. The resident cannot swallow tablets. Which action is most appropriate?",
    o: ["Check if the medication is available in liquid form or can be crushed", "Skip the medication dose", "Force the tablet with a large amount of water", "Break the tablet and place it in the resident's food without their knowledge"],
    a: 0,
    r: "The nurse should check if alternative formulations (liquid, patch, injectable) are available or if the tablet can be crushed (not extended-release or enteric-coated). Skipping doses is not acceptable. Forcing tablets risks aspiration. Hiding medication in food without knowledge violates the right to informed consent.",
    s: "Medication Management"
  },
  {
    q: "A 83-year-old resident is prescribed zolpidem for insomnia. The nurse should question this order based on which concern?",
    o: ["Increased risk of falls, confusion, and fractures in older adults", "Zolpidem is too expensive for long-term use", "Zolpidem is ineffective in older adults", "Zolpidem must be given with food"],
    a: 0,
    r: "Zolpidem and other sedative-hypnotics are listed on the Beers Criteria as potentially inappropriate for older adults due to increased risk of delirium, falls, fractures, and motor vehicle accidents. Non-pharmacological sleep hygiene interventions should be tried first.",
    s: "Medication Management"
  },
  {
    q: "A nurse notices that a resident is receiving three medications with anticholinergic properties. What is the cumulative risk concern?",
    o: ["Increased anticholinergic burden leading to cognitive impairment and delirium", "Decreased effectiveness of each medication", "Allergic cross-reactivity between the medications", "No additional risk since each medication is individually safe"],
    a: 0,
    r: "Anticholinergic burden is cumulative. When multiple medications with anticholinergic properties are combined, the risk of cognitive impairment, delirium, falls, constipation, and urinary retention increases significantly. The nurse should calculate the anticholinergic cognitive burden score and discuss with the provider.",
    s: "Medication Management"
  },
  {
    q: "A nurse is educating an 80-year-old resident about a newly prescribed ACE inhibitor. Which side effect is most important to teach this resident to report?",
    o: ["Persistent dry cough or facial swelling", "Increased appetite", "Mild headache that resolves within minutes", "Temporary bitter taste"],
    a: 0,
    r: "ACE inhibitor-related persistent dry cough occurs in 5-20% of patients and may require medication change. Angioedema (facial/tongue swelling) is a rare but life-threatening side effect requiring immediate emergency care. These are the most critical side effects to report.",
    s: "Medication Management"
  },
  {
    q: "A resident's serum potassium level is 5.8 mEq/L. The nurse reviews medications and finds the resident takes spironolactone, lisinopril, and a potassium supplement. What should the nurse do?",
    o: ["Hold the potassium supplement and potassium-sparing medications and notify the provider", "Continue all medications and recheck potassium in one week", "Administer additional potassium to correct the level", "Document the finding and monitor for symptoms"],
    a: 0,
    r: "Serum potassium of 5.8 mEq/L is dangerously elevated (hyperkalemia). The combination of spironolactone (potassium-sparing diuretic), lisinopril (ACE inhibitor that raises potassium), and potassium supplement creates additive hyperkalemia risk. The nurse should hold these medications, notify the provider, and obtain an ECG.",
    s: "Medication Management"
  },
  {
    q: "A nurse is reviewing a resident's medication list and notes that metoclopramide has been prescribed for 8 months. Why should the nurse question this?",
    o: ["Long-term use increases risk of tardive dyskinesia, especially in older adults", "The medication is not effective after 2 weeks", "It should only be given intravenously", "It interacts with all other oral medications"],
    a: 0,
    r: "Metoclopramide should not be used for more than 12 weeks due to risk of tardive dyskinesia (irreversible involuntary movements), which is higher in older adults and with prolonged use. The FDA has a black box warning about this risk. The nurse should discuss discontinuation with the provider.",
    s: "Medication Management"
  },
  {
    q: "A nurse is preparing to administer insulin to an 86-year-old resident with type 2 diabetes. The resident's blood glucose is 82 mg/dL before lunch. What should the nurse do?",
    o: ["Hold the insulin, give the resident lunch, and recheck blood glucose", "Administer the full insulin dose as ordered", "Administer half the insulin dose", "Give the insulin with extra orange juice"],
    a: 0,
    r: "A blood glucose of 82 mg/dL is at the lower end of normal (70-100 mg/dL). Administering insulin before eating could cause hypoglycemia, which is dangerous in the elderly. The nurse should hold the insulin, have the resident eat, and recheck glucose. Less tight glucose control targets (100-180 mg/dL) are appropriate for elderly LTC residents.",
    s: "Medication Management"
  },
  {
    q: "A resident with chronic pain has been taking acetaminophen 1000 mg four times daily for 6 months. The nurse should monitor for which complication?",
    o: ["Hepatotoxicity from exceeding the maximum daily dose", "Renal failure", "Gastric ulceration", "Respiratory depression"],
    a: 0,
    r: "Acetaminophen 4000 mg/day is the maximum daily dose for adults, but for older adults, 3000 mg/day is often recommended. At 4000 mg/day for 6 months, the nurse should monitor liver function tests for hepatotoxicity. Unlike NSAIDs, acetaminophen does not typically cause GI bleeding or respiratory depression.",
    s: "Medication Management"
  },
  {
    q: "A nurse is deprescribing a proton pump inhibitor (PPI) that a resident has taken for 3 years without a clear indication. Which approach is safest?",
    o: ["Gradually taper the dose over several weeks to avoid rebound acid hypersecretion", "Discontinue abruptly since PPIs are not addictive", "Continue indefinitely since the resident has been on it so long", "Switch to a higher dose H2 blocker"],
    a: 0,
    r: "Abrupt PPI discontinuation can cause rebound acid hypersecretion. Gradual tapering over 2-4 weeks (reducing dose or switching to every-other-day dosing) is recommended. Indefinite use without indication increases risks of C. difficile, fractures, and hypomagnesemia.",
    s: "Medication Management"
  },
  {
    q: "A 77-year-old resident is prescribed glyburide for type 2 diabetes. The nurse should question this order because glyburide is on the Beers list for which reason?",
    o: ["Higher risk of prolonged hypoglycemia in older adults compared to other sulfonylureas", "It is not effective in people over 75", "It cannot be taken with food", "It causes hyperglycemia in the elderly"],
    a: 0,
    r: "Glyburide is a long-acting sulfonylurea on the Beers Criteria because it has a higher risk of prolonged, severe hypoglycemia in older adults compared to shorter-acting alternatives like glipizide. Hypoglycemia in the elderly can cause falls, confusion, and cardiac events.",
    s: "Medication Management"
  },
  {
    q: "A nurse is administering an opioid to a 84-year-old resident for chronic pain. The nurse should start at what dose compared to a younger adult?",
    o: ["25-50% of the standard adult dose and titrate slowly", "The same dose as a younger adult", "Double the standard dose due to age-related tolerance", "No opioid should be given to anyone over 80"],
    a: 0,
    r: "The geriatric prescribing principle 'start low, go slow' applies especially to opioids. Older adults have increased sensitivity to opioids due to decreased hepatic and renal clearance, reduced body water, and increased brain sensitivity. Starting at 25-50% of the usual adult dose reduces adverse effects.",
    s: "Medication Management"
  },
  {
    q: "A nurse is reviewing a resident's PRN medication orders. The resident has orders for both oxycodone and lorazepam PRN. What is the nurse's primary concern?",
    o: ["Concurrent use increases risk of respiratory depression and oversedation", "The medications cannot be stored together", "Both medications must be given with food", "There is no concern if both are ordered PRN"],
    a: 0,
    r: "The combination of opioids and benzodiazepines significantly increases the risk of respiratory depression, oversedation, and death, especially in older adults. The FDA has issued a black box warning about concurrent use. The nurse should clarify with the provider before administering both.",
    s: "Medication Management"
  },
  {
    q: "A 81-year-old resident's medication list includes amitriptyline for depression. The nurse should recommend an alternative because amitriptyline is inappropriate in older adults due to which property?",
    o: ["Strong anticholinergic effects causing confusion, sedation, and falls", "It is not effective for depression", "It causes weight loss in the elderly", "It has no drug interactions"],
    a: 0,
    r: "Amitriptyline is a tricyclic antidepressant with strong anticholinergic and sedative properties, making it inappropriate for older adults per the Beers Criteria. It increases risk of confusion, falls, constipation, urinary retention, and cardiac conduction abnormalities. SSRIs (sertraline, citalopram) are preferred.",
    s: "Medication Management"
  },
  {
    q: "A nurse is implementing a medication pass for a long-term care unit. What is the safest practice during medication administration?",
    o: ["Verify identity, indication, and correct medication using at least two identifiers before each administration", "Prepare all medications for all residents at once for efficiency", "Allow nursing assistants to administer routine medications", "Skip the medication verification for residents the nurse knows well"],
    a: 0,
    r: "Safe medication administration requires verification of the right patient (using at least two identifiers), right drug, right dose, right route, and right time for every administration. Preparing all medications at once increases mix-up risk. Nursing assistants cannot administer medications. Familiarity does not replace verification.",
    s: "Medication Management"
  },
  {
    q: "A resident is prescribed warfarin with a target INR of 2.0-3.0. The current INR is 4.5. The resident has no signs of bleeding. What should the nurse do?",
    o: ["Hold warfarin and notify the provider for dose adjustment", "Continue the current dose and recheck INR in one week", "Administer vitamin K 10 mg IV immediately", "Administer fresh frozen plasma"],
    a: 0,
    r: "An INR of 4.5 without bleeding requires holding warfarin and provider notification. Small doses of oral vitamin K may be given if INR is significantly elevated. IV vitamin K and FFP are reserved for active bleeding or INR >10. Continuing the current dose risks hemorrhage.",
    s: "Medication Management"
  },
  // ===== RESTRAINT USE AND ALTERNATIVES (Questions 291-340) =====
  {
    q: "A nurse is caring for a resident who is pulling at their IV line. The nursing assistant suggests applying wrist restraints. What is the nurse's best response?",
    o: ["\"Let me try alternatives first, such as covering the IV site or redirecting the resident.\"", "\"Go ahead and apply the restraints immediately.\"", "\"Restraints are always the first choice for safety.\"", "\"Only the physician can decide about restraints.\""],
    a: 0,
    r: "Federal regulations require that all alternatives to restraints be tried and documented before restraints are considered. Alternatives include covering the IV site, using mittens, redirecting, providing activities, or moving the IV to a less accessible location. Restraints should be a last resort.",
    s: "Restraint Use"
  },
  {
    q: "A healthcare provider orders bilateral wrist restraints for a confused resident. The nurse knows that restraint orders must include which element?",
    o: ["Specific time limit, type of restraint, and clinical justification", "Only the physician's signature", "A family consent form", "An indefinite duration until the patient improves"],
    a: 0,
    r: "Restraint orders must specify the type of restraint, clinical justification, time limit (typically 24 hours for non-behavioral health), and include a plan for monitoring. Orders cannot be indefinite and must be renewed. A face-to-face assessment by the provider is required within a specified time frame.",
    s: "Restraint Use"
  },
  {
    q: "A nurse has applied a vest restraint to a resident per physician order. How often should the nurse assess the restrained resident?",
    o: ["At least every 2 hours for circulation, sensation, range of motion, and comfort needs", "Once per shift", "Every 8 hours", "Only when the restraint is removed"],
    a: 0,
    r: "Restrained residents must be assessed at least every 2 hours for circulation (pulses, skin color, temperature), sensation, range of motion, and comfort needs (toileting, hydration, nutrition, repositioning). Some facilities require more frequent checks. Assessment at longer intervals is insufficient and unsafe.",
    s: "Restraint Use"
  },
  {
    q: "A nurse is documenting restraint use for a resident. Which documentation element is essential?",
    o: ["Alternatives attempted before applying the restraint", "Only the time the restraint was applied", "The name of the family member who requested the restraint", "The resident's opinion about the restraint"],
    a: 0,
    r: "Documentation must include alternatives attempted and their outcomes, the clinical justification, the type of restraint applied, the time of application, assessment findings during restraint use, and the time of release. Documenting alternatives is legally required to demonstrate restraints were a last resort.",
    s: "Restraint Use"
  },
  {
    q: "A family member requests that their father be restrained at night to prevent falls. What should the nurse explain?",
    o: ["\"Restraints actually increase fall risk and injury severity, and are only used as a last resort with a physician order.\"", "\"We will apply the restraints as you request since you are the family.\"", "\"We can only restrain residents during the day.\"", "\"Restraints are no longer used in any healthcare setting.\""],
    a: 0,
    r: "Research consistently shows that restraints increase the risk of serious injury from falls (residents climbing over or through restraints), as well as strangulation, skin breakdown, circulatory impairment, and psychological distress. The nurse should educate the family about evidence-based alternatives.",
    s: "Restraint Use"
  },
  {
    q: "A nurse notes that a resident in a vest restraint has become more agitated and is struggling against the restraint. What is the priority action?",
    o: ["Remove the restraint, assess the resident, and implement alternative interventions", "Tighten the restraint to prevent the resident from getting free", "Add a second restraint to the lower extremities", "Administer a sedative to calm the resident"],
    a: 0,
    r: "Increased agitation and struggling against restraints increases the risk of injury and strangulation. The nurse should remove the restraint, assess for the cause of agitation (pain, toileting needs, anxiety), and implement alternative interventions. Tightening or adding restraints increases the danger.",
    s: "Restraint Use"
  },
  {
    q: "Which of the following is considered a physical restraint?",
    o: ["A wheelchair lap tray that prevents the resident from rising independently", "A bed in the lowest position", "Non-skid socks", "A nightlight"],
    a: 0,
    r: "Any device or method that restricts a resident's freedom of movement or normal access to their body is a restraint. A wheelchair lap tray that prevents the resident from getting up independently meets this definition. Low beds, non-skid socks, and nightlights are fall prevention measures, not restraints.",
    s: "Restraint Use"
  },
  {
    q: "A nurse is implementing restraint-free alternatives for a resident who frequently gets out of bed unsafely. Which intervention is most appropriate?",
    o: ["Low bed with floor mats and a bed alarm", "Bilateral wrist restraints tied to the bed frame", "Sedation with PRN benzodiazepine", "Four raised side rails"],
    a: 0,
    r: "A low bed with floor mats reduces injury risk if the resident gets out of bed, while a bed alarm alerts staff. Wrist restraints and sedation are restraints. Four raised side rails are considered a restraint as they prevent the resident from getting out of bed.",
    s: "Restraint Use"
  },
  {
    q: "When a vest restraint is applied, the nurse must ensure the restraint is tied to which part of the bed?",
    o: ["The movable bed frame, not the side rails, using a quick-release knot", "The side rails", "The headboard only", "Any stationary object in the room"],
    a: 0,
    r: "Restraints must be tied to the movable part of the bed frame using a quick-release knot (bow or slip knot). Tying to side rails can cause injury when rails are raised or lowered. Tying to the headboard restricts movement when the bed is repositioned. Quick-release knots allow rapid removal in emergencies.",
    s: "Restraint Use"
  },
  {
    q: "A nurse is developing a quality improvement project to reduce restraint use in the facility. Which evidence-based strategy should be the primary focus?",
    o: ["Staff education on person-centered care and behavioral alternatives to restraints", "Purchasing more types of restraint devices", "Hiring security personnel", "Increasing PRN sedative medication orders"],
    a: 0,
    r: "Education on person-centered care approaches, understanding the root causes of behavior, and implementing individualized alternatives (environmental modification, activities, staffing adjustments) is the most effective strategy to reduce restraint use. More restraint types, security, and sedation are not restraint reduction strategies.",
    s: "Restraint Use"
  },
  {
    q: "A resident's restraint order expired 4 hours ago but the restraint is still in place. The nurse should take which action?",
    o: ["Remove the restraint immediately and contact the provider for a new order if still indicated", "Continue the restraint until the provider rounds tomorrow", "Document that the restraint was continued", "Ask the nursing assistant to remove it at shift change"],
    a: 0,
    r: "Continuing restraint use beyond the ordered time frame is a violation of federal regulations and patient rights. The restraint must be removed immediately. If restraint use is still indicated, a new order with face-to-face assessment is required. Delaying removal is a regulatory and ethical violation.",
    s: "Restraint Use"
  },
  {
    q: "A CMS surveyor asks a nurse to explain the facility's restraint reduction program. Which response demonstrates compliance?",
    o: ["\"We use individualized assessments, try all alternatives before restraints, and have reduced restraint use by 60% over 2 years.\"", "\"We restrain all residents at high risk for falls.\"", "\"We only use restraints during night shift.\"", "\"We have eliminated all monitoring for restrained residents.\""],
    a: 0,
    r: "CMS expects facilities to demonstrate individualized assessment, documentation of alternatives tried, and progressive restraint reduction. Blanket restraint policies, time-limited use only, and eliminating monitoring are all regulatory violations.",
    s: "Restraint Use"
  },
  // ===== INFECTION CONTROL IN LONG-TERM CARE (Questions 341-400) =====
  {
    q: "A nurse is developing an infection control program for a long-term care facility. Which infection is the most common in long-term care residents?",
    o: ["Urinary tract infection", "Pneumonia", "Skin infection", "Bloodstream infection"],
    a: 0,
    r: "Urinary tract infections are the most common infection in long-term care facilities, accounting for approximately 30-40% of all healthcare-associated infections in this setting. Risk factors include catheter use, incontinence, female sex, diabetes, and functional impairment.",
    s: "Infection Control"
  },
  {
    q: "A nurse is implementing hand hygiene practices in the facility. When should alcohol-based hand sanitizer NOT be used?",
    o: ["When hands are visibly soiled or contaminated with body fluids", "Before donning gloves", "After removing gloves", "Between resident contacts"],
    a: 0,
    r: "Alcohol-based hand sanitizer is effective for routine hand hygiene but does not remove visible soil or organic material. Visibly soiled hands require soap and water. Hand sanitizer is also ineffective against C. difficile spores, which require soap and water. It is appropriate for all other listed situations.",
    s: "Infection Control"
  },
  {
    q: "A long-term care facility has an outbreak of norovirus. What is the most important infection control measure?",
    o: ["Contact precautions with soap and water hand hygiene", "Standard precautions with alcohol-based hand rub", "Airborne precautions with N95 respirator", "Droplet precautions only"],
    a: 0,
    r: "Norovirus outbreaks require contact precautions because the virus is transmitted via the fecal-oral route and contact with contaminated surfaces. Soap and water hand hygiene is essential because alcohol-based sanitizers have limited effectiveness against norovirus. Environmental cleaning with bleach-based solutions is also critical.",
    s: "Infection Control"
  },
  {
    q: "A resident is diagnosed with Clostridioides difficile infection. Which isolation precaution is required?",
    o: ["Contact precautions with dedicated equipment and soap and water hand hygiene", "Standard precautions only", "Airborne precautions", "No special precautions if the resident is on antibiotics"],
    a: 0,
    r: "C. difficile requires contact precautions because spores are transmitted via direct contact and contaminated surfaces. Alcohol-based hand sanitizer is ineffective against C. difficile spores; soap and water with friction is required. Dedicated equipment prevents cross-contamination. Bleach-based environmental cleaning is necessary.",
    s: "Infection Control"
  },
  {
    q: "A nurse is screening a new admission for methicillin-resistant Staphylococcus aureus (MRSA). Where should the surveillance culture be obtained?",
    o: ["Anterior nares (nasal swab)", "Blood culture", "Urine sample", "Throat swab"],
    a: 0,
    r: "MRSA colonization screening is performed using an anterior nares (nasal) swab because the nose is the most common site of MRSA colonization. Additional sites may include wounds, groin, or axilla. Blood and urine cultures detect active infection, not colonization.",
    s: "Infection Control"
  },
  {
    q: "A nurse notices that a staff member is wearing artificial fingernails. What infection control action should the nurse take?",
    o: ["Inform the staff member that artificial nails are prohibited in healthcare settings", "Allow the artificial nails if they are short", "Ask the staff member to wear double gloves", "Take no action since it is a personal choice"],
    a: 0,
    r: "CDC guidelines and most healthcare facilities prohibit artificial fingernails for staff providing direct patient care because they harbor significantly more bacteria and fungi, including gram-negative organisms. This increases the risk of healthcare-associated infections. Length does not mitigate the risk.",
    s: "Infection Control"
  },
  {
    q: "A long-term care facility is experiencing an influenza outbreak. Which intervention should be implemented immediately?",
    o: ["Cohort symptomatic residents, administer oseltamivir prophylaxis to exposed residents, and restrict visitors", "Continue normal operations and monitor residents", "Transfer all symptomatic residents to the hospital", "Close the facility permanently"],
    a: 0,
    r: "Influenza outbreak management includes cohorting symptomatic residents, antiviral prophylaxis (oseltamivir) for exposed residents and staff, restricting visitors, enhanced hand hygiene, and droplet precautions. Normal operations are insufficient. Mass hospital transfer is unnecessary. Facility closure is not required.",
    s: "Infection Control"
  },
  {
    q: "A nurse is educating staff on proper personal protective equipment (PPE) donning sequence. What is the correct order?",
    o: ["Hand hygiene, gown, mask, goggles, gloves", "Gloves, gown, mask, goggles", "Mask, gloves, gown, goggles", "Gown, gloves, mask, goggles"],
    a: 0,
    r: "The correct donning sequence is: hand hygiene first, then gown (covers torso), mask/respirator (protects airway), goggles/face shield (protects eyes), and gloves last (covers hands and secures gown cuffs). This sequence prevents contamination during application.",
    s: "Infection Control"
  },
  {
    q: "A resident has a urinary catheter that has been in place for 3 weeks. The nurse should assess for catheter-associated urinary tract infection (CAUTI). Which finding is most indicative of CAUTI?",
    o: ["New onset fever, suprapubic tenderness, and cloudy urine with positive culture", "Clear yellow urine with no symptoms", "Mild odor in the drainage bag", "Sediment in the tubing"],
    a: 0,
    r: "CAUTI diagnosis requires the presence of symptoms (fever, suprapubic tenderness, costovertebral angle tenderness, or new onset confusion in elderly) plus a positive urine culture (≥10³ CFU/mL). Bacteriuria without symptoms in a catheterized patient is asymptomatic bacteriuria and should not be treated with antibiotics.",
    s: "Infection Control"
  },
  {
    q: "A nurse is implementing a catheter-associated urinary tract infection (CAUTI) prevention bundle. Which intervention is most important?",
    o: ["Remove the catheter as soon as the clinical indication has resolved", "Change the catheter every 7 days routinely", "Irrigate the catheter with antibiotic solution daily", "Clamp the catheter for 2 hours before removal"],
    a: 0,
    r: "The single most important CAUTI prevention measure is timely removal of urinary catheters when no longer clinically indicated. Each day a catheter remains increases infection risk by 3-7%. Routine catheter changes, antibiotic irrigation, and clamping before removal are not evidence-based CAUTI prevention practices.",
    s: "Infection Control"
  },
  {
    q: "A nurse is responding to a scabies outbreak in the facility. Which infection control measures should be implemented?",
    o: ["Contact precautions, treat affected residents and close contacts, and launder all linens in hot water", "Standard precautions only", "Airborne precautions with N95 respirator", "Isolate affected residents and do not treat contacts"],
    a: 0,
    r: "Scabies requires contact precautions. All affected residents and close contacts (roommates, staff who provided direct care) should be treated simultaneously with permethrin or ivermectin. Linens and clothing should be washed in hot water. Standard precautions alone are insufficient. Scabies is not airborne.",
    s: "Infection Control"
  },
  {
    q: "A nurse is developing an antibiotic stewardship program for the long-term care facility. Which practice is a key component?",
    o: ["Reviewing antibiotic appropriateness, narrowing spectrum when possible, and setting duration limits", "Prescribing broad-spectrum antibiotics for all infections", "Discontinuing all antibiotics after 3 days regardless of infection", "Using antibiotics prophylactically for all catheterized residents"],
    a: 0,
    r: "Antibiotic stewardship involves reviewing antibiotic necessity, using narrow-spectrum agents when culture results allow, setting appropriate duration limits, and avoiding unnecessary prophylaxis. Broad-spectrum overuse drives resistance. Arbitrary duration limits may undertreated infections. Prophylactic antibiotics for catheters increase resistance.",
    s: "Infection Control"
  },
  {
    q: "A nurse is immunizing long-term care residents. Which vaccines are recommended for residents aged 65 and older?",
    o: ["Annual influenza, pneumococcal (PCV20 or PCV15+PPSV23), COVID-19, Tdap, and recombinant zoster", "Only influenza vaccine", "No vaccines are recommended for adults over 65", "Influenza and pneumococcal only"],
    a: 0,
    r: "CDC recommends multiple vaccines for adults 65+: annual influenza, pneumococcal conjugate vaccine, COVID-19 with updates, Tdap/Td booster, and recombinant zoster vaccine (Shingrix). Comprehensive vaccination reduces morbidity and mortality in this vulnerable population.",
    s: "Infection Control"
  },
  {
    q: "A nursing assistant has a productive cough and fever. What should the nurse instruct regarding work attendance?",
    o: ["The employee should not work with direct patient care until evaluated and cleared by occupational health", "The employee can work if they wear a mask", "The employee should work since the facility is short-staffed", "The employee can work if symptoms are mild"],
    a: 0,
    r: "Symptomatic employees should be excluded from direct patient care until evaluated and cleared, as respiratory infections can spread rapidly in long-term care populations. Masks reduce but do not eliminate transmission risk. Staffing needs do not supersede infection control requirements.",
    s: "Infection Control"
  },
  {
    q: "A nurse is cleaning a room after a resident with C. difficile is discharged. Which cleaning agent is required?",
    o: ["Bleach-based (sodium hypochlorite) disinfectant", "Quaternary ammonium compound", "Alcohol-based surface cleaner", "Plain soap and water"],
    a: 0,
    r: "C. difficile spores are resistant to most standard disinfectants, including quaternary ammonium compounds and alcohol. Bleach-based (sodium hypochlorite) solutions with a concentration of 1:10 or EPA-registered sporicidal agents are required to kill C. difficile spores on environmental surfaces.",
    s: "Infection Control"
  },
  {
    q: "A resident develops a wound infection with vancomycin-resistant enterococcus (VRE). Which precaution is most appropriate?",
    o: ["Contact precautions with gown and gloves for all contact with the resident and environment", "Standard precautions only", "Airborne precautions", "Droplet precautions"],
    a: 0,
    r: "VRE requires contact precautions because it is transmitted via direct contact with the infected/colonized person or contaminated surfaces. Gown and gloves are required for all contact. Dedicated equipment should be used. VRE is not transmitted via airborne or droplet routes.",
    s: "Infection Control"
  },
  {
    q: "A nurse is assessing a resident for signs of pneumonia. Which symptom presentation is most common in elderly long-term care residents?",
    o: ["Confusion, decreased appetite, and functional decline without classic symptoms", "High fever, productive cough, and pleuritic chest pain", "Hemoptysis and weight loss", "Wheezing and chest tightness"],
    a: 0,
    r: "Elderly residents often present with atypical pneumonia symptoms including confusion, decreased appetite, functional decline, tachycardia, and tachypnea rather than the classic triad of fever, cough, and dyspnea. The nurse should suspect pneumonia when any acute change in baseline occurs.",
    s: "Infection Control"
  },
  {
    q: "A long-term care facility is implementing a COVID-19 outbreak response. Which measure is the highest priority?",
    o: ["Testing all residents and staff, implementing transmission-based precautions, and restricting group activities", "Testing only symptomatic residents", "Restricting testing to conserve resources", "Continuing group dining with masks"],
    a: 0,
    r: "COVID-19 outbreak management requires facility-wide testing (symptomatic and asymptomatic), enhanced transmission-based precautions (droplet and contact), restricting group activities, visitor limitations, and enhanced cleaning. Testing only symptomatic individuals misses asymptomatic transmission.",
    s: "Infection Control"
  },
  // ===== RESIDENT RIGHTS (Questions 401-460) =====
  {
    q: "A nurse is orienting a new resident to the long-term care facility. Which statement best describes the resident's right to privacy?",
    o: ["\"You have the right to personal privacy during care, visits, and communication.\"", "\"Staff may enter your room at any time without knocking.\"", "\"Your medical information can be shared with any staff member.\"", "\"Privacy is limited to bathroom use only.\""],
    a: 0,
    r: "Under the Nursing Home Reform Act and Resident Bill of Rights, residents have the right to personal privacy during medical treatment, receiving visitors, telephone calls, mail, and personal activities. Staff should knock before entering, provide privacy during care, and protect health information confidentiality.",
    s: "Resident Rights"
  },
  {
    q: "A resident refuses to take their blood pressure medication. The nurse should take which action?",
    o: ["Respect the resident's right to refuse, document the refusal, educate about consequences, and notify the provider", "Hide the medication in the resident's food", "Tell the resident they must take the medication or leave the facility", "Call the family to convince the resident to take the medication"],
    a: 0,
    r: "Competent residents have the right to refuse treatment. The nurse should document the refusal, educate the resident about potential consequences, notify the provider, and respect the resident's autonomy. Hiding medication is deceptive and illegal. Threatening discharge and involving family without consent are inappropriate.",
    s: "Resident Rights"
  },
  {
    q: "A CNA reports to the nurse that she witnessed another CNA yelling at a confused resident and calling them stupid. What should the nurse do?",
    o: ["Intervene immediately, ensure resident safety, document the incident, and report to the supervisor", "Talk to the offending CNA privately and ask them to stop", "Wait until the end of shift to address it", "Ignore it since the resident has dementia and won't remember"],
    a: 0,
    r: "Verbal abuse (yelling, name-calling, threatening) of a resident is a violation of resident rights and constitutes abuse. The nurse must immediately intervene to protect the resident, document the incident, report to the supervisor and administration, and follow mandatory reporting laws. Delay or inaction enables continued abuse.",
    s: "Resident Rights"
  },
  {
    q: "A resident requests to see their medical record. How should the nurse respond?",
    o: ["\"You have the right to access your medical record. I will help you submit a request.\"", "\"Only doctors can view medical records.\"", "\"Medical records are confidential and cannot be shared with patients.\"", "\"You need to hire a lawyer to access your records.\""],
    a: 0,
    r: "Under the Resident Bill of Rights and HIPAA, residents have the right to access their medical records and to obtain copies within a reasonable time frame. The facility may charge a reasonable copying fee. Denying access violates federal regulations.",
    s: "Resident Rights"
  },
  {
    q: "A long-term care facility wants to transfer a resident to a different room without their consent. Under what circumstance is this allowed?",
    o: ["When the transfer is necessary for the resident's welfare or the welfare of other residents, with proper notice", "Anytime the facility needs the room for a new admission", "When the family requests it without the resident's input", "Transfer is never allowed without consent"],
    a: 0,
    r: "Involuntary room transfers are permitted only for specific reasons: the resident's welfare, other residents' welfare, medical necessity, nonpayment (after proper notice), or the facility ceases to operate. The facility must provide written notice and the resident has the right to appeal.",
    s: "Resident Rights"
  },
  {
    q: "A resident's daughter tells the nurse she wants to manage her mother's finances. The resident is alert and oriented. What should the nurse explain?",
    o: ["\"Your mother has the right to manage her own finances unless she designates you through legal documentation.\"", "\"Since you are the family, you can manage her finances.\"", "\"The facility will manage all residents' finances.\"", "\"We will set up automatic control for you.\""],
    a: 0,
    r: "Competent residents have the right to manage their own finances. Financial authority can only be transferred through legal documentation such as power of attorney executed by the resident. Family members do not automatically have financial authority. The facility cannot assume financial management without authorization.",
    s: "Resident Rights"
  },
  {
    q: "A resident wants to bring personal furniture and decorations to their room. What should the nurse tell the resident?",
    o: ["\"You have the right to bring personal belongings as long as they don't pose a safety hazard to you or others.\"", "\"No personal items are allowed in the facility.\"", "\"You can only bring photos in frames.\"", "\"Personal items are only allowed if they match the facility's décor.\""],
    a: 0,
    r: "Residents have the right to keep and use personal possessions including furniture, pictures, and other items that do not pose safety hazards. This right is protected under federal regulations and contributes to the resident's sense of home and identity in the long-term care setting.",
    s: "Resident Rights"
  },
  {
    q: "A married couple is admitted to the same long-term care facility. They request to share a room. What is the facility's obligation?",
    o: ["The facility must accommodate the request for a shared room if one is available", "The facility can deny the request based on policy", "Only same-sex couples can share rooms", "The couple must be in the same level of care to share a room"],
    a: 0,
    r: "Under the Nursing Home Reform Act, married couples have the right to share a room if both consent and a room is available. The facility must make reasonable accommodations. This right cannot be denied based on arbitrary facility policies or differing care levels.",
    s: "Resident Rights"
  },
  {
    q: "A nurse discovers that a resident's Social Security check is being redirected to a family member without the resident's knowledge or consent. This situation represents which form of abuse?",
    o: ["Financial exploitation", "Physical abuse", "Neglect", "Emotional abuse"],
    a: 0,
    r: "Financial exploitation involves the unauthorized or improper use of a resident's funds, property, or assets. Redirecting Social Security checks without knowledge or consent is financial exploitation and must be reported to Adult Protective Services and the appropriate authorities.",
    s: "Resident Rights"
  },
  {
    q: "A resident expresses a desire to vote in the upcoming election but needs assistance getting to the polling place. What is the nurse's responsibility?",
    o: ["Facilitate the resident's right to vote by assisting with absentee ballot or arranging transportation", "Tell the resident that voting is not possible from a nursing home", "Vote on behalf of the resident", "Encourage the resident not to worry about voting"],
    a: 0,
    r: "Residents retain their right to vote. The facility should facilitate this right by providing information about absentee ballots, arranging transportation to polling places, or assisting with the voting process. The nurse should not vote for the resident or discourage participation.",
    s: "Resident Rights"
  },
  {
    q: "A nurse is informed that a resident's advance directive states they do not want CPR. The resident goes into cardiac arrest. What should the nurse do?",
    o: ["Do not initiate CPR and provide comfort measures per the advance directive", "Begin CPR regardless of the advance directive", "Wait for the family to arrive before making a decision", "Call 911 and initiate full resuscitation"],
    a: 0,
    r: "A valid DNR order must be honored. The nurse should not initiate CPR, provide comfort care, notify the attending physician, and support the resident's end-of-life wishes. Ignoring advance directives violates the resident's autonomy. The family does not override a resident's advance directive.",
    s: "Resident Rights"
  },
  {
    q: "A resident complains that staff routinely enters their room without knocking. This violates which resident right?",
    o: ["Right to privacy and dignity", "Right to participate in activities", "Right to adequate nutrition", "Right to freedom from discrimination"],
    a: 0,
    r: "Entering a resident's room without knocking violates the right to privacy and dignity. Staff should always knock and wait for a response before entering. This right is protected under federal and state regulations governing long-term care facilities.",
    s: "Resident Rights"
  },
  {
    q: "A resident requests to leave the facility against medical advice. The resident is alert, oriented, and has decision-making capacity. What should the nurse do?",
    o: ["Educate the resident about risks, obtain a signed AMA form, arrange for follow-up care, and allow the resident to leave", "Refuse to let the resident leave", "Call security to prevent the resident from leaving", "Administer a sedative to prevent the resident from leaving"],
    a: 0,
    r: "A competent resident has the right to leave the facility at any time, including against medical advice. The nurse should educate about risks, document the conversation, have the resident sign an AMA form, and arrange for follow-up care and medication prescriptions. Preventing a competent resident from leaving constitutes false imprisonment.",
    s: "Resident Rights"
  },
  {
    q: "A resident's family insists that information about their father's diagnosis be withheld from him. The resident is competent and asking about his condition. What should the nurse do?",
    o: ["Inform the resident of his diagnosis because competent patients have the right to information about their health", "Honor the family's request and withhold information", "Tell the resident to ask his family about his diagnosis", "Provide vague answers to avoid conflict"],
    a: 0,
    r: "Competent residents have the right to be fully informed about their diagnosis, treatment, and prognosis. The family cannot override this right. Withholding information from a competent patient violates the principle of autonomy and the right to informed consent.",
    s: "Resident Rights"
  },
  {
    q: "A long-term care facility is reducing meal choices due to budget constraints. A resident complains about the limited menu. Which right is being potentially violated?",
    o: ["Right to adequate and appropriate nutrition with choices", "Right to privacy", "Right to freedom from restraints", "Right to participate in activities"],
    a: 0,
    r: "Residents have the right to adequate, appropriate nutrition that meets their needs and preferences, including reasonable menu choices. While facilities operate within budgets, they must provide nutritious, appetizing meals with options. The resident has the right to voice grievances about food quality and choices.",
    s: "Resident Rights"
  },
  {
    q: "A nurse is asked to share a resident's health information with the resident's neighbor who calls to check on them. What should the nurse do?",
    o: ["Decline to share information unless the resident has authorized the disclosure", "Share information since the neighbor is concerned", "Confirm only that the resident is in the facility", "Ask the neighbor to visit and the nurse will share information in person"],
    a: 0,
    r: "HIPAA protects resident health information from unauthorized disclosure. The nurse cannot share any information, including confirming the resident's presence in the facility, without the resident's authorization. The nurse should advise the neighbor to contact the resident directly.",
    s: "Resident Rights"
  },
  // ===== ADDITIONAL GERIATRIC SYNDROMES (Questions 461-500) =====
  {
    q: "A nurse is assessing a 87-year-old resident for sarcopenia. Which finding is most indicative of this condition?",
    o: ["Progressive loss of skeletal muscle mass and strength affecting function", "Weight gain from fluid retention", "Joint stiffness without muscle wasting", "Increased appetite with weight gain"],
    a: 0,
    r: "Sarcopenia is age-related progressive loss of skeletal muscle mass, strength, and function. It increases risk for falls, fractures, disability, and mortality. It is distinct from cachexia (disease-related wasting) and is characterized by reduced grip strength, slow gait speed, and decreased muscle mass.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is caring for a 83-year-old resident who reports urinary incontinence that occurs when coughing, sneezing, or laughing. This type of incontinence is classified as which type?",
    o: ["Stress incontinence", "Urge incontinence", "Overflow incontinence", "Functional incontinence"],
    a: 0,
    r: "Stress incontinence involves involuntary urine leakage with increased abdominal pressure (coughing, sneezing, laughing, lifting). It results from weakened pelvic floor muscles or urethral sphincter. Urge incontinence involves sudden urge with inability to delay. Overflow involves incomplete bladder emptying. Functional involves physical or cognitive barriers to toileting.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse identifies that a 80-year-old resident has symptoms of depression including anhedonia, weight loss, and social withdrawal. The resident states 'I'm just old, there's nothing to enjoy anymore.' What should the nurse do?",
    o: ["Screen for depression using a validated tool and refer for mental health evaluation", "Accept the statement as a normal part of aging", "Encourage the resident to participate in more activities", "Prescribe an antidepressant medication"],
    a: 0,
    r: "Depression is not a normal part of aging. Anhedonia, weight loss, and social withdrawal are significant symptoms requiring formal screening (Geriatric Depression Scale) and mental health referral. Accepting depression as normal delays treatment. Activity alone may be insufficient. Nurses cannot prescribe medications.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 86-year-old resident takes 8 medications and presents with dizziness, confusion, and a fall. The nurse should suspect which geriatric syndrome?",
    o: ["Prescribing cascade and adverse drug reaction", "Normal aging process", "New stroke", "Vitamin deficiency"],
    a: 0,
    r: "The prescribing cascade occurs when adverse drug effects are misidentified as new conditions and treated with additional medications, leading to further side effects. Dizziness, confusion, and falls in a polypharmacy patient should trigger a comprehensive medication review to identify causative agents.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A resident with osteoporosis is at risk for fractures. Which site is the most common location for osteoporotic fractures?",
    o: ["Vertebral compression fractures", "Skull fractures", "Rib fractures", "Metacarpal fractures"],
    a: 0,
    r: "Vertebral compression fractures are the most common osteoporotic fractures, followed by hip fractures and distal radius (Colles) fractures. Vertebral fractures may occur with minimal trauma or even spontaneously and can cause height loss, kyphosis (dowager's hump), and chronic pain.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is implementing a bowel management program for a resident with chronic constipation. Which intervention should be tried first?",
    o: ["Increase dietary fiber, fluid intake, and physical activity", "Administer a daily stimulant laxative", "Perform digital disimpaction daily", "Start a bowel rest program with clear liquids only"],
    a: 0,
    r: "Non-pharmacological interventions should be tried first for chronic constipation: adequate fiber (25-30 g/day), sufficient fluid intake (1500-2000 mL/day unless restricted), regular physical activity, and establishing a toileting routine. Stimulant laxatives and digital disimpaction are for acute management, not first-line chronic therapy.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 79-year-old resident is experiencing insomnia. The nurse should first assess for which contributing factor?",
    o: ["Pain, medication side effects, and sleep environment", "The need for a prescription sleep aid", "Whether the resident naps during the day", "The resident's preferred bedtime snack"],
    a: 0,
    r: "Insomnia assessment should focus on identifying reversible causes: pain, medications (stimulants, diuretics timed late), environmental factors (noise, light, temperature), caffeine intake, and psychological factors (anxiety, depression). Identifying the cause guides appropriate intervention rather than defaulting to sleep medications.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 88-year-old resident with a history of hypothyroidism is increasingly fatigued, constipated, and cold-intolerant. The nurse should suspect which issue?",
    o: ["Inadequate thyroid replacement or worsening hypothyroidism", "Normal aging", "Overmedication with thyroid hormone", "Heart failure"],
    a: 0,
    r: "Fatigue, constipation, and cold intolerance are classic hypothyroid symptoms suggesting inadequate thyroid hormone replacement or disease progression. TSH and free T4 levels should be checked. These symptoms should not be attributed to normal aging without investigation.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A resident develops acute delirium. The nurse's first priority is to identify which type of cause?",
    o: ["Reversible causes such as infection, medications, dehydration, or metabolic imbalance", "Permanent brain damage", "Alzheimer's disease progression", "Psychiatric illness"],
    a: 0,
    r: "Delirium is acute, fluctuating, and usually reversible. The nurse should use the mnemonic DELIRIUM (Drugs, Electrolytes, Low oxygen, Infection, Retention of urine/stool, Ictal, Undernutrition/dehydration, Myocardial/metabolic) to systematically identify and address reversible causes.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 82-year-old resident has xerostomia (dry mouth). The nurse recognizes this condition increases the risk for which complication?",
    o: ["Dental caries, oral infections, and difficulty swallowing", "Hypertension", "Urinary incontinence", "Deep vein thrombosis"],
    a: 0,
    r: "Xerostomia (dry mouth) is common in elderly patients, often caused by medications (anticholinergics, antihypertensives, antidepressants). It increases risk of dental caries, oral candidiasis, difficulty swallowing, altered taste, and malnutrition. Saliva substitutes and medication review may help.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is caring for a resident who exhibits signs of elder neglect, including poor hygiene, malnutrition, and untreated medical conditions. What is the nurse's legal obligation?",
    o: ["Report the suspected neglect to the appropriate authorities as mandated by law", "Wait for more evidence before reporting", "Talk to the family privately about the concerns", "Document the findings and continue routine care"],
    a: 0,
    r: "Healthcare professionals are mandated reporters of suspected elder abuse and neglect. Reports must be made to Adult Protective Services or the designated authority. The nurse does not need to prove abuse; reasonable suspicion is sufficient. Waiting or only documenting delays protective intervention.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 90-year-old resident has significant kyphosis and reports chronic back pain. Which nursing intervention is most appropriate?",
    o: ["Provide proper positioning support, gentle stretching exercises, and pain management", "Fit the resident for a back brace to correct the curvature", "Recommend surgical correction of the kyphosis", "Encourage the resident to lie flat at all times to straighten the spine"],
    a: 0,
    r: "Age-related kyphosis from vertebral compression fractures and osteoporosis is managed conservatively with positioning support, gentle exercise, pain management, and fall prevention. Bracing is uncomfortable and rarely corrective in severe cases. Surgery is generally not appropriate for elderly patients. Lying flat is uncomfortable and unrealistic.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A resident with diabetes and peripheral neuropathy cannot feel their feet. Which nursing assessment is most critical?",
    o: ["Daily foot inspection for skin breakdown, ulceration, and signs of infection", "Weekly blood glucose monitoring only", "Monthly neurological examination", "Annual podiatry referral only"],
    a: 0,
    r: "Diabetic peripheral neuropathy eliminates the protective sensation that alerts to injury. Daily foot inspections are critical to identify skin breakdown, blisters, cuts, and early infection before they progress to non-healing ulcers or amputation. Diabetic foot ulcers are a leading cause of lower extremity amputation.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is educating staff on recognizing signs of physical abuse in elderly residents. Which finding should raise the highest level of suspicion?",
    o: ["Bilateral bruising in various stages of healing in non-typical locations", "A single bruise on the shin from bumping a wheelchair", "Senile purpura on the forearms", "A skin tear from tape removal on fragile skin"],
    a: 0,
    r: "Multiple bruises in various stages of healing (different colors indicating different ages) in atypical locations (inner arms, back, buttocks, face) are highly suspicious for physical abuse. Single bruises on the shins, senile purpura on forearms, and skin tears from medical care are usually accidental or age-related.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 84-year-old resident has been experiencing recurrent aspiration pneumonia. The nurse should prioritize which intervention?",
    o: ["Request a speech therapy evaluation for swallowing assessment", "Start prophylactic antibiotics", "Place a nasogastric tube for all feedings", "Restrict all oral intake permanently"],
    a: 0,
    r: "Recurrent aspiration pneumonia suggests swallowing dysfunction. Speech therapy evaluation with a modified barium swallow study or fiberoptic endoscopic evaluation identifies the type and severity of dysphagia and guides appropriate diet texture modifications, positioning, and swallowing strategies.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is developing a continence care plan for a resident with functional incontinence. Which intervention is most appropriate?",
    o: ["Scheduled toileting every 2 hours and ensuring easy bathroom access", "Inserting an indwelling urinary catheter", "Starting an anticholinergic medication", "Applying adult diapers and changing every 8 hours"],
    a: 0,
    r: "Functional incontinence is caused by physical or cognitive barriers to reaching the toilet, not bladder dysfunction. The intervention should address the barriers: scheduled toileting, clear pathways to the bathroom, raised toilet seats, grab bars, and appropriate clothing. Catheters and anticholinergics don't address the root cause.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is implementing a sleep hygiene program for residents experiencing insomnia. Which intervention is evidence-based?",
    o: ["Maintain a consistent wake time, limit daytime napping, and reduce evening stimulation", "Allow residents to sleep as much as they want during the day", "Serve caffeinated beverages with dinner to promote relaxation", "Keep the lights on all night for safety"],
    a: 0,
    r: "Evidence-based sleep hygiene includes consistent sleep-wake times, limiting daytime naps to 30 minutes, reducing evening stimulation (caffeine, screen time), creating a comfortable sleep environment (dark, quiet, cool), and engaging in daytime physical activity. Unlimited napping and caffeine worsen insomnia.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 81-year-old resident has been prescribed multiple medications by different specialists. The nurse recognizes the need for medication reconciliation to prevent which adverse event?",
    o: ["Drug-drug interactions and therapeutic duplication", "Allergic reactions to food", "Surgical complications", "Physical therapy injuries"],
    a: 0,
    r: "When multiple specialists prescribe independently, the risk of drug-drug interactions and therapeutic duplication (two medications from the same class) increases. Medication reconciliation involves comparing all medications from all sources to identify and resolve discrepancies, duplications, and interactions.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is assessing a 85-year-old resident for dehydration. Which assessment technique is most reliable in older adults?",
    o: ["Checking mucous membranes, urine specific gravity, and mental status changes", "Skin turgor test on the forearm", "Capillary refill on the fingertips", "Checking for pedal edema"],
    a: 0,
    r: "In older adults, skin turgor and capillary refill are unreliable due to age-related changes in skin elasticity and peripheral circulation. More reliable indicators include oral mucous membrane moisture, urine concentration (specific gravity), mental status changes, BUN/creatinine ratio, and longitudinal tongue furrows.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A resident with advanced COPD and heart failure asks the nurse about palliative care options while in the long-term care facility. What should the nurse explain?",
    o: ["\"Palliative care focuses on comfort and quality of life and can be provided alongside your current treatments.\"", "\"Palliative care means giving up and stopping all treatments.\"", "\"Palliative care is only for cancer patients.\"", "\"You must be transferred to a hospital for palliative care.\""],
    a: 0,
    r: "Palliative care focuses on symptom management, comfort, and quality of life for residents with serious illnesses and can be provided concurrently with curative or disease-modifying treatments. It is not limited to end of life or cancer. It can be delivered in the long-term care setting.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is conducting a root cause analysis after a medication error in the long-term care facility. What is the primary goal of this analysis?",
    o: ["Identify systemic factors that contributed to the error and implement process improvements", "Determine which staff member to discipline", "File an incident report with the state", "Reduce documentation requirements"],
    a: 0,
    r: "Root cause analysis is a systematic process to identify the underlying systemic factors (process, environment, staffing, communication) that contributed to an error. The goal is to improve systems and prevent future errors, not to assign individual blame. A just culture supports learning from mistakes.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 78-year-old resident is exhibiting signs of iatrogenic illness, including confusion and a new rash after starting two new medications. What should the nurse suspect?",
    o: ["Adverse drug reactions from the new medications", "New onset dementia", "Allergic reaction to food", "A viral illness unrelated to medication changes"],
    a: 0,
    r: "Iatrogenic illness is caused by medical treatment or intervention. Temporal correlation between starting new medications and developing confusion and rash strongly suggests adverse drug reactions. The nurse should report to the provider, hold the suspected medications if appropriate, and monitor the resident closely.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is planning discharge education for a resident being transferred from the long-term care facility to home with family caregivers. Which topic is most essential?",
    o: ["Medication management, fall prevention, and when to seek medical attention", "The facility's visiting hours", "The resident's favorite television programs", "The name of every staff member who provided care"],
    a: 0,
    r: "Essential discharge education includes medication management (names, doses, timing, side effects), fall prevention strategies, skin care, nutrition, activity recommendations, follow-up appointments, and red flags requiring medical attention. This information helps family caregivers provide safe, appropriate care at home.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse notes that a 89-year-old resident has an unintentional weight loss of 5% in the past month. According to CMS guidelines, this represents which level of concern?",
    o: ["Significant weight loss requiring immediate investigation and intervention", "Normal age-related weight fluctuation", "Mild concern to monitor over the next month", "No concern if the resident does not complain"],
    a: 0,
    r: "CMS defines significant weight loss as 5% in 30 days, 7.5% in 90 days, or 10% in 180 days. This triggers mandatory investigation for underlying causes and development of an individualized nutrition plan. Unintentional weight loss in the elderly is associated with increased morbidity and mortality.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A resident with moderate dementia is on a cholinesterase inhibitor (donepezil). The family asks if the medication will cure the dementia. What should the nurse explain?",
    o: ["\"The medication may temporarily slow cognitive decline but does not cure or reverse dementia.\"", "\"Yes, the medication will cure the dementia with time.\"", "\"The medication prevents all further cognitive decline.\"", "\"Cholinesterase inhibitors only help memory, not other symptoms.\""],
    a: 0,
    r: "Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) modestly and temporarily slow cognitive decline in mild to moderate Alzheimer's disease by increasing acetylcholine levels. They do not cure, reverse, or stop the progression of the disease. Setting realistic expectations is important for families.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is assessing a long-term care resident for chronic pain. The resident has been rating pain as 4/10 for the past 6 months on acetaminophen alone. The healthcare provider asks if the resident is comfortable. What is the best response?",
    o: ["\"The resident reports 4/10 pain. We should explore if this level is acceptable to the resident and consider multimodal approaches.\"", "\"4/10 is mild and does not need any changes.\"", "\"We should start an opioid immediately.\"", "\"Pain at this level is expected in the elderly.\""],
    a: 0,
    r: "Pain management goals should be individualized. A 4/10 may be acceptable to one resident but not another. The nurse should assess the resident's functional goals, how pain affects daily activities, and explore multimodal options (physical therapy, heat/cold, massage, adjuvant medications) before escalating to opioids.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is implementing a restorative nursing program for a resident who has been bedridden after a hip fracture. What is the primary goal?",
    o: ["Restore the resident to their highest practicable level of function", "Keep the resident comfortable in bed", "Prevent the resident from falling again by limiting mobility", "Complete all ADLs for the resident to save time"],
    a: 0,
    r: "Restorative nursing focuses on helping residents achieve and maintain their highest practicable level of physical, mental, and psychosocial function. This includes progressive mobility, self-care training, and encouragement of independence. Keeping residents in bed or doing everything for them promotes learned helplessness and deconditioning.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A 76-year-old resident is readmitted to the long-term care facility after a hospitalization for pneumonia. The nurse should prioritize which assessment?",
    o: ["Comprehensive reassessment including cognitive, functional, and nutritional status changes from baseline", "Only vital signs and lung sounds", "Weight and dietary preferences", "Room assignment and personal belongings"],
    a: 0,
    r: "Hospital readmissions frequently result in functional decline, cognitive changes, new medications, and nutritional deficits. A comprehensive reassessment comparing current status to pre-hospitalization baseline identifies new problems, medication changes, and rehabilitation needs for updated care planning.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse is caring for a long-term care resident who is actively dying. The family is present at the bedside. Which nursing action is most appropriate?",
    o: ["Provide comfort measures, emotional support to the family, and ensure the resident's dignity", "Initiate CPR unless specifically ordered not to", "Ask the family to leave the room", "Administer all routine medications on schedule"],
    a: 0,
    r: "End-of-life nursing care focuses on comfort (pain management, positioning, mouth care, skin care), maintaining dignity, supporting the family emotionally, and respecting advance directives. Family presence should be supported. Routine medications that no longer benefit the resident should be discontinued in consultation with the provider.",
    s: "Geriatric Syndromes"
  },
  {
    q: "A nurse identifies that a long-term care resident has developed contractures of both knees from prolonged immobility. Which intervention should the nurse implement to prevent further progression?",
    o: ["Range-of-motion exercises, proper positioning with supportive devices, and physical therapy referral", "Apply hot packs to the contracted joints continuously", "Force the joints into extension during repositioning", "Accept the contractures as irreversible and take no action"],
    a: 0,
    r: "Contractures are prevented and managed with regular range-of-motion exercises (passive if the resident cannot participate actively), proper positioning with supportive devices (splints, wedges), and physical therapy. Forcing joints causes pain and injury. Continuous heat is not therapeutic. Early intervention can slow or prevent progression.",
    s: "Geriatric Syndromes"
  }
];
