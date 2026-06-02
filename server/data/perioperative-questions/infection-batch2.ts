import type { PerioperativeQuestion } from "./types";

export const infectionBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "A circulating nurse observes a surgical team member adjust their surgical mask by pulling it below their nose during a long procedure. What is the infection prevention concern and correct response?",
    options: [
      "No concern — masks are primarily for the comfort of the wearer",
      "The mask must cover both the nose AND mouth to prevent droplet and airborne contamination of the sterile field from the wearer's respiratory secretions — the nurse should remind the team member to properly reposition or replace the mask",
      "The mask only needs to cover the mouth since bacteria are primarily spread by talking",
      "Masks are optional during surgery if the team member is not actively coughing"
    ],
    correctAnswer: 1,
    rationaleLong: "Surgical masks serve as a barrier to prevent droplet and particulate contamination of the surgical site from the respiratory tract of surgical team members. The mask must cover BOTH the nose and mouth because: (1) Both nasal and oral exhalation contain droplets carrying respiratory flora (Staphylococcus aureus, Streptococcus species, and other organisms that cause surgical site infections); (2) The nose is a primary reservoir for S. aureus — approximately 20-30% of the general population are persistent nasal carriers, and nasal S. aureus carriage is a documented risk factor for SSI; (3) Normal breathing through the nose generates droplets that can travel significant distances and contaminate the surgical field; (4) A mask worn below the nose provides NO barrier to nasal exhalation and essentially defeats the purpose of masking. AORN Guidelines for Perioperative Practice state that surgical masks should: cover both the nose and mouth completely, be secured to prevent venting at the sides, be changed when visibly soiled, wet, or between procedures, and be handled only by the ties or ear loops (not the filter surface). The circulating nurse has a professional obligation to address breaks in sterile technique and infection prevention practices, regardless of the other team member's role or seniority.",
    learningObjective: "Enforce proper surgical mask use as an infection prevention measure and address technique breaks regardless of team member seniority",
    blueprintCategory: "Infection Prevention",
    subtopic: "standard precautions",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Masks must cover BOTH nose and mouth. 20-30% of people are nasal S. aureus carriers — nasal exhalation contaminates the surgical field.",
    clinicalPearls: [
      "Surgical mask must cover both nose and mouth — nasal exhalation carries S. aureus",
      "20-30% of the general population are persistent nasal S. aureus carriers",
      "Change masks when wet, soiled, or between procedures — handle by ties only"
    ],
    safetyNote: "Address mask violations immediately and professionally — infection prevention standards apply to ALL team members regardless of role or seniority",
    distractorRationales: [
      "Masks protect the patient from the wearer's respiratory secretions, not primarily for wearer comfort",
      "The nose is a major reservoir for S. aureus — mouth coverage alone is insufficient",
      "Masks are required for all personnel in the OR during procedures — they are not optional"
    ]
  },
  {
    stem: "The perioperative nurse is reviewing the facility's surgical site infection (SSI) prevention bundle. Which of the following is an evidence-based component of the SSI prevention bundle that the nurse should verify before every surgical procedure?",
    options: [
      "Administering prophylactic antibiotics within 24 hours before incision",
      "Administering prophylactic antibiotics within 60 minutes before surgical incision (120 minutes for vancomycin or fluoroquinolones), with appropriate agent selection based on the surgical procedure",
      "Administering prophylactic antibiotics immediately after wound closure",
      "Prophylactic antibiotics are not part of SSI prevention"
    ],
    correctAnswer: 1,
    rationaleLong: "Antimicrobial prophylaxis timing is one of the most critical and well-studied components of surgical site infection (SSI) prevention. The evidence consistently demonstrates that prophylactic antibiotics must be administered within a specific window before surgical incision to achieve adequate tissue drug levels at the time of potential contamination. Current guidelines (SCIP/CMS/WHO/NICE) recommend: (1) Administer the antibiotic within 60 minutes before surgical incision for most agents (cefazolin, cefoxitin, ampicillin-sulbactam, clindamycin, etc.); (2) For vancomycin and fluoroquinolones, administer within 120 minutes before incision because these agents require longer infusion times; (3) Select the appropriate antibiotic based on the surgical procedure and expected pathogens — cefazolin is the most commonly used agent for clean procedures; cefoxitin or cefazolin + metronidazole for colorectal procedures; (4) Re-dose intraoperatively for prolonged procedures (>2 half-lives of the antibiotic) or if significant blood loss occurs (>1500 mL); (5) Discontinue prophylactic antibiotics within 24 hours after surgery (48 hours for cardiac surgery per some guidelines). Studies show that antibiotics given too early (>60 minutes before incision) or after incision are significantly less effective at preventing SSI. The 60-minute window ensures peak tissue levels at the time of surgical contamination.",
    learningObjective: "Apply evidence-based antibiotic prophylaxis timing guidelines as part of the SSI prevention bundle",
    blueprintCategory: "Infection Prevention",
    subtopic: "antibiotic prophylaxis",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Antibiotic prophylaxis within 60 minutes before incision (120 min for vancomycin/fluoroquinolones). Re-dose if surgery exceeds 2 half-lives. Discontinue within 24 hours postop.",
    clinicalPearls: [
      "Standard agents: within 60 minutes before incision. Vancomycin/fluoroquinolones: within 120 minutes",
      "Cefazolin: most common prophylactic agent for clean procedures — re-dose every 4 hours",
      "Discontinue prophylactic antibiotics within 24 hours (48 hours for cardiac surgery)"
    ],
    safetyNote: "Verify antibiotic administration during the pre-incision time-out — timing compliance is a national quality measure",
    distractorRationales: [
      "24 hours before incision is far too early — tissue drug levels will be subtherapeutic at incision time",
      "Antibiotics given after wound closure are too late — contamination occurs during the procedure",
      "Prophylactic antibiotics are a cornerstone of SSI prevention with strong evidence"
    ]
  },
  {
    stem: "A perioperative nurse is performing surgical skin preparation using chlorhexidine gluconate (CHG) with isopropyl alcohol. What is the correct application technique?",
    options: [
      "Apply with circular motions starting at the periphery and moving toward the incision site",
      "Apply using a back-and-forth friction scrubbing technique for at least 30 seconds (2 minutes for inguinal area), allow to air dry completely (approximately 3 minutes), and ensure the solution does not pool under the patient",
      "Spray the solution lightly over the surgical site without rubbing",
      "Apply CHG and immediately drape the patient while the solution is still wet"
    ],
    correctAnswer: 1,
    rationaleLong: "Chlorhexidine gluconate with isopropyl alcohol (CHG-alcohol) is the preferred skin antiseptic for most surgical procedures based on evidence showing superior reduction of surgical site infections compared to povidone-iodine. The correct application technique is critical for both efficacy and safety: (1) Application technique — use a back-and-forth friction scrubbing motion (not circular) for at least 30 seconds in the surgical area (2 minutes for inguinal or perineal areas). Friction enhances mechanical removal of transient flora and improves antiseptic penetration into the skin layers; (2) Drying time — CHG-alcohol MUST be allowed to air dry COMPLETELY (approximately 3 minutes, longer for hairy areas or areas where solution may pool). The alcohol component provides rapid bactericidal activity, but the alcohol is also flammable — if the solution has not fully dried and electrosurgery or laser is used, the alcohol vapors can ignite, causing a surgical fire; (3) Prevent pooling — the solution must NOT pool under the patient, in the umbilicus, or in skin folds because pooled alcohol creates a significant fire hazard and can cause chemical burns from prolonged skin contact; (4) Contraindications — CHG should not be used on mucous membranes, near the eyes or ears (risk of ototoxicity if CHG enters the middle ear), or on patients with documented CHG allergy.",
    learningObjective: "Apply surgical skin antiseptic using correct technique with appropriate drying time to prevent fire hazard and maximize antimicrobial efficacy",
    blueprintCategory: "Infection Prevention",
    subtopic: "skin preparation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CHG-alcohol: back-and-forth friction (not circular), 30 seconds minimum, MUST air dry completely (~3 min). Pooled alcohol = FIRE HAZARD with electrosurgery.",
    clinicalPearls: [
      "CHG-alcohol is superior to povidone-iodine for SSI reduction in most procedures",
      "Back-and-forth friction scrubbing for ≥30 seconds; 2 minutes for inguinal/perineal areas",
      "Must air dry completely — alcohol vapors are flammable and can ignite with electrosurgery"
    ],
    safetyNote: "NEVER drape or use electrosurgery until CHG-alcohol has COMPLETELY air dried — this is one of the leading causes of OR fires",
    distractorRationales: [
      "Circular motions starting at periphery is the old technique — back-and-forth friction is current best practice",
      "Light spraying without friction does not provide adequate antimicrobial skin decontamination",
      "Draping over wet alcohol-based prep creates a fire hazard and traps flammable vapors"
    ]
  },
  {
    stem: "A perioperative nurse opens the OR door during an orthopedic total joint arthroplasty to allow a late-arriving surgical team member to enter. The charge nurse observes that the OR door has been opened and closed 15 times during the first hour of the case. What is the infection prevention concern?",
    options: [
      "Door openings have no effect on the OR environment",
      "Excessive OR door openings disrupt the positive-pressure ventilation system, increase particulate and microbial contamination of the OR air, and are associated with increased SSI rates — door openings should be minimized during surgical procedures",
      "Door openings only matter during cardiac surgery, not orthopedic cases",
      "The number of door openings is a facilities management concern, not a nursing concern"
    ],
    correctAnswer: 1,
    rationaleLong: "Operating room door openings are a significant modifiable risk factor for surgical site infection. The OR is maintained at positive pressure relative to adjacent corridors and rooms — this positive pressure differential ensures that air flows OUT of the OR when doors are opened, preventing contaminated corridor air from entering the clean OR environment. However, each door opening temporarily disrupts this positive pressure differential, allowing an influx of corridor air that is less filtered and potentially contaminated. Studies have demonstrated that: (1) Each door opening introduces a measurable increase in airborne particulate and bacterial colony counts; (2) The frequency of door openings is directly correlated with SSI rates, particularly in clean orthopedic procedures (total joint arthroplasty) where the implant creates a large foreign body surface susceptible to bacterial colonization; (3) Fifteen door openings in one hour far exceeds the recommended minimum — studies show that average door openings per hour in busy ORs can reach 30-60, but efforts to reduce them below 10 per hour significantly improve air quality; (4) In laminar airflow ORs (used for total joint arthroplasty), door openings are even more disruptive because they disturb the unidirectional airflow pattern designed to sweep particles away from the surgical site. Strategies to reduce door openings include: having all supplies in the room before incision, limiting traffic to essential personnel, and using communication systems that don't require door opening.",
    learningObjective: "Identify excessive OR door openings as a modifiable SSI risk factor and implement strategies to minimize traffic during surgical procedures",
    blueprintCategory: "Infection Prevention",
    subtopic: "environmental controls",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Each door opening disrupts positive pressure ventilation and increases airborne contamination. Particularly critical during total joint arthroplasty (implant = infection risk).",
    clinicalPearls: [
      "OR door openings disrupt positive-pressure ventilation and increase airborne microbial counts",
      "Frequency of door openings is directly correlated with SSI rates",
      "Strategies: stock all supplies before incision, limit traffic, use communication systems"
    ],
    safetyNote: "Minimize OR door openings during total joint arthroplasty — implants create large foreign body surfaces highly susceptible to bacterial colonization",
    distractorRationales: [
      "Door openings measurably increase airborne contamination and are correlated with SSI",
      "Door openings affect all surgical procedures, not just cardiac — especially important for implant procedures",
      "Minimizing door openings is a direct nursing responsibility for infection prevention"
    ]
  },
  {
    stem: "A circulating nurse discovers that a flash sterilization cycle (immediate-use steam sterilization, IUSS) was used to sterilize an implantable device because the device was dropped during setup. What is the infection prevention concern?",
    options: [
      "IUSS is the preferred method for sterilizing implants — it is faster and more convenient",
      "IUSS (immediate-use steam sterilization) should NOT be used for implants — AORN and AAMI recommend against IUSS for implantable devices because the abbreviated cycle and uncontrolled transport increase contamination and infection risk",
      "IUSS is acceptable for implants as long as a biological indicator is run",
      "IUSS and conventional sterilization are identical in efficacy"
    ],
    correctAnswer: 1,
    rationaleLong: "Immediate-use steam sterilization (IUSS, formerly called flash sterilization) is an abbreviated sterilization cycle designed for emergency use when a critical instrument is needed and there is insufficient time for a full sterilization cycle. IUSS differs from conventional sterilization in several important ways: (1) Abbreviated exposure time — the steam exposure is shorter than a standard cycle; (2) No drying cycle — items are removed wet, and wet items are at higher risk for recontamination during transport; (3) Items cannot be wrapped or contained — they are sterilized in an open tray or a single-layer container, meaning they cannot be stored and must be used immediately; (4) Transport from the sterilizer to the OR exposes the unprotected item to environmental contamination. AORN and AAMI (Association for the Advancement of Medical Instrumentation) guidelines explicitly state that IUSS should NOT be used for implantable devices because: the consequences of SSI involving an implant are catastrophic (infection of a total joint replacement requires removal of the implant, 6-12 weeks of IV antibiotics, and a second surgery for reimplantation); the abbreviated cycle has a higher failure rate than conventional sterilization; biological indicator results are not available before the item is used. If an implant is dropped or contaminated, the correct response is to obtain a replacement implant from backup inventory, not to flash sterilize the contaminated device.",
    learningObjective: "Understand that IUSS is contraindicated for implantable devices and implement proper responses to implant contamination events",
    blueprintCategory: "Infection Prevention",
    subtopic: "immediate-use sterilization",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IUSS is NOT for implants. Dropped implant → obtain REPLACEMENT from backup inventory. Implant SSI requires implant removal + 6-12 weeks IV antibiotics + revision surgery.",
    clinicalPearls: [
      "IUSS should NOT be used for implantable devices — AORN and AAMI guidelines",
      "IUSS: no drying cycle, no wrapping, no storage — items are wet and must be used immediately",
      "Dropped or contaminated implant: obtain a replacement, do not flash sterilize"
    ],
    safetyNote: "Maintain adequate backup inventory of implants to avoid the temptation to use IUSS for contaminated implantable devices",
    distractorRationales: [
      "IUSS is explicitly NOT preferred for implants — it is an abbreviated cycle with higher risk",
      "Even with a biological indicator, IUSS results are not available before the item is used during the procedure",
      "IUSS has a shorter cycle with no drying phase and uncontrolled transport — it is not identical to conventional sterilization"
    ]
  }
];
