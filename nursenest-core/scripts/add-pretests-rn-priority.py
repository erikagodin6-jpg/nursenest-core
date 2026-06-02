#!/usr/bin/env python3
"""Add 5-question pretests to NCLEX-RN lessons missing them — highest-impact fix."""
import json, os
CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

def Q(q, opts, correct, rationale):
    return {"question": q, "options": opts, "correct": correct, "rationale": rationale}

# Targeted pretests for NCLEX-RN lessons near the 80-90 threshold
PRETESTS = {
"us-rn-copd-respiratory": [
    Q("A patient with COPD has SpO₂ 89% on room air and is comfortable at rest. Which oxygen delivery device and target is most appropriate?",
      ["100% non-rebreather mask to correct the hypoxemia","2L nasal cannula with target SpO₂ 88–92%","6L nasal cannula to reach SpO₂ 95–98%","BiPAP at FiO₂ 40% immediately"],1,
      "COPD patients with chronic CO₂ retention use a hypoxic drive to breathe. Target SpO₂ is 88–92% — not the 94–98% used for most patients. High-flow oxygen can suppress the hypoxic respiratory drive, causing CO₂ retention and respiratory depression. Low-flow NC with a specific target is correct."),
    Q("Which finding during a COPD exacerbation most urgently requires provider notification?",
      ["SpO₂ 91% on 2L nasal cannula","Increased sputum production from clear to yellow","Respiratory rate 28, using accessory muscles, and speaking in 2-word sentences","Bilateral expiratory wheezes on auscultation"],2,
      "Accessory muscle use with 2-word speech indicates severe respiratory distress and impending respiratory failure. This requires immediate escalation. SpO₂ 91% is within the acceptable COPD target range. Increased sputum and wheezes are expected findings in COPD exacerbation but do not indicate immediate crisis."),
    Q("A patient with COPD is being discharged on tiotropium (Spiriva) inhaler. Which instruction is most important?",
      ["Use the inhaler immediately when you feel shortness of breath","Rinse your mouth after each use to prevent oral candidiasis","This is a once-daily maintenance inhaler — use every morning regardless of symptoms","Take it with your albuterol inhaler at the same time for maximum effect"],2,
      "Tiotropium is a long-acting anticholinergic bronchodilator — a maintenance (controller) medication taken once daily every morning. It is NOT a rescue inhaler and is not used for acute dyspnea. Oral candidiasis prevention is important for inhaled corticosteroids (ICS), not anticholinergics. Tiotropium and albuterol are not given simultaneously."),
    Q("Which patient is at highest risk for COPD exacerbation requiring hospitalization?",
      ["A patient who quit smoking 5 years ago with FEV₁ 72%","A patient with FEV₁ 28%, daily inhaler use, and two hospitalizations in the past year","A patient with seasonal allergies and mild intermittent bronchospasm","A 45-year-old active smoker with no prior spirometry testing"],1,
      "FEV₁ <30% (GOLD Stage IV — Very Severe COPD) combined with frequent exacerbation history (≥2/year) is the highest-risk profile. Prior hospitalizations for COPD are the strongest predictor of future hospitalization. The patient with FEV₁ 72% has mild-moderate disease. Seasonal allergies describe asthma, not COPD."),
    Q("During a COPD exacerbation, the nurse administers albuterol via nebulizer. Which assessment finding 30 minutes later indicates the treatment was effective?",
      ["Respiratory rate decreased from 28 to 22 and SpO₂ increased to 91%","The patient reports the nebulization felt soothing and calming","Breath sounds became completely clear bilaterally","Blood pressure decreased from 148/92 to 126/78"],0,
      "Objective improvement after bronchodilator therapy includes decreased work of breathing (lower RR) and improved SpO₂. These are measurable, clinically significant endpoints. Complete clearing of breath sounds is unlikely and not the standard measure of bronchodilator response. Subjective comfort and blood pressure change are not primary endpoints for bronchodilator effectiveness."),
],

"us-rn-antibiotics": [
    Q("A patient is prescribed IV vancomycin. Which assessment finding requires the nurse to stop the infusion and notify the provider?",
      ["Urine output 45 mL over the past hour","Flushing of the face and neck with erythema spreading over the trunk 30 minutes into the infusion","BUN 22 mg/dL and creatinine 1.1 mg/dL","White cell count 14,000/mm³"],1,
      "Flushing, erythema, and pruritus during vancomycin infusion describes 'Red Man Syndrome' — a histamine-mediated reaction caused by too-rapid infusion. The infusion must be stopped and the rate slowed (vancomycin should infuse over ≥60 min, or 90-120 min for large doses). Diphenhydramine may be given. This is not a true allergy — the drug can be restarted at a slower rate."),
    Q("A patient has a known penicillin allergy (anaphylaxis). The provider orders cefazolin for a surgical prophylaxis. What is the nurse's priority action?",
      ["Administer the cefazolin since it is a different drug class","Hold the cefazolin and notify the provider of the documented penicillin anaphylaxis history","Give diphenhydramine 50 mg IV before administering the cefazolin","Administer and monitor closely for 15 minutes after infusion begins"],1,
      "Cefazolin is a first-generation cephalosporin. There is a cross-reactive allergy risk with penicillin, especially in patients with a history of anaphylaxis (most severe reaction). The nurse must notify the provider before administering. The provider may choose an alternative antibiotic (e.g., clindamycin or azithromycin). Administering without clarification risks anaphylaxis — a life-threatening event."),
    Q("A patient receiving IV ampicillin develops pruritus, urticaria, and throat tightness 10 minutes after the infusion begins. Which is the nurse's first action?",
      ["Administer diphenhydramine 25 mg IV as ordered","Stop the ampicillin infusion immediately","Notify the provider and document the reaction","Slow the infusion rate and monitor closely"],1,
      "Stopping the infusion immediately is the absolute first action in a suspected anaphylactic reaction. Continuing the infusion — even at a slower rate — allows continued allergen delivery and worsening of the reaction. After stopping: maintain IV access with NS, notify provider, administer epinephrine IM if severe (throat tightness indicates airway involvement), call rapid response if needed. Diphenhydramine alone is inadequate for anaphylaxis."),
    Q("Blood cultures are ordered for a patient with suspected sepsis. When should the nurse collect them?",
      ["After the first dose of antibiotics to allow baseline organism growth","Immediately before the first antibiotic dose, from two different sites","After administering antipyretics to reduce fever-related false positives","During the next peak fever to maximize organism detection"],1,
      "Blood cultures must be collected BEFORE antibiotics to maximize sensitivity. Post-antibiotic cultures may be falsely negative. Two sets from two different sites (e.g., peripheral IV and central line or two peripheral sticks) increase sensitivity to ~80-90%. However, in critically ill patients with suspected sepsis, cultures should not delay antibiotic administration beyond 30–60 minutes."),
    Q("A patient on IV gentamicin has a trough level of 3.2 mcg/mL (therapeutic trough: <1 mcg/mL). What is the nurse's priority action?",
      ["Continue the current dose and schedule — this is within the therapeutic range","Hold the next dose and notify the provider — this level indicates drug accumulation and nephrotoxicity/ototoxicity risk","Increase fluid intake to flush the kidneys and eliminate excess drug","Double the next dose to rapidly achieve a therapeutic level"],1,
      "Aminoglycoside (gentamicin) trough levels >2 mcg/mL indicate drug accumulation and significantly elevated risk of nephrotoxicity and ototoxicity. The therapeutic trough should be <1 mcg/mL. A trough of 3.2 requires holding the next dose and provider notification for dose adjustment. Continued dosing at this trough level causes permanent hearing loss and acute kidney injury."),
],

"us-rn-shock": [
    Q("A post-operative patient has BP 88/54, HR 136, RR 24, SpO₂ 96%, and urine output 15 mL over the past 2 hours. The surgical wound dressing has bloody drainage. Which type of shock is most consistent with these findings?",
      ["Distributive shock (septic)","Hypovolemic shock from hemorrhage","Cardiogenic shock from post-operative cardiac event","Obstructive shock from pulmonary embolism"],1,
      "Tachycardia, hypotension, oliguria, and active wound bleeding in a post-operative patient are classic signs of hypovolemic (hemorrhagic) shock. SpO₂ of 96% and the absence of fever or signs of infection make distributive shock less likely. Cardiogenic shock typically presents with crackles, elevated JVP, and poor perfusion without bleeding source. PE causes hypoxia and right heart strain."),
    Q("A patient in hypovolemic shock receives 2L of normal saline. Heart rate remains 122 and BP is 94/60. Which is the priority nursing action?",
      ["Document the response and continue monitoring for 30 more minutes","Notify the provider — inadequate response to initial fluid resuscitation may require blood products or vasopressors","Apply supplemental oxygen via face mask","Obtain a 12-lead ECG to rule out cardiac cause"],1,
      "An inadequate response to initial fluid resuscitation (persistent tachycardia and hypotension after 2L) indicates ongoing hemorrhage, need for blood products, or worsening shock state requiring vasopressor support. The provider must be notified immediately. Monitoring without escalation is dangerous — shock is a dynamic, worsening process without intervention."),
    Q("A patient with anaphylaxis has BP 72/40, HR 148, and severe bronchospasm. Which medication is the first-line priority?",
      ["Diphenhydramine 50 mg IV","Methylprednisolone 125 mg IV","Epinephrine 0.3–0.5 mg IM (1:1000)","Normal saline 2L IV bolus"],2,
      "Epinephrine (1:1000) IM in the lateral thigh is the first-line, life-saving treatment for anaphylaxis. It acts within minutes to reverse bronchospasm, hypotension, and angioedema through alpha and beta adrenergic effects. Diphenhydramine and steroids are adjunct therapies — important but secondary to epinephrine. IV fluids are given concurrently. Delay in epinephrine is associated with fatal outcomes."),
    Q("Which finding indicates a patient in early shock is transitioning to late (decompensated) shock?",
      ["Heart rate increasing from 88 to 110","Urine output decreasing from 60 to 35 mL/hour","Blood pressure dropping from 112/74 to 88/56","Respiratory rate increasing from 16 to 22"],2,
      "Hypotension (falling BP) is the hallmark of decompensated (late) shock — it indicates that compensatory mechanisms have failed. In early shock, vasoconstriction and tachycardia maintain blood pressure. When BP drops significantly, the patient has lost >25-30% of circulating volume or compensatory capacity. Tachycardia and decreased urine output are EARLY signs. Falling BP = decompensated = urgent escalation."),
    Q("A patient with septic shock requires vasopressors despite adequate fluid resuscitation. Which vasopressor is the first-line choice per Surviving Sepsis guidelines?",
      ["Dopamine","Epinephrine","Norepinephrine","Vasopressin"],2,
      "Norepinephrine (noradrenaline) is the first-line vasopressor for septic shock per the Surviving Sepsis Campaign guidelines. Its predominantly alpha-adrenergic effect increases systemic vascular resistance (SVR) to counteract the vasodilation of septic shock. Vasopressin is added as a second agent (0.03 units/min) if norepinephrine requirements are high. Dopamine is no longer preferred due to higher arrhythmia risk in septic shock."),
],

"us-rn-myocardial-infarction": [
    Q("A patient with an acute MI is prescribed aspirin 325 mg, nitroglycerin SL, IV morphine, and supplemental oxygen. Which medication does the nurse question before administering?",
      ["Aspirin — may worsen GI bleeding","Morphine — can cause respiratory depression","Supplemental oxygen in a non-hypoxic patient (SpO₂ ≥94%)","Nitroglycerin — causes hypotension"],2,
      "Current ACS guidelines (ACC/AHA) recommend against routine supplemental oxygen in patients with SpO₂ ≥90–94%. High-flow oxygen in non-hypoxic MI patients increases coronary vasoconstriction, may increase infarct size, and is associated with worse outcomes. Aspirin, morphine (carefully titrated), and nitroglycerin are appropriate for STEMI management. Oxygen is given only when SpO₂ <90%."),
    Q("A patient with STEMI has a BP of 88/60 before administration of SL nitroglycerin. The nurse's priority action is:",
      ["Administer the nitroglycerin as ordered and reassess in 5 minutes","Hold the nitroglycerin and notify the provider — hypotension contraindicates nitrate administration","Give the nitroglycerin at half the standard dose","Administer a fluid bolus, then give the nitroglycerin"],1,
      "Nitroglycerin causes vasodilation and significantly drops preload and afterload. In a hypotensive patient (SBP <90), nitroglycerin can cause fatal cardiovascular collapse. It is contraindicated with hypotension. The nurse holds the drug and notifies the provider urgently — this patient with STEMI and hypotension may be in cardiogenic shock requiring different management (vasopressors, IABP, emergent PCI)."),
    Q("Which ECG finding is most specific for an acute STEMI requiring emergent catheterization?",
      ["ST depression in leads V1-V4","New ST elevation ≥1mm in two or more contiguous leads","T-wave inversion in leads I and aVL","New left bundle branch block (LBBB) with symptoms"],1,
      "ST elevation ≥1mm in two or more contiguous leads is the defining ECG finding of STEMI — the indication for emergent reperfusion (PCI or thrombolytics). New LBBB with ischemic symptoms is treated as STEMI equivalent. ST depression indicates NSTEMI or demand ischemia (different management pathway). T-wave inversions represent ischemia but not acute STEMI."),
    Q("After percutaneous coronary intervention (PCI), a patient asks why they now need to take both aspirin and clopidogrel. The nurse's best explanation is:",
      ["Both drugs reduce cholesterol deposits in the stent","Dual antiplatelet therapy prevents stent thrombosis by blocking two different platelet activation pathways","One drug treats the stent and the other treats the artery around it","Together they reduce the risk of post-MI depression"],1,
      "Dual antiplatelet therapy (DAPT) — aspirin + P2Y12 inhibitor (clopidogrel, ticagrelor, or prasugrel) — prevents stent thrombosis by blocking two separate platelet activation mechanisms simultaneously. Aspirin inhibits thromboxane A₂ synthesis; P2Y12 inhibitors block ADP-mediated platelet activation. Together they reduce the risk of acute stent thrombosis from ~5% (aspirin alone) to <1%. DAPT is typically continued for 12 months after drug-eluting stent placement."),
    Q("A patient 2 days post-MI suddenly develops new onset severe chest pain, diaphoresis, and the nurse notes a new holosystolic murmur at the left sternal border. What is the most likely complication?",
      ["Dressler's syndrome (pericarditis)","Ventricular septal rupture (VSR)","Left ventricular aneurysm","Pulmonary embolism"],1,
      "New holosystolic murmur at the left sternal border 2–5 days post-MI with acute hemodynamic deterioration = ventricular septal rupture (VSR) until proven otherwise. This is a mechanical complication of MI where the infarcted septum tears, creating a left-to-right shunt. It is rapidly fatal without emergent surgical repair or catheter-based closure. Dressler's syndrome presents weeks later with fever and pericardial rub. LV aneurysm presents subacutely."),
],

"us-rn-hypertension": [
    Q("A patient's BP is 188/114 mmHg. They are alert, with a mild headache, but no visual changes, chest pain, or neurological symptoms. This finding is classified as:",
      ["Hypertensive emergency requiring IV nitroprusside immediately","Hypertensive urgency — requires prompt oral antihypertensive therapy and close follow-up","Stage 1 hypertension requiring medication initiation","Normal blood pressure variation in anxious patients"],1,
      "Hypertensive urgency = severe BP elevation (>180/120) WITHOUT evidence of acute target organ damage. Management is oral antihypertensive therapy with BP reduction over 24-48 hours (NOT rapid IV correction). Hypertensive emergency = same BP elevation WITH target organ damage (stroke, MI, acute HF, aortic dissection, hypertensive encephalopathy). Too-rapid BP reduction in urgency can cause stroke from relative hypoperfusion."),
    Q("A patient on enalapril (ACE inhibitor) develops a persistent dry cough. The nurse anticipates which change to their medication regimen?",
      ["The dose will be reduced to eliminate the cough side effect","The ACE inhibitor will be replaced with an ARB (e.g., losartan)","A cough suppressant will be added to continue enalapril","The medication will be discontinued without a replacement"],1,
      "ACE inhibitor-induced cough (caused by bradykinin accumulation) occurs in 10-20% of patients, disproportionately affecting patients of Asian descent. It is a class effect — switching to another ACE inhibitor will not resolve it. ARBs (angiotensin receptor blockers) provide equivalent BP reduction and cardiovascular protection without causing cough since they block angiotensin II receptors rather than inhibiting ACE. This is a standard management switch."),
    Q("Which combination of lifestyle modifications produces the greatest blood pressure reduction?",
      ["Reducing sodium to 2000 mg/day alone","DASH diet + weight loss 5-10% body weight + aerobic exercise 150 min/week","Smoking cessation + alcohol reduction to ≤2 drinks/day","Stress reduction through meditation and yoga"],1,
      "The combination of DASH diet (~10 mmHg reduction), weight loss (~1 mmHg per kg lost), and aerobic exercise (~4-8 mmHg reduction) produces the largest sustained BP reduction through complementary mechanisms. Sodium restriction adds ~4-6 mmHg. Smoking cessation reduces cardiovascular risk but has minimal direct BP effect. This combination can reduce BP by 15-20 mmHg — equivalent to medication in mild hypertension."),
    Q("A patient on hydrochlorothiazide (HCTZ) for hypertension reports muscle cramps, weakness, and constipation. Laboratory results show K⁺ 2.8 mEq/L. The nurse expects which medication adjustment?",
      ["HCTZ will be increased to accelerate fluid and electrolyte removal","Potassium chloride supplement will be added and HCTZ may be continued with closer monitoring","HCTZ will be discontinued and a beta-blocker substituted immediately","Calcium gluconate IV will be administered to counteract the potassium deficit"],1,
      "K⁺ 2.8 mEq/L = significant hypokalemia from thiazide-induced renal K⁺ wasting. Management: KCl supplementation (oral is preferred) and possible switch to a potassium-sparing diuretic (spironolactone) or combination with a K⁺-sparing agent. HCTZ may continue at a lower dose. IV calcium gluconate treats hyperkalemia, not hypokalemia. Increasing HCTZ worsens K⁺ loss. Beta-blocker switch does not address the electrolyte issue."),
    Q("A 68-year-old patient with hypertension, diabetes, and CKD (creatinine 1.8 mg/dL) requires antihypertensive medication. Which class is most appropriate as first-line therapy?",
      ["Calcium channel blocker (amlodipine)","ACE inhibitor or ARB","Thiazide diuretic","Beta-blocker"],1,
      "For patients with hypertension + diabetes + CKD, ACE inhibitors or ARBs are first-line because they provide renoprotection beyond blood pressure control — they reduce proteinuria, slow CKD progression, and have proven cardiovascular outcome benefit in this population. This is a class I recommendation from ACC/AHA and ADA guidelines. A creatinine of 1.8 is not a contraindication (ACE/ARBs are contraindicated when eGFR <30 in some protocols, but 1.8 mg/dL in a 68-year-old = estimated GFR ~35-40 mL/min — proceed with monitoring)."),
],
}

def load_catalog():
    with open(CATALOG, encoding='utf-8') as f:
        return json.load(f)

def save_catalog(data):
    with open(CATALOG, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def apply_pretests(catalog):
    added = 0
    for pw_id in ['us-rn-nclex-rn', 'ca-rn-nclex-rn']:
        for lesson in catalog['pathways'][pw_id]['lessons']:
            slug = lesson.get('slug', '')
            if slug in PRETESTS and not lesson.get('preTest'):
                lesson['preTest'] = PRETESTS[slug]
                print(f'  ADD preTest: {pw_id}/{slug}')
                added += 1
    return added

if __name__ == '__main__':
    cat = load_catalog()
    n = apply_pretests(cat)
    save_catalog(cat)
    print(f'\nAdded pretests to {n} lessons')
