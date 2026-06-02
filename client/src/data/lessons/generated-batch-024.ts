import type { LessonContent } from "./types";

export const generatedBatch024Lessons: Record<string, LessonContent> = {
  "cranial-nerve-advanced-np": {
      "title": "Cranial Nerve Advanced Assessment",
      "cellular": {
        "title": "Cranial Nerve Neuroanatomy & Clinical Correlates",
        "content": "The twelve cranial nerves emerge from the brainstem (except CN I and II from the cerebrum) and serve sensory, motor, or mixed functions. CN I (olfactory) passes through the cribriform plate; fractures here cause anosmia and CSF rhinorrhea. CN II (optic) transmits visual information via the optic chiasm where nasal fibers decussate; lesions produce characteristic visual field defects (bitemporal hemianopia from chiasmal compression). CN III (oculomotor) carries parasympathetic fibers on its surface, making pupil dilation the earliest sign of compression (uncal herniation). The corneal reflex tests CN V (afferent) and CN VII (efferent). CN VII upper vs lower motor neuron distinction is critical: central lesions spare the forehead (bilateral cortical innervation), peripheral lesions (Bell palsy) affect the entire half of face."
      },
      "riskFactors": [
        "Posterior fossa tumors (acoustic neuroma affecting CN VIII, meningioma compressing multiple nerves)",
        "Cerebrovascular disease (brainstem stroke affecting cranial nerve nuclei)",
        "Traumatic brain injury (basilar skull fracture damaging CN I, VII, VIII)",
        "Diabetes mellitus (CN III palsy with pupil-sparing from microvascular ischemia)",
        "Multiple sclerosis (internuclear ophthalmoplegia from MLF demyelination)",
        "Increased intracranial pressure (CN VI palsy is a false-localizing sign due to long intracranial course)",
        "Cavernous sinus pathology (affects CN III, IV, V1, V2, VI simultaneously)",
        "Guillain-Barré syndrome (bilateral facial nerve palsy)"
      ],
      "diagnostics": [
        "CN I: test each nostril separately with non-irritating substances (coffee, vanilla); anosmia may indicate frontal lobe lesion or cribriform plate fracture",
        "CN II: visual acuity (Snellen chart), visual fields by confrontation, pupillary light reflex (afferent limb), fundoscopy (papilledema, optic atrophy)",
        "CN III/IV/VI: extraocular movements in H pattern; CN III palsy = 'down and out' eye with ptosis and mydriasis; CN IV = difficulty looking down and inward; CN VI = inability to abduct eye",
        "CN V: facial sensation (V1 forehead, V2 cheek, V3 jaw), corneal reflex (afferent V1), jaw clench (motor V3)",
        "CN VII: facial symmetry, forehead wrinkling, eye closure, smile; distinguish UMN (forehead spared) from LMN (entire face)",
        "CN VIII: Weber (lateralizes to conductive loss side), Rinne (air>bone = normal or sensorineural; bone>air = conductive)",
        "CN IX/X: gag reflex, palate elevation (uvula deviates AWAY from lesion), voice quality",
        "CN XI: sternocleidomastoid (turns head to OPPOSITE side), trapezius (shoulder shrug)",
        "CN XII: tongue protrusion (deviates TOWARD lesion side), fasciculations (LMN lesion)"
      ],
      "management": [
        "Bell palsy (peripheral CN VII): oral corticosteroids within 72 hours (prednisone 60-80 mg x 7 days); eye protection (artificial tears, tape eye closed at night); antiviral (valacyclovir) controversial but often added for moderate-severe cases",
        "CN III palsy with pupil involvement: emergent neuroimaging (CT angiography) to rule out posterior communicating artery aneurysm (surgical emergency)",
        "CN III palsy with pupil-SPARING: likely microvascular (diabetes) -- observe, resolves in 3 months typically",
        "Trigeminal neuralgia (CN V): carbamazepine first-line; oxcarbazepine, gabapentin alternatives; microvascular decompression for refractory cases",
        "Acoustic neuroma (CN VIII): MRI with gadolinium; observation, stereotactic radiosurgery, or microsurgical resection based on size and symptoms",
        "Increased ICP with CN VI palsy: treat underlying cause of elevated ICP"
      ],
      "nursingActions": [
        "Perform systematic cranial nerve examination documenting each nerve individually",
        "Recognize CN III palsy with fixed dilated pupil as a neurological emergency (possible uncal herniation or posterior communicating artery aneurysm)",
        "Distinguish central from peripheral CN VII palsy: ask patient to raise eyebrows and close eyes tightly -- forehead involvement indicates peripheral lesion",
        "Assess corneal reflex in unconscious patients (CN V afferent, CN VII efferent) -- absent reflex indicates brainstem dysfunction",
        "Monitor for multiple cranial nerve involvement (suggests brainstem lesion, cavernous sinus pathology, or meningeal disease)",
        "Protect the eye in CN VII palsy: inability to close the eye leads to corneal exposure, drying, and ulceration",
        "Document baseline cranial nerve function for serial comparison in neurosurgical and stroke patients"
      ],
      "assessmentFindings": [
        "CN III palsy: ptosis, eye deviated 'down and out,' mydriasis (dilated pupil from parasympathetic disruption)",
        "Bell palsy (peripheral CN VII): unilateral facial weakness affecting ENTIRE half including forehead, inability to close eye, loss of nasolabial fold, drooling, hyperacusis, decreased taste anterior 2/3 tongue",
        "Acoustic neuroma: unilateral sensorineural hearing loss, tinnitus, imbalance; may compress CN V (facial numbness) and CN VII (facial weakness) if large",
        "Trigeminal neuralgia: lancinating 'electric shock' pain in V2 or V3 distribution triggered by light touch, chewing, wind",
        "Bulbar palsy (CN IX, X, XII LMN): dysarthria, dysphagia, nasal regurgitation, tongue atrophy with fasciculations",
        "Internuclear ophthalmoplegia: impaired adduction of ipsilateral eye with nystagmus of contralateral abducting eye (MLF lesion -- MS in young, stroke in elderly)"
      ],
      "signs": {
        "left": [
          "Isolated Bell palsy recovering with corticosteroid treatment",
          "Pupil-sparing CN III palsy in diabetic patient (microvascular, self-limiting)",
          "Mild unilateral hearing loss with small acoustic neuroma under surveillance",
          "Trigeminal neuralgia well-controlled on carbamazepine"
        ],
        "right": [
          "CN III palsy with fixed dilated pupil -- emergent imaging for PCA aneurysm or uncal herniation",
          "Multiple cranial nerve palsies suggesting brainstem stroke or cavernous sinus thrombosis",
          "Bilateral facial nerve palsy (GBS, Lyme disease, sarcoidosis -- requires urgent evaluation)",
          "Progressive bulbar palsy with aspiration pneumonia risk",
          "Papilledema with CN VI palsy indicating elevated ICP"
        ]
      },
      "medications": [
        {
          "name": "Carbamazepine (Tegretol)",
          "type": "Anticonvulsant / sodium channel blocker",
          "action": "Blocks voltage-gated sodium channels, stabilizing neuronal membranes and reducing repetitive firing; first-line treatment for trigeminal neuralgia by reducing aberrant pain signal transmission along CN V",
          "sideEffects": "Drowsiness, dizziness, diplopia, ataxia, hyponatremia (SIADH), aplastic anemia (rare but serious), Stevens-Johnson syndrome (HLA-B*1502 in Asian descent -- test before prescribing), hepatotoxicity, leukopenia",
          "contra": "Bone marrow suppression, concurrent MAOIs, known HLA-B*1502 (increased SJS risk), hepatic porphyria",
          "pearl": "First-line for trigeminal neuralgia (NNT=1.7 -- very effective); check HLA-B*1502 in patients of Asian descent BEFORE starting (FDA recommendation); monitor CBC and hepatic function; potent CYP3A4 inducer (many drug interactions -- reduces efficacy of OCPs, warfarin, other medications); therapeutic level 4-12 mcg/mL"
        }
      ],
      "pearls": [
        "CN III palsy WITH pupil involvement = aneurysm until proven otherwise (parasympathetic fibers run on the OUTSIDE of CN III, compressed first by external mass); CN III palsy with pupil SPARING = likely microvascular (diabetes -- ischemia affects core fibers, spares surface parasympathetics)",
        "CN VII: Central = forehead SPARED (bilateral cortical innervation); Peripheral (Bell palsy) = ENTIRE face affected",
        "CN VI palsy can be a FALSE LOCALIZING sign of elevated ICP -- the long intracranial course of CN VI makes it vulnerable to generalized pressure increases",
        "Tongue deviates TOWARD the side of a CN XII LMN lesion; uvula deviates AWAY from the side of a CN X lesion",
        "Weber test: lateralizes to AFFECTED ear in conductive hearing loss (better bone conduction in blocked ear); lateralizes to UNAFFECTED ear in sensorineural loss",
        "Internuclear ophthalmoplegia (INO): bilateral in YOUNG patients = think MS; unilateral in ELDERLY patients = think brainstem stroke"
      ],
      "quiz": [
        {
          "question": "A patient presents with a right-sided 'down and out' eye position, ptosis, and a fixed dilated right pupil. What is the most urgent concern?",
          "options": [
            "Diabetic microvascular CN III palsy",
            "Posterior communicating artery aneurysm compressing CN III",
            "Bell palsy",
            "CN VI palsy from elevated ICP"
          ],
          "correct": 1,
          "rationale": "CN III palsy WITH pupil involvement (mydriasis) is a posterior communicating artery aneurysm until proven otherwise. The parasympathetic fibers travel on the OUTSIDE of CN III and are compressed first by an expanding aneurysm. This is a neurosurgical emergency requiring immediate CT angiography. Diabetic CN III palsy typically SPARES the pupil."
        },
        {
          "question": "A patient cannot raise the right eyebrow or close the right eye, and the right nasolabial fold is flattened. Where is the lesion?",
          "options": [
            "Right cerebral cortex (central/UMN CN VII lesion)",
            "Right peripheral facial nerve (LMN CN VII -- Bell palsy)",
            "Left cerebral cortex",
            "Right trigeminal nerve (CN V)"
          ],
          "correct": 1,
          "rationale": "Involvement of the ENTIRE right face including the forehead (cannot raise eyebrow, close eye) indicates a peripheral/LMN CN VII lesion (Bell palsy). Central/UMN lesions spare the forehead because the upper facial muscles receive bilateral cortical innervation."
        },
        {
          "question": "During a Weber test, sound lateralizes to the LEFT ear. Rinne test shows bone conduction > air conduction on the LEFT. What type of hearing loss is present?",
          "options": [
            "Left sensorineural hearing loss",
            "Left conductive hearing loss",
            "Right conductive hearing loss",
            "Normal hearing"
          ],
          "correct": 1,
          "rationale": "Weber lateralizes to the affected ear in conductive hearing loss. Rinne showing bone > air conduction (negative Rinne) on the left confirms conductive hearing loss on the left side. In sensorineural loss, Weber would lateralize to the UNAFFECTED ear, and Rinne would show air > bone (positive Rinne) bilaterally."
        }
      ]
    },
  "cranial-nerve-assessment": {
        title: "Cranial Nerve Assessment",
        cellular: { title: "Anatomy and Function of the Cranial Nerves", content: "The twelve cranial nerves emerge directly from the brain (most from the brainstem) and control sensory, motor, and autonomic functions of the head, face, neck, and visceral organs. Understanding cranial nerve anatomy is essential for nurses because changes in cranial nerve function can indicate neurological deterioration, stroke, increased intracranial pressure, or brainstem compression requiring immediate intervention.\n\nThe cranial nerves are numbered I through XII based on their position from anterior to posterior on the brainstem. A useful mnemonic for remembering their names is: Oh Oh Oh To Touch And Feel Very Good Velvet, Ah Heaven (Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Vestibulocochlear, Glossopharyngeal, Vagus, Accessory, Hypoglossal). Their functions can be remembered with: Some Say Marry Money But My Brother Says Big Brains Matter More (Sensory, Sensory, Motor, Motor, Both, Motor, Both, Sensory, Both, Both, Motor, Motor).\n\nCN I (Olfactory): Pure sensory nerve carrying smell sensation from the nasal epithelium to the olfactory bulb. Tested by having the patient identify familiar scents (coffee, vanilla) with eyes closed, one nostril at a time. Loss of smell (anosmia) can follow head trauma, nasal obstruction, or frontal lobe lesions.\n\nCN II (Optic): Pure sensory nerve carrying visual information from the retina to the occipital cortex. Tested by visual acuity (Snellen chart), visual field testing (confrontation), and fundoscopic examination. Papilledema (swelling of the optic disc) seen on fundoscopy indicates increased intracranial pressure.\n\nCN III (Oculomotor), CN IV (Trochlear), CN VI (Abducens): These three nerves work together to control eye movements and pupil function. CN III controls most eye movements (up, down, medial), eyelid elevation, pupil constriction, and lens accommodation. CN IV controls downward and inward eye movement. CN VI controls lateral (outward) eye movement. Tested together by having the patient follow a finger through six cardinal positions of gaze. A fixed, dilated pupil on one side (blown pupil) indicates CN III compression, often from uncal herniation - this is a neurological emergency.\n\nCN V (Trigeminal): Mixed nerve providing facial sensation (three branches: ophthalmic V1, maxillary V2, mandibular V3) and motor function to muscles of mastication. Tested by light touch to three facial areas and clenching teeth. Important for the corneal reflex (afferent limb).\n\nCN VII (Facial): Mixed nerve controlling facial expression muscles, taste to the anterior two-thirds of the tongue, and some salivary and lacrimal gland secretion. Tested by asking patient to raise eyebrows, close eyes tightly, smile, and puff cheeks. In Bell palsy (peripheral CN VII lesion), the entire half of the face is paralyzed. In stroke (central lesion), only the lower face is affected because the upper face receives bilateral cortical innervation.\n\nCN VIII (Vestibulocochlear): Pure sensory nerve for hearing and balance. Tested by whisper test, Weber test, and Rinne test. Sudden hearing loss may indicate acoustic neuroma or stroke.\n\nCN IX (Glossopharyngeal) and CN X (Vagus): Often assessed together. CN IX provides sensation to the posterior pharynx and taste to the posterior tongue. CN X controls pharyngeal and laryngeal muscles (swallowing, voice), and parasympathetic innervation to thoracic and abdominal organs (heart rate, digestion). Tested by gag reflex, saying 'ah' (uvula should rise midline), and assessing voice quality. Absent gag reflex or hoarse voice suggests brainstem compromise. CN X dysfunction causes aspiration risk.\n\nCN XI (Accessory): Pure motor nerve controlling the sternocleidomastoid and trapezius muscles. Tested by having the patient shrug shoulders and turn head against resistance.\n\nCN XII (Hypoglossal): Pure motor nerve controlling tongue movement. Tested by asking the patient to protrude the tongue (deviates toward the side of the lesion) and move it side to side. Important for speech and swallowing." },
        riskFactors: ["Stroke or transient ischemic attack","Head trauma or skull fracture","Brain tumor (especially posterior fossa)","Increased intracranial pressure","Meningitis or encephalitis","Multiple sclerosis","Diabetes mellitus (cranial mononeuropathy)","Bell palsy (viral inflammation of CN VII)"],
        diagnostics: ["Perform systematic cranial nerve assessment (CN I through XII)","Monitor pupil size, symmetry, and reactivity (CN III)","Assess gag and swallowing reflexes (CN IX, X)","Test visual acuity and visual fields (CN II)","Assess facial symmetry and strength (CN VII)","Monitor speech clarity and tongue movement (CN XII)"],
        management: ["Report any new cranial nerve deficits immediately","Maintain NPO status if gag reflex is absent or swallowing is impaired","Protect eyes if corneal reflex is absent (lubricating drops, eye patch)","Implement aspiration precautions for CN IX/X deficits","Position patient safely if balance is impaired (CN VIII)","Provide communication aids if speech is affected"],
        nursingActions: ["Perform pupil checks as ordered (routine or every 1-2 hours for neuro patients)","Test gag reflex before offering oral intake","Assess facial symmetry by asking patient to smile and raise eyebrows","Document and compare cranial nerve findings to baseline","Report unilateral pupil dilation immediately (possible herniation)","Monitor voice quality for hoarseness or wet quality (aspiration risk)","Assess extraocular movements in patients with head injury or stroke","Coordinate with speech-language pathology for swallowing assessment"],
        assessmentFindings: ["Unequal pupils (anisocoria) suggesting CN III compression","Facial droop on one side suggesting CN VII dysfunction or stroke","Absent gag reflex indicating CN IX/X impairment","Tongue deviation to one side indicating CN XII lesion","Ptosis (eyelid drooping) indicating CN III dysfunction","Nystagmus indicating CN VIII or brainstem dysfunction"],
        signs: {
          left: ["Pupil changes (dilation, asymmetry)","Facial droop or asymmetry","Ptosis (eyelid drooping)","Tongue deviation","Abnormal eye movements"],
          right: ["Absent gag reflex","Dysphagia or hoarse voice","Loss of corneal reflex","Hearing loss","Balance disturbance"]
        },
        medications: [{
      name: "Prednisone",
      type: "Corticosteroid",
      action: "Reduces inflammation and edema around cranial nerves, particularly in Bell palsy",
      sideEffects: "Hyperglycemia, insomnia, mood changes, immunosuppression",
      contra: "Active systemic infection, uncontrolled diabetes",
      pearl: "Most effective when started within 72 hours of Bell palsy onset; taper dose to prevent adrenal crisis"
    },{
      name: "Artificial Tears",
      type: "Ophthalmic lubricant",
      action: "Provides moisture and protection to the cornea when eyelid closure is impaired",
      sideEffects: "Temporary blurred vision",
      contra: "None significant",
      pearl: "Essential for eye protection in CN VII palsy where the patient cannot fully close the affected eye; use ointment at night with eye patch"
    }],
        pearls: ["A blown pupil (fixed, dilated unilateral pupil) is a neurological emergency indicating uncal herniation compressing CN III","Bell palsy affects the entire half of the face; stroke affects only the lower face (forehead sparing)","Always assess CN IX and X before giving oral medications or food; absent gag reflex means aspiration risk","New onset of any cranial nerve deficit should be reported immediately","PERRLA documentation: Pupils Equal, Round, Reactive to Light and Accommodation","The corneal reflex tests CN V (sensory/afferent) and CN VII (motor/efferent)"],
        quiz: [{
        question: "A nurse performing a neurological assessment notices the patient's right pupil is fixed and dilated while the left pupil is 3mm and reactive. What is the priority action?",
        options: ["Document the finding and reassess in one hour","Report immediately as this may indicate uncal herniation","Check the patient's medication list for mydriatic eye drops","Perform a visual acuity test"],
        correct: 1,
        rationale: "A unilateral fixed, dilated pupil (blown pupil) is a neurological emergency that may indicate CN III compression from uncal herniation caused by rising intracranial pressure. This requires immediate reporting, likely CT scan, and possible neurosurgical intervention."
      },
      {
        question: "Before giving oral medications to a patient who had a stroke, which cranial nerve assessment should the nurse perform first?",
        options: ["CN II (visual acuity)","CN VII (facial symmetry)","CN IX/X (gag and swallowing reflex)","CN XII (tongue protrusion)"],
        correct: 2,
        rationale: "Cranial nerves IX (glossopharyngeal) and X (vagus) control the gag reflex and swallowing. After a stroke, these functions may be impaired, placing the patient at risk for aspiration. The gag reflex and swallowing assessment should be performed before any oral intake."
      },
      {
        question: "A patient presents with inability to close the right eye, drooling from the right side of the mouth, and inability to raise the right eyebrow. This pattern is most consistent with:",
        options: ["Right-sided stroke affecting the motor cortex","Right peripheral CN VII (Bell) palsy","Left-sided stroke with contralateral facial weakness","CN V trigeminal neuralgia"],
        correct: 1,
        rationale: "Complete unilateral facial paralysis affecting both the upper and lower face (including the forehead) indicates peripheral CN VII palsy (Bell palsy). A stroke would spare the forehead because it receives bilateral cortical innervation, so only the lower face would be affected with a central lesion."
      }]
  },
  "cranial-nerve-exam-rn": {
        title: "Cranial Nerve Examination",
        cellular: { title: "Neuroanatomy", content: "The cranial nerve examination is a fundamental component of the neurological assessment that evaluates the function of all twelve pairs of cranial nerves (CN I-XII). These nerves emerge directly from the brain (rather than the spinal cord) and control sensory perception, motor function, and autonomic regulation of the head, face, neck, and visceral organs. A systematic approach to cranial nerve assessment enables the nurse to localize neurological lesions, detect early signs of increased intracranial pressure, identify brainstem pathology, and monitor neurological status in patients with stroke, head injury, tumors, and other CNS disorders. Understanding the anatomy and function of each cranial nerve is essential for performing and interpreting the examination. CN I (Olfactory): A purely sensory nerve that transmits smell information from the olfactory mucosa in the nasal cavity through the cribriform plate of the ethmoid bone to the olfactory bulb and then to the olfactory cortex (piriform cortex in the temporal lobe). Assessment involves testing each nostril separately with familiar, non-irritating scents (coffee, vanilla, peppermint -- NOT ammonia, which stimulates CN V trigeminal pain fibers rather than CN I olfactory receptors). Anosmia (loss of smell) can indicate frontal lobe lesions, cribriform plate fracture (basilar skull fracture), or olfactory groove meningioma. CN II (Optic): A purely sensory nerve carrying visual information from the retinal ganglion cells through the optic nerve, optic chiasm (where nasal fibers decussate), optic tracts, lateral geniculate nucleus of the thalamus, and optic radiations to the primary visual cortex (occipital lobe, area V1). Assessment includes visual acuity (Snellen chart or near card), visual fields by confrontation (detecting homonymous hemianopsia, bitemporal hemianopsia, or quadrantanopsia that localizes lesions to specific points in the visual pathway), pupillary light reflex (afferent limb of the reflex arc), and fundoscopy (assessing for papilledema indicating increased intracranial pressure). CN III (Oculomotor): A motor nerve innervating four of the six extraocular muscles (superior rectus, inferior rectus, medial rectus, inferior oblique), the levator palpebrae superioris (eyelid elevation), and carrying parasympathetic fibers to the pupillary sphincter (pupil constriction) and ciliary muscle (accommodation). A complete CN III palsy produces ptosis (drooping eyelid from levator palpebrae paralysis), a 'down and out' eye position (unopposed action of the lateral rectus/CN VI and superior oblique/CN IV), and a fixed, dilated pupil (loss of parasympathetic pupillary constriction). Importantly, a dilated, unreactive pupil (blown pupil) from CN III compression is an EMERGENCY sign of uncal herniation from critically elevated intracranial pressure -- the uncus of the temporal lobe herniates over the tentorium cerebelli, compressing CN III against the posterior cerebral artery. CN IV (Trochlear): The thinnest cranial nerve, with the longest intracranial course, innervating only the superior oblique muscle (which depresses and intorts the eye, and is tested by asking the patient to look down and inward). CN IV palsy causes vertical diplopia that is worse when looking down (such as when descending stairs or reading) and the patient often develops a compensatory head tilt away from the affected side. CN V (Trigeminal): The largest cranial nerve, with both sensory and motor components. The three sensory divisions (V1 ophthalmic, V2 maxillary, V3 mandibular) provide sensation to the face. Assessment involves testing light touch and pin-prick in all three divisions bilaterally and testing the corneal reflex (cotton wisp touching the cornea triggers a blink -- afferent limb is CN V1, efferent limb is CN VII). The motor component innervates the muscles of mastication (masseter, temporalis, pterygoids), tested by having the patient clench the jaw while palpating the masseter and temporalis, and by assessing jaw deviation (the jaw deviates TOWARD the side of the lesion due to unopposed action of the contralateral pterygoid). CN VI (Abducens): Innervates the lateral rectus muscle (abducts the eye). CN VI palsy causes medial deviation of the affected eye (esotropia) and inability to abduct the eye laterally. Due to its long intracranial course along the base of the skull, CN VI is particularly vulnerable to elevated intracranial pressure (false localizing sign) and basilar skull fractures. CN VII (Facial): A mixed nerve with motor fibers innervating the muscles of facial expression and sensory fibers carrying taste from the anterior two-thirds of the tongue. The critical clinical distinction is between upper motor neuron (UMN) and lower motor neuron (LMN) facial weakness. In UMN lesions (stroke affecting the motor cortex or corticobulbar tract), ONLY the lower face is affected (forehead spared) because the upper face receives BILATERAL cortical innervation. In LMN lesions (Bell palsy, acoustic neuroma compressing CN VII), the ENTIRE half of the face is affected (including the forehead -- cannot raise eyebrow or wrinkle forehead). This distinction is one of the most important clinical pearls in neurology. CN VIII (Vestibulocochlear): Carries auditory (cochlear division) and vestibular (vestibular division) information. Hearing is screened by finger rub or whispered voice test, with Weber and Rinne tuning fork tests differentiating conductive from sensorineural hearing loss. Vestibular function is assessed by observing for nystagmus and performing the head impulse test. CN IX (Glossopharyngeal) and CN X (Vagus): Tested together because they share pharyngeal innervation. The gag reflex is mediated by CN IX (afferent) and CN X (efferent). Assessment includes observing palatal elevation when the patient says 'ahh' (the uvula deviates AWAY from the affected side in unilateral CN X lesion because the paralyzed side cannot elevate), assessing voice quality (hoarseness from vocal cord paralysis indicates CN X/recurrent laryngeal nerve damage), and testing the gag reflex. CN X also carries parasympathetic innervation to thoracic and abdominal viscera (heart, lungs, GI tract), making vagal nerve dysfunction clinically significant for cardiac and respiratory regulation. CN XI (Spinal Accessory): A pure motor nerve innervating the sternocleidomastoid (SCM) and upper trapezius muscles. Assessment involves testing shoulder shrug against resistance (trapezius) and head rotation against resistance (SCM -- importantly, the SCM turns the head to the OPPOSITE side, so testing right head rotation assesses the LEFT SCM/LEFT CN XI). CN XII (Hypoglossal): A pure motor nerve innervating the tongue musculature. Assessment includes inspecting the tongue at rest for fasciculations (indicating LMN lesion) and atrophy, and asking the patient to protrude the tongue -- it deviates TOWARD the side of the lesion (because the paralyzed genioglossus muscle cannot push the tongue to the opposite side, and the intact contralateral muscle pushes it toward the weak side). Documentation of the cranial nerve exam should be systematic, noting each nerve by number and recording specific findings including symmetry, strength, and quality of responses." },
        riskFactors: ["Traumatic brain injury (can damage cranial nerves at the skull base, particularly the olfactory nerve through the cribriform plate and the abducens nerve along its long course)","Stroke (ischemic or hemorrhagic cerebrovascular events affecting the brainstem or cortical areas can impair cranial nerve function -- patterns of deficits localize the stroke)","Increased intracranial pressure (compresses CN III causing pupil dilation -- uncal herniation; CN VI palsy as false localizing sign from stretching over the petrous ridge)","Brain tumors (particularly posterior fossa, cerebellopontine angle -- acoustic neuromas classically affect CN VII and CN VIII)","Diabetes mellitus (diabetic cranial neuropathy, particularly CN III and CN VI palsies from microvascular ischemia; diabetic CN III palsy typically SPARES the pupil because the external nerve fibers are affected while internal parasympathetic fibers are preserved)","Multiple sclerosis (demyelination can affect any cranial nerve; internuclear ophthalmoplegia from medial longitudinal fasciculus demyelination is characteristic)","Meningitis (inflammation of the meninges can damage cranial nerves at the skull base; CN VII and CN VIII are particularly vulnerable)"],
        diagnostics: ["Systematic cranial nerve examination (CN I through CN XII tested individually using the bedside techniques described -- this IS the diagnostic procedure; abnormal findings localize lesions within the nervous system)","CT head without contrast (emergent imaging for acute cranial nerve deficits suggesting increased ICP, stroke, or mass lesion; identifies hemorrhage, mass effect, midline shift, and hydrocephalus)","MRI brain with contrast (superior to CT for visualizing cranial nerve anatomy, brainstem lesions, demyelinating plaques, and small tumors; gadolinium enhancement highlights tumors, inflammation, and blood-brain barrier disruption)","CT angiography or MR angiography (evaluates vascular causes of cranial nerve palsy: aneurysm compressing CN III, carotid dissection affecting CN XII, or vertebrobasilar disease causing brainstem cranial nerve nuclei ischemia)","Lumbar puncture with CSF analysis (indicated when meningitis, carcinomatous meningitis, or subarachnoid hemorrhage is suspected as the cause of cranial nerve dysfunction)","Electromyography/nerve conduction studies of facial nerve (quantifies severity of CN VII palsy, particularly in Bell palsy, and provides prognostic information about recovery)","Audiometry and brainstem auditory evoked potentials (formal assessment of CN VIII function when screening tests suggest hearing loss; evaluates both peripheral and central auditory pathways)"],
        management: ["Treat the underlying cause (stroke: thrombolysis/thrombectomy for ischemic stroke; tumor: surgical resection/radiation; infection: appropriate antimicrobials; elevated ICP: osmotic therapy/surgical decompression)","Corticosteroids for Bell palsy (prednisone 60-80 mg/day x 7 days, started within 72 hours of symptom onset, significantly improves the probability of complete facial nerve recovery)","Antiviral therapy in selected Bell palsy cases (valacyclovir combined with prednisone if herpes simplex virus reactivation is suspected, though evidence for antivirals beyond steroids alone is debated)","Eye protection for CN VII palsy (inability to close the eye risks corneal exposure injury: artificial tears during the day, lubricating ointment at night, moisture chamber or patch during sleep)","Physical and occupational therapy for rehabilitation of motor cranial nerve deficits (facial retraining exercises for CN VII palsy, swallowing therapy for CN IX/X dysfunction)","Surgical interventions for structural lesions (tumor resection, aneurysm clipping/coiling, decompressive craniectomy for elevated ICP)"],
        nursingActions: ["Perform systematic cranial nerve assessment using standardized technique at baseline and at defined intervals (frequency determined by clinical situation: every 1-2 hours for acute neurological conditions, every shift for stable patients); document each nerve's function explicitly","Assess pupillary size, symmetry, and reactivity as part of every neurological check -- a NEW unilateral fixed dilated pupil (blown pupil) in a patient with altered consciousness is a NEUROLOGICAL EMERGENCY indicating possible uncal herniation requiring IMMEDIATE notification of the medical team and preparation for emergent imaging and intervention","Distinguish between upper motor neuron (UMN) and lower motor neuron (LMN) facial weakness: UMN (stroke) spares the forehead; LMN (Bell palsy) affects the entire half of the face including the forehead -- this distinction guides the urgency of imaging and intervention","Implement eye protection measures for patients with CN VII palsy who cannot fully close the affected eye: artificial tears every 1-2 hours while awake, lubricating eye ointment at bedtime, moisture chamber or eye patch during sleep to prevent corneal drying, injury, and ulceration","Assess swallowing function before oral intake in patients with CN IX and CN X deficits (gag reflex absent, hoarse voice, palatal asymmetry) -- aspiration risk is high; request formal swallowing evaluation by speech-language pathology","Monitor for signs of increased intracranial pressure through cranial nerve assessment: CN III palsy with pupil dilation (uncal herniation), CN VI palsy (false localizing sign from nerve stretching), papilledema on fundoscopy (if trained)","Document cranial nerve findings using a systematic format noting each nerve by number with specific observations (e.g., 'CN III: PERRLA 3mm bilaterally, no ptosis, full EOMs' or 'CN VII: LMN pattern L facial weakness, cannot close L eye, L nasolabial fold flattened, forehead wrinkles absent on L')"],
        assessmentFindings: ["Pupil asymmetry (anisocoria) -- a unilateral dilated unreactive pupil in the setting of declining consciousness indicates CN III compression from uncal herniation (EMERGENCY)","Facial asymmetry -- assess forehead involvement to distinguish UMN (forehead spared) from LMN (entire face affected including forehead) facial weakness","Dysphagia, hoarseness, absent gag reflex -- indicate CN IX/X dysfunction with aspiration risk requiring swallowing precautions","Tongue deviation on protrusion -- deviates TOWARD the side of the CN XII lesion (the weak genioglossus cannot push the tongue contralaterally)","Ptosis (drooping eyelid) -- from CN III palsy (associated with dilated pupil and eye deviation) or myasthenia gravis (bilateral, variable, fatigable)","Nystagmus -- involuntary rhythmic eye movements indicating vestibular (CN VIII) or cerebellar dysfunction; note direction, whether horizontal/vertical/rotary, and whether it is unidirectional or direction-changing","Jaw deviation -- deviates TOWARD the side of the CN V motor lesion (paralyzed pterygoid cannot push jaw to the opposite side)"],
        signs: { left: ["Normal symmetrical cranial nerve examination with PERRLA, full extraocular movements, intact facial strength and symmetry, normal gag reflex, midline tongue protrusion","Isolated CN VII palsy (Bell palsy) with intact forehead function suggesting UMN lesion or complete unilateral facial weakness suggesting LMN lesion -- documented and monitored with appropriate eye protection","Stable cranial nerve findings on serial examinations with no new deficits"], right: ["Acute unilateral fixed dilated pupil (blown pupil) with declining consciousness -- CN III compression from uncal herniation requiring IMMEDIATE intervention (neurosurgical emergency)","Multiple cranial nerve palsies indicating brainstem stroke, meningitis, or skull base tumor (CN III, VI, and VII palsies in combination)","Progressive bulbar palsy (CN IX, X, XII deficits) with aspiration pneumonia, inability to protect airway requiring intubation","Bilateral CN VI palsies indicating dangerously elevated intracranial pressure","Complete ophthalmoplegia (CN III, IV, VI) with orbital apex syndrome or cavernous sinus thrombosis"] },
        medications: [{ name: "Prednisone", type: "Systemic corticosteroid (glucocorticoid)", action: "Prednisone is a synthetic glucocorticoid that is converted to its active form prednisolone in the liver. It binds to intracellular glucocorticoid receptors, forming a receptor-drug complex that translocates to the nucleus and modulates gene transcription. The anti-inflammatory effects include: suppression of pro-inflammatory cytokine production (IL-1, IL-6, TNF-alpha), inhibition of phospholipase A2 (reducing prostaglandin and leukotriene synthesis), stabilization of lysosomal membranes, reduction of capillary permeability, and suppression of leukocyte migration to sites of inflammation. In Bell palsy (CN VII LMN palsy), the facial nerve becomes inflamed and edematous within the narrow bony fallopian canal of the temporal bone. The confined space causes nerve compression as the swollen nerve has no room to expand, producing ischemia and further damage. Prednisone reduces this inflammatory edema, decreasing pressure on the nerve within the canal and preserving nerve function.", sideEffects: "Short course (7-10 days): insomnia, mood changes (euphoria, irritability), increased appetite, gastric irritation, hyperglycemia (particularly in diabetic patients -- monitor blood glucose closely), fluid retention, immunosuppression (increased infection risk). Longer courses: Cushingoid features, adrenal suppression (requires taper for courses >2 weeks), osteoporosis, avascular necrosis, cataracts, myopathy", contra: "Active untreated systemic fungal infections; live vaccines during treatment; caution in diabetes mellitus (significant hyperglycemia), peptic ulcer disease, herpes simplex keratitis, psychotic disorders, osteoporosis", pearl: "For Bell palsy: 60-80 mg/day PO for 7 days (some protocols use 10-day course with taper); must be started within 72 hours of symptom onset for maximum benefit; NNT (number needed to treat) approximately 10 for complete recovery at 9 months; monitor blood glucose in diabetic patients (consider sliding scale insulin adjustment); GI prophylaxis with PPI may be considered; prednisone does NOT require tapering for courses of 7-10 days; if herpes zoster oticus (Ramsay Hunt syndrome with CN VII palsy, ear pain, vesicles on pinna) is suspected, add valacyclovir 1g TID x 7 days to the steroid regimen" },{ name: "Artificial Tears (Carboxymethylcellulose/Hypromellose)", type: "Ophthalmic lubricant and corneal protectant", action: "Artificial tears are aqueous solutions containing polymeric lubricants (carboxymethylcellulose, hypromellose, polyethylene glycol, or hyaluronic acid) that mimic the properties of natural tear film. The tear film has three layers: lipid (outermost, prevents evaporation), aqueous (middle, provides nutrition and lubrication), and mucin (innermost, allows tear film adherence to the hydrophobic corneal epithelium). When CN VII palsy prevents complete eyelid closure (lagophthalmos), the cornea is exposed to air, causing rapid evaporation of the tear film, corneal desiccation, and potential corneal ulceration or perforation. Artificial tears replace the aqueous layer, maintaining corneal hydration and providing a protective barrier against mechanical and environmental damage. The lubricant reduces friction between the exposed corneal surface and the partially closed eyelid during blinking.", sideEffects: "Transient blurred vision immediately after instillation (clears within minutes), mild stinging or burning (more common with preservative-containing formulations), allergic reaction to preservatives (switch to preservative-free formulations)", contra: "Known hypersensitivity to ingredients; contact lens wear (remove contacts before instillation with preserved formulations; preservative-free formulations may be used with contacts in place)", pearl: "ESSENTIAL for every patient with CN VII palsy and incomplete eye closure: instill every 1-2 hours while awake (more frequently in dry or windy environments); use preservative-free formulations for frequent use (>4 times daily) because the preservative benzalkonium chloride (BAK) can cause cumulative corneal epithelial toxicity; at BEDTIME, switch to a thicker lubricating ointment (such as Lacri-Lube) which provides longer-lasting protection during sleep but causes too much blurring for daytime use; a moisture chamber (plastic wrap or bubble shield taped over the affected eye) during sleep prevents corneal drying overnight; if corneal exposure persists despite these measures, surgical options include tarsorrhaphy (partial eyelid closure) or gold weight implantation in the upper eyelid; ALWAYS assess corneal integrity (redness, pain, foreign body sensation, visual changes) in CN VII palsy patients" },{ name: "Mannitol (Osmitrol)", type: "Osmotic diuretic (intracranial pressure reducer)", action: "Mannitol is a six-carbon sugar alcohol that functions as an osmotic diuretic. When administered intravenously, it creates an osmotic gradient between the blood and the brain tissue because it does NOT cross the intact blood-brain barrier (BBB). The elevated serum osmolality draws water from the brain parenchyma (both normal tissue and edematous tissue) into the intravascular compartment through osmosis, reducing brain volume and intracranial pressure (ICP). Additionally, mannitol reduces blood viscosity, improving cerebral microcirculatory flow and triggering autoregulatory vasoconstriction of cerebral arterioles, which further reduces intracranial blood volume and ICP. The onset of ICP reduction occurs within 15-30 minutes (the rheological effect from viscosity reduction) with peak ICP reduction at 60-90 minutes (the osmotic effect). In the context of cranial nerve assessment, mannitol is used emergently when cranial nerve examination reveals signs of uncal herniation (unilateral CN III palsy with dilated pupil and declining consciousness), indicating critically elevated ICP requiring immediate reduction.", sideEffects: "Acute: hypovolemia (osmotic diuresis causes significant fluid loss -- monitor I&O and replace fluids), electrolyte imbalances (hyponatremia, hypokalemia from diuresis), hypotension (from volume depletion). Rebound ICP elevation (mannitol can cross a disrupted BBB and accumulate in brain tissue, eventually drawing water INTO the brain -- worsens edema). Renal toxicity (nephrosis from high doses or prolonged use; monitor serum osmolality -- nephrotoxicity risk increases when serum osmolality exceeds 320 mOsm/kg). Pulmonary edema (from initial intravascular volume expansion before diuresis occurs)", contra: "Anuria or severe renal failure (cannot excrete the osmotic load); severe dehydration; active intracranial hemorrhage (unless preparing for definitive surgery -- the volume reduction may worsen hemorrhage by reducing tamponade effect); serum osmolality >320 mOsm/kg (increased nephrotoxicity risk); pulmonary edema or severe heart failure (initial volume expansion worsens congestion)", pearl: "Emergency dose for uncal herniation/elevated ICP: 1-1.5 g/kg IV bolus over 15-20 minutes through an in-line filter (0.22 micron -- crystallized mannitol can cause vascular occlusion); may repeat 0.25-0.5 g/kg every 4-6 hours; MUST monitor serum osmolality every 6 hours (hold if >320 mOsm/kg); insert Foley catheter BEFORE administration (massive diuresis occurs within 30-60 minutes); monitor strict I&O; replace urinary fluid losses with isotonic saline to prevent hypovolemia; when cranial nerve exam reveals a NEW blown pupil (unilateral CN III palsy), mannitol should be administered IMMEDIATELY while arranging emergent CT and neurosurgical consultation -- do NOT wait for imaging to confirm herniation if clinical signs are present" }],
        pearls: ["A NEW unilateral dilated unreactive pupil (blown pupil) in a patient with declining consciousness is a NEUROLOGICAL EMERGENCY -- it indicates CN III compression from uncal herniation (the temporal lobe uncus herniating over the tentorium cerebelli, compressing CN III and the posterior cerebral artery); notify neurosurgery IMMEDIATELY, administer IV mannitol, and prepare for emergent CT and possible surgery","The forehead sparing rule distinguishes UMN from LMN facial weakness: in a stroke (UMN lesion), only the lower face is weak because the upper face receives bilateral cortical innervation; in Bell palsy (LMN lesion), the ENTIRE half of the face is paralyzed including the forehead -- if a patient cannot wrinkle the forehead on the affected side, it is an LMN lesion","The tongue deviates TOWARD the side of a CN XII (hypoglossal) lesion on protrusion -- the paralyzed genioglossus cannot push the tongue to the opposite side, so the intact contralateral muscle pushes the tongue toward the weak side; this is the opposite of jaw deviation in CN V lesions where the jaw also deviates toward the lesion","CN VI (abducens) palsy can be a false localizing sign of elevated intracranial pressure -- the nerve has the longest intracranial course of any cranial nerve and runs along the base of the skull, making it vulnerable to stretching from generalized ICP elevation; bilateral CN VI palsies should raise immediate concern for dangerously elevated ICP","Eye protection is CRITICAL in CN VII palsy: the inability to close the eye (lagophthalmos) causes corneal exposure that can lead to corneal desiccation, ulceration, and permanent vision loss; implement artificial tears every 1-2 hours during the day and lubricating ointment with moisture chamber at night","The gag reflex tests BOTH CN IX (afferent sensory limb) and CN X (efferent motor limb) -- an absent gag reflex on one side indicates either CN IX or CN X dysfunction on that side; however, up to 20% of normal individuals have a diminished or absent gag reflex, so this finding must be interpreted in clinical context","In diabetic cranial neuropathy (CN III palsy from microvascular ischemia), the pupil is typically SPARED because the parasympathetic pupillary fibers run on the OUTSIDE of the nerve and receive their blood supply from the surface vessels, while the motor fibers in the CORE of the nerve are affected by ischemia of the vasa nervorum; this pupil-sparing pattern distinguishes diabetic CN III palsy from compressive CN III palsy (aneurysm, herniation) where the pupil is affected FIRST"],
        quiz: [{ question: "A nurse performing neurological checks on a patient with traumatic brain injury notes a newly dilated left pupil that is unreactive to light, along with increasing drowsiness. What does this finding indicate, and what is the immediate nursing action?", options: ["A normal variation in pupil size that should be documented and rechecked in 4 hours","CN III compression from left-sided uncal herniation -- IMMEDIATELY notify the neurosurgical team, prepare for emergent CT scan, and anticipate orders for IV mannitol","CN VI palsy from increased intracranial pressure -- recheck in 1 hour and document","Medication side effect from opioid analgesics -- hold the next dose"], correct: 1, rationale: "A NEW unilateral dilated unreactive pupil in a patient with declining consciousness is the hallmark of CN III compression from uncal herniation. The uncus of the temporal lobe herniates over the tentorium cerebelli, compressing the ipsilateral CN III against the posterior cerebral artery. The parasympathetic fibers on the surface of CN III are compressed first, causing loss of pupillary constriction (dilated pupil). This is a neurological emergency that can rapidly progress to brainstem compression, respiratory arrest, and death. Immediate actions include notifying neurosurgery, administering IV mannitol to reduce ICP, and arranging emergent CT." },{ question: "A patient presents with sudden onset left-sided facial weakness. The nurse observes that the patient cannot close the left eye, cannot raise the left eyebrow, and the left nasolabial fold is flattened. What is the significance of the forehead involvement?", options: ["Forehead involvement indicates a stroke until proven otherwise","Forehead involvement indicates a lower motor neuron (LMN) lesion such as Bell palsy, because the ENTIRE half of the face is affected; in an upper motor neuron stroke, the forehead would be SPARED because it receives bilateral cortical innervation","Forehead involvement is normal in all types of facial weakness and has no localizing value","Forehead involvement indicates bilateral facial nerve damage requiring emergent MRI"], correct: 1, rationale: "The forehead-sparing rule is one of the most important clinical pearls in neurology for distinguishing UMN from LMN facial weakness. The upper face (frontalis muscle, orbicularis oculi) receives motor innervation from BOTH cerebral hemispheres via the corticobulbar tracts. Therefore, a unilateral UMN lesion (such as stroke) leaves the upper face functional because the intact contralateral hemisphere maintains innervation. In contrast, an LMN lesion (Bell palsy, acoustic neuroma, temporal bone fracture) destroys the final common pathway -- the facial nerve itself -- paralyzing the ENTIRE ipsilateral face including the forehead. This patient's inability to raise the left eyebrow indicates an LMN lesion." },{ question: "Why must a nurse assess swallowing function before allowing oral intake in a patient with hoarseness and absent gag reflex on the left side?", options: ["Because the patient probably has a sore throat that makes swallowing painful","Because CN IX and CN X deficits impair the protective reflexes that prevent aspiration -- the absent gag reflex and hoarseness (from vocal cord paralysis) indicate the patient cannot adequately protect the airway during swallowing","Because hoarseness always indicates esophageal obstruction","Because the gag reflex is needed for chewing food properly"], correct: 1, rationale: "Hoarseness indicates vocal cord paralysis from CN X (vagus nerve) dysfunction -- specifically the recurrent laryngeal nerve branch. The absent gag reflex (CN IX afferent/CN X efferent) confirms pharyngeal nerve dysfunction. These deficits impair multiple protective mechanisms during swallowing: the epiglottis may not close properly over the larynx, the vocal cords cannot adduct to protect the airway, pharyngeal muscle contraction for propelling the food bolus is weakened, and the cough reflex (CN X) may be impaired. This creates a high risk of aspiration (food or liquid entering the trachea instead of the esophagus), which can cause aspiration pneumonia." }]
  },
  "cranial-nerve-functions-np": {
      "title": "Cranial Nerve Functions",
      "cellular": {
        "title": "Cranial Nerve Functional Organization",
        "content": "The twelve cranial nerves are organized by function: purely sensory (I-olfactory, II-optic, VIII-vestibulocochlear), purely motor (III-oculomotor, IV-trochlear, VI-abducens, XI-accessory, XII-hypoglossal), and mixed sensory-motor (V-trigeminal, VII-facial, IX-glossopharyngeal, X-vagus). Motor components include somatic motor (voluntary skeletal muscle), branchial motor (muscles derived from pharyngeal arches), and parasympathetic (autonomic). CN III carries parasympathetic fibers to the pupillary sphincter (constriction) and ciliary muscle (accommodation). CN VII carries parasympathetic to submandibular/sublingual glands and lacrimal gland. CN IX provides parasympathetic to the parotid gland. CN X provides parasympathetic innervation to thoracic and abdominal viscera (heart rate regulation, GI motility, bronchial smooth muscle). Understanding these functional components is essential for localizing lesions."
      },
      "riskFactors": [
        "Conditions affecting multiple cranial nerves: meningitis, carcinomatous meningitis, sarcoidosis, GBS, skull base tumors",
        "Diabetes mellitus: most common cause of isolated cranial mononeuropathy (CN III, VI, VII)",
        "Herpes zoster: Ramsay Hunt syndrome (CN VII + CN VIII from VZV reactivation in geniculate ganglion)",
        "Lyme disease: bilateral facial nerve palsy (most common infectious cause of bilateral CN VII palsy)",
        "Myasthenia gravis: fluctuating CN III, IV, VI weakness (ptosis, diplopia) worsening with fatigue",
        "Brainstem lesions: infarction, hemorrhage, demyelination (MS), tumor -- may produce crossed findings (ipsilateral CN deficit with contralateral body weakness)"
      ],
      "diagnostics": [
        "Mnemonic for CN functions: 'Some Say Marry Money But My Brother Says Big Brains Matter More' (S=Sensory, M=Motor, B=Both for CN I-XII)",
        "CN I: smell identification test; loss may indicate anterior cranial fossa lesion or early neurodegenerative disease (Parkinson, Alzheimer)",
        "CN II: afferent pupillary defect (APD/Marcus Gunn pupil) tested with swinging flashlight test; indicates optic nerve or retinal pathology",
        "CN V: three divisions (V1-ophthalmic, V2-maxillary, V3-mandibular); motor component tested by jaw clench (masseter) and lateral jaw movement (pterygoids)",
        "CN VII: taste anterior 2/3 of tongue (chorda tympani branch); motor to muscles of facial expression; parasympathetic to lacrimal, submandibular, sublingual glands",
        "CN IX and X: gag reflex (IX=afferent, X=efferent); CN X also provides motor to vocal cords (recurrent laryngeal nerve) and parasympathetic to heart/lungs/GI",
        "CN XI (spinal accessory): sternocleidomastoid (turns head to OPPOSITE side) and trapezius (shoulder shrug)",
        "CN XII (hypoglossal): tongue protrusion; LMN lesion causes ipsilateral atrophy with fasciculations, tongue deviates TOWARD lesion"
      ],
      "management": [
        "Isolated cranial mononeuropathy in diabetic: control glucose, most resolve spontaneously in 3-6 months; rule out compressive lesion if atypical features",
        "Ramsay Hunt syndrome: valacyclovir + prednisone within 72 hours (worse prognosis than Bell palsy)",
        "Myasthenia gravis: acetylcholinesterase inhibitors (pyridostigmine), immunosuppression (steroids, azathioprine), thymectomy if thymoma",
        "Multiple cranial neuropathy workup: MRI brain/brainstem with contrast, lumbar puncture (look for malignant cells, elevated protein, infection), autoimmune panel",
        "Recurrent laryngeal nerve injury (hoarseness after thyroid surgery): ENT evaluation, speech therapy; may recover spontaneously or require vocal cord medialization"
      ],
      "nursingActions": [
        "Use systematic approach to cranial nerve assessment, testing each nerve in order with specific methods",
        "Test olfaction (CN I) in trauma patients -- anosmia indicates cribriform plate fracture; also early sign of Parkinson disease",
        "Test swinging flashlight for relative afferent pupillary defect (RAPD/Marcus Gunn pupil) -- indicates optic nerve pathology ipsilateral to the abnormal pupil",
        "Assess corneal reflex in patients with decreased consciousness (afferent=CN V, efferent=CN VII)",
        "Test gag reflex before oral medications or feeding in patients with suspected bulbar dysfunction (afferent=CN IX, efferent=CN X)",
        "Document laterality and completeness of all cranial nerve deficits for serial monitoring",
        "Assess swallowing safety when CN IX, X, or XII are affected; aspiration precautions if dysphagia present"
      ],
      "assessmentFindings": [
        "CN I deficit: anosmia (may not notice until tested); bilateral = check for meningioma, neurodegenerative disease",
        "CN II: visual field cuts (bitemporal hemianopia = chiasm compression; homonymous hemianopia = retrochiasmal lesion)",
        "CN III: 'down and out' eye, ptosis, mydriasis (complete); ptosis and diplopia without pupil changes (incomplete/microvascular)",
        "CN V: facial numbness in specific division; absent corneal reflex; jaw deviation TOWARD weak side on opening",
        "CN VII motor: facial asymmetry; check upper and lower face separately to distinguish UMN from LMN",
        "CN VIII: unilateral hearing loss, tinnitus, vertigo; nystagmus (fast phase toward lesion in peripheral, variable in central)",
        "CN IX/X: absent gag, dysphagia, hoarseness, nasal voice; uvula deviates AWAY from lesion",
        "CN XII: tongue atrophy, fasciculations (LMN); deviation TOWARD lesion on protrusion"
      ],
      "signs": {
        "left": [
          "Isolated Bell palsy with complete recovery after steroid treatment",
          "Diabetic CN VI palsy resolving spontaneously",
          "Mild unilateral hearing loss with normal MRI",
          "Trigeminal neuralgia controlled with carbamazepine"
        ],
        "right": [
          "Multiple cranial nerve palsies (need urgent workup for brainstem pathology, meningeal disease, or malignancy)",
          "CN III palsy with pupil involvement -- emergent angiography for aneurysm",
          "Bilateral CN VII palsy -- evaluate for GBS, Lyme disease, sarcoidosis",
          "Progressive bulbar dysfunction with aspiration risk -- swallow evaluation and possible NG/PEG placement",
          "Horner syndrome (ptosis, miosis, anhidrosis) -- evaluate for carotid dissection, Pancoast tumor, brainstem stroke"
        ]
      },
      "medications": [
        {
          "name": "Pyridostigmine (Mestinon)",
          "type": "Acetylcholinesterase inhibitor (reversible)",
          "action": "Inhibits acetylcholinesterase at the neuromuscular junction, increasing acetylcholine availability and improving muscle contraction; primary symptomatic treatment for myasthenia gravis (which commonly presents with cranial nerve dysfunction -- ptosis, diplopia, dysphagia, dysarthria)",
          "sideEffects": "Cholinergic effects: increased salivation, lacrimation, urination, defecation, GI cramping, emesis (SLUDGE mnemonic); bradycardia, miosis, bronchospasm; cholinergic crisis if overdosed (weakness WORSENS paradoxically)",
          "contra": "Mechanical GI or urinary obstruction; caution with asthma/COPD (bronchospasm)",
          "pearl": "Start 30 mg TID, increase gradually to 60-120 mg q4-6h based on response; take 30-60 minutes BEFORE meals for dysphagia; cholinergic crisis vs myasthenic crisis: both cause weakness -- edrophonium test (Tensilon) historically used to differentiate (improvement = myasthenic crisis; worsening = cholinergic crisis); now rarely used due to risk -- clinical assessment and dose reduction preferred"
        }
      ],
      "pearls": [
        "CN mnemonic: 'Oh Oh Oh To Touch And Feel Very Good Velvet AH' = Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Vestibulocochlear, Glossopharyngeal, Vagus, Accessory, Hypoglossal",
        "Sensory/Motor/Both: 'Some Say Marry Money But My Brother Says Big Brains Matter More' (I-S, II-S, III-M, IV-M, V-B, VI-M, VII-B, VIII-S, IX-B, X-B, XI-M, XII-M)",
        "SCM turns head to OPPOSITE side (left SCM turns head right); test CN XI by having patient turn head against resistance -- feel/observe the CONTRALATERAL SCM",
        "Marcus Gunn pupil (RAPD): on swinging flashlight test, the affected pupil DILATES when light is swung to it (because the optic nerve cannot detect the light as well as the contralateral nerve)",
        "Brainstem crossed syndromes: ipsilateral cranial nerve deficit + contralateral body weakness = brainstem lesion at the level of that cranial nerve",
        "Vagus nerve (CN X) is the 'wanderer' -- provides parasympathetic innervation to heart (bradycardia), lungs (bronchoconstriction), and GI tract (increased motility) down to the splenic flexure"
      ],
      "quiz": [
        {
          "question": "When testing CN XI (spinal accessory), a patient is asked to turn their head to the right against resistance. Which muscle is being tested?",
          "options": [
            "Right sternocleidomastoid",
            "Left sternocleidomastoid",
            "Right trapezius",
            "Left trapezius"
          ],
          "correct": 1,
          "rationale": "The sternocleidomastoid turns the head to the OPPOSITE side. Therefore, turning the head to the RIGHT tests the LEFT sternocleidomastoid. The SCM originates from the sternum and clavicle and inserts on the mastoid process -- contraction pulls the head toward the opposite side."
        },
        {
          "question": "During a swinging flashlight test, the left pupil dilates when the light swings from the right eye to the left eye. What does this indicate?",
          "options": [
            "Left CN III palsy",
            "Left relative afferent pupillary defect (Marcus Gunn pupil) indicating left optic nerve pathology",
            "Right optic nerve damage",
            "Normal finding"
          ],
          "correct": 1,
          "rationale": "A relative afferent pupillary defect (RAPD/Marcus Gunn pupil) indicates damage to the afferent limb (CN II/optic nerve) of the affected eye. When light is swung to the damaged left eye, it perceives less light than the right eye did, so BOTH pupils dilate paradoxically (as if the light were being removed rather than applied)."
        },
        {
          "question": "Which cranial nerve provides parasympathetic innervation to the heart, lungs, and GI tract down to the splenic flexure?",
          "options": [
            "CN VII (facial)",
            "CN IX (glossopharyngeal)",
            "CN X (vagus)",
            "CN XII (hypoglossal)"
          ],
          "correct": 2,
          "rationale": "The vagus nerve (CN X) is the major parasympathetic nerve, providing innervation to the heart (slows heart rate), lungs (bronchoconstriction), and GI tract from the esophagus to the splenic flexure of the colon. Below the splenic flexure, parasympathetic innervation comes from the pelvic splanchnic nerves (S2-S4)."
        }
      ]
    },
  "craniopharyngioma-np": {
      "title": "Craniopharyngioma",
      "cellular": {
        "title": "Craniopharyngioma Pathology",
        "content": "Craniopharyngioma is a benign but locally aggressive epithelial tumor arising from Rathke pouch remnants along the craniopharyngeal duct. Two histologic subtypes exist: adamantinomatous (children/adolescents, calcifications, cystic with machinery oil-like fluid, CTNNB1 beta-catenin mutations) and papillary (adults, solid, rarely calcified, BRAF V600E mutations). These tumors grow in the sellar/suprasellar region, compressing the optic chiasm (bitemporal hemianopia), pituitary gland (hypopituitarism), hypothalamus (obesity, temperature dysregulation, behavioral changes), and third ventricle (obstructive hydrocephalus). Despite being histologically benign (WHO Grade I), they cause significant morbidity due to their critical location and high recurrence rate (20-50% after surgery)."
      },
      "riskFactors": [
        "Bimodal age distribution: childhood peak (5-14 years) and adult peak (50-74 years)",
        "No established environmental or genetic risk factors for sporadic cases",
        "Adamantinomatous subtype: CTNNB1 mutations (beta-catenin pathway)",
        "Papillary subtype: BRAF V600E mutation (targetable with BRAF inhibitors)",
        "Prior subtotal resection: high recurrence rate (50% within 10 years)",
        "Radiation-naive status: adjuvant radiation reduces recurrence after subtotal resection"
      ],
      "diagnostics": [
        "Brain MRI with contrast: mixed solid/cystic mass in sellar/suprasellar region; calcifications best seen on CT (90% of adamantinomatous type calcify)",
        "Visual field testing: bitemporal hemianopia from optic chiasm compression (most common visual field defect)",
        "Complete pituitary hormone panel: GH (growth failure in children), TSH/free T4, ACTH/cortisol (morning cortisol <3 = adrenal insufficiency), LH/FSH, prolactin, ADH (diabetes insipidus)",
        "Water deprivation test: diagnose diabetes insipidus (failure to concentrate urine despite dehydration)",
        "CT head: calcifications in sellar/suprasellar region (highly suggestive of adamantinomatous craniopharyngioma in children)",
        "Formal ophthalmologic examination: visual acuity, visual fields, fundoscopy"
      ],
      "management": [
        "Surgical resection: gross total resection when feasible without unacceptable hypothalamic/optic damage; transcranial or transsphenoidal approach depending on location",
        "Subtotal resection + radiation: preferred over aggressive total resection when hypothalamic involvement is significant (reduces hypothalamic obesity risk)",
        "Radiation therapy: conventional fractionated RT or proton beam therapy for residual/recurrent disease; stereotactic radiosurgery for small solid residual",
        "BRAF inhibitor (dabrafenib) + MEK inhibitor (trametinib): emerging targeted therapy for papillary craniopharyngiomas with BRAF V600E mutation",
        "Hormone replacement: lifelong in most patients -- levothyroxine, hydrocortisone, growth hormone, sex hormones, desmopressin (for DI)",
        "Intracystic therapy: interferon-alpha or bleomycin instillation for predominantly cystic tumors (palliative)",
        "Hypothalamic obesity management: most refractory to conventional diet/exercise; GLP-1 agonists, bariatric surgery considered"
      ],
      "nursingActions": [
        "Perform comprehensive endocrine assessment pre-operatively: pituitary hormone panel, assess for diabetes insipidus (polyuria, polydipsia, low urine osmolality)",
        "Monitor strict I&O post-operatively: diabetes insipidus may develop acutely after surgery (UOP >300 mL/hr, dilute urine, rising serum sodium)",
        "Administer stress-dose hydrocortisone peri-operatively if cortisol axis deficient (adrenal crisis prevention)",
        "Monitor visual fields pre- and post-operatively (improvement in bitemporal hemianopia is expected after successful decompression)",
        "Assess for signs of obstructive hydrocephalus: headache, nausea/vomiting, altered mental status, papilledema",
        "Coordinate multidisciplinary care: endocrinology, neurosurgery, ophthalmology, radiation oncology",
        "Educate patient/family on lifelong hormone replacement and medical alert identification for adrenal insufficiency"
      ],
      "assessmentFindings": [
        "Visual disturbance: bitemporal hemianopia (optic chiasm compression) -- patients bump into things on both sides, difficulty with peripheral vision",
        "Growth failure in children (GH deficiency -- often the first endocrine symptom)",
        "Headache (mass effect, hydrocephalus)",
        "Diabetes insipidus: polyuria (large volumes of dilute urine), polydipsia, nocturia",
        "Hypothyroidism symptoms: fatigue, weight gain, cold intolerance, constipation",
        "Adrenal insufficiency: fatigue, hypotension, electrolyte abnormalities",
        "Obesity (hypothalamic involvement -- occurs in 50% of patients, often refractory to treatment)",
        "Delayed or arrested puberty in adolescents"
      ],
      "signs": {
        "left": [
          "Small incidental craniopharyngioma found on imaging without visual or endocrine compromise -- monitor with serial MRI",
          "Stable residual tumor post-surgery and radiation without growth on surveillance imaging",
          "Well-managed endocrine deficiencies on hormone replacement"
        ],
        "right": [
          "Acute visual loss from tumor enlargement or cyst expansion compressing the optic chiasm -- urgent neurosurgical intervention",
          "Obstructive hydrocephalus: acute headache, vomiting, altered consciousness -- emergent CSF diversion (EVD or shunt)",
          "Adrenal crisis: hypotension, altered mental status from cortisol deficiency -- emergent IV hydrocortisone",
          "Severe post-operative diabetes insipidus: massive polyuria with hypernatremia if not managed",
          "Hypothalamic obesity: severe weight gain refractory to lifestyle interventions"
        ]
      },
      "medications": [
        {
          "name": "Desmopressin (DDAVP)",
          "type": "Synthetic ADH analogue (V2 receptor agonist)",
          "action": "Selectively activates vasopressin V2 receptors on the basolateral membrane of collecting duct principal cells, inserting aquaporin-2 water channels in the apical membrane; increases water reabsorption and produces concentrated urine; replaces deficient ADH in central diabetes insipidus caused by craniopharyngioma or post-surgical pituitary stalk damage",
          "sideEffects": "Hyponatremia (most serious -- water intoxication if fluid intake not restricted), headache, nausea, nasal congestion (intranasal form), flushing",
          "contra": "Hyponatremia, habitual polydipsia (psychogenic), type IIb von Willebrand disease, moderate-severe renal impairment",
          "pearl": "Available as oral tablet, sublingual melt, nasal spray, or IV/SC injection; for DI management: intranasal 10-40 mcg/day divided BID or oral 0.1-1.2 mg/day divided BID-TID; titrate based on urine output and serum sodium; educate patients to have a 'free water day' or skip a dose periodically to avoid hyponatremia from over-replacement; monitor serum sodium regularly"
        }
      ],
      "pearls": [
        "Craniopharyngioma is the most common suprasellar tumor in children -- think of it when a child presents with growth failure + visual field deficits + calcifications on imaging",
        "Adamantinomatous (children): calcified, cystic with 'machinery oil' fluid, CTNNB1 mutation; Papillary (adults): solid, non-calcified, BRAF V600E mutation (targetable)",
        "Bitemporal hemianopia = optic chiasm compression (nasal retinal fibers cross at chiasm; these carry temporal visual fields from both eyes)",
        "Hypothalamic obesity occurs in ~50% of craniopharyngioma patients and is the most debilitating long-term complication -- extremely resistant to diet/exercise due to disrupted satiety signaling",
        "Post-operative diabetes insipidus may follow a TRIPHASIC pattern: DI (days 1-5) → SIADH (days 5-10, from dying neurons releasing stored ADH) → permanent DI (if stalk is damaged)",
        "Most patients require lifelong hormone replacement for multiple pituitary axes -- always assess and replace cortisol BEFORE thyroid hormone (giving T4 without cortisol can precipitate adrenal crisis)"
      ],
      "quiz": [
        {
          "question": "A 9-year-old presents with headaches, growth failure, and bitemporal hemianopia. Brain MRI shows a calcified cystic mass in the suprasellar region. What is the most likely diagnosis?",
          "options": [
            "Pituitary adenoma",
            "Craniopharyngioma (adamantinomatous type)",
            "Optic glioma",
            "Meningioma"
          ],
          "correct": 1,
          "rationale": "A calcified cystic suprasellar mass in a child with growth failure and bitemporal hemianopia is classic for adamantinomatous craniopharyngioma. Pituitary adenomas rarely calcify and are uncommon in children. The growth failure indicates GH deficiency from pituitary compression, and bitemporal hemianopia indicates optic chiasm compression."
        },
        {
          "question": "After craniopharyngioma resection, a patient develops urine output of 500 mL/hour with serum sodium rising to 152. What complication has occurred?",
          "options": [
            "SIADH",
            "Central diabetes insipidus from pituitary stalk damage",
            "Cerebral salt wasting",
            "Normal post-operative diuresis"
          ],
          "correct": 1,
          "rationale": "Massive polyuria with dilute urine and rising serum sodium post-craniopharyngioma surgery indicates central diabetes insipidus from disruption of the pituitary stalk or posterior pituitary. ADH (vasopressin) is no longer released, so the kidneys cannot concentrate urine. Treatment is desmopressin (DDAVP) and careful fluid management."
        },
        {
          "question": "Why must cortisol replacement be started BEFORE thyroid hormone replacement in panhypopituitarism?",
          "options": [
            "Thyroid hormone is not important in pituitary failure",
            "Levothyroxine increases metabolic rate, which accelerates cortisol clearance and can precipitate adrenal crisis in a cortisol-deficient patient",
            "Cortisol blocks thyroid hormone absorption",
            "They have a drug interaction"
          ],
          "correct": 1,
          "rationale": "In panhypopituitarism, starting levothyroxine before cortisol replacement is dangerous. Thyroid hormone increases the metabolic rate, accelerating cortisol metabolism. In a cortisol-deficient patient, this accelerated clearance can precipitate a life-threatening adrenal crisis. Always replace cortisol (hydrocortisone) first, then add levothyroxine."
        }
      ]
    },
  "creutzfeldt-jakob-np": {
      "title": "Creutzfeldt-Jakob Disease",
      "cellular": {
        "title": "Prion Disease Pathogenesis",
        "content": "Creutzfeldt-Jakob disease (CJD) is a rapidly progressive and universally fatal transmissible spongiform encephalopathy caused by prions -- misfolded isoforms (PrPSc) of normal cellular prion protein (PrPC). PrPSc acts as a template, converting normal PrPC into the pathological conformation through a self-propagating cascade. The misfolded proteins are resistant to proteases, heat, radiation, and standard sterilization. Accumulation of PrPSc causes neuronal vacuolation (spongiform change), astrogliosis, and neuronal death without inflammatory infiltrate. Forms include sporadic CJD (85%, mean age 65, unknown trigger), familial/genetic CJD (10-15%, PRNP gene mutations), iatrogenic CJD (contaminated surgical instruments, dura mater grafts, cadaveric pituitary hormones), and variant CJD (vCJD, bovine spongiform encephalopathy/mad cow disease, younger patients, psychiatric symptoms, 'florid plaques')."
      },
      "riskFactors": [
        "Sporadic CJD: advanced age (peak 60-70 years), unknown precipitant -- most common form (85%)",
        "Genetic CJD: PRNP gene mutations (autosomal dominant); family history of rapid dementia",
        "Iatrogenic CJD: prior neurosurgical procedures with contaminated instruments, dura mater grafts (Lyodura), cadaveric growth hormone or gonadotropins (historical)",
        "Variant CJD (vCJD): exposure to BSE-contaminated beef products (primarily UK in 1990s-2000s); younger age (median 28 years); methionine homozygosity at codon 129 of PRNP gene",
        "Corneal transplant from infected donor (rare)",
        "No risk from casual contact, airborne transmission, or blood transfusion for sporadic CJD (though vCJD has been transmitted by blood)"
      ],
      "diagnostics": [
        "Brain MRI (DWI/FLAIR): cortical ribboning (high signal in cortical gyri) and basal ganglia hyperintensity (caudate and putamen) -- most sensitive early test for sporadic CJD",
        "EEG: periodic sharp wave complexes (PSWCs) at 1-2 Hz -- present in 60-70% of sporadic CJD (not seen in vCJD)",
        "CSF biomarkers: RT-QuIC assay (real-time quaking-induced conversion) -- 97% sensitivity and ~100% specificity for prion disease; CSF 14-3-3 protein (marker of rapid neuronal destruction, less specific); total tau elevated",
        "Definitive diagnosis: brain biopsy or autopsy showing spongiform change, PrPSc immunohistochemistry, protease-resistant prion protein",
        "PRNP gene analysis: identifies familial CJD mutations and codon 129 polymorphism (M/M homozygosity = higher susceptibility)",
        "Variant CJD differences: MRI shows 'pulvinar sign' (bilateral pulvinar thalamic hyperintensity); no PSWCs on EEG; tonsil biopsy positive for PrPSc"
      ],
      "management": [
        "No cure or disease-modifying treatment exists -- CJD is uniformly fatal (median survival: sporadic 5 months, vCJD 14 months)",
        "Supportive care: comfort measures, symptom management (myoclonus -- clonazepam; seizures -- levetiracetam; psychiatric symptoms -- low-dose antipsychotics)",
        "Palliative care: early and ongoing; goals of care discussion; advance directives",
        "Infection prevention: prions are NOT destroyed by autoclaving, ethylene oxide, alcohol, formaldehyde, or ionizing radiation; WHO guidelines: disposable instruments for suspected cases or decontamination with 1N NaOH for 1 hour or immersion in sodium hypochlorite (20,000 ppm) for 1 hour followed by autoclaving at 134°C for 18 minutes",
        "Notification: CJD is a reportable disease; refer brain tissue for definitive diagnosis at autopsy to prion surveillance center"
      ],
      "nursingActions": [
        "Recognize the clinical presentation: rapidly progressive dementia (weeks to months, NOT years), myoclonus, cerebellar ataxia, visual disturbances, and akinetic mutism (late stage)",
        "Order appropriate diagnostics urgently: brain MRI with DWI, EEG, CSF for RT-QuIC and 14-3-3 protein",
        "Implement special infection control precautions: standard precautions are adequate for routine care; prion-specific decontamination for surgical instruments and tissue handling",
        "Refer for palliative care early given universally fatal prognosis",
        "Provide compassionate family education: explain the prion disease mechanism, expected trajectory, and that there is no treatment to alter the course",
        "Coordinate with public health for disease reporting",
        "Ensure advance directive completion while patient retains any decision-making capacity (early in disease course)",
        "Handle tissue specimens with caution: label as 'prion precaution'; notify pathology/laboratory for special handling"
      ],
      "assessmentFindings": [
        "Rapidly progressive dementia: cognitive decline over WEEKS to months (not years -- this distinguishes CJD from Alzheimer disease)",
        "Myoclonus: involuntary jerking movements, often stimulus-sensitive (startle myoclonus)",
        "Cerebellar ataxia: gait instability, dysarthria, limb incoordination",
        "Visual disturbances: cortical blindness, visual hallucinations (Heidenhain variant)",
        "Psychiatric symptoms: depression, anxiety, apathy, psychosis (especially prominent in vCJD as presenting feature)",
        "Akinetic mutism (late stage): awake-appearing but unable to move or speak",
        "Extrapyramidal signs: rigidity, bradykinesia",
        "Pyramidal signs: hyperreflexia, extensor plantar responses"
      ],
      "signs": {
        "left": [
          "There are no 'stable' presentations of CJD -- all forms are rapidly progressive and fatal",
          "Early cognitive changes may initially be attributed to depression, anxiety, or early Alzheimer disease"
        ],
        "right": [
          "Rapidly progressive dementia over weeks with myoclonus -- urgent neurological evaluation for CJD",
          "Akinetic mutism: patient appears awake but is unresponsive (late-stage CJD)",
          "Status myoclonus: continuous myoclonic jerking requiring clonazepam",
          "Aspiration pneumonia from dysphagia in advanced disease",
          "Death typically occurs within 1 year of symptom onset (sporadic CJD)"
        ]
      },
      "medications": [
        {
          "name": "Clonazepam (Klonopin)",
          "type": "Benzodiazepine (GABA-A receptor agonist)",
          "action": "Enhances GABA-A receptor function, increasing chloride conductance and neuronal inhibition; used symptomatically for myoclonus in CJD (no disease-modifying therapies exist)",
          "sideEffects": "Sedation, respiratory depression, paradoxical agitation, dependence, cognitive worsening (may be difficult to distinguish from disease progression in CJD)",
          "contra": "Severe respiratory insufficiency, acute narrow-angle glaucoma",
          "pearl": "Used for symptom management of myoclonus in CJD; start low dose (0.5 mg BID) and titrate to effect; alternative: levetiracetam for myoclonus with less sedation; valproic acid also used; no medication alters the disease course -- all treatment is palliative"
        }
      ],
      "pearls": [
        "CJD causes rapidly progressive dementia over WEEKS to MONTHS -- if cognitive decline is over YEARS, think Alzheimer disease; if WEEKS, think CJD or autoimmune encephalitis",
        "RT-QuIC (real-time quaking-induced conversion) is the most specific CSF test for CJD (97% sensitive, ~100% specific) -- has largely replaced 14-3-3 protein testing",
        "Prions are NOT destroyed by standard sterilization: autoclaving, alcohol, formaldehyde, and radiation are INEFFECTIVE; requires 1N NaOH or concentrated bleach + extended autoclaving",
        "MRI DWI showing cortical ribboning and basal ganglia hyperintensity is the most sensitive imaging finding for sporadic CJD",
        "EEG periodic sharp wave complexes are seen in sporadic CJD but NOT variant CJD",
        "Variant CJD (vCJD) differs: younger patients, prominent psychiatric symptoms as presenting feature, 'pulvinar sign' on MRI, positive tonsil biopsy, NO EEG sharp waves, and is associated with BSE-contaminated beef"
      ],
      "quiz": [
        {
          "question": "A 67-year-old develops rapidly progressive cognitive decline, myoclonus, and ataxia over 8 weeks. MRI shows cortical ribboning on DWI and bilateral caudate hyperintensity. What is the most likely diagnosis?",
          "options": [
            "Alzheimer disease",
            "Sporadic Creutzfeldt-Jakob disease",
            "Lewy body dementia",
            "Vascular dementia"
          ],
          "correct": 1,
          "rationale": "Rapidly progressive dementia over weeks with myoclonus, ataxia, and characteristic MRI findings (cortical ribboning, basal ganglia hyperintensity on DWI) is classic for sporadic CJD. Alzheimer disease progresses over years, not weeks. This presentation warrants urgent CSF RT-QuIC testing."
        },
        {
          "question": "Which sterilization method is effective against prions?",
          "options": [
            "Standard autoclaving (121°C for 15 minutes)",
            "70% isopropyl alcohol",
            "1N sodium hydroxide for 1 hour followed by autoclaving at 134°C for 18 minutes",
            "Ethylene oxide gas sterilization"
          ],
          "correct": 2,
          "rationale": "Prions are extraordinarily resistant to standard sterilization methods including autoclaving, alcohol, formaldehyde, ethylene oxide, UV light, and ionizing radiation. WHO guidelines recommend 1N NaOH for 1 hour or sodium hypochlorite (20,000 ppm) for 1 hour, followed by autoclaving at 134°C for 18 minutes for instruments contaminated with prion tissue."
        },
        {
          "question": "What distinguishes variant CJD (vCJD) from sporadic CJD?",
          "options": [
            "vCJD progresses more slowly than sporadic CJD",
            "vCJD presents in younger patients with prominent psychiatric symptoms, shows the pulvinar sign on MRI, and does NOT have periodic sharp waves on EEG",
            "vCJD is caused by PRNP gene mutations",
            "vCJD has a better prognosis than sporadic CJD"
          ],
          "correct": 1,
          "rationale": "Variant CJD (linked to BSE/mad cow disease) differs from sporadic CJD: younger age (median 28 vs 65), psychiatric symptoms as presenting feature (depression, anxiety, behavioral changes), pulvinar sign on MRI (bilateral thalamic hyperintensity), ABSENCE of periodic sharp waves on EEG, and positive tonsil biopsy. Both are universally fatal."
        }
      ]
    },
  "crisis-intervention": {
      "title": "Crisis Intervention",
      "cellular": {
        "title": "Neurobiological Basis of Crisis Response",
        "content": "A psychological crisis occurs when an individual's coping mechanisms are overwhelmed by a stressful event, leading to acute emotional disequilibrium. Neurobiologically, the stress response activates the hypothalamic-pituitary-adrenal (HPA) axis and sympathetic nervous system, releasing cortisol and catecholamines. In crisis, the prefrontal cortex (rational thinking, executive function) is overwhelmed by amygdala-driven emotional reactivity, impairing decision-making and problem-solving. The goal of crisis intervention is to reduce immediate distress, restore pre-crisis functioning, and connect the individual with ongoing support. Crisis intervention follows a time-limited model (typically 4-6 weeks) based on the principle that crisis states are inherently self-limiting -- the person will either adaptively resolve the crisis, maladaptively cope (substance use, avoidance), or decompensate further without intervention."
      },
      "riskFactors": [
        "Recent significant loss: death of loved one, divorce, job loss, financial crisis",
        "History of prior suicide attempts (strongest predictor of future attempts)",
        "Mental health disorders: depression, bipolar disorder, schizophrenia, PTSD, substance use disorders",
        "Social isolation and lack of support systems",
        "Exposure to trauma: sexual assault, domestic violence, natural disaster, mass casualty event",
        "Access to lethal means (firearms, medications, bridges)",
        "Recent discharge from psychiatric hospitalization (highest risk period: first week post-discharge)",
        "Chronic pain or terminal illness diagnosis",
        "Identity-related stressors: LGBTQ+ youth facing rejection, discrimination, bullying",
        "Military veterans: higher rates of PTSD, TBI, and suicide"
      ],
      "diagnostics": [
        "Suicide risk assessment: ask directly about suicidal ideation, plan, intent, means, and timeline (asking does NOT increase risk -- it demonstrates care and opens communication)",
        "Columbia Suicide Severity Rating Scale (C-SSRS): standardized screening tool for suicidal ideation and behavior",
        "PHQ-9 item 9: screens for suicidal ideation ('Thoughts that you would be better off dead')",
        "SAD PERSONS scale: Sex (male), Age (<19 or >45), Depression, Previous attempt, Ethanol abuse, Rational thinking loss, Social supports lacking, Organized plan, No spouse, Sickness",
        "Safety assessment: access to lethal means (firearms, medications, sharps), protective factors (children, pets, religious beliefs, future plans, therapeutic alliance)",
        "Mental status exam: affect, thought process, thought content (SI/HI/psychosis), insight, judgment",
        "Distinguish crisis from psychiatric emergency: crisis = emotional disequilibrium with intact reality; psychiatric emergency = imminent danger to self/others requiring involuntary intervention"
      ],
      "management": [
        "Establish rapport and therapeutic relationship immediately: active listening, empathy, non-judgmental approach, validate emotions",
        "Ensure safety: assess and restrict access to lethal means (firearms counseling, medication lock-up); involuntary psychiatric hold if imminent danger",
        "Crisis stabilization: de-escalation techniques, brief cognitive interventions (reality testing, reframing), problem-solving support",
        "Safety planning (Stanley-Brown Safety Plan): 1) Warning signs, 2) Internal coping strategies, 3) Social contacts for distraction, 4) Family/friends who can help, 5) Professionals/agencies to contact, 6) Means restriction",
        "Crisis hotline referral: 988 Suicide and Crisis Lifeline (call or text 988), Crisis Text Line (text HOME to 741741)",
        "Medication if needed: short-term anxiolytics for acute anxiety (avoid benzodiazepines in substance use), antipsychotics for acute agitation, rapid-acting antidepressant consideration (ketamine/esketamine for acute suicidality in refractory depression)",
        "Follow-up: scheduled contact within 24-48 hours; warm handoff to outpatient mental health; caring contacts (brief check-in calls/texts reduce suicide risk)"
      ],
      "nursingActions": [
        "Screen all patients for suicidal ideation using validated tools (C-SSRS, PHQ-9 item 9) at every encounter in appropriate settings",
        "Ask directly about suicidal thoughts: 'Are you thinking about killing yourself?' (direct question is more effective than euphemisms)",
        "If suicide risk identified: do not leave patient alone, remove lethal means from the environment, initiate one-to-one observation, notify provider",
        "Develop collaborative safety plan with the patient (NOT a 'no-suicide contract' which is ineffective and creates false reassurance)",
        "De-escalate agitated patients: use calm voice, open body language, offer choices, maintain safe distance, avoid confrontation",
        "Assess protective factors: reasons for living, family connections, religious/cultural beliefs, future plans, children/pets dependent on patient",
        "Coordinate warm handoff to outpatient mental health services (do not simply give a phone number -- make the connection before discharge)",
        "Document suicide risk assessment, safety plan, means restriction counseling, and follow-up plan in detail"
      ],
      "assessmentFindings": [
        "Emotional: overwhelming anxiety, fear, anger, hopelessness, helplessness, numbness",
        "Cognitive: difficulty concentrating, impaired decision-making, tunnel vision, racing thoughts, preoccupation with the crisis event",
        "Behavioral: crying, agitation, pacing, social withdrawal, substance use increase, reckless behavior, giving away possessions",
        "Physiological: insomnia, anorexia, fatigue, headache, GI distress, chest tightness, hyperventilation",
        "Suicidal ideation indicators: hopelessness ('There's no way out'), perceived burdensomeness ('Everyone would be better off without me'), thwarted belonging, giving away possessions, saying goodbye, sudden calmness after period of depression (may indicate decision to act)",
        "Homicidal ideation indicators: specific threats, identified target, plan, access to means, history of violence"
      ],
      "signs": {
        "left": [
          "Patient in emotional distress with intact coping and social supports -- brief intervention and follow-up",
          "Passive suicidal ideation without plan or intent ('I wish I wouldn't wake up') -- safety planning and outpatient referral",
          "Crisis triggered by identifiable stressor with clear path to resolution",
          "Patient engaging in safety planning and expressing willingness to seek help"
        ],
        "right": [
          "Active suicidal ideation with plan, intent, and access to means -- psychiatric emergency",
          "Suicide attempt in progress or immediately after an attempt -- medical stabilization and psychiatric evaluation",
          "Homicidal ideation with specific target and plan -- duty to warn (Tarasoff)",
          "Psychotic crisis with command auditory hallucinations to harm self/others -- involuntary psychiatric evaluation",
          "Patient who is calm after prolonged depression and is giving away possessions (may indicate decision to act on suicide plan)"
        ]
      },
      "medications": [
        {
          "name": "No specific 'crisis intervention' medication",
          "type": "Psychiatric emergency pharmacotherapy",
          "action": "Medications target specific symptoms: lorazepam 1-2 mg PO/IM for acute anxiety (avoid in substance use); haloperidol 5 mg IM + diphenhydramine 25 mg IM + lorazepam 2 mg IM ('B52' cocktail variant) for severe agitation; olanzapine 10 mg IM for agitation (do NOT combine with IM benzodiazepines); ketamine/esketamine for acute suicidal ideation in refractory depression (rapid-acting)",
          "sideEffects": "Benzodiazepines: respiratory depression, paradoxical agitation, disinhibition, dependence; antipsychotics: EPS, QTc prolongation, hypotension; ketamine: dissociation, BP elevation, nausea",
          "contra": "Benzodiazepines: respiratory compromise, active substance intoxication; IM olanzapine + IM benzodiazepines: risk of fatal cardiorespiratory depression (do NOT combine)",
          "pearl": "The therapeutic relationship and crisis intervention techniques are MORE important than medication; medication is adjunctive for specific symptoms (agitation, severe anxiety, psychosis, insomnia); safety planning is more effective than 'no-suicide contracts'; 988 Suicide and Crisis Lifeline is the national resource (call or text 988)"
        }
      ],
      "pearls": [
        "Asking about suicide does NOT increase risk -- it opens communication and demonstrates care; direct questions are more effective than indirect ('Are you thinking about killing yourself?' not 'You're not thinking about hurting yourself, are you?')",
        "Safety planning (Stanley-Brown model) is MORE effective than no-suicide contracts -- contracts create false reassurance and have no evidence of effectiveness",
        "Means restriction is the MOST effective suicide prevention strategy: removing access to firearms reduces overall suicide rates (not just firearm suicide -- people do not simply substitute methods)",
        "The highest risk period for suicide after psychiatric discharge is the FIRST WEEK -- ensure follow-up contact within 24-48 hours",
        "Risk factors for completed suicide differ by demographics: males use more lethal methods (firearms); females attempt more frequently; elderly males have the highest completion rate",
        "Protective factors to assess: reasons for living, children in the home, religious/cultural beliefs against suicide, therapeutic alliance, future-oriented thinking",
        "The '988' number (Suicide and Crisis Lifeline) replaced the old 1-800-273-TALK number -- know this for patient education"
      ],
      "quiz": [
        {
          "question": "A patient with depression states 'Everyone would be better off without me. I've been thinking about using my husband's gun.' What is the PRIORITY nursing action?",
          "options": [
            "Administer an antidepressant medication",
            "Ask about the husband's gun and initiate means restriction counseling",
            "Document the statement and continue the assessment",
            "Refer the patient to outpatient therapy"
          ],
          "correct": 1,
          "rationale": "This patient has active suicidal ideation with an identified plan (shooting) and access to means (husband's gun). The priority is to assess access to the means and initiate means restriction (secure or remove the firearm). Means restriction is the single most effective suicide prevention intervention. The patient should not be left alone and requires immediate further assessment and safety planning."
        },
        {
          "question": "Which suicide prevention intervention has the strongest evidence?",
          "options": [
            "No-suicide contracts",
            "Means restriction (reducing access to lethal means)",
            "Long-term psychoanalytic therapy",
            "Medication alone"
          ],
          "correct": 1,
          "rationale": "Means restriction has the strongest evidence for suicide prevention. Studies consistently show that reducing access to lethal means (especially firearms) reduces suicide rates. People in suicidal crisis often act impulsively -- if the most lethal means is unavailable, they may not substitute another method. No-suicide contracts have NO evidence of effectiveness."
        },
        {
          "question": "A patient who has been severely depressed for weeks suddenly appears calm, gives away personal belongings, and says goodbye to staff. What should the nurse suspect?",
          "options": [
            "The patient's depression is resolving",
            "The patient may have decided to act on a suicide plan and needs immediate reassessment",
            "The patient is responding to medication",
            "This is a normal part of recovery"
          ],
          "correct": 1,
          "rationale": "Sudden calmness after prolonged severe depression, giving away possessions, and saying goodbye are WARNING SIGNS that the patient may have made the decision to act on a suicide plan. The sense of peace comes from having resolved the internal conflict by deciding to die. This requires immediate reassessment of suicidal ideation, safety planning, and increased observation."
        }
      ]
    },
  "criteria-fulfillment-np": {
      "title": "Diagnostic Criteria Fulfillment",
      "cellular": {
        "title": "Applying Diagnostic Criteria in Clinical Practice",
        "content": "Diagnostic criteria fulfillment is the systematic process of evaluating clinical findings against established diagnostic standards (DSM-5 for psychiatric disorders, ACR/EULAR for rheumatologic conditions, Jones criteria for rheumatic fever, Duke criteria for endocarditis, etc.). Evidence-based criteria typically include major and minor criteria, with specified combinations required for diagnosis. Sensitivity-oriented criteria cast a wider net (fewer missed cases, more false positives); specificity-oriented criteria are more restrictive (fewer false positives, may miss atypical presentations). The NP must understand which criteria apply, how to apply them correctly, and when clinical judgment should override strict criteria adherence (criteria are guides, not absolute rules -- atypical presentations may not meet criteria but still warrant treatment)."
      },
      "riskFactors": [
        "Diagnostic errors from incorrect criteria application: using outdated criteria, misinterpreting criteria, not applying the correct criteria set for the clinical question",
        "Atypical presentations: elderly, immunosuppressed, and pediatric patients may not meet standard criteria",
        "Cultural and linguistic barriers affecting symptom reporting and criteria assessment",
        "Over-reliance on criteria without clinical judgment (missing diagnoses in atypical presentations)",
        "Under-application of criteria (diagnosing without meeting established thresholds, leading to overdiagnosis and unnecessary treatment)",
        "Time pressure leading to incomplete criteria evaluation"
      ],
      "diagnostics": [
        "Rheumatic fever (revised Jones criteria): requires evidence of preceding GAS infection PLUS 2 major or 1 major + 2 minor criteria; Major: carditis, migratory polyarthritis, Sydenham chorea, erythema marginatum, subcutaneous nodules; Minor: fever, polyarthralgia, elevated ESR/CRP, prolonged PR interval",
        "Infective endocarditis (modified Duke criteria): 2 major, or 1 major + 3 minor, or 5 minor; Major: positive blood cultures (typical organisms in ≥2 cultures), endocardial involvement on echo (vegetation, abscess, dehiscence); Minor: predisposing condition, fever, vascular phenomena, immunologic phenomena, microbiologic evidence not meeting major",
        "SLE (ACR/EULAR 2019): entry criterion ANA ≥1:80; then additive weighted criteria across 7 clinical domains (constitutional, hematologic, neuropsychiatric, mucocutaneous, serosal, musculoskeletal, renal) and 3 immunology domains (anti-dsDNA, anti-Sm, complement, antiphospholipid); score ≥10 = SLE",
        "Sepsis (Sepsis-3): suspected infection + SOFA score increase ≥2 points (qSOFA for bedside screening: altered mental status, SBP ≤100, RR ≥22 -- 2 of 3 = high risk)",
        "SIRS criteria (older): ≥2 of: temp >38°C or <36°C, HR >90, RR >20 or PaCO2 <32, WBC >12k or <4k or >10% bands"
      ],
      "management": [
        "Apply appropriate diagnostic criteria systematically for the suspected condition",
        "Document which criteria are met and which are not -- this supports clinical reasoning and medicolegal documentation",
        "When criteria are borderline or partially met: consider repeat evaluation over time, additional testing, or specialist consultation",
        "Recognize that criteria evolve: use the most current version (e.g., Sepsis-3 replaced SIRS-based definitions)",
        "For conditions where treatment must begin before full criteria are met (sepsis, meningitis): treat empirically and refine diagnosis as data accumulates",
        "Distinguish screening criteria from diagnostic criteria: screening identifies who needs further workup; diagnostic criteria establish the diagnosis"
      ],
      "nursingActions": [
        "Know and correctly apply the diagnostic criteria for conditions within your practice scope",
        "Document criteria fulfillment systematically: list each criterion and whether it is met or not met",
        "Apply the correct version of criteria (most current evidence-based guidelines)",
        "Recognize when a patient has a strong clinical presentation but does not strictly meet criteria -- this may warrant specialist consultation or empiric treatment",
        "Use clinical prediction rules and decision tools appropriately: Wells criteria (DVT/PE), CURB-65 (pneumonia severity), CHA2DS2-VASc (atrial fibrillation stroke risk)",
        "Educate patients about their diagnosis and the criteria that support it",
        "For psychiatric diagnoses (DSM-5): ensure duration criteria, exclusion criteria, and functional impairment are documented, not just symptom count"
      ],
      "assessmentFindings": [
        "Findings vary by condition being evaluated -- this is a diagnostic reasoning skill applicable across all conditions",
        "Complete documentation includes: presenting symptoms matched to specific criteria, laboratory results meeting or not meeting thresholds, timeline of symptoms relative to criteria requirements, exclusion of alternative diagnoses",
        "Examples: Jones criteria require evidence of preceding strep infection PLUS criteria -- many clinicians forget to confirm the strep evidence",
        "DSM-5 criteria for major depression: ≥5 of 9 symptoms for ≥2 weeks including depressed mood OR anhedonia + functional impairment + not attributable to substances/medical conditions"
      ],
      "signs": {
        "left": [
          "Clear criteria fulfillment: all required criteria met with supporting evidence -- proceed with diagnosis and treatment",
          "Partial criteria fulfillment with clinical suspicion -- monitor and re-evaluate; consider empiric treatment based on clinical judgment",
          "Alternative diagnosis meets criteria better -- revise working diagnosis"
        ],
        "right": [
          "Clinical picture strongly suggestive but strict criteria NOT met -- treat empirically for serious conditions (sepsis, meningitis) while awaiting confirmation",
          "Over-reliance on criteria causing diagnostic delay: patient with atypical presentation being dismissed because criteria not met",
          "Multiple diagnostic criteria met simultaneously (overlapping conditions -- consider overlap syndromes or misapplication of criteria)"
        ]
      },
      "medications": [
        {
          "name": "No specific medications for criteria fulfillment",
          "type": "Clinical reasoning skill",
          "action": "Diagnostic criteria guide medication selection and treatment initiation; the skill is knowing when to act on criteria fulfillment and when to treat empirically despite incomplete criteria",
          "sideEffects": "N/A",
          "contra": "N/A",
          "pearl": "Remember: criteria are evidence-based GUIDES, not absolute rules; a patient dying of sepsis should be treated even if SOFA score calculation is pending; conversely, a patient meeting criteria for a diagnosis should have alternative diagnoses considered before labeling"
        }
      ],
      "pearls": [
        "Rheumatic fever Jones criteria REQUIRE evidence of preceding streptococcal infection -- without this, the criteria cannot be applied regardless of how many major/minor criteria are met",
        "Modified Duke criteria for endocarditis: 2 major criteria = definite; remember the major criteria relate to BLOOD CULTURES (typical organisms in multiple cultures) and ECHOCARDIOGRAPHIC findings (vegetation, abscess)",
        "SLE diagnosis (ACR/EULAR 2019) requires ANA ≥1:80 as an ENTRY CRITERION before applying the additive scoring system -- if ANA is negative, SLE is extremely unlikely",
        "Sepsis-3 definition replaced SIRS: infection + SOFA ≥2 increase = sepsis; septic shock = sepsis + vasopressors needed to maintain MAP ≥65 + lactate >2 despite adequate resuscitation",
        "DSM-5 major depression requires ≥5 of 9 symptoms for ≥2 WEEKS, and at least one must be depressed mood OR anhedonia; the duration and gateway symptom requirements are frequently overlooked",
        "Clinical prediction rules (Wells, CURB-65, CHA2DS2-VASc) stratify risk and guide management -- they are NOT diagnostic criteria but risk stratification tools"
      ],
      "quiz": [
        {
          "question": "A child presents with migratory polyarthritis, fever, elevated ESR, and an erythema marginatum rash. Rapid strep test and ASO titer are negative. Can acute rheumatic fever be diagnosed?",
          "options": [
            "Yes -- the child meets 1 major + 2 minor criteria",
            "No -- Jones criteria require evidence of preceding streptococcal infection before criteria can be applied",
            "Yes -- the rash is diagnostic by itself",
            "No -- rheumatic fever only occurs in adults"
          ],
          "correct": 1,
          "rationale": "The revised Jones criteria REQUIRE evidence of preceding group A streptococcal infection (positive throat culture, rapid antigen test, or elevated ASO/anti-DNase B titers) before the major and minor criteria can be applied. Without this prerequisite, the diagnosis cannot be made regardless of how many criteria are otherwise met."
        },
        {
          "question": "The ACR/EULAR 2019 SLE classification criteria require which entry criterion before the scoring system can be applied?",
          "options": [
            "Positive anti-dsDNA antibody",
            "ANA ≥1:80",
            "Proteinuria",
            "Joint inflammation"
          ],
          "correct": 1,
          "rationale": "The 2019 ACR/EULAR classification criteria for SLE require a positive ANA (≥1:80) as an ENTRY criterion. If the ANA is negative, the additive scoring system is not applied because the negative predictive value of ANA for SLE is very high (>99%). After meeting the entry criterion, clinical and immunologic domains are scored; ≥10 points = classifiable as SLE."
        },
        {
          "question": "A patient with suspected pneumonia has temperature 39°C, heart rate 105, respiratory rate 24, and WBC 15,000. Do they meet SIRS criteria?",
          "options": [
            "No -- only 2 of 4 criteria are met",
            "Yes -- they meet 3 of 4 SIRS criteria (temperature, heart rate, respiratory rate); WBC >12k meets the 4th criterion as well",
            "SIRS criteria are no longer used",
            "Temperature must be >40°C to qualify"
          ],
          "correct": 1,
          "rationale": "SIRS requires ≥2 of 4 criteria: temp >38°C or <36°C (39°C meets this), HR >90 (105 meets this), RR >20 or PaCO2 <32 (24 meets this), WBC >12k or <4k or >10% bands (15k meets this). This patient meets ALL 4 SIRS criteria. Note: Sepsis-3 has replaced SIRS-based sepsis definitions, but SIRS criteria are still used in some clinical contexts."
        }
      ]
    },
  "critical-care-advanced-np": {
      "title": "Critical Care Advanced Concepts",
      "cellular": {
        "title": "Advanced ICU Pathophysiology",
        "content": "Critical care medicine manages life-threatening organ dysfunction requiring intensive monitoring and organ support. Shock represents inadequate tissue perfusion classified by etiology: distributive (septic -- most common ICU shock; vasodilatory from cytokine-mediated endothelial dysfunction), cardiogenic (pump failure from MI, cardiomyopathy, valve dysfunction), hypovolemic (hemorrhage, dehydration), and obstructive (PE, tension pneumothorax, cardiac tamponade). ARDS (acute respiratory distress syndrome) involves diffuse alveolar damage from pulmonary or extrapulmonary insults, causing non-cardiogenic pulmonary edema with bilateral infiltrates and refractory hypoxemia. Multi-organ dysfunction syndrome (MODS) is the progressive failure of two or more organ systems, driven by dysregulated inflammatory response, with mortality increasing by 15-20% per organ system involved."
      },
      "riskFactors": [
        "Sepsis/septic shock: infection with SOFA score increase ≥2; most common cause of ICU admission and ICU mortality",
        "ARDS risk factors: pneumonia (most common), sepsis, aspiration, pancreatitis, massive transfusion, trauma, near-drowning",
        "Cardiogenic shock: acute MI (especially anterior STEMI), acute decompensated HF, acute valve dysfunction, myocarditis",
        "Ventilator-associated events: prolonged intubation >48 hours, supine positioning, sedation-related delayed extubation",
        "ICU-acquired weakness: prolonged immobility, corticosteroids + neuromuscular blockers, critical illness polyneuropathy/myopathy",
        "Delirium in ICU: sedation (especially benzodiazepines), sleep deprivation, immobility, infection, polypharmacy",
        "Stress ulceration: mechanical ventilation >48 hours, coagulopathy, TBI, burns >35% BSA"
      ],
      "diagnostics": [
        "Hemodynamic monitoring: arterial line (continuous BP, ABG access), central venous pressure (CVP via CVC), pulmonary artery catheter (PCWP, CO, SVR -- rarely used now), non-invasive cardiac output monitoring (PiCCO, FloTrac)",
        "Shock differentiation by hemodynamics: Septic (low SVR, high CO, low CVP) → Cardiogenic (high SVR, low CO, high PCWP) → Hypovolemic (high SVR, low CO, low CVP) → Obstructive (variable based on cause)",
        "ARDS Berlin criteria: acute onset (≤1 week), bilateral opacities on CXR not fully explained by effusions/atelectasis, respiratory failure not fully explained by cardiac failure, P/F ratio classification: mild 200-300, moderate 100-200, severe <100 (on PEEP ≥5)",
        "Point-of-care ultrasound (POCUS): cardiac function, IVC collapsibility (volume status), lung ultrasound (B-lines = pulmonary edema, A-lines = normal/pneumothorax), pleural effusion",
        "Lactate: >2 mmol/L indicates tissue hypoperfusion; trend clearance to monitor resuscitation (>10% clearance per 2 hours is favorable)",
        "ScvO2 (central venous oxygen saturation): <70% indicates increased oxygen extraction (inadequate delivery) -- target ≥70% with resuscitation"
      ],
      "management": [
        "Septic shock: early antibiotics (within 1 hour of recognition), 30 mL/kg crystalloid bolus, vasopressors (norepinephrine first-line, target MAP ≥65), source control (drain abscess, remove infected device)",
        "ARDS: lung-protective ventilation (tidal volume 6 mL/kg IBW, plateau pressure ≤30 cmH2O), higher PEEP strategy, prone positioning for P/F <150 (PROSEVA trial: 16 hours/day), conservative fluid management (FACTT trial), neuromuscular blockade for severe ARDS in first 48 hours",
        "Cardiogenic shock: identify and treat cause; inotropes (dobutamine, milrinone), vasopressors if hypotensive (norepinephrine), mechanical circulatory support (IABP, Impella, ECMO), revascularization if MI-related",
        "ICU bundle (ABCDEF): Assess/manage pain, Both SAT and SBT (spontaneous awakening and breathing trials daily), Choice of sedation (avoid benzodiazepines), Delirium assessment (CAM-ICU), Early mobility, Family engagement",
        "Stress ulcer prophylaxis: PPI or H2RA for patients with risk factors (MV >48 hours, coagulopathy)",
        "VTE prophylaxis: LMWH or UFH unless contraindicated; mechanical (SCDs) if anticoagulation contraindicated"
      ],
      "nursingActions": [
        "Perform hourly hemodynamic assessments: MAP, CVP, urine output, lactate trends, ScvO2",
        "Manage mechanical ventilation: monitor for lung-protective parameters (TV 6 mL/kg IBW, Pplat ≤30), perform daily spontaneous breathing trials (SBT) when appropriate",
        "Implement prone positioning for severe ARDS (P/F <150): coordinate team, ensure secured ETT, position for 16 hours/day",
        "Assess for ICU delirium using CAM-ICU at least twice daily; implement non-pharmacologic prevention (orientation, sleep promotion, minimize sedation, early mobility, hearing aids/glasses)",
        "Perform daily sedation interruption (spontaneous awakening trial) paired with SBT to reduce ventilator days",
        "Calculate and trend SOFA scores to monitor organ dysfunction trajectory",
        "Initiate early progressive mobility within 24-48 hours of ICU admission (reduces ventilator days, delirium, and ICU-acquired weakness)",
        "Monitor for ventilator-associated pneumonia: new/progressive infiltrate + fever + purulent secretions + leukocytosis after >48 hours of mechanical ventilation"
      ],
      "assessmentFindings": [
        "Septic shock: warm extremities initially (vasodilation), tachycardia, hypotension, altered mental status, decreased urine output, elevated lactate",
        "Cardiogenic shock: cool/mottled extremities, jugular venous distension, pulmonary crackles, S3 gallop, elevated PCWP",
        "ARDS: acute onset bilateral crackles, severe hypoxemia refractory to supplemental oxygen, high FiO2 requirements, decreased lung compliance on ventilator",
        "ICU delirium: acute onset fluctuating attention, disorganized thinking; hyperactive (agitated, pulling at lines) or hypoactive (quiet, withdrawn -- more common and more dangerous because often unrecognized)",
        "ICU-acquired weakness: symmetric proximal muscle weakness, difficulty weaning from ventilator, decreased grip strength",
        "Multi-organ dysfunction: progressive failure across systems (renal: rising creatinine, oliguria; hepatic: rising bilirubin, coagulopathy; hematologic: thrombocytopenia; neurologic: altered mental status)"
      ],
      "signs": {
        "left": [
          "Patient responding to initial sepsis resuscitation with improving lactate clearance and adequate urine output",
          "ARDS patient stable on lung-protective ventilation with P/F ratio improving",
          "Successful daily SBT with plan for extubation",
          "ICU delirium resolving with non-pharmacologic interventions"
        ],
        "right": [
          "Refractory septic shock requiring multiple vasopressors and stress-dose hydrocortisone",
          "Severe ARDS with P/F <100 despite prone positioning (consider ECMO referral)",
          "Cardiogenic shock failing inotropes -- mechanical circulatory support needed",
          "Multi-organ dysfunction with rising SOFA score despite treatment (mortality >80% with ≥4 organ failures)",
          "Refractory ICU delirium with severe agitation endangering patient safety"
        ]
      },
      "medications": [
        {
          "name": "Norepinephrine (Levophed)",
          "type": "Catecholamine vasopressor (alpha-1 > beta-1 agonist)",
          "action": "Potent alpha-1 agonist causing peripheral vasoconstriction (increases SVR and MAP); mild beta-1 agonist effect provides modest inotropic support; first-line vasopressor for septic shock per Surviving Sepsis Campaign guidelines",
          "sideEffects": "Tissue ischemia (peripheral, mesenteric, digital), arrhythmias, tissue necrosis from extravasation, reflex bradycardia",
          "contra": "Hypovolemia that has not been adequately resuscitated (vasopressors without volume = worsening tissue ischemia); mesenteric or peripheral ischemia",
          "pearl": "First-line vasopressor for septic shock (SSC 2021); administer via central line (extravasation of peripheral infusion causes tissue necrosis -- phentolamine is the antidote for extravasation); target MAP ≥65 mmHg; if escalating beyond 0.5 mcg/kg/min, add vasopressin 0.04 units/min as second-line; titrate to MAP, NOT to maximum dose"
        }
      ],
      "pearls": [
        "Hour-1 sepsis bundle: measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥4, start vasopressor if hypotensive during/after fluid resuscitation to maintain MAP ≥65",
        "Lung-protective ventilation saves lives in ARDS: tidal volume 6 mL/kg IDEAL body weight (based on HEIGHT, not actual weight), plateau pressure ≤30 cmH2O -- the ARDSNet trial showed 22% mortality reduction",
        "Prone positioning in severe ARDS (P/F <150) for ≥16 hours/day reduces mortality (PROSEVA trial) -- mechanism: improved V/Q matching, recruitment of dorsal lung, reduced ventilator-induced lung injury",
        "CAM-ICU for delirium: 1) Acute onset/fluctuation AND 2) Inattention AND EITHER 3) Disorganized thinking OR 4) Altered consciousness = positive for delirium",
        "Norepinephrine is FIRST-LINE vasopressor in septic shock; vasopressin is SECOND-LINE (added at 0.04 U/min, NOT titrated); epinephrine is an alternative second-line",
        "ICU-acquired weakness prevention: early mobilization within 24-48 hours, minimize sedation, avoid concurrent corticosteroids and neuromuscular blockers when possible"
      ],
      "quiz": [
        {
          "question": "An intubated ARDS patient has a P/F ratio of 90 on FiO2 100% and PEEP 14. What intervention has the strongest mortality benefit?",
          "options": [
            "Increase PEEP to 20",
            "Prone positioning for at least 16 hours per day",
            "Administer high-dose corticosteroids",
            "Perform recruitment maneuvers"
          ],
          "correct": 1,
          "rationale": "Prone positioning for ≥16 hours/day in severe ARDS (P/F <150) has the strongest evidence for mortality reduction (PROSEVA trial: 16% absolute mortality reduction). Mechanism: improved ventilation-perfusion matching, recruitment of dependent lung regions, and reduced ventilator-induced lung injury."
        },
        {
          "question": "What is the first-line vasopressor for septic shock per current guidelines?",
          "options": [
            "Dopamine",
            "Epinephrine",
            "Norepinephrine",
            "Vasopressin"
          ],
          "correct": 2,
          "rationale": "Norepinephrine is the first-line vasopressor for septic shock per the Surviving Sepsis Campaign 2021 guidelines. It has potent alpha-1 vasoconstrictor activity to increase SVR and MAP, with mild beta-1 inotropic support. Vasopressin (0.04 U/min) is added as second-line if MAP goal is not met. Dopamine is associated with more arrhythmias and is no longer recommended as first-line."
        },
        {
          "question": "A mechanically ventilated patient weighing 120 kg (IBW 70 kg based on height) has ARDS. What tidal volume should be set?",
          "options": [
            "720 mL (6 mL/kg actual weight)",
            "420 mL (6 mL/kg ideal body weight)",
            "840 mL (7 mL/kg actual weight)",
            "600 mL (5 mL/kg actual weight)"
          ],
          "correct": 1,
          "rationale": "Lung-protective ventilation uses 6 mL/kg of IDEAL body weight (calculated from height), NOT actual body weight. IBW 70 kg × 6 mL/kg = 420 mL. Using actual weight would deliver excessive tidal volumes and cause ventilator-induced lung injury. The ARDSNet trial demonstrated 22% mortality reduction with this approach."
        }
      ]
    },
  "crohns-disease-basics-rpn": {
        title: "Crohn Disease Basics",
        cellular: { title: "Pathophysiology of Crohn Disease", content: "Crohn disease is a chronic, relapsing inflammatory bowel disease characterised by transmural (full-thickness) inflammation that can affect any portion of the gastrointestinal tract from mouth to anus. It most commonly involves the terminal ileum and proximal colon (ileocolonic pattern, 40% of cases), followed by small bowel only (30%) and colon only (30%).\n\nThe pathogenesis involves a dysregulated immune response to intestinal microbiota in genetically susceptible individuals, triggered by environmental factors. The NOD2/CARD15 gene on chromosome 16 was the first identified susceptibility gene, involved in bacterial recognition by innate immune cells. Over 200 genetic loci have now been associated with Crohn disease.\n\nIn the normal gut, the epithelial barrier separates luminal bacteria from the underlying immune cells. In Crohn disease, defects in barrier function allow bacterial translocation, which activates dendritic cells and macrophages in the lamina propria. These cells produce pro-inflammatory cytokines, particularly tumor necrosis factor-alpha (TNF-alpha), interleukin-12, and interleukin-23, which drive a Th1/Th17-mediated immune response. This creates a self-perpetuating cycle of inflammation, tissue injury, further barrier disruption, and increased bacterial translocation.\n\nTransmural inflammation is the hallmark of Crohn disease, distinguishing it from ulcerative colitis which is limited to the mucosa and submucosa. Full-thickness involvement results in several characteristic complications: deep fissuring ulcers, non-caseating granulomas (found in approximately 30% of biopsies), fistula formation (tracts between the bowel and other structures - enterocutaneous, enteroenteric, enterovesical, perianal), abscesses, and fibrotic strictures causing bowel obstruction.\n\nThe disease is characteristically discontinuous with 'skip lesions' - segments of inflamed bowel separated by normal-appearing mucosa. Endoscopically, the mucosa has a 'cobblestone' appearance created by intersecting linear ulcers surrounding islands of edematous mucosa. 'Creeping fat' (mesenteric fat wrapping around the serosal surface) is a distinctive gross finding at surgery.\n\nExtraintestinal manifestations are common (25-40% of patients) and can affect virtually any organ system. Joint involvement (peripheral arthritis, sacroiliitis, ankylosing spondylitis) is most common. Other manifestations include erythema nodosum and pyoderma gangrenosum (skin), uveitis and episcleritis (eyes), primary sclerosing cholangitis (liver), and nephrolithiasis (kidney). Some extraintestinal manifestations parallel intestinal disease activity (erythema nodosum, peripheral arthritis), while others follow an independent course (primary sclerosing cholangitis, ankylosing spondylitis).\n\nNutritional deficiencies are prevalent due to malabsorption (especially with ileal disease), decreased oral intake from pain and anorexia, and chronic inflammation increasing metabolic demands. Iron deficiency anemia, B12 deficiency (terminal ileum absorption site), folate deficiency, calcium and vitamin D deficiency, and protein-calorie malnutrition are common and require monitoring." },
        riskFactors: ["Family history (first-degree relative with IBD confers 5-20 fold increased risk)","Genetic predisposition (NOD2/CARD15 mutations, over 200 susceptibility loci identified)","Smoking (doubles the risk of developing Crohn disease and worsens disease course, increases relapse and surgical rates - the single most important modifiable risk factor)","Age of onset typically 15-35 years (bimodal distribution with second smaller peak at 55-65 years)","Northern European and Ashkenazi Jewish ancestry (highest prevalence populations)","Urban living and industrialised environments (related to hygiene hypothesis and altered microbiome)","History of appendectomy (may increase risk, unlike protective effect in ulcerative colitis)","NSAID use may trigger flares or unmask subclinical disease","Stress does not cause Crohn disease but may trigger or exacerbate flares"],
        diagnostics: ["Ileocolonoscopy with biopsies is the primary diagnostic tool: reveals skip lesions, aphthous ulcers, cobblestoning, strictures, and fistula openings; biopsies may show non-caseating granulomas","CT enterography or MR enterography to evaluate small bowel involvement not accessible by colonoscopy; identifies wall thickening, strictures, fistulae, and abscesses","Blood work: CBC (anemia, leukocytosis), CRP and ESR (inflammatory markers), albumin (nutritional status), iron studies, B12, folate, 25-OH vitamin D","Fecal calprotectin: non-invasive marker of intestinal inflammation; useful for differentiating IBD from IBS and monitoring disease activity","Stool studies: C. difficile toxin and culture to rule out infectious causes before initiating or escalating immunosuppressive therapy","Upper GI endoscopy if upper GI symptoms present (oropharyngeal or esophageal/gastric Crohn)","Capsule endoscopy for suspected small bowel Crohn when CT/MR enterography is inconclusive; contraindicated if stricture is suspected (capsule retention risk)"],
        management: ["Induction of remission: corticosteroids (prednisone, budesonide for ileal/right-sided disease) for moderate-severe flares; aminosalicylates (mesalamine) for mild colonic disease only","Maintenance of remission: immunomodulators (azathioprine, 6-mercaptopurine, methotrexate) and/or biologic therapy (anti-TNF agents: infliximab, adalimumab; anti-integrin: vedolizumab; anti-IL-12/23: ustekinumab)","Biologic therapy increasingly used as first-line for moderate-severe disease (top-down approach) rather than waiting for failure of conventional therapies (step-up approach)","Antibiotic therapy (ciprofloxacin + metronidazole) for perianal disease, fistulae, and abscesses","Nutritional support: exclusive enteral nutrition is first-line for paediatric Crohn disease induction; supplementation of iron, B12, folate, calcium, vitamin D as needed","Smoking cessation is critical: smoking doubles relapse rate and surgical risk","Surgical intervention for complications: strictureplasty for short strictures, resection for refractory disease or complicated strictures, abscess drainage, fistula repair; surgery is not curative and recurrence is common (50% within 5 years at the anastomotic site)"],
        nursingActions: ["Assess stool pattern: frequency, consistency, presence of blood and mucus, nocturnal stools (suggests organic disease), urgency, and tenesmus","Monitor nutritional status: daily weights, serum albumin, dietary intake assessment, BMI trending; collaborate with dietitian for nutritional planning","Assess for extraintestinal manifestations: joint pain and swelling, skin lesions (erythema nodosum - tender red nodules on shins; pyoderma gangrenosum - deep necrotic ulcers), eye symptoms (pain, redness, vision changes)","Administer immunosuppressive and biologic medications as prescribed; monitor for infusion reactions during IV biologic therapy (infliximab): fever, chills, dyspnea, chest pain, hypotension","Educate on infection prevention while on immunosuppressive therapy: avoid live vaccines, report fever or signs of infection promptly, annual influenza vaccine (inactivated), ensure up-to-date immunisations before starting biologics","Monitor for corticosteroid side effects: hyperglycemia (check blood glucose regularly), mood changes, insomnia, increased appetite, moon facies, adrenal suppression with prolonged use (never abruptly discontinue - must taper)","Assess perianal area for fistulae, fissures, abscesses, and skin breakdown; provide meticulous perianal skin care","Support psychosocial well-being: chronic disease affects body image, social functioning, and mental health; refer to support groups and counseling as appropriate","Pre-operative teaching if surgery planned: explain that Crohn disease is not cured by surgery, discuss potential for ostomy, emphasise importance of continued medication adherence post-operatively"],
        assessmentFindings: ["Chronic or intermittent diarrhea (often non-bloody in small bowel disease), abdominal pain (commonly right lower quadrant with ileal involvement)","Weight loss, fatigue, and anorexia reflecting chronic inflammation and malabsorption","Palpable right lower quadrant mass or fullness (inflamed terminal ileum or abscess)","Perianal disease: fistulae, fissures, skin tags, abscesses (may be the presenting feature)","Fever (low-grade during flares, high fever suggests abscess or perforation)","Signs of malnutrition: muscle wasting, peripheral edema (hypoalbuminemia), angular cheilitis (B-vitamin deficiency), glossitis","Extraintestinal findings: joint swelling, erythema nodosum, mouth ulcers (aphthous stomatitis), eye redness"],
        signs: { left: ["Chronic diarrhea with abdominal cramping","Right lower quadrant pain and tenderness","Weight loss and malnutrition","Perianal fistulae, fissures, or abscess","Fatigue and low-grade fever"], right: ["Palpable abdominal mass (suggests abscess or phlegmon)","Signs of bowel obstruction (distension, vomiting, absent flatus)","Erythema nodosum (tender nodules on shins)","Joint swelling and pain (enteropathic arthritis)","Growth failure in children and adolescents"] },
        medications: [{ name: "Budesonide (Entocort)", type: "Corticosteroid (Locally Acting)", action: "Potent anti-inflammatory corticosteroid with high topical activity in the ileum and right colon; extensive first-pass hepatic metabolism limits systemic bioavailability to approximately 10%, reducing systemic side effects compared to prednisone", sideEffects: "Moon facies, acne, insomnia, mood changes (less than systemic steroids); adrenal suppression still possible with prolonged use; hyperglycemia", contra: "Systemic fungal infections, hepatic cirrhosis (reduces first-pass metabolism, increasing systemic exposure), concurrent strong CYP3A4 inhibitors", pearl: "First-line corticosteroid for mild-moderate ileal and right-sided colonic Crohn disease due to fewer systemic side effects than prednisone; NOT effective for left-sided colonic or rectal disease; must be tapered, not stopped abruptly" },{ name: "Infliximab (Remicade)", type: "Biologic - Anti-TNF-alpha Monoclonal Antibody", action: "Chimeric monoclonal antibody that binds to both soluble and membrane-bound TNF-alpha, neutralising this key pro-inflammatory cytokine and inducing apoptosis of TNF-expressing inflammatory cells", sideEffects: "Infusion reactions (fever, chills, pruritus, dyspnea, hypotension), increased risk of serious infections (tuberculosis reactivation, opportunistic infections), hepatotoxicity, rare risk of lymphoma (particularly hepatosplenic T-cell lymphoma in young males on combination therapy with thiopurines), demyelinating disorders", contra: "Active serious infection, untreated latent tuberculosis, moderate-severe heart failure (NYHA class III-IV), known hypersensitivity, concurrent live vaccines", pearl: "TB screening (tuberculin skin test or interferon-gamma release assay + chest X-ray) is MANDATORY before starting any anti-TNF therapy due to risk of TB reactivation; hepatitis B screening also required; given as IV infusion over minimum 2 hours - monitor patient throughout and for 1 hour post-infusion" },{ name: "Azathioprine", type: "Immunomodulator (Thiopurine Antimetabolite)", action: "Converted to 6-mercaptopurine and then to active metabolites (6-thioguanine nucleotides) that are incorporated into DNA, inhibiting purine synthesis and suppressing T-cell and B-cell proliferation", sideEffects: "Bone marrow suppression (leukopenia, thrombocytopenia - dose-dependent), hepatotoxicity, pancreatitis (3-4%, typically early and idiosyncratic), nausea, increased infection risk, increased risk of non-melanoma skin cancer and lymphoma with long-term use", contra: "Pregnancy (teratogenic - requires reliable contraception), severe bone marrow suppression, known TPMT or NUDT15 deficiency (risk of fatal myelosuppression)", pearl: "TPMT enzyme testing is REQUIRED before starting therapy - patients with low or absent TPMT activity metabolise azathioprine to toxic levels causing life-threatening bone marrow suppression; monitor CBC every 1-2 weeks initially, then monthly; takes 3-6 months for full therapeutic effect (not useful for acute flares)" },{ name: "Mesalamine (5-ASA)", type: "Aminosalicylate Anti-inflammatory", action: "Topical anti-inflammatory agent that acts locally on the intestinal mucosa; inhibits prostaglandin and leukotriene synthesis, scavenges free radicals, and inhibits NF-kB activation in mucosal epithelial cells", sideEffects: "Headache, nausea, abdominal pain, diarrhea (paradoxical), rash, rare nephrotoxicity (interstitial nephritis), rare pancreatitis", contra: "Salicylate hypersensitivity, severe renal impairment, severe hepatic impairment", pearl: "More effective in ulcerative colitis than Crohn disease; in Crohn disease, role is limited to mild colonic disease; different formulations target different bowel segments (Asacol targets terminal ileum/colon; Pentasa releases throughout small bowel and colon); monitor renal function annually" }],
        pearls: ["Crohn disease is transmural (full-thickness) with skip lesions anywhere from mouth to anus; ulcerative colitis is mucosal only and continuous starting from the rectum - this distinction is fundamental for boards and clinical practice","Smoking is the single most important modifiable risk factor - it doubles relapse rates and surgical risk; this is opposite to ulcerative colitis where smoking is protective","TB screening is mandatory before starting any anti-TNF biologic therapy (infliximab, adalimumab) due to risk of reactivation of latent tuberculosis","Never abruptly stop corticosteroids in patients on prolonged therapy - adrenal suppression causes potentially life-threatening Addisonian crisis; always taper gradually","Right lower quadrant pain in a young patient may be confused with appendicitis; Crohn disease should be considered in the differential, especially with a history of chronic diarrhea","Fecal calprotectin is a valuable non-invasive test to monitor disease activity and differentiate IBD from IBS without repeated colonoscopies","Perianal disease (fistulae, abscesses, fissures) may be the first presenting feature of Crohn disease, even before intestinal symptoms develop","B12 deficiency should be monitored in patients with terminal ileal disease or ileal resection, as the terminal ileum is the exclusive absorption site for the B12-intrinsic factor complex"],
        quiz: [{ question: "A patient newly diagnosed with Crohn disease is prescribed infliximab. Which test must be completed BEFORE initiating therapy?", options: ["Fecal calprotectin level","Tuberculosis screening (TST or IGRA and chest X-ray)","Colonoscopy with biopsies","DEXA scan for bone density"], correct: 1, rationale: "Tuberculosis screening is mandatory before starting any anti-TNF biologic therapy. Anti-TNF agents suppress TNF-alpha, which is essential for containing latent TB granulomas. Without screening and treatment of latent TB, there is a significant risk of reactivation to active, potentially disseminated tuberculosis, which can be fatal in immunosuppressed patients." },{ question: "A nurse is educating a patient with Crohn disease about modifiable lifestyle factors. Which recommendation has the strongest evidence for reducing disease flares?", options: ["Avoiding all dairy products permanently","Following a strict gluten-free diet","Smoking cessation","Eliminating fibre from the diet"], correct: 2, rationale: "Smoking cessation is the single most important modifiable risk factor for Crohn disease. Smoking doubles the relapse rate, increases the need for surgery, and worsens disease course. There is no evidence supporting blanket elimination of dairy, gluten, or fibre in Crohn disease, though individual patients may identify personal trigger foods." },{ question: "Which assessment finding most clearly distinguishes Crohn disease from ulcerative colitis?", options: ["Bloody diarrhea with urgency and tenesmus","Continuous inflammation starting from the rectum","Perianal fistulae and skip lesions on colonoscopy","Elevated fecal calprotectin level"], correct: 2, rationale: "Perianal fistulae and skip lesions (segments of inflamed bowel separated by normal mucosa) are characteristic of Crohn disease's transmural, discontinuous inflammation pattern. Bloody diarrhea and continuous rectal inflammation are more typical of ulcerative colitis. Fecal calprotectin is elevated in both conditions and cannot distinguish between them." }]
  },
  "cross-system-concepts-np": {
      "title": "Cross-System Clinical Concepts",
      "cellular": {
        "title": "Multi-System Pathophysiological Connections",
        "content": "Many disease processes affect multiple organ systems simultaneously through shared pathophysiological mechanisms. Inflammation (cytokine cascades involving TNF-alpha, IL-1, IL-6) can cause systemic effects: SIRS progressing to sepsis affects cardiovascular, pulmonary, renal, hepatic, and hematologic systems simultaneously. Autoimmune diseases (SLE, vasculitis) involve immune complex deposition or cell-mediated destruction across multiple organs. Metabolic diseases (diabetes, metabolic syndrome) cause micro- and macrovascular damage in kidneys, eyes, nerves, and cardiovascular system. Endocrine disorders produce downstream effects: hypothyroidism causes bradycardia, constipation, hyperlipidemia, and cognitive changes. Understanding these cross-system connections enables the NP to anticipate complications, perform comprehensive assessments, and manage patients holistically rather than treating organ systems in isolation."
      },
      "riskFactors": [
        "Systemic inflammatory conditions: sepsis, autoimmune diseases (SLE, RA, vasculitis), sarcoidosis",
        "Metabolic syndrome components: obesity, insulin resistance, hypertension, dyslipidemia -- each amplifies the others",
        "Chronic kidney disease: affects cardiovascular (uremic cardiomyopathy), hematologic (anemia from EPO deficiency), skeletal (renal osteodystrophy), neurologic (uremic encephalopathy) systems",
        "Heart failure: affects renal (cardiorenal syndrome), hepatic (congestive hepatopathy), pulmonary (pulmonary edema), and neurologic (decreased cerebral perfusion) systems",
        "Liver cirrhosis: causes portal hypertension (GI varices), coagulopathy, hepatorenal syndrome, hepatic encephalopathy, hepatopulmonary syndrome",
        "Diabetes mellitus: microvascular (retinopathy, nephropathy, neuropathy) and macrovascular (CAD, PVD, stroke) complications across all organ systems"
      ],
      "diagnostics": [
        "Multi-system assessment approach: when one system is affected, systematically evaluate connected systems",
        "Cardiorenal syndrome workup: simultaneous BNP/troponin AND creatinine/BUN monitoring; urine sodium and FeNa to differentiate pre-renal from intrinsic renal disease",
        "Hepatorenal syndrome diagnosis: cirrhosis + ascites + creatinine rise + no improvement with albumin challenge + no other cause identified",
        "SLE multi-system workup: CBC (cytopenias), CMP (renal function), UA (proteinuria, casts), complement levels (C3/C4), anti-dsDNA, chest imaging, echocardiography",
        "DM multi-system screening: HbA1c + annual dilated eye exam + annual UACR + annual foot exam + lipid panel + BP monitoring",
        "Sepsis multi-system assessment: SOFA score evaluates 6 organ systems simultaneously (respiratory PaO2/FiO2, coagulation platelets, liver bilirubin, cardiovascular MAP/vasopressors, CNS GCS, renal creatinine/UOP)"
      ],
      "management": [
        "Treat the primary disease while monitoring and managing downstream organ effects",
        "Cardiorenal syndrome: optimize cardiac output (diuretics, inotropes) to improve renal perfusion; avoid nephrotoxins",
        "Hepatorenal syndrome: volume expansion with albumin, vasoconstrictors (terlipressin, norepinephrine + albumin), liver transplant is the definitive treatment",
        "Diabetes multi-system management: glycemic control + statin + ACEi/ARB (renal/cardiac protection) + BP control + annual screening",
        "Sepsis multi-organ support: antibiotics + fluid resuscitation + vasopressors + organ-specific support (renal replacement, mechanical ventilation, blood products)",
        "Autoimmune multi-system: immunosuppression targeting the underlying disease + organ-specific interventions"
      ],
      "nursingActions": [
        "When evaluating any single-organ disease, systematically assess all connected organ systems",
        "Apply the SOFA score to track multi-organ dysfunction in critical illness",
        "Recognize cardiorenal syndrome: worsening renal function in the setting of heart failure -- manage volume status carefully (too much fluid worsens congestion; too little worsens renal perfusion)",
        "Screen diabetic patients annually for all complications: eyes (retinopathy), kidneys (UACR, eGFR), feet (neuropathy, vascular), cardiovascular (lipids, BP)",
        "Identify polypharmacy risks in multi-system disease: medications for one system may worsen another (NSAIDs improve joint pain but worsen renal function and GI bleeding risk in cirrhosis)",
        "Coordinate multi-specialty care: manage referrals and synthesize recommendations from multiple specialists",
        "Educate patients on how their conditions are interconnected and why comprehensive management matters"
      ],
      "assessmentFindings": [
        "Multi-system disease presentations: sepsis (fever + hypotension + tachypnea + AKI + coagulopathy + altered mental status), SLE flare (rash + arthritis + nephritis + cytopenias + serositis), diabetic complications (retinopathy + nephropathy + neuropathy + cardiovascular disease)",
        "Cardiorenal syndrome: jugular venous distension, peripheral edema, pulmonary crackles (cardiac) WITH rising creatinine, oliguria (renal)",
        "Hepatorenal syndrome: ascites, jaundice, spider angiomata, palmar erythema (hepatic) WITH progressive oliguria and rising creatinine (renal)",
        "Drug-induced multi-system effects: NSAID use causing AKI + GI bleeding + worsening heart failure simultaneously"
      ],
      "signs": {
        "left": [
          "Single-organ disease without evidence of multi-system involvement -- monitor connected systems preventively",
          "Stable chronic multi-system disease managed with coordinated care (e.g., well-controlled diabetic with stable kidney function)",
          "Early identification of secondary organ involvement allowing early intervention"
        ],
        "right": [
          "Multi-organ dysfunction syndrome (MODS) with ≥3 organ systems failing -- mortality >50%",
          "Cardiorenal syndrome with refractory volume overload requiring ultrafiltration or dialysis",
          "Hepatorenal syndrome with progressive renal failure in advanced cirrhosis (median survival <2 weeks without liver transplant)",
          "Septic shock with progressive SOFA score increase despite treatment",
          "Catastrophic antiphospholipid syndrome: simultaneous thrombosis in ≥3 organ systems over days"
        ]
      },
      "medications": [
        {
          "name": "No single medication for cross-system concepts",
          "type": "Multi-system management principle",
          "action": "Key drugs that provide multi-system protection: ACEi/ARBs (cardioprotective + renoprotective in diabetes and CKD); statins (cardiovascular + anti-inflammatory); SGLT2 inhibitors (glycemic control + heart failure reduction + renal protection -- the 'triple benefit' drug class); metformin (glycemic control + possible cardiovascular benefit)",
          "sideEffects": "Each medication has system-specific side effects that must be weighed against multi-system benefits",
          "contra": "Varies by medication -- renal function affects many drug choices across systems",
          "pearl": "SGLT2 inhibitors (empagliflozin, dapagliflozin) are the prototypical cross-system medication: originally for diabetes, now proven to reduce heart failure hospitalization (EMPEROR/DAPA-HF), slow CKD progression (DAPA-CKD/EMPA-KIDNEY), and reduce cardiovascular death -- REGARDLESS of whether diabetes is present; these trials transformed thinking about cross-system pharmacotherapy"
        }
      ],
      "pearls": [
        "When you find disease in ONE organ system, ALWAYS think about connected systems: heart failure → check kidneys; kidney disease → check cardiovascular risk, bone density, hemoglobin; liver disease → check coagulation, kidneys, varices",
        "SGLT2 inhibitors are the best example of cross-system pharmacotherapy: proven benefits in diabetes, heart failure, AND CKD -- independent of each other (a true 'multi-system' drug class)",
        "Cardiorenal syndrome: the heart and kidneys are intimately connected; heart failure reduces renal perfusion (Type 1), and CKD accelerates cardiovascular disease (Type 4) -- managing one affects the other",
        "The SOFA score is designed to track MULTI-organ dysfunction: each of 6 organ systems (respiratory, coagulation, hepatic, cardiovascular, neurologic, renal) scored 0-4; total score correlates with ICU mortality",
        "Polypharmacy in multi-system disease: medications for one system may harm another -- NSAIDs (good for pain → bad for kidneys, GI, heart failure), steroids (good for inflammation → bad for glucose, bones, immune function)",
        "Diabetes is the quintessential multi-system disease: affects kidneys, eyes, nerves, cardiovascular, immune, musculoskeletal -- comprehensive annual screening is the standard of care"
      ],
      "quiz": [
        {
          "question": "A patient with heart failure develops rising creatinine and decreased urine output during diuretic therapy. What is this phenomenon called?",
          "options": [
            "Hepatorenal syndrome",
            "Cardiorenal syndrome -- worsening renal function in the setting of heart failure",
            "Nephrotic syndrome",
            "Acute tubular necrosis"
          ],
          "correct": 1,
          "rationale": "Cardiorenal syndrome describes the bidirectional relationship between heart and kidney failure. In this case (Type 1), acute decompensated heart failure leads to decreased renal perfusion and rising creatinine. Management requires careful volume optimization -- enough diuresis to relieve congestion but not so much as to worsen renal hypoperfusion."
        },
        {
          "question": "Which drug class has proven benefits across diabetes, heart failure, AND chronic kidney disease regardless of whether the other conditions are present?",
          "options": [
            "Beta-blockers",
            "ACE inhibitors",
            "SGLT2 inhibitors",
            "Statins"
          ],
          "correct": 2,
          "rationale": "SGLT2 inhibitors (empagliflozin, dapagliflozin) have landmark trials demonstrating benefits in ALL THREE conditions independently: EMPA-REG/DECLARE (diabetes cardiovascular outcomes), EMPEROR/DAPA-HF (heart failure), and DAPA-CKD/EMPA-KIDNEY (chronic kidney disease). They are the prototypical 'cross-system' drug class, working through multiple mechanisms including natriuresis, reduced glomerular hyperfiltration, and improved cardiac energetics."
        },
        {
          "question": "An NP is managing a patient with cirrhosis who develops progressive oliguria and rising creatinine despite adequate albumin infusion and no other identifiable cause. What is the most likely diagnosis?",
          "options": [
            "Pre-renal AKI from dehydration",
            "Hepatorenal syndrome",
            "Drug-induced nephrotoxicity",
            "Obstructive uropathy"
          ],
          "correct": 1,
          "rationale": "Hepatorenal syndrome is diagnosed in cirrhotic patients with ascites who develop progressive renal failure without improvement after albumin challenge (1g/kg/day for 2 days), with no other identifiable cause (no nephrotoxins, no shock, no obstruction). The kidneys are structurally normal but fail due to extreme renal vasoconstriction from splanchnic vasodilation. Liver transplant is the definitive treatment."
        }
      ]
    },
  "croup-np": {
      "title": "Croup (Laryngotracheobronchitis)",
      "cellular": {
        "title": "Croup Pathophysiology",
        "content": "Croup (acute laryngotracheobronchitis) is a viral infection causing inflammation and edema of the subglottic airway, primarily affecting children 6 months to 3 years (peak incidence 1-2 years). Parainfluenza virus types 1 and 3 account for ~75% of cases; other causes include RSV, influenza, adenovirus, and human metapneumovirus. The subglottic trachea is the narrowest part of the pediatric airway (cricoid cartilage is a complete ring that cannot expand), making children uniquely susceptible to symptomatic obstruction from even mild edema. One millimeter of circumferential edema reduces the cross-sectional area of the infant subglottic airway by ~60% (Poiseuille law: airflow resistance is inversely proportional to radius to the fourth power). This produces the characteristic barking/seal-like cough, inspiratory stridor, and hoarseness."
      },
      "riskFactors": [
        "Age 6 months to 3 years (narrow subglottic airway)",
        "Male sex (1.5x more common in boys)",
        "Fall and early winter seasonality (parainfluenza peaks)",
        "Exposure to viral respiratory infections (daycare, older siblings)",
        "Previous episodes of croup (recurrent croup in children >3 years warrants evaluation for anatomic abnormality)",
        "Premature birth or history of subglottic stenosis (higher risk of severe presentation)",
        "Atopy/reactive airway disease (may predispose to spasmodic croup)"
      ],
      "diagnostics": [
        "Clinical diagnosis based on characteristic presentation: barking cough, hoarseness, inspiratory stridor, low-grade fever; history of URI prodrome (1-3 days of rhinorrhea, cough) followed by sudden onset of stridor (often worse at night)",
        "Westley Croup Score: assesses severity (stridor, retractions, air entry, cyanosis, level of consciousness); mild ≤2, moderate 3-7, severe ≥8",
        "AP neck X-ray (if diagnosis uncertain): 'steeple sign' -- subglottic narrowing of the tracheal air column (not routinely needed in classic presentation)",
        "Differentiate from epiglottitis (EMERGENCY): epiglottitis has rapid onset, high fever, drooling, tripod positioning, muffled 'hot potato' voice, NO barking cough; lateral neck X-ray shows 'thumbprint sign' (swollen epiglottis)",
        "Differentiate from foreign body aspiration: sudden onset without prodrome, unilateral wheezing, choking history",
        "Differentiate from bacterial tracheitis: high fever, toxic appearance, poor response to croup treatment, purulent secretions"
      ],
      "management": [
        "Mild croup (barking cough, no stridor at rest): single dose dexamethasone 0.6 mg/kg PO/IM (max 10 mg); cool mist; supportive care at home; anticipatory guidance",
        "Moderate croup (stridor at rest with mild retractions): dexamethasone 0.6 mg/kg PO/IM + nebulized racemic epinephrine 0.5 mL of 2.25% solution diluted in 3 mL NS; observe for 2-4 hours for rebound symptoms after epinephrine",
        "Severe croup (significant stridor, retractions, decreased air entry, agitation/lethargy): dexamethasone + racemic epinephrine; prepare for possible intubation; if intubating, use ETT 0.5-1.0 size smaller than age-predicted due to subglottic edema",
        "Heliox (helium-oxygen mixture): may reduce work of breathing in severe croup by decreasing airflow turbulence (helium is less dense than nitrogen)",
        "Spasmodic croup: sudden onset without viral prodrome, often recurrent, may respond to cold night air or cool mist; still give dexamethasone",
        "Avoid: racemic epinephrine is NOT a substitute for corticosteroids (epinephrine is temporary, corticosteroids provide sustained benefit)"
      ],
      "nursingActions": [
        "Assess severity using Westley Croup Score at presentation and after interventions",
        "Keep the child calm and comfortable -- agitation increases oxygen demand and turbulent airflow, worsening stridor; allow parent to hold child",
        "Administer dexamethasone 0.6 mg/kg (max 10 mg) -- single dose is the mainstay of treatment for ALL severity levels",
        "Administer nebulized racemic epinephrine for moderate-severe croup and observe for minimum 2-4 hours (rebound stridor can occur as epinephrine wears off at 1-2 hours)",
        "Monitor for signs of worsening: increasing stridor, worsening retractions, decreased air entry, cyanosis, altered consciousness",
        "Do NOT examine the throat with a tongue depressor if epiglottitis is suspected (may trigger complete airway obstruction)",
        "Educate parents: croup is usually self-limited (3-7 days); symptoms worse at night; return for stridor at rest, respiratory distress, or poor fluid intake",
        "Humidity: cool mist humidifier or brief exposure to cool night air may provide temporary comfort (limited evidence but widely recommended)"
      ],
      "assessmentFindings": [
        "Barking 'seal-like' cough (hallmark symptom)",
        "Hoarseness (laryngeal inflammation)",
        "Inspiratory stridor (turbulent airflow through narrowed subglottic airway)",
        "Low-grade fever (usually <39°C; high fever suggests bacterial tracheitis or epiglottitis)",
        "URI prodrome (rhinorrhea, mild cough for 1-3 days before stridor onset)",
        "Symptoms characteristically WORSE at night (circadian cortisol nadir + supine position)",
        "Intercostal, subcostal, and suprasternal retractions (increased work of breathing)",
        "Agitation or lethargy in severe cases (hypoxia signs)"
      ],
      "signs": {
        "left": [
          "Mild croup: barking cough with no stridor at rest, no retractions, happy and playful; responds to single dose dexamethasone",
          "Moderate croup: stridor at rest but child is not distressed; responds to dexamethasone + racemic epinephrine",
          "Recurrent spasmodic croup responding to cool air and dexamethasone"
        ],
        "right": [
          "Severe croup: marked stridor, severe retractions, decreased air entry, cyanosis, altered consciousness -- prepare for possible intubation",
          "No improvement after racemic epinephrine and dexamethasone -- consider bacterial tracheitis or foreign body",
          "Drooling with high fever and toxic appearance -- think epiglottitis (do NOT examine throat; emergent ENT/anesthesia for controlled airway management)",
          "Complete airway obstruction: absent air movement, severe cyanosis -- emergent intubation with smaller-than-expected ETT"
        ]
      },
      "medications": [
        {
          "name": "Dexamethasone",
          "type": "Glucocorticoid (anti-inflammatory)",
          "action": "Potent anti-inflammatory that reduces subglottic mucosal edema and inflammation; decreases capillary permeability and cytokine-mediated inflammatory response; provides sustained benefit (biological half-life 36-54 hours, so single dose is effective)",
          "sideEffects": "Single dose: essentially no significant side effects; mild: hyperactivity, insomnia, increased appetite, gastric irritation",
          "contra": "No absolute contraindications for single-dose use in croup; safe in children with varicella exposure, immunosuppression, and concurrent infections at standard croup dosing",
          "pearl": "0.6 mg/kg PO/IM (max 10 mg) -- SINGLE DOSE is the standard of care for ALL severity levels of croup; onset of action 2-4 hours (this is why epinephrine is needed for moderate-severe cases -- it bridges until dexamethasone takes effect); PO route is preferred if child can tolerate oral (equally effective as IM); even 0.15 mg/kg has shown benefit in mild croup (lower dose studies)"
        },
        {
          "name": "Racemic Epinephrine (nebulized)",
          "type": "Adrenergic agonist (alpha and beta)",
          "action": "Alpha-adrenergic vasoconstriction of subglottic mucosal blood vessels reduces edema and increases airway diameter; provides rapid temporary relief of airway obstruction (onset 10-30 minutes); does NOT reduce underlying inflammation",
          "sideEffects": "Tachycardia, tremor, pallor; REBOUND WORSENING: symptoms may return or worsen 1-2 hours after dose as vasoconstriction wears off and edema returns",
          "contra": "Hypertrophic obstructive cardiomyopathy, tetralogy of Fallot (relative); outweighed by need in airway emergency",
          "pearl": "0.5 mL of 2.25% solution nebulized; observe for minimum 2-4 HOURS after administration due to risk of rebound stridor; L-epinephrine 5 mL of 1:1000 is an alternative with equal efficacy; can be repeated every 15-20 minutes in severe cases; epinephrine is a BRIDGE -- always give dexamethasone concurrently for sustained anti-inflammatory effect"
        }
      ],
      "pearls": [
        "Croup is a CLINICAL diagnosis: barking cough + hoarseness + inspiratory stridor + URI prodrome in a 6-month to 3-year-old; X-ray is NOT needed for classic presentation",
        "Dexamethasone 0.6 mg/kg (max 10 mg) SINGLE DOSE is the cornerstone treatment for ALL croup severity levels -- it reduces hospitalizations, return visits, and need for additional interventions",
        "Racemic epinephrine is TEMPORARY (wears off in 1-2 hours with potential rebound); it must be paired with dexamethasone for sustained benefit; observe 2-4 hours after epinephrine",
        "Steeple sign on AP neck X-ray = croup (subglottic narrowing); Thumbprint sign on lateral neck X-ray = epiglottitis (swollen epiglottis)",
        "If you suspect EPIGLOTTITIS: do NOT examine the throat, do NOT agitate the child, do NOT lay the child supine -- call ENT/anesthesia for controlled airway management in the operating room",
        "Symptoms are WORSE AT NIGHT (cortisol nadir + supine position increasing venous congestion in subglottic mucosa) -- parents often bring children to the ED in the middle of the night",
        "1 mm of subglottic edema reduces infant airway cross-sectional area by ~60% (Poiseuille law: resistance ∝ 1/r⁴) -- this explains why mild edema causes dramatic symptoms in children but not adults"
      ],
      "quiz": [
        {
          "question": "A 2-year-old presents at 2 AM with a barking cough, hoarse voice, and inspiratory stridor at rest. Temperature is 38.2°C. What is the FIRST medication to administer?",
          "options": [
            "Nebulized albuterol",
            "Oral dexamethasone 0.6 mg/kg",
            "Oral amoxicillin",
            "IV ceftriaxone"
          ],
          "correct": 1,
          "rationale": "This is moderate croup (stridor at rest). Dexamethasone 0.6 mg/kg PO (single dose, max 10 mg) is the first-line treatment for ALL croup severity levels. For moderate croup with stridor at rest, nebulized racemic epinephrine should also be given for rapid temporary relief while waiting for dexamethasone to take effect (2-4 hours). Albuterol is for bronchospasm (lower airway), not subglottic edema."
        },
        {
          "question": "After receiving nebulized racemic epinephrine, a child with moderate croup improves significantly. How long must the child be observed before discharge?",
          "options": [
            "30 minutes",
            "2-4 hours minimum due to risk of rebound stridor",
            "1 hour",
            "No observation needed if symptoms resolve"
          ],
          "correct": 1,
          "rationale": "Racemic epinephrine provides temporary relief through mucosal vasoconstriction, but its effect wears off in 1-2 hours. Rebound stridor (return or worsening of symptoms) can occur as the vasoconstriction resolves. The child must be observed for at least 2-4 hours to ensure symptoms do not return before safe discharge."
        },
        {
          "question": "A 3-year-old presents with acute onset high fever (40°C), drooling, tripod positioning, and a muffled voice. There is no barking cough. What should the nurse AVOID doing?",
          "options": [
            "Calling for help",
            "Keeping the child calm and in the parent's lap",
            "Examining the throat with a tongue depressor",
            "Administering supplemental oxygen"
          ],
          "correct": 2,
          "rationale": "This presentation (high fever, drooling, tripod position, muffled voice, NO barking cough) suggests epiglottitis, not croup. Examining the throat with a tongue depressor can trigger laryngospasm and complete airway obstruction. Do NOT agitate the child, do NOT examine the throat, do NOT lay the child supine. Call ENT/anesthesia for controlled airway management in the OR."
        }
      ]
    },
  "crrt-np": {
      "title": "Continuous Renal Replacement Therapy",
      "cellular": {
        "title": "CRRT Principles & Modalities",
        "content": "Continuous renal replacement therapy (CRRT) provides slow, continuous solute and fluid removal over 24 hours in hemodynamically unstable critically ill patients who cannot tolerate conventional intermittent hemodialysis (IHD). CRRT works through three mechanisms: diffusion (solutes move across a semipermeable membrane down concentration gradients -- like hemodialysis), convection (solutes are dragged across the membrane with fluid movement through solvent drag -- like hemofiltration), and ultrafiltration (hydrostatic pressure drives fluid removal). Modalities include CVVHD (continuous venovenous hemodialysis -- primarily diffusion using dialysate), CVVH (continuous venovenous hemofiltration -- primarily convection using replacement fluid), and CVVHDF (continuous venovenous hemodiafiltration -- combines both). CRRT provides superior hemodynamic stability compared to IHD because fluid and solute are removed gradually rather than in rapid 4-hour sessions."
      },
      "riskFactors": [
        "Indications for CRRT over IHD: hemodynamic instability (septic shock, cardiogenic shock), acute brain injury (IHD can worsen cerebral edema from rapid osmolar shifts), severe fluid overload with hemodynamic compromise",
        "AKI requiring RRT: refractory hyperkalemia, severe metabolic acidosis, uremic complications (pericarditis, encephalopathy, bleeding), volume overload refractory to diuretics, dialyzable toxin ingestion in unstable patient",
        "Risk factors for AKI requiring CRRT: sepsis (most common cause of AKI in ICU), nephrotoxic medications (aminoglycosides, vancomycin, contrast dye, NSAIDs), cardiorenal syndrome, rhabdomyolysis, hepatorenal syndrome",
        "Contraindications: no absolute contraindications; relative: inability to obtain vascular access, treatment futility"
      ],
      "diagnostics": [
        "Labs to monitor during CRRT: BMP q6h (electrolytes, BUN, creatinine), ionized calcium (citrate anticoagulation chelates calcium), phosphorus (CRRT removes phosphorus causing hypophosphatemia), magnesium, ABG (acid-base status), CBC",
        "Circuit monitoring: access pressures, filter pressures, transmembrane pressure (TMP -- elevated TMP indicates filter clotting), effluent appearance",
        "Fluid balance calculation: net ultrafiltration rate = total output - total input; precise hourly fluid balance documentation",
        "Clearance adequacy: prescribed dose 20-25 mL/kg/hr effluent rate (KDIGO recommendation); actual delivered dose often lower due to circuit downtime",
        "Anticoagulation monitoring: if regional citrate anticoagulation: post-filter ionized calcium (target 0.25-0.35 mmol/L), systemic ionized calcium (target 1.0-1.2 mmol/L); if systemic heparin: aPTT 45-60 seconds"
      ],
      "management": [
        "Vascular access: large-bore dual-lumen catheter in internal jugular (preferred) or femoral vein; subclavian avoided (stenosis risk for future AV fistula)",
        "Anticoagulation: regional citrate anticoagulation preferred (lower bleeding risk); systemic heparin alternative; no anticoagulation if coagulopathic (DIC, liver failure)",
        "Prescribe CRRT parameters: modality (CVVH, CVVHD, or CVVHDF), blood flow rate (150-250 mL/min), effluent rate (20-25 mL/kg/hr), net ultrafiltration rate (fluid removal goal, typically 50-200 mL/hr)",
        "Replacement fluid and dialysate: commercially prepared bicarbonate-based solutions; pre-dilution (before filter -- protects filter, slightly reduces clearance) or post-dilution (after filter -- better clearance but higher clotting risk)",
        "Drug dosing adjustments: many drugs are cleared by CRRT (antibiotics, sedatives, vasoactive drugs) -- consult pharmacy; supplemental dosing may be needed",
        "Transition to IHD when hemodynamically stable; consider stopping CRRT when urine output recovers (>500 mL/day without diuretics) and labs improve"
      ],
      "nursingActions": [
        "Manage CRRT circuit: monitor pressures (access, return, filter/TMP), adjust anticoagulation, troubleshoot alarms",
        "Maintain strict hourly fluid balance: document all inputs and outputs precisely; calculate net ultrafiltration accurately",
        "Monitor electrolytes every 6 hours: CRRT removes potassium, phosphorus, magnesium, and calcium -- replacement is almost always needed",
        "If using citrate anticoagulation: monitor post-filter iCa (target 0.25-0.35) and systemic iCa (target 1.0-1.2); citrate accumulation (suspect if ratio of total Ca/ionized Ca >2.5) occurs in liver failure",
        "Monitor filter life: average 24-72 hours; signs of impending filter failure include rising TMP, dark filter fibers, decreased clearance",
        "Maintain catheter patency: strict aseptic technique for all connections; do NOT use CRRT catheter for medication administration or blood draws unless emergency",
        "Coordinate with pharmacy for drug dosing in CRRT: many critical medications need dose adjustment (vancomycin, piperacillin-tazobactam, meropenem)",
        "Ensure patient safety during CRRT: limit mobility carefully, prevent circuit disconnection (risk of air embolism or hemorrhage)"
      ],
      "assessmentFindings": [
        "Volume overload signs: peripheral edema, pulmonary crackles, elevated JVP, weight gain, increasing FiO2 requirements",
        "Uremia signs: encephalopathy (confusion, asterixis), pericardial friction rub (uremic pericarditis), nausea/vomiting, uremic frost (rare)",
        "Electrolyte imbalances during CRRT: hypophosphatemia (most common -- CRRT efficiently removes phosphorus), hypokalemia, hypomagnesemia, hypocalcemia (especially with citrate)",
        "Circuit complications: catheter dysfunction (poor blood flow, recirculation), filter clotting (rising TMP, dark fibers), circuit disconnection (air embolism risk, hemorrhage)",
        "Citrate toxicity: metabolic alkalosis, hypocalcemia (total calcium elevated but ionized calcium low), hemodynamic instability -- suspect in liver failure patients on citrate anticoagulation"
      ],
      "signs": {
        "left": [
          "AKI with improving urine output during CRRT support -- consider transition to IHD or CRRT discontinuation",
          "Stable hemodynamics with adequate CRRT clearance and improving labs",
          "Electrolyte losses managed with appropriate replacement protocols"
        ],
        "right": [
          "Refractory hyperkalemia (K+ >6.5 with ECG changes) not responding to medical management -- emergent CRRT initiation",
          "Severe volume overload with respiratory failure not responding to diuretics",
          "Citrate toxicity: total/ionized calcium ratio >2.5 with hemodynamic instability (switch to heparin anticoagulation or no anticoagulation)",
          "Filter clotting every few hours despite adequate anticoagulation -- evaluate for HIT, reconsider anticoagulation strategy",
          "Catheter malfunction with inability to maintain blood flow rates for adequate clearance"
        ]
      },
      "medications": [
        {
          "name": "Trisodium Citrate (4% solution for regional citrate anticoagulation)",
          "type": "Regional anticoagulant (calcium chelator)",
          "action": "Chelates ionized calcium in the extracorporeal circuit, inhibiting the coagulation cascade (calcium is essential for multiple steps of coagulation); regional because anticoagulation occurs ONLY within the circuit -- calcium is infused back into the patient systemically to restore normal coagulation",
          "sideEffects": "Hypocalcemia (systemic ionized calcium must be monitored and repleted), metabolic alkalosis (citrate is metabolized to bicarbonate in the liver), citrate accumulation in liver failure (total calcium rises but ionized falls -- total/ionized ratio >2.5 is diagnostic)",
          "contra": "Severe liver failure or shock (cannot metabolize citrate, causing accumulation and toxicity); in these cases, use systemic heparin or no anticoagulation",
          "pearl": "Preferred over systemic heparin for CRRT anticoagulation (KDIGO guidelines): lower bleeding risk, longer filter life; monitor TWO calcium levels: post-filter ionized Ca (target 0.25-0.35 to anticoagulate the circuit) AND systemic ionized Ca (target 1.0-1.2 to maintain normal patient coagulation); citrate accumulation is signaled by a total Ca/ionized Ca ratio >2.5"
        }
      ],
      "pearls": [
        "CRRT is preferred over IHD when hemodynamic instability would not tolerate rapid fluid/solute shifts (septic shock, cardiogenic shock, acute brain injury)",
        "CRRT removes phosphorus, potassium, and magnesium very efficiently -- virtually ALL patients on CRRT need electrolyte replacement (especially phosphorus)",
        "Regional citrate anticoagulation: anticoagulates the CIRCUIT only (not the patient) -- preferred for patients with bleeding risk; requires monitoring of BOTH post-filter iCa (circuit anticoagulation) and systemic iCa (patient safety)",
        "Citrate accumulation (liver failure patients): suspect when total calcium is HIGH but ionized calcium is LOW (ratio >2.5); citrate cannot be metabolized to bicarbonate; switch to heparin or no anticoagulation",
        "Drug clearance in CRRT: small, unbound, water-soluble drugs are cleared most efficiently; supplement doses of vancomycin, beta-lactams, and other antibiotics -- always consult pharmacy",
        "CRRT effluent dose target: 20-25 mL/kg/hr (KDIGO recommendation based on RENAL and ATN trials -- higher doses did NOT improve outcomes)"
      ],
      "quiz": [
        {
          "question": "Why is CRRT preferred over intermittent hemodialysis in hemodynamically unstable ICU patients?",
          "options": [
            "CRRT provides better toxin clearance",
            "CRRT removes fluid and solutes slowly and continuously, providing superior hemodynamic stability compared to the rapid shifts of IHD",
            "CRRT is less expensive",
            "CRRT does not require vascular access"
          ],
          "correct": 1,
          "rationale": "CRRT provides continuous, gradual fluid and solute removal over 24 hours, avoiding the rapid osmolar shifts and large-volume fluid removal that occur during 4-hour IHD sessions. This gentler approach maintains hemodynamic stability in patients who are already on vasopressors or have unstable blood pressure."
        },
        {
          "question": "A patient on CRRT with citrate anticoagulation has a total calcium of 12.5 mg/dL but ionized calcium of 0.8 mmol/L. The total/ionized ratio is 3.1. What does this indicate?",
          "options": [
            "Normal findings during citrate anticoagulation",
            "Citrate accumulation -- the liver cannot metabolize citrate, causing chelation of ionized calcium",
            "Hyperparathyroidism",
            "Laboratory error"
          ],
          "correct": 1,
          "rationale": "A total Ca/ionized Ca ratio >2.5 indicates citrate accumulation. Citrate chelates ionized calcium, but the total calcium appears elevated because citrate-calcium complexes are measured by the total calcium assay. This occurs when the liver cannot metabolize citrate (liver failure, shock). Management: stop citrate, switch to heparin or no anticoagulation, and replete ionized calcium."
        },
        {
          "question": "Which electrolyte is MOST commonly depleted during CRRT, requiring aggressive replacement?",
          "options": [
            "Sodium",
            "Potassium",
            "Phosphorus",
            "Chloride"
          ],
          "correct": 2,
          "rationale": "Phosphorus is the most commonly depleted electrolyte during CRRT. The semipermeable membrane efficiently removes phosphorus, and unlike potassium (which can be added to replacement fluid), phosphorus must often be supplemented separately. Severe hypophosphatemia can cause respiratory failure (diaphragm weakness), cardiac dysfunction, and hemolytic anemia."
        }
      ]
    },
  "crush-injury-np": {
      "title": "Crush Injury & Crush Syndrome",
      "cellular": {
        "title": "Crush Injury & Rhabdomyolysis Pathophysiology",
        "content": "Crush syndrome is a systemic manifestation of muscle cell damage (rhabdomyolysis) resulting from prolonged compression of skeletal muscle (typically >1 hour). During compression, ischemia causes ATP depletion, disrupting Na+/K+-ATPase and Ca2+-ATPase pumps. Intracellular calcium rises, activating proteases and lipases that destroy the sarcolemma. Upon release of the compressive force (extrication), reperfusion delivers oxygen to damaged cells, generating reactive oxygen species that amplify cellular injury. Simultaneously, the contents of destroyed myocytes flood the systemic circulation: potassium (life-threatening hyperkalemia and cardiac arrest), myoglobin (precipitates in renal tubules causing AKI), phosphorus (hyperphosphatemia, binds calcium), uric acid, creatine kinase, and lactic acid. The triad of crush syndrome is: hyperkalemia (most immediately lethal), myoglobinuric AKI, and hypovolemic shock (third-spacing of fluid into damaged muscle -- up to 12 liters in bilateral lower extremity crush)."
      },
      "riskFactors": [
        "Entrapment under heavy objects: building collapse (earthquakes), motor vehicle accidents, industrial accidents",
        "Prolonged immobilization on hard surface: elderly fall with inability to get up (found down), drug/alcohol-induced immobility",
        "Extensive burns (thermal rhabdomyolysis)",
        "Electrical injuries (especially high-voltage)",
        "Severe exertion (exertional rhabdomyolysis: marathon runners, military training, extreme exercise, sickle cell trait)",
        "Medications/toxins: statins + fibrates (synergistic risk), cocaine, amphetamines, malignant hyperthermia, neuroleptic malignant syndrome",
        "Status epilepticus (prolonged seizure activity damages muscle)",
        "Compression of >10% of total body muscle mass predicts significant crush syndrome"
      ],
      "diagnostics": [
        "Serum CK (creatine kinase): gold standard marker; CK >5,000 U/L significantly predicts AKI; CK >15,000-20,000 U/L nearly universal AKI risk; peak at 24-72 hours after injury; can exceed 100,000 U/L",
        "BMP: hyperkalemia (may be rapidly lethal), hyperphosphatemia, hypocalcemia (calcium binds phosphorus), elevated BUN/creatinine (AKI), metabolic acidosis",
        "Urine: dark tea/cola-colored urine (myoglobinuria); urine dipstick positive for 'blood' but microscopy shows NO red blood cells (myoglobin cross-reacts with hemoglobin reagent)",
        "ECG: monitor for hyperkalemic changes (peaked T waves → widened QRS → sine wave → cardiac arrest)",
        "Lactate: elevated from tissue ischemia and hypovolemic shock",
        "Urine myoglobin: confirms myoglobinuria but may clear faster than CK; a negative urine myoglobin does NOT exclude rhabdomyolysis if CK is elevated",
        "Compartment pressures: assess for compartment syndrome in affected extremities (crush injury and compartment syndrome frequently coexist)"
      ],
      "management": [
        "PRE-HOSPITAL (before extrication): establish IV access and begin aggressive fluid resuscitation BEFORE releasing the crush -- sudden release without pre-hydration can cause fatal hyperkalemia from reperfusion washout",
        "IV fluid resuscitation: aggressive NS 1-1.5 L/hour initially (total volume may need 6-12 L in first 24 hours); target urine output 200-300 mL/hour",
        "Treat hyperkalemia IMMEDIATELY if present: calcium gluconate (cardiac membrane stabilization), insulin + dextrose, sodium bicarbonate, albuterol nebulizer, kayexalate, emergent dialysis if refractory",
        "Urine alkalinization: sodium bicarbonate IV to target urine pH >6.5 (prevents myoglobin precipitation in renal tubules -- myoglobin is most nephrotoxic in acidic urine); controversial but widely used",
        "Avoid: calcium replacement unless symptomatic or severe hypocalcemia (exogenous calcium may deposit in damaged muscle during recovery phase)",
        "Fasciotomy if compartment syndrome develops (crush injury and compartment syndrome frequently coexist)",
        "CRRT/hemodialysis: for refractory hyperkalemia, severe acidosis, volume overload, or established AKI with uremic complications",
        "Monitor for DIC (crush injury releases tissue factor), hypothermia, and ARDS"
      ],
      "nursingActions": [
        "In field/extrication situations: initiate IV fluids BEFORE releasing the entrapped patient (reperfusion without volume loading causes fatal 'reperfusion' hyperkalemia)",
        "Aggressive IV fluid administration: NS at 1-1.5 L/hr initially; monitor strict I&O; target UOP 200-300 mL/hr (significantly higher than standard goal)",
        "Monitor potassium and ECG CONTINUOUSLY: hyperkalemia is the most immediately life-threatening complication; have calcium gluconate at bedside",
        "Monitor CK levels every 6-12 hours: trend to peak (24-72 hours); CK >5,000 U/L increases AKI risk significantly",
        "Assess urine color: dark tea/cola-colored = myoglobinuria; clear urine indicates adequate dilution and clearance",
        "If sodium bicarbonate infusion ordered: monitor blood pH (avoid pH >7.5), monitor ionized calcium (alkalosis worsens hypocalcemia)",
        "Assess extremities for compartment syndrome: pain out of proportion, pain with passive stretch, tense compartments, paresthesias",
        "Prevent hypothermia: massive fluid resuscitation with room-temperature NS causes heat loss; use fluid warmers"
      ],
      "assessmentFindings": [
        "History of prolonged compression or entrapment (>1 hour under heavy object, 'found down' for extended period)",
        "Dark tea/cola-colored urine (myoglobinuria) -- may be the first clinical sign",
        "Swollen, tense, painful extremities (edema of damaged muscle)",
        "Signs of hypovolemic shock: tachycardia, hypotension (fluid third-spacing into damaged muscle)",
        "ECG changes of hyperkalemia: peaked T waves, widened QRS, loss of P waves, sine wave pattern",
        "Decreased or absent urine output (AKI developing)",
        "Altered mental status (uremia, shock, electrolyte derangements)",
        "Signs of compartment syndrome in affected extremities"
      ],
      "signs": {
        "left": [
          "Mild rhabdomyolysis (CK <5,000) with adequate urine output and normal potassium -- IV fluids and monitoring",
          "Exertional rhabdomyolysis resolving with hydration and rest",
          "Dark urine clearing with aggressive fluid resuscitation"
        ],
        "right": [
          "Hyperkalemia with ECG changes (peaked T waves, widened QRS) -- treat immediately (calcium gluconate, insulin/dextrose, consider emergent dialysis)",
          "CK >20,000 with declining urine output and rising creatinine -- impending myoglobinuric AKI, may need CRRT",
          "Crush syndrome with hypovolemic shock from massive third-spacing -- requires aggressive volume resuscitation (may need >10L in 24 hours)",
          "Compartment syndrome developing in crush-injured extremity -- emergent fasciotomy",
          "Cardiac arrest from hyperkalemia during or immediately after extrication"
        ]
      },
      "medications": [
        {
          "name": "Calcium Gluconate 10%",
          "type": "Electrolyte / cardiac membrane stabilizer",
          "action": "In hyperkalemia: does NOT lower potassium -- stabilizes the cardiac membrane by raising the threshold potential, reducing the risk of fatal arrhythmias while other treatments are working to shift or remove potassium; provides a 'bridge' of cardiac protection (onset 1-3 minutes, duration 30-60 minutes)",
          "sideEffects": "Tissue necrosis if extravasated peripherally (prefer central line for CaCl2; Ca gluconate is safer peripherally), bradycardia if administered too rapidly, hypercalcemia with repeated dosing",
          "contra": "Digitalis toxicity (calcium worsens digoxin-related arrhythmias); caution with hypercalcemia",
          "pearl": "10 mL of 10% calcium gluconate IV over 2-3 minutes for hyperkalemic ECG changes; can repeat in 5-10 minutes if ECG changes persist; Ca gluconate preferred peripherally (less tissue necrosis risk than CaCl2); CaCl2 provides 3x more elemental calcium per volume but requires central access; this is the FIRST medication given for hyperkalemic ECG changes (before insulin, before bicarbonate, before anything else)"
        }
      ],
      "pearls": [
        "START IV FLUIDS BEFORE EXTRICATION: releasing a crushed patient without pre-hydration can cause immediate fatal cardiac arrest from reperfusion hyperkalemia -- 'kill by kindness' phenomenon",
        "Hyperkalemia is the MOST IMMEDIATELY LETHAL complication of crush syndrome -- monitor potassium and ECG continuously; have calcium gluconate at bedside",
        "Urine dipstick positive for 'blood' but microscopy shows NO red blood cells = MYOGLOBIN (myoglobin cross-reacts with the hemoglobin reagent on the dipstick)",
        "Target urine output 200-300 mL/hr (much higher than standard 0.5-1 mL/kg/hr) to flush myoglobin through the kidneys before it precipitates",
        "CK is the gold standard for rhabdomyolysis diagnosis: >5,000 U/L = significant AKI risk; >15,000-20,000 = high AKI risk; may exceed 100,000 U/L in severe crush",
        "Do NOT aggressively replace calcium in crush-induced hypocalcemia UNLESS symptomatic (tetany, seizures) or hyperkalemic -- exogenous calcium deposits in damaged muscle during recovery (heterotopic calcification)",
        "Crush injury triad: HYPERKALEMIA + MYOGLOBINURIC AKI + HYPOVOLEMIC SHOCK -- all three must be addressed simultaneously"
      ],
      "quiz": [
        {
          "question": "An earthquake victim has been trapped under rubble for 6 hours. Rescue teams are preparing to extricate. What should be done BEFORE releasing the patient?",
          "options": [
            "Apply a tourniquet to the trapped limb",
            "Establish IV access and begin aggressive normal saline infusion",
            "Administer morphine for pain",
            "Wait for the hospital to prepare an OR for amputation"
          ],
          "correct": 1,
          "rationale": "IV fluids MUST be started BEFORE extrication. When the crush is released, reperfusion washes the contents of destroyed muscle cells (especially potassium) into the systemic circulation, which can cause immediate fatal hyperkalemia and cardiac arrest. Pre-hydration with IV NS dilutes the released potassium and provides volume to counteract the massive third-spacing into damaged muscle."
        },
        {
          "question": "A rhabdomyolysis patient's urine dipstick is positive for blood, but urine microscopy shows NO red blood cells. What explains this finding?",
          "options": [
            "Laboratory error",
            "Myoglobin in the urine cross-reacts with the hemoglobin reagent on the dipstick, producing a false-positive for blood",
            "The patient also has a UTI",
            "The dipstick has expired"
          ],
          "correct": 1,
          "rationale": "Myoglobin's chemical structure is similar enough to hemoglobin that it cross-reacts with the hemoglobin reagent on the urine dipstick, producing a positive 'blood' result. However, microscopy shows no RBCs because the color reaction is from myoglobin, not hemoglobin. This is the classic urine finding of myoglobinuria/rhabdomyolysis."
        },
        {
          "question": "A crush injury patient has peaked T waves and a widened QRS on ECG with K+ of 7.2. What is the FIRST medication to administer?",
          "options": [
            "Insulin with dextrose (shifts K+ into cells)",
            "Calcium gluconate IV (stabilizes cardiac membrane)",
            "Sodium bicarbonate (shifts K+ into cells)",
            "Kayexalate (removes K+ from body)"
          ],
          "correct": 1,
          "rationale": "Calcium gluconate is the FIRST medication given for hyperkalemia with ECG changes. It does NOT lower potassium but stabilizes the cardiac membrane within 1-3 minutes, preventing fatal arrhythmias while other treatments (insulin/dextrose, bicarbonate, dialysis) are working to actually reduce potassium levels. Think of it as 'buying time' for the heart."
        }
      ]
    },
  "cryoglobulinemia-rn": {
        title: "Cryoglobulinemia",
        cellular: { title: "Cryoglobulin-Mediated Immune Complex", content: "Cryoglobulinemia is a systemic condition characterized by the presence of cryoglobulins -- immunoglobulins that reversibly precipitate at temperatures below 37C and redissolve upon warming. When these abnormal proteins precipitate in the cooler peripheral microcirculation (fingers, toes, ears, nose, skin of the lower extremities), they deposit in small vessel walls, activate the complement cascade, and trigger a small-vessel vasculitis that can damage the skin, kidneys, peripheral nerves, and other organs. Cryoglobulinemia is classified into three types based on the Brouet classification. Type I cryoglobulinemia consists of a single monoclonal immunoglobulin (usually IgM or IgG) and is associated with lymphoproliferative disorders such as Waldenstrom macroglobulinemia, multiple myeloma, or chronic lymphocytic leukemia. The monoclonal protein precipitates in the cold, causing hyperviscosity and vascular occlusion rather than immune complex-mediated inflammation. Type II cryoglobulinemia (mixed cryoglobulinemia) consists of a monoclonal IgM with rheumatoid factor (RF) activity directed against polyclonal IgG. Type III cryoglobulinemia consists of polyclonal IgM with RF activity directed against polyclonal IgG. Types II and III are collectively called 'mixed cryoglobulinemia' because they contain more than one immunoglobulin class. Mixed cryoglobulinemia is the most clinically significant form and is strongly associated with chronic hepatitis C virus (HCV) infection -- approximately 80-90% of mixed cryoglobulinemia cases are attributable to HCV. The pathogenesis of HCV-associated mixed cryoglobulinemia involves chronic antigenic stimulation of B lymphocytes by HCV. The virus infects hepatocytes but also directly infects B cells (binding to CD81, a B-cell coreceptor). Chronic HCV infection drives sustained B-cell activation, clonal expansion, and production of RF-positive IgM that forms immune complexes with IgG and viral antigens. These circulating immune complexes precipitate at cooler temperatures in small blood vessels, depositing in vessel walls and activating the classical complement pathway (C1q binding to the Fc region of IgG within the cryoprecipitate). Complement activation generates the anaphylatoxins C3a and C5a (attracting neutrophils and macrophages), the membrane attack complex (C5b-9, causing endothelial damage), and C3b opsonization. The resulting inflammatory cascade causes a leukocytoclastic vasculitis -- neutrophilic infiltration of vessel walls with nuclear debris (leukocytoclasis), fibrinoid necrosis of the vessel wall, and extravasation of red blood cells into the perivascular tissue. The classic clinical presentation of mixed cryoglobulinemia is the Meltzer triad: palpable purpura (non-blanching purpuric papules predominantly on the lower extremities -- caused by immune complex deposition in dermal small vessels), arthralgias (non-deforming joint pain from synovial vasculitis), and weakness/fatigue. Renal involvement (membranoproliferative glomerulonephritis/MPGN type I -- immune complex deposition in the glomerular capillary basement membrane causing proliferation of mesangial and endothelial cells) occurs in 20-35% of patients and can progress to renal failure. Peripheral neuropathy (mononeuritis multiplex or distal symmetric polyneuropathy from vasa nervorum vasculitis) occurs in 50-80% of patients, causing sensory symptoms (numbness, paresthesias, burning pain) predominantly in the lower extremities. Laboratory findings include positive cryoglobulins (the blood sample MUST be drawn and processed at 37C to prevent premature cryoprecipitation), positive rheumatoid factor (from the IgM-RF component), low C4 complement (classical complement pathway consumption -- C4 is preferentially depleted because it is consumed early in the classical pathway), and often positive HCV antibodies and detectable HCV RNA. Treatment targets both the underlying cause (HCV eradication with direct-acting antiviral agents such as sofosbuvir-based regimens, which cure HCV in >95% of patients and often resolve the cryoglobulinemia) and the immune-mediated inflammatory damage (rituximab for moderate-to-severe vasculitis, particularly renal and neurological involvement; plasmapheresis for severe or life-threatening disease to rapidly remove circulating cryoglobulins; corticosteroids for acute flares). The management of HCV-associated cryoglobulinemia has been transformed by direct-acting antivirals (DAAs), which achieve sustained virological response in >95% of patients -- HCV eradication often leads to clearance of cryoglobulins and resolution of clinical manifestations over months." },
        riskFactors: ["Chronic hepatitis C virus infection (accounts for 80-90% of mixed cryoglobulinemia cases; chronic HCV drives B-cell activation and RF-positive IgM production)","Lymphoproliferative disorders (Waldenstrom macroglobulinemia, multiple myeloma, CLL -- associated with Type I monoclonal cryoglobulinemia)","Autoimmune diseases (systemic lupus erythematosus, rheumatoid arthritis, Sjogren syndrome -- may produce polyclonal cryoglobulins)","Hepatitis B virus infection (less common association than HCV but can cause mixed cryoglobulinemia)","HIV infection (associated with mixed cryoglobulinemia through chronic immune stimulation)","Cold climate exposure (cold temperatures precipitate cryoglobulin deposition in the peripheral microcirculation, triggering vasculitic episodes)","Female sex (slight female predominance, particularly in HCV-associated cryoglobulinemia)"],
        diagnostics: ["Serum cryoglobulin assay (CRITICAL: blood must be drawn into a prewarmed tube, transported at 37C, and allowed to clot at 37C before refrigeration at 4C for 72 hours to detect cryoprecipitate -- improper specimen handling is the most common cause of false-negative results)","Cryocrit measurement (the percentage of serum volume occupied by cryoprecipitate after centrifugation at 4C; cryocrit >5% suggests clinically significant disease)","Cryoglobulin characterization by immunofixation electrophoresis (identifies the type: monoclonal IgM = Type I; monoclonal IgM + polyclonal IgG = Type II; polyclonal IgM + polyclonal IgG = Type III -- determines underlying etiology and prognosis)","Complement levels (C4 is characteristically LOW from classical complement pathway consumption; C3 may be normal or mildly reduced; low C4 with relatively preserved C3 is a clue to cryoglobulinemia)","Rheumatoid factor (positive in mixed cryoglobulinemia -- the IgM component has RF activity; high-titer RF in a patient with purpura and low C4 should prompt cryoglobulin testing)","HCV antibody and HCV RNA viral load (essential to identify the underlying HCV infection driving cryoglobulin production; all patients with mixed cryoglobulinemia should be tested for HCV)","Kidney biopsy (if renal involvement suspected: membranoproliferative glomerulonephritis Type I with subendothelial immune complex deposits, mesangial proliferation, and characteristic wire loop lesions on light microscopy; immunofluorescence shows IgM, IgG, and C3 deposits)"],
        management: ["Direct-acting antiviral therapy for HCV-associated cryoglobulinemia (sofosbuvir-based regimens: sofosbuvir/velpatasvir or sofosbuvir/ledipasvir for 12 weeks; HCV cure rate >95%; cryoglobulin clearance and clinical improvement often follow SVR over months -- this is the cornerstone of treatment)","Rituximab (anti-CD20) for moderate-to-severe vasculitis manifestations (renal involvement, severe neuropathy, non-healing ulcers): 375 mg/m2 IV weekly x 4 weeks or 1g IV days 1 and 15; targets B cells producing the pathogenic cryoglobulins","Plasmapheresis for severe or life-threatening disease (rapidly removes circulating cryoglobulins from the blood; used as bridge therapy while rituximab and antivirals take effect; indicated for severe renal failure, life-threatening vasculitis, or hyperviscosity syndrome)","Corticosteroids (prednisone 0.5-1 mg/kg/day) for acute flares with significant organ involvement; taper as antiviral and rituximab therapy take effect; avoid prolonged high-dose steroids (HCV replication may increase with immunosuppression)","Cold avoidance (protect extremities from cold exposure to prevent cryoglobulin precipitation and vasculitic flares)","Treatment of underlying lymphoproliferative disorder for Type I cryoglobulinemia (chemotherapy directed at the clonal B-cell or plasma cell neoplasm)"],
        nursingActions: ["Ensure proper cryoglobulin specimen collection: blood must be drawn into a PREWARMED tube (maintained at 37C using a warming device or warm water bath), transported to the laboratory at 37C, and processed at 37C before refrigeration -- improper handling causes false-negative results; coordinate with the laboratory before collection","Maintain warm environment for patients: room temperature >72F (22C), warm blankets, avoid cold drafts; cold exposure precipitates cryoglobulin deposition in the peripheral microcirculation and triggers vasculitic episodes","Assess skin daily for purpura (non-blanching purpuric papules/patches, predominantly on the lower extremities), skin ulcers, livedo reticularis, and digital ischemia; document location, size, and evolution of lesions","Monitor renal function: daily BUN/creatinine, urinalysis (proteinuria, hematuria, RBC casts indicate glomerulonephritis), urine output, fluid balance, blood pressure (hypertension from renal involvement)","Assess peripheral neurological function: sensory testing (light touch, pinprick, temperature discrimination in distal extremities), strength testing, deep tendon reflexes; neuropathy from vasa nervorum vasculitis typically presents as numbness, burning pain, and paresthesias in the feet","Administer rituximab infusions per protocol with appropriate pre-medication (acetaminophen, diphenhydramine, corticosteroid) and monitor for infusion reactions (fever, chills, rigors, hypotension, bronchospasm)","Educate patients about cold avoidance strategies (similar to cold agglutinin disease): warm gloves, warm socks, avoid handling cold objects, avoid swimming in cold water, keep home temperature warm"],
        assessmentFindings: ["Palpable purpura on the lower extremities (non-blanching purpuric papules from small-vessel vasculitis -- the hallmark cutaneous manifestation; may be triggered by prolonged standing or cold exposure)","Arthralgias (non-deforming joint pain, typically affecting the hands and knees; joint swelling without erosive changes distinguishes from rheumatoid arthritis)","Peripheral neuropathy (numbness, paresthesias, burning pain in the distal lower extremities from vasa nervorum vasculitis; may present as mononeuritis multiplex or distal symmetric polyneuropathy)","Fatigue and weakness (constitutional symptoms present in most patients; part of the Meltzer triad)","Renal dysfunction (proteinuria, hematuria, elevated creatinine from membranoproliferative glomerulonephritis; hypertension)","Raynaud-like phenomena (cold-induced acrocyanosis or digital ischemia from cryoglobulin precipitation in the digital microcirculation)","Positive rheumatoid factor with low C4 complement (serological hallmark -- high-titer RF with selectively low C4 in the setting of purpura and neuropathy is highly suggestive)"],
        signs: { left: ["Mild intermittent purpura on lower extremities without organ involvement","Positive cryoglobulins with low cryocrit (<2%) and stable renal function","Successful HCV eradication with DAAs and gradual clearance of cryoglobulins","Mild sensory neuropathy managed with gabapentin and cold avoidance"], right: ["Severe membranoproliferative glomerulonephritis with rapidly progressive renal failure requiring dialysis","Diffuse vasculitic skin ulcers with secondary infection and poor healing","Life-threatening hyperviscosity syndrome (Type I) with visual changes, confusion, and bleeding","Fulminant widespread vasculitis with multi-organ failure requiring plasmapheresis and ICU care","Intestinal vasculitis with mesenteric ischemia and bowel infarction"] },
        medications: [{ name: "Rituximab (Rituxan)", type: "Anti-CD20 chimeric monoclonal antibody", action: "Binds to the CD20 antigen expressed on the surface of pre-B and mature B lymphocytes, triggering B-cell destruction through complement-dependent cytotoxicity (CDC), antibody-dependent cellular cytotoxicity (ADCC), and direct induction of apoptosis. In cryoglobulinemia, rituximab depletes the B-cell clones responsible for producing the pathogenic cryoglobulins (the IgM-RF component in mixed cryoglobulinemia). By eliminating the source of cryoglobulin production, rituximab reduces circulating cryoglobulin levels and alleviates the immune complex-mediated vasculitis affecting the skin, kidneys, and peripheral nerves. Rituximab is preferred over traditional immunosuppressants (cyclophosphamide, azathioprine) because it specifically targets B cells without the broader immunosuppressive and toxic effects of alkylating agents.", sideEffects: "Infusion-related reactions (fever, chills, rigors, hypotension, bronchospasm -- most common with first infusion; pre-medicate with acetaminophen, diphenhydramine, and corticosteroid), hepatitis B reactivation (screen ALL patients for HBV before treatment; HBsAg-positive patients require antiviral prophylaxis), progressive multifocal leukoencephalopathy (rare, fatal JC virus reactivation), late-onset neutropenia, hypogammaglobulinemia with recurrent infections, serum sickness-like reactions", contra: "Active severe infections; HBV carriers without antiviral prophylaxis; known hypersensitivity; live vaccines during and for 6-12 months after treatment", pearl: "Standard dosing: 375 mg/m2 IV weekly x 4 weeks or 1000 mg IV on days 1 and 15; response typically seen in 4-12 weeks; in HCV-associated cryoglobulinemia, rituximab is used ALONGSIDE direct-acting antiviral therapy (not as a substitute for HCV eradication); HBV screening (HBsAg, anti-HBc) is MANDATORY before first dose; caution in HCV patients: rituximab may transiently increase HCV viral load (theoretical concern of accelerated liver disease, though clinical significance is debated); AVOID in active HBV (can cause fulminant hepatitis from HBV reactivation); monitor immunoglobulin levels during treatment (hypogammaglobulinemia increases infection risk)" },{ name: "Prednisone", type: "Systemic corticosteroid (glucocorticoid)", action: "Binds to intracellular glucocorticoid receptors, modulating inflammatory gene transcription. Suppresses the immune-mediated vasculitis in cryoglobulinemia by reducing pro-inflammatory cytokine production (IL-1, IL-6, TNF-alpha), inhibiting neutrophil migration to vessel walls (reducing leukocytoclasis), stabilizing endothelial cell membranes, and reducing complement-mediated tissue damage. In acute cryoglobulinemic vasculitis flares, prednisone rapidly suppresses the inflammatory cascade causing organ damage (renal inflammation, skin vasculitis, peripheral nerve injury) while definitive therapies (antivirals, rituximab) take weeks to months to achieve their full effect.", sideEffects: "Short-term: hyperglycemia, insomnia, mood changes, increased appetite, fluid retention, immunosuppression. Long-term: Cushingoid features, osteoporosis, adrenal suppression, cataracts, myopathy, avascular necrosis. IMPORTANT in HCV: high-dose corticosteroids may increase HCV replication (immunosuppression allows viral proliferation), potentially worsening liver disease -- use the lowest effective dose for the shortest duration", contra: "Active untreated systemic fungal infections; caution in diabetes (causes significant hyperglycemia), peptic ulcer disease, osteoporosis; use cautiously in HCV patients (may increase viral replication)", pearl: "Dose: 0.5-1 mg/kg/day PO for acute cryoglobulinemic vasculitis flares (renal involvement, severe neuropathy, extensive purpura with ulceration); taper over 4-8 weeks as rituximab and antiviral therapy take effect; monitor blood glucose closely (especially in HCV patients with hepatic dysfunction who may have impaired glucose metabolism at baseline); GI prophylaxis with PPI; concurrent antiviral therapy is essential in HCV-associated disease -- corticosteroids alone may worsen HCV infection; for mild disease (intermittent purpura without organ involvement), steroids are usually not necessary (cold avoidance + antiviral therapy may suffice)" },{ name: "Sofosbuvir/Velpatasvir (Epclusa)", type: "Pan-genotypic direct-acting antiviral combination (NS5B + NS5A inhibitors)", action: "Sofosbuvir is a nucleotide analogue inhibitor of the HCV NS5B RNA-dependent RNA polymerase -- the enzyme responsible for replicating the HCV genome. After intracellular phosphorylation to its active triphosphate form (GS-461203), sofosbuvir is incorporated into the growing HCV RNA chain by NS5B, causing chain termination and preventing viral replication. Velpatasvir inhibits the HCV NS5A protein, a multifunctional phosphoprotein essential for viral RNA replication, virion assembly, and secretion. The combination of two DAAs with different mechanisms of action provides synergistic antiviral activity and a high barrier to resistance. By eradicating HCV (sustained virological response/SVR in >95% of patients across all genotypes), sofosbuvir/velpatasvir removes the chronic antigenic stimulus driving B-cell activation and cryoglobulin production, leading to gradual resolution of mixed cryoglobulinemia over months following SVR.", sideEffects: "Generally very well tolerated; headache, fatigue, nausea (mild and self-limited in most cases); CRITICAL drug interaction: sofosbuvir + amiodarone can cause symptomatic bradycardia including cardiac arrest (contraindicated combination); HBV reactivation possible during or after HCV treatment (screen for HBV before starting DAAs; co-infected patients need HBV monitoring and may need concurrent HBV therapy)", contra: "Co-administration with rifampin, carbamazepine, or other potent P-gp inducers (reduce sofosbuvir levels below therapeutic threshold); co-administration with amiodarone (bradycardia risk); severe renal impairment (sofosbuvir metabolite accumulates -- use with caution if eGFR <30 mL/min, though newer data support use with monitoring)", pearl: "One tablet (sofosbuvir 400 mg/velpatasvir 100 mg) PO once daily x 12 weeks for ALL HCV genotypes; SVR rate >95% in clinical trials; for HCV-associated cryoglobulinemia, HCV eradication is the CORNERSTONE of treatment -- cryoglobulin clearance and clinical improvement (reduction in purpura, stabilization of renal function, improvement in neuropathy) typically follow SVR over 6-12 months; screen for HBV co-infection before starting (HBV reactivation during DAA therapy has been reported); check drug interactions carefully (sofosbuvir levels affected by P-gp inducers); no food requirement; well-tolerated with minimal side effects compared to older interferon-based HCV regimens; in patients with decompensated cirrhosis, add ribavirin and extend treatment to 24 weeks; monitor CBC, hepatic function panel, and HCV RNA at baseline, during treatment, and 12 weeks post-treatment (SVR12 = cure)" }],
        pearls: ["Cryoglobulin specimen collection requires strict temperature control: blood MUST be drawn into a prewarmed tube maintained at 37C, transported at 37C, and allowed to clot at 37C before refrigeration -- improper specimen handling is the #1 cause of false-negative cryoglobulin testing","The Meltzer triad of palpable purpura, arthralgias, and weakness/fatigue is the classic clinical presentation of mixed cryoglobulinemia -- purpura characteristically affects the lower extremities and is triggered by prolonged standing or cold exposure","Low C4 complement with relatively preserved C3 is a serological clue to cryoglobulinemia -- the classical complement pathway is preferentially activated by cryoglobulin immune complexes, consuming C4 early in the cascade; this pattern (low C4, normal or mildly low C3) should trigger cryoglobulin testing","Approximately 80-90% of mixed cryoglobulinemia cases are caused by chronic hepatitis C virus infection -- ALL patients with newly diagnosed mixed cryoglobulinemia should be tested for HCV; HCV eradication with direct-acting antivirals (>95% cure rate) is the cornerstone of treatment","Rituximab targets B cells producing the pathogenic cryoglobulins and is preferred over cyclophosphamide for moderate-to-severe cryoglobulinemic vasculitis because it specifically depletes B cells without the broader toxic effects of alkylating agents; screen for HBV before starting rituximab (risk of fatal HBV reactivation)","Cold avoidance is essential for all patients with cryoglobulinemia: cryoglobulins precipitate at temperatures below 37C, and cold exposure drives deposition in the peripheral microcirculation, triggering vasculitic flares -- warm gloves, warm socks, warm environment","Renal involvement (membranoproliferative glomerulonephritis type I) occurs in 20-35% of patients and can progress to renal failure -- monitor urinalysis (proteinuria, hematuria), serum creatinine, and blood pressure at every visit; early renal involvement may be silent and detected only by laboratory screening"],
    quiz: [{ question: "A patient with hepatitis C presents with palpable purpura on the lower extremities, arthralgias, and decreased complement levels. Which condition should the nurse suspect?", options: ["Henoch-Schonlein purpura", "Mixed cryoglobulinemia", "Thrombotic thrombocytopenic purpura", "Immune thrombocytopenic purpura"], correct: 1, rationale: "Mixed cryoglobulinemia (Type II/III) is strongly associated with hepatitis C infection. The triad of palpable purpura, arthralgias, and hypocomplementemia (especially low C4) is classic. Cryoglobulins are immunoglobulins that precipitate at temperatures below 37 degrees Celsius, causing small-vessel vasculitis." },
      { question: "When collecting a blood sample for cryoglobulin testing, which nursing action is most critical?", options: ["Collect the sample in a heparinized tube", "Keep the sample at room temperature or 37 degrees Celsius during transport", "Refrigerate the sample immediately after collection", "Collect the sample after the patient has fasted for 12 hours"], correct: 1, rationale: "Cryoglobulins precipitate at temperatures below 37 degrees Celsius. If the sample cools during transport, cryoglobulins will precipitate and be removed during serum separation, causing a false-negative result. The sample must be kept warm (37 degrees Celsius) until the serum is separated in the laboratory." },
      { question: "A patient's cryoglobulin test returns negative, but the clinical presentation (purpura, positive RF, low C4, peripheral neuropathy) strongly suggests cryoglobulinemia. What is the most likely explanation for the negative result?", options: ["The patient does not have cryoglobulinemia -- another diagnosis should be sought","The blood specimen was not collected and transported at 37C -- improper handling caused the cryoglobulins to precipitate and be discarded with the clot before the laboratory could detect them","Cryoglobulin testing is unreliable and should not be used for diagnosis","The patient needs a higher dose of the cryoglobulin reagent"], correct: 1, rationale: "Improper specimen handling is the most common cause of false-negative cryoglobulin testing. Cryoglobulins precipitate at temperatures below 37C. If the blood specimen cools below 37C during collection or transport (which occurs rapidly in standard phlebotomy tubes at room temperature), the cryoglobulins precipitate and become trapped in the blood clot during centrifugation, yielding a falsely negative serum result. The specimen must be drawn into a pre-warmed tube, maintained at 37C during transport, and allowed to clot at 37C before the serum is separated and refrigerated for cryoglobulin detection." },{ question: "Why is hepatitis C virus testing MANDATORY in all patients diagnosed with mixed cryoglobulinemia?", options: ["Because HCV is a rare but possible cause and should be excluded as a formality","Because chronic HCV infection is the underlying cause in 80-90% of mixed cryoglobulinemia cases, and HCV eradication with direct-acting antivirals is the cornerstone of treatment that can resolve the cryoglobulinemia","Because HCV testing is required before starting prednisone","Because HCV causes Type I monoclonal cryoglobulinemia exclusively"], correct: 1, rationale: "Chronic hepatitis C virus infection drives B-cell activation and production of the IgM-RF that forms the pathogenic cryoglobulin immune complexes in 80-90% of mixed cryoglobulinemia cases. Identifying HCV as the underlying cause is critical because HCV eradication with direct-acting antivirals (cure rate >95%) removes the chronic antigenic stimulus driving cryoglobulin production. Following sustained virological response (SVR), cryoglobulin levels decline and clinical manifestations (purpura, neuropathy, renal disease) often improve or resolve over months. Without HCV eradication, treatment with rituximab and steroids provides only temporary suppression." },{ question: "A patient with cryoglobulinemia develops worsening proteinuria (3.2 g/day), hematuria, and a rising creatinine from 1.1 to 2.4 mg/dL over 2 weeks. What renal complication is this, and what is the expected biopsy finding?", options: ["Minimal change disease with diffuse podocyte effacement","Membranoproliferative glomerulonephritis (MPGN) type I with subendothelial immune complex deposits containing IgM, IgG, and complement -- from cryoglobulin deposition in the glomerular capillary walls","IgA nephropathy with mesangial IgA deposits","Focal segmental glomerulosclerosis from hypertension"], correct: 1, rationale: "Renal involvement in mixed cryoglobulinemia is characteristically membranoproliferative glomerulonephritis (MPGN) type I. The circulating cryoglobulin immune complexes (containing IgM-RF, IgG, and HCV antigens) deposit in the subendothelial space of the glomerular capillary basement membrane. This triggers mesangial cell proliferation, endothelial cell proliferation, and complement activation, producing the classic MPGN pattern on light microscopy with double-contour (tram-track) basement membranes. Immunofluorescence shows granular deposits of IgM, IgG, C3, and C4 along the capillary walls. This complication requires aggressive treatment with rituximab, HCV eradication, and potentially plasmapheresis." }]
  },
};
