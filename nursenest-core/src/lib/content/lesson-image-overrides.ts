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
  // Also applicable as a secondary figure in infection/sepsis lessons:
  "ca-rn-infection-control": "uploads/images/inflammatory-response.webp",
  "us-rn-infection-control": "uploads/images/inflammatory-response.webp",

  // ── Pediatric / Cardiovascular ────────────────────────────────
  "kawasaki-disease": "uploads/images/kawasaki-disease.webp",
  "kawasaki-syndrome": "uploads/images/kawasaki-disease.webp",
  "mucocutaneous-lymph-node-syndrome": "uploads/images/kawasaki-disease.webp",
};
