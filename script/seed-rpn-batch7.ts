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
  // ===== FOUNDATIONS OF NURSING - Infection Control (25) =====
  q("REX-PN","Fundamentals","Infection Control",2,
    "A nurse is donning personal protective equipment to enter the room of a client on contact precautions. Which sequence is correct?",
    ["Gloves, gown, mask, goggles","Gown, mask/goggles, gloves","Gloves, mask, gown, goggles","Mask, gloves, gown, goggles"],1,
    "The correct donning sequence is gown first, then mask/respirator, goggles/face shield, and gloves last. This ensures gloves cover the cuff of the gown for complete barrier protection.",
    "Remember donning order: gown, mask, goggles, gloves. Doffing is reverse: gloves, goggles, gown, mask.",
    "PPE sequence questions test donning (gown first, gloves last) and doffing (gloves first, mask last).",
    {"0":"Gloves should be applied last to cover gown cuffs, not first.","2":"Gloves must be applied after gown, not before.","3":"The gown should be applied before the mask to establish the base barrier."}),

  q("RPN-CAT","Fundamentals","Infection Control",3,
    "A client with Clostridium difficile infection has been placed on contact precautions. Which hand hygiene method is most effective?",
    ["Alcohol-based hand rub","Soap and water with friction for at least 20 seconds","Antibacterial wipes","Hand sanitizer with moisturizer"],1,
    "C. difficile forms spores that are resistant to alcohol-based products. Soap and water with mechanical friction physically removes spores from the hands. This is the only effective method for C. difficile.",
    "C. difficile = soap and water ONLY. Alcohol-based sanitizers do NOT kill C. difficile spores.",
    "C. difficile hand hygiene is a classic exam question. Always choose soap and water over alcohol-based products.",
    {"0":"Alcohol-based hand rubs do not destroy C. difficile spores; they are ineffective for this organism.","2":"Antibacterial wipes are not effective against C. difficile spores.","3":"Hand sanitizer is alcohol-based and cannot kill C. difficile spores."}),

  q("REX-PN","Fundamentals","Infection Control",2,
    "The nurse is caring for a client with active pulmonary tuberculosis. Which type of isolation is required?",
    ["Contact precautions","Airborne precautions with a negative-pressure room","Droplet precautions","Standard precautions only"],1,
    "Pulmonary TB requires airborne precautions because the Mycobacterium tuberculosis bacillus is transmitted via airborne nuclei that remain suspended in air. A negative-pressure room prevents contaminated air from escaping.",
    "Airborne precautions: TB, measles, varicella (chickenpox). Requires N95 respirator and negative-pressure room.",
    "Know the three transmission-based precautions: airborne (TB, measles, varicella), droplet (flu, pertussis), contact (MRSA, C. diff).",
    {"0":"Contact precautions are for organisms spread by direct or indirect contact, not airborne pathogens.","2":"Droplet precautions are for larger particles that fall within 3-6 feet; TB particles remain airborne.","3":"Standard precautions alone are insufficient for TB; additional airborne precautions are required."}),

  q("REX-PN","Fundamentals","Infection Control",1,
    "Which action by a nurse demonstrates proper standard precautions?",
    ["Wearing gloves only when handling blood or body fluids","Recapping used needles before disposal","Wearing gloves when touching all moist body substances","Removing gloves and applying hand sanitizer only if visibly soiled"],2,
    "Standard precautions apply to all blood, body fluids, secretions, excretions (except sweat), non-intact skin, and mucous membranes regardless of diagnosis. Gloves should be worn when contact with moist body substances is anticipated.",
    "Standard precautions apply to ALL patients, not just those with known infections.",
    "Standard precautions questions: the correct answer applies protection universally, not selectively.",
    {"0":"Gloves should be worn for all moist body substances, not just blood and body fluids.","1":"Needles should NEVER be recapped; they should be disposed of directly into sharps containers.","3":"Hands should be washed after glove removal regardless of visible soiling."}),

  q("RPN-CAT","Fundamentals","Infection Control",3,
    "A nurse accidentally sustains a needlestick injury from a client with unknown HIV status. The priority action is to:",
    ["Apply a bandage and continue working","Wash the area with soap and water, report the exposure, and seek post-exposure prophylaxis","Wait for the client's HIV test results before taking action","Apply alcohol to the puncture site only"],1,
    "Needlestick protocol requires immediate wound cleansing with soap and water, reporting the exposure to the supervisor, and initiating post-exposure prophylaxis (PEP) ideally within 2 hours. Do not wait for source patient results.",
    "Needlestick injury: wash immediately, report, start PEP within 2 hours. Do not squeeze the wound or apply caustic agents.",
    "Needlestick questions: immediate cleansing and PEP initiation are always the priority, regardless of source patient status.",
    {"0":"Continuing to work without reporting violates occupational health protocols and delays PEP.","2":"Waiting for results delays PEP, which must begin within 2 hours for maximum effectiveness.","3":"Alcohol alone is insufficient; soap and water cleansing plus reporting and PEP are all required."}),

  q("REX-PN","Fundamentals","Infection Control",2,
    "The nurse is teaching a client about preventing surgical site infections. Which instruction is most important?",
    ["Shower with antimicrobial soap the night before and morning of surgery","Apply antibiotic ointment to the surgical area for one week prior","Shave the surgical site with a razor the night before","Stop all medications one week before surgery"],0,
    "Preoperative skin preparation with antimicrobial soap reduces skin flora and decreases surgical site infection risk. Shaving with a razor causes micro-abrasions that increase infection risk; clipping is preferred if hair removal is needed.",
    "Surgical site infection prevention: antimicrobial shower, no shaving (clip if needed), prophylactic antibiotics within 60 minutes of incision.",
    "Surgical prep questions: antimicrobial shower is correct; razor shaving is always wrong.",
    {"1":"Applying antibiotic ointment preoperatively is not standard practice and does not reduce SSI risk.","2":"Razor shaving creates micro-abrasions that harbor bacteria and increase SSI risk. Clipping is preferred.","3":"Stopping all medications is dangerous and not standard preoperative practice; only specific medications are held."}),

  q("RPN-CAT","Fundamentals","Infection Control",3,
    "A nurse is caring for a client with meningococcal meningitis. Which type of precautions should be implemented?",
    ["Airborne precautions","Droplet precautions","Contact precautions","Protective (reverse) isolation"],1,
    "Meningococcal meningitis is transmitted via respiratory droplets from close contact. Droplet precautions require a surgical mask when within 3-6 feet of the client. A private room is required.",
    "Droplet precautions: meningococcal meningitis, influenza, pertussis, diphtheria, mumps, rubella.",
    "Meningitis isolation depends on the causative organism. Meningococcal = droplet precautions.",
    {"0":"Airborne precautions are for organisms that remain suspended in air (TB, measles, varicella), not meningococcal meningitis.","2":"Contact precautions are for organisms spread by touch; meningococcal meningitis is spread by respiratory droplets.","3":"Protective isolation protects immunocompromised clients; it is not used for meningitis."}),

  q("REX-PN","Fundamentals","Infection Control",2,
    "When performing surgical hand scrub, the nurse scrubs from:",
    ["Elbows to fingertips","Fingertips to elbows, keeping hands higher than elbows","Upper arms to wrists","Fingertips to shoulders"],1,
    "Surgical scrub proceeds from the cleanest area (fingertips) to the least clean area (elbows). Hands are kept higher than elbows so water flows from clean to dirty areas, preventing recontamination.",
    "Surgical scrub: fingertips to elbows, hands above elbows. Regular handwashing: wrists to fingertips, hands below elbows.",
    "Surgical scrub vs regular handwash: direction and hand position differ. Know both techniques.",
    {"0":"Scrubbing from elbows to fingertips would move contaminants toward the clean area.","2":"The entire forearm must be scrubbed, not just from upper arm to wrist.","3":"Scrubbing to the shoulders is unnecessary and not part of surgical scrub technique."}),

  // ===== FOUNDATIONS - Fluid & Electrolytes (25) =====
  q("REX-PN","Fundamentals","Fluid and Electrolyte Balance",3,
    "A client's laboratory results show a serum potassium of 3.0 mEq/L. Which ECG change would the nurse expect?",
    ["Tall, peaked T waves","Flattened T waves and presence of U waves","Widened QRS complex","Elevated ST segment"],1,
    "Hypokalemia (K+ <3.5 mEq/L) causes characteristic ECG changes: flattened T waves, ST depression, prominent U waves, and prolonged QT interval. Severe hypokalemia can lead to fatal cardiac dysrhythmias.",
    "Hypokalemia ECG: flat T waves, U waves, ST depression. Hyperkalemia ECG: tall peaked T waves, widened QRS.",
    "ECG + electrolyte questions: hypokalemia = flat T/U waves, hyperkalemia = peaked T waves. This is the most tested pattern.",
    {"0":"Tall, peaked T waves are characteristic of hyperkalemia, not hypokalemia.","2":"Widened QRS complex occurs with severe hyperkalemia, not hypokalemia.","3":"Elevated ST segment suggests myocardial injury (MI), not hypokalemia."}),

  q("RPN-CAT","Fundamentals","Fluid and Electrolyte Balance",3,
    "A client with severe vomiting and nasogastric suctioning is at highest risk for which acid-base imbalance?",
    ["Respiratory acidosis","Metabolic alkalosis","Respiratory alkalosis","Metabolic acidosis"],1,
    "Loss of gastric acid (HCl) through vomiting or NG suctioning depletes hydrogen ions, causing metabolic alkalosis. The body compensates by decreasing respiratory rate to retain CO2.",
    "Vomiting/NG suction = loss of HCl = metabolic alkalosis. Diarrhea = loss of bicarbonate = metabolic acidosis.",
    "Acid-base questions: vomiting loses acid (alkalosis), diarrhea loses base (acidosis). Remember 'V for vomiting, V for up (alkalosis).'",
    {"0":"Respiratory acidosis results from CO2 retention due to hypoventilation, not GI losses.","2":"Respiratory alkalosis results from hyperventilation causing excessive CO2 loss.","3":"Metabolic acidosis involves bicarbonate loss or acid accumulation, not HCl loss from vomiting."}),

  q("REX-PN","Fundamentals","Fluid and Electrolyte Balance",2,
    "A nurse is monitoring a client receiving IV normal saline. Which finding indicates fluid volume overload?",
    ["Decreased blood pressure and flat neck veins","Bounding pulse, crackles in lungs, and distended neck veins","Dry mucous membranes and poor skin turgor","Decreased urine output with concentrated urine"],1,
    "Fluid volume overload presents with bounding pulse, elevated blood pressure, distended neck veins (JVD), crackles/rales in the lungs, peripheral edema, and weight gain. These signs indicate the circulatory system is handling excess volume.",
    "FVO signs: JVD, crackles, bounding pulse, edema, weight gain. FVD signs: flat veins, tachycardia, hypotension, poor turgor.",
    "Fluid overload vs deficit: overload = too much everywhere (JVD, crackles, edema). Deficit = too little everywhere (flat veins, dry mucosa).",
    {"0":"Decreased BP and flat neck veins indicate fluid volume deficit, not overload.","2":"Dry mucous membranes and poor skin turgor indicate dehydration (fluid volume deficit).","3":"Decreased concentrated urine indicates the kidneys are trying to conserve fluid in deficit, not overload."}),

  q("RPN-CAT","Fundamentals","Fluid and Electrolyte Balance",4,
    "A client's ABG results show: pH 7.30, PaCO2 50 mmHg, HCO3 24 mEq/L. The nurse interprets this as:",
    ["Metabolic acidosis","Respiratory acidosis, uncompensated","Respiratory alkalosis","Metabolic alkalosis with compensation"],1,
    "pH 7.30 is acidotic. PaCO2 50 is elevated (retaining CO2 = acid). HCO3 24 is normal (kidneys have not compensated yet). This is uncompensated respiratory acidosis from hypoventilation.",
    "ABG interpretation: 1) Check pH (acid/alkaline), 2) Check PaCO2 (respiratory), 3) Check HCO3 (metabolic), 4) Determine compensation.",
    "ABG questions: always start with pH, then identify which component matches the imbalance direction.",
    {"0":"Metabolic acidosis would show a low HCO3 level; this patient's HCO3 is normal.","2":"Respiratory alkalosis would show a low PaCO2 and elevated pH, the opposite of this case.","3":"Metabolic alkalosis would show an elevated HCO3 and elevated pH."}),

  q("REX-PN","Fundamentals","Fluid and Electrolyte Balance",2,
    "The nurse is caring for a client with hypocalcemia. Which assessment finding would the nurse expect?",
    ["Constipation and lethargy","Positive Trousseau's sign and Chvostek's sign","Decreased deep tendon reflexes","Kidney stones"],1,
    "Hypocalcemia increases neuromuscular excitability. Trousseau's sign (carpal spasm with BP cuff inflation) and Chvostek's sign (facial twitching when tapping the facial nerve) are classic indicators of hypocalcemia.",
    "Hypocalcemia = increased neuromuscular excitability: Trousseau's, Chvostek's, tetany, seizures. Hypercalcemia = decreased excitability: lethargy, constipation.",
    "Calcium imbalance: hypo = excitable (tetany, spasms), hyper = sedated (lethargy, constipation). Know Trousseau's and Chvostek's signs.",
    {"0":"Constipation and lethargy are signs of hypercalcemia, not hypocalcemia.","2":"Decreased reflexes indicate hypercalcemia or hypermagnesemia; hypocalcemia causes hyperreflexia.","3":"Kidney stones are associated with hypercalcemia due to excess calcium in the urine."}),

  q("RPN-CAT","Fundamentals","Fluid and Electrolyte Balance",3,
    "A client with chronic kidney disease has a serum potassium level of 6.2 mEq/L. Which intervention does the nurse anticipate?",
    ["Administer potassium supplements","Administer IV calcium gluconate and insulin with glucose","Encourage foods high in potassium","Discontinue all IV fluids"],1,
    "Severe hyperkalemia (K+ >6.0) is a cardiac emergency. IV calcium gluconate stabilizes the myocardium. Insulin with glucose drives potassium into cells. Sodium bicarbonate, kayexalate, and dialysis may also be used.",
    "Hyperkalemia emergency treatment: calcium gluconate (cardiac protection), insulin+glucose (shift K+ into cells), kayexalate (remove K+), dialysis (last resort).",
    "Hyperkalemia treatment order: stabilize the heart first (calcium gluconate), then shift K+ intracellularly, then remove K+ from the body.",
    {"0":"Potassium supplements would worsen hyperkalemia and could cause fatal cardiac arrest.","2":"High-potassium foods would further elevate the dangerously high potassium level.","3":"Discontinuing IV fluids does not address the immediate cardiac risk of hyperkalemia."}),

  q("REX-PN","Fundamentals","Fluid and Electrolyte Balance",2,
    "A client is receiving a blood transfusion and develops chills, fever, and flank pain. The nurse should first:",
    ["Slow the infusion rate","Stop the transfusion immediately and maintain IV access with normal saline","Administer antipyretics and continue the transfusion","Document the findings and monitor"],0,
    "These signs suggest a hemolytic transfusion reaction, which is life-threatening. The nurse must immediately stop the transfusion, maintain IV access with NS, notify the provider, send the blood bag and client blood sample to the lab.",
    "Transfusion reaction: stop the blood, maintain IV with NS, notify provider, send blood/urine samples to lab. Never restart the blood.",
    "Transfusion reaction questions: ALWAYS stop the transfusion first. Never slow it down or continue.",
    {"0":"Slowing the rate prolongs exposure to incompatible blood; the transfusion must be completely stopped.","2":"Continuing the transfusion during a hemolytic reaction can cause renal failure and death.","3":"Documentation alone is insufficient; immediate action is required to prevent organ damage."}),

  q("REX-PN","Fundamentals","Fluid and Electrolyte Balance",3,
    "A nurse is administering IV potassium chloride to a client. Which safety measure is most important?",
    ["Administer by IV push for rapid correction","Dilute appropriately and infuse via pump at no more than 10 mEq/hour","Mix potassium directly in a syringe for bolus","Infuse at the fastest rate the client can tolerate"],1,
    "IV potassium must always be diluted and infused slowly (typically no more than 10 mEq/hour via peripheral line, up to 20 mEq/hour via central line with monitoring). Rapid infusion can cause fatal cardiac arrest.",
    "IV potassium: NEVER give IV push, NEVER give undiluted, always use an infusion pump, maximum 10 mEq/hr peripheral. Monitor ECG for high-dose infusions.",
    "IV potassium safety is heavily tested. The key rule: never IV push potassium. Always diluted, always via pump.",
    {"0":"IV push potassium causes immediate cardiac arrest and is absolutely contraindicated.","2":"Potassium should never be given as a bolus; it must be diluted in IV fluid.","3":"Fast infusion rates cause cardiac irritability, dysrhythmias, and potentially cardiac arrest."}),

  q("RPN-CAT","Fundamentals","Fluid and Electrolyte Balance",3,
    "A client with hyponatremia (Na+ 125 mEq/L) is confused and lethargic. The nurse understands that this is caused by:",
    ["Dehydration of brain cells","Cerebral edema from water shifting into brain cells","Increased blood viscosity","Decreased cardiac output"],1,
    "In hyponatremia, the extracellular fluid becomes hypotonic relative to intracellular fluid. Water shifts into cells by osmosis, causing cellular swelling. In the brain, this swelling causes cerebral edema, leading to confusion, lethargy, and potentially seizures.",
    "Hyponatremia = water moves INTO cells (cells swell). Hypernatremia = water moves OUT of cells (cells shrink). Brain cells are most sensitive.",
    "Sodium imbalance neurological symptoms: hyponatremia causes cerebral edema (confusion, seizures); hypernatremia causes cell shrinkage (lethargy, coma).",
    {"0":"Dehydration of brain cells occurs in hypernatremia when water leaves cells due to high extracellular sodium.","2":"Hyponatremia causes dilution of blood, not increased viscosity.","3":"Decreased cardiac output may occur but is not the direct cause of the neurological symptoms described."}),

  q("REX-PN","Fundamentals","Fluid and Electrolyte Balance",2,
    "The nurse is monitoring a client with diabetes insipidus. Which findings would the nurse expect?",
    ["Low urine output and concentrated urine","Excessive dilute urine output and extreme thirst","Elevated blood glucose and ketones","Fluid retention and weight gain"],1,
    "Diabetes insipidus results from insufficient ADH (antidiuretic hormone) secretion or response. Without ADH, the kidneys cannot concentrate urine, resulting in massive volumes of dilute urine (polyuria) and compensatory thirst (polydipsia).",
    "Diabetes insipidus: low ADH = dilute polyuria + polydipsia + high serum osmolality. SIADH: excess ADH = concentrated urine + low serum osmolality.",
    "DI vs SIADH: opposite conditions. DI = too little ADH (losing water). SIADH = too much ADH (retaining water).",
    {"0":"Low urine output and concentrated urine describe SIADH, the opposite of diabetes insipidus.","2":"Elevated blood glucose and ketones describe diabetic ketoacidosis, a different condition.","3":"Fluid retention and weight gain describe SIADH, not diabetes insipidus."}),

  // ===== FOUNDATIONS - Safety & Documentation (25) =====
  q("REX-PN","Fundamentals","Patient Safety",2,
    "A nurse is implementing fall prevention strategies for an elderly client. Which intervention is most effective?",
    ["Keep all four side rails up at all times","Ensure the call bell is within reach and the bed is in the lowest position","Apply a vest restraint during sleeping hours","Keep the room dark to promote sleep"],1,
    "Keeping the call bell within reach allows the client to call for assistance. The bed in the lowest position minimizes injury height if a fall occurs. Non-skid footwear, clear pathways, and adequate lighting are also essential.",
    "Fall prevention hierarchy: assessment, environment modification (low bed, call bell, lighting), then least-restrictive devices. Four side rails up = restraint.",
    "Fall prevention: low bed + call bell + lighting + non-skid footwear. Four side rails up is considered a restraint and is not appropriate.",
    {"0":"All four side rails up is considered a restraint and may increase fall risk if the client climbs over them.","2":"Vest restraints are a last resort and require a physician order; they are not a first-line fall prevention measure.","3":"A dark room increases fall risk; adequate night lighting is essential for safe navigation."}),

  q("RPN-CAT","Fundamentals","Patient Safety",3,
    "The nurse finds a client on the floor after a fall. The priority action is to:",
    ["Immediately help the client back to bed","Assess the client for injuries before moving them","Complete an incident report before providing care","Call the family to report the fall"],1,
    "The priority is to assess the client for injuries before moving them. Moving a client with a potential spinal or skeletal injury could worsen the injury. After assessment, provide appropriate care, notify the provider, and complete an incident report.",
    "Post-fall priority: assess for injury FIRST, then provide care, notify provider, complete incident report. Never move before assessing.",
    "Fall response: assess before moving. Look for head injury, fractures, and neurological changes.",
    {"0":"Moving the client without assessment could worsen a spinal injury, hip fracture, or head injury.","2":"The incident report is important but comes after ensuring client safety through assessment and care.","3":"Notifying the family is appropriate but not the priority; the client's immediate safety and assessment come first."}),

  q("REX-PN","Fundamentals","Patient Safety",2,
    "A nurse suspects a co-worker is diverting controlled substances. The appropriate action is to:",
    ["Confront the co-worker directly","Report the concern to the nurse manager or supervisor","Ignore it if client care is not affected","Discuss the concern with other staff members"],1,
    "Suspected drug diversion must be reported to the nurse manager or supervisor immediately. The nurse has a legal and ethical obligation to report. Investigation protects both clients and the nurse involved.",
    "Drug diversion: report to supervisor immediately. Never confront the suspected individual, ignore the behavior, or discuss with peers.",
    "Diversion questions: the correct answer is always to report through proper channels, never to confront or gossip.",
    {"0":"Confronting the co-worker is not safe and may compromise the investigation.","2":"Ignoring diversion endangers clients and enables substance abuse; it is a professional obligation to report.","3":"Discussing with peers is gossip, not proper reporting, and could constitute defamation."}),

  q("REX-PN","Fundamentals","Documentation",2,
    "A nurse makes an error in the paper medical record. The correct method to correct it is to:",
    ["Use white correction fluid to cover the error","Draw a single line through the error, write 'error,' date, time, and initial it","Completely black out the error with a marker","Remove the page and rewrite the entry"],1,
    "A single line through the error maintains the original entry's visibility while indicating it was an error. Dating, timing, and initialing the correction provides accountability and maintains the legal integrity of the medical record.",
    "Charting corrections: single line, write 'error,' date, time, initials. Never erase, white-out, or make entries illegible.",
    "Documentation correction: single line through error + 'error' + date/time/initials. This preserves legal integrity.",
    {"0":"White-out suggests tampering and makes the original entry unreadable, potentially constituting fraud.","2":"Blacking out entries makes them illegible and suggests an attempt to hide information.","3":"Removing pages is considered destruction of a legal document and is prohibited."}),

  q("RPN-CAT","Fundamentals","Documentation",3,
    "The nurse is charting using the SBAR communication framework. The 'A' component represents:",
    ["Actions taken by the nurse","Assessment and analysis of the situation","Attending physician's orders","Allergies of the client"],1,
    "SBAR stands for Situation, Background, Assessment, and Recommendation. The Assessment component includes the nurse's clinical analysis and judgment about what is happening with the client.",
    "SBAR: Situation (what's happening now), Background (relevant history), Assessment (nurse's analysis), Recommendation (what you think should be done).",
    "SBAR questions test understanding of each component. Assessment = nurse's clinical analysis and judgment.",
    {"0":"Actions taken would be part of documentation but are not the 'A' in SBAR.","2":"Physician orders are not part of the SBAR framework; SBAR is a nurse-to-provider communication tool.","3":"Allergies are part of the Background component, not the Assessment."}),

  q("REX-PN","Fundamentals","Patient Safety",3,
    "A nurse is caring for a client who is receiving continuous pulse oximetry. The SpO2 reading suddenly drops to 75%. The first action is to:",
    ["Document the finding and recheck in 30 minutes","Assess the client and check the sensor placement","Immediately intubate the client","Increase the oxygen to 100% without assessment"],1,
    "A sudden SpO2 drop should prompt immediate client assessment and sensor check. Common causes include sensor displacement, poor perfusion, nail polish, or hypothermia. If the client shows signs of respiratory distress, intervene immediately.",
    "Pulse oximetry troubleshooting: always assess the client and sensor first. Common false readings: nail polish, cold extremities, poor perfusion, motion artifact.",
    "Sudden SpO2 drop: assess the client AND the equipment before intervening. Technology can malfunction.",
    {"0":"A SpO2 of 75% requires immediate assessment, not delayed documentation.","2":"Intubation is a medical procedure requiring provider assessment; the nurse should first assess and troubleshoot.","3":"Increasing oxygen without assessing the cause may mask the real problem; always assess first."}),

  q("REX-PN","Fundamentals","Documentation",2,
    "Which documentation entry is most appropriate for a nurse's note?",
    ["Client seems to be in a lot of pain","Client rates pain 8/10, grimacing, guarding right lower abdomen","Client is being difficult and non-compliant","Doctor was notified and didn't seem concerned"],1,
    "Documentation should be objective, specific, and measurable. Using a pain scale (8/10) and describing observable behaviors (grimacing, guarding) provides clear, defensible documentation that other providers can use for clinical decisions.",
    "Document objectively: use numbers (pain scale), observable behaviors, and measurable findings. Avoid subjective opinions and judgmental language.",
    "Documentation questions: the correct answer uses specific, measurable, objective language. Avoid opinions and labels.",
    {"0":"'Seems to be' is vague and subjective; pain should be quantified and observable behaviors documented.","2":"'Difficult' and 'non-compliant' are judgmental labels; document specific behaviors instead.","3":"'Didn't seem concerned' is subjective; document the provider's name, time notified, and orders received."}),

  q("RPN-CAT","Fundamentals","Patient Safety",3,
    "A nurse is preparing to use a mechanical lift to transfer a client from bed to wheelchair. Which action is essential before the transfer?",
    ["Ensure the client weighs less than the lift's maximum weight capacity","Skip the sling inspection to save time","Have one staff member operate the lift independently","Lock only the wheelchair wheels"],0,
    "Checking the client's weight against the lift's weight capacity prevents equipment failure and injury. Additionally, the sling should be inspected for damage, both bed and wheelchair wheels should be locked, and adequate staff should be present.",
    "Mechanical lift safety: check weight capacity, inspect sling, lock all wheels, have adequate help. Never exceed the lift's rated capacity.",
    "Transfer device safety: weight capacity is the priority check. Equipment failure from overloading causes serious injuries.",
    {"1":"Sling inspection is essential for safety; damaged slings can tear during transfers, causing falls.","2":"Most lifts require two staff members for safe operation.","3":"Both the bed and wheelchair wheels must be locked to prevent movement during transfer."}),

  // ===== FOUNDATIONS - Vital Signs & Assessment (25) =====
  q("REX-PN","Fundamentals","Health Assessment",2,
    "When auscultating bowel sounds, the nurse should listen in each quadrant for at least:",
    ["5 seconds","1 minute","5 minutes before concluding absent bowel sounds","30 seconds"],2,
    "The nurse must listen for a minimum of 5 minutes in each quadrant before documenting absent bowel sounds. Bowel sounds may be irregular and infrequent but still present. Normal bowel sounds occur 5-30 times per minute.",
    "Absent bowel sounds: must listen for 5 full minutes per quadrant before documenting as absent. Normal: 5-30 clicks/gurgles per minute.",
    "Bowel sound assessment: listen 5 minutes before calling absent. RUQ is the preferred starting quadrant due to the ileocecal valve.",
    {"0":"Five seconds is far too brief; intermittent bowel sounds may be missed.","1":"One minute is insufficient; guidelines require 5 minutes per quadrant.","3":"Thirty seconds may miss intermittent bowel sounds in clients with decreased motility."}),

  q("REX-PN","Fundamentals","Health Assessment",2,
    "The nurse assesses a client's pupils and documents PERRLA. This abbreviation means:",
    ["Pupils Equal, Regular, Reactive, Light Adaptation","Pupils Equal, Round, Reactive to Light and Accommodation","Peripheral Eye Response Reactive to Light Assessment","Pupils Enlarged, Round, Reactive to Light and Accommodation"],1,
    "PERRLA indicates that both pupils are equal in size, round in shape, and react normally to both direct light (constriction) and accommodation (convergence when focusing on a near object).",
    "PERRLA: Pupils Equal, Round, Reactive to Light and Accommodation. Document abnormalities like sluggish response, unequal size, or non-reactive pupils.",
    "Pupil assessment: PERRLA is the normal finding. Unequal pupils (anisocoria) or fixed/dilated pupils indicate neurological emergency.",
    {"0":"The correct term is 'Round,' not 'Regular,' and 'Accommodation,' not 'Adaptation.'","2":"PERRLA is a specific pupil assessment abbreviation, not a peripheral eye test.","3":"'Enlarged' is incorrect; the E stands for 'Equal,' indicating both pupils are the same size."}),

  q("RPN-CAT","Fundamentals","Health Assessment",3,
    "A nurse is performing a neurological assessment using the Glasgow Coma Scale. A score of 8 or below indicates:",
    ["Normal neurological function","Mild brain injury","Severe brain injury with potential need for intubation","Moderate brain injury requiring observation"],2,
    "GCS 8 or below indicates severe brain injury and coma. The client likely cannot protect their airway and may require intubation. GCS 13-15 is mild, 9-12 is moderate, and 3-8 is severe.",
    "GCS ranges: 15 = normal, 13-15 = mild injury, 9-12 = moderate injury, 3-8 = severe injury/coma. Minimum score is 3.",
    "GCS score ≤8 = intubate. This is one of the most important critical care thresholds to remember.",
    {"0":"Normal neurological function is GCS 15, not 8.","1":"Mild brain injury is GCS 13-15, not 8 or below.","3":"Moderate brain injury is GCS 9-12, not 8 or below."}),

  q("REX-PN","Fundamentals","Health Assessment",1,
    "The nurse takes a client's temperature and obtains a reading of 36.4°C (97.5°F). This temperature is:",
    ["Hypothermic and requires immediate intervention","Within normal range","Febrile and requires antipyretics","Indicative of heat stroke"],1,
    "Normal body temperature ranges from 36.1°C to 37.8°C (97°F to 100°F) orally. A reading of 36.4°C is within normal limits. Hypothermia is below 35°C (95°F), and fever begins above 38°C (100.4°F).",
    "Normal temperature: 36.1-37.8°C (97-100°F) oral. Hypothermia: <35°C. Fever: >38°C. Hyperthermia: >40°C.",
    "Temperature assessment: know normal ranges for all routes. Rectal is highest, axillary is lowest.",
    {"0":"Hypothermia is defined as temperature below 35°C (95°F); 36.4°C is within normal range.","2":"Fever is defined as temperature above 38°C (100.4°F); 36.4°C is not febrile.","3":"Heat stroke involves temperatures above 40°C (104°F) with altered mental status."}),

  q("REX-PN","Fundamentals","Health Assessment",2,
    "When measuring blood pressure, a cuff that is too small will produce a reading that is:",
    ["Falsely low","Falsely high","Accurate regardless of cuff size","Unreadable"],1,
    "A cuff that is too small does not fully compress the brachial artery, requiring higher pressure to occlude blood flow. This produces a falsely elevated reading. The cuff bladder should cover 80% of the arm circumference.",
    "BP cuff sizing: too small = falsely high, too large = falsely low. Cuff bladder should cover 80% of arm circumference.",
    "BP cuff size questions: always remember small cuff = high reading, large cuff = low reading.",
    {"0":"A falsely low reading results from a cuff that is too large, not too small.","2":"Cuff size significantly affects accuracy; proper sizing is essential for correct readings.","3":"The reading will be obtained but will be inaccurately elevated."}),

  q("RPN-CAT","Fundamentals","Health Assessment",3,
    "A nurse assesses a client and finds a blood pressure of 168/96 mmHg, headache, and blurred vision. This represents:",
    ["Stage 1 hypertension requiring lifestyle modifications","Hypertensive urgency requiring prompt medical evaluation","Normal blood pressure with incidental symptoms","White coat hypertension"],1,
    "A BP of 168/96 with symptoms (headache, blurred vision) represents hypertensive urgency. This requires prompt evaluation and treatment to lower BP gradually over 24-48 hours, unlike hypertensive emergency which requires immediate IV medication.",
    "Hypertensive urgency: severely elevated BP WITH symptoms but no acute target organ damage. Hypertensive emergency: BP elevation WITH acute organ damage (encephalopathy, MI, aortic dissection).",
    "Distinguish hypertensive urgency (symptoms, no organ damage) from emergency (organ damage present). Treatment urgency differs.",
    {"0":"Stage 1 hypertension is 130-139/80-89; this reading is much higher and symptomatic.","2":"A BP of 168/96 with symptoms is not normal and requires medical attention.","3":"White coat hypertension is elevated BP only in clinical settings; the symptoms suggest true hypertension."}),

  // ===== LEADERSHIP & DELEGATION (50) =====
  q("REX-PN","Delegation","Delegation and Scope of Practice",2,
    "The RPN is delegating tasks for the shift. Which task can be safely delegated to an unregulated care provider (UCP)?",
    ["Administering oral medications to a stable client","Performing a dressing change on a new surgical wound","Ambulating a stable postoperative client with assistance","Assessing a client's lung sounds after bronchodilator therapy"],2,
    "Ambulating a stable postoperative client is within the UCP's scope as it does not require clinical judgment. It involves assisting with mobility under established parameters for a stable client.",
    "Delegation to UCPs: routine, predictable tasks for stable clients. No assessment, teaching, medication administration, or clinical judgment tasks.",
    "Delegation questions: if the task requires clinical judgment, assessment, or medication, it stays with the nurse.",
    {"0":"Medication administration is a regulated nursing act and cannot be delegated to UCPs.","1":"Dressing changes on new surgical wounds require wound assessment, which is a nursing responsibility.","3":"Lung sound assessment is a clinical assessment skill that requires nursing judgment."}),

  q("RPN-CAT","Delegation","Delegation and Scope of Practice",3,
    "An RPN is working on a medical unit with one RN and two UCPs. A new admission arrives. Which task should the RPN perform?",
    ["Ask the UCP to take the admission vital signs and history","Collect admission data and perform the initial assessment","Delegate the entire admission process to the RN","Have the UCP orient the client to the room while the RPN completes the assessment"],3,
    "The RPN can have the UCP orient the client to the room (non-clinical task) while the RPN performs the admission assessment, which requires clinical judgment. This efficiently uses the team's skills within proper scope.",
    "Efficient delegation: split tasks by scope. UCPs handle orientation and comfort; the nurse handles assessment, data collection, and clinical tasks.",
    "Team-based care: look for answers that appropriately divide work by scope while maximizing efficiency.",
    {"0":"The UCP can take vital signs but cannot collect a health history, which requires clinical judgment.","1":"While the RPN can collect data, performing the initial comprehensive assessment is typically an RN function in many jurisdictions.","2":"Delegating the entire admission to the RN when the RPN can assist wastes team resources."}),

  q("REX-PN","Delegation","Delegation and Scope of Practice",3,
    "Which principle should the RPN apply when deciding whether to accept a delegated task?",
    ["Accept all tasks delegated by the RN without question","Ensure the task is within the RPN's scope and the RPN has the competence to perform it","Perform any task if trained on it during nursing school","Accept the task if the client requests the RPN to perform it"],1,
    "The RPN must ensure any delegated task is within their legal scope of practice AND that they have the current competence to perform it safely. Both conditions must be met before accepting a delegated task.",
    "Accepting delegation requires two conditions: within scope of practice AND current competence. Both must be met.",
    "Delegation acceptance: scope + competence = accept. Missing either = decline and communicate the reason.",
    {"0":"Blindly accepting all tasks may lead to practicing outside one's scope, which is unsafe and potentially illegal.","2":"Training in school does not guarantee current competence; skills require ongoing practice and education.","3":"Client preference does not determine scope of practice; the nurse must ensure the task is within their scope."}),

  q("REX-PN","Delegation","Delegation and Scope of Practice",2,
    "The RPN receives a client with new-onset chest pain. The appropriate action is to:",
    ["Independently manage the chest pain with PRN medications","Perform initial assessment, administer prescribed treatments, and notify the RN and provider","Wait for the RN to assess the client first","Delegate vital sign monitoring to the UCP and continue with other tasks"],1,
    "The RPN should perform an initial assessment within their scope, administer any prescribed treatments (nitroglycerin, oxygen), and promptly notify the RN and provider. New-onset chest pain requires rapid assessment and intervention.",
    "New-onset chest pain: assess, intervene within scope (O2, NTG if prescribed), and escalate immediately. Do not delay assessment or intervention.",
    "Chest pain questions for RPNs: assess AND intervene within scope, then escalate. RPNs do not independently manage acute chest pain.",
    {"0":"RPNs do not independently manage acute chest pain; they assess, intervene within scope, and escalate.","2":"Waiting for the RN delays assessment and potentially life-saving interventions.","3":"New-onset chest pain requires the nurse's direct assessment, not delegation to a UCP."}),

  q("RPN-CAT","Delegation","Delegation and Scope of Practice",3,
    "An RPN is providing care for 6 clients. One client becomes unstable with rapidly declining vital signs. The RPN should:",
    ["Continue caring for all 6 clients equally","Prioritize the unstable client, delegate stable client tasks to appropriate team members, and notify the RN","Leave the other 5 clients unattended to focus solely on the unstable client","Ask the UCP to monitor the unstable client"],1,
    "When a client becomes unstable, the RPN must reprioritize: focus on the unstable client, delegate appropriate tasks for stable clients to team members, and notify the RN for assistance with the complex clinical situation.",
    "Priority changes require dynamic delegation. Unstable client = nurse's direct attention. Stable client tasks = delegate to appropriate team members.",
    "Prioritization with delegation: the most unstable client gets the nurse's attention. Redistribute stable client tasks to appropriate team members.",
    {"0":"Equal attention to all clients is not appropriate when one is critically unstable and requires immediate intervention.","2":"Abandoning 5 clients is patient abandonment; the nurse must arrange appropriate coverage through delegation.","3":"UCPs cannot monitor unstable clients; this requires nursing assessment and clinical judgment."}),

  q("REX-PN","Leadership","Leadership and Management",2,
    "A nurse notices that hand hygiene compliance on the unit has decreased. Which leadership action is most effective?",
    ["Report the staff to management for disciplinary action","Role-model proper hand hygiene and provide education on its importance","Ignore the issue as it is not the nurse's responsibility","Post a sign in the break room about handwashing"],1,
    "Role-modeling and education are the most effective leadership approaches for improving hand hygiene compliance. Evidence shows that peer influence and visible adherence by leaders significantly improve team compliance rates.",
    "Leadership: role-modeling + education = most effective behavior change. Punitive measures alone are less effective than positive role-modeling.",
    "Leadership questions: positive approaches (education, role-modeling) are usually correct. Punitive approaches are usually incorrect.",
    {"0":"Immediate disciplinary action without education is punitive and does not address the root cause.","2":"All nurses have a professional responsibility to promote infection prevention practices.","3":"A sign alone is a passive intervention; active role-modeling and education are more effective."}),

  q("RPN-CAT","Leadership","Leadership and Management",3,
    "During shift handoff, the RPN notices critical information was omitted from the previous nurse's report. The best action is to:",
    ["Ignore it and provide care based on available information","Contact the off-going nurse to obtain the missing information","Assume the information is irrelevant","Wait until the next shift to address the gap"],1,
    "Contacting the off-going nurse ensures continuity of care and prevents errors from incomplete information. Shift handoff is a high-risk time for communication failures, which are a leading cause of adverse events.",
    "Handoff communication gaps: always clarify before providing care. Incomplete handoff is a leading cause of adverse events.",
    "Handoff questions: incomplete information = clarify immediately. Never assume or ignore gaps in client data.",
    {"0":"Providing care without critical information risks making clinical errors that could harm the client.","2":"Assuming information is irrelevant could lead to missed treatments or dangerous omissions.","3":"Waiting until the next shift could result in hours of care based on incomplete information."}),

  q("REX-PN","Leadership","Leadership and Management",3,
    "A nurse is concerned about a physician's order that seems inappropriate for the client's condition. The nurse should:",
    ["Follow the order as written since the physician knows best","Clarify the order with the prescribing physician before carrying it out","Refuse to carry out the order and document the refusal","Ask another nurse to carry out the order instead"],1,
    "The nurse has a professional obligation to question any order that seems unclear, inappropriate, or potentially harmful. Clarifying with the prescriber protects the client and ensures safe care. Blindly following orders can constitute negligence.",
    "Questionable orders: always clarify before carrying out. The nurse is the last safety net before medications or treatments reach the client.",
    "Questioning orders: clarify with the prescriber. The nurse is independently accountable for carrying out orders safely.",
    {"0":"Following a potentially inappropriate order blindly violates the nurse's professional obligation and could constitute negligence.","2":"Refusing without clarification is premature; the order may have a valid rationale that the nurse is unaware of.","3":"Transferring responsibility to another nurse does not resolve the safety concern and shifts liability inappropriately."}),

  q("REX-PN","Leadership","Leadership and Management",2,
    "The RPN is assigned to precept a new graduate nurse. Which teaching strategy is most effective?",
    ["Allow the new graduate to practice independently without supervision","Demonstrate procedures, observe return demonstrations, and provide constructive feedback","Tell the new graduate to read the policy manual and then begin working","Focus only on speed and efficiency rather than technique"],1,
    "Effective preceptorship involves demonstration, supervised practice (return demonstration), and constructive feedback. This approach builds confidence and competence while ensuring patient safety during the learning process.",
    "Preceptorship: see one, do one, teach one. Effective preceptors demonstrate, observe, and provide timely feedback in a supportive environment.",
    "Precepting questions: the correct answer involves active teaching (demonstrate + supervise + feedback), not passive learning.",
    {"0":"Unsupervised practice by a new graduate is unsafe and does not provide the learning support needed.","2":"Reading alone is insufficient; clinical skills require hands-on practice with guidance.","3":"Emphasizing speed over technique can establish unsafe habits and compromises patient safety."}),

  q("RPN-CAT","Leadership","Leadership and Management",3,
    "A conflict arises between two team members about client care responsibilities. The RPN team leader should:",
    ["Ignore the conflict and let the staff resolve it themselves","Facilitate a private discussion to understand each person's perspective and find a resolution","Take sides with the more experienced nurse","Report both staff members to human resources"],1,
    "Effective conflict resolution involves active listening, understanding each party's perspective, finding common ground, and reaching a mutually acceptable solution. Private discussion prevents public embarrassment and promotes open communication.",
    "Conflict resolution: listen to both sides privately, find common ground, focus on the shared goal (client care), reach a collaborative solution.",
    "Conflict resolution questions: the correct answer involves listening, understanding, and collaborative problem-solving.",
    {"0":"Ignoring conflict allows it to escalate and can negatively impact client care and team morale.","2":"Taking sides creates bias, erodes trust, and does not resolve the underlying conflict.","3":"HR referral is premature; the team leader should attempt resolution first."}),

  q("REX-PN","Leadership","Leadership and Management",2,
    "The nurse is participating in a quality improvement initiative. Which data source is most useful for identifying areas of improvement?",
    ["Staff opinions only","Patient safety incident reports and outcome data","The nurse manager's personal observations","Social media reviews"],1,
    "Patient safety incident reports and outcome data provide objective, measurable evidence of areas needing improvement. They identify patterns, trends, and system failures that can be addressed through targeted interventions.",
    "Quality improvement: use objective data (incident reports, outcome measures, audits). Evidence-based improvement > opinion-based change.",
    "QI questions: data-driven approaches using objective metrics are always correct. Subjective opinions alone are insufficient.",
    {"0":"Staff opinions are valuable input but must be combined with objective data for evidence-based improvement.","2":"Personal observations are subject to bias and do not represent comprehensive data collection.","3":"Social media reviews are unverified and not appropriate sources for clinical quality improvement."}),

  q("RPN-CAT","Leadership","Ethical Practice",3,
    "A client with terminal cancer refuses further treatment and requests comfort care only. The nurse's primary obligation is to:",
    ["Convince the client to continue treatment","Respect the client's autonomy and advocate for their wishes","Notify the family to override the client's decision","Discontinue all care including comfort measures"],1,
    "The principle of autonomy gives competent adults the right to make their own healthcare decisions, including refusing treatment. The nurse advocates for the client's wishes and ensures comfort measures are provided.",
    "Autonomy: competent adults have the right to refuse treatment. The nurse's role is to ensure informed decision-making and advocate for the client's wishes.",
    "Ethics questions: autonomy almost always takes priority when the client is competent and informed.",
    {"0":"Trying to convince the client violates their autonomy; the nurse should ensure informed consent, not coerce.","2":"A competent adult's decisions cannot be overridden by family members.","3":"Comfort care should continue; refusing treatment does not mean refusing all care."}),

  q("REX-PN","Leadership","Ethical Practice",3,
    "A nurse discovers that a colleague has been documenting assessments that were not actually performed. This is an example of:",
    ["Acceptable time management","Fraud and falsification of medical records","A minor documentation oversight","Efficient charting practice"],1,
    "Documenting assessments not performed is falsification of medical records, which is fraud. It is a criminal offense, violates professional standards, and endangers clients by creating an inaccurate clinical picture.",
    "Documentation fraud: recording assessments or interventions not performed is falsification. This is grounds for termination, license revocation, and criminal prosecution.",
    "Falsification of records is always wrong, always reportable, and has legal and professional consequences.",
    {"0":"Documenting unperformed assessments is never acceptable regardless of time pressures.","2":"This is not a minor oversight; it is deliberate falsification of a legal document.","3":"Skipping assessments but documenting them as done is fraud, not efficiency."}),

  q("RPN-CAT","Leadership","Ethical Practice",3,
    "The nurse is caring for a client whose religious beliefs prohibit blood transfusions. The client is hemorrhaging and needs a transfusion to survive. The nurse should:",
    ["Administer the transfusion to save the client's life","Respect the client's refusal and provide alternative supportive care","Contact the hospital ethics committee to override the client's wishes","Convince the client that their beliefs are wrong"],1,
    "A competent adult's right to refuse treatment based on religious beliefs must be respected, even if refusal may result in death. The nurse provides supportive care within the client's accepted parameters and ensures the decision is documented.",
    "Religious refusal of treatment: respect autonomy, provide alternative care, document thoroughly, ensure the client is competent and informed.",
    "Autonomy + religion: competent adults can refuse life-saving treatment for religious reasons. The nurse's role is to support, not override.",
    {"0":"Administering a transfusion against the client's wishes is assault and battery, violating both ethical and legal standards.","2":"The ethics committee cannot override a competent adult's autonomous decision.","3":"Attempting to change the client's religious beliefs is disrespectful and violates cultural sensitivity."}),

  // ===== COMMUNITY HEALTH (50) =====
  q("REX-PN","Community Health","Community Health Nursing",2,
    "A community health nurse is conducting a home visit for a client recently discharged after hip replacement surgery. The priority assessment is:",
    ["The client's dietary preferences","Home safety assessment for fall risks","The client's social media usage","The neighbors' contact information"],1,
    "A home safety assessment identifies fall hazards (loose rugs, poor lighting, stairs, clutter) that could cause reinjury after hip replacement. Environmental modification is a key nursing intervention in community health.",
    "Home visits post-surgery: assess safety hazards, medication management, wound care ability, and support system before assessing preferences.",
    "Post-surgical home visit priority: safety first, then functional assessment, medication management, and teaching.",
    {"0":"Dietary preferences are important but secondary to preventing falls and ensuring safety.","2":"Social media usage is not relevant to post-surgical home care assessment.","3":"Neighbor contact information may be useful but is not the priority assessment."}),

  q("RPN-CAT","Community Health","Community Health Nursing",3,
    "A community health nurse is planning a diabetes education program. Which approach best addresses health literacy concerns?",
    ["Use complex medical terminology to ensure accuracy","Use plain language, visual aids, and teach-back method","Provide only written materials for the client to read at home","Assume all clients understand medical terminology"],1,
    "Plain language with visual aids and the teach-back method ensure comprehension across all literacy levels. The teach-back method asks clients to explain information in their own words, confirming understanding.",
    "Health literacy: use plain language (grade 6 reading level), visual aids, teach-back method. Nearly half of adults have limited health literacy.",
    "Health education questions: plain language + visual aids + teach-back = best practice. Complex terminology creates barriers.",
    {"0":"Complex medical terminology creates barriers to understanding and reduces health literacy.","2":"Written materials alone are insufficient for clients with low literacy; multimodal approaches are needed.","3":"Assuming understanding leads to miscommunication and poor health outcomes."}),

  q("REX-PN","Community Health","Community Health Nursing",2,
    "A nurse is teaching a new mother about infant immunization schedules. Which statement indicates the mother needs further education?",
    ["My baby will receive the first hepatitis B vaccine at birth","I should bring my baby for immunizations at 2, 4, 6, and 12 months","I can skip the flu vaccine since my baby is healthy","I will keep a record of all immunizations"],2,
    "Influenza vaccine is recommended for all children starting at 6 months of age, regardless of health status. Skipping vaccines based on perceived health increases vulnerability to preventable diseases.",
    "Infant immunization schedule: HepB at birth, DTaP/IPV/Hib/PCV/RV at 2, 4, 6 months. Influenza starting at 6 months annually.",
    "Immunization questions with 'further education needed': look for the incorrect or dangerous statement that the parent believes is correct.",
    {"0":"Hepatitis B vaccine at birth is correct; this is standard protocol.","1":"The routine immunization schedule includes visits at 2, 4, 6, and 12 months.","3":"Keeping immunization records is appropriate and encouraged."}),

  q("RPN-CAT","Community Health","Community Health Nursing",3,
    "A community health nurse is conducting a presentation on disease prevention. Primary prevention includes:",
    ["Screening for early detection of disease","Rehabilitation after illness","Immunization and health promotion activities","Treatment of existing conditions"],2,
    "Primary prevention aims to prevent disease before it occurs through immunization, health education, lifestyle modifications, and environmental measures. Secondary prevention involves early detection (screening), and tertiary prevention involves rehabilitation.",
    "Prevention levels: primary = prevent disease (vaccines, education), secondary = early detection (screenings), tertiary = rehabilitation/minimize disability.",
    "Prevention level questions: primary = before disease (prevention), secondary = early disease (screening), tertiary = after disease (rehab).",
    {"0":"Screening for early detection is secondary prevention, not primary.","1":"Rehabilitation is tertiary prevention, aimed at restoring function after illness.","3":"Treating existing conditions falls under secondary or tertiary prevention."}),

  q("REX-PN","Community Health","Community Health Nursing",2,
    "A nurse is educating a family about lead poisoning prevention in children. Which recommendation is most important?",
    ["Allow children to play near old painted surfaces","Test homes built before 1978 for lead paint and ensure children do not ingest paint chips","Give children calcium supplements to prevent lead absorption","Keep windows open to ventilate lead dust"],0,
    "Homes built before 1978 may contain lead-based paint. Children are at highest risk from ingesting paint chips or inhaling lead dust. Testing and remediation of lead paint is the most important prevention measure.",
    "Lead poisoning prevention: test homes built before 1978, prevent paint chip ingestion, wash hands frequently, maintain good nutrition (iron, calcium, vitamin C reduce absorption).",
    "Lead poisoning questions: home age (pre-1978) and paint chip prevention are key. Good nutrition helps reduce absorption but does not replace environmental intervention.",
    {"0":"Playing near old painted surfaces increases lead exposure risk; children should be kept away from deteriorating paint.","2":"Calcium helps reduce lead absorption but does not prevent exposure; environmental intervention is primary.","3":"Opening windows may stir up lead dust and increase exposure; professional remediation is needed."}),

  q("REX-PN","Community Health","Community Health Nursing",2,
    "A nurse is providing anticipatory guidance to parents of a 4-month-old infant. Which topic is most appropriate?",
    ["Toilet training readiness","Introduction of solid foods at 4-6 months and choking prevention","Setting limits and discipline strategies","Preparing for kindergarten readiness"],1,
    "At 4-6 months, anticipatory guidance focuses on developmental milestones, introduction of solid foods (iron-fortified cereals first), choking hazards, sleep safety, and infant CPR education for caregivers.",
    "Anticipatory guidance is age-specific: match developmental milestones to the child's age. 4-6 months = solid food introduction, choking prevention, continued immunizations.",
    "Anticipatory guidance questions: match the teaching to the developmental stage. The answer must be age-appropriate.",
    {"0":"Toilet training readiness typically occurs at 18-24 months, not 4 months.","2":"Setting limits and discipline are appropriate for toddlers (12+ months), not 4-month-old infants.","3":"Kindergarten readiness is appropriate for 4-5 year olds, not infants."}),

  q("RPN-CAT","Community Health","Community Health Nursing",3,
    "A home health nurse is assessing an elderly client living alone. Which finding is the greatest safety concern?",
    ["The client watches television for 4 hours daily","Multiple throw rugs on hardwood floors throughout the home","The client eats frozen meals regularly","The client reads with a magnifying glass"],1,
    "Throw rugs on hardwood floors are a significant fall hazard, especially for elderly clients. Falls are the leading cause of injury-related death in adults over 65. Removing rugs or securing them with non-slip backing reduces fall risk.",
    "Home safety for elderly: remove throw rugs, improve lighting, install grab bars, remove clutter, ensure non-skid surfaces. Falls are the #1 injury cause in elderly.",
    "Home safety questions: fall hazards (rugs, poor lighting, stairs) are always the greatest safety concern for elderly clients.",
    {"0":"Watching television is a sedentary activity but not an immediate safety hazard.","2":"Frozen meals, while not ideal nutritionally, are not an immediate safety concern.","3":"Using a magnifying glass for reading indicates vision changes but is not an immediate safety hazard."}),

  q("REX-PN","Community Health","Community Health Nursing",2,
    "The nurse is educating the community about food safety. Which instruction is most important for preventing foodborne illness?",
    ["Cook all meats to the same internal temperature","Use separate cutting boards for raw meat and ready-to-eat foods to prevent cross-contamination","Thaw frozen meat on the kitchen counter overnight","Wash hands only before handling food, not after"],1,
    "Cross-contamination between raw meats and ready-to-eat foods is a leading cause of foodborne illness. Using separate cutting boards prevents transfer of harmful bacteria like Salmonella and E. coli to foods that will not be cooked further.",
    "Food safety basics: separate raw and cooked, cook to proper temperatures, refrigerate promptly, wash hands before AND after handling food.",
    "Food safety questions: cross-contamination prevention and proper cooking temperatures are the most common correct answers.",
    {"0":"Different meats require different internal temperatures; poultry needs 165°F, ground meat 160°F, and steaks 145°F.","2":"Thawing on the counter allows the outer surface to reach the danger zone (40-140°F); thaw in the refrigerator, cold water, or microwave.","3":"Hands should be washed before AND after handling food, especially raw meat."}),

  q("RPN-CAT","Community Health","Community Health Nursing",3,
    "A public health nurse is investigating a cluster of foodborne illness cases linked to a restaurant. This investigation is an example of:",
    ["Primary prevention","Tertiary prevention","Disease surveillance and epidemiological investigation","Health promotion"],2,
    "Investigating disease clusters is a core function of epidemiology and disease surveillance. The investigation identifies the source, prevents further spread, and informs public health interventions to protect the community.",
    "Epidemiology functions: disease surveillance, outbreak investigation, contact tracing, identifying patterns, and implementing control measures.",
    "Outbreak investigation questions: these are epidemiological functions focused on identifying source, mode of transmission, and control measures.",
    {"0":"Primary prevention prevents disease before it occurs; investigating an existing outbreak is not primary prevention.","1":"Tertiary prevention involves rehabilitation; outbreak investigation aims to stop transmission.","3":"Health promotion is a broad strategy for improving population health, not a specific outbreak response."}),

  q("REX-PN","Community Health","Community Health Nursing",2,
    "A nurse is teaching a group of adolescents about substance abuse prevention. Which approach is evidence-based?",
    ["Use fear tactics to scare teens away from drugs","Provide interactive skill-building activities including refusal skills and peer resistance strategies","Lecture about the legal consequences only","Show graphic images of drug-related injuries"],1,
    "Evidence-based substance abuse prevention programs focus on building life skills, refusal skills, and social competence. Interactive approaches that develop decision-making and peer resistance skills are more effective than fear-based tactics.",
    "Adolescent health education: interactive, skill-building approaches are more effective than fear-based tactics for behavior change.",
    "Health education approaches: interactive skill-building > fear tactics > lectures. Evidence supports active learning methods.",
    {"0":"Fear tactics have been shown to be ineffective and may actually increase curiosity about substances.","2":"Lecturing about legal consequences alone is not sufficient; teens need practical refusal and decision-making skills.","3":"Graphic images may cause trauma and have not been shown to effectively prevent substance abuse."}),

  q("REX-PN","Community Health","Community Health Nursing",2,
    "A nurse is conducting a well-child visit for a 2-year-old. Developmental screening reveals the child says only 3 words. The nurse should:",
    ["Reassure the parents that this is normal for a 2-year-old","Refer the child for a comprehensive developmental evaluation","Wait until age 3 to reassess language development","Recommend the parents speak more slowly to the child"],1,
    "By age 2, children should typically use at least 50 words and begin combining two words. Three words at 24 months indicates significant language delay requiring comprehensive evaluation by a speech-language pathologist.",
    "Language milestones: 12 months = 1-3 words, 18 months = 10-25 words, 24 months = 50+ words with 2-word phrases. Delays warrant referral.",
    "Developmental milestone questions: know the expected milestones and when to refer for evaluation. Early intervention improves outcomes.",
    {"0":"Three words at age 2 is well below the expected 50+ words and is not normal.","2":"Waiting delays intervention during the critical period for language development; early referral is essential.","3":"While parental interaction helps, significant delay requires professional evaluation and intervention."}),

  q("RPN-CAT","Community Health","Community Health Nursing",3,
    "A community health nurse is working with a population of migrant farm workers. Which health issue should the nurse prioritize?",
    ["Recreational activity planning","Pesticide exposure assessment, heat-related illness prevention, and access to healthcare services","Interior decorating of worker housing","Entertainment options for workers"],1,
    "Migrant farm workers face unique occupational health risks including pesticide exposure, heat stress, musculoskeletal injuries, and limited healthcare access. Addressing these systemic issues is the primary role of the community health nurse.",
    "Occupational health for farm workers: pesticide safety, heat illness prevention, ergonomic injury prevention, healthcare access, and immunization status.",
    "Community health priority: identify the population's specific health risks and barriers to care. Occupational hazards take priority over social needs.",
    {"0":"Recreational activities are secondary to addressing immediate occupational health hazards and healthcare access.","2":"Housing conditions may be assessed but interior decorating is not a health priority.","3":"Entertainment is not within the scope of community health nursing priorities for this population."}),

  q("REX-PN","Community Health","Community Health Nursing",3,
    "The nurse is planning a community health education session on colorectal cancer screening. The target audience should include adults beginning at age:",
    ["30","45","55","65"],1,
    "Current guidelines recommend colorectal cancer screening beginning at age 45 for average-risk adults. Earlier screening (age 40 or 10 years before youngest affected relative) is recommended for those with family history of colorectal cancer.",
    "Colorectal cancer screening: begin at age 45 for average risk. Options include colonoscopy every 10 years, FIT annually, or stool DNA every 3 years.",
    "Cancer screening age guidelines: know when to start screening for colorectal (45), breast (40-50), cervical (21-25), and lung cancer (50-80 with smoking history).",
    {"0":"Age 30 is too early for average-risk colorectal cancer screening.","2":"Age 55 is too late; screening should begin at 45 for average-risk individuals.","3":"Age 65 would miss many years of potential early detection."}),

  // ===== FOUNDATIONS - Wound Care (25) =====
  q("REX-PN","Fundamentals","Wound Care",2,
    "The nurse is assessing a pressure injury and notes full-thickness skin loss with visible adipose tissue but no exposed bone or tendon. This is classified as a Stage:",
    ["Stage 1","Stage 2","Stage 3","Stage 4"],2,
    "Stage 3 pressure injuries involve full-thickness skin loss. Subcutaneous fat (adipose tissue) may be visible, but bone, tendon, or muscle are not exposed. Slough may be present but does not obscure the depth of tissue loss.",
    "Pressure injury staging: Stage 1 = intact skin, nonblanchable redness. Stage 2 = partial thickness. Stage 3 = full thickness with visible fat. Stage 4 = exposed bone/tendon/muscle.",
    "Pressure injury staging: the key differentiator between Stage 3 and 4 is whether bone, tendon, or muscle is exposed.",
    {"0":"Stage 1 has intact skin with nonblanchable erythema; there is no skin loss.","1":"Stage 2 involves partial-thickness skin loss presenting as a shallow open ulcer or blister.","3":"Stage 4 involves full-thickness tissue loss with exposed bone, tendon, or muscle."}),

  q("RPN-CAT","Fundamentals","Wound Care",3,
    "A client has a wound that is healing by secondary intention. The nurse understands that this means:",
    ["The wound edges are approximated with sutures","The wound is left open to heal from the bottom up with granulation tissue","The wound is covered with a skin graft","The wound is closed 3-5 days after the initial injury"],1,
    "Secondary intention healing occurs when wound edges cannot be approximated (surgical wounds left open, pressure ulcers, burns). The wound heals from the bottom up through granulation tissue formation, contraction, and epithelialization.",
    "Wound healing types: primary = edges approximated (sutured). Secondary = open, heals from bottom up. Tertiary = delayed closure (3-5 days post-injury).",
    "Healing intention questions: primary = sutured closed, secondary = open and granulating, tertiary = delayed primary closure.",
    {"0":"Approximation with sutures describes primary intention healing.","2":"Skin grafting is a separate surgical intervention, not secondary intention healing.","3":"Closure 3-5 days after injury describes tertiary (delayed primary) intention healing."}),

  q("REX-PN","Fundamentals","Wound Care",2,
    "When irrigating a wound, the nurse uses which solution and pressure?",
    ["Hydrogen peroxide at high pressure","Normal saline at 8-12 psi using a 35 mL syringe with a 19-gauge needle","Betadine at maximum pressure","Tap water at any pressure"],1,
    "Normal saline at 8-12 psi provides optimal wound cleansing. A 35 mL syringe with a 19-gauge needle delivers approximately 8 psi. This pressure is sufficient to remove debris without damaging granulation tissue.",
    "Wound irrigation: NS at 8-12 psi (35 mL syringe + 19-gauge needle). Too much pressure damages tissue; too little doesn't clean effectively.",
    "Wound irrigation: NS is the standard solution. The 35 mL syringe/19-gauge needle combination delivers the correct pressure.",
    {"0":"Hydrogen peroxide is cytotoxic to healing tissue and should not be used for wound irrigation.","2":"Betadine (povidone-iodine) damages fibroblasts and delays wound healing.","3":"Tap water is not sterile and is not the standard for wound irrigation."}),

  q("REX-PN","Fundamentals","Wound Care",3,
    "The nurse is caring for a client with a negative-pressure wound therapy (wound VAC) device. Which finding requires the nurse to stop therapy and notify the provider?",
    ["Mild discomfort during dressing changes","Bright red bleeding from the wound bed","Serous drainage in the canister","A slight whooshing sound from the device"],1,
    "Bright red bleeding from the wound bed during NPWT indicates possible vessel erosion or hemorrhage. This is a serious complication requiring immediate discontinuation and provider notification. NPWT should not be used on wounds with exposed blood vessels.",
    "Wound VAC complications: hemorrhage (stop immediately), wound infection, tissue damage. NPWT contraindicated over exposed vessels, necrotic tissue with eschar, or untreated osteomyelitis.",
    "Wound VAC questions: bleeding = stop therapy immediately. Serous drainage is expected. Know contraindications.",
    {"0":"Mild discomfort during dressing changes is common and manageable with analgesics.","2":"Serous drainage is an expected finding and indicates normal wound healing with NPWT.","3":"A slight whooshing sound indicates the device is functioning properly with adequate suction."}),

  q("RPN-CAT","Fundamentals","Wound Care",2,
    "A nurse is applying a wet-to-dry dressing to a wound with necrotic tissue. The purpose of this dressing is:",
    ["To keep the wound moist for optimal healing","Mechanical debridement of necrotic tissue","To prevent wound infection","To promote granulation tissue formation"],1,
    "Wet-to-dry dressings are used for mechanical debridement. The moist gauze is applied to the wound, and as it dries, it adheres to necrotic tissue. When removed, the dried gauze pulls away the necrotic tissue along with it.",
    "Wet-to-dry = mechanical debridement (removes necrotic tissue). Moist wound healing = promotes granulation. Know the purpose of each dressing type.",
    "Dressing purpose questions: wet-to-dry = debridement, hydrocolloid = moist healing, alginate = absorption. Match dressing to wound need.",
    {"0":"Wet-to-dry dressings actually dry out, removing tissue; moist wound healing uses different dressing types.","2":"While debridement reduces infection risk, the primary purpose of wet-to-dry is mechanical debridement.","3":"Granulation tissue may be damaged during wet-to-dry removal; other dressings better promote granulation."}),

  // ===== FOUNDATIONS - Perioperative Care (25) =====
  q("REX-PN","Fundamentals","Perioperative Care",2,
    "During the preoperative assessment, the nurse asks the client about current medications. Which medication is most important to report to the surgeon?",
    ["Daily multivitamin","Warfarin taken daily for atrial fibrillation","Occasional use of antacids","Melatonin for sleep"],1,
    "Warfarin increases bleeding risk during and after surgery. It typically needs to be held 5-7 days before surgery, and the INR must be checked to ensure adequate coagulation. The surgeon and anesthesiologist must be aware.",
    "Preoperative medication review: anticoagulants (warfarin, DOACs), antiplatelet agents (aspirin, clopidogrel), and herbal supplements (garlic, ginkgo, ginseng) increase bleeding risk.",
    "Preop medication questions: anticoagulants and herbal supplements with antiplatelet effects are always the priority to report.",
    {"0":"A daily multivitamin does not significantly affect surgical risk.","2":"Occasional antacid use does not pose significant surgical risk.","3":"Melatonin does not significantly affect surgical risk or anesthesia."}),

  q("RPN-CAT","Fundamentals","Perioperative Care",3,
    "A client in the PACU following general anesthesia develops stridor and use of accessory muscles. The nurse suspects:",
    ["Normal post-anesthesia recovery","Laryngospasm requiring immediate intervention","Mild sore throat from intubation","Anxiety from waking up in an unfamiliar environment"],1,
    "Stridor (high-pitched inspiratory sound) and accessory muscle use indicate upper airway obstruction. Laryngospasm is a serious post-anesthesia complication requiring immediate intervention: jaw thrust, positive pressure ventilation, and possibly succinylcholine.",
    "Post-anesthesia laryngospasm: stridor + accessory muscle use = airway emergency. Intervene with jaw thrust, positive pressure, and notify anesthesia immediately.",
    "PACU airway complications: stridor = upper airway obstruction (laryngospasm). Requires immediate intervention to prevent respiratory arrest.",
    {"0":"Stridor and accessory muscle use are abnormal findings indicating airway compromise, not normal recovery.","2":"A sore throat is common after intubation but does not cause stridor or accessory muscle use.","3":"Anxiety does not cause stridor; this is an objective sign of airway obstruction."}),

  q("REX-PN","Fundamentals","Perioperative Care",2,
    "The nurse is providing preoperative teaching about incentive spirometry. Which instruction is correct?",
    ["Use the spirometer only when feeling short of breath","Take a slow, deep breath through the mouthpiece, hold for 3-5 seconds, then exhale","Breathe as fast as possible into the device","Use the spirometer once a day after surgery"],1,
    "Incentive spirometry promotes deep breathing to prevent atelectasis. The client should inhale slowly and deeply through the mouthpiece, hold the breath for 3-5 seconds to allow alveolar expansion, then exhale normally. Use 10 times per hour while awake.",
    "Incentive spirometry: slow deep inhalation, hold 3-5 seconds, exhale. 10 repetitions every hour while awake. Prevents postoperative atelectasis and pneumonia.",
    "Incentive spirometry technique: slow and steady inhalation (not fast), hold breath, repeat frequently. This is the most common postoperative respiratory question.",
    {"0":"The spirometer should be used preventively on a regular schedule, not only when symptomatic.","2":"Fast breathing does not expand alveoli effectively; slow, deep breathing is required.","3":"Once a day is insufficient; the spirometer should be used at least 10 times per hour while awake."}),

  q("REX-PN","Fundamentals","Perioperative Care",3,
    "A postoperative client has not voided for 8 hours following surgery. The nurse should first:",
    ["Insert an indwelling urinary catheter immediately","Assess the bladder using a bladder scanner or palpation","Restrict fluid intake to prevent bladder distension","Document the finding and wait 24 hours"],1,
    "Assessing the bladder determines if urinary retention is present. A bladder scanner provides a noninvasive measurement of bladder volume. If the bladder is distended (>300-400 mL), interventions such as running water, warm water over perineum, or catheterization may be needed.",
    "Postoperative urinary retention: assess bladder first (scan/palpate), try noninvasive measures (warm water, running water), then catheterize if unsuccessful.",
    "Postop voiding: 6-8 hours without voiding = assess bladder. Try conservative measures before catheterization to reduce infection risk.",
    {"0":"Catheterization is an invasive procedure that should not be the first intervention; assess the bladder first.","2":"Restricting fluids would worsen the situation; adequate hydration promotes voiding.","3":"Waiting 24 hours could lead to bladder overdistension and potential bladder damage."}),

  q("RPN-CAT","Fundamentals","Perioperative Care",3,
    "A nurse is assessing a postoperative client and finds the surgical wound has dehisced with visible bowel. The nurse should:",
    ["Push the bowel back into the abdomen and apply a dry dressing","Cover the wound with sterile saline-moistened dressing, position the client supine with knees bent, and call the surgeon immediately","Apply an abdominal binder and ambulate the client","Leave the wound open to air and document the finding"],1,
    "Wound evisceration is a surgical emergency. The exposed organs must be covered with sterile saline-moistened dressings to prevent drying and tissue death. Position supine with knees bent to reduce abdominal tension. Notify the surgeon for emergency re-closure.",
    "Evisceration: cover with sterile saline-moistened gauze, supine with knees bent, do NOT push organs back in, call surgeon immediately. This is an emergency.",
    "Evisceration management: moist sterile dressing + knees bent + surgeon notification. Never push organs back in or apply dry dressings.",
    {"0":"Pushing bowel back in risks contamination, perforation, and is not within nursing scope.","2":"An abdominal binder is insufficient for evisceration and ambulation would worsen the situation.","3":"Leaving exposed organs uncovered leads to tissue desiccation and necrosis."}),

  q("REX-PN","Fundamentals","Perioperative Care",2,
    "Before signing the surgical consent form, the client should be informed about:",
    ["Only the benefits of the procedure","The risks, benefits, alternatives, and potential complications of the procedure","The surgeon's personal success rate only","The hospital's financial policies"],1,
    "Informed consent requires that the client be told about the nature of the procedure, risks, benefits, alternatives (including no treatment), and potential complications. The client must be competent, informed, and consent voluntarily.",
    "Informed consent elements: nature of procedure, risks, benefits, alternatives, complications. Must be given by competent client voluntarily. The physician obtains consent; the nurse witnesses.",
    "Informed consent questions: the correct answer includes all elements: risks, benefits, alternatives, and complications.",
    {"0":"Only discussing benefits without risks violates informed consent requirements.","2":"The surgeon's success rate alone is insufficient; the client needs comprehensive information about the procedure.","3":"Financial policies are not part of informed surgical consent."}),

  q("REX-PN","Fundamentals","Perioperative Care",3,
    "A nurse counts the surgical sponges before wound closure and discovers the count is incorrect. The nurse should:",
    ["Close the wound and recount afterward","Immediately notify the surgeon and do not close until the missing sponge is located","Assume the sponge was discarded and document the discrepancy","Ask another nurse to recount to save time"],1,
    "An incorrect sponge count is a never event. The surgeon must be immediately notified, and the wound must not be closed until the missing sponge is accounted for. An x-ray may be needed to locate a retained sponge.",
    "Surgical count discrepancy: stop the procedure, notify surgeon, locate the missing item. A retained surgical item is a never event.",
    "Surgical count questions: incorrect count = stop everything and find the missing item. Never close with an incorrect count.",
    {"0":"Closing the wound with a potentially retained sponge could cause infection, abscess, or bowel obstruction.","2":"Assuming the sponge was discarded without verification puts the client at risk for retained foreign body.","3":"While recounting is part of the process, the surgeon must be notified and closure halted until the discrepancy is resolved."}),

  q("REX-PN","Fundamentals","Perioperative Care",2,
    "A client is scheduled for surgery at 10 AM. When should the nurse administer the prescribed preoperative antibiotic?",
    ["The night before surgery","Within 60 minutes before surgical incision","2 hours after the incision is made","Only if the client develops signs of infection"],1,
    "Prophylactic antibiotics should be administered within 60 minutes of surgical incision to ensure adequate tissue concentration at the time of incision. This timing has been shown to significantly reduce surgical site infection rates.",
    "Prophylactic antibiotics: administer within 60 minutes of incision (120 minutes for vancomycin/fluoroquinolones). This is a core surgical safety measure.",
    "Preop antibiotic timing: within 60 minutes of incision. This is a Surgical Care Improvement Project (SCIP) measure.",
    {"0":"The night before is too early; antibiotic levels would not be therapeutic at the time of incision.","2":"Two hours after incision is too late; the antibiotic must be present in tissues before contamination occurs.","3":"Prophylactic antibiotics are given preventively, not in response to infection signs."})
];

async function main() {
  console.log(`[RPN-B7] Starting insertion of ${QS.length} questions...`);

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

  console.log(`\n[RPN-B7] Results: Inserted ${inserted}, Skipped duplicates ${skipped}, Total attempted ${QS.length}`);

  const totalQ = await pool.query(`SELECT count(*) as cnt FROM exam_questions WHERE tier='rpn'`);
  console.log(`\nTotal RPN questions in database: ${totalQ.rows[0].cnt}`);

  await pool.end();
  console.log(`\n[RPN-B7] Complete.`);
}

main().catch(e => { console.error(e); process.exit(1); });
