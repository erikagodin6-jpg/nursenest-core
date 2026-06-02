import { pool } from "./storage";

const PROFESSION = "occupational-therapy";

interface OTEntry {
  slug: string;
  title: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  overview: string;
  mechanismPhysiology: string;
  clinicalRelevance: string;
  signsSymptoms: string;
  assessment: string;
  management: string;
  complications: string;
  clinicalPearls: string[];
  examPitfalls: string[];
  faqJson: { question: string; answer: string }[];
}

const entries: OTEntry[] = [
  // ===== ADDITIONAL PEDIATRIC OT =====
  {
    slug: "early-intervention-ot",
    title: "Early Intervention in OT",
    category: "Pediatric OT",
    seoTitle: "Early Intervention in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to early intervention OT services for infants and toddlers (0-3) under IDEA Part C.",
    seoKeywords: ["early intervention", "IDEA Part C", "infant OT", "0-3 services", "developmental delay"],
    overview: "Early intervention (EI) OT provides services to infants and toddlers (birth to 3 years) with developmental delays or conditions that place them at risk for delay. Services are mandated under IDEA Part C and are delivered in the child's natural environment (home, daycare). OTs address feeding, sensory processing, fine motor development, play, and caregiver coaching to promote developmental outcomes.",
    mechanismPhysiology: "The first three years of life represent a critical period of neuroplasticity when the brain is most responsive to environmental input and therapeutic intervention. Early identification and intervention capitalize on this period to maximize developmental outcomes.",
    clinicalRelevance: "EI OT focuses on coaching caregivers to support their child's development within daily routines rather than providing direct, clinic-based therapy. This family-centred, routine-based approach is the evidence-based standard for EI services.",
    signsSymptoms: "Developmental delays in fine motor, self-care, feeding, sensory processing, or play skills. Conditions at risk include prematurity, genetic syndromes, neurological conditions, and significant medical complexity.",
    assessment: "Bayley Scales of Infant Development, Peabody Developmental Motor Scales (PDMS-2), Ages and Stages Questionnaire (ASQ), Hawaii Early Learning Profile (HELP), and clinical observation within natural environments.",
    management: "Caregiver coaching using routines-based intervention, embedding therapeutic strategies into daily activities (feeding, play, bath, dressing), environmental modification, positioning guidance, sensory input strategies, and coordination with the IFSP team.",
    complications: "Delayed referral reducing the window for early intervention, caregiver stress and burnout, insurance/funding limitations, and difficulty transitioning from Part C to Part B (school) services at age 3.",
    clinicalPearls: [
      "EI is delivered in natural environments — home, daycare, community — not clinic.",
      "The IFSP (Individualized Family Service Plan) replaces the IEP for children 0-3.",
      "Coaching the caregiver is more effective than direct therapist-child intervention in EI."
    ],
    examPitfalls: [
      "Confusing IFSP (Part C, 0-3) with IEP (Part B, 3-21).",
      "Not knowing that EI must be delivered in the natural environment.",
      "Treating EI as direct therapy rather than caregiver coaching."
    ],
    faqJson: [
      { question: "What is early intervention?", answer: "EI provides developmental services to infants and toddlers (0-3) with delays or at-risk conditions, delivered in natural environments with a focus on caregiver coaching." },
      { question: "What is an IFSP?", answer: "The Individualized Family Service Plan is the EI equivalent of an IEP, documenting the child's developmental status, family concerns, outcomes, and services for children birth to 3." }
    ]
  },
  {
    slug: "in-hand-manipulation",
    title: "In-Hand Manipulation Skills",
    category: "Pediatric OT",
    seoTitle: "In-Hand Manipulation Skills in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to in-hand manipulation assessment and intervention in pediatric occupational therapy.",
    seoKeywords: ["in-hand manipulation", "fine motor", "translation", "rotation", "shift", "pediatric OT"],
    overview: "In-hand manipulation is the ability to adjust an object's position within one hand without the assistance of the other hand. Three primary components are translation (moving an object from fingertips to palm or palm to fingertips), shift (adjusting an object's position along the finger pads), and rotation (turning an object using the fingers). These skills develop between ages 2-7 and are essential for tool use, handwriting, and self-care tasks.",
    mechanismPhysiology: "In-hand manipulation requires intrinsic hand muscle control, tactile discrimination, proprioceptive awareness, and motor planning. It develops as the hand progresses from palmar (gross) to digital (fine) manipulation patterns, with the radial side of the hand becoming dominant for precision.",
    clinicalRelevance: "Deficits in in-hand manipulation affect pencil management, button/zipper manipulation, coin handling, and other tasks requiring precise object control within the hand. OTs assess and develop these skills as part of comprehensive fine motor intervention.",
    signsSymptoms: "Difficulty adjusting pencil grip without using the other hand, dropping small objects, difficulty manipulating buttons and zippers, transferring objects between hands excessively, and poor handwriting related to pencil management.",
    assessment: "Clinical observation of object manipulation, in-hand manipulation assessment tools, standardized fine motor assessments (PDMS-2, BOT-2), and functional task observation.",
    management: "Activities targeting specific components: translation (picking up coins one at a time and storing in palm, then placing out one at a time), rotation (turning a pencil end-over-end, spinning a top), shift (adjusting pencil position on fingers), and complex manipulation (opening/closing marker caps with one hand).",
    complications: "Children may develop compensatory strategies (using both hands, stabilizing against the body) that mask in-hand manipulation deficits.",
    clinicalPearls: [
      "Translation, shift, and rotation are the three primary in-hand manipulation components.",
      "Simple rotation (turning fingers) develops before complex rotation (end-over-end turning).",
      "With-stabilization (holding other objects in the same hand) is more advanced than without-stabilization."
    ],
    examPitfalls: [
      "Not knowing the three types of in-hand manipulation: translation, shift, rotation.",
      "Confusing in-hand manipulation with grasp patterns.",
      "Not assessing with-stabilization as a separate, higher-level skill."
    ],
    faqJson: [
      { question: "What is in-hand manipulation?", answer: "In-hand manipulation is the ability to adjust an object's position within one hand without using the other hand, including translation, shift, and rotation movements." },
      { question: "Why is in-hand manipulation important?", answer: "These skills are essential for pencil management, button/zipper manipulation, coin handling, and other fine motor tasks that require precise object control within the hand." }
    ]
  },
  // ===== ADDITIONAL GERIATRIC OT =====
  {
    slug: "osteoporosis-management-ot",
    title: "Osteoporosis Management in OT",
    category: "Geriatric OT",
    seoTitle: "Osteoporosis Management in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT role in osteoporosis management, fall prevention, and activity adaptation.",
    seoKeywords: ["osteoporosis", "bone density", "fracture prevention", "fall prevention", "geriatric OT"],
    overview: "OT for osteoporosis focuses on fracture prevention through fall risk reduction, activity modification, body mechanics education, and environmental safety. OTs address the functional impact of osteoporotic fractures (especially vertebral compression fractures and hip fractures), provide adaptive equipment, and teach strategies for safe engagement in daily activities.",
    mechanismPhysiology: "Osteoporosis is characterized by decreased bone mineral density and microarchitectural deterioration, increasing fracture risk. Risk factors include aging, female sex, postmenopausal status, low body weight, smoking, physical inactivity, and certain medications (corticosteroids).",
    clinicalRelevance: "OTs prevent fractures through fall prevention programs, body mechanics training, and environmental modification. After fractures occur, OTs provide rehabilitation addressing pain management, activity adaptation, and return to function while respecting bone healing precautions.",
    signsSymptoms: "Increased fracture risk, vertebral compression fractures (loss of height, kyphosis, back pain), wrist fractures (Colles'), hip fractures, and fear of falling leading to activity avoidance.",
    assessment: "Fall risk assessment, home safety evaluation, body mechanics during ADLs, posture assessment, pain evaluation, and functional activity tolerance.",
    management: "Fall prevention strategies, body mechanics education (avoid trunk flexion, twisting under load), safe lifting techniques, hip protectors, environmental modifications (removing tripping hazards), weight-bearing activity promotion, and post-fracture rehabilitation.",
    complications: "Progressive kyphosis limiting function, chronic pain, fear of falling leading to deconditioning, and loss of independence.",
    clinicalPearls: [
      "Avoid trunk flexion under load — this is the highest-risk movement for vertebral compression fractures.",
      "Hip protectors have evidence for reducing hip fracture risk in institutionalized older adults.",
      "Fall prevention is the most effective OT intervention for reducing osteoporotic fractures."
    ],
    examPitfalls: [
      "Not knowing that trunk flexion under load is contraindicated with osteoporosis.",
      "Ignoring fall prevention as the primary fracture prevention strategy.",
      "Not addressing kyphosis-related functional limitations."
    ],
    faqJson: [
      { question: "How does OT help with osteoporosis?", answer: "OTs prevent fractures through fall prevention, body mechanics education, environmental modification, and activity adaptation. After fractures, OTs provide rehabilitation and adaptive strategies." },
      { question: "What movements should be avoided with osteoporosis?", answer: "Avoid trunk flexion under load (bending forward while lifting), twisting under load, and high-impact activities. These movements increase the risk of vertebral compression fractures." }
    ]
  },
  {
    slug: "delirium-management-ot",
    title: "Delirium Management in OT",
    category: "Geriatric OT",
    seoTitle: "Delirium Management in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT role in delirium prevention, management, and functional recovery in older adults.",
    seoKeywords: ["delirium", "acute confusion", "hospital delirium", "cognitive fluctuation", "geriatric OT"],
    overview: "Delirium management in OT addresses the acute, fluctuating disturbance in attention and cognition that commonly occurs in hospitalized older adults. OTs contribute to delirium prevention through early mobilization, cognitive stimulation, orientation, and environmental modification. During delirium episodes, OTs adapt activities to the patient's fluctuating cognitive level and promote functional engagement to support recovery.",
    mechanismPhysiology: "Delirium reflects acute brain dysfunction triggered by medical illness, medications, surgery, infection, dehydration, or environmental factors. It involves disruption of neurotransmitter systems (especially acetylcholine) and neuroinflammation. Unlike dementia, delirium is typically reversible when the underlying cause is treated.",
    clinicalRelevance: "OTs are uniquely positioned to address delirium through multicomponent prevention programs that include early mobilization, meaningful activity engagement, orientation strategies, sleep promotion, and environmental modification — all core OT skills.",
    signsSymptoms: "Acute onset with fluctuating course, inattention, disorganized thinking, altered level of consciousness, perceptual disturbances (hallucinations), psychomotor agitation or retardation, and sleep-wake cycle disruption.",
    assessment: "Confusion Assessment Method (CAM), attention assessment, functional observation during ADLs, sleep-wake pattern monitoring, and environmental assessment.",
    management: "Delirium prevention: early mobilization, cognitive stimulation, orientation cues (clock, calendar, familiar objects), sleep hygiene, adequate hydration/nutrition support. During delirium: adapted communication, simplified activities, environmental modifications (reduce noise, adequate lighting, minimize room changes), and graded functional engagement as tolerated.",
    complications: "Prolonged hospitalization, functional decline, increased mortality, progression to dementia, falls, and caregiver distress.",
    clinicalPearls: [
      "Early mobilization is one of the most effective delirium prevention strategies — get patients out of bed early.",
      "Multicomponent intervention programs (like HELP — Hospital Elder Life Program) reduce delirium incidence by 30-40%.",
      "Distinguish delirium (acute, fluctuating) from dementia (chronic, progressive) and depression (persistent low mood)."
    ],
    examPitfalls: [
      "Confusing delirium (acute, reversible) with dementia (chronic, progressive).",
      "Not recognizing OT's role in delirium prevention.",
      "Ignoring hypoactive delirium (quiet, withdrawn) — it is as dangerous as hyperactive delirium."
    ],
    faqJson: [
      { question: "What is the OT's role in delirium?", answer: "OTs prevent delirium through early mobilization, cognitive stimulation, orientation, and environmental modification. During delirium, OTs adapt activities to the patient's fluctuating cognition." },
      { question: "How is delirium different from dementia?", answer: "Delirium is acute (hours to days), fluctuating, and usually reversible. Dementia is chronic (months to years), progressive, and irreversible. They can co-occur." }
    ]
  },
  // ===== ADDITIONAL NEUROLOGICAL REHABILITATION =====
  {
    slug: "myasthenia-gravis-ot",
    title: "Myasthenia Gravis in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Myasthenia Gravis in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT management of myasthenia gravis focusing on energy conservation and functional adaptation.",
    seoKeywords: ["myasthenia gravis", "MG", "fatigue", "neuromuscular junction", "energy conservation", "OT"],
    overview: "OT for myasthenia gravis (MG) addresses the fluctuating muscle weakness and fatigability that characterize this autoimmune neuromuscular junction disorder. OTs focus on energy conservation, activity pacing, adaptive equipment, and functional optimization during periods of relative strength. Symptoms typically worsen with activity and improve with rest.",
    mechanismPhysiology: "MG involves autoantibodies against acetylcholine receptors at the neuromuscular junction, impairing signal transmission and causing muscle weakness. Weakness increases with sustained or repeated muscle use (fatigability) and improves with rest. Ocular, bulbar, and generalized forms exist.",
    clinicalRelevance: "OTs are critical for managing the functional impact of MG through energy conservation, activity scheduling around medication peaks, adaptive equipment, and education about avoiding exacerbating factors.",
    signsSymptoms: "Fluctuating muscle weakness worsening with activity, ptosis (drooping eyelid), diplopia (double vision), difficulty chewing and swallowing, limb weakness increasing with repetitive use, and respiratory weakness in severe cases.",
    assessment: "Fatigue assessment, ADL performance observation (noting changes with sustained activity), grip strength over repeated measurements, and identification of activity patterns and energy expenditure.",
    management: "Energy conservation (prioritize essential activities), activity scheduling during peak medication effect, adaptive equipment (lightweight tools, supportive seating), rest breaks during activities, ergonomic modifications, and emergency action plan for myasthenic crisis.",
    complications: "Myasthenic crisis (respiratory failure requiring ventilation), medication side effects, falls from lower extremity weakness, and social isolation from fatigue.",
    clinicalPearls: [
      "Time demanding activities to coincide with peak medication effect (typically 1-2 hours after dose).",
      "Fatigue is the hallmark — teach energy conservation as the primary intervention.",
      "Avoid heat, stress, and overexertion — these can precipitate myasthenic crisis."
    ],
    examPitfalls: [
      "Not recognizing the fluctuating nature of MG weakness — it worsens with activity and improves with rest.",
      "Applying a strengthening program without considering fatigue management — overwork can worsen MG.",
      "Confusing MG (neuromuscular junction) with MS (CNS demyelination)."
    ],
    faqJson: [
      { question: "What is the key OT intervention for myasthenia gravis?", answer: "Energy conservation is the primary OT intervention, including activity pacing, scheduling demanding tasks during peak medication effect, and using adaptive equipment to reduce energy expenditure." },
      { question: "What makes MG different from other neurological conditions?", answer: "MG causes fluctuating weakness that specifically worsens with sustained muscle use and improves with rest, due to impaired neuromuscular junction transmission." }
    ]
  },
  {
    slug: "huntingtons-disease-ot",
    title: "Huntington's Disease in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Huntington's Disease in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for Huntington's disease across disease stages.",
    seoKeywords: ["Huntington's disease", "chorea", "progressive neurological", "occupational therapy", "cognitive decline"],
    overview: "OT for Huntington's disease (HD) addresses the progressive motor, cognitive, and psychiatric symptoms of this genetic neurodegenerative condition. OTs provide interventions across disease stages, from early adaptive strategies through late-stage positioning and caregiver support. Key areas include fall prevention, self-care adaptation, cognitive compensation, and psychosocial support.",
    mechanismPhysiology: "HD is an autosomal dominant genetic condition caused by CAG trinucleotide repeat expansion in the huntingtin gene, causing progressive neurodegeneration in the basal ganglia and cortex. Motor symptoms include chorea (involuntary movements), dystonia, and bradykinesia. Cognitive decline and psychiatric symptoms (depression, irritability) co-occur.",
    clinicalRelevance: "OTs provide stage-specific interventions: early stage (compensatory strategies, activity modification), middle stage (adaptive equipment, safety, caregiver training), and late stage (positioning, comfort, meaningful engagement, and family support).",
    signsSymptoms: "Chorea (involuntary writhing movements), cognitive decline (executive function, processing speed), psychiatric symptoms (depression, irritability, apathy), dysphagia, weight loss, gait instability, and progressive functional decline.",
    assessment: "Unified Huntington's Disease Rating Scale (UHDRS), ADL performance evaluation, cognitive screening, fall risk assessment, swallowing assessment, and caregiver burden evaluation.",
    management: "Early: activity modification, cognitive strategies, work adaptations, psychosocial support. Middle: adaptive equipment (weighted utensils for chorea, non-slip mats), home safety modifications, fall prevention, caregiver training. Late: positioning for comfort and function, meaningful activity adaptation, sensory stimulation, and end-of-life care planning.",
    complications: "Falls and injuries from chorea and gait instability, aspiration from dysphagia, severe weight loss, social isolation, and caregiver burnout.",
    clinicalPearls: [
      "Weighted utensils and wrist weights can reduce the functional impact of chorea during feeding.",
      "Cognitive decline in HD primarily affects executive function — focus compensatory strategies here.",
      "Address caregiver needs proactively — HD caregivers have high rates of burnout and depression."
    ],
    examPitfalls: [
      "Not recognizing the triad of motor, cognitive, and psychiatric symptoms in HD.",
      "Applying restorative approaches in a progressive condition — focus on adaptation and maintenance.",
      "Ignoring the genetic implications for family members when providing psychosocial support."
    ],
    faqJson: [
      { question: "What is Huntington's disease?", answer: "HD is a genetic neurodegenerative condition causing progressive chorea (involuntary movements), cognitive decline, and psychiatric symptoms, typically with onset in middle adulthood." },
      { question: "How does OT help with Huntington's disease?", answer: "OTs provide stage-appropriate interventions including activity modification, adaptive equipment, fall prevention, cognitive strategies, caregiver training, and comfort care in late stages." }
    ]
  },
  // ===== ADDITIONAL HAND THERAPY =====
  {
    slug: "mallet-finger",
    title: "Mallet Finger Management",
    category: "Hand Therapy",
    seoTitle: "Mallet Finger in OT — OT Encyclopedia",
    seoDescription: "Guide to mallet finger splinting and management in occupational therapy hand therapy.",
    seoKeywords: ["mallet finger", "DIP extension splint", "extensor tendon", "finger splint", "hand therapy"],
    overview: "Mallet finger is a disruption of the terminal extensor tendon at the distal interphalangeal (DIP) joint, resulting in the inability to actively extend the DIP. OTs/hand therapists are the primary providers of conservative management, which involves continuous DIP extension splinting for 6-8 weeks followed by a gradual weaning program.",
    mechanismPhysiology: "Mallet finger results from forced flexion of an extended DIP joint, causing either tendon rupture (tendinous mallet) or avulsion fracture of the distal phalanx (bony mallet). The extensor mechanism at the DIP is disrupted, preventing active extension.",
    clinicalRelevance: "Conservative management with continuous DIP extension splinting is effective for most mallet fingers. The OT's role in patient education, splint fabrication, and compliance monitoring is critical for successful outcomes.",
    signsSymptoms: "DIP joint droops into flexion, inability to actively extend the DIP, pain and swelling at the DIP, and a characteristic 'drooping fingertip' appearance.",
    assessment: "DIP extension lag measurement, assessment of tendon integrity, X-ray for bony mallet, and swan-neck deformity assessment (secondary complication).",
    management: "Custom DIP extension splint (dorsal or volar) maintaining the DIP in 0° extension (slight hyperextension acceptable). Continuous splinting for 6-8 weeks — the splint must NEVER be removed and the DIP must never flex during the splinting period. Gradual weaning over 4-6 additional weeks. PIP remains free throughout treatment.",
    complications: "Swan-neck deformity (if untreated), skin maceration under the splint, loss of DIP flexion from prolonged extension, and recurrence if the DIP is flexed during the splinting period.",
    clinicalPearls: [
      "The DIP must NEVER flex during the initial 6-8 week splinting period — even one flexion event can restart the healing clock.",
      "When cleaning under the splint, maintain DIP extension by pressing the fingertip against a table surface.",
      "Swan-neck deformity can develop as a late complication if mallet finger is untreated."
    ],
    examPitfalls: [
      "Not knowing that continuous DIP extension splinting is the treatment for mallet finger.",
      "Including the PIP in the splint — only the DIP needs to be immobilized.",
      "Not understanding that any DIP flexion during the healing period can restart the process."
    ],
    faqJson: [
      { question: "What is mallet finger?", answer: "Mallet finger is a disruption of the terminal extensor tendon at the DIP joint, causing the fingertip to droop and inability to actively straighten the DIP." },
      { question: "How long must the mallet finger splint be worn?", answer: "Continuous DIP extension splinting for 6-8 weeks (never removed), followed by gradual weaning over 4-6 additional weeks." }
    ]
  },
  {
    slug: "boutonniere-deformity",
    title: "Boutonniere Deformity Management",
    category: "Hand Therapy",
    seoTitle: "Boutonniere Deformity in OT — OT Encyclopedia",
    seoDescription: "Guide to boutonniere deformity assessment, splinting, and management in hand therapy.",
    seoKeywords: ["boutonniere deformity", "central slip", "extensor tendon", "PIP flexion", "hand therapy"],
    overview: "Boutonniere deformity is characterized by PIP flexion and DIP hyperextension resulting from disruption of the central slip of the extensor tendon at the PIP joint. The lateral bands migrate volarly, becoming flexors of the PIP and hyperextensors of the DIP. OTs manage this through PIP extension splinting, exercise programs, and serial splinting for established deformities.",
    mechanismPhysiology: "Central slip disruption allows the PIP to flex. The lateral bands then migrate volar to the PIP axis of rotation, causing them to function as PIP flexors rather than extensors. Simultaneously, the lateral bands tighten at the DIP, causing hyperextension. This creates the characteristic 'buttonhole' deformity.",
    clinicalRelevance: "Early identification and treatment of central slip injuries prevents established boutonniere deformity. OTs/hand therapists provide acute and chronic management through splinting, exercise, and functional training.",
    signsSymptoms: "PIP flexion contracture, DIP hyperextension, loss of PIP extension, positive Elson test (central slip integrity test), and difficulty with functional grasp patterns.",
    assessment: "Elson test (assessing central slip integrity), goniometric PIP and DIP ROM, assessment of deformity flexibility (passively correctable vs. fixed), and functional hand use evaluation.",
    management: "Acute: PIP extension splinting (6-8 weeks continuous), allowing DIP motion. DIP flexion exercises to maintain lateral band excursion. Chronic: serial static PIP extension splinting, dynamic PIP extension splinting, and manual therapy to mobilize contracted structures.",
    complications: "Fixed PIP flexion contracture, loss of DIP flexion, difficulty regaining full PIP extension if treatment is delayed, and swan-neck deformity of adjacent fingers from compensatory patterns.",
    clinicalPearls: [
      "Splint only the PIP in extension — the DIP must be left free and ACTIVELY FLEXED to prevent lateral band tightening.",
      "The Elson test: flex PIP over the edge of a table and ask the patient to extend against resistance — if the DIP hyperextends, the central slip is disrupted.",
      "Early treatment (within 2-3 weeks) produces the best outcomes — delayed treatment requires longer splinting."
    ],
    examPitfalls: [
      "Confusing boutonniere (PIP flexion/DIP hyperextension) with swan-neck (PIP hyperextension/DIP flexion) deformity.",
      "Splinting the DIP in extension — the DIP must remain free and be actively flexed.",
      "Not knowing the Elson test for central slip integrity."
    ],
    faqJson: [
      { question: "What is a boutonniere deformity?", answer: "A boutonniere deformity involves PIP flexion and DIP hyperextension due to central slip disruption at the PIP joint, with volar migration of the lateral bands." },
      { question: "How is boutonniere deformity treated?", answer: "PIP extension splinting for 6-8 weeks with the DIP left free for active flexion exercises. Early treatment produces the best outcomes." }
    ]
  },
  {
    slug: "lateral-epicondylitis",
    title: "Lateral Epicondylitis (Tennis Elbow)",
    category: "Hand Therapy",
    seoTitle: "Lateral Epicondylitis in OT — OT Encyclopedia",
    seoDescription: "Guide to OT management of lateral epicondylitis including splinting, ergonomics, and rehabilitation.",
    seoKeywords: ["lateral epicondylitis", "tennis elbow", "wrist extensors", "counterforce brace", "hand therapy"],
    overview: "Lateral epicondylitis (tennis elbow) is overuse tendinopathy of the common extensor origin at the lateral epicondyle, most commonly affecting the extensor carpi radialis brevis (ECRB). OTs provide conservative management including counterforce bracing, wrist extension splinting, activity modification, ergonomic intervention, and eccentric strengthening programs.",
    mechanismPhysiology: "Lateral epicondylitis results from repetitive wrist extension and forearm supination activities causing microtearing and degenerative changes in the common extensor tendon origin. Despite the name 'epicondylitis,' the pathology is primarily degenerative (tendinosis) rather than inflammatory (tendinitis).",
    clinicalRelevance: "OTs address lateral epicondylitis through task analysis and modification, ergonomic assessment, bracing, and progressive rehabilitation. The OT's ability to analyze work and daily activities contributing to the condition is central to effective management.",
    signsSymptoms: "Pain at the lateral epicondyle, pain with gripping and wrist extension, weakness of grip strength, positive Cozen's test (resisted wrist extension with forearm pronated), and difficulty with daily tasks requiring grip.",
    assessment: "Palpation of the lateral epicondyle, Cozen's test, Mill's test, grip strength dynamometry (compare bilateral), pain assessment, and activity/work analysis.",
    management: "Counterforce (tennis elbow) brace applied 1-2 cm distal to the lateral epicondyle, wrist extension splint for severe cases, activity modification (neutral wrist during gripping, reduce repetitive wrist extension), ergonomic workstation assessment, eccentric wrist extensor strengthening (Tyler protocol), and graded return to activities.",
    complications: "Chronic tendinopathy, recurrence if causative activities are not modified, and secondary grip weakness.",
    clinicalPearls: [
      "A counterforce brace redistributes force away from the damaged tendon — apply 1-2 cm distal to the epicondyle.",
      "Eccentric strengthening (slow wrist flexion from extended position against resistance) has the strongest evidence.",
      "Address the causative activities — treatment without activity modification leads to recurrence."
    ],
    examPitfalls: [
      "Confusing lateral epicondylitis (wrist extensors, lateral) with medial epicondylitis (wrist flexors, medial).",
      "Not knowing the counterforce brace placement (distal to the epicondyle, not on it).",
      "Focusing only on the elbow without addressing grip patterns and wrist position during activities."
    ],
    faqJson: [
      { question: "What causes lateral epicondylitis?", answer: "Repetitive wrist extension and gripping activities cause microtearing and degeneration of the common extensor tendon at the lateral epicondyle." },
      { question: "How does a counterforce brace help?", answer: "The brace, placed 1-2 cm distal to the lateral epicondyle, creates a secondary origin for the wrist extensors, redistributing force away from the damaged tendon." }
    ]
  },
  // ===== ADDITIONAL SPLINTING & ORTHOTICS =====
  {
    slug: "figure-of-eight-splint",
    title: "Figure-of-Eight Splint",
    category: "Splinting & Orthotics",
    seoTitle: "Figure-of-Eight Splint for Swan-Neck Deformity — OT Encyclopedia",
    seoDescription: "Guide to figure-of-eight splinting for swan-neck and PIP hyperextension in OT.",
    seoKeywords: ["figure-of-eight splint", "swan-neck deformity", "PIP hyperextension", "ring splint", "hand therapy"],
    overview: "The figure-of-eight splint (also known as a ring splint or silver ring splint) is a small orthotic device that blocks PIP hyperextension while allowing full PIP flexion. It is the primary conservative treatment for swan-neck deformity and PIP joint hypermobility. The splint loops around the proximal and middle phalanges in a figure-of-eight pattern, acting as a dorsal block.",
    mechanismPhysiology: "Swan-neck deformity involves PIP hyperextension with DIP flexion, caused by imbalance between the intrinsic and extrinsic extensor mechanisms. The figure-of-eight splint limits PIP hyperextension to prevent the 'snapping' into the deformed position while preserving functional flexion for grasp.",
    clinicalRelevance: "OTs fabricate figure-of-eight splints from thermoplastic or recommend commercially available silver ring splints (e.g., SIRIS). These small, functional splints are worn during daily activities and significantly improve hand function by preventing the PIP from locking in hyperextension.",
    signsSymptoms: "PIP hyperextension with DIP flexion, difficulty initiating PIP flexion from the hyperextended position, and functional limitations with grasp and manipulation.",
    assessment: "PIP hyperextension measurement, DIP flexion assessment, flexibility of the deformity, functional grasp observation, and identification of contributing factors.",
    management: "Custom thermoplastic figure-of-eight splint or commercial silver ring splint. The splint allows full PIP flexion to approximately 90° while blocking the last 10-15° of hyperextension. Worn during functional activities; may be removed for exercises or bathing.",
    complications: "Skin irritation from continuous wear, splint migration during activities, and the need for precise fitting to be effective without restricting flexion.",
    clinicalPearls: [
      "The figure-of-eight splint blocks PIP hyperextension while preserving full PIP flexion for grasp.",
      "Silver ring splints (SIRIS) are commercially available and more cosmetically appealing than thermoplastic.",
      "The splint must block hyperextension without limiting the PIP flexion needed for functional grasp."
    ],
    examPitfalls: [
      "Confusing swan-neck deformity (PIP hyperextension/DIP flexion) with boutonniere deformity (PIP flexion/DIP hyperextension).",
      "Not knowing that the figure-of-eight splint treats swan-neck deformity.",
      "Using a splint that blocks both hyperextension AND flexion — only hyperextension should be blocked."
    ],
    faqJson: [
      { question: "What does a figure-of-eight splint do?", answer: "It blocks PIP hyperextension (preventing swan-neck deformity locking) while allowing full PIP flexion for functional grasp and manipulation." },
      { question: "When is a figure-of-eight splint used?", answer: "It is used for swan-neck deformity, PIP hyperextension hypermobility, and conditions where PIP hyperextension impairs hand function." }
    ]
  },
  // ===== ADDITIONAL ADAPTIVE EQUIPMENT & ASSISTIVE TECHNOLOGY =====
  {
    slug: "transfer-techniques-equipment",
    title: "Transfer Techniques & Equipment",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Transfer Techniques and Equipment in OT — OT Encyclopedia",
    seoDescription: "Guide to transfer training techniques and equipment in occupational therapy.",
    seoKeywords: ["transfer training", "sliding board", "stand-pivot transfer", "sit-to-stand", "OT"],
    overview: "Transfer training in OT teaches clients safe methods for moving between surfaces (bed, wheelchair, toilet, car, tub). OTs assess transfer ability, select appropriate techniques, recommend equipment, and train both clients and caregivers. Transfer types include stand-pivot, sliding board, dependent, mechanical lift, and sit-to-stand transfers.",
    mechanismPhysiology: "Safe transfers require adequate upper extremity strength, balance, lower extremity weight-bearing ability, cognitive understanding, and caregiver technique. Transfer method selection is based on the client's physical and cognitive capabilities, weight, and caregiver availability.",
    clinicalRelevance: "Transfer independence directly impacts discharge disposition and level of care needed. A client who can transfer independently may return home; one who cannot may require assisted living or nursing care. OTs maximize transfer independence through training and equipment.",
    signsSymptoms: "Difficulty moving from bed to chair, wheelchair to toilet, wheelchair to car, and other surface-to-surface transitions. Risk of falls during transfers. Caregiver strain from assisting with transfers.",
    assessment: "Transfer ability across different surfaces, upper and lower extremity strength, balance (sitting and standing), cognitive ability to follow transfer steps, weight-bearing status, and caregiver availability and capability.",
    management: "Stand-pivot transfer (for clients with some lower extremity weight-bearing), sliding board transfer (for SCI and clients with no lower extremity function), mechanical lift transfer (for dependent clients), sit-to-stand training, car transfer techniques, and caregiver training in safe body mechanics.",
    complications: "Falls during transfers, shoulder injuries in caregivers, skin shearing from improper sliding board use, and autonomic dysreflexia during transfers (SCI above T6).",
    clinicalPearls: [
      "Transfer toward the stronger side whenever possible.",
      "Sliding boards require adequate upper extremity strength and sitting balance — assess before recommending.",
      "Lock wheelchair brakes, remove footrests, and ensure surfaces are at similar heights before every transfer."
    ],
    examPitfalls: [
      "Not knowing which transfer type is appropriate for different functional levels.",
      "Forgetting to lock wheelchair brakes before transfer — the #1 preventable transfer safety issue.",
      "Not training caregivers in proper body mechanics for assisted transfers."
    ],
    faqJson: [
      { question: "What types of transfers do OTs teach?", answer: "OTs teach stand-pivot transfers, sliding board transfers, dependent transfers, mechanical lift transfers, and specialized transfers (car, tub, toilet) based on the client's functional abilities." },
      { question: "When is a sliding board transfer used?", answer: "Sliding board transfers are used when the client has good upper extremity strength and sitting balance but cannot weight-bear through the lower extremities, such as in paraplegia." }
    ]
  },
  {
    slug: "seating-positioning-systems",
    title: "Seating & Positioning Systems",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Seating and Positioning Systems in OT — OT Encyclopedia",
    seoDescription: "Guide to seating and positioning assessment and equipment in occupational therapy.",
    seoKeywords: ["seating", "positioning", "wheelchair seating", "pressure mapping", "postural support", "OT"],
    overview: "Seating and positioning systems in OT address the need for optimal postural support, pressure distribution, comfort, and function for individuals who spend significant time in seated positions, particularly wheelchair users. OTs assess sitting posture, prescribe seating components (cushions, backs, laterals, headrests), and customize positioning to prevent secondary complications.",
    mechanismPhysiology: "Proper seating provides a stable base of support, distributes pressure to prevent tissue breakdown, maintains trunk alignment, facilitates respiratory function, and positions the upper extremities for functional use. Pressure mapping technology objectively measures pressure distribution.",
    clinicalRelevance: "OTs are primary providers of seating and positioning assessments, particularly for complex rehabilitation technology (CRT). Proper seating prevents pressure injuries, reduces postural deformity, improves respiratory function, and maximizes upper extremity function.",
    signsSymptoms: "Postural asymmetry, pressure injury risk, discomfort in current seating, progressive postural deformity, decreased respiratory function in seated position, and poor upper extremity function related to positioning.",
    assessment: "Sitting posture evaluation (supine, mat, and seated), pressure mapping, pelvic position assessment, trunk alignment, head control, and functional impact of positioning on upper extremity use and respiratory function.",
    management: "Cushion selection (foam, gel, air, hybrid) based on pressure mapping, back support selection (planar, contoured, custom-molded), lateral trunk supports, headrests, pelvic positioning belts, and tilt/recline features for pressure relief and positioning.",
    complications: "Pressure injuries from inadequate cushioning, progressive postural deformity, respiratory compromise from poor positioning, and equipment discomfort leading to non-use.",
    clinicalPearls: [
      "The pelvis is the foundation of seated posture — address pelvic position first.",
      "Pressure mapping provides objective data for cushion selection and comparison.",
      "Tilt-in-space wheelchairs allow pressure redistribution without changing the hip angle."
    ],
    examPitfalls: [
      "Not assessing the pelvis as the foundation of seated posture.",
      "Prescribing a cushion without pressure mapping assessment.",
      "Confusing tilt (entire seat tilts — hip angle unchanged) with recline (back angle changes — hip angle opens)."
    ],
    faqJson: [
      { question: "Why is seating assessment important?", answer: "Proper seating prevents pressure injuries, reduces postural deformity, improves breathing, and optimizes upper extremity function for individuals who spend extended time in seated positions." },
      { question: "What is the difference between tilt and recline?", answer: "Tilt moves the entire seating system as a unit (hip angle stays the same), redistributing pressure. Recline opens the hip angle between seat and back, which may cause shearing." }
    ]
  },
  {
    slug: "bathroom-safety-equipment",
    title: "Bathroom Safety Equipment",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Bathroom Safety Equipment in OT — OT Encyclopedia",
    seoDescription: "Guide to bathroom safety equipment assessment and recommendation in occupational therapy.",
    seoKeywords: ["bathroom safety", "grab bars", "raised toilet seat", "shower bench", "commode", "OT"],
    overview: "Bathroom safety equipment encompasses devices that improve safety and independence in the bathroom, the most hazardous room in the home for falls. OTs assess the bathroom environment, recommend appropriate equipment, train clients in safe use, and verify proper installation. Common equipment includes grab bars, raised toilet seats, shower chairs/benches, tub transfer benches, handheld showerheads, and commodes.",
    mechanismPhysiology: "Bathroom falls result from the combination of wet surfaces, undressing (reduced stability), confined spaces, and transfers to/from low surfaces (toilet, tub). Equipment addresses these risks by providing support surfaces, raising low surfaces, and enabling seated bathing.",
    clinicalRelevance: "Bathroom equipment recommendation is one of the most common and impactful OT interventions for older adults and individuals with disabilities. Proper equipment selection and placement significantly reduces fall risk and increases independence.",
    signsSymptoms: "Difficulty getting on/off the toilet, falls or near-falls in the bathroom, difficulty entering/exiting the tub or shower, and inability to bathe independently.",
    assessment: "Bathroom environment evaluation, transfer assessment (toilet, tub), balance during bathing tasks, grip strength for grab bars, and client preferences and bathroom layout.",
    management: "Grab bars (placed at toilet, tub entry/exit, and shower — into wall studs), raised toilet seat (with or without arms), tub transfer bench, shower chair, handheld showerhead, non-slip bath mat, bedside commode (if bathroom access is limited), and toilet safety frame.",
    complications: "Improperly installed grab bars (not in studs), wrong equipment size, cluttered bathroom reducing mobility, and non-compliance with equipment use.",
    clinicalPearls: [
      "Grab bars must be installed into wall studs or with appropriate wall anchors — suction cup bars are NOT safe for weight-bearing.",
      "A raised toilet seat should increase seat height to approximately knee height for easy sit-to-stand.",
      "Tub transfer benches are the safest tub entry option — the client sits, then slides across."
    ],
    examPitfalls: [
      "Recommending suction cup grab bars for weight-bearing use — they are not safe.",
      "Not assessing the specific bathroom layout before recommending equipment.",
      "Forgetting that grab bar placement differs for different activities (toileting vs. tub transfer)."
    ],
    faqJson: [
      { question: "What is the most important bathroom safety modification?", answer: "Grab bars installed in wall studs at the toilet and tub/shower are the single most important modification, providing secure support during transfers and position changes." },
      { question: "What is a tub transfer bench?", answer: "A tub transfer bench is a seat that spans the tub wall, allowing the client to sit outside the tub, slide across the bench, and then swing their legs in — eliminating the need to step over the tub wall." }
    ]
  },
  // ===== ADDITIONAL MENTAL HEALTH OT =====
  {
    slug: "motivational-interviewing-ot",
    title: "Motivational Interviewing in OT",
    category: "Mental Health OT",
    seoTitle: "Motivational Interviewing in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to motivational interviewing techniques applied in occupational therapy practice.",
    seoKeywords: ["motivational interviewing", "MI", "behavior change", "ambivalence", "client-centred", "OT"],
    overview: "Motivational Interviewing (MI) in OT is a collaborative, goal-oriented communication style used to strengthen a client's motivation for change. OTs apply MI principles when clients are ambivalent about engaging in therapy, making lifestyle changes, using adaptive equipment, or following through with recommendations. MI uses open-ended questions, affirmations, reflections, and summaries (OARS) to explore ambivalence and build intrinsic motivation.",
    mechanismPhysiology: "MI is based on the premise that motivation for change comes from within the client, not from external pressure. When therapists use directive or confrontational approaches, client resistance typically increases. MI resolves ambivalence by eliciting the client's own reasons for change ('change talk').",
    clinicalRelevance: "OTs encounter ambivalence regularly — clients resistant to using adaptive equipment, reluctant to modify activities, or unmotivated to participate in therapy. MI provides a structured approach for engaging these clients without creating resistance.",
    signsSymptoms: "Client ambivalence about therapy participation, resistance to recommended changes, poor compliance with home programs, reluctance to use adaptive equipment, and difficulty maintaining lifestyle modifications.",
    assessment: "Readiness for change assessment (precontemplation, contemplation, preparation, action, maintenance stages), identification of ambivalence, and exploration of barriers to engagement.",
    management: "OARS technique: Open-ended questions ('What concerns do you have about using the shower bench?'), Affirmations ('You've shown real dedication to your recovery'), Reflective listening ('It sounds like you're worried about looking different with the equipment'), and Summaries. Elicit change talk, develop discrepancy between current behavior and goals, and support self-efficacy.",
    complications: "MI requires practice and training for effective implementation. It may not be appropriate when immediate safety concerns require direct intervention. Cultural considerations affect the communication style.",
    clinicalPearls: [
      "OARS: Open-ended questions, Affirmations, Reflective listening, Summaries.",
      "Resistance is a signal to change YOUR approach, not to push harder.",
      "Elicit change talk by asking: 'What would be different if you used this equipment?'"
    ],
    examPitfalls: [
      "Using confrontational or directive approaches when MI would be more effective.",
      "Not recognizing the stages of change (precontemplation through maintenance).",
      "Confusing MI (communication style for building motivation) with CBT (cognitive restructuring)."
    ],
    faqJson: [
      { question: "What is motivational interviewing?", answer: "MI is a collaborative communication style that strengthens a client's own motivation for change by exploring ambivalence, eliciting change talk, and supporting self-efficacy." },
      { question: "When do OTs use MI?", answer: "OTs use MI when clients are ambivalent about therapy participation, equipment use, lifestyle changes, or adherence to recommendations, helping them find their own motivation for change." }
    ]
  },
  // ===== ADDITIONAL ACTIVITIES OF DAILY LIVING =====
  {
    slug: "grooming-and-hygiene-ot",
    title: "Grooming & Hygiene Techniques in OT",
    category: "Activities of Daily Living",
    seoTitle: "Grooming and Hygiene Techniques in OT — OT Encyclopedia",
    seoDescription: "Guide to adaptive grooming and hygiene techniques in occupational therapy.",
    seoKeywords: ["grooming", "hygiene", "adaptive techniques", "oral care", "hair care", "ADL", "OT"],
    overview: "Grooming and hygiene intervention in OT addresses the self-care tasks of oral hygiene, hair care, shaving, skin care, nail care, and applying cosmetics/deodorant. OTs assess performance, identify barriers, recommend adaptive equipment, teach compensatory techniques, and modify the grooming environment. Independence in grooming significantly impacts self-esteem, social participation, and dignity.",
    mechanismPhysiology: "Grooming tasks require fine motor dexterity, bilateral coordination, upper extremity ROM (shoulder, elbow, wrist), visual acuity, standing or seated balance, and cognitive sequencing. Disability affecting any of these components requires adaptive strategies.",
    clinicalRelevance: "Grooming independence is a priority for most clients because it directly impacts self-image, social confidence, and dignity. OTs address grooming across all practice settings as a fundamental ADL.",
    signsSymptoms: "Difficulty brushing teeth or hair, inability to shave safely, difficulty applying deodorant or cosmetics, and dependence on caregivers for personal hygiene.",
    assessment: "Observation of grooming task performance, identification of specific barriers (ROM, strength, coordination, cognition, vision), equipment needs assessment, and grooming routine analysis.",
    management: "Adaptive equipment: long-handled comb/brush, electric razor (safer than manual), suction-cup brush for one-handed nail care, wall-mounted soap dispenser, pump-top containers. Techniques: seated grooming for safety, mirror placement optimization, adapted grip patterns, and one-handed techniques.",
    complications: "Falls during standing grooming, cuts from impaired sensation (shaving), skin irritation from inadequate hygiene, and oral health decline from impaired brushing.",
    clinicalPearls: [
      "Electric razors are safer than manual razors for clients with tremor, weakness, or impaired sensation.",
      "Pump-top containers replace twist-off caps for clients with limited grip strength.",
      "Suction-cup devices (nail brush, denture brush) enable one-handed grooming tasks."
    ],
    examPitfalls: [
      "Overlooking grooming as a therapeutic priority — it significantly impacts self-esteem and social participation.",
      "Not assessing seated vs. standing grooming for safety.",
      "Forgetting to address oral hygiene — it affects overall health outcomes."
    ],
    faqJson: [
      { question: "What adaptive equipment helps with grooming?", answer: "Common grooming aids include long-handled combs/brushes, electric razors, suction-cup nail brushes, pump-top containers, and adapted grip toothbrushes." },
      { question: "Why is grooming independence important?", answer: "Grooming directly impacts self-esteem, dignity, social confidence, and willingness to engage in community activities. It is a high priority for most clients." }
    ]
  },
  {
    slug: "home-management-skills",
    title: "Home Management Skills in OT",
    category: "Activities of Daily Living",
    seoTitle: "Home Management Skills in OT — OT Encyclopedia",
    seoDescription: "Guide to OT intervention for home management and household task training.",
    seoKeywords: ["home management", "household tasks", "cleaning", "laundry", "IADL", "occupational therapy"],
    overview: "Home management skills in OT encompass the ability to perform household tasks including cleaning, laundry, home maintenance, and organizational tasks required for independent living. OTs assess and train these skills as part of IADL intervention, using activity analysis, task simplification, adaptive equipment, and energy conservation to enable safe and effective home management.",
    mechanismPhysiology: "Home management tasks require physical endurance, balance, strength (lifting, carrying, bending, reaching), cognitive planning and sequencing, and organizational skills. These tasks are more physically and cognitively demanding than basic ADLs.",
    clinicalRelevance: "Home management skills are critical for independent community living. Inability to manage household tasks may result in unsafe living conditions, need for home care services, or premature institutional placement.",
    signsSymptoms: "Difficulty cleaning, doing laundry, organizing the home, performing home repairs, and maintaining a safe living environment.",
    assessment: "Home management task observation, environmental assessment, endurance evaluation, cognitive sequencing assessment, and safety evaluation during household tasks.",
    management: "Energy conservation during household tasks, work simplification (organizing supplies, reducing unnecessary steps), adaptive equipment (long-handled duster, front-loading washer, lightweight vacuum), task modification (seated ironing, counter-height work surfaces), and cognitive aids (checklists, task schedules).",
    complications: "Falls during household tasks (reaching, bending, carrying), burns during cooking/ironing, and overwhelm from multi-step household management.",
    clinicalPearls: [
      "Organize cleaning supplies in a portable caddy to reduce trips back and forth.",
      "Front-loading washers eliminate the need to reach into a top-loading machine.",
      "Break large tasks into smaller, manageable steps scheduled across the week."
    ],
    examPitfalls: [
      "Not assessing home management as part of discharge planning.",
      "Focusing only on basic ADLs without addressing IADLs including home management.",
      "Ignoring energy conservation needs during household tasks for clients with fatigue."
    ],
    faqJson: [
      { question: "What home management skills does OT address?", answer: "OTs assess and train cleaning, laundry, home organization, basic home maintenance, and household safety, using task modification, adaptive equipment, and energy conservation strategies." },
      { question: "Why are home management skills important for discharge?", answer: "Inability to manage household tasks may result in unsafe living conditions and the need for additional care services, directly affecting whether a person can live independently." }
    ]
  },
  // ===== ADDITIONAL ERGONOMICS & WORK REHABILITATION =====
  {
    slug: "injury-prevention-workplace",
    title: "Workplace Injury Prevention",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Workplace Injury Prevention in OT — OT Encyclopedia",
    seoDescription: "Guide to OT role in workplace injury prevention, ergonomics, and wellness programs.",
    seoKeywords: ["injury prevention", "workplace wellness", "ergonomics", "body mechanics", "industrial OT"],
    overview: "Workplace injury prevention in OT encompasses proactive programs designed to reduce the incidence of work-related injuries. OTs conduct ergonomic assessments, design injury prevention programs, train workers in proper body mechanics, implement stretch-and-flex programs, and develop return-to-work protocols. Prevention is more cost-effective than treatment.",
    mechanismPhysiology: "Work-related injuries result from the interaction of physical risk factors (force, repetition, posture, vibration), individual factors (fitness, experience, technique), and psychosocial factors (job satisfaction, stress, perceived control). Prevention addresses all three domains.",
    clinicalRelevance: "OTs bring unique skills to injury prevention: activity analysis, ergonomic assessment, body mechanics training, and person-environment-occupation fit optimization. Industrial OT is a growing practice area with significant impact on worker health and employer costs.",
    signsSymptoms: "High injury rates, workers' compensation claims, absenteeism, worker complaints of pain or fatigue, and ergonomic risk factors identified in the workplace.",
    assessment: "Workplace ergonomic survey, job demands analysis, injury data analysis, worker health screening, and risk factor identification across the workplace.",
    management: "Ergonomic workstation design, body mechanics training, stretch-and-flex programs, job rotation schedules, tool and equipment modification, pre-employment screening, and wellness program development.",
    complications: "Resistance to change from workers and management, cost of implementing modifications, and difficulty sustaining behavioral changes over time.",
    clinicalPearls: [
      "Prevention programs have a positive ROI — every dollar spent on injury prevention saves $2-6 in treatment costs.",
      "Address psychosocial factors (job satisfaction, stress) alongside physical risk factors for maximum impact.",
      "Stretch-and-flex programs reduce injury rates when combined with ergonomic modifications."
    ],
    examPitfalls: [
      "Focusing only on physical risk factors without addressing psychosocial factors.",
      "Implementing prevention programs without baseline injury data for comparison.",
      "Recommending changes without worker input — buy-in is essential for compliance."
    ],
    faqJson: [
      { question: "What is the OT's role in workplace injury prevention?", answer: "OTs conduct ergonomic assessments, design injury prevention programs, train workers in body mechanics, implement wellness programs, and analyze workplace risk factors to reduce injury incidence." },
      { question: "What makes workplace injury prevention cost-effective?", answer: "Every dollar invested in injury prevention programs saves an estimated $2-6 in treatment, workers' compensation, and lost productivity costs." }
    ]
  },
  // ===== ADDITIONAL ETHICS & PROFESSIONAL PRACTICE =====
  {
    slug: "cultural-competence-ot",
    title: "Cultural Competence in OT",
    category: "Ethics & Professional Practice",
    seoTitle: "Cultural Competence in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to cultural competence and cultural humility in occupational therapy practice.",
    seoKeywords: ["cultural competence", "cultural humility", "diversity", "inclusive practice", "OT"],
    overview: "Cultural competence in OT is the ability to provide effective services to individuals from diverse cultural backgrounds by understanding how culture influences occupational choices, performance patterns, health beliefs, and therapeutic relationships. Moving beyond cultural competence, cultural humility emphasizes ongoing self-reflection, openness to learning, and recognition that cultural understanding is a lifelong process.",
    mechanismPhysiology: "Culture shapes how individuals perceive health, illness, disability, help-seeking, independence, and the value of specific occupations. Cultural factors influence assessment validity, goal-setting priorities, intervention acceptability, and therapeutic relationship quality.",
    clinicalRelevance: "OTs serve increasingly diverse populations. Cultural competence improves therapeutic rapport, assessment accuracy, intervention effectiveness, and health outcomes. It is both an ethical obligation and a practice competency.",
    signsSymptoms: "Cultural barriers may manifest as miscommunication, goal disagreements, poor adherence to recommendations, misinterpretation of behaviors, and therapeutic relationship difficulties.",
    assessment: "Cultural self-assessment, client cultural interview, exploration of health beliefs and practices, identification of cultural influences on occupational priorities, and assessment of interpreter needs.",
    management: "Cultural self-awareness development, use of culturally responsive assessment tools, collaborative goal-setting respecting cultural values, adapted intervention approaches, interpreter services, and community cultural resource engagement.",
    complications: "Stereotyping, ethnocentrism, power imbalances, and the assumption that cultural knowledge equals cultural competence (vs. the humility to continue learning).",
    clinicalPearls: [
      "Cultural humility is preferred over cultural competence — it emphasizes ongoing learning rather than mastery.",
      "Independence is a Western cultural value — many cultures prioritize interdependence and family care.",
      "Ask clients about their cultural preferences rather than making assumptions based on cultural background."
    ],
    examPitfalls: [
      "Assuming all members of a cultural group share the same values and practices.",
      "Not recognizing that assessment tools may have cultural bias.",
      "Imposing independence as a goal when the client's culture values interdependence."
    ],
    faqJson: [
      { question: "What is cultural competence in OT?", answer: "Cultural competence is the ability to provide effective services to diverse populations by understanding how culture influences occupational choices, health beliefs, and therapeutic relationships." },
      { question: "What is cultural humility?", answer: "Cultural humility is an ongoing process of self-reflection and openness to learning about clients' cultural backgrounds, recognizing that cultural understanding is never complete and always evolving." }
    ]
  },
  {
    slug: "interprofessional-collaboration",
    title: "Interprofessional Collaboration",
    category: "Ethics & Professional Practice",
    seoTitle: "Interprofessional Collaboration in OT — OT Encyclopedia",
    seoDescription: "Guide to interprofessional teamwork and collaboration in occupational therapy practice.",
    seoKeywords: ["interprofessional", "collaboration", "teamwork", "interdisciplinary", "multidisciplinary", "OT"],
    overview: "Interprofessional collaboration (IPC) in OT involves working effectively with other healthcare professionals to provide comprehensive, coordinated, client-centred care. OTs collaborate with physicians, nurses, physical therapists, speech-language pathologists, psychologists, social workers, and other team members. Understanding team models (multidisciplinary, interdisciplinary, transdisciplinary), role clarity, and effective communication is essential for quality care.",
    mechanismPhysiology: "Effective interprofessional teams improve client outcomes through coordinated care planning, shared decision-making, reduced duplication of services, and comprehensive problem-solving. The team approach leverages each profession's unique expertise for holistic care.",
    clinicalRelevance: "OTs must clearly articulate their unique contributions to the team: occupation-based assessment, activity analysis, environmental modification, adaptive equipment, and functional outcome focus. Role clarity prevents scope confusion and ensures OT's unique value is recognized.",
    signsSymptoms: "Team-based care challenges include role confusion, communication breakdowns, conflicting recommendations, and lack of understanding of each profession's scope.",
    assessment: "Assessment of team dynamics, identification of role overlap and gaps, communication patterns evaluation, and client care coordination review.",
    management: "Clear role articulation, regular team communication (rounds, case conferences), shared documentation, collaborative goal-setting, conflict resolution skills, and mutual respect for each profession's expertise.",
    complications: "Role confusion, hierarchical barriers, communication failures, and conflicting professional opinions affecting client care.",
    clinicalPearls: [
      "OT's unique contribution: occupation-based assessment, activity analysis, and the person-environment-occupation perspective.",
      "Interdisciplinary teams share goals and collaborate across disciplines; multidisciplinary teams work in parallel with separate goals.",
      "Effective communication requires using shared language and avoiding profession-specific jargon."
    ],
    examPitfalls: [
      "Confusing multidisciplinary (parallel work, separate goals) with interdisciplinary (collaborative, shared goals) with transdisciplinary (role release across disciplines).",
      "Not being able to articulate OT's unique contribution to the interprofessional team.",
      "Not recognizing the importance of role clarity in preventing scope confusion."
    ],
    faqJson: [
      { question: "What is the difference between multidisciplinary and interdisciplinary teams?", answer: "Multidisciplinary teams have professionals working in parallel with separate goals. Interdisciplinary teams share goals and actively collaborate across disciplines. Transdisciplinary teams involve role release where team members cross traditional discipline boundaries." },
      { question: "What is OT's unique contribution to the interprofessional team?", answer: "OTs bring expertise in occupation-based assessment, activity analysis, person-environment-occupation fit, adaptive equipment, and the focus on enabling meaningful participation in daily life activities." }
    ]
  },
  // ===== ADDITIONAL VISUAL-PERCEPTUAL SKILLS =====
  {
    slug: "oculomotor-dysfunction",
    title: "Oculomotor Dysfunction in OT",
    category: "Visual-Perceptual Skills",
    seoTitle: "Oculomotor Dysfunction in OT — OT Encyclopedia",
    seoDescription: "Guide to oculomotor assessment and intervention for visual efficiency in occupational therapy.",
    seoKeywords: ["oculomotor", "visual tracking", "saccades", "convergence", "eye movement", "OT"],
    overview: "Oculomotor dysfunction refers to impairments in eye movement control that affect visual efficiency for daily tasks. OTs assess and address three primary oculomotor functions: pursuits (smooth tracking), saccades (rapid eye movements between targets), and convergence (eye teaming for near vision). Dysfunction affects reading, writing, driving, sports, and other visually demanding activities.",
    mechanismPhysiology: "Oculomotor control involves coordinated action of the six extraocular muscles per eye, controlled by cranial nerves III (oculomotor), IV (trochlear), and VI (abducens). Cortical and brainstem centers coordinate pursuit, saccadic, and vergence systems for efficient visual function.",
    clinicalRelevance: "OTs assess oculomotor function as part of comprehensive visual-perceptual evaluation, particularly after stroke, TBI, and in pediatric populations. Oculomotor dysfunction may contribute to reading difficulties, headaches, fatigue, and decreased functional performance.",
    signsSymptoms: "Losing place while reading, difficulty tracking moving objects, headaches with visual tasks, eye fatigue, double vision with near work, skipping lines while reading, and difficulty with visual scanning.",
    assessment: "Pursuit assessment (smooth eye tracking of a moving target), saccade assessment (rapid alternating fixation between targets), convergence testing (near point of convergence), and clinical observation of eye movements during functional tasks.",
    management: "Oculomotor exercises (pencil pushups for convergence, tracking activities for pursuits, visual scanning worksheets for saccades), environmental modifications (enlarged text, reduced visual clutter, task lighting), and accommodation strategies for reading and visual tasks.",
    complications: "Untreated oculomotor dysfunction can contribute to academic difficulties, reduced work performance, driving difficulties, and chronic visual fatigue.",
    clinicalPearls: [
      "Convergence insufficiency is the most common oculomotor disorder — near point of convergence >10 cm is abnormal.",
      "Saccadic dysfunction significantly impacts reading — the eyes make saccadic jumps from word to word while reading.",
      "Always refer to optometry/ophthalmology for comprehensive visual assessment if oculomotor problems are identified."
    ],
    examPitfalls: [
      "Confusing oculomotor dysfunction (eye movement control) with visual acuity (seeing clearly).",
      "Not assessing oculomotor function as part of visual-perceptual evaluation.",
      "Treating visual perception deficits without first assessing oculomotor function — eye movement problems can mimic perception deficits."
    ],
    faqJson: [
      { question: "What is oculomotor dysfunction?", answer: "Oculomotor dysfunction involves impaired control of eye movements (tracking, scanning, eye teaming) that affects visual efficiency for daily tasks like reading, writing, and driving." },
      { question: "How does OT address oculomotor problems?", answer: "OTs provide oculomotor exercises, environmental modifications, and visual strategies, and refer to optometry for comprehensive visual assessment and management." }
    ]
  },
  // ===== ADDITIONAL SENSORY INTEGRATION =====
  {
    slug: "interoception",
    title: "Interoception in OT",
    category: "Sensory Integration",
    seoTitle: "Interoception in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to interoceptive awareness assessment and intervention in occupational therapy.",
    seoKeywords: ["interoception", "body signals", "internal awareness", "self-regulation", "sensory system", "OT"],
    overview: "Interoception is the sensory system responsible for detecting internal body signals such as hunger, thirst, temperature, pain, heart rate, and the need to use the bathroom. In OT, interoceptive awareness is increasingly recognized as foundational for self-regulation, emotional awareness, and body-based self-care skills. Difficulties with interoception affect toileting, eating regulation, temperature regulation, emotional identification, and pain perception.",
    mechanismPhysiology: "Interoceptors are located throughout internal organs, muscles, skin, and bones, detecting physiological conditions (stretch, temperature, chemical changes). The insular cortex processes interoceptive information, contributing to conscious awareness of body states and emotional experience. Interoception provides the 'raw data' that underlies emotional awareness.",
    clinicalRelevance: "Interoceptive awareness difficulties are common in autism, sensory processing disorder, eating disorders, anxiety, and trauma. OTs address interoception to support toileting readiness, hunger/satiety awareness, emotional regulation, and pain reporting.",
    signsSymptoms: "Difficulty recognizing hunger or fullness, toileting accidents, not recognizing temperature extremes, difficulty identifying emotions, poor pain reporting, and challenges with self-regulation.",
    assessment: "Interoception assessment questionnaires, body awareness activities, identification of internal body signals during activities, and functional assessment of body-signal-dependent tasks (toileting, eating, temperature regulation).",
    management: "Body awareness activities (mindful body scanning, yoga, breathing exercises), interoception curriculum programs, pairing body sensations with labels (vocabulary building), graded exposure to body signal awareness, and caregiver education.",
    complications: "Limited research base compared to other sensory systems, difficulty assessing interoception objectively, and the complexity of separating interoceptive from cognitive and emotional factors.",
    clinicalPearls: [
      "Interoception is the 'eighth sensory system' — foundational for self-regulation and emotional awareness.",
      "Teach body signal vocabulary: 'My stomach feels empty = hungry,' 'My muscles feel tight = tense.'",
      "Interoceptive awareness activities should be embedded in daily routines, not just therapy sessions."
    ],
    examPitfalls: [
      "Not recognizing interoception as a sensory system relevant to OT practice.",
      "Treating self-regulation difficulties without assessing interoceptive awareness.",
      "Confusing interoception (internal body awareness) with proprioception (body position in space)."
    ],
    faqJson: [
      { question: "What is interoception?", answer: "Interoception is the sensory system that detects internal body signals (hunger, thirst, temperature, pain, heart rate), providing awareness of physiological states that underlies self-regulation and emotional awareness." },
      { question: "Why is interoception important for OT?", answer: "Interoceptive awareness affects toileting readiness, eating regulation, temperature management, emotional identification, and pain reporting — all areas within the OT scope of practice." }
    ]
  },
  // ===== ADDITIONAL FUNCTIONAL ASSESSMENT =====
  {
    slug: "executive-function-performance-test",
    title: "Executive Function Performance Test (EFPT)",
    category: "Functional Assessment",
    seoTitle: "Executive Function Performance Test in OT — OT Encyclopedia",
    seoDescription: "Guide to the EFPT assessment for evaluating executive function during daily tasks in OT.",
    seoKeywords: ["EFPT", "executive function", "cognitive assessment", "functional cognition", "OT assessment"],
    overview: "The Executive Function Performance Test (EFPT) is a standardized, performance-based assessment that evaluates executive function through observation of four real-world tasks: cooking oatmeal, making a phone call, managing medications, and paying bills. Developed by Baum et al. at Washington University, it measures initiation, organization, sequencing, safety/judgment, and task completion during actual task performance.",
    mechanismPhysiology: "Executive functions — initiation, planning, organization, sequencing, self-monitoring, and error correction — are mediated primarily by the prefrontal cortex. The EFPT directly measures these capacities during functional tasks rather than through abstract cognitive tests, providing ecologically valid assessment data.",
    clinicalRelevance: "The EFPT bridges the gap between cognitive screening (which may not predict functional performance) and functional observation (which may lack standardization). It provides quantifiable data about executive function in context, guiding intervention planning and discharge decisions.",
    signsSymptoms: "Difficulty initiating tasks, sequencing errors during multi-step activities, safety concerns during daily tasks, poor problem-solving when errors occur, and difficulty managing medications or finances.",
    assessment: "The examiner provides standardized cues (ranging from verbal guidance to physical assistance) as needed during each task. Scoring reflects the level of cueing required: 0 (independent), 1 (verbal guidance), 2 (gestural guidance), 3 (direct verbal instruction), 4 (physical assistance), 5 (do for the person). Total scores indicate level of executive function impairment.",
    management: "EFPT results guide intervention planning by identifying which executive function components (initiation, organization, sequencing, safety, completion) are most impaired, enabling targeted cognitive rehabilitation and compensatory strategy training.",
    complications: "Administration requires real task materials and environment. Some tasks may need cultural adaptation. Time-intensive compared to paper-based cognitive screens.",
    clinicalPearls: [
      "The EFPT measures executive function during REAL tasks — more ecologically valid than paper-based tests.",
      "The cueing hierarchy provides both the assessment score and a model for intervention (graduated prompting).",
      "Ideal for stroke, TBI, and dementia populations where functional cognition assessment is needed."
    ],
    examPitfalls: [
      "Not knowing the four EFPT tasks: cooking, phone use, medication management, bill paying.",
      "Confusing the EFPT (performance-based) with paper-based executive function tests (Trail Making, WCST).",
      "Not recognizing the cueing hierarchy as both an assessment tool and an intervention framework."
    ],
    faqJson: [
      { question: "What does the EFPT assess?", answer: "The EFPT assesses executive function (initiation, organization, sequencing, safety, completion) during four real-world tasks: cooking, phone use, medication management, and bill paying." },
      { question: "Why is the EFPT better than paper-based cognitive tests?", answer: "The EFPT measures executive function during actual task performance, providing ecologically valid data that better predicts real-world functional capacity than abstract cognitive tests." }
    ]
  },
  // ===== ADDITIONAL NEUROLOGICAL REHABILITATION =====
  {
    slug: "spasticity-management-ot",
    title: "Spasticity Management in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Spasticity Management in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to spasticity assessment and management techniques in occupational therapy.",
    seoKeywords: ["spasticity", "tone management", "Modified Ashworth", "positioning", "splinting", "OT"],
    overview: "Spasticity management in OT addresses the velocity-dependent increase in muscle tone that occurs after upper motor neuron lesions (stroke, SCI, TBI, MS, CP). OTs manage the functional impact of spasticity through positioning, splinting, stretching, functional activities, and collaboration with physicians for medical management (botulinum toxin, baclofen). The goal is to optimize functional use rather than eliminate all tone.",
    mechanismPhysiology: "Spasticity results from loss of descending inhibitory control over spinal motor neurons after upper motor neuron damage. It is velocity-dependent (increases with faster movement), differs from rigidity (velocity-independent), and may be accompanied by clonus, hyperreflexia, and associated reactions.",
    clinicalRelevance: "OTs manage the functional impact of spasticity on daily activities — difficulty with dressing, positioning, hygiene, transfers, and hand function. The OT focus is on maximizing function within the context of the person's tone pattern, not eliminating tone entirely.",
    signsSymptoms: "Increased resistance to passive movement (velocity-dependent), abnormal posturing, clonus, hyperreflexia, difficulty with voluntary movement against spastic muscles, and functional limitations in self-care, mobility, and positioning.",
    assessment: "Modified Ashworth Scale (MAS, 0-4 grading), Tardieu Scale, functional impact assessment, ROM measurement, positioning evaluation, and identification of triggers that increase tone.",
    management: "Positioning programs (anti-spasticity positioning to maintain muscle length), serial casting or splinting, weight-bearing activities, slow sustained stretching, functional task practice, environmental modification, and coordination with medical spasticity management (botulinum toxin, intrathecal baclofen).",
    complications: "Contracture from untreated spasticity, pain, skin breakdown from sustained posturing, hygiene difficulties in flexor-dominant patterns, and functional limitation.",
    clinicalPearls: [
      "Some spasticity is functional — extensor tone in the leg supports standing. Don't eliminate all tone without considering functional implications.",
      "Identify and eliminate spasticity triggers: pain, bladder distension, pressure sores, anxiety, cold temperature.",
      "Post-botulinum toxin injection is an optimal window for intensive OT — muscle is relaxed for 3-6 months."
    ],
    examPitfalls: [
      "Confusing spasticity (velocity-dependent, UMN) with rigidity (velocity-independent, basal ganglia).",
      "Not knowing the Modified Ashworth Scale grading system.",
      "Attempting to eliminate all spasticity without considering its functional benefits."
    ],
    faqJson: [
      { question: "What is spasticity?", answer: "Spasticity is a velocity-dependent increase in muscle tone caused by upper motor neuron damage, resulting in resistance to passive movement, abnormal posturing, and functional limitations." },
      { question: "How does OT manage spasticity?", answer: "OTs manage spasticity through positioning, splinting, stretching, functional activities, trigger elimination, and coordination with medical management (botulinum toxin, baclofen) to maximize function." }
    ]
  },
  // ===== ADDITIONAL MENTAL HEALTH =====
  {
    slug: "occupational-deprivation",
    title: "Occupational Deprivation",
    category: "Mental Health OT",
    seoTitle: "Occupational Deprivation in OT — OT Encyclopedia",
    seoDescription: "Guide to understanding and addressing occupational deprivation in occupational therapy.",
    seoKeywords: ["occupational deprivation", "occupational justice", "participation barriers", "inclusion", "OT"],
    overview: "Occupational deprivation is a state in which a person is unable to engage in meaningful occupations due to external factors beyond their control — such as imprisonment, institutionalization, geographic isolation, poverty, disability discrimination, or social marginalization. This concept from occupational science highlights the relationship between occupation, health, and social justice, and is central to occupational therapy's commitment to enabling participation.",
    mechanismPhysiology: "Occupational deprivation occurs when external barriers (not personal choice) prevent occupational engagement. This differs from occupational alienation (performing occupations that lack personal meaning) and occupational imbalance (disproportionate time in one occupation). Prolonged occupational deprivation leads to decreased well-being, depression, cognitive decline, and loss of identity.",
    clinicalRelevance: "OTs have an ethical responsibility to recognize and address occupational deprivation, advocating for clients' right to participate in meaningful occupations. This includes challenging institutional policies, environmental barriers, and social systems that prevent participation.",
    signsSymptoms: "Loss of meaning and purpose, depression, decreased motivation, loss of skills, identity disruption, and social isolation resulting from inability to engage in desired occupations.",
    assessment: "Occupational history and narrative, identification of barriers to participation, assessment of occupational balance, and evaluation of environmental and systemic barriers.",
    management: "Advocacy for access to meaningful occupations, environmental modification, community integration programs, policy change initiatives, skill development for new accessible occupations, and collaboration with community organizations.",
    complications: "Systemic nature of occupational deprivation may limit individual-level intervention effectiveness. Long-term deprivation may require extensive re-engagement support.",
    clinicalPearls: [
      "Occupational deprivation is caused by EXTERNAL factors — distinguish from occupational alienation (meaninglessness) and personal choice.",
      "OTs have an ethical obligation to address occupational justice, not just individual client needs.",
      "Occupational deprivation is common in prisons, institutions, refugee camps, and among people experiencing homelessness."
    ],
    examPitfalls: [
      "Confusing occupational deprivation (external barriers) with occupational alienation (lack of meaning).",
      "Not recognizing occupational deprivation as an OT concern beyond individual client care.",
      "Focusing only on individual-level intervention without addressing systemic barriers."
    ],
    faqJson: [
      { question: "What is occupational deprivation?", answer: "Occupational deprivation is the inability to engage in meaningful occupations due to external factors beyond one's control, such as institutionalization, poverty, or discrimination." },
      { question: "How does OT address occupational deprivation?", answer: "OTs advocate for access to meaningful occupations, modify environments, develop community programs, challenge systemic barriers, and support individuals in finding accessible occupational alternatives." }
    ]
  },
  // ===== ADDITIONAL ADAPTIVE EQUIPMENT =====
  {
    slug: "computer-access-adaptations",
    title: "Computer Access Adaptations",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Computer Access Adaptations in OT — OT Encyclopedia",
    seoDescription: "Guide to computer access assessment and adaptations for individuals with disabilities in OT.",
    seoKeywords: ["computer access", "keyboard adaptation", "mouse alternative", "switch access", "voice recognition", "OT"],
    overview: "Computer access adaptations in OT address the needs of individuals with physical, sensory, or cognitive disabilities who require modified input methods to use computers and digital devices. OTs assess functional abilities, recommend appropriate access methods, configure accessibility settings, and train clients in adapted computer use. Computer access is essential for education, employment, communication, and community participation.",
    mechanismPhysiology: "Standard computer input (keyboard and mouse) requires fine motor dexterity, sustained upper extremity positioning, visual tracking, and cognitive processing. When any of these abilities are impaired, alternative access methods are needed, ranging from simple adaptations to complex specialized systems.",
    clinicalRelevance: "Computer access is increasingly essential for daily life, education, and employment. OTs ensure equitable access by matching technology solutions to individual abilities, from simple keyboard modifications to eye-gaze systems.",
    signsSymptoms: "Difficulty using standard keyboard or mouse, inability to type accurately, fatigue with computer use, limited reach to keyboard/mouse, and inability to visually track on screen.",
    assessment: "Upper extremity function assessment, fine motor evaluation, visual tracking and perception, cognitive assessment, endurance evaluation, and identification of the most reliable and efficient input method.",
    management: "Low-tech: keyboard guard, enlarged keys, one-handed keyboard layout, trackball mouse, joystick mouse. Mid-tech: voice recognition (Dragon), on-screen keyboard, word prediction software, switch scanning. High-tech: head mouse, eye-gaze tracking, sip-and-puff switches. Software: built-in accessibility features (sticky keys, filter keys, magnification, screen readers).",
    complications: "Technology learning curve, equipment cost, rapid technology obsolescence, and difficulty with voice recognition in noisy environments.",
    clinicalPearls: [
      "Start with built-in accessibility features (every OS has them) before recommending specialized equipment.",
      "Voice recognition has dramatically improved — it is now the most common alternative access method for many users.",
      "Match the access method to the person's most reliable and efficient movement pattern."
    ],
    examPitfalls: [
      "Not knowing the range of computer access options from low-tech to high-tech.",
      "Recommending complex technology when simple adaptations (built-in accessibility) would suffice.",
      "Not assessing the person's most reliable movement for input method selection."
    ],
    faqJson: [
      { question: "What computer access options are available?", answer: "Options range from low-tech (keyboard guards, trackball mice) through mid-tech (voice recognition, on-screen keyboards) to high-tech (eye-gaze systems, head mice, switch scanning), plus built-in OS accessibility features." },
      { question: "How does OT help with computer access?", answer: "OTs assess functional abilities, match appropriate access methods to individual needs, configure accessibility settings, provide training, and ensure equitable access to digital technology." }
    ]
  },
  // ===== ADDITIONAL FUNCTIONAL ASSESSMENT =====
  {
    slug: "quality-of-life-measures",
    title: "Quality of Life Measures in OT",
    category: "Functional Assessment",
    seoTitle: "Quality of Life Measures in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to quality of life assessment tools and their application in occupational therapy.",
    seoKeywords: ["quality of life", "QOL", "SF-36", "WHOQOL", "outcome measures", "OT"],
    overview: "Quality of life (QOL) measures in OT capture the client's subjective perception of well-being, health, and life satisfaction, complementing objective functional assessments. OTs use QOL measures to understand the impact of disability on life satisfaction, set meaningful goals, and demonstrate the broader impact of OT intervention beyond functional independence.",
    mechanismPhysiology: "Quality of life is a multidimensional construct encompassing physical health, psychological well-being, social relationships, and environmental factors. QOL measures capture subjective experience, which may differ significantly from objective functional status — a person can have significant disability yet report high quality of life, and vice versa.",
    clinicalRelevance: "QOL measures demonstrate that OT impacts not just functional independence but also overall life satisfaction and well-being. They capture outcomes that functional measures may miss, such as social participation, role fulfillment, and psychological adjustment.",
    signsSymptoms: "QOL assessment is appropriate for any client population where understanding subjective well-being and life satisfaction is important for holistic care planning.",
    assessment: "SF-36 (Short Form 36 — generic health-related QOL), WHOQOL-BREF (WHO Quality of Life), EQ-5D (5 dimensions of health), COPM (satisfaction ratings), and condition-specific QOL measures (e.g., Stroke Impact Scale).",
    management: "Use QOL data to identify areas of greatest concern to the client, set goals that address life satisfaction and participation, and measure the impact of OT intervention on overall well-being.",
    complications: "QOL is subjective and may fluctuate. Cultural factors influence QOL perception. Response shift (changing internal standards over time) may affect longitudinal comparison.",
    clinicalPearls: [
      "QOL scores often do not correlate directly with functional status — always assess both.",
      "The COPM satisfaction scale is a simple, OT-specific quality of life indicator.",
      "QOL measures help justify OT services by demonstrating impact on overall well-being, not just physical function."
    ],
    examPitfalls: [
      "Assuming functional improvement automatically means improved quality of life — assess both.",
      "Not knowing common QOL measures (SF-36, WHOQOL).",
      "Ignoring client-perceived quality of life in goal-setting."
    ],
    faqJson: [
      { question: "Why are quality of life measures important in OT?", answer: "QOL measures capture the client's subjective well-being, which may differ from objective functional status. They ensure goals address what matters most to the client and demonstrate OT's broader impact." },
      { question: "What is the SF-36?", answer: "The SF-36 (Short Form 36) is a widely used generic health-related quality of life measure covering eight domains: physical functioning, role limitations, pain, general health, vitality, social functioning, emotional role, and mental health." }
    ]
  },
  // ===== ADDITIONAL NEUROLOGICAL =====
  {
    slug: "cognitive-perceptual-rehab-stroke",
    title: "Cognitive-Perceptual Rehabilitation After Stroke",
    category: "Neurological Rehabilitation",
    seoTitle: "Cognitive-Perceptual Rehabilitation After Stroke — OT Encyclopedia",
    seoDescription: "Guide to cognitive-perceptual rehabilitation approaches in OT after stroke.",
    seoKeywords: ["cognitive rehabilitation", "perceptual rehabilitation", "stroke recovery", "attention training", "OT"],
    overview: "Cognitive-perceptual rehabilitation after stroke addresses deficits in attention, memory, executive function, visual perception, and awareness that impact daily function. OTs use remedial (restorative), compensatory (adaptive), and functional (occupation-based) approaches to improve cognitive-perceptual performance and enable participation in daily activities.",
    mechanismPhysiology: "Stroke causes focal brain damage resulting in specific cognitive-perceptual deficits based on the affected vascular territory. Left hemisphere strokes typically cause language and praxis deficits; right hemisphere strokes typically cause visual-perceptual, attention, and spatial deficits. Neuroplasticity supports some recovery, particularly in the first 3-6 months.",
    clinicalRelevance: "Cognitive-perceptual deficits are among the strongest predictors of functional outcomes and discharge destination after stroke. OTs are uniquely qualified to assess and treat these deficits within the context of functional activities, bridging the gap between isolated cognitive performance and real-world function.",
    signsSymptoms: "Attention deficits, memory impairment, executive dysfunction, visual-perceptual deficits (neglect, hemianopsia, spatial relations), apraxia, and decreased safety awareness.",
    assessment: "MoCA, LOTCA, EFPT, neglect assessments, visual-perceptual tests (MVPT, TVPS), functional cognitive observation during ADLs, and standardized attention and memory measures.",
    management: "Remedial approaches: attention training, visual scanning programs, memory exercises. Compensatory approaches: external memory aids, visual cues, environmental modification, task simplification. Functional approaches: practicing cognitive-perceptual skills within actual daily activities, transfer training, and caregiver education.",
    complications: "Anosognosia (lack of awareness of deficits), limited generalization from isolated cognitive exercises to functional activities, and progressive cognitive decline in some patients.",
    clinicalPearls: [
      "Functional (occupation-based) approaches have the strongest evidence for improving daily function after stroke.",
      "Anosognosia (lack of deficit awareness) is common with right hemisphere stroke and complicates rehabilitation.",
      "Address attention first — attention is foundational for all other cognitive-perceptual processes."
    ],
    examPitfalls: [
      "Not differentiating between remedial (restoring function), compensatory (bypassing deficits), and functional (occupation-based) approaches.",
      "Relying solely on cognitive drill exercises without connecting to functional activities.",
      "Ignoring the interaction between cognitive, perceptual, and motor deficits."
    ],
    faqJson: [
      { question: "What cognitive-perceptual deficits occur after stroke?", answer: "Common deficits include attention impairment, memory problems, executive dysfunction, visual-perceptual deficits (neglect, hemianopsia), apraxia, and decreased safety awareness." },
      { question: "What approach has the strongest evidence?", answer: "Functional (occupation-based) approaches — practicing cognitive-perceptual skills within real daily activities — have the strongest evidence for improving functional outcomes after stroke." }
    ]
  },
  // ===== ADDITIONAL OT MODELS AND FRAMEWORKS =====
  {
    slug: "person-environment-occupation-model",
    title: "Person-Environment-Occupation (PEO) Model",
    category: "Ethics & Professional Practice",
    seoTitle: "PEO Model in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to the Person-Environment-Occupation model and its clinical application in OT.",
    seoKeywords: ["PEO model", "person-environment-occupation", "OT theory", "occupational performance", "OT framework"],
    overview: "The Person-Environment-Occupation (PEO) model is a transactional framework that conceptualizes occupational performance as the result of the dynamic interaction between three components: the person (physical, cognitive, emotional, spiritual), the environment (physical, social, cultural, institutional), and the occupation (self-care, productivity, leisure). Maximum occupational performance occurs when there is optimal fit among all three components.",
    mechanismPhysiology: "The PEO model uses three overlapping circles (Venn diagram) to illustrate that occupational performance is the area of overlap among person, environment, and occupation. When any component changes (e.g., injury reduces person capacity, or environment becomes more accessible), the degree of overlap changes, affecting occupational performance.",
    clinicalRelevance: "PEO guides OT assessment and intervention by directing attention to all three components rather than focusing solely on the person. It supports the OT principle that changing the environment or modifying the occupation can be as effective as improving the person's capacity.",
    signsSymptoms: "PEO analysis is appropriate whenever occupational performance is compromised, regardless of the specific condition or setting.",
    assessment: "Assess person factors (abilities, limitations, motivation), environmental factors (physical accessibility, social support, institutional policies), and occupation factors (task demands, meaningfulness, complexity) to identify where the 'fit' breaks down.",
    management: "Intervention can target any component: person (skill training, rehabilitation), environment (modification, adaptive equipment, social support), or occupation (task modification, grading, alternative activities). Often, the most effective interventions address the environment or task rather than trying to 'fix' the person.",
    complications: "Over-simplification of complex interactions. The model describes what to consider but provides less guidance on specific intervention techniques.",
    clinicalPearls: [
      "When person factors cannot be changed (progressive disease), focus on environment and occupation modifications.",
      "PEO reminds OTs that we don't just treat the person — we can modify the environment or the task.",
      "The degree of 'fit' between P, E, and O determines the quality of occupational performance."
    ],
    examPitfalls: [
      "Not knowing the three components: Person, Environment, Occupation.",
      "Confusing PEO with PEOP (Person-Environment-Occupation-Performance, a related but different model).",
      "Focusing only on person factors without analyzing environmental and occupational contributors to dysfunction."
    ],
    faqJson: [
      { question: "What is the PEO model?", answer: "The PEO model conceptualizes occupational performance as the overlap between person (abilities), environment (context), and occupation (task demands). Maximum performance occurs when all three fit well together." },
      { question: "How does PEO guide OT intervention?", answer: "PEO directs therapists to consider interventions targeting any of the three components — improving person skills, modifying the environment, or adapting the task — rather than focusing solely on the person." }
    ]
  },
  {
    slug: "occupational-adaptation-model",
    title: "Occupational Adaptation Model",
    category: "Ethics & Professional Practice",
    seoTitle: "Occupational Adaptation Model in OT — OT Encyclopedia",
    seoDescription: "Guide to the Occupational Adaptation model and its application in occupational therapy.",
    seoKeywords: ["occupational adaptation", "OA model", "adaptation", "mastery", "OT theory"],
    overview: "The Occupational Adaptation (OA) model, developed by Schkade and Schultz, describes how individuals develop the capacity to generate adaptive responses to occupational challenges. The model focuses on the internal process of adaptation rather than specific skill acquisition, emphasizing the development of the person's adaptive capacity — the ability to respond effectively to novel occupational demands.",
    mechanismPhysiology: "OA describes the interaction between the person's desire for mastery (internal drive) and the environment's demand for mastery (external expectations). When these interact during occupational engagement, the person generates an adaptive response. Effective adaptation leads to relative mastery — the person's experience of efficiency, effectiveness, and satisfaction with their occupational response.",
    clinicalRelevance: "The OA model shifts the OT's role from teaching specific skills to facilitating the client's own adaptive process. This promotes independence, problem-solving, and generalization — the client develops the capacity to adapt to new challenges rather than relying on therapist-taught solutions.",
    signsSymptoms: "Difficulty adapting to occupational challenges, rigid response patterns, inability to generate new solutions, and poor carryover of learned skills to new situations.",
    assessment: "Assess the client's adaptive capacity (ability to generate varied responses), relative mastery (self-rated efficiency, effectiveness, satisfaction), and the press for mastery from the environment.",
    management: "Create occupational challenges that require adaptive responses, facilitate the client's problem-solving process rather than providing solutions, promote self-evaluation of response effectiveness (relative mastery), and grade challenges to develop increasingly sophisticated adaptive capacity.",
    complications: "The model is abstract and may be difficult for entry-level therapists to implement. Minimal standardized assessment tools are available.",
    clinicalPearls: [
      "Focus on the PROCESS of adaptation rather than specific skill outcomes.",
      "Relative mastery (the client's self-evaluation) is the primary outcome measure.",
      "The therapist's role is to facilitate, not direct — the client generates their own adaptive responses."
    ],
    examPitfalls: [
      "Confusing Occupational Adaptation (internal adaptive process) with the concept of activity adaptation (modifying tasks).",
      "Not knowing the concept of relative mastery as the outcome measure.",
      "Applying a directive teaching approach when the OA model requires facilitation of the client's own problem-solving."
    ],
    faqJson: [
      { question: "What is the Occupational Adaptation model?", answer: "The OA model describes how individuals develop adaptive capacity — the ability to generate effective responses to occupational challenges — through the interaction of internal desire for mastery and external demand for mastery." },
      { question: "What is relative mastery?", answer: "Relative mastery is the person's self-evaluation of their occupational response in terms of efficiency, effectiveness, and satisfaction — it is the primary outcome measure in the OA model." }
    ]
  }
];

async function seedBatch2() {
  console.log(`Seeding batch 2: ${entries.length} additional OT encyclopedia entries...`);

  let inserted = 0;
  let errors: string[] = [];

  for (const entry of entries) {
    try {
      const topicResult = await pool.query(
        `INSERT INTO encyclopedia_topics (profession, slug, title, category, status)
         VALUES ($1, $2, $3, $4, 'published')
         ON CONFLICT (profession, slug) DO UPDATE SET title = $3, category = $4, updated_at = NOW()
         RETURNING id`,
        [PROFESSION, entry.slug, entry.title, entry.category]
      );
      const topicId = topicResult.rows[0].id;

      await pool.query(
        `INSERT INTO encyclopedia_entries (topic_id, profession, slug, title, category,
          seo_title, seo_description, seo_keywords, overview, mechanism_physiology,
          clinical_relevance, signs_symptoms, assessment, management, complications,
          clinical_pearls, exam_pitfalls, faq_json, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'published', NOW())
         ON CONFLICT (profession, slug) DO UPDATE SET
          title = EXCLUDED.title, category = EXCLUDED.category,
          seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
          seo_keywords = EXCLUDED.seo_keywords, overview = EXCLUDED.overview,
          mechanism_physiology = EXCLUDED.mechanism_physiology,
          clinical_relevance = EXCLUDED.clinical_relevance,
          signs_symptoms = EXCLUDED.signs_symptoms, assessment = EXCLUDED.assessment,
          management = EXCLUDED.management, complications = EXCLUDED.complications,
          clinical_pearls = EXCLUDED.clinical_pearls, exam_pitfalls = EXCLUDED.exam_pitfalls,
          faq_json = EXCLUDED.faq_json, status = 'published',
          published_at = COALESCE(encyclopedia_entries.published_at, NOW()),
          updated_at = NOW()`,
        [topicId, PROFESSION, entry.slug, entry.title, entry.category,
          entry.seoTitle, entry.seoDescription, entry.seoKeywords,
          entry.overview, entry.mechanismPhysiology,
          entry.clinicalRelevance, entry.signsSymptoms,
          entry.assessment, entry.management, entry.complications,
          JSON.stringify(entry.clinicalPearls), JSON.stringify(entry.examPitfalls),
          JSON.stringify(entry.faqJson)]
      );
      inserted++;
    } catch (err: any) {
      errors.push(`Error for "${entry.slug}": ${err.message}`);
    }
  }

  console.log(`\nBatch 2 done! Inserted: ${inserted}, Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log("Errors:", errors);
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int as total, COUNT(DISTINCT category)::int as categories FROM encyclopedia_entries WHERE profession = $1 AND status = 'published'`,
    [PROFESSION]
  );
  console.log(`Total published OT entries: ${countResult.rows[0].total}, Categories: ${countResult.rows[0].categories}`);
}

seedBatch2().then(() => {
  console.log("Batch 2 seed complete.");
  process.exit(0);
}).catch(err => {
  console.error("Batch 2 seed failed:", err);
  process.exit(1);
});
