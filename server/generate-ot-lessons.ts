import pg from "pg";
import { fileURLToPath } from "url";
import { getProdPool } from "./db";

const SYSTEM_USER_ID = "system-nursenest";

interface OTLessonTopic {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: number;
}

interface ContentBlock {
  type: string;
  text?: string;
  items?: string[];
}

interface LessonGenerationResult {
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
  content?: ContentBlock[];
  learningObjectives?: string[];
}

interface FlashcardResult {
  cards?: { front: string; back: string; rationale?: string; clinicalPearl?: string }[];
}

const OT_LESSON_TOPICS: OTLessonTopic[] = [
  // ==================== ADL Training (42 lessons) ====================
  { slug: "ot-bathing-adaptations-upper-extremity", title: "Bathing Adaptations for Upper Extremity Limitations", category: "ADL Training", tags: ["bathing", "ADL", "upper-extremity", "adaptations"], difficulty: 2 },
  { slug: "ot-bathing-adaptations-lower-extremity", title: "Bathing Adaptations for Lower Extremity Limitations", category: "ADL Training", tags: ["bathing", "ADL", "lower-extremity", "hip-precautions"], difficulty: 2 },
  { slug: "ot-bathing-safety-equipment", title: "Bathing Safety Equipment and Environmental Modifications", category: "ADL Training", tags: ["bathing", "safety", "grab-bars", "shower-chair"], difficulty: 2 },
  { slug: "ot-bathing-cognitive-impairment", title: "Bathing Strategies for Clients with Cognitive Impairment", category: "ADL Training", tags: ["bathing", "cognitive", "dementia", "cueing"], difficulty: 3 },
  { slug: "ot-dressing-upper-body-hemiplegia", title: "Upper Body Dressing Techniques for Hemiplegia", category: "ADL Training", tags: ["dressing", "hemiplegia", "one-handed", "ADL"], difficulty: 3 },
  { slug: "ot-dressing-lower-body-hip-precautions", title: "Lower Body Dressing with Hip Precautions", category: "ADL Training", tags: ["dressing", "hip-precautions", "THA", "adaptive"], difficulty: 3 },
  { slug: "ot-dressing-adaptive-clothing", title: "Adaptive Clothing Solutions and Modifications", category: "ADL Training", tags: ["dressing", "adaptive-clothing", "velcro", "modifications"], difficulty: 2 },
  { slug: "ot-dressing-pediatric-developmental", title: "Dressing Skills in Pediatric Development", category: "ADL Training", tags: ["dressing", "pediatric", "development", "fine-motor"], difficulty: 2 },
  { slug: "ot-feeding-dysphagia-strategies", title: "Feeding Strategies for Dysphagia Management", category: "ADL Training", tags: ["feeding", "dysphagia", "swallowing", "positioning"], difficulty: 4 },
  { slug: "ot-feeding-adaptive-utensils", title: "Adaptive Utensils and Feeding Equipment", category: "ADL Training", tags: ["feeding", "adaptive-utensils", "built-up-handles", "plate-guards"], difficulty: 2 },
  { slug: "ot-feeding-self-feeding-training", title: "Self-Feeding Training Programs", category: "ADL Training", tags: ["feeding", "self-feeding", "independence", "motor-planning"], difficulty: 3 },
  { slug: "ot-feeding-cultural-meal-preparation", title: "Culturally Responsive Meal Preparation Training", category: "ADL Training", tags: ["feeding", "meal-prep", "cultural", "IADL"], difficulty: 2 },
  { slug: "ot-grooming-one-handed-techniques", title: "One-Handed Grooming Techniques", category: "ADL Training", tags: ["grooming", "one-handed", "hemiplegia", "hygiene"], difficulty: 2 },
  { slug: "ot-grooming-oral-hygiene-adaptations", title: "Oral Hygiene Adaptations for Impaired Function", category: "ADL Training", tags: ["grooming", "oral-hygiene", "dental", "adaptations"], difficulty: 2 },
  { slug: "ot-grooming-hair-care-limited-rom", title: "Hair Care Strategies for Limited Range of Motion", category: "ADL Training", tags: ["grooming", "hair-care", "ROM", "long-handled"], difficulty: 2 },
  { slug: "ot-toileting-adaptations-mobility", title: "Toileting Adaptations for Mobility Impairment", category: "ADL Training", tags: ["toileting", "mobility", "raised-seat", "grab-bars"], difficulty: 2 },
  { slug: "ot-toileting-clothing-management", title: "Toileting Clothing Management Strategies", category: "ADL Training", tags: ["toileting", "clothing-management", "one-handed", "adaptive"], difficulty: 2 },
  { slug: "ot-toileting-bowel-bladder-programs", title: "Bowel and Bladder Management Programs in OT", category: "ADL Training", tags: ["toileting", "bowel-program", "bladder", "SCI"], difficulty: 3 },
  { slug: "ot-community-mobility-public-transit", title: "Community Mobility and Public Transportation Training", category: "ADL Training", tags: ["community-mobility", "public-transit", "IADL", "independence"], difficulty: 3 },
  { slug: "ot-community-mobility-wheelchair-skills", title: "Wheelchair Community Mobility Skills", category: "ADL Training", tags: ["community-mobility", "wheelchair", "accessibility", "navigation"], difficulty: 3 },
  { slug: "ot-home-management-kitchen-safety", title: "Kitchen Safety and Meal Preparation Adaptations", category: "ADL Training", tags: ["home-management", "kitchen-safety", "meal-prep", "IADL"], difficulty: 2 },
  { slug: "ot-home-management-housekeeping", title: "Housekeeping Adaptations and Energy Conservation", category: "ADL Training", tags: ["home-management", "housekeeping", "energy-conservation", "IADL"], difficulty: 2 },
  { slug: "ot-home-management-laundry", title: "Laundry Management with Physical Limitations", category: "ADL Training", tags: ["home-management", "laundry", "adaptations", "IADL"], difficulty: 2 },
  { slug: "ot-functional-transfer-training", title: "Functional Transfer Training Techniques", category: "ADL Training", tags: ["transfers", "bed-mobility", "stand-pivot", "sliding-board"], difficulty: 3 },
  { slug: "ot-bed-mobility-positioning", title: "Bed Mobility and Therapeutic Positioning", category: "ADL Training", tags: ["bed-mobility", "positioning", "pressure-relief", "turning"], difficulty: 3 },
  { slug: "ot-adl-assessment-tools", title: "ADL Assessment Tools and Standardized Measures", category: "ADL Training", tags: ["assessment", "FIM", "Barthel", "COPM", "standardized"], difficulty: 3 },
  { slug: "ot-energy-conservation-techniques", title: "Energy Conservation and Work Simplification", category: "ADL Training", tags: ["energy-conservation", "fatigue", "pacing", "work-simplification"], difficulty: 2 },
  { slug: "ot-joint-protection-principles", title: "Joint Protection Principles in Daily Activities", category: "ADL Training", tags: ["joint-protection", "arthritis", "ergonomics", "body-mechanics"], difficulty: 3 },
  { slug: "ot-medication-management-training", title: "Medication Management Training for Independence", category: "ADL Training", tags: ["medication-management", "pill-organizer", "IADL", "cognitive"], difficulty: 3 },
  { slug: "ot-money-management-skills", title: "Money Management and Financial Skills Training", category: "ADL Training", tags: ["money-management", "financial", "IADL", "cognitive"], difficulty: 3 },
  { slug: "ot-telephone-communication-skills", title: "Telephone and Communication Device Training", category: "ADL Training", tags: ["communication", "telephone", "AAC", "technology"], difficulty: 2 },
  { slug: "ot-shopping-skills-training", title: "Shopping Skills and Community Reintegration", category: "ADL Training", tags: ["shopping", "community", "IADL", "cognitive"], difficulty: 3 },
  { slug: "ot-adl-spinal-cord-injury", title: "ADL Training for Spinal Cord Injury by Level", category: "ADL Training", tags: ["SCI", "ADL", "quadriplegia", "paraplegia", "functional-level"], difficulty: 4 },
  { slug: "ot-adl-traumatic-brain-injury", title: "ADL Retraining After Traumatic Brain Injury", category: "ADL Training", tags: ["TBI", "ADL", "cognitive", "retraining"], difficulty: 4 },
  { slug: "ot-adl-multiple-sclerosis", title: "ADL Strategies for Multiple Sclerosis", category: "ADL Training", tags: ["MS", "ADL", "fatigue", "progressive"], difficulty: 3 },
  { slug: "ot-adl-parkinsons-disease", title: "ADL Adaptations for Parkinson's Disease", category: "ADL Training", tags: ["parkinsons", "ADL", "tremor", "rigidity", "freezing"], difficulty: 3 },
  { slug: "ot-adl-burns-rehabilitation", title: "ADL Training in Burns Rehabilitation", category: "ADL Training", tags: ["burns", "ADL", "scar-management", "ROM"], difficulty: 4 },
  { slug: "ot-adl-amputation-prosthetics", title: "ADL Training with Upper Extremity Prosthetics", category: "ADL Training", tags: ["amputation", "prosthetics", "UE", "functional-training"], difficulty: 4 },
  { slug: "ot-adl-low-vision-strategies", title: "ADL Strategies for Low Vision and Blindness", category: "ADL Training", tags: ["low-vision", "blindness", "ADL", "compensatory"], difficulty: 3 },
  { slug: "ot-sexual-activity-adaptations", title: "Sexual Activity Adaptations and Counseling in OT", category: "ADL Training", tags: ["sexuality", "ADL", "positioning", "counseling"], difficulty: 3 },
  { slug: "ot-driving-rehabilitation", title: "Driving Rehabilitation and Community Mobility Assessment", category: "ADL Training", tags: ["driving", "rehabilitation", "assessment", "IADL"], difficulty: 4 },
  { slug: "ot-pet-care-adaptations", title: "Pet Care and Animal-Assisted Activities Adaptations", category: "ADL Training", tags: ["pet-care", "IADL", "adaptations", "therapeutic"], difficulty: 2 },

  // ==================== Assistive Devices (40 lessons) ====================
  { slug: "ot-wheelchair-assessment-selection", title: "Wheelchair Assessment and Selection Principles", category: "Assistive Devices", tags: ["wheelchair", "assessment", "selection", "seating"], difficulty: 3 },
  { slug: "ot-wheelchair-seating-positioning", title: "Wheelchair Seating and Positioning Systems", category: "Assistive Devices", tags: ["wheelchair", "seating", "positioning", "cushions"], difficulty: 4 },
  { slug: "ot-wheelchair-pressure-mapping", title: "Pressure Mapping and Cushion Selection", category: "Assistive Devices", tags: ["wheelchair", "pressure-mapping", "cushion", "pressure-injury"], difficulty: 4 },
  { slug: "ot-power-wheelchair-controls", title: "Power Wheelchair Controls and Access Methods", category: "Assistive Devices", tags: ["power-wheelchair", "controls", "joystick", "alternative-access"], difficulty: 4 },
  { slug: "ot-manual-wheelchair-propulsion", title: "Manual Wheelchair Propulsion Biomechanics", category: "Assistive Devices", tags: ["manual-wheelchair", "propulsion", "biomechanics", "shoulder-preservation"], difficulty: 3 },
  { slug: "ot-static-splinting-principles", title: "Static Splinting Principles and Fabrication", category: "Assistive Devices", tags: ["splinting", "static", "fabrication", "orthosis"], difficulty: 3 },
  { slug: "ot-dynamic-splinting-applications", title: "Dynamic Splinting Applications", category: "Assistive Devices", tags: ["splinting", "dynamic", "mobilization", "orthosis"], difficulty: 4 },
  { slug: "ot-resting-hand-splint", title: "Resting Hand Splint Design and Application", category: "Assistive Devices", tags: ["splinting", "resting-hand", "fabrication", "positioning"], difficulty: 3 },
  { slug: "ot-wrist-cock-up-splint", title: "Wrist Cock-Up Splint Fabrication", category: "Assistive Devices", tags: ["splinting", "wrist", "cock-up", "tenodesis"], difficulty: 3 },
  { slug: "ot-thumb-spica-splint", title: "Thumb Spica Splint Indications and Fabrication", category: "Assistive Devices", tags: ["splinting", "thumb-spica", "CMC", "de-quervains"], difficulty: 3 },
  { slug: "ot-serial-casting-techniques", title: "Serial Casting Techniques for Contracture Management", category: "Assistive Devices", tags: ["serial-casting", "contracture", "ROM", "spasticity"], difficulty: 4 },
  { slug: "ot-upper-extremity-orthotics", title: "Upper Extremity Orthotics Overview", category: "Assistive Devices", tags: ["orthotics", "UE", "elbow", "shoulder", "orthosis"], difficulty: 3 },
  { slug: "ot-lower-extremity-orthotics-ot", title: "Lower Extremity Orthotics in OT Practice", category: "Assistive Devices", tags: ["orthotics", "LE", "AFO", "gait", "orthosis"], difficulty: 3 },
  { slug: "ot-adaptive-equipment-overview", title: "Adaptive Equipment Overview for Daily Living", category: "Assistive Devices", tags: ["adaptive-equipment", "ADL", "reachers", "sock-aids"], difficulty: 2 },
  { slug: "ot-bathroom-equipment-selection", title: "Bathroom Equipment Selection and Installation", category: "Assistive Devices", tags: ["bathroom-equipment", "shower-chair", "commode", "grab-bars"], difficulty: 2 },
  { slug: "ot-kitchen-adaptive-equipment", title: "Kitchen Adaptive Equipment and Modifications", category: "Assistive Devices", tags: ["kitchen", "adaptive-equipment", "cutting-boards", "jar-openers"], difficulty: 2 },
  { slug: "ot-assistive-technology-overview", title: "Assistive Technology for Independence", category: "Assistive Devices", tags: ["assistive-technology", "AT", "electronic", "smart-home"], difficulty: 3 },
  { slug: "ot-augmentative-communication-devices", title: "Augmentative and Alternative Communication Devices", category: "Assistive Devices", tags: ["AAC", "communication", "speech-generating", "assistive-technology"], difficulty: 3 },
  { slug: "ot-computer-access-adaptations", title: "Computer Access and Keyboard Adaptations", category: "Assistive Devices", tags: ["computer-access", "keyboard", "mouse", "ergonomics"], difficulty: 3 },
  { slug: "ot-environmental-control-units", title: "Environmental Control Units (ECUs)", category: "Assistive Devices", tags: ["ECU", "smart-home", "independence", "SCI"], difficulty: 3 },
  { slug: "ot-home-modification-assessment", title: "Home Modification Assessment and Recommendations", category: "Assistive Devices", tags: ["home-modification", "accessibility", "universal-design", "assessment"], difficulty: 3 },
  { slug: "ot-workplace-ergonomic-assessment", title: "Workplace Ergonomic Assessment and Modification", category: "Assistive Devices", tags: ["ergonomics", "workplace", "workstation", "prevention"], difficulty: 3 },
  { slug: "ot-walking-aid-selection", title: "Walking Aid Selection and Training in OT", category: "Assistive Devices", tags: ["walking-aids", "cane", "walker", "mobility"], difficulty: 2 },
  { slug: "ot-standing-frames-devices", title: "Standing Frames and Weight-Bearing Devices", category: "Assistive Devices", tags: ["standing-frame", "weight-bearing", "SCI", "tilt-table"], difficulty: 3 },
  { slug: "ot-robotic-assistive-devices", title: "Robotic Assistive Devices in Rehabilitation", category: "Assistive Devices", tags: ["robotics", "rehabilitation", "assistive", "technology"], difficulty: 4 },
  { slug: "ot-3d-printing-assistive-devices", title: "3D Printing for Custom Assistive Devices", category: "Assistive Devices", tags: ["3d-printing", "custom", "assistive-devices", "innovation"], difficulty: 3 },
  { slug: "ot-vision-assistive-devices", title: "Vision Assistive Devices and Magnification", category: "Assistive Devices", tags: ["vision", "magnification", "low-vision", "assistive-devices"], difficulty: 2 },
  { slug: "ot-hearing-assistive-devices", title: "Hearing Assistive Technology in OT Practice", category: "Assistive Devices", tags: ["hearing", "assistive-technology", "communication", "accessibility"], difficulty: 2 },
  { slug: "ot-pediatric-adaptive-equipment", title: "Pediatric Adaptive Equipment and Positioning", category: "Assistive Devices", tags: ["pediatric", "adaptive-equipment", "positioning", "seating"], difficulty: 3 },
  { slug: "ot-splint-wearing-schedule", title: "Splint Wearing Schedules and Patient Education", category: "Assistive Devices", tags: ["splinting", "wearing-schedule", "education", "compliance"], difficulty: 2 },
  { slug: "ot-thermoplastic-materials", title: "Thermoplastic Materials for Splint Fabrication", category: "Assistive Devices", tags: ["thermoplastic", "materials", "splinting", "fabrication"], difficulty: 3 },
  { slug: "ot-prosthetic-training-ue", title: "Upper Extremity Prosthetic Training Programs", category: "Assistive Devices", tags: ["prosthetics", "UE", "training", "myoelectric"], difficulty: 4 },
  { slug: "ot-mobile-arm-supports", title: "Mobile Arm Supports and Suspension Slings", category: "Assistive Devices", tags: ["mobile-arm-support", "suspension-sling", "weakness", "SCI"], difficulty: 3 },
  { slug: "ot-electronic-aids-daily-living", title: "Electronic Aids to Daily Living (EADL)", category: "Assistive Devices", tags: ["EADL", "electronic", "independence", "switches"], difficulty: 3 },
  { slug: "ot-vehicle-modifications", title: "Vehicle Modifications for Drivers with Disabilities", category: "Assistive Devices", tags: ["vehicle-modification", "driving", "hand-controls", "accessibility"], difficulty: 3 },
  { slug: "ot-recreational-adaptive-equipment", title: "Recreational and Leisure Adaptive Equipment", category: "Assistive Devices", tags: ["recreation", "leisure", "adaptive-sports", "equipment"], difficulty: 2 },
  { slug: "ot-writing-adaptive-devices", title: "Writing Adaptive Devices and Techniques", category: "Assistive Devices", tags: ["writing", "adaptive", "grip", "built-up-pen"], difficulty: 2 },
  { slug: "ot-switch-access-assessment", title: "Switch Access Assessment for Assistive Technology", category: "Assistive Devices", tags: ["switch-access", "assessment", "AT", "input-devices"], difficulty: 4 },
  { slug: "ot-pressure-relief-devices", title: "Pressure Relief Devices and Positioning Strategies", category: "Assistive Devices", tags: ["pressure-relief", "positioning", "cushions", "mattresses"], difficulty: 3 },
  { slug: "ot-at-funding-advocacy", title: "Assistive Technology Funding and Advocacy", category: "Assistive Devices", tags: ["funding", "advocacy", "AT", "insurance", "policy"], difficulty: 2 },

  // ==================== Stroke Rehabilitation (40 lessons) ====================
  { slug: "ot-stroke-ue-recovery-stages", title: "Brunnstrom Stages of Motor Recovery Post-Stroke", category: "Stroke Rehabilitation", tags: ["stroke", "brunnstrom", "motor-recovery", "stages"], difficulty: 3 },
  { slug: "ot-stroke-motor-relearning-program", title: "Motor Relearning Program for Stroke Rehabilitation", category: "Stroke Rehabilitation", tags: ["stroke", "motor-relearning", "task-specific", "neuroplasticity"], difficulty: 4 },
  { slug: "ot-constraint-induced-movement-therapy", title: "Constraint-Induced Movement Therapy (CIMT)", category: "Stroke Rehabilitation", tags: ["CIMT", "stroke", "constraint-induced", "UE-recovery"], difficulty: 4 },
  { slug: "ot-stroke-neuroplasticity-principles", title: "Neuroplasticity Principles in Stroke Recovery", category: "Stroke Rehabilitation", tags: ["neuroplasticity", "stroke", "recovery", "brain-plasticity"], difficulty: 4 },
  { slug: "ot-stroke-functional-task-training", title: "Functional Task Training After Stroke", category: "Stroke Rehabilitation", tags: ["stroke", "functional-task", "task-oriented", "ADL"], difficulty: 3 },
  { slug: "ot-stroke-spasticity-management", title: "Spasticity Management in Stroke Rehabilitation", category: "Stroke Rehabilitation", tags: ["spasticity", "stroke", "tone-management", "positioning"], difficulty: 4 },
  { slug: "ot-stroke-shoulder-subluxation", title: "Shoulder Subluxation Prevention and Management Post-Stroke", category: "Stroke Rehabilitation", tags: ["shoulder", "subluxation", "stroke", "positioning", "sling"], difficulty: 3 },
  { slug: "ot-stroke-unilateral-neglect", title: "Unilateral Neglect Assessment and Intervention", category: "Stroke Rehabilitation", tags: ["neglect", "unilateral", "stroke", "awareness-training"], difficulty: 4 },
  { slug: "ot-stroke-visual-field-deficits", title: "Visual Field Deficits After Stroke", category: "Stroke Rehabilitation", tags: ["visual-field", "hemianopia", "stroke", "scanning"], difficulty: 3 },
  { slug: "ot-stroke-apraxia-intervention", title: "Apraxia Intervention Strategies Post-Stroke", category: "Stroke Rehabilitation", tags: ["apraxia", "stroke", "motor-planning", "gesture"], difficulty: 4 },
  { slug: "ot-stroke-bilateral-training", title: "Bilateral Arm Training After Stroke", category: "Stroke Rehabilitation", tags: ["bilateral-training", "stroke", "UE", "coordination"], difficulty: 3 },
  { slug: "ot-stroke-mirror-therapy", title: "Mirror Therapy for Stroke Rehabilitation", category: "Stroke Rehabilitation", tags: ["mirror-therapy", "stroke", "visual-feedback", "motor-recovery"], difficulty: 3 },
  { slug: "ot-stroke-electrical-stimulation", title: "Neuromuscular Electrical Stimulation Post-Stroke", category: "Stroke Rehabilitation", tags: ["NMES", "FES", "stroke", "electrical-stimulation"], difficulty: 4 },
  { slug: "ot-stroke-virtual-reality-rehab", title: "Virtual Reality Applications in Stroke Rehabilitation", category: "Stroke Rehabilitation", tags: ["virtual-reality", "stroke", "technology", "gamification"], difficulty: 3 },
  { slug: "ot-stroke-edema-management", title: "Edema Management in the Hemiplegic Upper Extremity", category: "Stroke Rehabilitation", tags: ["edema", "stroke", "hemiplegia", "lymphedema"], difficulty: 3 },
  { slug: "ot-stroke-pain-management", title: "Pain Syndromes Post-Stroke: Assessment and Management", category: "Stroke Rehabilitation", tags: ["pain", "CRPS", "stroke", "shoulder-pain"], difficulty: 4 },
  { slug: "ot-stroke-hand-recovery", title: "Hand Function Recovery After Stroke", category: "Stroke Rehabilitation", tags: ["hand", "stroke", "grasp", "pinch", "fine-motor"], difficulty: 4 },
  { slug: "ot-stroke-assessment-tools", title: "Stroke-Specific Assessment Tools in OT", category: "Stroke Rehabilitation", tags: ["assessment", "stroke", "FMA", "ARAT", "outcome-measures"], difficulty: 3 },
  { slug: "ot-stroke-cognitive-sequelae", title: "Cognitive Sequelae of Stroke and OT Interventions", category: "Stroke Rehabilitation", tags: ["cognitive", "stroke", "attention", "memory", "executive"], difficulty: 4 },
  { slug: "ot-stroke-dysphagia-ot-role", title: "OT Role in Dysphagia Management Post-Stroke", category: "Stroke Rehabilitation", tags: ["dysphagia", "stroke", "feeding", "swallowing"], difficulty: 3 },
  { slug: "ot-stroke-driving-return", title: "Return to Driving After Stroke", category: "Stroke Rehabilitation", tags: ["driving", "stroke", "community", "assessment"], difficulty: 3 },
  { slug: "ot-stroke-home-exercise-programs", title: "Home Exercise Programs for Stroke Survivors", category: "Stroke Rehabilitation", tags: ["HEP", "stroke", "exercise", "self-management"], difficulty: 2 },
  { slug: "ot-stroke-caregiver-training", title: "Caregiver Training in Stroke Rehabilitation", category: "Stroke Rehabilitation", tags: ["caregiver", "stroke", "education", "family"], difficulty: 2 },
  { slug: "ot-stroke-acute-care-ot", title: "Acute Care OT Intervention After Stroke", category: "Stroke Rehabilitation", tags: ["acute-care", "stroke", "early-mobilization", "positioning"], difficulty: 3 },
  { slug: "ot-stroke-inpatient-rehab", title: "Inpatient Rehabilitation Approaches After Stroke", category: "Stroke Rehabilitation", tags: ["inpatient", "rehabilitation", "stroke", "interdisciplinary"], difficulty: 3 },
  { slug: "ot-stroke-community-reintegration", title: "Community Reintegration After Stroke", category: "Stroke Rehabilitation", tags: ["community", "reintegration", "stroke", "participation"], difficulty: 3 },
  { slug: "ot-stroke-upper-extremity-robotics", title: "Robotic-Assisted Upper Extremity Training Post-Stroke", category: "Stroke Rehabilitation", tags: ["robotics", "stroke", "UE", "technology"], difficulty: 4 },
  { slug: "ot-stroke-mental-practice", title: "Mental Practice and Motor Imagery in Stroke Recovery", category: "Stroke Rehabilitation", tags: ["mental-practice", "motor-imagery", "stroke", "neuroplasticity"], difficulty: 3 },
  { slug: "ot-stroke-task-specific-repetitive", title: "Task-Specific Repetitive Training Post-Stroke", category: "Stroke Rehabilitation", tags: ["task-specific", "repetitive", "stroke", "intensity"], difficulty: 3 },
  { slug: "ot-stroke-trunk-control", title: "Trunk Control and Postural Stability After Stroke", category: "Stroke Rehabilitation", tags: ["trunk-control", "posture", "stroke", "balance"], difficulty: 3 },
  { slug: "ot-stroke-pusher-syndrome", title: "Pusher Syndrome Assessment and Intervention", category: "Stroke Rehabilitation", tags: ["pusher-syndrome", "stroke", "lateropulsion", "balance"], difficulty: 4 },
  { slug: "ot-stroke-contracture-prevention", title: "Contracture Prevention in Stroke Rehabilitation", category: "Stroke Rehabilitation", tags: ["contracture", "prevention", "stroke", "ROM", "stretching"], difficulty: 3 },
  { slug: "ot-stroke-sensation-retraining", title: "Sensory Re-education After Stroke", category: "Stroke Rehabilitation", tags: ["sensation", "re-education", "stroke", "proprioception"], difficulty: 3 },
  { slug: "ot-stroke-emotional-adjustment", title: "Emotional Adjustment and Depression After Stroke", category: "Stroke Rehabilitation", tags: ["depression", "emotional", "stroke", "coping", "psychosocial"], difficulty: 3 },
  { slug: "ot-stroke-right-hemisphere-syndrome", title: "Right Hemisphere Stroke Syndrome in OT", category: "Stroke Rehabilitation", tags: ["right-hemisphere", "stroke", "neglect", "spatial"], difficulty: 4 },
  { slug: "ot-stroke-left-hemisphere-aphasia", title: "Left Hemisphere Stroke and Aphasia Considerations in OT", category: "Stroke Rehabilitation", tags: ["left-hemisphere", "aphasia", "communication", "stroke"], difficulty: 3 },
  { slug: "ot-stroke-neurodevelopmental-treatment", title: "Neurodevelopmental Treatment (NDT/Bobath) Approach", category: "Stroke Rehabilitation", tags: ["NDT", "bobath", "stroke", "treatment-approach"], difficulty: 4 },
  { slug: "ot-stroke-proprioceptive-neuromuscular", title: "PNF Techniques in Stroke Rehabilitation", category: "Stroke Rehabilitation", tags: ["PNF", "stroke", "facilitation", "diagonal-patterns"], difficulty: 4 },
  { slug: "ot-stroke-discharge-planning", title: "Discharge Planning and Transition of Care After Stroke", category: "Stroke Rehabilitation", tags: ["discharge", "transition", "stroke", "continuity"], difficulty: 2 },
  { slug: "ot-stroke-telerehabilitation", title: "Telerehabilitation for Stroke Survivors", category: "Stroke Rehabilitation", tags: ["telerehabilitation", "stroke", "remote", "technology"], difficulty: 3 },

  // ==================== Cognitive Rehabilitation (35 lessons) ====================
  { slug: "ot-memory-strategies-compensatory", title: "Compensatory Memory Strategies in OT", category: "Cognitive Rehabilitation", tags: ["memory", "compensatory", "strategies", "cognitive"], difficulty: 3 },
  { slug: "ot-memory-restorative-approaches", title: "Restorative Memory Rehabilitation Approaches", category: "Cognitive Rehabilitation", tags: ["memory", "restorative", "errorless-learning", "spaced-retrieval"], difficulty: 4 },
  { slug: "ot-memory-external-aids", title: "External Memory Aids and Technology Solutions", category: "Cognitive Rehabilitation", tags: ["memory", "external-aids", "technology", "smartphones"], difficulty: 2 },
  { slug: "ot-executive-function-training", title: "Executive Function Training in OT", category: "Cognitive Rehabilitation", tags: ["executive-function", "planning", "organization", "cognitive"], difficulty: 4 },
  { slug: "ot-executive-function-goal-management", title: "Goal Management Training for Executive Dysfunction", category: "Cognitive Rehabilitation", tags: ["executive-function", "goal-management", "TBI", "frontal-lobe"], difficulty: 4 },
  { slug: "ot-attention-retraining-program", title: "Attention Process Training (APT)", category: "Cognitive Rehabilitation", tags: ["attention", "APT", "retraining", "cognitive"], difficulty: 4 },
  { slug: "ot-attention-sustained-selective", title: "Sustained and Selective Attention Interventions", category: "Cognitive Rehabilitation", tags: ["attention", "sustained", "selective", "cognitive-rehab"], difficulty: 3 },
  { slug: "ot-attention-alternating-divided", title: "Alternating and Divided Attention Training", category: "Cognitive Rehabilitation", tags: ["attention", "alternating", "divided", "multitasking"], difficulty: 4 },
  { slug: "ot-cognitive-assessment-screening", title: "Cognitive Screening and Assessment in OT", category: "Cognitive Rehabilitation", tags: ["cognitive", "assessment", "MoCA", "MMSE", "screening"], difficulty: 3 },
  { slug: "ot-cognitive-behavioral-approaches", title: "Cognitive-Behavioral Approaches in OT Practice", category: "Cognitive Rehabilitation", tags: ["CBT", "cognitive-behavioral", "coping", "self-regulation"], difficulty: 3 },
  { slug: "ot-metacognitive-strategy-training", title: "Metacognitive Strategy Training", category: "Cognitive Rehabilitation", tags: ["metacognition", "self-awareness", "self-monitoring", "strategy"], difficulty: 4 },
  { slug: "ot-visual-perception-assessment", title: "Visual-Perceptual Assessment in OT", category: "Cognitive Rehabilitation", tags: ["visual-perception", "assessment", "MVPT", "visual-processing"], difficulty: 3 },
  { slug: "ot-visual-perceptual-interventions", title: "Visual-Perceptual Intervention Strategies", category: "Cognitive Rehabilitation", tags: ["visual-perception", "intervention", "figure-ground", "spatial-relations"], difficulty: 3 },
  { slug: "ot-cognitive-rehabilitation-tbi", title: "Cognitive Rehabilitation Following TBI", category: "Cognitive Rehabilitation", tags: ["TBI", "cognitive-rehab", "recovery", "brain-injury"], difficulty: 4 },
  { slug: "ot-cognitive-dementia-interventions", title: "Cognitive Interventions for Dementia", category: "Cognitive Rehabilitation", tags: ["dementia", "cognitive", "Alzheimers", "interventions"], difficulty: 3 },
  { slug: "ot-cognitive-mild-cognitive-impairment", title: "Mild Cognitive Impairment: OT Assessment and Intervention", category: "Cognitive Rehabilitation", tags: ["MCI", "cognitive", "early-intervention", "prevention"], difficulty: 3 },
  { slug: "ot-problem-solving-training", title: "Problem-Solving Skills Training in Cognitive Rehab", category: "Cognitive Rehabilitation", tags: ["problem-solving", "cognitive", "reasoning", "strategy"], difficulty: 3 },
  { slug: "ot-cognitive-processing-speed", title: "Processing Speed Interventions in OT", category: "Cognitive Rehabilitation", tags: ["processing-speed", "cognitive", "timed-activities", "efficiency"], difficulty: 3 },
  { slug: "ot-cognitive-functional-assessment", title: "Functional Cognition Assessment Tools", category: "Cognitive Rehabilitation", tags: ["functional-cognition", "EFPT", "assessment", "real-world"], difficulty: 3 },
  { slug: "ot-orientation-reality-training", title: "Orientation and Reality-Based Training", category: "Cognitive Rehabilitation", tags: ["orientation", "reality", "confusion", "TBI"], difficulty: 2 },
  { slug: "ot-cognitive-computer-based-training", title: "Computer-Based Cognitive Training Programs", category: "Cognitive Rehabilitation", tags: ["computer-based", "cognitive-training", "technology", "apps"], difficulty: 2 },
  { slug: "ot-cognitive-group-interventions", title: "Group-Based Cognitive Rehabilitation", category: "Cognitive Rehabilitation", tags: ["group", "cognitive-rehab", "social", "peer"], difficulty: 2 },
  { slug: "ot-sequencing-task-analysis", title: "Sequencing and Task Analysis in Cognitive Rehab", category: "Cognitive Rehabilitation", tags: ["sequencing", "task-analysis", "step-by-step", "cognitive"], difficulty: 3 },
  { slug: "ot-cognitive-safety-awareness", title: "Safety Awareness Training for Cognitive Impairment", category: "Cognitive Rehabilitation", tags: ["safety", "awareness", "judgment", "risk-assessment"], difficulty: 3 },
  { slug: "ot-cognitive-errorless-learning", title: "Errorless Learning Techniques in OT", category: "Cognitive Rehabilitation", tags: ["errorless-learning", "cognitive", "procedural", "training"], difficulty: 3 },
  { slug: "ot-cognitive-dual-task-training", title: "Dual-Task Training and Cognitive-Motor Integration", category: "Cognitive Rehabilitation", tags: ["dual-task", "cognitive-motor", "multitasking", "falls"], difficulty: 3 },
  { slug: "ot-cognitive-aging-interventions", title: "Cognitive Interventions for Healthy Aging", category: "Cognitive Rehabilitation", tags: ["aging", "cognitive", "prevention", "healthy-aging"], difficulty: 2 },
  { slug: "ot-executive-dysfunction-adl-impact", title: "Executive Dysfunction Impact on Daily Activities", category: "Cognitive Rehabilitation", tags: ["executive-dysfunction", "ADL", "planning", "initiation"], difficulty: 3 },
  { slug: "ot-cognitive-fatigue-management", title: "Cognitive Fatigue Management Strategies", category: "Cognitive Rehabilitation", tags: ["cognitive-fatigue", "brain-injury", "pacing", "management"], difficulty: 3 },
  { slug: "ot-agitation-behavioral-management", title: "Agitation and Behavioral Management in Cognitive Rehab", category: "Cognitive Rehabilitation", tags: ["agitation", "behavior", "TBI", "de-escalation"], difficulty: 4 },
  { slug: "ot-constructional-praxis-interventions", title: "Constructional Praxis and Body Scheme Disorders", category: "Cognitive Rehabilitation", tags: ["constructional-praxis", "body-scheme", "spatial", "perception"], difficulty: 4 },
  { slug: "ot-cognitive-rehabilitation-evidence", title: "Evidence Base for Cognitive Rehabilitation in OT", category: "Cognitive Rehabilitation", tags: ["evidence-based", "cognitive-rehab", "research", "outcomes"], difficulty: 3 },
  { slug: "ot-anosognosia-self-awareness", title: "Anosognosia and Self-Awareness Deficits", category: "Cognitive Rehabilitation", tags: ["anosognosia", "self-awareness", "insight", "TBI"], difficulty: 4 },
  { slug: "ot-cognitive-return-to-work", title: "Cognitive Rehabilitation for Return to Work", category: "Cognitive Rehabilitation", tags: ["return-to-work", "cognitive", "vocational", "workplace"], difficulty: 3 },
  { slug: "ot-cognitive-pediatric-interventions", title: "Pediatric Cognitive Rehabilitation Approaches", category: "Cognitive Rehabilitation", tags: ["pediatric", "cognitive", "development", "school"], difficulty: 3 },

  // ==================== Hand Therapy (40 lessons) ====================
  { slug: "ot-flexor-tendon-repair-protocols", title: "Flexor Tendon Repair Rehabilitation Protocols", category: "Hand Therapy", tags: ["flexor-tendon", "repair", "protocol", "Duran", "Kleinert"], difficulty: 5 },
  { slug: "ot-extensor-tendon-repair-protocols", title: "Extensor Tendon Repair Rehabilitation Protocols", category: "Hand Therapy", tags: ["extensor-tendon", "repair", "zones", "protocol"], difficulty: 5 },
  { slug: "ot-flexor-tendon-zones", title: "Flexor Tendon Zones and Surgical Considerations", category: "Hand Therapy", tags: ["flexor-tendon", "zones", "anatomy", "no-mans-land"], difficulty: 4 },
  { slug: "ot-median-nerve-injury", title: "Median Nerve Injury Rehabilitation", category: "Hand Therapy", tags: ["median-nerve", "carpal-tunnel", "nerve-injury", "sensation"], difficulty: 4 },
  { slug: "ot-ulnar-nerve-injury", title: "Ulnar Nerve Injury Rehabilitation", category: "Hand Therapy", tags: ["ulnar-nerve", "cubital-tunnel", "claw-hand", "nerve-injury"], difficulty: 4 },
  { slug: "ot-radial-nerve-injury", title: "Radial Nerve Injury and Wrist Drop Management", category: "Hand Therapy", tags: ["radial-nerve", "wrist-drop", "nerve-injury", "splinting"], difficulty: 4 },
  { slug: "ot-peripheral-nerve-repair", title: "Peripheral Nerve Repair and Regeneration", category: "Hand Therapy", tags: ["nerve-repair", "regeneration", "Tinel", "sensory-re-education"], difficulty: 4 },
  { slug: "ot-brachial-plexus-injury", title: "Brachial Plexus Injury Rehabilitation", category: "Hand Therapy", tags: ["brachial-plexus", "erb-palsy", "nerve-injury", "UE"], difficulty: 5 },
  { slug: "ot-distal-radius-fracture-rehab", title: "Distal Radius Fracture Rehabilitation", category: "Hand Therapy", tags: ["distal-radius", "Colles", "fracture", "wrist"], difficulty: 3 },
  { slug: "ot-metacarpal-fracture-management", title: "Metacarpal Fracture Management", category: "Hand Therapy", tags: ["metacarpal", "fracture", "Boxers", "splinting"], difficulty: 3 },
  { slug: "ot-phalangeal-fracture-rehabilitation", title: "Phalangeal Fracture Rehabilitation", category: "Hand Therapy", tags: ["phalanx", "fracture", "buddy-taping", "finger"], difficulty: 3 },
  { slug: "ot-scaphoid-fracture-management", title: "Scaphoid Fracture Management and Rehabilitation", category: "Hand Therapy", tags: ["scaphoid", "fracture", "thumb-spica", "avascular-necrosis"], difficulty: 4 },
  { slug: "ot-edema-control-hand-therapy", title: "Edema Control Techniques in Hand Therapy", category: "Hand Therapy", tags: ["edema", "retrograde-massage", "compression", "elevation"], difficulty: 3 },
  { slug: "ot-scar-management-hand", title: "Scar Management in Hand Rehabilitation", category: "Hand Therapy", tags: ["scar", "massage", "silicone", "desensitization"], difficulty: 3 },
  { slug: "ot-therapeutic-exercise-hand", title: "Therapeutic Exercise Programs for the Hand", category: "Hand Therapy", tags: ["exercise", "strengthening", "ROM", "hand"], difficulty: 3 },
  { slug: "ot-grip-pinch-strengthening", title: "Grip and Pinch Strengthening Programs", category: "Hand Therapy", tags: ["grip", "pinch", "strengthening", "dynamometer"], difficulty: 3 },
  { slug: "ot-tendon-gliding-exercises", title: "Tendon Gliding and Nerve Gliding Exercises", category: "Hand Therapy", tags: ["tendon-gliding", "nerve-gliding", "exercises", "mobilization"], difficulty: 3 },
  { slug: "ot-dupuytrens-contracture", title: "Dupuytren's Contracture Management in OT", category: "Hand Therapy", tags: ["dupuytrens", "contracture", "fasciectomy", "splinting"], difficulty: 4 },
  { slug: "ot-trigger-finger-management", title: "Trigger Finger Management and Rehabilitation", category: "Hand Therapy", tags: ["trigger-finger", "stenosing-tenosynovitis", "splinting", "injection"], difficulty: 3 },
  { slug: "ot-de-quervains-tenosynovitis", title: "De Quervain's Tenosynovitis Management", category: "Hand Therapy", tags: ["de-quervains", "tenosynovitis", "thumb", "Finkelstein"], difficulty: 3 },
  { slug: "ot-lateral-epicondylitis", title: "Lateral Epicondylitis (Tennis Elbow) Rehabilitation", category: "Hand Therapy", tags: ["lateral-epicondylitis", "tennis-elbow", "wrist-extensors", "eccentric"], difficulty: 3 },
  { slug: "ot-carpal-tunnel-syndrome", title: "Carpal Tunnel Syndrome: Conservative Management", category: "Hand Therapy", tags: ["carpal-tunnel", "CTS", "splinting", "nerve-gliding"], difficulty: 3 },
  { slug: "ot-cmc-joint-osteoarthritis", title: "CMC Joint Osteoarthritis Management", category: "Hand Therapy", tags: ["CMC", "osteoarthritis", "thumb", "splinting", "joint-protection"], difficulty: 3 },
  { slug: "ot-rheumatoid-arthritis-hand", title: "Rheumatoid Arthritis: Hand Management in OT", category: "Hand Therapy", tags: ["rheumatoid-arthritis", "hand", "joint-protection", "deformities"], difficulty: 4 },
  { slug: "ot-mallet-finger-boutonniere", title: "Mallet Finger and Boutonniere Deformity Management", category: "Hand Therapy", tags: ["mallet-finger", "boutonniere", "extensor", "splinting"], difficulty: 4 },
  { slug: "ot-swan-neck-deformity", title: "Swan Neck Deformity: Assessment and Intervention", category: "Hand Therapy", tags: ["swan-neck", "deformity", "PIP", "ring-splint"], difficulty: 4 },
  { slug: "ot-complex-regional-pain-syndrome", title: "Complex Regional Pain Syndrome (CRPS) in Hand Therapy", category: "Hand Therapy", tags: ["CRPS", "RSD", "pain", "desensitization", "mirror-therapy"], difficulty: 5 },
  { slug: "ot-replantation-rehabilitation", title: "Digit Replantation Rehabilitation", category: "Hand Therapy", tags: ["replantation", "microsurgery", "digit", "rehabilitation"], difficulty: 5 },
  { slug: "ot-hand-burns-rehabilitation", title: "Hand Burns Rehabilitation and Scar Prevention", category: "Hand Therapy", tags: ["burns", "hand", "scar", "contracture", "splinting"], difficulty: 4 },
  { slug: "ot-joint-mobilization-hand", title: "Joint Mobilization Techniques for the Hand", category: "Hand Therapy", tags: ["joint-mobilization", "hand", "stiffness", "manual-therapy"], difficulty: 4 },
  { slug: "ot-hand-assessment-tools", title: "Hand Therapy Assessment Tools and Outcome Measures", category: "Hand Therapy", tags: ["assessment", "DASH", "goniometry", "grip-strength", "outcome"], difficulty: 3 },
  { slug: "ot-sensory-re-education-hand", title: "Sensory Re-education Techniques for the Hand", category: "Hand Therapy", tags: ["sensory", "re-education", "nerve-injury", "discrimination"], difficulty: 3 },
  { slug: "ot-fluidotherapy-paraffin-wax", title: "Fluidotherapy and Paraffin Wax Treatment in Hand Therapy", category: "Hand Therapy", tags: ["fluidotherapy", "paraffin", "thermal", "modalities"], difficulty: 2 },
  { slug: "ot-ultrasound-iontophoresis-hand", title: "Ultrasound and Iontophoresis in Hand Therapy", category: "Hand Therapy", tags: ["ultrasound", "iontophoresis", "modalities", "inflammation"], difficulty: 3 },
  { slug: "ot-work-hardening-hand-injuries", title: "Work Hardening Programs for Hand Injuries", category: "Hand Therapy", tags: ["work-hardening", "FCE", "return-to-work", "hand"], difficulty: 3 },
  { slug: "ot-pediatric-hand-conditions", title: "Pediatric Hand Conditions and Interventions", category: "Hand Therapy", tags: ["pediatric", "hand", "congenital", "syndactyly"], difficulty: 4 },
  { slug: "ot-wrist-instability-management", title: "Wrist Instability and Ligament Injury Management", category: "Hand Therapy", tags: ["wrist", "instability", "TFCC", "ligament"], difficulty: 4 },
  { slug: "ot-tendon-transfer-rehabilitation", title: "Tendon Transfer Rehabilitation in Hand Therapy", category: "Hand Therapy", tags: ["tendon-transfer", "rehabilitation", "retraining", "nerve-injury"], difficulty: 5 },
  { slug: "ot-hand-therapy-wound-care", title: "Wound Care Principles in Hand Therapy", category: "Hand Therapy", tags: ["wound-care", "healing", "dressing", "hand"], difficulty: 3 },
  { slug: "ot-hand-functional-capacity-evaluation", title: "Functional Capacity Evaluation for Hand Injuries", category: "Hand Therapy", tags: ["FCE", "functional-capacity", "work", "hand-injuries"], difficulty: 3 },

  // ==================== Pediatric Developmental Therapy (43 lessons) ====================
  { slug: "ot-sensory-integration-theory", title: "Sensory Integration Theory and Application", category: "Pediatric Developmental Therapy", tags: ["sensory-integration", "Ayres", "theory", "pediatric"], difficulty: 4 },
  { slug: "ot-sensory-processing-disorder", title: "Sensory Processing Disorder Assessment and Intervention", category: "Pediatric Developmental Therapy", tags: ["sensory-processing", "SPD", "assessment", "intervention"], difficulty: 4 },
  { slug: "ot-sensory-diet-strategies", title: "Sensory Diet Development and Implementation", category: "Pediatric Developmental Therapy", tags: ["sensory-diet", "activities", "regulation", "pediatric"], difficulty: 3 },
  { slug: "ot-sensory-modulation-disorders", title: "Sensory Modulation Disorders in Children", category: "Pediatric Developmental Therapy", tags: ["sensory-modulation", "over-responsive", "under-responsive", "seeking"], difficulty: 4 },
  { slug: "ot-vestibular-processing-interventions", title: "Vestibular Processing Interventions", category: "Pediatric Developmental Therapy", tags: ["vestibular", "balance", "movement", "sensory"], difficulty: 3 },
  { slug: "ot-proprioceptive-interventions", title: "Proprioceptive Input Activities and Interventions", category: "Pediatric Developmental Therapy", tags: ["proprioception", "heavy-work", "body-awareness", "sensory"], difficulty: 3 },
  { slug: "ot-tactile-defensiveness-intervention", title: "Tactile Defensiveness Intervention Strategies", category: "Pediatric Developmental Therapy", tags: ["tactile", "defensiveness", "desensitization", "sensory"], difficulty: 3 },
  { slug: "ot-fine-motor-development-milestones", title: "Fine Motor Development Milestones", category: "Pediatric Developmental Therapy", tags: ["fine-motor", "milestones", "development", "pediatric"], difficulty: 2 },
  { slug: "ot-fine-motor-grasp-patterns", title: "Grasp Pattern Development and Intervention", category: "Pediatric Developmental Therapy", tags: ["grasp", "patterns", "pincer", "palmar", "development"], difficulty: 3 },
  { slug: "ot-handwriting-intervention", title: "Handwriting Readiness and Intervention Programs", category: "Pediatric Developmental Therapy", tags: ["handwriting", "writing", "school", "fine-motor"], difficulty: 3 },
  { slug: "ot-scissor-skills-development", title: "Scissor Skills Development and Training", category: "Pediatric Developmental Therapy", tags: ["scissors", "cutting", "bilateral", "fine-motor"], difficulty: 2 },
  { slug: "ot-visual-motor-integration", title: "Visual-Motor Integration Assessment and Intervention", category: "Pediatric Developmental Therapy", tags: ["visual-motor", "VMI", "Beery", "copying"], difficulty: 3 },
  { slug: "ot-play-based-intervention-theory", title: "Play-Based Intervention Theory and Application", category: "Pediatric Developmental Therapy", tags: ["play", "intervention", "purposeful-activity", "pediatric"], difficulty: 3 },
  { slug: "ot-play-development-stages", title: "Stages of Play Development", category: "Pediatric Developmental Therapy", tags: ["play", "stages", "development", "social-play"], difficulty: 2 },
  { slug: "ot-play-skills-autism", title: "Play Skills Intervention for Children with Autism", category: "Pediatric Developmental Therapy", tags: ["play", "autism", "ASD", "social-skills"], difficulty: 3 },
  { slug: "ot-school-based-ot-practice", title: "School-Based OT Practice and IEP Development", category: "Pediatric Developmental Therapy", tags: ["school-based", "IEP", "education", "IDEA"], difficulty: 3 },
  { slug: "ot-school-function-assessment", title: "School Function and Classroom Modifications", category: "Pediatric Developmental Therapy", tags: ["school", "classroom", "modifications", "participation"], difficulty: 3 },
  { slug: "ot-autism-spectrum-interventions", title: "Autism Spectrum Disorder: OT Interventions", category: "Pediatric Developmental Therapy", tags: ["autism", "ASD", "OT", "intervention", "social"], difficulty: 4 },
  { slug: "ot-adhd-ot-strategies", title: "ADHD: OT Strategies for Self-Regulation", category: "Pediatric Developmental Therapy", tags: ["ADHD", "attention", "self-regulation", "pediatric"], difficulty: 3 },
  { slug: "ot-cerebral-palsy-pediatric", title: "Cerebral Palsy: Pediatric OT Intervention", category: "Pediatric Developmental Therapy", tags: ["cerebral-palsy", "pediatric", "tone", "positioning"], difficulty: 4 },
  { slug: "ot-down-syndrome-interventions", title: "Down Syndrome: OT Developmental Interventions", category: "Pediatric Developmental Therapy", tags: ["down-syndrome", "development", "hypotonia", "pediatric"], difficulty: 3 },
  { slug: "ot-developmental-coordination-disorder", title: "Developmental Coordination Disorder (DCD/Dyspraxia)", category: "Pediatric Developmental Therapy", tags: ["DCD", "dyspraxia", "coordination", "motor-planning"], difficulty: 3 },
  { slug: "ot-feeding-difficulties-pediatric", title: "Pediatric Feeding Difficulties and Oral Motor Intervention", category: "Pediatric Developmental Therapy", tags: ["feeding", "pediatric", "oral-motor", "picky-eating"], difficulty: 4 },
  { slug: "ot-neonatal-ot-nicu", title: "Neonatal OT and NICU Intervention", category: "Pediatric Developmental Therapy", tags: ["NICU", "neonatal", "premature", "developmental-care"], difficulty: 4 },
  { slug: "ot-early-intervention-services", title: "Early Intervention Services (Birth to 3)", category: "Pediatric Developmental Therapy", tags: ["early-intervention", "birth-to-three", "IDEA", "family-centered"], difficulty: 3 },
  { slug: "ot-pediatric-bilateral-coordination", title: "Bilateral Coordination Activities and Training", category: "Pediatric Developmental Therapy", tags: ["bilateral", "coordination", "crossing-midline", "motor"], difficulty: 3 },
  { slug: "ot-pediatric-self-care-skills", title: "Self-Care Skill Development in Children", category: "Pediatric Developmental Therapy", tags: ["self-care", "independence", "pediatric", "ADL"], difficulty: 2 },
  { slug: "ot-pediatric-emotional-regulation", title: "Emotional Regulation Strategies for Children", category: "Pediatric Developmental Therapy", tags: ["emotional-regulation", "self-regulation", "zones-of-regulation", "pediatric"], difficulty: 3 },
  { slug: "ot-pediatric-social-skills-groups", title: "Social Skills Groups in Pediatric OT", category: "Pediatric Developmental Therapy", tags: ["social-skills", "group", "pediatric", "peer-interaction"], difficulty: 3 },
  { slug: "ot-pediatric-assistive-technology", title: "Assistive Technology for Pediatric Clients", category: "Pediatric Developmental Therapy", tags: ["assistive-technology", "pediatric", "switch-access", "AAC"], difficulty: 3 },
  { slug: "ot-developmental-assessment-tools", title: "Pediatric Developmental Assessment Tools", category: "Pediatric Developmental Therapy", tags: ["assessment", "developmental", "PDMS", "BOT", "pediatric"], difficulty: 3 },
  { slug: "ot-pediatric-constraint-induced", title: "Pediatric Constraint-Induced Movement Therapy", category: "Pediatric Developmental Therapy", tags: ["CIMT", "pediatric", "hemiplegia", "UE"], difficulty: 4 },
  { slug: "ot-torticollis-plagiocephaly", title: "Torticollis and Plagiocephaly Management", category: "Pediatric Developmental Therapy", tags: ["torticollis", "plagiocephaly", "positioning", "infant"], difficulty: 3 },
  { slug: "ot-spina-bifida-ot-intervention", title: "Spina Bifida: OT Intervention Across the Lifespan", category: "Pediatric Developmental Therapy", tags: ["spina-bifida", "myelomeningocele", "pediatric", "adaptive"], difficulty: 4 },
  { slug: "ot-juvenile-rheumatoid-arthritis", title: "Juvenile Rheumatoid Arthritis: OT Management", category: "Pediatric Developmental Therapy", tags: ["JRA", "juvenile-arthritis", "joint-protection", "pediatric"], difficulty: 3 },
  { slug: "ot-fetal-alcohol-spectrum", title: "Fetal Alcohol Spectrum Disorders: OT Approach", category: "Pediatric Developmental Therapy", tags: ["FASD", "fetal-alcohol", "cognitive", "behavioral"], difficulty: 3 },
  { slug: "ot-learning-disabilities-ot", title: "Learning Disabilities and OT Intervention", category: "Pediatric Developmental Therapy", tags: ["learning-disabilities", "dyslexia", "school", "academic"], difficulty: 3 },
  { slug: "ot-pediatric-orthopedic-conditions", title: "Pediatric Orthopedic Conditions in OT", category: "Pediatric Developmental Therapy", tags: ["orthopedic", "fracture", "pediatric", "splinting"], difficulty: 3 },
  { slug: "ot-praxis-motor-planning", title: "Praxis and Motor Planning in Children", category: "Pediatric Developmental Therapy", tags: ["praxis", "motor-planning", "ideation", "sequencing"], difficulty: 4 },
  { slug: "ot-interoception-body-awareness", title: "Interoception and Internal Body Awareness", category: "Pediatric Developmental Therapy", tags: ["interoception", "body-awareness", "self-regulation", "sensory"], difficulty: 3 },
  { slug: "ot-pediatric-transition-planning", title: "Transition Planning for Adolescents with Disabilities", category: "Pediatric Developmental Therapy", tags: ["transition", "adolescent", "vocational", "independence"], difficulty: 3 },
  { slug: "ot-therapeutic-use-of-self", title: "Therapeutic Use of Self in Pediatric OT", category: "Pediatric Developmental Therapy", tags: ["therapeutic-relationship", "rapport", "pediatric", "motivation"], difficulty: 2 },
  { slug: "ot-family-centered-practice", title: "Family-Centered Practice in Pediatric OT", category: "Pediatric Developmental Therapy", tags: ["family-centered", "parent-coaching", "collaboration", "pediatric"], difficulty: 2 },
];

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  return resp.choices[0]?.message?.content || "{}";
}

function buildLessonPrompt(topic: OTLessonTopic): { system: string; user: string } {
  const system = `You are an occupational therapy education expert creating structured lesson content for a licensing exam preparation platform. Write at a professional clinical level consistent with NBCOT and Canadian OT exam preparation.

Return JSON with this exact structure:
{
  "seoTitle": "SEO-optimized page title (50-60 chars)",
  "seoDescription": "Meta description for SEO (150-160 chars)",
  "summary": "2-3 sentence lesson overview",
  "learningObjectives": ["Objective 1", "Objective 2", "Objective 3", "Objective 4"],
  "content": [
    {"type": "heading", "text": "Overview"},
    {"type": "paragraph", "text": "Detailed overview paragraph..."},
    {"type": "heading", "text": "Theoretical Foundation / Pathophysiology"},
    {"type": "paragraph", "text": "Theory/pathophysiology content..."},
    {"type": "heading", "text": "Assessment Tools"},
    {"type": "list", "items": ["Assessment tool 1 with description", "Assessment tool 2..."]},
    {"type": "heading", "text": "Intervention Strategies"},
    {"type": "paragraph", "text": "Evidence-based intervention approaches..."},
    {"type": "list", "items": ["Intervention 1 with clinical detail", "Intervention 2..."]},
    {"type": "heading", "text": "Clinical Pearls"},
    {"type": "callout", "text": "High-yield clinical pearl for exam prep"},
    {"type": "list", "items": ["Pearl 1", "Pearl 2", "Pearl 3"]},
    {"type": "heading", "text": "Evidence Base"},
    {"type": "paragraph", "text": "Summary of supporting evidence and key studies..."},
    {"type": "heading", "text": "Common Exam Pitfalls"},
    {"type": "list", "items": ["Pitfall 1", "Pitfall 2", "Pitfall 3"]}
  ]
}

Rules:
- Content must be clinically accurate and exam-relevant for NBCOT OTR and Canadian NOTCE exams
- Include specific values: ROM ranges, standardized assessment score interpretations, protocol timelines where relevant
- Minimum 15 content blocks, maximum 30
- Use H2-level headings for main sections (Overview, Theoretical Foundation, Assessment Tools, Intervention Strategies, Clinical Pearls, Evidence Base, Common Exam Pitfalls)
- Include at least 2 callout blocks with high-yield exam tips
- No emoji characters anywhere. Plain text only.
- Use professional occupational therapy terminology
- Reference OT-specific frameworks (MOHO, PEO, CMOP-E, OT Practice Framework) where applicable`;

  const user = `Generate a comprehensive occupational therapy lesson for: "${topic.title}" (Category: ${topic.category}, Difficulty: ${topic.difficulty}/5).
Tags: ${topic.tags.join(", ")}.
Return JSON only.`;

  return { system, user };
}

function buildFlashcardPrompt(topic: OTLessonTopic): { system: string; user: string } {
  const numCards = 2 + Math.floor(Math.random() * 3);
  const system = `You are an occupational therapy education expert creating flashcards for NBCOT and Canadian OT exam preparation.

Return JSON with this exact structure:
{
  "cards": [
    {"front": "Question text", "back": "Answer text", "rationale": "Brief explanation", "clinicalPearl": "High-yield exam pearl"}
  ]
}

Rules:
- Generate exactly ${numCards} flashcards
- Questions should test key rehabilitation techniques, clinical assessments, and treatment strategies
- Answers should be concise but complete (1-3 sentences)
- Include rationale and clinical pearl for each card
- Focus on high-yield exam content for NBCOT OTR and Canadian NOTCE
- No emoji characters. Plain text only.`;

  const user = `Generate ${numCards} flashcards for the OT lesson: "${topic.title}" (Category: ${topic.category}). Return JSON only.`;

  return { system, user };
}

function validateLessonContent(content: ContentBlock[]): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (content.length < 10) issues.push(`only ${content.length} content blocks (minimum 10)`);
  const headings = content.filter(b => b.type === "heading");
  if (headings.length < 4) issues.push(`only ${headings.length} headings (minimum 4)`);
  const paragraphs = content.filter(b => b.type === "paragraph");
  if (paragraphs.length < 3) issues.push(`only ${paragraphs.length} paragraphs (minimum 3)`);
  return { valid: issues.length === 0, issues };
}

async function ensureSystemUser(pool: pg.Pool): Promise<string> {
  const userCheck = await pool.query(`SELECT id FROM users WHERE id = $1`, [SYSTEM_USER_ID]);
  if (userCheck.rows.length > 0) return SYSTEM_USER_ID;

  const fallback = await pool.query(`SELECT id FROM users WHERE username = 'NurseNest-System' LIMIT 1`);
  if (fallback.rows.length > 0) return fallback.rows[0].id;

  await pool.query(
    `INSERT INTO users (id, username, password, tier, subscription_status)
     VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
    [SYSTEM_USER_ID, "NurseNest-System", "system-no-login", "admin", "active"]
  );
  return SYSTEM_USER_ID;
}

async function generateAndInsertLesson(pool: pg.Pool, topic: OTLessonTopic, ownerId: string): Promise<{ outcome: string; id: string | null }> {
  const existing = await pool.query(`SELECT id FROM content_items WHERE slug = $1`, [topic.slug]);
  if (existing.rows.length > 0) {
    console.log(`  [SKIP] Lesson already exists: ${topic.slug}`);
    return { outcome: "existing", id: existing.rows[0].id };
  }

  console.log(`  [GEN] Generating content for: ${topic.title}...`);
  const { system, user } = buildLessonPrompt(topic);

  let contentData: LessonGenerationResult;
  try {
    const raw = await callOpenAI(system, user);
    contentData = JSON.parse(raw) as LessonGenerationResult;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Failed to generate lesson ${topic.slug}: ${message}`);
    return { outcome: "error", id: null };
  }

  const contentBlocks = contentData.content || [];
  if (contentBlocks.length === 0) {
    console.error(`  [ERROR] No content blocks generated for ${topic.slug}`);
    return { outcome: "error", id: null };
  }

  const validation = validateLessonContent(contentBlocks);
  if (!validation.valid) {
    console.warn(`  [WARN] Content validation issues for ${topic.slug}: ${validation.issues.join("; ")}`);
  }

  const learningObjectives = contentData.learningObjectives || [];
  const contentWithObjectives = learningObjectives.length > 0
    ? [{ type: "heading", text: "Learning Objectives" }, { type: "list", items: learningObjectives }, ...contentBlocks]
    : contentBlocks;

  const result = await pool.query(
    `INSERT INTO content_items (id, title, slug, type, category, body_system, tier, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, secondary_keywords, published_at, author_id, author_name, region_scope, updated_by_ai, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, $2, 'lesson', $3, 'occupationalTherapy', 'free', 'published', $4::text[], $5, $6::jsonb, $7, $8, $9::text[], $10, $11::text[], NOW(), $12, 'NurseNest System', 'BOTH', true, NOW(), NOW())
     RETURNING id`,
    [
      topic.title,
      topic.slug,
      topic.category,
      topic.tags,
      contentData.summary || `Comprehensive occupational therapy lesson on ${topic.title}`,
      JSON.stringify(contentWithObjectives),
      contentData.seoTitle || `${topic.title} | OT Study Guide`,
      contentData.seoDescription || `Master ${topic.title.toLowerCase()} for NBCOT and Canadian OT exam preparation.`,
      [...topic.tags, "occupational-therapy", "OT"],
      topic.tags[0] || topic.title.toLowerCase(),
      topic.tags.slice(1),
      ownerId,
    ]
  );

  const contentId = result.rows[0].id;
  console.log(`  [OK] Inserted lesson: ${topic.slug} (id: ${contentId})`);
  return { outcome: "created", id: contentId };
}

async function generateAndInsertFlashcards(pool: pg.Pool, topic: OTLessonTopic, lessonId: string | null): Promise<number> {
  const existingCount = await pool.query(
    `SELECT COUNT(*) as c FROM allied_flashcards WHERE career_type = 'occupationalTherapy' AND subtopic = $1`,
    [topic.slug]
  );
  if (parseInt(existingCount.rows[0].c) > 0) {
    console.log(`  [SKIP] Flashcards already exist for: ${topic.slug}`);
    return 0;
  }

  console.log(`  [GEN] Generating flashcards for: ${topic.title}...`);
  const { system, user } = buildFlashcardPrompt(topic);

  let cardData: FlashcardResult;
  try {
    const raw = await callOpenAI(system, user);
    cardData = JSON.parse(raw) as FlashcardResult;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Failed to generate flashcards for ${topic.slug}: ${message}`);
    return 0;
  }

  const cards = cardData.cards || [];
  if (cards.length === 0) {
    console.error(`  [ERROR] No flashcards generated for ${topic.slug}`);
    return 0;
  }

  let inserted = 0;
  for (const card of cards) {
    if (!card.front || !card.back) continue;
    try {
      await pool.query(
        `INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, clinical_pearl, blueprint_category, subtopic)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          "occupationalTherapy",
          lessonId,
          "exam_concept",
          card.front,
          card.back,
          card.rationale || "",
          card.clinicalPearl || "",
          topic.category,
          topic.slug,
        ]
      );
      inserted++;
    } catch (err: any) {
      console.error(`  [ERROR] Flashcard insert failed: ${err.message?.substring(0, 100)}`);
    }
  }

  console.log(`  [OK] Inserted ${inserted} flashcards for: ${topic.slug}`);
  return inserted;
}

async function runBatch(pool: pg.Pool, topics: OTLessonTopic[], batchNum: number, ownerId: string): Promise<{ lessons: number; flashcards: number; errors: number }> {
  console.log(`\n=== Batch ${batchNum}: ${topics.length} topics ===`);
  let lessons = 0, flashcards = 0, errors = 0;

  for (const topic of topics) {
    try {
      const result = await generateAndInsertLesson(pool, topic, ownerId);
      if (result.outcome === "created") lessons++;
      else if (result.outcome === "error") { errors++; continue; }

      const fc = await generateAndInsertFlashcards(pool, topic, result.id);
      flashcards += fc;

      await new Promise(r => setTimeout(r, 500));
    } catch (err: any) {
      console.error(`  [FATAL] ${topic.slug}: ${err.message}`);
      errors++;
    }
  }

  return { lessons, flashcards, errors };
}

export async function generateOTLessons(): Promise<void> {
  const pool = getProdPool();
  const ownerId = await ensureSystemUser(pool);

  console.log(`\n[OT Lesson Generator] Starting generation of ${OT_LESSON_TOPICS.length} occupational therapy lessons`);
  console.log(`[OT Lesson Generator] Categories:`);

  const categories = new Map<string, number>();
  for (const t of OT_LESSON_TOPICS) {
    categories.set(t.category, (categories.get(t.category) || 0) + 1);
  }
  for (const [cat, count] of categories) {
    console.log(`  - ${cat}: ${count} lessons`);
  }

  const BATCH_SIZE = 25;
  let totalLessons = 0, totalFlashcards = 0, totalErrors = 0;
  const batches = Math.ceil(OT_LESSON_TOPICS.length / BATCH_SIZE);

  for (let i = 0; i < batches; i++) {
    const batchTopics = OT_LESSON_TOPICS.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const result = await runBatch(pool, batchTopics, i + 1, ownerId);
    totalLessons += result.lessons;
    totalFlashcards += result.flashcards;
    totalErrors += result.errors;

    if (i < batches - 1) {
      console.log(`  [PAUSE] Waiting 2 seconds between batches...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n========================================`);
  console.log(`[OT Lesson Generator] COMPLETE`);
  console.log(`  Total lessons created: ${totalLessons}`);
  console.log(`  Total flashcards created: ${totalFlashcards}`);
  console.log(`  Total errors: ${totalErrors}`);
  console.log(`  Total topics defined: ${OT_LESSON_TOPICS.length}`);
  console.log(`========================================\n`);

  const verifyLessons = await pool.query(
    "SELECT COUNT(*) as c FROM content_items WHERE body_system = 'occupationalTherapy' AND type = 'lesson'"
  );
  const verifyFlashcards = await pool.query(
    "SELECT COUNT(*) as c FROM allied_flashcards WHERE career_type = 'occupationalTherapy'"
  );
  const verifyCategoryCounts = await pool.query(
    "SELECT category, COUNT(*) as c FROM content_items WHERE body_system = 'occupationalTherapy' AND type = 'lesson' GROUP BY category ORDER BY category"
  );

  console.log(`\n[Verification] Lessons in DB: ${verifyLessons.rows[0].c}`);
  console.log(`[Verification] Flashcards in DB: ${verifyFlashcards.rows[0].c}`);
  console.log(`[Verification] Category distribution:`);
  for (const row of verifyCategoryCounts.rows) {
    console.log(`  - ${row.category}: ${row.c}`);
  }
}

export { OT_LESSON_TOPICS };

export async function generateOTLessonsRange(startIdx: number, endIdx: number): Promise<void> {
  const pool = getProdPool();
  const ownerId = await ensureSystemUser(pool);
  const topics = OT_LESSON_TOPICS.slice(startIdx, endIdx);
  console.log(`[OT Range] Processing topics ${startIdx}-${endIdx} (${topics.length} topics)`);

  let totalLessons = 0, totalFlashcards = 0, totalErrors = 0;
  for (const topic of topics) {
    try {
      const result = await generateAndInsertLesson(pool, topic, ownerId);
      if (result.outcome === "created") totalLessons++;
      else if (result.outcome === "error") { totalErrors++; continue; }
      const fc = await generateAndInsertFlashcards(pool, topic, result.id);
      totalFlashcards += fc;
      await new Promise(r => setTimeout(r, 300));
    } catch (err: any) {
      console.error(`  [FATAL] ${topic.slug}: ${err.message}`);
      totalErrors++;
    }
  }
  console.log(`[OT Range] Done: lessons=${totalLessons} flashcards=${totalFlashcards} errors=${totalErrors}`);
}

const __filename_esm = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const isMain = __filename_esm === process.argv[1] || process.argv[1]?.endsWith("generate-ot-lessons.ts");
if (isMain) {
  const startIdx = parseInt(process.argv[2] || "0");
  const endIdx = parseInt(process.argv[3] || String(OT_LESSON_TOPICS.length));
  if (process.argv[2]) {
    generateOTLessonsRange(startIdx, endIdx)
      .then(() => process.exit(0))
      .catch(err => { console.error("[OT] Fatal:", err); process.exit(1); });
  } else {
    generateOTLessons()
      .then(() => process.exit(0))
      .catch(err => { console.error("[OT] Fatal:", err); process.exit(1); });
  }
}
