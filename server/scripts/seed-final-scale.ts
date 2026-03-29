import crypto from "crypto";
import pg from "pg";

const pool = new pg.Pool({ host: process.env.PGHOST || "helium", user: process.env.PGUSER || "postgres", password: process.env.PGPASSWORD || "password", database: process.env.PGDATABASE || "heliumdb", ssl: false });
function sh(t: string): string { return crypto.createHash("sha256").update(t.trim().toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ")).digest("hex").substring(0,16); }
const O = (l: string, t: string) => ({ label: l, text: t });

interface Q { tier:string; exam:string; qt:string; stem:string; options:{label:string;text:string}[]; ca:string[]; rat:string; diff:number; tags:string[]; topic:string; sub:string; rs:string; cp:string; bs:string; }

function build(): Q[] {
  const qs: Q[] = [];
  const rpn = (t:string,s:string,bs:string,d:number,stem:string,opts:any[],ca:string[],rat:string,cp:string,tags:string[]) => qs.push({tier:"rpn",exam:"REx-PN",qt:"MCQ",stem,options:opts,ca,rat,diff:d,tags,topic:t,sub:s,rs:"CA",cp,bs});
  const pn = (t:string,s:string,bs:string,d:number,stem:string,opts:any[],ca:string[],rat:string,cp:string,tags:string[]) => qs.push({tier:"rpn",exam:"NCLEX-PN",qt:"MCQ",stem,options:opts,ca,rat,diff:d,tags,topic:t,sub:s,rs:"US",cp,bs});
  const rn = (t:string,s:string,bs:string,d:number,stem:string,opts:any[],ca:string[],rat:string,cp:string,tags:string[]) => qs.push({tier:"rn",exam:"NCLEX-RN",qt:"MCQ",stem,options:opts,ca,rat,diff:d,tags,topic:t,sub:s,rs:"BOTH",cp,bs});

  // ============ NCLEX-PN BATCH (targeting 172+ more) ============

  // Medication Administration routes, timing, and interactions
  const pnMeds = [
    { s:"Nitroglycerin Patch", stem:"An LPN is applying a nitroglycerin transdermal patch to a patient with chronic stable angina. Which instruction is correct regarding patch application?",
      c:"Apply the patch to a clean, dry, hairless area of the trunk or upper arm, rotating sites daily; remove the old patch before applying a new one; provide a 10-12 hour nitrate-free interval (usually overnight) to prevent tolerance development",
      w1:"Apply the patch directly over the chest, on top of the heart, for maximum effect", w2:"Never remove the old patch; layer new patches on top for cumulative effect", w3:"Apply the patch on the same spot every day for consistent absorption",
      r:"Nitroglycerin patches deliver the drug continuously through the skin. Key application principles: SITE SELECTION (clean, dry, hairless area on trunk or upper arm; avoid areas with cuts, irritation, or excessive hair), ROTATION (different site each day to prevent skin irritation), REMOVE OLD PATCH before applying new (residual medication from old patches can cause overdose; old patches still contain active medication and can cause burns during MRI or defibrillation), and NITRATE-FREE INTERVAL (10-12 hours daily, typically overnight, to prevent development of nitrate tolerance, where the body becomes less responsive to the medication). If the patient develops a headache (the most common side effect from vasodilation), acetaminophen may be taken. Never cut patches to adjust dose. Proper disposal: fold patch in half with sticky sides together to prevent accidental exposure to others.", tags:["nitroglycerin","transdermal","angina","nitrate-tolerance","medication-administration"] },
    { s:"Insulin Storage", stem:"An LPN is educating a patient with diabetes about proper insulin storage at home. Which storage instruction is correct?",
      c:"Store unopened insulin vials in the refrigerator (2-8°C); once opened, insulin can be kept at room temperature for 28-42 days depending on the type; never freeze insulin, expose it to direct sunlight, or extreme heat as this degrades the protein",
      w1:"Keep all insulin in the freezer to extend its shelf life indefinitely", w2:"Insulin does not require any special storage and can be left in a hot car", w3:"Once a vial is opened, it must be discarded after 24 hours",
      r:"Proper insulin storage preserves the medication's potency and prevents degradation. UNOPENED insulin should be stored in the REFRIGERATOR (2-8°C/36-46°F) and can be used until the expiration date. OPENED insulin (in-use) can be stored at ROOM TEMPERATURE (15-30°C/59-86°F) for a specific number of days depending on the formulation: regular, NPH, and premixed = 28 days; glargine (Lantus) = 28 days; detemir (Levemir) = 42 days; pen devices often have shorter use periods. Room temperature storage actually reduces injection discomfort compared to cold insulin. NEVER FREEZE insulin (ice crystal formation destroys the protein structure). NEVER expose to direct sunlight or extreme heat (>30°C degrades the insulin protein). NEVER use insulin that appears cloudy when it should be clear (regular, glargine, lispro, aspart) or that has particles, clumping, or discoloration. Insulin pens should NOT be stored with the needle attached (can cause air bubbles, contamination, and dose inaccuracy).", tags:["insulin","storage","diabetes","patient-education","medication-safety"] },
    { s:"Eye Drop Administration", stem:"An LPN is administering two different eye drops to a patient. One is a beta-blocker (timolol) for glaucoma and the other is an antibiotic (ciprofloxacin) for conjunctivitis. What is the correct administration technique?",
      c:"Instill the first drop, wait at least 5 minutes before instilling the second drop to prevent the first medication from being washed out; apply gentle pressure to the inner canthus (nasolacrimal occlusion) for 1-2 minutes after each drop to reduce systemic absorption",
      w1:"Instill both drops simultaneously in the same eye since they are both ophthalmic solutions", w2:"Instill the drops 30 seconds apart since eye drops are absorbed instantly", w3:"Apply both drops to a tissue and then press the tissue against the closed eye",
      r:"When administering multiple eye drops to the same eye, the correct technique includes: WAIT 5 MINUTES between different eye drops (this prevents the second drop from diluting and washing out the first before adequate absorption occurs); NASOLACRIMAL OCCLUSION (applying gentle pressure to the inner corner of the eye/lacrimal duct for 1-2 minutes after instillation) reduces systemic absorption by preventing the medication from draining through the nasolacrimal duct into the nasal cavity and systemic circulation. This is especially important for timolol (a beta-blocker) because systemic absorption can cause bradycardia, hypotension, bronchospasm, and heart block. General eye drop technique: (1) have the patient tilt their head back and look up, (2) pull down the lower lid to create a conjunctival sac, (3) instill the drop into the lower conjunctival sac (not directly onto the cornea), (4) have the patient close the eye gently (no squeezing) for 1-2 minutes, (5) apply nasolacrimal occlusion. If ointment AND drops are prescribed, instill drops FIRST, then ointment (ointment creates a barrier that prevents drop absorption).", tags:["eye-drops","ophthalmic","administration-technique","nasolacrimal-occlusion","glaucoma"] },
    { s:"Warfarin Monitoring", stem:"An LPN is monitoring a patient on warfarin therapy. The patient's INR is 1.3 (target range 2.0-3.0). What does this INR value indicate?",
      c:"The INR is subtherapeutic (below the target range), meaning the blood is not adequately anticoagulated and the patient is at increased risk for thromboembolic events (DVT, PE, stroke); the physician may need to adjust the warfarin dose upward",
      w1:"The INR is dangerously high and warfarin should be held immediately", w2:"The INR is within the therapeutic range and no changes are needed", w3:"The INR indicates the patient has a bleeding disorder unrelated to warfarin",
      r:"The International Normalized Ratio (INR) measures the anticoagulant effect of warfarin by standardizing prothrombin time (PT) across laboratories. Target INR ranges: 2.0-3.0 for most indications (atrial fibrillation, DVT, PE, biologic heart valves); 2.5-3.5 for mechanical heart valves. An INR of 1.3 is BELOW the therapeutic range (subtherapeutic), meaning the patient does not have adequate anticoagulation and remains at risk for clot formation. The warfarin dose may need to be INCREASED. Conversely: INR >3.0 indicates excessive anticoagulation (supratherapeutic) with increased bleeding risk; INR >5.0 warrants dose holding and possible vitamin K administration; INR >9.0 (without bleeding) requires vitamin K; any elevated INR WITH active bleeding requires vitamin K IV plus prothrombin complex concentrate (PCC) or fresh frozen plasma (FFP). Common factors that increase INR (potentiate warfarin): decreased vitamin K intake, liver disease, antibiotics (ciprofloxacin, metronidazole), acetaminophen overuse, and alcohol. Factors that decrease INR (antagonize warfarin): increased vitamin K intake, barbiturates, carbamazepine, and rifampin.", tags:["warfarin","INR","anticoagulation","subtherapeutic","monitoring"] },
    { s:"Subcutaneous Injection", stem:"An LPN is administering enoxaparin (Lovenox) subcutaneously to a patient for DVT prophylaxis. Which technique is correct?",
      c:"Inject into the subcutaneous tissue of the abdomen (at least 2 inches from the umbilicus), alternating left and right sides; do NOT aspirate before injecting; do NOT rub the injection site afterward; leave the air bubble in the prefilled syringe",
      w1:"Inject into the deltoid muscle using a 1.5-inch needle at a 90-degree angle", w2:"Aspirate before injection to verify placement, then rub the site vigorously", w3:"Remove the air bubble from the prefilled syringe before injection for accurate dosing",
      r:"Enoxaparin (low-molecular-weight heparin/LMWH) has specific subcutaneous administration guidelines: SITE: abdomen (preferred for consistent absorption), at least 5 cm (2 inches) from the umbilicus, rotating left and right sides. TECHNIQUE: pinch a skin fold, insert the needle at a 90-degree angle into the fold, inject slowly. DO NOT ASPIRATE: aspiration is not recommended for subcutaneous injections as it can cause tissue trauma and bruising (especially important with anticoagulants). DO NOT RUB the site after injection: rubbing causes tissue damage and increases the risk of hematoma formation (remember, this is an anticoagulant). LEAVE THE AIR BUBBLE in the prefilled syringe: the air bubble in the syringe is intentionally designed to follow the medication and lock it in the subcutaneous tissue, preventing backtracking of the drug along the needle track and reducing bruising. Needle length: typically 5/8 inch (1.6 cm) or 1/2 inch for the prefilled syringe. Monitor for signs of bleeding, thrombocytopenia (HIT), and injection site reactions.", tags:["enoxaparin","subcutaneous","injection-technique","anticoagulant","DVT-prophylaxis"] },
  ];

  for (const m of pnMeds) {
    pn("Medication Administration", m.s, "Physiological Integrity", 2, m.stem,
      [O("A",m.w1), O("B",m.c), O("C",m.w2), O("D",m.w3)], ["B"], m.r, m.c.substring(0,80), m.tags);
  }

  // Patient safety and procedures
  const pnSafety = [
    { s:"Oxygen Safety", stem:"An LPN is setting up oxygen therapy via nasal cannula for a patient. Which safety precaution is MOST important to communicate to the patient and family?",
      c:"Remove all open flames, matches, and smoking materials from the room; oxygen supports combustion and creates a fire hazard; post 'No Smoking/Oxygen in Use' signage; use water-based lubricants on lips (not petroleum-based products like Vaseline)",
      w1:"Oxygen is completely safe and there are no fire risks associated with oxygen therapy", w2:"The patient can continue smoking in bed as long as the oxygen is turned down to 1 L/min", w3:"Only electric candles need to be removed; real candles are safe in the oxygen-enriched environment",
      r:"Oxygen supports combustion (it is an oxidizer, not flammable itself), meaning materials burn more easily, more quickly, and at lower temperatures in an oxygen-enriched environment. Fire safety measures include: NO SMOKING or open flames in the room (this is the most critical safety message), post 'Oxygen in Use' signs, remove matches, lighters, and candles; use WATER-BASED lubricants on lips and nasal passages (petroleum-based products like Vaseline are flammable in oxygen-enriched environments); avoid static-producing materials (wool, nylon) near oxygen; keep oxygen equipment away from heat sources; ensure electrical equipment is properly grounded; use cotton garments and bedding. Additional oxygen therapy nursing care: assess nasal passages and ears for skin breakdown from tubing, maintain prescribed flow rate, monitor SpO2 and respiratory status, ensure humidification at flow rates >4 L/min to prevent mucosal drying, and educate the patient about the hazards of adjusting their own flow rate.", tags:["oxygen-safety","fire-prevention","nasal-cannula","patient-education","respiratory"] },
    { s:"Foley Catheter Care", stem:"An LPN is performing indwelling urinary catheter care. Which practice is evidence-based for preventing catheter-associated urinary tract infections (CAUTI)?",
      c:"Perform daily perineal hygiene with soap and water, maintain a closed drainage system (do not disconnect), keep the drainage bag below the level of the bladder at all times, secure the catheter to the thigh to prevent traction, and assess the need for continued catheterization daily with prompt removal when no longer indicated",
      w1:"Perform daily bladder irrigations with antiseptic solution to prevent bacterial growth", w2:"Change the urinary catheter every 3 days routinely to prevent biofilm formation", w3:"Clamp the catheter for 2 hours at a time to retrain the bladder while the catheter is in place",
      r:"CAUTI is one of the most common healthcare-associated infections (HAIs), occurring in up to 25% of hospitalized patients with urinary catheters. Evidence-based CAUTI prevention (per CDC guidelines): (1) MAINTAIN CLOSED SYSTEM (never disconnect the catheter from the drainage bag; use the sampling port for urine specimens); (2) DAILY PERINEAL HYGIENE with soap and water (not antiseptic solutions, which have not shown additional benefit and can cause irritation); (3) KEEP BAG BELOW BLADDER (gravity drainage prevents urine reflux and bacterial migration); (4) SECURE the catheter to prevent urethral traction (thigh for females, upper thigh/lower abdomen for males); (5) DAILY ASSESSMENT of continued need (the single most effective CAUTI prevention strategy is EARLY REMOVAL); (6) proper hand hygiene before and after any catheter manipulation. Routine bladder irrigations (A) are NOT recommended and increase infection risk. Routine catheter changes (B) are NOT recommended; change only when clinically indicated (obstruction, encrustation). Bladder 'retraining' with clamping (C) is NOT supported by evidence and increases infection risk.", tags:["CAUTI","Foley-catheter","infection-prevention","evidence-based","urinary"] },
    { s:"Nasogastric Tube Verification", stem:"An LPN has inserted a nasogastric tube for gastric decompression. Before using the tube, which method is the GOLD STANDARD for verifying placement?",
      c:"Radiographic (X-ray) confirmation is the gold standard for initial placement verification; additionally, aspirate gastric contents and test pH (gastric pH should be ≤5.5, which is distinctly acidic); auscultation alone is NOT a reliable method",
      w1:"Auscultation of the epigastric area while injecting air is the most reliable verification method", w2:"Placing the end of the tube in a glass of water and watching for bubbles is sufficient", w3:"The tube is verified simply by the number of centimeters inserted without any other confirmation",
      r:"NG tube placement verification is critical because misplacement into the lungs (bronchial intubation) can cause aspiration pneumonia, pneumothorax, or death if feedings or medications are administered. GOLD STANDARD: RADIOGRAPHIC (X-ray) confirmation for INITIAL placement - this is the most reliable method. After X-ray confirmation, ongoing verification methods include: GASTRIC ASPIRATE pH testing (gastric pH ≤5.5 = gastric placement; intestinal pH 6-7; respiratory secretion pH >7); pH testing is the most reliable BEDSIDE method. AUSCULTATION (listening for air injection over the epigastrium) is NO LONGER recommended as a PRIMARY verification method because air injected into a bronchially placed tube can also produce sounds that mimic gastric placement. Visual inspection of aspirate (gastric = green/brown/clear; intestinal = bile-stained yellow; respiratory = clear/off-white) provides additional confirmation. The tube in water method (B) is unreliable and potentially dangerous. Mark the external length of the tube at the nares after placement confirmation to detect migration.", tags:["NG-tube","placement-verification","pH-testing","X-ray","patient-safety"] },
    { s:"IV Complications", stem:"An LPN is monitoring a patient's peripheral IV site and notices edema, coolness, and pallor at the insertion site. The IV fluid is infusing slowly. What complication has occurred?",
      c:"Infiltration: the IV catheter has dislodged from the vein and IV fluid is infusing into the surrounding subcutaneous tissue; stop the infusion, remove the catheter, elevate the extremity, apply a warm or cool compress depending on the solution, and restart the IV at a new site",
      w1:"Phlebitis: inflammation of the vein requiring warm compresses and continuing the infusion", w2:"Air embolism: air has entered the vein requiring Trendelenburg positioning on the left side", w3:"Speed shock: the IV is infusing too rapidly and needs to be slowed down",
      r:"IV INFILTRATION occurs when the IV catheter tip migrates out of the vein (from patient movement, unsecured catheter, or fragile vein walls), allowing IV fluid to infuse into the SUBCUTANEOUS TISSUE. Signs/symptoms: EDEMA (swelling around the site from fluid accumulation), COOLNESS (non-blood-warmed IV fluid is cooler than tissue), PALLOR (blanching from tissue compression), slow or stopped infusion, possible discomfort. The infiltration scale (I-IV) grades severity. Management: (1) STOP the infusion, (2) REMOVE the catheter (leaving it risks further tissue damage), (3) ELEVATE the extremity, (4) apply WARM compress for isotonic solutions or COOL compress for hypertonic solutions, (5) RESTART IV at a new site proximal to the infiltrated site or in the opposite extremity, (6) DOCUMENT. EXTRAVASATION is a more severe form when vesicant medications (chemotherapy, dopamine, calcium chloride) leak into tissue, causing potential tissue NECROSIS. Phlebitis (A) presents with erythema, warmth, tenderness, and a palpable venous cord ALONG THE VEIN. Air embolism (B) presents with sudden dyspnea, chest pain, and hypotension.", tags:["IV","infiltration","complications","peripheral-IV","nursing-intervention"] },
    { s:"Wound Assessment", stem:"An LPN is assessing a wound and documents: 'The wound measures 4 cm × 3 cm × 1.5 cm with 50% red granulation tissue and 50% yellow slough. Moderate amount of serosanguineous drainage on the dressing. Wound edges are attached.' Which assessment measurement represents the wound depth?",
      c:"1.5 cm is the wound depth (the third measurement); wound measurements follow the convention of length × width × depth, where length is measured head to toe, width is measured side to side, and depth is measured by gently inserting a sterile cotton-tipped applicator at the deepest point",
      w1:"4 cm is the depth", w2:"3 cm is the depth", w3:"Depth cannot be measured in wound assessment",
      r:"Standardized wound measurement documentation follows the convention: LENGTH × WIDTH × DEPTH, where: LENGTH = longest measurement from the 12 o'clock to 6 o'clock position (head to toe when the patient is supine); WIDTH = longest measurement from the 3 o'clock to 9 o'clock position (side to side, perpendicular to the length); DEPTH = deepest measurement, obtained by gently inserting a sterile, moist cotton-tipped applicator at a 90-degree angle at the deepest point of the wound bed and measuring the length of the applicator from the wound surface to the applicator tip. Additional wound assessment components: UNDERMINING (tissue destruction extending under intact skin at the wound edge, measured by clock position and centimeters), TUNNELING (channel extending in one direction from the wound, measured by direction and depth), WOUND BED description (percentage of each tissue type: red=granulation, yellow=slough, black=eschar, pink=epithelialization), DRAINAGE (type, color, amount, odor), PERIWOUND skin condition, and WOUND EDGES (attached, rolled, undermined). Accurate measurement and documentation are essential for tracking wound healing progress.", tags:["wound-assessment","measurement","documentation","wound-care","nursing-assessment"] },
    { s:"Specimen Collection", stem:"An LPN is collecting a clean-catch midstream urine specimen from a female patient. Which instruction ensures a properly collected specimen?",
      c:"Cleanse the perineal area from front to back using the provided antiseptic wipes, begin urinating into the toilet, then collect the MIDSTREAM portion in the sterile container without stopping the urine flow, and finish voiding into the toilet",
      w1:"Collect the first stream of urine since it contains the highest concentration of bacteria", w2:"Cleanse from back to front before collection for thorough cleaning", w3:"Allow the urine to sit at room temperature for 24 hours before sending it to the lab",
      r:"Clean-catch midstream urine collection minimizes contamination from perineal flora: (1) HAND HYGIENE before the procedure; (2) CLEANSE the perineal area from FRONT TO BACK (this is critical - back-to-front wiping can introduce rectal bacteria, particularly E. coli, into the urethral area, contaminating the specimen and causing false-positive results); use each antiseptic wipe for only ONE stroke; (3) BEGIN URINATING into the toilet (the initial stream flushes bacteria from the urethra and urethral meatus); (4) COLLECT THE MIDSTREAM portion in the sterile container WITHOUT STOPPING the flow (stopping and restarting allows bacteria from the perineum to re-enter the stream); (5) FINISH voiding into the toilet; (6) place the cap on the container without touching the inside; (7) LABEL the specimen properly (patient name, date, time, medical record number); (8) TRANSPORT to the laboratory within 30 minutes or REFRIGERATE (urine at room temperature allows bacterial multiplication, leading to falsely elevated colony counts). The first-void urine (A) is used for specific tests like chlamydia/gonorrhea NAAT testing, but NOT for routine urinalysis.", tags:["specimen-collection","clean-catch","urine","contamination-prevention","technique"] },
    { s:"Tube Feeding", stem:"An LPN is administering a continuous enteral feeding via a nasogastric tube. What is the MOST important nursing action to prevent aspiration?",
      c:"Elevate the head of bed to at least 30-45 degrees during and for 30-60 minutes after feeding, check gastric residual volume as per facility protocol, and verify tube placement before each feeding or every 4 hours for continuous feeds",
      w1:"Keep the patient flat (supine) during tube feeding to prevent nausea", w2:"Administer the feeding as fast as possible to reduce the time the patient is at risk", w3:"Do not check gastric residual as it is no longer part of evidence-based practice",
      r:"Aspiration is the most serious complication of enteral feeding, potentially causing aspiration pneumonia and death. Prevention strategies include: HEAD OF BED ELEVATION (≥30-45 degrees) during feeding and for 30-60 minutes after (gravity helps keep the feeding in the stomach and prevents regurgitation); TUBE PLACEMENT VERIFICATION before each intermittent feeding or every 4 hours for continuous feeds (X-ray for initial, then pH testing and external marking checks); GASTRIC RESIDUAL VOLUME (GRV) monitoring per facility policy (while the practice is debated, many facilities still check GRV every 4-6 hours; high residuals may indicate gastroparesis or intolerance; the threshold for holding feedings varies by facility, typically >200-500 mL); FEEDING RATE management (start slow, advance gradually as tolerated); monitor for signs of intolerance (abdominal distension, nausea, vomiting, diarrhea); keep the cuff inflated on cuffed tracheostomy or endotracheal tubes during feeding. Flat positioning (A) INCREASES aspiration risk. Rapid bolus administration (B) increases gastric distension and aspiration risk.", tags:["tube-feeding","aspiration-prevention","enteral-nutrition","head-of-bed","gastric-residual"] },
    { s:"Tracheostomy Care", stem:"An LPN is performing routine tracheostomy care. Which action demonstrates correct technique?",
      c:"Clean the inner cannula with sterile normal saline or hydrogen peroxide diluted with normal saline (per facility policy), replace the tracheostomy ties while ensuring one finger fits between the ties and the neck, maintain a sterile field, and keep a spare tracheostomy tube of the same size and one size smaller at the bedside",
      w1:"Remove the outer cannula for cleaning and leave the stoma open while cleaning", w2:"Tie the tracheostomy ties as tight as possible to prevent tube dislodgement", w3:"Tracheostomy care is only needed once per month for established tracheostomies",
      r:"Routine tracheostomy care prevents infection, maintains airway patency, and preserves skin integrity. Correct technique includes: INNER CANNULA cleaning (remove, soak in prescribed solution, clean with pipe cleaners or brush, rinse with sterile normal saline, reinsert; for disposable inner cannulas, replace with new one); STOMA and PERISTOMAL SKIN care (clean with half-strength H2O2 or normal saline, rinse with normal saline, dry gently, apply split gauze dressing); TRACHEOSTOMY TIES replacement (secure new ties BEFORE removing old ones to prevent accidental decannulation; tightness = ONE FINGER between ties and neck; too tight causes skin breakdown and impairs venous return; too loose risks tube dislodgement); EMERGENCY EQUIPMENT at bedside: spare tracheostomy tubes (same size AND one size smaller), obturator, manual resuscitation bag, suction equipment, and scissors. The outer cannula (A) is NEVER removed during routine care (this would result in decannulation). Tracheostomy care is performed every 8-12 hours or as needed (not monthly, option C).", tags:["tracheostomy","airway-management","inner-cannula","tracheostomy-ties","emergency-equipment"] },
  ];

  for (const s of pnSafety) {
    pn("Patient Safety", s.s, "Physiological Integrity", 2, s.stem,
      [O("A",s.w1), O("B",s.c), O("C",s.w2), O("D",s.w3)], ["B"], s.r, s.c.substring(0,80), s.tags);
  }

  // More clinical PN scenarios across body systems
  const pnClinical = [
    { t:"Physiological Integrity", s:"Hepatitis Teaching", stem:"An LPN is educating a patient diagnosed with hepatitis B about preventing transmission. Which instruction is MOST important?",
      c:"Hepatitis B is transmitted through blood and body fluids (sexual contact, shared needles, perinatal transmission); use barrier protection during sexual activity, do not share razors or toothbrushes, and inform close contacts to get vaccinated with the 3-dose hepatitis B vaccine series",
      w1:"Hepatitis B is transmitted through casual contact like handshaking and sharing meals", w2:"Hepatitis B resolves completely within 2 weeks and requires no follow-up", w3:"Only household contacts over age 65 need to be vaccinated",
      tags:["hepatitis-B","transmission","vaccination","patient-education","infectious-disease"] },
    { t:"Physiological Integrity", s:"Anemia Assessment", stem:"An LPN is assessing a patient with iron-deficiency anemia. Which assessment finding is MOST consistent with this condition?",
      c:"Pale conjunctivae, pale nail beds, fatigue, tachycardia (compensatory), dyspnea on exertion, koilonychia (spoon-shaped nails), glossitis (smooth red tongue), and possible pica (craving non-food items like ice or dirt)",
      w1:"Jaundice, dark urine, and elevated bilirubin", w2:"Petechiae, bleeding gums, and prolonged bleeding time", w3:"Polycythemia with ruddy complexion and hypertension",
      tags:["anemia","iron-deficiency","assessment","koilonychia","pica"] },
    { t:"Physiological Integrity", s:"Pneumothorax Signs", stem:"An LPN is assessing a patient who fell and struck their chest on a railing. The patient has sudden onset dyspnea, sharp pleuritic chest pain, diminished breath sounds on the left side, and tracheal deviation to the right. What condition does this indicate?",
      c:"Tension pneumothorax on the left side: air enters the pleural space but cannot escape, creating increasing pressure that collapses the lung and pushes the mediastinum to the OPPOSITE side (tracheal deviation to the right); this is a life-threatening emergency requiring immediate needle decompression",
      w1:"Right-sided pneumothorax causing the trachea to shift toward the affected side", w2:"Bilateral pneumonia requiring antibiotics and supportive care", w3:"Rib fracture with no cardiopulmonary compromise requiring only pain management",
      tags:["pneumothorax","tension","tracheal-deviation","emergency","chest-trauma"] },
    { t:"Health Promotion", s:"Colon Cancer Screening", stem:"An LPN is providing education about colorectal cancer screening to a 50-year-old patient with no family history or risk factors. Which screening recommendation is appropriate?",
      c:"Begin regular colorectal cancer screening at age 45-50 with either annual fecal occult blood test (FOBT) or fecal immunochemical test (FIT), or colonoscopy every 10 years, or other approved screening methods; discuss options with the healthcare provider",
      w1:"Colorectal screening is not recommended until age 75", w2:"Only patients with a family history of colon cancer need screening", w3:"A single negative screening test at age 50 eliminates the need for future screening",
      tags:["colon-cancer","screening","FOBT","colonoscopy","health-promotion"] },
    { t:"Physiological Integrity", s:"Shock Signs", stem:"An LPN is assessing a patient who is pale, diaphoretic, with a rapid thready pulse (HR 130), blood pressure of 82/60 mmHg, and altered mental status. What is the PRIORITY nursing action?",
      c:"Recognize signs of hypovolemic shock, position the patient flat with legs elevated (modified Trendelenburg) unless contraindicated, maintain IV access with two large-bore IVs, notify the RN and physician immediately, and prepare for rapid fluid resuscitation",
      w1:"Sit the patient upright and offer oral fluids", w2:"Administer a sedative for the anxiety and rapid heart rate", w3:"These are normal vital signs for a resting adult",
      tags:["shock","hypovolemic","emergency","fluid-resuscitation","assessment"] },
    { t:"Physiological Integrity", s:"Myasthenia Gravis", stem:"An LPN is caring for a patient with myasthenia gravis who reports increasing difficulty swallowing and weakness of respiratory muscles. What complication should the LPN suspect?",
      c:"Myasthenic crisis: acute exacerbation of muscle weakness that can compromise the airway and respiratory function; this is a medical emergency requiring immediate respiratory assessment, possible intubation, and IV immunoglobulin or plasmapheresis",
      w1:"Cholinergic crisis from too much medication, requiring atropine administration", w2:"Normal fluctuation of myasthenia gravis symptoms that will resolve with rest", w3:"Anxiety-related breathing difficulty requiring a paper bag for rebreathing",
      tags:["myasthenia-gravis","myasthenic-crisis","respiratory-failure","autoimmune","emergency"] },
  ];

  for (const c of pnClinical) {
    pn(c.t, c.s, "Physiological Integrity", 3, c.stem,
      [O("A",c.w1), O("B",c.c), O("C",c.w2), O("D",c.w3)], ["B"],
      `${c.c}. Understanding the pathophysiology and clinical presentation guides appropriate nursing interventions and ensures patient safety.`,
      c.c.substring(0,80), c.tags);
  }

  // ============ REx-PN ADDITIONAL ============

  const rpnExtra = [
    { t:"Pharmacology", s:"Opioid Equivalence", stem:"An RPN is transitioning a patient from IV morphine to oral morphine for pain management. The patient was receiving morphine 10 mg IV every 4 hours. What equivalent oral dose would the RPN expect the physician to order?",
      c:"Morphine 30 mg PO every 4 hours; the IV-to-oral morphine ratio is approximately 1:3, meaning 10 mg IV morphine is equivalent to approximately 30 mg oral morphine due to first-pass hepatic metabolism reducing oral bioavailability",
      w1:"Morphine 10 mg PO every 4 hours (same dose regardless of route)", w2:"Morphine 5 mg PO every 4 hours (half the IV dose)", w3:"Morphine 100 mg PO every 4 hours",
      tags:["opioid","equianalgesic","morphine","route-conversion","pharmacology"] },
    { t:"Maternal Health", s:"Postpartum Assessment", stem:"An RPN is performing a postpartum assessment using the BUBBLE-HE framework. What does each component of this mnemonic represent?",
      c:"Breasts (engorgement, lactation), Uterus (fundal height, firmness, position), Bladder (voiding, distension), Bowel (function, hemorrhoids), Lochia (color, amount, clots), Episiotomy/perineum (healing, edema, ecchymosis), Homan's sign/lower extremities (DVT assessment), and Emotions/bonding (postpartum depression screening)",
      w1:"BUBBLE-HE is a respiratory assessment tool for newborns", w2:"BUBBLE-HE is a formula for calculating IV fluid rates", w3:"BUBBLE-HE is a breastfeeding positioning technique",
      tags:["postpartum","BUBBLE-HE","assessment","maternal","nursing-mnemonic"] },
    { t:"Respiratory", s:"Oxygen Delivery Devices", stem:"An RPN needs to deliver a precise concentration of 40% oxygen to a patient with COPD. Which oxygen delivery device is MOST appropriate?",
      c:"Venturi mask (air-entrainment mask): this device delivers precise, fixed concentrations of oxygen (24%, 28%, 31%, 35%, 40%, 50%) by using specific color-coded adapters that regulate the ratio of room air to supplemental oxygen",
      w1:"Simple face mask at 10 L/min which delivers approximately 40% oxygen", w2:"Nasal cannula at 4 L/min which delivers approximately 40% oxygen", w3:"Non-rebreather mask at 15 L/min for precise 40% delivery",
      tags:["oxygen-delivery","Venturi-mask","COPD","FiO2","respiratory"] },
    { t:"Pediatric", s:"Child Safety Teaching", stem:"An RPN is providing injury prevention education to parents of a 2-year-old. Which safety instruction is MOST important?",
      c:"Install safety gates at the top and bottom of stairs, keep all medications and cleaning products locked and out of reach, ensure furniture and televisions are anchored to walls to prevent tipping, and never leave the child unattended near water (including bathtubs, pools, and buckets)",
      w1:"The child is old enough to be left unsupervised for short periods", w2:"Install a lock on the child's bedroom door from the outside", w3:"Drowning is only a risk at swimming pools, not in bathtubs or buckets",
      tags:["pediatric","injury-prevention","safety","toddler","parent-education"] },
    { t:"Gerontology", s:"Medication Considerations in Elderly", stem:"An RPN is administering medications to an 85-year-old patient. Which age-related pharmacokinetic change should the RPN consider?",
      c:"Decreased hepatic metabolism and decreased renal excretion (GFR declines with age), resulting in slower drug clearance, prolonged half-life, and increased risk of drug accumulation and toxicity; elderly patients often require lower doses and longer intervals between doses",
      w1:"Elderly patients metabolize and excrete medications faster than younger adults", w2:"Age has no effect on drug metabolism or excretion", w3:"All medications should be given at double the adult dose for elderly patients to ensure therapeutic effect",
      tags:["geriatric","pharmacokinetics","renal-function","hepatic-metabolism","medication-safety"] },
  ];

  for (const r of rpnExtra) {
    rpn(r.t, r.s, "Physiological Integrity", 3, r.stem,
      [O("A",r.w1), O("B",r.c), O("C",r.w2), O("D",r.w3)], ["B"],
      `${r.c}. This reflects essential nursing knowledge for safe, effective patient care within the RPN scope of practice.`,
      r.c.substring(0,80), r.tags);
  }

  // ============ NCLEX-RN ADDITIONAL ============

  const rnExtra = [
    { t:"Critical Care", s:"ECMO Nursing", stem:"An RN is caring for a patient on veno-arterial extracorporeal membrane oxygenation (VA-ECMO) for cardiogenic shock. Which nursing assessment is HIGHEST priority?",
      c:"Monitor the cannulated extremity distal to the arterial cannula site for signs of limb ischemia (pallor, coolness, absent pulses, pain, delayed capillary refill) as the large arterial cannula can occlude blood flow; also monitor ACT/aPTT for anticoagulation adequacy",
      w1:"Monitor only the respiratory rate since ECMO replaces lung function", w2:"Routine vital signs every 12 hours are sufficient for ECMO patients", w3:"The patient can be mobilized and ambulated normally while on ECMO",
      tags:["ECMO","critical-care","limb-ischemia","anticoagulation","advanced-nursing"] },
    { t:"Pharmacology", s:"Vasopressor Titration", stem:"An RN is titrating norepinephrine (Levophed) for a patient in septic shock. The current MAP is 58 mmHg. What is the RN's target MAP and appropriate action?",
      c:"Target MAP ≥65 mmHg per Surviving Sepsis Campaign guidelines; increase the norepinephrine infusion rate per protocol to raise the MAP to ≥65 mmHg; ensure adequate volume resuscitation first; continuously monitor hemodynamics and end-organ perfusion (urine output, mental status, lactate clearance)",
      w1:"Target MAP of 50 mmHg is adequate for organ perfusion in septic shock", w2:"Immediately stop the norepinephrine since the blood pressure is responding", w3:"Increase the rate to maximum immediately without incremental titration",
      tags:["vasopressor","norepinephrine","septic-shock","MAP","hemodynamics"] },
    { t:"Research", s:"Evidence Hierarchy", stem:"An RN is evaluating research evidence for a practice change. According to the evidence hierarchy, which type of evidence is considered the STRONGEST?",
      c:"Systematic reviews and meta-analyses of randomized controlled trials (RCTs): these synthesize findings from multiple high-quality studies, providing the most comprehensive and reliable evidence for clinical decision-making",
      w1:"Expert opinion and clinical experience are the strongest form of evidence", w2:"A single case report provides the strongest evidence for practice changes", w3:"Editorials in nursing journals constitute the highest level of evidence",
      tags:["evidence-based-practice","evidence-hierarchy","systematic-review","meta-analysis","research"] },
    { t:"Nephrology", s:"Acute vs Chronic Renal Failure", stem:"An RN is differentiating between acute kidney injury (AKI) and chronic kidney disease (CKD) in a patient with elevated creatinine. Which finding is MOST consistent with CKD rather than AKI?",
      c:"Small, shrunken kidneys bilaterally on ultrasound, anemia (from decreased erythropoietin production), hyperphosphatemia with hypocalcemia, and elevated PTH (secondary hyperparathyroidism from chronic mineral imbalance); these findings indicate a long-standing, irreversible process",
      w1:"Normal-sized kidneys with sudden onset oliguria after IV contrast administration", w2:"Recent nephrotoxic antibiotic exposure with rising creatinine over 48 hours", w3:"Rapid improvement in renal function after IV fluid administration",
      tags:["CKD","AKI","renal-failure","differentiation","erythropoietin"] },
    { t:"Cardiac", s:"Pacemaker Education", stem:"An RN is providing discharge education to a patient with a newly implanted permanent pacemaker. Which instruction is MOST important?",
      c:"Carry the pacemaker identification card at all times, avoid MRI unless the device is MRI-conditional, do not raise the arm on the implant side above shoulder level for the first 6 weeks, report signs of infection at the insertion site, and notify healthcare providers about the pacemaker before any procedures",
      w1:"The patient can resume heavy lifting and vigorous arm exercises immediately", w2:"Microwave ovens will interfere with the pacemaker and must be avoided permanently", w3:"The pacemaker battery never needs replacement and lasts indefinitely",
      tags:["pacemaker","cardiac","discharge-education","electromagnetic-interference","device-management"] },
    { t:"Burns", s:"Burn Fluid Resuscitation", stem:"An RN is caring for a patient with 40% TBSA burns who weighs 80 kg. Using the Parkland formula (4 mL × kg × %TBSA), what is the total fluid requirement for the first 24 hours, and how should it be administered?",
      c:"Total = 4 × 80 × 40 = 12,800 mL of lactated Ringer's solution; give half (6,400 mL) in the FIRST 8 hours from the time of burn injury, and the remaining half (6,400 mL) over the next 16 hours; titrate to maintain urine output 0.5-1 mL/kg/hour",
      w1:"Total = 800 mL given as a single IV bolus", w2:"Total = 12,800 mL given entirely in the first 4 hours", w3:"No fluid resuscitation is needed for burns less than 50% TBSA",
      tags:["burns","Parkland-formula","fluid-resuscitation","lactated-Ringers","critical-care"] },
    { t:"Infection Control", s:"Multi-Drug Resistant Organisms", stem:"An RN is caring for a patient colonized with carbapenem-resistant Enterobacteriaceae (CRE). Which precaution is MOST important?",
      c:"Implement strict contact precautions with dedicated equipment, meticulous hand hygiene, and enhanced environmental cleaning; CRE organisms are resistant to nearly all available antibiotics and have mortality rates exceeding 50% for invasive infections, making infection prevention paramount",
      w1:"Standard precautions alone are sufficient for CRE since it is only colonization, not active infection", w2:"CRE only spreads through airborne transmission, so N95 respirators are required", w3:"Colonized patients do not pose any transmission risk to other patients",
      tags:["CRE","multi-drug-resistant","contact-precautions","infection-control","antimicrobial-resistance"] },
    { t:"Psychiatric", s:"Milieu Therapy", stem:"An RN is establishing a therapeutic milieu on an inpatient psychiatric unit. Which principle is MOST fundamental to creating a therapeutic environment?",
      c:"Maintain a structured, safe, predictable environment that promotes patient autonomy and responsibility within clear boundaries; the physical space, daily schedule, and interpersonal interactions all contribute to the therapeutic milieu; patients are active participants in their own recovery",
      w1:"Keep the environment completely unstructured so patients can do whatever they want", w2:"Restrict all patient interactions and activities to prevent conflict", w3:"The physical environment has no impact on psychiatric patient outcomes",
      tags:["milieu-therapy","psychiatric","therapeutic-environment","inpatient","safety"] },
  ];

  for (const r of rnExtra) {
    rn(r.t, r.s, "Physiological Integrity", 4, r.stem,
      [O("A",r.w1), O("B",r.c), O("C",r.w2), O("D",r.w3)], ["B"],
      `${r.c}. This represents advanced clinical knowledge essential for RN-level practice and decision-making.`,
      r.c.substring(0,80), r.tags);
  }

  return qs;
}

async function main() {
  console.log("=== Final Scale Batch ===\n");
  const before = await pool.query(`SELECT tier, exam, COUNT(*)::int as c FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`);
  console.log("BEFORE:"); for (const r of before.rows) console.log(`  ${r.tier}/${r.exam}: ${r.c}`);
  const allQs = build();
  const bk: Record<string,number> = {};
  for (const q of allQs) bk[q.exam] = (bk[q.exam]||0)+1;
  console.log(`\nGenerated ${allQs.length} total:`, bk);
  let ins=0, dup=0, err=0;
  for (const q of allQs) {
    const h = sh(q.stem);
    try {
      const ex = await pool.query(`SELECT id FROM exam_questions WHERE stem_hash=$1 AND tier=$2 AND exam=$3 LIMIT 1`, [h, q.tier, q.exam]);
      if (ex.rows.length > 0) { dup++; continue; }
      await pool.query(
        `INSERT INTO exam_questions (id,tier,exam,question_type,status,stem,options,correct_answer,rationale,difficulty,tags,body_system,topic,subtopic,region_scope,stem_hash,scenario,clinical_pearl,exam_strategy,clinical_trap,distractor_rationales,career_type,created_at,updated_at)
         VALUES (gen_random_uuid(),$1,$2,$3,'published',$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'nursing',NOW(),NOW())`,
        [q.tier,q.exam,q.qt,q.stem,JSON.stringify(q.options),JSON.stringify(q.ca),q.rat,q.diff,q.tags,q.bs,q.topic,q.sub,q.rs,h,q.stem.substring(0,120),q.cp,
         "Select the evidence-based answer","Avoid outdated or harmful practices",JSON.stringify({A:"Incorrect",C:"Inappropriate",D:"Harmful"})]);
      ins++;
    } catch (e: any) { err++; console.error(`ERR: ${e.message.substring(0,100)}`); }
  }
  console.log(`\nInserted: ${ins}, Duplicates: ${dup}, Errors: ${err}`);
  const after = await pool.query(`SELECT tier, exam, COUNT(*)::int as c FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`);
  console.log("\nAFTER:"); for (const r of after.rows) console.log(`  ${r.tier}/${r.exam}: ${r.c}`);

  // Show total new questions in this session
  const session = await pool.query(`
    SELECT exam, COUNT(*)::int as cnt FROM exam_questions
    WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
    AND created_at > NOW() - INTERVAL '6 hours'
    GROUP BY exam ORDER BY exam`);
  console.log("\nTotal new questions in this session:");
  for (const r of session.rows) console.log(`  ${r.exam}: ${r.cnt}`);

  // Blueprint domain coverage
  const domains = await pool.query(`
    SELECT exam, topic, COUNT(*)::int as cnt FROM exam_questions
    WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
    AND created_at > NOW() - INTERVAL '6 hours'
    GROUP BY exam, topic ORDER BY exam, cnt DESC`);
  console.log("\nDomain coverage (new questions):");
  for (const r of domains.rows) console.log(`  ${r.exam}: ${r.topic} = ${r.cnt}`);

  await pool.end();
  console.log("\n=== Done! ===");
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
