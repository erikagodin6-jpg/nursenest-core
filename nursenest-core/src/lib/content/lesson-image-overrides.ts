/**
 * Manual override map: lesson slug → Spaces object key.
 *
 * Use this when an image filename does not cleanly match the lesson slug —
 * for example, when an image was uploaded with a slightly different name,
 * or when multiple lessons share one canonical diagram.
 *
 * FORMAT:
 *   "<lesson-slug>": "uploads/images/<filename>.<ext>"
 *
 * Overrides are checked BEFORE automatic slug matching and always win.
 * Add entries here sparingly; the preferred workflow is to upload images
 * named exactly after the lesson slug so they match automatically.
 *
 * EXAMPLE ENTRIES (uncomment and adjust):
 *
 *   "heart-failure-left-vs-right": "uploads/images/heart-failure-comparison.png",
 *   "aki-acute-kidney-injury": "uploads/images/acute-kidney-injury.webp",
 *   "type-2-diabetes-management": "uploads/images/diabetes-mellitus.webp",
 */
/**
 * Deterministic image → lesson slug mappings for existing DO Spaces assets.
 *
 * Resolution order:
 *  1. Check this map (slug → object key).
 *  2. Auto-match: convert slug to image filename (slug → slug.webp, slug.png).
 *  3. No image if neither matches the inventory.
 *
 * Object keys come from education-image-inventory.json ("keys" array).
 * CDN URL is built by publicCdnUrlForObjectKey() from @/lib/education-images/cdn-url.
 *
 * Section placement: images are embedded in the section where they add
 * the most clinical meaning (see figures[] field on PathwayLessonSection).
 * This map drives the lesson-detail page and any image-aware hub cards.
 */
export const LESSON_IMAGE_OVERRIDES: Readonly<Record<string, string>> = {
  // ── Dermatology / Skin ─────────────────────────────────────────
  "alopecia": "uploads/images/alopecia.webp",
  "alopecia-areata": "uploads/images/alopecia.webp",
  "androgenic-alopecia": "uploads/images/alopecia.webp",

  "atopic-dermatitis": "uploads/images/atopic-dermatitis.webp",
  "eczema": "uploads/images/atopic-dermatitis.webp",
  "atopic-eczema": "uploads/images/atopic-dermatitis.webp",

  "impetigo": "uploads/images/impetigo.webp",
  "impetigo-contagiosa": "uploads/images/impetigo.webp",

  "scabies": "uploads/images/scabies.webp",
  "scabies-infestation": "uploads/images/scabies.webp",

  "herpes-simplex": "uploads/images/herpes-simplex.webp",
  "herpes-simplex-virus": "uploads/images/herpes-simplex.webp",
  "oral-herpes": "uploads/images/herpes-simplex.webp",
  "genital-herpes": "uploads/images/herpes-simplex.webp",

  "shingles": "uploads/images/shingles.webp",
  "herpes-zoster": "uploads/images/shingles.webp",
  "varicella-zoster-reactivation": "uploads/images/shingles.webp",

  "varicella": "uploads/images/varicella.webp",
  "chickenpox": "uploads/images/varicella.webp",
  "varicella-zoster": "uploads/images/varicella.webp",
  "varicella-rash": "uploads/images/varicella-rash-stages.webp",

  "pemphigus": "uploads/images/pemphigus.webp",
  "pemphigus-vulgaris": "uploads/images/pemphigus.webp",
  "autoimmune-blistering": "uploads/images/pemphigus.webp",

  "stevens-johnson-syndrome": "uploads/images/stevens-johnson-syndrome.webp",
  "sjs-ten": "uploads/images/stevens-johnson-syndrome.webp",
  "toxic-epidermal-necrolysis": "uploads/images/stevens-johnson-syndrome.webp",

  "vitiligo": "uploads/images/vitiligo.webp",
  "vitiligo-depigmentation": "uploads/images/vitiligo.webp",

  // ── Ophthalmology / Eye ────────────────────────────────────────
  "conjunctivitis": "uploads/images/conjunctivitis.webp",
  "pink-eye": "uploads/images/conjunctivitis.webp",
  "allergic-conjunctivitis": "uploads/images/conjunctivitis.webp",
  "bacterial-conjunctivitis": "uploads/images/conjunctivitis.webp",

  "glaucoma": "uploads/images/glaucoma.webp",
  "open-angle-glaucoma": "uploads/images/glaucoma.webp",
  "angle-closure-glaucoma": "uploads/images/glaucoma.webp",
  "intraocular-pressure": "uploads/images/glaucoma.webp",

  "retinal-detachment": "uploads/images/retinal-detachment.webp",
  "retinal-tear": "uploads/images/retinal-detachment.webp",
  "retina-detachment": "uploads/images/retinal-detachment.webp",

  // ── Respiratory / Airway (Pediatric) ──────────────────────────
  "epiglottitis": "uploads/images/epiglottitis.webp",
  "acute-epiglottitis": "uploads/images/epiglottitis.webp",
  "pediatric-epiglottitis": "uploads/images/epiglottitis.webp",

  // ── Musculoskeletal / Bone ────────────────────────────────────
  "osteoporosis": "uploads/images/osteoporosis.webp",
  "osteopenia": "uploads/images/osteoporosis.webp",
  "bone-density-loss": "uploads/images/osteoporosis.webp",

  // ── Infectious / Parasitic ────────────────────────────────────
  "pinworms": "uploads/images/pinworms.webp",
  "enterobiasis": "uploads/images/pinworms.webp",
  "pinworm-infection": "uploads/images/pinworms.webp",

  "head-lice": "uploads/images/head-lice.webp",
  "pediculosis-capitis": "uploads/images/head-lice.webp",
  "lice-infestation": "uploads/images/head-lice.webp",

  // ── Immune / Inflammatory ─────────────────────────────────────
  "inflammatory-response": "uploads/images/inflammatory-response.webp",
  "inflammation-pathophysiology": "uploads/images/inflammatory-response.webp",
  // Infection-control lessons across all pathways
  "ca-rn-infection-control": "uploads/images/inflammatory-response.webp",
  "us-rn-infection-control": "uploads/images/inflammatory-response.webp",
  "ca-rpn-infection-control": "uploads/images/inflammatory-response.webp",
  "us-pn-infection-control": "uploads/images/inflammatory-response.webp",
  // C. diff / CDI lessons
  "c-diff-infection-control": "uploads/images/inflammatory-response.webp",
  "c-diff-contact-precautions": "uploads/images/inflammatory-response.webp",
  // Wound infection lessons
  "wound-infection-vs-colonization": "uploads/images/inflammatory-response.webp",

  // ── Skin / Dermatitis ─────────────────────────────────────────
  // atopic-dermatitis.webp is the best available image for dermatitis nursing lessons
  "severe-dermatitis-skin-care": "uploads/images/atopic-dermatitis.webp",

  // ── Pediatric / Cardiovascular ────────────────────────────────
  "kawasaki-disease": "uploads/images/kawasaki-disease.webp",
  "kawasaki-syndrome": "uploads/images/kawasaki-disease.webp",
  "mucocutaneous-lymph-node-syndrome": "uploads/images/kawasaki-disease.webp",

  // ── Canonical CDN clinical illustrations (priority 1 — override local SVG registry) ──
  // These entries ensure the authoritative Spaces CDN images always win over the
  // local SVG clinical illustration registry (which fires at priority 2).
  // Object keys are bare Spaces bucket filenames; CDN URL is built by publicCdnUrlForObjectKey().

  // Abdominal Aortic Aneurysm
  "abdominal-aortic-aneurysm": "abdominalaorticaneurysm.jpeg",
  "abdominal-aortic-aneurysm-nursing": "abdominalaorticaneurysm.jpeg",
  "aaa-aneurysm": "abdominalaorticaneurysm.jpeg",
  "aaa-nursing": "abdominalaorticaneurysm.jpeg",
  "aortic-aneurysm-repair": "abdominalaorticaneurysm.jpeg",
  "endovascular-aortic-repair": "abdominalaorticaneurysm.jpeg",
  "evar-nursing": "abdominalaorticaneurysm.jpeg",
  "open-aortic-repair": "abdominalaorticaneurysm.jpeg",

  // Acute Coronary Syndrome
  "acute-coronary-syndrome": "acutecoronarysyndrome.jpeg",
  "acs-nursing": "acutecoronarysyndrome.jpeg",
  "acs-management": "acutecoronarysyndrome.jpeg",
  "acute-coronary-syndrome-nursing": "acutecoronarysyndrome.jpeg",
  "acute-coronary-syndrome-management": "acutecoronarysyndrome.jpeg",
  "nstemi": "acutecoronarysyndrome.jpeg",
  "stemi": "acutecoronarysyndrome.jpeg",
  "stemi-nursing": "acutecoronarysyndrome.jpeg",
  "nstemi-nursing": "acutecoronarysyndrome.jpeg",
  "unstable-angina": "acutecoronarysyndrome.jpeg",
  "unstable-angina-nursing": "acutecoronarysyndrome.jpeg",
  "acs-pathophysiology": "acutecoronarysyndrome.jpeg",

  // Atrial Fibrillation
  "atrial-fibrillation": "atrialfibrillation.jpeg",
  "afib-nursing": "atrialfibrillation.jpeg",
  "atrial-fibrillation-nursing": "atrialfibrillation.jpeg",
  "atrial-fibrillation-management": "atrialfibrillation.jpeg",
  "afib-management": "atrialfibrillation.jpeg",
  "atrial-fibrillation-anticoagulation": "atrialfibrillation.jpeg",
  "rate-vs-rhythm-control": "atrialfibrillation.jpeg",
  "afib-with-rvr": "atrialfibrillation.jpeg",
  "atrial-fibrillation-stroke-risk": "atrialfibrillation.jpeg",
  "paroxysmal-afib": "atrialfibrillation.jpeg",
  "persistent-afib": "atrialfibrillation.jpeg",
  "permanent-afib": "atrialfibrillation.jpeg",

  // Coronary Artery Bypass Grafting (CABG)
  "cabg": "CABG.jpeg",
  "cabg-nursing": "CABG.jpeg",
  "coronary-artery-bypass-graft": "CABG.jpeg",
  "coronary-artery-bypass-grafting": "CABG.jpeg",
  "coronary-artery-bypass-surgery": "CABG.jpeg",
  "cabg-postoperative-care": "CABG.jpeg",
  "cabg-perioperative": "CABG.jpeg",
  "open-heart-surgery-nursing": "CABG.jpeg",
  "cardiac-surgery-cabg": "CABG.jpeg",

  // Cardiac Tamponade
  "cardiac-tamponade": "cardiactamponade.jpeg",
  "cardiac-tamponade-nursing": "cardiactamponade.jpeg",
  "pericardial-tamponade": "cardiactamponade.jpeg",
  "tamponade-nursing": "cardiactamponade.jpeg",
  "cardiac-tamponade-management": "cardiactamponade.jpeg",
  "pericardiocentesis-nursing": "cardiactamponade.jpeg",
  "obstructive-shock-tamponade": "cardiactamponade.jpeg",

  // Deep Vein Thrombosis
  "deep-vein-thrombosis": "DVT.png",
  "dvt": "DVT.png",
  "dvt-nursing": "DVT.png",
  "lower-extremity-dvt": "DVT.png",
  "deep-vein-thrombosis-nursing": "DVT.png",
  "dvt-pe-prevention-nursing": "DVT.png",
  "dvt-pe-nursing-priorities": "DVT.png",
  "dvt-anticoagulation": "DVT.png",
  "upper-extremity-dvt": "DVT.png",

  // Hypertensive Encephalopathy
  "hypertensive-encephalopathy": "HypertensiveEncephalopathy.png",
  "hypertensive-encephalopathy-nursing": "HypertensiveEncephalopathy.png",
  "hypertensive-emergency": "HypertensiveEncephalopathy.png",
  "hypertensive-emergency-nursing": "HypertensiveEncephalopathy.png",
  "hypertensive-crisis-nursing": "HypertensiveEncephalopathy.png",
  "hypertensive-urgency": "HypertensiveEncephalopathy.png",
  "malignant-hypertension": "HypertensiveEncephalopathy.png",
  "hypertensive-crisis-encephalopathy": "HypertensiveEncephalopathy.png",

  // Infective Endocarditis
  "infective-endocarditis": "InfectiveEndocarditis.png",
  "infective-endocarditis-nursing": "InfectiveEndocarditis.png",
  "bacterial-endocarditis": "InfectiveEndocarditis.png",
  "subacute-bacterial-endocarditis": "InfectiveEndocarditis.png",
  "acute-infective-endocarditis": "InfectiveEndocarditis.png",
  "endocarditis-nursing": "InfectiveEndocarditis.png",
  "endocarditis-management": "InfectiveEndocarditis.png",
  "endocarditis-complications": "InfectiveEndocarditis.png",
};
