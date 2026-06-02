import { getAssetUrl } from "@/lib/asset-url";
import type { ExamQuestion } from "./types";

export const npExamBatch22Questions: ExamQuestion[] = [
  {
    q: "A 50-year-old male presents with fatigue, decreased libido, erectile dysfunction, and loss of muscle mass. Morning total testosterone is 180 ng/dL (normal 300-1000). FSH and LH are both low. Prolactin is normal. MRI pituitary is normal. What is the most likely diagnosis?",
    o: ["Secondary hypogonadism (hypogonadotropic); evaluate for contributing factors and consider testosterone replacement", "Primary hypogonadism requiring karyotype analysis", "Prolactinoma with normal prolactin variant", "Normal aging; no treatment needed"],
    a: 0,
    r: "Low testosterone with low or inappropriately normal FSH/LH indicates secondary (central) hypogonadism. Causes include obesity, opioid use, glucocorticoids, sleep apnea, and pituitary pathology. With normal MRI and prolactin, functional causes should be evaluated and addressed. Testosterone replacement is considered when symptoms persist after addressing reversible causes. Primary hypogonadism would show elevated FSH/LH.",
    s: "Endocrine"
  },
  {
    q: "A 35-year-old female with type 1 diabetes using an insulin pump presents with glucose of 450 mg/dL and moderate ketones despite multiple correction boluses. Her pump site was changed 6 hours ago. What should the NP advise?",
    o: ["Remove the pump infusion set, give a correction dose via insulin pen or syringe, change the infusion site, and check for pump malfunction", "Increase the pump basal rate and continue monitoring", "Drink water and exercise to lower glucose", "Continue bolusing through the pump every hour"],
    a: 0,
    r: "Persistent hyperglycemia with ketones in a pump user suggests infusion site failure (kinked cannula, dislodged site, absorption issue). The immediate action is to bypass the pump entirely and give a correction dose via pen/syringe injection. Then change the infusion site and check the pump for malfunction. Continuing to bolus through a potentially failed site delays treatment and risks DKA progression.",
    s: "Endocrine"
  },
  {
    q: "A 65-year-old female with type 2 diabetes has an HbA1c of 7.2% on metformin 2000 mg daily. She has stage 3a CKD (eGFR 52), heart failure (LVEF 40%), and a history of recurrent UTIs. Which additional agent provides the greatest cardiorenal benefit despite the UTI concern?",
    o: ["Empagliflozin (SGLT2 inhibitor) with patient education about UTI symptoms and hygiene measures", "GLP-1 receptor agonist to avoid UTI risk entirely", "DPP-4 inhibitor as it has no UTI risk", "Sulfonylurea for reliable glucose reduction"],
    a: 0,
    r: "SGLT2 inhibitors have shown unprecedented cardiorenal benefits in patients with HFrEF and CKD (EMPEROR-Reduced, DAPA-HF, CREDENCE trials). The cardiovascular and renal benefits significantly outweigh the modest UTI risk. Patient education about genital hygiene, adequate hydration, and prompt reporting of UTI symptoms mitigates this risk. GLP-1 RAs have CV benefit but lack the HF-specific mortality data. DPP-4 inhibitors have neutral CV effects.",
    s: "Endocrine"
  },
  {
    q: "A 28-year-old female with Hashimoto thyroiditis on levothyroxine 88 mcg daily has a TSH of 6.8 mIU/L. She started taking calcium carbonate 600 mg twice daily for bone health 2 months ago. What is the most likely cause of the TSH elevation?",
    o: ["Calcium carbonate is interfering with levothyroxine absorption; separate administration by at least 4 hours", "Hashimoto disease progression requiring dose increase", "Development of resistance to levothyroxine", "Secondary adrenal insufficiency"],
    a: 0,
    r: "Calcium carbonate (and iron, aluminum-containing antacids, and proton pump inhibitors) significantly impairs levothyroxine absorption. These medications must be separated by at least 4 hours. This is a common drug-nutrient interaction that causes subtherapeutic thyroid hormone levels and rising TSH. Before increasing levothyroxine dose, medication timing should be addressed.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old male with type 2 diabetes on metformin and empagliflozin is scheduled for a CT scan with IV iodinated contrast. eGFR is 42 mL/min. What medication adjustments should the NP make?",
    o: ["Hold metformin on the day of and for 48 hours after contrast administration; recheck renal function before resuming", "Hold empagliflozin only and continue metformin", "Continue both medications without interruption", "Discontinue both medications permanently and switch to insulin"],
    a: 0,
    r: "Metformin should be held before or at the time of iodinated contrast administration in patients with eGFR below 45 (or any patient receiving intra-arterial contrast) due to risk of contrast-induced nephropathy leading to metformin accumulation and lactic acidosis. Renal function should be rechecked 48 hours post-contrast before resuming metformin. SGLT2 inhibitors may also be held per institutional protocol.",
    s: "Endocrine"
  },
  {
    q: "A 45-year-old female presents with a thyroid storm: temperature 40.2 C, heart rate 160, altered mental status, and recent history of Graves disease medication noncompliance. What is the emergency management sequence?",
    o: ["Propylthiouracil (PTU) first, then iodine solution 1 hour later, IV propranolol, hydrocortisone, and supportive cooling measures", "Radioactive iodine ablation emergently", "Methimazole and discharge with close follow-up", "IV levothyroxine for presumed hypothyroid crisis"],
    a: 0,
    r: "Thyroid storm requires a specific management sequence: 1) PTU blocks new hormone synthesis AND peripheral T4-to-T3 conversion; 2) Iodine (SSKI or Lugol) given at least 1 hour AFTER PTU to block thyroid hormone release (Wolff-Chaikoff effect) without providing substrate for new synthesis; 3) Beta-blockers for adrenergic symptoms; 4) Glucocorticoids for relative adrenal insufficiency and inhibition of T4-to-T3 conversion; 5) Supportive care including cooling.",
    s: "Endocrine"
  },
  {
    q: "A 70-year-old male with type 2 diabetes presents with unilateral foot drop and severe thigh pain. He has quadriceps weakness and absent knee jerk reflex. HbA1c is 8.9%. What is the most likely diagnosis?",
    o: ["Diabetic amyotrophy (diabetic lumbosacral radiculoplexus neuropathy)", "Lumbar disc herniation at L3-L4", "Peripheral arterial disease", "Diabetic peripheral neuropathy"],
    a: 0,
    r: "Diabetic amyotrophy (also called diabetic lumbosacral radiculoplexus neuropathy or Bruns-Garland syndrome) presents with acute/subacute asymmetric proximal leg pain, weakness (especially quadriceps), and weight loss. It is distinct from typical symmetric diabetic peripheral neuropathy. EMG shows denervation in the lumbosacral plexus distribution. Management includes pain control, glycemic optimization, and physical therapy. Most patients recover partially over 12-24 months.",
    s: "Endocrine",
    image: getAssetUrl("lumbarsacralstrain_1773517523349.png")
  },
  {
    q: "A 22-year-old female with type 1 diabetes has an insulin pump delivering a total daily dose of 38 units. She is planning to run a half marathon. How should she adjust her insulin pump settings?",
    o: ["Reduce basal rate by 50-80% starting 1-2 hours before exercise and through the activity; carry rapid-acting glucose; consider reducing pre-exercise bolus", "Increase basal rate during exercise to prevent ketosis", "Disconnect the pump entirely during the race", "Give an extra correction bolus before the race to ensure normoglycemia"],
    a: 0,
    r: "Prolonged aerobic exercise increases insulin sensitivity and glucose uptake, creating hypoglycemia risk. Reducing basal rate by 50-80% starting 1-2 hours before and during exercise is standard practice. Pre-exercise boluses should be reduced. Fast-acting glucose (glucose tabs, gels) must be readily available. Complete pump disconnection risks hyperglycemia and ketosis. Increasing basal or giving extra boluses before exercise causes dangerous hypoglycemia.",
    s: "Endocrine"
  },
  {
    q: "A 48-year-old male presents with recurrent kidney stones. Labs show calcium 10.9 mg/dL, phosphorus 2.4 mg/dL, PTH 95 pg/mL, and 24-hour urine calcium 380 mg. Sestamibi scan shows a left inferior parathyroid adenoma. What is the recommended treatment?",
    o: ["Minimally invasive parathyroidectomy with intraoperative PTH monitoring", "Cinacalcet therapy as definitive management", "Observation with annual calcium monitoring", "High-dose vitamin D supplementation"],
    a: 0,
    r: "Primary hyperparathyroidism with symptomatic disease (kidney stones), localized adenoma on imaging, and biochemical confirmation is a clear surgical indication. Minimally invasive parathyroidectomy with intraoperative PTH monitoring (a 50% decrease from baseline confirms successful adenoma removal) is the gold standard. Cinacalcet is a medical option for patients who cannot undergo surgery. Vitamin D supplementation does not treat the underlying adenoma.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old female with a 3-year history of type 2 diabetes managed with metformin has gradually lost 30 pounds unintentionally. Her BMI is now 21. Fasting C-peptide is very low at 0.3 ng/mL. GAD-65 antibodies are positive. What is the revised diagnosis?",
    o: ["Latent autoimmune diabetes of adults (LADA); initiate insulin therapy", "Type 2 diabetes with successful weight management", "Pancreatic cancer causing weight loss", "Medication-related weight loss from metformin"],
    a: 0,
    r: "LADA (latent autoimmune diabetes of adults) is a slowly progressive autoimmune form of diabetes that initially mimics type 2 but eventually requires insulin. Key features include adult onset, positive GAD-65 antibodies, progressive beta-cell failure (low C-peptide), unintentional weight loss, and eventual insulin dependence. LADA patients should be transitioned to insulin when C-peptide declines, as sulfonylureas may accelerate beta-cell destruction.",
    s: "Endocrine"
  }
];
