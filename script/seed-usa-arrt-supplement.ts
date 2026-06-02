import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

const POSITIONING = [
  { slug: "ap-femur-usa", title: "AP Femur", body_part: "Lower Extremity", modality: "X-ray", projection: "AP", patient_position: "Supine on table", part_position: "Leg extended, internally rotated 10-15 degrees", central_ray: "Perpendicular to mid-femur", ir_size: "14x17 (35x43 cm) lengthwise", sid: "40 inches (100 cm)", structures_shown: "Entire femur from hip to knee joint, including one joint on each image", evaluation_criteria: "Long axis of femur centered; slight internal rotation showing femoral neck in profile; must include at least one joint (hip or knee); adequate penetration of femoral shaft", tips: "If femur too long for single image, take two overlapping views each including one joint. Rotate leg 10-15° internally to place femoral neck in profile.", country: "usa", exam: "arrt" },
  { slug: "ap-tib-fib-usa", title: "AP Tibia-Fibula", body_part: "Lower Extremity", modality: "X-ray", projection: "AP", patient_position: "Supine on table", part_position: "Leg fully extended, no rotation, foot vertical", central_ray: "Perpendicular to mid-shaft of tibia", ir_size: "14x17 (35x43 cm) lengthwise", sid: "40 inches (100 cm)", structures_shown: "Full tibia and fibula shafts with at least one joint (ankle or knee) included", evaluation_criteria: "Leg not rotated (slight overlap of fibular head on tibia is normal); tibial shaft centered; must include at least one joint; soft tissue visible", tips: "Must include at least one joint. If leg is long, two overlapping images may be needed. Keep foot vertical (dorsiflexed) for true AP.", country: "usa", exam: "arrt" },
  { slug: "lateral-finger-usa", title: "Lateral Finger", body_part: "Upper Extremity", modality: "X-ray", projection: "Lateral", patient_position: "Seated at table end", part_position: "Affected finger extended in true lateral position, other fingers flexed away", central_ray: "Perpendicular to PIP joint of affected finger", ir_size: "8x10 (18x24 cm)", sid: "40 inches (100 cm)", structures_shown: "Lateral view of entire finger showing DIP, PIP, and MCP joints without superimposition of adjacent fingers", evaluation_criteria: "True lateral without superimposition of adjacent fingers; DIP, PIP, and MCP joints open; phalanges in profile; entire finger from tip to metacarpal head", tips: "Fan other fingers out of the way. Use a small focal spot for detail. Can use finger splint to maintain position.", country: "usa", exam: "arrt" },
  { slug: "ap-thumb-usa", title: "AP Thumb (1st Digit)", body_part: "Upper Extremity", modality: "X-ray", projection: "AP", patient_position: "Seated at table, hand rotated to place thumb flat on IR", part_position: "Hand internally rotated until posterior surface of thumb is flat against IR", central_ray: "Perpendicular to MCP joint of thumb", ir_size: "8x10 (18x24 cm)", sid: "40 inches (100 cm)", structures_shown: "True AP of thumb showing distal phalanx, proximal phalanx, 1st metacarpal, and CMC joint", evaluation_criteria: "True AP projection (no obliquity); interphalangeal and MCP joints open; CMC joint visible; entire thumb from tip to trapezium", tips: "This is a true AP, not a PA. The hand must be rotated medially so the thumb lies flat posteriorly against the IR. Modified Robert method.", country: "usa", exam: "arrt" },
  { slug: "lateral-facial-bones-usa2", title: "Lateral Facial Bones", body_part: "Head", modality: "X-ray", projection: "Lateral", patient_position: "Seated or prone, MSP parallel to IR", part_position: "Head in true lateral, interpupillary line perpendicular to IR, IOML parallel to transverse axis", central_ray: "Perpendicular to zygoma, midway between outer canthus and EAM", ir_size: "8x10 (18x24 cm)", sid: "40 inches (100 cm)", structures_shown: "Lateral view of facial bones including orbits, maxillae, nasal bones, zygomatic arches, and mandible superimposed", evaluation_criteria: "True lateral: mandibular rami and orbital roofs superimposed; sella turcica visible; all facial bones from frontal bone to mandibular angle", tips: "Check true lateral by verifying superimposition of mandibular rami. Collimate tightly to facial structures.", country: "usa", exam: "arrt" },
  { slug: "ap-bilateral-knees-weight-bearing-usa", title: "AP Bilateral Knees Weight-Bearing", body_part: "Lower Extremity", modality: "X-ray", projection: "AP", patient_position: "Standing erect facing the tube, weight evenly distributed", part_position: "Both knees extended, centered to IR, no rotation", central_ray: "Horizontal, directed to a point 1/2 inch below the apices of both patellae", ir_size: "14x17 (35x43 cm) crosswise", sid: "40 inches (100 cm)", structures_shown: "Both knee joints with joint spaces visible for comparison; used to assess joint space narrowing in osteoarthritis", evaluation_criteria: "Both knees on one image; joint spaces open; no rotation (fibular heads equally visible); patellae centered over femoral condyles", tips: "Weight-bearing views demonstrate joint narrowing not visible on non-weight-bearing. Patient must stand with equal weight on both legs.", country: "usa", exam: "arrt" },
  { slug: "sunrise-patella-usa", title: "Sunrise (Settegast) Patella View", body_part: "Lower Extremity", modality: "X-ray", projection: "Tangential (Axial)", patient_position: "Prone on table", part_position: "Knee flexed 90 degrees or more, IR resting against anterior thigh above patella", central_ray: "Angled 15-20 degrees cephalad through patellofemoral joint", ir_size: "8x10 (18x24 cm)", sid: "40 inches (100 cm)", structures_shown: "Tangential view of patella showing its articular surface, patellofemoral joint space, and intercondylar sulcus", evaluation_criteria: "Patella in profile; patellofemoral joint space open bilaterally; no rotation (equal femoral condyles); intercondylar sulcus visible", tips: "Settegast method: prone with knee flexed. Do not attempt if patient has acute knee injury or cannot flex the knee. Alternative: Merchant method (supine).", country: "usa", exam: "arrt" },
  { slug: "ap-axial-sacroiliac-joints-usa", title: "AP Axial SI Joints", body_part: "Spine/Pelvis", modality: "X-ray", projection: "AP Axial", patient_position: "Supine on table", part_position: "Legs extended, MSP centered to midline, no rotation", central_ray: "30-35 degrees cephalad, entering at level of ASIS", ir_size: "10x12 (24x30 cm)", sid: "40 inches (100 cm)", structures_shown: "Both sacroiliac joints opened and visible without superimposition of sacrum", evaluation_criteria: "Both SI joints equally demonstrated; joint spaces open; symmetric appearance; sacrum not superimposed over SI joints", tips: "The cephalad angle opens the SI joints which are angled 25-30° posteriorly. Compare with oblique SI joint views for unilateral evaluation.", country: "usa", exam: "arrt" },
  { slug: "ap-axial-outlet-pelvis-usa", title: "AP Axial Outlet (Inlet/Outlet) Pelvis", body_part: "Spine/Pelvis", modality: "X-ray", projection: "AP Axial", patient_position: "Supine on table", part_position: "Legs extended, MSP centered, no rotation", central_ray: "Outlet view: 30-45 degrees cephalad, entering at symphysis pubis", ir_size: "14x17 (35x43 cm) crosswise", sid: "40 inches (100 cm)", structures_shown: "Pelvic outlet demonstrating inferior pubic rami, ischial rami, and obturator foramina without foreshortening. Used in trauma to assess pelvic ring disruption", evaluation_criteria: "Pubic and ischial rami elongated without foreshortening; obturator foramina open; symmetric iliac wings; symphysis pubis open", tips: "Outlet view: cephalad angle. Inlet view: 40° caudad. Both are trauma views to assess pelvic ring integrity. Often done with AP pelvis as a series.", country: "usa", exam: "arrt" },
  { slug: "lateral-sacrum-usa", title: "Lateral Sacrum", body_part: "Spine/Pelvis", modality: "X-ray", projection: "Lateral", patient_position: "Left lateral recumbent", part_position: "Knees and hips flexed for stability, coronal plane perpendicular to IR, sacrum centered", central_ray: "Perpendicular, entering 3 inches posterior to ASIS at level of ASIS (L5-S1 area)", ir_size: "10x12 (24x30 cm)", sid: "40 inches (100 cm)", structures_shown: "Lateral view of sacrum and coccyx showing sacral curvature, L5-S1 junction, sacral foramina, and coccyx", evaluation_criteria: "Sacrum in true lateral (not rotated); L5-S1 junction visible; sacral curvature demonstrated; coccyx included; adequate penetration", tips: "Use lead blocker behind patient to reduce scatter. Increase technique significantly compared to lateral lumbar spine due to increased tissue thickness.", country: "usa", exam: "arrt" },
];

const CASE_STUDY = {
  title: "Lumbar Spine Compression Fracture in Elderly Patient",
  clinical_history: "82-year-old female presents with acute lower back pain after bending to lift groceries. History of osteoporosis. Pain localized to the thoracolumbar junction. No neurological deficits. Ordered for AP and lateral lumbar spine radiographs.",
  findings: "The lateral lumbar spine radiograph demonstrates a wedge-shaped compression deformity of the L1 vertebral body with approximately 40% loss of anterior height. The posterior vertebral body height is maintained. No retropulsion of bony fragments into the spinal canal is identified on the lateral view. Generalized osteopenia is noted throughout the visualized spine with thinning of cortical bone. The remaining lumbar vertebral bodies maintain normal alignment. Disc spaces are moderately narrowed at L4-L5 and L5-S1 consistent with degenerative changes. AP view shows loss of height at L1 level without lateral listhesis.",
  diagnosis: "Acute osteoporotic compression fracture of L1 vertebral body (AO Type A1 - wedge compression)",
  discussion: "Osteoporotic vertebral compression fractures are the most common fragility fracture, affecting approximately 25% of postmenopausal women over age 50. They most commonly occur at the thoracolumbar junction (T11-L2). The radiographer should ensure high-quality lateral views with adequate penetration to evaluate vertebral body heights. The lateral view is the most important projection for diagnosing compression fractures. Key radiographic findings include loss of vertebral body height (anterior, middle, or posterior), increased density of the compressed vertebra (due to impaction), and possible kyphotic angulation. It is essential to differentiate benign osteoporotic fractures from pathological fractures due to metastatic disease. Features suggesting malignancy include pedicle destruction (winking owl sign on AP), posterior element involvement, soft tissue mass, and multiple non-contiguous fractures. The radiographer should ensure the lateral view includes the entire lumbar spine from T12 to the sacrum. The AP view helps assess for lateral compression and scoliosis. Technical factors should provide adequate penetration of the lateral view, which is the most challenging due to increased tissue density. In elderly patients, consider patient comfort and use positioning aids to maintain the lateral position.",
  modality: "X-ray",
  body_part: "Lumbar Spine",
  difficulty: 2,
  image_urls: [],
  status: "published"
};

const IMAGE_BRIEFS = [
  { title: "AP Femur X-ray - Full Length", description: "Full-length AP radiograph of the femur from hip to knee showing normal alignment, cortical thickness, and medullary cavity. Demonstrates proper 10-15 degree internal rotation technique.", modality: "X-ray", body_part: "Lower Extremity", tags: ["femur","ap","lower-extremity","long-bone","positioning"], status: "published" },
  { title: "Settegast Patella Tangential View", description: "Tangential (sunrise/Settegast) view of the patella showing the articular surface, patellofemoral joint space, and intercondylar sulcus. Demonstrates proper prone positioning with knee flexed.", modality: "X-ray", body_part: "Lower Extremity", tags: ["patella","sunrise","settegast","tangential","knee"], status: "published" },
  { title: "Lumbar Compression Fracture on Lateral X-ray", description: "Lateral lumbar spine radiograph demonstrating an L1 compression fracture with anterior wedging and approximately 40% height loss. Shows osteopenic bone density typical of elderly patients with osteoporosis.", modality: "X-ray", body_part: "Lumbar Spine", tags: ["compression-fracture","lumbar","lateral","osteoporosis","elderly"], status: "published" },
];

async function seed() {
  let posInserted = 0;
  for (const p of POSITIONING) {
    const exists = await pool.query(`SELECT id FROM imaging_positioning_entries WHERE slug = $1`, [p.slug]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO imaging_positioning_entries (slug, projection_name, body_part, patient_position, body_part_position, central_ray, film_size, sid, anatomy_demonstrated, evaluation_criteria, tips, country, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'published')`,
        [p.slug, p.title + " — " + p.projection, p.body_part, p.patient_position, p.part_position, p.central_ray, p.ir_size, p.sid, p.structures_shown, p.evaluation_criteria, p.tips, p.country]
      );
      posInserted++;
    }
  }
  console.log(`[Positioning Supplement] Inserted ${posInserted}/${POSITIONING.length}`);

  const csExists = await pool.query(`SELECT id FROM imaging_case_studies WHERE title = $1`, [CASE_STUDY.title]);
  if (csExists.rows.length === 0) {
    await pool.query(
      `INSERT INTO imaging_case_studies (title, clinical_history, findings, diagnosis, discussion, modality, body_part, difficulty, image_urls, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [CASE_STUDY.title, CASE_STUDY.clinical_history, CASE_STUDY.findings, CASE_STUDY.diagnosis, CASE_STUDY.discussion, CASE_STUDY.modality, CASE_STUDY.body_part, CASE_STUDY.difficulty, CASE_STUDY.image_urls, CASE_STUDY.status]
    );
    console.log(`[Case Study Supplement] Inserted 1/1`);
  } else {
    console.log(`[Case Study Supplement] Already exists, skipped`);
  }

  let imgInserted = 0;
  for (const img of IMAGE_BRIEFS) {
    const exists = await pool.query(`SELECT id FROM image_assets WHERE title = $1`, [img.title]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO image_assets (title, description, image_url, modality, body_part, tags, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [img.title, img.description, "", img.modality, img.body_part, img.tags, img.status]
      );
      imgInserted++;
    }
  }
  console.log(`[Image Brief Supplement] Inserted ${imgInserted}/${IMAGE_BRIEFS.length}`);
}

seed().then(() => pool.end()).catch(e => { console.error(e); pool.end(); });
