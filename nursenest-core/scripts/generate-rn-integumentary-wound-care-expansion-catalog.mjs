/**
 * Writes rn-nclex-integumentary-wound-care-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-integumentary-wound-care-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-integumentary-wound-care-expansion-catalog.json");

const DEFS = [
  {
    slug: "skin-assessment-for-nurses-nclex",
    title: "Skin Assessment for Nurses",
    seoTitle: "Skin Assessment for Nurses | NCLEX-RN | NurseNest",
    hook: "new purple discoloration over the sacrum on dark skin",
    exam: "Items reward **total skin inspection**, **risk tools** (Braden themes), **moisture and friction** cues, and **early reporting**—not skipping dependent areas because the client is independent for ADLs.",
    bullets: `- **Every admission**: head-to-toe skin including **heels, sacrum, ischiae, ears**, and under devices.
- **Dark skin**: do not rely on redness alone—assess **warmth**, **induration**, **pain**, and **localized temperature**.
- **Devices/lines**: mask edges, oxygen tubing, orthotics—pressure and moisture under them.`,
  },
  {
    slug: "wound-assessment-size-depth-drainage-odour-tissue",
    title: "Wound Assessment: Size, Depth, Drainage & Tissue",
    seoTitle: "Wound Assessment: Size, Depth, Drainage, Odour, Tissue Type | NCLEX-RN | NurseNest",
    hook: "increasing purulent drainage with odor",
    exam: "NCLEX tests **consistent measurement** (length × width × depth), **tunneling/undermining** notation, **tissue types** (granulation, slough, eschar), and **infection vs colonization** escalation when systemic signs appear.",
    bullets: `- **Periwound**: maceration, erythema extension, induration—pair with vitals and labs when shown.
- **Pain**: new or worsening pain can signal **infection** or **ischemia**—do not dismiss as expected.
- **Documentation**: objective wording supports provider/wound-team decisions and legal clarity.`,
  },
  {
    slug: "wound-healing-phases-nursing",
    title: "Wound Healing Phases",
    seoTitle: "Wound Healing Phases | NCLEX-RN | NurseNest",
    hook: "pink granulation budding in a surgical site",
    exam: "Expect **hemostasis → inflammation → proliferation → remodeling** framing, **nutrition** (protein), **glycemic control**, and **infection** as disruptors—pick teaching that matches the stem’s phase and risk.",
    bullets: `- **Inflammation**: expected early erythema/edema vs spreading **cellulitis**—use stem severity.
- **Proliferation**: granulation, contraction; protect from trauma and contamination.
- **Remodeling**: scar maturation teaching—sun protection and activity guidance when appropriate.`,
  },
  {
    slug: "acute-vs-chronic-wounds-nclex",
    title: "Acute vs Chronic Wounds",
    seoTitle: "Acute vs Chronic Wounds | NCLEX-RN | NurseNest",
    hook: "a venous ulcer present for months without progress",
    exam: "Boards contrast **clean surgical healing** with **stalled chronic** wounds needing **perfusion**, **compression** (venous), **offloading** (diabetic), and **addressing infection**—avoid one-size dressing answers.",
    bullets: `- **Acute**: primary closure themes, sterile technique per orders, watch dehiscence signs.
- **Chronic**: address **cause** (pressure, venous, arterial, diabetic) alongside local wound care.
- **Bioburden**: slough/eschar may need debridement per scope and orders—not independent sharp debridement by student nurse.`,
  },
  {
    slug: "surgical-wound-care-nclex",
    title: "Surgical Wound Care",
    seoTitle: "Surgical Wound Care | NCLEX-RN | NurseNest",
    hook: "a clean dry incision on post-op day 2",
    exam: "Items test **sterile vs clean technique per policy**, **drain output** reporting, **staple/suture line** assessment, and **signs of infection**—prioritize fever with spreading erythema over routine dressing timing alone.",
    bullets: `- **Assess**: edges approximated, serosanguineous small amounts vs purulence.
- **Splints/braces**: follow orders for movement restrictions that protect the incision.
- **Patient teaching**: showering restrictions, when to call for fever, wound opening, or pus.`,
  },
  {
    slug: "wound-dehiscence-evisceration-nclex",
    title: "Wound Dehiscence & Evisceration",
    seoTitle: "Wound Dehiscence and Evisceration | NCLEX-RN | NurseNest",
    hook: "sudden gush of serosanguineous fluid from the midline incision",
    exam: "**Evisceration** is a nursing emergency: **call for help**, **NPO**, **knees flexed**, **moist sterile dressings** over exposed viscera per protocol, **do not push organs in**, prepare for **OR**—airway is usually stable but watch shock.",
    bullets: `- **Dehiscence without evisceration**: protect site, notify urgently, hemodynamic monitoring.
- **Never** reapproximate the wound at bedside without explicit trained protocol.
- **Psychosocial**: calm, clear communication while rapid interventions proceed.`,
  },
  {
    slug: "pressure-injury-prevention-nclex-rn",
    title: "Pressure Injury Prevention",
    seoTitle: "Pressure Injury Prevention | NCLEX-RN | NurseNest",
    hook: "immobility after hip surgery with Braden at-risk score",
    exam: "NCLEX rewards **repositioning schedules**, **surface selection**, **offloading heels**, **nutrition consult**, and **moisture management**—not charting alone as the “priority.”",
    bullets: `- **Reposition**: set clocks, document, delegate turning aids appropriately.
- **Surfaces**: specialty mattress themes when indicated by policy/stem.
- **Moisture**: IAD prevention with barriers—moisture is a pressure injury cofactor.`,
  },
  {
    slug: "pressure-injury-treatment-dressing-selection",
    title: "Pressure Injury Treatment & Dressings",
    seoTitle: "Pressure Injury Treatment and Dressing Selection | NCLEX-RN | NurseNest",
    hook: "stage 3 sacral wound with moderate exudate",
    exam: "Match **exudate level** to **foam/alginate** choices, avoid **occlusive hydrocolloid on heavy infection** when stem suggests purulence, and escalate **unstageable** eschar per wound-team/provider pathways.",
    bullets: `- **Protect periwound** from maceration with barriers or appropriate secondary dressings.
- **Pain**: pre-medicate before changes when ordered; minimize trauma during removal.
- **Do not reverse-stage** documentation—describe healing within true stage.`,
  },
  {
    slug: "moisture-associated-skin-damage-masd",
    title: "Moisture-Associated Skin Damage (MASD)",
    seoTitle: "Moisture-Associated Skin Damage | NCLEX-RN | NurseNest",
    hook: "denuded skin in skin folds with erythema",
    exam: "Distinguish **MASD** from **true pressure injury** when friction/moisture dominates; prioritize **skin protection**, **source control**, and **barrier products** per orders.",
    bullets: `- **Interventions**: gentle cleansing, pat dry, apply barriers, keep folds dry.
- **Teaching**: weight loss support, antifungal themes only when fungal component is identified in stem.
- **Avoid** blaming patient—focus functional supports and scheduled care.`,
  },
  {
    slug: "incontinence-associated-dermatitis-iad-nclex",
    title: "Incontinence-Associated Dermatitis (IAD)",
    seoTitle: "Incontinence-Associated Dermatitis | NCLEX-RN | NurseNest",
    hook: "burning perineal rash in an incontinent older adult",
    exam: "NCLEX tests **prompt cleansing**, **barrier creams/pastes**, **toileting schedules**, and **differentiation from stage 2 pressure injury** when location and mechanism fit IAD.",
    bullets: `- **Prevention**: scheduled toileting, absorbent products changed promptly.
- **Skin**: avoid harsh scrubbing; use pH-appropriate cleansers per facility policy.
- **Escalate** if candidiasis signs appear per assessment (satellite lesions when described).`,
  },
  {
    slug: "diabetic-foot-ulcers-nursing",
    title: "Diabetic Foot Ulcers",
    seoTitle: "Diabetic Foot Ulcers | NCLEX-RN | NurseNest",
    hook: "a plantar callus with a small sinus tract",
    exam: "Emphasize **offloading**, **perfusion/neurovascular checks**, **glycemic control**, **infection signs**, and **urgent escalation** for **sepsis**, **gas**, or **rapid spread**—not only topical cream.",
    bullets: `- **Daily foot inspection** teaching for neuropathy clients.
- **Avoid weight-bearing** on the ulcer per orders; footwear counseling.
- **Red flag**: fever, red streaking, crepitus, systemic toxicity—emergency pathway.`,
  },
  {
    slug: "venous-stasis-ulcers-nursing",
    title: "Venous Stasis Ulcers",
    seoTitle: "Venous Stasis Ulcers | NCLEX-RN | NurseNest",
    hook: "irregular ulcer near the medial malleolus with weeping legs",
    exam: "Boards pair **compression therapy** when not contraindicated, **leg elevation**, **dermatitis care**, and **infection vigilance**—avoid arterial ulcer answers when pulses/edema pattern fits venous disease.",
    bullets: `- **Edema management**: compression stockings/wraps per orders after ABIs when shown.
- **Wound bed**: often pink granular with copious exudate—choose absorbent dressings.
- **Skin**: treat stasis dermatitis gently—avoid trauma from adhesives.`,
  },
  {
    slug: "arterial-ulcers-nursing-nclex",
    title: "Arterial Ulcers",
    seoTitle: "Arterial Ulcers | NCLEX-RN | NurseNest",
    hook: "punched-out painful toe ulcer with weak pedal pulses",
    exam: "**Compression is dangerous** when arterial insufficiency dominates; prioritize **perfusion assessment**, **protective footwear**, **pain control**, and **vascular referral themes**—match contraindications in stems.",
    bullets: `- **Claudication/rest pain** clues with diminished pulses—document objectively.
- **Avoid dependent rubor misread** as healthy pinkness when ischemia exists.
- **Teaching**: foot protection, tobacco cessation support, never heat packs on insensate ischemic feet.`,
  },
  {
    slug: "wound-sepsis-red-flags-nclex",
    title: "Wound Infection & Sepsis Red Flags",
    seoTitle: "Wound Infection and Sepsis Red Flags | NCLEX-RN | NurseNest",
    hook: "fever, tachycardia, and spreading erythema from a leg ulcer",
    exam: "Choose **assessment + notify + sepsis precautions** (labs, cultures per orders, IV access) over finishing paperwork; recognize **SIRS/sepsis** clusters early.",
    bullets: `- **Local**: increasing pain, purulence, crepitus, fast enlargement.
- **Systemic**: fever, confusion, hypotension, tachypnea—activate team per protocol.
- **Cultures**: before antibiotics when the stem orders timing—follow that sequence.`,
  },
  {
    slug: "negative-pressure-wound-therapy-npwt",
    title: "Negative Pressure Wound Therapy (NPWT)",
    seoTitle: "Negative Pressure Wound Therapy | NCLEX-RN | NurseNest",
    hook: "canister suddenly full with loss of seal alarm",
    exam: "Tests **seal checks**, **exudate canister changes**, **bleeding vigilance**, **fistula/malignancy contraindications** when stem lists them, and **never clamp** the therapy without orders in acute bleeding scenarios.",
    bullets: `- **Sponge integrity** and **tubing** patency; document exudate trends.
- **Pain** and **bleeding** after dressing change—notify promptly.
- **Education**: avoid soaking dressings off aggressively at home unless taught.`,
  },
  {
    slug: "dressing-types-gauze-foam-hydrocolloid-alginate-film",
    title: "Dressing Types: Gauze, Foam, Hydrocolloid, Alginate, Film",
    seoTitle: "Dressing Types: Gauze, Foam, Hydrocolloid, Alginate, Transparent Film | NCLEX-RN | NurseNest",
    hook: "heavy exudate undermining cavity wound",
    exam: "Match **moisture balance**: alginate/foam for exudate; hydrogel for dry necrotic autolytic themes; **transparent film** for superficial minimal drainage—not for heavy exudate or infected cavities.",
    bullets: `- **Silver dressings**: only when infection/colonization indicated—watch stem cues.
- **Adhesive injury**: protect fragile skin with skin prep or less aggressive fixation per policy.
- **Allergies**: document tape/adhesive reactions.`,
  },
  {
    slug: "surgical-drain-care-jp-hemovac-penrose",
    title: "Drain Care: JP, Hemovac, Penrose",
    seoTitle: "Drain Care: JP, Hemovac, Penrose | NCLEX-RN | NurseNest",
    hook: "sudden drop to zero output after ambulation",
    exam: "Assess **patency**, **stripping/milking per policy**, **kinks**, and **sudden increase** (hemorrhage) versus **clog**; empty **closed drains** per sterile technique and measure correctly.",
    bullets: `- **Secure**: prevent traction on insertion site; mark skin at insertion reference.
- **Penrose**: open gravity drain teaching—different infection and skin protection priorities.
- **Report**: bright red large increases, foul unexpected change, fever.`,
  },
  {
    slug: "sutures-staples-steri-strips-care",
    title: "Sutures, Staples & Steri-Strips",
    seoTitle: "Sutures, Staples, and Steri-Strips | NCLEX-RN | NurseNest",
    hook: "staple line gaping after coughing",
    exam: "Watch **dehiscence** early signs; teach **splinting** incision with pillow, **activity limits**, and **when to call**—avoid removing staples independently.",
    bullets: `- **Steri-strips**: fall off naturally; keep dry unless orders say otherwise.
- **Staple/suture removal** is provider-driven in NCLEX stems—nurse prepares and supports.
- **Showering**: follow post-op orders exactly.`,
  },
  {
    slug: "burn-depth-classification-nclex",
    title: "Burns: First-, Second-, Third-Degree",
    seoTitle: "Burns: First-Degree, Partial-Thickness, Full-Thickness | NCLEX-RN | NurseNest",
    hook: "white leathery insensate burn after house fire",
    exam: "Differentiate **partial-thickness painful blisters** from **full-thickness** dry/insensate patterns; pair with **TBSA** tools and **inhalation** cues when face/neck involved.",
    bullets: `- **Rule of nines** / palm method themes when the stem tests TBSA estimates.
- **Airway** cues trump cosmetic wound care when both appear.
- **Electrical/chemical** overlap: look for hidden deep injury in electrical stems.`,
  },
  {
    slug: "burn-fluid-resuscitation-parkland-nclex",
    title: "Burn Fluid Resuscitation & Parkland",
    seoTitle: "Burn Fluid Resuscitation and Parkland Formula | NCLEX-RN | NurseNest",
    hook: "oliguria 3 hours into resuscitation after 40% TBSA scald",
    exam: "Nurse role is **I&O**, **hourly UOP reporting**, **second large-bore IV**, **warming**, not independent **fluid rate prescription**—escalate inadequate endpoints per protocol.",
    bullets: `- **Lactate** and **mental status** as perfusion adjuncts when shown.
- **Avoid hypotonic** fluids for burn shock resuscitation themes in teaching items.
- **Document** TBSA and times for transfer to burn center when indicated.`,
  },
  {
    slug: "burn-airway-smoke-inhalation-nclex",
    title: "Burn Airway Injury & Smoke Inhalation",
    seoTitle: "Burn Airway Injury and Smoke Inhalation | NCLEX-RN | NurseNest",
    hook: "soot in nares with hoarseness after closed-space fire",
    exam: "**Airway first**—continuous monitoring, **high-flow oxygen** when ordered, **avoid PO**, prepare for advanced airway; consider **carbon monoxide** exposure themes with confusion and cherry-red skin when tested.",
    bullets: `- **Voice changes, stridor, singed facial hair** = escalate urgently.
- **Pulse ox** pitfalls with CO—follow ABG/co-oximetry cues in stem.
- **Psychosocial**: calm presence while rapid interventions proceed.`,
  },
  {
    slug: "burn-wound-care-infection-prevention-nclex",
    title: "Burn Wound Care & Infection Prevention",
    seoTitle: "Burn Wound Care and Infection Prevention | NCLEX-RN | NurseNest",
    hook: "new green drainage on post-burn day 5",
    exam: "**Aseptic technique**, **culturing per orders**, **isolation** when indicated, and **temperature spikes**—tie to **sepsis** vigilance in large burns.",
    bullets: `- **Hypothermia prevention** during dressing changes—warm room, warmed fluids per orders.
- **Pain premedication** before painful dressing changes when ordered.
- **Nutrition** support for healing—high caloric/protein needs when stem addresses metabolism.`,
  },
  {
    slug: "burn-pain-management-nursing-nclex",
    title: "Burn Pain Management",
    seoTitle: "Burn Pain Management | NCLEX-RN | NurseNest",
    hook: "breakthrough pain during hydrotherapy",
    exam: "Expect **multimodal** regimens, **anxiety reduction**, **procedure timing** with analgesia, and **respiratory monitoring** with opioids—balance comfort with sedation risks.",
    bullets: `- **Anticipatory** pain control for dressing changes.
- **Nonpharmacologic**: distraction, guided imagery within scope.
- **Escalate** inadequate relief using appropriate chain of command.`,
  },
  {
    slug: "electrical-chemical-burns-nclex",
    title: "Electrical & Chemical Burns",
    seoTitle: "Electrical and Chemical Burns | NCLEX-RN | NurseNest",
    hook: "alkali splash to forearm in a factory worker",
    exam: "**Chemical**: **prolonged irrigation** per poison center; **electrical**: **ECG monitoring**, **creatine kinase/rhabdo** themes, **compartment** checks—do not stop at skin-only assessment.",
    bullets: `- **Safety**: scene safety for responders; remove contaminated clothing per protocol.
- **Eye chemical**: irrigation first priorities when ocular stem appears.
- **Electrical**: dysrhythmia surveillance even if skin wound looks small.`,
  },
  {
    slug: "skin-grafts-donor-site-care-nclex",
    title: "Skin Grafts & Donor Site Care",
    seoTitle: "Skin Grafts and Donor Site Care | NCLEX-RN | NurseNest",
    hook: "serous drainage increasing under graft bolster dressing",
    exam: "Protect **graft** from shear and pressure; assess **color**, **cap refill**, **bleeding**; donor site pain and infection signs—notify for **hematoma** under graft when suggested.",
    bullets: `- **Immobilize** grafted area per orders; no dependent dangling if contraindicated.
- **Donor site**: keep clean/dry; watch for infection and delayed healing.
- **Positioning**: frequent small adjustments within restrictions.`,
  },
  {
    slug: "cellulitis-nursing-care-nclex",
    title: "Cellulitis Nursing Care",
    seoTitle: "Cellulitis Nursing Care | NCLEX-RN | NurseNest",
    hook: "rapidly advancing erythema with fever after minor leg abrasion",
    exam: "**Mark borders** with ink for progression, **elevate** extremity when not contraindicated, **antibiotics on time**, **sepsis** monitoring—avoid massage that could spread infection.",
    bullets: `- **Pain and systemic symptoms** trended objectively.
- **Limb**: neurovascular checks if swelling threatens compartment when stem suggests.
- **Teaching**: recognize return for streaking, fever, or worsening pain.`,
  },
  {
    slug: "mrsa-skin-infection-precautions-nclex",
    title: "MRSA Skin Infection Precautions",
    seoTitle: "MRSA Skin Infection Precautions | NCLEX-RN | NurseNest",
    hook: "draining abscess placed on contact precautions",
    exam: "Apply **contact precautions** per policy, **hand hygiene**, **wound dressing** containment, and **teaching** on **decolonization** only when ordered—avoid stigmatizing language while maintaining safety.",
    bullets: `- **Linen** and **equipment** cleaning per protocol.
- **Athletic/community** MRSA teaching for recurrent boils when stem context fits.
- **Adherence**: complete antibiotic courses when ordered—side effect monitoring.`,
  },
  {
    slug: "herpes-zoster-nursing-care-nclex",
    title: "Herpes Zoster Nursing Care",
    seoTitle: "Herpes Zoster Nursing Care | NCLEX-RN | NurseNest",
    hook: "vesicular rash in a T4 dermatome band",
    exam: "**Airborne/contact** isolation until lesions crusted per policy; **antiviral timing**; **ophthalmic** urgency when **nose tip** or **V1** distribution—protect vision.",
    bullets: `- **Pain**: neuropathic regimens as ordered; assess effectiveness.
- **Post-herpetic neuralgia** prevention themes when stem addresses early treatment.
- **Immunocompromised**: disseminated risk—monitor systemic symptoms.`,
  },
  {
    slug: "scabies-lice-infection-control-nclex",
    title: "Scabies & Lice Infection Control",
    seoTitle: "Scabies and Lice Infection Control | NCLEX-RN | NurseNest",
    hook: "intense nocturnal itching in a long-term care resident",
    exam: "**Contact precautions**, **treat close contacts** per public health guidance, **environmental cleaning**, and **topical permethrin/lindane alternatives** per orders—teach completion of full application.",
    bullets: `- **Linens**: hot wash/dry per protocol; bag contaminated items as directed.
- **Norwegian crusted scabies** in immunocompromised—highly contagious; strict isolation themes.
- **School/work** return criteria per local guidance when tested.`,
  },
  {
    slug: "contact-dermatitis-allergic-skin-reactions-nclex",
    title: "Contact Dermatitis & Allergic Skin Reactions",
    seoTitle: "Contact Dermatitis and Allergic Skin Reactions | NCLEX-RN | NurseNest",
    hook: "linear vesicles after poison ivy exposure",
    exam: "Remove **offending agent**, **gentle cleansing**, **topical steroids** per orders, **antihistamines** for itch; escalate if **angioedema** or **respiratory** involvement suggests anaphylaxis pathway.",
    bullets: `- **Latex allergy** in surgical clients—substitute supplies proactively.
- **Nickel/adhesive** allergies—education on avoidance.
- **Patch testing** referral themes for chronic contact dermatitis when stable.`,
  },
  {
    slug: "psoriasis-eczema-nursing-care-nclex",
    title: "Psoriasis & Eczema Nursing Care",
    seoTitle: "Psoriasis and Eczema Nursing Care | NCLEX-RN | NurseNest",
    hook: "erythrodermic psoriasis with temperature dysregulation",
    exam: "Stabilize **thermoregulation**, **fluid balance**, and **infection surveillance** in erythroderma; for atopic dermatitis focus **barrier repair**, **trigger avoidance**, and **infection** in excoriated skin.",
    bullets: `- **Biologic safety**: infection screening themes when stem mentions immunomodulators.
- **Topicals**: amount and frequency teaching; skin thinning with potent steroids when tested.
- **Mental health**: visible skin disease impacts—supportive communication.`,
  },
  {
    slug: "stevens-johnson-syndrome-tens-nclex",
    title: "Stevens-Johnson Syndrome & TEN",
    seoTitle: "Stevens-Johnson Syndrome and Toxic Epidermal Necrolysis | NCLEX-RN | NurseNest",
    hook: "mucosal sloughing with target lesions after new antibiotic",
    exam: "**Medical emergency**: discontinue **suspect drug** per orders, **strict infection prevention**, **fluid/electrolyte** monitoring, **ophthalmology** involvement, **no adhesive** on fragile skin—ICU-level themes.",
    bullets: `- **Airway** if oral airway swelling; **pain** is severe—advocate for multimodal plan.
- **Wound care**: similar burn nursing principles; maintain warmth.
- **Psychosocial**: body image and fear—therapeutic presence.`,
  },
  {
    slug: "melanoma-skin-cancer-warning-signs-nclex",
    title: "Melanoma & Skin Cancer Warning Signs",
    seoTitle: "Melanoma and Skin Cancer Warning Signs | NCLEX-RN | NurseNest",
    hook: "asymmetric dark lesion with irregular borders enlarging over months",
    exam: "**ABCDE** mnemonic, **sun protection** teaching, **self-skin checks**, and **prompt biopsy referral** language—distinguish benign nevus stability from progression.",
    bullets: `- **Actinic keratosis** vs melanoma—different surveillance messages when stem fits.
- **Teach** hat, sunscreen, shade—Canada-friendly UV messaging without implying one province’s program replaces care access.
- **Support** anxiety while awaiting dermatology evaluation.`,
  },
  {
    slug: "which-wound-care-patient-unstable-nclex",
    title: "Which Wound Care Patient Is Unstable?",
    seoTitle: "Which Wound Care Patient Is Unstable? | NCLEX-RN | NurseNest",
    hook: "four clients including one with circumferential leg burn and weak pulses",
    exam: "Pick **airway compromise**, **evisceration**, **septic shock from cellulitis**, **compartment/circumferential burn**, **electrical dysrhythmia risk**, or **SJS/TEN** over stable dressing changes.",
    bullets: `- **Circumferential burns** with vascular compromise → escalate for escharotomy evaluation per policy.
- **Spreading infection + hypotension** beats chronic wound teaching.
- **New confusion + fever** in wound patient → sepsis mindset.`,
  },
  {
    slug: "burn-priority-first-actions-nclex",
    title: "Burn Priority: What Do You Do First?",
    seoTitle: "Burn Priority Questions: What Do You Do First? | NCLEX-RN | NurseNest",
    hook: "facial burn with voice change in the ED triage line",
    exam: "Sequence **airway assessment**, **oxygen**, **remove from source**, **cool small burns briefly** without **hypothermia** in large burns, **IV access**, **monitoring**—not topical antibiotic as first when airway risk exists.",
    bullets: `- **Chemical eye** splash → irrigation priority in that stem variant.
- **Electrical** → cardiac monitoring early.
- **Environmental**: stop burning process safely for nurse and client.`,
  },
  {
    slug: "integumentary-priority-first-actions-nclex",
    title: "Integumentary Priority: What Do You Do First?",
    seoTitle: "Integumentary Priority Questions: What Do You Do First? | NCLEX-RN | NurseNest",
    hook: "stem lists competing tasks for multiple skin/wound clients",
    exam: "Use **life-threat triage**: **SJS/TEN deterioration**, **sepsis**, **evisceration**, **necrotizing infection**, **compartment syndrome**, **airway burn injury** before routine wound teaching or paperwork.",
    bullets: `- **Assess → protect → notify → intervene within scope** is the default sequence.
- **Eliminate** answers that delay assessment or delegate RN judgment inappropriately.
- **Pair vitals** with wound findings before comfort-only measures.`,
  },
];

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may use **metric** units and provincial wording; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly practice framing (SI measures where shown, interprofessional norms). Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **unstable vs stable**, **delegation**, and **first action** sequencing.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const displayTopic = "Integumentary & Wound Care";
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${displayTopic}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${displayTopic}) links skin and wound findings to safe nursing judgment: prevent pressure and moisture injury, support healing, recognize infection and burn emergencies, and escalate when red flags cluster.

${intro}

**Learning objectives**
- Integrate **inspection, risk factors, and vitals** to identify priority threats.
- Select **nursing interventions and teaching** aligned with orders, scope, and policy.
- Communicate **early** when findings suggest **sepsis**, **airway compromise**, **compartment risk**, or **surgical emergency**.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip assessment**, **delay escalation** when data show risk, or **delegate** RN-level clinical judgment inappropriately. Boards often use “first,” “priority,” or “most important” language—choose the option that **reduces harm fastest** for the deteriorating client.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Airway or inhalation injury**, **stridor**, **facial burns**, **soot** → emergency airway pathway when clustered.
- **Evisceration**, **necrotizing infection**, **rapidly spreading cellulitis**, **SJS/TEN** → urgent escalation and high-acuity monitoring themes.
- **Circumferential burns**, **compartment pain**, **pulselessness** → vascular compromise until ruled out.

**Patient teaching (stable contexts)**
- Teach **wound/skin self-checks**, **dressing steps**, **signs to call** (fever, spreading redness, pus, new numbness, wound opening, uncontrolled pain).
- Reinforce **nutrition**, **glycemic control**, **smoking cessation**, and **offloading/compression** only as ordered and when contraindications are cleared in the stem.

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid “nice to do” tasks when a life threat is present.
- When multiple clients compete, pick the client who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** An adult client on your unit has integumentary changes related to **${def.hook}**. You pair **wound and surrounding skin assessment** with **vitals and labs** when provided, protect the area from further trauma, maintain **infection prevention**, and **notify the provider** when urgent criteria are met.

**Clinical application:** You compare competing tasks. The correct “first” action closes the **highest-risk gap**—usually focused reassessment plus escalation for **sepsis**, **airway compromise**, **compartment concerns**, or **surgical wound catastrophe**—rather than routine documentation alone.

**Exam fork:** If the stem includes **visceration**, **crepitus**, **new hoarseness after smoke exposure**, **Kussmaul** with infection, or **hypotension with tachycardia** and spreading skin infection, prioritize **emergency pathways** over teaching or comfort-only measures.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **vitals + perfusion + neurovascular checks** to skin and wound findings before routine tasks when risk is rising.
- Use the integumentary topic hub (**\`integumentary\`**) to cluster practice with related lessons.
- Link review: [Burn depth & fluid basics](LESSON:burn-depth-fluid-resuscitation-basics) · [Pressure injury staging](LESSON:pressure-injury-staging) · [Severe dermatitis skin care](LESSON:severe-dermatitis-skin-care) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: displayTopic,
    topicSlug: "integumentary",
    bodySystem: "Integumentary",
    previewSectionCount: 1,
    seoTitle: def.seoTitle,
    seoDescription,
    sections: [
      { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: clinical_meaning },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: exam_relevance },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: core_concept },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: clinical_scenario },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
    ],
  };
}

const pathways = {
  "ca-rn-nclex-rn": DEFS.map((d) => buildLesson(d, "ca-rn-nclex-rn")),
  "us-rn-nclex-rn": DEFS.map((d) => buildLesson(d, "us-rn-nclex-rn")),
};

const out = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-rn-integumentary-wound-care-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons × 2 pathways)`);
