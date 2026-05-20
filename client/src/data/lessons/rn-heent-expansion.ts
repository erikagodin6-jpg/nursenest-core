import type { LessonContent } from "./types";

export const rnHeentExpansionLessons: Record<string, LessonContent> = {
  "epistaxis-management-rn": {
    title: "Epistaxis: Assessment & Hemorrhage Control",
    cellular: {
      title: "Nasal Vascular Anatomy and Epistaxis Pathophysiology",
      content: "Epistaxis occurs from rupture of blood vessels within the richly vascular nasal mucosa. Anterior epistaxis (90% of cases) originates from Kiesselbach plexus (Little's area) on the anterior nasal septum, where branches of the anterior ethmoidal, sphenopalatine, greater palatine, and superior labial arteries anastomose. The thin mucosal layer over this vascular plexus is vulnerable to drying, trauma, and inflammation. Posterior epistaxis (10%) arises from branches of the sphenopalatine artery in the posterior nasal cavity and is more dangerous due to higher-pressure arterial bleeding that may not be visible anteriorly, instead flowing down the posterior pharynx causing aspiration risk. Hypertension contributes to epistaxis severity by increasing arterial pressure against weakened vessel walls, though it more commonly prolongs bleeding than initiates it. Coagulopathy from anticoagulant therapy, liver disease, or platelet disorders impairs clot formation at the bleeding site. Hereditary hemorrhagic telangiectasia (Osler-Weber-Rendu syndrome) causes arteriovenous malformations in the nasal mucosa, leading to recurrent, difficult-to-control epistaxis."
    },
    riskFactors: [
      "Dry air exposure causing mucosal desiccation and cracking",
      "Digital trauma (nose picking), especially in children",
      "Anticoagulant and antiplatelet therapy (warfarin, aspirin, clopidogrel)",
      "Hypertension (prolongs bleeding, may not initiate)",
      "Nasal septal deviation or perforation",
      "Coagulopathies: von Willebrand disease, hemophilia, liver disease",
      "Hereditary hemorrhagic telangiectasia (HHT/Osler-Weber-Rendu)",
      "Topical nasal corticosteroid or decongestant spray overuse"
    ],
    diagnostics: [
      "Identify bleeding source: anterior (visible on inspection) vs posterior (blood in oropharynx)",
      "Assess hemodynamic stability: BP, HR, orthostatic vital signs",
      "CBC to assess hemoglobin/hematocrit if significant blood loss",
      "Coagulation studies: PT/INR, PTT if on anticoagulants or suspected coagulopathy",
      "Type and screen if severe hemorrhage with hemodynamic instability",
      "Nasal endoscopy for recurrent or posterior epistaxis to identify source"
    ],
    management: [
      "Anterior epistaxis: direct pressure (pinch nostrils together) for 10-15 continuous minutes leaning forward",
      "Chemical cautery with silver nitrate to visible bleeding vessel after bleeding controlled",
      "Anterior nasal packing with absorbable gelatin, oxidized cellulose, or non-absorbable ribbon gauze",
      "Posterior epistaxis: posterior nasal packing, balloon catheter (Epistat), or surgical intervention",
      "Correct coagulopathy: vitamin K for warfarin reversal, platelet transfusion, DDAVP for von Willebrand disease",
      "Interventional radiology embolization for refractory posterior epistaxis"
    ],
    nursingActions: [
      "Position patient upright leaning forward to prevent aspiration of blood",
      "Apply continuous bilateral nostril pressure (pinch soft part of nose) for 10-15 minutes without releasing",
      "Provide an emesis basin and encourage patient to spit out blood rather than swallow",
      "Monitor for signs of airway compromise: stridor, difficulty breathing, blood in oropharynx",
      "Apply ice pack to bridge of nose (vasoconstriction)",
      "Monitor vital signs and hemodynamic status with significant bleeding",
      "Assess for posterior bleeding: blood visible in posterior pharynx despite anterior pressure",
      "Educate on prevention: humidification, saline nasal spray, avoid nose picking, sneeze with mouth open"
    ],
    assessmentFindings: [
      "Active bleeding from one or both nares",
      "Blood visible in posterior pharynx (posterior epistaxis)",
      "Tachycardia and hypotension with significant blood loss",
      "Anxiety and restlessness from blood loss or fear",
      "Nausea from swallowed blood"
    ],
    signs: {
      left: [
        "Anterior bleeding: visible from nares",
        "Posterior bleeding: blood in oropharynx",
        "Blood-tinged sputum from drainage",
        "Nausea from swallowed blood"
      ],
      right: [
        "Hypovolemia: tachycardia, hypotension, pallor",
        "Airway compromise: stridor, cough, aspiration",
        "Recurrent epistaxis suggesting coagulopathy or HHT",
        "Pack displacement: renewed hemorrhage"
      ]
    },
    medications: [
      { name: "Oxymetazoline (Afrin)", type: "Topical Nasal Decongestant", action: "Alpha-adrenergic agonist causing vasoconstriction of nasal mucosal blood vessels to reduce bleeding", sideEffects: "Rebound congestion (rhinitis medicamentosa) with >3 days use, local stinging", contra: "MAO inhibitor use, severe cardiovascular disease", pearl: "Spray into affected nostril, then apply digital pressure. Effective first-line adjunct for anterior epistaxis. Limit to 3 days maximum to avoid rebound." },
      { name: "Tranexamic Acid", type: "Antifibrinolytic", action: "Inhibits plasminogen activation to stabilize clot at bleeding site. Used topically (soaked gauze) or IV for severe epistaxis", sideEffects: "Nausea, diarrhea, thromboembolic events (rare)", contra: "Active thromboembolic disease, DIC with fibrinolysis", pearl: "Topical application (soak gauze in 500mg/5mL solution) is increasingly used for anterior epistaxis. IV form for severe hemorrhage. Contraindicated with factor IX complex concentrates." }
    ],
    pearls: [
      "Lean FORWARD, not backward—tilting the head back causes blood to flow posteriorly, increasing aspiration risk and swallowing blood",
      "10-15 minutes of CONTINUOUS pressure without peeking is essential—releasing early disrupts clot formation",
      "Posterior epistaxis is a potential airway emergency—position the patient upright and prepare for definitive airway management",
      "Patients on anticoagulants with epistaxis need INR checked—reversal may be necessary for severe bleeding",
      "Recurrent epistaxis in children is usually anterior (Kiesselbach plexus) from nose picking or dry air—humidification and petroleum jelly to septum prevent recurrence"
    ],
    quiz: [
      { question: "A patient presents with active anterior nosebleed. What position should the nurse place the patient in?", options: ["Supine with head tilted back", "Sitting upright leaning forward", "Trendelenburg position", "Side-lying with affected nare up"], correct: 1, rationale: "Sitting upright leaning forward prevents blood from flowing down the posterior pharynx, reducing aspiration risk and allowing blood to drain from the nares into an emesis basin." },
      { question: "A patient with bilateral nasal packing reports difficulty breathing through the mouth and has blood visible in the posterior pharynx. What should the nurse do?", options: ["Reassure the patient this is normal", "Remove the nasal packing immediately", "Notify the provider immediately—suspect pack displacement or posterior bleeding", "Suction the oropharynx and continue monitoring"], correct: 2, rationale: "Blood in the posterior pharynx despite nasal packing suggests posterior bleeding or pack displacement. This is a potential airway emergency requiring immediate provider notification." },
      { question: "When applying direct pressure for anterior epistaxis, the nurse should:", options: ["Pinch the bony bridge of the nose for 5 minutes", "Pinch the soft part of the nose for 10-15 continuous minutes", "Insert gauze first, then apply pressure for 2 minutes", "Apply pressure to one nostril at a time, alternating every 5 minutes"], correct: 1, rationale: "Direct pressure is applied to the soft (cartilaginous) part of the nose (where Kiesselbach plexus is located) for 10-15 continuous minutes without releasing to allow clot formation." }
    ]
  },

  "acute-glaucoma-rn": {
    title: "Acute Angle-Closure Glaucoma: Emergency Assessment",
    cellular: {
      title: "Pathophysiology of Acute Angle-Closure Glaucoma",
      content: "Acute angle-closure glaucoma (AACG) is an ophthalmic emergency caused by sudden obstruction of aqueous humor outflow from the anterior chamber. Aqueous humor is continuously produced by the ciliary body epithelium at approximately 2-3 μL/minute and flows from the posterior chamber through the pupil into the anterior chamber, draining through the trabecular meshwork and Schlemm canal at the iridocorneal angle. In angle closure, the peripheral iris physically occludes the trabecular meshwork, preventing aqueous outflow. This most commonly occurs when the lens pushes the iris forward (pupillary block), which is precipitated by mid-dilation of the pupil (dim lighting, anticholinergic medications, sympathomimetic agents). Intraocular pressure (IOP) rapidly rises from the normal range of 10-21 mmHg to 40-80+ mmHg. The elevated pressure compresses the optic nerve head and retinal ganglion cell axons at the lamina cribrosa, causing ischemic damage. Corneal endothelial cell dysfunction from elevated IOP results in corneal edema, producing the characteristic halo effect around lights. Without emergent treatment, permanent optic nerve damage and blindness occur within hours."
    },
    riskFactors: [
      "Anatomically narrow anterior chamber angle (hyperopic/farsighted eyes, small eyes)",
      "Age over 60 years (lens thickening pushes iris forward)",
      "Female sex (2-4x higher risk due to smaller anterior segment anatomy)",
      "Asian and Inuit descent (shallower anterior chambers)",
      "Anticholinergic medications: atropine, scopolamine, antihistamines, TCAs",
      "Sympathomimetic agents: phenylephrine eye drops, nasal decongestants",
      "Dim lighting causing pupil dilation",
      "Family history of angle-closure glaucoma"
    ],
    diagnostics: [
      "Measure intraocular pressure (IOP) with tonometry: typically 40-80+ mmHg (normal 10-21 mmHg)",
      "Slit-lamp examination revealing shallow anterior chamber, corneal edema, mid-dilated fixed pupil",
      "Gonioscopy to confirm closed angle (not performed during acute attack, done post-treatment)",
      "Assess visual acuity: dramatically reduced in affected eye",
      "Examine for ciliary injection (perilimbal redness) and conjunctival hyperemia",
      "Fundoscopy to assess optic nerve for cupping and edema"
    ],
    management: [
      "Emergency IOP reduction: topical timolol 0.5%, pilocarpine 2%, apraclonidine 1%",
      "Systemic IOP reduction: acetazolamide 500mg IV, mannitol 1-2 g/kg IV for refractory cases",
      "Definitive treatment: laser peripheral iridotomy (LPI) creates an alternative drainage pathway",
      "Prophylactic LPI on contralateral eye (high risk of bilateral occurrence)",
      "Antiemetics for nausea and vomiting associated with vagal response",
      "Analgesics for severe pain management"
    ],
    nursingActions: [
      "Recognize as ophthalmic emergency: severe eye pain + halos + nausea/vomiting = suspect AACG",
      "Administer prescribed topical and systemic IOP-lowering medications rapidly",
      "Monitor for systemic effects of medications: timolol (bradycardia, bronchospasm), acetazolamide (metabolic acidosis, hypokalemia)",
      "Position patient supine to allow lens to fall posteriorly, opening the angle",
      "Provide dark, quiet environment to reduce stimulation",
      "Assess bilateral visual acuity and pupil response to document baseline and track changes",
      "Educate patient on medication compliance and avoid triggers: anticholinergics, dim environments",
      "Prepare patient for laser peripheral iridotomy procedure"
    ],
    assessmentFindings: [
      "Sudden onset severe unilateral eye pain",
      "Blurred vision with halos around lights",
      "Nausea and vomiting (vagal response to pain)",
      "Mid-dilated fixed pupil that does not react to light",
      "Red eye with ciliary injection (perilimbal flush)",
      "Hard eyeball on palpation compared to unaffected side",
      "Corneal cloudiness (edema)"
    ],
    signs: {
      left: [
        "Severe unilateral eye pain (acute onset)",
        "Halos around lights and blurred vision",
        "Mid-dilated fixed pupil",
        "Ciliary injection (perilimbal redness)"
      ],
      right: [
        "IOP >40 mmHg (emergency)",
        "Nausea, vomiting, diaphoresis (vagal)",
        "Corneal edema and clouding",
        "Permanent vision loss if untreated within hours"
      ]
    },
    medications: [
      { name: "Pilocarpine 2%", type: "Cholinergic Miotic", action: "Contracts ciliary muscle and constricts pupil (miosis), pulling iris away from trabecular meshwork to open drainage angle", sideEffects: "Brow ache, blurred vision, miosis reducing night vision, accommodative spasm", contra: "Active uveitis, posterior synechiae, neovascular glaucoma", pearl: "Apply one drop every 15 minutes for 2 doses. Will NOT work until IOP begins to decrease—the iris sphincter is ischemic at very high pressures. Give systemic agents first." },
      { name: "Acetazolamide IV", type: "Carbonic Anhydrase Inhibitor", action: "Inhibits carbonic anhydrase in the ciliary body, reducing aqueous humor production by up to 50%, lowering IOP", sideEffects: "Metabolic acidosis, hypokalemia, paresthesias, kidney stones (rare)", contra: "Severe hepatic/renal disease, sulfonamide allergy, hypokalemia, sickle cell disease", pearl: "Give 500mg IV stat for acute angle-closure emergency. Onset 2 minutes IV, peak effect 15-30 minutes. Monitor potassium levels. Oral maintenance may follow." }
    ],
    pearls: [
      "Acute angle-closure glaucoma is an EMERGENCY—permanent vision loss occurs within hours without treatment",
      "Classic presentation triad: severe eye pain + halos around lights + nausea/vomiting—the nausea can mimic abdominal pathology, causing misdiagnosis",
      "A mid-dilated fixed pupil with a red, hard eye is the hallmark finding—compare firmness to contralateral eye by gentle palpation",
      "Anticholinergic medications are the most common iatrogenic trigger—review medication list for atropine, scopolamine, antihistamines, TCAs",
      "NEVER dilate the pupil of a patient with suspected angle-closure glaucoma—this worsens the attack"
    ],
    quiz: [
      { question: "A patient presents with sudden onset right eye pain, seeing halos around lights, nausea, and a mid-dilated pupil. What does the nurse suspect?", options: ["Conjunctivitis", "Acute angle-closure glaucoma", "Retinal detachment", "Corneal abrasion"], correct: 1, rationale: "The triad of sudden severe eye pain, halos around lights, and nausea/vomiting with a mid-dilated fixed pupil is classic for acute angle-closure glaucoma, an ophthalmic emergency." },
      { question: "Which medication class should be AVOIDED in a patient with a history of narrow-angle glaucoma?", options: ["NSAIDs", "Anticholinergics (atropine, antihistamines)", "ACE inhibitors", "Beta-blockers"], correct: 1, rationale: "Anticholinergic medications cause pupil dilation (mydriasis), which can precipitate angle closure in patients with narrow angles by pushing the peripheral iris against the trabecular meshwork." },
      { question: "The nurse is administering pilocarpine drops for acute angle-closure glaucoma. IOP is still 65 mmHg. Why might pilocarpine not be working?", options: ["The medication is expired", "At very high IOP, the iris sphincter muscle is ischemic and cannot respond until IOP begins to decrease with systemic agents", "Pilocarpine only works in open-angle glaucoma", "The drops need to be refrigerated first"], correct: 1, rationale: "When IOP is extremely high (>50-60 mmHg), the iris sphincter muscle is ischemic and paralyzed. Pilocarpine will not be effective until systemic agents (acetazolamide, mannitol) begin to reduce IOP." }
    ]
  },

  "peritonsillar-abscess-rn": {
    title: "Peritonsillar Abscess: Assessment & Management",
    cellular: {
      title: "Peritonsillar Abscess Pathophysiology",
      content: "Peritonsillar abscess (PTA), also known as quinsy, is the most common deep space infection of the head and neck. It develops when acute tonsillitis or pharyngitis progresses beyond the tonsillar capsule into the peritonsillar space between the palatine tonsil and the superior pharyngeal constrictor muscle. Group A Streptococcus (Streptococcus pyogenes) is the most common causative organism, though polymicrobial infections with anaerobes (Fusobacterium, Prevotella, Peptostreptococcus) are frequent. The infection begins as peritonsillar cellulitis, with bacterial invasion causing edema, tissue necrosis, and purulent collection forming an encapsulated abscess. The abscess typically forms at the superior pole of the tonsil between the tonsillar capsule and the palatopharyngeus muscle. Progressive swelling causes uvular deviation to the contralateral side, trismus (restricted jaw opening) from inflammation of the pterygoid muscles, and potential airway compromise. Complications include extension to the parapharyngeal and retropharyngeal spaces, internal jugular vein thrombophlebitis (Lemierre syndrome), and aspiration of abscess contents."
    },
    riskFactors: [
      "Recurrent or undertreated tonsillitis (Group A Strep)",
      "Smoking and tobacco use (impairs local immune defense)",
      "Poor dental hygiene and periodontal disease",
      "Immunosuppression: diabetes, HIV, chemotherapy",
      "Young adults (15-35 years) most commonly affected",
      "Prior peritonsillar abscess (recurrence rate 10-15%)",
      "Mononucleosis (EBV) with tonsillar enlargement"
    ],
    diagnostics: [
      "Clinical diagnosis: unilateral tonsillar swelling with uvular deviation, trismus, muffled voice",
      "CT neck with contrast to confirm abscess vs cellulitis and evaluate deep space extension",
      "Intra-oral ultrasound to identify fluid collection and guide aspiration",
      "CBC: leukocytosis with left shift",
      "Monospot or EBV titers to exclude mononucleosis",
      "Rapid strep test and throat culture",
      "Blood cultures if sepsis suspected"
    ],
    management: [
      "Needle aspiration or incision and drainage (I&D) of abscess by ENT specialist",
      "IV antibiotics: ampicillin-sulbactam or clindamycin for penicillin allergy",
      "IV fluids for rehydration (patients often severely dehydrated from inability to swallow)",
      "Pain management: IV analgesics, topical anesthetics, medicated gargles",
      "Tonsillectomy: consider interval tonsillectomy for recurrent PTA",
      "Monitor airway closely—have emergency airway equipment readily available"
    ],
    nursingActions: [
      "Prioritize airway assessment: monitor for signs of obstruction (stridor, drooling, inability to handle secretions)",
      "Position patient upright to facilitate drainage and reduce aspiration risk",
      "Administer IV antibiotics as prescribed and monitor for allergic reactions",
      "Provide IV fluid replacement—patients are often dehydrated from inability to swallow",
      "Assess pain and administer analgesics: severe odynophagia may require IV opioids initially",
      "Monitor temperature and WBC trending for treatment response",
      "Educate on follow-up care: complete antibiotic course, signs of recurrence",
      "Prepare for needle aspiration or I&D: position, suction, and emergency airway equipment at bedside"
    ],
    assessmentFindings: [
      "Severe unilateral sore throat with referred otalgia (ear pain)",
      "Trismus: inability to open mouth fully",
      "Muffled 'hot potato' voice",
      "Drooling due to inability to swallow secretions",
      "Uvular deviation away from affected side",
      "Fever and malaise",
      "Cervical lymphadenopathy, especially jugulodigastric node"
    ],
    signs: {
      left: [
        "Unilateral tonsillar swelling and erythema",
        "Uvular deviation to contralateral side",
        "Trismus (limited jaw opening)",
        "Muffled 'hot potato' voice"
      ],
      right: [
        "Airway compromise: stridor, respiratory distress",
        "Sepsis: fever, tachycardia, hypotension",
        "Lemierre syndrome: neck pain, spiking fevers, septic emboli",
        "Parapharyngeal space extension requiring surgical drainage"
      ]
    },
    medications: [
      { name: "Ampicillin-Sulbactam (Unasyn)", type: "Beta-lactam/Beta-lactamase Inhibitor", action: "Broad-spectrum coverage against streptococci, staphylococci, and anaerobes. First-line IV antibiotic for peritonsillar abscess", sideEffects: "Diarrhea, rash, allergic reaction, C. diff risk", contra: "Penicillin anaphylaxis, infectious mononucleosis (ampicillin causes rash)", pearl: "Covers polymicrobial flora of PTA including anaerobes. If penicillin allergic, use clindamycin 600-900mg IV q8h. Rule out mono first—ampicillin causes diffuse maculopapular rash in EBV infection." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces peritonsillar edema and inflammation, improving trismus, pain, and swallowing. Adjunctive therapy alongside antibiotics and drainage", sideEffects: "Hyperglycemia, insomnia, GI irritation", contra: "Uncontrolled diabetes (relative), systemic fungal infection", pearl: "Single dose 10mg IV reduces pain and improves swallowing within hours. Does not impair immune response to the infection when used with appropriate antibiotics. Monitor blood glucose." }
    ],
    pearls: [
      "Airway management is the FIRST priority—have suction, bag-valve-mask, and intubation equipment at bedside",
      "The classic triad is: unilateral sore throat + trismus + muffled 'hot potato' voice",
      "Uvular deviation AWAY from the swollen side helps distinguish PTA from simple tonsillitis",
      "Never give ampicillin without ruling out mononucleosis—it causes a characteristic diffuse rash in EBV infection",
      "Most patients cannot swallow—assess hydration status and start IV fluids early"
    ],
    quiz: [
      { question: "A patient with a severe sore throat has trismus, uvular deviation to the left, and a muffled voice. What does the nurse suspect?", options: ["Bilateral tonsillitis", "Right peritonsillar abscess", "Epiglottitis", "Oral candidiasis"], correct: 1, rationale: "Trismus, muffled voice, and uvular deviation to the left (away from the affected side) are classic findings of a right peritonsillar abscess. The uvula deviates away from the abscess mass." },
      { question: "What is the priority nursing action for a patient with suspected peritonsillar abscess?", options: ["Obtain a throat culture", "Assess and maintain airway patency", "Administer oral antibiotics", "Apply warm compresses to the neck"], correct: 1, rationale: "Airway assessment and maintenance is the first priority because the swelling can obstruct the airway. Emergency airway equipment should be at bedside." },
      { question: "Before administering ampicillin-sulbactam for PTA, the nurse should verify which test result?", options: ["Hepatitis panel", "Monospot or EBV testing", "Blood glucose level", "Serum potassium level"], correct: 1, rationale: "Ampicillin causes a characteristic diffuse maculopapular rash in patients with infectious mononucleosis (EBV). Monospot should be negative before administering ampicillin-containing antibiotics." }
    ]
  },

  "retinal-detachment-rn": {
    title: "Retinal Detachment: Emergency Recognition",
    cellular: {
      title: "Retinal Detachment Pathophysiology",
      content: "Retinal detachment occurs when the neurosensory retina separates from the underlying retinal pigment epithelium (RPE), disrupting photoreceptor nutrition and oxygen supply. The retina's outer segments (rods and cones) depend on the RPE for metabolic support, phagocytosis of shed photoreceptor outer segments, and vitamin A metabolism. Three types exist: rhegmatogenous (most common) occurs when a retinal break allows vitreous fluid to enter the subretinal space, separating the layers—this is often precipitated by posterior vitreous detachment where the vitreous gel separates from the retina, creating traction tears; tractional detachment occurs when fibrovascular proliferative membranes (as in proliferative diabetic retinopathy) pull the retina away from the RPE without a break; exudative detachment results from subretinal fluid accumulation from choroidal tumors, severe hypertension, or inflammatory conditions. Without reattachment, photoreceptor cell death progresses from the periphery toward the macula. If the macula detaches, central vision loss is often permanent even with successful surgical repair, making rapid recognition and intervention critical."
    },
    riskFactors: [
      "High myopia (nearsightedness) with elongated globe and thinner retina",
      "Prior retinal detachment in either eye",
      "Prior cataract surgery (vitreous changes increase risk)",
      "Blunt ocular trauma disrupting vitreoretinal adhesion",
      "Family history of retinal detachment",
      "Lattice degeneration (peripheral retinal thinning)",
      "Proliferative diabetic retinopathy (tractional mechanism)",
      "Age over 50 years (posterior vitreous detachment risk)"
    ],
    diagnostics: [
      "Dilated fundoscopic examination revealing grey, elevated, detached retina",
      "Ultrasound B-scan if direct visualization impaired by vitreous hemorrhage or cataract",
      "Assess visual acuity: peripheral field loss progressing to central vision loss",
      "Amsler grid testing for macular involvement",
      "Optical coherence tomography (OCT) for macular status",
      "Document location and extent of detachment for surgical planning"
    ],
    management: [
      "Surgical emergency: prompt ophthalmology referral (same-day for macula-on detachment)",
      "Pneumatic retinopexy: injection of gas bubble into vitreous cavity with cryopexy or laser",
      "Scleral buckle: silicone band placed around globe to indent sclera against detached retina",
      "Pars plana vitrectomy: vitreous removal, laser photocoagulation, and gas or silicone oil tamponade",
      "Strict positioning post-operatively (often face-down) to keep gas bubble against retinal break",
      "Bilateral patching to minimize eye movement if surgery delayed"
    ],
    nursingActions: [
      "Recognize warning symptoms: sudden increase in floaters, flashes of light, curtain or shadow over visual field",
      "Maintain patient on bedrest with the detachment in a dependent position to allow retina to fall back",
      "If gas bubble placed: maintain prescribed head positioning (usually face-down) for days to weeks",
      "Educate: NO flying until gas bubble absorbs (altitude changes expand the bubble causing dangerous IOP elevation)",
      "Assess visual acuity bilaterally and document changes",
      "Administer prescribed antiemetics to prevent Valsalva from vomiting (increases IOP)",
      "Post-operative: monitor for signs of re-detachment, increased IOP, infection (endophthalmitis)",
      "Provide emotional support for potential vision loss and activity restrictions"
    ],
    assessmentFindings: [
      "Sudden onset of floaters (shadows from vitreous debris or blood)",
      "Photopsia: flashes of light from retinal traction stimulating photoreceptors",
      "Progressive visual field loss described as 'curtain' or 'shadow' moving across vision",
      "Painless process (retina has no pain fibers)",
      "Decreased visual acuity if macula involved"
    ],
    signs: {
      left: [
        "Sudden increase in floaters",
        "Flashes of light (photopsia)",
        "Curtain/shadow across visual field",
        "Painless visual changes"
      ],
      right: [
        "Macula-off detachment: central vision loss",
        "Vitreous hemorrhage: sudden profound vision loss",
        "Re-detachment post-surgery",
        "Post-op endophthalmitis: pain, redness, decreased vision"
      ]
    },
    medications: [
      { name: "Timolol 0.5% (Timoptic)", type: "Beta-Blocker Ophthalmic", action: "Reduces aqueous humor production by blocking beta-2 receptors in ciliary epithelium. Used post-operatively to control IOP", sideEffects: "Bradycardia, bronchospasm, hypotension (systemic absorption), stinging", contra: "Asthma, severe COPD, sinus bradycardia, heart block", pearl: "Apply nasolacrimal occlusion (press inner corner of eye) for 2 minutes after instillation to reduce systemic absorption. Even ophthalmic beta-blockers can cause bronchospasm in asthmatics." },
      { name: "Ondansetron (Zofran)", type: "5-HT3 Receptor Antagonist", action: "Antiemetic to prevent vomiting and associated Valsalva maneuver that increases intraocular pressure", sideEffects: "Headache, constipation, QT prolongation (rare at standard doses)", contra: "Concomitant apomorphine use, severe hepatic impairment", pearl: "Preventing vomiting is critical post-retinal surgery—Valsalva maneuver increases IOP and can disrupt the surgical repair or displace gas bubble. Administer prophylactically." }
    ],
    pearls: [
      "Retinal detachment is PAINLESS—the retina has no pain receptors. The triad is floaters + flashes + curtain/shadow over vision",
      "Macula-ON detachment is a surgical EMERGENCY (within 24 hours)—once the macula detaches, central vision recovery is poor",
      "Post-gas bubble: NO flying and NO nitrous oxide anesthesia until gas absorbs (1-8 weeks depending on gas type)—altitude/N2O expansion of bubble can cause dangerously high IOP",
      "Position the patient with the detachment DEPENDENT—if the detachment is superior, keep the patient upright; if inferior, keep flat",
      "Sudden onset of many floaters with flashes in a myopic patient = retinal detachment until proven otherwise"
    ],
    quiz: [
      { question: "A patient reports suddenly seeing many new floaters, flashing lights, and a dark shadow over the lower part of their vision. What is the priority action?", options: ["Schedule an ophthalmology appointment within the week", "Instruct the patient to rest their eyes and monitor symptoms", "Treat as an ophthalmic emergency—notify ophthalmology immediately", "Administer antihistamine eye drops for allergic conjunctivitis"], correct: 2, rationale: "Sudden floaters, photopsia (flashes), and a progressive visual field curtain are classic retinal detachment symptoms requiring emergent ophthalmology evaluation to preserve vision, especially if the macula is still attached." },
      { question: "A patient has had gas bubble placement for retinal detachment repair. Which activity is contraindicated?", options: ["Watching television", "Sleeping with head elevated", "Air travel", "Using prescribed eye drops"], correct: 2, rationale: "Air travel is absolutely contraindicated with an intraocular gas bubble. Decreased atmospheric pressure at altitude causes the gas bubble to expand, potentially causing dangerously elevated IOP and permanent damage." },
      { question: "What is the significance of a 'macula-on' versus 'macula-off' retinal detachment?", options: ["Macula-on detachments are less urgent and can wait weeks", "Macula-on is a true surgical emergency because central vision can still be preserved", "There is no difference in urgency between the two", "Macula-off has a better prognosis for vision recovery"], correct: 1, rationale: "A macula-on detachment means central vision is still intact—this is a true emergency requiring surgery within 24 hours. Once the macula detaches, photoreceptor cell death in the fovea often results in permanent central vision loss." }
    ]
  },

  "tracheostomy-emergency-rn": {
    title: "Tracheostomy Emergencies: Decannulation & Obstruction",
    cellular: {
      title: "Tracheostomy Airway Physiology and Emergency Complications",
      content: "A tracheostomy creates an artificial airway through an incision in the anterior tracheal wall between the 2nd and 4th tracheal cartilage rings, bypassing the upper airway. The tracheostomy tube sits within the tracheal lumen, secured by a flange and ties or a commercial holder. Fresh tracheostomy tracts (less than 7-10 days) are not yet epithelialized, meaning the tract can close rapidly if the tube is accidentally dislodged (accidental decannulation), making reinsertion extremely difficult and potentially creating a false passage into the pretracheal tissues. Mature tracts (established after 7-14 days) have an epithelialized stoma that maintains patency longer. Tube obstruction occurs when thick mucus, blood clots, or granulation tissue occludes the tube lumen or inner cannula. Tracheal granulation tissue forms as a foreign body response to tube contact with the mucosa, causing chronic inflammation and fibroblast proliferation. The bypass of the upper airway eliminates normal humidification, filtration, and warming functions of the nose and oropharynx, making the lower airway vulnerable to thick secretions and infection."
    },
    riskFactors: [
      "Newly placed tracheostomy (<7-10 days) with immature tract",
      "Agitated or confused patient pulling at tracheostomy",
      "Inadequate securing: loose ties or poorly fitted holder",
      "Obesity with deep pretracheal tissues obscuring the tract",
      "Excessive secretion production with inadequate humidification",
      "Bleeding disorders or anticoagulant therapy (hemorrhagic obstruction)",
      "Tracheomalacia causing tracheal collapse around tube"
    ],
    diagnostics: [
      "Assess airway patency: observe for signs of obstruction (increased work of breathing, desaturation, inability to pass suction catheter)",
      "Attempt to pass suction catheter through tracheostomy: if cannot pass, suspect obstruction",
      "Remove inner cannula and assess for mucus plugging",
      "If tube dislodged: assess if stoma patent, attempt to visualize tracheal lumen",
      "Capnography: absent or diminished ETCO2 waveform indicates tube misplacement or obstruction",
      "Chest X-ray to confirm tube position after reinsertion"
    ],
    management: [
      "Mucus plug obstruction: remove and clean or replace inner cannula, suction trachea, instill saline if needed",
      "Accidental decannulation in MATURE tract (>7-10 days): reinsert same-size or one-size-smaller tube",
      "Accidental decannulation in FRESH tract (<7 days): DO NOT attempt reinsertion—ventilate via mouth/nose and call surgeon",
      "Complete obstruction unrelieved by inner cannula change: remove entire tube and ventilate orally while preparing for reinsertion",
      "Hemorrhage from tracheostomy site: apply pressure, suction airway, assess for tracheo-innominate fistula (life-threatening)",
      "Keep emergency supplies at bedside: spare tracheostomy tube (same size and one smaller), obturator, suction"
    ],
    nursingActions: [
      "Maintain emergency tracheostomy supplies at bedside at ALL times: spare tube, obturator, suction, ambu bag with trach adapter",
      "Assess tracheostomy site every shift: tube position, skin integrity, securement device, stoma condition",
      "Provide humidification via trach collar or HME (heat-moisture exchanger) to prevent mucus drying",
      "Suction PRN using sterile technique: pre-oxygenate, insert catheter without suction, apply suction while withdrawing (max 10 seconds)",
      "Clean inner cannula every 4-8 hours or more frequently if copious secretions",
      "Maintain tracheostomy ties snug enough to allow only one finger between ties and neck",
      "For accidental decannulation: call for help, attempt reinsertion if mature tract, bag-valve-mask via mouth and nose if fresh tract",
      "Educate patient and family on tracheostomy care, suctioning, and emergency procedures before discharge"
    ],
    assessmentFindings: [
      "Patent tracheostomy: clear breath sounds, easy passage of suction catheter, adequate air movement",
      "Obstruction signs: high-pitched whistling, increased work of breathing, desaturation, inability to pass catheter",
      "Decannulation: tube visible outside stoma, respiratory distress, air leaking from stoma",
      "Hemorrhage: blood in secretions or around stoma site",
      "Subcutaneous emphysema: crepitus on palpation around neck and chest (tube malposition)"
    ],
    signs: {
      left: [
        "Patent airway with clear breath sounds",
        "Easy suction catheter passage",
        "Adequate oxygen saturation on current settings",
        "Clean, intact stoma site"
      ],
      right: [
        "Obstruction: desaturation, high-pitched sounds, cannot pass catheter",
        "Decannulation: tube out of stoma, respiratory distress",
        "Hemorrhage: pulsatile bleeding suggests tracheo-innominate fistula",
        "Subcutaneous emphysema: crepitus over neck and chest"
      ]
    },
    medications: [
      { name: "Normal Saline (0.9% NaCl) Instillation", type: "Mucolytic Adjunct", action: "Instilled into tracheostomy (3-5 mL) to loosen thick secretions before suctioning. Controversial practice but used in some protocols for mucus plug emergencies", sideEffects: "Coughing, transient desaturation, potential for bacterial contamination", contra: "Routine use without indication (evidence does not support prophylactic instillation)", pearl: "Normal saline instillation is controversial and no longer routinely recommended. Adequate humidification is preferred. Reserved for emergent thick secretion management when humidification alone fails." },
      { name: "Acetylcysteine (Mucomyst)", type: "Mucolytic Agent", action: "Breaks disulfide bonds in mucus glycoproteins, reducing viscosity of thick secretions to improve airway clearance", sideEffects: "Bronchospasm, nausea, rhinorrhea, stomatitis", contra: "Asthma or severe bronchospasm (can worsen), status asthmaticus", pearl: "Can be nebulized via tracheostomy for persistent thick secretions. Pre-treat with bronchodilator to prevent bronchospasm. Monitor closely for respiratory distress during administration." }
    ],
    pearls: [
      "Emergency tracheostomy supplies must be at the bedside AT ALL TIMES: same-size tube, one size smaller tube, obturator, suction, ambu bag with trach adapter",
      "FRESH tract (<7-10 days) accidental decannulation: DO NOT attempt reinsertion—you can create a false passage. Ventilate via mouth/nose and call the surgeon immediately",
      "MATURE tract (>7 days) accidental decannulation: reinsert the tube using the obturator for guidance, confirm placement with capnography and auscultation",
      "If tracheostomy is obstructed and you cannot clear it: REMOVE THE ENTIRE TUBE and ventilate the patient orally—the tube is the problem",
      "Tracheo-innominate artery fistula (pulsatile hemorrhage from trach) is a lethal emergency: apply digital pressure through the stoma against the sternum and call surgery immediately"
    ],
    quiz: [
      { question: "A patient with a 3-day-old tracheostomy accidentally pulls the tube out. The nurse should:", options: ["Immediately attempt to reinsert the tracheostomy tube", "Cover the stoma, begin bag-valve-mask ventilation via mouth and nose, and call the surgeon", "Insert the obturator and attempt to reinsert a smaller tube", "Apply oxygen via the stoma using a tracheostomy mask"], correct: 1, rationale: "A fresh tracheostomy tract (<7-10 days) is not epithelialized. Attempting reinsertion risks creating a false passage into subcutaneous tissue. The correct action is to ventilate via the upper airway (mouth/nose) and call the surgeon for controlled reinsertion." },
      { question: "A suction catheter cannot pass through a tracheostomy tube, and the patient is desaturating. After removing and cleaning the inner cannula, the catheter still cannot pass. What is the next action?", options: ["Continue attempting to force the catheter", "Instill 10 mL of normal saline and reattempt", "Remove the entire tracheostomy tube and ventilate the patient orally", "Increase the FiO2 and monitor"], correct: 2, rationale: "If the inner cannula has been changed and the catheter still cannot pass, the outer cannula is obstructed. The tube itself must be removed to restore airway patency. Ventilate via the upper airway while preparing for tube replacement." },
      { question: "Which item must be at the bedside of EVERY patient with a tracheostomy?", options: ["A chest tube kit", "A spare tracheostomy tube and obturator", "An arterial line setup", "A central line kit"], correct: 1, rationale: "A spare tracheostomy tube (same size and one size smaller) with obturator must be at the bedside at all times for emergency reinsertion. This is a fundamental safety requirement for tracheostomy patients." }
    ]
  },

  "sinusitis-complications-rn": {
    title: "Sinusitis & Orbital Complications: RN Assessment",
    cellular: {
      title: "Sinusitis Pathophysiology and Complications",
      content: "Acute rhinosinusitis involves inflammation and infection of the paranasal sinus mucosal lining. The sinuses are air-filled cavities (maxillary, ethmoid, frontal, sphenoid) lined with pseudostratified ciliated columnar epithelium that produces mucus continuously cleared by mucociliary transport through the ostia into the nasal cavity. Obstruction of sinus ostia from mucosal edema (viral URI, allergic rhinitis) traps mucus within the sinus cavity, creating a stagnant, anaerobic environment ideal for bacterial growth. Common pathogens include Streptococcus pneumoniae, Haemophilus influenzae, and Moraxella catarrhalis. Complications arise from direct extension of infection through thin bony walls. The ethmoid sinuses are separated from the orbit by the lamina papyracea (paper-thin bone), and infection can spread to cause preseptal cellulitis, orbital cellulitis, subperiosteal abscess, or orbital abscess (Chandler classification). Frontal sinusitis can extend intracranially through the posterior table causing epidural abscess, subdural empyema, or brain abscess. Cavernous sinus thrombosis can result from retrograde thrombophlebitis through valveless facial and ophthalmic veins."
    },
    riskFactors: [
      "Preceding viral upper respiratory infection (most common precipitant)",
      "Allergic rhinitis with chronic mucosal edema",
      "Anatomic obstruction: deviated septum, nasal polyps, turbinate hypertrophy",
      "Immunodeficiency: diabetes, HIV, neutropenia",
      "Dental infection (odontogenic sinusitis of maxillary sinus)",
      "Nasotracheal intubation or nasogastric tube placement",
      "Smoking and environmental pollution",
      "Cystic fibrosis (thick secretions obstruct sinus ostia)"
    ],
    diagnostics: [
      "Clinical diagnosis based on symptoms persisting >10 days or worsening after initial improvement (double sickening)",
      "CT sinuses if complications suspected: opacification, air-fluid levels, bony erosion",
      "CT orbits with contrast if orbital complication suspected: proptosis, subperiosteal collection",
      "MRI brain with contrast if intracranial complication suspected",
      "CBC: leukocytosis with left shift in bacterial sinusitis",
      "Blood cultures if sepsis or intracranial complication suspected"
    ],
    management: [
      "Uncomplicated acute bacterial sinusitis: amoxicillin-clavulanate first-line for 10-14 days",
      "Adjunctive therapy: nasal saline irrigation, intranasal corticosteroids, mucolytics",
      "Orbital complications: IV antibiotics (ampicillin-sulbactam + metronidazole), ophthalmology and ENT consultation",
      "Surgical drainage for orbital abscess or subperiosteal abscess not responding to IV antibiotics within 24-48 hours",
      "Intracranial complications: neurosurgical consultation, IV antibiotics, possible surgical drainage",
      "Decongestants (oxymetazoline) for symptom relief: limit to 3 days to avoid rebound"
    ],
    nursingActions: [
      "Assess for signs of orbital complications: periorbital swelling, proptosis, limited eye movement, vision changes",
      "Monitor neurological status if frontal sinusitis: headache, fever, altered mental status suggest intracranial extension",
      "Educate on nasal saline irrigation technique: use distilled or boiled water, not tap water",
      "Administer antibiotics as prescribed and monitor for allergic reactions and GI side effects",
      "Encourage adequate fluid intake to thin secretions",
      "Teach proper technique for intranasal corticosteroid use: aim toward lateral nasal wall, not septum",
      "Monitor for complications: worsening symptoms after 72 hours of antibiotics, visual changes, severe headache",
      "Educate on completing full antibiotic course even if symptoms improve"
    ],
    assessmentFindings: [
      "Facial pain and pressure over affected sinus (maxillary: cheek; frontal: forehead; ethmoid: between eyes)",
      "Purulent nasal discharge (yellow-green)",
      "Nasal congestion with hyposmia (reduced smell)",
      "Postnasal drip causing cough, especially at night",
      "Fever and malaise in acute bacterial sinusitis",
      "Dental pain with maxillary sinusitis"
    ],
    signs: {
      left: [
        "Facial tenderness over sinuses on palpation",
        "Purulent nasal discharge",
        "Nasal congestion and hyposmia",
        "Postnasal drip and cough"
      ],
      right: [
        "Orbital cellulitis: proptosis, restricted eye movement, vision loss",
        "Periorbital swelling and erythema (preseptal vs orbital)",
        "Cavernous sinus thrombosis: bilateral periorbital edema, cranial nerve palsies",
        "Intracranial extension: severe headache, altered mental status, seizures"
      ]
    },
    medications: [
      { name: "Amoxicillin-Clavulanate (Augmentin)", type: "Penicillin/Beta-lactamase Inhibitor", action: "Broad-spectrum bactericidal activity against common sinus pathogens including beta-lactamase producing H. influenzae and M. catarrhalis", sideEffects: "Diarrhea (clavulanate-related), nausea, rash, C. diff risk", contra: "Penicillin anaphylaxis, history of cholestatic jaundice with amoxicillin-clavulanate", pearl: "First-line for acute bacterial sinusitis. High-dose amoxicillin component (2g BID) recommended in areas with high S. pneumoniae resistance. Take with food to reduce GI side effects." },
      { name: "Fluticasone Nasal (Flonase)", type: "Intranasal Corticosteroid", action: "Reduces mucosal inflammation and edema in the nasal passages and sinus ostia, improving drainage and symptom relief", sideEffects: "Epistaxis, nasal irritation, headache, rarely septal perforation with chronic use", contra: "Active nasal infection (relative), recent nasal surgery", pearl: "Point the spray toward the lateral nasal wall (toward the ear), NOT toward the septum. This targets the middle meatus where sinus drainage occurs and reduces epistaxis risk. Takes 1-3 days for benefit." }
    ],
    pearls: [
      "Acute sinusitis is usually viral (90% of cases)—antibiotics are only indicated when symptoms persist >10 days, worsen after improvement (double sickening), or are severe at onset",
      "Periorbital (preseptal) cellulitis vs orbital cellulitis: orbital cellulitis causes proptosis, eye movement pain, and vision loss—this is a surgical emergency",
      "Cavernous sinus thrombosis is suggested by bilateral periorbital involvement, cranial nerve palsies (III, IV, V1, V2, VI), and high fever—mortality is high without treatment",
      "Never use tap water for nasal irrigation—use distilled, sterile, or previously boiled water to prevent Naegleria fowleri (brain-eating amoeba) infection",
      "Dental infections (especially upper molars) can cause maxillary sinusitis—always ask about recent dental work or tooth pain"
    ],
    quiz: [
      { question: "A patient with sinusitis develops sudden proptosis, restricted eye movements, and decreased visual acuity. What is the priority action?", options: ["Continue oral antibiotics and monitor", "Apply warm compresses to the face", "Notify the provider immediately—suspect orbital cellulitis/abscess", "Administer nasal decongestant spray"], correct: 2, rationale: "Proptosis, restricted eye movement, and vision changes indicate orbital cellulitis or abscess, a surgical emergency that can cause permanent blindness. This requires immediate IV antibiotics and likely surgical drainage." },
      { question: "When educating a patient on nasal saline irrigation, the nurse should emphasize:", options: ["Use warm tap water for comfort", "Use only distilled, sterile, or previously boiled water", "Irrigate only the affected side", "Perform irrigation before bed only"], correct: 1, rationale: "Tap water can contain Naegleria fowleri (brain-eating amoeba) which can enter the CNS through the nasal mucosa. Only distilled, sterile, or boiled (then cooled) water should be used for nasal irrigation." },
      { question: "Which finding differentiates orbital cellulitis from preseptal (periorbital) cellulitis?", options: ["Swollen eyelid", "Fever", "Proptosis and painful eye movement", "Facial tenderness"], correct: 2, rationale: "Preseptal cellulitis involves inflammation anterior to the orbital septum (swollen eyelid only). Orbital cellulitis involves infection behind the septum causing proptosis, restricted/painful eye movements, and potential vision loss—a surgical emergency." }
    ]
  }
};
