import pg from "pg";
import crypto from "crypto";
const Pool = pg.Pool;
const pool = new Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });
function hash(s: string): string { return crypto.createHash("md5").update(s.toLowerCase().trim()).digest("hex"); }

interface Q {
  tier:string; exam:string; stem:string; options:string[]; correct:number; rationale:string;
  diff:number; bs:string; topic:string; cp:string; es:string; dr:Record<string,string>;
}

function q(e:string,bs:string,topic:string,d:number,stem:string,opts:string[],c:number,rat:string,cp:string,es:string,dr:Record<string,string>):Q {
  return {tier:"rpn",exam:e,stem,options:opts,correct:c,rationale:rat,diff:d,bs,topic,cp,es,dr};
}

const QS: Q[] = [
  // ===== PHARMACOLOGY (100) =====
  q("REX-PN","Pharmacology","Pharmacology",2,
    "A nurse is teaching a client about taking atorvastatin. The client asks when to take the medication. The nurse responds:",
    ["In the morning with breakfast","At bedtime, as cholesterol synthesis peaks at night","Only when cholesterol levels are elevated","With grapefruit juice for better absorption"],1,
    "Statins are most effective when taken at bedtime because hepatic cholesterol synthesis is highest during the night. However, some long-acting statins (atorvastatin, rosuvastatin) can be taken at any time due to their long half-life.",
    "Statins at bedtime: cholesterol synthesis peaks overnight. Atorvastatin/rosuvastatin have long half-lives and can be taken anytime, but bedtime is traditional.",
    "Statin timing: bedtime is the classic teaching. Also teach: avoid grapefruit, report muscle pain (rhabdomyolysis risk), monitor liver function.",
    {"0":"While atorvastatin can be taken at any time, the traditional recommendation is bedtime for optimal cholesterol synthesis inhibition.","2":"Statins are taken daily as prescribed, not only when levels are elevated; they require continuous therapy.","3":"Grapefruit juice inhibits CYP3A4 metabolism of statins, increasing drug levels and toxicity risk."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A client is prescribed ACE inhibitor therapy for heart failure. The nurse monitors for which common adverse effect?",
    ["Productive cough","Weight gain","Hyperkalemia and tachycardia","Constipation"],0,
    "ACE inhibitors commonly cause a persistent dry cough due to accumulation of bradykinin in the lungs. If the cough is intolerable, the provider may switch to an ARB (angiotensin receptor blocker), which does not cause cough.",
    "ACE inhibitor side effects: dry cough (bradykinin), hyperkalemia (monitor K+), first-dose hypotension, angioedema (rare but serious). ACE inhibitors end in '-pril.'",
    "ACE inhibitor cough: the most common reason for switching to an ARB. Also monitor potassium and renal function.",
    {"1":"ACE inhibitors may cause weight loss from reduced fluid retention, not weight gain.","2":"While hyperkalemia is a concern, tachycardia is not a typical ACE inhibitor side effect.","3":"Constipation is not associated with ACE inhibitor therapy."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A nurse is administering enoxaparin subcutaneously. Which site is preferred?",
    ["Deltoid muscle","Abdomen, at least 2 inches from the umbilicus","Vastus lateralis","Dorsal gluteal"],1,
    "Low-molecular-weight heparins like enoxaparin are administered subcutaneously into the abdomen, at least 2 inches from the umbilicus. Do not aspirate before injection or massage after injection to prevent bruising.",
    "Enoxaparin (LMWH): subcutaneous injection, abdominal site preferred, no aspiration, no massage, rotate sites. Monitor anti-Xa levels if needed.",
    "Enoxaparin administration: same rules as heparin SC - abdomen, no aspiration, no massage. Know the difference from unfractionated heparin monitoring.",
    {"0":"The deltoid is for IM injections; enoxaparin is given subcutaneously.","2":"The vastus lateralis is for IM injections; enoxaparin is a subcutaneous medication.","3":"The gluteal site is for IM injections and is not appropriate for enoxaparin."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client receiving gentamicin has a trough level drawn. The nurse understands that the trough level indicates:",
    ["The highest drug concentration in the blood","The lowest drug concentration before the next dose","The therapeutic efficacy of the drug","The rate of drug metabolism"],1,
    "Trough levels represent the lowest drug concentration, drawn just before the next dose. Peak levels represent the highest concentration, drawn 30-60 minutes after IV administration. Both are monitored to ensure therapeutic levels and prevent toxicity.",
    "Drug levels: trough = lowest (drawn before next dose), peak = highest (drawn after administration). Both are needed for aminoglycosides (gentamicin, tobramycin).",
    "Drug level timing: trough before the dose, peak after the dose. Trough too high = toxicity risk. Peak too low = subtherapeutic.",
    {"0":"The highest drug concentration is the peak level, not the trough.","2":"Therapeutic efficacy is determined by both peak and trough levels together, not the trough alone.","3":"Drug metabolism rate is determined by pharmacokinetic studies, not a single trough level."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A nurse is preparing to administer insulin. The client receives both NPH and regular insulin. Which is drawn up first?",
    ["NPH insulin is drawn first","Regular (clear) insulin is drawn first to prevent contamination","Either can be drawn first","They should never be mixed in the same syringe"],1,
    "When mixing insulins, always draw up regular (clear) insulin first to prevent contamination of the regular vial with NPH (cloudy) insulin. Remember: 'clear before cloudy.' NPH contamination in the regular vial would alter its onset.",
    "Insulin mixing: 'clear before cloudy' or 'RN' (Regular then NPH). Drawing clear first prevents contamination. Some insulins (glargine, detemir) cannot be mixed.",
    "Insulin mixing mnemonic: 'clear before cloudy' or 'Regular then NPH.' This prevents altering the rapid onset of regular insulin.",
    {"0":"Drawing NPH first would risk contaminating the regular insulin vial with NPH, altering onset times.","2":"The order matters to prevent cross-contamination; regular (clear) must always be drawn first.","3":"NPH and regular insulin can be mixed in the same syringe; some other insulin combinations cannot be mixed."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A nurse is teaching a client about ciprofloxacin. Which instruction is most important?",
    ["Take with a full glass of milk for stomach protection","Avoid dairy products and antacids within 2 hours of taking the medication","Take only when symptoms are present","Expect orange discoloration of urine"],1,
    "Fluoroquinolones (ciprofloxacin, levofloxacin) bind with divalent cations in dairy products, antacids (aluminum, magnesium), calcium, and iron, significantly reducing absorption. These products should be separated by at least 2 hours.",
    "Fluoroquinolone drug interactions: dairy, antacids, calcium, iron reduce absorption. Also report tendon pain (risk of tendon rupture). Avoid in children.",
    "Fluoroquinolone teaching: no dairy/antacids within 2 hours, report tendon pain, take with full glass of water, complete full course.",
    {"0":"Milk contains calcium that binds with ciprofloxacin, reducing absorption significantly.","2":"Antibiotics should be taken for the full prescribed course, not only when symptomatic.","3":"Orange urine is associated with rifampin, not ciprofloxacin."}),

  q("RPN-CAT","Pharmacology","Pharmacology",4,
    "A client on phenytoin has a serum level of 25 mcg/mL. The nurse should:",
    ["Administer the next scheduled dose","Hold the medication and assess for signs of toxicity","Increase the dose as the level appears subtherapeutic","Administer an additional loading dose"],1,
    "Therapeutic phenytoin level is 10-20 mcg/mL. A level of 25 mcg/mL is toxic. Signs include nystagmus (first sign), ataxia, slurred speech, and confusion. The nurse should hold the medication and notify the provider.",
    "Phenytoin therapeutic level: 10-20 mcg/mL. Toxicity signs progress: nystagmus (20-30), ataxia (30-40), seizures/coma (>40). Hold and notify for toxic levels.",
    "Phenytoin toxicity: nystagmus is the first sign. Hold the medication and assess for toxicity before notifying the provider.",
    {"0":"Administering the next dose at a toxic level would worsen toxicity and could cause seizures or cardiac arrest.","2":"25 mcg/mL is above the therapeutic range; the level is supratherapeutic, not subtherapeutic.","3":"A loading dose at a toxic level would cause severe toxicity."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A client is prescribed albuterol for asthma. The nurse teaches that the most common side effects include:",
    ["Drowsiness and weight gain","Tachycardia, tremors, and nervousness","Bradycardia and hypotension","Constipation and dry mouth"],1,
    "Albuterol is a beta-2 agonist that causes bronchodilation. Side effects result from beta-adrenergic stimulation: tachycardia, tremors, nervousness, and palpitations. These effects are usually transient and dose-dependent.",
    "Beta-2 agonist side effects: tachycardia, tremors, nervousness, hypokalemia. Albuterol is the rescue inhaler for acute bronchospasm.",
    "Albuterol side effects: cardiac and neuromuscular stimulation (tachycardia, tremors). These are expected and usually mild.",
    {"0":"Albuterol is a stimulant; it causes alertness and potential anxiety, not drowsiness.","2":"Albuterol causes tachycardia, not bradycardia; it stimulates beta-adrenergic receptors.","3":"Constipation and dry mouth are not typical albuterol side effects; they are associated with anticholinergic medications."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client is prescribed methotrexate for rheumatoid arthritis. The nurse should monitor which laboratory tests?",
    ["Blood glucose and hemoglobin A1C","Complete blood count and liver function tests","Thyroid function tests","Lipid panel and cardiac enzymes"],1,
    "Methotrexate can cause bone marrow suppression (monitor CBC: WBC, RBC, platelets) and hepatotoxicity (monitor liver function tests). Folic acid supplementation is typically prescribed to reduce side effects.",
    "Methotrexate monitoring: CBC (bone marrow suppression), LFTs (hepatotoxicity), renal function. Give folic acid to reduce toxicity.",
    "Methotrexate: monitor blood counts + liver function. Folic acid supplementation reduces side effects.",
    {"0":"Blood glucose and A1C are monitored for diabetes management, not methotrexate therapy.","2":"Thyroid function tests are not specifically indicated for methotrexate monitoring.","3":"Lipid panel and cardiac enzymes are not the primary monitoring parameters for methotrexate."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A nurse is administering IV potassium to a client with hypokalemia. Which safety measure is essential?",
    ["Administer undiluted for faster correction","Always dilute and administer via infusion pump, never IV push","Mix with dextrose solutions only","Administer in bolus if the level is critically low"],1,
    "IV potassium must ALWAYS be diluted and administered via infusion pump. It is NEVER given IV push as rapid administration causes fatal cardiac arrest. Maximum peripheral rate is typically 10 mEq/hour; cardiac monitoring is required for higher rates.",
    "IV potassium: NEVER IV push, always diluted, always via pump. Max 10 mEq/hr peripheral, 20 mEq/hr central with cardiac monitoring. Fatal if given too fast.",
    "IV potassium is one of the most dangerous medications. Three rules: never push, always dilute, always pump.",
    {"0":"Undiluted potassium is caustic to veins and dangerous; it must always be diluted.","2":"Potassium can be mixed with normal saline; it is not limited to dextrose solutions.","3":"Potassium should never be given as a bolus regardless of the severity of hypokalemia."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A client is prescribed prednisone for an autoimmune condition. The nurse teaches the client to:",
    ["Stop the medication abruptly when feeling better","Take the medication with food and not stop abruptly","Take on an empty stomach for better absorption","Double the dose if a dose is missed"],1,
    "Corticosteroids should be taken with food to reduce GI irritation. They must never be stopped abruptly as this can cause adrenal crisis. The dose should be tapered gradually under provider supervision.",
    "Corticosteroid teaching: take with food, never stop abruptly (taper), monitor glucose, report infections, avoid live vaccines, carry medical alert ID.",
    "Corticosteroid questions: two key points - take with food AND never stop abruptly. These are the most commonly tested aspects.",
    {"0":"Abrupt cessation of corticosteroids can cause life-threatening adrenal crisis; they must be tapered gradually.","2":"Corticosteroids should be taken with food to prevent GI ulceration, not on an empty stomach.","3":"Doubling a missed dose is not recommended; take the dose as soon as remembered or skip if close to the next dose."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client taking warfarin has an INR of 5.2. The nurse anticipates which intervention?",
    ["Administer additional warfarin","Hold warfarin and administer vitamin K as prescribed","Continue warfarin and recheck in 1 week","Increase the warfarin dose"],1,
    "An INR of 5.2 indicates excessive anticoagulation with high bleeding risk. Warfarin should be held, and vitamin K (phytonadione) administered to reverse the anticoagulant effect. For severe bleeding, fresh frozen plasma may be needed.",
    "Warfarin reversal: INR >4.5 without bleeding = hold warfarin + low-dose vitamin K. Active bleeding = hold warfarin + vitamin K + FFP or PCC.",
    "INR management: therapeutic 2-3, hold and monitor at 3-4.5, hold and give vitamin K at >4.5, FFP for active bleeding.",
    {"0":"Administering additional warfarin would further increase INR and bleeding risk.","2":"An INR of 5.2 is critically elevated; waiting a week could result in life-threatening hemorrhage.","3":"Increasing the dose would be dangerous; the INR needs to be reduced, not increased."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A nurse is preparing to give a client their first dose of an ACE inhibitor. Which precaution is most important?",
    ["Administer the first dose at bedtime or with the client lying down to prevent first-dose hypotension","Give the first dose with a high-sodium meal","Administer the first dose during exercise","Give the maximum dose immediately"],0,
    "First-dose hypotension is a well-known effect of ACE inhibitors. Administering the first dose at bedtime or with the client lying down minimizes the risk of syncope. Blood pressure should be monitored closely after the first dose.",
    "ACE inhibitor first-dose hypotension: start low, go slow. Administer first dose at bedtime or with client lying down. Monitor BP closely.",
    "ACE inhibitor initiation: first-dose hypotension is the primary concern. Start with a low dose at bedtime to minimize risk.",
    {"1":"High sodium counteracts the therapeutic effect of ACE inhibitors; sodium restriction is typically recommended.","2":"Exercise during first-dose administration increases fall risk from hypotension.","3":"Starting at maximum dose increases the risk and severity of first-dose hypotension."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A client on a calcium channel blocker such as amlodipine should be taught to avoid:",
    ["Walking and light exercise","Grapefruit and grapefruit juice","Eating bananas","Taking vitamins in the morning"],1,
    "Grapefruit juice inhibits CYP3A4 enzyme metabolism of many calcium channel blockers, increasing drug levels and the risk of hypotension and other adverse effects. Clients should avoid grapefruit products.",
    "Grapefruit interactions: inhibits CYP3A4 metabolism of many drugs including CCBs, statins, cyclosporine, and some benzodiazepines.",
    "Grapefruit juice + medications: know the major drug classes affected (CCBs, statins, immunosuppressants). Always ask about grapefruit intake.",
    {"0":"Walking and light exercise are beneficial and not contraindicated with calcium channel blockers.","2":"Bananas are high in potassium and are not specifically contraindicated with CCBs.","3":"Taking vitamins in the morning is not affected by calcium channel blocker therapy."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A nurse is monitoring a client receiving IV magnesium sulfate for preeclampsia. Which finding indicates magnesium toxicity?",
    ["Blood pressure of 140/90 mmHg","Respiratory rate of 10 breaths per minute and absent deep tendon reflexes","Heart rate of 80 bpm","Urine output of 40 mL/hour"],1,
    "Magnesium toxicity presents with respiratory depression (RR <12), absent DTRs, hypotension, and cardiac arrest. The antidote is calcium gluconate. Continuous monitoring of respiratory rate, DTRs, and urine output (>30 mL/hr) is essential.",
    "Magnesium sulfate toxicity: loss of DTRs (first sign), respiratory depression, cardiac arrest. Antidote: calcium gluconate. Monitor RR, DTRs, urine output.",
    "Mag sulfate monitoring triad: respiratory rate, DTRs, urine output. Lost DTRs = STOP infusion. Antidote = calcium gluconate.",
    {"0":"While BP monitoring is important, a BP of 140/90 does not indicate magnesium toxicity.","2":"A heart rate of 80 is normal and does not indicate toxicity.","3":"Urine output of 40 mL/hr is adequate; concern arises when output drops below 30 mL/hr."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A client is prescribed ondansetron for chemotherapy-induced nausea. The nurse teaches that this medication works by:",
    ["Blocking dopamine receptors in the brain","Blocking serotonin (5-HT3) receptors in the GI tract and chemoreceptor trigger zone","Stimulating gastric motility","Blocking histamine receptors"],1,
    "Ondansetron (Zofran) is a serotonin (5-HT3) receptor antagonist. It blocks serotonin receptors in the GI tract and the chemoreceptor trigger zone (CTZ) in the brainstem, effectively preventing nausea and vomiting.",
    "Ondansetron: 5-HT3 antagonist, most effective antiemetic for chemotherapy. Can prolong QT interval; monitor ECG in high-risk clients.",
    "Antiemetic drug classes: 5-HT3 antagonists (ondansetron) for chemo, dopamine antagonists (prochlorperazine) for general N/V, anticholinergics (scopolamine) for motion sickness.",
    {"0":"Dopamine receptor blocking is the mechanism of prochlorperazine and metoclopramide, not ondansetron.","2":"Metoclopramide stimulates gastric motility; ondansetron works on serotonin receptors.","3":"Histamine receptor blocking is the mechanism of promethazine and dimenhydrinate."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A client with depression is started on fluoxetine. The nurse teaches that therapeutic effects may take:",
    ["24 hours","2-4 weeks to become fully effective","6 months","Immediate relief is expected"],1,
    "SSRIs like fluoxetine (Prozac) require 2-4 weeks for full therapeutic effect because serotonin receptor downregulation must occur. The client should continue taking the medication even if immediate improvement is not noticed.",
    "SSRI onset: 2-4 weeks for full therapeutic effect. Suicidal ideation may increase initially as energy improves before mood lifts. Close monitoring during first weeks.",
    "Antidepressant onset: 2-4 weeks is the standard timeline. Monitor closely during the first 2 weeks for increased suicidal risk as energy returns before mood improves.",
    {"0":"24 hours is too soon; SSRIs require weeks for serotonin system modulation.","2":"6 months is excessive; therapeutic effects should be apparent within 2-4 weeks.","3":"Immediate relief is not expected with SSRIs; clients must be counseled about the delayed onset."}),

  q("RPN-CAT","Pharmacology","Pharmacology",4,
    "A client on warfarin therapy asks about over-the-counter medications. Which should the client avoid?",
    ["Acetaminophen in recommended doses","NSAIDs such as ibuprofen and aspirin","Antacids","Multivitamins without vitamin K"],1,
    "NSAIDs (ibuprofen, naproxen) and aspirin have antiplatelet effects that, combined with warfarin's anticoagulant action, significantly increase bleeding risk. GI bleeding risk is particularly high. Acetaminophen is the recommended alternative for pain.",
    "Warfarin drug interactions: NSAIDs, aspirin, antibiotics (increase effect), vitamin K foods (decrease effect). Acetaminophen is the safe alternative for pain.",
    "Warfarin + NSAIDs = dangerous bleeding risk. Always recommend acetaminophen as the pain reliever alternative.",
    {"0":"Acetaminophen in recommended doses is generally safe with warfarin and is the preferred analgesic.","2":"Most antacids do not significantly interact with warfarin, though some may affect absorption.","3":"Multivitamins without vitamin K are generally safe; those WITH vitamin K would affect warfarin."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A nurse is administering an ophthalmic medication. Which technique is correct?",
    ["Drop the medication directly onto the cornea","Pull down the lower eyelid to form a conjunctival sac and instill the drop there","Apply pressure to the eyeball after instillation","Have the client look directly at the dropper"],1,
    "Ophthalmic medications are instilled into the lower conjunctival sac to prevent corneal damage. After instillation, apply gentle pressure to the inner canthus (nasolacrimal duct) for 1-2 minutes to prevent systemic absorption.",
    "Eye drop technique: lower conjunctival sac, do not touch dropper to eye, apply pressure to inner canthus (nasolacrimal occlusion) for 1-2 minutes.",
    "Eye drop administration: conjunctival sac + nasolacrimal occlusion. These two steps are the most commonly tested aspects.",
    {"0":"Direct application onto the cornea can cause corneal damage and discomfort.","2":"Pressure should be applied to the inner canthus (nasolacrimal duct), not the eyeball.","3":"Looking at the dropper increases the blink reflex and risk of dropper contamination; the client should look up."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client receiving chemotherapy develops a neutrophil count of 800/mm3. The nurse should:",
    ["Encourage visitors to boost the client's mood","Implement neutropenic precautions: private room, no fresh flowers, meticulous hand hygiene","Allow the client to eat raw fruits and vegetables","Administer live vaccines for protection"],1,
    "Neutropenia (<1,500/mm3) increases infection risk. Severe neutropenia (<500/mm3) requires strict precautions: private room, no fresh flowers/plants (harbor fungi), low-bacteria diet (no raw foods), meticulous hand hygiene, and limiting visitors.",
    "Neutropenic precautions: private room, strict hand hygiene, no flowers/plants, cooked foods only, limit visitors, monitor for infection (fever may be the only sign).",
    "Neutropenia management: ANC <1,000 = implement precautions. ANC <500 = severe risk. Fever in neutropenic client = emergency cultures and antibiotics.",
    {"0":"Visitors should be limited and screened for illness to protect the immunocompromised client.","2":"Raw fruits and vegetables harbor bacteria and fungi; only cooked foods are safe during neutropenia.","3":"Live vaccines are absolutely contraindicated in immunocompromised clients."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A client is prescribed a transdermal fentanyl patch. The nurse teaches the client to:",
    ["Apply heat to the patch site for faster absorption","Apply to a flat, non-hairy area; avoid heat sources as they increase absorption dangerously","Cut the patch in half if the dose is too strong","Apply multiple patches at the same site"],1,
    "Transdermal fentanyl patches deliver medication through the skin. Heat sources (heating pads, hot baths, fever) increase skin perfusion and drug absorption, potentially causing fatal overdose. Patches should not be cut, and sites should be rotated.",
    "Fentanyl patch safety: no heat near patch site, do not cut patches, rotate application sites, dispose of used patches safely (fold sticky sides together).",
    "Transdermal fentanyl: heat = increased absorption = overdose risk. This is the most important safety teaching point.",
    {"0":"Heat dramatically increases fentanyl absorption from the patch, potentially causing fatal respiratory depression.","2":"Cutting a transdermal patch destroys the rate-controlling membrane, releasing the full dose at once.","3":"Applying multiple patches at the same site increases local absorption and causes skin irritation."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A nurse is teaching a client about taking ferrous sulfate (iron supplement). Which instruction is correct?",
    ["Take with milk for easier absorption","Take on an empty stomach with vitamin C (orange juice) to enhance absorption","Expect light-colored stools as a normal effect","Take at the same time as antacids"],1,
    "Iron is best absorbed on an empty stomach. Vitamin C enhances iron absorption by converting ferric iron to the more absorbable ferrous form. Dark/black stools are a normal, expected effect of iron therapy.",
    "Iron supplements: take on empty stomach with vitamin C, expect dark stools, take liquid through straw (prevents tooth staining), separate from dairy/antacids/tetracyclines.",
    "Iron supplement teaching: vitamin C enhances absorption, dairy/antacids decrease absorption, dark stools are normal.",
    {"0":"Milk and calcium-containing products decrease iron absorption by binding with iron.","2":"Iron causes dark or black stools, not light-colored stools; this is a normal expected finding.","3":"Antacids reduce iron absorption; they should be separated by at least 2 hours."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client is prescribed nitroglycerin ointment. The nurse teaches proper application by:",
    ["Rubbing the ointment into the skin vigorously","Applying the measured dose to a non-hairy area, covering with the application paper, and rotating sites","Applying the ointment over a previous application","Washing the site with hot water before application"],1,
    "Nitroglycerin ointment is applied using the measuring paper, placed on a non-hairy area (chest, upper arm, thigh), and covered with the application paper. Sites should be rotated. Previous ointment should be removed before applying new.",
    "NTG ointment: measure with paper, apply to non-hairy area, cover with paper, rotate sites, remove old before applying new. Do not rub in.",
    "Topical NTG application: measure, apply (don't rub), cover, rotate sites. Wearing gloves prevents the nurse from absorbing the medication.",
    {"0":"Rubbing the ointment in increases absorption rate and can cause severe hypotension; it should be applied without rubbing.","2":"Previous ointment must be removed before applying new to prevent overdose from accumulated medication.","3":"Hot water increases skin perfusion and drug absorption, potentially causing severe hypotension."}),

  q("RPN-CAT","Pharmacology","Pharmacology",4,
    "A client is receiving TPN (total parenteral nutrition). The nurse should monitor blood glucose levels because TPN:",
    ["Contains no calories","Contains high concentrations of dextrose that can cause hyperglycemia","Reduces blood glucose levels","Has no effect on glucose metabolism"],1,
    "TPN solutions contain high concentrations of dextrose (usually 25-70%). This can cause hyperglycemia, especially in clients with impaired glucose tolerance. Regular insulin may be added to TPN or administered separately to maintain glycemic control.",
    "TPN monitoring: blood glucose (hyperglycemia from dextrose), electrolytes (refeeding syndrome), liver function, infection (dedicated central line). Never abruptly stop TPN (rebound hypoglycemia).",
    "TPN and glucose: monitor every 4-6 hours initially. If stopping TPN, taper or hang D10W to prevent rebound hypoglycemia.",
    {"0":"TPN is a complete nutritional solution containing significant calories from dextrose, amino acids, and lipids.","2":"TPN typically raises blood glucose levels due to high dextrose content; it does not lower them.","3":"The high dextrose concentration in TPN significantly impacts glucose metabolism."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A nurse is preparing to administer an intramuscular injection to an adult. Which site is preferred for large-volume injections?",
    ["Deltoid muscle","Ventrogluteal site","Dorsogluteal site","Rectus femoris"],1,
    "The ventrogluteal site is the preferred IM injection site for adults because it has thick muscle mass, no major nerves or blood vessels, and accommodates large volumes (up to 3 mL). The deltoid accommodates only 1-2 mL.",
    "IM injection sites: ventrogluteal (preferred for adults, up to 3 mL), deltoid (1-2 mL max), vastus lateralis (infants/children). Dorsogluteal is no longer recommended.",
    "IM injection site preference: ventrogluteal is #1 for adults. Dorsogluteal is avoided due to sciatic nerve proximity.",
    {"0":"The deltoid accommodates only 1-2 mL and is not suitable for large-volume injections.","2":"The dorsogluteal site is no longer recommended due to the risk of sciatic nerve injury.","3":"The rectus femoris is not the preferred site for adult IM injections; it is used for self-injection."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client is taking spironolactone. The nurse should teach the client to avoid:",
    ["Foods low in potassium","Potassium-rich foods and salt substitutes containing potassium","Sodium-restricted diets","Adequate fluid intake"],1,
    "Spironolactone is a potassium-sparing diuretic that retains potassium. Consuming potassium-rich foods or salt substitutes (which contain potassium chloride) while on spironolactone can cause dangerous hyperkalemia.",
    "Potassium-sparing diuretics + high-K foods/salt substitutes = hyperkalemia risk. Avoid bananas, oranges, potatoes, and KCl salt substitutes.",
    "Spironolactone + potassium = hyperkalemia danger. This is the opposite teaching from loop/thiazide diuretics (which require K+ supplementation).",
    {"0":"Clients on spironolactone should avoid high-potassium foods, not low-potassium ones.","2":"Sodium restriction may be appropriate for the underlying condition but is separate from the potassium concern.","3":"Adequate fluid intake is important and should not be restricted."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A nurse is caring for a client who received naloxone for opioid overdose. The client's respiratory status improves. The nurse should continue to monitor because:",
    ["Naloxone permanently reverses opioid effects","Naloxone's duration of action is shorter than most opioids, and respiratory depression may return","The client will not need any further treatment","Naloxone causes permanent respiratory stimulation"],1,
    "Naloxone (Narcan) has a shorter half-life (30-90 minutes) than most opioids. When naloxone wears off, the opioid effect may return, causing recurrent respiratory depression. Repeat doses or continuous infusion may be necessary.",
    "Naloxone: short duration (30-90 min). Opioids last longer = respiratory depression may return. Monitor closely and have repeat doses available.",
    "Naloxone duration: shorter than most opioids. Always monitor for recurrence of respiratory depression after initial reversal.",
    {"0":"Naloxone's effects are temporary, not permanent; opioid effects can return when naloxone wears off.","2":"Continued monitoring and potentially repeat naloxone doses are needed due to the drug's short duration.","3":"Naloxone provides temporary reversal, not permanent respiratory stimulation."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A client is prescribed metronidazole for a Clostridium difficile infection. Which instruction is critical?",
    ["Drink alcohol in moderation while taking the medication","Avoid all alcohol during treatment and for 48 hours after, as a disulfiram-like reaction can occur","Take with a large glass of milk","Stop the medication when diarrhea improves"],1,
    "Metronidazole causes a severe disulfiram-like reaction with alcohol: nausea, vomiting, flushing, headache, and abdominal cramps. Alcohol must be avoided during treatment and for 48-72 hours after the last dose.",
    "Metronidazole + alcohol = disulfiram-like reaction (severe N/V, flushing, headache). Avoid alcohol during treatment and 48-72 hours after completion.",
    "Metronidazole-alcohol interaction: this is one of the most classic drug-alcohol interactions tested on nursing exams.",
    {"0":"Even moderate alcohol causes a severe disulfiram-like reaction with metronidazole; complete avoidance is required.","2":"Milk is not specifically indicated for metronidazole; the critical teaching is alcohol avoidance.","3":"The full antibiotic course must be completed to prevent recurrence and antibiotic resistance."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "A nurse is teaching a client about taking alendronate (Fosamax) for osteoporosis. The correct instructions include:",
    ["Take at bedtime with a snack","Take first thing in the morning on an empty stomach with a full glass of water, remain upright for 30 minutes","Take with calcium supplements at the same time","Chew the tablet for faster absorption"],1,
    "Bisphosphonates like alendronate must be taken on an empty stomach with a full glass of plain water. The client must remain upright (sitting or standing) for at least 30 minutes to prevent esophageal irritation and ulceration.",
    "Bisphosphonate administration: morning, empty stomach, full glass water, upright 30 minutes. Prevents esophageal erosion. Separate from calcium/food by 30 minutes.",
    "Alendronate teaching: empty stomach + full glass water + upright 30 min. Esophageal irritation is the primary risk if taken incorrectly.",
    {"0":"Taking at bedtime with food decreases absorption and lying down increases esophageal irritation risk.","2":"Calcium reduces bisphosphonate absorption; they must be separated by at least 30 minutes.","3":"Bisphosphonate tablets should be swallowed whole with water; chewing can cause oral/esophageal irritation."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A client is receiving IV amiodarone for cardiac arrhythmia. The nurse monitors for which adverse effect?",
    ["Hyperglycemia","Pulmonary toxicity and thyroid dysfunction","Increased appetite","Hair growth"],1,
    "Amiodarone has multiple serious adverse effects including pulmonary toxicity (pneumonitis/fibrosis), thyroid dysfunction (both hypo and hyperthyroidism), hepatotoxicity, corneal microdeposits, and photosensitivity. Baseline and periodic monitoring of thyroid, liver, and pulmonary function is essential.",
    "Amiodarone toxicities: lungs (fibrosis), thyroid (hypo/hyper), liver (hepatotoxicity), eyes (corneal deposits), skin (photosensitivity, blue-gray discoloration).",
    "Amiodarone: the drug with the most organ toxicities. Monitor thyroid, liver, lungs, and eyes. Blue-gray skin = chronic use.",
    {"0":"Hyperglycemia is not a characteristic adverse effect of amiodarone.","2":"Amiodarone is associated with nausea and anorexia, not increased appetite.","3":"Hair loss, not hair growth, may occur with amiodarone therapy."}),

  // ===== MENTAL HEALTH (60) =====
  q("REX-PN","Mental Health","Mental Health",2,
    "A nurse is caring for a client with generalized anxiety disorder. Which therapeutic communication technique is most effective?",
    ["Saying 'Everything will be fine, don't worry'","Using calm, simple statements and providing a quiet environment","Asking the client to explain why they feel anxious","Giving detailed medical explanations to distract the client"],1,
    "Anxiety impairs concentration and information processing. Calm, simple communication reduces stimulation and helps the client feel safe. A quiet environment decreases sensory overload that can worsen anxiety.",
    "Anxiety nursing care: calm presence, simple communication, quiet environment, deep breathing, acknowledgment of feelings. Avoid 'why' questions and false reassurance.",
    "Anxiety communication: short, simple statements. Avoid asking 'why' (increases anxiety) and giving false reassurance ('don't worry').",
    {"0":"'Don't worry' is false reassurance that dismisses the client's feelings and does not reduce anxiety.","2":"Asking 'why' increases anxiety by demanding rational analysis during an emotional state.","3":"Detailed explanations overwhelm an anxious client whose concentration is impaired."}),

  q("RPN-CAT","Mental Health","Mental Health",3,
    "A nurse is assessing a client for suicidal risk. Which question is most appropriate to ask?",
    ["You're not thinking about hurting yourself, are you?","Are you having thoughts of harming yourself or ending your life?","Why would you want to do something like that?","Don't you have reasons to live?"],1,
    "Direct, open-ended questions about suicidal ideation are appropriate and do NOT increase suicidal risk. Asking directly communicates that it is safe to talk about these feelings and allows the nurse to accurately assess risk level.",
    "Suicide assessment: ask directly and specifically about suicidal thoughts, plan, means, and intent. Direct questioning does NOT cause suicidal ideation.",
    "Suicide assessment: always ask directly. Indirect questions and leading questions are less effective and may miss critical information.",
    {"0":"This is a leading question that suggests the expected answer is 'no,' potentially discouraging honest disclosure.","2":"'Why' questions are judgmental and may increase shame and guilt, which can worsen suicidal ideation.","3":"This question is leading and may make the client feel guilty, discouraging honest communication."}),

  q("REX-PN","Mental Health","Mental Health",3,
    "A client with major depression tells the nurse, 'I've decided to give away all my possessions.' The nurse recognizes this as:",
    ["A positive sign of recovery","A potential warning sign of suicidal intent requiring immediate assessment","Normal behavior during depression","A sign that medication is working"],1,
    "Giving away possessions is a behavioral warning sign of suicidal intent. Other warning signs include sudden calmness after depression, making a will, saying goodbye to people, and expressing that 'things will be better soon.'",
    "Suicidal warning signs: giving away possessions, sudden mood improvement, saying goodbye, increased substance use, social withdrawal, expressing feeling like a burden.",
    "Sudden behavioral changes in depressed clients (giving things away, sudden calmness) are red flags for suicidal planning.",
    {"0":"This behavior is a serious warning sign, not a positive sign of recovery.","2":"Giving away possessions is not a normal feature of depression; it suggests the client may be preparing to end their life.","3":"This behavioral change is not related to medication effect; it is a suicidal warning sign."}),

  q("REX-PN","Mental Health","Mental Health",2,
    "A nurse is caring for a client experiencing a panic attack. The priority intervention is to:",
    ["Leave the client alone to recover","Stay with the client, maintain a calm presence, and guide slow breathing","Administer oral anxiolytics immediately","Encourage the client to describe their feelings in detail"],1,
    "During a panic attack, the nurse should stay with the client, remain calm, use short simple sentences, and guide breathing (slow, deep breaths). The physical presence of a calm person is reassuring. The attack typically peaks within 10 minutes.",
    "Panic attack management: stay with the client, calm presence, short sentences, guide breathing, reduce stimuli. Attacks self-limit in 10-30 minutes.",
    "Panic attack priority: stay with the client and guide breathing. Do not leave, do not analyze, do not give complex instructions.",
    {"0":"Leaving a client during a panic attack increases fear and a sense of losing control.","2":"During an acute panic attack, the client may have difficulty swallowing oral medications; non-pharmacological interventions are first-line.","3":"Asking the client to describe feelings in detail is overwhelming during an acute panic attack."}),

  q("RPN-CAT","Mental Health","Mental Health",3,
    "A client with bipolar disorder is in a manic episode. Which nursing intervention is most appropriate?",
    ["Encourage the client to participate in group therapy sessions","Provide a structured environment with decreased stimulation and ensure adequate nutrition","Allow the client unlimited social interaction to use excess energy","Assign complex, detailed tasks to occupy the client"],1,
    "During mania, the client is easily distracted and overstimulated. A structured environment with decreased stimulation helps reduce agitation. Finger foods and high-calorie snacks ensure adequate nutrition as the client is too active to sit for meals.",
    "Manic episode care: decreased stimulation, structured routine, finger foods, safety precautions, monitor lithium levels. Avoid overstimulation and complex activities.",
    "Mania management: decrease stimulation, provide structure, ensure nutrition (finger foods), maintain safety. Redirect, don't argue.",
    {"0":"Group therapy may be too stimulating during an acute manic episode.","2":"Unlimited social interaction increases stimulation and can escalate manic behavior.","3":"Complex tasks are frustrating for a client with decreased concentration during mania."}),

  q("REX-PN","Mental Health","Mental Health",2,
    "A nurse is caring for a client who reports hearing voices telling them to harm others. This symptom is classified as:",
    ["An illusion","A command auditory hallucination","A delusion of persecution","A phobia"],1,
    "Command hallucinations are auditory hallucinations that direct the person to take specific actions, including harmful ones. These are considered the most dangerous type of hallucination because the client may feel compelled to obey.",
    "Command hallucinations: voices directing specific actions. Always assess for command hallucinations and the client's intent to act on them. High safety risk.",
    "Hallucination types: command (dangerous), auditory (most common in schizophrenia), visual (common in delirium). Always assess for command content.",
    {"0":"An illusion is a misperception of a real stimulus (e.g., seeing a shadow and thinking it's a person); voices are hallucinations.","2":"A delusion of persecution involves false beliefs about being targeted; hearing voices is a hallucination.","3":"A phobia is an irrational fear of a specific object or situation, not a perceptual disturbance."}),

  q("RPN-CAT","Mental Health","Mental Health",3,
    "A client with schizophrenia is prescribed clozapine. The nurse understands that the most serious adverse effect is:",
    ["Mild sedation","Agranulocytosis requiring regular blood monitoring","Weight loss","Improved social functioning"],1,
    "Clozapine carries a risk of agranulocytosis (severe decrease in white blood cells), which can be fatal. Weekly CBC monitoring is required for the first 6 months, then biweekly. The drug is dispensed only if WBC counts are acceptable.",
    "Clozapine monitoring: weekly CBC for 6 months, then biweekly. Agranulocytosis risk requires absolute neutrophil count monitoring. Also monitor for metabolic syndrome.",
    "Clozapine = agranulocytosis risk. This is the most important adverse effect to know. Mandatory WBC monitoring is required for all clients.",
    {"0":"While sedation occurs, it is not the most serious adverse effect of clozapine.","2":"Clozapine typically causes significant weight gain, not weight loss.","3":"Improved social functioning is a therapeutic effect, not an adverse effect."}),

  q("REX-PN","Mental Health","Mental Health",2,
    "A nurse is using therapeutic communication with a depressed client who says, 'Nobody cares about me.' The best response is:",
    ["'That's not true; lots of people care about you'","'It sounds like you're feeling alone and uncared for. Tell me more about that.'","'You should focus on the positive things in your life'","'Everyone feels that way sometimes'"],1,
    "Reflecting the client's feelings and inviting further discussion demonstrates empathy and encourages the client to explore their emotions. This validates their experience without agreeing with the distorted thought.",
    "Therapeutic communication: reflect feelings, use open-ended questions, avoid arguing with perceptions, validate emotions without reinforcing distortions.",
    "Therapeutic responses: reflect + explore. Non-therapeutic: argue, minimize, give advice, change the subject.",
    {"0":"Disagreeing with the client's perception dismisses their feelings and shuts down communication.","2":"Telling the client to focus on positives minimizes their pain and is not therapeutic.","3":"Generalizing the experience ('everyone feels that way') minimizes the client's individual suffering."}),

  q("REX-PN","Mental Health","Mental Health",3,
    "A client admitted with alcohol withdrawal develops tremors, agitation, and diaphoresis. The nurse anticipates which medication?",
    ["Haloperidol","Lorazepam or chlordiazepoxide","Naltrexone","Fluoxetine"],1,
    "Benzodiazepines (lorazepam, chlordiazepoxide, diazepam) are the first-line treatment for alcohol withdrawal. They prevent seizures and delirium tremens by enhancing GABA activity, replacing the depressant effect of alcohol on the CNS.",
    "Alcohol withdrawal treatment: benzodiazepines first-line (lorazepam, chlordiazepoxide). CIWA protocol guides dosing based on withdrawal severity. Watch for seizures and DTs.",
    "Alcohol withdrawal: benzodiazepines prevent the most dangerous complications (seizures, DTs). CIWA score guides treatment.",
    {"0":"Haloperidol is an antipsychotic that lowers the seizure threshold and is not first-line for alcohol withdrawal.","2":"Naltrexone is used for relapse prevention after acute withdrawal, not for acute withdrawal management.","3":"Fluoxetine is an antidepressant and does not address the acute neurological effects of alcohol withdrawal."}),

  q("RPN-CAT","Mental Health","Mental Health",3,
    "A client with anorexia nervosa is on a refeeding program. The nurse monitors for which life-threatening complication?",
    ["Hypernatremia","Refeeding syndrome with hypophosphatemia and cardiac complications","Hyperglycemia","Hypertension"],1,
    "Refeeding syndrome occurs when severely malnourished clients receive nutrition too quickly. Insulin release drives phosphate, potassium, and magnesium into cells, causing dangerous electrolyte imbalances. Hypophosphatemia can cause cardiac arrest and respiratory failure.",
    "Refeeding syndrome: hypophosphatemia is the hallmark. Also: hypokalemia, hypomagnesemia. Start feeding slowly, monitor electrolytes closely, supplement phosphate.",
    "Refeeding syndrome: the key electrolyte is phosphorus. Start nutrition slowly ('start low, go slow') and monitor electrolytes closely.",
    {"0":"Hypernatremia is not the primary concern during refeeding; phosphorus and potassium imbalances are more dangerous.","2":"While glucose changes can occur, hypophosphatemia and cardiac complications are the life-threatening concerns.","3":"Hypotension and cardiac dysfunction are more common than hypertension during refeeding syndrome."}),

  q("REX-PN","Mental Health","Mental Health",2,
    "A nurse is caring for a client with obsessive-compulsive disorder who spends 3 hours washing hands each day. The nurse should:",
    ["Forcibly prevent the client from handwashing","Allow time for the ritual while gradually working to reduce it","Ignore the behavior completely","Mock the behavior to show its irrationality"],1,
    "OCD rituals serve to reduce severe anxiety. Forcibly preventing rituals increases anxiety to unbearable levels. The therapeutic approach is to allow the ritual while gradually reducing the time spent, combined with cognitive-behavioral therapy.",
    "OCD management: allow rituals initially (prevents panic), gradually reduce ritual time, CBT with exposure-response prevention is the gold standard treatment.",
    "OCD care: allow rituals but set gradual time limits. Forcing immediate cessation causes severe anxiety and is counterproductive.",
    {"0":"Forcibly preventing rituals causes severe anxiety, panic, and can be psychologically harmful.","2":"Ignoring the behavior does not address the underlying anxiety or help the client develop coping strategies.","3":"Mocking is cruel, destroys the therapeutic relationship, and does not address the underlying disorder."}),

  q("RPN-CAT","Mental Health","Mental Health",4,
    "A client in the emergency department is experiencing serotonin syndrome. Which findings would the nurse expect?",
    ["Bradycardia and hypothermia","Hyperthermia, agitation, muscle rigidity, and clonus","Lethargy and hypotension","Decreased reflexes and constipation"],1,
    "Serotonin syndrome is caused by excess serotonin, often from drug interactions (SSRIs + MAOIs, SSRIs + tramadol). Signs include hyperthermia, agitation, muscle rigidity, clonus (rhythmic muscle contractions), diaphoresis, and autonomic instability.",
    "Serotonin syndrome triad: mental status changes + autonomic instability + neuromuscular excitability. Most dangerous drug combinations: SSRI + MAOI.",
    "Serotonin syndrome: think hyperactivity of everything - hyperthermia, hyperreflexia, agitation, clonus. Opposite of neuroleptic malignant syndrome in onset (rapid vs gradual).",
    {"0":"Serotonin syndrome causes tachycardia and hyperthermia, not bradycardia and hypothermia.","2":"Serotonin syndrome causes agitation and hypertension, not lethargy and hypotension.","3":"Serotonin syndrome causes hyperreflexia and diarrhea, not decreased reflexes and constipation."}),

  q("REX-PN","Mental Health","Mental Health",2,
    "A nurse is caring for a client with PTSD who has a flashback during a therapy session. The appropriate intervention is to:",
    ["Leave the client alone during the flashback","Orient the client to the present environment using grounding techniques","Restrain the client for safety","Ask the client to describe the traumatic event in detail"],1,
    "Grounding techniques help the client return to the present. Examples include asking the client to name 5 things they can see, 4 things they can touch, 3 things they can hear, etc. This interrupts the flashback by engaging the senses in the present moment.",
    "PTSD grounding: 5-4-3-2-1 technique (5 see, 4 touch, 3 hear, 2 smell, 1 taste). Orient to present, calm voice, safe environment.",
    "Flashback management: ground the client in the present moment. Use sensory-based techniques and calm, reassuring presence.",
    {"0":"Leaving the client alone during a flashback removes the safety of a therapeutic presence and can worsen the experience.","2":"Restraints are not appropriate for flashbacks; they may worsen the trauma response.","3":"Asking for detailed trauma descriptions during a flashback can retraumatize the client and worsen symptoms."}),

  q("RPN-CAT","Mental Health","Mental Health",3,
    "A client on lithium therapy presents with coarse tremor, vomiting, and diarrhea. The serum lithium level is 2.5 mEq/L. The nurse should:",
    ["Administer the next dose of lithium","Hold lithium immediately, ensure IV access, and notify the provider urgently","Encourage the client to drink more water","Give an additional dose to reach therapeutic levels"],1,
    "A lithium level of 2.5 mEq/L is severely toxic (therapeutic: 0.6-1.2 mEq/L). Symptoms progress from mild toxicity (tremor, GI symptoms) to severe toxicity (seizures, coma, death). Immediate treatment includes holding lithium, IV fluids, and potentially dialysis.",
    "Lithium toxicity: 0.6-1.2 = therapeutic, 1.5-2.0 = mild toxicity, 2.0-2.5 = moderate toxicity, >2.5 = severe/life-threatening. Treatment: hold drug, IV fluids, possible dialysis.",
    "Lithium toxicity management: hold the drug, hydrate, monitor electrolytes, potential dialysis. Know the therapeutic range and toxicity thresholds.",
    {"0":"Administering lithium at a toxic level could cause seizures, cardiac arrest, and death.","2":"Oral hydration alone is insufficient for severe lithium toxicity; IV access and possible dialysis are needed.","3":"The level is already dangerously high; additional dosing could be fatal."}),

  q("REX-PN","Mental Health","Mental Health",2,
    "A nurse is using the least restrictive intervention principle. Which intervention should be tried first for an agitated client?",
    ["Physical restraints","Seclusion room","Verbal de-escalation and offering choices","Chemical restraint with IM haloperidol"],2,
    "The least restrictive intervention principle requires that the least invasive method be used first. Verbal de-escalation, offering choices, and environmental modifications should precede chemical or physical restraints.",
    "Least restrictive principle hierarchy: verbal de-escalation, environmental changes, PRN medications, seclusion, physical restraints (absolute last resort).",
    "Restraint questions: always choose the least restrictive option first. Verbal de-escalation is always the first step.",
    {"0":"Physical restraints are the most restrictive intervention and should only be used as a last resort.","1":"Seclusion is more restrictive than verbal de-escalation and should not be the first intervention.","3":"Chemical restraint should be attempted only after verbal de-escalation has failed."}),

  q("REX-PN","Mental Health","Mental Health",3,
    "A client with borderline personality disorder displays splitting behavior. The nurse understands that splitting means:",
    ["The client has multiple personality disorder","The client views people and situations as all good or all bad with no middle ground","The client is deliberately manipulating staff","The client has a psychotic break"],1,
    "Splitting is a defense mechanism where the person views others as entirely good or entirely bad. This creates staff conflict as the client idealizes some staff while devaluing others. Consistent treatment approach among all staff is essential.",
    "Borderline personality disorder: splitting, fear of abandonment, unstable relationships, self-harm. Consistent boundaries and team communication are essential.",
    "Splitting: 'all good or all bad' thinking. The nursing approach: consistent boundaries, unified staff approach, avoid being drawn into 'favorite' or 'enemy' roles.",
    {"0":"Splitting is a defense mechanism, not dissociative identity disorder (which involves distinct personality states).","2":"While splitting may appear manipulative, it is a subconscious defense mechanism, not deliberate manipulation.","3":"Splitting is not psychosis; the client maintains contact with reality but has distorted interpersonal perceptions."})
];

async function main() {
  console.log(`[RPN-B9] Starting insertion of ${QS.length} questions...`);

  const topicDist: Record<string,number> = {};
  const diffDist: Record<string,number> = {easy:0,moderate:0,difficult:0};
  QS.forEach(q => {
    topicDist[q.topic] = (topicDist[q.topic]||0)+1;
    if(q.diff<=2) diffDist.easy++;
    else if(q.diff===3) diffDist.moderate++;
    else diffDist.difficult++;
  });

  console.log(`\nTopic distribution:`);
  Object.entries(topicDist).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([t,c])=>console.log(`  ${t}: ${c}`));
  console.log(`\nDifficulty distribution:`);
  Object.entries(diffDist).forEach(([d,c])=>console.log(`  ${d}: ${c} (${((c/QS.length)*100).toFixed(1)}%)`));

  let inserted = 0;
  let skipped = 0;
  const batchSize = 25;

  for (let i = 0; i < QS.length; i += batchSize) {
    const batch = QS.slice(i, i + batchSize);
    const values: string[] = [];
    const params: any[] = [];
    let idx = 1;

    for (const q of batch) {
      const stemHash = hash(q.stem);
      values.push(`($${idx},$${idx+1},$${idx+2},$${idx+3},$${idx+4},$${idx+5}::jsonb,$${idx+6}::jsonb,$${idx+7},$${idx+8}::integer,$${idx+9},$${idx+10},$${idx+11},$${idx+12},$${idx+13},$${idx+14},$${idx+15}::jsonb)`);
      params.push(
        q.tier, q.exam, "multiple_choice", "published",
        q.stem, JSON.stringify(q.options), JSON.stringify([q.correct]),
        q.rationale, q.diff, q.bs, q.topic, "BOTH", stemHash,
        q.cp, q.es, JSON.stringify(q.dr)
      );
      idx += 16;
    }

    const sql = `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, body_system, topic, region_scope, stem_hash, clinical_pearl, exam_strategy, distractor_rationales)
                 SELECT v.* FROM (VALUES ${values.join(",")}) AS v(tier,exam,question_type,status,stem,options,correct_answer,rationale,difficulty,body_system,topic,region_scope,stem_hash,clinical_pearl,exam_strategy,distractor_rationales)
                 WHERE NOT EXISTS (SELECT 1 FROM exam_questions e WHERE e.stem_hash = v.stem_hash)`;
    const result = await pool.query(sql, params);
    const batchInserted = result.rowCount || 0;
    inserted += batchInserted;
    skipped += batch.length - batchInserted;
  }

  console.log(`\n[RPN-B9] Results: Inserted ${inserted}, Skipped duplicates ${skipped}, Total attempted ${QS.length}`);

  const totalQ = await pool.query(`SELECT count(*) as cnt FROM exam_questions WHERE tier='rpn'`);
  console.log(`\nTotal RPN questions in database: ${totalQ.rows[0].cnt}`);

  await pool.end();
  console.log(`\n[RPN-B9] Complete.`);
}

main().catch(e => { console.error(e); process.exit(1); });
