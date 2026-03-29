import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");
function escapeStr(s: string): string { return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n"); }
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
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {
  "bronchiolitis-obliterans-rn": {
    title: "Bronchiolitis Obliterans",
    cellular: {
      title: "Pathophysiology of Small Airway Fibrosis and Obliterative Bronchiolitis",
      content: "Bronchiolitis obliterans (BO), also known as obliterative bronchiolitis or constrictive bronchiolitis, is a form of irreversible obstructive lung disease caused by inflammation and progressive fibrosis of the small airways (bronchioles). Unlike bronchiolitis obliterans organizing pneumonia (BOOP, now termed cryptogenic organizing pneumonia/COP), which primarily involves the alveoli and is typically steroid-responsive, bronchiolitis obliterans specifically targets the bronchiolar epithelium and subepithelial tissues, leading to concentric narrowing and eventual obliteration of the bronchiolar lumen by scar tissue. This distinction is critical for nursing practice because BO is largely irreversible and steroid-resistant, while COP is steroid-responsive -- confusing these entities leads to inappropriate treatment expectations. The pathogenesis of BO involves an initial insult to the bronchiolar epithelium that triggers an exaggerated reparative response. The inciting event causes epithelial cell injury and denudation, exposing the basement membrane and activating an inflammatory cascade. Neutrophils, lymphocytes, and macrophages infiltrate the peribronchiolar tissues, releasing pro-inflammatory cytokines (IL-1beta, IL-6, IL-8, TNF-alpha) and pro-fibrotic mediators (TGF-beta, PDGF). Fibroblasts are recruited to the damaged bronchiolar wall, where they proliferate and differentiate into myofibroblasts -- contractile cells that produce excessive extracellular matrix proteins (collagen types I and III, fibronectin). This fibroproliferative process progressively narrows the bronchiolar lumen from outside in (constrictive pattern), eventually completely obliterating the airway. Once fibrotic obliteration occurs, the damage is irreversible because the normal bronchiolar architecture cannot regenerate. The most common clinical settings for BO include: post-lung transplantation (bronchiolitis obliterans syndrome/BOS is the leading cause of chronic graft dysfunction and long-term mortality after lung transplantation, affecting 50-60% of lung transplant recipients by 5 years post-transplant -- it represents chronic rejection mediated by alloreactive T cells targeting donor bronchiolar epithelium), post-hematopoietic stem cell transplantation (BO occurs in 2-14% of allogeneic HSCT recipients as a manifestation of chronic graft-versus-host disease affecting the lungs), inhalational injury (exposure to toxic fumes including diacetyl -- the butter flavoring chemical responsible for 'popcorn lung' in microwave popcorn factory workers, nitrogen dioxide in silo filler's disease, sulfur mustard, and other industrial chemicals), post-infectious (following severe lower respiratory infections particularly in children -- adenovirus, influenza, respiratory syncytial virus, Mycoplasma pneumoniae), autoimmune and connective tissue diseases (rheumatoid arthritis is the most commonly associated autoimmune condition), and drug-induced (penicillamine, gold salts, and rare cases with other medications). The clinical presentation is characterized by progressive dyspnea and a non-productive cough developing insidiously over weeks to months. Physical examination reveals decreased breath sounds, inspiratory squeaks (a distinctive finding in bronchiolar disease), and possible wheezing, though auscultatory findings may be surprisingly subtle given the severity of airflow obstruction. Pulmonary function testing (PFT) is the cornerstone of diagnosis and monitoring, showing a progressive obstructive pattern: reduced FEV1 (forced expiratory volume in 1 second), reduced FEV1/FVC ratio, and air trapping with increased residual volume. In the post-transplant setting, BOS is staged by the percent decline in FEV1 from the post-transplant baseline: BOS 0-p (potential BOS) is defined by a 10-19% decline in FEV1 or >25% decline in FEF25-75; BOS 1 is a 34-65% decline; BOS 2 is a 50-65% decline; and BOS 3 is a >65% decline. High-resolution CT (HRCT) of the chest shows characteristic findings of air trapping on expiratory images (mosaic attenuation pattern -- areas of air trapping remain lucent while normal lung deflates, creating a mosaic pattern), bronchial wall thickening, and bronchiectasis in advanced disease. Importantly, the chest X-ray is often normal or shows only subtle hyperinflation, which can delay diagnosis. Surgical lung biopsy provides definitive histological diagnosis (showing constrictive bronchiolitis with submucosal fibrosis and bronchiolar luminal narrowing/obliteration), but is not routinely performed due to its invasive nature and the ability to make a clinical diagnosis based on PFTs, imaging, and clinical context. Treatment is largely supportive and aimed at slowing progression rather than reversing established fibrosis. In post-transplant BOS, treatment includes augmented immunosuppression (increased tacrolimus/cyclosporine levels, addition of azithromycin for its immunomodulatory and anti-inflammatory properties, inhaled corticosteroids, and in refractory cases, extracorporeal photopheresis or total lymphoid irradiation). Azithromycin has emerged as a particularly important therapy: approximately 30-40% of BOS patients show stabilization or improvement in FEV1 with azithromycin, suggesting that a subset of BOS may have a neutrophilic inflammatory component that is azithromycin-responsive. For non-transplant BO, treatment focuses on removing the offending agent (environmental exposure), immunosuppression if autoimmune-mediated, bronchodilator therapy for symptomatic relief, and pulmonary rehabilitation. The RN's role includes meticulous respiratory assessment, spirometry monitoring (teaching patients to perform home spirometry and recognizing significance of FEV1 trends), medication administration and monitoring (particularly immunosuppressive drug levels and side effects in transplant patients), oxygen therapy management, infection prevention, and patient education about the chronic progressive nature of the disease."
    },
    riskFactors: [
      "Lung transplantation (BOS is the leading cause of chronic graft failure, affecting 50-60% of recipients by 5 years; risk increases with acute rejection episodes, CMV infection, and GERD)",
      "Allogeneic hematopoietic stem cell transplantation (BO occurs in 2-14% of recipients as pulmonary chronic GVHD)",
      "Inhalational exposure to toxic chemicals (diacetyl/butter flavoring, nitrogen dioxide, sulfur mustard, chlorine, ammonia -- occupational exposure history is critical)",
      "Post-infectious (severe viral bronchiolitis in childhood -- adenovirus, influenza, RSV, Mycoplasma pneumoniae)",
      "Rheumatoid arthritis and other connective tissue diseases (RA is the most commonly associated autoimmune condition)",
      "Gastroesophageal reflux disease (aspiration of gastric contents damages bronchiolar epithelium; particularly important in post-transplant patients where GERD significantly increases BOS risk)",
      "Medication-related (penicillamine, gold salts -- rare drug-induced causes)"
    ],
    diagnostics: [
      "Pulmonary function testing (PFTs are the cornerstone of diagnosis -- obstructive pattern with reduced FEV1, reduced FEV1/FVC ratio, air trapping with increased residual volume; in post-transplant BOS, staged by percent decline in FEV1 from baseline)",
      "High-resolution CT chest with inspiratory AND expiratory images (mosaic attenuation pattern on expiratory images indicating air trapping is characteristic; bronchial wall thickening and bronchiectasis in advanced disease)",
      "Chest X-ray (often normal or shows only subtle hyperinflation -- a normal CXR does NOT exclude BO)",
      "Surgical lung biopsy (gold standard for definitive diagnosis but rarely performed due to invasiveness; shows constrictive bronchiolitis with submucosal fibrosis)",
      "Bronchoalveolar lavage (BAL -- elevated neutrophil percentage suggests active inflammation; helps exclude infection in transplant patients)",
      "Home spirometry monitoring (post-transplant patients perform daily or thrice-weekly home FEV1 measurements to detect early BOS -- a >10% decline from baseline triggers evaluation)",
      "Donor-specific antibodies (DSA testing in transplant patients -- de novo DSA development is associated with increased BOS risk)"
    ],
    management: [
      "Azithromycin 250 mg daily or three times weekly (immunomodulatory and anti-inflammatory properties; approximately 30-40% of BOS patients show stabilization or improvement in FEV1)",
      "Augmented immunosuppression for post-transplant BOS (optimize tacrolimus/cyclosporine levels, add mycophenolate or switch immunosuppressive agents)",
      "Inhaled corticosteroids and bronchodilators (fluticasone/salmeterol for symptomatic relief, though limited evidence for disease modification)",
      "Pulmonary rehabilitation (exercise training, breathing techniques, energy conservation -- improves functional capacity and quality of life)",
      "Supplemental oxygen for hypoxemia (titrate to SpO2 >88-92% at rest and with exertion)",
      "GERD management (aggressive anti-reflux therapy with PPI; consider fundoplication in transplant patients with documented aspiration, as GERD treatment may slow BOS progression)"
    ],
    nursingActions: [
      "Assess respiratory status systematically: respiratory rate, depth, pattern, SpO2, work of breathing, adventitious sounds (inspiratory squeaks are characteristic of bronchiolar disease), and exercise tolerance",
      "Monitor spirometry trends (FEV1 is the key metric -- teach transplant patients to perform home spirometry correctly and report >10% decline from baseline immediately)",
      "Administer immunosuppressive medications per protocol and monitor drug levels (tacrolimus trough 8-12 ng/mL for transplant patients; cyclosporine trough levels as prescribed)",
      "Educate patients about infection prevention (hand hygiene, avoiding sick contacts, influenza and pneumococcal vaccination) as immunosuppressed patients are at high risk for respiratory infections that can accelerate BOS",
      "Assess and manage medication side effects of chronic immunosuppression (renal function monitoring, glucose monitoring, blood pressure monitoring, infection surveillance)",
      "Coordinate pulmonary rehabilitation referral and encourage adherence to exercise programs",
      "Assess for GERD symptoms and ensure anti-reflux measures are implemented (head of bed elevation, medication timing relative to meals, PPI adherence)",
      "Provide emotional support for patients facing a progressive, largely irreversible lung disease -- facilitate referrals to pulmonary support groups, psychology, and palliative care as appropriate"
    ],
    assessmentFindings: [
      "Progressive dyspnea (initially exertional, progressing to rest dyspnea -- develops insidiously over weeks to months)",
      "Non-productive cough (dry cough without significant sputum production)",
      "Inspiratory squeaks on auscultation (characteristic of small airway disease -- high-pitched, brief inspiratory sounds)",
      "Decreased breath sounds with possible expiratory wheezing (from small airway obstruction)",
      "Declining FEV1 on serial spirometry (the most objective and sensitive indicator of disease progression)",
      "Exercise desaturation (SpO2 drops with exertion before resting hypoxemia develops)",
      "Normal or hyperinflated chest X-ray (the relative normalcy of the CXR can be misleadingly reassuring)"
    ],
    signs: {
      left: [
        "Mild exertional dyspnea with FEV1 >80% of baseline",
        "Occasional dry cough without desaturation",
        "Subtle air trapping on expiratory CT",
        "Stable FEV1 on serial monitoring",
        "Normal oxygen saturation at rest and with exertion"
      ],
      right: [
        "Severe fixed airway obstruction (FEV1 <20% predicted)",
        "Chronic respiratory failure requiring continuous oxygen",
        "Recurrent pneumonia from impaired mucociliary clearance",
        "Right heart failure (cor pulmonale) from chronic hypoxic vasoconstriction",
        "Respiratory failure requiring re-transplant consideration"
      ]
    },
    medications: [
      {
        name: "Azithromycin (Zithromax)",
        type: "Macrolide antibiotic with immunomodulatory properties",
        action: "At the sub-antimicrobial doses used for BOS, azithromycin exerts anti-inflammatory and immunomodulatory effects independent of its antibacterial activity. It accumulates in phagocytes and inflammatory cells, inhibiting neutrophil chemotaxis and oxidative burst, reducing pro-inflammatory cytokine production (IL-8, IL-6, TNF-alpha), shifting macrophage polarization from pro-inflammatory M1 to anti-inflammatory M2 phenotype, and reducing neutrophilic airway inflammation. These properties are thought to target the neutrophilic component of BOS pathogenesis, explaining why approximately 30-40% of BOS patients show improvement with azithromycin therapy.",
        sideEffects: "GI effects (diarrhea, nausea, abdominal pain -- most common), QT prolongation (dose-dependent, clinically significant risk in patients with pre-existing QT prolongation or concurrent QT-prolonging medications), hepatotoxicity (rare, monitor liver function), ototoxicity (reversible hearing loss at high doses), Clostridioides difficile-associated diarrhea",
        contra: "Known hypersensitivity to macrolides; history of cholestatic jaundice or hepatic dysfunction with prior azithromycin use; concurrent use with drugs that prolong QT interval (class IA/III antiarrhythmics); caution with myasthenia gravis (may exacerbate weakness)",
        pearl: "For BOS: 250 mg daily or 250 mg three times weekly (Monday-Wednesday-Friday) -- this is a LONG-TERM immunomodulatory dose, not a short antibiotic course; response is assessed by FEV1 trend over 3-6 months; azithromycin-responsive BOS (approximately 30-40% of cases) may represent a distinct neutrophilic phenotype; some transplant centers now use prophylactic azithromycin starting immediately post-transplant to PREVENT BOS; monitor ECG baseline and periodically for QT prolongation, especially in patients on tacrolimus which also prolongs QT"
      },
      {
        name: "Tacrolimus (Prograf)",
        type: "Calcineurin inhibitor (transplant immunosuppressant)",
        action: "Binds to intracellular FK-binding protein (FKBP-12), and the tacrolimus-FKBP complex inhibits calcineurin phosphatase activity, preventing dephosphorylation of NFAT and blocking IL-2 gene transcription essential for T cell activation and proliferation. Approximately 10-100 times more potent than cyclosporine on a weight basis. In lung transplantation, tacrolimus is the cornerstone of maintenance immunosuppression to prevent acute and chronic rejection (BOS). Inadequate tacrolimus levels are associated with increased risk of BOS development.",
        sideEffects: "Nephrotoxicity (dose-dependent, the most clinically significant toxicity -- monitor serum creatinine and BUN regularly), neurotoxicity (tremor, headache, seizures, posterior reversible encephalopathy syndrome/PRES), hyperglycemia (post-transplant diabetes -- monitor glucose regularly), hyperkalemia, hypomagnesemia, hypertension, alopecia, GI effects (diarrhea, nausea), increased infection and malignancy risk (lymphoma, skin cancers)",
        contra: "Known hypersensitivity to tacrolimus or polyoxyl 60 hydrogenated castor oil (IV formulation); concurrent use with cyclosporine (additive nephrotoxicity); concurrent potassium-sparing diuretics (hyperkalemia); live vaccines",
        pearl: "Therapeutic drug monitoring is ESSENTIAL: target trough levels vary by time post-transplant (typically 10-15 ng/mL in first 3 months, then 8-12 ng/mL maintenance); draw trough level 12 hours after last dose, immediately before next dose; highly variable bioavailability affected by food (take consistently 1 hour before or 2 hours after meals), CYP3A4 interactions (azole antifungals INCREASE levels, rifampin DECREASES levels), and diarrhea (may increase absorption); grapefruit juice is contraindicated (inhibits CYP3A4 increasing levels); monitor renal function, glucose, potassium, magnesium, and blood pressure at every visit"
      },
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "Inhaled corticosteroid/long-acting beta-2 agonist combination (ICS/LABA)",
        action: "Fluticasone propionate (ICS): activates intracellular glucocorticoid receptors, translocating to the nucleus and modifying gene transcription to reduce airway inflammation; inhibits inflammatory cell recruitment (eosinophils, lymphocytes, macrophages), reduces pro-inflammatory cytokine and mediator production, and decreases airway edema and mucus secretion. Salmeterol (LABA): selective beta-2 adrenergic agonist with 12-hour duration of action; relaxes bronchial smooth muscle by stimulating adenylyl cyclase and increasing intracellular cAMP, producing sustained bronchodilation; also enhances mucociliary clearance. The combination provides both anti-inflammatory and bronchodilatory effects in the small airways affected by BO.",
        sideEffects: "ICS: oral candidiasis (thrush -- rinse mouth after use), dysphonia (hoarse voice), pharyngitis; high-dose systemic effects include adrenal suppression, osteoporosis, cataracts, glaucoma, skin thinning. LABA: tachycardia, tremor, headache, hypokalemia; FDA black box warning (historical) for LABA monotherapy increasing asthma-related death -- not applicable when combined with ICS",
        contra: "Primary treatment of acute bronchospasm or status asthmaticus (not a rescue inhaler); known hypersensitivity to fluticasone, salmeterol, or milk proteins (Advair Diskus contains lactose); severe milk protein allergy",
        pearl: "Used for symptomatic management of BOS -- provides modest improvement in symptoms and may reduce decline in FEV1 in some patients, though evidence is limited; teach proper inhaler technique (Diskus: open, slide lever, exhale fully, inhale deeply and hold for 10 seconds, rinse mouth; MDI: shake, exhale, coordinate actuation with inhalation using spacer, hold breath 10 seconds, rinse mouth); monitor for oral candidiasis at each visit; ICS dose adjustment based on symptom control and side effects"
      }
    ],
    pearls: [
      "Bronchiolitis obliterans (BO/constrictive bronchiolitis) is NOT the same as bronchiolitis obliterans organizing pneumonia (BOOP/COP) -- BO involves irreversible fibrotic obliteration of bronchioles and is largely steroid-resistant, while COP involves the alveoli and is typically steroid-responsive with good prognosis",
      "BOS (bronchiolitis obliterans syndrome) is the leading cause of long-term mortality after lung transplantation, affecting 50-60% of recipients by 5 years -- early detection through serial spirometry monitoring is essential",
      "Home spirometry is the most important monitoring tool for post-transplant patients -- teach patients to perform daily FEV1 measurements and report a decline of >10% from their personal best baseline immediately",
      "Azithromycin at low doses (250 mg daily or three times weekly) has immunomodulatory properties that stabilize or improve FEV1 in approximately 30-40% of BOS patients -- this represents one of the few treatments that can modify the disease course",
      "GERD is a significant modifiable risk factor for BOS after lung transplantation -- aggressive anti-reflux therapy (PPI, lifestyle modifications) and consideration of fundoplication may slow BOS progression by reducing chronic microaspiration injury to the bronchiolar epithelium",
      "A normal chest X-ray does NOT exclude bronchiolitis obliterans -- HRCT with expiratory images showing mosaic attenuation (air trapping) is far more sensitive; pulmonary function testing showing progressive obstructive changes is the primary diagnostic and monitoring tool",
      "Inspiratory squeaks on auscultation are a characteristic but often subtle finding of small airway disease -- they differ from wheezing in their high-pitched, brief, inspiratory quality and may be the earliest physical finding before spirometric changes are apparent"
    ],
    quiz: [
      {
        question: "A lung transplant recipient's home spirometry shows a progressive 20% decline in FEV1 over the past 3 months. What should the nurse suspect and what action is needed?",
        options: [
          "Normal post-transplant variation -- reassure the patient and continue monitoring",
          "Bronchiolitis obliterans syndrome (BOS) -- notify the transplant team immediately for evaluation and possible treatment adjustment",
          "Acute rejection -- administer high-dose IV methylprednisolone immediately",
          "Pulmonary embolism -- obtain CT pulmonary angiography"
        ],
        correct: 1,
        rationale: "A progressive 20% decline in FEV1 from post-transplant baseline in a lung transplant recipient is concerning for bronchiolitis obliterans syndrome (BOS). This exceeds the 10% threshold that should trigger immediate evaluation. The transplant team must be notified for comprehensive assessment including bronchoscopy with BAL (to exclude infection and acute rejection), CT imaging, and consideration of treatment modifications (azithromycin initiation, immunosuppression optimization). This is NOT normal variation and should never be dismissed."
      },
      {
        question: "How does bronchiolitis obliterans (BO) differ from cryptogenic organizing pneumonia (COP/BOOP)?",
        options: [
          "They are the same disease with different names used interchangeably",
          "BO involves irreversible fibrotic obliteration of bronchioles and is steroid-resistant; COP involves the alveoli and is typically steroid-responsive",
          "BO is steroid-responsive while COP requires lung transplantation",
          "Both conditions respond equally well to corticosteroid therapy"
        ],
        correct: 1,
        rationale: "This is a critical distinction. Bronchiolitis obliterans (BO/constrictive bronchiolitis) involves irreversible fibrotic obliteration of the bronchiolar lumen and is largely steroid-resistant, requiring immunomodulatory therapy and potentially re-transplantation. Cryptogenic organizing pneumonia (COP, formerly BOOP) involves inflammatory tissue filling the alveoli and respiratory bronchioles and typically responds dramatically to corticosteroid therapy with a good prognosis. Despite their similar-sounding names, they are fundamentally different diseases requiring different treatment approaches."
      },
      {
        question: "Which auscultatory finding is most characteristic of bronchiolar disease such as bronchiolitis obliterans?",
        options: [
          "Coarse crackles (rales) heard primarily during expiration",
          "Inspiratory squeaks -- brief, high-pitched sounds heard during inspiration",
          "Pleural friction rub heard best at the lung bases",
          "Bronchial breath sounds heard over the peripheral lung fields"
        ],
        correct: 1,
        rationale: "Inspiratory squeaks are characteristic of small airway (bronchiolar) disease. They are brief, high-pitched sounds heard during inspiration, caused by the sudden opening of narrowed bronchioles during the inspiratory phase. They differ from wheezing (which is typically expiratory and prolonged) and crackles (which have a different acoustic quality). Inspiratory squeaks may be the earliest physical finding of bronchiolitis obliterans, appearing before significant spirometric changes are detectable."
      }
    ]
  },

  "brown-sequard-syndrome-rn": {
    title: "Brown-Sequard Syndrome",
    cellular: {
      title: "Neuropathology of Hemisection of the Spinal Cord",
      content: "Brown-Sequard syndrome (BSS) is a rare neurological condition caused by lateral hemisection (or damage predominantly affecting one lateral half) of the spinal cord, producing a characteristic pattern of ipsilateral motor and proprioceptive deficits with contralateral pain and temperature sensory loss. Understanding BSS requires knowledge of the anatomical organization of the major ascending and descending spinal cord tracts and, critically, WHERE each tract crosses (decussates) relative to the level of injury. The corticospinal tract (the primary motor pathway) descends from the motor cortex through the internal capsule, cerebral peduncles, and basis pontis, and the vast majority of fibers (approximately 85-90%) cross at the pyramidal decussation at the cervicomedullary junction to form the lateral corticospinal tract, which descends in the lateral funiculus of the spinal cord on the SAME side as the muscles it innervates. Therefore, damage to the lateral corticospinal tract on one side of the spinal cord produces IPSILATERAL upper motor neuron (UMN) paralysis or paresis BELOW the level of the lesion (characterized by spasticity, hyperreflexia, clonus, and positive Babinski sign -- though in the acute phase, spinal shock may produce flaccidity and areflexia that later transitions to the UMN pattern). The dorsal column-medial lemniscal (DCML) pathway carries proprioception (position sense), vibration sense, fine touch discrimination, and two-point discrimination. These sensory fibers enter the spinal cord through the dorsal root and ascend IPSILATERALLY in the dorsal columns (fasciculus gracilis for lower extremity fibers; fasciculus cuneatus for upper extremity fibers) all the way to the medulla, where they synapse in the gracile and cuneate nuclei. Second-order neurons then cross to the opposite side (decussation of the medial lemniscus) in the lower medulla and ascend as the medial lemniscus to the thalamus. Because these fibers ascend on the SAME side as their origin and do not cross until the medulla (well above any spinal cord lesion), damage to one side of the spinal cord produces IPSILATERAL loss of proprioception, vibration, and fine touch BELOW the level of the lesion. The spinothalamic tract (STT) carries pain and temperature sensation (and crude touch). First-order neurons enter the spinal cord through the dorsal root, synapse in the dorsal horn (substantia gelatinosa), and second-order neurons CROSS to the opposite side through the anterior white commissure within 1-2 spinal segments of entry. The crossed fibers then ascend in the lateral spinothalamic tract (for pain and temperature) and anterior spinothalamic tract (for crude touch) on the OPPOSITE side of the spinal cord from their origin. Because these fibers cross within 1-2 levels of entry, damage to one side of the spinal cord produces CONTRALATERAL loss of pain and temperature sensation beginning 1-2 segments BELOW the level of the lesion. This creates the classic Brown-Sequard pattern: on the SIDE of the lesion (ipsilateral), the patient has upper motor neuron paralysis (from lateral corticospinal tract damage), loss of proprioception and vibration (from dorsal column damage), and a narrow band of ipsilateral segmental lower motor neuron weakness and sensory loss at the level of the lesion (from damage to the nerve roots and anterior horn cells at that specific level). On the OPPOSITE side (contralateral), the patient has loss of pain and temperature sensation beginning 1-2 segments below the lesion level (from lateral spinothalamic tract damage), with PRESERVED motor function and proprioception. Pure BSS (complete hemisection) is rare; most patients present with an incomplete or partial Brown-Sequard pattern (Brown-Sequard plus syndrome) where the deficits are asymmetric but not perfectly lateralized. The most common cause of BSS is penetrating trauma (stab wounds and gunshot injuries), accounting for approximately 15-20% of all traumatic spinal cord injuries. Non-traumatic causes include spinal cord tumors (particularly extramedullary tumors such as meningiomas and schwannomas that compress one side of the cord), multiple sclerosis (demyelinating plaques may preferentially affect one lateral cord), spinal epidural hematoma or abscess compressing the cord unilaterally, cervical disc herniation with unilateral cord compression, spinal cord ischemia (anterior spinal artery branch territory), and radiation myelopathy. BSS has the best prognosis among incomplete spinal cord injury patterns: approximately 90% of patients recover ambulatory function, and the recovery of motor function on the ipsilateral side is typically good because the intact contralateral corticospinal tract can provide some redundancy through spinal interneuronal circuits. Nursing assessment must systematically evaluate motor function and reflexes on BOTH sides, perform dermatome-level sensory testing for light touch, proprioception, vibration, and pain/temperature on BOTH sides to identify the characteristic crossed pattern, monitor for respiratory compromise (particularly with cervical cord lesions affecting the phrenic nerve at C3-C5), assess for autonomic dysreflexia in injuries above T6, and implement measures to prevent complications of immobility (DVT prophylaxis, pressure injury prevention, bowel and bladder management)."
    },
    riskFactors: [
      "Penetrating trauma (stab wounds and gunshot injuries to the spine are the most common cause; any penetrating object can partially transect the spinal cord)",
      "Spinal cord tumors (extramedullary tumors such as meningiomas and schwannomas that compress one side of the cord; intramedullary tumors growing asymmetrically)",
      "Multiple sclerosis (demyelinating plaques may preferentially affect one lateral half of the cord, producing incomplete BSS pattern)",
      "Cervical disc herniation with unilateral cord compression (large posterolateral disc herniation compressing one side of the cervical cord)",
      "Spinal epidural hematoma or abscess (unilateral compression causing asymmetric cord damage)",
      "Spinal cord ischemia (anterior spinal artery branch occlusion may preferentially affect one side)",
      "Blunt spinal trauma (less common cause than penetrating trauma but can cause asymmetric cord injury, particularly with vertebral fracture-dislocation)"
    ],
    diagnostics: [
      "MRI of the spine (gold standard for visualizing spinal cord injury -- demonstrates cord edema, hemorrhage, compression from tumor/disc/hematoma, and extent of cord damage; essential for surgical planning)",
      "CT of the spine (evaluates bony structures -- fractures, dislocations, foreign bodies from penetrating trauma; CT angiography if vascular injury suspected)",
      "Detailed neurological examination with ASIA (American Spinal Injury Association) assessment: motor function grading on both sides, sensory testing for light touch AND pinprick in all dermatomes bilaterally, deep tendon reflexes, rectal examination for voluntary contraction and perianal sensation",
      "Plain radiographs of the spine (initial screening in trauma -- identify gross fractures and alignment abnormalities, but CT and MRI provide far superior detail)",
      "Somatosensory evoked potentials (SSEPs -- assess dorsal column integrity; delayed or absent potentials on the ipsilateral side confirm posterior column dysfunction)",
      "Cerebrospinal fluid analysis (if non-traumatic etiology suspected -- elevated protein in tumors, oligoclonal bands in MS, pleocytosis in infection/inflammation)",
      "CT myelography (if MRI contraindicated -- identifies cord compression from tumor, disc, or bony fragment)"
    ],
    management: [
      "Emergent surgical decompression when cord compression from tumor, hematoma, abscess, or disc herniation is identified (time-sensitive -- earlier decompression correlates with better neurological outcomes)",
      "Spinal stabilization for traumatic injuries (surgical fixation for unstable fractures; external immobilization with cervical collar for stable injuries; maintain spinal precautions until cleared)",
      "High-dose methylprednisolone for acute traumatic spinal cord injury (controversial and no longer universally recommended; if used, must be initiated within 8 hours of injury per NASCIS protocols)",
      "DVT prophylaxis (mechanical compression devices immediately, pharmacological prophylaxis with LMWH when hemorrhage risk is acceptable -- SCI patients have extremely high DVT risk of 40-80% without prophylaxis)",
      "Comprehensive rehabilitation program (physical therapy, occupational therapy, neuropsychology -- BSS has the best prognosis of incomplete SCI patterns with ~90% recovering ambulatory function)",
      "Neuropathic pain management (gabapentin, pregabalin for dysesthetic pain from spinothalamic tract damage)"
    ],
    nursingActions: [
      "Perform and document systematic bilateral neurological assessment using the ASIA impairment scale: test motor function (key muscle groups at each level, graded 0-5), sensory testing for light touch AND pin prick at every dermatome on BOTH sides to identify the characteristic crossed deficit pattern",
      "Maintain strict spinal precautions in trauma patients until spinal stability is confirmed: log-roll technique for repositioning, cervical collar if cervical injury, avoid flexion/extension/rotation of the spine",
      "Monitor respiratory function closely especially for cervical cord injuries (phrenic nerve C3-C5): respiratory rate, tidal volume, SpO2, ability to cough, use of accessory muscles -- C4 and above injuries may require mechanical ventilation",
      "Implement DVT prophylaxis per protocol: sequential compression devices on admission, transition to pharmacological prophylaxis (enoxaparin) when hemorrhagic risk permits; monitor for signs of DVT (unilateral leg swelling, calf tenderness) and PE (sudden dyspnea, tachycardia, pleuritic chest pain)",
      "Prevent pressure injuries: reposition every 2 hours with proper technique, pressure-relieving mattress, thorough skin assessment especially over bony prominences, maintain adequate nutrition for wound healing",
      "Manage neurogenic bladder (intermittent catheterization preferred over indwelling catheter to reduce infection risk; monitor for urinary retention, assess post-void residuals)",
      "Monitor for autonomic dysreflexia in injuries above T6: sudden severe hypertension (>20 mmHg above baseline), pounding headache, flushing and diaphoresis above the level of injury, bradycardia -- this is a medical emergency; sit patient upright, identify and remove the noxious stimulus (most commonly distended bladder or bowel impaction), and administer antihypertensive if BP remains critically elevated",
      "Provide psychosocial support and facilitate coping -- spinal cord injury is life-altering; educate about the relatively good prognosis of BSS compared to complete SCI and connect with rehabilitation resources and peer support"
    ],
    assessmentFindings: [
      "IPSILATERAL motor deficit: upper motor neuron paralysis or paresis below the level of the lesion (spasticity, hyperreflexia, positive Babinski in chronic phase; flaccidity in acute spinal shock phase)",
      "IPSILATERAL loss of proprioception and vibration sense below the lesion (patient cannot sense position of affected limbs with eyes closed; loss of vibration sense tested with tuning fork)",
      "CONTRALATERAL loss of pain and temperature sensation beginning 1-2 segments below the lesion level (patient cannot feel pinprick or temperature on the opposite side from the motor deficit)",
      "Ipsilateral segmental findings at the level of the lesion: lower motor neuron weakness (flaccidity, areflexia in the specific myotome), dermatomal sensory loss to all modalities at that level",
      "Preserved motor function on the CONTRALATERAL side (the hallmark that distinguishes BSS from complete SCI)",
      "Bladder dysfunction (neurogenic bladder from interruption of autonomic pathways -- urinary retention in acute phase, may transition to hyperreflexic bladder)",
      "Neuropathic pain in affected dermatomes (burning, tingling, or electric shock-like pain from damaged sensory pathways)"
    ],
    signs: {
      left: [
        "Mild ipsilateral weakness with preserved ambulation",
        "Partial sensory loss pattern (incomplete hemisection)",
        "Stable neurological examination without progression",
        "Adequate respiratory function (injury below C5)",
        "Intact autonomic function"
      ],
      right: [
        "Complete ipsilateral paralysis with respiratory compromise (high cervical lesion C3-C5)",
        "Autonomic dysreflexia (severe hypertension, bradycardia, flushing above lesion level -- medical emergency)",
        "Progressive cord compression with expanding neurological deficit",
        "Pulmonary embolism from DVT in paralyzed limbs",
        "Severe neuropathic pain syndrome refractory to standard therapy"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low molecular weight heparin (LMWH) for DVT prophylaxis",
        action: "Preferentially binds to antithrombin III (AT-III) and catalyzes its inhibition of factor Xa (anti-Xa to anti-IIa ratio of approximately 3.8:1), reducing thrombin generation and fibrin clot formation. The preferential anti-Xa activity over anti-IIa (thrombin) activity provides effective anticoagulation with a more predictable dose-response relationship and lower risk of heparin-induced thrombocytopenia (HIT) compared to unfractionated heparin. Essential for DVT prophylaxis in spinal cord injury patients, who have a DVT incidence of 40-80% without prophylaxis due to paralysis-induced venous stasis, endothelial injury, and hypercoagulability (Virchow triad).",
        sideEffects: "Bleeding (most common and most serious), injection site hematoma and pain, thrombocytopenia (HIT risk approximately 0.1-0.5%, lower than UFH), elevated hepatic transaminases, hyperkalemia (rare, from aldosterone suppression), osteoporosis with prolonged use",
        contra: "Active major bleeding; severe thrombocytopenia (<50,000) or known HIT; within 24 hours of spinal/epidural procedure (risk of spinal epidural hematoma); known hypersensitivity to heparin or pork products; severe renal impairment (CrCl <30 mL/min -- use UFH instead or reduce dose)",
        pearl: "DVT prophylaxis dose: 40 mg SC once daily or 30 mg SC twice daily (higher dose for SCI patients due to extreme thrombotic risk); initiate as soon as hemorrhagic risk allows (typically 24-72 hours post-injury for stable patients); continue for at least 8-12 weeks post-SCI (high-risk period for DVT); administer in the abdomen (alternate sides), at least 2 inches from the umbilicus; do NOT expel the air bubble from the prefilled syringe; monitor platelets every 2-3 days for the first 2 weeks for HIT surveillance; transition to oral anticoagulation (DOAC or warfarin) may be considered for prolonged prophylaxis"
      },
      {
        name: "Gabapentin (Neurontin)",
        type: "Anticonvulsant/neuromodulator for neuropathic pain",
        action: "Binds to the alpha-2-delta subunit of voltage-gated calcium channels in the dorsal horn of the spinal cord and in the brain, reducing calcium influx into presynaptic nerve terminals. This decreases the release of excitatory neurotransmitters (glutamate, substance P, calcitonin gene-related peptide/CGRP) from sensitized nociceptive neurons, dampening central sensitization and reducing the pathological pain signaling that characterizes neuropathic pain. In Brown-Sequard syndrome, neuropathic pain arises from damage to the spinothalamic tract and dorsal horn, producing burning, shooting, or electric shock-like pain in affected dermatomes.",
        sideEffects: "Sedation and somnolence (dose-dependent, often improves with continued use), dizziness, ataxia (problematic in SCI patients with pre-existing gait instability), peripheral edema, weight gain, cognitive effects (difficulty concentrating, memory impairment), suicidal ideation (FDA black box warning for all anticonvulsants)",
        contra: "Known hypersensitivity; dose adjustment required for renal impairment (gabapentin is 100% renally eliminated); abrupt discontinuation can cause withdrawal seizures -- taper over at least 1 week",
        pearl: "First-line agent for neuropathic pain in SCI; start low, go slow: initiate at 100-300 mg at bedtime, titrate by 100-300 mg every 3-7 days to effective dose (typical range 900-3600 mg/day divided TID); bedtime dosing capitalizes on sedative properties for improved sleep; onset of meaningful pain relief may take 2-4 weeks of titration; 100% renally cleared -- dose MUST be adjusted for renal function; warn patients about dizziness and sedation, especially during titration; do NOT abruptly discontinue (taper over minimum 1 week to prevent withdrawal seizures)"
      },
      {
        name: "Methylprednisolone (Solu-Medrol) for acute SCI",
        type: "Glucocorticoid (high-dose IV protocol for acute spinal cord injury)",
        action: "At the high doses used in acute SCI (30 mg/kg), methylprednisolone has both anti-inflammatory and neuroprotective effects: inhibits lipid peroxidation (free radical scavenging at high doses), reduces inflammatory mediator production, stabilizes cell membranes, decreases vasogenic edema, and inhibits inflammatory cell infiltration. These mechanisms may reduce secondary injury cascading that occurs in the hours and days following the primary mechanical insult to the spinal cord, potentially preserving neural tissue that would otherwise be lost to secondary ischemia, excitotoxicity, and inflammation.",
        sideEffects: "GI hemorrhage (significantly increased risk at SCI doses), hyperglycemia (steroid-induced, may require insulin), infection risk (particularly wound infections and pneumonia in SCI patients), insomnia, psychosis (steroid psychosis with high doses), avascular necrosis (with prolonged use), adrenal suppression, poor wound healing, myopathy",
        contra: "Penetrating spinal cord injury (no evidence of benefit, may increase infection risk); GI hemorrhage or active peptic ulcer disease; systemic fungal infection; presentation >8 hours after injury (NASCIS data showed no benefit beyond 8 hours); current AANS/CNS guidelines do NOT recommend routine use due to modest benefit versus significant adverse effect profile",
        pearl: "CONTROVERSIAL: the NASCIS trials showed modest neurological improvement with high-dose methylprednisolone (30 mg/kg IV bolus over 15 minutes, then 5.4 mg/kg/hour for 23 hours if started within 3 hours, or 47 hours if started 3-8 hours after injury), but subsequent analysis and systematic reviews have questioned the evidence quality; current AANS/CNS guidelines recommend AGAINST routine use; if used by the treating physician, nursing responsibilities include: initiating infusion within 8 hours of injury, monitoring for GI bleeding (guaiac all stools), monitoring blood glucose every 4-6 hours with insulin sliding scale, assessing for wound infection, and administering GI prophylaxis (PPI or H2 blocker)"
      }
    ],
    pearls: [
      "The hallmark of Brown-Sequard syndrome is the CROSSED deficit pattern: ipsilateral motor loss and proprioception/vibration loss (because corticospinal tract and dorsal columns ascend ipsilaterally) with contralateral pain and temperature loss (because spinothalamic fibers cross within 1-2 spinal segments of entry)",
      "BSS has the BEST prognosis of all incomplete spinal cord injury patterns -- approximately 90% of patients recover ambulatory function, primarily because the intact contralateral corticospinal tract provides motor innervation through spinal interneurons",
      "Pain and temperature loss on the contralateral side begins 1-2 segments BELOW the level of the lesion (not at the lesion level) because spinothalamic fibers ascend 1-2 segments before crossing through the anterior commissure -- this is a commonly tested distinction",
      "DVT prophylaxis is CRITICAL in SCI patients -- without prophylaxis, the DVT incidence is 40-80% due to paralysis-induced venous stasis, endothelial injury, and hypercoagulability; start mechanical prophylaxis immediately and pharmacological prophylaxis (LMWH) as soon as hemorrhagic risk allows",
      "Monitor for autonomic dysreflexia in injuries above T6: the most common trigger is bladder distension -- ensure regular bladder emptying via intermittent catheterization; if autonomic dysreflexia occurs (severe hypertension, headache, bradycardia, flushing above lesion), sit patient upright and identify/remove the noxious stimulus immediately",
      "In the acute spinal shock phase (first 24 hours to weeks after injury), all findings below the level of injury will appear flaccid (LMN pattern) with absent reflexes -- this does NOT represent a permanent LMN injury; as spinal shock resolves, the UMN pattern (spasticity, hyperreflexia, Babinski) emerges on the ipsilateral side",
      "Systematic bilateral neurological assessment is essential: test motor, light touch, pinprick, proprioception, and vibration on BOTH sides at EVERY dermatome level to accurately map the deficit pattern and determine if it follows the BSS distribution"
    ],
    quiz: [
      {
        question: "A patient with a stab wound to the right side of the spinal cord at T10 presents with right leg weakness and loss of vibration sense in the right leg, but can feel pinprick on the right leg. The left leg has normal strength but cannot feel pinprick or temperature. What syndrome does this represent?",
        options: [
          "Complete spinal cord transection at T10",
          "Anterior cord syndrome from anterior spinal artery occlusion",
          "Brown-Sequard syndrome (right-sided cord hemisection) at T10",
          "Central cord syndrome from hyperextension injury"
        ],
        correct: 2,
        rationale: "This is a classic Brown-Sequard syndrome presentation. Right-sided cord damage produces: ipsilateral (right) motor deficit and loss of vibration/proprioception (corticospinal tract and dorsal columns ascend on the same side), with contralateral (left) loss of pain and temperature (spinothalamic fibers have already crossed from the left side to the right cord before the lesion level). The preserved pinprick sensation on the right (ipsilateral side) confirms that the spinothalamic fibers from the RIGHT side, which have crossed to the LEFT cord, are intact because the LEFT cord is undamaged."
      },
      {
        question: "Which complication is the nurse's HIGHEST priority to prevent in a patient with acute Brown-Sequard syndrome from traumatic spinal cord injury?",
        options: [
          "Malnutrition from decreased appetite",
          "Deep vein thrombosis from paralysis-induced venous stasis",
          "Social isolation from hospitalization",
          "Constipation from decreased mobility"
        ],
        correct: 1,
        rationale: "Deep vein thrombosis (DVT) and pulmonary embolism (PE) are the most immediately life-threatening preventable complications in acute spinal cord injury. Without prophylaxis, the DVT incidence in SCI is 40-80% due to Virchow triad (venous stasis from paralysis, endothelial injury from the trauma, hypercoagulability from the inflammatory response). Mechanical compression devices should be initiated immediately, and pharmacological prophylaxis (enoxaparin) should begin as soon as hemorrhagic risk allows. While all the other options are valid concerns, DVT/PE poses the greatest threat to survival."
      },
      {
        question: "Why does contralateral loss of pain and temperature sensation begin 1-2 segments BELOW the level of the spinal cord lesion in Brown-Sequard syndrome?",
        options: [
          "Because pain fibers travel more slowly than motor fibers, creating a delay effect",
          "Because spinothalamic tract fibers ascend 1-2 spinal segments ipsilaterally in Lissauer's tract before crossing through the anterior commissure to the opposite side",
          "Because the spinothalamic tract begins at T2 and does not exist in the upper segments",
          "Because dermatomal mapping is inherently imprecise"
        ],
        correct: 1,
        rationale: "First-order pain and temperature neurons enter the spinal cord through the dorsal root and ascend 1-2 segments ipsilaterally in Lissauer's tract (dorsolateral fasciculus) before synapsing in the substantia gelatinosa. Second-order neurons then cross through the anterior white commissure to join the contralateral spinothalamic tract. Because the fibers ascend 1-2 segments before crossing, a hemisection lesion at a given level will not interrupt fibers that entered at that level (they haven't crossed yet at that point). The first fibers affected are those from 1-2 segments below the lesion, which have already crossed to the damaged side."
      }
    ]
  },

  "brucellosis-rn": {
    title: "Brucellosis",
    cellular: {
      title: "Pathogenesis of Brucella Infection and Clinical Manifestations",
      content: "Brucellosis is a zoonotic infection caused by gram-negative, facultative intracellular coccobacilli of the genus Brucella, transmitted to humans primarily through ingestion of unpasteurized dairy products, direct contact with infected animals or their tissues, or inhalation of aerosolized bacteria. It is one of the most common zoonotic infections worldwide, with an estimated 500,000 new cases annually, predominantly in the Mediterranean basin, Middle East, Central Asia, Latin America, and parts of Africa. The four species that commonly infect humans are Brucella melitensis (from goats and sheep -- most virulent and most common cause worldwide), Brucella abortus (from cattle), Brucella suis (from swine -- can be particularly aggressive), and Brucella canis (from dogs -- least common in humans). The pathogenesis of brucellosis begins with entry of Brucella organisms through mucosal surfaces (GI tract, respiratory tract, conjunctivae) or breaks in the skin. Brucella organisms are small (0.5-0.7 x 0.6-1.5 micrometers), facilitating penetration through mucosal surfaces. Once past the mucosal barrier, Brucella is phagocytosed by macrophages and dendritic cells, but rather than being destroyed within the phagolysosome (the normal fate of most ingested bacteria), Brucella has evolved sophisticated mechanisms to survive and replicate within the intracellular environment. The organisms inhibit phagosome-lysosome fusion (preventing exposure to lysosomal digestive enzymes), modulate the intracellular trafficking of the Brucella-containing vacuole (BCV) to establish a replicative niche derived from the endoplasmic reticulum, produce superoxide dismutase and catalase that neutralize the oxidative burst generated by the phagocyte, and suppress macrophage apoptosis to maintain the intracellular environment. This intracellular survival strategy is the central feature of Brucella pathogenesis and has critical therapeutic implications: effective antibiotics must achieve adequate intracellular concentrations (tetracyclines, aminoglycosides, and rifampin all penetrate cells effectively, while many beta-lactam antibiotics do not). Brucella-infected macrophages disseminate the organisms through the lymphatic and hematogenous routes to the reticuloendothelial system organs: liver, spleen, bone marrow, and lymph nodes. This dissemination produces the characteristic systemic infection with hepatosplenomegaly, lymphadenopathy, and bone marrow involvement. Brucella also has tropism for reproductive organs (causing epididymo-orchitis in men and spontaneous abortion in animals -- the name B. abortus reflects this property), the skeletal system (causing sacroiliitis, spondylitis, and peripheral arthritis), and the central nervous system (neurobrucellosis with meningitis or meningoencephalitis in 2-5% of cases). The immune response to Brucella involves both innate and adaptive immunity. Macrophages and dendritic cells present Brucella antigens to CD4+ T helper cells, which produce IFN-gamma to activate macrophages for enhanced intracellular killing (Th1 response). This cell-mediated immunity is the primary host defense mechanism against Brucella -- patients with impaired T cell function (HIV/AIDS, immunosuppressive therapy) are at increased risk for severe or disseminated disease. The humoral (antibody) response produces IgM antibodies first (detectable within 1-2 weeks of infection), followed by IgG (detectable after 2-4 weeks). These antibody responses are used for serological diagnosis using the serum agglutination test (SAT), but antibodies alone are insufficient for bacterial clearance because Brucella resides intracellularly, protected from antibody-mediated killing. The clinical presentation of brucellosis is remarkably protean, earning it the historical name 'the great imitator.' The classic presentation includes undulant fever (a pattern of cyclical fevers with temperatures peaking in the late afternoon/evening to 38.5-40C and returning to normal or near-normal in the morning, though this classic pattern is seen in fewer than 50% of patients), profuse diaphoresis (often described as malodorous, musty, or 'wet hay' smelling -- a distinctive feature), generalized myalgias and arthralgias, fatigue and malaise, hepatosplenomegaly, and lymphadenopathy. Complications include osteoarticular disease (most common complication, occurring in 20-40% of cases: sacroiliitis, spondylitis particularly affecting the lumbar spine, peripheral arthritis), epididymo-orchitis (in 2-20% of male patients), neurobrucellosis (meningitis, meningoencephalitis, cranial nerve palsies -- in 2-5%), endocarditis (in 1-2% but accounting for the majority of brucellosis-related deaths), and hepatic involvement (granulomatous hepatitis). Diagnosis requires a high index of clinical suspicion based on epidemiological exposure (travel to endemic areas, consumption of unpasteurized dairy, occupational exposure to animals). Blood cultures are the gold standard but have variable sensitivity (15-70%) depending on the species, stage of disease, and culture technique (extended incubation for at least 21 days is recommended). The standard agglutination test (SAT, also called Wright test or Brucella tube agglutination test) detects antibodies against Brucella lipopolysaccharide, with a titer of >=1:160 considered diagnostic in the appropriate clinical context. ELISA-based IgM and IgG assays provide more sensitive and specific serological diagnosis. Treatment requires prolonged combination antibiotic therapy because monotherapy has unacceptably high relapse rates (5-40%) due to Brucella's intracellular persistence. The WHO-recommended regimen for uncomplicated brucellosis is doxycycline 100 mg twice daily for 6 weeks PLUS streptomycin 1 g IM daily for 2-3 weeks (or gentamicin 5 mg/kg/day IV for 7-14 days as an alternative to streptomycin). An alternative oral regimen is doxycycline 100 mg twice daily PLUS rifampin 600-900 mg daily, both for 6 weeks, though this combination has a higher relapse rate than the doxycycline-streptomycin regimen. For neurobrucellosis or endocarditis, triple therapy (doxycycline + rifampin + aminoglycoside or TMP-SMX) for extended durations (3-6 months for neurobrucellosis, valve replacement plus 3+ months of antibiotics for endocarditis) is required."
    },
    riskFactors: [
      "Consumption of unpasteurized dairy products (raw milk, soft cheeses, butter -- the most common route of transmission in non-endemic countries; travelers to endemic regions are particularly at risk)",
      "Occupational exposure to infected animals (veterinarians, farmers, ranchers, abattoir workers, laboratory workers -- direct contact with animal blood, placenta, urine, or tissues during birthing or butchering)",
      "Travel to or residence in endemic regions (Mediterranean countries, Middle East, Central and South America, Central Asia, parts of Africa, India, Mexico)",
      "Laboratory exposure (Brucella is a leading cause of laboratory-acquired infections due to its high infectivity via aerosol -- can infect through inhalation of as few as 10-100 organisms)",
      "Hunting and processing wild animals (wild boar, elk, bison, caribou -- B. suis and other species in wildlife populations)",
      "Immunocompromised state (HIV/AIDS, immunosuppressive therapy -- impaired cell-mediated immunity increases risk of severe and disseminated disease)",
      "Inadequate food safety practices (consuming raw or undercooked meat from infected animals, using unpasteurized dairy in cooking)"
    ],
    diagnostics: [
      "Blood cultures (gold standard for definitive diagnosis but sensitivity varies 15-70%; extended incubation for at least 21 days is recommended as Brucella is a slow-growing organism; inform the laboratory of clinical suspicion to ensure extended incubation)",
      "Serum agglutination test (SAT/Wright test -- titer >=1:160 is considered diagnostic in appropriate clinical context; rising titers on paired sera 2-4 weeks apart strengthen the diagnosis)",
      "Brucella-specific IgM and IgG ELISA (more sensitive and specific than SAT; IgM elevates first in acute infection; persistent IgG elevation may indicate chronic or relapsing disease)",
      "Complete blood count (leukopenia or normal WBC count -- brucellosis typically does NOT cause leukocytosis, which is an important distinguishing feature; anemia and thrombocytopenia may occur from bone marrow involvement)",
      "Liver function tests (elevated transaminases and alkaline phosphatase from granulomatous hepatitis)",
      "Inflammatory markers (ESR and CRP elevated during active infection; useful for monitoring treatment response)",
      "Imaging studies as clinically indicated (MRI of the spine for spondylitis/sacroiliitis, echocardiography if endocarditis suspected, brain MRI for neurobrucellosis)"
    ],
    management: [
      "WHO-recommended first-line: doxycycline 100 mg PO BID for 6 weeks PLUS streptomycin 1 g IM daily for 2-3 weeks (or gentamicin 5 mg/kg/day IV for 7-14 days as aminoglycoside alternative)",
      "Alternative oral regimen: doxycycline 100 mg PO BID PLUS rifampin 600-900 mg PO daily, both for 6 weeks (slightly higher relapse rate than doxycycline-streptomycin but avoids injections)",
      "Neurobrucellosis and endocarditis: triple therapy (doxycycline + rifampin + aminoglycoside or TMP-SMX) for extended duration (3-6 months for neuro, 3+ months plus valve surgery for endocarditis)",
      "Pregnant women and children <8 years: TMP-SMX plus rifampin for 6 weeks (doxycycline is contraindicated due to teeth staining in children and teratogenicity)",
      "Monitoring for relapse: follow serology at 3, 6, and 12 months after treatment completion -- relapse occurs in 5-15% despite appropriate therapy, usually within the first year",
      "Report to public health authorities (brucellosis is a nationally notifiable disease requiring investigation of the source of exposure)"
    ],
    nursingActions: [
      "Obtain detailed epidemiological history: travel to endemic areas, consumption of unpasteurized dairy products, occupational animal exposure, laboratory work with Brucella -- this information is essential for clinical suspicion and diagnosis",
      "Collect blood cultures BEFORE initiating antibiotic therapy and label specimens with 'Brucella suspected' to alert the laboratory for extended incubation and biosafety precautions (Brucella is a BSL-3 organism)",
      "Administer antibiotics per protocol and emphasize the critical importance of completing the FULL 6-week course -- premature discontinuation significantly increases relapse risk (5-40% with monotherapy or incomplete courses)",
      "Monitor for aminoglycoside toxicity when streptomycin or gentamicin is used: ototoxicity (assess hearing, tinnitus, vertigo at baseline and during treatment), nephrotoxicity (monitor BUN, creatinine, urinalysis; maintain adequate hydration), and monitor drug trough levels",
      "Assess for treatment response: monitor temperature curve (fever typically resolves within 1-2 weeks of appropriate therapy), inflammatory markers (ESR/CRP should decline), and clinical symptoms",
      "Monitor for complications: assess joints for arthritis (sacroiliac tenderness, limited spine mobility), testicular examination if male with pain/swelling, neurological assessment for neurobrucellosis (headache, meningismus, cranial nerve deficits)",
      "Educate patients about food safety: avoid unpasteurized dairy products and raw/undercooked meats, especially when traveling to endemic regions",
      "Implement standard precautions during patient care (Brucella transmission from patient to healthcare worker is extremely rare but laboratory specimens require BSL-3 handling)"
    ],
    assessmentFindings: [
      "Undulant fever (cyclical pattern with afternoon/evening peaks to 38.5-40C and morning defervescence -- present in <50% of cases but highly suggestive when seen with other features)",
      "Profuse diaphoresis (often described as malodorous or musty-smelling -- distinctive feature of brucellosis)",
      "Hepatosplenomegaly (from reticuloendothelial system involvement; hepatomegaly in 30-60%, splenomegaly in 20-30%)",
      "Generalized myalgias and arthralgias (diffuse musculoskeletal pain -- the most common complaint, present in up to 70% of patients)",
      "Lymphadenopathy (generalized or regional, from lymphatic dissemination of infected macrophages)",
      "Osteoarticular involvement (sacroiliitis: low back/buttock pain, positive FABER test; spondylitis: focal spinal pain; peripheral arthritis: large joint involvement -- knee, hip, ankle)",
      "Normal or LOW white blood cell count (brucellosis typically does NOT cause leukocytosis -- this is an important distinguishing feature from many other bacterial infections)"
    ],
    signs: {
      left: [
        "Low-grade fever with mild fatigue and myalgias",
        "Normal WBC count with mildly elevated ESR",
        "Positive serology without end-organ complications",
        "Mild hepatomegaly without transaminase elevation",
        "Localized lymphadenopathy"
      ],
      right: [
        "Brucella endocarditis (valvular destruction, heart failure -- accounts for majority of brucellosis deaths)",
        "Neurobrucellosis (meningitis, meningoencephalitis, cranial nerve palsies)",
        "Paravertebral abscess from spondylitis requiring surgical drainage",
        "Severe pancytopenia from extensive bone marrow involvement",
        "Relapsing brucellosis despite apparently adequate treatment"
      ]
    },
    medications: [
      {
        name: "Doxycycline",
        type: "Tetracycline antibiotic (bacteriostatic at standard doses)",
        action: "Binds to the 30S ribosomal subunit, blocking the attachment of aminoacyl-tRNA to the ribosomal acceptor (A) site, thereby inhibiting bacterial protein synthesis. Critically, doxycycline achieves excellent intracellular concentrations (2-4 times higher inside cells than in extracellular fluid), enabling it to reach Brucella organisms within their intracellular replicative niche in macrophages. This intracellular penetration is the primary reason tetracyclines are the backbone of brucellosis treatment. Doxycycline also has anti-inflammatory properties that may contribute to clinical improvement.",
        sideEffects: "Photosensitivity (advise sun protection and avoidance of prolonged UV exposure), GI effects (nausea, esophagitis -- take with full glass of water, remain upright for 30 minutes after), vaginal candidiasis, tooth discoloration and enamel hypoplasia in children <8 years (permanent staining of developing teeth), hepatotoxicity (rare)",
        contra: "Pregnancy (Category D -- crosses placenta and may cause permanent tooth discoloration, enamel hypoplasia, and fetal bone growth inhibition); children <8 years (permanent tooth staining); known hypersensitivity to tetracyclines; severe hepatic impairment",
        pearl: "Cornerstone of ALL brucellosis treatment regimens: 100 mg PO twice daily for a MINIMUM of 6 weeks; must be combined with a second agent (aminoglycoside or rifampin) because monotherapy has relapse rates of 20-40%; take with full glass of water, sitting upright, and NOT with dairy products, antacids, or iron supplements (chelation reduces absorption by 50-90%); photosensitivity is clinically significant -- patients must use broad-spectrum sunscreen and protective clothing throughout the 6-week course; in pregnancy use TMP-SMX plus rifampin instead"
      },
      {
        name: "Streptomycin",
        type: "Aminoglycoside antibiotic (bactericidal)",
        action: "Binds irreversibly to the 16S rRNA component of the 30S ribosomal subunit, causing misreading of the genetic code during translation and producing aberrant, non-functional proteins that insert into and disrupt the bacterial cell membrane, leading to cell death. This bactericidal mechanism is critical in brucellosis because Brucella persists intracellularly where the host immune system has difficulty eliminating the organisms. The combination of doxycycline (bacteriostatic, excellent intracellular penetration) with streptomycin (bactericidal, enhances intracellular killing when concentrated in macrophage lysosomes) has the lowest relapse rate of any brucellosis treatment regimen.",
        sideEffects: "Ototoxicity (both vestibular and cochlear damage -- may be irreversible; risk increases with cumulative dose, prolonged therapy, renal impairment, and concurrent use of other ototoxic agents), nephrotoxicity (usually reversible acute tubular necrosis; monitor creatinine and BUN), neuromuscular blockade (rare but can potentiate neuromuscular blocking agents and exacerbate myasthenia gravis)",
        contra: "Known hypersensitivity to aminoglycosides; myasthenia gravis (neuromuscular blockade can precipitate crisis); pregnancy (FDA Category D -- aminoglycosides can cause fetal ototoxicity, particularly cranial nerve VIII damage); severe renal impairment (requires dose adjustment with drug level monitoring)",
        pearl: "WHO-recommended regimen: 1 g IM once daily for 2-3 weeks (first 2-3 weeks of the 6-week doxycycline course); gentamicin 5 mg/kg/day IV for 7-14 days is an acceptable alternative with similar efficacy and easier administration (IV vs IM); the doxycycline-streptomycin combination has the LOWEST relapse rate (<5%) of any brucellosis regimen; baseline hearing assessment (audiometry) before starting and periodic monitoring during treatment; monitor renal function (creatinine) every 2-3 days during treatment; ensure adequate hydration to minimize nephrotoxicity"
      },
      {
        name: "Rifampin (Rifadin)",
        type: "Rifamycin antibiotic (bactericidal)",
        action: "Inhibits bacterial DNA-dependent RNA polymerase by binding to the beta subunit, blocking RNA synthesis at the transcription initiation step. This mechanism is rapidly bactericidal and is effective against both extracellular and intracellular organisms. Rifampin achieves excellent intracellular concentrations and penetrates macrophages effectively, making it suitable for treating intracellular pathogens like Brucella. When combined with doxycycline, the dual intracellular-acting regimen targets Brucella within its macrophage niche from two different mechanistic angles.",
        sideEffects: "Orange-red discoloration of body fluids (urine, tears, sweat, saliva -- harmless but patients MUST be warned to prevent alarm; contact lenses may be permanently stained), hepatotoxicity (monitor liver function -- range from transient transaminase elevation to fulminant hepatitis), GI effects (nausea, vomiting, abdominal pain), flu-like syndrome (fever, chills, myalgia -- more common with intermittent dosing), thrombocytopenia, renal failure (rare), multiple drug interactions via CYP450 induction",
        contra: "Active hepatic disease or jaundice; concurrent use with HIV protease inhibitors (rifampin dramatically reduces their levels via CYP3A4 induction); known hypersensitivity; caution with concurrent hepatotoxic medications",
        pearl: "Alternative regimen: rifampin 600-900 mg daily for 6 weeks combined with doxycycline (all-oral regimen avoiding injections), but this has a slightly higher relapse rate (8-12%) compared to doxycycline-streptomycin (<5%); POTENT CYP450 inducer (CYP3A4, 2C9, 2C19) -- reduces levels of MANY drugs including warfarin, oral contraceptives (use backup contraception), cyclosporine, tacrolimus, methadone, benzodiazepines, statins, and many others; always perform comprehensive drug interaction review before starting; orange-red urine is expected and harmless -- WARN PATIENTS proactively to prevent unnecessary emergency visits; monitor LFTs at baseline and periodically during treatment"
      }
    ],
    pearls: [
      "Brucellosis requires COMBINATION antibiotic therapy for at least 6 weeks -- monotherapy or incomplete courses result in relapse rates of 20-40% due to Brucella's ability to persist intracellularly in macrophages where single agents cannot adequately eradicate the organism",
      "The doxycycline + streptomycin regimen has the LOWEST relapse rate (<5%) and is the WHO-recommended first-line treatment; doxycycline + rifampin is an all-oral alternative but has a higher relapse rate (8-12%)",
      "Brucellosis typically does NOT cause leukocytosis -- a normal or LOW white blood cell count in a febrile patient with travel or animal exposure history should raise suspicion for brucellosis (this distinguishes it from most other acute bacterial infections)",
      "Label blood culture specimens with 'Brucella suspected' to alert the laboratory for two critical reasons: (1) extended incubation is needed (21+ days for slow-growing organism) and (2) Brucella is a BSL-3 organism requiring enhanced biosafety precautions to prevent laboratory-acquired infection",
      "Brucella endocarditis, though occurring in only 1-2% of cases, accounts for the MAJORITY of brucellosis-related deaths -- any patient with brucellosis and a new heart murmur, unexplained heart failure, or persistent fever despite appropriate antibiotics should receive echocardiography",
      "Doxycycline must NOT be taken with dairy products, antacids, calcium, iron, or magnesium supplements -- chelation of the tetracycline by divalent and trivalent cations reduces oral absorption by 50-90%, potentially reducing drug levels below therapeutic concentrations",
      "Rifampin causes orange-red discoloration of ALL body fluids (urine, tears, sweat, saliva) -- ALWAYS warn patients proactively before the first dose to prevent unnecessary alarm and emergency visits; additionally, warn that rifampin will permanently stain soft contact lenses"
    ],
    quiz: [
      {
        question: "A patient returns from a trip to the Mediterranean with a 3-week history of undulant fever, profuse sweating, and diffuse myalgias. WBC count is 4,500/mcL (normal to low). Blood cultures are pending. Which exposure history finding is MOST important to elicit?",
        options: [
          "History of mosquito bites during travel",
          "Consumption of unpasteurized dairy products such as raw milk cheese",
          "Swimming in freshwater lakes or rivers",
          "Exposure to contaminated drinking water"
        ],
        correct: 1,
        rationale: "Consumption of unpasteurized dairy products is the most common route of Brucella transmission to humans in non-endemic settings. The combination of undulant fever pattern (cyclical fevers), profuse sweating, diffuse myalgias, travel to the Mediterranean (endemic region), and a normal/low WBC count (brucellosis typically does NOT cause leukocytosis) is classic for brucellosis. Mosquito bites suggest dengue or malaria; freshwater exposure suggests leptospirosis or schistosomiasis; contaminated water suggests typhoid fever or cholera."
      },
      {
        question: "A patient with confirmed brucellosis is prescribed doxycycline 100 mg BID plus streptomycin IM for 2 weeks. After 2 weeks of treatment, the patient's fever resolves and they feel much better. They ask if they can stop the doxycycline. What is the correct response?",
        options: [
          "Yes, since symptoms have resolved, the antibiotics can be discontinued",
          "No, doxycycline must be continued for the FULL 6-week course to prevent relapse -- premature discontinuation has relapse rates up to 40%",
          "Switch to a single daily dose of doxycycline for convenience",
          "Continue doxycycline for one more week only, for a total of 3 weeks"
        ],
        correct: 1,
        rationale: "Doxycycline must be continued for the FULL 6 weeks regardless of symptom improvement. Clinical improvement often occurs within 1-2 weeks, but Brucella organisms persist intracellularly in macrophages and are not eradicated by short courses of therapy. Premature discontinuation results in relapse rates of 20-40%. The 6-week minimum duration is essential to ensure adequate intracellular drug exposure to eliminate persistent organisms."
      },
      {
        question: "When collecting blood cultures from a patient with suspected brucellosis, which special instruction should the nurse communicate to the laboratory?",
        options: [
          "Process the culture as a stat specimen requiring results within 24 hours",
          "Label the specimen 'Brucella suspected' for extended incubation (21+ days) and enhanced biosafety precautions (BSL-3)",
          "Request that the culture be incubated anaerobically only",
          "Specify that the sample should be kept at room temperature, not incubated"
        ],
        correct: 1,
        rationale: "Labeling specimens with 'Brucella suspected' alerts the laboratory for two critical reasons: (1) Brucella is a slow-growing organism that may not be detected by standard 5-7 day culture protocols -- extended incubation for at least 21 days is recommended; and (2) Brucella is classified as a Biosafety Level 3 (BSL-3) organism because it is highly infectious via aerosol, making it a leading cause of laboratory-acquired infections. Enhanced biosafety precautions (biological safety cabinet, respiratory protection) are required when handling specimens suspected of containing Brucella."
      }
    ]
  },

  "budd-chiari-syndrome-rn": {
    title: "Budd-Chiari Syndrome",
    cellular: {
      title: "Pathophysiology of Hepatic Venous Outflow Obstruction",
      content: "Budd-Chiari syndrome (BCS) refers to hepatic venous outflow obstruction occurring anywhere from the small hepatic venules to the junction of the inferior vena cava (IVC) with the right atrium, excluding obstruction caused by cardiac disease or sinusoidal obstruction syndrome (formerly known as veno-occlusive disease). This obstruction impedes normal hepatic venous drainage, causing increased sinusoidal pressure, hepatic congestion, hepatocellular hypoxia and necrosis, and if unrelieved, progression to liver fibrosis, cirrhosis, and liver failure. The pathogenesis of BCS is fundamentally based on Virchow triad: the majority of cases (approximately 75-85%) are associated with an identifiable prothrombotic or hypercoagulable condition that predisposes to venous thrombosis. Myeloproliferative neoplasms (MPNs) are the most common underlying cause, identified in approximately 40-50% of BCS patients. Polycythemia vera (PV), essential thrombocythemia (ET), and primary myelofibrosis (PMF) all carry increased risk of hepatic vein thrombosis through multiple mechanisms: elevated blood cell counts increase blood viscosity, MPN-associated platelet activation promotes thrombus formation, and the JAK2 V617F mutation (present in >95% of PV and approximately 50-60% of ET and PMF) directly promotes thrombus formation by enhancing platelet adhesion and increasing expression of pro-thrombotic factors on endothelial cells. Importantly, BCS may be the FIRST manifestation of an underlying MPN, occurring before the blood count abnormalities become apparent -- therefore, JAK2 V617F mutation testing and bone marrow biopsy should be performed in ALL BCS patients regardless of blood counts. Other prothrombotic conditions associated with BCS include inherited thrombophilias (factor V Leiden mutation, prothrombin G20210A mutation, protein C/S/antithrombin deficiency), acquired thrombophilias (antiphospholipid syndrome -- the second most common identifiable cause after MPNs, paroxysmal nocturnal hemoglobinuria/PNH, oral contraceptive use, pregnancy), and local factors (tumors invading or compressing the hepatic veins or IVC, membranous obstruction of the IVC -- more common in Asian and African populations). In approximately 15-25% of BCS cases, no underlying cause can be identified (idiopathic), although many of these patients may have combinations of weak risk factors or as-yet-unidentified prothrombotic conditions. The pathophysiology of hepatic congestion from venous outflow obstruction is a cascade of progressive liver injury. When hepatic veins are occluded, blood cannot drain from the hepatic sinusoids, causing sinusoidal pressure to rise. Elevated sinusoidal pressure has three major consequences: (1) Hepatocellular hypoxia: congested blood in the sinusoids becomes deoxygenated, and the increased pressure impedes hepatic arterial inflow, reducing oxygen delivery to hepatocytes. Centrilobular (zone 3) hepatocytes are most vulnerable because they are furthest from the arterial blood supply and are normally exposed to the lowest oxygen tensions. Progressive hypoxia causes centrilobular hepatocyte necrosis, the histological hallmark of BCS. (2) Portal hypertension: as sinusoidal pressure rises and exceeds portal venous pressure, portal blood flow slows and may reverse (hepatofugal flow). This post-sinusoidal portal hypertension produces the same clinical manifestations as cirrhotic portal hypertension: ascites (the most common presenting symptom of BCS, present in >80% of patients), splenomegaly, and portosystemic collateral formation with risk of variceal hemorrhage. However, ascites in BCS tends to be disproportionately severe because the elevated sinusoidal pressure directly promotes transudation of fluid across the sinusoidal endothelium into the space of Disse and then through the liver capsule into the peritoneal cavity. Additionally, hepatic venous congestion impairs hepatic synthesis of albumin, reducing plasma oncotic pressure and further promoting ascites formation. (3) Hepatic ischemia and fibrosis: chronic congestion and recurrent ischemia activate hepatic stellate cells, which differentiate into myofibroblasts and deposit collagen in the perisinusoidal space, leading to progressive fibrosis and eventually congestive hepatic cirrhosis. The caudate lobe characteristically hypertrophies in BCS because it has independent venous drainage directly into the IVC through small caudate veins (not through the main hepatic veins), allowing it to receive preferential blood flow when the main hepatic veins are obstructed. Caudate lobe hypertrophy is a characteristic imaging finding and may itself compress the IVC, worsening venous outflow obstruction. BCS presents along a clinical spectrum from fulminant (acute liver failure developing over days with hepatic encephalopathy, coagulopathy, and multiorgan failure), to acute (rapid onset of abdominal pain, ascites, and hepatomegaly developing over weeks), to subacute/chronic (insidious development of ascites, hepatomegaly, and progressive liver dysfunction over months, with development of portosystemic collaterals). Some patients are discovered incidentally on imaging. The fulminant form carries the highest mortality and may require emergent liver transplantation. Treatment follows a stepwise algorithmic approach: (1) all patients receive lifelong anticoagulation (unless contraindicated) to prevent thrombus propagation and new thrombosis; (2) treatment of the underlying prothrombotic condition; (3) medical management of portal hypertension and ascites; (4) angioplasty and stenting of focal venous stenosis; (5) transjugular intrahepatic portosystemic shunt (TIPS) for patients who fail medical therapy; and (6) liver transplantation for patients who fail all previous interventions or present with fulminant liver failure."
    },
    riskFactors: [
      "Myeloproliferative neoplasms (most common cause, found in 40-50% of BCS patients -- polycythemia vera, essential thrombocythemia, primary myelofibrosis; JAK2 V617F mutation testing is essential)",
      "Antiphospholipid syndrome (second most common identifiable cause; lupus anticoagulant and anticardiolipin antibodies promote venous thrombosis)",
      "Inherited thrombophilias (factor V Leiden, prothrombin G20210A, protein C/S/antithrombin deficiency -- often coexist with other risk factors)",
      "Oral contraceptive use and pregnancy (hormonal thrombotic risk that may interact with underlying thrombophilia to precipitate BCS)",
      "Paroxysmal nocturnal hemoglobinuria (PNH -- GPI-anchored protein deficiency on blood cells causes complement-mediated hemolysis and thrombosis at unusual sites including hepatic veins)",
      "Behcet disease (systemic vasculitis with predilection for venous thrombosis including hepatic veins and IVC)",
      "Membranous obstruction of the IVC (more common in Asian and African populations; may be congenital or acquired from organized thrombus)"
    ],
    diagnostics: [
      "Doppler ultrasonography of the hepatic veins and IVC (first-line imaging -- demonstrates absence of hepatic vein flow, reversed flow, or thrombosis; shows caudate lobe hypertrophy; sensitivity 75-85%)",
      "CT abdomen with IV contrast (hepatic vein thrombosis, heterogeneous liver enhancement pattern with central enhancement and peripheral decreased enhancement reflecting congestion, caudate lobe hypertrophy, ascites, collateral vessels)",
      "MRI/MRA (hepatic vein and IVC patency assessment without radiation; flip-flop enhancement pattern; useful for treatment planning)",
      "Hepatic venography (invasive but definitive -- demonstrates hepatic vein obstruction, spider-web pattern of intrahepatic collaterals, and IVC patency; also measures venous pressure gradient and allows intervention)",
      "JAK2 V617F mutation testing (MANDATORY in all BCS patients regardless of blood counts -- MPN may be occult at presentation)",
      "Comprehensive thrombophilia workup (factor V Leiden, prothrombin mutation, protein C/S, antithrombin, lupus anticoagulant, anticardiolipin antibodies, PNH flow cytometry, beta-2 glycoprotein I)",
      "Liver biopsy (centrilobular congestion and necrosis, sinusoidal dilation, perisinusoidal fibrosis -- confirms diagnosis when imaging is equivocal; done via transjugular approach if coagulopathic)"
    ],
    management: [
      "Lifelong anticoagulation with heparin bridge to warfarin (target INR 2-3) or DOAC -- prevents thrombus propagation and new thrombosis; indicated for ALL BCS patients unless contraindicated",
      "Treatment of underlying prothrombotic condition (cytoreductive therapy for MPN, anticoagulation adjustment for antiphospholipid syndrome, eculizumab for PNH)",
      "Medical management of ascites and portal hypertension (sodium restriction, diuretics -- spironolactone and furosemide, therapeutic paracentesis for tense ascites)",
      "Angioplasty with or without stenting for focal hepatic vein or IVC stenosis/short-segment obstruction (minimally invasive, effective for amenable anatomy)",
      "TIPS (transjugular intrahepatic portosystemic shunt) for patients failing medical therapy (decompresses portal hypertension by creating a direct portocaval shunt; may serve as a bridge to transplantation)",
      "Liver transplantation for fulminant BCS with acute liver failure, or chronic BCS failing all other interventions (lifelong anticoagulation required post-transplant given underlying thrombophilia)"
    ],
    nursingActions: [
      "Assess abdominal girth daily (use consistent measurement technique at the level of the umbilicus with patient supine) and monitor weight to track ascites accumulation or response to diuretic therapy",
      "Monitor for signs of hepatic decompensation: jaundice progression, coagulopathy (bleeding, bruising), hepatic encephalopathy (assess mental status, asterixis, orientation using standardized tools like the West Haven criteria)",
      "Administer anticoagulation per protocol and monitor closely: for heparin (aPTT every 6 hours until therapeutic, then daily; assess for HIT if platelet count drops); for warfarin (INR target 2-3; assess for bleeding); for DOACs (assess renal function, medication interactions)",
      "Implement ascites management: enforce sodium restriction (<2g/day), administer diuretics (spironolactone/furosemide), monitor electrolytes (hypokalemia from furosemide, hyperkalemia from spironolactone), assess for spontaneous bacterial peritonitis (abdominal pain, fever, altered mental status in patient with ascites)",
      "Prepare patients for interventional procedures (paracentesis, angioplasty/stenting, TIPS): informed consent, pre-procedure labs (CBC, coagulation studies, metabolic panel), IV access, post-procedure vital signs and assessment",
      "Monitor for post-TIPS complications: hepatic encephalopathy (occurs in 20-30% of TIPS patients due to portosystemic shunting; assess mental status frequently), shunt stenosis or thrombosis (recurrence of ascites), and infection",
      "Educate patients about lifelong anticoagulation: medication adherence, dietary consistency (vitamin K intake for warfarin patients), signs of bleeding requiring medical attention, drug interactions, and importance of regular INR monitoring",
      "Assess for complications of the underlying MPN if applicable: monitor blood counts, assess for splenomegaly, educate about symptoms requiring urgent evaluation (severe headache, chest pain, leg swelling suggesting new thrombosis)"
    ],
    assessmentFindings: [
      "Ascites (most common presenting symptom, present in >80% of patients; often disproportionately severe and refractory to standard diuretic therapy)",
      "Hepatomegaly (tender, often with smooth surface in acute BCS; may be nodular in chronic BCS with fibrosis)",
      "Abdominal pain (right upper quadrant or epigastric pain from hepatic capsular distension; may be acute and severe in acute BCS)",
      "Caudate lobe hypertrophy (may be palpable as a firm mass in the epigastrium; characteristic imaging finding)",
      "Jaundice (variable; may be absent in chronic compensated BCS or prominent in acute/fulminant forms)",
      "Signs of portal hypertension (splenomegaly, caput medusae, esophageal varices seen on endoscopy)",
      "Lower extremity edema and IVC obstruction signs (if thrombus extends into or involves the IVC -- dilated abdominal wall collateral veins, bilateral leg edema)"
    ],
    signs: {
      left: [
        "Mild ascites responsive to diuretics",
        "Stable hepatic function with minimal jaundice",
        "Incidental finding on imaging without symptoms",
        "Single hepatic vein involvement with adequate collateral drainage",
        "Compensated chronic BCS with established collaterals"
      ],
      right: [
        "Fulminant hepatic failure (encephalopathy, coagulopathy, multiorgan dysfunction)",
        "Massive refractory ascites requiring frequent paracentesis",
        "Variceal hemorrhage from portal hypertension",
        "Hepatorenal syndrome from severe hepatic congestion",
        "Progressive liver failure requiring emergent liver transplantation"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K antagonist (oral anticoagulant)",
        action: "Inhibits vitamin K epoxide reductase (VKORC1), the enzyme that recycles oxidized vitamin K back to its reduced (active) form. This blocks the post-translational gamma-carboxylation of vitamin K-dependent clotting factors (II, VII, IX, X) and anticoagulant proteins C and S, producing functional coagulation factor deficiency. In BCS, lifelong anticoagulation prevents thrombus propagation in the hepatic veins and IVC and reduces the risk of new thrombotic events at other sites in patients with underlying prothrombotic conditions. Warfarin requires careful dose titration guided by INR monitoring.",
        sideEffects: "Bleeding (most significant -- ranges from minor bruising to life-threatening hemorrhage; risk increases with supratherapeutic INR >4, concurrent antiplatelet agents, hepatic impairment, advanced age), skin necrosis (rare, occurs in first days of therapy in protein C-deficient patients -- transient hypercoagulable state before factors II, IX, X are depleted), purple toe syndrome (rare cholesterol microembolization), teratogenicity (FDA Category X -- contraindicated in pregnancy, causes warfarin embryopathy with nasal hypoplasia and stippled epiphyses)",
        contra: "Pregnancy (teratogenic -- absolute contraindication; use LMWH instead); active clinically significant bleeding; severe hepatic impairment with baseline coagulopathy (INR already elevated); non-adherent patients unable to monitor INR regularly; history of warfarin-induced skin necrosis",
        pearl: "Target INR 2-3 for BCS with standard thrombophilia; some experts recommend higher targets (INR 2.5-3.5) for antiphospholipid syndrome; bridge with heparin or LMWH until INR is therapeutic for 2+ consecutive days AND at least 5 days of warfarin overlap (to ensure all vitamin K-dependent factors are depleted); warfarin is significantly affected by hepatic function -- BCS patients with hepatic impairment may have unpredictable warfarin metabolism requiring more frequent INR monitoring; multiple drug interactions (CYP2C9 and VKORC1 inhibitors/inducers) and dietary vitamin K content affect dosing; DOACs are increasingly used as alternatives but evidence specifically in BCS is limited"
      },
      {
        name: "Spironolactone (Aldactone)",
        type: "Potassium-sparing diuretic (aldosterone receptor antagonist)",
        action: "Competitively antagonizes mineralocorticoid (aldosterone) receptors in the distal convoluted tubule and collecting duct, blocking aldosterone-mediated sodium reabsorption and potassium secretion. This produces natriuresis (sodium excretion) and diuresis while preserving potassium. In BCS-related ascites, aldosterone levels are markedly elevated due to activation of the renin-angiotensin-aldosterone system (RAAS) from effective arterial blood volume depletion (hepatic congestion reduces cardiac preload and triggers compensatory RAAS activation). Spironolactone is the first-line diuretic for hepatic ascites because it directly counteracts this hyperaldosteronism.",
        sideEffects: "Hyperkalemia (most clinically significant -- monitor potassium closely, especially with concurrent ACE inhibitors, ARBs, or renal impairment), gynecomastia and breast tenderness in males (anti-androgenic effect from cross-reactivity with androgen receptors), menstrual irregularities in women, GI upset (nausea, diarrhea), metabolic acidosis (reduced renal H+ secretion)",
        contra: "Hyperkalemia (K+ >5.5 mEq/L); severe renal impairment (eGFR <30 mL/min); Addison disease; concurrent use of other potassium-sparing diuretics or potassium supplements without careful monitoring",
        pearl: "First-line diuretic for hepatic ascites: start at 100 mg daily, may increase to 400 mg daily as needed; typically used in combination with furosemide in a 100:40 mg ratio (100 mg spironolactone : 40 mg furosemide) to maintain potassium balance; onset of action is slow (3-5 days) because it works by blocking aldosterone gene transcription effects, not by direct tubular action; monitor electrolytes (K+, Na+, creatinine) within 1 week of initiation and with each dose change; target weight loss of 0.5 kg/day in patients without peripheral edema, 1 kg/day in patients with edema; gynecomastia occurs in up to 10% of males and may require switching to eplerenone (more selective aldosterone antagonist with less anti-androgenic effect)"
      },
      {
        name: "Enoxaparin (Lovenox) for BCS anticoagulation bridge",
        type: "Low molecular weight heparin (LMWH)",
        action: "Binds to and potentiates antithrombin III (AT-III), catalyzing its inhibition of factor Xa (primarily) and thrombin (factor IIa) to a lesser extent. The anti-Xa:anti-IIa ratio of approximately 3.8:1 provides effective anticoagulation with a more predictable dose-response than unfractionated heparin. In BCS, LMWH is used as initial anticoagulation to halt thrombus propagation in the hepatic veins and as a bridge to warfarin. Also used as the preferred anticoagulant in pregnant patients with BCS (warfarin is teratogenic).",
        sideEffects: "Bleeding (most common and serious -- monitor for overt and occult bleeding), injection site hematoma, HIT (risk approximately 0.1-0.5%, lower than UFH), osteoporosis with prolonged use (relevant in BCS where anticoagulation is lifelong), hyperkalemia (rare, from aldosterone suppression), elevated transaminases",
        contra: "Active major bleeding; severe thrombocytopenia or known HIT; severe renal impairment (CrCl <30 mL/min -- consider unfractionated heparin instead or dose-reduce with anti-Xa monitoring); within 24 hours of spinal/epidural anesthesia",
        pearl: "Therapeutic dose for BCS: 1 mg/kg SC every 12 hours (treatment dose, not prophylactic dose); used as initial anticoagulation while warfarin is being initiated; continue LMWH for at least 5 days AND until INR is 2-3 for 2 consecutive days; preferred over unfractionated heparin for most BCS patients due to more predictable pharmacokinetics and lower HIT risk; LMWH is the anticoagulant of choice throughout pregnancy in BCS patients (warfarin is contraindicated in pregnancy); monitor anti-Xa levels if renal impairment, extremes of body weight, or prolonged therapy; store prefilled syringes at room temperature; rotate injection sites on abdomen"
      }
    ],
    pearls: [
      "ALL patients with Budd-Chiari syndrome must be tested for JAK2 V617F mutation regardless of blood counts -- myeloproliferative neoplasms are the most common cause (40-50%) and BCS may be the FIRST manifestation before blood count abnormalities develop",
      "Ascites in BCS is often disproportionately severe and refractory to diuretics because it results from BOTH elevated sinusoidal pressure (direct transudation) AND impaired hepatic albumin synthesis (reduced oncotic pressure) -- patients frequently require therapeutic paracentesis",
      "Caudate lobe hypertrophy is a characteristic finding in BCS because the caudate lobe has independent venous drainage directly into the IVC through small caudate veins, allowing it to receive preferential blood flow when the main hepatic veins are obstructed",
      "Treatment follows a stepwise algorithm: (1) anticoagulation for ALL patients, (2) treat underlying cause, (3) medical management of ascites/portal hypertension, (4) angioplasty/stenting for focal stenosis, (5) TIPS for medical failure, (6) liver transplantation as last resort",
      "Lifelong anticoagulation is required in BCS because the underlying prothrombotic condition (MPN, thrombophilia, antiphospholipid syndrome) persists -- discontinuing anticoagulation risks new thrombotic events in the hepatic veins, IVC, or other sites",
      "Monitor abdominal girth daily at the umbilicus with the patient supine -- this is a more reliable indicator of ascites change than weight alone because weight may be affected by nutritional status, edema redistribution, and fluid intake/output variations",
      "Spironolactone is the first-line diuretic for BCS-related ascites because secondary hyperaldosteronism from RAAS activation drives sodium and water retention -- the typical starting ratio is spironolactone 100 mg : furosemide 40 mg, titrated upward together to maintain potassium balance"
    ],
    quiz: [
      {
        question: "A 32-year-old woman presents with acute onset right upper quadrant pain, rapid ascites accumulation, and hepatomegaly. Doppler ultrasound shows hepatic vein thrombosis. Which diagnostic test is ESSENTIAL regardless of her current blood count values?",
        options: [
          "Hepatitis B and C serologies",
          "JAK2 V617F mutation testing to screen for occult myeloproliferative neoplasm",
          "Anti-mitochondrial antibodies for primary biliary cholangitis",
          "Alpha-fetoprotein for hepatocellular carcinoma screening"
        ],
        correct: 1,
        rationale: "JAK2 V617F mutation testing is ESSENTIAL in ALL Budd-Chiari syndrome patients regardless of blood counts. Myeloproliferative neoplasms are the most common cause of BCS (40-50%), and critically, BCS may be the FIRST manifestation of an MPN before blood count abnormalities become apparent. The JAK2 V617F mutation is present in >95% of polycythemia vera and approximately 50-60% of essential thrombocythemia and primary myelofibrosis. A positive result identifies the underlying cause and guides specific treatment."
      },
      {
        question: "A patient with Budd-Chiari syndrome is on spironolactone and furosemide for ascites management. The nurse notes the patient's potassium level is 5.8 mEq/L. What is the priority action?",
        options: [
          "Continue current medications and recheck potassium in 1 week",
          "Hold spironolactone, notify the prescriber, and implement hyperkalemia protocols -- potassium >5.5 is potentially life-threatening",
          "Increase the furosemide dose to compensate for the elevated potassium",
          "Administer oral potassium supplements to maintain electrolyte balance"
        ],
        correct: 1,
        rationale: "Potassium of 5.8 mEq/L represents clinically significant hyperkalemia that requires immediate intervention. Spironolactone, as a potassium-sparing diuretic, is the likely cause and must be held. Hyperkalemia above 5.5 mEq/L can cause life-threatening cardiac arrhythmias (peaked T waves, widened QRS, ultimately cardiac arrest). The nurse should hold spironolactone, obtain a STAT ECG to assess for cardiac effects, notify the prescriber, and implement hyperkalemia management per institutional protocol (cardiac monitoring, calcium gluconate for cardiac membrane stabilization if ECG changes present, insulin/glucose, and/or sodium polystyrene sulfonate)."
      },
      {
        question: "Why does the caudate lobe of the liver characteristically enlarge (hypertrophy) in Budd-Chiari syndrome?",
        options: [
          "Because the caudate lobe is the site of maximal hepatic congestion and inflammation",
          "Because the caudate lobe has independent venous drainage directly into the IVC, receiving preferential blood flow when the main hepatic veins are obstructed",
          "Because tumor growth in the caudate lobe is the most common cause of BCS",
          "Because the caudate lobe produces excess albumin to compensate for liver damage"
        ],
        correct: 1,
        rationale: "The caudate lobe has a unique anatomical feature: it drains directly into the IVC through small caudate veins that are independent of the three main hepatic veins (right, middle, left). When the main hepatic veins are obstructed in BCS, the caudate lobe maintains its venous drainage and actually receives increased portal blood flow (compensatory shunting), causing it to hypertrophy. This caudate lobe hypertrophy is a characteristic radiological finding of BCS on CT and MRI. Paradoxically, the hypertrophied caudate lobe can itself compress the IVC, worsening the venous outflow obstruction."
      }
    ]
  }
};

let ok = 0, fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++; else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} failed`);
