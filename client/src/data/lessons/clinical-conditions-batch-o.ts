import type { LessonContent } from "./types";

export const clinicalConditionsBatchOLessons: Record<string, LessonContent> = {
  "rhinosinusitis-rpn": {
    title: "Rhinosinusitis",
    cellular: {
      title: "Pathophysiology of Rhinosinusitis",
      content: "Rhinosinusitis is inflammation of the nasal mucosa and paranasal sinuses. Viral rhinosinusitis (rhinovirus, coronavirus, influenza, adenovirus) causes mucosal edema that obstructs sinus ostia, impairing mucociliary clearance and leading to mucus accumulation. Complete recovery occurs in 99% of viral cases within 7–10 days. In a small subset, bacterial superinfection develops when sinus ostia obstruction allows colonization by Streptococcus pneumoniae, Haemophilus influenzae, or Moraxella catarrhalis. Prolonged inflammation can progress to an anaerobic phase with organisms such as Peptostreptococcus, Prevotella, and Fusobacterium species. The nurse monitors symptoms, administers medications as ordered, educates on supportive measures, and reports signs of deterioration."
    },
    riskFactors: [
      "Recent upper respiratory infection",
      "Allergic rhinitis",
      "Nasal polyps or deviated septum",
      "Dental infections (maxillary sinusitis)",
      "Smoking or secondhand smoke exposure",
      "Immunosuppression",
      "Swimming or diving",
      "Environmental irritants and dry air"
    ],
    diagnostics: [
      "Monitor duration of symptoms and report if persisting beyond 10 days",
      "Record temperature and report fever >39°C with purulent discharge",
      "Report double worsening pattern (improvement followed by new deterioration)",
      "Document nasal discharge color and consistency changes",
      "Monitor for facial pain or pressure location and intensity"
    ],
    management: [
      "Administer analgesics and antipyretics as ordered (acetaminophen, ibuprofen)",
      "Assist with nasal saline irrigation using low-pressure isotonic irrigators as directed",
      "Administer intranasal corticosteroids as ordered (fluticasone, budesonide)",
      "Administer short-term topical decongestants as ordered and monitor for rebound congestion",
      "Encourage adequate hydration and humidified air",
      "Administer antibiotics as ordered if bacterial sinusitis is diagnosed"
    ],
    nursingActions: [
      "Assess and document facial pain location, character, and severity using pain scale",
      "Monitor vital signs and report fever, tachycardia, or signs of systemic toxicity",
      "Educate patient on proper nasal saline irrigation technique",
      "Reinforce importance of completing antibiotic course if prescribed",
      "Report red flags: orbital swelling, visual changes, severe headache, altered mental status",
      "Educate on limiting topical decongestant use to 3–5 days to prevent rhinitis medicamentosa"
    ],
    signs: {
      left: [
        "Nasal congestion and rhinorrhea",
        "Facial pain or pressure over sinuses",
        "Cough (often worse at night)",
        "Sore throat from postnasal drip",
        "Decreased or absent sense of smell",
        "Low-grade fever in viral cases"
      ],
      right: [
        "Purulent nasal discharge (bacterial)",
        "High fever >39°C",
        "Severe unilateral facial pain",
        "Double worsening after initial improvement",
        "Periorbital edema (complication)",
        "Dental pain (maxillary sinusitis)"
      ]
    },
    medications: [
      { name: "Acetaminophen", type: "Analgesic/Antipyretic", action: "Inhibits prostaglandin synthesis in the CNS to reduce pain and fever", sideEffects: "Hepatotoxicity at high doses", contra: "Severe hepatic impairment, chronic alcohol use", pearl: "First-line for pain and fever in rhinosinusitis. Maximum 4g/day in healthy adults; 2g/day in liver disease." },
      { name: "Fluticasone propionate (intranasal)", type: "Intranasal corticosteroid", action: "Reduces mucosal inflammation and edema by suppressing inflammatory mediators", sideEffects: "Nasal dryness, epistaxis, headache", contra: "Untreated nasal infections, nasal surgery (recent)", pearl: "Effective for moderate-to-severe nasal symptoms. Onset of benefit may take 12–24 hours." },
      { name: "Oxymetazoline", type: "Topical decongestant", action: "Alpha-1 adrenergic agonist causing nasal mucosal vasoconstriction and reduced edema", sideEffects: "Rebound congestion (rhinitis medicamentosa), transient BP elevation", contra: "MAO inhibitor use, narrow-angle glaucoma, poorly controlled hypertension", pearl: "Limit use to 3–5 days maximum. Rebound congestion develops rapidly with prolonged use due to receptor desensitization." },
      { name: "Amoxicillin-Clavulanate", type: "Beta-lactam antibiotic", action: "Amoxicillin inhibits cell wall synthesis; clavulanic acid inhibits beta-lactamases extending spectrum", sideEffects: "Diarrhea, nausea (primarily from clavulanic acid), rash", contra: "Penicillin allergy, history of cholestatic jaundice with amoxicillin-clavulanate", pearl: "First-line antibiotic for acute bacterial rhinosinusitis. GI side effects are reduced with lower clavulanate formulations." }
    ],
    pearls: [
      "Viral rhinosinusitis resolves in 99% of cases without antibiotics within 7–10 days",
      "Bacterial sinusitis is suspected when symptoms persist >10 days, fever >39°C with purulent discharge, or double worsening occurs",
      "Rebound nasal congestion (rhinitis medicamentosa) can develop within days of continuous topical decongestant use",
      "Oral phenylephrine has poor evidence of efficacy compared to intranasal formulations",
      "Red flags requiring immediate reporting include orbital signs, visual changes, severe facial swelling, and neurological symptoms"
    ],
    quiz: [
      { question: "Which finding should the nurse report immediately in a patient with rhinosinusitis?", options: ["Clear nasal discharge for 5 days", "Orbital swelling and visual changes", "Mild facial pressure over maxillary sinus", "Low-grade fever of 37.8°C"], correct: 1, rationale: "Orbital swelling and visual changes are red flags that may indicate orbital complications of sinusitis requiring urgent medical evaluation." },
      { question: "Why should topical nasal decongestants be limited to 3–5 days of use?", options: ["They cause permanent nasal damage", "They lead to rebound congestion (rhinitis medicamentosa)", "They interact with all antibiotics", "They cause hearing loss"], correct: 1, rationale: "Prolonged use of topical decongestants causes alpha-1 receptor desensitization and rebound vasodilation, worsening congestion." },
      { question: "Which pattern of symptoms suggests bacterial rather than viral rhinosinusitis?", options: ["Symptoms resolving after 5 days", "Improvement followed by worsening (double worsening)", "Bilateral clear rhinorrhea", "Symptoms starting after allergen exposure"], correct: 1, rationale: "Double worsening—initial improvement followed by new fever, increasing purulent discharge, or worsening facial pain—strongly suggests secondary bacterial infection." }
    ]
  },

  "rhinosinusitis-rn": {
    title: "Rhinosinusitis",
    cellular: {
      title: "Advanced Pathophysiology of Rhinosinusitis",
      content: "Rhinosinusitis involves inflammation of the sinonasal mucosa with impaired mucociliary clearance. Viral infection triggers mucosal edema that blocks sinus ostia, creating a hypoxic, stagnant environment conducive to bacterial colonization. Viral-bacterial synergy mechanisms include induction of local inflammation, obstruction of sinus ostia, increased bacterial attachment to nasal epithelial cells, and disruption of local immune defense. The aerobic bacterial phase involves S. pneumoniae, H. influenzae, and M. catarrhalis, while the anaerobic phase develops with prolonged obstruction featuring Peptostreptococcus, Prevotella, and Fusobacterium species. Phenylephrine, a selective alpha-1 agonist, decreases hydrostatic capillary pressure and reduces mucosal blood volume but does not directly reduce inflammation. Rebound congestion occurs through rapid tachyphylaxis, receptor desensitization, compensatory vasodilation, and inflammatory cell infiltration. The nurse performs comprehensive assessment, differentiates viral from bacterial presentations, implements protocol-based treatment, and coordinates care escalation."
    },
    riskFactors: [
      "Preceding viral upper respiratory infection",
      "Allergic rhinitis and atopy",
      "Anatomical obstruction (deviated septum, polyps)",
      "Dental pathology affecting maxillary sinus",
      "Immunocompromise (diabetes, HIV, chemotherapy)",
      "Smoking and environmental pollutants",
      "Cystic fibrosis",
      "Barotrauma (flying, diving)"
    ],
    diagnostics: [
      "Perform comprehensive head and sinus assessment: palpation for tenderness over frontal, maxillary, and ethmoid sinuses",
      "Assess nasal discharge character: clear/serous (viral) vs. purulent (bacterial)",
      "Differentiate viral vs. bacterial using clinical criteria: duration >10 days, fever >39°C with purulent discharge, double worsening",
      "Evaluate for orbital complications: periorbital edema, proptosis, limited extraocular movements",
      "Assess for signs of intracranial complications: severe headache, altered mental status, meningismus",
      "Monitor vital signs for systemic toxicity: high fever, tachycardia, hypotension",
      "Evaluate transillumination findings if performed"
    ],
    management: [
      "Implement supportive care protocol for viral rhinosinusitis: saline irrigation, analgesics, intranasal corticosteroids",
      "Administer prescribed antibiotics for confirmed bacterial rhinosinusitis per protocol",
      "Monitor for antibiotic therapy failure (no improvement after 48–72 hours) and report to provider",
      "Coordinate urgent ophthalmology or ENT referral for orbital or intracranial complications",
      "Implement IV antibiotic therapy for complicated sinusitis as ordered",
      "Manage pain with multimodal approach: scheduled acetaminophen, warm compresses, positioning"
    ],
    nursingActions: [
      "Perform systematic sinus assessment documenting location, quality, and severity of symptoms",
      "Differentiate viral from bacterial presentations using clinical criteria and timeline",
      "Educate patient on proper nasal saline irrigation technique and frequency",
      "Assess for and document red flags: orbital signs, neurological changes, severe toxicity",
      "Monitor therapeutic response to antibiotics and report lack of improvement at 48–72 hours",
      "Provide discharge education on symptom monitoring, medication compliance, and return precautions",
      "Coordinate care with pharmacy regarding antibiotic selection in penicillin-allergic patients",
      "Implement infection control measures for viral cases to prevent transmission"
    ],
    signs: {
      left: [
        "Nasal congestion with mucopurulent drainage",
        "Facial pain/pressure worsening with bending forward",
        "Postnasal drip with cough",
        "Hyposmia or anosmia",
        "Headache localized to affected sinus",
        "Fever (low-grade viral; high-grade bacterial)",
        "Fatigue and malaise"
      ],
      right: [
        "Periorbital cellulitis (orbital complication)",
        "Proptosis with restricted eye movement",
        "Cavernous sinus thrombosis signs",
        "Meningeal signs (nuchal rigidity)",
        "Altered mental status",
        "Severe unilateral swelling",
        "Dental pain with maxillary tenderness"
      ]
    },
    medications: [
      { name: "Amoxicillin-Clavulanate", type: "Beta-lactam antibiotic", action: "Inhibits bacterial cell wall synthesis; clavulanic acid extends coverage to beta-lactamase producing organisms", sideEffects: "Diarrhea (clavulanic acid component), nausea, candidiasis, rash", contra: "Penicillin allergy, previous cholestatic jaundice", pearl: "First-line for acute bacterial rhinosinusitis. Use high-dose formulation (2g amoxicillin component) for resistant organisms. Lower clavulanate ratios reduce GI effects." },
      { name: "Phenylephrine (intranasal)", type: "Topical decongestant", action: "Selective alpha-1 agonist causing vasoconstriction of nasal mucosal blood vessels, decreasing hydrostatic capillary pressure", sideEffects: "Rebound congestion, local irritation, transient BP elevation", contra: "Uncontrolled hypertension, MAO inhibitor use", pearl: "Oral phenylephrine has poor evidence of efficacy. Intranasal form is more effective but still causes systemic absorption. Limit to 3–5 days." },
      { name: "Mometasone furoate (intranasal)", type: "Intranasal corticosteroid", action: "Potent anti-inflammatory reducing mucosal edema, cytokine release, and inflammatory cell infiltration", sideEffects: "Epistaxis, nasal irritation, headache, pharyngitis", contra: "Active untreated nasal infection, recent nasal surgery", pearl: "Benefits both viral and bacterial rhinosinusitis by reducing ostial edema and improving drainage. Safe for prolonged use unlike decongestants." },
      { name: "Doxycycline", type: "Tetracycline antibiotic", action: "Inhibits bacterial protein synthesis by binding to 30S ribosomal subunit", sideEffects: "Photosensitivity, GI upset, esophageal ulceration, teeth discoloration", contra: "Pregnancy, children <8 years, concurrent retinoids", pearl: "Alternative for penicillin-allergic patients. Take with full glass of water, remain upright for 30 minutes to prevent esophageal irritation." }
    ],
    pearls: [
      "Viral-bacterial synergy in sinusitis occurs through sinus ostia obstruction, increased bacterial attachment, and local immune disruption",
      "The double worsening pattern (improvement then deterioration) is the strongest clinical predictor of bacterial sinusitis",
      "Phenylephrine reduces mucosal blood volume through alpha-1 vasoconstriction but does not treat the underlying inflammation or infection",
      "Rhinitis medicamentosa from topical decongestants results from receptor desensitization, rebound vasodilation, and inflammatory cell infiltration",
      "Orbital complications (periorbital cellulitis, orbital abscess) require emergency ENT and ophthalmology consultation"
    ],
    quiz: [
      { question: "Which clinical pattern most strongly suggests bacterial rhinosinusitis requiring antibiotics?", options: ["Nasal congestion for 4 days with clear discharge", "Improvement of symptoms followed by new fever and worsening purulent discharge", "Bilateral nasal congestion during allergy season", "Mild sore throat with rhinorrhea for 3 days"], correct: 1, rationale: "The double worsening pattern—initial improvement followed by clinical deterioration with new fever, increasing purulent discharge, or worsening facial pain—strongly suggests secondary bacterial infection." },
      { question: "A patient with sinusitis develops periorbital edema and restricted extraocular movements. What is the priority nursing action?", options: ["Apply warm compresses to the face", "Administer intranasal decongestant as needed", "Notify the provider immediately for urgent evaluation", "Educate the patient on nasal irrigation"], correct: 2, rationale: "Periorbital edema with restricted eye movement suggests orbital complication of sinusitis (orbital cellulitis or abscess), which is a surgical emergency requiring immediate provider notification." },
      { question: "Why is oral phenylephrine considered less effective than intranasal formulations for nasal decongestion?", options: ["It causes more rebound congestion", "It has poor evidence of clinical efficacy via the oral route", "It is more hepatotoxic orally", "It interacts with more medications orally"], correct: 1, rationale: "Clinical evidence shows that oral phenylephrine does not achieve sufficient nasal mucosal concentration for effective decongestion, unlike the intranasal formulation which acts locally." }
    ]
  },

  "rhinosinusitis-np": {
    title: "Rhinosinusitis",
    cellular: {
      title: "Advanced Pathophysiology & Pharmacotherapy",
      content: "Rhinosinusitis involves complex pathophysiological cascades beginning with viral mucosal invasion that triggers epithelial damage, inflammatory cytokine release, and mucociliary dysfunction. Sinus ostia obstruction creates an anaerobic environment with reduced oxygen tension and pH changes that promote bacterial colonization. Viral-bacterial synergy occurs through multiple mechanisms: direct viral damage to ciliated epithelium, upregulation of bacterial adhesion receptors on nasal epithelial cells, disruption of mucosal immune barriers, and alteration of the sinonasal microbiome. The transition from viral to bacterial sinusitis involves an aerobic phase (S. pneumoniae, H. influenzae, M. catarrhalis) potentially progressing to an anaerobic phase (Peptostreptococcus, Prevotella, Fusobacterium, Bacteroides fragilis, Porphyromonas species). Phenylephrine acts as a selective alpha-1 agonist, producing vasoconstriction of nasal mucosal blood vessels, decreasing hydrostatic capillary pressure, and reducing mucosal blood volume. However, repeated stimulation causes receptor desensitization, compensatory vasodilation, increased vascular permeability, edema, and inflammatory cell infiltration—the pathophysiology of rhinitis medicamentosa. The clinician must differentiate viral from bacterial etiology, identify complications, prescribe evidence-based therapy, and manage antibiotic stewardship."
    },
    riskFactors: [
      "Viral upper respiratory infection (most common precipitant)",
      "Allergic rhinitis with chronic eosinophilic inflammation",
      "Anatomical variants (concha bullosa, Haller cells, deviated septum)",
      "Dental infections affecting maxillary sinus floor",
      "Immunodeficiency (primary or secondary)",
      "Cystic fibrosis with altered mucociliary clearance",
      "Aspirin-exacerbated respiratory disease (Samter's triad)",
      "Biofilm formation in chronic rhinosinusitis"
    ],
    diagnostics: [
      "Apply diagnostic criteria: symptoms >10 days without improvement, severe onset (fever >39°C + purulent discharge ≥3–4 days), or double worsening",
      "Order CT sinuses for complicated, recurrent, or chronic rhinosinusitis (not for uncomplicated acute cases)",
      "Order CBC with differential to evaluate for leukocytosis and left shift",
      "Consider endoscopic culture for treatment failures or immunocompromised patients",
      "Order orbital CT with contrast if orbital complications suspected",
      "Evaluate for complications: periorbital/orbital cellulitis, subperiosteal abscess, intracranial extension",
      "Differentiate from allergic rhinitis, migraine, dental pathology, and cluster headache"
    ],
    management: [
      "Prescribe supportive care as first-line for viral rhinosinusitis: saline irrigation, intranasal corticosteroids, analgesics",
      "Prescribe amoxicillin-clavulanate as first-line antibiotic for acute bacterial rhinosinusitis; amoxicillin alone if no risk for resistance",
      "Prescribe doxycycline or respiratory fluoroquinolone for penicillin-allergic patients",
      "Escalate to high-dose amoxicillin-clavulanate or second-line agents for treatment failure at 72 hours",
      "Prescribe short-course oral corticosteroids for severe mucosal edema as adjunct therapy",
      "Order urgent imaging and specialist referral for orbital or intracranial complications",
      "Manage chronic rhinosinusitis with prolonged intranasal corticosteroids, consider allergy testing and immunotherapy referral",
      "Apply antibiotic stewardship principles: avoid antibiotics for uncomplicated viral sinusitis"
    ],
    nursingActions: [
      "Perform comprehensive differential diagnosis: distinguish viral sinusitis, bacterial sinusitis, allergic rhinitis, migraine, dental pathology",
      "Prescribe and manage step-wise pharmacotherapy based on severity and clinical criteria",
      "Evaluate antibiotic treatment response at 48–72 hours and modify therapy as needed",
      "Order and interpret imaging for complicated or recurrent cases",
      "Coordinate ENT referral for chronic, recurrent, or complicated rhinosinusitis",
      "Screen for underlying conditions: immunodeficiency, cystic fibrosis, Samter's triad",
      "Educate on evidence-based self-care and when to seek re-evaluation",
      "Implement antibiotic stewardship by deferring antibiotics when viral etiology is likely"
    ],
    signs: {
      left: [
        "Mucopurulent nasal discharge",
        "Facial pain/pressure (frontal, maxillary, or ethmoid)",
        "Nasal obstruction and congestion",
        "Postnasal drip with productive cough",
        "Hyposmia or anosmia",
        "Halitosis",
        "Maxillary dental pain"
      ],
      right: [
        "Orbital cellulitis (erythema, edema, proptosis)",
        "Subperiosteal abscess (eye displacement)",
        "Cavernous sinus thrombosis (bilateral cranial nerve palsies)",
        "Frontal bone osteomyelitis (Pott puffy tumor)",
        "Epidural or subdural abscess",
        "Meningitis",
        "Severe systemic toxicity"
      ]
    },
    medications: [
      { name: "Amoxicillin-Clavulanate (high-dose)", type: "Beta-lactam antibiotic", action: "Amoxicillin inhibits transpeptidase, preventing peptidoglycan cross-linking in bacterial cell walls; clavulanic acid irreversibly inhibits serine beta-lactamases", sideEffects: "Diarrhea (clavulanic acid), hepatotoxicity (cholestatic), candidiasis, C. difficile", contra: "Penicillin allergy, previous cholestatic jaundice from amox-clav", pearl: "High-dose (2g amoxicillin BID) recommended when resistance risk is present (recent antibiotics, daycare exposure, endemic area). 7:1 amoxicillin-to-clavulanate ratio reduces GI effects." },
      { name: "Levofloxacin", type: "Respiratory fluoroquinolone", action: "Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication and transcription", sideEffects: "Tendon rupture, QT prolongation, peripheral neuropathy, C. difficile, aortic dissection risk", contra: "Myasthenia gravis, concurrent QT-prolonging drugs, tendon disorder history", pearl: "Reserve for true beta-lactam allergy or treatment failure. FDA black box warning for tendinopathy. Not first-line due to risk of resistance and serious adverse effects." },
      { name: "Budesonide (intranasal)", type: "Intranasal corticosteroid", action: "Potent glucocorticoid reducing mucosal inflammation, edema, and inflammatory mediator release", sideEffects: "Epistaxis, nasal septal irritation, pharyngitis, candidiasis", contra: "Active nasal tuberculosis, untreated fungal infection", pearl: "Effective as monotherapy for mild bacterial sinusitis and as adjunct to antibiotics. Can be used as nasal rinse (budesonide respules in saline) for chronic rhinosinusitis." },
      { name: "Prednisone (short course)", type: "Systemic corticosteroid", action: "Suppresses inflammatory cascade, reduces mucosal edema and sinus ostia obstruction", sideEffects: "Hyperglycemia, insomnia, GI upset, mood changes, adrenal suppression", contra: "Active infection without antibiotic coverage, uncontrolled diabetes, psychosis", pearl: "Short 5-day burst may improve symptoms in severe cases. Always combine with antibiotics if bacterial infection present. Not for routine use." }
    ],
    pearls: [
      "Antibiotic stewardship: most rhinosinusitis is viral and does not benefit from antibiotics; prescribing antibiotics for viral sinusitis drives resistance without clinical benefit",
      "Three diagnostic criteria for bacterial sinusitis: persistent symptoms >10 days, severe onset (fever >39°C + purulent discharge ≥3 days), or double worsening pattern",
      "Complicated sinusitis (orbital, intracranial) requires urgent CT imaging, IV antibiotics, and specialist consultation",
      "Rhinitis medicamentosa from topical decongestants develops through alpha-1 receptor desensitization, rebound vasodilation, and mucosal inflammatory changes",
      "Chronic rhinosinusitis (>12 weeks) should prompt evaluation for nasal polyps, allergic fungal sinusitis, immunodeficiency, and cystic fibrosis"
    ],
    quiz: [
      { question: "An NP evaluates a patient with 14 days of nasal congestion, purulent discharge, and facial pressure without improvement. What is the most appropriate initial antibiotic?", options: ["Azithromycin", "Amoxicillin-clavulanate", "Ciprofloxacin", "Clindamycin"], correct: 1, rationale: "Amoxicillin-clavulanate is the first-line antibiotic for acute bacterial rhinosinusitis, providing coverage against S. pneumoniae, H. influenzae (including beta-lactamase producers), and M. catarrhalis." },
      { question: "Which complication of sinusitis presents with proptosis, restricted extraocular movements, and pain with eye movement?", options: ["Periorbital cellulitis", "Orbital cellulitis or subperiosteal abscess", "Cavernous sinus thrombosis", "Optic neuritis"], correct: 1, rationale: "Orbital cellulitis and subperiosteal abscess present with proptosis, restricted eye movements, and orbital pain. This requires urgent CT imaging and surgical consultation." },
      { question: "A patient with acute bacterial sinusitis shows no improvement after 72 hours of amoxicillin. What should the clinician do?", options: ["Continue the same antibiotic for another 7 days", "Switch to high-dose amoxicillin-clavulanate or respiratory fluoroquinolone", "Discontinue antibiotics and observe", "Order sinus surgery"], correct: 1, rationale: "Treatment failure at 72 hours warrants escalation to high-dose amoxicillin-clavulanate or a respiratory fluoroquinolone, and reassessment for complications." }
    ]
  },

  "pharyngitis-management-rpn": {
    title: "Pharyngitis & Strep Throat",
    cellular: {
      title: "Pathophysiology of Pharyngitis",
      content: "Pharyngitis is inflammation of the pharynx caused by viral, bacterial, or fungal pathogens. Viral pharyngitis (rhinovirus, coronavirus, influenza, Epstein-Barr virus) accounts for the majority of cases. Group A Streptococcus pyogenes (GAS) is the most important bacterial cause, being a gram-positive, beta-hemolytic organism with virulence factors including M protein, streptolysins, and hyaluronidase. Transmission occurs through respiratory droplets, direct contact, and fomites with a 2–5 day incubation period. Untreated streptococcal pharyngitis can lead to serious complications including rheumatic fever and post-streptococcal glomerulonephritis. The nurse monitors symptoms, administers medications as ordered, and reports signs of complications."
    },
    riskFactors: [
      "Close contact with infected individuals",
      "School-age children and adolescents",
      "Crowded living conditions",
      "Winter and early spring season",
      "Immunosuppression",
      "Smoking or exposure to irritants",
      "Recent viral upper respiratory infection",
      "Daycare or school attendance"
    ],
    diagnostics: [
      "Monitor temperature and report persistent or high fever",
      "Observe and document throat appearance as directed",
      "Report difficulty swallowing or inability to tolerate oral fluids",
      "Monitor for signs of dehydration from decreased oral intake",
      "Report development of rash (possible scarlet fever)"
    ],
    management: [
      "Administer prescribed antibiotics (penicillin V, amoxicillin) as ordered and on schedule",
      "Administer analgesics and antipyretics as ordered (acetaminophen, ibuprofen)",
      "Encourage warm salt water gargles for comfort",
      "Encourage adequate fluid intake and soft diet",
      "Administer throat lozenges or anesthetic sprays as ordered",
      "Implement droplet precautions until 24 hours after antibiotic initiation"
    ],
    nursingActions: [
      "Assess and document sore throat severity and character of onset (sudden vs. gradual)",
      "Monitor vital signs with attention to temperature and hydration status",
      "Report tonsillar exudates, palatal petechiae, or tender anterior cervical lymphadenopathy",
      "Reinforce importance of completing full antibiotic course to prevent complications",
      "Educate on infection control: hand hygiene, not sharing utensils, covering coughs",
      "Report signs of complications: joint pain, rash, dark urine, difficulty breathing"
    ],
    signs: {
      left: [
        "Sudden onset sore throat",
        "Painful swallowing (odynophagia)",
        "Fever and headache",
        "Malaise and fatigue",
        "Tender, enlarged anterior cervical lymph nodes",
        "Absence of cough (suggests bacterial)"
      ],
      right: [
        "Tonsillar exudates (white patches)",
        "Palatal petechiae",
        "Scarlatiniform rash (scarlet fever)",
        "Peritonsillar abscess (muffled voice, trismus)",
        "Strawberry tongue",
        "Joint pain (rheumatic fever)"
      ]
    },
    medications: [
      { name: "Penicillin V", type: "Beta-lactam antibiotic", action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins", sideEffects: "GI upset, rash, allergic reactions, anaphylaxis", contra: "Penicillin allergy", pearl: "First-line treatment for GAS pharyngitis. Must complete full 10-day course to prevent rheumatic fever. Administer as ordered." },
      { name: "Amoxicillin", type: "Aminopenicillin", action: "Inhibits bacterial cell wall synthesis with broader gram-negative coverage than penicillin V", sideEffects: "Diarrhea, rash (especially with EBV infection), nausea", contra: "Penicillin allergy", pearl: "Often preferred in children due to better taste. Avoid if mononucleosis is suspected as it causes a characteristic maculopapular rash." },
      { name: "Acetaminophen", type: "Analgesic/Antipyretic", action: "Centrally acting prostaglandin synthesis inhibitor reducing pain and fever", sideEffects: "Hepatotoxicity at high doses", contra: "Severe liver disease", pearl: "Alternate with ibuprofen for fever and pain management. Maximum 4g/day in adults." },
      { name: "Ibuprofen", type: "NSAID", action: "Inhibits COX-1 and COX-2, reducing prostaglandin-mediated inflammation, pain, and fever", sideEffects: "GI irritation, renal impairment, increased bleeding risk", contra: "Active GI bleed, severe renal impairment, third trimester pregnancy", pearl: "More effective than acetaminophen for throat pain due to anti-inflammatory properties. Take with food." }
    ],
    pearls: [
      "The absence of cough is an important clinical clue favoring bacterial (streptococcal) pharyngitis over viral",
      "Complete the full 10-day antibiotic course even if symptoms improve to prevent rheumatic fever",
      "Avoid amoxicillin if mononucleosis is suspected—it causes a distinctive rash with EBV infection",
      "Patients are considered non-contagious 24 hours after starting appropriate antibiotic therapy",
      "Report joint pain, rash, or dark urine as these may indicate post-streptococcal complications"
    ],
    quiz: [
      { question: "A patient with strep throat asks why they need to take antibiotics for 10 days when they feel better after 3 days. What is the best RPN response?", options: ["You can stop when you feel better", "The full course prevents complications like rheumatic fever", "Longer courses treat the sore throat faster", "It prevents the virus from returning"], correct: 1, rationale: "Completing the full antibiotic course for GAS pharyngitis is essential to eradicate the organism and prevent serious non-suppurative complications, particularly rheumatic fever." },
      { question: "Which combination of findings most strongly suggests streptococcal pharyngitis?", options: ["Cough, rhinorrhea, and mild sore throat", "Tonsillar exudates, fever, tender cervical nodes, and absence of cough", "Bilateral conjunctivitis with sore throat", "Hoarseness with productive cough"], correct: 1, rationale: "The Centor criteria (tonsillar exudates, fever, tender anterior cervical lymphadenopathy, absence of cough) help identify streptococcal pharyngitis." },
      { question: "Which sign should the nurse report immediately as a possible complication of pharyngitis?", options: ["Mild sore throat persisting for 2 days", "New joint pain and swelling", "Appetite decreased for one meal", "Preference for cold fluids"], correct: 1, rationale: "New joint pain after streptococcal pharyngitis may indicate rheumatic fever, a serious immune-mediated complication requiring immediate medical evaluation." }
    ]
  },

  "pharyngitis-management-rn": {
    title: "Pharyngitis & Strep Throat",
    cellular: {
      title: "Pathophysiology of Streptococcal Pharyngitis",
      content: "Group A Streptococcus pyogenes is a gram-positive, beta-hemolytic coccus whose virulence depends on the M protein (prevents phagocytosis and mediates tissue adherence), streptolysins O and S (lyse erythrocytes and leukocytes), hyaluronidase (facilitates tissue invasion), and streptokinase (dissolves fibrin clots aiding spread). The immune response to streptococcal antigens can trigger molecular mimicry, where antibodies cross-react with cardiac tissue (rheumatic fever) or glomerular basement membrane (post-streptococcal glomerulonephritis). Rheumatic fever occurs 2–4 weeks after untreated pharyngitis and can cause pancarditis, migratory polyarthritis, chorea, erythema marginatum, and subcutaneous nodules. Post-streptococcal glomerulonephritis presents 1–3 weeks after infection with hematuria, proteinuria, edema, and hypertension. The nurse performs comprehensive assessment using Centor criteria, implements treatment protocols, monitors for complications, and coordinates care."
    },
    riskFactors: [
      "School-age children (peak incidence 5–15 years)",
      "Close contact with GAS-positive individual",
      "Crowded environments (military barracks, dormitories)",
      "Winter and early spring season",
      "Previous rheumatic fever (high recurrence risk)",
      "History of post-streptococcal glomerulonephritis",
      "Immunosuppression",
      "Chronic tonsillitis with recurrent infections"
    ],
    diagnostics: [
      "Apply Centor criteria: tonsillar exudates, tender anterior cervical lymphadenopathy, fever, absence of cough",
      "Evaluate rapid antigen detection test (RADT) results and understand sensitivity limitations",
      "Interpret throat culture results (gold standard for GAS confirmation)",
      "Assess for signs of suppurative complications: peritonsillar abscess (muffled voice, trismus, uvular deviation)",
      "Monitor for non-suppurative complications: joint inflammation, cardiac murmur, hematuria, edema",
      "Differentiate from viral pharyngitis (cough, rhinorrhea, conjunctivitis present in viral)",
      "Assess for signs of dehydration from dysphagia and decreased oral intake"
    ],
    management: [
      "Initiate antibiotic therapy per protocol: penicillin V or amoxicillin for 10 days",
      "Administer cephalosporins (cefuroxime) or macrolides (azithromycin) for penicillin-allergic patients",
      "Implement multimodal pain management: scheduled analgesics, warm saline gargles, cool fluids",
      "Administer IV fluids if unable to maintain oral hydration",
      "Coordinate urgent evaluation for peritonsillar abscess (needle aspiration or I&D may be needed)",
      "Implement isolation precautions until 24 hours on effective antibiotic therapy",
      "Screen household contacts for symptoms and recommend evaluation"
    ],
    nursingActions: [
      "Perform comprehensive oropharyngeal assessment: tonsillar size, exudates, palatal petechiae, uvular position",
      "Assess and score using Centor criteria to guide testing and treatment decisions",
      "Monitor airway patency, especially with severe tonsillar hypertrophy or peritonsillar abscess",
      "Evaluate hydration status: mucous membranes, urine output, skin turgor",
      "Assess for complications 2–4 weeks post-infection: new murmur, joint swelling, periorbital edema, hematuria",
      "Educate patient and family on medication compliance, return precautions, and complication signs",
      "Implement droplet precautions and coordinate infection prevention measures",
      "Provide nutritional guidance: soft, cool foods; avoid acidic or spicy foods that exacerbate pain"
    ],
    signs: {
      left: [
        "Sudden onset severe sore throat",
        "Tonsillar erythema with white-yellow exudates",
        "Palatal petechiae",
        "Tender, enlarged anterior cervical nodes",
        "Fever >38.3°C",
        "Headache and abdominal pain (children)",
        "Strawberry tongue"
      ],
      right: [
        "Peritonsillar abscess (trismus, muffled voice, uvular deviation)",
        "Retropharyngeal abscess (neck stiffness, drooling)",
        "Rheumatic fever (migratory polyarthritis, carditis, chorea)",
        "Post-streptococcal glomerulonephritis (hematuria, edema, HTN)",
        "Scarlet fever (sandpaper rash, Pastia lines)",
        "Streptococcal toxic shock syndrome",
        "Lemierre syndrome (septic thrombophlebitis of internal jugular)"
      ]
    },
    medications: [
      { name: "Penicillin V", type: "Natural penicillin", action: "Inhibits transpeptidase enzyme preventing peptidoglycan cross-linking in bacterial cell wall synthesis", sideEffects: "GI upset, rash, allergic reactions, anaphylaxis", contra: "Documented penicillin allergy", pearl: "Gold standard for GAS pharyngitis. 10-day course is essential for rheumatic fever prevention. Narrow spectrum preserves normal flora." },
      { name: "Amoxicillin", type: "Aminopenicillin", action: "Broader spectrum beta-lactam inhibiting cell wall synthesis", sideEffects: "Diarrhea, rash (80–100% with EBV), nausea, candidiasis", contra: "Penicillin allergy, suspected mononucleosis", pearl: "Preferred in children due to palatability. Contraindicated if EBV mononucleosis is in the differential—causes characteristic diffuse maculopapular rash." },
      { name: "Azithromycin", type: "Macrolide antibiotic", action: "Binds 50S ribosomal subunit inhibiting bacterial protein synthesis", sideEffects: "GI upset, QT prolongation, hepatotoxicity", contra: "History of cholestatic jaundice from azithromycin, QT prolongation", pearl: "Second-line for penicillin-allergic patients. Increasing macrolide resistance in GAS limits reliability. 5-day Z-pack dosing." },
      { name: "Cephalexin", type: "First-generation cephalosporin", action: "Inhibits cell wall synthesis; cross-reactivity with penicillin is approximately 1–2%", sideEffects: "GI upset, rash, rare cross-allergy with penicillin", contra: "Severe penicillin allergy (anaphylaxis)", pearl: "Alternative for mild penicillin allergy. Cross-reactivity with penicillin is lower than historically believed (~1–2%). Avoid in anaphylactic penicillin allergy." }
    ],
    pearls: [
      "Centor criteria: each criterion present (exudates, lymphadenopathy, fever, no cough) increases the probability of GAS pharyngitis",
      "Negative RADT with high clinical suspicion should be confirmed with throat culture (RADT sensitivity is 70–90%)",
      "Rheumatic fever is preventable if antibiotics are started within 9 days of symptom onset",
      "Amoxicillin with EBV mononucleosis causes a diffuse maculopapular rash in 80–100% of cases—always consider mono in the differential",
      "Peritonsillar abscess presents with trismus, muffled 'hot potato' voice, and uvular deviation toward the unaffected side"
    ],
    quiz: [
      { question: "A patient scores 4/4 on Centor criteria with a negative rapid strep test. What should the nurse anticipate?", options: ["No further testing needed; treat symptomatically", "Throat culture to confirm given high clinical suspicion", "Start antiviral therapy", "Discharge with no follow-up"], correct: 1, rationale: "RADT sensitivity is 70–90%, so a negative RADT with high clinical suspicion (4/4 Centor criteria) warrants confirmatory throat culture before ruling out GAS." },
      { question: "Which complication of streptococcal pharyngitis presents 2–4 weeks after infection with migratory polyarthritis and new cardiac murmur?", options: ["Peritonsillar abscess", "Post-streptococcal glomerulonephritis", "Rheumatic fever", "Scarlet fever"], correct: 2, rationale: "Rheumatic fever occurs 2–4 weeks post-GAS pharyngitis through molecular mimicry, causing pancarditis, migratory polyarthritis, chorea, and characteristic skin manifestations." },
      { question: "Why should amoxicillin be avoided if mononucleosis is suspected?", options: ["It is ineffective against EBV", "It causes a distinctive diffuse rash in 80–100% of EBV cases", "It worsens splenic enlargement", "It causes hepatotoxicity with EBV"], correct: 1, rationale: "Amoxicillin (and ampicillin) cause a characteristic diffuse maculopapular rash in 80–100% of patients with active EBV mononucleosis, which can be confused with drug allergy." }
    ]
  },

  "pharyngitis-management-np": {
    title: "Pharyngitis & Strep Throat",
    cellular: {
      title: "Microbiology & Immune-Mediated Complications",
      content: "Group A Streptococcus pyogenes pathogenesis involves multiple virulence mechanisms: M protein provides antiphagocytic properties and mediates molecular mimicry with cardiac myosin and sarcolemmal proteins; streptolysins O and S cause tissue destruction and hemolysis; hyaluronidase breaks down connective tissue facilitating bacterial spread; streptokinase converts plasminogen to plasmin dissolving fibrin barriers. Post-infectious immune complications arise from molecular mimicry: anti-streptococcal antibodies cross-react with cardiac tissue (myosin, laminin, valvular glycoproteins) causing rheumatic carditis, with synovial tissue causing migratory polyarthritis, and with basal ganglia neurons causing Sydenham chorea. Post-streptococcal glomerulonephritis involves immune complex deposition in glomerular basement membrane causing complement activation, neutrophil infiltration, and inflammatory glomerular damage presenting with hematuria, proteinuria, edema, and hypertension. The clinician must apply clinical decision rules, order appropriate diagnostics, prescribe targeted therapy, manage complications, and determine referral needs."
    },
    riskFactors: [
      "Age 5–15 years (peak GAS incidence)",
      "History of rheumatic fever (requires secondary prophylaxis)",
      "Close contacts with confirmed GAS infection",
      "Immunocompromise",
      "Chronic tonsillar hypertrophy with recurrent infections",
      "Lower socioeconomic status and crowded living conditions",
      "Aboriginal and Torres Strait Islander populations (higher rheumatic fever risk)",
      "Absence of prior tonsillectomy"
    ],
    diagnostics: [
      "Apply modified Centor/McIsaac score to stratify testing and treatment decisions",
      "Order rapid antigen detection test (RADT) for initial screening; confirm negative results with throat culture in children/adolescents",
      "Order anti-streptolysin O (ASO) and anti-DNase B titers when evaluating for post-streptococcal complications",
      "Order echocardiogram if new murmur detected or rheumatic fever suspected",
      "Order urinalysis and renal function if post-streptococcal glomerulonephritis suspected",
      "Order CT neck with contrast for suspected deep neck space infection (peritonsillar, retropharyngeal abscess)",
      "Order monospot or EBV panel to differentiate mononucleosis from streptococcal pharyngitis"
    ],
    management: [
      "Prescribe penicillin V (250mg BID–TID or 500mg BID × 10 days) or amoxicillin (50mg/kg/day × 10 days) as first-line for GAS pharyngitis",
      "Prescribe IM benzathine penicillin G if adherence concerns exist (single dose)",
      "Prescribe cephalosporins (cefuroxime, cephalexin) for mild penicillin allergy or macrolides (azithromycin) for severe allergy",
      "Prescribe secondary prophylaxis for rheumatic fever: monthly IM benzathine penicillin G for 5–10 years or until age 40",
      "Refer for tonsillectomy evaluation if ≥7 episodes in 1 year, ≥5/year for 2 years, or ≥3/year for 3 years (Paradise criteria)",
      "Manage peritonsillar abscess with needle aspiration or incision and drainage, IV antibiotics, and ENT referral",
      "Prescribe corticosteroids (single-dose dexamethasone) for severe odynophagia as adjunct to antibiotics",
      "Manage post-streptococcal glomerulonephritis supportively: sodium/fluid restriction, antihypertensives, diuretics as needed"
    ],
    nursingActions: [
      "Perform risk-stratified diagnostic approach using modified Centor/McIsaac scoring system",
      "Prescribe appropriate antibiotic therapy based on allergy history and clinical presentation",
      "Evaluate for and manage suppurative complications: peritonsillar abscess, retropharyngeal abscess, Lemierre syndrome",
      "Screen for post-streptococcal complications at 2–4 week follow-up visits",
      "Determine need for tonsillectomy referral based on recurrence criteria",
      "Prescribe and manage secondary prophylaxis for patients with history of rheumatic fever",
      "Differentiate bacterial pharyngitis from EBV mononucleosis, gonococcal pharyngitis, and other etiologies",
      "Implement antibiotic stewardship: avoid unnecessary antibiotic prescribing for viral pharyngitis"
    ],
    signs: {
      left: [
        "Exudative tonsillopharyngitis",
        "Palatal petechiae and strawberry tongue",
        "Tender anterior cervical lymphadenopathy",
        "High fever with sudden onset sore throat",
        "Absence of cough, rhinorrhea, or conjunctivitis",
        "Headache and abdominal pain (pediatric)",
        "Scarlatiniform rash (sandpaper texture)"
      ],
      right: [
        "Peritonsillar abscess (fluctuant mass, uvular deviation, trismus)",
        "Retropharyngeal abscess (neck stiffness, dysphagia, airway compromise)",
        "Rheumatic carditis (new murmur, pericardial rub, cardiomegaly)",
        "Sydenham chorea (involuntary movements, emotional lability)",
        "Post-streptococcal glomerulonephritis (cola-colored urine, facial edema)",
        "Lemierre syndrome (spiking fevers, neck pain, septic emboli)",
        "PANDAS (sudden OCD/tics in children post-strep)"
      ]
    },
    medications: [
      { name: "Benzathine Penicillin G", type: "Long-acting penicillin", action: "Provides sustained bactericidal penicillin levels through slow IM absorption over 2–4 weeks", sideEffects: "Injection site pain, allergic reactions, anaphylaxis, Hoigné syndrome", contra: "Penicillin allergy, IV administration (causes cardiopulmonary arrest)", pearl: "Single IM dose ensures compliance. Used for treatment (1.2 million units IM × 1) and secondary rheumatic fever prophylaxis (1.2 million units IM monthly). NEVER give IV." },
      { name: "Dexamethasone (single dose)", type: "Corticosteroid", action: "Potent anti-inflammatory reducing pharyngeal edema and pain through cytokine suppression", sideEffects: "Transient hyperglycemia, insomnia, mood changes", contra: "Active untreated peritonsillar abscess, immunosuppression without antibiotic coverage", pearl: "Single dose (0.6mg/kg, max 10mg) as adjunct to antibiotics reduces pain duration by 6–12 hours and hastens return to normal activity. Not a substitute for antibiotics." },
      { name: "Clindamycin", type: "Lincosamide antibiotic", action: "Binds 50S ribosomal subunit inhibiting bacterial protein synthesis; excellent tissue penetration", sideEffects: "C. difficile colitis, rash, hepatotoxicity", contra: "History of C. difficile, inflammatory bowel disease", pearl: "Reserved for severe penicillin allergy when macrolide resistance is suspected. Excellent for deep-space infections (peritonsillar, retropharyngeal abscess)." },
      { name: "Amoxicillin (high-dose)", type: "Aminopenicillin", action: "Time-dependent bactericidal activity through cell wall synthesis inhibition", sideEffects: "Diarrhea, rash (EBV cross-reactivity), candidiasis", contra: "Penicillin allergy, suspected EBV mononucleosis", pearl: "Preferred in children (better taste than penicillin V). High-dose 50mg/kg/day (max 1000mg) once daily for 10 days is equally effective and improves compliance." }
    ],
    pearls: [
      "Modified Centor/McIsaac score: age modifier + 4 criteria guides testing/treatment approach—score ≥4 may warrant empiric treatment",
      "Benzathine penicillin G IM is the only single-dose regimen ensuring complete GAS eradication and rheumatic fever prevention",
      "Rheumatic fever prevention requires starting antibiotics within 9 days of symptom onset—this is the primary goal of GAS treatment",
      "PANDAS (Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal infections) should be considered in children with sudden onset OCD or tics following strep infection",
      "Lemierre syndrome (septic thrombophlebitis of the internal jugular vein) is a rare but life-threatening complication presenting with spiking fevers, neck pain, and septic pulmonary emboli"
    ],
    quiz: [
      { question: "Which route of penicillin administration ensures complete adherence for GAS pharyngitis treatment?", options: ["Oral penicillin V for 5 days", "Intramuscular benzathine penicillin G single dose", "Intravenous penicillin G for 3 days", "Topical penicillin gargle"], correct: 1, rationale: "Benzathine penicillin G IM provides sustained bactericidal levels for 2–4 weeks from a single injection, ensuring complete treatment adherence. It is the only single-dose option." },
      { question: "An NP evaluates a 7-year-old with sudden onset OCD symptoms and motor tics 2 weeks after confirmed strep throat. What diagnosis should be considered?", options: ["Tourette syndrome", "PANDAS", "Sydenham chorea", "Autism spectrum disorder"], correct: 1, rationale: "PANDAS (Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal infections) presents with sudden onset OCD, tics, and behavioral changes temporally related to GAS infection." },
      { question: "What are the Paradise criteria for tonsillectomy referral?", options: ["Any recurrence of strep throat", "≥7 episodes in 1 year, ≥5/year for 2 years, or ≥3/year for 3 years", "Failed one course of antibiotics", "Tonsillar hypertrophy without infection"], correct: 1, rationale: "The Paradise criteria define recurrent tonsillitis warranting tonsillectomy: ≥7 documented episodes in 1 year, ≥5 per year for 2 consecutive years, or ≥3 per year for 3 consecutive years." }
    ]
  },

  "otitis-externa-rpn": {
    title: "Otitis Externa",
    cellular: {
      title: "Pathophysiology of Otitis Externa",
      content: "Otitis externa (OE) is inflammation or infection of the external auditory canal (EAC), auricle, or both. Cerumen normally maintains a mildly acidic, protective microenvironment that inhibits microbial colonization through lipids produced by ceruminous glands. Disruption of this protective barrier through water exposure (swimmer's ear), mechanical trauma, or pH alteration creates conditions for bacterial colonization. Common pathogens include Staphylococcus aureus and Pseudomonas aeruginosa, with occasional fungal involvement (Candida, Aspergillus). Predisposing conditions include atopic dermatitis, psoriasis, lupus, and acne affecting the ear canal. The nurse monitors symptoms, administers topical medications as ordered, and reports changes suggesting complications."
    },
    riskFactors: [
      "Prolonged water exposure (swimming, bathing)",
      "Use of cotton swabs or ear instrumentation",
      "Hearing aid or earbud use",
      "Eczema, psoriasis, or atopic dermatitis of the ear",
      "Narrow or hairy ear canals",
      "Humid climate",
      "Immunosuppression (diabetes, HIV)",
      "Previous otitis externa episodes"
    ],
    diagnostics: [
      "Report pain severity, especially with tragal pressure or auricle manipulation",
      "Document drainage character: clear, purulent, or malodorous",
      "Monitor temperature and report fever",
      "Report decreased hearing on the affected side",
      "Monitor for spreading cellulitis around the ear"
    ],
    management: [
      "Administer prescribed otic drops as ordered (antibiotic, steroid, or combination)",
      "Keep ear canal dry as directed; use ear plugs during bathing",
      "Administer oral analgesics as ordered for pain management",
      "Assist with wick placement if ordered for severely swollen canals",
      "Avoid inserting any objects into the ear canal",
      "Reinforce return precautions and follow-up instructions"
    ],
    nursingActions: [
      "Assess pain on tragal pressure and auricle manipulation and document findings",
      "Administer otic drops using proper technique: tilt head, pull pinna up and back (adults)",
      "Monitor for signs of necrotizing otitis externa: severe pain, granulation tissue, cranial nerve involvement",
      "Educate patient on ear canal drying techniques after water exposure",
      "Report facial weakness or other cranial nerve symptoms immediately",
      "Reinforce completing full course of topical antibiotic therapy"
    ],
    signs: {
      left: [
        "Ear pain (otalgia) worsened by tragal pressure",
        "Pain on pinna manipulation",
        "Ear canal edema and erythema",
        "Clear to purulent otorrhea",
        "Itching in the ear canal",
        "Conductive hearing loss (canal occlusion)"
      ],
      right: [
        "Periauricular cellulitis (spreading infection)",
        "Granulation tissue in canal floor (necrotizing OE)",
        "Facial nerve palsy (CN VII involvement)",
        "Severe deep pain disproportionate to exam findings",
        "Temporal bone osteomyelitis",
        "Trismus (if infection spreads to TMJ area)"
      ]
    },
    medications: [
      { name: "Ciprofloxacin/Dexamethasone otic", type: "Combination antibiotic/steroid otic drops", action: "Ciprofloxacin inhibits bacterial DNA gyrase; dexamethasone reduces inflammation and edema", sideEffects: "Local irritation, pruritus, fungal superinfection", contra: "Viral ear infections, tympanic membrane perforation (some formulations)", pearl: "Combination drops treat infection and reduce swelling simultaneously. Pull pinna up and back for adults; down and back for children under 3." },
      { name: "Acetic acid 2%/Hydrocortisone 1%", type: "Acidifying/anti-inflammatory otic solution", action: "Acetic acid restores acidic pH inhibiting bacterial and fungal growth; hydrocortisone reduces inflammation", sideEffects: "Stinging on application, local irritation", contra: "Perforated tympanic membrane", pearl: "Restores the natural acidic environment of the ear canal. Can also be used prophylactically after swimming." },
      { name: "Ofloxacin otic", type: "Fluoroquinolone otic drops", action: "Inhibits bacterial DNA gyrase and topoisomerase IV", sideEffects: "Ear discomfort, pruritus, dizziness", contra: "Known quinolone hypersensitivity", pearl: "Safe for use with tympanic membrane perforation, unlike aminoglycoside-containing drops which carry ototoxicity risk." },
      { name: "Polymyxin B/Neomycin/Hydrocortisone", type: "Combination otic drops", action: "Polymyxin B disrupts gram-negative cell membranes; neomycin inhibits protein synthesis; hydrocortisone reduces inflammation", sideEffects: "Contact dermatitis, ototoxicity (if perforated TM), allergic sensitization", contra: "Tympanic membrane perforation (neomycin ototoxicity), known aminoglycoside allergy", pearl: "Do not use if tympanic membrane perforation is present or suspected—neomycin is ototoxic. Verify TM integrity before administering." }
    ],
    pearls: [
      "Tragal pressure pain and pain on pinna manipulation are the hallmark findings distinguishing otitis externa from otitis media",
      "Never use aminoglycoside-containing ear drops (neomycin, gentamicin) when tympanic membrane perforation is present or suspected",
      "Ear canal wicks are placed when edema is too severe for drops to penetrate; drops are applied onto the wick",
      "Prevention includes keeping ears dry, using ear plugs while swimming, and avoiding cotton swab insertion",
      "Report facial nerve weakness immediately—it may indicate necrotizing (malignant) otitis externa, a serious complication in diabetic or immunocompromised patients"
    ],
    quiz: [
      { question: "Which assessment finding is most characteristic of otitis externa?", options: ["Pain on tragal pressure and pinna manipulation", "Bulging tympanic membrane with effusion", "Rinne test showing bone conduction greater than air conduction", "Bilateral hearing loss"], correct: 0, rationale: "Pain on tragal pressure and pinna manipulation is the classic hallmark of otitis externa, distinguishing it from otitis media where these maneuvers are typically painless." },
      { question: "Why should neomycin-containing otic drops be avoided when tympanic membrane perforation is present?", options: ["They cause allergic rhinitis", "They are ototoxic and can cause sensorineural hearing loss", "They are less effective in middle ear infections", "They cause increased drainage"], correct: 1, rationale: "Neomycin is an aminoglycoside that is ototoxic. If it enters the middle ear through a perforated tympanic membrane, it can damage cochlear hair cells causing sensorineural hearing loss." },
      { question: "Which finding should the nurse report immediately in a diabetic patient with otitis externa?", options: ["Mild ear canal itching", "Facial weakness on the affected side", "Slight reduction in hearing", "Need for pain medication"], correct: 1, rationale: "Facial nerve palsy in a diabetic patient with otitis externa may indicate necrotizing (malignant) otitis externa—a life-threatening condition requiring immediate medical intervention." }
    ]
  },

  "otitis-externa-rn": {
    title: "Otitis Externa",
    cellular: {
      title: "Pathophysiology of External Ear Infections",
      content: "Otitis externa pathophysiology centers on disruption of the ear canal's natural defense mechanisms. Cerumen provides a hydrophobic, acidic (pH 6.1) barrier containing lysozymes and antimicrobial peptides that inhibit microbial colonization. The ceruminous glands produce lipids that maintain skin moisture and barrier function, while normal epithelial migration moves debris laterally. Water exposure disrupts the cerumen barrier, raises canal pH toward neutral, and creates a warm, moist environment ideal for bacterial proliferation. Pseudomonas aeruginosa thrives in this alkaline, moist environment and is the predominant pathogen in swimmer's ear. In diffuse OE, bacterial invasion of the canal skin triggers inflammatory edema, narrowing the canal and trapping debris. Classification includes diffuse OE (swimmer's ear), acute localized OE (furuncle), necrotizing OE (extends to temporal bone), and otomycosis (fungal—Candida, Aspergillus). Necrotizing OE is a life-threatening condition primarily affecting diabetic and immunocompromised patients where infection invades the temporal bone, skull base, and potentially the intracranial cavity. The nurse performs comprehensive assessment, differentiates OE from other otic conditions, manages topical therapy protocols, and identifies patients at risk for necrotizing disease."
    },
    riskFactors: [
      "Swimming and water sports (swimmer's ear)",
      "Cotton swab use and ear instrumentation",
      "Hearing aids and earbuds (moisture trapping, trauma)",
      "Dermatologic conditions (eczema, psoriasis, seborrheic dermatitis)",
      "Diabetes mellitus (necrotizing OE risk)",
      "Immunosuppression (HIV, chemotherapy, chronic steroids)",
      "Narrow ear canals or exostoses",
      "Radiation therapy to the head and neck"
    ],
    diagnostics: [
      "Perform otoscopic examination assessing canal edema, erythema, debris, and discharge character",
      "Assess tragal tenderness and pinna manipulation pain (positive = OE; negative suggests OM)",
      "Evaluate tympanic membrane integrity before prescribing otic medications",
      "Differentiate diffuse OE from localized furuncle, otomycosis, and contact dermatitis",
      "Assess cranial nerve function (CN VII) to screen for necrotizing OE",
      "Evaluate for periauricular lymphadenopathy and cellulitis spread",
      "Assess hearing using whispered voice test or tuning fork if available"
    ],
    management: [
      "Perform aural toilet (gentle debris removal) to allow medication penetration",
      "Insert ear canal wick for severely edematous canals that prevent drop penetration",
      "Administer topical antibiotic/steroid combination drops per protocol",
      "Select non-ototoxic drops (ofloxacin, ciprofloxacin) when TM perforation cannot be excluded",
      "Implement pain management: oral NSAIDs or acetaminophen, warm compresses",
      "Educate on water avoidance during treatment and prevention strategies",
      "Escalate to urgent ENT referral for necrotizing OE or treatment failure"
    ],
    nursingActions: [
      "Perform comprehensive ear assessment including otoscopy, tragal tenderness, and pinna manipulation testing",
      "Verify tympanic membrane integrity before administering aminoglycoside-containing drops",
      "Demonstrate proper otic drop administration technique to patient and family",
      "Assess and monitor for signs of necrotizing OE: severe deep pain, granulation tissue at bone-cartilage junction, cranial neuropathy",
      "Monitor diabetic and immunocompromised patients closely for disease progression",
      "Coordinate ENT referral for treatment failure (no improvement at 48–72 hours), recurrent episodes, or suspected complications",
      "Educate on prevention: ear drying after swimming, avoiding cotton swabs, prophylactic acidifying drops",
      "Assess for and manage secondary otomycosis (fungal superinfection) following antibiotic use"
    ],
    signs: {
      left: [
        "Canal erythema and edema",
        "Serous to purulent otorrhea",
        "Pain with tragal pressure (hallmark)",
        "Canal debris and desquamated skin",
        "Pruritus (early symptom)",
        "Conductive hearing loss from canal occlusion",
        "Periauricular lymphadenopathy"
      ],
      right: [
        "Necrotizing OE: granulation tissue at bone-cartilage junction",
        "Cranial nerve palsies (VII, IX, X, XI, XII)",
        "Skull base osteomyelitis",
        "Periauricular cellulitis spreading to face",
        "Otomycosis: white/black fungal hyphae visible",
        "Temporomandibular joint involvement (trismus)",
        "Intracranial extension (meningitis, brain abscess)"
      ]
    },
    medications: [
      { name: "Ciprofloxacin 0.3%/Dexamethasone 0.1% otic", type: "Fluoroquinolone/corticosteroid combination", action: "Ciprofloxacin provides broad gram-negative and gram-positive coverage; dexamethasone reduces canal inflammation and edema", sideEffects: "Ear discomfort, pruritus, superinfection", contra: "Viral otic infection", pearl: "Can be used with or without intact TM. Superior to aminoglycoside-containing preparations for safety. Apply 4 drops BID for 7 days." },
      { name: "Ofloxacin 0.3% otic", type: "Fluoroquinolone otic monotherapy", action: "Broad-spectrum bactericidal activity via DNA gyrase and topoisomerase IV inhibition", sideEffects: "Ear discomfort, transient taste disturbance, dizziness", contra: "Fluoroquinolone hypersensitivity", pearl: "Only FDA-approved otic drop safe for use with tympanic membrane perforation. Use when TM integrity is questionable." },
      { name: "Clotrimazole 1% otic", type: "Antifungal", action: "Inhibits ergosterol synthesis disrupting fungal cell membrane integrity", sideEffects: "Local irritation, erythema", contra: "Known azole hypersensitivity", pearl: "Used for otomycosis (fungal OE). Aspergillus niger appears as black-headed hyphae; Candida appears as white creamy debris on otoscopy." },
      { name: "Acetic acid 2%", type: "Acidifying agent", action: "Lowers ear canal pH creating an environment hostile to bacterial and fungal growth", sideEffects: "Stinging, local irritation", contra: "Perforated tympanic membrane", pearl: "Can be used for mild OE or prophylactically after swimming. A homemade solution of 1:1 white vinegar and rubbing alcohol is a common prevention strategy." }
    ],
    pearls: [
      "Always verify TM integrity before prescribing aminoglycoside-containing drops—ototoxicity risk with perforation",
      "Necrotizing OE should be suspected in any diabetic or immunocompromised patient with severe OE, deep pain, and granulation tissue at the bone-cartilage junction",
      "Ear canal wicks should be removed or replaced every 24–48 hours; drops are applied directly onto the wick",
      "Otomycosis presents with fluffy white (Candida) or black-headed (Aspergillus) fungal elements on otoscopy",
      "Cerumen's natural acidic pH (6.1) and antimicrobial properties are the primary defense against OE—preserving this barrier is key to prevention"
    ],
    quiz: [
      { question: "Which patient with otitis externa requires the most urgent evaluation?", options: ["Young swimmer with mild canal edema and itching", "Diabetic patient with severe deep ear pain and granulation tissue", "Child with bilateral otitis externa after pool season", "Adult with mild OE and hearing aid use"], correct: 1, rationale: "A diabetic patient with severe deep pain and granulation tissue at the bone-cartilage junction may have necrotizing otitis externa, a life-threatening condition requiring urgent ENT evaluation and IV antibiotics." },
      { question: "The nurse cannot visualize the tympanic membrane due to canal edema. Which otic drop is safest to prescribe?", options: ["Neomycin/polymyxin B/hydrocortisone", "Ofloxacin 0.3% otic", "Gentamicin otic", "Tobramycin otic"], correct: 1, rationale: "Ofloxacin 0.3% otic is the only FDA-approved drop safe for use when TM integrity cannot be confirmed. Aminoglycoside-containing drops (neomycin, gentamicin, tobramycin) risk ototoxicity with TM perforation." },
      { question: "What is the role of cerumen in preventing otitis externa?", options: ["It amplifies sound transmission", "It maintains an acidic pH and contains antimicrobial compounds that inhibit colonization", "It lubricates the tympanic membrane", "It equalizes middle ear pressure"], correct: 1, rationale: "Cerumen maintains an acidic microenvironment (pH 6.1) and contains lipids and lysozymes that inhibit bacterial and fungal colonization, forming the primary defense barrier of the external auditory canal." }
    ]
  },

  "otitis-externa-np": {
    title: "Otitis Externa",
    cellular: {
      title: "Pathophysiology, Microbiology",
      content: "Otitis externa encompasses a spectrum from mild diffuse infection to life-threatening necrotizing disease. The external auditory canal's defense system relies on cerumen production (acidic pH, lysozymes, antimicrobial peptides), intact stratified squamous epithelium, lateral epithelial migration, and the narrow canal isthmus. Disruption of any component—through moisture, trauma, alkalinization, or immune compromise—initiates the pathological cascade. Pseudomonas aeruginosa is the predominant organism in diffuse OE, capable of forming biofilms on canal skin and producing exotoxins (exotoxin A inhibits protein synthesis, elastase degrades tissue barriers). In necrotizing OE, Pseudomonas invades from the canal through the fissures of Santorini and the tympanomastoid suture into the temporal bone, causing osteomyelitis that can extend to the skull base, petrous apex, and contralateral temporal bone. Cranial nerve involvement occurs as infection spreads along the skull base: CN VII (facial canal), CN IX-XI (jugular foramen), and CN XII (hypoglossal canal). Mortality in necrotizing OE ranges from 10–20% even with treatment. Otomycosis involves fungal colonization (Aspergillus niger, Candida albicans) often as superinfection after antibiotic therapy. The clinician must identify risk factors for necrotizing disease, prescribe targeted therapy, manage complications, and determine hospitalization and surgical referral needs."
    },
    riskFactors: [
      "Diabetes mellitus (especially with poor glycemic control)",
      "Immunosuppression (HIV/AIDS, chemotherapy, chronic corticosteroids)",
      "Advanced age with microangiopathy",
      "Previous radiation to temporal bone",
      "Chronic dermatologic conditions of the ear",
      "Recurrent OE with antibiotic resistance",
      "Ear canal instrumentation or foreign body",
      "Biofilm formation on hearing devices"
    ],
    diagnostics: [
      "Perform comprehensive otoscopic examination with pneumatic otoscopy to confirm TM integrity",
      "Order ear canal culture and sensitivity for treatment failures, necrotizing OE, or immunocompromised patients",
      "Order CT temporal bone for suspected necrotizing OE (bony erosion, soft tissue extension)",
      "Order technetium-99m bone scan for early osteomyelitis detection (more sensitive than CT)",
      "Order gallium-67 scan to monitor treatment response in necrotizing OE",
      "Order ESR and CRP as inflammatory markers for disease monitoring",
      "Assess glucose control in diabetic patients (HbA1c)",
      "Perform cranial nerve examination: VII (facial), IX (glossopharyngeal), X (vagus), XI (accessory), XII (hypoglossal)"
    ],
    management: [
      "Prescribe topical fluoroquinolone/steroid combination (ciprofloxacin/dexamethasone) as first-line for uncomplicated OE",
      "Prescribe ofloxacin otic when TM integrity cannot be confirmed",
      "Order aural toilet and wick placement for severely edematous canals",
      "Prescribe topical antifungals (clotrimazole 1%, nystatin) for confirmed otomycosis",
      "Initiate IV anti-pseudomonal antibiotics for necrotizing OE: ciprofloxacin IV or piperacillin-tazobactam + prolonged course (6–8 weeks)",
      "Hospitalize patients with necrotizing OE for IV antibiotics, surgical debridement consultation, and cranial nerve monitoring",
      "Prescribe prophylactic acidifying drops (acetic acid 2%) for recurrent OE or high-risk patients",
      "Refer for surgical debridement of necrotizing tissue when medical management fails"
    ],
    nursingActions: [
      "Perform comprehensive differential diagnosis: OE vs. OM, referred TMJ pain, malignancy, cholesteatoma, contact dermatitis",
      "Prescribe evidence-based first-line therapy and modify based on culture results",
      "Identify and manage necrotizing OE early with appropriate imaging, cultures, and IV antibiotic initiation",
      "Monitor cranial nerve function serially in necrotizing OE to assess disease progression",
      "Optimize glycemic control in diabetic patients as part of necrotizing OE management",
      "Determine need for hospitalization based on disease severity and patient risk factors",
      "Coordinate ENT surgical referral for debridement, biopsy (rule out malignancy), and refractory disease",
      "Prescribe preventive strategies for recurrent OE: custom ear molds, acidifying drops, water avoidance"
    ],
    signs: {
      left: [
        "Canal edema, erythema, and debris",
        "Serous to purulent otorrhea",
        "Tragal tenderness and pain on pinna traction",
        "Periauricular lymphadenopathy",
        "Conductive hearing loss",
        "Pruritus (early/mild disease)",
        "Canal skin maceration"
      ],
      right: [
        "Granulation tissue at bone-cartilage junction (necrotizing OE)",
        "Progressive cranial neuropathies (VII → IX, X, XI → XII)",
        "Skull base osteomyelitis on CT",
        "Temporomandibular joint spread (trismus)",
        "Intracranial complications (meningitis, sigmoid sinus thrombosis, brain abscess)",
        "Contralateral temporal bone involvement",
        "Persistent positive gallium scan despite treatment"
      ]
    },
    medications: [
      { name: "Ciprofloxacin IV", type: "Fluoroquinolone", action: "Inhibits bacterial DNA gyrase and topoisomerase IV; excellent anti-pseudomonal activity and bone penetration", sideEffects: "Tendon rupture, QT prolongation, peripheral neuropathy, C. difficile, photosensitivity", contra: "Myasthenia gravis, concurrent QT-prolonging agents, history of tendinopathy", pearl: "First-line systemic agent for necrotizing OE due to excellent anti-pseudomonal activity and bone penetration. Typical course is 6–8 weeks. Monitor renal function and QTc." },
      { name: "Piperacillin-Tazobactam", type: "Extended-spectrum penicillin/beta-lactamase inhibitor", action: "Broad-spectrum activity including anti-pseudomonal coverage; tazobactam extends spectrum against beta-lactamase producers", sideEffects: "Hypersensitivity, thrombocytopenia, hepatotoxicity, C. difficile", contra: "Penicillin allergy", pearl: "Alternative to ciprofloxacin for necrotizing OE, especially in ciprofloxacin-resistant Pseudomonas or when fluoroquinolones are contraindicated. Requires IV access for prolonged course." },
      { name: "Clotrimazole 1% otic solution", type: "Imidazole antifungal", action: "Inhibits lanosterol 14-alpha demethylase, blocking ergosterol synthesis and disrupting fungal cell membrane", sideEffects: "Local irritation, erythema, burning", contra: "Known azole hypersensitivity", pearl: "First-line for otomycosis. After thorough canal cleaning, apply for 7–14 days. Aspergillus niger forms characteristic black-headed conidiophores visible on otoscopy." },
      { name: "Ciprofloxacin 0.3%/Dexamethasone 0.1% otic suspension", type: "Topical fluoroquinolone/corticosteroid", action: "Ciprofloxacin provides bactericidal anti-pseudomonal coverage; dexamethasone reduces canal inflammation", sideEffects: "Ear discomfort, pruritus, headache", contra: "Viral otic infection, known hypersensitivity", pearl: "First-line topical therapy for uncomplicated OE. Safe with and without TM perforation. More effective than oral antibiotics for uncomplicated cases—systemic antibiotics are not recommended for simple OE." }
    ],
    pearls: [
      "Systemic antibiotics are not recommended for uncomplicated OE—topical therapy is more effective and avoids systemic side effects",
      "Necrotizing OE has 10–20% mortality; suspect in any diabetic/immunocompromised patient with severe OE and cranial nerve involvement",
      "Granulation tissue at the bone-cartilage junction of the ear canal is the pathognomonic finding of necrotizing OE",
      "The fissures of Santorini in the cartilaginous canal floor are the route of bacterial invasion into deeper tissues in necrotizing OE",
      "Gallium-67 scan normalizes with successful treatment of necrotizing OE, while technetium-99m scan may remain positive for months after resolution"
    ],
    quiz: [
      { question: "Which imaging modality is most sensitive for detecting early osteomyelitis in suspected necrotizing otitis externa?", options: ["CT temporal bone", "MRI brain", "Technetium-99m bone scan", "Plain radiograph of the skull"], correct: 2, rationale: "Technetium-99m bone scan is more sensitive than CT for detecting early osteomyelitis in necrotizing OE. CT may not show bony changes until 30–50% of bone is demineralized." },
      { question: "An NP diagnoses uncomplicated diffuse otitis externa. What is the most appropriate initial management?", options: ["Oral ciprofloxacin 500mg BID for 10 days", "Topical ciprofloxacin/dexamethasone otic drops for 7 days", "IV piperacillin-tazobactam for 6 weeks", "Oral amoxicillin-clavulanate for 10 days"], correct: 1, rationale: "Topical antibiotic/steroid combination drops are first-line for uncomplicated OE. Systemic antibiotics are not recommended for simple OE and should be reserved for necrotizing or complicated disease." },
      { question: "Which cranial nerve is typically the first affected in necrotizing otitis externa?", options: ["CN V (trigeminal)", "CN VII (facial)", "CN VIII (vestibulocochlear)", "CN XII (hypoglossal)"], correct: 1, rationale: "CN VII (facial nerve) is the most commonly and typically first cranial nerve affected in necrotizing OE due to its proximity to the temporal bone through the facial canal. Progressive involvement of CN IX, X, XI, and XII indicates skull base extension." }
    ]
  },

  "papilledema-rpn": {
    title: "Papilledema & Optic Nerve Disorders",
    cellular: {
      title: "Pathophysiology of Papilledema",
      content: "Papilledema is edema of the optic disc caused by elevated intracranial pressure (ICP) transmitted through the optic nerve sheath to the optic nerve head. The three main causes are increased intracranial pressure (space-occupying lesions, hydrocephalus, idiopathic intracranial hypertension), retrobulbar neuritis (optic nerve inflammation, often associated with multiple sclerosis), and changes in retinal blood vessels. Early signs include distension of retinal veins, loss of the optic cup, and blurring of the disc margins. In later stages, the optic disc becomes visibly elevated. Unlike other causes of disc edema, papilledema specifically refers to disc swelling from elevated ICP and is typically bilateral. The nurse monitors neurological status, reports visual changes, and assists with positioning and safety measures."
    },
    riskFactors: [
      "Space-occupying intracranial lesions (tumors, abscesses)",
      "Hydrocephalus",
      "Idiopathic intracranial hypertension (pseudotumor cerebri)",
      "Cerebral venous sinus thrombosis",
      "Meningitis or encephalitis",
      "Obesity (risk factor for IIH)",
      "Medications: tetracyclines, vitamin A, corticosteroid withdrawal",
      "Hypertensive crisis"
    ],
    diagnostics: [
      "Monitor and report new or worsening headaches, especially worse in the morning or with Valsalva",
      "Report any visual changes: blurred vision, transient visual obscurations, double vision",
      "Monitor vital signs and report changes in level of consciousness",
      "Report nausea and vomiting, especially projectile vomiting",
      "Monitor pupil size and reactivity as directed"
    ],
    management: [
      "Maintain bed head elevation as ordered (typically 30 degrees)",
      "Administer medications as ordered to reduce ICP (mannitol, acetazolamide)",
      "Implement seizure precautions as directed",
      "Maintain a quiet, dimly lit environment to reduce stimulation",
      "Assist with visual safety measures: adequate lighting, fall precautions",
      "Report any acute neurological changes immediately"
    ],
    nursingActions: [
      "Monitor neurological status using Glasgow Coma Scale as directed",
      "Assess and document visual acuity changes and visual field complaints",
      "Report signs of increased ICP: headache, vomiting, altered LOC, pupil changes",
      "Implement fall precautions for patients with visual impairment",
      "Monitor for Cushing's triad: hypertension, bradycardia, irregular respirations",
      "Report new-onset diplopia, photophobia, or transient visual obscurations immediately"
    ],
    signs: {
      left: [
        "Headache (worse in morning, with Valsalva)",
        "Transient visual obscurations (brief vision loss)",
        "Blurred or dim vision",
        "Enlarged blind spot on visual field testing",
        "Nausea and vomiting",
        "Pulsatile tinnitus"
      ],
      right: [
        "Loss of optic cup on fundoscopy",
        "Disc margin blurring and elevation",
        "Retinal vein distension (early sign)",
        "Flame hemorrhages around disc",
        "Pupil abnormalities (afferent pupillary defect)",
        "Sixth nerve palsy (false localizing sign)"
      ]
    },
    medications: [
      { name: "Acetazolamide", type: "Carbonic anhydrase inhibitor", action: "Reduces CSF production by inhibiting carbonic anhydrase in the choroid plexus", sideEffects: "Paresthesias (tingling), fatigue, altered taste, metabolic acidosis, kidney stones", contra: "Severe hepatic disease, sulfonamide allergy, hypokalemia", pearl: "First-line medical treatment for idiopathic intracranial hypertension. Reduces CSF production by 40–60%. Monitor electrolytes and acid-base status." },
      { name: "Mannitol", type: "Osmotic diuretic", action: "Creates osmotic gradient drawing fluid from brain tissue into vasculature, reducing ICP", sideEffects: "Dehydration, electrolyte imbalances, rebound increased ICP", contra: "Severe dehydration, active intracranial bleeding, pulmonary edema", pearl: "Used for acute ICP elevation. Administer through filter needle. Monitor serum osmolality (keep <320 mOsm/kg). Report if output decreases." }
    ],
    pearls: [
      "Papilledema specifically refers to optic disc swelling from elevated intracranial pressure—it is typically bilateral",
      "Early papilledema signs: retinal vein distension, loss of optic cup, blurred disc margins",
      "Transient visual obscurations (brief episodes of vision loss lasting seconds) are characteristic of papilledema",
      "Cushing's triad (hypertension, bradycardia, irregular respirations) is a late and ominous sign of critically elevated ICP",
      "A sixth cranial nerve palsy causing horizontal diplopia is a common 'false localizing sign' of elevated ICP"
    ],
    quiz: [
      { question: "Which finding should the nurse report immediately in a patient with known papilledema?", options: ["Mild headache relieved by acetaminophen", "Sudden decrease in level of consciousness", "Preference for dim lighting", "Appetite changes"], correct: 1, rationale: "A sudden decrease in level of consciousness in a patient with papilledema may indicate acutely worsening intracranial pressure, a medical emergency requiring immediate intervention." },
      { question: "What is the earliest fundoscopic sign of papilledema?", options: ["Optic disc pallor", "Retinal vein distension and loss of optic cup", "Cotton wool spots", "Retinal detachment"], correct: 1, rationale: "Retinal vein distension and loss of the optic cup are early fundoscopic signs of papilledema, occurring before disc elevation becomes visible." },
      { question: "Why is the head of the bed elevated in patients with papilledema?", options: ["To improve visual acuity", "To promote venous drainage and reduce intracranial pressure", "To prevent aspiration", "To reduce pain medication requirements"], correct: 1, rationale: "Head-of-bed elevation promotes cerebral venous drainage through the jugular veins, helping to reduce intracranial pressure." }
    ]
  },

  "papilledema-rn": {
    title: "Papilledema & Optic Nerve Disorders",
    cellular: {
      title: "Advanced Pathophysiology of Optic Disc Edema",
      content: "Papilledema results from transmission of elevated intracranial pressure through the CSF-filled subarachnoid space surrounding the optic nerve to the optic nerve head. Elevated pressure impairs axoplasmic flow within retinal ganglion cell axons at the lamina cribrosa, causing axonal swelling, disc edema, and if sustained, progressive optic atrophy with irreversible vision loss. The three pathological mechanisms include mechanical compression (elevated ICP deforms the lamina cribrosa and impairs axonal transport), vascular insufficiency (compression of capillaries reduces perfusion to the optic nerve head), and excitotoxicity (accumulated glutamate causes retinal ganglion cell apoptosis). Key differentials for optic disc edema include papilledema (elevated ICP), papillitis/optic neuritis (inflammation), anterior ischemic optic neuropathy (vascular), and pseudopapilledema (anatomical variant). The cup-to-disc ratio is assessed on fundoscopy: a ratio of ≤0.3 represents a healthy optic nerve, with progression indicating nerve fiber loss. The nurse performs comprehensive neurological assessment, interprets fundoscopic findings, manages ICP reduction protocols, and coordinates emergency care."
    },
    riskFactors: [
      "Intracranial mass lesions (tumors, abscesses, hematomas)",
      "Obstructive hydrocephalus",
      "Idiopathic intracranial hypertension (obesity, female, childbearing age)",
      "Cerebral venous sinus thrombosis",
      "Meningitis or encephalitis",
      "Medications: tetracyclines, vitamin A, growth hormone, corticosteroid withdrawal",
      "Hypertensive encephalopathy",
      "Systemic conditions: renal failure, Addison's disease, hypoparathyroidism"
    ],
    diagnostics: [
      "Perform systematic neurological assessment: level of consciousness, pupil reactivity, cranial nerve function",
      "Assess visual acuity, visual fields (enlarged blind spot is early finding), and color vision",
      "Interpret fundoscopic findings: disc edema grade, venous engorgement, hemorrhages, cotton wool spots",
      "Assess for papilledema staging: early (blurred margins), established (elevated disc, obscured vessels), chronic (disc pallor = atrophy)",
      "Monitor for signs of cerebral herniation: unilateral dilated pupil, posturing, Cushing's triad",
      "Differentiate papilledema from papillitis: papilledema is bilateral with preserved visual acuity initially; papillitis is unilateral with acute vision loss and pain on eye movement",
      "Monitor opening pressure during lumbar puncture if performed (elevated >25 cmH2O)"
    ],
    management: [
      "Implement ICP management protocol: head elevation 30°, midline head positioning, avoid neck vein compression",
      "Administer osmotic diuretics (mannitol) and loop diuretics as ordered for acute ICP reduction",
      "Administer acetazolamide as ordered for idiopathic intracranial hypertension",
      "Implement continuous neurological monitoring with GCS assessments at ordered intervals",
      "Coordinate urgent neuroimaging (CT, MRI) to identify underlying cause",
      "Prepare for emergency interventions: external ventricular drain, emergent craniotomy if herniation imminent",
      "Coordinate ophthalmology consultation for visual field testing and disc photography",
      "Implement seizure precautions and maintain environmental safety"
    ],
    nursingActions: [
      "Perform serial neurological assessments: GCS, pupil size/reactivity, motor function, cranial nerves",
      "Assess and document visual acuity and visual field changes at each shift",
      "Monitor for herniation signs: unilateral fixed dilated pupil, decorticate/decerebrate posturing, Cushing's triad",
      "Maintain head-of-bed elevation at 30° with head midline to optimize venous drainage",
      "Monitor ICP if external ventricular drain is in place: waveform, pressure, drainage volume",
      "Avoid activities that increase ICP: clustering nursing care, preventing straining, maintaining patent airway",
      "Educate patient on reporting visual symptoms: transient vision loss, blurring, double vision",
      "Coordinate multidisciplinary care: neurosurgery, ophthalmology, neurology"
    ],
    signs: {
      left: [
        "Bilateral disc edema with blurred margins",
        "Retinal venous engorgement and tortuosity",
        "Enlarged blind spot (early visual field defect)",
        "Headache worse in morning and with Valsalva",
        "Transient visual obscurations",
        "Pulsatile tinnitus (IIH)",
        "Sixth nerve palsy (false localizing sign)"
      ],
      right: [
        "Progressive visual field constriction",
        "Optic disc pallor (chronic atrophy stage)",
        "Flame and splinter hemorrhages around disc",
        "Cotton wool spots (retinal ischemia)",
        "Unilateral dilated pupil (impending herniation)",
        "Cushing's triad (HTN, bradycardia, irregular breathing)",
        "Loss of venous pulsations on fundoscopy"
      ]
    },
    medications: [
      { name: "Acetazolamide", type: "Carbonic anhydrase inhibitor", action: "Reduces CSF production by 40–60% through carbonic anhydrase inhibition in the choroid plexus epithelium", sideEffects: "Paresthesias, fatigue, altered taste, metabolic acidosis, nephrolithiasis, aplastic anemia (rare)", contra: "Sulfonamide allergy, severe hepatic/renal disease, hypokalemia, hyperchloremic acidosis", pearl: "First-line for IIH (1–4g/day in divided doses). Creates anion gap metabolic acidosis—monitor bicarbonate. Can worsen respiratory or metabolic conditions." },
      { name: "Mannitol 20%", type: "Osmotic diuretic", action: "Creates osmotic gradient drawing water from brain parenchyma into intravascular space, reducing cerebral edema and ICP", sideEffects: "Dehydration, electrolyte derangements, rebound ICP elevation, acute kidney injury at high doses", contra: "Active intracranial hemorrhage, severe dehydration, pulmonary edema, anuria", pearl: "Use 0.25–1g/kg IV over 15–20 minutes for acute ICP crisis. Keep serum osmolality <320 mOsm/kg. Must use filter during administration." },
      { name: "Furosemide", type: "Loop diuretic", action: "Reduces CSF production and provides systemic diuresis, complementing osmotic therapy", sideEffects: "Hypokalemia, dehydration, ototoxicity, metabolic alkalosis", contra: "Severe hypovolemia, anuria, hepatic coma", pearl: "Often used as adjunct to mannitol for ICP reduction. Synergistic effect when given 15 minutes after mannitol." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces vasogenic cerebral edema around tumors by stabilizing the blood-brain barrier", sideEffects: "Hyperglycemia, infection risk, GI bleeding, adrenal suppression, psychosis", contra: "Active untreated infection, GI perforation", pearl: "Effective for vasogenic edema around tumors but NOT for cytotoxic edema (stroke). Not used for IIH (can worsen on withdrawal). Monitor blood glucose." }
    ],
    pearls: [
      "Papilledema is bilateral disc edema from elevated ICP; papillitis is usually unilateral with acute vision loss and eye pain (consider optic neuritis/MS)",
      "Loss of spontaneous venous pulsations on fundoscopy is an early sign of elevated ICP (present in ~80% of normal individuals)",
      "The cup-to-disc ratio ≤0.3 represents a healthy optic nerve; progressive increase indicates nerve fiber loss (glaucoma) or chronic papilledema",
      "Acetazolamide creates an anion gap metabolic acidosis—use with caution in patients with pre-existing respiratory or metabolic conditions",
      "Mannitol can cause rebound ICP elevation as it crosses a disrupted blood-brain barrier—monitor closely and avoid prolonged use"
    ],
    quiz: [
      { question: "How does the nurse differentiate papilledema from optic neuritis (papillitis)?", options: ["Papilledema causes eye pain; papillitis does not", "Papilledema is typically bilateral with preserved acuity initially; papillitis is unilateral with acute vision loss", "Papilledema always causes unilateral disc changes", "There is no clinical difference between the two"], correct: 1, rationale: "Papilledema (from elevated ICP) is typically bilateral with preserved visual acuity in early stages. Papillitis (optic neuritis) is usually unilateral with acute vision loss and pain on eye movement, often associated with multiple sclerosis." },
      { question: "Which combination of findings represents Cushing's triad and requires immediate action?", options: ["Tachycardia, hypotension, tachypnea", "Hypertension, bradycardia, irregular respirations", "Fever, hypotension, tachycardia", "Hypothermia, bradycardia, apnea"], correct: 1, rationale: "Cushing's triad (hypertension, bradycardia, irregular respirations) is a late sign of critically elevated ICP indicating impending brainstem herniation—a medical emergency." },
      { question: "Why must mannitol be filtered during IV administration?", options: ["To prevent air embolism", "To remove crystallized particles that form in the solution", "To slow the infusion rate", "To prevent drug interactions"], correct: 1, rationale: "Mannitol can crystallize, especially at lower temperatures. An in-line filter prevents crystallized particles from entering the bloodstream, which could cause vascular occlusion." }
    ]
  },

  "papilledema-np": {
    title: "Papilledema & Optic Nerve Disorders",
    cellular: {
      title: "Pathophysiology, Differential Diagnosis",
      content: "Papilledema represents optic disc edema secondary to elevated intracranial pressure, requiring urgent diagnostic workup to identify the underlying etiology. The pathophysiology involves impaired axoplasmic transport at the lamina cribrosa where elevated CSF pressure compresses retinal ganglion cell axons, causing axonal swelling, mitochondrial dysfunction, and if sustained, Wallerian degeneration with irreversible optic atrophy. The optic nerve is anatomically surrounded by the subarachnoid space containing CSF—elevated ICP is directly transmitted to the optic nerve sheath. Fundoscopic progression follows a predictable pattern: Stage 1 (early)—obscured nasal disc margin, C-shaped halo, preserved temporal margin; Stage 2 (established)—circumferential disc elevation, obscured major vessels, peripapillary hemorrhages; Stage 3 (chronic)—disc pallor, narrowed vessels, optociliary shunts; Stage 4 (atrophic)—flat, pale disc with permanent vision loss. The differential for bilateral disc edema includes papilledema (elevated ICP), malignant hypertension, bilateral optic neuritis, infiltrative optic neuropathy, and diabetic papillopathy. For unilateral disc edema: anterior ischemic optic neuropathy (AION), optic neuritis, compressive lesion, central retinal vein occlusion, and pseudopapilledema (optic disc drusen). The clinician must order and interpret appropriate diagnostics, initiate treatment for the underlying cause, manage ICP reduction, and determine surgical vs. medical management."
    },
    riskFactors: [
      "Intracranial neoplasms (primary and metastatic)",
      "Obstructive and communicating hydrocephalus",
      "Idiopathic intracranial hypertension (young obese females, 15–44 years)",
      "Cerebral venous sinus thrombosis (hypercoagulable states, OCP use)",
      "CNS infections (meningitis, encephalitis, brain abscess)",
      "Medications: tetracyclines, minocycline, doxycycline, vitamin A, isotretinoin, growth hormone, lithium",
      "Systemic conditions: Addison's disease, hypoparathyroidism, severe anemia, SLE",
      "Post-traumatic intracranial hemorrhage"
    ],
    diagnostics: [
      "Order urgent CT head without contrast to rule out mass lesion BEFORE lumbar puncture",
      "Order MRI brain with gadolinium for comprehensive evaluation of intracranial pathology",
      "Order MR venography to evaluate for cerebral venous sinus thrombosis",
      "Order lumbar puncture with opening pressure measurement (elevated >25 cmH2O; >28 in obese patients) after imaging clears mass effect",
      "Order CSF analysis: cell count, protein, glucose, cytology, cultures as indicated",
      "Order comprehensive metabolic panel, CBC, coagulation studies, and thyroid function",
      "Order formal visual field testing (Humphrey or Goldmann perimetry) for baseline and serial monitoring",
      "Order optical coherence tomography (OCT) for quantitative measurement of retinal nerve fiber layer thickness"
    ],
    management: [
      "Prescribe acetazolamide 1–4g/day in divided doses as first-line medical therapy for IIH",
      "Prescribe weight loss program for IIH (5–10% body weight loss often resolves symptoms)",
      "Prescribe furosemide as adjunct to acetazolamide if inadequate response",
      "Order urgent neurosurgical consultation for mass lesions, hydrocephalus, or impending herniation",
      "Refer for optic nerve sheath fenestration for progressive vision loss despite medical therapy",
      "Refer for CSF shunting (VP or LP shunt) for refractory IIH with intractable headache",
      "Prescribe venous sinus stenting evaluation for IIH with demonstrated venous sinus stenosis",
      "Discontinue causative medications (tetracyclines, vitamin A, isotretinoin) and substitute alternatives",
      "Manage underlying etiology: antibiotics for CNS infection, anticoagulation for venous thrombosis, surgical resection for tumors"
    ],
    nursingActions: [
      "Perform comprehensive differential diagnosis of bilateral disc edema: papilledema vs. malignant HTN vs. bilateral papillitis vs. infiltrative disease",
      "Order and interpret neuroimaging to identify underlying cause of elevated ICP",
      "Initiate evidence-based ICP-lowering therapy and titrate based on clinical response",
      "Monitor visual function serially with formal perimetry and OCT to guide treatment intensity",
      "Determine need for surgical intervention vs. medical management based on visual function trajectory",
      "Screen for and discontinue medications known to cause elevated ICP",
      "Coordinate multidisciplinary care: neurosurgery, neuro-ophthalmology, neurology",
      "Manage long-term follow-up for IIH: weight management, medication titration, visual field monitoring"
    ],
    signs: {
      left: [
        "Bilateral disc edema (asymmetric possible)",
        "Obscured disc margins progressing circumferentially",
        "Peripapillary hemorrhages and cotton wool spots",
        "Enlarged blind spot (earliest visual field defect)",
        "Transient visual obscurations (seconds, positional)",
        "Pulsatile tinnitus (venous sinus stenosis)",
        "Sixth nerve palsy with horizontal diplopia"
      ],
      right: [
        "Progressive visual field constriction (if untreated)",
        "Optic atrophy (chronic stage—irreversible)",
        "Optociliary shunt vessels (chronic papilledema)",
        "Central scotoma (late—indicates severe damage)",
        "Unilateral fixed dilated pupil (herniation emergency)",
        "Foster-Kennedy syndrome (unilateral papilledema + contralateral optic atrophy = frontal lobe mass)",
        "Cranial nerve III palsy with pupil involvement (uncal herniation)"
      ]
    },
    medications: [
      { name: "Acetazolamide (high-dose)", type: "Carbonic anhydrase inhibitor", action: "Reduces CSF production by 40–60% through inhibition of carbonic anhydrase in the choroid plexus; also decreases aqueous humor production", sideEffects: "Paresthesias (dose-related), altered taste, metabolic acidosis, nephrolithiasis, aplastic anemia, teratogenicity", contra: "Sulfonamide allergy, severe hepatic cirrhosis, hypokalemia, adrenal insufficiency, pregnancy", pearl: "IIHTT trial demonstrated 1–4g/day improves visual field and papilledema grade. Creates non-anion gap metabolic acidosis. Supplement potassium and monitor bicarbonate." },
      { name: "Topiramate", type: "Carbonic anhydrase inhibitor/anticonvulsant", action: "Weak carbonic anhydrase inhibition reducing CSF production; additional appetite suppression promotes weight loss", sideEffects: "Cognitive dulling, paresthesias, nephrolithiasis, acute angle-closure glaucoma, metabolic acidosis", contra: "Pregnancy (teratogenic), hepatic failure, nephrolithiasis", pearl: "Dual benefit in IIH: reduces ICP and promotes weight loss. Second-line when acetazolamide is not tolerated. Monitor for cognitive side effects." },
      { name: "Hypertonic saline 3%", type: "Osmotic agent", action: "Creates osmotic gradient to reduce cerebral edema; more effective than mannitol for sustained ICP reduction in some settings", sideEffects: "Hypernatremia, central pontine myelinolysis (if sodium corrected too rapidly), volume overload", contra: "Severe hypernatremia, congestive heart failure", pearl: "Alternative to mannitol for acute ICP reduction. Target serum Na 145–155 mEq/L. Central line preferred for concentrations >3%. Monitor sodium every 4–6 hours." },
      { name: "Mannitol 20%", type: "Osmotic diuretic", action: "Creates osmotic gradient drawing free water from brain parenchyma into vasculature", sideEffects: "Electrolyte derangements, rebound ICP, acute tubular necrosis, volume depletion", contra: "Active hemorrhage, severe dehydration, anuria, pulmonary edema", pearl: "Onset 15–30 minutes, peak effect 30–60 minutes. Keep osmolar gap <55 mOsm/kg and serum osmolality <320. Filter required. Intermittent boluses preferred over continuous infusion." }
    ],
    pearls: [
      "Always obtain neuroimaging (CT/MRI) BEFORE lumbar puncture in papilledema to rule out mass lesion and herniation risk",
      "Foster-Kennedy syndrome: papilledema in one eye + optic atrophy in the contralateral eye suggests a frontal lobe mass compressing the ipsilateral optic nerve",
      "The IIHTT trial established acetazolamide (up to 4g/day) + weight loss as the standard treatment for IIH with mild visual loss",
      "Optic nerve sheath fenestration is indicated for progressive vision loss despite maximal medical therapy—it decompresses the optic nerve locally",
      "Pseudopapilledema from optic disc drusen can be differentiated from true papilledema using B-scan ultrasonography or OCT enhanced depth imaging"
    ],
    quiz: [
      { question: "Before performing a lumbar puncture in a patient with papilledema, what must the clinician order first?", options: ["Visual field testing", "CT or MRI of the head to rule out mass lesion", "Carotid Doppler ultrasound", "Electroencephalogram"], correct: 1, rationale: "Neuroimaging must be performed before LP in papilledema to rule out a mass lesion. LP in the presence of mass effect risks transtentorial herniation." },
      { question: "A young obese woman presents with headaches, transient visual obscurations, bilateral papilledema, and normal MRI. LP opening pressure is 32 cmH2O. What is the most likely diagnosis?", options: ["Brain tumor", "Idiopathic intracranial hypertension", "Multiple sclerosis", "Cerebral venous thrombosis"], correct: 1, rationale: "This is the classic presentation of idiopathic intracranial hypertension (IIH): young obese female, headaches, transient visual obscurations, bilateral papilledema, normal neuroimaging, and elevated opening pressure." },
      { question: "What is Foster-Kennedy syndrome?", options: ["Bilateral optic atrophy from glaucoma", "Papilledema in one eye with contralateral optic atrophy suggesting frontal lobe mass", "Bilateral papilledema from IIH", "Unilateral optic neuritis from MS"], correct: 1, rationale: "Foster-Kennedy syndrome features papilledema in one eye (from elevated ICP) and optic atrophy in the contralateral eye (from direct compression by a frontal lobe mass), a classic neurological localizing sign." }
    ]
  }
};
