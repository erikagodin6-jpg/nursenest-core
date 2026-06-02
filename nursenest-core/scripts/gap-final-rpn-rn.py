#!/usr/bin/env python3
"""REx-PN +4, NCLEX-RN US +5, NCLEX-RN CA +5 = 14 lessons"""
import json, os
CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

def s(i,k,h,b): return {"id":i,"kind":k,"heading":h,"body":b}
def pt(q,o,c,r): return {"question":q,"options":o,"correct":c,"rationale":r}

# Shared content helpers for RN US + CA (same clinical content, different SEO/context)
def rn_chest_tube(slug, pathway_label, country):
    return {
"slug": slug,
"title": f"Chest Tube Management — {pathway_label} RN Priorities",
"topic":"Procedures & Skills","topicSlug":"chest-tube","bodySystem":"Respiratory",
"previewSectionCount":2,
"seoTitle":f"Chest Tube Management NCLEX-RN {pathway_label} — water-seal, suction, nursing care",
"seoDescription":f"NCLEX-RN chest tube: water-seal drainage system, air leak detection, suction chambers, clamping rules, tube dislodgement, and nursing priorities for {pathway_label} nurses.",
"sections":[
s("introduction","introduction","Overview",f"""Chest tubes drain air (pneumothorax), blood (hemothorax), fluid (pleural effusion, empyema), or a combination from the pleural space. They are managed in acute care, critical care, and post-surgical settings. NCLEX-RN tests: water-seal drainage system components, what is normal vs. abnormal, when to clamp or NOT clamp, and emergency responses to dislodgement or disconnection.

**Indications:**
- Pneumothorax (collapsed lung) — tube placed at 2nd intercostal space, midclavicular line
- Hemothorax — tube at 5th–6th intercostal space, midaxillary line
- Post-cardiac/thoracic surgery drainage
- Empyema (infected pleural fluid)
- Large pleural effusion unresponsive to thoracentesis

**How it works:** Tube → pleural space → underwater seal drainage system. The water seal acts as a one-way valve: air/fluid can exit pleural space but cannot re-enter."""),

s("pathophysiology_overview","pathophysiology_overview","Water-Seal Drainage System","""**Three-chamber system (Pleur-evac / Atrium):**

**Chamber 1 — Collection chamber:** Drains fluid from pleural space; measure at eye level every shift; document color and amount; sudden increase (>100 mL/hour) = hemorrhage → notify provider

**Chamber 2 — Water-seal chamber (essential):** Filled with 2 cm of sterile water; acts as one-way valve; normal findings:
- **Tidaling (fluctuation):** water level rises with inspiration, falls with expiration in spontaneously breathing patients; REVERSES in mechanically ventilated patients; absence of tidaling = tube obstructed OR lung fully re-expanded (confirm by X-ray)
- **Bubbling:** intermittent bubbling during exhalation = air escaping from pleural space (expected during pneumothorax resolution); continuous bubbling = AIR LEAK (tube-system connection loose, or persistent pleural air leak)

**Chamber 3 — Suction control chamber:** Filled to prescribed level (usually 20 cm water for −20 cmH₂O suction); gentle continuous bubbling in this chamber = suction is working correctly; vigorous bubbling does not increase suction — it wastes water"""),

s("signs_symptoms","signs_symptoms","Normal vs. Abnormal Findings","""| Finding | Normal or Abnormal | Action |
|---|---|---|
| Tidaling in water-seal | Normal | Document; reassess |
| Gentle bubbling in suction chamber | Normal | Document |
| Intermittent bubbling in water-seal during exhalation | Normal (pneumothorax draining) | Document; continue monitoring |
| **Continuous bubbling in water-seal** | **Abnormal — air leak** | Find source: check all connections; if connections are intact, leak is from chest/lung |
| No tidaling + no bubbling | Possibly abnormal | Assess for tube kink; could also mean lung re-expanded — confirm with X-ray |
| Sudden large increase in drainage (>100 mL/h) | Abnormal — hemorrhage | Notify provider STAT |
| Drainage stops, tube doesn't move | Tube likely clotted/kinked | Assess; notify provider; milk tube per protocol |
| Patient reports sharp pain, SpO₂ drops | Tube may be dislodged | Assess breath sounds; notify provider |
| Subcutaneous emphysema (crackling under skin) | Abnormal | Notify provider; air is escaping into tissues |

**Locating an air leak:**
Clamp tubing close to patient → if bubbling stops → leak is in patient/chest wall
Clamp progressively farther from patient until bubbling stops → leak at that connection"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Every-shift assessment:**
- Vital signs, SpO₂, breath sounds bilaterally
- Drainage: amount, color, consistency (document at eye level)
- Water-seal chamber: tidaling, bubbling character
- Suction chamber: water level, gentle continuous bubbling
- Dressing: intact, no leakage around insertion site
- Tube: not kinked, not dependent loops (loops → fluid blocks air drainage)
- Mark drainage level with time every 8 hours

**Positioning:**
- Head of bed 30–45° (improves lung expansion)
- Position system BELOW chest level at all times (gravity drainage)
- NEVER raise drainage system above patient chest (fluid re-enters pleural space)

**Tube dislodgement from chest wall:**
→ Cover immediately with petroleum gauze dressing taped on THREE sides only (flutter valve — allows air out on exhalation, prevents air in on inhalation)
→ Notify provider STAT
→ Monitor for tension pneumothorax

**Tube disconnection from drainage system:**
→ Submerge distal tube end in 2 cm sterile water immediately (maintains seal)
→ Reconnect as quickly as possible
→ Notify provider

**Clamping rules:**
- NEVER routinely clamp without a provider order
- Clamping can cause tension pneumothorax if air cannot escape
- Clamp only: to locate air leak, when changing drainage system (briefly), for water-seal integrity testing per protocol
- If tube is accidentally clamped without order: unclamp immediately"""),

s("pharmacology","pharmacology","Pain & Pleural Pharmacology","""**Pain management for chest tube:**
- NSAIDs or opioids per order for pleuritic pain
- Regional analgesia: intercostal nerve block, epidural — often used in surgical patients
- Thoracoscopic procedures may use bupivacaine instillation into pleural space

**Pleurodesis (for recurrent pleural effusion or pneumothorax):**
- Talc or doxycycline instilled through chest tube → creates inflammatory adhesion of pleural layers
- Patient positioned to distribute agent (rotate every 15 min × 1–2 hours)
- Pain is expected and severe — pre-medicate with analgesics

**Fibrinolytics (for complex parapneumonic effusion or empyema):**
- tPA/DNase instilled through chest tube → breaks down clots and fibrinous septations
- Monitor for bleeding"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls",f"""- **Tidaling = normal; continuous bubbling = air leak** — know this distinction cold for NCLEX-RN {pathway_label}
- **Drainage system is ALWAYS below chest** — never raise it above the chest (fluid backflows)
- **Tube dislodgement: 3-sided occlusive dressing** — flutter valve prevents tension pneumothorax
- **Never routinely clamp** — clamping can cause tension pneumothorax if air cannot escape
- **Gentle bubbling in suction chamber = correct suction** — vigorous bubbling wastes water; does not increase suction
- **No tidaling + no bubbling** — suspect obstruction OR successful re-expansion; confirm with X-ray before acting
- **Water-seal chamber: 2 cm water level** — if it drops (evaporation), add sterile water to maintain seal"""),

s("client_education","client_education","Patient Education","""- Deep breathe and cough hourly — this helps drain the pleural space and re-expand the lung; you may notice increased bubbling — this is normal
- Tell your nurse immediately if: you feel sudden sharp chest pain, your breathing gets worse, or the tube comes out
- The drainage system must always be kept below your chest — do not lift or tip it
- You can move carefully in bed; we will help you with ambulation
- After the tube is removed, you may feel soreness at the insertion site for several days; this is normal"""),

s("case_study","case_study","Case Application",f"""**Scenario:** A post-thoracotomy patient has a chest tube to water-seal with −20 cmH₂O suction. The RN notes continuous bubbling in the water-seal chamber that was previously intermittent.

**{pathway_label} RN analysis:** Continuous bubbling in the water-seal chamber = new air leak. This is always abnormal when previously absent.

**RN actions:**
1. Check all tube connections from chest wall to drainage unit — tighten any loose connections
2. Check dressing at insertion site for air entry
3. If connections are intact and bubbling continues → air leak from lung/chest wall → notify provider
4. Assess patient: vital signs, SpO₂, breath sounds, respiratory distress
5. Document: character change (intermittent → continuous), time, provider notification, patient assessment

**Wrong action:** Clamp the tube to stop the bubbling — clamping prevents air from leaving the pleural space and can cause tension pneumothorax.""")
],
"preTest":[
pt("A patient with a chest tube has continuous bubbling in the water-seal chamber. The nurse's priority action is:",["Clamp the tube to prevent air from entering the pleural space","Check all tube connections and assess the patient — continuous bubbling indicates an air leak","Increase the suction pressure to remove the air leak faster","Document the finding as expected during pneumothorax drainage"],1,"Continuous bubbling in the water-seal chamber indicates an air leak (intermittent bubbling during exhalation is normal). The nurse checks all connections first — loose connections are the most common cause. If connections are intact, the leak is from the lung/chest wall, requiring provider notification. Clamping can cause tension pneumothorax."),
pt("A chest tube accidentally dislodges from the patient's chest wall. The nurse's immediate action is:",["Reinsert the tube using the insertion site","Cover the site with a petroleum gauze dressing taped on three sides; notify provider","Apply firm pressure with a dry sterile gauze and tape all four sides","Clamp the chest tube and call for assistance"],1,"A dislodged chest tube is covered immediately with a petroleum (Vaseline) gauze dressing taped on three sides only. This creates a flutter valve — air escapes during exhalation but cannot enter during inhalation. Taping all four sides would trap air and cause tension pneumothorax. Reinsertion is a physician procedure."),
pt("The water-seal chamber shows no tidaling and no bubbling. The nurse's best action is:",["Clamp the tube — the drainage system has malfunctioned","Notify the provider that the tube may be obstructed or the lung may be re-expanded; request a chest X-ray","Milk the tube vigorously to restore tidaling","Raise the drainage unit to eye level to assess fluid movement"],2,"Absence of tidaling and bubbling has two possible causes: tube obstruction (kink, clot) OR successful lung re-expansion. Both require differentiation. A chest X-ray confirms lung re-expansion. Milking the tube per protocol may be ordered if obstruction is suspected. Raising the drainage unit above chest level causes fluid to flow back into the pleural space — always keep below the chest."),
pt("Vigorous, forceful bubbling is noted in the suction control chamber. What is the most appropriate nursing action?",["Notify the provider — this indicates excessive suction","Increase the suction to match the vigorous rate","Reduce the suction per standing orders to decrease the bubbling","Reduce the suction flow at the wall to achieve gentle, consistent bubbling"],3,"The suction control chamber should have gentle, continuous bubbling — this confirms active suction at the prescribed level. Vigorous bubbling in this chamber does not increase the effective suction; it only wastes water. Reducing wall suction until gentle bubbling is achieved is the correct intervention. This is a common NCLEX distractor testing knowledge of the suction chamber."),
pt("A chest tube drainage system needs to be repositioned. The patient is sitting up. Where must the drainage unit be placed?",["At the patient's chest level for accurate drainage measurement","Below the level of the patient's chest at all times","Above the patient's waist for comfort during ambulation","At the bed level, which varies with head-of-bed position"],1,"The chest tube drainage system must always remain below the patient's chest level to use gravity for drainage and prevent fluid from flowing back into the pleural space. If the drainage unit is raised above the chest — even briefly — fluid can re-enter the pleural space, reversing treatment.")
]
}

def rn_wound_drain(slug, pathway_label):
    return {
"slug": slug,
"title": f"Wound Drainage Systems — {pathway_label} RN Assessment",
"topic":"Procedures & Skills","topicSlug":"wound-drainage","bodySystem":"Integumentary & Wound Care",
"previewSectionCount":2,
"seoTitle":f"Wound Drainage Systems NCLEX-RN {pathway_label} — Jackson-Pratt, Hemovac, milking vs stripping",
"seoDescription":f"NCLEX-RN wound drainage: Jackson-Pratt vs Hemovac, expected output, drain stripping vs milking, wound infection assessment, and post-op drain nursing priorities for {pathway_label}.",
"sections":[
s("introduction","introduction","Overview",f"""Surgical drains remove blood and serous fluid from wound cavities, preventing hematoma and seroma formation and reducing infection risk. The RN manages drain output, assesses for complications, and educates patients about drain care. These are common post-operative nursing responsibilities tested on NCLEX-RN for {pathway_label} nurses.

**Common surgical drains:**
- **Jackson-Pratt (JP) drain:** Flat, oval bulb; maintains negative pressure by compression; used after mastectomy, abdominal surgery, thyroid surgery
- **Hemovac drain:** Larger flat disk; compressed for negative pressure; used after orthopedic surgery (hip, knee replacement), larger wound cavities
- **Penrose drain:** Flat rubber tube; PASSIVE drainage (no suction); placed in contaminated wounds; allows free drainage
- **Blake drain:** Multi-channel tube; used in chest/abdominal surgery; active suction via negative pressure"""),

s("pathophysiology_overview","pathophysiology_overview","Drain Management Principles","""**Active vs. passive drainage:**
- Active (Jackson-Pratt, Hemovac): closed system with negative pressure; reduces dead space and infection risk
- Passive (Penrose): open system; drains by gravity; used when suction would damage fragile structures

**Expected output:**
- First 24 hours post-op: serosanguineous (pink-tinged, blood + serum) — normal
- Days 1–3: output should decrease in volume and transition from serosanguineous → serous (yellow/straw-colored)
- Sudden large increase in red drainage → hemorrhage → notify provider STAT
- Milky/cloudy → possible chyle leak (thoracic duct injury) or infection
- Purulent → infection

**Emptying and recharging:**
- Jackson-Pratt: empty when half full; compress bulb, cap, release → creates suction; document output at each emptying
- Hemovac: empty when 1/2–3/4 full; compress flat, cap, release → creates suction
- Empty every shift and PRN when >1/2 full; measure and record output accurately

**Drain stripping vs. milking:**
- Stripping: pinching tube and sliding fingers down → creates HIGH negative pressure → can damage tissue; generally not recommended
- Milking: squeezing and releasing tube segments → gentler; clears clots without excessive negative pressure
- Both require a specific provider order; not routine unless tube is obstructed"""),

s("signs_symptoms","signs_symptoms","Assessment Findings","""**Normal post-operative drain findings:**
- Output decreasing daily
- Color: serosanguineous → serous
- Skin around drain site: mild erythema/bruising (expected from tissue manipulation)
- Drain maintains negative pressure (JP bulb stays compressed; Hemovac stays flat between emptying)

**Abnormal findings requiring notification:**
- Sudden large increase in output (hemorrhage)
- Output of bright red blood (arterial bleed)
- Purulent, foul-smelling drainage (wound infection)
- Drain bulb/disk not maintaining suction despite correct technique
- Skin around site: increasing erythema, warmth, edema beyond expected
- Patient reports pain at drain site out of proportion
- Drain accidentally removed

**Wound infection signs (PRSST):**
- Pain (increasing, not decreasing after day 2–3)
- Redness (extending beyond wound edges)
- Swelling (increasing)
- Streaking (red lines = lymphangitis → cellulitis spreading)
- Temperature (fever ≥38.5°C post-op day 3+ = infection until proven otherwise)"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Every-shift drain assessment:**
1. Measure and document output (volume, color, character)
2. Ensure drain maintains negative pressure (JP bulb compressed, Hemovac flat)
3. Assess drain site: erythema, drainage around site, dressing integrity
4. Assess drain security: sutured in place? tubing not kinked or compressed?
5. Pin tubing to patient's gown to prevent accidental dislodgement

**Documentation requirements:**
- Date and time of drain emptying
- Volume of output (mL)
- Color and character description
- Drain site assessment
- Cumulative output for shift and 24 hours

**When to notify provider:**
- Output >200 mL/hour (post-cardiac surgery: earlier threshold per protocol)
- Sudden change in output color (serosanguineous → bright red)
- Signs of infection
- Drain falls out

**If drain falls out:**
- Cover site with sterile dressing
- Notify provider
- Do NOT attempt to reinsert
- Monitor wound site closely for fluid accumulation (seroma, hematoma)

**Patient preparation for discharge with drain:**
- Demonstrate drain emptying technique
- Return demonstration before discharge
- Provide documentation log for output tracking
- Teach signs of infection; when to call provider
- Discuss drain removal: typically when output <25–30 mL/24 hours for 2 consecutive days"""),

s("pharmacology","pharmacology","Perioperative Wound Care","""**Wound irrigation:**
- Normal saline: first-line for wound cleansing; isotonic, non-damaging
- Prontosan: surfactant-based wound cleanser; reduces biofilm
- Avoid: hydrogen peroxide (damages granulation tissue), full-strength Betadine (cytotoxic to healing tissue)

**Prophylactic antibiotics:**
- Given within 60 minutes before surgical incision (cefazolin most common)
- Stop within 24 hours post-operatively (unless infection present)
- Prolonged perioperative antibiotics increase resistance without reducing SSI

**Wound closure products:**
- Staples/sutures: removed per protocol (skin staples: 7–14 days depending on location)
- Steri-strips: reinforce healing incision after suture/staple removal
- Tissue glue (Dermabond): used in emergency and some pediatric wounds
- Negative pressure wound therapy (NPWT/VAC): for large, complex, or infected wounds — requires trained provider or wound nurse to initiate; RN monitors system, output, dressing integrity"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **JP and Hemovac maintain suction by compression** — if the bulb inflates fully without any output, it has lost suction; re-compress and cap
- **Serosanguineous output decreasing daily = expected** — report output that increases or returns to bright red
- **Never reinsert a dislodged drain** — cover with sterile dressing; call provider
- **Document output at each emptying, every shift, and as a 24-hour total** — post-surgical drainage is part of the fluid balance record
- **Pin the drain tubing to the gown** — prevents accidental dislodgement during patient movement
- **<25–30 mL/24h for 2 consecutive days = drain removal criteria** — teach patients this goal at discharge"""),

s("client_education","client_education","Patient Education","""**Going home with a drain:**
- Empty the drain when it is half full, at least twice a day
- Wash your hands before touching the drain
- Compress the bulb/disk completely before capping it — this creates the suction that makes the drain work
- Write down the amount, color, and time every time you empty it — bring this log to your follow-up appointment
- Pin the tube to your clothing to prevent it from being pulled

**Call your provider if:**
- Drain output increases suddenly or becomes bright red
- Drainage looks cloudy or has a foul odor
- The skin around the drain becomes more red, warm, or swollen
- The drain falls out — cover the site with a clean cloth and call immediately
- You develop a fever (>38.3°C/101°F)"""),

s("case_study","case_study","Case Application","""**Scenario:** A patient had a right mastectomy 18 hours ago. She has a Jackson-Pratt drain in place. During morning assessment, the drain bulb is fully inflated (not compressed). Output recorded overnight: 120 mL serosanguineous.

**RN Analysis:**
- Fully inflated JP bulb = has lost suction; not functioning as intended
- 120 mL overnight serosanguineous output: appropriate amount for first 24 hours post-mastectomy
- Need to recharge the drain

**RN actions:**
1. Empty the drain: open plug, pour into graduated container, document volume and color
2. Recharge: compress bulb fully (squeeze out all air), replace plug while compressed, release → creates negative pressure; bulb should remain partially compressed
3. Pin tubing securely to patient's gown
4. Assess insertion site: erythema, drainage around site, dressing
5. Educate patient on the process — she will be doing this at home after discharge

**Discharge teaching priority:** Return demonstration of drain emptying before discharge. Patient must understand how to compress/cap the bulb, how to document output, and what output changes should prompt a call to the provider.""")
],
"preTest":[
pt("A patient's Jackson-Pratt drain bulb is fully inflated 2 hours after being emptied. The nurse's priority action is:",["Notify the provider — the drain has malfunctioned and requires replacement","Empty and recharge the drain by fully compressing the bulb before replacing the plug","Strip the drain tubing to restore negative pressure","Apply additional tape around the drain site to prevent air entry"],1,"A fully inflated JP bulb indicates loss of negative pressure suction. The intervention is to empty any accumulated fluid, then recharge: fully compress the bulb to expel air, replace the plug while the bulb is compressed, and release — this recreates negative pressure. This is routine drain maintenance, not a malfunction requiring replacement."),
pt("A patient 3 days post-abdominal surgery has a Hemovac drain with 180 mL of bright red output in the past 2 hours. The appropriate nursing action is:",["Document the finding — serosanguineous drainage is expected after surgery","Empty the drain, recharge, and continue monitoring hourly","Notify the provider immediately — sudden bright red output indicates possible hemorrhage","Clamp the drain to reduce output and reassess in 1 hour"],2,"Bright red drain output (not serosanguineous) combined with high volume (180 mL/2 hours) after 3 days post-operatively suggests hemorrhage. By post-op day 3, drainage should be decreasing in volume and becoming more serous. The provider must be notified immediately. Clamping the drain traps blood in the wound cavity."),
pt("Which teaching is most important before discharging a patient with a Jackson-Pratt drain?",["Avoid showering until the drain is removed","Compress the bulb completely before replacing the cap to maintain suction","Change the dressing around the drain twice daily using a sterile technique","Limit arm movement on the operative side to prevent drain dislodgement"],1,"The most critical skill for home drain management is maintaining suction. The patient must compress the bulb fully to expel all air before capping — this creates the negative pressure that draws fluid out of the wound cavity. If the bulb is not properly compressed, the drain does not function. This is the essential technique for home management."),
pt("Which finding in a patient with a surgical drain requires immediate provider notification?",["Output of 45 mL of serosanguineous fluid in 8 hours on post-op day 1","Output decreasing from 80 mL to 50 mL over 24 hours","Drain bulb losing suction between emptying intervals","Purulent, foul-smelling drainage on post-op day 4"],3,"Purulent, foul-smelling drain output indicates wound infection — a complication requiring immediate provider notification for evaluation and antibiotic therapy. Serosanguineous output on post-op day 1 is expected. Decreasing output reflects healing. Suction loss between emptying is corrected by recharging — it does not indicate a complication."),
pt("Which statement by a patient indicates understanding of wound drain care before discharge?",["'I will empty the drain only when it is completely full.'","'I will record the output amount and color each time I empty the drain.'","'I should strip the tubing daily to keep it from clotting.'","'I can stop recording output once the drainage turns from pink to clear.'"]
,1,"Accurate output documentation at each emptying is essential for provider assessment of wound healing and drain removal timing. Drains are typically removed when output is <25–30 mL in 24 hours for 2 consecutive days. Emptying only when full reduces drainage efficacy. Stripping requires a provider order and can damage tissue. Output documentation continues until drain removal.")
]
}

def rn_tpn(slug, pathway_label):
    return {
"slug": slug,
"title": f"Total Parenteral Nutrition — {pathway_label} RN Management",
"topic":"Nutrition","topicSlug":"total-parenteral-nutrition","bodySystem":"Multisystem",
"previewSectionCount":2,
"seoTitle":f"TPN Total Parenteral Nutrition NCLEX-RN {pathway_label} — central line, refeeding, monitoring",
"seoDescription":f"NCLEX-RN TPN: central line care, glucose monitoring, refeeding syndrome, electrolyte imbalances, dedicated line rule, and {pathway_label} nursing priorities for parenteral nutrition.",
"sections":[
s("introduction","introduction","Overview",f"""Total parenteral nutrition (TPN) delivers complete nutritional requirements intravenously when the GI tract is non-functional. It is an advanced nursing skill requiring precise monitoring and rigorous infection prevention. NCLEX-RN ({pathway_label}) tests: central line management, glucose monitoring, refeeding syndrome recognition, and what can and cannot be administered through a TPN line.

**Indications for TPN:** Prolonged NPO (>5–7 days expected), short bowel syndrome, severe malabsorption, GI fistula, severe pancreatitis, bowel obstruction, post-surgical ileus, critically ill patients unable to tolerate enteral feeding.

**TPN vs. Enteral Nutrition:** Enteral nutrition is always preferred when the GI tract is functional. TPN is used ONLY when the gut cannot be used. The GI tract needs stimulation to maintain mucosal integrity — TPN bypasses this."""),

s("pathophysiology_overview","pathophysiology_overview","Components & Access","""**TPN macronutrient components:**
- Dextrose: 25–35% concentration in central TPN → provides 3.4 kcal/g; high osmolarity requires central vein
- Amino acids: 3–15% concentration → provides 4 kcal/g; supports protein synthesis and wound healing
- Lipid emulsion: 20% intralipid → provides 9 kcal/g; given separately or as 3-in-1; do NOT shake (destroys emulsion)
- Total calorie goal: typically 25–35 kcal/kg/day

**Electrolytes, vitamins, trace elements:** Added by pharmacy; customized daily based on labs.

**Central venous access required:** Dextrose concentration >10% causes thrombophlebitis in peripheral veins. Standard TPN requires PICC line, subclavian, internal jugular, or femoral central venous catheter.

**Peripheral parenteral nutrition (PPN):** Lower dextrose (≤10%), lower osmolarity; only for short-term, supplemental nutrition; not adequate for complete nutritional support."""),

s("signs_symptoms","signs_symptoms","Monitoring Parameters","""**Blood glucose:** Every 4–6 hours during TPN infusion. Target 140–180 mg/dL (ICU patients). Hyperglycemia is most common complication. Correct with regular insulin added to TPN bag or sliding scale.

**Refeeding syndrome (severely malnourished patients):**
- Hypophosphatemia (most critical) — causes respiratory failure, hemolysis, arrhythmias
- Hypokalemia — cardiac arrhythmias
- Hypomagnesemia — arrhythmias, seizures
- Thiamine deficiency — Wernicke's encephalopathy
- Monitor: daily electrolytes (especially phosphorus, K+, Mg2+) during first week
- Prevent: start at 25% of goal rate; increase gradually; supplement thiamine before starting

**Other monitoring:**
- Daily weights: trend fluid balance
- I&O: strict tracking
- Weekly: liver function tests (hepatic steatosis from TPN), triglycerides (lipid tolerance)
- CXR after central line placement: confirm tip position in SVC before first use"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**TPN-specific rules:**
1. **Dedicated lumen:** TPN must infuse through a designated central line lumen — no blood draws, no blood products, no other IV medications through that lumen
2. **Tubing change:** IV tubing changed every 24 hours for TPN (lipid-containing solutions support microbial growth)
3. **In-line filter:** 1.2 micron filter for 3-in-1 (lipid-containing); 0.22 micron filter for dextrose/amino acid only
4. **Inspect before hanging:** Do NOT use if: cloudy, particulate matter visible, bag cracked, emulsion "cracked" (oil droplets separated)
5. **No additives:** Pharmacy formulates; RN does NOT add medications to TPN bag

**Central line site care:**
- Change dressing per protocol (chlorhexidine-impregnated): every 7 days for transparent dressing, every 48 hours for gauze, immediately if wet/soiled/loose
- Assess site at every shift: erythema, swelling, tenderness, discharge
- Clean with chlorhexidine using friction; dry before applying dressing
- Cap changes: needleless connectors changed per protocol (every 3–7 days)

**If TPN must be stopped:**
- Never abrupt discontinuation → rebound hypoglycemia
- Hang D10W (10% dextrose) at same rate until new TPN bag available
- Wean TPN gradually when starting oral/enteral intake

**Blood glucose management:**
- Check every 4–6 hours
- If >180 mg/dL: follow sliding scale insulin protocol or notify provider
- Avoid targeting <140 mg/dL in non-ICU patients (hypoglycemia risk)"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls",f"""- **Dedicated lumen — no exceptions** — medications added to TPN line cause incompatibilities and infection risk; this is always tested on NCLEX-RN {pathway_label}
- **Abrupt TPN stop → hypoglycemia** — the pancreas continues secreting insulin for the high-glucose infusion; always hang D10W at same rate
- **Refeeding: phosphorus is the critical electrolyte** — severe hypophosphatemia causes respiratory failure; start TPN slowly in malnourished patients
- **Inspect every bag before hanging** — cracked emulsion (oil separation) or cloudiness = do not use; return to pharmacy
- **X-ray before first TPN use** — verify central line tip in SVC; infusing TPN into a misplaced line causes immediate tissue damage
- **TPN tubing: 24-hour change** — lipid-containing solutions support microbial growth rapidly"""),

s("client_education","client_education","Patient Education","""- TPN is a complete nutrition delivered through your IV — it contains all the nutrients your body needs while your digestive system is unable to work
- Blood sugar checks will happen frequently — the glucose in TPN can elevate your blood sugar
- Your weight will be checked daily — this helps monitor your fluid balance
- The IV tubing and dressing will be changed regularly by your nurse to prevent infection
- If you feel shaky, sweaty, or confused, tell your nurse immediately — this could be a blood sugar problem"""),

s("case_study","case_study","Case Application",f"""**Scenario:** A post-Whipple procedure patient has TPN infusing at 85 mL/hr via PICC line. A colleague asks to piggyback vancomycin through the TPN lumen because other IV access is unavailable.

**{pathway_label} RN response:**
- Vancomycin is physically and chemically incompatible with many TPN components
- Infusing via the TPN lumen introduces organisms, alters pH, and risks precipitate formation
- This is a patient safety violation regardless of access urgency

**Correct actions:**
1. Decline to use the TPN lumen — explain the incompatibility and contamination risk
2. Insert a new peripheral IV for vancomycin (or arrange a new central access per provider order)
3. Notify the provider that alternative IV access is needed
4. Document the situation

**If patient truly has NO other access:** This is an emergency situation — notify provider and pharmacy immediately; NEVER sacrifice TPN line safety; peripheral access should be obtained or a new lumen added to the central line.""")
],
"preTest":[
pt(f"A NCLEX-RN {pathway_label} question: A patient receiving TPN needs IV vancomycin. No peripheral IV access is available. Which action is correct?",["Piggyback vancomycin through the unused TPN lumen since it is sterile","Insert a new peripheral IV; the TPN lumen is dedicated and cannot be used for other medications","Run vancomycin simultaneously through the TPN line at a faster rate to separate the medications","Add vancomycin to the TPN bag since pharmacy can reformulate"],1,"The TPN lumen must remain dedicated — no blood draws, blood products, or IV medications may be infused through it. This prevents contamination and incompatible precipitate formation. A new IV site must be established. Adding medications to TPN bags is also prohibited — only pharmacy formulates TPN."),
pt("A patient's TPN is accidentally stopped. No new bag is immediately available. The nurse's priority action is:",["Flush the line with normal saline and wait for the new bag","Hang D10W (10% dextrose) at the same infusion rate to prevent hypoglycemia","Restart oral intake to maintain glucose until TPN arrives","Start a peripheral saline infusion to keep the line patent"],1,"Abrupt discontinuation of TPN causes rebound hypoglycemia because the pancreas continues secreting insulin in response to the previously high glucose load. D10W at the same infusion rate provides glucose support until the new TPN bag is available, preventing dangerous hypoglycemia."),
pt("A patient receiving TPN for severe malnutrition after prolonged starvation develops muscle weakness and respiratory distress on day 2. Labs show phosphorus 1.6 mg/dL. This presentation is most consistent with:",["Hyperglycemia from the high dextrose content of TPN","Refeeding syndrome — the carbohydrate load drove phosphorus into cells","Central line infection causing septic emboli","TPN-related hepatotoxicity"],1,"Refeeding syndrome occurs when carbohydrates are introduced to a severely malnourished patient. The insulin surge drives phosphorus, potassium, and magnesium into cells, causing critical serum depletion. Hypophosphatemia (1.6 mg/dL) causes respiratory muscle weakness and failure. TPN should be started at 25% of goal rate and increased slowly in malnourished patients."),
pt("The nurse is preparing to hang a new TPN bag. Upon inspection, the bag appears slightly cloudy with visible oil droplets separated at the top. The correct action is:",["Gently shake the bag to re-emulsify the lipids before hanging","Hang the bag and reassess in 1 hour for clarity improvement","Return the bag to pharmacy — a 'cracked' emulsion is unsafe to infuse","Warm the bag at room temperature until the emulsion resolves"],2,"A cracked emulsion (oil droplets visible, separating from the solution) indicates the lipid emulsion has broken down and is unsafe. Infusing a cracked emulsion can cause fat embolism. The bag must be returned to pharmacy and replaced. Shaking, warming, or infusing are all incorrect and dangerous."),
pt("Which laboratory finding is the highest priority to monitor daily during the first week of TPN in a malnourished patient?",["Serum triglycerides","Serum phosphorus","Blood glucose","Serum albumin"],1,"Serum phosphorus is the most critical electrolyte to monitor during refeeding. Severe hypophosphatemia from refeeding syndrome causes life-threatening respiratory failure, hemolysis, and cardiac arrhythmias. Blood glucose is monitored more frequently (every 4–6 hours) but phosphorus is the highest-priority daily lab for refeeding syndrome detection. Albumin reflects nutritional status over weeks, not daily changes.")
]
}

def rn_enteral(slug, pathway_label):
    return {
"slug": slug,
"title": f"Enteral Nutrition & Tube Feeding — {pathway_label} RN",
"topic":"Nutrition","topicSlug":"enteral-tube-feeding","bodySystem":"Multisystem",
"previewSectionCount":2,
"seoTitle":f"Enteral Nutrition Tube Feeding NCLEX-RN {pathway_label} — NG tube, aspiration prevention, PEG",
"seoDescription":f"NCLEX-RN enteral nutrition: NG tube placement verification, HOB positioning, residual volumes, aspiration prevention, PEG care, and {pathway_label} RN nursing priorities.",
"sections":[
s("introduction","introduction","Overview",f"""Enteral nutrition (tube feeding) is the preferred method of nutritional support when the GI tract is functional but oral intake is insufficient. NCLEX-RN ({pathway_label}) tests: tube placement verification methods, aspiration prevention, gastric residual volumes, and tube feeding complications. The RN is responsible for safe tube feeding administration and monitoring.

**When to use enteral vs. parenteral:**
Enteral first — "if the gut works, use it." The GI tract requires luminal nutrition to maintain mucosal integrity, prevent bacterial translocation, and support gut immunity. TPN bypasses these benefits and carries higher infection risk."""),

s("pathophysiology_overview","pathophysiology_overview","Tube Types & Placement Verification","""**Nasogastric (NG) tube:** Most common; nose → stomach. Confirmed by X-ray on initial placement — REQUIRED before first use. Ongoing checks: external length at nose, pH of aspirate (<5 = gastric).

**X-ray vs. auscultation:** Auscultation (air bolus) is UNRELIABLE and NOT an accepted standalone verification method. X-ray is mandatory for initial placement. pH < 5 is reliable for ongoing verification if X-ray confirmed initial placement.

**Gastric residual volume (GRV) monitoring:**
- Check GRV before each intermittent feeding and every 4 hours during continuous feeding
- GRV >500 mL: hold feeding, notify provider, reassess gastric motility
- GRV 250–500 mL: reassess, consider prokinetic agents, continue with caution per protocol
- Return aspirate to patient (unless per protocol) — prevents electrolyte loss
- Prokinetics: metoclopramide or erythromycin to improve gastric emptying

**Tube feeding routes and formulas:**
- Standard: 1.0–1.5 kcal/mL; most hospitalized patients
- High-protein: post-surgical, wound healing, burn patients
- Renal: reduced potassium, phosphorus, protein (pre-dialysis CKD)
- Pulmonary: reduced carbohydrate (excess CO₂ from carb metabolism worsens respiratory failure)
- Elemental/semi-elemental: pre-digested; for malabsorption, pancreatitis, short bowel"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Aspiration prevention (highest priority):**
- Head of bed: 30–45° minimum during feedings; maintain 30 min after bolus feeds
- Never feed a patient in supine position
- Use small-bore feeding tubes (less uncomfortable, less aspiration risk than large-bore)
- Monitor GRV per protocol
- For high-risk patients: jejunal tube (bypasses stomach entirely)

**Tube maintenance:**
- Flush: 30 mL water before/after each bolus, after medications, every 4 hours for continuous
- Mark tube at nose; check external length each shift
- Oral care every 2–4 hours (prevents VAP, patient comfort)

**Medication administration via tube:**
- Check each medication for crushability — many cannot be crushed (ER, EC, sublingual)
- Use liquid formulations when available
- Give medications separately; flush 5–10 mL between each
- Flush 30 mL before and after full medication administration
- Phenytoin: hold tube feeding 2 hours before and after (significantly reduces phenytoin absorption)

**PEG tube site care:**
- Rotate external bumper daily (360°) to prevent buried bumper syndrome (skin grows over internal disk)
- Clean site with soap and water; rinse; dry
- Keep site clean and dry; assess for leakage, erythema, granulation tissue, buried bumper"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls",f"""- **X-ray for initial placement, then pH + length for ongoing** — auscultation alone is NEVER sufficient for NCLEX-RN {pathway_label}
- **HOB 30–45° is non-negotiable during tube feedings** — supine feeding = aspiration pneumonia
- **Phenytoin absorption is reduced by tube feedings** — hold feeding 2 hours before and after phenytoin; check levels
- **GRV >500 mL = hold and notify** — large residuals indicate poor gastric motility and high aspiration risk
- **Return aspirate to patient** — prevents electrolyte and acid depletion
- **Buried bumper syndrome** — PEG internal disk grows into gastric wall from insufficient rotation; rotate bumper daily"""),

s("client_education","client_education","Patient Education","""- Always sit upright (90°) during feedings and for at least 30 minutes after — this prevents formula from entering your lungs
- Flush the tube with 30 mL of water before and after each feeding and medication
- Check the tube mark at your nose before each feeding — call us if the length has changed
- For PEG tubes: clean the site daily; rotate the bumper; watch for skin changes around the site"""),

s("case_study","case_study","Case Application",f"""**Scenario:** A patient with a newly placed NG tube needs tube feeding started. A nurse's aide reports she confirmed tube placement "by injecting air and listening with a stethoscope."

**{pathway_label} RN action:**
- Auscultation is an unreliable, outdated method — do NOT use to verify initial NG placement
- Tube feeding has NOT been cleared to start
- Obtain X-ray NOW before initiating any feeding or medication
- Explain to the aide why auscultation is insufficient (can produce sounds even when tube is in the lung)
- Document the situation; delay feeding until X-ray confirmation""")
],
"preTest":[
pt("Before initiating tube feedings through a newly placed NG tube, the nurse's priority action is:",["Inject 20 mL of air and auscultate over the stomach to confirm placement","Obtain a chest/abdominal X-ray to confirm tube placement before first use","Test the pH of gastric aspirate — pH <5 confirms gastric placement","Mark the tube at the nose and begin feeding at half the prescribed rate"],1,"X-ray is required for verification of initial NG tube placement before the first use. Auscultation (air bolus method) is unreliable and not an accepted standalone verification method. pH testing and external length marking are used for ongoing verification after X-ray has confirmed initial correct placement."),
pt("A patient receiving continuous tube feedings has a gastric residual volume of 480 mL. The nurse's action is:",["Continue feeding — this volume is within acceptable parameters","Hold the tube feeding and notify the provider for evaluation of gastric motility","Flush with 60 mL of water and continue feeding at half the rate","Discard the aspirate and restart feeding from the beginning of the bag"],1,"GRV >500 mL typically warrants holding the tube feeding and notifying the provider. A GRV of 480 mL approaching this threshold requires careful assessment — many protocols would recommend holding the feeding at this level as well. The provider needs to evaluate gastric motility and consider prokinetic agents. Aspirate should be returned to the patient, not discarded."),
pt("A patient on tube feedings receives phenytoin (Dilantin) suspension via the feeding tube. Which action is required?",["Administer phenytoin mixed directly into the tube feeding formula","Hold tube feedings 2 hours before and after phenytoin administration","Crush the extended-release phenytoin capsule for tube administration","Administer phenytoin via IV instead — tube administration is contraindicated"],1,"Tube feeding formula significantly reduces phenytoin absorption by binding to the medication. Standard practice requires holding tube feedings for 2 hours before and after phenytoin administration to ensure therapeutic drug levels. Phenytoin levels should be monitored. Extended-release formulations cannot be crushed."),
pt("A PEG tube patient's external bumper has not been rotated for 5 days. The nurse is concerned about which complication?",["Pressure injury from the bumper resting against the skin","Buried bumper syndrome — the internal disk may grow into the gastric wall","Tube dislodgement from insufficient securement","Peristomal skin maceration from formula leakage"],1,"Buried bumper syndrome occurs when the internal fixator disk of a PEG tube becomes embedded in the gastric or abdominal wall due to excessive compression or failure to rotate. Daily 360° rotation of the external bumper prevents this complication. Once buried, the tube cannot be removed without endoscopic or surgical intervention."),
pt("Which patient position is required during tube feeding administration?",["Supine with a small pillow under the head for comfort","Reverse Trendelenburg at 15 degrees","30–45 degree head-of-bed elevation at minimum","Lateral (side-lying) position to facilitate gravity drainage into the stomach"],2,"Patients must be positioned at 30–45° head-of-bed elevation during all tube feeding administration and for at least 30 minutes after bolus feeds. Supine feeding significantly increases aspiration risk. Lateral position and Trendelenburg also increase aspiration risk. This positioning requirement applies to all tube feeding routes including NG, PEG, and nasojejunal tubes.")
]
}

def rn_exam_strategy(slug, pathway_label, country_context):
    return {
"slug": slug,
"title": f"NCLEX-RN Exam Strategy & Next Generation Clinical Judgment — {pathway_label}",
"topic":"Exam Strategy","topicSlug":"exam-strategy","bodySystem":"Multisystem",
"previewSectionCount":2,
"seoTitle":f"NCLEX-RN Exam Strategy NGN Clinical Judgment {pathway_label} — test-taking, prioritization",
"seoDescription":f"NCLEX-RN {pathway_label} exam strategy: Next Generation NCLEX clinical judgment model, Maslow prioritization, ABCs, SATA approach, and test-taking strategies for {country_context} nurses.",
"sections":[
s("introduction","introduction","Overview",f"""The NCLEX-RN tests clinical judgment, not memorization. Understanding the examination's question formats, prioritization frameworks, and item formats — including Next Generation NCLEX (NGN) item types — is essential for exam success. This lesson prepares {pathway_label} nurses for the cognitive strategies and test-taking approaches that maximize performance.

**NCLEX-RN 2024+ format:**
- Computer adaptive testing (CAT) — question difficulty adjusts based on performance
- Total items: 70–135 operational questions (plus unscored experimental items)
- NGN item types (Next Generation NCLEX): case studies, enhanced multiple choice, matrix/grid, extended drag-and-drop, bow-tie questions
- Clinical Judgment Measurement Model (CJMM): the framework for all NGN items

**Next Generation NCLEX — 6 clinical judgment steps (CJMM):**
1. Recognize cues (identify relevant data)
2. Analyze cues (interpret the clinical significance)
3. Prioritize hypotheses (determine most likely/serious problems)
4. Generate solutions (identify evidence-based interventions)
5. Take action (implement chosen solutions)
6. Evaluate outcomes (assess effectiveness of interventions)"""),

s("pathophysiology_overview","pathophysiology_overview","Prioritization Frameworks",f"""**Maslow's Hierarchy of Needs (for patient prioritization):**
1. Physiological needs: airway, breathing, circulation, fluid/electrolytes, nutrition, elimination, temperature — ALWAYS addressed first
2. Safety and security: fall prevention, medication safety, safe environment
3. Love and belonging: therapeutic relationship, family support
4. Esteem: patient dignity, self-respect, independence promotion
5. Self-actualization: health promotion, education, achieving potential

**Priority rule:** Physiological problems always take priority over psychological needs UNLESS the psychological problem is life-threatening (active suicidal ideation with plan = immediate physiological risk).

**ABCs (Airway, Breathing, Circulation):**
- Any patient with airway compromise FIRST
- Any patient with breathing difficulty SECOND
- Any patient with circulation problem THIRD
- Apply within Maslow's physiological tier

**The Acute vs. Chronic Rule:**
- An acute change in a stable patient takes priority over a chronically unstable patient
- Example: A patient with chronic COPD at their baseline vs. a post-op patient with sudden new respiratory distress → new acute problem first

**{country_context} practice context:**
- Questions reflect evidence-based guidelines used in {country_context} practice
- Medication names may be brand or generic
- Lab normal values follow {country_context} conventions"""),

s("signs_symptoms","signs_symptoms","Question Analysis Strategies","""**Step 1 — Read the stem completely:**
- Identify: Who is the patient? What is the setting? What is being asked?
- Look for key words: "priority," "first," "most important," "best," "most appropriate"
- "First" = priority action question; "best" = select among good options; "most appropriate" = clinical judgment

**Step 2 — Identify what the question is really asking:**
- Is this a knowledge question (what is X)?
- Is this an application question (what do you do when X happens)?
- Is this a prioritization question (which patient/intervention first)?
- Is this a safety question (what is dangerous here)?

**Step 3 — Use the elimination strategy:**
- Eliminate clearly incorrect answers immediately
- Of remaining options: which is MOST relevant to the question's priority?
- Look for the option that addresses the underlying physiological problem

**SATA (Select All That Apply) approach:**
- Treat each option as True/False independently
- Do not look for patterns (e.g., "3 is usually right") — there is no pattern
- Average 2–4 correct answers; 1 or 5 correct are possible
- When uncertain about an option: if it could harm any patient, exclude it

**Common NCLEX traps:**
- "Option A looks right, but option B is more specific/urgent" → choose B
- "Both C and D seem correct" → apply prioritization frameworks
- "The answer I'd do first in real life" vs. "what NCLEX expects" → usually aligned if you apply the frameworks correctly"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","NGN Item Types","""**Enhanced Multiple Choice:**
- Single correct answer from 4–6 options
- May include more complex clinical scenarios with multiple data points
- Strategy: identify which data is relevant, which is a distractor

**Select All That Apply (SATA):**
- 2–6 correct answers from 5–8 options
- No partial credit — must select ALL correct and NO incorrect options
- High-difficulty item type; requires complete knowledge

**Matrix/Grid Questions:**
- Multiple rows with multiple columns
- Each row asks a different question about related content
- Example: Match nursing actions to clinical situation; identify which findings to report vs. which are expected

**Bow-Tie Questions:**
- Central clinical issue (e.g., "patient with X")
- Left side: potential conditions causing the problem
- Right side: nursing actions to address the condition
- Tests complete clinical reasoning: recognize problem → choose intervention

**Case Studies (NGN multi-item):**
- 6 questions based on one evolving patient scenario
- Questions build on each other; scenario develops over time
- Tests all 6 CJMM steps across the case
- Strategy: Re-read the updated scenario cue carefully before each question

**Extended Drag-and-Drop:**
- Order nursing actions; match interventions to patients; categorize findings
- Strategy: complete the definite placements first, then uncertain ones"""),

s("pharmacology","pharmacology","High-Yield NCLEX Pharmacology Principles","""**Safe medication administration — always tested:**
- 6 rights: Patient, Medication, Dose, Route, Time, Documentation
- Verify allergies before EVERY new medication
- High-alert medications: insulin, anticoagulants, opioids, concentrated electrolytes, chemotherapy
- Do NOT crush: ER/XR/SR/XL/LA tablets; enteric-coated tablets; sublingual tablets

**Priority drug monitoring — NCLEX expects you to know:**
- Digoxin: check apical pulse (hold if <60); check potassium (hypokalemia → toxicity)
- Lithium: therapeutic level 0.6–1.2 mEq/L; toxicity >1.5 mEq/L; avoid sodium restriction
- Warfarin: INR therapeutic 2.0–3.0; antidote = vitamin K; reverse = FFP
- Heparin: therapeutic aPTT 60–100 sec; antidote = protamine sulfate; HIT at days 5–14
- Potassium (IV): NEVER bolus; always diluted; max rate 10–20 mEq/hr via central line
- Insulin: check glucose before; rapid-acting with meal; regular only in IV bags

**Lab value quick reference:**
- Na: 135–145 | K: 3.5–5.0 | Glucose: 70–110 | Ca: 8.5–10.5 | Mg: 1.8–2.5
- BUN: 7–25 | Creatinine: 0.5–1.2 | Hgb: M>13.5; F>12 | Plt: 150,000–400,000
- INR: 0.9–1.1 (normal); 2–3 (therapeutic anticoagulation)"""),

s("clinical_pearls","clinical_pearls","Clinical Judgment Pearls","""**Prioritization decision tree:**
1. Is anyone dying? → That patient first (acute respiratory distress > stable chronic condition)
2. Is there a safety risk? → Address immediately (fall, medication error, abuse)
3. Is there acute pain or distress? → Address promptly
4. Is there psychosocial need? → Address after physiological

**Communication — always correct on NCLEX:**
- Acknowledge feelings: "I can see you are concerned..." (always correct first step before explanation)
- Open-ended questions: "Tell me more about..." vs. "Are you in pain?" (closed)
- Avoid: "Don't worry," "Everything will be fine" (false reassurance — always wrong)
- Defer diagnosis: "Your doctor will discuss the results with you"

**Assessment before action:**
- When in doubt: assess/gather data before implementing (exception: true emergency = act first)
- Assessment findings guide interventions — NCLEX often rewards "gather more information" over premature action

**Delegation to UAP (NCLEX rules):**
- UAP CAN: vital signs on stable patients, bathing/grooming, feeding (not assessment), ambulation, intake/output recording
- UAP CANNOT: assessment, teaching, IV medications, care planning, interpretation of findings"""),

s("client_education","client_education","Test Preparation Strategy","""**3 months before the exam:**
- Content review: use NCLEX review books; prioritize high-yield systems (cardiovascular, respiratory, pharmacology)
- Question banks: 50–75 questions daily; review ALL rationales (correct and incorrect)
- Focus on understanding WHY, not memorizing facts

**1 month before:**
- Practice NCLEX-style questions exclusively (full 75-question timed sessions)
- Review weak areas identified by question bank analytics
- Focus on NGN item types if recently graduated

**Exam day:**
- Get adequate sleep the night before
- Arrive early; bring required ID
- Read each question fully before reading options
- Trust your preparation — go with your best clinical judgment"""),

s("case_study","case_study","Case Application — NGN Bow-Tie",f"""**Scenario (NGN Format):** A 68-year-old patient admitted with decompensated heart failure is now reporting sudden dyspnea at rest, O₂ sat 84%, RR 32, HR 128, BP 96/60. Fine crackles audible bilateral bases extending to mid-lung fields. Patient is using accessory muscles. Troponin elevated.

**Clinical Judgment Application (CJMM):**

**Step 1 — Recognize Cues:**
Relevant: O₂ 84%, RR 32, HR 128, hypotension, bilateral crackles, accessory muscle use, troponin elevation
Non-relevant (distractors): admission diagnosis (already known)

**Step 2 — Analyze Cues:**
- 84% SpO₂ = severe hypoxemia
- Bilateral crackles + HF + dyspnea = acute pulmonary edema
- Troponin + HF + low BP = possible acute MI triggering decompensation

**Step 3 — Prioritize Hypotheses:**
Primary: Acute pulmonary edema with cardiogenic shock (most life-threatening)
Secondary: Possible ACS precipitating decompensation

**Step 4 — Generate Solutions:**
- High-flow O₂ or BiPAP
- IV diuretic (furosemide)
- Position: high Fowler's
- Notify provider STAT / activate rapid response
- IV access, labs, 12-lead ECG, telemetry

**Step 5 — Take Action (priority order):**
1. High Fowler's position → improves lung mechanics
2. Apply O₂ (NRB or BiPAP) → correct hypoxemia
3. Call rapid response / notify provider
4. IV access + draw labs + 12-lead ECG
5. Anticipate IV furosemide, vasopressors

**Step 6 — Evaluate:**
- SpO₂ trending toward 92%+
- RR decreasing
- Patient less distressed and able to speak""")
],
"preTest":[
pt("Using Maslow's hierarchy, which patient should be seen first by the nurse?",["A patient with anxiety asking about their discharge plans","A patient reporting pain of 5/10 after receiving their last analgesic 2 hours ago","A post-operative patient whose O₂ saturation dropped from 96% to 88% in the last 15 minutes","A patient with chronic depression asking to speak with the counselor"],2,"Oxygen saturation dropping from 96% to 88% in 15 minutes represents an acute physiological deterioration requiring immediate assessment — this falls at the base of Maslow's hierarchy (physiological needs: breathing). Anxiety, moderate pain, and depression are important but are not acute physiological emergencies. The acutely deteriorating patient is always addressed first."),
pt("A nurse is preparing to delegate tasks to an unlicensed assistive person (UAP). Which task is appropriate to delegate?",["Assessing a post-operative patient's wound drainage","Teaching a patient how to use their incentive spirometer","Obtaining routine vital signs on a stable patient admitted for IV antibiotics","Interpreting a patient's pain response after receiving morphine"]
,2,"UAPs can obtain vital signs on stable patients — this falls within their training and scope. Assessment (wound drainage), patient education (incentive spirometry), and interpreting pain responses all require nursing judgment and are the RN's responsibility. Delegation must match the task to the delegate's scope and training."),
pt("Which question format requires the nurse to select ALL correct responses from among multiple options, with no partial credit?",["Matrix/grid question","Enhanced multiple choice","Select All That Apply (SATA)","Bow-tie question"],2,"Select All That Apply (SATA) questions require selecting all correct answers and no incorrect answers. There is no partial credit — the entire question is scored correct or incorrect. This format requires comprehensive knowledge because even one incorrect selection makes the whole response wrong."),
pt("A patient says 'I'm so worried about my test results.' The nurse's best initial response is:",["'I'm sure the results will come back fine — try not to worry.'","'Your doctor will share the results as soon as they are available.'","'I can see you're anxious about this. Can you tell me more about your concerns?'","'Let me distract you — would you like to watch some television?'"]
,2,"The therapeutic initial response acknowledges the patient's feeling and opens the door for further communication. Open-ended exploration ('Tell me more') is the correct first step. False reassurance ('I'm sure it will be fine') and deflection (TV) close communication. While informing the patient that the doctor will share results is accurate, it doesn't address the emotional need first expressed."),
pt("A nurse uses the NCLEX clinical judgment model to care for a patient. After implementing interventions for hypoglycemia, the next step in the model is:",["Recognize additional cues in the patient's assessment","Prioritize new hypotheses about the patient's condition","Evaluate outcomes — assess whether the blood glucose has responded and symptoms have resolved","Generate new solutions for follow-up care"],2,"The six-step NCLEX Clinical Judgment Measurement Model concludes with 'Evaluate Outcomes' — assessing whether the implemented actions achieved the desired effect. After treating hypoglycemia, the nurse evaluates: has blood glucose returned to normal range? Have symptoms resolved? This completes the clinical judgment cycle for that iteration.")
]
}

RPN_LESSONS = [
{
"slug":"ca-rpn-musculoskeletal-fractures",
"title":"Fractures & Musculoskeletal Care — REx-PN Canada",
"topic":"Musculoskeletal","topicSlug":"fractures-msk","bodySystem":"Musculoskeletal",
"previewSectionCount":2,
"seoTitle":"Fractures Musculoskeletal REx-PN Canada — neurovascular checks, cast care, osteoporosis",
"seoDescription":"REx-PN musculoskeletal: fractures, 5 P's neurovascular assessment, cast care, compartment syndrome, osteoporosis, hip fracture in elderly Canadians, and PN nursing priorities.",
"sections":[
s("introduction","introduction","Overview","""Musculoskeletal conditions — fractures, osteoporosis, arthritis, and post-surgical orthopedic care — are prevalent in Canadian healthcare settings including long-term care, community, and acute care. REx-PN tests the PN's ability to perform neurovascular assessments, manage cast and traction care, and recognize orthopedic emergencies such as compartment syndrome.

**Hip fractures in Canada:** Canada has among the highest hip fracture rates in the world due to its aging population. Hip fractures in older adults have a 1-year mortality of 20–30%, making prevention (fall prevention, osteoporosis management) and post-surgical care critical PN competencies. Most hip fractures in Canada are managed with surgical repair within 24–48 hours (provincial wait-time targets)."""),

s("pathophysiology_overview","pathophysiology_overview","Key Concepts","""**Neurovascular assessment — 5 P's (every 1–2 hours post-fracture or casting):**
1. Pain — character, severity, response to analgesia; severe unrelieved pain = compartment syndrome
2. Pulses — distal to injury; compare bilateral; absent pulse = vascular emergency
3. Pallor — skin color distal to cast/injury; cyanosis or pallor = vascular compromise
4. Paresthesias — numbness/tingling = earliest neurological compromise (earlier than pallor/pulselessness)
5. Paralysis — movement distal to injury; inability = severe neurovascular compromise

**Compartment syndrome:**
- Pressure within fascial compartment compresses nerves and vessels → ischemia
- Early signs: pain out of proportion + paresthesias (numbness/tingling)
- NEVER wait for pulselessness (irreversible damage by then)
- Emergency: fasciotomy (surgical release); remove cast immediately; do NOT elevate

**Osteoporosis (Canadian context):**
- Fragility fractures most common at: wrist (Colles' fracture), vertebrae (compression), hip
- FRAX score: Canadian fracture risk assessment tool; BMD + clinical risk factors
- Treatment: calcium 1000–1200 mg/day + vitamin D 800–2000 IU/day + bisphosphonate (alendronate PO weekly, zoledronic acid IV annually)
- Bisphosphonate administration: alendronate on empty stomach with 240 mL water; remain upright 30 minutes"""),

s("signs_symptoms","signs_symptoms","Clinical Assessment","""**Acute fracture:**
- Deformity, swelling, bruising, point tenderness, crepitus, abnormal movement
- Open fracture: bone visible through skin, or wound communicating with fracture site → high infection risk

**Cast complications requiring immediate attention:**
- Increasing pain unresponsive to analgesia → compartment syndrome
- Numbness, tingling in distal extremity → nerve compression
- Pale, cold, pulseless distal extremity → arterial compromise
- Hot spots on cast, foul odor → infection beneath cast
- Tightening cast as swelling increases → PN documents and notifies immediately

**Hip fracture in elderly:**
- External rotation + shortening of affected leg (classic sign)
- Severe hip/groin pain; inability to bear weight
- Cognitive decline (delirium) may be first sign in elderly with cognitive impairment
- Fall risk: extremely high post-operatively

**Fat embolism (24–72 hours post-long-bone fracture):**
- Petechial rash (axilla, chest, conjunctivae) + hypoxemia + confusion
- Treatment: supportive O₂; prevention = early immobilization"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Acute fracture care:**
- Immobilize in position found — do NOT attempt reduction
- Open fracture: sterile wet saline dressing; tetanus status; IV antibiotics urgently
- Neurovascular checks every 1–2 hours; document findings

**Cast care:**
- Fresh plaster: 24–72 hours to dry; handle with palms (not fingers)
- Fiberglass: sets in 30–60 min; usually water-resistant (confirm with provider)
- Elevate casted extremity to reduce swelling
- Teach: never insert objects under cast; report pain, numbness, colour changes
- Inspect edges for skin breakdown; petal edges with moleskin/tape

**Post-hip replacement (Canadian elderly):**
- Hip precautions (posterior approach): no flexion >90°, no internal rotation, no adduction
- Anticoagulation: enoxaparin or DOAC per order — DVT is the most common complication
- Mobilize with physiotherapy as early as post-op day 1 per surgical orders
- Delirium prevention: maintain orientation, familiar objects, minimal sedatives, early mobility

**DVT prophylaxis (mandatory post-hip/knee surgery in Canada):**
- Enoxaparin (Lovenox) SQ per weight-based protocol
- Rivaroxaban (Xarelto) or apixaban (Eliquis) per order
- SCDs while immobile + ambulation when safe"""),

s("pharmacology","pharmacology","Pharmacology","""**Analgesics:**
- Acetaminophen: first-line; max 4g/day (3g in elderly, hepatic impairment)
- NSAIDs: ibuprofen, ketorolac — anti-inflammatory; avoid in elderly, renal failure, GI history
- Opioids: for moderate-severe fracture pain; constipation prophylaxis mandatory in elderly

**Osteoporosis pharmacotherapy:**
- Alendronate (Fosamax): weekly PO; empty stomach + 240 mL water + upright 30 min (esophageal irritation)
- Zoledronic acid (Reclast): annual IV infusion; flu-like reaction 24–48 hours post-infusion; pre-medicate with acetaminophen
- Denosumab (Prolia): SQ every 6 months; do NOT miss doses (rebound bone loss); monitor calcium
- Calcium + Vitamin D: essential co-supplementation

**Muscle relaxants (Canadian PN precautions):**
- Cyclobenzaprine, methocarbamol: sedating; HIGH fall risk in elderly
- Baclofen (spasticity): abrupt discontinuation → withdrawal seizures; NEVER stop abruptly"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Paresthesias = earliest sign of compartment syndrome** — act before pulselessness appears
- **Hip fracture in elderly = delirium can be first sign** — cognitive change in an elderly patient post-fall warrants immediate assessment
- **Alendronate: 30-minute upright rule** — sitting or lying after taking causes severe esophageal ulceration
- **Canadian context: 24–48 hour surgical target for hip fractures** — prolonged pre-operative wait increases delirium, DVT, and mortality risk; advocate for timely surgery
- **Never apply ice directly to skin** — wrap in cloth; maximum 20 min on/off to prevent frostbite on already-compromised tissue
- **FRAX score guides osteoporosis treatment** — Canadian fracture risk assessment tool incorporating BMD and clinical risk factors"""),

s("client_education","client_education","Patient Education","""**Osteoporosis prevention:**
- Weight-bearing exercise (walking, dancing, stair climbing) strengthens bone
- Calcium: 3 servings of dairy or fortified foods daily
- Vitamin D: supplement — difficult to get enough from food and Canadian sunlight
- Avoid smoking and limit alcohol (both decrease bone density)
- Home fall prevention: remove throw rugs, improve lighting, grab bars in bathroom

**Cast care at home:**
- Keep plaster cast dry; use plastic bag for showering
- Never put anything under the cast to scratch — causes wounds that become infected
- Call your provider immediately: numbness, tingling, fingers/toes turning blue or cold, pain not responding to medication, cast feels too tight"""),

s("case_study","case_study","Case Application","""**Scenario:** An 82-year-old woman admitted to a Canadian acute care hospital 6 hours after a fall. X-ray confirms right femoral neck fracture (hip fracture). She is alert but confused (delirium superimposed on mild dementia). She is on warfarin for atrial fibrillation.

**RPN priorities:**
1. Neurovascular checks right lower extremity every 2 hours: 5 P's
2. Pain management: acetaminophen + low-dose opioid per order; avoid NSAIDs (renal risk, drug interactions)
3. Warfarin management: notify provider; INR must be corrected pre-operatively (target <1.5 for surgery); vitamin K and/or FFP may be ordered
4. Delirium prevention: reorientation, familiar objects, maintain hearing aids/glasses, limit sedatives, early mobility post-surgery
5. DVT prophylaxis: mechanical (SCDs) while on warfarin pre-op; pharmacological post-op per protocol
6. Pressure injury prevention: reposition every 2 hours; heel float (pillow under calf)
7. Advocate for timely surgical referral (24–48 hour provincial target reduces complications)""")
],
"preTest":[
pt("A patient 2 hours post-casting reports severe pain in the casted arm that is not relieved by the prescribed analgesic, along with tingling in the fingers. The RPN's priority action is:",["Administer a stronger opioid analgesic and reassess in 1 hour","Notify the provider immediately — these findings suggest compartment syndrome","Elevate the limb above heart level to reduce swelling","Apply ice packs around the cast to reduce inflammation"],1,"Unrelieved pain plus paresthesias (tingling) are the earliest and most critical signs of compartment syndrome. This is an orthopedic emergency requiring immediate provider notification. Elevating the limb would reduce perfusion pressure and worsen ischemia. Additional analgesia delays recognition of a serious complication."),
pt("An elderly patient with a new hip fracture becomes confused and agitated despite appearing oriented at admission 2 hours ago. The RPN's priority interpretation is:",["Confusion is expected in elderly patients and does not require immediate action","This acute change in mental status may indicate delirium — assess and notify the provider","The patient likely has dementia that was not identified at admission","Increase pain medication — the confusion is most likely pain-related"],1,"Acute-onset confusion in an elderly patient, especially following a fall, injury, or hospitalization, represents delirium — a medical emergency with many possible causes (pain, medication, infection, hypoxia, hypovolemia). The RPN must conduct a full assessment and notify the provider. Dismissing the finding as expected is dangerous."),
pt("A patient is prescribed alendronate (Fosamax) weekly for osteoporosis. Which teaching is most important?",["Take alendronate with a glass of milk to reduce stomach upset","Take alendronate on an empty stomach with 240 mL of water and remain upright for 30 minutes","Alendronate should be taken at bedtime to prevent falls from dizziness","Split the weekly dose into daily doses for better absorption"],1,"Alendronate must be taken on an empty stomach with a full glass (240 mL) of water. The patient must remain upright (sitting or standing) for at least 30 minutes after taking it. Failure to remain upright can cause severe esophagitis, esophageal ulcers, and even perforation. Food and other beverages (including milk) significantly reduce absorption."),
pt("Which post-operative hip replacement precaution is most important to teach a patient who had a posterior surgical approach?",["Avoid hip flexion greater than 90 degrees","Keep the affected leg in internal rotation when resting","Cross the ankles when sitting to support the joint","Sleep on the operative side to reduce swelling"],0,"After posterior-approach total hip replacement, hip flexion greater than 90 degrees can dislocate the prosthesis. Patients must avoid bending the hip beyond a right angle, crossing legs (adduction), and internal rotation. Raised toilet seats, armchairs, and abduction pillows support these restrictions."),
pt("After applying a plaster cast to a patient's lower arm, the nurse plans to check neurovascular status in 2 hours. The earliest sign of neurovascular compromise that should prompt immediate action is:",["Pulselessness in the radial artery","Pallor and coolness of the fingertips","Numbness and tingling in the fingers","Inability to move the fingers"]
,2,"Paresthesias (numbness and tingling) are the earliest neurological indicator of neurovascular compromise in a casted extremity. Pulselessness and paralysis are late signs indicating advanced, potentially irreversible damage. Early recognition of paresthesias allows immediate intervention before permanent tissue damage occurs.")
]
},

{
"slug":"ca-rpn-anemia-hematology",
"title":"Anemia & Blood Disorders — REx-PN Canada",
"topic":"Hematology & Oncology","topicSlug":"anemia-hematology","bodySystem":"Hematology & Oncology",
"previewSectionCount":2,
"seoTitle":"Anemia Blood Disorders REx-PN Canada — iron deficiency, B12, transfusion, PN priorities",
"seoDescription":"REx-PN anemia: iron-deficiency vs B12 deficiency, sickle cell in Canadian context, blood transfusion safety, TIBC, ferritin, and RPN nursing priorities in Canadian healthcare.",
"sections":[
s("introduction","introduction","Overview","""Anemia is one of the most common medical conditions managed by RPNs in Canadian healthcare settings. The RPN provides direct care for patients with iron-deficiency anemia, vitamin B12 deficiency, hemolytic anemias, and patients receiving blood transfusions. Recognizing transfusion reactions and distinguishing anemia types are core REx-PN competencies.

**Canadian context:** Iron-deficiency anemia disproportionately affects women of reproductive age and certain immigrant populations (including refugees from regions with dietary iron deficiency). Pernicious anemia is more common in individuals of Northern European descent. Sickle cell disease is prevalent among Canadians of African, Caribbean, and Middle Eastern heritage — Canadian provinces have added SCD to newborn screening programs."""),

s("pathophysiology_overview","pathophysiology_overview","Anemia Types & Lab Differentiation","""**Iron-Deficiency Anemia:**
- Cause: chronic blood loss (menorrhagia, GI bleed), inadequate dietary iron, malabsorption
- RBCs: microcytic (MCV <80), hypochromic
- Key labs: low ferritin (earliest), low serum iron, HIGH TIBC, low Hgb
- Signs: fatigue, pallor, pica, koilonychia, angular cheilitis

**B12 Deficiency (Pernicious Anemia):**
- Cause: autoimmune destruction of parietal cells → no intrinsic factor → B12 malabsorption
- RBCs: macrocytic (MCV >100), megaloblastic
- Key labs: low serum B12; elevated MMA and homocysteine
- Unique: neurological symptoms (numbness, tingling, ataxia, cognitive changes) — do NOT reverse if untreated long-term
- Treatment: IM cyanocobalamin (oral B12 cannot be absorbed without intrinsic factor)

**Folate Deficiency:**
- Cause: alcoholism, pregnancy, methotrexate, poor diet
- Macrocytic — but NO neurological symptoms (unlike B12)

**TIBC as a differentiator:**
- Iron deficiency: TIBC HIGH (body produces more transferrin to bind scarce iron)
- Anemia of chronic disease: TIBC LOW (inflammatory state suppresses transferrin)

**Blood transfusion in Canada:**
- Blood supply managed by Canadian Blood Services (CBS) / Héma-Québec in Québec
- Type and screen protocol: ABO + Rh typing + antibody screening before transfusion
- Informed consent required before transfusion"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Blood transfusion safety protocol (Canadian nursing standards):**
1. Informed consent documented
2. Type and screen within 3 days
3. Two-nurse verification at bedside: patient ID × 2 identifiers (name + date of birth), blood product unit number, blood type on tag vs. patient wristband, expiry date
4. IV: 18G or larger for blood (smaller = haemolysis risk)
5. Y-tubing with normal saline ONLY (no dextrose — lyses RBCs; no LR — causes clotting)
6. Baseline vital signs before starting
7. Infuse slowly for first 15 minutes; remain at bedside; vital signs at 15 minutes
8. Each unit over 2–4 hours; complete within 4 hours (infection risk)
9. Vital signs each hour and after completion

**Transfusion reactions:**
- Febrile non-hemolytic: fever, chills within 1–2 hours → stop → acetaminophen → resume if mild after assessment
- Acute hemolytic (most dangerous): fever, chills, back/flank pain, dark urine → STOP immediately → NS → provider → samples
- Allergic: urticaria, itching → diphenhydramine → may resume if mild; if bronchospasm → STOP → epinephrine
- TACO (circulatory overload): dyspnea, crackles, HTN → slow or stop → diuretics"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **High TIBC = iron deficiency; Low TIBC = chronic disease** — this is the key lab differentiator
- **Pernicious anemia: IM injections for life** — without intrinsic factor, oral B12 cannot be absorbed regardless of dose
- **B12 correction: treat neurological symptoms urgently** — delayed treatment → permanent nerve damage
- **STOP transfusion for any suspected hemolytic reaction** — this is always the immediate priority
- **NS only with blood** — dextrose lyses RBCs; LR causes calcium-mediated clotting
- **Two-nurse verification is non-negotiable** — Canadian blood transfusion standards require independent double-check at bedside
- **Never treat folate deficiency without ruling out B12 deficiency** — folate supplementation in B12 deficiency can mask hematological response while neurological damage progresses"""),

s("client_education","client_education","Patient Education","""**Iron-deficiency anemia:**
- Ferrous sulfate: empty stomach with orange juice for best absorption; expect black stools (normal)
- Iron-rich foods: red meat, leafy greens, beans, fortified cereals
- Separate iron from antacids, calcium, dairy by 2 hours

**Pernicious anemia:**
- B12 injections are needed for life — your stomach cannot absorb B12 from food or pills
- Improvement in fatigue: weeks; neurological improvement: months; report any progression of numbness/tingling

**Blood transfusion (before and during):**
- Tell your nurse immediately if you feel chills, back pain, shortness of breath, or unusual warmth during the transfusion
- The procedure takes about 2–4 hours per unit"""),

s("case_study","case_study","Case Application","""**Scenario:** A 35-year-old woman receiving a packed red blood cell transfusion reports sudden chills, severe lower back pain, and dark urine 20 minutes after the infusion began.

**RPN analysis:** Classic acute hemolytic transfusion reaction — the most dangerous type, caused by ABO incompatibility.

**Immediate actions:**
1. STOP the transfusion immediately — clamp the IV tubing at the patient end
2. Keep IV patent with normal saline — run NS through new tubing at a KVO rate (do not disconnect the IV)
3. Notify the provider and charge nurse STAT
4. Keep blood bag and tubing — send both to blood bank for repeat cross-matching
5. Collect blood cultures and urine specimen
6. Monitor vital signs every 15 minutes; assess urine output (hemoglobinuria causes AKI)
7. Document: time symptoms began, symptoms, time transfusion stopped, interventions, provider notification

**What NOT to do:** Remove the IV, discard the blood bag, give antihistamines (not the correct treatment for hemolytic reaction)""")
],
"preTest":[
pt("A patient receiving a blood transfusion develops severe back pain, chills, and dark-colored urine 25 minutes after the infusion started. The RPN's immediate action is:",["Slow the transfusion rate and monitor closely for the next hour","Stop the transfusion and maintain IV access with normal saline; notify the provider immediately","Administer diphenhydramine and reassess the patient in 30 minutes","Increase the IV rate to flush the incompatible blood through the system faster"],1,"Back/flank pain, chills, and hemoglobinuria (dark urine) are classic signs of an acute hemolytic transfusion reaction — a life-threatening emergency caused by ABO incompatibility. The transfusion must be stopped immediately. IV access is maintained with new tubing and normal saline. All other actions (slowing, antihistamines, increasing rate) are dangerous."),
pt("Which laboratory result best indicates iron-deficiency anemia rather than anemia of chronic disease?",["Elevated TIBC with low ferritin","Low serum iron with normal TIBC","Low hemoglobin with elevated C-reactive protein","Elevated MCV with low B12 level"],0,"Elevated TIBC (body upregulates transferrin production when iron is scarce) combined with very low ferritin (iron stores depleted) is the hallmark of iron-deficiency anemia. In anemia of chronic disease, TIBC is LOW (inflammatory cytokines suppress transferrin synthesis) and ferritin is normal or elevated. This combination distinguishes the two most common anemias."),
pt("A patient with pernicious anemia asks why they must receive B12 injections rather than oral supplements. The RPN's best explanation is:",["Injections work more quickly than oral B12 in all forms of B12 deficiency","Your stomach doesn't produce the protein (intrinsic factor) needed to absorb B12 from food or pills","Oral B12 causes serious side effects in patients with pernicious anemia","Your B12 deficiency is too severe for oral therapy to be effective"],1,"Pernicious anemia results from autoimmune destruction of gastric parietal cells that produce intrinsic factor. Without intrinsic factor, vitamin B12 cannot be absorbed from the GI tract regardless of the oral dose. Intramuscular injection delivers B12 directly into circulation, bypassing the non-functional absorption pathway. This is a lifelong requirement."),
pt("When verifying a blood transfusion with a second nurse in Canada, which identifiers must match?",["Patient room number and blood type","Patient name, date of birth, unit number on blood product, and ABO/Rh type","Patient name and physician's order","Blood type on label and patient's stated blood type"],1,"Canadian blood transfusion safety standards require two-nurse independent verification at the bedside: patient name, date of birth (two patient identifiers), the unit number on the blood product label, ABO and Rh blood type on the label vs. the patient's wristband, and expiry date. Room number is not an acceptable patient identifier. Patient's stated blood type is not verified — wristband is used."),
pt("Iron supplementation is ordered for a patient with iron-deficiency anemia. The patient takes omeprazole (Prilosec) for acid reflux. Which teaching is most important?",["Take the iron with omeprazole at the same time to simplify medication administration","Iron and omeprazole (a proton pump inhibitor) should be separated by at least 2 hours to prevent reduced iron absorption","Avoid taking iron at all since PPIs prevent its absorption entirely","Iron should be taken with milk to reduce gastric irritation from omeprazole"]
,1,"Proton pump inhibitors (PPIs) reduce gastric acid, which is necessary to convert ferric (Fe³⁺) to ferrous (Fe²⁺) iron for absorption. Taking iron with a PPI significantly reduces absorption. The medications should be separated by at least 2 hours. Taking with milk would further reduce absorption (calcium competes with iron). Iron and acid-suppressing medications should never be co-administered.")
]
},

{
"slug":"ca-rpn-therapeutic-nutrition",
"title":"Therapeutic Nutrition — REx-PN Canada",
"topic":"Nutrition","topicSlug":"therapeutic-nutrition-rpn","bodySystem":"Multisystem",
"previewSectionCount":2,
"seoTitle":"Therapeutic Nutrition REx-PN Canada — renal diet, cardiac diet, dysphagia, cultural food",
"seoDescription":"REx-PN therapeutic nutrition: Canadian dietary guidelines, renal diet restrictions, sodium-reduced diet for heart failure, dysphagia textures, cultural food considerations, and RPN priorities.",
"sections":[
s("introduction","introduction","Overview","""Therapeutic nutrition is foundational nursing care affecting outcomes across all diagnoses. Canadian RPNs manage patients with therapeutic dietary modifications in acute care, long-term care, and community settings. Key NCLEX-PN/REx-PN content: dietary restrictions for common conditions, dysphagia safety, food-drug interactions, and cultural food competence — an area specifically emphasized in Canadian nursing education.

**Canada's Food Guide (2019):**
- Emphasis on plant-based foods, whole grains, vegetables and fruits
- Reduced reliance on dairy as a primary calcium source (replaced by fortified plant beverages)
- De-emphasized red/processed meat
- Culturally diverse food choices explicitly included
- RPN applies these guidelines while respecting patient cultural food preferences"""),

s("pathophysiology_overview","pathophysiology_overview","Therapeutic Diet Types","""**Sodium-restricted diet (heart failure, hypertension):**
- 2,000 mg/day for heart failure; 2,400 mg/day for hypertension
- Avoid: canned soups, processed/deli meats, fast food, soy sauce, pickled foods
- Hidden sodium: bread (up to 400 mg/slice), frozen meals, restaurant food
- Daily weight monitoring: gain >2 lbs (1 kg) in 1 day or >5 lbs in 1 week → call provider

**Renal diet (CKD — Canadian nephrology guidelines):**
- Potassium restriction (if hyperkalemia >5.5 mEq/L): limit bananas, oranges, tomatoes, potatoes, avocados
- Phosphorus restriction: limit dairy, dark cola, nuts, beans, processed foods; take phosphate binders WITH meals
- Fluid restriction: per nephrology order; typically 1–1.5 L/day in advanced CKD or dialysis
- Protein: 0.6–0.8 g/kg/day pre-dialysis; increase to 1.2 g/kg/day on dialysis

**Diabetic diet (Diabetes Canada 2023):**
- Consistent carbohydrate distribution (3 meals + 2–3 snacks)
- 45–60g carbohydrates per meal
- Low glycemic index foods preferred; avoid sugary beverages
- Weight management central to Type 2 management

**Dysphagia (IDDSI framework — used across Canada):**
- Level 4 Pureed: smooth, homogenous, no lumps
- Level 5 Minced and moist: ≤4mm pieces
- Level 6 Soft and bite-size: fork-mashed pieces
- Thickened liquids: nectar-thick (IDDSI Level 2) or honey-thick (IDDSI Level 3)
- Aspiration prevention: 90° upright position; 30 min after meals; small bites; no talking while eating"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Nutritional assessment:**
- Weight on admission; compare to usual weight
- Appetite assessment; food preferences and cultural restrictions
- Dysphagia screening (e.g., TOR-BSST, bedside water swallow test)
- Dentition and denture status (affects ability to chew)
- Socioeconomic factors: food security, access to healthy food (SDOH)

**Meal assistance:**
- Position: chair or high Fowler's (90°) for ALL patients during meals
- Allow sufficient time; avoid rushing
- Offer preferred foods within dietary restrictions
- Document percentage consumed (25%, 50%, 75%, 100%)
- Notify dietitian if <50% intake over 2+ days

**Cultural food competence (Canadian nursing standard):**
- Ask about cultural or religious dietary restrictions on admission
- Collaborate with dietary services for culturally appropriate substitutions
- Examples: halal/kosher requirements, vegetarian/vegan preferences, traditional Indigenous foods
- Never assume dietary preferences based on appearance or cultural background
- Document and communicate restrictions across care team

**Nasogastric tube feeding (overview):**
- HOB 30–45° during feeding and 30 min after bolus
- Check GRV every 4 hours
- Flush 30 mL water q4h and before/after medications
- Verify placement: external length + pH before each use"""),

s("pharmacology","pharmacology","Food-Drug Interactions","""**Critical Canadian RPN food-drug interactions:**

| Drug | Interaction | Teaching |
|---|---|---|
| Warfarin | Vitamin K (leafy greens) alters INR | Consistent intake, not elimination |
| Levothyroxine | Calcium, iron, soy reduce absorption | Take 30–60 min before breakfast; separate from supplements |
| Ciprofloxacin | Calcium/dairy reduces absorption | Take 2 hours before or after dairy |
| Metformin | GI side effects; take WITH food | Always take with meals |
| Statins (many) | Grapefruit inhibits CYP3A4 | Avoid grapefruit entirely |
| ACE inhibitors | High-potassium foods + K supplements → hyperkalemia | Monitor potassium; limit K supplementation |
| Lithium | Sodium restriction → lithium toxicity | Maintain consistent sodium intake |
| MAOIs | Tyramine (aged cheese, cured meats, red wine) → hypertensive crisis | Eliminate all tyramine-rich foods |

**Phosphate binders (renal diet):**
- Calcium carbonate (Tums), sevelamer, lanthanum
- Must be taken WITH meals and snacks (not before or after)
- Bind dietary phosphorus in GI tract; prevent absorption
- Missed meal = no binder needed for that meal"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Dysphagia: wet/gurgling voice after swallowing = aspiration** — stop oral intake, notify provider and SLP
- **Phosphate binders WITH meals** — taking at other times is ineffective
- **Warfarin + leafy greens: consistent, not eliminated** — abrupt changes destabilize INR
- **Canadian Food Guide 2019 de-emphasizes dairy** — patients on renal diet can meet calcium needs through other calcium-fortified foods
- **IDDSI framework is the Canadian standard for dysphagia diet textures** — RPN documents correct IDDSI level, not informal terms like "chopped" or "pureed"
- **Food security is a SDOH in Canada** — assess ability to access prescribed dietary modifications; connect to community supports (food banks, Meals on Wheels, dietitian referral through provincial system)"""),

s("client_education","client_education","Patient Education","""**Heart failure sodium restriction:**
- Read labels: target <600 mg sodium per serving
- Cooking at home: use herbs, lemon juice, garlic for flavour instead of salt
- Avoid: canned soups, processed meats, restaurant meals, fast food
- Weigh yourself every morning; write it down; call your provider if you gain more than 1 kg in one day

**Renal diet (dialysis):**
- Limit potassium: avoid bananas, oranges, potatoes; leach vegetables by boiling in large amounts of water
- Limit phosphorus: avoid dairy, dark cola, processed foods
- Take your phosphate binders WITH every meal and snack — not before or after
- Track fluid carefully: include soup, ice cream, gelatin in your fluid total

**Dysphagia:**
- Always sit upright to eat; do not eat in bed unless propped at 90 degrees
- Eat slowly, small bites; swallow completely before the next bite
- Stay upright for at least 30 minutes after finishing"""),

s("case_study","case_study","Case Application","""**Scenario:** A 78-year-old South Asian woman admitted for heart failure exacerbation reports that her usual diet consists of lentil dhal, rice, and vegetables. She is prescribed a 2,000 mg sodium restriction. She does not speak English and her daughter is interpreting. The patient is found eating a can of soup brought from home by family.

**RPN actions:**
1. Request certified interpreter (family member should not interpret for complex medical instructions)
2. Assess sodium content of the soup with family — most canned soups contain 600–900 mg sodium per serving
3. Educate (via interpreter) that canned soup is too high in sodium for her restriction
4. Collaborate with dietitian for culturally appropriate low-sodium South Asian meal options
5. Teach family and patient: dhal (lentils) prepared without salt is an excellent low-sodium option; fresh vegetables are appropriate; avoid pappadums (high salt), pickles (achaar), processed chutneys
6. Provide written instructions in Punjabi/Urdu if available through the hospital's cultural services
7. Document: dietary education provided, interpreter used, cultural foods discussed, dietitian referral placed""")
],
"preTest":[
pt("A patient on a 2,000 mg sodium-restricted diet for heart failure is found eating canned soup brought by family. The RPN's best action is:",["Allow the patient to finish the soup — one serving will not cause significant harm","Remove the soup, explain sodium restrictions, and collaborate with a dietitian and the family to identify culturally appropriate low-sodium alternatives","Document the dietary non-compliance and contact the physician","Restrict family visits since they are undermining the treatment plan"],1,"Education and collaboration are the correct approach. Removing the soup without explanation or involving a dietitian misses the opportunity to address the root cause (family not understanding restrictions). Restricting family visits is punitive and counterproductive. The RPN works with the patient, family, and dietitian to find culturally appropriate low-sodium alternatives."),
pt("A patient with CKD and hyperkalemia needs dietary education. Which food should the RPN advise the patient to limit most strictly?",["White rice","Sliced white bread","Bananas","Corn on the cob"],2,"Bananas are very high in potassium and must be restricted in CKD patients with hyperkalemia. Other high-potassium foods to avoid include oranges, tomatoes, potatoes, avocados, and dried fruits. White rice, white bread, and corn are relatively low in potassium and can be part of a renal diet."),
pt("A patient requires thickened liquids for dysphagia management. After swallowing thickened juice, the patient's voice sounds wet and gurgling. The RPN's priority action is:",["Continue feeding — gurgling voice with thickened liquids is a normal finding","Stop oral intake immediately and notify the provider and speech-language pathologist","Switch to a thinner liquid consistency to reduce the patient's effort","Encourage the patient to cough to clear their throat and continue feeding"],1,"A wet or gurgling voice quality immediately after swallowing indicates that fluid has entered the larynx or trachea (laryngeal penetration or aspiration). This occurs even with thickened liquids if the dysphagia is severe. All oral intake must be stopped immediately and the speech-language pathologist and provider must be notified for reassessment."),
pt("A patient taking levothyroxine asks when to take the medication. The most important teaching is:",["Take it at bedtime with a glass of milk for best absorption","Take it with breakfast and calcium supplements for convenience","Take it on an empty stomach 30–60 minutes before breakfast; separate from calcium and iron supplements by 4 hours","Take it with a full meal to prevent thyroid stimulation"]
,2,"Levothyroxine absorption is significantly reduced by food, calcium, iron, and soy. It must be taken on an empty stomach (30–60 minutes before breakfast) and separated from calcium and iron supplements by at least 4 hours. Consistent timing improves the stability of thyroid hormone levels."),
pt("When should a renal patient take their phosphate binders?",["30 minutes before each meal to allow activation in the stomach","At bedtime, when phosphorus absorption is highest","With each meal and snack containing phosphorus — not before or after","Once daily in the morning regardless of meal timing"],2,"Phosphate binders work by binding dietary phosphorus in the GI tract during digestion to prevent absorption. They must be taken with each meal and snack — not before (no food present to bind) and not after (phosphorus has already been absorbed). Missing a meal means no binder is needed for that meal.")
]
},

{
"slug":"ca-rpn-neurological-dementia-stroke",
"title":"Dementia & Post-Stroke Care — REx-PN Canada",
"topic":"Neurological","topicSlug":"dementia-stroke","bodySystem":"Neurological",
"previewSectionCount":2,
"seoTitle":"Dementia Stroke REx-PN Canada — FAST, dysphagia, wandering, behaviour management",
"seoDescription":"REx-PN dementia and post-stroke care: FAST acronym, stroke rehabilitation, aphasia communication, dementia stages, BPSD management, wandering prevention, and Canadian RPN priorities.",
"sections":[
s("introduction","introduction","Overview","""Dementia and stroke are among the most prevalent neurological conditions in Canada. With over 700,000 Canadians living with dementia and 50,000 new strokes annually, RPNs in all settings will care for these patients. The RPN must recognize acute stroke, support post-stroke rehabilitation, manage dementia behaviours safely, and provide person-centred care that preserves dignity.

**Canadian context:**
- Alzheimer's disease is the most common dementia (60–70%)
- Risk increases with age: 40% of Canadians >85 have dementia
- Vascular dementia is second most common; often follows stroke(s)
- Indigenous Peoples have higher rates of vascular dementia due to higher rates of vascular risk factors
- Wait times for cognitive specialist assessment vary significantly across Canadian provinces"""),

s("pathophysiology_overview","pathophysiology_overview","Stroke & Dementia Essentials","""**Stroke recognition — FAST acronym (Canadian Stroke Network):**
- F: Face drooping (asymmetrical; ask patient to smile)
- A: Arm weakness (ask patient to raise both arms; one drifts down)
- S: Speech difficulty (slurred, garbled, or inability to speak or understand)
- T: Time to call 911 (time of symptom onset is critical for tPA eligibility — 4.5 hour window)

**Stroke types:**
- Ischemic (87%): clot blocks cerebral artery → tPA within 4.5 hours of symptom onset if eligible; thrombectomy within 6–24 hours for large vessel occlusion
- Hemorrhagic (13%): blood vessel ruptures; tPA is CONTRAINDICATED; BP management; surgical options

**Post-stroke deficits by affected side:**
- Left hemisphere stroke: right-sided weakness/paralysis + aphasia (expressive, receptive, or global)
- Right hemisphere stroke: left-sided weakness/paralysis + neglect (unaware of left side), impulsivity, visual field deficits

**Dementia stages:**
- Mild: memory lapses, word-finding difficulty, IADLs affected; patient can still make most decisions
- Moderate: significant memory loss, repetitive behaviour, ADL assistance needed, wandering risk, BPSD common
- Severe: unable to recognize family, non-ambulatory, incontinent, fully dependent, dysphagia

**Behavioural and Psychological Symptoms of Dementia (BPSD):**
Agitation, aggression, wandering, sundowning (increased confusion/agitation in late afternoon/evening), delusions, hallucinations — affect up to 90% of patients with dementia"""),

s("signs_symptoms","signs_symptoms","Assessment Findings","""**Acute stroke — time-sensitive assessment:**
- Facial droop (ask to smile — is it symmetrical?)
- Arm drift (both arms raised; does one drift or fall within 10 seconds?)
- Speech: slurred, absent, word substitution (paraphasia)
- Vision changes: sudden visual field loss, double vision
- Severe sudden headache ("thunderclap") → subarachnoid haemorrhage
- Unilateral weakness/numbness
- Ataxia (sudden loss of coordination)

**CT scan required before any treatment:** Rules out hemorrhage before tPA is given.

**Post-stroke assessment:**
- Dysphagia screening before ANY oral intake (standardized bedside swallowing assessment)
- Neglect: does patient attend to both sides of the environment?
- Aphasia: expressive (speaks but wrong words) vs. receptive (cannot understand)
- Mood: post-stroke depression affects 30–50% within 3–6 months

**Dementia assessment:**
- Mini-Cog (2-step): 3-word recall + clock drawing (quick bedside tool)
- MMSE or MoCA (Montreal Cognitive Assessment — developed in Canada)
- Functional status: ADLs, IADLs
- Behavioural symptoms: frequency, trigger identification, impact on care"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Acute stroke care:**
1. Keep NPO until dysphagia screening completed by trained nurse or SLP
2. Monitor neurological status: level of consciousness, motor function, speech every 1–2 hours
3. If tPA administered: q15 min neuro checks × 2 hours, then q30 min × 6 hours, then q1h × 16 hours; NO blood draws, invasive procedures for 24 hours
4. Blood pressure management per order (permissive hypertension in ischemic stroke to maintain perfusion)
5. 12-lead ECG: identify AF (common cause of cardioembolic stroke)
6. Sequential compression devices for DVT prevention
7. Early physio, OT, SLP referral for rehabilitation

**Aphasia communication strategies:**
- Speak slowly and clearly; use simple sentences; allow extra time
- Yes/no questions if patient cannot speak
- Communication boards, picture cards
- Do NOT pretend to understand if you don't — ask for clarification
- Never talk about the patient as if they are not present

**Dementia person-centred care:**
- Use patient's preferred name; introduce yourself each interaction
- Maintain consistent routine: same times, same caregivers
- Simple, one-step instructions; allow extra processing time
- Validation therapy: acknowledge the emotion, not the accuracy of statements
- Do NOT correct delusions aggressively — redirect gently
- Environment: good lighting, reduced noise, clocks and calendars visible
- Wandering prevention: secured units, wander guards, alert bracelets

**Sundowning interventions:**
- Bright light therapy during the day
- Increase activity in morning/early afternoon
- Reduce stimulation and noise in late afternoon
- Establish a calming evening routine
- Avoid naps after 2 PM
- Maintain familiar environment"""),

s("pharmacology","pharmacology","Medications","""**tPA (alteplase) for ischemic stroke:**
- Eligibility: symptoms <4.5 hours onset; no hemorrhage on CT; no contraindications (recent surgery, bleeding history, INR >1.7, anticoagulation, BP >185/110)
- Monitor for: hemorrhagic transformation → sudden headache, neuro deterioration → STOP infusion, notify immediately
- Hold all other anticoagulants and antiplatelets for 24 hours after tPA

**Antiplatelets (stroke prevention):**
- Aspirin 81–325 mg daily: first-line for non-cardioembolic stroke secondary prevention
- Clopidogrel (Plavix): alternative or addition to aspirin (DAPT for 21 days for minor stroke)
- Warfarin or DOACs: for cardioembolic stroke secondary to AF

**Dementia medications:**
- Donepezil (Aricept), rivastigmine (Exelon), galantamine: acetylcholinesterase inhibitors; mild-moderate AD; slow progression (do not cure); side effects: GI (nausea, diarrhea), bradycardia
- Memantine (Ebixa): NMDA antagonist; moderate-severe AD; used alone or with cholinesterase inhibitor
- Antipsychotics for severe BPSD (risperidone, quetiapine): BLACK BOX WARNING — increased mortality in elderly with dementia; use only when non-pharmacological approaches fail and safety is at risk

**NEVER in dementia:**
- Benzodiazepines for routine agitation → paradoxical agitation, respiratory depression, falls, delirium
- First-generation antipsychotics (haloperidol) → high EPS, falls risk in elderly"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Stroke: NPO until dysphagia screening** — aspiration pneumonia is the most common early post-stroke complication; assess before ANY oral intake including medications
- **tPA = no hemorrhage on CT, onset <4.5 hours, no contraindications** — if CT shows any bleed, tPA is absolutely contraindicated
- **Right hemisphere stroke = LEFT neglect** — patient is unaware of their left side; safety risk; place items on right side where patient can see them
- **BPSD: non-pharmacological FIRST** — validation, redirection, routine, environment modification before any medication
- **Antipsychotics in elderly dementia = black box warning** — increased risk of stroke and death; reserved for severe BPSD with safety risk only
- **Montreal Cognitive Assessment (MoCA) was developed in Canada** — appropriate to mention Canadian origin in practice context
- **Sundowning prevention: bright light therapy + daytime activity** — evidence-based non-pharmacological approach"""),

s("client_education","client_education","Patient & Family Education","""**Stroke prevention (after TIA or minor stroke):**
- Take antiplatelet or anticoagulant medication as prescribed — never skip doses
- Control your blood pressure, blood sugar, and cholesterol
- Know stroke symptoms — FAST — and call 911 immediately if any occur, even briefly (TIA = stroke warning)
- Stop smoking; limit alcohol; exercise regularly

**Caring for a family member with dementia:**
- Establish a consistent daily routine — predictability reduces anxiety
- Redirect, don't argue — if your family member has a false belief, gently change the subject
- Remove safety hazards: lock dangerous items (knives, medications, cleaning products)
- Register with your local Alzheimer Society (Canadian resource) for caregiver support
- Respite care is available through provincial programs — you cannot provide good care if you are exhausted

**Communication with aphasia:**
- Speak slowly and use simple, short sentences
- Allow extra time — don't finish their sentences unless asked
- Use gestures, pictures, or writing as alternatives to speech"""),

s("case_study","case_study","Case Application","""**Scenario:** A 71-year-old man with moderate Alzheimer's dementia is admitted from long-term care after being found on the floor. He is agitated, repeatedly calling out for "Myrna" (his wife who died 10 years ago). He tries to get out of bed each time staff approach.

**RPN analysis:**
- Agitation + calling for deceased wife = common BPSD in dementia; wife may be from his intact long-term memory
- Exit-seeking behaviour = wandering/agitation risk
- Falls risk confirmed (found on floor)

**Person-centred RPN interventions:**
1. Approach calmly, from the front, at eye level; introduce yourself by name each time
2. Validation: "It sounds like you're missing Myrna" — acknowledge the emotion, not the reality
3. Redirect: "Let me show you something, can you help me with this?" (simple task or distraction)
4. Involve personal items from home (photos, favourite music, familiar objects — shown to reduce agitation)
5. Assess for pain (untreated pain is a common cause of agitation in dementia — use PACSLAC or Abbey Pain Scale for non-verbal patients)
6. Implement fall precautions: bed in lowest position, call bell, bed/exit alarm
7. Notify provider: document BPSD behaviour, frequency, interventions, response — non-pharmacological measures tried first
8. Do NOT use physical restraints as first response — least restraint principles apply in Canadian LTC""")
],
"preTest":[
pt("A patient presents with sudden onset of facial drooping on the right side, slurred speech, and right arm weakness. The nurse's priority action is:",["Perform a complete neurological assessment and document findings","Administer aspirin immediately to prevent clot propagation","Call 911 or activate the stroke response team immediately — note the time of symptom onset","Apply oxygen and reposition the patient for comfort while arranging transport"],2,"FAST criteria (Face, Arms, Speech, Time) indicate acute stroke. The priority is immediate activation of the stroke response and accurate documentation of symptom onset time. This determines tPA eligibility (4.5-hour window). Every minute counts — 'time is brain.' Assessment and treatment follow emergency activation."),
pt("A patient received IV tPA for ischemic stroke 30 minutes ago. The patient suddenly develops a severe headache and the nurse notices a decrease in level of consciousness. The priority action is:",["Increase the IV fluid rate to maintain cerebral perfusion","Stop the tPA infusion immediately and notify the provider — this may indicate hemorrhagic transformation","Continue the infusion — headache after tPA is expected","Administer prescribed analgesics for the headache and reassess"],1,"Sudden severe headache and declining level of consciousness after tPA administration are warning signs of hemorrhagic transformation — bleeding into the infarcted area. This is a life-threatening complication requiring immediate cessation of the tPA infusion and urgent provider notification. CT head is required. These symptoms are never expected or managed with analgesics alone."),
pt("A patient with moderate Alzheimer's dementia becomes increasingly agitated in the late afternoon and calls out for her deceased husband. The first nursing intervention should be:",["Administer a PRN antipsychotic medication to reduce agitation","Restrain the patient to prevent falls during the agitation episode","Approach the patient calmly, validate her feelings, and attempt to redirect her attention","Tell the patient that her husband has passed away and encourage her to accept this"],2,"Person-centred dementia care uses validation and redirection as first-line approaches. Acknowledging the patient's emotional state ('It sounds like you're missing your husband') and redirecting to a calm activity is the evidence-based first step. Antipsychotics are reserved for severe BPSD after non-pharmacological approaches fail. Restraints violate least-restraint principles. Repeatedly telling the patient of her husband's death causes distress without therapeutic benefit."),
pt("A post-stroke patient has left-sided neglect. Which nursing measure addresses this safety concern?",["Place the call bell, water, and personal items on the patient's left side","Ensure the patient's television and essential items are placed on the right side where they can be perceived","Encourage the patient to look left during all activities","Apply restraints to the right arm to prevent injury to the neglected side"],1,"Left-sided neglect means the patient is unaware of stimuli on their left side. Safety and communication are maintained by placing essential items on the functional (right) side where the patient can perceive and interact with them. Working to increase awareness of the left side is a physiotherapy goal, but immediate safety requires compensating for the neglect. Restraints are not appropriate."),
pt("A patient with dementia is prescribed donepezil (Aricept) 10 mg at bedtime. The most important adverse effect to monitor for is:",["Elevated blood pressure from cholinergic stimulation","Bradycardia — cholinesterase inhibitors increase acetylcholine and can slow heart rate","Hyperglycemia from altered glucose metabolism","Increased agitation and aggression in the first weeks of therapy"],1,"Donepezil and other cholinesterase inhibitors increase acetylcholine levels. Acetylcholine slows the sinoatrial node, potentially causing bradycardia. This is especially important in elderly patients who may have underlying conduction abnormalities. The nurse monitors heart rate and should notify the provider if bradycardia develops. GI side effects (nausea, diarrhea) are common but less dangerous.")
]
},
]

RN_LESSONS = [
    rn_chest_tube("us-rn-chest-tube-management", "US NCLEX-RN", "US"),
    rn_wound_drain("us-rn-wound-drainage-systems", "US NCLEX-RN"),
    rn_tpn("us-rn-total-parenteral-nutrition", "US NCLEX-RN"),
    rn_enteral("us-rn-enteral-nutrition-tube-feeding", "US NCLEX-RN"),
    rn_exam_strategy("us-rn-nclex-rn-exam-strategy-ngn", "US NCLEX-RN", "US"),
]

CA_RN_LESSONS = [
    rn_chest_tube("ca-rn-chest-tube-management", "Canadian NCLEX-RN", "CA"),
    rn_wound_drain("ca-rn-wound-drainage-systems", "Canadian NCLEX-RN"),
    rn_tpn("ca-rn-total-parenteral-nutrition", "Canadian NCLEX-RN"),
    rn_enteral("ca-rn-enteral-nutrition-tube-feeding", "Canadian NCLEX-RN"),
    rn_exam_strategy("ca-rn-nclex-rn-exam-strategy-canada", "Canadian NCLEX-RN", "Canadian"),
]

def load_catalog():
    with open(CATALOG, encoding="utf-8") as f:
        return json.load(f)

def save_catalog(data):
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def apply(catalog, pathway, lessons):
    existing = {l["slug"] for l in catalog["pathways"][pathway]["lessons"]}
    added = 0
    for lesson in lessons:
        if lesson["slug"] not in existing:
            catalog["pathways"][pathway]["lessons"].append(lesson)
            print(f"  ADD [{pathway}]: {lesson['slug']}")
            added += 1
        else:
            print(f"  SKIP [{pathway}]: {lesson['slug']}")
    return added

if __name__ == "__main__":
    cat = load_catalog()
    n1 = apply(cat, "ca-rpn-rex-pn", RPN_LESSONS)
    n2 = apply(cat, "us-rn-nclex-rn", RN_LESSONS)
    n3 = apply(cat, "ca-rn-nclex-rn", CA_RN_LESSONS)
    save_catalog(cat)
    print(f"\nREx-PN: +{n1} → {len(cat['pathways']['ca-rpn-rex-pn']['lessons'])}")
    print(f"NCLEX-RN US: +{n2} → {len(cat['pathways']['us-rn-nclex-rn']['lessons'])}")
    print(f"NCLEX-RN CA: +{n3} → {len(cat['pathways']['ca-rn-nclex-rn']['lessons'])}")
