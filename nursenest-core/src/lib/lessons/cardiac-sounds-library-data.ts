import type { CountryCode, TierCode } from "@prisma/client";
import type { CardiacWaveformId } from "@/lib/lessons/lesson-sound-waveform-synth";
import type { LessonSoundTierScope } from "@/lib/lessons/lesson-sound-library-scope";

/** Tiers that receive valve-specific / advanced murmur teaching — excludes foundational-only tracks. */
export const CARDIAC_ADVANCED_MURMUR_TIERS: TierCode[] = ["RN", "NP", "RPN", "LVN_LPN", "ALLIED", "NEW_GRAD"];

export type CardiacSoundCategory = "normal" | "extra_sounds" | "murmurs" | "abnormal";

export type CardiacSoundRecord = LessonSoundTierScope & {
  id: string;
  name: string;
  category: CardiacSoundCategory;
  timing: string;
  pitchQuality: string;
  description: string;
  auscultationSite: string;
  clinicalSignificance: string;
  commonCauses: string[];
  waveformType: CardiacWaveformId;
  countryNotes?: Partial<Record<CountryCode, string>>;
  clinicalPearl?: string;
  miniQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  };
};

export const CARDIAC_SOUND_RECORDS: CardiacSoundRecord[] = [
  {
    id: "s1",
    name: "S1 (first heart sound)",
    category: "normal",
    timing: "Marks onset of systole (near mitral/tricuspid closure)",
    pitchQuality: "Lower frequency than S2; longer than the crisp components of S2",
    description: "Closure of the atrioventricular valves — loudest at the apex with mitral predominance in most adults.",
    auscultationSite: "Cardiac apex (mitral area); tricuspid area for RV-led contexts",
    clinicalSignificance: "Intensity changes with PR interval, valve mobility, and contractility; split S1 can suggest conduction or timing differences.",
    commonCauses: ["Normal physiology", "Tachycardia (louder/closer coupling)", "Mitral stenosis (loud S1 when valve still mobile)"],
    waveformType: "s1-s2-normal",
    clinicalPearl: "Pair S1 timing with the carotid upstroke in learners’ minds: systole begins after S1.",
  },
  {
    id: "s2",
    name: "S2 (second heart sound)",
    category: "normal",
    timing: "End of systole (aortic/pulmonic closure)",
    pitchQuality: "Higher and shorter than S1",
    description: "Semilunar valve closure; physiologic splitting varies with respiration (A2 then P2 in inspiration).",
    auscultationSite: "Upper sternal border / left sternal border (base)",
    clinicalSignificance: "Wide fixed split suggests septal defect physiology; paradoxical split suggests delayed aortic closure (e.g., LBBB, AS) in board vignettes.",
    commonCauses: ["Normal physiology", "Pulmonary hypertension (P2 accentuation)", "ASD physiology (fixed splitting, classic boards)"],
    waveformType: "s1-s2-normal",
    countryNotes: {
      US: "US items often test splitting patterns and “where to listen first” for shunt physiology.",
      CA: "Canadian RN items similarly reward recognizing fixed vs physiologic splitting in provided cues.",
    },
  },
  {
    id: "s3",
    name: "S3 (ventricular gallop)",
    category: "extra_sounds",
    timing: "Early diastole, after S2",
    pitchQuality: "Low-frequency “Kentucky” cadence when paired with S1/S2",
    description: "Rapid ventricular filling into a compliant ventricle — can be normal in youth/athletes; pathologic when ventricular dysfunction or volume overload dominates.",
    auscultationSite: "Apex with bell, patient in left lateral decubitus",
    clinicalSignificance: "Pathologic S3 supports volume overload/HF physiology in the right clinical context.",
    commonCauses: ["Heart failure exacerbation", "Volume overload", "High-output states (pregnancy, anemia) when pathologic context is present"],
    waveformType: "s3-gallop",
    miniQuestion: {
      question: "An S3 gallop is typically heard best with which technique?",
      options: ["Diaphragm, sitting upright", "Bell, light pressure, left lateral decubitus", "Only during Valsalva release", "Stethoscope off the chest"],
      correctIndex: 1,
      rationale: "Low-frequency filling sounds are best heard with the bell, light skin contact, often left lateral positioning.",
    },
  },
  {
    id: "s4",
    name: "S4 (atrial gallop)",
    category: "extra_sounds",
    timing: "Late diastole (presystole), before S1",
    pitchQuality: "Low-frequency; “Tennessee” cadence when paired",
    description: "Atrial contraction against a stiff ventricle — not present in atrial fibrillation (no organized atrial kick).",
    auscultationSite: "Apex / LSB depending on hypertrophy/fibrosis pattern",
    clinicalSignificance: "Stiff ventricle clues: hypertension, aortic stenosis, HCM teaching frames.",
    commonCauses: ["LV hypertrophy / diastolic dysfunction", "Aortic stenosis (classic teaching pairing)", "Ischemic cardiomyopathy"],
    waveformType: "s4-gallop",
  },
  {
    id: "aortic-stenosis",
    name: "Aortic stenosis (systolic crescendo–decrescendo murmur)",
    category: "murmurs",
    timing: "Midsystolic ejection pattern",
    pitchQuality: "Harsh, often radiates to carotids (teaching frame)",
    description: "Obstructed LV outflow increases turbulence across the aortic valve — exam questions often pair delayed carotid upstroke and diminished pulses with severity cues.",
    auscultationSite: "Right upper sternal border (also LSB in some patients)",
    clinicalSignificance: "Syncope, angina, dyspnea triad is high-yield for severe AS in exam vignettes.",
    commonCauses: ["Calcific degenerative AS", "Bicuspid aortic valve", "Rheumatic disease (less common in many regions)"],
    waveformType: "systolic-ejection",
    allowedTiers: CARDIAC_ADVANCED_MURMUR_TIERS,
    clinicalPearl: "Radiation to the neck is a classic discriminator vs MR in many textbook frames.",
  },
  {
    id: "mitral-regurgitation",
    name: "Mitral regurgitation (holosystolic murmur)",
    category: "murmurs",
    timing: "Holosystolic (pansystolic) murmur",
    pitchQuality: "Blowing; often loudest at apex",
    description: "Regurgitant flow into the LA during systole — may radiate toward the axilla depending on jet direction (exam-dependent).",
    auscultationSite: "Cardiac apex (mitral area)",
    clinicalSignificance: "Volume overload, AF risk, and acute MR (papillary rupture) are classic escalation stems.",
    commonCauses: ["Primary mitral valve disease", "LV dilation (functional MR)", "Post-MI papillary muscle dysfunction (acute)"],
    waveformType: "holosystolic",
    allowedTiers: CARDIAC_ADVANCED_MURMUR_TIERS,
  },
  {
    id: "aortic-regurgitation",
    name: "Aortic regurgitation (early diastolic decrescendo)",
    category: "murmurs",
    timing: "Early diastole, decrescendo",
    pitchQuality: "High-pitched — best heard with diaphragm, patient leaning forward, held expiration (teaching)",
    description: "Diastolic regurgitation into the LV from the aorta; wide pulse pressure and bounding pulses appear in stems.",
    auscultationSite: "Third left intercostal space (Erb area) / sternal border with forward lean",
    clinicalSignificance: "Long murmur + wide pulse pressure pushes toward hemodynamically significant AR in boards.",
    commonCauses: ["Bicuspid valve", "Endocarditis", "Aortic root dilation"],
    waveformType: "early-diastolic-decrescendo",
    allowedTiers: CARDIAC_ADVANCED_MURMUR_TIERS,
  },
  {
    id: "mitral-stenosis",
    name: "Mitral stenosis (mid-diastolic rumble)",
    category: "murmurs",
    timing: "Mid-to-late diastolic rumble (after opening snap when present)",
    pitchQuality: "Low rumble — bell, left lateral positioning",
    description: "Impeded flow across the mitral valve during diastole; opening snap suggests mobile valve in classic teaching.",
    auscultationSite: "Apex",
    clinicalSignificance: "Dyspnea on exertion, rheumatic history, AF risk — frequent NCLEX-style pairings.",
    commonCauses: ["Rheumatic mitral stenosis (classic teaching)", "Congenital MS (less common)"],
    waveformType: "diastolic-rumble",
    allowedTiers: CARDIAC_ADVANCED_MURMUR_TIERS,
  },
  {
    id: "pericardial-friction-rub",
    name: "Pericardial friction rub",
    category: "abnormal",
    timing: "Often triphasic or biphasic (atrial/ventricular/diastolic components may be present)",
    pitchQuality: "Superficial, scratchy, close to the ear",
    description: "Inflamed pericardial layers create a friction sound that can persist with breath-holding (distinguishing teaching point vs pleural rub).",
    auscultationSite: "Left sternal border / apex (patient leaning forward)",
    clinicalSignificance: "Pericarditis spectrum; tamponade is tested as a separate hemodynamic pattern (muffled sounds + hypotension + JVD).",
    commonCauses: ["Pericarditis", "Post-MI pericarditis (teaching)", "Uremia", "Malignancy"],
    waveformType: "pericardial-friction",
    miniQuestion: {
      question: "Which finding is most classically associated with cardiac tamponade on exams (not every pericardial rub scenario)?",
      options: [
        "Beck triad pattern (hypotension, distended neck veins, muffled heart sounds)",
        "Unilateral wheeze only",
        "Pain only with inspiration that fully resolves with breath-hold every time",
        "Isolated localized crackles without hypoxia",
      ],
      correctIndex: 0,
      rationale: "Tamponade stems from pericardial fluid under pressure impairing filling — Beck triad is a classic teaching anchor.",
    },
  },
];
