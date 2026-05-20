export interface TopicEntry {
  title: string;
  category: string;
  overview: string;
  mechanism: string;
  clinicalRelevance: string;
  signsSymptoms: string;
  assessment: string;
  management: string;
  complications: string;
  pearls: string[];
  pitfalls: string[];
  faq: { question: string; answer: string }[];
  keywords: string[];
  related: string[];
}

export function getExtraEntries(): TopicEntry[] {
  return [

    // ═══════════════════════════════════════════
    // CATEGORY: Airway Management (additional)
    // ═══════════════════════════════════════════

    {
      title: "Laryngeal Mask Airway",
      category: "Airway Management",
      overview: "The laryngeal mask airway (LMA) is a supraglottic airway device that sits over the laryngeal inlet, providing a seal around the glottic opening. It serves as a rescue airway when endotracheal intubation fails and as a primary airway in specific clinical scenarios.",
      mechanism: "The LMA consists of an airway tube connected to an elliptical mask with an inflatable cuff. When properly positioned, the mask sits over the laryngeal inlet with the tip in the esophageal opening, the sides in the piriform fossae, and the upper border against the base of the tongue. The inflated cuff creates a low-pressure seal allowing positive pressure ventilation.",
      clinicalRelevance: "The LMA is an essential component of the difficult airway algorithm and is recognized by AHA/ACLS guidelines as an acceptable alternative to endotracheal intubation. It requires less training and has a higher first-pass success rate than intubation, making it valuable in the prehospital environment.",
      signsSymptoms: "Indications for LMA placement include failed intubation, cardiac arrest when intubation is not available, patients requiring ventilatory support where intubation is not feasible, and as part of the difficult airway algorithm. Signs of proper placement include bilateral chest rise, presence of ETCO2, and absence of gastric insufflation.",
      assessment: "Select appropriate LMA size based on patient weight: Size 3 for 30-50 kg, Size 4 for 50-70 kg, Size 5 for >70 kg. Assess for contraindications: intact gag reflex, known esophageal pathology, morbid obesity (relative), caustic ingestion, and patients at high risk for aspiration. Confirm placement with capnography.",
      management: "Deflate cuff completely. Apply water-soluble lubricant to posterior surface. Open mouth, advance LMA along hard palate until resistance is felt. Inflate cuff with recommended volume. Confirm placement with capnography and bilateral breath sounds. Secure the device. Ventilate at 10-12 breaths/min with tidal volumes of 6-7 mL/kg.",
      complications: "Aspiration (LMA does not protect the airway from gastric contents), laryngospasm, inadequate seal (air leak), gastric insufflation, sore throat, nerve injury (lingual, hypoglossal, recurrent laryngeal), and device malposition causing airway obstruction.",
      pearls: [
        "LMA insertion success rate exceeds 95% on first attempt — significantly higher than ETT in inexperienced hands",
        "The LMA does NOT protect against aspiration — this is its primary limitation compared to ETT",
        "In cardiac arrest, the LMA provides equivalent outcomes to ETT with fewer interruptions to chest compressions",
        "If ventilation is inadequate with the LMA, reposition before removing — slight rotation or depth adjustment often resolves the issue"
      ],
      pitfalls: [
        "Using an LMA as a definitive airway in a patient with active vomiting — it does not protect against aspiration",
        "Over-inflating the cuff — this paradoxically worsens the seal and can cause tissue damage",
        "Not having a backup plan if the LMA fails — always have a surgical airway kit available",
        "Forcing the device past resistance — this can fold the tip and obstruct the airway"
      ],
      faq: [
        { question: "When should an LMA be used instead of an ETT?", answer: "An LMA should be used when intubation has failed or is not feasible, when the provider lacks intubation proficiency, in cardiac arrest when rapid airway placement is needed, and when direct/video laryngoscopy equipment is unavailable. Many EMS systems use LMA as the primary advanced airway in cardiac arrest due to equivalent outcomes with simpler placement." },
        { question: "Can you ventilate with positive pressure through an LMA?", answer: "Yes, but with limitations. The LMA provides a low-pressure seal that typically allows ventilation up to 20-25 cmH2O. Higher pressures may cause air leak and gastric insufflation. Keep tidal volumes at 6-7 mL/kg and ventilation rates at 10-12/min to minimize gastric inflation." }
      ],
      keywords: ["laryngeal mask airway paramedic", "LMA placement technique", "supraglottic airway device", "rescue airway EMS", "LMA insertion"],
      related: ["supraglottic-airway-devices", "failed-airway-algorithm", "orotracheal-intubation", "surgical-cricothyrotomy"]
    },

    {
      title: "Bougie-Assisted Intubation",
      category: "Airway Management",
      overview: "The bougie (gum elastic bougie or endotracheal tube introducer) is a semi-rigid, curved stylet used as an adjunct during difficult intubation. It is advanced through the glottic opening under direct visualization, and the endotracheal tube is then threaded over the bougie into the trachea using a Seldinger-like technique.",
      mechanism: "The bougie's curved tip (Coudé tip) allows it to be directed anteriorly under the epiglottis toward the trachea even when the glottic opening is not fully visualized. Tracheal placement is confirmed by tactile feedback: clicking as the tip passes over the tracheal cartilage rings (tracheal clicks) and hold-up at approximately 25-30 cm when the tip reaches the smaller bronchi.",
      clinicalRelevance: "The bougie significantly improves first-pass intubation success rates in difficult airways, increasing success from approximately 60% to over 90% in Cormack-Lehane Grade III views. It is considered an essential component of every intubation attempt in modern EMS practice.",
      signsSymptoms: "Indicated when Cormack-Lehane Grade II-III view is obtained during laryngoscopy (partial or no visualization of glottic opening), when the vocal cords are seen but tube passage is difficult, and as a routine adjunct for first-attempt intubation success. Signs of tracheal placement: tracheal clicks, hold-up at 25-30 cm.",
      assessment: "Assess the laryngoscopic view using Cormack-Lehane grading. Grade I: full view of cords. Grade II: partial view. Grade III: epiglottis only. Grade IV: no identifiable structures. The bougie is most valuable for Grade II-III views where the tube alone would be difficult to pass.",
      management: "During laryngoscopy, advance the bougie with the Coudé tip directed anteriorly under the epiglottis. Confirm tracheal placement by: feeling tracheal clicks (click-click-click as tip passes over cartilage rings), hold-up at 25-30 cm (tip in bronchus). Railroad the ETT over the bougie with a 90-degree counterclockwise rotation if the tube catches on the arytenoids. Remove the bougie while holding the ETT in place. Confirm ETT placement with capnography.",
      complications: "Tracheal or bronchial perforation (rare, associated with forceful advancement), mucosal trauma and bleeding, creation of false passage, esophageal placement if tracheal clicks are not confirmed, and ETT dislodgement during bougie removal.",
      pearls: [
        "Tracheal clicks are the most reliable sign of tracheal placement — feel for a rhythmic clicking sensation as the bougie advances",
        "If the bougie advances past 30 cm without hold-up, it is likely in the esophagus — remove and reattempt",
        "Rotate the ETT 90 degrees counterclockwise if it catches on the arytenoids during railroading — this directs the bevel posteriorly",
        "Consider using the bougie on every intubation attempt, not just difficult airways — it increases first-pass success"
      ],
      pitfalls: [
        "Forcing the bougie past resistance — this can perforate the airway and cause life-threatening bleeding",
        "Not confirming tracheal clicks before railroading the ETT — results in esophageal intubation",
        "Advancing the ETT too forcefully over the bougie — gentle technique with rotation prevents arytenoid hang-up",
        "Using a bougie that is too large for the ETT — ensure compatibility (standard adult bougie fits 6.0mm+ ETT)"
      ],
      faq: [
        { question: "What are tracheal clicks and why are they important?", answer: "Tracheal clicks are a tactile sensation felt as the bougie tip passes over the anterior tracheal cartilage rings. They feel like a subtle click-click-click with each ring. They are the most reliable confirmation of tracheal (not esophageal) placement of the bougie. If you do not feel clicks, the bougie may be in the esophagus." },
        { question: "Should the bougie be used routinely or only for difficult airways?", answer: "Current evidence supports routine bougie use for all intubation attempts. The BEAM trial showed that routine bougie use increased first-pass success from 86% to 98% in emergency department intubations. Many EMS protocols now recommend bougie use as standard practice." }
      ],
      keywords: ["bougie intubation paramedic", "gum elastic bougie technique", "difficult intubation adjunct", "bougie-assisted ETT", "tracheal clicks bougie"],
      related: ["orotracheal-intubation", "difficult-airway-management", "rapid-sequence-intubation", "failed-airway-algorithm"]
    },

    {
      title: "Video Laryngoscopy",
      category: "Airway Management",
      overview: "Video laryngoscopy (VL) uses a camera-equipped laryngoscope blade to display the glottic view on a monitor, allowing indirect visualization of the vocal cords without the need for a direct line of sight. It has become standard equipment in many EMS systems due to superior glottic visualization.",
      mechanism: "Video laryngoscopes use a micro-camera mounted near the blade tip to transmit a real-time image of the glottis to an attached screen. This eliminates the need to align the oral, pharyngeal, and laryngeal axes required for direct laryngoscopy. The blade shapes vary from standard Macintosh geometry (GlideScope) to highly angulated designs (McGrath, King Vision).",
      clinicalRelevance: "Video laryngoscopy consistently provides superior glottic views compared to direct laryngoscopy, especially in patients with difficult airway anatomy. It improves first-pass success rates, reduces esophageal intubation, and allows the entire team to see the airway, enhancing teaching and quality assurance.",
      signsSymptoms: "Indicated for all intubation attempts (many systems use VL as primary technique), particularly in predicted difficult airways: cervical immobilization, blood/secretions in the airway, obesity, facial trauma, limited mouth opening, and anterior airways. Superior view does not always equal superior tube delivery.",
      assessment: "Pre-intubation assessment is the same as for direct laryngoscopy (LEMON assessment). Ensure the device is powered, the camera is clean, and the screen is visible to the operator. Have a plan for device failure (direct laryngoscopy backup). Select the appropriate blade size for the patient.",
      management: "Insert the blade midline along the tongue (unlike direct laryngoscopy, no tongue sweep needed for most VL devices). Advance until the glottis is centered on the screen. Do not over-insert — keep the glottis in the center-lower portion of the screen. Advance the ETT with a pre-shaped stylet matching the blade curvature. Watch the tip pass through the cords on screen. Remove the stylet once through the cords, advance 2 cm further.",
      complications: "Perforation of the palatoglossal arch or posterior pharynx from blind stylet advancement (cannot see the tube tip when it enters the pharynx), difficulty with tube delivery despite a good view, device malfunction, battery failure, fogging of camera lens, and over-reliance on VL leading to loss of DL skills.",
      pearls: [
        "A good view does not always equal easy tube delivery — the most common VL difficulty is directing the tube through the cords despite excellent visualization",
        "Pre-shape the ETT stylet to match the blade curvature — this dramatically improves tube delivery success",
        "Watch the tube tip from the moment it enters the mouth — blind advancement through the pharynx can cause perforation",
        "Clean the camera lens with anti-fog solution before use — fogging is the most common equipment-related failure"
      ],
      pitfalls: [
        "Advancing the blade too deep — over-insertion obscures the view; pull back slowly until the cords come into view",
        "Not tracking the ETT tip visually through the pharynx — risk of posterior pharyngeal perforation",
        "Using a straight stylet with an angulated blade — the stylet must match the blade curvature for successful tube delivery",
        "Relying solely on VL and losing DL skills — device failure can occur, so maintain DL proficiency"
      ],
      faq: [
        { question: "Is video laryngoscopy better than direct laryngoscopy?", answer: "VL provides superior glottic visualization in nearly all studies. However, first-pass intubation success rates are similar in experienced hands for non-difficult airways. VL is clearly superior for difficult airways, patients with cervical spine immobilization, and less experienced operators. Many EMS systems now use VL as the primary technique for all intubations." },
        { question: "What is the most common problem with video laryngoscopy?", answer: "The most common problem is difficulty delivering the tube through the cords despite a good view (the 'can see, can't tube' phenomenon). This is usually caused by an improperly shaped stylet that doesn't match the blade curvature. Using a pre-shaped stylet with the correct angle for your device resolves this in most cases." }
      ],
      keywords: ["video laryngoscopy paramedic", "GlideScope technique", "VL intubation", "indirect laryngoscopy EMS", "video laryngoscope"],
      related: ["orotracheal-intubation", "difficult-airway-management", "bougie-assisted-intubation", "rapid-sequence-intubation"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Cardiac Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Transcutaneous Pacing",
      category: "Cardiac Emergencies",
      overview: "Transcutaneous pacing (TCP) is an emergency temporizing measure for symptomatic bradycardia or heart blocks unresponsive to atropine. Electrical impulses are delivered through the chest wall via large adhesive pads to stimulate cardiac depolarization and contraction.",
      mechanism: "External pacing pads deliver electrical current through the chest wall to depolarize the myocardium. The current must be sufficient to overcome the impedance of skin, subcutaneous tissue, and chest wall to reach the heart. Each electrical impulse stimulates a cardiac contraction. Rate and output (mA) are adjustable to achieve electrical and mechanical capture.",
      clinicalRelevance: "TCP is a critical paramedic skill for managing hemodynamically significant bradycardia that fails pharmacological treatment. It serves as a bridge to transvenous pacing at the hospital. ACLS guidelines identify TCP as the treatment of choice for symptomatic bradycardia when atropine is ineffective or inappropriate.",
      signsSymptoms: "Indications: symptomatic bradycardia (heart rate <60 with hypotension, altered mental status, chest pain, heart failure), high-degree AV blocks (Mobitz Type II, third-degree), bradycardia with ventricular escape rhythms. Symptoms include dizziness, syncope, hypotension, diaphoresis, chest pain, and heart failure.",
      assessment: "Obtain 12-lead ECG to identify the underlying rhythm. Assess hemodynamic status: blood pressure, level of consciousness, skin signs, capillary refill. Determine if the bradycardia is the cause of the symptoms. Check for contraindications: severe hypothermia (rewarm first), asystole (pacing generally ineffective).",
      management: "Apply pacing pads in anterior-posterior or anterior-lateral position. Set rate to 60-80 bpm. Start at minimum output (mA) and increase until electrical capture is achieved (pacing spike followed by a wide QRS complex). Then increase output by 10% above the capture threshold for a safety margin. Confirm mechanical capture by checking pulse and blood pressure. Sedate/analgesic if patient is conscious — pacing is very painful.",
      complications: "Pain (most common — TCP is extremely painful in conscious patients), failure to capture (inadequate output, pad placement, or severe myocardial disease), skin burns at pad sites, chest wall muscle contractions mimicking capture (electrical without mechanical capture), diaphragmatic pacing, and underlying rhythm deterioration.",
      pearls: [
        "Always confirm mechanical capture — electrical capture (spikes on the monitor) does not guarantee the heart is actually contracting",
        "TCP is extremely painful in conscious patients — sedate with benzodiazepines and/or analgesics before or immediately after initiating pacing",
        "Anterior-posterior pad placement generally provides lower capture thresholds than anterior-lateral placement",
        "If capture cannot be achieved, consider increasing output to maximum, repositioning pads, or treating underlying cause"
      ],
      pitfalls: [
        "Confusing electrical artifact with mechanical capture — always palpate a pulse to confirm the heart is actually responding to pacing",
        "Not sedating a conscious patient during pacing — the pain can cause extreme distress and worsen hemodynamics",
        "Attempting to pace asystole — TCP is generally ineffective in true asystole; focus on CPR and epinephrine",
        "Stopping pacing too soon after arrival at the ED — maintain pacing until transvenous pacer is placed"
      ],
      faq: [
        { question: "What is the difference between electrical and mechanical capture?", answer: "Electrical capture means the pacing stimulus is generating a visible QRS complex on the monitor — the myocardium is depolarizing. Mechanical capture means the depolarization is actually producing a ventricular contraction and generating a pulse. You must always verify mechanical capture by palpating a pulse or using a waveform on the monitor, as electrical capture without mechanical capture can occur in severe myocardial disease." },
        { question: "Why does TCP sometimes fail?", answer: "Common reasons for failure include: inadequate output (mA too low), poor pad contact or placement, severe myocardial ischemia or infarction, electrolyte abnormalities (especially hyperkalemia), pericardial effusion or tamponade, and severe hypothermia. Increasing output, repositioning pads, and treating underlying causes may improve capture." }
      ],
      keywords: ["transcutaneous pacing paramedic", "TCP technique", "external cardiac pacing", "symptomatic bradycardia treatment", "emergency pacing EMS"],
      related: ["heart-blocks", "cardiac-dysrhythmias", "atrial-fibrillation", "cardiac-arrest-management"]
    },

    {
      title: "Supraventricular Tachycardia",
      category: "Cardiac Emergencies",
      overview: "Supraventricular tachycardia (SVT) is a rapid heart rhythm originating above the ventricles, typically involving a re-entry circuit through the AV node. It presents with a regular, narrow-complex tachycardia at rates of 150-250 bpm and is one of the most common tachyarrhythmias encountered in prehospital care.",
      mechanism: "Most SVTs are caused by AV nodal re-entrant tachycardia (AVNRT) involving dual pathways within the AV node, or AV re-entrant tachycardia (AVRT) involving an accessory pathway (as in Wolff-Parkinson-White syndrome). The re-entry circuit creates a self-sustaining loop of electrical activity that bypasses normal conduction and produces rapid, regular ventricular rates.",
      clinicalRelevance: "SVT management is a high-yield exam topic for paramedics. Understanding vagal maneuvers, adenosine administration, and cardioversion is essential. The key clinical challenge is distinguishing stable from unstable SVT, as management differs significantly.",
      signsSymptoms: "Sudden onset palpitations, sensation of rapid heartbeat, lightheadedness, dyspnea, chest discomfort, anxiety, and diaphoresis. Patients often describe the abrupt onset as 'a switch being flipped.' Unstable signs include hypotension (SBP <90), altered consciousness, severe chest pain, and signs of heart failure.",
      assessment: "12-lead ECG showing narrow-complex (<0.12s), regular tachycardia at 150-250 bpm. P waves are usually not visible (buried in QRS or T waves). Assess hemodynamic stability: blood pressure, mental status, skin signs, and presence of pulmonary edema. Look for signs of WPW (delta waves in baseline ECG if available).",
      management: "Stable SVT: Attempt vagal maneuvers first (modified Valsalva with leg elevation is most effective, success rate ~40%). If vagal fails: Adenosine 6mg rapid IV push followed by 20mL NS flush, then 12mg if no conversion. Monitor continuously during adenosine — brief asystole is expected and normal. Unstable SVT: Immediate synchronized cardioversion starting at 50-100J biphasic. Sedate if time and condition permit.",
      complications: "Adenosine side effects include transient chest pain, flushing, dyspnea, and brief periods of asystole or bradycardia (all expected and self-resolving). Rarely, adenosine can trigger atrial fibrillation. Cardioversion risks include skin burns, arrhythmia induction, and sedation-related complications. Prolonged SVT can lead to heart failure (tachycardia-induced cardiomyopathy).",
      pearls: [
        "The modified Valsalva maneuver (blow into a syringe for 15 seconds, then lie supine with legs elevated to 45 degrees) has a ~40% conversion rate — much higher than traditional Valsalva",
        "Adenosine must be given as a rapid IV push through a large proximal vein, immediately followed by a 20mL NS flush — slow administration is ineffective due to the drug's 6-second half-life",
        "Brief asystole after adenosine is expected and normal — warn the patient before administration that they may feel a brief sense of impending doom",
        "If the rhythm converts with adenosine but immediately recurs, the next dose may convert and hold — recurrence is common and does not indicate treatment failure"
      ],
      pitfalls: [
        "Administering adenosine slowly — it must be a rapid bolus through a large vein with immediate flush; slow pushes are completely ineffective",
        "Cardioverting a stable SVT patient before trying vagal maneuvers and adenosine — these should be attempted first",
        "Giving adenosine to a wide-complex tachycardia that may be VT — if the rhythm is wide and irregular, do not give adenosine",
        "Not monitoring continuously during adenosine — you need to capture the underlying rhythm during the brief AV block to confirm diagnosis"
      ],
      faq: [
        { question: "What is the difference between SVT and sinus tachycardia?", answer: "SVT has an abrupt onset and offset, rates typically 150-250 bpm, no visible P waves, and responds to vagal maneuvers/adenosine. Sinus tachycardia has a gradual onset and offset, rates usually <150 bpm, visible upright P waves in lead II, and is a physiological response to a stressor (fever, dehydration, pain). Sinus tachycardia should be treated by addressing the underlying cause, not with adenosine or cardioversion." },
        { question: "When should you cardiovert SVT instead of giving adenosine?", answer: "Cardiovert immediately when the patient shows signs of hemodynamic instability: hypotension, altered consciousness, severe ischemic chest pain, or acute heart failure. If the patient is stable, attempt vagal maneuvers first, then adenosine. Cardioversion is also appropriate if adenosine fails in a deteriorating patient." }
      ],
      keywords: ["supraventricular tachycardia paramedic", "SVT management", "adenosine SVT", "vagal maneuvers", "narrow complex tachycardia"],
      related: ["cardiac-dysrhythmias", "synchronized-cardioversion", "12-lead-ecg-interpretation", "atrial-fibrillation"]
    },

    {
      title: "Ventricular Tachycardia with Pulse",
      category: "Cardiac Emergencies",
      overview: "Ventricular tachycardia (VT) with a pulse is a wide-complex tachycardia originating below the bundle of His at rates typically between 120-250 bpm. It is a potentially lethal arrhythmia that can rapidly degenerate into pulseless VT or ventricular fibrillation.",
      mechanism: "VT arises from abnormal automaticity or re-entry circuits within the ventricular myocardium. Myocardial ischemia, infarction, or structural heart disease creates areas of slow conduction that form re-entry loops. Because conduction travels through ventricular muscle rather than the normal His-Purkinje system, the QRS complex is wide (>0.12 seconds).",
      clinicalRelevance: "Distinguishing VT from SVT with aberrancy is a critical paramedic exam topic. The fundamental principle: if in doubt, treat as VT — it is far more dangerous to undertreated VT than to inappropriately treat SVT with aberrancy as VT. Wide-complex tachycardia in a patient with cardiac history is VT until proven otherwise.",
      signsSymptoms: "Patients may be hemodynamically stable or unstable. Symptoms include palpitations, chest pain, dyspnea, lightheadedness, and syncope. Stable VT: alert with adequate BP. Unstable VT: hypotension, altered mental status, ischemic chest pain, acute heart failure. VT can rapidly deteriorate to pulseless VT or VF without warning.",
      assessment: "12-lead ECG showing wide-complex (>0.12s) tachycardia, usually regular. Features favoring VT over SVT with aberrancy: AV dissociation (independent P waves), fusion or capture beats, concordance across precordial leads, extreme axis deviation, very wide QRS (>0.16s), and history of structural heart disease. Assess hemodynamic stability immediately.",
      management: "Unstable VT with pulse: Immediate synchronized cardioversion at 100J biphasic, escalating as needed. Sedate if possible. Stable VT with pulse: Amiodarone 150mg IV over 10 minutes, may repeat. Alternative: Lidocaine 1-1.5mg/kg IV bolus. If hemodynamic deterioration occurs during treatment, immediately cardiovert. All patients need continuous cardiac monitoring and transport.",
      complications: "Degeneration to pulseless VT or VF (most feared), cardioversion-related complications (arrhythmia induction, sedation issues), amiodarone-induced hypotension (contains vasodilatory solvents), lidocaine toxicity (seizures, CNS depression), and recurrent VT after initial treatment.",
      pearls: [
        "When in doubt about the origin of a wide-complex tachycardia, ALWAYS treat as VT — treating VT as SVT (giving AV nodal blockers) can be fatal",
        "AV dissociation is the most specific finding for VT — look for independent P waves marching through at a different rate than the QRS complexes",
        "Monomorphic VT (uniform QRS morphology) is more common and more likely to be stable; polymorphic VT is more likely to be unstable and degenerate to VF",
        "Do not delay cardioversion for IV access or medication in unstable VT — electricity is the treatment"
      ],
      pitfalls: [
        "Treating wide-complex tachycardia as SVT and giving calcium channel blockers or beta-blockers — these can cause cardiovascular collapse in VT",
        "Delaying cardioversion in unstable VT to start an IV line or give medications — shock first, establish access after",
        "Assuming a young patient cannot have VT — while less common, VT can occur in young patients with channelopathies or cardiomyopathy",
        "Not preparing for defibrillation when treating stable VT — VT can degenerate to VF at any time during treatment"
      ],
      faq: [
        { question: "How do you distinguish VT from SVT with aberrancy?", answer: "Several ECG criteria favor VT: AV dissociation, fusion beats, capture beats, extreme axis deviation, very wide QRS (>160ms), concordance in precordial leads (all positive or all negative), and absence of typical bundle branch block morphology. Clinical factors favoring VT include age >35, history of MI or heart failure, and hemodynamic instability. When uncertain, always treat as VT." },
        { question: "What medications are used for stable VT?", answer: "Amiodarone is the first-line antiarrhythmic: 150mg IV over 10 minutes. Lidocaine is an alternative: 1-1.5mg/kg IV bolus. Procainamide is effective but requires slow infusion and close monitoring. Do not give multiple antiarrhythmics simultaneously due to additive proarrhythmic effects. If medications fail, proceed to synchronized cardioversion." }
      ],
      keywords: ["ventricular tachycardia paramedic", "VT with pulse management", "wide complex tachycardia", "amiodarone VT", "cardioversion VT"],
      related: ["ventricular-fibrillation", "cardiac-dysrhythmias", "synchronized-cardioversion", "cardiac-arrest-management"]
    },

    {
      title: "Aortic Emergencies",
      category: "Cardiac Emergencies",
      overview: "Aortic emergencies include aortic dissection and aortic aneurysm rupture. Aortic dissection occurs when a tear in the intimal layer of the aorta allows blood to enter the media, creating a false lumen. These are catastrophic emergencies with high mortality that require immediate recognition and rapid transport.",
      mechanism: "In aortic dissection, a tear in the aortic intima allows pulsatile blood flow to separate the intimal and medial layers, creating a false lumen. The dissection can propagate proximally or distally, occluding branch vessels (coronary, carotid, mesenteric, renal, iliac) and causing organ malperfusion. Risk factors include hypertension (most common), connective tissue disorders (Marfan, Ehlers-Danlos), bicuspid aortic valve, and cocaine use.",
      clinicalRelevance: "Aortic dissection is frequently misdiagnosed as acute MI, leading to inappropriate thrombolytic or anticoagulant therapy — which can be fatal. Paramedics must maintain a high index of suspicion for dissection in patients with acute chest pain, especially with asymmetric blood pressures or pulse deficits.",
      signsSymptoms: "Sudden onset of severe, sharp, tearing chest or back pain (often described as the worst pain ever experienced). Pain may migrate as the dissection propagates. Physical findings include blood pressure differential between arms (>20 mmHg), pulse deficits in extremities, aortic regurgitation murmur, neurological deficits (if carotid involvement), and signs of shock if rupture has occurred.",
      assessment: "Bilateral blood pressures (look for >20 mmHg differential), pulse checks in all four extremities, neurological assessment, 12-lead ECG (to rule out STEMI — dissection can involve coronary arteries), and assessment for shock. Pain characteristics, onset, and migration pattern help differentiate from MI. Consider dissection in any patient with chest/back pain and pulse or BP asymmetry.",
      management: "Treatment focuses on reducing aortic wall shear stress by controlling heart rate and blood pressure. Target HR <60 bpm with IV beta-blockers (esmolol preferred for titratability). Target SBP 100-120 mmHg. Aggressive pain control with IV opioids (morphine or fentanyl). Do NOT administer anticoagulants or thrombolytics. Rapid transport to a cardiac surgery center. Minimize movement and stimulation.",
      complications: "Aortic rupture (rapidly fatal), cardiac tamponade (proximal dissection extending to pericardium), acute myocardial infarction (coronary ostia involvement), stroke (carotid involvement), mesenteric ischemia, renal failure, limb ischemia, and death. Type A dissections (involving ascending aorta) have 1% mortality per hour without surgical intervention.",
      pearls: [
        "Check bilateral blood pressures on EVERY patient with acute chest or back pain — a >20 mmHg difference is a red flag for dissection",
        "The classic description is 'tearing pain' radiating to the back, but many dissections present atypically — maintain high index of suspicion",
        "NEVER give thrombolytics or anticoagulants to a suspected dissection patient — this dramatically increases mortality from hemorrhage",
        "Rapid transport to a facility with cardiac surgery capability is essential — do not divert to a non-surgical center"
      ],
      pitfalls: [
        "Misdiagnosing aortic dissection as acute MI and administering aspirin, heparin, or thrombolytics — these worsen bleeding",
        "Not checking bilateral blood pressures — asymmetry is the most important prehospital clue",
        "Aggressively lowering BP without controlling heart rate first — reducing afterload alone can increase aortic wall stress",
        "Assuming young patients cannot have dissections — Marfan syndrome and cocaine use cause dissections in young adults"
      ],
      faq: [
        { question: "How do you differentiate aortic dissection from MI?", answer: "Dissection typically presents with sudden onset severe tearing/ripping chest or back pain, BP asymmetry between arms, and pulse deficits. MI typically presents with gradual-onset crushing chest pressure with radiation to the arm or jaw, without BP asymmetry. However, dissection CAN cause MI if it involves the coronary ostia, making the two diagnoses overlap. Always check bilateral BPs and consider dissection when the presentation is atypical for MI." },
        { question: "Why is heart rate control important in aortic dissection?", answer: "Aortic wall shear stress (the force that propagates the dissection) depends on both blood pressure and the rate of left ventricular ejection (dP/dt). Reducing heart rate reduces dP/dt, decreasing shear stress on the aortic wall. This is why beta-blockers are the first-line treatment — they reduce both heart rate and blood pressure, addressing both components of wall stress." }
      ],
      keywords: ["aortic dissection paramedic", "aortic emergency management", "thoracic aortic aneurysm", "chest pain differential", "bilateral blood pressure"],
      related: ["acute-myocardial-infarction", "cardiogenic-shock", "chest-trauma", "cardiac-tamponade"]
    },

    {
      title: "Hypertensive Emergency",
      category: "Cardiac Emergencies",
      overview: "Hypertensive emergency is an acute, severe elevation in blood pressure (typically >180/120 mmHg) with evidence of end-organ damage. Unlike hypertensive urgency (elevated BP without end-organ damage), hypertensive emergency requires immediate blood pressure reduction in the prehospital and emergency department setting.",
      mechanism: "Severe hypertension overwhelms vascular autoregulation, leading to direct vascular endothelial damage. This triggers a cascade of fibrinoid necrosis, platelet activation, and thrombotic microangiopathy. End organs most vulnerable include the brain (hypertensive encephalopathy, stroke), heart (acute heart failure, aortic dissection), kidneys (acute nephropathy), and eyes (papilledema, retinal hemorrhage).",
      clinicalRelevance: "Paramedics must distinguish hypertensive emergency from hypertensive urgency and incidental hypertension. Only hypertensive emergency requires acute prehospital treatment. The goal is a controlled, gradual reduction in BP — rapid or excessive lowering can cause watershed infarctions in patients with chronic hypertension.",
      signsSymptoms: "Severe hypertension (>180/120) PLUS end-organ damage signs: headache (severe, different from usual pattern), altered mental status, visual disturbances, focal neurological deficits (stroke), chest pain, acute dyspnea (pulmonary edema), seizures, nausea/vomiting, and epistaxis. The presence of end-organ damage is what differentiates emergency from urgency.",
      assessment: "Accurate blood pressure measurement (use appropriate cuff size, repeat measurement, check both arms). Neurological assessment (GCS, focal deficits, vision changes, papilledema if fundoscope available). Cardiac assessment (12-lead ECG, lung sounds for pulmonary edema). Kidney assessment (urine output if possible). Pregnancy test in women of childbearing age (eclampsia).",
      management: "Target: reduce MAP by no more than 25% in the first hour, then gradually toward 160/100 over 2-6 hours. Prehospital options vary by protocol and etiology. For hypertensive encephalopathy/stroke: consider nicardipine drip or labetalol. For acute pulmonary edema with HTN: nitroglycerin SL/IV, CPAP. For eclampsia: magnesium sulfate. Avoid rapid or excessive BP reduction. Rapid transport to appropriate facility.",
      complications: "Stroke (ischemic or hemorrhagic), acute MI, aortic dissection, acute heart failure/pulmonary edema, hypertensive encephalopathy, acute kidney injury, eclampsia (in pregnancy), retinal hemorrhage, and death. Complications of treatment include hypotension from over-aggressive BP reduction, watershed infarction, and medication side effects.",
      pearls: [
        "The presence of end-organ damage defines a hypertensive emergency — elevated BP alone without symptoms is urgency, not emergency",
        "Reduce MAP by no more than 25% in the first hour — excessive or rapid reduction can cause ischemic stroke in patients adapted to high pressures",
        "Always consider secondary causes: cocaine, amphetamines, phentermine, MAOIs, pheochromocytoma, and eclampsia",
        "Use an appropriately sized blood pressure cuff — too small a cuff overestimates BP by as much as 30 mmHg"
      ],
      pitfalls: [
        "Treating the number rather than the patient — high BP without end-organ damage does not require emergency treatment",
        "Rapidly dropping BP to 'normal' — this can cause watershed infarctions in patients with chronically elevated pressures",
        "Not assessing for neurological deficits — hypertensive emergency can present as stroke, and vice versa",
        "Using sublingual nifedipine — this causes unpredictable, rapid BP drops and is contraindicated in hypertensive emergencies"
      ],
      faq: [
        { question: "What is the difference between hypertensive emergency and urgency?", answer: "Hypertensive emergency is severe hypertension (>180/120) WITH evidence of acute end-organ damage (encephalopathy, stroke, MI, heart failure, aortic dissection, acute kidney injury). Hypertensive urgency is severe hypertension WITHOUT end-organ damage. Emergency requires immediate treatment with parenteral medications. Urgency can be managed with oral medications and outpatient follow-up." },
        { question: "Why should you not lower blood pressure too quickly?", answer: "Patients with chronic hypertension have autoregulatory adaptation — their cerebral, coronary, and renal blood flow is maintained at higher perfusion pressures. Rapid reduction below the autoregulatory range causes ischemia in watershed territories (border zones between vascular territories), potentially causing stroke, MI, or acute kidney injury. The goal is a 25% reduction in MAP over the first hour." }
      ],
      keywords: ["hypertensive emergency paramedic", "hypertensive crisis management", "severe hypertension treatment", "end-organ damage", "blood pressure emergency"],
      related: ["acute-myocardial-infarction", "congestive-heart-failure", "eclampsia", "aortic-emergencies"]
    },

    {
      title: "Cardiac Monitoring and Rhythm Interpretation",
      category: "Cardiac Emergencies",
      overview: "Cardiac monitoring is the continuous observation of the heart's electrical activity using electrocardiography. Accurate rhythm interpretation is a foundational paramedic skill that guides all cardiac treatment decisions, from medication selection to defibrillation.",
      mechanism: "Cardiac monitors detect the electrical potential differences generated by cardiac depolarization and repolarization through electrodes placed on the skin. The standard 3-lead monitor provides rhythm monitoring, while 12-lead ECG provides diagnostic information. Each heartbeat generates a P wave (atrial depolarization), QRS complex (ventricular depolarization), and T wave (ventricular repolarization).",
      clinicalRelevance: "Rhythm interpretation is tested extensively on NREMT and paramedic certification exams. The ability to rapidly identify life-threatening arrhythmias and initiate appropriate treatment is the distinguishing skill of the paramedic. Accurate interpretation drives all cardiac treatment algorithms.",
      signsSymptoms: "Cardiac monitoring is indicated for: chest pain, dyspnea, syncope, palpitations, altered mental status, shock, cardiac arrest, electrolyte abnormalities, drug overdoses, electrical injuries, and any critical patient. Monitor findings range from normal sinus rhythm to lethal arrhythmias requiring immediate intervention.",
      assessment: "Systematic rhythm analysis: (1) Rate — normal 60-100, bradycardia <60, tachycardia >100. (2) Rhythm — regular or irregular. (3) P waves — present, upright in lead II, one before each QRS. (4) PR interval — 0.12-0.20 seconds. (5) QRS duration — <0.12 seconds normal, >0.12 wide. (6) Relationship of P waves to QRS complexes.",
      management: "Management is rhythm-specific. Normal sinus rhythm: no treatment needed. Sinus bradycardia with symptoms: atropine, then pacing. SVT: vagal maneuvers, adenosine, cardioversion. VT with pulse: amiodarone, cardioversion. VF/pulseless VT: defibrillation. PEA/asystole: CPR, epinephrine, treat H's and T's. AFib/AFlutter: rate control or cardioversion based on stability.",
      complications: "Misinterpretation of rhythm leading to inappropriate treatment (most dangerous complication), artifact mimicking arrhythmias (movement, electrode problems), lead disconnection alarms, skin irritation from electrodes, and false alarms causing alarm fatigue.",
      pearls: [
        "Always use a systematic approach to rhythm analysis — rate, rhythm, P waves, PR interval, QRS duration — this prevents pattern-recognition errors",
        "Artifact is the most common cause of apparent arrhythmias — if the rhythm doesn't match the clinical picture, check your leads before treating",
        "Lead II is the best lead for rhythm analysis because P waves are most prominent in this lead orientation",
        "If the rhythm changes acutely, always reassess the patient clinically before changing treatment — artifact can mimic dangerous rhythms"
      ],
      pitfalls: [
        "Treating the monitor instead of the patient — always correlate the rhythm with the patient's clinical condition",
        "Not recognizing artifact as a cause of apparent arrhythmias — shivering, movement, and loose leads can mimic VF or VT",
        "Relying on the monitor's automated interpretation — computer algorithms are frequently wrong, especially with artifact",
        "Not obtaining a 12-lead ECG when indicated — the 3-lead monitor is for rhythm monitoring only, not for diagnosing STEMI or other conditions"
      ],
      faq: [
        { question: "What is the systematic approach to rhythm interpretation?", answer: "Use a consistent 5-step approach: (1) What is the rate? (2) Is the rhythm regular or irregular? (3) Are P waves present, and what is their morphology? (4) What is the PR interval? (5) What is the QRS width? This systematic approach prevents the common error of pattern recognition without thorough analysis." },
        { question: "How do you differentiate artifact from true arrhythmias?", answer: "Artifact is irregular and does not follow the expected morphology of cardiac waveforms. True arrhythmias should correlate with the patient's clinical condition (symptoms, pulse). If the patient has a normal pulse and appears stable, an apparent lethal rhythm is likely artifact. Check electrode placement, cable connections, and ask the patient to remain still. A 12-lead ECG can help clarify." }
      ],
      keywords: ["cardiac monitoring paramedic", "ECG rhythm interpretation", "arrhythmia identification", "cardiac rhythm analysis", "EKG interpretation"],
      related: ["12-lead-ecg-interpretation", "cardiac-dysrhythmias", "atrial-fibrillation", "heart-blocks"]
    },

    {
      title: "Post-Cardiac Arrest Care",
      category: "Cardiac Emergencies",
      overview: "Post-cardiac arrest care is the systematic management of patients who achieve return of spontaneous circulation (ROSC) after cardiac arrest. This phase focuses on optimizing hemodynamics, preventing re-arrest, and minimizing secondary brain injury through targeted interventions.",
      mechanism: "After ROSC, patients experience post-cardiac arrest syndrome comprising four components: (1) post-cardiac arrest brain injury from ischemia-reperfusion, (2) post-cardiac arrest myocardial dysfunction (global stunning), (3) systemic ischemia-reperfusion response (inflammatory cascade), and (4) the persistent underlying pathology that caused the arrest.",
      clinicalRelevance: "Post-ROSC care significantly impacts neurological outcomes and survival to discharge. Prehospital management during transport directly affects these outcomes. Key interventions include optimizing oxygenation, maintaining hemodynamics, and identifying treatable causes of the arrest.",
      signsSymptoms: "Post-ROSC patients present on a spectrum from comatose to fully awake. Common findings include hemodynamic instability (hypotension from myocardial stunning), altered consciousness, respiratory insufficiency, recurrent arrhythmias, seizures, and metabolic derangement. Signs of re-arrest include deteriorating rhythm, loss of pulse, and hemodynamic collapse.",
      assessment: "Continuous monitoring: capnography, SpO2, cardiac rhythm, blood pressure (every 2-3 minutes), GCS, blood glucose. 12-lead ECG to identify STEMI (which requires emergent cath lab). Neurological assessment: pupillary response, motor response, seizure activity. Assess for and treat reversible causes of the arrest (H's and T's).",
      management: "Airway: maintain advanced airway, target SpO2 94-96% (avoid hyperoxia), target ETCO2 35-45 mmHg. Hemodynamics: IV fluid bolus for hypotension, vasopressors if needed (target SBP >90 mmHg, MAP >65 mmHg). 12-lead ECG: if STEMI, transport to PCI-capable facility. Temperature: initiate targeted temperature management if available (avoid hyperthermia). Treat seizures with benzodiazepines. Treat hypoglycemia.",
      complications: "Re-arrest (common in the first 24 hours), hemodynamic instability, cardiogenic shock, seizures, brain injury from hypoxia or hyperoxia, aspiration pneumonia, acute kidney injury, coagulopathy, and multi-organ failure. Iatrogenic complications include hyperoxia (worsens brain injury), hypocapnia from hyperventilation, and hypothermia-related arrhythmias.",
      pearls: [
        "Avoid hyperoxia post-ROSC — titrate FiO2 to maintain SpO2 94-96%; excess oxygen increases oxidative stress and worsens neurological outcomes",
        "Avoid hyperventilation — target ETCO2 35-45 mmHg; hypocapnia causes cerebral vasoconstriction and worsens brain ischemia",
        "Obtain a 12-lead ECG as soon as possible after ROSC — STEMI is a common cause of arrest and requires emergent PCI",
        "Hemodynamic optimization is critical — even brief episodes of post-ROSC hypotension are associated with worse neurological outcomes"
      ],
      pitfalls: [
        "Ventilating aggressively (hyperventilation) — this causes hypocapnia and cerebral vasoconstriction, worsening brain injury",
        "Leaving the patient on 100% oxygen after ROSC — hyperoxia generates free radicals that worsen ischemia-reperfusion injury",
        "Not obtaining a 12-lead ECG — STEMI is a common and treatable cause of cardiac arrest",
        "Assuming the patient is neurologically devastated based on initial post-ROSC exam — neurological prognosis cannot be determined in the first 72 hours"
      ],
      faq: [
        { question: "Why is hyperoxia harmful after cardiac arrest?", answer: "After ROSC, reperfusion of ischemic tissue generates reactive oxygen species (free radicals). Exposing tissues to supraphysiologic oxygen levels (hyperoxia) amplifies this oxidative stress, causing additional cellular damage — particularly to the vulnerable post-ischemic brain. Studies show that patients maintained at SpO2 94-96% have better neurological outcomes than those on 100% FiO2." },
        { question: "What is targeted temperature management?", answer: "TTM involves cooling the patient to 32-36°C for 24 hours after cardiac arrest to reduce metabolic demand and secondary brain injury. While primarily a hospital intervention, some EMS systems initiate cooling in the field. The most important prehospital TTM action is avoiding hyperthermia — a post-ROSC temperature >38°C is associated with significantly worse outcomes." }
      ],
      keywords: ["post-cardiac arrest care paramedic", "ROSC management", "post-resuscitation care", "targeted temperature management", "post-arrest syndrome"],
      related: ["cardiac-arrest-management", "ventricular-fibrillation", "12-lead-ecg-interpretation", "cardiogenic-shock"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Trauma (additional)
    // ═══════════════════════════════════════════

    {
      title: "Extremity Trauma",
      category: "Trauma",
      overview: "Extremity trauma encompasses fractures, dislocations, sprains, strains, amputations, and vascular injuries to the upper and lower extremities. While rarely immediately life-threatening, extremity injuries can cause significant hemorrhage, neurovascular compromise, and long-term disability if not properly managed.",
      mechanism: "Extremity fractures result from forces exceeding bone structural integrity: direct blow (transverse fracture), rotational force (spiral fracture), axial loading (compression fracture), or indirect force (avulsion). Dislocations occur when forces exceed ligamentous and capsular strength, displacing articular surfaces. Open fractures have communication between the fracture site and the external environment through a wound.",
      clinicalRelevance: "Extremity injuries are among the most common trauma presentations in EMS. Proper splinting technique reduces pain, prevents further injury, reduces bleeding, and decreases the risk of fat embolism. Missed neurovascular compromise can lead to limb loss.",
      signsSymptoms: "Pain, swelling, deformity, ecchymosis, crepitus, loss of function, point tenderness, and guarding. Neurovascular compromise signs: diminished or absent distal pulses, pallor, paresthesias, paralysis, and poikilothermia (cool extremity). Open fracture: bone visible through wound or wound in proximity to fracture.",
      assessment: "Assess circulation, sensation, and motor function (CSM) distal to the injury BEFORE and AFTER any intervention. Compare to the uninjured side. Check distal pulses, capillary refill, skin color and temperature, sensation to light touch, and ability to move digits. Assess the mechanism for associated injuries. Check for compartment syndrome signs.",
      management: "Control hemorrhage (direct pressure, tourniquet for life-threatening bleeding). Assess and document distal CSM. Splint the injury including the joint above and below the fracture. For angulated fractures with neurovascular compromise, apply gentle longitudinal traction to restore alignment. Reassess CSM after splinting. Manage pain aggressively. Open fractures: cover with moist sterile dressing, do not push bone back in. Amputations: wrap in saline-moistened gauze, place in plastic bag on ice.",
      complications: "Neurovascular injury (arterial damage, nerve transection), compartment syndrome, fat embolism syndrome, hemorrhagic shock (femur fractures can lose 1-2L, pelvic fractures up to 3L+), infection (open fractures), DVT/PE, avascular necrosis, malunion, and chronic regional pain syndrome.",
      pearls: [
        "Always check and document CSM before AND after splinting — if pulses disappear after splinting, the splint is too tight or needs repositioning",
        "Femur fractures can cause hemorrhagic shock from bleeding into the thigh — always assess for shock with femur fractures",
        "Apply traction to angulated fractures ONLY if neurovascular compromise exists — otherwise, splint in the position found",
        "Treat pain aggressively — extremity fractures are extremely painful and undertreated pain contributes to shock"
      ],
      pitfalls: [
        "Not checking distal pulses after splinting — a properly applied splint should not compromise circulation",
        "Forgetting to splint the joints above and below the fracture — inadequate immobilization causes additional pain and injury",
        "Pushing exposed bone back into an open fracture wound — this introduces contamination and does not reduce the fracture",
        "Underestimating blood loss from closed fractures — femur fractures can cause life-threatening hemorrhage into the thigh"
      ],
      faq: [
        { question: "When should you apply traction to a fracture?", answer: "Apply gentle longitudinal traction when an angulated fracture has signs of neurovascular compromise (absent distal pulses, pallor, paresthesia). The goal is to restore alignment enough to relieve vascular compression. Do not apply traction to fractures without neurovascular compromise — splint them in the position found. Traction splints (e.g., Sager, Hare) are specifically indicated for mid-shaft femur fractures." },
        { question: "How do you manage an amputated part?", answer: "Wrap the amputated part in saline-moistened gauze, place it in a sealed plastic bag, and place the bag on ice or a cold pack. Do NOT place the part directly on ice or submerge in water/saline — this causes tissue damage. Keep the part with the patient for possible reimplantation. Replantation is most successful within 6 hours for digits and 4 hours for larger parts (longer with cooling)." }
      ],
      keywords: ["extremity trauma paramedic", "fracture management EMS", "splinting technique", "neurovascular assessment", "open fracture care"],
      related: ["tourniquet-application", "hemorrhagic-shock", "pelvic-fracture", "pain-management-in-ems"]
    },

    {
      title: "Burns Assessment and Management",
      category: "Trauma",
      overview: "Burns are tissue injuries caused by thermal, chemical, electrical, or radiation energy. Burn management requires rapid assessment of burn depth, extent (TBSA), and associated injuries. Major burns are among the most complex trauma presentations, requiring aggressive fluid resuscitation, airway management, and pain control.",
      mechanism: "Thermal burns result from heat transfer to tissue causing protein denaturation and cell death. The zones of injury include: zone of coagulation (central, irreversible necrosis), zone of stasis (surrounding area with impaired perfusion that may be salvageable), and zone of hyperemia (outer area with inflammation and vasodilation). Chemical burns cause damage through chemical reactions (acid causes coagulation necrosis, alkali causes liquefaction necrosis). Electrical burns cause thermal injury along current path.",
      clinicalRelevance: "Accurate burn assessment and early fluid resuscitation directly impact patient outcomes. Paramedics must rapidly identify patients requiring burn center referral: >20% TBSA, full-thickness burns, burns involving face/hands/feet/perineum/joints, inhalation injury, electrical burns, and chemical burns.",
      signsSymptoms: "Superficial (first-degree): red, painful, dry (sunburn). Partial-thickness (second-degree): red, painful, blistered, moist, blanches with pressure. Full-thickness (third-degree): white/brown/charred, painless, leathery, does not blanch. TBSA estimation using Rule of Nines: head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%.",
      assessment: "Primary survey: Assess airway for inhalation injury (singed nasal/facial hair, soot in airway, stridor, hoarse voice, burns to face/neck). Determine burn depth and calculate TBSA (Rule of Nines or palm method — patient's palm = ~1% TBSA). Assess for circumferential burns (risk of compartment syndrome). Evaluate for associated trauma. Check for CO poisoning (enclosed space fires).",
      management: "Stop the burning process (remove clothing, brush off dry chemicals, copious irrigation for chemical burns). Airway: early intubation for suspected inhalation injury (airway edema can develop rapidly). Fluid resuscitation (Parkland formula: 4 mL/kg × %TBSA, half in first 8 hours — for burns >20% TBSA). Pain management: IV opioids (fentanyl preferred). Cover burns with dry, sterile dressings. Keep patient warm (burn patients lose thermoregulation). Transport to burn center.",
      complications: "Inhalation injury (leading cause of burn death), airway obstruction from edema, hypovolemic shock (massive fluid shifts), hypothermia (loss of skin barrier), circumferential burns causing compartment syndrome, infection, carbon monoxide poisoning, cyanide poisoning (from synthetic material combustion), and rhabdomyolysis (electrical burns).",
      pearls: [
        "Inhalation injury is the leading cause of death in burn patients — intubate early if ANY signs of airway involvement are present, as edema progresses rapidly",
        "The Rule of Nines overestimates burn extent in children — use a modified pediatric chart (head is proportionally larger, legs smaller)",
        "Do NOT apply ice or ice water to burns — this causes vasoconstriction, worsens tissue damage, and promotes hypothermia",
        "Circumferential full-thickness burns to an extremity or chest can act as a tourniquet — monitor distal pulses and respiratory status closely"
      ],
      pitfalls: [
        "Delaying intubation in patients with inhalation injury — airway edema can make intubation impossible within hours",
        "Underestimating TBSA and providing inadequate fluid resuscitation — this leads to burn shock and organ failure",
        "Applying wet dressings to large burns — this promotes hypothermia in patients who have lost thermoregulatory capacity",
        "Focusing on the burn and missing other traumatic injuries — burn patients are trauma patients and need a full primary survey"
      ],
      faq: [
        { question: "What are the signs of inhalation injury?", answer: "Look for: burns to the face and neck, singed nasal hairs or eyebrows, soot in the mouth/nose/sputum, hoarseness or stridor, dyspnea or wheezing, history of enclosed-space fire, and altered mental status. Any patient with these findings should have their airway secured early, as progressive edema can make intubation impossible. CO and cyanide poisoning should also be considered." },
        { question: "How do you calculate fluid resuscitation for burns?", answer: "Use the Parkland formula: 4 mL × patient weight (kg) × %TBSA burned. Give half of the calculated volume in the first 8 hours from the TIME OF INJURY (not arrival), and the remaining half over the next 16 hours. This applies to burns >20% TBSA. In the prehospital setting, initiate a fluid bolus of 500 mL LR and continue infusion during transport. Titrate to urine output of 0.5-1 mL/kg/hr in hospital." }
      ],
      keywords: ["burns assessment paramedic", "TBSA calculation", "burn management EMS", "inhalation injury", "Parkland formula burns"],
      related: ["hypothermia", "hemorrhagic-shock", "pain-management-in-ems", "carbon-monoxide-poisoning"]
    },

    {
      title: "Crush Injury and Crush Syndrome",
      category: "Trauma",
      overview: "Crush injury occurs when a body part is subjected to prolonged compression, leading to local tissue damage. Crush syndrome is the systemic manifestation that develops when compressed muscle is released, sending toxic metabolites (myoglobin, potassium, phosphorus, lactate) into the systemic circulation, potentially causing cardiac arrest and renal failure.",
      mechanism: "Prolonged compression (typically >1 hour) causes ischemia and muscle cell death (rhabdomyolysis). Intracellular contents accumulate: potassium, myoglobin, phosphorus, and lactate. Upon release of compression, these substances flood the systemic circulation. Hyperkalemia causes cardiac dysrhythmias. Myoglobin precipitates in renal tubules, causing acute kidney injury. Reperfusion injury compounds the ischemic damage.",
      clinicalRelevance: "Crush syndrome is a classic paramedic exam topic and a critical prehospital management scenario. The key concept is that the patient may appear stable while trapped but can deteriorate rapidly or arrest immediately upon extrication. Pre-treatment before release is essential.",
      signsSymptoms: "While entrapped: pain, paresthesias, and weakness in the compressed area. After release: rapid hypotension, hyperkalemia (peaked T waves, widened QRS, cardiac arrest), dark tea-colored urine (myoglobinuria), compartment syndrome, metabolic acidosis, and acute kidney injury. Cardiac arrest from hyperkalemia is the most immediate life threat.",
      assessment: "Estimate duration of entrapment (crush syndrome risk increases significantly after 1 hour of compression). Assess trapped extremities for viability. Obtain baseline ECG to monitor for hyperkalemia (peaked T waves, widened QRS). Assess hemodynamic status. Plan fluid resuscitation and consider pre-treatment before extrication.",
      management: "BEFORE extrication: Establish IV access (bilateral large-bore), begin aggressive normal saline infusion (1-1.5 L/hr), consider sodium bicarbonate (1 mEq/kg IV) to alkalinize urine and prevent myoglobin precipitation, place cardiac monitor. If hyperkalemia present: calcium chloride 10% 10 mL IV (or calcium gluconate), sodium bicarbonate, albuterol nebulizer. DURING extrication: continue fluids, monitor ECG continuously. AFTER release: continue aggressive fluids, tourniquet if hemorrhage, transport rapidly.",
      complications: "Hyperkalemia-induced cardiac arrest (most immediate threat), acute kidney injury from myoglobin, hypovolemic shock from third-spacing, compartment syndrome, DIC, ARDS, multi-organ failure, and death. Reperfusion injury can cause local tissue swelling that worsens compartment syndrome.",
      pearls: [
        "The most dangerous moment in crush injury is the moment of release — the patient may arrest from hyperkalemia as potassium is released into circulation",
        "Start aggressive IV fluids BEFORE extrication — the goal is to dilute the toxic metabolites before they reach the heart and kidneys",
        "Sodium bicarbonate alkalinizes the urine, reducing myoglobin precipitation in the renal tubules — give 1 mEq/kg IV before extrication",
        "If ECG shows hyperkalemia (peaked T waves, widened QRS), give calcium chloride BEFORE releasing the compression"
      ],
      pitfalls: [
        "Releasing compression without pre-treatment with IV fluids and bicarbonate — this results in a bolus of potassium and myoglobin hitting the heart and kidneys simultaneously",
        "Not monitoring ECG during extrication — hyperkalemia develops rapidly and can cause sudden cardiac arrest",
        "Underestimating fluid requirements — crush syndrome patients need massive volumes (1-1.5 L/hr initially) to maintain renal perfusion and dilute myoglobin",
        "Applying a tourniquet before extrication without clear hemorrhage — this traps the toxic metabolites in the limb and delays treatment when released"
      ],
      faq: [
        { question: "When does crush syndrome develop?", answer: "Crush syndrome typically develops after 1 hour or more of continuous compression of significant muscle mass (thigh, leg, trunk). However, crush syndrome has been reported after as little as 20 minutes in patients with large muscle mass or pre-existing renal disease. Risk factors include duration of entrapment, amount of muscle mass compressed, patient's age and comorbidities. Always prepare for crush syndrome when entrapment exceeds 1 hour." },
        { question: "Why is calcium chloride given for hyperkalemia?", answer: "Calcium chloride does not lower potassium levels — it stabilizes the cardiac cell membrane, raising the threshold for depolarization and protecting against the arrhythmogenic effects of hyperkalemia. It buys time (30-60 minutes) while other treatments (bicarbonate, fluids, albuterol) work to actually shift or remove potassium from the blood. It is the most important immediate intervention for hyperkalemia with ECG changes." }
      ],
      keywords: ["crush injury paramedic", "crush syndrome management", "rhabdomyolysis EMS", "extrication medical care", "hyperkalemia crush injury"],
      related: ["hemorrhagic-shock", "hyperkalemia", "traumatic-cardiac-arrest", "compartment-syndrome"]
    },

    {
      title: "Facial and Neck Trauma",
      category: "Trauma",
      overview: "Facial and neck trauma encompasses injuries to the complex anatomy of the face and anterior neck, including the airway, vasculature, and specialized sensory organs. These injuries present unique challenges due to the risk of airway compromise, uncontrolled hemorrhage, and associated cervical spine injuries.",
      mechanism: "Facial trauma commonly results from blunt force (MVC, assault, falls, sports), penetrating injury (gunshot, stabbing), or blast injury. The face absorbs significant energy that might otherwise be transmitted to the brain. Le Fort fractures involve specific patterns of maxillary fracture. Neck trauma threatens the airway (larynx, trachea), vascular structures (carotid, jugular), esophagus, and spinal cord.",
      clinicalRelevance: "Airway management in facial trauma is among the most challenging scenarios for paramedics. Massive hemorrhage, anatomic distortion, and foreign bodies (teeth, bone fragments) complicate visualization and intubation. Cervical spine precautions must be maintained throughout.",
      signsSymptoms: "Facial trauma: swelling, deformity, malocclusion, CSF rhinorrhea/otorrhea (basilar skull fracture), dental avulsions, diplopia, enophthalmos. Neck trauma: expanding hematoma, subcutaneous emphysema, tracheal deviation, hoarseness/stridor, dysphagia, active hemorrhage, air bubbling from wound.",
      assessment: "Airway assessment is priority: Can the patient protect their airway? Is there blood/fluid/foreign material in the airway? Is there progressive swelling? Assess for CSF leak (halo sign on gauze). Check midface stability (Le Fort). Neck assessment: check for expanding hematoma, subcutaneous emphysema, carotid bruit. Cervical spine precautions for all significant facial/neck trauma.",
      management: "Airway management: suction aggressively, position to facilitate drainage (if no c-spine concern), prepare for difficult airway (have surgical airway kit ready). Hemorrhage control: direct pressure for external bleeding, nasal packing for epistaxis. Cover open neck wounds with occlusive dressing (prevent air embolism). Stabilize impaled objects. Manage avulsed teeth (transport in milk or saline for reimplantation). C-spine immobilization.",
      complications: "Airway obstruction (most immediate threat), aspiration of blood/teeth/bone fragments, uncontrolled hemorrhage (facial arteries have rich blood supply), air embolism (from open neck wounds), cervical spine injury, globe rupture (eye), CSF leak and meningitis, cranial nerve injury, and cosmetic/functional deformity.",
      pearls: [
        "Always have a surgical airway kit immediately available when managing facial trauma — conventional intubation may be impossible due to anatomic distortion and hemorrhage",
        "Cover open neck wounds with an occlusive dressing — air embolism from exposed jugular veins can be rapidly fatal",
        "Allow the patient to sit upright and lean forward if possible (and c-spine is cleared) — this facilitates drainage of blood away from the airway",
        "Save avulsed teeth in milk, saline, or the patient's saliva — reimplantation is most successful within 1 hour"
      ],
      pitfalls: [
        "Nasotracheal intubation or NG tube placement in suspected midface fractures — risk of tube entering the cranial vault through a cribriform plate fracture",
        "Removing impaled objects from the neck — this can cause uncontrolled hemorrhage from major vessels; stabilize in place",
        "Not recognizing expanding neck hematoma as a surgical emergency — progressive swelling can rapidly compromise the airway",
        "Focusing on dramatic-appearing facial injuries while missing life-threatening hemorrhage or airway compromise"
      ],
      faq: [
        { question: "When should you suspect a Le Fort fracture?", answer: "Le Fort fractures are maxillary fractures occurring in three patterns. Le Fort I: fracture across the maxilla above the teeth (floating palate). Le Fort II: pyramidal fracture through the maxilla and nasal bridge (floating maxilla). Le Fort III: complete craniofacial dissociation (floating face). Suspect Le Fort fractures with midface instability, malocclusion, and significant facial swelling after blunt trauma. Grasp the upper teeth and gently attempt to move the maxilla — mobility confirms a Le Fort fracture." },
        { question: "Why are neck wounds covered with occlusive dressings?", answer: "Open neck wounds that involve the jugular veins can allow air to enter the venous system (venous air embolism). Negative intrathoracic pressure during inspiration can draw air into severed veins, which then travels to the right heart and pulmonary vasculature, causing obstruction to blood flow and cardiovascular collapse. An occlusive dressing prevents air entrainment while allowing hemorrhage control." }
      ],
      keywords: ["facial trauma paramedic", "neck injury management", "Le Fort fractures", "difficult airway trauma", "penetrating neck injury"],
      related: ["difficult-airway-management", "surgical-cricothyrotomy", "traumatic-brain-injury", "spinal-cord-injury"]
    },

    {
      title: "Blast Injuries",
      category: "Trauma",
      overview: "Blast injuries result from explosive detonations and produce a unique pattern of trauma through multiple mechanisms. They are classified into primary (pressure wave), secondary (projectiles), tertiary (body displacement), and quaternary (burns, inhalation, crush) injuries. Mass casualty events involving explosives require specialized assessment skills.",
      mechanism: "Primary: the blast overpressure wave damages air-filled organs (lungs, ears, GI tract). Secondary: fragmentation and debris act as projectiles causing penetrating injuries. Tertiary: the blast wind physically displaces the body, causing blunt trauma. Quaternary: burns from the fireball, inhalation of toxic gases, and structural collapse causing crush injuries.",
      clinicalRelevance: "Blast lung injury is the most lethal primary blast injury and presents similarly to pulmonary contusion. Tympanic membrane rupture is the most sensitive indicator of primary blast exposure. Paramedics must recognize the multi-mechanism nature of blast injuries and perform thorough assessments.",
      signsSymptoms: "Primary blast: tympanic membrane rupture (ear pain, hearing loss, bleeding from ear canal), blast lung (dyspnea, cough, hemoptysis, chest tightness), GI injury (abdominal pain, nausea). Secondary: penetrating wounds from fragments. Tertiary: blunt trauma patterns (fractures, TBI, internal injuries). Quaternary: burns, inhalation injury, crush injuries.",
      assessment: "Tympanic membrane assessment (otoscopy if available — rupture indicates significant blast exposure). Pulmonary assessment for blast lung: lung sounds, SpO2, work of breathing, hemoptysis. Abdominal assessment for hollow viscus injury. Full trauma assessment for secondary and tertiary injuries. Consider internal injuries even without external wounds (primary blast damage).",
      management: "Apply standard trauma management principles with specific blast considerations. Blast lung: supplemental oxygen, judicious positive pressure ventilation (risk of pneumothorax), needle decompression if tension pneumothorax develops. Hemorrhage control for penetrating fragment injuries. Burns management. Avoid unnecessary positive pressure ventilation in blast lung. Be prepared for delayed presentation of GI injuries.",
      complications: "Blast lung (ARDS-like presentation), tension pneumothorax from positive pressure ventilation in blast lung patients, air embolism (unique to blast lung — air enters pulmonary vasculature through damaged alveoli), GI perforation with delayed presentation, TBI, traumatic amputation, and psychological trauma. Air embolism is a rare but devastating complication of blast lung.",
      pearls: [
        "Tympanic membrane rupture is the most sensitive indicator of primary blast exposure — check ears on all blast patients",
        "Patients with blast lung are at HIGH risk for pneumothorax with positive pressure ventilation — ventilate carefully with low pressures and volumes",
        "Internal injuries from primary blast can occur WITHOUT external wounds — the blast wave damages air-filled organs through the intact body wall",
        "Blast patients are multi-mechanism trauma patients — systematically assess for primary, secondary, tertiary, and quaternary injury patterns"
      ],
      pitfalls: [
        "Aggressively ventilating a blast lung patient — positive pressure can cause pneumothorax or air embolism in damaged lungs",
        "Missing primary blast injuries because external wounds are absent — blast wave damage is internal and may not be immediately apparent",
        "Focusing only on visible fragment injuries (secondary blast) and missing blast lung or abdominal injuries (primary blast)",
        "Not monitoring for delayed GI perforation — patients with significant blast exposure should be observed even if initially stable"
      ],
      faq: [
        { question: "What is blast lung and how is it managed?", answer: "Blast lung is the most lethal primary blast injury. The blast overpressure wave damages the alveolar-capillary interface, causing alveolar hemorrhage, pulmonary contusion, and pneumothorax. Patients present with dyspnea, hemoptysis, and hypoxia. Management includes supplemental oxygen and very cautious positive pressure ventilation with low tidal volumes and pressures. Aggressive PPV can cause tension pneumothorax or air embolism. Have equipment ready for needle decompression." },
        { question: "How do you triage blast victims with multiple mechanisms of injury?", answer: "Use the standard START triage system but be aware that blast patients may have occult primary blast injuries. Walking wounded may have significant blast lung or GI injuries that present later. Tympanic membrane assessment helps stratify blast exposure risk. Patients with TM rupture had significant blast exposure and should be assessed for occult primary injuries even if they appear well initially." }
      ],
      keywords: ["blast injuries paramedic", "blast lung injury", "explosion trauma", "primary blast injury", "mass casualty triage blast"],
      related: ["tension-pneumothorax", "chest-trauma", "traumatic-brain-injury", "start-triage-system"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Medical Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Diabetic Emergencies",
      category: "Medical Emergencies",
      overview: "Diabetic emergencies include hypoglycemia, diabetic ketoacidosis (DKA), and hyperosmolar hyperglycemic state (HHS). Hypoglycemia is the most common and most immediately life-threatening diabetic emergency in the prehospital setting, while DKA and HHS are complex metabolic derangements requiring hospital management.",
      mechanism: "Hypoglycemia occurs when blood glucose falls below 70 mg/dL, depriving the brain of its primary fuel. DKA develops in Type 1 diabetes when insulin deficiency leads to uninhibited lipolysis, producing ketoacids that cause metabolic acidosis. HHS occurs in Type 2 diabetes when severe hyperglycemia causes osmotic diuresis leading to profound dehydration without significant ketoacidosis.",
      clinicalRelevance: "Hypoglycemia is one of the most common EMS calls and is completely reversible with prompt treatment. DKA and HHS present as medical emergencies that mimic other conditions (stroke, sepsis, intoxication). The paramedic must rapidly distinguish between hypo- and hyperglycemic emergencies, as treatment is completely different.",
      signsSymptoms: "Hypoglycemia: altered mental status, diaphoresis, tachycardia, tremors, seizures, combativeness, confusion, and coma. DKA: polyuria, polydipsia, nausea/vomiting, abdominal pain, Kussmaul respirations (deep, rapid), fruity breath odor, dehydration, and altered mental status. HHS: profound dehydration, altered mental status, focal neurological deficits (can mimic stroke), and extremely high glucose (>600 mg/dL).",
      assessment: "Blood glucose measurement is essential for ANY patient with altered mental status. Hypoglycemia: BGL <70 mg/dL. DKA: BGL >250 with Kussmaul breathing, ketone smell, dehydration. HHS: BGL >600, severe dehydration, altered mental status. Assess hydration status, level of consciousness, respiratory pattern, and hemodynamic stability.",
      management: "Hypoglycemia: Conscious patient — oral glucose (glucose gel, juice). Altered consciousness — Dextrose 50% 25g IV (D50), or Glucagon 1mg IM if no IV access. Recheck glucose after treatment. DKA/HHS: IV normal saline fluid resuscitation (1-2L bolus, then 250-500 mL/hr), cardiac monitoring (hyperkalemia risk in DKA), airway management for obtunded patients. Do NOT give insulin prehospitally for DKA/HHS.",
      complications: "Hypoglycemia: seizures, permanent brain injury, death. DKA: cerebral edema (especially with rapid correction), hypokalemia during treatment, ARDS, arrhythmias from electrolyte imbalances. HHS: thrombotic events (DVT, PE, stroke), rhabdomyolysis, seizures. Both DKA and HHS have significant mortality rates (DKA 1-5%, HHS 5-20%).",
      pearls: [
        "When in doubt, check blood glucose — altered mental status from hypoglycemia is completely reversible with treatment, and delay causes brain injury",
        "Glucagon IM is effective for hypoglycemia when IV access is unavailable, but takes 10-15 minutes to work and may be ineffective in malnourished or alcoholic patients (depleted glycogen stores)",
        "DKA patients may have falsely elevated potassium despite total body potassium depletion — correction of acidosis will shift potassium intracellularly, potentially causing dangerous hypokalemia",
        "Kussmaul respirations in DKA are compensatory — do NOT attempt to slow the respiratory rate with sedation or overventilation"
      ],
      pitfalls: [
        "Not checking blood glucose in every patient with altered mental status — hypoglycemia mimics stroke, intoxication, and psychiatric emergencies",
        "Giving insulin prehospitally for DKA — rapid glucose correction can cause cerebral edema and hypokalemia; leave insulin to the hospital",
        "Administering D50 through a small or infiltrated IV — D50 is extremely hypertonic and causes severe tissue necrosis if it extravasates",
        "Assuming Kussmaul respirations are a primary respiratory problem — deep, rapid breathing in DKA is compensatory for metabolic acidosis"
      ],
      faq: [
        { question: "Why can DKA patients have normal or even high potassium levels despite total body potassium depletion?", answer: "In DKA, acidosis causes potassium to shift from inside cells to the extracellular space in exchange for hydrogen ions. Additionally, insulin deficiency prevents potassium from entering cells, and osmotic diuresis causes renal potassium wasting. The result is total body potassium depletion masked by a normal or elevated serum potassium. When insulin is given in the hospital, potassium rapidly shifts intracellularly, potentially causing life-threatening hypokalemia. This is why potassium is closely monitored and often supplemented during DKA treatment." },
        { question: "When should you give D10 instead of D50?", answer: "D10 (10% dextrose) is increasingly preferred over D50 (50% dextrose) because it is less hypertonic, causes less tissue damage if extravasated, produces a more gradual glucose correction, and can be given through peripheral IVs with less risk. Give D10 100-200 mL IV for hypoglycemia. D50 should be reserved for severe hypoglycemia with seizures or when rapid correction is needed. Many EMS systems are transitioning entirely to D10." }
      ],
      keywords: ["diabetic emergencies paramedic", "hypoglycemia management", "DKA treatment EMS", "diabetic ketoacidosis", "HHS hyperosmolar"],
      related: ["altered-mental-status", "seizure-management", "hyperkalemia", "sepsis-and-septic-shock"]
    },

    {
      title: "Stroke Assessment and Management",
      category: "Medical Emergencies",
      overview: "Stroke is an acute cerebrovascular event that disrupts blood supply to the brain, causing neurological deficits. Ischemic stroke (87% of strokes) results from arterial occlusion, while hemorrhagic stroke (13%) results from vessel rupture. Stroke is the leading cause of disability and the fifth leading cause of death in the United States.",
      mechanism: "Ischemic stroke occurs when a thrombus (local clot formation) or embolus (clot from a distant source, usually the heart) occludes a cerebral artery. The resulting ischemia creates a core of infarction surrounded by a penumbra of threatened but potentially salvageable tissue. Hemorrhagic stroke occurs when a weakened vessel ruptures (intracerebral hemorrhage) or an aneurysm bursts (subarachnoid hemorrhage).",
      clinicalRelevance: "Paramedic recognition and rapid transport of stroke patients directly impacts outcomes. The concept of 'time is brain' drives prehospital stroke management — approximately 1.9 million neurons die every minute during an untreated ischemic stroke. Establishing a last known normal (LKN) time is critical for determining thrombolytic and thrombectomy eligibility.",
      signsSymptoms: "Use stroke screening tools (Cincinnati/Los Angeles Prehospital Stroke Screen). Classic presentations: sudden onset facial droop, arm weakness/drift, speech abnormality (slurring, aphasia), sudden severe headache (hemorrhagic), vision changes, gait disturbance, dizziness/vertigo. Remember: stroke symptoms are SUDDEN in onset — gradual onset suggests other pathology.",
      assessment: "Perform validated stroke screening: Cincinnati Prehospital Stroke Screen (facial droop, arm drift, speech abnormality) or LAMS/RACE for large vessel occlusion. Establish last known normal time (when the patient was last seen without symptoms). Check blood glucose (hypoglycemia mimics stroke). Obtain baseline neurological exam. Consider large vessel occlusion (LVO) screening for patients eligible for mechanical thrombectomy.",
      management: "Activate stroke alert and transport to the nearest stroke center (or comprehensive stroke center for suspected LVO). Establish the last known normal time. Maintain airway and oxygenation (target SpO2 >94%). Elevate head of bed 30 degrees. Establish IV access (do not delay transport for IV). Obtain blood glucose. Do NOT lower blood pressure unless >220/120 (ischemic) or >180/110 (hemorrhagic, if known). Do NOT give aspirin prehospitally.",
      complications: "Ischemic stroke: hemorrhagic conversion (especially after thrombolytics), cerebral edema, herniation, aspiration pneumonia, DVT/PE, and post-stroke depression. Hemorrhagic stroke: rebleeding, hydrocephalus, herniation, vasospasm (subarachnoid hemorrhage), and seizures. Thrombolytic complications: intracranial hemorrhage (6-7% risk).",
      pearls: [
        "Time is brain — every minute of untreated ischemic stroke kills approximately 1.9 million neurons; minimize on-scene time and transport rapidly to a stroke center",
        "Establish the LAST KNOWN NORMAL time, not the time symptoms were first noticed — if the patient woke up with symptoms, the LKN is when they were last seen normal before sleep",
        "Always check blood glucose — hypoglycemia can perfectly mimic stroke and is easily reversible",
        "Do NOT lower blood pressure in suspected ischemic stroke unless >220/120 — the hypertension is a compensatory mechanism to maintain cerebral perfusion around the ischemic penumbra"
      ],
      pitfalls: [
        "Delaying transport to start IVs or perform extensive assessment — stroke patients need a CT scan and potential thrombolysis, both of which can only happen at the hospital",
        "Recording symptom onset time instead of last known normal time — thrombolytic eligibility is based on LKN, not onset",
        "Lowering blood pressure in ischemic stroke — this reduces perfusion to the ischemic penumbra and worsens the infarct",
        "Giving aspirin prehospitally for suspected stroke — hemorrhagic stroke cannot be excluded without CT, and aspirin worsens hemorrhage"
      ],
      faq: [
        { question: "What is the difference between last known normal and symptom onset?", answer: "Last known normal (LKN) is the last time the patient was observed to be neurologically normal. Symptom onset is when symptoms were first noticed. These may differ — for example, a patient who goes to sleep at 10 PM and wakes at 6 AM with deficits has an LKN of 10 PM, not 6 AM. This is critical because thrombolytic eligibility is based on LKN, not onset. The standard tPA window is 4.5 hours from LKN, and mechanical thrombectomy may extend to 24 hours with imaging selection." },
        { question: "What is a large vessel occlusion and why does it matter?", answer: "A large vessel occlusion (LVO) is a clot blocking one of the major cerebral arteries (internal carotid, MCA M1/M2, basilar). LVO strokes are more severe, cause more disability, and are eligible for mechanical thrombectomy (catheter-based clot retrieval) which is only available at comprehensive stroke centers. Prehospital LVO screening tools (RACE, LAMS) help identify these patients so they can be transported directly to a thrombectomy-capable facility, bypassing primary stroke centers." }
      ],
      keywords: ["stroke assessment paramedic", "ischemic stroke management", "prehospital stroke screening", "time is brain", "last known normal stroke"],
      related: ["altered-mental-status", "increased-intracranial-pressure", "seizure-management", "hypertensive-emergency"]
    },

    {
      title: "Abdominal Aortic Aneurysm",
      category: "Medical Emergencies",
      overview: "Abdominal aortic aneurysm (AAA) is a focal dilation of the abdominal aorta exceeding 3 cm in diameter. Ruptured AAA is a catastrophic emergency with an overall mortality rate exceeding 80%. Prehospital recognition and rapid surgical transport are essential for the small chance of survival.",
      mechanism: "AAA develops from degenerative weakening of the aortic wall, most commonly from atherosclerosis. The weakened wall dilates under arterial pressure. Rupture occurs when wall stress exceeds wall strength, typically at diameters >5.5 cm. Rupture may be contained (retroperitoneal — temporarily tamponaded) or free (intraperitoneal — rapidly fatal). Risk factors include age >65, male sex, smoking, hypertension, and family history.",
      clinicalRelevance: "Ruptured AAA is a time-critical surgical emergency that paramedics must rapidly identify and transport. It is commonly misdiagnosed as renal colic, musculoskeletal pain, or GI pathology. The classic triad of sudden abdominal/back pain, hypotension, and pulsatile abdominal mass is present in only 50% of cases.",
      signsSymptoms: "Classic triad (present in ~50%): sudden severe abdominal or back pain, hypotension, and pulsatile abdominal mass. Other presentations: flank pain mimicking renal colic, syncope, groin or thigh pain (from retroperitoneal blood tracking), and unexplained shock in an elderly patient. Contained rupture may present with stable vitals initially that deteriorate suddenly.",
      assessment: "Suspect ruptured AAA in any elderly patient with sudden abdominal or back pain and hemodynamic instability. Palpate for a pulsatile abdominal mass (do NOT palpate aggressively if AAA is suspected). Assess hemodynamic status: blood pressure, heart rate, skin signs. Check femoral and pedal pulses bilaterally (asymmetry may indicate dissection).",
      management: "Rapid transport to a surgical center is the ONLY definitive treatment. Establish bilateral large-bore IV access en route. Permissive hypotension (target SBP 80-90 mmHg) — aggressive fluid resuscitation can increase bleeding. Prepare for cardiovascular collapse. Consider blood products if available. Minimize scene time. Do NOT delay transport for interventions that cannot fix the problem.",
      complications: "Death (80% overall mortality for ruptured AAA), hemorrhagic shock, renal failure from aortic cross-clamping, lower extremity ischemia, bowel ischemia, spinal cord ischemia (paraplegia), DIC, multi-organ failure, and surgical complications (graft infection, anastomotic leak).",
      pearls: [
        "Think of ruptured AAA in ANY elderly patient with sudden back or abdominal pain and hemodynamic instability — it is frequently misdiagnosed",
        "The classic triad of pain, hypotension, and pulsatile mass is present in only about 50% of cases — do not rely on it to exclude the diagnosis",
        "Permissive hypotension (SBP 80-90) is appropriate — aggressive fluid resuscitation increases aortic pressure and can rupture the retroperitoneal tamponade",
        "Time to the operating room is the single most important factor in survival — minimize scene time and transport rapidly"
      ],
      pitfalls: [
        "Misdiagnosing ruptured AAA as renal colic — both cause acute back/flank pain, but AAA causes hemodynamic instability",
        "Aggressively resuscitating with IV fluids — this can increase aortic pressure and convert a contained rupture to a free rupture",
        "Spending time on scene for assessment and treatment — the only treatment is surgery; minimize scene time",
        "Not considering AAA in patients who present with syncope without obvious cause — ruptured AAA can present as syncope from transient hypotension"
      ],
      faq: [
        { question: "Why is permissive hypotension used in ruptured AAA?", answer: "In ruptured AAA, the bleeding may be temporarily contained by retroperitoneal tamponade. Raising the blood pressure with aggressive fluid resuscitation increases the pressure gradient across the rupture site, which can dislodge the tamponade and convert a contained rupture into free intraperitoneal hemorrhage. Maintaining a lower target BP (SBP 80-90) preserves the tamponade while maintaining minimum perfusion." },
        { question: "What is the difference between AAA and aortic dissection?", answer: "AAA is a focal dilation of the aorta that may rupture, causing hemorrhage. Aortic dissection is a tear in the aortic intima creating a false lumen, which can propagate and occlude branch vessels. AAA typically presents with sudden abdominal/back pain and shock. Dissection typically presents with acute tearing chest/back pain with possible pulse deficits and BP asymmetry. Both are catastrophic emergencies requiring rapid surgical intervention." }
      ],
      keywords: ["abdominal aortic aneurysm paramedic", "ruptured AAA management", "aortic aneurysm emergency", "pulsatile abdominal mass", "AAA rupture EMS"],
      related: ["hemorrhagic-shock", "acute-abdomen", "aortic-emergencies", "shock-assessment-and-classification"]
    },

    {
      title: "Anaphylaxis Management",
      category: "Medical Emergencies",
      overview: "Anaphylaxis is a severe, potentially fatal systemic allergic reaction involving multiple organ systems. It is mediated by immunoglobulin E (IgE) causing widespread mast cell and basophil degranulation. Epinephrine is the first-line and most important treatment — delay in epinephrine administration is the primary contributor to anaphylaxis death.",
      mechanism: "In sensitized individuals, re-exposure to an allergen triggers IgE-mediated mast cell and basophil degranulation, releasing histamine, leukotrienes, prostaglandins, and other inflammatory mediators. These cause widespread vasodilation, increased vascular permeability, bronchoconstriction, and mucosal edema. The result is distributive shock, airway obstruction, or both.",
      clinicalRelevance: "Anaphylaxis is a time-critical emergency where early epinephrine saves lives. The most common cause of death in anaphylaxis is delayed or absent epinephrine administration. Biphasic reactions (recurrence 1-72 hours later) occur in up to 20% of cases, requiring extended monitoring.",
      signsSymptoms: "Rapid onset (minutes to hours) involving two or more organ systems: Skin/mucosal (urticaria, flushing, angioedema — present in 90%), Respiratory (wheezing, stridor, dyspnea, throat tightness), Cardiovascular (hypotension, tachycardia, syncope), GI (nausea, vomiting, diarrhea, abdominal pain). Anaphylaxis can occur WITHOUT skin findings (especially with IV medication reactions).",
      assessment: "Rapid assessment of ABCs. Identify causative agent if possible (food, medication, insect sting, latex). Assess airway for angioedema and stridor. Auscultate lungs for wheezing. Assess hemodynamic status. Look for urticaria and angioedema. Assess for signs of shock. Consider anaphylaxis in any patient with acute multisystem symptoms following exposure to a known allergen.",
      management: "EPINEPHRINE is the FIRST and MOST IMPORTANT treatment. Adults: Epinephrine 0.3-0.5mg IM (1:1000) into lateral thigh — repeat every 5-15 minutes as needed. Remove allergen if possible. High-flow oxygen. Place supine with legs elevated (unless respiratory distress). IV fluid bolus for hypotension (1-2L NS). Adjuncts (AFTER epinephrine): Diphenhydramine 25-50mg IV, Methylprednisolone 125mg IV, Albuterol nebulizer for bronchospasm.",
      complications: "Death from airway obstruction or cardiovascular collapse, biphasic reaction (recurrence after apparent resolution), hypoxic brain injury, cardiovascular complications from epinephrine (rare — benefits always outweigh risks in true anaphylaxis), and protracted anaphylaxis (refractory to treatment).",
      pearls: [
        "Epinephrine is THE treatment for anaphylaxis — everything else is adjunctive; NEVER delay epinephrine to give antihistamines or steroids",
        "Anaphylaxis can occur WITHOUT skin findings — absence of urticaria does not exclude the diagnosis",
        "IM injection into the lateral thigh provides faster and higher peak blood levels than SC or deltoid injection",
        "Biphasic reactions occur in up to 20% of anaphylaxis cases — always recommend extended observation (4-6 hours minimum)"
      ],
      pitfalls: [
        "Giving antihistamines or steroids INSTEAD OF epinephrine — these drugs do not reverse the acute physiological derangements of anaphylaxis",
        "Delaying epinephrine because symptoms seem 'mild' — anaphylaxis can progress from mild to fatal within minutes",
        "Not repeating epinephrine if symptoms persist or recur — multiple doses are often needed",
        "Sitting the patient upright during anaphylactic shock — supine position with legs elevated improves venous return and blood pressure"
      ],
      faq: [
        { question: "Why is epinephrine given IM instead of IV for anaphylaxis?", answer: "IM epinephrine (1:1000, 0.3-0.5mg) into the lateral thigh is the standard prehospital route because it is faster to administer, has predictable absorption, and is safer than IV push. IV epinephrine (1:10,000) is reserved for cardiac arrest or severe refractory anaphylaxis with cardiovascular collapse, and must be given slowly with cardiac monitoring due to the risk of arrhythmias. The IM route provides peak blood levels within 5-10 minutes." },
        { question: "What is biphasic anaphylaxis?", answer: "Biphasic anaphylaxis is the recurrence of anaphylactic symptoms after initial resolution, occurring 1-72 hours (usually 8-10 hours) after the initial reaction, without re-exposure to the allergen. It occurs in up to 20% of anaphylaxis cases and can be as severe as or more severe than the initial reaction. This is why emergency department observation for 4-6 hours after anaphylaxis treatment is recommended." }
      ],
      keywords: ["anaphylaxis management paramedic", "epinephrine anaphylaxis", "allergic reaction EMS", "anaphylactic shock treatment", "biphasic anaphylaxis"],
      related: ["allergic-reactions", "shock-assessment-and-classification", "epinephrine", "asthma-management"]
    },

    {
      title: "Acute Kidney Injury",
      category: "Medical Emergencies",
      overview: "Acute kidney injury (AKI) is a rapid decline in kidney function over hours to days, resulting in the accumulation of metabolic waste products and fluid/electrolyte imbalances. While definitive management occurs in the hospital, paramedics encounter AKI in the context of complications like hyperkalemia, pulmonary edema, and uremic encephalopathy.",
      mechanism: "AKI is classified by cause: Pre-renal (decreased kidney perfusion from hypovolemia, heart failure, sepsis — most common, ~55%), Intrinsic renal (direct kidney damage from nephrotoxins, glomerulonephritis, acute tubular necrosis — ~40%), and Post-renal (urinary obstruction from kidney stones, BPH, tumors — ~5%). Regardless of cause, reduced glomerular filtration leads to retention of urea, creatinine, potassium, and fluid.",
      clinicalRelevance: "Paramedics encounter AKI patients primarily through its complications: life-threatening hyperkalemia causing cardiac arrhythmias, fluid overload causing pulmonary edema, uremic encephalopathy causing altered mental status, and metabolic acidosis causing Kussmaul breathing. Recognizing AKI as the underlying cause of these presentations guides appropriate management.",
      signsSymptoms: "Decreased urine output (oliguria <400 mL/day, anuria <100 mL/day), fluid overload (peripheral edema, pulmonary edema, JVD), nausea/vomiting, altered mental status (uremic encephalopathy), asterixis (liver flap), pericardial friction rub (uremic pericarditis), uremic frost (rare), and signs of the underlying cause (dehydration, sepsis, obstruction).",
      assessment: "Assess for signs of fluid overload vs dehydration (JVD, lung sounds, peripheral edema, skin turgor). 12-lead ECG for hyperkalemia (peaked T waves, prolonged PR, widened QRS, sine wave). Check blood glucose. Assess mental status. Obtain medication history (nephrotoxic drugs — NSAIDs, ACE inhibitors, contrast dye). Consider AKI in dialysis patients who have missed treatments.",
      management: "Prehospital management focuses on treating complications. Hyperkalemia: calcium chloride for cardiac stabilization, sodium bicarbonate, albuterol nebulizer. Pulmonary edema: CPAP, nitroglycerin (cautious with hypotension), positioning. Uremic encephalopathy: supportive care, airway management. Fluid management: bolus for pre-renal (dehydration) but restrict for fluid-overloaded patients. Transport to facility with dialysis capability.",
      complications: "Hyperkalemia (most immediately life-threatening), pulmonary edema, metabolic acidosis, uremic encephalopathy, uremic pericarditis (with risk of tamponade), seizures, GI bleeding, anemia, infection (impaired immune function), and progression to chronic kidney disease or dialysis dependence.",
      pearls: [
        "Consider AKI in any dialysis patient who has missed sessions — they are at high risk for hyperkalemia and fluid overload",
        "Hyperkalemia from AKI is the most immediately life-threatening complication — always obtain an ECG and look for peaked T waves and widened QRS",
        "Pre-renal AKI (dehydration, shock) is the most common cause and is often reversible with fluid resuscitation",
        "NSAIDs, ACE inhibitors, and contrast dye are common causes of AKI — ask about recent medication use"
      ],
      pitfalls: [
        "Giving IV fluids to a fluid-overloaded AKI patient — this worsens pulmonary edema; only fluid-resuscitate if the patient is dehydrated (pre-renal AKI)",
        "Not checking an ECG for hyperkalemia in known dialysis or kidney disease patients — hyperkalemia can cause cardiac arrest without warning",
        "Missing AKI as the cause of altered mental status — uremic encephalopathy is often misdiagnosed as intoxication or psychiatric illness",
        "Administering NSAIDs for pain in patients with suspected AKI — these drugs worsen kidney function"
      ],
      faq: [
        { question: "How do you differentiate pre-renal from other causes of AKI in the field?", answer: "Pre-renal AKI is suggested by clinical signs of dehydration (dry mucous membranes, poor skin turgor, tachycardia, hypotension, flat neck veins) and a history suggesting volume loss (vomiting, diarrhea, hemorrhage, decreased intake). Intrinsic renal AKI may have a history of nephrotoxic drug exposure or systemic illness. Post-renal AKI may present with urinary retention, suprapubic fullness, or a history of kidney stones or prostate disease. In the prehospital setting, distinguish fluid-depleted from fluid-overloaded patients to guide fluid management." },
        { question: "What should a paramedic do for a dialysis patient with chest pain?", answer: "Dialysis patients are at extremely high risk for both acute MI and hyperkalemia. Obtain a 12-lead ECG immediately — look for both STEMI criteria and hyperkalemia signs (peaked T waves, widened QRS). Treat hyperkalemia if present (calcium chloride, bicarbonate). Consider fluid overload as a cause of chest pain (pulmonary edema). These patients need rapid transport to a facility with cardiology and dialysis capabilities. Be aware that dialysis patients often have an AV fistula — never take blood pressure or start an IV in the fistula arm." }
      ],
      keywords: ["acute kidney injury paramedic", "AKI management EMS", "dialysis emergency", "renal failure prehospital", "hyperkalemia AKI"],
      related: ["hyperkalemia", "congestive-heart-failure", "sepsis-and-septic-shock", "altered-mental-status"]
    },

    {
      title: "Adrenal Crisis",
      category: "Medical Emergencies",
      overview: "Adrenal crisis (acute adrenal insufficiency) is a life-threatening medical emergency caused by insufficient cortisol production, typically occurring in patients with known adrenal insufficiency who experience physiologic stress, abruptly stop corticosteroid therapy, or have bilateral adrenal hemorrhage. Without treatment, adrenal crisis rapidly progresses to cardiovascular collapse and death.",
      mechanism: "Cortisol is essential for vascular tone, glucose metabolism, and the stress response. In adrenal crisis, cortisol deficiency causes loss of vascular reactivity (profound vasodilation unresponsive to catecholamines), hypoglycemia, hyponatremia, and hyperkalemia. The most common cause is abrupt cessation of chronic corticosteroid therapy, which suppresses the hypothalamic-pituitary-adrenal axis.",
      clinicalRelevance: "Adrenal crisis is an under-recognized cause of refractory hypotension in the prehospital setting. Patients in adrenal crisis do not respond to standard fluid resuscitation or vasopressors without cortisol replacement. Paramedics must recognize this presentation, especially in patients with medical alert identification or steroid medication history.",
      signsSymptoms: "Profound hypotension refractory to fluids and vasopressors, weakness, fatigue, nausea, vomiting, abdominal pain, altered mental status, dehydration, and hypoglycemia. History of chronic steroid use, adrenal insufficiency (Addison's disease), or recent steroid discontinuation. May have hyperpigmentation (primary adrenal insufficiency). Often precipitated by illness, trauma, or surgery.",
      assessment: "History is key: ask about corticosteroid use, adrenal insufficiency diagnosis, and recent illness/stress. Look for medical alert identification. Check blood glucose (hypoglycemia is common). Assess hemodynamic status (may have refractory hypotension). Consider adrenal crisis in any patient with shock that does not respond to standard treatment.",
      management: "IV fluid resuscitation with normal saline (2-3L may be needed). Dextrose for hypoglycemia. If available in protocols: hydrocortisone 100mg IV (stress-dose steroids) or dexamethasone 4mg IV. This is the most critical intervention — vasopressors are often ineffective without cortisol replacement. If the patient carries emergency injectable steroids, assist with administration. Transport rapidly.",
      complications: "Cardiovascular collapse, cardiac arrest, death (without cortisol replacement), seizures from hypoglycemia, severe hyponatremia, hyperkalemia with cardiac effects, and multi-organ failure. Even with treatment, adrenal crisis has significant mortality if not recognized and treated promptly.",
      pearls: [
        "Think adrenal crisis when shock does not respond to fluids and vasopressors — cortisol is required for vascular reactivity to catecholamines",
        "Many adrenal crisis patients carry emergency injectable hydrocortisone — ask and assist with administration",
        "The most common cause is abrupt cessation of chronic steroid therapy — always ask about steroid use in critically ill patients",
        "Stress-dose steroids (hydrocortisone 100mg IV) can be life-saving and have essentially no short-term side effects"
      ],
      pitfalls: [
        "Not considering adrenal crisis as a cause of refractory hypotension — it is frequently missed in the prehospital setting",
        "Relying solely on fluids and vasopressors without cortisol replacement — these are ineffective without cortisol",
        "Not checking blood glucose — hypoglycemia is common in adrenal crisis and is easily treatable",
        "Assuming the patient's steroid medication is not important — abruptly stopping steroids after chronic use can trigger a crisis"
      ],
      faq: [
        { question: "Why don't vasopressors work in adrenal crisis?", answer: "Cortisol is required for vascular smooth muscle to respond to catecholamines (epinephrine, norepinephrine). In cortisol deficiency, blood vessels lose their ability to constrict in response to catecholamines, both endogenous and exogenous. This is why adrenal crisis causes vasodilatory shock that is refractory to fluid resuscitation and vasopressor administration. Once cortisol is replaced (hydrocortisone IV), vascular reactivity is restored and blood pressure typically improves dramatically." },
        { question: "Who is at risk for adrenal crisis?", answer: "The highest risk groups are: (1) Patients on chronic corticosteroids (prednisone, dexamethasone, hydrocortisone) for >3 weeks who abruptly stop or miss doses during physiologic stress. (2) Patients with primary adrenal insufficiency (Addison's disease). (3) Patients with secondary adrenal insufficiency (pituitary disease). (4) Post-surgical patients after adrenalectomy. Any physiologic stress (infection, trauma, surgery) can precipitate crisis in these patients because they cannot mount an appropriate cortisol response." }
      ],
      keywords: ["adrenal crisis paramedic", "adrenal insufficiency emergency", "steroid crisis management", "Addison disease emergency", "refractory hypotension cortisol"],
      related: ["shock-assessment-and-classification", "sepsis-and-septic-shock", "diabetic-emergencies", "altered-mental-status"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Pharmacology (additional)
    // ═══════════════════════════════════════════

    {
      title: "Adenosine",
      category: "Pharmacology",
      overview: "Adenosine is an endogenous nucleoside that acts as an ultra-short-acting AV nodal blocking agent. It is the first-line pharmacological treatment for stable supraventricular tachycardia (SVT), terminating >90% of SVTs by temporarily blocking conduction through the AV node and breaking the re-entry circuit.",
      mechanism: "Adenosine activates A1 adenosine receptors in the AV node, hyperpolarizing the cell membrane through increased potassium efflux. This slows conduction and increases the refractory period of the AV node, interrupting re-entry circuits that depend on AV nodal conduction. The drug's half-life is approximately 6 seconds, as it is rapidly taken up by red blood cells and endothelial cells.",
      clinicalRelevance: "Adenosine administration is a core paramedic skill tested on certification exams. Its ultra-short duration makes it relatively safe — even if the diagnosis is wrong, the effects resolve within seconds. However, the technique of administration is critical: it must be given as a rapid IV push followed immediately by a flush.",
      signsSymptoms: "Expected effects: brief period of AV block (may see asystole for 3-15 seconds on the monitor), facial flushing, chest pressure/pain, dyspnea, and a sense of impending doom. These are expected and self-resolving. The patient should be warned before administration. The underlying rhythm is briefly revealed during the AV block.",
      assessment: "Confirm SVT on the monitor: narrow-complex, regular tachycardia at 150-250 bpm. Ensure the patient is hemodynamically stable (unstable SVT should be cardioverted). Establish proximal IV access (antecubital fossa or higher). Ensure a three-way stopcock or Y-connector is available for rapid flush. Have resuscitation equipment available.",
      management: "First dose: 6mg rapid IV push through a large proximal vein, immediately followed by 20 mL normal saline flush. If no conversion within 1-2 minutes, give second dose: 12mg rapid IV push with flush. May give a third 12mg dose if needed. The key to success is SPEED — the drug must reach the heart before it is metabolized. Print rhythm strips before, during, and after administration.",
      complications: "Transient side effects (flushing, chest pain, dyspnea, bronchospasm) resolve within 30 seconds. Rare complications: sustained bradycardia, new arrhythmias (transient atrial fibrillation or ventricular ectopy), and bronchospasm in asthma/COPD patients. Adenosine is contraindicated in patients taking dipyridamole (prolonged effect) and should be avoided in patients with known WPW and atrial fibrillation (can cause VF).",
      pearls: [
        "Adenosine MUST be given as a rapid IV push — slow administration allows the drug to be metabolized before reaching the AV node, making it completely ineffective",
        "Use a proximal IV site (antecubital fossa or higher) and immediately follow with a 20 mL NS flush — the flush must be equally rapid",
        "Record the rhythm strip during administration — the brief AV block reveals the underlying rhythm and is diagnostically valuable even if conversion fails",
        "Warn the patient that they will feel terrible for a few seconds (chest pressure, sense of doom, flushing) — this is expected and resolves quickly"
      ],
      pitfalls: [
        "Giving adenosine too slowly — it is metabolized in seconds and MUST be given as a rapid bolus to be effective",
        "Using a distal IV site (hand or wrist) — the drug will be metabolized before reaching the heart",
        "Not having a flush ready — any delay between the drug and flush reduces efficacy",
        "Giving adenosine for wide-complex tachycardia that may be VT — while generally safe, it can cause hemodynamic deterioration in true VT"
      ],
      faq: [
        { question: "Why does adenosine cause such unpleasant side effects?", answer: "Adenosine receptors are present throughout the body, not just the heart. A1 receptors in the AV node produce the desired therapeutic effect. A2a receptors in the blood vessels cause vasodilation (flushing). Adenosine also activates C-fiber pain receptors in the lungs and heart, causing the characteristic chest pain and sense of doom. Bronchial smooth muscle adenosine receptors can trigger bronchospasm. All effects are extremely brief (seconds) because the drug is metabolized almost immediately." },
        { question: "Can adenosine be given through an IO line?", answer: "While adenosine can technically be given through an IO line, it is not recommended as a first approach because the drug's very short half-life (~6 seconds) means it may be metabolized before reaching the central circulation from a peripheral IO site. If no IV access is available and cardioversion is not indicated, some protocols allow IO adenosine at double the IV dose. However, synchronized cardioversion is generally preferred if IV access is unavailable." }
      ],
      keywords: ["adenosine paramedic", "adenosine SVT treatment", "AV nodal blocking agent", "rapid IV push technique", "supraventricular tachycardia drug"],
      related: ["supraventricular-tachycardia", "cardiac-dysrhythmias", "synchronized-cardioversion", "cardiac-monitoring-and-rhythm-interpretation"]
    },

    {
      title: "Midazolam",
      category: "Pharmacology",
      overview: "Midazolam (Versed) is a short-acting benzodiazepine widely used in EMS for sedation, anxiolysis, seizure termination, and procedural sedation. It can be administered IV, IM, IN (intranasal), and IO, making it one of the most versatile medications in the prehospital pharmacology.",
      mechanism: "Midazolam enhances the effect of the inhibitory neurotransmitter GABA (gamma-aminobutyric acid) by binding to the benzodiazepine receptor on the GABA-A receptor complex. This increases the frequency of chloride ion channel opening, resulting in neuronal hyperpolarization and central nervous system depression. Effects include sedation, anxiolysis, amnesia, muscle relaxation, and anticonvulsant activity.",
      clinicalRelevance: "Midazolam is the most commonly used benzodiazepine in EMS due to its rapid onset, short duration, water solubility (less tissue irritation than diazepam), and multiple routes of administration. Intranasal administration is particularly valuable for seizure patients without IV access.",
      signsSymptoms: "Therapeutic effects: sedation, anxiolysis, amnesia, muscle relaxation, and seizure cessation. Onset: IV 1-3 minutes, IM 5-15 minutes, IN 3-5 minutes. Duration: 30-60 minutes. Dose-related respiratory depression is the primary safety concern.",
      assessment: "Assess the indication: active seizure, agitation, need for procedural sedation, or anxiety. Check for contraindications: known hypersensitivity, acute narrow-angle glaucoma, severe respiratory depression. Establish baseline respiratory rate, SpO2, blood pressure, and level of consciousness. Ensure airway management equipment is immediately available before administration.",
      management: "Seizures: 5mg IM/IN or 2-5mg IV, may repeat. Sedation for procedures: 1-2mg IV titrated to effect. Agitation: 2-5mg IM or IV. Intranasal: use MAD (mucosal atomization device), maximum 1mL per nostril. Titrate to effect — start low and give incremental doses. Monitor respiratory status continuously. Have flumazenil available for reversal if needed.",
      complications: "Respiratory depression (most serious — dose-dependent), hypotension (especially when combined with opioids or in hypovolemic patients), paradoxical agitation (rare, more common in elderly and pediatric patients), oversedation, amnesia (therapeutic effect but can be problematic), and apnea. Risk increases significantly when combined with opioids.",
      pearls: [
        "Intranasal midazolam (via MAD device) is as effective as IV for seizure termination and can be given without IV access — use 5mg total, split between nostrils",
        "When combining midazolam with opioids, reduce the dose of BOTH medications by 50% — the synergistic respiratory depression is significant",
        "Start with the lowest effective dose and titrate up — you can always give more, but respiratory depression is hard to reverse quickly",
        "Paradoxical agitation is more common in elderly patients and children — if the patient becomes MORE agitated after midazolam, consider an alternative medication"
      ],
      pitfalls: [
        "Giving a full dose of midazolam and a full dose of opioid simultaneously — the synergistic respiratory depression can cause apnea",
        "Not monitoring respiratory status after administration — respiratory depression can develop insidiously, especially with repeated doses",
        "Using midazolam in hypotensive patients without fluid resuscitation — midazolam causes vasodilation and can worsen hypotension",
        "Administering intranasal midazolam in large volumes — maximum 1mL per nostril; excess volume is swallowed and not absorbed mucosally"
      ],
      faq: [
        { question: "How does intranasal midazolam work?", answer: "Intranasal midazolam is absorbed through the nasal mucosa directly into the bloodstream, bypassing first-pass hepatic metabolism. A mucosal atomization device (MAD) creates a fine spray that maximizes mucosal surface area contact. Onset is 3-5 minutes, slightly slower than IV but much faster than IM. Maximum volume is 1 mL per nostril — larger volumes run into the throat and are swallowed rather than absorbed. Use the concentrated formulation (5mg/mL) to keep volumes small." },
        { question: "When should flumazenil be used to reverse midazolam?", answer: "Flumazenil should be used cautiously and only for significant benzodiazepine toxicity (respiratory depression, apnea, or deep unresponsiveness). It is NOT recommended for routine reversal of therapeutic sedation. Flumazenil is contraindicated in patients with known seizure disorders, chronic benzodiazepine use (risk of precipitating withdrawal seizures), mixed overdoses with pro-convulsant drugs (TCAs), and patients with elevated ICP. Its duration is shorter than most benzodiazepines, so re-sedation can occur." }
      ],
      keywords: ["midazolam paramedic", "versed EMS administration", "benzodiazepine sedation", "intranasal midazolam seizure", "procedural sedation paramedic"],
      related: ["seizure-management", "excited-delirium", "pain-management-in-ems", "naloxone"]
    },

    {
      title: "Albuterol",
      category: "Pharmacology",
      overview: "Albuterol (salbutamol) is a selective beta-2 adrenergic agonist that is the primary bronchodilator used in EMS for acute bronchospasm. It relaxes bronchial smooth muscle, relieving wheezing and dyspnea in asthma, COPD, and other bronchospastic conditions. It also has a secondary role in treating hyperkalemia.",
      mechanism: "Albuterol selectively activates beta-2 receptors on bronchial smooth muscle, activating adenylate cyclase and increasing intracellular cAMP. This causes smooth muscle relaxation (bronchodilation), reduces mucosal edema, and improves mucociliary clearance. At higher doses, beta-2 activation also drives potassium into cells, temporarily reducing serum potassium levels.",
      clinicalRelevance: "Albuterol nebulization is one of the most common paramedic interventions. Understanding proper administration, dose timing, and assessment of response is essential. Continuous nebulization for severe bronchospasm is increasingly used in EMS. The hyperkalemia application is often overlooked but clinically important.",
      signsSymptoms: "Indications: wheezing, bronchospasm, acute asthma exacerbation, COPD exacerbation, allergic bronchospasm, and hyperkalemia. Expected effects: improved breath sounds, reduced wheezing, decreased work of breathing, improved SpO2, and tachycardia (beta-2 stimulation of the heart at higher doses).",
      assessment: "Auscultate bilateral lung sounds before and after treatment. Assess work of breathing, respiratory rate, SpO2, and the ability to speak in full sentences. Classify asthma severity: mild (speaks in sentences, SpO2 >95%), moderate (speaks in phrases, SpO2 91-95%), severe (speaks in words, SpO2 <91%, accessory muscle use), life-threatening (silent chest, cannot speak, altered LOC).",
      management: "Standard dose: 2.5mg in 3mL NS via nebulizer over 10-15 minutes. May repeat x3 or give continuous nebulization (5-15mg/hr) for severe bronchospasm. Can be given with ipratropium bromide (Atrovent) for synergistic effect. For hyperkalemia: 10-20mg continuous nebulization drives potassium intracellularly. Monitor heart rate (tachycardia is expected). Consider MDI with spacer (4-8 puffs) if nebulizer is unavailable.",
      complications: "Tachycardia, tremor, anxiety, palpitations, hypokalemia (with repeated dosing), paradoxical bronchospasm (rare), and nausea. Serious complications are rare at standard doses. In patients with cardiac disease, excessive tachycardia may provoke angina or arrhythmias. Continuous nebulization is safe when monitored.",
      pearls: [
        "A silent chest in a severe asthmatic is a sign of critical air movement — the patient may be too tight to wheeze; this is a respiratory emergency",
        "Continuous nebulization (5-15mg/hr) is more effective than intermittent treatments for severe bronchospasm — many EMS systems now authorize this",
        "Albuterol nebulization (10-20mg) is an effective adjunct for hyperkalemia — it drives potassium into cells, lowering serum K+ by 0.5-1.0 mEq/L",
        "Tachycardia after albuterol is expected and generally not dangerous — do not withhold treatment for tachycardia in a patient who needs bronchodilation"
      ],
      pitfalls: [
        "Assuming improvement in breath sounds means the patient is better — assess the PATIENT, not just the lungs; some patients improve symptomatically while still in danger",
        "Withholding albuterol because the patient is tachycardic — tachycardia from hypoxia is more dangerous than tachycardia from albuterol",
        "Not considering albuterol for hyperkalemia — it is an effective potassium-lowering agent that can be given while other treatments are prepared",
        "Only giving one treatment and waiting — severe bronchospasm often requires multiple back-to-back treatments or continuous nebulization"
      ],
      faq: [
        { question: "Can albuterol be harmful in COPD patients?", answer: "Albuterol is safe and effective in COPD exacerbations. The historic concern about 'knocking out hypoxic drive' with oxygen (not albuterol) in COPD patients is overstated — never withhold bronchodilator treatment for fear of hypercapnia. The greater danger is undertreating bronchospasm. Monitor SpO2 and titrate oxygen to 88-92% in known COPD patients, but always give albuterol for bronchospasm." },
        { question: "When should ipratropium be combined with albuterol?", answer: "Ipratropium bromide (Atrovent) is an anticholinergic bronchodilator that works synergistically with albuterol. It should be combined with albuterol for moderate-to-severe bronchospasm, particularly in COPD exacerbations and severe asthma attacks. The combination provides greater bronchodilation than either agent alone. Standard combination: albuterol 2.5mg + ipratropium 0.5mg nebulized together. Ipratropium has a slower onset (15-30 minutes) but adds additional bronchodilation." }
      ],
      keywords: ["albuterol paramedic", "bronchodilator EMS", "nebulized albuterol technique", "asthma treatment paramedic", "beta-2 agonist"],
      related: ["asthma-management", "copd-exacerbation", "hyperkalemia", "anaphylaxis-management"]
    },

    {
      title: "Morphine Sulfate",
      category: "Pharmacology",
      overview: "Morphine sulfate is an opioid analgesic and the standard against which all other opioids are measured. In EMS, it is used for pain management, acute pulmonary edema (vasodilation reduces preload), and as an adjunct in acute coronary syndromes. Its multiple effects make it a versatile prehospital medication.",
      mechanism: "Morphine binds to mu (μ) opioid receptors in the central nervous system, modulating pain perception and emotional response to pain. It also causes systemic venodilation (reducing preload), mild arteriolar dilation (reducing afterload), and reduces sympathetic nervous system activation. These cardiovascular effects make it useful in acute heart failure and ACS by reducing myocardial oxygen demand.",
      clinicalRelevance: "Morphine remains a cornerstone of prehospital pain management and cardiac care. Understanding its pharmacology, proper dosing, side effects, and reversal is essential for paramedic practice. The trend toward fentanyl for pain management has not eliminated morphine's role in specific clinical scenarios.",
      signsSymptoms: "Therapeutic effects: analgesia, anxiolysis, euphoria, venodilation, and reduced sympathetic tone. Onset: IV 3-5 minutes, IM 15-30 minutes. Peak: IV 20 minutes. Duration: 3-4 hours. Dose-related side effects: respiratory depression, hypotension, nausea, vomiting, pruritus, urinary retention, and constipation.",
      assessment: "Assess pain using a validated scale (numeric 0-10, Wong-Baker FACES for non-verbal patients). Document baseline vital signs, SpO2, respiratory rate, blood pressure, and level of consciousness. Assess for contraindications: hypotension, respiratory depression, known allergy, head injury with altered LOC (relative), and acute abdomen (relative — pain management should not be withheld for diagnostic purposes).",
      management: "Pain management: 2-4mg IV every 5-10 minutes titrated to pain relief (typical maximum 10-20mg). IM: 5-10mg if no IV access. Acute pulmonary edema: 2-4mg IV (use is declining in some systems). ACS: 2-4mg IV for pain unrelieved by nitroglycerin (use declining — fentanyl preferred by many systems). Always titrate to effect. Have naloxone immediately available. Monitor respiratory rate and SpO2 continuously.",
      complications: "Respiratory depression (most serious), hypotension (especially in hypovolemic patients), nausea and vomiting, histamine release causing flushing/urticaria/bronchospasm, pruritus, urinary retention, and decreased GI motility. Morphine releases histamine more than other opioids, making it less ideal for asthma patients and those with allergic tendencies.",
      pearls: [
        "Titrate to effect — give small doses (2mg IV) every 5 minutes rather than a single large dose; this reduces the risk of respiratory depression",
        "Morphine releases histamine, which can cause hypotension, flushing, and bronchospasm — consider fentanyl instead in patients with asthma or allergic histories",
        "The anxiolysis and preload reduction from morphine can be as beneficial as the analgesia in acute cardiac patients",
        "Morphine-induced nausea can be reduced by slow IV administration and pre-treatment with ondansetron"
      ],
      pitfalls: [
        "Giving a large bolus dose instead of titrating — this dramatically increases the risk of respiratory depression and hypotension",
        "Withholding pain medication because of concern about masking symptoms — adequate pain management does not prevent accurate assessment and reduces physiologic stress",
        "Giving morphine to a hypotensive patient without fluid resuscitation — morphine causes venodilation that can worsen hypotension",
        "Using morphine in patients with renal failure without dose adjustment — morphine's active metabolite (M6G) accumulates in renal failure, causing prolonged effects"
      ],
      faq: [
        { question: "Why is fentanyl replacing morphine in many EMS systems?", answer: "Fentanyl offers several advantages over morphine in the prehospital setting: faster onset (1-2 minutes IV vs 3-5 minutes), more predictable duration (30-60 minutes vs 3-4 hours), no histamine release (safer in asthma and allergic patients), less hypotension (no venodilation), and multiple administration routes including intranasal. However, morphine's longer duration and preload-reducing properties still make it useful for specific situations like acute pulmonary edema and extended transports." },
        { question: "Can morphine be given for abdominal pain?", answer: "Yes. The historic teaching to withhold opioid analgesics for abdominal pain to avoid 'masking the diagnosis' has been thoroughly disproven. Multiple studies show that appropriate pain management does not interfere with surgical diagnosis and actually improves patient examination cooperation. Pain management is a patient right and a paramedic responsibility. Treat pain, document the assessment, and transport." }
      ],
      keywords: ["morphine paramedic", "opioid analgesic EMS", "morphine sulfate administration", "pain management morphine", "morphine pulmonary edema"],
      related: ["pain-management-in-ems", "naloxone", "fentanyl", "acute-coronary-syndrome"]
    },

    {
      title: "Aspirin",
      category: "Pharmacology",
      overview: "Aspirin (acetylsalicylic acid) is an antiplatelet agent that is among the most important medications in the emergency treatment of acute coronary syndromes (ACS). Early aspirin administration reduces mortality in acute MI by 23%. It is one of the few medications that should be given by BLS providers for suspected cardiac chest pain.",
      mechanism: "Aspirin irreversibly inhibits cyclooxygenase (COX-1 and COX-2) enzymes, blocking the production of thromboxane A2 in platelets. Thromboxane A2 is a potent platelet aggregator and vasoconstrictor. By blocking its production, aspirin prevents new platelet aggregation, limiting thrombus growth in coronary arteries. The effect is irreversible — it lasts the lifetime of the platelet (7-10 days).",
      clinicalRelevance: "Aspirin administration for suspected ACS is one of the most evidence-supported interventions in EMS. The ISIS-2 trial demonstrated that aspirin alone reduced 30-day mortality by 23% in acute MI. Combined with thrombolytics, the benefit was additive. Chewed aspirin achieves therapeutic blood levels in 10-15 minutes, compared to 60+ minutes when swallowed whole.",
      signsSymptoms: "Indications: suspected acute coronary syndrome (chest pain, pressure, tightness), acute MI, and unstable angina. Contraindications: known aspirin allergy (true allergy, not GI upset), active GI bleeding, recent hemorrhagic stroke, and severe bleeding disorders. Aspirin allergy is rare but can cause anaphylaxis in sensitized individuals.",
      assessment: "Assess for ACS symptoms: chest pain/pressure, dyspnea, diaphoresis, nausea, and radiating pain. Obtain 12-lead ECG. Ask specifically about aspirin allergy — distinguish true allergy from GI side effects. Check for contraindications: active bleeding, recent surgery, stroke symptoms (hemorrhagic stroke must be excluded). Determine if the patient has already taken aspirin.",
      management: "Dose: 324mg (four 81mg baby aspirin) chewed and swallowed for suspected ACS. CHEWING is essential — it accelerates absorption and achieves therapeutic levels in 10-15 minutes vs 60+ minutes swallowed whole. Give as early as possible in suspected ACS. If the patient has already taken aspirin today, do not repeat. Document time of administration.",
      complications: "GI upset (most common), GI bleeding (rare with single dose), allergic reaction (rare but can be severe/anaphylactic), Reye syndrome (concern in children — not relevant to ACS dosing in adults), and increased bleeding risk (concern if patient subsequently requires surgery or has hemorrhagic stroke).",
      pearls: [
        "Aspirin MUST be CHEWED — this achieves therapeutic antiplatelet levels in 10-15 minutes; swallowing whole takes 60+ minutes",
        "Use four 81mg baby aspirin rather than one 325mg tablet — baby aspirin is easier to chew and dissolves faster",
        "Aspirin reduces ACS mortality by 23% independently — it is one of the most impactful single interventions in emergency cardiac care",
        "Give aspirin as early as possible — delay reduces the benefit; BLS providers should give aspirin before ALS arrival"
      ],
      pitfalls: [
        "Having the patient swallow aspirin whole instead of chewing — therapeutic onset is delayed from 10 minutes to over 60 minutes",
        "Not giving aspirin because the patient takes it daily — daily low-dose aspirin may not provide acute antiplatelet effect; give the full 324mg",
        "Confusing GI upset from aspirin with true allergy — GI intolerance is not a contraindication; true allergy (anaphylaxis, angioedema) is",
        "Giving aspirin to a patient with suspected stroke — hemorrhagic stroke must be excluded by CT before aspirin is appropriate"
      ],
      faq: [
        { question: "Why is aspirin chewed instead of swallowed?", answer: "Chewing breaks the aspirin tablet into smaller particles, dramatically increasing the surface area available for absorption. Chewed aspirin is absorbed in the stomach and reaches therapeutic blood levels in 10-15 minutes. Swallowed whole, the intact tablet must dissolve in gastric acid before absorption, delaying therapeutic levels to 60+ minutes. In ACS, rapid platelet inhibition is critical to prevent ongoing thrombus formation." },
        { question: "Can aspirin be given if the patient has an aspirin allergy?", answer: "True aspirin allergy (urticaria, angioedema, bronchospasm, anaphylaxis) is an absolute contraindication. These patients should receive other antiplatelet agents in the hospital (clopidogrel, ticagrelor). However, many patients who report 'aspirin allergy' actually have GI intolerance (upset stomach, heartburn), which is NOT a true allergy and is NOT a contraindication in a life-threatening ACS situation. Clarify the nature of the 'allergy' before withholding this life-saving medication." }
      ],
      keywords: ["aspirin paramedic", "aspirin ACS treatment", "antiplatelet therapy EMS", "aspirin myocardial infarction", "chewed aspirin protocol"],
      related: ["acute-myocardial-infarction", "acute-coronary-syndrome", "12-lead-ecg-interpretation", "nitroglycerin"]
    },

    {
      title: "Ketamine",
      category: "Pharmacology",
      overview: "Ketamine is a dissociative anesthetic with analgesic, amnestic, and bronchodilatory properties. Its unique mechanism of action and hemodynamic stability profile make it increasingly popular in EMS for pain management, procedural sedation, excited delirium, and refractory bronchospasm.",
      mechanism: "Ketamine is a non-competitive NMDA (N-methyl-D-aspartate) receptor antagonist that blocks glutamate, the primary excitatory neurotransmitter in the CNS. This produces a dissociative state — the patient appears awake but is disconnected from their environment. Unlike other sedatives, ketamine maintains protective airway reflexes, spontaneous breathing, and cardiovascular stability (it stimulates sympathetic nervous system activity).",
      clinicalRelevance: "Ketamine is revolutionizing prehospital pain management and sedation due to its unique property of providing profound analgesia and sedation while maintaining hemodynamic stability and respiratory drive. It is now included in many paramedic formularies for pain management, excited delirium, and RSI.",
      signsSymptoms: "Low-dose analgesia (0.1-0.3 mg/kg): pain relief with minimal dissociation, nystagmus, mild sedation. Dissociative dose (1-2 mg/kg IV): cataleptic state, nystagmus, lacrimation, salivation, random purposeless movements. Emergence reactions: vivid dreams, hallucinations, agitation (10-30% of adults). Eyes may remain open during dissociation.",
      assessment: "Assess the indication: pain management, excited delirium/severe agitation, procedural sedation, or refractory bronchospasm. Relative contraindications: age <3 months, psychotic disorders, uncontrolled hypertension, pre-eclampsia/eclampsia, and conditions where elevated ICP is a concern (though this contraindication is increasingly debated). Establish baseline vitals.",
      management: "Analgesia: 0.1-0.3 mg/kg IV slowly over 1-2 minutes, or 0.5-1 mg/kg IM, or 1 mg/kg IN. Dissociative sedation: 1-2 mg/kg IV or 3-5 mg/kg IM. Excited delirium: 4-5 mg/kg IM (higher dose needed due to catecholamine surge). Onset: IV 30-60 seconds, IM 3-5 minutes. Duration: IV 15-20 minutes, IM 25-30 minutes. Consider midazolam co-administration to reduce emergence reactions.",
      complications: "Emergence reactions/delirium (most common in adults 10-30%), laryngospasm (rare, 0.3%), hypersalivation, nystagmus, transient hypertension and tachycardia, emesis, and ICP elevation (clinically debated). Emergence reactions can be reduced with concurrent benzodiazepine administration. Laryngospasm is the most serious complication and requires immediate BVM ventilation or intubation.",
      pearls: [
        "Sub-dissociative ketamine (0.1-0.3 mg/kg IV) provides excellent analgesia with minimal side effects — it is increasingly used as a first-line analgesic in EMS",
        "Ketamine maintains hemodynamic stability through sympathetic stimulation — making it the sedative of choice for hypotensive patients",
        "Ketamine preserves airway reflexes and respiratory drive — unlike all other sedatives, making it safer for prehospital sedation",
        "Co-administer midazolam 2mg IV/IM to reduce emergence reactions in adults — this significantly reduces agitation during recovery"
      ],
      pitfalls: [
        "Pushing ketamine IV too rapidly — fast injection causes transient apnea; give slowly over 1-2 minutes",
        "Not anticipating emergence reactions — have midazolam ready and a quiet environment prepared for patient recovery",
        "Using sedation-dose ketamine when only analgesia is needed — low-dose (0.1-0.3 mg/kg) provides excellent pain relief without dissociation",
        "Not monitoring hypersalivation — while ketamine preserves airway reflexes, excessive secretions can cause laryngospasm; consider atropine co-administration"
      ],
      faq: [
        { question: "Does ketamine increase intracranial pressure?", answer: "Historically, ketamine was absolutely contraindicated in head injury due to concerns about ICP elevation. However, recent evidence shows that ketamine does NOT significantly increase ICP in ventilated patients with adequate cerebral perfusion, and may actually be neuroprotective. Many trauma centers and EMS systems now use ketamine for sedation and analgesia in head-injured patients, particularly when hemodynamic stability is important. Follow your local protocols." },
        { question: "What is the difference between dissociative and sub-dissociative ketamine?", answer: "Sub-dissociative doses (0.1-0.3 mg/kg IV) provide analgesia and mild sedation without the full dissociative state — the patient remains interactive and responsive. Dissociative doses (1-2 mg/kg IV) produce a cataleptic trance where the patient appears awake (eyes often open) but is disconnected from their environment and does not respond to stimuli. Sub-dissociative doses are used for pain management; dissociative doses are used for procedural sedation and severe agitation." }
      ],
      keywords: ["ketamine paramedic", "dissociative anesthetic EMS", "sub-dissociative ketamine", "ketamine pain management", "ketamine excited delirium"],
      related: ["pain-management-in-ems", "excited-delirium", "midazolam", "rapid-sequence-intubation"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Pediatric Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Pediatric Respiratory Emergencies",
      category: "Pediatric Emergencies",
      overview: "Respiratory emergencies are the leading cause of cardiac arrest in children, making airway and respiratory management the single most important pediatric paramedic skill. Children have unique anatomical and physiological differences that affect assessment and management of respiratory distress, failure, and arrest.",
      mechanism: "Pediatric respiratory emergencies arise from upper airway obstruction (croup, epiglottitis, foreign body), lower airway disease (asthma, bronchiolitis), lung tissue disease (pneumonia), and disordered control of breathing (apnea, seizures). Children decompensate more rapidly than adults due to higher metabolic rate, smaller functional residual capacity, and greater oxygen consumption per kilogram.",
      clinicalRelevance: "The sequence in pediatric cardiac arrest is typically: respiratory problem → respiratory failure → bradycardia → cardiac arrest. Recognizing and treating respiratory distress BEFORE it progresses to failure and arrest is the key to pediatric survival. Most pediatric cardiac arrests are preceded by progressive respiratory deterioration.",
      signsSymptoms: "Respiratory distress: tachypnea, nasal flaring, retractions (intercostal, subcostal, suprasternal, supraclavicular), grunting, head bobbing (infants), accessory muscle use, wheezing, stridor. Respiratory failure: decreased/absent breath sounds, altered mental status, bradycardia, cyanosis, decreasing respiratory effort (ominous — indicates exhaustion). Apnea/arrest: absent breathing, bradycardia, unresponsive.",
      assessment: "Use the Pediatric Assessment Triangle: Appearance (tone, interactiveness, consolability, look/gaze, speech/cry), Work of Breathing (retractions, nasal flaring, positioning, audible sounds), Circulation to Skin (pallor, mottling, cyanosis). Classify as respiratory distress, respiratory failure, or respiratory arrest. Identify the etiology: upper vs lower airway, lung tissue vs disordered control.",
      management: "Respiratory distress: position of comfort, supplemental oxygen, specific treatment (albuterol for wheezing, racemic epinephrine for stridor/croup). Respiratory failure: BVM ventilation, advanced airway as needed, treat underlying cause. Age-appropriate equipment: Use Broselow tape for sizing. Ventilation rates: infant/child 12-20/min, avoid hyperventilation. Avoid excessive tidal volumes — use only enough to produce visible chest rise.",
      complications: "Progression to respiratory arrest and cardiac arrest (most feared), barotrauma from overventilation, gastric distension from BVM (reduces diaphragmatic excursion), hypothermia (exposed child), hypoglycemia (higher metabolic rate), and worsening of underlying condition. Iatrogenic hyperventilation is a common and dangerous complication.",
      pearls: [
        "The Pediatric Assessment Triangle provides a 30-second initial assessment from across the room — use it EVERY time you approach a pediatric patient",
        "Bradycardia in a child with respiratory distress is a PRE-ARREST sign — it indicates severe hypoxia and imminent cardiac arrest",
        "The most common cause of pediatric cardiac arrest is respiratory failure, not cardiac — airway and breathing management is the priority",
        "Use the Broselow tape to select age-appropriate equipment sizes — memorizing sizes for all ages is error-prone"
      ],
      pitfalls: [
        "Hyperventilating a pediatric patient — this causes gastric distension, decreased venous return, and decreased cardiac output",
        "Interpreting a quiet child as 'improving' — decreasing respiratory effort in a child with respiratory distress may indicate exhaustion and impending arrest",
        "Using adult-sized equipment on children — oversized BVM, ETT, or LMA can cause barotrauma or inadequate seal",
        "Not recognizing grunting as a sign of respiratory failure — grunting is the child creating auto-PEEP to keep alveoli open and indicates severe disease"
      ],
      faq: [
        { question: "What are the anatomical differences that make pediatric airway management challenging?", answer: "Key differences: larger head and occiput (requires padding under shoulders for alignment, not head), larger tongue relative to oral cavity, higher and more anterior larynx (C3-4 vs C5-6 in adults), omega-shaped epiglottis (floppy), narrowest point at cricoid ring (not vocal cords, in children <8 years), shorter trachea (2cm in neonates — higher risk of right mainstem intubation), and obligate nasal breathers (infants). These differences affect positioning, equipment selection, and technique." },
        { question: "When should a child be intubated vs managed with BVM?", answer: "BVM ventilation is often sufficient and preferred for short transport times. Consider intubation when: BVM cannot provide adequate ventilation, prolonged ventilatory support is needed, the child has no gag reflex, or there is a need for airway protection. Studies show that BVM ventilation has equivalent or better outcomes than intubation in many pediatric emergency situations, particularly when performed by providers who infrequently intubate children. If BVM works, use it." }
      ],
      keywords: ["pediatric respiratory emergency paramedic", "pediatric airway management", "pediatric assessment triangle", "pediatric respiratory distress", "Broselow tape"],
      related: ["pediatric-assessment-triangle", "pediatric-cardiac-arrest", "asthma-management", "croup-management"]
    },

    {
      title: "Pediatric Trauma",
      category: "Pediatric Emergencies",
      overview: "Trauma is the leading cause of death in children ages 1-14. Pediatric trauma assessment and management requires understanding the unique anatomical and physiological differences between children and adults. Children have different injury patterns, compensatory mechanisms, and treatment considerations.",
      mechanism: "Common pediatric trauma mechanisms include MVC (leading cause of trauma death), falls, pedestrian vs automobile, bicycle injuries, sports injuries, drowning, and non-accidental trauma (child abuse). Children's proportionally larger head, elastic skeleton, and compact body cause different injury patterns: head injuries are more common, internal organ injuries occur without overlying fractures, and multi-system injury is the rule.",
      clinicalRelevance: "Children compensate well for injury — they can maintain blood pressure until 25-30% blood volume is lost (compared to 15-20% in adults). This makes compensated shock in children dangerously deceptive. By the time hypotension occurs, the child is in severe decompensated shock with imminent cardiac arrest.",
      signsSymptoms: "Compensated shock signs (EARLY — look for these): tachycardia, cool/pale/mottled extremities, delayed capillary refill (>2 seconds), altered mental status (irritability, then lethargy), decreased urine output. Decompensated shock (LATE): hypotension (SBP <70 + [2 × age in years] in children 1-10), thready pulses, unresponsiveness. Specific injuries: head trauma (most common serious injury), abdominal solid organ injury (liver, spleen — often without abdominal wall bruising).",
      assessment: "Primary survey following ABCDE with pediatric modifications. Airway: c-spine precautions, use jaw thrust. Breathing: assess rate (age-appropriate), work of breathing. Circulation: tachycardia is the EARLIEST sign of shock in children — take it seriously. Disability: AVPU or pediatric GCS. Exposure: prevent hypothermia (larger BSA:mass ratio). Glasgow Coma Scale modification: use pediatric verbal and motor scales for pre-verbal children.",
      management: "Fluid resuscitation: 20 mL/kg NS bolus, repeat up to 3 times (60 mL/kg total). If still hypotensive: consider blood products and surgical intervention. Use Broselow tape for weight-based medication and equipment dosing. Splint fractures. Manage TBI: maintain SpO2 >94%, ETCO2 35-40 mmHg, avoid hypotension. Always consider non-accidental trauma — document injury patterns and scene findings. Transport to pediatric trauma center when available.",
      complications: "Hypothermia (children lose heat rapidly — large BSA:mass ratio), hypoglycemia (limited glycogen stores, high metabolic rate), decompensated shock (children compensate well then deteriorate rapidly), head injury (leading cause of trauma death), and missed non-accidental trauma. Psychological impact on the child and family is significant.",
      pearls: [
        "Tachycardia is the EARLIEST sign of shock in children — do not dismiss it; a tachycardic child with trauma needs aggressive assessment and management",
        "Hypotension is a LATE and ominous sign in pediatric trauma — by the time BP drops, the child has lost 25-30% of blood volume and is near arrest",
        "Children's elastic skeletons transmit energy to internal organs WITHOUT fracturing — significant internal injuries can exist without external signs",
        "Check blood glucose in ALL pediatric trauma patients — children have limited glycogen stores and become hypoglycemic rapidly"
      ],
      pitfalls: [
        "Being reassured by a normal blood pressure in a tachycardic child — compensated shock can maintain BP until near-arrest",
        "Not keeping the child warm — hypothermia worsens coagulopathy and acidosis; prevent heat loss aggressively",
        "Using adult-sized equipment — use Broselow tape for every pediatric patient to select appropriate sizes",
        "Not considering non-accidental trauma — injuries inconsistent with the reported mechanism, multiple injuries at different stages of healing, and caregiver stories that change are red flags"
      ],
      faq: [
        { question: "How do you calculate normal blood pressure for a child?", answer: "Minimum acceptable systolic blood pressure for children 1-10 years: 70 + (2 × age in years). For example, a 5-year-old: 70 + 10 = 80 mmHg minimum. SBP below this is hypotension. However, remember that children compensate well — a child can be in shock with a NORMAL blood pressure. Tachycardia, altered mental status, and poor perfusion signs are more sensitive indicators of shock than blood pressure in children." },
        { question: "What are the signs of non-accidental trauma?", answer: "Red flags include: injuries inconsistent with the developmental stage (e.g., fractures in a non-ambulatory infant), injuries inconsistent with the reported mechanism, patterned injuries (belt marks, cigarette burns), multiple injuries at different healing stages, delay in seeking medical care, changing stories from caregivers, unusual caregiver behavior, and specific injury patterns (spiral fractures in non-ambulatory children, posterior rib fractures, retinal hemorrhages). Paramedics are mandatory reporters — document findings objectively and report suspicions." }
      ],
      keywords: ["pediatric trauma paramedic", "pediatric shock assessment", "non-accidental trauma", "pediatric primary survey", "Broselow tape trauma"],
      related: ["pediatric-assessment-triangle", "pediatric-cardiac-arrest", "traumatic-brain-injury", "hemorrhagic-shock"]
    },

    {
      title: "Febrile Seizures",
      category: "Pediatric Emergencies",
      overview: "Febrile seizures are seizures associated with fever (temperature >38°C/100.4°F) in children aged 6 months to 5 years, occurring without evidence of intracranial infection or other definable cause. They are the most common seizure type in children, affecting 2-5% of all children. While frightening to parents, simple febrile seizures are benign and do not cause brain damage.",
      mechanism: "The exact mechanism is not fully understood. The developing brain has a lower seizure threshold that is further reduced by fever. Genetic predisposition plays a role — 25-40% of affected children have a family history of febrile seizures. The rate of temperature rise appears more important than the absolute temperature in triggering seizures. Most occur within the first 24 hours of a febrile illness.",
      clinicalRelevance: "Febrile seizures are extremely common in pediatric EMS calls. The key paramedic responsibilities are distinguishing simple from complex febrile seizures, ruling out other causes (meningitis, encephalitis), managing actively seizing patients, and providing reassurance to terrified parents.",
      signsSymptoms: "Simple febrile seizure: generalized tonic-clonic, lasting <15 minutes, occurs once in 24 hours, with rapid return to baseline. Complex febrile seizure: focal onset, duration >15 minutes, recurrent within 24 hours, or prolonged postictal period. Associated findings: fever (often >39°C/102.2°F), URI symptoms, otitis media, or other febrile illness. Red flags for meningitis: bulging fontanelle, neck stiffness, petechial rash, prolonged altered mental status.",
      assessment: "Check blood glucose (hypoglycemia can cause seizures and must be treated). Assess temperature. Determine seizure characteristics: duration, focal vs generalized, number of episodes. Assess mental status — post-seizure lethargy is normal but should be improving. Look for signs of meningitis or other serious illness. Age outside 6 months-5 years warrants more aggressive evaluation.",
      management: "Active seizure: ensure safety, maintain airway, suction if needed, position on side. Benzodiazepine if seizure >5 minutes (midazolam 0.2 mg/kg IM/IN, max 5mg). Actively cool if fever >40°C (remove excess clothing, tepid sponging — NOT cold water/ice). Check and treat blood glucose. Post-seizure: monitor airway and breathing during postictal phase. Transport for evaluation. Reassure parents — simple febrile seizures are benign.",
      complications: "Status epilepticus (seizure >5 minutes — rare with simple febrile seizures), aspiration during seizure, injury from fall or convulsions, recurrence (30% risk with subsequent febrile illness), and parental anxiety/PTSD. Simple febrile seizures do NOT cause brain damage, intellectual disability, or epilepsy.",
      pearls: [
        "Simple febrile seizures are BENIGN — they do not cause brain damage, do not lead to epilepsy, and have an excellent prognosis; reassure parents accordingly",
        "The rate of temperature rise is more important than absolute temperature — a rapidly rising fever is more likely to trigger a seizure than a stable high fever",
        "Check blood glucose in ALL pediatric seizure patients — hypoglycemia is a treatable cause of seizures",
        "Most febrile seizures are self-limited (<5 minutes) — have medications ready but do not administer benzodiazepines unless the seizure persists >5 minutes"
      ],
      pitfalls: [
        "Treating the fever aggressively with ice or cold water immersion — this can cause shivering and paradoxically raise core temperature; use tepid measures",
        "Assuming every seizure with fever is a febrile seizure — consider meningitis, encephalitis, and other serious causes, especially in children <6 months or >5 years",
        "Not checking blood glucose — hypoglycemia causes seizures and is easily treatable",
        "Giving benzodiazepines for a seizure that has already stopped — post-seizure lethargy is normal and does not require benzodiazepine administration"
      ],
      faq: [
        { question: "Will my child develop epilepsy from febrile seizures?", answer: "The risk of developing epilepsy after simple febrile seizures is only 1-2%, compared to 1% in the general population — essentially no increased risk. Complex febrile seizures carry a slightly higher risk (4-6%) but still have an excellent prognosis. Simple febrile seizures do not cause brain damage or cognitive problems. About 30% of children will have a recurrence with future febrile illness, which does not change the benign prognosis." },
        { question: "How do you differentiate a febrile seizure from meningitis?", answer: "Febrile seizure: age 6 months-5 years, generalized, brief (<15 minutes), rapid return to normal behavior. Meningitis red flags: age <6 months or >5 years, altered mental status persisting >30 minutes after seizure, bulging fontanelle, nuchal rigidity (neck stiffness), petechial/purpuric rash, toxic appearance, irritability that persists, and focal neurological deficits. When in doubt, transport for evaluation — meningitis requires emergent antibiotics." }
      ],
      keywords: ["febrile seizures paramedic", "pediatric seizure management", "fever seizure children", "simple complex febrile seizure", "pediatric febrile convulsion"],
      related: ["seizure-management", "pediatric-assessment-triangle", "meningitis", "pediatric-respiratory-emergencies"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: OB/GYN Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Placenta Previa and Abruption",
      category: "OB/GYN Emergencies",
      overview: "Placenta previa (placenta covering the cervical os) and placental abruption (premature separation of the placenta) are the two most common causes of third-trimester vaginal bleeding. Both are obstetric emergencies that can rapidly lead to maternal hemorrhagic shock and fetal death.",
      mechanism: "Placenta previa: the placenta implants over or near the internal cervical os, covering the fetal exit. As the cervix dilates in late pregnancy or labor, the placental attachment disrupts, causing painless bleeding. Placental abruption: the normally implanted placenta separates from the uterine wall prematurely, usually from shearing forces. Blood accumulates between the placenta and uterus (concealed) or exits the cervix (revealed).",
      clinicalRelevance: "Third-trimester vaginal bleeding requires rapid assessment and transport. The key clinical distinction is painful vs painless bleeding: abruption is typically painful, previa is typically painless. Both can cause maternal hemorrhagic shock and fetal distress. Paramedics must resist the urge to perform vaginal examination in third-trimester bleeding — digital exam can provoke massive hemorrhage in previa.",
      signsSymptoms: "Previa: PAINLESS bright red vaginal bleeding, usually in third trimester, soft non-tender uterus, normal fetal heart tones initially. Abruption: PAINFUL vaginal bleeding (may be concealed — 20% have no visible bleeding), rigid/tender uterus ('board-like'), possible fetal distress or demise, maternal shock possible even without visible bleeding.",
      assessment: "Assess maternal hemodynamics: blood pressure (consider left lateral positioning), heart rate, skin signs, level of consciousness. Estimate blood loss (remember 20% of abruptions are concealed). Assess uterine tone: soft and non-tender (previa) vs rigid and tender (abruption). Do NOT perform digital vaginal exam. Monitor for signs of shock. Determine gestational age and obstetric history.",
      management: "Position in left lateral recumbent position (improves venous return). High-flow oxygen. Establish two large-bore IVs and begin fluid resuscitation. Rapid transport to a facility with obstetric and neonatal capabilities. Cover the perineum with trauma pads to estimate blood loss. Do NOT attempt to deliver in the field if previa is suspected. Prepare for emergency cesarean section at the hospital.",
      complications: "Maternal hemorrhagic shock, disseminated intravascular coagulation (DIC — especially with abruption), fetal distress and death, emergency cesarean section, uterine atony, hysterectomy, amniotic fluid embolism, and maternal death. Abruption carries a higher fetal mortality rate (20-40%) than previa (less than 1% with appropriate management).",
      pearls: [
        "NEVER perform a digital vaginal exam in third-trimester bleeding — if the bleeding is from previa, digital exam can provoke catastrophic hemorrhage",
        "Painless = previa, painful = abruption (classic teaching, but there is significant overlap in real presentations)",
        "A rigid, board-like uterus with vaginal bleeding strongly suggests abruption — the uterus is contracting around the blood behind the placenta",
        "Concealed abruption (no visible bleeding) can cause maternal shock — if a pregnant patient is in shock without visible bleeding, consider concealed abruption"
      ],
      pitfalls: [
        "Performing a vaginal exam to determine the source of bleeding — this can convert stable previa into life-threatening hemorrhage",
        "Being reassured by minimal visible bleeding in abruption — 20% of abruptions are concealed with blood trapped behind the placenta",
        "Not positioning the patient in left lateral recumbent — the gravid uterus compresses the IVC in supine position, worsening hypotension",
        "Underestimating blood loss — pregnancy increases blood volume by 50%, so patients can lose more blood before showing signs of shock"
      ],
      faq: [
        { question: "How do you differentiate placenta previa from abruption in the field?", answer: "Classic distinction: Previa presents with painless bright red bleeding, soft non-tender uterus, and usually a stable fetus. Abruption presents with painful bleeding (or no visible bleeding in concealed abruption), rigid tender uterus, and possible fetal distress. However, presentations overlap, and definitive diagnosis requires ultrasound. The prehospital management is similar for both: left lateral positioning, oxygen, two large-bore IVs, aggressive fluid resuscitation, and rapid transport. Never perform a digital vaginal exam." },
        { question: "Why is the left lateral position important in pregnancy?", answer: "After approximately 20 weeks gestation, the gravid uterus is large enough to compress the inferior vena cava when the patient is supine (aortocaval compression syndrome). This reduces venous return to the heart by up to 30%, decreasing cardiac output and blood pressure. Left lateral positioning shifts the uterus off the IVC, restoring venous return. This is critical in hemorrhaging patients who are already volume-depleted. If the patient must be supine (CPR), manually displace the uterus to the left." }
      ],
      keywords: ["placenta previa paramedic", "placental abruption management", "third trimester bleeding", "obstetric hemorrhage EMS", "antepartum hemorrhage"],
      related: ["emergency-childbirth", "eclampsia", "hemorrhagic-shock", "neonatal-resuscitation"]
    },

    {
      title: "Postpartum Hemorrhage",
      category: "OB/GYN Emergencies",
      overview: "Postpartum hemorrhage (PPH) is defined as blood loss >500 mL after vaginal delivery or >1000 mL after cesarean delivery. It is the leading cause of maternal death worldwide. Uterine atony (failure of the uterus to contract after delivery) is the most common cause, accounting for 70-80% of PPH cases.",
      mechanism: "After placental delivery, uterine contractions compress the spiral arteries at the placental site, achieving hemostasis (the 'physiologic tourniquet'). Uterine atony occurs when the myometrium fails to contract adequately, leaving the spiral arteries uncompressed and bleeding. Other causes include retained placenta/fragments, genital tract lacerations, and coagulopathy (the '4 T's: Tone, Tissue, Trauma, Thrombin).",
      clinicalRelevance: "PPH can be rapidly fatal — a healthy woman at term has approximately 500 mL/min of uterine blood flow, and can exsanguinate within minutes if the uterus fails to contract. Paramedics who deliver babies in the field must recognize and manage PPH immediately.",
      signsSymptoms: "Excessive vaginal bleeding after delivery, boggy (soft, non-firm) uterus palpated above the umbilicus, signs of hemorrhagic shock (tachycardia, hypotension, pallor, altered mental status), blood pooling beneath the patient, and passage of large clots. Note: pregnancy-related blood volume expansion masks early shock — tachycardia may be the only early sign.",
      assessment: "Assess uterine tone by palpating the fundus — it should be firm and at or below the umbilicus. A boggy, enlarged uterus is atonic. Estimate blood loss (typically underestimated). Assess hemodynamic status: remember that pregnant patients have 50% more blood volume, so signs of shock appear later. Check for complete placental delivery (examine the placenta for missing fragments if possible).",
      management: "Uterine massage: firm, circular massage of the uterine fundus through the abdomen — this is the FIRST and MOST IMPORTANT intervention. Empty the bladder (full bladder prevents uterine contraction). Initiate breastfeeding/nipple stimulation (releases endogenous oxytocin). Establish two large-bore IVs with aggressive NS/LR. Oxytocin (Pitocin) 10-40 units in 1L NS if available. Tranexamic acid (TXA) 1g IV if available. Bimanual uterine compression if massive hemorrhage. Rapid transport.",
      complications: "Hemorrhagic shock, DIC, organ failure (acute kidney injury, Sheehan syndrome from pituitary necrosis), need for hysterectomy, transfusion reactions, and maternal death. Sheehan syndrome (postpartum pituitary necrosis from severe hemorrhage) can cause long-term hormonal deficiency.",
      pearls: [
        "Uterine massage is the single most important immediate intervention for postpartum hemorrhage — start immediately and continue firmly",
        "A boggy uterus is an atonic uterus — if the fundus does not feel firm (like a grapefruit), it is not contracting and the patient is bleeding",
        "Pregnancy increases blood volume by 50% — patients can lose 1-1.5L before showing traditional signs of shock; tachycardia is the earliest sign",
        "TXA (tranexamic acid) given within 3 hours of delivery significantly reduces death from PPH — give 1g IV if available and within the time window"
      ],
      pitfalls: [
        "Not palpating the uterine fundus after delivery — uterine atony is the most common cause of PPH and is diagnosed by a boggy uterus",
        "Underestimating blood loss — visual estimation consistently underestimates actual hemorrhage volume by 30-50%",
        "Being reassured by normal blood pressure — pregnancy-induced hypervolemia masks hypovolemia; tachycardia may be the only early sign",
        "Failing to perform uterine massage because it seems too simple — this fundamental intervention saves lives"
      ],
      faq: [
        { question: "How do you perform uterine massage?", answer: "Place one hand on the lower abdomen and grasp the uterine fundus (top of the uterus). Apply firm, circular massage through the abdominal wall, compressing the uterus between your hand and the pelvis. Continue until the uterus becomes firm (feels like a contracted fist or grapefruit). This may require sustained, vigorous massage for several minutes. It is uncomfortable for the patient but life-saving. Reassess frequently — if the uterus relaxes, resume massage immediately." },
        { question: "What are the 4 T's of postpartum hemorrhage?", answer: "The 4 T's describe the four causes of PPH in order of frequency: (1) TONE — uterine atony (70-80% of PPH) — treated with massage, uterotonic drugs, and bimanual compression. (2) TISSUE — retained placenta or placental fragments (10%) — requires manual removal (hospital). (3) TRAUMA — cervical/vaginal lacerations, uterine rupture (8%) — requires surgical repair. (4) THROMBIN — coagulopathy, DIC (2%) — requires blood products and treatment of underlying cause. In the field, treat Tone (massage) and prepare for Transport." }
      ],
      keywords: ["postpartum hemorrhage paramedic", "uterine atony management", "PPH treatment EMS", "obstetric hemorrhage", "uterine massage technique"],
      related: ["emergency-childbirth", "hemorrhagic-shock", "eclampsia", "tranexamic-acid"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Toxicology (additional)
    // ═══════════════════════════════════════════

    {
      title: "Organophosphate Poisoning",
      category: "Toxicology",
      overview: "Organophosphate poisoning results from exposure to organophosphate compounds found in pesticides, nerve agents (sarin, VX), and some industrial chemicals. These agents inhibit acetylcholinesterase, causing an excess of acetylcholine at muscarinic, nicotinic, and central nervous system receptors, producing a characteristic cholinergic crisis.",
      mechanism: "Organophosphates irreversibly inhibit acetylcholinesterase, preventing the breakdown of acetylcholine (ACh) at cholinergic synapses. ACh accumulates at muscarinic receptors (parasympathetic effects), nicotinic receptors (neuromuscular junction and sympathetic ganglia), and CNS synapses. Without treatment, the enzyme-inhibitor bond 'ages' and becomes permanent (hours to days depending on the agent), making the inhibition irreversible.",
      clinicalRelevance: "Organophosphate poisoning is important for paramedics due to the risk of mass casualty exposure (nerve agents in terrorism), occupational exposure (agricultural workers), and the need for specific antidote therapy. The mnemonic SLUDGEM describes the muscarinic effects, while the management requires aggressive atropine dosing far beyond typical cardiovascular doses.",
      signsSymptoms: "Muscarinic effects (SLUDGEM): Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis, Miosis (constricted pupils). Also: bronchorrhea, bronchospasm, bradycardia, and hypotension. Nicotinic effects: muscle fasciculations, weakness, tachycardia, hypertension, paralysis. CNS effects: anxiety, seizures, coma, respiratory depression.",
      assessment: "Recognition of cholinergic toxidrome: wet patient (excessive secretions everywhere), miosis, bronchospasm/bronchorrhea, muscle fasciculations, and altered mental status. Exposure history: pesticide exposure (occupational, intentional), chemical exposure, mass casualty with multiple patients showing similar symptoms. Ensure scene safety — decontamination before treatment.",
      management: "DECONTAMINATION FIRST: Remove clothing, copious water irrigation. Protect yourself with PPE. ATROPINE: 2mg IV/IM every 5 minutes until secretions dry (may require 10-40+ mg — there is NO maximum dose for organophosphate poisoning). Target: drying of bronchial secretions and improved oxygenation. PRALIDOXIME (2-PAM): 1-2g IV over 15-30 minutes — reactivates acetylcholinesterase if given before aging occurs. BENZODIAZEPINE: diazepam 10mg IV for seizures. Aggressive airway management.",
      complications: "Respiratory failure (bronchospasm + bronchorrhea + respiratory muscle paralysis), seizures and status epilepticus, cardiac arrhythmias (both brady- and tachyarrhythmias), death from respiratory failure, intermediate syndrome (muscle weakness 24-96 hours after initial improvement), and organophosphate-induced delayed neuropathy (weeks later).",
      pearls: [
        "There is NO maximum dose of atropine in organophosphate poisoning — keep giving 2mg every 5 minutes until secretions dry; patients may require 50-100+ mg",
        "The endpoint of atropine therapy is DRYING OF SECRETIONS, not pupil dilation or heart rate — bronchorrhea kills the patient, not miosis",
        "Pralidoxime (2-PAM) must be given early — once the organophosphate-enzyme bond 'ages,' 2-PAM cannot reactivate the enzyme",
        "DECONTAMINATE before treating — organophosphates can be absorbed through skin; you WILL become poisoned if you handle contaminated patients without PPE"
      ],
      pitfalls: [
        "Under-dosing atropine — typical cardiac doses (0.5-1mg) are woefully inadequate for organophosphate poisoning; use 2mg and repeat frequently",
        "Using atropine alone without pralidoxime — atropine only blocks muscarinic effects; pralidoxime reactivates the enzyme and treats nicotinic effects",
        "Treating patients before decontamination — you risk secondary exposure; remove clothing and irrigate with water before treatment",
        "Administering succinylcholine for intubation in organophosphate-poisoned patients — acetylcholinesterase inhibition prevents succinylcholine metabolism, causing prolonged paralysis"
      ],
      faq: [
        { question: "Why does organophosphate poisoning require such massive doses of atropine?", answer: "In organophosphate poisoning, acetylcholine floods ALL muscarinic receptors throughout the body simultaneously. Atropine must competitively block this massive excess of ACh at every muscarinic receptor. Normal cardiac doses (0.5-1mg) only block a tiny fraction of receptors. Doses of 20-100+ mg may be needed to sufficiently block the overwhelming cholinergic stimulation. The dose is titrated to the clinical endpoint of drying bronchial secretions." },
        { question: "What is 'aging' and why does it matter for pralidoxime?", answer: "Aging is the process by which the organophosphate-enzyme bond undergoes a chemical change (dealkylation) that makes it irreversible. Before aging, pralidoxime (2-PAM) can cleave the organophosphate from the enzyme, reactivating acetylcholinesterase. After aging, the bond is permanent, and 2-PAM is ineffective — the body must synthesize new enzyme, which takes weeks. Aging time varies: soman ages in minutes, sarin in hours, VX and most pesticides in 24-48 hours. This is why early 2-PAM administration is critical." }
      ],
      keywords: ["organophosphate poisoning paramedic", "nerve agent treatment", "atropine organophosphate", "SLUDGEM mnemonic", "cholinergic crisis management"],
      related: ["opioid-overdose", "carbon-monoxide-poisoning", "seizure-management", "altered-mental-status"]
    },

    {
      title: "Tricyclic Antidepressant Overdose",
      category: "Toxicology",
      overview: "Tricyclic antidepressant (TCA) overdose is one of the most dangerous medication overdoses encountered in EMS. TCAs (amitriptyline, nortriptyline, imipramine) block sodium channels in the heart, causing widened QRS complexes and life-threatening arrhythmias. The triad of anticholinergic toxicity, seizures, and cardiac conduction delays defines TCA poisoning.",
      mechanism: "TCAs produce toxicity through multiple mechanisms: (1) Sodium channel blockade in the heart (widened QRS, prolonged QT, Brugada pattern — most dangerous), (2) Anticholinergic effects (blocks muscarinic ACh receptors), (3) Alpha-adrenergic blockade (vasodilation and hypotension), (4) Serotonin and norepinephrine reuptake inhibition, and (5) GABA receptor antagonism (seizures). The sodium channel blockade is responsible for the lethal cardiac effects.",
      clinicalRelevance: "TCA overdose can progress from awake and talking to cardiac arrest within 30 minutes. The widened QRS complex (>100 ms) is the most important prognostic indicator. Sodium bicarbonate is the specific antidote for TCA-induced cardiac sodium channel blockade and can be life-saving.",
      signsSymptoms: "Anticholinergic toxidrome: 'Hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter' — hyperthermia, mydriasis, dry skin/mucous membranes, flushing, delirium. Cardiac toxicity: widened QRS (>100 ms), prolonged QT, hypotension, sinus tachycardia, VT/VF. CNS toxicity: seizures, coma, and respiratory depression.",
      assessment: "12-lead ECG is the MOST IMPORTANT assessment: look for QRS >100 ms (risk of seizures), QRS >160 ms (risk of VT/VF), rightward axis deviation, and R wave in aVR >3 mm. Assess mental status (rapid deterioration is characteristic). Check for empty pill bottles. Monitor for seizures. Assess hemodynamic status.",
      management: "Sodium bicarbonate is the ANTIDOTE: 1-2 mEq/kg IV bolus for QRS >100 ms, hypotension, or arrhythmias. Repeat as needed. Target serum pH 7.45-7.55 (alkalinization reduces TCA binding to sodium channels). Seizures: benzodiazepines (diazepam, midazolam) — NOT phenytoin (worsens sodium channel blockade). Hypotension: NS fluid bolus, then norepinephrine if needed. Avoid all Class IA and IC antiarrhythmics. Cardiac monitoring continuously.",
      complications: "Sudden cardiac arrest (VT/VF from sodium channel blockade), refractory seizures, refractory hypotension, aspiration, rhabdomyolysis from seizures, QTc prolongation with torsades de pointes, and death. The patient can deteriorate from conscious to cardiac arrest within minutes, making TCA overdose uniquely dangerous.",
      pearls: [
        "A widened QRS complex (>100 ms) in a suspected overdose patient should be treated with sodium bicarbonate immediately — do not wait for confirmation of TCA ingestion",
        "Sodium bicarbonate works by alkalinizing the blood, which reduces TCA binding to cardiac sodium channels — it is the specific antidote and can reverse widened QRS within minutes",
        "TCA overdose can deteriorate from awake to cardiac arrest in <30 minutes — never leave a TCA overdose patient unmonitored",
        "NEVER give phenytoin for TCA-induced seizures — phenytoin blocks sodium channels and WORSENS TCA cardiac toxicity"
      ],
      pitfalls: [
        "Not getting a 12-lead ECG in suspected overdose patients — the widened QRS is the earliest and most important sign of serious TCA toxicity",
        "Using phenytoin for seizures — this worsens cardiac sodium channel blockade and can precipitate cardiac arrest",
        "Treating TCA-induced VT with Class IA/IC antiarrhythmics (procainamide, flecainide) — these worsen sodium channel blockade; use sodium bicarbonate",
        "Assuming a stable patient will remain stable — TCA toxicity can progress rapidly from mild symptoms to cardiac arrest"
      ],
      faq: [
        { question: "How does sodium bicarbonate work as an antidote for TCA poisoning?", answer: "Sodium bicarbonate works through two mechanisms: (1) Alkalinization — raising blood pH reduces TCA binding to cardiac sodium channels, restoring normal conduction. TCAs bind more avidly to sodium channels in an acidic environment. (2) Sodium loading — the extra sodium ions help overcome the TCA-induced sodium channel blockade through mass action. The result is narrowing of the QRS complex, stabilization of cardiac rhythm, and often improvement in blood pressure. Give 1-2 mEq/kg IV bolus and repeat as needed." },
        { question: "What QRS width is concerning in TCA overdose?", answer: "QRS >100 ms: significant toxicity, risk of seizures — give sodium bicarbonate. QRS >160 ms: high risk of ventricular arrhythmias (VT/VF) — aggressive sodium bicarbonate needed. Also look for a terminal R wave in aVR >3mm — this is specific for sodium channel blockade and predicts arrhythmia risk. Any widening of the QRS above baseline in a known or suspected TCA ingestion should be treated with bicarbonate." }
      ],
      keywords: ["TCA overdose paramedic", "tricyclic antidepressant poisoning", "sodium bicarbonate antidote", "widened QRS overdose", "anticholinergic toxidrome"],
      related: ["opioid-overdose", "seizure-management", "cardiac-arrest-management", "altered-mental-status"]
    },

    {
      title: "Methanol and Ethylene Glycol Poisoning",
      category: "Toxicology",
      overview: "Methanol (wood alcohol) and ethylene glycol (antifreeze) are toxic alcohols that are metabolized to toxic organic acids. Their parent compounds are relatively non-toxic, but their metabolites cause severe metabolic acidosis, organ damage, and death. Methanol causes blindness; ethylene glycol causes renal failure.",
      mechanism: "Both toxic alcohols are metabolized by alcohol dehydrogenase (the same enzyme that metabolizes ethanol). Methanol is converted to formaldehyde and then formic acid, which is toxic to the retina and optic nerve (causing blindness) and causes metabolic acidosis. Ethylene glycol is converted to glycolic acid and oxalic acid, which forms calcium oxalate crystals in the kidneys (causing renal failure) and causes metabolic acidosis.",
      clinicalRelevance: "Toxic alcohol poisoning can be difficult to diagnose in the field because early symptoms mimic ethanol intoxication. The key to survival is preventing metabolism of the parent compound by inhibiting alcohol dehydrogenase (using fomepizole or ethanol). Prehospital recognition and rapid transport are critical.",
      signsSymptoms: "Early (0-12 hours): apparent intoxication without ethanol smell, nausea, vomiting, abdominal pain. Late: severe metabolic acidosis with Kussmaul breathing, altered mental status, seizures. Methanol-specific: visual disturbances ('snowfield vision,' photophobia, blindness). Ethylene glycol-specific: flank pain, oliguria/anuria, calcium oxalate crystalluria, hypocalcemia with tetany.",
      assessment: "Suspect toxic alcohol poisoning in: intoxicated-appearing patient without ethanol odor, metabolic acidosis with an elevated anion gap, visual complaints in an intoxicated patient (methanol), and antifreeze or solvent exposure history. Assess for Kussmaul breathing. Check blood glucose (hypoglycemia may be present). Assess visual acuity if methanol suspected.",
      management: "Prehospital treatment is primarily supportive and transport-focused. IV fluid resuscitation. Correct hypoglycemia. Consider oral ethanol administration if local protocols allow (goal: competitive inhibition of alcohol dehydrogenase). The definitive antidote is fomepizole (4-methylpyrazole) — usually only available in the ED. Sodium bicarbonate for severe acidosis. Transport to a facility with hemodialysis capability.",
      complications: "Methanol: permanent blindness (retinal/optic nerve damage from formic acid), basal ganglia necrosis, death. Ethylene glycol: acute renal failure requiring hemodialysis, hypocalcemia causing seizures and cardiac arrhythmias, cranial nerve palsies, death. Both: severe metabolic acidosis, multi-organ failure, and death if untreated.",
      pearls: [
        "An intoxicated-appearing patient WITHOUT the smell of ethanol should raise suspicion for toxic alcohol ingestion",
        "Visual complaints in an intoxicated patient are a red flag for methanol poisoning — ask specifically about visual changes",
        "Kussmaul breathing in an apparently intoxicated patient suggests severe metabolic acidosis from toxic alcohol metabolites",
        "Early treatment with fomepizole or ethanol prevents toxic metabolite formation — time to treatment directly impacts outcomes and organ damage"
      ],
      pitfalls: [
        "Dismissing a toxic alcohol ingestion as simple ethanol intoxication — early symptoms are identical",
        "Not asking about visual changes — methanol causes blindness that is irreversible once established",
        "Delaying transport to a dialysis-capable facility — hemodialysis is definitive treatment for both methanol and ethylene glycol poisoning",
        "Not considering antifreeze ingestion in a child with altered mental status and metabolic acidosis — ethylene glycol has a sweet taste that appeals to children"
      ],
      faq: [
        { question: "Why does methanol cause blindness?", answer: "Methanol is metabolized to formaldehyde and then to formic acid by alcohol dehydrogenase and aldehyde dehydrogenase. Formic acid has specific toxicity to the retina and optic nerve because these tissues have high metabolic activity and limited ability to detoxify formate. Formic acid inhibits cytochrome oxidase in mitochondria, causing cellular energy failure in retinal cells. The resulting optic nerve damage is often irreversible, especially if treatment is delayed >24 hours." },
        { question: "How does ethanol work as an antidote for toxic alcohol poisoning?", answer: "Ethanol competitively inhibits alcohol dehydrogenase (ADH) — the enzyme that converts methanol and ethylene glycol to their toxic metabolites. ADH has a much higher affinity for ethanol than for methanol or ethylene glycol (10-20 times higher). By keeping blood ethanol levels at 100-150 mg/dL, ADH is occupied metabolizing ethanol instead of the toxic alcohol, preventing toxic metabolite formation. The toxic parent compound is then excreted unchanged by the kidneys or removed by hemodialysis." }
      ],
      keywords: ["methanol poisoning paramedic", "ethylene glycol overdose", "toxic alcohol poisoning", "antifreeze ingestion treatment", "fomepizole antidote"],
      related: ["opioid-overdose", "carbon-monoxide-poisoning", "altered-mental-status", "seizure-management"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Environmental Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Lightning Injuries",
      category: "Environmental Emergencies",
      overview: "Lightning injuries occur when a person is directly or indirectly struck by lightning, which carries up to 300 million volts and 30,000 amperes. Unlike other electrical injuries, lightning involves extremely brief exposure (1-5 milliseconds) with high voltage but relatively low total energy transfer. The primary cause of death is cardiac arrest.",
      mechanism: "Lightning injury mechanisms include: direct strike (most lethal), contact voltage (touching an object that is struck), side flash (lightning jumps from a struck object to the victim), ground current (most common — lightning energy spreads through the ground), upward streamer (upward discharge from the victim), and blast injury (thunder shock wave). The brief duration of exposure means that deep tissue burns are unusual (unlike industrial electrocution).",
      clinicalRelevance: "Lightning strike triage is UNIQUE — it is the ONLY mass casualty scenario where you treat the dead first. Patients in cardiac arrest from lightning strike have a higher survival rate than other causes of cardiac arrest, because the heart may spontaneously restart if breathing is supported. Those who appear dead may be salvageable.",
      signsSymptoms: "Cardiac arrest (asystole or VF), respiratory arrest, temporary paralysis (keraunoparalysis — unique to lightning), confusion/amnesia, tympanic membrane rupture, Lichtenberg figures (ferning pattern on skin — pathognomonic but transient), superficial burns, blunt trauma from fall or blast, and temporary blindness or deafness.",
      assessment: "Assess for cardiac arrest first — check pulse and breathing. If in cardiac arrest, begin immediate CPR and defibrillation. Assess for respiratory arrest without cardiac arrest (common — lightning can stun the respiratory center while the heart restarts spontaneously). Full trauma assessment (patients are often thrown). Check for TM rupture, burns, and spinal injury. Scene safety: move patient ONLY if ongoing lightning risk.",
      management: "Cardiac arrest: aggressive CPR and early defibrillation — survival rates are significantly higher than other cardiac arrest causes (up to 70-80% if treated promptly). Respiratory arrest: BVM ventilation (the heart may restart on its own if oxygenation is maintained). Standard trauma management. IV fluids (less aggressive than thermal burns — lightning burns are superficial). C-spine precautions. Monitor for arrhythmias continuously.",
      complications: "Cardiac arrest, traumatic injuries from falls or blast, burns (usually superficial), TM rupture and hearing loss, corneal injury and cataracts, keraunoparalysis (temporary paralysis — usually resolves), peripheral neuropathy, neuropsychological changes (memory problems, depression, sleep disorders), and chronic pain syndrome.",
      pearls: [
        "In a lightning mass casualty event, REVERSE the normal triage — treat the apparently dead first, because lightning cardiac arrest has a high survival rate with CPR",
        "Respiratory arrest may persist longer than cardiac arrest — the heart may restart spontaneously, but the respiratory center remains stunned; provide ventilatory support",
        "Lichtenberg figures (fern-like skin markings) are pathognomonic for lightning injury — they are not true burns and fade within hours",
        "Lightning victims do NOT retain electrical charge — they are safe to touch immediately; do not delay treatment"
      ],
      pitfalls: [
        "Applying standard mass casualty triage and triaging pulseless victims as 'expectant' — lightning cardiac arrest is highly survivable with CPR",
        "Not providing ventilatory support to a patient whose heart has restarted — the respiratory center may remain stunned, leading to secondary hypoxic arrest",
        "Treating lightning burns like thermal burns with aggressive fluid resuscitation — lightning burns are superficial and do not require Parkland formula fluids",
        "Assuming a conscious, stable lightning victim does not need evaluation — delayed cardiac arrhythmias and neurological complications are common"
      ],
      faq: [
        { question: "Why is lightning triage different from normal mass casualty triage?", answer: "In standard MCI triage (START), pulseless victims are triaged as expectant (black tag) because resources are limited. Lightning is the exception because: (1) Lightning-induced cardiac arrest has a much higher survival rate (up to 70-80%) than other causes of arrest. (2) The heart may spontaneously restart while the respiratory center remains stunned. (3) Without ventilatory support, a patient whose heart restarts will die from hypoxic arrest. Therefore, in lightning MCIs, prioritize pulseless, apneic patients — they are the most likely to benefit from intervention." },
        { question: "What is keraunoparalysis?", answer: "Keraunoparalysis is a transient paralysis unique to lightning strike victims. It presents as cold, blue, pulseless (seeming) extremities with motor paralysis, usually affecting the lower extremities. It is caused by intense autonomic nervous system stimulation from the lightning current, causing profound vasospasm. It typically resolves spontaneously within hours. It can mimic spinal cord injury or vascular injury, but the key differentiating feature is that it resolves. During the acute phase, the lack of pulses can lead to misdiagnosis of vascular injury." }
      ],
      keywords: ["lightning injuries paramedic", "lightning strike treatment", "reverse triage lightning", "keraunoparalysis", "lightning cardiac arrest"],
      related: ["cardiac-arrest-management", "hypothermia", "burns-assessment-and-management", "start-triage-system"]
    },

    {
      title: "Altitude Sickness",
      category: "Environmental Emergencies",
      overview: "Altitude sickness encompasses a spectrum of conditions caused by hypobaric hypoxia at elevations above 2,500 meters (8,200 feet). It ranges from mild acute mountain sickness (AMS) to life-threatening high-altitude pulmonary edema (HAPE) and high-altitude cerebral edema (HACE). Descent is the definitive treatment for all forms.",
      mechanism: "At altitude, atmospheric pressure decreases, reducing the partial pressure of inspired oxygen (PiO2). At 3,000m (10,000 ft), PiO2 is approximately 70% of sea level. Hypoxemia triggers pulmonary vasoconstriction (hypoxic pulmonary vasoconstriction), which increases pulmonary artery pressure. Uneven vasoconstriction causes over-perfusion of some capillary beds, leading to capillary leak. In the lungs, this produces HAPE. In the brain, this produces HACE.",
      clinicalRelevance: "EMS providers in mountainous regions or involved in search and rescue operations must recognize and manage altitude illness. The key principle is that altitude illness should always be assumed to be altitude illness until proven otherwise, and DESCENT is the primary treatment for serious cases.",
      signsSymptoms: "AMS (mild): headache (most common symptom), nausea, fatigue, dizziness, insomnia. HAPE: dyspnea at rest, cough (may be productive of pink frothy sputum), tachycardia, tachypnea, cyanosis, crackles on auscultation. HACE: severe headache, ataxia (inability to walk a straight line — most specific sign), confusion, drowsiness, hallucinations, coma.",
      assessment: "Assess using the Lake Louise Acute Mountain Sickness Score: headache + at least one other symptom (nausea, fatigue, dizziness) at altitude. HAPE: assess lung sounds (crackles), SpO2, respiratory effort. HACE: assess for ataxia (tandem walking test — most sensitive sign), mental status changes, papilledema. Always consider other diagnoses (hypothermia, dehydration, carbon monoxide from tent heaters).",
      management: "AMS: stop ascent, rest, acetazolamide (Diamox) if available, NSAIDs for headache, descent if symptoms worsen. HAPE: immediate descent (at least 300-1000m), supplemental oxygen (target SpO2 >90%), minimize exertion, nifedipine 30mg ER if available (reduces pulmonary artery pressure). HACE: immediate descent (most critical), dexamethasone 8mg IV/IM then 4mg every 6 hours, supplemental oxygen, consider portable hyperbaric chamber (Gamow bag) if descent is impossible.",
      complications: "AMS: progression to HAPE or HACE if ascent continues. HAPE: respiratory failure, death (mortality 50% if untreated, <5% with appropriate treatment). HACE: herniation, coma, death (rapidly fatal if untreated). Both HAPE and HACE can progress from mild symptoms to life-threatening within hours. Re-ascent too quickly after recovery risks recurrence.",
      pearls: [
        "Ataxia is the most specific and dangerous sign of HACE — any patient who cannot walk a straight line at altitude must descend immediately",
        "DESCENT is the single most effective treatment for all altitude illness — no medication can substitute for decreasing altitude",
        "The rule of altitude illness: any symptom at altitude is altitude illness until proven otherwise; any symptom that worsens with continued ascent is altitude illness",
        "HAPE and HACE can occur simultaneously and frequently coexist — always assess for both"
      ],
      pitfalls: [
        "Continuing to ascend despite symptoms of AMS — this risks progression to life-threatening HAPE or HACE",
        "Treating altitude illness with medications while continuing to ascend — descent is the primary treatment; medications are adjuncts",
        "Not recognizing ataxia as a sign of HACE — subtle gait instability may be the earliest sign of a life-threatening condition",
        "Attributing altitude illness symptoms to other causes (dehydration, fatigue, hangover) and continuing ascent — assume altitude illness and act accordingly"
      ],
      faq: [
        { question: "At what altitude does altitude sickness occur?", answer: "AMS can occur at altitudes as low as 2,500m (8,200 ft), though it most commonly occurs above 3,000m (10,000 ft). HAPE typically occurs above 3,000m and HACE above 4,000m (13,000 ft). However, susceptibility varies greatly between individuals — some people develop AMS at 2,500m while others are fine at 5,000m. Rapid ascent, previous altitude illness, and individual physiology are the main risk factors. Acclimatization (ascending slowly with rest days) is the best prevention." },
        { question: "How does a Gamow bag work?", answer: "A Gamow bag (portable hyperbaric chamber) is an inflatable bag that simulates descent by increasing the atmospheric pressure around the patient. A foot pump pressurizes the bag to approximately 2 PSI above ambient pressure, which simulates a descent of 1,500-3,000m. This increases the partial pressure of oxygen, relieving the hypoxemia that drives altitude illness. It is used as a temporizing measure when physical descent is impossible (weather, darkness, terrain). Typical treatment sessions are 1-2 hours." }
      ],
      keywords: ["altitude sickness paramedic", "high altitude pulmonary edema", "HAPE HACE management", "acute mountain sickness", "altitude illness treatment"],
      related: ["hypothermia", "drowning", "respiratory-emergencies", "altered-mental-status"]
    },

    {
      title: "Envenomation — Snake and Spider Bites",
      category: "Environmental Emergencies",
      overview: "Venomous animal envenomation from snakes and spiders is a significant environmental emergency. In North America, the primary venomous snakes are pit vipers (rattlesnakes, copperheads, cottonmouths) and coral snakes. Dangerous spiders include the black widow and brown recluse. Management focuses on supportive care and antivenom administration.",
      mechanism: "Pit viper venom is a complex mixture of enzymes that cause tissue destruction (metalloproteinases), coagulopathy (thrombin-like enzymes and fibrinolysins), and hemodynamic instability (vasoactive compounds). Coral snake venom is primarily neurotoxic, blocking acetylcholine at the neuromuscular junction (similar to curare). Black widow venom (alpha-latrotoxin) causes massive release of acetylcholine and norepinephrine. Brown recluse venom (sphingomyelinase D) causes local tissue necrosis.",
      clinicalRelevance: "Prehospital management of envenomation has evolved significantly — many historical practices (tourniquets, incision and suction, ice application, electrical shock) are harmful and contraindicated. The primary role of the paramedic is supportive care, anaphylaxis management if needed, and transport to a facility with antivenom.",
      signsSymptoms: "Pit viper: progressive local swelling and pain, ecchymosis, coagulopathy (oozing from bite, epistaxis, hematuria), nausea/vomiting, metallic taste, and fasciculations. Coral snake: minimal local reaction, progressive weakness, ptosis, dysarthria, dysphagia, and respiratory failure (delayed onset — may develop hours later). Black widow: severe muscle cramping and rigidity, abdominal pain mimicking acute abdomen, hypertension, diaphoresis. Brown recluse: local pain, blister formation, necrotic ulcer development over days.",
      assessment: "Identify the snake/spider if safely possible (photo with phone). Assess for signs of envenomation vs dry bite (20-25% of pit viper bites are 'dry' — no venom injected). Mark the leading edge of swelling with a pen and time to track progression. Assess for systemic signs: coagulopathy, neurotoxicity, anaphylaxis. Monitor for airway compromise (coral snake, anaphylaxis). Assess hemodynamic status.",
      management: "Remove jewelry distal to bite (before swelling). Immobilize affected extremity at heart level. Clean the wound. Keep the patient calm and limit activity (reduces venom spread). IV access for fluid and medication administration. Treat anaphylaxis if it occurs. Do NOT apply tourniquet, ice, or electrical stimulation. Do NOT incise the wound or attempt suction. Transport to a facility with antivenom (CroFab for pit vipers, coral snake antivenom). Monitor airway continuously for coral snake bites.",
      complications: "Pit viper: compartment syndrome (from severe swelling), coagulopathy with hemorrhage, rhabdomyolysis, acute kidney injury, and anaphylaxis to antivenom. Coral snake: respiratory failure from neuromuscular paralysis (may require intubation for days-weeks). Black widow: hypertensive crisis, seizures. Brown recluse: extensive tissue necrosis, secondary infection, hemolytic anemia (rare).",
      pearls: [
        "Do NOT apply tourniquets, ice, or attempt incision and suction — these are harmful, outdated practices that worsen outcomes",
        "25% of pit viper bites are 'dry bites' with no envenomation — but you cannot determine this in the field; treat all bites as potential envenomations",
        "Coral snake bites may have minimal initial symptoms but can develop life-threatening respiratory paralysis hours later — do not be reassured by initial stability",
        "Mark the leading edge of swelling with time — this helps the hospital team assess progression and guide antivenom dosing"
      ],
      pitfalls: [
        "Applying a tourniquet — this concentrates venom locally, worsens tissue necrosis, and does not prevent systemic absorption",
        "Releasing a patient with a coral snake bite who appears stable — neurotoxicity can develop hours after the bite with rapid progression to respiratory failure",
        "Identifying a bite as 'non-venomous' based on fang marks alone — this is unreliable in the field",
        "Attempting to capture or kill the snake — this risks additional bites and delays patient care; a photo is sufficient for identification"
      ],
      faq: [
        { question: "How do you tell if a snakebite is from a venomous or non-venomous snake?", answer: "In the field, you cannot reliably distinguish venomous from non-venomous bites based on wound appearance alone. The classic 'two fang marks vs U-shaped teeth marks' is unreliable. Instead, monitor for signs of envenomation: progressive swelling, pain, ecchymosis, and systemic symptoms. If possible, take a photo of the snake for identification. Treat all unknown snakebites as potentially venomous and transport for observation. Even 'dry bites' from venomous snakes need monitoring because symptoms can be delayed." },
        { question: "What first aid for snakebite is actually harmful?", answer: "Harmful practices to avoid: (1) Tourniquets — concentrate venom and cause tissue necrosis. (2) Ice — worsens local tissue damage. (3) Incision and suction — causes additional tissue damage and does not remove significant venom. (4) Electrical shock — no benefit, causes burns. (5) Alcohol — vasodilation increases venom absorption. (6) Attempting to capture the snake — risks additional bites. Correct first aid: immobilize the extremity at heart level, remove jewelry, keep the patient calm, clean the wound, and transport for definitive care." }
      ],
      keywords: ["snake bite paramedic", "envenomation management", "pit viper bite treatment", "spider bite emergency", "antivenom EMS"],
      related: ["anaphylaxis-management", "allergic-reactions", "compartment-syndrome", "pain-management-in-ems"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Respiratory Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Tension Pneumothorax Management",
      category: "Respiratory Emergencies",
      overview: "Tension pneumothorax is a life-threatening emergency in which air progressively accumulates in the pleural space under pressure, collapsing the affected lung and shifting the mediastinum to the opposite side. This compresses the contralateral lung and great vessels, causing obstructive shock and rapid cardiovascular collapse.",
      mechanism: "A one-way valve effect develops where air enters the pleural space during inspiration but cannot escape during expiration. Causes include traumatic chest wall injury, rib fractures, positive pressure ventilation in patients with pneumothorax, penetrating injuries, and spontaneous pneumothorax. As pressure builds, the lung collapses completely, the mediastinum shifts contralaterally, and the IVC is compressed, reducing venous return and cardiac output.",
      clinicalRelevance: "Tension pneumothorax is one of the few true emergencies that paramedics can diagnose and treat definitively in the field with needle decompression. It is a reversible cause of PEA arrest (one of the 'T's). Delayed recognition and treatment is rapidly fatal.",
      signsSymptoms: "Progressive respiratory distress, unilateral absent breath sounds, tracheal deviation AWAY from the affected side (late finding), hypotension, tachycardia, JVD (may be absent if hypovolemic), subcutaneous emphysema, cyanosis, and hypoxia refractory to supplemental oxygen. In ventilated patients: increasing airway pressures, worsening hypoxia, and hemodynamic instability.",
      assessment: "Clinical diagnosis — do NOT wait for chest X-ray confirmation. Assess breath sounds bilaterally (diminished or absent on affected side). Look for tracheal deviation (late and unreliable finding). Assess JVD (may be absent in hypovolemia). Evaluate hemodynamic status: tachycardia and hypotension in the context of respiratory distress. Consider tension pneumothorax in any deteriorating trauma patient or ventilated patient.",
      management: "NEEDLE DECOMPRESSION: Insert a 14-gauge, 3.25-inch (or longer) angiocatheter at the 2nd intercostal space, midclavicular line, OR the 4th-5th intercostal space, anterior axillary line (increasingly preferred — thinner chest wall). Direct the needle over the top of the rib (neurovascular bundle runs under each rib). A rush of air confirms the diagnosis. Leave the catheter in place. Reassess — if symptoms recur, decompress again. Commercial chest seals for open pneumothorax.",
      complications: "If untreated: cardiovascular collapse and cardiac arrest. Procedure complications: hemothorax from intercostal vessel injury, lung laceration, pneumothorax (in a patient without one — rare), catheter kinking or obstruction, subcutaneous emphysema, and local infection. Failed decompression may occur if the needle is too short (especially in obese patients) or if the catheter kinks.",
      pearls: [
        "Tension pneumothorax is a CLINICAL diagnosis — treat based on clinical findings, not imaging; waiting for a chest X-ray is inappropriate",
        "The anterior axillary line (4th-5th ICS) is increasingly preferred over the midclavicular line (2nd ICS) because the chest wall is thinner and the needle is more likely to reach the pleural space",
        "In a cardiac arrest patient with PEA and possible thoracic trauma, decompress BOTH sides of the chest — bilateral needle decompression can be performed rapidly",
        "If symptoms recur after decompression, the catheter may be kinked or occluded — perform a second decompression adjacent to the first"
      ],
      pitfalls: [
        "Using a needle that is too short — standard 3.25-inch angiocatheters fail to reach the pleural space in 30-40% of patients due to chest wall thickness; longer needles (5cm+) are recommended",
        "Confusing tension pneumothorax with cardiac tamponade — both cause JVD and hypotension, but tamponade has bilateral breath sounds while tension has unilateral absent sounds",
        "Not decompressing because tracheal deviation is not present — this is a LATE finding and may never occur; do not rely on it",
        "Forgetting to reassess after decompression — the catheter can kink or obstruct, and repeat decompression may be needed"
      ],
      faq: [
        { question: "Where should needle decompression be performed?", answer: "Two standard locations: (1) 2nd intercostal space, midclavicular line (traditional) — insert perpendicular to the chest wall, above the 3rd rib. (2) 4th-5th intercostal space, anterior axillary line (increasingly preferred) — the chest wall is thinner here, improving success rates, especially in larger patients. Always direct the needle over the top (superior aspect) of the rib to avoid the intercostal neurovascular bundle that runs under each rib." },
        { question: "Can needle decompression be performed on a patient without tension pneumothorax?", answer: "While not ideal, needle decompression on a patient who does not have tension pneumothorax has minimal complications. A small iatrogenic pneumothorax may result, but this is far less dangerous than untreated tension pneumothorax. Given that tension pneumothorax is rapidly fatal and the procedure is relatively safe, the threshold for decompression should be LOW in patients with suggestive clinical findings, especially in the setting of trauma or deterioration during positive pressure ventilation." }
      ],
      keywords: ["tension pneumothorax paramedic", "needle decompression technique", "chest decompression EMS", "pneumothorax management", "needle thoracostomy"],
      related: ["chest-trauma", "cardiac-tamponade", "blast-injuries", "traumatic-cardiac-arrest"]
    },

    {
      title: "Status Asthmaticus",
      category: "Respiratory Emergencies",
      overview: "Status asthmaticus is a severe, life-threatening asthma exacerbation that does not respond to standard bronchodilator therapy. It is a medical emergency that can progress to respiratory failure and cardiac arrest. Status asthmaticus accounts for approximately 5,000 deaths annually in the United States.",
      mechanism: "Status asthmaticus involves three progressive pathophysiological processes: bronchospasm (smooth muscle constriction), inflammation (mucosal edema, inflammatory cell infiltration), and mucus plugging (excessive secretion production). In severe cases, these processes become self-perpetuating and refractory to standard treatment. Air trapping from incomplete expiration leads to hyperinflation, increased work of breathing, respiratory muscle fatigue, and eventual respiratory failure.",
      clinicalRelevance: "Recognizing the transition from a severe asthma exacerbation to status asthmaticus is critical. The 'silent chest' — absence of wheezing in a severe asthmatic — is an ominous sign indicating that air movement is so minimal that wheezing cannot be generated. This patient is minutes from respiratory arrest.",
      signsSymptoms: "Severe dyspnea at rest, inability to speak in full sentences (one-word dyspnea is critical), severe wheezing or SILENT CHEST (most ominous — no air movement), accessory muscle use, diaphoresis, agitation progressing to lethargy, tachycardia >130, SpO2 <90% despite supplemental oxygen, pulsus paradoxus >25 mmHg, and altered mental status.",
      assessment: "Classify severity: can the patient speak in sentences (moderate), phrases (severe), or words (critical)? Listen for breath sounds — a silent chest is pre-arrest. SpO2, respiratory rate, heart rate. Assess for signs of fatigue: decreasing respiratory effort, lethargy, and bradycardia. Capnography: rising ETCO2 indicates hypoventilation and impending respiratory failure (normal/low ETCO2 in asthma reflects hyperventilation; rising ETCO2 is ominous).",
      management: "Continuous albuterol nebulization (10-15 mg/hr). Ipratropium bromide 0.5mg nebulized with first albuterol treatment. Corticosteroids: methylprednisolone 125mg IV (reduces inflammation — takes 4-6 hours to work but should be given early). Epinephrine 0.3-0.5mg IM (1:1000) for severe/critical cases. Magnesium sulfate 2g IV over 20 minutes (bronchodilator and anti-inflammatory). CPAP/BiPAP if tolerated. Intubation is LAST RESORT — it is extremely high-risk in status asthmaticus. Ketamine for sedation if intubation is needed (bronchodilatory properties).",
      complications: "Respiratory arrest, cardiac arrest (from hypoxia or hyperinflation reducing venous return), pneumothorax (from air trapping and high airway pressures), post-intubation cardiovascular collapse (positive pressure ventilation worsens hyperinflation), respiratory acidosis, and death. Intubation in status asthmaticus has a high complication rate.",
      pearls: [
        "A silent chest in a severe asthmatic is a PRE-ARREST sign — air movement is so poor that wheezing cannot be generated; this patient needs immediate aggressive treatment",
        "Rising ETCO2 in an asthmatic indicates respiratory muscle fatigue and impending respiratory failure — normal ETCO2 in asthma is LOW due to hyperventilation; a normal or rising value is ominous",
        "Epinephrine IM (1:1000) is underutilized in severe asthma — it provides both bronchodilation (beta-2) and reduces mucosal edema (alpha-1)",
        "Intubation is the LAST RESORT in status asthmaticus — positive pressure ventilation in a hyperinflated patient can cause cardiovascular collapse from decreased venous return"
      ],
      pitfalls: [
        "Interpreting decreased wheezing as improvement — it may indicate worsening air movement (silent chest), not better bronchodilation",
        "Withholding epinephrine because the patient is tachycardic — tachycardia from hypoxia is more dangerous than tachycardia from epinephrine",
        "Intubating without recognizing the risks of mechanical ventilation in severe asthma — use low rates, low tidal volumes, and prolonged expiratory times",
        "Not giving steroids because 'they take hours to work' — early administration reduces the duration and severity of the exacerbation"
      ],
      faq: [
        { question: "Why is intubation dangerous in status asthmaticus?", answer: "Intubation in status asthmaticus is dangerous for several reasons: (1) Positive pressure ventilation in a hyperinflated patient further increases intrathoracic pressure, compressing the vena cava and reducing venous return — causing cardiovascular collapse. (2) Air trapping worsens with mechanical ventilation, potentially causing tension pneumothorax. (3) The intubation procedure itself can trigger bronchospasm. (4) Sedation and paralysis remove the patient's compensatory respiratory effort. If intubation is necessary, use low respiratory rates (8-10/min), small tidal volumes (6 mL/kg), prolonged expiratory times (I:E ratio 1:4 or 1:5), and accept permissive hypercapnia." },
        { question: "How does magnesium sulfate help in asthma?", answer: "Magnesium sulfate relaxes bronchial smooth muscle through calcium channel antagonism and also reduces inflammatory mediator release. Given as 2g IV over 20 minutes for severe asthma, it provides additional bronchodilation beyond what beta-agonists achieve alone. Studies show significant improvement in peak expiratory flow and reduced hospital admission rates when magnesium is added to standard therapy. It is most effective in severe exacerbations that have not responded to initial bronchodilator therapy." }
      ],
      keywords: ["status asthmaticus paramedic", "severe asthma management", "silent chest asthma", "respiratory failure asthma", "asthma emergency treatment"],
      related: ["asthma-management", "copd-exacerbation", "continuous-positive-airway-pressure", "albuterol"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Assessment & Diagnostics (NEW)
    // ═══════════════════════════════════════════

    {
      title: "Primary and Secondary Survey",
      category: "Assessment & Diagnostics",
      overview: "The primary and secondary survey is the systematic approach to patient assessment that forms the foundation of all prehospital care. The primary survey (ABCDE) identifies and treats immediately life-threatening conditions, while the secondary survey performs a comprehensive head-to-toe examination to identify all injuries and medical conditions.",
      mechanism: "The assessment framework is based on the principle that certain conditions kill faster than others and must be identified in a specific order. Airway obstruction kills in minutes, breathing failure in minutes to hours, circulatory failure in minutes to hours, disability (neurological) indicates severity, and exposure allows complete evaluation. Each step must be addressed before moving to the next.",
      clinicalRelevance: "The systematic patient assessment is the most frequently tested paramedic skill on NREMT and state examinations. More importantly, it is the clinical framework that prevents missed injuries and ensures that life-threatening conditions are identified and treated in the correct priority order.",
      signsSymptoms: "The primary survey identifies: airway compromise (stridor, gurgling, snoring, silence), breathing failure (absent/diminished breath sounds, respiratory distress, cyanosis), circulation failure (weak/absent pulses, tachycardia, hypotension, pale/cool/diaphoretic skin, uncontrolled hemorrhage), disability (altered mental status, pupil abnormalities, lateralizing signs), and exposure findings (hidden injuries, temperature abnormalities, rashes).",
      assessment: "PRIMARY SURVEY (ABCDE): A-Airway with c-spine protection, B-Breathing and ventilation, C-Circulation with hemorrhage control, D-Disability (AVPU or GCS, pupils), E-Exposure/Environment. SECONDARY SURVEY: SAMPLE history (Signs/Symptoms, Allergies, Medications, Past medical history, Last oral intake, Events preceding), head-to-toe physical examination, vital signs, 12-lead ECG, blood glucose, and reassessment.",
      management: "Manage each finding as you discover it: clear the airway, provide ventilatory support, control hemorrhage, treat shock, and monitor neurological status. The primary survey should take no more than 60-90 seconds. Intervene immediately for any life threat found — do not continue the primary survey until each life threat is addressed. The secondary survey is more thorough and is completed during transport.",
      complications: "Missed injuries from inadequate assessment, delayed treatment of life-threatening conditions, tunnel vision (focusing on obvious injuries while missing critical ones), and failure to reassess (patient condition can change rapidly). The most common error is becoming distracted by dramatic but non-life-threatening injuries while missing subtle life-threatening conditions.",
      pearls: [
        "Treat each life-threatening finding as you discover it — do not complete the entire primary survey before intervening",
        "The secondary survey should NEVER delay transport for critical patients — perform it en route to the hospital",
        "Reassessment is a continuous process — vital signs should be rechecked every 5 minutes for critical patients, every 15 minutes for stable patients",
        "Exposing the patient completely (within modesty constraints) prevents missed injuries — log roll and check the back"
      ],
      pitfalls: [
        "Getting distracted by dramatic injuries (facial trauma, deformity) and failing to complete the primary survey — dramatic injuries are often not immediately life-threatening",
        "Not reassessing after interventions — you must verify that your treatment is working and the patient's condition is not worsening",
        "Skipping the exposure step — injuries to the back, perineum, and skin folds are frequently missed when patients are not fully examined",
        "Tunnel vision on the chief complaint — a patient with chest pain may also have an altered mental status from hypoglycemia"
      ],
      faq: [
        { question: "What is the difference between the primary and secondary survey?", answer: "The primary survey (ABCDE) is a rapid (<90 seconds) assessment that identifies and treats immediately life-threatening conditions in priority order. It focuses on: airway patency, ventilation adequacy, circulatory status with hemorrhage control, neurological disability, and exposure. The secondary survey is a thorough head-to-toe examination performed after life-threatening conditions are addressed. It includes SAMPLE history, detailed physical examination, vital signs, and diagnostic testing (ECG, glucose). The primary survey saves lives; the secondary survey finds everything else." },
        { question: "What does SAMPLE stand for and why is it important?", answer: "SAMPLE is a mnemonic for history gathering: Signs and Symptoms (what the patient is experiencing), Allergies (medications, foods, environmental), Medications (current prescriptions, OTC, supplements), Past medical history (relevant conditions, surgeries), Last oral intake (when and what they last ate/drank — important for aspiration risk and surgery), Events preceding (what led to the current situation). SAMPLE provides context that guides differential diagnosis and treatment decisions." }
      ],
      keywords: ["primary survey paramedic", "secondary survey assessment", "ABCDE assessment", "SAMPLE history", "paramedic patient assessment"],
      related: ["shock-assessment-and-classification", "cardiac-monitoring-and-rhythm-interpretation", "pediatric-assessment-triangle", "trauma"]
    },

    {
      title: "Blood Glucose Monitoring",
      category: "Assessment & Diagnostics",
      overview: "Blood glucose monitoring is one of the most important point-of-care tests in prehospital medicine. It should be performed on virtually every patient with altered mental status, as hypoglycemia is a common, easily treatable, and potentially fatal condition that mimics numerous other emergencies including stroke, intoxication, and seizures.",
      mechanism: "Glucometers use glucose oxidase or glucose dehydrogenase enzymes on a test strip that reacts with glucose in a capillary blood sample. The chemical reaction produces an electrical current proportional to the glucose concentration. Normal blood glucose is 70-140 mg/dL. Hypoglycemia (<70 mg/dL) deprives the brain of its primary fuel. Hyperglycemia (>250 mg/dL) indicates diabetic decompensation.",
      clinicalRelevance: "Checking blood glucose is arguably the single most important point-of-care test in EMS. Hypoglycemia is the great mimicker — it can present identically to stroke, seizures, intoxication, psychiatric emergencies, and head injury. Failure to check glucose is a common cause of misdiagnosis and delayed treatment in the prehospital setting.",
      signsSymptoms: "Hypoglycemia (<70): altered mental status, confusion, combativeness, diaphoresis, tremors, seizures, tachycardia, and coma. Hyperglycemia (>250): polyuria, polydipsia, Kussmaul breathing (DKA), dehydration, altered mental status, nausea/vomiting. Critically: hypoglycemia symptoms can perfectly mimic stroke, seizures, intoxication, or psychiatric illness.",
      assessment: "Obtain capillary blood glucose reading using a glucometer. Use a lancet on the side of the fingertip (less painful, better blood flow). Ensure hands are clean and dry. Apply blood to the test strip per manufacturer instructions. Note: readings may be inaccurate in severe shock (poor perfusion), hypothermia, and extreme anemia. Venous blood glucose is more accurate but impractical in the field.",
      management: "Hypoglycemia: Conscious and can swallow — oral glucose (15-30g). Altered consciousness — D10 100-200 mL IV (preferred), or D50 25g IV, or Glucagon 1mg IM if no IV. Recheck glucose 5 minutes after treatment — repeat if still <70 mg/dL. Hyperglycemia with DKA/HHS: IV NS fluid resuscitation — do NOT give insulin prehospitally. Document glucose reading and treatment response.",
      complications: "Missed hypoglycemia (most common and most dangerous complication of NOT checking), extravasation injury from D50 (severe tissue necrosis), recurrent hypoglycemia after treatment (especially with long-acting insulin or sulfonylurea overdose), and glucometer inaccuracy in shock, hypothermia, or extreme glucose values.",
      pearls: [
        "Check blood glucose on EVERY patient with altered mental status — this is not optional; hypoglycemia is the great mimicker",
        "D10 is increasingly preferred over D50 — it is less hypertonic, causes less tissue injury if extravasated, and provides more gradual correction",
        "Hypoglycemia from sulfonylureas (glipizide, glyburide) or long-acting insulin can recur hours after treatment — these patients require transport and observation even if glucose corrects",
        "A glucometer reading of 'LOW' or 'HIGH' means the glucose is outside the meter's range (<20 or >500 mg/dL) — treat the patient, not the number"
      ],
      pitfalls: [
        "Not checking glucose on any patient with altered mental status — this is the most common missed diagnosis in EMS",
        "Sending a patient with hypoglycemia home after glucose correction without considering the cause — sulfonylurea and long-acting insulin overdoses will recur",
        "Using a wet or contaminated finger for testing — water dilutes the sample, and residual glucose (from food handling) falsely elevates the reading",
        "Trusting a glucometer reading in a severely hypoperfused patient — glucometers are less accurate in shock and may underestimate true glucose"
      ],
      faq: [
        { question: "Why should glucose be checked on every altered mental status patient?", answer: "Hypoglycemia can perfectly mimic stroke (focal neurological deficits including hemiparesis), seizures, intoxication, psychiatric emergencies, dementia, head injury, and many other conditions. Without a glucose check, these conditions may be misdiagnosed, leading to inappropriate treatment and transport decisions. Hypoglycemia is rapidly reversible with glucose administration — a simple test and treatment can prevent brain injury and save lives." },
        { question: "What is the difference between D10, D50, and glucagon?", answer: "D10 (10% dextrose) is a moderate concentration given as 100-200 mL IV; it provides gradual glucose correction with less tissue damage risk. D50 (50% dextrose) is highly concentrated given as 25g (50 mL) IV push; it rapidly corrects severe hypoglycemia but causes tissue necrosis if it extravasates. Glucagon 1mg IM stimulates the liver to release stored glycogen as glucose; it takes 10-15 minutes to work and is ineffective if glycogen stores are depleted (alcoholics, malnourished patients). D10 is becoming the standard; D50 is for severe cases; glucagon is for when no IV access is available." }
      ],
      keywords: ["blood glucose monitoring paramedic", "hypoglycemia assessment", "glucometer EMS", "point-of-care glucose testing", "blood sugar emergency"],
      related: ["diabetic-emergencies", "altered-mental-status", "seizure-management", "stroke-assessment-and-management"]
    },

    {
      title: "Capnography in Clinical Practice",
      category: "Assessment & Diagnostics",
      overview: "Capnography is the continuous monitoring and graphical display of end-tidal carbon dioxide (ETCO2) concentration during the respiratory cycle. It is one of the most valuable monitoring tools in prehospital care, providing real-time information about ventilation, perfusion, and metabolism. Waveform capnography is now considered a standard of care for intubated patients and is increasingly used for non-intubated patients.",
      mechanism: "ETCO2 measurement relies on the absorption of infrared light by CO2 molecules. Mainstream devices measure CO2 directly in the airway circuit; sidestream devices aspirate a sample through tubing to a remote sensor. The capnogram waveform has four phases: Phase I (baseline inspiration — CO2 near zero), Phase II (rapid rise as alveolar gas mixes with dead space gas), Phase III (alveolar plateau — represents true alveolar CO2), and Phase 0 (inspiratory downstroke — fresh gas washes away CO2).",
      clinicalRelevance: "ETCO2 monitoring provides information about three physiological systems simultaneously: ventilation (how well CO2 is being eliminated), perfusion (cardiac output determines how much CO2 reaches the lungs), and metabolism (CO2 production reflects cellular metabolism). This makes capnography useful for confirming ETT placement, monitoring CPR quality, detecting ROSC, assessing sedation depth, and diagnosing bronchospasm.",
      signsSymptoms: "Normal ETCO2: 35-45 mmHg with a square waveform. Elevated ETCO2 (>45): hypoventilation, increased metabolism (fever, sepsis, malignant hyperthermia), increased CO2 production, or rebreathing. Low ETCO2 (<35): hyperventilation, decreased cardiac output, pulmonary embolism, or hypothermia. Absent ETCO2: esophageal intubation, airway obstruction, or cardiac arrest.",
      assessment: "Intubated patients: continuous waveform capnography confirms and continuously monitors ETT placement — this is the GOLD STANDARD. CPR: ETCO2 <10 mmHg indicates poor perfusion from inadequate compressions; sudden rise to >40 mmHg suggests ROSC. Non-intubated: nasal capnography monitors ventilatory status in sedated patients, identifies bronchospasm (shark fin waveform), and detects hypoventilation.",
      management: "Use capnography to guide treatment: High ETCO2: increase ventilation rate or tidal volume. Low ETCO2 in non-arrest: decrease ventilation rate (patient is being hyperventilated). CPR quality: target ETCO2 >20 mmHg — if lower, improve compression quality. Post-ROSC: target ETCO2 35-45 mmHg — avoid hyperventilation. Bronchospasm: shark-fin waveform guides bronchodilator therapy — normal square wave indicates response.",
      complications: "Equipment malfunction (contamination, sampling line occlusion, sensor failure), falsely low readings (air leak around ETT cuff, sampling line disconnect), and falsely elevated readings (contamination with exhaled gas, rebreathing from inadequate fresh gas flow). Capnography does NOT measure oxygenation — SpO2 monitoring must continue alongside ETCO2.",
      pearls: [
        "Waveform capnography is the GOLD STANDARD for confirming and continuously monitoring ETT placement — no other method is as reliable",
        "During CPR, ETCO2 reflects chest compression quality — target >20 mmHg; if lower, improve compressions before blaming the airway",
        "A sudden spike in ETCO2 during CPR (usually to >40 mmHg) is often the FIRST sign of ROSC — check for a pulse",
        "The 'shark fin' capnography waveform (sloping Phase III with no plateau) is characteristic of bronchospasm — use it to monitor treatment response"
      ],
      pitfalls: [
        "Relying on colorimetric CO2 detectors instead of continuous waveform capnography — colorimetric devices are less reliable and don't provide continuous monitoring",
        "Not monitoring ETCO2 during CPR — it provides real-time feedback on compression quality and can detect ROSC earlier than pulse checks",
        "Interpreting low ETCO2 as 'good ventilation' — in cardiac arrest, low ETCO2 often reflects poor perfusion, not hyperventilation",
        "Forgetting that capnography measures ventilation, NOT oxygenation — a patient can have normal ETCO2 and dangerous hypoxemia simultaneously"
      ],
      faq: [
        { question: "Why is capnography the gold standard for ETT confirmation?", answer: "Capnography is the gold standard because: (1) It detects CO2 in exhaled gas, which can only come from the lungs — an esophageal intubation produces no CO2 waveform. (2) It provides CONTINUOUS monitoring, detecting tube dislodgement at any time. (3) It is objective and not affected by noise, body habitus, or observer experience (unlike auscultation). (4) It works in all environments including noisy, dark, or moving settings. The absence of an ETCO2 waveform after intubation should be considered esophageal placement until proven otherwise." },
        { question: "How does capnography help during CPR?", answer: "During CPR, ETCO2 reflects pulmonary blood flow, which depends on cardiac output generated by chest compressions. Low ETCO2 (<10 mmHg) indicates inadequate compressions — improve depth, rate, or completeness of recoil. ETCO2 >20 mmHg suggests adequate compressions. A sudden sustained rise in ETCO2 (often >40 mmHg) during CPR is frequently the first indicator of ROSC — check for a pulse. ETCO2 <10 mmHg after 20 minutes of CPR is associated with very low survival rates and may be considered in resuscitation decisions." }
      ],
      keywords: ["capnography paramedic", "ETCO2 monitoring", "waveform capnography clinical", "end-tidal CO2", "capnography CPR"],
      related: ["capnography", "waveform-capnography-interpretation", "cardiac-arrest-management", "post-cardiac-arrest-care"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Geriatric Emergencies (NEW)
    // ═══════════════════════════════════════════

    {
      title: "Geriatric Trauma Considerations",
      category: "Geriatric Emergencies",
      overview: "Geriatric trauma patients (age >65) present unique challenges due to age-related physiological changes that alter injury patterns, mask clinical findings, and increase morbidity and mortality. Falls are the leading cause of injury death in the elderly. Geriatric trauma patients have mortality rates 3-4 times higher than younger patients with equivalent injuries.",
      mechanism: "Age-related changes that affect trauma presentation and management: decreased cardiac reserve (limited ability to increase heart rate — on beta-blockers, pacemakers, or age-related conduction changes), decreased respiratory reserve, osteoporotic bones (fracture with minimal force), decreased skin elasticity (more susceptible to skin tears and degloving), anticoagulant medication use (increased bleeding risk), and decreased pain perception (injuries may not be reported).",
      clinicalRelevance: "Geriatric trauma patients are under-triaged and under-treated more frequently than any other age group. Normal vital signs in an elderly patient may represent significant compromise — a 'normal' heart rate of 88 may reflect maximal compensation in a patient on beta-blockers. The threshold for trauma center transport should be LOWER for elderly patients.",
      signsSymptoms: "Common injury patterns: hip fractures from falls, subdural hematomas (bridging veins stretch as the brain atrophies), C-spine fractures (particularly odontoid fractures), rib fractures with pneumonia risk, and pelvic fractures. Masked signs: tachycardia may be absent (beta-blockers, pacemakers), blood pressure may appear normal despite shock (chronic hypertension baseline), and pain may be undertreated (decreased sensation, stoicism, cognitive impairment).",
      assessment: "Obtain a complete medication list — anticoagulants (warfarin, DOACs), antihypertensives, and beta-blockers profoundly affect clinical presentation. Assess for pre-existing conditions that increase risk: osteoporosis, cognitive impairment, vision/hearing deficits. Apply geriatric-specific triage criteria: lower the threshold for trauma center activation. Assess for elder abuse if injury pattern is suspicious.",
      management: "Lower the threshold for aggressive intervention. Fluid resuscitation: be cautious (reduced cardiac reserve — risk of fluid overload). Consider early blood products over crystalloid. Pain management: start with lower doses (altered metabolism) but do not undertreated. Maintain body temperature (impaired thermoregulation). Treat rib fractures aggressively (pain control prevents pneumonia). Consider anticoagulant reversal if hemorrhaging (vitamin K, PCC for warfarin; idarucizumab for dabigatran).",
      complications: "Higher mortality for equivalent injury severity, pulmonary complications from rib fractures (pneumonia in elderly with rib fractures has 30% mortality), anticoagulant-related hemorrhage (especially subdural hematomas), delirium from medication changes and hospital environment, rapid functional decline, and loss of independence.",
      pearls: [
        "A 'normal' heart rate of 80-90 in an elderly trauma patient on beta-blockers may represent maximum compensation — these patients cannot mount an appropriate tachycardic response to hemorrhage",
        "The elderly patient's 'normal' blood pressure is often hypertensive — a BP of 120/80 may represent significant hypotension in a patient who normally runs 170/90",
        "Always ask about anticoagulant use — falls in anticoagulated elderly patients are HIGH-RISK for intracranial hemorrhage, even with seemingly minor mechanisms",
        "Three or more rib fractures in an elderly patient should be treated as a serious injury — the mortality rate from pneumonia and respiratory failure is significant"
      ],
      pitfalls: [
        "Applying standard vital sign criteria to geriatric trauma patients — 'normal' vitals may mask significant hemorrhage",
        "Under-triaging elderly falls — ground-level falls in the elderly cause the same injuries as high-energy mechanisms in younger patients",
        "Not checking for anticoagulant use — a head-injured patient on warfarin needs emergent CT and possible reversal",
        "Undertreating pain — elderly patients often do not report pain due to stoicism, cognitive impairment, or decreased sensation; proactively assess and treat"
      ],
      faq: [
        { question: "Why are elderly patients under-triaged?", answer: "Elderly patients are under-triaged for several reasons: (1) Normal vital signs (tachycardia may be absent due to beta-blockers, BP may appear normal despite shock due to chronic hypertension baseline). (2) Low-energy mechanisms (falls from standing are not perceived as 'significant' despite causing equivalent injuries in elderly). (3) Delayed symptom presentation (subdural hematomas may not present for hours to days). (4) Communication barriers (cognitive impairment, hearing loss, stoicism). Current guidelines recommend lowering the triage threshold for patients >65 — consider trauma center transport for any elderly patient with mechanism of injury." },
        { question: "How do anticoagulants affect geriatric trauma management?", answer: "Anticoagulants (warfarin, rivaroxaban, apixaban, dabigatran) dramatically increase the risk and severity of hemorrhage in trauma patients. Even minor head trauma can cause expanding subdural or epidural hematomas. The anticoagulant effect prevents natural hemostasis, leading to progressive bleeding. Warfarin can be reversed with Vitamin K and PCC (prothrombin complex concentrate). Dabigatran can be reversed with idarucizumab (Praxbind). Factor Xa inhibitors can be reversed with andexanet alfa. Always ask about anticoagulant use and relay this information to the receiving hospital." }
      ],
      keywords: ["geriatric trauma paramedic", "elderly fall management", "anticoagulated trauma patient", "geriatric assessment EMS", "elderly trauma triage"],
      related: ["traumatic-brain-injury", "spinal-cord-injury", "hemorrhagic-shock", "hip-fracture"]
    },

    {
      title: "Geriatric Medical Emergencies",
      category: "Geriatric Emergencies",
      overview: "Geriatric medical emergencies often present atypically compared to younger patients. The elderly frequently lack classic symptoms of common emergencies — MI without chest pain, infection without fever, and acute abdomen without significant tenderness. Understanding these atypical presentations is essential for accurate prehospital assessment.",
      mechanism: "Age-related physiological changes that cause atypical presentations: decreased immune response (blunted fever response to infection), decreased pain perception (MI without chest pain, appendicitis without tenderness), autonomic dysfunction (absent tachycardia in shock), decreased physiological reserve (rapid decompensation), polypharmacy effects, and cognitive impairment that limits symptom reporting.",
      clinicalRelevance: "Up to 30% of elderly MI patients present WITHOUT chest pain. Sepsis in the elderly may present with confusion alone, without fever or tachycardia. These atypical presentations lead to delayed diagnosis and treatment, contributing to the higher mortality rates seen in geriatric emergencies.",
      signsSymptoms: "Atypical MI: dyspnea, weakness, confusion, syncope, or GI symptoms — WITHOUT chest pain (30% of elderly MI). Atypical infection/sepsis: confusion, falls, functional decline, or weakness — WITHOUT fever or localizing symptoms. Atypical acute abdomen: vague discomfort, anorexia, or confusion — WITHOUT classic guarding and rebound tenderness. Polypharmacy emergencies: drug interactions, falls, altered mental status, and bradycardia.",
      assessment: "Maintain a high index of suspicion — assume the worst-case scenario until proven otherwise. Obtain a complete medication list (polypharmacy is the norm — average elderly patient takes 5-8 medications). Baseline functional status: what could the patient do yesterday that they cannot do today? Cognitive assessment: is this confusion new or chronic? Check blood glucose. 12-lead ECG for any vague complaint.",
      management: "Lower the threshold for intervention and transport. Treat empirically when the diagnosis is uncertain. IV access and fluid resuscitation (cautious — reduced cardiac reserve). Medication dose adjustments (reduce initial doses of most medications by 25-50% — decreased hepatic and renal clearance). Maintain body temperature. Communicate findings to the receiving hospital clearly — emphasize atypical presentations and medication lists.",
      complications: "Delayed diagnosis from atypical presentations, medication-related adverse events (the average elderly patient is on 5-8 medications), falls from polypharmacy (sedatives, antihypertensives, diabetic medications), delirium from environmental change, rapid physiological decompensation, and decreased ability to tolerate aggressive interventions.",
      pearls: [
        "When an elderly patient says 'I don't feel right' — take it seriously; vague complaints often represent serious pathology with atypical presentation",
        "30% of elderly MI patients have NO chest pain — dyspnea, weakness, confusion, or syncope may be the only presenting symptom",
        "New confusion in an elderly patient is a medical emergency until proven otherwise — common causes include infection, medication effects, metabolic derangement, and stroke",
        "Always review the medication list — polypharmacy complications are one of the most common reasons elderly patients call EMS"
      ],
      pitfalls: [
        "Dismissing vague complaints in the elderly as 'just being old' — atypical presentations of serious conditions are the norm, not the exception",
        "Not obtaining a 12-lead ECG because the patient does not have chest pain — elderly MI frequently presents without chest pain",
        "Attributing new confusion to dementia — acute confusion (delirium) has a medical cause that needs to be identified and treated",
        "Giving standard adult medication doses — reduced hepatic and renal function means drugs last longer and reach higher concentrations; start low"
      ],
      faq: [
        { question: "Why do elderly patients present atypically?", answer: "Multiple factors contribute: (1) Decreased pain perception — reduced nerve fiber density and altered pain processing diminish the intensity of pain signals. (2) Impaired immune response — the aging immune system produces less fever and fewer localizing inflammatory signs. (3) Autonomic dysfunction — decreased ability to mount appropriate tachycardic or vasoconstrictive responses. (4) Cognitive impairment — difficulty articulating symptoms. (5) Medication effects — beta-blockers mask tachycardia, analgesics mask pain. (6) Multiple comorbidities — symptoms of a new condition are attributed to existing problems." },
        { question: "What should paramedics specifically assess in elderly patients?", answer: "Beyond standard assessment: (1) Complete medication list — including OTC medications, supplements, and recent changes. (2) Baseline functional status — what could they do yesterday vs today? Any decline suggests acute illness. (3) Baseline cognitive function — is this confusion new? Ask family or caregivers. (4) Fall history — recent falls may indicate underlying medical problems. (5) Living situation — alone vs with family; evidence of self-neglect or abuse. (6) Blood glucose — always. (7) 12-lead ECG — for any vague complaint in the elderly." }
      ],
      keywords: ["geriatric medical emergencies paramedic", "atypical presentations elderly", "elderly patient assessment", "polypharmacy emergencies", "geriatric EMS care"],
      related: ["altered-mental-status", "acute-myocardial-infarction", "sepsis-and-septic-shock", "diabetic-emergencies"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Behavioral Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Psychiatric Emergency Assessment",
      category: "Behavioral Emergencies",
      overview: "Psychiatric emergencies involve acute disturbances in mood, thought, or behavior that require immediate intervention to prevent harm to the patient or others. They include suicidal ideation, psychosis, severe agitation, panic attacks, and violent behavior. The paramedic must balance patient safety, provider safety, and compassionate care.",
      mechanism: "Psychiatric emergencies arise from acute exacerbations of mental illness (schizophrenia, bipolar disorder, major depression), substance use/withdrawal, medication non-compliance or adverse effects, acute stress reactions, and organic medical conditions that mimic psychiatric presentations (hypoglycemia, thyrotoxicosis, CNS infections, substance intoxication).",
      clinicalRelevance: "A critical concept is that 'medical clears surgical' — organic medical conditions must be excluded before attributing symptoms to a psychiatric cause. Hypoglycemia, CNS infections, intracranial hemorrhage, thyroid storm, and drug intoxication can all present with psychiatric symptoms. Always rule out medical causes first.",
      signsSymptoms: "Suicidal ideation: verbalized intent, plan, means, previous attempts, hopelessness, giving away possessions, sudden calmness after agitation. Psychosis: hallucinations, delusions, disorganized speech/behavior, paranoia. Severe agitation: combativeness, destruction of property, verbal aggression, pacing, inability to sit still. Panic attack: acute onset fear, palpitations, dyspnea, chest tightness, feeling of doom.",
      assessment: "Scene safety FIRST — position yourself between the patient and the exit. Assess for medical causes: blood glucose, SpO2, vital signs, pupil examination, signs of head injury or drug use. Suicide risk assessment: ask directly about suicidal thoughts, plan, intent, and means (asking about suicide does NOT plant the idea). Assess for command hallucinations (voices telling the patient to harm themselves/others). Determine if the patient is voluntary or requires involuntary commitment.",
      management: "De-escalation is the first-line approach: maintain safe distance, use calm tone, validate feelings, offer choices, avoid confrontation. Pharmacological management for severe agitation (if de-escalation fails): midazolam 5mg IM, or ketamine 4-5 mg/kg IM for severe behavioral emergency. Physical restraints only as last resort and per protocol — monitor continuously for positional asphyxia. Never leave a suicidal patient alone. Transport to psychiatric crisis center or ED.",
      complications: "Violence to patient or providers, positional asphyxia from restraints, medication-related respiratory depression, excited delirium syndrome (rhabdomyolysis, hyperthermia, cardiac arrest), suicide during transport, and iatrogenic injury from inappropriate restraint technique.",
      pearls: [
        "Always rule out medical causes of altered behavior — check blood glucose, SpO2, and vital signs before assuming a psychiatric emergency",
        "Asking about suicide does NOT increase risk — direct, compassionate questioning shows you care and opens the door for help",
        "De-escalation works the majority of the time — calm tone, validation of feelings, and offering choices can resolve most situations without medication or restraints",
        "If physical restraints are used, place the patient SUPINE and monitor respiratory status continuously — prone restraint with weight on the back/neck causes positional asphyxia"
      ],
      pitfalls: [
        "Assuming bizarre behavior is psychiatric without checking for medical causes — a patient with new psychosis may have a brain tumor, infection, or metabolic emergency",
        "Not asking directly about suicidal ideation — clinicians who avoid this question miss opportunities to intervene",
        "Using prone restraint — face-down positioning with weight on the back is associated with positional asphyxia and death",
        "Leaving a suicidal patient unattended — even briefly; patients can find means of self-harm in an ambulance"
      ],
      faq: [
        { question: "How do you assess suicide risk in the field?", answer: "Ask directly: 'Are you thinking about hurting yourself?' or 'Are you thinking about suicide?' If yes, assess: (1) Plan — do they know HOW they would do it? (2) Intent — do they plan to ACT on it? (3) Means — do they have ACCESS to the method? (4) Timeline — is this imminent? Also assess risk factors: previous attempts (strongest predictor), recent loss, social isolation, substance use, access to firearms, and giving away possessions. Any patient expressing suicidal ideation with a plan and means requires immediate intervention and transport." },
        { question: "When should chemical restraint be used?", answer: "Chemical restraint should be considered when: (1) Verbal de-escalation has failed. (2) The patient is an imminent threat to themselves or others. (3) The patient's level of agitation prevents safe assessment and transport. (4) Physical restraint alone is insufficient or poses excessive risk. First-line agents include midazolam 5mg IM, or ketamine 4-5 mg/kg IM for severe agitation. Always monitor respiratory status after administration. Chemical restraint should NEVER be punitive — it is a medical intervention for patient and provider safety." }
      ],
      keywords: ["psychiatric emergency paramedic", "behavioral emergency assessment", "suicide risk assessment EMS", "de-escalation techniques", "chemical restraint paramedic"],
      related: ["excited-delirium", "altered-mental-status", "midazolam", "ketamine"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Neurological Emergencies (additional)
    // ═══════════════════════════════════════════

    {
      title: "Spinal Cord Syndromes",
      category: "Neurological Emergencies",
      overview: "Spinal cord syndromes are specific patterns of neurological deficit that result from injury to specific portions of the spinal cord. Understanding these patterns helps paramedics assess the extent and type of spinal cord injury, predict potential complications, and communicate findings effectively to the receiving facility.",
      mechanism: "The spinal cord is organized with specific tracts carrying different functions: the corticospinal tracts (motor function) travel in the lateral columns, the spinothalamic tracts (pain and temperature) travel in the anterolateral columns, and the posterior columns carry proprioception and vibration. Injury to specific portions of the cord produces predictable deficit patterns based on which tracts are damaged.",
      clinicalRelevance: "Identifying the specific spinal cord syndrome guides management, helps predict recovery potential, and communicates critical information to the receiving hospital. Anterior cord syndrome has the worst prognosis; central cord syndrome has the best. Brown-Séquard syndrome has good recovery potential. Understanding these patterns also helps differentiate spinal cord injury from peripheral nerve injury.",
      signsSymptoms: "Anterior cord syndrome: loss of motor function, pain, and temperature sensation below the injury level; preserved proprioception and light touch (posterior columns spared). Central cord syndrome: weakness greater in upper extremities than lower (classic 'cape-like' distribution); variable sensory loss; often seen in elderly with hyperextension injuries. Brown-Séquard syndrome (cord hemisection): ipsilateral motor loss and proprioception loss; contralateral pain and temperature loss.",
      assessment: "Systematic neurological assessment: motor function (strength grading 0-5 in all four extremities), sensory function (light touch, pin prick, proprioception — test each dermatome level), reflexes (biceps, triceps, patellar, Achilles), and rectal tone (sacral sparing indicates incomplete injury — better prognosis). Determine the neurological level — the lowest level with intact motor and sensory function.",
      management: "Spinal immobilization per current guidelines (cervical collar, backboard for extrication only — minimize time on board). Maintain spinal alignment. Treat neurogenic shock if present: IV fluids (often inadequate alone), vasopressors (phenylephrine or norepinephrine — bradycardia with hypotension is classic), atropine for symptomatic bradycardia. Avoid hypotension (MAP >85 mmHg is the target in acute SCI to maintain spinal cord perfusion). Maintain normothermia.",
      complications: "Neurogenic shock (loss of sympathetic tone below the injury — bradycardia, hypotension, warm skin), spinal shock (temporary loss of all reflexes below the injury), respiratory failure (injuries above C5 affect phrenic nerve — loss of diaphragmatic function), autonomic dysreflexia (late complication — massive sympathetic response to stimuli below the injury), DVT/PE, pressure ulcers, and urinary retention.",
      pearls: [
        "Sacral sparing (intact rectal tone, perianal sensation) indicates an INCOMPLETE spinal cord injury — these patients have much better recovery potential",
        "Neurogenic shock presents with the triad of bradycardia, hypotension, and warm/dry skin BELOW the injury — this distinguishes it from hypovolemic shock (tachycardia, cool/clammy skin)",
        "Central cord syndrome is the most common incomplete SCI and typically occurs in elderly patients with pre-existing spinal stenosis after hyperextension injuries — arms are weaker than legs",
        "The neurological level is defined by the LOWEST spinal segment with normal motor and sensory function — document this precisely"
      ],
      pitfalls: [
        "Confusing neurogenic shock with hypovolemic shock — neurogenic shock has bradycardia and warm skin; hypovolemic has tachycardia and cool skin; treatment differs significantly",
        "Not assessing sacral function — sacral sparing (rectal tone, perianal sensation) is the most important prognostic indicator in acute SCI",
        "Assuming all paralysis from spinal injury is permanent — incomplete injuries (with sacral sparing) have significant recovery potential",
        "Treating hypotension from neurogenic shock with fluids alone — vasopressors are usually needed because the hypotension is from vasodilation, not volume depletion"
      ],
      faq: [
        { question: "What is the difference between neurogenic shock and spinal shock?", answer: "These are commonly confused terms. NEUROGENIC SHOCK is a cardiovascular condition: loss of sympathetic tone below the injury causes vasodilation (hypotension) and unopposed vagal tone (bradycardia). It requires treatment with fluids and vasopressors. SPINAL SHOCK is a neurological condition: temporary loss of all spinal cord function (reflexes, motor, sensory) below the injury level. It can last hours to weeks and makes initial injury classification difficult. Spinal shock resolves; the remaining deficit represents the true extent of the injury." },
        { question: "Why is MAP maintenance important in acute spinal cord injury?", answer: "Maintaining MAP >85 mmHg (per current guidelines) in acute SCI helps ensure adequate blood flow to the injured spinal cord during the critical early period. The spinal cord, like the brain, has autoregulatory mechanisms that maintain blood flow across a range of blood pressures, but these mechanisms are impaired after injury. Hypotension causes secondary ischemia to the already injured cord, extending the injury and worsening neurological outcomes. Adequate perfusion pressure may preserve tissue in the 'penumbra' zone surrounding the primary injury." }
      ],
      keywords: ["spinal cord syndromes paramedic", "anterior cord syndrome", "central cord syndrome", "Brown-Sequard syndrome", "neurogenic shock management"],
      related: ["spinal-cord-injury", "spinal-immobilization", "traumatic-brain-injury", "shock-assessment-and-classification"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Operations & Triage (additional)
    // ═══════════════════════════════════════════

    {
      title: "Mass Casualty Incident Management",
      category: "Operations & Triage",
      overview: "Mass casualty incident (MCI) management is the systematic approach to scenes where the number of patients exceeds the resources available for normal individual care. MCI management requires a shift from providing optimal care to each individual patient to providing the greatest good for the greatest number — a fundamentally different paradigm from normal EMS operations.",
      mechanism: "MCIs overwhelm normal EMS resources through sheer patient volume. The Incident Command System (ICS) provides the organizational framework for managing these events. Key principles include: triage to prioritize patients who will benefit most from treatment, staged medical care based on available resources, organized patient flow from the scene through treatment to transport, and coordination among multiple responding agencies.",
      clinicalRelevance: "Every paramedic must be prepared to serve as the initial incident commander at an MCI until additional command-level resources arrive. The first-arriving paramedic's actions — establishing command, initiating triage, and requesting appropriate resources — set the tone for the entire response and directly impact patient outcomes.",
      signsSymptoms: "MCI triggers include: mass gatherings, transportation incidents (bus, train, plane crashes), structural collapses, active shooter events, hazardous materials releases, natural disasters, terrorist attacks, and multi-vehicle collisions. Declaration criteria vary by jurisdiction but generally involve any incident where patient numbers exceed available resources.",
      assessment: "Assess the scene: safety threats (ongoing hazard, structural instability, secondary devices), approximate patient count, severity distribution, access/egress routes, and staging areas. Initial triage using START (Simple Triage and Rapid Treatment) or JumpSTART (pediatric) system. Assess resource needs: how many ambulances, mutual aid, specialty resources (hazmat, technical rescue), and receiving hospital capacity.",
      management: "Establish Incident Command System (ICS). Designate key positions: Incident Commander, Triage Officer, Treatment Officer, Transport Officer, Staging Officer. Perform triage: START system classifies patients as Immediate (red), Delayed (yellow), Minor (green), or Expectant (black). Tag patients with appropriate color. Establish treatment area. Coordinate transport to distribute patients across receiving hospitals (avoid overwhelming any single facility). Document decisions.",
      complications: "Over-triage (sending minor patients as immediate, depleting resources), under-triage (missing critical patients who deteriorate), communication failures, freelancing (providers acting outside ICS structure), scene safety threats (secondary devices, structural collapse), provider stress and decision fatigue, and media interference.",
      pearls: [
        "The first-arriving paramedic should RESIST the urge to treat patients and instead establish command, assess the situation, and request resources — leadership saves more lives than individual treatment at an MCI",
        "Triage is a continuous process — patients must be reassessed at treatment areas because conditions change (delayed patients may become immediate, immediate patients may become expectant)",
        "Distribute patients across multiple hospitals — do not overwhelm the closest facility; coordinate with medical control and emergency management",
        "Do not spend more than 30 seconds on any patient during initial triage — START is designed to be rapid; detailed assessment occurs at the treatment area"
      ],
      pitfalls: [
        "Tunnel vision — the first-arriving paramedic begins treating the first critical patient instead of establishing command and performing triage",
        "Not requesting enough resources early — it is always better to request more than needed and cancel them than to under-request and delay care",
        "Attempting to provide normal individual care during an MCI — this results in excellent care for a few patients while many others receive no care",
        "Not establishing scene safety — secondary hazards (structural collapse, secondary explosive devices, hazmat) can cause additional casualties among responders"
      ],
      faq: [
        { question: "How does the START triage system work?", answer: "START uses a 30-second assessment per patient: (1) Can the patient walk? If YES → MINOR (green). (2) Is the patient breathing? If NO after repositioning airway → EXPECTANT (black). If YES → assess rate: >30/min → IMMEDIATE (red). (3) Check perfusion: radial pulse absent or capillary refill >2 seconds → IMMEDIATE (red). (4) Mental status: cannot follow simple commands → IMMEDIATE (red). If breathing <30/min, perfusion adequate, and follows commands → DELAYED (yellow)." },
        { question: "What is the role of the first-arriving paramedic at an MCI?", answer: "The first paramedic on scene should: (1) Establish Incident Command and communicate the situation (METHANE report: Major incident, Exact location, Type of incident, Hazards, Access/egress, Number of casualties, Emergency services needed). (2) Ensure scene safety. (3) Request appropriate resources based on estimated patient numbers. (4) Begin triage if safe to do so. (5) Establish a staging area for incoming resources. The natural instinct is to start treating patients — but establishing command and requesting resources saves far more lives at an MCI than any individual treatment." }
      ],
      keywords: ["mass casualty incident paramedic", "MCI management", "incident command system", "START triage", "disaster response EMS"],
      related: ["start-triage-system", "blast-injuries", "incident-command", "trauma"]
    },

    {
      title: "Helicopter EMS Operations",
      category: "Operations & Triage",
      overview: "Helicopter Emergency Medical Services (HEMS) provide rapid transport of critical patients to specialty centers (trauma, stroke, cardiac, burn, pediatric) and bring advanced medical capabilities to remote or inaccessible scenes. Understanding when to request HEMS and how to prepare a landing zone is an essential paramedic operational skill.",
      mechanism: "HEMS aircraft (typically medium twin-engine helicopters) carry specialized medical crews and equipment. They provide two primary benefits: speed (reducing time to definitive care for time-critical conditions like STEMI, stroke, and major trauma) and access (reaching patients in remote areas, congested traffic, or locations inaccessible to ground units). Flight crews are typically critical care-trained with expanded scopes of practice.",
      clinicalRelevance: "Early HEMS activation for appropriate patients reduces time to definitive care and improves outcomes in major trauma, STEMI, and stroke. However, HEMS carries inherent safety risks — helicopter EMS accidents account for a disproportionate number of EMS provider deaths. The decision to request HEMS must balance patient benefit against these risks.",
      signsSymptoms: "Indications for HEMS activation: prolonged extrication >20 minutes, significant mechanism with critical injuries, isolated scene with prolonged ground transport to appropriate facility (generally >30 minutes), mass casualty events, specialty center need (trauma, burn, pediatric, cardiac), and critical patients who will benefit from reduced transport time. NOT indicated for: stable patients, short ground transport times, or patients who can be adequately managed by ground units.",
      assessment: "Assess whether HEMS will meaningfully reduce time to definitive care (if the helicopter must travel 30 minutes to reach you and the hospital is 15 minutes by ground, HEMS adds time). Consider patient condition and time-sensitivity of the treatment needed. Assess landing zone availability and safety. Consider weather conditions (low ceiling, high winds, poor visibility may prevent HEMS operations).",
      management: "Landing zone (LZ) preparation: minimum 100 × 100 feet (60 × 60 for most programs), clear of wires/poles/trees, flat and firm surface, illuminated at night (vehicle headlights at corners — do NOT shine lights at the aircraft). LZ safety: secure loose items, keep bystanders 200+ feet away, never approach the aircraft from the rear (tail rotor danger), always approach from the downhill side on slopes, and ONLY approach when signaled by the pilot. Patient preparation: package and secure before helicopter arrival.",
      complications: "Aircraft accidents (weather, wire strikes, night operations), noise interference with communication, rotor wash hazards (debris, patient hypothermia), LZ hazards (wires, uneven terrain, soft ground), delayed departure for weather holds, and over-utilization (requesting HEMS when ground transport is equally appropriate, exposing crews to unnecessary risk).",
      pearls: [
        "Activate HEMS EARLY if it may be needed — it takes time for the aircraft to launch and arrive; the most common error is late activation",
        "NEVER approach a helicopter without a signal from the pilot or crew — rotor systems, hot exhaust, and tail rotors are invisible hazards",
        "The decision to request HEMS should be based on TIME SAVINGS to definitive care, not just patient acuity — if ground transport is faster, use it",
        "At night, illuminate the LZ corners with vehicle headlights but NEVER shine lights at the aircraft — this blinds the pilot during the most critical phase of flight"
      ],
      pitfalls: [
        "Late activation — requesting HEMS after spending 20 minutes on scene; activate early if there is any possibility the patient may benefit",
        "Approaching the helicopter from the rear — the tail rotor is nearly invisible and deadly; always approach from the front or designated side",
        "Not securing loose items in the LZ — rotor wash at 100+ mph can turn lightweight objects into dangerous projectiles",
        "Requesting HEMS for patients who will not benefit from reduced transport time — unnecessary flights expose crews to risk without patient benefit"
      ],
      faq: [
        { question: "When should a paramedic request helicopter transport?", answer: "Request HEMS when ALL of these criteria are met: (1) The patient has a time-critical condition (major trauma, STEMI, stroke, burns >20% TBSA). (2) HEMS will meaningfully reduce time to the appropriate specialty center. (3) The patient's condition will benefit from the reduced time or the advanced capabilities of the flight crew. (4) Weather and conditions allow safe flight operations. General rule: if ground transport to the appropriate facility exceeds 30 minutes and the patient has a time-critical condition, consider HEMS. Always discuss with medical control if uncertain." },
        { question: "What is the minimum landing zone size and how should it be prepared?", answer: "Minimum LZ size is typically 100 × 100 feet (30 × 30 meters), though some programs accept 60 × 60 feet in daylight. The LZ should be: flat and firm (no soft or muddy ground), free of obstacles (wires, poles, trees, signs) for at least 100 feet in all directions, cleared of loose debris (tarps, blankets, trash), and free of vehicles except those marking corners. At night, mark corners with vehicle headlights pointing INWARD (not at the sky). A designated LZ officer should maintain a clear zone and manage bystanders. Communicate LZ location, terrain, obstacles, and hazards to the pilot." }
      ],
      keywords: ["helicopter EMS paramedic", "HEMS operations", "landing zone preparation", "air medical transport", "helicopter safety EMS"],
      related: ["start-triage-system", "mass-casualty-incident-management", "trauma", "golden-hour"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Shock States (additional)
    // ═══════════════════════════════════════════

    {
      title: "Distributive Shock",
      category: "Shock States",
      overview: "Distributive shock is a circulatory failure caused by abnormal distribution of blood flow due to pathological vasodilation. It encompasses septic shock (most common), anaphylactic shock, and neurogenic shock. Despite adequate or increased cardiac output, insufficient vascular tone leads to inadequate tissue perfusion and organ dysfunction.",
      mechanism: "In distributive shock, widespread vasodilation increases vascular capacity beyond the available blood volume, reducing effective circulating volume and blood pressure. Septic shock: inflammatory mediators (TNF-alpha, IL-1, nitric oxide) cause vasodilation and capillary leak. Anaphylactic shock: histamine and other mediators cause vasodilation and bronchospasm. Neurogenic shock: loss of sympathetic tone below a spinal cord injury causes vasodilation and loss of cardiac sympathetic stimulation.",
      clinicalRelevance: "Distributive shock is the most common type of shock in medical patients. The key clinical feature is WARM shock — unlike cardiogenic and hypovolemic shock where the extremities are cool and clammy, distributive shock typically presents with warm, flushed skin (at least initially). This 'warm shock' presentation can delay recognition if paramedics expect all shock to look like cold, clammy hypovolemia.",
      signsSymptoms: "Common to all types: hypotension, tachycardia (except neurogenic — bradycardia), altered mental status, and decreased urine output. Septic shock: fever (or hypothermia in severe sepsis), infection source, tachypnea, warm/flushed skin early → cool/mottled late. Anaphylactic shock: urticaria, angioedema, bronchospasm, exposure to allergen. Neurogenic shock: bradycardia, warm/dry skin below injury level, recent spinal trauma.",
      assessment: "Identify the type of distributive shock by assessment: Septic — look for infection source (pneumonia, UTI, cellulitis, abdominal), fever, elevated WBC appearance. Anaphylactic — allergen exposure, urticaria, angioedema, wheezing. Neurogenic — spinal cord injury, bradycardia, warm skin below injury. Assess lactate and perfusion indicators: altered mental status, capillary refill, urine output. Remember that vital signs may appear 'normal' in early compensated distributive shock.",
      management: "All types: IV fluid resuscitation (30 mL/kg NS initial bolus for septic shock). Septic shock: fluids + vasopressors (norepinephrine first-line) if unresponsive to fluids; early antibiotics in hospital. Anaphylactic shock: epinephrine 0.3-0.5mg IM (FIRST), fluids, diphenhydramine, steroids. Neurogenic shock: cautious fluids + vasopressors (phenylephrine or norepinephrine), atropine for symptomatic bradycardia. Target MAP >65 mmHg.",
      complications: "Multi-organ dysfunction syndrome (MODS), acute respiratory distress syndrome (ARDS), acute kidney injury, DIC (especially septic shock), myocardial dysfunction, and death. Septic shock has 20-50% mortality even with optimal treatment. Anaphylactic shock mortality is <1% with prompt epinephrine. Neurogenic shock mortality depends on the spinal cord injury level.",
      pearls: [
        "Warm, flushed skin in a hypotensive patient should make you think distributive shock — not all shock presents with cold, clammy skin",
        "In septic shock, give 30 mL/kg crystalloid as rapidly as possible — under-resuscitation in the first hour is associated with significantly worse outcomes",
        "Neurogenic shock has a unique presentation: bradycardia + hypotension + warm skin — this triad distinguishes it from hemorrhagic shock in trauma patients",
        "Anaphylactic shock is the ONLY type of distributive shock where a single medication (epinephrine) can reverse the pathophysiology — give it immediately"
      ],
      pitfalls: [
        "Not recognizing warm shock as shock — hypotension with warm skin is still shock and requires aggressive treatment",
        "Under-resuscitating septic shock — these patients need aggressive volume replacement; 30 mL/kg may be just the starting point",
        "Treating neurogenic shock with fluids alone — vasodilation requires vasopressor support; fluids without vasopressors are often insufficient",
        "Delaying epinephrine in anaphylactic shock to give antihistamines or steroids — epinephrine is the ONLY drug that reverses the pathophysiology"
      ],
      faq: [
        { question: "How do you differentiate types of shock in the field?", answer: "Use the clinical picture: Hypovolemic — cold/clammy skin, tachycardia, obvious fluid loss (bleeding, dehydration). Cardiogenic — cold/clammy skin, JVD, pulmonary edema, cardiac history. Distributive (septic) — warm/flushed skin, fever, infection source, tachycardia. Distributive (anaphylactic) — warm skin, urticaria, allergen exposure, bronchospasm. Distributive (neurogenic) — warm skin, bradycardia, spinal injury. Obstructive — JVD, muffled heart sounds (tamponade) or absent breath sounds (tension pneumothorax). The temperature and moisture of the skin is often the most helpful distinguishing feature." },
        { question: "What is the difference between sepsis and septic shock?", answer: "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. Clinical criteria (qSOFA): altered mental status, respiratory rate ≥22, systolic BP ≤100 mmHg. Septic shock is sepsis with circulatory failure requiring vasopressors to maintain MAP ≥65 mmHg AND a lactate >2 mmol/L despite adequate fluid resuscitation. Essentially, septic shock is sepsis that does not respond to fluids. The mortality rate jumps from ~10% in sepsis to ~40% in septic shock." }
      ],
      keywords: ["distributive shock paramedic", "septic shock management", "warm shock assessment", "types of shock", "vasodilatory shock EMS"],
      related: ["shock-assessment-and-classification", "sepsis-and-septic-shock", "anaphylaxis-management", "spinal-cord-syndromes"]
    },

    {
      title: "Obstructive Shock",
      category: "Shock States",
      overview: "Obstructive shock occurs when mechanical obstruction impedes adequate cardiac output despite normal or increased intravascular volume. The three primary causes are tension pneumothorax, cardiac tamponade, and massive pulmonary embolism. All three are rapidly fatal without specific intervention and are potentially reversible causes of cardiac arrest.",
      mechanism: "Tension pneumothorax: progressive air accumulation in the pleural space compresses the vena cava and heart, reducing venous return and cardiac output. Cardiac tamponade: fluid (usually blood) in the pericardial space compresses the heart, preventing diastolic filling. Massive pulmonary embolism: clot lodged in the pulmonary vasculature obstructs blood flow through the lungs, preventing left ventricular filling and causing acute right heart failure.",
      clinicalRelevance: "Obstructive shock is one of the reversible causes of cardiac arrest (the 'T's in H's and T's: Tension pneumothorax, Tamponade, Thrombosis-pulmonary). Recognizing obstructive shock and performing the appropriate intervention (needle decompression, pericardiocentesis, or thrombolytics) can save a life that would otherwise be lost.",
      signsSymptoms: "Common: hypotension, tachycardia, JVD, and narrow pulse pressure. Tension pneumothorax: unilateral absent breath sounds, tracheal deviation (late), respiratory distress. Cardiac tamponade: Beck's triad (JVD, hypotension, muffled heart sounds), pulsus paradoxus (>10 mmHg BP drop during inspiration), electrical alternans on ECG. Massive PE: sudden dyspnea, pleuritic chest pain, hypoxia, right heart strain on ECG (S1Q3T3), syncope.",
      assessment: "Assess for the specific cause: Bilateral lung sounds? Present → consider tamponade or PE. Absent on one side → tension pneumothorax. JVD present? Expected in all three. Muffled heart sounds + JVD + hypotension → tamponade (Beck's triad). Recent immobilization, surgery, or DVT symptoms + sudden dyspnea + hypoxia → PE. Traumatic mechanism → tension pneumothorax or tamponade.",
      management: "Tension pneumothorax: needle decompression (14-gauge catheter, 2nd ICS MCL or 4-5th ICS AAL). Cardiac tamponade: prehospital management is limited — IV fluids to maximize preload, rapid transport to surgical center; pericardiocentesis only if trained and authorized. Massive PE: IV fluids, vasopressors, consider thrombolytics (tPA) per protocol for massive PE with cardiovascular collapse or arrest. All: treat as cardiac arrest if arrest occurs — these are REVERSIBLE causes.",
      complications: "Cardiac arrest (all three causes), death if not recognized and treated, iatrogenic injury from needle decompression or pericardiocentesis, bleeding from thrombolytics in PE, and multi-organ failure from prolonged inadequate perfusion.",
      pearls: [
        "Obstructive shock causes are in the 'T's of H's and T's — always consider tension pneumothorax, tamponade, and thrombosis (PE) in PEA arrest",
        "JVD + hypotension is the hallmark of obstructive shock — the heart cannot fill because something is obstructing it",
        "The key differentiator between tension pneumothorax and tamponade is BREATH SOUNDS — absent on one side = tension pneumothorax; bilateral = tamponade",
        "Consider thrombolytics (tPA) for massive PE causing cardiac arrest — this may be the only chance to restore pulmonary blood flow"
      ],
      pitfalls: [
        "Not considering obstructive causes of shock/arrest — tension pneumothorax and tamponade are TREATABLE causes of cardiac arrest that are missed if not actively sought",
        "Confusing obstructive shock with cardiogenic shock — both have JVD and hypotension, but treatment is completely different (obstructive requires removing the obstruction, not cardiac drugs)",
        "Not performing bilateral needle decompression in PEA arrest with possible thoracic trauma — the procedure takes 30 seconds and can be life-saving",
        "Giving excessive fluids without addressing the obstruction — fluids may temporarily improve preload but cannot overcome the mechanical obstruction"
      ],
      faq: [
        { question: "How do you differentiate obstructive from cardiogenic shock?", answer: "Both present with JVD and hypotension, but the clinical context differs. Cardiogenic shock: history of cardiac disease, pulmonary edema (crackles), often presents with acute MI or arrhythmia. Obstructive shock: sudden onset, usually with an identifiable trigger (trauma, recent surgery/immobilization). Specific obstructive findings: absent breath sounds on one side (tension pneumo), muffled heart sounds (tamponade), or sudden dyspnea with hypoxia in a patient at risk for PE. Cardiogenic has bilateral crackles; obstructive typically has clear lungs (except tension pneumo which has absent sounds)." },
        { question: "When should thrombolytics be considered for PE in the prehospital setting?", answer: "Thrombolytics (tPA) should be considered for massive PE with: (1) Cardiovascular collapse (hypotension unresponsive to fluids), (2) PEA cardiac arrest suspected to be from PE, or (3) Severe right heart failure. The decision should be made in consultation with medical control when possible. Standard dose: tPA 50-100mg IV. After administration, CPR should continue for 60-90 minutes to allow the thrombolytic to work. This is a high-risk intervention (bleeding complications) but may be the only chance for survival in massive PE with arrest." }
      ],
      keywords: ["obstructive shock paramedic", "cardiac tamponade management", "massive pulmonary embolism", "tension pneumothorax shock", "reversible causes cardiac arrest"],
      related: ["tension-pneumothorax-management", "cardiac-tamponade", "pulmonary-embolism", "cardiac-arrest-management"]
    },

  ];
}
