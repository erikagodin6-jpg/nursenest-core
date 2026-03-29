import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgFibromyalgia = getAssetUrl("fibro_1773374861631.png");
const imgLumbarSacralStrain = getAssetUrl("lumbarsacralstrain_1773517523349.png");
const imgCrutchParalysis = getAssetUrl("crutchparalysis_1773517432559.png");

export const orthopedicLessons: Record<string, LessonContent> = {
  "osteoarthritis": {
    title: "Osteoarthritis",
    cellular: {
      title: "Cartilage Degradation and Joint Inflammation",
      content: "Osteoarthritis is a progressive degenerative joint disease caused by the breakdown of articular cartilage that normally cushions bone surfaces within synovial joints. Chondrocytes lose their ability to maintain the cartilage matrix, leading to enzymatic degradation of proteoglycans and collagen fibers. As the cartilage thins, subchondral bone becomes exposed and develops sclerosis, osteophyte (bone spur) formation occurs at joint margins, and the synovial membrane becomes mildly inflamed. Unlike rheumatoid arthritis, which is a systemic autoimmune process, OA is a localized mechanical and biochemical failure. The loss of joint space causes bone-on-bone friction, producing crepitus, pain with weight-bearing, and progressive loss of range of motion. Inflammatory cytokines such as IL-1 and TNF-alpha accelerate cartilage destruction even though OA is not primarily an inflammatory disease."
    },
    riskFactors: [
      "Age over 50 - cartilage water content increases while proteoglycan concentration decreases",
      "Obesity - excess mechanical load accelerates cartilage breakdown in weight-bearing joints",
      "Previous joint trauma or surgery disrupting normal cartilage architecture",
      "Repetitive occupational stress from kneeling, squatting, or heavy lifting",
      "Female sex after menopause due to estrogen decline affecting cartilage metabolism",
      "Genetic predisposition affecting collagen structure and chondrocyte function",
      "Malalignment deformities such as genu varum or genu valgum altering load distribution"
    ],
    diagnostics: [
      "X-ray showing joint space narrowing, subchondral sclerosis, and osteophyte formation",
      "ESR and CRP typically normal or minimally elevated - helps differentiate from RA",
      "Negative rheumatoid factor and anti-CCP antibodies distinguishing from autoimmune arthritis",
      "Synovial fluid analysis showing clear, viscous fluid with low WBC count (non-inflammatory)",
      "MRI revealing cartilage loss, bone marrow lesions, and meniscal tears in early disease"
    ],
    management: [
      "Weight reduction to decrease mechanical joint stress - every pound lost removes 4 pounds of knee load",
      "Low-impact exercise such as swimming and cycling to strengthen periarticular muscles without cartilage damage",
      "Acetaminophen as first-line analgesic - safer long-term than NSAIDs for elderly patients",
      "Intra-articular corticosteroid injections for acute flares providing temporary anti-inflammatory relief",
      "Total joint arthroplasty when conservative measures fail and functional impairment is severe",
      "Assistive devices such as canes (used on opposite side of affected joint) to offload weight"
    ],
    nursingActions: [
      "Assess joint pain using a standardized scale, noting whether pain worsens with activity and improves with rest",
      "Apply warm compresses for chronic stiffness and cold packs after activity to reduce swelling",
      "Teach proper body mechanics and joint protection techniques to minimize cartilage stress",
      "Encourage use of assistive devices and evaluate proper cane height (top of cane at wrist crease)",
      "Monitor for GI bleeding and renal function in patients using long-term NSAIDs",
      "Collaborate with physical therapy for individualized strengthening and ROM exercises",
      "Educate that morning stiffness in OA typically lasts less than 30 minutes (vs greater than 1 hour in RA)"
    ],
    signs: {
      left: [
        "Joint crepitus - grinding sensation caused by roughened cartilage surfaces",
        "Heberden nodes - bony enlargements at DIP joints from osteophyte formation",
        "Bouchard nodes - bony enlargements at PIP joints",
        "Asymmetric joint involvement - typically weight-bearing joints affected unilaterally"
      ],
      right: [
        "Pain that worsens with activity and improves with rest - mechanical pain pattern",
        "Morning stiffness lasting less than 30 minutes - distinguishes from inflammatory arthritis",
        "Decreased range of motion from osteophyte impingement and capsular fibrosis",
        "Joint enlargement from bony remodeling without significant warmth or erythema"
      ]
    },
    medications: [
      {
        name: "Celecoxib",
        type: "COX-2 Selective NSAID",
        action: "Selectively inhibits cyclooxygenase-2 enzyme, reducing prostaglandin synthesis at inflammatory sites while sparing COX-1 protective effects on gastric mucosa",
        sideEffects: "Increased cardiovascular risk (MI, stroke), fluid retention, hypertension, headache",
        contra: "History of CABG surgery, active GI bleeding, severe renal impairment, sulfonamide allergy",
        pearl: "Offers GI-sparing benefit over traditional NSAIDs but carries cardiovascular risk - use lowest effective dose for shortest duration"
      }
    ],
    pearls: [
      "Heberden nodes (DIP) and Bouchard nodes (PIP) are pathognomonic for OA and distinguish it from RA which affects MCP and PIP joints symmetrically",
      "OA morning stiffness lasts less than 30 minutes while RA stiffness persists for more than 1 hour - this is a high-yield exam differentiator",
      "A cane should be held in the hand opposite the affected joint and advanced with the affected leg to redistribute weight effectively"
    ],
    quiz: [
      {
        question: "A patient with osteoarthritis reports morning stiffness lasting 15 minutes that resolves with movement. Which finding best differentiates this from rheumatoid arthritis?",
        options: [
          "Presence of joint crepitus on examination",
          "Asymmetric joint involvement with Heberden nodes",
          "Elevated ESR and positive rheumatoid factor",
          "Bilateral MCP joint swelling with warmth"
        ],
        correct: 1,
        rationale: "Asymmetric joint involvement with Heberden nodes (DIP osteophytes) is characteristic of OA. RA presents with symmetric involvement, positive RF, elevated inflammatory markers, and MCP/PIP involvement. Crepitus can occur in both conditions."
      }
    ]
  },

  "fibromyalgia": {
    title: "Fibromyalgia",
    image: imgFibromyalgia,
    cellular: {
      title: "Central Sensitization",
      content: "Fibromyalgia is a chronic pain syndrome driven by central sensitization, where the central nervous system amplifies pain signals and lowers the threshold for nociceptive processing. Dysregulation of neurotransmitters including decreased serotonin, norepinephrine, and dopamine combined with elevated substance P and glutamate in cerebrospinal fluid creates a state of augmented pain perception. The hypothalamic-pituitary-adrenal axis is disrupted, contributing to abnormal cortisol patterns and non-restorative sleep. Functional MRI studies demonstrate increased neural activation in pain-processing regions even with stimuli that would not normally be painful (allodynia). There is no peripheral tissue damage or joint destruction - the pathology exists within the pain-processing pathways of the brain and spinal cord. This explains why traditional anti-inflammatory medications are ineffective and why treatments targeting neurotransmitter regulation provide relief."
    },
    riskFactors: [
      "Female sex - affects women 7 times more frequently due to differences in pain processing and hormonal influences",
      "History of physical or emotional trauma triggering central sensitization",
      "Co-existing mood disorders including depression and anxiety sharing serotonin pathway disruption",
      "Sleep disorders - disrupted stage IV sleep prevents tissue repair and pain modulation",
      "Family history suggesting genetic predisposition in serotonin transporter gene polymorphisms",
      "Autoimmune conditions such as lupus or RA that may trigger secondary fibromyalgia",
      "Chronic stress activating prolonged HPA axis stimulation and cortisol dysregulation",
      "Viral infections including hepatitis C and HIV potentially triggering central sensitization"
    ],
    diagnostics: [
      "Widespread Pain Index (WPI) score of 7 or greater combined with Symptom Severity Scale (SSS) score of 5 or greater",
      "All laboratory values (CBC, CMP, ESR, CRP, TSH, RF) within normal limits - diagnosis of exclusion",
      "Symptoms persisting for at least 3 months ruling out acute or self-limiting conditions",
      "Sleep study may reveal alpha-wave intrusion during delta (stage IV) sleep - prevents restorative rest",
      "No evidence of joint inflammation, destruction, or peripheral nerve damage on imaging"
    ],
    management: [
      "Duloxetine (SNRI) as first-line pharmacotherapy targeting serotonin and norepinephrine reuptake",
      "Pregabalin reducing excitatory neurotransmitter release by binding alpha-2-delta calcium channel subunits",
      "Graded aerobic exercise program - most effective non-pharmacologic intervention for pain reduction",
      "Cognitive behavioral therapy addressing pain catastrophizing and maladaptive coping patterns",
      "Sleep hygiene optimization and treatment of concurrent sleep disorders",
      "Multimodal pain management avoiding opioids which worsen central sensitization over time"
    ],
    nursingActions: [
      "Validate the patient's pain experience - fibromyalgia pain is real despite normal diagnostic findings",
      "Assess sleep quality and patterns because non-restorative sleep amplifies pain perception",
      "Teach pacing techniques to avoid boom-bust activity cycles that trigger symptom flares",
      "Monitor for depression and suicidal ideation, as chronic pain significantly increases risk",
      "Educate about the importance of consistent low-impact exercise despite pain reluctance",
      "Screen for medication side effects including serotonin syndrome with SNRI therapy",
      "Encourage stress reduction techniques such as mindfulness and progressive muscle relaxation"
    ],
    signs: {
      left: [
        "Widespread musculoskeletal pain in all four quadrants lasting more than 3 months",
        "Allodynia - pain response to normally non-painful stimuli such as light touch",
        "Cognitive dysfunction ('fibro fog') - impaired concentration, memory, and word retrieval",
        "Non-restorative sleep despite adequate duration - waking unrefreshed"
      ],
      right: [
        "Chronic fatigue disproportionate to activity level",
        "Irritable bowel symptoms - central sensitization affects visceral pain processing",
        "Headaches including tension-type and migraine from central pain amplification",
        "Temperature sensitivity and paresthesias without dermatomal distribution"
      ]
    },
    medications: [
      {
        name: "Duloxetine",
        type: "Serotonin-Norepinephrine Reuptake Inhibitor (SNRI)",
        action: "Inhibits reuptake of both serotonin and norepinephrine in descending pain inhibitory pathways, restoring endogenous pain modulation",
        sideEffects: "Nausea (most common, often transient), dizziness, dry mouth, constipation, increased sweating, hepatotoxicity",
        contra: "Concurrent MAOI use (risk of serotonin syndrome), uncontrolled narrow-angle glaucoma, severe hepatic impairment",
        pearl: "Must be tapered gradually over 2 weeks to prevent discontinuation syndrome - never abruptly stop"
      },
      {
        name: "Pregabalin",
        type: "Anticonvulsant/Analgesic",
        action: "Binds alpha-2-delta subunit of voltage-gated calcium channels, reducing release of excitatory neurotransmitters including glutamate and substance P",
        sideEffects: "Dizziness, somnolence, peripheral edema, weight gain, blurred vision",
        contra: "Known hypersensitivity, caution with CNS depressants and renal impairment (dose adjustment required)",
        pearl: "First FDA-approved medication specifically for fibromyalgia - onset of benefit may take 1-2 weeks"
      }
    ],
    pearls: [
      "Fibromyalgia is NOT an inflammatory or autoimmune condition - all inflammatory markers should be normal; abnormal results warrant investigation for other diagnoses",
      "Opioids are contraindicated in fibromyalgia because they worsen central sensitization through opioid-induced hyperalgesia and provide no long-term benefit",
      "The old 'tender point' exam requiring 11 of 18 points has been replaced by the WPI and SSS criteria - updated exams reflect this change"
    ],
    quiz: [
      {
        question: "A patient diagnosed with fibromyalgia asks why ibuprofen doesn't help their pain. Which response by the nurse demonstrates the best understanding of fibromyalgia pathophysiology?",
        options: [
          "Your pain receptors in the joints have become resistant to anti-inflammatory medication",
          "Fibromyalgia pain comes from your brain amplifying pain signals, not from tissue inflammation that NSAIDs target",
          "You need a stronger anti-inflammatory medication such as a corticosteroid",
          "Ibuprofen only works for acute pain and fibromyalgia is a chronic condition"
        ],
        correct: 1,
        rationale: "Fibromyalgia pain results from central sensitization - the CNS amplifies pain signals without peripheral tissue inflammation. NSAIDs target prostaglandin-mediated inflammation which is not the mechanism in fibromyalgia. Treatments must target central pain processing pathways (SNRIs, pregabalin)."
      }
    ]
  },

  "muscle-strain": {
    title: "Muscle Strain",
    cellular: {
      title: "Muscle Fiber Disruption and RICE Protocol",
      content: "A muscle strain occurs when muscle fibers are stretched beyond their physiologic capacity, causing partial or complete tearing of the myofibrils and surrounding connective tissue. Grade I strains involve microscopic tearing with intact muscle architecture. Grade II strains involve partial thickness tearing with loss of some contractile function. Grade III strains involve complete rupture of the muscle-tendon unit with total loss of function. When fibers tear, damaged blood vessels leak blood into surrounding tissues causing ecchymosis, and inflammatory mediators (histamine, bradykinin, prostaglandins) are released, producing swelling, warmth, and pain. The inflammatory phase is essential for healing as macrophages remove necrotic tissue and growth factors stimulate satellite cell activation. Satellite cells are muscle stem cells that proliferate and fuse to repair damaged fibers, but excessive scar tissue formation can impair functional recovery if rehabilitation is delayed."
    },
    riskFactors: [
      "Inadequate warm-up before activity - cold muscles have decreased elasticity and are prone to tearing",
      "Muscle fatigue reducing the protective stretch reflex threshold",
      "Previous muscle injury creating scar tissue with decreased compliance at the injury site",
      "Poor flexibility and tight musculature limiting available range before fiber failure",
      "Muscle imbalance between agonist and antagonist groups creating abnormal force distribution",
      "Dehydration and electrolyte imbalance impairing muscle contractile function",
      "Sudden eccentric loading (lengthening under force) which generates the highest mechanical stress"
    ],
    diagnostics: [
      "Physical examination revealing localized tenderness, swelling, and pain with resisted contraction",
      "MRI for Grade II-III strains to assess extent of fiber disruption and rule out complete avulsion",
      "Ultrasound for dynamic evaluation of muscle contraction and identification of hematoma formation",
      "Elevated CK levels if significant muscle damage has occurred, proportional to injury severity",
      "X-ray to rule out avulsion fracture where the tendon pulls bone fragment away from its attachment"
    ],
    management: [
      "RICE protocol immediately - Rest, Ice (20 minutes on/off), Compression, Elevation above heart level",
      "NSAIDs for 48-72 hours to manage acute inflammation and pain",
      "Gradual progressive rehabilitation starting with isometric exercises before advancing to dynamic movements",
      "Avoidance of heat application during first 48-72 hours because vasodilation worsens hemorrhage and edema",
      "Grade III tears may require surgical repair followed by structured physical therapy program"
    ],
    nursingActions: [
      "Apply ice packs for 20 minutes with a barrier between ice and skin to prevent cold injury",
      "Assess neurovascular status distal to injury site - check pulses, sensation, capillary refill",
      "Educate patient to avoid heat, alcohol, running, and massage during first 48-72 hours (HARM principle)",
      "Apply elastic compression bandage from distal to proximal to prevent dependent edema",
      "Teach proper crutch use if lower extremity strain prevents weight-bearing",
      "Monitor for compartment syndrome signs in severe injuries - pain out of proportion, pain with passive stretch"
    ],
    signs: {
      left: [
        "Localized pain that increases with muscle contraction or passive stretching",
        "Visible or palpable defect in muscle belly with Grade III tears",
        "Ecchymosis appearing 24-48 hours after injury as extravasated blood migrates to skin surface",
        "Muscle spasm as a protective mechanism to limit further fiber damage"
      ],
      right: [
        "Swelling and edema at injury site from vascular disruption and inflammatory response",
        "Decreased range of motion and weakness proportional to number of fibers disrupted",
        "Antalgic gait pattern when lower extremity muscles are involved",
        "Point tenderness precisely at the site of fiber disruption"
      ]
    },
    medications: [
      {
        name: "Cyclobenzaprine",
        type: "Centrally Acting Muscle Relaxant",
        action: "Acts at the brainstem to reduce tonic somatic motor activity by decreasing gamma motor neuron discharge, breaking the pain-spasm-pain cycle",
        sideEffects: "Drowsiness, dry mouth, dizziness, urinary retention, blurred vision (anticholinergic effects)",
        contra: "Concurrent MAOI use, hyperthyroidism, heart failure, arrhythmias, acute recovery phase of MI",
        pearl: "Structurally similar to tricyclic antidepressants - avoid in elderly due to anticholinergic burden and fall risk"
      }
    ],
    pearls: [
      "Ice should never be applied directly to skin - always use a barrier cloth to prevent frostbite; limit application to 20-minute intervals",
      "The HARM principle (Heat, Alcohol, Running, Massage) identifies interventions to avoid in the first 48-72 hours because they increase bleeding and swelling",
      "Pain with passive stretching of the affected muscle is the earliest indicator of compartment syndrome and requires emergent evaluation"
    ],
    quiz: [
      {
        question: "A patient sustained a Grade II hamstring strain 6 hours ago. Which nursing intervention is most appropriate at this time?",
        options: [
          "Apply moist heat to the posterior thigh to promote circulation",
          "Apply ice for 20 minutes with a cloth barrier and elevate the leg",
          "Begin active range of motion exercises to prevent contracture",
          "Massage the injured area to reduce muscle spasm"
        ],
        correct: 1,
        rationale: "During the first 48-72 hours after muscle strain, RICE protocol is indicated. Ice causes vasoconstriction to limit hemorrhage and edema. Heat, massage, and vigorous exercise are contraindicated in the acute phase because they increase blood flow to the injured area, worsening swelling and bleeding."
      }
    ]
  },

  "myoglobinuria": {
    title: "Myoglobinuria",
    cellular: {
      title: "Myoglobin Release and Renal Tubular Damage",
      content: "Myoglobinuria occurs when myoglobin, a heme-containing oxygen-binding protein normally sequestered within skeletal muscle cells, is released into the bloodstream following muscle cell destruction (rhabdomyolysis). Myoglobin is a small molecule (17 kDa) that freely passes through the glomerular filtration barrier. In the renal tubules, myoglobin precipitates and forms obstructive casts, particularly in acidic urine where the ferrihemate form is insoluble. Additionally, the iron moiety of myoglobin generates reactive oxygen species through Fenton reactions, causing direct oxidative damage to tubular epithelial cells. Myoglobin also acts as a potent renal vasoconstrictor by scavenging nitric oxide, reducing renal blood flow and exacerbating ischemic injury. The combination of tubular obstruction, oxidative damage, and vasoconstriction results in acute kidney injury (AKI) - the most life-threatening complication of rhabdomyolysis. Urine appears dark brown or tea-colored and tests positive for blood on dipstick (which detects heme) despite absence of red blood cells on microscopy."
    },
    riskFactors: [
      "Rhabdomyolysis from crush injuries, prolonged immobilization, or extreme exertion",
      "Statin therapy combined with fibrates or CYP3A4 inhibitors increasing myotoxicity risk",
      "Heat stroke causing direct thermal injury to myocytes",
      "Seizure activity producing sustained involuntary muscle contraction and metabolic exhaustion",
      "Alcohol and illicit drug use (cocaine, amphetamines) causing vasospasm and muscle ischemia",
      "Hypokalemia and hypophosphatemia destabilizing sarcolemmal membrane integrity",
      "Malignant hyperthermia triggering uncontrolled calcium release and sustained muscle contraction",
      "Compartment syndrome restricting blood flow and causing ischemic muscle death"
    ],
    diagnostics: [
      "Tea-colored or cola-colored urine that is dipstick-positive for blood but microscopy shows no RBCs",
      "Serum CK elevated more than 5 times the upper limit of normal (often exceeding 10,000 U/L)",
      "Elevated serum myoglobin confirming muscle breakdown (but clears faster than CK)",
      "Rising BUN and creatinine indicating acute kidney injury from tubular damage",
      "Hyperkalemia from intracellular potassium release - cardiac monitoring required",
      "Metabolic acidosis from tissue destruction and impaired renal acid excretion"
    ],
    management: [
      "Aggressive IV fluid resuscitation with isotonic crystalloid (200-300 mL/hr) targeting urine output of 200-300 mL/hr",
      "IV sodium bicarbonate to alkalinize urine (target pH above 6.5) preventing myoglobin precipitation in tubules",
      "Continuous cardiac monitoring for hyperkalemia-induced dysrhythmias",
      "Emergent treatment of hyperkalemia with IV calcium gluconate, insulin/dextrose, and kayexalate",
      "Renal replacement therapy (hemodialysis) if oliguric AKI develops despite aggressive fluid resuscitation",
      "Avoidance of nephrotoxic agents including NSAIDs, aminoglycosides, and contrast dye"
    ],
    nursingActions: [
      "Monitor urine color and output hourly - dark-to-clear urine transition indicates improving myoglobin clearance",
      "Maintain strict intake and output records with target urine output of 200-300 mL/hr",
      "Assess for signs of fluid overload during aggressive IV resuscitation (crackles, JVD, dyspnea)",
      "Monitor potassium levels frequently and report levels above 5.5 mEq/L immediately",
      "Place patient on continuous cardiac telemetry monitoring for peaked T waves and widened QRS",
      "Test urine pH regularly when bicarbonate infusion is ordered to confirm alkalinization",
      "Assess for compartment syndrome in affected extremities - severe pain, taut swelling, pain with passive stretch"
    ],
    signs: {
      left: [
        "Dark brown tea-colored or cola-colored urine from filtered myoglobin",
        "Decreased urine output progressing to oliguria as tubular obstruction worsens",
        "Muscle pain, swelling, and tenderness in affected muscle groups",
        "Elevated temperature from inflammatory response to massive tissue destruction"
      ],
      right: [
        "Peaked T waves on ECG from hyperkalemia released by dying muscle cells",
        "Nausea, vomiting, and malaise from uremia as kidney function declines",
        "Limb weakness and decreased mobility from extensive muscle damage",
        "Tachycardia and hypotension from third-spacing of fluid into damaged tissues"
      ]
    },
    medications: [
      {
        name: "Sodium Bicarbonate IV",
        type: "Alkalinizing Agent",
        action: "Raises urine pH above 6.5, converting ferrihemate form of myoglobin to soluble ferryl form, preventing cast formation and reducing direct tubular toxicity",
        sideEffects: "Metabolic alkalosis, hypokalemia (drives potassium intracellularly), hypocalcemia, fluid overload, hypernatremia",
        contra: "Severe metabolic alkalosis (pH above 7.5), hypocalcemia (may worsen tetany), pulmonary edema",
        pearl: "Must monitor ionized calcium closely - alkalosis decreases ionized calcium and can precipitate tetany or seizures"
      }
    ],
    pearls: [
      "Dipstick-positive blood with no RBCs on microscopy is the hallmark finding - the dipstick detects heme from myoglobin, not intact red blood cells",
      "Aggressive IV fluids are the cornerstone of treatment because they dilute myoglobin concentration, increase tubular flow rate, and maintain renal perfusion pressure",
      "CK peaks at 24-72 hours and is a more reliable marker of muscle injury than myoglobin, which is cleared from blood within 6-8 hours"
    ],
    quiz: [
      {
        question: "A nurse notes that a patient's urine is dark brown and the dipstick is positive for blood, but microscopic analysis reveals no red blood cells. Which assessment finding would the nurse expect?",
        options: [
          "Serum CK within normal limits",
          "Clear, pale yellow urine on subsequent void",
          "Elevated serum CK with muscle tenderness",
          "Positive urine culture and elevated WBC"
        ],
        correct: 2,
        rationale: "Dark brown urine that is dipstick-positive for blood but lacks RBCs on microscopy indicates myoglobinuria. Myoglobin is released from damaged muscle cells, so elevated CK (a marker of muscle breakdown) with muscle tenderness would be expected. This presentation is classic for rhabdomyolysis."
      }
    ]
  },


  "bone-tumors": {
    title: "Bone Tumors",
    cellular: {
      title: "Osteosarcoma",
      content: "Primary malignant bone tumors arise from uncontrolled proliferation of bone-forming cells (osteosarcoma) or neuroectodermal cells within bone (Ewing sarcoma). Osteosarcoma is the most common primary bone malignancy, typically arising in the metaphysis of long bones (distal femur, proximal tibia) during periods of rapid growth. Malignant osteoblasts produce abnormal osteoid tissue that forms a characteristic 'sunburst' pattern on radiograph. Ewing sarcoma is the second most common bone cancer in children, driven by a chromosomal translocation t(11;22) that creates the EWS-FLI1 fusion oncoprotein disrupting normal cell cycle regulation. Ewing typically affects the diaphysis (shaft) of long bones and flat bones. Both tumors metastasize hematogenously, most commonly to the lungs. The rapid bone destruction activates osteoclasts and releases alkaline phosphatase, while tumor growth within the rigid bone cortex causes severe periosteal pain, especially at night when cortisol levels naturally decrease."
    },
    riskFactors: [
      "Age 10-25 years - peak incidence during adolescent growth spurts when osteoblast activity is highest",
      "Male sex - osteosarcoma occurs 1.5 times more frequently in males",
      "Rapid skeletal growth - taller adolescents have increased risk correlating with growth velocity",
      "Prior radiation therapy to bone causing DNA damage in osteoprogenitor cells",
      "Paget disease of bone with increased osteoblast turnover creating opportunities for malignant transformation",
      "Hereditary retinoblastoma (RB1 gene mutation) increasing osteosarcoma risk 500-fold",
      "Li-Fraumeni syndrome (TP53 mutation) predisposing to multiple tumor types including osteosarcoma"
    ],
    diagnostics: [
      "X-ray showing sunburst pattern (osteosarcoma) or onion-skin periosteal reaction (Ewing sarcoma)",
      "Elevated serum alkaline phosphatase and LDH indicating rapid bone turnover and cellular destruction",
      "MRI for precise tumor extent assessment, skip lesion detection, and surgical planning",
      "CT chest to evaluate for pulmonary metastases - the most common site of distant spread",
      "Biopsy confirming histologic diagnosis - must be performed by the surgical team to avoid compromising future limb salvage",
      "Bone scan to detect multifocal disease and distant bone metastases"
    ],
    management: [
      "Neoadjuvant chemotherapy to shrink tumor before surgical resection and assess tumor response",
      "Limb salvage surgery with wide resection margins preferred over amputation when feasible",
      "Adjuvant chemotherapy following surgical resection to eliminate micrometastatic disease",
      "Radiation therapy primarily for Ewing sarcoma (radiosensitive) and unresectable tumors",
      "Prophylactic stabilization of impending pathologic fractures before they occur",
      "Multidisciplinary coordination between orthopedic oncology, medical oncology, and radiology"
    ],
    nursingActions: [
      "Handle affected limb gently and support above and below the tumor site to prevent pathologic fracture",
      "Monitor for chemotherapy side effects - neutropenia (infection risk), mucositis, nausea, nephrotoxicity",
      "Provide age-appropriate psychosocial support for adolescent patients facing potential limb loss",
      "Assess pain patterns - bone tumor pain characteristically worsens at night and disrupts sleep",
      "Implement fall prevention measures as weakened bone is at high risk for pathologic fracture",
      "Educate family about signs of pulmonary metastases - persistent cough, dyspnea, hemoptysis",
      "Monitor surgical site for infection, wound dehiscence, and prosthetic complications post-operatively"
    ],
    signs: {
      left: [
        "Persistent bone pain worsening at night and not relieved by rest",
        "Palpable hard, fixed mass at the tumor site - non-tender initially",
        "Pathologic fracture through weakened bone with minimal or no trauma",
        "Restricted range of motion in the adjacent joint"
      ],
      right: [
        "Localized swelling increasing over weeks to months",
        "Limping or functional limitation without history of injury",
        "Low-grade fever and elevated inflammatory markers with Ewing sarcoma",
        "Unexplained weight loss and fatigue suggesting systemic disease"
      ]
    },
    medications: [
      {
        name: "Methotrexate (High-Dose)",
        type: "Antimetabolite Chemotherapy",
        action: "Inhibits dihydrofolate reductase, blocking purine and thymidylate synthesis required for DNA replication in rapidly dividing tumor cells",
        sideEffects: "Severe myelosuppression, mucositis, nephrotoxicity from crystal precipitation in renal tubules, hepatotoxicity, neurotoxicity",
        contra: "Significant renal impairment, severe hepatic disease, pre-existing myelosuppression, pregnancy",
        pearl: "Leucovorin (folinic acid) rescue MUST be administered at scheduled times after high-dose methotrexate to prevent fatal toxicity to normal cells - timing is critical"
      }
    ],
    pearls: [
      "Sunburst pattern on X-ray indicates osteosarcoma (metaphysis) while onion-skin pattern indicates Ewing sarcoma (diaphysis) - this is a classic radiographic differentiator",
      "Never biopsy a suspected bone tumor without orthopedic oncology consultation - improper biopsy tract placement can contaminate tissue planes and prevent limb salvage surgery",
      "Night pain that wakes a child from sleep and is unresponsive to usual analgesics should raise immediate suspicion for bone malignancy rather than 'growing pains'"
    ],
    quiz: [
      {
        question: "A 14-year-old presents with knee pain that worsens at night and an X-ray showing a sunburst pattern at the distal femur. Which finding would the nurse expect?",
        options: [
          "Decreased serum calcium and normal alkaline phosphatase",
          "Elevated alkaline phosphatase and LDH levels",
          "Positive rheumatoid factor and elevated ESR",
          "Decreased serum phosphorus and elevated PTH"
        ],
        correct: 1,
        rationale: "The sunburst pattern at the distal femur metaphysis in an adolescent is classic for osteosarcoma. Alkaline phosphatase is elevated due to increased osteoblastic activity, and LDH is elevated from rapid cellular turnover. These markers also serve as prognostic indicators and treatment response monitors."
      }
    ]
  },

  "osteogenesis-imperfecta": {
    title: "Osteogenesis Imperfecta",
    cellular: {
      title: "Collagen Type I Defect and Bone Fragility",
      content: "Osteogenesis imperfecta (OI) is a genetic disorder of connective tissue caused by mutations in the COL1A1 or COL1A2 genes that encode type I collagen, the primary structural protein of bone, skin, tendons, ligaments, and sclera. Defective collagen results in bones that are extremely fragile with abnormal microarchitecture - the cortices are thin, trabeculae are sparse and disorganized, and mineralization is irregular. Type I collagen normally provides tensile strength and flexibility to bone matrix; without it, bones fracture with minimal trauma or even normal handling. The sclera appear blue because the defective collagen is abnormally thin and translucent, allowing the underlying choroidal vasculature to show through. The four types range from mild (Type I with normal stature and few fractures) to lethal (Type II with intrauterine fractures and death in the perinatal period). Type I is the most common and mildest form inherited in an autosomal dominant pattern. Dentinogenesis imperfecta occurs because dentin also contains type I collagen, producing translucent, discolored teeth prone to fracture."
    },
    riskFactors: [
      "Autosomal dominant inheritance - one affected parent confers 50% risk to each offspring",
      "Spontaneous new mutations account for approximately 25% of cases with no family history",
      "COL1A1 mutations typically produce milder disease (quantitative collagen deficiency)",
      "COL1A2 mutations often produce severe disease (qualitative structural defect)",
      "Multiple pregnancies increase fracture risk in affected neonates during delivery",
      "Vitamin D deficiency further compromising already fragile bone mineralization"
    ],
    diagnostics: [
      "X-ray showing generalized osteopenia with thin cortices, multiple fractures in various stages of healing",
      "DEXA scan demonstrating severely decreased bone mineral density",
      "Genetic testing confirming COL1A1 or COL1A2 mutations for definitive diagnosis",
      "Blue sclera on physical examination from translucent collagen allowing choroidal vessels to show",
      "Audiometry revealing conductive or mixed hearing loss from otosclerosis affecting ossicles"
    ],
    management: [
      "IV bisphosphonates (pamidronate) to increase bone density by inhibiting osteoclast-mediated resorption",
      "Intramedullary rodding of long bones to prevent and stabilize fractures during growth",
      "Physical therapy focusing on low-impact strengthening and safe mobility to prevent disuse weakness",
      "Fracture management with gentle handling - splinting preferred over casting when possible",
      "Calcium and vitamin D supplementation to optimize available bone mineralization",
      "Genetic counseling for family planning and prenatal diagnosis in subsequent pregnancies"
    ],
    nursingActions: [
      "Handle infant and child with extreme gentleness - support entire body, never lift by arms or legs",
      "Educate parents that fractures in OI are NOT indicators of child abuse - provide documentation",
      "Pad crib rails and use soft clothing to minimize trauma risk during daily activities",
      "Assess for new fractures after any handling, repositioning, or movement",
      "Monitor hearing at regular intervals as conductive hearing loss can develop progressively",
      "Teach parents to recognize fracture signs in nonverbal infants - irritability, pseudoparalysis, swelling"
    ],
    signs: {
      left: [
        "Blue sclera - pathognomonic finding from thin translucent collagen over choroidal vessels",
        "Multiple fractures with minimal or no trauma - may present at birth",
        "Short stature from impaired long bone growth and compression fractures of vertebrae",
        "Dentinogenesis imperfecta - translucent, opalescent teeth prone to chipping"
      ],
      right: [
        "Hearing loss (typically conductive) developing in adolescence from ossicle involvement",
        "Joint hypermobility from defective collagen in ligaments and joint capsules",
        "Easy bruising from fragile capillary walls with defective collagen support",
        "Triangular facies and macrocephaly characteristic of severe types"
      ]
    },
    medications: [
      {
        name: "Pamidronate IV",
        type: "Bisphosphonate",
        action: "Binds to hydroxyapatite in bone matrix and is ingested by osteoclasts, inducing apoptosis and reducing bone resorption, thereby increasing bone mineral density",
        sideEffects: "Acute phase reaction (fever, myalgia, flu-like symptoms) with first infusion, hypocalcemia, osteonecrosis of jaw (rare in children)",
        contra: "Hypocalcemia must be corrected before administration, severe renal impairment, pregnancy",
        pearl: "Administered IV every 3-4 months in children with OI - can reduce fracture rate by 60-70% and significantly improve quality of life"
      }
    ],
    pearls: [
      "Blue sclera, multiple fractures, and hearing loss form the classic triad of osteogenesis imperfecta - blue sclera is the most recognizable feature on exam questions",
      "OI must be considered and ruled out before accusing caregivers of child abuse in infants with multiple fractures - genetic testing should be performed",
      "Type I is the mildest and most common form - patients have normal or near-normal stature with blue sclera and fractures that decrease after puberty"
    ],
    quiz: [
      {
        question: "A nurse assesses a newborn with blue sclera, multiple rib fractures noted on chest X-ray, and short bowed extremities. Which genetic condition should the nurse suspect?",
        options: [
          "Marfan syndrome affecting fibrillin protein",
          "Osteogenesis imperfecta affecting type I collagen",
          "Ehlers-Danlos syndrome affecting type III collagen",
          "Achondroplasia affecting fibroblast growth factor receptor"
        ],
        correct: 1,
        rationale: "Blue sclera with multiple fractures at birth is the hallmark presentation of osteogenesis imperfecta, caused by defective type I collagen. Marfan affects fibrillin (tall stature, aortic dissection), Ehlers-Danlos affects skin elasticity, and achondroplasia affects bone growth plates without fracture susceptibility."
      }
    ]
  },

  "ankylosing-spondylitis": {
    title: "Ankylosing Spondylitis",
    cellular: {
      title: "HLA-B27 Autoimmune Sacroiliac",
      content: "Ankylosing spondylitis (AS) is a chronic inflammatory spondyloarthropathy strongly associated with the HLA-B27 allele, which presents abnormal self-peptides to CD8+ T cells, triggering an autoimmune inflammatory cascade targeting the entheses (sites where tendons and ligaments insert into bone). The inflammation begins at the sacroiliac joints and ascends the spine. Chronic enthesitis triggers a pathologic repair process where inflammatory tissue is replaced by fibrocartilage and eventually ossifies, forming syndesmophytes (bony bridges between vertebral bodies). Progressive ossification transforms the flexible spinal column into a rigid structure called 'bamboo spine.' The disease also causes inflammatory changes at the costochondral junctions, reducing chest expansion and forcing reliance on diaphragmatic breathing. TNF-alpha and IL-17 are key cytokines driving the inflammatory and ossification processes. Unlike rheumatoid arthritis, AS is a seronegative condition - rheumatoid factor is negative."
    },
    riskFactors: [
      "HLA-B27 positive genotype - present in over 90% of patients with AS",
      "Male sex - affects men 2-3 times more frequently and typically with more severe disease",
      "Age of onset typically 20-30 years - onset after age 45 is rare and should prompt alternative diagnoses",
      "Family history of spondyloarthropathy - 20% risk if first-degree relative is affected and HLA-B27 positive",
      "Inflammatory bowel disease (Crohn disease, ulcerative colitis) sharing genetic susceptibility loci",
      "Psoriasis - psoriatic arthritis and AS share the spondyloarthropathy disease spectrum",
      "Preceding genitourinary or gastrointestinal infection triggering reactive arthritis in susceptible individuals"
    ],
    diagnostics: [
      "Sacroiliitis on X-ray or MRI - bilateral symmetric involvement is characteristic",
      "HLA-B27 genotyping positive in over 90% of cases (but also present in 8% of general population)",
      "Elevated ESR and CRP indicating active systemic inflammation",
      "X-ray showing bamboo spine with flowing syndesmophytes and squared vertebral bodies in advanced disease",
      "Reduced chest expansion (less than 2.5 cm at fourth intercostal space) from costochondral ossification",
      "MRI of sacroiliac joints showing bone marrow edema in early disease before X-ray changes appear"
    ],
    management: [
      "NSAIDs as first-line therapy - continuous use slows radiographic progression (unlike other rheumatic diseases)",
      "TNF-alpha inhibitors (adalimumab, etanercept) for patients failing NSAID therapy",
      "IL-17 inhibitors (secukinumab) as alternative biologic therapy targeting key cytokine pathway",
      "Daily spinal extension exercises and posture training to maintain flexibility and prevent kyphotic deformity",
      "Physical therapy focusing on chest expansion exercises to maintain respiratory function",
      "Smoking cessation - smoking accelerates spinal fusion and worsens respiratory compromise"
    ],
    nursingActions: [
      "Assess spinal mobility using Schober test and occiput-to-wall distance measurements",
      "Measure chest expansion at the nipple line - decreased expansion indicates costochondral involvement",
      "Encourage sleeping on a firm mattress in supine position without a pillow to prevent kyphotic deformity",
      "Teach daily spinal extension exercises - swimming is the ideal exercise for AS patients",
      "Monitor for anterior uveitis (eye pain, redness, photophobia) - occurs in 25-40% of patients",
      "Screen for cardiac complications including aortic regurgitation and conduction abnormalities",
      "Assess respiratory function as chest wall restriction reduces vital capacity"
    ],
    signs: {
      left: [
        "Insidious onset of chronic low back pain and stiffness lasting more than 3 months",
        "Morning stiffness lasting more than 30 minutes that improves with exercise but not rest",
        "Sacroiliac joint tenderness on direct palpation or provocative testing",
        "Loss of lumbar lordosis with progressive thoracic kyphosis (stooped forward posture)"
      ],
      right: [
        "Reduced chest expansion from costochondral joint ossification",
        "Anterior uveitis presenting as unilateral eye pain, redness, and photophobia",
        "Peripheral enthesitis - heel pain (Achilles tendinitis) and plantar fasciitis",
        "Decreased spinal range of motion in all planes - flexion, extension, lateral bending, rotation"
      ]
    },
    medications: [
      {
        name: "Adalimumab",
        type: "TNF-Alpha Inhibitor (Biologic DMARD)",
        action: "Monoclonal antibody that binds and neutralizes TNF-alpha, a key pro-inflammatory cytokine driving enthesitis and syndesmophyte formation",
        sideEffects: "Injection site reactions, increased infection risk (especially reactivation TB), demyelinating disorders, hepatotoxicity, lupus-like syndrome",
        contra: "Active infection including latent TB (must screen with PPD or IGRA before starting), moderate-severe heart failure, active hepatitis B",
        pearl: "All patients must be screened for latent tuberculosis before initiating any TNF inhibitor because TNF is critical for granuloma maintenance - reactivation TB can be fatal"
      }
    ],
    pearls: [
      "AS pain improves with activity and worsens with rest - this is the opposite of mechanical back pain and is a critical exam differentiator",
      "The 'question mark posture' (loss of lumbar lordosis with thoracic kyphosis and cervical hyperextension) is the classic late-stage deformity",
      "Young male with chronic low back pain lasting more than 3 months, morning stiffness, and improvement with exercise should always trigger evaluation for ankylosing spondylitis"
    ],
    quiz: [
      {
        question: "A 25-year-old male reports gradual onset low back pain for 4 months that improves with exercise. Which assessment finding would most strongly support ankylosing spondylitis?",
        options: [
          "Pain radiating below the knee in a dermatomal pattern",
          "Bilateral sacroiliac tenderness with morning stiffness lasting over 60 minutes",
          "Positive straight leg raise test at 30 degrees",
          "Point tenderness at L4-L5 spinous process with muscle spasm"
        ],
        correct: 1,
        rationale: "Bilateral sacroiliac involvement with prolonged morning stiffness is characteristic of ankylosing spondylitis. The inflammatory back pain of AS improves with activity, lasts more than 3 months, and has insidious onset. Dermatomal radiation and positive SLR suggest disc herniation, while point tenderness suggests mechanical strain."
      }
    ]
  },

  "contracture": {
    title: "Contracture",
    cellular: {
      title: "Tissue Shortening and Range of Motion Loss",
      content: "A contracture is a permanent shortening of muscle, tendon, ligament, or skin tissue that restricts normal joint range of motion. When a joint is immobilized, collagen fibers in the periarticular structures undergo remodeling - existing cross-links tighten while new collagen is deposited in a shortened configuration aligned along the axis of immobilization rather than in the normal multidirectional pattern. Muscle fibers lose sarcomeres (the contractile units) within as little as 5-7 days of immobilization. Ground substance in connective tissue becomes more viscous and loses water content, reducing tissue pliability. Simultaneously, elastic fibers degrade while inelastic fibrous tissue proliferates. The joint capsule thickens and adheres to articular cartilage, and cartilage itself degenerates from lack of the intermittent loading required for chondrocyte nutrition. Flexion contractures are most common because flexor muscles are generally stronger than extensors and because patients naturally assume flexed, comfortable positions. Once established, contractures require aggressive intervention because the structural changes are progressively irreversible."
    },
    riskFactors: [
      "Prolonged immobilization from casting, bedrest, or mechanical ventilation",
      "Burn injuries causing dermal scarring and contraction across joint surfaces",
      "Spasticity from upper motor neuron lesions (stroke, TBI, cerebral palsy) maintaining flexed positions",
      "Joint inflammation or pain causing protective guarding in flexed postures",
      "Peripheral nerve injury resulting in unopposed action of innervated muscle groups",
      "Advanced age with decreased tissue elasticity and increased susceptibility to immobility effects",
      "Inadequate positioning and range of motion exercises during hospitalization"
    ],
    diagnostics: [
      "Goniometric measurement documenting decreased passive range of motion at the affected joint",
      "Physical examination differentiating between soft-tissue and bony end-feel on passive stretch",
      "X-ray to rule out heterotopic ossification or bony ankylosis as cause of restricted motion",
      "EMG and nerve conduction studies if spasticity or neurologic cause is suspected",
      "MRI showing thickened joint capsule, tendon shortening, or periarticular fibrosis"
    ],
    management: [
      "Active and passive range of motion exercises performed at least 3-4 times daily",
      "Progressive splinting and serial casting to gradually stretch contracted tissues",
      "Positioning in extension using pillows, splints, and trochanter rolls to counteract flexion tendency",
      "Surgical release for established contractures not responding to conservative measures",
      "Botulinum toxin injection for spasticity-driven contractures to allow stretching during the paralytic window",
      "Continuous passive motion (CPM) machines to maintain joint mobility post-operatively"
    ],
    nursingActions: [
      "Perform and document range of motion exercises on immobilized patients every shift",
      "Position joints in neutral or functional alignment using splints and positioning devices",
      "Turn and reposition bedbound patients every 2 hours with proper joint alignment",
      "Place trochanter rolls along the lateral thigh to prevent external rotation contracture of the hip",
      "Keep feet at 90-degree angle using footboard or high-top sneakers to prevent plantar flexion contracture (foot drop)",
      "Avoid placing pillows under the knee which promotes flexion contracture",
      "Document range of motion measurements at regular intervals to detect early restriction"
    ],
    signs: {
      left: [
        "Inability to fully extend the affected joint through its normal arc of motion",
        "Visible fixed flexion deformity at rest - joint unable to achieve neutral position",
        "Firm resistance to passive stretching with a leathery or hard end-feel",
        "Functional impairment such as inability to straighten leg for ambulation"
      ],
      right: [
        "Shortened muscle belly palpable on the flexor surface of the joint",
        "Compensatory postural changes - the body adapts to the contracture by altering alignment elsewhere",
        "Skin tightness or scar bands across the joint surface in burn-related contractures",
        "Progressive worsening if range of motion exercises are not consistently performed"
      ]
    },
    medications: [
      {
        name: "Botulinum Toxin A (Botox)",
        type: "Neuromuscular Blocking Agent",
        action: "Inhibits acetylcholine release at the neuromuscular junction by cleaving SNARE proteins, temporarily paralyzing spastic muscles and creating a therapeutic window for stretching and rehabilitation",
        sideEffects: "Excessive weakness beyond target muscle, dysphagia if injected near swallowing muscles, bruising at injection site, antibody formation reducing efficacy over time",
        contra: "Infection at injection site, known hypersensitivity, concurrent aminoglycoside use (potentiates neuromuscular blockade), myasthenia gravis",
        pearl: "Effects take 3-5 days to begin and last 3-4 months - physical therapy must be scheduled during the paralytic window to maximize stretching benefit"
      }
    ],
    pearls: [
      "Prevention is far easier than treatment - contractures can begin forming within 5-7 days of immobilization, making early ROM exercises essential for every immobilized patient",
      "Never place a pillow under the knee of a bedbound patient - this promotes hip and knee flexion contractures that severely impair ambulation recovery",
      "Foot drop (plantar flexion contracture) from peroneal nerve compression or ankle immobilization is the most common preventable contracture in hospitalized patients"
    ],
    quiz: [
      {
        question: "A nurse is positioning a patient who has been on bedrest for 5 days. Which intervention is most important to prevent contracture formation?",
        options: [
          "Place a pillow under both knees for comfort",
          "Position feet at 90 degrees using a footboard and perform ROM exercises",
          "Keep the patient in a side-lying position at all times",
          "Apply elastic stockings to prevent deep vein thrombosis"
        ],
        correct: 1,
        rationale: "Maintaining feet at 90 degrees prevents plantar flexion contracture (foot drop), and ROM exercises maintain joint mobility. Pillows under the knees promote flexion contracture. While DVT prevention is important, the question specifically asks about contracture prevention."
      }
    ]
  },

  "chronic-fatigue-syndrome": {
    title: "Chronic Fatigue Syndrome",
    cellular: {
      title: "Neuroimmune Dysfunction",
      content: "Chronic fatigue syndrome (CFS), also called myalgic encephalomyelitis (ME/CFS), is a complex neuroimmune disorder characterized by profound, disabling fatigue that is not explained by any underlying medical condition and is not relieved by rest. The pathophysiology involves dysfunction of multiple systems: the immune system shows chronic low-grade activation with elevated pro-inflammatory cytokines and decreased natural killer cell function. The autonomic nervous system demonstrates dysregulation with orthostatic intolerance, abnormal heart rate responses, and impaired blood pressure regulation. Mitochondrial dysfunction reduces cellular ATP production, explaining exercise intolerance and the hallmark symptom of post-exertional malaise (PEM), where even minimal physical or cognitive activity triggers prolonged symptom exacerbation lasting 24 hours or more. The HPA axis shows blunted cortisol responses. Neuroinflammation in the brainstem and limbic system contributes to cognitive impairment, pain amplification, and sleep disturbance. Unlike depression-related fatigue, ME/CFS fatigue has a distinct post-exertional component and does not improve with exercise."
    },
    riskFactors: [
      "Female sex - affects women 2-4 times more frequently than men",
      "Preceding acute viral infection (EBV, HHV-6, enteroviruses) triggering immune dysregulation",
      "Age 30-50 years at onset with peak incidence in the fourth decade",
      "History of significant physical or emotional stressor preceding symptom onset",
      "Genetic predisposition with familial clustering suggesting heritable susceptibility",
      "Pre-existing autoimmune conditions sharing immune dysregulation pathways",
      "COVID-19 infection - significant proportion of long COVID patients meet ME/CFS criteria"
    ],
    diagnostics: [
      "Diagnosis of exclusion - all alternative medical and psychiatric causes must be ruled out",
      "Fatigue persisting for 6 months or more that substantially reduces activity level",
      "Post-exertional malaise lasting more than 24 hours after previously tolerated physical or mental activity",
      "Unrefreshing sleep despite adequate duration",
      "Cognitive impairment (brain fog) and/or orthostatic intolerance documented by tilt-table testing",
      "All routine labs (CBC, CMP, TSH, CRP) within normal limits by definition"
    ],
    management: [
      "Activity pacing to stay within the energy envelope and avoid triggering post-exertional malaise",
      "Graded activity management (NOT graded exercise therapy which can worsen symptoms)",
      "Sleep hygiene optimization with pharmacologic sleep aids for persistent insomnia",
      "Low-dose naltrexone for immune modulation and symptom management in some patients",
      "Cognitive behavioral therapy to develop coping strategies - not to 'cure' the condition",
      "Orthostatic intolerance management with increased fluid and salt intake, compression stockings"
    ],
    nursingActions: [
      "Validate the patient's experience - ME/CFS is a real physiologic condition, not psychological",
      "Teach energy conservation and activity pacing to prevent post-exertional malaise crashes",
      "Assess for depression and suicidal ideation, which commonly co-occur with chronic illness",
      "Help patient identify their activity threshold and plan activities within their energy envelope",
      "Educate about the difference between ME/CFS fatigue and normal tiredness - rest does not restore energy",
      "Monitor for orthostatic intolerance symptoms and teach strategies for positional changes"
    ],
    signs: {
      left: [
        "Profound fatigue persisting more than 6 months, substantially reducing functional capacity",
        "Post-exertional malaise - disproportionate symptom worsening 12-48 hours after activity",
        "Unrefreshing sleep - patients wake feeling as exhausted as when they went to bed",
        "Cognitive impairment including poor concentration, word-finding difficulty, and memory lapses"
      ],
      right: [
        "Orthostatic intolerance with dizziness, tachycardia, or presyncope upon standing",
        "Widespread myalgia and arthralgia without joint inflammation or deformity",
        "Sore throat and tender cervical or axillary lymph nodes (immune activation)",
        "Headaches of new type, pattern, or severity not present before illness onset"
      ]
    },
    medications: [
      {
        name: "Low-Dose Naltrexone",
        type: "Opioid Antagonist (Immunomodulator at Low Dose)",
        action: "At low doses (1-4.5 mg), transiently blocks opioid receptors causing upregulation of endogenous endorphins and enkephalins, and reduces microglial activation thereby decreasing neuroinflammation",
        sideEffects: "Vivid dreams, transient headache, nausea (usually resolve within 2 weeks), sleep disturbance initially",
        contra: "Concurrent opioid use (will precipitate withdrawal), acute hepatitis, liver failure",
        pearl: "Must be compounded at low doses (standard naltrexone is 50 mg) - taken at bedtime because the transient opioid blockade triggers endorphin upregulation during sleep"
      }
    ],
    pearls: [
      "Post-exertional malaise (PEM) is the hallmark distinguishing feature - patients feel worse 12-48 hours after activity rather than better, which is opposite to depression where exercise typically helps",
      "Graded exercise therapy (GET) has been shown to harm many ME/CFS patients - activity pacing within the energy envelope is the evidence-based approach",
      "All standard laboratory values must be normal for ME/CFS diagnosis - any abnormal findings should trigger investigation for an alternative diagnosis"
    ],
    quiz: [
      {
        question: "A patient with chronic fatigue syndrome reports feeling significantly worse two days after a short walk. Which term describes this phenomenon?",
        options: [
          "Exercise intolerance from deconditioning",
          "Psychosomatic symptom amplification",
          "Post-exertional malaise from neuroimmune dysfunction",
          "Malingering behavior to avoid activity"
        ],
        correct: 2,
        rationale: "Post-exertional malaise (PEM) is the hallmark symptom of ME/CFS where symptoms disproportionately worsen 12-48 hours after previously tolerated activity due to neuroimmune dysfunction and impaired energy metabolism. This distinguishes ME/CFS from deconditioning or psychiatric conditions."
      }
    ]
  },

  "disuse-atrophy": {
    title: "Disuse Atrophy",
    cellular: {
      title: "Muscle Wasting from Immobility",
      content: "Disuse atrophy is the progressive loss of muscle mass, strength, and function resulting from decreased neuromuscular stimulation and mechanical loading. When muscles are not contracted against resistance, the rate of protein degradation exceeds synthesis, leading to net protein loss. The ubiquitin-proteasome pathway is upregulated, tagging muscle proteins for destruction. Type II (fast-twitch, glycolytic) muscle fibers atrophy more rapidly than Type I (slow-twitch, oxidative) fibers. Muscle mass can decrease by 1-3% per day of complete bedrest, with up to 40% strength loss in the first week of immobilization. Simultaneously, muscle becomes infiltrated with intramuscular fat and connective tissue, reducing contractile capacity even beyond what pure mass loss would predict. The neuromuscular junction also deteriorates with disuse - motor end plates become less responsive to acetylcholine, and nerve conduction velocity decreases. Bone loss parallels muscle loss because the mechanical loading from muscle contraction is a primary stimulus for osteoblast activity (Wolff's law). Recovery from disuse atrophy requires significantly longer than the period of immobilization - approximately 2-3 times the immobilization duration."
    },
    riskFactors: [
      "Prolonged bedrest from illness, surgery, or trauma - muscle loss begins within 24-48 hours",
      "Cast immobilization restricting muscle contraction in the affected extremity",
      "Mechanical ventilation preventing diaphragm contraction causing ventilator-induced diaphragmatic dysfunction",
      "Spinal cord injury eliminating voluntary motor signals below the lesion level",
      "Advanced age with sarcopenia as baseline - older adults lose muscle mass faster with immobility",
      "Malnutrition and inadequate protein intake preventing muscle protein synthesis",
      "Critical illness with catabolic hormonal milieu (elevated cortisol, decreased testosterone/growth hormone)",
      "Chronic disease states including heart failure, COPD, and cancer causing cachexia"
    ],
    diagnostics: [
      "Visible muscle wasting and decreased limb circumference measured with tape at consistent landmarks",
      "Manual muscle testing showing decreased strength graded on 0-5 scale",
      "Functional assessment revealing inability to perform previously manageable activities",
      "DEXA scan showing decreased lean body mass compared to baseline",
      "EMG showing decreased motor unit recruitment and amplitude in affected muscles"
    ],
    management: [
      "Early mobilization within 24 hours of hospitalization when medically stable",
      "Isometric exercises for immobilized limbs - muscle contraction without joint movement maintains some fiber integrity",
      "Progressive resistance training during recovery phase starting with light resistance",
      "High-protein diet (1.2-1.5 g/kg/day) to support muscle protein synthesis during recovery",
      "Neuromuscular electrical stimulation for patients unable to perform voluntary contraction",
      "Referral to physical therapy for individualized strengthening program"
    ],
    nursingActions: [
      "Implement early mobilization protocols - dangle, stand, ambulate within 24 hours when safe",
      "Perform passive ROM exercises for unconscious or paralyzed patients every 2-4 hours",
      "Teach and supervise isometric exercises (quad sets, gluteal sets, ankle pumps) for patients on bedrest",
      "Monitor nutritional intake ensuring adequate protein and caloric consumption",
      "Measure and document limb circumference at consistent landmarks to track muscle mass changes",
      "Assess functional mobility using standardized tools and set progressive activity goals daily",
      "Coordinate with dietary services for high-protein supplementation when oral intake is inadequate"
    ],
    signs: {
      left: [
        "Visible muscle wasting with decreased bulk compared to contralateral limb",
        "Decreased limb circumference measurable by tape at consistent landmarks",
        "Muscle weakness on manual testing - inability to resist gravity or examiner pressure",
        "Loss of muscle tone - flaccid, doughy feeling on palpation"
      ],
      right: [
        "Decreased functional capacity - difficulty with ADLs previously performed independently",
        "Fatigue with minimal exertion from reduced aerobic capacity",
        "Joint stiffness from concurrent periarticular connective tissue changes",
        "Decreased balance and coordination increasing fall risk"
      ]
    },
    medications: [
      {
        name: "Protein Supplementation",
        type: "Nutritional Supplement",
        action: "Provides essential amino acids (particularly leucine) to stimulate mammalian target of rapamycin (mTOR) pathway, activating muscle protein synthesis and counteracting proteolysis",
        sideEffects: "Renal stress with excessive intake in patients with pre-existing kidney disease, GI bloating, potential hyperkalemia from protein metabolism",
        contra: "Severe renal impairment (unadjusted high-protein intake), hepatic encephalopathy, metabolic acidosis from protein catabolism",
        pearl: "Protein intake of 1.2-1.5 g/kg/day is recommended for immobilized patients - timing protein within 2 hours of exercise maximizes muscle protein synthesis"
      }
    ],
    pearls: [
      "Muscle strength decreases by 1-1.5% per day and 10-15% per week of bedrest - early mobilization is the single most effective intervention to prevent disuse atrophy",
      "It takes 2-3 times longer to regain muscle mass than it took to lose it - a patient on 2 weeks of bedrest may require 4-6 weeks of rehabilitation",
      "Isometric exercises (contracting the muscle without moving the joint) can be performed even in casted extremities and significantly reduce atrophy compared to complete immobilization"
    ],
    quiz: [
      {
        question: "A nurse is caring for a patient on bedrest for 4 days following hip surgery. Which intervention best prevents disuse atrophy?",
        options: [
          "Administer analgesics to keep the patient comfortable in bed",
          "Apply sequential compression devices to both lower extremities",
          "Teach quadriceps setting exercises and assist with early ambulation",
          "Maintain the patient in a supine position with pillows for support"
        ],
        correct: 2,
        rationale: "Quadriceps setting (isometric exercises) and early ambulation directly combat disuse atrophy by stimulating muscle protein synthesis, maintaining neuromuscular junction integrity, and preventing sarcomere loss. SCDs prevent DVT but do not prevent atrophy. Comfort measures and positioning alone allow muscle wasting to continue."
      }
    ]
  },

  "traction": {
    title: "Traction",
    cellular: {
      title: "Skeletal vs Skin Traction, Pin Care",
      content: "Traction is the application of a pulling force to a body part to align fractured bones, reduce dislocations, prevent or correct deformities, or relieve muscle spasm. Skin traction (Buck traction) applies force through the skin surface using adhesive wraps, boots, or slings and is limited to 5-8 pounds to prevent skin breakdown. Skeletal traction applies force directly through bone via surgically placed pins, wires, or tongs (Steinmann pins, Kirschner wires, Crutchfield tongs), allowing much greater weight (up to 25-30 pounds) for long bone fractures. The counterforce is provided by the patient's body weight and bed positioning. Traction works by applying a steady longitudinal pull that overcomes muscle spasm, restores length to shortened limbs, and maintains fracture reduction while healing occurs. Pin sites create a direct portal of entry from the external environment to the bone, making osteomyelitis a serious risk. The sustained position during traction predisposes to numerous complications including DVT, pressure injuries, pneumonia, constipation, and neurovascular compromise from compression or swelling."
    },
    riskFactors: [
      "Pin site contamination from improper cleaning technique introducing bacteria to bone",
      "Prolonged immobilization during traction increasing risk for DVT, PE, and pressure injuries",
      "Excessive traction weight causing nerve damage, vascular compression, or nonunion",
      "Improper countertraction allowing the patient to slide toward the weight, negating the pulling force",
      "Pre-existing peripheral vascular disease compromising perfusion in the traction extremity",
      "Skin breakdown under adhesive wraps or boot in skin traction application",
      "Malnutrition impairing wound healing at pin sites and fracture healing"
    ],
    diagnostics: [
      "X-ray confirming fracture alignment is maintained under traction",
      "Neurovascular assessment (5 P's) comparing affected to unaffected extremity every 1-2 hours",
      "Pin site assessment for signs of infection - erythema, purulent drainage, increasing pain, loosening",
      "Doppler ultrasound if DVT is suspected in the immobilized extremity",
      "Laboratory monitoring for infection markers (WBC, ESR, CRP) if pin site changes develop"
    ],
    management: [
      "Maintain prescribed traction weight and ensure weights hang freely (never resting on floor or bed frame)",
      "Pin care per facility protocol - typically cleaning with chlorhexidine or normal saline every 8 hours",
      "DVT prophylaxis with low-molecular-weight heparin and sequential compression devices on the unaffected leg",
      "High-fiber diet and stool softeners to prevent constipation from immobility",
      "Incentive spirometry every 1-2 hours while awake to prevent hypostatic pneumonia",
      "Skin care protocol including pressure-relieving mattress and regular turning within traction limits"
    ],
    nursingActions: [
      "Verify traction ropes are in the pulleys, knots are secure, and weights hang freely at all times",
      "Perform neurovascular checks every 1-2 hours: color, temperature, pulses, capillary refill, sensation, movement",
      "Maintain proper body alignment and countertraction - foot of bed elevated for countertraction if ordered",
      "Never remove skeletal traction without physician order - never lift or reposition weights",
      "Perform pin care per protocol, assessing for signs of infection at each pin site",
      "Ensure the patient does not slide toward the foot of the bed, which eliminates countertraction",
      "Assess for complications of immobility - respiratory status, skin integrity, bowel function, circulation"
    ],
    signs: {
      left: [
        "Effective traction: bones in alignment on X-ray, decreased muscle spasm, reduced pain",
        "Pin site infection: erythema, warmth, purulent drainage, loosening of pin, fever",
        "Neurovascular compromise: diminished pulses, pallor, delayed capillary refill distal to traction",
        "DVT: unilateral calf swelling, warmth, tenderness, positive Homan sign (unreliable)"
      ],
      right: [
        "Ineffective traction: ropes off pulleys, weights resting on floor or bed, knots caught in pulley",
        "Skin breakdown: redness, breakdown under skin traction wraps or at pressure points",
        "Compartment syndrome: pain out of proportion, pain with passive stretch, paresthesia",
        "Fat embolism: petechial rash on chest/axillae, tachypnea, confusion (24-72 hours post-fracture)"
      ]
    },
    medications: [
      {
        name: "Enoxaparin",
        type: "Low-Molecular-Weight Heparin (Anticoagulant)",
        action: "Binds to antithrombin III, primarily inhibiting Factor Xa and to a lesser extent Factor IIa, preventing thrombin generation and fibrin clot formation in immobilized patients",
        sideEffects: "Bleeding, injection site bruising, heparin-induced thrombocytopenia (HIT), elevated liver enzymes",
        contra: "Active major bleeding, HIT history, severe thrombocytopenia, epidural/spinal anesthesia (hold 12 hours prior)",
        pearl: "Inject subcutaneously into abdominal fat fold - do NOT aspirate before injection and do NOT rub the site after injection to prevent bruising"
      }
    ],
    pearls: [
      "Weights must hang freely at all times - never rest on the bed, floor, or be lifted during repositioning; removing traction weight disrupts fracture alignment and causes muscle spasm",
      "The 5 P's of neurovascular assessment (Pain, Pallor, Pulselessness, Paresthesia, Paralysis) must be performed every 1-2 hours - paralysis is the LAST finding and indicates irreversible damage",
      "Skin traction is limited to 5-8 pounds maximum and is temporary; skeletal traction can use 25-30 pounds and is used for definitive long bone fracture management"
    ],
    quiz: [
      {
        question: "A nurse finds that a patient's skeletal traction weights are resting on the floor. What is the priority nursing action?",
        options: [
          "Remove the weights and notify the physician",
          "Reposition the weights so they hang freely off the bed",
          "Lower the head of the bed and add more weight",
          "Document the finding and assess the patient at the next scheduled time"
        ],
        correct: 1,
        rationale: "Traction weights must hang freely at all times to maintain the pulling force that keeps the fracture in alignment. Weights resting on the floor eliminate the therapeutic pull. The nurse should immediately reposition the weights to hang freely and check the patient's alignment and neurovascular status. Weights should never be removed without a physician order."
      }
    ]
  },

  "knee-arthroplasty": {
    title: "Knee Arthroplasty",
    cellular: {
      title: "Total Knee Replacement Post-Operative Care",
      content: "Total knee arthroplasty (TKA) involves surgical replacement of the damaged articular surfaces of the knee joint with metal and polyethylene components. The distal femur is resurfaced with a metal femoral component, the proximal tibia receives a metal tibial baseplate with a polyethylene insert, and the undersurface of the patella may be resurfaced. The procedure restores mechanical alignment, eliminates bone-on-bone contact, and relieves pain from end-stage osteoarthritis or inflammatory arthritis. Post-operatively, the surgical wound traverses skin, subcutaneous tissue, the joint capsule, and periosteum. Hemarthrosis (blood accumulation in the joint space) is managed by a surgical drain. The continuous passive motion (CPM) machine applies controlled, repetitive flexion and extension to the knee, preventing adhesion formation within the joint capsule, promoting synovial fluid circulation for cartilage nutrition, and reducing the risk of arthrofibrosis. Venous stasis from immobility combined with surgical tissue trauma and hypercoagulability from the inflammatory response creates a high-risk environment for DVT and pulmonary embolism - the most dangerous post-operative complication."
    },
    riskFactors: [
      "DVT and PE risk elevated due to surgical venous injury, immobility, and inflammatory hypercoagulability",
      "Infection risk at the prosthetic joint - biofilm formation on the prosthesis is difficult to eradicate",
      "Advanced age with multiple comorbidities increasing anesthetic and surgical risk",
      "Obesity increasing mechanical stress on the prosthetic components and wound healing complications",
      "Diabetes mellitus impairing wound healing and increasing surgical site infection risk",
      "Prior knee surgery creating scar tissue that complicates surgical approach and ROM recovery",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk perioperatively"
    ],
    diagnostics: [
      "Post-operative X-ray confirming prosthetic component alignment and positioning",
      "Hemoglobin and hematocrit monitoring for post-operative anemia from surgical blood loss",
      "Doppler ultrasound if DVT is clinically suspected (unilateral calf swelling, tenderness)",
      "Wound assessment for infection signs - increasing erythema, warmth, drainage, dehiscence",
      "Knee flexion measured in degrees to track ROM progress (goal: 90 degrees by discharge)"
    ],
    management: [
      "Early ambulation within 24 hours post-operatively with walker or crutches and physical therapy",
      "CPM machine initiated in PACU or first post-operative day, gradually increasing flexion arc",
      "DVT prophylaxis with enoxaparin or warfarin for 2-6 weeks post-operatively",
      "Multimodal pain management including nerve blocks, NSAIDs, acetaminophen, and limited opioids",
      "Cryotherapy (ice) to manage swelling and pain at the surgical site",
      "Physical therapy twice daily for ROM exercises, strengthening, and gait training"
    ],
    nursingActions: [
      "Perform neurovascular checks every 1-2 hours for first 24 hours - compare affected to unaffected extremity",
      "Monitor surgical drain output and report greater than 200 mL/hour suggesting active hemorrhage",
      "Apply CPM machine as ordered and increase ROM settings per protocol (typically 10 degrees per day)",
      "Elevate operative leg on pillows (avoid placing pillow directly behind the knee - promotes flexion contracture)",
      "Assess for signs of DVT - unilateral calf swelling, tenderness, warmth, erythema",
      "Ensure patient uses incentive spirometry and coughs/deep breathes every 1-2 hours to prevent atelectasis",
      "Educate about long-term precautions - avoid high-impact activities, report signs of prosthetic loosening"
    ],
    signs: {
      left: [
        "Expected post-op: moderate pain (4-6/10), swelling at surgical site, limited ROM initially",
        "Surgical drain output dark red initially, transitioning to serosanguineous within 24-48 hours",
        "DVT: unilateral calf swelling and tenderness, warmth, positive Homan sign",
        "Infection: increasing erythema beyond incision margins, purulent drainage, fever after POD 3"
      ],
      right: [
        "PE: sudden dyspnea, tachycardia, pleuritic chest pain, hypoxemia - medical emergency",
        "Peroneal nerve injury: foot drop, inability to dorsiflex foot, numbness of dorsal foot",
        "Prosthetic loosening: new onset deep knee pain with weight-bearing, clicking sensation",
        "Fat embolism: petechial rash, altered mental status, hypoxemia 24-72 hours post-operatively"
      ]
    },
    medications: [
      {
        name: "Warfarin",
        type: "Vitamin K Antagonist Anticoagulant",
        action: "Inhibits vitamin K epoxide reductase, preventing synthesis of functional clotting factors II, VII, IX, and X, thereby reducing thrombus formation in post-surgical hypercoagulable state",
        sideEffects: "Hemorrhage (GI, intracranial, surgical site), skin necrosis (early therapy), teratogenicity, drug and food interactions",
        contra: "Active bleeding, hemorrhagic stroke, pregnancy, severe hepatic disease, noncompliance with monitoring",
        pearl: "Takes 3-5 days for full anticoagulant effect because existing functional clotting factors must be consumed - bridge with heparin products until INR is therapeutic (2.0-3.0)"
      }
    ],
    pearls: [
      "PE is the number one cause of death after total knee replacement - aggressive DVT prophylaxis and early ambulation are essential preventive measures",
      "Never place a pillow directly behind the knee after TKA - this promotes flexion contracture and inhibits venous return; elevate the entire leg instead",
      "CPM machine settings should be increased gradually (approximately 10 degrees per day) with a goal of 90 degrees flexion by discharge - full ROM recovery may take 3-6 months"
    ],
    quiz: [
      {
        question: "On post-operative day 2 after total knee replacement, a patient develops sudden dyspnea, tachycardia, and chest pain. What should the nurse do first?",
        options: [
          "Administer prescribed oral analgesic for post-operative pain",
          "Apply oxygen and notify the physician immediately",
          "Reposition the patient and encourage deep breathing exercises",
          "Increase the CPM machine to improve circulation"
        ],
        correct: 1,
        rationale: "Sudden dyspnea, tachycardia, and chest pain on POD 2 after TKA are classic signs of pulmonary embolism - the most lethal complication. The priority is to apply oxygen to address hypoxemia and immediately notify the physician for emergent evaluation (CT angiography) and anticoagulation therapy."
      }
    ]
  },

  "residual-limb-care": {
    title: "Residual Limb Care Post Amputation",
    cellular: {
      title: "Stump Shaping, Wrapping Technique",
      content: "Following amputation, the residual limb (stump) undergoes a complex healing process involving wound closure, soft tissue remodeling, and neurological adaptation. The bone end is beveled to prevent pressure points, muscles are anchored over the bone end (myodesis) to provide padding, and skin flaps are sutured to create a well-padded, cylindrical stump suitable for prosthetic fitting. Post-operatively, the limb develops significant edema from surgical trauma and disrupted lymphatic drainage. Elastic bandaging shapes the residual limb into a conical form ideal for prosthetic socket fitting. Phantom limb pain occurs because the cortical map of the amputated limb persists in the somatosensory cortex - neurons that previously received input from the limb continue to fire, and the brain interprets this activity as pain arising from the absent limb. Neuromas (disorganized nerve regrowth at the cut nerve endings) also generate ectopic impulses perceived as pain. Phantom sensation (non-painful awareness of the absent limb) occurs in virtually all amputees and is distinct from phantom pain."
    },
    riskFactors: [
      "Peripheral vascular disease (the most common reason for lower extremity amputation)",
      "Diabetes mellitus causing neuropathy, peripheral vascular disease, and impaired wound healing",
      "Smoking causing vasoconstriction that compromises residual limb perfusion and flap survival",
      "Infection at the surgical site delaying wound healing and potentially requiring revision",
      "Poor nutritional status impairing tissue repair and increasing infection susceptibility",
      "Pre-amputation pain - patients with significant pain before surgery have higher phantom pain incidence",
      "Traumatic amputation with irregular wound edges and contamination versus planned surgical amputation"
    ],
    diagnostics: [
      "Wound assessment monitoring for adequate flap perfusion, dehiscence, and infection signs",
      "Limb circumference measurements tracking edema reduction and readiness for prosthetic fitting",
      "Doppler assessment of residual limb blood flow to ensure adequate perfusion for healing",
      "Pain assessment differentiating phantom pain, phantom sensation, and residual limb (stump) pain",
      "Functional assessment evaluating upper body strength and balance for prosthetic training readiness"
    ],
    management: [
      "Elastic bandage wrapping in figure-eight pattern from distal to proximal to shape the limb conically",
      "Gradual limb conditioning through gentle weight-bearing (pushing stump against progressively harder surfaces)",
      "Phantom pain management with gabapentin, mirror therapy, TENS, and tricyclic antidepressants",
      "Progressive prosthetic training beginning when wound is healed and edema is controlled",
      "Psychological support for body image adjustment and grief processing",
      "Below-knee amputation: position prone several times daily to prevent hip flexion contracture"
    ],
    nursingActions: [
      "Wrap residual limb with elastic bandage in figure-eight pattern, rewrapping every 4-6 hours and when loosened",
      "Elevate limb for first 24-48 hours only, then position flat or prone to prevent flexion contracture",
      "Inspect the residual limb daily for skin breakdown, color changes, swelling, and wound healing progress",
      "Position patient prone for 20-30 minutes several times daily to stretch hip flexors and prevent contracture",
      "Differentiate and assess phantom pain separately from incisional pain using appropriate pain scales",
      "Teach the patient to push the residual limb against progressively firmer surfaces for desensitization",
      "Assess emotional adjustment and refer to support groups and psychological services as needed"
    ],
    signs: {
      left: [
        "Phantom pain - burning, cramping, or shooting pain perceived in the amputated portion",
        "Phantom sensation - non-painful awareness of the absent limb (itching, tingling, pressure)",
        "Residual limb edema - expected post-operatively, managed with compression wrapping",
        "Incisional pain at the surgical site - peaks at 24-72 hours and gradually resolves"
      ],
      right: [
        "Wound dehiscence - separation of surgical flaps from tension, infection, or inadequate blood supply",
        "Flexion contracture of the proximal joint from prolonged elevated or flexed positioning",
        "Skin breakdown from improper wrapping technique or prosthetic socket pressure points",
        "Neuroma formation causing localized shooting pain at the residual limb end on palpation"
      ]
    },
    medications: [
      {
        name: "Gabapentin",
        type: "Anticonvulsant/Neuropathic Pain Agent",
        action: "Binds alpha-2-delta subunit of voltage-gated calcium channels in dorsal horn neurons, reducing excitatory neurotransmitter release and dampening aberrant nerve firing responsible for phantom pain",
        sideEffects: "Drowsiness, dizziness, peripheral edema, weight gain, ataxia",
        contra: "Severe renal impairment (dose adjustment required), suicidal ideation risk (monitor closely)",
        pearl: "Start low (100-300 mg at bedtime) and titrate slowly over weeks - sedation is the dose-limiting side effect but often improves with continued use"
      }
    ],
    pearls: [
      "Elastic bandage must be wrapped in a figure-eight pattern (NOT circular) from distal to proximal to create the conical shape needed for prosthetic fitting and to prevent tourniquet effect",
      "Elevate the residual limb for the first 24-48 hours post-op to reduce edema, then discontinue elevation and begin prone positioning to prevent hip flexion contracture",
      "Mirror therapy works by placing a mirror to reflect the intact limb, creating a visual illusion that allows the brain to 'move' the phantom limb and reduce cortical pain signals"
    ],
    quiz: [
      {
        question: "A patient is 3 days post below-knee amputation. Which positioning intervention should the nurse implement?",
        options: [
          "Elevate the residual limb on two pillows at all times to reduce edema",
          "Position prone for 20-30 minutes several times daily to prevent hip flexion contracture",
          "Keep the knee flexed on a pillow for comfort at all times",
          "Maintain the patient in a wheelchair with the residual limb hanging dependent"
        ],
        correct: 1,
        rationale: "After the first 24-48 hours, the residual limb should be positioned flat or the patient should lie prone to prevent hip flexion contracture, which would prevent prosthetic fitting and ambulation. Prolonged elevation, flexion, and dependent positioning all promote contracture formation."
      }
    ]
  },

  "rib-fractures": {
    title: "Rib Fractures",
    cellular: {
      title: "Flail Chest, Splinting, and Pneumothorax Risk",
      content: "Rib fractures occur when direct trauma exceeds the structural tolerance of the rib cortex. Simple fractures involve a single break in one rib, while flail chest occurs when three or more adjacent ribs are fractured in two or more places each, creating a free-floating segment that moves paradoxically with respiration. During inspiration, negative intrathoracic pressure causes the flail segment to retract inward while the intact chest wall expands outward, and during expiration the segment bulges outward. This paradoxical motion impairs the bellows mechanism needed for effective ventilation and may cause underlying pulmonary contusion. Sharp fracture ends can lacerate the intercostal vessels (causing hemothorax), puncture the parietal pleura and lung parenchyma (causing pneumothorax), or injure abdominal organs (liver with right lower rib fractures, spleen with left lower rib fractures). Pain from rib fractures causes voluntary splinting - patients restrict chest wall excursion to minimize pain, leading to atelectasis, retained secretions, and pneumonia. This pain-splinting-complication cycle is the primary driver of morbidity."
    },
    riskFactors: [
      "Blunt chest trauma from motor vehicle accidents, falls, or assault",
      "Osteoporosis causing fractures with minimal force, especially in elderly women",
      "Chronic steroid use weakening bone cortex through osteoclast activation",
      "Elderly age - rib compliance decreases with calcification of costal cartilage",
      "Contact sports and high-velocity recreational activities",
      "Repetitive stress from severe chronic coughing (pathologic cough fractures)",
      "Metastatic bone disease weakening ribs from tumor-replaced cortex"
    ],
    diagnostics: [
      "Chest X-ray - may miss non-displaced fractures but essential for detecting hemothorax and pneumothorax",
      "CT chest providing superior sensitivity for rib fracture detection and assessment of pulmonary contusion",
      "Point-of-care ultrasound detecting fractures, pneumothorax, and hemothorax at the bedside",
      "Arterial blood gas showing hypoxemia and possible respiratory acidosis from hypoventilation",
      "CBC monitoring for dropping hemoglobin suggesting hemothorax accumulation"
    ],
    management: [
      "Aggressive multimodal pain control to enable deep breathing - the most critical intervention",
      "Epidural analgesia or intercostal nerve blocks for severe pain not controlled by systemic medications",
      "Incentive spirometry 10 times per hour while awake to prevent atelectasis and pneumonia",
      "Mechanical ventilation with PEEP for flail chest causing respiratory failure",
      "Chest tube insertion for pneumothorax or hemothorax",
      "Avoid external rib splinting or binding - restricts chest expansion and worsens atelectasis"
    ],
    nursingActions: [
      "Assess respiratory status every 1-2 hours - rate, depth, SpO2, auscultation of bilateral lung sounds",
      "Administer analgesics proactively to enable deep breathing and coughing - pain control is therapeutic",
      "Encourage and assist with incentive spirometry use, splinting the chest with a pillow during coughing",
      "Monitor for signs of pneumothorax - sudden dyspnea, absent breath sounds, tracheal deviation, subcutaneous emphysema",
      "Assess for hemothorax - decreasing breath sounds at base, dullness to percussion, dropping hemoglobin",
      "Position with HOB elevated 30-45 degrees and affected side down to splint the fracture and optimize ventilation",
      "Teach patient to hug a pillow against the chest during coughing to provide support without external binding"
    ],
    signs: {
      left: [
        "Localized chest wall tenderness and crepitus at fracture site on palpation",
        "Paradoxical chest wall movement (inward on inspiration) indicating flail segment",
        "Shallow, guarded respirations (splinting) to minimize pain",
        "Ecchymosis over the fracture site from subcutaneous hemorrhage"
      ],
      right: [
        "Dyspnea and tachypnea from pain-limited ventilation and possible pneumothorax",
        "Diminished or absent breath sounds on the affected side suggesting pneumothorax or hemothorax",
        "Subcutaneous emphysema (crepitus under skin) indicating air leak from pneumothorax",
        "Hypoxemia on pulse oximetry from impaired gas exchange"
      ]
    },
    medications: [
      {
        name: "Ketorolac",
        type: "Parenteral NSAID (Non-Opioid Analgesic)",
        action: "Inhibits cyclooxygenase-1 and -2 enzymes, reducing prostaglandin synthesis and providing potent anti-inflammatory and analgesic effects equivalent to moderate-dose opioids",
        sideEffects: "GI bleeding (highest NSAID risk), renal impairment, platelet dysfunction, surgical site bleeding",
        contra: "Active GI bleeding or peptic ulcer disease, renal impairment, post-CABG, concurrent anticoagulants, use exceeding 5 days",
        pearl: "Limited to 5 days maximum of parenteral use due to high GI bleeding risk - provides opioid-equivalent analgesia without respiratory depression, making it ideal for rib fractures where sedation impairs cough"
      }
    ],
    pearls: [
      "Never apply rib binders or external splints - they restrict chest wall expansion and promote atelectasis, the opposite of what is needed. Teach patients to pillow-splint during coughing instead",
      "The most dangerous complication of rib fractures is NOT the fracture itself but the pneumonia and respiratory failure that result from pain-induced hypoventilation and secretion retention",
      "Left lower rib fractures raise suspicion for splenic injury; right lower rib fractures raise suspicion for hepatic injury - always assess for abdominal organ damage"
    ],
    quiz: [
      {
        question: "A patient with multiple rib fractures is reluctant to take deep breaths due to pain. Which nursing intervention is the highest priority?",
        options: [
          "Apply a rib binder to stabilize the fractures",
          "Administer prescribed analgesics to enable effective deep breathing",
          "Keep the patient on strict bedrest to prevent further injury",
          "Administer a sedative to help the patient relax and sleep"
        ],
        correct: 1,
        rationale: "Pain control is the most critical intervention for rib fractures because pain-induced splinting leads to hypoventilation, atelectasis, secretion retention, and pneumonia. Adequate analgesia enables deep breathing, coughing, and use of incentive spirometry. Rib binders are contraindicated, and sedation impairs respiratory drive."
      }
    ]
  },

  "osteomalacia": {
    title: "Osteomalacia",
    cellular: {
      title: "Vitamin D Deficiency and Bone Softening",
      content: "Osteomalacia is a metabolic bone disease characterized by inadequate mineralization of newly formed osteoid (the organic bone matrix). Normal bone formation requires osteoblasts to lay down osteoid which then undergoes mineralization with calcium and phosphate crystals (hydroxyapatite). Vitamin D is essential for this process because it promotes intestinal absorption of calcium and phosphate, maintains serum calcium levels, and directly stimulates osteoblast mineralization activity. When vitamin D is deficient, serum calcium drops, triggering secondary hyperparathyroidism - PTH is released to mobilize calcium from existing bone, further weakening the skeleton. The osteoid accumulates in excessive amounts but remains unmineralized, producing bone that is soft, pliable, and susceptible to bowing deformities and pseudofractures (Looser zones - radiolucent lines perpendicular to the bone cortex representing bands of unmineralized osteoid). In children, this same process at the growth plates produces rickets with widened, frayed metaphyses and skeletal deformities. Unlike osteoporosis where there is overall bone loss, osteomalacia has normal or increased osteoid volume but defective mineralization."
    },
    riskFactors: [
      "Inadequate sunlight exposure - UV-B radiation converts 7-dehydrocholesterol to cholecalciferol in the skin",
      "Dietary vitamin D deficiency especially in strict vegan diets without supplementation",
      "Malabsorption syndromes (celiac disease, Crohn disease, post-gastric bypass) reducing fat-soluble vitamin absorption",
      "Chronic kidney disease preventing conversion of 25-hydroxyvitamin D to active 1,25-dihydroxyvitamin D",
      "Hepatic disease impairing 25-hydroxylation of vitamin D in the liver",
      "Anticonvulsant therapy (phenytoin, carbamazepine) accelerating hepatic vitamin D catabolism via CYP450 induction",
      "Dark skin pigmentation requiring more sunlight exposure for equivalent vitamin D synthesis",
      "Elderly institutionalized patients with limited sun exposure and decreased skin synthesis capacity"
    ],
    diagnostics: [
      "Serum 25-hydroxyvitamin D level below 20 ng/mL confirming deficiency",
      "Elevated serum alkaline phosphatase from increased osteoblast activity attempting to compensate",
      "Decreased serum calcium and phosphorus from impaired intestinal absorption",
      "Elevated PTH (secondary hyperparathyroidism) in response to hypocalcemia",
      "X-ray showing Looser zones (pseudofractures), generalized osteopenia, and bowing deformities",
      "DEXA scan showing decreased bone mineral density (but does not distinguish osteomalacia from osteoporosis)"
    ],
    management: [
      "Vitamin D supplementation - ergocalciferol (D2) or cholecalciferol (D3) at therapeutic doses",
      "Calcium supplementation (1000-1500 mg daily) to provide substrate for bone mineralization",
      "Treatment of underlying cause (malabsorption, renal disease, medication adjustment)",
      "Active vitamin D (calcitriol) for patients with renal failure who cannot convert to active form",
      "Weight-bearing exercise to stimulate osteoblast activity once vitamin D levels are repleted",
      "Fall prevention measures during treatment phase as weakened bones remain fracture-prone"
    ],
    nursingActions: [
      "Assess for musculoskeletal symptoms - diffuse bone pain, proximal muscle weakness, waddling gait",
      "Monitor serum calcium levels during supplementation and watch for hypercalcemia symptoms",
      "Educate about dietary sources of vitamin D - fortified milk, fatty fish, egg yolks, fortified cereals",
      "Encourage safe sunlight exposure (10-15 minutes to arms and face several times weekly)",
      "Implement fall prevention measures - the combination of muscle weakness and soft bones increases fracture risk",
      "Assess medication list for drugs that deplete vitamin D (anticonvulsants, cholestyramine, glucocorticoids)"
    ],
    signs: {
      left: [
        "Diffuse bone pain - characteristically aching, poorly localized, and worse with weight-bearing",
        "Proximal muscle weakness - difficulty rising from a chair or climbing stairs",
        "Waddling gait from pelvic girdle muscle weakness and bowing of lower extremities",
        "Bone tenderness on palpation, especially over the shins, pelvis, and spine"
      ],
      right: [
        "Pathologic fractures with minimal trauma in long bones and vertebrae",
        "Skeletal deformities - bowing of long bones from softened bone yielding to body weight",
        "Tetany and paresthesias if hypocalcemia becomes severe",
        "Dental abnormalities - delayed eruption, enamel defects, and increased caries in children"
      ]
    },
    medications: [
      {
        name: "Cholecalciferol (Vitamin D3)",
        type: "Fat-Soluble Vitamin Supplement",
        action: "Undergoes hepatic 25-hydroxylation and renal 1-alpha-hydroxylation to form calcitriol (1,25-dihydroxyvitamin D), which increases intestinal calcium and phosphate absorption and promotes osteoid mineralization",
        sideEffects: "Hypercalcemia with excessive dosing (nausea, vomiting, constipation, polyuria, nephrolithiasis), hypervitaminosis D causing metastatic calcification",
        contra: "Hypercalcemia, hypervitaminosis D, malabsorption-related inability to absorb fat-soluble vitamins (parenteral form may be needed)",
        pearl: "D3 (cholecalciferol) is more potent than D2 (ergocalciferol) at raising serum 25(OH)D levels - take with a fatty meal to enhance absorption as it is fat-soluble"
      }
    ],
    pearls: [
      "Osteomalacia has too much osteoid with too little mineral; osteoporosis has too little bone overall with normal mineralization - this is the key pathologic distinction",
      "Looser zones (pseudofractures) are pathognomonic for osteomalacia - they appear as radiolucent bands perpendicular to the cortex at sites of mechanical stress",
      "Secondary hyperparathyroidism with elevated ALP, low calcium, and low phosphorus is the characteristic lab pattern - if calcium is normal, osteomalacia is unlikely"
    ],
    quiz: [
      {
        question: "A patient with chronic kidney disease develops diffuse bone pain, proximal muscle weakness, and elevated alkaline phosphatase. Which laboratory finding would the nurse expect?",
        options: [
          "Elevated serum calcium and suppressed PTH",
          "Normal serum calcium and normal phosphorus",
          "Decreased serum calcium with elevated PTH",
          "Elevated serum phosphorus with decreased alkaline phosphatase"
        ],
        correct: 2,
        rationale: "CKD prevents renal conversion of vitamin D to its active form, causing decreased calcium absorption, hypocalcemia, and compensatory secondary hyperparathyroidism (elevated PTH). The elevated alkaline phosphatase reflects increased osteoblast activity attempting to mineralize bone without adequate calcium and phosphate."
      }
    ]
  },

  "acute-lumbosacral-strain": {
    title: "Acute Lumbosacral Strain",
    image: imgLumbarSacralStrain,
    cellular: {
      title: "Paravertebral Muscle and Ligament Injury",
      content: "Acute lumbosacral strain involves stretching or microscopic tearing of the paravertebral muscles, tendons, or ligaments supporting the lumbar spine and sacroiliac region. The lumbar spine bears the greatest mechanical load in the body, and the erector spinae, multifidus, and quadratus lumborum muscles provide dynamic stabilization during movement. When these muscles are subjected to forces exceeding their tensile strength - through lifting, twisting, or sudden uncoordinated movements - myofibrils tear and release intracellular enzymes and inflammatory mediators. Prostaglandins, histamine, and bradykinin sensitize local nociceptors, producing pain. The body responds with protective muscle spasm - involuntary sustained contraction of surrounding muscles that splints the injured area to prevent further damage. While initially protective, prolonged spasm compresses local blood vessels, creating ischemia that generates more pain mediators, establishing a self-perpetuating pain-spasm-pain cycle. The injury is self-limiting with proper management, typically resolving within 2-6 weeks as collagen repair restores tissue integrity."
    },
    riskFactors: [
      "Improper lifting mechanics - bending at the waist rather than squatting with a straight back",
      "Sudden twisting movements while lifting heavy objects",
      "Weak core musculature providing inadequate spinal stabilization",
      "Sedentary lifestyle with deconditioning of paraspinal muscles",
      "Obesity increasing mechanical load on lumbar structures",
      "Occupations requiring repetitive heavy lifting, bending, or prolonged sitting",
      "Prior lumbar strain creating scar tissue with decreased flexibility at the injury site"
    ],
    diagnostics: [
      "Clinical diagnosis based on history and physical exam - imaging not indicated in acute uncomplicated cases",
      "Localized paravertebral muscle tenderness and spasm on palpation without neurologic deficits",
      "Negative straight leg raise test - absence of nerve root compression signs",
      "Normal neurologic exam (intact reflexes, motor strength, and dermatomal sensation)",
      "X-ray or MRI only if red flag symptoms present (fever, weight loss, bowel/bladder dysfunction, progressive neurologic deficit)"
    ],
    management: [
      "Brief rest period (24-48 hours maximum) followed by early return to modified activities",
      "NSAIDs and acetaminophen for pain relief and anti-inflammatory effect",
      "Muscle relaxants (cyclobenzaprine) for short-term management of acute spasm",
      "Application of ice for the first 48 hours then moist heat to relax muscle spasm",
      "Physical therapy for core strengthening once acute pain resolves",
      "Ergonomic workplace modifications and proper body mechanics education"
    ],
    nursingActions: [
      "Assess pain location, intensity, and character - mechanical back pain is localized without radiation below the knee",
      "Teach proper body mechanics: squat with straight back, hold objects close to body, avoid twisting while lifting",
      "Advise against prolonged bedrest - studies show bedrest beyond 48 hours delays recovery",
      "Apply ice packs during first 48 hours, transition to moist heat for muscle relaxation",
      "Screen for red flags requiring urgent evaluation: saddle anesthesia, bowel/bladder dysfunction, progressive weakness",
      "Educate about gradual return to activity and avoidance of re-injury during recovery"
    ],
    signs: {
      left: [
        "Localized low back pain that worsens with movement, bending, and lifting",
        "Paravertebral muscle spasm - palpable taut bands in the erector spinae muscles",
        "Limited range of motion in lumbar flexion and lateral bending from pain and spasm",
        "Antalgic posture - leaning away from the painful side to offload the injured tissues"
      ],
      right: [
        "Pain does NOT radiate below the knee (distinguishes from disc herniation with radiculopathy)",
        "Intact neurologic examination - no motor weakness, sensory changes, or reflex abnormalities",
        "Negative straight leg raise test - no sciatic nerve root involvement",
        "Pain that improves with rest and recurs with physical activity"
      ]
    },
    medications: [
      {
        name: "Methocarbamol",
        type: "Centrally Acting Skeletal Muscle Relaxant",
        action: "Depresses polysynaptic reflexes in the spinal cord and brainstem, reducing skeletal muscle hypertonicity and breaking the pain-spasm-pain cycle without directly acting on the muscle",
        sideEffects: "Drowsiness, dizziness, GI upset, brown-black-green discoloration of urine (harmless), headache",
        contra: "Known hypersensitivity, renal impairment (injectable form contains polyethylene glycol), myasthenia gravis",
        pearl: "The urine discoloration is harmless and expected - educate patients in advance to prevent unnecessary anxiety and emergency department visits"
      }
    ],
    pearls: [
      "Prolonged bedrest (more than 48 hours) is harmful in acute lumbosacral strain - it promotes deconditioning, increases disability perception, and delays return to function",
      "The absence of neurologic deficits and negative straight leg raise distinguishes simple strain from disc herniation with nerve root compression",
      "Red flag symptoms requiring emergent evaluation: saddle anesthesia, bowel/bladder incontinence, bilateral leg weakness (cauda equina syndrome), fever with back pain (spinal infection)"
    ],
    quiz: [
      {
        question: "A patient with acute lumbosacral strain asks the nurse how long they should stay in bed. What is the best nursing response?",
        options: [
          "Stay in bed for at least one week until the pain completely resolves",
          "Limit bed rest to 24-48 hours, then gradually return to modified activities",
          "Alternate one hour in bed with one hour of vigorous activity",
          "Remain in bed until you can touch your toes without pain"
        ],
        correct: 1,
        rationale: "Evidence-based practice limits bed rest to a maximum of 24-48 hours for acute lumbosacral strain. Prolonged bed rest promotes deconditioning, muscle wasting, and psychological disability. Early gradual return to modified activities improves outcomes and shortens recovery time."
      }
    ]
  },

  "lumbosacral-disc-herniation": {
    title: "Lumbosacral Disc Herniation",
    cellular: {
      title: "Nucleus Pulposus Herniation",
      content: "Lumbosacral disc herniation occurs when the nucleus pulposus (the gel-like center of the intervertebral disc) protrudes through a weakened or torn annulus fibrosus (the tough outer fibrous ring), compressing adjacent spinal nerve roots. The most common levels are L4-L5 and L5-S1 because these segments bear the greatest axial load and undergo the most flexion-extension motion. The herniated nuclear material not only mechanically compresses the nerve root but also releases inflammatory mediators (phospholipase A2, TNF-alpha, IL-6) that chemically irritate the nerve, causing radiculopathy even without direct compression. Nerve root compression produces dermatomal pain (sciatica), sensory changes, motor weakness, and reflex abnormalities corresponding to the affected nerve root level. L5 radiculopathy causes weakness of great toe dorsiflexion and numbness of the dorsal foot, while S1 radiculopathy causes weakness of ankle plantarflexion, numbness of the lateral foot, and diminished Achilles reflex. Cauda equina syndrome occurs when a large central herniation compresses multiple nerve roots simultaneously, causing bilateral leg symptoms, saddle anesthesia, and bowel/bladder dysfunction - this is a surgical emergency."
    },
    riskFactors: [
      "Repetitive flexion and rotation loading of the lumbar spine degrading annulus fibrosus integrity",
      "Heavy lifting with improper mechanics concentrating compressive forces on the posterior disc",
      "Prolonged sitting causing sustained flexion loading and posterior disc pressure",
      "Smoking decreasing disc nutrition through vasoconstriction of vertebral end plate vasculature",
      "Age 30-50 years - disc degeneration sufficient to weaken annulus but nucleus still gelatinous enough to herniate",
      "Obesity increasing axial compression loading on lumbar discs",
      "Tall stature associated with increased mechanical stress on lumbar segments",
      "Occupational vibration exposure (truck driving) accelerating disc degeneration"
    ],
    diagnostics: [
      "Positive straight leg raise (SLR) test - reproduction of radicular pain at less than 60 degrees of hip flexion",
      "MRI of lumbar spine showing disc herniation, nerve root compression, and location of herniated material",
      "Neurologic exam revealing dermatomal sensory loss, myotomal weakness, and reflex changes",
      "Crossed SLR test positive (raising unaffected leg reproduces pain in affected leg) - highly specific for herniation",
      "EMG and nerve conduction studies confirming radiculopathy level if clinical and imaging findings are discordant"
    ],
    management: [
      "Conservative management first - 90% of disc herniations resolve within 6-12 weeks without surgery",
      "NSAIDs and short-course oral corticosteroids for acute inflammation and nerve root edema",
      "Epidural steroid injection for persistent radicular pain not responding to oral medications",
      "Microdiscectomy for failed conservative therapy or progressive neurologic deficit",
      "Emergent surgical decompression for cauda equina syndrome within 24-48 hours to prevent permanent deficit",
      "Physical therapy for core stabilization and McKenzie extension exercises after acute phase"
    ],
    nursingActions: [
      "Perform and document detailed neurologic assessment including dermatomal sensation, myotomal strength, and reflexes",
      "Position patient for comfort - lateral recumbent with knees flexed (fetal position) or supine with knees elevated",
      "Assess for cauda equina red flags every shift: bilateral leg weakness, saddle anesthesia, urinary retention, fecal incontinence",
      "Log roll patient when repositioning to maintain spinal alignment and avoid torsion",
      "Post-discectomy: monitor for CSF leak (clear drainage on dressing), urinary retention, and progressive neurologic deficit",
      "Teach proper body mechanics and advise avoiding sitting for prolonged periods during recovery"
    ],
    signs: {
      left: [
        "Sciatica - sharp, shooting pain radiating from buttock down the posterior leg below the knee",
        "Positive straight leg raise reproducing radicular pain at less than 60 degrees",
        "Dermatomal sensory loss corresponding to compressed nerve root level",
        "Muscle weakness in specific myotome (L5: great toe dorsiflexion; S1: ankle plantarflexion)"
      ],
      right: [
        "Diminished deep tendon reflex at affected level (L4: knee jerk; S1: ankle jerk)",
        "Pain worsened by sitting, bending forward, coughing, sneezing (increased intradiscal pressure)",
        "Paraspinal muscle spasm with list (lateral lean) away from the side of herniation",
        "Cauda equina syndrome: saddle anesthesia, bilateral weakness, bowel/bladder dysfunction - EMERGENCY"
      ]
    },
    medications: [
      {
        name: "Methylprednisolone (Medrol Dose Pack)",
        type: "Systemic Corticosteroid",
        action: "Potent anti-inflammatory that reduces nerve root edema and inflammatory mediator production around the herniation site, decreasing chemical irritation and compression of the nerve root",
        sideEffects: "Hyperglycemia, insomnia, GI irritation, mood changes, immunosuppression, avascular necrosis with prolonged use",
        contra: "Active systemic infection, uncontrolled diabetes, peptic ulcer disease, psychosis, herpes simplex keratitis",
        pearl: "Oral dose packs provide a tapered 6-day course - must be taken as prescribed without abrupt discontinuation; short-course use has minimal adrenal suppression risk"
      }
    ],
    pearls: [
      "Cauda equina syndrome (bilateral leg weakness, saddle anesthesia, bowel/bladder dysfunction) requires emergent MRI and surgical decompression within 24-48 hours to prevent permanent neurologic damage",
      "The positive straight leg raise test is the most sensitive clinical test for lumbar disc herniation - positive when radicular pain (not just hamstring tightness) is reproduced at less than 60 degrees",
      "90% of disc herniations resolve with conservative management - surgery is reserved for failed conservative therapy, progressive neurologic deficit, or cauda equina syndrome"
    ],
    quiz: [
      {
        question: "A patient with L5-S1 disc herniation suddenly develops bilateral leg weakness, inability to urinate, and numbness in the perineal area. What is the priority nursing action?",
        options: [
          "Administer prescribed NSAID and apply ice to the lower back",
          "Notify the physician immediately - these are signs of cauda equina syndrome",
          "Position the patient in semi-Fowler position and encourage deep breathing",
          "Perform passive range of motion exercises on both lower extremities"
        ],
        correct: 1,
        rationale: "Bilateral leg weakness, urinary retention, and saddle anesthesia constitute cauda equina syndrome - a surgical emergency requiring decompression within 24-48 hours. Delay causes permanent bowel, bladder, and sexual dysfunction. The nurse must immediately notify the physician for emergent MRI and surgical consultation."
      }
    ]
  },

  "low-back-pain": {
    title: "Low Back Pain",
    cellular: {
      title: "Assessment Framework",
      content: "Low back pain (LBP) is a symptom complex rather than a specific disease, arising from multiple potential pain generators in the lumbar spine including muscles, ligaments, facet joints, intervertebral discs, nerve roots, and sacroiliac joints. Nociceptive pain arises from mechanical irritation of pain-sensitive structures through abnormal loading, inflammation, or degeneration. Neuropathic pain occurs when nerve roots are compressed or chemically irritated, producing radicular symptoms. The clinical challenge lies in differentiating benign, self-limiting mechanical LBP (which accounts for 85% of cases) from serious underlying pathology. Red flag symptoms suggest fracture (trauma, osteoporosis, steroid use), infection (fever, IV drug use, immunosuppression), tumor (unexplained weight loss, prior cancer history, pain worse at night), or cauda equina syndrome (saddle anesthesia, bilateral neurologic deficits, bowel/bladder dysfunction). Psychosocial yellow flags (fear avoidance, catastrophizing, workplace dissatisfaction) predict chronicity and disability more reliably than anatomic findings."
    },
    riskFactors: [
      "Sedentary lifestyle with weak core musculature providing inadequate spinal support",
      "Obesity increasing biomechanical stress on lumbar structures",
      "Occupations requiring heavy lifting, prolonged standing, or whole-body vibration",
      "Smoking reducing vertebral body blood flow and impairing disc nutrition",
      "Psychological factors - depression, anxiety, and job dissatisfaction strongly predict chronicity",
      "Poor posture and ergonomics creating sustained abnormal loading patterns",
      "Age-related disc degeneration and facet joint osteoarthritis"
    ],
    diagnostics: [
      "Focused history identifying mechanism, duration, radiation pattern, and red flag symptoms",
      "Physical examination including ROM, neurologic exam, SLR, and palpation of bony and soft tissue landmarks",
      "No imaging recommended for acute LBP without red flags - guidelines recommend waiting 6 weeks",
      "MRI indicated for suspected cauda equina syndrome, progressive neurologic deficit, or suspected malignancy/infection",
      "Plain radiographs for suspected fracture (trauma, osteoporosis, prolonged steroid use)"
    ],
    management: [
      "Patient education that most LBP is self-limiting and recovery is expected within 4-6 weeks",
      "First-line pharmacotherapy: NSAIDs and/or acetaminophen with avoidance of opioids when possible",
      "Active self-care: early return to normal activities with activity modification as needed",
      "Physical therapy for core stabilization, flexibility, and aerobic conditioning",
      "Cognitive behavioral approaches for patients with significant psychosocial risk factors",
      "Multidisciplinary pain rehabilitation for chronic LBP lasting more than 12 weeks"
    ],
    nursingActions: [
      "Perform systematic red flag assessment at every encounter - fracture, infection, tumor, cauda equina syndrome",
      "Screen for psychosocial yellow flags predicting chronicity - fear avoidance beliefs, catastrophizing, depression",
      "Educate that imaging is not needed for uncomplicated acute LBP and can lead to unnecessary interventions",
      "Teach proper body mechanics for lifting, sitting, and sleeping positions",
      "Encourage active self-management rather than passive treatments (massage, manipulation alone)",
      "Assess pain impact on function using validated tools (Oswestry Disability Index)",
      "Monitor for opioid misuse risk if controlled substances are prescribed for chronic LBP"
    ],
    signs: {
      left: [
        "Mechanical LBP: localized pain worsened by activity and improved by rest, no neurologic deficits",
        "Radicular pain: dermatomal leg pain below the knee, positive SLR, motor/sensory/reflex changes",
        "Red flag - infection: fever, spinal tenderness, IV drug use, recent procedure, immunosuppression",
        "Red flag - fracture: trauma mechanism, osteoporosis, prolonged corticosteroid use"
      ],
      right: [
        "Red flag - cauda equina: saddle anesthesia, bilateral neurologic deficit, bowel/bladder dysfunction",
        "Red flag - tumor: unexplained weight loss, age over 50, history of cancer, pain worse at night",
        "Yellow flag - psychosocial: fear avoidance behavior, catastrophizing, depression, work dissatisfaction",
        "Chronicity: pain persisting beyond 12 weeks requiring multidisciplinary approach"
      ]
    },
    medications: [
      {
        name: "Naproxen",
        type: "Non-Selective NSAID",
        action: "Inhibits both COX-1 and COX-2 enzymes, reducing prostaglandin synthesis to decrease inflammation, pain, and muscle spasm in musculoskeletal structures",
        sideEffects: "GI bleeding and ulceration, renal impairment with chronic use, cardiovascular risk, fluid retention, hypertension",
        contra: "Active GI bleeding, severe renal impairment, CABG surgery, third trimester pregnancy, aspirin-sensitive asthma",
        pearl: "Naproxen has the longest half-life of commonly used NSAIDs (12-15 hours) allowing twice-daily dosing and may have lower cardiovascular risk than other NSAIDs"
      }
    ],
    pearls: [
      "85% of low back pain is non-specific mechanical pain that resolves within 6 weeks - routine imaging leads to unnecessary findings and interventions that do not improve outcomes",
      "Red flags for cauda equina syndrome (saddle anesthesia, bowel/bladder dysfunction, bilateral neurologic deficits) require emergent MRI and are the most critical findings to recognize",
      "Psychosocial yellow flags (fear avoidance, catastrophizing, depression, work dissatisfaction) are stronger predictors of chronic disability than any anatomic finding on imaging"
    ],
    quiz: [
      {
        question: "A patient with low back pain for 3 weeks asks for an MRI. The patient has no neurologic deficits, no red flags, and normal vital signs. What is the most appropriate nursing response?",
        options: [
          "I will request the MRI order from the physician right away",
          "Guidelines recommend imaging only if red flags are present or symptoms persist beyond 6 weeks",
          "An X-ray would be more appropriate than an MRI for your symptoms",
          "We need to order bloodwork before any imaging can be done"
        ],
        correct: 1,
        rationale: "Clinical practice guidelines recommend against imaging for acute uncomplicated LBP without red flags during the first 6 weeks because most cases resolve spontaneously. Early imaging leads to incidental findings, unnecessary procedures, and increased healthcare costs without improving patient outcomes."
      }
    ]
  },

  "septic-arthritis": {
    title: "Septic Arthritis",
    cellular: {
      title: "Joint Infection",
      content: "Septic arthritis is an acute bacterial infection within the synovial space of a joint, most commonly caused by Staphylococcus aureus. Bacteria reach the joint through hematogenous spread (most common), direct inoculation (trauma, surgery, injection), or contiguous spread from adjacent osteomyelitis. Once bacteria enter the synovial space, the warm, nutrient-rich synovial fluid provides an ideal medium for rapid bacterial proliferation. The immune response generates a massive influx of neutrophils into the joint space, releasing proteolytic enzymes (collagenase, elastase) and reactive oxygen species that destroy articular cartilage within hours. Bacterial toxins directly damage chondrocytes, while the accumulating purulent exudate raises intra-articular pressure, compressing the subchondral blood supply and causing ischemic necrosis of cartilage. Without emergent drainage and antibiotics, irreversible cartilage destruction occurs within 24-48 hours, leading to permanent joint destruction, ankylosis, or sepsis with multiorgan failure. The knee is the most commonly affected joint in adults."
    },
    riskFactors: [
      "Pre-existing joint disease (rheumatoid arthritis, osteoarthritis) providing damaged tissue susceptible to bacterial seeding",
      "Prosthetic joint - biofilm formation on prosthetic surfaces is extremely difficult to eradicate",
      "Immunosuppression from diabetes, HIV, corticosteroid therapy, or chemotherapy",
      "IV drug use providing direct hematogenous bacterial access",
      "Recent joint surgery, arthrocentesis, or intra-articular injection breaching the sterile joint barrier",
      "Skin infections or cellulitis providing contiguous spread pathway to nearby joints",
      "Advanced age with decreased immune function and increased comorbidities",
      "Bacteremia from any source allowing hematogenous seeding of the synovium"
    ],
    diagnostics: [
      "Synovial fluid aspiration (arthrocentesis) showing turbid/purulent fluid with WBC count greater than 50,000/mm3",
      "Synovial fluid Gram stain and culture identifying the causative organism",
      "Blood cultures positive in 50% of cases - always obtain before starting antibiotics",
      "Elevated serum WBC, ESR (often greater than 30 mm/hr), and CRP indicating systemic inflammatory response",
      "X-ray may show joint effusion and soft tissue swelling but is often normal early",
      "MRI showing joint effusion, synovial enhancement, and adjacent bone marrow edema"
    ],
    management: [
      "Emergent arthrocentesis for diagnosis and therapeutic drainage - do not delay for imaging",
      "IV broad-spectrum antibiotics started immediately after cultures are obtained",
      "Surgical irrigation and debridement (arthroscopic or open) for joints not responding to needle aspiration",
      "Serial arthrocentesis or surgical drainage until synovial fluid WBC count normalizes",
      "Prosthetic joint infection may require implant removal, antibiotic spacer placement, and staged reimplantation",
      "IV antibiotics for minimum 4-6 weeks followed by oral step-down therapy"
    ],
    nursingActions: [
      "Recognize the presentation - hot, swollen, erythematous joint with severe pain on any motion is septic until proven otherwise",
      "Assist with arthrocentesis using strict aseptic technique and properly label and transport specimens",
      "Immobilize the affected joint in position of comfort and apply gentle cold compresses",
      "Administer IV antibiotics promptly after cultures are obtained - every hour of delay worsens cartilage destruction",
      "Monitor for systemic sepsis - fever trending, hemodynamic instability, altered mental status",
      "Assess pain level before and after drainage procedures and provide appropriate analgesia",
      "Monitor IV access site for phlebitis and infiltration during prolonged antibiotic therapy"
    ],
    signs: {
      left: [
        "Acutely hot, swollen, erythematous joint - typically monoarticular (single joint)",
        "Severe pain with any active or passive joint movement - patient guards the joint",
        "Joint held in position of maximum comfort (slight flexion to maximize capsular volume)",
        "Fever and chills indicating systemic bacterial infection"
      ],
      right: [
        "Tachycardia and hypotension if progressing to systemic sepsis",
        "Joint effusion with fluctuance on palpation",
        "Restricted range of motion in all planes due to pain and effusion pressure",
        "Regional lymphadenopathy from lymphatic drainage of infected joint"
      ]
    },
    medications: [
      {
        name: "Vancomycin IV",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-alanyl-D-alanine residues, preventing peptidoglycan cross-linking and causing osmotic lysis of susceptible bacteria including MRSA",
        sideEffects: "Red man syndrome (histamine-mediated flushing with rapid infusion), nephrotoxicity, ototoxicity, thrombophlebitis",
        contra: "Known hypersensitivity, concurrent nephrotoxic agents require dose adjustment, pregnancy risk",
        pearl: "Infuse over at least 60 minutes to prevent red man syndrome (not a true allergy) - trough levels must be monitored (target 15-20 mcg/mL for serious infections) to ensure efficacy and prevent toxicity"
      }
    ],
    pearls: [
      "A hot, swollen, painful monoarticular joint is septic arthritis until proven otherwise - emergent arthrocentesis is both diagnostic and therapeutic and should never be delayed",
      "Synovial fluid WBC greater than 50,000/mm3 with greater than 75% neutrophils is highly suggestive of septic arthritis and warrants immediate IV antibiotics",
      "Gonococcal septic arthritis should be considered in sexually active young adults presenting with migratory polyarthralgia progressing to monoarticular septic arthritis with or without skin lesions"
    ],
    quiz: [
      {
        question: "A patient presents with a hot, swollen, erythematous knee with severe pain on movement and a temperature of 39.2 C. What is the priority intervention?",
        options: [
          "Obtain X-ray of the knee to assess for fracture",
          "Perform emergent arthrocentesis for synovial fluid analysis and culture",
          "Apply ice and elevate the extremity while awaiting laboratory results",
          "Administer oral antibiotics and reassess in 24 hours"
        ],
        correct: 1,
        rationale: "An acutely hot, swollen, painful joint with fever is presumed septic arthritis until proven otherwise. Emergent arthrocentesis is the priority because it provides diagnostic confirmation (WBC count, Gram stain, culture) and therapeutic decompression. Cartilage destruction begins within hours, making rapid diagnosis and treatment critical."
      }
    ]
  },

  "fat-embolism": {
    title: "Fat Embolism",
    cellular: {
      title: "Long Bone Fracture Complication with",
      content: "Fat embolism syndrome (FES) occurs when fat globules from disrupted bone marrow or adipose tissue enter the venous circulation, travel to the lungs, and become lodged in pulmonary capillaries. This typically follows long bone fractures (femur, tibia) or orthopedic procedures. Two mechanisms cause organ damage: mechanical obstruction of the pulmonary vasculature causing ventilation-perfusion mismatch, and biochemical injury from lipase-mediated hydrolysis of fat emboli into free fatty acids that are directly toxic to pulmonary endothelium, causing capillary leak, alveolar edema, and ARDS-like pathology. Fat emboli can also traverse the pulmonary vasculature (or pass through a patent foramen ovale) to reach the cerebral and dermal circulations. Cerebral fat emboli cause altered mental status, confusion, and agitation. Dermal involvement produces the pathognomonic petechial rash over the chest, axillae, and conjunctivae - caused by fat emboli occluding dermal capillaries and causing capillary rupture. The classic triad of respiratory distress, neurologic changes, and petechial rash typically presents 24-72 hours after the inciting event."
    },
    riskFactors: [
      "Long bone fractures, especially femur shaft fractures - the most common precipitant",
      "Multiple fractures and major trauma releasing larger volumes of marrow fat",
      "Orthopedic procedures involving intramedullary reaming and prosthesis insertion",
      "Young adults and adolescents - active red marrow contains more fat than elderly yellow marrow",
      "Inadequate fracture immobilization allowing continued bone marrow disruption",
      "Liposuction and lipectomy procedures releasing adipose tissue into venous circulation",
      "Pancreatitis with lipase activation and fat necrosis releasing free fatty acids"
    ],
    diagnostics: [
      "Clinical diagnosis based on classic triad: respiratory distress, neurologic changes, petechial rash",
      "Arterial blood gas showing hypoxemia (PaO2 less than 60 mmHg) and often respiratory alkalosis initially",
      "Chest X-ray showing bilateral diffuse infiltrates ('snowstorm' appearance) consistent with ARDS",
      "Retinal exam may reveal fat emboli in retinal vessels (pathognomonic when present)",
      "Thrombocytopenia from platelet consumption in fat emboli-injured vasculature",
      "Elevated lipase and free fatty acid levels (though nonspecific)"
    ],
    management: [
      "Supportive respiratory care with high-flow oxygen; mechanical ventilation with PEEP for severe ARDS",
      "Early fracture stabilization (within 24 hours) reduces FES incidence significantly",
      "Maintain intravascular volume with IV fluids to prevent shock from capillary leak",
      "Corticosteroids may be used prophylactically in high-risk patients (controversial but supported by some evidence)",
      "Avoid excessive manipulation of fractured extremity during transport and stabilization",
      "DVT prophylaxis as these patients are at concurrent thromboembolic risk"
    ],
    nursingActions: [
      "Monitor for classic triad onset 24-72 hours after long bone fracture: respiratory distress, confusion, petechial rash",
      "Assess respiratory status every 1-2 hours during the high-risk window (24-72 hours post-injury)",
      "Inspect chest, axillae, conjunctivae, and buccal mucosa for petechial rash each shift",
      "Monitor neurologic status for subtle changes - confusion, restlessness, and agitation may precede respiratory symptoms",
      "Apply continuous pulse oximetry and report SpO2 less than 94%",
      "Ensure adequate fracture immobilization to prevent further marrow fat release",
      "Administer supplemental oxygen as prescribed and prepare for possible intubation if respiratory failure develops"
    ],
    signs: {
      left: [
        "Acute respiratory distress with tachypnea, dyspnea, and hypoxemia (24-72 hours post-fracture)",
        "Petechial rash on chest, axillae, and conjunctivae - pathognomonic but transient (may last only hours)",
        "Altered mental status progressing from confusion and agitation to obtundation",
        "Tachycardia from hypoxemia and sympathetic activation"
      ],
      right: [
        "Low-grade fever from inflammatory response to fat emboli-mediated tissue injury",
        "Bilateral crackles on auscultation from pulmonary edema and capillary leak",
        "Retinal hemorrhages or cotton-wool spots on fundoscopic examination",
        "Thrombocytopenia and coagulopathy from platelet and clotting factor consumption"
      ]
    },
    medications: [
      {
        name: "Methylprednisolone IV",
        type: "Systemic Corticosteroid (Prophylactic/Treatment)",
        action: "Reduces inflammatory response to free fatty acid-mediated endothelial injury, stabilizes capillary membranes, decreases neutrophil activation, and may reduce the severity of pulmonary capillary leak",
        sideEffects: "Hyperglycemia, immunosuppression, GI bleeding risk, wound healing impairment, adrenal suppression",
        contra: "Active systemic fungal infection, uncontrolled diabetes, active GI hemorrhage",
        pearl: "Prophylactic methylprednisolone in high-risk patients (bilateral femur fractures, polytrauma) may reduce FES incidence by up to 50% - administered within the first 24 hours of injury"
      }
    ],
    pearls: [
      "The classic triad of fat embolism syndrome - respiratory distress, neurologic changes, and petechial rash - typically presents 24-72 hours after long bone fracture; petechiae are the LAST component to appear",
      "Petechial rash on the chest, axillae, and conjunctivae is pathognomonic for FES but is transient and easily missed - deliberately inspect these areas in all long bone fracture patients",
      "Early surgical fixation of long bone fractures within 24 hours significantly reduces fat embolism incidence compared to delayed fixation"
    ],
    quiz: [
      {
        question: "A patient with a femur fracture becomes confused and tachypneic 36 hours after injury. The nurse notes petechiae on the chest and axillae. Which condition should the nurse suspect?",
        options: [
          "Pulmonary embolism from deep vein thrombosis",
          "Fat embolism syndrome from marrow fat release",
          "Tension pneumothorax from rib fracture",
          "Hemorrhagic shock from occult internal bleeding"
        ],
        correct: 1,
        rationale: "The triad of respiratory distress (tachypnea), neurologic changes (confusion), and petechial rash on the chest and axillae occurring 24-72 hours after a long bone fracture is the classic presentation of fat embolism syndrome. PE does not cause petechiae, pneumothorax causes unilateral findings, and hemorrhagic shock does not produce petechiae."
      }
    ]
  },

  "crutch-paralysis": {
    title: "Crutch Paralysis",
    image: imgCrutchParalysis,
    cellular: {
      title: "Brachial Plexus Compression",
      content: "Crutch paralysis occurs when improper crutch use creates sustained compression of the brachial plexus and/or radial nerve in the axilla. The brachial plexus runs through the axilla adjacent to the axillary artery, and the radial nerve courses along the spiral groove of the humerus just distal to the axilla. When a patient bears weight on the axillary pad of the crutch rather than on the hand grips, the hard crutch top compresses these neurovascular structures against the humeral head. The radial nerve is most commonly affected because of its superficial position. Compression causes a neuropraxia - a temporary nerve conduction block where the axon remains intact but myelin is compressed, disrupting saltatory conduction. This produces wrist drop (inability to extend the wrist and fingers), weakness of elbow extension (triceps), decreased grip strength, and numbness on the dorsal hand between the thumb and index finger (radial nerve sensory distribution). If compression is brief, full recovery occurs within days to weeks as remyelination restores conduction. Prolonged compression can progress to axonotmesis or neurotmesis with permanent nerve damage."
    },
    riskFactors: [
      "Improper crutch fitting - axillary pad too high pressing into the axilla during use",
      "Bearing weight on the axillary pad rather than the hand grips during ambulation",
      "Prolonged crutch use without proper education on weight distribution",
      "Thin body habitus with less subcutaneous tissue protecting neurovascular structures",
      "Pre-existing neuropathy (diabetic) making nerves more susceptible to compression injury",
      "Improper crutch height measurement - should be 2-3 finger widths below the axillary fold"
    ],
    diagnostics: [
      "Physical examination revealing wrist drop, decreased grip strength, and radial nerve sensory loss",
      "Nerve conduction studies showing reduced amplitude and conduction velocity across the compression site",
      "EMG demonstrating denervation potentials in radial nerve-innervated muscles if axonal damage has occurred",
      "Assessment of crutch fit and patient's weight-bearing technique identifying the cause",
      "Exclusion of other causes of radial nerve palsy (humeral fracture, Saturday night palsy)"
    ],
    management: [
      "Immediate cessation of improper crutch use and correction of weight-bearing technique",
      "Proper crutch fitting: 2-3 finger widths below the axillary fold, elbows flexed 15-30 degrees at hand grips",
      "Wrist splint in extension to maintain functional hand position during nerve recovery",
      "Physical therapy for nerve gliding exercises and maintenance of ROM during recovery",
      "Alternative assistive devices (forearm/Lofstrand crutches, walker) if patient cannot learn proper technique"
    ],
    nursingActions: [
      "Verify proper crutch fit before discharge: 2-3 finger widths (approximately 1.5-2 inches) below axillary fold",
      "Teach patient to bear weight on the HAND GRIPS, not the axillary pads - hands support body weight",
      "Demonstrate proper gait patterns (3-point, 2-point, swing-through) matching weight-bearing restrictions",
      "Assess for tingling, numbness, or weakness in the hands after crutch use as early warning signs",
      "Educate that crutch pads are for balance only - pressure should never be applied to the axilla",
      "Check that elbow flexion is 15-30 degrees when hands are on the grips (correct handle height)"
    ],
    signs: {
      left: [
        "Wrist drop - inability to extend the wrist and fingers against gravity",
        "Decreased grip strength from weakened finger extension and wrist stabilization",
        "Numbness or tingling on the dorsal hand between thumb and index finger (radial nerve territory)",
        "Weakness of elbow extension (triceps) if brachial plexus is more broadly compressed"
      ],
      right: [
        "Tingling or 'pins and needles' in the hand during crutch use - early warning sign",
        "Difficulty opening jars, turning doorknobs, or grasping objects",
        "Visible indentation or skin irritation at the axillary fold from crutch pad pressure",
        "Axillary artery compression causing diminished radial pulse during crutch weight-bearing"
      ]
    },
    medications: [
      {
        name: "Ibuprofen",
        type: "Non-Steroidal Anti-Inflammatory Drug",
        action: "Inhibits cyclooxygenase enzymes reducing prostaglandin synthesis, decreasing inflammation and pain around the compressed nerve to facilitate recovery",
        sideEffects: "GI irritation and bleeding, renal impairment with chronic use, cardiovascular risk, platelet dysfunction",
        contra: "Active GI bleeding, renal impairment, aspirin-sensitive asthma, third trimester pregnancy, post-CABG",
        pearl: "Anti-inflammatory doses are higher than analgesic doses - for nerve inflammation, consistent scheduled dosing is more effective than PRN use for the first 7-10 days"
      }
    ],
    pearls: [
      "Weight must be borne on the HAND GRIPS, never the axillary pads - this is the single most important teaching point for preventing crutch paralysis",
      "Proper crutch height places the pad 2-3 finger widths (1.5-2 inches) below the axillary fold with elbows flexed 15-30 degrees when hands are on the grips",
      "If a patient develops tingling or numbness in the hands during crutch use, crutch fit and technique must be immediately reassessed before nerve damage becomes permanent"
    ],
    quiz: [
      {
        question: "A nurse is teaching a patient how to use axillary crutches. Which instruction is most important to prevent crutch paralysis?",
        options: [
          "Lean on the axillary pads when standing still to conserve energy",
          "Adjust the crutches so the pads fit snugly into the axillae",
          "Support your body weight on the hand grips, keeping space between the axillary pad and armpit",
          "Keep elbows fully extended when using the hand grips for maximum support"
        ],
        correct: 2,
        rationale: "The critical instruction is to bear weight on the hand grips with 2-3 finger widths of space between the axillary pad and armpit. Bearing weight on the axillary pads compresses the brachial plexus and radial nerve against the humerus, causing crutch paralysis (wrist drop and sensory loss)."
      }
    ]
  },

  "syndactyly": {
    title: "Syndactyly",
    cellular: {
      title: "Fused Digits and Surgical Correction",
      content: "Syndactyly is a congenital anomaly resulting from failure of programmed cell death (apoptosis) between developing digits during embryogenesis. Normally, between the 6th and 8th weeks of gestation, interdigital mesenchyme undergoes apoptosis mediated by bone morphogenetic proteins (BMPs) and matrix metalloproteinases, creating individual separated digits. When this apoptotic process fails, adjacent digits remain fused. Simple syndactyly involves only soft tissue fusion (skin and subcutaneous tissue), while complex syndactyly involves bony fusion between adjacent phalanges. Complete syndactyly extends the full length of the digits, while incomplete syndactyly involves only partial fusion. The condition occurs in approximately 1 in 2,000-3,000 births and most commonly affects the third and fourth fingers or the second and third toes. Syndactyly can occur as an isolated anomaly or as part of genetic syndromes such as Apert syndrome, Poland syndrome, or Holt-Oram syndrome. Functional impairment depends on which digits are involved and whether the fusion limits independent digit movement."
    },
    riskFactors: [
      "Autosomal dominant inheritance pattern in familial cases (non-syndromic syndactyly)",
      "Male sex - affected approximately twice as frequently as females",
      "Genetic syndromes such as Apert syndrome (FGFR2 mutation) causing complex syndactyly",
      "Teratogenic exposure during the 6th-8th week of gestation when digital separation occurs",
      "Family history of limb anomalies suggesting inherited disruption of limb patterning genes",
      "Amniotic band syndrome causing secondary syndactyly from mechanical constriction"
    ],
    diagnostics: [
      "Physical examination at birth identifying fused digits and classifying type (simple/complex, complete/incomplete)",
      "X-ray of affected hand or foot to evaluate for bony fusion and plan surgical approach",
      "Assessment of vascular supply to each digit using Doppler or angiography before surgical separation",
      "Genetic evaluation if syndactyly is associated with other anomalies suggesting a syndrome",
      "Family history assessment for inheritance pattern counseling"
    ],
    management: [
      "Surgical separation (syndactyly release) typically performed between 6-18 months of age",
      "Z-plasty or zigzag incisions to provide adequate skin coverage and prevent scar contracture",
      "Full-thickness skin grafts often required to cover defects created by digit separation",
      "Earlier surgery for border digits (thumb-index, ring-little) that have greater length discrepancy causing tethering",
      "Post-operative splinting for 4-6 weeks to maintain digit separation during healing",
      "Hand therapy for ROM exercises and functional optimization after healing"
    ],
    nursingActions: [
      "Provide emotional support and education to parents regarding the condition and surgical timeline",
      "Post-operatively assess neurovascular status of all separated digits - capillary refill, color, temperature",
      "Monitor surgical dressings for excessive bleeding and signs of graft compromise (pallor, dusky color)",
      "Keep the operated hand elevated above heart level to minimize edema and improve venous return",
      "Protect the surgical site from trauma - age-appropriate restraints may be needed for infants",
      "Educate parents about wound care, splint management, and signs of infection requiring medical attention"
    ],
    signs: {
      left: [
        "Visible fusion of adjacent digits at birth - may range from webbing to complete digital fusion",
        "Limited independent movement of fused digits impairing fine motor function",
        "Nail deformity if fusion extends to the fingertips affecting nail matrix",
        "Angular deformity of fused digits if bones of different lengths are joined (tethering effect)"
      ],
      right: [
        "Associated anomalies suggesting genetic syndrome (craniofacial, cardiac, skeletal)",
        "Bilateral involvement in approximately 50% of cases",
        "Skin bridge between digits of varying width and extent",
        "Functional limitation proportional to which digits are fused and degree of bony involvement"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Pediatric)",
        type: "Non-Opioid Analgesic/Antipyretic",
        action: "Inhibits prostaglandin synthesis centrally by modulating the serotonergic pain pathway and inhibiting COX in the CNS, providing analgesia and antipyresis without peripheral anti-inflammatory effects",
        sideEffects: "Hepatotoxicity with overdose (single most common cause of acute liver failure in children), rare hypersensitivity reactions",
        contra: "Severe hepatic impairment, known G6PD deficiency (may worsen hemolysis), allergy to acetaminophen",
        pearl: "Weight-based dosing is critical in pediatrics (10-15 mg/kg every 4-6 hours, max 5 doses/day) - educate parents about all sources of acetaminophen in combination products to prevent inadvertent overdose"
      }
    ],
    pearls: [
      "Syndactyly of border digits (thumb-index or ring-little finger) requires earlier surgical correction because length discrepancy between fused digits causes angular deformity and progressive tethering during growth",
      "The most common presentation is simple complete syndactyly between the 3rd and 4th fingers (long and ring fingers)",
      "When syndactyly is associated with other congenital anomalies, a thorough genetic evaluation is warranted as it may be part of a recognizable syndrome with implications for other organ systems"
    ],
    quiz: [
      {
        question: "A newborn is found to have fusion of the 3rd and 4th fingers on the right hand with normal X-ray showing no bony involvement. How should the nurse classify this anomaly?",
        options: [
          "Complex complete syndactyly requiring emergent surgery",
          "Simple syndactyly that can be surgically corrected electively between 6-18 months",
          "Polydactyly requiring immediate evaluation for cardiac anomalies",
          "Congenital amputation requiring prosthetic fitting"
        ],
        correct: 1,
        rationale: "Fusion of soft tissue without bony involvement is classified as simple syndactyly. Surgical correction is typically performed electively between 6-18 months of age to allow adequate growth while intervening before fine motor development is significantly affected. Complex syndactyly involves bony fusion."
      }
    ]
  },

  "polydactyly": {
    title: "Polydactyly",
    cellular: {
      title: "Supernumerary Digits and Surgical Management",
      content: "Polydactyly is a congenital limb anomaly characterized by the presence of one or more extra digits on the hand or foot, resulting from abnormal limb bud development during the 4th-8th week of embryogenesis. The zone of polarizing activity (ZPA) at the posterior limb bud margin secretes Sonic Hedgehog (SHH) protein, which establishes the anterior-posterior axis and determines digit number and identity. Mutations or duplications in the SHH signaling pathway cause extra digit formation. Preaxial polydactyly (extra digit on the thumb/great toe side) involves radial duplications and is more common in Caucasian populations. Postaxial polydactyly (extra digit on the little finger/toe side) is the most common form and occurs more frequently in African American populations (1 in 300 births). The extra digit may range from a fully formed functional digit with its own bone, joint, and tendon structures to a rudimentary soft-tissue nubbin connected by a narrow pedicle. Type A postaxial polydactyly involves a fully formed extra digit articulating with the 5th metacarpal, while Type B is a rudimentary digit attached by a narrow skin bridge."
    },
    riskFactors: [
      "Autosomal dominant inheritance in isolated postaxial polydactyly",
      "African American ethnicity for postaxial polydactyly (10 times more common than in Caucasians)",
      "Genetic syndromes such as trisomy 13 (Patau syndrome), Ellis-van Creveld, and Bardet-Biedl syndrome",
      "Family history - strong familial pattern with variable expression",
      "Teratogenic exposure during limb bud development (4th-8th week of gestation)",
      "Associated anomalies suggesting chromosomal abnormality when bilateral or multiple digits involved"
    ],
    diagnostics: [
      "Physical examination at birth identifying extra digit and assessing structure (pedunculated vs articulating)",
      "X-ray of affected extremity to determine presence of bony structures and articular connections",
      "Assessment of neurovascular supply to the extra digit for surgical planning",
      "Genetic evaluation when associated with other congenital anomalies or dysmorphic features",
      "Echocardiography and renal ultrasound if syndrome is suspected (many polydactyly syndromes have cardiac and renal associations)"
    ],
    management: [
      "Type B (pedunculated, rudimentary): suture ligation at the base in the newborn nursery if only soft tissue pedicle",
      "Type A (fully formed, articulating): surgical excision between 6-12 months of age",
      "Surgical reconstruction of collateral ligaments and tendons for functional digit preservation",
      "Occupational therapy for hand function optimization after surgical correction",
      "Genetic counseling for autosomal dominant inheritance patterns affecting family planning"
    ],
    nursingActions: [
      "Assess the extra digit at birth for color, perfusion, movement, and structural characteristics",
      "Provide parental reassurance that polydactyly is relatively common and treatable",
      "Post-ligation care: monitor the ligated digit for color change, necrosis, and signs of infection",
      "After surgical excision: assess surgical site for bleeding, neurovascular status of adjacent digits",
      "Educate parents about genetic counseling options especially if other anomalies are identified",
      "Screen for associated anomalies when polydactyly is identified (cardiac, renal, CNS)"
    ],
    signs: {
      left: [
        "Extra digit visible at birth - may be fully formed or rudimentary soft tissue nubbin",
        "Postaxial location (ulnar/little finger side) most common overall",
        "Pedunculated extra digit on a narrow stalk indicating Type B amenable to ligation",
        "Fully formed articulating extra digit with nail, bone, and tendon structures (Type A)"
      ],
      right: [
        "Bilateral polydactyly increasing suspicion for genetic syndrome",
        "Associated dysmorphic features suggesting chromosomal abnormality (trisomy 13)",
        "Family history of polydactyly in multiple generations (autosomal dominant pattern)",
        "Functional impairment from mechanical interference of extra digit with adjacent finger movement"
      ]
    },
    medications: [
      {
        name: "Lidocaine 1% (Local Anesthetic)",
        type: "Amide Local Anesthetic",
        action: "Blocks sodium channels in nerve fibers, preventing depolarization and nerve impulse transmission, providing local anesthesia for minor procedures such as digit ligation",
        sideEffects: "Local burning on injection, rare systemic toxicity (circumoral numbness, tinnitus, seizures) with excessive doses, tissue necrosis if injected with epinephrine into digit",
        contra: "Never use with epinephrine in digits (vasoconstriction causes ischemic necrosis), known amide anesthetic allergy, infection at injection site",
        pearl: "Never use lidocaine WITH epinephrine in digits, penis, nose, or ears - the end-artery blood supply means vasoconstriction can cause irreversible ischemic necrosis"
      }
    ],
    pearls: [
      "Postaxial polydactyly (extra little finger) in an African American newborn is typically isolated, autosomal dominant, and benign - rudimentary Type B digits can be ligated in the nursery",
      "Polydactyly associated with other congenital anomalies (cardiac defects, cleft lip, microcephaly) should trigger evaluation for trisomy 13 (Patau syndrome) and other chromosomal abnormalities",
      "Never use epinephrine-containing local anesthetic for digital procedures - digits have end-artery blood supply and vasoconstriction causes ischemic necrosis"
    ],
    quiz: [
      {
        question: "A newborn has a small, floppy extra digit attached to the ulnar side of the right hand by a narrow skin stalk. What is the appropriate initial management?",
        options: [
          "Emergent surgical amputation in the operating room",
          "Suture ligation at the base of the pedicle in the newborn nursery",
          "MRI of the hand to evaluate tendon involvement before any intervention",
          "No treatment needed - the digit will spontaneously resolve"
        ],
        correct: 1,
        rationale: "A rudimentary (Type B) postaxial digit connected by a narrow skin pedicle without bony or tendon components can be safely ligated at the base with suture in the newborn nursery. The ligated tissue becomes ischemic and falls off within 7-10 days. Fully formed (Type A) digits with bone and joint connections require formal surgical excision."
      }
    ]
  },  "rickets": {
    title: "Rickets",
    cellular: { title: "Defective Bone Mineralization", content: "Rickets is a disorder of defective mineralization of the growth plate and newly formed bone (osteoid) in children. Vitamin D deficiency is the most common cause, leading to inadequate intestinal calcium and phosphorus absorption. Without sufficient calcium and phosphorus, osteoid tissue produced by osteoblasts cannot be mineralized. The growth plates widen and become disorganized because chondrocytes continue to proliferate but fail to undergo normal calcification and apoptosis. This results in soft, deformable bones that bow under mechanical stress. In adults, the same process is called osteomalacia." },
    riskFactors: ["Exclusive breastfeeding without vitamin D supplementation", "Dark skin pigmentation (reduced UV vitamin D synthesis)", "Limited sun exposure", "Malabsorption disorders (celiac disease, Crohn's)", "Chronic kidney disease (renal rickets)", "Liver disease", "Anticonvulsant medications (increase vitamin D catabolism)", "Prematurity", "Vegetarian/vegan diet without supplementation", "Geographic latitude with low UV exposure"],
    diagnostics: ["Expect serum 25-hydroxyvitamin D level (low, <20 ng/mL)", "Expect serum calcium and phosphorus (low)", "Expect alkaline phosphatase (elevated - indicates osteoblast activity)", "Expect parathyroid hormone level (elevated secondary to hypocalcemia)", "Expect X-rays of wrists and knees showing widened, frayed growth plates", "Monitor for associated hypocalcemia symptoms"],
    management: ["Administer vitamin D supplementation as prescribed (ergocalciferol or cholecalciferol)", "Ensure adequate calcium intake through diet or supplements", "Phosphorus supplementation for phosphate-wasting rickets", "Treat underlying malabsorption if present", "Sun exposure education (10-15 minutes, 2-3 times per week)", "Orthopedic follow-up for severe skeletal deformities"],
    nursingActions: ["Administer vitamin D supplements as prescribed", "Teach parents about vitamin D-rich foods", "Educate on safe sun exposure practices", "Monitor growth parameters and plot on growth chart", "Handle child gently to prevent pathological fractures", "Assess for signs of hypocalcemia (tetany, Chvostek sign)", "Ensure all breastfed infants receive 400 IU vitamin D daily from birth"],
    signs: {
      left: ["Bowed Legs (Genu Varum)", "Widened Wrists and Ankles", "Frontal Bossing", "Delayed Fontanelle Closure"],
      right: ["Rachitic Rosary (Costochondral Beading)", "Harrison's Groove (Rib Cage Indentation)", "Pathological Fractures", "Hypocalcemic Seizures"]
    },
    medications: [
      { name: "Cholecalciferol (Vitamin D3)", type: "Vitamin Supplement", action: "Restores vitamin D levels to enable calcium/phosphorus absorption", sideEffects: "Hypercalcemia with overdose", contra: "Hypercalcemia, sarcoidosis", pearl: "Treatment dose 2000-5000 IU/day for 6-12 weeks, then maintenance 400-1000 IU/day; monitor calcium levels" },
      { name: "Calcium Carbonate", type: "Mineral Supplement", action: "Provides calcium for bone mineralization", sideEffects: "Constipation, hypercalcemia", contra: "Hypercalcemia, kidney stones", pearl: "Give with meals for better absorption; separate from iron supplements by 2 hours" }
    ],
    pearls: [
      "ALL breastfed infants should receive 400 IU/day of vitamin D starting within the first few days of life - breast milk contains insufficient vitamin D",
      "Rachitic rosary (beading at costochondral junctions) is pathognomonic for rickets - palpate along the rib cage during assessment",
      "Alkaline phosphatase is the first lab to elevate and last to normalize - use it to monitor treatment response"
    ],
    quiz: [{
      question: "A breastfed 8-month-old presents with bowed legs and widened wrists. Labs show low vitamin D, low calcium, and elevated alkaline phosphatase. Which finding is most specific for rickets?",
      options: ["Low serum calcium", "Elevated alkaline phosphatase", "Rachitic rosary on rib palpation", "Bowed legs"],
      correct: 2,
      rationale: "Rachitic rosary (palpable beading at the costochondral junctions where the ribs meet the cartilage) is a pathognomonic finding for rickets. While bowed legs, low calcium, and elevated ALP are all associated with rickets, they can occur in other conditions. Rachitic rosary is uniquely characteristic of rickets."
    }]
  },
  "scoliosis": {
    title: "Scoliosis",
    cellular: { title: "Spinal Curvature Pathology", content: "Scoliosis is a lateral curvature of the spine exceeding 10 degrees (Cobb angle) with vertebral rotation. Idiopathic scoliosis (80% of cases) involves asymmetric growth of vertebral bodies during rapid growth periods. The vertebral bodies rotate toward the convex side of the curve, causing the spinous processes to deviate toward the concave side. This rotation creates the characteristic rib hump visible on forward bending (Adam's test). The intervertebral discs become wedge-shaped, and paraspinal muscles develop asymmetric tone. Untreated severe curvature (>50 degrees) can compromise cardiopulmonary function." },
    riskFactors: ["Female sex (8:1 for curves requiring treatment)", "Family history of scoliosis", "Adolescent growth spurt (10-16 years)", "Skeletal immaturity (Risser sign 0-2)", "Neuromuscular disorders (cerebral palsy, muscular dystrophy)", "Connective tissue disorders (Marfan, Ehlers-Danlos)", "Spinal cord abnormalities (tethered cord, syringomyelia)", "Prematurity"],
    diagnostics: ["Perform Adam's forward bend test (screening)", "Use scoliometer to measure trunk rotation (>7 degrees is positive)", "Expect standing posteroanterior (PA) X-ray of full spine", "Measure Cobb angle on X-ray", "Assess skeletal maturity with Risser sign (0-5)", "Expect MRI if atypical features (left thoracic curve, rapid progression, pain, neurologic symptoms)", "Monitor height and Tanner staging"],
    management: ["Observation with serial X-rays every 4-6 months for curves 10-25 degrees", "Bracing (TLSO/Boston brace) for curves 25-40 degrees in growing children", "Brace worn 16-23 hours/day as prescribed", "Spinal fusion surgery for curves >45-50 degrees or progressive despite bracing", "Postoperative management: log-rolling, wound care, pain management", "Physical therapy for posture and core strengthening"],
    nursingActions: ["Screen adolescents during school health assessments", "Teach proper brace wearing and skin care", "Assess body image concerns (especially adolescent girls)", "Post-surgical: log-roll for positioning changes", "Monitor neurovascular status of lower extremities post-op", "Assess for signs of superior mesenteric artery syndrome post-surgery", "Provide emotional support regarding body image", "Educate on activity restrictions and return-to-activity timeline"],
    signs: {
      left: ["Uneven Shoulder Heights", "Asymmetric Waistline", "One Scapula More Prominent", "Uneven Hemlines on Clothing"],
      right: ["Rib Hump on Forward Bending (Adam's Test)", "Cobb Angle >25° (Bracing Threshold)", "Cobb Angle >45-50° (Surgical Threshold)", "Cardiopulmonary Compromise (Severe Curves >70°)"]
    },
    medications: [
      { name: "Acetaminophen/NSAIDs", type: "Analgesic", action: "Post-operative pain management", sideEffects: "GI upset, hepatotoxicity", contra: "Active bleeding, liver disease", pearl: "Multimodal pain management preferred post-spinal fusion; avoid NSAIDs initially if bone fusion is concern" },
      { name: "Patient-Controlled Analgesia (PCA)", type: "Opioid Analgesic", action: "Post-surgical pain control", sideEffects: "Respiratory depression, constipation", contra: "Respiratory compromise", pearl: "Only the patient should press the PCA button - NEVER allow family members to press it (risk of respiratory depression)" }
    ],
    pearls: [
      "Adam's forward bend test is the gold standard screening tool - a positive test (visible rib hump or trunk asymmetry) requires X-ray confirmation",
      "Brace compliance is everything - the brace only works if worn as prescribed; address adolescent body image concerns proactively",
      "Post-spinal fusion: log-roll ONLY, watch for superior mesenteric artery syndrome (abdominal distension, bilious vomiting, inability to tolerate feeds)"
    ],
    quiz: [{
      question: "An adolescent 2 days post-spinal fusion for scoliosis develops abdominal distension and bilious vomiting. What should the nurse suspect?",
      options: ["Normal post-operative ileus that will resolve spontaneously", "Superior mesenteric artery syndrome from body cast compression", "Opioid-induced constipation from PCA use", "Appendicitis requiring surgical consultation"],
      correct: 1,
      rationale: "Superior mesenteric artery (SMA) syndrome occurs when the third part of the duodenum is compressed between the SMA and the aorta. It can occur after spinal surgery due to correction of the spinal curve altering the angle of the SMA. Symptoms include bilious vomiting, abdominal distension, and inability to tolerate oral intake. Treatment includes gastric decompression and positioning (left lateral or prone)."
    }]
  },

  "osteoporosis-advanced-np": {
    title: "Osteoporosis",
    cellular: {
      title: "Molecular Bone Biology: Wnt/β-Catenin",
      content: "Advanced understanding of osteoporosis requires knowledge of the molecular pathways governing bone cell differentiation and activity beyond the RANK/RANKL/OPG axis. The canonical Wnt/β-catenin signaling pathway is the master regulator of osteoblast differentiation and bone formation. Wnt ligands bind to the Frizzled receptor and its co-receptor LRP5/6 on mesenchymal stem cells, inhibiting the destruction complex (GSK-3β, axin, APC) and allowing β-catenin to accumulate in the cytoplasm and translocate to the nucleus where it activates transcription factors (TCF/LEF) that drive osteoblast commitment, proliferation, and survival. Simultaneously, Wnt signaling suppresses osteoclastogenesis by upregulating OPG expression in osteoblasts. Sclerostin, a glycoprotein encoded by the SOST gene and produced almost exclusively by osteocytes (the mechanosensory cells embedded within mineralized bone matrix), acts as a potent inhibitor of Wnt signaling by binding to LRP5/6 and preventing Wnt ligand engagement. When mechanical loading is applied to bone, osteocytes downregulate sclerostin production, releasing the brake on Wnt signaling and promoting bone formation at sites of mechanical strain. In disuse and aging, sclerostin levels rise, suppressing formation and contributing to net bone loss.\n\nCathepsin K is a cysteine protease expressed by activated osteoclasts within the resorption lacuna (Howship lacuna). After osteoclasts dissolve the mineral phase of bone using hydrochloric acid secreted through the ruffled border, cathepsin K degrades the exposed organic matrix, primarily type I collagen. This enzyme operates optimally at the acidic pH of the resorption lacuna and is the rate-limiting step in organic matrix degradation. Cathepsin K inhibitors (odanacatib) were developed to reduce resorption while preserving the osteoclast itself, theoretically maintaining the coupling signals that osteoclasts provide to osteoblasts, but clinical development was halted due to cerebrovascular adverse effects. Understanding these pathways informs the mechanism of newer therapeutics: romosozumab (anti-sclerostin monoclonal antibody) unleashes Wnt-mediated bone formation while simultaneously reducing resorption, producing a dual-effect anabolic agent; teriparatide (recombinant PTH 1-34) given intermittently paradoxically stimulates osteoblast activity by preferentially activating the formation arm of bone remodeling; and denosumab (anti-RANKL monoclonal antibody) mimics OPG by sequestering RANKL and profoundly suppressing osteoclast maturation and function."
    },
    riskFactors: [
      "Postmenopausal estrogen deficiency removing suppression of RANKL and osteoclast apoptosis signals",
      "Glucocorticoid-induced osteoporosis through suppression of Wnt signaling, osteoblast apoptosis induction, and enhanced osteoclastogenesis",
      "Aromatase inhibitor therapy in breast cancer eliminating residual peripheral estrogen conversion",
      "Androgen deprivation therapy in prostate cancer removing testosterone-mediated bone protection",
      "Type 2 diabetes with paradoxically increased fracture risk despite normal or elevated BMD due to altered bone quality (advanced glycation end-products crosslinking collagen)",
      "Chronic kidney disease-mineral bone disorder (CKD-MBD) with impaired vitamin D activation and secondary/tertiary hyperparathyroidism",
      "Genetic polymorphisms in LRP5, ESR1, SOST, and RANKL genes affecting peak bone mass and remodeling rates",
      "Celiac disease and inflammatory bowel disease with malabsorption and chronic inflammatory cytokine-driven bone loss"
    ],
    diagnostics: [
      "DEXA scan with T-score interpretation at lumbar spine, femoral neck, total hip, and one-third distal radius (forearm if other sites cannot be measured or in hyperparathyroidism)",
      "FRAX score calculation integrating age, sex, BMI, prior fracture, parental hip fracture, glucocorticoid use, rheumatoid arthritis, secondary causes, alcohol, smoking, and femoral neck BMD",
      "Trabecular bone score (TBS) as a DEXA-derived textural index providing information about bone microarchitecture quality independent of BMD",
      "Bone turnover markers: serum CTX (C-terminal telopeptide) for resorption monitoring and P1NP (procollagen type 1 N-terminal propeptide) for formation monitoring to assess treatment response",
      "Comprehensive metabolic workup: 25-hydroxyvitamin D, intact PTH, serum calcium, phosphorus, alkaline phosphatase, TSH, testosterone (in men), 24-hour urine calcium",
      "Serum protein electrophoresis and free light chains to exclude multiple myeloma in patients with unexplained vertebral fractures",
      "Vertebral fracture assessment (VFA) via DEXA or lateral thoracolumbar X-ray to identify prevalent morphometric fractures"
    ],
    management: [
      "First-line therapy: oral bisphosphonates (alendronate 70 mg weekly, risedronate 35 mg weekly) or IV zoledronic acid (5 mg annually) for most patients",
      "Denosumab (60 mg subcutaneous every 6 months) for patients intolerant to bisphosphonates or with renal impairment (not renally cleared)",
      "Teriparatide (20 mcg subcutaneous daily for up to 2 years) as anabolic therapy for severe osteoporosis, multiple vertebral fractures, or failure of antiresorptive agents",
      "Romosozumab (210 mg subcutaneous monthly for 12 months) as anti-sclerostin antibody providing dual anabolic and antiresorptive effect for very high-risk patients",
      "Transition strategy: always follow anabolic therapy (teriparatide or romosozumab) with antiresorptive agent to consolidate gains - discontinuation without transition causes rapid bone loss",
      "Bisphosphonate drug holiday after 5 years oral or 3 years IV in lower-risk patients - reassess with repeat DEXA and bone turnover markers; high-risk patients should continue treatment",
      "FRAX treatment thresholds: initiate pharmacotherapy if 10-year hip fracture probability is 3 percent or greater or major osteoporotic fracture probability is 20 percent or greater",
      "Glucocorticoid-induced osteoporosis: initiate bisphosphonate prophylaxis if prednisone dose is 2.5 mg or more daily expected for 3 or more months"
    ],
    nursingActions: [
      "Obtain baseline DEXA, FRAX score, and bone turnover markers before initiating therapy",
      "Ensure adequate calcium (1200 mg daily) and vitamin D (800-2000 IU daily with target 25-OH-D level 30-50 ng/mL) in all patients before starting pharmacotherapy",
      "Educate about denosumab rebound phenomenon: discontinuation causes rapid increase in bone turnover markers and vertebral fracture risk within 6-12 months if not transitioned to bisphosphonate",
      "Monitor for atypical femur fracture prodromal symptoms (thigh or groin pain) during long-term bisphosphonate or denosumab therapy and obtain femur X-ray if reported",
      "Perform dental clearance before initiating bisphosphonate or denosumab therapy and advise patients to maintain good oral hygiene to reduce osteonecrosis of the jaw risk",
      "Track bone turnover markers (CTX, P1NP) at 3-6 months to confirm treatment response before repeat DEXA",
      "Counsel on romosozumab cardiovascular warning: contraindicated in patients with recent MI or stroke within the past year",
      "Educate that teriparatide is limited to 2 years due to theoretical osteosarcoma risk observed in rat studies and must be followed by an antiresorptive agent"
    ],
    signs: {
      left: [
        "Vertebral compression fracture presenting as acute midline back pain, height loss, or incidental radiographic finding",
        "Hip fracture (femoral neck or intertrochanteric) after low-energy fall - carries 20-30 percent one-year mortality in elderly",
        "Distal radius (Colles) fracture from fall on outstretched hand - often the sentinel fracture prompting workup",
        "Progressive thoracic kyphosis with restrictive pulmonary physiology and altered center of gravity"
      ],
      right: [
        "Atypical femur fracture: transverse or short oblique fracture at the subtrochanteric or femoral shaft with lateral cortical thickening - associated with prolonged bisphosphonate use",
        "Osteonecrosis of the jaw: exposed bone in the oral cavity not healing within 8 weeks, associated with bisphosphonates and denosumab especially after dental procedures",
        "Denosumab rebound vertebral fractures: multiple new vertebral fractures occurring 6-18 months after denosumab discontinuation due to rebound osteoclastogenesis",
        "Hypocalcemia after denosumab or zoledronic acid administration, especially in vitamin D-deficient or CKD patients"
      ]
    },
    medications: [
      {
        name: "Denosumab",
        type: "Anti-RANKL Monoclonal Antibody",
        action: "Fully human monoclonal antibody that binds RANKL with high affinity, preventing it from activating RANK on osteoclast precursors, thereby profoundly inhibiting osteoclast differentiation, activation, and survival - mimics the physiologic action of OPG",
        sideEffects: "Hypocalcemia (especially in CKD and vitamin D deficiency), cellulitis and skin infections, osteonecrosis of the jaw (rare), atypical femur fracture (rare), rebound vertebral fractures on discontinuation",
        contra: "Hypocalcemia (must correct before administration), pregnancy, caution in immunocompromised patients",
        pearl: "Unlike bisphosphonates, denosumab does not accumulate in bone and its effects are fully reversible - this means discontinuation causes rapid rebound bone loss and must always be followed by bisphosphonate transition therapy"
      },
      {
        name: "Romosozumab",
        type: "Anti-Sclerostin Monoclonal Antibody",
        action: "Binds and inhibits sclerostin, releasing the inhibition on the Wnt/β-catenin signaling pathway in osteoblasts, producing a unique dual effect of simultaneously increasing bone formation (anabolic) and decreasing bone resorption (antiresorptive) - the only current agent with this mechanism",
        sideEffects: "Cardiovascular events (MI, stroke - black box warning), injection site reactions, hypocalcemia, jaw osteonecrosis (rare), atypical femur fracture (rare)",
        contra: "History of MI or stroke within preceding 12 months, hypocalcemia",
        pearl: "Limited to 12 monthly doses because the bone formation effect wanes with continued use (modeling-based formation is self-limiting); must be followed by antiresorptive therapy to maintain gains"
      },
      {
        name: "Teriparatide",
        type: "Recombinant PTH (1-34) Anabolic Agent",
        action: "Intermittent low-dose PTH administration paradoxically stimulates osteoblast activity over osteoclast activity by preferentially activating the bone formation arm of remodeling, increasing trabecular connectivity, cortical thickness, and overall bone strength",
        sideEffects: "Orthostatic hypotension (first-dose effect), leg cramps, nausea, transient hypercalcemia, injection site erythema",
        contra: "Unexplained elevated alkaline phosphatase, Paget disease, prior skeletal radiation, open epiphyses (pediatric patients), pre-existing hypercalcemia, bone metastases",
        pearl: "Must be used for no more than 2 years (FDA labeling based on rat osteosarcoma data at supratherapeutic doses) and MUST be followed by an antiresorptive agent - stopping without transition causes rapid loss of all BMD gains within 12-24 months"
      }
    ],
    pearls: [
      "Anabolic-first sequencing: in very high-risk patients (T-score below -3.0, multiple vertebral fractures, recent hip fracture), starting with teriparatide or romosozumab and then transitioning to a bisphosphonate produces greater BMD gains than antiresorptive-first strategies",
      "Denosumab must never be simply discontinued - always transition to a bisphosphonate (preferably zoledronic acid 6 months after the last denosumab dose) to prevent rebound vertebral fractures from explosive osteoclast reactivation",
      "FRAX has limitations: it underestimates risk in patients with type 2 diabetes (who have normal BMD but poor bone quality), glucocorticoid doses above 7.5 mg/day, multiple recent fractures, and lumbar spine BMD much lower than femoral neck BMD"
    ],
    quiz: [
      {
        question: "A nurse practitioner is managing a 72-year-old woman who completed 12 months of romosozumab for severe osteoporosis (T-score -3.5 with vertebral fractures). What is the most important next step?",
        options: [
          "Discontinue treatment and recheck DEXA in 2 years",
          "Transition to an antiresorptive agent such as alendronate or denosumab to consolidate bone gains",
          "Continue romosozumab for an additional 12 months to maximize benefit",
          "Switch to teriparatide for 2 years of additional anabolic therapy"
        ],
        correct: 1,
        rationale: "After completing romosozumab (limited to 12 monthly doses), transitioning to an antiresorptive agent is essential to consolidate the bone density gains achieved. Without transition therapy, the anabolic benefits are rapidly lost. Continuing romosozumab beyond 12 months is not recommended as the formation effect wanes. Sequential anabolic-to-antiresorptive therapy provides optimal long-term outcomes."
      }
    ]
  },

  "rib-fractures-np": {
    title: "Rib Fractures",
    cellular: {
      title: "Flail Chest Biomechanics, Pulmonary",
      content: "Advanced management of rib fractures requires understanding the biomechanics of flail chest, the pathophysiology of associated pulmonary contusion, and the rationale for regional analgesia techniques. Flail chest occurs when three or more contiguous ribs are each fractured in two or more locations, creating a free-floating segment of chest wall that is mechanically disconnected from the respiratory bellows. During spontaneous inspiration, the intact chest wall expands outward as the diaphragm descends, generating negative intrapleural pressure. The flail segment, no longer tethered to the skeletal framework, is drawn inward by this negative pressure (paradoxical motion), reducing the effective tidal volume. During expiration, positive intrathoracic pressure pushes the segment outward while the intact wall moves inward. This paradoxical respiratory movement not only reduces minute ventilation but also creates pendulum-like airflow (pendelluft) between the lungs, where air from the injured side moves to the contralateral lung during inspiration rather than exiting through the trachea, further impairing gas exchange.\n\nThe force required to produce a flail chest invariably causes underlying pulmonary contusion, which is the primary determinant of morbidity and mortality rather than the chest wall instability itself. Pulmonary contusion involves direct parenchymal injury with disruption of the alveolar-capillary membrane, leading to hemorrhage and edema within the alveolar spaces and interstitium. The contused lung develops ventilation-perfusion mismatch as blood continues to flow through non-ventilated, fluid-filled alveoli (intrapulmonary shunt). The inflammatory response peaks at 48-72 hours, during which worsening hypoxemia and bilateral infiltrates on imaging may progress to ARDS. Management of the contused lung involves protective ventilation strategies (low tidal volume 6 mL/kg ideal body weight, PEEP optimization to recruit atelectatic alveoli, permissive hypercapnia) and judicious fluid management because excessive crystalloid resuscitation worsens pulmonary edema in the contused tissue.\n\nRegional analgesia is the cornerstone of rib fracture management in the advanced practice setting. Thoracic epidural analgesia (TEA) provides bilateral continuous segmental analgesia by infusing local anesthetic (bupivacaine) with or without opioid (fentanyl or hydromorphone) into the epidural space at the appropriate thoracic dermatome level. TEA has been shown to reduce pneumonia rates, ICU length of stay, and ventilator days compared to systemic opioid analgesia. Intercostal nerve blocks, performed by injecting local anesthetic (bupivacaine 0.5 percent with epinephrine) at the inferior border of the rib proximal to the fracture site, provide excellent unilateral analgesia for 6-12 hours per injection. Paravertebral blocks offer an alternative to epidural placement, providing unilateral segmental analgesia with fewer hemodynamic effects than epidural. Surgical stabilization of rib fractures (SSRF) with titanium plates and screws is increasingly utilized for flail chest, multiple displaced fractures, and fractures causing intractable pain despite optimal regional analgesia, with evidence demonstrating reduced ventilator dependence and ICU length of stay."
    },
    riskFactors: [
      "High-energy blunt chest trauma (motor vehicle collision, fall from height) producing multiple fractures and pulmonary contusion",
      "Elderly patients (age greater than 65) with rib fractures have significantly higher pneumonia and mortality rates than younger adults with equivalent injuries",
      "Anticoagulant therapy increasing hemothorax risk from intercostal vessel laceration",
      "Pre-existing COPD with limited pulmonary reserve unable to compensate for impaired ventilation",
      "Bilateral rib fractures compounding ventilatory impairment and pain burden",
      "First and second rib fractures indicating very high-energy mechanism and associated with great vessel and brachial plexus injury",
      "Lower rib fractures (ribs 9-12) associated with hepatic injury (right) and splenic injury (left) requiring abdominal evaluation",
      "Flail chest with underlying pulmonary contusion as the primary driver of respiratory failure"
    ],
    diagnostics: [
      "CT chest with IV contrast as the gold standard for comprehensive assessment: rib fracture mapping, pulmonary contusion extent, pneumothorax, hemothorax, and mediastinal injury",
      "Arterial blood gas analysis with serial monitoring: PaO2/FiO2 ratio less than 300 suggesting ALI, less than 200 defining ARDS",
      "Chest X-ray for initial screening and serial monitoring of pulmonary contusion evolution (opacification peaks at 48-72 hours)",
      "Point-of-care ultrasound (POCUS) for rapid bedside detection of pneumothorax (absent lung sliding), hemothorax (dependent echogenic fluid), and rib fractures (cortical disruption)",
      "CT angiography of the chest for first/second rib fractures to evaluate aortic and great vessel injury",
      "FAST examination to assess for splenic or hepatic laceration with lower rib fractures",
      "Bone turnover markers and DEXA scan in elderly patients with fragility rib fractures to evaluate for underlying osteoporosis"
    ],
    management: [
      "Thoracic epidural analgesia as gold standard for multi-level rib fracture pain: continuous infusion of bupivacaine 0.0625-0.125 percent with fentanyl 2-5 mcg/mL at 4-8 mL/hour",
      "Intercostal nerve block with 0.5 percent bupivacaine with epinephrine at 1-2 levels above and below each fracture for targeted unilateral analgesia",
      "Paravertebral block as epidural alternative: single-injection or catheter-based technique providing ipsilateral multi-dermatomal somatic and sympathetic blockade",
      "Multimodal systemic analgesia: scheduled acetaminophen, NSAIDs (ketorolac IV then ibuprofen), gabapentin for neuropathic component, and limited opioids",
      "Surgical stabilization of rib fractures (SSRF) indications: flail chest, 3 or more severely displaced fractures, fractures causing intractable pain despite regional analgesia, failure to wean from mechanical ventilation",
      "Protective mechanical ventilation for respiratory failure: low tidal volume (6 mL/kg IBW), PEEP titration, plateau pressure less than 30 cmH2O",
      "Chest tube thoracostomy for pneumothorax greater than 20 percent or any hemothorax - use large-bore (28-36 Fr) for hemothorax to prevent clotting",
      "Judicious fluid resuscitation in pulmonary contusion - avoid excessive crystalloid which worsens parenchymal edema"
    ],
    nursingActions: [
      "Perform serial respiratory assessments including PaO2/FiO2 ratio trending to detect progression toward ARDS",
      "Manage thoracic epidural infusion: assess dermatome level of blockade, monitor for hypotension (sympathectomy), motor block, and catheter site infection",
      "Monitor for epidural complications: epidural hematoma (back pain, neurologic deficit), epidural abscess (fever, localized tenderness), dural puncture headache",
      "Perform aggressive pulmonary toilet: chest physiotherapy, nasotracheal suctioning if needed, bronchoscopy for mucus plugging",
      "Monitor chest tube output: greater than 1500 mL immediate output or greater than 200 mL/hour for 2-4 hours indicates massive hemothorax requiring surgical exploration",
      "Assess for abdominal organ injury with lower rib fractures: serial abdominal exams, hemoglobin monitoring, and FAST examination results",
      "Implement rib fracture scoring systems (such as the RibScore) to risk-stratify patients and guide ICU admission decisions",
      "Coordinate multidisciplinary approach involving trauma surgery, anesthesia/pain service, respiratory therapy, and physical therapy"
    ],
    signs: {
      left: [
        "Paradoxical chest wall movement in flail chest: affected segment retracts during inspiration and bulges during expiration",
        "Progressive hypoxemia peaking at 48-72 hours from evolving pulmonary contusion rather than mechanical chest wall instability",
        "Subcutaneous emphysema tracking from the fracture site along fascial planes indicating pneumothorax with ongoing air leak",
        "Massive hemothorax presenting with hypotension, tracheal deviation toward contralateral side, and absent ipsilateral breath sounds"
      ],
      right: [
        "Pendelluft phenomenon: ineffective gas exchange from pendulum-like airflow between lungs rather than through the trachea",
        "Widening alveolar-arterial oxygen gradient from intrapulmonary shunting through contused lung parenchyma",
        "Bilateral pulmonary infiltrates on CXR at 48-72 hours distinguishing contusion from initial presentation (contusion evolves; pneumothorax presents immediately)",
        "Intercostal artery hemorrhage presenting as delayed hemothorax 24-48 hours after injury, particularly in patients on anticoagulants"
      ]
    },
    medications: [
      {
        name: "Bupivacaine (Epidural/Intercostal)",
        type: "Long-Acting Amide Local Anesthetic",
        action: "Reversibly blocks sodium channels in nerve fibers, preventing depolarization and action potential propagation along intercostal sensory nerves, providing segmental analgesia without systemic sedation or respiratory depression",
        sideEffects: "Cardiovascular toxicity at high systemic levels (refractory ventricular arrhythmias, cardiac arrest), CNS toxicity (circumoral numbness, tinnitus, seizures), hypotension from sympathetic blockade (epidural), motor block",
        contra: "Patient refusal, coagulopathy or therapeutic anticoagulation (epidural placement), local infection at insertion site, hypovolemia (epidural), known allergy to amide local anesthetics",
        pearl: "Lipid emulsion (Intralipid 20 percent) must be immediately available when performing regional blocks - it is the specific antidote for local anesthetic systemic toxicity (LAST) and can be life-saving for bupivacaine-induced cardiac arrest"
      },
      {
        name: "Ketorolac",
        type: "Parenteral NSAID",
        action: "Non-selective cyclooxygenase inhibitor providing potent analgesic and anti-inflammatory effects comparable to moderate-dose opioids without respiratory depression, sedation, or cough suppression",
        sideEffects: "GI hemorrhage (highest risk of all NSAIDs), acute kidney injury, platelet dysfunction, surgical site bleeding",
        contra: "Active GI bleeding, renal impairment (CrCl less than 30 mL/min), coagulopathy, concurrent anticoagulants, use exceeding 5 days, post-CABG",
        pearl: "Ketorolac is the ideal systemic analgesic for rib fractures because it provides opioid-equivalent pain relief without suppressing respiratory drive or cough reflex - but must be limited to 5 days and used cautiously in trauma patients who may have occult renal injury"
      }
    ],
    pearls: [
      "In flail chest, respiratory failure is primarily caused by the underlying pulmonary contusion, not the paradoxical chest wall motion - stabilizing the flail segment alone does not resolve hypoxemia if significant contusion is present",
      "The 'Rule of 65': patients aged 65 or older with 3 or more rib fractures have mortality rates exceeding 20 percent and should be strongly considered for ICU-level monitoring with early epidural or regional analgesia",
      "Surgical rib fixation (SSRF) is an emerging standard for flail chest - evidence from recent trials demonstrates significant reductions in ventilator days, ICU length of stay, pneumonia rates, and long-term pain compared to non-operative management"
    ],
    quiz: [
      {
        question: "A nurse practitioner is managing a 70-year-old patient with 5 left-sided rib fractures and progressive hypoxemia despite IV opioid analgesia. PaO2/FiO2 ratio is 280. What is the most appropriate next intervention?",
        options: [
          "Increase the IV opioid dose to improve pain control and breathing",
          "Consult anesthesia for thoracic epidural catheter placement for superior regional analgesia",
          "Apply a rib binder and chest wrap for external stabilization",
          "Initiate mechanical ventilation immediately for respiratory failure"
        ],
        correct: 1,
        rationale: "Thoracic epidural analgesia is the gold standard for multi-level rib fracture pain management and has been shown to reduce pneumonia, ICU stay, and ventilator days. Increasing IV opioids risks respiratory depression. Rib binders are contraindicated. The PaO2/FiO2 of 280 indicates acute lung injury but does not yet require intubation. Regional analgesia will enable effective breathing and may prevent progression to respiratory failure."
      }
    ]
  }
};