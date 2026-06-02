import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");
function escapeStr(s: string): string { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n"); }
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
  if (l.lifespan) li.push(`    lifespan: { title: "${escapeStr(l.lifespan.title)}", content: "${escapeStr(l.lifespan.content)}" },`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}
function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file); let c = fs.readFileSync(fp, "utf8");
    const m = `"${id}":`; const idx = c.indexOf(m); if (idx === -1) continue;
    if (!c.slice(idx, idx + 200).includes("[WRITE YOUR")) continue;
    let bc = 0, es = idx + m.length; while (es < c.length && c[es] !== "{") es++;
    let start = es;
    for (let i = start; i < c.length; i++) { if (c[i] === "{") bc++; else if (c[i] === "}") { bc--; if (bc === 0) { es = i + 1; break; } } }
    const newBlock = `{\n    ${buildLS(lesson)}\n  }`;
    c = c.slice(0, start) + newBlock + c.slice(es);
    fs.writeFileSync(fp, c, "utf8");
    console.log(`Injected ${id} in ${file}`); return true;
  }
  console.log(`NOT FOUND: ${id}`); return false;
}

const lessons: Record<string, any> = {

"constipation-management-rpn": {
  title: "Constipation Management",
  cellular: {
    title: "Pathophysiology of Constipation",
    content: "Constipation is defined as infrequent bowel movements (fewer than three per week), hard or lumpy stool, straining during defecation, or a sensation of incomplete evacuation. It affects up to 20% of the general population and is one of the most common GI complaints encountered in clinical practice.\n\nNormal colonic motility depends on coordinated peristaltic contractions that propel stool distally while absorbing water and electrolytes. The colon receives approximately 1-1.5 litres of chyme daily from the ileum and absorbs most of the water, producing 100-200 mL of formed stool. Transit time through the colon normally ranges from 12 to 36 hours.\n\nConstipation develops through several pathophysiologic mechanisms. In slow-transit constipation, reduced frequency and amplitude of high-amplitude propagating contractions (HAPCs) delay stool movement through the colon. The longer stool remains in the colon, the more water is reabsorbed, resulting in hard, dry stool that is difficult to pass. Enteric nervous system dysfunction, reduced interstitial cells of Cajal, and decreased responsiveness to stimulatory neurotransmitters like acetylcholine and serotonin all contribute.\n\nFunctional (outlet) constipation involves pelvic floor dyssynergia where the puborectalis muscle and external anal sphincter fail to relax or paradoxically contract during attempted defecation. This creates a functional obstruction despite normal colonic transit. Rectal hyposensitivity, where the rectum requires larger volumes to trigger the urge to defecate, can also contribute.\n\nSecondary constipation results from identifiable causes: medications (opioids, anticholinergics, calcium channel blockers, iron supplements), metabolic conditions (hypothyroidism, hypercalcemia, diabetes with autonomic neuropathy), neurological disorders (Parkinson disease, multiple sclerosis, spinal cord injury), structural lesions (colorectal cancer, strictures, rectocele), and lifestyle factors (inadequate fibre, dehydration, immobility).\n\nOpioid-induced constipation (OIC) deserves special attention. Opioids bind to mu-receptors in the enteric nervous system, reducing peristalsis, increasing non-propulsive contractions, decreasing intestinal secretions, and increasing anal sphincter tone. Unlike most opioid side effects, tolerance to constipation rarely develops, making it a persistent problem requiring prophylactic management.\n\nChronic constipation complications include hemorrhoids from straining, anal fissures, rectal prolapse, fecal impaction, and rarely stercoral ulceration or perforation. In elderly or immobile patients, fecal impaction can present paradoxically as overflow diarrhea (liquid stool seeping around the impacted mass), which is critical to recognise before inappropriately treating with anti-diarrheals."
  },
  riskFactors: [
    "Advanced age with decreased colonic motility and reduced physical activity",
    "Medications including opioids, anticholinergics, antacids with aluminum, calcium channel blockers, and iron supplements",
    "Inadequate dietary fibre intake (less than 25-30 grams per day)",
    "Insufficient fluid intake or chronic dehydration",
    "Immobility or prolonged bed rest following surgery or illness",
    "Neurological conditions (Parkinson disease, MS, spinal cord injury, stroke)",
    "Metabolic and endocrine disorders (hypothyroidism, hypercalcemia, diabetes mellitus)",
    "Ignoring or suppressing the urge to defecate habitually",
    "Pregnancy due to progesterone effects and mechanical compression",
    "Depression, anxiety, and eating disorders"
  ],
  diagnostics: [
    "Thorough bowel history: frequency, consistency (Bristol Stool Scale), straining, incomplete evacuation, duration, and previous laxative use",
    "Abdominal assessment: inspect for distension, auscultate for bowel sounds (may be hypoactive), palpate for masses or fecal loading in left lower quadrant",
    "Digital rectal examination (performed by authorized provider): assesses for impaction, rectal masses, anal tone, and pelvic floor function",
    "Abdominal X-ray (KUB): identifies fecal loading throughout colon, potential obstruction, or megacolon",
    "Blood work: TSH (rule out hypothyroidism), calcium (rule out hypercalcemia), CBC (screen for anemia suggesting malignancy), glucose",
    "Colonoscopy indicated for new-onset constipation in patients over 50, alarm symptoms (rectal bleeding, weight loss, family history of colon cancer), or failure to respond to treatment"
  ],
  management: [
    "First-line: increase dietary fibre gradually to 25-30 g/day (bran, fruits, vegetables, psyllium) with adequate fluid intake of at least 1.5-2 litres daily",
    "Bulk-forming laxatives (psyllium, methylcellulose) as first-line pharmacological therapy for chronic constipation",
    "Osmotic laxatives (polyethylene glycol 3350, lactulose) for persistent constipation not responsive to fibre alone",
    "Stimulant laxatives (bisacodyl, senna) for short-term or intermittent use; avoid chronic daily use due to potential for dependence",
    "Stool softeners (docusate sodium) primarily for prevention of straining in patients with hemorrhoids, post-surgical, or cardiac conditions",
    "Opioid-induced constipation: start prophylactic bowel regimen when opioid therapy begins (stimulant + softener); consider peripherally acting mu-opioid receptor antagonists (naloxegol, methylnaltrexone) if conventional laxatives fail",
    "Fecal impaction: manual disimpaction followed by evacuation enema, then establish regular bowel regimen to prevent recurrence",
    "Enemas (tap water, saline, sodium phosphate) for acute relief; avoid sodium phosphate enemas in elderly or renal impaired patients due to risk of electrolyte disturbances"
  ],
  nursingActions: [
    "Assess bowel pattern daily: document last bowel movement, consistency, amount, and any associated symptoms",
    "Implement a toileting schedule: encourage attempts 20-30 minutes after meals to capitalise on the gastrocolic reflex",
    "Position patient upright on toilet or commode with feet flat on floor or on a step stool to optimise pelvic alignment",
    "Administer prescribed laxatives and enemas; monitor for effectiveness and adverse effects",
    "For digital rectal examination or manual disimpaction: ensure provider order, use adequate lubrication, watch for vagal response (bradycardia, hypotension)",
    "Encourage ambulation and physical activity as tolerated to promote colonic motility",
    "Educate patient on adequate fluid and fibre intake, the importance of not ignoring the urge to defecate, and proper toileting posture",
    "Monitor for signs of fecal impaction: paradoxical diarrhea (overflow), abdominal distension, nausea, rectal fullness, restlessness in cognitively impaired patients",
    "Document and report if patient has not had a bowel movement in 3 or more days"
  ],
  assessmentFindings: [
    "Abdominal distension and bloating, often worse as the day progresses",
    "Hard, dry, pellet-like stool (Bristol Stool Scale type 1 or 2)",
    "Hypoactive bowel sounds on auscultation",
    "Palpable stool in the left lower quadrant (sigmoid colon)",
    "Reported straining, incomplete evacuation, or sensation of anorectal blockage",
    "Decreased appetite, nausea, or vague abdominal discomfort",
    "In elderly or cognitively impaired: restlessness, confusion, agitation, or refusal to eat may be the only presenting signs"
  ],
  signs: {
    left: [
      "Abdominal distension and tympany on percussion",
      "Hypoactive or absent bowel sounds",
      "Palpable fecal mass in left lower quadrant",
      "Hard stool on digital rectal exam",
      "Straining with defecation"
    ],
    right: [
      "Overflow diarrhea (paradoxical liquid stool around impaction)",
      "Nausea and decreased appetite",
      "Rectal bleeding from hemorrhoids or fissures",
      "Urinary retention due to fecal mass compressing bladder",
      "Delirium or agitation in elderly (may be sole presentation)"
    ]
  },
  medications: [
    {
      name: "Polyethylene Glycol 3350 (PEG)",
      type: "Osmotic Laxative",
      action: "Creates an osmotic gradient drawing water into the intestinal lumen, softening stool and increasing stool volume to stimulate peristalsis",
      sideEffects: "Bloating, flatulence, abdominal cramping, diarrhea with excessive doses, nausea",
      contra: "Known or suspected bowel obstruction, ileus, gastric retention, bowel perforation",
      pearl: "Takes 1-3 days for full effect; can be mixed in any non-carbonated beverage; first-line osmotic agent due to minimal electrolyte disturbance and good tolerability"
    },
    {
      name: "Bisacodyl",
      type: "Stimulant Laxative",
      action: "Stimulates colonic nerve plexus to increase peristalsis and inhibits water absorption in the colon, promoting fluid accumulation in the lumen",
      sideEffects: "Abdominal cramping, diarrhea, electrolyte imbalances with chronic use (hypokalemia), rectal irritation with suppository form",
      contra: "Acute abdomen, bowel obstruction, severe dehydration, acute inflammatory bowel disease",
      pearl: "Oral tablets are enteric-coated - do not crush, chew, or take with milk or antacids as this dissolves the coating causing gastric irritation; suppository form works within 15-60 minutes vs 6-12 hours for oral"
    },
    {
      name: "Docusate Sodium",
      type: "Stool Softener (Surfactant)",
      action: "Acts as a detergent to lower surface tension of stool, allowing water and lipids to penetrate and soften the fecal mass",
      sideEffects: "Mild abdominal cramping, diarrhea, throat irritation with liquid form",
      contra: "Bowel obstruction, concomitant use with mineral oil (increases mineral oil absorption and toxicity risk)",
      pearl: "Evidence for efficacy as monotherapy is weak; most effective as prophylactic agent when combined with a stimulant laxative; takes 1-3 days for effect; commonly paired with senna for opioid-induced constipation prevention"
    },
    {
      name: "Lactulose",
      type: "Osmotic Laxative (Synthetic Disaccharide)",
      action: "Unabsorbed in the small intestine; fermented by colonic bacteria producing organic acids that create osmotic gradient drawing water into the lumen and lowering colonic pH",
      sideEffects: "Significant bloating and flatulence (from bacterial fermentation), abdominal cramping, diarrhea, hypernatremia with excessive diarrhea",
      contra: "Galactosemia (lactulose is metabolised to galactose), bowel obstruction",
      pearl: "Also used at higher doses for hepatic encephalopathy to reduce ammonia absorption; more bloating/gas than PEG; adjust dose to achieve 2-3 soft stools daily when used for hepatic encephalopathy"
    },
    {
      name: "Senna (Sennosides)",
      type: "Stimulant Laxative (Anthraquinone)",
      action: "Hydrolysed by colonic bacteria to active metabolites (rhein anthrone) that stimulate the myenteric plexus, increasing peristalsis and inhibiting water and electrolyte absorption",
      sideEffects: "Abdominal cramping, diarrhea, melanosis coli (harmless brown pigmentation of colonic mucosa with chronic use), urine discoloration (yellow-brown to red)",
      contra: "Bowel obstruction, acute inflammatory bowel conditions, undiagnosed abdominal pain",
      pearl: "First-line stimulant for opioid-induced constipation; onset 6-12 hours when taken orally (take at bedtime for morning effect); melanosis coli is reversible upon discontinuation and does not increase cancer risk"
    }
  ],
  pearls: [
    "Always rule out bowel obstruction before administering laxatives - assess for complete absence of flatus and stool, progressive abdominal distension, and vomiting",
    "For opioid-induced constipation, start a prophylactic bowel regimen (senna + docusate) at the same time the opioid is prescribed - do not wait for constipation to develop",
    "Overflow diarrhea from fecal impaction is a common mimicker - perform abdominal and rectal assessment before treating diarrhea with anti-diarrheal agents",
    "Avoid sodium phosphate (Fleet) enemas in elderly patients and those with renal insufficiency due to risk of life-threatening hyperphosphatemia, hypocalcemia, and hypernatremia",
    "Bulk-forming laxatives require adequate fluid intake (at least 250 mL per dose) or they can worsen constipation and potentially cause bowel obstruction",
    "The gastrocolic reflex is strongest after the first meal of the day - encourage toileting attempts after breakfast",
    "In palliative care, constipation management is a priority quality-of-life issue; bulk-forming agents are avoided as patients often cannot maintain adequate fluid intake",
    "Bristol Stool Scale: Type 1 (separate hard lumps) and Type 2 (sausage-shaped but lumpy) indicate constipation; Type 3-4 are normal; Type 5-7 indicate increasingly loose stool"
  ],
  quiz: [
    {
      question: "A patient receiving opioid analgesics for chronic pain reports no bowel movement for 4 days. Which medication combination should the nurse anticipate being prescribed for opioid-induced constipation?",
      options: [
        "Loperamide and bismuth subsalicylate",
        "Senna and docusate sodium",
        "Psyllium fibre alone",
        "Metoclopramide and ondansetron"
      ],
      correct: 1,
      rationale: "Senna (stimulant laxative) combined with docusate sodium (stool softener) is the standard first-line combination for opioid-induced constipation. The stimulant counteracts opioid-mediated reduction in peristalsis, while the softener facilitates stool passage. Tolerance to opioid-induced constipation rarely develops, so ongoing treatment is needed. Bulk-forming agents alone are often insufficient and can worsen OIC if fluid intake is inadequate."
    },
    {
      question: "An elderly patient with a history of fecal impaction now has frequent small amounts of liquid stool. The patient states they have diarrhea. What is the priority nursing action?",
      options: [
        "Administer loperamide as needed for diarrhea",
        "Increase oral fluid intake and dietary fibre",
        "Perform abdominal assessment and check for fecal impaction",
        "Restrict oral intake and prepare for stool culture"
      ],
      correct: 2,
      rationale: "Liquid stool in a patient with a history of fecal impaction strongly suggests overflow diarrhea, where liquid stool seeps around an impacted fecal mass. Administering anti-diarrheal medication would worsen the impaction. The priority is to assess for impaction through abdominal palpation and, if ordered, digital rectal examination. Treatment involves disimpaction and establishment of a regular bowel regimen."
    },
    {
      question: "A nurse is teaching a patient about bisacodyl tablets. Which instruction is most important to include?",
      options: [
        "Take the tablet with a full glass of milk to reduce stomach upset",
        "Crush the tablet and mix with applesauce if swallowing is difficult",
        "Swallow the tablet whole and do not take it with milk or antacids",
        "Take the tablet immediately before a meal for best results"
      ],
      correct: 2,
      rationale: "Bisacodyl tablets have an enteric coating that prevents dissolution in the stomach, where the drug would cause gastric irritation and vomiting. Milk and antacids raise gastric pH and dissolve the enteric coating prematurely. Crushing the tablet also destroys the coating. The tablet must be swallowed whole with water."
    }
  ]
},

"diarrhea-management-rpn": {
  title: "Diarrhea Management",
  cellular: {
    title: "Pathophysiology of Diarrhea",
    content: "Diarrhea is defined as the passage of three or more loose or watery stools per day, or more frequent passage than is normal for the individual. It is classified by duration: acute (less than 14 days), persistent (14-30 days), and chronic (greater than 30 days). Understanding the four pathophysiologic mechanisms is essential for targeted management.\n\nOsmotic diarrhea occurs when poorly absorbed solutes create an osmotic gradient that draws water into the intestinal lumen. Classic causes include lactose intolerance (undigested lactose draws water), magnesium-containing laxatives or antacids, sorbitol or mannitol (sugar-free products), and malabsorption syndromes. A key feature is that osmotic diarrhea stops with fasting or removal of the offending agent.\n\nSecretory diarrhea results from active secretion of electrolytes and water into the intestinal lumen exceeding absorptive capacity. This is mediated by enterotoxins (cholera toxin, E. coli heat-labile toxin) that activate adenylate cyclase or guanylate cyclase, increasing intracellular cAMP or cGMP and driving chloride and water secretion. Secretory diarrhea characteristically persists during fasting and produces large-volume watery stool without blood or white blood cells.\n\nInflammatory (exudative) diarrhea occurs when mucosal inflammation and ulceration impair absorption and cause exudation of mucus, blood, and protein into the lumen. Causes include inflammatory bowel disease (Crohn disease, ulcerative colitis), invasive bacterial infections (Shigella, Salmonella, Campylobacter, C. difficile), and radiation colitis. Stool typically contains blood, mucus, and leukocytes.\n\nMotility-related diarrhea results from altered intestinal transit time. Rapid transit (hypermotility) reduces contact time between chyme and the absorptive mucosal surface. This occurs in irritable bowel syndrome (IBS-D), hyperthyroidism, diabetic autonomic neuropathy, and post-surgical states (vagotomy, short bowel syndrome).\n\nAcute infectious diarrhea is the most common cause globally. Viral gastroenteritis (norovirus, rotavirus) typically causes watery diarrhea with nausea and vomiting lasting 1-3 days. Bacterial causes produce either toxin-mediated watery diarrhea (S. aureus food poisoning within 2-6 hours) or invasive bloody diarrhea (dysentery). C. difficile infection, associated with antibiotic use and healthcare settings, deserves special mention as it produces toxins A and B that cause mucosal inflammation, pseudomembrane formation, and potentially life-threatening toxic megacolon.\n\nThe primary danger of diarrhea is dehydration and electrolyte imbalance. Loss of bicarbonate-rich intestinal fluid causes metabolic acidosis. Potassium loss causes hypokalemia with risk of cardiac arrhythmias. In vulnerable populations (infants, elderly, immunocompromised), dehydration can progress rapidly to hypovolemic shock."
  },
  riskFactors: [
    "Recent antibiotic use (risk factor for C. difficile infection, disrupts normal gut flora)",
    "Travel to endemic areas (traveler's diarrhea from E. coli, Shigella, Giardia, Entamoeba)",
    "Immunocompromised status (HIV/AIDS, chemotherapy, organ transplant) increasing susceptibility to opportunistic infections",
    "Contaminated food or water exposure (inadequate food handling, unpasteurised products)",
    "Hospitalization and healthcare facility residence (C. difficile, norovirus outbreaks)",
    "Chronic conditions: inflammatory bowel disease, irritable bowel syndrome, celiac disease, hyperthyroidism",
    "Medications: laxatives, magnesium-containing antacids, metformin, colchicine, SSRIs, proton pump inhibitors",
    "Enteral tube feeding (osmolality, rate, contamination issues)",
    "Extremes of age (infants and elderly most vulnerable to dehydration)",
    "Lactose intolerance or other food intolerances"
  ],
  diagnostics: [
    "Stool assessment: frequency, consistency, volume, colour (bloody, melanotic, fatty), presence of mucus, and relationship to food intake or fasting",
    "Stool culture and sensitivity for bacterial pathogens when infectious cause suspected (bloody stool, fever, recent travel, prolonged duration)",
    "C. difficile toxin assay (PCR or enzyme immunoassay) for healthcare-associated diarrhea or diarrhea following antibiotic use",
    "Ova and parasites examination (three specimens recommended) for persistent diarrhea, travel history, or immunocompromised patients",
    "Blood work: CBC (leukocytosis suggests infection/inflammation), BMP (electrolytes, BUN/creatinine for dehydration assessment), albumin (chronic diarrhea)",
    "Fecal occult blood test to detect non-visible GI bleeding",
    "Stool osmolality and osmotic gap to differentiate osmotic from secretory diarrhea",
    "Celiac serology (tissue transglutaminase IgA antibodies) for chronic diarrhea evaluation"
  ],
  management: [
    "Oral rehydration therapy (ORT) is the cornerstone of management: solutions containing glucose, sodium, potassium, and bicarbonate to replace losses; for mild-moderate dehydration in adults, clear fluids with electrolyte supplementation",
    "IV fluid resuscitation (normal saline or lactated Ringer) for severe dehydration, inability to tolerate oral fluids, or hemodynamic instability",
    "BRAT diet (bananas, rice, applesauce, toast) is commonly recommended during recovery but should not delay return to normal diet; bland, low-residue foods are generally well tolerated",
    "Loperamide for symptomatic relief of acute non-inflammatory diarrhea in adults; contraindicated in bloody diarrhea, high fever, or suspected C. difficile",
    "Bismuth subsalicylate for mild acute diarrhea and traveler's diarrhea; has antisecretory and antimicrobial properties",
    "Antibiotics for specific indications: moderate-severe traveler's diarrhea (azithromycin, fluoroquinolone), C. difficile (oral vancomycin or fidaxomicin), shigellosis, cholera",
    "C. difficile management: discontinue offending antibiotic if possible, initiate oral vancomycin 125 mg four times daily for 10 days (first-line) or fidaxomicin",
    "Probiotics (Saccharomyces boulardii, Lactobacillus) may have modest benefit in antibiotic-associated diarrhea prevention; evidence limited for treatment"
  ],
  nursingActions: [
    "Assess and document stool characteristics every occurrence: frequency, volume, colour, consistency, presence of blood or mucus, and associated symptoms",
    "Monitor fluid balance: strict intake and output, daily weights, assess for dehydration (mucous membranes, skin turgor, capillary refill, urine output and concentration)",
    "Implement contact precautions for suspected infectious diarrhea until cause is determined; C. difficile requires soap and water hand hygiene as alcohol-based sanitisers do not kill spores",
    "Administer oral rehydration solutions or IV fluids as prescribed; monitor electrolytes and replace as ordered",
    "Provide perianal skin care: gentle cleansing with warm water after each bowel movement, apply barrier cream (zinc oxide, dimethicone), use soft wipes rather than rough tissue",
    "Ensure easy access to bathroom or commode; respond promptly to call lights for patients with urgency",
    "Hold loperamide and report to provider if patient develops bloody stool, high fever, or signs of C. difficile infection",
    "Collect stool specimens as ordered using proper technique: send to lab promptly, label correctly, avoid contamination with urine",
    "Monitor for complications: electrolyte imbalances (hypokalemia symptoms: muscle weakness, cardiac arrhythmias), metabolic acidosis (Kussmaul breathing), hypovolemic shock"
  ],
  assessmentFindings: [
    "Loose, watery stools more than three times daily with urgency and abdominal cramping",
    "Signs of dehydration: dry mucous membranes, poor skin turgor (tenting), concentrated urine, tachycardia, orthostatic hypotension",
    "Abdominal assessment: hyperactive bowel sounds, diffuse tenderness, possible distension",
    "Perianal skin excoriation and breakdown from frequent loose stool contact",
    "Fever suggests infectious or inflammatory etiology",
    "Bloody stool or mucus suggests invasive infection or inflammatory bowel disease",
    "Weight loss (acute fluid loss or chronic malabsorption)"
  ],
  signs: {
    left: [
      "Hyperactive bowel sounds on auscultation",
      "Diffuse abdominal tenderness with cramping",
      "Dry mucous membranes and poor skin turgor",
      "Tachycardia and orthostatic hypotension",
      "Decreased urine output with concentrated urine"
    ],
    right: [
      "Fever (suggests invasive or inflammatory cause)",
      "Bloody or mucoid stool (invasive pathogen or IBD)",
      "Perianal erythema and skin breakdown",
      "Muscle weakness and fatigue (hypokalemia)",
      "Altered mental status in severe dehydration (elderly)"
    ]
  },
  medications: [
    {
      name: "Loperamide",
      type: "Antidiarrheal (Opioid Receptor Agonist - Peripheral)",
      action: "Acts on mu-opioid receptors in the intestinal wall to slow peristalsis, increase intestinal transit time, and enhance water and electrolyte absorption; does not cross blood-brain barrier at therapeutic doses",
      sideEffects: "Constipation, abdominal cramping, bloating, dizziness, nausea; toxic megacolon risk if used in inflammatory or infectious colitis",
      contra: "Bloody diarrhea, high fever, suspected C. difficile infection, children under 2 years, acute ulcerative colitis, bacterial enterocolitis",
      pearl: "Do NOT use in C. difficile, Shigella, or other invasive infections - trapping toxin-producing bacteria in the colon increases risk of toxic megacolon and systemic complications; safe for functional diarrhea and traveler's diarrhea (with antibiotics)"
    },
    {
      name: "Oral Vancomycin",
      type: "Glycopeptide Antibiotic (for C. difficile)",
      action: "Inhibits bacterial cell wall synthesis by binding to D-Ala-D-Ala terminus of peptidoglycan precursors; given orally for C. difficile as it is not absorbed and achieves high intraluminal concentrations",
      sideEffects: "Nausea, abdominal pain, dysgeusia (altered taste); oral form has minimal systemic absorption so systemic side effects are rare",
      contra: "Hypersensitivity to vancomycin; note: oral vancomycin for C. difficile is different from IV vancomycin for systemic infections",
      pearl: "Oral vancomycin is first-line for C. difficile infection; unlike IV vancomycin used for MRSA, oral vancomycin stays in the GI tract to act locally; do NOT substitute IV vancomycin for oral in C. difficile treatment"
    },
    {
      name: "Bismuth Subsalicylate",
      type: "Antidiarrheal/Antisecretory",
      action: "Reduces intestinal secretion through antisecretory prostaglandin effects and has direct antimicrobial activity; also provides a protective coating on intestinal mucosa",
      sideEffects: "Black tongue and black stool (harmless bismuth sulfide), tinnitus with high doses (salicylate toxicity), constipation",
      contra: "Aspirin/salicylate allergy, children with viral illness (Reye syndrome risk from salicylate component), concurrent anticoagulant therapy, renal impairment",
      pearl: "Warn patients that black stool is a harmless side effect and does not indicate GI bleeding; contains salicylate so calculate total salicylate load if patient also takes aspirin; useful for traveler's diarrhea prophylaxis"
    }
  ],
  pearls: [
    "The single most important intervention for diarrhea is fluid and electrolyte replacement - dehydration kills, not the diarrhea itself",
    "Never administer loperamide for diarrhea with fever, bloody stool, or suspected C. difficile - this can cause toxic megacolon",
    "Alcohol-based hand sanitisers do NOT kill C. difficile spores; soap and water hand washing with mechanical friction is required for C. difficile contact precautions",
    "Potassium-rich foods (bananas, potatoes, broth) and oral rehydration solutions are important to replace ongoing potassium losses and prevent hypokalemia",
    "New-onset diarrhea in a patient who received antibiotics within the past 8 weeks should trigger C. difficile testing before starting any anti-diarrheal agent",
    "Assess for fecal impaction with overflow in elderly patients presenting with diarrhea, especially those with a history of constipation or immobility",
    "Enteral feeding diarrhea: consider reducing rate rather than stopping feeds; check for formula contamination, medications administered via tube (especially sorbitol-containing elixirs), and concurrent C. difficile",
    "In children, avoid anti-diarrheal agents; focus on oral rehydration therapy and early refeeding"
  ],
  quiz: [
    {
      question: "A hospitalised patient develops watery diarrhea after receiving 7 days of clindamycin for a wound infection. The stool is positive for C. difficile toxin. Which action should the nurse question?",
      options: [
        "Initiating contact precautions with soap and water hand hygiene",
        "Administering loperamide 4 mg orally to control diarrhea",
        "Discontinuing clindamycin and starting oral vancomycin as prescribed",
        "Monitoring strict intake and output with electrolyte replacement"
      ],
      correct: 1,
      rationale: "Loperamide is contraindicated in C. difficile infection because slowing intestinal motility traps the toxin-producing bacteria in the colon, increasing the risk of toxic megacolon and worsening the infection. Appropriate management includes discontinuing the offending antibiotic, starting oral vancomycin, implementing contact precautions with soap and water (not alcohol-based sanitiser), and monitoring hydration status."
    },
    {
      question: "A patient with acute diarrhea shows tachycardia, dry mucous membranes, and urine output of 15 mL/hour. Which assessment finding would indicate the most critical change?",
      options: [
        "Serum potassium of 3.0 mEq/L",
        "Three loose stools in the past 6 hours",
        "Mild diffuse abdominal tenderness",
        "Temperature of 37.4 C (99.3 F)"
      ],
      correct: 0,
      rationale: "A serum potassium of 3.0 mEq/L (hypokalemia) is the most critical finding as it indicates significant electrolyte loss and places the patient at risk for cardiac arrhythmias, including life-threatening ventricular tachycardia or fibrillation. The patient already shows signs of dehydration. Potassium replacement and cardiac monitoring are priorities."
    },
    {
      question: "When collecting a stool specimen for C. difficile testing, which nursing action is most important?",
      options: [
        "Collect the specimen after administering a laxative to obtain liquid stool",
        "Send only formed stool specimens for the most accurate results",
        "Transport the specimen to the laboratory promptly at room temperature",
        "Combine three separate specimens into one container for batch testing"
      ],
      correct: 2,
      rationale: "C. difficile toxin degrades at room temperature, so prompt transport to the laboratory is essential for accurate results. Only liquid or unformed stool should be tested (not formed stool). Laxatives should not be used to induce specimens as this can produce false positives. Each specimen should be collected and sent individually."
    }
  ]
},

"diverticulitis-rpn": {
  title: "Diverticulitis",
  cellular: {
    title: "Pathophysiology of Diverticular Disease",
    content: "Diverticular disease encompasses two related conditions: diverticulosis (the presence of diverticula) and diverticulitis (inflammation or infection of diverticula). Diverticula are small pouch-like herniations of the colonic mucosa and submucosa through weakened areas of the muscular layer, typically at points where blood vessels (vasa recta) penetrate the circular muscle. This creates false diverticula containing only mucosa and submucosa, unlike true diverticula that contain all bowel wall layers.\n\nThe pathogenesis of diverticulosis involves two key factors: structural weakness in the colonic wall and increased intraluminal pressure. Low dietary fibre leads to reduced stool bulk, which requires the colon to generate higher segmental pressures to propel smaller stool volumes. These elevated pressures act on structurally weakened points in the colonic wall (where vasa recta penetrate), causing mucosal herniation. Age-related changes in collagen composition and elasticity further weaken the bowel wall, explaining why diverticulosis prevalence increases from less than 10% at age 40 to over 60% by age 80.\n\nDiverticulosis is predominantly left-sided (95% involve the sigmoid colon) in Western populations due to the sigmoid colon's smaller diameter (Laplace law: pressure is inversely related to radius) and its role as a high-pressure zone for stool storage and propulsion.\n\nDiverticulitis develops when a diverticulum becomes obstructed, typically by inspissated stool (fecalith), leading to bacterial overgrowth, local ischemia from luminal distension compressing the blood supply, microperforation, and pericolic inflammation. The severity ranges from uncomplicated (localised inflammation, 75% of cases) to complicated (abscess formation, perforation with peritonitis, fistula, or obstruction).\n\nThe Hinchey classification stages complicated diverticulitis: Stage I is a confined pericolic abscess, Stage II is a distant abscess (pelvic or retroperitoneal), Stage III is purulent peritonitis from ruptured abscess, and Stage IV is fecal peritonitis from free perforation. Stages III and IV are surgical emergencies with significant mortality.\n\nChronic or recurrent diverticulitis can lead to fibrosis and stricture formation, causing progressive colonic narrowing and potential large bowel obstruction. Colovesical fistula (between colon and bladder) is the most common fistula complication, presenting with pneumaturia (air in urine) and recurrent urinary tract infections."
  },
  riskFactors: [
    "Low dietary fibre intake (most significant modifiable risk factor)",
    "Age over 50 years (prevalence increases with each decade due to colonic wall changes)",
    "Obesity (BMI greater than 30 associated with increased risk of diverticulitis and complications)",
    "Sedentary lifestyle with lack of regular physical activity",
    "Smoking (increases risk of complications and perforation)",
    "NSAID and corticosteroid use (increased risk of perforation and complicated diverticulitis)",
    "Western diet high in red meat and refined carbohydrates",
    "Immunocompromised state (higher risk of perforation, delayed diagnosis due to blunted inflammatory response)",
    "Family history of diverticular disease (genetic component in connective tissue integrity)"
  ],
  diagnostics: [
    "CT abdomen and pelvis with IV contrast is the gold standard for diagnosing acute diverticulitis: demonstrates colonic wall thickening, pericolic fat stranding, and identifies complications (abscess, perforation, fistula)",
    "CBC: leukocytosis with left shift indicates infection; may be absent in immunocompromised or elderly patients",
    "CRP (C-reactive protein): elevated in acute inflammation; useful for monitoring treatment response",
    "Blood cultures if signs of sepsis (fever, tachycardia, hypotension, altered mental status)",
    "Urinalysis: may show pyuria and bacteriuria if colovesical fistula is present",
    "Colonoscopy is CONTRAINDICATED during acute diverticulitis due to perforation risk; performed 6-8 weeks after resolution to rule out colorectal cancer and assess extent of disease",
    "Abdominal X-ray: may show ileus pattern, free air under diaphragm (perforation), or obstruction"
  ],
  management: [
    "Uncomplicated diverticulitis (mild symptoms, no complications): outpatient management with oral antibiotics (ciprofloxacin + metronidazole or amoxicillin-clavulanate for 7-10 days), clear liquid diet progressing to low-residue diet as tolerated",
    "Recent evidence suggests select cases of uncomplicated diverticulitis may be managed without antibiotics with close follow-up, but this remains provider-dependent",
    "Complicated diverticulitis with abscess: IV antibiotics, bowel rest (NPO), IV fluid resuscitation; CT-guided percutaneous drainage for abscesses greater than 3-4 cm",
    "Surgical intervention required for: perforation with peritonitis (Hinchey III-IV), failure of conservative management, recurrent episodes, fistula, obstruction, or inability to exclude malignancy",
    "Hartmann procedure (sigmoid resection with end colostomy) for emergency surgery with peritonitis; primary anastomosis with or without diverting ileostomy for less contaminated cases",
    "After acute episode resolution: gradual transition to high-fibre diet (25-30 g/day) with adequate fluid intake to prevent recurrence",
    "Colonoscopy 6-8 weeks post-recovery to rule out colorectal cancer, which can mimic diverticulitis"
  ],
  nursingActions: [
    "Assess pain: location (typically left lower quadrant), intensity, quality, aggravating and alleviating factors; report sudden worsening which may indicate perforation",
    "Monitor vital signs for signs of sepsis: fever, tachycardia, hypotension, tachypnea; implement sepsis screening tool if applicable",
    "Maintain NPO status or clear liquid diet as ordered; advance diet gradually as symptoms improve and bowel function returns",
    "Administer IV antibiotics on schedule; monitor for adverse effects and therapeutic response (decreasing WBC, temperature, pain)",
    "Monitor intake and output; maintain IV fluid therapy as ordered to prevent dehydration during NPO period",
    "Assess abdomen regularly: auscultate bowel sounds, palpate gently for tenderness and guarding, measure abdominal girth if distension present",
    "Report immediately: sudden increase in pain, rigid abdomen (board-like), rebound tenderness, absent bowel sounds, new-onset fever - these suggest perforation or peritonitis",
    "Post-surgical care: monitor stoma output if Hartmann procedure performed, manage wound care, early ambulation to prevent complications",
    "Provide discharge education: high-fibre diet after recovery, adequate fluid intake, recognise signs of recurrence, importance of follow-up colonoscopy"
  ],
  assessmentFindings: [
    "Left lower quadrant (LLQ) pain - the hallmark presentation, often described as crampy progressing to constant; sometimes called 'left-sided appendicitis'",
    "Low-grade fever (38-39 C) in uncomplicated cases; high fever suggests abscess or perforation",
    "Localised LLQ tenderness with possible guarding on palpation",
    "Altered bowel pattern: constipation more common than diarrhea, though either may occur",
    "Nausea with or without vomiting",
    "Urinary symptoms if inflammation is adjacent to the bladder (frequency, urgency, dysuria)",
    "Abdominal distension if obstruction or ileus develops"
  ],
  signs: {
    left: [
      "Left lower quadrant pain and tenderness (most common presentation)",
      "Low-grade fever (uncomplicated) or high fever (complicated)",
      "Localised guarding over the sigmoid colon",
      "Leukocytosis with left shift on CBC",
      "Elevated CRP"
    ],
    right: [
      "Rebound tenderness and rigidity (suggests peritonitis - surgical emergency)",
      "Absent bowel sounds (suggests ileus or perforation)",
      "Pneumaturia or fecaluria (air or stool in urine - colovesical fistula)",
      "Palpable abdominal mass (suggests abscess)",
      "Signs of sepsis: tachycardia, hypotension, altered mental status"
    ]
  },
  medications: [
    {
      name: "Ciprofloxacin",
      type: "Fluoroquinolone Antibiotic",
      action: "Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication and transcription; provides broad gram-negative coverage",
      sideEffects: "Tendinopathy and tendon rupture (especially Achilles, risk increases with corticosteroid use and age >60), peripheral neuropathy, C. difficile-associated diarrhea, photosensitivity, QT prolongation",
      contra: "Known QT prolongation, concurrent Class IA or III antiarrhythmics, myasthenia gravis (may worsen muscle weakness), pregnancy",
      pearl: "Always paired with metronidazole for diverticulitis to provide anaerobic coverage; FDA black box warning for tendon rupture - educate patients to report tendon pain immediately and stop the drug"
    },
    {
      name: "Metronidazole",
      type: "Nitroimidazole Antibiotic/Antiprotozoal",
      action: "Enters bacterial cells where it is reduced to reactive intermediates that damage DNA, causing cell death; excellent activity against anaerobic bacteria and select parasites",
      sideEffects: "Metallic taste, nausea, disulfiram-like reaction with alcohol (severe vomiting, flushing, headache), peripheral neuropathy with prolonged use, dark urine",
      contra: "Concurrent alcohol consumption (wait 48-72 hours after last dose before drinking), first trimester of pregnancy, known hypersensitivity",
      pearl: "The disulfiram-like reaction with alcohol is critical patient education - patients must avoid ALL alcohol including mouthwash and cooking wine during therapy and for 48-72 hours after completion; monitor for peripheral neuropathy with courses exceeding 14 days"
    },
    {
      name: "Amoxicillin-Clavulanate",
      type: "Beta-Lactam Antibiotic with Beta-Lactamase Inhibitor",
      action: "Amoxicillin inhibits bacterial cell wall synthesis; clavulanate irreversibly inhibits beta-lactamase enzymes that would otherwise destroy amoxicillin, extending coverage to beta-lactamase producing organisms",
      sideEffects: "Diarrhea (most common, due to disruption of normal gut flora), nausea, rash, vaginal candidiasis, allergic reactions including anaphylaxis in penicillin-allergic patients",
      contra: "Penicillin allergy (cross-reactivity), history of cholestatic jaundice with previous amoxicillin-clavulanate use, infectious mononucleosis (high risk of maculopapular rash)",
      pearl: "Alternative single-agent option to ciprofloxacin + metronidazole for outpatient diverticulitis management; take with food to reduce GI side effects and improve absorption of clavulanate; diarrhea is the most common side effect due to clavulanate component"
    }
  ],
  pearls: [
    "Left lower quadrant pain with fever and leukocytosis in a patient over 50 is diverticulitis until proven otherwise",
    "Colonoscopy is CONTRAINDICATED during acute diverticulitis due to risk of perforation; schedule 6-8 weeks after resolution to rule out colorectal cancer",
    "Board-like rigidity, rebound tenderness, and absent bowel sounds are signs of perforation with peritonitis - report immediately as this is a surgical emergency",
    "The old advice to avoid seeds, nuts, and popcorn has been disproven; these foods do not increase diverticulitis risk and may actually be protective due to their fibre content",
    "Right-sided diverticulitis is more common in Asian populations and younger patients - do not dismiss right-sided presentation",
    "Immunocompromised patients (on steroids, chemotherapy, or immunosuppressants) may present with minimal symptoms despite severe disease - maintain a high index of suspicion",
    "After recovery from acute diverticulitis, gradually increase dietary fibre to 25-30 g/day over several weeks to prevent recurrence",
    "Pneumaturia (passing air during urination) or recurrent UTIs with mixed bowel organisms strongly suggest colovesical fistula"
  ],
  quiz: [
    {
      question: "A 62-year-old patient presents with left lower quadrant pain, fever of 38.6 C, and WBC of 14,500. CT shows sigmoid diverticulitis with a 5 cm pericolic abscess. Which intervention does the nurse anticipate?",
      options: [
        "Immediate colonoscopy to visualise the diverticula",
        "Oral antibiotics and high-fibre diet with outpatient follow-up",
        "IV antibiotics, bowel rest, and CT-guided percutaneous drainage",
        "Oral bisacodyl to promote bowel evacuation and relieve obstruction"
      ],
      correct: 2,
      rationale: "A 5 cm pericolic abscess requires IV antibiotics, bowel rest (NPO), and CT-guided percutaneous drainage (abscesses > 3-4 cm generally require drainage). Colonoscopy is contraindicated during acute diverticulitis. Outpatient oral antibiotics are appropriate for uncomplicated diverticulitis without abscess. Laxatives should not be used during acute episodes."
    },
    {
      question: "A patient recovering from acute diverticulitis asks whether they need to avoid eating seeds and nuts permanently. What is the most accurate nursing response?",
      options: [
        "Yes, seeds and nuts can lodge in diverticula and cause another attack",
        "Current evidence does not support restricting seeds and nuts; a high-fibre diet including these foods may help prevent recurrence",
        "Only avoid peanuts and sunflower seeds; other nuts are safe to eat",
        "Seeds and nuts should be avoided for 6 months, then gradually reintroduced"
      ],
      correct: 1,
      rationale: "Large prospective studies have found no association between nut, seed, or popcorn consumption and diverticulitis risk. The recommendation to avoid these foods has been abandoned in current clinical guidelines. In fact, these foods are sources of dietary fibre which is protective against diverticular disease recurrence."
    },
    {
      question: "During assessment of a patient with known diverticulitis, the nurse notes sudden severe abdominal pain, a rigid abdomen, absent bowel sounds, and tachycardia. What is the priority action?",
      options: [
        "Administer the next scheduled dose of oral antibiotics",
        "Position the patient on their left side and apply warm compresses",
        "Notify the provider immediately as these findings suggest perforation",
        "Encourage the patient to ambulate to stimulate bowel function"
      ],
      correct: 2,
      rationale: "A sudden increase in pain, rigid abdomen, absent bowel sounds, and tachycardia are classic signs of colonic perforation with peritonitis - a surgical emergency. The priority is immediate notification of the provider for emergent surgical evaluation. Delaying notification to administer oral medications, apply compresses, or ambulate could be life-threatening."
    }
  ]
},

"crohns-disease-basics-rpn": {
  title: "Crohn Disease Basics",
  cellular: {
    title: "Pathophysiology of Crohn Disease",
    content: "Crohn disease is a chronic, relapsing inflammatory bowel disease characterised by transmural (full-thickness) inflammation that can affect any portion of the gastrointestinal tract from mouth to anus. It most commonly involves the terminal ileum and proximal colon (ileocolonic pattern, 40% of cases), followed by small bowel only (30%) and colon only (30%).\n\nThe pathogenesis involves a dysregulated immune response to intestinal microbiota in genetically susceptible individuals, triggered by environmental factors. The NOD2/CARD15 gene on chromosome 16 was the first identified susceptibility gene, involved in bacterial recognition by innate immune cells. Over 200 genetic loci have now been associated with Crohn disease.\n\nIn the normal gut, the epithelial barrier separates luminal bacteria from the underlying immune cells. In Crohn disease, defects in barrier function allow bacterial translocation, which activates dendritic cells and macrophages in the lamina propria. These cells produce pro-inflammatory cytokines, particularly tumor necrosis factor-alpha (TNF-alpha), interleukin-12, and interleukin-23, which drive a Th1/Th17-mediated immune response. This creates a self-perpetuating cycle of inflammation, tissue injury, further barrier disruption, and increased bacterial translocation.\n\nTransmural inflammation is the hallmark of Crohn disease, distinguishing it from ulcerative colitis which is limited to the mucosa and submucosa. Full-thickness involvement results in several characteristic complications: deep fissuring ulcers, non-caseating granulomas (found in approximately 30% of biopsies), fistula formation (tracts between the bowel and other structures - enterocutaneous, enteroenteric, enterovesical, perianal), abscesses, and fibrotic strictures causing bowel obstruction.\n\nThe disease is characteristically discontinuous with 'skip lesions' - segments of inflamed bowel separated by normal-appearing mucosa. Endoscopically, the mucosa has a 'cobblestone' appearance created by intersecting linear ulcers surrounding islands of edematous mucosa. 'Creeping fat' (mesenteric fat wrapping around the serosal surface) is a distinctive gross finding at surgery.\n\nExtraintestinal manifestations are common (25-40% of patients) and can affect virtually any organ system. Joint involvement (peripheral arthritis, sacroiliitis, ankylosing spondylitis) is most common. Other manifestations include erythema nodosum and pyoderma gangrenosum (skin), uveitis and episcleritis (eyes), primary sclerosing cholangitis (liver), and nephrolithiasis (kidney). Some extraintestinal manifestations parallel intestinal disease activity (erythema nodosum, peripheral arthritis), while others follow an independent course (primary sclerosing cholangitis, ankylosing spondylitis).\n\nNutritional deficiencies are prevalent due to malabsorption (especially with ileal disease), decreased oral intake from pain and anorexia, and chronic inflammation increasing metabolic demands. Iron deficiency anemia, B12 deficiency (terminal ileum absorption site), folate deficiency, calcium and vitamin D deficiency, and protein-calorie malnutrition are common and require monitoring."
  },
  riskFactors: [
    "Family history (first-degree relative with IBD confers 5-20 fold increased risk)",
    "Genetic predisposition (NOD2/CARD15 mutations, over 200 susceptibility loci identified)",
    "Smoking (doubles the risk of developing Crohn disease and worsens disease course, increases relapse and surgical rates - the single most important modifiable risk factor)",
    "Age of onset typically 15-35 years (bimodal distribution with second smaller peak at 55-65 years)",
    "Northern European and Ashkenazi Jewish ancestry (highest prevalence populations)",
    "Urban living and industrialised environments (related to hygiene hypothesis and altered microbiome)",
    "History of appendectomy (may increase risk, unlike protective effect in ulcerative colitis)",
    "NSAID use may trigger flares or unmask subclinical disease",
    "Stress does not cause Crohn disease but may trigger or exacerbate flares"
  ],
  diagnostics: [
    "Ileocolonoscopy with biopsies is the primary diagnostic tool: reveals skip lesions, aphthous ulcers, cobblestoning, strictures, and fistula openings; biopsies may show non-caseating granulomas",
    "CT enterography or MR enterography to evaluate small bowel involvement not accessible by colonoscopy; identifies wall thickening, strictures, fistulae, and abscesses",
    "Blood work: CBC (anemia, leukocytosis), CRP and ESR (inflammatory markers), albumin (nutritional status), iron studies, B12, folate, 25-OH vitamin D",
    "Fecal calprotectin: non-invasive marker of intestinal inflammation; useful for differentiating IBD from IBS and monitoring disease activity",
    "Stool studies: C. difficile toxin and culture to rule out infectious causes before initiating or escalating immunosuppressive therapy",
    "Upper GI endoscopy if upper GI symptoms present (oropharyngeal or esophageal/gastric Crohn)",
    "Capsule endoscopy for suspected small bowel Crohn when CT/MR enterography is inconclusive; contraindicated if stricture is suspected (capsule retention risk)"
  ],
  management: [
    "Induction of remission: corticosteroids (prednisone, budesonide for ileal/right-sided disease) for moderate-severe flares; aminosalicylates (mesalamine) for mild colonic disease only",
    "Maintenance of remission: immunomodulators (azathioprine, 6-mercaptopurine, methotrexate) and/or biologic therapy (anti-TNF agents: infliximab, adalimumab; anti-integrin: vedolizumab; anti-IL-12/23: ustekinumab)",
    "Biologic therapy increasingly used as first-line for moderate-severe disease (top-down approach) rather than waiting for failure of conventional therapies (step-up approach)",
    "Antibiotic therapy (ciprofloxacin + metronidazole) for perianal disease, fistulae, and abscesses",
    "Nutritional support: exclusive enteral nutrition is first-line for paediatric Crohn disease induction; supplementation of iron, B12, folate, calcium, vitamin D as needed",
    "Smoking cessation is critical: smoking doubles relapse rate and surgical risk",
    "Surgical intervention for complications: strictureplasty for short strictures, resection for refractory disease or complicated strictures, abscess drainage, fistula repair; surgery is not curative and recurrence is common (50% within 5 years at the anastomotic site)"
  ],
  nursingActions: [
    "Assess stool pattern: frequency, consistency, presence of blood and mucus, nocturnal stools (suggests organic disease), urgency, and tenesmus",
    "Monitor nutritional status: daily weights, serum albumin, dietary intake assessment, BMI trending; collaborate with dietitian for nutritional planning",
    "Assess for extraintestinal manifestations: joint pain and swelling, skin lesions (erythema nodosum - tender red nodules on shins; pyoderma gangrenosum - deep necrotic ulcers), eye symptoms (pain, redness, vision changes)",
    "Administer immunosuppressive and biologic medications as prescribed; monitor for infusion reactions during IV biologic therapy (infliximab): fever, chills, dyspnea, chest pain, hypotension",
    "Educate on infection prevention while on immunosuppressive therapy: avoid live vaccines, report fever or signs of infection promptly, annual influenza vaccine (inactivated), ensure up-to-date immunisations before starting biologics",
    "Monitor for corticosteroid side effects: hyperglycemia (check blood glucose regularly), mood changes, insomnia, increased appetite, moon facies, adrenal suppression with prolonged use (never abruptly discontinue - must taper)",
    "Assess perianal area for fistulae, fissures, abscesses, and skin breakdown; provide meticulous perianal skin care",
    "Support psychosocial well-being: chronic disease affects body image, social functioning, and mental health; refer to support groups and counseling as appropriate",
    "Pre-operative teaching if surgery planned: explain that Crohn disease is not cured by surgery, discuss potential for ostomy, emphasise importance of continued medication adherence post-operatively"
  ],
  assessmentFindings: [
    "Chronic or intermittent diarrhea (often non-bloody in small bowel disease), abdominal pain (commonly right lower quadrant with ileal involvement)",
    "Weight loss, fatigue, and anorexia reflecting chronic inflammation and malabsorption",
    "Palpable right lower quadrant mass or fullness (inflamed terminal ileum or abscess)",
    "Perianal disease: fistulae, fissures, skin tags, abscesses (may be the presenting feature)",
    "Fever (low-grade during flares, high fever suggests abscess or perforation)",
    "Signs of malnutrition: muscle wasting, peripheral edema (hypoalbuminemia), angular cheilitis (B-vitamin deficiency), glossitis",
    "Extraintestinal findings: joint swelling, erythema nodosum, mouth ulcers (aphthous stomatitis), eye redness"
  ],
  signs: {
    left: [
      "Chronic diarrhea with abdominal cramping",
      "Right lower quadrant pain and tenderness",
      "Weight loss and malnutrition",
      "Perianal fistulae, fissures, or abscess",
      "Fatigue and low-grade fever"
    ],
    right: [
      "Palpable abdominal mass (suggests abscess or phlegmon)",
      "Signs of bowel obstruction (distension, vomiting, absent flatus)",
      "Erythema nodosum (tender nodules on shins)",
      "Joint swelling and pain (enteropathic arthritis)",
      "Growth failure in children and adolescents"
    ]
  },
  medications: [
    {
      name: "Budesonide (Entocort)",
      type: "Corticosteroid (Locally Acting)",
      action: "Potent anti-inflammatory corticosteroid with high topical activity in the ileum and right colon; extensive first-pass hepatic metabolism limits systemic bioavailability to approximately 10%, reducing systemic side effects compared to prednisone",
      sideEffects: "Moon facies, acne, insomnia, mood changes (less than systemic steroids); adrenal suppression still possible with prolonged use; hyperglycemia",
      contra: "Systemic fungal infections, hepatic cirrhosis (reduces first-pass metabolism, increasing systemic exposure), concurrent strong CYP3A4 inhibitors",
      pearl: "First-line corticosteroid for mild-moderate ileal and right-sided colonic Crohn disease due to fewer systemic side effects than prednisone; NOT effective for left-sided colonic or rectal disease; must be tapered, not stopped abruptly"
    },
    {
      name: "Infliximab (Remicade)",
      type: "Biologic - Anti-TNF-alpha Monoclonal Antibody",
      action: "Chimeric monoclonal antibody that binds to both soluble and membrane-bound TNF-alpha, neutralising this key pro-inflammatory cytokine and inducing apoptosis of TNF-expressing inflammatory cells",
      sideEffects: "Infusion reactions (fever, chills, pruritus, dyspnea, hypotension), increased risk of serious infections (tuberculosis reactivation, opportunistic infections), hepatotoxicity, rare risk of lymphoma (particularly hepatosplenic T-cell lymphoma in young males on combination therapy with thiopurines), demyelinating disorders",
      contra: "Active serious infection, untreated latent tuberculosis, moderate-severe heart failure (NYHA class III-IV), known hypersensitivity, concurrent live vaccines",
      pearl: "TB screening (tuberculin skin test or interferon-gamma release assay + chest X-ray) is MANDATORY before starting any anti-TNF therapy due to risk of TB reactivation; hepatitis B screening also required; given as IV infusion over minimum 2 hours - monitor patient throughout and for 1 hour post-infusion"
    },
    {
      name: "Azathioprine",
      type: "Immunomodulator (Thiopurine Antimetabolite)",
      action: "Converted to 6-mercaptopurine and then to active metabolites (6-thioguanine nucleotides) that are incorporated into DNA, inhibiting purine synthesis and suppressing T-cell and B-cell proliferation",
      sideEffects: "Bone marrow suppression (leukopenia, thrombocytopenia - dose-dependent), hepatotoxicity, pancreatitis (3-4%, typically early and idiosyncratic), nausea, increased infection risk, increased risk of non-melanoma skin cancer and lymphoma with long-term use",
      contra: "Pregnancy (teratogenic - requires reliable contraception), severe bone marrow suppression, known TPMT or NUDT15 deficiency (risk of fatal myelosuppression)",
      pearl: "TPMT enzyme testing is REQUIRED before starting therapy - patients with low or absent TPMT activity metabolise azathioprine to toxic levels causing life-threatening bone marrow suppression; monitor CBC every 1-2 weeks initially, then monthly; takes 3-6 months for full therapeutic effect (not useful for acute flares)"
    },
    {
      name: "Mesalamine (5-ASA)",
      type: "Aminosalicylate Anti-inflammatory",
      action: "Topical anti-inflammatory agent that acts locally on the intestinal mucosa; inhibits prostaglandin and leukotriene synthesis, scavenges free radicals, and inhibits NF-kB activation in mucosal epithelial cells",
      sideEffects: "Headache, nausea, abdominal pain, diarrhea (paradoxical), rash, rare nephrotoxicity (interstitial nephritis), rare pancreatitis",
      contra: "Salicylate hypersensitivity, severe renal impairment, severe hepatic impairment",
      pearl: "More effective in ulcerative colitis than Crohn disease; in Crohn disease, role is limited to mild colonic disease; different formulations target different bowel segments (Asacol targets terminal ileum/colon; Pentasa releases throughout small bowel and colon); monitor renal function annually"
    }
  ],
  pearls: [
    "Crohn disease is transmural (full-thickness) with skip lesions anywhere from mouth to anus; ulcerative colitis is mucosal only and continuous starting from the rectum - this distinction is fundamental for boards and clinical practice",
    "Smoking is the single most important modifiable risk factor - it doubles relapse rates and surgical risk; this is opposite to ulcerative colitis where smoking is protective",
    "TB screening is mandatory before starting any anti-TNF biologic therapy (infliximab, adalimumab) due to risk of reactivation of latent tuberculosis",
    "Never abruptly stop corticosteroids in patients on prolonged therapy - adrenal suppression causes potentially life-threatening Addisonian crisis; always taper gradually",
    "Right lower quadrant pain in a young patient may be confused with appendicitis; Crohn disease should be considered in the differential, especially with a history of chronic diarrhea",
    "Fecal calprotectin is a valuable non-invasive test to monitor disease activity and differentiate IBD from IBS without repeated colonoscopies",
    "Perianal disease (fistulae, abscesses, fissures) may be the first presenting feature of Crohn disease, even before intestinal symptoms develop",
    "B12 deficiency should be monitored in patients with terminal ileal disease or ileal resection, as the terminal ileum is the exclusive absorption site for the B12-intrinsic factor complex"
  ],
  quiz: [
    {
      question: "A patient newly diagnosed with Crohn disease is prescribed infliximab. Which test must be completed BEFORE initiating therapy?",
      options: [
        "Fecal calprotectin level",
        "Tuberculosis screening (TST or IGRA and chest X-ray)",
        "Colonoscopy with biopsies",
        "DEXA scan for bone density"
      ],
      correct: 1,
      rationale: "Tuberculosis screening is mandatory before starting any anti-TNF biologic therapy. Anti-TNF agents suppress TNF-alpha, which is essential for containing latent TB granulomas. Without screening and treatment of latent TB, there is a significant risk of reactivation to active, potentially disseminated tuberculosis, which can be fatal in immunosuppressed patients."
    },
    {
      question: "A nurse is educating a patient with Crohn disease about modifiable lifestyle factors. Which recommendation has the strongest evidence for reducing disease flares?",
      options: [
        "Avoiding all dairy products permanently",
        "Following a strict gluten-free diet",
        "Smoking cessation",
        "Eliminating fibre from the diet"
      ],
      correct: 2,
      rationale: "Smoking cessation is the single most important modifiable risk factor for Crohn disease. Smoking doubles the relapse rate, increases the need for surgery, and worsens disease course. There is no evidence supporting blanket elimination of dairy, gluten, or fibre in Crohn disease, though individual patients may identify personal trigger foods."
    },
    {
      question: "Which assessment finding most clearly distinguishes Crohn disease from ulcerative colitis?",
      options: [
        "Bloody diarrhea with urgency and tenesmus",
        "Continuous inflammation starting from the rectum",
        "Perianal fistulae and skip lesions on colonoscopy",
        "Elevated fecal calprotectin level"
      ],
      correct: 2,
      rationale: "Perianal fistulae and skip lesions (segments of inflamed bowel separated by normal mucosa) are characteristic of Crohn disease's transmural, discontinuous inflammation pattern. Bloody diarrhea and continuous rectal inflammation are more typical of ulcerative colitis. Fecal calprotectin is elevated in both conditions and cannot distinguish between them."
    }
  ]
},

"ulcerative-colitis-basics-rpn": {
  title: "Ulcerative Colitis Basics",
  cellular: {
    title: "Pathophysiology of Ulcerative Colitis",
    content: "Ulcerative colitis (UC) is a chronic inflammatory bowel disease characterised by diffuse, continuous mucosal and submucosal inflammation of the colon and rectum. Unlike Crohn disease, UC invariably involves the rectum and extends proximally in a continuous pattern without skip lesions. The disease is classified by extent: ulcerative proctitis (rectum only, 30-40%), left-sided colitis (up to the splenic flexure, 30-40%), and pancolitis (extending beyond the splenic flexure, 20-30%).\n\nThe pathogenesis shares features with Crohn disease: a dysregulated immune response to commensal gut bacteria in genetically predisposed individuals. However, the immunologic profile differs. UC is characterised by a Th2-dominant response with increased production of IL-4, IL-5, IL-13, and natural killer T cells. IL-13 is particularly important as it disrupts epithelial tight junctions, increases epithelial permeability, and induces epithelial cell apoptosis.\n\nInflammation in UC is superficial, affecting the mucosa and submucosa only (not transmural as in Crohn disease). The inflammatory infiltrate damages crypts (the glands of the colonic mucosa), producing cryptitis (neutrophil invasion of crypts) and crypt abscesses (accumulation of neutrophils within crypt lumens). Progressive crypt destruction leads to mucosal ulceration, with residual surviving mucosa forming inflammatory polyps (pseudopolyps) that project above the denuded surface.\n\nThe continuous nature of inflammation, always starting at the rectum and extending proximally, is a key diagnostic feature. The transition between inflamed and normal mucosa is typically abrupt. Chronic inflammation leads to loss of haustral folds, muscular shortening, and the characteristic 'lead pipe' appearance on imaging where the colon appears as a featureless tube.\n\nThe most feared acute complication is toxic megacolon, defined as total or segmental non-obstructive colonic dilatation (transverse colon diameter greater than 6 cm on plain radiograph) with systemic toxicity. It occurs when inflammation extends through the muscularis propria, causing loss of muscular tone and massive dilation. Without treatment, toxic megacolon progresses to perforation, peritonitis, and death.\n\nLong-term UC carries a significant colorectal cancer risk that increases with disease duration and extent. After 8-10 years of pancolitis, the risk begins to increase, reaching approximately 5-10% after 20 years and 12-20% after 30 years. Dysplasia-carcinoma surveillance colonoscopy is essential, typically beginning 8 years after diagnosis for pancolitis.\n\nUC has a unique relationship with smoking: current smoking appears to be protective, and disease onset or flares commonly occur after smoking cessation. However, smoking is never recommended as therapy given its systemic health risks. Appendectomy before age 20, performed for appendicitis, also appears to reduce UC risk."
  },
  riskFactors: [
    "Family history of inflammatory bowel disease (first-degree relative confers 10-15 fold increased risk for UC)",
    "Age of onset typically 15-40 years with a second smaller peak at 50-80 years",
    "Ashkenazi Jewish and Northern European ancestry",
    "Recent smoking cessation (smoking is paradoxically protective in UC; flares commonly follow quitting)",
    "NSAID use may exacerbate existing disease or trigger flares",
    "Urban living and westernised lifestyle",
    "History of enteric infection (Salmonella, Campylobacter) may trigger onset in genetically susceptible individuals",
    "Previous C. difficile infection (associated with worse outcomes in UC patients)"
  ],
  diagnostics: [
    "Colonoscopy with biopsies is the diagnostic standard: reveals continuous erythema, edema, friability (mucosa bleeds on contact), ulceration, and pseudopolyps starting from the rectum; biopsies show cryptitis, crypt abscesses, and mucosal architectural distortion",
    "Flexible sigmoidoscopy may be preferred over full colonoscopy during severe flares to reduce perforation risk",
    "CBC: anemia (iron deficiency from chronic blood loss), leukocytosis, thrombocytosis (reactive to chronic inflammation)",
    "Inflammatory markers: ESR and CRP elevated during active disease; CRP is better for monitoring acute flares",
    "Fecal calprotectin: non-invasive marker of mucosal inflammation; highly sensitive for active IBD; correlates with endoscopic disease activity",
    "Stool culture and C. difficile toxin: mandatory to exclude infectious colitis before initiating or escalating immunosuppressive therapy",
    "Abdominal X-ray: essential during severe flares to monitor for toxic megacolon (transverse colon diameter >6 cm) and perforation (free air)",
    "p-ANCA positive in 60-70% of UC patients (vs ASCA positive in Crohn) - serologic markers can support diagnosis in uncertain cases"
  ],
  management: [
    "Mild-moderate UC: first-line is mesalamine (5-ASA) in oral and topical (rectal suppository or enema) formulations; combination oral + topical is more effective than either alone",
    "Moderate-severe UC: oral corticosteroids (prednisone 40-60 mg/day) for induction of remission, then taper over 8-12 weeks; not for maintenance",
    "Steroid-dependent or steroid-refractory disease: immunomodulators (azathioprine, 6-mercaptopurine) for maintenance; biologic therapy (infliximab, adalimumab, vedolizumab, tofacitinib)",
    "Acute severe UC (6+ bloody stools/day, heart rate >90, temperature >37.8, ESR >30, hemoglobin <10.5): IV corticosteroids (methylprednisolone 60 mg/day or hydrocortisone 100 mg every 6-8 hours), IV fluids, NPO or liquid diet, DVT prophylaxis, daily abdominal X-rays",
    "Failure to respond to IV steroids within 3-5 days: rescue therapy with infliximab or ciclosporin, or proceed to surgery",
    "Surgery (total proctocolectomy): curative for UC; indicated for refractory disease, toxic megacolon, perforation, high-grade dysplasia, or colorectal cancer; options include ileal pouch-anal anastomosis (J-pouch) or permanent ileostomy",
    "Colorectal cancer surveillance: begin 8 years after pancolitis diagnosis with colonoscopy every 1-2 years with targeted biopsies and chromoendoscopy"
  ],
  nursingActions: [
    "Assess stool pattern: frequency, volume, consistency, amount of blood and mucus, urgency, tenesmus, and nocturnal stools",
    "Monitor for signs of severe flare and toxic megacolon: increasing abdominal distension, decreased bowel sounds, high fever, tachycardia, severe abdominal pain with tenderness",
    "Administer rectal medications (mesalamine suppositories and enemas): teach patient to retain for at least 1 hour for optimal effect; position in left lateral decubitus position for enema administration",
    "Monitor for corticosteroid side effects during induction: blood glucose (check regularly), blood pressure, mood and sleep changes, signs of infection (fever may be masked)",
    "Implement VTE prophylaxis as ordered during hospitalization: UC flares significantly increase deep vein thrombosis and pulmonary embolism risk",
    "Monitor hemoglobin and administer iron supplementation or blood transfusion as ordered for chronic blood loss anemia",
    "Provide psychosocial support: UC significantly impacts quality of life, body image, and social functioning; assess for depression and anxiety, which are common",
    "Pre-operative education if colectomy planned: explain J-pouch procedure and timeline, ostomy care education if applicable, discuss expected changes in bowel function",
    "Educate about cancer surveillance: importance of regular colonoscopy schedule starting 8 years after diagnosis"
  ],
  assessmentFindings: [
    "Bloody diarrhea (hallmark symptom) with mucus and pus, ranging from mildly increased frequency to 10-20 bloody stools per day in severe disease",
    "Urgency, tenesmus (painful straining with feeling of incomplete evacuation), and faecal incontinence",
    "Left lower quadrant cramping pain that is relieved or worsened by defecation",
    "Fatigue, malaise, and anorexia during active disease",
    "Pallor due to iron deficiency anemia from chronic blood loss",
    "Fever (typically low-grade in moderate disease; high fever in severe disease or toxic megacolon)",
    "Extraintestinal manifestations: joint pain/swelling (most common), erythema nodosum, pyoderma gangrenosum, eye inflammation (uveitis)"
  ],
  signs: {
    left: [
      "Bloody diarrhea with mucus (hallmark symptom)",
      "Urgency and tenesmus",
      "Left lower quadrant tenderness",
      "Pallor and tachycardia (from anemia)",
      "Low-grade fever during flares"
    ],
    right: [
      "Abdominal distension with decreased bowel sounds (toxic megacolon - emergency)",
      "High fever with tachycardia and hypotension (systemic toxicity)",
      "Extraintestinal manifestations (joint pain, skin lesions, eye inflammation)",
      "Peripheral edema (hypoalbuminemia from protein-losing enteropathy)",
      "Deep vein thrombosis (UC increases VTE risk 3-fold during flares)"
    ]
  },
  medications: [
    {
      name: "Mesalamine (5-ASA)",
      type: "Aminosalicylate Anti-inflammatory",
      action: "Topical anti-inflammatory that acts directly on the colonic mucosa to inhibit prostaglandin and leukotriene synthesis, scavenge free radicals, and suppress NF-kB-mediated inflammatory pathways",
      sideEffects: "Headache, nausea, abdominal pain, diarrhea (paradoxical), rash; rare but serious: interstitial nephritis, pancreatitis, pericarditis",
      contra: "Salicylate allergy, severe renal impairment, severe hepatic impairment",
      pearl: "First-line for mild-moderate UC; combining oral + rectal formulations is significantly more effective than either alone; rectal formulations (suppository for proctitis, enema for left-sided) deliver drug directly to inflamed mucosa; monitor renal function annually with long-term use"
    },
    {
      name: "Prednisone",
      type: "Systemic Corticosteroid",
      action: "Broadly suppresses inflammatory and immune responses by inhibiting NF-kB, reducing pro-inflammatory cytokine production, decreasing leukocyte migration, and stabilising lysosomal membranes",
      sideEffects: "Hyperglycemia, weight gain, fluid retention, insomnia, mood changes (euphoria to psychosis), increased infection risk, osteoporosis, adrenal suppression, peptic ulcer (especially with NSAID co-administration), cataracts, skin thinning",
      contra: "Active untreated infections, live vaccines during therapy, poorly controlled diabetes (relative)",
      pearl: "Used for induction of remission only, NOT maintenance - chronic steroid use is never the goal; always taper gradually (typically over 8-12 weeks) to avoid Addisonian crisis from adrenal suppression; if patient cannot taper below 10 mg without flare, this is steroid-dependent disease requiring immunomodulator or biologic escalation"
    },
    {
      name: "Vedolizumab (Entyvio)",
      type: "Biologic - Anti-Integrin (Gut-Selective)",
      action: "Humanised monoclonal antibody targeting alpha4-beta7 integrin, blocking its interaction with MAdCAM-1 on gut vascular endothelium; prevents migration of lymphocytes from the bloodstream into the gut wall; gut-selective action reduces systemic immunosuppression compared to anti-TNF agents",
      sideEffects: "Nasopharyngitis, headache, arthralgia, nausea, upper respiratory tract infection, infusion reactions; lower risk of serious infections than anti-TNF agents due to gut-selective mechanism",
      contra: "Active severe infection, hypersensitivity to vedolizumab, concurrent natalizumab (both target integrins - compounding immunosuppression)",
      pearl: "Preferred over anti-TNF agents in older patients or those with infection concerns due to gut-selective immunosuppression; takes longer to reach full effect (12-14 weeks) compared to anti-TNF agents; progressive multifocal leukoencephalopathy (PML) risk is theoretical but has not been reported with vedolizumab alone"
    }
  ],
  pearls: [
    "UC ALWAYS involves the rectum and extends proximally in a continuous pattern - if inflammation is patchy or rectal-sparing, consider Crohn colitis instead",
    "Toxic megacolon is a life-threatening emergency: transverse colon >6 cm with systemic toxicity (fever >38.6, HR >120, WBC >10.5); stop anticholinergics and opioids, obtain surgical consultation immediately",
    "Bloody diarrhea is the hallmark of UC; non-bloody diarrhea should raise suspicion for alternative diagnoses or concurrent infection (always test for C. difficile during flares)",
    "Never give anti-diarrheal agents (loperamide) during severe UC flares as they can precipitate toxic megacolon",
    "UC patients have a 3-fold increased risk of venous thromboembolism during flares - DVT prophylaxis during hospitalisation is essential",
    "Surgical cure: unlike Crohn disease, UC can be cured by total proctocolectomy because disease is limited to the colon and rectum",
    "Rectal mesalamine suppositories are the most effective treatment for ulcerative proctitis - more effective than oral mesalamine alone",
    "Cancer surveillance colonoscopy begins 8 years after pancolitis diagnosis and every 1-2 years thereafter - this is a critical preventive measure"
  ],
  quiz: [
    {
      question: "A patient hospitalised with a severe ulcerative colitis flare has increasing abdominal distension, high fever, and tachycardia. An abdominal X-ray shows transverse colon diameter of 7.5 cm. Which action is the priority?",
      options: [
        "Administer loperamide to reduce stool frequency",
        "Prepare for colonoscopy to assess disease extent",
        "Notify the provider immediately and prepare for potential surgical consultation",
        "Increase the oral mesalamine dose and add a rectal enema"
      ],
      correct: 2,
      rationale: "A transverse colon diameter greater than 6 cm with systemic toxicity (fever, tachycardia, distension) defines toxic megacolon, which is a surgical emergency. The provider must be notified immediately for IV steroid optimisation and surgical consultation. Loperamide is contraindicated as it can worsen toxic megacolon. Colonoscopy carries high perforation risk. Oral medications alone are inadequate for this severity."
    },
    {
      question: "Which statement by a patient with ulcerative colitis indicates a correct understanding of their medication therapy?",
      options: [
        "I will continue taking prednisone daily to prevent all future flares",
        "I should use both my oral mesalamine and rectal suppository together for best results",
        "I can stop my mesalamine whenever my symptoms go away since the disease is cured",
        "I should take loperamide whenever I have a flare to control the diarrhea quickly"
      ],
      correct: 1,
      rationale: "Combining oral and rectal mesalamine is more effective than either alone for inducing and maintaining remission in UC - this demonstrates correct understanding. Prednisone is for induction only, not long-term maintenance. UC is a chronic disease requiring ongoing maintenance therapy even during remission. Loperamide can precipitate toxic megacolon during flares and should be avoided."
    },
    {
      question: "A nurse is assessing a patient with UC. Which finding most effectively differentiates UC from Crohn disease?",
      options: [
        "Elevated CRP and ESR levels",
        "Continuous inflammation from the rectum without skip lesions",
        "Diarrhea with abdominal cramping",
        "Response to corticosteroid therapy"
      ],
      correct: 1,
      rationale: "The hallmark that distinguishes UC from Crohn disease is continuous mucosal inflammation invariably involving the rectum and extending proximally without skip lesions. Crohn disease, by contrast, shows transmural inflammation with skip lesions that can occur anywhere from mouth to anus. CRP/ESR, diarrhea, and steroid response occur in both conditions."
    }
  ]
},

"gi-bleed-basics-rpn": {
  title: "GI Bleeding Basics",
  cellular: {
    title: "Pathophysiology of Gastrointestinal Bleeding",
    content: "Gastrointestinal (GI) bleeding is classified by anatomical location relative to the ligament of Treitz (which suspends the duodenojejunal junction). Upper GI bleeding (UGIB) originates proximal to the ligament (esophagus, stomach, duodenum) and accounts for approximately 80% of GI bleeds. Lower GI bleeding (LGIB) originates distal to the ligament (jejunum, ileum, colon, rectum) and accounts for the remaining 20%.\n\nThe most common cause of UGIB is peptic ulcer disease (35-50% of cases), where acid-mediated erosion of the gastric or duodenal mucosa damages underlying blood vessels. When a peptic ulcer erodes into an artery (particularly the gastroduodenal artery posteriorly or the left gastric artery along the lesser curvature), massive hemorrhage can result. Other UGIB causes include esophageal varices (from portal hypertension in cirrhosis), Mallory-Weiss tears (mucosal tears at the gastroesophageal junction from forceful retching), erosive gastritis (NSAID use, alcohol, stress), and less commonly, arteriovenous malformations, Dieulafoy lesions (aberrant submucosal artery), and malignancy.\n\nEsophageal variceal bleeding deserves special attention due to its severity. Portal hypertension in cirrhosis causes blood to be diverted through portosystemic collateral vessels, including submucosal veins in the distal esophagus. These varices develop thin walls under high pressure and are prone to rupture, causing massive hemorrhage with mortality rates of 15-20% per episode even with modern therapy.\n\nLGIB most commonly results from diverticular bleeding (30-40%), which occurs when a branch of the vasa recta (arteriole supplying the colon wall) is eroded by a diverticulum. Other LGIB causes include colonic angiodysplasia (arteriovenous malformations, common in elderly), hemorrhoids, colorectal neoplasms, inflammatory bowel disease, ischemic colitis, and post-polypectomy bleeding.\n\nThe physiologic response to acute GI bleeding follows hypovolemic shock physiology. Blood loss triggers baroreceptor activation, catecholamine release, and activation of the renin-angiotensin-aldosterone system. Compensatory mechanisms include tachycardia, peripheral vasoconstriction (cool extremities, pallor), renal sodium and water retention (decreased urine output), and thirst. A healthy adult can lose 15-20% of blood volume before significant hemodynamic changes appear (Class II hemorrhage). Loss exceeding 30-40% produces overt shock with hypotension, altered mental status, and inadequate organ perfusion.\n\nHemoglobin and hematocrit may be NORMAL in the acute phase of hemorrhage because whole blood is being lost. Hemodilution (and therefore a drop in hemoglobin) occurs over 24-72 hours as interstitial fluid shifts into the intravascular space and IV fluids are administered. This is a critical concept: a normal hemoglobin does not rule out significant acute hemorrhage.\n\nThe stool appearance provides clues to the bleeding source: hematemesis (vomiting blood) or coffee-ground emesis (blood altered by gastric acid) indicates UGIB; melena (black, tarry, foul-smelling stool) typically indicates UGIB or proximal small bowel bleeding (requires >50-100 mL of blood and sufficient transit time for bacterial degradation); hematochezia (bright red blood per rectum) usually indicates LGIB but can occur with brisk UGIB (rapid transit of large-volume blood does not allow time for melanotic transformation)."
  },
  riskFactors: [
    "NSAID use (most common modifiable risk factor for peptic ulcer-related UGIB; increases risk 4-5 fold)",
    "Helicobacter pylori infection (synergistic risk with NSAIDs for peptic ulcer bleeding)",
    "Anticoagulant therapy (warfarin, DOACs) and antiplatelet agents (aspirin, clopidogrel)",
    "Chronic liver disease with portal hypertension (esophageal varices, portal hypertensive gastropathy)",
    "Heavy alcohol use (erosive gastritis, Mallory-Weiss tears from retching, cirrhosis with varices)",
    "Previous GI bleeding history (recurrence risk is 20-40% for peptic ulcers)",
    "Advanced age (increased diverticulosis, angiodysplasia, NSAID use, and comorbidities)",
    "Coagulopathy or thrombocytopenia (liver disease, DIC, medications)",
    "Mechanical ventilation or critical illness (stress ulcer risk)",
    "Corticosteroid use (especially when combined with NSAIDs)"
  ],
  diagnostics: [
    "Hemoglobin and hematocrit: note that values may be normal acutely due to whole blood loss; serial monitoring every 4-6 hours is essential",
    "Type and screen (T&S) or type and crossmatch: prepare for potential transfusion in all significant GI bleeds",
    "Coagulation studies: INR/PT and PTT (assess coagulopathy, especially in liver disease or anticoagulant use); platelet count",
    "BUN and creatinine: elevated BUN-to-creatinine ratio (>20:1) suggests UGIB (blood protein digested and absorbed as urea) or dehydration",
    "Liver function tests: assess for underlying liver disease contributing to coagulopathy or variceal bleeding",
    "Esophagogastroduodenoscopy (EGD): gold standard for diagnosing and treating UGIB; ideally performed within 24 hours (within 12 hours for hemodynamically significant bleeds)",
    "Colonoscopy: for LGIB evaluation after bowel preparation; identifies source in 70-80% of cases",
    "Nasogastric lavage: can be used to differentiate UGIB from LGIB and assess ongoing bleeding (bloody or coffee-ground aspirate confirms UGIB); a clear aspirate does not exclude UGIB (pyloric spasm may prevent duodenal blood from refluxing into stomach)"
  ],
  management: [
    "Airway protection: endotracheal intubation for massive hematemesis, altered mental status, or inability to protect airway (risk of aspiration is a leading cause of death in GI bleed)",
    "Volume resuscitation: two large-bore IV lines (16-18 gauge), crystalloid infusion (normal saline or lactated Ringer), followed by blood products when available",
    "Blood transfusion: maintain hemoglobin above 7 g/dL in most patients (restrictive strategy); higher threshold (>8-9 g/dL) for active coronary artery disease, hemodynamic instability, or ongoing hemorrhage",
    "Correct coagulopathy: fresh frozen plasma for INR >1.5, platelets for count <50,000, vitamin K for warfarin reversal (IV for urgent situations), consider prothrombin complex concentrate for life-threatening bleeds",
    "IV proton pump inhibitor (pantoprazole 80 mg bolus then 8 mg/hour infusion) for suspected UGIB to stabilise clots and reduce re-bleeding",
    "Variceal bleeding: IV octreotide (reduces portal pressure), urgent endoscopic variceal ligation (banding), IV antibiotics (ceftriaxone - reduces mortality), Sengstaken-Blakemore tube as temporising measure for refractory bleeding",
    "Endoscopic hemostasis: thermal coagulation, injection therapy (epinephrine), hemoclips, or combination for actively bleeding ulcers",
    "Interventional radiology: angiographic embolization for bleeding not controlled endoscopically; surgery as last resort"
  ],
  nursingActions: [
    "Assess hemodynamic status continuously: vital signs every 15 minutes during active bleeding, including orthostatic measurements when safe; report tachycardia >100, systolic BP <90, or orthostatic changes immediately",
    "Establish two large-bore (16-18 gauge) peripheral IV lines immediately; facilitate blood draw for stat labs including type and crossmatch",
    "Maintain accurate intake and output: record all IV fluids, blood products, emesis volume, and estimated blood loss; insert urinary catheter to monitor hourly urine output (target >0.5 mL/kg/hour)",
    "Test all emesis and stool for occult blood; document colour, consistency, volume, and frequency of all GI output",
    "Position patient: elevate head of bed if vomiting (aspiration prevention); left lateral decubitus if massive hematemesis with altered consciousness (keep airway clear)",
    "Prepare for emergent endoscopy: NPO status, consent, pre-procedure medications, airway management equipment at bedside",
    "Administer blood products as prescribed: verify compatibility with two-nurse check, monitor for transfusion reactions (fever, chills, urticaria, dyspnea, chest pain, flank pain)",
    "Monitor serial hemoglobin (every 4-6 hours during active bleed); report significant drops even if absolute value appears normal",
    "Assess for signs of hemodynamic decompensation: restlessness, confusion, cool clammy skin, delayed capillary refill, thready pulse, decreasing urine output"
  ],
  assessmentFindings: [
    "Hematemesis (bright red blood) indicates active UGIB; coffee-ground emesis indicates slower or resolved UGIB",
    "Melena (black, tarry, foul-smelling stool) indicates UGIB or proximal small bowel bleeding with at least 50-100 mL of blood loss",
    "Hematochezia (bright red blood per rectum) usually indicates LGIB but can occur with massive UGIB",
    "Tachycardia (early compensatory sign, may precede hypotension by hours)",
    "Orthostatic hypotension (systolic drop >20 mmHg or diastolic drop >10 mmHg upon standing, or heart rate increase >20 bpm)",
    "Cool, pale, diaphoretic skin with prolonged capillary refill (peripheral vasoconstriction)",
    "Decreased urine output (renal hypoperfusion)",
    "Altered mental status, restlessness, or confusion (cerebral hypoperfusion - late sign)"
  ],
  signs: {
    left: [
      "Hematemesis or coffee-ground emesis (UGIB)",
      "Melena or hematochezia",
      "Tachycardia and orthostatic hypotension",
      "Abdominal tenderness or distension",
      "Pallor and diaphoresis"
    ],
    right: [
      "Hypotension unresponsive to fluid resuscitation (Class III-IV shock)",
      "Altered mental status or confusion (cerebral hypoperfusion)",
      "Anuria or oliguria (renal hypoperfusion)",
      "Chest pain or ECG changes (myocardial ischemia from anemia)",
      "Signs of liver disease (jaundice, ascites, spider angiomata - suggests variceal bleeding)"
    ]
  },
  medications: [
    {
      name: "Pantoprazole IV",
      type: "Proton Pump Inhibitor",
      action: "Irreversibly inhibits the hydrogen-potassium ATPase pump (proton pump) on gastric parietal cells, reducing gastric acid secretion by >90%; raises intragastric pH to promote clot stability and prevent clot dissolution by pepsin",
      sideEffects: "Headache, nausea, diarrhea; long-term: hypomagnesemia, C. difficile risk, bone fracture risk, B12 deficiency (not relevant for acute use)",
      contra: "Known hypersensitivity to PPIs; rilpivirine co-administration (reduced HIV drug absorption)",
      pearl: "For acute UGIB: 80 mg IV bolus followed by 8 mg/hour continuous infusion for 72 hours; this protocol maintains intragastric pH >6 which is necessary for clot stability over peptic ulcers; transition to oral PPI after 72 hours"
    },
    {
      name: "Octreotide",
      type: "Somatostatin Analogue",
      action: "Reduces splanchnic (gut) blood flow by inhibiting vasodilatory hormones (glucagon, VIP); reduces portal venous pressure and variceal pressure; also inhibits gastric acid and pancreatic secretion",
      sideEffects: "Nausea, abdominal cramping, diarrhea or steatorrhea, hyperglycemia (inhibits insulin secretion), bradycardia, injection site reactions",
      contra: "Hypersensitivity to octreotide; use caution in diabetes (blood glucose fluctuations) and cardiac conduction disorders",
      pearl: "First-line pharmacotherapy for variceal bleeding: 50 mcg IV bolus followed by 50 mcg/hour continuous infusion for 2-5 days; should be started immediately when variceal bleeding is suspected, even before endoscopic confirmation; reduces portal pressure by 25-30%"
    },
    {
      name: "Vitamin K (Phytonadione)",
      type: "Fat-Soluble Vitamin / Anticoagulant Reversal",
      action: "Required cofactor for hepatic synthesis of clotting factors II, VII, IX, and X; reverses warfarin-induced coagulopathy by restoring production of vitamin K-dependent clotting factors",
      sideEffects: "IV administration: risk of anaphylactoid reaction (administer slowly over 20-30 minutes, never IV push), flushing, diaphoresis; SC route has slower but safer absorption",
      contra: "Hypersensitivity to vitamin K formulation; caution in patients with mechanical heart valves (reversal of anticoagulation increases thrombosis risk)",
      pearl: "For urgent warfarin reversal in GI bleeding: 10 mg IV administered slowly over 20-30 minutes; takes 6-24 hours for full effect; for immediate reversal in life-threatening bleeding, supplement with prothrombin complex concentrate (PCC) or fresh frozen plasma"
    }
  ],
  pearls: [
    "Hemoglobin may be NORMAL in acute hemorrhage because whole blood is being lost; hemodilution occurs over 24-72 hours - do not be falsely reassured by a normal initial hemoglobin in a hemodynamically unstable patient",
    "Tachycardia is often the earliest hemodynamic sign of significant blood loss and may precede hypotension; a rising heart rate in a patient with GI bleeding should trigger immediate reassessment and escalation",
    "Two large-bore IV lines (16-18 gauge) are essential: fluid flows at a rate proportional to the 4th power of the radius - a short, large-bore peripheral IV delivers fluids faster than a long, small-bore central line",
    "Coffee-ground emesis does NOT mean the bleeding has stopped - it means blood has been exposed to gastric acid; the patient may still be actively bleeding",
    "Hematochezia in a hemodynamically unstable patient should be assumed to be from a brisk upper GI source until proven otherwise by EGD",
    "BUN-to-creatinine ratio greater than 20:1 suggests UGIB because digested blood in the GI tract is absorbed and metabolised to urea",
    "In variceal bleeding, prophylactic antibiotics (ceftriaxone) reduce mortality by preventing spontaneous bacterial peritonitis and bacteremia - this is not optional",
    "Never insert a nasogastric tube in a patient with known or suspected esophageal varices without provider guidance, as it can traumatise varices"
  ],
  quiz: [
    {
      question: "A patient presents to the emergency department with hematemesis. Vital signs show HR 118, BP 88/56, RR 24. The stat hemoglobin is 13.2 g/dL. How should the nurse interpret this hemoglobin value?",
      options: [
        "The normal hemoglobin indicates the bleeding is not significant and close observation is adequate",
        "The hemoglobin is falsely elevated due to lab error and should be rechecked",
        "The hemoglobin may be normal acutely because whole blood was lost; the tachycardia and hypotension indicate significant hemorrhage",
        "The normal hemoglobin confirms the bleeding is from a venous source, which bleeds slowly"
      ],
      correct: 2,
      rationale: "In acute hemorrhage, hemoglobin and hematocrit values may remain normal initially because the patient is losing whole blood (both red cells and plasma in proportion). Hemodilution, which reveals the true degree of blood loss through a falling hemoglobin, takes 24-72 hours. The hemodynamic signs (tachycardia of 118 and hypotension) are the most reliable indicators of significant blood loss in the acute setting."
    },
    {
      question: "A patient with known cirrhosis presents with massive hematemesis. Which medication should the nurse expect to administer first?",
      options: [
        "Loperamide to slow GI transit and reduce bleeding",
        "IV pantoprazole bolus for acid suppression",
        "IV octreotide to reduce portal pressure and variceal blood flow",
        "Oral lactulose to prevent hepatic encephalopathy"
      ],
      correct: 2,
      rationale: "In suspected variceal bleeding (cirrhotic patient with massive hematemesis), IV octreotide is the first-line pharmacotherapy. It reduces splanchnic blood flow and portal pressure, decreasing variceal bleeding. It should be started immediately, even before endoscopic confirmation. While a PPI may also be given, octreotide specifically targets the pathophysiology of variceal hemorrhage. Loperamide and lactulose do not address the acute bleeding."
    },
    {
      question: "When preparing a patient with acute upper GI bleeding for emergent endoscopy, which nursing action takes the highest priority?",
      options: [
        "Confirming the patient's insurance information",
        "Ensuring large-bore IV access and airway management equipment are at bedside",
        "Administering an oral bowel preparation for optimal visualisation",
        "Teaching the patient about potential endoscopic findings"
      ],
      correct: 1,
      rationale: "In acute UGIB requiring emergent endoscopy, ensuring large-bore IV access for resuscitation and having airway management equipment readily available are the highest priorities. Aspiration of blood is a leading cause of death in GI bleed patients, and hemodynamic instability may occur during the procedure. Oral bowel preparation is not used for upper endoscopy and is contraindicated in active bleeding. Education and administrative tasks are not priorities in an emergent situation."
    }
  ]
},

"hepatitis-basics-rpn": {
  title: "Hepatitis Basics",
  cellular: {
    title: "Pathophysiology of Viral Hepatitis",
    content: "Hepatitis is inflammation of the liver, most commonly caused by viral infections (hepatitis A through E), though it can also result from alcohol, drugs, autoimmune conditions, and metabolic diseases. Understanding the five major hepatitis viruses, their transmission routes, and clinical courses is essential for nursing practice and infection prevention.\n\nHepatitis A virus (HAV) is an RNA virus transmitted via the fecal-oral route (contaminated food, water, or close personal contact). It causes acute hepatitis only, never progresses to chronic infection, and confers lifelong immunity after recovery. The incubation period is 15-50 days. HAV is common in areas with poor sanitation and is the most common cause of acute viral hepatitis worldwide. It is typically self-limiting with full recovery in 2-6 months. Rarely, it can cause fulminant hepatic failure, particularly in older adults and those with pre-existing liver disease.\n\nHepatitis B virus (HBV) is a DNA virus transmitted through blood and body fluids (sexual contact, percutaneous exposure, perinatal transmission from mother to infant). The incubation period is 45-180 days. HBV can cause both acute and chronic infection. In adults, 90-95% clear acute infection and develop immunity; 5-10% develop chronic hepatitis B. In neonates infected perinatally, the chronicity rate is reversed: 90% develop chronic infection due to immune tolerance. Chronic HBV carries significant risks of cirrhosis (15-25%) and hepatocellular carcinoma (HCC), which can develop even without cirrhosis.\n\nHBV pathogenesis is primarily immune-mediated rather than directly cytopathic. The virus infects hepatocytes and incorporates its DNA into the host genome. The adaptive immune response (cytotoxic T lymphocytes) targets infected hepatocytes, causing liver cell death and inflammation. A vigorous immune response leads to viral clearance but more symptomatic acute disease; a weak response leads to less symptomatic acute infection but higher chronicity risk.\n\nHepatitis C virus (HCV) is an RNA virus transmitted primarily through percutaneous exposure to infected blood (injection drug use, contaminated needles, historically through blood transfusions before 1992 screening). Sexual transmission is less efficient than HBV. The incubation period is 14-180 days. HCV is unique in its high chronicity rate: 75-85% of acutely infected individuals develop chronic infection. This is because HCV mutates rapidly, producing quasispecies that evade immune detection. Chronic HCV is a leading cause of cirrhosis, hepatocellular carcinoma, and liver transplantation worldwide. The development of direct-acting antivirals (DAAs) has revolutionised HCV treatment, achieving sustained virologic response (cure) rates exceeding 95%.\n\nHepatitis D virus (HDV) is a defective RNA virus that requires HBV surface antigen (HBsAg) to replicate and infect cells. It occurs only as co-infection with acute HBV or superinfection in chronic HBV carriers. Co-infection typically resolves with the acute HBV; superinfection causes accelerated liver damage and higher rates of cirrhosis and liver failure.\n\nHepatitis E virus (HEV) is an RNA virus with fecal-oral transmission similar to HAV. It is common in developing countries with contaminated water supplies. Like HAV, it typically causes self-limiting acute hepatitis. However, HEV is particularly dangerous in pregnant women, with mortality rates up to 20% in the third trimester due to fulminant hepatic failure.\n\nThe acute hepatitis syndrome, regardless of etiology, follows a typical pattern: a prodromal phase (malaise, fatigue, anorexia, nausea, right upper quadrant discomfort), an icteric phase (jaundice, dark urine from conjugated bilirubinuria, pale clay-coloured stools from decreased bile flow), and a recovery phase. Liver enzymes (ALT and AST) are markedly elevated, often 10-100 times the upper limit of normal, reflecting hepatocyte necrosis. ALT is more specific to the liver than AST."
  },
  riskFactors: [
    "Hepatitis A: travel to endemic areas, men who have sex with men, injection drug use, close contact with infected individuals, occupational exposure to primates",
    "Hepatitis B: unprotected sexual contact with infected partner, injection drug use, perinatal exposure (mother-to-infant), healthcare workers with needlestick injuries, recipients of unscreened blood products, household contacts of HBV carriers",
    "Hepatitis C: injection drug use (most common risk factor in developed countries), receipt of blood products before 1992, needlestick injuries, intranasal cocaine use, tattoos or piercings with non-sterile equipment, born between 1945-1965 (baby boomer cohort screening recommended)",
    "Healthcare workers with exposure to blood and body fluids",
    "Immunocompromised individuals (higher chronicity rates, poorer treatment response)",
    "Chronic alcohol use (accelerates liver damage in all forms of viral hepatitis)",
    "Coinfection with HIV (accelerates progression of HBV and HCV)"
  ],
  diagnostics: [
    "Hepatitis serology panel: HBsAg (current HBV infection), anti-HBs (immunity), anti-HBc IgM (acute HBV) and IgG (past or chronic HBV), HBeAg (high infectivity), anti-HCV (HCV exposure), HAV IgM (acute HAV)",
    "HCV RNA viral load: confirms active HCV infection (anti-HCV may remain positive after clearance); used to monitor treatment response",
    "HBV DNA viral load: quantifies HBV replication; guides treatment decisions and monitoring",
    "Liver function tests: ALT and AST markedly elevated (often >1000 IU/L in acute hepatitis); bilirubin elevated (causing jaundice); alkaline phosphatase mildly elevated; albumin decreased in advanced disease",
    "Prothrombin time (INR): prolonged INR indicates impaired hepatic synthetic function; markedly prolonged INR in acute hepatitis suggests fulminant hepatic failure",
    "CBC: may show leukopenia, thrombocytopenia (especially in chronic disease with portal hypertension/hypersplenism)",
    "Liver biopsy or non-invasive fibrosis assessment (FibroScan, FIB-4 score): stages fibrosis in chronic hepatitis B and C to guide treatment urgency",
    "Abdominal ultrasound: evaluates liver size, echogenicity, portal hypertension signs (splenomegaly, ascites), and screens for hepatocellular carcinoma"
  ],
  management: [
    "Hepatitis A: supportive care only (rest, hydration, avoid hepatotoxic substances); no antiviral treatment; prevention with HAV vaccine (2-dose series)",
    "Acute hepatitis B: supportive care for most cases; antivirals (entecavir, tenofovir) reserved for severe acute or fulminant disease; prevention with HBV vaccine (3-dose series)",
    "Chronic hepatitis B: long-term antiviral therapy (entecavir or tenofovir) to suppress viral replication, reduce inflammation, and prevent progression to cirrhosis and HCC; treatment is usually lifelong; HCC screening with ultrasound every 6 months",
    "Hepatitis C: direct-acting antiviral (DAA) regimens achieve >95% cure rates (sustained virologic response); common regimens include sofosbuvir/velpatasvir or glecaprevir/pibrentasvir for 8-12 weeks; treatment is recommended for ALL patients with chronic HCV",
    "Hepatitis D: pegylated interferon-alpha for 48 weeks is standard; bulevirtide (entry inhibitor) approved in some regions; treat underlying HBV",
    "All forms: avoid alcohol (hepatotoxic), review all medications for hepatotoxicity, ensure adequate nutrition",
    "Post-exposure prophylaxis: HAV vaccine within 2 weeks of exposure; HBV vaccine + hepatitis B immunoglobulin (HBIG) within 24 hours of needlestick or perinatal exposure; no post-exposure prophylaxis available for HCV"
  ],
  nursingActions: [
    "Implement appropriate isolation precautions: standard precautions for all patients; contact precautions for hepatitis A (fecal-oral); emphasize hand hygiene and safe handling of blood and sharps for hepatitis B and C",
    "Assess for signs of hepatic deterioration: increasing jaundice, coagulopathy (bleeding, bruising), altered mental status (hepatic encephalopathy), ascites, right upper quadrant pain",
    "Monitor liver function trends: serial ALT, AST, bilirubin, albumin, and INR to assess disease progression or recovery",
    "Administer medications as prescribed; educate on importance of medication adherence for chronic HBV and HCV treatment",
    "Ensure vaccination is offered: HAV and HBV vaccines for susceptible individuals; verify immunity in healthcare workers",
    "Provide nutritional support: small frequent meals, adequate protein (unless encephalopathy present), avoid hepatotoxic substances (alcohol, acetaminophen in excess of 2 g/day)",
    "Educate on transmission prevention: hepatitis A (hand washing, safe food handling); hepatitis B and C (safe sex practices, never share needles or personal items that may contact blood such as razors and toothbrushes, cover open wounds)",
    "Assess and manage fatigue: the most common and debilitating symptom of chronic hepatitis; activity pacing, adequate rest, and addressing concurrent depression",
    "For healthcare worker needlestick exposure: facilitate immediate baseline testing and initiate post-exposure prophylaxis protocol per facility policy"
  ],
  assessmentFindings: [
    "Jaundice (yellowing of skin and sclera from elevated bilirubin) - may be the first noticeable sign",
    "Dark amber or tea-coloured urine (conjugated bilirubinuria) and pale clay-coloured stools (decreased bile reaching intestine)",
    "Right upper quadrant pain or tenderness with hepatomegaly (enlarged, tender liver on palpation)",
    "Fatigue, malaise, and anorexia (often the earliest and most persistent symptoms)",
    "Nausea, vomiting, and aversion to food (especially fatty foods) and cigarettes",
    "Low-grade fever (more common in hepatitis A)",
    "Pruritus (from bile salt deposition in skin)",
    "Spider angiomata, palmar erythema, and ascites (suggest chronic disease progression to cirrhosis)"
  ],
  signs: {
    left: [
      "Jaundice (scleral icterus first, then skin)",
      "Dark urine and pale stools",
      "Right upper quadrant tenderness with hepatomegaly",
      "Fatigue, anorexia, and nausea",
      "Low-grade fever (acute hepatitis)"
    ],
    right: [
      "Altered mental status (hepatic encephalopathy - asterixis, confusion)",
      "Coagulopathy with bleeding and bruising (prolonged INR)",
      "Ascites and peripheral edema (portal hypertension, hypoalbuminemia)",
      "Spider angiomata and palmar erythema (chronic liver disease)",
      "Splenomegaly (portal hypertension)"
    ]
  },
  medications: [
    {
      name: "Entecavir",
      type: "Nucleoside Analogue Antiviral (HBV)",
      action: "Inhibits HBV DNA polymerase (reverse transcriptase) by competing with the natural substrate deoxyguanosine triphosphate, blocking all three steps of viral replication: priming, reverse transcription, and positive-strand DNA synthesis",
      sideEffects: "Headache, fatigue, dizziness, nausea; rare but serious: lactic acidosis and severe hepatomegaly with steatosis (black box warning - shared with all nucleos(t)ide analogues); HBV flare upon discontinuation",
      contra: "Hypersensitivity; dose adjustment required in renal impairment; HIV coinfection without concurrent HIV treatment (risk of HIV resistance if used as monotherapy)",
      pearl: "Take on empty stomach (2 hours before or after meals) for optimal absorption; do NOT abruptly discontinue - may cause severe hepatitis flare from immune reconstitution; monitor liver function closely for several months after stopping"
    },
    {
      name: "Sofosbuvir/Velpatasvir (Epclusa)",
      type: "Direct-Acting Antiviral Combination (HCV)",
      action: "Sofosbuvir is a nucleotide analogue that inhibits the HCV NS5B RNA-dependent RNA polymerase (chain terminator); velpatasvir inhibits the NS5A protein essential for viral replication and assembly; combination is pangenotypic (effective against all HCV genotypes 1-6)",
      sideEffects: "Headache, fatigue, nausea; generally very well tolerated with minimal side effects compared to previous interferon-based regimens",
      contra: "Concurrent use with amiodarone (risk of severe symptomatic bradycardia); strong P-glycoprotein inducers (rifampin, St. John's wort) reduce drug levels; avoid proton pump inhibitors or take velpatasvir 4 hours before PPI",
      pearl: "12-week once-daily oral regimen achieving >95% sustained virologic response (cure) across all HCV genotypes; has transformed HCV from a chronic, progressive disease to a curable one; no food restrictions; check for HBV coinfection before starting (risk of HBV reactivation during HCV treatment)"
    },
    {
      name: "Hepatitis B Immune Globulin (HBIG)",
      type: "Passive Immunization",
      action: "Provides immediate passive immunity through high-titer anti-HBs antibodies derived from human plasma donors with high levels of hepatitis B surface antibody; antibodies neutralise circulating HBsAg and prevent viral attachment to hepatocytes",
      sideEffects: "Injection site pain and tenderness, headache, fatigue, myalgia; rare: anaphylaxis (contains human plasma proteins)",
      contra: "IgA deficiency with anti-IgA antibodies (risk of anaphylaxis); known severe reaction to human immunoglobulin products",
      pearl: "Used for post-exposure prophylaxis: administer within 24 hours of needlestick exposure alongside HBV vaccine (in separate sites); for perinatal exposure, give to newborn within 12 hours of birth along with first dose of HBV vaccine; provides temporary protection (half-life 17-25 days) while active vaccination takes effect"
    }
  ],
  pearls: [
    "The mnemonic for hepatitis transmission: 'Vowels (A, E) are from the bowels (fecal-oral); consonants (B, C, D) are from blood/body fluids'",
    "Hepatitis B is the ONLY hepatitis virus that is a DNA virus; all others (A, C, D, E) are RNA viruses",
    "Hepatitis C can now be CURED with direct-acting antivirals in 8-12 weeks with >95% success rate - this is a major advancement; all patients with chronic HCV should be offered treatment",
    "A newborn of an HBsAg-positive mother must receive HBIG AND the first dose of HBV vaccine within 12 hours of birth to prevent perinatal transmission",
    "Abrupt discontinuation of HBV antiviral therapy can cause severe hepatitis flare from immune reconstitution - never stop suddenly without monitoring",
    "In hepatitis, ALT is more liver-specific than AST; AST also comes from cardiac muscle, skeletal muscle, and red blood cells",
    "Hepatitis A and E are self-limiting and do NOT cause chronic infection; hepatitis B, C, and D can all become chronic",
    "Healthcare workers should have confirmed HBV immunity (anti-HBs titer >10 mIU/mL); if non-responder after two full vaccine series, they are considered susceptible and need HBIG for exposures",
    "Hepatitis E is particularly dangerous in pregnant women with up to 20% mortality in the third trimester - this is a frequently tested point"
  ],
  quiz: [
    {
      question: "A healthcare worker sustains a needlestick injury from a patient known to be HBsAg-positive. The healthcare worker's anti-HBs titer is 5 mIU/mL (below protective level). What is the most appropriate post-exposure intervention?",
      options: [
        "Hepatitis B vaccine booster dose only",
        "Hepatitis B immune globulin (HBIG) plus hepatitis B vaccine booster",
        "No intervention needed since the worker was previously vaccinated",
        "Oral antiviral therapy (entecavir) for 28 days"
      ],
      correct: 1,
      rationale: "When a healthcare worker with inadequate anti-HBs titer (<10 mIU/mL) sustains a needlestick from an HBsAg-positive source, BOTH HBIG (for immediate passive immunity) AND a vaccine booster (to stimulate active immunity) are required within 24 hours. HBIG provides temporary protection while the booster restimulates the immune response. Previous vaccination alone does not provide adequate protection if the titer is below the protective threshold."
    },
    {
      question: "A patient diagnosed with hepatitis A asks the nurse how they can prevent spreading the virus to family members. Which instruction is most important?",
      options: [
        "Family members should avoid sharing needles and practice safe sex",
        "Thorough hand washing after using the bathroom and before preparing food, and close contacts should receive HAV vaccine",
        "The patient should wear a mask when in close contact with family members",
        "Family members should avoid all physical contact until the patient is no longer jaundiced"
      ],
      correct: 1,
      rationale: "Hepatitis A is transmitted via the fecal-oral route, so thorough hand washing is the most critical prevention measure. Close contacts should receive HAV vaccination (or immunoglobulin if within 2 weeks of exposure). Needle precautions relate to HBV/HCV, not HAV. Hepatitis A is not transmitted by respiratory droplets, so masks are unnecessary. Avoiding all contact is excessive and not evidence-based."
    },
    {
      question: "Which serologic finding indicates immunity to hepatitis B from vaccination rather than from natural infection?",
      options: [
        "Positive anti-HBs only",
        "Positive anti-HBc IgG and positive anti-HBs",
        "Positive HBsAg and positive HBeAg",
        "Positive anti-HBc IgM"
      ],
      correct: 0,
      rationale: "Vaccination produces anti-HBs (hepatitis B surface antibody) only, as the vaccine contains only the surface antigen protein. Natural infection produces both anti-HBs (immunity marker) AND anti-HBc (core antibody, indicating exposure to the whole virus). Anti-HBc IgG with anti-HBs indicates past natural infection with recovery. Positive HBsAg indicates active infection. Anti-HBc IgM indicates acute infection."
    }
  ]
},

"hiatal-hernia-rpn": {
  title: "Hiatal Hernia",
  cellular: {
    title: "Pathophysiology of Hiatal Hernia",
    content: "A hiatal hernia occurs when a portion of the stomach protrudes upward through the diaphragmatic hiatus (the opening in the diaphragm through which the esophagus passes) into the thoracic cavity. The diaphragmatic hiatus is normally secured by the phrenoesophageal ligament, which anchors the gastroesophageal junction (GEJ) at the level of the diaphragm. Weakening or widening of this hiatus allows gastric herniation.\n\nThere are four types of hiatal hernia, but two are clinically most important. Type I (sliding hiatal hernia) accounts for 95% of cases. The GEJ and a portion of the gastric cardia slide upward through the hiatus into the thorax. This displacement disrupts the lower esophageal sphincter (LES) mechanism by removing the positive intra-abdominal pressure that normally reinforces LES closure, reducing the angle of His (the acute angle between the esophagus and gastric fundus that acts as a flap valve), and shortening the intra-abdominal esophageal segment. The result is gastroesophageal reflux disease (GERD) as the primary clinical problem.\n\nType II (paraesophageal or rolling hernia) accounts for approximately 5% of cases but is more clinically dangerous. The GEJ remains in its normal position, but the gastric fundus herniates through the hiatus alongside the esophagus. This creates a risk of gastric volvulus (twisting), strangulation (vascular compromise of the herniated stomach), and incarceration (inability to reduce the hernia). Types III and IV are mixed or involve additional organs herniating.\n\nThe pathogenesis of hiatal hernia involves progressive weakening of the phrenoesophageal membrane and widening of the diaphragmatic hiatus. Contributing factors include age-related degeneration of connective tissue and elastic fibres, chronic increases in intra-abdominal pressure (obesity, pregnancy, chronic coughing, heavy lifting, chronic straining at stool), and loss of diaphragmatic muscle tone. The prevalence increases dramatically with age, from less than 10% in those under 40 to 60-70% in those over 60.\n\nClinically, many patients with small sliding hiatal hernias are asymptomatic. When symptoms occur, they are primarily those of GERD: heartburn (retrosternal burning pain worse after meals and when supine), regurgitation of acidic or bitter fluid, dysphagia (difficulty swallowing, usually from esophageal inflammation or stricture), and chest pain that can mimic angina. Chronic GERD complications include erosive esophagitis, peptic stricture, Barrett esophagus (intestinal metaplasia of esophageal squamous epithelium, a precancerous condition), and rarely esophageal adenocarcinoma.\n\nParaesophageal hernias may present with dysphagia, postprandial fullness, chest pain, and respiratory symptoms from mechanical compression. The most dangerous complication is gastric volvulus with strangulation, presenting with Borchardt triad: severe epigastric pain and distension, retching without vomiting (inability to vomit), and inability to pass a nasogastric tube."
  },
  riskFactors: [
    "Age over 50 years (progressive weakening of phrenoesophageal membrane; prevalence increases to 60-70% by age 60)",
    "Obesity (increased intra-abdominal pressure is the most significant modifiable risk factor)",
    "Pregnancy (increased intra-abdominal pressure combined with progesterone-mediated smooth muscle relaxation)",
    "Chronic coughing (COPD, asthma, chronic bronchitis) creating sustained increases in intra-abdominal pressure",
    "Chronic straining with defecation (constipation) or heavy lifting",
    "Smoking (weakens LES tone and impairs tissue healing)",
    "Previous esophageal or gastric surgery",
    "Connective tissue disorders (Marfan syndrome, Ehlers-Danlos) due to inherent tissue weakness",
    "Kyphosis or significant spinal curvature (altered thoracoabdominal anatomy)"
  ],
  diagnostics: [
    "Barium swallow (upper GI series): demonstrates herniation of gastric tissue above the diaphragm; can differentiate sliding from paraesophageal types and assess hernia size",
    "Upper endoscopy (EGD): visualises the GEJ position, assesses for esophagitis, Barrett esophagus, stricture, and allows biopsies; the Z-line (squamocolumnar junction) is displaced proximally in sliding hernias",
    "High-resolution esophageal manometry: measures LES pressure and esophageal motility; identifies LES dysfunction and helps plan surgical approach",
    "24-hour ambulatory pH monitoring: quantifies acid reflux episodes and correlates symptoms with acid exposure; gold standard for confirming GERD when endoscopy is normal",
    "Chest X-ray: may incidentally reveal a retrocardiac soft tissue density or air-fluid level behind the cardiac silhouette (large paraesophageal hernia)",
    "CT scan: useful for paraesophageal hernias to evaluate organ involvement, volvulus, and surgical planning"
  ],
  management: [
    "Lifestyle modifications (first-line for all patients): weight loss, elevate head of bed 15-20 cm (6-8 inches) using blocks under bedposts (not extra pillows which flex the body and increase abdominal pressure), avoid eating 2-3 hours before bedtime, small frequent meals, avoid trigger foods (caffeine, alcohol, chocolate, fatty or spicy foods, peppermint, citrus)",
    "Pharmacological therapy for GERD symptoms: proton pump inhibitors (omeprazole, pantoprazole) are first-line; H2 receptor antagonists (famotidine) for mild or breakthrough symptoms; antacids for immediate symptom relief",
    "Surgical repair (fundoplication): indicated for medication-refractory GERD, large or symptomatic hernias, and ALL paraesophageal hernias due to risk of strangulation; Nissen fundoplication (360-degree wrap of gastric fundus around distal esophagus) is the gold standard laparoscopic procedure",
    "Emergency surgery required for incarcerated or strangulated paraesophageal hernia (surgical emergency)",
    "Post-fundoplication diet: progress from liquids to pureed to soft foods over 4-6 weeks; lifelong avoidance of carbonated beverages may be recommended; patients may experience gas-bloat syndrome (inability to belch or vomit)"
  ],
  nursingActions: [
    "Assess for GERD symptoms: severity, frequency, timing (postprandial, nocturnal), aggravating and alleviating factors, impact on sleep and daily activities",
    "Elevate head of bed: teach patient to place 15-20 cm blocks under the head of the bed frame, NOT to use extra pillows (which flex the trunk and increase abdominal pressure on the stomach)",
    "Educate on dietary modifications: eat small frequent meals, avoid eating 2-3 hours before lying down, identify and avoid personal trigger foods, reduce meal size",
    "Administer PPIs as prescribed: take 30-60 minutes before the first meal of the day for optimal acid suppression; educate about long-term risks (bone health, B12, magnesium, C. difficile)",
    "Monitor for complications of GERD: dysphagia (may indicate stricture), persistent symptoms despite treatment (may indicate Barrett esophagus), unintended weight loss (concerning for malignancy)",
    "Post-operative care after fundoplication: NPO initially, advance diet slowly (liquids to pureed to soft); monitor for dysphagia (expected temporarily due to swelling); teach patient they may not be able to vomit or belch effectively",
    "Assess for signs of strangulated paraesophageal hernia (emergency): sudden severe chest or epigastric pain, inability to vomit despite retching, hemodynamic instability - report immediately",
    "Teach proper positioning: left lateral decubitus after meals may reduce reflux; avoid bending over or lying flat after eating; wear loose-fitting clothing around the waist"
  ],
  assessmentFindings: [
    "Heartburn (retrosternal burning pain) worse after meals, with bending, and when lying flat (hallmark symptom of sliding hernia with GERD)",
    "Regurgitation of acidic or bitter fluid into the mouth, especially when bending or lying down",
    "Dysphagia (difficulty swallowing) - may indicate esophageal inflammation, stricture, or large hernia causing mechanical obstruction",
    "Chest pain that can mimic cardiac angina (must rule out cardiac causes first)",
    "Respiratory symptoms: chronic cough, hoarseness, recurrent aspiration pneumonia (from nocturnal reflux and aspiration)",
    "Early satiety and postprandial fullness (especially paraesophageal hernia with gastric compression)",
    "Iron deficiency anemia (Cameron ulcers at the diaphragmatic hiatus in large hernias cause chronic blood loss)"
  ],
  signs: {
    left: [
      "Heartburn worse when lying flat or bending over",
      "Acid regurgitation into the mouth",
      "Epigastric or retrosternal discomfort after meals",
      "Chronic cough or hoarseness (laryngopharyngeal reflux)",
      "Dysphagia with solid foods"
    ],
    right: [
      "Severe sudden chest pain with inability to vomit (Borchardt triad - strangulation)",
      "Iron deficiency anemia without obvious source (Cameron ulcers)",
      "Recurrent aspiration pneumonia",
      "Severe dysphagia with weight loss (concerning for stricture or malignancy)",
      "Hematemesis or melena (erosive esophagitis or ulceration)"
    ]
  },
  medications: [
    {
      name: "Omeprazole",
      type: "Proton Pump Inhibitor (PPI)",
      action: "Irreversibly inhibits the hydrogen-potassium ATPase enzyme system (proton pump) on the secretory surface of gastric parietal cells, blocking the final step of gastric acid production and reducing acid secretion by over 90%",
      sideEffects: "Headache, nausea, diarrhea, abdominal pain; long-term risks: hypomagnesemia, vitamin B12 deficiency, increased C. difficile risk, possible increased fracture risk, fundic gland polyps (benign)",
      contra: "Concurrent rilpivirine; caution with clopidogrel (omeprazole inhibits CYP2C19, reducing clopidogrel activation - use pantoprazole instead if dual therapy needed)",
      pearl: "Take 30-60 minutes BEFORE the first meal of the day on an empty stomach; the drug only blocks actively secreting proton pumps, so taking it with or after food reduces efficacy; acid suppression builds over 2-3 days; omeprazole specifically interacts with clopidogrel - pantoprazole is the preferred PPI when clopidogrel is co-prescribed"
    },
    {
      name: "Famotidine",
      type: "H2 Receptor Antagonist",
      action: "Competitively blocks histamine H2 receptors on gastric parietal cells, reducing basal and meal-stimulated acid secretion; less potent than PPIs but faster onset of action",
      sideEffects: "Headache, dizziness, constipation or diarrhea; generally very well tolerated with few significant side effects",
      contra: "Known hypersensitivity; dose adjustment in renal impairment",
      pearl: "Useful for on-demand or bedtime dosing (nocturnal acid breakthrough); can be taken 10-60 minutes before meals for prevention of symptoms; may lose efficacy with continuous use (tachyphylaxis) unlike PPIs; good option for patients with mild symptoms or as add-on to PPI therapy for nocturnal symptoms"
    },
    {
      name: "Aluminum/Magnesium Hydroxide Antacid",
      type: "Antacid (Neutralizing Agent)",
      action: "Directly neutralises gastric acid in the stomach lumen, raising intragastric pH immediately; aluminum hydroxide also has a mild mucosal protective effect",
      sideEffects: "Aluminum: constipation; magnesium: diarrhea (combination products balance these effects); aluminum can bind phosphate causing hypophosphatemia with chronic use; magnesium accumulation in renal failure",
      contra: "Renal failure (risk of magnesium accumulation and toxicity); chronic use without medical supervision; hypophosphatemia",
      pearl: "Provides immediate but short-lived symptom relief (30-60 minutes); best used for breakthrough symptoms between PPI doses; take 1-3 hours after meals and at bedtime; can interfere with absorption of many medications (fluoroquinolones, tetracyclines, iron, digoxin) - separate by at least 2 hours"
    }
  ],
  pearls: [
    "Elevate the HEAD OF THE BED with blocks, NOT with extra pillows - pillows flex the trunk and increase abdominal pressure, potentially worsening reflux; the goal is gravity-assisted acid clearance",
    "PPIs must be taken 30-60 minutes before the first meal on an empty stomach to be effective - they only block proton pumps that are actively secreting acid, which is triggered by food",
    "Chest pain from hiatal hernia/GERD can perfectly mimic cardiac angina - cardiac causes must ALWAYS be ruled out first before attributing chest pain to GI origin",
    "Paraesophageal hernias are surgical emergencies when strangulated: Borchardt triad = severe pain, retching without vomiting, and inability to pass an NG tube",
    "After Nissen fundoplication, patients may not be able to vomit or belch effectively - educate about this permanent change and the importance of eating slowly and chewing thoroughly",
    "Cameron ulcers (linear erosions at the diaphragmatic hiatus in large hernias) cause chronic occult blood loss and iron deficiency anemia that may be the only presenting sign",
    "Chronic GERD can lead to Barrett esophagus (intestinal metaplasia), which is a precancerous condition requiring surveillance endoscopy",
    "Omeprazole specifically interacts with clopidogrel via CYP2C19 inhibition - if a patient needs both a PPI and clopidogrel, pantoprazole is the preferred PPI"
  ],
  quiz: [
    {
      question: "A patient with a hiatal hernia asks how to reduce nighttime heartburn. Which instruction is most appropriate?",
      options: [
        "Sleep with three or four extra pillows to elevate the head",
        "Place 15-20 cm blocks under the head of the bed frame and avoid eating 2-3 hours before bedtime",
        "Sleep flat on the right side to promote gastric emptying",
        "Take omeprazole immediately before getting into bed"
      ],
      correct: 1,
      rationale: "Elevating the head of the bed frame with blocks creates a gradual incline that uses gravity to keep gastric acid in the stomach. Extra pillows are ineffective because they flex the trunk, increasing abdominal pressure and potentially worsening reflux. Avoiding meals 2-3 hours before bedtime reduces gastric volume during sleep. Omeprazole should be taken 30-60 minutes before a meal, not at bedtime, for optimal acid suppression."
    },
    {
      question: "A patient is taking omeprazole for GERD and is prescribed clopidogrel after a cardiac stent placement. What should the nurse communicate to the prescribing provider?",
      options: [
        "No interaction exists between these medications",
        "Omeprazole inhibits CYP2C19 and may reduce clopidogrel effectiveness; pantoprazole is the preferred PPI alternative",
        "The omeprazole dose should be doubled to compensate for the interaction",
        "Clopidogrel should be replaced with aspirin to avoid the interaction"
      ],
      correct: 1,
      rationale: "Omeprazole is a potent inhibitor of CYP2C19, the enzyme that converts clopidogrel to its active metabolite. This interaction can reduce clopidogrel's antiplatelet effect, increasing the risk of stent thrombosis. Pantoprazole has minimal CYP2C19 inhibition and is the recommended PPI when clopidogrel therapy is required. This is a clinically significant drug interaction that requires communication with the prescriber."
    },
    {
      question: "A patient with a known large paraesophageal hernia presents with sudden severe epigastric pain, is retching but unable to vomit, and the provider cannot pass a nasogastric tube. What does the nurse recognise this presentation as?",
      options: [
        "Typical GERD flare requiring increased PPI dosing",
        "Esophageal stricture requiring scheduled dilation",
        "Borchardt triad indicating gastric volvulus with strangulation requiring emergent surgery",
        "Mallory-Weiss tear from forceful retching"
      ],
      correct: 2,
      rationale: "Borchardt triad (severe pain/distension, retching without vomiting, inability to pass NG tube) is the classic presentation of gastric volvulus with potential strangulation in a paraesophageal hernia. This is a surgical emergency requiring immediate intervention to prevent gastric necrosis, perforation, and death. It is not a GERD flare, stricture, or Mallory-Weiss tear."
    }
  ]
},

"colorectal-cancer-basics-rpn": {
  title: "Colorectal Cancer Basics",
  cellular: {
    title: "Pathophysiology of Colorectal Cancer",
    content: "Colorectal cancer (CRC) is the third most common cancer and the second leading cause of cancer death in North America. Over 90% of CRCs are adenocarcinomas arising from the glandular epithelial cells lining the colonic mucosa. Understanding the adenoma-carcinoma sequence is fundamental: most CRCs develop from pre-existing adenomatous polyps through a stepwise accumulation of genetic mutations over 10-15 years.\n\nThe adenoma-carcinoma pathway begins with normal colonic epithelium acquiring a mutation in the APC (adenomatous polyposis coli) tumour suppressor gene, leading to dysregulated cell proliferation and formation of an adenomatous polyp. Subsequent mutations in KRAS oncogene, SMAD4, and TP53 tumour suppressor gene drive progression from small adenoma to advanced adenoma to invasive carcinoma. This sequence typically takes 10-15 years, providing a critical window for screening and early intervention through polyp removal (polypectomy).\n\nAn alternative pathway, the serrated polyp pathway, accounts for 20-30% of CRCs and involves serrated polyps rather than conventional adenomas. These cancers are more common in the right (proximal) colon and are associated with BRAF mutations, CpG island methylator phenotype (CIMP), and microsatellite instability (MSI). They can be more difficult to detect endoscopically as they tend to be flat and may be missed during colonoscopy.\n\nThe hereditary CRC syndromes account for 5-10% of cases: Familial Adenomatous Polyposis (FAP) involves a germline APC mutation causing hundreds to thousands of colonic adenomas, with near-100% cancer risk without prophylactic colectomy. Lynch syndrome (hereditary non-polyposis colorectal cancer, HNPCC) is caused by mutations in DNA mismatch repair genes (MLH1, MSH2, MSH6, PMS2), conferring a 70-80% lifetime CRC risk along with elevated risks for endometrial, ovarian, and other cancers.\n\nCRC staging uses the TNM system: T describes depth of tumour invasion (T1 into submucosa, T2 into muscularis propria, T3 through muscularis into subserosa, T4 through serosa or into adjacent organs), N describes lymph node involvement, and M describes distant metastases. CRC spreads via lymphatic drainage, direct extension to adjacent organs, hematogenous spread (most commonly to the liver via portal circulation, then lungs), and less commonly peritoneal seeding.\n\nThe clinical presentation differs by tumour location. Right-sided (ascending colon) tumours present insidiously with iron deficiency anemia (from chronic occult blood loss into the large-caliber, liquid-stool right colon), fatigue, weight loss, and sometimes a palpable right-sided abdominal mass. Left-sided (descending and sigmoid) tumours present more acutely with changes in bowel habits (narrowing of stool caliber, alternating constipation and diarrhea), visible rectal bleeding, and obstructive symptoms because the left colon has a narrower lumen and more formed stool. Rectal cancers present with rectal bleeding, tenesmus (sensation of incomplete evacuation), and change in stool caliber.\n\nScreening is one of the most effective cancer prevention strategies because it can detect and remove pre-cancerous polyps before they transform into cancer, and detect early-stage cancers with much better prognosis. Average-risk screening begins at age 45-50 with colonoscopy every 10 years, or alternative tests (FIT annually, flexible sigmoidoscopy every 5 years, CT colonography every 5 years). Higher-risk individuals require earlier and more frequent screening."
  },
  riskFactors: [
    "Age over 45-50 years (90% of CRC cases occur in individuals over 50; incidence is rising in younger adults)",
    "Personal history of adenomatous polyps or previous colorectal cancer",
    "First-degree relative with CRC or advanced adenomas (2-4 fold increased risk; begin screening 10 years before relative's age at diagnosis or age 40, whichever is earlier)",
    "Inflammatory bowel disease (ulcerative colitis or Crohn colitis) of 8+ years duration",
    "Hereditary syndromes: FAP, Lynch syndrome (HNPCC), Peutz-Jeghers syndrome",
    "Diet high in red and processed meats (processed meats classified as Group 1 carcinogen by WHO)",
    "Obesity, physical inactivity, and type 2 diabetes mellitus",
    "Heavy alcohol consumption (more than 2 drinks per day) and tobacco use",
    "History of abdominal or pelvic radiation"
  ],
  diagnostics: [
    "Colonoscopy: gold standard for diagnosis, staging, and treatment (polypectomy); allows direct visualisation and biopsy of suspicious lesions; recommended every 10 years starting at age 45-50 for average-risk individuals",
    "Fecal immunochemical test (FIT): detects human hemoglobin in stool; annual screening test for average-risk individuals; positive result requires colonoscopy follow-up",
    "CT colonography (virtual colonoscopy): alternative screening for patients unable or unwilling to undergo colonoscopy; any polyp >6 mm requires colonoscopy follow-up",
    "CT abdomen/pelvis and chest: staging workup to assess for liver metastases (most common site), lung metastases, lymphadenopathy, and local extension",
    "Carcinoembryonic antigen (CEA): tumour marker; not sensitive or specific enough for screening but used to monitor treatment response and detect recurrence; elevated baseline CEA correlates with worse prognosis",
    "CBC: may reveal iron deficiency anemia (especially right-sided tumours with chronic occult blood loss)",
    "Liver function tests: may be abnormal with liver metastases",
    "Microsatellite instability (MSI) and mismatch repair (MMR) testing: all CRCs should be tested to identify Lynch syndrome and guide immunotherapy eligibility"
  ],
  management: [
    "Surgery: primary treatment for stages I-III CRC; segmental colectomy with adequate margins and regional lymph node dissection (minimum 12 lymph nodes for adequate staging); laparoscopic approach preferred when feasible",
    "Stage I: surgery alone is typically curative (>90% five-year survival)",
    "Stage II: surgery is primary; adjuvant chemotherapy considered for high-risk features (T4, poorly differentiated, lymphovascular invasion, inadequate lymph node sampling, perforation, or MSI testing guides this decision)",
    "Stage III (node-positive): surgery followed by adjuvant chemotherapy (FOLFOX: 5-fluorouracil/leucovorin/oxaliplatin or CAPOX: capecitabine/oxaliplatin) for 3-6 months",
    "Stage IV (metastatic): palliative chemotherapy with combination regimens; potentially curative resection of isolated liver or lung metastases in select patients; targeted therapy (bevacizumab, cetuximab) and immunotherapy (pembrolizumab for MSI-high tumours)",
    "Rectal cancer: neoadjuvant chemoradiation (before surgery) to downstage the tumour, followed by surgical resection (total mesorectal excision); may allow sphincter-preserving surgery",
    "Ostomy may be temporary (to protect anastomosis) or permanent (if sphincter complex cannot be preserved in low rectal cancer)",
    "Surveillance after treatment: colonoscopy at 1 year, then every 3 years if normal; CEA monitoring every 3-6 months for 5 years; CT imaging periodically"
  ],
  nursingActions: [
    "Educate patients about CRC screening guidelines: average risk begins at age 45-50; higher risk (family history, IBD) requires earlier and more frequent screening; emphasize that screening saves lives by detecting pre-cancerous polyps",
    "Prepare patients for colonoscopy: bowel preparation instructions (clear liquid diet, prescribed laxative prep), medication management (anticoagulant adjustments), consent, post-procedure observation for complications (bleeding, perforation)",
    "Post-operative care after colectomy: monitor for anastomotic leak (fever, tachycardia, peritoneal signs on day 5-7), support early ambulation, manage pain, advance diet as bowel function returns (flatus, bowel movement)",
    "Ostomy care education: proper appliance fitting, skin care (assess for peristomal dermatitis), emptying and changing schedule, dietary considerations (foods that increase gas, odour, or thicken output), emotional support and body image adjustment",
    "Chemotherapy education: expected side effects (nausea, fatigue, mouth sores, diarrhea, peripheral neuropathy with oxaliplatin), infection prevention (report fever >38 C immediately), importance of completing prescribed cycles",
    "Monitor for oxaliplatin-specific neurotoxicity: acute cold-triggered dysesthesias (avoid cold foods, beverages, and surfaces during and for days after infusion), cumulative peripheral neuropathy (numbness, tingling in hands and feet)",
    "Provide psychosocial support: cancer diagnosis impacts emotional well-being, body image (especially with ostomy), sexuality, and family dynamics; refer to oncology social worker, support groups, and survivorship programs",
    "Monitor CEA levels as ordered during surveillance; educate patient that rising CEA may indicate recurrence and prompt further imaging"
  ],
  assessmentFindings: [
    "Right-sided tumours: iron deficiency anemia (fatigue, pallor, weakness), vague abdominal discomfort, possible palpable right-sided mass; often asymptomatic until advanced",
    "Left-sided tumours: change in bowel habits (alternating constipation/diarrhea, narrowing of stool caliber), visible rectal bleeding or blood-streaked stool, cramping abdominal pain",
    "Rectal tumours: rectal bleeding, tenesmus (persistent urge to defecate with incomplete evacuation), change in stool caliber (pencil-thin stools)",
    "Weight loss and decreased appetite (suggesting advanced disease)",
    "Abdominal distension and vomiting (suggesting bowel obstruction - more common with left-sided tumours)",
    "Hepatomegaly or jaundice (suggesting liver metastases)",
    "Positive fecal occult blood test or fecal immunochemical test (FIT)"
  ],
  signs: {
    left: [
      "Iron deficiency anemia with fatigue (right-sided tumours)",
      "Change in bowel habits (left-sided tumours)",
      "Rectal bleeding or blood in stool",
      "Abdominal pain or cramping",
      "Unintentional weight loss"
    ],
    right: [
      "Complete bowel obstruction (nausea, vomiting, distension, absent flatus)",
      "Palpable abdominal mass",
      "Hepatomegaly or ascites (metastatic disease)",
      "Bowel perforation with peritonitis (surgical emergency)",
      "Deep vein thrombosis (Trousseau syndrome - paraneoplastic hypercoagulability)"
    ]
  },
  medications: [
    {
      name: "5-Fluorouracil (5-FU)",
      type: "Antimetabolite Chemotherapy",
      action: "Pyrimidine analogue that inhibits thymidylate synthase, blocking DNA synthesis; also incorporated into RNA, disrupting RNA processing; the backbone of CRC chemotherapy regimens",
      sideEffects: "Mucositis and stomatitis (oral ulcers), diarrhea (can be severe and dose-limiting), myelosuppression (neutropenia, thrombocytopenia), hand-foot syndrome (palmar-plantar erythrodysesthesia - redness, swelling, pain of palms and soles), nausea, photosensitivity",
      contra: "DPD (dihydropyrimidine dehydrogenase) deficiency - causes severe, potentially fatal toxicity; active serious infection; severe bone marrow suppression; pregnancy",
      pearl: "DPD deficiency testing should be considered before starting 5-FU as deficient patients cannot metabolise the drug and develop life-threatening toxicity; leucovorin (folinic acid) is given WITH 5-FU to enhance its antitumour activity (not to reduce toxicity); monitor for stomatitis and diarrhea as early signs of toxicity"
    },
    {
      name: "Oxaliplatin",
      type: "Platinum-Based Chemotherapy",
      action: "Forms platinum-DNA adducts that cross-link DNA strands, preventing DNA replication and transcription, leading to cell death; synergistic with 5-FU in the FOLFOX regimen",
      sideEffects: "Peripheral neuropathy (cumulative and dose-limiting - may be permanent), acute cold-triggered pharyngolaryngeal dysesthesia and peripheral dysesthesia, nausea and vomiting, diarrhea, myelosuppression, hepatotoxicity (sinusoidal obstruction syndrome)",
      contra: "Pre-existing severe peripheral neuropathy, known platinum allergy, severe renal impairment, pregnancy",
      pearl: "Cold sensitivity is an acute, distinctive side effect: patients experience painful tingling in hands, feet, and throat when touching cold objects or consuming cold foods/beverages; advise patients to avoid cold exposure during infusion and for several days after; cumulative peripheral neuropathy is the dose-limiting toxicity and may require dose reduction or discontinuation"
    },
    {
      name: "Capecitabine (Xeloda)",
      type: "Oral Antimetabolite (5-FU Prodrug)",
      action: "Oral prodrug that is converted to 5-FU preferentially in tumour tissue through a three-step enzymatic activation; the final enzyme (thymidine phosphorylase) is present at higher concentrations in tumour cells, creating higher drug levels at the tumour site",
      sideEffects: "Hand-foot syndrome (most common dose-limiting toxicity - redness, swelling, blistering of palms and soles), diarrhea, nausea, stomatitis, fatigue, myelosuppression",
      contra: "DPD deficiency (same concern as IV 5-FU), severe renal impairment (CrCl <30), concurrent warfarin (significantly increases INR - life-threatening bleeding risk), pregnancy",
      pearl: "Oral alternative to IV 5-FU infusion in the CAPOX regimen (with oxaliplatin); take within 30 minutes after meals with water to reduce GI side effects; monitor for hand-foot syndrome - instruct patients to report early signs (tingling, redness) so dose can be adjusted before blistering develops; dramatically increases warfarin effect - if anticoagulation needed, use LMWH instead"
    }
  ],
  pearls: [
    "Right-sided colon cancers present with anemia; left-sided present with bowel habit changes and bleeding - this difference in presentation reflects tumour location relative to stool consistency and colon caliber",
    "The adenoma-carcinoma sequence takes 10-15 years, making colonoscopic polyp removal one of the most effective cancer prevention strategies available",
    "All CRCs should be tested for microsatellite instability (MSI) and mismatch repair (MMR) status to identify Lynch syndrome and guide immunotherapy decisions",
    "CEA is NOT a screening test - it is used for monitoring treatment response and detecting recurrence after treatment; it can be elevated in smokers and other non-cancerous conditions",
    "Iron deficiency anemia in a man or postmenopausal woman should prompt investigation for GI malignancy, including colonoscopy, until proven otherwise",
    "Colonoscopy bowel preparation quality directly affects polyp detection rates - educate patients thoroughly about preparation instructions for optimal outcomes",
    "Oxaliplatin cold sensitivity: patients must avoid cold foods, beverages, and touching cold objects during and for several days after infusion to prevent painful dysesthesias",
    "After curative CRC resection, surveillance colonoscopy at 1 year is critical because synchronous or metachronous lesions are found in 2-7% of patients"
  ],
  quiz: [
    {
      question: "A 58-year-old man presents with fatigue and is found to have a hemoglobin of 9.2 g/dL with a low ferritin and low MCV. He denies any visible bleeding. What investigation should the nurse anticipate being ordered?",
      options: [
        "Chest X-ray to evaluate for lung cancer",
        "Colonoscopy to investigate for occult right-sided colon cancer",
        "Bone marrow biopsy to rule out leukemia",
        "Upper endoscopy only to check for gastric ulcers"
      ],
      correct: 1,
      rationale: "Iron deficiency anemia in a male patient (or postmenopausal female) is concerning for occult GI blood loss, and right-sided colon cancer is a common cause. Right-sided tumours often bleed slowly and insidiously into the large-caliber right colon where blood mixes with liquid stool, producing occult blood loss without visible bleeding. Colonoscopy is the appropriate investigation to visualise the entire colon. Both upper and lower GI evaluation may ultimately be needed, but colonoscopy is the priority given the clinical picture."
    },
    {
      question: "A patient receiving FOLFOX chemotherapy for stage III colon cancer reports painful tingling in their fingers when picking up a cold water bottle. What should the nurse advise?",
      options: [
        "This is a sign of peripheral neuropathy that will resolve once chemotherapy is complete",
        "Avoid touching cold objects, drinking cold beverages, and exposure to cold air during and for several days after each infusion",
        "Apply ice packs to the hands to reduce the tingling sensation",
        "This side effect is unrelated to chemotherapy and should be evaluated by a neurologist"
      ],
      correct: 1,
      rationale: "Cold-triggered dysesthesias are a characteristic acute side effect of oxaliplatin (the O in FOLFOX). They occur during and shortly after infusion and are precipitated by cold exposure. Patients must be educated to avoid cold foods, beverages, and surfaces to prevent these painful symptoms. Ice application would worsen the symptoms. While cumulative neuropathy may persist after treatment, the acute cold sensitivity is directly related to oxaliplatin and is a well-known expected effect."
    },
    {
      question: "A patient asks why they need a colonoscopy when they already had a positive fecal immunochemical test (FIT). How should the nurse explain?",
      options: [
        "The FIT test confirmed colon cancer so the colonoscopy is to determine the stage",
        "A positive FIT detects blood in the stool which could have many causes; colonoscopy is needed to visually examine the colon and remove any polyps found",
        "The FIT test is unreliable so a colonoscopy is needed to get accurate results",
        "Colonoscopy is routine after age 50 regardless of FIT results"
      ],
      correct: 1,
      rationale: "A positive FIT detects human hemoglobin in the stool, indicating GI bleeding, but it does not diagnose cancer. The bleeding could be from polyps, cancer, hemorrhoids, diverticulosis, or other sources. Colonoscopy is the follow-up diagnostic procedure that allows direct visualisation of the entire colon, biopsy of suspicious lesions, and removal of polyps before they can develop into cancer. FIT is a screening test; colonoscopy is the diagnostic and potentially therapeutic follow-up."
    }
  ]
}

};

let injected = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
}
console.log(`\nDone: injected ${injected}/${Object.keys(lessons).length} lessons`);
