import type { LessonContent } from "./types";

const infantNutrition: LessonContent = {
  title: "Nutrition in Infants (0-12 Months)",
  cellular: {
    title: "Physiologic Basis of Infant Nutrition",
    content: "Infants have unique metabolic characteristics including rapid growth velocity, high caloric needs per kilogram, immature organ systems, limited nutrient reserves, and a developing brain requiring continuous fuel. Energy requirements commonly range around 100-120 kcal/kg/day, reflecting the metabolic cost of tissue synthesis and brain development. The brain alone consumes a disproportionately large fraction of total energy. Unlike adults, infants have limited glycogen reserves, limited fat stores, high basal metabolic rate, and rapid gastric emptying: producing the classic pattern of small, frequent feedings. Breast milk is species-specific and dynamically adaptive, providing lactose as the dominant carbohydrate for brain metabolism, highly digestible whey-predominant proteins, long-chain fatty acids for retinal and neurologic development, and immunologic protection via IgA, lactoferrin, and leukocytes. Infant formula approximates breast milk composition but introduces preparation-dependent risks: over-dilution causes inadequate caloric intake and hyponatremia risk, while over-concentration causes dehydration and renal solute load stress."
  },
  signs: {
    left: [
      "Hunger cues: rooting, hand-to-mouth, sucking motions",
      "Satiety cues: turning away, decreased sucking",
      "Crying is a LATE hunger sign",
      "Physiologic weight loss after birth (regain within 1-2 weeks)",
      "Tongue-thrust reflex present before 6 months"
    ],
    right: [
      "Failure to thrive: weight faltering below growth trajectory",
      "Dehydration: decreased output, sunken fontanelle, poor skin turgor",
      "Iron deficiency: pallor, irritability, developmental concerns",
      "Rickets: delayed bone development from vitamin D deficiency",
      "Hyponatremia: from excess free water: seizure risk"
    ]
  },
  medications: [
    { name: "Vitamin D Supplement", type: "Fat-soluble vitamin", action: "Supports calcium absorption and bone mineralization; breast milk contains insufficient vitamin D", sideEffects: "GI upset at excessive doses", contra: "Hypercalcemia", pearl: "Breastfed infants require supplementation; formula-fed may not need it once intake reaches ~1L/day" },
    { name: "Iron Supplement", type: "Mineral supplement", action: "Supports hemoglobin production and neurodevelopment; stores decline at 4-6 months", sideEffects: "Constipation, dark stools, GI irritation", contra: "Hemochromatosis", pearl: "Iron-fortified cereals are a key first food when starting solids" }
  ],
  pearls: [
    "Breast milk is the gold standard: species-specific and dynamically adaptive",
    "Formula dilution errors are extremely dangerous and frequently tested",
    "Excess free water causes hyponatremia and seizure risk in infants",
    "Cow's milk is NOT appropriate before 12 months: causes iron deficiency and GI irritation",
    "Solid food readiness: head control, loss of tongue-thrust reflex, sitting with support, food interest",
    "Iron-containing foods are prioritized when introducing solids at ~6 months",
    "Growth trends are more meaningful than isolated intake data",
    "Vitamin D supplementation is one of the most consistently tested infant nutrition topics"
  ],
  quiz: [
    { question: "What is the primary reason cow's milk is avoided in early infancy?", options: ["Too expensive", "Low iron content and GI irritation causing anemia risk", "Too much protein for taste preference", "Allergy prevention only"], correct: 1, rationale: "Cow's milk has low iron, high protein/solute load, causes GI irritation, and increases anemia risk. It is nutritionally inappropriate before 12 months." },
    { question: "An exclusively breastfed infant most likely needs supplementation with which nutrient?", options: ["Vitamin C", "Vitamin D", "Calcium", "Zinc"], correct: 1, rationale: "Breast milk contains insufficient vitamin D regardless of maternal status. Supplementation prevents rickets and supports bone mineralization." },
    { question: "A parent prepares formula with extra powder to make it 'stronger.' What is the primary concern?", options: ["Constipation", "Dehydration and renal solute overload", "Vitamin toxicity", "Weight gain"], correct: 1, rationale: "Over-concentrated formula increases renal solute load and causes dehydration: a critical safety concern frequently tested on exams." },
    { question: "What is the earliest reliable hunger cue in a newborn?", options: ["Crying", "Rooting and hand-to-mouth movements", "Hiccups", "Fussiness"], correct: 1, rationale: "Rooting and hand-to-mouth behavior are early hunger cues. Crying is a late hunger sign: exams test this distinction." }
  ]
};

const toddlerNutrition: LessonContent = {
  title: "Nutrition in Toddlers",
  cellular: {
    title: "Growth & Metabolic Changes in Early Childhood",
    content: "After the first year of life, growth velocity slows dramatically. Weight gain decreases considerably, caloric requirements per kilogram drop, appetite fluctuates widely day-to-day, and food intake becomes inconsistent. Toddlers often eat well one day and almost nothing the next: this is developmentally normal, not pathology. Daily intake is less important than weekly trends. Energy needs approximate 1000-1400 kcal/day for toddlers (1-3 years) and 1200-1800 kcal/day for preschoolers (4-5 years). Portion sizes are much smaller than caregivers expect: a useful teaching rule is portion size approximately equals the child's palm or fist. Fat remains essential for brain development and myelination; low-fat diets are inappropriate for toddlers unless medically indicated. After age 1, children transition from formula/breast milk toward whole cow's milk (typically recommended until ~2 years), with intake limited to ~500-750 mL/day. Excess milk intake is extremely common and clinically important: it leads to iron deficiency anemia, reduced appetite for solid foods, and constipation."
  },
  signs: {
    left: [
      "Food jags: eating same food repeatedly (normal)",
      "Sudden refusal of previously accepted foods (normal)",
      "Strong autonomy and control behaviors around eating",
      "Preference for grazing over structured meals",
      "Appetite naturally declines after infancy"
    ],
    right: [
      "Pale toddler + high milk intake = suspect iron deficiency",
      "Iron deficiency: pallor, fatigue, irritability, developmental concerns",
      "Failure to thrive: growth deviation requiring evaluation",
      "Constipation from low fiber, excess milk, poor fluid intake",
      "Obesity risk from sugary beverages, large portions, processed foods"
    ]
  },
  medications: [
    { name: "Oral Iron Supplement", type: "Mineral replacement", action: "Treats/prevents iron deficiency anemia common in toddlers with excessive milk intake", sideEffects: "Constipation, dark stools, teeth staining", contra: "Hemochromatosis", pearl: "Exam classic: milk overconsumption = iron deficiency risk. Limit milk to 500-750 mL/day" },
    { name: "Multivitamin with Iron", type: "Nutritional supplement", action: "Provides micronutrients for picky eaters at risk for deficiencies", sideEffects: "GI upset, constipation", contra: "Pre-existing vitamin toxicity", pearl: "Supplementation may be needed for zinc, vitamin D, and iron in selective eaters" }
  ],
  pearls: [
    "Picky eating is normal development, NOT pathology: appetite naturally declines after infancy",
    "Caregiver controls WHAT is offered; child controls WHETHER and HOW MUCH is eaten",
    "3 meals + 2-3 snacks daily: constant grazing leads to poor appetite at meals",
    "Whole fruit > fruit juice: juice is a major hidden sugar problem in toddlers",
    "Excess milk intake is the #1 cause of iron deficiency in toddlers",
    "Pressure to eat worsens resistance; repeated exposure builds acceptance",
    "Choking hazards: whole grapes, nuts, hard raw vegetables, large chunks",
    "Restricting fat excessively may impair growth: toddlers need dietary fat"
  ],
  quiz: [
    { question: "A 2-year-old is described as pale and fatigued. The parent reports the child drinks 5 cups of milk daily. What is the most likely concern?", options: ["Lactose intolerance", "Iron deficiency anemia", "Vitamin D toxicity", "Dehydration"], correct: 1, rationale: "Excessive milk intake (>750 mL/day) displaces iron-rich foods and can cause GI blood loss, leading to iron deficiency anemia: a classic exam pattern." },
    { question: "A parent is concerned that their toddler barely ate anything yesterday. What is the best nursing response?", options: ["Order lab work immediately", "Reassure that day-to-day appetite fluctuation is normal at this age", "Recommend a calorie-dense supplement", "Suggest force-feeding techniques"], correct: 1, rationale: "Appetite variability is developmentally normal in toddlers. Weekly trends matter more than daily intake. Reassurance and education are appropriate." },
    { question: "Which food modification is most important for toddler safety?", options: ["Removing all fat from diet", "Cutting grapes into quarters and avoiding whole nuts", "Limiting all dairy products", "Serving only pureed foods"], correct: 1, rationale: "Choking prevention is a critical safety priority. Whole grapes, nuts, and hard raw vegetables are high-risk foods that must be modified." }
  ]
};

const schoolAgeNutrition: LessonContent = {
  title: "Nutrition in School-Age Children (6-12 Years)",
  cellular: {
    title: "Growth & Metabolic Characteristics",
    content: "School-age children enter a period of steady, predictable physical growth combined with major cognitive and psychosocial development. Growth is slow but consistent with gradual increases in height and weight, increased muscle mass and bone density, improved appetite regulation, and reduced fat accumulation. Energy demands vary widely due to differences in activity levels: a highly active child may require substantially more energy than a sedentary peer. Approximate needs range from 1400-1800 kcal/day for younger school-age (6-8 years) to 1600-2200+ kcal/day for older school-age (9-12 years). Nutrition now supports linear growth, lean body mass expansion, increasing physical activity, cognitive performance and attention, immune competence, and early metabolic programming for adulthood. Inadequate intake may present as fatigue, irritability, or poor academic performance rather than obvious weight loss. This stage begins shaping long-term cardiometabolic risk: childhood calcium deficits may influence future osteoporosis risk, and early obesity carries metabolic risks including insulin resistance, dyslipidemia, and hypertension patterns."
  },
  signs: {
    left: [
      "Steady, predictable growth pattern",
      "Improved appetite regulation compared to toddlers",
      "Increased influence of peers and school environment",
      "Growing body image awareness",
      "Breakfast consumption correlates with academic function"
    ],
    right: [
      "Iron deficiency: fatigue, decreased concentration, poor school performance",
      "Obesity: insulin resistance, dyslipidemia, hypertension patterns",
      "Dental caries from frequent sugar exposure",
      "Constipation from low fiber and fluid intake",
      "Dehydration: headache, fatigue, reduced attention"
    ]
  },
  medications: [
    { name: "Iron Supplement", type: "Mineral", action: "Supports hemoglobin synthesis and cognitive function; deficiency affects concentration and school performance", sideEffects: "Constipation, dark stools", contra: "Hemochromatosis", pearl: "Learning difficulties + pallor + poor diet = consider iron deficiency" },
    { name: "Calcium/Vitamin D Supplement", type: "Mineral/vitamin", action: "Supports peak bone mass development; childhood deficits influence future osteoporosis risk", sideEffects: "GI upset, constipation", contra: "Hypercalcemia", pearl: "Up to 40-60% of adult bone mass accumulates during late childhood and adolescence" }
  ],
  pearls: [
    "Breakfast is critically important: skipping correlates with reduced academic performance",
    "Sugary beverages are a major modifiable risk factor for obesity and dental caries",
    "Iron affects cognition and energy: learning difficulties + pallor + poor diet = evaluate iron",
    "Calcium and vitamin D support peak bone mass development",
    "Habits formed during school age persist into adulthood",
    "Physical activity is the largest modifier of energy requirements",
    "Food marketing and peer pressure increasingly influence dietary choices",
    "Early obesity patterns carry metabolic risks: insulin resistance, dyslipidemia"
  ],
  quiz: [
    { question: "A school-age child presents with fatigue, poor concentration, and pallor. Diet history reveals low meat intake and excessive sugary beverages. What should the nurse evaluate?", options: ["Thyroid function", "Iron status", "Blood glucose", "Vitamin C levels"], correct: 1, rationale: "Fatigue + poor concentration + pallor + poor diet is a classic pattern for iron deficiency in school-age children." },
    { question: "Which meal is most strongly associated with academic performance in school-age children?", options: ["Lunch", "Dinner", "Breakfast", "Afternoon snack"], correct: 2, rationale: "Breakfast consumption is strongly correlated with cognitive performance, attention span, and energy regulation throughout the school day." },
    { question: "What is the most important long-term implication of inadequate calcium intake during childhood?", options: ["Tooth decay", "Reduced peak bone mass increasing future osteoporosis risk", "Muscle weakness", "Growth retardation"], correct: 1, rationale: "Childhood calcium deficits reduce peak bone mass accumulation, which is the primary determinant of future osteoporosis risk." }
  ]
};

const adolescentNutrition: LessonContent = {
  title: "Nutrition in Adolescents (12-18 Years)",
  cellular: {
    title: "Growth & Development Physiology",
    content: "Adolescence is characterized by rapid somatic growth, profound hormonal changes, neurodevelopmental remodeling, and increasing autonomy. Nutritional demands peak during this stage, yet dietary behaviors often deteriorate. Adolescents undergo the second most rapid growth period after infancy, driven by growth hormone, IGF-1, and sex steroids (estrogen, testosterone). Key processes include accelerated linear growth, increased lean body mass, expansion of blood volume, skeletal mineralization, and sex-specific body composition shifts. Caloric needs vary widely: females require approximately 1800-2400+ kcal/day and males 2200-3200+ kcal/day. Up to 40-60% of adult bone mass accumulates during adolescence: this is the peak bone-building period. Iron requirements increase for different reasons: females due to menstrual blood loss, males due to expansion of muscle mass and blood volume. Eating disorders (anorexia nervosa, bulimia nervosa, binge eating disorder) reach peak risk during adolescence. Body image awareness intensifies and normal physiologic changes (increased fat deposition in females, increased lean muscle in males) are frequently misinterpreted, driving unhealthy behaviors."
  },
  signs: {
    left: [
      "Dramatic appetite increase during growth spurts",
      "Normal: increased fat deposition in females",
      "Normal: increased lean muscle mass in males",
      "Erratic eating schedules and meal skipping common",
      "Autonomy increases faster than nutritional judgment"
    ],
    right: [
      "Eating disorder warnings: rapid weight change, food restriction, body image distortion, excessive exercise, amenorrhea",
      "Iron deficiency: fatigue, pallor, poor concentration, academic decline",
      "Obesity risk: insulin resistance, type 2 diabetes, dyslipidemia, hypertension",
      "Electrolyte disturbances and bradycardia in severe eating disorders",
      "Energy drink overconsumption: caffeine toxicity, cardiac effects"
    ]
  },
  medications: [
    { name: "Iron Supplement", type: "Mineral", action: "Replaces iron lost through menstruation (females) or used for muscle/blood volume expansion (males)", sideEffects: "Constipation, dark stools, nausea", contra: "Hemochromatosis", pearl: "Classic exam: teen with fatigue + poor diet = evaluate iron status" },
    { name: "Calcium/Vitamin D", type: "Mineral/vitamin", action: "Supports peak bone mass accumulation; 40-60% of adult bone mass built during adolescence", sideEffects: "GI upset", contra: "Hypercalcemia", pearl: "Reduced peak bone mass = increased osteoporosis risk in adulthood" }
  ],
  pearls: [
    "Nutritional needs PEAK during adolescence: second most rapid growth after infancy",
    "Eating disorders are critical safety issues: early recognition is essential",
    "Meal skipping (especially breakfast) correlates with metabolic dysregulation",
    "Iron deficiency is common and clinically subtle: assess in fatigued teens",
    "Female adolescent + heavy menses + pallor = classic iron deficiency pattern",
    "Calcium and vitamin D are critical for peak bone mass acquisition",
    "Energy drinks are a growing safety concern in adolescents",
    "Lifestyle patterns formed during adolescence persist into adulthood"
  ],
  quiz: [
    { question: "A 15-year-old female presents with fatigue, pallor, and heavy menstrual periods. What is the priority assessment?", options: ["Thyroid function", "Iron status and hemoglobin", "Blood glucose", "Vitamin B12"], correct: 1, rationale: "Female adolescent + heavy menses + pallor + fatigue is the classic exam pattern for iron deficiency anemia." },
    { question: "Which warning sign most strongly suggests an eating disorder in an adolescent?", options: ["Skipping breakfast occasionally", "Rapid weight change with food restriction rituals and body image distortion", "Preference for fast food", "Drinking energy drinks"], correct: 1, rationale: "Rapid weight change combined with food restriction rituals and body image distortion are key warning signs requiring immediate assessment." },
    { question: "Why is calcium intake during adolescence considered critically important?", options: ["Prevents dental caries", "Supports peak bone mass: 40-60% of adult bone mass accumulates during this period", "Improves academic performance", "Prevents weight gain"], correct: 1, rationale: "Adolescence is the peak bone-building period. Inadequate calcium now reduces peak bone mass and increases future osteoporosis risk." }
  ]
};

const pregnancyNutrition: LessonContent = {
  title: "Nutrition in Pregnancy",
  cellular: {
    title: "Maternal Metabolic Adaptations",
    content: "Pregnancy represents a state of profound metabolic adaptation, not simply increased caloric intake. Maternal physiology undergoes fundamental changes: basal metabolic rate increases to support fetal growth, placental tissue, uterine expansion, and maternal tissue remodeling. Plasma volume increases substantially, causing dilutional anemia risk and increasing iron and protein demands. Pregnancy induces progressive insulin resistance driven by placental hormones to ensure constant glucose availability for the fetus: when pancreatic compensation is inadequate, gestational diabetes develops. Maternal physiology prioritizes fetal nutrient supply, sometimes at maternal expense. Additional caloric needs vary by trimester: minimal increase in the first trimester, approximately 300-350 kcal/day in the second, and approximately 450 kcal/day in the third. Caloric needs do NOT double: a common misconception tested on exams. Folic acid is critical for neural tube closure which occurs very early, often before pregnancy is recognized. Iron requirements rise due to expanded blood volume, placental development, and fetal stores. Inadequate nutrition can alter lifelong disease risk through fetal programming mechanisms."
  },
  signs: {
    left: [
      "Increased appetite in second and third trimesters",
      "Morning nausea is common (manage with small frequent meals)",
      "Food aversions and cravings are normal",
      "Weight gain reflects physiologic adaptation",
      "Increased caloric needs vary by trimester"
    ],
    right: [
      "Iron deficiency: fatigue, pallor: pregnancy + fatigue + pallor = evaluate iron",
      "Neural tube defects from insufficient folic acid",
      "Gestational diabetes from inadequate insulin compensation",
      "Hyponatremia from excess water intake",
      "Listeriosis/toxoplasmosis risk from unsafe foods"
    ]
  },
  medications: [
    { name: "Prenatal Folic Acid", type: "Water-soluble vitamin", action: "Prevents neural tube defects (spina bifida, anencephaly); must be taken before conception and during early pregnancy", sideEffects: "Generally well-tolerated", contra: "None at standard doses", pearl: "Neural tube closes VERY early: supplementation must begin before many women know they are pregnant" },
    { name: "Prenatal Iron", type: "Mineral supplement", action: "Supports expanded blood volume, placental development, and fetal iron stores", sideEffects: "Constipation, nausea, dark stools", contra: "Hemochromatosis", pearl: "Pregnancy + fatigue + pallor = evaluate iron status" },
    { name: "Prenatal Vitamin D", type: "Fat-soluble vitamin", action: "Supports calcium absorption, bone health for mother and fetus", sideEffects: "Rare at standard doses", contra: "Hypercalcemia", pearl: "Deficiency may contribute to preeclampsia risk and poor bone mineralization" }
  ],
  pearls: [
    "Caloric needs do NOT double in pregnancy: a common exam misconception",
    "Folic acid supplementation must begin BEFORE conception to prevent neural tube defects",
    "Iron requirements increase significantly due to expanded blood volume",
    "Avoid high-risk foods: unpasteurized cheese, deli meats, raw fish, undercooked eggs",
    "No safe level of alcohol established during pregnancy: fetal alcohol spectrum risk",
    "Gestational diabetes results from pregnancy-induced insulin resistance + inadequate pancreatic compensation",
    "Nausea management: small frequent meals, avoid triggers, eat before rising",
    "Weight gain should reflect physiologic adaptation, not excess"
  ],
  quiz: [
    { question: "A pregnant woman asks if she needs to 'eat for two.' What is the most accurate response?", options: ["Yes, double caloric intake immediately", "Additional caloric needs are modest and vary by trimester: approximately 300-450 extra kcal/day in later pregnancy", "No additional calories are needed", "Triple caloric intake in the third trimester"], correct: 1, rationale: "Caloric needs increase modestly: minimal in the first trimester, ~300-350 kcal/day in the second, ~450 kcal/day in the third. 'Eating for two' is a misconception." },
    { question: "Why is folic acid supplementation recommended before conception?", options: ["Prevents morning sickness", "Neural tube closure occurs very early, often before pregnancy is recognized", "Prevents iron deficiency", "Reduces labor pain"], correct: 1, rationale: "The neural tube closes in the first few weeks of pregnancy: often before the woman knows she is pregnant. Supplementation must begin before conception." },
    { question: "Which food should a pregnant woman avoid due to infection risk?", options: ["Cooked chicken", "Pasteurized milk", "Unpasteurized soft cheese", "Whole wheat bread"], correct: 2, rationale: "Unpasteurized soft cheeses carry Listeria risk, which can cause serious fetal harm. This is a high-yield food safety topic in pregnancy exams." }
  ]
};

const lactationNutrition: LessonContent = {
  title: "Nutrition in Breastfeeding (Lactation)",
  cellular: {
    title: "Metabolic Physiology of Lactation",
    content: "Breastfeeding is a state of active nutrient transfer, not passive nourishment. The maternal body must continuously synthesize milk while maintaining its own metabolic stability. Milk production is energetically expensive: breastfeeding mothers typically require additional energy intake because lactation increases total energy expenditure, milk contains approximately 20 kcal per ounce, and production volume may exceed 750 mL per day. Caloric needs depend on milk volume, maternal activity, and body composition. Some energy comes from maternal fat stores accumulated during pregnancy, but dietary intake remains important. Insufficient intake may contribute to inadequate milk production, excessive maternal weight loss, fatigue and poor recovery, and nutrient depletion. Breast milk composition is tightly regulated: the body prioritizes milk composition even at maternal expense in most cases. However, maternal diet directly influences the fatty acid profile of breast milk, vitamin content (particularly B vitamins and vitamin D), and overall caloric density. Poor maternal nutrition may contribute to fatigue, nutrient depletion, impaired recovery, and reduced well-being."
  },
  signs: {
    left: [
      "Increased thirst and hunger during breastfeeding",
      "Adequate infant output (wet diapers) indicates sufficient milk",
      "Gradual return to pre-pregnancy weight expected",
      "Breast milk composition adapts to infant needs",
      "Fat stores from pregnancy provide partial energy"
    ],
    right: [
      "Fatigue from insufficient energy intake + sleep deprivation",
      "Perceived low milk supply (often related to dehydration, stress, or inadequate intake)",
      "Vitamin D deficiency passed to infant through low milk levels",
      "B12 deficiency risk in vegan/vegetarian mothers",
      "Excessive maternal weight loss (>1 kg/week) may affect milk supply"
    ]
  },
  medications: [
    { name: "Postnatal Vitamin D", type: "Fat-soluble vitamin", action: "Supplements infant vitamin D via breast milk or direct infant supplementation", sideEffects: "Rare at standard doses", contra: "Hypercalcemia", pearl: "Breast milk vitamin D is insufficient: infant supplementation is generally recommended" },
    { name: "Postnatal Iron", type: "Mineral", action: "Replaces iron lost during delivery and supports recovery", sideEffects: "Constipation, dark stools", contra: "Hemochromatosis", pearl: "Continued supplementation may be recommended postpartum, especially after hemorrhage" }
  ],
  pearls: [
    "Lactation is energetically expensive: approximately 500 additional kcal/day needed",
    "Maternal diet influences breast milk fatty acid profile and vitamin content",
    "Adequate hydration is essential: dehydration may reduce milk supply",
    "Breast milk vitamin D is insufficient: infant supplementation is standard",
    "B12 supplementation is important for vegan/vegetarian breastfeeding mothers",
    "Balanced intake is the goal: extreme restriction or supplementation is unnecessary",
    "Perceived low milk supply is often related to dehydration, stress, or inadequate caloric intake",
    "Gradual weight loss is expected but excessive loss (>1 kg/week) may affect milk production"
  ],
  quiz: [
    { question: "A breastfeeding mother asks why she feels so hungry and thirsty. What is the best explanation?", options: ["Hormonal imbalance requiring treatment", "Milk production is energetically expensive, requiring approximately 500 additional kcal/day and increased fluid intake", "This is abnormal and needs investigation", "It will resolve after 2 weeks"], correct: 1, rationale: "Lactation significantly increases energy and fluid demands. Increased hunger and thirst are normal physiologic responses to milk production." },
    { question: "A vegan breastfeeding mother should be counseled about supplementation with which nutrient?", options: ["Vitamin C", "Vitamin B12", "Potassium", "Sodium"], correct: 1, rationale: "B12 is found primarily in animal products. Vegan mothers are at risk for deficiency, which can affect both maternal health and infant neurologic development via breast milk." }
  ]
};

const therapeuticDiets: LessonContent = {
  title: "Therapeutic Diets: Clinical Nutrition",
  cellular: {
    title: "Diet as Physiologic Intervention",
    content: "In clinical medicine, diet functions as a physiologic intervention capable of altering hemodynamics, metabolic stability, fluid balance, organ workload, and disease progression. Therapeutic diets manipulate sodium to control fluid volume, potassium to maintain cardiac stability, protein to manage nitrogen load and renal workload, carbohydrates to regulate glycemia, and fluid to prevent volume overload. Sodium governs extracellular fluid volume: high sodium intake causes water retention, increased circulating volume, and directly impacts cardiac preload, blood pressure, vascular wall stress, and neurologic function. Fluid restriction reduces volume overload and cardiopulmonary stress, often accompanying sodium management but serving a distinct purpose. Carbohydrate-controlled diets manage postprandial glucose excursions and insulin demands. Protein restriction reduces nitrogen waste accumulation in renal failure, while high-protein diets support wound healing and tissue repair. Potassium restriction prevents hyperkalemia-related cardiac conduction abnormalities. The cardiac/heart-healthy diet targets lipid balance and vascular health by modifying saturated fats, cholesterol, and sodium intake."
  },
  signs: {
    left: [
      "Sodium restriction: used for heart failure, hypertension, renal disease, cirrhosis",
      "Fluid restriction: used for heart failure, SIADH, renal failure, hyponatremia",
      "Carbohydrate-controlled: used for diabetes, gestational diabetes, metabolic syndrome",
      "Protein restriction: used for hepatic encephalopathy, chronic kidney disease",
      "Potassium restriction: used for renal failure, hyperkalemia"
    ],
    right: [
      "Excess sodium → fluid retention → pulmonary edema, hypertension",
      "Excess fluid → volume overload → cardiopulmonary compromise",
      "Uncontrolled carbohydrates → hyperglycemia → diabetic complications",
      "Excess protein in renal failure → uremia, encephalopathy",
      "Potassium excess → cardiac dysrhythmias → potential cardiac arrest"
    ]
  },
  medications: [
    { name: "Potassium Supplements", type: "Electrolyte replacement", action: "Replaces potassium in patients on potassium-wasting diuretics or with hypokalemia", sideEffects: "GI irritation, hyperkalemia if excessive", contra: "Hyperkalemia, renal failure without monitoring", pearl: "Never give IV potassium by push: always dilute and infuse slowly with cardiac monitoring" },
    { name: "Phosphate Binders", type: "Mineral management", action: "Reduces phosphate absorption in renal failure patients on renal diet", sideEffects: "Constipation, GI upset", contra: "Hypophosphatemia", pearl: "Must be taken WITH meals to bind dietary phosphate" }
  ],
  pearls: [
    "Think: 'What physiologic variable is this diet controlling?' not 'What foods are allowed?'",
    "Sodium restriction = fluid balance control, NOT just 'salt preference'",
    "Potassium abnormalities = cardiac danger (dysrhythmias, arrest)",
    "Renal diets restrict sodium, potassium, phosphorus, and often fluid",
    "Cardiac diets restrict sodium and saturated fats",
    "Diabetic diets focus on consistent carbohydrate control, not sugar elimination",
    "Improper diet adherence can trigger acute clinical deterioration",
    "Electrolyte and fluid balance are dominant themes on licensing exams"
  ],
  quiz: [
    { question: "A patient with heart failure is on a sodium-restricted diet. What is the physiologic rationale?", options: ["Reduce taste preference for salty foods", "Reduce extracellular fluid volume to decrease cardiac preload and reduce pulmonary congestion", "Prevent kidney stones", "Lower cholesterol"], correct: 1, rationale: "Sodium restriction reduces water retention and circulating volume, directly decreasing cardiac preload and reducing risk of pulmonary edema." },
    { question: "A patient with chronic kidney disease asks why they must limit protein intake. What is the correct explanation?", options: ["Protein causes weight gain", "Protein metabolism produces nitrogen waste that damaged kidneys cannot adequately excrete", "Protein raises blood sugar", "Protein causes hypertension"], correct: 1, rationale: "Protein catabolism produces urea and other nitrogen waste products. In renal failure, the kidneys cannot clear these waste products, leading to uremia." },
    { question: "Which therapeutic diet modification is most critical for a patient with hyperkalemia?", options: ["Fluid restriction", "Sodium restriction", "Potassium restriction", "Calorie restriction"], correct: 2, rationale: "Potassium excess causes dangerous cardiac conduction abnormalities. Dietary potassium restriction is essential to prevent dysrhythmias and potential cardiac arrest." }
  ]
};

export const nutritionLessons: Record<string, LessonContent> = {
  "nutrition-infants": infantNutrition,
  "nutrition-toddlers": toddlerNutrition,
  "nutrition-school-age": schoolAgeNutrition,
  "nutrition-adolescents": adolescentNutrition,
  "nutrition-pregnancy": pregnancyNutrition,
  "nutrition-lactation": lactationNutrition,
  "therapeutic-diets": therapeuticDiets,
};
