/**
 * **Authoring base** for NP immunization, vaccine safety, and travel medicine lessons.
 * Centralizes schedule logic, jurisdiction notes, and travel tables so gold lessons import one spine
 * (avoids duplicating long clinical blocks across files). Replace or extend when source PDFs are attached.
 */

/** US-oriented routine schedule *principles* (not date-by-date dosing tables — those change). */
export const NP_CONTENT_ACIP_SCHEDULE_PRINCIPLES = `**Routine immunization (US / ACIP-style exam logic)**  
Items reward **age windows**, **minimum intervals**, **live-virus spacing**, **catch-up** when behind, and **documentation** (vaccine, lot, site, route, VIS acknowledgment when applicable). Know **contraindications vs precautions**: only **true contraindications** should refuse; precautions imply **risk–benefit** and often **observe** or **defer** rather than permanent refusal.

**Combination products**  
When the stem offers **combo vaccines**, choose answers that **reduce injections** without violating **minimum intervals** or **live-virus rules**.

**Pregnancy & immunization**  
**Inactivated** vaccines may be indicated in pregnancy when benefits outweigh risks per guideline (e.g., **influenza**, **Tdap** each pregnancy); **live vaccines** are generally **avoided** in pregnancy unless the vignette defines exceptional circumstances—read the stem’s gestational context.

**Immunocompromise**  
**Live vaccines** are typically **contraindicated** in **severe immunosuppression**; **inactivated** schedules may continue with specialist coordination when the stem describes **stable HIV**, **asplenia**, or **complement deficiency** plans.`;

/** Canada NP / CNPLE-oriented notes (NACI-style principles; provinces implement schedules). */
export const NP_CONTENT_NACI_CANADA_NOTES = `**Canadian scheduling context (NP / CNPLE-aligned)**  
**NACI** recommendations inform federal guidance; **provincial/territorial** programs may differ in **delivery**, **school requirements**, and **publicly funded age cutoffs**. Exam items still test **principles**: **series completion**, **catch-up**, **minimum intervals**, **live vs inactivated**, **pregnancy**, and **immunocompromised** planning—translate **brand names** and **schedule tables** into **risk-appropriate decisions**.

**Documentation & consent**  
Canadian stems may emphasize **informed consent**, **guardian authority**, and **school/child-care documentation**—choose answers that **respect capacity** and **collaborative** primary-care models.`;

/** Vaccine safety & program operations (exam-level). */
export const NP_CONTENT_VACCINE_SAFETY_PROGRAM = `**Cold chain & handling**  
Vaccines lose potency with **temperature excursions**—items test whether you **discard** versus **use** per policy, **document**, and **replace** stock safely.

**Anaphylaxis readiness**  
**Epinephrine** and **observation interval** after vaccination when **history** or **allergy** risk appears—do not send high-risk patients away without a plan.

**Egg allergy & vaccines**  
Modern **influenza** recommendations for people with **egg allergy** are often permissive with **observation**—follow the **stem’s guideline era** and **severity** cues; do not automatically refuse all egg-allergic patients for all vaccines.

**Guillain–Barré history**  
Certain vaccines carry **precaution** histories—match **temporal association** in the vignette and **current guidance** rather than blanket refusal unless the stem defines it.

**Simultaneous administration**  
Generally acceptable when **not contraindicated**—items may test **live-virus** spacing when **not** given simultaneously.`;

/** Travel: pre-travel consult building blocks (not a substitute for country-specific CDC CAT pages). */
export const NP_CONTENT_TRAVEL_PRETRAVEL_TABLE = `**Trip risk stratification**  
Integrate **destination** (urban vs rural), **duration**, **season**, **accommodation** (air-conditioned vs open), **activities** (animal exposure, freshwater, sexual health), and **baseline health** (pregnancy, asplenia, HIV, biologics).

**Vaccine-preventable travel examples (principle-level)**  
• **Hepatitis A** — fecal–oral risk; many travelers to endemic regions benefit.  
• **Typhoid** — enteric fever risk in many low-resource settings; oral vs IM per regimen and time-to-travel in stem.  
• **Yellow fever** — **proof of vaccination** may be **legally required** for entry to some countries; **live vaccine** — contraindications include **thymus disease history**, some **immunosuppression**, and **pregnancy**—match stem.  
• **Japanese encephalitis** — risk mainly certain **rural Asia/Pacific** itineraries.  
• **Meningococcal** — **Hajj/Umrah** and **sub-Saharan meningitis belt** during dry season—follow vignette.  
• **Rabies pre-exposure** — long-stay, animal work, remote access to care—cost/benefit counseling.

**Malaria chemoprophylaxis (exam logic)**  
Choose **regimen matching species/resistance region**, **renal/hepatic** adjustments, **drug interactions** (e.g., QT, anticoagulants), **adherence** (daily vs weekly), and **on-arrival vs pre-travel** start rules implied by the stem—**no prophylaxis** is wrong when stem describes **high Plasmodium falciparum** risk without contraindication.

**Diarrhea & travelers’ health**  
**Food/water precautions**, **oral rehydration**, **when antibiotics are/aren’t indicated**, and **fever in returned traveler** as possible **malaria** until proven otherwise in endemic exposure stems.

**Post-travel fever**  
**Malaria** in the differential for relevant geography; **dengue**, **typhoid**, **viral syndromes**—items test **timely testing** and **avoiding false reassurance**.`;
