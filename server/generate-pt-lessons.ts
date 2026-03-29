import crypto from "crypto";
import pg from "pg";
import type OpenAI from "openai";

const PROD_URL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
if (!PROD_URL) {
  console.error("[PT-Lessons] No DATABASE_URL configured");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: PROD_URL });

async function getOpenAI(): Promise<OpenAI> {
  const OpenAIConstructor = (await import("openai")).default;
  return new OpenAIConstructor({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

interface PTLessonTopic {
  slug: string;
  title: string;
  domain: string;
  bodySystem: string;
  topic: string;
  subtopic: string;
  difficulty: number;
  seoTitle: string;
  seoDescription: string;
}

interface LessonContent {
  overview: string;
  pathophysiology: string;
  evaluationMethods: string;
  interventionProtocols: string;
  clinicalPearls: string[];
  evidenceBase: string;
  learningObjectives: string[];
  clinicalVignettes?: { scenario: string; question: string; answer: string }[];
  examTrapWarning?: string;
}

interface FlashcardData {
  cardType: "definition" | "clinical_decision" | "red_flag" | "technique";
  front: string;
  back: string;
  rationale: string;
  clinicalPearl: string;
}

const PT_LESSON_TOPICS: PTLessonTopic[] = [
  // === MUSCULOSKELETAL REHABILITATION (40 lessons) ===
  { slug: "total-knee-arthroplasty-rehab", title: "Total Knee Arthroplasty Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Joint Replacements", subtopic: "TKA Protocols", difficulty: 3, seoTitle: "TKA Rehabilitation: PT Exam Guide", seoDescription: "Master total knee arthroplasty rehabilitation protocols for NPTE and PCE exam preparation." },
  { slug: "total-hip-arthroplasty-rehab", title: "Total Hip Arthroplasty Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Joint Replacements", subtopic: "THA Protocols", difficulty: 3, seoTitle: "THA Rehabilitation Guide for PTs", seoDescription: "Comprehensive total hip arthroplasty rehabilitation including precautions, progressions, and outcomes." },
  { slug: "total-shoulder-arthroplasty-rehab", title: "Total Shoulder Arthroplasty Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Joint Replacements", subtopic: "TSA Protocols", difficulty: 3, seoTitle: "Shoulder Arthroplasty Rehab for PT Exam", seoDescription: "TSA and reverse TSA rehabilitation protocols with ROM progressions and strengthening guidelines." },
  { slug: "revision-arthroplasty-considerations", title: "Revision Arthroplasty Rehabilitation Considerations", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Joint Replacements", subtopic: "Revision Surgery", difficulty: 4, seoTitle: "Revision Arthroplasty Rehab Considerations", seoDescription: "Rehabilitation considerations for revision joint replacement surgery including modified protocols." },
  { slug: "distal-radius-fracture-management", title: "Distal Radius Fracture Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Fracture Management", subtopic: "Upper Extremity Fractures", difficulty: 3, seoTitle: "Distal Radius Fracture Rehab for PTs", seoDescription: "Colles and Smith fracture rehabilitation including immobilization phases and ROM recovery." },
  { slug: "hip-fracture-rehabilitation", title: "Hip Fracture Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Fracture Management", subtopic: "Hip Fractures", difficulty: 3, seoTitle: "Hip Fracture Rehabilitation Guide", seoDescription: "Femoral neck and intertrochanteric fracture rehabilitation with weight-bearing progressions." },
  { slug: "tibial-plateau-fracture-rehab", title: "Tibial Plateau Fracture Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Fracture Management", subtopic: "Lower Extremity Fractures", difficulty: 4, seoTitle: "Tibial Plateau Fracture Rehab for PT Exam", seoDescription: "Tibial plateau fracture classification, surgical considerations, and rehab protocol progressions." },
  { slug: "stress-fracture-management", title: "Stress Fracture Identification and Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Fracture Management", subtopic: "Stress Fractures", difficulty: 3, seoTitle: "Stress Fracture Management for PTs", seoDescription: "Stress fracture risk factors, diagnostic criteria, and return-to-activity progressions." },
  { slug: "lumbar-disc-herniation-rehab", title: "Lumbar Disc Herniation Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Spinal Conditions", subtopic: "Disc Herniation", difficulty: 3, seoTitle: "Lumbar Disc Herniation: PT Treatment Guide", seoDescription: "Lumbar disc herniation pathomechanics, McKenzie approach, and evidence-based rehabilitation." },
  { slug: "cervical-radiculopathy-management", title: "Cervical Radiculopathy Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Spinal Conditions", subtopic: "Cervical Radiculopathy", difficulty: 3, seoTitle: "Cervical Radiculopathy Treatment for PTs", seoDescription: "Cervical radiculopathy assessment, neural tension testing, and conservative management strategies." },
  { slug: "spinal-stenosis-rehabilitation", title: "Spinal Stenosis Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Spinal Conditions", subtopic: "Spinal Stenosis", difficulty: 3, seoTitle: "Spinal Stenosis Rehab for PT Exam", seoDescription: "Lumbar and cervical spinal stenosis pathophysiology, decompression exercises, and functional training." },
  { slug: "spondylolisthesis-management", title: "Spondylolisthesis Classification and Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Spinal Conditions", subtopic: "Spondylolisthesis", difficulty: 4, seoTitle: "Spondylolisthesis Management for PTs", seoDescription: "Spondylolisthesis grading, stabilization exercises, and activity modification strategies." },
  { slug: "acl-reconstruction-rehab-protocol", title: "ACL Reconstruction Rehabilitation Protocol", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Post-Surgical Protocols", subtopic: "ACL Reconstruction", difficulty: 4, seoTitle: "ACL Reconstruction Rehab Protocol for PTs", seoDescription: "Phase-based ACL reconstruction rehabilitation from early protection through return to sport." },
  { slug: "rotator-cuff-repair-rehab", title: "Rotator Cuff Repair Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Post-Surgical Protocols", subtopic: "Rotator Cuff Repair", difficulty: 3, seoTitle: "Rotator Cuff Repair Rehab Protocol", seoDescription: "Post-operative rotator cuff repair rehabilitation with tissue healing timelines and progressions." },
  { slug: "meniscus-repair-rehab", title: "Meniscus Repair vs Meniscectomy Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Post-Surgical Protocols", subtopic: "Meniscus Surgery", difficulty: 3, seoTitle: "Meniscus Surgery Rehab for PT Exam", seoDescription: "Meniscus repair versus meniscectomy rehabilitation protocols and weight-bearing guidelines." },
  { slug: "labral-repair-hip-shoulder", title: "Labral Repair Rehabilitation: Hip and Shoulder", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Post-Surgical Protocols", subtopic: "Labral Repair", difficulty: 4, seoTitle: "Labral Repair Rehabilitation Guide", seoDescription: "Hip and shoulder labral repair rehabilitation protocols with ROM restrictions and progressions." },
  { slug: "rheumatoid-arthritis-pt-management", title: "Rheumatoid Arthritis: PT Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Arthritis Management", subtopic: "Rheumatoid Arthritis", difficulty: 3, seoTitle: "RA Management for Physical Therapists", seoDescription: "Rheumatoid arthritis joint protection, exercise prescription, and flare management strategies." },
  { slug: "osteoarthritis-exercise-prescription", title: "Osteoarthritis Exercise Prescription", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Arthritis Management", subtopic: "Osteoarthritis", difficulty: 2, seoTitle: "OA Exercise Prescription for PTs", seoDescription: "Evidence-based exercise prescription for osteoarthritis including aquatic therapy and land-based programs." },
  { slug: "ankylosing-spondylitis-rehab", title: "Ankylosing Spondylitis Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Arthritis Management", subtopic: "Ankylosing Spondylitis", difficulty: 3, seoTitle: "Ankylosing Spondylitis Rehab for PTs", seoDescription: "AS postural management, breathing exercises, and exercise programs for spinal mobility." },
  { slug: "frozen-shoulder-management", title: "Adhesive Capsulitis (Frozen Shoulder) Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Shoulder Pathology", subtopic: "Adhesive Capsulitis", difficulty: 3, seoTitle: "Frozen Shoulder Treatment for PTs", seoDescription: "Adhesive capsulitis staging, capsular pattern, and evidence-based treatment approaches." },
  { slug: "lateral-epicondylalgia-treatment", title: "Lateral Epicondylalgia (Tennis Elbow) Treatment", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Tendinopathy", subtopic: "Lateral Epicondylalgia", difficulty: 2, seoTitle: "Tennis Elbow Treatment for PT Exam", seoDescription: "Lateral epicondylalgia pathophysiology, eccentric loading programs, and bracing strategies." },
  { slug: "achilles-tendinopathy-rehab", title: "Achilles Tendinopathy Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Tendinopathy", subtopic: "Achilles Tendon", difficulty: 3, seoTitle: "Achilles Tendinopathy Rehab for PTs", seoDescription: "Achilles tendinopathy eccentric loading protocols, insertional vs midportion management." },
  { slug: "patellofemoral-pain-syndrome", title: "Patellofemoral Pain Syndrome Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Knee Pathology", subtopic: "Patellofemoral Pain", difficulty: 2, seoTitle: "PFPS Management for Physical Therapists", seoDescription: "Patellofemoral pain syndrome biomechanics, VMO strengthening, and taping techniques." },
  { slug: "plantar-fasciitis-treatment", title: "Plantar Fasciitis Evidence-Based Treatment", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Foot and Ankle", subtopic: "Plantar Fasciitis", difficulty: 2, seoTitle: "Plantar Fasciitis Treatment for PTs", seoDescription: "Plantar fasciitis stretching protocols, orthotics, and progressive loading programs." },
  { slug: "carpal-tunnel-syndrome-management", title: "Carpal Tunnel Syndrome Conservative Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Peripheral Nerve", subtopic: "Carpal Tunnel Syndrome", difficulty: 2, seoTitle: "Carpal Tunnel Management for PTs", seoDescription: "CTS nerve gliding, splinting protocols, and surgical vs conservative management outcomes." },
  { slug: "thoracic-outlet-syndrome-treatment", title: "Thoracic Outlet Syndrome Treatment", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Peripheral Nerve", subtopic: "Thoracic Outlet Syndrome", difficulty: 4, seoTitle: "TOS Treatment for Physical Therapists", seoDescription: "Thoracic outlet syndrome classifications, provocative testing, and rehabilitation approaches." },
  { slug: "myofascial-pain-trigger-points", title: "Myofascial Pain and Trigger Point Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Soft Tissue", subtopic: "Myofascial Pain", difficulty: 2, seoTitle: "Myofascial Pain Management for PTs", seoDescription: "Trigger point identification, dry needling indications, and myofascial release techniques." },
  { slug: "complex-regional-pain-syndrome", title: "Complex Regional Pain Syndrome Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Pain Conditions", subtopic: "CRPS", difficulty: 4, seoTitle: "CRPS Rehabilitation for Physical Therapists", seoDescription: "CRPS Budapest criteria, graded motor imagery, and mirror therapy interventions." },
  { slug: "fibromyalgia-exercise-management", title: "Fibromyalgia Exercise Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Pain Conditions", subtopic: "Fibromyalgia", difficulty: 2, seoTitle: "Fibromyalgia Exercise for PTs", seoDescription: "Fibromyalgia exercise prescription, pacing strategies, and central sensitization concepts." },
  { slug: "osteoporosis-exercise-safety", title: "Osteoporosis Exercise and Safety Considerations", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Bone Health", subtopic: "Osteoporosis", difficulty: 2, seoTitle: "Osteoporosis Exercise Safety for PTs", seoDescription: "Osteoporosis exercise guidelines, contraindicated movements, and fall prevention strategies." },
  { slug: "post-amputation-rehabilitation", title: "Lower Extremity Amputation Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Amputation", subtopic: "Lower Extremity", difficulty: 4, seoTitle: "Amputation Rehab for PT Exam", seoDescription: "Transtibial and transfemoral amputation rehabilitation, prosthetic training, and residual limb management." },
  { slug: "burn-injury-rehabilitation", title: "Burn Injury Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Integumentary", topic: "Burns", subtopic: "Burn Rehabilitation", difficulty: 4, seoTitle: "Burn Rehabilitation for Physical Therapists", seoDescription: "Burn injury classification, scar management, positioning, and ROM interventions." },
  { slug: "temporomandibular-disorder-treatment", title: "Temporomandibular Disorder Treatment", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "TMJ", subtopic: "TMD Management", difficulty: 3, seoTitle: "TMD Treatment for Physical Therapists", seoDescription: "TMJ assessment, manual therapy techniques, and exercise programs for TMD." },
  { slug: "sacroiliac-joint-dysfunction", title: "Sacroiliac Joint Dysfunction Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Pelvic Region", subtopic: "SI Joint", difficulty: 3, seoTitle: "SI Joint Dysfunction for PT Exam", seoDescription: "Sacroiliac joint provocation tests, stabilization exercises, and manual therapy approaches." },
  { slug: "piriformis-syndrome-treatment", title: "Piriformis Syndrome Assessment and Treatment", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Hip Pathology", subtopic: "Piriformis Syndrome", difficulty: 2, seoTitle: "Piriformis Syndrome Treatment for PTs", seoDescription: "Piriformis syndrome differential diagnosis, stretching protocols, and neural mobilization." },
  { slug: "rotator-cuff-tendinopathy-conservative", title: "Rotator Cuff Tendinopathy Conservative Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Shoulder Pathology", subtopic: "Rotator Cuff Tendinopathy", difficulty: 3, seoTitle: "Rotator Cuff Tendinopathy for PTs", seoDescription: "Rotator cuff tendinopathy staging, progressive loading, and scapular stabilization programs." },
  { slug: "femoroacetabular-impingement", title: "Femoroacetabular Impingement Management", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Hip Pathology", subtopic: "FAI", difficulty: 3, seoTitle: "FAI Management for Physical Therapists", seoDescription: "Cam and pincer impingement pathomechanics, activity modification, and hip strengthening." },
  { slug: "whiplash-associated-disorders", title: "Whiplash-Associated Disorders Rehabilitation", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Cervical Spine", subtopic: "Whiplash", difficulty: 3, seoTitle: "Whiplash Rehab for PT Exam", seoDescription: "WAD classification, graded exposure approach, and cervical stabilization exercises." },
  { slug: "scapular-dyskinesis-treatment", title: "Scapular Dyskinesis Assessment and Treatment", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Shoulder Pathology", subtopic: "Scapular Dyskinesis", difficulty: 3, seoTitle: "Scapular Dyskinesis for Physical Therapists", seoDescription: "Scapular dyskinesis classification, corrective exercises, and kinetic chain considerations." },
  { slug: "posterior-tibial-tendon-dysfunction", title: "Posterior Tibial Tendon Dysfunction", domain: "Musculoskeletal Rehabilitation", bodySystem: "Musculoskeletal", topic: "Foot and Ankle", subtopic: "PTTD", difficulty: 3, seoTitle: "PTTD Management for PTs", seoDescription: "Posterior tibial tendon dysfunction staging, orthotic management, and strengthening progression." },

  // === JOINT MOBILIZATION (40 lessons) ===
  { slug: "maitland-grading-system", title: "Maitland Grading System for Joint Mobilization", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Maitland Grades", subtopic: "Grading System", difficulty: 3, seoTitle: "Maitland Grades: PT Exam Guide", seoDescription: "Maitland I-V grading system for peripheral and spinal joint mobilization techniques." },
  { slug: "maitland-grades-i-ii-pain-management", title: "Maitland Grades I-II for Pain Management", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Maitland Grades", subtopic: "Pain Management", difficulty: 2, seoTitle: "Maitland Grades I-II Pain Management", seoDescription: "Applying Maitland grades I-II for neurophysiological pain modulation and joint nutrition." },
  { slug: "maitland-grades-iii-iv-stiffness", title: "Maitland Grades III-IV for Joint Stiffness", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Maitland Grades", subtopic: "Stiffness Management", difficulty: 3, seoTitle: "Maitland Grades III-IV for Stiffness", seoDescription: "Applying Maitland grades III-IV for improving joint range of motion and capsular restrictions." },
  { slug: "maitland-grade-v-manipulation", title: "Maitland Grade V: High-Velocity Thrust Manipulation", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Maitland Grades", subtopic: "Manipulation", difficulty: 5, seoTitle: "Grade V Manipulation for PT Exam", seoDescription: "Grade V thrust manipulation indications, contraindications, and safety considerations." },
  { slug: "kaltenborn-convex-concave-rule", title: "Kaltenborn Convex-Concave Rule", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Kaltenborn Techniques", subtopic: "Convex-Concave Rule", difficulty: 3, seoTitle: "Convex-Concave Rule for PT Exam", seoDescription: "Kaltenborn convex-concave rule application for determining glide direction in joint mobilization." },
  { slug: "kaltenborn-traction-grades", title: "Kaltenborn Traction Grades", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Kaltenborn Techniques", subtopic: "Traction Grades", difficulty: 3, seoTitle: "Kaltenborn Traction Grades Guide", seoDescription: "Kaltenborn traction grades I-III application for joint assessment and treatment." },
  { slug: "kaltenborn-translatory-glide", title: "Kaltenborn Translatory Glide Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Kaltenborn Techniques", subtopic: "Translatory Glide", difficulty: 3, seoTitle: "Kaltenborn Translatory Glide for PTs", seoDescription: "Translatory glide technique application for restoring joint play and accessory motion." },
  { slug: "manipulation-vs-mobilization", title: "Manipulation vs Mobilization: Evidence and Application", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Manipulation vs Mobilization", subtopic: "Clinical Decision Making", difficulty: 3, seoTitle: "Manipulation vs Mobilization for PT Exam", seoDescription: "Comparing manipulation and mobilization techniques, indications, and clinical prediction rules." },
  { slug: "joint-mobilization-contraindications", title: "Contraindications and Precautions for Joint Mobilization", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Manipulation vs Mobilization", subtopic: "Safety Considerations", difficulty: 4, seoTitle: "Joint Mobilization Contraindications", seoDescription: "Absolute and relative contraindications for spinal and peripheral joint mobilization." },
  { slug: "clinical-prediction-rules-manipulation", title: "Clinical Prediction Rules for Spinal Manipulation", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Manipulation vs Mobilization", subtopic: "CPRs", difficulty: 4, seoTitle: "CPRs for Spinal Manipulation", seoDescription: "Flynn clinical prediction rule and other CPRs for identifying manipulation responders." },
  { slug: "glenohumeral-joint-mobilization", title: "Glenohumeral Joint Mobilization Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Peripheral Joint Techniques", subtopic: "Shoulder Mobilization", difficulty: 3, seoTitle: "Shoulder Joint Mobilization for PTs", seoDescription: "Glenohumeral inferior, posterior, and anterior glide techniques with patient positioning." },
  { slug: "elbow-joint-mobilization", title: "Elbow Joint Mobilization Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Peripheral Joint Techniques", subtopic: "Elbow Mobilization", difficulty: 3, seoTitle: "Elbow Mobilization for PT Exam", seoDescription: "Humeroradial and humeroulnar joint mobilization for flexion and extension restrictions." },
  { slug: "wrist-hand-mobilization", title: "Wrist and Hand Joint Mobilization", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Peripheral Joint Techniques", subtopic: "Wrist/Hand Mobilization", difficulty: 3, seoTitle: "Wrist and Hand Mobilization for PTs", seoDescription: "Radiocarpal, midcarpal, and MCP joint mobilization techniques and indications." },
  { slug: "hip-joint-mobilization", title: "Hip Joint Mobilization Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Peripheral Joint Techniques", subtopic: "Hip Mobilization", difficulty: 3, seoTitle: "Hip Mobilization Techniques for PTs", seoDescription: "Hip joint distraction, long-axis traction, and directional glides for capsular restrictions." },
  { slug: "knee-joint-mobilization", title: "Tibiofemoral and Patellofemoral Mobilization", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Peripheral Joint Techniques", subtopic: "Knee Mobilization", difficulty: 3, seoTitle: "Knee Joint Mobilization for PT Exam", seoDescription: "Tibiofemoral and patellofemoral glide techniques for ROM restoration and pain management." },
  { slug: "ankle-joint-mobilization", title: "Ankle and Subtalar Joint Mobilization", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Peripheral Joint Techniques", subtopic: "Ankle Mobilization", difficulty: 3, seoTitle: "Ankle Mobilization for Physical Therapists", seoDescription: "Talocrural posterior glide, subtalar mobilization, and weight-bearing mobilization techniques." },
  { slug: "cervical-spine-mobilization", title: "Cervical Spine Mobilization Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Spinal Mobilization", subtopic: "Cervical Mobilization", difficulty: 4, seoTitle: "Cervical Mobilization for PT Exam", seoDescription: "Upper and lower cervical mobilization techniques including safety screening and VBI testing." },
  { slug: "thoracic-spine-mobilization", title: "Thoracic Spine Mobilization and Manipulation", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Spinal Mobilization", subtopic: "Thoracic Mobilization", difficulty: 3, seoTitle: "Thoracic Mobilization for PTs", seoDescription: "Thoracic PA mobilization, thrust manipulation, and rib mobilization techniques." },
  { slug: "lumbar-spine-mobilization", title: "Lumbar Spine Mobilization Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Spinal Mobilization", subtopic: "Lumbar Mobilization", difficulty: 3, seoTitle: "Lumbar Mobilization for PT Exam", seoDescription: "Lumbar PA mobilization, rotational mobilization, and sidelying manipulation techniques." },
  { slug: "si-joint-mobilization", title: "Sacroiliac Joint Mobilization Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Spinal Mobilization", subtopic: "SI Joint", difficulty: 3, seoTitle: "SI Joint Mobilization for PTs", seoDescription: "Sacroiliac joint mobilization techniques including muscle energy and thrust approaches." },
  { slug: "mulligan-mobilization-with-movement", title: "Mulligan Mobilization with Movement (MWM)", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Advanced Techniques", subtopic: "MWM", difficulty: 4, seoTitle: "Mulligan MWM for PT Exam", seoDescription: "Mulligan mobilization with movement principles, SNAG techniques, and clinical applications." },
  { slug: "muscle-energy-techniques", title: "Muscle Energy Techniques for Joint Dysfunction", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Advanced Techniques", subtopic: "Muscle Energy", difficulty: 3, seoTitle: "Muscle Energy Techniques for PTs", seoDescription: "Muscle energy technique principles, post-isometric relaxation, and reciprocal inhibition approaches." },
  { slug: "neurodynamic-mobilization", title: "Neural Mobilization and Neurodynamic Techniques", domain: "Joint Mobilization", bodySystem: "Neurological", topic: "Advanced Techniques", subtopic: "Neurodynamics", difficulty: 4, seoTitle: "Neural Mobilization for PT Exam", seoDescription: "Upper and lower limb neural tension testing, sliders, and tensioners for neural mobilization." },
  { slug: "end-feel-assessment", title: "End-Feel Assessment and Clinical Significance", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Assessment Techniques", subtopic: "End-Feel", difficulty: 2, seoTitle: "End-Feel Assessment for PT Exam", seoDescription: "Normal and abnormal end-feels, capsular patterns, and clinical decision making." },
  { slug: "joint-play-assessment", title: "Joint Play Assessment Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Assessment Techniques", subtopic: "Joint Play", difficulty: 3, seoTitle: "Joint Play Assessment for PTs", seoDescription: "Accessory motion assessment, hypomobility grading, and treatment planning from findings." },
  { slug: "capsular-pattern-recognition", title: "Capsular Patterns of Major Joints", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Assessment Techniques", subtopic: "Capsular Patterns", difficulty: 3, seoTitle: "Capsular Patterns for PT Exam", seoDescription: "Capsular pattern identification for shoulder, hip, knee, and other major joints." },
  { slug: "close-packed-open-packed-positions", title: "Close-Packed and Open-Packed Joint Positions", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Arthrokinematics", subtopic: "Joint Positions", difficulty: 2, seoTitle: "Joint Positions for PT Exam", seoDescription: "Close-packed and open-packed positions for peripheral joints and clinical significance." },
  { slug: "arthrokinematic-principles", title: "Arthrokinematic Principles: Roll, Glide, and Spin", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Arthrokinematics", subtopic: "Movement Principles", difficulty: 2, seoTitle: "Arthrokinematics for PT Exam", seoDescription: "Roll, glide, and spin joint mechanics with clinical application to mobilization direction." },
  { slug: "first-rib-mobilization", title: "First Rib Mobilization Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Rib Mobilization", subtopic: "First Rib", difficulty: 4, seoTitle: "First Rib Mobilization for PTs", seoDescription: "First rib elevation assessment, mobilization techniques, and relationship to TOS." },
  { slug: "rib-mobilization-techniques", title: "Rib Mobilization for Respiratory Dysfunction", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Rib Mobilization", subtopic: "Respiratory Ribs", difficulty: 3, seoTitle: "Rib Mobilization for PT Exam", seoDescription: "Pump-handle and bucket-handle rib mobilization for inhalation and exhalation restrictions." },
  { slug: "joint-mobilization-dosing", title: "Joint Mobilization Dosing and Treatment Parameters", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Treatment Parameters", subtopic: "Dosing", difficulty: 3, seoTitle: "Joint Mobilization Dosing for PTs", seoDescription: "Mobilization frequency, duration, and intensity selection based on irritability and chronicity." },
  { slug: "self-mobilization-techniques", title: "Self-Mobilization Techniques for Patient Education", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Treatment Parameters", subtopic: "Self-Mobilization", difficulty: 2, seoTitle: "Self-Mobilization for PT Patients", seoDescription: "Patient self-mobilization techniques for cervical, thoracic, lumbar, and peripheral joints." },
  { slug: "mobilization-progression-clinical-reasoning", title: "Mobilization Progression and Clinical Reasoning", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Clinical Reasoning", subtopic: "Treatment Progression", difficulty: 4, seoTitle: "Mobilization Clinical Reasoning for PTs", seoDescription: "Clinical decision-making for mobilization grade progression and treatment modification." },
  { slug: "thrust-manipulation-cervical-spine", title: "Thrust Manipulation of the Cervical Spine", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Spinal Manipulation", subtopic: "Cervical Thrust", difficulty: 5, seoTitle: "Cervical Thrust Manipulation for PTs", seoDescription: "Cervical spine thrust manipulation safety, VBI screening, and technique application." },
  { slug: "thrust-manipulation-thoracic-spine", title: "Thrust Manipulation of the Thoracic Spine", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Spinal Manipulation", subtopic: "Thoracic Thrust", difficulty: 4, seoTitle: "Thoracic Thrust Manipulation Guide", seoDescription: "Thoracic spine thrust manipulation techniques, indications, and clinical outcomes." },
  { slug: "thrust-manipulation-lumbar-spine", title: "Thrust Manipulation of the Lumbar Spine", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Spinal Manipulation", subtopic: "Lumbar Thrust", difficulty: 4, seoTitle: "Lumbar Thrust Manipulation for PT Exam", seoDescription: "Lumbar sidelying thrust manipulation technique, Flynn CPR, and evidence-based outcomes." },
  { slug: "traction-principles-spinal", title: "Spinal Traction: Principles and Application", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Traction", subtopic: "Spinal Traction", difficulty: 3, seoTitle: "Spinal Traction for PT Exam", seoDescription: "Cervical and lumbar mechanical traction parameters, positioning, and contraindications." },
  { slug: "peripheral-traction-techniques", title: "Peripheral Joint Traction Techniques", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Traction", subtopic: "Peripheral Traction", difficulty: 3, seoTitle: "Peripheral Traction for PTs", seoDescription: "Hip, knee, and shoulder joint traction techniques for assessment and treatment." },
  { slug: "myofascial-release-mobilization", title: "Myofascial Release as Adjunct to Mobilization", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Soft Tissue Mobilization", subtopic: "Myofascial Release", difficulty: 2, seoTitle: "Myofascial Release for Physical Therapists", seoDescription: "Direct and indirect myofascial release techniques as adjuncts to joint mobilization." },
  { slug: "instrument-assisted-soft-tissue-mobilization", title: "Instrument-Assisted Soft Tissue Mobilization (IASTM)", domain: "Joint Mobilization", bodySystem: "Musculoskeletal", topic: "Soft Tissue Mobilization", subtopic: "IASTM", difficulty: 2, seoTitle: "IASTM for Physical Therapists", seoDescription: "Instrument-assisted soft tissue mobilization principles, techniques, and evidence base." },

  // === GAIT TRAINING (40 lessons) ===
  { slug: "normal-gait-cycle-analysis", title: "Normal Gait Cycle Analysis", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Cycle Analysis", subtopic: "Normal Gait", difficulty: 3, seoTitle: "Gait Cycle Analysis for PT Exam", seoDescription: "Phases of normal gait cycle including stance and swing phases with joint kinematics." },
  { slug: "gait-cycle-joint-kinematics", title: "Gait Cycle Joint Kinematics and Kinetics", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Cycle Analysis", subtopic: "Kinematics/Kinetics", difficulty: 4, seoTitle: "Gait Kinematics for PT Exam", seoDescription: "Joint angles, moments, and ground reaction forces during normal gait cycle phases." },
  { slug: "muscle-activity-during-gait", title: "Muscle Activity Patterns During Gait", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Cycle Analysis", subtopic: "Muscle Activity", difficulty: 3, seoTitle: "Muscle Activity in Gait for PTs", seoDescription: "Timing and function of major muscle groups during stance and swing phases of gait." },
  { slug: "common-gait-deviations", title: "Common Gait Deviations: Identification and Causes", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Cycle Analysis", subtopic: "Gait Deviations", difficulty: 3, seoTitle: "Gait Deviations for PT Exam", seoDescription: "Trendelenburg, circumduction, steppage, and other common gait deviations with underlying causes." },
  { slug: "observational-gait-analysis", title: "Observational Gait Analysis Systematic Approach", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Cycle Analysis", subtopic: "OGA", difficulty: 3, seoTitle: "Observational Gait Analysis for PTs", seoDescription: "Systematic observational gait analysis including frontal, sagittal, and transverse plane assessment." },
  { slug: "instrumented-gait-analysis", title: "Instrumented Gait Analysis Technologies", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Cycle Analysis", subtopic: "Instrumented Analysis", difficulty: 4, seoTitle: "Instrumented Gait Analysis for PTs", seoDescription: "Force plates, motion capture, EMG, and pressure mapping for quantitative gait analysis." },
  { slug: "standard-walker-training", title: "Standard Walker Training and Progression", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Assistive Device Progression", subtopic: "Walker Training", difficulty: 2, seoTitle: "Walker Training for PT Exam", seoDescription: "Standard walker fitting, gait patterns, and progression criteria for patient safety." },
  { slug: "rolling-walker-training", title: "Rolling Walker (Rollator) Training", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Assistive Device Progression", subtopic: "Rollator Training", difficulty: 2, seoTitle: "Rollator Training for Physical Therapists", seoDescription: "Four-wheeled rollator fitting, training techniques, and appropriate patient selection." },
  { slug: "axillary-crutch-training", title: "Axillary Crutch Gait Training", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Assistive Device Progression", subtopic: "Axillary Crutches", difficulty: 2, seoTitle: "Crutch Training for PT Exam", seoDescription: "Axillary crutch fitting, two-point, three-point, and swing-through gait patterns." },
  { slug: "lofstrand-crutch-training", title: "Lofstrand (Forearm) Crutch Training", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Assistive Device Progression", subtopic: "Lofstrand Crutches", difficulty: 2, seoTitle: "Forearm Crutch Training for PTs", seoDescription: "Lofstrand crutch fitting, indications versus axillary crutches, and gait patterns." },
  { slug: "cane-training-progression", title: "Cane Selection and Training Progression", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Assistive Device Progression", subtopic: "Cane Training", difficulty: 2, seoTitle: "Cane Training for PT Exam", seoDescription: "Single-point and quad cane selection, fitting, contralateral use, and stair training." },
  { slug: "assistive-device-progression-criteria", title: "Assistive Device Progression and Discharge Criteria", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Assistive Device Progression", subtopic: "Progression Criteria", difficulty: 3, seoTitle: "Assistive Device Progression for PTs", seoDescription: "Evidence-based criteria for progressing from walker to crutches to cane and independent ambulation." },
  { slug: "weight-bearing-status-gait", title: "Weight-Bearing Status and Gait Pattern Selection", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Assistive Device Progression", subtopic: "Weight-Bearing Status", difficulty: 2, seoTitle: "Weight-Bearing Status for PT Exam", seoDescription: "NWB, TTWB, PWB, WBAT definitions and corresponding assistive device and gait pattern selection." },
  { slug: "transtibial-prosthetic-gait", title: "Transtibial Prosthetic Gait Training", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Prosthetic Gait Training", subtopic: "BKA Prosthetics", difficulty: 4, seoTitle: "BKA Prosthetic Gait for PT Exam", seoDescription: "Transtibial prosthetic alignment, gait training progressions, and common gait deviations." },
  { slug: "transfemoral-prosthetic-gait", title: "Transfemoral Prosthetic Gait Training", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Prosthetic Gait Training", subtopic: "AKA Prosthetics", difficulty: 4, seoTitle: "AKA Prosthetic Gait for PTs", seoDescription: "Transfemoral prosthetic knee mechanisms, alignment issues, and gait deviation corrections." },
  { slug: "prosthetic-gait-deviations", title: "Prosthetic Gait Deviations and Corrections", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Prosthetic Gait Training", subtopic: "Gait Deviations", difficulty: 4, seoTitle: "Prosthetic Gait Deviations for PT Exam", seoDescription: "Common prosthetic gait deviations, alignment-related vs habitual causes, and corrections." },
  { slug: "prosthetic-componentry-overview", title: "Prosthetic Componentry and Prescription", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Prosthetic Gait Training", subtopic: "Componentry", difficulty: 3, seoTitle: "Prosthetic Components for PT Exam", seoDescription: "Prosthetic foot, knee, socket, and suspension system options with functional implications." },
  { slug: "orthotic-gait-implications", title: "Lower Extremity Orthoses and Gait Implications", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Orthotics", subtopic: "LE Orthoses", difficulty: 3, seoTitle: "LE Orthoses for PT Exam", seoDescription: "AFO, KAFO, and other LE orthoses effects on gait biomechanics and energy expenditure." },
  { slug: "afo-types-indications", title: "AFO Types, Indications, and Gait Effects", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Orthotics", subtopic: "AFOs", difficulty: 3, seoTitle: "AFO Types for PT Exam", seoDescription: "Solid, hinged, posterior leaf spring, and ground reaction AFOs with clinical indications." },
  { slug: "static-balance-assessment-training", title: "Static Balance Assessment and Training", domain: "Gait Training", bodySystem: "Neurological", topic: "Balance Retraining", subtopic: "Static Balance", difficulty: 2, seoTitle: "Static Balance Training for PTs", seoDescription: "Romberg, single-leg stance, and balance assessment tools with progressive training strategies." },
  { slug: "dynamic-balance-training", title: "Dynamic Balance Training Progressions", domain: "Gait Training", bodySystem: "Neurological", topic: "Balance Retraining", subtopic: "Dynamic Balance", difficulty: 3, seoTitle: "Dynamic Balance Training for PT Exam", seoDescription: "Dynamic balance training from weight shifting to perturbation training with functional tasks." },
  { slug: "vestibular-balance-rehabilitation", title: "Vestibular Balance Rehabilitation", domain: "Gait Training", bodySystem: "Neurological", topic: "Balance Retraining", subtopic: "Vestibular Rehab", difficulty: 4, seoTitle: "Vestibular Rehab for Physical Therapists", seoDescription: "BPPV canalith repositioning, gaze stabilization exercises, and habituation training." },
  { slug: "fall-prevention-programs", title: "Fall Prevention Programs and Strategies", domain: "Gait Training", bodySystem: "Neurological", topic: "Fall Prevention", subtopic: "Prevention Programs", difficulty: 2, seoTitle: "Fall Prevention for Physical Therapists", seoDescription: "Multifactorial fall risk assessment, Otago exercise program, and environmental modifications." },
  { slug: "fall-risk-assessment-tools", title: "Fall Risk Assessment Tools and Measures", domain: "Gait Training", bodySystem: "Neurological", topic: "Fall Prevention", subtopic: "Assessment Tools", difficulty: 3, seoTitle: "Fall Risk Assessment for PT Exam", seoDescription: "Berg Balance Scale, Timed Up and Go, Dynamic Gait Index, and FES-I assessment tools." },
  { slug: "treadmill-gait-training", title: "Treadmill Gait Training Approaches", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Interventions", subtopic: "Treadmill Training", difficulty: 3, seoTitle: "Treadmill Gait Training for PTs", seoDescription: "Body-weight supported treadmill training, incline training, and split-belt approaches." },
  { slug: "overground-gait-training", title: "Overground Gait Training Techniques", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Interventions", subtopic: "Overground Training", difficulty: 2, seoTitle: "Overground Gait Training for PTs", seoDescription: "Manual facilitation techniques, cueing strategies, and obstacle negotiation training." },
  { slug: "aquatic-gait-training", title: "Aquatic Gait Training", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Interventions", subtopic: "Aquatic Training", difficulty: 3, seoTitle: "Aquatic Gait Training for PTs", seoDescription: "Buoyancy-assisted gait training, water depth selection, and progression to land-based ambulation." },
  { slug: "stair-negotiation-training", title: "Stair Negotiation Training and Progression", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Interventions", subtopic: "Stair Training", difficulty: 2, seoTitle: "Stair Training for PT Exam", seoDescription: "Step-over-step and step-to-step stair patterns with assistive devices and handrail use." },
  { slug: "community-ambulation-training", title: "Community Ambulation and Environmental Challenges", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Gait Interventions", subtopic: "Community Ambulation", difficulty: 3, seoTitle: "Community Ambulation for PTs", seoDescription: "Curb negotiation, ramp training, uneven surfaces, and crosswalk timing assessment." },
  { slug: "pediatric-gait-development", title: "Pediatric Gait Development and Deviations", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Special Populations", subtopic: "Pediatric Gait", difficulty: 3, seoTitle: "Pediatric Gait Development for PT Exam", seoDescription: "Normal gait development milestones, in-toeing, toe walking, and genu valgum/varum." },
  { slug: "geriatric-gait-changes", title: "Age-Related Gait Changes and Interventions", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Special Populations", subtopic: "Geriatric Gait", difficulty: 3, seoTitle: "Geriatric Gait Changes for PTs", seoDescription: "Age-related gait changes, decreased velocity, shortened stride, and intervention strategies." },
  { slug: "hemiplegic-gait-training", title: "Hemiplegic Gait Training After Stroke", domain: "Gait Training", bodySystem: "Neurological", topic: "Neurological Gait", subtopic: "Hemiplegic Gait", difficulty: 4, seoTitle: "Hemiplegic Gait Training for PTs", seoDescription: "Post-stroke gait deviations, compensatory strategies, and task-specific gait retraining." },
  { slug: "parkinsonian-gait-training", title: "Parkinsonian Gait Training Strategies", domain: "Gait Training", bodySystem: "Neurological", topic: "Neurological Gait", subtopic: "Parkinsonian Gait", difficulty: 3, seoTitle: "Parkinsonian Gait for PT Exam", seoDescription: "Festinating gait, freezing episodes, cueing strategies, and dual-task training for PD." },
  { slug: "ataxic-gait-management", title: "Ataxic Gait Assessment and Management", domain: "Gait Training", bodySystem: "Neurological", topic: "Neurological Gait", subtopic: "Ataxic Gait", difficulty: 4, seoTitle: "Ataxic Gait Management for PTs", seoDescription: "Cerebellar and sensory ataxia gait patterns, Frenkel exercises, and stability training." },
  { slug: "spastic-gait-interventions", title: "Spastic Gait Pattern Interventions", domain: "Gait Training", bodySystem: "Neurological", topic: "Neurological Gait", subtopic: "Spastic Gait", difficulty: 4, seoTitle: "Spastic Gait Interventions for PTs", seoDescription: "Spasticity management, serial casting, orthotics, and gait training for UMN lesion patterns." },
  { slug: "gait-speed-functional-outcomes", title: "Gait Speed as a Functional Outcome Measure", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Outcome Measures", subtopic: "Gait Speed", difficulty: 2, seoTitle: "Gait Speed Measurement for PTs", seoDescription: "10-meter walk test, gait speed cutoffs for community ambulation, and MCID values." },
  { slug: "six-minute-walk-test", title: "Six-Minute Walk Test Administration and Interpretation", domain: "Gait Training", bodySystem: "Cardiopulmonary", topic: "Outcome Measures", subtopic: "6MWT", difficulty: 2, seoTitle: "6MWT for PT Exam", seoDescription: "Six-minute walk test standardized protocol, reference values, and clinical interpretation." },
  { slug: "functional-gait-assessment", title: "Functional Gait Assessment (FGA)", domain: "Gait Training", bodySystem: "Musculoskeletal", topic: "Outcome Measures", subtopic: "FGA", difficulty: 3, seoTitle: "Functional Gait Assessment for PTs", seoDescription: "FGA administration, scoring, and comparison with Dynamic Gait Index for fall risk prediction." },
  { slug: "energy-expenditure-gait", title: "Energy Expenditure and Efficiency in Gait", domain: "Gait Training", bodySystem: "Cardiopulmonary", topic: "Gait Biomechanics", subtopic: "Energy Expenditure", difficulty: 3, seoTitle: "Gait Energy Expenditure for PT Exam", seoDescription: "Physiological cost index, determinants of gait, and energy expenditure with pathological gait." },
  { slug: "robotic-assisted-gait-training", title: "Robotic-Assisted Gait Training", domain: "Gait Training", bodySystem: "Neurological", topic: "Gait Interventions", subtopic: "Robotic Gait", difficulty: 4, seoTitle: "Robotic Gait Training for PTs", seoDescription: "Lokomat, exoskeleton devices, and evidence for robotic gait training in neurological populations." },

  // === SPORTS INJURY REHABILITATION (40 lessons) ===
  { slug: "acl-injury-mechanisms-prevention", title: "ACL Injury Mechanisms and Prevention Programs", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "ACL Reconstruction Rehab", subtopic: "Injury Prevention", difficulty: 3, seoTitle: "ACL Injury Prevention for PTs", seoDescription: "ACL injury mechanisms, neuromuscular prevention programs, and risk factor identification." },
  { slug: "acl-rehab-early-phase", title: "ACL Reconstruction Rehab: Early Phase (0-6 weeks)", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "ACL Reconstruction Rehab", subtopic: "Early Phase", difficulty: 3, seoTitle: "ACL Rehab Early Phase for PTs", seoDescription: "ACL reconstruction early rehabilitation goals, ROM restoration, and quad activation strategies." },
  { slug: "acl-rehab-intermediate-phase", title: "ACL Reconstruction Rehab: Intermediate Phase (6-16 weeks)", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "ACL Reconstruction Rehab", subtopic: "Intermediate Phase", difficulty: 3, seoTitle: "ACL Rehab Intermediate Phase Guide", seoDescription: "Progressive strengthening, proprioception training, and gait normalization after ACL reconstruction." },
  { slug: "acl-rehab-advanced-return-sport", title: "ACL Reconstruction: Return-to-Sport Phase", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "ACL Reconstruction Rehab", subtopic: "Return to Sport", difficulty: 4, seoTitle: "ACL Return to Sport for PT Exam", seoDescription: "ACL return-to-sport criteria, hop testing, limb symmetry index, and psychological readiness." },
  { slug: "acl-graft-types-rehab-implications", title: "ACL Graft Types and Rehabilitation Implications", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "ACL Reconstruction Rehab", subtopic: "Graft Types", difficulty: 4, seoTitle: "ACL Graft Types for PT Exam", seoDescription: "BPTB, hamstring, quadriceps, and allograft considerations for ACL reconstruction rehabilitation." },
  { slug: "rotator-cuff-injury-classification", title: "Rotator Cuff Injury Classification and Assessment", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Rotator Cuff Repair", subtopic: "Injury Classification", difficulty: 3, seoTitle: "Rotator Cuff Injury for PT Exam", seoDescription: "Rotator cuff tear classification, special testing, and surgical vs conservative decision making." },
  { slug: "rotator-cuff-post-op-early-phase", title: "Rotator Cuff Repair: Early Post-Op Phase", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Rotator Cuff Repair", subtopic: "Early Post-Op", difficulty: 3, seoTitle: "Rotator Cuff Post-Op Early Phase", seoDescription: "Sling management, PROM guidelines, and tissue protection after rotator cuff repair." },
  { slug: "rotator-cuff-strengthening-progression", title: "Rotator Cuff Repair: Strengthening Progression", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Rotator Cuff Repair", subtopic: "Strengthening", difficulty: 3, seoTitle: "Rotator Cuff Strengthening for PTs", seoDescription: "Progressive rotator cuff strengthening from isometrics to sport-specific training." },
  { slug: "lateral-ankle-sprain-management", title: "Lateral Ankle Sprain: Acute Management", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Ankle Sprains", subtopic: "Acute Management", difficulty: 2, seoTitle: "Ankle Sprain Acute Management for PTs", seoDescription: "Lateral ankle sprain grading, PRICE vs POLICE protocol, and early mobilization evidence." },
  { slug: "ankle-sprain-progressive-rehab", title: "Ankle Sprain: Progressive Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Ankle Sprains", subtopic: "Progressive Rehab", difficulty: 3, seoTitle: "Ankle Sprain Rehab Progression for PTs", seoDescription: "Progressive ankle rehabilitation including proprioception, strengthening, and agility training." },
  { slug: "chronic-ankle-instability", title: "Chronic Ankle Instability Management", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Ankle Sprains", subtopic: "Chronic Instability", difficulty: 3, seoTitle: "Chronic Ankle Instability for PTs", seoDescription: "Chronic ankle instability assessment, balance training, and bracing strategies." },
  { slug: "return-to-sport-criteria-testing", title: "Return-to-Sport Criteria and Functional Testing", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Return-to-Sport Criteria", subtopic: "Functional Testing", difficulty: 4, seoTitle: "Return to Sport Testing for PT Exam", seoDescription: "Functional performance testing, limb symmetry indices, and return-to-sport decision frameworks." },
  { slug: "return-to-sport-psychological-readiness", title: "Psychological Readiness for Return to Sport", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Return-to-Sport Criteria", subtopic: "Psychological Readiness", difficulty: 3, seoTitle: "Psychological Readiness for RTS", seoDescription: "ACL-RSI scale, fear of reinjury, self-efficacy assessment, and psychological interventions." },
  { slug: "concussion-management-return-play", title: "Concussion Management and Return to Play", domain: "Sports Injury Rehabilitation", bodySystem: "Neurological", topic: "Sports Concussion", subtopic: "Return to Play", difficulty: 3, seoTitle: "Concussion Return to Play for PTs", seoDescription: "Sport concussion assessment, graduated return-to-play protocol, and vestibular-ocular rehab." },
  { slug: "hamstring-strain-rehabilitation", title: "Hamstring Strain Injury Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Muscle Injuries", subtopic: "Hamstring Strain", difficulty: 3, seoTitle: "Hamstring Strain Rehab for PTs", seoDescription: "Hamstring strain grading, Nordic hamstring exercises, and return-to-running progression." },
  { slug: "quadriceps-contusion-strain", title: "Quadriceps Contusion and Strain Management", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Muscle Injuries", subtopic: "Quadriceps Injury", difficulty: 2, seoTitle: "Quadriceps Injury Management for PTs", seoDescription: "Quadriceps contusion classification, myositis ossificans prevention, and ROM restoration." },
  { slug: "groin-pain-adductor-strain", title: "Groin Pain and Adductor Strain Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Muscle Injuries", subtopic: "Groin/Adductor", difficulty: 3, seoTitle: "Groin Pain Rehab for PT Exam", seoDescription: "Adductor strain grading, Copenhagen adductor exercises, and differential diagnosis of groin pain." },
  { slug: "shoulder-instability-rehabilitation", title: "Shoulder Instability Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Shoulder Sports Injuries", subtopic: "Instability", difficulty: 3, seoTitle: "Shoulder Instability Rehab for PTs", seoDescription: "Anterior and multidirectional instability rehabilitation protocols and dynamic stabilization." },
  { slug: "slap-lesion-rehabilitation", title: "SLAP Lesion Assessment and Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Shoulder Sports Injuries", subtopic: "SLAP Lesion", difficulty: 4, seoTitle: "SLAP Lesion Rehab for PT Exam", seoDescription: "SLAP lesion classification, special tests, and post-repair rehabilitation protocols." },
  { slug: "ulnar-collateral-ligament-rehab", title: "Ulnar Collateral Ligament Reconstruction Rehab", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Elbow Sports Injuries", subtopic: "UCL Reconstruction", difficulty: 4, seoTitle: "Tommy John Surgery Rehab for PTs", seoDescription: "UCL reconstruction (Tommy John) rehabilitation phases and throwing progression protocols." },
  { slug: "patellar-tendinopathy-jumpers-knee", title: "Patellar Tendinopathy (Jumper's Knee) Management", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Tendinopathy", subtopic: "Patellar Tendon", difficulty: 3, seoTitle: "Jumper's Knee Treatment for PTs", seoDescription: "Patellar tendinopathy staging, heavy slow resistance, and isometric loading protocols." },
  { slug: "medial-collateral-ligament-rehab", title: "MCL Injury Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Knee Ligament Injuries", subtopic: "MCL Rehab", difficulty: 3, seoTitle: "MCL Injury Rehab for PT Exam", seoDescription: "MCL injury grading, bracing protocols, and progressive rehabilitation timelines." },
  { slug: "posterior-cruciate-ligament-rehab", title: "PCL Injury Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Knee Ligament Injuries", subtopic: "PCL Rehab", difficulty: 4, seoTitle: "PCL Injury Rehab for PT Exam", seoDescription: "PCL injury mechanisms, gravity sag test, and conservative vs surgical management." },
  { slug: "shin-splints-mtss-management", title: "Medial Tibial Stress Syndrome Management", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Overuse Injuries", subtopic: "Shin Splints", difficulty: 2, seoTitle: "Shin Splints Management for PTs", seoDescription: "MTSS pathophysiology, training load management, and biomechanical correction strategies." },
  { slug: "iliotibial-band-syndrome", title: "Iliotibial Band Syndrome Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Overuse Injuries", subtopic: "IT Band Syndrome", difficulty: 2, seoTitle: "IT Band Syndrome for PT Exam", seoDescription: "ITB syndrome mechanism, hip strengthening approach, and running gait modifications." },
  { slug: "sports-hernia-athletic-pubalgia", title: "Sports Hernia (Athletic Pubalgia) Management", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Core Injuries", subtopic: "Athletic Pubalgia", difficulty: 4, seoTitle: "Athletic Pubalgia for PT Exam", seoDescription: "Athletic pubalgia assessment, core stabilization, and progressive return to sport." },
  { slug: "throwing-athlete-shoulder-assessment", title: "Throwing Athlete Shoulder Assessment", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Overhead Athletes", subtopic: "Shoulder Assessment", difficulty: 4, seoTitle: "Throwing Shoulder Assessment for PTs", seoDescription: "GIRD assessment, total arc of motion, and shoulder evaluation for overhead athletes." },
  { slug: "running-injury-biomechanics", title: "Running Injury Biomechanical Assessment", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Running Injuries", subtopic: "Biomechanical Assessment", difficulty: 3, seoTitle: "Running Biomechanics for PTs", seoDescription: "Running gait analysis, cadence modification, and biomechanical risk factors for running injuries." },
  { slug: "return-to-running-progression", title: "Return-to-Running Progression Programs", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Running Injuries", subtopic: "Return to Running", difficulty: 3, seoTitle: "Return to Running for Physical Therapists", seoDescription: "Walk-run progressions, training load monitoring, and return-to-running criteria after injury." },
  { slug: "plyometric-training-rehabilitation", title: "Plyometric Training in Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Sports Performance", subtopic: "Plyometrics", difficulty: 3, seoTitle: "Plyometric Training for PT Exam", seoDescription: "Plyometric training principles, progression from bilateral to unilateral, and safety considerations." },
  { slug: "agility-training-rehabilitation", title: "Agility and Sport-Specific Training in Rehab", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Sports Performance", subtopic: "Agility Training", difficulty: 3, seoTitle: "Agility Training in Rehab for PTs", seoDescription: "Agility ladder, cutting progressions, and sport-specific movement pattern retraining." },
  { slug: "periodization-injury-prevention", title: "Training Periodization for Injury Prevention", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Sports Performance", subtopic: "Periodization", difficulty: 3, seoTitle: "Periodization for Injury Prevention", seoDescription: "Training load management, acute-chronic workload ratio, and periodization principles for PTs." },
  { slug: "hip-labral-tear-sports-rehab", title: "Hip Labral Tear Sports Rehabilitation", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Hip Sports Injuries", subtopic: "Labral Tear", difficulty: 4, seoTitle: "Hip Labral Tear Rehab for PTs", seoDescription: "Hip labral tear mechanisms in athletes, arthroscopic repair rehab, and return to sport." },
  { slug: "youth-athlete-injury-considerations", title: "Youth Athlete Injury Considerations", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Special Populations", subtopic: "Youth Athletes", difficulty: 3, seoTitle: "Youth Athlete Injuries for PTs", seoDescription: "Growth plate injuries, apophysitis, overuse injury prevention, and sport specialization guidelines." },
  { slug: "female-athlete-triad", title: "Female Athlete Triad and RED-S", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Special Populations", subtopic: "Female Athletes", difficulty: 3, seoTitle: "Female Athlete Triad for PT Exam", seoDescription: "RED-S screening, bone stress injury risk, and interdisciplinary management of the female athlete triad." },
  { slug: "shoulder-impingement-sports", title: "Shoulder Impingement in Athletes", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Shoulder Sports Injuries", subtopic: "Impingement", difficulty: 3, seoTitle: "Shoulder Impingement for PT Exam", seoDescription: "Subacromial impingement pathomechanics, special testing, and exercise-based rehabilitation." },
  { slug: "exercise-induced-leg-pain", title: "Exercise-Induced Leg Pain Differential Diagnosis", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Overuse Injuries", subtopic: "Leg Pain", difficulty: 3, seoTitle: "Exercise-Induced Leg Pain for PTs", seoDescription: "Differential diagnosis of exertional compartment syndrome, stress fractures, and MTSS." },
  { slug: "throwing-program-return-sport", title: "Interval Throwing Program for Return to Sport", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Overhead Athletes", subtopic: "Throwing Program", difficulty: 3, seoTitle: "Throwing Program for PT Exam", seoDescription: "Progressive interval throwing program phases, pitch count guidelines, and return-to-play criteria." },
  { slug: "knee-bracing-taping-sports", title: "Knee Bracing and Taping in Sports", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "External Supports", subtopic: "Knee Bracing", difficulty: 2, seoTitle: "Knee Bracing and Taping for PTs", seoDescription: "Prophylactic, functional, and rehabilitative knee braces with taping techniques." },
  { slug: "cryotherapy-thermotherapy-sports", title: "Cryotherapy and Thermotherapy in Sports Rehab", domain: "Sports Injury Rehabilitation", bodySystem: "Musculoskeletal", topic: "Modalities", subtopic: "Thermal Agents", difficulty: 2, seoTitle: "Cryotherapy in Sports Rehab for PTs", seoDescription: "Evidence-based cryotherapy and thermotherapy application in sports injury rehabilitation." },

  // === NEUROLOGICAL REHABILITATION (40 lessons) ===
  { slug: "stroke-acute-management-pt", title: "Acute Stroke Management: PT Considerations", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "Acute Management", difficulty: 3, seoTitle: "Acute Stroke PT Management", seoDescription: "Early mobilization after stroke, medical stability criteria, and acute care PT interventions." },
  { slug: "stroke-motor-recovery-stages", title: "Brunnstrom Stages of Motor Recovery", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "Motor Recovery", difficulty: 3, seoTitle: "Brunnstrom Stages for PT Exam", seoDescription: "Brunnstrom stages of motor recovery, synergy patterns, and clinical assessment approaches." },
  { slug: "stroke-upper-extremity-rehab", title: "Post-Stroke Upper Extremity Rehabilitation", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "UE Rehabilitation", difficulty: 4, seoTitle: "Stroke UE Rehab for PTs", seoDescription: "CIMT, task-specific training, and electrical stimulation for post-stroke upper extremity recovery." },
  { slug: "stroke-functional-mobility-training", title: "Post-Stroke Functional Mobility Training", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "Functional Mobility", difficulty: 3, seoTitle: "Stroke Mobility Training for PTs", seoDescription: "Bed mobility, transfers, and ambulation training strategies after stroke." },
  { slug: "stroke-spasticity-management", title: "Post-Stroke Spasticity Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "Spasticity", difficulty: 3, seoTitle: "Stroke Spasticity Management for PTs", seoDescription: "Modified Ashworth Scale, positioning, serial casting, and botulinum toxin considerations." },
  { slug: "stroke-neglect-perceptual-deficits", title: "Unilateral Neglect and Perceptual Deficits", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "Perceptual Deficits", difficulty: 4, seoTitle: "Unilateral Neglect for PT Exam", seoDescription: "Hemispatial neglect assessment, scanning training, and environmental modifications." },
  { slug: "stroke-balance-fall-prevention", title: "Post-Stroke Balance and Fall Prevention", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "Balance/Falls", difficulty: 3, seoTitle: "Stroke Balance Training for PTs", seoDescription: "Post-stroke balance assessment, perturbation training, and fall prevention strategies." },
  { slug: "stroke-aphasia-communication", title: "Aphasia and Communication Strategies for PTs", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Stroke Recovery", subtopic: "Communication", difficulty: 3, seoTitle: "Aphasia Communication for PTs", seoDescription: "Broca's vs Wernicke's aphasia, communication strategies, and interdisciplinary collaboration." },
  { slug: "spinal-cord-injury-classification", title: "Spinal Cord Injury Classification and Prognosis", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Spinal Cord Injury", subtopic: "Classification", difficulty: 4, seoTitle: "SCI Classification for PT Exam", seoDescription: "ASIA/ISNCSCI classification, neurological level, complete vs incomplete syndromes." },
  { slug: "spinal-cord-injury-functional-outcomes", title: "SCI Functional Outcomes by Level", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Spinal Cord Injury", subtopic: "Functional Outcomes", difficulty: 4, seoTitle: "SCI Functional Outcomes for PTs", seoDescription: "Expected functional outcomes and equipment needs by SCI level from C4 to L1." },
  { slug: "spinal-cord-injury-mobility-training", title: "SCI Mobility Training: Wheelchair and Transfers", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Spinal Cord Injury", subtopic: "Mobility Training", difficulty: 4, seoTitle: "SCI Mobility Training for PTs", seoDescription: "Wheelchair mobility, transfer techniques, and mat mobility training by SCI level." },
  { slug: "spinal-cord-injury-autonomic-dysreflexia", title: "Autonomic Dysreflexia: Recognition and Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Spinal Cord Injury", subtopic: "Autonomic Dysreflexia", difficulty: 4, seoTitle: "Autonomic Dysreflexia for PT Exam", seoDescription: "Autonomic dysreflexia triggers, symptoms, emergency management, and prevention strategies." },
  { slug: "spinal-cord-injury-respiratory-management", title: "SCI Respiratory Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Spinal Cord Injury", subtopic: "Respiratory", difficulty: 4, seoTitle: "SCI Respiratory Care for PTs", seoDescription: "Respiratory muscle innervation, assisted cough techniques, and ventilator weaning by SCI level." },
  { slug: "spinal-cord-injury-orthostatic-hypotension", title: "SCI Orthostatic Hypotension Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Spinal Cord Injury", subtopic: "Orthostatic Hypotension", difficulty: 3, seoTitle: "SCI Orthostatic Hypotension for PTs", seoDescription: "Orthostatic hypotension in SCI, tilt table progression, and management strategies." },
  { slug: "traumatic-brain-injury-rancho-levels", title: "TBI: Rancho Los Amigos Levels of Cognitive Function", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "TBI Rehab", subtopic: "Rancho Levels", difficulty: 3, seoTitle: "Rancho Los Amigos Levels for PT Exam", seoDescription: "Rancho I-VIII classification with appropriate PT interventions for each cognitive level." },
  { slug: "tbi-acute-rehabilitation", title: "TBI Acute Rehabilitation Strategies", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "TBI Rehab", subtopic: "Acute Rehab", difficulty: 4, seoTitle: "TBI Acute Rehab for Physical Therapists", seoDescription: "Agitation management, sensory stimulation, and early mobilization in acute TBI." },
  { slug: "tbi-balance-vestibular-rehab", title: "TBI Balance and Vestibular Rehabilitation", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "TBI Rehab", subtopic: "Balance/Vestibular", difficulty: 4, seoTitle: "TBI Balance Rehab for PTs", seoDescription: "Post-concussive balance deficits, vestibular-ocular reflex training, and habituation exercises." },
  { slug: "tbi-community-reintegration", title: "TBI Community Reintegration and Return to Work", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "TBI Rehab", subtopic: "Community Reintegration", difficulty: 3, seoTitle: "TBI Community Reintegration for PTs", seoDescription: "Community mobility, dual-task training, and vocational rehabilitation after TBI." },
  { slug: "parkinsons-disease-assessment", title: "Parkinson's Disease: PT Assessment", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Parkinsons", subtopic: "Assessment", difficulty: 3, seoTitle: "Parkinson's Assessment for PTs", seoDescription: "H&Y staging, UPDRS, and functional assessment tools for Parkinson's disease." },
  { slug: "parkinsons-exercise-programs", title: "Parkinson's Disease: Exercise and LSVT BIG", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Parkinsons", subtopic: "Exercise Programs", difficulty: 3, seoTitle: "Parkinson's Exercise for PT Exam", seoDescription: "LSVT BIG, PWR! Moves, boxing programs, and amplitude-based training for PD." },
  { slug: "parkinsons-freezing-management", title: "Parkinson's Disease: Freezing of Gait Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Parkinsons", subtopic: "Freezing of Gait", difficulty: 3, seoTitle: "Freezing of Gait for PTs", seoDescription: "FOG triggers, visual and auditory cueing strategies, and attentional strategies for PD." },
  { slug: "parkinsons-fall-prevention", title: "Parkinson's Disease: Fall Prevention Strategies", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Parkinsons", subtopic: "Fall Prevention", difficulty: 3, seoTitle: "Parkinson's Fall Prevention for PTs", seoDescription: "Multifactorial fall risk in PD, reactive balance training, and environmental modifications." },
  { slug: "multiple-sclerosis-fatigue-management", title: "Multiple Sclerosis: Fatigue Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "MS Management", subtopic: "Fatigue", difficulty: 3, seoTitle: "MS Fatigue Management for PTs", seoDescription: "MS fatigue pathophysiology, energy conservation, cooling strategies, and exercise prescription." },
  { slug: "multiple-sclerosis-exercise-prescription", title: "Multiple Sclerosis: Exercise Prescription", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "MS Management", subtopic: "Exercise", difficulty: 3, seoTitle: "MS Exercise Prescription for PTs", seoDescription: "Exercise guidelines for MS including temperature sensitivity, Uhthoff's phenomenon, and progression." },
  { slug: "multiple-sclerosis-balance-mobility", title: "Multiple Sclerosis: Balance and Mobility", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "MS Management", subtopic: "Balance/Mobility", difficulty: 3, seoTitle: "MS Balance and Mobility for PTs", seoDescription: "MS balance deficits, EDSS scale, assistive device selection, and mobility progression." },
  { slug: "multiple-sclerosis-spasticity-ataxia", title: "MS Spasticity and Ataxia Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "MS Management", subtopic: "Spasticity/Ataxia", difficulty: 3, seoTitle: "MS Spasticity Management for PTs", seoDescription: "Spasticity and ataxia management in MS including stretching, positioning, and weighted strategies." },
  { slug: "guillain-barre-syndrome-rehab", title: "Guillain-Barré Syndrome Rehabilitation", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Peripheral Neuropathy", subtopic: "GBS", difficulty: 4, seoTitle: "GBS Rehabilitation for PT Exam", seoDescription: "GBS phases, respiratory monitoring, progressive strengthening, and overwork weakness prevention." },
  { slug: "peripheral-neuropathy-management", title: "Peripheral Neuropathy: Assessment and Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Peripheral Neuropathy", subtopic: "Assessment/Management", difficulty: 3, seoTitle: "Peripheral Neuropathy for PTs", seoDescription: "Peripheral neuropathy sensory testing, balance training, and foot care education." },
  { slug: "amyotrophic-lateral-sclerosis-management", title: "ALS: Physical Therapy Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Degenerative Conditions", subtopic: "ALS", difficulty: 4, seoTitle: "ALS Management for Physical Therapists", seoDescription: "ALS functional staging, exercise guidelines, respiratory management, and equipment prescription." },
  { slug: "huntingtons-disease-rehabilitation", title: "Huntington's Disease Rehabilitation", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Degenerative Conditions", subtopic: "Huntingtons", difficulty: 4, seoTitle: "Huntington's Disease for PT Exam", seoDescription: "HD motor, cognitive, and behavioral symptoms with stage-appropriate PT interventions." },
  { slug: "cerebral-palsy-pt-management", title: "Cerebral Palsy: Physical Therapy Management", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Developmental Conditions", subtopic: "Cerebral Palsy", difficulty: 4, seoTitle: "Cerebral Palsy PT for Exam", seoDescription: "CP classification (GMFCS), tone management, functional mobility, and adaptive equipment." },
  { slug: "spina-bifida-rehabilitation", title: "Spina Bifida Rehabilitation", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Developmental Conditions", subtopic: "Spina Bifida", difficulty: 4, seoTitle: "Spina Bifida Rehab for PT Exam", seoDescription: "Spina bifida functional levels, orthotic needs, wheelchair prescription, and skin care." },
  { slug: "vestibular-hypofunction-rehab", title: "Vestibular Hypofunction Rehabilitation", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Vestibular Rehab", subtopic: "Hypofunction", difficulty: 4, seoTitle: "Vestibular Rehab for PT Exam", seoDescription: "Vestibular hypofunction gaze stabilization, substitution strategies, and habituation exercises." },
  { slug: "bppv-assessment-treatment", title: "BPPV Assessment and Canalith Repositioning", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Vestibular Rehab", subtopic: "BPPV", difficulty: 3, seoTitle: "BPPV Treatment for Physical Therapists", seoDescription: "Dix-Hallpike test, Epley maneuver, and canal variants with repositioning techniques." },
  { slug: "neuroplasticity-motor-learning", title: "Neuroplasticity and Motor Learning Principles", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Motor Learning", subtopic: "Neuroplasticity", difficulty: 3, seoTitle: "Neuroplasticity for PT Exam", seoDescription: "Neuroplasticity principles, massed practice, task specificity, and motor learning stages." },
  { slug: "constraint-induced-movement-therapy", title: "Constraint-Induced Movement Therapy", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Motor Learning", subtopic: "CIMT", difficulty: 4, seoTitle: "CIMT for Physical Therapists", seoDescription: "CIMT protocols, modified CIMT, patient selection criteria, and evidence base." },
  { slug: "body-weight-supported-gait-neuro", title: "Body-Weight Supported Gait Training in Neuro", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Neuro Gait", subtopic: "BWSTT", difficulty: 3, seoTitle: "BWSTT in Neuro Rehab for PTs", seoDescription: "Body-weight supported treadmill training for stroke, SCI, and TBI populations." },
  { slug: "functional-electrical-stimulation-rehab", title: "Functional Electrical Stimulation in Neuro Rehab", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Neuro Modalities", subtopic: "FES", difficulty: 3, seoTitle: "FES in Neuro Rehab for PTs", seoDescription: "FES for foot drop, cycling, and upper extremity recovery in neurological conditions." },
  { slug: "wheelchair-seating-positioning", title: "Wheelchair Seating and Positioning", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Adaptive Equipment", subtopic: "Wheelchair Seating", difficulty: 3, seoTitle: "Wheelchair Seating for PT Exam", seoDescription: "Wheelchair measurement, cushion selection, and pressure management for neurological conditions." },
  { slug: "spasticity-assessment-interventions", title: "Spasticity Assessment and PT Interventions", domain: "Neurological Rehabilitation", bodySystem: "Neurological", topic: "Tone Management", subtopic: "Spasticity", difficulty: 3, seoTitle: "Spasticity Management for PT Exam", seoDescription: "Modified Ashworth Scale, Tardieu Scale, positioning, stretching, and tone-reducing techniques." },
];

const PT_LESSON_SYSTEM_PROMPT = `You are a senior physical therapy educator creating comprehensive clinical lessons for NPTE (US) and PCE (Canada) licensing exam preparation.

Each lesson must follow this EXACT structure with ALL sections:

1. **Overview** - 150-200 word introduction to the topic with clinical relevance and exam importance
2. **Pathophysiology** - Disease/injury mechanisms, structural changes, tissue healing timelines, biomechanical considerations
3. **Evaluation Methods** - Systematic assessment approach, special tests, outcome measures, differential diagnosis considerations
4. **Intervention Protocols** - Evidence-based treatment approaches, exercise prescription, manual therapy techniques, modality application, progression criteria
5. **Clinical Pearls** - 8-10 high-yield exam pearls formatted as bullet points, focusing on commonly tested concepts, exam traps, and must-know facts
6. **Evidence Base** - Key research findings, clinical practice guidelines, systematic review conclusions relevant to the topic
7. **Learning Objectives** - 4-6 specific, measurable learning objectives for the lesson

REQUIREMENTS:
- Total lesson length: 2000-3000 words
- Use precise clinical terminology appropriate for licensing exam preparation
- Include specific ranges (ROM, strength grades, timing protocols)
- Reference evidence-based clinical practice guidelines where applicable
- Include exam-relevant mnemonics and memory aids when appropriate
- Address both NPTE and PCE exam perspectives when differences exist
- Include clinical vignettes when possible (1-2 patient scenarios)

Return valid JSON with these fields:
{
  "overview": "...",
  "pathophysiology": "...",
  "evaluationMethods": "...",
  "interventionProtocols": "...",
  "clinicalPearls": ["pearl1", "pearl2", ...],
  "evidenceBase": "...",
  "learningObjectives": ["obj1", "obj2", ...],
  "clinicalVignettes": [{"scenario": "...", "question": "...", "answer": "..."}],
  "examTrapWarning": "..."
}`;

const PT_FLASHCARD_SYSTEM_PROMPT = `You are a physical therapy exam preparation flashcard writer. Create concise, high-yield flashcards for NPTE/PCE exam preparation.

Each flashcard should test a specific concept:
- "definition" cards test terminology, classifications, or key facts
- "clinical_decision" cards present scenarios requiring clinical reasoning
- "red_flag" cards highlight safety concerns, contraindications, or emergency signs
- "technique" cards test specific techniques, protocols, or procedures

Return valid JSON:
{
  "flashcards": [
    {
      "cardType": "definition|clinical_decision|red_flag|technique",
      "front": "Clear question or concept prompt",
      "back": "Concise answer with explanation",
      "rationale": "Brief clinical reasoning",
      "clinicalPearl": "High-yield exam pearl"
    }
  ]
}`;

function generateContentHash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 32);
}

const MIN_LESSON_WORD_COUNT = 600;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validateLessonContent(content: LessonContent): { valid: boolean; reasons: string[]; wordCount: number } {
  const reasons: string[] = [];
  const requiredSections = ["overview", "pathophysiology", "evaluationMethods", "interventionProtocols", "clinicalPearls", "evidenceBase"];

  const missingSections = requiredSections.filter(s => !(content as any)[s]);
  if (missingSections.length > 0) {
    reasons.push(`missing_sections: ${missingSections.join(", ")}`);
  }

  const allText = requiredSections
    .map(s => {
      const val = (content as any)[s];
      return typeof val === "string" ? val : Array.isArray(val) ? val.join(" ") : "";
    })
    .join(" ");
  const wc = wordCount(allText);

  if (wc < MIN_LESSON_WORD_COUNT) {
    reasons.push(`word_count_too_low: ${wc} (minimum ${MIN_LESSON_WORD_COUNT})`);
  }

  if (!content.clinicalPearls || !Array.isArray(content.clinicalPearls) || content.clinicalPearls.length < 5) {
    reasons.push("insufficient_clinical_pearls");
  }

  if (!content.learningObjectives || !Array.isArray(content.learningObjectives) || content.learningObjectives.length < 3) {
    reasons.push("insufficient_learning_objectives");
  }

  return { valid: reasons.length === 0, reasons, wordCount: wc };
}

function buildLessonMarkdown(content: LessonContent): string {
  const sections: string[] = [];

  if (content.overview) sections.push(`## Overview\n\n${content.overview}`);
  if (content.pathophysiology) sections.push(`## Pathophysiology\n\n${content.pathophysiology}`);
  if (content.evaluationMethods) sections.push(`## Evaluation Methods\n\n${content.evaluationMethods}`);
  if (content.interventionProtocols) sections.push(`## Intervention Protocols\n\n${content.interventionProtocols}`);

  if (content.clinicalPearls && Array.isArray(content.clinicalPearls)) {
    sections.push(`## Clinical Pearls\n\n${content.clinicalPearls.map((p: string) => `- ${p}`).join("\n")}`);
  }

  if (content.evidenceBase) sections.push(`## Evidence Base\n\n${content.evidenceBase}`);

  if (content.learningObjectives && Array.isArray(content.learningObjectives)) {
    sections.push(`## Learning Objectives\n\n${content.learningObjectives.map((o: string, i: number) => `${i + 1}. ${o}`).join("\n")}`);
  }

  if (content.clinicalVignettes && Array.isArray(content.clinicalVignettes)) {
    const vignettes = content.clinicalVignettes.map((v, i) =>
      `### Clinical Vignette ${i + 1}\n\n**Scenario:** ${v.scenario}\n\n**Question:** ${v.question}\n\n**Answer:** ${v.answer}`
    ).join("\n\n");
    sections.push(`## Clinical Vignettes\n\n${vignettes}`);
  }

  return sections.join("\n\n---\n\n");
}

async function generateLessonContent(openai: OpenAI, topic: PTLessonTopic): Promise<LessonContent> {
  const userPrompt = `Generate a comprehensive physical therapy lesson on: "${topic.title}"

Domain: ${topic.domain}
Body System: ${topic.bodySystem}
Topic: ${topic.topic}
Subtopic: ${topic.subtopic}
Difficulty Level: ${topic.difficulty}/5

This lesson is for NPTE (US) and PCE (Canada) licensing exam preparation. Focus on clinical application and exam-relevant content.

Return valid JSON with all required sections.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: PT_LESSON_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 16000,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content || "{}";
  return JSON.parse(raw) as LessonContent;
}

async function generateFlashcards(openai: OpenAI, topic: PTLessonTopic, lessonContent: LessonContent): Promise<FlashcardData[]> {
  const count = 2 + Math.floor(Math.random() * 3); // 2-4 flashcards
  const userPrompt = `Generate ${count} flashcards for the physical therapy lesson: "${topic.title}"

Key concepts to cover:
- ${topic.topic} / ${topic.subtopic}
- Domain: ${topic.domain}
- Clinical pearls from the lesson: ${(lessonContent.clinicalPearls || []).slice(0, 3).join("; ")}

Generate exactly ${count} flashcards with a mix of types (definition, clinical_decision, red_flag, technique).
Return valid JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: PT_FLASHCARD_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw) as { flashcards?: FlashcardData[]; cards?: FlashcardData[] };
  return parsed.flashcards || parsed.cards || [];
}

async function insertLesson(topic: PTLessonTopic, content: LessonContent): Promise<string> {
  const fullContent = buildLessonMarkdown(content);
  const moduleId = `pt-${topic.domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}`;

  const existingCheck = await pool.query(
    "SELECT id FROM allied_lessons WHERE slug = $1 AND career_type = 'physicalTherapy'",
    [topic.slug]
  );

  if (existingCheck.rows.length > 0) {
    await pool.query(
      `UPDATE allied_lessons SET
        content = $1, clinical_reasoning = $2,
        common_mistakes = $3, exam_trap_warning = $4,
        status = 'published'
       WHERE slug = $5 AND career_type = 'physicalTherapy'`,
      [
        fullContent,
        content.clinicalVignettes ? JSON.stringify(content.clinicalVignettes) : null,
        content.clinicalPearls ? JSON.stringify(content.clinicalPearls.slice(0, 5)) : null,
        content.examTrapWarning || null,
        topic.slug,
      ]
    );
    return existingCheck.rows[0].id;
  }

  const orderRes = await pool.query(
    "SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM allied_lessons WHERE career_type = 'physicalTherapy'"
  );
  const nextOrder = orderRes.rows[0].next_order;

  const result = await pool.query(
    `INSERT INTO allied_lessons (module_id, career_type, slug, title, content, order_index, clinical_reasoning, common_mistakes, exam_trap_warning, status)
     VALUES ($1, 'physicalTherapy', $2, $3, $4, $5, $6, $7, $8, 'published')
     RETURNING id`,
    [
      moduleId,
      topic.slug,
      topic.title,
      fullContent,
      nextOrder,
      content.clinicalVignettes ? JSON.stringify(content.clinicalVignettes) : null,
      content.clinicalPearls ? JSON.stringify(content.clinicalPearls.slice(0, 5)) : null,
      content.examTrapWarning || null,
    ]
  );

  return result.rows[0].id;
}

async function insertContentItem(topic: PTLessonTopic, content: LessonContent): Promise<void> {
  const fullContent = buildLessonMarkdown(content);
  const contentJson = JSON.stringify([{
    type: "markdown",
    content: fullContent,
  }]);

  const slug = `pt-${topic.slug}`;
  const existingCheck = await pool.query(
    "SELECT id FROM content_items WHERE slug = $1",
    [slug]
  );

  if (existingCheck.rows.length > 0) {
    await pool.query(
      `UPDATE content_items SET content = $1, status = 'published', updated_at = NOW() WHERE slug = $2`,
      [contentJson, slug]
    );
    return;
  }

  await pool.query(
    `INSERT INTO content_items (title, slug, type, category, body_system, tier, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, published_at, updated_by_ai)
     VALUES ($1, $2, 'lesson', $3, $4, 'physicalTherapy', 'published', $5, $6, $7, $8, $9, $10, $11, NOW(), true)
     ON CONFLICT (slug) DO UPDATE SET content = $7, status = 'published', updated_at = NOW()`,
    [
      topic.title,
      slug,
      topic.domain,
      topic.bodySystem,
      [topic.topic, topic.subtopic, topic.domain, "physicalTherapy", "physical therapy", "NPTE", "PCE"].filter(Boolean),
      content.overview ? content.overview.substring(0, 200) : topic.seoDescription,
      contentJson,
      topic.seoTitle,
      topic.seoDescription,
      [topic.topic, topic.subtopic, "physical therapy", "NPTE", "PCE"].filter(Boolean),
      topic.topic,
    ]
  );
}

async function insertFlashcards(
  lessonId: string,
  topic: PTLessonTopic,
  flashcards: FlashcardData[]
): Promise<number> {
  let inserted = 0;

  for (const card of flashcards) {
    try {
      await pool.query(
        `INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, clinical_pearl, blueprint_category, subtopic)
         VALUES ('physicalTherapy', $1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          lessonId,
          card.cardType || "definition",
          card.front,
          card.back,
          card.rationale || "",
          card.clinicalPearl || "",
          topic.domain,
          topic.subtopic,
        ]
      );
      inserted++;
    } catch (err: any) {
      if (!err.message?.includes("duplicate")) {
        console.error(`  [Flashcard Error] ${err.message.substring(0, 100)}`);
      }
    }
  }

  return inserted;
}

interface BatchReport {
  batchNumber: number;
  lessonsGenerated: number;
  lessonsInserted: number;
  lessonsSkipped: number;
  flashcardsCreated: number;
  errors: string[];
  topics: string[];
}

async function processBatch(openai: OpenAI, batchTopics: PTLessonTopic[], batchNumber: number): Promise<BatchReport> {
  const report: BatchReport = {
    batchNumber,
    lessonsGenerated: 0,
    lessonsInserted: 0,
    lessonsSkipped: 0,
    flashcardsCreated: 0,
    errors: [],
    topics: [],
  };

  console.log(`\n=== BATCH ${batchNumber} (${batchTopics.length} lessons) ===`);

  for (let i = 0; i < batchTopics.length; i++) {
    const topic = batchTopics[i];
    console.log(`\n[${batchNumber}.${i + 1}] Generating: ${topic.title}`);
    report.topics.push(topic.title);

    try {
      const lessonContent = await generateLessonContent(openai, topic);
      report.lessonsGenerated++;
      console.log(`  Content generated (sections: ${Object.keys(lessonContent).length})`);

      const validation = validateLessonContent(lessonContent);
      if (!validation.valid) {
        console.log(`  VALIDATION FAILED (${validation.wordCount} words): ${validation.reasons.join("; ")}`);
        report.errors.push(`${topic.slug}: Validation failed - ${validation.reasons.join("; ")}`);
        report.lessonsSkipped++;
        continue;
      }
      console.log(`  Validation passed (${validation.wordCount} words)`);

      const lessonId = await insertLesson(topic, lessonContent);
      report.lessonsInserted++;
      console.log(`  Lesson inserted: ${lessonId}`);

      await insertContentItem(topic, lessonContent);
      console.log(`  Content item inserted/updated`);

      let flashcards: FlashcardData[] = [];
      try {
        flashcards = await generateFlashcards(openai, topic, lessonContent);
        console.log(`  Flashcards generated: ${flashcards.length}`);
      } catch (fcErr: any) {
        report.errors.push(`${topic.slug}: Flashcard generation failed: ${fcErr.message.substring(0, 100)}`);
        console.error(`  Flashcard generation error: ${fcErr.message.substring(0, 100)}`);
      }

      if (flashcards.length > 0) {
        const trimmed = flashcards.slice(0, 4);
        const fcInserted = await insertFlashcards(lessonId, topic, trimmed);
        report.flashcardsCreated += fcInserted;
        console.log(`  Flashcards inserted: ${fcInserted}`);
      }

      await new Promise(r => setTimeout(r, 200));
    } catch (err: any) {
      report.errors.push(`${topic.slug}: ${err.message.substring(0, 200)}`);
      console.error(`  ERROR: ${err.message.substring(0, 200)}`);
    }
  }

  return report;
}

async function main() {
  const startIdx = parseInt(process.argv[2] || "0", 10);
  const endIdx = parseInt(process.argv[3] || String(PT_LESSON_TOPICS.length), 10);
  const topics = PT_LESSON_TOPICS.slice(startIdx, endIdx);

  console.log(`=== PT LESSON GENERATION (topics ${startIdx}-${endIdx}, count: ${topics.length}) ===`);
  console.log(`Total topics defined: ${PT_LESSON_TOPICS.length}`);

  const domainCounts: Record<string, number> = {};
  for (const t of PT_LESSON_TOPICS) {
    domainCounts[t.domain] = (domainCounts[t.domain] || 0) + 1;
  }
  console.log("Domain distribution:", domainCounts);

  try {
    const dbCheck = await pool.query("SELECT current_database() AS db, NOW() AS ts");
    console.log(`Database verified: ${dbCheck.rows[0].db} at ${dbCheck.rows[0].ts}`);
  } catch (err: any) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }

  const tableCheck = await pool.query(`
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'allied_lessons') AS has_lessons,
           EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'allied_flashcards') AS has_flashcards,
           EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'content_items') AS has_content
  `);
  const tables = tableCheck.rows[0];
  if (!tables.has_lessons || !tables.has_flashcards || !tables.has_content) {
    console.error("Required tables not found (allied_lessons, allied_flashcards, content_items)");
    process.exit(1);
  }

  const openai = await getOpenAI();
  console.log("OpenAI client initialized");

  const BATCH_SIZE = 25;
  const batchReports: BatchReport[] = [];
  const totalBatches = Math.ceil(topics.length / BATCH_SIZE);

  for (let b = 0; b < totalBatches; b++) {
    const batchTopics = topics.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    const batchNum = Math.floor(startIdx / BATCH_SIZE) + b + 1;
    const report = await processBatch(openai, batchTopics, batchNum);
    batchReports.push(report);

    console.log(`\n--- Batch ${batchNum} Summary ---`);
    console.log(`Lessons: ${report.lessonsInserted}/${report.lessonsGenerated}`);
    console.log(`Flashcards: ${report.flashcardsCreated}`);
    if (report.errors.length > 0) {
      console.log(`Errors: ${report.errors.length}`);
      report.errors.forEach(e => console.log(`  - ${e}`));
    }

    if (b < totalBatches - 1) {
      console.log("\nWaiting 2 seconds before next batch...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  const totalLessonsInserted = batchReports.reduce((s, r) => s + r.lessonsInserted, 0);
  const totalFlashcardsCreated = batchReports.reduce((s, r) => s + r.flashcardsCreated, 0);
  const totalErrors = batchReports.reduce((s, r) => s + r.errors.length, 0);
  const totalLessonsSkipped = batchReports.reduce((s, r) => s + r.lessonsSkipped, 0);

  console.log(`\n=== BATCH RUN COMPLETE (topics ${startIdx}-${endIdx}) ===`);
  console.log(`Lessons Inserted:    ${totalLessonsInserted}`);
  console.log(`Lessons Skipped:     ${totalLessonsSkipped}`);
  console.log(`Flashcards Created:  ${totalFlashcardsCreated}`);
  console.log(`Errors:              ${totalErrors}`);

  console.log(`\n=== POST-RUN DB VERIFICATION ===`);

  const targetSlugs = topics.map(t => t.slug);
  const slugVerification = await pool.query(
    `SELECT slug, status FROM allied_lessons WHERE career_type = 'physicalTherapy' AND slug = ANY($1)`,
    [targetSlugs]
  );
  const foundSlugs = new Set(slugVerification.rows.map((r: { slug: string }) => r.slug));
  const missingSlugs = targetSlugs.filter(s => !foundSlugs.has(s));
  const unpublished = slugVerification.rows.filter((r: { status: string }) => r.status !== "published");

  console.log(`Target slugs verified:       ${foundSlugs.size}/${targetSlugs.length}`);
  if (missingSlugs.length > 0) {
    console.error(`WARN: Missing slugs: ${missingSlugs.join(", ")}`);
  }
  if (unpublished.length > 0) {
    console.error(`WARN: Unpublished lessons: ${unpublished.map((r: { slug: string }) => r.slug).join(", ")}`);
  }

  const dbLessons = await pool.query("SELECT COUNT(*)::int as cnt FROM allied_lessons WHERE career_type = 'physicalTherapy' AND status = 'published'");
  const dbFlashcards = await pool.query("SELECT COUNT(*)::int as cnt FROM allied_flashcards WHERE career_type = 'physicalTherapy'");
  const dbContentItems = await pool.query("SELECT COUNT(*)::int as cnt FROM content_items WHERE tier = 'physicalTherapy' AND type = 'lesson' AND status = 'published'");

  console.log(`\nDB Totals - Lessons (physicalTherapy, published): ${dbLessons.rows[0].cnt}`);
  console.log(`DB Totals - Flashcards (physicalTherapy): ${dbFlashcards.rows[0].cnt}`);
  console.log(`DB Totals - Content Items (physicalTherapy, lesson, published): ${dbContentItems.rows[0].cnt}`);

  const domainBreakdown = await pool.query(
    `SELECT category, COUNT(*)::int as cnt FROM content_items WHERE tier = 'physicalTherapy' AND type = 'lesson' GROUP BY category ORDER BY cnt DESC`
  );
  console.log("\nDomain Breakdown:");
  for (const row of domainBreakdown.rows) {
    console.log(`  ${row.category}: ${row.cnt}`);
  }

  const fcPerLesson = await pool.query(
    `SELECT COUNT(*)::float / NULLIF((SELECT COUNT(*) FROM allied_lessons WHERE career_type = 'physicalTherapy'), 0) as avg_fc
     FROM allied_flashcards WHERE career_type = 'physicalTherapy'`
  );
  console.log(`Average flashcards per lesson: ${(fcPerLesson.rows[0].avg_fc || 0).toFixed(1)}`);

  if (dbLessons.rows[0].cnt >= 150) {
    console.log("\nPASS: At least 150 PT lessons created.");
  } else {
    console.log(`\nWARN: Only ${dbLessons.rows[0].cnt} lessons (target: 150-250). May need additional batches.`);
  }

  await pool.end();
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
