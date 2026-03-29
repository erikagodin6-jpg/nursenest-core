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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const entries: OTEntry[] = [
  // ===== FUNCTIONAL ASSESSMENT (15 entries) =====
  {
    slug: "functional-independence-measure",
    title: "Functional Independence Measure (FIM)",
    category: "Functional Assessment",
    seoTitle: "Functional Independence Measure (FIM) — OT Encyclopedia",
    seoDescription: "Comprehensive guide to the FIM assessment tool used in occupational therapy to measure functional independence in self-care, mobility, and cognition.",
    seoKeywords: ["FIM", "functional independence measure", "occupational therapy assessment", "NBCOT"],
    overview: "The Functional Independence Measure (FIM) is a standardized assessment tool widely used in rehabilitation settings to evaluate a patient's level of disability and functional independence. It consists of 18 items across six domains: self-care, sphincter control, transfers, locomotion, communication, and social cognition. Each item is scored on a 7-point scale ranging from total assistance (1) to complete independence (7), yielding total scores from 18 to 126.",
    mechanismPhysiology: "The FIM measures the burden of care by quantifying the amount of assistance a person requires to perform activities of daily living. It assesses both motor and cognitive functional status, providing a comprehensive picture of disability severity and rehabilitation progress.",
    clinicalRelevance: "Used extensively in inpatient rehabilitation facilities (IRFs), the FIM serves as a key outcome measure for documenting progress, justifying continued treatment, and determining discharge disposition. It is often required for Medicare reimbursement and is integral to the Inpatient Rehabilitation Facility Patient Assessment Instrument (IRF-PAI).",
    signsSymptoms: "Indications for FIM assessment include stroke, traumatic brain injury, spinal cord injury, hip fracture, and other conditions requiring inpatient rehabilitation. The FIM helps identify specific functional deficits across motor and cognitive domains.",
    assessment: "Administration involves direct observation and clinical judgment by trained clinicians. Scoring reflects the patient's actual performance, not capacity. Motor subscale (13 items, max 91) covers eating, grooming, bathing, upper body dressing, lower body dressing, toileting, bladder management, bowel management, bed/chair/wheelchair transfers, toilet transfers, tub/shower transfers, walk/wheelchair locomotion, and stairs. Cognitive subscale (5 items, max 35) covers comprehension, expression, social interaction, problem solving, and memory.",
    management: "OTs use FIM data to set measurable treatment goals, track functional gains over the rehabilitation stay, plan discharge, and communicate patient status to the interdisciplinary team. Intervention planning targets domains where scores indicate moderate to maximal assistance needs.",
    complications: "Scoring inconsistencies may arise from rater variability, which is mitigated through standardized training. Ceiling effects can limit sensitivity in higher-functioning patients. Cultural and linguistic differences may affect cognitive subscale validity.",
    clinicalPearls: [
      "FIM scores are best interpreted as a team effort — ensure all disciplines contribute to accurate scoring.",
      "A change of 22 points on the motor subscale is considered a clinically meaningful improvement.",
      "FIM admission scores are strong predictors of length of stay and discharge destination."
    ],
    examPitfalls: [
      "Confusing FIM with Barthel Index — the FIM includes cognitive items while the Barthel does not.",
      "Scoring based on what the patient 'can do' rather than what they 'actually do' — FIM measures actual performance.",
      "Forgetting that the scale ranges from 1-7, not 0-7."
    ],
    faqJson: [
      { question: "What is the FIM used for in occupational therapy?", answer: "The FIM is used to measure a patient's level of functional independence across self-care, mobility, and cognitive tasks, helping OTs set goals, track progress, and plan discharge." },
      { question: "How is the FIM scored?", answer: "Each of the 18 items is scored on a 7-point scale (1 = total assistance to 7 = complete independence), with total scores ranging from 18 to 126." },
      { question: "What is the difference between FIM motor and cognitive subscales?", answer: "The motor subscale (13 items) covers physical tasks like eating, dressing, and transfers. The cognitive subscale (5 items) covers comprehension, expression, social interaction, problem solving, and memory." }
    ]
  },
  {
    slug: "barthel-index",
    title: "Barthel Index",
    category: "Functional Assessment",
    seoTitle: "Barthel Index — OT Encyclopedia",
    seoDescription: "Guide to the Barthel Index assessment for measuring performance in activities of daily living in occupational therapy practice.",
    seoKeywords: ["Barthel Index", "ADL assessment", "occupational therapy", "functional assessment"],
    overview: "The Barthel Index is a widely used ordinal scale that measures functional independence in activities of daily living (ADLs). It evaluates 10 variables: feeding, bathing, grooming, dressing, bowel control, bladder control, toilet use, transfers, mobility, and stairs. Total scores range from 0 (fully dependent) to 100 (fully independent).",
    mechanismPhysiology: "This tool quantifies the degree of assistance required for each ADL task. It provides a simple, reproducible measure of physical disability that can be used to track functional recovery over time.",
    clinicalRelevance: "The Barthel Index is particularly valuable in stroke rehabilitation, geriatric assessment, and chronic disease management. Its simplicity and brevity make it ideal for busy clinical settings and longitudinal monitoring.",
    signsSymptoms: "Applied to patients with stroke, hip fracture, neurodegenerative conditions, and other diagnoses affecting ADL performance. Useful for documenting baseline function and measuring treatment outcomes.",
    assessment: "Administered through observation or patient/caregiver interview. Each item is scored in 5-point increments (0, 5, 10, or 15 depending on the item). A score of 60 or above generally indicates potential for functional independence. Scores below 20 indicate severe dependence.",
    management: "OTs use Barthel Index results to prioritize ADL training, set realistic discharge goals, and determine the level of caregiver support needed. Serial assessments document functional recovery trajectory.",
    complications: "Limited sensitivity to change in higher-functioning patients (ceiling effect). Does not capture IADL performance, cognitive function, or quality of life. May not reflect the complexity of assistance needed.",
    clinicalPearls: [
      "A score of 60+ suggests a patient may be suitable for community discharge with support.",
      "The modified Barthel Index uses a 0-20 scale and may offer slightly better sensitivity.",
      "Best used as part of a comprehensive assessment battery rather than in isolation."
    ],
    examPitfalls: [
      "Assuming the Barthel Index includes IADLs — it only covers basic ADLs.",
      "Confusing the 0-100 scale with percentage of independence.",
      "Not recognizing the ceiling effect in higher-functioning patients."
    ],
    faqJson: [
      { question: "What does the Barthel Index measure?", answer: "It measures a patient's ability to perform 10 basic activities of daily living, scoring from 0 (total dependence) to 100 (full independence)." },
      { question: "What score on the Barthel Index indicates independence?", answer: "A score of 60 or above generally suggests potential for functional independence, though full independence is indicated by a score of 100." }
    ]
  },
  {
    slug: "canadian-occupational-performance-measure",
    title: "Canadian Occupational Performance Measure (COPM)",
    category: "Functional Assessment",
    seoTitle: "Canadian Occupational Performance Measure (COPM) — OT Encyclopedia",
    seoDescription: "Comprehensive guide to the COPM, a client-centred outcome measure used by occupational therapists to identify occupational performance issues.",
    seoKeywords: ["COPM", "Canadian Occupational Performance Measure", "client-centred assessment", "OT outcome measure"],
    overview: "The Canadian Occupational Performance Measure (COPM) is a client-centred, semi-structured interview tool used to detect changes in a client's self-perception of occupational performance over time. Clients identify and prioritize occupational performance problems in three areas: self-care, productivity, and leisure. Each identified problem is rated on two 10-point scales for performance and satisfaction.",
    mechanismPhysiology: "Grounded in the Canadian Model of Occupational Performance and Engagement (CMOP-E), the COPM enables clients to articulate their own performance concerns and priorities, reflecting the dynamic relationship between person, environment, and occupation.",
    clinicalRelevance: "The COPM ensures therapy goals are meaningful and client-driven. It captures subjective change that standardized performance measures may miss, making it valuable for demonstrating treatment effectiveness from the client's perspective.",
    signsSymptoms: "Appropriate for any client who can identify and discuss occupational performance difficulties, including those with physical disabilities, mental health conditions, developmental challenges, and chronic illness.",
    assessment: "Administered through a semi-structured interview lasting 20-40 minutes. Clients identify up to 5 priority problems and rate each for performance (1-10) and satisfaction (1-10). Reassessment uses identical items to measure change. A change of 2+ points is considered clinically significant.",
    management: "OTs use COPM results to establish client-centred treatment goals, guide intervention planning, and measure outcomes. The tool promotes shared decision-making and ensures therapy addresses the client's priorities.",
    complications: "May be difficult to administer with clients who have severe cognitive impairment or communication deficits. Proxy reporting (caregiver) is possible but alters the client-centred nature. Cultural factors may influence how clients express occupational concerns.",
    clinicalPearls: [
      "A 2-point change in performance or satisfaction scores is considered clinically significant.",
      "The COPM aligns directly with the Person-Environment-Occupation (PEO) model.",
      "Ideal for goal-setting in community-based and outpatient OT practice."
    ],
    examPitfalls: [
      "Confusing COPM with observer-rated tools — it is a self-report measure.",
      "Not recognizing that both performance AND satisfaction scores are captured.",
      "Forgetting the three occupational performance areas: self-care, productivity, and leisure."
    ],
    faqJson: [
      { question: "What makes the COPM client-centred?", answer: "The COPM has the client identify and prioritize their own occupational performance problems and rate their own performance and satisfaction, ensuring therapy goals reflect the client's perspective." },
      { question: "How is clinical significance determined on the COPM?", answer: "A change of 2 or more points in performance or satisfaction ratings is considered clinically significant." }
    ]
  },
  {
    slug: "assessment-of-motor-and-process-skills",
    title: "Assessment of Motor and Process Skills (AMPS)",
    category: "Functional Assessment",
    seoTitle: "Assessment of Motor and Process Skills (AMPS) — OT Encyclopedia",
    seoDescription: "Guide to the AMPS, an observational assessment measuring the quality of ADL task performance in occupational therapy.",
    seoKeywords: ["AMPS", "motor skills assessment", "process skills", "occupational therapy", "ADL performance"],
    overview: "The Assessment of Motor and Process Skills (AMPS) is a standardized, observational assessment that simultaneously measures the quality of a person's motor and process skills during the performance of chosen ADL tasks. It evaluates 16 motor skill items and 20 process skill items using many-faceted Rasch analysis to produce linear, criterion-referenced measures.",
    mechanismPhysiology: "The AMPS uses top-down, occupation-based assessment by observing actual task performance rather than isolated body functions. Motor skills relate to physical effort and efficiency, while process skills reflect cognitive organization and adaptation during task execution.",
    clinicalRelevance: "The AMPS provides objective, valid data about functional performance that predicts the need for assistance in community living. It is one of the most rigorously developed OT assessments worldwide and is used across cultures and diagnostic groups.",
    signsSymptoms: "Applicable to individuals aged 3 and older across all diagnostic categories where there are concerns about ADL performance quality, including stroke, dementia, developmental disabilities, and psychiatric conditions.",
    assessment: "The client selects and performs 2-3 familiar ADL tasks while the trained rater observes. Tasks are chosen from a standardized list of over 125 calibrated tasks. Scoring uses the AMPS software for Rasch analysis, producing motor and process ability measures. A process score below 1.0 suggests need for assistance in community living.",
    management: "OTs use AMPS results to determine the need for services, plan occupation-based interventions, document outcomes, and make discharge recommendations regarding independent living capacity.",
    complications: "Requires specialized training and certification to administer and score. Computer-based scoring is mandatory. Task selection must match client's cultural and personal experience for valid results.",
    clinicalPearls: [
      "A process skill measure below 1.0 logits predicts the need for assistance in community living.",
      "AMPS is considered the gold standard for occupation-based functional assessment.",
      "Raters must complete a 5-day training course and be calibrated as reliable raters."
    ],
    examPitfalls: [
      "Confusing AMPS with capacity-based assessments — AMPS measures actual performance quality.",
      "Not knowing that AMPS requires specialized rater training and certification.",
      "Confusing motor and process skill categories."
    ],
    faqJson: [
      { question: "What does the AMPS measure?", answer: "The AMPS measures the quality of motor and process skills during real ADL task performance, providing objective data about functional competence." },
      { question: "What does a low AMPS process score indicate?", answer: "A process skill measure below 1.0 logits suggests the person likely needs assistance for safe, independent community living." }
    ]
  },
  {
    slug: "kohlman-evaluation-of-living-skills",
    title: "Kohlman Evaluation of Living Skills (KELS)",
    category: "Functional Assessment",
    seoTitle: "Kohlman Evaluation of Living Skills (KELS) — OT Encyclopedia",
    seoDescription: "Guide to KELS, an occupational therapy assessment evaluating the ability to live safely and independently in the community.",
    seoKeywords: ["KELS", "living skills assessment", "community living", "occupational therapy"],
    overview: "The Kohlman Evaluation of Living Skills (KELS) is a criterion-referenced assessment designed to evaluate a person's ability to live independently and safely in the community. It assesses 18 tasks across five domains: self-care, safety and health, money management, transportation and telephone use, and work and leisure.",
    mechanismPhysiology: "KELS measures functional performance and knowledge required for independent community living, combining observation of task performance with interview-based assessment of knowledge and problem-solving ability.",
    clinicalRelevance: "Commonly used in acute psychiatric settings and discharge planning, KELS helps determine readiness for community living, identifies specific skill deficits requiring intervention, and supports disposition planning.",
    signsSymptoms: "Indicated for clients with psychiatric conditions, cognitive impairments, or developmental disabilities where independent living capacity is in question. Commonly used with individuals transitioning from institutional to community settings.",
    assessment: "Administered through a combination of direct observation and interview, typically taking 30-45 minutes. Each of the 18 items is scored as independent or needs assistance. A score of 6 or more 'needs assistance' ratings suggests the person may need supervised living.",
    management: "OTs use KELS results to develop targeted living skills training programs, make recommendations for level of supervision, and plan community integration services.",
    complications: "May not capture the full complexity of community living demands. Cultural considerations may affect the validity of some items (e.g., money management, transportation). Items may need adaptation for different community contexts.",
    clinicalPearls: [
      "KELS is particularly useful in acute psychiatric discharge planning.",
      "A score of 6+ 'needs assistance' items suggests the need for supervised living.",
      "Can be administered in under an hour, making it practical for busy clinical settings."
    ],
    examPitfalls: [
      "Confusing KELS with IADL assessments — KELS specifically targets community living readiness.",
      "Not recognizing its primary use in psychiatric and cognitive impairment populations."
    ],
    faqJson: [
      { question: "What is the KELS used for?", answer: "KELS evaluates a person's ability to live safely and independently in the community, covering self-care, safety, money management, transportation, and work/leisure skills." },
      { question: "In what settings is KELS most commonly used?", answer: "KELS is most commonly used in acute psychiatric settings for discharge planning and determining the appropriate level of community support." }
    ]
  },
  {
    slug: "occupational-self-assessment",
    title: "Occupational Self Assessment (OSA)",
    category: "Functional Assessment",
    seoTitle: "Occupational Self Assessment (OSA) — OT Encyclopedia",
    seoDescription: "Guide to the OSA, a client-centred self-report tool grounded in the Model of Human Occupation (MOHO).",
    seoKeywords: ["OSA", "Occupational Self Assessment", "MOHO", "client-centred", "self-report"],
    overview: "The Occupational Self Assessment (OSA) is a client-centred, self-report evaluation grounded in the Model of Human Occupation (MOHO). It allows clients to rate their own occupational competence and the importance of various everyday activities, helping OTs collaboratively set goals aligned with client values and priorities.",
    mechanismPhysiology: "Based on MOHO, the OSA captures the client's volition (motivation), habituation (roles and routines), and performance capacity as experienced subjectively. It measures both perceived competence and the personal value placed on each occupation.",
    clinicalRelevance: "The OSA empowers clients in the goal-setting process, supports client-centred practice, and provides outcome data reflecting changes in self-perceived occupational competence. It is widely used in mental health, rehabilitation, and community settings.",
    signsSymptoms: "Appropriate for adolescents and adults across diagnostic groups who can reflect on and report their occupational functioning. Commonly used in mental health recovery, chronic illness management, and transitional services.",
    assessment: "Clients rate 21 items on competence ('I have a lot of difficulty' to 'I do this extremely well') and importance ('not important' to 'most important'). Discrepancies between competence and importance ratings highlight priority areas for intervention. Takes approximately 20 minutes.",
    management: "OTs analyze competence-importance gaps to prioritize goals. Reassessment documents changes in self-perceived occupational competence and satisfaction. Supports development of occupation-based intervention plans.",
    complications: "Requires adequate cognitive and literacy skills for self-report. May reflect distorted self-perception in some psychiatric populations. Cultural considerations may affect how clients rate importance of specific activities.",
    clinicalPearls: [
      "Largest competence-importance gaps indicate the highest priority areas for intervention.",
      "The OSA is one of the most widely used MOHO-based assessments.",
      "Useful for empowering clients in mental health recovery settings."
    ],
    examPitfalls: [
      "Not knowing the OSA is based on MOHO.",
      "Confusing client-rated competence with therapist-observed performance.",
      "Forgetting that both competence AND importance are rated."
    ],
    faqJson: [
      { question: "What theoretical model is the OSA based on?", answer: "The OSA is based on the Model of Human Occupation (MOHO), which considers volition, habituation, and performance capacity." },
      { question: "How does the OSA guide intervention?", answer: "By identifying gaps between how well clients perceive they perform activities and how important those activities are to them, the OSA highlights priority areas for therapy." }
    ]
  },
  {
    slug: "performance-assessment-of-self-care-skills",
    title: "Performance Assessment of Self-Care Skills (PASS)",
    category: "Functional Assessment",
    seoTitle: "Performance Assessment of Self-Care Skills (PASS) — OT Encyclopedia",
    seoDescription: "Guide to the PASS assessment in OT, measuring independence, safety, and adequacy in functional task performance.",
    seoKeywords: ["PASS", "self-care assessment", "functional performance", "OT assessment"],
    overview: "The Performance Assessment of Self-Care Skills (PASS) is a criterion-referenced, observation-based assessment that evaluates functional task performance in three dimensions: independence, safety, and adequacy of outcome. It includes 26 tasks across functional mobility, personal self-care, and IADL domains, administered in clinic or home settings.",
    mechanismPhysiology: "PASS captures not just whether a task is completed, but how independently, safely, and adequately it is performed. This multi-dimensional scoring provides richer functional data than dichotomous (pass/fail) measures.",
    clinicalRelevance: "PASS is valuable for discharge planning, home safety assessment, and documenting functional outcomes. Its inclusion of safety scoring makes it particularly useful for populations at risk for falls or injury during daily tasks.",
    signsSymptoms: "Appropriate for adults and older adults with conditions affecting functional performance, including stroke, dementia, orthopedic conditions, and general deconditioning.",
    assessment: "Clients perform selected tasks while the OT observes and scores independence (0-3), safety (0-3), and adequacy (0-3) for each task. The clinic version includes simulated tasks; the home version uses the actual home environment for ecological validity. Administration takes 1.5-3 hours depending on the number of tasks.",
    management: "OTs use PASS results to identify specific task components requiring intervention, plan targeted training, assess home safety, and make recommendations for adaptive equipment or environmental modifications.",
    complications: "Lengthy administration time may limit practical use. Clinic-based administration may not fully reflect home performance. Requires standardized training for reliable scoring.",
    clinicalPearls: [
      "The home version provides greater ecological validity than the clinic version.",
      "Safety scoring makes PASS uniquely useful for fall risk and home safety assessment.",
      "Can guide specific adaptive equipment recommendations based on observed performance."
    ],
    examPitfalls: [
      "Not knowing that PASS scores three dimensions: independence, safety, and adequacy.",
      "Confusing PASS with other ADL assessments that only score independence level."
    ],
    faqJson: [
      { question: "What makes PASS different from other ADL assessments?", answer: "PASS uniquely scores three dimensions — independence, safety, and adequacy — rather than just one, providing a more comprehensive picture of functional performance." },
      { question: "Can PASS be used in the home setting?", answer: "Yes, PASS has a home version that assesses task performance in the client's actual living environment, providing greater ecological validity." }
    ]
  },
  {
    slug: "model-of-human-occupation-screening-tool",
    title: "MOHO Screening Tool (MOHOST)",
    category: "Functional Assessment",
    seoTitle: "MOHO Screening Tool (MOHOST) — OT Encyclopedia",
    seoDescription: "Guide to the MOHOST assessment based on the Model of Human Occupation, used for screening occupational participation.",
    seoKeywords: ["MOHOST", "MOHO", "screening tool", "occupational participation", "OT assessment"],
    overview: "The Model of Human Occupation Screening Tool (MOHOST) is a therapist-rated assessment designed to provide an overview of a client's occupational participation. Based on the Model of Human Occupation (MOHO), it covers six conceptual areas: motivation for occupation, pattern of occupation, communication and interaction skills, process skills, motor skills, and environment.",
    mechanismPhysiology: "MOHOST operationalizes MOHO concepts to assess volition, habituation, skills, and environment. It provides a profile of strengths and challenges across the occupation-person-environment interaction.",
    clinicalRelevance: "MOHOST is used as an initial screening to identify areas requiring further assessment, as a general measure of occupational participation, and as an outcome measure. It is practical for settings where comprehensive assessment is not feasible.",
    signsSymptoms: "Suitable for any client population where occupational participation needs to be quickly evaluated, including acute mental health, forensic settings, and rehabilitation.",
    assessment: "The therapist rates 24 items across six sections using a 4-point scale (F = Facilitates, A = Allows, I = Inhibits, R = Restricts). Information can be gathered through observation, interview, or chart review. Takes 20-30 minutes.",
    management: "OTs use MOHOST results to prioritize assessment needs, plan interventions targeting areas rated as 'inhibiting' or 'restricting,' and track changes in overall occupational participation.",
    complications: "As a screening tool, it may lack the depth needed for detailed intervention planning. Therapist bias may influence ratings. Not designed for use as the sole assessment tool.",
    clinicalPearls: [
      "MOHOST is ideal for initial screening in acute settings where time is limited.",
      "Items rated 'I' (Inhibits) or 'R' (Restricts) should trigger more detailed assessment.",
      "Can be completed using multiple information sources, not just direct observation."
    ],
    examPitfalls: [
      "Confusing MOHOST with the OSA — MOHOST is therapist-rated, OSA is client-rated.",
      "Not recognizing it covers environment as one of six assessment domains."
    ],
    faqJson: [
      { question: "What does MOHOST stand for?", answer: "MOHOST stands for Model of Human Occupation Screening Tool, a therapist-rated assessment of occupational participation." },
      { question: "How is MOHOST different from the OSA?", answer: "MOHOST is rated by the therapist based on observation and interview, while the OSA is a client self-report tool. Both are based on MOHO." }
    ]
  },
  {
    slug: "interest-checklist",
    title: "Interest Checklist",
    category: "Functional Assessment",
    seoTitle: "Interest Checklist — OT Encyclopedia",
    seoDescription: "Guide to the Interest Checklist used in occupational therapy to identify leisure interests and activity engagement patterns.",
    seoKeywords: ["interest checklist", "leisure assessment", "activity interests", "OT assessment"],
    overview: "The Interest Checklist is a self-report tool used in occupational therapy to identify clients' patterns of interest in a wide range of activities. Originally developed by Matsutsuyu and later modified by Kielhofner and Neville, it covers approximately 68 activities across various categories. Clients indicate their level of interest (strong, casual, or no interest) and whether they have participated in the activity in the past 10 years, currently, or wish to in the future.",
    mechanismPhysiology: "Grounded in MOHO, the Interest Checklist captures volition — specifically personal causation and interests — as drivers of occupational engagement. Interest patterns reveal motivation, values, and potential therapeutic activities.",
    clinicalRelevance: "Used to facilitate discussion about meaningful activities, plan leisure-based interventions, and identify changes in interest patterns associated with illness or disability. Particularly valuable in mental health, geriatric, and rehabilitation settings.",
    signsSymptoms: "Appropriate for clients experiencing decreased engagement, loss of roles, depression, or difficulty identifying meaningful activities.",
    assessment: "Self-administered checklist; clients mark interest level and participation history for each activity. No scoring algorithm — results are analyzed qualitatively to identify themes, lost interests, and potential therapeutic activities.",
    management: "OTs use the Interest Checklist to select meaningful therapeutic activities, develop leisure plans, identify goals related to occupational engagement, and monitor changes in interest patterns over time.",
    complications: "Activities listed may not reflect diverse cultural backgrounds. Some clients may need assistance completing the checklist due to literacy or cognitive limitations.",
    clinicalPearls: [
      "Use the checklist as a conversation starter to explore the meaning behind activity preferences.",
      "Compare past and current interest patterns to identify the impact of illness on occupational engagement.",
      "Particularly useful for graded activity planning in mental health settings."
    ],
    examPitfalls: [
      "Expecting a quantitative score — the Interest Checklist is analyzed qualitatively.",
      "Not recognizing its connection to MOHO and the concept of volition."
    ],
    faqJson: [
      { question: "What does the Interest Checklist assess?", answer: "It identifies patterns of interest in a variety of activities, helping OTs understand client motivation and plan meaningful therapeutic interventions." },
      { question: "Is the Interest Checklist scored numerically?", answer: "No, the Interest Checklist is analyzed qualitatively to identify interest themes and changes in occupational engagement." }
    ]
  },
  {
    slug: "role-checklist",
    title: "Role Checklist",
    category: "Functional Assessment",
    seoTitle: "Role Checklist — OT Encyclopedia",
    seoDescription: "Guide to the Role Checklist in OT, assessing perceived role incumbency and value across life roles.",
    seoKeywords: ["role checklist", "occupational roles", "MOHO", "role assessment", "OT"],
    overview: "The Role Checklist is a self-report assessment that identifies the roles a client has held in the past, currently holds, and desires to hold in the future, along with the perceived value of each role. Based on MOHO, it covers 10 roles: student, worker, volunteer, caregiver, home maintainer, friend, family member, religious participant, hobbyist/amateur, and participant in organizations.",
    mechanismPhysiology: "Roles are conceptualized within MOHO as a component of habituation, providing structure and meaning to daily life. Role loss or disruption significantly impacts occupational identity and well-being.",
    clinicalRelevance: "Identifies role loss, role disruption, and role aspirations, helping OTs understand the impact of illness or disability on occupational identity. Critical for transition planning, return-to-work programs, and mental health recovery.",
    signsSymptoms: "Appropriate for any client experiencing role disruption due to injury, illness, life transition, or disability.",
    assessment: "Clients indicate for each of 10 roles whether they held the role in the past, hold it currently, and desire to hold it in the future. They also rate the value of each role (not at all valuable, somewhat valuable, very valuable). Administration takes 10-15 minutes.",
    management: "OTs use the results to set goals related to role resumption, explore meaningful role alternatives, and plan graduated return to valued roles.",
    complications: "Some roles may not be culturally relevant for all clients. Self-report nature means results reflect perception, which may differ from actual role performance.",
    clinicalPearls: [
      "Look for discrepancies between past roles and future desired roles to identify therapeutic goals.",
      "Role loss is a significant predictor of depression and decreased life satisfaction.",
      "The Role Checklist version 3 includes role satisfaction ratings."
    ],
    examPitfalls: [
      "Not knowing the Role Checklist is based on MOHO.",
      "Confusing role incumbency (having a role) with role competence (performing a role well)."
    ],
    faqJson: [
      { question: "What does the Role Checklist measure?", answer: "It measures perceived role incumbency (past, present, future) and the value a client places on 10 life roles." },
      { question: "Why is role assessment important in OT?", answer: "Roles provide structure, meaning, and identity. Understanding role disruption helps OTs address the occupational impact of illness or disability." }
    ]
  },
  {
    slug: "nine-hole-peg-test",
    title: "Nine-Hole Peg Test (9-HPT)",
    category: "Functional Assessment",
    seoTitle: "Nine-Hole Peg Test — OT Encyclopedia",
    seoDescription: "Guide to the Nine-Hole Peg Test, a standardized measure of finger dexterity used in occupational therapy.",
    seoKeywords: ["nine-hole peg test", "9-HPT", "dexterity assessment", "fine motor", "OT assessment"],
    overview: "The Nine-Hole Peg Test (9-HPT) is a standardized, timed assessment of finger dexterity. The client places nine pegs into nine holes on a pegboard and then removes them as quickly as possible. Time to complete is recorded for each hand separately. It is one of the most commonly used measures of manual dexterity in rehabilitation research and clinical practice.",
    mechanismPhysiology: "The 9-HPT primarily measures fine motor dexterity involving precise finger manipulation, grip, and release patterns. It requires intact motor planning, visual-motor integration, and adequate grip and pinch strength.",
    clinicalRelevance: "Widely used in stroke rehabilitation, multiple sclerosis assessment, and hand therapy. The 9-HPT is a component of the Multiple Sclerosis Functional Composite (MSFC) and is used to document upper extremity dexterity outcomes.",
    signsSymptoms: "Indicated for assessment of fine motor deficits in conditions such as stroke, MS, traumatic brain injury, peripheral neuropathy, and hand injuries.",
    assessment: "Standardized administration: pegs are placed in a container, and the client picks up one peg at a time, places all nine in the pegboard holes, then removes them one at a time. The dominant and non-dominant hands are tested separately. Time is measured in seconds. Age- and sex-specific normative data is available.",
    management: "OTs use 9-HPT results to quantify dexterity deficits, set treatment goals for fine motor rehabilitation, track progress over time, and compare performance to normative data. Serial testing documents the effectiveness of interventions targeting fine motor function.",
    complications: "Does not assess functional hand use in context. Timed nature may increase anxiety. Floor effects may limit usefulness in severely impaired clients who cannot place any pegs.",
    clinicalPearls: [
      "Always test both hands separately — inter-hand differences are clinically meaningful.",
      "Normative data varies significantly by age and sex — always compare to appropriate norms.",
      "The 9-HPT is included in the MSFC as the measure of upper extremity function."
    ],
    examPitfalls: [
      "Not knowing the 9-HPT measures dexterity, not grip strength.",
      "Forgetting to test both hands and compare results.",
      "Confusing the 9-HPT with the Purdue Pegboard Test."
    ],
    faqJson: [
      { question: "What does the Nine-Hole Peg Test measure?", answer: "It measures finger dexterity and fine motor speed by timing how quickly a client can place and remove nine pegs from a pegboard." },
      { question: "How is the 9-HPT scored?", answer: "Scoring is based on the time in seconds to complete the task for each hand, compared to age- and sex-matched normative data." }
    ]
  },
  {
    slug: "box-and-block-test",
    title: "Box and Block Test",
    category: "Functional Assessment",
    seoTitle: "Box and Block Test — OT Encyclopedia",
    seoDescription: "Guide to the Box and Block Test, measuring gross manual dexterity in occupational therapy.",
    seoKeywords: ["box and block test", "gross dexterity", "manual dexterity", "OT assessment"],
    overview: "The Box and Block Test (BBT) is a standardized assessment of gross manual dexterity. The client transfers as many 1-inch wooden blocks as possible from one compartment of a divided box to another within 60 seconds. Each hand is tested separately. The score is the number of blocks transferred.",
    mechanismPhysiology: "The BBT measures gross manual dexterity involving grasp, transport, and release patterns. It requires adequate grip strength, motor coordination, and sustained attention for the timed trial.",
    clinicalRelevance: "Widely used in stroke rehabilitation, hand therapy, and upper extremity orthopedic assessment. Its simplicity makes it suitable for diverse populations including those with cognitive impairments.",
    signsSymptoms: "Indicated for clients with stroke, traumatic brain injury, upper extremity injuries, and neuromuscular conditions affecting manual dexterity.",
    assessment: "The client sits at a table with the box positioned at midline. After a 15-second practice trial, the client transfers blocks one at a time for 60 seconds per hand. Normative data is available for ages 6-89. Both hands are tested.",
    management: "OTs use BBT scores to quantify dexterity deficits, set measurable treatment goals, track functional recovery, and compare performance bilaterally and against norms.",
    complications: "Measures only one component of hand function (gross dexterity). May not correlate with complex functional hand use. Ceiling effects possible in higher-functioning individuals.",
    clinicalPearls: [
      "Simple and quick to administer — excellent for serial assessment.",
      "Compare bilateral performance to identify the magnitude of impairment.",
      "Norms exist for ages 6-89, making it useful across the lifespan."
    ],
    examPitfalls: [
      "Confusing gross dexterity (BBT) with fine dexterity (9-HPT).",
      "Not recognizing the 60-second timed trial format."
    ],
    faqJson: [
      { question: "What does the Box and Block Test measure?", answer: "It measures gross manual dexterity by counting the number of blocks a person can transfer from one compartment to another in 60 seconds." },
      { question: "How is the Box and Block Test scored?", answer: "The score is the number of blocks transferred in 60 seconds for each hand, compared to age-matched normative data." }
    ]
  },
  {
    slug: "jebsen-taylor-hand-function-test",
    title: "Jebsen-Taylor Hand Function Test",
    category: "Functional Assessment",
    seoTitle: "Jebsen-Taylor Hand Function Test — OT Encyclopedia",
    seoDescription: "Guide to the Jebsen-Taylor Hand Function Test, a standardized measure of hand function used in OT practice.",
    seoKeywords: ["Jebsen-Taylor", "hand function test", "OT assessment", "upper extremity function"],
    overview: "The Jebsen-Taylor Hand Function Test (JTHFT) is a standardized assessment of hand function using seven subtests that simulate everyday activities: writing, card turning, picking up small objects, simulated feeding, stacking checkers, picking up large light objects, and picking up large heavy objects. Each subtest is timed separately for dominant and non-dominant hands.",
    mechanismPhysiology: "The JTHFT measures functional hand use by assessing speed and dexterity across a range of grips and manipulation patterns used in daily activities, including palmar grasp, lateral pinch, and tip pinch.",
    clinicalRelevance: "Provides a comprehensive assessment of hand function relevant to daily activities. Used in hand therapy, stroke rehabilitation, and research. Normative data available for comparison across age and sex groups.",
    signsSymptoms: "Appropriate for clients with hand injuries, stroke, peripheral neuropathy, arthritis, and other conditions affecting hand function.",
    assessment: "Seven subtests administered sequentially. Each subtest is timed and performed with both hands separately (non-dominant first). Total time for all subtests and individual subtest times are recorded and compared to normative data.",
    management: "OTs use JTHFT results to identify specific hand function deficits, guide targeted intervention, track functional recovery, and demonstrate outcomes objectively.",
    complications: "Timed format may not capture quality of movement. Writing subtest may be biased by literacy level. Some subtests may have ceiling effects in mild impairment.",
    clinicalPearls: [
      "Non-dominant hand is always tested first to serve as a practice trial.",
      "The seven subtests represent a range of grip patterns commonly used in daily life.",
      "Widely used as an outcome measure in hand therapy research."
    ],
    examPitfalls: [
      "Not knowing which hand is tested first (non-dominant).",
      "Confusing the JTHFT with assessments of grip strength (it measures function, not strength)."
    ],
    faqJson: [
      { question: "What does the Jebsen-Taylor Test assess?", answer: "It assesses functional hand use across seven subtests simulating everyday tasks like writing, feeding, and object manipulation." },
      { question: "How many subtests does the Jebsen-Taylor include?", answer: "Seven subtests: writing, card turning, small object pickup, simulated feeding, stacking checkers, large light object pickup, and large heavy object pickup." }
    ]
  },
  {
    slug: "allen-cognitive-level-screen",
    title: "Allen Cognitive Level Screen (ACLS)",
    category: "Functional Assessment",
    seoTitle: "Allen Cognitive Level Screen (ACLS) — OT Encyclopedia",
    seoDescription: "Guide to the Allen Cognitive Level Screen, a leather lacing task assessing cognitive processing in OT.",
    seoKeywords: ["ACLS", "Allen Cognitive Level", "cognitive screening", "leather lacing", "OT assessment"],
    overview: "The Allen Cognitive Level Screen (ACLS) is a standardized screening tool that uses a leather lacing task to assess cognitive processing capacity. Based on Claudia Allen's Cognitive Disabilities Model, it provides a quick estimate of cognitive level on a 6-point scale (levels 0.8 to 5.8) that predicts a person's ability to function in daily activities, work, and social situations.",
    mechanismPhysiology: "The ACLS measures cognitive processing by observing how a person learns and performs three increasingly complex leather lacing stitches (running stitch, whipstitch, and single cordovan stitch). Performance reflects information processing capacity, learning ability, and motor planning.",
    clinicalRelevance: "Used extensively in psychiatric, geriatric, and neurological settings to determine the level of assistance needed, predict safety risks, and guide activity analysis for intervention planning. Cognitive levels correlate with functional abilities and supervision needs.",
    signsSymptoms: "Appropriate for adults with suspected or known cognitive impairment, including dementia, psychiatric conditions, traumatic brain injury, and developmental disabilities.",
    assessment: "The client is shown three leather stitches of increasing complexity and asked to imitate them. Scoring is based on the highest stitch completed correctly. Cognitive levels range from 0.8 (coma) to 5.8 (normal). Levels 3.0-4.0 indicate the need for structured assistance in daily activities.",
    management: "OTs use ACLS results to match task demands to cognitive capacity (activity analysis), determine appropriate levels of supervision, design therapeutic activities within the person's cognitive range, and educate caregivers about realistic functional expectations.",
    complications: "The leather lacing task may not be culturally relevant for all populations. Motor impairments in the hands may invalidate results. Should be supplemented with additional assessments (e.g., LACLS, CPT) for comprehensive cognitive profiling.",
    clinicalPearls: [
      "Cognitive level 4.0 is a critical threshold — below this level, 24-hour supervision is typically recommended.",
      "The Large Allen Cognitive Level Screen (LACLS) is an adapted version for clients with visual or motor impairments.",
      "Use the Allen Diagnostic Module (ADM) for more detailed assessment following ACLS screening."
    ],
    examPitfalls: [
      "Not knowing the ACLS uses leather lacing as the assessment task.",
      "Confusing Allen Cognitive Levels with other cognitive screening scores (e.g., MMSE).",
      "Forgetting that level 4.0 is the threshold for 24-hour supervision recommendations."
    ],
    faqJson: [
      { question: "What does the ACLS assess?", answer: "The ACLS screens cognitive processing capacity using a leather lacing task, placing individuals on a 6-point cognitive level scale that predicts functional abilities." },
      { question: "What Allen Cognitive Level requires 24-hour supervision?", answer: "Individuals scoring below cognitive level 4.0 typically require 24-hour supervision for safety." }
    ]
  },
  {
    slug: "sensory-profile",
    title: "Sensory Profile",
    category: "Functional Assessment",
    seoTitle: "Sensory Profile Assessment — OT Encyclopedia",
    seoDescription: "Guide to the Sensory Profile, a standardized assessment of sensory processing patterns used across the lifespan in OT.",
    seoKeywords: ["Sensory Profile", "sensory processing", "Dunn model", "OT assessment", "sensory modulation"],
    overview: "The Sensory Profile is a family of standardized questionnaires developed by Winnie Dunn that measure an individual's sensory processing patterns and their effect on functional performance. Versions exist for infants (0-6 months), toddlers (7-35 months), children (3-14 years), adolescents/adults (11+), and older adults. The assessment identifies patterns of sensory processing across four quadrants: low registration, sensation seeking, sensory sensitivity, and sensation avoiding.",
    mechanismPhysiology: "Based on Dunn's Model of Sensory Processing, the Sensory Profile maps neurological thresholds (high vs. low) against behavioral responses (passive vs. active) to create four quadrants. This framework explains how individuals process and respond to sensory input in daily life.",
    clinicalRelevance: "The Sensory Profile helps OTs understand how sensory processing affects participation in daily activities, school performance, social interaction, and self-regulation. It guides sensory-based intervention planning and environmental modifications.",
    signsSymptoms: "Indicated for individuals presenting with sensory over- or under-responsivity, difficulty with self-regulation, behavioral challenges, attention difficulties, or decreased participation in daily activities potentially related to sensory processing differences.",
    assessment: "Caregivers or the individual complete a questionnaire rating the frequency of specific behavioral responses to sensory events. Responses are scored and plotted across sensory processing quadrants and sensory system categories. Results are compared to normative data and classified as typical, probable difference, or definite difference.",
    management: "OTs use Sensory Profile results to design sensory diets, modify environments, educate caregivers about sensory needs, develop self-regulation strategies, and create individualized intervention plans addressing specific sensory processing patterns.",
    complications: "As a caregiver-report measure, results may be influenced by reporter bias. Cultural differences in sensory expectations may affect interpretation. Should be combined with clinical observation for comprehensive assessment.",
    clinicalPearls: [
      "Dunn's four quadrants: Low Registration (high threshold/passive), Sensation Seeking (high threshold/active), Sensory Sensitivity (low threshold/passive), Sensation Avoiding (low threshold/active).",
      "The Adolescent/Adult Sensory Profile is a self-report measure.",
      "Sensory Profile results should always be interpreted in the context of functional performance and participation."
    ],
    examPitfalls: [
      "Not knowing Dunn's four-quadrant model of sensory processing.",
      "Confusing the Sensory Profile (questionnaire) with the Sensory Integration and Praxis Tests (SIPT), which is performance-based.",
      "Not recognizing that different versions exist for different age groups."
    ],
    faqJson: [
      { question: "What are Dunn's four sensory processing quadrants?", answer: "Low Registration, Sensation Seeking, Sensory Sensitivity, and Sensation Avoiding — based on the interaction of neurological thresholds and behavioral responses." },
      { question: "Who completes the Sensory Profile?", answer: "For children, caregivers complete the questionnaire. For adolescents and adults, the individual self-reports. The OT interprets the results." }
    ]
  },
  // ===== UPPER EXTREMITY REHABILITATION (12 entries) =====
  {
    slug: "shoulder-rehabilitation",
    title: "Shoulder Rehabilitation in OT",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Shoulder Rehabilitation in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Comprehensive guide to occupational therapy shoulder rehabilitation techniques, including rotator cuff protocols and functional recovery.",
    seoKeywords: ["shoulder rehabilitation", "rotator cuff", "occupational therapy", "upper extremity rehab"],
    overview: "Shoulder rehabilitation in occupational therapy focuses on restoring functional use of the upper extremity following injury, surgery, or disease affecting the shoulder complex. OTs address the shoulder within the context of functional activities, emphasizing restoration of ADL performance, work tasks, and leisure participation. Common conditions include rotator cuff tears, shoulder impingement, frozen shoulder (adhesive capsulitis), shoulder arthroplasty, and fractures.",
    mechanismPhysiology: "The shoulder complex consists of four joints: glenohumeral, acromioclavicular, sternoclavicular, and scapulothoracic. The rotator cuff (supraspinatus, infraspinatus, teres minor, subscapularis) provides dynamic stability. Rehabilitation addresses the interplay between mobility, stability, and neuromuscular control.",
    clinicalRelevance: "OTs play a critical role in shoulder rehabilitation by connecting impairment-level treatment with functional outcomes. Unlike isolated exercise programs, OT interventions integrate shoulder movement into meaningful activities, address compensatory strategies, and modify tasks and environments to support participation.",
    signsSymptoms: "Pain with overhead activities, limited range of motion, weakness in reaching and lifting, difficulty with dressing (especially donning shirts and jackets), grooming activities, and work tasks requiring shoulder elevation.",
    assessment: "Goniometric ROM measurement, manual muscle testing, pain assessment (VAS/NRS), functional upper extremity assessments (DASH, QuickDASH), palpation, special tests (Neer, Hawkins-Kennedy, Empty Can), and ADL performance observation.",
    management: "Graded therapeutic activities progressing from PROM to AROM to resistive activities. Functional training in dressing, grooming, bathing, and instrumental tasks. Joint protection education, energy conservation, and activity modification. Modalities as adjuncts (heat, cold, TENS). Home exercise programs integrated into daily routines.",
    complications: "Adhesive capsulitis from immobilization, rotator cuff re-tear, chronic pain syndromes, complex regional pain syndrome (CRPS), deltoid detachment following reverse total shoulder arthroplasty.",
    clinicalPearls: [
      "Always assess scapular mechanics — scapulohumeral rhythm is critical for overhead function.",
      "After rotator cuff repair, follow surgeon-specific protocols for weight-bearing and ROM progression.",
      "Integrate therapeutic exercises into meaningful functional activities to promote carryover."
    ],
    examPitfalls: [
      "Ignoring scapulothoracic dysfunction when treating shoulder pain.",
      "Not following post-surgical precautions specific to the surgical approach used.",
      "Focusing solely on ROM without addressing functional use of the extremity."
    ],
    faqJson: [
      { question: "What is the OT's role in shoulder rehabilitation?", answer: "OTs restore functional use of the shoulder by integrating rehabilitation into meaningful daily activities, modifying tasks, recommending adaptive equipment, and teaching compensatory strategies." },
      { question: "How long does shoulder rehabilitation typically take?", answer: "Recovery timelines vary by condition: rotator cuff repairs typically require 4-6 months, frozen shoulder may take 12-18 months, and post-fracture rehabilitation usually spans 6-12 weeks." }
    ]
  },
  {
    slug: "elbow-rehabilitation",
    title: "Elbow Rehabilitation in OT",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Elbow Rehabilitation in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy elbow rehabilitation for fractures, epicondylitis, and post-surgical recovery.",
    seoKeywords: ["elbow rehabilitation", "lateral epicondylitis", "elbow fracture", "OT rehabilitation"],
    overview: "Elbow rehabilitation in OT addresses conditions including fractures (supracondylar, radial head, olecranon), epicondylitis (lateral and medial), elbow dislocation, post-surgical management (ORIF, arthroplasty), and contractures. OTs focus on restoring the functional arc of motion (30-130° flexion, 50° pronation/supination) needed for ADL performance.",
    mechanismPhysiology: "The elbow is a complex hinge joint (humeroulnar) combined with a pivot joint (radioulnar) allowing flexion-extension and pronation-supination. The carrying angle, collateral ligaments, and dynamic stabilizers (biceps, triceps, forearm musculature) contribute to joint stability and function.",
    clinicalRelevance: "OTs address elbow dysfunction in the context of feeding, grooming, hygiene, dressing, and work tasks. The elbow's functional arc is critical for bringing the hand to the face and body. Loss of elbow motion significantly impacts independence in self-care.",
    signsSymptoms: "Limited flexion or extension, pain with gripping or lifting, weakness in pronation/supination, difficulty with self-feeding, grooming, and reaching tasks.",
    assessment: "Goniometric ROM (flexion, extension, pronation, supination), grip strength (dynamometer), pinch strength, pain assessment, functional task observation, and DASH/QuickDASH questionnaire.",
    management: "Progressive mobilization protocols, static progressive or dynamic splinting for contractures, activity modification for epicondylitis, strengthening through graded activities, ergonomic assessment for work-related conditions, and adaptive equipment recommendations.",
    complications: "Heterotopic ossification (especially post-fracture), elbow stiffness and contracture, ulnar nerve neuropathy, chronic lateral epicondylitis, re-fracture or hardware failure.",
    clinicalPearls: [
      "Functional arc of the elbow is 30-130° flexion with 50° pronation and supination.",
      "Avoid passive stretching in the early post-fracture period to prevent heterotopic ossification.",
      "For lateral epicondylitis, address ergonomic factors and grip patterns, not just the elbow."
    ],
    examPitfalls: [
      "Not knowing the functional arc of elbow motion.",
      "Aggressive PROM after elbow fracture can trigger heterotopic ossification.",
      "Focusing only on flexion-extension without addressing pronation-supination."
    ],
    faqJson: [
      { question: "What is the functional arc of the elbow?", answer: "The functional arc is 30-130° of flexion and 50° each of pronation and supination, the range needed for most ADL tasks." },
      { question: "What causes lateral epicondylitis?", answer: "Lateral epicondylitis (tennis elbow) results from overuse and repetitive stress to the wrist extensor muscles at their common origin on the lateral epicondyle." }
    ]
  },
  {
    slug: "wrist-rehabilitation",
    title: "Wrist Rehabilitation in OT",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Wrist Rehabilitation in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT wrist rehabilitation including fractures, carpal tunnel syndrome, and post-surgical management.",
    seoKeywords: ["wrist rehabilitation", "carpal tunnel", "distal radius fracture", "wrist splinting", "OT"],
    overview: "Wrist rehabilitation in OT addresses distal radius fractures, scaphoid fractures, carpal tunnel syndrome, de Quervain's tenosynovitis, wrist sprains, and post-surgical conditions (ORIF, carpal tunnel release). OTs restore functional wrist motion, grip strength, and hand dexterity for ADL performance.",
    mechanismPhysiology: "The wrist consists of the radiocarpal and midcarpal joints, allowing flexion-extension and radial-ulnar deviation. The carpal tunnel houses the median nerve and nine flexor tendons. The wrist's stability and mobility are essential for effective hand function.",
    clinicalRelevance: "Wrist function is critical for grip, tool use, self-care, writing, and fine motor tasks. OTs address wrist dysfunction holistically, considering the impact on the entire kinetic chain and functional performance.",
    signsSymptoms: "Pain with gripping or lifting, limited wrist ROM, decreased grip strength, numbness and tingling in the median nerve distribution (carpal tunnel), swelling, and difficulty with daily tasks requiring wrist motion.",
    assessment: "Goniometric wrist ROM, grip dynamometry, pinch strength, Phalen's and Tinel's tests, Semmes-Weinstein monofilament testing, DASH questionnaire, functional grip and manipulation assessment.",
    management: "Custom or prefabricated wrist splinting, graded strengthening programs, tendon gliding exercises, nerve gliding exercises, desensitization, activity modification, ergonomic education, and progressive return to functional activities.",
    complications: "Malunion of fractures, CRPS, median nerve compression (carpal tunnel), tendon adhesions, wrist stiffness, chronic pain.",
    clinicalPearls: [
      "Functional wrist motion is approximately 40° flexion, 40° extension, 10° radial deviation, and 15° ulnar deviation.",
      "Tendon gliding exercises are essential after flexor tendon repair and for carpal tunnel management.",
      "Custom wrist splints should position the wrist in slight extension (10-15°) for most conditions."
    ],
    examPitfalls: [
      "Not distinguishing between carpal tunnel syndrome and cervical radiculopathy.",
      "Forgetting to assess the DRUJ (distal radioulnar joint) with distal radius fractures.",
      "Ignoring proximal contributions to wrist dysfunction."
    ],
    faqJson: [
      { question: "What is the most common wrist fracture?", answer: "The distal radius fracture (Colles' fracture) is the most common wrist fracture, often resulting from a fall on an outstretched hand." },
      { question: "How does OT help with carpal tunnel syndrome?", answer: "OTs provide custom splinting, nerve gliding exercises, ergonomic modifications, activity analysis, and conservative management strategies to reduce symptoms and improve function." }
    ]
  },
  {
    slug: "tendon-repair-rehabilitation",
    title: "Tendon Repair Rehabilitation",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Tendon Repair Rehabilitation in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy management of flexor and extensor tendon repairs including protocols and splinting.",
    seoKeywords: ["tendon repair", "flexor tendon", "extensor tendon", "hand therapy", "OT rehabilitation"],
    overview: "Tendon repair rehabilitation is a specialized area of OT/hand therapy involving structured protocols for managing flexor and extensor tendon repairs of the hand and wrist. Post-operative management follows specific protocols (early active motion, early passive motion, or immobilization) based on the zone of injury, repair strength, and surgeon preference.",
    mechanismPhysiology: "Tendon healing progresses through inflammatory (0-5 days), proliferative (5-28 days), and remodeling (28+ days) phases. Early controlled motion promotes intrinsic tendon healing, reduces adhesion formation, and improves ultimate tendon excursion and strength.",
    clinicalRelevance: "OTs/hand therapists are the primary providers of post-operative tendon rehabilitation. The quality of rehabilitation directly impacts outcomes including tendon excursion, finger ROM, grip strength, and functional hand use. Expertise in splinting and protocol management is essential.",
    signsSymptoms: "Post-repair presentations include limited finger motion, surgical wound, edema, pain, and inability to actively flex or extend affected digits depending on the repair type.",
    assessment: "Total active motion (TAM), total passive motion (TPM), wound assessment, edema measurement, pain assessment, tendon excursion testing, and functional hand use assessment. Strickland classification for flexor tendon outcomes.",
    management: "Protocol-based rehabilitation including protective splinting (dorsal blocking for flexors, volar-based for extensors), controlled motion programs, scar management, edema control, tendon gliding exercises, progressive strengthening, and functional activity integration. Protocols vary by zone and repair type.",
    complications: "Tendon rupture (most feared complication), adhesion formation, joint contracture, swan neck or boutonniere deformity (extensor), triggering, bowstringing, quadriga effect.",
    clinicalPearls: [
      "Zone II flexor repairs ('no man's land') are the most challenging due to the tendon sheath and pulley system.",
      "Early active motion protocols generally produce better outcomes than immobilization protocols.",
      "Never apply resistive exercises before 8-12 weeks post-repair without surgeon clearance."
    ],
    examPitfalls: [
      "Not knowing the zones of flexor and extensor tendon injury.",
      "Confusing dorsal blocking splint (flexor) with volar splint (extensor) positioning.",
      "Applying resistance too early and risking tendon rupture."
    ],
    faqJson: [
      { question: "What is the most common complication after tendon repair?", answer: "Adhesion formation is the most common complication, limiting tendon glide and finger motion. Tendon rupture is the most feared complication." },
      { question: "Why is early motion important after tendon repair?", answer: "Controlled early motion promotes intrinsic tendon healing, prevents adhesion formation, and results in better outcomes for ROM and function than immobilization." }
    ]
  },
  {
    slug: "peripheral-nerve-injury-rehabilitation",
    title: "Peripheral Nerve Injury Rehabilitation",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Peripheral Nerve Injury Rehabilitation in OT — OT Encyclopedia",
    seoDescription: "Guide to OT management of peripheral nerve injuries including sensory re-education, splinting, and functional restoration.",
    seoKeywords: ["peripheral nerve injury", "nerve repair", "sensory re-education", "motor re-education", "OT"],
    overview: "Peripheral nerve injury rehabilitation in OT addresses injuries to nerves of the upper extremity, including the median, ulnar, and radial nerves. Management includes protective positioning, splinting to prevent deformity, sensory re-education, motor re-education, and functional adaptation during the recovery period. The Seddon classification (neurapraxia, axonotmesis, neurotmesis) and Sunderland classification (grades I-V) guide prognosis and management.",
    mechanismPhysiology: "Peripheral nerves regenerate at approximately 1 mm per day (1 inch per month) following Wallerian degeneration. Recovery depends on the severity of injury, proximity to the target muscle, age, and repair timing. Sensory and motor recovery follows a predictable sequence.",
    clinicalRelevance: "OTs manage the functional consequences of nerve injury through the entire recovery process — from acute protective positioning through sensory and motor recovery to functional restoration. Understanding nerve anatomy and recovery patterns is essential for effective intervention.",
    signsSymptoms: "Sensory loss in nerve-specific distributions, motor weakness or paralysis of innervated muscles, clawing (ulnar), wrist drop (radial), ape hand deformity (median), decreased grip and pinch strength, and difficulty with specific functional tasks.",
    assessment: "Semmes-Weinstein monofilament testing, two-point discrimination, manual muscle testing, grip and pinch strength, Tinel's sign progression, functional hand assessment, and ADL performance evaluation.",
    management: "Protective splinting (anti-claw splint for ulnar, wrist extension splint for radial, opponens splint for median), sensory re-education program (Dellon's protocol), motor re-education, tendon transfer rehabilitation, desensitization, adaptive equipment, and activity modification.",
    complications: "Neuroma formation, incomplete recovery, cold intolerance, chronic pain, joint contracture, muscle atrophy, and learned non-use.",
    clinicalPearls: [
      "Nerve regeneration rate is approximately 1 mm/day — use this to estimate recovery timeline based on injury-to-target distance.",
      "Sensory re-education should begin when protective sensation returns (4.31 monofilament detection).",
      "Tinel's sign advancement along the nerve course indicates progressive nerve regeneration."
    ],
    examPitfalls: [
      "Not knowing the motor and sensory distributions of the median, ulnar, and radial nerves.",
      "Confusing the deformities associated with each nerve injury (ape hand, claw hand, wrist drop).",
      "Starting sensory re-education before protective sensation has returned."
    ],
    faqJson: [
      { question: "How fast do peripheral nerves regenerate?", answer: "Peripheral nerves regenerate at approximately 1 mm per day (about 1 inch per month) from the site of injury toward the target muscle or sensory receptor." },
      { question: "What splint is used for radial nerve palsy?", answer: "A wrist extension (dynamic or static progressive) splint is used to support wrist extension and allow functional hand use during nerve recovery." }
    ]
  },
  {
    slug: "edema-management-upper-extremity",
    title: "Edema Management — Upper Extremity",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Edema Management for Upper Extremity in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy edema management techniques for the upper extremity including elevation, compression, and manual edema mobilization.",
    seoKeywords: ["edema management", "upper extremity swelling", "compression therapy", "manual edema mobilization", "OT"],
    overview: "Edema management in occupational therapy addresses swelling of the upper extremity resulting from injury, surgery, lymphedema, or inflammatory conditions. Uncontrolled edema can lead to joint stiffness, pain, decreased function, and tissue fibrosis. OTs use a comprehensive approach including elevation, compression, active ROM, retrograde massage, manual edema mobilization (MEM), and modalities.",
    mechanismPhysiology: "Edema occurs when fluid accumulation in the interstitial space exceeds lymphatic drainage capacity. Causes include increased capillary permeability (inflammation), venous insufficiency, lymphatic obstruction, and decreased oncotic pressure. The hand is particularly vulnerable due to its dependent position and loose dorsal skin.",
    clinicalRelevance: "Effective edema management is essential for successful rehabilitation outcomes. Persistent edema impairs ROM, delays healing, increases pain, and can lead to permanent fibrotic changes. OTs address edema within the context of functional recovery.",
    signsSymptoms: "Visible swelling, pitting or non-pitting edema, joint stiffness, pain, decreased ROM, skin changes, and functional limitations in grasp, pinch, and manipulation.",
    assessment: "Circumferential measurements, volumetric displacement, figure-of-eight measurement (wrist/hand), pitting test, skin assessment, ROM measurement, and functional hand use evaluation.",
    management: "Elevation above heart level, compression garments and wrapping (Coban, isotoner gloves), retrograde massage, manual edema mobilization (MEM), active range of motion exercises (muscle pumping), contrast baths, kinesiology taping, and string wrapping techniques.",
    complications: "Chronic edema leading to fibrosis, CRPS, joint contracture, skin breakdown under compression, and reduced treatment compliance.",
    clinicalPearls: [
      "Early, aggressive edema management prevents fibrosis and long-term stiffness.",
      "Active motion is the most effective physiological method of edema reduction.",
      "Coban wrapping should be applied distally to proximally with consistent tension."
    ],
    examPitfalls: [
      "Not distinguishing between pitting and non-pitting edema — management differs.",
      "Applying compression too tightly, causing a tourniquet effect.",
      "Neglecting edema management while focusing on ROM — both must be addressed simultaneously."
    ],
    faqJson: [
      { question: "Why is edema management important in hand therapy?", answer: "Uncontrolled edema leads to joint stiffness, fibrosis, pain, and decreased function. Early edema management prevents these complications and improves rehabilitation outcomes." },
      { question: "What is manual edema mobilization (MEM)?", answer: "MEM is a gentle massage technique that activates the lymphatic system to facilitate fluid drainage from the affected extremity, combined with active motion and positioning." }
    ]
  },
  {
    slug: "scar-management-upper-extremity",
    title: "Scar Management — Upper Extremity",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Scar Management for Upper Extremity in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy scar management techniques including massage, silicone, compression, and splinting.",
    seoKeywords: ["scar management", "scar remodeling", "silicone gel", "scar massage", "hand therapy"],
    overview: "Scar management in OT addresses hypertrophic scarring, adhesions, and contractures following upper extremity injuries, surgeries, and burns. OTs use evidence-based techniques including scar massage, silicone products, compression, splinting, and functional activities to optimize scar remodeling, prevent contracture, and restore function.",
    mechanismPhysiology: "Scar formation follows wound healing phases: hemostasis, inflammation, proliferation, and remodeling. Collagen deposited during proliferation (Type III) is gradually replaced by mature collagen (Type I) during remodeling (6-18 months). Scar management techniques influence collagen fiber alignment and tissue extensibility.",
    clinicalRelevance: "Scars can restrict tendon glide, limit joint motion, cause pain, and impair hand function. OTs address scars as part of comprehensive rehabilitation, integrating scar management with ROM, strengthening, and functional training.",
    signsSymptoms: "Raised, red, or hypertrophic scars, adherent scars limiting tendon glide, scar contracture restricting joint motion, hypersensitivity, and decreased functional hand use.",
    assessment: "Vancouver Scar Scale, scar pliability and adherence testing, ROM measurement, tendon glide assessment, sensory assessment, and functional performance evaluation.",
    management: "Deep friction massage, silicone gel sheeting and topical silicone, compression garments, serial static splinting for contracture, ultrasound, vibration, desensitization programs, and functional activity engagement.",
    complications: "Keloid formation, chronic hypersensitivity, persistent adhesions, skin breakdown from overly aggressive management.",
    clinicalPearls: [
      "Scar remodeling occurs for up to 18 months — continue intervention throughout this period.",
      "Silicone gel sheeting is the most evidence-supported non-invasive scar treatment.",
      "Scar massage should be performed perpendicular to the scar line to promote collagen remodeling."
    ],
    examPitfalls: [
      "Confusing hypertrophic scars (stay within wound boundaries) with keloids (extend beyond).",
      "Not recognizing that scar remodeling continues for 12-18 months after wound closure."
    ],
    faqJson: [
      { question: "How long does scar remodeling last?", answer: "Scar remodeling continues for approximately 12-18 months after wound closure, during which time intervention can influence scar appearance and function." },
      { question: "What is the best evidence-based scar treatment?", answer: "Silicone gel sheeting has the strongest evidence base for non-invasive scar management, along with compression therapy and scar massage." }
    ]
  },
  {
    slug: "constraint-induced-movement-therapy",
    title: "Constraint-Induced Movement Therapy (CIMT)",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Constraint-Induced Movement Therapy (CIMT) — OT Encyclopedia",
    seoDescription: "Guide to CIMT in occupational therapy for upper extremity rehabilitation after stroke, including modified protocols and evidence.",
    seoKeywords: ["CIMT", "constraint-induced movement therapy", "stroke rehabilitation", "learned non-use", "upper extremity"],
    overview: "Constraint-Induced Movement Therapy (CIMT) is an evidence-based rehabilitation approach that addresses learned non-use of the affected upper extremity after stroke. The protocol involves constraining the less-affected hand with a mitt for 90% of waking hours while engaging in intensive, repetitive, task-specific practice with the affected hand for 6 hours per day over 2-3 weeks.",
    mechanismPhysiology: "CIMT is based on the concept of learned non-use, where the individual develops compensatory reliance on the unaffected hand after stroke. By constraining the unaffected hand and intensively training the affected hand, CIMT drives cortical reorganization through use-dependent neuroplasticity.",
    clinicalRelevance: "CIMT has strong evidence (Level I) for improving upper extremity function in stroke survivors with some active wrist and finger extension. OTs play a key role in implementing CIMT protocols, including task practice, transfer package, and behavioral contracting.",
    signsSymptoms: "Learned non-use of the affected upper extremity, neglect of the affected arm in bilateral activities, overreliance on the unaffected hand for daily tasks, despite having some motor recovery.",
    assessment: "Motor Activity Log (MAL) measuring amount of use and quality of movement, Wolf Motor Function Test (WMFT), Action Research Arm Test (ARAT), active wrist extension (≥20°) and finger extension (≥10°) as inclusion criteria.",
    management: "Traditional CIMT: 6 hours/day task practice + mitt constraint 90% of waking hours for 2-3 weeks. Modified CIMT (mCIMT): reduced intensity (1-3 hours/day) with mitt constraint for 5-6 hours. Transfer package includes behavioral contracting, home diary, and problem-solving for real-world use. Shaping and task practice emphasize repetitive, progressively challenging functional tasks.",
    complications: "Frustration and decreased motivation with intensive protocol, falls risk from mitt constraint, fatigue, and potential for overuse injury. Modified protocols reduce these risks.",
    clinicalPearls: [
      "The transfer package is critical for carryover — improved lab performance without real-world transfer is insufficient.",
      "Modified CIMT protocols (mCIMT) are more practical for most clinical settings and show comparable benefits.",
      "Minimum motor criteria: 20° active wrist extension and 10° active finger extension."
    ],
    examPitfalls: [
      "Not knowing the inclusion criteria (minimum active wrist and finger extension).",
      "Forgetting the transfer package — CIMT is not just about mitt wearing and exercise.",
      "Confusing CIMT with bilateral training approaches."
    ],
    faqJson: [
      { question: "What is learned non-use?", answer: "Learned non-use is a phenomenon where a person stops using the affected arm after stroke because early failed attempts lead to compensatory reliance on the unaffected hand, even as motor recovery occurs." },
      { question: "Who is a candidate for CIMT?", answer: "Candidates need at least 20° of active wrist extension and 10° of active finger extension, adequate balance and safety awareness, and cognitive ability to follow the protocol." }
    ]
  },
  {
    slug: "functional-electrical-stimulation",
    title: "Functional Electrical Stimulation (FES)",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Functional Electrical Stimulation in OT — OT Encyclopedia",
    seoDescription: "Guide to FES as a therapeutic modality in occupational therapy for neuromuscular re-education and functional recovery.",
    seoKeywords: ["FES", "functional electrical stimulation", "neuromuscular re-education", "electrical stimulation", "OT modalities"],
    overview: "Functional Electrical Stimulation (FES) is a therapeutic modality used in OT to activate paralyzed or weak muscles through application of electrical current to produce functional movement. In upper extremity rehabilitation, FES is applied to facilitate grasp and release, wrist extension, elbow extension, and reach patterns during functional tasks.",
    mechanismPhysiology: "FES delivers electrical impulses to peripheral motor nerves, causing muscle contraction. When integrated with functional tasks, FES promotes motor relearning through repetitive, task-specific practice. It may also facilitate cortical reorganization through afferent feedback mechanisms.",
    clinicalRelevance: "OTs use FES as an adjunct to occupation-based intervention, combining electrical stimulation with meaningful functional tasks. Evidence supports FES for improving upper extremity motor recovery after stroke, particularly when combined with task-specific training.",
    signsSymptoms: "Indicated for clients with upper motor neuron injuries (stroke, SCI, TBI) presenting with muscle weakness or paralysis, limited active movement, and decreased functional use of the affected extremity.",
    assessment: "Manual muscle testing, active ROM measurement, functional upper extremity assessments, skin integrity assessment (for electrode placement), and sensory assessment to ensure tolerance to stimulation.",
    management: "FES is integrated into functional activities such as reaching for objects, grasping cups, feeding tasks, and grooming. Parameters are adjusted for comfortable muscle contraction. Sessions typically last 30-60 minutes, 3-5 times per week. Combined with repetitive task practice for optimal outcomes.",
    complications: "Skin irritation at electrode sites, muscle fatigue, autonomic dysreflexia (in SCI above T6), contraindicated with pacemakers, over implanted metal, and near the carotid sinus.",
    clinicalPearls: [
      "FES combined with task-specific practice produces better outcomes than FES or practice alone.",
      "EMG-triggered FES, where the client initiates the movement and FES augments it, promotes active motor control.",
      "Always check for contraindications: pacemakers, pregnancy, seizure disorders, and implanted metal."
    ],
    examPitfalls: [
      "Not distinguishing FES (functional movement production) from NMES (general strengthening).",
      "Forgetting contraindications for electrical stimulation.",
      "Not integrating FES into functional tasks — isolated stimulation alone is less effective."
    ],
    faqJson: [
      { question: "What is the difference between FES and NMES?", answer: "FES produces functional movements during purposeful tasks, while NMES (Neuromuscular Electrical Stimulation) is used for general muscle strengthening and contraction without necessarily being linked to functional tasks." },
      { question: "Is FES effective for stroke recovery?", answer: "Yes, evidence supports FES as an effective adjunct treatment for improving upper extremity motor recovery after stroke, particularly when combined with task-specific functional practice." }
    ]
  },
  {
    slug: "mirror-therapy",
    title: "Mirror Therapy",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Mirror Therapy in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to mirror therapy for stroke, phantom limb pain, and CRPS management in occupational therapy.",
    seoKeywords: ["mirror therapy", "mirror box", "phantom limb", "stroke rehabilitation", "CRPS", "OT"],
    overview: "Mirror therapy is a rehabilitation technique where a mirror is placed in the client's midsagittal plane, reflecting the unaffected limb so it appears to be the affected limb. This visual illusion facilitates motor recovery by providing visual feedback of normal movement. Originally developed for phantom limb pain by V.S. Ramachandran, it is now widely used for stroke rehabilitation and complex regional pain syndrome (CRPS).",
    mechanismPhysiology: "Mirror therapy is thought to activate mirror neurons and promote cortical reorganization by providing visual-motor feedback that tricks the brain into perceiving movement of the affected limb. This may reduce learned non-use, decrease pain perception, and facilitate motor recovery through neuroplastic mechanisms.",
    clinicalRelevance: "OTs use mirror therapy as an evidence-based intervention for upper extremity motor recovery after stroke, phantom limb pain management, and CRPS pain reduction. It is inexpensive, non-invasive, and can be used as a home program.",
    signsSymptoms: "Indicated for stroke survivors with limited upper extremity movement, amputees experiencing phantom limb pain, and individuals with CRPS or chronic pain conditions.",
    assessment: "Upper extremity motor function (FMA-UE, ARAT, WMFT), pain intensity (VAS/NRS), limb perception, and ADL performance.",
    management: "The client places the affected hand behind the mirror and performs bilateral movements while watching the reflection of the unaffected hand. Sessions of 20-30 minutes, performed daily. Activities progress from simple (open/close fist) to complex (finger individuation, object manipulation). Can be combined with other interventions.",
    complications: "Nausea or dizziness from visual-motor mismatch (rare), frustration with limited progress, contraindicated in some psychiatric conditions where visual illusions may be distressing.",
    clinicalPearls: [
      "Mirror therapy has strong evidence for upper extremity motor recovery after stroke (Level I evidence).",
      "Most effective when combined with conventional rehabilitation rather than used in isolation.",
      "Can be easily incorporated into a home exercise program with a simple mirror."
    ],
    examPitfalls: [
      "Not knowing the mechanism (mirror neurons and visual feedback) behind mirror therapy.",
      "Confusing mirror therapy with mental imagery — mirror therapy uses actual visual feedback.",
      "Not recognizing its application beyond stroke (phantom limb pain, CRPS)."
    ],
    faqJson: [
      { question: "How does mirror therapy work?", answer: "Mirror therapy creates a visual illusion of normal movement by reflecting the unaffected limb, which activates mirror neurons and promotes cortical reorganization to facilitate motor recovery." },
      { question: "What conditions can mirror therapy be used for?", answer: "Mirror therapy is used for stroke rehabilitation, phantom limb pain, complex regional pain syndrome (CRPS), and other conditions involving motor impairment or chronic pain." }
    ]
  },
  {
    slug: "upper-extremity-prosthetics-training",
    title: "Upper Extremity Prosthetic Training",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Upper Extremity Prosthetic Training in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy role in upper extremity prosthetic training, including body-powered and myoelectric prostheses.",
    seoKeywords: ["prosthetic training", "upper extremity amputation", "myoelectric prosthesis", "body-powered prosthesis", "OT"],
    overview: "Upper extremity prosthetic training is a specialized area of OT that involves pre-prosthetic management, prosthetic assessment and selection, initial training in prosthetic operation, and advanced functional training with the prosthesis. OTs train clients in the use of body-powered, myoelectric, and activity-specific prostheses for maximum functional independence.",
    mechanismPhysiology: "Body-powered prostheses use a cable and harness system activated by body movements (scapular abduction, humeral flexion). Myoelectric prostheses use EMG signals from residual limb muscles to control motorized components. Hybrid and activity-specific prostheses combine features for task-specific function.",
    clinicalRelevance: "OTs are primary providers of prosthetic training, addressing bilateral ADL performance, work task training, leisure participation, and psychosocial adjustment. Early prosthetic fitting and training (within 30 days) is associated with higher acceptance and functional use rates.",
    signsSymptoms: "Upper extremity amputation at various levels (transradial, transhumeral, partial hand) requiring prosthetic intervention for functional restoration.",
    assessment: "Residual limb assessment (length, shape, skin condition, ROM, strength, sensation), functional needs assessment, vocational and leisure demands, psychosocial readiness, and prosthetic fit and function evaluation.",
    management: "Pre-prosthetic: wound care, desensitization, shaping, ROM, strengthening, one-handed techniques. Prosthetic training: controls training (repetitive drills), pre-positioning, grasp and release patterns, bilateral activities, ADL training, vocational training. Progressive from simple to complex functional tasks.",
    complications: "Prosthetic rejection (up to 50% of myoelectric users), skin breakdown, overuse of the intact limb, phantom limb pain, psychological adjustment difficulties.",
    clinicalPearls: [
      "Early prosthetic fitting (within 30 days) is associated with higher acceptance rates.",
      "Controls training should progress from repetitive drills to functional activities.",
      "Body-powered prostheses provide proprioceptive feedback through the cable system, which myoelectric prostheses lack."
    ],
    examPitfalls: [
      "Not knowing the difference between body-powered and myoelectric prostheses.",
      "Forgetting pre-prosthetic rehabilitation (shaping, desensitization, ROM, strengthening).",
      "Not addressing one-handed techniques while awaiting prosthetic fitting."
    ],
    faqJson: [
      { question: "What is the OT's role in prosthetic training?", answer: "OTs provide comprehensive prosthetic training including controls training, functional task practice, ADL training, and psychosocial support to maximize prosthetic acceptance and functional use." },
      { question: "What is the difference between body-powered and myoelectric prostheses?", answer: "Body-powered prostheses use a cable and harness activated by body movements, while myoelectric prostheses use EMG signals from residual limb muscles to control motorized components." }
    ]
  },
  {
    slug: "range-of-motion-exercise-therapy",
    title: "Range of Motion Exercise Therapy",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Range of Motion Exercise in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to ROM exercise types, techniques, and clinical applications in occupational therapy for upper extremity rehabilitation.",
    seoKeywords: ["range of motion", "ROM exercises", "PROM", "AROM", "AAROM", "OT rehabilitation"],
    overview: "Range of motion (ROM) exercise therapy in OT encompasses passive ROM (PROM), active-assistive ROM (AAROM), and active ROM (AROM) techniques applied to maintain, restore, or improve joint mobility. OTs integrate ROM exercises into functional activities and design home programs that incorporate movement into daily routines.",
    mechanismPhysiology: "ROM exercises maintain joint and soft tissue mobility by preventing contracture, reducing stiffness, and promoting synovial fluid circulation. PROM maintains tissue length when active movement is not possible. AROM and AAROM additionally provide motor activation, proprioceptive feedback, and blood flow benefits.",
    clinicalRelevance: "ROM is a foundational intervention in OT. Loss of ROM directly impacts functional performance in self-care, work, and leisure activities. OTs uniquely address ROM within the context of occupation, using functional tasks as the vehicle for ROM gains.",
    signsSymptoms: "Joint stiffness, contracture, post-surgical immobilization effects, inflammatory conditions, neurological conditions affecting movement, and pain-related guarding limiting motion.",
    assessment: "Goniometric measurement of joint ROM, end-feel assessment, pain assessment during motion, and comparison to normative values and contralateral limb.",
    management: "PROM for immobilized or flaccid limbs, AAROM for early active motion phases, AROM integrated into functional activities. Stretching techniques, joint mobilization, splinting for prolonged stretch, and occupation-based activities designed to promote specific ROM patterns.",
    complications: "Overly aggressive ROM may cause tissue damage, pain, inflammation, or heterotopic ossification. Respect surgical precautions and tissue healing timelines.",
    clinicalPearls: [
      "End-feel assessment provides crucial information: capsular (firm), bony (hard), and soft tissue approximation (soft) indicate different limiting factors.",
      "Functional activities naturally promote ROM — integrate exercises into meaningful tasks.",
      "Low-load, prolonged stretch is more effective for increasing ROM than high-force, brief stretching."
    ],
    examPitfalls: [
      "Applying PROM when AROM or AAROM is appropriate and more therapeutic.",
      "Not documenting end-feel and the limiting factor for ROM loss.",
      "Ignoring surgical precautions and applying ROM too aggressively post-operatively."
    ],
    faqJson: [
      { question: "What is the difference between PROM, AAROM, and AROM?", answer: "PROM is performed entirely by the therapist, AAROM involves client effort with therapist assistance, and AROM is performed independently by the client. Each is appropriate at different stages of recovery." },
      { question: "How does OT approach ROM differently from PT?", answer: "OTs integrate ROM exercises into functional activities and occupations, using meaningful tasks as the vehicle for ROM improvement rather than isolated exercise alone." }
    ]
  },
  // ===== PEDIATRIC OT (12 entries) =====
  {
    slug: "developmental-milestones-ot",
    title: "Developmental Milestones in Pediatric OT",
    category: "Pediatric OT",
    seoTitle: "Developmental Milestones in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to developmental milestones assessment and intervention in pediatric occupational therapy.",
    seoKeywords: ["developmental milestones", "pediatric OT", "child development", "motor milestones", "fine motor development"],
    overview: "Developmental milestones are a set of functional skills that most children achieve by a certain age. Pediatric OTs use knowledge of typical developmental sequences to identify delays, set intervention goals, and design age-appropriate therapeutic activities. Key milestone areas include gross motor, fine motor, visual-motor, self-care, play, and social-emotional development.",
    mechanismPhysiology: "Development follows cephalocaudal (head to toe) and proximodistal (center to periphery) patterns, with progression from gross to fine motor control, from reflexive to voluntary movement, and from bilateral to unilateral hand use. Sensory processing, postural control, and cognitive development underpin motor milestone achievement.",
    clinicalRelevance: "OTs assess children against expected milestone timelines to identify delays requiring early intervention. Understanding typical development enables OTs to design age-appropriate interventions, educate caregivers, and set realistic goals.",
    signsSymptoms: "Red flags include: not reaching for objects by 4-5 months, not sitting independently by 9 months, not using pincer grasp by 12 months, hand dominance before 18 months, not scribbling by 18 months, and not self-feeding with a spoon by 15-18 months.",
    assessment: "Bayley Scales of Infant Development, Peabody Developmental Motor Scales (PDMS-2), Ages and Stages Questionnaire (ASQ), Bruininks-Oseretsky Test of Motor Proficiency (BOT-2), Beery VMI, and clinical observation of play and self-care skills.",
    management: "OTs design play-based interventions targeting specific developmental areas, provide caregiver education and home programs, recommend environmental modifications, and collaborate with early intervention teams. Interventions follow a developmental sequence while incorporating the child's interests and motivation.",
    complications: "Delayed identification of developmental disorders, caregiver anxiety, and the challenge of distinguishing normal variation from pathological delay. Cultural considerations influence expectations and assessment validity.",
    clinicalPearls: [
      "Hand dominance established before 18 months may indicate hemiparesis and warrants further evaluation.",
      "Developmental milestones are ranges, not rigid deadlines — consider the whole clinical picture.",
      "Play is the primary occupation of childhood and the most effective therapeutic medium."
    ],
    examPitfalls: [
      "Not knowing key fine motor milestone ages (e.g., pincer grasp at 9-12 months).",
      "Confusing typical development with pathological patterns.",
      "Ignoring the role of sensory processing in motor milestone achievement."
    ],
    faqJson: [
      { question: "When should a child be referred to a pediatric OT?", answer: "Referral is appropriate when a child demonstrates delays in reaching developmental milestones for fine motor, self-care, play, or sensory processing skills beyond the expected age range." },
      { question: "What are the most important fine motor milestones?", answer: "Key milestones include raking grasp (6-7 months), pincer grasp (9-12 months), controlled release (12-15 months), tower building (18 months), scissors use (3-4 years), and handwriting readiness (5-6 years)." }
    ]
  },
  {
    slug: "handwriting-intervention-pediatric",
    title: "Handwriting Intervention in Pediatric OT",
    category: "Pediatric OT",
    seoTitle: "Handwriting Intervention in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy handwriting assessment and intervention for children with handwriting difficulties.",
    seoKeywords: ["handwriting intervention", "pediatric OT", "handwriting without tears", "pencil grasp", "fine motor"],
    overview: "Handwriting intervention is one of the most common reasons for pediatric OT referral. OTs assess and treat handwriting difficulties by addressing underlying components including fine motor skills, visual-motor integration, postural stability, in-hand manipulation, and sensory processing. Evidence-based programs include Handwriting Without Tears, Size Matters Handwriting, and therapist-designed individualized programs.",
    mechanismPhysiology: "Handwriting requires the integration of visual-motor skills, fine motor control, proprioception, postural stability, motor planning, and cognitive-linguistic processing. A dynamic tripod or modified grasp provides the precision and endurance needed for efficient writing. The proximal stability-distal mobility principle applies: trunk and shoulder stability supports fine motor control at the hand.",
    clinicalRelevance: "Handwriting difficulties affect academic performance, self-esteem, and classroom participation. OTs uniquely address handwriting by analyzing component skills, adapting the task and environment, and providing evidence-based intervention within the school context.",
    signsSymptoms: "Illegible writing, slow writing speed, excessive pressure or too-light pressure, difficulty with letter formation, poor spacing, fatigue and hand pain, avoidance of writing tasks, and difficulty copying from the board.",
    assessment: "Evaluation Tool of Children's Handwriting (ETCH), Minnesota Handwriting Assessment, Beery VMI, Test of Handwriting Skills Revised (THS-R), in-hand manipulation assessment, grasp pattern observation, and writing sample analysis.",
    management: "Address foundational skills (posture, grasp, visual-motor integration), implement structured handwriting programs, provide adaptations (pencil grips, raised-line paper, slant boards), multisensory letter formation practice, and collaboration with teachers for classroom accommodations.",
    complications: "Persistent handwriting difficulties despite intervention may indicate underlying conditions such as developmental coordination disorder, dysgraphia, or fine motor delay requiring additional assessment.",
    clinicalPearls: [
      "A functional grasp that allows legibility and speed is acceptable — not all children need a dynamic tripod.",
      "Address posture and proximal stability before focusing on pencil control.",
      "Multisensory approaches (tracing in sand, forming letters with clay) enhance letter learning."
    ],
    examPitfalls: [
      "Insisting on a dynamic tripod grasp when a functional modified grasp is adequate.",
      "Treating handwriting without assessing underlying component skills.",
      "Focusing only on legibility without addressing writing speed and endurance."
    ],
    faqJson: [
      { question: "What is the most common reason for pediatric OT referral?", answer: "Handwriting difficulties are one of the top reasons for school-based and outpatient pediatric OT referrals." },
      { question: "When should a child be assessed for handwriting difficulties?", answer: "Assessment is appropriate when a child's handwriting significantly impacts academic performance, typically around first grade or whenever legibility, speed, or endurance concerns emerge." }
    ]
  },
  {
    slug: "sensory-processing-disorder",
    title: "Sensory Processing Disorder",
    category: "Pediatric OT",
    seoTitle: "Sensory Processing Disorder in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to sensory processing disorder assessment and intervention in pediatric occupational therapy.",
    seoKeywords: ["sensory processing disorder", "SPD", "sensory integration", "sensory modulation", "pediatric OT"],
    overview: "Sensory Processing Disorder (SPD) is a condition in which the brain has difficulty receiving, organizing, and responding to sensory information in a way that produces appropriate behavioral and motor responses. OTs, particularly those trained in sensory integration, are the primary providers of assessment and intervention for SPD. Three primary subtypes include sensory modulation disorder, sensory discrimination disorder, and sensory-based motor disorder.",
    mechanismPhysiology: "Sensory processing involves registration (detection), modulation (filtering/regulation), discrimination (interpretation), and integration (combining inputs for adaptive response). In SPD, one or more of these processes is disrupted, leading to over-responsivity, under-responsivity, sensory seeking, poor discrimination, or motor planning difficulties.",
    clinicalRelevance: "SPD significantly impacts a child's participation in daily activities, school performance, social relationships, and family routines. OTs use a combination of sensory integration therapy, environmental modifications, sensory diets, and caregiver education to improve functional outcomes.",
    signsSymptoms: "Over-responsivity: distress with certain textures, sounds, or movements. Under-responsivity: not noticing pain, seeming lethargic, missing sensory input. Sensory seeking: crashing, spinning, mouthing objects. Poor discrimination: difficulty identifying objects by touch, poor body awareness. Dyspraxia: difficulty with motor planning and coordination.",
    assessment: "Sensory Profile (Dunn), Sensory Processing Measure (SPM), Sensory Integration and Praxis Tests (SIPT), clinical observation of sensory responses, and parent/teacher questionnaires.",
    management: "Sensory integration therapy in a sensory-rich environment (suspended equipment, tactile materials, heavy work activities), sensory diets (scheduled sensory activities throughout the day), environmental modifications (noise reduction, visual organization), self-regulation strategy training, and caregiver education.",
    complications: "SPD may co-occur with autism spectrum disorder, ADHD, anxiety, and learning disabilities. Differential diagnosis is important for appropriate intervention planning.",
    clinicalPearls: [
      "Sensory integration therapy must follow the principles of ASI: child-directed, active engagement, and 'just-right challenge.'",
      "A sensory diet is not a one-size-fits-all prescription — it must be individualized based on the child's sensory profile.",
      "Heavy work (proprioceptive input) is generally calming and organizing for most sensory profiles."
    ],
    examPitfalls: [
      "Not distinguishing between sensory modulation, discrimination, and motor subtypes of SPD.",
      "Confusing the Sensory Profile (questionnaire) with the SIPT (performance-based).",
      "Applying a generic sensory diet without individualized assessment."
    ],
    faqJson: [
      { question: "What are the main types of sensory processing disorder?", answer: "The three main types are sensory modulation disorder (over/under-responsivity, seeking), sensory discrimination disorder (difficulty interpreting sensory input), and sensory-based motor disorder (dyspraxia, postural disorder)." },
      { question: "How does OT help children with SPD?", answer: "OTs provide sensory integration therapy, create individualized sensory diets, modify environments, train self-regulation strategies, and educate caregivers to improve the child's participation in daily activities." }
    ]
  },
  {
    slug: "feeding-and-swallowing-pediatric",
    title: "Pediatric Feeding & Oral Motor Intervention",
    category: "Pediatric OT",
    seoTitle: "Pediatric Feeding and Oral Motor Intervention in OT — OT Encyclopedia",
    seoDescription: "Guide to pediatric feeding therapy and oral motor intervention in occupational therapy practice.",
    seoKeywords: ["pediatric feeding", "oral motor", "feeding therapy", "food selectivity", "OT feeding"],
    overview: "Pediatric feeding intervention in OT addresses difficulties with oral motor skills, food acceptance, self-feeding, and mealtime participation. OTs assess and treat children with feeding difficulties related to sensory processing, oral motor dysfunction, developmental delays, medical complexity, and behavioral feeding disorders. Intervention is holistic, addressing the child, caregiver, mealtime environment, and food properties.",
    mechanismPhysiology: "Feeding requires coordinated oral motor skills (jaw stability, tongue lateralization, lip closure, chewing patterns), sensory processing of food textures and temperatures, postural stability, fine motor skills for self-feeding, and cognitive-behavioral regulation. These components develop sequentially from birth through early childhood.",
    clinicalRelevance: "Feeding difficulties are prevalent in pediatric populations, particularly children with developmental delays, autism spectrum disorder, prematurity, and neurological conditions. OTs use a comprehensive approach considering sensory, motor, medical, and behavioral factors.",
    signsSymptoms: "Limited food repertoire, refusal of textures, gagging or vomiting with foods, difficulty chewing, poor self-feeding skills, prolonged mealtimes, food pocketing, excessive drooling, weight loss or poor growth, and mealtime behavioral challenges.",
    assessment: "Oral motor examination, feeding observation, sensory assessment of food acceptance, postural assessment during feeding, dietary intake analysis, and caregiver interview. Instrumental assessments (videofluoroscopy, FEES) for swallowing concerns.",
    management: "Oral motor exercises and facilitation, food chaining and systematic desensitization, SOS Approach to Feeding, positioning optimization, utensil adaptation, mealtime routine structure, caregiver coaching, and gradual texture progression. Interdisciplinary collaboration with SLPs, dietitians, and physicians.",
    complications: "Aspiration risk with swallowing dysfunction, nutritional deficiencies, growth faltering, enteral feeding dependency, and caregiver-child feeding relationship strain.",
    clinicalPearls: [
      "The SOS (Sequential Oral Sensory) approach uses systematic desensitization steps: tolerate, interact, smell, touch, taste, eat.",
      "Address positioning first — adequate postural support is essential for safe and efficient feeding.",
      "Food chaining connects accepted foods to new foods through shared properties (flavor, texture, color, shape)."
    ],
    examPitfalls: [
      "Not recognizing the OT's scope in feeding — OTs address feeding as an occupation, while SLPs focus on swallowing physiology.",
      "Ignoring sensory factors in food selectivity — not all feeding problems are behavioral.",
      "Forcing food exposure without systematic desensitization, which increases food aversion."
    ],
    faqJson: [
      { question: "What is the difference between feeding therapy by an OT vs. SLP?", answer: "OTs address feeding as an occupation, focusing on sensory processing, fine motor self-feeding, positioning, and mealtime participation. SLPs focus on oral motor and swallowing physiology. Many clinicians have overlapping training." },
      { question: "What is food chaining?", answer: "Food chaining is a systematic approach that connects accepted foods to new foods through shared properties (same flavor, different texture, or same shape, different flavor) to gradually expand the child's diet." }
    ]
  },
  {
    slug: "autism-spectrum-disorder-ot",
    title: "Autism Spectrum Disorder in OT",
    category: "Pediatric OT",
    seoTitle: "Autism Spectrum Disorder in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy assessment and intervention for children with autism spectrum disorder.",
    seoKeywords: ["autism", "ASD", "occupational therapy", "sensory processing", "social skills", "pediatric OT"],
    overview: "Occupational therapy for autism spectrum disorder (ASD) addresses the functional impacts of sensory processing differences, social communication challenges, restricted/repetitive behaviors, and executive function difficulties on daily life participation. OTs work with children across settings (clinic, school, home, community) to improve self-care independence, social participation, play skills, academic performance, and self-regulation.",
    mechanismPhysiology: "ASD is a neurodevelopmental condition characterized by differences in neural connectivity affecting social communication, sensory processing, executive function, and motor planning. Sensory processing differences are present in up to 90% of individuals with ASD and significantly impact daily function.",
    clinicalRelevance: "OTs are core members of the interdisciplinary team serving children with ASD. They uniquely address the sensory processing, motor, and daily living skill needs that other disciplines may not target. Evidence supports sensory integration therapy, visual supports, and structured self-care training for individuals with ASD.",
    signsSymptoms: "Sensory over- or under-responsivity, difficulty with transitions and routine changes, limited play skills, social interaction challenges, self-care skill delays (dressing, grooming, toileting), motor coordination difficulties, and restricted interests.",
    assessment: "Sensory Profile, Autism Diagnostic Observation Schedule (ADOS — administered by psychologists), Childhood Autism Rating Scale (CARS), visual-motor assessment, ADL and IADL performance evaluation, school-based occupational performance observation, and social participation assessment.",
    management: "Sensory integration therapy, visual supports and schedules, social skills training through structured play, self-care skill training with task analysis and visual prompts, environmental modifications, transition support, caregiver coaching, and self-regulation strategy instruction (Zones of Regulation, Alert Program).",
    complications: "Co-occurring conditions including anxiety, ADHD, intellectual disability, epilepsy, and GI issues may complicate intervention planning. Generalization of skills across settings is a common challenge.",
    clinicalPearls: [
      "Address sensory processing as a foundation — sensory regulation supports attention, social engagement, and skill learning.",
      "Use the child's special interests as motivators and therapeutic tools.",
      "Visual supports are among the most evidence-supported interventions for children with ASD."
    ],
    examPitfalls: [
      "Assuming all children with ASD have the same sensory profile — individualized assessment is essential.",
      "Not recognizing that OTs do not diagnose ASD but address its functional impacts.",
      "Overlooking motor coordination difficulties in ASD (developmental coordination disorder co-occurs frequently)."
    ],
    faqJson: [
      { question: "What does an OT do for a child with autism?", answer: "OTs address sensory processing, self-care skills, play development, social participation, fine motor skills, self-regulation, and environmental adaptations to improve daily life participation for children with ASD." },
      { question: "How does sensory processing relate to autism?", answer: "Up to 90% of individuals with ASD have sensory processing differences that affect their ability to filter, organize, and respond to sensory input, impacting behavior, social interaction, and daily function." }
    ]
  },
  {
    slug: "cerebral-palsy-pediatric-ot",
    title: "Cerebral Palsy in Pediatric OT",
    category: "Pediatric OT",
    seoTitle: "Cerebral Palsy in Pediatric Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy assessment and intervention for children with cerebral palsy.",
    seoKeywords: ["cerebral palsy", "CP", "pediatric OT", "spasticity management", "functional skills"],
    overview: "Occupational therapy for cerebral palsy (CP) focuses on maximizing functional independence in self-care, play, school, and community participation. OTs address upper extremity function, fine motor skills, visual-perceptual processing, self-care training, adaptive equipment, and environmental modifications. Intervention is guided by the child's GMFCS and MACS classification levels.",
    mechanismPhysiology: "CP results from non-progressive brain injury occurring before, during, or shortly after birth, affecting motor control and posture. Types include spastic (most common — 70-80%), dyskinetic (athetoid/dystonic), ataxic, and mixed. The distribution may be unilateral (hemiplegic) or bilateral (diplegic, quadriplegic).",
    clinicalRelevance: "OTs play a vital role across the lifespan of individuals with CP, from early intervention through adulthood. Intervention evolves from developmental skill promotion in early childhood to independence training and compensatory strategies in adolescence and adulthood.",
    signsSymptoms: "Abnormal muscle tone (spasticity, hypotonia, dystonia), delayed motor milestones, difficulty with grasp and manipulation, poor postural control, visual-perceptual deficits, and self-care dependence.",
    assessment: "Manual Ability Classification System (MACS), Quality of Upper Extremity Skills Test (QUEST), Assisting Hand Assessment (AHA), Melbourne Assessment, ADL performance evaluation, seating and positioning assessment, and visual-perceptual testing.",
    management: "Neurodevelopmental treatment (NDT) principles, constraint-induced movement therapy (CIMT), bimanual training (HABIT), spasticity management (splinting, casting, positioning), adaptive equipment prescription, powered mobility assessment, self-care training, and environmental modifications.",
    complications: "Secondary musculoskeletal deformities (contracture, scoliosis, hip subluxation), pain, fatigue, skin breakdown, and progressive functional decline in adulthood.",
    clinicalPearls: [
      "The MACS (Manual Ability Classification System) guides OT goal-setting for upper extremity function.",
      "Bimanual training (HABIT) may be more ecologically valid than CIMT for bilateral CP.",
      "Positioning and seating directly affect upper extremity function — optimize proximal stability first."
    ],
    examPitfalls: [
      "Confusing GMFCS (gross motor) with MACS (manual ability) classification systems.",
      "Not considering the non-progressive nature of the brain lesion — functional changes reflect development and secondary conditions.",
      "Applying the same intervention approach regardless of CP type (spastic vs. dyskinetic)."
    ],
    faqJson: [
      { question: "What is the OT's role in cerebral palsy management?", answer: "OTs maximize upper extremity function, self-care independence, play participation, and school performance through therapeutic activities, adaptive equipment, environmental modifications, and caregiver education." },
      { question: "What is the MACS classification?", answer: "The Manual Ability Classification System rates a child's ability to handle objects in daily activities on a 5-level scale (I = handles objects easily to V = does not handle objects), guiding OT goal-setting." }
    ]
  },
  {
    slug: "school-based-occupational-therapy",
    title: "School-Based Occupational Therapy",
    category: "Pediatric OT",
    seoTitle: "School-Based Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to school-based OT practice including IEP services, classroom interventions, and educationally relevant therapy.",
    seoKeywords: ["school-based OT", "IEP", "educationally relevant", "classroom intervention", "IDEA"],
    overview: "School-based occupational therapy provides services to students who need OT support to access and participate in their educational program. Services are mandated under the Individuals with Disabilities Education Act (IDEA) in the US and similar legislation internationally. School OTs address handwriting, fine motor skills, self-care, sensory regulation, attention, organization, social participation, and assistive technology within the educational context.",
    mechanismPhysiology: "School-based OT is guided by the IDEA framework, which mandates that OT services be educationally relevant — focused on supporting the student's ability to benefit from special education. Services are documented in the Individualized Education Program (IEP) with measurable goals related to educational participation.",
    clinicalRelevance: "School-based OT is the largest practice setting for pediatric OTs. The shift from pull-out services to push-in, classroom-based, and consultative models reflects best practices for supporting students in their natural educational environment.",
    signsSymptoms: "Difficulty with handwriting, cutting, coloring, and other fine motor academic tasks, sensory regulation challenges affecting classroom behavior, self-care difficulties (toileting, dressing for PE, lunch management), organizational difficulties, and attention challenges impacting learning.",
    assessment: "School Function Assessment (SFA), Beery VMI, handwriting assessments, sensory processing questionnaires, classroom observation, and functional task analysis within the school environment.",
    management: "Direct services (individual or group), consultative services (teacher collaboration), classroom modifications (seating, sensory tools, visual schedules), assistive technology, handwriting programs, sensory strategies, self-regulation curricula, and transition planning.",
    complications: "Caseload pressures, limited therapy time, difficulty distinguishing educational from medical OT services, and challenges with service delivery model selection (direct vs. consultative).",
    clinicalPearls: [
      "School-based OT must be educationally relevant — goals should relate to the student's ability to participate in their educational program.",
      "Push-in (classroom-based) services often provide better generalization than pull-out sessions.",
      "Collaboration with teachers is essential — the OT's role includes coaching and consultation."
    ],
    examPitfalls: [
      "Confusing educational relevance with medical necessity — different standards apply in school vs. clinical settings.",
      "Not knowing that school OT is mandated under IDEA as a related service.",
      "Treating school-based OT as clinic-based OT in a school setting — the context and focus differ."
    ],
    faqJson: [
      { question: "What is the difference between school-based and clinic-based OT?", answer: "School-based OT focuses on educationally relevant goals supporting the student's access to their educational program, while clinic-based OT addresses broader medical and functional goals." },
      { question: "How does a student qualify for school-based OT?", answer: "Students qualify through the IEP process when OT is needed to help them benefit from special education services. Eligibility is based on educational need, not medical diagnosis alone." }
    ]
  },
  {
    slug: "play-based-intervention",
    title: "Play-Based Intervention in Pediatric OT",
    category: "Pediatric OT",
    seoTitle: "Play-Based Intervention in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to using play as a therapeutic medium in pediatric occupational therapy assessment and intervention.",
    seoKeywords: ["play therapy", "play-based intervention", "therapeutic play", "pediatric OT", "play assessment"],
    overview: "Play-based intervention uses play as both the medium and the goal of pediatric OT. Play is the primary occupation of childhood, and OTs use it to develop motor skills, sensory processing, social interaction, cognitive abilities, and self-regulation. OTs may address play as an end in itself (developing play skills) or as a means (using play to achieve other therapeutic goals).",
    mechanismPhysiology: "Play supports development through intrinsic motivation, active engagement, sensory exploration, social interaction, and the experience of mastery. Piaget's stages of play (sensorimotor, symbolic, games with rules) and Parten's social play categories (solitary, parallel, associative, cooperative) guide developmental assessment.",
    clinicalRelevance: "OTs are the primary health professionals addressing play participation. The ability to play is essential for cognitive, motor, social-emotional, and language development. Play deprivation is associated with developmental delays and psychosocial difficulties.",
    signsSymptoms: "Limited play repertoire, preference for repetitive or solitary play, difficulty with pretend play, inability to engage in age-appropriate play, and lack of play-related motor skills (throwing, climbing, manipulating toys).",
    assessment: "Knox Preschool Play Scale, Test of Playfulness (ToP), play history interview, and structured play observation assessing play types, complexity, and social engagement.",
    management: "Sensory-rich play environments, graded play challenges matching the child's developmental level, modeling and scaffolding play skills, peer play facilitation, parent coaching in responsive play interaction, and adaptation of play materials and environments.",
    complications: "Over-structuring play (eliminating the intrinsic motivation component), not matching play demands to the child's developmental level, and not addressing environmental barriers to play access.",
    clinicalPearls: [
      "Effective play-based intervention follows the 'just-right challenge' — activities that are achievable with effort.",
      "The child must experience intrinsic motivation and pleasure — therapist-directed activities that lack these qualities are not truly play.",
      "Play is both a means and an end — OTs should address play skill development, not just use play as a treatment modality."
    ],
    examPitfalls: [
      "Not recognizing play as a legitimate therapeutic outcome, not just a treatment medium.",
      "Confusing play therapy (psychotherapy term) with play-based OT intervention.",
      "Not knowing developmental play stages and their progression."
    ],
    faqJson: [
      { question: "Why is play important in pediatric OT?", answer: "Play is the primary occupation of childhood, essential for motor, cognitive, social, and emotional development. OTs use play to develop functional skills and address play participation as a therapeutic goal." },
      { question: "How do OTs use play differently from other professionals?", answer: "OTs address play as an occupation — both developing play skills and using play as a medium for achieving other developmental and functional goals, with attention to sensory, motor, and environmental factors." }
    ]
  },
  {
    slug: "neonatal-intensive-care-ot",
    title: "Neonatal Intensive Care Unit (NICU) OT",
    category: "Pediatric OT",
    seoTitle: "NICU Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to the OT role in the NICU, including developmental positioning, feeding support, and family education.",
    seoKeywords: ["NICU OT", "neonatal OT", "premature infant", "developmental care", "neonatal positioning"],
    overview: "NICU occupational therapy involves specialized assessment and intervention for premature and medically complex neonates. OTs address developmental positioning, sensory environment management, oral feeding readiness, parent-infant bonding, and discharge planning. Practice is guided by developmental care frameworks including NIDCAP (Newborn Individualized Developmental Care and Assessment Program).",
    mechanismPhysiology: "Premature infants have immature neurological systems with limited ability to modulate sensory input. The NICU environment (bright lights, noise, frequent handling) can disrupt neurobehavioral organization. Developmental care aims to support autonomic, motor, state, and attention-interaction subsystem maturation.",
    clinicalRelevance: "OTs in the NICU promote neurodevelopmental outcomes through individualized developmental care, support oral feeding progression, optimize positioning for musculoskeletal development, and facilitate parent-infant attachment.",
    signsSymptoms: "Autonomic instability (color changes, hiccoughs, gagging), motor disorganization (hypotonia, hyperextension), state regulation difficulty (irritability, difficulty achieving/maintaining alert state), and feeding difficulty.",
    assessment: "NICU Network Neurobehavioral Scale (NNNS), Neonatal Behavioral Assessment Scale (NBAS), Assessment of Preterm Infants' Behavior (APIB), feeding readiness assessment, and developmental positioning evaluation.",
    management: "Individualized developmental positioning (nesting, containment), sensory environment modification (lighting, noise reduction), non-nutritive sucking programs, oral feeding facilitation, kangaroo care support, parent education and coaching, and discharge planning.",
    complications: "Overstimulation of fragile neonates, feeding-related aspiration, positioning-related plagiocephaly, and parent-infant bonding disruption.",
    clinicalPearls: [
      "Handle premature infants using containment holds — slow, graded transitions minimize stress.",
      "Observe stress cues (finger splay, gaze aversion, color changes) to guide handling and intervention intensity.",
      "Feeding readiness should be assessed before initiating oral feeding — corrected gestational age alone is insufficient."
    ],
    examPitfalls: [
      "Not knowing NIDCAP principles and developmental care concepts.",
      "Ignoring stress cues during handling and intervention.",
      "Initiating oral feeding based solely on gestational age without assessing behavioral readiness."
    ],
    faqJson: [
      { question: "What does an OT do in the NICU?", answer: "NICU OTs provide developmental positioning, sensory environment management, oral feeding support, parent education, neurobehavioral assessment, and discharge planning for premature and medically complex neonates." },
      { question: "What is developmental care?", answer: "Developmental care is an approach that modifies the NICU environment and caregiving practices to support the premature infant's neurobehavioral development, reduce stress, and promote parent-infant bonding." }
    ]
  },
  {
    slug: "developmental-coordination-disorder",
    title: "Developmental Coordination Disorder (DCD)",
    category: "Pediatric OT",
    seoTitle: "Developmental Coordination Disorder in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for developmental coordination disorder (dyspraxia) in children.",
    seoKeywords: ["DCD", "developmental coordination disorder", "dyspraxia", "motor coordination", "pediatric OT"],
    overview: "Developmental Coordination Disorder (DCD) is a neurodevelopmental condition characterized by significant motor coordination difficulties that interfere with daily activities and academic performance. Formerly called 'dyspraxia' or 'clumsy child syndrome,' DCD affects 5-6% of school-age children. OTs are primary providers of assessment and intervention for DCD.",
    mechanismPhysiology: "DCD involves impaired motor planning and execution that cannot be explained by intellectual disability, visual impairment, or neurological conditions. Current theories suggest deficits in internal modeling (predicting movement outcomes), sensory processing, and executive function contribute to the motor difficulties.",
    clinicalRelevance: "DCD significantly impacts handwriting, sports participation, self-care skills, and academic performance. Without intervention, motor difficulties persist into adulthood. OTs address DCD through task-specific training, cognitive approaches, and environmental modification.",
    signsSymptoms: "Difficulty learning new motor skills, poor handwriting, clumsiness, slow and effortful movement, difficulty with ball skills, problems with self-care tasks (buttons, zippers, shoe tying), and avoidance of physical activities.",
    assessment: "Movement Assessment Battery for Children (MABC-2), Bruininks-Oseretsky Test of Motor Proficiency (BOT-2), Developmental Coordination Disorder Questionnaire (DCDQ), handwriting assessment, and ADL performance evaluation.",
    management: "Task-oriented approaches (CO-OP — Cognitive Orientation to Occupational Performance), motor learning strategies, environmental modifications, direct skill training, self-care adaptations, physical activity programs, and self-esteem building. CO-OP and task-specific approaches have the strongest evidence.",
    complications: "Secondary psychosocial effects including low self-esteem, anxiety, depression, social isolation, obesity from physical activity avoidance, and academic underperformance.",
    clinicalPearls: [
      "CO-OP (Cognitive Orientation to Occupational Performance) is the most evidence-based intervention for DCD.",
      "DCD frequently co-occurs with ADHD (50% overlap), learning disabilities, and autism spectrum disorder.",
      "Task-specific approaches are more effective than bottom-up sensory or process-based approaches for DCD."
    ],
    examPitfalls: [
      "Confusing DCD with general developmental delay — DCD is specific to motor coordination.",
      "Not knowing that CO-OP is the most evidence-based approach for DCD.",
      "Assuming DCD resolves with age — motor difficulties typically persist without intervention."
    ],
    faqJson: [
      { question: "What is DCD?", answer: "Developmental Coordination Disorder is a neurodevelopmental condition characterized by motor coordination difficulties that significantly interfere with daily activities and academic performance, affecting 5-6% of school-age children." },
      { question: "What is CO-OP?", answer: "Cognitive Orientation to Occupational Performance (CO-OP) is a client-centred, problem-solving approach where the child uses guided discovery and cognitive strategies (Goal-Plan-Do-Check) to develop motor skills for self-chosen tasks." }
    ]
  },
  {
    slug: "toilet-training-ot",
    title: "Toilet Training in Pediatric OT",
    category: "Pediatric OT",
    seoTitle: "Toilet Training Intervention in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for toilet training readiness and difficulties in children.",
    seoKeywords: ["toilet training", "toileting", "pediatric OT", "self-care", "readiness skills"],
    overview: "Toilet training intervention in pediatric OT addresses readiness assessment, skill development, and problem-solving for children experiencing difficulty with toileting independence. OTs consider developmental readiness, sensory factors, motor skills, cognitive understanding, and environmental supports. This is particularly relevant for children with developmental delays, autism spectrum disorder, sensory processing differences, and physical disabilities.",
    mechanismPhysiology: "Successful toileting requires awareness of bladder/bowel fullness, motor ability to manage clothing and positioning, sensory tolerance of the bathroom environment, cognitive understanding of the process, and communication skills to express needs. Typical readiness emerges around 18-30 months.",
    clinicalRelevance: "OTs address toileting as a self-care occupation, analyzing component skills and environmental factors. The OT perspective adds value through sensory analysis, task adaptation, and equipment recommendation that other approaches may miss.",
    signsSymptoms: "Delayed toilet training beyond expected age, resistance to sitting on toilet, sensory aversion to bathroom, difficulty managing clothing, inability to sequence toileting steps, and incontinence related to sensory or motor factors.",
    assessment: "Toileting readiness assessment, sensory processing evaluation, motor skill assessment (clothing management, positioning), task analysis of toileting sequence, and environmental assessment of bathroom accessibility.",
    management: "Readiness skill development, visual schedules for toileting routine, sensory adaptations (padded seat, foot support, lighting modifications), clothing modifications, positioning aids, social stories, behavioral strategies, and gradual desensitization for sensory-related avoidance.",
    complications: "Toileting refusal, constipation from withholding, emotional distress, and caregiver frustration. Medical evaluation should rule out physiological causes of incontinence.",
    clinicalPearls: [
      "Proper positioning (hips flexed, feet supported) is essential for effective elimination.",
      "Sensory factors are often overlooked — cold toilet seats, loud flushing, and echoing bathrooms can create aversion.",
      "Visual schedules and social stories are effective tools for children with developmental delays and ASD."
    ],
    examPitfalls: [
      "Ignoring sensory contributions to toilet training difficulty.",
      "Not assessing readiness before initiating training.",
      "Treating all toileting difficulty as behavioral rather than considering developmental and sensory factors."
    ],
    faqJson: [
      { question: "When should a child be referred to OT for toilet training?", answer: "Referral is appropriate when a child shows significant delay in toilet training (beyond age 4), has sensory or motor factors impacting toileting, or when standard approaches have been unsuccessful." },
      { question: "How do OTs approach toilet training differently?", answer: "OTs analyze the sensory, motor, cognitive, and environmental components of toileting, providing targeted interventions for specific barriers rather than using a one-size-fits-all behavioral approach." }
    ]
  },
  {
    slug: "visual-motor-integration",
    title: "Visual-Motor Integration (VMI)",
    category: "Pediatric OT",
    seoTitle: "Visual-Motor Integration in Pediatric OT — OT Encyclopedia",
    seoDescription: "Guide to visual-motor integration assessment and intervention in pediatric occupational therapy.",
    seoKeywords: ["visual-motor integration", "VMI", "Beery VMI", "eye-hand coordination", "pediatric OT"],
    overview: "Visual-motor integration (VMI) is the ability to coordinate visual perception with motor output, essential for many childhood tasks including handwriting, cutting, catching balls, and copying from the board. The Beery-Buktenica Developmental Test of Visual-Motor Integration (Beery VMI) is the gold standard assessment. OTs address VMI deficits through targeted intervention and environmental adaptations.",
    mechanismPhysiology: "VMI requires intact visual perception (form constancy, spatial relationships, visual discrimination), visual-motor coordination (translating visual input into motor output), and motor execution (fine motor control, motor planning). It develops sequentially from simple form copying (vertical line by age 2) to complex forms (diamond by age 7).",
    clinicalRelevance: "VMI deficits significantly impact handwriting, academic performance, and daily activities. OTs assess VMI as part of comprehensive evaluation for school-age children and design interventions targeting the specific deficit area (visual perception, motor coordination, or integration).",
    signsSymptoms: "Difficulty copying shapes and letters, poor handwriting legibility, trouble with puzzles and construction tasks, difficulty aligning numbers in math, and challenges with cutting along lines.",
    assessment: "Beery VMI (with supplemental visual perception and motor coordination tests), Test of Visual-Perceptual Skills (TVPS), clinical observation of copying tasks, and handwriting assessment.",
    management: "Targeted activities addressing the deficit area (visual perception training, motor coordination activities, or integrated VMI tasks), multisensory letter formation, tracing activities with graded complexity, and accommodations (graph paper, larger print, reduced copying demands).",
    complications: "VMI deficits may be misidentified as behavioral problems or learning disabilities without proper assessment. Some children may have isolated visual perception or motor coordination deficits rather than true integration difficulties.",
    clinicalPearls: [
      "The Beery VMI supplemental tests distinguish visual perception from motor coordination deficits.",
      "VMI scores below the 16th percentile warrant intervention.",
      "Address the specific deficit component — visual perception interventions won't help if the problem is motor coordination."
    ],
    examPitfalls: [
      "Treating VMI as a single construct without differentiating visual perception from motor coordination deficits.",
      "Not knowing the Beery VMI developmental sequence (vertical line → horizontal line → circle → cross → square → triangle → diamond).",
      "Confusing VMI with visual acuity — refer for eye exam if visual acuity is not confirmed."
    ],
    faqJson: [
      { question: "What is visual-motor integration?", answer: "VMI is the ability to coordinate visual perception with motor output, essential for tasks like handwriting, cutting, and copying. It is assessed using the Beery VMI test." },
      { question: "How does VMI affect school performance?", answer: "VMI deficits impact handwriting, copying from the board, math alignment, cutting, drawing, and other academic tasks requiring coordination of visual input with motor output." }
    ]
  },
  // ===== GERIATRIC OT (10 entries) =====
  {
    slug: "fall-prevention-geriatric",
    title: "Fall Prevention in Geriatric OT",
    category: "Geriatric OT",
    seoTitle: "Fall Prevention in Geriatric Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy fall prevention assessment and intervention for older adults.",
    seoKeywords: ["fall prevention", "geriatric OT", "home safety", "balance assessment", "fall risk"],
    overview: "Fall prevention is a critical area of geriatric OT practice. Falls are the leading cause of injury-related death and hospitalization in older adults. OTs address fall risk through comprehensive assessment of intrinsic factors (balance, vision, cognition, medications), extrinsic factors (home hazards, footwear), and activity-related factors (task demands, movement patterns). Intervention includes home modifications, activity modification, adaptive equipment, exercise programs, and education.",
    mechanismPhysiology: "Falls result from the interaction of intrinsic risk factors (age-related changes in balance, strength, vision, cognition, and proprioception) with extrinsic factors (environmental hazards) and behavioral factors (risk-taking, inactivity). Multiple risk factors compound fall probability.",
    clinicalRelevance: "OTs are uniquely positioned for fall prevention because they assess and address the person-environment-occupation interaction. Home modification and occupational performance analysis are OT-specific contributions to fall prevention programs.",
    signsSymptoms: "History of falls, near-falls or fear of falling, difficulty with transfers, unsteady gait, orthostatic hypotension, polypharmacy, visual impairments, cognitive decline, and environmental hazards in the home.",
    assessment: "Timed Up and Go (TUG), Berg Balance Scale, Falls Efficacy Scale, home safety assessment, medication review, vision screening, cognitive screening, and functional mobility observation during daily tasks.",
    management: "Home modifications (grab bars, lighting, stair rails, rug removal), adaptive equipment (raised toilet seat, shower bench, reacher), energy conservation and activity modification, balance and strengthening programs, footwear recommendations, vision referral, medication review collaboration, and fear of falling management.",
    complications: "Falls can result in hip fractures, head injuries, long-bone fractures, post-fall syndrome (fear of falling leading to activity restriction), loss of independence, and nursing home placement.",
    clinicalPearls: [
      "A TUG score >14 seconds indicates increased fall risk requiring intervention.",
      "Home modifications have the strongest evidence for fall prevention in community-dwelling older adults.",
      "Fear of falling can be as debilitating as falls themselves, leading to activity restriction and deconditioning."
    ],
    examPitfalls: [
      "Focusing only on exercise without addressing environmental hazards and activity modification.",
      "Not recognizing polypharmacy as a major modifiable fall risk factor.",
      "Ignoring the psychological impact of falls (fear of falling, activity avoidance)."
    ],
    faqJson: [
      { question: "What is the OT's role in fall prevention?", answer: "OTs assess the person-environment-occupation interaction to identify fall risks, provide home modifications, recommend adaptive equipment, teach safe activity techniques, and address fear of falling." },
      { question: "What home modifications reduce fall risk?", answer: "Key modifications include grab bars in bathrooms, adequate lighting (especially night lights), stair rails, rug removal or securing, raised toilet seats, shower benches, and decluttering walkways." }
    ]
  },
  {
    slug: "dementia-care-ot",
    title: "Dementia Care in Occupational Therapy",
    category: "Geriatric OT",
    seoTitle: "Dementia Care in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy assessment and intervention for individuals with dementia and their caregivers.",
    seoKeywords: ["dementia", "Alzheimer's", "cognitive decline", "caregiver training", "geriatric OT"],
    overview: "Dementia care in OT focuses on maintaining functional abilities, maximizing participation in meaningful activities, managing behavioral symptoms, adapting the environment, and supporting caregivers. OTs use evidence-based approaches including TCARE (Tailored Activity for Persons with Dementia and Caregivers), TAP (Tailored Activity Program), and environmental design principles to optimize function and quality of life throughout the disease trajectory.",
    mechanismPhysiology: "Dementia involves progressive neurodegeneration affecting memory, executive function, language, visuospatial abilities, and motor function. The pattern of decline varies by type (Alzheimer's, vascular, Lewy body, frontotemporal). Preserved procedural memory and long-term memory can be leveraged for intervention.",
    clinicalRelevance: "OTs address the functional impact of cognitive decline at each stage, from early compensatory strategy training through late-stage activity adaptation and caregiver support. Evidence supports OT intervention for reducing behavioral symptoms, maintaining functional independence, and reducing caregiver burden.",
    signsSymptoms: "Progressive decline in ADL and IADL performance, memory loss affecting daily function, difficulty with problem-solving and sequencing, behavioral symptoms (agitation, wandering, sundowning), and increased caregiver burden.",
    assessment: "Allen Cognitive Level Screen (ACLS), KELS, ADL and IADL performance evaluation, environmental assessment, caregiver burden assessment (Zarit Burden Interview), and behavioral observation.",
    management: "Graded activity modification matching cognitive level, environmental simplification and cueing, routine establishment, caregiver education and coaching, adaptive equipment, safety interventions (stove shut-offs, door alarms), meaningful activity programs, and sensory stimulation approaches.",
    complications: "Caregiver burnout, safety risks (wandering, cooking hazards, driving), medication management errors, malnutrition, social isolation, and premature institutionalization.",
    clinicalPearls: [
      "Match activities to the person's current cognitive level — activities that are too easy are boring, too hard are frustrating.",
      "Leverage procedural (implicit) memory — familiar, well-learned activities are preserved longest.",
      "Environmental modifications can significantly extend independent function and reduce behavioral symptoms."
    ],
    examPitfalls: [
      "Treating dementia as a homogeneous condition — different types have different patterns of decline.",
      "Focusing only on the person with dementia without addressing caregiver needs.",
      "Setting restorative goals for a progressive condition — focus on maintenance and adaptation."
    ],
    faqJson: [
      { question: "How does OT help people with dementia?", answer: "OTs maintain function through activity adaptation, environmental modification, routine establishment, caregiver coaching, and meaningful activity programs matched to the person's cognitive level." },
      { question: "What is the Tailored Activity Program (TAP)?", answer: "TAP is an evidence-based OT intervention that trains caregivers to set up and provide activities matched to the person with dementia's abilities and interests, reducing behavioral symptoms and caregiver burden." }
    ]
  },
  {
    slug: "hip-fracture-rehabilitation",
    title: "Hip Fracture Rehabilitation in OT",
    category: "Geriatric OT",
    seoTitle: "Hip Fracture Rehabilitation in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention following hip fracture and hip replacement in older adults.",
    seoKeywords: ["hip fracture", "hip replacement", "hip precautions", "geriatric rehabilitation", "OT"],
    overview: "Hip fracture rehabilitation in OT focuses on restoring functional independence while adhering to surgical precautions. OTs address ADL retraining (dressing, bathing, toileting, transfers), adaptive equipment prescription, hip precaution education, home modification recommendations, and fall prevention. Post-surgical approaches include hip arthroplasty (total hip replacement) and internal fixation.",
    mechanismPhysiology: "Hip fractures typically occur at the femoral neck or intertrochanteric region, often resulting from low-energy falls in osteoporotic bone. Surgical approaches include posterior (most common, requiring posterior hip precautions) and anterior (fewer precautions). Bone healing and soft tissue repair guide rehabilitation timelines.",
    clinicalRelevance: "Hip fracture is a major cause of disability and mortality in older adults. OTs play a critical role in restoring independence and preventing secondary complications through functional training, equipment provision, and discharge planning.",
    signsSymptoms: "Post-surgical pain, limited hip ROM, weight-bearing restrictions, difficulty with transfers and mobility, inability to perform lower body ADLs independently, and fear of falling.",
    assessment: "ADL performance evaluation with attention to hip precautions, transfer assessment, home safety evaluation, fall risk assessment, pain assessment, and functional mobility observation.",
    management: "Hip precaution education (posterior approach: no hip flexion >90°, no adduction past midline, no internal rotation), adaptive equipment (long-handled reacher, sock aid, long-handled shoehorn, raised toilet seat, hip kit), transfer training, lower body dressing techniques, bathing adaptations, and progressive functional activity engagement.",
    complications: "Hip dislocation (from precaution violation), DVT, wound infection, delirium, deconditioning, pressure injuries, and loss of independence leading to institutionalization.",
    clinicalPearls: [
      "Posterior approach precautions: no flexion >90°, no adduction past midline, no internal rotation — teach as 'don't bend, don't cross, don't twist.'",
      "Anterior approach may have fewer precautions — always verify with the surgeon.",
      "A complete 'hip kit' typically includes: long-handled reacher, sock aid, long shoehorn, dressing stick, and elastic shoelaces."
    ],
    examPitfalls: [
      "Not knowing posterior hip precautions — this is high-yield NBCOT content.",
      "Confusing anterior and posterior approach precautions.",
      "Forgetting to assess and modify the home environment before discharge."
    ],
    faqJson: [
      { question: "What are posterior hip precautions?", answer: "After posterior approach hip surgery: avoid hip flexion beyond 90°, do not cross legs past midline (adduction), and do not rotate the leg inward (internal rotation). These prevent dislocation during healing." },
      { question: "What adaptive equipment is recommended after hip replacement?", answer: "A typical hip kit includes a long-handled reacher, sock aid, long-handled shoehorn, dressing stick, raised toilet seat, and shower bench." }
    ]
  },
  {
    slug: "aging-in-place",
    title: "Aging in Place and Home Modification",
    category: "Geriatric OT",
    seoTitle: "Aging in Place and Home Modification in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy home modification and aging in place services for older adults.",
    seoKeywords: ["aging in place", "home modification", "home safety", "universal design", "geriatric OT"],
    overview: "Aging in place refers to the ability of older adults to remain in their homes safely and independently as they age. OTs are experts in assessing the fit between the person's abilities and their home environment, recommending modifications that support safety, independence, and participation. Services include comprehensive home assessments, modification recommendations, adaptive equipment provision, and caregiver education.",
    mechanismPhysiology: "The Person-Environment-Occupation (PEO) model provides the theoretical foundation. As person capacities decline with aging, the environment must be adapted to maintain the occupational performance that enables independent living. Environmental press theory (Lawton & Nahemow) describes how environmental demands interact with individual competence.",
    clinicalRelevance: "Home modification is one of the most evidence-supported OT interventions for older adults, reducing falls, hospitalizations, and nursing home admissions. OTs provide this service across settings including home health, outpatient, and community-based programs.",
    signsSymptoms: "Difficulty navigating stairs, bathroom falls or near-falls, inability to manage cooking safely, difficulty entering/exiting the home, poor lighting, cluttered walkways, and progressive need for caregiver assistance.",
    assessment: "Comprehensive home safety assessment, functional assessment in the home environment, identification of architectural barriers, evaluation of lighting, floor surfaces, bathroom safety, kitchen accessibility, and entry/exit points.",
    management: "Structural modifications (grab bars, ramps, stair lifts, walk-in showers, widened doorways), minor modifications (lever handles, rocker switches, raised toilet seats, non-slip mats), technology solutions (smart home systems, medical alert systems), universal design principles, and caregiver training.",
    complications: "Cost barriers to home modifications, rental housing limitations, resistance to change from the older adult, and progressive decline exceeding modification capacity.",
    clinicalPearls: [
      "Bathroom modifications (grab bars, walk-in shower, raised toilet) provide the highest safety return on investment.",
      "Universal design benefits all household members, not just the older adult.",
      "Start with low-cost, high-impact modifications — decluttering, improving lighting, and securing rugs."
    ],
    examPitfalls: [
      "Not assessing the actual home environment — clinic-based assessment alone is insufficient.",
      "Recommending expensive modifications without considering cost-effective alternatives.",
      "Ignoring the person's preferences and daily routines when recommending modifications."
    ],
    faqJson: [
      { question: "What is the OT's role in aging in place?", answer: "OTs assess the fit between a person's abilities and their home environment, recommending modifications, adaptive equipment, and strategies that support safe, independent living." },
      { question: "What are the most important home modifications for safety?", answer: "Bathroom safety modifications (grab bars, non-slip surfaces, shower bench), adequate lighting throughout the home, stair safety features, and removal of tripping hazards are highest priority." }
    ]
  },
  {
    slug: "low-vision-rehabilitation",
    title: "Low Vision Rehabilitation in OT",
    category: "Geriatric OT",
    seoTitle: "Low Vision Rehabilitation in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for low vision, including magnification, lighting, and functional adaptation.",
    seoKeywords: ["low vision", "vision rehabilitation", "magnification", "macular degeneration", "geriatric OT"],
    overview: "Low vision rehabilitation in OT addresses functional limitations caused by visual impairment that cannot be fully corrected with glasses, surgery, or medical treatment. OTs help clients maintain independence in daily activities through environmental modifications, assistive technology, compensatory strategies, and activity adaptation. Common conditions include age-related macular degeneration (AMD), diabetic retinopathy, glaucoma, and cataracts.",
    mechanismPhysiology: "Low vision is defined as best-corrected visual acuity of 20/70 or worse in the better eye. Central vision loss (AMD) affects reading, facial recognition, and detail tasks. Peripheral vision loss (glaucoma) affects mobility and orientation. Understanding the specific visual deficit guides intervention selection.",
    clinicalRelevance: "OTs address the functional impact of vision loss on daily activities, safety, and quality of life. Low vision rehabilitation is a growing specialty as the aging population increases. OTs complement optometrists and ophthalmologists by translating visual capabilities into functional performance.",
    signsSymptoms: "Difficulty reading, trouble recognizing faces, problems with cooking and medication management, falls related to visual impairment, difficulty with money management, inability to drive, social isolation, and depression.",
    assessment: "Functional vision assessment, ADL performance with visual tasks, contrast sensitivity testing, visual field assessment, environmental lighting evaluation, and self-care and IADL observation.",
    management: "Magnification devices (optical and electronic), task lighting optimization, high contrast adaptations, large print materials, tactile marking systems, eccentric viewing training, organizational strategies, cooking safety adaptations, and community resource referral.",
    complications: "Depression related to vision loss, social isolation, falls from visual impairment, medication errors, malnutrition from cooking difficulty, and financial management errors.",
    clinicalPearls: [
      "Improving task lighting is often the single most effective low vision intervention.",
      "Eccentric viewing training teaches clients with central vision loss to use their remaining peripheral vision effectively.",
      "High contrast (black on white or white on black) significantly improves visibility for most low vision conditions."
    ],
    examPitfalls: [
      "Not distinguishing between central and peripheral vision loss — interventions differ significantly.",
      "Focusing only on magnification without addressing lighting, contrast, and environmental modifications.",
      "Forgetting the psychosocial impact of vision loss."
    ],
    faqJson: [
      { question: "How does OT help people with low vision?", answer: "OTs address the functional impact of vision loss through environmental modifications, assistive technology, compensatory strategies, and activity adaptations that maximize remaining vision for daily tasks." },
      { question: "What is the most important environmental modification for low vision?", answer: "Improving task lighting is often the single most effective modification, as most visual tasks benefit from increased, directed lighting without glare." }
    ]
  },
  {
    slug: "joint-protection-energy-conservation",
    title: "Joint Protection & Energy Conservation",
    category: "Geriatric OT",
    seoTitle: "Joint Protection and Energy Conservation in OT — OT Encyclopedia",
    seoDescription: "Guide to joint protection and energy conservation techniques in occupational therapy for arthritis and chronic conditions.",
    seoKeywords: ["joint protection", "energy conservation", "arthritis", "work simplification", "fatigue management", "OT"],
    overview: "Joint protection and energy conservation are foundational OT interventions for clients with arthritis, chronic pain, fatigue-related conditions, and cardiopulmonary disease. Joint protection principles minimize stress on affected joints during daily activities. Energy conservation and work simplification techniques help clients manage fatigue and maintain participation in valued activities.",
    mechanismPhysiology: "Joint protection reduces mechanical stress by distributing forces across larger, stronger joints, avoiding sustained positions, and using adaptive equipment to reduce joint strain. Energy conservation manages limited physiological reserves by optimizing activity patterns, reducing unnecessary energy expenditure, and balancing rest with activity.",
    clinicalRelevance: "These techniques are core OT interventions for rheumatoid arthritis, osteoarthritis, chronic fatigue syndrome, multiple sclerosis, COPD, heart failure, and fibromyalgia. They enable continued participation in meaningful activities despite physical limitations.",
    signsSymptoms: "Joint pain with activity, joint deformity, fatigue limiting daily activities, shortness of breath with exertion, and progressive difficulty maintaining daily routines.",
    assessment: "Joint assessment (ROM, swelling, deformity, pain), fatigue assessment, ADL and IADL performance evaluation, activity analysis, and energy expenditure observation during tasks.",
    management: "Joint protection principles: respect pain, maintain ROM, use strongest/largest joints, avoid sustained positions, reduce force, use assistive devices. Energy conservation: plan and prioritize, pace activities, use proper body mechanics, modify task methods, rest before fatigue, organize work spaces. Adaptive equipment: built-up handles, jar openers, ergonomic tools.",
    complications: "Non-compliance due to lifestyle changes, progressive disease requiring ongoing adaptation, deformity progression if joint protection is not followed, and deconditioning from excessive rest.",
    clinicalPearls: [
      "The '4 Ps' of energy conservation: Plan, Prioritize, Pace, Position.",
      "Joint protection is preventive — teach principles before significant deformity occurs.",
      "Adaptive equipment should be practical, acceptable to the client, and readily available."
    ],
    examPitfalls: [
      "Not distinguishing joint protection (reducing mechanical stress) from energy conservation (managing fatigue).",
      "Applying joint protection principles to inappropriate diagnoses.",
      "Recommending rest without balanced activity — deconditioning is a risk."
    ],
    faqJson: [
      { question: "What are joint protection principles?", answer: "Joint protection involves using larger/stronger joints, avoiding sustained positions, distributing force, reducing effort, respecting pain signals, and using adaptive equipment to minimize joint stress during daily activities." },
      { question: "What are the 4 Ps of energy conservation?", answer: "Plan (organize activities), Prioritize (focus on important tasks), Pace (alternate activity with rest), and Position (use optimal body mechanics and ergonomics)." }
    ]
  },
  {
    slug: "cognitive-rehabilitation-geriatric",
    title: "Cognitive Rehabilitation in Geriatric OT",
    category: "Geriatric OT",
    seoTitle: "Cognitive Rehabilitation in Geriatric OT — OT Encyclopedia",
    seoDescription: "Guide to cognitive rehabilitation approaches in geriatric occupational therapy for age-related and pathological cognitive decline.",
    seoKeywords: ["cognitive rehabilitation", "geriatric OT", "memory strategies", "cognitive compensation", "executive function"],
    overview: "Cognitive rehabilitation in geriatric OT addresses functional impacts of age-related cognitive changes, mild cognitive impairment (MCI), stroke-related cognitive deficits, and traumatic brain injury in older adults. OTs use restorative, compensatory, and adaptive approaches to maintain cognitive function and support occupational participation. Multicomponent interventions combining cognitive training with functional activity are most effective.",
    mechanismPhysiology: "Age-related cognitive changes affect processing speed, working memory, executive function, and episodic memory while preserving crystallized intelligence and procedural memory. Pathological conditions (stroke, TBI, MCI) cause additional deficits requiring targeted rehabilitation. Neuroplasticity supports cognitive improvement through targeted training, though capacity decreases with age.",
    clinicalRelevance: "OTs uniquely address cognitive deficits within the context of daily occupational performance. While neuropsychologists assess and characterize cognitive deficits, OTs translate these findings into functional interventions that maintain independence in daily activities.",
    signsSymptoms: "Difficulty with medication management, getting lost in familiar environments, difficulty with finances, forgetting appointments, safety concerns (leaving stove on), and reduced efficiency in complex daily tasks.",
    assessment: "Montreal Cognitive Assessment (MoCA), ACLS, KELS, cognitive performance during ADL/IADL observation, Executive Function Performance Test (EFPT), and medication management assessment.",
    management: "Compensatory strategy training (calendars, reminders, routines), environmental modifications (labeling, organization systems), spaced retrieval training, errorless learning, task simplification, technology supports (smartphone reminders, medication dispensers), and cognitive exercise programs integrated into daily activities.",
    complications: "Progressive cognitive decline overwhelming compensatory strategies, safety risks from cognitive impairment, caregiver burden, and driving cessation issues.",
    clinicalPearls: [
      "Compensatory approaches are more functional than drill-based cognitive training for most geriatric clients.",
      "Spaced retrieval training is effective for teaching new information to individuals with mild-moderate dementia.",
      "Always address medication management — cognitive decline significantly impacts medication adherence and safety."
    ],
    examPitfalls: [
      "Confusing restorative approaches (improving underlying capacity) with compensatory approaches (using strategies to bypass deficits).",
      "Applying cognitive drill exercises without connecting them to functional outcomes.",
      "Not considering that cognitive deficits affect all areas of daily function, not just 'cognitive tasks.'"
    ],
    faqJson: [
      { question: "How does OT address cognitive decline in older adults?", answer: "OTs use compensatory strategies, environmental modifications, technology supports, and activity adaptations to maintain independence despite cognitive changes, focusing on functional performance rather than isolated cognitive skills." },
      { question: "What is spaced retrieval training?", answer: "Spaced retrieval training is a technique that uses progressively increasing intervals to help individuals with memory impairment learn and retain specific information, such as safety instructions or compensatory strategies." }
    ]
  },
  {
    slug: "driving-rehabilitation",
    title: "Driving Rehabilitation in OT",
    category: "Geriatric OT",
    seoTitle: "Driving Rehabilitation and Cessation in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy driving assessment, rehabilitation, and cessation planning for older adults.",
    seoKeywords: ["driving rehabilitation", "driver rehabilitation specialist", "driving cessation", "older driver", "OT"],
    overview: "Driving rehabilitation is a specialized OT practice area addressing the ability of individuals to safely operate a motor vehicle. Certified Driver Rehabilitation Specialists (CDRS) conduct comprehensive driving evaluations including clinical assessment and behind-the-wheel evaluation. OTs also address driving cessation planning, alternative transportation, and community mobility for individuals who can no longer drive safely.",
    mechanismPhysiology: "Safe driving requires integration of visual, cognitive, physical, and perceptual skills. Key components include visual acuity and peripheral vision, divided and selective attention, processing speed, executive function, motor strength and coordination, and reaction time. Age-related changes and medical conditions can impair these abilities.",
    clinicalRelevance: "Driving is a critical IADL that impacts independence, community access, and quality of life. Loss of driving privilege is associated with depression, social isolation, and decreased community participation. OTs address both driving ability and the transition to non-driving through community mobility planning.",
    signsSymptoms: "Getting lost on familiar routes, new dents or scratches on the vehicle, near-misses, running red lights or stop signs, difficulty judging gaps in traffic, slow reaction time, and anxiety while driving.",
    assessment: "Clinical assessments include Trail Making Tests, Useful Field of View (UFOV), visual screening, motor and physical assessment, and cognitive screening. Behind-the-wheel evaluation assesses actual driving performance in a dual-control vehicle. Simulated driving may be available in some settings.",
    management: "Vehicle modifications (hand controls, spinner knobs, mirrors, pedal extensions), adaptive strategies for specific deficits, graduated driving restrictions (daylight only, familiar routes), driving cessation counseling, and community mobility planning (public transit training, ride-sharing, volunteer driver programs).",
    complications: "Resistance to driving cessation, family conflict about driving ability, depression and isolation after driving cessation, and limited alternative transportation in rural areas.",
    clinicalPearls: [
      "The CDRS (Certified Driver Rehabilitation Specialist) certification is the gold standard for OTs in driving rehabilitation.",
      "Driving cessation should be approached as a transition, with alternative community mobility plans in place.",
      "The Useful Field of View (UFOV) is a strong predictor of crash risk in older drivers."
    ],
    examPitfalls: [
      "Not knowing that driving assessment requires specialized certification (CDRS).",
      "Addressing driving cessation without planning alternative community mobility.",
      "Relying solely on clinical assessments without behind-the-wheel evaluation."
    ],
    faqJson: [
      { question: "What does a driving rehabilitation specialist do?", answer: "A CDRS (typically an OT) conducts comprehensive driving evaluations including clinical and behind-the-wheel assessments, recommends vehicle modifications, provides adaptive driving training, and counsels on driving cessation when necessary." },
      { question: "When should an older adult be referred for driving evaluation?", answer: "Referral is appropriate when there are concerns about vision, cognition, physical function, or driving behaviors that may impact safe driving, such as getting lost, near-misses, or new vehicle damage." }
    ]
  },
  {
    slug: "stroke-rehabilitation-ot",
    title: "Stroke Rehabilitation in OT",
    category: "Geriatric OT",
    seoTitle: "Stroke Rehabilitation in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Comprehensive guide to occupational therapy assessment and intervention following stroke across the continuum of care.",
    seoKeywords: ["stroke rehabilitation", "CVA", "hemiplegia", "occupational therapy", "ADL retraining"],
    overview: "Stroke rehabilitation in OT addresses the motor, sensory, cognitive, perceptual, and psychosocial consequences of cerebrovascular accident (CVA) across the continuum of care — from acute hospital through inpatient rehabilitation, outpatient, home health, and community reintegration. OTs restore independence in ADLs, IADLs, and meaningful life roles through evidence-based interventions.",
    mechanismPhysiology: "Stroke results from ischemic (85%) or hemorrhagic (15%) disruption of cerebral blood flow. The resulting brain damage produces contralateral hemiplegia/hemiparesis, sensory loss, visual field deficits, aphasia, apraxia, neglect, and cognitive impairments depending on the affected vascular territory. Neuroplasticity enables functional recovery, particularly in the first 3-6 months.",
    clinicalRelevance: "Stroke is a leading cause of adult disability. OTs address the full spectrum of stroke sequelae, from basic ADL retraining through community reintegration. Evidence-based OT interventions include CIMT, mirror therapy, task-specific training, and cognitive-perceptual rehabilitation.",
    signsSymptoms: "Hemiplegia or hemiparesis, sensory loss, visual field deficits (hemianopsia), unilateral neglect, aphasia, apraxia, cognitive deficits, dysphagia, depression, and decreased independence in ADLs.",
    assessment: "Fugl-Meyer Assessment, NIHSS, FIM, Barthel Index, COPM, visual field testing, neglect assessments (line bisection, cancellation tests), cognitive screening (MoCA), and ADL/IADL performance evaluation.",
    management: "Neurodevelopmental treatment (NDT), task-specific training, CIMT for appropriate candidates, bilateral training, mirror therapy, cognitive-perceptual rehabilitation, ADL retraining with one-handed techniques, adaptive equipment, caregiver training, and community reintegration programs.",
    complications: "Shoulder subluxation, CRPS, spasticity, post-stroke depression, learned non-use, contractures, falls, and social isolation.",
    clinicalPearls: [
      "The greatest neurological recovery occurs in the first 3-6 months — intensive, targeted intervention during this window is critical.",
      "Always screen for unilateral neglect — it significantly impacts functional outcomes and safety.",
      "Post-stroke depression affects approximately 33% of survivors and should be actively assessed and addressed."
    ],
    examPitfalls: [
      "Not differentiating between left and right hemisphere stroke presentations.",
      "Confusing neglect with hemianopsia — clients with neglect are unaware of the deficit.",
      "Focusing only on motor recovery without addressing cognitive, perceptual, and psychosocial factors."
    ],
    faqJson: [
      { question: "What is the OT's role in stroke rehabilitation?", answer: "OTs address all aspects of daily function affected by stroke — from basic self-care retraining through cognitive rehabilitation, adaptive equipment, caregiver education, and community reintegration." },
      { question: "What is unilateral neglect?", answer: "Unilateral neglect is a perceptual deficit (usually after right hemisphere stroke) where the person is unaware of stimuli on the contralateral (usually left) side, affecting safety, self-care, and mobility." }
    ]
  },
  {
    slug: "palliative-care-ot",
    title: "Palliative and End-of-Life Care in OT",
    category: "Geriatric OT",
    seoTitle: "Palliative and End-of-Life Care in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy role in palliative care, hospice, and end-of-life care.",
    seoKeywords: ["palliative care", "hospice", "end of life", "quality of life", "occupational therapy"],
    overview: "Palliative and end-of-life OT focuses on maintaining quality of life, meaningful activity participation, comfort, and dignity for individuals with life-limiting illnesses. OTs address symptom management (fatigue, pain, dyspnea), functional maintenance, adaptive equipment, environmental modification, caregiver support, and psychosocial needs. Services may be provided alongside curative treatment (palliative) or in the context of comfort care only (hospice).",
    mechanismPhysiology: "Progressive disease processes lead to declining physical, cognitive, and emotional function. OTs apply occupational science principles to understand how meaningful occupation contributes to quality of life, identity, and dignity even as physical capacities diminish.",
    clinicalRelevance: "OTs bring a unique perspective to palliative care by focusing on what the person CAN do rather than what they are losing. Maintaining engagement in meaningful activities preserves identity, purpose, and quality of life throughout the illness trajectory.",
    signsSymptoms: "Progressive functional decline, fatigue, pain, dyspnea, cognitive changes, loss of roles and meaningful activities, grief and existential distress, and caregiver strain.",
    assessment: "COPM, quality of life measures, fatigue assessment, pain assessment, functional capacity evaluation, and needs assessment for equipment and environmental modifications.",
    management: "Activity adaptation to match current abilities, energy conservation and fatigue management, positioning for comfort, adaptive equipment to maintain independence, creative activity engagement, legacy projects, caregiver education, and environmental modifications for safety and comfort.",
    complications: "Caregiver burnout, rapid functional decline outpacing intervention, ethical dilemmas around maintaining vs. withdrawing activities, and emotional impact on the therapist.",
    clinicalPearls: [
      "Focus on quality of life and meaningful participation rather than functional restoration.",
      "Ask 'What matters most to you?' rather than setting therapist-driven goals.",
      "Legacy projects (memory books, recorded messages, handprint art) can be deeply meaningful for clients and families."
    ],
    examPitfalls: [
      "Setting restorative goals in a palliative context — focus on maintenance, adaptation, and quality of life.",
      "Not recognizing OT's role in palliative care beyond physical rehabilitation.",
      "Ignoring the caregiver's needs — they are also the OT's client."
    ],
    faqJson: [
      { question: "What does OT do in palliative care?", answer: "OTs maintain quality of life by adapting meaningful activities to current abilities, managing symptoms like fatigue and pain, providing adaptive equipment, modifying environments, and supporting caregivers." },
      { question: "What is the difference between palliative care and hospice?", answer: "Palliative care focuses on comfort and quality of life and can be provided alongside curative treatment. Hospice is a specific type of palliative care for individuals with a terminal prognosis (usually <6 months), focusing on comfort care without curative intent." }
    ]
  },
  // ===== MENTAL HEALTH OT (10 entries) =====
  {
    slug: "mental-health-recovery-model",
    title: "Recovery Model in Mental Health OT",
    category: "Mental Health OT",
    seoTitle: "Recovery Model in Mental Health OT — OT Encyclopedia",
    seoDescription: "Guide to the recovery model and its application in mental health occupational therapy practice.",
    seoKeywords: ["recovery model", "mental health OT", "psychiatric rehabilitation", "recovery-oriented", "empowerment"],
    overview: "The recovery model in mental health OT emphasizes hope, self-determination, empowerment, and meaningful participation as the foundations of mental health recovery. Unlike the medical model focused on symptom reduction, the recovery model defines recovery as 'a deeply personal process of changing one's attitudes, values, feelings, goals, skills, and/or roles to live a satisfying, hopeful, and contributing life.' OTs align naturally with recovery principles through their focus on occupation, participation, and client-centred practice.",
    mechanismPhysiology: "Mental health recovery is conceptualized as a non-linear process involving personal transformation rather than cure. Key processes include connectedness, hope, identity, meaning, and empowerment (CHIME framework). Occupation serves as both a means of recovery and an indicator of recovery progress.",
    clinicalRelevance: "OTs are well-positioned to implement recovery-oriented practice because the profession's core values of occupation, participation, and client-centredness align with recovery principles. OTs facilitate recovery through meaningful activity engagement, skill development, role resumption, and community integration.",
    signsSymptoms: "Mental health conditions affecting occupational participation, role function, self-care, productivity, leisure engagement, social interaction, and self-identity.",
    assessment: "COPM, OSA, Recovery Assessment Scale, Role Checklist, Interest Checklist, and occupational performance evaluation focusing on meaningful participation rather than symptom severity.",
    management: "Client-centred goal setting, supported employment and education, life skills training, leisure exploration, social skills groups, community integration, peer support facilitation, wellness self-management, and occupational engagement programs.",
    complications: "System-level barriers to recovery-oriented practice, stigma, limited community resources, and balancing risk management with self-determination.",
    clinicalPearls: [
      "Recovery is defined by the individual — the therapist's role is to facilitate, not prescribe.",
      "The CHIME framework: Connectedness, Hope, Identity, Meaning, Empowerment.",
      "Occupation is both the means and the end of recovery — engagement in meaningful activity drives recovery."
    ],
    examPitfalls: [
      "Confusing recovery (living well despite symptoms) with cure (absence of symptoms).",
      "Not recognizing recovery as a non-linear process with setbacks.",
      "Applying a medical model approach (symptom focus) in a recovery-oriented setting."
    ],
    faqJson: [
      { question: "What is the recovery model in mental health?", answer: "The recovery model defines recovery as a personal process of developing a meaningful, hopeful, contributing life, regardless of symptom presence. It emphasizes hope, self-determination, empowerment, and participation." },
      { question: "How do OTs support mental health recovery?", answer: "OTs support recovery through meaningful activity engagement, role resumption, skill development, community integration, and client-centred goal setting that respects the individual's definition of recovery." }
    ]
  },
  {
    slug: "cognitive-behavioral-approach-ot",
    title: "Cognitive-Behavioral Approaches in OT",
    category: "Mental Health OT",
    seoTitle: "Cognitive-Behavioral Approaches in OT — OT Encyclopedia",
    seoDescription: "Guide to cognitive-behavioral therapy principles and application in occupational therapy practice.",
    seoKeywords: ["CBT", "cognitive-behavioral", "mental health OT", "thought patterns", "behavioral activation"],
    overview: "Cognitive-behavioral approaches in OT apply principles of cognitive-behavioral therapy (CBT) within the context of occupation-based intervention. OTs use cognitive restructuring, behavioral activation, graded exposure, activity scheduling, and problem-solving training to address the cognitive and behavioral patterns that impair occupational performance. These approaches are integrated into functional activities rather than delivered as standalone psychotherapy.",
    mechanismPhysiology: "CBT is based on the cognitive model: thoughts (cognitions) influence emotions and behaviors. Maladaptive thought patterns (cognitive distortions) maintain psychological distress and impair occupational participation. Changing thought patterns and behavioral responses improves emotional regulation and functional performance.",
    clinicalRelevance: "OTs apply CBT principles to occupation-based challenges such as anxiety about ADL performance, avoidance of work tasks, catastrophizing about pain, and cognitive patterns maintaining functional limitations. This approach is within the OT scope when applied to occupational performance issues.",
    signsSymptoms: "Anxiety affecting task performance, avoidance behaviors limiting participation, catastrophic thinking about abilities, depression-related activity withdrawal, and fear-avoidance patterns (e.g., fear of falling, pain catastrophizing).",
    assessment: "Occupational performance assessment identifying cognitive-behavioral barriers, self-report measures of anxiety and depression, activity logs documenting behavioral patterns, and pain catastrophizing scales.",
    management: "Behavioral activation (scheduling meaningful activities to counter depression-related withdrawal), graded exposure (systematic desensitization to feared activities), cognitive restructuring (challenging unhelpful thoughts about abilities), activity pacing, problem-solving training, and relaxation techniques integrated into daily routine.",
    complications: "OT scope limitations — complex psychological issues should be referred to psychology. Client resistance to examining thought patterns. Need for adequate training in CBT principles.",
    clinicalPearls: [
      "Behavioral activation is one of the most effective interventions for depression — OTs naturally implement this through activity engagement.",
      "Graded exposure follows a hierarchy from least to most anxiety-provoking, applied to functional activities.",
      "Apply CBT within the OT scope — focus on thoughts and behaviors that impact occupational performance."
    ],
    examPitfalls: [
      "Confusing OT-applied CBT (occupation-focused) with psychotherapy (mental health treatment).",
      "Not recognizing behavioral activation as a CBT technique commonly used in OT.",
      "Applying CBT without understanding the cognitive model (thoughts → feelings → behaviors)."
    ],
    faqJson: [
      { question: "How do OTs use CBT principles?", answer: "OTs apply CBT within occupation-based intervention, using behavioral activation, graded exposure, cognitive restructuring, and activity scheduling to address thought and behavior patterns that impair daily function." },
      { question: "Is CBT within the OT scope of practice?", answer: "Yes, when applied to occupational performance issues. OTs address cognitive-behavioral patterns affecting daily function, while complex psychological disorders are referred to mental health specialists." }
    ]
  },
  {
    slug: "stress-management-ot",
    title: "Stress Management in OT",
    category: "Mental Health OT",
    seoTitle: "Stress Management in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to stress management techniques and interventions used in occupational therapy practice.",
    seoKeywords: ["stress management", "relaxation techniques", "coping strategies", "occupational therapy", "mental health"],
    overview: "Stress management in OT encompasses assessment and intervention for the impact of stress on occupational performance and health. OTs teach relaxation techniques, coping strategies, time management, assertiveness skills, and lifestyle modification to reduce stress and improve function. Stress management is applied across practice settings including mental health, workplace wellness, chronic pain, and rehabilitation.",
    mechanismPhysiology: "Chronic stress activates the hypothalamic-pituitary-adrenal (HPA) axis and sympathetic nervous system, producing cortisol and catecholamines that impair immune function, cognitive performance, sleep, and physical health. Relaxation techniques activate the parasympathetic nervous system, countering stress responses.",
    clinicalRelevance: "Stress significantly impacts occupational performance across all life domains. OTs address stress management within the context of daily activities, work-life balance, and health management, using occupation as both the target and the medium of intervention.",
    signsSymptoms: "Difficulty concentrating, sleep disturbances, fatigue, irritability, physical tension (headaches, muscle tension), decreased work performance, relationship difficulties, and withdrawal from meaningful activities.",
    assessment: "Stress impact assessment, occupational balance evaluation, time use analysis, coping strategy inventory, sleep assessment, and identification of stress-related occupational dysfunction.",
    management: "Progressive muscle relaxation, diaphragmatic breathing, mindfulness-based stress reduction, activity scheduling and time management, leisure engagement, sleep hygiene education, assertiveness training, work-life balance strategies, and lifestyle redesign.",
    complications: "Chronic stress leading to burnout, anxiety disorders, depression, cardiovascular disease, and immune dysfunction. Stress management requires ongoing practice and lifestyle integration.",
    clinicalPearls: [
      "Teach stress management as an active skill, not a passive state — regular practice is essential.",
      "Occupational balance (meaningful distribution of self-care, productivity, and leisure) is a key stress management concept.",
      "Lifestyle Redesign, developed by USC, is an evidence-based OT program addressing stress through occupation."
    ],
    examPitfalls: [
      "Treating stress management as a one-time intervention rather than an ongoing practice.",
      "Not connecting stress management to occupational performance outcomes.",
      "Focusing only on relaxation techniques without addressing lifestyle and occupational factors."
    ],
    faqJson: [
      { question: "How does OT address stress management?", answer: "OTs assess how stress impacts daily function and teach relaxation techniques, coping strategies, time management, and lifestyle modifications within the context of meaningful daily activities." },
      { question: "What is occupational balance?", answer: "Occupational balance is the satisfying distribution of time and energy across self-care, productivity, leisure, and rest activities, considered essential for health and stress management." }
    ]
  },
  {
    slug: "group-therapy-mental-health-ot",
    title: "Group Therapy in Mental Health OT",
    category: "Mental Health OT",
    seoTitle: "Group Therapy in Mental Health OT — OT Encyclopedia",
    seoDescription: "Guide to OT group therapy formats, leadership, and therapeutic factors in mental health settings.",
    seoKeywords: ["group therapy", "mental health OT", "therapeutic groups", "group dynamics", "psychoeducation"],
    overview: "Group therapy is a primary modality in mental health OT, providing opportunities for social interaction, skill development, peer support, and therapeutic activity engagement. OTs design and lead groups addressing life skills, social skills, coping strategies, vocational readiness, leisure exploration, and wellness management. Group formats include task groups, psychoeducational groups, support groups, and activity-based groups.",
    mechanismPhysiology: "Groups provide therapeutic factors identified by Yalom: universality, altruism, instillation of hope, imparting information, corrective recapitulation of the family group, development of socializing techniques, imitative behavior, interpersonal learning, group cohesiveness, catharsis, and existential factors. OT groups additionally offer occupation-based therapeutic value through shared activity engagement.",
    clinicalRelevance: "OTs are frequently responsible for designing and leading therapeutic groups in mental health settings. The ability to plan, implement, and evaluate groups is a core competency. OT groups are distinguished from other disciplines' groups by their emphasis on occupation and doing.",
    signsSymptoms: "Social isolation, limited social skills, difficulty with daily living skills, poor coping strategies, lack of leisure engagement, and need for vocational preparation.",
    assessment: "Assessment of group readiness, social skills evaluation, identification of skill deficits, and matching group type to individual goals.",
    management: "Task groups (collaborative projects developing social and process skills), psychoeducational groups (teaching specific skills like medication management, budgeting), activity groups (creative arts, cooking, exercise), social skills groups, and support groups. Group leadership involves planning, facilitation, and processing of group dynamics.",
    complications: "Group conflict, dominant or passive members, resistance to participation, safety concerns, and difficulty generalizing skills from group to real-world settings.",
    clinicalPearls: [
      "Cole's 7-step group format: introduction, activity, sharing, processing, generalizing, application, summary.",
      "Match group level (parallel, project, egocentric-cooperative, cooperative, mature) to members' social interaction capacity.",
      "Activity-based groups are OT's unique contribution — doing together promotes therapeutic change."
    ],
    examPitfalls: [
      "Not knowing Cole's 7-step group format — commonly tested on NBCOT.",
      "Confusing Mosey's group developmental levels (parallel → project → egocentric-cooperative → cooperative → mature).",
      "Not distinguishing OT groups (occupation-based) from verbal psychotherapy groups."
    ],
    faqJson: [
      { question: "What types of groups do OTs lead in mental health?", answer: "OTs lead task groups, psychoeducational groups, activity groups, social skills groups, and life skills groups. The distinguishing feature is the use of occupation and meaningful activity as the therapeutic medium." },
      { question: "What is Cole's 7-step group format?", answer: "Cole's format includes: introduction (warm-up, set expectations), activity (therapeutic task), sharing (report on experience), processing (express feelings), generalizing (connect to life), application (plan real-world use), and summary (key takeaways)." }
    ]
  },
  {
    slug: "supported-employment-ot",
    title: "Supported Employment in OT",
    category: "Mental Health OT",
    seoTitle: "Supported Employment in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT's role in supported employment programs for individuals with mental illness.",
    seoKeywords: ["supported employment", "IPS", "vocational rehabilitation", "mental health OT", "return to work"],
    overview: "Supported employment in OT helps individuals with mental illness obtain and maintain competitive employment in integrated community settings. The Individual Placement and Support (IPS) model is the most evidence-based approach, emphasizing rapid job placement, client choice, ongoing support, and integration with mental health treatment. OTs contribute through vocational assessment, job matching, workplace adaptation, and on-the-job support.",
    mechanismPhysiology: "Work is a fundamental human occupation that provides structure, social connection, identity, income, and purpose. Employment is associated with improved mental health outcomes, reduced hospitalization, and enhanced quality of life for individuals with serious mental illness.",
    clinicalRelevance: "OTs bring unique skills to supported employment including task analysis, activity adaptation, ergonomic assessment, cognitive-functional evaluation, and environmental modification — all applied to workplace success. The OT perspective on person-environment-occupation fit is central to effective job matching and support.",
    signsSymptoms: "Unemployment or underemployment related to mental illness, difficulty obtaining or maintaining employment, workplace performance problems, and desire for competitive employment.",
    assessment: "Vocational interest assessment, work skill evaluation, cognitive-functional assessment, social skills assessment, and workplace environmental analysis.",
    management: "IPS model implementation (rapid placement, competitive employment, ongoing support), job development and matching, workplace modifications, on-the-job coaching, social skills training for workplace interactions, cognitive compensation strategies, and stress management for work-related anxiety.",
    complications: "Benefit loss concerns (disability benefits vs. employment income), stigma in the workplace, relapse management during employment, and employer education needs.",
    clinicalPearls: [
      "IPS principle: 'place then train' — rapid placement followed by on-the-job support is more effective than prevocational training.",
      "Client choice is paramount — the individual selects the type of work based on their interests and goals.",
      "Zero exclusion — no one is screened out of supported employment based on diagnosis, symptoms, or work history."
    ],
    examPitfalls: [
      "Confusing IPS supported employment (competitive jobs) with sheltered workshops (segregated settings).",
      "Not knowing the IPS core principles: competitive employment, rapid job search, integration with mental health, client preferences, ongoing support, benefit counseling.",
      "Assuming prevocational training must precede employment — IPS uses 'place then train.'"
    ],
    faqJson: [
      { question: "What is the IPS model of supported employment?", answer: "Individual Placement and Support (IPS) is the most evidence-based model for helping people with mental illness obtain competitive employment. Key principles include rapid job search, client choice, integrated services, and ongoing support." },
      { question: "What is the OT's role in supported employment?", answer: "OTs contribute vocational assessment, job matching based on person-environment-occupation fit, workplace adaptations, cognitive compensation strategies, and on-the-job support." }
    ]
  },
  {
    slug: "self-regulation-strategies",
    title: "Self-Regulation Strategies in OT",
    category: "Mental Health OT",
    seoTitle: "Self-Regulation Strategies in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to self-regulation intervention approaches used in occupational therapy across the lifespan.",
    seoKeywords: ["self-regulation", "Zones of Regulation", "Alert Program", "emotional regulation", "OT"],
    overview: "Self-regulation strategies in OT help clients manage their arousal levels, emotions, and behavior to support occupational performance and social participation. OTs use structured programs (Zones of Regulation, Alert Program/How Does Your Engine Run?), sensory-based strategies, cognitive techniques, and environmental modifications to promote self-regulation across the lifespan.",
    mechanismPhysiology: "Self-regulation involves the ability to monitor and modulate arousal, attention, emotion, and behavior. It requires interoception (awareness of internal states), executive function (inhibition, shifting, planning), and sensory modulation. Dysregulation occurs when these systems are overwhelmed or underdeveloped.",
    clinicalRelevance: "Self-regulation difficulties are common in ADHD, autism, mental health conditions, trauma, and sensory processing disorders. OTs address self-regulation within the context of daily activities, school performance, social interaction, and work participation.",
    signsSymptoms: "Emotional outbursts, difficulty with transitions, inability to calm down when upset, hyperactive or lethargic states, poor attention and concentration, difficulty identifying emotional states, and social interaction problems.",
    assessment: "Sensory Profile, interoception assessment, behavioral observation during activities, caregiver/teacher questionnaires, and identification of regulation patterns across settings.",
    management: "Zones of Regulation (four color-coded zones: blue = low, green = calm/alert, yellow = heightened, red = extremely heightened), Alert Program (engine analogy for arousal states), sensory strategies for regulation, breathing techniques, movement breaks, visual supports, cognitive strategies, and environmental modifications.",
    complications: "Over-reliance on external regulation (adult-directed strategies) without developing internal self-regulation capacity. Need to match strategies to developmental level and cognitive ability.",
    clinicalPearls: [
      "Teach identification of internal states BEFORE teaching regulation strategies — you can't regulate what you can't recognize.",
      "The Green Zone (calm, alert, focused) is the optimal state for learning and social interaction.",
      "Sensory strategies (heavy work, deep pressure, movement) are among the most effective regulation tools."
    ],
    examPitfalls: [
      "Not knowing the four Zones of Regulation (blue, green, yellow, red) and what they represent.",
      "Confusing self-regulation programs (OT scope) with anger management therapy (psychology scope).",
      "Applying a one-size-fits-all approach — regulation strategies must be individualized."
    ],
    faqJson: [
      { question: "What are the Zones of Regulation?", answer: "The Zones of Regulation is a framework using four color-coded zones: Blue (low arousal, tired, sad), Green (calm, alert, optimal), Yellow (heightened, anxious, excited), and Red (extremely heightened, angry, out of control)." },
      { question: "How do OTs help with self-regulation?", answer: "OTs teach clients to recognize internal states, identify their arousal zone, select appropriate strategies (sensory, cognitive, movement-based) to shift to the optimal zone, and practice these skills in daily activities." }
    ]
  },
  {
    slug: "substance-use-disorder-ot",
    title: "Substance Use Disorder in OT",
    category: "Mental Health OT",
    seoTitle: "Substance Use Disorder in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy role in substance use disorder treatment and recovery.",
    seoKeywords: ["substance use disorder", "addiction", "recovery", "occupational therapy", "life skills"],
    overview: "Occupational therapy for substance use disorder (SUD) addresses the occupational disruption caused by addiction and supports recovery through meaningful activity engagement, role resumption, life skills development, and relapse prevention. OTs help clients rebuild occupational routines, develop healthy leisure activities, address co-occurring conditions, and reintegrate into community life.",
    mechanismPhysiology: "Substance use disorders involve neurological changes in the brain's reward system, impairing decision-making, impulse control, and motivation. Recovery requires rebuilding neural pathways through new habits, routines, and meaningful occupational engagement. The neuroplasticity underlying habit formation supports recovery-oriented occupation-based intervention.",
    clinicalRelevance: "OTs address the functional and occupational aspects of SUD that other treatment team members may not target. Time use, leisure development, life skills, and role function are critical components of sustained recovery that align directly with OT expertise.",
    signsSymptoms: "Disrupted daily routines, loss of productive roles, narrowed activity repertoire (dominated by substance-related activities), impaired self-care, social isolation, vocational dysfunction, and impaired life management skills.",
    assessment: "Occupational performance evaluation, time use assessment, Role Checklist, Interest Checklist, ADL/IADL skills assessment, and coping strategy evaluation.",
    management: "Development of substance-free daily routines, healthy leisure exploration, life skills training (budgeting, cooking, time management), vocational planning, social skills development, stress management, relapse prevention planning through occupation, and co-occurring condition management.",
    complications: "High relapse rates, co-occurring mental health conditions, housing instability, legal issues, family disruption, and medical complications of substance use.",
    clinicalPearls: [
      "Boredom and unstructured time are major relapse triggers — OTs address this through activity scheduling and leisure development.",
      "Recovery requires filling the 'occupational void' left by substance use with meaningful, satisfying alternatives.",
      "Address life skills deficits that were never developed or were lost during active addiction."
    ],
    examPitfalls: [
      "Not recognizing the OT role in SUD treatment — OTs address the occupational disruption, not the addiction itself.",
      "Ignoring the need for healthy leisure development in recovery planning.",
      "Not addressing co-occurring conditions (depression, anxiety, PTSD) that impact occupational performance."
    ],
    faqJson: [
      { question: "What does OT do for substance use disorders?", answer: "OTs help rebuild daily routines, develop healthy leisure activities, train life skills, support role resumption, and address the occupational disruption caused by addiction as part of comprehensive recovery." },
      { question: "Why is leisure important in addiction recovery?", answer: "Boredom and unstructured time are significant relapse triggers. Developing satisfying, substance-free leisure activities fills the occupational void left by substance use and supports sustained recovery." }
    ]
  },
  {
    slug: "trauma-informed-care-ot",
    title: "Trauma-Informed Care in OT",
    category: "Mental Health OT",
    seoTitle: "Trauma-Informed Care in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to trauma-informed practice principles and application in occupational therapy.",
    seoKeywords: ["trauma-informed care", "TIC", "trauma", "occupational therapy", "safety", "empowerment"],
    overview: "Trauma-informed care (TIC) in OT involves understanding the widespread impact of trauma on occupational performance and integrating this knowledge into all aspects of practice. TIC principles — safety, trustworthiness, choice, collaboration, and empowerment — guide how OTs interact with clients, design interventions, and structure therapeutic environments. TIC is not a specific treatment for trauma but a practice approach applicable across all OT settings.",
    mechanismPhysiology: "Trauma exposure alters the nervous system (heightened stress response, hypervigilance), cognitive processing (threat perception, executive function), and occupational engagement (avoidance, dissociation). Understanding these effects helps OTs create interventions that promote safety and healing rather than inadvertently retraumatizing clients.",
    clinicalRelevance: "Given the high prevalence of trauma (ACEs studies indicate 60%+ of adults have experienced at least one adverse childhood experience), trauma-informed practice is relevant across all OT settings, not just mental health. TIC improves therapeutic relationships, treatment engagement, and outcomes.",
    signsSymptoms: "Hypervigilance, startle responses, avoidance behaviors, difficulty trusting providers, emotional dysregulation, dissociation, difficulty with routines, sensory sensitivities, and occupational participation limitations.",
    assessment: "Trauma-sensitive assessment approaches that prioritize safety and choice, functional assessment of occupational impact, sensory processing evaluation, and identification of triggers and environmental factors.",
    management: "Creating physically and emotionally safe environments, offering choices and control during therapy, providing predictable routines and clear expectations, using sensory approaches for regulation, building on strengths and empowerment, and graded exposure to challenging activities at the client's pace.",
    complications: "Risk of retraumatization through standard clinical practices (physical handling, unexpected changes, loss of control), vicarious trauma in therapists, and the need for systemic change beyond individual practitioner approaches.",
    clinicalPearls: [
      "The five principles of TIC: Safety, Trustworthiness and Transparency, Peer Support, Collaboration and Mutuality, Empowerment, Voice and Choice.",
      "Ask 'What happened to you?' rather than 'What's wrong with you?' — this reframes behavior as adaptation rather than pathology.",
      "TIC is universal — apply these principles with all clients, not just those with known trauma histories."
    ],
    examPitfalls: [
      "Confusing trauma-informed care (universal approach) with trauma therapy (specific treatment for PTSD).",
      "Not recognizing how routine clinical practices can be retraumatizing (unexpected touch, loss of control, power imbalances).",
      "Limiting TIC to mental health settings — it applies across all OT practice areas."
    ],
    faqJson: [
      { question: "What is trauma-informed care?", answer: "TIC is an approach that recognizes the widespread impact of trauma and integrates this knowledge into practice through principles of safety, trustworthiness, choice, collaboration, and empowerment." },
      { question: "How is TIC different from trauma therapy?", answer: "TIC is a universal approach to all client interactions that prevents retraumatization and promotes healing. Trauma therapy is a specific treatment for trauma-related conditions like PTSD, typically provided by psychologists or psychiatrists." }
    ]
  },
  {
    slug: "lifestyle-redesign",
    title: "Lifestyle Redesign",
    category: "Mental Health OT",
    seoTitle: "Lifestyle Redesign in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to Lifestyle Redesign, an evidence-based OT program promoting health through meaningful occupation.",
    seoKeywords: ["Lifestyle Redesign", "occupational science", "USC", "health promotion", "well elderly", "OT"],
    overview: "Lifestyle Redesign is an evidence-based occupational therapy program developed at the University of Southern California (USC) that helps individuals create sustainable, health-promoting routines through meaningful occupation. Originally validated through the Well Elderly Studies, it has been expanded to address chronic conditions, weight management, diabetes, chronic pain, and mental health. The program combines group-based modules with individual sessions to facilitate occupational self-analysis and lifestyle change.",
    mechanismPhysiology: "Lifestyle Redesign is grounded in occupational science — the study of humans as occupational beings. It posits that health is directly influenced by occupational patterns and choices. By analyzing and restructuring daily occupations, individuals can improve physical health, mental well-being, and life satisfaction.",
    clinicalRelevance: "The Well Elderly Studies (randomized controlled trials) demonstrated that Lifestyle Redesign significantly improved health outcomes, function, and quality of life for community-dwelling older adults, with effects lasting beyond the intervention period. It represents some of the strongest evidence supporting OT effectiveness.",
    signsSymptoms: "Occupational imbalance, sedentary lifestyle, social isolation, chronic disease self-management difficulties, and lack of meaningful engagement in daily life.",
    assessment: "Occupational self-analysis, activity patterns assessment, wellness evaluation, and quality of life measures.",
    management: "Group-based modules covering transportation, health and wellness, nutrition, physical activity, personal safety, social relationships, cultural awareness, and community engagement. Individual sessions personalize the program. Focus on self-analysis, goal setting, and sustainable behavior change through occupation.",
    complications: "Requires sustained engagement for behavior change, access barriers for underserved populations, and the need for trained facilitators.",
    clinicalPearls: [
      "The Well Elderly Studies provide Level I evidence for OT's effectiveness — know these studies for NBCOT.",
      "Lifestyle Redesign focuses on self-analysis and personal meaning, not prescriptive lifestyle changes.",
      "The program has been successfully adapted for diverse populations including those with chronic conditions."
    ],
    examPitfalls: [
      "Not knowing that Lifestyle Redesign was validated through the Well Elderly Studies at USC.",
      "Confusing Lifestyle Redesign with generic wellness programs — it is specifically occupation-based.",
      "Not recognizing its application beyond older adults (chronic pain, diabetes, weight management)."
    ],
    faqJson: [
      { question: "What is Lifestyle Redesign?", answer: "Lifestyle Redesign is an evidence-based OT program from USC that helps individuals improve health and well-being by analyzing and restructuring daily occupational patterns to be more meaningful and health-promoting." },
      { question: "What evidence supports Lifestyle Redesign?", answer: "The Well Elderly Studies (I and II), large randomized controlled trials, demonstrated significant improvements in health, function, and quality of life for community-dwelling older adults receiving Lifestyle Redesign." }
    ]
  },
  {
    slug: "dialectical-behavior-therapy-ot",
    title: "DBT Skills in Occupational Therapy",
    category: "Mental Health OT",
    seoTitle: "DBT Skills in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to applying dialectical behavior therapy skills within occupational therapy practice.",
    seoKeywords: ["DBT", "dialectical behavior therapy", "distress tolerance", "mindfulness", "emotional regulation", "OT"],
    overview: "Dialectical Behavior Therapy (DBT) skills are increasingly incorporated into OT mental health practice. OTs apply the four DBT skill modules — mindfulness, distress tolerance, emotional regulation, and interpersonal effectiveness — within the context of occupation-based intervention. OTs teach and practice these skills during functional activities rather than in isolation, promoting generalization to daily life.",
    mechanismPhysiology: "DBT skills address the emotional and behavioral dysregulation that underlies conditions such as borderline personality disorder, self-harm, and emotional instability. Skills training builds capacity for distress tolerance, mindful awareness, emotional modulation, and effective interpersonal communication.",
    clinicalRelevance: "OTs apply DBT skills within activity-based contexts, teaching mindfulness during cooking groups, distress tolerance during challenging tasks, emotional regulation within social activities, and interpersonal effectiveness during group projects. This occupation-based application promotes skill generalization.",
    signsSymptoms: "Emotional dysregulation, self-harm behaviors, difficulty managing interpersonal conflicts, impulsive behaviors, chronic feelings of emptiness, and occupational dysfunction related to emotional instability.",
    assessment: "Functional assessment of emotional regulation impact on daily activities, identification of triggering situations, and assessment of current coping strategy repertoire.",
    management: "Mindfulness activities (mindful eating, mindful movement, grounding techniques during tasks), distress tolerance skills (TIPP, self-soothing through senses), emotional regulation strategies (activity scheduling for opposite action), and interpersonal effectiveness practice (DEAR MAN, GIVE, FAST) within group and individual activity sessions.",
    complications: "DBT requires comprehensive training for effective delivery. OTs should apply DBT skills within their scope (occupation-based) rather than delivering full DBT programs (psychology scope).",
    clinicalPearls: [
      "OTs apply DBT skills within activities — mindful cooking, distress tolerance during challenging crafts, interpersonal effectiveness in group tasks.",
      "TIPP skills for crisis: Temperature (cold water on face), Intense exercise, Paced breathing, Progressive muscle relaxation.",
      "DEAR MAN for interpersonal effectiveness: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate."
    ],
    examPitfalls: [
      "Confusing OT-applied DBT skills (within activities) with full DBT therapy (comprehensive program).",
      "Not knowing the four DBT skill modules: mindfulness, distress tolerance, emotional regulation, interpersonal effectiveness.",
      "Attempting to deliver comprehensive DBT without appropriate training and credentials."
    ],
    faqJson: [
      { question: "How do OTs use DBT skills?", answer: "OTs integrate DBT skills (mindfulness, distress tolerance, emotional regulation, interpersonal effectiveness) into occupation-based activities and groups, teaching skills within functional contexts to promote generalization." },
      { question: "What are the four modules of DBT?", answer: "Mindfulness (present-moment awareness), Distress Tolerance (surviving crisis without making it worse), Emotional Regulation (managing and changing emotions), and Interpersonal Effectiveness (maintaining relationships while meeting needs)." }
    ]
  },
  // ===== SPLINTING & ORTHOTICS (8 entries) =====
  {
    slug: "static-splinting",
    title: "Static Splinting in OT",
    category: "Splinting & Orthotics",
    seoTitle: "Static Splinting in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to static splint design, fabrication, and application in occupational therapy and hand therapy.",
    seoKeywords: ["static splint", "orthotic", "splint fabrication", "immobilization splint", "OT"],
    overview: "Static splints in OT are rigid orthotic devices that immobilize joints in a specific position without allowing movement. They are used for rest, protection, positioning, and prevention/correction of deformity. OTs design and fabricate custom static splints using low-temperature thermoplastic materials, ensuring proper fit, comfort, and functional positioning.",
    mechanismPhysiology: "Static splints work by maintaining tissue length, protecting healing structures, reducing pain through immobilization, and preventing or correcting joint deformity. They apply three-point pressure systems to maintain desired joint positions. Proper fit distributes forces over large surface areas to prevent pressure injury.",
    clinicalRelevance: "Splint fabrication is a core OT/hand therapy competency. Custom splints provide superior fit and function compared to prefabricated options for many conditions. OTs assess, design, fabricate, fit, and modify splints as an integral part of upper extremity rehabilitation.",
    signsSymptoms: "Indications include fractures, tendon repairs, nerve injuries, burns, rheumatoid arthritis, carpal tunnel syndrome, trigger finger, and any condition requiring joint immobilization or positioning.",
    assessment: "Joint position assessment, skin integrity evaluation, edema measurement, diagnosis-specific positioning requirements, activity demands, and wear schedule determination.",
    management: "Material selection (various thermoplastic options), pattern creation, molding technique, strap placement, padding application, wearing schedule education, skin monitoring, and ongoing modification as the condition changes.",
    complications: "Pressure areas, skin maceration, poor compliance, improper positioning leading to contracture, nerve compression, and thermal injury during fabrication.",
    clinicalPearls: [
      "The three-point pressure system is the fundamental biomechanical principle of all splints.",
      "Wider, longer splints distribute force more evenly — avoid narrow, short designs that create pressure points.",
      "Always check for pressure over bony prominences and modify as needed."
    ],
    examPitfalls: [
      "Not knowing the three-point pressure system for splint biomechanics.",
      "Confusing static (no movement) with dynamic (allows/assists movement) splints.",
      "Not understanding proper wrist position for different diagnoses (extension for most, neutral for carpal tunnel)."
    ],
    faqJson: [
      { question: "What is a static splint?", answer: "A static splint is a rigid orthotic device that holds a joint in a fixed position without allowing movement, used for protection, rest, positioning, and deformity prevention." },
      { question: "What is the three-point pressure system?", answer: "The three-point pressure system uses three opposing forces to maintain a joint in the desired position — one force on one side and two counterforces on the opposite side." }
    ]
  },
  {
    slug: "dynamic-splinting",
    title: "Dynamic Splinting in OT",
    category: "Splinting & Orthotics",
    seoTitle: "Dynamic Splinting in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to dynamic splint design, application, and clinical use in occupational therapy and hand therapy.",
    seoKeywords: ["dynamic splint", "mobilization splint", "spring-loaded splint", "rubber band traction", "OT"],
    overview: "Dynamic splints use elastic components (rubber bands, springs, or elastic cord) to apply a constant, gentle force to mobilize stiff joints, assist weak muscles, or substitute for absent motion. They allow controlled movement in one direction while applying a corrective force. OTs design dynamic splints for conditions including joint contracture, tendon repair, nerve injury, and burn rehabilitation.",
    mechanismPhysiology: "Dynamic splints apply low-load, prolonged stretch (LLPS) to promote tissue remodeling and increase ROM. The elastic force maintains tension on shortened tissues as the joint moves, promoting creep and stress relaxation in collagen fibers. This is more effective than high-force, brief stretching for tissue elongation.",
    clinicalRelevance: "Dynamic splinting is a key intervention for managing joint stiffness, supporting tendon repair protocols, and substituting for weak or absent muscles. OTs design, fabricate, and modify dynamic splints, adjusting force, angle, and wear schedule based on tissue response.",
    signsSymptoms: "Joint contracture, limited ROM, tendon repair requiring protected motion, muscle weakness or paralysis, and burn scar contracture.",
    assessment: "Joint ROM measurement, tissue end-feel assessment, force application assessment, skin integrity monitoring, and functional impact evaluation.",
    management: "Design considerations include appropriate force level (enough for tissue stretch without pain or inflammation), optimal angle of pull (90° to the segment being mobilized), outrigger placement, and wear schedule. Monitor tissue response and adjust accordingly.",
    complications: "Excessive force causing inflammation, joint distraction rather than rotation, pressure areas at attachment points, poor compliance due to bulk or discomfort, and skin breakdown.",
    clinicalPearls: [
      "The angle of pull should be 90° to the segment being mobilized for optimal force application.",
      "Low force applied for a long duration is more effective than high force for short duration.",
      "A dynamic splint causing pain indicates too much force — reduce the tension."
    ],
    examPitfalls: [
      "Not knowing the optimal 90° angle of pull principle.",
      "Confusing dynamic splints (elastic force, allows movement) with static progressive splints (adjustable static force).",
      "Not understanding the difference between mobilization (increasing ROM) and substitution (replacing absent motion) splints."
    ],
    faqJson: [
      { question: "How do dynamic splints work?", answer: "Dynamic splints use elastic components to apply a constant, gentle force that mobilizes stiff joints, assists weak muscles, or substitutes for absent motion, allowing controlled movement." },
      { question: "What is the optimal angle of pull for a dynamic splint?", answer: "The optimal angle of pull is 90° to the segment being mobilized, which provides the most efficient rotational force at the joint." }
    ]
  },
  {
    slug: "resting-hand-splint",
    title: "Resting Hand Splint",
    category: "Splinting & Orthotics",
    seoTitle: "Resting Hand Splint in OT — OT Encyclopedia",
    seoDescription: "Guide to resting hand splint fabrication, positioning, and clinical application in occupational therapy.",
    seoKeywords: ["resting hand splint", "functional position", "hand splint", "anti-deformity position", "OT"],
    overview: "The resting hand splint (RHS) is a static splint that positions the wrist, fingers, and thumb in a functional or anti-deformity position. It is one of the most commonly fabricated splints in OT practice. The standard resting position places the wrist in 20-30° extension, MCPs in 45-70° flexion, IPs in slight flexion, and thumb in palmar abduction. Indications include burns, rheumatoid arthritis, spasticity, post-surgical protection, and acute inflammation.",
    mechanismPhysiology: "The resting position maintains the collateral ligaments of the MCP joints at maximum length (preventing extension contracture), keeps the thumb web space open (preventing first web space contracture), and positions the wrist for functional grasp. This position counteracts common deformity patterns.",
    clinicalRelevance: "The resting hand splint is a foundational splinting skill for OTs. Understanding the biomechanical rationale for the positioning guides proper fabrication and ensures deformity prevention.",
    signsSymptoms: "Burns affecting the hand, rheumatoid arthritis flare, stroke-related spasticity, post-surgical protection needs, and acute inflammatory conditions requiring immobilization.",
    assessment: "Evaluate for specific positioning needs based on diagnosis, skin integrity, edema, and ROM limitations.",
    management: "Custom fabrication from low-temperature thermoplastic, proper positioning per diagnosis, wear schedule (typically nighttime use), skin monitoring, and modification as needed. Anti-deformity positions differ by diagnosis (burn vs. RA vs. spasticity).",
    complications: "Pressure areas, improper positioning leading to contracture, skin maceration from moisture, and non-compliance.",
    clinicalPearls: [
      "The safe position (intrinsic plus): wrist 20-30° extension, MCPs 70-90° flexion, IPs extended, thumb abducted — prevents the most common contractures.",
      "For burns, the anti-deformity position is: wrist extension, MCP flexion (70-90°), IP extension, thumb abduction — opposite of the burn contracture pattern.",
      "Resting hand splints are typically worn at night to prevent deformity while allowing functional use during the day."
    ],
    examPitfalls: [
      "Not knowing the correct positioning for a resting hand splint (wrist extension, MCP flexion, IP extension, thumb abduction).",
      "Confusing the resting position with the functional position (wrist extension, MCPs and IPs slightly flexed, thumb opposed).",
      "Not recognizing that positioning differs by diagnosis (burn anti-deformity vs. RA vs. spasticity management)."
    ],
    faqJson: [
      { question: "What is the purpose of a resting hand splint?", answer: "A resting hand splint maintains the hand in a position that prevents deformity, protects healing structures, and reduces pain during rest, typically worn at night." },
      { question: "What is the anti-deformity position for burns?", answer: "Wrist in 20-30° extension, MCPs in 70-90° flexion, IPs in full extension, and thumb in palmar abduction — this counteracts the typical burn contracture pattern." }
    ]
  },
  {
    slug: "thumb-spica-splint",
    title: "Thumb Spica Splint",
    category: "Splinting & Orthotics",
    seoTitle: "Thumb Spica Splint in OT — OT Encyclopedia",
    seoDescription: "Guide to thumb spica splint indications, fabrication, and positioning in occupational therapy.",
    seoKeywords: ["thumb spica splint", "thumb immobilization", "de Quervain's", "CMC arthritis", "scaphoid", "OT"],
    overview: "The thumb spica splint is a static orthotic that immobilizes the thumb CMC and MCP joints while allowing finger motion. It is one of the most commonly prescribed hand splints. Indications include de Quervain's tenosynovitis, CMC joint osteoarthritis, scaphoid fracture, gamekeeper's/skier's thumb (UCL injury), and thumb tendon injuries.",
    mechanismPhysiology: "By immobilizing the thumb CMC and MCP joints, the thumb spica reduces tendon inflammation (de Quervain's), protects healing structures (fracture, ligament), and decreases joint stress (CMC arthritis). The inclusion of the wrist in some designs (long thumb spica) provides additional stability for scaphoid fractures.",
    clinicalRelevance: "OTs fabricate thumb spica splints as part of conservative management for thumb conditions. Custom fabrication ensures optimal fit, comfort, and compliance. The OT also addresses functional adaptation during the immobilization period.",
    signsSymptoms: "Thumb pain with gripping and pinching, tenderness at the radial styloid (de Quervain's), CMC joint pain and crepitus (arthritis), and thumb instability (UCL injury).",
    assessment: "Thumb ROM, grip and pinch strength, Finkelstein's test (de Quervain's), CMC grind test (arthritis), stress testing (UCL), and functional task assessment.",
    management: "Custom thermoplastic splint fabrication, proper positioning (thumb in palmar abduction, IP free), wear schedule (condition-dependent), activity modification, and functional adaptation during splint use.",
    complications: "Stiffness from prolonged immobilization, skin irritation, first web space contracture if positioned incorrectly, and muscle weakness.",
    clinicalPearls: [
      "For de Quervain's, include the wrist and IP joint if the EPL is involved; standard thumb spica includes CMC and MCP only.",
      "For CMC arthritis, a short opponens splint may be preferred for better function during daytime use.",
      "Always leave the thumb IP joint free unless specifically indicated for the diagnosis."
    ],
    examPitfalls: [
      "Not knowing which joints to immobilize for different diagnoses.",
      "Confusing a thumb spica (CMC + MCP) with a long opponens (CMC only) or short opponens splint.",
      "Positioning the thumb in adduction rather than palmar abduction."
    ],
    faqJson: [
      { question: "What conditions require a thumb spica splint?", answer: "Common indications include de Quervain's tenosynovitis, CMC osteoarthritis, scaphoid fracture, UCL injury (gamekeeper's thumb), and thumb tendon injuries." },
      { question: "How long is a thumb spica splint typically worn?", answer: "Wear schedules vary: de Quervain's (4-6 weeks), scaphoid fracture (6-12 weeks with cast/splint), CMC arthritis (intermittent use during symptomatic periods), and UCL injury (4-6 weeks)." }
    ]
  },
  {
    slug: "serial-static-splinting",
    title: "Serial Static Splinting",
    category: "Splinting & Orthotics",
    seoTitle: "Serial Static Splinting in OT — OT Encyclopedia",
    seoDescription: "Guide to serial static splinting for joint contracture management in occupational therapy.",
    seoKeywords: ["serial static splinting", "contracture management", "progressive splinting", "joint stiffness", "OT"],
    overview: "Serial static splinting is a technique for gradually increasing joint ROM by fabricating a series of static splints, each positioning the joint at its current end-range. As tissue remodeling occurs and ROM improves, the splint is remolded or replaced to incorporate the new ROM. This approach provides low-load, prolonged stretch (LLPS) to contracted tissues.",
    mechanismPhysiology: "Serial static splints exploit the viscoelastic properties of connective tissue. Prolonged, low-load forces cause creep (gradual tissue elongation under constant load) and stress relaxation (decreased tissue resistance over time). This produces permanent tissue elongation more effectively than high-force, brief stretching.",
    clinicalRelevance: "Serial static splinting is a primary intervention for joint contracture in OT/hand therapy. It is preferred over dynamic splinting when a constant, predictable force is desired and when the contracture is too severe for dynamic splint application.",
    signsSymptoms: "Joint contracture with firm or hard end-feel, limited ROM affecting function, post-surgical stiffness, burn scar contracture, and Dupuytren's contracture.",
    assessment: "Goniometric ROM measurement, tissue end-feel assessment, total passive motion (TPM), and documentation of ROM gains between remolding sessions.",
    management: "Fabricate a static splint at the current end-range of available motion. Wear schedule typically 6-8 hours (or overnight). Remold or replace the splint every 3-7 days as ROM increases. Continue until functional ROM is achieved or plateau occurs.",
    complications: "Pain from overly aggressive end-range positioning, inflammation, skin breakdown, and plateau in ROM gains indicating need for alternative approaches.",
    clinicalPearls: [
      "Remold the splint when it is no longer at end-range (typically every 3-7 days).",
      "Serial static splinting is more appropriate than dynamic splinting for severe contractures (>40°).",
      "The 'low load, long duration' principle is the biomechanical foundation — wear for hours, not minutes."
    ],
    examPitfalls: [
      "Confusing serial static (remolded at new end-range) with static progressive (adjustable inlay) splinting.",
      "Not knowing the biomechanical rationale (creep and stress relaxation).",
      "Setting the splint beyond end-range, causing pain and inflammation."
    ],
    faqJson: [
      { question: "How does serial static splinting work?", answer: "A static splint is made at the joint's current end-range. As tissue remodeling increases ROM, the splint is remolded to the new end-range. This process is repeated to gradually correct contracture." },
      { question: "How often should a serial static splint be remolded?", answer: "Typically every 3-7 days, or whenever the current splint no longer holds the joint at its end-range, indicating ROM improvement." }
    ]
  },
  {
    slug: "orthotic-fabrication-materials",
    title: "Orthotic Fabrication Materials",
    category: "Splinting & Orthotics",
    seoTitle: "Orthotic Fabrication Materials in OT — OT Encyclopedia",
    seoDescription: "Guide to thermoplastic and other materials used in splint fabrication in occupational therapy.",
    seoKeywords: ["thermoplastic", "splint materials", "orthotic fabrication", "low-temperature thermoplastic", "OT"],
    overview: "Orthotic fabrication in OT primarily uses low-temperature thermoplastic (LTT) materials that become pliable at 140-170°F (60-77°C) and can be molded directly on the client. Understanding material properties — memory, drape, conformability, self-bonding, and rigidity — is essential for selecting the right material for each clinical situation.",
    mechanismPhysiology: "Low-temperature thermoplastics consist of polymer matrices that soften when heated and harden when cooled. Material properties are determined by the ratio of plastic (crystalline) to rubber (amorphous) components. Higher plastic content produces materials with more memory and less drape; higher rubber content produces more conformable materials.",
    clinicalRelevance: "Material selection significantly affects splint quality, comfort, and function. OTs must match material properties to the clinical situation — choosing high-memory materials for easily remolded splints, highly conformable materials for intimate fit, and rigid materials for maximum support.",
    signsSymptoms: "Various conditions requiring custom orthotic fabrication, from hand injuries to neurological conditions.",
    assessment: "Clinical requirements analysis: What joints need support? How much rigidity is needed? Will the splint need frequent modification? Does the client have sensitive skin?",
    management: "Common materials include Orfit, Aquaplast, Polyform, and Clinic. Material thickness ranges from 1/16\" (finger splints) to 1/8\" (forearm-based splints). Accessories include self-adhesive padding, strapping material, rivets, and outrigger components.",
    complications: "Thermal injury if material is too hot during application, poor fit from material cooling too quickly, and material breakdown over time with repeated reheating.",
    clinicalPearls: [
      "High-memory materials (like Orfit) return to original shape when reheated — useful when frequent modification is needed.",
      "High-drape materials conform well to body contours but require careful handling to avoid fingerprints and unwanted stretch.",
      "Coated materials resist bonding to itself — useful for circumferential splints; uncoated materials self-bond for layering."
    ],
    examPitfalls: [
      "Not knowing the difference between high-memory and high-drape materials.",
      "Not understanding that material thickness affects rigidity and support.",
      "Forgetting that low-temperature thermoplastics soften at 140-170°F, not higher temperatures."
    ],
    faqJson: [
      { question: "What are low-temperature thermoplastics?", answer: "They are polymer-based materials that soften in warm water (140-170°F) and can be molded directly on the client's body, hardening as they cool to form custom-fit splints." },
      { question: "How do OTs choose splint materials?", answer: "Selection is based on clinical needs: memory (for remoldable splints), drape/conformability (for intimate fit), rigidity (for maximum support), self-bonding properties, and material thickness." }
    ]
  },
  {
    slug: "burn-splinting",
    title: "Burn Splinting",
    category: "Splinting & Orthotics",
    seoTitle: "Burn Splinting in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to splinting principles and anti-deformity positioning in burn rehabilitation.",
    seoKeywords: ["burn splinting", "anti-deformity", "burn rehabilitation", "contracture prevention", "OT"],
    overview: "Burn splinting is a critical component of OT burn rehabilitation. Splints are used to position burned joints in anti-deformity positions that counteract the natural tendency of scar tissue to contract. Splinting is initiated in the acute phase and continues through scar maturation (12-18 months). The anti-deformity position opposes the direction of contracture for each joint.",
    mechanismPhysiology: "Burn scar contracture develops as collagen in healing tissue contracts, pulling joints into flexion, adduction, or other positions of comfort. Anti-deformity splinting positions joints opposite to the expected contracture pattern, maintaining tissue length during healing.",
    clinicalRelevance: "OTs are responsible for designing, fabricating, and monitoring anti-deformity splints throughout burn recovery. Splinting is complemented by ROM exercises, pressure garments, and scar management to prevent and manage contracture.",
    signsSymptoms: "Burns affecting joints or crossing joint surfaces, early signs of scar contracture, and limited ROM during the healing phase.",
    assessment: "Burn depth and location, joint ROM, scar maturity assessment, functional impact, and wound/graft status.",
    management: "Anti-deformity positions: neck — neutral/slight extension; shoulder — 90° abduction, slight flexion; elbow — extension; wrist — 30° extension; hand — intrinsic plus position; hip — extension, abduction; knee — extension; ankle — neutral dorsiflexion. Splints are worn as much as possible when not exercising. Adjust as ROM improves.",
    complications: "Pressure over fragile healing skin or grafts, heterotopic ossification (especially at the elbow), non-compliance due to discomfort, and skin breakdown.",
    clinicalPearls: [
      "The anti-deformity position is OPPOSITE to the position of comfort — burns contract toward comfort.",
      "Axillary burns require airplane splints (shoulder abduction) to prevent adduction contracture.",
      "Splints must be adapted as wounds heal and grafts mature — frequent reassessment is essential."
    ],
    examPitfalls: [
      "Not knowing the anti-deformity positions for each joint.",
      "Applying a resting hand splint position when a burn anti-deformity position is needed (different MCP/IP positions).",
      "Ignoring the need for aggressive elbow extension splinting with anterior elbow burns."
    ],
    faqJson: [
      { question: "Why is anti-deformity positioning important in burns?", answer: "Burn scars naturally contract, pulling joints into positions of deformity. Anti-deformity splinting positions joints opposite to the contracture direction, maintaining tissue length during healing." },
      { question: "How long should burn splints be worn?", answer: "Burn splints should be worn as much as possible when not exercising or performing activities, continuing until scar maturation is complete (12-18 months post-burn)." }
    ]
  },
  {
    slug: "wrist-cock-up-splint",
    title: "Wrist Cock-Up Splint",
    category: "Splinting & Orthotics",
    seoTitle: "Wrist Cock-Up Splint in OT — OT Encyclopedia",
    seoDescription: "Guide to the wrist cock-up splint, its indications, fabrication, and use in occupational therapy.",
    seoKeywords: ["wrist cock-up splint", "wrist orthosis", "wrist extension splint", "carpal tunnel splint", "OT"],
    overview: "The wrist cock-up splint (wrist extension orthosis) is one of the most commonly fabricated splints in OT. It supports the wrist in a position of function (10-30° extension) while allowing full finger and thumb motion. It may be volar-based (under the forearm) or dorsal-based (top of forearm). Indications include carpal tunnel syndrome, wrist fractures, tendinitis, post-surgical protection, and conditions requiring wrist support.",
    mechanismPhysiology: "Wrist extension positioning reduces pressure in the carpal tunnel (for CTS), supports healing wrist structures, optimizes grip strength (wrist extension enhances finger flexor tenodesis), and reduces pain by limiting wrist motion.",
    clinicalRelevance: "The wrist cock-up splint is a versatile, frequently prescribed orthosis. OTs must understand proper positioning for different diagnoses — neutral for carpal tunnel, slight extension for most other conditions.",
    signsSymptoms: "Wrist pain, carpal tunnel symptoms, post-fracture or post-surgical wrist instability, tendinitis, and grip weakness related to wrist instability.",
    assessment: "Wrist ROM, grip strength, carpal tunnel provocation tests, pain assessment, and functional task evaluation.",
    management: "Custom fabrication, proper wrist positioning per diagnosis, ensuring full finger motion is preserved, proper length (2/3 of forearm), palmar bar placement proximal to distal palmar crease, and appropriate wearing schedule.",
    complications: "Restriction of finger motion if the splint extends too far distally, pressure at the ulnar styloid, and skin maceration from prolonged wear.",
    clinicalPearls: [
      "For carpal tunnel syndrome, position the wrist in neutral (0°) — not extended, as extension increases carpal tunnel pressure.",
      "The palmar bar must end proximal to the distal palmar crease to allow full MCP flexion.",
      "Two-thirds forearm length provides optimal support without restricting elbow motion."
    ],
    examPitfalls: [
      "Positioning the wrist in extension for carpal tunnel (should be neutral).",
      "Making the palmar bar too long, blocking MCP flexion.",
      "Not distinguishing volar from dorsal splint approaches."
    ],
    faqJson: [
      { question: "What is a wrist cock-up splint used for?", answer: "It supports the wrist in a functional position while allowing finger motion, used for carpal tunnel syndrome, wrist fractures, tendinitis, and conditions requiring wrist immobilization." },
      { question: "What wrist position is correct for carpal tunnel splinting?", answer: "The wrist should be positioned in neutral (0°) for carpal tunnel syndrome, as both flexion and extension increase pressure within the carpal tunnel." }
    ]
  },
  // ===== ADAPTIVE EQUIPMENT & ASSISTIVE TECHNOLOGY (10 entries) =====
  {
    slug: "adaptive-equipment-overview",
    title: "Adaptive Equipment in OT",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Adaptive Equipment in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Comprehensive guide to adaptive equipment prescription and use in occupational therapy practice.",
    seoKeywords: ["adaptive equipment", "assistive devices", "ADL aids", "occupational therapy", "independence"],
    overview: "Adaptive equipment (assistive devices) in OT encompasses tools and devices that enable individuals with disabilities to perform daily activities more independently. OTs assess functional needs, recommend appropriate equipment, train in its use, and evaluate effectiveness. Categories include self-care aids, feeding devices, dressing aids, bathing equipment, mobility devices, and communication tools.",
    mechanismPhysiology: "Adaptive equipment compensates for functional limitations by modifying the task (built-up handles for weak grip), changing the environment (grab bars for transfers), or substituting for lost abilities (one-handed cutting board). The Person-Environment-Occupation model guides equipment selection.",
    clinicalRelevance: "Equipment recommendation is a core OT competency. Proper assessment ensures the right device for the right person at the right time. Abandonment rates for assistive technology are high (up to 30%), making thorough assessment and training essential.",
    signsSymptoms: "Difficulty with self-care, meal preparation, dressing, bathing, mobility, or other daily tasks due to physical, cognitive, or sensory limitations.",
    assessment: "Functional task analysis, identification of specific performance barriers, client preferences, environmental assessment, financial considerations, and training capacity evaluation.",
    management: "Device selection based on specific functional needs, client training in device use, caregiver education, environmental setup, follow-up for effectiveness evaluation, and modification or replacement as needs change.",
    complications: "Device abandonment due to poor fit, complexity, stigma, or inadequate training. Over-reliance on equipment when skill development is possible. Cost barriers and insurance coverage limitations.",
    clinicalPearls: [
      "Always try the simplest, least expensive solution first before recommending complex technology.",
      "Client involvement in device selection significantly reduces abandonment rates.",
      "Train the client AND the caregiver in device use for optimal outcomes."
    ],
    examPitfalls: [
      "Recommending adaptive equipment without adequate assessment of the person-task-environment interaction.",
      "Not considering the client's preferences, values, and social context in equipment selection.",
      "Forgetting to provide training — providing equipment without training leads to abandonment."
    ],
    faqJson: [
      { question: "What is adaptive equipment?", answer: "Adaptive equipment includes tools and devices that compensate for functional limitations, enabling people with disabilities to perform daily activities more independently." },
      { question: "Why is device abandonment a problem?", answer: "Up to 30% of assistive devices are abandoned because they don't meet the person's actual needs, are too complex, or were prescribed without adequate assessment and training." }
    ]
  },
  {
    slug: "wheelchair-assessment-prescription",
    title: "Wheelchair Assessment & Prescription",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Wheelchair Assessment and Prescription in OT — OT Encyclopedia",
    seoDescription: "Guide to OT wheelchair evaluation, selection, and fitting for manual and power wheelchairs.",
    seoKeywords: ["wheelchair assessment", "seating", "power wheelchair", "wheelchair prescription", "OT"],
    overview: "Wheelchair assessment and prescription is a specialized OT skill involving comprehensive evaluation of the client's physical, cognitive, and environmental needs to select the optimal mobility device. OTs assess for manual wheelchairs, power wheelchairs, scooters, and seating/positioning systems. Proper fit maximizes function, prevents secondary complications, and supports community participation.",
    mechanismPhysiology: "Proper wheelchair fit supports posture, prevents pressure injuries, optimizes upper extremity function, and enables efficient mobility. Key measurements include seat width (widest point + 1 inch), seat depth (posterior to popliteal fossa - 1-2 inches), seat height (popliteal height + cushion), and backrest height (below scapular angles for manual propulsion).",
    clinicalRelevance: "OTs are key members of the wheelchair assessment team. Proper prescription prevents pressure injuries, upper extremity overuse injuries, postural deformities, and mobility limitations. Medicare and insurance require OT assessment for wheelchair funding.",
    signsSymptoms: "Impaired ambulation, fatigue limiting community mobility, progressive neurological conditions, spinal cord injury, and chronic conditions limiting walking endurance.",
    assessment: "Physical assessment (ROM, strength, tone, posture, sitting balance), environmental assessment (home access, terrain), functional assessment (transfers, propulsion, community access), trial with different devices, and pressure mapping for cushion selection.",
    management: "Equipment selection, measurement and fitting, cushion selection (pressure relief, positioning), seating system configuration, training in propulsion/driving, transfer training, and ongoing reassessment.",
    complications: "Pressure injuries from improper cushion, shoulder injuries from manual propulsion, postural deformities from poor positioning, and environmental barriers limiting wheelchair use.",
    clinicalPearls: [
      "Seat width should be 1 inch wider than the widest point of the hips — too wide impairs propulsion, too narrow causes pressure.",
      "Pressure-mapping technology guides cushion selection for pressure injury prevention.",
      "Always assess the home environment for wheelchair accessibility before discharge."
    ],
    examPitfalls: [
      "Not knowing standard wheelchair measurement guidelines.",
      "Forgetting to assess home accessibility as part of the wheelchair prescription.",
      "Confusing lightweight/ultralight manual chairs with standard chairs — ultralight chairs significantly improve propulsion efficiency."
    ],
    faqJson: [
      { question: "What measurements are needed for a wheelchair?", answer: "Key measurements include seat width (hips + 1 inch), seat depth (posterior to behind knee - 1-2 inches), seat-to-floor height, backrest height, and armrest height." },
      { question: "How does a power wheelchair differ from a power scooter?", answer: "Power wheelchairs offer more positioning options, better postural support, and are suitable for individuals with limited trunk control. Scooters require adequate trunk control and upper extremity function for steering." }
    ]
  },
  {
    slug: "assistive-technology-overview",
    title: "Assistive Technology in OT",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Assistive Technology in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to assistive technology assessment, selection, and implementation in occupational therapy.",
    seoKeywords: ["assistive technology", "AT", "environmental control", "smart home", "augmentative communication", "OT"],
    overview: "Assistive Technology (AT) in OT encompasses any device, system, or service that helps individuals with disabilities perform tasks they would otherwise be unable to accomplish. AT ranges from low-tech (pencil grips, magnifiers) to high-tech (speech-generating devices, environmental control units, computer access systems). OTs assess, recommend, train, and evaluate AT solutions across the lifespan.",
    mechanismPhysiology: "AT works by augmenting, maintaining, or improving functional capabilities. The HAAT (Human Activity Assistive Technology) model guides assessment by considering the human (abilities, needs), the activity (task demands), the AT device (features, interface), and the context (environment, cultural factors).",
    clinicalRelevance: "OTs are among the primary professionals responsible for AT assessment and implementation. As technology advances, the role of AT in enabling independence continues to expand. Smart home technology, mobile apps, and IoT devices are increasingly integrated into OT practice.",
    signsSymptoms: "Functional limitations in communication, computer access, environmental control, mobility, self-care, education, or employment that may be addressed through technology solutions.",
    assessment: "HAAT model assessment, matching person capabilities to device requirements, trial periods with devices, environmental assessment for AT integration, and funding source identification.",
    management: "Device selection through systematic matching process, individualized training, environmental setup, follow-up for effectiveness evaluation, and ongoing support as needs change.",
    complications: "Technology abandonment, funding barriers, device complexity exceeding user capacity, rapid technology obsolescence, and digital literacy challenges.",
    clinicalPearls: [
      "Always consider low-tech solutions before jumping to high-tech — simpler solutions often have better adoption rates.",
      "The SETT framework (Student, Environment, Task, Tools) guides AT assessment in educational settings.",
      "Smart home technology (voice assistants, automated lighting, smart locks) is an emerging AT frontier."
    ],
    examPitfalls: [
      "Not considering the full range from low-tech to high-tech when recommending AT.",
      "Forgetting that AT assessment includes the environment and context, not just the person and device.",
      "Not knowing the HAAT model as the primary AT assessment framework."
    ],
    faqJson: [
      { question: "What is assistive technology?", answer: "AT is any device, system, or service that helps individuals with disabilities perform tasks, ranging from simple tools (pencil grips, reachers) to complex technology (speech-generating devices, environmental control units)." },
      { question: "How do OTs assess for AT?", answer: "Using frameworks like the HAAT model, OTs evaluate the person's abilities, the activity demands, the technology features, and the environmental context to match the right technology to the individual's needs." }
    ]
  },
  {
    slug: "built-up-handles-adapted-utensils",
    title: "Built-Up Handles & Adapted Utensils",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Built-Up Handles and Adapted Utensils — OT Encyclopedia",
    seoDescription: "Guide to built-up handles and adapted utensils for grip difficulties in occupational therapy.",
    seoKeywords: ["built-up handles", "adapted utensils", "grip aids", "arthritis", "weak grip", "OT"],
    overview: "Built-up handles and adapted utensils are among the most commonly prescribed adaptive devices in OT. They increase the diameter of tool handles to reduce the grip force required and accommodate limited hand function. Applications include eating utensils, writing tools, grooming implements, garden tools, and kitchen equipment. These simple, low-cost adaptations can significantly improve independence.",
    mechanismPhysiology: "Increasing handle diameter distributes grip force over a larger surface area and positions the fingers in greater extension, reducing the flexor force needed. This compensates for weak grip, limited ROM, pain with gripping, and hand deformities.",
    clinicalRelevance: "Built-up handles are a first-line intervention for grip difficulties in arthritis, stroke, spinal cord injury, and hand injuries. OTs fabricate custom built-up handles using foam tubing, thermoplastic, or commercial grip products.",
    signsSymptoms: "Weak grip, pain with gripping, difficulty holding utensils, dropping objects, and limited finger ROM affecting grasp.",
    assessment: "Grip strength, pinch strength, hand ROM, pain assessment, and observation of tool use during functional tasks.",
    management: "Foam tubing application to standard tools, commercial adaptive utensils (weighted, angled, swivel), custom-molded handles using thermoplastic, and training in proper use.",
    complications: "Over-reliance on built-up handles when grip strengthening is possible, social stigma of using adapted utensils, and cost of commercial adaptive equipment.",
    clinicalPearls: [
      "The optimal handle diameter for most adults is 1.25-1.5 inches (3-4 cm).",
      "Weighted utensils help stabilize tremors during feeding.",
      "Angled utensils (90° bend) compensate for limited forearm supination."
    ],
    examPitfalls: [
      "Not knowing when to use built-up handles (weak grip) vs. universal cuffs (no grip).",
      "Forgetting that weighted utensils are for tremor, not weakness.",
      "Not considering that built-up handles may be temporary while strength improves."
    ],
    faqJson: [
      { question: "Who benefits from built-up handles?", answer: "Individuals with weak grip (arthritis, stroke, hand injuries), limited finger ROM, or pain with gripping benefit from built-up handles that reduce the force needed to hold objects." },
      { question: "What is a universal cuff?", answer: "A universal cuff is a palmar strap that holds utensils, toothbrushes, or writing implements for individuals who cannot grasp objects at all, allowing functional use without grip." }
    ]
  },
  {
    slug: "environmental-control-units",
    title: "Environmental Control Units (ECUs)",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Environmental Control Units in OT — OT Encyclopedia",
    seoDescription: "Guide to environmental control units and smart home technology in occupational therapy.",
    seoKeywords: ["ECU", "environmental control", "smart home", "home automation", "independence", "OT"],
    overview: "Environmental Control Units (ECUs) are assistive technology systems that enable individuals with significant physical disabilities to independently control electronic devices in their environment. Modern ECUs include smart home technology (voice assistants, smart plugs, automated lighting, smart thermostats, and remote-controlled door locks). OTs assess, recommend, set up, and train clients in ECU use.",
    mechanismPhysiology: "ECUs use various input methods (voice commands, switches, sip-and-puff, eye gaze, touch) to operate environmental devices through wireless protocols (Wi-Fi, Bluetooth, infrared, Zigbee). Modern smart home ecosystems (Amazon Alexa, Google Home, Apple HomeKit) have made ECU technology more accessible and affordable.",
    clinicalRelevance: "ECUs dramatically increase independence for individuals with quadriplegia, ALS, MS, and other conditions limiting physical interaction with the environment. OTs match input methods to client abilities and integrate ECUs into daily routines.",
    signsSymptoms: "Inability to independently control lights, appliances, temperature, locks, or other environmental features due to limited mobility or strength.",
    assessment: "Physical capability assessment (best input method), environmental needs assessment, technology literacy evaluation, and home setup analysis.",
    management: "Device selection (smart speakers, smart home hubs, dedicated ECU systems), input method matching (voice, switch, sip-and-puff), installation and configuration, training for client and caregivers, and ongoing support.",
    complications: "Wi-Fi reliability issues, technology complexity, cost of comprehensive systems, privacy concerns with voice assistants, and internet dependency.",
    clinicalPearls: [
      "Voice-controlled smart speakers (Alexa, Google Home) have revolutionized ECU access — they are affordable, widely available, and easy to use.",
      "For clients who cannot use voice, switch scanning or eye gaze systems provide alternative input methods.",
      "Start simple — one smart plug and a voice assistant can provide meaningful independence gains."
    ],
    examPitfalls: [
      "Not knowing the different ECU input methods (voice, switch, sip-and-puff, eye gaze).",
      "Ignoring modern smart home technology in favor of outdated dedicated ECU systems.",
      "Not assessing the home environment and technology infrastructure before recommending ECUs."
    ],
    faqJson: [
      { question: "What is an Environmental Control Unit?", answer: "An ECU is technology that enables people with physical disabilities to independently control electronic devices in their environment (lights, TV, temperature, locks) using adapted input methods." },
      { question: "How have smart home devices changed ECU access?", answer: "Smart speakers, smart plugs, and home automation have made ECU technology affordable and widely available, where previously dedicated ECU systems cost thousands of dollars." }
    ]
  },
  // ===== NEUROLOGICAL REHABILITATION (10 entries) =====
  {
    slug: "spinal-cord-injury-ot",
    title: "Spinal Cord Injury Rehabilitation in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Spinal Cord Injury Rehabilitation in OT — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for spinal cord injury, including functional expectations by level.",
    seoKeywords: ["spinal cord injury", "SCI", "tetraplegia", "paraplegia", "tenodesis", "OT"],
    overview: "OT for spinal cord injury (SCI) focuses on maximizing functional independence based on the level and completeness of injury. OTs address self-care, mobility, adaptive equipment, environmental modification, community reintegration, and psychosocial adjustment. Functional expectations are determined by the neurological level of injury (C1-S5) and completeness (ASIA classification A-E).",
    mechanismPhysiology: "SCI disrupts motor, sensory, and autonomic function below the level of injury. Tetraplegia (C1-C8) affects all four limbs; paraplegia (T1-S5) affects the trunk and lower limbs. The ASIA Impairment Scale ranges from A (complete) to E (normal). Functional outcomes correlate with the lowest level with intact motor function.",
    clinicalRelevance: "OTs are essential members of the SCI rehabilitation team, focusing on upper extremity function (tetraplegia), ADL independence, adaptive equipment, splinting, and community reintegration. Knowledge of functional expectations by level is critical for goal-setting and equipment planning.",
    signsSymptoms: "Motor paralysis below the level of injury, sensory loss, bowel and bladder dysfunction, respiratory compromise (cervical injuries), spasticity, and autonomic dysreflexia (injuries above T6).",
    assessment: "ASIA examination, upper extremity motor assessment, self-care performance evaluation, sitting balance, transfer ability, wheelchair skills, and environmental accessibility assessment.",
    management: "Level-specific interventions: C5 (tenodesis grasp training, universal cuff, wrist-driven flexor hinge splint), C6 (tenodesis optimization, adaptive equipment, independent transfers), C7 (independence in most ADLs with equipment), paraplegia (full upper extremity independence, lower body dressing techniques, transfer training). All levels: wheelchair skills, pressure relief, skin inspection, bowel and bladder management training, community mobility, and driving assessment.",
    complications: "Pressure injuries, autonomic dysreflexia (medical emergency for T6 and above), heterotopic ossification, respiratory complications, chronic pain, depression, and upper extremity overuse injuries.",
    clinicalPearls: [
      "C6 SCI with tenodesis grasp can achieve significant independence — preserve tenodesis by NOT stretching finger flexors.",
      "Autonomic dysreflexia in T6 and above is a medical emergency — remove the noxious stimulus (usually bladder distension or bowel impaction).",
      "Pressure relief every 15-30 minutes is essential for preventing pressure injuries."
    ],
    examPitfalls: [
      "Not knowing functional expectations by SCI level — this is high-yield NBCOT content.",
      "Stretching finger flexors in a C6 SCI — this destroys the tenodesis grasp.",
      "Not recognizing autonomic dysreflexia as a medical emergency."
    ],
    faqJson: [
      { question: "What is tenodesis grasp?", answer: "Tenodesis grasp occurs when wrist extension passively closes the fingers (through intact finger flexor tightness), enabling functional grasp without active finger flexion. It is critical for C6 SCI functional independence." },
      { question: "What level of SCI can achieve independent transfers?", answer: "Individuals with C6-C7 SCI can typically achieve independent transfers using sliding boards and upper extremity strength. C7 SCI can often transfer without a sliding board." }
    ]
  },
  {
    slug: "traumatic-brain-injury-ot",
    title: "Traumatic Brain Injury Rehabilitation in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Traumatic Brain Injury Rehabilitation in OT — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for traumatic brain injury across the continuum of care.",
    seoKeywords: ["TBI", "traumatic brain injury", "cognitive rehabilitation", "Rancho Los Amigos", "OT"],
    overview: "OT for traumatic brain injury (TBI) addresses the motor, cognitive, behavioral, and psychosocial consequences of brain injury across the continuum from acute care through community reintegration. Intervention is guided by the Rancho Los Amigos Levels of Cognitive Functioning Scale (Levels I-X), which describes the recovery trajectory from coma to purposeful, appropriate behavior.",
    mechanismPhysiology: "TBI causes primary injury (contusion, diffuse axonal injury, hemorrhage) and secondary injury (edema, ischemia, excitotoxicity). Recovery involves neural recovery, neuroplasticity, and compensatory strategy development. The diffuse nature of TBI typically affects multiple cognitive, motor, and behavioral domains simultaneously.",
    clinicalRelevance: "OTs address the full spectrum of TBI recovery — from coma stimulation and basic ADL retraining through executive function rehabilitation and community reintegration. The holistic OT perspective is essential because TBI affects all areas of occupational performance.",
    signsSymptoms: "Cognitive deficits (attention, memory, executive function), motor impairments, behavioral changes (agitation, impulsivity, disinhibition), sensory processing difficulties, and progressive functional recovery through Rancho Levels.",
    assessment: "Rancho Level assessment, FIM, cognitive screening (MoCA), attention and memory assessments, ADL performance evaluation, behavioral observation, and community reintegration readiness.",
    management: "Rancho Level-appropriate intervention: Levels I-III (sensory stimulation, positioning), Levels IV-VI (structured environment, basic ADL training, behavior management), Levels VII-VIII (compensatory cognitive strategies, community skills, vocational exploration), Levels IX-X (independent living skills, vocational rehabilitation). All levels: safety awareness training, caregiver education.",
    complications: "Post-traumatic seizures, agitation, heterotopic ossification, spasticity, chronic headaches, substance abuse, personality changes, and social isolation.",
    clinicalPearls: [
      "Match intervention complexity to the client's Rancho Level — overly complex tasks for the cognitive level are counterproductive.",
      "At Rancho Level IV (confused-agitated), keep the environment low-stimulation, structured, and predictable.",
      "Executive function deficits are often the most disabling long-term consequence — address initiation, planning, and self-monitoring."
    ],
    examPitfalls: [
      "Not knowing the Rancho Los Amigos Levels — this is frequently tested.",
      "Applying advanced cognitive strategies at low Rancho Levels.",
      "Confusing agitation (Rancho IV) with purposeful behavior — it is a reflexive, non-purposeful state."
    ],
    faqJson: [
      { question: "What are the Rancho Los Amigos Levels?", answer: "The Rancho scale describes 10 levels of cognitive recovery after TBI, from Level I (no response/coma) through Level X (purposeful, appropriate behavior with standby assistance), guiding appropriate intervention." },
      { question: "What is the most common long-term deficit after TBI?", answer: "Executive function deficits (difficulty with planning, organization, initiation, self-monitoring, and problem-solving) are often the most persistent and functionally disabling consequences of TBI." }
    ]
  },
  {
    slug: "multiple-sclerosis-ot",
    title: "Multiple Sclerosis in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Multiple Sclerosis in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for individuals with multiple sclerosis.",
    seoKeywords: ["multiple sclerosis", "MS", "fatigue management", "energy conservation", "neurological OT"],
    overview: "OT for multiple sclerosis (MS) addresses the fluctuating and progressive functional impacts of this chronic neurological condition. Key OT interventions include fatigue management, energy conservation, adaptive equipment, cognitive compensation, upper extremity rehabilitation, and home modification. OTs help clients maintain maximum participation in valued occupations throughout the disease course.",
    mechanismPhysiology: "MS involves autoimmune-mediated demyelination and axonal damage in the central nervous system. Symptoms fluctuate with relapses and remissions (relapsing-remitting MS) or progress steadily (primary or secondary progressive MS). Common symptoms include fatigue, weakness, spasticity, sensory changes, visual impairment, cognitive dysfunction, and bladder dysfunction.",
    clinicalRelevance: "OTs address the functional impacts of MS holistically, with fatigue management being the most common and valuable OT intervention. Energy conservation and work simplification strategies enable sustained participation despite limited energy reserves.",
    signsSymptoms: "Fatigue (most common symptom), upper extremity weakness and incoordination, cognitive dysfunction (processing speed, memory), visual impairment, spasticity, sensory changes, and heat sensitivity (Uhthoff phenomenon).",
    assessment: "Fatigue Severity Scale, Modified Fatigue Impact Scale, 9-HPT, COPM, ADL/IADL performance evaluation, cognitive screening, and home/work environment assessment.",
    management: "Fatigue management (energy conservation, activity pacing, sleep hygiene, environmental modification), adaptive equipment, cognitive compensation strategies (calendars, reminders, task simplification), cooling strategies for heat sensitivity, upper extremity intervention, home and workplace modification, and psychosocial support.",
    complications: "Progressive disability, depression, cognitive decline, urinary tract infections, falls, and social role disruption.",
    clinicalPearls: [
      "Fatigue management is the #1 OT intervention for MS — energy conservation can transform daily function.",
      "Avoid overheating — Uhthoff phenomenon causes temporary symptom worsening with increased body temperature.",
      "Cognitive deficits in MS primarily affect processing speed and working memory — focus compensatory strategies here."
    ],
    examPitfalls: [
      "Not recognizing fatigue as the most common and disabling symptom of MS.",
      "Applying a progressive strengthening program without considering fatigue management.",
      "Ignoring cognitive symptoms in MS — they affect 50-65% of individuals with MS."
    ],
    faqJson: [
      { question: "What is the most important OT intervention for MS?", answer: "Fatigue management through energy conservation, activity pacing, and work simplification is the most commonly needed and effective OT intervention for individuals with MS." },
      { question: "What is Uhthoff phenomenon?", answer: "Uhthoff phenomenon is temporary worsening of MS symptoms caused by increased body temperature (exercise, hot weather, hot baths). Symptoms resolve when body temperature normalizes." }
    ]
  },
  {
    slug: "parkinsons-disease-ot",
    title: "Parkinson's Disease in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Parkinson's Disease in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT assessment and intervention for Parkinson's disease, addressing motor and non-motor symptoms.",
    seoKeywords: ["Parkinson's disease", "PD", "tremor", "bradykinesia", "rigidity", "occupational therapy"],
    overview: "OT for Parkinson's disease (PD) addresses the progressive motor and non-motor symptoms that impact daily function. Key OT interventions include self-care training with compensatory strategies, handwriting programs (e.g., LSVT BIG), fall prevention, cognitive strategies, home modifications, and caregiver education. OTs optimize function at each stage while planning for progressive changes.",
    mechanismPhysiology: "PD results from loss of dopaminergic neurons in the substantia nigra, causing motor symptoms (tremor, bradykinesia, rigidity, postural instability) and non-motor symptoms (cognitive changes, depression, sleep disturbances, autonomic dysfunction). The Hoehn and Yahr scale (stages 1-5) classifies disease severity.",
    clinicalRelevance: "OTs address the daily functional impacts of PD including difficulty with dressing (buttons, zippers), feeding (tremor, utensil use), writing (micrographia), transfers, and home safety. Timing activities with medication cycles (on/off periods) optimizes intervention effectiveness.",
    signsSymptoms: "Resting tremor, bradykinesia (slow movement), rigidity (lead pipe or cogwheel), postural instability, freezing of gait, micrographia, masked facial expression, speech changes, and cognitive decline.",
    assessment: "ADL performance evaluation, handwriting assessment, tremor impact assessment, transfer and balance evaluation, cognitive screening, home safety assessment, and assessment of medication timing effects on function.",
    management: "LSVT BIG (amplitude-based training for large movements), visual and auditory cueing strategies for freezing, handwriting programs, weighted utensils for tremor, adaptive equipment, fall prevention, cognitive compensation, and caregiver education.",
    complications: "Falls and fractures, aspiration pneumonia, cognitive decline and dementia, medication side effects, depression, and progressive loss of independence.",
    clinicalPearls: [
      "Time therapy sessions during medication 'on' periods for optimal motor performance.",
      "Visual and auditory cues help overcome freezing of gait and initiation difficulties.",
      "LSVT BIG teaches high-amplitude movements to counteract the brain's tendency to produce small movements in PD."
    ],
    examPitfalls: [
      "Not knowing the cardinal symptoms of PD: Tremor, Rigidity, Akinesia/Bradykinesia, Postural instability (TRAP).",
      "Confusing resting tremor (PD) with intention tremor (cerebellar).",
      "Ignoring the impact of medication timing on functional performance."
    ],
    faqJson: [
      { question: "What are the cardinal motor symptoms of Parkinson's disease?", answer: "The four cardinal symptoms are Tremor (resting), Rigidity, Akinesia/Bradykinesia (slow movement), and Postural instability — remembered by the acronym TRAP." },
      { question: "How does OT help with Parkinson's disease?", answer: "OTs address daily function through compensatory strategies, cueing techniques, amplitude training (LSVT BIG), adaptive equipment, fall prevention, cognitive strategies, and caregiver education." }
    ]
  },
  {
    slug: "guillain-barre-syndrome-ot",
    title: "Guillain-Barré Syndrome in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Guillain-Barré Syndrome in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT management of Guillain-Barré syndrome, from acute care through functional recovery.",
    seoKeywords: ["Guillain-Barré syndrome", "GBS", "peripheral neuropathy", "ascending paralysis", "OT"],
    overview: "OT for Guillain-Barré Syndrome (GBS) addresses the progressive and recovering phases of this acute inflammatory demyelinating polyneuropathy. GBS causes ascending paralysis that may progress to respiratory failure, followed by a recovery phase. OTs provide positioning, splinting, ADL training, energy conservation, and progressive functional restoration throughout the illness trajectory.",
    mechanismPhysiology: "GBS is an autoimmune condition where the immune system attacks peripheral nerves, causing demyelination and/or axonal damage. The classic pattern is ascending weakness starting distally and progressing proximally. Recovery typically follows a descending pattern (proximal to distal) over weeks to months.",
    clinicalRelevance: "OTs manage functional impacts across all phases: acute (positioning, splinting, passive ROM), plateau (ADL adaptation, energy conservation, emotional support), and recovery (progressive strengthening, functional retraining, return to roles). Fatigue management is critical throughout recovery.",
    signsSymptoms: "Ascending weakness (feet → legs → trunk → arms → face), sensory changes, pain, respiratory compromise in severe cases, autonomic instability, and profound fatigue.",
    assessment: "Manual muscle testing, ROM measurement, ADL performance evaluation, fatigue assessment, sensory assessment, respiratory status monitoring, and functional goal setting.",
    management: "Acute phase: positioning, gentle PROM, splinting to prevent deformity, emotional support. Recovery phase: graded strengthening, ADL retraining, energy conservation, adaptive equipment (temporary), work hardening, and community reintegration. Monitor for overwork weakness.",
    complications: "Overwork weakness (excessive exercise during recovery can worsen weakness), respiratory failure, chronic fatigue, residual weakness, pain, and psychological adjustment difficulties.",
    clinicalPearls: [
      "Monitor for overwork weakness — muscles in GBS recovery can be damaged by excessive exercise.",
      "Recovery is typically proximal to distal — expect arm function before hand function.",
      "Fatigue management is essential throughout recovery and may persist long-term."
    ],
    examPitfalls: [
      "Not recognizing the ascending pattern of GBS (vs. descending pattern of MS).",
      "Applying aggressive strengthening during the acute or early recovery phase — risk of overwork weakness.",
      "Confusing GBS (peripheral nervous system, recoverable) with MS (central nervous system, progressive)."
    ],
    faqJson: [
      { question: "What is Guillain-Barré Syndrome?", answer: "GBS is an acute autoimmune condition affecting peripheral nerves, causing ascending weakness that may progress to paralysis and respiratory failure, followed by recovery over weeks to months." },
      { question: "What is overwork weakness in GBS?", answer: "Overwork weakness occurs when excessive exercise during GBS recovery actually damages regenerating muscles, causing increased weakness rather than improvement. Exercise must be carefully graded." }
    ]
  },
  {
    slug: "amyotrophic-lateral-sclerosis-ot",
    title: "Amyotrophic Lateral Sclerosis (ALS) in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "ALS in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to OT management of ALS focusing on maintaining function, adaptive equipment, and quality of life.",
    seoKeywords: ["ALS", "amyotrophic lateral sclerosis", "motor neuron disease", "adaptive equipment", "palliative OT"],
    overview: "OT for ALS focuses on maintaining maximum function and quality of life as motor neurons progressively degenerate. OTs provide adaptive equipment, assistive technology, environmental modification, energy conservation, caregiver training, and psychosocial support. Intervention goals shift from independence maintenance to comfort and participation as the disease progresses.",
    mechanismPhysiology: "ALS involves progressive degeneration of both upper and lower motor neurons, causing muscle weakness, atrophy, fasciculations, and spasticity. Cognitive function is typically preserved (though frontotemporal dementia co-occurs in 15%). Average survival is 2-5 years from symptom onset.",
    clinicalRelevance: "OTs must anticipate functional decline and proactively recommend equipment and strategies before function is lost. This 'just-in-time' approach provides equipment when the person is ready, not in crisis. OTs are essential for maintaining quality of life throughout the disease trajectory.",
    signsSymptoms: "Progressive muscle weakness (typically starting in one limb), fasciculations, muscle atrophy, difficulty with fine motor tasks, swallowing difficulties, respiratory insufficiency, and eventual total paralysis.",
    assessment: "ALS Functional Rating Scale-Revised (ALSFRS-R), upper extremity function assessment, ADL performance, communication assessment, respiratory function monitoring, and caregiver burden assessment.",
    management: "Adaptive equipment progression (built-up handles → universal cuff → mobile arm support → environmental control), assistive technology for communication, power wheelchair with tilt-in-space, home modifications, caregiver training, energy conservation, and end-of-life planning support.",
    complications: "Rapid functional decline overwhelming intervention, respiratory failure, aspiration, depression, caregiver burnout, and end-of-life decisions.",
    clinicalPearls: [
      "Proactive equipment provision is key — anticipate needs and introduce equipment before crisis.",
      "Mobile arm supports can extend independent feeding and self-care when proximal weakness develops.",
      "Power wheelchair with tilt-in-space, recline, and elevating leg rests provides maximum positioning options as the disease progresses."
    ],
    examPitfalls: [
      "Setting restorative/strengthening goals for a progressive, terminal condition.",
      "Waiting until function is lost before providing equipment — proactive planning is essential.",
      "Not recognizing that cognition is typically preserved — individuals with ALS can participate in goal setting and decision-making."
    ],
    faqJson: [
      { question: "What is the OT's role in ALS?", answer: "OTs maintain function and quality of life through proactive adaptive equipment provision, assistive technology, environmental modification, energy conservation, and caregiver support as the disease progresses." },
      { question: "What is a mobile arm support?", answer: "A mobile arm support is a mechanical device mounted to a wheelchair or table that supports the weight of the arm, enabling individuals with proximal weakness to perform activities like feeding and grooming." }
    ]
  },
  {
    slug: "vestibular-rehabilitation-ot",
    title: "Vestibular Rehabilitation in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Vestibular Rehabilitation in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to vestibular rehabilitation and dizziness management in occupational therapy practice.",
    seoKeywords: ["vestibular rehabilitation", "dizziness", "BPPV", "vertigo", "balance", "OT"],
    overview: "Vestibular rehabilitation in OT addresses dizziness, vertigo, and balance disturbances that impact daily function and safety. OTs assess how vestibular dysfunction affects ADL performance, driving, work tasks, and community participation. Interventions include habituation exercises, gaze stabilization, balance training, and activity modification. OTs complement vestibular PTs by addressing the occupational and functional impacts of vestibular disorders.",
    mechanismPhysiology: "The vestibular system (semicircular canals, otolith organs) detects head position and movement, contributing to balance, gaze stabilization, and spatial orientation. Vestibular dysfunction causes vertigo, dizziness, imbalance, and visual disturbance. Vestibular compensation occurs through neural adaptation and sensory substitution.",
    clinicalRelevance: "OTs address the functional impacts of vestibular disorders on daily activities, including difficulty with head movements during grooming, bending for dressing, balance during bathing, and community mobility. Fall prevention and safety are key OT concerns.",
    signsSymptoms: "Vertigo (spinning sensation), dizziness, imbalance, nausea, difficulty with head movements during activities, falls, difficulty reading or using screens, and anxiety about movement.",
    assessment: "Dizziness Handicap Inventory, functional assessment during activities involving head movement, balance assessment, fall risk evaluation, and driving assessment.",
    management: "Canalith repositioning for BPPV (Epley maneuver), habituation exercises (repeated exposure to provocative movements), gaze stabilization exercises, balance training during functional tasks, environmental modifications, energy conservation, and gradual return to normal activities.",
    complications: "Falls from vestibular-related imbalance, activity avoidance leading to deconditioning, anxiety and depression, and chronic dizziness.",
    clinicalPearls: [
      "BPPV (benign paroxysmal positional vertigo) is the most common vestibular disorder — treated effectively with canalith repositioning maneuvers.",
      "OTs address vestibular dysfunction within functional activities — grooming with head movements, bending for dressing, cooking with visual tracking.",
      "Vestibular rehabilitation takes 6-12 weeks for compensation — educate clients about expected timelines."
    ],
    examPitfalls: [
      "Not knowing that BPPV is treated with the Epley or Semont maneuver, not habituation exercises.",
      "Confusing vestibular habituation (repeated exposure to provoking stimuli) with gaze stabilization (VOR exercises).",
      "Ignoring the functional and psychosocial impacts of dizziness."
    ],
    faqJson: [
      { question: "How does OT help with vestibular disorders?", answer: "OTs address the functional impacts of dizziness and imbalance on daily activities, providing activity modification, safety strategies, fall prevention, and gradual return to normal function through vestibular exercises." },
      { question: "What is BPPV?", answer: "Benign Paroxysmal Positional Vertigo is the most common vestibular disorder, caused by displaced calcium crystals in the semicircular canals. It is treated with canalith repositioning maneuvers (Epley maneuver)." }
    ]
  },
  {
    slug: "neurodevelopmental-treatment",
    title: "Neurodevelopmental Treatment (NDT/Bobath)",
    category: "Neurological Rehabilitation",
    seoTitle: "Neurodevelopmental Treatment (NDT) in OT — OT Encyclopedia",
    seoDescription: "Guide to NDT/Bobath approach in occupational therapy for neurological rehabilitation.",
    seoKeywords: ["NDT", "neurodevelopmental treatment", "Bobath", "neurological rehabilitation", "tone management", "OT"],
    overview: "Neurodevelopmental Treatment (NDT), also known as the Bobath approach, is a clinical framework for the assessment and treatment of individuals with neurological conditions. Developed by Berta and Karel Bobath, it focuses on analyzing movement quality, managing abnormal tone, facilitating normal movement patterns, and optimizing functional performance. NDT is widely used in stroke, cerebral palsy, and traumatic brain injury rehabilitation.",
    mechanismPhysiology: "NDT is based on neuroplasticity principles, positing that guided movement experiences can promote neural reorganization and improve motor function. The approach addresses the interplay between postural control, tone regulation, and functional movement through hands-on facilitation and inhibition techniques.",
    clinicalRelevance: "NDT is one of the most widely used approaches in neurological OT. While evidence for NDT alone is mixed, its principles are commonly integrated with task-specific practice and other evidence-based approaches for a comprehensive treatment strategy.",
    signsSymptoms: "Abnormal muscle tone (spasticity, flaccidity), impaired postural control, abnormal movement patterns, and difficulty with functional tasks due to neuromotor dysfunction.",
    assessment: "Movement analysis focusing on quality of movement, postural control, tone distribution, weight shifting ability, selective movement capacity, and functional task performance.",
    management: "Key handling techniques for tone normalization, facilitation of normal movement patterns during functional tasks, weight-bearing and weight-shifting activities, proximal stability development for distal function, positioning and adaptive equipment, and integration with task-specific training.",
    complications: "Overemphasis on normal movement quality at the expense of functional independence, and limited evidence for NDT as a standalone approach compared to task-specific training.",
    clinicalPearls: [
      "Modern NDT integrates task-specific practice — it is not solely about handling and facilitation.",
      "Key points of control (shoulder, pelvis, trunk) are used to facilitate and guide movement.",
      "NDT principles are most effective when combined with task-specific, goal-directed practice."
    ],
    examPitfalls: [
      "Not knowing the basic NDT principles: normalizing tone, facilitating normal movement, inhibiting abnormal patterns.",
      "Assuming NDT and task-specific practice are mutually exclusive — modern practice integrates both.",
      "Not recognizing that NDT requires specialized training and certification."
    ],
    faqJson: [
      { question: "What is NDT/Bobath approach?", answer: "NDT is a clinical framework for neurological rehabilitation that analyzes movement quality, manages abnormal tone, and facilitates normal movement patterns through hands-on techniques during functional activities." },
      { question: "Is NDT evidence-based?", answer: "Evidence for NDT alone is mixed, but its principles are commonly integrated with task-specific practice and other evidence-based approaches. Modern NDT emphasizes functional, goal-directed activity rather than isolated handling techniques." }
    ]
  },
  {
    slug: "apraxia-management",
    title: "Apraxia Management in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Apraxia Management in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to assessment and intervention for apraxia in occupational therapy practice.",
    seoKeywords: ["apraxia", "ideational apraxia", "ideomotor apraxia", "motor planning", "OT"],
    overview: "Apraxia management in OT addresses the impaired ability to plan and execute skilled, learned movements despite intact motor, sensory, and cognitive function. OTs differentiate between ideomotor apraxia (difficulty performing gestures on command despite spontaneous ability), ideational apraxia (loss of the concept of how to use objects or sequence multi-step tasks), and constructional apraxia (difficulty with spatial organization in building/drawing). Apraxia commonly results from left hemisphere stroke.",
    mechanismPhysiology: "Apraxia reflects disruption of the motor planning system, typically from left hemisphere damage (parietal or premotor cortex). Ideomotor apraxia involves disconnection between the concept of movement and its execution. Ideational apraxia involves loss of the movement concept itself. These are distinct from motor weakness or sensory loss.",
    clinicalRelevance: "Apraxia significantly impacts ADL performance because daily tasks require planned, sequenced motor actions. OTs are the primary professionals addressing the functional impacts of apraxia through compensatory strategies, environmental modification, and direct training approaches.",
    signsSymptoms: "Difficulty using tools correctly, errors in ADL sequencing (e.g., brushing teeth with wrong end), inability to pantomime actions on command, spatial errors in dressing, and difficulty following multi-step instructions.",
    assessment: "Gesture imitation tasks, tool use observation, ADL sequencing assessment, constructional tasks (drawing, block design), and Florida Apraxia Battery.",
    management: "Strategy training (task-specific, errorless learning), verbal and visual cueing, task simplification, environmental modification (labeled drawers, sequenced visual guides), hands-on guidance (physical prompts), and repetitive practice of specific functional tasks.",
    complications: "Persistent ADL dependence, safety risks from incorrect tool use, frustration and decreased participation, and difficulty differentiating apraxia from cognitive deficits.",
    clinicalPearls: [
      "Provide actual objects during assessment and treatment — apraxia is worse with pantomime and better with real objects in real contexts.",
      "Errorless learning is more effective than trial-and-error for individuals with apraxia.",
      "Verbal cues may paradoxically worsen ideomotor apraxia — physical guidance and demonstration may be more effective."
    ],
    examPitfalls: [
      "Confusing ideomotor apraxia (can't perform on command) with ideational apraxia (doesn't know how to use the object).",
      "Not recognizing that apraxia is different from weakness, sensory loss, or cognitive impairment.",
      "Forgetting that apraxia typically results from LEFT hemisphere damage."
    ],
    faqJson: [
      { question: "What is the difference between ideomotor and ideational apraxia?", answer: "Ideomotor apraxia: the person knows what to do but can't execute the movement on command (though may perform spontaneously). Ideational apraxia: the person has lost the concept of how to use objects or sequence multi-step tasks." },
      { question: "How does OT treat apraxia?", answer: "OTs use strategy training, errorless learning, cueing hierarchies, task simplification, environmental modification, and repetitive practice of specific functional tasks to improve daily function." }
    ]
  },
  {
    slug: "unilateral-neglect-management",
    title: "Unilateral Neglect Management",
    category: "Neurological Rehabilitation",
    seoTitle: "Unilateral Neglect Management in OT — OT Encyclopedia",
    seoDescription: "Guide to unilateral neglect assessment and intervention in occupational therapy after stroke.",
    seoKeywords: ["unilateral neglect", "hemispatial neglect", "visual scanning", "right hemisphere stroke", "OT"],
    overview: "Unilateral neglect management in OT addresses the failure to attend to stimuli on the side contralateral to a brain lesion, most commonly left-sided neglect following right hemisphere stroke. Unlike hemianopsia (a visual field cut), neglect involves a failure of awareness — the person is unaware of and does not attend to the affected side. OTs use visual scanning training, environmental modification, and compensatory strategies to improve awareness and safety.",
    mechanismPhysiology: "Unilateral neglect results from damage to the right hemisphere (most commonly the parietal lobe), disrupting the spatial attention network. The right hemisphere normally monitors attention to both sides, so right hemisphere damage causes left-sided neglect. Left hemisphere strokes rarely cause significant neglect because the right hemisphere can compensate.",
    clinicalRelevance: "Neglect is one of the strongest negative predictors of functional recovery after stroke. It affects safety (collisions, burns, falls), self-care (grooming only one side), mobility (wheelchair navigation), and eating (eating from only one side of the plate). OTs are primary providers of neglect rehabilitation.",
    signsSymptoms: "Failure to groom, dress, or attend to the affected side, eating only from one side of the plate, colliding with objects on the neglected side, reading only one side of text, and inability to find objects on the neglected side.",
    assessment: "Line bisection test, cancellation tests (star, letter, bell), clock drawing test, behavioral observation during ADLs, and Catherine Bergego Scale (functional neglect assessment).",
    management: "Visual scanning training (systematic left-to-right scanning), anchoring techniques (placing a colored marker on the neglected side as a visual anchor), prism adaptation therapy, limb activation (engaging the neglected side's limb), environmental modification (placing items on the neglected side to promote awareness), and cueing strategies.",
    complications: "Persistent neglect leading to chronic safety risks, falls, and decreased independence. Anosognosia (lack of awareness of the deficit) complicates treatment because the person doesn't recognize the need for compensatory strategies.",
    clinicalPearls: [
      "Neglect is NOT the same as hemianopsia — a person with hemianopsia knows they can't see but compensates; a person with neglect is UNAWARE of the deficit.",
      "Prism adaptation therapy has emerging evidence for neglect rehabilitation.",
      "Place important items ON the neglected side initially to force attention, not on the intact side for convenience."
    ],
    examPitfalls: [
      "Confusing neglect (attention deficit — unaware) with hemianopsia (visual field cut — aware).",
      "Not recognizing that neglect is more common with RIGHT hemisphere strokes.",
      "Placing everything on the intact side for convenience — this reinforces neglect rather than treating it."
    ],
    faqJson: [
      { question: "What is unilateral neglect?", answer: "Unilateral neglect is a failure to attend to, perceive, or respond to stimuli on the side opposite a brain lesion, most commonly left-sided neglect after right hemisphere stroke. The person is unaware of the deficit." },
      { question: "How is neglect different from hemianopsia?", answer: "Hemianopsia is a visual field cut — the person can't see on one side but is aware and can compensate. Neglect is an attention deficit — the person is unaware of the affected side and doesn't spontaneously look or respond to stimuli there." }
    ]
  },
  // ===== SENSORY INTEGRATION (5 entries) =====
  {
    slug: "ayres-sensory-integration",
    title: "Ayres Sensory Integration (ASI)",
    category: "Sensory Integration",
    seoTitle: "Ayres Sensory Integration in OT — OT Encyclopedia",
    seoDescription: "Guide to Ayres Sensory Integration theory and intervention in occupational therapy.",
    seoKeywords: ["ASI", "Ayres Sensory Integration", "sensory integration therapy", "Jean Ayres", "OT"],
    overview: "Ayres Sensory Integration (ASI) is a theoretical framework and intervention approach developed by A. Jean Ayres that addresses the neurological process of organizing sensory information for adaptive behavior. ASI therapy uses controlled sensory experiences to promote adaptive responses, targeting vestibular, proprioceptive, and tactile processing as foundations for higher-level skills. ASI intervention is delivered in a sensory-rich environment with suspended equipment, tactile materials, and motor challenges.",
    mechanismPhysiology: "ASI theory posits that the ability to process and integrate sensory information (especially vestibular, proprioceptive, and tactile) is fundamental to motor planning, behavior regulation, and learning. When sensory integration is impaired, adaptive responses are disrupted, affecting function across developmental domains.",
    clinicalRelevance: "ASI is the most widely used sensory-based intervention in pediatric OT. It requires specialized training and certification. ASI intervention follows specific fidelity criteria including child-directed activity, therapist facilitation of the 'just-right challenge,' and rich sensory opportunities.",
    signsSymptoms: "Sensory over- or under-responsivity, motor planning difficulties, poor body awareness, gravitational insecurity, tactile defensiveness, and difficulty with adaptive responses to sensory input.",
    assessment: "Sensory Integration and Praxis Tests (SIPT — gold standard), clinical observation of sensory responses, Sensory Profile, and functional assessment of sensory impacts.",
    management: "ASI therapy in a clinic with suspended equipment (swings, platforms), tactile exploration materials, heavy work activities, and motor challenges. Key principles: child-directed, therapist-facilitated, 'just-right challenge,' active engagement, and sensory-rich environment. Session frequency typically 1-3 times/week.",
    complications: "Difficulty accessing trained therapists and equipped facilities, cost of equipment, and ongoing debate about evidence base compared to other approaches.",
    clinicalPearls: [
      "ASI fidelity criteria distinguish true ASI therapy from generic sensory activities — adherence to fidelity is essential.",
      "The vestibular, proprioceptive, and tactile systems are the foundational sensory systems in ASI theory.",
      "Emerging evidence supports ASI for improving outcomes in children with autism spectrum disorder."
    ],
    examPitfalls: [
      "Confusing generic 'sensory activities' with structured ASI therapy — ASI has specific fidelity criteria.",
      "Not knowing that ASI was developed by A. Jean Ayres.",
      "Confusing ASI (performance-based therapy) with sensory diets (scheduled sensory activities)."
    ],
    faqJson: [
      { question: "What is Ayres Sensory Integration?", answer: "ASI is a theory and therapy approach developed by A. Jean Ayres that addresses the neurological process of organizing sensory information through child-directed activities in a sensory-rich environment to promote adaptive responses." },
      { question: "How is ASI different from a sensory diet?", answer: "ASI is a structured therapy approach delivered by trained therapists in equipped clinics, following specific fidelity criteria. A sensory diet is a scheduled set of sensory activities implemented throughout the day in natural settings." }
    ]
  },
  {
    slug: "proprioceptive-processing",
    title: "Proprioceptive Processing",
    category: "Sensory Integration",
    seoTitle: "Proprioceptive Processing in OT — OT Encyclopedia",
    seoDescription: "Guide to proprioceptive processing assessment and intervention in occupational therapy.",
    seoKeywords: ["proprioception", "body awareness", "heavy work", "deep pressure", "sensory processing", "OT"],
    overview: "Proprioceptive processing refers to the ability to sense joint position, muscle tension, and body movement through receptors in muscles, tendons, and joints. In OT, proprioceptive input is used therapeutically to improve body awareness, motor planning, force modulation, and self-regulation. Proprioceptive activities ('heavy work') are among the most commonly prescribed sensory strategies.",
    mechanismPhysiology: "Proprioceptors (muscle spindles, Golgi tendon organs, joint receptors) provide information about body position and movement. This information contributes to motor control, postural stability, and body schema. Proprioceptive input is generally calming and organizing, making it useful for regulation across sensory profiles.",
    clinicalRelevance: "OTs use proprioceptive strategies across practice areas — from pediatric sensory integration to adult rehabilitation. Heavy work activities, resistance exercises, and deep pressure are therapeutic applications of proprioceptive input.",
    signsSymptoms: "Poor body awareness, difficulty grading force (too much or too little pressure), clumsiness, difficulty with motor planning, seeking heavy proprioceptive input (crashing, jumping), and poor postural control.",
    assessment: "Clinical observation of motor control and force grading, proprioceptive discrimination testing, postural control assessment, and Sensory Profile/SPM results for proprioceptive processing patterns.",
    management: "Heavy work activities (pushing, pulling, carrying, climbing), deep pressure (weighted blankets, compression garments, bear hugs), resistance activities (therapy putty, resistance bands), oral proprioception (chewy foods, vibrating toothbrush), and proprioceptive-rich play (obstacle courses, wheelbarrow walking).",
    complications: "Overstimulation if proprioceptive input is combined with vestibular input without careful grading. Joint stress if activities are not age/size appropriate.",
    clinicalPearls: [
      "Proprioceptive input is universally calming and organizing — it is the safest sensory input to use.",
      "Heavy work activities are the cornerstone of most sensory diets.",
      "Proprioceptive input can be used both as preparation for challenging tasks and as a calming strategy after dysregulation."
    ],
    examPitfalls: [
      "Not knowing the difference between proprioception (body position/movement) and vestibular (head position/movement).",
      "Confusing proprioceptive activities with general exercise.",
      "Not recognizing that proprioceptive input is the most universally tolerated sensory input."
    ],
    faqJson: [
      { question: "What is proprioceptive processing?", answer: "Proprioception is the ability to sense body position, movement, and force through receptors in muscles, tendons, and joints. It contributes to motor control, body awareness, and self-regulation." },
      { question: "Why are heavy work activities recommended?", answer: "Heavy work provides proprioceptive input that is calming and organizing for the nervous system. Activities like pushing, pulling, carrying, and climbing help improve body awareness, motor planning, and self-regulation." }
    ]
  },
  {
    slug: "vestibular-processing",
    title: "Vestibular Processing",
    category: "Sensory Integration",
    seoTitle: "Vestibular Processing in OT — OT Encyclopedia",
    seoDescription: "Guide to vestibular processing, gravitational insecurity, and vestibular-based intervention in OT.",
    seoKeywords: ["vestibular processing", "gravitational insecurity", "vestibular input", "movement sensitivity", "OT"],
    overview: "Vestibular processing involves the detection and interpretation of head position and movement through the vestibular apparatus in the inner ear. In pediatric OT, vestibular input is used therapeutically to improve postural control, bilateral coordination, motor planning, visual-motor skills, and arousal regulation. Vestibular dysfunction may present as gravitational insecurity, motion sickness, or vestibular seeking behavior.",
    mechanismPhysiology: "The vestibular system (semicircular canals for rotational movement, otolith organs for linear acceleration and head position) provides foundational input for postural control, gaze stability, spatial orientation, and arousal modulation. Vestibular input interacts with proprioceptive and visual systems for integrated function.",
    clinicalRelevance: "OTs use vestibular-based activities (swinging, spinning, rocking, inverting) to promote postural control, bilateral coordination, and arousal modulation. Vestibular input is a powerful tool but must be used carefully — it has the longest-lasting effect of any sensory input and can cause autonomic responses.",
    signsSymptoms: "Gravitational insecurity (fear of movement, feet leaving the ground), motion sickness, poor postural control, difficulty with balance activities, vestibular seeking (constant spinning, rocking), and decreased bilateral coordination.",
    assessment: "Clinical observation of responses to movement (swinging, spinning, position changes), post-rotary nystagmus testing, balance and postural control assessment, and Sensory Profile vestibular items.",
    management: "Graded vestibular activities (linear before rotary, slow before fast), suspended equipment in SI clinics, movement-based play, vestibular desensitization for gravitational insecurity, and integration of vestibular input with proprioceptive activities.",
    complications: "Autonomic responses (nausea, pallor, sweating) from too much vestibular input. Vestibular input has the longest-lasting sensory effect — overstimulation effects may not appear for up to 4-8 hours after the activity.",
    clinicalPearls: [
      "Linear vestibular input (back-and-forth) is generally calming; rotary input (spinning) is alerting and more intense.",
      "Vestibular input effects can be delayed up to 4-8 hours — always start with low-intensity, brief exposure.",
      "Combine vestibular input with proprioceptive input (heavy work) for a more modulated response."
    ],
    examPitfalls: [
      "Not knowing that vestibular input has the longest-lasting effect and delayed responses.",
      "Using intense rotary vestibular input without gradual introduction — risk of autonomic responses.",
      "Confusing gravitational insecurity (emotional fear response) with vestibular hypo-responsivity (seeking behavior)."
    ],
    faqJson: [
      { question: "What is gravitational insecurity?", answer: "Gravitational insecurity is an excessive fear or anxiety response to movement, changes in head position, or having feet leave the ground, reflecting over-responsivity to vestibular input." },
      { question: "How does vestibular input affect arousal?", answer: "Linear, rhythmic vestibular input (rocking, slow swinging) is generally calming, while fast, rotary, or irregular vestibular input (spinning, bouncing) is alerting and activating." }
    ]
  },
  {
    slug: "tactile-processing",
    title: "Tactile Processing",
    category: "Sensory Integration",
    seoTitle: "Tactile Processing in OT — OT Encyclopedia",
    seoDescription: "Guide to tactile processing, tactile defensiveness, and tactile-based intervention in OT.",
    seoKeywords: ["tactile processing", "tactile defensiveness", "touch sensitivity", "desensitization", "OT"],
    overview: "Tactile processing involves the ability to receive, interpret, and respond to touch information. Tactile dysfunction may manifest as tactile defensiveness (over-responsivity to touch), tactile hypo-responsivity (under-registration of touch), or poor tactile discrimination (difficulty identifying objects by touch). OTs address tactile processing through desensitization, discrimination training, and sensory-based activities.",
    mechanismPhysiology: "The tactile system uses two pathways: the discriminative (epicritic) system provides precise information about touch, pressure, vibration, and texture; the protective (protopathic) system alerts to potentially harmful stimuli. Tactile defensiveness is theorized to result from an imbalance between these systems, with the protective system dominating.",
    clinicalRelevance: "Tactile processing affects self-care (tolerance of clothing, bathing, grooming), feeding (texture acceptance), fine motor tasks (object manipulation), social interaction (tolerance of casual touch), and emotional regulation. OTs address tactile dysfunction across pediatric and adult practice.",
    signsSymptoms: "Tactile defensiveness: distress with light touch, clothing tags, certain textures, grooming activities. Hypo-responsivity: not noticing touch, seeking intense tactile input, unaware of dirty hands/face. Poor discrimination: difficulty with in-hand manipulation, object identification by touch.",
    assessment: "Sensory Profile tactile items, Touch Inventory for Elementary School-Aged Children, clinical observation of responses to different tactile stimuli, stereognosis testing, and two-point discrimination.",
    management: "Desensitization programs (Wilbarger Protocol for tactile defensiveness), graded tactile exposure, deep pressure before light touch, tactile discrimination activities (hidden objects in bins, texture matching), and messy play with gradual progression.",
    complications: "Forcing tactile exposure too quickly can increase defensiveness. Social impacts of tactile avoidance. Not all tactile sensitivity is pathological — cultural and personal preferences should be respected.",
    clinicalPearls: [
      "Deep pressure (firm touch) is generally calming; light, unexpected touch is most likely to trigger defensive responses.",
      "The Wilbarger Protocol (brushing program) uses a specific technique and schedule for tactile desensitization — requires training.",
      "Always grade tactile activities from tolerated to challenging — forced exposure increases defensiveness."
    ],
    examPitfalls: [
      "Not knowing the difference between tactile defensiveness (over-responsivity) and poor tactile discrimination.",
      "Confusing the discriminative and protective tactile systems.",
      "Forcing light touch exposure without grading from deep pressure — this worsens defensiveness."
    ],
    faqJson: [
      { question: "What is tactile defensiveness?", answer: "Tactile defensiveness is an over-responsivity to touch stimuli that most people would consider non-threatening, causing distress with clothing textures, light touch, grooming activities, or certain food textures." },
      { question: "How is tactile defensiveness treated?", answer: "Treatment involves systematic desensitization starting with tolerated input (deep pressure, firm touch) and gradually progressing to more challenging stimuli, along with sensory diet activities and environmental modifications." }
    ]
  },
  {
    slug: "sensory-diet",
    title: "Sensory Diet",
    category: "Sensory Integration",
    seoTitle: "Sensory Diet in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to designing and implementing sensory diets for self-regulation in occupational therapy.",
    seoKeywords: ["sensory diet", "sensory strategies", "self-regulation", "sensory activities", "OT"],
    overview: "A sensory diet is an individualized activity plan that provides the specific sensory input a person needs throughout the day to maintain optimal arousal and regulation. Developed by Patricia Wilbarger, the concept draws an analogy to a nutritional diet — just as the body needs the right food at the right times, the nervous system needs the right sensory input at the right times. OTs design sensory diets based on individual sensory profiles.",
    mechanismPhysiology: "Sensory diets work by providing scheduled sensory input that modulates nervous system arousal. Proprioceptive and vestibular inputs are typically organizing; deep pressure is calming; light touch and rapid vestibular input are alerting. The goal is to maintain the nervous system in an optimal zone for attention, learning, and behavior.",
    clinicalRelevance: "Sensory diets are among the most commonly implemented OT interventions for children with sensory processing differences, ADHD, and autism. They are designed for implementation by caregivers, teachers, and the individual themselves throughout natural routines.",
    signsSymptoms: "Difficulty maintaining attention, hyperactivity or lethargy, sensory seeking or avoidance behaviors, emotional dysregulation, difficulty with transitions, and behavioral challenges related to sensory processing.",
    assessment: "Sensory Profile results, behavioral observation, arousal level monitoring, and identification of activities/environments that support or challenge regulation.",
    management: "Design a schedule of sensory activities tailored to the individual's sensory profile: heavy work/proprioceptive activities (carrying books, wall push-ups), vestibular input (swinging, bouncing), tactile input (fidgets, textured items), oral motor input (chewy snacks, water bottle), and environmental modifications (noise-canceling headphones, movement seating). Activities are embedded into the daily routine at strategic times.",
    complications: "Generic sensory diets without individualization, difficulty maintaining compliance with busy schedules, and activities that are not age-appropriate or socially acceptable for the setting.",
    clinicalPearls: [
      "A sensory diet must be individualized — 'one size fits all' approaches are ineffective and potentially harmful.",
      "Schedule sensory activities BEFORE challenging tasks (transitions, seated work) for optimal effect.",
      "Revisit and adjust the sensory diet regularly — sensory needs change with development and context."
    ],
    examPitfalls: [
      "Prescribing a generic sensory diet without individualized assessment.",
      "Not knowing who developed the sensory diet concept (Patricia Wilbarger).",
      "Confusing a sensory diet (scheduled throughout the day) with sensory integration therapy (clinic-based sessions)."
    ],
    faqJson: [
      { question: "What is a sensory diet?", answer: "A sensory diet is an individualized plan of scheduled sensory activities throughout the day that provides the specific input a person's nervous system needs to maintain optimal arousal and regulation." },
      { question: "How is a sensory diet different from sensory integration therapy?", answer: "A sensory diet consists of activities embedded throughout the daily routine, implemented by caregivers and the individual. Sensory integration therapy is a structured, clinic-based intervention delivered by a trained OT using specialized equipment." }
    ]
  },
  // ===== HAND THERAPY (5 entries) =====
  {
    slug: "carpal-tunnel-syndrome",
    title: "Carpal Tunnel Syndrome Management",
    category: "Hand Therapy",
    seoTitle: "Carpal Tunnel Syndrome in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy assessment and management of carpal tunnel syndrome.",
    seoKeywords: ["carpal tunnel syndrome", "CTS", "median nerve", "nerve gliding", "wrist splint", "hand therapy"],
    overview: "Carpal tunnel syndrome (CTS) management in OT encompasses conservative treatment and post-surgical rehabilitation. CTS is the most common peripheral nerve compression, involving the median nerve at the wrist. OTs provide splinting, nerve and tendon gliding exercises, ergonomic modification, activity analysis, and post-carpal tunnel release rehabilitation.",
    mechanismPhysiology: "CTS results from increased pressure within the carpal tunnel compressing the median nerve. The carpal tunnel contains 9 flexor tendons and the median nerve, bounded by the carpal bones and the transverse carpal ligament. Compression causes demyelination and, in severe cases, axonal damage.",
    clinicalRelevance: "CTS is one of the most common conditions treated in hand therapy. OTs provide comprehensive conservative management that may prevent the need for surgery, as well as post-operative rehabilitation to restore function.",
    signsSymptoms: "Numbness and tingling in the median nerve distribution (thumb, index, middle, radial half of ring finger), night symptoms, weakness of thenar muscles, difficulty with fine motor tasks, and dropping objects.",
    assessment: "Phalen's test, Tinel's sign, Semmes-Weinstein monofilament testing, grip and pinch strength, Durkan's compression test, and nerve conduction studies (physician-ordered).",
    management: "Conservative: neutral wrist splint (especially at night), nerve gliding exercises, tendon gliding exercises, ergonomic modification, activity analysis, and anti-inflammatory measures. Post-surgical: wound care, scar management, nerve and tendon gliding, progressive strengthening, and return to function.",
    complications: "Persistent symptoms after conservative treatment requiring surgery, pillar pain after surgery, incomplete nerve recovery in severe/chronic cases, and CRPS.",
    clinicalPearls: [
      "Splint the wrist in NEUTRAL (0°) for CTS — extension increases carpal tunnel pressure.",
      "Nerve gliding exercises mobilize the median nerve and reduce adhesions within the carpal tunnel.",
      "Night splinting alone can resolve mild to moderate CTS symptoms in many cases."
    ],
    examPitfalls: [
      "Positioning the wrist in extension for CTS splinting — should be neutral.",
      "Not knowing the median nerve distribution in the hand.",
      "Confusing CTS with pronator teres syndrome or anterior interosseous syndrome."
    ],
    faqJson: [
      { question: "What is carpal tunnel syndrome?", answer: "CTS is compression of the median nerve in the carpal tunnel at the wrist, causing numbness, tingling, and weakness in the thumb, index, middle, and radial half of the ring finger." },
      { question: "Can OT treat carpal tunnel syndrome without surgery?", answer: "Yes, OT conservative management includes neutral wrist splinting, nerve gliding exercises, ergonomic modification, and activity analysis. This is often effective for mild to moderate CTS." }
    ]
  },
  {
    slug: "dupuytrens-contracture",
    title: "Dupuytren's Contracture Management",
    category: "Hand Therapy",
    seoTitle: "Dupuytren's Contracture in OT — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy management of Dupuytren's contracture and post-operative rehabilitation.",
    seoKeywords: ["Dupuytren's contracture", "palmar fascia", "fasciectomy", "hand therapy", "OT"],
    overview: "Dupuytren's contracture management in OT addresses the progressive fibroproliferative disorder of the palmar fascia that causes flexion contracture of the fingers, most commonly the ring and small fingers. OTs provide post-operative rehabilitation (after fasciectomy, needle aponeurotomy, or collagenase injection) and splinting to maintain extension gains.",
    mechanismPhysiology: "Dupuytren's disease involves myofibroblast proliferation and collagen deposition in the palmar fascia, forming nodules and cords that progressively flex the MCP and PIP joints. The exact cause is unknown but has genetic, environmental, and metabolic associations.",
    clinicalRelevance: "OTs are the primary rehabilitation providers after Dupuytren's procedures. Extension splinting and scar management are critical for maintaining surgical gains. Without proper rehabilitation, contracture recurrence rates are high.",
    signsSymptoms: "Painless palmar nodules, progressive finger flexion contracture (usually ring and small fingers), difficulty with functional hand opening, tabletop test positive (unable to place hand flat on table).",
    assessment: "Goniometric MCP and PIP extension measurement, tabletop test, grip strength, functional hand use assessment, and scar assessment (post-operative).",
    management: "Post-operative: wound care, edema management, extension splinting (night and between exercises), scar management, ROM exercises (active and passive extension), and progressive strengthening. Extension splints are typically worn for 3-6 months post-procedure.",
    complications: "Contracture recurrence (30-70% depending on procedure), digital nerve injury, wound healing problems, PIP joint stiffness, and flare reaction (excessive inflammation).",
    clinicalPearls: [
      "Extension splinting must be worn for 3-6 months post-procedure — adherence is critical for maintaining gains.",
      "PIP joint contractures are harder to treat and have higher recurrence rates than MCP contractures.",
      "The tabletop test is positive when the patient cannot lay the hand flat on a table surface."
    ],
    examPitfalls: [
      "Not knowing that Dupuytren's primarily affects the ring and small fingers.",
      "Confusing Dupuytren's contracture (palmar fascia) with trigger finger (tendon sheath).",
      "Not emphasizing the importance of long-term extension splinting for maintaining surgical outcomes."
    ],
    faqJson: [
      { question: "What is Dupuytren's contracture?", answer: "Dupuytren's contracture is a progressive condition where the palmar fascia thickens and contracts, pulling the fingers (usually ring and small fingers) into a flexed position." },
      { question: "How long should extension splinting continue after surgery?", answer: "Extension splinting is typically recommended for 3-6 months post-procedure, initially full-time and gradually transitioning to night-time only." }
    ]
  },
  {
    slug: "trigger-finger",
    title: "Trigger Finger Management",
    category: "Hand Therapy",
    seoTitle: "Trigger Finger in OT — OT Encyclopedia",
    seoDescription: "Guide to trigger finger (stenosing tenosynovitis) management in occupational therapy.",
    seoKeywords: ["trigger finger", "stenosing tenosynovitis", "A1 pulley", "hand therapy", "OT"],
    overview: "Trigger finger (stenosing tenosynovitis) management in OT addresses the painful catching or locking of a finger during flexion. It occurs when the flexor tendon or A1 pulley becomes inflamed and thickened, preventing smooth tendon glide. OTs provide conservative management (splinting, exercises, activity modification) and post-injection or post-surgical rehabilitation.",
    mechanismPhysiology: "Trigger finger results from a size mismatch between the flexor tendon and the A1 pulley at the MCP joint. Inflammation causes tendon thickening or pulley narrowing, creating a mechanical block to smooth tendon glide. The tendon catches at the A1 pulley, causing clicking, catching, or locking in flexion.",
    clinicalRelevance: "Trigger finger is a common hand condition that OTs treat conservatively and post-surgically. Custom ring splints blocking MCP flexion can effectively treat mild to moderate trigger finger without surgery.",
    signsSymptoms: "Painful clicking or catching during finger flexion, finger locking in flexed position, tenderness at the A1 pulley (volar MCP), morning stiffness, and a palpable nodule on the flexor tendon.",
    assessment: "Clinical examination of triggering during active flexion/extension, palpation of the A1 pulley, severity grading (I-IV), ROM measurement, grip strength, and functional impact assessment.",
    management: "Conservative: A1 pulley ring splint (blocking MCP flexion), tendon gliding exercises, edema management, activity modification (avoiding repetitive gripping), and patient education. Post-injection: continuation of splinting and exercises. Post-surgical (A1 pulley release): wound care, scar management, ROM exercises, and progressive return to function.",
    complications: "Progression to locked finger requiring surgical release, persistent triggering after injection, bow-stringing after overly aggressive pulley release, and stiffness.",
    clinicalPearls: [
      "An A1 pulley ring splint blocking MCP flexion to 0° while allowing PIP and DIP motion is effective for mild-moderate trigger finger.",
      "Most common in the ring finger and thumb.",
      "Activity modification (reducing repetitive grip tasks) is an important component of conservative management."
    ],
    examPitfalls: [
      "Confusing trigger finger (tendon catching at A1 pulley) with Dupuytren's (palmar fascia contracture).",
      "Not knowing the location of the A1 pulley (at the MCP joint, volar side).",
      "Splinting the DIP or PIP instead of the MCP for trigger finger."
    ],
    faqJson: [
      { question: "What causes trigger finger?", answer: "Trigger finger is caused by inflammation and thickening of the flexor tendon or A1 pulley at the MCP joint, creating a mechanical block that causes the tendon to catch or lock during finger movement." },
      { question: "How does OT treat trigger finger?", answer: "OTs provide A1 pulley ring splints, tendon gliding exercises, activity modification, edema management, and post-surgical rehabilitation if conservative treatment fails." }
    ]
  },
  {
    slug: "complex-regional-pain-syndrome",
    title: "Complex Regional Pain Syndrome (CRPS)",
    category: "Hand Therapy",
    seoTitle: "Complex Regional Pain Syndrome in OT — OT Encyclopedia",
    seoDescription: "Guide to CRPS assessment and management in occupational therapy and hand therapy.",
    seoKeywords: ["CRPS", "complex regional pain syndrome", "reflex sympathetic dystrophy", "RSD", "hand therapy", "OT"],
    overview: "Complex Regional Pain Syndrome (CRPS) management in OT addresses this chronic pain condition characterized by disproportionate pain, sensory changes, autonomic dysfunction, and motor impairment, typically affecting an extremity after injury or surgery. OTs use desensitization, stress loading, graded motor imagery, mirror therapy, functional activity engagement, and edema management as core interventions.",
    mechanismPhysiology: "CRPS involves peripheral and central sensitization, autonomic dysfunction, and neuroinflammation. Type I (formerly reflex sympathetic dystrophy) occurs without confirmed nerve damage; Type II (formerly causalgia) occurs with confirmed nerve injury. The Budapest criteria are used for diagnosis.",
    clinicalRelevance: "Early recognition and intervention are critical — CRPS becomes increasingly difficult to treat as it progresses. OTs are essential for maintaining function, managing symptoms, and preventing disuse. A multidisciplinary approach combining OT, PT, psychology, and pain management produces the best outcomes.",
    signsSymptoms: "Burning pain disproportionate to injury, allodynia (pain from non-painful stimuli), edema, skin color and temperature changes, sweating changes, motor dysfunction (tremor, dystonia, weakness), and trophic changes (skin, nail, hair).",
    assessment: "Budapest criteria evaluation, pain assessment, edema measurement, skin temperature comparison (bilateral), ROM measurement, functional hand use assessment, and psychological screening.",
    management: "Stress loading program (scrubbing and carrying activities), desensitization (graded texture exposure), graded motor imagery (laterality recognition → imagined movement → mirror therapy), edema management, gentle active ROM, functional activity engagement, and psychological support.",
    complications: "Chronic pain syndrome, contracture, osteoporosis, psychological distress, opioid dependence, and functional disability.",
    clinicalPearls: [
      "Early intervention is critical — treatment within the first 6 months has the best prognosis.",
      "Stress loading (scrubbing and carrying) is a core OT intervention for CRPS — it provides active weight-bearing without requiring pain-free motion.",
      "Graded motor imagery follows a specific sequence: laterality recognition → imagined movement → mirror therapy."
    ],
    examPitfalls: [
      "Not recognizing the signs of CRPS early (disproportionate pain, autonomic changes).",
      "Applying aggressive ROM or stretching — this can worsen CRPS symptoms.",
      "Not knowing the graded motor imagery sequence."
    ],
    faqJson: [
      { question: "What is CRPS?", answer: "CRPS is a chronic pain condition characterized by disproportionate pain, autonomic dysfunction (color, temperature, sweating changes), edema, and motor impairment, typically affecting a limb after injury or surgery." },
      { question: "What is stress loading for CRPS?", answer: "Stress loading involves scrubbing (active compression through the extremity) and carrying (sustained weight-bearing), which provides joint compression and active movement without requiring pain-free ROM." }
    ]
  },
  {
    slug: "de-quervains-tenosynovitis",
    title: "De Quervain's Tenosynovitis",
    category: "Hand Therapy",
    seoTitle: "De Quervain's Tenosynovitis in OT — OT Encyclopedia",
    seoDescription: "Guide to de Quervain's tenosynovitis assessment and conservative management in occupational therapy.",
    seoKeywords: ["de Quervain's", "tenosynovitis", "first dorsal compartment", "thumb tendinitis", "hand therapy"],
    overview: "De Quervain's tenosynovitis management in OT addresses the painful condition affecting the first dorsal compartment tendons (abductor pollicis longus and extensor pollicis brevis) at the radial styloid. OTs provide conservative management including thumb spica splinting, activity modification, tendon gliding exercises, and ergonomic education. Also known as 'mommy thumb' due to its frequency in new parents.",
    mechanismPhysiology: "De Quervain's results from inflammation and thickening of the tendon sheath in the first dorsal compartment, causing pain with thumb and wrist movement, particularly grasping and ulnar deviation. Repetitive thumb use, hormonal changes (postpartum, menopause), and inflammatory conditions are risk factors.",
    clinicalRelevance: "De Quervain's is one of the most common tendinitis conditions treated in hand therapy. Conservative OT management is effective in many cases, potentially avoiding the need for corticosteroid injection or surgery.",
    signsSymptoms: "Pain and tenderness at the radial styloid, positive Finkelstein's test, pain with thumb movements (especially grasping and lifting), swelling over the first dorsal compartment, and difficulty with pinch and grip tasks.",
    assessment: "Finkelstein's test (ulnar deviation with thumb tucked in fist — reproduces pain), palpation of the first dorsal compartment, pain assessment, grip and pinch strength, and functional task evaluation.",
    management: "Thumb spica splint (including wrist and thumb MCP, leaving IP free), activity modification (avoid repetitive thumb movements), ice, tendon gliding exercises, gentle AROM as pain allows, ergonomic modification, and education on proper lifting and gripping techniques.",
    complications: "Chronic tendinitis if untreated, stenosing tenosynovitis, and intersection syndrome (related condition).",
    clinicalPearls: [
      "The Eichhoff test (clenching the fist over the thumb and ulnarly deviating) is often called Finkelstein's test — true Finkelstein's involves the examiner passively deviating the wrist with the thumb grasped.",
      "New parents are at high risk due to repetitive lifting and holding of infants.",
      "Activity modification — changing how the person lifts and grips — is as important as splinting."
    ],
    examPitfalls: [
      "Not knowing the Finkelstein's test or confusing it with other wrist tests.",
      "Not including the wrist in the thumb spica splint for de Quervain's.",
      "Focusing only on the thumb without addressing wrist position and ulnar deviation during activities."
    ],
    faqJson: [
      { question: "What is de Quervain's tenosynovitis?", answer: "De Quervain's is inflammation of the first dorsal compartment tendons (APL and EPB) at the radial styloid, causing pain with thumb and wrist movements." },
      { question: "What is the Finkelstein's test?", answer: "Finkelstein's test reproduces de Quervain's pain by passively stretching the first dorsal compartment tendons through ulnar deviation with the thumb in the fist or grasped by the examiner." }
    ]
  },
  // ===== ERGONOMICS & WORK REHABILITATION (5 entries) =====
  {
    slug: "ergonomic-assessment",
    title: "Ergonomic Assessment in OT",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Ergonomic Assessment in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to workplace ergonomic assessment and intervention in occupational therapy.",
    seoKeywords: ["ergonomic assessment", "workstation setup", "workplace injury prevention", "industrial OT", "ergonomics"],
    overview: "Ergonomic assessment in OT involves analyzing the interaction between workers and their work environment to optimize comfort, productivity, and injury prevention. OTs assess workstation setup, body mechanics, task demands, and environmental factors, then recommend modifications to reduce musculoskeletal injury risk and accommodate workers with disabilities.",
    mechanismPhysiology: "Musculoskeletal disorders (MSDs) result from cumulative biomechanical stress: sustained awkward postures, repetitive movements, excessive force, vibration, and compression. Ergonomic interventions modify these risk factors by fitting the workspace to the worker through adjustable equipment, tool selection, task rotation, and environmental design.",
    clinicalRelevance: "OTs bring unique skills to ergonomic assessment: activity analysis, person-environment-occupation fit evaluation, and adaptive strategy expertise. Workplace ergonomics is a growing practice area that reduces injury, workers' compensation costs, and absenteeism.",
    signsSymptoms: "Musculoskeletal complaints (back, neck, shoulder, wrist pain), repetitive strain injuries, worker fatigue, decreased productivity, and increased error rates.",
    assessment: "Workstation evaluation (desk height, monitor position, chair setup), body mechanics observation, task analysis, risk factor identification, environmental assessment (lighting, noise, temperature), and worker interview.",
    management: "Workstation adjustments (monitor at eye level, keyboard at elbow height, feet flat on floor), ergonomic equipment (adjustable chairs, keyboard trays, sit-stand desks), tool modification, micro-break programs, task rotation, stretching programs, and worker education.",
    complications: "Worker resistance to change, cost barriers for equipment, management buy-in challenges, and difficulty sustaining behavioral changes.",
    clinicalPearls: [
      "The 90-90-90 rule: hips, knees, and elbows at approximately 90° for neutral seated posture.",
      "Monitor placement: top of screen at or slightly below eye level, arm's length away.",
      "Micro-breaks (30 seconds every 30 minutes) are more effective than longer, less frequent breaks."
    ],
    examPitfalls: [
      "Not knowing the basic ergonomic workstation setup guidelines.",
      "Focusing only on equipment without addressing work habits and task organization.",
      "Ignoring psychosocial factors (job satisfaction, stress) that contribute to musculoskeletal complaints."
    ],
    faqJson: [
      { question: "What does an OT ergonomic assessment include?", answer: "An OT ergonomic assessment evaluates workstation setup, body mechanics, task demands, environmental factors, and individual worker characteristics to recommend modifications that reduce injury risk." },
      { question: "What is the most important workstation adjustment?", answer: "Chair height and monitor position are the most critical adjustments: the chair should allow feet flat on the floor with hips/knees at 90°, and the monitor should be at eye level and arm's length away." }
    ]
  },
  {
    slug: "functional-capacity-evaluation",
    title: "Functional Capacity Evaluation (FCE)",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Functional Capacity Evaluation in OT — OT Encyclopedia",
    seoDescription: "Guide to functional capacity evaluation administration and interpretation in occupational therapy.",
    seoKeywords: ["FCE", "functional capacity evaluation", "work capacity", "return to work", "OT"],
    overview: "A Functional Capacity Evaluation (FCE) is a comprehensive assessment of a person's physical abilities in relation to work demands. OTs administer standardized FCE protocols that measure lifting, carrying, pushing, pulling, standing, walking, sitting, reaching, gripping, and other functional capacities. FCE results are used for return-to-work planning, disability determination, and job matching.",
    mechanismPhysiology: "FCEs measure the maximum safe functional abilities of the individual through a series of standardized physical tasks. Performance is compared to job demands using the Department of Labor physical demand classifications (sedentary, light, medium, heavy, very heavy).",
    clinicalRelevance: "FCEs are a specialized OT service used in workers' compensation, disability, and return-to-work contexts. They provide objective data about functional capacity that supports clinical decision-making, workplace accommodation, and legal proceedings.",
    signsSymptoms: "Requested when there is uncertainty about a worker's ability to safely perform job demands, typically after injury, illness, or prolonged absence from work.",
    assessment: "Standardized FCE protocols (Matheson, Blankenship, ERGOS, Key) measuring: lifting floor-to-waist, waist-to-shoulder, above shoulder; carrying; pushing/pulling; standing/walking tolerance; sitting tolerance; bending/stooping; hand function (grip, pinch); and sustained/repetitive activity tolerance.",
    management: "Results guide return-to-work planning, job modification recommendations, transitional duty assignments, accommodations under ADA/AODA, and further rehabilitation planning.",
    complications: "Symptom magnification or submaximal effort (monitored through consistency checks), injury risk during testing, and misinterpretation of results without proper training.",
    clinicalPearls: [
      "FCEs must include consistency/validity measures to ensure the results reflect genuine capacity.",
      "Results should be compared to specific job demands, not generic physical demand levels.",
      "FCEs are typically 4-8 hours over 1-2 days to assess sustained performance, not just peak capacity."
    ],
    examPitfalls: [
      "Not knowing the DOL physical demand classifications (sedentary: 10 lbs max; light: 20 lbs max; medium: 50 lbs max; heavy: 100 lbs max; very heavy: >100 lbs).",
      "Confusing FCE with impairment evaluation — FCE measures function, not impairment.",
      "Not understanding the importance of consistency checks for validity."
    ],
    faqJson: [
      { question: "What is a Functional Capacity Evaluation?", answer: "An FCE is a comprehensive assessment of a person's physical abilities through standardized tasks (lifting, carrying, standing, etc.) to determine safe work capacity and guide return-to-work planning." },
      { question: "How long does an FCE take?", answer: "A comprehensive FCE typically takes 4-8 hours over 1-2 days to assess sustained functional performance across multiple physical demand categories." }
    ]
  },
  {
    slug: "work-hardening-conditioning",
    title: "Work Hardening & Work Conditioning",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Work Hardening and Work Conditioning in OT — OT Encyclopedia",
    seoDescription: "Guide to work hardening and work conditioning programs in occupational therapy.",
    seoKeywords: ["work hardening", "work conditioning", "return to work", "vocational rehabilitation", "OT"],
    overview: "Work hardening and work conditioning are structured rehabilitation programs designed to return injured workers to their pre-injury jobs. Work conditioning focuses on physical reconditioning (strength, endurance, flexibility). Work hardening is a comprehensive, interdisciplinary program that includes work conditioning plus simulated work tasks, behavioral management, vocational counseling, and psychosocial support. OTs play a central role in both programs.",
    mechanismPhysiology: "Injured workers develop deconditioning, fear-avoidance behaviors, and functional limitations during recovery. Work hardening/conditioning uses graded exposure to work-related tasks and physical demands to restore work tolerance, build confidence, and address psychosocial barriers to return to work.",
    clinicalRelevance: "OTs are uniquely qualified for work rehabilitation because they analyze task demands, modify activities, address psychosocial factors, and design graded return-to-work programs. Activity analysis and task modification are core OT skills applied in the work context.",
    signsSymptoms: "Inability to meet physical demands of the job, prolonged absence from work, deconditioning, fear of re-injury, and psychosocial barriers to return to work.",
    assessment: "FCE results, job demands analysis, worker interview, physical capacity assessment, psychosocial screening, and identification of workplace barriers.",
    management: "Work conditioning: progressive physical reconditioning matched to job demands (4-8 weeks, typically half-day sessions). Work hardening: comprehensive interdisciplinary program including simulated work tasks, physical conditioning, behavioral management, and vocational services (4-8 weeks, typically full-day sessions).",
    complications: "Lack of employer support, unresolved litigation issues, secondary gain issues, and persistent fear-avoidance behaviors.",
    clinicalPearls: [
      "Work hardening is interdisciplinary and includes simulated work tasks; work conditioning is primarily physical reconditioning.",
      "Successful return to work requires addressing both physical AND psychosocial barriers.",
      "Transitional duty (modified work) can bridge the gap between rehabilitation and full duty."
    ],
    examPitfalls: [
      "Confusing work hardening (comprehensive, interdisciplinary) with work conditioning (physical reconditioning only).",
      "Not recognizing the importance of psychosocial factors in return-to-work outcomes.",
      "Ignoring job-specific demands when designing the program."
    ],
    faqJson: [
      { question: "What is the difference between work hardening and work conditioning?", answer: "Work conditioning focuses on physical reconditioning (strength, endurance, flexibility). Work hardening is a comprehensive, interdisciplinary program that also includes simulated work tasks, behavioral management, and vocational counseling." },
      { question: "How long do work hardening programs last?", answer: "Work hardening programs typically last 4-8 weeks with full-day sessions (6-8 hours), while work conditioning programs are typically half-day sessions for 4-8 weeks." }
    ]
  },
  {
    slug: "job-demands-analysis",
    title: "Job Demands Analysis (JDA)",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Job Demands Analysis in OT — OT Encyclopedia",
    seoDescription: "Guide to job demands analysis in occupational therapy for return-to-work and workplace accommodation.",
    seoKeywords: ["job demands analysis", "JDA", "physical demands", "job analysis", "workplace accommodation", "OT"],
    overview: "Job Demands Analysis (JDA) is a systematic assessment of the physical, cognitive, and environmental demands of a specific job. OTs conduct JDAs to compare a worker's functional abilities to job requirements, design workplace accommodations, support return-to-work planning, and establish essential job functions. The JDA documents specific task demands using the DOL physical demand classification system.",
    mechanismPhysiology: "JDA quantifies the essential and marginal functions of a job by documenting the frequency, duration, and intensity of physical demands (lifting, carrying, pushing, pulling, reaching, bending, standing), cognitive demands (attention, memory, problem-solving), and environmental factors (temperature, noise, hazards).",
    clinicalRelevance: "OTs' expertise in activity analysis makes them uniquely qualified to conduct JDAs. The JDA is essential for matching worker capacity to job demands, designing accommodations, and supporting disability and workers' compensation decisions.",
    signsSymptoms: "Requested when a worker has a disability or injury requiring workplace accommodation, when return-to-work decisions need objective job demand data, or when workplace injury prevention is needed.",
    assessment: "On-site job observation, worker interview, supervisor interview, measurement of force requirements, documentation of postures and movements, environmental assessment, and comparison to DOL physical demand classifications.",
    management: "JDA report documents essential and marginal job functions, specific physical demands by frequency and duration, cognitive requirements, environmental conditions, and recommendations for modification or accommodation.",
    complications: "Incomplete job observation, bias from worker or employer perspectives, variability in day-to-day job demands, and difficulty quantifying cognitive demands.",
    clinicalPearls: [
      "Always observe the job being performed — paper-based job descriptions may not reflect actual demands.",
      "Document demands using the DOL frequency categories: occasionally (<33%), frequently (34-66%), constantly (67-100%).",
      "Distinguish essential functions (required for the job) from marginal functions (incidental tasks) for ADA/AODA compliance."
    ],
    examPitfalls: [
      "Relying solely on job descriptions without on-site observation.",
      "Not knowing DOL physical demand classifications and frequency categories.",
      "Confusing essential functions (must perform) with marginal functions (nice to perform)."
    ],
    faqJson: [
      { question: "What is a Job Demands Analysis?", answer: "A JDA is a systematic assessment of the physical, cognitive, and environmental demands of a specific job, conducted by an OT to support return-to-work planning, accommodation design, and disability determination." },
      { question: "Why do OTs conduct JDAs?", answer: "OTs' expertise in activity analysis makes them uniquely qualified to quantify job demands, design workplace accommodations, and match worker abilities to job requirements." }
    ]
  },
  {
    slug: "cumulative-trauma-disorders",
    title: "Cumulative Trauma Disorders",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Cumulative Trauma Disorders in OT — OT Encyclopedia",
    seoDescription: "Guide to prevention and management of cumulative trauma disorders (repetitive strain injuries) in OT.",
    seoKeywords: ["cumulative trauma", "repetitive strain injury", "RSI", "work injury", "ergonomics", "OT"],
    overview: "Cumulative Trauma Disorders (CTDs), also known as Repetitive Strain Injuries (RSIs) or Work-Related Musculoskeletal Disorders (WMSDs), encompass a group of conditions caused by repetitive movement, sustained postures, excessive force, and vibration. Common CTDs include carpal tunnel syndrome, lateral epicondylitis, de Quervain's, rotator cuff tendinitis, and low back pain. OTs address prevention through ergonomic assessment and management through conservative treatment.",
    mechanismPhysiology: "CTDs result from chronic microtrauma to muscles, tendons, nerves, and joints. The dose-response relationship involves frequency, force, duration, and posture. Tissue damage accumulates when repair capacity is exceeded by repetitive stress, leading to inflammation, fibrosis, and functional impairment.",
    clinicalRelevance: "CTDs are the most common category of occupational disease and a major cause of disability and lost work time. OTs are uniquely positioned to address both prevention (ergonomic intervention) and treatment (conservative management and rehabilitation).",
    signsSymptoms: "Pain with repetitive activities, numbness and tingling, weakness, stiffness, swelling, and decreased work tolerance. Symptoms typically worsen with activity and improve with rest in early stages.",
    assessment: "Ergonomic risk factor analysis, physical examination, symptom pattern documentation, work task observation, and identification of modifiable risk factors.",
    management: "Ergonomic modifications (workstation adjustment, tool redesign, task rotation), work practice changes (micro-breaks, proper body mechanics), conservative treatment (splinting, exercises, activity modification), return-to-work programs, and prevention education.",
    complications: "Chronic pain, disability, work loss, surgery, and psychological impacts (depression, anxiety, fear of re-injury).",
    clinicalPearls: [
      "Prevention is more effective and less costly than treatment — ergonomic intervention should be proactive.",
      "The 'multi-factorial' nature of CTDs means no single factor is usually responsible — address all risk factors.",
      "Task rotation and job enrichment reduce repetitive exposure and are more sustainable than rest breaks alone."
    ],
    examPitfalls: [
      "Focusing only on the specific body part without addressing workplace risk factors.",
      "Not recognizing psychosocial factors (job dissatisfaction, perceived low control) as risk factors for CTDs.",
      "Treating the condition without modifying the causative work activities."
    ],
    faqJson: [
      { question: "What are cumulative trauma disorders?", answer: "CTDs are musculoskeletal conditions caused by repetitive movement, sustained postures, excessive force, or vibration, including carpal tunnel syndrome, tendinitis, and epicondylitis." },
      { question: "How do OTs prevent CTDs?", answer: "OTs prevent CTDs through ergonomic assessment and workstation modification, work practice education, micro-break programs, task rotation recommendations, and identification of risk factors before injury occurs." }
    ]
  },
  // ===== ACTIVITIES OF DAILY LIVING (5 entries) =====
  {
    slug: "dressing-techniques-ot",
    title: "Dressing Techniques in OT",
    category: "Activities of Daily Living",
    seoTitle: "Dressing Techniques in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to adaptive dressing techniques and strategies for individuals with various disabilities.",
    seoKeywords: ["dressing techniques", "one-handed dressing", "adaptive dressing", "ADL training", "OT"],
    overview: "Dressing intervention in OT addresses the complex self-care task of independently putting on and removing clothing. OTs teach compensatory techniques for individuals with hemiplegia, limited ROM, weakness, incoordination, cognitive impairments, and other conditions. Key principles include dressing the affected side first and undressing the unaffected side first, using adaptive equipment, and selecting accessible clothing.",
    mechanismPhysiology: "Dressing requires bilateral coordination, fine motor dexterity, balance, ROM, cognitive sequencing, and body awareness. Disability affecting any of these components requires adaptive strategies, equipment, or clothing modifications to maintain independence.",
    clinicalRelevance: "Dressing is one of the most commonly addressed ADLs in OT. Independence in dressing significantly impacts self-esteem, dignity, and discharge disposition. Teaching effective dressing techniques can determine whether a patient returns home or requires a higher level of care.",
    signsSymptoms: "Inability to don/doff shirts, pants, socks, shoes, or undergarments independently; difficulty with fasteners (buttons, zippers, snaps); and safety concerns during dressing (balance, falls).",
    assessment: "Observation of dressing performance, identification of specific barriers (ROM, strength, coordination, cognition), equipment needs assessment, and comparison to pre-injury dressing routine.",
    management: "Hemiplegic techniques: dress affected arm/leg first, undress unaffected first. Adaptive equipment: button hook, zipper pull, elastic shoelaces, sock aid, dressing stick, long-handled shoehorn. Clothing modifications: front-opening garments, Velcro closures, loose-fitting clothing, elastic waistbands. Seated dressing for balance concerns.",
    complications: "Falls during standing dressing, frustration leading to learned helplessness, skin injuries from aggressive dressing with impaired sensation, and caregiver over-assistance preventing independence.",
    clinicalPearls: [
      "The golden rule: affected side ON first, OFF last (to minimize movement of the affected extremity).",
      "Seated dressing is safer and requires less energy than standing dressing.",
      "Choose front-opening garments and elastic waistbands for clients with limited overhead reach."
    ],
    examPitfalls: [
      "Not knowing the hemiplegic dressing rule: affected arm/leg first when dressing, unaffected first when undressing.",
      "Forgetting hip precautions during lower body dressing after hip replacement.",
      "Not assessing the need for seated dressing for safety."
    ],
    faqJson: [
      { question: "What is the hemiplegic dressing technique?", answer: "When dressing: put the affected arm/leg into clothing first. When undressing: remove the unaffected arm/leg first. This minimizes movement and stress on the affected side." },
      { question: "What adaptive equipment helps with dressing?", answer: "Common dressing aids include button hooks, zipper pulls, elastic shoelaces, sock aids, dressing sticks, long-handled shoehorns, and reacher tools." }
    ]
  },
  {
    slug: "bathing-and-showering-ot",
    title: "Bathing & Showering Techniques in OT",
    category: "Activities of Daily Living",
    seoTitle: "Bathing and Showering Techniques in OT — OT Encyclopedia",
    seoDescription: "Guide to adaptive bathing techniques, equipment, and safety strategies in occupational therapy.",
    seoKeywords: ["bathing adaptation", "shower safety", "tub transfer bench", "bathing equipment", "ADL", "OT"],
    overview: "Bathing and showering intervention in OT addresses one of the most challenging and dangerous self-care activities for individuals with disabilities. OTs assess safety, recommend adaptive equipment, modify the bathroom environment, and teach compensatory techniques. Bathing is a leading cause of bathroom falls, making OT intervention critical for safety and independence.",
    mechanismPhysiology: "Bathing requires balance, strength, flexibility, coordination, sensation (water temperature), and cognitive sequencing in a hazardous wet environment. The combination of slippery surfaces, need for undressing, and exposure to temperature extremes makes bathing one of the highest-risk ADLs.",
    clinicalRelevance: "Bathing is often the last ADL skill regained and the first lost with functional decline. Achieving safe, independent bathing is frequently a key determinant of discharge disposition and level of care needed.",
    signsSymptoms: "Difficulty transferring in/out of tub or shower, balance concerns on wet surfaces, difficulty reaching body parts for washing, inability to manage water temperature, and falls during bathing.",
    assessment: "Bathroom safety evaluation, transfer assessment, balance during bathing tasks, reaching ability, skin sensation (temperature), cognitive ability to manage bathing sequence, and equipment needs assessment.",
    management: "Equipment: tub transfer bench, shower chair, handheld shower head, grab bars, non-slip mats, long-handled sponge, soap-on-a-rope, and temperature-regulating faucets. Techniques: seated bathing for safety, systematic washing sequence, energy conservation during bathing, and tub transfer techniques.",
    complications: "Falls and fractures, scalding from impaired temperature sensation, hypothermia from prolonged bathing, skin breakdown, and privacy/dignity concerns.",
    clinicalPearls: [
      "A tub transfer bench is often the single most important piece of bathing equipment for safety.",
      "Handheld shower heads improve safety by allowing seated bathing and controlled water direction.",
      "Always assess water temperature sensation — impaired sensation requires temperature-regulating valves."
    ],
    examPitfalls: [
      "Not recognizing bathing as the highest-risk ADL for falls in older adults.",
      "Recommending grab bars without specifying proper placement (horizontal for pushing up, vertical for pulling, angled for transitions).",
      "Forgetting to assess temperature sensation for scald risk."
    ],
    faqJson: [
      { question: "What is the safest bathing equipment for older adults?", answer: "A tub transfer bench with a handheld shower head, combined with grab bars and non-slip mats, provides the safest setup for individuals with balance or mobility concerns." },
      { question: "How do OTs make bathing safer?", answer: "OTs assess the bathroom environment, recommend equipment (transfer bench, grab bars, shower chair), teach safe transfer techniques, and address temperature sensation and balance concerns." }
    ]
  },
  {
    slug: "feeding-and-eating-ot",
    title: "Feeding & Eating Techniques in OT",
    category: "Activities of Daily Living",
    seoTitle: "Feeding and Eating Techniques in OT — OT Encyclopedia",
    seoDescription: "Guide to feeding and eating intervention for adults in occupational therapy.",
    seoKeywords: ["feeding adaptation", "adaptive utensils", "dysphagia", "self-feeding", "ADL", "OT"],
    overview: "Feeding and eating intervention in OT addresses the ability to bring food from a plate to the mouth and manage the oral phase of eating. OTs assess and treat difficulties related to upper extremity function (reaching, grasping, bringing to mouth), positioning, adaptive equipment needs, and oral motor function. This is distinct from swallowing (dysphagia), which is primarily managed by SLPs.",
    mechanismPhysiology: "Self-feeding requires adequate sitting posture, upper extremity ROM and strength (shoulder, elbow, wrist, hand), grasp and manipulation, hand-to-mouth coordination, and oral motor skills. The typical feeding trajectory progresses from dependent to modified independent to independent using appropriate equipment and techniques.",
    clinicalRelevance: "Self-feeding is a fundamental ADL that impacts nutrition, social participation, dignity, and quality of life. OTs maximize feeding independence through positioning, adaptive equipment, task modification, and upper extremity rehabilitation.",
    signsSymptoms: "Difficulty gripping utensils, inability to bring food to mouth, food spilling, prolonged mealtimes, reliance on others for feeding, and decreased oral intake related to self-feeding difficulty.",
    assessment: "Upper extremity ROM and strength for feeding tasks, grasp and manipulation assessment, sitting posture and trunk control, oral motor observation, utensil use evaluation, and mealtime observation.",
    management: "Positioning (upright, head midline, feet supported), adaptive utensils (built-up handles, weighted utensils for tremor, angled utensils, rocker knife, universal cuff), plate guards, non-slip mats, adapted cups (nosey cup, two-handled cup), and upper extremity rehabilitation targeting feeding-specific movements.",
    complications: "Aspiration risk if oral motor function is impaired, malnutrition from inadequate intake, social isolation from difficulty eating in social settings, and caregiver dependence.",
    clinicalPearls: [
      "Position the patient upright (90° seated) with feet supported for safe and efficient eating.",
      "Weighted utensils reduce tremor impact; built-up handles compensate for weak grip.",
      "A nosey (cutout) cup eliminates the need for neck extension when drinking, reducing aspiration risk."
    ],
    examPitfalls: [
      "Confusing feeding (self-feeding process — OT scope) with swallowing (deglutition — SLP scope).",
      "Not positioning the patient properly before addressing utensil use.",
      "Using a universal cuff when built-up handles would be sufficient (over-adaptation)."
    ],
    faqJson: [
      { question: "What is the difference between feeding and swallowing?", answer: "Feeding refers to the process of self-feeding (getting food to the mouth) — addressed by OTs. Swallowing (deglutition) refers to the oral and pharyngeal management of food — primarily addressed by SLPs." },
      { question: "What adaptive equipment helps with self-feeding?", answer: "Common feeding aids include built-up handles, weighted utensils (for tremor), angled utensils, universal cuffs (for no grip), plate guards, non-slip mats, and nosey cups." }
    ]
  },
  {
    slug: "instrumental-adl-management",
    title: "Instrumental Activities of Daily Living (IADLs)",
    category: "Activities of Daily Living",
    seoTitle: "Instrumental Activities of Daily Living in OT — OT Encyclopedia",
    seoDescription: "Guide to IADL assessment and intervention in occupational therapy for complex daily tasks.",
    seoKeywords: ["IADL", "instrumental ADL", "community living skills", "meal preparation", "money management", "OT"],
    overview: "Instrumental Activities of Daily Living (IADLs) are complex, higher-level daily tasks required for independent community living, including meal preparation, home management, financial management, medication management, shopping, transportation, communication device use, and community mobility. OTs assess and train IADLs as part of community reintegration and independent living programs.",
    mechanismPhysiology: "IADLs require higher-level cognitive function (executive function, planning, sequencing, problem-solving) in addition to the physical skills needed for basic ADLs. They represent a critical bridge between hospital/rehabilitation independence and community independence.",
    clinicalRelevance: "IADL assessment is essential for discharge planning and determining the level of support needed for community living. Clients who are independent in basic ADLs may still require significant assistance with IADLs, affecting their ability to live alone safely.",
    signsSymptoms: "Difficulty managing medications, preparing meals, handling finances, using transportation, maintaining the home, or managing communication technology.",
    assessment: "KELS, PASS, Lawton IADL Scale, kitchen task observation, medication management assessment, financial task performance, and community mobility evaluation.",
    management: "Task analysis and simplification, compensatory strategy training, adaptive equipment and technology, environmental modification, caregiver training, community resource identification, and progressive independence training.",
    complications: "Safety risks (cooking fires, medication errors), financial exploitation, social isolation from transportation limitations, and nutritional deficiency from meal preparation difficulty.",
    clinicalPearls: [
      "IADL independence predicts community living success more accurately than basic ADL independence.",
      "Medication management is one of the highest-risk IADLs — always assess cognition, vision, and dexterity for this task.",
      "Technology (smartphones, smart home devices) increasingly supports IADL independence."
    ],
    examPitfalls: [
      "Confusing basic ADLs (self-care) with IADLs (community living skills).",
      "Not assessing IADLs when a patient is independent in basic ADLs — IADLs may still be impaired.",
      "Forgetting that IADLs require higher cognitive function than basic ADLs."
    ],
    faqJson: [
      { question: "What are IADLs?", answer: "IADLs are complex daily tasks required for independent community living, including meal preparation, medication management, financial management, shopping, transportation, home management, and communication." },
      { question: "Why are IADLs important for discharge planning?", answer: "IADL capacity determines whether a person can safely live independently in the community. A person independent in basic ADLs but unable to manage IADLs may need supervised or assisted living." }
    ]
  },
  {
    slug: "one-handed-techniques",
    title: "One-Handed Techniques",
    category: "Activities of Daily Living",
    seoTitle: "One-Handed Techniques in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to one-handed techniques and equipment for daily activities after stroke or upper extremity loss.",
    seoKeywords: ["one-handed techniques", "hemiplegia", "unilateral", "adaptive techniques", "stroke", "OT"],
    overview: "One-handed techniques in OT are compensatory strategies that enable individuals with hemiplegia, upper extremity amputation, or temporary limb immobilization to perform daily activities using only one hand. OTs teach specific techniques for dressing, grooming, cooking, writing, and other tasks, supplemented by adaptive equipment designed for one-handed use.",
    mechanismPhysiology: "One-handed performance compensates for the loss of bilateral hand function by using alternative techniques, body stabilization, and environmental modifications. Success depends on the person's ability to use the remaining hand effectively, along with trunk and postural control for stabilization.",
    clinicalRelevance: "One-handed techniques are among the most commonly taught compensatory strategies in OT, particularly for stroke survivors. Mastery of these techniques directly impacts independence, safety, and quality of life.",
    signsSymptoms: "Inability to use one hand due to hemiplegia, amputation, fracture, or other conditions affecting bilateral hand function.",
    assessment: "Dominant hand function assessment, one-handed task performance observation, identification of specific task barriers, and equipment needs evaluation.",
    management: "Dressing: hemiplegic dressing techniques, button hooks, elastic laces. Grooming: suction-cup brush, wall-mounted nail brush, electric razor. Cooking: one-handed cutting board, jar openers, rocker knife, non-slip mats. Writing: dominant hand retraining if non-dominant hand, weighted pen. General: dycem mats for stabilization, suction-cup devices.",
    complications: "Overuse injury of the unaffected hand, frustration and decreased motivation, safety risks during one-handed cooking, and difficulty accepting compensatory techniques when return of function is expected.",
    clinicalPearls: [
      "Dycem (non-slip) mats are the most versatile one-handed aid — stabilize plates, cutting boards, and other items.",
      "A one-handed cutting board (with nails for food stabilization and corner guards for bread) enables independent meal preparation.",
      "If the dominant hand is affected, hand dominance retraining for writing and fine motor tasks is important."
    ],
    examPitfalls: [
      "Teaching compensatory techniques too early when recovery of the affected hand is expected.",
      "Not addressing dominant hand loss when the affected hand is the dominant hand.",
      "Forgetting safety training for one-handed cooking and kitchen activities."
    ],
    faqJson: [
      { question: "What are one-handed techniques?", answer: "One-handed techniques are compensatory strategies and adaptive equipment that enable individuals with use of only one hand to independently perform daily activities like dressing, cooking, grooming, and writing." },
      { question: "What is the most useful one-handed aid?", answer: "Dycem (non-slip) mats are considered the most versatile one-handed aid, as they stabilize items on surfaces, enabling one-handed manipulation of plates, cutting boards, and other objects." }
    ]
  },
  // ===== ETHICS & PROFESSIONAL PRACTICE (5 entries) =====
  {
    slug: "ot-code-of-ethics",
    title: "OT Code of Ethics",
    category: "Ethics & Professional Practice",
    seoTitle: "OT Code of Ethics — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy ethical principles, standards, and professional conduct.",
    seoKeywords: ["OT ethics", "code of ethics", "professional conduct", "AOTA ethics", "CAOT ethics"],
    overview: "The OT Code of Ethics provides the ethical framework guiding professional conduct in occupational therapy. Key principles include beneficence (doing good), nonmaleficence (avoiding harm), autonomy (respecting client self-determination), justice (fair and equitable treatment), veracity (truthfulness), and fidelity (maintaining trust). OTs are bound by their national association's code of ethics and their regulatory body's standards of practice.",
    mechanismPhysiology: "Ethical principles are derived from moral philosophy and professional values. They provide a framework for resolving ethical dilemmas that arise in clinical practice, research, and professional relationships. The principles interact and sometimes conflict, requiring ethical reasoning to resolve dilemmas.",
    clinicalRelevance: "Ethical practice is foundational to the OT profession. Understanding and applying ethical principles is essential for clinical decision-making, maintaining professional boundaries, informed consent, confidentiality, documentation, and advocacy.",
    signsSymptoms: "Ethical dilemmas arise when principles conflict, such as when client autonomy conflicts with beneficence (e.g., a client refuses a safety intervention), or when justice conflicts with individual needs (e.g., resource allocation).",
    assessment: "Ethical dilemma identification, stakeholder analysis, principle identification, options generation, and consequence evaluation using ethical decision-making frameworks.",
    management: "Systematic ethical reasoning: identify the dilemma, gather relevant information, identify ethical principles at stake, consider stakeholder perspectives, generate options, evaluate consequences, make a decision, implement and evaluate. Consult ethics committees and colleagues when facing complex dilemmas.",
    complications: "Ethical distress (knowing the right action but being unable to take it due to institutional barriers), moral residue (lingering feelings from past ethical compromises), and boundary violations.",
    clinicalPearls: [
      "Know the six core ethical principles: Beneficence, Nonmaleficence, Autonomy, Justice, Veracity, Fidelity.",
      "Client autonomy generally takes precedence — competent adults have the right to refuse treatment.",
      "Document ethical dilemmas, reasoning, and decisions as part of the medical record."
    ],
    examPitfalls: [
      "Not knowing the core ethical principles and their definitions.",
      "Prioritizing beneficence over autonomy when the client is competent to make decisions.",
      "Confusing ethical principles with legal requirements — they may differ."
    ],
    faqJson: [
      { question: "What are the core ethical principles in OT?", answer: "Beneficence (do good), Nonmaleficence (avoid harm), Autonomy (respect self-determination), Justice (fair treatment), Veracity (truthfulness), and Fidelity (maintain trust and loyalty)." },
      { question: "How should OTs resolve ethical dilemmas?", answer: "Through systematic ethical reasoning: identify the dilemma, gather facts, identify principles at stake, consider stakeholder perspectives, generate options, evaluate consequences, and make a reasoned decision." }
    ]
  },
  {
    slug: "evidence-based-practice-ot",
    title: "Evidence-Based Practice in OT",
    category: "Ethics & Professional Practice",
    seoTitle: "Evidence-Based Practice in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to applying evidence-based practice principles in occupational therapy.",
    seoKeywords: ["evidence-based practice", "EBP", "research evidence", "clinical reasoning", "OT"],
    overview: "Evidence-Based Practice (EBP) in OT integrates three components: best available research evidence, clinical expertise, and client values and preferences. OTs use EBP to select interventions, justify services, and improve outcomes. The EBP process involves asking clinical questions (PICO format), searching for evidence, appraising evidence quality, applying findings, and evaluating outcomes.",
    mechanismPhysiology: "EBP follows a hierarchy of evidence from strongest (systematic reviews and RCTs) to weakest (expert opinion). Levels of evidence guide confidence in research findings: Level I (systematic reviews, RCTs), Level II (cohort studies), Level III (case-control studies), Level IV (case series), Level V (expert opinion).",
    clinicalRelevance: "EBP is a professional and ethical obligation. OTs must base practice on the best available evidence while integrating clinical expertise and client preferences. This ensures quality care, justifies services to payers, and advances the profession.",
    signsSymptoms: "Clinical questions about intervention effectiveness, assessment validity, and best practice approaches for specific client populations.",
    assessment: "Formulate PICO questions (Population, Intervention, Comparison, Outcome), search evidence databases (PubMed, CINAHL, OTseeker, Cochrane), critically appraise evidence quality, and synthesize findings.",
    management: "Apply evidence to clinical decisions, integrate with clinical expertise and client values, implement evidence-based interventions, measure outcomes, and contribute to evidence generation through outcomes documentation and research participation.",
    complications: "Gap between evidence and practice, lack of high-quality evidence for some OT interventions, difficulty accessing research, and time constraints for evidence review.",
    clinicalPearls: [
      "PICO format: Population (who), Intervention (what), Comparison (vs. what), Outcome (desired result).",
      "Use OTseeker (OT-specific evidence database) for efficient evidence searching.",
      "Absence of evidence is not evidence of absence — some effective interventions lack research support."
    ],
    examPitfalls: [
      "Not knowing the hierarchy of evidence (systematic reviews > RCTs > cohort > case-control > case series > expert opinion).",
      "Confusing the PICO format components.",
      "Applying research findings without considering clinical expertise and client values."
    ],
    faqJson: [
      { question: "What is evidence-based practice?", answer: "EBP integrates three components: the best available research evidence, the clinician's clinical expertise, and the client's values and preferences to guide clinical decision-making." },
      { question: "What is the PICO format?", answer: "PICO is a framework for formulating clinical questions: Population (who is the client), Intervention (what treatment), Comparison (compared to what), and Outcome (what is the desired result)." }
    ]
  },
  {
    slug: "informed-consent-ot",
    title: "Informed Consent in OT",
    category: "Ethics & Professional Practice",
    seoTitle: "Informed Consent in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to informed consent principles and practice in occupational therapy.",
    seoKeywords: ["informed consent", "client rights", "autonomy", "capacity", "OT ethics"],
    overview: "Informed consent in OT is the process by which clients receive adequate information about proposed assessment and intervention to make autonomous decisions about their care. It requires three elements: disclosure (providing information), capacity (ability to understand and decide), and voluntariness (freedom from coercion). Informed consent is both an ethical obligation (respecting autonomy) and a legal requirement.",
    mechanismPhysiology: "Informed consent is grounded in the ethical principle of autonomy — the right of competent individuals to make decisions about their own care. It requires the therapist to communicate clearly about the nature, purpose, risks, benefits, and alternatives of proposed interventions.",
    clinicalRelevance: "OTs must obtain informed consent before assessment and intervention, document the consent process, reassess consent as treatment plans change, and address capacity concerns when they arise. Informed consent is particularly complex in pediatric, geriatric, and mental health settings.",
    signsSymptoms: "Situations requiring careful consent consideration include: clients with cognitive impairment, minors, individuals under substitute decision-makers, research participation, use of physical modalities, and changes in treatment plans.",
    assessment: "Assess the client's understanding of the proposed intervention, ability to weigh risks and benefits, and freedom to accept or refuse without coercion.",
    management: "Disclosure of assessment/intervention procedures, expected outcomes, risks and benefits, alternatives (including no treatment), and the right to refuse or withdraw. Use plain language, check for understanding, document the consent process, and reassess as treatment plans evolve.",
    complications: "Capacity challenges (dementia, psychiatric conditions, TBI), language barriers, power dynamics between therapist and client, and cultural differences in decision-making (individual vs. family/community-based).",
    clinicalPearls: [
      "Consent is an ongoing process, not a one-time event — reassess as treatment changes.",
      "The three elements: disclosure (information given), capacity (ability to decide), and voluntariness (free choice).",
      "If a client lacks capacity, work with the legally authorized substitute decision-maker."
    ],
    examPitfalls: [
      "Not knowing the three elements of informed consent (disclosure, capacity, voluntariness).",
      "Confusing informed consent with simply getting a signature on a form.",
      "Assuming a diagnosis (e.g., dementia) automatically means lack of capacity — capacity is decision-specific."
    ],
    faqJson: [
      { question: "What are the three elements of informed consent?", answer: "Disclosure (providing adequate information about the intervention), Capacity (the client's ability to understand and make a decision), and Voluntariness (freedom to accept or refuse without coercion)." },
      { question: "Does a dementia diagnosis mean a person cannot consent?", answer: "No, capacity is decision-specific. A person with mild dementia may have capacity for some decisions but not others. Capacity must be assessed for each specific decision." }
    ]
  },
  {
    slug: "documentation-standards-ot",
    title: "Documentation Standards in OT",
    category: "Ethics & Professional Practice",
    seoTitle: "Documentation Standards in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to documentation standards, formats, and best practices in occupational therapy.",
    seoKeywords: ["OT documentation", "SOAP notes", "treatment plans", "progress notes", "discharge summary"],
    overview: "Documentation in OT serves multiple purposes: communicating client status, justifying services, providing legal protection, facilitating continuity of care, supporting reimbursement, and contributing to quality improvement. OTs use standardized documentation formats including evaluation reports, treatment/intervention plans, progress notes (SOAP format), and discharge summaries. Documentation must be timely, accurate, objective, and compliant with regulatory requirements.",
    mechanismPhysiology: "Documentation standards are established by professional associations (AOTA, CAOT), regulatory bodies, accreditation organizations (Joint Commission), and payers (Medicare, insurance). They reflect professional standards of practice, legal requirements, and evidence-based documentation practices.",
    clinicalRelevance: "Quality documentation is essential for justifying skilled OT services, securing reimbursement, preventing legal liability, ensuring continuity of care, and demonstrating treatment effectiveness. Inadequate documentation can result in denied claims, legal consequences, and compromised client care.",
    signsSymptoms: "Common documentation challenges include delayed entries, subjective language without supporting data, lack of measurable goals, insufficient justification for skilled services, and failure to document informed consent.",
    assessment: "Documentation should describe the client's functional status, occupational performance deficits, assessment findings with standardized measures, client goals, and the need for skilled OT services.",
    management: "SOAP format: Subjective (client's report), Objective (measurable assessment data), Assessment (clinical interpretation), Plan (intervention plan, goals). Goals should be SMART: Specific, Measurable, Achievable, Relevant, Time-bound. Documentation must demonstrate medical necessity and skilled service justification.",
    complications: "Auditing and claim denials from inadequate documentation, liability exposure from poor documentation, and breaches of confidentiality.",
    clinicalPearls: [
      "If it wasn't documented, it didn't happen — thorough documentation provides legal protection.",
      "SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound.",
      "Always justify skilled service need — document why the intervention requires an OT's expertise."
    ],
    examPitfalls: [
      "Not knowing the SOAP note format.",
      "Writing goals that are not measurable or time-bound.",
      "Failing to justify the need for skilled OT services in documentation."
    ],
    faqJson: [
      { question: "What is the SOAP note format?", answer: "Subjective (client's self-report), Objective (measurable data and observations), Assessment (clinical interpretation and progress toward goals), and Plan (next steps, modifications, discharge planning)." },
      { question: "What makes a goal 'SMART'?", answer: "SMART goals are Specific (clear target), Measurable (quantifiable outcome), Achievable (realistic), Relevant (meaningful to the client), and Time-bound (has a target date)." }
    ]
  },
  {
    slug: "ot-professional-development",
    title: "Professional Development in OT",
    category: "Ethics & Professional Practice",
    seoTitle: "Professional Development in Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to continuing education, specialization, and career development in occupational therapy.",
    seoKeywords: ["professional development", "continuing education", "specialization", "NBCOT", "OT career"],
    overview: "Professional development in OT encompasses continuing education, specialty certification, advanced practice, research participation, mentorship, and leadership development. OTs maintain competence through lifelong learning, staying current with evidence-based practice, and pursuing specialty credentials. Key certification bodies include NBCOT (US), CAOT (Canada), and AOTA specialty certifications.",
    mechanismPhysiology: "Professional development is guided by reflective practice — the systematic examination of one's own practice to identify learning needs, set goals, and pursue growth opportunities. Competency frameworks (NBCOT Practice Analysis, CAOT Profile) define the knowledge and skills expected of practicing OTs.",
    clinicalRelevance: "Maintaining competence through professional development is both an ethical obligation and a regulatory requirement. Continuing education units (CEUs) are required for license renewal in most jurisdictions. Specialty certification demonstrates advanced expertise in specific practice areas.",
    signsSymptoms: "Professional growth needs may be identified through self-assessment, peer feedback, practice outcome analysis, or changes in practice area or population.",
    assessment: "Self-assessment of competencies against practice standards, identification of learning needs, review of continuing education requirements, and career goal analysis.",
    management: "Pursue continuing education (courses, conferences, journals), seek specialty certification (CHT for hand therapy, BCP for pediatrics, BCG for gerontology), engage in mentorship (as mentor or mentee), participate in research, join professional associations, and develop leadership skills.",
    complications: "Time and financial barriers to continuing education, geographic access to training, balancing clinical duties with professional development, and navigating the credentialing landscape.",
    clinicalPearls: [
      "Specialty certifications (CHT, BCP, BCG) demonstrate advanced expertise and may increase earning potential.",
      "NBCOT certification renewal requires 36 Professional Development Units (PDUs) every 3 years.",
      "Reflective practice — systematically examining and learning from your clinical experiences — is the foundation of professional growth."
    ],
    examPitfalls: [
      "Not knowing the NBCOT renewal requirements.",
      "Confusing NBCOT certification (national) with state/provincial licensure (jurisdictional).",
      "Not recognizing the ethical obligation for continuing competence."
    ],
    faqJson: [
      { question: "What specialty certifications are available in OT?", answer: "Key specialties include Certified Hand Therapist (CHT), Board Certified in Pediatrics (BCP), Board Certified in Gerontology (BCG), Board Certified in Mental Health (BCMH), and Certified Driver Rehabilitation Specialist (CDRS)." },
      { question: "How many CEUs are needed for NBCOT renewal?", answer: "NBCOT requires 36 Professional Development Units (PDUs) in each 3-year renewal cycle, which can be earned through continuing education, publications, mentorship, and other professional activities." }
    ]
  },
  // ===== VISUAL-PERCEPTUAL SKILLS (3 entries) =====
  {
    slug: "visual-perception-deficits",
    title: "Visual Perception Deficits in OT",
    category: "Visual-Perceptual Skills",
    seoTitle: "Visual Perception Deficits in OT — OT Encyclopedia",
    seoDescription: "Guide to visual perception assessment and intervention in occupational therapy.",
    seoKeywords: ["visual perception", "figure-ground", "form constancy", "spatial relations", "visual discrimination", "OT"],
    overview: "Visual perception deficits are impairments in the brain's ability to interpret and organize visual information, distinct from visual acuity problems. OTs assess and treat deficits in visual discrimination, figure-ground perception, form constancy, spatial relations, visual closure, and visual memory. These deficits commonly occur after stroke, TBI, and in pediatric populations with learning disabilities.",
    mechanismPhysiology: "Visual perception involves cortical processing of visual input beyond the primary visual cortex. The ventral stream ('what' pathway) processes object recognition, while the dorsal stream ('where/how' pathway) processes spatial relationships and visually guided action. Deficits reflect damage to these processing areas.",
    clinicalRelevance: "Visual perception deficits significantly impact daily function — from reading and writing to dressing, cooking, and community navigation. OTs assess and treat these deficits within the context of functional activities.",
    signsSymptoms: "Difficulty finding objects in cluttered environments (figure-ground), trouble recognizing objects from different angles (form constancy), problems with spatial orientation (getting lost, difficulty with dressing), and challenges with reading and academic tasks.",
    assessment: "Motor-Free Visual Perception Test (MVPT), Test of Visual-Perceptual Skills (TVPS), Beery VMI supplemental visual perception test, LOTCA (Loewenstein Occupational Therapy Cognitive Assessment), and clinical observation during functional tasks.",
    management: "Remedial approaches (targeted exercises for specific deficits), compensatory strategies (environmental organization, systematic scanning, verbal mediation), adaptive approaches (modifying tasks and environments), and transfer training (applying skills to daily activities).",
    complications: "Visual perception deficits may be mistaken for cognitive impairment or inattention. Undiagnosed visual acuity problems may confound perceptual assessment results.",
    clinicalPearls: [
      "Always rule out visual acuity problems before diagnosing visual perception deficits — refer for eye exam if needed.",
      "Figure-ground perception deficits: simplify visual environments, reduce clutter, use high contrast.",
      "Spatial relations deficits significantly impact dressing, navigation, and reading."
    ],
    examPitfalls: [
      "Confusing visual perception (brain processing) with visual acuity (eye function).",
      "Not differentiating between specific visual perception deficit types.",
      "Not knowing the common visual perception assessment tools (MVPT, TVPS)."
    ],
    faqJson: [
      { question: "What is the difference between visual acuity and visual perception?", answer: "Visual acuity is the eye's ability to see clearly (corrected with glasses). Visual perception is the brain's ability to interpret and organize visual information (not correctable with glasses)." },
      { question: "What are common types of visual perception deficits?", answer: "Common types include figure-ground (finding objects in busy backgrounds), form constancy (recognizing objects from different angles), spatial relations (understanding position/direction), visual closure (completing incomplete visual images), and visual discrimination (distinguishing similarities/differences)." }
    ]
  },
  {
    slug: "hemianopsia-management",
    title: "Hemianopsia Management in OT",
    category: "Visual-Perceptual Skills",
    seoTitle: "Hemianopsia Management in OT — OT Encyclopedia",
    seoDescription: "Guide to assessment and management of hemianopsia (visual field cut) in occupational therapy.",
    seoKeywords: ["hemianopsia", "visual field cut", "homonymous hemianopsia", "visual scanning", "stroke", "OT"],
    overview: "Hemianopsia management in OT addresses the loss of vision in half of the visual field, most commonly homonymous hemianopsia (loss of the same half-field in both eyes) following stroke. Unlike unilateral neglect, individuals with hemianopsia are aware of their visual deficit. OTs teach compensatory scanning strategies, environmental modifications, and reading adaptations to maximize safety and function.",
    mechanismPhysiology: "Homonymous hemianopsia results from damage to the visual pathway posterior to the optic chiasm (optic tract, lateral geniculate nucleus, optic radiations, or visual cortex). Left occipital lobe damage causes right hemianopsia and vice versa. The person loses vision in the contralateral visual field of both eyes.",
    clinicalRelevance: "Hemianopsia affects reading (losing place, missing words), navigation (bumping into objects on the blind side), driving, eating (missing food on one side of the plate), and safety. OTs teach compensatory head turning and scanning strategies.",
    signsSymptoms: "Bumping into objects on the affected side, missing food on one side of the plate, difficulty reading (losing place), difficulty navigating new environments, and startling when approached from the affected side.",
    assessment: "Confrontation visual field testing, formal perimetry (physician-ordered), functional observation of visual field use during activities, reading assessment, and mobility safety assessment.",
    management: "Compensatory head turning toward the blind field, systematic visual scanning training, environmental modifications (positioning important items in the intact field initially, then teaching scanning), reading adaptations (typoscope, margin markers, finger tracking), and community mobility training with scanning strategies.",
    complications: "Falls and injuries from the blind side, reading disability, driving restriction, and anxiety about safety in unfamiliar environments.",
    clinicalPearls: [
      "Individuals with hemianopsia are AWARE of the deficit (unlike neglect) — teach them active scanning to the blind side.",
      "For reading, anchor the start of each line with a colored marker and use a typoscope to track lines.",
      "Right hemianopsia is more disabling for reading (losing the next word) than left hemianopsia."
    ],
    examPitfalls: [
      "Confusing hemianopsia (visual field loss — aware) with neglect (attention deficit — unaware).",
      "Not knowing the neuroanatomy: left occipital damage → right visual field loss.",
      "Treating hemianopsia with the same strategies as neglect — different mechanisms require different approaches."
    ],
    faqJson: [
      { question: "What is hemianopsia?", answer: "Hemianopsia is the loss of vision in half of the visual field, most commonly homonymous hemianopsia (same half-field in both eyes) after stroke. Unlike neglect, the person is aware of the visual loss." },
      { question: "How is hemianopsia different from neglect?", answer: "In hemianopsia, the person is aware of the visual loss and can learn to compensate by turning the head. In neglect, the person is unaware of the affected side and does not spontaneously attend to it." }
    ]
  },
  {
    slug: "visual-scanning-training",
    title: "Visual Scanning Training",
    category: "Visual-Perceptual Skills",
    seoTitle: "Visual Scanning Training in OT — OT Encyclopedia",
    seoDescription: "Guide to visual scanning training techniques for hemianopsia and neglect in OT.",
    seoKeywords: ["visual scanning", "scanning training", "lighthouse strategy", "reading training", "OT"],
    overview: "Visual scanning training in OT teaches systematic eye and head movement patterns to compensate for visual field deficits (hemianopsia) or attention deficits (neglect). The goal is to develop automatic scanning habits that improve safety, reading, self-care, and community mobility. Various approaches include lighthouse strategy, organized scanning patterns, and technology-assisted training.",
    mechanismPhysiology: "Visual scanning training promotes compensatory use of eye and head movements to bring information from the deficient field into the intact visual field. With practice, these compensatory movements become automatic, improving functional vision without restoring the lost visual field.",
    clinicalRelevance: "OTs implement visual scanning training as part of comprehensive rehabilitation for stroke, TBI, and other neurological conditions. Training progresses from tabletop exercises to functional activities to community environments.",
    signsSymptoms: "Difficulty finding objects, missing information on one side, reading problems, bumping into objects, and safety concerns related to incomplete visual scanning.",
    assessment: "Cancellation tests, line bisection, reading assessment, functional observation of scanning during daily activities, and community mobility observation.",
    management: "Lighthouse strategy (systematic scanning from one extreme to the other, like a lighthouse beam), organized scanning patterns (left-to-right, top-to-bottom), anchoring techniques (start scanning from a known point), reading-specific strategies (finger tracking, margin anchors, typoscope), and integration into functional activities (meal scanning, room scanning, street crossing).",
    complications: "Slow scanning speed reducing efficiency, difficulty automatizing scanning in dynamic environments, and fatigue from concentrated visual effort.",
    clinicalPearls: [
      "The lighthouse strategy teaches systematic scanning by imagining the head as a lighthouse, sweeping from one side to the other.",
      "Progress from static tabletop activities to dynamic real-world environments.",
      "Scanning must become automatic — drill practice until it becomes habitual, then integrate into functional tasks."
    ],
    examPitfalls: [
      "Applying the same scanning approach for hemianopsia and neglect without modification.",
      "Not progressing from tabletop exercises to functional activities.",
      "Focusing only on scanning speed without ensuring thoroughness."
    ],
    faqJson: [
      { question: "What is the lighthouse scanning strategy?", answer: "The lighthouse strategy teaches systematic visual scanning by imagining the head as a lighthouse beam, sweeping from one extreme to the other in organized patterns to ensure no area is missed." },
      { question: "How does visual scanning training progress?", answer: "Training progresses from simple tabletop exercises (cancellation tasks, worksheets) to functional activities (meal scanning, grooming) to community environments (store navigation, street crossing)." }
    ]
  },

  // ===== ADDITIONAL PEDIATRIC OT (6 entries) =====
  {
    slug: "early-intervention-ot",
    title: "Early Intervention in Occupational Therapy",
    category: "Pediatric OT",
    seoTitle: "Early Intervention OT Services — OT Encyclopedia",
    seoDescription: "Guide to early intervention occupational therapy for infants and toddlers ages 0-3 with developmental delays.",
    seoKeywords: ["early intervention", "IDEA Part C", "infant OT", "developmental delay", "NBCOT"],
    overview: "Early intervention (EI) OT provides therapeutic services to infants and toddlers (birth to age 3) who have or are at risk for developmental delays. Mandated by IDEA Part C, EI services are delivered in natural environments — the child's home, daycare, or community settings — using a family-centered, coaching model to promote development in everyday routines.",
    mechanismPhysiology: "During the first three years of life, the brain undergoes rapid synaptogenesis and myelination. Early therapeutic input during this critical period leverages neuroplasticity to establish functional neural pathways for motor control, sensory processing, feeding, and social engagement.",
    clinicalRelevance: "OTs in EI address feeding difficulties, fine/gross motor delays, sensory processing challenges, and adaptive skill deficits. The coaching model empowers caregivers to embed therapeutic strategies into daily routines such as feeding, bathing, dressing, and play.",
    signsSymptoms: "Delayed reaching/grasping milestones, poor head/trunk control, feeding refusal or difficulty transitioning to solids, limited exploration of toys, sensory aversions, and delayed self-care milestones.",
    assessment: "Bayley Scales of Infant Development, Peabody Developmental Motor Scales (PDMS-2), Hawaii Early Learning Profile (HELP), clinical observation of feeding and play, parent interview, and routines-based assessment.",
    management: "Caregiver coaching within daily routines, positioning and handling techniques, sensory-rich play activities, feeding therapy (oral motor and sensory-based), environmental modifications, adaptive equipment recommendations, and transition planning to Part B preschool services at age 3.",
    complications: "Caregiver stress and burnout, inconsistent carryover of strategies, cultural differences in parenting practices, and difficulty transitioning from EI to preschool services.",
    clinicalPearls: [
      "EI services must be provided in the child's natural environment per IDEA Part C requirements.",
      "The coaching model is more effective than direct 'hands-on' therapy in EI — empower the caregiver.",
      "Always address feeding concerns early, as they can significantly impact nutrition, growth, and parent-child bonding."
    ],
    examPitfalls: [
      "Confusing IDEA Part C (birth-3) with Part B (3-21) eligibility and service delivery models.",
      "Recommending clinic-based therapy instead of natural environment services for EI.",
      "Focusing only on the child without addressing caregiver coaching and routines."
    ],
    faqJson: [
      { question: "What is the natural environment requirement in early intervention?", answer: "IDEA Part C requires that EI services be provided in settings natural to the child, such as the home, daycare, or community locations, rather than clinical settings." },
      { question: "What is the coaching model in EI?", answer: "The coaching model involves the OT guiding caregivers to implement therapeutic strategies within daily routines, building caregiver competence rather than providing direct hands-on therapy." }
    ]
  },
  {
    slug: "neonatal-intensive-care-ot",
    title: "Neonatal Intensive Care Unit (NICU) OT",
    category: "Pediatric OT",
    seoTitle: "NICU Occupational Therapy — OT Encyclopedia",
    seoDescription: "Guide to occupational therapy in the NICU for premature and medically fragile infants.",
    seoKeywords: ["NICU OT", "neonatal therapy", "premature infant", "developmental care", "NBCOT"],
    overview: "NICU occupational therapy supports premature and medically fragile infants through developmental positioning, feeding support, sensory modulation, and family education. OTs in the NICU work within the Synactive Theory of Development (Als) and Neonatal Individualized Developmental Care and Assessment Program (NIDCAP) frameworks.",
    mechanismPhysiology: "Premature infants have immature neurological systems vulnerable to overstimulation. The developing brain requires carefully graded sensory input. Excessive or inappropriate stimulation can increase physiological stress, while appropriate developmental care supports brain organization and state regulation.",
    clinicalRelevance: "OTs assess infant behavioral cues, provide developmental positioning to promote flexion and midline orientation, support non-nutritive and nutritive feeding readiness, educate parents on infant cues and handling, and facilitate skin-to-skin (kangaroo) care.",
    signsSymptoms: "Physiological stress signs include color changes, desaturation, bradycardia, hiccups, and tremors. Behavioral stress signs include finger splay, saluting, arching, gaze aversion, and state instability.",
    assessment: "NIDCAP behavioral observation, Assessment of Preterm Infant Behavior (APIB), Neonatal Oral-Motor Assessment Scale (NOMAS), cue-based feeding readiness assessment, and observation of autonomic, motor, state, and attentional systems.",
    management: "Developmental positioning (nesting, boundaries for flexion), graded sensory input, non-nutritive sucking, pacing during feeding, skin-to-skin care facilitation, environmental modifications (light and noise reduction), and parent education on reading infant behavioral cues.",
    complications: "Overstimulation leading to physiological instability, feeding aspiration risk, intraventricular hemorrhage risk with handling, and long-term developmental sequelae of prematurity.",
    clinicalPearls: [
      "Always read the infant's behavioral cues before, during, and after intervention — stress signs mean stop or modify.",
      "Developmental positioning in flexion with boundaries mimics the intrauterine environment and supports neurodevelopment.",
      "Kangaroo care (skin-to-skin) has strong evidence for improving physiological stability, bonding, and breastfeeding outcomes."
    ],
    examPitfalls: [
      "Providing multimodal sensory stimulation to premature infants who can only tolerate one input at a time.",
      "Initiating oral feeding based on gestational age alone rather than behavioral feeding readiness cues.",
      "Not monitoring physiological signs (heart rate, oxygen saturation) during intervention."
    ],
    faqJson: [
      { question: "What is NIDCAP?", answer: "The Neonatal Individualized Developmental Care and Assessment Program is a framework for observing infant behavior and providing individualized developmental care to support brain development in premature infants." },
      { question: "When is an infant ready for oral feeding?", answer: "Feeding readiness is determined by behavioral cues including stable state organization, rooting, hand-to-mouth activity, non-nutritive sucking coordination, and physiological stability — not gestational age alone." }
    ]
  },
  {
    slug: "autism-spectrum-disorder-ot",
    title: "Autism Spectrum Disorder OT Interventions",
    category: "Pediatric OT",
    seoTitle: "Autism OT Interventions — OT Encyclopedia",
    seoDescription: "Evidence-based OT interventions for children with autism spectrum disorder including sensory, social, and adaptive skills.",
    seoKeywords: ["autism OT", "ASD occupational therapy", "sensory strategies autism", "social skills", "NBCOT"],
    overview: "OT for children with autism spectrum disorder (ASD) addresses sensory processing differences, social participation, play skills, self-care independence, fine motor development, and behavioral regulation. OTs use a combination of sensory-based approaches, structured teaching, visual supports, and environmental modifications to promote participation in daily occupations.",
    mechanismPhysiology: "ASD involves differences in neural connectivity affecting sensory processing, social communication, and executive function. Atypical sensory processing (hyper- or hypo-reactivity) affects arousal regulation and participation. Differences in mirror neuron systems and social brain networks impact imitation and social learning.",
    clinicalRelevance: "OTs evaluate sensory processing patterns, develop sensory diets and environmental modifications, teach self-care routines using visual supports and task analysis, promote play and social participation, and collaborate with families and schools on accommodation strategies.",
    signsSymptoms: "Sensory seeking or avoidance behaviors, difficulty with transitions, restricted/repetitive behaviors, challenges with self-care routines, limited play repertoire, fine motor difficulties, and social participation barriers.",
    assessment: "Sensory Profile-2, Sensory Processing Measure (SPM), Childhood Autism Rating Scale (CARS), Vineland Adaptive Behavior Scales, clinical observation of sensory responses, play skills, and ADL performance.",
    management: "Sensory diet programs, environmental modifications (visual schedules, structured spaces), social stories, video modeling, structured play interventions (Floortime/DIR, TEACCH), self-care training with visual supports and backward chaining, handwriting programs (Handwriting Without Tears), and school-based accommodations.",
    complications: "Behavioral escalation with sensory overload, rigid adherence to routines limiting flexibility, caregiver burnout, and generalization of skills across settings.",
    clinicalPearls: [
      "Always assess sensory processing as a foundation — many challenging behaviors are sensory-driven.",
      "Visual supports (schedules, social stories, first-then boards) are among the most effective strategies for promoting independence.",
      "Collaborate with behavioral therapists to ensure OT goals complement, not conflict with, behavioral interventions."
    ],
    examPitfalls: [
      "Attributing all challenging behaviors to willfulness rather than assessing for underlying sensory factors.",
      "Using a one-size-fits-all sensory approach without individualized sensory profiling.",
      "Recommending weighted vests or compression without evidence of benefit for the individual child."
    ],
    faqJson: [
      { question: "What is a sensory diet for autism?", answer: "A sensory diet is an individualized plan of sensory activities embedded throughout the day to help maintain optimal arousal and regulation, based on the child's specific sensory processing profile." },
      { question: "How does OT differ from ABA for autism?", answer: "OT focuses on enabling participation in daily occupations through sensory, motor, and adaptive strategies, while ABA focuses on behavior modification through reinforcement principles. They are complementary approaches." }
    ]
  },
  {
    slug: "handwriting-intervention-ot",
    title: "Handwriting Intervention in OT",
    category: "Pediatric OT",
    seoTitle: "Handwriting Intervention OT — OT Encyclopedia",
    seoDescription: "OT approaches to handwriting difficulties including assessment, intervention strategies, and evidence-based programs.",
    seoKeywords: ["handwriting OT", "dysgraphia", "Handwriting Without Tears", "fine motor", "school OT", "NBCOT"],
    overview: "Handwriting is one of the most common reasons for school-based OT referrals. OTs address the underlying components of handwriting — visual-motor integration, fine motor control, in-hand manipulation, postural stability, and sensory processing — as well as direct handwriting instruction using evidence-based programs.",
    mechanismPhysiology: "Handwriting requires integration of visual-perceptual skills (letter recognition, spatial organization), motor planning (letter formation sequences), fine motor control (pencil grasp, pressure modulation), postural stability (trunk and shoulder support), and cognitive-linguistic skills (spelling, composition). Deficits in any component can impair legibility or fluency.",
    clinicalRelevance: "OTs assess handwriting components and provide targeted interventions addressing underlying deficits and direct practice. School-based OTs collaborate with teachers to implement classroom accommodations and determine when assistive technology (keyboarding) is appropriate.",
    signsSymptoms: "Illegible letter formation, inconsistent letter sizing and spacing, slow writing speed, excessive pencil pressure, fatigue with writing tasks, awkward pencil grasp, poor letter/word spacing, difficulty copying from the board, and avoidance of writing tasks.",
    assessment: "Beery VMI (Visual-Motor Integration), Evaluation Tool of Children's Handwriting (ETCH), Minnesota Handwriting Assessment, Test of Handwriting Skills-Revised (THS-R), clinical observation of grasp, posture, and letter formation, and writing samples analysis.",
    management: "Handwriting Without Tears program, Size Matters Handwriting Program, multisensory letter formation practice, grasp training or adapted pencil grips, core and upper extremity strengthening, visual-motor integration activities, self-monitoring strategies, and accommodations (reduced written output, extended time, lined paper modifications).",
    complications: "Resistance to changing established grasp patterns, frustration and decreased self-esteem, academic impact when handwriting limits written expression, and overemphasis on grasp correction at the expense of functional legibility.",
    clinicalPearls: [
      "Functional grasp is more important than 'ideal' grasp — if the child writes legibly and without pain/fatigue, grasp correction may not be warranted.",
      "The Handwriting Without Tears program has the strongest evidence base for direct handwriting instruction.",
      "Consider keyboarding as a legitimate accommodation starting around grade 3-4 for children with persistent dysgraphia."
    ],
    examPitfalls: [
      "Focusing solely on pencil grasp correction without addressing underlying visual-motor or postural components.",
      "Not considering assistive technology as a valid intervention when handwriting remediation is insufficient.",
      "Assuming all handwriting problems have the same underlying cause."
    ],
    faqJson: [
      { question: "When should keyboarding replace handwriting instruction?", answer: "Keyboarding should be considered when handwriting remediation has been attempted but the child continues to have significant legibility or speed deficits that limit academic participation, typically around grade 3-4 and beyond." },
      { question: "What is the most evidence-based handwriting program?", answer: "Handwriting Without Tears (now Learning Without Tears) has the most research evidence supporting its effectiveness for improving handwriting legibility and is widely used in school-based OT practice." }
    ]
  },
  {
    slug: "school-based-ot-practice",
    title: "School-Based OT Practice",
    category: "Pediatric OT",
    seoTitle: "School-Based OT Practice — OT Encyclopedia",
    seoDescription: "Guide to school-based occupational therapy practice, IEP development, and educationally relevant interventions.",
    seoKeywords: ["school OT", "IEP", "IDEA", "educationally relevant", "school practice", "NBCOT"],
    overview: "School-based OT is the largest practice area in pediatric occupational therapy. Under IDEA, OTs provide services to support students' access to and participation in their educational program. Services must be educationally relevant, meaning they directly support the student's ability to benefit from special education.",
    mechanismPhysiology: "School-based OT operates within an educational model rather than a medical model. The focus is on removing barriers to educational participation rather than treating diagnoses. OTs address fine motor, sensory, self-care, organizational, and social-emotional skills as they relate to the student's educational performance.",
    clinicalRelevance: "OTs evaluate students' functional performance in the school environment, contribute to IEP development, provide direct and consultative services, recommend accommodations and modifications, and support Response to Intervention (RtI) Tier 1 and Tier 2 strategies.",
    signsSymptoms: "Difficulty with handwriting and written expression, poor fine motor skills for classroom tasks, sensory-related behavioral difficulties, challenges with self-care at school (dressing for PE, lunch management), organizational difficulties, and limited social participation.",
    assessment: "School Function Assessment (SFA), classroom observation, work sample analysis, teacher/parent interviews, curriculum-based assessments, and standardized assessments of underlying skills (Beery VMI, Sensory Profile, BOT-2).",
    management: "Direct service (individual or group), consultation with teachers, classroom modifications, assistive technology, push-in services within the classroom context, collaborative goal-writing for IEPs, and Tier 1 universal supports (movement breaks, flexible seating, visual schedules).",
    complications: "Caseload size limiting service quality, pressure to provide pull-out services rather than inclusive push-in models, difficulty measuring educationally relevant outcomes, and discontinuation of services at transition points.",
    clinicalPearls: [
      "School OT services must be educationally relevant — not all functional deficits warrant school-based OT services.",
      "Push-in consultation models are often more effective than pull-out direct service for generalization of skills.",
      "IEP goals should be measurable, functional, and directly linked to educational participation."
    ],
    examPitfalls: [
      "Applying a medical model framework to school-based practice instead of an educational relevance framework.",
      "Writing IEP goals focused on component skills (grip strength) rather than functional participation (writing legibility).",
      "Confusing eligibility for OT services (IDEA) with medical necessity for OT services."
    ],
    faqJson: [
      { question: "What makes school OT different from clinic OT?", answer: "School OT operates under an educational model focused on supporting academic participation, while clinic OT operates under a medical model focused on functional rehabilitation. School OT goals must be educationally relevant." },
      { question: "What is the difference between accommodations and modifications?", answer: "Accommodations change how a student accesses material without changing expectations (e.g., extended time). Modifications change what is expected of the student (e.g., reduced assignments)." }
    ]
  },
  {
    slug: "developmental-coordination-disorder",
    title: "Developmental Coordination Disorder (DCD)",
    category: "Pediatric OT",
    seoTitle: "Developmental Coordination Disorder OT — OT Encyclopedia",
    seoDescription: "OT assessment and intervention for developmental coordination disorder (dyspraxia) in children.",
    seoKeywords: ["DCD", "developmental coordination disorder", "dyspraxia", "motor planning", "CO-OP", "NBCOT"],
    overview: "Developmental Coordination Disorder (DCD), historically called dyspraxia, is a neurodevelopmental condition characterized by motor coordination difficulties that significantly interfere with academic achievement and daily living activities. It affects approximately 5-6% of school-age children and frequently co-occurs with ADHD, learning disabilities, and autism.",
    mechanismPhysiology: "DCD involves deficits in motor planning, motor learning, and sensorimotor integration. Current theories suggest impaired internal modeling of movements (inability to predict movement outcomes) and reduced automatization of motor skills. Neuroimaging shows differences in cerebellar, parietal, and basal ganglia activation.",
    clinicalRelevance: "OTs play a primary role in assessment and intervention for DCD. Evidence-based approaches focus on task-specific training and cognitive strategies rather than bottom-up sensorimotor remediation. The CO-OP (Cognitive Orientation to Occupational Performance) approach has the strongest evidence base.",
    signsSymptoms: "Clumsiness, difficulty learning new motor tasks (riding a bike, tying shoes, using utensils), poor handwriting, slow and effortful movement, difficulty with ball skills, avoidance of physical activities, and secondary psychosocial effects (low self-esteem, anxiety, social withdrawal).",
    assessment: "Movement Assessment Battery for Children-2 (MABC-2) is the gold standard. Also: Bruininks-Oseretsky Test of Motor Proficiency (BOT-2), Developmental Coordination Disorder Questionnaire (DCDQ), clinical observation of motor tasks, and ADL performance observation.",
    management: "CO-OP approach (cognitive strategy use with Goal-Plan-Do-Check framework), Neuromotor Task Training (NTT), task-specific training, activity modification, environmental adaptation, assistive technology for handwriting, and physical activity promotion to prevent secondary deconditioning.",
    complications: "Secondary physical inactivity and obesity, reduced physical fitness, social isolation, anxiety and depression, academic underachievement, and persistence of motor difficulties into adulthood.",
    clinicalPearls: [
      "CO-OP (Cognitive Orientation to Occupational Performance) has the strongest evidence for DCD — use Goal-Plan-Do-Check.",
      "Task-specific, top-down approaches are more effective than bottom-up sensorimotor approaches for DCD.",
      "DCD persists into adulthood in 50-70% of cases — it is not simply outgrown."
    ],
    examPitfalls: [
      "Recommending primarily sensory integration therapy for DCD without task-specific training.",
      "Diagnosing DCD without ruling out other medical conditions that explain the motor difficulties.",
      "Assuming children will outgrow motor coordination difficulties without intervention."
    ],
    faqJson: [
      { question: "What is the CO-OP approach?", answer: "CO-OP (Cognitive Orientation to Occupational Performance) is an evidence-based, client-centered approach using the global strategy Goal-Plan-Do-Check to enable children to discover cognitive strategies that solve their motor performance problems." },
      { question: "Is DCD the same as dyspraxia?", answer: "DCD is the current DSM-5 diagnostic term. Dyspraxia is an older term still commonly used, particularly in the UK. They describe the same condition of motor coordination difficulties affecting daily function." }
    ]
  },

  // ===== ADDITIONAL HAND THERAPY (6 entries) =====
  {
    slug: "carpal-tunnel-syndrome-ot",
    title: "Carpal Tunnel Syndrome OT Management",
    category: "Hand Therapy",
    seoTitle: "Carpal Tunnel Syndrome OT — OT Encyclopedia",
    seoDescription: "OT assessment and conservative management of carpal tunnel syndrome including splinting and nerve gliding.",
    seoKeywords: ["carpal tunnel syndrome", "CTS", "median nerve", "nerve gliding", "wrist splint", "NBCOT"],
    overview: "Carpal tunnel syndrome (CTS) is the most common peripheral nerve entrapment, resulting from compression of the median nerve within the carpal tunnel. OTs provide conservative management including wrist splinting, nerve gliding exercises, ergonomic modifications, and activity modification, as well as post-surgical rehabilitation following carpal tunnel release.",
    mechanismPhysiology: "The carpal tunnel is a rigid osseofibrous canal bounded by carpal bones and the transverse carpal ligament. Increased pressure within the tunnel compresses the median nerve, causing ischemia and demyelination. Causes include repetitive wrist flexion/extension, fluid retention, tenosynovitis, pregnancy, diabetes, and thyroid disorders.",
    clinicalRelevance: "OTs manage CTS conservatively through splinting in neutral wrist position, nerve and tendon gliding exercises, ergonomic workplace assessment, and activity modification. Post-operatively, OTs guide scar management, progressive strengthening, and return to function.",
    signsSymptoms: "Numbness and tingling in the median nerve distribution (thumb, index, middle, and radial half of ring finger), nocturnal symptoms, grip weakness, thenar atrophy in advanced cases, dropping objects, and difficulty with fine motor tasks.",
    assessment: "Phalen's test, Tinel's sign at the wrist, Semmes-Weinstein monofilament testing, grip and pinch dynamometry, Durkan's compression test, symptom questionnaire (Boston Carpal Tunnel Questionnaire), and nerve conduction studies (physician-ordered).",
    management: "Conservative: wrist splint in neutral (especially nighttime), median nerve gliding exercises (Totten & Hunter sequence), tendon gliding exercises, ergonomic modifications, activity modification, and anti-inflammatory modalities. Post-surgical: wound care, scar massage, gentle AROM, progressive strengthening, and work hardening.",
    complications: "Chronic nerve damage with persistent numbness, thenar muscle atrophy, pillar pain post-surgery, scar adhesion, and recurrence if ergonomic factors are not addressed.",
    clinicalPearls: [
      "Night splinting in neutral wrist position is the first-line conservative intervention — prevents sustained wrist flexion during sleep.",
      "Nerve gliding exercises should be performed gently — aggressive stretching can exacerbate symptoms.",
      "Post carpal tunnel release, avoid heavy gripping and lifting for 4-6 weeks to allow ligament healing."
    ],
    examPitfalls: [
      "Splinting the wrist in extension rather than neutral position for CTS.",
      "Confusing median nerve distribution with ulnar nerve distribution.",
      "Not addressing ergonomic and activity factors that contribute to CTS."
    ],
    faqJson: [
      { question: "What position should a CTS wrist splint hold?", answer: "The wrist should be splinted in neutral (0 degrees) position, not extension, to minimize carpal tunnel pressure. The splint is typically worn at night and during aggravating activities." },
      { question: "What are nerve gliding exercises?", answer: "Nerve gliding exercises are a sequence of hand and wrist positions that progressively tension and relax the median nerve, promoting nerve mobility within the carpal tunnel and reducing adhesions." }
    ]
  },
  {
    slug: "trigger-finger-ot",
    title: "Trigger Finger OT Management",
    category: "Hand Therapy",
    seoTitle: "Trigger Finger OT Management — OT Encyclopedia",
    seoDescription: "OT conservative management and post-surgical rehabilitation for trigger finger (stenosing tenosynovitis).",
    seoKeywords: ["trigger finger", "stenosing tenosynovitis", "A1 pulley", "hand therapy", "NBCOT"],
    overview: "Trigger finger (stenosing tenosynovitis) is a condition where the flexor tendon catches or locks as it glides through the A1 pulley at the metacarpophalangeal (MCP) joint. OTs provide conservative management including splinting, tendon gliding exercises, and activity modification, as well as post-injection and post-surgical rehabilitation.",
    mechanismPhysiology: "Repetitive friction between the flexor tendon and the A1 pulley leads to inflammation, thickening of the tendon sheath, and nodule formation on the tendon. The thickened tendon has difficulty gliding through the narrowed pulley, causing catching, locking, or triggering during finger flexion and extension.",
    clinicalRelevance: "OTs manage trigger finger through MCP blocking splints that prevent full flexion, tendon gliding exercises, activity modification to reduce repetitive gripping, and modalities for inflammation. Post-surgical trigger finger release requires scar management and restoration of tendon gliding.",
    signsSymptoms: "Catching or clicking sensation during finger flexion/extension, finger locking in flexion requiring passive extension, morning stiffness, tenderness over the A1 pulley at the palmar MCP crease, and a palpable nodule on the flexor tendon.",
    assessment: "Classification by Quinnell grading (0-IV), palpation of the A1 pulley for tenderness and nodule, active ROM assessment noting catching/locking, grip strength, and functional impact assessment.",
    management: "Conservative: MCP flexion-blocking splint (allows IP motion), tendon gliding exercises, activity modification, modalities for inflammation. Post-corticosteroid injection: gentle ROM, monitor for recurrence. Post-surgical release: wound care, scar massage, early AROM, tendon gliding exercises, progressive strengthening.",
    complications: "PIP flexion contracture from prolonged triggering, bowstringing post A1 pulley release, swan neck deformity in chronic cases, and corticosteroid injection complications.",
    clinicalPearls: [
      "The MCP flexion-blocking splint prevents full flexion to avoid the trigger point while allowing IP motion for tendon gliding.",
      "Conservative management is most effective for mild to moderate triggering (Quinnell grades I-II).",
      "After surgical release, early active motion is critical to prevent tendon adhesions."
    ],
    examPitfalls: [
      "Immobilizing the entire finger instead of using an MCP-only blocking splint.",
      "Confusing trigger finger with Dupuytren's contracture — trigger finger involves tendon, Dupuytren's involves fascia.",
      "Not educating the patient on activity modifications to prevent recurrence."
    ],
    faqJson: [
      { question: "How does an MCP blocking splint help trigger finger?", answer: "The MCP blocking splint prevents full MCP flexion, keeping the flexor tendon nodule from catching at the A1 pulley. It allows IP joint motion to maintain tendon gliding and prevent stiffness." },
      { question: "What is the A1 pulley?", answer: "The A1 pulley is a fibrous ring at the MCP joint level that holds the flexor tendon close to the bone. In trigger finger, inflammation causes narrowing of this pulley, catching the tendon during motion." }
    ]
  },
  {
    slug: "dupuytrens-contracture-ot",
    title: "Dupuytren's Contracture OT Management",
    category: "Hand Therapy",
    seoTitle: "Dupuytren's Contracture OT — OT Encyclopedia",
    seoDescription: "OT management of Dupuytren's contracture including post-surgical and post-injection rehabilitation.",
    seoKeywords: ["Dupuytren's contracture", "palmar fascia", "hand therapy", "extension splint", "NBCOT"],
    overview: "Dupuytren's contracture is a progressive fibroproliferative disorder of the palmar and digital fascia causing flexion contractures of the MCP and PIP joints, most commonly affecting the ring and small fingers. OTs provide post-procedural rehabilitation following fasciectomy, fasciotomy, or collagenase injection (Xiaflex).",
    mechanismPhysiology: "Abnormal proliferation of myofibroblasts in the palmar fascia causes formation of nodules and cords that progressively contract, pulling the fingers into flexion. The process involves excessive collagen (type III) deposition and increased levels of growth factors including TGF-beta.",
    clinicalRelevance: "OTs are essential for post-procedural rehabilitation to maintain the correction gained from surgery or injection. Extension splinting, scar management, edema control, and progressive ROM exercises are critical to prevent recurrence and maximize hand function.",
    signsSymptoms: "Palpable nodules in the palmar fascia, progressive inability to extend affected fingers, cords visible along the finger, difficulty with flat hand activities (placing hand flat on table, putting on gloves), and Hueston's tabletop test positive.",
    assessment: "Goniometric measurement of flexion contracture at MCP and PIP joints, Hueston's tabletop test, palpation of nodules and cords, grip and pinch strength, functional assessment of hand use, and classification by Tubiana staging.",
    management: "Post-fasciectomy: wound care, edema management, extension splinting (static progressive or dynamic), scar massage and management, gentle AROM/PROM, progressive strengthening. Post-collagenase injection: extension splinting protocol, finger exercises, scar management. Long-term: night extension splinting for 3-6 months to prevent recurrence.",
    complications: "Recurrence of contracture (common), digital nerve or artery damage during surgery, flare reaction, skin graft complications, reflex sympathetic dystrophy, and PIP joint contracture that may not fully resolve.",
    clinicalPearls: [
      "PIP joint contractures are more difficult to correct and more likely to recur than MCP contractures.",
      "Night extension splinting should continue for 3-6 months post-procedure to reduce recurrence risk.",
      "After collagenase injection, the finger manipulation/extension is performed 24-48 hours post-injection."
    ],
    examPitfalls: [
      "Confusing Dupuytren's contracture (fascial) with trigger finger (tendon) pathology.",
      "Not recognizing that PIP contractures have worse prognosis than MCP contractures.",
      "Discontinuing extension splinting too early, leading to recurrence."
    ],
    faqJson: [
      { question: "What is Hueston's tabletop test?", answer: "Hueston's tabletop test is positive when the patient cannot place their palm flat on a table surface due to flexion contracture — indicating significant Dupuytren's contracture requiring intervention." },
      { question: "Why does Dupuytren's commonly recur?", answer: "The underlying fibroproliferative process continues after treatment. Recurrence rates range from 20-80% depending on the procedure, affected joints, and patient risk factors. Long-term extension splinting helps reduce recurrence." }
    ]
  },
  {
    slug: "lateral-epicondylitis-ot",
    title: "Lateral Epicondylitis (Tennis Elbow) OT",
    category: "Hand Therapy",
    seoTitle: "Lateral Epicondylitis OT Management — OT Encyclopedia",
    seoDescription: "OT assessment and management of lateral epicondylitis including counterforce bracing and eccentric exercises.",
    seoKeywords: ["lateral epicondylitis", "tennis elbow", "ECRB", "counterforce brace", "eccentric exercise", "NBCOT"],
    overview: "Lateral epicondylitis (tennis elbow) is the most common overuse injury of the elbow, involving the extensor carpi radialis brevis (ECRB) tendon at its origin on the lateral epicondyle. OTs manage this condition through activity modification, counterforce bracing, eccentric strengthening, ergonomic assessment, and progressive return to activity.",
    mechanismPhysiology: "Despite the name 'epicondylitis,' the condition is a tendinopathy (degenerative) rather than an inflammatory process. Repetitive wrist extension and gripping cause microtears in the ECRB origin, leading to angiofibroblastic hyperplasia — a failed healing response with disorganized collagen, neovascularization, and absence of inflammatory cells.",
    clinicalRelevance: "OTs provide comprehensive management addressing the tendinopathy through load management, eccentric strengthening to promote collagen remodeling, ergonomic modifications to reduce provocative activities, and progressive return to function. Workplace and activity assessment is essential.",
    signsSymptoms: "Pain at the lateral epicondyle that radiates into the forearm, pain with gripping and wrist extension, weak grip strength, pain with resisted wrist extension and middle finger extension (Maudsley's test), and difficulty with activities like pouring, turning doorknobs, and lifting.",
    assessment: "Palpation of lateral epicondyle, Cozen's test (resisted wrist extension), Mill's test (passive wrist flexion with elbow extended), Maudsley's test (resisted middle finger extension), grip strength dynamometry (often pain-limited), and Patient-Rated Tennis Elbow Evaluation (PRTEE).",
    management: "Activity modification (avoiding repetitive gripping/wrist extension), counterforce brace (proximal forearm strap), eccentric wrist extension exercises (Tyler twist using FlexBar), stretching of wrist extensors, ergonomic workplace modifications, gradual progressive loading, and modalities for pain management.",
    complications: "Chronicity if load management is inadequate, grip weakness affecting function, recurrence with return to provocative activities, and rare extensor tendon rupture.",
    clinicalPearls: [
      "Eccentric exercises (Tyler twist with FlexBar) have the strongest evidence for lateral epicondylitis treatment.",
      "The counterforce brace is placed 2-3 cm distal to the lateral epicondyle over the muscle belly, not directly on the epicondyle.",
      "Lateral epicondylitis is a tendinopathy (degeneration), not tendinitis (inflammation) — treatment should promote remodeling, not just reduce inflammation."
    ],
    examPitfalls: [
      "Placing the counterforce brace directly on the lateral epicondyle instead of on the proximal forearm muscle belly.",
      "Treating lateral epicondylitis as an inflammatory condition rather than a degenerative tendinopathy.",
      "Not assessing and modifying workplace or activity ergonomics as part of treatment."
    ],
    faqJson: [
      { question: "Where should a counterforce brace be placed?", answer: "The counterforce brace should be placed 2-3 cm distal to the lateral epicondyle over the extensor muscle belly, not directly on the epicondyle. It disperses force before it reaches the tendon origin." },
      { question: "What is the Tyler twist exercise?", answer: "The Tyler twist is an eccentric exercise using a FlexBar. The patient twists the bar with the affected wrist in extension, then slowly releases with an eccentric wrist extension motion, promoting tendon remodeling." }
    ]
  },
  {
    slug: "de-quervains-tenosynovitis-ot",
    title: "De Quervain's Tenosynovitis OT",
    category: "Hand Therapy",
    seoTitle: "De Quervain's Tenosynovitis OT — OT Encyclopedia",
    seoDescription: "OT assessment and management of De Quervain's tenosynovitis including thumb spica splinting.",
    seoKeywords: ["De Quervain's", "tenosynovitis", "thumb spica", "Finkelstein test", "APL", "EPB", "NBCOT"],
    overview: "De Quervain's tenosynovitis is inflammation of the abductor pollicis longus (APL) and extensor pollicis brevis (EPB) tendons within the first dorsal compartment of the wrist. OTs manage this condition with thumb spica splinting, activity modification, tendon gliding exercises, and ergonomic education.",
    mechanismPhysiology: "Repetitive thumb abduction and extension combined with ulnar deviation of the wrist causes friction and inflammation of the APL and EPB tendons within the first dorsal compartment's retinacular sheath. The sheath thickens, narrowing the compartment and increasing tendon compression.",
    clinicalRelevance: "OTs provide conservative management through immobilization with a thumb spica splint, activity modification to reduce repetitive thumb use, ergonomic education, gentle tendon gliding exercises, and gradual return to function. Post-surgical rehabilitation follows first dorsal compartment release.",
    signsSymptoms: "Pain over the radial styloid that may radiate into the thumb or forearm, swelling over the first dorsal compartment, pain with thumb use (gripping, pinching, wringing), positive Finkelstein's test, and crepitus over the tendon sheath.",
    assessment: "Finkelstein's test (ulnar deviation with thumb in palm), Eichhoff's test, palpation over the first dorsal compartment, grip and pinch strength, and functional assessment of thumb-related activities.",
    management: "Thumb spica splint immobilizing the wrist and thumb CMC/MCP joints (IP free), activity modification, ice and modalities, gentle tendon gliding exercises (after acute phase), ergonomic modifications for child care and workplace, and graduated return to thumb-intensive activities.",
    complications: "Chronicity with inadequate rest, intersection syndrome if inflammation spreads, numbness over the dorsal radial sensory nerve (superficial branch of radial nerve), and adhesions post-surgery.",
    clinicalPearls: [
      "De Quervain's is common in new parents ('mommy thumb') from repetitive lifting of infants with thumbs abducted.",
      "The thumb spica splint should immobilize the wrist and thumb CMC/MCP joints while leaving the thumb IP joint free.",
      "Finkelstein's test is the hallmark provocative test — passive ulnar deviation with the thumb flexed in the palm."
    ],
    examPitfalls: [
      "Confusing Finkelstein's test (ulnar deviation with thumb in palm) with Eichhoff's test (make a fist over thumb then ulnar deviate).",
      "Immobilizing the thumb IP joint unnecessarily in the splint.",
      "Not modifying infant care or workplace activities that perpetuate the condition."
    ],
    faqJson: [
      { question: "What is Finkelstein's test?", answer: "Finkelstein's test involves passively ulnar deviating the wrist while the patient's thumb is held flexed in the palm. Reproduction of pain over the radial styloid indicates De Quervain's tenosynovitis." },
      { question: "Why is De Quervain's common in new parents?", answer: "Repetitive lifting of infants with the thumbs abducted and wrists ulnar deviated ('L-shaped' hand position) stresses the APL and EPB tendons, leading to inflammation — earning the nickname 'mommy thumb.'" }
    ]
  },
  {
    slug: "mallet-finger-ot",
    title: "Mallet Finger OT Management",
    category: "Hand Therapy",
    seoTitle: "Mallet Finger Splinting OT — OT Encyclopedia",
    seoDescription: "OT splinting protocol and rehabilitation for mallet finger (extensor tendon avulsion at the DIP joint).",
    seoKeywords: ["mallet finger", "DIP splint", "extensor tendon", "Stack splint", "hand therapy", "NBCOT"],
    overview: "Mallet finger is a disruption of the terminal extensor tendon at the DIP joint, causing a flexion deformity (drooping fingertip). OTs provide the primary conservative treatment through continuous DIP extension splinting for 6-8 weeks, followed by a gradual weaning protocol. Proper splinting technique and patient education are critical for successful outcomes.",
    mechanismPhysiology: "The terminal extensor tendon inserts at the distal phalanx base. Forced flexion of an extended DIP joint ruptures the tendon or avulses a bone fragment. Without the terminal tendon, the lateral bands migrate volarly, and unopposed flexion at the DIP joint results. If untreated, a swan neck deformity can develop.",
    clinicalRelevance: "OTs fabricate and monitor DIP extension splints, educate patients on the absolute importance of maintaining DIP extension continuously, and guide the gradual weaning process. Even momentary flexion during the first 6-8 weeks restarts the healing clock.",
    signsSymptoms: "Inability to actively extend the DIP joint, flexion posture of the DIP at rest (15-45 degrees), swelling and tenderness over the dorsal DIP joint, and intact passive DIP extension.",
    assessment: "Observation of DIP resting posture, active and passive DIP ROM, lateral x-ray to rule out bony avulsion (physician-ordered), and assessment of PIP joint for developing swan neck tendency.",
    management: "Continuous DIP extension splinting (Stack splint, custom dorsal or volar aluminum splint) for 6-8 weeks — the DIP must never flex during this period. Skin care under splint, PIP and MCP joint ROM exercises to prevent stiffness, then graduated weaning (night splinting for additional 4-6 weeks, daytime removal with gentle active flexion exercises).",
    complications: "Non-union if DIP flexion occurs during immobilization, skin maceration under splint, dorsal skin pressure necrosis, swan neck deformity if untreated, and PIP/MCP stiffness from disuse.",
    clinicalPearls: [
      "Even ONE episode of DIP flexion during the first 6-8 weeks restarts the healing clock — patient education is critical.",
      "When removing the splint for skin care, support the DIP in extension on a flat surface — never let it drop into flexion.",
      "Monitor the PIP joint for developing hyperextension (swan neck) during mallet finger treatment."
    ],
    examPitfalls: [
      "Allowing any DIP flexion during the immobilization period, which restarts healing.",
      "Splinting the PIP joint along with the DIP — only the DIP should be immobilized.",
      "Not educating the patient about the critical importance of continuous DIP extension."
    ],
    faqJson: [
      { question: "Why can't the DIP joint flex at all during treatment?", answer: "The ruptured tendon ends must remain in contact to heal. Any flexion separates the healing tendon, disrupting the repair and restarting the 6-8 week immobilization period from the beginning." },
      { question: "What is a swan neck deformity?", answer: "Swan neck deformity (PIP hyperextension with DIP flexion) can develop as a secondary complication of untreated mallet finger when the lateral bands shift dorsally at the PIP joint due to imbalanced extensor forces." }
    ]
  },

  // ===== ADDITIONAL GERIATRIC OT (6 entries) =====
  {
    slug: "fall-prevention-ot",
    title: "Fall Prevention in Occupational Therapy",
    category: "Geriatric OT",
    seoTitle: "Fall Prevention OT Interventions — OT Encyclopedia",
    seoDescription: "Evidence-based OT fall prevention strategies including home modifications, exercise programs, and risk assessment.",
    seoKeywords: ["fall prevention", "fall risk assessment", "home modification", "geriatric OT", "NBCOT"],
    overview: "Fall prevention is a critical area of geriatric OT practice. OTs use a multifactorial approach addressing intrinsic risk factors (balance, vision, cognition, medications) and extrinsic risk factors (environmental hazards, footwear, assistive devices) to reduce fall risk in older adults across home, community, and institutional settings.",
    mechanismPhysiology: "Falls result from the interaction of intrinsic factors (decreased balance, muscle weakness, visual impairment, cognitive decline, orthostatic hypotension, polypharmacy) and extrinsic factors (environmental hazards, poor lighting, loose rugs, lack of grab bars). Age-related changes in vestibular, somatosensory, and visual systems reduce postural control.",
    clinicalRelevance: "OTs conduct comprehensive fall risk assessments, perform home safety evaluations, recommend environmental modifications, prescribe and train with assistive devices, provide balance and functional mobility training, and educate clients and caregivers on fall prevention strategies.",
    signsSymptoms: "History of falls, near-falls or fear of falling, unsteady gait, difficulty with transfers, environmental hazards in the home, multiple medications (especially psychotropics, antihypertensives), vision changes, and deconditioning.",
    assessment: "Timed Up and Go (TUG), Berg Balance Scale, Falls Efficacy Scale International (FES-I), home safety evaluation, medication review, vision screening, cognitive screening, footwear assessment, and fall history/circumstances analysis.",
    management: "Home modifications (grab bars, handrails, improved lighting, removal of throw rugs, raised toilet seats), assistive device prescription and training, balance and strengthening exercises, vision referrals, medication review consultation, footwear recommendations, and falls self-management education.",
    complications: "Fall-related injuries (hip fracture, TBI, wrist fracture), post-fall syndrome (fear of falling leading to activity restriction), loss of independence, and institutionalization.",
    clinicalPearls: [
      "Home modification combined with behavioral strategies is more effective than either alone for fall prevention.",
      "Fear of falling (post-fall syndrome) can be more disabling than the fall itself — assess and address psychological factors.",
      "The bathroom and stairs are the highest-risk areas in the home — prioritize modifications in these areas."
    ],
    examPitfalls: [
      "Addressing only environmental factors without considering intrinsic risk factors like medications and vision.",
      "Not assessing fear of falling as a separate and significant fall risk factor.",
      "Recommending bath mats instead of non-slip strips as a bathroom modification."
    ],
    faqJson: [
      { question: "What are the most important home modifications for fall prevention?", answer: "Priority modifications include bathroom grab bars (toilet and tub/shower), handrails on both sides of stairs, improved lighting (especially nightlights), removal of throw rugs, and raised toilet seat if needed." },
      { question: "What is post-fall syndrome?", answer: "Post-fall syndrome is a fear of falling that develops after a fall, leading to activity restriction, deconditioning, social isolation, and paradoxically increased fall risk. OTs address this through graded activity exposure and confidence building." }
    ]
  },
  {
    slug: "dementia-caregiver-education",
    title: "Dementia Caregiver Education and Training",
    category: "Geriatric OT",
    seoTitle: "Dementia Caregiver Education OT — OT Encyclopedia",
    seoDescription: "OT strategies for training dementia caregivers in activity modification, communication, and behavioral management.",
    seoKeywords: ["dementia caregiver", "caregiver training", "Alzheimer's", "TCARE", "caregiver burden", "NBCOT"],
    overview: "OTs play a vital role in supporting caregivers of persons with dementia through education, activity modification training, environmental modification, behavioral management strategies, and caregiver wellness support. Evidence-based programs like TCARE, COPE, and the Tailored Activity Program (TAP) demonstrate significant improvements in caregiver well-being and reduction in behavioral symptoms.",
    mechanismPhysiology: "Dementia progressively impairs cognitive function including memory, executive function, visuospatial skills, and praxis. Understanding the neurocognitive basis of behavioral symptoms helps caregivers depersonalize difficult behaviors and implement effective management strategies based on the person's remaining abilities.",
    clinicalRelevance: "OTs assess the person-environment-occupation fit for individuals with dementia, train caregivers in activity simplification and cueing strategies matched to the person's cognitive level, recommend environmental modifications for safety and orientation, and address caregiver burnout and self-care.",
    signsSymptoms: "Caregiver burden indicators include physical exhaustion, emotional distress, social isolation, depression, sleep disruption, neglect of own health, and difficulty managing behavioral symptoms such as wandering, agitation, resistance to care, and sundowning.",
    assessment: "Zarit Burden Interview, Caregiver Strain Index, assessment of care recipient's cognitive and functional level (Allen Cognitive Level Screen, Functional Behavior Profile), home safety evaluation, observation of caregiver-patient interaction, and caregiver health and coping assessment.",
    management: "Caregiver training in: activity simplification and grading to match cognitive level, cueing hierarchies (visual, verbal, tactile), validation and redirection techniques for behavioral symptoms, environmental modifications for safety and orientation (signage, contrast, clutter reduction), establishing predictable routines, respite care planning, and caregiver self-care strategies.",
    complications: "Caregiver burnout leading to premature institutionalization, elder abuse risk when caregivers are overwhelmed, caregiver depression and physical health decline, and financial strain.",
    clinicalPearls: [
      "The Tailored Activity Program (TAP) matches activities to the person's cognitive and functional abilities — reducing behavioral symptoms and caregiver burden.",
      "Caregivers should be taught to modify the task and environment rather than trying to change the person with dementia.",
      "Behavioral symptoms in dementia are often unmet needs — assess for pain, overstimulation, boredom, or fear before assuming the behavior is 'dementia-related.'"
    ],
    examPitfalls: [
      "Focusing only on the person with dementia without assessing and supporting the caregiver.",
      "Recommending reality orientation for moderate-to-severe dementia instead of validation approaches.",
      "Not screening for caregiver depression and burnout as part of the OT evaluation."
    ],
    faqJson: [
      { question: "What is the Tailored Activity Program (TAP)?", answer: "TAP is an evidence-based OT program that prescribes customized activities matched to the person with dementia's cognitive and functional level, reducing behavioral symptoms while supporting engagement and reducing caregiver burden." },
      { question: "When should validation be used instead of reality orientation?", answer: "Validation (acknowledging the person's feelings and emotional reality) is preferred over reality orientation (correcting factual errors) for moderate to severe dementia, as reality orientation can cause frustration and agitation at later stages." }
    ]
  },
  {
    slug: "hip-fracture-rehabilitation-ot",
    title: "Hip Fracture Rehabilitation OT",
    category: "Geriatric OT",
    seoTitle: "Hip Fracture OT Rehabilitation — OT Encyclopedia",
    seoDescription: "OT rehabilitation after hip fracture including hip precautions, adaptive equipment, and functional retraining.",
    seoKeywords: ["hip fracture", "hip precautions", "total hip replacement", "adaptive equipment", "geriatric OT", "NBCOT"],
    overview: "Hip fracture is one of the most common and serious injuries in older adults, often requiring surgical repair (ORIF or arthroplasty) followed by comprehensive rehabilitation. OTs focus on teaching hip precautions, training in ADLs with adaptive equipment, transfers, home modifications, and progressive functional independence.",
    mechanismPhysiology: "Hip fractures in older adults typically result from low-energy falls combined with osteoporotic bone. Surgical approaches include internal fixation (ORIF) for nondisplaced fractures and partial or total hip arthroplasty for displaced femoral neck fractures. The surgical approach (posterior vs. anterior) determines which hip precautions apply.",
    clinicalRelevance: "OTs are essential team members in hip fracture rehabilitation, providing ADL training with adaptive equipment and hip precautions, transfer training, home assessment and modifications, fall prevention, and progressive functional retraining from acute care through community reintegration.",
    signsSymptoms: "Post-surgical pain and limited mobility, difficulty with lower body ADLs (dressing, bathing, toileting), impaired transfers, deconditioning, fear of falling, and potential cognitive complications (delirium) in older adults.",
    assessment: "Functional mobility assessment (transfers, ambulation), ADL performance evaluation with hip precautions, home assessment for discharge planning, cognitive screening for delirium, fall risk assessment, and prior level of function documentation.",
    management: "Hip precaution education and training (posterior approach: no flexion >90°, no adduction past midline, no internal rotation), adaptive equipment provision and training (long-handled reacher, sock aid, long-handled shoe horn, raised toilet seat, shower bench), transfer training, progressive ADL independence, home modification recommendations, and fall prevention education.",
    complications: "Dislocation (from precaution violations), DVT, delirium, deconditioning, pressure injuries, depression, loss of independence, and failure to return to prior level of function.",
    clinicalPearls: [
      "Posterior approach hip precautions: no flexion >90°, no adduction past midline, no internal rotation — remember 'don't cross, don't bend, don't twist.'",
      "Anterior approach hip precautions are less restrictive — typically avoid hyperextension, external rotation, and combined movements.",
      "Delirium affects up to 50% of older adults post-hip fracture — always screen for cognitive changes."
    ],
    examPitfalls: [
      "Applying posterior approach precautions to an anterior approach surgery (different precautions apply).",
      "Not assessing for post-operative delirium, which significantly impacts rehabilitation participation.",
      "Discharging without home modification assessment and adaptive equipment training."
    ],
    faqJson: [
      { question: "What are posterior hip precautions?", answer: "Posterior hip precautions restrict hip flexion beyond 90 degrees, adduction past midline, and internal rotation to prevent dislocation. These apply for 6-12 weeks post-surgery depending on the surgeon's protocol." },
      { question: "What adaptive equipment is needed after hip replacement?", answer: "Essential equipment includes a raised toilet seat, shower bench or tub transfer bench, long-handled reacher, sock aid, long-handled shoe horn, and leg lifter. These enable ADL independence while maintaining hip precautions." }
    ]
  },
  {
    slug: "low-vision-rehabilitation-ot",
    title: "Low Vision Rehabilitation OT",
    category: "Geriatric OT",
    seoTitle: "Low Vision Rehabilitation OT — OT Encyclopedia",
    seoDescription: "OT interventions for low vision rehabilitation including compensatory strategies, assistive devices, and environmental modifications.",
    seoKeywords: ["low vision", "vision rehabilitation", "macular degeneration", "magnification", "OT", "NBCOT"],
    overview: "Low vision rehabilitation OT helps individuals with irreversible vision loss maximize their remaining vision and maintain independence in daily activities. Common conditions include age-related macular degeneration (AMD), glaucoma, diabetic retinopathy, and cataracts. OTs address functional vision for ADLs, IADLs, reading, community mobility, and safety.",
    mechanismPhysiology: "Low vision is defined as best-corrected visual acuity of 20/70 or worse that cannot be fully corrected with glasses, contacts, or surgery. Central vision loss (AMD) affects reading and fine tasks. Peripheral vision loss (glaucoma) affects mobility and orientation. Both types impact functional independence differently and require different compensatory strategies.",
    clinicalRelevance: "OTs assess functional vision for daily activities, train in compensatory strategies (eccentric viewing, scanning), recommend optical and non-optical assistive devices, modify the home environment (lighting, contrast, organization), and address psychosocial adjustment to vision loss.",
    signsSymptoms: "Difficulty reading, recognizing faces, managing medications, preparing meals, performing financial tasks, navigating community environments, and increased fall risk. Psychosocial impacts include depression, social isolation, and loss of driving ability.",
    assessment: "Functional vision assessment (near and distance tasks in natural environments), contrast sensitivity, visual field assessment, reading performance, self-report measures (Impact of Vision Impairment profile), ADL/IADL performance observation, home lighting assessment, and depression screening.",
    management: "Optical devices (magnifiers, telescopes, prism glasses), non-optical strategies (large print, high contrast, talking devices), lighting optimization (task lighting 3x ambient), contrast enhancement (colored cutting boards, high-contrast markings), organizational strategies (labeling, consistent placement), eccentric viewing training for AMD, and community resource referrals.",
    complications: "Falls and injury from impaired depth perception, medication errors, social isolation, depression, loss of driving privileges, and difficulty adjusting to progressive vision loss.",
    clinicalPearls: [
      "Increasing task lighting to 3x the ambient level is one of the simplest and most effective low vision interventions.",
      "Eccentric viewing training teaches patients with central scotomas to use peripheral retina — a key skill for AMD.",
      "Address depression and adjustment to vision loss — psychosocial issues significantly impact rehabilitation outcomes."
    ],
    examPitfalls: [
      "Assuming all low vision conditions affect vision the same way — central vs. peripheral loss requires different strategies.",
      "Recommending magnification without assessing lighting first — lighting is often more impactful.",
      "Not screening for depression in individuals with progressive vision loss."
    ],
    faqJson: [
      { question: "What is eccentric viewing?", answer: "Eccentric viewing is a compensatory technique for central vision loss (e.g., AMD) where the individual learns to use a preferred retinal locus — an area of peripheral retina — for tasks previously done with central vision, such as reading." },
      { question: "What is the most important environmental modification for low vision?", answer: "Improved task lighting is often the single most impactful modification. Task lights providing 3x the ambient lighting level significantly improve functional vision for reading, medication management, and other close-up tasks." }
    ]
  },
  {
    slug: "driving-rehabilitation-ot",
    title: "Driving Rehabilitation OT",
    category: "Geriatric OT",
    seoTitle: "Driving Rehabilitation OT — OT Encyclopedia",
    seoDescription: "OT driving rehabilitation including clinical assessment, behind-the-wheel evaluation, and vehicle modifications.",
    seoKeywords: ["driving rehabilitation", "CDRS", "driver assessment", "adaptive driving", "OT", "NBCOT"],
    overview: "Driving rehabilitation is a specialized area of OT practice addressing the ability to safely operate a motor vehicle. OTs, particularly Certified Driver Rehabilitation Specialists (CDRS), evaluate visual, cognitive, motor, and perceptual skills required for driving, conduct behind-the-wheel assessments, recommend adaptive equipment, and provide driver retraining for individuals with disabilities or age-related decline.",
    mechanismPhysiology: "Safe driving requires integration of visual processing (acuity, fields, scanning), cognitive function (attention, processing speed, executive function, judgment), physical abilities (reaction time, strength, ROM, coordination), and perceptual skills (spatial awareness, depth perception). Impairments in any area can compromise driving safety.",
    clinicalRelevance: "OTs screen clients for driving fitness using clinical assessments, refer to CDRS for comprehensive evaluation when concerns are identified, recommend community mobility alternatives when driving cessation is necessary, and support psychosocial adjustment to driving retirement.",
    signsSymptoms: "Indicators of driving risk include new dents/scratches on the vehicle, getting lost on familiar routes, near-misses, traffic violations, difficulty with complex intersections, slow reaction time, reduced visual acuity or field cuts, and cognitive decline.",
    assessment: "Clinical screening: Trail Making Test A & B, Useful Field of View (UFOV), Motor-Free Visual Perceptual Test (MVPT), visual acuity/fields, ROM and strength. Comprehensive CDRS evaluation: clinical testing plus behind-the-wheel assessment on a graded route from simple to complex driving environments.",
    management: "Driver retraining for specific skill deficits, vehicle modifications (hand controls, spinner knobs, left foot accelerator, pedal extensions, seat/mirror modifications), adaptive equipment, community mobility counseling and planning, and driving retirement support with alternative transportation planning.",
    complications: "Risk of motor vehicle accidents, loss of independence and community access with driving cessation, depression and social isolation, and resistance to driving retirement recommendations.",
    clinicalPearls: [
      "The Trail Making Test B and UFOV are among the strongest clinical predictors of driving performance.",
      "Driving cessation is a significant life event comparable to bereavement — address the emotional impact.",
      "Only a CDRS should make definitive behind-the-wheel driving fitness determinations."
    ],
    examPitfalls: [
      "Making definitive driving fitness determinations based solely on clinical testing without behind-the-wheel evaluation.",
      "Not considering community mobility alternatives when recommending driving cessation.",
      "Assuming all older adults should stop driving — many continue to drive safely with appropriate modifications."
    ],
    faqJson: [
      { question: "What is a CDRS?", answer: "A Certified Driver Rehabilitation Specialist is a professional (often an OT) with specialized training and certification in comprehensive driving evaluation and rehabilitation, including clinical testing and behind-the-wheel assessment." },
      { question: "What clinical tests predict driving ability?", answer: "The Trail Making Test B (executive function), Useful Field of View (visual attention), and Motor-Free Visual Perceptual Test are among the strongest clinical predictors of driving performance in research." }
    ]
  },
  {
    slug: "aging-in-place-ot",
    title: "Aging in Place and Home Modifications OT",
    category: "Geriatric OT",
    seoTitle: "Aging in Place Home Modifications OT — OT Encyclopedia",
    seoDescription: "OT home modification and aging in place strategies for older adults to maintain independence and safety.",
    seoKeywords: ["aging in place", "home modification", "universal design", "home assessment", "geriatric OT", "NBCOT"],
    overview: "Aging in place refers to the ability to live safely and independently in one's own home and community as one ages. OTs are uniquely qualified to conduct comprehensive home assessments, recommend environmental modifications, prescribe adaptive equipment, and develop strategies that support continued independence and safety for older adults remaining in their homes.",
    mechanismPhysiology: "Age-related changes in musculoskeletal (decreased strength, ROM, balance), neurological (slowed processing, reduced sensation), sensory (vision, hearing decline), and cognitive systems create a mismatch between the person's abilities and environmental demands. OTs bridge this gap through person-environment-occupation fit optimization.",
    clinicalRelevance: "OTs perform comprehensive home safety evaluations, recommend modifications ranging from simple (grab bars, lighting) to complex (bathroom renovation, stair lifts), address fall prevention, optimize home organization, train in energy conservation and adaptive techniques, and coordinate with contractors and community resources.",
    signsSymptoms: "Difficulty navigating stairs, falls or near-falls at home, difficulty with bathing/toileting, inability to access areas of the home, poor lighting, clutter, lack of safety features (grab bars, handrails), and difficulty maintaining the home.",
    assessment: "Comprehensive home safety evaluation (entrance accessibility, bathroom safety, kitchen safety, bedroom setup, lighting, flooring, stairways), person-environment fit analysis, fall risk assessment, ADL/IADL performance in the home, and caregiver support assessment.",
    management: "Entrance modifications (ramps, railings, lever handles), bathroom modifications (grab bars, walk-in shower, raised toilet, non-slip surfaces), kitchen modifications (accessible storage, task lighting, adaptive tools), bedroom modifications (bed height, nightlights, bedside commode), universal design principles, smart home technology (medical alerts, automatic lighting, remote monitoring), and community resource coordination.",
    complications: "Cost barriers to modifications, landlord resistance in rental properties, cognitive decline limiting ability to learn new strategies, social isolation, and caregiver unavailability.",
    clinicalPearls: [
      "Universal design principles (zero-step entries, wider doorways, lever handles) benefit all ages and should be recommended proactively.",
      "Smart home technology (voice-activated controls, automatic lighting, medical alert systems) can significantly enhance safety and independence.",
      "Always assess the home in person — photographs and client report miss critical safety issues."
    ],
    examPitfalls: [
      "Recommending only equipment without addressing environmental barriers and home modifications.",
      "Not considering the client's financial resources and insurance coverage for modifications.",
      "Overlooking the entrance and pathway to the home — accessibility starts at the curb."
    ],
    faqJson: [
      { question: "What are the most critical home modifications for aging in place?", answer: "Priority modifications include bathroom safety features (grab bars, non-slip surfaces, shower seat), adequate lighting throughout, stairway handrails on both sides, entrance accessibility, and bedroom safety (nightlights, accessible bed height)." },
      { question: "What is universal design?", answer: "Universal design creates living spaces usable by all people regardless of age or ability, including features like zero-step entries, wider doorways, lever door handles, and curbless showers — benefiting current and future needs." }
    ]
  },

  // ===== ADDITIONAL ADL (5 entries) =====
  {
    slug: "feeding-and-eating-ot",
    title: "Feeding and Eating Interventions in OT",
    category: "Activities of Daily Living",
    seoTitle: "Feeding and Eating OT Interventions — OT Encyclopedia",
    seoDescription: "OT assessment and intervention for feeding and eating including dysphagia management, adaptive equipment, and positioning.",
    seoKeywords: ["feeding OT", "eating intervention", "adaptive utensils", "dysphagia", "self-feeding", "NBCOT"],
    overview: "Feeding and eating are fundamental ADLs addressed by OTs across the lifespan. OTs evaluate and treat the motor, sensory, cognitive, and perceptual components of self-feeding, recommend adaptive equipment, provide positioning strategies, and collaborate with speech-language pathologists on dysphagia management.",
    mechanismPhysiology: "Self-feeding requires integration of visual perception (locating food), upper extremity motor control (reaching, grasping utensils, hand-to-mouth movement), oral motor skills (chewing, swallowing), sensory processing (taste, texture, temperature awareness), cognitive skills (sequencing, attention, problem-solving), and postural control (trunk stability for UE function).",
    clinicalRelevance: "OTs address self-feeding independence through adaptive equipment (built-up utensils, plate guards, rocker knives, weighted utensils), positioning optimization (90-90-90 seated posture), environmental modifications, cognitive strategies, one-handed techniques for hemiplegia, and collaboration with SLPs and dietitians.",
    signsSymptoms: "Difficulty using utensils, food spillage, inability to cut food, poor hand-to-mouth coordination, messy eating, slow eating speed, difficulty opening containers, and food management difficulties related to cognitive or perceptual deficits.",
    assessment: "Observation of meal performance (setup, utensil use, pacing, safety), upper extremity functional assessment, cognitive and perceptual screening, oral motor observation (in collaboration with SLP), seating and positioning assessment, and adaptive equipment trial.",
    management: "Adaptive equipment (built-up handles, weighted utensils, universal cuff, plate guards, scoop dishes, non-slip mats, rocker knife), positioning optimization, one-handed techniques, environmental modifications (contrast between plate and table, minimize distractions), cognitive cueing strategies, and graded eating skill progression.",
    complications: "Aspiration risk with impaired swallowing, malnutrition from inefficient self-feeding, choking risk, social embarrassment, and caregiver dependence for feeding.",
    clinicalPearls: [
      "Optimal feeding position is 90-90-90: 90° hip flexion, 90° knee flexion, feet flat on floor — trunk stability enables UE function.",
      "A universal cuff is the go-to device when a patient cannot grasp utensils — it straps around the palm and holds the utensil.",
      "For hemiplegic patients, a rocker knife allows one-handed cutting by rocking the curved blade through food."
    ],
    examPitfalls: [
      "Not assessing seating and positioning before introducing adaptive feeding equipment.",
      "Providing adaptive equipment without training the patient in its use.",
      "Not collaborating with SLP when swallowing safety is a concern."
    ],
    faqJson: [
      { question: "What is a universal cuff?", answer: "A universal cuff is a palmar strap with a pocket that holds utensils, pens, or other tools for individuals who cannot grasp objects. It wraps around the hand and secures the tool without requiring grip strength." },
      { question: "What adaptive equipment helps with one-handed eating?", answer: "Key one-handed equipment includes a rocker knife (curved blade for one-handed cutting), plate guard or scoop dish (prevents food from sliding), non-slip mat (stabilizes the plate), and built-up utensils for easier grasp." }
    ]
  },
  {
    slug: "toileting-rehabilitation-ot",
    title: "Toileting Rehabilitation in OT",
    category: "Activities of Daily Living",
    seoTitle: "Toileting Rehabilitation OT — OT Encyclopedia",
    seoDescription: "OT interventions for toileting independence including adaptive equipment, transfer training, and cognitive strategies.",
    seoKeywords: ["toileting OT", "toilet transfer", "raised toilet seat", "bathroom safety", "ADL", "NBCOT"],
    overview: "Toileting is a fundamental ADL that requires motor, cognitive, and perceptual skills. Loss of toileting independence significantly impacts dignity, quality of life, and discharge disposition. OTs address toileting through adaptive equipment, transfer training, clothing management strategies, hygiene techniques, and cognitive approaches for individuals with various disabilities.",
    mechanismPhysiology: "Functional toileting requires the integration of mobility (transfers on/off toilet), balance (maintaining seated position), upper extremity function (clothing management, hygiene), cognition (recognizing need, sequencing, locating bathroom), perception (body awareness, spatial orientation), and continence awareness. Deficits in any component compromise independence.",
    clinicalRelevance: "OTs assess all components of toileting performance, recommend and train with adaptive equipment (raised toilet seat, grab bars, toilet safety frame, bedside commode), teach clothing management techniques, address hygiene methods with adaptive tools, and provide cognitive strategies for toileting routines.",
    signsSymptoms: "Difficulty transferring on/off the toilet, inability to manage clothing, difficulty with hygiene, incontinence related to mobility or cognitive limitations (functional incontinence), and safety concerns in the bathroom.",
    assessment: "Observation of complete toileting task (approach, transfers, clothing management, hygiene, handwashing), bathroom accessibility assessment, cognitive assessment for toileting awareness and sequencing, balance assessment during toilet transfers, and identification of specific performance barriers.",
    management: "Raised toilet seat (for limited hip flexion or weakness), toilet safety frame or grab bars, bedside commode, adapted clothing (elastic waistbands, Velcro closures), long-handled hygiene aids (toilet aid tongs, bidet), scheduled toileting programs for cognitive impairment, and bathroom accessibility modifications.",
    complications: "Falls during toilet transfers, skin breakdown from incontinence, urinary tract infections, loss of dignity, social isolation, and premature institutionalization if toileting independence is not achieved.",
    clinicalPearls: [
      "Toileting independence is one of the strongest predictors of discharge to home vs. skilled nursing facility.",
      "A raised toilet seat is essential after hip replacement to maintain hip precautions (no flexion >90°).",
      "For individuals with cognitive impairment, a scheduled toileting program with environmental cues (visual signs, clothing modifications) is more effective than verbal reminders alone."
    ],
    examPitfalls: [
      "Addressing only the transfer component without considering clothing management and hygiene.",
      "Not considering a bedside commode for nighttime safety when bathroom access is distant.",
      "Recommending toileting equipment without assessing the actual bathroom space and layout."
    ],
    faqJson: [
      { question: "Why is toileting independence so important for discharge planning?", answer: "Toileting independence is one of the strongest predictors of whether a patient can discharge home vs. requiring a skilled nursing facility. It impacts dignity, caregiver burden, and overall safety at home." },
      { question: "What equipment helps with toileting after hip replacement?", answer: "A raised toilet seat (3-4 inches) maintains the hip above knee level to prevent flexion beyond 90 degrees. Grab bars and a toilet safety frame provide support for safe sit-to-stand transfers." }
    ]
  },
  {
    slug: "dressing-techniques-ot",
    title: "Dressing Techniques and Adaptations in OT",
    category: "Activities of Daily Living",
    seoTitle: "Dressing Techniques OT — OT Encyclopedia",
    seoDescription: "OT dressing techniques for hemiplegia, limited mobility, and cognitive impairment including adaptive strategies and equipment.",
    seoKeywords: ["dressing OT", "hemiplegic dressing", "adaptive dressing", "one-handed techniques", "ADL", "NBCOT"],
    overview: "Dressing is a complex ADL requiring bilateral coordination, fine motor skills, balance, cognition, and range of motion. OTs teach compensatory dressing techniques tailored to specific disabilities including hemiplegia, limited ROM, lower extremity restrictions (hip precautions), visual impairment, and cognitive impairment. Adaptive equipment and clothing modifications enhance independence.",
    mechanismPhysiology: "Dressing requires integration of motor planning (sequencing garment manipulation), bilateral coordination (stabilizing and manipulating clothing), fine motor control (fasteners), balance (standing for lower body dressing), ROM (reaching behind, bending), cognition (garment orientation, sequencing), and visual-perceptual skills (front/back discrimination, inside/out).",
    clinicalRelevance: "OTs assess dressing performance, teach compensatory techniques matched to the client's specific impairments, recommend adaptive equipment and clothing modifications, and grade dressing tasks to build independence progressively.",
    signsSymptoms: "Difficulty donning/doffing upper and lower body garments, inability to manage fasteners, confusion about garment orientation, balance difficulties during standing dressing, and fatigue limiting dressing completion.",
    assessment: "Observation of dressing performance (UB and LB separately), identification of specific barriers (motor, cognitive, perceptual), assessment of current strategies, cognitive sequencing assessment, balance during dressing, and caregiver assistance level.",
    management: "Hemiplegic dressing: affected arm/leg in first, out last. Adaptive equipment: button hook, zipper pull, elastic shoelaces, sock aid, long-handled shoe horn, dressing stick, reacher. Clothing modifications: front-opening garments, elastic waistbands, Velcro replacing buttons, magnetic closures. Cognitive strategies: visual cues, laid-out clothing sequence, consistent routine.",
    complications: "Shoulder injury from forceful dressing of a hemiplegic arm, falls during standing dressing, skin tears from friction, frustration and learned helplessness, and caregiver dependence.",
    clinicalPearls: [
      "The cardinal rule of hemiplegic dressing: 'affected arm/leg IN first, OUT last' — this minimizes shoulder stress and simplifies the task.",
      "Seated dressing is safer than standing for lower body garments — reduce fall risk by dressing at bedside.",
      "For cognitively impaired individuals, lay clothing out in dressing sequence and use the same routine daily to build procedural memory."
    ],
    examPitfalls: [
      "Teaching affected limb out first instead of in first for hemiplegic dressing.",
      "Not addressing both upper body and lower body dressing — they require different strategies.",
      "Assuming adaptive equipment alone solves dressing problems without training in techniques."
    ],
    faqJson: [
      { question: "What is the correct dressing sequence for hemiplegia?", answer: "For donning (putting on): dress the affected arm or leg first. For doffing (removing): remove the unaffected arm or leg first. Remember: 'affected in first, out last.'" },
      { question: "What adaptive equipment helps with one-handed dressing?", answer: "Key equipment includes a button hook, long-handled shoe horn, elastic shoelaces, sock aid, reacher/dressing stick, and clothing with Velcro or magnetic closures replacing buttons." }
    ]
  },
  {
    slug: "home-management-ot",
    title: "Home Management and IADL Training in OT",
    category: "Activities of Daily Living",
    seoTitle: "Home Management IADL OT — OT Encyclopedia",
    seoDescription: "OT interventions for home management and IADL skills including meal preparation, cleaning, laundry, and community integration.",
    seoKeywords: ["IADL training", "home management OT", "meal preparation", "community reintegration", "NBCOT"],
    overview: "Home management and instrumental activities of daily living (IADLs) are complex tasks essential for independent community living. OTs assess and train individuals in meal preparation, household cleaning, laundry, financial management, medication management, shopping, and community transportation. These skills are critical for successful community discharge and independent living.",
    mechanismPhysiology: "IADLs require higher-level cognitive function (executive function, planning, sequencing, problem-solving, multi-tasking), physical endurance, mobility throughout the home and community, upper extremity function, and safety awareness. IADLs are more complex than basic ADLs and are often the first to decline with cognitive or physical changes.",
    clinicalRelevance: "OTs evaluate IADL performance in realistic settings, identify specific barriers, teach compensatory strategies and energy conservation, recommend adaptive equipment and environmental modifications, and assess readiness for independent community living. IADL independence is a key factor in discharge planning.",
    signsSymptoms: "Difficulty planning and preparing meals, inability to manage household cleaning, medication management errors, difficulty managing finances, unsafe use of kitchen appliances, and challenges with community shopping and transportation.",
    assessment: "Performance Assessment of Self-care Skills (PASS), kitchen task assessment (meal preparation observation), medication management assessment (pill sorting, adherence), financial management screening, Kohlman Evaluation of Living Skills (KELS), and community mobility assessment.",
    management: "Graded kitchen activities (cold meal → hot meal → multi-step meal), energy conservation techniques for household tasks, organizational strategies (checklists, labeling, routines), adaptive kitchen equipment (one-handed cutting board, jar opener, reacher for high shelves), medication management systems (pill organizers, alarms), financial management supports, and community reintegration training.",
    complications: "Fire and burn risk during cooking, medication errors, financial exploitation vulnerability, malnutrition from inability to prepare meals, and social isolation from inability to access community.",
    clinicalPearls: [
      "Kitchen assessment with actual meal preparation is the gold standard for evaluating IADL readiness — observation reveals deficits that interviews miss.",
      "Energy conservation principles (pace, prioritize, plan, position) apply to all home management tasks.",
      "Medication management assessment should include both cognitive (knowing medications) and physical (opening bottles, reading labels) components."
    ],
    examPitfalls: [
      "Assessing IADLs through interview alone without performance-based observation.",
      "Not grading meal preparation complexity (cold → hot → multi-step) during assessment and training.",
      "Overlooking community mobility as part of home management training."
    ],
    faqJson: [
      { question: "Why are IADLs important for discharge planning?", answer: "IADLs like meal preparation, medication management, and household tasks are essential for safe independent living. A patient may be independent in basic ADLs but still require assistance if IADL skills are impaired." },
      { question: "What is energy conservation for home management?", answer: "Energy conservation uses the 4 P's: Pace (alternate activity with rest), Prioritize (do essential tasks when energy is highest), Plan (organize tasks and gather supplies before starting), and Position (use optimal body mechanics and seated work when possible)." }
    ]
  },
  {
    slug: "community-mobility-ot",
    title: "Community Mobility and Transportation OT",
    category: "Activities of Daily Living",
    seoTitle: "Community Mobility OT — OT Encyclopedia",
    seoDescription: "OT community mobility interventions including transportation access, pedestrian safety, and public transit training.",
    seoKeywords: ["community mobility", "transportation OT", "public transit training", "pedestrian safety", "IADL", "NBCOT"],
    overview: "Community mobility encompasses all forms of transportation and movement within the community including walking, public transit use, paratransit services, rideshare applications, and driving. OTs assess community mobility needs, train in alternative transportation methods, address pedestrian safety, and facilitate community access for individuals who cannot or should not drive.",
    mechanismPhysiology: "Community mobility requires cognitive skills (route planning, problem-solving, money management), physical abilities (endurance, balance, mobility), sensory skills (vision, hearing for safety), social skills (interacting with drivers, asking for directions), and executive function (time management, contingency planning).",
    clinicalRelevance: "OTs assess community mobility as a critical IADL, train individuals in public transit use, recommend paratransit services, address pedestrian safety (crosswalk navigation, traffic awareness), support transition from driving to alternative transportation, and advocate for accessible community environments.",
    signsSymptoms: "Inability to access community services, social isolation due to transportation barriers, unsafe pedestrian behavior, difficulty using public transit, inability to manage rideshare technology, and loss of driving privileges without alternative planning.",
    assessment: "Community mobility assessment in natural environments, public transit skills evaluation, pedestrian safety observation, cognitive assessment for route planning and money management, physical endurance for community distances, and technology skills assessment for rideshare and transit apps.",
    management: "Public transit training (route planning, schedule reading, fare management, transfers), pedestrian safety training (crosswalk navigation, traffic light interpretation), paratransit application assistance, rideshare app training, community mobility planning post-driving cessation, mobility device training for community distances, and advocacy for accessible transportation.",
    complications: "Social isolation from community mobility loss, inability to access medical appointments and essential services, depression related to loss of independence, and safety risks as a pedestrian.",
    clinicalPearls: [
      "Community mobility training should occur in actual community environments — clinic simulation does not generalize well.",
      "Loss of driving is the primary cause of community mobility loss in older adults — proactively plan alternatives before cessation.",
      "Technology training (rideshare apps, transit apps) can significantly expand community mobility options for non-drivers."
    ],
    examPitfalls: [
      "Not addressing community mobility as part of discharge planning.",
      "Assuming driving cessation automatically means loss of community access — alternatives exist.",
      "Training community mobility skills only in simulated environments without community practice."
    ],
    faqJson: [
      { question: "What is paratransit?", answer: "Paratransit is a door-to-door transportation service mandated by the ADA for individuals with disabilities who cannot use fixed-route public transit. It requires an application process and advance scheduling." },
      { question: "How do OTs address driving cessation?", answer: "OTs facilitate the transition from driving to alternative transportation by assessing community mobility needs, training in public transit and rideshare use, connecting to paratransit services, and addressing the psychosocial impact of driving retirement." }
    ]
  },

  // ===== ADDITIONAL NEUROLOGICAL REHABILITATION (5 entries) =====
  {
    slug: "spinal-cord-injury-ot",
    title: "Spinal Cord Injury OT Rehabilitation",
    category: "Neurological Rehabilitation",
    seoTitle: "Spinal Cord Injury OT Rehabilitation — OT Encyclopedia",
    seoDescription: "OT rehabilitation for spinal cord injury including functional expectations by level, adaptive equipment, and independence goals.",
    seoKeywords: ["spinal cord injury", "SCI", "tetraplegia", "paraplegia", "tenodesis", "OT", "NBCOT"],
    overview: "OTs play a critical role in spinal cord injury (SCI) rehabilitation, addressing ADL independence, adaptive equipment, wheelchair positioning, upper extremity function (in tetraplegia), home modifications, and community reintegration. Functional expectations vary significantly based on the neurological level of injury, and OTs must understand functional outcomes by level to set appropriate goals.",
    mechanismPhysiology: "SCI disrupts motor and sensory pathways below the level of injury. Complete injuries (ASIA A) result in no motor or sensory function below the level. Incomplete injuries (ASIA B-D) preserve varying degrees of function. In tetraplegia, preservation of specific upper extremity muscles determines functional independence potential.",
    clinicalRelevance: "OTs assess functional level, train ADLs using compensatory strategies and adaptive equipment appropriate to the injury level, address upper extremity strengthening and tenodesis grasp for C6-C7 tetraplegia, recommend and train with assistive technology, and facilitate community reintegration and vocational rehabilitation.",
    signsSymptoms: "Loss of motor and sensory function below the injury level, impaired upper extremity function (tetraplegia), impaired trunk control, autonomic dysreflexia risk (T6 and above), respiratory compromise (high-level injuries), bowel/bladder dysfunction, and spasticity.",
    assessment: "ASIA Impairment Scale classification, manual muscle testing of key muscles, sensory testing, Spinal Cord Independence Measure (SCIM), Capabilities of Upper Extremity Instrument (CUE), functional assessment of ADLs, wheelchair skills assessment, and home evaluation.",
    management: "C5: adaptive equipment for feeding (mobile arm support, universal cuff), power wheelchair. C6: tenodesis grasp training, transfer board, manual wheelchair with friction rims, adapted driving. C7: increased independence with transfers, self-care, manual wheelchair. Paraplegia: full upper body ADL independence, manual wheelchair skills, car transfers, standing frame program. All levels: skin inspection, pressure relief, autonomic dysreflexia education, bowel/bladder program, community reintegration.",
    complications: "Pressure injuries, autonomic dysreflexia (medical emergency for T6 and above), heterotopic ossification, contractures, shoulder overuse injuries, depression, and respiratory complications.",
    clinicalPearls: [
      "Tenodesis grasp (passive finger flexion with wrist extension) is the key functional grasp for C6 tetraplegia — never stretch finger flexors in SCI patients.",
      "Autonomic dysreflexia is a medical emergency for injuries at T6 and above — symptoms include sudden hypertension, headache, flushing, and sweating above the level of injury.",
      "C6 is the critical functional level for SCI independence — wrist extension enables tenodesis grasp, transfers with a sliding board, and adapted driving."
    ],
    examPitfalls: [
      "Stretching finger flexors in a patient with C6-C7 tetraplegia — this destroys tenodesis grasp.",
      "Not recognizing autonomic dysreflexia as a medical emergency requiring immediate positioning (sit up) and noxious stimulus removal.",
      "Setting unrealistic functional goals that don't match the neurological level of injury."
    ],
    faqJson: [
      { question: "What is tenodesis grasp?", answer: "Tenodesis grasp is a passive grip mechanism where wrist extension causes the fingers to flex through passive tendon tension. It is the primary functional grasp for individuals with C6 tetraplegia and should never be compromised by stretching finger flexors." },
      { question: "What functional level allows independent driving?", answer: "Individuals with C6 tetraplegia and below can potentially drive with adaptive equipment (hand controls, spinner knob). C6 provides wrist extension needed for steering and operating hand controls." }
    ]
  },
  {
    slug: "traumatic-brain-injury-cognitive-rehab",
    title: "TBI Cognitive Rehabilitation in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "TBI Cognitive Rehabilitation OT — OT Encyclopedia",
    seoDescription: "OT cognitive rehabilitation strategies for traumatic brain injury including attention, memory, and executive function.",
    seoKeywords: ["TBI", "cognitive rehabilitation", "attention training", "memory strategies", "executive function", "NBCOT"],
    overview: "OTs provide cognitive rehabilitation following traumatic brain injury (TBI) using both restorative and compensatory approaches. Intervention addresses attention, memory, executive function, self-awareness, and safety judgment as they impact participation in daily occupations. OTs are uniquely positioned to address cognition within the context of functional activities.",
    mechanismPhysiology: "TBI causes diffuse axonal injury, contusions, and secondary neurochemical cascades affecting cognitive networks. Frontal lobe damage impairs executive function and self-awareness. Temporal lobe involvement affects memory. Diffuse injury impairs processing speed and attention. Neuroplasticity allows for recovery and reorganization, particularly in the first 6-12 months post-injury.",
    clinicalRelevance: "OTs assess cognitive skills during functional activities (not just tabletop testing), train compensatory strategies for real-world application, modify the environment to support cognitive function, address safety awareness and judgment, and support community reintegration and return to work/school.",
    signsSymptoms: "Impaired attention and concentration, memory deficits (primarily new learning), executive dysfunction (planning, initiation, problem-solving, self-monitoring), reduced processing speed, impaired self-awareness (anosognosia), impulsivity, and safety judgment concerns.",
    assessment: "Cognitive assessment during ADLs and IADLs, Cognistat, Montreal Cognitive Assessment (MoCA), Trail Making Test, Executive Function Performance Test (EFPT), Assessment of Motor and Process Skills (AMPS), Contextual Memory Test, and self-awareness measures (Self-Awareness of Deficits Interview).",
    management: "Attention: graded environmental complexity, attention training tasks, metacognitive strategies. Memory: external aids (phone alarms, calendars, checklists, recording apps), spaced retrieval, errorless learning. Executive function: goal management training, problem-solving frameworks, routine establishment, self-monitoring strategies. Self-awareness: structured feedback, video review, experiential tasks that reveal deficits.",
    complications: "Poor self-awareness limiting engagement in rehabilitation, safety risks from impaired judgment, difficulty returning to work/school, relationship strain, depression and anxiety, and substance abuse.",
    clinicalPearls: [
      "External compensatory strategies (phone alarms, checklists, calendars) are more effective than restorative memory drills for moderate-severe TBI.",
      "Self-awareness is the foundation of cognitive rehabilitation — patients who don't recognize deficits won't use compensatory strategies.",
      "Errorless learning (preventing errors during learning) is more effective than trial-and-error for individuals with severe memory impairment."
    ],
    examPitfalls: [
      "Relying solely on restorative approaches (worksheets, computer drills) without functional compensatory strategy training.",
      "Assessing cognition only through tabletop testing without observing function in real-world contexts.",
      "Not addressing self-awareness as a prerequisite for effective compensatory strategy use."
    ],
    faqJson: [
      { question: "What is errorless learning?", answer: "Errorless learning is a teaching approach that prevents errors during skill acquisition by providing maximum support and cues. It is more effective than trial-and-error for individuals with severe memory impairment because they cannot learn from mistakes they don't remember making." },
      { question: "Why are external aids preferred over memory drills for TBI?", answer: "External aids (phone alarms, calendars, checklists) compensate for memory deficits in real-world contexts. Research shows restorative memory exercises do not generalize to daily function, while external aids directly improve functional independence." }
    ]
  },
  {
    slug: "multiple-sclerosis-ot",
    title: "Multiple Sclerosis OT Management",
    category: "Neurological Rehabilitation",
    seoTitle: "Multiple Sclerosis OT Management — OT Encyclopedia",
    seoDescription: "OT management of multiple sclerosis including fatigue management, energy conservation, and adaptive strategies.",
    seoKeywords: ["multiple sclerosis", "MS", "fatigue management", "energy conservation", "cooling strategies", "NBCOT"],
    overview: "OTs manage the functional impact of multiple sclerosis (MS) across the disease trajectory, addressing fatigue, upper extremity dysfunction, cognitive changes, visual impairment, spasticity, and progressive disability. Energy conservation and fatigue management are hallmark OT interventions for MS.",
    mechanismPhysiology: "MS is an autoimmune inflammatory demyelinating disease of the central nervous system. Demyelination and axonal damage disrupt neural transmission, causing variable symptoms depending on lesion location. Heat sensitivity (Uhthoff's phenomenon) occurs because demyelinated nerves conduct more slowly at elevated temperatures. Fatigue in MS is multifactorial — both primary (CNS) and secondary (sleep, deconditioning, depression).",
    clinicalRelevance: "OTs address fatigue through energy conservation education, teach work simplification techniques, recommend adaptive equipment for UE dysfunction and mobility challenges, provide cognitive compensation strategies, manage heat sensitivity, and support occupational role maintenance throughout the disease course.",
    signsSymptoms: "Fatigue (most common symptom, affecting 80% of patients), upper extremity weakness and incoordination, spasticity, visual disturbances, cognitive dysfunction (processing speed, memory, executive function), heat sensitivity, pain, and depression.",
    assessment: "Modified Fatigue Impact Scale (MFIS), Fatigue Severity Scale, MS Functional Composite, Nine-Hole Peg Test (UE dexterity), cognitive screening (Symbol Digit Modalities Test), ADL/IADL performance assessment, energy expenditure analysis, and home/workplace evaluation.",
    management: "Energy conservation (4 P's: Pace, Prioritize, Plan, Position), work simplification, cooling strategies (cooling vests, pre-cooling, avoiding heat), adaptive equipment for UE dysfunction, cognitive compensatory strategies, spasticity management positioning, home and workplace modifications, assistive technology, and disease-stage-appropriate goal setting.",
    complications: "Progressive disability requiring ongoing adaptation, depression (50% lifetime prevalence), cognitive decline affecting employment, caregiver burden, and social isolation.",
    clinicalPearls: [
      "Energy conservation is the cornerstone OT intervention for MS — teach the 4 P's: Pace, Prioritize, Plan, Position.",
      "Uhthoff's phenomenon: heat worsens MS symptoms — recommend cooling strategies and avoid hot environments, hot baths, and exercise in heat.",
      "The Nine-Hole Peg Test is the standard UE outcome measure for MS clinical trials and should be used to track hand function."
    ],
    examPitfalls: [
      "Recommending vigorous exercise without considering fatigue management and heat sensitivity.",
      "Not recognizing that MS fatigue is different from general tiredness and requires specific management strategies.",
      "Setting static goals without accounting for the relapsing-remitting or progressive nature of MS."
    ],
    faqJson: [
      { question: "What is Uhthoff's phenomenon?", answer: "Uhthoff's phenomenon is the temporary worsening of MS symptoms with increased body temperature. Demyelinated nerves conduct more slowly at elevated temperatures, causing increased weakness, visual blurring, and fatigue. Symptoms resolve when body temperature normalizes." },
      { question: "What are the 4 P's of energy conservation?", answer: "Pace (alternate activity with rest, avoid marathon sessions), Prioritize (do important tasks when energy is highest), Plan (organize tasks and gather supplies before starting), and Position (use optimal positioning to reduce energy expenditure, sit when possible)." }
    ]
  },
  {
    slug: "parkinsons-disease-ot",
    title: "Parkinson's Disease OT Management",
    category: "Neurological Rehabilitation",
    seoTitle: "Parkinson's Disease OT — OT Encyclopedia",
    seoDescription: "OT management of Parkinson's disease including dual-task training, cueing strategies, and ADL adaptations.",
    seoKeywords: ["Parkinson's disease", "bradykinesia", "cueing strategies", "dual task", "freezing", "OT", "NBCOT"],
    overview: "OTs manage the functional impact of Parkinson's disease (PD) across the disease stages, addressing bradykinesia, rigidity, tremor, postural instability, freezing of gait, cognitive changes, and progressive ADL limitations. External cueing strategies, dual-task training, home safety, and maintaining occupational engagement are key OT contributions.",
    mechanismPhysiology: "PD results from degeneration of dopaminergic neurons in the substantia nigra, disrupting basal ganglia circuitry for movement initiation, scaling, and automaticity. Cardinal motor features (bradykinesia, rigidity, resting tremor, postural instability) reflect impaired basal ganglia output. The basal ganglia also support habitual/automatic movement, explaining why external cues bypass the impaired system.",
    clinicalRelevance: "OTs teach external cueing strategies to compensate for impaired internal movement programming, address fine motor and handwriting changes (micrographia), adapt ADL techniques, modify the home for safety, manage on-off medication fluctuations, and support cognitive and psychosocial well-being.",
    signsSymptoms: "Bradykinesia (slowness of movement), rigidity (cogwheel or lead pipe), resting tremor (pill-rolling), postural instability, freezing of gait, micrographia, masked facial expression, soft speech (hypophonia), cognitive changes, and depression.",
    assessment: "Observation of ADL performance (noting on/off medication states), Unified Parkinson's Disease Rating Scale (MDS-UPDRS), timed functional tasks, handwriting assessment, home safety evaluation, dual-task performance assessment, freezing history and triggers, and cognitive screening.",
    management: "External cueing strategies: visual cues (floor lines, laser pointer on walker), auditory cues (metronome, rhythmic music), cognitive cues (self-talk, counting). Dual-task training, big movement strategies (LSVT BIG), handwriting programs (large amplitude writing), ADL adaptations (elastic shoelaces, Velcro, built-up utensils), home modifications for freezing triggers (doorway thresholds, narrow spaces), and medication timing education (schedule activities during 'on' periods).",
    complications: "Falls from postural instability and freezing, dysphagia, cognitive decline progressing to dementia, depression, caregiver burden, and medication on-off fluctuations disrupting function.",
    clinicalPearls: [
      "External cues bypass the impaired basal ganglia — visual lines on the floor, a metronome beat, or verbal self-cueing can dramatically reduce freezing.",
      "LSVT BIG trains large-amplitude movements to counteract the bradykinesia and hypokinesia of PD.",
      "Time therapy and important activities during medication 'on' periods when motor function is optimal."
    ],
    examPitfalls: [
      "Not differentiating between on-medication and off-medication functional performance.",
      "Recommending a rolling walker for PD without considering festination risk — a walker with brakes is safer.",
      "Treating PD tremor as an action tremor rather than understanding it is a resting tremor that may decrease with purposeful movement."
    ],
    faqJson: [
      { question: "Why do external cues help with Parkinson's freezing?", answer: "External cues (visual lines, auditory rhythms, cognitive self-talk) activate cortical motor pathways that bypass the impaired basal ganglia, which normally provides internal cues for automatic movement initiation and sequencing." },
      { question: "What is LSVT BIG?", answer: "LSVT BIG is an intensive, amplitude-based exercise program for PD that trains exaggerated large movements. It recalibrates the patient's perception of movement amplitude, counteracting the hypokinesia (small movements) characteristic of PD." }
    ]
  },
  {
    slug: "guillain-barre-syndrome-ot",
    title: "Guillain-Barré Syndrome OT Rehabilitation",
    category: "Neurological Rehabilitation",
    seoTitle: "Guillain-Barré Syndrome OT — OT Encyclopedia",
    seoDescription: "OT rehabilitation for Guillain-Barré syndrome including acute care, recovery phases, and functional retraining.",
    seoKeywords: ["Guillain-Barré syndrome", "GBS", "peripheral neuropathy", "ascending paralysis", "OT rehabilitation", "NBCOT"],
    overview: "Guillain-Barré syndrome (GBS) is an acute inflammatory demyelinating polyneuropathy causing ascending weakness that can progress to paralysis. OTs provide intervention throughout the disease course from acute care (positioning, edema management, psychological support) through recovery (progressive strengthening, ADL retraining, sensory re-education) and community reintegration.",
    mechanismPhysiology: "GBS is an autoimmune attack on peripheral nerve myelin (AIDP subtype) or axons (AMAN subtype), usually triggered by a preceding infection. The immune response damages peripheral nerves, causing ascending weakness beginning in the distal lower extremities. Recovery follows nerve remyelination or regeneration, typically progressing from proximal to distal.",
    clinicalRelevance: "OTs adapt intervention to the disease phase. Acute/plateau phase: positioning, PROM, edema management, energy conservation, psychological support, and adaptive equipment. Recovery phase: progressive functional activities (graded by muscle strength), sensory re-education, ADL retraining, orthotic management, and return to occupational roles.",
    signsSymptoms: "Ascending symmetrical weakness (feet → legs → trunk → arms → face), paresthesias, areflexia, potential respiratory compromise, autonomic instability, pain, and fatigue. The nadir (lowest point) typically occurs 2-4 weeks after onset.",
    assessment: "Manual muscle testing (serial assessments to track recovery), sensory testing, AROM/PROM, ADL performance assessment, respiratory status awareness, pain assessment, fatigue assessment (Modified Fatigue Impact Scale), and psychosocial coping evaluation.",
    management: "Acute phase: gentle PROM (avoid overstretching weakened muscles), positioning (anti-deformity), edema management, energy conservation, communication aids if needed, and psychological support. Recovery phase: gentle active exercise progressing with muscle recovery (avoid fatigue-based overwork), sensory re-education, progressive ADL independence, orthotic management for residual weakness, and community reintegration.",
    complications: "Overwork weakness from exercising muscles below 3/5 strength too aggressively, contractures from immobilization, persistent fatigue, chronic pain, residual distal weakness, and psychological impact (anxiety, depression, PTSD).",
    clinicalPearls: [
      "Avoid overwork weakness — do not exercise muscles below 3/5 (fair) strength against resistance, as fatigued denervated muscles can sustain further damage.",
      "Recovery is typically proximal to distal — expect hand and foot function to recover last.",
      "Fatigue management is critical throughout recovery — GBS fatigue can persist for months to years after motor recovery."
    ],
    examPitfalls: [
      "Applying aggressive strengthening exercises during the acute phase or to muscles below 3/5 strength.",
      "Confusing GBS (peripheral, ascending, usually recoverable) with MS (central, variable pattern, chronic).",
      "Not addressing persistent fatigue as a long-term issue in GBS recovery."
    ],
    faqJson: [
      { question: "What is overwork weakness in GBS?", answer: "Overwork weakness occurs when weakened, denervated muscles are exercised too aggressively, causing further damage rather than strengthening. Muscles below 3/5 (fair) grade should not be exercised against resistance — only gentle active or active-assisted exercise is appropriate." },
      { question: "What is the typical recovery pattern for GBS?", answer: "GBS recovery is generally proximal to distal, with proximal muscles recovering first and hand/foot function recovering last. Most patients recover significantly, though recovery can take months to years and some have residual distal weakness." }
    ]
  },

  // ===== ADDITIONAL ERGONOMICS & WORK REHAB (4 entries) =====
  {
    slug: "work-hardening-conditioning",
    title: "Work Hardening and Work Conditioning",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Work Hardening and Conditioning OT — OT Encyclopedia",
    seoDescription: "OT work hardening and work conditioning programs for return to work after injury or illness.",
    seoKeywords: ["work hardening", "work conditioning", "return to work", "FCE", "vocational rehabilitation", "NBCOT"],
    overview: "Work hardening and work conditioning are structured, goal-oriented rehabilitation programs designed to restore an injured worker's physical and functional capacity for return to work. Work conditioning focuses on physical reconditioning (strength, endurance, flexibility). Work hardening is a more comprehensive, multidisciplinary program that also addresses behavioral, vocational, and psychosocial factors.",
    mechanismPhysiology: "After injury or prolonged absence from work, deconditioning occurs in the musculoskeletal, cardiovascular, and neuromuscular systems. Fear-avoidance beliefs and kinesiophobia can further limit functional capacity. Progressive, work-specific loading restores tissue tolerance and functional capacity while addressing psychological barriers to return to work.",
    clinicalRelevance: "OTs design and implement work simulation activities matched to the patient's job demands, progressively increase physical demands based on Functional Capacity Evaluation (FCE) results, address body mechanics and ergonomics, manage fear-avoidance behaviors, and coordinate with employers on transitional duty programs.",
    signsSymptoms: "Reduced physical capacity for job demands, deconditioning, fear of re-injury, pain with work-related activities, inability to sustain work endurance, and difficulty with specific job tasks identified through FCE.",
    assessment: "Functional Capacity Evaluation (FCE), job demands analysis, physical capacity measures (lifting, carrying, pushing, pulling, sustained postures), endurance assessment, pain behavior observation, and psychosocial screening (Fear-Avoidance Beliefs Questionnaire).",
    management: "Work conditioning: progressive cardiovascular conditioning, strengthening for job-specific muscle groups, flexibility training, and body mechanics education. Work hardening: all of the above plus work simulation activities, job-specific task training, behavioral and psychosocial support, vocational counseling, and employer communication for transitional duty planning.",
    complications: "Re-injury from progressing too quickly, symptom magnification, secondary gain issues, failed return to work, chronic pain development, and employer non-cooperation with modified duty.",
    clinicalPearls: [
      "Work hardening is multidisciplinary (OT + PT + psychology + vocational), while work conditioning is typically single-discipline focusing on physical reconditioning.",
      "FCE results guide work hardening/conditioning program design — match program demands to the gap between current capacity and job demands.",
      "Fear-avoidance beliefs are among the strongest predictors of delayed return to work — address psychological barriers alongside physical reconditioning."
    ],
    examPitfalls: [
      "Confusing work hardening (comprehensive, multidisciplinary) with work conditioning (physical only).",
      "Not using FCE and job demands analysis to guide program design.",
      "Ignoring psychosocial factors (fear-avoidance, secondary gain) that impede return to work."
    ],
    faqJson: [
      { question: "What is the difference between work hardening and work conditioning?", answer: "Work conditioning focuses on physical reconditioning (strength, endurance, flexibility) and is typically single-discipline. Work hardening is a comprehensive, multidisciplinary program addressing physical, behavioral, vocational, and psychosocial factors for return to work." },
      { question: "What is a Functional Capacity Evaluation?", answer: "An FCE is a comprehensive assessment of an individual's physical and functional abilities related to work demands, including lifting, carrying, pushing, pulling, sustained postures, and endurance. Results guide return-to-work planning and program design." }
    ]
  },
  {
    slug: "cumulative-trauma-disorders",
    title: "Cumulative Trauma Disorders and Repetitive Strain",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Cumulative Trauma Disorders OT — OT Encyclopedia",
    seoDescription: "OT management of cumulative trauma disorders and repetitive strain injuries in the workplace.",
    seoKeywords: ["cumulative trauma", "repetitive strain", "RSI", "ergonomics", "workplace injury", "NBCOT"],
    overview: "Cumulative trauma disorders (CTDs), also called repetitive strain injuries (RSIs), are musculoskeletal conditions caused by repetitive motion, sustained postures, forceful exertions, or vibration exposure in the workplace. Common CTDs include carpal tunnel syndrome, lateral epicondylitis, rotator cuff tendinopathy, and de Quervain's tenosynovitis. OTs address both treatment and prevention through ergonomic intervention.",
    mechanismPhysiology: "CTDs develop when repetitive mechanical stress exceeds tissue healing capacity. Cumulative microtrauma causes inflammation, fibrosis, and degenerative changes in tendons, muscles, nerves, and other soft tissues. Risk factors include repetition, force, awkward posture, vibration, contact stress, and inadequate recovery time. The dose-response relationship between exposure and injury is modulated by individual factors.",
    clinicalRelevance: "OTs manage CTDs through acute treatment (splinting, activity modification, modalities), ergonomic workstation assessment and modification, work practice training (body mechanics, microbreaks, task rotation), job modification recommendations, and injury prevention programs.",
    signsSymptoms: "Gradual onset of pain, numbness, tingling, or weakness related to work activities. Symptoms initially occur during work and resolve with rest, then progress to persistent symptoms. Common presentations include wrist/hand pain, elbow pain, shoulder pain, and neck pain related to repetitive work tasks.",
    assessment: "Ergonomic workstation analysis, job demands analysis, upper extremity physical examination, symptom provocation testing (specific to suspected CTD), DASH questionnaire, work-rest cycle observation, and risk factor identification (repetition, force, posture, vibration, duration).",
    management: "Acute: activity modification, splinting, ergonomic modifications. Chronic: comprehensive ergonomic intervention (workstation setup, tool modification, task rotation), stretching and strengthening programs, work practice training, microbreak schedules, job rotation planning, and return-to-work with modified duties.",
    complications: "Chronic pain and disability, surgical intervention if conservative management fails, job loss, workers' compensation issues, and spread of symptoms to other body regions.",
    clinicalPearls: [
      "The ergonomic triad of risk factors: repetition + force + awkward posture — reducing any one factor can break the injury cycle.",
      "Microbreaks (30-60 seconds every 20-30 minutes) are more effective than longer, less frequent breaks for preventing CTDs.",
      "Neutral wrist position and keyboard/mouse at elbow height are fundamental ergonomic principles for computer workstations."
    ],
    examPitfalls: [
      "Treating the acute symptoms without addressing the ergonomic root cause of the CTD.",
      "Recommending only rest and splinting without workplace modification — symptoms will recur.",
      "Not considering the interaction of multiple risk factors (repetition + force + posture)."
    ],
    faqJson: [
      { question: "What are microbreaks?", answer: "Microbreaks are brief rest periods (30-60 seconds) taken every 20-30 minutes during repetitive work. They include stretching, position changes, and eye rest. Research shows frequent short breaks are more effective than infrequent longer breaks for preventing CTDs." },
      { question: "What is neutral wrist position and why does it matter?", answer: "Neutral wrist position means the wrist is neither flexed, extended, nor deviated — straight and in line with the forearm. This position minimizes carpal tunnel pressure and tendon friction, reducing risk of CTS and tendinopathy." }
    ]
  },
  {
    slug: "ergonomic-workstation-assessment",
    title: "Ergonomic Workstation Assessment",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Ergonomic Workstation Assessment OT — OT Encyclopedia",
    seoDescription: "OT ergonomic workstation assessment and modification for office and computer workstations.",
    seoKeywords: ["ergonomic assessment", "workstation setup", "computer ergonomics", "office ergonomics", "NBCOT"],
    overview: "Ergonomic workstation assessment is a core OT competency in work rehabilitation. OTs evaluate the fit between the worker and their workstation, identify risk factors for musculoskeletal disorders, and recommend modifications to optimize posture, reduce physical stress, and enhance productivity. This includes computer/office workstations, industrial workstations, and standing/sit-stand configurations.",
    mechanismPhysiology: "Poor ergonomic design creates sustained awkward postures, excessive reaching, repetitive motions, and contact stress that increase musculoskeletal injury risk. Optimal ergonomic setup maintains neutral body positions, minimizes static loading, reduces repetitive stress, and promotes frequent posture changes.",
    clinicalRelevance: "OTs conduct comprehensive workstation evaluations assessing chair, desk, monitor, keyboard, mouse, lighting, and accessory placement. Recommendations address anthropometric fit, task requirements, individual health conditions, and environmental factors. OTs also provide training on posture, work habits, and stretching programs.",
    signsSymptoms: "Neck and shoulder tension, low back pain, wrist and forearm discomfort, eye strain, headaches, and fatigue related to sustained work postures. Symptoms typically worsen throughout the workday and improve on days off.",
    assessment: "Systematic workstation evaluation: chair height and adjustability, desk height and work surface area, monitor position (height, distance, angle), keyboard and mouse placement, document holder use, lighting (glare, task lighting), telephone use, accessory positioning, and observation of work postures and habits.",
    management: "Chair adjustment (seat height for 90° knee angle, lumbar support, armrest height), monitor placement (top at eye level, arm's length distance), keyboard and mouse at elbow height with neutral wrist position, document holder adjacent to monitor, anti-glare measures, sit-stand desk options, and work habit training (microbreaks, posture variation, stretching).",
    complications: "Resistance to workstation changes, cost barriers for equipment, failure to maintain ergonomic setup over time, and multi-user workstations requiring individual adjustments.",
    clinicalPearls: [
      "The 90-90-90 rule: hips, knees, and elbows at approximately 90° with feet flat on the floor — the foundation of seated ergonomics.",
      "Monitor top should be at eye level and arm's length away — prevents cervical flexion and eye strain.",
      "A sit-stand desk does not fix ergonomic problems — proper setup in both positions is essential."
    ],
    examPitfalls: [
      "Recommending a standing desk without addressing ergonomic setup in the standing position.",
      "Focusing only on furniture without assessing work habits, task demands, and breaks.",
      "Not adjusting recommendations for the individual's anthropometrics and specific condition."
    ],
    faqJson: [
      { question: "What is the 90-90-90 rule in ergonomics?", answer: "The 90-90-90 rule positions the hips, knees, and elbows at approximately 90-degree angles when seated at a workstation. Feet should be flat on the floor (or footrest), with the seat supporting the thighs and the desk at elbow height." },
      { question: "Where should a computer monitor be positioned?", answer: "The top of the monitor should be at or slightly below eye level, with the screen approximately arm's length (20-26 inches) away. The monitor should be directly in front, not offset, to prevent cervical rotation." }
    ]
  },
  {
    slug: "job-demands-analysis",
    title: "Job Demands Analysis in OT",
    category: "Ergonomics & Work Rehabilitation",
    seoTitle: "Job Demands Analysis OT — OT Encyclopedia",
    seoDescription: "OT job demands analysis methodology for return to work planning and workplace accommodation.",
    seoKeywords: ["job demands analysis", "JDA", "job analysis", "physical demands", "return to work", "NBCOT"],
    overview: "A job demands analysis (JDA) is a systematic evaluation of the physical, cognitive, and environmental demands of a specific job. OTs conduct JDAs to inform return-to-work planning, guide work hardening programs, identify accommodation needs, and support disability determination. The JDA documents essential and marginal job functions per ADA requirements.",
    mechanismPhysiology: "The JDA quantifies the frequency, duration, and intensity of physical demands (lifting, carrying, pushing, pulling, sustained postures), cognitive demands (attention, memory, decision-making), and environmental conditions (temperature, noise, lighting) required by a specific job. This objective data supports clinical decision-making for return to work.",
    clinicalRelevance: "OTs use JDAs to compare a worker's functional capacity (from FCE) with job demands, identify specific work limitations, develop transitional duty plans, recommend workplace accommodations, guide work hardening program design, and provide expert opinions for disability and workers' compensation cases.",
    signsSymptoms: "A JDA is indicated when a worker has functional limitations that may affect job performance, when planning return to work after injury/illness, when workplace accommodations are needed, or when disability determination requires objective job demand documentation.",
    assessment: "On-site job observation, worker and supervisor interviews, measurement of forces and weights, analysis of postures and motions using standardized methodology (DOL Physical Demands categories), task-by-task breakdown, essential vs. marginal function determination, and environmental condition documentation.",
    management: "The completed JDA informs: return-to-work decision-making, transitional/modified duty development, workplace accommodation recommendations, work hardening program design, ergonomic modification priorities, and disability determination support. Follow-up includes job modification implementation and monitoring.",
    complications: "Employer resistance to workplace modifications, discrepancies between stated and actual job demands, worker reluctance to disclose limitations, and legal/workers' compensation complexities.",
    clinicalPearls: [
      "Always observe the actual job being performed — job descriptions often do not accurately reflect physical demands.",
      "Document both essential (required) and marginal (occasional, reassignable) job functions per ADA guidelines.",
      "Compare JDA demands directly with FCE results to identify the specific gap between capacity and demand."
    ],
    examPitfalls: [
      "Relying on job descriptions or worker self-report alone without on-site observation.",
      "Not distinguishing between essential and marginal job functions as defined by the ADA.",
      "Failing to quantify demands objectively (using DOL categories: sedentary, light, medium, heavy, very heavy)."
    ],
    faqJson: [
      { question: "What are the DOL physical demand categories?", answer: "The Department of Labor classifies physical demands as Sedentary (lift up to 10 lbs), Light (up to 20 lbs), Medium (up to 50 lbs), Heavy (up to 100 lbs), and Very Heavy (over 100 lbs), based on the maximum and frequent lifting requirements of a job." },
      { question: "What is the difference between essential and marginal job functions?", answer: "Essential functions are the fundamental duties that must be performed (with or without accommodation) to hold the position. Marginal functions are peripheral tasks that could be reassigned or eliminated. This distinction is critical for ADA accommodation decisions." }
    ]
  },

  // ===== ADDITIONAL MENTAL HEALTH OT (4 entries) =====
  {
    slug: "motivational-interviewing-ot",
    title: "Motivational Interviewing in OT",
    category: "Mental Health OT",
    seoTitle: "Motivational Interviewing in OT — OT Encyclopedia",
    seoDescription: "Application of motivational interviewing techniques in occupational therapy practice for behavior change.",
    seoKeywords: ["motivational interviewing", "MI", "behavior change", "OARS", "stages of change", "NBCOT"],
    overview: "Motivational Interviewing (MI) is a client-centered, directive counseling approach used by OTs to enhance intrinsic motivation for behavior change. MI is particularly effective for clients with ambivalence about rehabilitation goals, lifestyle modifications, medication adherence, and health behavior change. OTs integrate MI techniques within therapeutic relationships across all practice settings.",
    mechanismPhysiology: "MI works by exploring and resolving ambivalence about change. Through empathic, non-judgmental dialogue, the clinician elicits the client's own motivations for change (change talk) rather than imposing external motivation. This approach aligns with self-determination theory — people are more likely to change when they feel autonomous, competent, and connected.",
    clinicalRelevance: "OTs use MI across practice settings: mental health (substance use, medication adherence), rehabilitation (exercise compliance, home program follow-through), geriatrics (fall prevention behavior change), pediatrics (parent engagement), and chronic disease management (diabetes self-management, weight management).",
    signsSymptoms: "Indicators for MI use include ambivalence about treatment goals, non-adherence to home programs, resistance to recommended lifestyle changes, inconsistent follow-through with therapy recommendations, and expressed desire to change but difficulty initiating action.",
    assessment: "Assessment of readiness for change (Stages of Change model: precontemplation, contemplation, preparation, action, maintenance), identification of ambivalence, exploration of the client's values and goals, and assessment of self-efficacy for change.",
    management: "Core MI skills (OARS): Open-ended questions, Affirmations, Reflective listening, Summarizing. MI spirit: partnership, acceptance, compassion, evocation. Key techniques: eliciting change talk, rolling with resistance (avoiding argumentation), developing discrepancy between current behavior and stated values, and supporting self-efficacy.",
    complications: "Therapist drift from MI principles into advice-giving or confrontation, client frustration if MI is perceived as avoidant, and time constraints in busy clinical settings.",
    clinicalPearls: [
      "OARS is the foundation of MI: Open-ended questions, Affirmations, Reflective listening, and Summarizing.",
      "The righting reflex (the urge to fix or advise) is the biggest barrier to effective MI — resist the urge to prescribe solutions.",
      "MI is most effective during the contemplation and preparation stages of change — match your approach to the client's readiness."
    ],
    examPitfalls: [
      "Using MI techniques while simultaneously arguing for change — this is a contradiction of MI principles.",
      "Applying MI when the client is already in the action stage and needs practical support rather than motivational exploration.",
      "Confusing MI with general empathic listening — MI is directive toward exploring and resolving ambivalence."
    ],
    faqJson: [
      { question: "What does OARS stand for in MI?", answer: "OARS represents the four core MI skills: Open-ended questions (encourage elaboration), Affirmations (acknowledge strengths and efforts), Reflective listening (demonstrate understanding), and Summarizing (collect and reflect back key points)." },
      { question: "What is change talk?", answer: "Change talk is any client statement that favors movement toward change, including desire ('I want to'), ability ('I can'), reasons ('because'), need ('I need to'), commitment ('I will'), and taking steps ('I started'). MI aims to elicit and reinforce change talk." }
    ]
  },
  {
    slug: "trauma-informed-care-ot",
    title: "Trauma-Informed Care in OT",
    category: "Mental Health OT",
    seoTitle: "Trauma-Informed Care OT — OT Encyclopedia",
    seoDescription: "Principles of trauma-informed care in occupational therapy practice across all settings.",
    seoKeywords: ["trauma-informed care", "TIC", "adverse childhood experiences", "ACEs", "mental health OT", "NBCOT"],
    overview: "Trauma-informed care (TIC) is an organizational and clinical framework that recognizes the widespread impact of trauma, understands potential paths for recovery, recognizes signs and symptoms of trauma in clients, and integrates knowledge about trauma into policies, procedures, and practices. OTs apply TIC principles across all settings — not only mental health.",
    mechanismPhysiology: "Trauma exposure (physical, sexual, emotional abuse; neglect; domestic violence; community violence; medical trauma) activates the stress response system, potentially causing long-term changes in the HPA axis, autonomic nervous system, and brain structure/function. Adverse Childhood Experiences (ACEs) are linked to increased risk of chronic disease, mental illness, and substance use in adulthood.",
    clinicalRelevance: "OTs apply TIC by creating physically and emotionally safe environments, ensuring client choice and control in therapy, using collaborative approaches, being aware of potential trauma triggers in OT activities (touch, positioning, personal care), and understanding how trauma impacts occupational engagement.",
    signsSymptoms: "Trauma responses that may present in OT include hypervigilance, startle responses, avoidance of certain activities or touch, difficulty with trust and therapeutic rapport, dissociation during therapy, emotional dysregulation, and re-traumatization from clinical procedures that echo past trauma.",
    assessment: "Universal screening for trauma history (ACE questionnaire, Brief Trauma Questionnaire), observation of trauma responses during OT activities, assessment of safety needs, identification of triggers, and evaluation of coping strategies. Note: detailed trauma processing is outside OT scope — refer to mental health specialists.",
    management: "Six key TIC principles (SAMHSA): safety, trustworthiness and transparency, peer support, collaboration and mutuality, empowerment and choice, and cultural/historical/gender issues. OT-specific applications: ask permission before touch, explain procedures before performing them, provide choices within treatment, create predictable routines, modify sensory environment, avoid re-traumatizing activities, and support development of healthy coping occupations.",
    complications: "Vicarious trauma and burnout in clinicians, inadvertent re-traumatization through insensitive practices, and difficulty engaging trauma survivors in therapy.",
    clinicalPearls: [
      "Always ask permission before touching a client — this simple practice prevents re-traumatization and builds trust.",
      "TIC is a universal approach for all clients, not just those with known trauma histories — you cannot always identify who has experienced trauma.",
      "OTs should focus on building coping skills and occupational engagement, not trauma processing — refer to mental health specialists for trauma-specific therapy."
    ],
    examPitfalls: [
      "Assuming TIC is only relevant in mental health settings — trauma impacts clients across all practice areas.",
      "Attempting trauma processing (trauma-focused therapy) which is outside OT scope of practice.",
      "Not recognizing that standard OT procedures (undressing for bathing, positioning, restraint) can be triggering for trauma survivors."
    ],
    faqJson: [
      { question: "What are the six principles of trauma-informed care?", answer: "SAMHSA's six TIC principles are: safety, trustworthiness and transparency, peer support, collaboration and mutuality, empowerment/voice/choice, and cultural/historical/gender issues. These guide organizational culture and clinical practice." },
      { question: "What are ACEs?", answer: "Adverse Childhood Experiences are potentially traumatic events occurring before age 18, including abuse, neglect, and household dysfunction. The original ACE study linked higher ACE scores to increased risk of chronic disease, mental illness, and premature mortality in adulthood." }
    ]
  },
  {
    slug: "stress-management-ot",
    title: "Stress Management Interventions in OT",
    category: "Mental Health OT",
    seoTitle: "Stress Management OT — OT Encyclopedia",
    seoDescription: "OT stress management interventions including relaxation techniques, lifestyle redesign, and coping strategies.",
    seoKeywords: ["stress management", "relaxation techniques", "coping strategies", "lifestyle redesign", "mental health OT", "NBCOT"],
    overview: "Stress management is a fundamental OT intervention across all practice settings. OTs teach relaxation techniques, help clients identify and modify stress-producing occupational patterns, develop healthy coping strategies, and facilitate lifestyle balance. The Lifestyle Redesign program, developed by USC, demonstrates the effectiveness of occupation-based stress management.",
    mechanismPhysiology: "Chronic stress activates the sympathetic nervous system and HPA axis, producing sustained cortisol elevation, inflammatory responses, and allostatic load. This increases risk for cardiovascular disease, immune dysfunction, mental health disorders, and chronic pain. Relaxation techniques activate the parasympathetic nervous system (relaxation response), reducing physiological stress markers.",
    clinicalRelevance: "OTs address stress through multiple approaches: teaching relaxation techniques (progressive muscle relaxation, diaphragmatic breathing, guided imagery, mindfulness), analyzing occupational balance, modifying stressful routines, developing healthy leisure occupations, time management training, and assertiveness skills.",
    signsSymptoms: "Physical manifestations (muscle tension, headaches, GI distress, insomnia, fatigue), emotional manifestations (anxiety, irritability, overwhelm), cognitive manifestations (difficulty concentrating, racing thoughts, indecisiveness), and behavioral manifestations (social withdrawal, substance use, occupational imbalance).",
    assessment: "Perceived Stress Scale (PSS), occupational balance assessment, time-use diary analysis, identification of stress triggers and coping patterns, relaxation skill assessment, leisure participation evaluation, and Role Checklist for occupational role balance.",
    management: "Relaxation training: progressive muscle relaxation (PMR), diaphragmatic breathing, guided imagery, mindfulness meditation, yoga and tai chi. Occupational strategies: activity scheduling, time management, occupational balance (work-rest-play-sleep), Lifestyle Redesign program, healthy leisure development, assertiveness training, cognitive restructuring of stress appraisals, and social support building.",
    complications: "Relaxation-induced anxiety (paradoxical response in some individuals), difficulty maintaining practice without structure, and underlying mental health conditions requiring referral.",
    clinicalPearls: [
      "Progressive muscle relaxation (PMR) is one of the most evidence-based and easily taught relaxation techniques — alternating tension and release of muscle groups.",
      "Occupational balance (balanced allocation of time across work, self-care, leisure, and rest) is a uniquely OT contribution to stress management.",
      "The USC Lifestyle Redesign program has strong evidence for improving health outcomes through occupation-based lifestyle modification."
    ],
    examPitfalls: [
      "Teaching only relaxation techniques without addressing the occupational patterns and lifestyle factors contributing to stress.",
      "Not screening for clinical anxiety or depression that may require referral beyond stress management.",
      "Assuming all clients benefit from the same relaxation technique — individualize based on preference and response."
    ],
    faqJson: [
      { question: "What is progressive muscle relaxation?", answer: "PMR is a relaxation technique involving systematic tensing (5-7 seconds) then releasing (20-30 seconds) of major muscle groups. The contrast between tension and relaxation teaches body awareness and promotes parasympathetic activation." },
      { question: "What is the Lifestyle Redesign program?", answer: "Lifestyle Redesign, developed at USC, is an evidence-based OT program using occupation-based strategies to modify health behaviors, improve occupational balance, and reduce chronic disease risk through meaningful lifestyle changes." }
    ]
  },
  {
    slug: "group-therapy-ot",
    title: "Group Therapy in Occupational Therapy",
    category: "Mental Health OT",
    seoTitle: "Group Therapy in OT — OT Encyclopedia",
    seoDescription: "OT group therapy models, leadership styles, and group dynamics for mental health and rehabilitation settings.",
    seoKeywords: ["group therapy OT", "group dynamics", "therapeutic groups", "group leadership", "mental health", "NBCOT"],
    overview: "Group therapy is a widely used modality in OT, particularly in mental health, but applicable across all settings. OTs lead various types of groups (task groups, psychoeducational groups, support groups, activity groups) using knowledge of group dynamics, therapeutic factors, and leadership styles to promote social participation, skill development, and occupational engagement.",
    mechanismPhysiology: "Yalom's therapeutic factors explain how groups facilitate change: instillation of hope, universality (knowing others share similar challenges), altruism, socialization, imitative behavior, catharsis, group cohesiveness, existential factors, interpersonal learning, and corrective emotional experiences. Groups provide a social microcosm where interpersonal patterns can be observed and modified.",
    clinicalRelevance: "OTs design and lead groups targeting specific skills: social skills, life skills (cooking, budgeting, time management), stress management, leisure exploration, work readiness, expressive arts, community integration, and caregiver support. Group selection, composition, and structure are based on members' cognitive, social, and functional levels.",
    signsSymptoms: "Indications for group therapy include social isolation, difficulty with interpersonal skills, need for peer support, skill development needs that benefit from group context, and cost-effective service delivery requirements.",
    assessment: "Pre-group assessment of members' cognitive level, social skills, group readiness, safety considerations, and goals. During group: observation of participation, interpersonal behavior, task engagement, and role performance. Post-group: outcomes measurement, member feedback, and documentation.",
    management: "Group planning: purpose and goals, member selection and composition, size (typically 5-8 members), format (open vs. closed), duration and frequency. Leadership styles: directive (structured, leader-guided), facilitative (member-directed with leader support), advisory (consultation role). Group structure: warm-up activity, main activity, processing/discussion, wrap-up. Documentation of group goals, activities, and member participation.",
    complications: "Monopolizing members, scapegoating, group conflict, premature termination, confidentiality breaches, and managing members at different functional levels within the same group.",
    clinicalPearls: [
      "Cole's Seven Steps provide a structured format for OT groups: introduction, activity, sharing, processing, generalizing, application, and summary.",
      "Match group leadership style to members' cognitive level — directive for lower-functioning, facilitative for higher-functioning groups.",
      "Yalom's therapeutic factors, especially universality and group cohesiveness, are powerful mechanisms for change in OT groups."
    ],
    examPitfalls: [
      "Using a facilitative leadership style with a low-functioning group that needs directive structure.",
      "Not planning for group composition — mixing members with widely different cognitive or functional levels.",
      "Focusing only on the activity without processing the therapeutic meaning and applying learning to daily life."
    ],
    faqJson: [
      { question: "What are Cole's Seven Steps for OT groups?", answer: "Cole's Seven Steps provide a structured group format: 1) Introduction (purpose, warm-up), 2) Activity, 3) Sharing (members discuss experience), 4) Processing (explore feelings and interactions), 5) Generalizing (identify common themes), 6) Application (connect to daily life), 7) Summary (review and closure)." },
      { question: "What is the ideal size for an OT therapy group?", answer: "Most OT groups function best with 5-8 members, depending on the population and purpose. Smaller groups (3-5) are appropriate for lower-functioning or higher-acuity members. Larger groups (8-12) can work for psychoeducational or activity-based formats." }
    ]
  },

  // ===== ADDITIONAL SPLINTING & ORTHOTICS (3 entries) =====
  {
    slug: "resting-hand-splint",
    title: "Resting Hand Splint Fabrication",
    category: "Splinting & Orthotics",
    seoTitle: "Resting Hand Splint OT — OT Encyclopedia",
    seoDescription: "OT guide to resting hand splint fabrication, indications, and positioning for upper extremity rehabilitation.",
    seoKeywords: ["resting hand splint", "functional position", "thermoplastic splinting", "hand splint", "NBCOT"],
    overview: "The resting hand splint (also called a resting pan splint) positions the hand and wrist in a functional resting position to prevent contracture, reduce pain, protect healing structures, and maintain tissue length. It is one of the most commonly fabricated orthoses in OT practice and is indicated for conditions including stroke, burns, rheumatoid arthritis, peripheral nerve injury, and post-surgical immobilization.",
    mechanismPhysiology: "The resting hand splint positions the wrist in 10-20° extension, MCPs in 45° flexion, IPs in slight flexion, and the thumb in palmar abduction. This position maintains the collateral ligaments at maximal length, prevents shortening of the intrinsic muscles, and preserves the web space — optimizing the hand for future functional recovery.",
    clinicalRelevance: "OTs fabricate custom resting hand splints from low-temperature thermoplastic materials, ensuring proper positioning, comfortable fit, and appropriate wear schedules. Patient education on donning/doffing, skin care, and wear schedule compliance is essential for successful outcomes.",
    signsSymptoms: "Indications include spastic hemiplegia with developing hand contracture, rheumatoid arthritis with joint inflammation, peripheral nerve injury requiring positioning, burns to the dorsal hand, post-tendon repair immobilization, and pain management.",
    assessment: "Assessment of joint ROM, muscle tone, edema, skin integrity, sensation, and specific positioning needs based on diagnosis. Measurement of hand dimensions for splint fabrication and identification of bony prominences requiring padding.",
    management: "Fabrication from low-temperature thermoplastic material, molded directly on the patient's hand in the functional resting position. Strapping at the forearm, wrist, and fingers. Wear schedule varies by indication (typically nighttime for contracture prevention, continuous for acute injury). Regular follow-up for fit adjustment, skin monitoring, and position verification.",
    complications: "Pressure areas over bony prominences, skin maceration, improper positioning leading to contracture, patient non-compliance, and splint-induced stiffness if ROM exercises are not performed.",
    clinicalPearls: [
      "The safe position (anti-deformity position): wrist extension 10-20°, MCP flexion 70-90°, IP extension, thumb abduction — used for edema/burns to prevent contracture.",
      "The resting position (functional position): wrist extension 10-20°, MCP flexion 45°, IP slight flexion, thumb palmar abduction — used for comfort and rest.",
      "Always check two-point discrimination and skin color after splint application to ensure no neurovascular compromise."
    ],
    examPitfalls: [
      "Confusing the safe position (MCPs at 70-90° flexion for anti-deformity) with the resting position (MCPs at 45° flexion for comfort).",
      "Positioning the wrist in flexion rather than extension in a resting hand splint.",
      "Not educating the patient on skin checks and ROM exercises during splint wear."
    ],
    faqJson: [
      { question: "What is the difference between safe position and resting position?", answer: "The safe (anti-deformity) position places MCPs at 70-90° flexion and IPs in extension to maximize collateral ligament length — used for burns and edema. The resting (functional) position places MCPs at 45° flexion with slight IP flexion for comfort — used for pain and rest." },
      { question: "How long should a resting hand splint be worn?", answer: "Wear schedule depends on the indication: nighttime only for mild contracture prevention, continuous with removal for exercises in acute conditions, and gradual weaning as the condition improves. Always include ROM exercises during splint-free periods." }
    ]
  },
  {
    slug: "wrist-cock-up-splint",
    title: "Wrist Cock-Up Splint (Wrist Extension Orthosis)",
    category: "Splinting & Orthotics",
    seoTitle: "Wrist Cock-Up Splint OT — OT Encyclopedia",
    seoDescription: "OT fabrication and application of wrist cock-up splints for wrist support and pain management.",
    seoKeywords: ["wrist cock-up splint", "wrist extension orthosis", "wrist support", "tendinitis", "NBCOT"],
    overview: "The wrist cock-up splint (wrist extension orthosis) is the most commonly prescribed upper extremity orthosis. It immobilizes the wrist while allowing full finger and thumb motion. Indications include carpal tunnel syndrome, wrist tendinitis, rheumatoid arthritis, wrist sprains, and post-fracture support. The splint can be volar, dorsal, or circumferential design.",
    mechanismPhysiology: "Wrist immobilization in slight extension (15-30°) reduces stress on the carpal tunnel, inflamed tendons, and healing fractures. By stabilizing the wrist, the splint allows the extrinsic finger flexors and extensors to function more efficiently, often improving grip strength. The wrist position can be adjusted based on the specific diagnosis.",
    clinicalRelevance: "OTs fabricate custom wrist cock-up splints from thermoplastic materials or recommend prefabricated options. Volar designs are most common and provide the best support. Dorsal designs allow palmar sensation and are preferred for tasks requiring tactile feedback. The splint extends two-thirds of the forearm length for adequate leverage.",
    signsSymptoms: "Indications include wrist pain with activity, carpal tunnel syndrome (neutral position), tendinitis (rest position), post-fracture immobilization, and wrist instability requiring external support during functional activities.",
    assessment: "Wrist ROM and pain assessment, grip strength with and without splinting, diagnosis-specific positioning requirements, functional needs assessment (work demands, ADL requirements), and measurement for custom fabrication.",
    management: "Custom fabrication: two-thirds forearm length, wrist positioned per diagnosis (neutral for CTS, 15-30° extension for tendinitis, per surgeon protocol for fractures). Volar or dorsal design based on functional needs. Proper fit allowing full MCP, IP, and thumb motion. Wear schedule education and activity modification guidance.",
    complications: "Thumb web space restriction if splint extends too far radially, MCP motion restriction from excessive distal extension, skin irritation, and wrist stiffness from prolonged immobilization without ROM exercises.",
    clinicalPearls: [
      "The splint should be two-thirds the length of the forearm for adequate support — too short provides insufficient immobilization.",
      "Volar splints provide more support but limit palmar sensation; dorsal splints preserve sensation for functional tasks.",
      "For CTS, position the wrist in neutral (0°); for tendinitis, position in 15-30° extension."
    ],
    examPitfalls: [
      "Extending the splint past the distal palmar crease, restricting MCP flexion.",
      "Making the splint too narrow, restricting thumb motion or causing pressure on the ulnar styloid.",
      "Not differentiating wrist position based on diagnosis (neutral for CTS vs. extension for tendinitis)."
    ],
    faqJson: [
      { question: "How long should a wrist cock-up splint be?", answer: "The splint should extend two-thirds the length of the forearm from the wrist crease. Distally, it should end at the distal palmar crease to allow full MCP flexion, and should not restrict thumb motion." },
      { question: "When should a dorsal vs. volar design be used?", answer: "Volar designs provide more support and are standard for most conditions. Dorsal designs preserve palmar sensation and are preferred when tactile feedback is important for work or ADL tasks, such as cooking or manual work." }
    ]
  },
  {
    slug: "dynamic-splinting-ot",
    title: "Dynamic Splinting in OT",
    category: "Splinting & Orthotics",
    seoTitle: "Dynamic Splinting OT — OT Encyclopedia",
    seoDescription: "OT guide to dynamic splinting principles, indications, and applications for mobilization and functional support.",
    seoKeywords: ["dynamic splint", "mobilization splint", "outrigger", "spring splint", "hand therapy", "NBCOT"],
    overview: "Dynamic splints apply a continuous, gentle mobilizing force to a joint or tissue using rubber bands, springs, or elastic components attached to an outrigger or base. They are used to increase passive ROM, substitute for weak muscles, or provide controlled motion after tendon repair. Dynamic splints are a hallmark of hand therapy practice.",
    mechanismPhysiology: "Dynamic splints apply low-load, prolonged stress (LLPS) to contracted or stiff tissues, promoting tissue remodeling through creep (gradual elongation under sustained load) and stress relaxation (decreased resistance over time). The viscoelastic properties of connective tissue respond better to sustained gentle forces than to brief forceful stretching.",
    clinicalRelevance: "OTs fabricate and adjust dynamic splints for joint contracture mobilization, tendon repair protocols (dynamic extension following flexor tendon repair), nerve palsy substitution (radial nerve palsy wrist extension assist), and post-surgical mobilization. The angle of pull, force magnitude, and wear schedule are critical for effectiveness and safety.",
    signsSymptoms: "Indications include joint stiffness and contracture (PIP, MCP), flexor tendon repair requiring controlled motion, extensor tendon repair, nerve palsy with loss of muscle function, and post-fracture or post-surgical joint mobilization.",
    assessment: "Goniometric measurement of active and passive ROM, end-feel assessment, tissue tolerance, identification of limiting structures (joint capsule, tendon adhesions, muscle shortening), and patient ability to manage the splint independently.",
    management: "Fabrication principles: the mobilizing force (rubber band, spring) must pull perpendicular (90°) to the bone segment being mobilized for maximum efficiency. Outrigger height and placement determine the angle of pull. Force should be gentle enough to tolerate for extended periods (typically 6-8 hours/day). Serial adjustment as ROM improves. Patient education on application, care, and monitoring for complications.",
    complications: "Excessive force causing inflammation and setback, pressure areas from outrigger or base, incorrect angle of pull reducing effectiveness, patient non-compliance due to complexity, and tendon rupture if used inappropriately after repair.",
    clinicalPearls: [
      "The 90-degree angle of pull rule: the mobilizing force must be perpendicular to the bone being moved — adjust outrigger height as ROM changes.",
      "Low-load, prolonged stress (LLPS) is more effective than high-load, brief stress for tissue remodeling — gentle force over hours, not strong force for minutes.",
      "For flexor tendon repair, dynamic extension splinting allows controlled passive flexion and active extension within safe limits."
    ],
    examPitfalls: [
      "Not maintaining 90° angle of pull as ROM improves — the outrigger must be adjusted.",
      "Applying too much force (should be comfortable enough for extended wear) — if the patient removes the splint due to pain, the dose is too high.",
      "Confusing dynamic splinting (mobilizing force) with static progressive splinting (adjustable static hold at end range)."
    ],
    faqJson: [
      { question: "What is the 90-degree angle of pull rule?", answer: "The mobilizing force (rubber band or spring) must pull at 90 degrees to the bone segment being mobilized for maximum rotational efficiency. As ROM improves and the joint position changes, the outrigger must be adjusted to maintain this 90-degree angle." },
      { question: "How does dynamic splinting differ from static progressive splinting?", answer: "Dynamic splints apply a continuous gentle force via elastic components (rubber bands, springs). Static progressive splints use non-elastic components (turnbuckle, screws) that are incrementally adjusted to hold the joint at end-range. Both use LLPS principles but with different mechanisms." }
    ]
  },

  // ===== ADDITIONAL SENSORY INTEGRATION (3 entries) =====
  {
    slug: "sensory-modulation-disorder",
    title: "Sensory Modulation Disorder",
    category: "Sensory Integration",
    seoTitle: "Sensory Modulation Disorder OT — OT Encyclopedia",
    seoDescription: "OT assessment and intervention for sensory modulation disorder including over-responsivity, under-responsivity, and sensory seeking.",
    seoKeywords: ["sensory modulation", "sensory over-responsivity", "sensory under-responsivity", "sensory seeking", "NBCOT"],
    overview: "Sensory modulation disorder (SMD) is a subtype of sensory processing disorder characterized by difficulty regulating responses to sensory input in proportion to the stimulus. Three subtypes exist: sensory over-responsivity (SOR), sensory under-responsivity (SUR), and sensory seeking/craving. OTs assess sensory modulation patterns and develop individualized sensory strategies to support participation in daily activities.",
    mechanismPhysiology: "Sensory modulation involves CNS processes that regulate the neural threshold for responding to sensory input. Over-responsivity reflects a low neurological threshold (responds too easily), under-responsivity reflects a high threshold (requires more input to respond), and sensory seeking involves an active strategy to obtain more sensory input. These patterns reflect differences in habituation and sensitization processes.",
    clinicalRelevance: "OTs identify sensory modulation patterns through standardized assessments and clinical observation, then develop individualized sensory strategies. Over-responsive children may benefit from predictable, calming input. Under-responsive children may need alerting input and environmental modifications. Sensory seekers benefit from structured sensory opportunities throughout the day.",
    signsSymptoms: "SOR: distress with light touch, loud sounds, bright lights, certain textures; avoidance; anxiety; meltdowns. SUR: delayed response to pain, appears lethargic, misses environmental cues, reduced body awareness. Sensory seeking: constant movement, touching everything, crashing into objects, mouthing objects, seeking intense input.",
    assessment: "Sensory Profile-2 (caregiver and teacher questionnaires), Sensory Processing Measure (SPM), clinical observation during structured and free play, sensory history interview, and observation of sensory responses across environments.",
    management: "SOR: gradual desensitization, predictable routines, preparation for sensory experiences, calming strategies (deep pressure, rhythmic input), environmental modifications (noise-canceling headphones, sunglasses). SUR: alerting input (cold, vibration, rapid movement), environmental enhancements, increased sensory salience. Sensory seeking: scheduled sensory breaks, heavy work activities, structured movement opportunities, and sensory-rich environments with boundaries.",
    complications: "Social participation limitations, anxiety and behavioral issues, school avoidance, sleep difficulties, feeding selectivity, and family stress.",
    clinicalPearls: [
      "Deep pressure input (weighted blankets, compression clothing, firm touch) is generally calming for over-responsive individuals — light touch is often aversive.",
      "Sensory seeking is an active coping strategy, not 'bad behavior' — provide structured sensory opportunities rather than punishing the seeking behavior.",
      "Sensory modulation patterns can fluctuate with fatigue, illness, stress, and hunger — assess across multiple conditions."
    ],
    examPitfalls: [
      "Applying the same sensory strategies to all subtypes without differentiating over-responsive, under-responsive, and seeking patterns.",
      "Using light touch with a tactile over-responsive child — this is more aversive than firm touch.",
      "Assuming sensory modulation patterns are fixed — they fluctuate with physiological and emotional state."
    ],
    faqJson: [
      { question: "What is the difference between sensory over-responsivity and sensory seeking?", answer: "Over-responsivity involves a low neurological threshold where the nervous system reacts too easily to sensory input, causing distress and avoidance. Sensory seeking involves an active drive to obtain more intense sensory input, often through movement, touch, and physical activity." },
      { question: "Why is deep pressure calming for over-responsive individuals?", answer: "Deep pressure activates the proprioceptive system, which has an organizing effect on the nervous system, promoting parasympathetic activation and reducing sympathetic arousal. It is processed differently than light touch, which activates protective responses." }
    ]
  },
  {
    slug: "interoception-ot",
    title: "Interoception and OT",
    category: "Sensory Integration",
    seoTitle: "Interoception in OT — OT Encyclopedia",
    seoDescription: "Understanding interoception as the eighth sense and its role in OT assessment and intervention.",
    seoKeywords: ["interoception", "eighth sense", "internal body signals", "self-regulation", "sensory processing", "NBCOT"],
    overview: "Interoception is the sensory system responsible for detecting and interpreting internal body signals including hunger, thirst, temperature, pain, heart rate, bladder fullness, and emotional states. Often called the 'eighth sense,' interoception is increasingly recognized as foundational for self-regulation, emotional awareness, and daily function. OTs address interoceptive awareness as part of comprehensive sensory processing intervention.",
    mechanismPhysiology: "Interoceptive signals arise from receptors throughout the body's organs, muscles, and tissues, traveling via afferent pathways to the insular cortex, which integrates these signals into conscious awareness of body states. The insular cortex connects to limbic structures, linking body sensation to emotional experience. Poor interoceptive awareness impairs the ability to recognize and respond to internal needs.",
    clinicalRelevance: "OTs address interoception for toileting readiness (recognizing bladder/bowel signals), feeding (recognizing hunger/satiety), emotional regulation (connecting body sensations to emotions), pain management (body awareness), and self-care timing (recognizing fatigue, temperature). Interoceptive difficulties are common in autism, ADHD, trauma, and eating disorders.",
    signsSymptoms: "Difficulty recognizing hunger or satiety, toileting accidents despite age-appropriate development, poor temperature regulation (not dressing for weather), difficulty identifying emotions, over- or under-response to pain, and difficulty with self-regulation activities.",
    assessment: "Interoception assessment is primarily clinical observation and interview: Body Perception Questionnaire, observation of responses to internal cues (hunger, toileting, temperature), emotional awareness assessment, and integration with sensory processing evaluation.",
    management: "Interoceptive awareness activities: body scan exercises, heartbeat detection activities, mindfulness-based body awareness, emotion-body connection mapping (where do you feel angry in your body?), gradual toileting schedules with body-checking routines, hunger/satiety rating scales, and temperature awareness activities with explicit teaching of body signals.",
    complications: "Difficulty measuring interoceptive awareness objectively, cultural differences in body awareness language, and co-occurring conditions that complicate interoceptive assessment.",
    clinicalPearls: [
      "Interoception is the foundation of emotional regulation — if you can't feel what's happening in your body, you can't regulate your emotional responses.",
      "Toileting readiness requires interoceptive awareness of bladder and bowel signals — address interoception before behavioral toileting programs.",
      "Mindfulness-based body scan activities are the primary evidence-based approach for improving interoceptive awareness."
    ],
    examPitfalls: [
      "Overlooking interoception as a sensory system when assessing sensory processing.",
      "Implementing behavioral toileting programs without assessing interoceptive awareness of bladder signals.",
      "Assuming emotional regulation difficulties are purely behavioral without considering interoceptive contributions."
    ],
    faqJson: [
      { question: "What is interoception?", answer: "Interoception is the sensory system that detects and interprets internal body signals — hunger, thirst, pain, temperature, heart rate, bladder fullness, and emotional body states. It is the foundation for self-regulation and is sometimes called the 'eighth sense.'" },
      { question: "How does interoception relate to emotional regulation?", answer: "Emotions produce body sensations (racing heart, tight stomach, flushed face). Interoceptive awareness allows recognition of these body signals, which is the first step in emotional identification and regulation. Poor interoception means emotions may escalate without awareness until they become overwhelming." }
    ]
  },
  {
    slug: "proprioceptive-activities-ot",
    title: "Proprioceptive Activities in OT",
    category: "Sensory Integration",
    seoTitle: "Proprioceptive Activities OT — OT Encyclopedia",
    seoDescription: "OT guide to proprioceptive input activities for sensory regulation, motor planning, and body awareness.",
    seoKeywords: ["proprioception", "heavy work", "deep pressure", "body awareness", "sensory diet", "NBCOT"],
    overview: "Proprioceptive activities provide input through muscles, joints, and tendons during weight-bearing, pushing, pulling, lifting, and resistive activities. Proprioceptive input (also called 'heavy work') has a powerful organizing effect on the nervous system and is a cornerstone of sensory-based OT intervention. It is generally calming, improves body awareness, and enhances motor planning.",
    mechanismPhysiology: "Proprioceptors (muscle spindles, Golgi tendon organs, joint receptors) detect muscle contraction, joint position, and force. This information travels to the cerebellum, somatosensory cortex, and motor cortex for movement calibration. Proprioceptive input modulates the autonomic nervous system, generally promoting parasympathetic activation and reducing sympathetic arousal.",
    clinicalRelevance: "OTs prescribe proprioceptive activities as part of sensory diets for children and adults with sensory processing difficulties, autism, ADHD, anxiety, and arousal regulation challenges. Heavy work activities can be embedded throughout the day at home, school, and work to support self-regulation.",
    signsSymptoms: "Indicators of proprioceptive processing difficulties include poor body awareness, difficulty grading force (too rough or too gentle), clumsiness, seeking crashing/jumping activities, difficulty with motor planning, poor postural control, and sensory seeking behaviors.",
    assessment: "Clinical observation of force grading, body awareness, postural control, and motor planning. Sensory Profile-2 body awareness and movement sections, observation of play preferences, and assessment of how proprioceptive input affects arousal state.",
    management: "Heavy work activities: carrying weighted objects, pushing/pulling (wagon, grocery cart), climbing, jumping, animal walks (bear walk, crab walk), wheelbarrow walking, resistive play (clay, putty, playdough), chewing crunchy or chewy foods, swimming, and playground activities. Deep pressure: firm massage, compression clothing, weighted blankets/vests, bear hugs, and joint compressions. Structured sensory breaks throughout the day.",
    complications: "Over-reliance on proprioceptive input without addressing underlying sensory processing, and potential for injury with inappropriate activities for the child's age or ability.",
    clinicalPearls: [
      "Proprioceptive input is almost always organizing and calming — it is the 'safe' sensory input to try when unsure of a child's sensory profile.",
      "Heavy work before transitions or challenging tasks helps prepare the nervous system for optimal performance.",
      "Oral proprioception (chewing crunchy or chewy foods, vibrating toothbrush) can be especially calming and is easy to incorporate into routines."
    ],
    examPitfalls: [
      "Confusing proprioceptive input (through muscles and joints) with vestibular input (through head position and movement).",
      "Recommending weighted vests without establishing an individualized protocol (typically 10% of body weight, 20 minutes on/off).",
      "Not embedding proprioceptive activities into natural daily routines — isolated clinic activities don't generalize."
    ],
    faqJson: [
      { question: "What are heavy work activities?", answer: "Heavy work activities provide intense proprioceptive input through muscles and joints: carrying heavy objects, pushing/pulling, climbing, jumping, animal walks, resistive play with clay or putty, and household tasks like vacuuming or carrying groceries." },
      { question: "Why is proprioceptive input calming?", answer: "Proprioceptive input from muscles and joints activates the parasympathetic nervous system and has an organizing effect on the CNS. It helps modulate arousal levels, improve body awareness, and support self-regulation, making it effective for both under-aroused and over-aroused states." }
    ]
  },

  // ===== ADDITIONAL UNIQUE ENTRIES (16 entries to reach 152+ DB total) =====
  {
    slug: "constraint-induced-movement-therapy",
    title: "Constraint-Induced Movement Therapy (CIMT)",
    category: "Neurological Rehabilitation",
    seoTitle: "Constraint-Induced Movement Therapy OT — OT Encyclopedia",
    seoDescription: "Evidence-based CIMT protocol for upper extremity recovery after stroke and neurological injury.",
    seoKeywords: ["CIMT", "constraint-induced movement therapy", "learned nonuse", "stroke rehabilitation", "NBCOT"],
    overview: "Constraint-Induced Movement Therapy (CIMT) is an evidence-based neurological rehabilitation approach that forces use of the affected upper extremity by constraining the unaffected hand (typically with a mitt) while engaging in intensive, repetitive, task-specific practice with the affected limb. CIMT was developed by Edward Taub based on the concept of learned nonuse.",
    mechanismPhysiology: "After stroke, patients develop learned nonuse — avoiding the affected limb due to initial difficulty, which leads to further cortical reorganization away from the affected limb. CIMT reverses this by forcing use of the affected extremity, driving cortical reorganization and expanding the cortical representation of the affected limb through neuroplasticity and use-dependent cortical reorganization.",
    clinicalRelevance: "OTs implement CIMT protocols including traditional (6 hours/day of structured practice for 2 weeks with mitt restraint on the unaffected hand 90% of waking hours) and modified CIMT (less intensive protocols adapted for clinical feasibility). Candidates must have at least 20° wrist extension and 10° finger extension in the affected hand.",
    signsSymptoms: "Learned nonuse of the affected upper extremity after stroke or TBI, with the patient having motor recovery potential but habitually avoiding use of the affected arm. Typically presents as over-reliance on the unaffected limb for all tasks.",
    assessment: "Motor Activity Log (MAL) — measures amount of use (AOU) and quality of movement (QOM) of the affected arm in daily activities. Wolf Motor Function Test (WMFT), Action Research Arm Test (ARAT), and assessment of minimum motor criteria (20° wrist extension, 10° finger extension).",
    management: "Traditional CIMT: restraint mitt on unaffected hand 90% of waking hours, 6 hours/day structured task practice for 10 consecutive weekdays, shaping (progressive task difficulty), transfer package (behavioral strategies to promote use in daily life). Modified CIMT: reduced practice intensity (2-3 hours/day), shorter duration, intermittent restraint — more clinically feasible with similar outcomes.",
    complications: "Frustration with forced use, safety concerns with mitt restraint (balance, falls), fatigue from intensive practice, and not all patients meet motor criteria for CIMT.",
    clinicalPearls: [
      "The Motor Activity Log (MAL) is the primary outcome measure for CIMT — it captures real-world arm use, not just clinical performance.",
      "Modified CIMT protocols (less intensive) have shown similar efficacy to traditional CIMT and are more clinically feasible.",
      "The transfer package (problem-solving for daily arm use, behavioral contracts, home diary) is essential for maintaining gains."
    ],
    examPitfalls: [
      "Applying CIMT to patients who do not meet minimum motor criteria (20° wrist extension, 10° finger extension).",
      "Implementing only the restraint component without the intensive structured practice — the restraint alone is insufficient.",
      "Not including the transfer package for carry-over into daily life."
    ],
    faqJson: [
      { question: "What are the motor criteria for CIMT?", answer: "Candidates must demonstrate at least 20° active wrist extension and 10° active finger extension in the affected hand, indicating sufficient motor recovery potential to benefit from intensive practice." },
      { question: "What is the transfer package in CIMT?", answer: "The transfer package includes behavioral strategies to promote real-world use of the affected arm: problem-solving for daily tasks, behavioral contracts, home practice diaries, and daily review of MAL scores to encourage arm use outside therapy sessions." }
    ]
  },
  {
    slug: "mirror-therapy-ot",
    title: "Mirror Therapy in OT",
    category: "Neurological Rehabilitation",
    seoTitle: "Mirror Therapy OT — OT Encyclopedia",
    seoDescription: "Mirror therapy for upper extremity rehabilitation, phantom limb pain, and CRPS in occupational therapy.",
    seoKeywords: ["mirror therapy", "mirror box", "phantom limb", "stroke", "CRPS", "motor imagery", "NBCOT"],
    overview: "Mirror therapy uses a mirror placed in the patient's midsagittal plane to create a visual illusion of normal movement in the affected limb by reflecting movements of the unaffected limb. It is used in OT for upper extremity recovery after stroke, phantom limb pain following amputation, and complex regional pain syndrome (CRPS).",
    mechanismPhysiology: "Mirror therapy activates the mirror neuron system and premotor cortex by providing visual feedback that the affected limb is moving normally. This visual-motor illusion promotes cortical reorganization, reduces cortical pain representations, and facilitates motor recovery through visual dominance over proprioceptive and somatosensory input.",
    clinicalRelevance: "OTs implement mirror therapy as a complementary intervention for UE recovery post-stroke, phantom limb pain management, and CRPS pain reduction. Sessions typically involve 15-30 minutes of mirror practice with the unaffected hand performing functional movements while the patient watches the mirror reflection.",
    signsSymptoms: "Indications include hemiparesis after stroke (especially early recovery with limited active movement), phantom limb pain after amputation, CRPS with pain and motor impairment, and hand stiffness after immobilization.",
    assessment: "Baseline assessment of affected UE motor function, pain levels (VAS), functional use (MAL), and phantom limb pain characteristics. Serial reassessment to track improvements in motor function and pain reduction.",
    management: "Position the mirror in the midline, hide the affected limb behind the mirror, and perform bilateral or unilateral movements with the unaffected hand while watching the mirror reflection. Progress from simple (finger flexion/extension) to complex functional movements. Combine with mental imagery and task-specific practice. Typical protocol: 15-30 minutes, 1-2 times daily.",
    complications: "Increased pain if the visual illusion conflicts strongly with proprioceptive input (especially in CRPS), motion sickness in some patients, and limited evidence for chronic stroke (>1 year).",
    clinicalPearls: [
      "Mirror therapy is most effective for acute and subacute stroke — implement early in recovery when active movement is limited.",
      "For phantom limb pain, the visual illusion of the intact limb resolves the cortical mismatch between motor commands and missing sensory feedback.",
      "Combine mirror therapy with mental practice and task-specific training for synergistic effects."
    ],
    examPitfalls: [
      "Using mirror therapy as a standalone intervention rather than combining it with active motor training.",
      "Placing the mirror incorrectly (should be in the midsagittal plane with the affected limb hidden).",
      "Not grading the complexity of mirror movements from simple to functional."
    ],
    faqJson: [
      { question: "How does mirror therapy reduce phantom limb pain?", answer: "Mirror therapy provides the brain with visual feedback of an intact, moving limb, resolving the mismatch between motor commands and missing sensory feedback from the amputated limb. This visual dominance reduces the cortical pain representation and phantom pain experience." },
      { question: "When is mirror therapy most effective for stroke?", answer: "Mirror therapy shows the strongest evidence in acute and subacute stroke (within 6 months), particularly for patients with limited active movement who cannot yet participate in intensive task-specific training." }
    ]
  },
  {
    slug: "cerebral-palsy-ot",
    title: "Cerebral Palsy OT Interventions",
    category: "Pediatric OT",
    seoTitle: "Cerebral Palsy OT — OT Encyclopedia",
    seoDescription: "OT interventions for children with cerebral palsy including positioning, adaptive equipment, and functional skills.",
    seoKeywords: ["cerebral palsy", "CP", "spasticity management", "adaptive seating", "pediatric OT", "NBCOT"],
    overview: "Cerebral palsy (CP) is a group of permanent movement disorders caused by non-progressive brain injury occurring prenatally, perinatally, or in early childhood. OTs address upper extremity function, positioning and seating, self-care independence, feeding, play, school participation, and assistive technology needs across the lifespan.",
    mechanismPhysiology: "CP results from damage to the developing brain affecting motor cortex, pyramidal and extrapyramidal tracts, and/or cerebellum. Types include spastic (most common, 70-80%), dyskinetic (athetoid/dystonic), ataxic, and mixed. The Gross Motor Function Classification System (GMFCS) and Manual Ability Classification System (MACS) describe functional severity levels I-V.",
    clinicalRelevance: "OTs assess functional abilities using the MACS and GMFCS, provide adaptive seating and positioning, train self-care skills with adaptations, address feeding and oral motor function, implement upper extremity interventions (serial casting, botulinum toxin follow-up, CIMT), recommend assistive technology, and support school inclusion.",
    signsSymptoms: "Abnormal muscle tone (spasticity, dystonia, or hypotonia), delayed motor milestones, asymmetric hand use, difficulty with fine motor tasks, feeding difficulties, drooling, and associated conditions (seizures, intellectual disability, visual impairment, communication disorders).",
    assessment: "Manual Ability Classification System (MACS), Quality of Upper Extremity Skills Test (QUEST), Assisting Hand Assessment (AHA), Melbourne Assessment of Unilateral Upper Limb Function, seating and positioning evaluation, ADL assessment, and feeding/oral motor evaluation.",
    management: "Adaptive seating systems (tilt, recline, positioning supports), upper extremity positioning and splinting, serial casting for spasticity, post-botox therapy protocols, bimanual training, modified CIMT for hemiplegic CP, self-care adaptations, assistive technology (AAC, computer access, powered mobility), school accommodations, and caregiver education.",
    complications: "Progressive contractures and deformities, hip subluxation, scoliosis, skin breakdown from positioning equipment, caregiver burnout, and limited community participation.",
    clinicalPearls: [
      "MACS levels guide UE intervention goals: MACS I-II focus on quality and speed, MACS III on compensatory strategies, MACS IV-V on assistive technology and caregiver training.",
      "Proper seating is foundational — 'proximal stability enables distal mobility' — address trunk and pelvic positioning before training hand function.",
      "Bimanual training has stronger evidence than unimanual training for children with hemiplegic CP in everyday function."
    ],
    examPitfalls: [
      "Setting UE goals inconsistent with the child's MACS level — a MACS V child needs AT, not fine motor training.",
      "Attempting hand function training without first optimizing seating and positioning.",
      "Treating spasticity as always pathological — some children use spasticity functionally for grasp or standing."
    ],
    faqJson: [
      { question: "What is the MACS?", answer: "The Manual Ability Classification System classifies how children with CP use their hands in daily activities on a 5-level scale: Level I (handles objects easily) to Level V (does not handle objects, severely limited ability). It guides OT goal-setting and intervention planning." },
      { question: "What is bimanual training for CP?", answer: "Bimanual training (HABIT — Hand-Arm Bimanual Intensive Therapy) focuses on using both hands together in functional activities, particularly for hemiplegic CP. It has strong evidence for improving bimanual coordination in everyday tasks." }
    ]
  },
  {
    slug: "occupational-profile-evaluation",
    title: "The Occupational Profile",
    category: "Functional Assessment",
    seoTitle: "Occupational Profile OT Evaluation — OT Encyclopedia",
    seoDescription: "Understanding the occupational profile as the foundation of OT evaluation per the OTPF-4.",
    seoKeywords: ["occupational profile", "OTPF", "OT evaluation", "client-centered", "occupational history", "NBCOT"],
    overview: "The occupational profile is the first step of the OT evaluation process as defined in the Occupational Therapy Practice Framework (OTPF-4). It is a comprehensive summary of the client's occupational history, daily living patterns, interests, values, needs, and priorities. The occupational profile ensures client-centered practice by understanding what is important to and for the client before conducting performance analysis.",
    mechanismPhysiology: "The occupational profile reflects the OT profession's philosophical foundation in client-centered practice and the belief that meaningful occupation is essential to health. By understanding the person's occupational history, contexts, and priorities, the OT can design interventions that are personally relevant and motivating.",
    clinicalRelevance: "OTs gather the occupational profile through client interview, caregiver interview, chart review, and standardized tools. It includes the client's reason for seeking services, occupational history, daily routine, values and interests, performance patterns, contexts, and targeted outcomes. This information guides all subsequent evaluation and intervention planning.",
    signsSymptoms: "The occupational profile is needed for every OT client regardless of diagnosis. It identifies the client's priorities, which may differ from what medical records or referral sources indicate.",
    assessment: "Semi-structured interview addressing: occupational history, current daily routines, valued occupations, perceived barriers to participation, prior functional level, personal goals, relevant contexts (cultural, physical, social, temporal, virtual, personal), and desired outcomes. Standardized tools: Canadian Occupational Performance Measure (COPM), Role Checklist, Interest Checklist, and Occupational Self-Assessment (OSA).",
    management: "The occupational profile directly informs: selection of assessments for the analysis of occupational performance, goal-setting (client-driven priorities), intervention planning (meaningful activities), and outcome measurement. It should be revisited and updated throughout the course of treatment as the client's priorities evolve.",
    complications: "Clients who cannot participate in interview (cognitive impairment, communication barriers) require proxy informants. Time constraints may lead to superficial profiles. Cultural and language differences may affect information gathering.",
    clinicalPearls: [
      "The COPM (Canadian Occupational Performance Measure) is the gold standard for capturing the client's self-perceived occupational priorities.",
      "The occupational profile should always come BEFORE standardized testing — understand the person before assessing the impairment.",
      "Client priorities may differ significantly from clinician or referral source priorities — honor the client's perspective."
    ],
    examPitfalls: [
      "Skipping the occupational profile and jumping directly to component-level assessment.",
      "Assuming the referral diagnosis determines the client's occupational priorities.",
      "Not updating the occupational profile as the client's goals and priorities evolve during treatment."
    ],
    faqJson: [
      { question: "What is the COPM?", answer: "The Canadian Occupational Performance Measure is a standardized, client-centered interview tool where the client identifies their most important occupational performance issues and rates their current performance and satisfaction. It is the gold standard for client-centered goal identification." },
      { question: "Why is the occupational profile done before assessment?", answer: "Understanding the client's occupational history, values, and priorities ensures that subsequent assessments and interventions are relevant and meaningful. It prevents a diagnosis-driven approach and ensures truly client-centered practice." }
    ]
  },
  {
    slug: "canadian-model-of-occupational-performance",
    title: "Canadian Model of Occupational Performance and Engagement (CMOP-E)",
    category: "Ethics & Professional Practice",
    seoTitle: "CMOP-E OT Model — OT Encyclopedia",
    seoDescription: "The Canadian Model of Occupational Performance and Engagement (CMOP-E) framework for OT practice.",
    seoKeywords: ["CMOP-E", "Canadian model", "person-environment-occupation", "occupational performance", "OT model", "NBCOT"],
    overview: "The Canadian Model of Occupational Performance and Engagement (CMOP-E) is a foundational OT conceptual model depicting the dynamic interaction between the person, environment, and occupation. It places spirituality at the core of the person and emphasizes that occupational performance and engagement result from the transaction of person-environment-occupation components.",
    mechanismPhysiology: "The CMOP-E uses a nested diagram: the person (with spirituality at the center, surrounded by affective, cognitive, and physical components) is nested within the occupation (self-care, productivity, leisure) which is nested within the environment (physical, institutional, cultural, social). The dynamic interaction of all components determines occupational performance and engagement.",
    clinicalRelevance: "The CMOP-E guides OT practice by ensuring holistic assessment of person, occupation, and environment; centering spirituality (meaning and purpose); and using the COPM as its companion assessment tool. It supports client-centered practice by placing the client's valued occupations at the center of intervention.",
    signsSymptoms: "The CMOP-E is applied when there is a disruption in the person-environment-occupation interaction resulting in decreased occupational performance or engagement — applicable to any OT client situation.",
    assessment: "The Canadian Occupational Performance Measure (COPM) is the assessment tool designed to operationalize the CMOP-E, identifying the client's self-perceived occupational performance issues across self-care, productivity, and leisure domains.",
    management: "Intervention based on CMOP-E may target the person (skill building, adaptation), the environment (modification, advocacy), the occupation (activity analysis, grading, adaptation), or the transaction between all three. The goal is enabling occupational performance and engagement in meaningful occupations.",
    complications: "The model may be perceived as too broad for specific clinical decision-making. Spirituality as a core concept may be misunderstood as religiosity rather than meaning and purpose.",
    clinicalPearls: [
      "Spirituality in the CMOP-E refers to meaning, purpose, and connectedness — NOT religious practice specifically.",
      "The CMOP-E distinguishes occupational performance (doing) from occupational engagement (meaning and involvement) — both are important outcomes.",
      "The COPM is the companion assessment tool for the CMOP-E — they were designed to work together."
    ],
    examPitfalls: [
      "Confusing spirituality (meaning and purpose) with religion in the CMOP-E context.",
      "Not recognizing that the CMOP-E places spirituality at the CENTER of the person, distinguishing it from other OT models.",
      "Confusing the CMOP-E (Canadian model) with the PEO model (also person-environment-occupation but structured differently)."
    ],
    faqJson: [
      { question: "What does spirituality mean in the CMOP-E?", answer: "In the CMOP-E, spirituality refers to the essence of the person — their sense of meaning, purpose, connectedness, and what gives life significance. It is broader than religion and includes any source of personal meaning and motivation." },
      { question: "How does CMOP-E differ from the PEO model?", answer: "Both models address person-environment-occupation interaction, but the CMOP-E places spirituality at the person's core and uses a nested diagram, while the PEO model uses overlapping circles (Venn diagram) with occupational performance at the intersection. The CMOP-E was developed by the Canadian Association of OTs." }
    ]
  },
  {
    slug: "model-of-human-occupation",
    title: "Model of Human Occupation (MOHO)",
    category: "Ethics & Professional Practice",
    seoTitle: "Model of Human Occupation MOHO — OT Encyclopedia",
    seoDescription: "The Model of Human Occupation (MOHO) framework for understanding occupational behavior and motivation in OT.",
    seoKeywords: ["MOHO", "Model of Human Occupation", "volition", "habituation", "performance capacity", "NBCOT"],
    overview: "The Model of Human Occupation (MOHO) is the most widely used and researched occupation-based conceptual model in OT. Developed by Gary Kielhofner, MOHO explains how people select, organize, and perform occupations through three interrelated components: volition (motivation), habituation (patterns and roles), and performance capacity (abilities), all interacting with the environment.",
    mechanismPhysiology: "MOHO proposes that occupational behavior emerges from the dynamic interaction of: volition (personal causation, values, interests — what motivates you), habituation (habits and internalized roles — your patterns and routines), and performance capacity (physical and mental abilities plus subjective experience). These internal components interact with the environment to produce occupational participation, performance, and skill.",
    clinicalRelevance: "MOHO offers numerous standardized assessments: Volitional Questionnaire (VQ), Model of Human Occupation Screening Tool (MOHOST), Occupational Performance History Interview-II (OPHI-II), Role Checklist, Interest Checklist, Worker Role Interview (WRI), and Assessment of Communication and Interaction Skills (ACIS). These tools guide comprehensive evaluation across practice settings.",
    signsSymptoms: "MOHO is applied when clients experience disruptions in motivation (volition), routine and role performance (habituation), or skill execution (performance capacity) — applicable across all populations and practice settings.",
    assessment: "MOHO assessments include: MOHOST (screening across all MOHO components), OPHI-II (narrative interview of occupational history), VQ (observation of volitional behavior for nonverbal clients), WRI (return-to-work interview), Role Checklist, Interest Checklist, and ACIS (communication and social interaction skills).",
    management: "MOHO-guided intervention addresses: volition (exploring interests, building personal causation through successful experiences), habituation (establishing routines, supporting role identity and performance), performance capacity (skill development, environmental modification), and environment (providing opportunities, supports, and resources). The therapist facilitates occupational engagement to promote change across all MOHO components.",
    complications: "The model's complexity may be challenging for students and new practitioners. Multiple MOHO assessments can be time-consuming. The model may underemphasize biomechanical and neurological factors in physical rehabilitation.",
    clinicalPearls: [
      "MOHO's volition includes personal causation (belief in one's abilities), values (what matters), and interests (what you enjoy) — all three drive occupational choices.",
      "The MOHOST is an efficient screening tool that assesses all MOHO components through clinical observation — ideal for initial assessment.",
      "MOHO is the only OT model with a comprehensive, validated suite of standardized assessments."
    ],
    examPitfalls: [
      "Confusing volition (motivation subsystem) with habituation (pattern subsystem) in MOHO.",
      "Not recognizing that performance capacity in MOHO includes the subjective experience of disability, not just objective abilities.",
      "Confusing MOHO (motivation, patterns, capacity) with the CMOP-E (spirituality, PEO transaction)."
    ],
    faqJson: [
      { question: "What are the three main components of MOHO?", answer: "Volition (motivation — personal causation, values, interests), Habituation (patterns — habits and internalized roles), and Performance Capacity (abilities — physical and mental skills plus the subjective experience of living with a body)." },
      { question: "What is the MOHOST?", answer: "The Model of Human Occupation Screening Tool is an observation-based assessment that rates a client across all MOHO components: motivation for occupation, pattern of occupation, communication and interaction skills, process skills, motor skills, and environment. It provides a quick overview of occupational functioning." }
    ]
  },
  {
    slug: "ot-documentation-soap-notes",
    title: "OT Documentation and SOAP Notes",
    category: "Ethics & Professional Practice",
    seoTitle: "OT Documentation SOAP Notes — OT Encyclopedia",
    seoDescription: "Guide to OT documentation including SOAP notes, evaluation reports, and reimbursement requirements.",
    seoKeywords: ["SOAP notes", "OT documentation", "medical records", "reimbursement", "skilled services", "NBCOT"],
    overview: "Documentation is a critical professional responsibility in OT practice, serving as the legal record of services, the basis for reimbursement, a communication tool for the healthcare team, and evidence of skilled OT intervention. The SOAP note format (Subjective, Objective, Assessment, Plan) is the most widely used documentation framework in OT.",
    mechanismPhysiology: "Effective documentation demonstrates medical necessity and skilled service — the two requirements for OT reimbursement. Medical necessity means the services are reasonable and necessary for the patient's condition. Skilled service means the intervention requires the expertise of a licensed OT and cannot be performed by unskilled personnel.",
    clinicalRelevance: "OTs document evaluations, daily treatment notes (SOAP format), progress reports, re-evaluations, discharge summaries, and home programs. Documentation must demonstrate functional progress toward measurable goals, justify continued skilled intervention, and comply with payer-specific requirements (Medicare, Medicaid, private insurance).",
    signsSymptoms: "Documentation is required for every OT encounter. Key components include client identification, date and duration, interventions provided, client response, functional outcomes, and plan for continued treatment.",
    assessment: "SOAP note components: Subjective (client's self-report of status, pain, concerns), Objective (measurable data — ROM, strength, functional performance, assistance levels), Assessment (clinical interpretation of progress toward goals, justification for continued services), Plan (treatment plan modifications, frequency/duration, discharge planning).",
    management: "Best practices: use measurable terms (FIM levels, assist levels, percentages), document functional outcomes not just exercises, demonstrate skilled reasoning, avoid jargon and abbreviations that could be misinterpreted, include client response to intervention, and align documentation with established goals.",
    complications: "Denied reimbursement from inadequate documentation, legal liability from incomplete records, failure to demonstrate skilled service, and audit risk from inconsistent documentation.",
    clinicalPearls: [
      "Every treatment note must answer: 'Why does this patient need a skilled OT?' — if the note doesn't answer this, reimbursement may be denied.",
      "Document function, not just exercises — 'Patient performed 10 reps of shoulder flexion' does not demonstrate skilled OT service.",
      "Use assist levels consistently: Independent, Modified Independent, Supervision, Contact Guard, Minimum Assist, Moderate Assist, Maximum Assist, Dependent."
    ],
    examPitfalls: [
      "Writing treatment notes that describe exercises without linking them to functional goals.",
      "Not documenting the patient's response to intervention and progress toward goals.",
      "Using inconsistent terminology for assist levels across documentation."
    ],
    faqJson: [
      { question: "What does skilled service mean in OT documentation?", answer: "Skilled service means the intervention requires the clinical judgment, knowledge, and expertise of a licensed occupational therapist and cannot be safely or effectively performed by unskilled personnel. Documentation must demonstrate this clinical reasoning." },
      { question: "What are the standard assist levels in OT?", answer: "Standard assist levels from most to least assistance: Dependent (total assistance), Maximum Assist (client performs 25%), Moderate Assist (client performs 50%), Minimum Assist (client performs 75%), Contact Guard (therapist contact for safety), Supervision (verbal cues/standby), Modified Independent (uses device/extra time), Independent." }
    ]
  },
  {
    slug: "task-analysis-ot",
    title: "Task Analysis in Occupational Therapy",
    category: "Functional Assessment",
    seoTitle: "Task Analysis OT — OT Encyclopedia",
    seoDescription: "OT task analysis methodology for activity analysis, intervention planning, and therapeutic grading.",
    seoKeywords: ["task analysis", "activity analysis", "grading", "adapting", "OT process", "NBCOT"],
    overview: "Task analysis is a fundamental OT skill involving the systematic breakdown of an activity into its component steps and the analysis of the performance skills, client factors, contexts, and activity demands required for each step. It is the basis for therapeutic grading (making tasks easier or harder) and adapting (changing the task or environment to enable performance).",
    mechanismPhysiology: "Task analysis applies the OT process of understanding the interaction between the person, environment, and occupation at a granular level. By breaking activities into sequential steps and identifying the demands of each step, OTs can pinpoint exactly where performance breaks down and target intervention precisely.",
    clinicalRelevance: "OTs use task analysis for: identifying the specific step where performance breaks down, designing interventions targeting the problematic component, grading activities therapeutically (adjusting complexity, resistance, speed, or steps), adapting activities for compensation, teaching through forward or backward chaining, and developing home exercise programs.",
    signsSymptoms: "Task analysis is applied whenever a client has difficulty performing an activity — it identifies whether the barrier is motor, cognitive, perceptual, sensory, or environmental, and at which specific step performance fails.",
    assessment: "Observation of the client performing the complete task, identification of the specific step(s) where performance breaks down, analysis of the skills required at each step (motor, process, social interaction), and determination of whether the barrier is remediable or requires compensation.",
    management: "Grading UP: increase complexity, add steps, reduce cues, increase speed demands, add cognitive load (dual-task). Grading DOWN: simplify, reduce steps, increase cues, slow pace, provide physical guidance. Adapting: change the tool (adaptive equipment), change the method (one-handed technique), change the environment (reduce clutter, improve lighting). Chaining: forward chaining (teach first step, then add steps) or backward chaining (complete all but last step, then have client finish).",
    complications: "Over-grading an activity beyond the client's capability, under-grading resulting in insufficient challenge, and failure to update the analysis as the client's abilities change.",
    clinicalPearls: [
      "Backward chaining builds success and motivation — the client always completes the task (the last step), experiencing a sense of accomplishment.",
      "The 'just right challenge' — grading the activity to be achievable but effortful — is the sweet spot for therapeutic benefit.",
      "Activity analysis (analyzing the activity in general) differs from task analysis (analyzing a specific client performing a specific task in a specific context)."
    ],
    examPitfalls: [
      "Confusing activity analysis (general demands of an activity) with task analysis (client-specific performance analysis).",
      "Confusing grading (adjusting difficulty) with adapting (changing the task or environment for compensation).",
      "Not distinguishing forward chaining (begin with step 1) from backward chaining (begin with last step)."
    ],
    faqJson: [
      { question: "What is the difference between forward and backward chaining?", answer: "Forward chaining teaches from the first step — the client completes step 1, then steps 1-2, then steps 1-2-3, etc. Backward chaining teaches from the last step — the therapist completes all but the last step, then the client finishes. Backward chaining is often preferred because the client always experiences task completion." },
      { question: "What is the difference between grading and adapting?", answer: "Grading adjusts the difficulty level of an activity (making it easier or harder) to match the client's current abilities. Adapting changes the activity itself or the environment to compensate for deficits — such as using adaptive equipment or modifying the method of performance." }
    ]
  },
  {
    slug: "wheelchair-seating-positioning",
    title: "Wheelchair Seating and Positioning",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Wheelchair Seating and Positioning OT — OT Encyclopedia",
    seoDescription: "OT wheelchair seating and positioning assessment, prescription, and management for optimal function.",
    seoKeywords: ["wheelchair seating", "positioning", "pressure relief", "seating system", "assistive technology", "NBCOT"],
    overview: "Wheelchair seating and positioning is a specialized area of OT practice focused on matching the client's physical, functional, and environmental needs to the appropriate wheelchair and seating system. Proper seating affects posture, pressure distribution, respiratory function, upper extremity function, comfort, skin integrity, and overall functional independence.",
    mechanismPhysiology: "Optimal seating provides a stable base of support that promotes neutral pelvic alignment, appropriate trunk support, and head control. Poor positioning leads to asymmetric posture, pressure concentration (risking pressure injuries), compromised respiration, reduced upper extremity function, and progressive deformity. The pelvis is the key to seating — pelvic position determines trunk, head, and extremity positioning.",
    clinicalRelevance: "OTs conduct comprehensive seating assessments, select and configure wheelchair frames (manual, power, tilt-in-space), prescribe cushions (pressure-relieving), position trunk and extremity supports, train in wheelchair mobility, and reassess as needs change. Pressure mapping technology guides cushion selection.",
    signsSymptoms: "Indications for seating evaluation include poor seated posture, pressure injuries, discomfort, difficulty with UE function from the wheelchair, respiratory compromise, progressive deformity, and changes in functional status requiring equipment modification.",
    assessment: "Mat evaluation (supine assessment of ROM, tone, deformity, flexibility), seated simulation (trial of positions and supports), pressure mapping (identifying high-pressure areas), functional assessment from the wheelchair (reaching, transfers, propulsion), measurement for equipment specification, and environmental assessment (home, vehicle, community).",
    management: "Wheelchair selection (manual, power, tilt-in-space, recline), cushion selection (foam, gel, air, hybrid based on pressure mapping and positioning needs), back support (planar, contoured, custom-molded), positioning accessories (lateral trunk supports, headrest, arm supports, foot positioning), pressure relief training (weight shifts every 15-30 minutes), and wheelchair skills training.",
    complications: "Pressure injuries from inadequate cushion or positioning, postural deformity progression, shoulder overuse injuries from manual wheelchair propulsion, equipment abandonment from poor fit, and psychosocial impact of wheelchair use.",
    clinicalPearls: [
      "The pelvis is the foundation of seating — achieve neutral pelvic alignment before addressing trunk, head, or extremity positioning.",
      "Pressure mapping is the objective standard for cushion selection — clinical observation alone may miss dangerous pressure concentrations.",
      "Weight shifts every 15-30 minutes are essential for pressure injury prevention — train the client in forward lean, side lean, or tilt methods."
    ],
    examPitfalls: [
      "Selecting a wheelchair cushion without pressure mapping assessment.",
      "Addressing trunk positioning without first achieving optimal pelvic alignment.",
      "Not training the client in pressure relief techniques after wheelchair prescription."
    ],
    faqJson: [
      { question: "Why is the pelvis the key to seating?", answer: "The pelvis is the foundation of seated posture. Its position determines the alignment of the trunk, head, and extremities. A posteriorly tilted pelvis leads to kyphotic trunk posture, forward head position, and reduced UE function. Neutral pelvic alignment must be established first." },
      { question: "How often should wheelchair users perform pressure relief?", answer: "Pressure relief (weight shifts) should be performed every 15-30 minutes for 30-60 seconds. Methods include forward lean (chest to thighs), side lean, push-up lift, or power tilt/recline. This is the primary behavioral strategy for preventing pressure injuries." }
    ]
  },
  {
    slug: "assistive-technology-assessment-ot",
    title: "Assistive Technology Assessment in OT",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Assistive Technology Assessment OT — OT Encyclopedia",
    seoDescription: "OT assistive technology assessment frameworks including HAAT model and SETT framework for AT selection.",
    seoKeywords: ["assistive technology", "AT assessment", "HAAT model", "SETT framework", "AAC", "NBCOT"],
    overview: "Assistive technology (AT) encompasses any device or system that increases, maintains, or improves functional capabilities of individuals with disabilities. OTs are primary AT assessors and providers, using systematic frameworks like the HAAT model and SETT framework to match technology to client needs across low-tech (reachers, adapted utensils) to high-tech (power wheelchairs, AAC devices, computer access) solutions.",
    mechanismPhysiology: "The Human Activity Assistive Technology (HAAT) model provides a framework for understanding how the human (person's abilities and goals), the activity (task demands), the assistive technology (device characteristics), and the context (physical, social, cultural, institutional environment) interact to determine successful AT use. A mismatch in any component leads to device abandonment.",
    clinicalRelevance: "OTs assess AT needs across the continuum from low-tech to high-tech, considering the client's functional abilities, goals, contexts of use, training needs, and funding options. The SETT framework (Student, Environments, Tasks, Tools) is widely used in school-based practice for AT decision-making.",
    signsSymptoms: "AT assessment is indicated when a client cannot perform valued activities independently, when compensatory strategies alone are insufficient, when environmental modifications are not enough, and when technology could bridge the gap between ability and task demand.",
    assessment: "HAAT model assessment: evaluate the human (abilities, preferences, goals), the activity (demands, contexts), potential AT options (features, usability, maintenance), and the context (where and when AT will be used). SETT framework (schools): Student (abilities, needs), Environments (classroom, home, community), Tasks (academic, social, self-care), Tools (AT devices and services). Trial periods with AT devices are essential before final selection.",
    management: "AT continuum: no-tech (strategies only) → low-tech (simple devices, adapted tools) → mid-tech (electronic devices, simple switches) → high-tech (computers, power wheelchairs, AAC, environmental control units). Training for client, family, and relevant staff. Follow-up for troubleshooting, adjustment, and reassessment. Funding advocacy (insurance, school district, vocational rehabilitation).",
    complications: "AT device abandonment (estimated 30% rate), inadequate training, funding barriers, technology changes requiring updates, and over- or under-prescribing technology complexity.",
    clinicalPearls: [
      "AT device abandonment rates are approximately 30% — thorough assessment, client involvement in selection, and training are critical to prevent abandonment.",
      "Start low-tech and progress to high-tech only as needed — simpler solutions are often more sustainable.",
      "A trial period with AT devices before final selection is essential — what works in the clinic may not work in the real-world context."
    ],
    examPitfalls: [
      "Jumping to high-tech solutions without considering low-tech alternatives first.",
      "Prescribing AT without adequate trial period in the actual use environment.",
      "Not providing training to the client, family, AND relevant staff (teachers, caregivers) on AT use."
    ],
    faqJson: [
      { question: "What is the HAAT model?", answer: "The Human Activity Assistive Technology model is a framework for AT assessment that considers four components: the Human (person's abilities and goals), the Activity (task demands), the Assistive Technology (device features), and the Context (where, when, and with whom AT is used). Successful AT use requires alignment of all components." },
      { question: "What is the SETT framework?", answer: "The SETT framework (Student, Environments, Tasks, Tools) is a decision-making tool for AT in educational settings. It systematically considers the Student's abilities and needs, the Environments where AT will be used, the Tasks to be performed, and then identifies appropriate Tools (AT devices and services)." }
    ]
  },
  {
    slug: "environmental-modification-ot",
    title: "Environmental Modification in OT",
    category: "Adaptive Equipment & Assistive Technology",
    seoTitle: "Environmental Modification OT — OT Encyclopedia",
    seoDescription: "OT environmental modification strategies for accessibility, safety, and functional independence.",
    seoKeywords: ["environmental modification", "accessibility", "ADA", "home modification", "universal design", "NBCOT"],
    overview: "Environmental modification is a core OT intervention that changes the physical or social environment to support occupational performance. OTs assess person-environment fit and recommend modifications ranging from simple (rearranging furniture, adding contrast) to complex (structural renovations, smart home technology) to promote independence, safety, and participation.",
    mechanismPhysiology: "The Person-Environment-Occupation (PEO) model explains that occupational performance is maximized when there is optimal fit between the person's abilities, the environmental demands, and the occupational requirements. Environmental modification improves this fit by reducing environmental barriers or adding environmental supports.",
    clinicalRelevance: "OTs modify physical environments (home, school, workplace, community), social environments (caregiver education, peer support), and institutional environments (policy and procedure changes). Modifications address accessibility, safety, sensory needs, cognitive support, and behavioral management.",
    signsSymptoms: "Environmental modification is indicated when there is a mismatch between the person's abilities and environmental demands: inability to access areas of the home, safety hazards, sensory environment problems, cognitive demands exceeding abilities, and barriers to community participation.",
    assessment: "Home safety evaluation, workplace ergonomic assessment, school accessibility review, ADA compliance assessment, sensory environment analysis, cognitive environment analysis (signage, organization, complexity), and identification of environmental barriers and supports.",
    management: "Physical modifications: ramps, grab bars, wider doorways, lever handles, improved lighting, contrast enhancement, non-slip surfaces, smart home technology. Sensory modifications: noise reduction, lighting adjustment, visual clutter reduction. Cognitive modifications: signage, color-coding, simplified layouts, organizational systems. Social modifications: caregiver training, communication supports, routine establishment.",
    complications: "Cost barriers, landlord restrictions for renters, aesthetic concerns, over-modification creating dependency, and modifications that don't address the actual barrier.",
    clinicalPearls: [
      "The PEO model guides environmental modification — assess the person, environment, and occupation to identify where the mismatch occurs.",
      "Environmental modifications often provide the most immediate functional improvement — changing the environment is faster than changing the person.",
      "Consider both the physical and social environment — sometimes training caregivers is the most effective environmental modification."
    ],
    examPitfalls: [
      "Modifying the environment without assessing whether the person's skills can also be improved (over-reliance on compensation).",
      "Not considering the social and institutional environment alongside the physical environment.",
      "Recommending modifications without assessing the client's financial resources and housing situation."
    ],
    faqJson: [
      { question: "What is the PEO model?", answer: "The Person-Environment-Occupation model depicts three overlapping circles representing the person, environment, and occupation. The area of overlap represents occupational performance. Maximizing this overlap through environmental modification, skill building, or activity adaptation improves occupational performance." },
      { question: "What is the most cost-effective environmental modification?", answer: "Simple modifications like improved lighting, removal of throw rugs, adding non-slip strips, and rearranging furniture for clear pathways are among the most cost-effective. They are inexpensive, easy to implement, and significantly improve safety and function." }
    ]
  },
  {
    slug: "burns-rehabilitation-ot",
    title: "Burns Rehabilitation in OT",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Burns Rehabilitation OT — OT Encyclopedia",
    seoDescription: "OT rehabilitation for burn injuries including positioning, splinting, scar management, and ADL retraining.",
    seoKeywords: ["burn rehabilitation", "scar management", "anti-deformity positioning", "pressure garments", "NBCOT"],
    overview: "OTs play a critical role in burn rehabilitation from the acute phase through long-term scar management. Intervention focuses on anti-deformity positioning, splinting, edema management, early ROM, scar management (pressure garments, silicone, massage), ADL retraining, and psychosocial support. The primary OT goal is preventing contracture and maximizing functional independence.",
    mechanismPhysiology: "Burn injury causes tissue destruction classified by depth: superficial (epidermis), superficial partial thickness (epidermis + superficial dermis), deep partial thickness (into deep dermis), and full thickness (entire dermis, may involve subcutaneous tissue). Healing involves wound contraction and scar formation. Without intervention, the scar contracts in the position of comfort (flexion), causing functional contracture.",
    clinicalRelevance: "OTs provide anti-deformity positioning (the opposite of the position of comfort/deformity), splinting to maintain tissue length, early and ongoing ROM exercises, edema management, scar management programs (pressure garments, silicone sheets, massage), ADL retraining with adaptations, and psychological support for body image changes.",
    signsSymptoms: "Burn injuries affecting functional areas (hands, face, neck, axillae, elbows, knees), developing scar contracture, hypertrophic scarring, edema, pain limiting function, and psychosocial distress from altered appearance.",
    assessment: "Total body surface area (TBSA) and depth of burn, ROM assessment (serial measurements), scar assessment (Vancouver Scar Scale), edema measurement, functional assessment (grip strength, ADL performance), pain assessment, and psychosocial evaluation.",
    management: "Acute phase: anti-deformity positioning and splinting, edema management, gentle AROM. Intermediate phase: aggressive ROM, scar massage, pressure garment fitting, silicone application, progressive ADL retraining. Long-term: ongoing scar management (pressure garments worn 23 hours/day for 12-18 months), reconstructive surgery rehabilitation, community reintegration, and psychosocial support.",
    complications: "Contracture formation, hypertrophic scarring, heterotopic ossification, peripheral nerve damage, joint subluxation, and psychological distress (PTSD, depression, body image issues).",
    clinicalPearls: [
      "Anti-deformity positioning is the OPPOSITE of the position of comfort: neck extension, shoulder abduction/flexion, elbow extension, wrist extension, MCP flexion, IP extension, thumb abduction.",
      "Pressure garments must provide 25 mmHg of pressure and be worn 23 hours/day for 12-18 months until scars mature.",
      "The boutonnière deformity is common in dorsal hand burns — splint MCPs in flexion and IPs in extension (safe position)."
    ],
    examPitfalls: [
      "Positioning the burned extremity in the position of comfort rather than the anti-deformity position.",
      "Not recognizing that anti-deformity position is joint-specific — neck extended, shoulder abducted, elbow extended.",
      "Discontinuing pressure garments before scar maturation (typically 12-18 months post-burn)."
    ],
    faqJson: [
      { question: "What is anti-deformity positioning?", answer: "Anti-deformity positioning places burned joints in the position OPPOSITE to the anticipated contracture: neck extended, shoulders abducted 90°, elbows extended, wrists extended 30°, MCPs flexed 70-90°, IPs extended, and thumbs abducted. This maintains tissue length as healing occurs." },
      { question: "How long should pressure garments be worn?", answer: "Pressure garments should be worn 23 hours per day (removed only for bathing and garment care) until scars mature, typically 12-18 months post-burn. They must provide approximately 25 mmHg of pressure to be effective in controlling hypertrophic scarring." }
    ]
  },
  {
    slug: "lymphedema-management-ot",
    title: "Lymphedema Management in OT",
    category: "Upper Extremity Rehabilitation",
    seoTitle: "Lymphedema Management OT — OT Encyclopedia",
    seoDescription: "OT lymphedema management including complete decongestive therapy, compression, and self-management education.",
    seoKeywords: ["lymphedema", "complete decongestive therapy", "CDT", "MLD", "compression", "NBCOT"],
    overview: "Lymphedema is chronic swelling caused by impaired lymphatic drainage, most commonly in the upper extremity following breast cancer treatment (surgery and/or radiation). OTs certified in lymphedema management provide Complete Decongestive Therapy (CDT), the gold standard treatment consisting of manual lymphatic drainage (MLD), compression bandaging, exercise, and skin care.",
    mechanismPhysiology: "Lymphedema occurs when lymphatic transport capacity is insufficient to manage the lymphatic load, causing protein-rich fluid accumulation in tissues. Primary lymphedema results from congenital lymphatic malformation. Secondary lymphedema results from damage to the lymphatic system (most commonly from lymph node dissection and radiation for cancer). The protein-rich fluid triggers inflammation, fibrosis, and progressive tissue changes if untreated.",
    clinicalRelevance: "OTs with lymphedema certification provide CDT in two phases: Phase 1 (intensive reduction) involves daily MLD, compression bandaging, exercise, and skin care for 2-6 weeks. Phase 2 (maintenance) involves self-MLD, compression garment wear, continued exercise, and skin care as a lifelong program. OTs also address functional limitations and psychosocial impact.",
    signsSymptoms: "Progressive swelling of the affected limb, heaviness, tightness, decreased ROM, skin changes (fibrosis, papillomatosis), recurrent infections (cellulitis), functional limitations, and body image concerns. Stemmer's sign (inability to pinch a fold of skin at the base of the second toe/finger) indicates lymphedema.",
    assessment: "Circumferential measurements at standardized intervals, volumetric measurement (water displacement or perometry), skin assessment, Stemmer's sign, staging (ISL staging: 0-III), ROM assessment, functional assessment, and lymphedema quality of life measures.",
    management: "CDT Phase 1 (intensive): daily MLD (gentle massage directing fluid toward functioning lymph nodes), short-stretch compression bandaging (applied after MLD), decongestive exercises (gentle ROM with compression), and meticulous skin care (preventing infection). CDT Phase 2 (maintenance): self-MLD, compression garment (20-30 or 30-40 mmHg), exercise program, skin care, and self-monitoring for volume changes.",
    complications: "Cellulitis (skin infection requiring antibiotics), progressive fibrosis, functional impairment, lymphangiosarcoma (rare malignancy in chronic lymphedema), and psychosocial distress.",
    clinicalPearls: [
      "Short-stretch bandages (NOT elastic bandages) are used for lymphedema compression — they provide high working pressure and low resting pressure.",
      "MLD is a gentle technique — it should not cause redness or pain. Pressure is approximately 30-40 mmHg (the weight of a nickel).",
      "Lymphedema precautions: avoid blood pressure cuffs, needle sticks, and constriction on the affected limb; protect skin from cuts and burns."
    ],
    examPitfalls: [
      "Using elastic (ACE) bandages instead of short-stretch bandages for lymphedema compression.",
      "Applying MLD with too much pressure — lymphatic vessels are superficial and require very gentle massage.",
      "Not educating the patient that lymphedema management is a lifelong commitment requiring daily self-care."
    ],
    faqJson: [
      { question: "What is Complete Decongestive Therapy?", answer: "CDT is the gold standard treatment for lymphedema consisting of four components: Manual Lymphatic Drainage (gentle massage), compression bandaging (short-stretch bandages), decongestive exercises (ROM with compression), and skin care (preventing infection). Phase 1 is intensive therapist-directed; Phase 2 is patient self-management." },
      { question: "Why are short-stretch bandages used instead of elastic bandages?", answer: "Short-stretch bandages provide high working pressure (during muscle contraction, aiding lymphatic flow) and low resting pressure (comfortable during rest, not constricting). Elastic bandages provide constant pressure that can impede lymphatic flow and cause discomfort." }
    ]
  },
  {
    slug: "cognitive-behavioral-frame-ot",
    title: "Cognitive-Behavioral Frame of Reference in OT",
    category: "Mental Health OT",
    seoTitle: "CBT Frame of Reference in OT — OT Encyclopedia",
    seoDescription: "Application of cognitive-behavioral approaches in OT for mental health and chronic pain management.",
    seoKeywords: ["cognitive behavioral", "CBT in OT", "cognitive distortions", "behavioral activation", "mental health OT", "NBCOT"],
    overview: "The cognitive-behavioral frame of reference applies principles of cognitive-behavioral therapy (CBT) within OT practice to address the relationship between thoughts, feelings, and occupational behavior. OTs use CBT-informed strategies to help clients identify and modify unhelpful thinking patterns that impair occupational engagement, manage chronic pain, build self-efficacy, and develop healthy coping strategies.",
    mechanismPhysiology: "CBT is based on the cognitive model: situations trigger automatic thoughts, which influence emotions and behaviors. Cognitive distortions (all-or-nothing thinking, catastrophizing, overgeneralization) lead to maladaptive emotional and behavioral responses. By identifying and restructuring these distortions, clients develop more adaptive responses that support occupational engagement.",
    clinicalRelevance: "OTs use CBT-informed approaches for chronic pain self-management (pain catastrophizing, activity pacing), mental health recovery (behavioral activation, cognitive restructuring during daily activities), anxiety and phobia management (graded exposure through occupation), self-efficacy building (mastery experiences), and stress management. OTs apply CBT within occupational context rather than as standalone talk therapy.",
    signsSymptoms: "Indicators for CBT-informed OT include avoidance behaviors limiting occupation, catastrophic thinking about pain or disability, low self-efficacy, activity withdrawal, anxiety interfering with daily function, and depressive inactivity.",
    assessment: "Pain Catastrophizing Scale, Self-Efficacy Scale, Fear-Avoidance Beliefs Questionnaire, Beck Depression Inventory, behavioral activation assessment, thought record analysis, and observation of cognitive patterns during occupational performance.",
    management: "Cognitive restructuring: identify automatic thoughts during activities, evaluate evidence for/against, generate alternative balanced thoughts. Behavioral activation: schedule meaningful activities, grade difficulty, track mood-activity connection. Graded exposure: systematic confrontation of feared activities. Activity pacing: balance activity and rest using time-based rather than pain-based limits. Self-efficacy building: set achievable goals, practice mastery experiences, positive self-monitoring.",
    complications: "Difficulty identifying automatic thoughts (requires practice), resistance to cognitive restructuring, and scope of practice boundaries — OTs should not provide standalone psychotherapy.",
    clinicalPearls: [
      "OTs apply CBT WITHIN occupational context — identify and restructure unhelpful thoughts AS clients engage in daily activities, not as standalone talk therapy.",
      "Behavioral activation (scheduling and engaging in meaningful activities) is one of the most effective interventions for depression — a natural OT-CBT fit.",
      "Activity pacing uses TIME-BASED limits (30 minutes, then rest) rather than PAIN-BASED limits (stop when it hurts) — this prevents the boom-bust cycle."
    ],
    examPitfalls: [
      "Providing standalone CBT psychotherapy beyond OT scope — OTs integrate CBT within occupational context.",
      "Using pain-contingent activity pacing ('stop when pain increases') instead of time-contingent pacing ('stop at the planned time regardless of pain').",
      "Not recognizing the difference between OT's use of CBT strategies (within occupation) and psychologist's use of CBT (as primary psychotherapy)."
    ],
    faqJson: [
      { question: "How do OTs use CBT differently from psychologists?", answer: "OTs integrate CBT strategies within the context of occupational performance — identifying and restructuring unhelpful thoughts AS clients engage in daily activities. Psychologists provide CBT as a primary psychotherapeutic intervention. OTs use CBT to enable occupation; psychologists use CBT to treat psychological disorders." },
      { question: "What is activity pacing?", answer: "Activity pacing involves setting pre-determined time limits for activities rather than using pain as the guide. For example, working for 20 minutes then resting for 10, regardless of pain level. This prevents the boom-bust cycle where patients overdo on good days and crash afterward." }
    ]
  },
  {
    slug: "occupation-based-practice",
    title: "Occupation-Based Practice",
    category: "Ethics & Professional Practice",
    seoTitle: "Occupation-Based Practice OT — OT Encyclopedia",
    seoDescription: "Principles of occupation-based practice as the foundation of occupational therapy clinical reasoning.",
    seoKeywords: ["occupation-based practice", "occupation-centered", "top-down approach", "meaningful activity", "NBCOT"],
    overview: "Occupation-based practice is the philosophical foundation of OT, asserting that meaningful occupation should be both the means and the end of therapy. In contrast to impairment-based (bottom-up) approaches that focus on remediating body functions, occupation-based (top-down) approaches start with the client's valued occupations and use engagement in meaningful activities as the primary therapeutic modality.",
    mechanismPhysiology: "Occupation-based practice is grounded in the belief that humans are occupational beings — engagement in meaningful occupation is essential for health, well-being, and identity. Neuroplasticity research supports that task-specific, meaningful practice produces greater neural reorganization and functional gains than rote exercise. Motivation and engagement are enhanced when activities hold personal meaning.",
    clinicalRelevance: "OTs implementing occupation-based practice: start with the occupational profile (what matters to the client), use top-down evaluation (assess occupational performance before component skills), employ occupation as the therapeutic medium (cook a meal rather than do tabletop exercises), and measure outcomes in terms of occupational participation rather than impairment reduction.",
    signsSymptoms: "Occupation-based practice applies to ALL OT clients. It shifts the focus from 'what is wrong with the person' to 'what occupations are meaningful and what barriers exist to participation.'",
    assessment: "Top-down assessments: Canadian Occupational Performance Measure (COPM), Occupational Self-Assessment (OSA), Assessment of Motor and Process Skills (AMPS), observation of occupational performance in natural context. These contrast with bottom-up assessments that measure isolated body functions (grip strength, ROM).",
    management: "Use occupation AS therapy (preparatory activities → purposeful activities → occupation-based activities). Example: for a stroke patient wanting to cook, use cooking as the therapeutic medium rather than cone stacking. Occupation-based activities are most motivating, generalizable, and client-centered. When preparatory activities are needed, clearly link them to the client's occupational goals.",
    complications: "Time and space constraints in clinical settings, reimbursement systems that may not recognize occupation-based interventions, difficulty implementing occupation-based practice in acute care, and therapist training primarily in impairment-based approaches.",
    clinicalPearls: [
      "The OTPF-4 defines three levels of intervention: preparatory methods (bottom-up, therapist-directed), purposeful activities (simulated occupation), and occupation-based (real occupation in natural context) — prioritize the highest level possible.",
      "Top-down approach: start with the occupation (what the person wants/needs to do), then analyze what barriers prevent it, then address barriers — not the reverse.",
      "Occupation-based practice is not only the philosophical ideal — research shows it produces better functional outcomes and patient satisfaction than impairment-based approaches."
    ],
    examPitfalls: [
      "Equating 'activity-based' with 'occupation-based' — occupation-based practice requires that the activity holds personal meaning and relevance for the specific client.",
      "Defaulting to preparatory methods (cone stacking, peg boards) when occupation-based alternatives are possible.",
      "Using a bottom-up approach (assess impairments first) instead of a top-down approach (assess occupational performance first)."
    ],
    faqJson: [
      { question: "What is the difference between top-down and bottom-up approaches?", answer: "Top-down starts with the client's occupational concerns, then determines which barriers impede participation. Bottom-up starts with impairment assessment (ROM, strength, cognition) and works toward function. OT philosophy and evidence favor top-down, occupation-based approaches." },
      { question: "What are the three intervention levels in the OTPF-4?", answer: "1) Preparatory methods (exercise, modalities — therapist-directed, address body functions), 2) Purposeful activities (simulated activities with therapeutic intent), 3) Occupation-based (engagement in actual client-valued occupations in natural contexts). The OTPF-4 prioritizes occupation-based intervention." }
    ]
  }
];

async function seedOTEncyclopedia() {
  console.log(`Seeding ${entries.length} OT encyclopedia entries...`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS encyclopedia_topics (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      profession TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      related_lesson_ids TEXT[] DEFAULT '{}',
      related_question_ids TEXT[] DEFAULT '{}',
      related_flashcard_ids TEXT[] DEFAULT '{}',
      status TEXT DEFAULT 'draft',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (profession, slug)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS encyclopedia_entries (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      topic_id VARCHAR NOT NULL,
      profession TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT[] DEFAULT '{}',
      overview TEXT,
      mechanism_physiology TEXT,
      clinical_relevance TEXT,
      signs_symptoms TEXT,
      assessment TEXT,
      management TEXT,
      complications TEXT,
      clinical_pearls JSONB DEFAULT '[]',
      exam_pitfalls JSONB DEFAULT '[]',
      faq_json JSONB DEFAULT '[]',
      related_lesson_ids TEXT[] DEFAULT '{}',
      related_question_ids TEXT[] DEFAULT '{}',
      related_flashcard_ids TEXT[] DEFAULT '{}',
      cross_profession_links JSONB DEFAULT '[]',
      image_placeholders JSONB DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (profession, slug)
    )
  `);

  try {
    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'encyclopedia_topics_profession_slug_key'
        ) THEN
          ALTER TABLE encyclopedia_topics ADD CONSTRAINT encyclopedia_topics_profession_slug_key UNIQUE (profession, slug);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'encyclopedia_entries_profession_slug_key'
        ) THEN
          ALTER TABLE encyclopedia_entries ADD CONSTRAINT encyclopedia_entries_profession_slug_key UNIQUE (profession, slug);
        END IF;
      END $$;
    `);
  } catch (e) {}

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
      if (inserted % 25 === 0) {
        console.log(`  Inserted ${inserted}/${entries.length}...`);
      }
    } catch (err: any) {
      errors.push(`Error for "${entry.slug}": ${err.message}`);
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log("Errors:", errors);
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int as total, COUNT(DISTINCT category)::int as categories FROM encyclopedia_entries WHERE profession = $1 AND status = 'published'`,
    [PROFESSION]
  );
  console.log(`Total published OT entries: ${countResult.rows[0].total}, Categories: ${countResult.rows[0].categories}`);
}

seedOTEncyclopedia().then(() => {
  console.log("Seed complete.");
  process.exit(0);
}).catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
