import type { LessonContent } from "./types";

export const echoCoreLesson: Record<string, LessonContent> = {
  "echo-cardiac-anatomy": {
    title: "Cardiac Anatomy for Echocardiography",
    cellular: {
      title: "Cardiac Structural Anatomy",
      content: "The heart is a four-chambered muscular organ located in the mediastinum. The right atrium (RA) receives deoxygenated blood from the superior and inferior vena cavae and coronary sinus. The right ventricle (RV) is a crescent-shaped chamber that pumps blood to the pulmonary arteries. The left atrium (LA) receives oxygenated blood from four pulmonary veins. The left ventricle (LV) is the thickest chamber (8-12 mm in diastole) and generates systemic arterial pressure. The interventricular septum (IVS) separates the ventricles and moves with the LV during systole. Four cardiac valves ensure unidirectional flow: the tricuspid (3 leaflets) and mitral (2 leaflets, also called bicuspid) are atrioventricular valves, while the pulmonic and aortic are semilunar valves. The aortic valve typically has three cusps (right coronary, left coronary, non-coronary). The mitral valve apparatus includes the annulus, anterior and posterior leaflets, chordae tendineae, and papillary muscles. The coronary arteries arise from the aortic sinuses of Valsalva: the left main coronary artery bifurcates into the LAD and circumflex, while the RCA supplies the inferior wall and RV. Cardiac sonographers must identify all structures in every standard echocardiographic window. US certification: ARDMS RDCS-AE and CCI RCS both heavily test cardiac anatomy identification. Canadian certification: CSCT Cardiac Sonography also requires mastery of cardiac anatomy on echo."
    },
    riskFactors: [
      "Congenital structural variants (bicuspid aortic valve in 1-2% of population)",
      "Coronary artery dominance variations (right dominant 85%, left dominant 8%, co-dominant 7%)",
      "Persistent left SVC draining to coronary sinus (0.3-0.5%)",
      "Patent foramen ovale present in 25% of adults",
      "Ebstein anomaly with apical displacement of tricuspid valve",
      "Coronary artery anomalies affecting imaging approach"
    ],
    diagnostics: [
      "Parasternal long-axis (PLAX) for LV, LA, aortic root, mitral and aortic valves",
      "Parasternal short-axis (PSAX) at aortic valve level for coronary cusps",
      "Apical four-chamber (A4C) for all four chambers, interatrial and interventricular septa",
      "Subcostal view for IVC, hepatic veins, and atrial septum (best for ASD detection)",
      "Apical two-chamber for anterior and inferior LV walls",
      "Suprasternal notch for aortic arch and great vessels"
    ],
    management: [
      "Measure LV internal dimensions in diastole (LVIDd) from PLAX (normal 3.5-5.6 cm)",
      "Measure interventricular septum and posterior wall thickness (normal 0.6-1.1 cm)",
      "Assess aortic root diameter at sinuses of Valsalva (normal 2.0-3.7 cm)",
      "Measure LA anteroposterior diameter from PLAX (normal < 4.0 cm)",
      "Evaluate mitral valve leaflet morphology and motion",
      "Identify coronary artery ostia from PSAX aortic valve level"
    ],
    nursingActions: [
      "Position patient in left lateral decubitus for parasternal and apical views",
      "Identify all four chambers and document relative sizes",
      "Assess wall thickness for hypertrophy or thinning",
      "Evaluate valve morphology in multiple views",
      "Document any structural variants or congenital abnormalities",
      "Correlate anatomical findings with clinical presentation"
    ],
    assessmentFindings: [
      "LV wall thickness > 12 mm suggests hypertrophy",
      "RV free wall > 5 mm indicates RV hypertrophy",
      "LA enlargement > 4.0 cm associated with atrial fibrillation risk",
      "Aortic root dilation > 4.0 cm requires monitoring for dissection risk",
      "Bicuspid aortic valve shows two cusps with raphe in PSAX",
      "Lipomatous hypertrophy of interatrial septum shows sparing of fossa ovalis"
    ],
    signs: [
      "Normal LV internal dimension in diastole 3.5-5.6 cm",
      "Normal IVS thickness 0.6-1.1 cm",
      "Normal posterior wall thickness 0.6-1.1 cm",
      "Normal aortic root 2.0-3.7 cm",
      "Normal LA diameter < 4.0 cm",
      "Normal RV basal diameter < 4.1 cm"
    ],
    medications: [],
    pearls: [
      "The RV is the most anterior chamber -- it is closest to the transducer in parasternal views",
      "The moderator band is a normal RV structure that distinguishes it from the LV",
      "The mitral valve has TWO leaflets (bicuspid) while the tricuspid valve has THREE -- a common exam trap",
      "The non-coronary cusp of the aortic valve is adjacent to the interatrial septum",
      "ARDMS RDCS-AE, CCI RCS, and CSCT exams all test identification of structures in standard echo windows",
      "The eustachian valve (IVC valve remnant) is a normal RA structure that should not be mistaken for pathology"
    ],
    quiz: [
      { question: "Which cardiac chamber has the thickest wall?", options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"], correct: 3, rationale: "The LV wall is 8-12 mm thick in diastole, significantly thicker than the RV (3-5 mm) because it generates systemic arterial pressure." },
      { question: "How many leaflets does the mitral valve have?", options: ["One", "Two", "Three", "Four"], correct: 1, rationale: "The mitral (bicuspid) valve has two leaflets: anterior and posterior. The tricuspid valve has three leaflets." },
      { question: "From which echocardiographic view is the aortic root diameter best measured?", options: ["Apical four-chamber", "Subcostal", "Parasternal long-axis", "Suprasternal notch"], correct: 2, rationale: "The PLAX view provides the standard measurement of the aortic root at the sinuses of Valsalva, perpendicular to the long axis of the aorta." },
      { question: "What is the normal left atrial anteroposterior diameter?", options: ["< 2.0 cm", "< 3.0 cm", "< 4.0 cm", "< 5.0 cm"], correct: 2, rationale: "Normal LA AP diameter is < 4.0 cm measured from the PLAX view. Dilation above 4.0 cm is associated with increased atrial fibrillation risk." },
      { question: "Which structure distinguishes the RV from the LV on echocardiography?", options: ["Papillary muscles", "Moderator band", "Chordae tendineae", "Coronary sinus"], correct: 1, rationale: "The moderator band is a muscular structure unique to the RV that carries the right bundle branch. Its presence confirms RV identification." },
      { question: "The left main coronary artery bifurcates into which two vessels?", options: ["RCA and circumflex", "LAD and RCA", "LAD and circumflex", "Circumflex and PDA"], correct: 2, rationale: "The left main coronary artery divides into the left anterior descending (LAD) and the left circumflex (LCx) arteries." }
    ]
  },

  "echo-cardiac-physiology": {
    title: "Cardiac Physiology for Echocardiography",
    cellular: {
      title: "Cardiac Cycle and Electromechanical Coupling",
      content: "The cardiac cycle consists of systole (contraction) and diastole (relaxation). Isovolumetric contraction occurs when all valves are closed and ventricular pressure rises rapidly. When LV pressure exceeds aortic pressure, the aortic valve opens and ejection begins. Isovolumetric relaxation follows aortic valve closure (producing the dicrotic notch) until LV pressure falls below LA pressure, opening the mitral valve. Early diastolic filling (E wave on Doppler) occurs passively as the ventricle relaxes and creates a suction effect. Late diastolic filling (A wave) results from atrial contraction. Normal E/A ratio is > 1 in young adults. The Frank-Starling mechanism states that increased preload (end-diastolic volume) increases stroke volume up to a physiological limit. Afterload is the resistance the ventricle must overcome to eject blood, approximated by systemic vascular resistance for the LV. Contractility (inotropy) is the intrinsic force of contraction independent of preload and afterload. Cardiac output equals stroke volume multiplied by heart rate (CO = SV × HR). Normal cardiac output is 4-8 L/min and cardiac index (CO/BSA) is 2.5-4.0 L/min/m². Echocardiography evaluates all these physiological parameters noninvasively. ARDMS RDCS-AE, CCI RCS, and CSCT certification exams extensively test hemodynamic physiology concepts."
    },
    riskFactors: [
      "Age-related changes in diastolic function (E/A reversal after age 60)",
      "Hypertension increasing afterload and causing LVH",
      "Coronary artery disease reducing contractility in affected segments",
      "Atrial fibrillation eliminating the A wave contribution to filling",
      "Tachycardia reducing diastolic filling time",
      "Valvular disease altering normal pressure-volume relationships"
    ],
    diagnostics: [
      "M-mode through mitral valve for E-point septal separation (EPSS)",
      "Pulsed-wave Doppler at mitral leaflet tips for E and A wave velocities",
      "Tissue Doppler at mitral annulus for e' and a' velocities",
      "LVOT pulsed-wave Doppler for stroke volume calculation",
      "Continuous-wave Doppler across aortic valve for peak velocity",
      "Strain imaging (speckle tracking) for regional and global contractility"
    ],
    management: [
      "Calculate stroke volume as LVOT area × LVOT VTI",
      "Determine cardiac output as SV × HR",
      "Assess preload using IVC diameter and respiratory variation",
      "Evaluate afterload through blood pressure and SVR estimation",
      "Grade diastolic function using E/A ratio, e', E/e', and TR velocity",
      "Monitor contractility changes with serial EF and strain measurements"
    ],
    nursingActions: [
      "Measure LVOT diameter carefully -- error is squared in area calculation",
      "Record LVOT VTI from apical five-chamber view with PW Doppler",
      "Obtain mitral inflow at leaflet tips with sample volume 1-3 mm",
      "Measure tissue Doppler e' at both septal and lateral annulus",
      "Document heart rate at time of Doppler measurements",
      "Average 3 beats in sinus rhythm, 5-10 beats in atrial fibrillation"
    ],
    assessmentFindings: [
      "Reduced EF < 40% indicates systolic dysfunction",
      "E/A ratio < 0.8 with normal e' suggests impaired relaxation (Grade I diastolic dysfunction)",
      "E/e' > 14 indicates elevated LV filling pressures",
      "LVOT VTI < 18 cm suggests reduced stroke volume",
      "Cardiac index < 2.2 L/min/m² indicates cardiogenic shock",
      "EPSS > 7 mm correlates with reduced EF"
    ],
    signs: [
      "Normal LVEF 55-70% by biplane Simpson method",
      "Normal E/A ratio 1.0-2.0 in adults < 60 years",
      "Normal septal e' velocity > 7 cm/s",
      "Normal lateral e' velocity > 10 cm/s",
      "Normal LVOT VTI 18-22 cm",
      "Normal cardiac output 4-8 L/min"
    ],
    medications: [
      { name: "Dobutamine", type: "Inotrope", action: "Beta-1 agonist increasing contractility and heart rate", sideEffects: "Tachycardia, arrhythmias, hypotension at high doses", contra: "LVOT obstruction (HCM), severe aortic stenosis", pearl: "Used in stress echocardiography and low-flow low-gradient aortic stenosis evaluation" },
      { name: "Milrinone", type: "Inodilator", action: "PDE-3 inhibitor increasing contractility and causing vasodilation", sideEffects: "Hypotension, arrhythmias, thrombocytopenia", contra: "Severe aortic stenosis, hypovolemia", pearl: "Reduces afterload while increasing inotropy -- useful in decompensated heart failure" }
    ],
    pearls: [
      "Stroke volume = LVOT area × LVOT VTI -- the most important hemodynamic calculation in echo",
      "LVOT diameter is measured in mid-systole from PLAX, just below the aortic valve",
      "The E wave represents passive early filling, the A wave represents atrial kick",
      "In atrial fibrillation, there is no A wave -- diastolic assessment requires alternative parameters",
      "ARDMS/CCI US exams and CSCT Canadian exams all test cardiac output calculation",
      "Frank-Starling curve explains why increasing preload improves output up to a plateau"
    ],
    quiz: [
      { question: "What is the formula for cardiac output?", options: ["EF × EDV", "SV × HR", "MAP / SVR", "LVOT area × LVOT VTI"], correct: 1, rationale: "Cardiac output = Stroke Volume × Heart Rate. Normal CO is 4-8 L/min." },
      { question: "Which Doppler measurement best estimates LV filling pressures?", options: ["E/A ratio", "E/e' ratio", "Deceleration time", "A wave duration"], correct: 1, rationale: "E/e' ratio > 14 reliably indicates elevated LV filling pressures (elevated PCWP). It combines mitral inflow and tissue Doppler data." },
      { question: "What is the normal resting left ventricular ejection fraction?", options: ["30-45%", "40-55%", "55-70%", "70-85%"], correct: 2, rationale: "Normal LVEF is 55-70% by biplane Simpson method. EF < 40% indicates systolic dysfunction." },
      { question: "During which phase of the cardiac cycle are all four valves closed?", options: ["Rapid ejection", "Isovolumetric contraction", "Early diastolic filling", "Atrial systole"], correct: 1, rationale: "During isovolumetric contraction, the mitral valve has closed and the aortic valve has not yet opened. LV pressure rises rapidly with no change in volume." },
      { question: "What does an LVOT VTI of 14 cm suggest?", options: ["Normal stroke volume", "Reduced stroke volume", "Aortic stenosis", "Mitral regurgitation"], correct: 1, rationale: "Normal LVOT VTI is 18-22 cm. A VTI of 14 cm indicates reduced stroke volume, suggesting low cardiac output." }
    ]
  },

  "echo-imaging-views": {
    title: "Echocardiographic Imaging Views",
    cellular: {
      title: "Standard Transthoracic Echo Windows and Views",
      content: "Transthoracic echocardiography (TTE) acquires images from four primary acoustic windows: parasternal, apical, subcostal, and suprasternal. The parasternal window (left 3rd-4th intercostal space, parasternal) provides the parasternal long-axis (PLAX) and short-axis (PSAX) views. PLAX shows the RV, IVS, LV, mitral valve, aortic valve, LA, and descending aorta. PSAX at the aortic valve level shows the three aortic cusps, LA, RA, TV, RVOT, pulmonic valve, and proximal PA. PSAX at the mitral valve level shows the anterior and posterior leaflets as a 'fish mouth.' PSAX at the papillary muscle level shows the LV as a circle with posteromedial and anterolateral papillary muscles -- this is the standard level for wall motion analysis. The apical window (at the point of maximal impulse) provides the four-chamber (A4C), two-chamber (A2C), three-chamber (A3C/apical long-axis), and five-chamber views. A4C displays all four chambers simultaneously and is the single most important view. The subcostal window (subxiphoid, patient supine) is critical in patients with poor parasternal windows and best for IVC assessment, pericardial effusion, and atrial septum evaluation. The suprasternal notch view shows the aortic arch and branch vessels. Each window provides unique diagnostic information and all are required for a comprehensive examination. ARDMS RDCS-AE, CCI RCS (US), and CSCT (Canada) all require demonstration of standard view acquisition."
    },
    riskFactors: [
      "Obesity limiting parasternal and apical acoustic windows",
      "COPD with hyperinflation pushing heart away from chest wall",
      "Mechanical ventilation introducing lung artifact",
      "Post-sternotomy patients with altered anatomy",
      "Chest wall deformities (pectus excavatum, scoliosis)",
      "Left pneumonectomy shifting mediastinal structures"
    ],
    diagnostics: [
      "PLAX: LV dimensions, aortic root, mitral and aortic valve assessment",
      "PSAX aortic level: Aortic valve morphology, coronary ostia, ASD detection",
      "PSAX papillary level: Wall motion analysis, 16/17-segment model",
      "A4C: Chamber comparison, EF calculation, mitral and tricuspid valve",
      "Subcostal: IVC for RAP estimation, atrial septum for PFO/ASD, pericardial effusion",
      "Suprasternal: Aortic arch coarctation, aortic dissection flap"
    ],
    management: [
      "Start with PLAX for orientation and initial assessment",
      "Rotate 90° clockwise from PLAX for PSAX views",
      "Sweep PSAX from base (aortic level) to apex for complete assessment",
      "Move to apex for four-chamber view with patient in left lateral decubitus",
      "Angle anteriorly from A4C to obtain five-chamber view showing LVOT",
      "Use subcostal approach when parasternal and apical windows are inadequate"
    ],
    nursingActions: [
      "Optimize each view by adjusting depth, gain, and transducer pressure",
      "Acquire all standard views systematically before adding Doppler",
      "Document any views that could not be obtained and reason",
      "Use harmonic imaging to improve endocardial border definition",
      "Position marker dot toward right shoulder for PLAX, toward left shoulder for A4C",
      "Apply adequate acoustic coupling gel and maintain firm skin contact"
    ],
    assessmentFindings: [
      "Wall motion abnormalities in coronary artery territory distributions",
      "Pericardial effusion appears as echo-free space surrounding the heart",
      "Pleural effusion seen posterior and lateral to the descending aorta in PLAX",
      "Atrial septal dropout on subcostal view suggests ASD",
      "Dilated IVC with absent collapse indicates elevated right-sided pressures",
      "Aortic dissection flap visible in suprasternal and PLAX views"
    ],
    signs: [
      "Normal PLAX shows RV anterior, LV and LA posterior",
      "PSAX at papillary level shows LV as symmetric circle",
      "A4C shows RV larger than LV suggests RV dilation",
      "IVC < 2.1 cm with > 50% collapse indicates normal RAP (3 mmHg)",
      "IVC > 2.1 cm with < 50% collapse indicates elevated RAP (15 mmHg)",
      "Apical foreshortening falsely reduces EF measurement"
    ],
    medications: [],
    pearls: [
      "The apical four-chamber view is the single most important echocardiographic view",
      "Always obtain subcostal IVC view -- it is the only way to estimate RAP noninvasively",
      "Apical foreshortening is the most common error in EF calculation -- ensure true apex is imaged",
      "The descending aorta posterior to the LA in PLAX distinguishes it from pericardial effusion",
      "US exams (ARDMS/CCI) and Canadian CSCT exam test systematic view acquisition and optimization",
      "In ventilated patients, subcostal may be the only available window"
    ],
    quiz: [
      { question: "Which echocardiographic view demonstrates all four cardiac chambers simultaneously?", options: ["Parasternal long-axis", "Parasternal short-axis at mitral level", "Apical four-chamber", "Subcostal IVC view"], correct: 2, rationale: "The apical four-chamber (A4C) view shows all four chambers, both AV valves, and both septa simultaneously." },
      { question: "What is the best view for evaluating the atrial septum for ASD?", options: ["PLAX", "PSAX at aortic level", "Apical four-chamber", "Subcostal four-chamber"], correct: 3, rationale: "The subcostal view provides the best perpendicular alignment to the atrial septum, making it the most sensitive transthoracic view for detecting ASD and PFO." },
      { question: "At which PSAX level is wall motion analysis best performed?", options: ["Aortic valve level", "Mitral valve level", "Papillary muscle level", "Apical level"], correct: 2, rationale: "The PSAX at the papillary muscle level shows the LV as a symmetric circle, allowing assessment of all major coronary artery territories for wall motion abnormalities." },
      { question: "What causes apical foreshortening in echo?", options: ["Too much gain", "Transducer positioned too laterally, not at true apex", "Incorrect frequency selection", "Excessive depth setting"], correct: 1, rationale: "Apical foreshortening occurs when the transducer is not positioned at the true cardiac apex, resulting in an oblique cut that shortens the LV and underestimates volumes and EF." },
      { question: "Which view best demonstrates the aortic arch?", options: ["PLAX", "PSAX", "Apical five-chamber", "Suprasternal notch"], correct: 3, rationale: "The suprasternal notch view provides the best visualization of the aortic arch, its branch vessels, and is used to detect coarctation or aortic arch pathology." }
    ]
  },

  "echo-doppler-ultrasound": {
    title: "Doppler Ultrasound in Echocardiography",
    cellular: {
      title: "Doppler Physics and Cardiac Applications",
      content: "The Doppler effect describes the frequency shift that occurs when sound waves reflect off moving objects (red blood cells in echocardiography). The Doppler equation relates the frequency shift to blood flow velocity: V = (Δf × c) / (2 × f₀ × cos θ), where θ is the angle between the ultrasound beam and blood flow direction. Accurate Doppler measurements require alignment within 20° of flow direction (cos 20° = 0.94, only 6% error). Three Doppler modalities are used: pulsed-wave (PW), continuous-wave (CW), and color flow. PW Doppler uses a single crystal alternating between transmitting and receiving, providing spatial specificity (range resolution) but limited by the Nyquist limit (maximum detectable velocity = PRF/2). Aliasing occurs when velocity exceeds the Nyquist limit. CW Doppler uses two crystals (one transmitting, one receiving continuously), measuring any velocity without aliasing but lacking range resolution (records all velocities along the beam). CW Doppler is essential for high-velocity jets in stenosis. Color flow Doppler is a multi-gate PW technique displaying flow direction and velocity as a color map (conventionally: red toward transducer, blue away -- BART: Blue Away, Red Toward). Tissue Doppler imaging (TDI) uses low-velocity, high-amplitude filters to measure myocardial tissue velocities rather than blood flow. All Doppler modalities are tested on ARDMS RDCS-AE, CCI RCS, and CSCT exams."
    },
    riskFactors: [
      "Beam-flow angle > 20° causing velocity underestimation",
      "Aliasing in PW Doppler when velocity exceeds Nyquist limit",
      "Signal contamination from wall motion artifact",
      "Inadequate gain causing missed low-velocity flow signals",
      "Respiratory motion shifting sample volume position",
      "Tachycardia causing overlap of E and A waves"
    ],
    diagnostics: [
      "PW Doppler at LVOT for stroke volume calculation (sample volume just proximal to AV)",
      "CW Doppler across aortic valve for peak gradient (4V²) in aortic stenosis",
      "PW Doppler at mitral leaflet tips for E and A wave velocities",
      "CW Doppler across tricuspid valve for TR jet velocity (PASP estimation)",
      "Color flow Doppler for regurgitant jet visualization and direction",
      "Tissue Doppler at mitral annulus for e' and a' myocardial velocities"
    ],
    management: [
      "Align Doppler cursor parallel to blood flow direction for accurate velocity",
      "Use PW Doppler for localized measurements (LVOT, mitral inflow)",
      "Use CW Doppler for high-velocity jets (stenotic valves, TR jet)",
      "Adjust color Doppler scale (Nyquist limit) to optimize flow visualization",
      "Lower wall filter settings for tissue Doppler to capture myocardial motion",
      "Increase PRF to raise Nyquist limit and reduce aliasing in PW Doppler"
    ],
    nursingActions: [
      "Place PW sample volume precisely at the structure of interest",
      "Ensure spectral Doppler envelope is clean with clear modal velocity",
      "Measure peak velocity at the outer edge of the spectral envelope",
      "Trace VTI along the modal velocity for accurate integration",
      "Document angle correction if used (prefer parallel alignment instead)",
      "Record all Doppler measurements with the patient in a consistent position"
    ],
    assessmentFindings: [
      "Aortic stenosis: CW peak velocity > 4 m/s indicates severe stenosis",
      "Mitral regurgitation: Systolic color jet from LV into LA",
      "PASP estimation: PASP = 4(TR velocity)² + estimated RAP",
      "Diastolic dysfunction: E/e' > 14 indicates elevated filling pressures",
      "Aliasing on PW Doppler suggests velocity exceeds Nyquist limit",
      "Laminar flow shows narrow spectral envelope; turbulent flow shows spectral broadening"
    ],
    signs: [
      "Normal aortic valve peak velocity < 2.0 m/s",
      "Normal mitral E velocity 0.6-1.3 m/s",
      "Normal LVOT peak velocity 0.7-1.1 m/s",
      "Normal TR jet velocity < 2.8 m/s",
      "Normal tissue Doppler septal e' > 7 cm/s",
      "Normal tissue Doppler lateral e' > 10 cm/s"
    ],
    medications: [],
    pearls: [
      "BART: Blue Away, Red Toward -- the color Doppler convention (but can be reversed on some machines)",
      "CW Doppler cannot localize where the velocity occurs -- always confirm location with PW first",
      "The modified Bernoulli equation (ΔP = 4V²) converts velocity to pressure gradient -- memorize this",
      "Increasing PRF raises the Nyquist limit but reduces maximum imaging depth",
      "Tissue Doppler e' is relatively preload-independent, making it valuable for diastolic assessment",
      "Doppler physics is heavily tested on ARDMS SPI, RDCS-AE, CCI RCS, and CSCT exams"
    ],
    quiz: [
      { question: "Which Doppler modality can measure high-velocity jets without aliasing?", options: ["Pulsed-wave Doppler", "Continuous-wave Doppler", "Color flow Doppler", "Tissue Doppler imaging"], correct: 1, rationale: "CW Doppler uses two crystals operating continuously, eliminating the Nyquist limit and allowing measurement of any velocity without aliasing." },
      { question: "What does the acronym BART stand for in color Doppler?", options: ["Blood Away, Red Toward", "Blue Away, Red Toward", "Blue Anterior, Red Terminal", "Blood Arterial, Red Turbulent"], correct: 1, rationale: "BART = Blue Away, Red Toward. This convention indicates flow direction relative to the transducer." },
      { question: "What happens when blood flow velocity exceeds the Nyquist limit in PW Doppler?", options: ["Signal disappears", "Aliasing occurs", "Resolution improves", "Frequency increases"], correct: 1, rationale: "Aliasing occurs when the velocity exceeds PRF/2 (Nyquist limit). The spectral display wraps around, showing the peak velocity on the opposite side of the baseline." },
      { question: "For accurate Doppler velocity measurement, the beam-flow angle should be within:", options: ["5°", "10°", "20°", "45°"], correct: 2, rationale: "The Doppler angle should be within 20° of flow direction. At 20°, cos θ = 0.94, producing only 6% error. Beyond 20°, error increases significantly." },
      { question: "Tissue Doppler e' velocity is measured at which location?", options: ["Aortic valve annulus", "Mitral leaflet tips", "Mitral annulus (septal and lateral)", "Pulmonary vein"], correct: 2, rationale: "TDI e' is measured at the mitral annulus (both septal and lateral) and reflects myocardial relaxation velocity during early diastole." }
    ]
  },

  "echo-valvular-disease": {
    title: "Valvular Disease Assessment on Echocardiography",
    cellular: {
      title: "Echocardiographic Evaluation of Valve Stenosis and Regurgitation",
      content: "Echocardiography is the primary imaging modality for diagnosing and quantifying valvular heart disease. Valve stenosis is characterized by restricted opening, resulting in increased transvalvular velocity and pressure gradient. The modified Bernoulli equation (ΔP = 4V²) converts Doppler peak velocity to peak instantaneous gradient. Aortic stenosis severity is graded by peak velocity (severe > 4 m/s), mean gradient (severe > 40 mmHg), and aortic valve area by continuity equation (severe < 1.0 cm²). Mitral stenosis is graded by mean gradient (severe > 10 mmHg), valve area by planimetry or pressure half-time (severe < 1.0 cm²), and PASP. Valve regurgitation assessment combines color Doppler jet visualization, vena contracta width, PISA (proximal isovelocity surface area) radius, and regurgitant volume/fraction. Mitral regurgitation is severe when EROA ≥ 0.40 cm², regurgitant volume ≥ 60 mL, or vena contracta ≥ 0.7 cm. Aortic regurgitation severity uses vena contracta (severe ≥ 0.6 cm), pressure half-time (severe < 200 ms), and holodiastolic flow reversal in the descending aorta. Right-sided valve disease uses similar principles but with different threshold values. Both ARDMS RDCS-AE/CCI RCS (US) and CSCT (Canada) certifications test valve disease quantification extensively."
    },
    riskFactors: [
      "Rheumatic heart disease (most common cause of mitral stenosis worldwide)",
      "Degenerative calcific disease (most common cause of aortic stenosis in elderly)",
      "Bicuspid aortic valve (most common cause of aortic stenosis in patients < 65)",
      "Infective endocarditis causing acute regurgitation",
      "Myxomatous degeneration causing mitral valve prolapse",
      "Ischemic papillary muscle dysfunction causing functional MR"
    ],
    diagnostics: [
      "CW Doppler across stenotic valve for peak and mean gradients",
      "Continuity equation for aortic valve area: AVA = (LVOT area × LVOT VTI) / AV VTI",
      "Pressure half-time for mitral valve area: MVA = 220 / PHT",
      "Color Doppler for regurgitant jet visualization",
      "Vena contracta width measurement at narrowest jet point",
      "PISA method for EROA and regurgitant volume calculation"
    ],
    management: [
      "Grade aortic stenosis: mild (Vmax 2.0-2.9), moderate (3.0-3.9), severe (≥ 4.0 m/s)",
      "Grade mitral stenosis by valve area: mild (1.5-2.0), moderate (1.0-1.5), severe (< 1.0 cm²)",
      "Assess regurgitation using integrated approach (jet area, vena contracta, PISA, chamber dilation)",
      "Evaluate chamber remodeling secondary to valve disease",
      "Assess pulmonary artery pressure in all valve disease patients",
      "Consider TEE for better valve visualization when TTE is inadequate"
    ],
    nursingActions: [
      "Obtain CW Doppler from multiple windows to capture highest velocity",
      "Measure vena contracta in the view that shows the narrowest jet width",
      "Quantify regurgitation using at least two independent methods",
      "Document associated findings (chamber dilation, LV function, PA pressure)",
      "Report severity grade using current ASE/EACVI guidelines",
      "Communicate critical findings (severe stenosis, acute regurgitation) immediately"
    ],
    assessmentFindings: [
      "Severe AS: Peak velocity ≥ 4.0 m/s, mean gradient ≥ 40 mmHg, AVA < 1.0 cm²",
      "Severe MS: MVA < 1.0 cm², mean gradient > 10 mmHg, PASP > 50 mmHg",
      "Severe MR: EROA ≥ 0.40 cm², regurgitant volume ≥ 60 mL, vena contracta ≥ 0.7 cm",
      "Severe AR: Vena contracta ≥ 0.6 cm, PHT < 200 ms, holodiastolic flow reversal in descending aorta",
      "Severe TR: Vena contracta ≥ 0.7 cm, hepatic vein systolic flow reversal",
      "Low-flow low-gradient AS: AVA < 1.0 cm² but mean gradient < 40 mmHg due to reduced EF"
    ],
    signs: [
      "Calcified aortic valve with restricted opening on 2D",
      "Doming of mitral valve leaflets in mitral stenosis",
      "Flail mitral leaflet with ruptured chordae in acute MR",
      "Color Doppler jet area as proportion of receiving chamber",
      "Coanda effect causing wall-hugging eccentric regurgitant jets",
      "Holodiastolic flow reversal in descending aorta indicating severe AR"
    ],
    medications: [
      { name: "Diuretics (Furosemide)", type: "Loop diuretic", action: "Reduce volume overload in regurgitant valve disease", sideEffects: "Hypokalemia, dehydration, hypotension", contra: "Severe aortic stenosis with fixed output (may worsen hypotension)", pearl: "Used to manage symptoms of valve disease but do not alter disease progression" },
      { name: "Beta-blockers", type: "Rate control", action: "Slow heart rate to prolong diastolic filling in mitral stenosis", sideEffects: "Bradycardia, fatigue, bronchospasm", contra: "Decompensated heart failure, severe bradycardia", pearl: "Beneficial in mitral stenosis by increasing diastolic filling time" }
    ],
    pearls: [
      "Always report the highest velocity obtained from any window -- underestimation is the most common error",
      "The continuity equation is based on conservation of mass: flow at LVOT = flow at AV",
      "Low-flow low-gradient AS is a diagnostic trap -- use dobutamine stress echo to distinguish true severe AS from pseudo-severe AS",
      "Eccentric MR jets (wall-hugging) appear smaller on color Doppler than their true severity -- use quantitative methods",
      "PISA radius is measured at the first aliasing boundary on color Doppler -- adjust Nyquist limit to optimize",
      "Valve disease grading is a major topic on ARDMS RDCS-AE, CCI RCS, and CSCT exams"
    ],
    quiz: [
      { question: "What peak aortic valve velocity indicates severe aortic stenosis?", options: ["≥ 2.0 m/s", "≥ 3.0 m/s", "≥ 4.0 m/s", "≥ 5.0 m/s"], correct: 2, rationale: "Severe AS is defined by peak velocity ≥ 4.0 m/s, mean gradient ≥ 40 mmHg, or AVA < 1.0 cm² per ASE guidelines." },
      { question: "Which formula calculates aortic valve area?", options: ["4V²", "220 / PHT", "(LVOT area × LVOT VTI) / AV VTI", "E/e'"], correct: 2, rationale: "The continuity equation: AVA = (LVOT area × LVOT VTI) / AV VTI. It is based on the principle that flow volume is equal at the LVOT and across the aortic valve." },
      { question: "What vena contracta width indicates severe mitral regurgitation?", options: ["≥ 0.3 cm", "≥ 0.5 cm", "≥ 0.7 cm", "≥ 1.0 cm"], correct: 2, rationale: "Severe MR is indicated by a vena contracta ≥ 0.7 cm. The vena contracta is measured at the narrowest point of the regurgitant jet as it passes through the valve orifice." },
      { question: "Holodiastolic flow reversal in the descending aorta indicates:", options: ["Severe aortic stenosis", "Severe mitral regurgitation", "Severe aortic regurgitation", "Severe tricuspid regurgitation"], correct: 2, rationale: "Holodiastolic flow reversal in the descending aorta (on PW Doppler) is a specific sign of severe aortic regurgitation, indicating significant retrograde flow volume." },
      { question: "The pressure half-time method is primarily used to calculate:", options: ["Aortic valve area", "Mitral valve area", "Tricuspid valve area", "LVOT area"], correct: 1, rationale: "MVA = 220 / PHT (pressure half-time in ms). This method estimates mitral valve area from the deceleration slope of the E wave." },
      { question: "In low-flow low-gradient aortic stenosis, what test helps differentiate true severe AS from pseudo-severe AS?", options: ["TEE", "Cardiac MRI", "Dobutamine stress echo", "CT calcium scoring"], correct: 2, rationale: "Dobutamine stress echo increases flow. In true severe AS, the valve area remains < 1.0 cm² with increased gradient. In pseudo-severe AS, the valve area increases above 1.0 cm² with flow augmentation." }
    ]
  },

  "echo-congenital-heart-defects": {
    title: "Congenital Heart Defects on Echocardiography",
    cellular: {
      title: "Echocardiographic Diagnosis of Congenital Cardiac Anomalies",
      content: "Congenital heart defects (CHDs) affect approximately 1% of live births and echocardiography is the primary diagnostic modality. CHDs are classified as acyanotic (left-to-right shunts) or cyanotic (right-to-left shunts). Acyanotic defects include atrial septal defect (ASD), ventricular septal defect (VSD), patent ductus arteriosus (PDA), and atrioventricular septal defect (AVSD). VSD is the most common CHD overall (25-30% of cases). ASDs are classified by location: secundum (most common, 75%), primum (associated with AVSD), sinus venosus (near SVC/IVC junction), and coronary sinus type. Cyanotic defects include Tetralogy of Fallot (TOF -- VSD, overriding aorta, RVOT obstruction, RV hypertrophy), transposition of the great arteries (TGA -- aorta arises from RV, PA from LV), truncus arteriosus, tricuspid atresia, and total anomalous pulmonary venous return (TAPVR). The segmental approach to CHD evaluation systematically identifies situs (atrial arrangement), AV connections, and ventriculoarterial connections. Echocardiographic assessment includes 2D morphology, color Doppler for shunt detection, and spectral Doppler for gradient measurement and Qp:Qs calculation. Both US certifications (ARDMS RDCS-AE, RDCS-PE, CCI RCS) and the Canadian CSCT credential test congenital heart disease recognition and quantification."
    },
    riskFactors: [
      "Maternal diabetes increasing CHD risk 3-5 fold",
      "Chromosomal abnormalities (Down syndrome: 40-50% have CHD, commonly AVSD)",
      "Family history of CHD (recurrence risk 2-6%)",
      "Maternal rubella or TORCH infections",
      "Teratogen exposure (alcohol, lithium, isotretinoin, anticonvulsants)",
      "Prematurity associated with PDA persistence"
    ],
    diagnostics: [
      "Subcostal view for atrial septum evaluation (most sensitive for ASD)",
      "Color Doppler across septum for left-to-right shunt detection",
      "PSAX at aortic level for secundum ASD and sinus venosus ASD",
      "Apical four-chamber for AVSD with common AV valve",
      "PSAX showing overriding aorta and VSD in Tetralogy of Fallot",
      "Suprasternal view for coarctation of the aorta"
    ],
    management: [
      "Use segmental approach: determine situs, AV connection, VA connection",
      "Quantify shunt with Qp:Qs ratio (Qp:Qs > 1.5 generally indicates hemodynamic significance)",
      "Estimate RV pressure from TR jet velocity in septal defects",
      "Assess for Eisenmenger syndrome (shunt reversal with pulmonary hypertension)",
      "Serial follow-up for small VSDs (many close spontaneously)",
      "Fetal echo screening at 18-22 weeks for high-risk pregnancies"
    ],
    nursingActions: [
      "Use pediatric transducers (5-8 MHz) for neonatal imaging",
      "Apply agitated saline contrast for PFO/ASD detection in adults",
      "Document shunt direction and estimate shunt ratio",
      "Assess right heart size for volume overload evidence",
      "Evaluate for associated anomalies (CHDs often occur in combination)",
      "Coordinate with pediatric or adult congenital cardiologist for complex defects"
    ],
    assessmentFindings: [
      "ASD: Color Doppler flow across atrial septum, RA/RV dilation, paradoxical septal motion",
      "VSD: Turbulent systolic jet across ventricular septum on color Doppler",
      "PDA: Continuous flow in PA on color/CW Doppler, LA/LV dilation",
      "TOF: VSD with overriding aorta, RVOT obstruction, RV hypertrophy",
      "TGA: Parallel great arteries ('egg on a string' shape) on subcostal views",
      "AVSD: Common AV valve, primum ASD, inlet VSD"
    ],
    signs: [
      "Dilated RA and RV with preserved LV size suggests ASD with volume overload",
      "Turbulent systolic jet across IVS indicates VSD",
      "Continuous retrograde flow in PA indicates PDA",
      "Boot-shaped heart silhouette on imaging in Tetralogy of Fallot",
      "Qp:Qs > 2.0 indicates large left-to-right shunt",
      "Reversal of shunt direction suggests Eisenmenger physiology"
    ],
    medications: [
      { name: "Prostaglandin E1 (Alprostadil)", dose: "0.01-0.1 mcg/kg/min IV", route: "Intravenous", purpose: "Maintain PDA patency in duct-dependent congenital heart lesions" },
      { name: "Indomethacin", dose: "0.1-0.25 mg/kg IV", route: "Intravenous", purpose: "Promote PDA closure in premature infants (inhibits prostaglandin synthesis)" }
    ],
    pearls: [
      "VSD is the most common CHD -- membranous perimembranous location is most frequent",
      "Secundum ASD is the most common ASD type (75%) and is amenable to device closure",
      "Dropout artifact on 2D can mimic ASD -- always confirm with color Doppler and saline contrast",
      "TOF has four components but VSD + RVOT obstruction are the two hemodynamically significant ones",
      "Qp:Qs = (RVOT VTI × RVOT area) / (LVOT VTI × LVOT area) -- measures shunt magnitude",
      "CHD questions appear on ARDMS RDCS-AE, RDCS-PE, CCI RCS, and CSCT exams"
    ],
    quiz: [
      { question: "What is the most common congenital heart defect?", options: ["Atrial septal defect", "Ventricular septal defect", "Patent ductus arteriosus", "Tetralogy of Fallot"], correct: 1, rationale: "VSD accounts for approximately 25-30% of all CHDs, making it the most common congenital heart defect." },
      { question: "Which ASD type is most common?", options: ["Primum", "Secundum", "Sinus venosus", "Coronary sinus"], correct: 1, rationale: "Secundum ASD is the most common type (75%), located at the fossa ovalis. Primum ASDs are associated with AVSD." },
      { question: "What are the four components of Tetralogy of Fallot?", options: ["ASD, VSD, PDA, coarctation", "VSD, overriding aorta, RVOT obstruction, RV hypertrophy", "ASD, mitral stenosis, TR, PDA", "VSD, aortic stenosis, PDA, LVH"], correct: 1, rationale: "TOF consists of: (1) VSD, (2) overriding aorta, (3) right ventricular outflow tract obstruction, and (4) RV hypertrophy." },
      { question: "Which medication maintains PDA patency in duct-dependent CHD?", options: ["Indomethacin", "Prostaglandin E1", "Digoxin", "Furosemide"], correct: 1, rationale: "PGE1 maintains ductal patency. Indomethacin does the opposite -- it promotes PDA closure by inhibiting prostaglandin synthesis." },
      { question: "A Qp:Qs ratio of 2.5 indicates:", options: ["Normal flow", "Small left-to-right shunt", "Large left-to-right shunt", "Right-to-left shunt"], correct: 2, rationale: "Qp:Qs > 1.5 indicates a hemodynamically significant left-to-right shunt. A ratio of 2.5 means pulmonary blood flow is 2.5 times systemic flow." }
    ]
  },

  "echo-cardiomyopathies": {
    title: "Cardiomyopathies on Echocardiography",
    cellular: {
      title: "Echocardiographic Features of Cardiomyopathy Types",
      content: "Cardiomyopathies are diseases of the heart muscle classified into dilated (DCM), hypertrophic (HCM), restrictive (RCM), arrhythmogenic right ventricular (ARVC), and unclassified types. Dilated cardiomyopathy shows four-chamber dilation with reduced systolic function (EF < 40%), thin walls, and increased sphericity index. Functional mitral and tricuspid regurgitation are common due to annular dilation. HCM is characterized by asymmetric septal hypertrophy (IVS > 15 mm or septum/posterior wall ratio > 1.3) often with systolic anterior motion (SAM) of the mitral valve causing dynamic LVOT obstruction. The LVOT gradient increases with Valsalva (reduced preload) and decreases with squatting (increased preload). Restrictive cardiomyopathy shows normal or mildly increased wall thickness, biatrial enlargement, normal or near-normal ventricular size, and severely impaired diastolic function with restrictive filling pattern (E/A >> 2, short deceleration time). Cardiac amyloidosis is a common cause showing diffuse wall thickening with a speckled/granular myocardial texture and reduced longitudinal strain with apical sparing pattern on speckle tracking. ARVC shows RV dilation, wall motion abnormalities, fatty/fibrofatty replacement, and RV aneurysms. Takotsubo cardiomyopathy shows apical ballooning with basal hyperkinesis in the acute phase. US (ARDMS/CCI) and Canadian (CSCT) certifications test cardiomyopathy differentiation."
    },
    riskFactors: [
      "Family history (30-50% of DCM and most HCM cases are familial/genetic)",
      "Chronic alcohol use (alcoholic cardiomyopathy)",
      "Viral myocarditis as a precursor to DCM",
      "Systemic diseases causing infiltrative CMP (amyloidosis, sarcoidosis, hemochromatosis)",
      "Peripartum period (peripartum cardiomyopathy)",
      "Chemotherapy agents (doxorubicin causing dose-dependent cardiotoxicity)"
    ],
    diagnostics: [
      "2D echo for chamber dimensions, wall thickness, and wall motion",
      "Biplane Simpson method for EF quantification in DCM",
      "M-mode for septal and posterior wall thickness measurement in HCM",
      "CW Doppler through LVOT for dynamic gradient in obstructive HCM",
      "Diastolic function assessment (E/A, DT, e', E/e') in RCM",
      "Global longitudinal strain (GLS) with apical sparing pattern for cardiac amyloidosis"
    ],
    management: [
      "Measure LV dimensions and EF serially in DCM for treatment response",
      "Provoke LVOT gradient with Valsalva maneuver in suspected HCM",
      "Differentiate constrictive pericarditis from RCM (annulus reversus, septal bounce)",
      "Use strain imaging to detect subclinical dysfunction before EF drops",
      "Evaluate RV size and function with TAPSE and FAC in ARVC",
      "Assess for intracardiac thrombus in dilated poorly contracting chambers"
    ],
    nursingActions: [
      "Document wall thickness, chamber dimensions, and EF accurately",
      "Measure LVOT gradient at rest and with provocation in HCM",
      "Assess for SAM and mitral regurgitation in HCM",
      "Evaluate diastolic function parameters in all cardiomyopathy types",
      "Screen for intracardiac thrombus especially in LV apex in DCM",
      "Compare findings with prior studies to assess disease progression"
    ],
    assessmentFindings: [
      "DCM: LV dilation (LVIDd > 5.6 cm), reduced EF, thin walls, functional MR",
      "HCM: IVS > 15 mm, SAM of mitral valve, dynamic LVOT gradient (dagger-shaped CW)",
      "RCM: Biatrial dilation, normal ventricle size, restrictive filling (E/A > 2, short DT)",
      "Amyloidosis: Diffuse thickening, granular sparkling texture, reduced GLS with apical sparing",
      "ARVC: RV dilation, RV wall motion abnormalities, RVOT dilation",
      "Takotsubo: Apical akinesis/dyskinesis with basal hyperkinesis (apical ballooning)"
    ],
    signs: [
      "Dilated poorly contractile LV with spherical shape in DCM",
      "Asymmetric septal hypertrophy with SAM in obstructive HCM",
      "Small LV cavity with massive LA in restrictive cardiomyopathy",
      "Ground-glass or granular sparkling myocardium in amyloidosis",
      "RV free wall aneurysm or dyskinesis in ARVC",
      "Regional wall motion abnormality matching Takotsubo pattern (not coronary territory)"
    ],
    medications: [
      { name: "Beta-blockers (Metoprolol)", type: "Negative inotrope/chronotrope", action: "Reduce LVOT gradient and improve diastolic filling in HCM", sideEffects: "Bradycardia, fatigue, hypotension", contra: "Decompensated heart failure, severe asthma", pearl: "First-line medical therapy for symptomatic obstructive HCM" },
      { name: "ACE Inhibitors (Enalapril)", type: "Afterload reducer", action: "Reduce afterload and improve remodeling in DCM", sideEffects: "Cough, hyperkalemia, angioedema", contra: "Bilateral renal artery stenosis, pregnancy", pearl: "Standard heart failure therapy reducing mortality in DCM" },
      { name: "Mavacamten", type: "Cardiac myosin inhibitor", action: "Reduces LVOT obstruction by decreasing excessive contractility in HCM", sideEffects: "Heart failure risk, reduced EF", contra: "LVEF < 55%, severe heart failure", pearl: "First targeted therapy for obstructive HCM (FDA approved 2022)" }
    ],
    pearls: [
      "The 'dagger-shaped' CW Doppler signal is characteristic of dynamic LVOT obstruction in HCM",
      "Valsalva increases LVOT gradient in HCM -- the opposite of what happens in fixed aortic stenosis",
      "Amyloidosis shows reduced voltage on ECG despite increased wall thickness -- a classic discrepancy",
      "Apical sparing strain pattern (bull's eye plot) is highly specific for cardiac amyloidosis",
      "RCM vs constrictive pericarditis: annulus reversus (e' septal > e' lateral) favors constriction",
      "Cardiomyopathy differentiation is heavily tested on ARDMS RDCS-AE, CCI RCS, and CSCT exams"
    ],
    quiz: [
      { question: "What echocardiographic finding is characteristic of hypertrophic cardiomyopathy?", options: ["LV dilation with thin walls", "Asymmetric septal hypertrophy with SAM", "Biatrial enlargement with normal ventricles", "RV dilation with wall motion abnormalities"], correct: 1, rationale: "HCM is characterized by asymmetric septal hypertrophy (IVS > 15 mm), systolic anterior motion (SAM) of the mitral valve, and often dynamic LVOT obstruction." },
      { question: "Which cardiomyopathy shows a granular sparkling myocardial texture?", options: ["Dilated cardiomyopathy", "Hypertrophic cardiomyopathy", "Cardiac amyloidosis", "Takotsubo cardiomyopathy"], correct: 2, rationale: "Cardiac amyloidosis characteristically shows diffuse wall thickening with a granular/sparkling myocardial echo texture due to amyloid protein infiltration." },
      { question: "How does the Valsalva maneuver affect the LVOT gradient in obstructive HCM?", options: ["Decreases the gradient", "Increases the gradient", "No effect", "Eliminates the gradient"], correct: 1, rationale: "Valsalva reduces preload, which decreases LV cavity size and worsens SAM and LVOT obstruction, increasing the gradient." },
      { question: "What strain pattern is characteristic of cardiac amyloidosis?", options: ["Global reduction in all segments", "Apical sparing with reduced basal strain", "Reduced apical strain with normal base", "Normal strain pattern"], correct: 1, rationale: "Cardiac amyloidosis shows reduced GLS with relative apical sparing -- the base and mid segments are most affected, creating a distinctive bull's eye pattern." },
      { question: "Which cardiomyopathy causes RV wall motion abnormalities and RV aneurysms?", options: ["Dilated cardiomyopathy", "Hypertrophic cardiomyopathy", "Arrhythmogenic RV cardiomyopathy (ARVC)", "Restrictive cardiomyopathy"], correct: 2, rationale: "ARVC is characterized by fatty/fibrofatty replacement of RV myocardium causing RV dilation, wall motion abnormalities, and RV aneurysms, particularly at the RVOT." }
    ]
  },

  "echo-hemodynamics": {
    title: "Hemodynamic Assessment by Echocardiography",
    cellular: {
      title: "Noninvasive Hemodynamic Calculations and Clinical Applications",
      content: "Echocardiography enables comprehensive noninvasive hemodynamic assessment that previously required cardiac catheterization. The modified Bernoulli equation (ΔP = 4V²) is the foundation for converting Doppler velocities to pressure gradients. Pulmonary artery systolic pressure (PASP) is estimated from the tricuspid regurgitation (TR) jet velocity: PASP = 4(TRV)² + estimated right atrial pressure (RAP). RAP is estimated from IVC diameter and respiratory variation (IVC < 2.1 cm with > 50% collapse = 3 mmHg; IVC > 2.1 cm with < 50% collapse = 15 mmHg; intermediate = 8 mmHg). Stroke volume (SV) is calculated as LVOT cross-sectional area × LVOT velocity-time integral (VTI). LVOT area = π × (d/2)², where d is the LVOT diameter measured in PLAX. Cardiac output = SV × HR, and cardiac index = CO / BSA. The continuity equation determines aortic valve area: AVA = (LVOT area × LVOT VTI) / AV VTI. Diastolic function grading integrates mitral E/A ratio, lateral and septal e' velocities, E/e' average, TR velocity, and LA volume index. The dP/dt measurement from the MR jet CW Doppler signal estimates the rate of LV pressure rise (normal > 1200 mmHg/s; < 800 mmHg/s indicates severe dysfunction). The myocardial performance index (Tei index) combines systolic and diastolic function assessment. These calculations are core competencies tested on ARDMS RDCS-AE, CCI RCS, and CSCT certification exams."
    },
    riskFactors: [
      "LVOT diameter measurement error -- squared in area calculation amplifying inaccuracy",
      "Non-parallel Doppler alignment underestimating true velocity",
      "Arrhythmias causing beat-to-beat hemodynamic variation",
      "Severe TR making PASP calculation unreliable (free TR has low velocity)",
      "Mitral annular calcification affecting tissue Doppler measurements",
      "Tachycardia causing E-A fusion preventing diastolic grading"
    ],
    diagnostics: [
      "PW Doppler at LVOT for VTI and stroke volume calculation",
      "CW Doppler across TR jet for PASP estimation",
      "Subcostal IVC assessment for RAP estimation",
      "Mitral inflow PW Doppler at leaflet tips for E and A velocities",
      "Tissue Doppler at septal and lateral mitral annulus for e' velocities",
      "CW Doppler across MR jet for dP/dt measurement (1-3 m/s velocity transition)"
    ],
    management: [
      "Measure LVOT diameter with extreme precision -- use zoom and leading edge to leading edge",
      "Average LVOT VTI over 3 beats in sinus rhythm, 5-10 beats in AF",
      "Grade diastolic function: I (impaired relaxation), II (pseudonormal), III (restrictive)",
      "Use Valsalva to unmask Grade II pseudonormal pattern (E/A reverses)",
      "Calculate PASP only when TR jet envelope is well-defined",
      "Integrate multiple parameters for diastolic grading -- no single parameter is sufficient"
    ],
    nursingActions: [
      "Measure LVOT diameter in mid-systole from PLAX inner edge to inner edge",
      "Obtain LVOT VTI from apical five-chamber view with PW sample volume just proximal to AV",
      "Record TR jet velocity from the view that gives the highest velocity",
      "Assess IVC from subcostal view during quiet respiration and sniff maneuver",
      "Calculate E/e' as average of septal and lateral e' values",
      "Report all hemodynamic calculations with units and reference ranges"
    ],
    assessmentFindings: [
      "PASP > 35 mmHg suggests pulmonary hypertension",
      "PASP > 60 mmHg indicates severe pulmonary hypertension",
      "Cardiac index < 2.2 L/min/m² indicates low cardiac output state",
      "E/e' average > 14 indicates elevated LV filling pressures",
      "dP/dt < 800 mmHg/s indicates severely impaired LV contractility",
      "LA volume index > 34 mL/m² indicates chronically elevated filling pressures"
    ],
    signs: [
      "Normal PASP < 35 mmHg",
      "Normal RAP 3-8 mmHg by IVC assessment",
      "Normal stroke volume 60-100 mL",
      "Normal cardiac output 4-8 L/min",
      "Normal cardiac index 2.5-4.0 L/min/m²",
      "Normal dP/dt > 1200 mmHg/s"
    ],
    medications: [],
    pearls: [
      "Modified Bernoulli equation: ΔP = 4V² -- the single most important formula in echocardiography",
      "PASP = 4(TRV)² + RAP -- the most commonly calculated hemodynamic parameter on echo",
      "LVOT diameter error is squared (area calculation) -- a 1 mm error changes SV by 10-15%",
      "E/e' ratio bridges invasive and noninvasive hemodynamics -- correlates with PCWP",
      "Diastolic grading requires integration of E/A, e', E/e', TR velocity, and LA volume index",
      "Hemodynamic calculations are the most heavily weighted topic on ARDMS RDCS-AE and CSCT exams"
    ],
    quiz: [
      { question: "A patient has a TR jet velocity of 3.0 m/s and estimated RAP of 8 mmHg. What is the PASP?", options: ["28 mmHg", "36 mmHg", "44 mmHg", "52 mmHg"], correct: 2, rationale: "PASP = 4(TRV)² + RAP = 4(3.0)² + 8 = 4(9) + 8 = 36 + 8 = 44 mmHg. This indicates pulmonary hypertension (> 35 mmHg)." },
      { question: "An IVC measures 2.5 cm with < 50% collapse on inspiration. The estimated RAP is:", options: ["3 mmHg", "8 mmHg", "15 mmHg", "20 mmHg"], correct: 2, rationale: "IVC > 2.1 cm with < 50% inspiratory collapse estimates RAP at approximately 15 mmHg, indicating elevated right-sided filling pressures." },
      { question: "What is the formula for stroke volume by echocardiography?", options: ["EF × EDV", "LVOT area × LVOT VTI", "4V²", "E/e' × LA volume"], correct: 1, rationale: "SV = LVOT cross-sectional area × LVOT VTI. LVOT area = π × (d/2)² where d is the LVOT diameter." },
      { question: "An E/e' ratio of 18 indicates:", options: ["Normal filling pressures", "Indeterminate filling pressures", "Elevated LV filling pressures", "Diastolic function cannot be assessed"], correct: 2, rationale: "E/e' > 14 indicates elevated LV filling pressures (correlates with elevated PCWP). E/e' of 18 clearly indicates elevated filling pressures." },
      { question: "What does a dP/dt of 600 mmHg/s indicate?", options: ["Normal LV contractility", "Mildly reduced contractility", "Severely impaired LV contractility", "Diastolic dysfunction"], correct: 2, rationale: "Normal dP/dt > 1200 mmHg/s. A value < 800 mmHg/s indicates severely impaired LV contractility. dP/dt is measured from the MR jet CW Doppler signal." },
      { question: "Which measurement has the greatest impact on stroke volume calculation accuracy?", options: ["LVOT VTI", "Heart rate", "LVOT diameter", "E wave velocity"], correct: 2, rationale: "The LVOT diameter measurement has the greatest impact because the error is squared when calculating LVOT area. A 1 mm error can change SV by 10-15%." }
    ]
  }
};
