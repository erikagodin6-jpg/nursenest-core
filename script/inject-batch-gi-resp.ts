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
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "achalasia-rpn": {
    title: "Achalasia for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Achalasia",
      content: "Achalasia is a primary esophageal motility disorder characterized by the failure of the lower esophageal sphincter (LES) to relax during swallowing and the absence of normal peristalsis in the esophageal body. The condition results from progressive degeneration and loss of inhibitory ganglion cells within the myenteric (Auerbach) plexus of the esophageal wall. These ganglion cells normally release nitric oxide and vasoactive intestinal peptide (VIP), which are the primary neurotransmitters responsible for LES relaxation. When these neurons are destroyed, the LES remains in a state of sustained contraction, creating a functional obstruction at the gastroesophageal junction.\n\nThe esophagus is a muscular tube approximately 25 centimeters long that connects the pharynx to the stomach. It consists of an outer longitudinal muscle layer and an inner circular muscle layer. The upper third contains striated muscle under voluntary control, the middle third contains a mixture of striated and smooth muscle, and the lower third is entirely smooth muscle. The LES is a 3-4 centimeter zone of tonically contracted smooth muscle at the distal esophagus that normally maintains a resting pressure of 15-25 mmHg to prevent gastric reflux. During normal swallowing, a coordinated peristaltic wave propels the food bolus distally while the LES simultaneously relaxes to allow passage into the stomach. This coordination requires intact neural pathways through the vagus nerve and the myenteric plexus.\n\nIn achalasia, the pathological process involves inflammation and fibrosis of the myenteric plexus with selective loss of inhibitory neurons. The excitatory cholinergic neurons are relatively preserved, creating an imbalance that results in unopposed LES contraction. The exact cause of ganglion cell destruction remains unclear, but autoimmune mechanisms are strongly suspected, with evidence suggesting that a viral trigger may initiate an immune-mediated inflammatory response against myenteric neurons in genetically susceptible individuals. Chagas disease, caused by Trypanosoma cruzi infection endemic to Central and South America, can produce an identical clinical picture through direct parasitic destruction of myenteric plexus neurons.\n\nAs the disease progresses, the esophageal body loses its ability to generate coordinated peristaltic contractions. Food and liquid accumulate in the esophagus proximal to the non-relaxing LES, causing progressive esophageal dilation. Over time, the esophagus can become massively dilated (megaesophagus), sometimes holding more than one liter of retained material. This retained material creates a reservoir that increases the risk of aspiration pneumonia, particularly when the patient is in a supine position. The stagnant food column also provides an environment for bacterial overgrowth and fermentation, which can cause foul-smelling regurgitation and halitosis.\n\nAchalasia is classified into three subtypes based on high-resolution manometry findings. Type I (classic achalasia) shows absent peristalsis with minimal pressurization of the esophageal body. Type II shows pan-esophageal pressurization with simultaneous contractions, and this subtype has the best treatment response. Type III (spastic achalasia) shows premature or spastic contractions and has the poorest treatment response. This classification guides treatment selection and helps predict outcomes.\n\nDiagnosis involves a combination of clinical history, barium swallow, esophagogastroduodenoscopy (EGD), and high-resolution esophageal manometry. The barium swallow classically reveals a dilated esophagus with a smooth, tapered narrowing at the gastroesophageal junction described as a bird-beak or rat-tail appearance. EGD is essential to rule out pseudoachalasia, a condition where a tumor at the gastroesophageal junction mimics achalasia by mechanically obstructing the LES. High-resolution manometry is the gold standard diagnostic test, demonstrating incomplete LES relaxation (integrated relaxation pressure greater than 15 mmHg) and absent normal peristalsis.\n\nThe practical nurse plays a critical role in monitoring patients with achalasia for nutritional status, aspiration risk, and medication effectiveness. Because there is no treatment that can restore the lost ganglion cells, all therapies aim to reduce LES pressure to facilitate esophageal emptying by gravity. Medical management includes smooth muscle relaxants administered before meals. Definitive treatment options include pneumatic balloon dilation, Heller myotomy (surgical division of the LES muscle fibers), and peroral endoscopic myotomy (POEM). Post-procedural nursing care focuses on monitoring for perforation, managing pain, and advancing the diet gradually from clear liquids to soft foods."
    },
    riskFactors: [
      "Age between 25 and 60 years (bimodal distribution with peaks in young and middle-aged adults)",
      "Autoimmune conditions (association with autoimmune thyroiditis, type 1 diabetes, and other autoimmune disorders)",
      "Chagas disease (Trypanosoma cruzi infection endemic to Central and South America destroys myenteric neurons)",
      "Family history of achalasia (rare familial clustering suggests genetic susceptibility in some cases)",
      "Allgrove syndrome (triple A syndrome: achalasia, alacrima, adrenal insufficiency -- rare autosomal recessive condition)",
      "Viral infections (possible trigger for autoimmune destruction of myenteric plexus neurons)",
      "History of esophageal surgery or radiation therapy (secondary causes of LES dysfunction)"
    ],
    diagnostics: [
      "Barium swallow: reveals dilated esophagus with smooth tapered narrowing at the gastroesophageal junction (bird-beak sign); retained barium column above the LES; air-fluid level in the upright position",
      "High-resolution esophageal manometry: gold standard diagnostic test; demonstrates incomplete LES relaxation (integrated relaxation pressure greater than 15 mmHg) and absent normal peristalsis in the esophageal body",
      "Esophagogastroduodenoscopy (EGD): essential to exclude pseudoachalasia caused by malignancy at the gastroesophageal junction; may show dilated esophagus with retained food and tight LES that pops open with gentle pressure",
      "Chest X-ray: may show widened mediastinum from dilated esophagus, absent gastric air bubble, and occasionally an air-fluid level in the esophagus",
      "Timed barium esophagram: quantifies esophageal emptying by measuring barium column height at 1, 2, and 5 minutes; useful for assessing treatment response",
      "CT scan of chest and abdomen: ordered when pseudoachalasia is suspected to evaluate for tumors at the gastroesophageal junction or mediastinal lymphadenopathy"
    ],
    management: [
      "Elevate head of bed 30-45 degrees during and after meals to facilitate gravity-assisted esophageal emptying and reduce aspiration risk",
      "Administer smooth muscle relaxants (nifedipine or isosorbide dinitrate) 15-30 minutes before meals as prescribed to reduce LES pressure",
      "Provide small, frequent meals of soft, moist consistency; instruct patient to eat slowly, chew thoroughly, and drink fluids with meals to assist bolus transit",
      "Monitor nutritional status including daily weight, serum albumin, and calorie counts; refer to dietitian for individualized meal planning",
      "Prepare patient for pneumatic balloon dilation or Heller myotomy as scheduled; provide pre-procedural education about the procedure, recovery, and potential complications",
      "Post-procedure monitoring: assess for chest pain, subcutaneous emphysema, fever, or tachycardia that may indicate esophageal perforation",
      "Maintain NPO status post-procedure as ordered; advance diet gradually from clear liquids to full liquids to soft foods over several days per protocol"
    ],
    nursingActions: [
      "Assess swallowing function and document the type and consistency of foods and liquids the patient can tolerate versus those causing difficulty",
      "Monitor for signs of aspiration: auscultate lung sounds before and after meals, report new crackles, cough during eating, or wet vocal quality",
      "Administer sublingual nifedipine or isosorbide dinitrate 15-30 minutes before meals as prescribed; monitor blood pressure before and after administration",
      "Weigh patient daily at the same time with the same scale and clothing; report weight loss greater than 2% in one week",
      "Position patient upright (at least 45 degrees) during meals and for 2-3 hours after eating; avoid supine positioning immediately after meals",
      "Educate patient to avoid eating within 3 hours of bedtime to reduce overnight regurgitation and aspiration risk",
      "Report any new-onset chest pain, fever, subcutaneous crepitus, or sudden inability to swallow (may indicate perforation or food impaction)"
    ],
    assessmentFindings: [
      "Progressive dysphagia to BOTH solids AND liquids simultaneously (distinguishes achalasia from mechanical obstruction which typically affects solids first)",
      "Regurgitation of undigested food and saliva, often hours after eating; food has not been exposed to gastric acid so there is no sour or acidic taste",
      "Substernal chest pain or pressure, often mistaken for cardiac pain; may be exacerbated by eating or emotional stress",
      "Unintentional weight loss due to reduced caloric intake from swallowing difficulty and food avoidance",
      "Nocturnal coughing and aspiration symptoms from regurgitation of retained esophageal contents in the supine position",
      "Halitosis (bad breath) from bacterial fermentation of food stagnating in the dilated esophagus",
      "Hiccups related to esophageal distension and vagal nerve irritation"
    ],
    signs: {
      left: [
        "Difficulty swallowing solids and liquids equally",
        "Regurgitation of bland, undigested food",
        "Mild substernal pressure or discomfort after eating",
        "Gradual unintentional weight loss",
        "Sensation of food sticking in the chest",
        "Intermittent hiccups during or after meals"
      ],
      right: [
        "Aspiration pneumonia (fever, productive cough, dyspnea, crackles)",
        "Severe dehydration from inability to swallow fluids",
        "Esophageal perforation (sudden severe chest pain, subcutaneous emphysema, tachycardia)",
        "Massive esophageal dilation with respiratory compromise",
        "Significant malnutrition (BMI below 18.5, severe muscle wasting)",
        "Food impaction requiring emergency endoscopic removal"
      ]
    },
    medications: [
      {
        name: "Nifedipine (Adalat/Procardia)",
        type: "Calcium channel blocker (smooth muscle relaxant)",
        action: "Blocks L-type calcium channels in smooth muscle cells of the lower esophageal sphincter, reducing intracellular calcium influx and decreasing LES resting pressure by 30-60%, thereby facilitating passage of food into the stomach",
        sideEffects: "Hypotension, headache, peripheral edema, flushing, dizziness, reflex tachycardia",
        contra: "Severe hypotension (systolic BP below 90 mmHg); severe aortic stenosis; concurrent use with strong CYP3A4 inhibitors; acute myocardial infarction",
        pearl: "Administer sublingual nifedipine 15-30 minutes before meals for maximal LES relaxation during eating; check blood pressure before each dose and hold if systolic below 90 mmHg; effectiveness decreases over time as a bridge therapy before definitive surgical treatment"
      },
      {
        name: "Botulinum Toxin Type A (Botox)",
        type: "Neuromuscular blocking agent (endoscopic injection)",
        action: "Inhibits acetylcholine release from presynaptic nerve terminals at the neuromuscular junction of the LES, blocking excitatory cholinergic stimulation and reducing LES pressure; effect lasts 3-12 months before nerve terminal regeneration occurs",
        sideEffects: "Chest pain after injection, transient gastroesophageal reflux, rare mediastinitis from injection site, development of antibodies with repeated injections reducing efficacy",
        contra: "Known hypersensitivity to botulinum toxin; infection at the injection site; concurrent use of aminoglycoside antibiotics (potentiates neuromuscular blockade)",
        pearl: "Injected endoscopically into the LES during EGD; provides temporary relief lasting 3-12 months; best suited for elderly or high-surgical-risk patients who cannot undergo myotomy; repeated injections cause fibrosis that may complicate future Heller myotomy"
      },
      {
        name: "Isosorbide Dinitrate (Isordil)",
        type: "Nitrate vasodilator (smooth muscle relaxant)",
        action: "Releases nitric oxide which activates guanylate cyclase, increasing cyclic GMP in smooth muscle cells of the LES, producing smooth muscle relaxation and reducing LES pressure; compensates for the lost inhibitory neurotransmitter function in achalasia",
        sideEffects: "Headache (most common, often severe), hypotension, dizziness, flushing, reflex tachycardia, tolerance with chronic use",
        contra: "Concurrent use with phosphodiesterase-5 inhibitors (sildenafil, tadalafil) due to severe hypotension risk; severe hypotension; right ventricular infarction; hypertrophic obstructive cardiomyopathy",
        pearl: "Administer 5-10 mg sublingual 10-15 minutes before meals; headache is the most common reason patients discontinue therapy; tolerance develops with regular use, limiting long-term effectiveness; used as bridge therapy before definitive treatment"
      }
    ],
    pearls: [
      "Achalasia causes dysphagia to BOTH solids and liquids from the onset -- this distinguishes it from mechanical obstruction (stricture, cancer) which typically causes progressive dysphagia starting with solids",
      "The bird-beak sign on barium swallow is the classic radiographic finding: a dilated esophagus tapering to a narrow point at the non-relaxing LES",
      "Regurgitated food in achalasia is bland and undigested (never sour or acidic) because it has not reached the stomach -- this distinguishes it from GERD regurgitation",
      "Always rule out pseudoachalasia (malignancy mimicking achalasia) with endoscopy before initiating treatment, especially in patients over 60 with rapid symptom onset and significant weight loss",
      "Position the patient upright during and for 2-3 hours after meals; nocturnal aspiration of retained esophageal contents is a serious complication that can cause recurrent pneumonia",
      "Nifedipine and isosorbide dinitrate are temporary medical therapies that reduce LES pressure by only 30-60% -- Heller myotomy or pneumatic dilation are the definitive treatments",
      "After Heller myotomy, monitor for the two major complications: esophageal perforation (chest pain, fever, subcutaneous emphysema) and gastroesophageal reflux (a fundoplication is often added to prevent this)"
    ],
    quiz: [
      {
        question: "A patient reports difficulty swallowing both solids and liquids that has gradually worsened over 2 years, with regurgitation of bland, undigested food. Which condition should the practical nurse suspect?",
        options: [
          "Esophageal stricture from chronic GERD",
          "Achalasia",
          "Esophageal carcinoma",
          "Zenker diverticulum"
        ],
        correct: 1,
        rationale: "Achalasia characteristically presents with progressive dysphagia to both solids AND liquids simultaneously, along with regurgitation of bland, undigested food. Mechanical obstruction (stricture, carcinoma) typically causes dysphagia to solids first, progressing to liquids. Zenker diverticulum causes regurgitation of recently eaten food from a pharyngeal pouch."
      },
      {
        question: "A practical nurse is preparing to administer sublingual nifedipine to a patient with achalasia. When should the medication be given in relation to meals?",
        options: [
          "Immediately after the meal is completed",
          "30 minutes after eating",
          "15-30 minutes before the meal",
          "At bedtime regardless of meal timing"
        ],
        correct: 2,
        rationale: "Nifedipine is administered 15-30 minutes before meals to allow time for the medication to reduce LES pressure before the patient eats. This timing maximizes the benefit of LES relaxation during food passage. Giving the medication after meals would not help with swallowing, and bedtime administration without meal timing misses the therapeutic window."
      },
      {
        question: "A patient with achalasia is being discharged after a Heller myotomy. Which post-discharge instruction is MOST important for the practical nurse to reinforce?",
        options: [
          "Resume a regular diet immediately to test the surgical repair",
          "Report any chest pain, fever, or crackling sensation under the skin immediately",
          "Lie flat after meals to reduce abdominal pressure on the surgical site",
          "Discontinue all follow-up appointments if swallowing improves"
        ],
        correct: 1,
        rationale: "Chest pain, fever, and subcutaneous emphysema (crackling under the skin) are signs of esophageal perforation, the most serious complication of Heller myotomy. Early detection is critical for treatment. Diet should be advanced gradually (not immediately), the patient should remain upright after meals (not flat), and follow-up is essential to monitor for complications and reflux."
      }
    ]
  },

  "anal-fissure-rpn": {
    title: "Anal Fissure for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Anal Fissure",
      content: "An anal fissure is a longitudinal tear or ulceration in the anoderm (squamous epithelium lining the anal canal) that extends from the anal verge proximally toward, but not beyond, the dentate line. The condition is one of the most common causes of anorectal pain and rectal bleeding, yet it is frequently underreported because patients may be embarrassed to discuss anal symptoms. Understanding the anatomy of the anal canal and the pathophysiology of fissure formation is essential for the practical nurse to provide effective assessment, patient education, and symptom management.\n\nThe anal canal is approximately 3-4 centimeters long and extends from the anorectal junction (dentate line) to the anal verge (where the canal meets the perianal skin). It is lined by two types of epithelium: columnar epithelium above the dentate line and squamous epithelium below. The squamous epithelium below the dentate line is exquisitely sensitive to pain because it is innervated by somatic nerves (inferior rectal nerve), which explains why anal fissures are so painful. The internal anal sphincter (IAS) is a smooth muscle ring that provides 70-85% of resting anal canal pressure and is under involuntary control. The external anal sphincter (EAS) is a striated muscle under voluntary control that provides squeeze pressure during continence.\n\nApproximately 90% of anal fissures occur in the posterior midline of the anal canal. This location is vulnerable because the posterior commissure has the poorest blood supply of any area in the anal canal. The inferior rectal artery branches in the posterior midline are sparse and must traverse the internal sphincter muscle to reach the anoderm, creating a relative watershed zone of ischemia. When a hard, large stool passes through the anal canal, the mechanical trauma tears the anoderm, particularly in this poorly perfused posterior region.\n\nThe initial tear triggers a pathological cycle that perpetuates the fissure and prevents healing. The exposed internal sphincter fibers beneath the torn anoderm go into spasm (hypertonicity), which further reduces blood flow to the posterior midline by compressing the already sparse arterial supply. Reduced blood flow impairs tissue repair and healing. Additionally, the sphincter spasm increases resting anal pressure, which makes subsequent bowel movements more traumatic to the fissure. Each bowel movement reopens the healing wound, perpetuating the cycle of injury, spasm, ischemia, and impaired healing.\n\nAnal fissures are classified as acute or chronic based on duration and morphological features. Acute fissures appear as fresh, superficial tears in the anoderm with sharp, well-defined edges and a red base. They have been present for fewer than 6-8 weeks and most heal with conservative management. Chronic fissures have been present for more than 6-8 weeks and develop characteristic features: a sentinel tag (a skin tag at the external aspect of the fissure), hypertrophied anal papilla at the internal aspect, and exposed internal sphincter fibers at the base of the ulcer. The sentinel tag is a fibrotic skin fold that forms as a result of chronic inflammation and lymphatic drainage impairment.\n\nSecondary anal fissures occur in atypical locations (lateral, anterior, or multiple) and suggest underlying pathology. Conditions that cause secondary fissures include Crohn disease (which can cause fissures in any location with characteristic deep, undermined edges), sexually transmitted infections (syphilis, herpes simplex, HIV), tuberculosis, leukemia, and prior anorectal surgery. Any fissure that is not in the posterior midline, does not heal with standard therapy, or recurs frequently should prompt investigation for underlying causes.\n\nThe mainstay of fissure treatment is to break the cycle of sphincter spasm, ischemia, and impaired healing. Conservative measures include increasing dietary fiber and fluid intake to soften stools, sitz baths in warm water for 10-15 minutes three to four times daily to promote sphincter relaxation and blood flow, and topical analgesics for pain relief. Chemical sphincterotomy using topical agents (nitroglycerin ointment or diltiazem cream) reduces internal sphincter pressure by 30-50%, improving blood flow to the fissure and promoting healing. Surgical lateral internal sphincterotomy is reserved for chronic fissures that fail medical management and involves dividing a portion of the internal sphincter muscle to permanently reduce sphincter pressure.\n\nThe practical nurse is responsible for patient education regarding bowel habits, sitz bath technique, proper medication application, and recognition of complications. Pain management is a priority because the severe pain associated with bowel movements can lead to stool withholding behavior, which paradoxically worsens constipation and creates harder stools that cause more trauma. Breaking this behavioral cycle through education, reassurance, and effective analgesia is a key nursing intervention."
    },
    riskFactors: [
      "Chronic constipation with straining at stool (most common cause -- passage of hard, large stools traumatizes the anoderm)",
      "Low dietary fiber intake (leads to hard stools and increased straining during defecation)",
      "Chronic diarrhea (frequent liquid stools cause chemical irritation and maceration of the anal mucosa)",
      "Vaginal delivery (especially with prolonged second stage of labor or large birth weight, causes perineal and anal trauma)",
      "Crohn disease (causes secondary fissures that are often multiple, lateral, deep, and slow to heal)",
      "Prior anorectal surgery (scar tissue, altered sphincter mechanics, and reduced blood supply)",
      "Hypertonic internal anal sphincter (elevated resting sphincter pressure reduces blood flow to the posterior commissure)"
    ],
    diagnostics: [
      "Visual inspection of the perianal area: gently separate the buttocks to visualize the fissure; posterior midline location is most common; note presence of sentinel tag indicating chronicity",
      "Digital rectal examination: may need to be deferred initially due to severe pain and sphincter spasm; when performed, assess for sphincter tone, masses, and tenderness localization",
      "Anoscopy: direct visualization of the anal canal to assess fissure depth, length, and features (chronic vs acute); may require topical anesthesia due to pain",
      "Complete blood count (CBC): if significant rectal bleeding is reported, to assess for anemia from chronic blood loss",
      "Fecal occult blood test: confirms presence of blood in stool when gross bleeding is not evident",
      "Colonoscopy: indicated for fissures in atypical locations, multiple fissures, recurrent fissures not responding to treatment, or when Crohn disease or malignancy is suspected"
    ],
    management: [
      "Increase dietary fiber intake to 25-35 grams per day through whole grains, fruits, vegetables, and fiber supplements (psyllium) to soften stools and reduce straining",
      "Increase fluid intake to at least 2 liters (8 glasses) per day to complement increased fiber and prevent stool hardening",
      "Instruct patient on sitz bath technique: sit in warm water (40-42 degrees Celsius) for 10-15 minutes, 3-4 times daily and after each bowel movement to promote sphincter relaxation",
      "Apply topical nitroglycerin 0.2% ointment or diltiazem 2% cream to the internal anal sphincter area as prescribed for chemical sphincterotomy",
      "Administer stool softeners (docusate sodium) as prescribed to prevent hard stools during the healing period",
      "Apply topical lidocaine gel or cream before bowel movements to reduce pain and prevent stool withholding behavior",
      "Refer to colorectal surgery for lateral internal sphincterotomy evaluation if fissure fails to heal after 8-12 weeks of conservative and medical management"
    ],
    nursingActions: [
      "Assess pain using a validated pain scale; document pain intensity before, during, and after bowel movements to track treatment effectiveness",
      "Inspect perianal area for fissure characteristics, sentinel tag, bleeding, and signs of infection; document findings accurately",
      "Educate patient on proper sitz bath technique: water should be warm (not hot), duration 10-15 minutes, pat dry gently afterward, perform after each bowel movement",
      "Teach correct application of topical nitroglycerin ointment: apply a pea-sized amount to the anal margin (not inside the canal) using a gloved finger or cotton-tipped applicator; warn about headache as expected side effect",
      "Monitor bowel pattern and stool consistency; encourage patient to respond to the urge to defecate promptly and avoid straining or prolonged sitting on the toilet",
      "Assess for complications: report signs of perianal abscess (fever, swelling, increasing pain between bowel movements, purulent drainage)",
      "Provide emotional support and normalize the condition; explain that anal fissures are extremely common and treatable to reduce patient embarrassment and promote adherence"
    ],
    assessmentFindings: [
      "Severe, sharp, tearing pain during bowel movement that may persist for minutes to hours afterward (described as passing broken glass)",
      "Bright red blood on toilet paper, on the surface of the stool, or dripping into the toilet bowl (typically small amounts, not mixed into stool)",
      "Visible linear tear in the posterior midline of the anal canal on gentle inspection with buttock separation",
      "Sentinel skin tag (hypertrophied skin fold) at the external margin of a chronic fissure",
      "Internal anal sphincter spasm palpable on digital rectal examination as a tight, hypertonic band",
      "Patient reluctance to have bowel movements due to anticipated pain (stool withholding behavior leading to worsening constipation)"
    ],
    signs: {
      left: [
        "Sharp pain with bowel movements",
        "Small amount of bright red blood on toilet paper",
        "Visible superficial tear on perianal inspection",
        "Mild sphincter spasm on examination",
        "Pruritus ani (anal itching) around the fissure",
        "Mucoid discharge from the fissure site"
      ],
      right: [
        "Perianal abscess (fever, fluctuant swelling, increasing pain)",
        "Fistula-in-ano (chronic purulent drainage from perianal opening)",
        "Significant rectal hemorrhage requiring medical intervention",
        "Anal stenosis from chronic scarring (narrowed anal canal)",
        "Fecal incontinence after sphincterotomy (rare but serious)",
        "Sepsis from perianal infection (fever, tachycardia, hypotension)"
      ]
    },
    medications: [
      {
        name: "Nitroglycerin Ointment 0.2% (Rectiv)",
        type: "Topical nitrate vasodilator (chemical sphincterotomy agent)",
        action: "Releases nitric oxide locally when applied to the anal margin, activating guanylate cyclase in the internal anal sphincter smooth muscle cells, increasing cyclic GMP which causes smooth muscle relaxation, reducing resting sphincter pressure by 30-50% and improving blood flow to the ischemic fissure base to promote healing",
        sideEffects: "Headache (most common, affecting 40-60% of patients and most common reason for discontinuation), orthostatic hypotension, dizziness, perianal burning or irritation at application site",
        contra: "Concurrent use with phosphodiesterase-5 inhibitors (sildenafil, tadalafil, vardenafil) due to risk of severe hypotension; severe anemia; raised intracranial pressure; hypertrophic obstructive cardiomyopathy",
        pearl: "Apply a pea-sized amount (approximately 1 inch strip) to the anal margin using a gloved finger or cotton swab twice daily for 6-8 weeks; warn patient that headache is expected and can be managed with acetaminophen; healing rate is 50-70% with proper use"
      },
      {
        name: "Diltiazem Cream 2% (Compounded)",
        type: "Topical calcium channel blocker (chemical sphincterotomy agent)",
        action: "Blocks L-type calcium channels in the internal anal sphincter smooth muscle cells, reducing calcium-dependent muscle contraction and lowering resting sphincter pressure by 20-30%, improving blood flow to the fissure to promote tissue repair and healing",
        sideEffects: "Perianal itching or irritation, headache (less frequent than nitroglycerin), local burning sensation, rare contact dermatitis",
        contra: "Known hypersensitivity to diltiazem or calcium channel blockers; sick sinus syndrome or advanced AV block without pacemaker; severe hypotension",
        pearl: "Better tolerated than nitroglycerin with lower headache rates (10-20% vs 40-60%); often used as second-line topical therapy when patients cannot tolerate nitroglycerin headaches; apply twice daily for 8-12 weeks; must be compounded by a pharmacy as commercial topical preparation is not widely available"
      },
      {
        name: "Lidocaine 5% Ointment (Xylocaine)",
        type: "Topical local anesthetic (amide-type)",
        action: "Blocks sodium channels in sensory nerve fibers in the anoderm, preventing generation and conduction of pain impulses from the fissure site; provides temporary local analgesia lasting 30-60 minutes to facilitate comfortable bowel movements",
        sideEffects: "Local burning or stinging on application, allergic contact dermatitis (rare with amide-type), perianal numbness, systemic toxicity with excessive application (extremely rare with topical use)",
        contra: "Known hypersensitivity to amide-type local anesthetics; application to large areas of broken skin (risk of systemic absorption); methemoglobinemia (rare, associated with prilocaine more than lidocaine)",
        pearl: "Apply to the anal area 15-20 minutes before anticipated bowel movement to reduce defecation pain and prevent stool withholding behavior; provides symptomatic relief only and does not treat the underlying sphincter spasm or promote fissure healing; combine with sitz baths and chemical sphincterotomy agents for comprehensive management"
      }
    ],
    pearls: [
      "Approximately 90% of anal fissures occur in the posterior midline -- a fissure in a lateral or anterior position should raise suspicion for Crohn disease, infection, or malignancy and requires further investigation",
      "The pain cycle of anal fissure is: hard stool tears anoderm, sphincter spasm reduces blood flow, ischemia prevents healing, patient withholds stool, stool becomes harder, repeat -- break this cycle with fiber, fluids, sitz baths, and sphincter relaxation",
      "A sentinel tag is NOT a hemorrhoid -- it is a fibrotic skin fold at the external margin of a chronic fissure that indicates the fissure has been present for more than 6-8 weeks",
      "Teach patients the correct sitz bath technique: warm water (not hot), 10-15 minutes, after every bowel movement and 3-4 times daily -- sitz baths promote sphincter relaxation and increase blood flow to promote healing",
      "Headache is the most common reason patients discontinue nitroglycerin ointment -- counsel patients that headache is expected, can be managed with acetaminophen, and often decreases with continued use",
      "Never perform a forceful digital rectal examination on a patient with a suspected acute anal fissure -- the severe sphincter spasm makes the exam extremely painful and may worsen the tear",
      "Stool withholding behavior due to pain is counterproductive and must be addressed -- harder, larger stools from withholding cause MORE trauma; adequate fiber, fluids, stool softeners, and pre-defecation topical anesthesia break this behavioral cycle"
    ],
    quiz: [
      {
        question: "A patient presents with severe, sharp pain during bowel movements and bright red blood on the toilet paper. On gentle inspection, a linear tear is visible in the posterior midline of the anal canal. What is the most likely diagnosis?",
        options: [
          "Internal hemorrhoid",
          "Anal fissure",
          "Perianal abscess",
          "Rectal prolapse"
        ],
        correct: 1,
        rationale: "A linear tear in the posterior midline with sharp pain during defecation and bright red blood on toilet paper is the classic presentation of an anal fissure. Internal hemorrhoids cause painless bleeding. Perianal abscess presents with constant throbbing pain, swelling, and fever. Rectal prolapse presents with a protruding mass."
      },
      {
        question: "A practical nurse is teaching a patient about sitz bath therapy for an anal fissure. Which instruction is correct?",
        options: [
          "Use hot water to maximize sphincter relaxation",
          "Soak for 30-45 minutes to ensure adequate treatment",
          "Sit in warm water for 10-15 minutes after each bowel movement and 3-4 times daily",
          "Add antiseptic solution to the water to prevent infection"
        ],
        correct: 2,
        rationale: "Sitz baths should use warm water (not hot, which can cause burns) for 10-15 minutes (not 30-45 minutes, which can cause skin maceration) after each bowel movement and 3-4 times daily. Plain warm water is sufficient; antiseptic solutions are not necessary and may cause irritation."
      },
      {
        question: "A patient using topical nitroglycerin ointment for a chronic anal fissure reports severe headaches. What is the most appropriate nursing response?",
        options: [
          "Instruct the patient to stop the medication immediately without consulting the provider",
          "Explain that headache is an expected side effect, suggest acetaminophen, and inform the provider if headaches are intolerable",
          "Tell the patient to apply more ointment to increase effectiveness",
          "Advise the patient to apply the ointment inside the anal canal for better absorption"
        ],
        correct: 1,
        rationale: "Headache is the most common side effect of topical nitroglycerin, affecting 40-60% of patients. It is an expected pharmacological effect of nitric oxide-mediated vasodilation. Patients should be counseled that headache can be managed with acetaminophen and often decreases over time. If intolerable, the provider may switch to diltiazem cream which has lower headache rates."
      }
    ]
  },

  "hemoptysis-assessment-rpn": {
    title: "Hemoptysis Assessment for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hemoptysis",
      content: "Hemoptysis is the expectoration (coughing up) of blood or blood-tinged sputum originating from the lower respiratory tract (tracheobronchial tree or lung parenchyma). It is a clinical sign, not a disease, and its presence always warrants investigation to identify the underlying cause. Hemoptysis ranges from blood-streaked sputum to life-threatening massive hemorrhage, and the practical nurse must be able to rapidly assess severity, implement appropriate positioning and airway management, and communicate findings accurately to the healthcare team.\n\nThe lungs receive blood from two separate vascular systems: the pulmonary circulation and the bronchial circulation. The pulmonary arteries carry deoxygenated blood from the right ventricle to the alveolar capillary bed for gas exchange. This is a low-pressure system (mean pulmonary artery pressure 12-16 mmHg) with thin-walled vessels. The bronchial arteries arise from the thoracic aorta and supply oxygenated blood to the airways, bronchial walls, mediastinal structures, and vasa vasorum of the pulmonary arteries. This is a high-pressure systemic circuit (mean arterial pressure 65-95 mmHg) with thick-walled vessels. Approximately 90% of massive hemoptysis originates from the bronchial arterial system because of its higher perfusion pressure.\n\nHemoptysis can be classified by volume into non-massive (less than 200 mL in 24 hours) and massive (200-600 mL or more in 24 hours, depending on the definition used). However, volume alone does not determine severity. Even small volumes of hemoptysis can be life-threatening if they obstruct the airway, and the rate of bleeding is often more clinically relevant than the total volume. A patient who coughs up 200 mL in one hour is in more immediate danger than one who produces 300 mL over 24 hours. Death from massive hemoptysis is almost always due to asphyxiation (drowning in blood that fills the airways and alveoli) rather than exsanguination (bleeding to death).\n\nThe most common causes of hemoptysis vary by geographic region and patient population. In developed countries, the leading causes include bronchiectasis (chronic dilation of bronchi with destruction of bronchial wall elastic and muscular components, leading to exposure of hypertrophied bronchial arteries), lung cancer (tumor erosion into pulmonary or bronchial vessels), bronchitis (inflammation and friable mucosa), and pneumonia (particularly necrotizing pneumonia from Staphylococcus aureus or Klebsiella). In developing countries, tuberculosis remains the most common cause due to cavitary lesions that erode into bronchial arteries (Rasmussen aneurysm). Other important causes include pulmonary embolism (lung infarction), pulmonary vasculitis (Goodpasture syndrome, granulomatosis with polyangiitis), coagulopathies, and mitral stenosis (elevated pulmonary venous pressure causing capillary rupture).\n\nBronchiectasis deserves special attention because it is the most common cause of massive hemoptysis in non-tuberculosis settings. In bronchiectasis, chronic infection and inflammation destroy the elastic tissue and smooth muscle of the bronchial walls, causing permanent dilation. The damaged airways develop neovascularization from hypertrophied, tortuous bronchial arteries. These abnormal vessels are prone to rupture because they are exposed to systemic arterial pressure and lack the structural support of normal bronchial walls. Triggers for bleeding include acute infections, coughing paroxysms, and mechanical stress.\n\nCT angiography (CTA) of the chest has become the first-line diagnostic imaging modality for hemoptysis. It can identify the bleeding site, characterize the underlying pathology (mass, bronchiectasis, abscess), and map the bronchial arterial anatomy for potential bronchial artery embolization (BAE). Flexible bronchoscopy is used to localize the bleeding site, clear blood from the airways, and potentially apply local hemostatic measures. In massive hemoptysis, rigid bronchoscopy provides better airway control and suctioning capacity.\n\nThe practical nurse's immediate priorities in hemoptysis management are airway protection, hemodynamic monitoring, and accurate assessment of bleeding volume and rate. Positioning the patient with the affected (bleeding) side DOWN (lateral decubitus position) is critical in unilateral hemoptysis to prevent blood from spilling into the unaffected lung, which would compromise gas exchange in the only functioning lung. This positioning uses gravity to contain blood in the affected lung while preserving ventilation in the dependent (unaffected) lung. If the bleeding side is unknown, place the patient in a slightly upright position to facilitate coughing and expectoration. Supplemental oxygen, IV access, and preparation for possible intubation are essential nursing interventions. All expectorated blood should be collected and measured accurately to quantify blood loss and guide clinical decision-making."
    },
    riskFactors: [
      "Bronchiectasis (chronic airway dilation with hypertrophied, fragile bronchial arteries -- most common cause of massive hemoptysis in non-TB settings)",
      "Active or past tuberculosis (cavitary disease erodes bronchial arteries, forming Rasmussen aneurysms that can rupture)",
      "Lung malignancy (tumor erosion into pulmonary or bronchial vessels; both primary lung cancer and pulmonary metastases)",
      "Anticoagulant or antiplatelet therapy (warfarin, heparin, direct oral anticoagulants, aspirin, clopidogrel increase bleeding risk)",
      "Coagulopathies (thrombocytopenia, liver disease with impaired clotting factor synthesis, disseminated intravascular coagulation)",
      "Chronic obstructive pulmonary disease with acute exacerbation (inflamed, friable bronchial mucosa in chronic bronchitis)",
      "Mitral stenosis (elevated left atrial and pulmonary venous pressures cause pulmonary capillary rupture)"
    ],
    diagnostics: [
      "CT angiography of the chest: first-line imaging; identifies bleeding site, underlying pathology (mass, bronchiectasis, cavity), and maps bronchial arterial anatomy for potential embolization",
      "Chest X-ray: initial screening to localize abnormality; may show infiltrate, mass, cavity, or bronchiectasis; normal chest X-ray does not exclude significant pathology",
      "Flexible bronchoscopy: localizes bleeding site within the tracheobronchial tree; allows lavage, local hemostatic agent application, and tissue biopsy; rigid bronchoscopy for massive hemoptysis",
      "Complete blood count with platelet count: assess for anemia (hemoglobin/hematocrit trend), thrombocytopenia, and elevated WBC suggesting infection",
      "Coagulation studies (PT/INR, aPTT): evaluate for coagulopathy; essential in patients on anticoagulants to determine if reversal is needed",
      "Sputum for acid-fast bacilli (AFB) smear and culture: rule out active tuberculosis, especially in endemic areas or high-risk populations"
    ],
    management: [
      "Position patient with the AFFECTED (bleeding) side DOWN in lateral decubitus position to prevent blood from flooding the unaffected lung and preserve gas exchange",
      "Maintain patent airway: suction as needed, prepare for possible endotracheal intubation if airway is threatened by blood volume",
      "Administer supplemental oxygen to maintain SpO2 above 92%; apply via non-rebreather mask at 10-15 L/min for significant hemoptysis",
      "Establish two large-bore IV access sites (18 gauge or larger) for fluid resuscitation and potential blood product administration",
      "Collect and measure ALL expectorated blood accurately in a graduated container; document volume, color, consistency, and timing to quantify blood loss",
      "Administer antitussive agents (codeine) as prescribed for mild hemoptysis to reduce coughing-induced trauma to bleeding vessels",
      "Prepare for emergent bronchial artery embolization (BAE) or surgical consultation for massive or recurrent hemoptysis unresponsive to medical management"
    ],
    nursingActions: [
      "Differentiate hemoptysis from hematemesis: hemoptysis is bright red, frothy, alkaline pH, mixed with sputum, preceded by cough; hematemesis is dark red/coffee-ground, acidic pH, mixed with food particles, preceded by nausea",
      "Monitor vital signs every 15 minutes during active bleeding; report tachycardia (HR greater than 100), hypotension (systolic BP below 90), or tachypnea (RR greater than 24) immediately",
      "Assess respiratory status continuously: oxygen saturation, respiratory rate and effort, breath sounds bilaterally, use of accessory muscles, and ability to maintain airway",
      "Keep suction equipment at the bedside and functioning at all times; anticipate need for oropharyngeal or endotracheal suctioning",
      "Provide emotional support: hemoptysis is extremely frightening for patients; remain calm, explain interventions, and reassure while maintaining efficient assessment",
      "Obtain and have available: type and crossmatch, packed red blood cells, fresh frozen plasma, and platelets as ordered for potential transfusion",
      "Place patient on strict bedrest during active bleeding to reduce metabolic demand, cardiac output, and pulmonary blood flow"
    ],
    assessmentFindings: [
      "Coughing up blood or blood-tinged sputum: bright red, frothy (mixed with air), alkaline pH; may range from blood streaks in sputum to frank blood",
      "Dyspnea and tachypnea from blood partially obstructing airways and reducing gas exchange surface area",
      "Decreased or absent breath sounds on the affected side if blood fills a lobe or lung segment",
      "Crackles (rales) or gurgling sounds heard on auscultation indicating blood in the airways",
      "Tachycardia and hypotension in significant hemorrhage indicating hemodynamic compromise from blood loss",
      "Anxiety, restlessness, and fear -- hemoptysis is psychologically distressing and patients may fear they are dying",
      "Pallor, diaphoresis, and cool extremities in significant blood loss indicating compensatory peripheral vasoconstriction"
    ],
    signs: {
      left: [
        "Blood-streaked sputum with coughing",
        "Mild dyspnea with stable vital signs",
        "Occasional blood-tinged sputum production",
        "Anxiety about the symptom",
        "Mild tachycardia with stable blood pressure",
        "Decreased breath sounds in one area"
      ],
      right: [
        "Massive hemoptysis (more than 200 mL in 24 hours or rate exceeding 100 mL/hour)",
        "Airway obstruction with stridor or inability to speak",
        "Hemodynamic instability (hypotension, severe tachycardia, altered consciousness)",
        "Respiratory failure requiring emergency intubation",
        "Bilateral lung infiltrates on chest X-ray (blood flooding both lungs)",
        "Cardiopulmonary arrest from asphyxiation"
      ]
    },
    medications: [
      {
        name: "Tranexamic Acid (Cyklokapron)",
        type: "Antifibrinolytic agent",
        action: "Competitively inhibits plasminogen activation by blocking lysine-binding sites on plasminogen, preventing its conversion to plasmin and thereby inhibiting fibrinolysis (the breakdown of blood clots); stabilizes formed clots at the bleeding site in the airways to reduce ongoing hemorrhage",
        sideEffects: "Nausea, vomiting, diarrhea, dizziness, headache, thromboembolic events (DVT, PE, MI) with systemic use, visual disturbances (rare, requires ophthalmologic monitoring with prolonged use)",
        contra: "Active thromboembolic disease (DVT, PE, arterial thrombosis); history of seizures (lowers seizure threshold at high doses); severe renal impairment (dose adjustment required); subarachnoid hemorrhage",
        pearl: "Can be administered IV, orally, or nebulized (inhaled) directly into the airways for hemoptysis; nebulized route (500 mg in 5 mL saline) delivers medication directly to the bleeding site with fewer systemic effects; IV dose typically 1g over 10 minutes; monitor for signs of thromboembolism during therapy"
      },
      {
        name: "Codeine Phosphate",
        type: "Opioid antitussive and analgesic",
        action: "Acts on mu-opioid receptors in the cough center of the medulla oblongata to suppress the cough reflex, reducing mechanical disruption of clots forming at the bleeding site in the airways; the cough suppression helps prevent re-bleeding by allowing hemostasis to occur undisturbed",
        sideEffects: "Sedation, constipation, nausea, respiratory depression (dose-dependent), physical dependence with prolonged use, urinary retention",
        contra: "Respiratory depression or severe respiratory insufficiency; paralytic ileus; acute asthma attack; known ultra-rapid CYP2D6 metabolizers (rapid conversion to morphine, increased toxicity risk); children under 12 years",
        pearl: "Used specifically to suppress cough in non-massive hemoptysis; excessive cough suppression in massive hemoptysis is dangerous because coughing is the mechanism for clearing blood from the airways; monitor respiratory rate closely and hold for RR below 12; lower doses (10-20 mg every 4-6 hours) are usually sufficient for antitussive effect"
      },
      {
        name: "Aminocaproic Acid (Amicar)",
        type: "Antifibrinolytic agent (systemic hemostatic)",
        action: "Inhibits plasminogen activators and to a lesser degree inhibits plasmin activity, preventing fibrinolysis and stabilizing clots at the site of hemorrhage in the pulmonary vasculature; similar mechanism to tranexamic acid but less potent (10 times less potent on a weight basis)",
        sideEffects: "Nausea, diarrhea, dizziness, muscle weakness, myopathy with prolonged use, hypotension with rapid IV infusion, rhabdomyolysis (rare), thrombotic complications",
        contra: "Active intravascular clotting (disseminated intravascular coagulation with ongoing fibrinolysis); hematuria of upper urinary tract origin (clot formation in ureters can cause obstruction); cardiac or hepatic disease with risk of thrombosis",
        pearl: "Loading dose typically 4-5g IV or orally followed by 1-1.25g hourly; less commonly used than tranexamic acid for hemoptysis due to lower potency and higher dosing requirements; monitor creatine kinase (CK) levels during prolonged therapy for early detection of myopathy; ensure adequate urine output to prevent renal clot obstruction"
      }
    ],
    pearls: [
      "The number one cause of death in massive hemoptysis is ASPHYXIATION (drowning in blood that fills the airways), NOT exsanguination -- airway protection is the top priority",
      "Position the patient with the AFFECTED (bleeding) side DOWN to use gravity to keep blood in the diseased lung and protect the healthy lung for gas exchange",
      "Differentiate hemoptysis from hematemesis: hemoptysis is bright red, frothy, alkaline, preceded by cough and mixed with sputum; hematemesis is dark red or coffee-ground, acidic, preceded by nausea and mixed with food",
      "Bronchiectasis is the most common cause of massive hemoptysis in non-tuberculosis settings -- bronchial arteries hypertrophy under systemic pressure and are prone to rupture",
      "Measure and document ALL expectorated blood in a graduated container -- accurate quantification guides clinical decision-making and determines whether hemoptysis is classified as massive",
      "Do NOT suppress coughing in massive hemoptysis -- the cough reflex is the patient's mechanism for clearing blood from the airways and maintaining airway patency",
      "Have emergency equipment at bedside: suction (functioning and tested), oxygen delivery equipment, intubation tray, and large-bore IV access -- massive hemoptysis can escalate within minutes"
    ],
    quiz: [
      {
        question: "A patient with known bronchiectasis is coughing up bright red, frothy blood. The left lung is identified as the bleeding source. How should the practical nurse position the patient?",
        options: [
          "Supine with legs elevated (Trendelenburg position)",
          "Right lateral decubitus (right side down)",
          "Left lateral decubitus (left side down)",
          "High Fowler position sitting upright"
        ],
        correct: 2,
        rationale: "The patient should be positioned with the AFFECTED (bleeding) side DOWN. Since the left lung is the bleeding source, the patient should be placed in the left lateral decubitus position (left side down). This uses gravity to contain blood in the affected left lung and prevents it from flooding the right lung, preserving gas exchange in the unaffected lung."
      },
      {
        question: "A practical nurse is assessing a patient who is coughing up a red substance. Which characteristic best confirms that the substance is hemoptysis rather than hematemesis?",
        options: [
          "Dark red color mixed with food particles",
          "Bright red, frothy appearance with alkaline pH mixed with sputum",
          "Coffee-ground appearance with acidic pH",
          "Dark brown material preceded by nausea"
        ],
        correct: 1,
        rationale: "Hemoptysis is bright red and frothy (mixed with air from the lungs), has an alkaline pH, is mixed with sputum, and is preceded by coughing. Hematemesis is dark red or coffee-ground in appearance, has an acidic pH (from gastric acid), is mixed with food particles, and is preceded by nausea or vomiting."
      },
      {
        question: "What is the leading cause of death in massive hemoptysis?",
        options: [
          "Exsanguination from total blood volume loss",
          "Cardiac arrest from hypovolemic shock",
          "Asphyxiation from blood flooding the airways and alveoli",
          "Disseminated intravascular coagulation"
        ],
        correct: 2,
        rationale: "The primary cause of death in massive hemoptysis is asphyxiation -- the patient essentially drowns as blood fills the airways and alveoli, preventing gas exchange. Even relatively small volumes of blood can be lethal if they obstruct the airway. This is why airway protection and proper positioning are the top nursing priorities, above volume resuscitation."
      }
    ]
  },

  "incentive-spirometry-rpn": {
    title: "Incentive Spirometry for Practical Nurses",
    cellular: {
      title: "Physiology of Incentive Spirometry and Atelectasis Prevention",
      content: "Incentive spirometry is a lung expansion technique that uses a mechanical device to encourage patients to take slow, deep, sustained maximal inspirations (SMI) to prevent or reverse atelectasis, particularly in the post-operative period. Understanding the physiology of normal breathing, the mechanics of atelectasis, and the therapeutic principles behind incentive spirometry is essential for the practical nurse to educate patients effectively and monitor outcomes.\n\nNormal quiet breathing (tidal breathing) uses only a fraction of the lung's total capacity. Tidal volume, the amount of air moved in and out with each normal breath, is approximately 500 mL in an adult. However, the total lung capacity is approximately 6000 mL. During tidal breathing, the bases and dependent portions of the lungs receive less ventilation, and some alveoli may not be fully expanded. In healthy individuals, periodic spontaneous deep breaths (sighs) occur 6-10 times per hour, inflating these under-ventilated alveoli and preventing collapse. These sighs generate transpulmonary pressures sufficient to open collapsed alveoli and redistribute surfactant.\n\nAtelectasis is the partial or complete collapse of lung tissue resulting from alveolar deflation. Post-operative atelectasis is the most common pulmonary complication after surgery, occurring in up to 90% of patients undergoing general anesthesia. Several mechanisms contribute to post-operative atelectasis: absorption atelectasis occurs when high concentrations of inspired oxygen (used during anesthesia) are absorbed from alveoli faster than nitrogen can maintain alveolar volume; compression atelectasis occurs from abdominal distension, diaphragmatic dysfunction, or pleural effusion compressing lung tissue; and hypoventilation atelectasis results from shallow breathing due to pain, sedation, or splinting.\n\nDuring general anesthesia, the normal sigh mechanism is abolished, mucus clearance is impaired, and functional residual capacity (FRC) decreases. The supine position further reduces FRC because abdominal contents push the diaphragm cephalad. Pain from surgical incisions, especially thoracic and upper abdominal procedures, causes patients to breathe shallowly and avoid deep inspiration (splinting behavior), further promoting alveolar collapse. Without intervention, collapsed alveoli become a site for mucus accumulation, bacterial proliferation, and potential pneumonia.\n\nSurfactant, a phospholipid-protein complex produced by type II alveolar cells, reduces alveolar surface tension and prevents alveolar collapse during expiration. When alveoli remain collapsed for prolonged periods, surfactant is not redistributed across the alveolar surface, and existing surfactant degrades. This increases surface tension in collapsed alveoli, making them progressively harder to re-expand (a phenomenon called de-recruitment). Early and frequent use of incentive spirometry helps maintain surfactant distribution by periodically expanding alveoli to full capacity.\n\nThe incentive spirometer works by providing visual feedback as the patient inhales through the device. Most devices are volume-oriented (measuring the volume of air inspired) rather than flow-oriented (measuring the rate of airflow). The patient places their lips tightly around the mouthpiece and inhales slowly and deeply, watching a piston or ball rise as they inhale. The goal is to reach a predetermined volume target and then sustain the inspiration for 3-5 seconds at maximum inflation. This sustained breath hold is critical because it allows time for collateral ventilation through the pores of Kohn (inter-alveolar pores) and canals of Lambert (bronchiole-alveolar communications) to reach and re-expand collapsed alveoli that are not directly connected to patent airways.\n\nThe standard protocol recommends 10 sustained maximal inspirations every hour while awake. The volume target is typically set at 50-75% of the patient's predicted inspiratory capacity based on age, height, and sex. The technique must be taught pre-operatively whenever possible, because post-operative pain and sedation impair the patient's ability to learn new skills. The practical nurse should assess the patient's technique at each use, ensuring slow inspiration (not rapid gasping), sustained breath hold (at least 3 seconds), and upright positioning (at least 30-45 degrees) to maximize diaphragmatic excursion.\n\nSplinting is a complementary technique used in conjunction with incentive spirometry for patients with thoracic or abdominal incisions. The patient holds a pillow firmly against the incision site during deep breathing and coughing to provide counter-pressure that reduces pain and allows fuller chest expansion. Adequate pain management is essential because uncontrolled pain is the primary barrier to effective incentive spirometry use. The nurse should coordinate analgesic administration 20-30 minutes before scheduled incentive spirometry sessions for optimal patient participation."
    },
    riskFactors: [
      "General anesthesia lasting more than 2 hours (abolishes sigh reflex, reduces FRC, promotes absorption atelectasis)",
      "Thoracic or upper abdominal surgery (incisional pain causes splinting behavior and shallow breathing)",
      "Pre-existing chronic lung disease (COPD, asthma) with reduced baseline pulmonary reserve",
      "Obesity (BMI greater than 30) causing decreased functional residual capacity and diaphragmatic restriction",
      "Advanced age (reduced respiratory muscle strength, decreased chest wall compliance, diminished cough reflex)",
      "Prolonged immobility or bedrest (decreased lung volumes, dependent atelectasis, impaired mucociliary clearance)",
      "History of smoking (impaired mucociliary escalator, increased mucus production, chronic airway inflammation)"
    ],
    diagnostics: [
      "Chest X-ray: identifies areas of atelectasis (opacification, volume loss, mediastinal shift toward affected side), consolidation, or pleural effusion; ordered when clinical signs of respiratory compromise develop",
      "Pulse oximetry: continuous monitoring of oxygen saturation; early drop in SpO2 (below 94% on room air or below baseline) may indicate developing atelectasis",
      "Arterial blood gas (ABG): assesses gas exchange; atelectasis causes ventilation-perfusion (V/Q) mismatch leading to hypoxemia (decreased PaO2); may show respiratory alkalosis from compensatory hyperventilation",
      "Lung auscultation: decreased or absent breath sounds in areas of atelectasis; bronchial breath sounds heard over areas of consolidation; crackles may be heard with re-expansion",
      "Incentive spirometry volume tracking: document pre-operative baseline volume and track post-operative volumes at each use; declining volumes indicate worsening lung expansion",
      "Complete blood count: if atelectasis progresses to pneumonia, WBC will be elevated; monitor temperature trend as well"
    ],
    management: [
      "Instruct patient to perform 10 sustained maximal inspirations every hour while awake using the incentive spirometer; set volume goal at 50-75% of pre-operative baseline",
      "Position patient in semi-Fowler (30-45 degrees) or high Fowler position during incentive spirometry to maximize diaphragmatic excursion and lung expansion",
      "Administer prescribed analgesics 20-30 minutes before incentive spirometry sessions to ensure pain does not limit respiratory effort",
      "Teach and assist with splinting technique: patient holds pillow firmly against thoracic or abdominal incision during deep breathing and coughing to reduce pain",
      "Encourage early ambulation as tolerated within 24 hours post-operatively; walking is the most effective intervention for preventing post-operative atelectasis",
      "Maintain adequate hydration (at least 2 liters daily unless contraindicated) to keep respiratory secretions thin and facilitate mucociliary clearance",
      "Administer prescribed bronchodilators or mucolytics as ordered to optimize airway clearance and facilitate deep breathing"
    ],
    nursingActions: [
      "Teach incentive spirometry technique pre-operatively whenever possible: seal lips around mouthpiece, inhale slowly and deeply, raise piston/ball to target level, hold breath for 3-5 seconds, exhale slowly, rest, repeat 10 times",
      "Assess and document incentive spirometry volumes at each use; compare to baseline and report declining trends to the physician",
      "Auscultate breath sounds before and after incentive spirometry sessions; document changes and report diminished or absent sounds, new crackles, or adventitious sounds",
      "Monitor oxygen saturation continuously in the post-operative period; report SpO2 below 94% on room air or below baseline for patients with chronic lung disease",
      "Coordinate pain management with incentive spirometry schedule: administer analgesics 20-30 minutes before scheduled respiratory exercises",
      "Encourage coughing and deep breathing exercises in addition to incentive spirometry; teach effective coughing technique (deep breath, brief hold, forceful cough)",
      "Document patient compliance, technique quality, and volume achieved at each session; reinforce education and correct technique as needed"
    ],
    assessmentFindings: [
      "Decreased breath sounds in dependent lung bases (posterior lower lobes) indicating early atelectasis with reduced air entry",
      "Fine crackles (rales) that clear with deep breathing or coughing -- a hallmark of early atelectasis with reopening of collapsed alveoli",
      "Declining incentive spirometry volumes compared to pre-operative baseline indicating worsening lung expansion",
      "Tachypnea (respiratory rate greater than 20) with shallow breathing pattern as the body compensates for reduced tidal volume",
      "Decreasing oxygen saturation (SpO2) from baseline indicating ventilation-perfusion mismatch from collapsed alveoli",
      "Low-grade fever (up to 38 degrees Celsius) within the first 48 hours post-operatively -- often attributed to atelectasis-associated inflammatory cytokine release",
      "Splinting behavior: patient guards incision, avoids deep breathing, and reports sharp pain with inspiration"
    ],
    signs: {
      left: [
        "Decreased breath sounds in lung bases",
        "Shallow, rapid breathing pattern",
        "Declining incentive spirometry volumes",
        "Mild decrease in oxygen saturation",
        "Splinting with deep breathing attempts",
        "Low-grade fever within 48 hours post-operatively"
      ],
      right: [
        "Severe hypoxemia (SpO2 below 88%) unresponsive to supplemental oxygen",
        "Complete absence of breath sounds in one or more lobes",
        "Progressive respiratory distress (tachypnea, accessory muscle use, nasal flaring)",
        "Development of pneumonia (productive cough, high fever, elevated WBC, consolidation on X-ray)",
        "Respiratory failure requiring non-invasive ventilation or intubation",
        "Mediastinal shift on chest X-ray (large-volume atelectasis causing structural displacement)"
      ]
    },
    medications: [
      {
        name: "Acetylcysteine (Mucomyst)",
        type: "Mucolytic agent",
        action: "Breaks disulfide bonds in mucus glycoproteins, reducing mucus viscosity and thickness; liquefied secretions are easier to mobilize and expectorate through coughing, preventing mucus plugging of airways that contributes to atelectasis",
        sideEffects: "Bronchospasm (can occur with nebulized administration, especially in asthma patients), nausea, vomiting, rhinorrhea, stomatitis, unpleasant sulfur taste and odor",
        contra: "Active bronchospasm or severe asthma (can worsen bronchospasm); known hypersensitivity; use with caution in patients with peptic ulcer disease",
        pearl: "Pre-treat with an inhaled bronchodilator (albuterol) 15 minutes before nebulized acetylcysteine to prevent bronchospasm; have suction equipment ready because liquefied secretions may require suctioning in patients with weak cough; monitor breath sounds before and after treatment"
      },
      {
        name: "Albuterol (Ventolin/Proventil)",
        type: "Short-acting beta-2 adrenergic agonist (bronchodilator)",
        action: "Selectively stimulates beta-2 adrenergic receptors on bronchial smooth muscle, activating adenylyl cyclase and increasing intracellular cAMP, which causes bronchial smooth muscle relaxation and dilation; opens airways to improve ventilation and facilitate secretion mobilization",
        sideEffects: "Tachycardia, palpitations, tremor (especially hands), nervousness, headache, hypokalemia with frequent dosing",
        contra: "Known hypersensitivity to albuterol; use with caution in patients with cardiac dysrhythmias, hypertension, hyperthyroidism, or diabetes (may increase blood glucose)",
        pearl: "Administer via metered-dose inhaler (MDI) with spacer or nebulizer 15-20 minutes before incentive spirometry sessions to maximize airway opening during deep breathing exercises; teach proper MDI technique: shake canister, exhale fully, coordinate activation with slow deep inhalation, hold breath 10 seconds; monitor heart rate and report if sustained above 120 bpm"
      },
      {
        name: "Ipratropium Bromide (Atrovent)",
        type: "Anticholinergic bronchodilator (muscarinic antagonist)",
        action: "Blocks muscarinic (M3) acetylcholine receptors on bronchial smooth muscle, preventing acetylcholine-mediated bronchoconstriction and mucus hypersecretion; produces bronchodilation primarily in the larger central airways and reduces secretion volume without changing secretion viscosity",
        sideEffects: "Dry mouth (most common), bitter taste, cough, headache, blurred vision (if sprayed in eyes), urinary retention (anticholinergic effect), paradoxical bronchospasm (rare)",
        contra: "Known hypersensitivity to ipratropium or atropine derivatives; soy or peanut allergy (some formulations contain soy lecithin); use with caution in narrow-angle glaucoma and benign prostatic hyperplasia",
        pearl: "Often combined with albuterol (Combivent) for synergistic bronchodilation through different mechanisms; onset is slower than albuterol (15-30 minutes vs 5 minutes) but duration is longer (4-6 hours vs 3-4 hours); protect eyes during nebulized administration to prevent mydriasis and acute angle-closure glaucoma; effective for reducing secretion volume in patients with copious sputum production"
      }
    ],
    pearls: [
      "Teach incentive spirometry technique PRE-OPERATIVELY whenever possible -- post-operative pain and sedation significantly impair the patient's ability to learn and perform the technique correctly",
      "The sustained breath hold (3-5 seconds at maximum inspiration) is the MOST IMPORTANT part of the technique -- it allows air to reach collapsed alveoli through collateral ventilation pathways (pores of Kohn, canals of Lambert)",
      "The goal is SLOW, DEEP inspiration -- rapid gasping generates turbulent airflow that does not reach the peripheral alveoli; instruct the patient to inhale as if sipping through a straw",
      "Post-operative atelectasis is the most common pulmonary complication after surgery and the most common cause of fever in the first 48 hours -- prevention through incentive spirometry is more effective than treatment",
      "Administer prescribed analgesics 20-30 minutes BEFORE incentive spirometry sessions -- uncontrolled pain is the number one barrier to effective deep breathing and coughing",
      "Early ambulation is the SINGLE MOST EFFECTIVE intervention for preventing post-operative atelectasis -- incentive spirometry supplements but does not replace mobilization",
      "Fine crackles that CLEAR with deep breathing are a sign of early atelectasis and indicate that incentive spirometry is working -- crackles that persist or worsen suggest developing pneumonia and require physician notification"
    ],
    quiz: [
      {
        question: "A practical nurse is teaching a post-operative patient to use an incentive spirometer. Which instruction is correct?",
        options: [
          "Inhale as quickly as possible to raise the piston to the highest level",
          "Exhale forcefully into the mouthpiece to clear the airways",
          "Inhale slowly and deeply through the mouthpiece, then hold the breath for 3-5 seconds at maximum inspiration",
          "Use the incentive spirometer once every 4 hours while awake"
        ],
        correct: 2,
        rationale: "The correct technique is slow, deep inspiration through the mouthpiece followed by a sustained breath hold of 3-5 seconds at maximum inflation. The slow inhalation ensures laminar airflow that reaches peripheral alveoli. The breath hold allows collateral ventilation to re-expand collapsed alveoli. Rapid inhalation creates turbulent flow that does not reach small airways. The device is used for inspiration, not expiration. Frequency should be 10 breaths every hour while awake."
      },
      {
        question: "A patient is 12 hours post-abdominal surgery. The practical nurse auscultates fine crackles in the bilateral lower lung bases that clear after the patient takes several deep breaths. What does this finding most likely indicate?",
        options: [
          "Developing pneumonia requiring antibiotic therapy",
          "Pulmonary edema from fluid overload",
          "Early post-operative atelectasis that is responding to deep breathing",
          "Pleural effusion requiring thoracentesis"
        ],
        correct: 2,
        rationale: "Fine crackles in the lower lung bases that clear with deep breathing are the hallmark finding of early post-operative atelectasis. The crackles represent the popping open of collapsed alveoli during inspiration. The fact that they clear with deep breathing confirms that the alveoli are being re-expanded. Pneumonia crackles typically do not clear with deep breathing and are accompanied by fever, productive cough, and elevated WBC. Pulmonary edema crackles are typically bilateral and do not clear."
      },
      {
        question: "When should the practical nurse coordinate analgesic administration relative to incentive spirometry for a patient with an abdominal incision?",
        options: [
          "Immediately after incentive spirometry to address the pain caused by deep breathing",
          "20-30 minutes before incentive spirometry to ensure pain does not limit respiratory effort",
          "Only if the patient requests pain medication during incentive spirometry",
          "At a fixed schedule unrelated to respiratory exercises"
        ],
        correct: 1,
        rationale: "Analgesics should be administered 20-30 minutes before incentive spirometry sessions to allow the medication to reach peak effect. This ensures that pain does not limit the patient's ability to take deep breaths and sustain inspiration. Waiting until after the exercise misses the therapeutic window. Pain is the number one barrier to effective incentive spirometry and should be proactively managed."
      }
    ]
  },

  "hypoventilation-syndromes-rpn": {
    title: "Hypoventilation Syndromes for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hypoventilation Syndromes",
      content: "Hypoventilation syndromes are a group of disorders characterized by inadequate alveolar ventilation resulting in chronic carbon dioxide retention (hypercapnia, PaCO2 greater than 45 mmHg) and secondary hypoxemia. The practical nurse must understand the physiology of ventilation, the mechanisms of CO2 retention, and the clinical manifestations of hypercapnia to effectively monitor and care for patients with these conditions.\n\nVentilation is the mechanical process of moving air in and out of the lungs. Alveolar ventilation specifically refers to the volume of fresh air that reaches the alveoli per minute and participates in gas exchange. It is calculated as: alveolar ventilation = (tidal volume minus dead space volume) multiplied by respiratory rate. Anything that reduces tidal volume, increases dead space, or decreases respiratory rate will reduce alveolar ventilation. When alveolar ventilation is inadequate to eliminate the CO2 produced by cellular metabolism, PaCO2 rises.\n\nCarbon dioxide is a potent stimulant of the central chemoreceptors located in the medulla oblongata. Under normal conditions, even small increases in PaCO2 trigger increased respiratory rate and depth to restore normal CO2 levels. However, in chronic hypoventilation, the medullary chemoreceptors become desensitized to persistently elevated CO2 levels (CO2 narcosis). When this occurs, the primary stimulus for breathing shifts from CO2 to hypoxemia, detected by peripheral chemoreceptors in the carotid and aortic bodies. This has critical implications for oxygen therapy: administering high-flow oxygen to a patient with chronic CO2 retention can remove the hypoxic drive to breathe, causing further respiratory depression and potentially fatal respiratory arrest.\n\nObesity hypoventilation syndrome (OHS), also known as Pickwickian syndrome, is the most common hypoventilation syndrome. It is defined by the triad of obesity (BMI greater than 30 kg/m2, typically greater than 40), daytime hypercapnia (PaCO2 greater than 45 mmHg), and sleep-disordered breathing in the absence of other causes of hypoventilation. OHS affects approximately 10-20% of obese patients with obstructive sleep apnea and is associated with significant morbidity and mortality.\n\nThe pathophysiology of OHS involves multiple interacting mechanisms. Excessive adipose tissue on the chest wall and abdomen increases the elastic load on the respiratory system, requiring more work to expand the thorax during inspiration. Abdominal obesity pushes the diaphragm cephalad, reducing functional residual capacity (FRC) and expiratory reserve volume. This leads to closure of small airways in dependent lung regions, causing ventilation-perfusion mismatch and hypoxemia. The increased mechanical load on respiratory muscles leads to respiratory muscle fatigue and reduced ventilatory drive. Leptin resistance (leptin normally stimulates ventilation) further blunts the ventilatory response to hypercapnia. Additionally, most OHS patients (approximately 90%) have concurrent obstructive sleep apnea (OSA), which causes intermittent nocturnal hypoxemia, sleep fragmentation, and further suppression of ventilatory drive.\n\nOther causes of hypoventilation syndromes include neuromuscular diseases (amyotrophic lateral sclerosis, myasthenia gravis, Guillain-Barre syndrome, muscular dystrophy), chest wall deformities (severe kyphoscoliosis, flail chest), central nervous system depression (opioid overdose, brainstem lesions, central sleep apnea), and chronic obstructive pulmonary disease (COPD) with respiratory failure. Each of these conditions impairs ventilation through a different mechanism -- weakness of respiratory muscles, restriction of chest wall expansion, depression of the respiratory center, or increased airway resistance -- but all result in inadequate CO2 elimination.\n\nThe clinical manifestations of chronic hypercapnia develop gradually and may be subtle. Early signs include morning headache (cerebral vasodilation from CO2), daytime somnolence, fatigue, cognitive impairment, and personality changes. As hypercapnia worsens, patients develop asterixis (flapping tremor of the hands), papilledema, confusion, and eventually CO2 narcosis (stupor and coma). Chronic hypoxemia triggers erythropoietin release from the kidneys, leading to secondary polycythemia (elevated red blood cell count). Chronic hypoxia also causes pulmonary arteriolar vasoconstriction, which over time leads to pulmonary hypertension and right ventricular hypertrophy (cor pulmonale), eventually progressing to right-sided heart failure with peripheral edema, hepatomegaly, and jugular venous distension.\n\nBilevel positive airway pressure (BiPAP) is the primary treatment for hypoventilation syndromes. BiPAP delivers two levels of pressure: a higher inspiratory positive airway pressure (IPAP) that assists inspiration and augments tidal volume, and a lower expiratory positive airway pressure (EPAP) that keeps airways and alveoli open during expiration, preventing collapse. The difference between IPAP and EPAP (called pressure support) determines the degree of ventilatory assistance. For OHS, weight loss is the definitive treatment, but BiPAP provides respiratory support while weight reduction is pursued through lifestyle modifications or bariatric surgery."
    },
    riskFactors: [
      "Morbid obesity (BMI greater than 40 kg/m2) with central adiposity causing diaphragmatic restriction and increased chest wall loading",
      "Obstructive sleep apnea (approximately 90% of OHS patients have concurrent OSA with intermittent nocturnal hypoxemia)",
      "Neuromuscular disease (ALS, myasthenia gravis, muscular dystrophy) causing progressive respiratory muscle weakness",
      "Severe kyphoscoliosis (chest wall deformity restricting lung expansion and reducing vital capacity)",
      "Chronic opioid use (central respiratory depression reducing ventilatory drive and tidal volume)",
      "COPD with chronic respiratory failure (increased airway resistance and air trapping reduce effective alveolar ventilation)",
      "Hypothyroidism (severe myxedema can depress respiratory drive and weaken respiratory muscles)"
    ],
    diagnostics: [
      "Arterial blood gas (ABG): definitive diagnostic test showing PaCO2 greater than 45 mmHg (hypercapnia), decreased PaO2 (hypoxemia), and elevated bicarbonate (HCO3- greater than 27 mEq/L indicating chronic metabolic compensation)",
      "Serum bicarbonate (HCO3-): elevated above 27 mEq/L on basic metabolic panel suggests chronic CO2 retention with renal compensation; this may be the first clue to chronic hypoventilation",
      "Polysomnography (sleep study): identifies concurrent obstructive sleep apnea, measures nocturnal oxygen saturation nadir, and quantifies apnea-hypopnea index (AHI)",
      "Pulmonary function tests (PFTs): show restrictive pattern in OHS and chest wall disease (reduced vital capacity, reduced total lung capacity); obstructive pattern in COPD",
      "Chest X-ray: may show elevated diaphragm (obesity), kyphoscoliosis, cardiomegaly from cor pulmonale, or signs of right heart failure",
      "Echocardiogram: assesses for pulmonary hypertension (elevated right ventricular systolic pressure) and right ventricular hypertrophy or dilation indicating cor pulmonale"
    ],
    management: [
      "Initiate BiPAP therapy as prescribed: set IPAP and EPAP pressures per physician order; ensure proper mask fit to minimize air leak; monitor patient comfort and compliance",
      "Administer oxygen therapy cautiously in patients with chronic CO2 retention: titrate to target SpO2 of 88-92% (NOT 94-100%); high-flow oxygen can suppress the hypoxic drive",
      "Position patient in semi-Fowler or high Fowler position to maximize diaphragmatic excursion and reduce compression from abdominal obesity",
      "Implement weight reduction strategies for OHS: consult dietitian, establish caloric deficit, consider referral for bariatric surgery evaluation for BMI greater than 40",
      "Monitor ABGs as ordered during acute exacerbations and after changes in ventilatory support settings",
      "Administer respiratory stimulants as prescribed (acetazolamide, medroxyprogesterone, or theophylline) to augment central ventilatory drive",
      "Treat underlying causes: manage OSA with CPAP/BiPAP, optimize thyroid replacement therapy, adjust or taper opioids, treat neuromuscular conditions"
    ],
    nursingActions: [
      "Monitor respiratory rate, depth, and pattern every 2-4 hours; report respiratory rate below 10 or above 24, shallow breathing, or use of accessory muscles immediately",
      "Assess level of consciousness using a standardized tool (GCS or AVPU) every 4 hours; increasing somnolence or confusion may indicate worsening hypercapnia or CO2 narcosis",
      "Monitor SpO2 continuously; target 88-92% in patients with known chronic CO2 retention to maintain hypoxic drive -- immediately report and adjust if SpO2 exceeds 94% on supplemental oxygen",
      "Assess for signs of cor pulmonale: bilateral lower extremity edema, jugular venous distension, hepatomegaly, weight gain, and decreased urine output",
      "Ensure proper BiPAP mask fit and function: check for air leaks around the mask, monitor skin integrity under the mask, and verify ventilator settings match prescribed parameters",
      "Weigh patient daily at the same time and conditions; monitor intake and output; report fluid retention (weight gain greater than 1 kg/day)",
      "Educate patient on the critical importance of not adjusting or removing BiPAP during sleep and the danger of receiving high-flow oxygen without medical supervision"
    ],
    assessmentFindings: [
      "Morning headache: caused by nocturnal CO2 retention producing cerebral vasodilation; typically improves as ventilation improves during waking hours",
      "Excessive daytime somnolence and fatigue: fragmented sleep from nocturnal desaturation and impaired gas exchange; often the presenting complaint",
      "Peripheral edema, jugular venous distension, and hepatomegaly: signs of right-sided heart failure (cor pulmonale) from chronic pulmonary hypertension",
      "Cyanosis: central cyanosis (lips, tongue, oral mucosa) indicates significant hypoxemia; peripheral cyanosis (nail beds, fingers) may be present chronically",
      "Asterixis: involuntary flapping tremor of the hands when wrists are extended, indicating metabolic encephalopathy from severe hypercapnia",
      "Polycythemia: ruddy or plethoric facial complexion, elevated hemoglobin and hematocrit from chronic hypoxia-stimulated erythropoietin production",
      "Decreased breath sounds with prolonged expiratory phase in patients with concurrent COPD"
    ],
    signs: {
      left: [
        "Morning headaches improving during the day",
        "Excessive daytime sleepiness and fatigue",
        "Mild cognitive difficulties (poor concentration, memory)",
        "Snoring and witnessed apneas during sleep",
        "Mild peripheral edema",
        "Mild dyspnea on exertion"
      ],
      right: [
        "CO2 narcosis (stupor, unresponsiveness from severe hypercapnia)",
        "Acute respiratory failure (PaCO2 greater than 70 mmHg, severe hypoxemia)",
        "Severe right heart failure (massive peripheral edema, ascites, hepatomegaly)",
        "Cardiac dysrhythmias from hypoxemia and hypercapnia",
        "Seizures from severe hypercapnia",
        "Respiratory arrest from loss of ventilatory drive"
      ]
    },
    medications: [
      {
        name: "Acetazolamide (Diamox)",
        type: "Carbonic anhydrase inhibitor / respiratory stimulant",
        action: "Inhibits carbonic anhydrase in the renal tubules, causing metabolic acidosis through increased urinary bicarbonate excretion; the resulting metabolic acidosis stimulates central and peripheral chemoreceptors to increase ventilatory drive, enhancing minute ventilation and reducing PaCO2",
        sideEffects: "Metabolic acidosis (therapeutic but can be excessive), hypokalemia, paresthesias (tingling in fingers and toes), drowsiness, nephrolithiasis (alkaline urine precipitates calcium phosphate stones), altered taste (carbonated beverages taste flat)",
        contra: "Severe renal impairment (creatinine clearance below 10 mL/min); severe hepatic disease (may precipitate hepatic encephalopathy); hyponatremia; hypokalemia; sulfonamide allergy (structural similarity); adrenal insufficiency",
        pearl: "Used as an adjunctive respiratory stimulant in OHS and other hypoventilation syndromes; typical dose 250 mg twice daily; monitor serum potassium and bicarbonate levels regularly; encourage high fluid intake (at least 2 liters daily) to reduce kidney stone risk; contraindicated in combination with high-dose aspirin"
      },
      {
        name: "Medroxyprogesterone Acetate (Provera)",
        type: "Progestational agent / respiratory stimulant",
        action: "Stimulates central respiratory drive by acting on progesterone receptors in the hypothalamus and medullary respiratory center, increasing the ventilatory response to hypoxemia and hypercapnia; progesterone is a known respiratory stimulant (explains the physiological hyperventilation of pregnancy)",
        sideEffects: "Weight gain, mood changes, breakthrough bleeding, edema, headache, thromboembolic events (DVT, PE) particularly in obese patients, glucose intolerance",
        contra: "Known or suspected pregnancy; active thromboembolic disease or history of thromboembolism; breast cancer; undiagnosed vaginal bleeding; severe hepatic dysfunction",
        pearl: "Used off-label as a respiratory stimulant in OHS at doses of 20-60 mg daily; effectiveness is variable and less well-established than BiPAP; thromboembolism risk is a significant concern in obese patients who are already at elevated VTE risk; monitor for calf pain, swelling, or sudden dyspnea during therapy"
      },
      {
        name: "Theophylline (Theo-Dur/Uniphyl)",
        type: "Methylxanthine bronchodilator / respiratory stimulant",
        action: "Inhibits phosphodiesterase enzymes, increasing intracellular cyclic AMP which relaxes bronchial smooth muscle and increases diaphragmatic contractility and endurance; also stimulates the medullary respiratory center, increasing ventilatory drive and sensitivity to CO2; improves mucociliary clearance",
        sideEffects: "Nausea, vomiting, abdominal pain, tachycardia, palpitations, insomnia, headache, seizures and cardiac dysrhythmias at toxic levels (narrow therapeutic window: 10-20 mcg/mL)",
        contra: "Active peptic ulcer disease; uncontrolled seizure disorder; severe cardiac dysrhythmias (tachyarrhythmias); hypersensitivity to xanthines",
        pearl: "Has an extremely narrow therapeutic index: therapeutic range 10-20 mcg/mL, toxicity occurs above 20 mcg/mL with seizures and fatal dysrhythmias; monitor serum theophylline levels regularly; metabolism affected by many drugs (ciprofloxacin, erythromycin, cimetidine INCREASE levels; phenytoin, rifampin DECREASE levels), smoking (increases clearance), liver disease (decreases clearance), and heart failure (decreases clearance)"
      }
    ],
    pearls: [
      "In patients with chronic CO2 retention, oxygen saturation target is 88-92%, NOT 94-100% -- high-flow oxygen removes the hypoxic drive to breathe and can cause respiratory arrest",
      "Elevated serum bicarbonate (HCO3- greater than 27 mEq/L) on a routine metabolic panel may be the first clue to chronic hypoventilation -- it indicates renal compensation for chronic respiratory acidosis",
      "Morning headache in an obese patient with daytime somnolence should raise suspicion for OHS or obstructive sleep apnea -- headache is caused by nocturnal CO2 retention and cerebral vasodilation",
      "BiPAP is the primary treatment for hypoventilation syndromes: IPAP assists inspiration to increase tidal volume, EPAP prevents airway and alveolar collapse during expiration",
      "Asterixis (flapping tremor) in a patient with respiratory disease indicates severe hypercapnia and metabolic encephalopathy -- this is a late sign that requires immediate medical intervention",
      "Cor pulmonale (right heart failure) develops from chronic hypoxemia causing sustained pulmonary vasoconstriction and pulmonary hypertension -- monitor for JVD, peripheral edema, and hepatomegaly",
      "Weight loss is the only DEFINITIVE treatment for obesity hypoventilation syndrome -- BiPAP, respiratory stimulants, and oxygen are supportive measures while weight reduction is pursued through lifestyle changes or bariatric surgery"
    ],
    quiz: [
      {
        question: "A patient with obesity hypoventilation syndrome has a SpO2 of 86% on room air. The physician orders supplemental oxygen. What is the appropriate target oxygen saturation for this patient?",
        options: [
          "100% using a non-rebreather mask at 15 L/min",
          "94-98% using a nasal cannula at 4-6 L/min",
          "88-92% using a nasal cannula at 1-2 L/min",
          "Greater than 95% using a Venturi mask at 40% FiO2"
        ],
        correct: 2,
        rationale: "In patients with chronic CO2 retention (including OHS), the target SpO2 is 88-92%. These patients have lost their CO2-driven respiratory drive due to chronic hypercapnia, and breathing is maintained primarily by the hypoxic drive. Administering high-flow oxygen to achieve SpO2 above 92% can eliminate the hypoxic drive to breathe, causing further respiratory depression and potentially fatal respiratory arrest."
      },
      {
        question: "A practical nurse notices that an obese patient consistently reports morning headaches that improve as the day progresses, along with excessive daytime sleepiness. Which condition should the nurse suspect?",
        options: [
          "Tension headache from poor sleep posture",
          "Migraine headache disorder",
          "Obesity hypoventilation syndrome or obstructive sleep apnea",
          "Medication side effects from bedtime medications"
        ],
        correct: 2,
        rationale: "Morning headaches in an obese patient with excessive daytime somnolence are classic signs of obesity hypoventilation syndrome or obstructive sleep apnea. During sleep, hypoventilation worsens and CO2 accumulates, causing cerebral vasodilation and headache. As the patient becomes more active during the day, ventilation improves, CO2 decreases, and the headache resolves. This pattern should prompt referral for sleep study and ABG evaluation."
      },
      {
        question: "A patient on theophylline therapy for a hypoventilation syndrome reports new-onset nausea, vomiting, and heart palpitations. What is the priority nursing action?",
        options: [
          "Administer an antiemetic and continue theophylline as prescribed",
          "Hold theophylline, check serum theophylline level, and notify the physician immediately",
          "Increase the theophylline dose to achieve better respiratory stimulation",
          "Encourage the patient to take the medication with food to reduce stomach upset"
        ],
        correct: 1,
        rationale: "Nausea, vomiting, and palpitations are signs of theophylline toxicity. Theophylline has an extremely narrow therapeutic window (10-20 mcg/mL), and levels above 20 mcg/mL can cause seizures and fatal cardiac dysrhythmias. The priority is to hold the medication, obtain a stat serum theophylline level, and notify the physician immediately. Continuing or increasing the dose could result in life-threatening toxicity."
      }
    ]
  }
};

console.log("Injecting GI/Respiratory batch lessons...");
let ok = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
}
console.log(`Done: ${ok}/${Object.keys(lessons).length} injected.`);
