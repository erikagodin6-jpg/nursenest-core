import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let c = fs.readFileSync(fp, "utf8");
    const marker = `"${id}":`;
    const idx = c.indexOf(marker);
    if (idx === -1) continue;
    if (!c.slice(idx, idx + 300).includes("[WRITE YOUR")) continue;
    let bc = 0, es = idx + marker.length;
    while (es < c.length && c[es] !== "{") es++;
    let start = es;
    for (let i = start; i < c.length; i++) {
      if (c[i] === "{") bc++;
      else if (c[i] === "}") { bc--; if (bc === 0) { es = i + 1; break; } }
    }
    const newBlock = `{\n    ${buildLS(lesson)}\n  }`;
    c = c.slice(0, start) + newBlock + c.slice(es);
    fs.writeFileSync(fp, c, "utf8");
    console.log(`Injected ${id} in ${file}`);
    return true;
  }
  console.log(`NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {

"glaucoma-rpn": {
  title: "Glaucoma",
  cellular: {
    title: "Pathophysiology of Glaucoma",
    content: "Glaucoma is a group of progressive optic neuropathies characterised by damage to the optic nerve and irreversible vision loss. It is the leading cause of irreversible blindness worldwide. The primary mechanism involves elevated intraocular pressure (IOP) that exceeds the tolerance of retinal ganglion cells, causing axonal damage and cell death at the optic nerve head.\n\nNormal IOP ranges from 10 to 21 mmHg and is maintained by a balance between aqueous humour production by the ciliary body and its drainage through the trabecular meshwork into the canal of Schlemm. When drainage is impaired or production exceeds outflow capacity, IOP rises. However, it is important to note that some patients develop glaucomatous damage at statistically normal pressures (normal-tension glaucoma), while others tolerate elevated IOP without damage (ocular hypertension). This means IOP is a major risk factor but not the sole determinant.\n\nThe two main types are open-angle glaucoma and angle-closure glaucoma. Primary open-angle glaucoma (POAG) is the most common form, accounting for approximately 90% of cases. In POAG, the drainage angle between the iris and cornea appears anatomically open, but microscopic changes in the trabecular meshwork reduce aqueous outflow. This leads to gradual, painless IOP elevation. Peripheral vision is lost first (tunnel vision), and central vision is preserved until late stages, which is why the disease is called the silent thief of sight. By the time patients notice visual changes, significant irreversible damage has occurred.\n\nAcute angle-closure glaucoma is an ophthalmological emergency. It occurs when the peripheral iris physically blocks the trabecular meshwork, obstructing aqueous outflow completely. IOP can rise rapidly above 40-60 mmHg. This produces sudden, severe eye pain, headache, nausea and vomiting, seeing halos around lights, and a fixed mid-dilated pupil. The cornea appears hazy or steamy from oedema. Without emergent treatment, permanent vision loss can occur within hours.\n\nThe mechanism of nerve damage involves both mechanical compression and vascular insufficiency. Elevated IOP compresses axons at the lamina cribrosa (the sieve-like structure where the optic nerve exits the eye), disrupting axoplasmic flow and depriving retinal ganglion cells of neurotrophic factors. Vascular compression reduces blood flow to the optic nerve head, causing ischaemia. The combination of mechanical stress and reduced perfusion triggers apoptosis (programmed cell death) of retinal ganglion cells.\n\nFor the RPN, the critical nursing priorities are: recognising acute angle-closure as an emergency, understanding that chronic glaucoma requires lifelong adherence to eye drop therapy to prevent blindness, correctly administering ophthalmic medications, and teaching patients about the importance of regular IOP monitoring. Once vision is lost to glaucoma, it cannot be restored - all treatment aims to preserve remaining vision."
  },
  riskFactors: [
    "Age over 60 years (risk increases significantly with each decade; prevalence 2% at age 40 rising to 8% by age 80)",
    "African American or Hispanic heritage (3-4 times higher prevalence of open-angle glaucoma; earlier onset and more aggressive disease course)",
    "Asian or Inuit heritage (higher risk of angle-closure glaucoma due to anatomical predisposition of shallow anterior chambers)",
    "Family history of glaucoma in first-degree relatives (4-9 times increased risk; polygenic inheritance pattern)",
    "Elevated intraocular pressure above 21 mmHg (strongest modifiable risk factor)",
    "Myopia (nearsightedness) for open-angle; hyperopia (farsightedness) for angle-closure",
    "Thin central corneal thickness (less than 520 micrometres) may underestimate true IOP on tonometry",
    "Diabetes mellitus, cardiovascular disease, and chronic corticosteroid use (both systemic and topical)",
    "Previous eye trauma or surgery, and prolonged use of topical or systemic corticosteroids"
  ],
  diagnostics: [
    "Tonometry: measures intraocular pressure; Goldmann applanation tonometry is the gold standard; normal IOP 10-21 mmHg; IOP above 21 mmHg is suspicious but not diagnostic alone",
    "Gonioscopy: examines the drainage angle between iris and cornea to differentiate open-angle from angle-closure glaucoma; critical for treatment planning",
    "Ophthalmoscopy (fundoscopy): direct visualisation of the optic nerve head; glaucomatous cupping shows increased cup-to-disc ratio (normal is 0.3 or less; suspicious at 0.5 or greater), rim thinning, disc haemorrhages",
    "Visual field testing (perimetry): maps peripheral and central vision; detects scotomas (blind spots) that the patient may not notice; characteristic patterns include arcuate scotoma, nasal step defect",
    "Optical coherence tomography (OCT): high-resolution imaging of retinal nerve fibre layer thickness; can detect structural damage before visual field loss occurs; essential for early detection and monitoring progression",
    "Pachymetry: measures corneal thickness; thin corneas may give falsely low IOP readings; important for accurate IOP interpretation"
  ],
  management: [
    "First-line pharmacotherapy with topical prostaglandin analogues (latanoprost, travoprost, bimatoprost): once-daily dosing in the evening; increases uveoscleral outflow to reduce IOP by 25-35%",
    "Second-line options include topical beta-blockers (timolol), alpha-agonists (brimonidine), carbonic anhydrase inhibitors (dorzolamide), and combination drops when monotherapy is insufficient",
    "Laser trabeculoplasty (selective laser trabeculoplasty, SLT): outpatient procedure that improves aqueous outflow through the trabecular meshwork; can be used as first-line or adjunct therapy",
    "Surgical intervention (trabeculectomy, tube shunt surgery, minimally invasive glaucoma surgery) for cases uncontrolled by medications and laser",
    "Acute angle-closure emergency management: immediate topical medications to lower IOP (timolol, brimonidine, pilocarpine), IV acetazolamide or mannitol, followed by laser peripheral iridotomy to create an alternate drainage pathway",
    "Lifelong monitoring with regular IOP checks, visual field testing, and optic nerve imaging every 3-12 months depending on severity and stability"
  ],
  nursingActions: [
    "Monitor and document intraocular pressure readings accurately; report values above target or sudden elevations immediately to the healthcare provider",
    "Administer ophthalmic medications using proper technique: wash hands, tilt head back, pull lower lid to create conjunctival pocket, instill drop without touching the eye, apply nasolacrimal occlusion (pressing inner corner of eye for 1-2 minutes) to reduce systemic absorption",
    "When administering multiple eye drops, wait 5-10 minutes between different medications to allow adequate absorption and prevent washout",
    "Assess for systemic side effects of topical ophthalmic medications: beta-blockers can cause bradycardia, hypotension, and bronchospasm; report these promptly",
    "Teach patients that glaucoma is a chronic condition requiring lifelong medication adherence even when asymptomatic; missed doses allow IOP to rise and damage to progress silently",
    "Instruct patients on signs of acute angle-closure (sudden severe eye pain, headache, nausea, halos around lights, blurred vision) and the need to seek emergency care immediately",
    "Document visual acuity assessments and any changes in peripheral vision; maintain a safe environment for patients with visual field deficits (adequate lighting, clear pathways, remove tripping hazards)"
  ],
  assessmentFindings: [
    "Open-angle glaucoma: often asymptomatic until advanced; gradual painless peripheral vision loss progressing to tunnel vision; patient may not notice deficits until central vision is threatened",
    "Acute angle-closure glaucoma: sudden severe unilateral eye pain, headache (often frontal or periorbital), nausea and vomiting, seeing halos or rainbows around lights, blurred vision, red eye",
    "Pupil examination: mid-dilated non-reactive pupil (in acute angle-closure); pupil may appear oval and respond sluggishly",
    "Corneal appearance: clear in chronic open-angle; hazy/cloudy/steamy in acute angle-closure from corneal oedema",
    "Elevated intraocular pressure on tonometry; in acute angle-closure, IOP may exceed 40-60 mmHg",
    "Visual acuity may be normal in early disease; progressively reduced in advanced stages or during acute attacks"
  ],
  signs: {
    left: [
      "Gradual peripheral vision loss (patient unaware)",
      "Slightly elevated IOP on routine screening",
      "Increased cup-to-disc ratio on fundoscopy",
      "Mild visual field changes on perimetry",
      "No pain or redness in chronic open-angle type"
    ],
    right: [
      "Sudden severe eye pain with headache and nausea",
      "IOP above 40 mmHg (ophthalmic emergency)",
      "Fixed mid-dilated pupil, non-reactive to light",
      "Hazy or steamy-appearing cornea",
      "Rapid vision loss if treatment is delayed"
    ]
  },
  medications: [
    {
      name: "Latanoprost (Xalatan)",
      type: "Prostaglandin analogue (first-line therapy)",
      action: "Increases uveoscleral outflow of aqueous humour, reducing intraocular pressure by 25-35%; administered once daily in the evening for maximum efficacy",
      sideEffects: "Darkening of iris colour (permanent, especially in hazel/green eyes), increased eyelash growth and thickness, periorbital skin pigmentation, mild stinging on instillation, conjunctival hyperaemia (red eyes)",
      contra: "Active intraocular inflammation (uveitis/iritis); use with caution in patients with history of herpetic keratitis; pregnancy category C",
      pearl: "Administer in the EVENING only - morning dosing is less effective. Warn patients about permanent iris colour change (particularly important for patients with one affected eye). Remove contact lenses before instillation and wait 15 minutes before reinserting. Store unopened bottles refrigerated; opened bottles stable at room temperature for 6 weeks."
    },
    {
      name: "Timolol (Timoptic)",
      type: "Non-selective beta-adrenergic blocker (topical ophthalmic)",
      action: "Reduces aqueous humour production by the ciliary body; lowers IOP by approximately 20-25%; available as solution or gel-forming solution (once or twice daily)",
      sideEffects: "Systemic absorption causes bradycardia, hypotension, bronchospasm, fatigue, depression, masking of hypoglycaemia symptoms in diabetics; local burning and stinging",
      contra: "Asthma, COPD, severe bradycardia, second or third degree heart block, decompensated heart failure, cardiogenic shock; use caution in diabetes mellitus",
      pearl: "Apply nasolacrimal occlusion (press on inner corner of eye near nose) for 1-2 minutes after instillation to minimize systemic absorption. ALWAYS check pulse and respiratory status before administering. The gel-forming solution (Timoptic-XE) allows once-daily dosing. Never abruptly discontinue systemic beta-blockers concurrently."
    },
    {
      name: "Acetazolamide (Diamox)",
      type: "Carbonic anhydrase inhibitor (oral/IV for acute IOP reduction)",
      action: "Reduces aqueous humour production by inhibiting carbonic anhydrase in the ciliary body; used IV or orally for acute angle-closure emergency to rapidly lower IOP; reduces IOP by 40-60%",
      sideEffects: "Metabolic acidosis, paraesthesias (tingling in fingers and toes), fatigue, GI upset, kidney stones (calcium phosphate), hypokalemia, aplastic anaemia (rare but serious), altered taste (carbonated drinks taste flat)",
      contra: "Sulfonamide allergy (cross-reactivity), severe hepatic or renal disease, hypokalemia, hyponatremia, adrenocortical insufficiency, hyperchloremic acidosis",
      pearl: "Monitor electrolytes closely, especially potassium - the drug is a potent diuretic. Ensure adequate hydration to reduce kidney stone risk. Contraindicated in sulfa allergy. In acute angle-closure, IV acetazolamide 500 mg provides rapid IOP reduction within 1-2 hours. Encourage increased fluid intake. This is a systemic medication used for acute management, not for routine chronic glaucoma."
    }
  ],
  pearls: [
    "Glaucoma is called the silent thief of sight because chronic open-angle glaucoma causes painless, gradual peripheral vision loss that patients do not notice until advanced stages - emphasise the critical importance of regular eye examinations, especially for high-risk groups",
    "Acute angle-closure glaucoma is an ophthalmological EMERGENCY: sudden severe eye pain plus nausea/vomiting plus halos around lights plus hazy cornea plus mid-dilated fixed pupil = activate emergency response immediately",
    "NEVER administer mydriatic (pupil-dilating) drops such as atropine or tropicamide to patients with narrow angles or angle-closure glaucoma - dilation pushes the iris forward and can precipitate an acute attack",
    "Teach nasolacrimal occlusion technique for ALL glaucoma eye drops: press firmly on the inner corner of the eye near the nose for 1-2 minutes after instilling drops to reduce systemic absorption and increase local drug effect",
    "When administering multiple eye drops, always wait at least 5 minutes between different medications to prevent the second drop from washing out the first",
    "Topical beta-blocker eye drops (timolol) can cause significant systemic effects: always assess heart rate and respiratory status before administration; contraindicated in asthma and COPD patients",
    "Once vision is lost to glaucoma, it CANNOT be restored - all treatment is aimed at preserving remaining vision through IOP reduction; reinforce that medications must be used consistently even when the patient feels fine and sees well"
  ],
  quiz: [
    {
      question: "A patient presents to the emergency department with sudden onset severe right eye pain, nausea, vomiting, and seeing halos around lights. The right pupil is mid-dilated and non-reactive, and the cornea appears hazy. Which action should the nurse take FIRST?",
      options: [
        "Administer atropine eye drops to the right eye to dilate the pupil for examination",
        "Notify the healthcare provider immediately as this presentation suggests acute angle-closure glaucoma",
        "Apply warm compresses to the right eye and reassess in 30 minutes",
        "Obtain a visual acuity assessment before notifying the provider"
      ],
      correct: 1,
      rationale: "This presentation is classic acute angle-closure glaucoma - an ophthalmological emergency requiring immediate medical intervention to prevent permanent vision loss. IOP must be lowered emergently. Atropine is absolutely contraindicated as mydriatic drops worsen angle-closure. Warm compresses are not appropriate for this condition. While visual acuity is important, it should not delay notification of this emergency."
    },
    {
      question: "The nurse is teaching a patient newly diagnosed with open-angle glaucoma about timolol (Timoptic) eye drops. Which instruction should the nurse include?",
      options: [
        "Apply gentle pressure to the inner corner of the eye after instilling the drop for 1-2 minutes",
        "It is safe to skip doses on days when your vision seems clear",
        "Administer the drops only when you experience eye pain or pressure",
        "Discontinue the drops if you notice any mild stinging upon application"
      ],
      correct: 0,
      rationale: "Nasolacrimal occlusion (pressing on the inner corner of the eye near the nose for 1-2 minutes after instillation) reduces systemic absorption of timolol, minimising cardiovascular and respiratory side effects such as bradycardia and bronchospasm. Glaucoma medications must be used consistently as prescribed regardless of symptoms, as open-angle glaucoma is typically painless. Mild stinging is a common and expected local effect that does not warrant discontinuation."
    },
    {
      question: "A patient with chronic open-angle glaucoma is prescribed latanoprost (Xalatan) eye drops. The nurse should instruct the patient to administer this medication at which time?",
      options: [
        "First thing in the morning before breakfast",
        "At noon with the midday meal",
        "In the evening before bedtime",
        "Every 4 hours around the clock"
      ],
      correct: 2,
      rationale: "Latanoprost is administered once daily in the EVENING for maximum therapeutic efficacy. Research shows that evening administration produces greater IOP reduction compared to morning dosing. The medication works by increasing uveoscleral outflow of aqueous humour. It is dosed once daily, not multiple times per day. Timing does not relate to meals."
    }
  ]
},

"macular-degeneration-rpn": {
  title: "Macular Degeneration",
  cellular: {
    title: "Pathophysiology of Age-Related Macular Degeneration",
    content: "Age-related macular degeneration (AMD) is a progressive degenerative disease of the macula, the central portion of the retina responsible for sharp, detailed central vision. It is the leading cause of legal blindness in adults over 50 in developed countries. AMD affects central vision while peripheral vision is typically preserved, meaning patients can navigate and move around but cannot read, recognise faces, drive, or see fine detail.\n\nThe macula is only 5.5 mm in diameter but contains the highest concentration of cone photoreceptors, making it essential for colour vision, reading, facial recognition, and driving. Beneath the photoreceptors lies the retinal pigment epithelium (RPE), a single cell layer that performs critical support functions: absorbing excess light, phagocytosing shed photoreceptor outer segments, transporting nutrients from the choroidal blood supply, and recycling visual pigments.\n\nWith ageing, the RPE becomes less efficient at clearing metabolic waste products. Lipofuscin (an indigestible yellowish pigment) accumulates within RPE cells. Extracellular debris deposits called drusen form between the RPE and Bruch membrane (the basement membrane separating the RPE from the choroidal blood supply). Drusen are the hallmark of early AMD and are classified as small (less than 63 micrometres), intermediate (63-124 micrometres), or large (125 micrometres or greater). Large or numerous drusen carry higher risk of progression.\n\nAMD exists in two forms: dry (non-exudative, atrophic) and wet (exudative, neovascular). Dry AMD accounts for approximately 85-90% of cases. In dry AMD, progressive RPE dysfunction and atrophy lead to photoreceptor degeneration. Geographic atrophy is the advanced form, characterised by well-defined areas of RPE and photoreceptor loss. Vision loss in dry AMD is typically gradual over years. There is no specific treatment for advanced dry AMD, though nutritional supplements (AREDS2 formula) can slow progression in intermediate stages.\n\nWet AMD accounts for only 10-15% of cases but is responsible for approximately 90% of severe vision loss from AMD. The hallmark is choroidal neovascularisation (CNV): new, abnormal blood vessels grow from the choroidal circulation through breaks in Bruch membrane into the subretinal space. These new vessels are fragile and leaky, causing fluid accumulation (subretinal or intraretinal fluid), haemorrhage, and lipid exudation beneath and within the retina. This disrupts the precise architecture of the macula, causing rapid central vision distortion and loss.\n\nVascular endothelial growth factor (VEGF) is the primary driver of neovascularisation in wet AMD. Ischaemia and RPE dysfunction trigger VEGF production, which stimulates new blood vessel growth and increases vascular permeability. This understanding led to the development of anti-VEGF therapy, which has revolutionised wet AMD treatment. Anti-VEGF agents (ranibizumab, aflibercept, bevacizumab) are injected directly into the vitreous cavity of the eye (intravitreal injection) to block VEGF and reduce neovascularisation, fluid leakage, and haemorrhage.\n\nFor the RPN, key nursing considerations include: distinguishing dry from wet AMD presentations (gradual vs. sudden vision changes), understanding that sudden distortion or blind spots in central vision require urgent referral for possible wet AMD, supporting patient safety for those with central vision loss, proper post-procedure care after intravitreal injections, and teaching patients to use the Amsler grid for home monitoring of vision changes."
  },
  riskFactors: [
    "Age over 50 (strongest risk factor; prevalence increases from 2% at age 50-59 to over 30% at age 75+)",
    "Cigarette smoking (strongest modifiable risk factor; 2-3 times increased risk; smoking cessation reduces risk over time)",
    "Family history and genetic factors (50-70% heritability; complement factor H gene variant is the strongest genetic risk factor)",
    "Caucasian race (significantly higher prevalence than in Black, Hispanic, or Asian populations)",
    "Female sex (higher prevalence, partly due to longer life expectancy)",
    "Cardiovascular disease, hypertension, and hyperlipidaemia (share pathological mechanisms involving endothelial dysfunction and inflammation)",
    "Obesity (BMI greater than 30) and physical inactivity",
    "Prolonged, unprotected exposure to ultraviolet and blue light over a lifetime",
    "Low dietary intake of antioxidants, omega-3 fatty acids, and lutein/zeaxanthin (found in green leafy vegetables)"
  ],
  diagnostics: [
    "Visual acuity testing: best-corrected visual acuity to establish baseline and monitor progression; central scotoma or reduced acuity in the affected eye",
    "Amsler grid testing: patient fixates on central dot and reports any areas of distortion (metamorphopsia), wavy lines, or missing areas; a critical screening and home monitoring tool for detecting early wet AMD conversion",
    "Dilated fundoscopic examination: visualises drusen (yellow deposits), RPE changes and pigment clumping, geographic atrophy, subretinal fluid or haemorrhage in wet AMD",
    "Optical coherence tomography (OCT): cross-sectional imaging of the retina; detects intraretinal and subretinal fluid, drusen, RPE detachment, and geographic atrophy with high precision; essential for monitoring treatment response in wet AMD",
    "Fluorescein angiography: intravenous fluorescein dye injection with retinal photography; identifies leaking choroidal neovascularisation in wet AMD; shows classic or occult CNV patterns",
    "OCT angiography: non-invasive vascular imaging without dye injection; increasingly used to detect and monitor choroidal neovascularisation"
  ],
  management: [
    "Dry AMD (intermediate stage): AREDS2 supplement formula (vitamin C 500 mg, vitamin E 400 IU, lutein 10 mg, zeaxanthin 2 mg, zinc 80 mg, copper 2 mg) shown to reduce progression risk by approximately 25%",
    "Wet AMD first-line treatment: intravitreal anti-VEGF injections (ranibizumab, aflibercept, bevacizumab, or faricimab); initial loading phase of monthly injections for 3 months, then treat-and-extend or as-needed protocols based on OCT response",
    "Smoking cessation counselling: the single most important modifiable risk factor; provide resources and referrals for smoking cessation programs",
    "Lifestyle modification: heart-healthy diet rich in green leafy vegetables (spinach, kale - high in lutein/zeaxanthin), omega-3 fatty acids from fish, regular exercise, blood pressure and cholesterol management",
    "Low-vision rehabilitation services: magnifying devices, large-print materials, electronic assistive devices, occupational therapy for adaptive skills, community resources for the visually impaired",
    "Regular monitoring schedule: dilated eye examination and OCT every 1-3 months for wet AMD on treatment; every 6-24 months for dry AMD depending on severity and risk factors"
  ],
  nursingActions: [
    "Assess and document visual acuity at each visit using a standardised eye chart; compare to previous results and report any decline to the healthcare provider",
    "Teach patients to use the Amsler grid for daily home monitoring: hold at reading distance (30 cm), cover one eye, fixate on central dot, and note any new distortion, wavy lines, or missing areas - report changes IMMEDIATELY as they may indicate conversion to wet AMD",
    "Provide post-intravitreal injection care: instruct patient not to rub the eye, report increasing pain/redness/vision loss (signs of endophthalmitis), mild floaters and subconjunctival haemorrhage are expected and will resolve",
    "Implement safety measures for patients with central vision loss: ensure adequate lighting, remove tripping hazards, mark stair edges with contrasting tape, recommend use of magnifying devices for reading, assist with medication identification",
    "Educate on the distinction between dry and wet AMD: dry is gradual and currently has no specific treatment beyond supplements; wet causes sudden changes (distortion, blind spots) requiring urgent treatment - delays in treatment lead to irreversible vision loss",
    "Coordinate referrals to low-vision rehabilitation services, occupational therapy, community support groups, and driver assessment services as appropriate",
    "Provide emotional support and screen for depression - vision loss significantly impacts quality of life, independence, and mental health; central vision loss is particularly distressing as it affects ability to recognise faces and read"
  ],
  assessmentFindings: [
    "Gradual central vision blurring in dry AMD; difficulty reading, recognising faces, and seeing fine detail; colours may appear less vivid",
    "Sudden onset of metamorphopsia (distorted/wavy straight lines) suggests conversion to wet AMD and requires urgent referral",
    "Central scotoma (blind spot in central vision); patient may describe that the centre of vision is blank, dark, or missing",
    "Difficulty with tasks requiring central vision: reading, driving, recognising faces, threading a needle, seeing the clock",
    "Preserved peripheral vision: patients can typically navigate, walk independently, and see objects to the side even with advanced central vision loss",
    "Amsler grid changes: wavy, distorted, or missing areas; lines that should be straight appear bent or broken"
  ],
  signs: {
    left: [
      "Blurred central vision noticed while reading",
      "Difficulty seeing fine detail or small print",
      "Need for brighter light for close-up tasks",
      "Colours appear faded or less vivid",
      "Drusen visible on routine eye examination"
    ],
    right: [
      "Sudden distortion of straight lines (metamorphopsia)",
      "Dark or blank spot in the centre of vision",
      "Rapid central vision loss over days to weeks",
      "Subretinal haemorrhage visible on fundoscopy",
      "Subretinal or intraretinal fluid on OCT imaging"
    ]
  },
  medications: [
    {
      name: "Ranibizumab (Lucentis)",
      type: "Anti-VEGF monoclonal antibody fragment (intravitreal injection)",
      action: "Binds to and neutralises all isoforms of vascular endothelial growth factor A (VEGF-A), reducing choroidal neovascularisation, vascular permeability, and subretinal fluid accumulation in wet AMD; administered by intravitreal injection monthly or on a treat-and-extend protocol",
      sideEffects: "Conjunctival haemorrhage at injection site (common, self-resolving), eye pain, floaters, increased intraocular pressure transiently, vitreous detachment; rare but serious: endophthalmitis (infection inside the eye), retinal detachment, thromboembolic events (stroke, MI)",
      contra: "Active ocular or periocular infection, known hypersensitivity to ranibizumab; use with caution in patients with recent stroke or MI (theoretical risk of thromboembolic events from systemic VEGF inhibition)",
      pearl: "Injections are administered by an ophthalmologist in a sterile setting. Post-injection monitoring for endophthalmitis is critical: teach patients that increasing pain, worsening redness, and decreasing vision in the days following injection are RED FLAGS requiring immediate evaluation. Some floaters and mild redness at the injection site are normal."
    },
    {
      name: "AREDS2 Supplement Formula",
      type: "Nutritional supplement (oral, over-the-counter)",
      action: "Combination of antioxidants and zinc shown to slow progression from intermediate to advanced dry AMD by approximately 25% over 5 years; formula contains vitamin C 500 mg, vitamin E 400 IU, lutein 10 mg, zeaxanthin 2 mg, zinc 80 mg, copper 2 mg",
      sideEffects: "GI upset (nausea, stomach discomfort), zinc may cause copper deficiency (copper is included in formula to prevent this), high-dose vitamin E has controversial cardiovascular effects, yellow skin discoloration from lutein/zeaxanthin (harmless)",
      contra: "Current smokers should NOT take formulas containing beta-carotene (the original AREDS formula) due to increased lung cancer risk; AREDS2 replaced beta-carotene with lutein/zeaxanthin and is safe for smokers and former smokers",
      pearl: "Only indicated for intermediate or advanced AMD in one eye - NOT for early AMD or prevention. The original AREDS formula contained beta-carotene which increased lung cancer risk in smokers; AREDS2 is the current standard and is safe. Emphasise that this supplement slows progression but does NOT cure AMD or restore lost vision."
    },
    {
      name: "Aflibercept (Eylea)",
      type: "Anti-VEGF fusion protein (intravitreal injection)",
      action: "Acts as a VEGF trap, binding VEGF-A, VEGF-B, and placental growth factor with higher affinity than ranibizumab; reduces neovascularisation and fluid leakage in wet AMD; can be dosed every 8 weeks after initial monthly loading doses (less frequent than ranibizumab)",
      sideEffects: "Conjunctival haemorrhage, eye pain, vitreous floaters, increased IOP, cataract development; serious risks include endophthalmitis, retinal detachment, and rare thromboembolic events",
      contra: "Active ocular or periocular infection, hypersensitivity to aflibercept; caution in patients with recent cardiovascular or cerebrovascular events",
      pearl: "The extended dosing interval (every 8 weeks after loading phase compared to monthly for ranibizumab) reduces treatment burden for patients who require lifelong injections. Newer formulation (Eylea HD, 8 mg) allows even longer intervals of 12-16 weeks in some patients. Patient compliance with follow-up appointments is essential - missed injections allow fluid to reaccumulate and vision to decline."
    }
  ],
  pearls: [
    "Teach patients with AMD to use the Amsler grid DAILY to monitor for sudden changes that could indicate conversion from dry to wet AMD - any new distortion, wavy lines, or missing areas require URGENT same-day evaluation by an ophthalmologist",
    "Wet AMD is a time-sensitive condition: delays in initiating anti-VEGF treatment lead to worse visual outcomes; early detection and prompt treatment can preserve and sometimes improve vision",
    "Smoking is the strongest modifiable risk factor for AMD - counsel every patient with AMD or at risk to quit smoking and provide cessation resources",
    "AREDS2 supplements are only indicated for intermediate AMD or advanced AMD in one eye - they do NOT prevent AMD, do NOT treat wet AMD, and do NOT restore lost vision; ensure patients understand realistic expectations",
    "Central vision loss significantly impacts quality of life and independence; assess patients for depression and refer to low-vision rehabilitation services early rather than waiting for advanced disease",
    "Peripheral vision is preserved in AMD, which distinguishes it from glaucoma (where peripheral vision is lost first); patients with AMD can typically walk and navigate independently but cannot read, drive, or recognise faces",
    "After intravitreal injections, patients should report INCREASING pain, WORSENING redness, and DECREASING vision immediately as these may indicate endophthalmitis - a sight-threatening emergency"
  ],
  quiz: [
    {
      question: "A patient with dry age-related macular degeneration reports that straight lines on the Amsler grid now appear wavy and distorted in one eye. Which action should the nurse take?",
      options: [
        "Document the finding and schedule a routine follow-up appointment in 3 months",
        "Instruct the patient to increase their AREDS2 supplement dose",
        "Advise the patient to seek urgent same-day ophthalmological evaluation",
        "Reassure the patient that mild changes in the Amsler grid are expected with dry AMD"
      ],
      correct: 2,
      rationale: "New metamorphopsia (distortion of straight lines) on Amsler grid testing is a warning sign of possible conversion from dry to wet AMD, which involves development of leaking abnormal blood vessels under the retina. This requires urgent evaluation and possible initiation of anti-VEGF treatment. Delays in treatment lead to worse visual outcomes. This is NOT a routine finding and should not be dismissed or scheduled for later follow-up."
    },
    {
      question: "A patient asks why they still need to come for eye injections every few weeks when their vision seems stable. Which response by the nurse is most appropriate?",
      options: [
        "You can stop the injections once your vision has been stable for a few months",
        "The injections control the abnormal blood vessel growth and leakage; stopping them allows the disease to reactivate and cause further vision loss",
        "The injections are only needed during the first year; after that, the condition resolves on its own",
        "You only need injections when your vision worsens; you can skip appointments when you see well"
      ],
      correct: 1,
      rationale: "Anti-VEGF therapy suppresses but does not cure choroidal neovascularisation. When treatment is stopped or delayed, VEGF levels rise, abnormal vessels reactivate, fluid re-accumulates, and vision can worsen - sometimes permanently. Stable vision while on treatment is a sign that therapy is working, not that it is no longer needed. Treatment duration is typically long-term, often indefinite, with monitoring to determine if intervals can be safely extended."
    },
    {
      question: "The nurse is providing education to a patient newly diagnosed with intermediate dry AMD. Which statement by the patient indicates correct understanding?",
      options: [
        "I should start the AREDS2 supplements to help slow the progression of my condition",
        "Since I have the dry type, I do not need to worry about any sudden vision changes",
        "The supplements will reverse the damage that has already occurred in my retina",
        "I only need to check my Amsler grid once a month to monitor for changes"
      ],
      correct: 0,
      rationale: "AREDS2 supplements are specifically indicated for intermediate dry AMD and have been shown to reduce progression risk by approximately 25%. They slow progression but do not reverse existing damage. Patients with dry AMD must monitor for sudden changes (distortion, blind spots) as approximately 10-15% of dry AMD cases convert to wet AMD, which requires urgent treatment. Daily Amsler grid monitoring is recommended, not monthly."
    }
  ]
},

"cellulitis-standalone-rpn": {
  title: "Cellulitis",
  cellular: {
    title: "Pathophysiology of Cellulitis",
    content: "Cellulitis is an acute, spreading bacterial infection of the deeper layers of the skin, specifically the dermis and subcutaneous tissue. It is one of the most common skin infections encountered in clinical practice and a frequent reason for hospital admission. Unlike superficial skin infections such as impetigo, cellulitis involves deeper tissue planes and can progress to life-threatening complications if not treated promptly.\n\nThe infection typically begins when bacteria enter through a break in the skin barrier. Common entry points include cuts, abrasions, surgical wounds, insect bites, dermatitis, tinea pedis (athlete's foot between the toes), venous stasis ulcers, and intravenous catheter insertion sites. Even microscopic breaks in the skin that are not visible to the naked eye can serve as portals of entry. The most common causative organisms are Group A Streptococcus (Streptococcus pyogenes) and Staphylococcus aureus, including methicillin-resistant S. aureus (MRSA) in healthcare and community settings.\n\nOnce bacteria penetrate the skin, they multiply in the dermis and subcutaneous tissue. Bacterial virulence factors (enzymes such as hyaluronidase, streptokinase, and DNase) break down connective tissue components, facilitating rapid lateral spread through tissue planes. This explains the characteristic diffuse, spreading erythema without sharp borders that distinguishes cellulitis from an abscess (which is a walled-off collection of pus).\n\nThe host inflammatory response produces the cardinal signs: erythema (redness from vasodilation and increased blood flow), warmth (from increased metabolic activity and blood flow), oedema (from increased capillary permeability causing fluid extravasation into tissues), and pain/tenderness (from inflammatory mediator stimulation of nociceptors and tissue swelling compressing nerve endings). Lymphatic involvement is common, with bacteria and inflammatory cells tracking along lymphatic channels, producing lymphangitis (visible red streaks extending proximally from the infection site toward regional lymph nodes) and lymphadenopathy (swollen, tender regional lymph nodes).\n\nThe lower extremities account for approximately 70-80% of cellulitis cases, with the legs and feet being the most common sites. Conditions that impair venous or lymphatic drainage (chronic venous insufficiency, lymphoedema, prior saphenous vein harvesting for coronary artery bypass) increase risk by creating tissue oedema that provides a favourable environment for bacterial growth and impairs local immune defences.\n\nComplications of untreated or inadequately treated cellulitis include abscess formation (localised pus collection requiring incision and drainage), necrotising fasciitis (a surgical emergency involving rapid destruction of fascia and subcutaneous tissue), bacteraemia (bacteria entering the bloodstream), sepsis, and osteomyelitis (bone infection from contiguous spread). Recurrent cellulitis is common, affecting up to 50% of patients within 3 years, particularly in those with persistent risk factors such as lymphoedema, obesity, or chronic skin conditions.\n\nFor the RPN, critical skills include recognising the clinical presentation of cellulitis, differentiating it from deep vein thrombosis (which can have similar appearance), monitoring for signs of worsening infection or systemic illness, administering antibiotics as prescribed, performing wound care, marking the borders of erythema to track progression or resolution, and teaching patients about prevention strategies for recurrence."
  },
  riskFactors: [
    "Skin barrier disruption: cuts, abrasions, surgical wounds, insect bites, dermatitis, pressure ulcers, venous stasis ulcers, tinea pedis (athlete's foot is a very common entry point for lower leg cellulitis)",
    "Lymphoedema (impaired lymphatic drainage creates protein-rich oedema that is a perfect growth medium for bacteria; strongest risk factor for recurrent cellulitis)",
    "Chronic venous insufficiency and peripheral vascular disease (poor venous return causes tissue oedema and reduced local immune function)",
    "Obesity (BMI greater than 30; skin folds create warm, moist environments; venous stasis; mechanical skin breakdown from friction)",
    "Diabetes mellitus (impaired immune function, peripheral neuropathy leads to unnoticed injuries, poor wound healing, increased Staphylococcal colonisation)",
    "Immunocompromised state: HIV/AIDS, organ transplant recipients on immunosuppressive therapy, chemotherapy, chronic corticosteroid use",
    "Previous episode of cellulitis (recurrence rate up to 50% within 3 years if underlying risk factors are not addressed)",
    "Peripheral neuropathy (any cause): inability to sense minor injuries that become portals of bacterial entry",
    "Intravenous drug use (injection sites provide direct entry for skin flora into subcutaneous tissue)"
  ],
  diagnostics: [
    "Clinical diagnosis: cellulitis is primarily diagnosed clinically based on the presence of expanding erythema, warmth, oedema, and tenderness; laboratory tests support but are not required for diagnosis in typical presentations",
    "CBC with differential: may show leukocytosis with neutrophilia (left shift) indicating acute bacterial infection; normal white cell count does not exclude cellulitis",
    "Blood cultures: obtained in patients with systemic signs (fever, tachycardia, hypotension), immunocompromised patients, or those who fail initial antibiotic therapy; positive in only 2-5% of uncomplicated cellulitis cases",
    "C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR): elevated in infection; useful for monitoring treatment response (should trend downward with effective therapy)",
    "Wound culture (if abscess is present and drained, or open wound): identifies specific organism and antibiotic sensitivities; swabs of intact cellulitic skin are NOT useful",
    "Duplex ultrasonography: ordered when deep vein thrombosis (DVT) is in the differential diagnosis, as unilateral lower extremity redness, warmth, and swelling can mimic cellulitis; also useful to detect underlying abscess requiring drainage",
    "Blood glucose and HbA1c: assess for underlying or undiagnosed diabetes in patients with cellulitis, especially lower extremity infections"
  ],
  management: [
    "Empiric antibiotic therapy: mild-moderate non-purulent cellulitis (most likely streptococcal) is treated with cephalexin or amoxicillin-clavulanate for 5-10 days; if MRSA is suspected (purulent cellulitis, known MRSA colonisation), add trimethoprim-sulfamethoxazole or doxycycline",
    "Severe cellulitis or systemic signs (high fever, rapid progression, hemodynamic instability) requires IV antibiotics: cefazolin, clindamycin, or vancomycin (if MRSA suspected); step down to oral therapy when clinically improving and afebrile for 48 hours",
    "Incision and drainage: required if an abscess has formed (fluctuant area within the cellulitis); antibiotics alone will not resolve an abscess",
    "Elevation of the affected extremity above heart level: reduces oedema, improves venous and lymphatic drainage, and accelerates resolution; critical adjunct to antibiotic therapy for lower extremity cellulitis",
    "Pain management with analgesics (acetaminophen, NSAIDs if not contraindicated) and cool compresses for comfort",
    "Address underlying risk factors: treat tinea pedis, manage lymphoedema with compression therapy, optimise glycaemic control in diabetes, skin care and moisturisation to prevent dryness and cracking",
    "For recurrent cellulitis (2 or more episodes per year): prophylactic antibiotics may be considered (penicillin V or erythromycin daily) along with aggressive management of predisposing conditions"
  ],
  nursingActions: [
    "Mark the borders of erythema with a skin marker and document the date and time; reassess at regular intervals (every 8-12 hours) to objectively track whether the infection is spreading or resolving - this is the single most important monitoring tool",
    "Assess and document the affected area: extent of erythema, warmth, oedema, tenderness on a 0-10 scale, presence of lymphangitis (red streaks), lymphadenopathy, and any drainage or crepitus",
    "Monitor vital signs for systemic signs of infection: temperature, heart rate, blood pressure, respiratory rate; fever, tachycardia, or hypotension may indicate bacteraemia or sepsis progression",
    "Administer antibiotics as prescribed on schedule; ensure first dose is given promptly (within 1 hour if IV antibiotics ordered); monitor for allergic reactions and adverse effects",
    "Elevate the affected extremity above heart level using pillows; encourage the patient to maintain elevation as much as possible to reduce oedema and promote drainage",
    "Perform wound care as ordered: cleanse any open areas gently, apply appropriate dressings, maintain sterile technique for IV catheter sites; assess skin integrity at each shift",
    "Teach patients about completing the full antibiotic course even when symptoms improve, signs of worsening to report (increased redness beyond marked borders, increasing pain, fever, red streaks), and prevention strategies for recurrence (daily foot inspection, moisturising dry skin, treating fungal infections promptly, wearing protective footwear)"
  ],
  assessmentFindings: [
    "Area of spreading erythema with poorly defined borders (distinguishes cellulitis from erysipelas, which has sharply demarcated, raised borders)",
    "Warmth of the affected area compared to surrounding uninvolved skin",
    "Non-pitting oedema and induration (firmness) of the affected tissue",
    "Pain and tenderness, often described as aching, throbbing, or burning; may be out of proportion in necrotising fasciitis",
    "Lymphangitis: visible red streaks tracking proximally from the infection site along lymphatic channels toward regional lymph nodes",
    "Regional lymphadenopathy: palpable, tender lymph nodes draining the affected area (inguinal nodes for lower extremity cellulitis)",
    "Systemic signs in moderate-severe cases: fever, chills, rigors, tachycardia, malaise, and fatigue"
  ],
  signs: {
    left: [
      "Localised erythema with warmth and tenderness",
      "Mild oedema of the affected area",
      "Intact skin over the infected area",
      "Low-grade fever (below 38.5 C)",
      "Slow progression over 1-2 days"
    ],
    right: [
      "Rapidly spreading erythema beyond marked borders",
      "High fever with rigors and tachycardia",
      "Crepitus (gas in tissues suggesting necrotising infection)",
      "Pain out of proportion to visible findings",
      "Bullae (large blisters), skin necrosis, or purplish discolouration"
    ]
  },
  medications: [
    {
      name: "Cephalexin (Keflex)",
      type: "First-generation cephalosporin antibiotic (oral)",
      action: "Bactericidal; inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins; effective against Streptococcus and methicillin-sensitive Staphylococcus aureus (MSSA); first-line oral therapy for mild-moderate non-purulent cellulitis; dosed 500 mg four times daily for 5-10 days",
      sideEffects: "GI disturbance (nausea, diarrhoea, abdominal pain), allergic reactions (rash, urticaria), vaginal candidiasis, pseudomembranous colitis (C. difficile) with prolonged use",
      contra: "Known allergy to cephalosporins; use with caution in penicillin-allergic patients (approximately 1-2% cross-reactivity with first-generation cephalosporins); dose adjustment required in renal impairment",
      pearl: "Not effective against MRSA. If cellulitis is purulent (draining pus, abscess), suspect MRSA and add trimethoprim-sulfamethoxazole or doxycycline. Administer with food to reduce GI upset. Remind patients to complete the full course even if the skin looks better after a few days. Assess for penicillin allergy before administering - clarify the nature of the reaction (rash vs. anaphylaxis)."
    },
    {
      name: "Trimethoprim-Sulfamethoxazole (Bactrim, Septra)",
      type: "Sulfonamide antibiotic combination (oral)",
      action: "Bactericidal; inhibits sequential steps in bacterial folic acid synthesis (sulfamethoxazole inhibits dihydropteroate synthetase, trimethoprim inhibits dihydrofolate reductase); effective against MRSA, making it the first-line oral option for purulent cellulitis or suspected MRSA; dosed as double-strength (DS) tablet twice daily for 5-10 days",
      sideEffects: "GI disturbance (nausea, vomiting, anorexia), photosensitivity (warn patients about sun protection), rash (can progress to Stevens-Johnson syndrome - discontinue immediately for severe rash), hyperkalemia, bone marrow suppression with prolonged use, crystalluria",
      contra: "Sulfonamide allergy, severe renal or hepatic impairment, pregnancy at term (causes neonatal kernicterus), G6PD deficiency (risk of haemolytic anaemia), megaloblastic anaemia due to folate deficiency; caution with concurrent ACE inhibitors or potassium-sparing diuretics (hyperkalemia risk)",
      pearl: "Excellent MRSA coverage but NOT effective as monotherapy against Group A Strep (the most common cause of non-purulent cellulitis). For purulent cellulitis, may be used alone or combined with cephalexin. Ensure adequate fluid intake to prevent crystalluria and renal stone formation. Monitor potassium in patients on ACE inhibitors. Photosensitivity is significant - counsel patients about sun avoidance and sunscreen use."
    },
    {
      name: "Cefazolin (Ancef)",
      type: "First-generation cephalosporin antibiotic (IV)",
      action: "Bactericidal; inhibits bacterial cell wall synthesis; effective against Streptococcus and MSSA; first-line IV therapy for moderate-severe cellulitis requiring hospitalisation; dosed 1-2 g IV every 8 hours; can be transitioned to oral cephalexin for step-down therapy",
      sideEffects: "Injection site reactions (pain, phlebitis at IV site), allergic reactions, GI disturbance (diarrhoea, nausea), elevated liver enzymes (transient), pseudomembranous colitis, eosinophilia",
      contra: "Known anaphylaxis to cephalosporins; use with caution in penicillin allergy (low cross-reactivity but assess severity of prior reaction); dose adjustment required in renal impairment",
      pearl: "Commonly used as the initial IV antibiotic for hospitalised patients with non-purulent cellulitis. Step-down to oral cephalexin when patient is clinically improving AND afebrile for 24-48 hours AND erythema is no longer advancing. Not effective against MRSA - if purulent or MRSA is suspected, use vancomycin IV instead. Monitor IV site for phlebitis and rotate as per institutional policy."
    }
  ],
  pearls: [
    "ALWAYS mark the borders of erythema with a skin marker and record the date and time at the initial assessment - this is the most reliable way to objectively determine if the infection is progressing (erythema extending beyond marks) or resolving (erythema receding within marks)",
    "Cellulitis can mimic deep vein thrombosis (DVT): both present with unilateral lower extremity redness, warmth, and swelling; if DVT cannot be excluded clinically, duplex ultrasonography is needed before attributing symptoms to cellulitis alone",
    "Differentiate cellulitis from necrotising fasciitis: pain out of proportion to visible findings, rapidly spreading erythema, crepitus (crackling under the skin from gas production), skin necrosis, bullae, and systemic toxicity are RED FLAGS for necrotising fasciitis - a surgical emergency requiring immediate debridement",
    "Tinea pedis (athlete's foot) is the most common portal of entry for lower extremity cellulitis - treating the fungal infection with antifungal cream and teaching patients to dry between their toes thoroughly after bathing can significantly reduce cellulitis recurrence",
    "Elevation of the affected limb above heart level is not optional; it is a critical component of treatment that reduces oedema, improves lymphatic drainage, and accelerates healing",
    "Antibiotic treatment failure should be suspected if erythema continues to spread beyond marked borders after 48-72 hours of appropriate antibiotics, fever persists, or the patient develops systemic signs; re-evaluation for abscess, resistant organism, or alternative diagnosis is needed",
    "Recurrent cellulitis affects up to 50% of patients - prevention requires treating underlying conditions (lymphoedema, venous insufficiency, fungal infections, obesity) and sometimes long-term prophylactic antibiotics"
  ],
  quiz: [
    {
      question: "A patient is admitted with cellulitis of the left lower leg. The nurse marks the borders of erythema at 0800. At 1600, the redness has extended 3 cm beyond the marked borders despite receiving cephalexin. Which action should the nurse take?",
      options: [
        "Continue current therapy and reassess at 0800 the following day",
        "Apply warm compresses and elevate the leg to promote resolution",
        "Notify the healthcare provider of the expanding erythema despite antibiotic therapy",
        "Administer an additional dose of cephalexin to increase the antibiotic effect"
      ],
      correct: 2,
      rationale: "Expanding erythema beyond marked borders despite 8 hours of antibiotic therapy is a concerning sign that requires notification of the healthcare provider. While it can take 48-72 hours for antibiotics to show full effect, significant progression warrants reassessment of the treatment plan. The provider may need to consider changing antibiotics (possible MRSA or resistant organism), obtaining cultures, imaging for possible abscess, or evaluating for necrotising fasciitis."
    },
    {
      question: "Which assessment finding in a patient with lower extremity cellulitis should the nurse report as a potential sign of necrotising fasciitis?",
      options: [
        "Mild tenderness at the site of erythema that improves with elevation",
        "Pain that is disproportionately severe compared to the visible skin changes",
        "Low-grade fever of 37.8 C with mild regional lymphadenopathy",
        "Gradual improvement of erythema after 48 hours of antibiotic therapy"
      ],
      correct: 1,
      rationale: "Pain out of proportion to visible findings is a classic warning sign of necrotising fasciitis, a rapidly progressive, life-threatening infection involving fascia and subcutaneous tissue destruction. Other red flags include crepitus, skin necrosis, bullae, systemic toxicity, and rapid progression. Necrotising fasciitis is a surgical emergency requiring immediate debridement. Mild tenderness with improvement is expected in uncomplicated cellulitis."
    },
    {
      question: "The nurse is providing discharge teaching to a patient with a history of recurrent cellulitis of the lower legs. Which instruction is MOST important for preventing future episodes?",
      options: [
        "Avoid all physical activity to prevent skin injuries to the legs",
        "Inspect feet daily, treat any fungal infections promptly, and moisturise dry or cracked skin",
        "Take prophylactic antibiotics only during winter months when skin is driest",
        "Apply antibiotic ointment to the entire lower legs daily as a preventive measure"
      ],
      correct: 1,
      rationale: "Tinea pedis (athlete's foot) and dry, cracked skin are the most common portals of entry for bacteria causing lower leg cellulitis. Daily foot inspection, prompt treatment of fungal infections, and moisturising dry skin to maintain skin barrier integrity are the most effective prevention strategies. Avoiding all activity is neither practical nor necessary. Prophylactic antibiotics, if indicated, would be prescribed year-round, not seasonally. Applying antibiotic ointment to large areas promotes resistance."
    }
  ]
},

"shingles-herpes-zoster-rpn": {
  title: "Shingles (Herpes Zoster)",
  cellular: {
    title: "Pathophysiology of Herpes Zoster (Shingles)",
    content: "Herpes zoster (shingles) is caused by reactivation of the varicella-zoster virus (VZV), the same virus that causes chickenpox (varicella) during primary infection. After the initial chickenpox infection, which typically occurs in childhood, VZV does not leave the body. Instead, it establishes lifelong latency in the dorsal root ganglia of sensory nerves and cranial nerve ganglia. The virus remains dormant, kept in check by the host's cell-mediated immune system, specifically T-lymphocytes.\n\nReactivation occurs when cell-mediated immunity declines. This happens naturally with ageing (the most common trigger), or due to immunosuppression from conditions such as HIV/AIDS, organ transplantation, chemotherapy, chronic corticosteroid use, or significant physiological stress. When immune surveillance weakens, the latent virus reactivates, replicates within the ganglion, and travels anterograde along the sensory nerve fibre to the skin region (dermatome) supplied by that nerve.\n\nThe hallmark of herpes zoster is that the rash follows a dermatomal distribution - it affects a band-like area on one side of the body corresponding to a single sensory nerve root. The rash does NOT cross the midline (though in immunocompromised patients, disseminated herpes zoster can involve multiple dermatomes or become widespread). The thoracic dermatomes (T3-L2) are most commonly affected, followed by the cervical and trigeminal distributions.\n\nThe clinical course typically begins with a prodromal phase lasting 1-5 days before the rash appears. During this prodrome, patients experience pain, burning, tingling, or itching in the affected dermatome. The pain can be quite severe and may be mistaken for cardiac, pleural, or abdominal conditions depending on location. The rash then erupts as clusters of erythematous papules that rapidly progress to vesicles (small fluid-filled blisters) on an erythematous base, classically described as dewdrops on a rose petal. Over 7-10 days, vesicles become pustular, then crust over. Complete healing takes 2-4 weeks.\n\nPost-herpetic neuralgia (PHN) is the most common and debilitating complication, affecting 10-18% of all shingles patients and up to 30-50% of those over 60 years old. PHN is defined as pain persisting in the affected dermatome for more than 90 days after rash onset. The pain results from nerve fibre damage caused by the viral inflammation and can be burning, stabbing, electric-shock-like, or constant aching. PHN can persist for months to years and significantly impairs quality of life, sleep, and daily function.\n\nHerpes zoster ophthalmicus (HZO) occurs when the ophthalmic division of the trigeminal nerve (V1) is affected. This is a sight-threatening emergency. Involvement of the nasociliary branch (indicated by vesicles on the tip of the nose - Hutchinson sign) is strongly associated with corneal and intraocular complications including keratitis, uveitis, and vision loss. Urgent ophthalmological referral is required.\n\nShingles is contagious to individuals who have never had chickenpox and are not vaccinated against it. Direct contact with the fluid inside the vesicles can transmit VZV, causing chickenpox (not shingles) in the susceptible person. The rash is no longer contagious once all lesions have crusted over. Patients with shingles should avoid contact with pregnant women who are not immune to VZV (risk of congenital varicella syndrome), newborns, and immunocompromised individuals until all lesions are crusted.\n\nFor the RPN, key responsibilities include recognising the dermatomal rash pattern, understanding pain management (which is often complex), administering antiviral therapy within the critical 72-hour window of rash onset, implementing appropriate infection control measures, teaching patients about the contagious period, and monitoring for complications including PHN and herpes zoster ophthalmicus."
  },
  riskFactors: [
    "Age over 50 years (strongest risk factor; incidence and severity increase with age; approximately 1 in 3 people will develop shingles in their lifetime)",
    "History of chickenpox (VZV must be latent in the body for reactivation; virtually all adults born before widespread varicella vaccination carry latent VZV)",
    "Immunosuppression: HIV/AIDS (15-25 times increased risk), organ transplant recipients, chemotherapy, radiation therapy, chronic high-dose corticosteroids",
    "Haematological malignancies (lymphoma, leukaemia) due to impaired cell-mediated immunity",
    "Physical or emotional stress, which can transiently suppress immune function",
    "Autoimmune diseases (systemic lupus erythematosus, rheumatoid arthritis) and their immunosuppressive treatments",
    "Never having received the herpes zoster vaccine (Shingrix, the recombinant vaccine, is recommended for adults 50 and older)",
    "Female sex (slightly higher incidence in women compared to men)",
    "Recent major surgery, trauma, or concurrent illness"
  ],
  diagnostics: [
    "Clinical diagnosis: herpes zoster is primarily diagnosed clinically based on the characteristic unilateral dermatomal vesicular rash with associated pain; laboratory confirmation is usually unnecessary in typical presentations",
    "Tzanck smear: scraping of vesicle base stained and examined microscopically reveals multinucleated giant cells; confirms herpesvirus infection but does not differentiate VZV from herpes simplex virus; rapid and inexpensive but less sensitive than PCR",
    "PCR (polymerase chain reaction) of vesicular fluid: the most sensitive and specific diagnostic test; detects VZV DNA; useful for atypical presentations, zoster sine herpete (pain without rash), and immunocompromised patients",
    "Direct fluorescent antibody (DFA) testing of vesicular fluid: detects VZV-specific antigens; less sensitive than PCR but can differentiate VZV from HSV",
    "Viral culture: can isolate VZV from vesicular fluid but has low sensitivity (30-70%) and takes 7-14 days to produce results; not commonly used for routine diagnosis",
    "VZV IgG and IgM serology: can support diagnosis but not used for acute management; IgG indicates prior exposure; rising IgG titres on paired samples may support recent reactivation"
  ],
  management: [
    "Antiviral therapy: valacyclovir 1000 mg three times daily for 7 days OR acyclovir 800 mg five times daily for 7 days; MUST be initiated within 72 hours of rash onset for maximum benefit (reduces duration, severity, and risk of PHN); still consider treatment beyond 72 hours if new lesions are still forming or in immunocompromised patients",
    "Pain management during acute phase: acetaminophen, NSAIDs for mild-moderate pain; gabapentin or pregabalin for neuropathic pain; short-course opioids for severe acute pain; topical lidocaine patches (5%) for localised pain relief",
    "Post-herpetic neuralgia treatment: first-line agents are gabapentin, pregabalin, or tricyclic antidepressants (amitriptyline, nortriptyline); topical capsaicin cream (0.075%) or lidocaine patches as adjuncts; opioids reserved for refractory cases",
    "Calamine lotion or cool compresses applied to the rash for comfort; keep rash clean and dry; avoid topical antibiotics unless secondary bacterial infection develops",
    "Herpes zoster ophthalmicus: URGENT ophthalmology referral; systemic antivirals AND topical ophthalmic antivirals; monitor for keratitis, uveitis, and glaucoma",
    "Prevention: Shingrix vaccine (recombinant, adjuvanted) recommended for all adults 50 and older and for immunocompromised adults 19 and older; 2-dose series given 2-6 months apart; greater than 90% effective at preventing shingles and PHN"
  ],
  nursingActions: [
    "Assess and document the rash: location (which dermatome), unilateral distribution, stage of lesions (papules, vesicles, pustules, crusted), extent of involvement; note whether lesions cross the midline (concerning for disseminated zoster in immunocompromised patients)",
    "Assess pain using validated pain scales: document quality (burning, stabbing, tingling, electric-shock), location, severity, aggravating and relieving factors; pain may be severe and require multimodal management",
    "Administer antiviral medication as prescribed within the 72-hour window from rash onset; emphasise the importance of completing the full course and adhering to the dosing schedule",
    "Implement contact precautions: keep the rash covered with non-adherent dressings; standard precautions plus contact precautions for hospitalised patients; add airborne precautions for disseminated or immunocompromised patients",
    "Educate the patient about transmission: the fluid inside the blisters is contagious to people who have never had chickenpox; avoid direct contact with pregnant women who are not immune, newborns, and immunocompromised individuals until ALL lesions have crusted over",
    "Check for Hutchinson sign (vesicles on the tip or side of the nose): indicates nasociliary branch involvement and high risk for herpes zoster ophthalmicus; report immediately for urgent ophthalmology referral",
    "Provide wound care: keep rash clean and dry, avoid occlusive dressings, use non-adherent dressings to protect clothing and prevent contact transmission; teach patients to avoid scratching (risk of secondary bacterial infection and scarring)"
  ],
  assessmentFindings: [
    "Prodromal pain: burning, tingling, stabbing, or itching in a dermatomal distribution 1-5 days BEFORE the rash appears; may be mistaken for other conditions (e.g., cardiac pain if thoracic, renal colic if lumbar)",
    "Unilateral vesicular rash in a dermatomal pattern: clusters of fluid-filled vesicles on an erythematous base following a single dermatome, typically described as a band or belt-like distribution",
    "Rash does NOT cross the midline (unless disseminated in immunocompromised patients)",
    "Lesions progress from papules to vesicles to pustules to crusted lesions over 7-10 days; all stages may be present simultaneously",
    "Severe pain often described as burning, stabbing, or electric-shock-like; allodynia (pain from normally non-painful stimuli such as clothing touching the skin) is common",
    "Regional lymphadenopathy (tender, enlarged lymph nodes in the area draining the affected dermatome)",
    "Systemic symptoms: low-grade fever, malaise, headache, fatigue; rarely, severe systemic illness in immunocompromised patients"
  ],
  signs: {
    left: [
      "Tingling or burning in a dermatomal area before rash",
      "Clusters of vesicles on erythematous base",
      "Unilateral band-like rash that stops at midline",
      "Moderate pain at the site of the rash",
      "Low-grade fever and general malaise"
    ],
    right: [
      "Vesicles on the tip of the nose (Hutchinson sign - eye emergency)",
      "Disseminated rash crossing the midline (immunocompromised)",
      "Severe pain persisting beyond 90 days (post-herpetic neuralgia)",
      "Motor weakness in the affected dermatome",
      "Ramsay Hunt syndrome (facial paralysis, ear vesicles, hearing loss)"
    ]
  },
  medications: [
    {
      name: "Valacyclovir (Valtrex)",
      type: "Antiviral (prodrug of acyclovir; oral)",
      action: "Converted to acyclovir in the body, which inhibits viral DNA polymerase after being phosphorylated by viral thymidine kinase; stops VZV replication; preferred over acyclovir due to better oral bioavailability and less frequent dosing; 1000 mg three times daily for 7 days",
      sideEffects: "Nausea, headache, dizziness, abdominal pain; renal toxicity with inadequate hydration (acyclovir can crystallise in renal tubules); thrombotic thrombocytopenic purpura/haemolytic uremic syndrome (rare, mainly in immunocompromised patients at high doses)",
      contra: "Known hypersensitivity; dose adjustment required in renal impairment (creatinine clearance-based dosing); ensure adequate hydration to prevent renal crystal nephropathy",
      pearl: "MUST be initiated within 72 hours of rash onset for maximum benefit in reducing duration, severity, and PHN risk. Still consider treatment beyond 72 hours if new vesicles are forming, in patients over 50, or in immunocompromised patients. Three times daily dosing is much better tolerated than acyclovir's five times daily schedule, improving adherence. Ensure patients drink adequate water (at least 1-2 litres daily) to prevent renal complications."
    },
    {
      name: "Gabapentin (Neurontin)",
      type: "Anticonvulsant / neuropathic pain agent (oral)",
      action: "Binds to alpha-2-delta subunit of voltage-gated calcium channels in the central nervous system, modulating neurotransmitter release and reducing neuronal excitability; effective for neuropathic pain including acute herpes zoster pain and post-herpetic neuralgia; titrated gradually from 300 mg on day 1, to 300 mg twice daily on day 2, to 300 mg three times daily on day 3, then increased as needed up to 1800-3600 mg daily in divided doses",
      sideEffects: "Drowsiness, dizziness, fatigue, peripheral oedema, weight gain, ataxia (especially in elderly - fall risk); cognitive effects (difficulty concentrating, confusion); gradual dose titration minimises these effects",
      contra: "Known hypersensitivity; dose adjustment required in renal impairment; do NOT discontinue abruptly (risk of withdrawal seizures - must taper over at least 1 week)",
      pearl: "Titrate SLOWLY, especially in elderly patients - start low and go slow to minimise dizziness and sedation, which significantly increase fall risk. Administer the largest dose at bedtime to use sedation therapeutically for sleep improvement. Takes 1-2 weeks to reach full therapeutic effect. Monitor for suicidal ideation (boxed warning for all anticonvulsants). Do NOT stop abruptly - taper gradually."
    },
    {
      name: "Lidocaine Patch 5% (Lidoderm)",
      type: "Topical local anaesthetic (transdermal patch)",
      action: "Provides localised analgesic effect by blocking sodium channels in peripheral nerve fibres, reducing abnormal pain signalling from damaged nerves; applied directly over the painful area (up to 3 patches for 12 hours on, 12 hours off); used for localised neuropathic pain in PHN and acute herpes zoster (applied to intact skin only, never on active vesicles)",
      sideEffects: "Local skin reactions at application site (erythema, oedema, mild burning); systemic lidocaine toxicity is extremely rare with topical use but monitor in patients using multiple patches or those with hepatic impairment",
      contra: "Known allergy to amide-type local anaesthetics; do NOT apply to open wounds, broken skin, or active vesicular lesions; use caution in severe hepatic disease (lidocaine is hepatically metabolised)",
      pearl: "Apply ONLY to intact or healed skin, NEVER over active vesicles or open lesions. Can be cut to fit the painful area. The 12-on/12-off schedule is important to prevent local skin irritation and reduce systemic absorption. This is an excellent adjunct therapy because it provides localised relief without systemic sedation - particularly valuable for elderly patients who are sensitive to gabapentin's CNS effects. Can be used in combination with oral medications."
    }
  ],
  pearls: [
    "The 72-hour window for antiviral initiation is critical: starting valacyclovir or acyclovir within 72 hours of rash onset significantly reduces the duration and severity of the acute episode AND reduces the risk of developing post-herpetic neuralgia - do not delay treatment while awaiting laboratory confirmation",
    "Hutchinson sign (vesicles on the tip or side of the nose) indicates involvement of the nasociliary branch of the trigeminal nerve and carries a high risk of herpes zoster ophthalmicus with potential corneal involvement and vision loss - this requires URGENT same-day ophthalmology referral",
    "Shingles pain can precede the rash by 1-5 days: unilateral dermatomal pain without a visible rash can be misdiagnosed as cardiac, pleural, renal, or musculoskeletal conditions; maintain a high index of suspicion in older adults presenting with new-onset unilateral pain",
    "The rash is contagious through DIRECT CONTACT with vesicular fluid (not by respiratory transmission unless disseminated) - it can cause chickenpox in susceptible individuals but cannot cause shingles in another person; the rash is no longer contagious once all lesions have fully crusted over",
    "Post-herpetic neuralgia risk increases dramatically with age: approximately 30-50% of patients over 60 develop PHN, and it can persist for months to years; adequate acute pain management and antiviral therapy reduce but do not eliminate this risk",
    "Fall prevention is essential when administering gabapentin or pregabalin to elderly patients: dizziness, sedation, and ataxia are common and significantly increase fall risk; always start at the lowest dose and titrate slowly",
    "Shingrix vaccine is the current standard for prevention: 2-dose recombinant vaccine recommended for all adults 50 and older regardless of prior chickenpox history or prior Zostavax vaccination; greater than 90% effective at preventing shingles and PHN"
  ],
  quiz: [
    {
      question: "A 72-year-old patient presents with a painful, blistering rash on the left side of the chest that wraps from the back to the front but does not cross the midline. The rash appeared 36 hours ago. Which nursing action is the HIGHEST priority?",
      options: [
        "Apply calamine lotion to the rash and schedule a follow-up in 1 week",
        "Ensure antiviral therapy is initiated promptly, as the 72-hour window from rash onset has not yet passed",
        "Administer the Shingrix vaccine to prevent the infection from worsening",
        "Obtain a wound culture of the vesicular fluid before starting any treatment"
      ],
      correct: 1,
      rationale: "This presentation is classic herpes zoster (unilateral dermatomal vesicular rash). Antiviral therapy (valacyclovir or acyclovir) must be initiated within 72 hours of rash onset for maximum benefit in reducing duration, severity, and risk of post-herpetic neuralgia. At 36 hours, the patient is within this critical treatment window and therapy should not be delayed. Vaccination is preventive and not used to treat active shingles. Wound culture is not routinely needed for typical presentations."
    },
    {
      question: "The nurse observes vesicles on the tip of the nose in a patient with a painful facial rash along the forehead and upper eyelid. What does this finding indicate?",
      options: [
        "This is a normal finding in facial herpes zoster and requires no special intervention",
        "Hutchinson sign, indicating nasociliary nerve involvement and high risk of corneal complications requiring urgent ophthalmology referral",
        "Secondary bacterial infection of the rash that requires topical antibiotic ointment",
        "Evidence that the herpes zoster is disseminating and the patient needs airborne isolation"
      ],
      correct: 1,
      rationale: "Vesicles on the tip or side of the nose (Hutchinson sign) indicate involvement of the nasociliary branch of the ophthalmic division of the trigeminal nerve (V1). This branch also supplies the cornea, making the eye at high risk for herpes zoster ophthalmicus, which can cause keratitis, uveitis, and permanent vision loss. This finding requires urgent same-day ophthalmological evaluation. It is not a normal finding, not bacterial infection, and does not indicate dissemination by itself."
    },
    {
      question: "A patient with herpes zoster asks when they can safely be around their pregnant daughter who has never had chickenpox. Which response by the nurse is correct?",
      options: [
        "You are contagious through respiratory droplets, so you should wear a mask around her at all times",
        "You can be around her as long as you wash your hands frequently",
        "You should avoid direct contact with her until all of your blisters have completely crusted over, as the fluid inside the blisters can transmit the virus",
        "Herpes zoster is not contagious to other people, so there is no need for precautions"
      ],
      correct: 2,
      rationale: "Herpes zoster is contagious through direct contact with vesicular fluid. A person who has never had chickenpox and is not vaccinated can develop chickenpox (not shingles) from exposure to the vesicular fluid. Transmission is NOT typically by respiratory route unless the zoster is disseminated. The patient should avoid direct contact with the non-immune pregnant daughter until all lesions have fully crusted over, as VZV infection during pregnancy carries risks for the fetus (congenital varicella syndrome)."
    }
  ]
},

"bells-palsy-rpn": {
  title: "Bell's Palsy",
  cellular: {
    title: "Pathophysiology of Bell's Palsy",
    content: "Bell's palsy is an acute, idiopathic peripheral facial nerve (cranial nerve VII) paralysis that results in sudden onset unilateral facial weakness or complete paralysis. It is the most common cause of acute unilateral facial paralysis, accounting for approximately 60-75% of all cases. The incidence is approximately 20-30 per 100,000 people per year, with equal distribution between left and right sides and no significant sex difference.\n\nThe facial nerve (CN VII) has a complex course and multiple functions. It exits the brainstem at the cerebellopontine angle, travels through the temporal bone via the narrow fallopian canal (the longest bony canal traversed by any cranial nerve), and exits through the stylomastoid foramen to innervate the muscles of facial expression. Along its course, it also carries parasympathetic fibres to the lacrimal, submandibular, and sublingual glands (tearing and salivation), taste fibres from the anterior two-thirds of the tongue, and a small motor branch to the stapedius muscle in the middle ear (sound dampening).\n\nThe exact cause of Bell's palsy remains debated, but the leading theory involves reactivation of herpes simplex virus type 1 (HSV-1), which establishes latency in the geniculate ganglion of the facial nerve. When the virus reactivates, it causes inflammation and oedema of the facial nerve within the bony fallopian canal. Because the canal is rigid and narrow, there is no room for the swollen nerve to expand. The resulting compression causes demyelination and ischaemia of the nerve fibres, leading to conduction block and clinical paralysis.\n\nThe key distinction between peripheral and central facial nerve lesions is critical for the RPN. In Bell's palsy (peripheral CN VII lesion), the ENTIRE side of the face is affected - the patient cannot wrinkle the forehead, close the eye, or move the mouth on the affected side. This is because the peripheral nerve carries all motor fibres to all facial muscles on that side. In contrast, a central lesion (such as stroke affecting the motor cortex) spares the forehead because the upper facial muscles receive bilateral cortical innervation. If a patient presents with facial weakness but can wrinkle the forehead on the affected side, suspect a CENTRAL cause such as stroke rather than Bell's palsy.\n\nThe inability to close the eye on the affected side (lagophthalmos) is a clinically significant finding that creates a major management concern. Without complete eyelid closure, the cornea becomes exposed to drying, debris, and mechanical injury. Corneal ulceration and permanent vision impairment can result if eye protection measures are not implemented immediately. This makes eye care one of the most important nursing interventions in Bell's palsy.\n\nThe prognosis is generally favourable. Approximately 70-85% of patients recover completely without treatment, though recovery may take weeks to months. Treatment with corticosteroids (prednisone) started within 72 hours of onset significantly improves the rate and degree of recovery. The addition of antiviral therapy (valacyclovir) is debated but often prescribed in combination with steroids, particularly for severe paralysis. Factors associated with poorer prognosis include complete paralysis (vs. paresis), older age, diabetes, hypertension, and absence of any recovery by 3 weeks.\n\nFor the RPN, essential skills include differentiating Bell's palsy from stroke (the forehead test), protecting the exposed cornea, administering corticosteroids and antivirals, providing nutritional support for patients with difficulty chewing and managing oral intake, offering emotional support for the significant psychological distress of acute facial asymmetry, and teaching facial exercises during recovery."
  },
  riskFactors: [
    "Age 15-45 years (peak incidence, though it can occur at any age)",
    "Diabetes mellitus (2-4 times increased risk; diabetic neuropathy may predispose to nerve inflammation and poor recovery)",
    "Pregnancy (3 times increased risk, especially during the third trimester and first week postpartum, possibly related to oedema, hypercoagulability, and immunological changes)",
    "Upper respiratory tract infection in the preceding 1-2 weeks (suggests viral trigger, most commonly HSV-1 reactivation)",
    "Family history (approximately 4-14% of cases have a positive family history, suggesting genetic susceptibility in nerve canal anatomy)",
    "Hypertension (associated with microvascular changes that may predispose to nerve ischaemia)",
    "Previous episode of Bell's palsy (recurrence rate approximately 7-12%; recurrence on the same or opposite side)",
    "Immunocompromised state including HIV/AIDS (higher incidence and increased risk of bilateral involvement)",
    "Cold exposure or draughts (traditionally implicated but scientific evidence is limited)"
  ],
  diagnostics: [
    "Clinical diagnosis: Bell's palsy is a diagnosis of exclusion; the diagnosis is made clinically based on acute onset of unilateral peripheral facial paralysis with no identifiable cause after thorough evaluation",
    "Neurological examination: assess all branches of the facial nerve - ask the patient to raise eyebrows (frontalis), squeeze eyes shut tightly (orbicularis oculi), smile/show teeth (zygomaticus/orbicularis oris), puff cheeks; test taste on anterior two-thirds of tongue; assess hearing (hyperacusis from stapedius muscle involvement)",
    "The FOREHEAD TEST: the single most important clinical distinction - can the patient wrinkle the forehead? If NO (entire face affected) = peripheral lesion (Bell's palsy). If YES (forehead spared, only lower face affected) = central lesion (possible STROKE - activate stroke protocol immediately)",
    "Blood glucose and HbA1c: screen for undiagnosed diabetes, which increases risk and may affect recovery",
    "Lyme disease testing (ELISA with Western blot confirmation): essential in endemic areas, as Lyme disease is a common treatable cause of facial nerve palsy, especially bilateral palsy",
    "MRI brain and internal auditory canal with gadolinium: not routine but indicated if presentation is atypical (gradual onset, bilateral, recurrent, or failure to improve by 3-4 months) to exclude tumour, stroke, or other structural causes",
    "Electroneurography (ENoG) and electromyography (EMG): performed in complete paralysis at 10-14 days to assess degree of nerve degeneration and predict prognosis; greater than 90% degeneration on ENoG suggests poorer recovery"
  ],
  management: [
    "Corticosteroids: prednisone 60-80 mg daily for 7 days, then taper over 7 days (or prednisolone equivalent); MUST be started within 72 hours of symptom onset for maximum benefit; significantly improves complete recovery rates from approximately 60% to 90%",
    "Antiviral therapy: valacyclovir 1000 mg three times daily for 7 days, typically prescribed in combination with prednisone, especially for severe or complete paralysis; evidence for antivirals alone is weak but combination therapy may provide additional benefit",
    "Eye care (CRITICAL): artificial tears (preservative-free) every 1-2 hours during the day; lubricating ointment at bedtime; tape the affected eye closed at night using hypoallergenic tape; wear protective glasses or moisture chamber during the day to prevent corneal drying and injury",
    "Pain management: acetaminophen or NSAIDs for facial and retroauricular pain; warm compresses to the affected side for comfort",
    "Facial exercises and physiotherapy: gentle facial exercises to maintain muscle tone and promote recovery (raising eyebrows, closing eyes, smiling, puffing cheeks); begin when some voluntary movement returns; facial massage to prevent muscle contracture",
    "Nutritional support: soft foods on the unaffected side; teach patient to keep food in the unaffected cheek; careful oral hygiene after meals as food may pocket in the affected cheek without the patient's awareness",
    "Surgical decompression: rarely indicated; considered only for complete paralysis with greater than 90% degeneration on ENoG within 14 days of onset"
  ],
  nursingActions: [
    "Perform and document a thorough facial nerve assessment: test all facial movements bilaterally (raise eyebrows, close eyes tightly, smile, puff cheeks, purse lips); grade using the House-Brackmann scale (I = normal to VI = complete paralysis); compare sides",
    "Perform the FOREHEAD TEST as the first priority in acute facial weakness: determine whether the forehead is involved - if the patient CAN wrinkle the forehead on the weak side, the lesion may be central (potential stroke) and requires emergency evaluation",
    "Implement comprehensive eye care: administer artificial tears every 1-2 hours during waking hours; apply lubricating ointment at bedtime; tape the eye closed during sleep; assess cornea for redness, dryness, or irritation at each shift; protect eye with glasses or moisture chamber",
    "Administer corticosteroids and antivirals as prescribed; monitor blood glucose closely as corticosteroids cause hyperglycaemia, especially in diabetic patients; administer gastroprotective agents if prescribed",
    "Provide nutritional support: assess ability to chew and manage oral intake; offer soft foods; instruct patient to place food on the unaffected side; provide oral care after meals to remove food that may pocket in the affected cheek (risk of aspiration and dental caries)",
    "Provide psychological support: acute facial paralysis causes significant distress, embarrassment, and anxiety about permanent disfigurement; reassure patient that the majority (70-85%) recover fully; validate emotional responses and provide realistic timeline for recovery (weeks to months)",
    "Teach facial exercises to begin when some voluntary movement returns: raise eyebrows, close eyes gently then tightly, smile, puff cheeks, purse lips as if whistling; perform in front of a mirror 3-4 times daily; avoid forceful or excessive exercises which can promote synkinesis (abnormal simultaneous movement)"
  ],
  assessmentFindings: [
    "Acute onset (typically over hours, maximal within 48-72 hours) of unilateral facial weakness or complete paralysis affecting the ENTIRE half of the face including the forehead",
    "Inability to wrinkle the forehead, close the eye completely, or move the mouth on the affected side (peripheral pattern - this distinguishes it from stroke)",
    "Drooping of the eyebrow, widened palpebral fissure (eye appears more open), loss of nasolabial fold, and drooping of the corner of the mouth on the affected side",
    "Lagophthalmos: inability to completely close the eye on the affected side; Bell phenomenon may be visible (eye rolls upward when attempting to close, exposing the sclera)",
    "Retroauricular pain (pain behind the ear on the affected side): present in approximately 50% of patients and may precede the paralysis by 1-2 days",
    "Altered taste on the anterior two-thirds of the tongue on the affected side (chorda tympani involvement); hyperacusis (sensitivity to loud sounds) from stapedius muscle involvement",
    "Drooling from the affected corner of the mouth; difficulty eating and drinking with food or liquid escaping from the weak side"
  ],
  signs: {
    left: [
      "Facial asymmetry at rest (drooping on one side)",
      "Difficulty closing the eye on the affected side",
      "Loss of the nasolabial fold on the affected side",
      "Pain behind the ear preceding or accompanying weakness",
      "Altered taste sensation on one side of the tongue"
    ],
    right: [
      "Complete inability to move any muscle on one side of face",
      "Corneal exposure and dryness from lagophthalmos",
      "Inability to wrinkle forehead (rules out stroke as cause)",
      "No improvement after 3-4 weeks (poorer prognosis indicator)",
      "Bilateral facial paralysis (suggests Lyme disease, GBS, or sarcoidosis rather than Bell's palsy)"
    ]
  },
  medications: [
    {
      name: "Prednisone",
      type: "Corticosteroid (oral, systemic anti-inflammatory)",
      action: "Potent anti-inflammatory that reduces oedema and swelling of the facial nerve within the bony fallopian canal, relieving compression and ischaemia; significantly improves complete recovery rates when started within 72 hours; typical dose is 60-80 mg daily for 7 days followed by a 7-day taper",
      sideEffects: "Hyperglycaemia (monitor blood glucose closely, especially in diabetic patients), insomnia, mood changes (euphoria, irritability, anxiety), increased appetite and weight gain, GI irritation (take with food), fluid retention, immunosuppression with prolonged use",
      contra: "Active untreated infection, systemic fungal infection; use with caution in diabetes (will worsen glycaemic control), peptic ulcer disease, osteoporosis, glaucoma, psychotic disorders; short course (2 weeks) minimises adverse effects",
      pearl: "The 72-hour window is critical: starting prednisone within 72 hours of symptom onset increases the complete recovery rate from approximately 60% (without treatment) to approximately 90%. Administer with food to reduce GI irritation. Monitor blood glucose at least twice daily during treatment. For diabetic patients, anticipate insulin dose adjustments. Do not discontinue abruptly after courses longer than 7-10 days - follow the taper schedule."
    },
    {
      name: "Valacyclovir (Valtrex)",
      type: "Antiviral (prodrug of acyclovir; oral)",
      action: "Targets suspected HSV-1 reactivation in the geniculate ganglion by inhibiting viral DNA polymerase; given in combination with prednisone for moderate-severe Bell's palsy; dose is 1000 mg three times daily for 7 days; evidence supports combination therapy (steroid + antiviral) over steroid alone for severe cases",
      sideEffects: "Nausea, headache, dizziness, abdominal pain; renal toxicity with inadequate hydration; ensure adequate fluid intake during treatment",
      contra: "Known hypersensitivity; dose adjustment required in renal impairment; ensure adequate hydration to prevent renal crystalluria",
      pearl: "Evidence for antiviral therapy alone is weak, but when combined with corticosteroids, there may be additional benefit, particularly in patients with severe or complete facial paralysis. Always prescribed WITH prednisone, not as monotherapy. Ensure the patient drinks at least 1-2 litres of water daily to prevent renal complications. Same drug used for herpes zoster - 1000 mg three times daily for 7 days."
    },
    {
      name: "Artificial Tears / Lubricating Eye Ointment",
      type: "Ophthalmic lubricant (topical, preservative-free preferred)",
      action: "Provides moisture and lubrication to the exposed cornea in patients who cannot fully close the affected eye (lagophthalmos); prevents corneal desiccation, abrasion, ulceration, and potential permanent vision loss; artificial tears used every 1-2 hours during the day; thicker lubricating ointment applied at bedtime for overnight protection",
      sideEffects: "Transient blurring of vision (especially with ointment - this is why ointment is used at bedtime); preservative-containing drops can cause irritation with frequent use (use preservative-free formulations for frequent dosing)",
      contra: "Known allergy to product ingredients; do not use drops or ointment that have been open longer than 28 days (contamination risk)",
      pearl: "Eye care is arguably the MOST important nursing intervention in Bell's palsy because corneal damage from exposure can be permanent. Use preservative-free artificial tears for frequent daytime use. Apply a generous amount of lubricating ointment at bedtime AND tape the eyelid closed with hypoallergenic tape. Teach patients to wear wrap-around glasses or a moisture chamber outdoors. If the patient reports eye redness, pain, grittiness, or vision changes, arrange URGENT ophthalmological evaluation for possible corneal ulceration."
    }
  ],
  pearls: [
    "The FOREHEAD TEST is the single most important clinical assessment: if the patient CANNOT wrinkle the forehead on the weak side, the lesion is peripheral (Bell's palsy pattern). If the patient CAN wrinkle the forehead (forehead is spared), suspect a CENTRAL cause such as STROKE and activate the emergency stroke protocol immediately",
    "Eye care is the most critical nursing intervention: the inability to close the eye completely (lagophthalmos) puts the cornea at risk for drying, abrasion, and ulceration, which can lead to permanent vision loss - implement artificial tears, lubricating ointment, and taping of the eye immediately",
    "The 72-hour treatment window for prednisone is critical: early corticosteroid therapy within 72 hours of onset increases complete recovery rates from approximately 60% to approximately 90% - do not delay treatment",
    "Bell's palsy is a diagnosis of EXCLUSION: other causes of peripheral facial paralysis must be considered including Lyme disease (especially in endemic areas), Ramsay Hunt syndrome (herpes zoster oticus - look for vesicles in the ear), tumours, Guillain-Barre syndrome (bilateral), and otitis media",
    "Educate patients about the typical recovery timeline: most improvement occurs within 3 weeks to 3 months; complete recovery in 70-85% of patients; residual weakness in 15-30%; synkinesis (involuntary associated movements) may develop during recovery",
    "Food pocketing in the affected cheek is a significant concern: food debris can accumulate without the patient's awareness, increasing risk of dental caries, aspiration, and oral infections; ensure thorough oral care after every meal and snack",
    "Psychological support is essential: sudden facial paralysis causes significant emotional distress, social embarrassment, and anxiety about permanent disfigurement; validate feelings, provide realistic reassurance about the high likelihood of recovery, and consider referral for counselling if distress is severe"
  ],
  quiz: [
    {
      question: "A patient presents to the emergency department with sudden onset inability to move the right side of the face. The nurse notes that the patient cannot raise the right eyebrow, close the right eye, or smile on the right side. What does the inability to wrinkle the forehead indicate?",
      options: [
        "A central nervous system lesion such as a stroke, which requires emergency evaluation",
        "A peripheral facial nerve lesion consistent with Bell's palsy",
        "Bilateral facial nerve involvement suggesting Guillain-Barre syndrome",
        "Facial muscle fatigue that will resolve with rest"
      ],
      correct: 1,
      rationale: "Inability to wrinkle the forehead on the affected side indicates a peripheral facial nerve (CN VII) lesion - the entire half of the face is paralysed including the forehead. This is consistent with Bell's palsy. In a central lesion (such as stroke), the forehead is SPARED because the upper facial muscles receive bilateral cortical innervation. Forehead involvement = peripheral. Forehead sparing = central. This distinction is critical because a central lesion warrants an immediate stroke workup."
    },
    {
      question: "Which nursing intervention is the HIGHEST priority for a patient diagnosed with Bell's palsy who cannot close the right eye?",
      options: [
        "Applying a warm compress to the right side of the face every 4 hours",
        "Implementing an eye care regimen with artificial tears, lubricating ointment at bedtime, and taping the eye closed during sleep",
        "Beginning facial exercises immediately to strengthen the orbicularis oculi muscle",
        "Patching the affected eye continuously with gauze and tape"
      ],
      correct: 1,
      rationale: "The inability to close the eye (lagophthalmos) puts the cornea at risk for exposure keratopathy, desiccation, abrasion, and ulceration, which can cause permanent vision loss. The correct approach includes preservative-free artificial tears every 1-2 hours during the day, lubricating ointment at bedtime, and taping the eye closed at night to maintain corneal moisture. Continuous patching with gauze is incorrect as it does not maintain moisture and the dry gauze can abrade the cornea. Facial exercises should wait until some voluntary movement returns."
    },
    {
      question: "A patient with Bell's palsy asks why they need to take prednisone when they have heard that most people recover on their own. Which response by the nurse is most accurate?",
      options: [
        "Prednisone cures Bell's palsy by killing the virus causing the nerve inflammation",
        "Without prednisone, Bell's palsy always results in permanent facial paralysis",
        "Prednisone reduces nerve swelling within the bony canal, which significantly improves the chance and speed of complete recovery when started within 72 hours",
        "Prednisone is only prescribed to manage pain and has no effect on recovery outcome"
      ],
      correct: 2,
      rationale: "Prednisone is a corticosteroid that reduces inflammation and oedema of the facial nerve within the narrow bony fallopian canal. By reducing swelling, it relieves compression and ischaemia of the nerve, significantly improving complete recovery rates from approximately 60% (without treatment) to approximately 90% (with treatment). It must be started within 72 hours for maximum benefit. It does not kill viruses (that is the role of antivirals). While most patients do recover, prednisone substantially improves both the rate and degree of recovery."
    }
  ]
}

};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count} / ${Object.keys(lessons).length} lessons injected`);
