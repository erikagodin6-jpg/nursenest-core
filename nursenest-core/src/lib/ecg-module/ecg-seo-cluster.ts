/**
 * ECG topical SEO cluster — 10 supporting pages under /ecg/[topic].
 * All link back to /advanced-ecg-nursing (pillar) and /ecg-interpretation.
 * Each page is individually indexed with unique title, description, and content.
 */

export type EcgClusterTopic = {
  slug: string;
  /** ≤60 chars */
  title: string;
  /** ≤155 chars */
  description: string;
  h1: string;
  /** Target long-tail keywords */
  keywords: string[];
  sections: { id: string; heading: string; content: string }[];
  faq: { question: string; answer: string }[];
};

export const ECG_CLUSTER_TOPICS: EcgClusterTopic[] = [
  {
    slug: "ecg-leads-explained",
    title: "ECG Leads Explained — 12-Lead Placement for Nurses",
    description:
      "Understand all 12 ECG leads: limb leads (I, II, III, aVR, aVL, aVF) and precordial leads (V1–V6). Lead placement, territory, and what each lead records.",
    h1: "ECG leads explained: what each lead records and why it matters",
    keywords: [
      "ECG leads explained nursing",
      "12 lead ECG placement nurses",
      "limb leads precordial leads nursing",
      "ECG lead placement",
      "V leads nursing",
    ],
    sections: [
      {
        id: "limb-leads",
        heading: "Limb leads: I, II, III, aVR, aVL, aVF",
        content:
          "The six limb leads record electrical activity in the frontal plane — looking at the heart from the front. Leads I, II, and III are bipolar leads using two electrode sites each. Lead I records activity from right arm (negative) to left arm (positive). Lead II records from right arm (negative) to left leg (positive) — the most commonly used rhythm strip lead because it best captures P wave and QRS morphology. Lead III records from left arm (negative) to left leg (positive).\n\nThe augmented limb leads (aVR, aVL, aVF) are unipolar leads. aVR looks from the right shoulder toward the heart — normally negative in most of its deflections. aVL looks from the left shoulder — faces the high lateral wall of the left ventricle. aVF looks upward from the left foot — faces the inferior wall of the left ventricle. ST elevation in aVF (with II and III) indicates inferior STEMI; reciprocal depression in aVL is a key confirmatory finding.\n\nAxis deviation is assessed using leads I and aVF: both positive indicates normal axis, positive I with negative aVF indicates left axis deviation (associated with left anterior fascicular block and inferior MI), negative I with positive aVF indicates right axis deviation.",
      },
      {
        id: "precordial-leads",
        heading: "Precordial leads: V1 through V6 — placement and what each records",
        content:
          "The six precordial leads record electrical activity in the horizontal plane — looking at the heart in cross-section from below. Each lead is unipolar, placed on the chest wall in a standardized location.\n\nV1 is placed in the fourth intercostal space at the right sternal border. V2 is in the fourth intercostal space at the left sternal border. V3 is between V2 and V4. V4 is at the fifth intercostal space, midclavicular line. V5 is at the same level as V4, anterior axillary line. V6 is at the same level, midaxillary line.\n\nTerritory by lead: V1–V2 reflect the right ventricle and septal wall. V3–V4 reflect the anterior wall (LAD territory). V5–V6 reflect the lateral wall (diagonal branches, circumflex). ST elevation in V1–V4 indicates anterior STEMI; in V4–V6 indicates anterolateral STEMI.\n\nNormal R-wave progression: R waves should increase in amplitude from V1 to V4–V5 (where the transition from rS to Rs morphology occurs). Poor R-wave progression — small R waves persisting through V4 — suggests anterior MI, LBBB, or COPD.",
      },
      {
        id: "right-posterior-leads",
        heading: "Right-sided and posterior leads for complete assessment",
        content:
          "Standard 12-lead ECG has diagnostic blind spots. Posterior STEMI (circumflex territory) produces ST depression in V1–V3 on the standard ECG — the actual ST elevation is on the posterior surface, visible only on leads V7, V8, V9 placed further left on the back. Any patient with ST depression in V1–V3 and a clinical presentation consistent with ACS should have posterior leads placed.\n\nRight ventricular MI complicates inferior STEMI in approximately 30–40% of cases. Right-sided leads (V3R, V4R — mirror positions on the right chest) detect right ventricular ST elevation. V4R is the most sensitive: ST elevation ≥1 mm in V4R in the setting of inferior STEMI indicates right ventricular involvement. This diagnosis changes fluid management significantly: RV infarction requires volume loading rather than the nitrates used in standard inferior STEMI, and nitrates can cause profound hypotension by reducing RV preload.",
      },
    ],
    faq: [
      {
        question: "Why is Lead II used for rhythm monitoring?",
        answer:
          "Lead II aligns with the normal electrical axis of the heart (roughly parallel to Lead II from right shoulder to left foot), producing tall, upright P waves and QRS complexes that are easiest to identify. This makes it the default lead for rhythm strip analysis in telemetry monitoring.",
      },
      {
        question: "What does ST elevation in V1–V4 indicate?",
        answer:
          "ST elevation in V1–V4 indicates anterior STEMI, typically from LAD (left anterior descending artery) occlusion. This is a high-risk territory representing a large portion of the left ventricular myocardium and requires emergent cath lab activation.",
      },
    ],
  },
  {
    slug: "stemi-localization",
    title: "STEMI Localization by ECG Territory | Nursing Guide",
    description:
      "Localize STEMI territory from 12-lead ECG: inferior, anterior, lateral, posterior, and RV involvement. Clinical significance and nursing priorities for each territory.",
    h1: "STEMI localization: identifying the infarcted territory from the 12-lead ECG",
    keywords: [
      "STEMI localization ECG nursing",
      "inferior STEMI ECG",
      "anterior STEMI ECG",
      "STEMI territory nursing",
      "12-lead STEMI recognition",
      "ACLS rhythm interpretation",
    ],
    sections: [
      {
        id: "inferior-stemi",
        heading: "Inferior STEMI: leads II, III, aVF with RV involvement assessment",
        content:
          "Inferior STEMI presents with ST elevation in leads II, III, and aVF, reflecting the inferior wall of the left ventricle supplied by the right coronary artery (RCA) in approximately 80% of patients, or the circumflex artery in the remaining 20%.\n\nReciprocal ST depression in aVL is the most reliable confirmatory sign of inferior STEMI — its presence increases specificity substantially. Reciprocal changes in leads I and aVL occurring simultaneously with inferior ST elevation should prompt immediate STEMI alert before troponin results return.\n\nRight ventricular involvement assessment is mandatory in all inferior STEMIs. Approximately 30–40% of inferior STEMIs have concurrent RV involvement. Apply right-sided leads (V3R–V6R); ST elevation ≥1 mm in V4R indicates RV MI. Nursing implication: avoid nitroglycerin (drops RV preload and can cause profound hypotension); volume-load the RV; maintain heart rate (RV depends on rate to maintain output).",
      },
      {
        id: "anterior-stemi",
        heading: "Anterior STEMI: LAD territory, V1–V4, and high-risk features",
        content:
          "Anterior STEMI presents with ST elevation in V1–V4 from LAD (left anterior descending) occlusion. This is the highest-mortality STEMI territory because the LAD supplies the anterior wall, most of the interventricular septum, and the anterolateral wall. Large anterior STEMIs can produce ST elevation across V1–V6 (extensive anterior or anterolateral STEMI).\n\nHigh-risk anterior STEMI features include: ST elevation in V1 with LBBB morphology (may require modified Sgarbossa criteria for diagnosis), ST elevation in aVR with diffuse ST depression (indicates left main or proximal LAD occlusion with global ischemia), and new LBBB in the context of chest pain (requires the same urgency as overt STEMI).\n\nAnterior STEMI complications include cardiogenic shock, acute mitral regurgitation from papillary muscle involvement, ventricular septal rupture, and complete heart block from septal ischemia involving the conduction system.",
      },
      {
        id: "posterior-lateral-stemi",
        heading: "Posterior and lateral STEMI: the missed patterns",
        content:
          "Lateral STEMI presents with ST elevation in I, aVL, V5, and V6 from diagonal branch or circumflex territory involvement. Isolated high-lateral STEMI (ST elevation in I and aVL only) can be subtle and is commonly missed on initial triage ECG review.\n\nPosterior STEMI is the most commonly missed STEMI. The standard 12-lead shows no ST elevation — it shows ST depression in V1–V3 because these leads face opposite the posterior wall. The key recognition pattern is ST depression in V1–V3 with a dominant R wave in V2 (the Q-wave equivalent viewed from the opposite direction). Posterior leads V7–V9 reveal the true ST elevation. Any patient with anterior ST depression in the context of chest pain should have posterior leads placed before STEMI is excluded.",
      },
    ],
    faq: [
      {
        question: "Why is inferior STEMI associated with AV block?",
        answer:
          "The AV node is supplied by the AV nodal artery, a branch of the RCA in approximately 90% of patients. RCA occlusion causing inferior STEMI can simultaneously ischemia the AV node, producing first-degree, Wenckebach (Mobitz I), or complete heart block. These are usually reversible as the ischemia resolves, but hemodynamically significant heart block requires temporary pacing.",
      },
      {
        question: "What is STEMI equivalent and why does it matter?",
        answer:
          "STEMI equivalents are ECG patterns that indicate acute coronary occlusion requiring emergent reperfusion but do not meet classic ST elevation criteria. Examples include posterior STEMI (ST depression V1–V3), De Winter T-waves (J-point depression with tall symmetric precordial T-waves), Wellens syndrome (T-wave changes in V2–V3 in a pain-free patient), and new LBBB with Sgarbossa criteria.",
      },
    ],
  },
  {
    slug: "hyperkalemia-ecg-changes",
    title: "Hyperkalemia ECG Changes — Peaked T Waves to Sine Wave",
    description:
      "Hyperkalemia ECG progression for nurses: peaked T waves, P wave flattening, QRS widening, and sine wave pattern. Clinical recognition and emergency management.",
    h1: "Hyperkalemia ECG changes: recognizing the progression from peaked T waves to cardiac emergency",
    keywords: [
      "hyperkalemia ECG changes nursing",
      "peaked T waves hyperkalemia",
      "hyperkalemia ECG progression",
      "electrolyte ECG changes nursing",
      "potassium ECG nursing",
    ],
    sections: [
      {
        id: "ecg-progression",
        heading: "ECG progression of hyperkalemia by severity",
        content:
          "Hyperkalemia produces a predictable ECG progression that correlates roughly with serum potassium levels, though individual variability means ECG changes can occur at lower levels than expected — particularly in patients with chronic kidney disease, diabetes, or concurrent acidosis.\n\nMild hyperkalemia (5.5–6.5 mEq/L): Tall, peaked, narrow-based T waves are the earliest ECG change. These T waves have a characteristic morphology — symmetric, narrow-based, and pointed — most prominent in the precordial leads V2–V5. This distinguishes them from the tall T waves of hyperacute STEMI (which are broad-based and asymmetric) and LV volume overload.\n\nModerate hyperkalemia (6.5–7.5 mEq/L): P waves flatten and widen as atrial conduction slows. The PR interval lengthens. QRS begins to widen. The sinoatrial node continues to fire but atrial conduction is impaired — producing a pattern that resembles junctional rhythm or AV block.\n\nSevere hyperkalemia (>7.5 mEq/L): QRS widens progressively until it merges with the T wave — the sine-wave pattern. This is a preterminal pattern and represents impending cardiac arrest. VF or asystole follows without immediate treatment.",
      },
      {
        id: "treatment-ecg-correlation",
        heading: "Treatment-ECG correlation: what to give based on ECG findings",
        content:
          "Calcium gluconate is the first-line treatment for severe hyperkalemia with ECG changes — specifically QRS widening. Calcium does not lower potassium; it stabilizes the myocardial membrane by raising the threshold potential. The ECG effect occurs within minutes: QRS narrows, rhythm stabilizes. One to two ampules IV over 5–10 minutes, with repeat dosing if ECG changes persist.\n\nInsulin + dextrose shifts potassium intracellularly. Regular insulin 10 units IV with 25g dextrose (50 mL of D50). Onset 15–30 minutes, effect lasts 1–2 hours. Monitor for hypoglycemia. Sodium bicarbonate shifts potassium intracellularly through an ion-exchange mechanism — useful when metabolic acidosis is concurrent.\n\nDefinitive treatment requires potassium removal: Kayexalate (sodium polystyrene sulfonate) or Lokelma (sodium zirconium cyclosilicate) exchange resins, loop diuretics with adequate urine output, or dialysis for severe or refractory hyperkalemia. Dialysis is the fastest and most reliable method for removing large potassium loads.",
      },
    ],
    faq: [
      {
        question: "How do hyperkalemia T waves differ from STEMI T waves?",
        answer:
          "Hyperkalemia T waves are tall, symmetric, and narrow-based — like a tent or church steeple. STEMI hyperacute T waves are tall but broader-based and asymmetric, often with a concave upslope and steeper downslope. Clinical context matters most: hyperkalemia T waves typically appear in patients with renal failure, metabolic acidosis, or potassium-sparing medications.",
      },
      {
        question: "Can hyperkalemia mimic other arrhythmias on telemetry?",
        answer:
          "Yes. Severe hyperkalemia with P-wave flattening and QRS widening can mimic junctional rhythm, complete heart block, or ventricular tachycardia on a rhythm strip. Checking serum electrolytes should always be part of the differential for new-onset bradycardia or wide-complex rhythms in at-risk patients (CKD, ACE inhibitor use, diabetes, acidosis).",
      },
    ],
  },
  {
    slug: "mobitz-1-vs-mobitz-2",
    title: "Mobitz 1 vs Mobitz 2 — AV Block Clinical Guide for Nurses",
    description:
      "Distinguish Mobitz I (Wenckebach) from Mobitz II AV block. ECG features, clinical significance, and why Mobitz II requires urgent pacemaker evaluation.",
    h1: "Mobitz I vs Mobitz II: the most consequential distinction in AV block interpretation",
    keywords: [
      "Mobitz 1 vs Mobitz 2 nursing",
      "Wenckebach AV block nursing",
      "second degree AV block nursing",
      "AV block pacemaker nursing",
      "heart block ECG nursing",
      "cardiac rhythm interpretation",
    ],
    sections: [
      {
        id: "mobitz-i-wenckebach",
        heading: "Mobitz I (Wenckebach): AV node block, progressive PR prolongation",
        content:
          "Mobitz I (Wenckebach) is second-degree AV block at the level of the AV node itself. The ECG hallmark is progressive PR interval prolongation with each beat until a P wave is not followed by a QRS complex (the dropped beat), after which the cycle resets and PR shortens back to baseline.\n\nThe PR interval before the dropped beat is the longest; the PR interval after the dropped beat is the shortest. The RR interval progressively shortens (somewhat counterintuitive — even though PR is getting longer, the RR interval shortens because the increment of PR prolongation with each beat decreases). A group-beating pattern results from the repeating cycles of PR lengthening and dropping.\n\nClinical significance: Mobitz I is usually benign. It commonly occurs with inferior MI (RCA territory ischemia of the AV node), during sleep (increased vagal tone), in well-trained athletes, and with inferior pericarditis. It rarely requires pacing, generally does not progress to complete heart block, and typically resolves when the underlying cause is addressed. Monitor closely and reassess.",
      },
      {
        id: "mobitz-ii-dangerous",
        heading: "Mobitz II: infranodal block, sudden QRS dropping, pacemaker urgency",
        content:
          "Mobitz II is second-degree AV block at an infranodal level — in the bundle of His or the bundle branches. The ECG hallmark is a constant PR interval (no progressive prolongation) followed by a sudden, unexpected dropped QRS complex. The PR interval does not change before the dropped beat — this is the critical distinguishing feature.\n\nClinical significance: Mobitz II is dangerous. The infranodal location means the block is in the distal conduction system, which is less reliable than the AV node. It carries a high risk of sudden progression to complete (third-degree) heart block, even when the patient appears asymptomatic. This progression can be abrupt and hemodynamically catastrophic — the escape rhythm in complete heart block at the infranodal level is typically a slow ventricular escape at 20–40 bpm.\n\nUrgency: Mobitz II requires urgent cardiology consultation and pacemaker evaluation even when asymptomatic. Symptomatic Mobitz II (syncope, pre-syncope, hemodynamic compromise) requires immediate temporary transcutaneous pacing while waiting for transvenous pacing. Atropine has limited and unpredictable effect on Mobitz II and should not be relied upon.",
      },
      {
        id: "two-to-one-block",
        heading: "2:1 AV block: distinguishing Mobitz I from Mobitz II",
        content:
          "2:1 AV block presents every other P wave failing to conduct — exactly half the P waves produce QRS complexes. This pattern makes the PR prolongation of Mobitz I impossible to observe (there are no two consecutively conducted beats to compare). Without consecutive conducted beats, the classic Mobitz I criterion (progressive PR prolongation) cannot be assessed.\n\nApproach to 2:1 block: Look at the QRS width. A narrow QRS suggests block at the AV node level (Mobitz I more likely). A wide QRS suggests block at the infranodal level (Mobitz II more likely). Look for Wenckebach sequences elsewhere in the tracing — periods of 3:2 or 4:3 block with typical PR prolongation. Electrophysiology study is definitive if the site of block cannot be determined from the surface ECG and the clinical decision is high stakes.",
      },
    ],
    faq: [
      {
        question: "Can Mobitz I progress to complete heart block?",
        answer:
          "Rarely and usually only when there is a concurrent cause — inferior MI involving the AV node blood supply, acute myocarditis, or drug toxicity (digoxin, beta-blockers, calcium channel blockers). In isolation without an acute cause, Mobitz I almost never progresses to complete heart block. This is in contrast to Mobitz II, which can progress abruptly.",
      },
      {
        question: "Should atropine be given for Mobitz II?",
        answer:
          "Atropine works by blocking vagal tone at the AV node — it is effective for nodal block (Mobitz I, high vagal tone). Mobitz II is infranodal and does not respond reliably to atropine. The standard recommendation is that atropine should not be relied upon for Mobitz II and may paradoxically increase the ventricular rate without improving conduction — potentially worsening the block. Prepare for transcutaneous pacing instead.",
      },
    ],
  },
  {
    slug: "svt-vs-atrial-fibrillation",
    title: "SVT vs Atrial Fibrillation — Narrow Complex Tachycardia Guide",
    description:
      "Distinguish SVT from atrial fibrillation for nurses. ECG features, adenosine response, rate variability, P wave analysis, and clinical management differences.",
    h1: "SVT vs atrial fibrillation: ECG features and management differences for nurses",
    keywords: [
      "SVT vs atrial fibrillation nursing",
      "narrow complex tachycardia nursing",
      "SVT ECG nursing",
      "AFib recognition nursing",
      "adenosine SVT nursing",
      "arrhythmia recognition nursing",
    ],
    sections: [
      {
        id: "afib-recognition",
        heading: "Atrial fibrillation: irregularly irregular rhythm with absent P waves",
        content:
          "Atrial fibrillation is characterized by chaotic atrial electrical activity at rates of 350–600 impulses per minute — far faster than the AV node can conduct. The result is an irregularly irregular ventricular response with no organized P waves visible (replaced by fine fibrillatory baseline). The QRS is narrow (unless aberrant conduction or bundle branch block is present).\n\nThe irregularly irregular pattern is the key recognition feature. No two RR intervals are the same — there is no predictable pattern to the ventricular response. Uncontrolled AFib typically presents with ventricular rates of 100–180 bpm; controlled AFib has rates below 100 bpm with rate-control medication.\n\nClinical priorities in new-onset AFib: assess hemodynamic stability (rate, blood pressure, symptoms); determine duration of onset (onset within 48 hours versus unknown or >48 hours determines anticoagulation approach before cardioversion); assess for acute causes (PE, sepsis, thyrotoxicosis, post-cardiac surgery); initiate rate control (IV metoprolol or diltiazem for most patients; amiodarone if severely depressed EF).",
      },
      {
        id: "svt-recognition",
        heading: "SVT: regular narrow-complex tachycardia, retrograde P waves",
        content:
          "Supraventricular tachycardia (SVT) most commonly refers to AVNRT (AV node reentrant tachycardia) in clinical practice. AVNRT uses dual pathways within the AV node to create a rapid reentry circuit, producing a very regular narrow-complex tachycardia at 150–250 bpm.\n\nKey ECG features: The rhythm is regular (fixed RR interval) — this is the critical distinction from AFib. P waves are retrograde and typically buried in or just after the QRS complex. In typical AVNRT, the retrograde P wave appears as a pseudo-S wave in the inferior leads (II, III, aVF) or pseudo-R' wave in V1 — not visible as a separate P wave before the QRS.\n\nAdenosine is diagnostic and therapeutic: IV adenosine 6 mg rapid push terminates AVNRT by blocking AV node conduction, interrupting the reentry circuit. If adenosine terminates the tachycardia abruptly — returning to sinus rhythm — the diagnosis is confirmed as AVNRT (or AVRT). Adenosine will NOT terminate AFib or atrial flutter — it may transiently slow the ventricular rate in flutter and reveal flutter waves, then the rate returns.",
      },
      {
        id: "avrt-accessory-pathway",
        heading: "AVRT and pre-excitation: when SVT involves an accessory pathway",
        content:
          "AVRT (AV reentrant tachycardia) uses the AV node plus an accessory pathway (Kent bundle in Wolff-Parkinson-White syndrome) to create the reentry circuit. Orthodromic AVRT (most common) conducts antegrade through the AV node and retrograde through the accessory pathway — producing a narrow QRS similar to AVNRT. Antidromic AVRT conducts antegrade through the accessory pathway — producing a very wide, bizarre QRS that can mimic VT.\n\nWPW pattern on resting ECG: Short PR interval (<120 ms), delta wave (slurred upstroke of QRS), and wide QRS. The delta wave represents early ventricular pre-excitation via the accessory pathway before normal AV node conduction.\n\nCritical safety note: AFib with WPW is a life-threatening emergency. If the accessory pathway in WPW can conduct rapid rates (short accessory pathway refractory period), AFib may conduct at 250–350 bpm directly to the ventricle via the pathway, bypassing AV node protection. This wide-complex irregular tachycardia can degenerate to VF. AV node blocking agents (adenosine, beta-blockers, calcium channel blockers, digoxin) are CONTRAINDICATED in AFib with WPW — they increase conduction via the accessory pathway. Treat with IV procainamide or electrical cardioversion.",
      },
    ],
    faq: [
      {
        question: "How quickly does adenosine need to be given for SVT?",
        answer:
          "Adenosine has a half-life of approximately 10 seconds. It must be pushed rapidly through a large-bore IV closest to the heart (antecubital or more central), immediately followed by a rapid normal saline flush (20 mL). Slow administration or distal IV sites result in drug metabolism before it reaches the AV node.",
      },
      {
        question: "Is AFib with rapid ventricular rate always an emergency?",
        answer:
          "AFib with RVR requires urgency assessment based on hemodynamics. A patient with BP 80/50 and altered consciousness requires immediate synchronized cardioversion. A patient with BP 110/70 and mild palpitations tolerates IV rate control with metoprolol or diltiazem and workup of the precipitant. The rhythm alone does not determine urgency — hemodynamics does.",
      },
    ],
  },
  {
    slug: "ventricular-tachycardia",
    title: "Ventricular Tachycardia — ECG Recognition & Nursing Guide",
    description:
      "Ventricular tachycardia ECG recognition for nurses: monomorphic vs polymorphic VT, Brugada algorithm, AV dissociation, ACLS management, and defibrillation thresholds.",
    h1: "Ventricular tachycardia: ECG recognition, VT vs SVT differentiation, and nursing management",
    keywords: [
      "ventricular tachycardia nursing",
      "VT ECG recognition nursing",
      "monomorphic VT nursing",
      "polymorphic VT nursing",
      "VT vs SVT nurses",
      "ACLS rhythm interpretation nursing",
    ],
    sections: [
      {
        id: "vt-recognition",
        heading: "Ventricular tachycardia recognition: wide-complex tachycardia approach",
        content:
          "Ventricular tachycardia (VT) originates below the bundle of His — in the ventricular myocardium rather than the conduction system. Because activation bypasses the normal His-Purkinje network, conduction is slow and the QRS is wide (≥120 ms). The default assumption for wide-complex tachycardia must be VT, not SVT with aberrancy, because the consequence of treating VT as SVT can be hemodynamic collapse.\n\nThe Brugada four-step algorithm: (1) Absence of RS complex in all precordial leads — if true, diagnose VT (100% specific). (2) RS interval >100 ms in any precordial lead — if true, diagnose VT. (3) AV dissociation — P waves marching through QRS at a different rate — diagnose VT (pathognomonic). (4) Morphologic criteria in V1 and V6: RBBB morphology with monophasic R or qR in V1 (instead of triphasic rSR') and QS or rS in V6 (instead of upright Rs) — diagnose VT.\n\nCapture beats and fusion beats are pathognomonic for VT. A capture beat is a narrow complex occurring during VT when a sinus impulse transiently conducts through the AV node — proves AV dissociation. A fusion beat is a hybrid complex with intermediate morphology from simultaneous sinus and ventricular activation.",
      },
      {
        id: "monomorphic-polymorphic",
        heading: "Monomorphic vs polymorphic VT: clinical significance",
        content:
          "Monomorphic VT has a consistent, regular QRS morphology beat-to-beat — all complexes look the same. It typically originates from a fixed scar-based reentry circuit, most commonly from prior MI. Rate is usually 120–250 bpm. Monomorphic VT is the most common sustained VT morphology and is the target of catheter ablation in patients with recurrent VT storms.\n\nPolymorphic VT has continuously changing QRS morphology — no two consecutive complexes look alike. It often reflects dynamic ischemia, electrolyte instability, or drug toxicity. Torsades de pointes is a specific polymorphic VT with a characteristic twisting of the QRS axis around the isoelectric line in the context of a prolonged QT interval. It requires different management than monomorphic VT.\n\nVentricular fibrillation (VF) produces chaotic electrical activity with no organized QRS complexes. Unlike VT, which may be associated with a pulse, VF is always pulseless and requires immediate defibrillation. The ACLS algorithm for pulseless VT and VF is identical: CPR + defibrillation + epinephrine + amiodarone or lidocaine.",
      },
      {
        id: "stable-unstable-vt",
        heading: "Stable vs unstable VT: treatment decisions",
        content:
          "Hemodynamic stability, not rhythm alone, determines the immediate treatment pathway for VT with a pulse. Unstable VT (hypotension <90 mmHg systolic, altered consciousness, pulmonary edema, or chest pain with ischemic ECG changes) requires immediate synchronized cardioversion regardless of heart rate.\n\nStable VT (maintained blood pressure, alert, no angina) can be triaged to pharmacologic therapy: IV amiodarone 150 mg over 10 minutes is first-line for stable VT in most clinical protocols. IV lidocaine 1–1.5 mg/kg IV bolus is an alternative, particularly with concurrent ischemia. IV procainamide is preferred in electrophysiology protocols and for pre-excited tachycardias. All pharmacologic therapy should be undertaken with cardioversion immediately available — hemodynamics can deteriorate rapidly.",
      },
    ],
    faq: [
      {
        question: "Should verapamil ever be given for wide-complex tachycardia?",
        answer:
          "No — verapamil is contraindicated in wide-complex tachycardia of unknown origin. If the rhythm is VT (the default assumption), verapamil can cause hemodynamic collapse and death. Verapamil is only appropriate for narrow-complex SVT in stable patients. When in doubt about the mechanism of a wide-complex tachycardia, treat as VT.",
      },
      {
        question: "What is electrical storm and how is it managed?",
        answer:
          "Electrical storm is defined as three or more separate episodes of VT or VF within 24 hours requiring cardioversion or defibrillation. It typically occurs with acute ischemia, worsening heart failure, or medication changes in patients with underlying structural heart disease. Management involves treating reversible causes, IV amiodarone infusion, deep sedation to reduce sympathetic activation, and urgent electrophysiology consultation for catheter ablation consideration.",
      },
    ],
  },
  {
    slug: "torsades-de-pointes",
    title: "Torsades de Pointes — QT Prolongation & Nursing Management",
    description:
      "Torsades de pointes ECG recognition, causes, and nursing management. QT prolongation risk factors, drug interactions, magnesium treatment, and prevention strategies.",
    h1: "Torsades de pointes: recognizing the polymorphic VT of QT prolongation",
    keywords: [
      "torsades de pointes nursing",
      "torsades ECG recognition",
      "QT prolongation torsades nursing",
      "polymorphic VT nursing",
      "magnesium torsades nursing",
      "drug-induced torsades nursing",
    ],
    sections: [
      {
        id: "ecg-recognition",
        heading: "ECG recognition: the twisting morphology and QT context",
        content:
          "Torsades de pointes (TdP) is a specific form of polymorphic ventricular tachycardia occurring in the context of a prolonged QT interval. The name means 'twisting of the points' — the QRS complexes appear to twist around the isoelectric baseline, alternating between positive and negative polarity over a span of several beats.\n\nECG features: Wide-complex polymorphic tachycardia, usually at 150–300 bpm. The QRS axis rotates continuously. Episodes are characteristically initiated by a short-long-short coupling sequence: a premature beat (short coupling interval) followed by a long pause, followed by another premature beat that lands in the prolonged QT period and initiates the arrhythmia. The initiating event is often an R-on-T PVC — a premature ventricular contraction falling on the T wave of the preceding beat during the period of maximum repolarization heterogeneity.\n\nDistinguishing TdP from VF: TdP has the characteristic axis-twisting morphology with organized, though polymorphic, QRS complexes. VF is chaotic without any organized QRS structure. TdP often terminates spontaneously; VF is always sustained. Both can degenerate into VF.",
      },
      {
        id: "causes-risk-factors",
        heading: "Causes and risk factors: drugs, electrolytes, and genetic predisposition",
        content:
          "Drug-induced TdP is the most common cause in hospitalized patients. QT-prolonging drugs include: antibiotics (azithromycin, fluoroquinolones, azole antifungals), antipsychotics (haloperidol, quetiapine, ziprasidone), antiarrhythmics (amiodarone, sotalol, dofetilide), antidepressants (TCAs, citalopram), antiemetics (ondansetron, metoclopramide), and methadone. Drug combinations are additive and often synergistic — the risk of TdP from two QT-prolonging drugs is greater than the sum of their individual risks.\n\nElectrolyte abnormalities dramatically increase TdP risk: hypokalemia and hypomagnesemia both prolong the QT interval and increase repolarization heterogeneity. Maintaining potassium above 4.0 mEq/L and magnesium above 2.0 mg/dL is the foundation of TdP prevention in high-risk patients on QT-prolonging medications.\n\nCongenital long QT syndrome (LQTS) involves genetic mutations in cardiac ion channels. LQT1 (KCNQ1 mutation) triggers TdP with exercise or swimming. LQT2 (KCNH2 mutation) triggers TdP with sudden loud noises — auditory stimuli in the night. LQT3 (SCN5A mutation) triggers TdP during rest or sleep. Genotype-specific triggers are important for risk counseling.",
      },
      {
        id: "treatment",
        heading: "Treatment: magnesium, overdrive pacing, and defibrillation",
        content:
          "Sustained TdP with pulse: IV magnesium sulfate 2g over 1–2 minutes is first-line regardless of serum magnesium level. Magnesium shortens the QT interval and reduces repolarization heterogeneity through mechanisms independent of serum level. Additional doses of 2g over 10 minutes can be given if the arrhythmia continues. Correct hypokalemia aggressively — target K+ above 4.0 mEq/L.\n\nPulseless TdP or TdP degenerating to VF: defibrillation immediately — do not wait for drug administration. CPR between shocks per ACLS protocol.\n\nPrevention strategy: identify and eliminate causative drugs; correct electrolytes before initiating QT-prolonging agents; establish baseline QTc; monitor QTc trend (alert clinician if QTc exceeds 500 ms or increases >60 ms from baseline); escalate telemetry monitoring for high-risk combinations. Overdrive pacing at 80–90 bpm can terminate TdP and prevent recurrence by shortening the QT interval relative to cycle length.",
      },
    ],
    faq: [
      {
        question: "What QTc value requires intervention?",
        answer:
          "There is no absolute threshold, but clinical concern increases significantly when QTc exceeds 500 ms, or when QTc has increased more than 60 ms from the patient's baseline. The combination of a borderline QTc (450–500 ms) with multiple risk factors (concurrent hypokalemia, multiple QT-prolonging drugs, female sex, bradycardia) warrants just as much attention as a single isolated prolonged QTc.",
      },
      {
        question: "Does amiodarone cause torsades?",
        answer:
          "Amiodarone prolongs the QT interval significantly — yet paradoxically has a very low rate of torsades compared to other QT-prolonging antiarrhythmics. This is because amiodarone also blocks sodium and calcium channels, which reduces the repolarization heterogeneity that drives TdP. This makes amiodarone unusual among antiarrhythmics: it prolongs QT but rarely causes TdP. This does not eliminate concern — very prolonged QTc on amiodarone warrants evaluation — but it explains why amiodarone remains the first-line agent for many ventricular arrhythmias.",
      },
    ],
  },
  {
    slug: "qt-prolongation",
    title: "QT Prolongation — Clinical Guide for Nurses",
    description:
      "QT prolongation for nurses: measuring QTc (Bazett formula), normal values, causes, drug interactions, risk stratification, and nursing monitoring protocols.",
    h1: "QT prolongation: measuring QTc, identifying risk factors, and nursing monitoring",
    keywords: [
      "QT prolongation nursing",
      "QTc measurement nursing",
      "long QT nursing",
      "QT prolonging drugs nursing",
      "QTc monitoring telemetry",
    ],
    sections: [
      {
        id: "measuring-qtc",
        heading: "Measuring QT and QTc: Bazett formula and clinical significance",
        content:
          "The QT interval measures the total duration of ventricular depolarization and repolarization — from the beginning of the QRS complex to the end of the T wave. QT is rate-dependent: at faster heart rates, QT shortens; at slower rates, QT lengthens. For this reason, QTc (corrected QT) is used to compare intervals across different heart rates.\n\nBazett formula: QTc = QT / √RR (where RR is in seconds). This is the most widely used clinical formula, though it overcorrects at very fast and very slow rates. Most clinical ECG machines calculate and report QTc automatically.\n\nNormal QTc values: Normal is typically defined as QTc ≤440 ms in men and ≤460 ms in women (women have inherently longer QTc than men due to hormonal effects on repolarization). Borderline prolonged: 440–500 ms in men, 460–500 ms in women. Significantly prolonged: QTc >500 ms, regardless of sex — this threshold correlates with substantially increased torsades de pointes risk.",
      },
      {
        id: "drug-causes",
        heading: "Drug-induced QT prolongation: high-risk medications and combinations",
        content:
          "Drug-induced QT prolongation is the most preventable cause of torsades in hospitalized patients. High-risk medications include: antiarrhythmics (sotalol, dofetilide, ibutilide, quinidine — class IA and III agents), antibiotics (azithromycin, fluoroquinolones, azole antifungals), antipsychotics (haloperidol — especially IV, droperidol, ziprasidone, quetiapine), antiemetics (ondansetron — particularly IV doses >32 mg, metoclopramide), antidepressants (citalopram at doses >40 mg, escitalopram >20 mg, TCAs), opioids (methadone).\n\nRisk is additive: two QT-prolonging drugs combined carry more risk than either alone. Three or more QT-prolonging drugs, particularly in a patient with baseline QT prolongation, concurrent electrolyte abnormalities, or structural heart disease, represents a high-risk combination requiring mandatory telemetry monitoring and aggressive electrolyte management.\n\nNursing intervention: Check QTc before administering new QT-prolonging medications. Alert prescriber when adding a second QT-prolonging agent. Ensure potassium is ≥4.0 and magnesium is ≥2.0 before initiating high-risk drugs. Document baseline QTc and monitor trend.",
      },
    ],
    faq: [
      {
        question: "Which sex has a longer QT interval and why?",
        answer:
          "Women have a longer intrinsic QTc than men (roughly 10–20 ms longer). This difference is driven by sex hormones — testosterone shortens the QT interval. Women have double the risk of drug-induced torsades de pointes compared to men, making female sex an independent risk factor that should be considered when prescribing QT-prolonging medications.",
      },
      {
        question: "Should all patients on IV haloperidol have cardiac monitoring?",
        answer:
          "Yes — IV haloperidol (Haldol) prolongs the QT interval more significantly than oral haloperidol and is associated with torsades de pointes. Current guidance recommends continuous cardiac monitoring for patients receiving IV haloperidol, with QTc monitoring at baseline and periodically during treatment. Alert thresholds: QTc >500 ms or increase >60 ms from baseline warrants provider notification and reassessment.",
      },
    ],
  },
  {
    slug: "heart-block-interpretation",
    title: "Heart Block Interpretation — Complete Guide for Nurses",
    description:
      "Complete guide to heart block for nurses: first-degree, Mobitz I, Mobitz II, and complete (third-degree) heart block ECG features, clinical significance, and pacing indications.",
    h1: "Heart block interpretation for nurses: from first-degree to complete heart block",
    keywords: [
      "heart block interpretation nursing",
      "AV block nursing",
      "complete heart block nursing",
      "third degree heart block nursing",
      "pacemaker heart block nursing",
      "cardiac rhythm interpretation nursing",
    ],
    sections: [
      {
        id: "first-degree-block",
        heading: "First-degree AV block: prolonged PR, all beats conduct",
        content:
          "First-degree AV block is defined by a PR interval greater than 200 ms (5 small boxes) with every P wave followed by a QRS complex — no beats are dropped. The conduction is delayed but not blocked. This is usually a benign finding and commonly occurs with: increased vagal tone (athletes, during sleep), inferior MI, AV node dysfunction from aging, medication effects (digoxin, beta-blockers, calcium channel blockers), and Lyme carditis.\n\nFirst-degree AV block alone rarely causes symptoms or hemodynamic compromise. However, in the context of existing conduction system disease (bundle branch block), a newly prolonged PR interval may indicate worsening infranodal disease. In inferior MI, first-degree block progression to higher-degree block warrants close monitoring.",
      },
      {
        id: "complete-heart-block",
        heading: "Complete (third-degree) heart block: AV dissociation and escape rhythms",
        content:
          "Complete (third-degree) heart block is complete failure of AV conduction — no atrial impulses conduct to the ventricles. The atria and ventricles beat independently: P waves march at the sinus rate, QRS complexes march at the escape rhythm rate, and the two are completely dissociated.\n\nThe escape rhythm source determines QRS width and rate, and the hemodynamic risk. Junctional escape (block at the AV node level): rate 40–60 bpm, narrow QRS, more reliable and stable. Ventricular escape (block at infranodal level): rate 20–40 bpm, wide QRS, less reliable, more dangerous — pauses and abrupt asystole are risks.\n\nCauses: Inferior MI (AV nodal artery ischemia, often reversible), anterior MI with septal infarction destroying the bundle branches (serious, often permanent), Lyme carditis, cardiac sarcoidosis, idiopathic degeneration of conduction system (Lev's disease, Lenègre's disease), digoxin toxicity, and calcific aortic valve disease extending to the conduction system.\n\nManagement: transcutaneous pacing for hemodynamic compromise while arranging transvenous pacing. Atropine has limited effect on infranodal complete heart block. Permanent pacemaker is indicated for persistent complete heart block not from a reversible cause.",
      },
    ],
    faq: [
      {
        question: "Can complete heart block be reversed?",
        answer:
          "Yes, in some cases. Complete heart block from inferior MI often resolves as the RCA territory reperfuses — the AV node recovers and conduction returns within hours to days. Complete heart block from anterior MI involving the bundle branches is usually permanent. Lyme carditis-associated heart block resolves with antibiotic treatment in most cases. Drug-induced heart block (digoxin) resolves when the offending drug is held and levels fall.",
      },
      {
        question: "What is the ventricular rate in complete heart block?",
        answer:
          "The ventricular rate in complete heart block depends on the escape rhythm source: junctional escape (block at AV node) produces a rate of 40–60 bpm; ventricular escape (infranodal block) produces a rate of 20–40 bpm. The escape rate is independent of the atrial rate and cannot be increased by atropine — only by pacing.",
      },
    ],
  },
  {
    slug: "ecg-practice-questions",
    title: "ECG Practice Questions for Nurses — Strip-Based Rhythm Drills",
    description:
      "ECG practice questions for nurses: strip-based rhythm recognition, 12-lead interpretation, arrhythmia identification, and ACLS-integrated clinical scenarios with full rationales.",
    h1: "ECG practice questions for nurses: rhythm recognition, 12-lead interpretation, and clinical scenarios",
    keywords: [
      "ECG practice questions nurses",
      "ECG practice questions nursing",
      "rhythm recognition practice nurses",
      "ECG strip practice nursing",
      "ACLS rhythm interpretation practice",
      "cardiac rhythm practice questions",
    ],
    sections: [
      {
        id: "what-to-practice",
        heading: "What ECG practice questions test: from strip recognition to clinical integration",
        content:
          "Effective ECG practice for nurses covers three levels of complexity. Strip recognition — identifying the rhythm from a telemetry strip — builds the foundational pattern library. Clinical integration — connecting the rhythm to the appropriate nursing response, intervention priority, and medication consideration — builds the judgment that telemetry nursing and examination questions actually test. ACLS integration — applying rhythm recognition to arrest and peri-arrest ACLS algorithms — develops the emergency response skills required in ICU, CCU, and emergency nursing practice.\n\nCommon high-yield ECG practice topics: sinus tachycardia vs supraventricular tachycardia (differentiating rhythm from rate); AFib vs AFib with RVR vs sinus tachycardia with artifact; VT vs SVT with aberrancy; second-degree AV block (Mobitz I vs Mobitz II); complete heart block with junctional vs ventricular escape; STEMI localization (inferior, anterior, lateral, posterior); De Winter T-waves and posterior STEMI (commonly missed on practice questions because they lack obvious ST elevation); pacemaker malfunction (failure to capture vs undersensing vs failure to pace).",
      },
      {
        id: "practice-question-approach",
        heading: "Approaching ECG practice questions: a systematic method",
        content:
          "A systematic approach to ECG practice questions prevents missed answers and builds transferable clinical habits. Step 1: Rate — is the heart rate within normal limits, bradycardic, or tachycardic? Step 2: Rhythm — regular or irregular? Any pattern to the irregularity? Step 3: P waves — present, absent, inverted, retrograde? One per QRS? Relationship to QRS? Step 4: PR interval — normal (120–200 ms), short (pre-excitation), or prolonged (AV block)? Constant or variable? Step 5: QRS width — narrow (<120 ms) or wide (≥120 ms)? Step 6: ST and T waves — elevation, depression, inversion, peaked, biphasic?\n\nFor multiple-choice ECG questions, apply this systematic approach before looking at the answer choices. The most common error is pattern-matching to the first familiar-looking answer — systematic analysis catches the 2:1 AV block disguised as sinus bradycardia, or the posterior STEMI disguised as an NSTEMI.",
      },
      {
        id: "module-access",
        heading: "ECG practice questions in the NurseNest system",
        content:
          "The NurseNest ECG module includes 200+ strip-based practice questions across all major topics, integrated with the adaptive weak-area tracking system. Questions appear in the same format as clinical nursing examinations — clinical vignettes with a patient scenario, vital signs, clinical context, and an ECG strip, requiring the learner to integrate rhythm recognition with nursing priority.\n\nBasic ECG quizzes cover the foundational recognition topics. Advanced ECG scenarios include multi-step clinical cases with complex rhythm combinations, ACLS decision integration, and high-acuity telemetry interpretation. Video-drill exercises pair ECG strips with short teaching explanations for spaced-repetition reinforcement. Worksheets provide a printable systematic ECG interpretation framework for self-directed study.",
      },
    ],
    faq: [
      {
        question: "How many ECG practice questions should I complete before my exam?",
        answer:
          "There is no fixed number — the goal is to reach consistent accuracy across all rhythm categories, not a question count. Focus on quality: review rationales for every question, including ones you answered correctly. Surface-level correct answers from pattern-matching rather than systematic reasoning fail under novel test formats. Use adaptive practice to identify the weakest categories and target those deliberately.",
      },
      {
        question: "What is the most commonly missed ECG pattern on nursing exams?",
        answer:
          "Posterior STEMI is the most commonly missed pattern on both clinical telemetry and nursing examinations. Because standard 12-lead ECG shows ST depression (not elevation) in V1–V3, the pattern is mistakenly attributed to subendocardial ischemia or NSTEMI rather than a true occlusion-level MI requiring emergent reperfusion. Any ST depression in V1–V3 in a patient with chest pain warrants posterior lead placement before STEMI is excluded.",
      },
    ],
  },
  // ─── New cluster topics — added in ECG cluster expansion sprint ────────────
  {
    slug: "how-to-read-ecg-strips",
    title: "How to Read ECG Strips — Systematic Interpretation for Nurses",
    description:
      "Step-by-step guide to reading ECG rhythm strips for nurses: rate, rhythm, P waves, PR interval, QRS width, ST changes, and diagnosis. Systematic method prevents errors.",
    h1: "How to read ECG strips: a systematic step-by-step method for nurses",
    keywords: [
      "how to read ECG strips nursing",
      "ECG strip interpretation nursing",
      "how to read rhythm strip nursing",
      "ECG interpretation steps nursing",
      "reading cardiac monitor strips nursing",
    ],
    sections: [
      {
        id: "seven-steps",
        heading: "The 7-step systematic ECG strip interpretation method",
        content:
          "Reading ECG strips reliably requires a systematic approach applied to every strip — not pattern-matching shortcuts. The 7-step method prevents the most common clinical error: jumping to a diagnosis before completing the analysis.\n\nStep 1 — Rate: Count the ventricular rate. Methods: (a) 300 ÷ number of large boxes between R waves (for regular rhythms); (b) 1500 ÷ number of small boxes between R waves (precise, regular rhythms); (c) Count QRS complexes in a 6-second strip × 10 (for irregular rhythms like AFib). Normal: 60–100 bpm. Bradycardia < 60. Tachycardia > 100.\n\nStep 2 — Rhythm: Are R-R intervals consistent? Measure R-R intervals across the strip using calipers or the paper. Regular: all R-R intervals equal. Irregular: intervals differ. Regularly irregular: a pattern to the irregularity (e.g., Wenckebach group beating). Irregularly irregular: no pattern (AFib).\n\nStep 3 — P waves: Are P waves present? One P wave before every QRS? Are all P waves identical in morphology? Upright in lead II? Retrograde (inverted) or absent P waves change the differential significantly.\n\nStep 4 — PR interval: Measure from beginning of P wave to beginning of QRS. Normal: 120–200 ms (3–5 small boxes). Prolonged (> 200 ms) = AV block or drug effect. Short (< 120 ms) = pre-excitation (WPW). Variable (progressively longer) = Wenckebach.\n\nStep 5 — QRS width: Measure from beginning to end of QRS complex. Normal narrow: < 120 ms (< 3 small boxes). Wide (≥ 120 ms) = bundle branch block, ventricular origin, or aberrant conduction. Wide-complex tachycardia = VT until proven otherwise.\n\nStep 6 — ST segment and T waves: ST elevation (≥ 1mm in two contiguous limb leads, ≥ 2mm in precordial) = STEMI until proven otherwise. ST depression = ischemia, strain, digitalis. T-wave inversion = ischemia, PE, electrolyte abnormality. Peaked narrow T waves = hyperkalemia.\n\nStep 7 — Diagnosis: Synthesize all six findings. Apply the most dangerous interpretation when uncertain. In wide-complex tachycardia: VT until proven otherwise. In bradycardia: assess hemodynamics before treating rate alone.",
      },
      {
        id: "common-errors",
        heading: "Common ECG strip reading errors and how to avoid them",
        content:
          "The most dangerous ECG strip reading errors arise from incomplete systematic analysis. Seeing a fast rate and assuming SVT without checking QRS width — missing VT. Seeing an irregular rhythm and diagnosing AFib without checking P-wave morphology — missing PACs with compensatory pauses. Measuring one interval and extrapolating — missing the progressive PR prolongation of Wenckebach.\n\nArtifact recognition is essential: motion artifact can perfectly mimic VF or VT on a rhythm strip. The clinical rule is non-negotiable — assess the patient, not the monitor. A responsive patient with a palpable pulse cannot be in ventricular fibrillation regardless of what the strip shows.\n\nRate calculation errors with irregular rhythms: never use the 300 or 1500 rule for irregular rhythms. Use the 6-second strip count (count QRS complexes in 6 seconds × 10) or the 10-second strip count × 6.",
      },
    ],
    faq: [
      {
        question: "How do you calculate heart rate from an ECG strip?",
        answer:
          "For regular rhythms: 300 ÷ number of large boxes between consecutive R waves (each large box = 0.2 seconds). If R waves are exactly 1, 2, 3, 4, 5, or 6 large boxes apart, the rate is 300, 150, 100, 75, 60, or 50 bpm respectively. For irregular rhythms: count QRS complexes in a 6-second strip and multiply by 10. The 6-second strip method is the only accurate method for AFib, irregular PAC rhythms, or any pattern without fixed R-R intervals.",
      },
      {
        question: "What does a normal ECG strip look like?",
        answer:
          "Normal sinus rhythm on an ECG strip: rate 60–100 bpm, regular rhythm (consistent R-R intervals), upright P wave before every QRS in lead II, PR interval 120–200 ms, narrow QRS < 120 ms, isoelectric ST segment with upright T waves, no ectopic beats. The P wave reflects atrial depolarization from the SA node. The QRS reflects ventricular depolarization. The T wave reflects ventricular repolarization.",
      },
      {
        question: "How many small boxes equal 1 second on ECG paper?",
        answer:
          "At the standard ECG paper speed of 25 mm/s: each small box is 1 mm wide = 0.04 seconds (40 ms). Each large box (5 small boxes) is 5 mm = 0.20 seconds (200 ms). One second = 5 large boxes = 25 small boxes. A 6-second strip = 30 large boxes. These measurements are foundational for all interval and rate calculations.",
      },
    ],
  },
  {
    slug: "normal-sinus-rhythm-ecg",
    title: "Normal Sinus Rhythm ECG — Features, Rate, and Clinical Significance",
    description:
      "Normal sinus rhythm ECG characteristics for nurses: rate 60–100 bpm, P waves, PR interval, QRS width, and what variations mean clinically.",
    h1: "Normal sinus rhythm: ECG features, diagnostic criteria, and clinical significance",
    keywords: [
      "normal sinus rhythm ECG nursing",
      "normal sinus rhythm features",
      "sinus rhythm ECG interpretation",
      "normal cardiac rhythm nursing",
      "NSR ECG criteria",
    ],
    sections: [
      {
        id: "nsr-criteria",
        heading: "Normal sinus rhythm: ECG diagnostic criteria",
        content:
          "Normal sinus rhythm (NSR) has five defining ECG characteristics that must ALL be present:\n\n1. Rate 60–100 bpm: the SA node fires within the physiologic normal range. Rates outside this range (sinus bradycardia < 60, sinus tachycardia > 100) are named variants, not NSR.\n\n2. Upright P wave before every QRS in lead II: the impulse originates at the SA node and depolarizes the atria in the normal superior-to-inferior and right-to-left direction, producing an upright P wave in the inferior leads. A different P-wave axis (inverted, biphasic, variable) indicates an ectopic atrial focus, not sinus origin.\n\n3. Consistent P-wave morphology: all P waves look identical — same height, duration, and shape. Variable P-wave morphology indicates wandering atrial pacemaker or multiple ectopic foci.\n\n4. PR interval 120–200 ms: normal AV conduction time. PR > 200 ms = first-degree AV block. PR < 120 ms = pre-excitation (WPW) or accelerated AV conduction.\n\n5. Narrow QRS < 120 ms: normal ventricular conduction via the His-Purkinje network. Wide QRS indicates bundle branch block or ventricular origin.\n\nOne common addition: regular R-R intervals. Note that respiratory sinus arrhythmia — physiologic cyclic rate variation with breathing — can be considered a normal variant and does not disqualify sinus rhythm.",
      },
      {
        id: "nsr-variants",
        heading: "Normal sinus rhythm variants: bradycardia, tachycardia, and RSA",
        content:
          "Sinus bradycardia: all NSR criteria met, rate < 60 bpm. Common causes: high vagal tone (athletes, sleep), inferior MI, medications (beta-blockers, calcium channel blockers, digoxin), hypothyroidism. Clinically benign when asymptomatic. Requires treatment only when symptomatic (hypotension, syncope, hemodynamic compromise).\n\nSinus tachycardia: all NSR criteria met, rate > 100 bpm. Always physiologically driven — fever, pain, anxiety, dehydration, hypoxia, anemia, PE, sepsis, thyrotoxicosis. The rate responds to the clinical state and decreases when the cause is addressed. Treatment targets the cause, not the rate.\n\nRespiratory sinus arrhythmia (RSA): cyclic rate variation synchronized with breathing — faster during inspiration, slower during expiration. All P-wave morphology is consistently sinus. No dropped beats. Most prominent in children and athletes (high vagal tone). Not a pathologic finding.",
      },
    ],
    faq: [
      {
        question: "What is the normal heart rate in sinus rhythm?",
        answer:
          "Normal sinus rhythm has a rate of 60–100 bpm. Below 60 bpm = sinus bradycardia (same P-wave, QRS, and interval characteristics as NSR, just slower). Above 100 bpm = sinus tachycardia. Both are physiologically normal SA node rhythms at different rates — the 60–100 range is the arbitrarily defined 'normal' window.",
      },
      {
        question: "How do you confirm a rhythm is sinus (not junctional or ectopic atrial)?",
        answer:
          "Three confirmatory features: (1) Upright P wave in lead II — sinus P waves are positive in lead II because the electrical axis from the SA node to the AV node aligns with lead II. Junctional rhythms produce inverted or retrograde P waves in lead II. (2) Consistent P-wave morphology across all beats — ectopic atrial rhythms show different P-wave shapes. (3) P-wave axis in the normal range (+0° to +75°) — confirmed on a 12-lead ECG by assessing multiple lead views.",
      },
    ],
  },
  {
    slug: "atrial-fibrillation-ecg",
    title: "Atrial Fibrillation ECG — Recognition, Features & Nursing Management",
    description:
      "Atrial fibrillation ECG recognition for nurses: irregularly irregular rhythm, absent P waves, fibrillatory baseline, rate control priorities, anticoagulation assessment, and cardioversion thresholds.",
    h1: "Atrial fibrillation ECG: irregularly irregular rhythm, absent P waves, and nursing management",
    keywords: [
      "atrial fibrillation ECG nursing",
      "AFib ECG recognition nursing",
      "atrial fibrillation rhythm strip nursing",
      "how to identify AFib on ECG",
      "AFib nursing management",
    ],
    sections: [
      {
        id: "ecg-recognition",
        heading: "Atrial fibrillation ECG recognition: the three hallmarks",
        content:
          "Atrial fibrillation has three defining ECG features that together make it one of the most recognizable arrhythmias:\n\n1. Irregularly irregular R-R intervals: no two consecutive R-R intervals are equal, and there is no predictable pattern. This is the most clinically important feature — it distinguishes AFib from all regularly irregular rhythms (Wenckebach, bigeminy) and all regular tachycardias (SVT, sinus tach). Even brief periods of regularity within AFib should prompt reconsideration of the diagnosis.\n\n2. Absent organized P waves: instead of discrete P waves, the baseline between QRS complexes shows fine fibrillatory activity — low-amplitude, rapid (350–600/min), irregular oscillations. This represents chaotic atrial electrical activity from multiple simultaneous re-entrant wavelets. In coarse AFib, these fibrillatory waves are more prominent; in fine AFib, the baseline may appear nearly flat.\n\n3. Narrow QRS (unless aberrancy): ventricular conduction remains normal via the His-Purkinje system, producing a narrow QRS. A wide QRS in AFib indicates either pre-existing bundle branch block, rate-related aberrancy (Ashman phenomenon), or pre-excitation via an accessory pathway (AFib + WPW — a dangerous combination requiring different management).",
      },
      {
        id: "nursing-priorities",
        heading: "AFib nursing priorities: rate, rhythm, and anticoagulation",
        content:
          "Hemodynamic assessment first: Is the patient hemodynamically stable (adequate BP, no altered mentation, no pulmonary edema)? Unstable → synchronized cardioversion. Stable → pharmacologic rate or rhythm control.\n\nRate control target: resting ventricular rate < 80–110 bpm. IV metoprolol (contraindicated in HFrEF) or diltiazem (contraindicated in preexcitation). Amiodarone for rate control in hemodynamically compromised patients.\n\nDuration assessment determines anticoagulation approach: onset < 48 hours — lower thrombus risk, cardioversion without prolonged anticoagulation may be safe. Onset unknown or > 48 hours — anticoagulate for ≥ 3 weeks before elective cardioversion, OR perform TEE to rule out LAA thrombus. Post-cardioversion: anticoagulate for ≥ 4 weeks regardless of duration.\n\nCHA₂DS₂-VASc score drives long-term anticoagulation decision: ≥ 2 in men or ≥ 3 in women = anticoagulation indicated (DOACs preferred over warfarin unless mechanical valve or CrCl < 15 mL/min).",
      },
    ],
    faq: [
      {
        question: "How do you tell AFib from a regular rhythm on telemetry?",
        answer:
          "The most reliable bedside test: measure multiple consecutive R-R intervals using calipers or the paper. In AFib, no two intervals are equal and there is no predictable pattern. In normal sinus rhythm or SVT, intervals are equal. In Wenckebach (regularly irregular), there is a predictable repeating group pattern. The absence of organized P waves and the chaotic baseline between QRS complexes confirm AFib.",
      },
      {
        question: "Can AFib look regular on a rhythm strip?",
        answer:
          "AFib with rapid ventricular rate (RVR) at very high rates (150–180 bpm) can appear nearly regular because the small absolute variation between R-R intervals is compressed. Always measure intervals precisely with calipers. AFib with complete heart block produces a regular slow ventricular rate (regular escape rhythm) — the combination looks regular but is actually a dangerous dual pathology. AF + WPW with rapid preexcited conduction can look like VT — wide, rapid, irregular.",
      },
    ],
  },
  {
    slug: "telemetry-interpretation-nurses",
    title: "Telemetry Interpretation for Nurses — Bedside Monitor Reading Guide",
    description:
      "Telemetry interpretation guide for nurses: reading continuous cardiac monitors, alarm management, rhythm recognition at the bedside, artifact identification, and escalation decisions.",
    h1: "Telemetry interpretation for nurses: reading cardiac monitors, managing alarms, and recognizing arrhythmias",
    keywords: [
      "telemetry interpretation nurses",
      "cardiac monitor interpretation nursing",
      "bedside telemetry nursing",
      "telemetry alarm management nursing",
      "continuous cardiac monitoring nursing",
    ],
    sections: [
      {
        id: "telemetry-basics",
        heading: "Telemetry interpretation basics: what nurses monitor and why",
        content:
          "Telemetry monitoring continuously records cardiac electrical activity in real time, typically from 2–3 leads (Lead II for rhythm, V1 for bundle branch morphology). Unlike the 12-lead ECG (a diagnostic snapshot), telemetry is a surveillance tool — alerting nurses to rhythm changes as they develop.\n\nTelemetry nurses in step-down, CCU, and progressive care units may monitor 8–16 patients simultaneously. The clinical skill is pattern surveillance: recognizing when a monitored rhythm represents a change from baseline, when it requires immediate bedside assessment versus documentation, and when to escalate versus reassure.\n\nKey telemetry concepts: rate trends (gradual HR increase may indicate developing infection or pain before other symptoms appear), rhythm variability (disappearance of respiratory sinus arrhythmia may signal physiologic stress), ST segment changes (continuous ST monitoring in high-risk patients catches silent ischemia), alarm threshold setting (individualizing alarm parameters to the patient's baseline reduces alarm fatigue without missing critical events).",
      },
      {
        id: "alarm-management",
        heading: "Telemetry alarm management: reducing alarm fatigue without missing critical events",
        content:
          "Alarm fatigue — the desensitization of nurses to alarms due to excessive false positives — is a recognized patient safety issue. The solution is not silence, but smart alarm parameter setting.\n\nIndividualize alarm parameters at each assessment: A patient in chronic AFib should not have an 'irregular rhythm' alarm active. A patient with resting heart rate 85 bpm should have HR alarms set at 50–120, not 60–100. Review and adjust at each shift assessment, not just on admission.\n\nAlarm categories: (1) Asystole, pulseless VT, VF — always active, never silenced. (2) Extreme rate (very high or low) — set based on patient baseline ±20–25 bpm. (3) Irregular rhythm — consider patient history (chronic AFib → off; new-onset irregular → active). (4) Lead-off, artifact — immediate bedside check.\n\nThe 'assess before you intervene' principle: never change a patient's clinical status based on monitor alone. A non-responsive patient with VF on monitor requires immediate CPR. A responsive, comfortable patient with 'VF' on monitor requires lead check and clinical assessment — the rhythm is artifact.",
      },
    ],
    faq: [
      {
        question: "What is the difference between telemetry and bedside monitoring?",
        answer:
          "Telemetry monitoring uses a wireless transmitter worn by the patient, allowing continuous cardiac monitoring while the patient is mobile on the ward. The signal is transmitted to a central monitoring station and/or displayed at the bedside. Bedside monitoring (bedside unit, ICU monitor) uses direct cable connections and is used for patients who are stationary and require close surveillance. Both record rhythm continuously; telemetry enables ambulation; bedside monitoring typically offers more parameters (SpO₂, NIBP, ETCO₂, arterial waveform on ICU units).",
      },
      {
        question: "What rhythms require immediate bedside response on telemetry?",
        answer:
          "Rhythms requiring immediate bedside assessment: (1) VF or asystole — code response; (2) VT with rate > 150 — assess hemodynamics immediately; (3) Complete heart block with slow rate and symptoms; (4) New ST elevation — STEMI protocol; (5) Pacemaker failure to capture in a pacemaker-dependent patient; (6) Any rhythm change accompanied by clinical deterioration (BP drop, altered mentation, chest pain). Rhythms that can be assessed at the next available opportunity (within 15–30 min): PVCs increasing in frequency, new PACs, rate trending up in a stable patient.",
      },
    ],
  },
  {
    slug: "heart-rate-calculation-ecg",
    title: "Heart Rate Calculation on ECG — Methods for Nurses",
    description:
      "How to calculate heart rate from an ECG or rhythm strip: the 300 rule, 1500 method, and 6-second count for nurses. Regular vs irregular rhythm rate calculation explained.",
    h1: "How to calculate heart rate on ECG: the 300 rule, 1500 method, and 6-second count",
    keywords: [
      "heart rate calculation ECG nursing",
      "how to calculate heart rate from ECG",
      "ECG rate calculation nursing",
      "300 rule ECG",
      "heart rate rhythm strip nursing",
    ],
    sections: [
      {
        id: "calculation-methods",
        heading: "Three methods for calculating heart rate from an ECG strip",
        content:
          "Method 1 — The 300 Rule (regular rhythms only):\nDivide 300 by the number of large boxes between two consecutive R waves. Each large box = 0.2 seconds at 25 mm/s paper speed. Memory aid: 1 box = 300, 2 = 150, 3 = 100, 4 = 75, 5 = 60, 6 = 50. If R-R spans 3 large boxes → rate 100 bpm. If 4 large boxes → rate 75 bpm. This method requires a regular rhythm — using it with AFib or other irregular rhythms produces inaccurate results.\n\nMethod 2 — The 1500 Method (regular rhythms, high precision):\nDivide 1500 by the number of small boxes between consecutive R waves. Each small box = 0.04 seconds. More precise than the 300 rule for rates between the memorized thresholds. Example: R-R = 18 small boxes → 1500 ÷ 18 = 83 bpm.\n\nMethod 3 — The 6-Second Count (all rhythms, including irregular):\nCount QRS complexes in a 6-second strip and multiply by 10. A 6-second strip contains 30 large boxes. This is the only accurate method for irregular rhythms (AFib, irregular PAC runs, variable rate). It is less precise for very regular rhythms but clinically sufficient for most nursing decision-making.\n\nMethod 4 — The 10-Second Count: Count QRS complexes in 10 seconds × 6. Used on strips that clearly mark the 10-second boundary (some monitor printouts).",
      },
      {
        id: "clinical-application",
        heading: "Clinical application: when precision matters vs. estimation",
        content:
          "For stable monitoring: The 6-second count or 300 rule gives adequate rate estimation for documenting and trending. The critical question is whether the rate is normal (60–100), bradycardic (< 60), or tachycardic (> 100), not whether it is exactly 74 vs 76 bpm.\n\nFor ACLS/intervention decisions: More precise calculation matters when the rate is near a clinical threshold — is this VT at 100 bpm or accelerated idioventricular rhythm? Is the bradycardia at 52 or 58 bpm (above the 50 bpm threshold for atropine consideration)? Use the 1500 method or direct calipers for precision in these cases.\n\nFor irregular rhythms: Always use the 6-second count. Never use the 300 rule or 1500 method for AFib, variable AV block, or frequent ectopy. The 'average' rate from a 6-second count gives the most clinically meaningful information for irregular rhythms.",
      },
    ],
    faq: [
      {
        question: "How do you use the 300 rule for ECG rate calculation?",
        answer:
          "The 300 rule: memorize 300-150-100-75-60-50 for 1–2–3–4–5–6 large boxes between R waves. Find two consecutive R waves on the strip. Count the large boxes between them. Look up the corresponding rate: 1 box = 300 bpm (paced/very fast), 2 = 150 bpm (SVT range), 3 = 100 bpm (upper normal/tachycardia threshold), 4 = 75 bpm (mid-normal), 5 = 60 bpm (lower normal/bradycardia threshold), 6 = 50 bpm (bradycardia). Only valid for regular rhythms.",
      },
      {
        question: "Which ECG rate calculation method should I use for atrial fibrillation?",
        answer:
          "Always use the 6-second count (or 10-second count) for atrial fibrillation. AFib is irregularly irregular — the R-R interval is never the same. Applying the 300 rule to any single R-R interval gives a misleading 'instantaneous rate' that does not represent the average ventricular rate. Count all QRS complexes in 6 seconds and multiply by 10 to get the average rate, which is what guides rate control decisions.",
      },
    ],
  },

  // ─── Phase 1 Traffic Acceleration Sprint — 19 new cluster topics ────────────

  {
    slug: "atrial-flutter-ecg",
    title: "Atrial Flutter ECG — Sawtooth Pattern & Rate Recognition",
    description:
      "Atrial flutter ECG recognition for nurses: sawtooth flutter waves, 2:1 and 4:1 conduction ratios, rate calculation, AFib differential, and cardioversion indications.",
    h1: "Atrial flutter ECG: sawtooth flutter waves, conduction ratios, and nursing management",
    keywords: ["atrial flutter ECG nursing", "atrial flutter rhythm strip", "flutter waves ECG", "atrial flutter vs AFib", "atrial flutter nursing management"],
    sections: [
      {
        id: "flutter-recognition",
        heading: "Atrial flutter ECG recognition: the sawtooth pattern",
        content:
          "Atrial flutter is a macro-reentrant atrial arrhythmia producing a distinctive sawtooth baseline pattern — organized atrial activity at approximately 250–350 bpm. The flutter waves are continuous, regular, and saw-toothed, most prominent in the inferior leads (II, III, aVF) and V1.\n\nConduction ratios determine the ventricular rate. In typical 2:1 flutter, every other flutter wave conducts: atrial rate 300 → ventricular rate 150 bpm. 4:1 flutter produces ventricular rate 75 bpm. Variable block (2:1 and 4:1 alternating) produces irregular ventricular response mimicking AFib — measure the flutter-to-QRS timing to differentiate.\n\nKey recognition feature: QRS morphology is normal and narrow (unless bundle branch block exists). The QRS rides on the continuous flutter wave baseline. Identifying the flutter-wave frequency (measure F-F interval) confirms atrial rate and rules out AFib.",
      },
      {
        id: "flutter-vs-afib",
        heading: "Atrial flutter vs atrial fibrillation: the clinical distinction",
        content:
          "Atrial flutter and AFib are both supraventricular arrhythmias and require similar anticoagulation assessment — but their ECG recognition and some management details differ. Flutter: organized sawtooth flutter waves at fixed rate (~300/min), often regular ventricular response (unless variable block). AFib: chaotic fibrillatory baseline, always irregularly irregular ventricular response, no organized P waves.\n\nAdenosine differentiates them when in doubt: adenosine transiently blocks AV conduction, slowing the ventricular rate and revealing the underlying atrial activity. In flutter, the sawtooth pattern becomes unmistakable. Adenosine does not terminate flutter — it only unmasks it. Treatment is synchronized cardioversion for unstable flutter or rate control with antiarrhythmics for stable flutter.",
      },
    ],
    faq: [
      { question: "What does atrial flutter look like on ECG?", answer: "Atrial flutter produces a continuous sawtooth baseline in lead II at approximately 250–350 bpm (typically ~300 bpm). Flutter waves are regularly spaced and best seen in leads II, III, aVF, and V1. At 2:1 conduction, the ventricular rate is typically 150 bpm — a regular narrow-complex tachycardia at exactly 150 bpm should prompt flutter consideration." },
      { question: "What is the ventricular rate in atrial flutter with 2:1 block?", answer: "With 2:1 block, every other flutter wave conducts: if atrial rate is 300 bpm, ventricular rate = 150 bpm. With 4:1 block, ventricular rate = 75 bpm. Any regular narrow-complex tachycardia at exactly 150 bpm should raise immediate suspicion for atrial flutter with 2:1 conduction." },
    ],
  },
  {
    slug: "ventricular-fibrillation-ecg",
    title: "Ventricular Fibrillation ECG — Chaotic Rhythm & ACLS Response",
    description:
      "Ventricular fibrillation ECG recognition: chaotic waveform, no organized QRS, defibrillation thresholds, artifact vs true VF, and ACLS management priorities for nurses.",
    h1: "Ventricular fibrillation ECG: recognizing the chaotic waveform and initiating ACLS",
    keywords: ["ventricular fibrillation ECG nursing", "VF ECG recognition", "VF vs artifact telemetry", "ventricular fibrillation ACLS", "defibrillation VF nursing"],
    sections: [
      {
        id: "vf-recognition",
        heading: "Ventricular fibrillation ECG recognition",
        content:
          "Ventricular fibrillation is characterized by completely chaotic electrical activity with no organized QRS complexes, P waves, or T waves. The baseline shows irregular, rapid oscillations of varying amplitude and morphology — 'coarse' VF has larger oscillations; 'fine' VF has lower amplitude and can be confused with asystole.\n\nCritical safety rule: NEVER diagnose VF or initiate defibrillation based solely on the monitor. Confirm the patient is unresponsive and pulseless before beginning CPR and defibrillation. Motion artifact can perfectly mimic coarse VF — a responsive, perfusing patient cannot be in ventricular fibrillation.\n\nFine vs coarse VF: coarse VF (higher amplitude) responds better to defibrillation. If fine VF is suspected, confirm in a second lead — perpendicular lead orientation may reveal residual waveform amplitude confirming VF over asystole. VF is always shockable; asystole is not.",
      },
      {
        id: "vf-management",
        heading: "VF ACLS management: defibrillation sequence",
        content:
          "ACLS pulseless VF algorithm: (1) Begin CPR immediately. (2) Apply defibrillator pads — biphasic energy 120–200J (device-specific); monophasic 360J. (3) Shock → immediately resume CPR for 2 minutes without checking rhythm first. (4) After 2 minutes: rhythm check. If persistent VF/pVT → shock again. (5) Epinephrine 1mg IV/IO after 3rd cycle, then every 3–5 minutes. (6) Amiodarone 300mg IV/IO for refractory VF (second dose 150mg if needed). (7) Search for reversible causes: 6Hs and 5Ts.\n\nPost-ROSC priorities: avoid hyperoxia (target SpO₂ 94–99%), maintain MAP ≥ 65 mmHg, consider targeted temperature management (TTM) per institutional protocol, 12-lead ECG for STEMI evaluation, continuous ST monitoring.",
      },
    ],
    faq: [
      { question: "What does ventricular fibrillation look like on a monitor?", answer: "VF produces a chaotic, irregular waveform with no organized QRS complexes — just rapid, irregular oscillations of varying amplitude. Coarse VF has higher-amplitude waves; fine VF has low-amplitude waves that can resemble asystole. The key distinction: VF has some waveform activity; true asystole is flat. Always confirm in two leads before withholding defibrillation." },
      { question: "How do you tell VF from motion artifact on telemetry?", answer: "Assess the patient first — not the monitor. VF requires CPR immediately only if the patient is unresponsive and pulseless. Motion artifact, even when it resembles VF, occurs in a responsive, perfusing patient. Three rapid checks: (1) Is the patient responsive? (2) Is there a palpable carotid pulse? (3) Does the pulse oximetry plethysmograph show organized pulsatile flow? Any YES = artifact." },
    ],
  },
  {
    slug: "pac-vs-pvc-ecg",
    title: "PAC vs PVC — Premature Beats ECG Recognition for Nurses",
    description:
      "PAC vs PVC ECG differentiation for nurses: premature atrial contractions vs premature ventricular contractions — morphology, compensatory pause, clinical significance, and escalation criteria.",
    h1: "PAC vs PVC: distinguishing premature atrial from ventricular contractions on ECG",
    keywords: ["PAC vs PVC ECG nursing", "premature atrial contractions nursing", "premature ventricular contractions ECG", "PVC recognition nursing", "ectopic beats ECG nursing"],
    sections: [
      {
        id: "pac-recognition",
        heading: "PAC recognition: early narrow beat with different P-wave morphology",
        content:
          "A premature atrial contraction (PAC) originates from an ectopic atrial focus outside the SA node. ECG features: (1) Early (premature) beat — arrives before the next expected sinus beat. (2) Different P-wave morphology — the ectopic P wave differs in shape, axis, or amplitude from sinus P waves because it activates the atria from a different starting point. (3) Narrow QRS — ventricular conduction is normal via the His-Purkinje system, producing a narrow QRS identical to sinus beats (unless aberrant conduction occurs). (4) Non-compensatory pause — the SA node is reset by the PAC, so the interval from the PAC to the next sinus beat is not full-compensatory.\n\nClinical significance: isolated PACs are benign in otherwise healthy patients. In neonates and infants, frequent PACs may trigger SVT — monitor closely. Frequent PACs (>1% of beats) warrant clinical evaluation.",
      },
      {
        id: "pvc-recognition",
        heading: "PVC recognition: wide bizarre premature beat with compensatory pause",
        content:
          "A premature ventricular contraction (PVC) originates from an ectopic ventricular focus. ECG features: (1) Early (premature) beat. (2) Wide, bizarre QRS (≥120 ms) — depolarization bypasses the normal His-Purkinje network, producing slow cell-to-cell conduction. (3) Morphology opposite to the sinus QRS — discordant ST-T changes (T wave opposite in direction to QRS). (4) Compensatory pause — the SA node is NOT reset; the post-PVC R-R interval is fully compensatory (the PVC-to-next-sinus R-R = 2× normal R-R).\n\nPVC patterns: unifocal PVCs (all look identical — one ectopic focus); multifocal PVCs (different morphologies — multiple foci — more concerning); bigeminy (PVC every other beat); trigeminy (PVC every third beat); couplets (two consecutive PVCs — non-sustained VT); salvos (3+ consecutive PVCs = non-sustained VT — escalate immediately).",
      },
    ],
    faq: [
      { question: "How do you tell a PAC from a PVC on a rhythm strip?", answer: "The key discriminator is QRS width. PAC: early beat with narrow QRS (same as sinus beats) and a different P-wave morphology before it. PVC: early beat with wide, bizarre QRS (≥120 ms), no identifiable P wave before it, discordant T wave, and a compensatory pause after. When in doubt: narrow QRS = supraventricular origin; wide QRS = ventricular origin until proven otherwise." },
      { question: "When does a PVC require escalation?", answer: "Escalate for: PVCs in salvos (3+ consecutive = non-sustained VT), multifocal PVCs (multiple morphologies indicating multiple ectopic foci), R-on-T phenomenon (PVC falling on T wave — VF risk when QT is prolonged), PVCs in the setting of acute MI or ischemia, new PVCs in a hemodynamically compromised patient. Isolated uniform PVCs in a stable patient with normal hemodynamics typically require documentation and monitoring, not immediate intervention." },
    ],
  },
  {
    slug: "anterior-stemi-ecg",
    title: "Anterior STEMI ECG — LAD Territory Recognition for Nurses",
    description:
      "Anterior STEMI ECG recognition for nurses: ST elevation in V1–V4, LAD territory, high-risk features, De Winter T-waves, and immediate cath lab activation criteria.",
    h1: "Anterior STEMI ECG: V1–V4 ST elevation, LAD territory, and high-risk pattern recognition",
    keywords: ["anterior STEMI ECG nursing", "anterior MI ECG recognition", "V1 V2 V3 V4 ST elevation", "LAD occlusion ECG nursing", "anterior STEMI cath lab nursing"],
    sections: [
      {
        id: "anterior-stemi-recognition",
        heading: "Anterior STEMI ECG recognition: V1–V4 ST elevation",
        content:
          "Anterior STEMI presents with ST elevation in the precordial leads V1–V4, reflecting occlusion of the left anterior descending (LAD) artery or one of its major branches. The LAD supplies the anterior wall, most of the interventricular septum, and the anterolateral wall — making anterior STEMI the highest-mortality STEMI territory.\n\nST elevation criteria: ≥2mm in two contiguous precordial leads. V1–V4 = LAD territory (anterior wall). V1–V2 only = septal involvement. V3–V5 = mid-LAD. V4–V6 = anterior-lateral (diagonal branch involvement). Extensive anterior STEMI shows ST elevation from V1 through V6 — indicating proximal LAD occlusion.\n\nReciprocal changes: inferior reciprocal ST depression (in II, III, aVF) may be seen with large anterior STEMIs. New deep Q waves in V1–V4 may appear within 30–60 minutes — pathologic Q waves confirm irreversible myocardial injury.",
      },
      {
        id: "anterior-stemi-high-risk",
        heading: "High-risk anterior STEMI patterns: left main and proximal LAD equivalents",
        content:
          "ST elevation in aVR with diffuse ST depression: ST elevation in lead aVR ≥ 1mm with diffuse ST depression in multiple leads (I, II, V4–V6) is the 'left main equivalent' pattern — suggests left main or very proximal LAD occlusion with global subendocardial ischemia. This carries the highest mortality of all STEMI presentations. Immediate cath lab activation.\n\nDe Winter T-waves: J-point depression (not elevation) with tall, symmetric, upright T waves in V1–V6. This represents LAD occlusion without the classic ST elevation — it is a STEMI equivalent requiring immediate cath lab activation. Often missed on initial triage review because it lacks ST elevation.\n\nNew LBBB with chest pain: new left bundle branch block in the context of typical ischemic symptoms carries the same urgency as overt STEMI. Apply modified Sgarbossa criteria to identify superimposed ischemia. Concordant ST elevation (ST in same direction as QRS) of any magnitude in LBBB = acute occlusion.",
      },
    ],
    faq: [
      { question: "Which leads show ST elevation in anterior STEMI?", answer: "Anterior STEMI: ST elevation in V1–V4 (LAD territory). The specific leads involved help localize: V1–V2 = septal (LAD septal perforators), V3–V4 = anterior (mid-LAD), V4–V6 = anterolateral (LAD diagonal branches). Widespread V1–V6 ST elevation = proximal LAD or left main occlusion — highest risk, most urgent." },
      { question: "What are De Winter T-waves and why are they important?", answer: "De Winter T-waves are J-point depression with tall symmetric upright T waves in V1–V6 in a patient with ischemic chest pain. They represent LAD occlusion WITHOUT the classic ST elevation. They are a STEMI equivalent — cath lab activation is required. De Winter T-waves are one of the most commonly missed patterns on nursing and physician ECG review because they lack the expected ST elevation." },
    ],
  },
  {
    slug: "inferior-stemi-ecg",
    title: "Inferior STEMI ECG — RCA Territory & RV Involvement",
    description:
      "Inferior STEMI ECG recognition for nurses: leads II, III, aVF, RCA territory, right ventricular involvement, nitrate contraindication, and reciprocal changes in aVL.",
    h1: "Inferior STEMI ECG: II, III, aVF ST elevation, RV assessment, and nitrate safety",
    keywords: ["inferior STEMI ECG nursing", "inferior MI ECG leads", "inferior STEMI RV involvement", "nitrates inferior STEMI contraindication", "inferior STEMI nursing management"],
    sections: [
      {
        id: "inferior-stemi-recognition",
        heading: "Inferior STEMI ECG recognition: leads II, III, and aVF",
        content:
          "Inferior STEMI presents with ST elevation in leads II, III, and aVF — reflecting occlusion of the right coronary artery (RCA) in ~80% of patients, or the left circumflex artery (LCx) in the remaining 20%. The inferior wall of the left ventricle is the territory at risk.\n\nReciprocal ST depression: reciprocal depression in lead aVL (and often lead I) is the most reliable confirmatory sign of inferior STEMI. Reciprocal changes increase diagnostic specificity substantially and should be actively sought on every inferior STEMI evaluation. Lead aVL reciprocal depression occurring alongside inferior ST elevation warrants STEMI protocol activation even before troponin results.\n\nST elevation magnitude: lead III typically shows more ST elevation than lead II in inferior STEMI. If lead II > lead III, consider pericarditis, benign early repolarization, or non-ischemic causes in the differential.",
      },
      {
        id: "rv-involvement",
        heading: "Right ventricular involvement: V4R assessment and nitrate contraindication",
        content:
          "Right ventricular infarction complicates inferior STEMI in approximately 30–40% of cases. Assessment is MANDATORY in all inferior STEMIs before administering nitrates.\n\nRight-sided leads (V4R): apply right-sided lead V4R (mirror position of V4 on the right chest). ST elevation ≥ 1mm in V4R confirms right ventricular involvement. This single finding changes management.\n\nNitrate contraindication: NEVER give nitroglycerin to a patient with inferior STEMI and right ventricular involvement. RV infarction requires preload to maintain right ventricular output. Nitroglycerin drops venous return (preload), causing precipitous hypotension in the preload-dependent RV — potentially fatal. IV fluid challenge (NS 500mL) is the correct hemodynamic support for RV infarction. Atropine for bradycardia (inferior STEMI commonly involves the AV node).",
      },
    ],
    faq: [
      { question: "Which leads show inferior STEMI?", answer: "Inferior STEMI: ST elevation in leads II, III, and aVF. Reciprocal ST depression in aVL (and often lead I) confirms the diagnosis. Lead III typically shows more elevation than lead II. Always assess right-sided leads (especially V4R) before giving nitrates — right ventricular involvement requires different management (IV fluids, not vasodilators)." },
      { question: "Why are nitrates contraindicated in some inferior STEMIs?", answer: "Nitrates are contraindicated when inferior STEMI involves the right ventricle (RV). The RV MI makes the right heart preload-dependent for maintaining cardiac output. Nitroglycerin reduces venous return (preload), which in a normal heart is tolerated — but in RV infarction it causes abrupt hemodynamic collapse. Always apply right-sided leads (V4R) before giving nitrates to any inferior STEMI patient." },
    ],
  },
  {
    slug: "posterior-stemi-ecg",
    title: "Posterior STEMI ECG — The Most Missed Pattern for Nurses",
    description:
      "Posterior STEMI ECG recognition for nurses: ST depression in V1–V3, dominant R wave in V2, posterior leads V7–V9, and why posterior MI is the most commonly missed STEMI.",
    h1: "Posterior STEMI ECG: ST depression V1–V3, dominant R wave V2, and why it gets missed",
    keywords: ["posterior STEMI ECG nursing", "posterior MI recognition", "ST depression V1 V2 V3 STEMI", "posterior leads V7 V8 V9 nursing", "missed STEMI posterior nursing"],
    sections: [
      {
        id: "posterior-stemi-recognition",
        heading: "Posterior STEMI: why standard 12-lead ECG shows ST depression, not elevation",
        content:
          "Posterior STEMI is the most commonly missed STEMI pattern on both nursing and physician ECG review. The reason: the standard 12-lead ECG has no leads that directly face the posterior wall of the left ventricle. V1–V3 look at the posterior wall from the anterior direction — the opposite side.\n\nThe result: posterior STEMI produces ST DEPRESSION (not elevation) in V1–V3, representing the reciprocal view of posterior wall ST elevation. The pattern mimics NSTEMI or subendocardial ischemia — leading to missed cath lab activation.\n\nKey recognition features: (1) New ST depression in V1–V3, especially in a patient with typical chest pain presentation. (2) Tall, broad R wave in V1–V2 — the Q-wave equivalent for posterior infarction (the Q wave, seen as a positive deflection when viewed from the posterior direction, appears as a dominant R from the anterior V1–V2 view). (3) Upright T waves in V1–V2 (normally negative or biphasic).",
      },
      {
        id: "posterior-leads",
        heading: "Posterior leads V7–V9: confirming the missed STEMI",
        content:
          "Standard rule: any patient with ST depression in V1–V3 and clinical chest pain presentation should have posterior leads applied BEFORE STEMI is excluded.\n\nPosterior lead placement: V7 — left posterior axillary line, same horizontal level as V4–V6. V8 — left mid-scapular line. V9 — left paravertebral border, same level. Apply like standard precordial leads, same horizontal level, patient supine.\n\nDiagnostic criterion: ST elevation ≥0.5mm in V7–V9 = posterior STEMI. This is a lower threshold than anterior STEMI (2mm) because posterior leads have inherently lower voltage. Posterior STEMI is predominantly from circumflex artery (LCx) occlusion — often accompanied by inferior or lateral changes.",
      },
    ],
    faq: [
      { question: "Why does posterior STEMI show ST depression instead of elevation?", answer: "The standard 12-lead ECG has no leads facing the posterior wall. V1–V3 look from the front (anterior) at the back of the heart. Posterior wall ST elevation — when viewed from the opposite direction — appears as ST depression in V1–V3. This is the electrically mirrored, 'reciprocal' view. Posterior leads V7–V9, placed on the patient's back, directly face the posterior wall and reveal the true ST elevation." },
      { question: "What is the dominant R wave sign in posterior STEMI?", answer: "The dominant R wave in V1–V2 is the Q-wave equivalent for posterior infarction. The Q wave of infarction (negative deflection) appears from the posterior leads V7–V9 — but when viewed from V1–V2 (opposite direction), the Q wave becomes a tall positive R wave. A new tall broad R wave in V1–V2 with ST depression in the clinical context of chest pain should prompt immediate posterior lead placement." },
    ],
  },
  {
    slug: "lateral-stemi-ecg",
    title: "Lateral STEMI ECG — Circumflex Territory Recognition",
    description:
      "Lateral STEMI ECG recognition for nurses: leads I, aVL, V5, V6 ST elevation, circumflex territory, high lateral pattern, and reciprocal changes in inferior leads.",
    h1: "Lateral STEMI ECG: I, aVL, V5–V6 ST elevation and circumflex territory recognition",
    keywords: ["lateral STEMI ECG nursing", "lateral MI ECG", "high lateral STEMI aVL", "circumflex occlusion ECG", "lateral wall MI nursing"],
    sections: [
      {
        id: "lateral-stemi-recognition",
        heading: "Lateral STEMI: leads I, aVL, V5, V6 involvement",
        content:
          "Lateral STEMI involves the lateral wall of the left ventricle, typically supplied by the left circumflex artery (LCx) or the diagonal branches of the LAD. ST elevation appears in leads I, aVL (high lateral) and/or V5–V6 (low lateral).\n\nHigh lateral STEMI (I, aVL only): the most commonly missed lateral STEMI pattern. ST elevation isolated to leads I and aVL without involvement of other precordial or inferior leads is subtle and frequently overlooked on initial triage review. Reciprocal ST depression in leads III and aVF confirms the diagnosis.\n\nAnterolateral STEMI (V1–V6 + I, aVL): extensive lateral involvement — large circumflex or combined LAD-circumflex territory. Highest-risk lateral pattern.\n\nReciprocal changes: inferior ST depression (in II, III, aVF) typically accompanies lateral STEMI when aVL is elevated. The aVL-to-III relationship is important: any time you see ST depression in III and the patient has chest pain, assess lead aVL for reciprocal confirmation of high lateral STEMI.",
      },
    ],
    faq: [
      { question: "Which leads identify lateral STEMI?", answer: "Lateral STEMI: ST elevation in leads I, aVL (high lateral wall), V5, V6 (low lateral wall). Reciprocal ST depression in leads II, III, aVF confirms lateral involvement. High lateral STEMI (only I and aVL elevated) is the most easily missed pattern — look for reciprocal inferior depression as a clue when aVL elevation is subtle." },
    ],
  },
  {
    slug: "stemi-equivalents-ecg",
    title: "STEMI Equivalents ECG — De Winter T-waves, Wellens, Posterior MI",
    description:
      "STEMI equivalents for nurses: De Winter T-waves, Wellens syndrome, posterior STEMI, LBBB with Sgarbossa criteria — patterns requiring emergent cath lab activation without classic ST elevation.",
    h1: "STEMI equivalents: De Winter T-waves, Wellens syndrome, and other missed occlusion patterns",
    keywords: ["STEMI equivalents nursing", "De Winter T-waves nursing", "Wellens syndrome ECG", "STEMI without ST elevation nursing", "occlusion MI nursing"],
    sections: [
      {
        id: "stemi-equivalents",
        heading: "Why STEMI equivalents matter: same urgency, different appearance",
        content:
          "Traditional STEMI criteria require ST elevation ≥1mm in two contiguous limb leads or ≥2mm in precordial leads. But acute coronary occlusion — which requires emergent reperfusion — can present without meeting these criteria. STEMI equivalents are patterns indicating total or near-total coronary occlusion without classic ST elevation.\n\nDe Winter T-waves: J-point depression (1–3mm) with tall, symmetric, upright T waves in V1–V6. Caused by proximal LAD occlusion. No ST elevation is present — commonly misdiagnosed as early repolarization or hyperkalemia. These patients need cath lab activation now, not troponin-guided workup.\n\nWellens syndrome (reperfusion T-wave pattern): biphasic T waves (Type A) or deep symmetric T-wave inversions (Type B) in V2–V3 in a pain-free patient. Represents reperfused proximal LAD stenosis — the plaque has momentarily reperfused but remains critically narrow. These patients are at extremely high risk for sudden re-occlusion. Stress testing is contraindicated — they need urgent cardiology consultation and likely PCI.",
      },
    ],
    faq: [
      { question: "What are De Winter T-waves and when should you activate the cath lab?", answer: "De Winter T-waves: J-point depression + tall symmetric upright T waves in V1–V6 in a patient with chest pain. They represent proximal LAD occlusion without classic ST elevation. Cath lab activation is indicated immediately — same urgency as overt STEMI. De Winter T-waves are one of the most commonly missed high-risk ECG patterns in emergency triage." },
      { question: "What does Wellens syndrome look like on ECG?", answer: "Wellens syndrome: biphasic T waves (Type A) or deep symmetric T-wave inversions (Type B) in V2–V3, occurring in a patient who is pain-FREE but recently had ischemic symptoms. This 'reperfusion pattern' indicates a critically narrow proximal LAD that temporarily reperfused. Stress testing is absolutely contraindicated — exercise can trigger re-occlusion. Urgent cardiology referral is required." },
    ],
  },
  {
    slug: "pr-interval-ecg",
    title: "PR Interval ECG — Normal Values, Prolongation & Clinical Significance",
    description:
      "PR interval explained for nurses: normal 120–200 ms, measurement method, prolonged PR in AV block, short PR in WPW, clinical significance, and nursing monitoring priorities.",
    h1: "PR interval ECG: measurement, normal values, prolonged PR, and AV block significance",
    keywords: ["PR interval ECG nursing", "PR interval normal value", "PR interval prolonged AV block", "short PR WPW ECG", "PR interval measurement nursing"],
    sections: [
      {
        id: "pr-interval-basics",
        heading: "PR interval: what it measures and how to calculate it",
        content:
          "The PR interval measures the time from the beginning of atrial depolarization (start of P wave) to the beginning of ventricular depolarization (start of QRS complex). It represents conduction time through the atria, AV node, Bundle of His, and proximal bundle branches — the entire supraventricular conduction pathway.\n\nNormal PR interval: 120–200 ms (3–5 small boxes on standard ECG paper at 25 mm/s). Measure from the beginning of the P wave to the first deflection of the QRS complex (whether Q or R wave). Use the same lead consistently for serial comparisons — lead II is standard.\n\nPR interval should be measured in the lead where P wave onset is clearest and QRS begins earliest. At faster heart rates, the PR interval normally shortens slightly; at slower rates, it may lengthen mildly. This rate-dependence is normal and distinct from pathologic PR prolongation.",
      },
      {
        id: "pr-interval-abnormalities",
        heading: "Abnormal PR intervals: prolonged (AV block) and short (pre-excitation)",
        content:
          "Prolonged PR (> 200 ms): first-degree AV block. All beats conduct but with delayed AV nodal conduction. Common causes: inferior MI, vagal tone, medications (digoxin, beta-blockers, CCBs), Lyme disease, aging. Usually benign but warrants monitoring for progression.\n\nProgressively lengthening PR: Wenckebach (Mobitz I second-degree AV block). PR lengthens until a QRS is dropped, then resets. Occurs at the AV node level — usually benign, commonly seen with inferior MI, high vagal tone.\n\nConstant PR before sudden dropped QRS: Mobitz II second-degree AV block. Infranodal block — dangerous, may progress to complete heart block without warning. Requires urgent pacemaker evaluation.\n\nShort PR (< 120 ms): pre-excitation (WPW syndrome). The accessory pathway conducts before the AV node, producing early ventricular activation — short PR plus delta wave. Short PR without delta wave may represent accelerated AV node conduction (LGL syndrome).",
      },
    ],
    faq: [
      { question: "What is the normal PR interval in adults?", answer: "Normal PR interval: 120–200 ms (3–5 small boxes at 25 mm/s paper speed). Measured from the beginning of the P wave to the beginning of the QRS complex. PR > 200 ms = first-degree AV block (all beats conduct but with delay). PR < 120 ms = pre-excitation (WPW) or accelerated AV conduction." },
      { question: "What does a prolonged PR interval indicate?", answer: "Prolonged PR (> 200 ms) = first-degree AV block — the electrical impulse is delayed in the AV node but still conducts to the ventricle. All P waves are followed by QRS complexes. Common causes: inferior MI, increased vagal tone, digoxin toxicity, beta-blockers, calcium channel blockers, Lyme carditis. Usually benign but monitor for progression to higher-degree block." },
    ],
  },
  {
    slug: "qrs-complex-ecg",
    title: "QRS Complex ECG — Width, Morphology & Clinical Interpretation",
    description:
      "QRS complex explained for nurses: normal width < 120 ms, wide QRS significance, bundle branch block, ventricular tachycardia differential, and Brugada algorithm for wide-complex tachycardia.",
    h1: "QRS complex ECG: normal width, wide QRS significance, and the VT vs SVT differential",
    keywords: ["QRS complex ECG nursing", "wide QRS ECG nursing", "QRS width interpretation", "bundle branch block QRS", "VT vs SVT wide complex nursing"],
    sections: [
      {
        id: "qrs-basics",
        heading: "QRS complex: what it represents and normal duration",
        content:
          "The QRS complex represents ventricular depolarization — the electrical activation of both ventricles from the His-Purkinje network outward through the ventricular myocardium. Normal QRS duration: < 120 ms (< 3 small boxes). A narrow QRS indicates normal conduction through the His-Purkinje system. A wide QRS indicates either abnormal conduction pathways (bundle branch block, pre-excitation) or ventricular origin (ectopic focus in the myocardium, ventricular tachycardia).\n\nQRS components: Q wave (initial negative deflection, representing septal depolarization left-to-right), R wave (dominant positive deflection), S wave (terminal negative deflection after R). Not all leads show all three components. In lead V1, a normal pattern is rS (small r, deep S). In lead V6, the pattern is qRS or Rs.\n\nR-wave progression: R waves should increase in amplitude from V1 to V5 (called 'normal R-wave progression'). Poor R-wave progression — small R waves persisting to V4 — suggests prior anterior MI, LBBB, left ventricular hypertrophy, or COPD.",
      },
      {
        id: "wide-qrs",
        heading: "Wide QRS: bundle branch block, VT, and the most important clinical rule",
        content:
          "Wide QRS (≥ 120 ms) differential: RBBB (right bundle branch block): rSR' in V1 ('rabbit ear'), wide S wave in V5–V6. LBBB (left bundle branch block): broad notched R in V5–V6, QS in V1, no septal Q in V5–V6. VT (ventricular tachycardia): wide QRS tachycardia with AV dissociation, capture beats, or fusion beats.\n\nThe most critical clinical rule: wide-complex tachycardia = VT until proven otherwise. Never assume SVT with aberrancy as the first diagnosis. The consequence of treating VT as SVT (with verapamil) can be fatal. Apply the Brugada 4-step algorithm: (1) Absence of RS complex in any precordial lead → VT. (2) RS interval > 100 ms → VT. (3) AV dissociation → VT. (4) RBBB morphology criteria (monophasic R in V1, rS in V6) → VT.",
      },
    ],
    faq: [
      { question: "What does a wide QRS complex mean on ECG?", answer: "Wide QRS (≥ 120 ms) indicates either: bundle branch block (RBBB or LBBB — conduction delay within the ventricles), ventricular tachycardia (ectopic ventricular pacemaker — most dangerous interpretation), pre-excitation/WPW (accessory pathway conduction), or rate-related aberrancy (RBBB morphology at faster rates, resolving at slower rates). In tachycardia: wide QRS = VT until proven otherwise by the Brugada algorithm." },
      { question: "How do you use the Brugada algorithm for wide-complex tachycardia?", answer: "Brugada 4-step: (1) Is there an RS complex in any precordial lead? NO → VT (specificity 100%). (2) Is any RS interval > 100 ms? YES → VT. (3) Is there AV dissociation (P waves independent of QRS)? YES → VT. (4) Do V1 and V6 meet VT morphology criteria? YES → VT. Each YES step = VT diagnosis. Proceed to step 2 only if step 1 is NO. The default interpretation when uncertain is VT." },
    ],
  },
  {
    slug: "hypokalemia-ecg-changes",
    title: "Hypokalemia ECG Changes — U Waves, T-Wave Flattening, Arrhythmia Risk",
    description:
      "Hypokalemia ECG changes for nurses: T-wave flattening, prominent U waves, QT/QU prolongation, torsades de pointes risk, and treatment priorities with electrolyte correction.",
    h1: "Hypokalemia ECG changes: U waves, T-wave flattening, and torsades de pointes risk",
    keywords: ["hypokalemia ECG changes nursing", "U waves hypokalemia ECG", "hypokalemia arrhythmia risk nursing", "low potassium ECG nursing", "hypokalemia QT prolongation"],
    sections: [
      {
        id: "hypokalemia-ecg",
        heading: "Hypokalemia ECG progression: from flattened T waves to torsades risk",
        content:
          "Hypokalemia produces characteristic ECG changes that correlate with increasing potassium deficiency. The progression: (1) T-wave flattening: the earliest finding. T waves flatten or invert as repolarization is affected. (2) Prominent U waves: a U wave is a positive deflection after the T wave, best seen in leads V2–V4. Normally small or absent, hypokalemia produces prominent U waves that may exceed the T-wave amplitude. (3) T-U fusion: the T wave and U wave merge, creating an apparent single broad 'T wave' — this is actually a QU interval, not QT. Measuring this as the QT interval falsely identifies QT prolongation. (4) ST depression: mild baseline ST depression may accompany hypokalemia. (5) QU prolongation and torsades de pointes: true torsades de pointes risk exists even when the measured 'QTc' reflects QU fusion rather than true QT.",
      },
      {
        id: "hypokalemia-clinical",
        heading: "Hypokalemia clinical significance: arrhythmia risk and replacement priorities",
        content:
          "Hypokalemia potentiates arrhythmias from two mechanisms: (1) increased automaticity (ectopic beats, atrial and ventricular arrhythmias), and (2) prolonged repolarization (QU prolongation increases torsades risk). The combination of hypokalemia + QT-prolonging medications (sotalol, amiodarone, azithromycin, haloperidol) is particularly dangerous.\n\nNursing priorities: Monitor potassium in all patients on diuretics (especially loop diuretics and thiazides), with diarrhea/vomiting, or receiving QT-prolonging medications. Target serum K+ ≥ 4.0 mEq/L in patients with arrhythmia risk or QT-prolonging medications. IV potassium replacement: maximum 10–20 mEq/hr via peripheral IV (concentrations > 20 mEq/100 mL require central access and continuous cardiac monitoring).\n\nHypokalemia + hypomagnesemia: magnesium is required for intracellular potassium retention. Replacing potassium without correcting magnesium fails — the K+ is lost again immediately. Always check and replace magnesium concurrently in hypokalemic patients.",
      },
    ],
    faq: [
      { question: "What is a U wave and why does it appear with hypokalemia?", answer: "A U wave is a positive deflection following the T wave, best seen in leads V2–V4. It represents repolarization of the interventricular septum or Purkinje fibers. In normokalemia, U waves are small. Hypokalemia prolongs repolarization, making U waves prominent and sometimes taller than the T wave. Prominent U waves (especially if > T wave amplitude) should prompt potassium level measurement." },
      { question: "Why must magnesium be replaced alongside potassium in hypokalemia?", answer: "Magnesium is required for the Na-K-ATPase pump to maintain intracellular potassium. Low magnesium impairs this pump, causing renal potassium wasting regardless of the amount given IV. If magnesium is not corrected, IV potassium replacement is partially ineffective — potassium is lost in the urine faster than it's being replaced. Always measure serum magnesium and replace to ≥ 2.0 mg/dL when treating hypokalemia in patients with arrhythmia risk." },
    ],
  },
  {
    slug: "ecg-artifacts-explained",
    title: "ECG Artifacts Explained — Motion, Baseline Wander, Electrical Interference",
    description:
      "ECG artifacts for nurses: motion artifact vs true arrhythmia, baseline wander, 60-Hz electrical interference, lead-off artifact, and how to distinguish artifacts from lethal rhythms.",
    h1: "ECG artifacts: motion, baseline wander, interference, and distinguishing artifact from true arrhythmia",
    keywords: ["ECG artifacts nursing", "motion artifact ECG", "ECG artifact vs arrhythmia", "telemetry artifact nursing", "baseline wander ECG nursing"],
    sections: [
      {
        id: "artifact-types",
        heading: "Types of ECG artifacts and their causes",
        content:
          "ECG artifacts are non-cardiac signals recorded by the monitoring system. Major types:\n\nMotion artifact: caused by patient movement, shivering, seizure activity, or CPR. Can resemble VF, VT, or asystole. Key feature: underlying QRS complexes may be visible within the artifact waveform if looked for carefully. The clinical gold standard: a patient who is responsive and has a palpable pulse cannot be in VF regardless of what the monitor shows.\n\nBaseline wander: low-frequency (< 1 Hz) oscillation of the entire waveform, causing the baseline to drift up and down rhythmically. Caused by patient breathing, lead movement, or loose lead attachment. Makes ST-segment interpretation difficult — the apparent ST elevation or depression may be baseline drift, not true ischemia.\n\n60-Hz interference: regular high-frequency noise (60 cycles/second in North America) that creates a 'hairy' appearance on the waveform. Caused by electrical equipment proximity, poor skin contact, or broken lead wires. Eliminate by improving skin preparation or removing nearby electrical devices.",
      },
      {
        id: "artifact-clinical",
        heading: "The cardinal rule: assess the patient, not the monitor",
        content:
          "The most dangerous clinical error in telemetry nursing is acting on monitor data without clinical correlation. Motion artifact can perfectly mimic VF, VT, asystole, or complete heart block. Electrical interference can simulate tachyarrhythmias.\n\nClinical assessment protocol for any alarming rhythm: (1) Look at the patient — are they awake? Talking? (2) Check for pulse — brachial (infants), carotid (adults). (3) Check SpO₂ — active pulse oximetry waveform confirms cardiac output. (4) Check blood pressure — NIBP or arterial line. (5) Look at the monitor AFTER confirming clinical status.\n\nArtifact identification clues: (a) Normal QRS complexes visible within the 'arrhythmia' at the expected rate — suggests the underlying rhythm is intact and the abnormal waveform is superimposed artifact. (b) Sudden onset and sudden resolution corresponding to patient movement. (c) The 'arrhythmia' corresponds to when the patient moved, coughed, shivered, or was touched.",
      },
    ],
    faq: [
      { question: "How do you tell motion artifact from true ventricular fibrillation?", answer: "Assess the patient, not the monitor. VF requires the patient to be unresponsive and pulseless. If the patient is responsive and you can feel a pulse, the monitor shows artifact — not VF. Three rapid checks: (1) Is the patient awake and responsive? (2) Is there a palpable pulse? (3) Is the SpO₂ waveform showing organized pulsatile flow? Any YES = artifact. Never defibrillate based on monitor findings alone." },
      { question: "What causes baseline wander on ECG and how do you fix it?", answer: "Baseline wander causes: patient breathing (normal if < 1 Hz drift), loose lead attachment, poor skin preparation (oils, lotions, hair), lead movement during patient repositioning. Fix: clean skin with alcohol prep pad before applying electrodes, clip or shave hair under electrode sites, ensure electrode tabs are firmly secured, check lead connections. Baseline wander makes ST-segment analysis unreliable — ensure clean baseline before interpreting ST changes." },
    ],
  },
  {
    slug: "ecg-axis-interpretation",
    title: "ECG Axis Interpretation — Normal Axis, LAD, RAD for Nurses",
    description:
      "ECG axis interpretation for nurses: normal axis 0°–+90°, left axis deviation causes, right axis deviation causes, extreme axis, and the quick I-aVF method for axis determination.",
    h1: "ECG axis interpretation: determining normal axis, left axis deviation, and right axis deviation",
    keywords: ["ECG axis interpretation nursing", "left axis deviation ECG nursing", "right axis deviation ECG", "normal ECG axis", "ECG axis quick method nursing"],
    sections: [
      {
        id: "axis-basics",
        heading: "ECG axis: the quick I and aVF method",
        content:
          "The electrical axis of the heart refers to the net direction of ventricular depolarization in the frontal plane. Normal axis is +0° to +90° (sometimes defined as -30° to +90°).\n\nQuick determination using leads I and aVF: (1) Lead I positive + aVF positive = normal axis (+0° to +90°). (2) Lead I positive + aVF negative = left axis deviation (LAD, more negative than -30°). (3) Lead I negative + aVF positive = right axis deviation (RAD, > +90°). (4) Lead I negative + aVF negative = extreme axis (northwest axis, -90° to ±180°).\n\nMore precise determination: if both I and aVF are positive, the axis is normal. For borderline cases between normal and LAD, check lead II — if lead II is also positive, axis is normal. If lead II is negative, axis is LAD (> -30°).",
      },
      {
        id: "axis-causes",
        heading: "Clinical causes of axis deviation",
        content:
          "Left axis deviation (LAD, more negative than -30°): most common causes — left anterior fascicular block (LAFB), inferior MI (loss of inferior electrical forces pulls axis leftward), LBBB, ventricular pacing, WPW (type B pattern). LAFB: LAD in a narrow-QRS rhythm without other cause = LAFB until proven otherwise.\n\nRight axis deviation (RAD, > +90°): most common causes — right ventricular hypertrophy (RVH — cor pulmonale, pulmonary hypertension, congenital heart disease), left posterior fascicular block (LPFB), lateral MI, RBBB, normal variant in young slender adults (vertical heart position). New RAD in a patient with dyspnea warrants echocardiography to assess RV pressure.\n\nExtreme axis (northwest, -90° to ±180°): consider lead reversal FIRST before diagnosing pathologic extreme axis. Lead reversal — particularly right arm/left arm swap — produces pseudo-extreme axis. Check lead aVR: it should normally be negative. If aVR is positive, suspect lead reversal.",
      },
    ],
    faq: [
      { question: "What is left axis deviation on ECG and what causes it?", answer: "Left axis deviation (LAD): the heart's electrical axis points more leftward than -30°. Quick ECG identification: lead I is positive AND lead aVF is negative. Most common causes: left anterior fascicular block (LAFB — narrow QRS with LAD, no other cause), inferior MI (loss of inferior electrical forces), LBBB, ventricular pacing. LAD alone is not an indication for intervention but warrants clinical context evaluation." },
      { question: "What is the first thing to check when you see extreme axis?", answer: "Check for lead reversal before diagnosing extreme axis. The most common cause of extreme northwest axis (lead I negative, aVF negative) is right arm/left arm lead reversal. Check lead aVR: it should normally be predominantly negative. If aVR is positive (looks like the 'expected' lead I pattern), suspect RA-LA lead reversal. Correct the leads and repeat the ECG before attributing axis deviation to cardiac pathology." },
    ],
  },
  {
    slug: "lead-placement-ecg",
    title: "ECG Lead Placement — 12-Lead & Telemetry Electrode Positioning",
    description:
      "ECG lead placement for nurses: 12-lead electrode placement, telemetry lead positioning, common errors and their ECG effects, right-sided leads, and posterior lead placement.",
    h1: "ECG lead placement: 12-lead electrode positioning, telemetry leads, and common placement errors",
    keywords: ["ECG lead placement nursing", "12-lead ECG electrode placement", "ECG electrode placement guide", "telemetry lead placement nursing", "ECG lead positioning errors"],
    sections: [
      {
        id: "twelve-lead-placement",
        heading: "12-lead ECG electrode placement: limb leads and precordial leads",
        content:
          "Limb lead electrode placement: (1) RA — right arm or right wrist. (2) LA — left arm or left wrist. (3) RL (ground) — right leg or right ankle. (4) LL — left leg or left ankle. Place electrodes on the limb itself (wrist, inner forearm, or ankle) rather than the torso — torso placement changes the electrical axis and affects lead morphology.\n\nPrecordial (chest) lead placement (critical for diagnostic accuracy): V1 — 4th intercostal space (ICS), right sternal border. V2 — 4th ICS, left sternal border. V3 — between V2 and V4 (diagonal placement). V4 — 5th ICS, midclavicular line. V5 — anterior axillary line, same horizontal level as V4. V6 — midaxillary line, same horizontal level as V4–V5.\n\nFinding the 4th ICS: palpate the sternal angle (Angle of Louis — the bony horizontal ridge on the sternum where the manubrium meets the body). The rib attached here is the 2nd rib. Count down to the 2nd ICS (space below 2nd rib), 3rd rib, 3rd ICS, 4th rib, 4th ICS. V1 and V2 are placed at the 4th ICS.",
      },
      {
        id: "placement-errors",
        heading: "Common placement errors and their ECG effects",
        content:
          "V1–V2 too high (3rd ICS instead of 4th): produces falsely elevated P waves in V1–V2, poor R-wave progression, may create false RBBB morphology, and changes ST-segment appearance — misdiagnosis risk.\n\nV4 too lateral (placing V4 at axillary line instead of midclavicular): makes V5 and V6 appear on the posterolateral wall, losing anterior transition and creating false poor R-wave progression.\n\nLimb leads on torso: produces significant axis changes and altered waveform morphology. Particularly problematic in patients with amputations or casts — document the electrode placement location if non-standard.\n\nRA/LA reversal: produces inverted P waves and QRS in lead I, negative aVR (normally negative in I, aVR positive after reversal), mirror-image changes. Lead II and III swap appearances.\n\nRight-sided leads (V3R, V4R) for RV assessment: mirror-position of standard leads on the right chest. V4R is the most clinically valuable — 4th ICS, right midclavicular line (mirror of V4).",
      },
    ],
    faq: [
      { question: "Where does V1 go on a 12-lead ECG?", answer: "V1: 4th intercostal space, RIGHT sternal border. Find the sternal angle (Angle of Louis — bony ridge where manubrium meets sternal body), which marks the 2nd rib. Count down: 2nd ICS, 3rd rib, 3rd ICS, 4th rib, 4th ICS. Place V1 just to the right of the sternum at the 4th ICS. V2 mirrors V1 on the left side. Placing V1–V2 too high (3rd ICS) is one of the most common errors — it creates false RBBB morphology and poor R-wave progression." },
      { question: "How do you place right-sided leads for RV infarction assessment?", answer: "Right-sided leads (V3R–V6R) are the mirror of standard precordial leads on the right chest. V4R — the most clinically important — is placed at the 5th ICS, RIGHT midclavicular line (mirror position of standard V4). Apply all precordial leads normally, then move V3–V6 to their right-chest mirror positions. V4R with ST elevation ≥ 1mm confirms right ventricular involvement in inferior STEMI — this finding mandates IV fluids (not nitrates) as the hemodynamic management approach." },
    ],
  },
  {
    slug: "bedside-telemetry-interpretation",
    title: "Bedside Telemetry Interpretation — Rhythm Surveillance for Nurses",
    description:
      "Bedside telemetry interpretation for nurses: systematic rhythm surveillance, when to call the provider, interpreting alarm notifications, and bedside rhythm documentation standards.",
    h1: "Bedside telemetry interpretation: rhythm surveillance, alarm response, and clinical decision-making",
    keywords: ["bedside telemetry interpretation nursing", "cardiac monitoring bedside nursing", "telemetry rhythm surveillance", "cardiac alarm response nursing", "telemetry nursing skills"],
    sections: [
      {
        id: "bedside-surveillance",
        heading: "Systematic bedside telemetry rhythm surveillance",
        content:
          "Effective bedside telemetry interpretation is a systematic, continuous skill — not a reactive alarm-response skill. Proactive pattern monitoring catches evolving problems before alarms trigger.\n\nRoutine assessment integration: at each patient assessment (minimum every 2–4 hours for monitored patients), print a rhythm strip and systematically interpret it using the 7-step method: rate, rhythm, P waves, PR interval, QRS width, ST/T changes, interpretation. Document the rhythm and any changes from the previous baseline. New findings — even subtle — require provider notification and documentation.\n\nRate trending: note whether the rate is stable, gradually rising, or suddenly changing. Gradual rate rise may precede clinical deterioration (infection, hypovolemia, pain). Sudden rate change at a new fixed rate (not responsive to state change) suggests SVT or other tachyarrhythmia.\n\nBaseline comparison: always compare today's rhythm to the admission/baseline rhythm strip. New findings — even 'benign' ones like new PACs or new first-degree block — may represent evolving pathology.",
      },
    ],
    faq: [
      { question: "What should a nurse do when a telemetry alarm fires?", answer: "Three-step response: (1) Look at the monitor — is the waveform consistent with an arrhythmia or artifact? (2) Assess the patient — go to the bedside. Is the patient responsive? Comfortable? Is there a pulse? (3) Act based on clinical findings — not monitor alone. A patient who is responsive, talking, and has a palpable pulse is not in VF regardless of the monitor. Document your assessment and notify the provider with clinical context, not just 'monitor showed an alarm.'" },
    ],
  },
  {
    slug: "icu-telemetry-monitoring",
    title: "ICU Telemetry Monitoring — Critical Care Rhythm Surveillance",
    description:
      "ICU telemetry monitoring for nurses: continuous ST monitoring, arrhythmia surveillance in critical care, artifact identification, post-arrest ECG priorities, and advanced monitoring parameters.",
    h1: "ICU telemetry monitoring: continuous ST surveillance, post-arrest ECG, and critical care rhythm management",
    keywords: ["ICU telemetry monitoring nursing", "critical care cardiac monitoring", "continuous ST monitoring ICU", "post-arrest ECG monitoring", "ICU arrhythmia surveillance"],
    sections: [
      {
        id: "icu-continuous-monitoring",
        heading: "ICU telemetry: beyond basic rhythm — continuous ST and parameter trending",
        content:
          "ICU cardiac monitoring extends beyond rhythm identification. Key capabilities in ICU monitoring:\n\nContinuous ST monitoring: most modern ICU monitors provide real-time ST-segment trending in multiple leads simultaneously. This detects silent ischemia in sedated, intubated, or post-operative patients who cannot report chest symptoms. Set ST alert thresholds (typically ±1–2mm from baseline) and review trends at minimum every 4 hours. New ST changes require immediate 12-lead ECG and provider notification.\n\nMulti-parameter trending: ICU monitors integrate heart rate, rhythm, SpO₂, NIBP or arterial line BP, ETCO₂, and in some configurations pulmonary artery pressures. Correlate rhythm changes with hemodynamic parameters — a new tachyarrhythmia accompanied by BP drop has different urgency than the same rhythm with stable hemodynamics.\n\nPost-cardiac arrest monitoring: patients achieving ROSC require continuous monitoring for recurrent arrhythmia, ST changes (identify STEMI requiring emergent PCI), QTc trending (targeted temperature management prolongs QTc — antiarrhythmics may need dose adjustment), and rhythm during rewarming (risk of arrhythmias at temperature transitions).",
      },
    ],
    faq: [
      { question: "What is continuous ST monitoring in the ICU?", answer: "Continuous ST monitoring tracks the ST segment position in real time from multiple leads simultaneously. Modern ICU monitors display ST trend graphs showing whether ST is stable, rising, or falling over hours. In sedated or intubated patients who cannot report chest pain, ST monitoring may be the only indicator of acute ischemia. Alerts should be set at ±1–2mm from baseline, and all significant changes prompt an immediate 12-lead ECG and provider notification." },
    ],
  },
  {
    slug: "cardiac-monitoring-basics",
    title: "Cardiac Monitoring Basics — How Telemetry Works for Nurses",
    description:
      "Cardiac monitoring basics for nurses: how telemetry systems work, lead selection, monitor setup, alarm parameters, documentation standards, and cardiac monitoring indications.",
    h1: "Cardiac monitoring basics: how telemetry works, lead selection, and monitoring setup for nurses",
    keywords: ["cardiac monitoring basics nursing", "how telemetry works nursing", "cardiac monitor setup nursing", "telemetry lead selection nursing", "cardiac monitoring indications nursing"],
    sections: [
      {
        id: "monitoring-basics",
        heading: "How telemetry monitoring works: from patient to display",
        content:
          "Cardiac monitoring records the electrical signals generated by cardiac depolarization and repolarization through skin electrodes. In bedside monitoring: electrodes → electrode cables → bedside unit → central station. In wireless telemetry: electrodes → telemetry transmitter (worn by patient) → wireless network → central monitoring station.\n\nLead selection for telemetry: Lead II — best for P-wave and QRS morphology; the standard rhythm strip lead used in most monitoring environments. Lead V1 — best for distinguishing RBBB from LBBB morphology, identifying bundle branch blocks, and detecting right-sided events. Dual-lead monitoring (II + V1) is standard in high-acuity settings — II for rhythm identification, V1 for morphology details.\n\nMCL1 (Modified Chest Lead 1): when only 3 electrodes are available, MCL1 approximates V1. Place positive electrode at V1 position (4th ICS, right sternal border), negative electrode at left shoulder, ground at right shoulder. This approximates the V1 view using limb lead electrodes.",
      },
    ],
    faq: [
      { question: "Which lead is best for cardiac monitoring in telemetry?", answer: "Lead II is the standard for most telemetry monitoring because it aligns with the normal electrical axis, producing tall upright P waves and QRS complexes that are easiest to identify systematically. For detecting bundle branch block morphology or distinguishing wide-complex tachycardias, V1 provides additional information. High-acuity settings typically monitor both Lead II and V1 simultaneously for complete rhythm + morphology assessment." },
    ],
  },
];

export function getEcgClusterTopic(slug: string): EcgClusterTopic | undefined {
  return ECG_CLUSTER_TOPICS.find((t) => t.slug === slug);
}

export function getAllEcgClusterSlugs(): string[] {
  return ECG_CLUSTER_TOPICS.map((t) => t.slug);
}
