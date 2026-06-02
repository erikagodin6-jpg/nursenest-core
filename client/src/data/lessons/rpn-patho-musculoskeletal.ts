import type { LessonContent } from "./types";

export const rpnPathoMusculoskeletalLessons: Record<string, LessonContent> = {
  "rpn-rheumatoid-arthritis": {
    title: "Rheumatoid Arthritis (RA)",
    cellular: {
      title: "Autoimmune Synovial Inflammation and Joint Destruction",
      content: "Rheumatoid arthritis (RA) is a chronic systemic autoimmune inflammatory disorder primarily affecting the synovial joints, characterized by symmetrical polyarthritis that leads to progressive joint destruction, deformity, and disability if untreated. The pathophysiology begins with loss of immune tolerance to self-antigens, particularly citrullinated proteins (proteins in which arginine residues are enzymatically converted to citrulline). The initiating trigger is unknown, but genetic susceptibility (HLA-DR4 shared epitope, present in 60-70% of RA patients) combined with environmental factors (smoking, periodontal disease, respiratory infections) activates autoreactive CD4+ T-cells and B-cells. Autoreactive B-cells produce rheumatoid factor (RF, an IgM antibody against the Fc portion of IgG) and anti-citrullinated protein antibodies (ACPA/anti-CCP), which form immune complexes that deposit in the synovium and activate complement, amplifying inflammation. The synovium — normally a thin membrane (1-2 cell layers) lining the joint capsule — becomes massively hypertrophied into a destructive tissue called pannus. Pannus formation involves proliferation of synovial fibroblasts and infiltration by macrophages, T-cells, B-cells, and plasma cells. These cells produce pro-inflammatory cytokines (TNF-α, IL-1, IL-6) that stimulate production of matrix metalloproteinases (MMPs, particularly MMP-1 and MMP-3) and RANKL (receptor activator of NF-κB ligand). MMPs degrade articular cartilage, while RANKL activates osteoclasts causing bone erosion. The pannus literally invades and destroys cartilage and subchondral bone at the cartilage-bone junction (marginal erosions). Over time, this causes joint space narrowing, subluxation, and characteristic deformities: ulnar deviation of fingers, swan-neck deformity, boutonniere deformity, and Z-deformity of the thumb. RA is a systemic disease — extra-articular manifestations include rheumatoid nodules, interstitial lung disease, pericarditis, vasculitis, Felty syndrome (splenomegaly + neutropenia), and accelerated atherosclerosis."
    },
    riskFactors: [
      "Female sex (2-3:1 female-to-male ratio)",
      "Age 30-60 years at onset",
      "Genetic predisposition (HLA-DR4, first-degree relative with RA)",
      "Smoking (strongest modifiable risk factor — increases risk 2-3x and worsens disease severity)",
      "Periodontal disease (Porphyromonas gingivalis produces citrullinated proteins)",
      "Obesity",
      "Silica dust exposure"
    ],
    diagnostics: [
      "RF (rheumatoid factor): positive in ~70-80% of RA (not specific — also elevated in other autoimmune diseases, infections, elderly)",
      "Anti-CCP (anti-citrullinated protein antibodies): more specific for RA than RF (~95% specificity)",
      "ESR and CRP: elevated (markers of systemic inflammation, used to monitor disease activity)",
      "CBC: may show anemia of chronic disease, thrombocytosis",
      "Joint X-rays: periarticular osteopenia, joint space narrowing, marginal erosions (later findings)",
      "Synovial fluid analysis if joint aspirated: inflammatory (elevated WBC, turbid appearance)"
    ],
    management: [
      "Early aggressive treatment with DMARDs is essential — 'window of opportunity' in first 3-6 months",
      "Methotrexate is FIRST-LINE DMARD (anchor drug for RA)",
      "Biologic DMARDs (TNF inhibitors, IL-6 inhibitors) for inadequate response to methotrexate",
      "Short-term low-dose corticosteroids as bridge therapy during DMARD initiation",
      "NSAIDs for symptomatic pain relief (do NOT alter disease progression)",
      "Physical and occupational therapy for joint protection and maintaining function",
      "Joint replacement surgery for severe joint destruction"
    ],
    nursingActions: [
      "Assess joint inflammation: warmth, swelling, tenderness, range of motion, grip strength",
      "Administer DMARDs as prescribed — monitor for side effects and adherence",
      "Teach joint protection strategies: use large joints for heavy tasks, avoid prolonged gripping, use assistive devices",
      "Encourage exercise during remission (swimming, low-impact) — rest during flares",
      "Apply heat for stiffness (morning stiffness is hallmark) and cold for acute inflammation",
      "Monitor for medication side effects: methotrexate (liver, blood counts, pulmonary fibrosis), biologics (infection risk)",
      "Assess for extra-articular manifestations: rheumatoid nodules, eye dryness, shortness of breath",
      "Provide emotional support — chronic painful disease significantly impacts quality of life and function"
    ],
    assessmentFindings: [
      "Symmetrical polyarthritis (same joints affected bilaterally — hallmark feature)",
      "Morning stiffness lasting >1 HOUR (distinguishes RA from OA which is <30 minutes)",
      "Warm, swollen, tender joints — particularly MCP and PIP joints of hands, wrists, and MTP joints of feet",
      "DIP joints typically SPARED (unlike OA which affects DIPs)",
      "Joint deformities in advanced disease: ulnar deviation, swan-neck, boutonniere",
      "Rheumatoid nodules (firm subcutaneous nodules over bony prominences)",
      "Fatigue, malaise, low-grade fever (systemic inflammation)",
      "Reduced grip strength"
    ],
    signs: {
      left: ["Symmetrical joint swelling", "Morning stiffness >1 hour", "MCP/PIP involvement", "Warm, tender joints"],
      right: ["Rheumatoid nodules", "Ulnar deviation", "Elevated RF/Anti-CCP", "Elevated ESR/CRP"]
    },
    medications: [
      { name: "Methotrexate", type: "DMARD (Antimetabolite/Immunomodulator)", action: "Inhibits dihydrofolate reductase and other folate-dependent enzymes, suppressing lymphocyte proliferation and reducing inflammatory cytokine production", sideEffects: "Hepatotoxicity (monitor LFTs), bone marrow suppression (monitor CBC), pulmonary fibrosis, stomatitis, teratogenic", contra: "Pregnancy (Category X — ABSOLUTE contraindication), liver disease, immunodeficiency, significant renal impairment", pearl: "FIRST-LINE DMARD for RA. Take ONCE WEEKLY (not daily — daily dosing is dangerous). Supplement with folic acid 1 mg daily to reduce side effects. Two reliable forms of contraception required during therapy." },
      { name: "Adalimumab (Humira)", type: "Biologic DMARD (TNF-α Inhibitor)", action: "Monoclonal antibody that binds and neutralizes TNF-α, a key pro-inflammatory cytokine driving RA synovitis and joint destruction", sideEffects: "Injection site reactions, increased infection risk (especially TB reactivation, opportunistic infections), rare lymphoma risk, demyelinating disease", contra: "Active infection, latent TB (must screen and treat before starting), moderate-to-severe heart failure", pearl: "Screen for TB with PPD or IGRA and hepatitis B/C BEFORE starting. Teach patients to report any signs of infection immediately. Live vaccines are contraindicated during therapy." },
      { name: "Prednisone", type: "Corticosteroid (Bridge Therapy)", action: "Potent anti-inflammatory: suppresses NF-κB pathway, reducing cytokine production, prostaglandin synthesis, and leukocyte migration", sideEffects: "Cushingoid features, osteoporosis, hyperglycemia, immunosuppression, GI ulceration, adrenal suppression with chronic use", contra: "Active untreated infections, live vaccines", pearl: "Used as BRIDGE therapy while waiting for DMARDs to take effect (methotrexate takes 4-12 weeks). Goal is lowest effective dose for shortest duration. Must TAPER — never stop abruptly after >2 weeks of use." }
    ],
    pearls: [
      "RA = SYMMETRICAL joints, morning stiffness >1 HOUR, MCP/PIP involvement, DIP SPARED",
      "OA = ASYMMETRICAL, stiffness <30 minutes, DIP involvement (Heberden nodes), bony enlargement",
      "Methotrexate is taken ONCE WEEKLY — taking it daily is a serious medication error",
      "Early aggressive DMARD therapy (within 3-6 months of symptom onset) dramatically improves long-term outcomes",
      "TNF inhibitors require TB screening BEFORE initiation — reactivation of latent TB is a known risk",
      "Morning stiffness >1 hour is a key distinguishing feature — always ask about duration"
    ],
    quiz: [
      { question: "Which feature best differentiates rheumatoid arthritis from osteoarthritis?", options: ["Joint pain", "Reduced range of motion", "Symmetrical joint involvement with morning stiffness lasting >1 hour", "Joint crepitus"], correct: 2, rationale: "RA is characterized by symmetrical polyarthritis (same joints on both sides) with prolonged morning stiffness (>1 hour). OA is typically asymmetrical with brief morning stiffness (<30 minutes), affects weight-bearing joints and DIPs, and has bony enlargement rather than soft tissue swelling." },
      { question: "A client is prescribed methotrexate for RA. Which instruction is critical?", options: ["Take the medication daily with meals", "Take the medication ONCE WEEKLY on the same day — daily dosing can be lethal", "The medication will start working within 24 hours", "No monitoring is needed once the dose is established"], correct: 1, rationale: "Methotrexate for RA is dosed ONCE WEEKLY. Taking it daily is a dangerous and potentially fatal medication error that can cause severe bone marrow suppression, hepatotoxicity, and mucositis. Patients must clearly understand the weekly dosing schedule." }
    ]
  },

  "rpn-osteoarthritis": {
    title: "Osteoarthritis (OA)",
    cellular: {
      title: "Degenerative Cartilage Loss and Joint Remodeling",
      content: "Osteoarthritis (OA) is the most common form of arthritis and the leading cause of chronic disability in older adults. It is a degenerative joint disease characterized by progressive loss of articular cartilage, subchondral bone remodeling, osteophyte formation, and synovial inflammation. Historically viewed as simple 'wear and tear,' OA is now understood as an active, complex disease involving biochemical, mechanical, and inflammatory processes. Normal articular (hyaline) cartilage is a remarkable avascular, aneural tissue composed of chondrocytes embedded in an extracellular matrix of type II collagen (providing tensile strength) and proteoglycans, particularly aggrecan (providing compressive resilience through water retention). Chondrocytes maintain cartilage homeostasis by balancing matrix synthesis and degradation. In OA, this homeostasis is disrupted. Mechanical stress (from obesity, joint malalignment, or repetitive use) and biochemical factors trigger chondrocytes to produce excessive matrix metalloproteinases (MMP-1, MMP-3, MMP-13) and aggrecanases (ADAMTS-4, ADAMTS-5) that degrade the collagen and proteoglycan matrix faster than it can be replaced. As cartilage thins, its biomechanical properties deteriorate: reduced water content, loss of proteoglycans, and collagen fiber disruption create fissures, fibrillation, and eventually full-thickness cartilage loss exposing subchondral bone. The exposed subchondral bone responds by becoming sclerotic (dense and hardened) and forming osteophytes (bony spurs) at joint margins — the body's attempt to redistribute mechanical load over a wider surface area. Subchondral cysts may develop from synovial fluid intrusion into microfractures. While OA is not primarily an inflammatory disease, low-grade synovial inflammation occurs as cartilage degradation products activate the innate immune system, releasing IL-1β, TNF-α, and prostaglandins that further accelerate cartilage destruction and produce joint effusion. Pain in OA arises from subchondral bone, periosteum, synovium, and periarticular structures — the cartilage itself has no nerve supply."
    },
    riskFactors: [
      "Age >50 years (strongest risk factor — prevalence increases dramatically with age)",
      "Obesity (most important modifiable risk factor — each 5 kg of excess weight increases knee OA risk by 36%)",
      "Joint injury or surgery (ACL tear, meniscal injury)",
      "Repetitive occupational joint stress (kneeling, heavy lifting)",
      "Female sex (higher prevalence after age 50, especially knee and hand OA)",
      "Genetics (family history, specific collagen gene polymorphisms)",
      "Joint malalignment (varus/valgus deformity)",
      "Muscle weakness (quadriceps weakness predisposes to knee OA)"
    ],
    diagnostics: [
      "X-ray findings: joint space narrowing, osteophyte formation, subchondral sclerosis, subchondral cysts",
      "Primarily a clinical diagnosis: history + physical exam + imaging",
      "Blood tests (RF, anti-CCP, ESR, CRP) are NORMAL in OA — used to exclude RA",
      "Joint aspiration if effusion present: non-inflammatory synovial fluid (WBC <2,000, clear/yellow)",
      "MRI for detailed cartilage assessment if surgical planning is needed"
    ],
    management: [
      "Weight management (5-10% weight loss significantly reduces knee pain and improves function)",
      "Exercise: strengthening (especially quadriceps for knee OA), low-impact aerobic (swimming, cycling), ROM exercises",
      "Acetaminophen or topical NSAIDs as first-line pharmacotherapy",
      "Oral NSAIDs (lowest effective dose, shortest duration) if acetaminophen insufficient",
      "Intra-articular corticosteroid injections for acute flares (limit to 3-4 per year per joint)",
      "Assistive devices: cane (used in OPPOSITE hand to affected knee/hip), braces, orthotics",
      "Joint replacement (TKA or THA) for severe end-stage OA unresponsive to conservative management"
    ],
    nursingActions: [
      "Assess pain severity, location, and impact on function using validated tools",
      "Encourage weight management — counsel on realistic weight loss goals and resources",
      "Teach appropriate exercise: balance rest with activity, avoid high-impact exercise during flares",
      "Administer medications as prescribed — educate on NSAID risks (GI bleeding, renal, cardiovascular)",
      "Apply heat for stiffness (morning/after rest) and ice for acute inflammation after activity",
      "Assess for need for assistive devices — refer to OT/PT for proper fitting",
      "Teach joint protection: avoid activities that stress affected joints, use proper body mechanics",
      "Post-operative care for joint replacement: DVT prophylaxis, early mobilization, PT adherence, incision assessment"
    ],
    assessmentFindings: [
      "Joint pain worsened by activity, improved by rest (opposite of RA morning stiffness pattern)",
      "Brief morning stiffness (<30 minutes) or stiffness after inactivity ('gelling')",
      "Crepitus (grating/crackling sound with joint movement)",
      "Bony enlargement: Heberden nodes (DIP joints) and Bouchard nodes (PIP joints) — specific to OA",
      "Reduced range of motion",
      "Joint effusion (non-inflammatory)",
      "Commonly affected joints: knees, hips, DIP joints of hands, first CMC joint, cervical/lumbar spine",
      "NO systemic symptoms (no fever, no fatigue, no weight loss)"
    ],
    signs: {
      left: ["Activity-related pain", "Brief stiffness (<30 min)", "Crepitus", "Bony enlargement"],
      right: ["Heberden nodes (DIP)", "Bouchard nodes (PIP)", "Reduced ROM", "Normal blood work"]
    },
    medications: [
      { name: "Acetaminophen", type: "Analgesic (Non-Anti-inflammatory)", action: "Inhibits central prostaglandin synthesis providing pain relief without peripheral anti-inflammatory effects", sideEffects: "Hepatotoxicity with overdose (max 3-4 g/day in healthy adults, 2 g/day in liver disease or elderly)", contra: "Severe liver disease, chronic alcohol use", pearl: "FIRST-LINE for OA. No anti-inflammatory effect, but adequate for mild-moderate OA pain with lower risk profile than NSAIDs. TEACH: max daily dose, check ALL medications for hidden acetaminophen." },
      { name: "Diclofenac Topical Gel", type: "Topical NSAID", action: "Inhibits cyclooxygenase at the local site, reducing prostaglandin-mediated pain and inflammation in the superficial joint", sideEffects: "Local skin irritation, rash", contra: "Open wounds, NSAID allergy", pearl: "Preferred for knee and hand OA — delivers local anti-inflammatory effect with minimal systemic absorption (lower GI and renal risk than oral NSAIDs)." },
      { name: "Naproxen", type: "Oral NSAID", action: "Non-selective COX inhibitor reducing prostaglandin synthesis, providing both analgesic and anti-inflammatory effects", sideEffects: "GI bleeding/ulceration, renal impairment, cardiovascular risk (increased MI/stroke risk), fluid retention", contra: "Active GI bleeding, severe renal impairment, CABG surgery within 14 days, third trimester pregnancy", pearl: "Use lowest effective dose for shortest duration. Take with food. Consider concurrent PPI (omeprazole) for GI protection in patients >65 or with GI risk factors." }
    ],
    pearls: [
      "OA = MECHANICAL pain (worse with USE, better with REST). RA = INFLAMMATORY pain (worse with REST, better with USE)",
      "Weight loss is the MOST effective non-pharmacologic intervention for knee OA — every 1 kg lost = 4 kg less force on the knee",
      "Heberden nodes (DIP) and Bouchard nodes (PIP) are SPECIFIC to OA — never seen in RA (which spares DIPs)",
      "Cane should be used in the OPPOSITE hand from the affected hip or knee — reduces joint load by up to 60%",
      "OA blood work is NORMAL — if ESR, CRP, RF, or anti-CCP are elevated, consider inflammatory arthritis",
      "Unlike RA, OA is NOT a systemic disease — no fever, no fatigue, no weight loss, no organ involvement"
    ],
    quiz: [
      { question: "In which hand should a client with right knee OA use a cane?", options: ["Right hand", "Left hand (opposite side)", "Either hand", "A cane is not recommended for knee OA"], correct: 1, rationale: "A cane should be used in the hand OPPOSITE to the affected lower extremity. This biomechanical principle shifts the center of gravity and reduces the load on the affected joint by up to 60%, decreasing pain and improving gait stability." },
      { question: "Which finding distinguishes OA from RA on physical examination of the hands?", options: ["Joint tenderness", "Reduced grip strength", "Heberden nodes at the DIP joints", "Joint swelling"], correct: 2, rationale: "Heberden nodes (bony enlargements at the DIP joints) are pathognomonic for OA. RA characteristically spares the DIP joints and affects the MCP and PIP joints. Bouchard nodes at the PIP joints also occur in OA but are not as specific as Heberden nodes." }
    ]
  },

  "rpn-osteoporosis": {
    title: "Osteoporosis",
    cellular: {
      title: "Bone Resorption Exceeding Bone Formation",
      content: "Osteoporosis is a systemic skeletal disorder characterized by reduced bone mineral density (BMD) and deterioration of bone microarchitecture, leading to increased bone fragility and susceptibility to fractures. The pathophysiology centers on the disruption of bone remodeling — a continuous lifelong process in which osteoclasts (bone-resorbing cells) and osteoblasts (bone-forming cells) work in coupled sequences to replace old bone with new bone. Bone remodeling is regulated by the RANK/RANKL/OPG signaling axis. Osteoblasts and bone marrow stromal cells produce RANKL (receptor activator of nuclear factor kappa-B ligand), which binds to RANK receptors on osteoclast precursors, stimulating their differentiation into mature osteoclasts and promoting bone resorption. Osteoblasts also produce osteoprotegerin (OPG), a decoy receptor that binds RANKL, preventing it from activating RANK and thus inhibiting osteoclast formation. The RANKL-to-OPG ratio determines the balance between resorption and formation. In osteoporosis, this balance tips toward resorption. Estrogen is a critical regulator — it suppresses RANKL production and stimulates OPG production in osteoblasts, and promotes osteoclast apoptosis. When estrogen levels decline (menopause), RANKL increases, OPG decreases, osteoclast activity and lifespan increase, and bone resorption accelerates dramatically. In the first 5-7 years after menopause, women can lose 3-5% of bone mass per year. Peak bone mass (achieved by age 25-30) determines lifetime fracture risk — higher peak bone mass provides a greater 'bone bank' to draw from during age-related decline. BMD is measured by dual-energy X-ray absorptiometry (DXA) and reported as a T-score (standard deviations from peak young adult bone density): normal is >-1.0, osteopenia is -1.0 to -2.5, and osteoporosis is ≤-2.5. Fractures most commonly occur at the vertebral body (compression fractures causing kyphosis/'dowager's hump'), proximal femur (hip fractures — 20-30% one-year mortality in elderly), and distal radius (Colles fracture from FOOSH injury)."
    },
    riskFactors: [
      "Female sex (80% of osteoporosis occurs in women — estrogen deficiency is primary driver)",
      "Age >65 years (bone loss accelerates with aging)",
      "Early menopause (<45 years) or surgical oophorectomy",
      "Low body weight/BMI (<19)",
      "Caucasian or Asian ancestry",
      "Family history of osteoporosis or hip fracture",
      "Sedentary lifestyle",
      "Chronic corticosteroid use (>3 months of ≥5 mg prednisone daily — most common secondary cause)",
      "Smoking, excessive alcohol (>3 drinks/day)",
      "Calcium or vitamin D deficiency",
      "Conditions: hyperthyroidism, hyperparathyroidism, Cushing syndrome, celiac disease, anorexia nervosa"
    ],
    diagnostics: [
      "DXA scan (dual-energy X-ray absorptiometry): GOLD STANDARD for bone density measurement",
      "T-score interpretation: ≤-2.5 = osteoporosis, -1.0 to -2.5 = osteopenia, >-1.0 = normal",
      "FRAX score (Fracture Risk Assessment Tool): estimates 10-year fracture probability using clinical risk factors + BMD",
      "Serum calcium, phosphate, vitamin D (25-OH), PTH to exclude secondary causes",
      "TSH to exclude hyperthyroidism as contributing factor",
      "CBC, renal function, liver function as baseline",
      "Spine X-ray if vertebral fracture suspected (height loss, kyphosis, back pain)"
    ],
    management: [
      "Adequate calcium intake: 1000-1200 mg/day (food sources preferred, supplement if needed)",
      "Vitamin D supplementation: 800-2000 IU/day (maintain 25-OH vitamin D >75 nmol/L)",
      "Weight-bearing exercise: walking, jogging, dancing, resistance training (stimulates osteoblast activity)",
      "Bisphosphonate therapy (alendronate, risedronate) as first-line pharmacotherapy",
      "Denosumab for patients who cannot tolerate bisphosphonates",
      "Fall prevention: home safety assessment, vision correction, medication review, balance training",
      "Smoking cessation and limit alcohol consumption",
      "Correct reversible secondary causes"
    ],
    nursingActions: [
      "Implement comprehensive fall prevention: remove tripping hazards, adequate lighting, non-slip footwear, grab bars, assistive devices",
      "Teach proper bisphosphonate administration: take first thing in morning on empty stomach with FULL glass of water, remain UPRIGHT for 30-60 minutes",
      "Assess for height loss and kyphosis (may indicate vertebral compression fracture)",
      "Educate on calcium-rich diet: dairy products, fortified foods, dark leafy greens",
      "Encourage weight-bearing exercise — walking 30 minutes most days of the week",
      "Assess for medication side effects: GI irritation (bisphosphonates), jaw pain (osteonecrosis of jaw — rare but serious)",
      "Monitor for fragility fractures: fractures from minimal trauma (fall from standing height)",
      "Educate on avoiding activities with high fracture risk: heavy lifting, twisting, bending"
    ],
    assessmentFindings: [
      "Often ASYMPTOMATIC until fracture occurs (silent disease)",
      "Height loss (>2 cm since young adulthood suggests vertebral compression fractures)",
      "Thoracic kyphosis ('dowager's hump' from multiple vertebral compression fractures)",
      "Back pain (acute vertebral fracture or chronic from spinal deformity)",
      "Fragility fracture: fracture from minimal trauma (fall from standing height or less)",
      "Common fracture sites: vertebral body, proximal femur (hip), distal radius (wrist)"
    ],
    signs: {
      left: ["Height loss", "Kyphosis", "Back pain", "Fragility fractures"],
      right: ["T-score ≤-2.5", "Silent until fracture", "Common sites: hip, spine, wrist", "Risk factors present"]
    },
    medications: [
      { name: "Alendronate (Fosamax)", type: "Bisphosphonate (Antiresorptive)", action: "Binds to hydroxyapatite in bone, is internalized by osteoclasts during resorption, and inhibits farnesyl pyrophosphate synthase in the mevalonate pathway, causing osteoclast apoptosis and reducing bone resorption", sideEffects: "Esophageal irritation/ulceration (most common), GI upset, musculoskeletal pain, osteonecrosis of jaw (rare), atypical femur fracture (rare with long-term use >5 years)", contra: "Esophageal abnormalities, inability to stand/sit upright for 30-60 minutes, hypocalcemia, severe renal impairment (CrCl <35)", pearl: "Take FIRST thing in morning on EMPTY stomach with FULL glass of PLAIN water (not juice, coffee, or mineral water). Remain UPRIGHT (sitting or standing) for 30-60 minutes. Do NOT lie down or eat/drink anything else for 30 min. Dental clearance before starting." },
      { name: "Denosumab (Prolia)", type: "RANKL Inhibitor (Monoclonal Antibody)", action: "Binds RANKL, preventing it from activating RANK on osteoclast precursors, dramatically reducing osteoclast formation and bone resorption", sideEffects: "Hypocalcemia, skin infections (cellulitis), osteonecrosis of jaw (rare), atypical femur fracture (rare), rebound vertebral fractures if discontinued", contra: "Hypocalcemia (must correct before starting)", pearl: "Given as subcutaneous injection every 6 months. Must NOT be abruptly discontinued — rebound bone loss and vertebral fractures can occur. Ensure adequate calcium and vitamin D supplementation." },
      { name: "Calcium Carbonate + Vitamin D3", type: "Nutritional Supplement", action: "Calcium provides substrate for bone mineralization; vitamin D enhances intestinal calcium absorption and regulates calcium-phosphate homeostasis", sideEffects: "Constipation, kidney stones (with excessive supplementation), hypercalcemia", contra: "Hypercalcemia, hyperparathyroidism, kidney stones", pearl: "Take calcium CARBONATE with meals (needs gastric acid for absorption). Take calcium CITRATE without meals. Separate calcium from bisphosphonate by ≥30 min. Maximum absorption is ~500 mg per dose — split doses." }
    ],
    pearls: [
      "Osteoporosis is a SILENT disease — no symptoms until fracture occurs. Screening is essential.",
      "Bisphosphonate administration: empty stomach, full glass of plain water, upright 30-60 minutes — incorrect technique = esophageal injury",
      "Hip fractures have 20-30% ONE-YEAR mortality in the elderly — prevention through fall prevention and treatment is critical",
      "Weight-bearing exercise BUILDS bone; non-weight-bearing (swimming, cycling) does NOT — must include walking or resistance training",
      "Denosumab must NEVER be abruptly stopped — rebound vertebral fractures can occur. Must transition to a bisphosphonate.",
      "Fall prevention is as important as pharmacotherapy — most fractures result from falls, not spontaneous events"
    ],
    quiz: [
      { question: "A client is prescribed alendronate. Which instruction is essential for safe administration?", options: ["Take with breakfast and a glass of milk for calcium absorption", "Take first thing in morning on empty stomach with full glass of water and remain upright for 30 minutes", "Take at bedtime lying down for maximum absorption", "Take with an antacid to reduce GI irritation"], correct: 1, rationale: "Bisphosphonates must be taken on an empty stomach with a full glass of plain water to maximize absorption (food and calcium reduce absorption by >90%). Remaining upright for 30-60 minutes prevents esophageal irritation and ulceration, a serious adverse effect." },
      { question: "Which type of exercise best promotes bone density in a client with osteoporosis?", options: ["Swimming", "Water aerobics", "Weight-bearing exercise such as walking and resistance training", "Seated stretching"], correct: 2, rationale: "Weight-bearing exercises (walking, jogging, dancing) and resistance training stimulate osteoblast activity through mechanical loading of bone (Wolff's law: bone adapts to the loads placed upon it). Swimming and water aerobics, while excellent for cardiovascular fitness, are non-weight-bearing and do not provide the mechanical stimulus needed for bone formation." }
    ]
  },

  "rpn-septic-arthritis": {
    title: "Septic Arthritis",
    cellular: {
      title: "Bacterial Joint Infection and Cartilage Destruction",
      content: "Septic arthritis (infectious arthritis) is a medical emergency caused by direct bacterial invasion of the synovial joint space, requiring urgent treatment to prevent irreversible joint destruction. The most common causative organism is Staphylococcus aureus (accounting for >50% of all cases in adults), followed by streptococci, gram-negative bacilli (in IV drug users and immunocompromised), and Neisseria gonorrhoeae (in sexually active young adults). Bacteria reach the joint through three routes: hematogenous spread (most common — bacteremia seeds the highly vascular synovium), direct inoculation (trauma, surgery, joint injection), or contiguous spread from adjacent osteomyelitis or soft tissue infection. The synovial membrane is a highly vascular tissue that lacks a basement membrane, making it particularly susceptible to hematogenous bacterial seeding. Once bacteria enter the joint space, they adhere to synovial tissue and articular cartilage using surface adhesins. The innate immune system responds with a massive inflammatory cascade: neutrophils flood the joint space (joint fluid WBC often >50,000/µL with >75% neutrophils), producing purulent effusion. These activated neutrophils release destructive proteases (elastase, collagenase) and reactive oxygen species that damage articular cartilage. Simultaneously, bacterial enzymes, inflammatory cytokines (IL-1β, TNF-α), and increased intra-articular pressure from effusion further compromise the avascular cartilage. Cartilage destruction can begin within 48 hours and becomes irreversible by 7-10 days — hence the urgency of diagnosis and treatment. The knee is the most commonly affected joint (>50%), followed by hip, shoulder, wrist, and ankle. Prosthetic joint infection is a particularly devastating complication, often requiring implant removal."
    },
    riskFactors: [
      "Pre-existing joint disease (RA, OA — damaged joints are more susceptible)",
      "Prosthetic joint (biofilm formation on implant surfaces)",
      "Immunocompromised state (diabetes, HIV, chronic steroid use, alcoholism)",
      "IV drug use",
      "Recent joint surgery or injection",
      "Skin breakdown or infection (cellulitis providing portal of entry)",
      "Advanced age",
      "Bacteremia from any source"
    ],
    diagnostics: [
      "Joint aspiration (arthrocentesis) is MANDATORY — gold standard for diagnosis",
      "Synovial fluid analysis: WBC >50,000/µL with >75% neutrophils (purulent), Gram stain (positive in ~50-75%), culture (gold standard for organism identification)",
      "Blood cultures (positive in ~50% of cases — draw before antibiotics)",
      "CBC: elevated WBC with left shift",
      "ESR and CRP: markedly elevated",
      "X-ray: initially normal (soft tissue swelling, joint effusion); later shows joint space narrowing, erosions",
      "MRI or ultrasound for deep joints (hip) or if diagnosis uncertain"
    ],
    management: [
      "MEDICAL EMERGENCY — empiric IV antibiotics IMMEDIATELY after joint aspiration",
      "Empiric antibiotic therapy: vancomycin (MRSA coverage) ± ceftriaxone or cefepime (gram-negative coverage)",
      "Joint drainage: repeated needle aspiration or surgical drainage (arthroscopic or open) — especially for hip and prosthetic joints",
      "Prolonged IV antibiotics: typically 2-4 weeks IV then transition to oral (total 4-6 weeks)",
      "Joint immobilization initially for pain, followed by early ROM exercises to prevent contracture",
      "Prosthetic joint infection often requires implant removal (one-stage or two-stage exchange)"
    ],
    nursingActions: [
      "Assess the affected joint: degree of swelling, warmth, redness, pain with any movement (even passive ROM)",
      "Monitor vital signs for signs of sepsis (fever, tachycardia, hypotension)",
      "Administer IV antibiotics as prescribed — maintain scheduled timing",
      "Assess pain and provide pain management — the joint is exquisitely painful",
      "Monitor for compartment syndrome if significant joint swelling (especially knee)",
      "Immobilize joint initially for comfort, then assist with prescribed ROM exercises",
      "Monitor laboratory values: WBC, ESR, CRP trending down indicates treatment response",
      "Strict aseptic technique for any wound care or drain management"
    ],
    assessmentFindings: [
      "Acute onset monoarthritis (usually single joint affected)",
      "Joint is hot, swollen, erythematous, and exquisitely tender",
      "Severe pain with ANY movement, including passive range of motion (distinguishes from gout which hurts but tolerates some movement)",
      "Fever and systemic toxicity",
      "Refusal to bear weight or move the affected extremity",
      "In children: refusal to walk, pseudoparalysis of the limb",
      "In hip infection: pain referred to groin, held in flexed and externally rotated position"
    ],
    signs: {
      left: ["Acute swollen hot joint", "Exquisite tenderness", "Fever/systemic toxicity", "Refusal to bear weight"],
      right: ["WBC >50,000 in joint fluid", "Positive Gram stain/culture", "Elevated ESR/CRP", "Usually monoarticular"]
    },
    medications: [
      { name: "Vancomycin IV", type: "Glycopeptide Antibiotic", action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala; provides coverage for MRSA and other resistant gram-positive organisms", sideEffects: "Red man syndrome, nephrotoxicity, ototoxicity", contra: "Severe allergy", pearl: "First-line empiric coverage for septic arthritis until culture results available. Monitor trough levels (15-20 mcg/mL for serious infections) and renal function." },
      { name: "Cefazolin IV", type: "First-Generation Cephalosporin", action: "Bactericidal — inhibits cell wall synthesis; excellent coverage for MSSA (methicillin-sensitive S. aureus)", sideEffects: "Hypersensitivity, diarrhea, C. difficile", contra: "Severe penicillin allergy with anaphylaxis history", pearl: "Switch from vancomycin to cefazolin once MSSA is confirmed — better outcomes and less nephrotoxicity than vancomycin for susceptible organisms." }
    ],
    pearls: [
      "Septic arthritis is a JOINT EMERGENCY — cartilage destruction begins within 48 hours if untreated",
      "Hot, swollen joint + fever = septic arthritis until proven otherwise — aspirate the joint BEFORE antibiotics if possible",
      "S. aureus is the most common cause in adults. N. gonorrhoeae in sexually active young adults.",
      "The knee is most commonly affected (>50% of cases)",
      "Pain with passive ROM differentiates septic arthritis from other inflammatory joint conditions — septic joints hurt with ANY movement",
      "Prosthetic joint infections are devastating — prevention through perioperative antibiotics is critical"
    ],
    quiz: [
      { question: "A client presents with an acutely swollen, hot, red right knee with fever of 39.2°C and severe pain with any movement. What is the priority intervention?", options: ["Apply ice and elevate the leg", "Obtain X-ray of the knee", "Aspirate the joint for synovial fluid analysis and start empiric IV antibiotics", "Start oral antibiotics and reassess in 48 hours"], correct: 2, rationale: "An acutely inflamed joint with fever requires urgent arthrocentesis to diagnose or exclude septic arthritis. Synovial fluid analysis (WBC, Gram stain, culture) guides definitive treatment. Empiric IV (not oral) antibiotics should be started immediately after aspiration — cartilage destruction is irreversible if treatment is delayed." }
    ]
  },

  "rpn-osteomyelitis": {
    title: "Osteomyelitis",
    cellular: {
      title: "Bone Infection and Inflammatory Bone Destruction",
      content: "Osteomyelitis is an infection of bone and bone marrow caused by microorganisms, most commonly Staphylococcus aureus. The infection leads to progressive inflammatory destruction of bone tissue, bone necrosis, and new bone formation. The pathophysiology differs by route of infection and patient age. Hematogenous osteomyelitis occurs when bacteria in the bloodstream seed bone tissue — most common in children (long bone metaphyses, particularly tibia and femur) and in vertebral bodies in adults. Contiguous-focus osteomyelitis results from direct spread from adjacent soft tissue infection, open fracture, or surgical contamination — more common in adults. Diabetic foot osteomyelitis represents a special category where neuropathy, vascular insufficiency, and chronic soft tissue infection predispose to bone invasion. Once bacteria reach bone, S. aureus adheres to bone matrix proteins (collagen, fibronectin, bone sialoprotein) using surface adhesins (microbial surface components recognizing adhesive matrix molecules, or MSCRAMMs). It then invades osteoblasts, surviving intracellularly and evading immune responses and antibiotics. The inflammatory response brings neutrophils and macrophages that release destructive enzymes and reactive oxygen species, causing bone necrosis. Dead bone (sequestrum) becomes a haven for bacteria, as it has no blood supply and therefore no antibiotic delivery or immune cell access. The periosteum responds by forming new bone around the infection (involucrum), creating a shell of new bone around dead infected bone. Draining sinuses (cloaca) may form through the involucrum, draining purulent material to the skin surface. This interplay of bone death, bacterial persistence, and inadequate antibiotic penetration is why chronic osteomyelitis is extraordinarily difficult to eradicate and often requires surgical debridement of dead bone in addition to prolonged antibiotic therapy (typically 4-6 weeks IV antibiotics). Biofilm formation — where bacteria encase themselves in a protective polysaccharide matrix on bone and implant surfaces — further shields organisms from antibiotics and immune defenses, contributing to treatment failure and chronicity."
    },
    riskFactors: [
      "Diabetes mellitus (especially with peripheral neuropathy and vascular disease)",
      "Peripheral vascular disease",
      "Open fractures or penetrating trauma to bone",
      "Orthopedic hardware or prosthetic joints",
      "IV drug use (unusual organisms and sites — vertebral osteomyelitis)",
      "Immunocompromised state (HIV, chemotherapy, chronic steroid use)",
      "Sickle cell disease (Salmonella osteomyelitis is characteristic)",
      "Chronic wounds (pressure injuries, diabetic ulcers overlying bone)",
      "Recent orthopedic surgery"
    ],
    diagnostics: [
      "MRI is the BEST imaging modality (sensitivity and specificity >90% for osteomyelitis)",
      "X-ray: may be normal in first 10-14 days; later shows periosteal elevation, bone destruction, sequestra",
      "ESR and CRP: elevated (CRP responds faster and is more specific; used to monitor treatment response)",
      "Blood cultures: positive in ~50% of hematogenous cases",
      "Bone biopsy with culture: GOLD STANDARD for definitive diagnosis and organism identification",
      "Probe-to-bone test in diabetic foot ulcers (positive if probe touches bone through the ulcer — 89% positive predictive value)",
      "WBC count: may be elevated with left shift"
    ],
    management: [
      "Prolonged IV antibiotic therapy: typically 4-6 weeks for acute osteomyelitis",
      "Empiric therapy: vancomycin for MRSA coverage until culture-directed therapy available",
      "Surgical debridement of necrotic bone (sequestrum removal) for chronic osteomyelitis",
      "Hardware removal if prosthetic device is involved",
      "Wound care and soft tissue coverage (flaps for exposed bone)",
      "Diabetic foot: offloading, vascular assessment, glycemic control, multidisciplinary team approach",
      "Hyperbaric oxygen therapy may be adjunctive in refractory cases"
    ],
    nursingActions: [
      "Administer IV antibiotics as prescribed — maintain consistent timing for optimal drug levels",
      "Assess the affected area: pain, swelling, warmth, erythema, drainage, wound characteristics",
      "Monitor PICC line or central line site (long-term IV access for 4-6 weeks of antibiotics)",
      "Assess neurovascular status of affected extremity",
      "Implement wound care as prescribed — maintain strict aseptic technique",
      "Monitor laboratory values: WBC, ESR, CRP trending down indicates response to treatment",
      "Educate on importance of completing FULL antibiotic course — premature discontinuation leads to chronic infection",
      "Assess pain management needs — bone infection is painful",
      "Diabetic patients: reinforce foot care education, daily inspection, proper footwear"
    ],
    assessmentFindings: [
      "Localized bone pain (constant, deep, often worsening — not relieved by rest)",
      "Overlying soft tissue swelling, erythema, warmth",
      "Fever and malaise (acute osteomyelitis)",
      "Chronic: draining sinus tract to skin surface",
      "In children: refusal to use affected limb, limping, irritability",
      "Diabetic foot: non-healing ulcer with exposed bone or probe-to-bone positive",
      "Limited range of motion of adjacent joints"
    ],
    signs: {
      left: ["Localized bone pain", "Swelling/erythema over bone", "Fever (acute)", "Draining sinus (chronic)"],
      right: ["Elevated ESR/CRP", "Positive bone culture", "MRI changes", "Non-healing wound over bone"]
    },
    medications: [
      { name: "Vancomycin IV", type: "Glycopeptide Antibiotic", action: "Inhibits cell wall synthesis; covers MRSA — the most important pathogen in osteomyelitis", sideEffects: "Nephrotoxicity (monitor trough levels and creatinine), red man syndrome (infuse over ≥60 min), ototoxicity", contra: "Severe allergy", pearl: "First-line empiric therapy for osteomyelitis pending cultures. Monitor trough levels (target 15-20 mcg/mL). Ensure adequate hydration to reduce nephrotoxicity risk." },
      { name: "Nafcillin or Cefazolin IV", type: "Anti-staphylococcal Penicillin / First-Gen Cephalosporin", action: "Bactericidal cell wall inhibitors with excellent MSSA coverage and bone penetration", sideEffects: "Phlebitis (nafcillin), hypersensitivity, C. difficile", contra: "Penicillin/cephalosporin allergy", pearl: "Switch from vancomycin when MSSA is confirmed — better outcomes. Cefazolin preferred for outpatient IV therapy (less phlebitis, q8h dosing)." }
    ],
    pearls: [
      "S. aureus is the #1 cause of osteomyelitis in ALL age groups. In sickle cell disease, Salmonella is characteristic.",
      "X-rays are NORMAL for the first 10-14 days — MRI is the imaging of choice for early diagnosis",
      "Probe-to-bone positive in a diabetic foot ulcer has ~89% positive predictive value for osteomyelitis",
      "Treatment requires 4-6 weeks of IV antibiotics MINIMUM — compliance is critical, premature discontinuation leads to chronic infection",
      "Dead bone (sequestrum) cannot be sterilized with antibiotics alone — surgical debridement is often necessary for cure",
      "Chronic osteomyelitis with draining sinus tracts = the infection has been present for weeks to months"
    ],
    quiz: [
      { question: "A diabetic client has a foot ulcer. The nurse probes the wound and touches bone. What does this finding suggest?", options: ["The wound is superficial and healing normally", "Osteomyelitis is likely and further workup is needed", "The probe indicates tendon involvement only", "This is a normal finding in diabetic ulcers"], correct: 1, rationale: "A positive probe-to-bone test (ability to touch bone with a sterile metal probe through a diabetic foot ulcer) has approximately 89% positive predictive value for underlying osteomyelitis. This finding warrants further workup with MRI, inflammatory markers, and potentially bone biopsy." },
      { question: "Why are 4-6 weeks of IV antibiotics required for osteomyelitis?", options: ["Bone is poorly vascularized, requiring prolonged high-dose antibiotic exposure to achieve bactericidal concentrations at the infection site", "It takes 4-6 weeks for the antibiotics to be absorbed", "Shorter courses are more expensive", "The patient needs time to recover from surgery"], correct: 0, rationale: "Bone has limited blood supply compared to soft tissue, and infection often involves avascular necrotic bone (sequestrum) where antibiotic penetration is minimal. Prolonged IV therapy ensures sustained bactericidal concentrations in the infected bone to eradicate the organism and prevent chronicity." }
    ]
  }
};
