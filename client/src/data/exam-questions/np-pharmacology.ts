import type { ExamQuestion } from "./types";

export const npPharmacologyQuestions: ExamQuestion[] = [
  // ===== FIRST-LINE AGENTS (Questions 1-10) =====
  {
    q: "A 58-year-old male presents with a new diagnosis of type 2 diabetes mellitus and an HbA1c of 8.2%. He has a BMI of 34 and an eGFR of 72 mL/min/1.73m2. Which first-line pharmacotherapy should the nurse practitioner prescribe?",
    o: ["Metformin 500 mg twice daily with meals", "Glyburide 5 mg daily", "Insulin glargine 10 units at bedtime", "Sitagliptin 100 mg daily"],
    a: 0,
    r: "Metformin remains the first-line pharmacotherapy for type 2 diabetes mellitus according to current clinical practice guidelines. It improves insulin sensitivity, does not cause weight gain, and has cardiovascular benefits. It is safe with an eGFR above 30 mL/min/1.73m2. Sulfonylureas like glyburide carry hypoglycemia risk and weight gain. Insulin is reserved for higher HbA1c levels or when oral agents fail. DPP-4 inhibitors are second-line agents.",
    s: "Pharmacology"
  },
  {
    q: "A 62-year-old female with newly diagnosed essential hypertension, type 2 diabetes, and microalbuminuria (albumin-to-creatinine ratio 5.2 mg/mmol) presents for medication initiation. Which antihypertensive class should the nurse practitioner select as first-line therapy?",
    o: ["ACE inhibitor such as ramipril", "Thiazide diuretic such as hydrochlorothiazide", "Calcium channel blocker such as amlodipine", "Beta-blocker such as metoprolol"],
    a: 0,
    r: "ACE inhibitors are the first-line choice for hypertensive patients with diabetes and microalbuminuria because they provide both blood pressure reduction and renoprotective effects by reducing intraglomerular pressure and proteinuria. Thiazide diuretics are first-line for uncomplicated hypertension but do not offer the same renal protection. Calcium channel blockers lack the renoprotective benefit of ACE inhibitors. Beta-blockers are not first-line for uncomplicated hypertension.",
    s: "Pharmacology"
  },
  {
    q: "A 45-year-old male presents with a first episode of acute gout affecting the first metatarsophalangeal joint. He has no renal impairment and no contraindications to NSAIDs. Which agent is the most appropriate first-line treatment?",
    o: ["Naproxen 500 mg twice daily for 5-7 days", "Allopurinol 100 mg daily", "Probenecid 250 mg twice daily", "Febuxostat 40 mg daily"],
    a: 0,
    r: "For acute gout flares, NSAIDs such as naproxen are first-line therapy when there are no contraindications. They provide effective anti-inflammatory and analgesic effects. Allopurinol and febuxostat are urate-lowering therapies used for chronic management and should not be initiated during an acute flare as they can worsen symptoms. Probenecid is a uricosuric agent used for chronic gout management, not acute treatment.",
    s: "Pharmacology"
  },
  {
    q: "A 35-year-old female presents with community-acquired pneumonia. She is otherwise healthy with no drug allergies. Which empiric antibiotic regimen should the nurse practitioner prescribe for outpatient treatment?",
    o: ["Amoxicillin 1 g three times daily for 5 days", "Levofloxacin 750 mg daily for 5 days", "Azithromycin 500 mg on day 1 then 250 mg for days 2-5 plus amoxicillin", "Ciprofloxacin 500 mg twice daily for 7 days"],
    a: 0,
    r: "For previously healthy outpatients with community-acquired pneumonia and no comorbidities or risk factors for resistant organisms, high-dose amoxicillin is recommended as first-line monotherapy. Respiratory fluoroquinolones like levofloxacin are reserved for patients with comorbidities or when first-line agents have failed. Combination therapy is for patients with comorbidities. Ciprofloxacin has poor coverage against Streptococcus pneumoniae.",
    s: "Pharmacology"
  },
  {
    q: "A 50-year-old male with a history of GERD presents with persistent heartburn despite lifestyle modifications. He has no alarm symptoms. Which medication should the nurse practitioner prescribe as first-line therapy?",
    o: ["Omeprazole 20 mg daily for 4-8 weeks", "Ranitidine 150 mg twice daily indefinitely", "Sucralfate 1 g four times daily", "Metoclopramide 10 mg three times daily"],
    a: 0,
    r: "Proton pump inhibitors such as omeprazole are first-line pharmacotherapy for GERD when lifestyle modifications are insufficient. They provide superior acid suppression compared to H2 receptor antagonists. A 4-8 week course is standard initial therapy. H2 blockers are second-line. Sucralfate is used primarily for peptic ulcer disease. Metoclopramide is a prokinetic agent with significant adverse effects and is not first-line for GERD.",
    s: "Pharmacology"
  },
  {
    q: "A 28-year-old female presents with a first episode of major depressive disorder with moderate severity. She has no comorbid conditions. Which class of antidepressant should the nurse practitioner prescribe as first-line therapy?",
    o: ["Selective serotonin reuptake inhibitor such as sertraline", "Tricyclic antidepressant such as amitriptyline", "Monoamine oxidase inhibitor such as phenelzine", "Atypical antipsychotic such as quetiapine"],
    a: 0,
    r: "SSRIs are the first-line pharmacotherapy for major depressive disorder due to their favorable side effect profile, safety in overdose, and established efficacy. Sertraline is a common choice with good evidence. Tricyclic antidepressants have significant anticholinergic effects and are dangerous in overdose. MAOIs require strict dietary restrictions and are reserved for treatment-resistant cases. Atypical antipsychotics are adjunctive therapy, not first-line monotherapy for depression.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old male with stable angina pectoris and no contraindications requires long-term prophylactic therapy. Which medication should the nurse practitioner prescribe as first-line to reduce angina episodes?",
    o: ["Metoprolol succinate extended-release daily", "Nitroglycerin sublingual as needed only", "Ranolazine extended-release twice daily", "Isosorbide dinitrate three times daily"],
    a: 0,
    r: "Beta-blockers such as metoprolol succinate are first-line prophylactic therapy for stable angina. They reduce myocardial oxygen demand by decreasing heart rate, contractility, and blood pressure. Sublingual nitroglycerin is for acute episodes only, not prophylaxis. Ranolazine is reserved for patients who have failed first-line agents. Long-acting nitrates are second-line or adjunctive therapy.",
    s: "Pharmacology"
  },
  {
    q: "A 40-year-old female presents with newly diagnosed generalized anxiety disorder. She has a history of substance use disorder with alcohol. Which anxiolytic is the most appropriate first-line agent?",
    o: ["Buspirone 5 mg three times daily", "Lorazepam 1 mg twice daily", "Alprazolam 0.5 mg three times daily", "Diazepam 5 mg twice daily"],
    a: 0,
    r: "Buspirone is the preferred anxiolytic for generalized anxiety disorder in patients with a history of substance use disorder because it has no abuse potential, no sedation, and no cross-tolerance with alcohol. Benzodiazepines (lorazepam, alprazolam, diazepam) are contraindicated in patients with active or history of substance use disorders due to high abuse potential, tolerance, dependence, and dangerous interactions with alcohol.",
    s: "Pharmacology"
  },
  {
    q: "A 65-year-old male presents with new-onset atrial fibrillation with a ventricular rate of 112 bpm. He has a history of heart failure with reduced ejection fraction (LVEF 30%). Which rate control agent is most appropriate?",
    o: ["Metoprolol tartrate 25 mg twice daily with careful dose titration", "Verapamil 80 mg three times daily", "Diltiazem 120 mg extended-release daily", "Flecainide 100 mg twice daily"],
    a: 0,
    r: "Beta-blockers such as metoprolol are preferred for rate control in atrial fibrillation with concurrent heart failure with reduced ejection fraction. They should be initiated at low doses and titrated carefully. Non-dihydropyridine calcium channel blockers (verapamil, diltiazem) are contraindicated in HFrEF because their negative inotropic effects can worsen heart failure. Flecainide is a rhythm control agent contraindicated in structural heart disease due to proarrhythmic risk.",
    s: "Pharmacology"
  },
  {
    q: "A 70-year-old female with osteoporosis and a T-score of -3.1 at the lumbar spine presents for treatment initiation. She has adequate calcium and vitamin D intake. Which pharmacotherapy should the nurse practitioner prescribe as first-line?",
    o: ["Alendronate 70 mg once weekly", "Raloxifene 60 mg daily", "Teriparatide 20 mcg subcutaneously daily", "Denosumab 60 mg subcutaneously every 6 months"],
    a: 0,
    r: "Oral bisphosphonates such as alendronate are the first-line pharmacotherapy for osteoporosis. They inhibit osteoclast-mediated bone resorption and reduce fracture risk. Raloxifene is a selective estrogen receptor modulator used when bisphosphonates are contraindicated. Teriparatide is reserved for severe osteoporosis or bisphosphonate failure. Denosumab is an alternative when bisphosphonates are contraindicated or not tolerated.",
    s: "Pharmacology"
  },
  // ===== DOSE ADJUSTMENTS (Questions 11-18) =====
  {
    q: "A 72-year-old male with chronic kidney disease has an eGFR of 22 mL/min/1.73m2. He is currently taking metformin 1000 mg twice daily for type 2 diabetes. What dose adjustment should the nurse practitioner make?",
    o: ["Discontinue metformin as it is contraindicated at eGFR below 30", "Continue the current dose as no adjustment is needed", "Increase the dose to 1500 mg twice daily for better glycemic control", "Switch to metformin extended-release 2000 mg daily"],
    a: 0,
    r: "Metformin should be discontinued when eGFR falls below 30 mL/min/1.73m2 due to the increased risk of lactic acidosis from impaired renal clearance. At eGFR 30-45, the dose should be reduced to a maximum of 1000 mg daily. Below 30, the drug should be stopped entirely and an alternative hypoglycemic agent selected. Increasing the dose or switching formulations at this level of renal impairment is dangerous.",
    s: "Pharmacology"
  },
  {
    q: "A 68-year-old female with moderate hepatic impairment (Child-Pugh class B) requires pain management. She has been taking acetaminophen 1000 mg every 6 hours. What prescribing change should the nurse practitioner make?",
    o: ["Reduce the maximum daily dose to no more than 2000 mg per day", "Continue the current dose as hepatic impairment does not affect acetaminophen dosing", "Increase to 1500 mg every 6 hours for improved pain control", "Switch to ibuprofen 600 mg every 8 hours instead"],
    a: 0,
    r: "In patients with hepatic impairment, the maximum daily dose of acetaminophen should be reduced to 2000 mg per day or less to minimize the risk of hepatotoxicity. The liver metabolizes acetaminophen, and impaired hepatic function increases the accumulation of the toxic metabolite NAPQI. Continuing the full dose risks liver damage. NSAIDs are also problematic in liver disease due to bleeding risk from coagulopathy and potential renal effects.",
    s: "Pharmacology"
  },
  {
    q: "A 75-year-old male with an eGFR of 35 mL/min/1.73m2 requires antibiotic therapy for a urinary tract infection. The nurse practitioner prescribes ciprofloxacin. What dose modification is required?",
    o: ["Reduce the dose by 50% or extend the dosing interval", "No dose adjustment is needed for fluoroquinolones", "Double the initial dose to achieve therapeutic levels faster", "Switch to an aminoglycoside which is safer in renal impairment"],
    a: 0,
    r: "Ciprofloxacin is renally cleared and requires dose adjustment when eGFR falls below 50 mL/min/1.73m2. The dose should be reduced or the interval extended to prevent drug accumulation and toxicity. Fluoroquinolones do require renal dose adjustment. Doubling the dose increases toxicity risk. Aminoglycosides are highly nephrotoxic and would be a worse choice in renal impairment.",
    s: "Pharmacology"
  },
  {
    q: "A 60-year-old female with epilepsy and newly diagnosed chronic kidney disease (eGFR 28 mL/min/1.73m2) is taking gabapentin 600 mg three times daily for neuropathic pain. What adjustment should the nurse practitioner make?",
    o: ["Reduce the dose significantly as gabapentin is renally cleared", "Continue the current dose as gabapentin is hepatically metabolized", "Increase the dose due to reduced absorption in renal disease", "Discontinue gabapentin and switch to carbamazepine"],
    a: 0,
    r: "Gabapentin is exclusively renally eliminated and requires significant dose reduction in patients with eGFR below 30 mL/min/1.73m2. At this level of renal function, the dose should be reduced to approximately 100-300 mg daily. Continuing the full dose risks accumulation causing sedation, ataxia, and respiratory depression. Gabapentin is not hepatically metabolized. Carbamazepine has significant drug interactions and is not a simple substitution.",
    s: "Pharmacology"
  },
  {
    q: "An 80-year-old female weighing 45 kg is being started on digoxin for heart failure. Which prescribing consideration is most important for the nurse practitioner?",
    o: ["Use a lower dose based on low body weight, age, and renal function", "Use the standard adult dose as age does not affect digoxin pharmacokinetics", "Start with a loading dose of 1 mg IV to achieve rapid therapeutic levels", "Prescribe digoxin 0.5 mg daily as the standard starting dose"],
    a: 0,
    r: "Digoxin has a narrow therapeutic index and is renally cleared. In elderly patients with low body weight and potentially reduced renal function, the dose must be significantly lowered to prevent toxicity. Starting doses of 0.0625-0.125 mg daily are appropriate. The standard dose of 0.25 mg may be excessive. A 1 mg IV loading dose in this patient could cause fatal dysrhythmias. Therapeutic drug monitoring is essential.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old male with compensated cirrhosis (Child-Pugh class A) requires anxiolytic therapy. Which benzodiazepine is preferred due to its hepatic metabolism profile?",
    o: ["Lorazepam because it undergoes glucuronidation and does not require extensive hepatic oxidation", "Diazepam because it has the longest half-life and most active metabolites", "Chlordiazepoxide because it provides the most sustained anxiolytic effect", "Midazolam because it has rapid onset and short duration"],
    a: 0,
    r: "Lorazepam is preferred in hepatic impairment because it undergoes simple glucuronidation (phase II metabolism) rather than oxidative (phase I) hepatic metabolism. This pathway is relatively preserved in liver disease. Diazepam and chlordiazepoxide undergo extensive oxidative metabolism and produce active metabolites, leading to unpredictable accumulation in liver disease. Midazolam also undergoes CYP3A4 oxidative metabolism and can accumulate.",
    s: "Pharmacology"
  },
  {
    q: "A 63-year-old female with type 2 diabetes and an eGFR of 40 mL/min/1.73m2 is being considered for an SGLT2 inhibitor. Which prescribing decision is correct?",
    o: ["Empagliflozin may be initiated for cardiorenal benefit but glucose-lowering efficacy is reduced", "SGLT2 inhibitors are absolutely contraindicated at eGFR below 60", "Canagliflozin 300 mg daily is safe at any level of renal function", "Dapagliflozin should be initiated at the highest dose for renal protection"],
    a: 0,
    r: "Current evidence supports initiating SGLT2 inhibitors such as empagliflozin at eGFR as low as 20 mL/min/1.73m2 for cardiorenal benefits, though glucose-lowering efficacy diminishes at lower eGFR values. The previous contraindication at eGFR below 60 has been revised based on cardiovascular and renal outcome trials. However, doses should be appropriate for the level of renal function, and the highest doses are not recommended with reduced eGFR.",
    s: "Pharmacology"
  },
  {
    q: "A 70-year-old male is started on amoxicillin-clavulanate for acute bacterial sinusitis. His eGFR is 18 mL/min/1.73m2. What dose adjustment is required?",
    o: ["Extend the dosing interval to every 12-24 hours and avoid the extended-release formulation", "No dose adjustment is required for amoxicillin-clavulanate", "Double the standard dose to overcome reduced absorption", "Switch to an aminoglycoside for better efficacy"],
    a: 0,
    r: "Amoxicillin is renally cleared and requires dose adjustment when eGFR falls below 30 mL/min/1.73m2. The dosing interval should be extended, and the extended-release formulation should be avoided as it requires adequate renal function for proper absorption. Doubling the dose would increase toxicity risk. Aminoglycosides are nephrotoxic and inappropriate in severe renal impairment for sinusitis treatment.",
    s: "Pharmacology"
  },
  // ===== CONTRAINDICATIONS (Questions 19-26) =====
  {
    q: "A 30-year-old female with migraine with aura requests a prescription for sumatriptan. The nurse practitioner should take which action?",
    o: ["Avoid prescribing sumatriptan due to increased cardiovascular risk in migraine with aura", "Prescribe sumatriptan 50 mg as it is safe for all migraine types", "Prescribe sumatriptan with a beta-blocker for enhanced effect", "Prescribe ergotamine as an alternative triptan"],
    a: 0,
    r: "Triptans are relatively contraindicated in patients with migraine with aura due to concerns about cerebrovascular vasoconstriction and the already elevated stroke risk associated with aura. Alternative treatments include NSAIDs, acetaminophen, or newer agents such as gepants (rimegepant, ubrogepant) which do not cause vasoconstriction. Ergotamine is not a triptan and also causes vasoconstriction. Combined use of triptans and ergotamines is contraindicated.",
    s: "Pharmacology"
  },
  {
    q: "A 42-year-old female with a history of systemic lupus erythematosus and antiphospholipid syndrome requires anticoagulation for recurrent deep vein thrombosis. Which anticoagulant is contraindicated?",
    o: ["Rivaroxaban due to inferior efficacy and increased thrombotic risk in antiphospholipid syndrome", "Warfarin with target INR 2.5-3.5", "Unfractionated heparin for acute treatment", "Low-molecular-weight heparin for bridging therapy"],
    a: 0,
    r: "Direct oral anticoagulants (DOACs) including rivaroxaban are contraindicated in antiphospholipid syndrome, particularly triple-positive APS, due to evidence of increased thrombotic events compared to warfarin. Multiple trials have demonstrated inferior outcomes with DOACs in this population. Warfarin remains the standard of care for anticoagulation in APS. UFH and LMWH are appropriate for acute management and bridging.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old male with a history of acute angle-closure glaucoma presents with urinary retention due to benign prostatic hyperplasia. Which medication class is contraindicated for his urinary symptoms?",
    o: ["Anticholinergic agents such as oxybutynin", "Alpha-1 blockers such as tamsulosin", "5-alpha reductase inhibitors such as finasteride", "Phosphodiesterase-5 inhibitors such as tadalafil"],
    a: 0,
    r: "Anticholinergic medications are contraindicated in acute angle-closure glaucoma because they can cause mydriasis and further narrow the anterior chamber angle, precipitating an acute glaucoma attack. Additionally, anticholinergics can worsen urinary retention. Alpha-1 blockers and 5-alpha reductase inhibitors are appropriate treatments for BPH. Tadalafil 5 mg daily is approved for both BPH and erectile dysfunction.",
    s: "Pharmacology"
  },
  {
    q: "A 38-year-old female who is 8 weeks pregnant presents with a urinary tract infection. Which antibiotic is contraindicated during pregnancy?",
    o: ["Trimethoprim-sulfamethoxazole due to folate antagonism and teratogenic risk in the first trimester", "Amoxicillin 500 mg three times daily", "Cephalexin 500 mg four times daily", "Nitrofurantoin in the second trimester"],
    a: 0,
    r: "Trimethoprim-sulfamethoxazole is contraindicated in the first trimester of pregnancy due to its folate antagonist properties, which can cause neural tube defects. It is also avoided near term due to the risk of neonatal kernicterus. Amoxicillin and cephalexin are safe in pregnancy. Nitrofurantoin is generally avoided in the first trimester and near term but is acceptable in the second and third trimesters.",
    s: "Pharmacology"
  },
  {
    q: "A 50-year-old male with a history of prolonged QTc interval (520 ms) on ECG presents with a suspected bacterial infection requiring macrolide therapy. What should the nurse practitioner do?",
    o: ["Avoid macrolides and choose an alternative antibiotic class that does not prolong QTc", "Prescribe azithromycin as macrolides do not affect QTc interval", "Prescribe erythromycin with cardiac monitoring", "Prescribe clarithromycin at a reduced dose"],
    a: 0,
    r: "Macrolide antibiotics, particularly erythromycin and clarithromycin, are associated with QTc prolongation and risk of torsades de pointes. Azithromycin also carries a lesser but still clinically significant QTc prolongation risk. In a patient with a baseline prolonged QTc of 520 ms, all macrolides should be avoided and an alternative antibiotic selected. Dose reduction does not eliminate the arrhythmia risk.",
    s: "Pharmacology"
  },
  {
    q: "A 45-year-old female with asthma and hypertension requires a new antihypertensive agent. Which medication class is contraindicated?",
    o: ["Non-selective beta-blockers such as propranolol", "ACE inhibitors such as lisinopril", "Calcium channel blockers such as amlodipine", "Angiotensin receptor blockers such as losartan"],
    a: 0,
    r: "Non-selective beta-blockers such as propranolol block beta-2 receptors in the bronchial smooth muscle, causing bronchoconstriction, which can trigger severe or fatal asthma exacerbations. They are absolutely contraindicated in asthma. Cardioselective beta-blockers (metoprolol, bisoprolol) may be used with caution at low doses. ACE inhibitors, calcium channel blockers, and ARBs do not cause bronchospasm and are safe alternatives.",
    s: "Pharmacology"
  },
  {
    q: "A 60-year-old male with a history of bilateral renal artery stenosis is being evaluated for hypertension management. Which medication class is absolutely contraindicated?",
    o: ["ACE inhibitors and angiotensin receptor blockers", "Thiazide diuretics", "Calcium channel blockers", "Direct vasodilators such as hydralazine"],
    a: 0,
    r: "ACE inhibitors and ARBs are absolutely contraindicated in bilateral renal artery stenosis because they block angiotensin II-mediated efferent arteriolar constriction, which is essential for maintaining glomerular filtration pressure in stenotic kidneys. Their use can precipitate acute renal failure. Thiazide diuretics, calcium channel blockers, and hydralazine can be used safely as alternative antihypertensives in this population.",
    s: "Pharmacology"
  },
  {
    q: "A 32-year-old female taking carbamazepine for epilepsy becomes pregnant. She asks if she can continue her current medication. What should the nurse practitioner advise?",
    o: ["Carbamazepine is a known teratogen and requires careful risk-benefit discussion with neurology consultation", "Carbamazepine is completely safe in pregnancy and requires no changes", "Discontinue carbamazepine immediately without any replacement", "Switch to valproic acid which is safer in pregnancy"],
    a: 0,
    r: "Carbamazepine is associated with neural tube defects, craniofacial abnormalities, and developmental delays when used in pregnancy. However, uncontrolled seizures also pose significant risks to both mother and fetus. A risk-benefit discussion with neurology is essential, and high-dose folic acid (4-5 mg daily) should be prescribed. Abrupt discontinuation can cause status epilepticus. Valproic acid has an even higher teratogenic risk and is the worst choice among antiepileptics for pregnancy.",
    s: "Pharmacology"
  },
  {
    q: "A 48-year-old male with a history of severe sulfonamide allergy (anaphylaxis) requires a diuretic for hypertension management. Which diuretic should the nurse practitioner avoid?",
    o: ["Hydrochlorothiazide due to potential cross-reactivity with sulfonamide allergy", "Spironolactone", "Amiloride", "Ethacrynic acid"],
    a: 0,
    r: "Hydrochlorothiazide and other thiazide diuretics contain a sulfonamide moiety and may cross-react in patients with severe sulfonamide allergies, particularly those with a history of anaphylaxis. While cross-reactivity rates are debated, caution is warranted in patients with severe reactions. Spironolactone, amiloride, and ethacrynic acid are non-sulfonamide diuretics and are safer alternatives in this context.",
    s: "Pharmacology"
  },
  // ===== DRUG INTERACTIONS (Questions 27-36) =====
  {
    q: "A 65-year-old male on warfarin therapy for atrial fibrillation develops a sinus infection. The nurse practitioner prescribes clarithromycin. What is the primary concern regarding this drug interaction?",
    o: ["Clarithromycin inhibits CYP3A4 and CYP1A2, significantly increasing warfarin levels and bleeding risk", "Clarithromycin decreases warfarin absorption and reduces its efficacy", "There is no significant interaction between clarithromycin and warfarin", "Clarithromycin converts warfarin into an inactive metabolite"],
    a: 0,
    r: "Clarithromycin is a potent CYP3A4 inhibitor and also affects CYP1A2. Warfarin is metabolized by multiple CYP enzymes, and inhibition by clarithromycin leads to increased warfarin plasma concentrations and significantly elevated INR, increasing hemorrhagic risk. Close INR monitoring is required, and an alternative antibiotic should be considered. The interaction is well-documented and clinically significant.",
    s: "Pharmacology"
  },
  {
    q: "A 40-year-old female taking an SSRI (fluoxetine) for depression is prescribed a triptan (sumatriptan) for migraine. What potential drug interaction should the nurse practitioner be concerned about?",
    o: ["Serotonin syndrome due to combined serotonergic activity", "Reduced efficacy of the SSRI due to competitive binding", "Increased risk of hepatotoxicity from combined hepatic metabolism", "Decreased absorption of both medications"],
    a: 0,
    r: "Combining SSRIs with triptans increases the risk of serotonin syndrome due to excessive serotonergic stimulation. Symptoms include agitation, hyperthermia, tachycardia, clonus, hyperreflexia, and altered mental status. While the absolute risk is low, the FDA has issued a warning about this combination. If the combination is necessary, the patient should be educated about warning signs and monitored closely. The interaction is pharmacodynamic, not related to absorption or hepatic metabolism.",
    s: "Pharmacology"
  },
  {
    q: "A 58-year-old male taking simvastatin 40 mg daily is prescribed amiodarone for atrial fibrillation. What prescribing change should the nurse practitioner make?",
    o: ["Reduce simvastatin to a maximum of 20 mg daily due to increased risk of rhabdomyolysis", "Continue simvastatin at 40 mg as there is no significant interaction", "Increase simvastatin to 80 mg daily for cardiovascular protection", "Discontinue simvastatin entirely as statins are contraindicated with amiodarone"],
    a: 0,
    r: "Amiodarone inhibits CYP3A4, which metabolizes simvastatin. Co-administration significantly increases simvastatin plasma levels and the risk of myopathy and rhabdomyolysis. The simvastatin dose should not exceed 20 mg daily when used with amiodarone. Alternatively, switching to a statin with less CYP3A4 dependence (rosuvastatin, pravastatin) is advisable. Statins are not absolutely contraindicated with amiodarone, but dose limits must be observed.",
    s: "Pharmacology"
  },
  {
    q: "A 70-year-old female is taking lithium 600 mg twice daily for bipolar disorder. She is prescribed ibuprofen for osteoarthritis pain. What should the nurse practitioner monitor?",
    o: ["Serum lithium levels because NSAIDs reduce renal lithium clearance and increase toxicity risk", "Hepatic function tests because ibuprofen increases lithium hepatotoxicity", "Blood glucose levels because NSAIDs alter lithium-induced insulin secretion", "Serum calcium levels because the combination causes hypercalcemia"],
    a: 0,
    r: "NSAIDs, including ibuprofen, reduce renal prostaglandin synthesis, which decreases glomerular filtration rate and lithium renal clearance. This leads to lithium accumulation and increased risk of toxicity. Lithium levels should be monitored closely, and the lowest effective NSAID dose should be used for the shortest duration. Signs of lithium toxicity include tremor, ataxia, confusion, and renal impairment. The interaction is renal, not hepatic.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old female on methotrexate for rheumatoid arthritis is prescribed trimethoprim-sulfamethoxazole for a urinary tract infection. What is the primary concern?",
    o: ["Both drugs inhibit folate metabolism, increasing the risk of severe pancytopenia", "The antibiotic will reduce methotrexate absorption", "Trimethoprim enhances methotrexate renal clearance reducing efficacy", "There is no clinically significant interaction between these drugs"],
    a: 0,
    r: "Both methotrexate and trimethoprim are folate antagonists. Methotrexate inhibits dihydrofolate reductase, and trimethoprim has a similar mechanism. Combined use leads to severe additive bone marrow suppression, potentially causing pancytopenia (anemia, neutropenia, thrombocytopenia). An alternative antibiotic should be selected. Additionally, trimethoprim can reduce renal clearance of methotrexate, further increasing toxicity. This is a clinically critical interaction that must be avoided.",
    s: "Pharmacology"
  },
  {
    q: "A 45-year-old male is taking phenytoin for seizure disorder. He is started on omeprazole for GERD. How does this interaction affect phenytoin?",
    o: ["Omeprazole inhibits CYP2C19, potentially increasing phenytoin levels", "Omeprazole increases phenytoin metabolism leading to subtherapeutic levels", "Omeprazole has no effect on phenytoin pharmacokinetics", "Omeprazole displaces phenytoin from protein binding sites without clinical effect"],
    a: 0,
    r: "Omeprazole inhibits CYP2C19, one of the major enzymes responsible for phenytoin metabolism. This can lead to increased phenytoin plasma concentrations and risk of toxicity (nystagmus, ataxia, sedation). Phenytoin levels should be monitored when omeprazole is initiated or the dose changed. An alternative PPI with less CYP2C19 inhibition, such as pantoprazole, may be considered. The interaction is clinically significant given phenytoin's narrow therapeutic index.",
    s: "Pharmacology"
  },
  {
    q: "A 38-year-old female taking combined oral contraceptives is prescribed rifampin for latent tuberculosis. What counseling should the nurse practitioner provide?",
    o: ["Rifampin significantly reduces oral contraceptive efficacy and alternative contraception is required", "Rifampin enhances the contraceptive effect so the dose can be reduced", "There is no interaction between rifampin and oral contraceptives", "Switching to a progesterone-only pill will prevent the interaction"],
    a: 0,
    r: "Rifampin is one of the most potent CYP3A4 inducers and dramatically accelerates the metabolism of ethinyl estradiol and progestins in oral contraceptives, reducing their efficacy and increasing the risk of unintended pregnancy. Alternative or additional non-hormonal contraception (IUD, condoms) must be used during and for at least one month after rifampin therapy. Progesterone-only pills are equally affected by CYP3A4 induction.",
    s: "Pharmacology"
  },
  {
    q: "A 60-year-old male taking clopidogrel after coronary stent placement is prescribed omeprazole for gastroprotection. What should the nurse practitioner consider?",
    o: ["Omeprazole may reduce the antiplatelet effect of clopidogrel via CYP2C19 inhibition", "Omeprazole enhances clopidogrel activation leading to increased bleeding", "All proton pump inhibitors are equally contraindicated with clopidogrel", "There is no interaction between clopidogrel and proton pump inhibitors"],
    a: 0,
    r: "Clopidogrel is a prodrug that requires CYP2C19 activation. Omeprazole is a CYP2C19 inhibitor and can reduce the conversion of clopidogrel to its active metabolite, potentially decreasing its antiplatelet effect and increasing thrombotic risk. Pantoprazole has less CYP2C19 inhibition and is the preferred PPI when gastroprotection is needed with clopidogrel. Not all PPIs have the same degree of interaction; the concern is primarily with omeprazole and esomeprazole.",
    s: "Pharmacology"
  },
  {
    q: "A 50-year-old female is taking metformin and has been prescribed contrast dye for a CT scan. What instruction should the nurse practitioner give?",
    o: ["Hold metformin for 48 hours after contrast administration and recheck renal function before restarting", "Continue metformin without interruption as contrast dye has no interaction", "Discontinue metformin permanently after contrast exposure", "Take a double dose of metformin before the procedure"],
    a: 0,
    r: "Iodinated contrast media can cause acute kidney injury, which impairs metformin clearance and increases the risk of lactic acidosis. Metformin should be held at the time of or before the procedure and withheld for 48 hours after contrast administration. Renal function (eGFR or serum creatinine) should be reassessed before restarting metformin. Permanent discontinuation is not necessary if renal function remains stable. A double dose would increase toxicity risk.",
    s: "Pharmacology"
  },
  {
    q: "A 35-year-old male on an MAOI (phenelzine) for treatment-resistant depression reports eating aged cheese and developing a severe headache with blood pressure of 210/120 mmHg. What is the cause of this hypertensive crisis?",
    o: ["Tyramine in aged cheese was not metabolized due to MAO-A inhibition, causing a catecholamine surge", "The MAOI caused direct vasoconstriction from cheese protein binding", "Cheese increased MAOI absorption leading to drug toxicity", "An allergic reaction to the cheese triggered histamine release"],
    a: 0,
    r: "MAOIs inhibit monoamine oxidase-A, which normally metabolizes tyramine in the gut. When tyramine-rich foods (aged cheese, cured meats, fermented foods) are consumed, unmetabolized tyramine enters the systemic circulation and causes massive norepinephrine release from sympathetic nerve terminals, resulting in hypertensive crisis. Treatment includes phentolamine or nifedipine. Patients on MAOIs must follow strict dietary restrictions. This is a pharmacokinetic-pharmacodynamic interaction, not an allergy.",
    s: "Pharmacology"
  },
  // ===== MONITORING PARAMETERS (Questions 37-46) =====
  {
    q: "A nurse practitioner initiates a patient on amiodarone 200 mg daily for atrial fibrillation. Which baseline and ongoing monitoring studies are essential?",
    o: ["Thyroid function tests, liver function tests, pulmonary function tests, and ophthalmologic exam", "Complete blood count and serum iron studies only", "Fasting glucose and lipid panel only", "Renal function tests and urinalysis only"],
    a: 0,
    r: "Amiodarone has a wide range of organ toxicities requiring comprehensive monitoring. It contains iodine and can cause both hypothyroidism and hyperthyroidism, requiring TFTs every 6 months. Hepatotoxicity necessitates LFTs at baseline and periodically. Pulmonary toxicity (fibrosis, pneumonitis) requires baseline chest X-ray and PFTs. Corneal microdeposits and optic neuropathy require baseline and annual ophthalmologic exams. These must be done at baseline and at regular intervals throughout therapy.",
    s: "Pharmacology"
  },
  {
    q: "A patient is started on lithium carbonate 300 mg three times daily for bipolar disorder. Which laboratory monitoring is required at baseline and during treatment?",
    o: ["Serum lithium level, renal function, thyroid function, calcium, and ECG", "Hepatic function tests and serum albumin only", "Complete blood count and reticulocyte count only", "Serum drug level only with no other testing needed"],
    a: 0,
    r: "Lithium has a narrow therapeutic index (0.6-1.2 mmol/L) and affects multiple organ systems. Renal function must be monitored as lithium can cause nephrogenic diabetes insipidus and chronic nephropathy. Thyroid function tests are required because lithium inhibits thyroid hormone release and can cause hypothyroidism. Calcium and parathyroid hormone monitoring is needed as lithium can cause hyperparathyroidism. ECG is recommended at baseline for cardiac conduction effects.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner prescribes methotrexate 15 mg weekly for rheumatoid arthritis. What monitoring schedule should be established?",
    o: ["CBC with differential, hepatic function tests, and serum creatinine at baseline and every 4-8 weeks", "No routine monitoring is required for low-dose methotrexate", "Annual liver biopsy as the sole monitoring requirement", "Serum methotrexate levels weekly"],
    a: 0,
    r: "Methotrexate requires regular monitoring due to its potential for bone marrow suppression (requiring CBC with differential), hepatotoxicity (requiring LFTs), and nephrotoxicity (requiring serum creatinine). Monitoring should occur at baseline, 2-4 weeks after initiation, then every 4-8 weeks during therapy. Folic acid supplementation (1 mg daily) reduces side effects. Routine liver biopsy is no longer standard practice. Serum levels are not routinely monitored for low-dose weekly methotrexate.",
    s: "Pharmacology"
  },
  {
    q: "A patient is started on clozapine for treatment-resistant schizophrenia. Which unique monitoring requirement differentiates clozapine from other antipsychotics?",
    o: ["Mandatory absolute neutrophil count monitoring due to risk of agranulocytosis", "Daily serum potassium levels due to hypokalemia risk", "Monthly liver biopsy due to hepatic necrosis risk", "Weekly pulmonary function tests due to pulmonary fibrosis risk"],
    a: 0,
    r: "Clozapine carries a unique risk of life-threatening agranulocytosis, occurring in approximately 1-2% of patients. Mandatory absolute neutrophil count (ANC) monitoring is required: weekly for the first 6 months, biweekly for months 6-12, and monthly thereafter through a registry program. Clozapine cannot be dispensed without documented ANC results. While metabolic monitoring is important for all antipsychotics, the ANC requirement is unique to clozapine.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old male is initiated on a statin (atorvastatin 40 mg daily) for hyperlipidemia. What laboratory monitoring should the nurse practitioner order?",
    o: ["Fasting lipid panel at baseline and 4-12 weeks after initiation, then periodically; hepatic transaminases at baseline", "Weekly creatine kinase levels for the duration of therapy", "Monthly renal function tests and urinalysis", "No monitoring is needed once the statin is initiated"],
    a: 0,
    r: "Statin therapy requires a baseline lipid panel and hepatic transaminases (ALT) before initiation. A follow-up lipid panel at 4-12 weeks assesses therapeutic response. Hepatic transaminases should be rechecked if symptoms of hepatotoxicity develop. Routine CK monitoring is not recommended unless the patient develops myalgia symptoms. Renal monitoring is not a primary requirement for statin therapy. Ongoing periodic lipid panels guide treatment adequacy.",
    s: "Pharmacology"
  },
  {
    q: "A patient on valproic acid for epilepsy presents for a follow-up visit. Which laboratory tests should the nurse practitioner prioritize?",
    o: ["Serum valproic acid level, CBC with platelets, hepatic function tests, and serum ammonia if symptomatic", "Serum glucose and HbA1c only", "Thyroid function tests and serum calcium only", "Renal function and urinalysis only"],
    a: 0,
    r: "Valproic acid requires monitoring of drug levels (therapeutic range 350-700 umol/L), CBC with platelets (risk of thrombocytopenia and pancreatitis), and hepatic function tests (risk of fatal hepatotoxicity, especially in children under 2). Hyperammonemia can occur even with normal liver enzymes and should be checked if the patient presents with confusion, lethargy, or vomiting. Valproic acid does not primarily affect thyroid, renal, or glucose metabolism.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner starts a patient on an ACE inhibitor for hypertension. When should serum potassium and creatinine be rechecked after initiation?",
    o: ["Within 1-2 weeks of starting therapy and after dose changes", "Only at the annual physical examination", "Six months after starting therapy", "No monitoring is needed for ACE inhibitors"],
    a: 0,
    r: "ACE inhibitors can cause hyperkalemia by reducing aldosterone secretion and can impair renal function, especially in patients with underlying renal artery stenosis or chronic kidney disease. Serum potassium and creatinine should be checked within 1-2 weeks of initiation and after each dose adjustment. A rise in creatinine greater than 30% from baseline warrants evaluation and possible discontinuation. Annual monitoring alone is insufficient to detect early adverse effects.",
    s: "Pharmacology"
  },
  {
    q: "A patient is initiated on hydroxychloroquine for systemic lupus erythematosus. What monitoring is recommended to prevent a serious long-term adverse effect?",
    o: ["Baseline and annual ophthalmologic examination for retinal toxicity after 5 years of use", "Monthly ECG monitoring for QTc prolongation", "Weekly hepatic function tests for hepatotoxicity", "Biweekly complete blood counts for neutropenia"],
    a: 0,
    r: "Hydroxychloroquine can cause irreversible retinal toxicity (bull's eye maculopathy) with long-term use. Current guidelines recommend a baseline ophthalmologic exam within the first year and annual screening after 5 years of use (or sooner with risk factors such as renal impairment, higher doses, or concomitant tamoxifen use). Once retinal damage occurs, it is irreversible, making screening essential. Hepatotoxicity and neutropenia are not primary concerns.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner prescribes isotretinoin for severe nodulocystic acne in a 22-year-old female. Which mandatory monitoring is required before and during treatment?",
    o: ["Pregnancy testing monthly, fasting lipid panel, and hepatic function tests with enrollment in a risk management program", "Complete blood count weekly for bone marrow suppression", "Renal function tests and urinalysis monthly", "Thyroid function tests and serum calcium levels biweekly"],
    a: 0,
    r: "Isotretinoin is a potent teratogen (FDA category X) requiring enrollment in a risk management program with two forms of contraception and monthly pregnancy testing for females of childbearing potential. Fasting lipid panels are required as isotretinoin can cause hypertriglyceridemia. Hepatic function tests monitor for hepatotoxicity. Monitoring occurs at baseline, monthly during treatment, and 1 month after discontinuation. Bone marrow suppression, renal, and thyroid effects are not primary concerns.",
    s: "Pharmacology"
  },
  {
    q: "A 60-year-old male is started on carbamazepine for trigeminal neuralgia. Which genetic test should ideally be performed before initiating therapy in patients of Southeast Asian descent?",
    o: ["HLA-B*1502 allele testing to assess risk of Stevens-Johnson syndrome", "CYP2D6 genotyping for dose adjustment", "BRCA1 testing for cancer risk assessment", "Factor V Leiden testing for thrombotic risk"],
    a: 0,
    r: "HLA-B*1502 is strongly associated with carbamazepine-induced Stevens-Johnson syndrome and toxic epidermal necrolysis, particularly in patients of Southeast Asian, South Asian, and East Asian descent. FDA labeling recommends HLA-B*1502 testing before initiating carbamazepine in at-risk populations. Patients who test positive should not receive carbamazepine. CYP2D6, BRCA1, and Factor V Leiden testing are not relevant to carbamazepine prescribing.",
    s: "Pharmacology"
  },
  // ===== PREGNANCY CATEGORIES AND REPRODUCTIVE PHARMACOLOGY (Questions 47-52) =====
  {
    q: "A 30-year-old female with epilepsy who is planning pregnancy asks about the safest antiepileptic medication during pregnancy. Which agent has the most favorable safety profile?",
    o: ["Lamotrigine with close serum level monitoring throughout pregnancy", "Valproic acid at the lowest effective dose", "Phenobarbital with folic acid supplementation", "Topiramate with regular ultrasound monitoring"],
    a: 0,
    r: "Lamotrigine has the most favorable safety profile among antiepileptic drugs during pregnancy, with the lowest rates of major congenital malformations in registry data. Serum levels decrease during pregnancy due to increased glucuronidation and require dose adjustments. Valproic acid has the highest teratogenic risk among AEDs, including neural tube defects and developmental delays. Phenobarbital and topiramate are associated with cleft palate and other malformations.",
    s: "Pharmacology"
  },
  {
    q: "A 28-year-old female taking warfarin for a mechanical heart valve becomes pregnant. What anticoagulation change should the nurse practitioner coordinate?",
    o: ["Switch to low-molecular-weight heparin during the first trimester and discuss risks for the remainder of pregnancy", "Continue warfarin throughout pregnancy as the benefits outweigh the risks", "Discontinue all anticoagulation for the duration of pregnancy", "Switch to rivaroxaban which is safer than warfarin in pregnancy"],
    a: 0,
    r: "Warfarin crosses the placenta and is teratogenic, particularly during weeks 6-12 of gestation, causing warfarin embryopathy (nasal hypoplasia, stippled epiphyses, CNS abnormalities). LMWH does not cross the placenta and is the preferred anticoagulant during the first trimester. For mechanical heart valves, the management during the second and third trimesters requires specialist consultation as both LMWH and warfarin have risks and benefits. DOACs are contraindicated in pregnancy. Stopping anticoagulation risks fatal valve thrombosis.",
    s: "Pharmacology"
  },
  {
    q: "A breastfeeding mother requires treatment for postpartum depression. Which antidepressant is considered most compatible with breastfeeding?",
    o: ["Sertraline due to minimal transfer into breast milk and extensive safety data", "Paroxetine due to its long half-life and active metabolites", "Venlafaxine due to low protein binding", "Fluoxetine due to its short half-life"],
    a: 0,
    r: "Sertraline has the most extensive safety data for use during breastfeeding, with minimal transfer into breast milk and very low infant serum levels. It is considered the preferred SSRI for nursing mothers. Paroxetine also has low transfer but carries discontinuation risks and is not first-choice. Fluoxetine has a long half-life (not short) with an active metabolite that can accumulate in the infant. Venlafaxine has higher transfer into breast milk than SSRIs.",
    s: "Pharmacology"
  },
  {
    q: "A 35-year-old female taking lithium discovers she is 6 weeks pregnant. What is the primary fetal concern associated with lithium exposure during the first trimester?",
    o: ["Ebstein anomaly, a congenital cardiac malformation affecting the tricuspid valve", "Neural tube defects such as spina bifida", "Limb reduction defects", "Renal agenesis"],
    a: 0,
    r: "First-trimester lithium exposure is associated with an increased risk of Ebstein anomaly, a rare congenital heart defect involving downward displacement of the tricuspid valve into the right ventricle. While the absolute risk is low (approximately 1 in 1000 compared to 1 in 20,000 in the general population), a fetal echocardiogram should be performed at 16-20 weeks. Neural tube defects are associated with valproic acid. Limb defects are linked to thalidomide.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is prescribing medications for a 32-year-old female trying to conceive. Which of the following medications requires immediate discontinuation due to teratogenic risk?",
    o: ["Mycophenolate mofetil due to high risk of first-trimester pregnancy loss and birth defects", "Levothyroxine for hypothyroidism", "Prenatal vitamins with folic acid", "Low-dose aspirin for antiphospholipid syndrome"],
    a: 0,
    r: "Mycophenolate mofetil is a potent teratogen associated with increased rates of first-trimester pregnancy loss and congenital malformations including facial clefts, external ear anomalies, and limb defects. It must be discontinued at least 6 weeks before planned conception. Levothyroxine is safe and essential during pregnancy. Prenatal vitamins are recommended. Low-dose aspirin is commonly used in pregnancy for specific indications.",
    s: "Pharmacology"
  },
  {
    q: "A 40-year-old female with rheumatoid arthritis is planning pregnancy and is currently taking leflunomide. What is the required washout procedure before conception?",
    o: ["Cholestyramine washout protocol with verification that plasma levels are below 0.02 mg/L on two occasions", "Simply stop the medication and wait one month", "No washout is needed as leflunomide is safe in pregnancy", "Switch to methotrexate which has a shorter washout period"],
    a: 0,
    r: "Leflunomide has an extremely long elimination half-life (approximately 2 weeks for the active metabolite teriflunomide) and is teratogenic. A cholestyramine washout protocol (8 g three times daily for 11 days) is required to accelerate elimination. Plasma levels must be verified below 0.02 mg/L on two separate occasions at least 14 days apart. Without washout, the drug can persist in the body for up to 2 years. Methotrexate is also teratogenic and requires 3 months washout.",
    s: "Pharmacology"
  },
  // ===== RENAL/HEPATIC ADJUSTMENTS (Questions 53-60) =====
  {
    q: "A 65-year-old male with end-stage renal disease on hemodialysis requires antibiotic therapy for pneumonia. Which antibiotic class requires supplemental dosing after hemodialysis sessions?",
    o: ["Aminoglycosides such as gentamicin because they are water-soluble and readily dialyzed", "Macrolides such as azithromycin because they are highly protein-bound", "Fluoroquinolones such as moxifloxacin because they are hepatically metabolized", "Tetracyclines such as doxycycline because they undergo enterohepatic recirculation"],
    a: 0,
    r: "Aminoglycosides are small, water-soluble molecules with low protein binding and low volume of distribution, making them readily removed by hemodialysis. Supplemental doses are required after dialysis sessions to maintain therapeutic levels. Azithromycin is highly protein-bound and has a large volume of distribution, so it is minimally removed by dialysis. Moxifloxacin is primarily hepatically metabolized. Doxycycline is not significantly removed by dialysis.",
    s: "Pharmacology"
  },
  {
    q: "A 58-year-old female with decompensated cirrhosis (Child-Pugh class C) requires pain management. Which opioid is preferred due to its hepatic metabolism profile?",
    o: ["Hydromorphone at a reduced dose with extended intervals", "Meperidine at the standard dose", "Codeine at the standard dose", "Tramadol at an increased dose for better efficacy"],
    a: 0,
    r: "Hydromorphone is preferred in severe hepatic impairment because it undergoes simple glucuronidation rather than extensive CYP-mediated metabolism, making it more predictable in liver disease. The dose should be reduced and intervals extended. Meperidine produces the neurotoxic metabolite normeperidine, which accumulates and causes seizures. Codeine requires CYP2D6 conversion to morphine and has unpredictable efficacy. Tramadol also requires CYP-mediated activation and has seizure risk.",
    s: "Pharmacology"
  },
  {
    q: "A 72-year-old male with an eGFR of 15 mL/min/1.73m2 requires anticoagulation for non-valvular atrial fibrillation. Which anticoagulant is most appropriate?",
    o: ["Warfarin with INR-guided dosing", "Rivaroxaban 20 mg daily", "Apixaban 5 mg twice daily", "Dabigatran 150 mg twice daily"],
    a: 0,
    r: "At eGFR below 15-25 mL/min/1.73m2, warfarin remains the preferred anticoagulant for atrial fibrillation as it does not depend on renal clearance for elimination. DOACs are either contraindicated or lack sufficient safety data at this level of renal impairment. Dabigatran is the most renally dependent DOAC (80% renal clearance) and is contraindicated in severe renal impairment. While apixaban has the least renal dependence among DOACs, evidence at eGFR below 25 is limited.",
    s: "Pharmacology"
  },
  {
    q: "A patient with severe hepatic impairment requires a proton pump inhibitor. Which PPI requires no dose adjustment in hepatic impairment?",
    o: ["Pantoprazole as it has the most predictable pharmacokinetics in liver disease", "Omeprazole at the standard dose without modification", "Lansoprazole at double the standard dose for hepatic patients", "Esomeprazole requires no consideration of hepatic function"],
    a: 0,
    r: "While all PPIs are hepatically metabolized, pantoprazole undergoes primarily sulfation (a non-CYP pathway) in addition to CYP metabolism, giving it the most predictable pharmacokinetics in hepatic impairment. Omeprazole and esomeprazole undergo extensive CYP2C19 metabolism, and their doses should be reduced in severe hepatic impairment. Lansoprazole also requires dose adjustment. No PPI should be doubled in liver disease.",
    s: "Pharmacology"
  },
  {
    q: "A 60-year-old female with chronic kidney disease (eGFR 25 mL/min/1.73m2) develops gout. Which urate-lowering agent is appropriate, and what dose adjustment is required?",
    o: ["Allopurinol starting at 50-100 mg daily with gradual titration based on uric acid levels", "Allopurinol 300 mg daily without dose adjustment", "Probenecid 500 mg twice daily", "Colchicine 1.2 mg twice daily without modification"],
    a: 0,
    r: "Allopurinol is renally cleared and requires a lower starting dose (50-100 mg daily) in patients with significant renal impairment. The dose should be titrated gradually based on serum uric acid target levels (below 360 umol/L). Starting at 300 mg in this setting risks allopurinol hypersensitivity syndrome. Probenecid is ineffective when eGFR is below 50 mL/min as it requires adequate renal function for uricosuric effect. Colchicine requires dose reduction in renal impairment.",
    s: "Pharmacology"
  },
  {
    q: "A 68-year-old male with Child-Pugh class B cirrhosis requires an antidepressant for major depressive disorder. Which SSRI dosing strategy is most appropriate?",
    o: ["Start sertraline at half the usual dose and titrate slowly based on response and tolerability", "Start fluoxetine at the standard dose as SSRIs do not require hepatic adjustment", "Start paroxetine at double the usual dose to overcome reduced absorption", "Start citalopram at 40 mg daily for maximum efficacy"],
    a: 0,
    r: "All SSRIs undergo hepatic metabolism and require dose reduction in hepatic impairment. Sertraline should be started at half the usual dose (25 mg instead of 50 mg) and titrated slowly. Fluoxetine has a very long half-life with an active metabolite (norfluoxetine) that accumulates in liver disease. Paroxetine should never be doubled. Citalopram has a maximum dose of 20 mg in hepatic impairment and in patients over 60 due to dose-dependent QTc prolongation.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is prescribing enoxaparin for a patient with an eGFR of 22 mL/min/1.73m2. What dose modification is required?",
    o: ["Reduce the dose to 1 mg/kg once daily instead of the standard 1 mg/kg every 12 hours for treatment dosing", "Use the standard dose of 1 mg/kg every 12 hours without adjustment", "Switch to unfractionated heparin which is safer in all renal impairment levels", "Double the dose to overcome reduced renal absorption"],
    a: 0,
    r: "Enoxaparin is renally cleared and accumulates in patients with eGFR below 30 mL/min/1.73m2, increasing bleeding risk. For treatment-dose enoxaparin, the dose should be reduced to 1 mg/kg once daily instead of every 12 hours. Anti-Xa level monitoring may be considered. While UFH does not require renal adjustment, it is not always necessary to switch; dose-adjusted LMWH can be used with monitoring. Doubling the dose would be dangerous.",
    s: "Pharmacology"
  },
  {
    q: "A patient with severe hepatic impairment requires an anxiolytic. The nurse practitioner chooses oxazepam. Why is this selection appropriate?",
    o: ["Oxazepam undergoes only glucuronidation and has no active metabolites, making it predictable in liver disease", "Oxazepam is the most potent benzodiazepine available", "Oxazepam has the longest half-life, providing sustained anxiolysis", "Oxazepam is renally eliminated and bypasses hepatic metabolism entirely"],
    a: 0,
    r: "Oxazepam, like lorazepam and temazepam, undergoes only phase II glucuronidation conjugation, which is relatively preserved in liver disease, and produces no active metabolites. This makes it predictable and safe in hepatic impairment. Other benzodiazepines (diazepam, chlordiazepoxide, alprazolam) undergo CYP-mediated oxidative metabolism and produce active metabolites that accumulate in liver disease. Oxazepam is not the most potent or longest-acting benzodiazepine; it is still hepatically metabolized but via a preserved pathway.",
    s: "Pharmacology"
  },
  // ===== ENDOCANNABINOID PHARMACOLOGY (Questions 61-66) =====
  {
    q: "A patient asks about the mechanism of action of cannabidiol (CBD) compared to tetrahydrocannabinol (THC). Which statement accurately describes the pharmacological difference?",
    o: ["THC is a CB1 receptor partial agonist causing psychoactive effects while CBD has minimal CB1 affinity and is non-intoxicating", "Both THC and CBD bind equally to CB1 receptors and cause identical psychoactive effects", "CBD is a full agonist at CB1 receptors while THC has no receptor activity", "Neither THC nor CBD interact with the endocannabinoid system"],
    a: 0,
    r: "THC exerts its psychoactive effects primarily through partial agonism at CB1 receptors concentrated in the central nervous system. CBD has very low affinity for CB1 and CB2 receptors and instead modulates the endocannabinoid system indirectly through inhibition of fatty acid amide hydrolase (FAAH), enhancement of anandamide signaling, and interaction with serotonin 5-HT1A and TRPV1 receptors. This explains why CBD does not produce the intoxication associated with THC.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is considering prescribing nabilone (Cesamet) for chemotherapy-induced nausea. What is the mechanism of action and a key prescribing consideration?",
    o: ["Synthetic THC analogue acting as a CB1 agonist; monitor for CNS depression and psychoactive effects", "Selective CB2 agonist with no psychoactive potential", "Serotonin receptor antagonist similar to ondansetron", "Dopamine receptor agonist that stimulates the chemoreceptor trigger zone"],
    a: 0,
    r: "Nabilone is a synthetic cannabinoid analogue of THC that acts as a CB1 receptor agonist. Its antiemetic effect is mediated through CB1 receptors in the brainstem vomiting center. It can cause psychoactive effects including euphoria, dysphoria, dizziness, and drowsiness. It is typically reserved for refractory chemotherapy-induced nausea when conventional antiemetics have failed. Patients should be warned about CNS depression and driving impairment.",
    s: "Pharmacology"
  },
  {
    q: "A patient using medical cannabis for chronic pain is also taking warfarin. What pharmacokinetic interaction should the nurse practitioner be aware of?",
    o: ["Cannabis compounds can inhibit CYP2C9 and CYP3A4, potentially increasing warfarin levels and INR", "Cannabis has no known drug interactions with any medications", "Cannabis induces CYP enzymes, requiring higher warfarin doses", "Cannabis only interacts with over-the-counter medications, not prescription drugs"],
    a: 0,
    r: "Both THC and CBD can inhibit cytochrome P450 enzymes, particularly CYP2C9 (the primary enzyme metabolizing the S-enantiomer of warfarin) and CYP3A4. This inhibition can increase warfarin plasma concentrations and elevate INR, increasing bleeding risk. Cannabis use should be disclosed to prescribers, and INR should be monitored more frequently in patients using cannabis with warfarin. The interaction is clinically significant and well-documented.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is evaluating a patient using CBD oil who is also taking clobazam for Lennox-Gastaut syndrome. What interaction should be monitored?",
    o: ["CBD inhibits CYP2C19, increasing levels of norclobazam (active metabolite) and sedation risk", "CBD enhances clobazam metabolism, requiring higher clobazam doses", "There is no interaction between CBD and clobazam", "CBD converts clobazam into a nephrotoxic metabolite"],
    a: 0,
    r: "CBD is a potent inhibitor of CYP2C19, which is responsible for metabolizing clobazam to its active metabolite norclobazam, and for further metabolism of norclobazam. CBD inhibition leads to increased norclobazam levels, potentiating sedation, somnolence, and other CNS depressant effects. This interaction was identified during clinical trials of Epidiolex (pharmaceutical-grade CBD) for seizure disorders. Clobazam dose reduction may be necessary when CBD is co-administered.",
    s: "Pharmacology"
  },
  {
    q: "A patient inquires about the endocannabinoid system and its physiological role. Which description accurately characterizes this system?",
    o: ["A lipid-based signaling system involving endogenous ligands anandamide and 2-AG, CB1/CB2 receptors, and degradation enzymes that modulates pain, mood, appetite, and immune function", "A neurotransmitter system exclusively found in the brain that only responds to exogenous cannabis", "A component of the sympathetic nervous system controlling fight-or-flight responses", "A hormonal system regulated by the pituitary gland that controls growth and metabolism"],
    a: 0,
    r: "The endocannabinoid system (ECS) is a widespread lipid signaling system comprising endogenous cannabinoids (anandamide and 2-arachidonoylglycerol), their receptors (CB1 predominantly in the CNS, CB2 predominantly in immune tissues), and degradation enzymes (FAAH for anandamide, MAGL for 2-AG). The ECS modulates pain perception, mood, appetite, memory, immune responses, and inflammation. It is found throughout the body, not exclusively in the brain, and responds to both endogenous and exogenous cannabinoids.",
    s: "Pharmacology"
  },
  {
    q: "A patient using smoked cannabis for pain reports starting a new prescription for a CYP1A2-substrate medication (theophylline). What effect does smoked cannabis have on CYP1A2 activity?",
    o: ["Polycyclic aromatic hydrocarbons from smoking induce CYP1A2, potentially decreasing theophylline levels", "Smoked cannabis has no effect on any CYP enzymes", "Smoked cannabis inhibits CYP1A2 leading to theophylline toxicity", "The route of cannabis administration does not affect drug interactions"],
    a: 0,
    r: "Smoking (combustion of plant material) produces polycyclic aromatic hydrocarbons that are potent CYP1A2 inducers, regardless of whether the substance is tobacco or cannabis. This induction increases the metabolism of CYP1A2 substrates such as theophylline, clozapine, and olanzapine, potentially reducing their therapeutic levels. This is a route-specific interaction: vaporized or oral cannabis would not have the same CYP1A2 induction effect. Theophylline doses may need adjustment.",
    s: "Pharmacology"
  },
  // ===== IMMUNOSUPPRESSANTS (Questions 67-72) =====
  {
    q: "A nurse practitioner is managing a renal transplant patient on tacrolimus. The patient's trough level is 18 ng/mL (target 5-15 ng/mL). What is the most significant adverse effect at supratherapeutic levels?",
    o: ["Nephrotoxicity with rising creatinine, which can mimic transplant rejection", "Hypoglycemia requiring emergent glucose administration", "Severe anemia requiring blood transfusion", "Pulmonary fibrosis requiring oxygen therapy"],
    a: 0,
    r: "Tacrolimus has a narrow therapeutic index and nephrotoxicity is its most significant dose-limiting adverse effect. At supratherapeutic levels, it causes afferent arteriolar vasoconstriction leading to decreased GFR and elevated creatinine. This can paradoxically mimic rejection, making the distinction critical through biopsy and drug level monitoring. Other adverse effects include neurotoxicity (tremor, headache), hyperglycemia (not hypoglycemia), and hypertension. Pulmonary fibrosis is not a primary concern.",
    s: "Pharmacology"
  },
  {
    q: "A patient on cyclosporine for autoimmune hepatitis develops gingival hyperplasia and hirsutism. The nurse practitioner recognizes these as:",
    o: ["Known adverse effects of cyclosporine that should be managed symptomatically", "Signs of allergic reaction requiring immediate drug discontinuation", "Symptoms of hepatic allograft rejection", "Effects of concurrent corticosteroid therapy"],
    a: 0,
    r: "Gingival hyperplasia and hirsutism are well-known adverse effects of cyclosporine, occurring in approximately 30% and 20% of patients respectively. Other characteristic adverse effects include nephrotoxicity, hypertension, hyperlipidemia, and neurotoxicity. These cosmetic effects are managed symptomatically (dental hygiene for gingival hyperplasia) and are not indications for drug discontinuation unless severe. They are specific to cyclosporine, not corticosteroids.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is managing a patient on azathioprine for inflammatory bowel disease. The patient is prescribed allopurinol for concurrent gout. What critical interaction must be addressed?",
    o: ["Allopurinol inhibits xanthine oxidase, blocking azathioprine metabolism and causing life-threatening myelosuppression", "Allopurinol increases azathioprine absorption requiring a formulation change", "The combination has no clinically significant interaction", "Allopurinol enhances azathioprine metabolism requiring dose increases"],
    a: 0,
    r: "Azathioprine is metabolized to 6-mercaptopurine, which is inactivated by xanthine oxidase. Allopurinol inhibits xanthine oxidase, causing dramatic accumulation of 6-mercaptopurine and severe, potentially fatal bone marrow suppression. If co-administration is absolutely necessary, the azathioprine dose must be reduced by 75% and CBC monitored very frequently. This is one of the most critical drug interactions in clinical practice.",
    s: "Pharmacology"
  },
  {
    q: "A patient receiving mycophenolate mofetil for kidney transplant reports persistent diarrhea and abdominal cramping. What is the most appropriate intervention?",
    o: ["Consider switching to mycophenolate sodium (enteric-coated) or dose reduction after consulting the transplant team", "Discontinue the medication immediately without replacement", "Add loperamide and continue the current dose indefinitely", "Switch to cyclosporine as it has fewer GI side effects"],
    a: 0,
    r: "GI adverse effects (diarrhea, nausea, abdominal pain) are the most common dose-limiting side effects of mycophenolate mofetil, occurring in up to 45% of patients. Switching to mycophenolate sodium (enteric-coated formulation) may reduce GI symptoms while maintaining immunosuppressive efficacy. Dose reduction is another option but must be done in consultation with the transplant team to avoid rejection. Abrupt discontinuation risks acute rejection. Cyclosporine has its own significant adverse effect profile.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is prescribing corticosteroid taper for a patient who has been on prednisone 40 mg daily for 6 weeks. Why is gradual tapering essential?",
    o: ["Prolonged exogenous corticosteroid use suppresses the HPA axis, and abrupt withdrawal can cause adrenal crisis", "Abrupt discontinuation has no clinical consequences", "Tapering prevents rebound hyperglycemia", "Corticosteroids must be tapered to prevent hepatotoxicity"],
    a: 0,
    r: "Prolonged corticosteroid use (generally more than 2-3 weeks) suppresses the hypothalamic-pituitary-adrenal (HPA) axis through negative feedback, reducing endogenous cortisol production. Abrupt withdrawal can precipitate an adrenal crisis (acute adrenal insufficiency) characterized by hypotension, shock, nausea, and potentially death. Gradual tapering allows the adrenal glands to recover endogenous cortisol production. The concern is not hyperglycemia or hepatotoxicity upon withdrawal.",
    s: "Pharmacology"
  },
  {
    q: "A post-transplant patient on tacrolimus is prescribed fluconazole for a fungal infection. What is the expected impact on tacrolimus levels?",
    o: ["Fluconazole inhibits CYP3A4, significantly increasing tacrolimus levels and toxicity risk", "Fluconazole has no effect on tacrolimus metabolism", "Fluconazole induces CYP3A4, decreasing tacrolimus levels below therapeutic range", "Fluconazole displaces tacrolimus from albumin binding without clinical significance"],
    a: 0,
    r: "Fluconazole is a moderate to potent inhibitor of CYP3A4, the primary enzyme responsible for tacrolimus metabolism. Co-administration significantly increases tacrolimus plasma concentrations, potentially causing nephrotoxicity, neurotoxicity, and hyperglycemia. Tacrolimus dose reduction (typically by 50%) and frequent trough level monitoring are required when fluconazole is initiated. This is a clinically critical interaction in transplant patients.",
    s: "Pharmacology"
  },
  // ===== BIOLOGICS (Questions 73-78) =====
  {
    q: "A nurse practitioner is prescribing adalimumab (Humira) for rheumatoid arthritis. What screening must be completed before initiation?",
    o: ["Tuberculosis screening with tuberculin skin test or interferon-gamma release assay, and hepatitis B serology", "No screening is required before starting biologic therapy", "Echocardiogram and cardiac stress test", "Genetic testing for autoimmune susceptibility"],
    a: 0,
    r: "Anti-TNF biologics including adalimumab carry a risk of reactivating latent tuberculosis and hepatitis B due to their immunosuppressive mechanism. TB screening (TST or IGRA) and hepatitis B serology (HBsAg, anti-HBc, anti-HBs) are mandatory before initiation. If latent TB is detected, treatment must be started at least one month before biologic therapy. HBV reactivation can cause fulminant hepatitis. Cardiac and genetic screening are not standard pre-biologic requirements.",
    s: "Pharmacology"
  },
  {
    q: "A patient on infliximab (Remicade) for Crohn disease develops fever, chills, and urticaria during an infusion. The nurse practitioner recognizes this as:",
    o: ["An infusion reaction requiring slowing or stopping the infusion and administering antihistamines and corticosteroids", "An expected harmless response to biologic therapy that requires no intervention", "An anaphylactic reaction requiring immediate epinephrine and discontinuation of all future infusions", "A sign that the medication is working effectively"],
    a: 0,
    r: "Infusion reactions are a known complication of IV biologic therapy, occurring in approximately 5-10% of infliximab infusions. Mild to moderate reactions (fever, chills, urticaria, headache) can be managed by slowing or temporarily stopping the infusion and administering diphenhydramine, acetaminophen, and/or corticosteroids. Premedication with these agents can prevent future reactions. True anaphylaxis (hypotension, bronchospasm, angioedema) requires epinephrine and permanent discontinuation.",
    s: "Pharmacology"
  },
  {
    q: "A patient with moderate-to-severe psoriasis is being considered for secukinumab (Cosentyx), an IL-17A inhibitor. What infection risk should the nurse practitioner counsel the patient about?",
    o: ["Increased risk of mucocutaneous candidiasis due to IL-17 pathway inhibition", "Increased risk of urinary tract infections due to renal immunosuppression", "No increased infection risk as IL-17 inhibitors do not affect immunity", "Increased risk of pneumococcal pneumonia requiring prophylactic antibiotics"],
    a: 0,
    r: "IL-17A plays a critical role in mucocutaneous defense against Candida species. Inhibition of this pathway with secukinumab increases the risk of oral and vulvovaginal candidiasis. Patients should be counseled about symptoms of candidal infections and know to seek treatment promptly. The IL-17 pathway also plays a role in defense against extracellular bacteria, but mucocutaneous candidiasis is the most clinically relevant infection risk. Prophylactic antibiotics are not routinely required.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is managing a patient with severe asthma on omalizumab (Xolair), an anti-IgE monoclonal antibody. What is the most serious risk associated with this medication?",
    o: ["Anaphylaxis, which can occur at any time during treatment and requires observation after each injection", "Hepatic failure requiring liver transplantation", "Severe hyperglycemia and diabetic ketoacidosis", "Progressive multifocal leukoencephalopathy"],
    a: 0,
    r: "Omalizumab carries a black box warning for anaphylaxis, which can occur after any dose, even in patients who have previously tolerated the medication. Anaphylaxis has been reported up to 24 hours after injection. Patients must be observed in the clinical setting for an appropriate period after each injection, and self-injectable epinephrine must be prescribed. The risk does not diminish with repeated dosing. Hepatic failure, hyperglycemia, and PML are not associated with omalizumab.",
    s: "Pharmacology"
  },
  {
    q: "A patient on rituximab (Rituxan) for rheumatoid arthritis requires influenza vaccination. What vaccine-related consideration is most important?",
    o: ["Live vaccines are contraindicated, and inactivated vaccine efficacy may be reduced due to B-cell depletion", "All vaccines are contraindicated during rituximab therapy", "Vaccines are more effective during rituximab therapy due to enhanced immune response", "Only live vaccines should be administered during active immunosuppression"],
    a: 0,
    r: "Rituximab depletes CD20-positive B cells, which are essential for humoral immune responses. Live vaccines are absolutely contraindicated due to the risk of vaccine-derived infection in immunosuppressed patients. Inactivated vaccines can be given but may have reduced efficacy because B-cell depletion impairs antibody production. Ideally, vaccinations should be completed at least 4 weeks before rituximab initiation or given at least 6 months after the last rituximab dose to maximize vaccine response.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is managing a patient with ulcerative colitis on vedolizumab (Entyvio), a gut-selective integrin inhibitor. What is the advantage of its gut-selective mechanism?",
    o: ["It targets alpha-4-beta-7 integrin selectively in the GI tract, reducing systemic immunosuppression compared to other biologics", "It provides systemic immunosuppression equivalent to anti-TNF agents", "It has no immunosuppressive properties and works purely through anti-inflammatory mechanisms", "It targets all integrin receptors throughout the body equally"],
    a: 0,
    r: "Vedolizumab selectively binds alpha-4-beta-7 integrin, which is specifically expressed on gut-homing lymphocytes. This gut-selective mechanism reduces lymphocyte trafficking to the intestinal mucosa without broadly suppressing systemic immunity, resulting in a lower risk of opportunistic infections compared to systemic immunosuppressants like anti-TNF agents. It does still carry some infection risk and is immunomodulatory, but the gut selectivity is its distinguishing pharmacological advantage.",
    s: "Pharmacology"
  },
  // ===== ANTICOAGULANT BRIDGING (Questions 79-84) =====
  {
    q: "A patient on warfarin for a mechanical mitral valve requires elective knee replacement surgery. What is the appropriate bridging anticoagulation strategy?",
    o: ["Stop warfarin 5 days before surgery and bridge with therapeutic-dose LMWH, holding the last dose 24 hours preoperatively", "Continue warfarin through surgery without interruption", "Stop warfarin the morning of surgery with no bridging anticoagulation", "Switch to aspirin alone during the perioperative period"],
    a: 0,
    r: "Patients with mechanical heart valves are at high thrombotic risk and require bridging anticoagulation when warfarin is interrupted for surgery. Warfarin should be stopped 5 days before surgery to allow INR to normalize. Therapeutic-dose LMWH is started when INR falls below the therapeutic range and held 24 hours before surgery. Postoperatively, LMWH is resumed when hemostasis is achieved and warfarin restarted. Aspirin alone provides insufficient anticoagulation for mechanical valves.",
    s: "Pharmacology"
  },
  {
    q: "A patient on apixaban for non-valvular atrial fibrillation with a CHA2DS2-VASc score of 2 requires a dental extraction. What is the recommended perioperative anticoagulation management?",
    o: ["Hold apixaban for 24-48 hours before the procedure with no bridging required", "Continue apixaban without interruption as dental procedures have minimal bleeding risk", "Stop apixaban 7 days before the procedure and bridge with LMWH", "Switch to warfarin 2 weeks before the procedure for better perioperative control"],
    a: 0,
    r: "For patients on DOACs undergoing low-bleeding-risk procedures like dental extractions, apixaban should be held for 24-48 hours preoperatively (at least 2 half-lives). Bridging with LMWH is not required for DOACs because they have short half-lives and predictable pharmacokinetics allowing rapid offset and onset. A 7-day hold is excessively long. While some very minor dental procedures may be done without holding, standard practice for extractions is to hold the DOAC.",
    s: "Pharmacology"
  },
  {
    q: "A patient on dabigatran requires emergency reversal for life-threatening intracranial hemorrhage. Which reversal agent should the nurse practitioner order?",
    o: ["Idarucizumab (Praxbind) 5 g IV as a specific reversal agent for dabigatran", "Vitamin K 10 mg IV for warfarin reversal protocol", "Protamine sulfate for heparin reversal", "Fresh frozen plasma as a universal anticoagulant reversal"],
    a: 0,
    r: "Idarucizumab is a humanized monoclonal antibody fragment that specifically and immediately reverses the anticoagulant effect of dabigatran by binding to it with 350 times greater affinity than thrombin. The standard dose is 5 g IV (two 2.5 g vials). Vitamin K reverses warfarin only. Protamine reverses heparin. FFP has limited efficacy against direct thrombin inhibitors. Idarucizumab is the only FDA-approved specific reversal agent for dabigatran.",
    s: "Pharmacology"
  },
  {
    q: "A patient on rivaroxaban presents with major gastrointestinal bleeding requiring reversal. Which agent is indicated?",
    o: ["Andexanet alfa (Andexxa) as a specific reversal agent for Factor Xa inhibitors", "Idarucizumab for universal DOAC reversal", "Vitamin K for oral anticoagulant reversal", "Desmopressin for platelet function enhancement"],
    a: 0,
    r: "Andexanet alfa is a recombinant modified Factor Xa protein that acts as a decoy, binding and sequestering Factor Xa inhibitors (rivaroxaban, apixaban, edoxaban) to reverse their anticoagulant effect. Idarucizumab is specific to dabigatran only. Vitamin K reverses warfarin but not DOACs. Desmopressin enhances platelet adhesion and is used for von Willebrand disease and uremic bleeding but does not reverse Factor Xa inhibitors.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is managing perioperative anticoagulation for a patient on warfarin with atrial fibrillation and a CHA2DS2-VASc score of 1. The patient requires a colonoscopy with possible polypectomy. What bridging decision is appropriate?",
    o: ["No bridging anticoagulation is needed as the thrombotic risk is low", "Bridge with therapeutic-dose LMWH due to the procedure's bleeding risk", "Bridge with unfractionated heparin infusion starting 3 days before the procedure", "Continue warfarin without interruption and perform the procedure with an elevated INR"],
    a: 0,
    r: "Bridging anticoagulation is generally not recommended for patients with atrial fibrillation at low thrombotic risk (CHA2DS2-VASc score 0-4 without prior stroke or mechanical valve). The BRIDGE trial demonstrated that forgoing bridging in these patients did not increase thromboembolic events but significantly reduced major bleeding. Warfarin should still be held 5 days before the procedure to allow INR normalization. Continuing with elevated INR increases procedure-related bleeding risk.",
    s: "Pharmacology"
  },
  {
    q: "A patient on therapeutic LMWH bridging is scheduled for spinal anesthesia. What is the minimum time interval between the last LMWH dose and neuraxial needle placement?",
    o: ["At least 24 hours for therapeutic-dose LMWH to minimize spinal hematoma risk", "4 hours is sufficient for any LMWH dose", "No waiting period is required for LMWH before spinal procedures", "At least 72 hours for complete drug elimination"],
    a: 0,
    r: "For therapeutic-dose LMWH (1 mg/kg every 12 hours or 1.5 mg/kg daily), a minimum interval of 24 hours between the last dose and neuraxial needle placement is required to reduce the risk of spinal epidural hematoma, a devastating complication that can cause permanent paralysis. For prophylactic-dose LMWH, a minimum of 12 hours is recommended. Four hours is insufficient for LMWH elimination. A 72-hour wait is unnecessarily conservative and increases thrombotic risk.",
    s: "Pharmacology"
  },
  // ===== PSYCHOTROPIC PRESCRIBING (Questions 85-92) =====
  {
    q: "A nurse practitioner is initiating an antipsychotic for a patient with schizophrenia. The patient has a family history of diabetes and a BMI of 32. Which antipsychotic carries the lowest metabolic risk?",
    o: ["Aripiprazole due to its relatively weight-neutral profile and lower metabolic effects", "Olanzapine which has the most favorable metabolic profile", "Clozapine which does not affect glucose metabolism", "Quetiapine which promotes weight loss"],
    a: 0,
    r: "Aripiprazole is a partial dopamine agonist with a relatively weight-neutral profile and lower risk of metabolic syndrome compared to other atypical antipsychotics. Olanzapine and clozapine have the highest risk of weight gain, hyperglycemia, and dyslipidemia among all antipsychotics. Quetiapine also carries significant metabolic risk and weight gain. In patients with pre-existing metabolic risk factors, aripiprazole or ziprasidone are preferred choices.",
    s: "Pharmacology"
  },
  {
    q: "A patient on venlafaxine 225 mg daily for major depressive disorder wishes to discontinue therapy. What tapering strategy should the nurse practitioner implement?",
    o: ["Gradual dose reduction over several weeks to months to prevent discontinuation syndrome", "Abrupt discontinuation as SNRIs do not cause withdrawal", "Halve the dose and stop after one week", "Switch immediately to fluoxetine at full dose without any taper"],
    a: 0,
    r: "Venlafaxine has one of the highest risks of discontinuation syndrome among antidepressants due to its short half-life. Symptoms include dizziness, nausea, headache, irritability, paresthesias (brain zaps), insomnia, and flu-like symptoms. Gradual tapering over weeks to months is essential, typically reducing by 37.5-75 mg every 1-2 weeks. Cross-tapering with fluoxetine (which has a long half-life) may be used for severe cases but should be done carefully under supervision.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is prescribing bupropion for a patient with depression. Which comorbid condition is an absolute contraindication to bupropion use?",
    o: ["Seizure disorder due to bupropion's dose-dependent seizure risk", "Hypertension requiring medication management", "Obesity with a BMI of 30", "Tobacco use disorder"],
    a: 0,
    r: "Bupropion lowers the seizure threshold in a dose-dependent manner and is absolutely contraindicated in patients with seizure disorders, current or prior bulimia or anorexia nervosa, and concurrent use of other medications that lower the seizure threshold. Bupropion does not cause weight gain (making it useful in obesity) and is FDA-approved for smoking cessation (Zyban). Hypertension should be monitored as bupropion can cause modest BP elevation, but it is not an absolute contraindication.",
    s: "Pharmacology"
  },
  {
    q: "A 72-year-old patient with insomnia and mild cognitive impairment asks for a sleep medication. Which agent should the nurse practitioner avoid due to anticholinergic burden?",
    o: ["Diphenhydramine due to its strong anticholinergic effects increasing delirium and cognitive decline risk", "Melatonin 3 mg at bedtime", "Trazodone 25-50 mg at bedtime", "Cognitive behavioral therapy for insomnia as first-line treatment"],
    a: 0,
    r: "Diphenhydramine is a first-generation antihistamine with strong anticholinergic properties. In elderly patients, particularly those with cognitive impairment, anticholinergic medications increase the risk of delirium, cognitive decline, falls, urinary retention, and constipation. The Beers Criteria strongly recommend avoiding anticholinergic medications in older adults. Melatonin and low-dose trazodone have more favorable safety profiles. CBT-I is the recommended first-line treatment for chronic insomnia.",
    s: "Pharmacology"
  },
  {
    q: "A patient with bipolar I disorder requires mood stabilizer therapy. The nurse practitioner considers valproic acid. What is the most important monitoring parameter specific to female patients of childbearing age?",
    o: ["Pregnancy testing and contraception counseling due to high teratogenic risk including neural tube defects", "Serum iron levels due to risk of iron deficiency anemia", "Bone density screening due to risk of osteoporosis", "Visual field testing due to risk of retinal toxicity"],
    a: 0,
    r: "Valproic acid is a known teratogen with the highest risk among antiepileptic drugs for neural tube defects (spina bifida, occurring in 1-2% of exposed pregnancies), craniofacial abnormalities, and neurodevelopmental disorders including decreased IQ. All females of childbearing potential must have pregnancy testing before initiation and reliable contraception counseling. Valproic acid also causes polycystic ovarian syndrome and menstrual irregularities. These reproductive risks make it a second-line choice in women of childbearing age.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is managing a patient on a stable dose of clozapine who reports starting to smoke cigarettes. How does smoking affect clozapine pharmacokinetics?",
    o: ["Smoking induces CYP1A2, increasing clozapine metabolism and potentially reducing therapeutic levels", "Smoking has no effect on clozapine levels", "Smoking inhibits CYP1A2, increasing clozapine levels and toxicity risk", "Smoking changes clozapine absorption from the GI tract"],
    a: 0,
    r: "Polycyclic aromatic hydrocarbons in tobacco smoke are potent inducers of CYP1A2, the primary enzyme responsible for clozapine metabolism. Smoking initiation can decrease clozapine plasma levels by 30-50%, potentially causing loss of symptom control and psychiatric relapse. Conversely, smoking cessation can cause a rapid increase in clozapine levels with toxicity risk. Dose adjustments and level monitoring are required when smoking status changes. This interaction is with combustion products, not nicotine.",
    s: "Pharmacology"
  },
  {
    q: "A patient on an SSRI presents with hyperthermia (40.1 degrees Celsius), muscle rigidity, altered mental status, and autonomic instability. The nurse practitioner suspects serotonin syndrome. What is the first-line pharmacological treatment?",
    o: ["Cyproheptadine as a serotonin antagonist after discontinuing all serotonergic agents", "Dantrolene for muscle rigidity", "Bromocriptine for dopamine receptor stimulation", "Naloxone for opioid antagonism"],
    a: 0,
    r: "Serotonin syndrome is a potentially life-threatening condition caused by excessive serotonergic activity. All serotonergic agents must be discontinued immediately. Cyproheptadine, a serotonin receptor antagonist (5-HT2A), is the specific antidote given orally or via nasogastric tube. Supportive care includes IV fluids, cooling, and benzodiazepines for agitation. Dantrolene is used for malignant hyperthermia and neuroleptic malignant syndrome. Bromocriptine is for NMS. Naloxone reverses opioids.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is prescribing an antidepressant for a 16-year-old adolescent with moderate depression. What critical safety counseling must accompany the prescription?",
    o: ["Black box warning for increased risk of suicidal ideation and behavior in children and adolescents under 25", "No special precautions are needed for adolescents taking antidepressants", "Antidepressants eliminate all suicidal ideation immediately upon initiation", "The medication should only be taken during school days"],
    a: 0,
    r: "All antidepressants carry an FDA black box warning for increased risk of suicidal thoughts and behaviors in children, adolescents, and young adults under 25, particularly during the first few months of treatment and during dose changes. Close monitoring is required weekly for the first 4 weeks, biweekly for the next 4 weeks, and at 12 weeks. Parents and caregivers should be educated about warning signs. This does not mean antidepressants are contraindicated in youth; untreated depression also carries suicide risk.",
    s: "Pharmacology"
  },
  // ===== HORMONAL THERAPY (Questions 93-100) =====
  {
    q: "A 52-year-old postmenopausal female within 10 years of menopause onset presents with severe vasomotor symptoms. She has no contraindications to hormone therapy. What is the recommended regimen?",
    o: ["Combined estrogen plus progestogen therapy to prevent endometrial hyperplasia in a woman with an intact uterus", "Estrogen-only therapy regardless of uterine status", "Progestogen-only therapy for vasomotor symptom relief", "Testosterone replacement as first-line for menopausal symptoms"],
    a: 0,
    r: "In postmenopausal women with an intact uterus, combined estrogen-progestogen therapy is required because unopposed estrogen significantly increases the risk of endometrial hyperplasia and carcinoma. The progestogen component protects the endometrium. Estrogen-only therapy is appropriate only for women who have had a hysterectomy. Progestogen alone has limited efficacy for vasomotor symptoms. Testosterone is not first-line for menopausal vasomotor symptoms.",
    s: "Pharmacology"
  },
  {
    q: "A 48-year-old female with a history of estrogen receptor-positive breast cancer experiences severe menopausal hot flashes. Which non-hormonal pharmacotherapy should the nurse practitioner prescribe?",
    o: ["Venlafaxine or paroxetine for vasomotor symptom reduction without estrogenic activity", "Conjugated equine estrogen for rapid symptom relief", "Oral contraceptive pills for hormonal regulation", "Clonidine patch as first-line non-hormonal therapy"],
    a: 0,
    r: "In women with estrogen receptor-positive breast cancer, systemic estrogen therapy is contraindicated. SNRIs (venlafaxine) and SSRIs (paroxetine, specifically Brisdelle which is FDA-approved for this indication) have demonstrated efficacy for vasomotor symptoms without estrogenic activity. Clonidine and gabapentin are also options but are generally considered second-line due to side effects. If the patient is on tamoxifen, paroxetine should be avoided due to CYP2D6 inhibition reducing tamoxifen efficacy.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is prescribing levothyroxine for a patient with newly diagnosed hypothyroidism. What instruction regarding medication administration is essential?",
    o: ["Take on an empty stomach 30-60 minutes before breakfast with water only, separated from calcium and iron by 4 hours", "Take with meals for better absorption", "Take at bedtime with a calcium supplement", "Take with coffee to enhance alertness"],
    a: 0,
    r: "Levothyroxine absorption is significantly reduced by food, calcium, iron, aluminum-containing antacids, and proton pump inhibitors. It should be taken on an empty stomach 30-60 minutes before breakfast (or at bedtime if 3+ hours after the last meal) with water only. Calcium and iron supplements must be separated by at least 4 hours. Coffee can reduce absorption by up to 30%. Consistent timing is important for stable thyroid levels. TSH should be rechecked 6-8 weeks after dose changes.",
    s: "Pharmacology"
  },
  {
    q: "A 35-year-old female with polycystic ovarian syndrome (PCOS) presents with hirsutism and irregular menses. She does not desire pregnancy. Which medication combination addresses both concerns?",
    o: ["Combined oral contraceptive pill with spironolactone for antiandrogen effect", "Metformin alone for all PCOS manifestations", "Clomiphene citrate for cycle regulation", "Progesterone-only pill for hirsutism reduction"],
    a: 0,
    r: "Combined oral contraceptives suppress ovarian androgen production, regulate menstrual cycles, and protect the endometrium from hyperplasia in PCOS. Spironolactone acts as an androgen receptor antagonist, reducing hirsutism. Together they address the key concerns of irregular menses and hirsutism. Reliable contraception is essential with spironolactone due to its teratogenic potential. Metformin addresses insulin resistance but has limited effect on hirsutism. Clomiphene is for ovulation induction. Progesterone-only pills do not reduce androgens.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is managing a transgender male patient on testosterone therapy. Which monitoring parameters are essential during follow-up?",
    o: ["Hematocrit/hemoglobin, lipid panel, hepatic function tests, and screening for polycythemia", "No monitoring is required for testosterone therapy", "Annual bone density testing only", "Weekly serum testosterone levels only"],
    a: 0,
    r: "Testosterone therapy requires regular monitoring for polycythemia (the most common adverse effect, with hematocrit potentially exceeding 54%), dyslipidemia, hepatic function abnormalities, and cardiovascular risk factors. Hematocrit should be checked at 3, 6, and 12 months after initiation, then annually. Testosterone levels guide dose adjustments. Lipid panels and liver function tests should be monitored periodically. Annual bone density testing is not the primary monitoring concern in patients on testosterone.",
    s: "Pharmacology"
  },
  {
    q: "A 62-year-old male with metastatic prostate cancer is started on leuprolide (Lupron), a GnRH agonist. What initial adverse effect should the nurse practitioner anticipate and manage?",
    o: ["Testosterone flare during the first 1-2 weeks causing potential worsening of symptoms, requiring antiandrogen cover", "Immediate testosterone suppression with rapid symptom improvement", "Severe hypoglycemia requiring glucose monitoring", "Renal failure requiring dose reduction"],
    a: 0,
    r: "GnRH agonists like leuprolide cause an initial surge in LH and FSH release (flare effect) during the first 1-2 weeks of therapy, leading to a transient increase in testosterone levels. In patients with metastatic prostate cancer, this can cause tumor flare with bone pain, urinary obstruction, or spinal cord compression. An antiandrogen (bicalutamide, flutamide) should be started before or concurrently with the GnRH agonist to block the flare effect. GnRH antagonists (degarelix) avoid this flare.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old female on long-term aromatase inhibitor therapy (letrozole) for breast cancer reports progressive joint pain and stiffness. What is the nurse practitioner's assessment of these symptoms?",
    o: ["Aromatase inhibitor-associated musculoskeletal syndrome, a known class effect occurring in up to 50% of patients", "An unrelated rheumatologic condition requiring referral without considering medication effects", "A sign of disease progression requiring immediate oncology referral", "An allergic reaction to letrozole requiring immediate discontinuation"],
    a: 0,
    r: "Aromatase inhibitor-associated musculoskeletal syndrome (AIMSS) is a well-recognized adverse effect of aromatase inhibitors, affecting up to 50% of patients. It manifests as arthralgia, joint stiffness, myalgia, and reduced grip strength, typically within the first few months of therapy. It is caused by estrogen deprivation effects on joints and tendons. Management includes exercise, NSAIDs, vitamin D supplementation, or switching to a different aromatase inhibitor. It is not an allergy or disease progression.",
    s: "Pharmacology"
  },
];
