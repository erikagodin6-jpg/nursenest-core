#!/usr/bin/env python3
"""NCLEX-PN: Musculoskeletal (3) + Nutrition (2) + Integumentary (2) = 7 lessons"""
import json, os
CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

def s(id_, kind, heading, body):
    return {"id": id_, "kind": kind, "heading": heading, "body": body}

def pt(question, options, correct, rationale):
    return {"question": question, "options": options, "correct": correct, "rationale": rationale}

LESSONS = [
{
"slug":"us-pn-musculoskeletal-fractures-ortho",
"title":"Fractures & Orthopedic Care — PN Scope",
"topic":"Musculoskeletal","topicSlug":"fractures-orthopedic","bodySystem":"Musculoskeletal",
"previewSectionCount":2,
"seoTitle":"Fractures Orthopedic Nursing NCLEX-PN — cast care, traction, neurovascular checks",
"seoDescription":"NCLEX-PN fractures: types, compartment syndrome, cast care, traction, fat embolism, neurovascular assessment, and post-op orthopedic nursing priorities.",
"sections":[
s("introduction","introduction","Overview","""Fractures and orthopedic conditions are common across all care settings. PNs care for patients with acute fractures, post-operative joint replacements, and chronic musculoskeletal conditions. Key PN competencies: neurovascular assessment (the 5 P's), recognition of compartment syndrome, cast and traction care, and post-operative hip/knee precautions.

**Fracture classification:**
- Complete vs. incomplete (greenstick in children)
- Open (compound) vs. closed: open fractures have skin disruption communicating with fracture — infection risk
- Types: transverse, spiral (rotational force — suspect abuse in children), comminuted (multiple fragments), impacted, compression (vertebral — osteoporosis)
- Pathologic fracture: bone weakened by disease (cancer, osteoporosis) fractures with minimal or no trauma"""),

s("pathophysiology_overview","pathophysiology_overview","Healing & Complications","""**Fracture healing stages:**
1. Hematoma formation (days 1–2)
2. Fibrocartilaginous callus (weeks 2–3)
3. Bony callus (weeks 3–8)
4. Bone remodeling (months to years)

**Compartment syndrome — orthopedic emergency:**
Increased pressure within a fascial compartment → compromises circulation to muscles and nerves
- Causes: casting (too tight), crush injury, severe swelling post-fracture or surgery
- Classic "6 P's": Pain (out of proportion, unrelieved by opioids), Pressure (tense compartment), Paralysis, Paresthesias (earliest neurological sign), Pallor, Pulselessness (LATE — nerve damage irreversible by this point)
- **Earliest signs: pain and paresthesias**
- Treatment: EMERGENCY fasciotomy (surgical release); do NOT elevate limb (reduces perfusion further); remove cast immediately

**Fat embolism syndrome:**
- Fat droplets from long-bone or pelvic fracture enter circulation → lodge in lungs/brain
- Onset: 24–72 hours post-fracture
- Classic triad: petechial rash (axilla/chest/conjunctivae), hypoxemia, neurological changes (confusion)
- Treatment: O₂, supportive care; prevention = early fracture immobilization

**Avascular necrosis (AVN):**
- Disrupted blood supply to bone → necrosis; most common at femoral head (after hip fracture/dislocation)
- Delayed complication: weeks to months"""),

s("signs_symptoms","signs_symptoms","5 P's Neurovascular Assessment","""**Perform the 5 P's every 1–2 hours for any patient with a cast, traction, or post-operative extremity:**

1. **Pain** — location, severity, character; pain unrelieved by ordered analgesics = compartment syndrome until proven otherwise
2. **Pulses** — palpate distal pulse (radial for upper extremity, dorsalis pedis and posterior tibial for lower); compare bilateral
3. **Pallor** — skin color distal to injury/cast; compare to opposite limb; blanching, cyanosis, or pallor = vascular compromise
4. **Paresthesias** — numbness, tingling, "pins and needles" = earliest sign of nerve/vascular compromise
5. **Paralysis** — ability to move fingers/toes distal to the injury; paralysis = late sign of severe compromise

**Cast assessment findings requiring immediate action:**
- Increasing pain or pain unresponsive to elevation and analgesics
- Numbness or tingling (paresthesias)
- Fingers/toes cold, pale, or cyanotic
- Pulselessness distal to cast
- Cast feels too tight or patient reports pressure
- Hot spots on cast (infection under cast — pressure injury or osteomyelitis)
- Foul odor from cast"""),

s("labs_diagnostics","labs_diagnostics","Diagnostics","""**Imaging:**
- X-ray: first-line for fracture diagnosis (2 views minimum: AP and lateral)
- CT scan: complex fractures (pelvis, spine, facial bones); identifies comminution
- MRI: soft tissue injuries, stress fractures, AVN
- Bone scan: stress fractures, metastatic disease, osteomyelitis

**Labs (post-operative orthopedic):**
- CBC: post-op blood loss monitoring; Hgb/Hct — may need transfusion if Hgb <7–8 g/dL with symptoms
- Electrolytes: fluid balance monitoring
- PT/INR or anti-Xa: anticoagulation monitoring (DVT prophylaxis required post-hip/knee replacement)
- ESR, CRP: infection monitoring (osteomyelitis, prosthetic joint infection)

**Compartment pressure measurement:**
- Normal: <10–12 mmHg
- Compartment syndrome: >30 mmHg, or within 30 mmHg of diastolic BP (delta pressure <30 mmHg)
- Clinical diagnosis takes priority over pressure measurement when symptoms present"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Acute fracture care:**
1. Immobilize before moving — splint in position found (do not attempt reduction)
2. Neurovascular assessment (5 P's) before and after splinting
3. Open fractures: sterile wet dressing; antibiotics stat; tetanus status
4. Ice to reduce swelling (20 min on, 20 off); elevation above heart level
5. Pain management per order; assess response

**Cast care:**
- Freshly applied plaster cast: takes 24–72 hours to fully dry; do not handle with fingertips (dents create pressure points); use palm of hand
- Fiberglass casts: dry in 30–60 minutes; can get wet (check with provider)
- Keep cast dry (plaster); cover with plastic bag for showering
- Teach: do NOT insert objects to scratch under cast (infection, tissue damage)
- Elevate casted extremity to reduce swelling
- Inspect skin at cast edges for breakdown (petal the cast edges with tape/moleskin)

**Traction care:**
- Ensure weights hang freely (not resting on floor or bed)
- Maintain body alignment as ordered (patient positioning is therapeutic)
- Never remove or adjust weights without a provider order
- Skin traction: check skin under straps every shift (pressure injuries)
- Skeletal traction: pin sites — clean per protocol; assess for infection (redness, drainage, odor)

**Post-total hip replacement precautions (traditional posterior approach):**
- No hip flexion >90°
- No internal rotation (avoid crossing legs)
- No adduction (do not cross legs; keep pillow between knees)
- Raised toilet seat; avoid low chairs
- Abduction pillow in bed"""),

s("pharmacology","pharmacology","Pharmacology","""**Pain management:**
- NSAIDs (ketorolac, ibuprofen): first-line for mild-moderate fracture pain; anti-inflammatory + analgesic; avoid in renal failure and GI history
- Opioids (oxycodone, morphine, hydromorphone): moderate-severe fracture pain; constipation prophylaxis essential
- Acetaminophen: safe adjunct; reduces opioid requirements; max 4g/day (3g in elderly/hepatic)
- Muscle relaxants (cyclobenzaprine): for muscle spasm component; sedating — fall risk

**DVT prophylaxis (mandatory post-hip/knee replacement):**
- Enoxaparin (Lovenox): weight-based SQ injection; preferred; anti-Xa monitoring in renal failure
- Rivaroxaban (Xarelto) or apixaban (Eliquis): oral DOACs; 10–35 days post-surgery
- Aspirin: some protocols use aspirin for lower-risk patients
- SCDs while in bed + ambulation as soon as safe

**Bone health:**
- Calcium + vitamin D: essential for fracture healing and osteoporosis prevention
- Bisphosphonates (alendronate, zoledronic acid): for osteoporosis; can DELAY fracture healing if given immediately — timing per provider
- Calcitonin: acute pain relief in vertebral compression fractures (intranasal or SQ)"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Compartment syndrome: pain + paresthesias are earliest signs; NEVER wait for pulselessness** — nerves and muscles die while waiting
- **If compartment syndrome is suspected: remove cast, notify provider STAT, do NOT elevate** — elevation further reduces perfusion pressure
- **Fat embolism triad: petechiae + hypoxemia + confusion** — onset 24–72 hours post-long-bone fracture
- **Post-hip replacement: no hip flexion >90°, no crossing legs, no internal rotation** — violation can dislocate the prosthesis
- **Traction weights must hang freely at all times** — even briefly resting on the floor or bed eliminates the therapeutic pull
- **Spiral fractures in children = suspect abuse** — rotational forces don't occur from simple falls; report per mandatory reporting
- **DVT is the most common post-orthopedic surgical complication** — prophylaxis (enoxaparin or DOACs) + SCDs + early ambulation are non-negotiable"""),

s("client_education","client_education","Patient Education","""**Cast care at home:**
- Keep the cast dry (plaster); use plastic bag covered with tape when showering
- Never insert anything under the cast to scratch — this can cause wounds that become infected
- Elevate the casted limb when resting
- Call your provider immediately: numbness or tingling, increased pain, fingers/toes cold or blue, swelling above or below the cast, foul smell or visible wound

**After hip replacement:**
- Do not bend your hip past a right angle (90°) for the first 6–12 weeks
- Do not cross your legs or ankles
- Use a raised toilet seat and high chair
- Sleep with a pillow between your knees

**DVT prevention:**
- Take your blood thinner medication exactly as prescribed, even when you feel well
- Wear compression stockings and move your feet/ankles frequently when sitting
- Call your provider if your leg becomes warm, red, swollen, or painful"""),

s("case_study","case_study","Case Application","""**Scenario:** A 28-year-old with a tibial fracture has a long-leg plaster cast applied 4 hours ago. The patient now reports pain of 10/10 despite two doses of oxycodone, and states the toes on the affected foot "feel numb and tingly."

**PN analysis:** Pain unresponsive to opioids + paresthesias (tingling toes) = compartment syndrome until proven otherwise. This is an orthopedic emergency.

**Priority actions:**
1. Notify provider STAT — "I have a patient with increasing unrelieved pain and paresthesias in the toes post-casting — I am concerned for compartment syndrome"
2. Do NOT elevate the limb (reduces perfusion to already-compressed tissue)
3. Prepare for immediate cast removal per order
4. Perform full 5 P's assessment: pulses, color, temperature, capillary refill, movement
5. Apply supplemental O₂; IV access
6. Anticipate: possible fasciotomy if compartment pressure elevated

**What NOT to do:** Give more pain medication and reassess in an hour — delayed treatment risks permanent muscle/nerve damage.""")
],
"preTest":[
pt("A patient with a freshly applied plaster cast reports numbness in the fingers of the casted arm and pain rated 9/10 despite analgesics. Which is the nurse's priority action?",["Elevate the limb on two pillows above heart level","Notify the provider immediately — these findings suggest compartment syndrome","Administer additional analgesics and reassess in 30 minutes","Apply ice to the cast to reduce swelling"],1,"Unrelieved pain and paresthesias (numbness/tingling) are the earliest signs of compartment syndrome — an orthopedic emergency. The provider must be notified immediately. Elevation reduces perfusion and worsens compartment syndrome. Additional analgesics delay recognition of an emergency."),
pt("Which finding following a tibial fracture 48 hours ago requires the most urgent intervention?",["Mild swelling around the ankle","Petechial rash on the axilla and chest with confusion and O₂ sat 88%","Pain rated 5/10 at the fracture site","Low-grade fever of 37.8°C"],1,"Petechiae (axilla/chest) + confusion + hypoxemia form the classic triad of fat embolism syndrome, which occurs 24–72 hours post-long-bone fracture. This is an emergency requiring immediate O₂ and provider notification. Mild swelling and low-grade pain are expected findings."),
pt("After a total hip replacement via posterior approach, which patient action requires immediate correction?",["The patient asks for a raised toilet seat","The patient crosses their legs while sitting in a chair","The patient uses a walker for ambulation","The patient sleeps with a pillow between their knees"],1,"After posterior-approach total hip replacement, crossing the legs (adduction) can dislocate the prosthesis by violating hip precautions. Raised toilet seat, walker, and pillow between knees are all correct and appropriate post-hip replacement measures."),
pt("Traction weights fall to the floor while the nurse is providing care. The correct action is:",["Re-hang them in 5 minutes after the patient is repositioned","Notify the provider — weights cannot be adjusted by nursing without an order","Replace them immediately — the therapeutic traction must be maintained continuously","Document the incident and wait for the next scheduled assessment"],2,"Traction weights must hang freely and continuously for therapeutic effect. If they fall, the nurse restores them immediately. Weights should never rest on the floor or bed even briefly. Only the amount and type of traction requires a provider order, not the restoration of displaced weights."),
pt("A spiral fracture is found in a 3-year-old child after parents report a 'fall from the couch.' The nurse's priority action is:",["Reassure the parents that spiral fractures are common in young children","Document the finding and report suspicion of non-accidental trauma to the charge nurse and designated authority","Apply a cast and schedule follow-up in 2 weeks","Obtain additional history to determine if the injury pattern is consistent"],1,"Spiral fractures result from rotational force — a mechanism inconsistent with simple falls in young children. This pattern raises a strong concern for non-accidental trauma (child abuse). The nurse is a mandated reporter and must report suspicion to the charge nurse and appropriate authority immediately. Investigation is not the nurse's role.")
]
},

{
"slug":"us-pn-arthritis-joint-disease",
"title":"Arthritis & Joint Disease — PN Management",
"topic":"Musculoskeletal","topicSlug":"arthritis","bodySystem":"Musculoskeletal",
"previewSectionCount":2,
"seoTitle":"Arthritis Osteoarthritis Rheumatoid NCLEX-PN — comparison, medications, nursing care",
"seoDescription":"NCLEX-PN arthritis: osteoarthritis vs rheumatoid arthritis, gout, DMARDs, NSAIDs, joint protection, activity-rest balance, and PN nursing priorities.",
"sections":[
s("introduction","introduction","Overview","""Arthritis is the leading cause of disability in the United States. PNs manage patients with osteoarthritis (OA), rheumatoid arthritis (RA), and gout across inpatient, outpatient, and long-term care settings. Distinguishing OA from RA is a classic NCLEX-PN differentiating question. Both require pain management, joint protection education, and adherence monitoring.

**NCLEX-PN key distinction:**

| Feature | Osteoarthritis (OA) | Rheumatoid Arthritis (RA) |
|---|---|---|
| Mechanism | Cartilage wear/degeneration | Autoimmune synovial inflammation |
| Onset | Gradual, older adults | Any age, peak 30–50s |
| Joint pattern | Asymmetric, weight-bearing joints (hips, knees) | Symmetric, small joints (MCP, PIP) |
| Morning stiffness | <30 minutes | >1 hour (classic) |
| Systemic effects | None | Fatigue, fever, rheumatoid nodules, extra-articular |
| Labs | Normal ESR/CRP, no RF | Elevated ESR/CRP, positive RF and anti-CCP |
| X-ray | Joint space narrowing, osteophytes | Erosions, joint destruction, osteopenia |"""),

s("pathophysiology_overview","pathophysiology_overview","Pathophysiology","""**Osteoarthritis:**
Progressive breakdown of articular cartilage → loss of joint cushioning → bone-on-bone contact → osteophyte (bone spur) formation → pain, stiffness, loss of range of motion. Inflammatory cytokines play a role but OA is primarily degenerative, not autoimmune. Risk factors: age, obesity, joint injury, repetitive use, genetics.

**Rheumatoid Arthritis:**
T-cell mediated autoimmune attack on synovium → pannus formation (inflamed tissue that invades and destroys cartilage and bone) → symmetric joint destruction. Extra-articular manifestations: rheumatoid nodules, pulmonary fibrosis, pericarditis, Sjögren's syndrome, increased CVD risk. Disease activity fluctuates (flares and remissions).

**Gout:**
Hyperuricemia (elevated serum uric acid) → urate crystal deposition in joints → acute inflammatory arthritis. Classic: podagra (first MTP joint, great toe). Triggers: alcohol (especially beer), purine-rich foods (red meat, organ meat, shellfish), diuretics, aspirin (low-dose), dehydration. Tophus: urate crystal deposits under skin (visible in chronic gout).

**Psoriatic arthritis:** Arthritis occurring in up to 30% of patients with psoriasis; involves skin and joints; nail changes (pitting) are characteristic."""),

s("signs_symptoms","signs_symptoms","Signs & Symptoms","""**Osteoarthritis:**
- Deep, aching joint pain worsened by activity, relieved by rest
- Crepitus (crackling sensation) with movement
- Bony joint enlargement (Heberden's nodes at DIP joints, Bouchard's nodes at PIP joints)
- Joint stiffness after inactivity, improves quickly with movement (<30 min)
- Decreased range of motion
- No systemic symptoms

**Rheumatoid Arthritis:**
- Symmetric joint pain, swelling, warmth in small joints (MCPs, PIPs, wrists)
- Morning stiffness lasting >1 hour (key distinguishing feature)
- Bilateral involvement (both wrists, both hands)
- Constitutional: fever, fatigue, weight loss, malaise
- Swan neck deformity, boutonnière deformity (chronic RA)
- Extra-articular: rheumatoid nodules (extensor surfaces), Sjögren's symptoms

**Gout (acute attack):**
- Sudden, severe, excruciating pain (often wakes from sleep)
- Classic location: first metatarsophalangeal (MTP) joint (great toe = podagra)
- Joint: hot, red, swollen, extremely tender to any touch
- May be triggered by: alcohol, dehydration, high-purine meal, surgery, illness
- Resolution: 7–10 days without treatment"""),

s("labs_diagnostics","labs_diagnostics","Diagnostics","""**Osteoarthritis:**
- X-ray: joint space narrowing, osteophytes, subchondral sclerosis
- Labs: normal (ESR, CRP, RF all negative — distinguishes from RA)

**Rheumatoid Arthritis:**
- Rheumatoid factor (RF): positive in 70–80% (not specific — also elevated in lupus, Sjögren's, healthy elderly)
- Anti-CCP antibodies: more specific (>95%) than RF; positive early in disease
- ESR and CRP: elevated (monitor disease activity and treatment response)
- CBC: normocytic anemia of chronic disease; thrombocytosis during flares
- X-ray: erosions, joint space loss, periarticular osteopenia (late findings)

**Gout:**
- Serum uric acid: usually elevated (>7 mg/dL men, >6 mg/dL women) but can be normal during acute attack
- Synovial fluid analysis: negatively birefringent monosodium urate crystals under polarized microscopy (definitive)
- Joint X-ray: "punched-out" erosions with overhanging edges (chronic gout/tophaceous gout)
- 24-hour urine uric acid: determines if patient is an underexcreter or overproducer (guides treatment)"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Pain management:**
- Assess pain with movement and at rest; document using consistent scale
- Administer NSAIDs with food; monitor for GI symptoms, renal function
- Heat therapy (OA): moist heat for joint stiffness before activity; improves flexibility
- Cold therapy: acute inflammation or post-exercise swelling; 20 min on, 20 off
- Topical agents: diclofenac gel, capsaicin cream — apply with gloves

**Joint protection (teach and reinforce):**
- Use largest/strongest joint for tasks (push door with forearm, not fingers)
- Avoid positions that strain joints (pinch grips vs. full-hand grips)
- Assistive devices: jar openers, doorknob covers, reachers, raised toilet seats
- Splints: reduce inflammation, maintain alignment (wrist splints in RA)
- Avoid holding joints in one position for extended periods

**Activity-rest balance (RA):**
- During flare: rest affected joints; apply splints; avoid overexertion
- During remission: encourage range-of-motion exercises (prevents stiffness), aerobic exercise (maintains function)
- Isometric exercises maintain muscle strength without joint stress

**Gout acute attack:**
- Elevate and rest affected joint; avoid pressure (even sheet weight can be intolerable)
- Ice packs (20 min on/off) for acute inflammation
- Colchicine or NSAIDs per order for acute attack
- Push fluids (2–3L/day) to promote uric acid excretion"""),

s("pharmacology","pharmacology","Pharmacology","""**NSAIDs (OA and RA):**
- Ibuprofen, naproxen, celecoxib (COX-2 selective — less GI irritation)
- Give with food; monitor renal function, BP, GI symptoms
- Avoid in: renal failure, peptic ulcer, on blood thinners, elderly at high GI risk

**DMARDs (disease-modifying antirheumatic drugs) for RA:**
- Methotrexate (first-line): weekly dosing (NOT daily — fatal error); folic acid supplementation required; monitor: CBC, LFTs; teratogenic
- Hydroxychloroquine (Plaquenil): monitor eyes (retinal toxicity); annual ophthalmology exam
- Sulfasalazine: monitor CBC; rash common
- Leflunomide: teratogenic; long half-life; requires cholestyramine washout before pregnancy

**Biologics (TNF-inhibitors, IL-6 inhibitors):**
- Etanercept, adalimumab, infliximab: effective for moderate-severe RA
- Screening before starting: TB (PPD/IGRA), hepatitis B and C, HIV
- Risk: serious infections (bacterial, fungal, reactivation TB); hold if fever or active infection
- Patients cannot receive live vaccines while on biologics

**Gout pharmacology:**
- Colchicine: acute attacks; take at first sign; diarrhea is common dose-limiting side effect
- Indomethacin (NSAID): acute gout management
- Allopurinol (chronic prevention): reduces uric acid production; start AFTER acute attack resolves; do NOT start during acute attack (can worsen/prolong attack); skin rash → stop and call provider (rare Stevens-Johnson syndrome)
- Febuxostat: alternative urate-lowering for allopurinol intolerance
- Probenecid: increases uric acid excretion; avoid in renal failure and kidney stones"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **OA: morning stiffness <30 min; RA: morning stiffness >1 hour** — this is the single most tested distinguishing feature
- **Methotrexate is weekly, not daily** — daily dosing is a fatal error; folic acid must be co-prescribed
- **Never start allopurinol during an acute gout attack** — can prolong/worsen the attack; wait until acute inflammation resolves
- **RA biologics require TB screening before initiation** — reactivation of latent TB can be fatal
- **Hydroxychloroquine requires annual eye exams** — can cause irreversible retinal toxicity without symptoms until advanced
- **Low-dose aspirin can trigger gout** — aspirin blocks urate excretion; avoid in gout-prone patients
- **Gout diet: limit purines (red meat, organ meat, shellfish, beer) and increase water** — beer is particularly high-risk due to both purines and alcohol blocking urate excretion"""),

s("client_education","client_education","Patient Education","""**Osteoarthritis:**
- Exercise is medicine — regular low-impact activity (swimming, cycling, walking) maintains joint function and reduces pain
- Weight loss: each pound lost = 4 pounds less pressure on knee joints
- Warm up joints before activity; use heat for stiffness before exercise
- Pacing: alternate activity with rest; don't push through severe pain

**Rheumatoid Arthritis:**
- Take methotrexate once weekly on the same day — never more often
- Take folic acid every day (except the day you take methotrexate at some facilities — verify with provider)
- Report fever or signs of infection immediately — your immune system is suppressed
- Annual eye exams if on hydroxychloroquine

**Gout:**
- Avoid: beer, red meat, organ meats, shellfish; limit alcohol
- Drink 2–3 liters of water daily to help flush uric acid
- Start allopurinol only after your acute attack is fully resolved
- Do not stop allopurinol during an attack — continue it; stopping and restarting triggers attacks"""),

s("case_study","case_study","Case Application","""**Scenario:** A 58-year-old man with a history of gout wakes at 2 AM with excruciating pain in his right great toe, rated 10/10. The joint is red, hot, and swollen. He had two beers and a large steak dinner at a wedding yesterday. He is currently on allopurinol 300 mg daily, which he stopped 3 weeks ago because "I felt fine."

**PN Analysis:**
- Classic acute gout attack: sudden-onset severe pain, right first MTP (podagra), triggered by alcohol + high-purine meal
- He stopped allopurinol (chronic prevention) — stopping and restarting can precipitate acute attacks
- He should NOT restart allopurinol tonight — this would worsen the acute attack

**Management during acute attack:**
1. Colchicine or NSAIDs per provider order for acute attack
2. Elevate the foot; apply ice (not heat) to the inflamed joint; keep light sheet away from toe
3. Push fluids (2–3 L/day) to promote uric acid excretion
4. Encourage rest; avoid weight-bearing on affected foot during acute episode

**Education after acute attack resolves:**
- Resume allopurinol consistently — never stop unless directed
- Dietary modification: limit beer/alcohol, red meat, shellfish
- Long-term: consistent allopurinol prevents attacks; goal serum uric acid <6 mg/dL""")
],
"preTest":[
pt("Which finding best differentiates rheumatoid arthritis from osteoarthritis?",["Pain worsened by activity","Morning stiffness lasting more than 1 hour","Crepitus with joint movement","Joint involvement in the hips and knees"],1,"Morning stiffness lasting more than 1 hour is the hallmark of rheumatoid arthritis, reflecting active synovial inflammation. Osteoarthritis causes stiffness lasting less than 30 minutes that resolves quickly with movement. Pain with activity and crepitus occur in both conditions. OA preferentially affects weight-bearing joints; RA affects small joints symmetrically."),
pt("A patient with rheumatoid arthritis is prescribed methotrexate. Which instruction is most important?",["Take the medication every day for best results","Take the medication once each week on the same day","Avoid all NSAIDs while taking this medication","Expect hair loss as a common side effect"],1,"Methotrexate for RA is dosed weekly, not daily. Daily administration is a fatal error causing severe bone marrow suppression and hepatotoxicity. This is a high-priority safety teaching point. Folic acid supplementation daily is also required to reduce side effects."),
pt("A patient with chronic gout is admitted with an acute gout attack and asks if they should restart their allopurinol tonight. The nurse's best response is:",["Yes — restart it tonight to lower your uric acid and shorten this attack","No — starting allopurinol during an acute attack can prolong or worsen it; restart after the attack fully resolves","Yes, but cut the dose in half during the acute phase","No — you should stop allopurinol permanently after each attack"],1,"Starting or changing allopurinol during an acute gout attack can paradoxically prolong or worsen the attack by causing uric acid redistribution. Allopurinol should be resumed only after the acute episode has fully resolved. The patient should continue any existing allopurinol if already established on it."),
pt("Which patient action requires correction when caring for an arthritic hand?",["Using a jar opener tool to open jars","Carrying grocery bags with fingers and a small pinch grip","Writing with a thick-handled pen","Pushing doors open with the forearm"],1,"Using fingers with a small pinch grip places maximum stress on small finger joints, worsening arthritis damage. Joint protection principles teach patients to use the largest/strongest available joint, distribute force across larger areas, and use adaptive equipment. Jar openers, thick pens, and using the forearm to push doors all correctly protect small joints."),
pt("A patient taking a TNF-inhibitor biologic for RA develops a temperature of 38.7°C. The nurse's priority action is:",["Reassure the patient that low-grade fever is common with biologics","Notify the provider — fever in a patient on biologics requires evaluation for serious infection","Administer prescribed PRN acetaminophen and recheck in 1 hour","Check if the patient received their biologic injection today"]
,1,"Biologics (TNF-inhibitors) suppress the immune system significantly, increasing the risk of serious bacterial, fungal, and opportunistic infections including reactivation of TB. Any fever in a patient on biologic therapy requires immediate provider notification and evaluation for serious infection. Routine reassurance or waiting is inappropriate.")
]
},

{
"slug":"us-pn-musculoskeletal-mobility-care",
"title":"Musculoskeletal Mobility & Rehabilitation — PN Practice",
"topic":"Musculoskeletal","topicSlug":"mobility-rehabilitation","bodySystem":"Musculoskeletal",
"previewSectionCount":2,
"seoTitle":"Musculoskeletal Mobility Rehabilitation NCLEX-PN — transfers, range of motion, crutches, walkers",
"seoDescription":"NCLEX-PN musculoskeletal mobility: safe patient handling, range of motion exercises, assistive devices, crutch walking, transfer techniques, contracture prevention, and PN priorities.",
"sections":[
s("introduction","introduction","Overview","""Maintaining mobility is a core nursing function. Immobility causes rapid, devastating complications across every body system. The PN is directly responsible for: safe patient handling and transfers, range-of-motion exercises, assistive device education, and prevention of immobility complications. These topics are consistently tested on NCLEX-PN.

**Immobility consequences (the PN prevents ALL of these):**
- Musculoskeletal: muscle atrophy (2% muscle mass lost per day of bedrest), contractures, disuse osteoporosis
- Cardiovascular: orthostatic hypotension, DVT (venous stasis), decreased cardiac output
- Respiratory: hypostatic pneumonia, atelectasis (reduced tidal volume in supine position)
- GI: constipation, paralytic ileus
- GU: UTI (urinary stasis), renal calculi
- Skin: pressure injuries
- Psychological: depression, confusion, loss of independence"""),

s("pathophysiology_overview","pathophysiology_overview","Range of Motion & Exercise Types","""**Range of motion (ROM) classification:**
- **Passive ROM:** Nurse moves the limb through its range with NO patient effort → maintains joint flexibility, prevents contractures; used when patient cannot participate
- **Active-assistive ROM:** Patient initiates movement; nurse or device assists as needed → builds strength
- **Active ROM:** Patient performs independently → maintains strength and joint mobility
- **Resistive ROM:** Patient moves against resistance → builds muscle mass

**ROM principles:**
- Move each joint through full range in all planes (flexion, extension, abduction, adduction, rotation)
- Stop at point of resistance or pain
- Perform slowly and smoothly; support joints above and below
- Minimum frequency: 2–3 times per day; ideally every shift

**Contractures:**
- Permanent shortening of muscle/tendon from prolonged immobility in a shortened position
- Most common: hip flexion contracture, equinus foot (plantar flexion), shoulder adduction contracture
- Prevention: positioning in anatomical alignment, ROM exercises, splints
- Treatment: very difficult once established (physical therapy, serial casting, surgery)

**Isometric vs. isotonic exercises:**
- Isometric: muscle contracts without joint movement (pushing against fixed resistance) → maintains muscle mass when joint cannot move (cast, injury)
- Isotonic: muscle contracts with joint movement (weights, walking) → builds strength and endurance"""),

s("signs_symptoms","signs_symptoms","Mobility Assessment","""**Functional mobility assessment:**
- Bed mobility: ability to roll, scoot, sit up independently or with assistance
- Transfers: bed to chair, chair to commode, chair to standing
- Ambulation: gait pattern, endurance, balance, assistive device need
- Activity tolerance: SpO₂, HR, and symptoms (dyspnea, chest pain, dizziness) with activity

**Orthostatic hypotension (most common immobility complication when mobilizing):**
- Definition: SBP drop ≥20 mmHg or DBP drop ≥10 mmHg within 3 minutes of standing
- Symptoms: dizziness, lightheadedness, near-syncope on standing
- Prevention: dangle before standing (sit on edge of bed 1–2 minutes), gradual position changes
- Always check orthostatics before first ambulation after prolonged bedrest

**Muscle strength grading (0–5 scale):**
- 0: No muscle contraction
- 1: Flicker of movement
- 2: Movement with gravity eliminated
- 3: Moves against gravity
- 4: Moves against some resistance
- 5: Normal strength (moves against full resistance)"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Safe patient handling:**
- Use mechanical lift for patients who cannot bear weight or cannot assist
- Two-nurse assist for dependent transfers when mechanical lift unavailable
- Transfer belt (gait belt): apply at waist over clothing; grip the belt, not clothing or limbs
- Proper body mechanics: keep back straight, bend knees, use legs not back, keep patient close to body, pivot feet (do not twist spine)

**Transfer technique (bed to chair):**
1. Position wheelchair at 45° angle to bed, on patient's stronger side
2. Lock wheelchair wheels; remove footrests
3. Patient sits on edge of bed (dangle position)
4. Apply gait belt
5. Ensure patient has non-slip footwear
6. Patient pushes up with hands; nurse supports at waist using gait belt
7. Patient pivots to chair; lower slowly

**Crutch walking gait patterns:**
- **2-point gait:** advance one crutch + opposite foot simultaneously; partial weight bearing on both legs; fastest gait
- **3-point gait:** advance both crutches + injured leg together, then swing unaffected leg through; for non-weight-bearing injuries (most common after lower extremity surgery)
- **4-point gait:** advance one crutch, then opposite foot, alternate; most stable; both legs bear some weight; used for weakness in both legs
- **Swing-to gait:** advance both crutches, swing both feet to crutches; for paraplegics
- Correct crutch height: 2–3 finger widths between axilla and crutch pad; weight through hands, NOT axilla (axillary pressure → radial nerve palsy)

**Walker use:**
- Advance walker 6–12 inches forward
- Step into walker, not past it
- Do not drag the walker
- 2-wheel walker: for balance assistance
- 4-wheel (rollator): for patients who can weight-bear but need balance support; has brakes

**Cane use:**
- Hold cane on STRONG (unaffected) side
- Move cane forward with WEAK leg (cane and weak leg advance together)
- Provides lateral stability

**Positioning to prevent complications:**
- Turn every 2 hours: prevents pressure injuries
- Foot board: prevents plantar flexion contracture (foot drop)
- Trochanter roll: prevents external rotation of hip (place along outer thigh)
- Splints: wrist in neutral position, foot in dorsiflexion"""),

s("pharmacology","pharmacology","Pharmacology","""**Muscle relaxants:**
- Cyclobenzaprine (Flexeril): sedating; fall risk; avoid in elderly; used for acute spasm
- Methocarbamol, carisoprodol: sedation and fall risk
- Baclofen: for spasticity (MS, spinal cord injury); do NOT abruptly discontinue (withdrawal → seizures)
- Tizanidine: spasticity; hepatotoxicity risk; monitor LFTs

**Analgesics for musculoskeletal pain:**
- Acetaminophen: first-line for mild-moderate musculoskeletal pain; safest across ages
- NSAIDs: anti-inflammatory + analgesic; take with food; renal/GI monitoring
- Tramadol: centrally-acting; lowers seizure threshold; serotonin syndrome risk

**Osteoporosis medications (falls + fracture prevention):**
- Alendronate (Fosamax): take on empty stomach with 8 oz water; remain upright 30 minutes (prevents esophagitis); weekly dosing
- Calcium + vitamin D: essential co-supplementation with bisphosphonates
- Denosumab (Prolia): SQ injection every 6 months; do NOT miss doses (rebound bone loss)
- Raloxifene (Evista): SERM; for postmenopausal women; DVT risk; hot flashes"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Crutches: weight on HANDS, never axillae** — axillary crutch pressure causes radial nerve palsy (crutch paralysis)
- **Cane: hold on STRONG side, advance with WEAK leg** — provides lateral stability when needed
- **3-point gait = non-weight-bearing** — both crutches + injured foot advance together; then swing normal foot forward
- **Dangle before standing** — always after prolonged bedrest; allows cardiovascular adjustment to orthostatic pressure change
- **Gait belt: apply before ANY transfer** — reduces back injury to nurses and fall risk for patients
- **Baclofen: never stop abruptly** — severe withdrawal including seizures and hallucinations; taper required
- **Alendronate: remain upright 30 min** — lying down after taking bisphosphonate causes severe esophageal ulceration"""),

s("client_education","client_education","Patient Education","""**Using crutches safely:**
- Your weight should be on your hands and wrists, not under your arms
- Place crutch tips 4–6 inches to the side and in front of your foot
- When going upstairs: lead with your strong leg ("good leg goes up first to heaven")
- When going down stairs: lead with crutches and weak leg first ("bad leg goes down to hell")

**Walker safety:**
- Step into the walker, not past it — this prevents tipping forward
- Both front legs of the walker should touch the ground before stepping
- Wear non-slip shoes every time you use the walker

**Preventing stiffness and weakness:**
- Move every joint through its full range at least twice daily
- Isometric exercises (pushing against fixed resistance) maintain muscle even when you can't fully move
- Short walks several times a day are better than one long walk

**Bone health and fall prevention:**
- Take calcium and vitamin D as directed — your bones need them to heal and stay strong
- Remove throw rugs, improve lighting, use grab bars in the bathroom
- Report dizziness when standing up immediately — we can assess for blood pressure changes"""),

s("case_study","case_study","Case Application","""**Scenario:** A 72-year-old woman is 2 days post-total knee replacement. She has been on bedrest. The physical therapist ordered ambulation twice daily with a walker. Before the first walk, the patient states she feels dizzy when she sits up.

**PN actions before ambulation:**
1. Assess orthostatic blood pressure: measure lying → after 1 minute sitting → after 1 minute standing; document each reading and symptoms
2. If orthostatic hypotension confirmed (SBP drop ≥20): notify provider; hold ambulation; re-hydrate; compression stockings
3. Apply gait belt before transfer
4. Dangle at edge of bed 1–2 minutes; assess for dizziness before standing
5. Apply non-slip footwear
6. Have walker in front of patient, braked/stable
7. Rise slowly; walk walker alongside patient; be prepared to support

**Teaching:** "I'm going to have you sit at the edge of the bed for a couple of minutes first. After lying flat for 2 days, your blood pressure needs time to adjust when you stand up. Tell me immediately if you feel dizzy or lightheaded during any of these steps." """)
],
"preTest":[
pt("A nurse is preparing to assist a patient using crutches. Where should the patient's weight primarily rest while using axillary crutches?",["In the axilla (armpit) against the crutch pad","On the hands and wrists via the hand grips","Equally distributed between the axilla and hands","On the injured extremity with the crutch for balance"],1,"Weight must be borne through the hand grips, not the axilla. Prolonged axillary pressure compresses the brachial plexus and radial nerve, causing 'crutch paralysis' — weakness or paralysis of the wrist extensors. This is a critical safety teaching point for crutch instruction."),
pt("A patient with a right knee injury is using a cane. On which side should the cane be held, and which leg should advance with it?",["Left (unaffected) side; advance the cane with the right (affected) leg","Right (affected) side; advance the cane with the right leg for support","Left (unaffected) side; advance the cane with the left leg","Right (affected) side; advance the cane with the left leg for balance"],0,"The cane is held on the strong (unaffected) side to provide lateral stability. The cane and the weak (affected) leg advance together — they work as a unit to support the weak side during the step. This distributes weight away from the injured limb."),
pt("A nurse is transferring a patient from bed to a wheelchair. Which action is the highest priority before beginning the transfer?",["Position the wheelchair parallel to the bed","Lower the bed to its lowest position","Apply a gait belt around the patient's waist","Remove the patient's compression stockings to prevent slipping"],2,"The gait belt (transfer belt) is applied first and provides the safest mechanical advantage for the nurse during the transfer, reducing the risk of injury to both the patient and nurse. The belt is gripped, never clothing or the patient's arms. All other steps are important but follow belt application."),
pt("Which patient is at highest risk for developing a contracture?",["A patient who ambulates twice daily with assistance","A patient who is immobilized in a hip spica cast for 6 weeks","A patient who performs active ROM exercises three times daily","A patient who is up in a chair for 4 hours per day"],1,"Prolonged immobilization in a fixed position, as occurs with a hip spica cast, places the joints at highest risk for contractures — permanent shortening of muscles and tendons due to sustained shortened positioning. Regular ROM exercises and position changes prevent contractures in mobile patients."),
pt("A patient is about to ambulate for the first time after 5 days of bedrest. Before standing, the nurse should:",["Assist the patient to stand immediately to prevent further deconditioning","Have the patient sit at the edge of the bed and dangle for 1–2 minutes before standing","Measure bilateral lower extremity pulses to confirm adequate circulation","Administer a PRN analgesic and wait 30 minutes before attempting ambulation"],1,"After prolonged bedrest, the cardiovascular system loses its ability to compensate for positional changes. Dangling at the edge of the bed for 1–2 minutes allows a gradual hemodynamic adjustment, preventing orthostatic hypotension and syncope when the patient stands. Immediate standing after lying flat risks a syncopal fall.")
]
},

{
"slug":"us-pn-therapeutic-nutrition-diets",
"title":"Therapeutic Nutrition & Dietary Modifications — PN Practice",
"topic":"Nutrition","topicSlug":"therapeutic-nutrition","bodySystem":"Multisystem",
"previewSectionCount":2,
"seoTitle":"Therapeutic Nutrition Diets NCLEX-PN — renal diet, cardiac diet, diabetic diet, dysphagia",
"seoDescription":"NCLEX-PN therapeutic nutrition: DASH diet, renal diet restrictions, diabetic carbohydrate counting, dysphagia diet textures, NPO management, and PN nutrition priorities.",
"sections":[
s("introduction","introduction","Overview","""Therapeutic nutrition is an essential component of nursing care across every diagnosis. PNs assess nutritional status, implement ordered dietary modifications, educate patients about food-drug interactions and dietary restrictions, and recognize malnutrition. Nutrition questions appear on NCLEX-PN in the context of cardiac disease, renal failure, diabetes, dysphagia, and post-surgical care.

**Nutritional assessment indicators:**
- BMI: <18.5 = underweight; 18.5–24.9 = normal; 25–29.9 = overweight; ≥30 = obese
- Serum albumin: reflects protein status over past 3 weeks (half-life 20 days); <3.5 g/dL = hypoalbuminemia; delayed indicator
- Prealbumin: reflects protein status over past 2–3 days (half-life 2 days); more sensitive early marker of nutritional status
- Weight change: >10% loss in 6 months = significant malnutrition risk
- MUST (Malnutrition Universal Screening Tool) or MNA (Mini Nutritional Assessment): validated screening tools"""),

s("pathophysiology_overview","pathophysiology_overview","Therapeutic Diet Types","""**Cardiac diet (DASH — Dietary Approaches to Stop Hypertension):**
- Sodium: ≤2,000–2,400 mg/day (heart failure: often ≤2,000 mg)
- Saturated fat: <7% of total calories; avoid trans fats
- Emphasis: fruits, vegetables, whole grains, low-fat dairy, lean protein
- Potassium, magnesium, calcium: emphasized (natural BP-lowering)
- Avoid: processed foods, canned soups, deli meats (high hidden sodium), fast food

**Renal diet (chronic kidney disease):**
- **Potassium restriction** (if hyperkalemia): avoid bananas, oranges, potatoes, tomatoes, avocados, leafy greens, dried fruits; leach vegetables (peel, cut small, boil in large water, discard water)
- **Phosphorus restriction**: avoid dairy (milk, cheese, yogurt), dark cola, processed foods, nuts, beans; take phosphate binders WITH meals
- **Protein restriction** (pre-dialysis): limits waste product buildup; often 0.6–0.8 g/kg/day
- **Fluid restriction**: varies by stage and urinary output; typically 1–1.5 L/day in advanced CKD
- **Sodium restriction**: ≤2,000 mg/day to manage fluid and BP

**Diabetic diet (medical nutrition therapy):**
- Consistent carbohydrate distribution (45–60g per meal)
- Carbohydrate counting: 1 exchange = 15g carbohydrate
- Glycemic index consideration: complex carbohydrates preferred over simple sugars
- Protein: 15–20% of calories; high-protein snacks stabilize blood glucose
- Fat: healthy fats (unsaturated); limit saturated and trans fats

**Dysphagia diets (IDDSI framework):**
- Level 3 — Liquidised: smooth, homogenous, no lumps; spoon-pressure test passes
- Level 4 — Pureed: smooth, no lumps, pudding consistency
- Level 5 — Minced and moist: small soft pieces ≤4mm; fork-mashed
- Level 6 — Soft and bite-size: tender, easily mashed; no hard/crunchy foods
- Level 7 — Regular: normal diet
- Thickened liquids: nectar-thick, honey-thick, spoon-thick (for patients with swallowing dysfunction)

**Other therapeutic diets:**
- High-fiber: ≥25–38g/day; constipation, diverticular disease, IBS; increase fluids with fiber
- Low-residue/low-fiber: bowel rest, IBD flare, colonoscopy prep
- Neutropenic diet: no raw/unwashed produce for ANC <500 (institution-specific guidelines vary)
- Clear liquid: post-op GI recovery; popsicles, gelatin, broth, juice without pulp
- Full liquid: adds milk-based products, pureed soups"""),

s("signs_symptoms","signs_symptoms","Malnutrition Signs","""**Clinical signs of malnutrition:**
- Weight loss (involuntary): >5% in 1 month or >10% in 6 months = significant
- Muscle wasting: temporal wasting, decreased grip strength, thin extremities
- Poor wound healing
- Edema: paradoxically can occur with severe hypoalbuminemia (low oncotic pressure → fluid shifts to interstitium)
- Brittle nails, hair loss, dry skin
- Fatigue, weakness
- Immune suppression: frequent infections, prolonged recovery

**Vitamin and mineral deficiency signs:**
- Vitamin C deficiency (scurvy): gum bleeding, petechiae, poor wound healing
- Vitamin D deficiency: bone pain, weakness, rickets (children), osteomalacia (adults)
- Vitamin K deficiency: abnormal bleeding (↑ PT/INR)
- Iron deficiency: fatigue, pallor, pica
- B12 deficiency: neurological changes, macrocytic anemia
- Zinc deficiency: poor wound healing, taste and smell loss
- Thiamine (B1) deficiency: Wernicke's encephalopathy (alcoholism), peripheral neuropathy"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Nutritional screening on admission:**
- Weight and height; BMI calculation
- Food allergies and intolerances
- Chewing or swallowing difficulties
- Cultural and religious food preferences
- Current dietary restrictions at home
- Appetite changes; GI symptoms

**Dysphagia assessment and feeding precautions:**
- Assess swallowing: water swallow test per protocol; refer to speech language pathology (SLP) for formal assessment
- Positioning for eating: high Fowler's (90°); remain upright 30–60 minutes after meals
- Small bites; cut food to appropriate size; allow extra time
- Verbal cues: "swallow after each bite"; no talking while eating (distraction increases aspiration risk)
- Suction available at bedside
- Observe for signs of aspiration: coughing, choking, voice change after swallowing ("wet" or gurgling voice), repetitive throat clearing

**NPO management:**
- Verify NPO status and duration; clarify medications that can/cannot be given with sips of water
- IV fluid hydration as ordered
- Oral care every 2–4 hours (dry mouth is uncomfortable and infection-prone)
- Educate patient: what NPO means, when it will end, what to expect

**Assisting with meals:**
- Offer oral hygiene before meals (taste and appetite are better with clean mouth)
- Position in chair or high Fowler's; never feed a semi-recumbent patient (aspiration risk)
- Document percentage of meal eaten (25%, 50%, 75%, 100%)
- Notify dietitian if <50% intake consistently"""),

s("pharmacology","pharmacology","Food-Drug Interactions","""**Critical food-drug interactions the PN must know:**

| Drug | Food Interaction | Teaching |
|---|---|---|
| Warfarin | Vitamin K (leafy greens) competes with warfarin → variable INR | Consistent vitamin K intake; do not eliminate, just be consistent |
| MAOIs (phenelzine) | Tyramine (aged cheese, red wine, cured meats) → hypertensive crisis | Avoid all tyramine-rich foods |
| Tetracyclines | Dairy, calcium → chelates antibiotic → reduced absorption | Take 2 hours before or after dairy/calcium |
| Fluoroquinolones | Calcium, magnesium, antacids → reduced absorption | Take 2 hours apart from dairy/antacids |
| Metformin | No food interaction but take WITH food (reduces GI side effects) | Always take with meals |
| Digoxin | High-fiber meals can reduce absorption | Consistent timing relative to meals |
| Statins | Grapefruit/grapefruit juice → inhibits CYP3A4 → ↑ statin levels → myopathy risk | Avoid grapefruit products |
| ACE inhibitors | Potassium-rich foods + K+ supplements → hyperkalemia risk | Monitor potassium; avoid excessive potassium-rich foods |
| Levothyroxine | Calcium, iron, soy → reduced absorption | Take on empty stomach; separate from supplements 4 hours |
| Lithium | Sodium: low sodium diet → lithium retention → toxicity | Maintain consistent sodium intake; no sudden diet changes |"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Dysphagia: always 90° upright, 30–60 min after eating, small bites** — aspiration pneumonia is the lethal complication
- **Wet/gurgling voice after swallowing = aspiration** — stop oral intake, notify provider and SLP immediately
- **Renal diet: phosphate binders WITH meals** — taking them at other times is ineffective; they bind dietary phosphorus in the GI tract
- **Warfarin and vitamin K: consistent intake, not elimination** — patients who suddenly increase leafy greens lower their INR and lose anticoagulation protection
- **Grapefruit inhibits CYP3A4** — affects statins, calcium channel blockers, some HIV drugs, some immunosuppressants; can cause dangerously elevated drug levels
- **Prealbumin reflects recent nutritional status (days), albumin reflects weeks** — prealbumin is better for monitoring short-term nutritional interventions
- **NPO: continue oral care** — the mouth still needs hygiene; clean mouth reduces aspiration pneumonia risk and patient discomfort"""),

s("client_education","client_education","Patient Education","""**Heart failure sodium restriction (2,000 mg/day):**
- Avoid: canned soups, frozen meals, deli meats, fast food, adding salt
- Hidden sodium: read labels — "reduced sodium" still may be high; target <600 mg per serving
- Weigh yourself daily; gain >2 lbs in a day or >5 lbs in a week → call your provider

**Renal diet:**
- Limit: bananas, oranges, tomatoes, potatoes, dairy, dark cola, nuts
- Take your phosphate binders WITH every meal and snack — not before or after
- Track your fluid intake; limit to your prescribed amount daily

**Dysphagia:**
- Always sit fully upright (90°) to eat; do not eat lying back
- Use modified textures exactly as prescribed — eating a "regular" diet when you need pureed is dangerous
- Stay upright for at least 30 minutes after finishing meals
- Call your provider if you cough or choke during meals or have food "going down the wrong way"

**When to call your provider:**
- You are not eating >50% of your meals for more than 2 days
- You have lost weight unexpectedly
- Swallowing is getting harder"""),

s("case_study","case_study","Case Application","""**Scenario:** A 78-year-old with heart failure, CKD stage 3, and type 2 diabetes is eating only 25% of meals for 3 days. Current labs: K+ 5.6 mEq/L, phosphorus 5.9 mg/dL, Hgb A1c 9.2%, prealbumin 12 mg/dL (normal 15–40).

**PN Analysis:**
- Prealbumin 12 = protein malnutrition (recent nutritional decline)
- K+ 5.6 = hyperkalemia — requires potassium restriction (CKD + possibly ACE inhibitor)
- Phosphorus 5.9 = hyperphosphatemia — restrict phosphorus, ensure phosphate binders with meals
- HbA1c 9.2% = poorly controlled diabetes — consistent carbohydrate distribution needed
- Only eating 25% = inadequate intake of ALL nutrients — malnutrition worsening

**PN actions:**
1. Notify dietitian: complex therapeutic nutrition needs (cardiac + renal + diabetic + malnutrition)
2. Notify provider: poor intake × 3 days + hypokalemia-risk medications
3. Assess cause of poor appetite: nausea? dysphagia? meal preferences? depression?
4. Assist with meals: position in chair, offer food preferences, small frequent portions
5. Document exact intake percentages every meal
6. Confirm phosphate binders are being given WITH meals (not separately)
7. Consider nutrition supplement between meals if cleared for diabetes diet""")
],
"preTest":[
pt("A patient with CKD has a potassium level of 5.8 mEq/L. Which food should be removed from the patient's meal tray?",["White rice","Orange juice","White bread","Scrambled eggs"],1,"Orange juice is high in potassium and is contraindicated for patients with hyperkalemia. Patients with CKD and elevated potassium must avoid high-potassium foods including oranges, bananas, tomatoes, potatoes, and many fruit juices. White rice, white bread, and eggs are relatively low in potassium and are appropriate for a renal diet."),
pt("A patient receiving warfarin therapy consistently eats large amounts of spinach and kale. The nurse should explain:",["These foods are prohibited on warfarin and must be completely avoided","Vitamin K in leafy greens competes with warfarin; the patient should eat a consistent amount, not eliminate them","These foods will enhance warfarin's anticoagulant effect and require a dose reduction","Leafy greens are encouraged on warfarin because they provide important nutrients"],1,"Warfarin's effectiveness depends on stable vitamin K levels. Vitamin K competes with warfarin at the site of clotting factor synthesis. Sudden increases in leafy greens lower the INR; sudden elimination raises it. The goal is consistent intake — not elimination. Abrupt dietary changes destabilize the INR."),
pt("A patient with dysphagia is being fed in bed at 30° elevation. The nurse's priority action is:",["Continue feeding since 30° reduces aspiration risk compared to flat","Stop the feeding and reposition the patient to 90° before continuing","Slow the feeding rate to reduce aspiration risk at the current angle","Apply suction before each bite to clear the oral cavity"],1,"Feeding a patient at less than 90° significantly increases aspiration risk. Patients with dysphagia must be positioned upright (90°/high Fowler's) for all oral intake. Gravity assists swallowing and reduces the risk of aspiration. Thirty degrees is commonly used for reflux prevention but is insufficient for dysphagia safety."),
pt("A patient who takes a statin medication mentions they drink a large glass of grapefruit juice every morning with their medications. The nurse's priority response is:",["This is fine — grapefruit juice is a healthy choice with any medication","Grapefruit juice can significantly increase statin blood levels, raising the risk of muscle damage; avoid grapefruit products","Grapefruit juice will reduce your statin's effectiveness","Drink the grapefruit juice 2 hours after your statin to prevent interaction"],1,"Grapefruit and grapefruit juice inhibit the CYP3A4 enzyme that metabolizes many statins. Inhibition leads to dangerously elevated statin blood levels, increasing the risk of myopathy and rhabdomyolysis. The patient should avoid grapefruit entirely while on statin therapy — there is no safe time interval."),
pt("A patient with a history of dysphagia reports a 'wet, gurgling voice' immediately after swallowing a sip of water during a swallowing assessment. The nurse's best action is:",["Continue the assessment to gather more data before intervening","Stop the swallowing assessment, withhold oral intake, and notify the provider and speech-language pathologist","Offer thickened liquids instead and continue the assessment","Document the finding and report to the oncoming shift"]
,1,"A wet or gurgling voice quality immediately after swallowing indicates that fluid or food has entered the airway (aspiration or penetration). This is a significant finding requiring immediate cessation of the swallowing assessment, withholding of all oral intake, and urgent notification of the provider and speech-language pathologist for a formal dysphagia evaluation.")
]
},

{
"slug":"us-pn-tpn-enteral-nutrition",
"title":"TPN & Enteral Nutrition — PN Monitoring",
"topic":"Nutrition","topicSlug":"tpn-enteral-nutrition","bodySystem":"Multisystem",
"previewSectionCount":2,
"seoTitle":"TPN Enteral Nutrition NCLEX-PN — tube feeding complications, refeeding syndrome, monitoring",
"seoDescription":"NCLEX-PN TPN and enteral nutrition: nasogastric tube placement verification, refeeding syndrome, tube feeding complications, central line management, and PN monitoring priorities.",
"sections":[
s("introduction","introduction","Overview","""When patients cannot meet nutritional needs through oral intake, enteral (via GI tract) or parenteral (IV) nutrition is required. The PN monitors these therapies, assesses for complications, and educates patients/families. Tube feeding and TPN are high-acuity nursing responsibilities with significant complication risk.

**Nutrition support hierarchy:**
1. Oral diet (preferred — maintains gut function)
2. Enteral nutrition (tube feeding) — "if the gut works, use it"
3. Parenteral nutrition (IV) — only when GI tract non-functional

**Enteral nutrition advantages over parenteral:**
- Maintains gut mucosal integrity (prevents bacterial translocation)
- Less infection risk than central venous access
- Less expensive
- More physiological metabolism of nutrients"""),

s("pathophysiology_overview","pathophysiology_overview","Enteral & Parenteral Access","""**Enteral feeding routes:**
- **Nasogastric (NG) tube:** nose → stomach; for short-term; most common; risk of sinusitis, nasal irritation
- **Nasojejunal (NJ) tube:** nose → jejunum; bypasses stomach; for high aspiration risk or gastroparesis
- **Gastrostomy (G-tube / PEG):** percutaneous into stomach; for long-term (>4–6 weeks); managed at home
- **Jejunostomy (J-tube):** directly into jejunum; for gastric bypass or persistent vomiting

**Tube placement verification (CRITICAL safety):**
- X-ray: gold standard for initial placement confirmation before first use
- pH testing: gastric aspirate pH <5 = stomach confirmed; pH >6 = may be in respiratory tract or jejunum
- Auscultation (air bolus method): UNRELIABLE — do NOT use alone to confirm placement
- Mark the tube at the nose and check every shift — migration can occur without symptoms

**Parenteral nutrition routes:**
- **Central parenteral nutrition (TPN/CPN):** delivered via central venous catheter (PICC, subclavian, internal jugular) — high osmolarity formulas require central access to avoid peripheral vein sclerosis
- **Peripheral parenteral nutrition (PPN):** delivered via peripheral IV — lower dextrose concentration (≤10%); can only be used short-term and for partial supplementation

**TPN components:**
- Dextrose (carbohydrate): major calorie source; ≥10% concentration requires central access
- Amino acids (protein)
- Lipid emulsion (fat): usually 20–30% of total calories; given separately or as 3-in-1 (total nutrient admixture)
- Electrolytes (K+, Na+, Mg2+, Ca2+, phosphate, chloride)
- Vitamins (multivitamin additive)
- Trace elements (zinc, chromium, selenium, manganese)
- Insulin (if hyperglycemia)"""),

s("signs_symptoms","signs_symptoms","Complications & Warning Signs","""**Enteral feeding complications:**

| Complication | Signs | Action |
|---|---|---|
| Aspiration | Coughing, respiratory distress, SpO₂ drop, green/brown tracheal secretions | Stop feeding; elevate HOB; notify provider; clear airway |
| Tube displacement | Change in tube length, loss of aspirate, coughing, vomiting formula | Stop feeding; confirm placement by X-ray before resuming |
| Diarrhea | >3 loose stools/day during tube feeding | Check rate, formula osmolarity, medications (sorbitol-containing); C. diff if prolonged |
| Constipation | No bowel movement >3 days | Assess for impaction; fiber formula; hydration |
| Tube clogging | Unable to flush | Flush q4h with 30mL water; use warm water or enzyme preparations for clog; avoid crushing medications that should not be crushed |
| Refeeding syndrome | Hypophosphatemia, hypokalemia, hypomagnesemia after starting nutrition in severely malnourished | Start nutrition SLOWLY; monitor electrolytes daily; replace deficiencies |

**TPN complications:**

| Complication | Signs | Action |
|---|---|---|
| Central line infection (CLABSI) | Fever, redness/drainage at site, positive blood culture | Blood cultures; antibiotics; possible line removal |
| Hyperglycemia | BG >180 mg/dL | Insulin per sliding scale or infusion |
| Hypoglycemia (if TPN stopped suddenly) | BG <70, diaphoresis, confusion | Give 10% dextrose IV if TPN must be stopped; taper |
| Fluid overload | Edema, crackles, weight gain | Notify provider; restrict additional fluids |
| Electrolyte imbalance | Varies | Monitor BMP daily; replace per order |"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Enteral tube feeding nursing care:**

**Before each feeding or continuous feed check (q4h for continuous):**
1. Verify tube placement: check external length at nose; pH testing or X-ray per policy
2. Assess gastric residual volume (GRV) if ordered: >500 mL = hold feed; notify provider; reassess in 1 hour
3. Head of bed at 30–45° (minimum) during feeding and for 30–60 minutes after bolus feeds
4. Flush tube: 30 mL water before and after bolus feeds, q4h for continuous feeds, after medications

**Medication administration via enteral tube:**
- Crush only immediate-release medications (verify each drug — many cannot be crushed)
- Give each medication separately (flushing between each)
- Use liquid formulations when available
- Flush with 5–10 mL water before and after each medication; total 30 mL before/after the set

**TPN nursing care:**
- Dedicated line for TPN: no other medications, blood products, or blood draws through the TPN lumen
- Change IV tubing every 24 hours for TPN (lipid-containing)
- Inspect solution: do NOT use if cloudy, precipitate visible, or "cracked" emulsion (oil separation in 3-in-1)
- Blood glucose monitoring: q4–6h; maintain 140–180 mg/dL in most patients
- Daily weights; strict I&O
- If TPN must be stopped: administer 10% dextrose at same rate to prevent hypoglycemia
- Central line site: assess daily for infection signs (redness, warmth, drainage, tenderness)
- Never administer TPN through peripheral IV (except PPN formulations)"""),

s("pharmacology","pharmacology","Refeeding Syndrome","""**Refeeding syndrome — life-threatening complication of nutrition restart in severely malnourished patients:**

**Who is at risk:** Prolonged starvation, anorexia nervosa, chronic alcoholism, post-surgical patients with prolonged NPO, cancer cachexia

**Mechanism:** Carbohydrate administration → insulin surge → drives phosphorus, potassium, and magnesium into cells → severe electrolyte drops in serum

**Life-threatening electrolyte changes:**
- Hypophosphatemia (most dangerous): respiratory failure (diaphragm weakness), hemolytic anemia, cardiac arrhythmias
- Hypokalemia: cardiac arrhythmias
- Hypomagnesemia: arrhythmias, seizures

**Prevention:**
- Identify high-risk patients before starting nutrition
- Start at 25% of goal rate; increase slowly over 3–7 days
- Monitor electrolytes daily (phosphorus, K+, Mg2+) for first week
- Supplement deficiencies before starting nutrition if possible
- Thiamine (B1) supplementation before starting (Wernicke's prevention in alcoholism/starvation)

**Insulin in TPN:**
- Regular insulin is the ONLY type added to TPN solutions
- Do not add long-acting insulin (incompatible)
- Monitor glucose q4–6h; adjust per sliding scale or insulin drip"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **X-ray is the only reliable initial tube placement confirmation** — do NOT use first without X-ray; auscultation alone is unreliable
- **HOB 30–45° during tube feedings** — prevents aspiration; this is always required (not optional)
- **If TPN is stopped suddenly → hang 10% dextrose** — rebound hypoglycemia occurs as insulin response continues without glucose supply
- **TPN line is dedicated** — no blood draws, no medications, no blood products through the TPN lumen (risk of contamination and incompatibilities)
- **Refeeding syndrome: start slow, monitor electrolytes daily** — phosphorus is the key electrolyte; hypophosphatemia causes respiratory failure
- **Flush tube before AND after medications** — multiple medications must be given separately with flushes between each to prevent tube clogging and drug interactions
- **Insulin added to TPN = Regular insulin only** — NPH, long-acting, and premixed insulins are incompatible with TPN solutions"""),

s("client_education","client_education","Patient Education","""**Managing tube feedings at home:**
- Flush the tube with 30 mL of water before and after feedings and after all medications
- Keep the head of your bed elevated at least 30° during feedings and for 1 hour after
- Never use the microwave to warm formula — heat unevenly and can cause burns; room temperature is fine
- Rinse the bag and tubing with water between uses; change the feeding set daily
- Check the tube length mark at your nose before each feeding — call your provider if it has moved

**Signs to report immediately:**
- Coughing or choking during feedings, or difficulty breathing
- Vomiting formula
- The tube length at your nose has changed
- Formula leaking around the tube site
- Fever

**Blood sugar monitoring during TPN:**
- Blood sugar will be checked frequently — nutrition through your vein affects your glucose
- Report: shakiness, sweating, confusion (low blood sugar signs)"""),

s("case_study","case_study","Case Application","""**Scenario:** A 45-year-old with Crohn's disease and severe malnutrition (albumin 2.1, weight loss 18% in 2 months) is being started on TPN after bowel surgery. Day 2 of TPN: phosphorus 1.8 mg/dL (normal 2.5–4.5), potassium 2.9 mEq/L, patient complains of weakness and shortness of breath.

**PN Analysis:**
- Phosphorus 1.8 = severe hypophosphatemia (normal 2.5–4.5)
- Potassium 2.9 = hypokalemia
- Weakness + shortness of breath with hypophosphatemia = early respiratory muscle compromise
- This is REFEEDING SYNDROME — nutrition started in a severely malnourished patient

**PN priority actions:**
1. Notify provider STAT — hypophosphatemia causing respiratory symptoms is a medical emergency
2. Assess respiratory status: RR, depth, O₂ sat, ability to breathe deeply
3. Apply supplemental O₂ per order
4. Anticipate: phosphorus replacement IV; potassium replacement
5. Anticipate: TPN rate reduction until electrolytes stabilize
6. Continuous cardiac monitoring (hypophosphatemia + hypokalemia = arrhythmia risk)
7. Document: electrolyte trends, respiratory assessment, symptoms, provider notification""")
],
"preTest":[
pt("Before initiating a continuous tube feeding that was temporarily interrupted, the nurse's priority action is:",["Assess bowel sounds to confirm GI function","Verify tube placement by checking the external tube length and testing aspirate pH","Administer the held feeds at double the rate to catch up","Flush the tube with 60 mL of water before restarting"],1,"Tube placement must be verified before any feeding is initiated or resumed after interruption. The tube may have migrated during movement or positioning changes. X-ray is required for initial placement; external length verification and pH testing are used for ongoing checks per facility policy. Auscultation alone is insufficient."),
pt("A patient receiving continuous tube feedings has a gastric residual volume of 520 mL when checked. The nurse's priority action is:",["Continue feeding at the same rate and recheck in 4 hours","Hold the feeding and notify the provider","Increase the head of bed elevation and continue the feeding","Flush the tube with 30 mL water and restart at half the rate"],1,"A gastric residual volume greater than 500 mL indicates high risk for aspiration. The tube feeding should be held and the provider notified to evaluate gastric motility and consider interventions (prokinetic medications, position adjustment, or route change). The PN should not independently restart the feeding without a provider assessment."),
pt("TPN is accidentally disconnected and the infusion bag is empty. The replacement bag will not arrive for 45 minutes. The nurse's priority action is:",["Keep the IV line patent with a normal saline lock and wait for the new bag","Start an infusion of 10% dextrose at the same rate as the TPN to prevent hypoglycemia","Administer a 500 mL normal saline bolus to maintain hydration","Give the patient oral carbohydrates to prevent hypoglycemia"],1,"When TPN is discontinued or interrupted, rebound hypoglycemia occurs because the insulin response continues while the glucose supply stops abruptly. The standard protocol is to infuse 10% dextrose (D10W) at the same rate as the TPN until the new bag is available. Normal saline provides no glucose. Oral intake may not be possible for TPN-dependent patients."),
pt("Which assessment finding is the earliest warning sign of refeeding syndrome in a severely malnourished patient started on TPN?",["Serum sodium below 135 mEq/L","Serum phosphorus below 2.5 mg/dL","Blood glucose above 180 mg/dL","Blood pressure below 90/60 mmHg"],1,"Hypophosphatemia is the hallmark and earliest critical finding of refeeding syndrome. When carbohydrates are introduced after prolonged starvation, insulin drives phosphorus into cells, causing rapid depletion of serum phosphorus. This leads to respiratory muscle weakness, hemolysis, and cardiac arrhythmias. Electrolytes must be checked daily in the first week of nutrition repletion in malnourished patients."),
pt("A nasogastric tube is being placed. X-ray confirms correct placement in the stomach. Before initiating tube feedings, what action is required?",["Auscultate over the stomach while injecting air to confirm placement","Begin feeding at the prescribed rate — X-ray confirmation is sufficient","Document the external tube length at the nose for ongoing monitoring","Reposition the patient supine for comfort during the first feeding"],2,"Once X-ray confirms initial placement, the nurse should document the external tube length at the nose (the length mark). This baseline measurement enables ongoing verification — if the tube migrates, the length at the nose will change. The patient should be in 30–45° head-of-bed elevation (not supine) for feedings. Auscultation alone is unreliable for placement verification.")
]
},

{
"slug":"us-pn-pressure-injury-staging",
"title":"Pressure Injuries — Prevention, Staging & PN Care",
"topic":"Integumentary & Wound Care","topicSlug":"pressure-injuries","bodySystem":"Integumentary & Wound Care",
"previewSectionCount":2,
"seoTitle":"Pressure Injuries NCLEX-PN — Braden scale, staging, prevention bundle, wound care",
"seoDescription":"NCLEX-PN pressure injuries: Braden scale scoring, NPUAP staging 1-4 plus unstageable and DTI, repositioning schedule, offloading devices, wound dressing selection, and PN priorities.",
"sections":[
s("introduction","introduction","Overview","""Pressure injuries (formerly "pressure ulcers" or "decubitus ulcers") are preventable adverse events that affect 2.5 million hospitalized patients annually in the US. They cause pain, infection, sepsis, prolonged hospitalization, and death. Preventing pressure injuries is a core PN responsibility — nurses are held professionally and institutionally accountable for their development.

**Mechanism:** Sustained pressure over bony prominences → compression of blood vessels → tissue ischemia → necrosis. Shear (skin moves in opposite direction from underlying tissue — e.g., sliding down in bed) and friction compound the damage.

**Key principle: Prevention > Treatment.** A stage 4 pressure injury takes months to years to heal. Prevention requires 5 minutes of repositioning every 2 hours.

**Highest-risk bony prominences:** Sacrum/coccyx (most common), heels, lateral malleoli, trochanters, ischial tuberosities, occiput (infants), scapulae, elbows"""),

s("pathophysiology_overview","pathophysiology_overview","NPUAP Staging System","""**Pressure Injury Staging (National Pressure Injury Advisory Panel):**

**Stage 1:** Non-blanchable erythema on intact skin; skin intact but does not blanch with fingertip pressure; may be painful, firm, or soft compared to adjacent tissue; in dark-skinned patients: color may differ from surrounding skin

**Stage 2:** Partial-thickness skin loss; involves epidermis and/or dermis; presents as shallow open ulcer with pink/red wound bed OR intact or ruptured blister; no slough or eschar

**Stage 3:** Full-thickness skin loss through dermis into subcutaneous tissue; subcutaneous fat visible; no fascia, muscle, tendon, or bone exposed; slough may be present; depth varies by anatomical location (heels/nose: minimal depth even in stage 3)

**Stage 4:** Full-thickness skin and tissue loss exposing bone, tendon, fascia, or muscle; slough and/or eschar may be present; often includes undermining and tunneling; osteomyelitis risk

**Unstageable:** Full-thickness loss with base covered by slough (yellow/tan/gray) or eschar; true depth cannot be determined until slough/eschar is removed; assumed to be stage 3 or 4

**Deep Tissue Injury (DTI):** Intact or non-intact skin with localized area of persistent non-blanchable deep red, maroon, or purple discoloration; or epidermal separation revealing dark wound bed; results from intense/prolonged pressure and shear; may evolve rapidly even with optimal care

**Medical device-related pressure injuries:** Same staging; caused by devices (oxygen tubing, BiPAP mask, sequential compression devices, restraints, urinary catheters) — prevent with padding and regular repositioning"""),

s("signs_symptoms","signs_symptoms","Braden Scale Risk Assessment","""**Braden Scale (score 6–23; lower score = higher risk):**

| Subscale | Score 1 (worst) | Score 2 | Score 3 | Score 4 (best) |
|---|---|---|---|---|
| Sensory perception | Completely limited | Very limited | Slightly limited | No impairment |
| Moisture | Constantly moist | Often moist | Occasionally moist | Rarely moist |
| Activity | Bedfast | Chairfast | Walks occasionally | Walks frequently |
| Mobility | Completely immobile | Very limited | Slightly limited | No limitation |
| Nutrition | Very poor | Probably inadequate | Adequate | Excellent |
| Friction/shear | Problem | Potential problem | No apparent problem | — |

**Risk thresholds:**
- Score ≤9: very high risk
- Score 10–12: high risk
- Score 13–14: moderate risk
- Score 15–18: mild risk (some facilities initiate prevention at ≤18)
- Score 19–23: no risk

**Clinical risk factors for pressure injury:**
Immobility, altered sensation, moisture/incontinence, poor nutrition, friction/shear, advanced age, dark skin (delayed visual detection), diabetes, peripheral vascular disease, edema, low albumin"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Prevention Bundle","""**ESSENTIAL prevention interventions — the PN implements all:**

**1. Repositioning (most important):**
- Turn every 2 hours in bed (or more frequently per risk assessment)
- Document position changes and skin assessment
- Use 30° lateral tilt (not full lateral — avoids trochanter pressure)
- Heel float: place pillow under calf (never under heel — pressure point)

**2. Skin assessment:**
- Head-to-toe skin inspection with each repositioning
- Assess bony prominences: sacrum, heels, trochanters, elbows, occiput, ears
- In dark-skinned patients: assess for warmth, firmness, pain, or bogginess (visual blanching unreliable)
- Document stage, size (length × width × depth), wound bed characteristics, drainage

**3. Moisture management:**
- Apply moisture barrier cream/ointment for incontinence
- Change briefs/pads promptly when soiled
- Use moisture-wicking pads (not plastic-backed — trap moisture)
- Treat cause of incontinence

**4. Nutrition:**
- Adequate protein: 1.2–1.5 g/kg/day for wound healing
- Vitamin C: supports collagen synthesis
- Zinc: supports tissue repair
- Refer to dietitian for wound patients

**5. Offloading devices:**
- Pressure-redistribution mattresses: foam, air, water, gel (NOT donut-shaped cushions — increase pressure at edges)
- Heel boots (foam, air): protect heels specifically
- Do NOT use rubber/doughnut-shaped rings — concentrate pressure on wound edges

**6. Minimize friction/shear:**
- Lift (do not drag) patients when repositioning
- Use draw sheet or mechanical lift
- Keep head of bed at lowest safe position (30° maximum for tube feedings; otherwise flat)
- Use barrier dressings on at-risk bony prominences"""),

s("pharmacology","pharmacology","Wound Care Products","""**Wound dressing selection by wound type:**

| Wound Characteristic | Dressing Type | Product Examples |
|---|---|---|
| Clean, minimally exudating | Transparent film | OpSite, Tegaderm — allows visualization, moisture retention |
| Moist wound bed, moderate exudate | Hydrocolloid | DuoDERM — absorbs exudate, moist healing environment |
| Heavily exudating | Foam dressing | Mepilex, Allevyn — high absorbency |
| Dry, necrotic tissue | Hydrogel | Intrasite Gel — adds moisture, promotes autolytic debridement |
| Infected wound | Antimicrobial: silver or iodine-containing | Mepilex Ag, Inadine |
| Tunneling/undermining | Alginate or packing | Kaltostat, iodoform packing strip |
| Stage 1 | Transparent film or barrier cream | OpSite, Cavilon |
| Stage 2 | Hydrocolloid or foam | DuoDERM, Mepilex |
| Stage 3–4 | Foam, alginate, hydrogel per wound bed | Varies by exudate level |

**Wound cleansing:**
- Normal saline or wound cleanser (Prontosan)
- Gentle pressure: 10–15 psi (use 35 mL syringe with 19G angiocath for irrigation)
- Do NOT use: hydrogen peroxide (damages granulation tissue), Betadine/povidone-iodine routinely (cytotoxic to healing tissue), full-strength chlorhexidine

**Debridement types:**
- Autolytic (safest): moisture-retentive dressings; body's own enzymes dissolve necrotic tissue; slowest
- Enzymatic: collagenase (Santyl) applied to eschar; requires prescription
- Sharp/surgical: fastest; provider or advanced wound care nurse"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Non-blanchable erythema = Stage 1** — the first visible sign; if untreated, progresses within hours in high-risk patients
- **Unstageable wounds may be stage 3 or 4 underneath** — do NOT underestimate; remove slough per wound care order to stage accurately
- **Heels are the #2 most common pressure injury site** — ALWAYS float heels by placing pillow under calf, not heel
- **30° lateral tilt, not 90° side-lying** — 90° concentrates pressure directly on the trochanter
- **Donut cushions are contraindicated** — they concentrate pressure on wound margins; use pressure-redistribution surfaces
- **Hydrogen peroxide damages granulation tissue** — use normal saline for wound cleansing
- **Stage once, then describe wound progress** — pressure injuries do NOT "reverse stage" from Stage 3 back to Stage 2; document wound progress (granulating, epithelializing) without changing the stage"""),

s("client_education","client_education","Patient Education","""**Pressure injury prevention at home:**
- Change position every 2 hours — use a timer if needed; avoid sitting or lying in the same position
- Inspect all bony areas daily: use a mirror for areas you cannot see (sacrum, heels)
- Keep skin clean and dry; apply moisturizer; use barrier cream if you have incontinence
- Eat enough protein and drink enough fluids — nutrition is essential for skin health
- Use your pressure-redistribution mattress/cushion as directed

**Wound care at home (if applicable):**
- Change dressings as instructed; wash hands thoroughly before and after
- Never use hydrogen peroxide or alcohol on wounds — these harm healing tissue
- Keep the wound moist as directed; avoid letting it dry out
- Report: increasing redness, swelling, warmth, new drainage, fever, or worsening pain"""),

s("case_study","case_study","Case Application","""**Scenario:** During morning care, the PN discovers a 2 cm × 2 cm area of dark purple, non-blanchable discoloration over the right heel of a patient who has been on bedrest for 5 days. The skin is intact but feels boggy compared to surrounding tissue. The patient is diabetic with peripheral neuropathy and reports no pain.

**PN Analysis:**
- Intact skin + non-blanchable deep purple discoloration + boggy feel = Deep Tissue Injury (DTI)
- No pain: peripheral neuropathy masks the typical early warning of pain
- High-risk: diabetes, immobility, peripheral neuropathy, likely poor perfusion to extremities
- DTI can rapidly evolve to Stage 3 or 4 despite optimal care

**PN actions:**
1. Document: location (right heel), size (2×2 cm), color (deep purple), skin integrity (intact), tissue feel (boggy), patient report (no pain)
2. Notify charge RN and/or wound care nurse — DTI requires prompt evaluation
3. Immediately implement heel offloading: pillow under calf, heel floated; do NOT apply pressure to heel
4. Place patient on pressure-redistribution mattress if not already
5. Reposition every 2 hours; document each turn
6. Reassess wound each shift — DTI may evolve rapidly
7. Notify provider: may order wound care consult, heel boot device, vascular assessment given diabetes
8. Educate patient: "This area on your heel is at risk of becoming a serious wound. We're doing everything possible to prevent this — but because of diabetes, it may still worsen even with excellent care." """)
],
"preTest":[
pt("A patient's sacral wound has full-thickness skin loss with visible subcutaneous tissue, but no bone, tendon, or muscle is exposed. The wound base has some yellow slough. What is the correct pressure injury stage?",["Stage 2","Stage 3","Stage 4","Unstageable"],1,"Stage 3 pressure injuries involve full-thickness skin loss with visible subcutaneous tissue. Fascia, bone, tendon, and muscle are not exposed. Slough may be present but does not obscure the depth. Stage 4 would expose bone, tendon, or muscle. Unstageable applies when slough or eschar covers the wound base and depth cannot be determined."),
pt("A nurse identifies a non-blanchable, dark red area of intact skin over a patient's coccyx that feels warmer and firmer than surrounding tissue. How should this be documented?",["Stage 1 pressure injury — non-blanchable erythema on intact skin","Deep tissue injury — discolored intact skin consistent with deep tissue damage","Stage 2 pressure injury — partial-thickness skin loss","Unstageable pressure injury — depth cannot be determined"]
,1,"Deep tissue injury (DTI) presents as persistent non-blanchable deep red, maroon, or purple discoloration of intact skin with possible changes in tissue consistency (boggy, firm, mushy, warmer/cooler). Stage 1 presents as non-blanchable erythema, typically red in light skin. DTI may rapidly evolve to an open wound, reflecting underlying tissue destruction."),
pt("Which Braden Scale subscale score indicates the greatest pressure injury risk?",["Sensory perception score of 4","Moisture score of 1","Activity score of 3","Friction/shear score of 2"],1,"In the Braden Scale, a lower score indicates greater risk. A moisture score of 1 means the patient's skin is constantly moist (maximum risk). Sensory perception score of 4 means no impairment (lowest risk). Activity score of 3 means walks occasionally (moderate). Friction/shear score of 2 means potential problem (moderate risk)."),
pt("A patient at risk for pressure injury is positioned at 90° lateral (full side-lying). Which correction is most appropriate?",["This is the correct position — no correction needed","Reposition to a 30-degree lateral tilt to reduce trochanteric pressure","Change the patient to prone position","Elevate the head of bed to 45 degrees instead"],1,"Ninety-degree lateral positioning places maximum pressure directly over the greater trochanter, a high-risk bony prominence. The recommended position is 30-degree lateral tilt using a foam wedge, which distributes pressure more evenly and reduces trochanteric loading while still providing pressure relief to the sacrum."),
pt("Which wound care product is appropriate for a Stage 2 pressure injury with a moist wound bed and minimal drainage?",["Hydrogen peroxide solution for cleansing the wound base","Hydrocolloid dressing to maintain moist healing environment","Dry gauze dressing changed every 4 hours","Povidone-iodine solution applied to the wound bed"],1,"Hydrocolloid dressings are appropriate for Stage 2 injuries with minimal-to-moderate drainage — they maintain a moist wound environment that promotes epithelialization, provide a protective barrier, and can stay in place 3–7 days. Hydrogen peroxide and povidone-iodine are cytotoxic to healing tissue. Dry gauze disrupts granulation tissue on removal and dries the wound bed.")
]
},

{
"slug":"us-pn-burns-skin-disorders",
"title":"Burns & Major Skin Disorders — PN Recognition & Care",
"topic":"Integumentary & Wound Care","topicSlug":"burns-skin-disorders","bodySystem":"Integumentary & Wound Care",
"previewSectionCount":2,
"seoTitle":"Burns Skin Disorders NCLEX-PN — burn depth, fluid resuscitation, Parkland formula, wound care",
"seoDescription":"NCLEX-PN burns: rule of nines, burn depth classification, Parkland formula fluid resuscitation, burn wound care, escharotomy indications, and common skin disorders for PN practice.",
"sections":[
s("introduction","introduction","Overview","""Burns are among the most severe injuries a patient can sustain. Even moderate burns require intensive nursing care. The PN must classify burn depth and extent, implement fluid resuscitation, provide wound care, manage pain, and recognize life-threatening complications. Beyond burns, common dermatological conditions (cellulitis, herpes zoster, psoriasis, contact dermatitis) are also assessed on NCLEX-PN.

**Annual US burn statistics:**
- ~485,000 burn injuries require medical attention annually
- ~40,000 require hospitalization
- Leading causes: flame (46%), scalding (32%), contact (8%), electrical (4%), chemical (3%)
- High-risk populations: children <5 years, elderly ≥65 years, occupational exposure"""),

s("pathophysiology_overview","pathophysiology_overview","Burn Classification","""**Burn depth:**

| Depth | Layer Affected | Appearance | Pain | Healing |
|---|---|---|---|---|
| Superficial (1st degree) | Epidermis only | Red, dry, no blisters | Painful | 3–7 days without scarring |
| Superficial partial-thickness (2nd degree) | Epidermis + superficial dermis | Red, moist, blisters | Very painful | 7–21 days, minimal scarring |
| Deep partial-thickness (2nd degree) | Epidermis + deep dermis | Pale/mottled, less moist | Decreased sensation (nerve damage) | >21 days, may need grafting |
| Full-thickness (3rd degree) | Through all skin layers | White/brown/black, leathery, dry | Painless (nerve destruction) | Cannot heal without grafting |
| 4th degree | Bone/muscle/tendon | Charred | Painless | Amputation may be needed |

**Estimating burn size (Total Body Surface Area — TBSA):**

Rule of Nines (adults):
- Head and neck: 9%
- Each arm: 9%
- Anterior trunk: 18%
- Posterior trunk: 18%
- Each leg: 18%
- Perineum: 1%

Lund-Browder chart: more accurate for children (head is larger proportionally in children)

**Palm method:** Patient's palm (including fingers) = approximately 1% TBSA — useful for scattered or irregular burns

**Major burns (require burn center referral):**
- Partial-thickness burns >10% TBSA in patients <10 or >50 years
- Partial-thickness burns >20% TBSA in other adults
- Any full-thickness burn
- Burns involving hands, feet, face, genitalia, perineum, or major joints
- Electrical burns
- Chemical burns
- Inhalation injury"""),

s("signs_symptoms","signs_symptoms","Inhalation Injury & Systemic Response","""**Inhalation injury — suspect in:**
- Burns occurring in enclosed spaces
- Facial burns, singed eyebrows/nasal hairs
- Carbonaceous sputum (black sputum)
- Hoarseness, stridor (upper airway edema)
- SpO₂ drop (CO poisoning — SpO₂ falsely reads normal; need co-oximetry)

**Carbon monoxide (CO) poisoning:**
- CO displaces O₂ on hemoglobin; pulse oximetry reads NORMAL (cannot distinguish CO-Hgb from O₂-Hgb)
- Carboxyhemoglobin (COHgb) level on ABG: >10% = significant; >25% = severe
- Signs: headache, confusion, cherry-red skin (late), seizures, death
- Treatment: 100% O₂ via non-rebreather mask

**Systemic burn response:**
- Initial (<24h): massive capillary leak → fluid shifts from intravascular to interstitium → burn shock (hypovolemia)
- 24–48h: fluid begins to reabsorb → diuresis (urine output increases dramatically)
- Hypermetabolism: stress response elevates metabolic rate 150–200% above baseline
- Infection: loss of skin barrier = primary infection risk; sepsis is leading cause of burn death

**Compartment syndrome in burns:**
- Circumferential burns of extremities or chest → edema → escharotomy (surgical incision through eschar) needed
- Chest wall burns → restricted ventilation → escharotomy of chest wall"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Fluid Resuscitation & Wound Care","""**Parkland Formula (fluid resuscitation):**
Total fluids in first 24 hours = 4 mL × Weight (kg) × % TBSA burned (partial + full thickness)
- Give HALF in first 8 hours (from time of burn, NOT time of arrival)
- Give remaining HALF over next 16 hours
- Fluid: Lactated Ringer's (LR) — NOT normal saline (LR more physiological, less hyperchloremia)

**Example:** 70 kg patient with 30% TBSA burn:
- Total = 4 × 70 × 30 = 8,400 mL LR in 24 hours
- First 8 hours: 4,200 mL; Next 16 hours: 4,200 mL

**Monitoring fluid resuscitation adequacy:**
- Urine output: BEST indicator — target 30–50 mL/hour adults (0.5 mL/kg/hr); 1 mL/kg/hr children
- Foley catheter mandatory for major burns
- If UO <30: increase fluids; if UO >50: decrease fluids

**Burn wound care:**
- Acute phase: gentle cleansing with mild soap/NS; remove loose devitalized tissue
- Topical antimicrobials:
  - Silver sulfadiazine (Silvadene): broad-spectrum; apply 1/16" thick; do NOT use in sulfa allergy; pseudoeschar formation
  - Mafenide (Sulfamylon): penetrates eschar; use for infected deep burns; painful on application; monitor for metabolic acidosis (carbonic anhydrase inhibitor)
  - Silver-containing dressings (Mepilex Ag, Aquacel Ag): maintain moisture; reduce frequency of dressing changes (less pain)
- Biologic dressings (for temporary coverage pending grafting): allograft, xenograft, amnion

**Pain management:**
- IV opioids (morphine, hydromorphone, fentanyl) — burns cause severe, prolonged pain
- Pre-medicate before dressing changes (anticipate procedural pain)
- Ketamine (sub-anesthetic dose): excellent for dressing change analgesia — dissociative effect
- Non-pharmacologic: distraction, virtual reality in advanced burn centers"""),

s("pharmacology","pharmacology","Common Skin Disorders & Treatment","""**Cellulitis:**
- Bacterial infection of dermis and subcutaneous tissue (Staph aureus, Group A Strep most common)
- Signs: spreading erythema, warmth, edema, tenderness; may have fever/chills
- Demarcate border with pen to track spread
- Treatment: oral antibiotics (mild: cephalexin, amoxicillin-clavulanate); IV if systemic (nafcillin, cefazolin)
- MRSA: doxycycline, TMP-SMX, vancomycin IV for severe

**Herpes Zoster (Shingles):**
- Reactivation of latent VZV in dorsal root ganglion
- Presentation: burning/tingling pain → unilateral vesicular rash along a dermatome (does NOT cross midline)
- Most painful: ophthalmic zoster (eye involvement) — urgent ophthalmology referral
- Contagious: airborne + contact precautions; VZV-naive individuals can develop chickenpox from contact
- Treatment: antivirals within 72 hours of rash onset (acyclovir, valacyclovir, famciclovir) — reduces duration and post-herpetic neuralgia severity
- Prevention: Shingrix vaccine (recommended age ≥50)

**Psoriasis:**
- Chronic autoimmune condition; rapid epidermal cell turnover → thick silvery scales on erythematous plaques
- Common sites: elbows, knees, scalp, lower back
- NOT contagious — educate patients and families
- Treatment: topical steroids, vitamin D analogs, tar preparations; biologics (TNF inhibitors) for moderate-severe

**Contact Dermatitis:**
- Irritant (most common): direct tissue damage (soaps, chemicals, urine, saliva)
- Allergic: type IV hypersensitivity (latex, nickel, poison ivy)
- Treatment: remove trigger, topical steroids, cool compresses, antihistamines for pruritus

**Topical corticosteroids — potency considerations:**
- High-potency (fluocinonide, clobetasol): NOT for face, skin folds, or infants (skin absorption risk)
- Low-potency (hydrocortisone 1%): safe for face and intertriginous areas"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Parkland formula: first HALF of fluid in first 8 hours from burn, not arrival** — time of burn is the reference point
- **Urine output is the best fluid resuscitation monitor** — target 30–50 mL/hour; adjust rate to maintain
- **Full-thickness burns are PAINLESS** — nerve endings destroyed; patient reports minimal pain = deep burn
- **CO poisoning: SpO₂ is FALSELY NORMAL** — the pulse oximeter cannot distinguish COHgb from OHgb; must get ABG with co-oximetry
- **Circumferential burns → escharotomy** — must cut through eschar to release compartment pressure; a complication unique to circumferential burns
- **Shingles does not cross the midline** — if rash is bilateral, consider other diagnosis; VZV reactivates in single dermatome
- **Silver sulfadiazine is contraindicated in sulfa allergy** — the "sulfa" in the name is a real concern; verify allergy before applying"""),

s("client_education","client_education","Patient Education","""**Home burn wound care (minor burns):**
- Cool (not cold or ice) water for 15–20 minutes immediately after burn — do NOT use ice (causes vasoconstriction and worsens injury)
- Do not break blisters — they protect the wound; if they break, clean gently with soap and water
- Apply antibiotic ointment (bacitracin) and a non-stick dressing
- Change dressing daily or when wet/soiled
- Call your provider: signs of infection (increasing pain, redness spreading, pus, fever), wound not healing in expected timeframe

**Shingles:**
- Your rash is contagious to people who have never had chickenpox — avoid contact with: pregnant women, immunocompromised individuals, newborns
- Take antiviral medication exactly as prescribed; start within 72 hours of rash appearance
- Keep the rash covered; do not touch blisters; wash hands frequently
- Post-herpetic neuralgia (nerve pain lasting after rash heals) can occur — your provider can prescribe medications if this develops

**Sun protection (after any skin condition):**
- SPF 30+ broad-spectrum sunscreen daily on healed skin — healing skin is especially sensitive to UV damage"""),

s("case_study","case_study","Case Application","""**Scenario:** A 35-year-old man weighing 80 kg presents after a house fire with flame burns to both anterior arms (9% total), anterior trunk (18%), and partial involvement of face. He was found in a burning room and has carbonaceous sputum, hoarseness, and singed nasal hair.

**Burn assessment:**
- Anterior arms: 9% TBSA
- Anterior trunk: 18% TBSA
- Face burns: included but TBSA percentage for face alone is partial
- Approximate major burn: ~30% TBSA

**Inhalation injury indicators present:** Carbonaceous sputum + hoarseness + singed nasal hair + enclosed space exposure → HIGH CONCERN for inhalation injury and CO poisoning.

**Priority actions:**
1. **Airway first:** Prepare for emergency intubation — hoarseness signals upper airway edema that will worsen rapidly; early intubation before complete obstruction
2. Apply 100% O₂ via NRB mask immediately
3. IV access × 2 large-bore; draw ABG with co-oximetry (not pulse oximetry — falsely normal in CO poisoning)
4. Begin Parkland formula: 4 × 80 × 30 = 9,600 mL LR in 24 hours; first 4,800 mL in first 8 hours from time of burn
5. Insert Foley catheter; target urine output 30–50 mL/hr; adjust fluid rate based on UO
6. Transfer to burn center — facial burns + inhalation injury + major burn = Level I burn center criteria
7. Pain management: IV opioids for severe pain during initial stabilization

**What the PN must NOT do:** Rely on pulse oximetry as a reliable O₂ indicator in this patient — CO poisoning is confirmed or ruled out only by co-oximetry ABG.""")
],
"preTest":[
pt("An 80 kg patient has burns covering both anterior legs (18% TBSA) and the anterior trunk (18% TBSA) — total 36% TBSA. Using the Parkland formula, how much Lactated Ringer's should be infused in the first 8 hours?",["5,760 mL","11,520 mL","2,880 mL","7,680 mL"],0,"Parkland formula: 4 mL × kg × %TBSA = 4 × 80 × 36 = 11,520 mL total in 24 hours. Half is given in the first 8 hours: 11,520 ÷ 2 = 5,760 mL. Note: this is calculated from time of burn, not time of hospital arrival."),
pt("A burn patient has full-thickness burns to both hands. The patient reports minimal pain in the burned areas. The nurse understands that:",["The burn may be less severe than it appears since pain indicates inflammation","Full-thickness burns destroy nerve endings, explaining the absence of pain","The patient has developed a high pain tolerance from the burn experience","Pain medication administered en route has fully controlled the pain"],1,"Full-thickness (third-degree) burns extend through all skin layers, destroying nerve endings responsible for pain sensation. Paradoxically, the most severe burns are often least painful. Surrounding partial-thickness burns remain very painful. This is a critical NCLEX concept — absence of pain in a burn does not mean the burn is minor."),
pt("A patient in a house fire has carbonaceous (black) sputum and a pulse oximetry reading of 98%. The nurse's priority action is:",["Document the finding and continue monitoring since SpO₂ is adequate","Obtain an ABG with co-oximetry immediately — SpO₂ is unreliable when carbon monoxide poisoning is suspected","Apply supplemental oxygen via nasal cannula as a precaution","Reassure the patient that the soot in the sputum will clear with coughing"],1,"Carbon monoxide (CO) binds hemoglobin with 250× the affinity of oxygen, forming carboxyhemoglobin (COHgb). Standard pulse oximetry cannot differentiate COHgb from oxyhemoglobin — readings appear falsely normal even with severe CO poisoning. The definitive assessment requires ABG with co-oximetry. Carbonaceous sputum + fire exposure = CO poisoning and inhalation injury until proven otherwise."),
pt("Which finding best indicates that fluid resuscitation is adequate in a major burn patient?",["Blood pressure greater than 120/80 mmHg","Urine output of 35 mL/hour","Heart rate below 100 beats per minute","Absence of thirst and dry mouth"],1,"Urine output is the gold standard for monitoring fluid resuscitation adequacy in burn patients. Target: 30–50 mL/hour (0.5 mL/kg/hr) in adults. A Foley catheter is inserted in all major burn patients. Blood pressure may be maintained by vasoconstriction despite inadequate organ perfusion. Heart rate is a late indicator. Thirst and dry mouth are unreliable in intubated or obtunded patients."),
pt("A patient develops shingles (herpes zoster) on the left thoracic dermatome. Which precaution is most important?",["Maintain contact precautions only — herpes zoster is not airborne","Implement airborne and contact precautions — susceptible individuals can develop chickenpox from direct contact with the vesicles","Notify all patients on the unit that they may have been exposed","Place the patient in positive-pressure isolation to protect their immune system"],1,"Herpes zoster lesions contain live VZV virus. The virus is spread by direct contact with vesicle fluid AND by airborne transmission from respiratory secretions in some disseminated cases. Both airborne AND contact precautions are required. Individuals who have never had chickenpox (varicella-naive) can contract primary varicella (chickenpox) from contact with shingles lesions.")
]
},
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
            print(f"  ADD: {lesson['slug']}")
            added += 1
        else:
            print(f"  SKIP: {lesson['slug']}")
    return added

if __name__ == "__main__":
    cat = load_catalog()
    n = apply(cat, "us-lpn-nclex-pn", LESSONS)
    save_catalog(cat)
    print(f"\nAdded {n}. us-lpn-nclex-pn total: {len(cat['pathways']['us-lpn-nclex-pn']['lessons'])}")
