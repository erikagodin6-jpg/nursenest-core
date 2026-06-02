import { useI18n } from "@/lib/i18n";
import {
  MicroLesson,
  CognitiveCard,
  HoverReveal,
  MatchingExercise,
  SelfCheckQuiz,
  ProgressiveReveal,
} from "@/components/interactive-learning";
import { EditableModuleText, useEditableText } from "@/components/module-edit-context";
import { UtensilsCrossed, Droplets, Scale, Apple } from "lucide-react";

export function NutritionFoundationsModule() {
  const { t } = useI18n();
  const macronutrientContent = useEditableText("nf-macronutrient-content", "Macronutrients are nutrients needed in large quantities that provide energy (calories). Carbohydrates provide 4 kcal/g and are the body's preferred energy source — the brain relies almost exclusively on glucose. Proteins provide 4 kcal/g and are essential for tissue repair, immune function, enzyme production, and fluid balance (albumin maintains oncotic pressure). Fats provide 9 kcal/g — the most calorie-dense macronutrient — and are essential for hormone synthesis, cell membrane integrity, absorption of fat-soluble vitamins (A, D, E, K), and insulation. Alcohol provides 7 kcal/g but is not classified as a macronutrient because it offers no nutritional value.");
  const electrolyteContent = useEditableText("nf-electrolyte-content", "Key electrolytes obtained from diet include: Sodium (Na+) — found in processed foods, table salt; regulates fluid balance and nerve impulses; normal: 135-145 mEq/L. Potassium (K+) — found in bananas, oranges, potatoes, spinach; critical for cardiac function and muscle contraction; normal: 3.5-5.0 mEq/L. Calcium (Ca²+) — found in dairy, leafy greens, fortified foods; essential for bone health, muscle contraction, blood clotting; normal: 8.5-10.5 mg/dL. Magnesium (Mg²+) — found in nuts, seeds, whole grains; cofactor in 300+ enzymatic reactions; normal: 1.5-2.5 mEq/L. Phosphorus — found in dairy, meat, beans; partners with calcium for bone health; normal: 2.5-4.5 mg/dL.");
  const malnutritionContent = useEditableText("nf-malnutrition-content", "BMI categories: Underweight (<18.5), Normal (18.5-24.9), Overweight (25.0-29.9), Obese Class I (30.0-34.9), Obese Class II (35.0-39.9), Obese Class III (≥40.0). Malnutrition screening tools include the Malnutrition Screening Tool (MST), Subjective Global Assessment (SGA), and Mini Nutritional Assessment (MNA) for elderly patients. Key lab markers: serum albumin (<3.5 g/dL indicates chronic malnutrition, half-life 18-20 days), prealbumin (<17 mg/dL indicates recent nutritional changes, half-life 2-3 days — more sensitive to acute changes), and transferrin. Unintentional weight loss of >5% in 1 month or >10% in 6 months is clinically significant and warrants nutritional intervention.");

  return (
    <div className="space-y-10" data-testid="module-nutrition-foundations">
      <div>
        <EditableModuleText sectionKey="nf-title" defaultText="Nutrition Foundations for Nursing" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="nf-desc" defaultText="Understand macronutrients and their caloric values, micronutrients and their roles, fluid requirements, dietary electrolytes, therapeutic diets for common conditions, nutrition label interpretation, and BMI/malnutrition screening in clinical practice." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Macronutrients: Carbohydrates, Proteins, and Fats" subtitle="Energy sources and their roles in the body" icon={<Apple className="w-5 h-5" />}>
        <EditableModuleText sectionKey="nf-macro-intro" defaultText="The three macronutrients — carbohydrates, proteins, and fats — serve distinct roles in human physiology. Understanding their caloric density and functions is fundamental to nursing nutrition assessment and patient education." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Carbohydrates — 4 kcal/g</p>
            <p className="text-xs text-amber-600">Primary energy source. Simple carbs (glucose, fructose, sucrose) provide rapid energy. Complex carbs (starches, fiber) provide sustained energy and promote GI health. The brain uses ~120g glucose/day. Sources: grains, fruits, vegetables, legumes, dairy. Recommended: 45-65% of total daily calories.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Proteins — 4 kcal/g</p>
            <p className="text-xs text-red-600">Building blocks for tissue repair and growth. Complete proteins (animal sources) contain all 9 essential amino acids. Incomplete proteins (plant sources) must be combined for complete amino acid profile. Functions: enzymes, antibodies, albumin (oncotic pressure), hormones. Recommended: 10-35% of total daily calories, or 0.8 g/kg/day for healthy adults.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Fats — 9 kcal/g</p>
            <p className="text-xs text-green-600">Most calorie-dense macronutrient. Essential for absorbing fat-soluble vitamins (A, D, E, K). Unsaturated fats (olive oil, fish, nuts) are heart-healthy. Saturated fats (animal products) raise LDL cholesterol. Trans fats (hydrogenated oils) are the most harmful. Recommended: 20-35% of total daily calories, &lt;10% from saturated fat.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_nutrition_foundations.macronutrientFunctionsAndEnergy")}
          content={macronutrientContent}
        />
      </MicroLesson>

      <MicroLesson title="Micronutrients and Fluid Requirements" subtitle="Vitamins, minerals, and hydration" icon={<Droplets className="w-5 h-5" />}>
        <EditableModuleText sectionKey="nf-micro-intro" defaultText="Micronutrients — vitamins and minerals — are required in small amounts but are essential for metabolic processes, immune function, and disease prevention. Adequate fluid intake is equally critical for cellular function, thermoregulation, and waste elimination." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">Fat-Soluble Vitamins (A, D, E, K) — stored in body fat</p>
            <div className="space-y-1 text-xs text-blue-600">
              <p><strong>{t("data.pre_nursing_nutrition_foundations.vitaminA")}</strong>{t("data.pre_nursing_nutrition_foundations.visionEspeciallyNightVisionImmune")}</p>
              <p><strong>{t("data.pre_nursing_nutrition_foundations.vitaminD")}</strong>{t("data.pre_nursing_nutrition_foundations.calciumAbsorptionBoneHealthImmune")}</p>
              <p><strong>{t("data.pre_nursing_nutrition_foundations.vitaminE")}</strong>{t("data.pre_nursing_nutrition_foundations.antioxidantProtectsCellMembranesSources")}</p>
              <p><strong>{t("data.pre_nursing_nutrition_foundations.vitaminK")}</strong>{t("data.pre_nursing_nutrition_foundations.bloodClottingSynthesizesClottingFactors")}</p>
            </div>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-2">Water-Soluble Vitamins (B-complex, C) — not stored, need daily intake</p>
            <div className="space-y-1 text-xs text-purple-600">
              <p><strong>{t("data.pre_nursing_nutrition_foundations.b1Thiamine")}</strong>{t("data.pre_nursing_nutrition_foundations.energyMetabolismDeficiencyWernickekorsak")}</p>
              <p><strong>{t("data.pre_nursing_nutrition_foundations.b9Folate")}</strong>{t("data.pre_nursing_nutrition_foundations.dnaSynthesisRbcFormationCritical")}</p>
              <p><strong>{t("data.pre_nursing_nutrition_foundations.b12Cobalamin")}</strong>{t("data.pre_nursing_nutrition_foundations.nerveFunctionRbcMaturationDeficiency")}</p>
              <p><strong>{t("data.pre_nursing_nutrition_foundations.vitaminC")}</strong>{t("data.pre_nursing_nutrition_foundations.collagenSynthesisWoundHealingImmune")}</p>
            </div>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Daily Fluid Requirements</p>
            <p className="text-xs text-teal-600">General recommendation: 30 mL/kg/day or approximately 2-3 liters/day for adults. Increased needs: fever (add 500 mL per degree above 37°C), burns, diarrhea, vomiting, drains, high environmental temperature, physical exertion. Restricted needs: heart failure, renal failure, SIADH. Monitor intake and output (I&O). Minimum urine output: 30 mL/hr (0.5 mL/kg/hr) indicates adequate renal perfusion.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_nutrition_foundations.dietaryElectrolytes")}
          content={electrolyteContent}
        />
      </MicroLesson>

      <MicroLesson title="Therapeutic Diets" subtitle="Medical nutrition therapy for common conditions" icon={<UtensilsCrossed className="w-5 h-5" />}>
        <EditableModuleText sectionKey="nf-therapeutic-intro" defaultText="Therapeutic diets are prescribed as part of the treatment plan for specific medical conditions. Nurses must understand diet modifications to provide accurate patient education, monitor compliance, and recognize when dietary intake may worsen a condition." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_nutrition_foundations.commonTherapeuticDiets")}
          cards={[
            {
              id: "nf-cardiac",
              title: "Cardiac Diet",
              summary: "Low sodium, low saturated fat, high fiber",
              detail: "Sodium restriction: typically <2,000 mg/day for heart failure, <1,500 mg/day for advanced HF. Limit saturated fat to <7% of calories, eliminate trans fats, increase omega-3 fatty acids (fish, flaxseed). DASH diet (Dietary Approaches to Stop Hypertension) emphasizes fruits, vegetables, whole grains, and low-fat dairy. Limit alcohol. Read food labels — processed foods are the primary source of dietary sodium.",
            },
            {
              id: "nf-renal",
              title: "Renal Diet",
              summary: "Restricted sodium, potassium, phosphorus, and protein",
              detail: "Pre-dialysis: restrict protein to 0.6-0.8 g/kg/day (reduces uremia). Limit sodium (<2,000 mg/day), potassium (<2,000 mg/day — avoid bananas, oranges, tomatoes, potatoes), and phosphorus (<1,000 mg/day — limit dairy, cola, nuts). On dialysis: protein needs increase to 1.2-1.5 g/kg/day to replace losses. Fluid restriction typically 1,000-1,500 mL/day based on urine output.",
            },
            {
              id: "nf-diabetic",
              title: "Diabetic Diet",
              summary: "Consistent carbohydrate, glycemic control focus",
              detail: "Carbohydrate counting: typically 45-60g carbs per meal. Choose complex carbohydrates with low glycemic index (whole grains, legumes) over simple sugars. Distribute carbs evenly throughout the day to prevent glucose spikes. Pair carbs with protein and healthy fats to slow absorption. Limit added sugars. Plate method: ½ plate non-starchy vegetables, ¼ plate lean protein, ¼ plate whole grains/starchy foods. Monitor blood glucose before and after meals.",
            },
            {
              id: "nf-dysphagia",
              title: "Dysphagia Diet",
              summary: "Modified texture to prevent aspiration",
              detail: "IDDSI (International Dysphagia Diet Standardisation Initiative) levels: Level 0 (thin liquids) through Level 7 (regular). Thickened liquids reduce aspiration risk: nectar-thick, honey-thick, or pudding-thick. Pureed foods for severe dysphagia, mechanically altered for moderate, soft for mild. Position patient upright (90°) during and 30 minutes after meals. Monitor for signs of aspiration: coughing, choking, wet/gurgling voice, recurrent pneumonia.",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Nutrition Labels and Screening" subtitle="Assessment tools and food label literacy" icon={<Scale className="w-5 h-5" />}>
        <EditableModuleText sectionKey="nf-labels-intro" defaultText="Nurses must be able to interpret nutrition labels for patient education and understand BMI classification and malnutrition screening tools to identify patients at nutritional risk." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100 mt-3">
          <p className="text-xs font-semibold text-orange-700 mb-2">Reading a Nutrition Label</p>
          <div className="space-y-1 text-xs text-orange-600">
            <p><strong>{t("data.pre_nursing_nutrition_foundations.servingSize")}</strong>{t("data.pre_nursing_nutrition_foundations.allValuesArePerServing")}</p>
            <p><strong>{t("data.pre_nursing_nutrition_foundations.calories")}</strong>{t("data.pre_nursing_nutrition_foundations.totalEnergyPerServingGeneral")}</p>
            <p><strong>% Daily Value (DV):</strong>{t("data.pre_nursing_nutrition_foundations.basedOn2000CalorieDiet")}</p>
            <p><strong>{t("data.pre_nursing_nutrition_foundations.limitThese")}</strong>{t("data.pre_nursing_nutrition_foundations.saturatedFatTransFatSodium")}</p>
            <p><strong>{t("data.pre_nursing_nutrition_foundations.getEnoughOf")}</strong>{t("data.pre_nursing_nutrition_foundations.fiberVitaminDCalciumIron")}</p>
            <p><strong>{t("data.pre_nursing_nutrition_foundations.ingredientList")}</strong>{t("data.pre_nursing_nutrition_foundations.listedByWeightInDescending")}</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_nutrition_foundations.bmiAndMalnutritionScreening")}
          content={malnutritionContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_nutrition_foundations.matchTheNutritionConcept")}
        pairs={[
          { id: "carbs", term: "Carbohydrates", definition: "Provide 4 kcal/g — the body's preferred energy source" },
          { id: "fats", term: "Fats", definition: "Provide 9 kcal/g — most calorie-dense macronutrient" },
          { id: "vitk", term: "Vitamin K", definition: "Essential for blood clotting; interacts with warfarin" },
          { id: "prealbumin", term: "Prealbumin", definition: "Sensitive marker for recent nutritional status (half-life 2-3 days)" },
          { id: "dash", term: "DASH diet", definition: "Dietary approach to reduce hypertension" },
          { id: "dysphagia", term: "Dysphagia diet", definition: "Modified texture foods and thickened liquids to prevent aspiration" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_nutrition_foundations.nutritionFoundationsQuiz")}
        questions={[
          {
            id: "nf1",
            question: "Which macronutrient provides the most calories per gram?",
            options: ["Carbohydrates (4 kcal/g)", "Proteins (4 kcal/g)", "Fats (9 kcal/g)", "Alcohol (7 kcal/g)"],
            correctIndex: 2,
            rationale: "Fats provide 9 kcal per gram, making them the most calorie-dense macronutrient. This is why high-fat foods contribute significantly to caloric intake and why fat restriction is part of many therapeutic diets.",
          },
          {
            id: "nf2",
            question: "A patient on warfarin should be counseled to maintain consistent intake of which vitamin?",
            options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
            correctIndex: 3,
            rationale: "Vitamin K is essential for synthesis of clotting factors II, VII, IX, and X. Warfarin works by inhibiting vitamin K-dependent clotting. Patients should maintain consistent (not eliminate) vitamin K intake to keep their INR stable.",
          },
          {
            id: "nf3",
            question: "A patient with heart failure is typically prescribed a sodium restriction of:",
            options: ["Less than 5,000 mg/day", "Less than 3,000 mg/day", "Less than 2,000 mg/day", "Less than 500 mg/day"],
            correctIndex: 2,
            rationale: "Heart failure patients are typically restricted to <2,000 mg sodium per day, with advanced HF patients restricted to <1,500 mg/day. Excess sodium promotes fluid retention, worsening volume overload and heart failure symptoms.",
          },
          {
            id: "nf4",
            question: "Which lab value is the MOST sensitive indicator of acute nutritional status changes?",
            options: ["Serum albumin", "Prealbumin", "Hemoglobin", "Total cholesterol"],
            correctIndex: 1,
            rationale: "Prealbumin has a half-life of only 2-3 days, making it the most sensitive indicator of recent nutritional changes. Albumin has a half-life of 18-20 days and reflects chronic nutritional status rather than acute changes.",
          },
          {
            id: "nf5",
            question: "A patient with chronic kidney disease (pre-dialysis) should limit daily protein intake to:",
            options: ["0.2-0.4 g/kg/day", "0.6-0.8 g/kg/day", "1.5-2.0 g/kg/day", "Protein intake is unrestricted"],
            correctIndex: 1,
            rationale: "Pre-dialysis CKD patients restrict protein to 0.6-0.8 g/kg/day to reduce the kidney's workload in filtering nitrogen waste products (urea). Once on dialysis, protein needs increase to 1.2-1.5 g/kg/day to replace dialysis losses.",
          },
          {
            id: "nf6",
            question: "Fat-soluble vitamins include:",
            options: ["B1, B6, B12, C", "A, D, E, K", "A, B, C, D", "C, D, E, K"],
            correctIndex: 1,
            rationale: "The fat-soluble vitamins are A, D, E, and K (remember: 'A DEK'). They are stored in body fat and the liver, can accumulate to toxic levels (hypervitaminosis), and require dietary fat for absorption.",
          },
          {
            id: "nf7",
            question: "The minimum urine output that indicates adequate renal perfusion in an adult is:",
            options: ["10 mL/hr", "30 mL/hr", "60 mL/hr", "100 mL/hr"],
            correctIndex: 1,
            rationale: "Minimum adequate urine output for adults is 30 mL/hr (0.5 mL/kg/hr). Output below this level may indicate dehydration, decreased renal perfusion, or acute kidney injury and requires further assessment.",
          },
          {
            id: "nf8",
            question: "A patient with dysphagia should be positioned at what angle during and after meals?",
            options: ["Flat (0°)", "30° elevation", "45° elevation", "90° upright"],
            correctIndex: 3,
            rationale: "Patients with dysphagia should be positioned at 90° (fully upright) during meals and for at least 30 minutes after eating to use gravity to assist swallowing and reduce aspiration risk.",
          },
          {
            id: "nf9",
            question: "Which food should a patient with renal disease on potassium restriction AVOID?",
            options: ["White rice", "Apple", "Banana", "White bread"],
            correctIndex: 2,
            rationale: "Bananas are very high in potassium (~422 mg per medium banana). Patients on potassium-restricted diets (typically <2,000 mg/day in renal disease) should also avoid oranges, tomatoes, potatoes, and spinach.",
          },
          {
            id: "nf10",
            question: "On a nutrition label, a %DV of 5% or less is considered:",
            options: ["High in that nutrient", "Moderate in that nutrient", "Low in that nutrient", "The recommended daily amount"],
            correctIndex: 2,
            rationale: "The FDA guidelines state that 5% DV or less is considered low, while 20% DV or more is considered high. This helps patients make informed choices — aim for low %DV for nutrients to limit (sodium, saturated fat) and high %DV for nutrients to increase (fiber, calcium).",
          },
          {
            id: "nf11",
            question: "Vitamin C deficiency causes:",
            options: ["Night blindness", "Rickets", "Scurvy", "Pernicious anemia"],
            correctIndex: 2,
            rationale: "Vitamin C deficiency causes scurvy, characterized by bleeding gums, poor wound healing, easy bruising, and weakened connective tissue. Vitamin C is essential for collagen synthesis and iron absorption.",
          },
          {
            id: "nf12",
            question: "In the diabetic plate method, what fraction of the plate should be non-starchy vegetables?",
            options: ["One quarter (1/4)", "One third (1/3)", "One half (1/2)", "Three quarters (3/4)"],
            correctIndex: 2,
            rationale: "The diabetic plate method recommends ½ plate non-starchy vegetables (broccoli, salad, green beans), ¼ plate lean protein, and ¼ plate whole grains/starchy foods. This approach simplifies carbohydrate management.",
          },
          {
            id: "nf13",
            question: "A BMI of 32 classifies a patient as:",
            options: ["Overweight", "Obese Class I", "Obese Class II", "Obese Class III"],
            correctIndex: 1,
            rationale: "BMI categories: Underweight (<18.5), Normal (18.5-24.9), Overweight (25.0-29.9), Obese Class I (30.0-34.9), Obese Class II (35.0-39.9), Obese Class III (≥40.0). A BMI of 32 falls in Obese Class I.",
          },
          {
            id: "nf14",
            question: "Thiamine (B1) deficiency is most commonly associated with:",
            options: ["Veganism", "Chronic alcoholism", "Lactose intolerance", "Gluten sensitivity"],
            correctIndex: 1,
            rationale: "Chronic alcoholism is the most common cause of thiamine (B1) deficiency in developed countries. Alcohol impairs thiamine absorption and utilization, leading to Wernicke encephalopathy (confusion, ataxia, ophthalmoplegia) and Korsakoff syndrome (memory loss, confabulation).",
          },
          {
            id: "nf15",
            question: "Folate supplementation is especially important during pregnancy because deficiency can cause:",
            options: ["Gestational diabetes", "Neural tube defects", "Preeclampsia", "Hyperemesis gravidarum"],
            correctIndex: 1,
            rationale: "Folate (vitamin B9) is critical for DNA synthesis and neural tube closure in early embryonic development. Deficiency can cause neural tube defects (spina bifida, anencephaly). Supplementation of 400-800 mcg/day is recommended before conception and during the first trimester.",
          },
          {
            id: "nf16",
            question: "Which electrolyte is critical for cardiac function and muscle contraction, with a normal level of 3.5-5.0 mEq/L?",
            options: ["Sodium", "Potassium", "Calcium", "Magnesium"],
            correctIndex: 1,
            rationale: "Potassium (K+) is critical for cardiac electrical conduction and muscle contraction. Both hypokalemia (<3.5 mEq/L) and hyperkalemia (>5.0 mEq/L) can cause life-threatening dysrhythmias. Foods high in potassium include bananas, oranges, potatoes, and spinach.",
          },
          {
            id: "nf17",
            question: "A patient with fever should receive additional fluids. The general guideline is to add approximately how much fluid per degree Celsius above 37°C?",
            options: ["100 mL", "250 mL", "500 mL", "1,000 mL"],
            correctIndex: 2,
            rationale: "The general guideline is to add approximately 500 mL of fluid per degree above 37°C to account for increased insensible losses through respiration and perspiration during fever.",
          },
          {
            id: "nf18",
            question: "Unintentional weight loss of what percentage over 1 month is clinically significant?",
            options: [">2%", ">5%", ">10%", ">15%"],
            correctIndex: 1,
            rationale: "Unintentional weight loss >5% in 1 month (or >10% in 6 months) is clinically significant and warrants nutritional assessment and intervention. This degree of weight loss is associated with increased morbidity and mortality.",
          },
          {
            id: "nf19",
            question: "On a food label, ingredients are listed in:",
            options: ["Alphabetical order", "Ascending order by weight", "Descending order by weight", "Random order"],
            correctIndex: 2,
            rationale: "Ingredients are listed in descending order by weight — the first ingredient is present in the greatest amount. If sugar or its variants (sucrose, high-fructose corn syrup, dextrose) appear in the first few ingredients, the food is high in added sugars.",
          },
          {
            id: "nf20",
            question: "Complete proteins that contain all 9 essential amino acids are primarily found in:",
            options: ["Fruits and vegetables", "Whole grains only", "Animal sources (meat, fish, eggs, dairy)", "Legumes only"],
            correctIndex: 2,
            rationale: "Complete proteins containing all 9 essential amino acids are found in animal sources: meat, poultry, fish, eggs, and dairy. Soy is the notable plant-based exception. Other plant proteins are incomplete and should be combined (rice + beans) to provide all essential amino acids.",
          },
        ]}
      />
    </div>
  );
}