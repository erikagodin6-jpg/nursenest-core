import type { OSCEStep, OSCESkillStation } from "./osce-skills-data";

export const osceSkillStations2: OSCESkillStation[] = [
  {
    id: "jp-drain-care",
    title: "JP Drain Care",
    category: "Drain & Tube Care",
    difficulty: "Intermediate",
    icon: "Droplets",
    description:
      "Emptying, measuring, and documenting Jackson-Pratt drain output to promote wound healing and prevent complications.",
    scenarioIntro:
      "You are caring for a 58-year-old patient who is post-operative day 1 following a modified radical mastectomy. The patient has a Jackson-Pratt (JP) drain in place at the surgical site. The bulb appears fully expanded and it is time to empty, measure, and document the drainage. The patient rates pain at 4/10 and is alert and oriented.",
    equipment: [
      "Clean gloves",
      "Graduated measuring container",
      "Antiseptic swab (alcohol or chlorhexidine)",
      "Personal protective equipment as indicated",
      "Documentation form or electronic health record access",
      "Disposal bag for drainage"
    ],
    steps: [
      {
        id: "jp-1",
        instruction: "Perform hand hygiene using soap and water or alcohol-based hand rub.",
        rationale: "Reduces transmission of microorganisms and is the single most effective infection prevention measure.",
        criticalStep: true
      },
      {
        id: "jp-2",
        instruction: "Verify the patient's identity using two identifiers.",
        rationale: "Ensures the correct patient receives the correct intervention as per patient safety standards.",
        criticalStep: true
      },
      {
        id: "jp-3",
        instruction: "Explain the procedure to the patient and obtain verbal consent.",
        rationale: "Reduces patient anxiety and promotes cooperation; informed consent is a patient right.",
        criticalStep: false
      },
      {
        id: "jp-4",
        instruction: "Position the patient comfortably and expose the drain site while maintaining privacy.",
        rationale: "Proper positioning allows access to the drain and maintains patient dignity.",
        criticalStep: false
      },
      {
        id: "jp-5",
        instruction: "Apply clean gloves.",
        rationale: "Provides a barrier against exposure to body fluids during the procedure.",
        criticalStep: true
      },
      {
        id: "jp-6",
        instruction: "Inspect the drain insertion site for signs of infection, skin irritation, or drain displacement.",
        rationale: "Early identification of complications such as infection, dehiscence, or drain migration allows prompt intervention.",
        criticalStep: false
      },
      {
        id: "jp-7",
        instruction: "Inspect the tubing for kinks, clots, or obstructions along its entire length.",
        rationale: "Kinks or blockages can impede drainage and increase the risk of fluid accumulation or infection at the surgical site.",
        criticalStep: false
      },
      {
        id: "jp-8",
        instruction: "Open the drainage port on the bulb without contaminating the port opening.",
        rationale: "Maintaining asepsis of the port opening prevents introduction of microorganisms into the closed drainage system.",
        criticalStep: true
      },
      {
        id: "jp-9",
        instruction: "Invert the bulb and gently squeeze to empty all contents into the graduated measuring container.",
        rationale: "Inverting ensures complete emptying; gentle pressure prevents back-flow of drainage into the wound.",
        criticalStep: false
      },
      {
        id: "jp-10",
        instruction: "Cleanse the drainage port with an antiseptic swab.",
        rationale: "Reduces microbial contamination at the port, decreasing infection risk.",
        criticalStep: false
      },
      {
        id: "jp-11",
        instruction: "Compress the bulb fully to re-establish negative-pressure suction, then close the port while the bulb is compressed.",
        rationale: "Negative pressure (suction) is the mechanism by which the JP drain removes fluid from the surgical site; an uncompressed bulb provides no suction.",
        criticalStep: true
      },
      {
        id: "jp-12",
        instruction: "Verify the bulb remains compressed after closing the port to confirm suction is active.",
        rationale: "An expanding bulb after closure indicates a leak or improper seal, which would negate the drain's therapeutic function.",
        criticalStep: false
      },
      {
        id: "jp-13",
        instruction: "Measure and note the volume, color, consistency, and odor of the drainage in the graduated container.",
        rationale: "Accurate measurement and characterization of drainage are essential for monitoring healing, detecting hemorrhage, and identifying infection.",
        criticalStep: true
      },
      {
        id: "jp-14",
        instruction: "Dispose of the drainage into the appropriate waste receptacle and discard the measuring container or clean it per facility policy.",
        rationale: "Proper disposal prevents environmental contamination and reduces infection transmission risk.",
        criticalStep: false
      },
      {
        id: "jp-15",
        instruction: "Remove gloves and perform hand hygiene.",
        rationale: "Prevents cross-contamination after handling body fluids.",
        criticalStep: true
      },
      {
        id: "jp-16",
        instruction: "Document the drainage output including volume, color, consistency, condition of the insertion site, and patient tolerance.",
        rationale: "Accurate documentation supports continuity of care, allows trend analysis of drainage output, and fulfills legal requirements.",
        criticalStep: true
      }
    ],
    commonErrors: [
      "Forgetting to compress the bulb before closing the port, resulting in loss of suction",
      "Contaminating the drainage port during emptying by touching it with unclean surfaces",
      "Failing to measure drainage volume and only estimating output",
      "Not inspecting the insertion site and tubing for complications before emptying",
      "Documenting output without noting color, consistency, or odor changes",
      "Pulling or applying traction to the drain tubing during emptying"
    ],
    passingCriteria:
      "All critical steps must be performed in the correct sequence. The student must demonstrate hand hygiene, proper patient identification, aseptic handling of the drain port, re-establishment of negative-pressure suction by compressing the bulb before closing, accurate measurement of output, and complete documentation.",
    clinicalPearls: [
      "Normal JP drainage is serosanguineous (straw-colored to light pink) and should decrease in volume each day post-operatively.",
      "Sudden increase in drainage volume or change to bright red may indicate hemorrhage; notify the provider immediately.",
      "Most JP drains are removed when output is less than 30 mL over 24 hours for two consecutive days.",
      "Secure the drain to the patient's gown with a safety pin to prevent accidental dislodgement during ambulation.",
      "Teach patients who are discharged with a JP drain how to empty, measure, and record drainage at home."
    ]
  },
  {
    id: "continuous-bladder-irrigation",
    title: "Continuous Bladder Irrigation (CBI)",
    category: "Procedure",
    difficulty: "Advanced",
    icon: "Droplets",
    description:
      "Setting up and managing continuous bladder irrigation to maintain catheter patency and prevent clot retention following genitourinary surgery.",
    scenarioIntro:
      "You are caring for a 72-year-old male patient who is post-operative day 0 following a transurethral resection of the prostate (TURP). A three-way indwelling urinary catheter is in place and the surgeon has ordered continuous bladder irrigation with normal saline to prevent clot formation. The irrigation solution and tubing are at the bedside. The patient reports mild suprapubic discomfort.",
    equipment: [
      "Prescribed irrigation solution (typically 0.9% Normal Saline, 3 L bags)",
      "IV pole",
      "Sterile irrigation tubing set",
      "Three-way indwelling urinary (Foley) catheter (already in situ)",
      "Closed urinary drainage bag",
      "Clean gloves",
      "Antiseptic swabs",
      "Graduated container for output measurement",
      "Documentation form or electronic health record access"
    ],
    steps: [
      {
        id: "cbi-1",
        instruction: "Verify the provider's order for continuous bladder irrigation, including solution type and flow rate.",
        rationale: "Ensures the correct solution and parameters are used; CBI requires a specific provider order.",
        criticalStep: true
      },
      {
        id: "cbi-2",
        instruction: "Perform hand hygiene.",
        rationale: "Reduces transmission of microorganisms and is the foundational step in infection prevention.",
        criticalStep: true
      },
      {
        id: "cbi-3",
        instruction: "Verify the patient's identity using two identifiers.",
        rationale: "Ensures the correct patient receives the correct intervention.",
        criticalStep: true
      },
      {
        id: "cbi-4",
        instruction: "Explain the purpose of CBI to the patient and what to expect, including the sensation of fluid flowing into the bladder.",
        rationale: "Reduces anxiety and prepares the patient to report abnormal symptoms such as pain, distension, or inability to drain.",
        criticalStep: false
      },
      {
        id: "cbi-5",
        instruction: "Inspect the three-way catheter to confirm it is patent, properly secured, and the drainage bag is below bladder level.",
        rationale: "A kinked or obstructed catheter will prevent outflow and can cause bladder distension or perforation during irrigation.",
        criticalStep: true
      },
      {
        id: "cbi-6",
        instruction: "Hang the irrigation solution bag on the IV pole and spike the bag using sterile irrigation tubing.",
        rationale: "Aseptic technique during spiking prevents introduction of microorganisms into the irrigation system.",
        criticalStep: false
      },
      {
        id: "cbi-7",
        instruction: "Prime the irrigation tubing by allowing solution to flow through and expel all air, then clamp the tubing.",
        rationale: "Air in the tubing can cause patient discomfort and bladder spasms if introduced into the bladder.",
        criticalStep: true
      },
      {
        id: "cbi-8",
        instruction: "Apply clean gloves.",
        rationale: "Provides barrier protection when handling the catheter irrigation port.",
        criticalStep: false
      },
      {
        id: "cbi-9",
        instruction: "Cleanse the irrigation port of the three-way catheter with an antiseptic swab.",
        rationale: "Reduces microbial load at the connection point, decreasing the risk of catheter-associated urinary tract infection (CAUTI).",
        criticalStep: false
      },
      {
        id: "cbi-10",
        instruction: "Connect the primed irrigation tubing to the irrigation port (third lumen) of the three-way catheter using aseptic technique.",
        rationale: "Proper connection ensures a closed system; contamination increases CAUTI risk.",
        criticalStep: true
      },
      {
        id: "cbi-11",
        instruction: "Unclamp the irrigation tubing and adjust the flow rate as ordered. If no specific rate is ordered, adjust to maintain light pink or clear outflow.",
        rationale: "Flow rate must be fast enough to prevent clot formation but not so rapid as to cause bladder distension or discomfort.",
        criticalStep: true
      },
      {
        id: "cbi-12",
        instruction: "Observe the color of the drainage outflow in the drainage tubing and bag. Confirm drainage is flowing freely.",
        rationale: "Dark red or absent outflow may indicate active bleeding, clot obstruction, or catheter malposition requiring immediate intervention.",
        criticalStep: true
      },
      {
        id: "cbi-13",
        instruction: "Assess the patient for bladder distension, suprapubic pain, or increased discomfort.",
        rationale: "These signs may indicate catheter obstruction with fluid accumulating in the bladder, risking perforation.",
        criticalStep: true
      },
      {
        id: "cbi-14",
        instruction: "Monitor and record intake (irrigation solution infused) and output (total drainage bag volume) at regular intervals per facility policy.",
        rationale: "True urine output is calculated by subtracting irrigation intake from total drainage output. Accurate fluid balance assessment is essential.",
        criticalStep: true
      },
      {
        id: "cbi-15",
        instruction: "Replace irrigation solution bags before they run completely empty to maintain continuous flow.",
        rationale: "Allowing the bag to empty introduces air into the system and interrupts the continuous irrigation, increasing clot risk.",
        criticalStep: false
      },
      {
        id: "cbi-16",
        instruction: "Empty the drainage bag when it reaches two-thirds full or per facility protocol, using a graduated container.",
        rationale: "An overfull drainage bag can impede outflow, creating back-pressure and increasing infection risk.",
        criticalStep: false
      },
      {
        id: "cbi-17",
        instruction: "Remove gloves and perform hand hygiene after handling the system.",
        rationale: "Prevents cross-contamination after exposure to body fluids.",
        criticalStep: false
      },
      {
        id: "cbi-18",
        instruction: "Document the procedure including solution used, flow rate, drainage color and volume, calculated urine output, patient tolerance, and any complications.",
        rationale: "Accurate documentation supports continuity of care, facilitates provider decision-making, and meets regulatory requirements.",
        criticalStep: true
      }
    ],
    commonErrors: [
      "Failing to prime the irrigation tubing before connecting, introducing air into the bladder",
      "Not calculating true urine output by subtracting irrigation volume from total drainage",
      "Ignoring signs of catheter obstruction such as decreased outflow with increasing suprapubic pain",
      "Running the irrigation at a fixed rate without adjusting based on drainage color",
      "Allowing the irrigation bag to run completely dry before replacing",
      "Breaking sterile technique when connecting tubing to the irrigation port",
      "Forgetting to verify the catheter is a three-way catheter before attempting CBI"
    ],
    passingCriteria:
      "All critical steps must be in the correct sequence. The student must verify the order, identify the patient, confirm catheter patency, prime the tubing, connect using aseptic technique, adjust flow rate appropriately, monitor outflow, assess for bladder distension, calculate true urine output, and document the procedure.",
    clinicalPearls: [
      "True urine output = Total drainage output minus Total irrigation input. This calculation is essential for accurate fluid balance.",
      "If drainage becomes dark red or output stops, suspect a clot obstruction. Notify the provider; manual irrigation with a catheter-tip syringe may be needed.",
      "Never increase the flow rate to force through a suspected clot; this can cause bladder rupture.",
      "Bladder spasms are common after TURP; administer prescribed antispasmodics as ordered and reassure the patient.",
      "Monitor hemoglobin and hematocrit as ordered; persistent bright red drainage may indicate surgical bleeding requiring intervention.",
      "CBI is typically discontinued when drainage remains clear or light pink for a sustained period as determined by the provider."
    ]
  },
  {
    id: "abdominal-assessment",
    title: "Abdominal Assessment",
    category: "Assessment",
    difficulty: "Intermediate",
    icon: "Stethoscope",
    description:
      "Performing a systematic abdominal assessment using the correct sequence of inspection, auscultation, percussion, and palpation.",
    scenarioIntro:
      "You are performing a focused abdominal assessment on a 45-year-old patient admitted with complaints of diffuse abdominal pain, nausea, and decreased appetite for three days. The patient has a history of cholecystitis. The patient is lying supine in bed with knees slightly flexed and arms at sides.",
    equipment: [
      "Stethoscope",
      "Clean gloves",
      "Penlight or examination light",
      "Tape measure (if measuring abdominal girth)",
      "Pillow for knee support",
      "Drape or sheet for patient privacy"
    ],
    steps: [
      {
        id: "abd-1",
        instruction: "Perform hand hygiene and apply clean gloves as indicated.",
        rationale: "Standard precaution to reduce transmission of microorganisms before patient contact.",
        criticalStep: true
      },
      {
        id: "abd-2",
        instruction: "Verify the patient's identity using two identifiers.",
        rationale: "Ensures the correct patient is assessed as per safety standards.",
        criticalStep: true
      },
      {
        id: "abd-3",
        instruction: "Explain the procedure to the patient and obtain verbal consent. Ask the patient to empty their bladder if possible.",
        rationale: "A full bladder can cause discomfort during palpation and may be mistaken for abdominal distension. Explaining the procedure promotes cooperation.",
        criticalStep: false
      },
      {
        id: "abd-4",
        instruction: "Position the patient supine with knees slightly flexed and arms at sides. Ensure the room is warm and private.",
        rationale: "Flexed knees relax the abdominal musculature, making the exam easier and more comfortable. Arms at sides prevent tensing of abdominal muscles.",
        criticalStep: false
      },
      {
        id: "abd-5",
        instruction: "Expose the abdomen from the xiphoid process to the symphysis pubis while maintaining modesty with draping.",
        rationale: "Full exposure is necessary for complete visualization while maintaining patient dignity.",
        criticalStep: false
      },
      {
        id: "abd-6",
        instruction: "INSPECT the abdomen: observe contour (flat, rounded, distended, scaphoid), symmetry, skin color, scars, lesions, visible peristalsis, pulsations, and hernias.",
        rationale: "Inspection provides initial data about abdominal pathology including distension, ascites, surgical history, and vascular abnormalities.",
        criticalStep: true
      },
      {
        id: "abd-7",
        instruction: "AUSCULTATE all four quadrants with the diaphragm of the stethoscope, starting with the right lower quadrant. Listen for at least 2-5 minutes before declaring bowel sounds absent.",
        rationale: "Auscultation MUST be performed BEFORE percussion and palpation because touching the abdomen can alter bowel motility and produce false findings. The RLQ is auscultated first because the ileocecal valve produces reliable bowel sounds.",
        criticalStep: true
      },
      {
        id: "abd-8",
        instruction: "Characterize bowel sounds as normoactive, hyperactive, hypoactive, or absent. Note the frequency and quality.",
        rationale: "Normal bowel sounds occur 5-35 times per minute. Hyperactive sounds may indicate early obstruction or gastroenteritis; absent sounds may indicate paralytic ileus or peritonitis.",
        criticalStep: false
      },
      {
        id: "abd-9",
        instruction: "Auscultate for vascular sounds (bruits) over the aorta, renal arteries, iliac arteries, and femoral arteries using the bell of the stethoscope.",
        rationale: "Bruits indicate turbulent blood flow and may signal aneurysm, renal artery stenosis, or peripheral vascular disease.",
        criticalStep: false
      },
      {
        id: "abd-10",
        instruction: "PERCUSS all four quadrants systematically, noting areas of tympany and dullness.",
        rationale: "Percussion identifies air-filled versus fluid-filled or solid structures. Tympany over the gastric bubble is normal; shifting dullness suggests ascites.",
        criticalStep: false
      },
      {
        id: "abd-11",
        instruction: "PALPATE lightly in all four quadrants, beginning with the quadrant farthest from the area of reported pain.",
        rationale: "Light palpation (1 cm depth) assesses for tenderness, guarding, and superficial masses. Starting away from the painful area prevents the patient from tensing, which would limit the exam.",
        criticalStep: true
      },
      {
        id: "abd-12",
        instruction: "Perform deep palpation (4-5 cm depth) in all four quadrants, again avoiding the painful area until last.",
        rationale: "Deep palpation assesses for organ enlargement, deep masses, and tenderness. Performing it after light palpation follows the least-invasive-first principle.",
        criticalStep: false
      },
      {
        id: "abd-13",
        instruction: "Assess for rebound tenderness by pressing deeply and then releasing quickly in the area of pain. Observe the patient's response.",
        rationale: "Rebound tenderness (pain on release) is a hallmark sign of peritoneal irritation and may indicate appendicitis, peritonitis, or other surgical emergencies.",
        criticalStep: false
      },
      {
        id: "abd-14",
        instruction: "Document findings systematically for all four techniques: inspection, auscultation, percussion, and palpation, including the location of any abnormalities using quadrant terminology.",
        rationale: "Systematic documentation with anatomical specificity ensures clear communication among the healthcare team and supports clinical decision-making.",
        criticalStep: true
      },
      {
        id: "abd-15",
        instruction: "Remove gloves, perform hand hygiene, and reposition the patient comfortably.",
        rationale: "Standard infection prevention practice after patient contact; repositioning promotes patient comfort.",
        criticalStep: false
      }
    ],
    commonErrors: [
      "Palpating or percussing BEFORE auscultating, which can alter bowel sounds and produce inaccurate findings",
      "Declaring bowel sounds absent after listening for less than two minutes in one quadrant",
      "Beginning palpation in the quadrant where the patient reports pain, causing guarding and an unreliable exam",
      "Failing to use both light and deep palpation techniques",
      "Not asking the patient to empty the bladder before the exam",
      "Forgetting to auscultate for vascular bruits in addition to bowel sounds",
      "Not properly exposing the abdomen, leading to missed visual findings"
    ],
    passingCriteria:
      "All critical steps must be in the correct sequence. The student must follow the correct order of techniques: inspection, auscultation, percussion, palpation (unique to abdominal assessment). The student must auscultate before touching the abdomen, palpate away from the painful area first, and document findings systematically.",
    clinicalPearls: [
      "The abdominal assessment is the ONLY physical exam where the sequence changes: Inspect, Auscultate, Percuss, Palpate (not the usual Inspect, Palpate, Percuss, Auscultate).",
      "Auscultate before palpation and percussion because physical manipulation stimulates peristalsis and changes bowel sounds.",
      "Use the mnemonic 'All Babies Pee Properly' as a reminder to Auscultate Before Palpating and Percussing the abdomen (inverted for abdominal exam).",
      "Murphy sign (inspiratory arrest during RUQ palpation) suggests acute cholecystitis.",
      "McBurney point tenderness (RLQ, one-third the distance from the ASIS to the umbilicus) is associated with appendicitis.",
      "A rigid, board-like abdomen is a surgical emergency indicating peritonitis."
    ]
  },
  {
    id: "musculoskeletal-assessment",
    title: "Musculoskeletal Assessment",
    category: "Assessment",
    difficulty: "Intermediate",
    icon: "Bone",
    description:
      "Performing a systematic musculoskeletal assessment including range of motion, muscle strength, gait analysis, and joint evaluation.",
    scenarioIntro:
      "You are performing a focused musculoskeletal assessment on a 62-year-old patient who presents with complaints of bilateral knee stiffness and difficulty with mobility over the past several months. The patient has a history of osteoarthritis and uses a cane for ambulation. The patient is alert, cooperative, and seated on the examination table.",
    equipment: [
      "Goniometer (for precise range of motion measurement)",
      "Tape measure",
      "Reflex hammer",
      "Clean gloves (if open wounds or skin lesions present)",
      "Gait belt (for safety during ambulation assessment)",
      "Documentation form or electronic health record access"
    ],
    steps: [
      {
        id: "msk-1",
        instruction: "Perform hand hygiene.",
        rationale: "Standard infection prevention measure before any patient contact.",
        criticalStep: true
      },
      {
        id: "msk-2",
        instruction: "Verify the patient's identity using two identifiers.",
        rationale: "Ensures the correct patient is assessed as per patient safety standards.",
        criticalStep: true
      },
      {
        id: "msk-3",
        instruction: "Explain the assessment to the patient and obtain verbal consent. Ask about pain location, onset, aggravating and alleviating factors, and functional limitations.",
        rationale: "A focused health history guides the physical assessment and identifies areas requiring closer evaluation. Understanding pain characteristics ensures safe examination.",
        criticalStep: false
      },
      {
        id: "msk-4",
        instruction: "INSPECT the overall posture and body alignment with the patient standing (if able) and then seated. Note symmetry, spinal curvatures, and any deformities.",
        rationale: "Observation of posture reveals scoliosis, kyphosis, lordosis, limb-length discrepancies, and compensatory postural changes.",
        criticalStep: true
      },
      {
        id: "msk-5",
        instruction: "Inspect the skin over joints and muscles for erythema, ecchymosis, swelling, atrophy, asymmetry, nodules, or deformities.",
        rationale: "Visible changes may indicate inflammation, injury, chronic disease, or disuse atrophy and help focus the remainder of the exam.",
        criticalStep: false
      },
      {
        id: "msk-6",
        instruction: "PALPATE major joints and surrounding structures bilaterally, comparing sides. Assess for warmth, tenderness, crepitus, swelling, and nodules.",
        rationale: "Bilateral comparison is essential to distinguish normal findings from pathology. Warmth and swelling suggest active inflammation; crepitus suggests cartilage degeneration.",
        criticalStep: true
      },
      {
        id: "msk-7",
        instruction: "Assess ACTIVE range of motion (ROM) by asking the patient to move each joint through its full range independently. Evaluate both upper and lower extremities.",
        rationale: "Active ROM reveals the patient's functional ability and willingness to move. Limited active ROM may indicate pain, weakness, or joint pathology.",
        criticalStep: true
      },
      {
        id: "msk-8",
        instruction: "Assess PASSIVE range of motion by gently moving each joint through its range while the patient relaxes the muscles. Compare to active ROM.",
        rationale: "If passive ROM exceeds active ROM, the limitation is likely muscular (weakness or pain). If passive ROM is also limited, the restriction is likely structural (joint contracture, bony block).",
        criticalStep: false
      },
      {
        id: "msk-9",
        instruction: "Test MUSCLE STRENGTH bilaterally using the 0-5 grading scale. Test major muscle groups of upper and lower extremities against resistance.",
        rationale: "Strength grading provides objective, standardized measurement: 0 = no contraction, 3 = against gravity only, 5 = full strength against resistance. Bilateral comparison detects asymmetric weakness.",
        criticalStep: true
      },
      {
        id: "msk-10",
        instruction: "Assess GRIP STRENGTH bilaterally by having the patient squeeze two of your fingers.",
        rationale: "Grip strength is a functional indicator of upper extremity strength and overall musculoskeletal health. Asymmetry may indicate nerve or musculoskeletal pathology.",
        criticalStep: false
      },
      {
        id: "msk-11",
        instruction: "Assess GAIT by observing the patient walk across the room (with assistive device if used). Note stride length, arm swing, balance, symmetry, heel-to-toe pattern, and use of assistive devices.",
        rationale: "Gait assessment reveals balance, coordination, lower extremity strength, joint function, and fall risk.",
        criticalStep: true
      },
      {
        id: "msk-12",
        instruction: "Perform special tests as indicated based on the patient's complaints: for example, the Phalen test or Tinel sign for carpal tunnel, the McMurray test for meniscal injury, or the straight leg raise for lumbar radiculopathy.",
        rationale: "Special tests help confirm or rule out specific diagnoses suggested by the history and general exam.",
        criticalStep: false
      },
      {
        id: "msk-13",
        instruction: "Assess the patient's functional mobility: ability to rise from a seated position, transfer, and perform activities of daily living.",
        rationale: "Functional assessment determines the impact of musculoskeletal findings on the patient's independence and guides care planning, rehabilitation referrals, and discharge planning.",
        criticalStep: false
      },
      {
        id: "msk-14",
        instruction: "Document all findings including posture, inspection, palpation, ROM (active and passive), muscle strength grades, gait description, special test results, and functional status.",
        rationale: "Thorough documentation establishes a baseline for comparison, supports clinical decision-making, and meets legal and regulatory requirements.",
        criticalStep: true
      },
      {
        id: "msk-15",
        instruction: "Perform hand hygiene after completing the assessment and ensure the patient is safe and comfortable.",
        rationale: "Standard infection prevention after patient contact; confirming patient safety prevents falls or injury post-assessment.",
        criticalStep: false
      }
    ],
    commonErrors: [
      "Failing to compare findings bilaterally, missing asymmetries that indicate pathology",
      "Skipping active ROM assessment and only testing passive ROM, which does not reveal functional ability",
      "Not using the standardized 0-5 muscle strength grading scale",
      "Assessing gait without a gait belt when fall risk is identified",
      "Forcing joints beyond the patient's pain tolerance during passive ROM testing",
      "Forgetting to assess functional mobility in addition to isolated joint function",
      "Not documenting the specific grade of muscle strength, using only vague descriptors"
    ],
    passingCriteria:
      "All critical steps must be in the correct sequence. The student must perform hand hygiene, identify the patient, follow the systematic approach (inspect, palpate, ROM, strength, gait), compare findings bilaterally, use standardized grading for muscle strength, and document all findings.",
    clinicalPearls: [
      "Always compare bilaterally: the unaffected side serves as the patient's own baseline for comparison.",
      "Muscle strength grading: 0 = no contraction, 1 = flicker/trace, 2 = movement with gravity eliminated, 3 = movement against gravity, 4 = movement against some resistance, 5 = full strength against full resistance.",
      "Crepitus (a grinding or crackling sensation) on joint movement is characteristic of osteoarthritis or cartilage degeneration.",
      "A positive Trendelenburg sign during gait (pelvis drops on the unsupported side) indicates gluteus medius weakness.",
      "The 5 P's of neurovascular assessment in extremity injuries: Pain, Pallor, Pulselessness, Paresthesia, Paralysis.",
      "Osteoarthritis typically presents with joint stiffness that improves with movement; rheumatoid arthritis presents with prolonged morning stiffness lasting more than 30 minutes."
    ]
  }
];
