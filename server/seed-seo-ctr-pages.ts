import { Pool } from "pg";

const pages = [
  {
    pageType: "long-tail",
    exam: "nclex",
    languageCode: "en",
    title: "Hyperkalemia Effects on the Heart",
    slug: "hyperkalemia-effects-on-heart",
    metaTitle: "Hyperkalemia Effects on the Heart: ECG Changes, Cardiac Risks & Nursing Care",
    metaDescription: "Learn how hyperkalemia affects the heart — from peaked T waves to fatal arrhythmias. Includes ECG changes, pathophysiology, nursing interventions, and NCLEX practice questions.",
    contentHtml: `
<p class="featured-snippet" style="font-size:1.1em;line-height:1.7;color:#1a1a1a;margin-bottom:1.5em;">
Hyperkalemia — a serum potassium level above 5.0 mEq/L — directly affects the heart by altering myocardial cell membrane potential, leading to characteristic ECG changes such as peaked T waves, widened QRS complexes, and potentially fatal arrhythmias including ventricular fibrillation and asystole.
</p>

<ul style="margin-bottom:2em;">
<li><strong>Peaked T waves</strong> are the earliest ECG sign of hyperkalemia</li>
<li>Progressive changes include PR prolongation, QRS widening, and sine wave pattern</li>
<li>Serum K⁺ &gt; 6.5 mEq/L is a medical emergency requiring immediate intervention</li>
<li>IV calcium gluconate is the first-line treatment to stabilize the myocardium</li>
<li>Nurses must monitor telemetry and potassium levels closely</li>
</ul>

<h2 id="definition">What Is Hyperkalemia?</h2>
<p>Hyperkalemia is defined as an elevated serum potassium concentration above the normal range of 3.5–5.0 mEq/L. Potassium is the primary intracellular cation and plays a critical role in maintaining the resting membrane potential of cardiac myocytes. Even small elevations can significantly impact cardiac electrical conduction.</p>

<h2 id="pathophysiology">Pathophysiology: How Hyperkalemia Affects the Heart</h2>
<p>Potassium is essential for normal cardiac action potential generation. Under normal conditions, the ratio of intracellular to extracellular potassium maintains a resting membrane potential of approximately −90 mV in cardiac cells.</p>
<p>When extracellular potassium rises:</p>
<ul>
<li>The resting membrane potential becomes <strong>less negative</strong> (partially depolarized)</li>
<li>This initially <strong>increases excitability</strong> (cells are closer to threshold)</li>
<li>With further elevation, sodium channels become <strong>inactivated</strong>, slowing conduction</li>
<li>The result is <strong>decreased conduction velocity</strong> and <strong>prolonged repolarization</strong></li>
<li>At critically high levels, the heart can enter a <strong>sine wave pattern</strong> leading to <strong>ventricular fibrillation or asystole</strong></li>
</ul>

<h2 id="ecg-changes">ECG Changes in Hyperkalemia</h2>
<p>ECG changes in hyperkalemia follow a predictable progression correlating with serum potassium levels:</p>

<table style="width:100%;border-collapse:collapse;margin:1.5em 0;">
<thead>
<tr style="background:#f0f4ff;"><th style="padding:10px;border:1px solid #ddd;text-align:left;">Serum K⁺ Level</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">ECG Finding</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Mechanism</th></tr>
</thead>
<tbody>
<tr><td style="padding:10px;border:1px solid #ddd;">5.5–6.0 mEq/L</td><td style="padding:10px;border:1px solid #ddd;"><strong>Peaked (tall, narrow) T waves</strong></td><td style="padding:10px;border:1px solid #ddd;">Accelerated repolarization</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">6.0–6.5 mEq/L</td><td style="padding:10px;border:1px solid #ddd;">Prolonged PR interval, flattened P waves</td><td style="padding:10px;border:1px solid #ddd;">Slowed atrial conduction</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">6.5–7.0 mEq/L</td><td style="padding:10px;border:1px solid #ddd;">Widened QRS complex</td><td style="padding:10px;border:1px solid #ddd;">Slowed ventricular conduction</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">7.0–8.0 mEq/L</td><td style="padding:10px;border:1px solid #ddd;">Loss of P wave, sine wave pattern</td><td style="padding:10px;border:1px solid #ddd;">Complete atrial standstill</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">&gt; 8.0 mEq/L</td><td style="padding:10px;border:1px solid #ddd;">Ventricular fibrillation / asystole</td><td style="padding:10px;border:1px solid #ddd;">Total loss of organized conduction</td></tr>
</tbody>
</table>

<h2 id="symptoms">Signs and Symptoms</h2>
<ul>
<li><strong>Cardiac:</strong> Palpitations, bradycardia, irregular pulse, chest pain, cardiac arrest</li>
<li><strong>Neuromuscular:</strong> Muscle weakness (often ascending), paresthesias, flaccid paralysis</li>
<li><strong>Gastrointestinal:</strong> Nausea, vomiting, abdominal cramping, diarrhea</li>
<li><strong>Respiratory:</strong> Dyspnea (if respiratory muscles affected)</li>
</ul>
<p><strong>Key nursing note:</strong> Many patients are asymptomatic until potassium reaches dangerous levels. ECG monitoring is essential even in "mild" hyperkalemia.</p>

<h2 id="nursing-implications">Nursing Implications and Interventions</h2>
<ol>
<li><strong>Cardiac monitoring:</strong> Place on continuous telemetry; report any ECG changes immediately</li>
<li><strong>IV Calcium Gluconate:</strong> First-line to stabilize myocardial membrane (does NOT lower K⁺, but protects the heart)</li>
<li><strong>Insulin + Dextrose:</strong> Shifts K⁺ into cells; monitor blood glucose closely</li>
<li><strong>Sodium Bicarbonate:</strong> Shifts K⁺ intracellularly; used in metabolic acidosis</li>
<li><strong>Kayexalate (Sodium Polystyrene Sulfonate):</strong> Binds K⁺ in the GI tract for excretion</li>
<li><strong>Loop diuretics (Furosemide):</strong> Promotes renal K⁺ excretion if kidney function is adequate</li>
<li><strong>Dialysis:</strong> For refractory hyperkalemia or renal failure</li>
<li><strong>Dietary restriction:</strong> Educate on low-potassium diet (avoid bananas, oranges, potatoes, tomatoes)</li>
<li><strong>Medication review:</strong> Assess for K⁺-sparing diuretics, ACE inhibitors, ARBs, NSAIDs</li>
</ol>

<h2 id="exam-tips">NCLEX Exam Tips</h2>
<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:1em 0;">
<ul>
<li><strong>Memory aid:</strong> "Hyper-K = Hyper-T" — Hyperkalemia causes tall, peaked T waves</li>
<li>The earliest ECG sign is <strong>peaked T waves</strong> — this is a high-yield NCLEX fact</li>
<li>Calcium gluconate is always the <strong>first priority</strong> intervention because it protects the heart</li>
<li>Remember the nursing priority: <strong>Safety first</strong> → stabilize the heart → lower the K⁺</li>
<li>Questions about hyperkalemia often test <strong>which food to avoid</strong> (high-potassium foods)</li>
<li>Know the difference: calcium gluconate <strong>stabilizes</strong> the heart but does NOT reduce potassium</li>
</ul>
</div>

<h2 id="practice-questions">Practice Questions: Hyperkalemia & Cardiac Effects</h2>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-1">
<p style="font-weight:600;margin-bottom:12px;">Question 1: A nurse reviews a patient's lab results showing serum potassium of 6.8 mEq/L. Which ECG finding should the nurse expect?</p>
<ol type="A" style="margin-left:1em;">
<li>Flattened T waves and U waves</li>
<li>Peaked T waves and widened QRS</li>
<li>ST elevation in leads II, III, aVF</li>
<li>Shortened QT interval</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> At K⁺ levels of 6.5–7.0 mEq/L, the expected ECG changes include peaked T waves (earliest sign) and widened QRS complexes due to slowed ventricular conduction. Flattened T waves and U waves are seen in hypokalemia (A). ST elevation (C) suggests MI. Shortened QT (D) is not characteristic of hyperkalemia.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-2">
<p style="font-weight:600;margin-bottom:12px;">Question 2: A patient with hyperkalemia is prescribed IV calcium gluconate. The nurse understands that this medication works by:</p>
<ol type="A" style="margin-left:1em;">
<li>Removing excess potassium from the body</li>
<li>Shifting potassium into intracellular spaces</li>
<li>Stabilizing the cardiac cell membrane</li>
<li>Increasing renal excretion of potassium</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: C.</strong> IV calcium gluconate works by antagonizing the effect of potassium on the cardiac cell membrane, stabilizing it and protecting against arrhythmias. It does NOT lower serum potassium levels. Kayexalate removes K⁺ (A), insulin shifts K⁺ into cells (B), and diuretics increase renal excretion (D).</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-3">
<p style="font-weight:600;margin-bottom:12px;">Question 3: Which patient is at highest risk for developing hyperkalemia?</p>
<ol type="A" style="margin-left:1em;">
<li>A patient taking loop diuretics for heart failure</li>
<li>A patient with chronic kidney disease taking an ACE inhibitor</li>
<li>A patient with Cushing syndrome</li>
<li>A patient receiving IV normal saline</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> Chronic kidney disease impairs potassium excretion, and ACE inhibitors reduce aldosterone secretion (which normally promotes K⁺ excretion), creating a dual risk for hyperkalemia. Loop diuretics (A) cause hypokalemia. Cushing syndrome (C) causes hypokalemia due to excess aldosterone. Normal saline (D) does not affect potassium.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-4">
<p style="font-weight:600;margin-bottom:12px;">Question 4: A nurse is caring for a patient with a potassium level of 7.2 mEq/L. What is the priority nursing action?</p>
<ol type="A" style="margin-left:1em;">
<li>Administer oral Kayexalate</li>
<li>Place on continuous cardiac monitoring</li>
<li>Restrict dietary potassium intake</li>
<li>Draw repeat labs in 4 hours</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> With K⁺ of 7.2 mEq/L, the patient is at immediate risk for lethal arrhythmias. The priority is to place on continuous cardiac monitoring (telemetry) and notify the provider for emergency interventions (calcium gluconate, insulin/dextrose). Kayexalate (A) works slowly and is not a priority. Diet restriction (C) is important but not the immediate action. Waiting 4 hours (D) could be fatal.</p>
</details>
</div>

`,
    tocJson: [
      { id: "definition", title: "What Is Hyperkalemia?", level: 1 },
      { id: "pathophysiology", title: "Pathophysiology", level: 1 },
      { id: "ecg-changes", title: "ECG Changes", level: 1 },
      { id: "symptoms", title: "Signs and Symptoms", level: 1 },
      { id: "nursing-implications", title: "Nursing Implications", level: 1 },
      { id: "exam-tips", title: "NCLEX Exam Tips", level: 1 },
      { id: "practice-questions", title: "Practice Questions", level: 1 },
      { id: "faq", title: "FAQ", level: 1 }
    ],
    faqJson: [
      { q: "What is the first ECG change seen in hyperkalemia?", a: "Peaked (tall, narrow, symmetric) T waves are the earliest ECG manifestation of hyperkalemia, typically appearing when serum potassium exceeds 5.5 mEq/L. This occurs due to accelerated repolarization of cardiac cells." },
      { q: "At what potassium level does hyperkalemia become life-threatening?", a: "Serum potassium above 6.5 mEq/L is considered a medical emergency due to the risk of fatal cardiac arrhythmias, including ventricular fibrillation and asystole. However, the rate of rise matters — even lower levels can be dangerous if the increase is rapid." },
      { q: "Why is calcium gluconate given first in hyperkalemia treatment?", a: "Calcium gluconate is administered first because it immediately stabilizes the cardiac cell membrane, protecting the heart from arrhythmias. It does not lower potassium levels, but it buys time for other treatments (insulin, diuretics, dialysis) to reduce serum K⁺." },
      { q: "What foods should patients with hyperkalemia avoid?", a: "Patients should limit high-potassium foods including bananas, oranges, potatoes, tomatoes, avocados, spinach, beans, nuts, and salt substitutes (which contain potassium chloride). A low-potassium diet typically restricts intake to under 2,000 mg per day." },
      { q: "How does hyperkalemia differ from hypokalemia on ECG?", a: "Hyperkalemia shows peaked T waves, widened QRS, and eventually sine waves. Hypokalemia shows flattened T waves, prominent U waves, and ST depression. The key memory aid: Hyper-K = tall T waves; Hypo-K = flat T waves + U waves." },
      { q: "Can medications cause hyperkalemia?", a: "Yes. Common culprits include potassium-sparing diuretics (spironolactone), ACE inhibitors, ARBs, NSAIDs, heparin, trimethoprim, and potassium supplements. Nurses should review all medications when a patient develops elevated potassium." }
    ],
    internalLinksJson: [
      { label: "Electrolyte Imbalances: Complete Nursing Guide", url: "/study-guide/electrolyte-imbalances", type: "pillar" },
      { label: "Hypokalemia vs Hyperkalemia: Cardiac Differences", url: "/study-guide/hyperkalemia-vs-hypokalemia-heart", type: "cluster" },
      { label: "Cardiac Arrhythmias for Nursing Students", url: "/study-guide/cardiac-arrhythmias", type: "cluster" },
      { label: "NCLEX Practice Questions — Cardiac", url: "/free-practice", type: "cta" },
      { label: "Renal System Nursing Lessons", url: "/lessons/renal", type: "cluster" }
    ],
    isPublic: true,
    isIndexable: true,
  },
  {
    pageType: "long-tail",
    exam: "nclex",
    languageCode: "en",
    title: "Hyperkalemia vs Hypokalemia: Cardiac Differences",
    slug: "hyperkalemia-vs-hypokalemia-heart",
    metaTitle: "Hyperkalemia vs Hypokalemia: Cardiac & ECG Differences for Nurses",
    metaDescription: "Compare hyperkalemia and hypokalemia side by side — ECG changes, cardiac effects, symptoms, and nursing interventions. Essential NCLEX review with practice questions.",
    contentHtml: `
<p class="featured-snippet" style="font-size:1.1em;line-height:1.7;color:#1a1a1a;margin-bottom:1.5em;">
Hyperkalemia (K⁺ &gt; 5.0 mEq/L) causes peaked T waves, widened QRS, and risk of ventricular fibrillation, while hypokalemia (K⁺ &lt; 3.5 mEq/L) produces flattened T waves, prominent U waves, and increases the risk of torsades de pointes. Both are life-threatening electrolyte emergencies requiring immediate nursing intervention.
</p>

<ul style="margin-bottom:2em;">
<li><strong>Hyperkalemia:</strong> Peaked T waves → widened QRS → sine wave → cardiac arrest</li>
<li><strong>Hypokalemia:</strong> Flattened T waves → U waves → ST depression → torsades de pointes</li>
<li>Both conditions can cause fatal arrhythmias if untreated</li>
<li>Potassium levels must be kept within the narrow range of 3.5–5.0 mEq/L</li>
<li>Nursing priority: continuous cardiac monitoring for both conditions</li>
</ul>

<h2 id="overview">Understanding Potassium Balance</h2>
<p>Potassium (K⁺) is the most abundant intracellular cation, with 98% found inside cells and only 2% in extracellular fluid. This concentration gradient is critical for maintaining the resting membrane potential of cardiac, skeletal, and smooth muscle cells. The normal serum potassium range is 3.5–5.0 mEq/L, and deviations in either direction can have devastating cardiac consequences.</p>

<h2 id="comparison-table">Side-by-Side Comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:1.5em 0;">
<thead>
<tr style="background:#f0f4ff;"><th style="padding:10px;border:1px solid #ddd;text-align:left;">Feature</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Hyperkalemia (K⁺ &gt; 5.0)</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Hypokalemia (K⁺ &lt; 3.5)</th></tr>
</thead>
<tbody>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>T Waves</strong></td><td style="padding:10px;border:1px solid #ddd;">Peaked, tall, narrow</td><td style="padding:10px;border:1px solid #ddd;">Flattened, low amplitude</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>U Waves</strong></td><td style="padding:10px;border:1px solid #ddd;">Absent</td><td style="padding:10px;border:1px solid #ddd;">Prominent (hallmark sign)</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>QRS Complex</strong></td><td style="padding:10px;border:1px solid #ddd;">Widened</td><td style="padding:10px;border:1px solid #ddd;">Normal or slightly prolonged QT</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>P Waves</strong></td><td style="padding:10px;border:1px solid #ddd;">Flattened → absent</td><td style="padding:10px;border:1px solid #ddd;">Normal</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>PR Interval</strong></td><td style="padding:10px;border:1px solid #ddd;">Prolonged</td><td style="padding:10px;border:1px solid #ddd;">Normal</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>ST Segment</strong></td><td style="padding:10px;border:1px solid #ddd;">Depressed (late)</td><td style="padding:10px;border:1px solid #ddd;">Depressed</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Lethal Arrhythmia Risk</strong></td><td style="padding:10px;border:1px solid #ddd;">V-fib, asystole</td><td style="padding:10px;border:1px solid #ddd;">Torsades de pointes, V-fib</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Muscle Effects</strong></td><td style="padding:10px;border:1px solid #ddd;">Weakness, flaccid paralysis</td><td style="padding:10px;border:1px solid #ddd;">Weakness, cramps, paralysis</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>GI Symptoms</strong></td><td style="padding:10px;border:1px solid #ddd;">Nausea, diarrhea</td><td style="padding:10px;border:1px solid #ddd;">Nausea, constipation, ileus</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Digoxin Interaction</strong></td><td style="padding:10px;border:1px solid #ddd;">Reduces digoxin effect</td><td style="padding:10px;border:1px solid #ddd;">Potentiates digoxin toxicity</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>First-Line Treatment</strong></td><td style="padding:10px;border:1px solid #ddd;">IV calcium gluconate (cardiac protection)</td><td style="padding:10px;border:1px solid #ddd;">IV or oral potassium replacement</td></tr>
</tbody>
</table>

<h2 id="hyperkalemia-cardiac">Hyperkalemia: Cardiac Effects in Detail</h2>
<p>Elevated extracellular potassium reduces the resting membrane potential difference, making cardiac cells partially depolarized. This leads to:</p>
<ul>
<li><strong>Increased excitability</strong> initially (cells are closer to threshold)</li>
<li><strong>Slowed conduction</strong> as sodium channels inactivate</li>
<li><strong>Shortened action potential duration</strong> causing peaked T waves</li>
<li><strong>Progressive conduction failure</strong> → widened QRS → sine wave → V-fib/asystole</li>
</ul>
<p><strong>Common causes:</strong> Renal failure, tissue destruction (burns, crush injuries), metabolic acidosis, K⁺-sparing diuretics, ACE inhibitors, massive blood transfusions.</p>

<h2 id="hypokalemia-cardiac">Hypokalemia: Cardiac Effects in Detail</h2>
<p>Low extracellular potassium hyperpolarizes cardiac cells (makes resting membrane potential more negative), which:</p>
<ul>
<li><strong>Delays repolarization</strong> → flattened T waves and prolonged QT interval</li>
<li><strong>Produces U waves</strong> (extra deflection after T wave)</li>
<li><strong>Increases automaticity</strong> → ectopic beats, premature ventricular contractions (PVCs)</li>
<li><strong>Risk of torsades de pointes</strong> — a polymorphic ventricular tachycardia</li>
<li><strong>Potentiates digoxin toxicity</strong> — critical nursing consideration</li>
</ul>
<p><strong>Common causes:</strong> Vomiting, diarrhea, NG suctioning, loop/thiazide diuretics, alkalosis, inadequate dietary intake, excessive sweating.</p>

<h2 id="nursing-interventions">Nursing Interventions Comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:1.5em 0;">
<thead>
<tr style="background:#f0f4ff;"><th style="padding:10px;border:1px solid #ddd;text-align:left;">Intervention</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Hyperkalemia</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Hypokalemia</th></tr>
</thead>
<tbody>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Monitoring</strong></td><td style="padding:10px;border:1px solid #ddd;">Continuous telemetry, q2h labs</td><td style="padding:10px;border:1px solid #ddd;">Continuous telemetry, q4h labs</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Emergency Med</strong></td><td style="padding:10px;border:1px solid #ddd;">Calcium gluconate IV</td><td style="padding:10px;border:1px solid #ddd;">IV KCl (max 10–20 mEq/hr via central line)</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Shift K⁺</strong></td><td style="padding:10px;border:1px solid #ddd;">Insulin + D50, sodium bicarb, albuterol</td><td style="padding:10px;border:1px solid #ddd;">N/A (need to add K⁺, not shift it)</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Excretion</strong></td><td style="padding:10px;border:1px solid #ddd;">Kayexalate, loop diuretics, dialysis</td><td style="padding:10px;border:1px solid #ddd;">Hold diuretics if causative</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Diet</strong></td><td style="padding:10px;border:1px solid #ddd;">Restrict high-K⁺ foods</td><td style="padding:10px;border:1px solid #ddd;">Encourage high-K⁺ foods</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>IV Safety</strong></td><td style="padding:10px;border:1px solid #ddd;">Never give IV K⁺ push</td><td style="padding:10px;border:1px solid #ddd;">Never push IV KCl; always dilute & use pump</td></tr>
</tbody>
</table>

<h2 id="exam-tips">NCLEX Exam Tips</h2>
<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:1em 0;">
<ul>
<li><strong>Memory aid:</strong> "Hyper = peaked (tall T); Hypo = flat T + U wave"</li>
<li>Both conditions can be <strong>fatal</strong> — always prioritize cardiac monitoring</li>
<li><strong>Digoxin + hypokalemia = toxicity</strong> — a common NCLEX question</li>
<li>IV potassium must <strong>NEVER be pushed</strong>; always use an infusion pump</li>
<li>If a question mentions metabolic acidosis + elevated K⁺, think <strong>renal failure</strong></li>
<li>If a question mentions vomiting/diarrhea + low K⁺ + U waves, think <strong>hypokalemia</strong></li>
</ul>
</div>

<h2 id="practice-questions">Practice Questions: Hyperkalemia vs Hypokalemia</h2>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-1">
<p style="font-weight:600;margin-bottom:12px;">Question 1: A nurse is reviewing ECGs. Which finding distinguishes hypokalemia from hyperkalemia?</p>
<ol type="A" style="margin-left:1em;">
<li>Widened QRS complex</li>
<li>Prominent U waves</li>
<li>Peaked T waves</li>
<li>Prolonged PR interval</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> Prominent U waves are the hallmark ECG finding of hypokalemia, appearing as an extra wave after the T wave. Peaked T waves (C) and widened QRS (A) are signs of hyperkalemia. Prolonged PR (D) occurs in hyperkalemia. U waves are virtually diagnostic of hypokalemia.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-2">
<p style="font-weight:600;margin-bottom:12px;">Question 2: A patient taking digoxin and furosemide has a potassium level of 3.0 mEq/L. Which complication is the nurse most concerned about?</p>
<ol type="A" style="margin-left:1em;">
<li>Hypernatremia</li>
<li>Digoxin toxicity</li>
<li>Metabolic alkalosis</li>
<li>Fluid volume overload</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> Hypokalemia potentiates digoxin toxicity because low K⁺ enhances digoxin binding to the sodium-potassium ATPase pump. This can cause life-threatening arrhythmias. While metabolic alkalosis (C) may occur with furosemide, digoxin toxicity is the most immediately dangerous complication. Always check K⁺ levels before giving digoxin.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-3">
<p style="font-weight:600;margin-bottom:12px;">Question 3: A patient's telemetry shows peaked T waves and a heart rate of 48. Potassium level is 7.1 mEq/L. Which medication should the nurse administer first?</p>
<ol type="A" style="margin-left:1em;">
<li>Oral Kayexalate</li>
<li>IV insulin with D50</li>
<li>IV calcium gluconate</li>
<li>IV furosemide</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: C.</strong> IV calcium gluconate is the first-line emergency medication because it immediately stabilizes the cardiac cell membrane, protecting the heart from arrhythmias. While insulin/D50 (B) and Kayexalate (A) help lower K⁺, calcium gluconate is the priority because the patient already has ECG changes (peaked T waves) and bradycardia, indicating imminent cardiac risk.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-4">
<p style="font-weight:600;margin-bottom:12px;">Question 4: Which patient statement indicates understanding of dietary management for hypokalemia?</p>
<ol type="A" style="margin-left:1em;">
<li>"I should avoid eating bananas and orange juice."</li>
<li>"I will eat more bananas and drink orange juice."</li>
<li>"I need to take salt substitutes to increase my potassium."</li>
<li>"I should limit my fluid intake to prevent further loss."</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> For hypokalemia, patients should increase intake of potassium-rich foods like bananas, oranges, potatoes, and leafy greens. Avoiding these foods (A) would be correct for hyperkalemia. Salt substitutes (C) contain KCl and could cause a dangerous rapid increase. Fluid restriction (D) is not indicated for hypokalemia.</p>
</details>
</div>

`,
    tocJson: [
      { id: "overview", title: "Understanding Potassium Balance", level: 1 },
      { id: "comparison-table", title: "Side-by-Side Comparison", level: 1 },
      { id: "hyperkalemia-cardiac", title: "Hyperkalemia: Cardiac Effects", level: 1 },
      { id: "hypokalemia-cardiac", title: "Hypokalemia: Cardiac Effects", level: 1 },
      { id: "nursing-interventions", title: "Nursing Interventions", level: 1 },
      { id: "exam-tips", title: "NCLEX Exam Tips", level: 1 },
      { id: "practice-questions", title: "Practice Questions", level: 1 },
      { id: "faq", title: "FAQ", level: 1 }
    ],
    faqJson: [
      { q: "What is the key ECG difference between hyperkalemia and hypokalemia?", a: "Hyperkalemia causes peaked (tall, narrow) T waves, while hypokalemia causes flattened T waves and prominent U waves. Remember: Hyper-K = tall T, Hypo-K = flat T + U wave. Both can progress to dangerous arrhythmias if untreated." },
      { q: "Which is more immediately dangerous — hyperkalemia or hypokalemia?", a: "Both can be fatal, but hyperkalemia is generally considered more acutely dangerous because it can rapidly progress from peaked T waves to ventricular fibrillation or asystole, sometimes within minutes. Hypokalemia usually progresses more slowly but can also cause sudden cardiac death, especially in patients on digoxin." },
      { q: "How does potassium affect digoxin?", a: "Hypokalemia increases the risk of digoxin toxicity because potassium and digoxin compete for the same binding site on the sodium-potassium ATPase pump. When K⁺ is low, more digoxin binds, amplifying its toxic effects. Nurses should always check potassium levels before administering digoxin." },
      { q: "Can a patient have hyperkalemia and hypokalemia at the same time?", a: "No, a patient cannot have both simultaneously since they refer to opposite extremes of serum potassium. However, potassium levels can shift rapidly — a patient treated for hyperkalemia can develop hypokalemia if treatment is too aggressive. Frequent monitoring is essential." },
      { q: "What causes potassium to shift between hyperkalemia and hypokalemia?", a: "Insulin, beta-agonists (albuterol), and alkalosis shift K⁺ into cells (lowering serum K⁺). Acidosis, tissue destruction, and beta-blockers shift K⁺ out of cells (raising serum K⁺). These shifts can occur independently of total body potassium levels." },
      { q: "What is the safe rate for IV potassium infusion?", a: "IV potassium should never exceed 10–20 mEq/hour via a peripheral line, or up to 40 mEq/hour via a central line with cardiac monitoring. IV potassium must NEVER be given as a push — it can cause immediate cardiac arrest. Always use an infusion pump." }
    ],
    internalLinksJson: [
      { label: "Hyperkalemia Effects on the Heart", url: "/study-guide/hyperkalemia-effects-on-heart", type: "cluster" },
      { label: "Electrolyte Imbalances: Complete Nursing Guide", url: "/study-guide/electrolyte-imbalances", type: "pillar" },
      { label: "Cardiac Arrhythmias for Nursing Students", url: "/study-guide/cardiac-arrhythmias", type: "cluster" },
      { label: "NCLEX Practice Questions — Cardiac", url: "/free-practice", type: "cta" },
      { label: "Pharmacology: Digoxin & Cardiac Glycosides", url: "/lessons/pharmacology", type: "cluster" }
    ],
    isPublic: true,
    isIndexable: true,
  },
  {
    pageType: "long-tail",
    exam: "nclex",
    languageCode: "en",
    title: "Barrel Chest in COPD Explained",
    slug: "barrel-chest-copd-explained",
    metaTitle: "Barrel Chest in COPD: Causes, Assessment & Nursing Care Explained",
    metaDescription: "Understand why COPD causes barrel chest — the pathophysiology of air trapping, AP diameter changes, and how nurses assess and manage this clinical finding. Includes NCLEX practice questions.",
    contentHtml: `
<p class="featured-snippet" style="font-size:1.1em;line-height:1.7;color:#1a1a1a;margin-bottom:1.5em;">
Barrel chest is a characteristic physical finding in advanced COPD where chronic air trapping causes hyperinflation of the lungs, permanently expanding the rib cage and increasing the anteroposterior (AP) diameter to a 1:1 ratio with the lateral diameter, compared to the normal 1:2 ratio. It is a sign of long-standing emphysema.
</p>

<ul style="margin-bottom:2em;">
<li><strong>Barrel chest</strong> results from chronic air trapping and lung hyperinflation in COPD</li>
<li>Normal AP-to-lateral diameter ratio is <strong>1:2</strong>; barrel chest is <strong>1:1</strong></li>
<li>Most commonly associated with <strong>emphysema</strong> (a type of COPD)</li>
<li>Key nursing assessments include inspection, percussion, and auscultation</li>
<li>Barrel chest is <strong>irreversible</strong> — management focuses on preventing further progression</li>
</ul>

<h2 id="definition">What Is Barrel Chest?</h2>
<p>Barrel chest refers to a rounded, bulging chest wall shape where the anteroposterior (front-to-back) diameter approaches or equals the lateral (side-to-side) diameter. In healthy adults, the AP diameter is about half the lateral diameter (1:2 ratio). When chronic lung disease causes persistent air trapping, the lungs remain hyperinflated, gradually reshaping the thorax to a characteristic barrel-like appearance.</p>
<p>While barrel chest can occur in aging (due to osteoporosis and kyphosis), its presence in a younger or middle-aged adult is strongly associated with COPD, particularly <strong>emphysema</strong>.</p>

<h2 id="pathophysiology">Pathophysiology: Why COPD Causes Barrel Chest</h2>
<p>The development of barrel chest in COPD follows a predictable pathophysiological pathway:</p>
<ol>
<li><strong>Alveolar destruction:</strong> Emphysema destroys the alveolar walls and elastic recoil tissue of the lungs</li>
<li><strong>Loss of elastic recoil:</strong> Without elastin, the lungs cannot fully deflate during expiration</li>
<li><strong>Air trapping:</strong> Residual volume increases as trapped air accumulates in the lungs</li>
<li><strong>Lung hyperinflation:</strong> Chronic air trapping keeps the lungs persistently overinflated</li>
<li><strong>Thoracic cage remodeling:</strong> The constantly expanded lungs push the ribs outward and flatten the diaphragm</li>
<li><strong>Structural change:</strong> Over months to years, the chest wall permanently adapts to the barrel shape</li>
</ol>
<p><strong>Key concept:</strong> The diaphragm becomes flattened in barrel chest patients, reducing its efficiency as the primary muscle of respiration. This forces patients to rely on accessory muscles (sternocleidomastoid, scalenes, intercostals) for breathing, contributing to the increased work of breathing seen in advanced COPD.</p>

<h2 id="clinical-features">Clinical Features and Assessment Findings</h2>
<table style="width:100%;border-collapse:collapse;margin:1.5em 0;">
<thead>
<tr style="background:#f0f4ff;"><th style="padding:10px;border:1px solid #ddd;text-align:left;">Assessment Method</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Normal Finding</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Barrel Chest Finding</th></tr>
</thead>
<tbody>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Inspection</strong></td><td style="padding:10px;border:1px solid #ddd;">AP:lateral ratio 1:2, relaxed posture</td><td style="padding:10px;border:1px solid #ddd;">AP:lateral ratio 1:1, tripod position, use of accessory muscles</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Palpation</strong></td><td style="padding:10px;border:1px solid #ddd;">Symmetric chest expansion, tactile fremitus present</td><td style="padding:10px;border:1px solid #ddd;">Decreased chest expansion, diminished tactile fremitus</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Percussion</strong></td><td style="padding:10px;border:1px solid #ddd;">Resonant</td><td style="padding:10px;border:1px solid #ddd;">Hyperresonant (due to trapped air)</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Auscultation</strong></td><td style="padding:10px;border:1px solid #ddd;">Clear, vesicular breath sounds</td><td style="padding:10px;border:1px solid #ddd;">Diminished breath sounds, prolonged expiration, possible wheezing</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Diaphragm Position</strong></td><td style="padding:10px;border:1px solid #ddd;">Dome-shaped, efficient contraction</td><td style="padding:10px;border:1px solid #ddd;">Flattened, inefficient contraction</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Breathing Pattern</strong></td><td style="padding:10px;border:1px solid #ddd;">Relaxed, diaphragmatic</td><td style="padding:10px;border:1px solid #ddd;">Pursed-lip breathing, prolonged expiration, accessory muscle use</td></tr>
</tbody>
</table>

<h2 id="associated-findings">Associated Clinical Findings in COPD</h2>
<ul>
<li><strong>Pursed-lip breathing:</strong> Creates back pressure to keep airways open during expiration</li>
<li><strong>Tripod positioning:</strong> Patient leans forward on hands to optimize accessory muscle use</li>
<li><strong>Clubbing of fingers:</strong> May indicate chronic hypoxemia</li>
<li><strong>Cyanosis:</strong> Bluish discoloration of lips and nail beds (late sign)</li>
<li><strong>Prolonged expiratory phase:</strong> Expiration takes longer than inspiration (normally I:E ratio is 1:2; in COPD it may be 1:4)</li>
<li><strong>Accessory muscle use:</strong> Sternocleidomastoid, scalene, and intercostal muscles used during breathing</li>
<li><strong>"Pink puffer" vs "Blue bloater":</strong> Emphysema patients (barrel chest) are often described as "pink puffers" — thin, tachypneic, using pursed-lip breathing, maintaining relatively normal O₂ saturation through increased work of breathing</li>
</ul>

<h2 id="copd-types">Barrel Chest and COPD Types</h2>
<table style="width:100%;border-collapse:collapse;margin:1.5em 0;">
<thead>
<tr style="background:#f0f4ff;"><th style="padding:10px;border:1px solid #ddd;text-align:left;">Feature</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Emphysema ("Pink Puffer")</th><th style="padding:10px;border:1px solid #ddd;text-align:left;">Chronic Bronchitis ("Blue Bloater")</th></tr>
</thead>
<tbody>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Barrel Chest</strong></td><td style="padding:10px;border:1px solid #ddd;">Common — hallmark finding</td><td style="padding:10px;border:1px solid #ddd;">Less common</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Body Habitus</strong></td><td style="padding:10px;border:1px solid #ddd;">Thin, cachectic</td><td style="padding:10px;border:1px solid #ddd;">Overweight, edematous</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Primary Problem</strong></td><td style="padding:10px;border:1px solid #ddd;">Alveolar destruction, air trapping</td><td style="padding:10px;border:1px solid #ddd;">Mucus hypersecretion, airway inflammation</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Cough</strong></td><td style="padding:10px;border:1px solid #ddd;">Minimal, non-productive</td><td style="padding:10px;border:1px solid #ddd;">Chronic productive cough</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>Oxygenation</strong></td><td style="padding:10px;border:1px solid #ddd;">Relatively preserved (pink)</td><td style="padding:10px;border:1px solid #ddd;">Hypoxemic, cyanotic (blue)</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;"><strong>CO₂ Retention</strong></td><td style="padding:10px;border:1px solid #ddd;">Mild</td><td style="padding:10px;border:1px solid #ddd;">Significant (hypercapnia)</td></tr>
</tbody>
</table>

<h2 id="nursing-implications">Nursing Implications</h2>
<ol>
<li><strong>Respiratory assessment:</strong> Assess AP diameter, breathing pattern, use of accessory muscles, and oxygen saturation every shift</li>
<li><strong>Oxygen therapy:</strong> Low-flow O₂ at 1–2 L/min via nasal cannula — COPD patients may have a hypoxic drive; high-flow O₂ can suppress respiratory effort</li>
<li><strong>Positioning:</strong> Elevate head of bed (high Fowler's) or allow tripod position to maximize diaphragmatic excursion</li>
<li><strong>Breathing techniques:</strong> Teach pursed-lip breathing (prolongs expiration, prevents airway collapse) and diaphragmatic breathing</li>
<li><strong>Medication administration:</strong> Bronchodilators (albuterol, ipratropium), inhaled corticosteroids, long-acting beta-agonists. Ensure proper inhaler technique</li>
<li><strong>Nutrition:</strong> Small, frequent meals (full stomach compresses flattened diaphragm further). High-calorie, high-protein diet for cachectic patients</li>
<li><strong>Activity tolerance:</strong> Pace activities, allow rest periods, use pulse oximetry during exertion</li>
<li><strong>Smoking cessation:</strong> The single most important intervention to slow COPD progression</li>
<li><strong>Flu/pneumococcal vaccines:</strong> Prevent respiratory infections that exacerbate COPD</li>
</ol>

<h2 id="exam-tips">NCLEX Exam Tips</h2>
<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:1em 0;">
<ul>
<li><strong>Barrel chest = emphysema/COPD</strong> — if the NCLEX describes a round chest with 1:1 AP ratio, think COPD</li>
<li>Know that <strong>percussion over barrel chest = hyperresonance</strong> (trapped air)</li>
<li><strong>Low-flow oxygen (1–2 L/min)</strong> is critical for COPD — high-flow can remove hypoxic drive</li>
<li>The <strong>"pink puffer"</strong> has emphysema with barrel chest; the <strong>"blue bloater"</strong> has chronic bronchitis</li>
<li><strong>Pursed-lip breathing</strong> is the key intervention for air trapping</li>
<li>If a question asks about barrel chest in a child, think <strong>cystic fibrosis</strong> or severe <strong>asthma</strong></li>
<li><strong>Smoking cessation</strong> is always the best answer for slowing COPD progression</li>
</ul>
</div>

<h2 id="practice-questions">Practice Questions: Barrel Chest & COPD</h2>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-1">
<p style="font-weight:600;margin-bottom:12px;">Question 1: During a respiratory assessment, a nurse notes that a patient's AP chest diameter equals the lateral diameter. This finding is most consistent with:</p>
<ol type="A" style="margin-left:1em;">
<li>Pneumothorax</li>
<li>Pleural effusion</li>
<li>Emphysema</li>
<li>Atelectasis</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: C.</strong> A 1:1 AP-to-lateral diameter ratio (barrel chest) is a hallmark of emphysema/COPD, caused by chronic air trapping and lung hyperinflation. Pneumothorax (A) may cause asymmetric expansion. Pleural effusion (B) causes dullness to percussion. Atelectasis (D) causes decreased chest expansion on the affected side.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-2">
<p style="font-weight:600;margin-bottom:12px;">Question 2: A patient with barrel chest and COPD is receiving oxygen. Which oxygen delivery setting is most appropriate?</p>
<ol type="A" style="margin-left:1em;">
<li>100% via non-rebreather mask</li>
<li>6 L/min via simple face mask</li>
<li>1–2 L/min via nasal cannula</li>
<li>15 L/min via bag-valve mask</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: C.</strong> COPD patients with chronic CO₂ retention rely on hypoxic drive for respiration. High-flow oxygen can suppress this drive, leading to respiratory depression or arrest. Low-flow oxygen at 1–2 L/min via nasal cannula maintains adequate oxygenation without eliminating the hypoxic drive. Options A, B, and D deliver too much oxygen for a chronic COPD patient.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-3">
<p style="font-weight:600;margin-bottom:12px;">Question 3: Which percussion finding does the nurse expect when assessing a patient with barrel chest?</p>
<ol type="A" style="margin-left:1em;">
<li>Dullness</li>
<li>Flatness</li>
<li>Hyperresonance</li>
<li>Tympany</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: C.</strong> Hyperresonance is the expected percussion finding with barrel chest because the lungs are hyperinflated with trapped air. Air-filled spaces produce louder, longer percussion sounds. Dullness (A) indicates fluid or solid tissue (pleural effusion, pneumonia). Flatness (B) indicates dense tissue (bone, muscle). Tympany (D) is heard over air-filled organs like the stomach.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-4">
<p style="font-weight:600;margin-bottom:12px;">Question 4: A nurse is teaching breathing techniques to a patient with COPD and barrel chest. Which technique is most important to teach?</p>
<ol type="A" style="margin-left:1em;">
<li>Deep breathing with incentive spirometry</li>
<li>Pursed-lip breathing during exhalation</li>
<li>Rapid shallow breathing to conserve energy</li>
<li>Breath-holding exercises to increase lung capacity</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> Pursed-lip breathing creates back pressure (positive end-expiratory pressure) that keeps small airways open during exhalation, preventing airway collapse and reducing air trapping. This is the most effective technique for COPD patients with barrel chest. Incentive spirometry (A) is used post-operatively. Rapid shallow breathing (C) is inefficient. Breath-holding (D) worsens air trapping.</p>
</details>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:1.5em 0;" data-testid="practice-q-5">
<p style="font-weight:600;margin-bottom:12px;">Question 5: Which intervention is the single most important action to slow the progression of COPD?</p>
<ol type="A" style="margin-left:1em;">
<li>Daily use of inhaled corticosteroids</li>
<li>Smoking cessation</li>
<li>Annual flu vaccination</li>
<li>Pulmonary rehabilitation exercises</li>
</ol>
<details style="margin-top:12px;"><summary style="cursor:pointer;color:#2563eb;font-weight:600;">Show Answer & Rationale</summary>
<p style="margin-top:8px;padding:12px;background:#eff6ff;border-radius:8px;"><strong>Answer: B.</strong> Smoking cessation is the single most effective intervention to slow COPD progression and reduce mortality. While inhaled corticosteroids (A), flu vaccination (C), and pulmonary rehab (D) are all important components of COPD management, none has a greater impact on disease progression than quitting smoking.</p>
</details>
</div>

`,
    tocJson: [
      { id: "definition", title: "What Is Barrel Chest?", level: 1 },
      { id: "pathophysiology", title: "Pathophysiology", level: 1 },
      { id: "clinical-features", title: "Clinical Features & Assessment", level: 1 },
      { id: "associated-findings", title: "Associated Clinical Findings", level: 1 },
      { id: "copd-types", title: "COPD Types Comparison", level: 1 },
      { id: "nursing-implications", title: "Nursing Implications", level: 1 },
      { id: "exam-tips", title: "NCLEX Exam Tips", level: 1 },
      { id: "practice-questions", title: "Practice Questions", level: 1 },
      { id: "faq", title: "FAQ", level: 1 }
    ],
    faqJson: [
      { q: "What causes barrel chest in COPD?", a: "Barrel chest is caused by chronic air trapping in emphysema. When alveolar walls are destroyed, the lungs lose elastic recoil and cannot fully deflate during expiration. Over time, the persistently hyperinflated lungs push the rib cage outward, permanently increasing the anteroposterior diameter to a 1:1 ratio with the lateral diameter." },
      { q: "Is barrel chest reversible?", a: "No, barrel chest is an irreversible structural change to the thoracic cage. Once the ribs have remodeled due to chronic hyperinflation, the chest wall cannot return to normal. Treatment focuses on preventing further progression through smoking cessation, bronchodilators, and breathing techniques like pursed-lip breathing." },
      { q: "How do nurses assess for barrel chest?", a: "Nurses assess for barrel chest by visually inspecting the chest shape (AP diameter vs lateral diameter), noting a rounded, symmetrically enlarged thorax. Additional findings include hyperresonance on percussion, diminished breath sounds on auscultation, decreased tactile fremitus on palpation, and use of accessory muscles during breathing." },
      { q: "What is the difference between barrel chest in COPD and in aging?", a: "In aging, barrel chest develops due to osteoporosis causing thoracic kyphosis and calcification of costal cartilage, which is a gradual, mild change. In COPD, barrel chest is caused by active air trapping and lung hyperinflation, and is typically more pronounced. The key difference is that COPD-related barrel chest is accompanied by respiratory symptoms, hyperresonance, and diminished breath sounds." },
      { q: "Why is low-flow oxygen important for patients with barrel chest and COPD?", a: "COPD patients with chronic CO₂ retention develop a hypoxic drive for breathing — their respiratory center responds to low O₂ levels rather than high CO₂ levels. High-flow oxygen removes this drive, potentially causing respiratory depression or arrest. Low-flow O₂ (1–2 L/min) maintains adequate oxygenation without suppressing the breathing drive." },
      { q: "Can barrel chest occur in children?", a: "Yes, barrel chest can develop in children with cystic fibrosis or severe, poorly controlled asthma due to chronic air trapping. In children, barrel chest warrants thorough pulmonary evaluation as it indicates significant, long-standing respiratory disease." }
    ],
    internalLinksJson: [
      { label: "Respiratory System: Complete Nursing Guide", url: "/study-guide/respiratory-system", type: "pillar" },
      { label: "COPD Nursing Care & Management", url: "/study-guide/copd-nursing", type: "cluster" },
      { label: "Oxygen Therapy for Nurses", url: "/study-guide/oxygen-therapy", type: "cluster" },
      { label: "NCLEX Practice Questions — Respiratory", url: "/free-practice", type: "cta" },
      { label: "Respiratory Assessment Techniques", url: "/lessons/respiratory", type: "cluster" }
    ],
    isPublic: true,
    isIndexable: true,
  }
];

export async function seedSeoCtrPages(pool: Pool) {
  console.log("[SEO-CTR] Seeding 3 high-impression query pages...");

  for (const page of pages) {
    const existing = await pool.query(
      `SELECT id FROM seo_pages WHERE slug = $1 AND language_code = $2`,
      [page.slug, page.languageCode]
    );

    if (existing.rows.length > 0) {
      continue;
    }

    const result = await pool.query(
      `INSERT INTO seo_pages (id, page_type, exam, language_code, title, slug, meta_title, meta_description, content_html, toc_json, faq_json, internal_links_json, is_public, is_indexable, canonical_url, translation_status, last_updated)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()) RETURNING id`,
      [
        page.pageType,
        page.exam,
        page.languageCode,
        page.title,
        page.slug,
        page.metaTitle,
        page.metaDescription,
        page.contentHtml,
        JSON.stringify(page.tocJson),
        JSON.stringify(page.faqJson),
        JSON.stringify(page.internalLinksJson),
        page.isPublic,
        page.isIndexable,
        null,
        "en_source",
      ]
    );

    console.log(`  [SEO-CTR] "${page.slug}" inserted (id: ${result.rows[0].id})`);
  }

  console.log("[SEO-CTR] Done.");
}
