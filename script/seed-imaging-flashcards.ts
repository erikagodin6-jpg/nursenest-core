import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

const FLASHCARDS = [
  { front: "What is the standard SID for a PA chest radiograph?", back: "72 inches (180 cm). Minimizes cardiac magnification.", category: "Positioning", bodyPart: "Chest", difficulty: 1 },
  { front: "How many posterior ribs should be visible on a properly inspired PA chest?", back: "Minimum of 10 posterior ribs above the diaphragm.", category: "Positioning", bodyPart: "Chest", difficulty: 1 },
  { front: "What indicates rotation on a PA chest radiograph?", back: "Unequal distances between medial clavicle ends and spinous processes.", category: "Positioning", bodyPart: "Chest", difficulty: 2 },
  { front: "What is the CR direction for a PA hand?", back: "Perpendicular to the third MCP joint.", category: "Positioning", bodyPart: "Upper Extremity", difficulty: 1 },
  { front: "Which wrist view best demonstrates the scaphoid bone?", back: "PA with ulnar deviation. Elongates the scaphoid, reducing foreshortening.", category: "Positioning", bodyPart: "Upper Extremity", difficulty: 2 },
  { front: "How much should the leg be internally rotated for an ankle mortise view?", back: "15-20 degrees. Places intermalleolar line parallel to IR.", category: "Positioning", bodyPart: "Lower Extremity", difficulty: 2 },
  { front: "What is the CR angle for an AP knee?", back: "5 degrees caudad to 1 cm below patellar apex.", category: "Positioning", bodyPart: "Lower Extremity", difficulty: 2 },
  { front: "For an AP pelvis, how much should the legs be internally rotated?", back: "15-20 degrees. Demonstrates femoral necks without foreshortening.", category: "Positioning", bodyPart: "Pelvis/Hip", difficulty: 1 },
  { front: "What line should be perpendicular to the IR for a PA Caldwell skull?", back: "OML (orbitomeatal line). With 15 degrees caudad CR angle.", category: "Positioning", bodyPart: "Skull", difficulty: 3 },
  { front: "For AP lumbar spine, why are the knees flexed?", back: "To reduce lumbar lordosis and open intervertebral disc spaces.", category: "Positioning", bodyPart: "Spine", difficulty: 2 },
  { front: "What is bremsstrahlung radiation?", back: "Radiation produced when an electron is decelerated by the nuclear force field of a target atom. Produces continuous energy spectrum, accounts for 80-90% of beam.", category: "Physics", difficulty: 1 },
  { front: "What is the K-shell binding energy of tungsten?", back: "69.5 keV. Incident electrons must exceed this energy to produce K-characteristic X-rays.", category: "Physics", difficulty: 3 },
  { front: "What determines the maximum photon energy in an X-ray beam?", back: "The kVp setting. Maximum energy in keV equals the peak kilovoltage.", category: "Physics", difficulty: 1 },
  { front: "How does photoelectric absorption probability change with atomic number?", back: "Proportional to Z^3 (cube of atomic number). Full relationship: Z^3/E^3.", category: "Physics", difficulty: 3 },
  { front: "What is the primary source of scatter radiation in diagnostic radiology?", back: "Compton scattering. Predominant interaction in the diagnostic energy range.", category: "Physics", difficulty: 2 },
  { front: "What is the magnification factor formula?", back: "MF = SID / SOD. SOD = SID - OID. Image size = object size x MF.", category: "Physics", difficulty: 2 },
  { front: "State the inverse square law.", back: "I1/I2 = (D2/D1)^2. Doubling distance reduces intensity to one-quarter.", category: "Physics", difficulty: 2 },
  { front: "What is a half-value layer (HVL)?", back: "Thickness of material needed to reduce beam intensity by 50%. Higher HVL = more penetrating beam.", category: "Physics", difficulty: 2 },
  { front: "What is the anode heel effect?", back: "Greater beam intensity on cathode side. Thicker body parts should be placed cathode-side.", category: "Physics", difficulty: 2 },
  { front: "What is the line-focus principle?", back: "Angling the anode target makes the effective focal spot smaller than the actual focal spot, improving resolution while maintaining heat capacity.", category: "Physics", difficulty: 2 },
  { front: "What is the annual occupational whole-body dose limit in Canada (CNSC)?", back: "50 mSv per year, with 100 mSv cumulative over 5 years.", category: "Radiation Safety", difficulty: 1 },
  { front: "What is the annual occupational dose limit in the USA (NCRP)?", back: "50 mSv (5 rem) per year. Cumulative: 10 mSv x age.", category: "Radiation Safety", difficulty: 1 },
  { front: "What is the annual public dose limit?", back: "1 mSv per year (both Canada CNSC and USA NCRP).", category: "Radiation Safety", difficulty: 1 },
  { front: "What is the dose limit to the embryo/fetus in Canada?", back: "4 mSv for the remainder of pregnancy after declaration (CNSC).", category: "Radiation Safety", difficulty: 3 },
  { front: "What is the total gestational dose limit in the USA?", back: "5 mSv (0.5 rem) total gestation, 0.5 mSv/month (NCRP).", category: "Radiation Safety", difficulty: 3 },
  { front: "What are the three cardinal principles of radiation protection?", back: "Time (minimize), Distance (maximize), and Shielding (use appropriate barriers).", category: "Radiation Safety", difficulty: 1 },
  { front: "What does ALARA stand for?", back: "As Low As Reasonably Achievable. The guiding principle for all radiation exposures.", category: "Radiation Safety", difficulty: 1 },
  { front: "What is the minimum lead equivalence for a protective apron in fluoroscopy?", back: "0.50 mm Pb (0.25 mm Pb for wrap-around with overlap).", category: "Radiation Safety", difficulty: 2 },
  { front: "What is the 15% kVp rule?", back: "Increasing kVp by 15% approximately doubles receptor exposure, equivalent to doubling mAs.", category: "Image Production", difficulty: 2 },
  { front: "What controls contrast in digital radiography?", back: "Window width. Narrow = high contrast. Wide = low contrast. Window level controls brightness.", category: "Image Production", difficulty: 2 },
  { front: "What does Deviation Index (DI) = 0 indicate?", back: "Exposure matched the target exactly. Positive = overexposure, Negative = underexposure.", category: "Image Production", difficulty: 2 },
  { front: "What technical factor primarily controls X-ray quantity?", back: "mAs (milliampere-seconds). Directly controls number of photons produced.", category: "Image Production", difficulty: 1 },
  { front: "What does the Exposure Index (EI) represent?", back: "A measure of radiation reaching the digital detector. Provides feedback on technique adequacy.", category: "Image Production", difficulty: 2 },
  { front: "In direct DR, what converts X-rays to electrical charge?", back: "Amorphous selenium (a-Se). No intermediate light conversion step.", category: "Image Production", difficulty: 3 },
  { front: "What is the difference between CR and DR?", back: "CR uses PSP plates requiring separate scanning. DR uses fixed flat-panel detectors with immediate image display. DR has higher DQE.", category: "Image Production", difficulty: 2 },
  { front: "What is the purpose of the rotating anode?", back: "Distributes heat over a larger area (focal track), allowing higher tube loading without melting.", category: "Equipment", difficulty: 1 },
  { front: "How does a high-frequency generator compare to single-phase?", back: "Nearly constant potential (<1% ripple vs 100%). Higher average beam energy, more efficient, lower patient dose.", category: "Equipment", difficulty: 2 },
  { front: "What does an AEC system do?", back: "Terminates exposure based on radiation reaching detectors behind the patient, ensuring consistent receptor exposure.", category: "Equipment", difficulty: 2 },
  { front: "What is the most effective method to prevent infection spread in radiology?", back: "Proper hand hygiene (handwashing or alcohol-based sanitizer).", category: "Patient Care", difficulty: 1 },
  { front: "When is water-soluble iodinated contrast preferred over barium?", back: "When bowel perforation is suspected. Barium causes severe peritonitis if it leaks into the peritoneum.", category: "Patient Care", difficulty: 2 },
  { front: "What is the first drug for anaphylactic contrast reaction?", back: "Epinephrine. Reverses bronchospasm, vasodilation, and increases cardiac output.", category: "Patient Care", difficulty: 3 },
  { front: "What target material is used in diagnostic X-ray tubes?", back: "Tungsten (Z=74). High atomic number, high melting point (3370 C), good thermal conductivity.", category: "Equipment", difficulty: 1 },
  { front: "What is three-phase 12-pulse ripple factor?", back: "Approximately 4%. More efficient than single-phase (100%) or three-phase 6-pulse (13%).", category: "Equipment", difficulty: 2 },
  { front: "What must be verified before any radiographic exam?", back: "Patient identity and requisition. First step to prevent wrong-patient errors.", category: "Patient Care", difficulty: 1 },
  { front: "What is an absolute contraindication to barium sulfate oral contrast?", back: "Suspected bowel perforation. Barium in peritoneum causes severe peritonitis.", category: "Patient Care", difficulty: 2 },
];

async function seed() {
  const client = await pool.connect();
  try {
    const { rows: [{ count }] } = await client.query("SELECT count(*) as count FROM imaging_flashcards");
    console.log(`Existing imaging flashcards: ${count}`);
    if (parseInt(count) >= 40) {
      console.log("Already have 40+ flashcards, skipping seed.");
      await pool.end();
      return;
    }

    for (const fc of FLASHCARDS) {
      const existing = await client.query(
        `SELECT id FROM imaging_flashcards WHERE front=$1 LIMIT 1`,
        [fc.front]
      );
      if (existing.rows.length > 0) {
        console.log(`  Skip: ${fc.front.substring(0, 50)}... (exists)`);
        continue;
      }
      await client.query(
        `INSERT INTO imaging_flashcards (front, back, category, body_part, difficulty, status) VALUES ($1,$2,$3,$4,$5,'published')`,
        [fc.front, fc.back, fc.category, fc.bodyPart || null, fc.difficulty]
      );
      console.log(`  Created: ${fc.front.substring(0, 60)}...`);
    }
    console.log("Flashcard seed complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => { console.error(err); process.exit(1); });
