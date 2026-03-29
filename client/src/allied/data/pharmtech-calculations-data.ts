export interface PharmTechCalculation {
  slug: string;
  title: string;
  description: string;
  formulas: { name: string; formula: string; explanation: string }[];
  workedExamples: { problem: string; steps: string[]; answer: string }[];
  commonMistakes: string[];
  examShortcuts: string[];
  practiceQuestions: { stem: string; options: string[]; correctIndex: number; rationale: string }[];
  faqs: { q: string; a: string }[];
  relatedCalculations: string[];
  relatedMedications: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const PHARMTECH_CALCULATIONS: PharmTechCalculation[] = [
  {
    slug: "dosage-calculations",
    title: "Dosage Calculations",
    description: "Master weight-based dosing, dose per kg, and converting between dosing units for the PTCB and ExCPT exams.",
    formulas: [
      { name: "Weight-Based Dose", formula: "Dose = Weight (kg) × Dose per kg", explanation: "Calculate the total dose based on patient weight. Always convert pounds to kilograms first (divide by 2.2)." },
      { name: "Pounds to Kilograms", formula: "kg = lb ÷ 2.2", explanation: "Convert patient weight from pounds to kilograms before calculating weight-based doses." },
      { name: "Dose per Administration", formula: "Single Dose = Total Daily Dose ÷ Number of Doses per Day", explanation: "Divide the total daily dose by the frequency to get each individual dose." },
    ],
    workedExamples: [
      { problem: "A child weighing 44 lb is prescribed amoxicillin 25 mg/kg/day divided TID. How many mg per dose?", steps: ["Convert weight: 44 lb ÷ 2.2 = 20 kg", "Total daily dose: 20 kg × 25 mg/kg = 500 mg/day", "Dose per administration: 500 mg ÷ 3 = 166.7 mg per dose"], answer: "166.7 mg per dose" },
      { problem: "A patient weighs 176 lb. The prescribed dose is 5 mg/kg. What is the total dose?", steps: ["Convert weight: 176 lb ÷ 2.2 = 80 kg", "Total dose: 80 kg × 5 mg/kg = 400 mg"], answer: "400 mg" },
    ],
    commonMistakes: ["Forgetting to convert pounds to kilograms", "Confusing total daily dose with dose per administration", "Using wrong conversion factor (2.2 lb/kg, not 2.0)", "Not dividing by frequency when asked for per-dose amount"],
    examShortcuts: ["Quick lb to kg: divide by 2, then subtract 10% of result", "For TID dosing: divide daily dose by 3", "Double-check units — mg vs mcg vs g"],
    practiceQuestions: [
      { stem: "A patient weighing 154 lb is prescribed a medication at 10 mg/kg. What is the correct dose?", options: ["700 mg", "770 mg", "1,540 mg", "350 mg"], correctIndex: 0, rationale: "154 lb ÷ 2.2 = 70 kg. Dose = 70 kg × 10 mg/kg = 700 mg." },
      { stem: "A child weighing 22 lb is prescribed 15 mg/kg/day divided BID. What is each dose?", options: ["75 mg", "150 mg", "37.5 mg", "330 mg"], correctIndex: 0, rationale: "22 lb ÷ 2.2 = 10 kg. Daily dose = 10 × 15 = 150 mg/day. BID = 150 ÷ 2 = 75 mg per dose." },
      { stem: "How many kilograms does a 198-pound patient weigh?", options: ["80 kg", "85 kg", "90 kg", "95 kg"], correctIndex: 2, rationale: "198 lb ÷ 2.2 = 90 kg." },
    ],
    faqs: [
      { q: "How do I convert pounds to kilograms?", a: "Divide the weight in pounds by 2.2. For example, 154 lb ÷ 2.2 = 70 kg." },
      { q: "What does 'divided TID' mean in a dosing order?", a: "It means the total daily dose is divided into 3 equal doses taken three times daily." },
    ],
    relatedCalculations: ["iv-flow-rate", "unit-conversions", "concentration-dilution"],
    relatedMedications: ["amoxicillin", "metformin"],
    metaTitle: "Dosage Calculations for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master weight-based dosing calculations for the PTCB exam. Formulas, worked examples, practice problems, and exam shortcuts for pharmacy technicians.",
    keywords: "dosage calculations, pharmacy technician, PTCB exam, weight-based dosing, mg/kg",
  },
  {
    slug: "iv-flow-rate",
    title: "IV Flow Rate Calculations",
    description: "Calculate IV drip rates and flow rates using drop factor, volume, and time for the PTCB and ExCPT pharmacy technician exams.",
    formulas: [
      { name: "Flow Rate (mL/hr)", formula: "Flow Rate = Total Volume (mL) ÷ Total Time (hours)", explanation: "Calculate how many milliliters are infused per hour." },
      { name: "Drip Rate (gtt/min)", formula: "gtt/min = (Volume mL × Drop Factor gtt/mL) ÷ Time (minutes)", explanation: "Calculate the drops per minute using the IV tubing's drop factor." },
      { name: "Infusion Time", formula: "Time (hr) = Total Volume (mL) ÷ Flow Rate (mL/hr)", explanation: "Calculate how long an IV bag will last at a given rate." },
    ],
    workedExamples: [
      { problem: "Infuse 1000 mL NS over 8 hours using a 15 gtt/mL set. What is the drip rate?", steps: ["Flow rate: 1000 mL ÷ 8 hr = 125 mL/hr", "Convert hours to minutes: 8 hr × 60 = 480 min", "Drip rate: (1000 × 15) ÷ 480 = 31.25 ≈ 31 gtt/min"], answer: "31 gtt/min" },
      { problem: "A patient is receiving D5W at 75 mL/hr. How long will a 500 mL bag last?", steps: ["Time = Volume ÷ Rate", "Time = 500 mL ÷ 75 mL/hr = 6.67 hours", "Convert: 0.67 × 60 = 40 minutes"], answer: "6 hours 40 minutes" },
    ],
    commonMistakes: ["Forgetting to convert hours to minutes for drip rate", "Using wrong drop factor for the tubing type", "Confusing mL/hr with gtt/min", "Not rounding gtt/min to whole drops"],
    examShortcuts: ["Standard drop factors: macro = 10, 15, or 20 gtt/mL; micro = 60 gtt/mL", "With 60 gtt/mL set: gtt/min = mL/hr (they are equal)", "Always round drops to nearest whole number"],
    practiceQuestions: [
      { stem: "Infuse 500 mL over 4 hours. What is the flow rate in mL/hr?", options: ["100 mL/hr", "125 mL/hr", "150 mL/hr", "200 mL/hr"], correctIndex: 1, rationale: "Flow rate = 500 mL ÷ 4 hr = 125 mL/hr." },
      { stem: "Using a 20 gtt/mL set, infuse 1000 mL over 10 hours. What is the drip rate?", options: ["25 gtt/min", "33 gtt/min", "50 gtt/min", "100 gtt/min"], correctIndex: 1, rationale: "gtt/min = (1000 × 20) ÷ (10 × 60) = 20,000 ÷ 600 = 33.3 ≈ 33 gtt/min." },
      { stem: "A 1000 mL bag of NS is running at 150 mL/hr. How long will it last?", options: ["5 hours", "6 hours 40 minutes", "7.5 hours", "10 hours"], correctIndex: 1, rationale: "Time = 1000 ÷ 150 = 6.67 hours = 6 hours and 40 minutes." },
    ],
    faqs: [
      { q: "What is a drop factor?", a: "The drop factor is a number printed on IV tubing that tells you how many drops equal 1 mL. Standard macrodrip sets are 10, 15, or 20 gtt/mL. Microdrip sets are 60 gtt/mL." },
      { q: "When do I use gtt/min vs mL/hr?", a: "mL/hr is used for IV pump settings. gtt/min is used when counting drops manually with gravity infusion. The exam may ask for either." },
    ],
    relatedCalculations: ["dosage-calculations", "unit-conversions"],
    relatedMedications: ["furosemide", "pantoprazole"],
    metaTitle: "IV Flow Rate Calculations for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master IV flow rate and drip rate calculations for the PTCB exam. Formulas, drop factors, worked examples, and practice problems.",
    keywords: "IV flow rate, drip rate, gtt/min, pharmacy technician, PTCB exam, IV calculations",
  },
  {
    slug: "unit-conversions",
    title: "Unit Conversions",
    description: "Essential metric, apothecary, and household measurement conversions every pharmacy technician must know for the PTCB exam.",
    formulas: [
      { name: "Weight Conversions", formula: "1 kg = 2.2 lb | 1 g = 1000 mg | 1 mg = 1000 mcg", explanation: "Convert between metric weight units and between metric and imperial." },
      { name: "Volume Conversions", formula: "1 L = 1000 mL | 1 tsp = 5 mL | 1 tbsp = 15 mL | 1 fl oz = 30 mL | 1 cup = 240 mL", explanation: "Convert between metric volume and household measures." },
      { name: "Temperature Conversion", formula: "°C = (°F − 32) × 5/9 | °F = (°C × 9/5) + 32", explanation: "Convert between Fahrenheit and Celsius." },
    ],
    workedExamples: [
      { problem: "Convert 2.5 g to milligrams.", steps: ["1 g = 1000 mg", "2.5 g × 1000 = 2,500 mg"], answer: "2,500 mg" },
      { problem: "A prescription calls for 2 teaspoonfuls TID. How many mL per day?", steps: ["1 tsp = 5 mL", "Per dose: 2 × 5 = 10 mL", "TID = 3 times daily: 10 × 3 = 30 mL/day"], answer: "30 mL per day" },
      { problem: "Convert 98.6°F to Celsius.", steps: ["°C = (°F − 32) × 5/9", "°C = (98.6 − 32) × 5/9", "°C = 66.6 × 0.556 = 37°C"], answer: "37°C" },
    ],
    commonMistakes: ["Confusing tsp (5 mL) with tbsp (15 mL)", "Using 2.0 instead of 2.2 for lb-to-kg conversion", "Moving the decimal in the wrong direction for metric conversions", "Forgetting that 1 fl oz = 30 mL (not 28.35 mL for weight oz)"],
    examShortcuts: ["Metric ladder: kg → g → mg → mcg (each step × 1000)", "1 pint = 480 mL, 1 gallon = 3785 mL", "Normal body temp: 37°C = 98.6°F"],
    practiceQuestions: [
      { stem: "How many milliliters are in 8 fluid ounces?", options: ["200 mL", "240 mL", "250 mL", "480 mL"], correctIndex: 1, rationale: "1 fl oz = 30 mL. 8 × 30 = 240 mL." },
      { stem: "Convert 500 mcg to milligrams.", options: ["0.05 mg", "0.5 mg", "5 mg", "50 mg"], correctIndex: 1, rationale: "1 mg = 1000 mcg. 500 mcg ÷ 1000 = 0.5 mg." },
      { stem: "How many teaspoonfuls are in 1 tablespoonful?", options: ["2", "3", "4", "5"], correctIndex: 1, rationale: "1 tbsp = 15 mL. 1 tsp = 5 mL. 15 ÷ 5 = 3 teaspoonfuls." },
    ],
    faqs: [
      { q: "What conversions do I need to memorize for the PTCB?", a: "Key conversions: 1 kg = 2.2 lb, 1 tsp = 5 mL, 1 tbsp = 15 mL, 1 fl oz = 30 mL, 1 g = 1000 mg, 1 mg = 1000 mcg, 1 grain = 65 mg." },
    ],
    relatedCalculations: ["dosage-calculations", "concentration-dilution"],
    relatedMedications: ["levothyroxine", "prednisone"],
    metaTitle: "Unit Conversions for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master essential unit conversions for the PTCB exam. Metric, household, and apothecary conversions with practice problems and shortcuts.",
    keywords: "unit conversions, pharmacy math, metric conversions, PTCB exam, pharmacy technician",
  },
  {
    slug: "alligation-method",
    title: "Alligation Method",
    description: "Use the alligation alternate method to calculate proportions when mixing two different concentrations to achieve a desired concentration.",
    formulas: [
      { name: "Alligation Alternate", formula: "Higher % − Desired % = Parts of Lower\nDesired % − Lower % = Parts of Higher", explanation: "Cross-subtract to find the ratio of each concentration needed." },
    ],
    workedExamples: [
      { problem: "Mix 20% and 5% solutions to make 500 mL of 10% solution. How much of each?", steps: ["Set up alligation: Higher (20%) − Desired (10%) = 5 parts of 5% solution", "Desired (10%) − Lower (5%) = 10 parts of 20% solution — WAIT: 10 − 5 = 5 parts of higher", "Total parts: 5 + 10 = 15", "Correction: Higher = 20, Desired = 10, Lower = 5", "Parts of lower: 20 - 10 = 10 parts", "Parts of higher: 10 - 5 = 5 parts", "Total parts: 10 + 5 = 15", "20% solution: (5/15) × 500 = 166.7 mL", "5% solution: (10/15) × 500 = 333.3 mL"], answer: "166.7 mL of 20% + 333.3 mL of 5%" },
    ],
    commonMistakes: ["Reversing which parts go with which concentration", "Forgetting to add parts to get total", "Subtracting in the wrong direction (must always get positive numbers)", "Not checking that the final concentrations are between the two starting concentrations"],
    examShortcuts: ["Higher concentration always gets fewer parts", "Lower concentration always gets more parts", "The desired concentration MUST be between the two stock concentrations", "Verify: parts × concentrations should equal total desired"],
    practiceQuestions: [
      { stem: "Using alligation, mix 70% and 25% alcohol to make 45% alcohol. What is the ratio of 70% to 25%?", options: ["20:25", "25:20", "4:5", "5:4"], correctIndex: 2, rationale: "Parts of 70%: 45 - 25 = 20. Parts of 25%: 70 - 45 = 25. Ratio = 20:25 = 4:5." },
      { stem: "To prepare 1 L of 15% solution from 30% and 5% solutions, how much of the 30% solution is needed?", options: ["200 mL", "400 mL", "500 mL", "600 mL"], correctIndex: 1, rationale: "Parts of 30%: 15 - 5 = 10. Parts of 5%: 30 - 15 = 15. Total = 25 parts. 30% needed: (10/25) × 1000 = 400 mL." },
    ],
    faqs: [
      { q: "When is alligation used in pharmacy?", a: "Alligation is used when you need to mix two solutions of different concentrations to obtain a specific intermediate concentration. It is commonly used in compounding." },
    ],
    relatedCalculations: ["concentration-dilution", "unit-conversions"],
    relatedMedications: [],
    metaTitle: "Alligation Method for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master the alligation alternate method for the PTCB exam. Step-by-step examples, common mistakes, and practice problems for pharmacy technicians.",
    keywords: "alligation, pharmacy math, mixing concentrations, PTCB exam, compounding calculations",
  },
  {
    slug: "ratio-proportion",
    title: "Ratio & Proportion",
    description: "Solve pharmacy calculations using the ratio-proportion (cross-multiplication) method — the most versatile calculation technique for the PTCB exam.",
    formulas: [
      { name: "Cross-Multiplication", formula: "a/b = c/d → a × d = b × c", explanation: "Set up a proportion with known values on one side and the unknown on the other, then cross-multiply and solve." },
      { name: "Dimensional Analysis", formula: "Start with what you have × conversion factors = what you want", explanation: "Chain multiplication of fractions to cancel units until you reach the desired unit." },
    ],
    workedExamples: [
      { problem: "If 250 mg is in 5 mL, how many mL contain 375 mg?", steps: ["Set up proportion: 250 mg/5 mL = 375 mg/x mL", "Cross-multiply: 250x = 5 × 375 = 1875", "Solve: x = 1875 ÷ 250 = 7.5 mL"], answer: "7.5 mL" },
      { problem: "A vial contains 1 g/10 mL. How many mg are in 2.5 mL?", steps: ["Convert: 1 g = 1000 mg", "Proportion: 1000 mg/10 mL = x mg/2.5 mL", "Cross-multiply: 10x = 1000 × 2.5 = 2500", "Solve: x = 250 mg"], answer: "250 mg" },
    ],
    commonMistakes: ["Setting up the proportion with mismatched units", "Forgetting to convert units before setting up the proportion", "Cross-multiplying incorrectly", "Not labeling units to track what you are solving for"],
    examShortcuts: ["Always label your units — this prevents setup errors", "If stuck, use dimensional analysis as a backup method", "Check your answer: does it make sense? More drug = more volume"],
    practiceQuestions: [
      { stem: "A suspension contains 125 mg/5 mL. How many mL are needed for a 250 mg dose?", options: ["5 mL", "10 mL", "15 mL", "25 mL"], correctIndex: 1, rationale: "125 mg/5 mL = 250 mg/x mL. Cross-multiply: 125x = 1250. x = 10 mL." },
      { stem: "If 500 mL of solution contains 2 g of drug, how many mg are in 50 mL?", options: ["100 mg", "200 mg", "400 mg", "500 mg"], correctIndex: 1, rationale: "2 g = 2000 mg. 2000 mg/500 mL = x/50 mL. 500x = 100,000. x = 200 mg." },
      { stem: "A tablet contains 20 mg. How many tablets are needed for a 50 mg dose?", options: ["1.5 tablets", "2 tablets", "2.5 tablets", "3 tablets"], correctIndex: 2, rationale: "20 mg/1 tab = 50 mg/x tab. x = 50/20 = 2.5 tablets." },
    ],
    faqs: [
      { q: "What is the difference between ratio-proportion and dimensional analysis?", a: "Both methods solve the same problems. Ratio-proportion uses cross-multiplication of two equivalent fractions. Dimensional analysis chains conversion factors together, canceling units step by step. Use whichever method you find more intuitive." },
    ],
    relatedCalculations: ["dosage-calculations", "concentration-dilution", "unit-conversions"],
    relatedMedications: ["amoxicillin"],
    metaTitle: "Ratio & Proportion for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master ratio and proportion calculations for the PTCB exam. Cross-multiplication method, worked examples, and pharmacy tech practice problems.",
    keywords: "ratio proportion, cross multiplication, pharmacy math, PTCB exam, pharmacy technician",
  },
  {
    slug: "bsa-calculations",
    title: "BSA (Body Surface Area) Calculations",
    description: "Calculate body surface area for chemotherapy and pediatric dosing using the Mosteller formula on the PTCB exam.",
    formulas: [
      { name: "Mosteller Formula", formula: "BSA (m²) = √(height cm × weight kg ÷ 3600)", explanation: "The most commonly tested BSA formula on pharmacy exams." },
      { name: "BSA-Based Dose", formula: "Dose = BSA (m²) × Dose per m²", explanation: "Once BSA is calculated, multiply by the prescribed dose per square meter." },
    ],
    workedExamples: [
      { problem: "A patient is 170 cm tall and weighs 70 kg. Calculate their BSA using the Mosteller formula.", steps: ["BSA = √(170 × 70 ÷ 3600)", "BSA = √(11,900 ÷ 3600)", "BSA = √3.306", "BSA = 1.82 m²"], answer: "1.82 m²" },
      { problem: "A chemotherapy dose is 75 mg/m². The patient's BSA is 1.8 m². What is the dose?", steps: ["Dose = BSA × Dose per m²", "Dose = 1.8 m² × 75 mg/m²", "Dose = 135 mg"], answer: "135 mg" },
    ],
    commonMistakes: ["Using the wrong units (must be cm and kg for Mosteller)", "Forgetting to take the square root", "Confusing BSA (m²) with body weight (kg)", "Using 36000 instead of 3600 in the denominator"],
    examShortcuts: ["Average adult BSA ≈ 1.73 m²", "If your answer is >3 or <0.5 m² for an adult, recheck your math", "BSA dosing is most common for chemotherapy agents"],
    practiceQuestions: [
      { stem: "A patient is 180 cm and 80 kg. What is their BSA (Mosteller)?", options: ["1.5 m²", "1.8 m²", "2.0 m²", "2.2 m²"], correctIndex: 2, rationale: "BSA = √(180 × 80 ÷ 3600) = √(14400 ÷ 3600) = √4.0 = 2.0 m²." },
      { stem: "A drug is dosed at 100 mg/m². Patient BSA = 1.5 m². What dose is given?", options: ["100 mg", "125 mg", "150 mg", "200 mg"], correctIndex: 2, rationale: "Dose = 1.5 m² × 100 mg/m² = 150 mg." },
    ],
    faqs: [
      { q: "When is BSA-based dosing used?", a: "BSA dosing is primarily used for chemotherapy drugs, some pediatric medications, and situations where more precise dosing is needed than simple weight-based calculations can provide." },
    ],
    relatedCalculations: ["dosage-calculations", "unit-conversions"],
    relatedMedications: [],
    metaTitle: "BSA Calculations for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master BSA (body surface area) calculations for the PTCB exam. Mosteller formula, chemotherapy dosing, worked examples, and practice problems.",
    keywords: "BSA calculation, body surface area, Mosteller formula, pharmacy technician, PTCB exam",
  },
  {
    slug: "concentration-dilution",
    title: "Concentration & Dilution Calculations",
    description: "Master percent strength, ratio strength, and dilution calculations using C1V1=C2V2 for the PTCB exam.",
    formulas: [
      { name: "Percent Strength (w/v)", formula: "% w/v = (grams of solute ÷ 100 mL of solution) × 100", explanation: "Weight-in-volume: grams of drug per 100 mL of solution." },
      { name: "Dilution Formula", formula: "C1 × V1 = C2 × V2", explanation: "Initial concentration × initial volume = final concentration × final volume." },
      { name: "Ratio Strength", formula: "1:X = 1 g in X mL (or 1 g in X g)", explanation: "A ratio strength of 1:1000 means 1 g of drug in 1000 mL of solution." },
    ],
    workedExamples: [
      { problem: "How many grams of drug are in 500 mL of a 2% w/v solution?", steps: ["2% w/v = 2 g per 100 mL", "For 500 mL: (2 g/100 mL) × 500 mL = 10 g"], answer: "10 grams" },
      { problem: "Dilute 100 mL of 10% solution to make a 2% solution. What is the final volume?", steps: ["C1V1 = C2V2", "10% × 100 mL = 2% × V2", "V2 = (10 × 100) ÷ 2 = 500 mL"], answer: "500 mL (add 400 mL of diluent)" },
    ],
    commonMistakes: ["Confusing w/v (g/100mL), v/v (mL/100mL), and w/w (g/100g)", "Forgetting that % means 'per 100'", "Not converting ratio strength to percentage correctly", "Using wrong units in C1V1=C2V2"],
    examShortcuts: ["% to mg/mL: multiply by 10 (e.g., 1% = 10 mg/mL)", "1:1000 = 0.1% = 1 mg/mL", "1:10000 = 0.01% = 0.1 mg/mL"],
    practiceQuestions: [
      { stem: "What is the concentration of a 1:1000 solution in mg/mL?", options: ["0.1 mg/mL", "1 mg/mL", "10 mg/mL", "100 mg/mL"], correctIndex: 1, rationale: "1:1000 = 1 g in 1000 mL = 1000 mg in 1000 mL = 1 mg/mL." },
      { stem: "How many grams of dextrose are in 1 L of D5W?", options: ["5 g", "50 g", "500 g", "0.5 g"], correctIndex: 1, rationale: "D5W = 5% dextrose in water. 5% = 5 g/100 mL. For 1000 mL: 5 × 10 = 50 g." },
      { stem: "Using C1V1 = C2V2, how much 50% dextrose is needed to make 500 mL of 10% dextrose?", options: ["50 mL", "100 mL", "200 mL", "250 mL"], correctIndex: 1, rationale: "50 × V1 = 10 × 500. V1 = 5000 ÷ 50 = 100 mL of 50% dextrose." },
    ],
    faqs: [
      { q: "How do I convert percent to mg/mL?", a: "Multiply the percentage by 10. For example, 1% = 10 mg/mL, 0.9% = 9 mg/mL, 5% = 50 mg/mL." },
      { q: "What does D5W mean?", a: "D5W means 5% dextrose in water — 5 grams of dextrose per 100 mL of solution." },
    ],
    relatedCalculations: ["alligation-method", "unit-conversions", "ratio-proportion"],
    relatedMedications: [],
    metaTitle: "Concentration & Dilution Calculations | PTCB Exam Prep",
    metaDescription: "Master concentration and dilution calculations for the PTCB exam. Percent strength, ratio strength, C1V1=C2V2, and practice problems.",
    keywords: "concentration, dilution, C1V1=C2V2, percent strength, pharmacy math, PTCB exam",
  },
  {
    slug: "days-supply",
    title: "Days Supply Calculations",
    description: "Calculate days supply for tablets, capsules, liquids, inhalers, insulin, and topicals — a high-frequency PTCB exam topic.",
    formulas: [
      { name: "Days Supply (Solid Dosage)", formula: "Days Supply = Quantity Dispensed ÷ Quantity Used Per Day", explanation: "Divide total quantity by the number of units taken per day." },
      { name: "Days Supply (Liquid)", formula: "Days Supply = Total Volume (mL) ÷ mL Used Per Day", explanation: "Determine daily mL usage from sig, then divide total volume." },
      { name: "Days Supply (Inhaler)", formula: "Days Supply = Total Actuations ÷ Actuations Per Day", explanation: "MDIs specify total actuations (e.g., 200). Divide by daily puffs." },
    ],
    workedExamples: [
      { problem: "Rx: Amoxicillin 500 mg #30, Sig: 1 cap PO TID. What is the days supply?", steps: ["Daily use: 1 cap × 3 times = 3 caps/day", "Days supply: 30 ÷ 3 = 10 days"], answer: "10 days" },
      { problem: "Rx: Amoxicillin 250 mg/5 mL, 150 mL, Sig: 1 tsp PO BID. Days supply?", steps: ["1 tsp = 5 mL, BID = twice daily", "Daily use: 5 mL × 2 = 10 mL/day", "Days supply: 150 mL ÷ 10 mL/day = 15 days"], answer: "15 days" },
      { problem: "Rx: Albuterol MDI 200 actuations, Sig: 2 puffs Q4-6H PRN. Days supply?", steps: ["Maximum use: 2 puffs every 4 hours = 12 puffs/day", "Days supply: 200 ÷ 12 = 16.67 → round down to 16 days"], answer: "16 days (use maximum frequency for PRN)" },
    ],
    commonMistakes: ["Not using maximum frequency for PRN medications", "Confusing tsp (5 mL) with tbsp (15 mL)", "Forgetting sig code meanings (BID=2, TID=3, QID=4)", "Not accounting for both eyes (1 gtt OU BID = 4 drops/day)"],
    examShortcuts: ["For PRN: always use maximum allowed frequency", "For eye drops: OU = both eyes (double the drops)", "For insulin: consider units per day vs units per mL (U-100 = 100 units/mL)"],
    practiceQuestions: [
      { stem: "Rx: Lisinopril 10 mg #90, Sig: 1 tab PO QD. Days supply?", options: ["30 days", "60 days", "90 days", "180 days"], correctIndex: 2, rationale: "1 tablet daily. 90 ÷ 1 = 90 days supply." },
      { stem: "Rx: Eye drops 5 mL, Sig: 1 gtt OU BID. Assume 20 drops/mL. Days supply?", options: ["12 days", "25 days", "50 days", "100 days"], correctIndex: 1, rationale: "OU = both eyes. 1 drop × 2 eyes × 2 times/day = 4 drops/day. Total drops: 5 mL × 20 = 100. Days supply: 100 ÷ 4 = 25 days." },
      { stem: "Rx: Insulin glargine 10 mL vial (U-100), Sig: 30 units SubQ QHS. Days supply?", options: ["10 days", "20 days", "33 days", "100 days"], correctIndex: 2, rationale: "10 mL × 100 units/mL = 1000 units total. 1000 ÷ 30 units/day = 33.3 → 33 days." },
    ],
    faqs: [
      { q: "Why is days supply important?", a: "Days supply determines when a patient can get their next refill. It is critical for insurance billing, controlled substance monitoring, and ensuring patients don't run out of medication." },
      { q: "How do I calculate days supply for PRN medications?", a: "Use the maximum allowed frequency. For example, if the sig says 'Q4-6H PRN,' use Q4H (every 4 hours) to calculate the maximum daily dose, which gives the shortest days supply." },
    ],
    relatedCalculations: ["dosage-calculations", "ratio-proportion", "unit-conversions"],
    relatedMedications: ["insulin-glargine", "albuterol", "amoxicillin"],
    metaTitle: "Days Supply Calculations for Pharmacy Technicians | PTCB Exam Prep",
    metaDescription: "Master days supply calculations for tablets, liquids, inhalers, and insulin. PTCB exam formulas, worked examples, and practice problems.",
    keywords: "days supply, pharmacy calculations, PTCB exam, pharmacy technician, insurance billing",
  },
];

export function getCalculationBySlug(slug: string): PharmTechCalculation | undefined {
  return PHARMTECH_CALCULATIONS.find(c => c.slug === slug);
}
