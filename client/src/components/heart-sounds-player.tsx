import { getAssetUrl } from "@/lib/asset-url";
import { useState, useRef, useCallback, useEffect } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import {
  Play, Pause, Volume2, VolumeX, Repeat,
  HeartPulse, ChevronDown, ChevronUp, Stethoscope,
  HelpCircle, CheckCircle2, XCircle, Eye, EyeOff
} from "lucide-react";

const soundAcutePericarditis = getAssetUrl("acutepericarditis_1772495949269.mp4");
const soundAorticRegurgitation = getAssetUrl("aorticregurgitation_1772495949269.mp4");
const soundAorticRegurgitation2 = getAssetUrl("aorticregurgitation2_1772495949269.mp4");
const soundAorticSclerosis = getAssetUrl("aorticsclerosis_1772495949269.mp4");
const soundAorticStenosis = getAssetUrl("aorticstenosis_1772495949269.mp4");
const soundAorticStenosis2 = getAssetUrl("aorticstenosis2_1772495949269.mp4");
const soundPansystolicMurmur = getAssetUrl("pansystolicmurmur_1772495949269.mp4");
const soundMidsystolicClick = getAssetUrl("midsystolicclick_1772495949269.mp4");
const soundInnocentMurmur = getAssetUrl("innocentmurmur_1772495949269.mp4");
const soundEbsteins = getAssetUrl("ebsteins_1772495949269.mp4");
const soundCoarctation = getAssetUrl("coarctationofaorta_1772495949269.mp4");
const soundASD = getAssetUrl("ASD_1772495949269.mp4");
const soundPDA = getAssetUrl("PDA_1772495949269.mp4");
const soundPleuralRub = getAssetUrl("pleuralrub_1772495949269.mp4");
const soundS4 = getAssetUrl("s$_1772495949269.mp4");
const soundS3 = getAssetUrl("S3_1772495949269.mp4");
const soundSystolicEjection = getAssetUrl("systolicejectionmurmur_1772495949269.mp4");
const soundVSD = getAssetUrl("VSD_1772495949269.mp4");

interface HeartSoundConfig {
  id: string;
  name: string;
  category: "normal" | "extra" | "murmur" | "abnormal" | "congenital";
  timing: string;
  location: string;
  stethoscope: "bell" | "diaphragm" | "both";
  pitch: string;
  description: string;
  clinicalSignificance: string;
  auscultationTip: string;
  commonCauses: string[];
  bpm: number;
  synthesize?: (ctx: AudioContext, dest: AudioNode, bpm: number) => { stop: () => void };
  audioSrc?: string;
}

function createNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

function playThud(ctx: AudioContext, dest: AudioNode, startTime: number, freq: number, attack: number, decay: number, gain: number) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + decay);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(200, startTime);
  filter.Q.setValueAtTime(1, startTime);
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(gain, startTime + attack);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + decay);
  osc.connect(filter);
  filter.connect(g);
  g.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + decay + 0.05);
}

function playClick(ctx: AudioContext, dest: AudioNode, startTime: number, freq: number, duration: number, gain: number) {
  const noise = createNoise(ctx, duration);
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(freq, startTime);
  filter.Q.setValueAtTime(5, startTime);
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(gain, startTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  noise.connect(filter);
  filter.connect(g);
  g.connect(dest);
  noise.start(startTime);
  noise.stop(startTime + duration + 0.01);
}

function synthesizeNormalS1S2(ctx: AudioContext, dest: AudioNode, bpm: number) {
  const interval = 60 / bpm;
  let running = true;
  let timeout: ReturnType<typeof setTimeout>;

  function schedule(time: number) {
    if (!running) return;
    playThud(ctx, dest, time, 80, 0.005, 0.08, 0.7);
    playClick(ctx, dest, time, 300, 0.04, 0.3);
    const s2Time = time + interval * 0.35;
    playThud(ctx, dest, s2Time, 120, 0.003, 0.06, 0.5);
    playClick(ctx, dest, s2Time, 400, 0.03, 0.25);
    timeout = setTimeout(() => {
      if (running) schedule(ctx.currentTime + 0.05);
    }, interval * 1000);
  }

  schedule(ctx.currentTime + 0.05);
  return { stop: () => { running = false; clearTimeout(timeout); } };
}

function synthesizeS3(ctx: AudioContext, dest: AudioNode, bpm: number) {
  const interval = 60 / bpm;
  let running = true;
  let timeout: ReturnType<typeof setTimeout>;

  function schedule(time: number) {
    if (!running) return;
    playThud(ctx, dest, time, 80, 0.005, 0.08, 0.7);
    playClick(ctx, dest, time, 300, 0.04, 0.3);
    const s2Time = time + interval * 0.35;
    playThud(ctx, dest, s2Time, 120, 0.003, 0.06, 0.5);
    playClick(ctx, dest, s2Time, 400, 0.03, 0.25);
    const s3Time = s2Time + 0.12;
    playThud(ctx, dest, s3Time, 50, 0.008, 0.1, 0.35);
    timeout = setTimeout(() => {
      if (running) schedule(ctx.currentTime + 0.05);
    }, interval * 1000);
  }

  schedule(ctx.currentTime + 0.05);
  return { stop: () => { running = false; clearTimeout(timeout); } };
}

function synthesizeS4(ctx: AudioContext, dest: AudioNode, bpm: number) {
  const interval = 60 / bpm;
  let running = true;
  let timeout: ReturnType<typeof setTimeout>;

  function schedule(time: number) {
    if (!running) return;
    const s4Time = time;
    playThud(ctx, dest, s4Time, 45, 0.008, 0.09, 0.3);
    const s1Time = time + 0.12;
    playThud(ctx, dest, s1Time, 80, 0.005, 0.08, 0.7);
    playClick(ctx, dest, s1Time, 300, 0.04, 0.3);
    const s2Time = s1Time + interval * 0.35;
    playThud(ctx, dest, s2Time, 120, 0.003, 0.06, 0.5);
    playClick(ctx, dest, s2Time, 400, 0.03, 0.25);
    timeout = setTimeout(() => {
      if (running) schedule(ctx.currentTime + 0.05);
    }, interval * 1000);
  }

  schedule(ctx.currentTime + 0.05);
  return { stop: () => { running = false; clearTimeout(timeout); } };
}

function synthesizeSystolicMurmur(ctx: AudioContext, dest: AudioNode, bpm: number) {
  const interval = 60 / bpm;
  let running = true;
  let timeout: ReturnType<typeof setTimeout>;

  function schedule(time: number) {
    if (!running) return;
    playThud(ctx, dest, time, 80, 0.005, 0.08, 0.6);
    playClick(ctx, dest, time, 300, 0.04, 0.25);
    const murmurStart = time + 0.06;
    const murmurDur = interval * 0.28;
    const noise = createNoise(ctx, murmurDur);
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(250, murmurStart);
    filter.Q.setValueAtTime(3, murmurStart);
    g.gain.setValueAtTime(0, murmurStart);
    g.gain.linearRampToValueAtTime(0.15, murmurStart + murmurDur * 0.3);
    g.gain.linearRampToValueAtTime(0.2, murmurStart + murmurDur * 0.5);
    g.gain.linearRampToValueAtTime(0.001, murmurStart + murmurDur);
    noise.connect(filter);
    filter.connect(g);
    g.connect(dest);
    noise.start(murmurStart);
    noise.stop(murmurStart + murmurDur + 0.01);
    const s2Time = time + interval * 0.35;
    playThud(ctx, dest, s2Time, 120, 0.003, 0.06, 0.5);
    playClick(ctx, dest, s2Time, 400, 0.03, 0.25);
    timeout = setTimeout(() => {
      if (running) schedule(ctx.currentTime + 0.05);
    }, interval * 1000);
  }

  schedule(ctx.currentTime + 0.05);
  return { stop: () => { running = false; clearTimeout(timeout); } };
}

function synthesizeDiastolicMurmur(ctx: AudioContext, dest: AudioNode, bpm: number) {
  const interval = 60 / bpm;
  let running = true;
  let timeout: ReturnType<typeof setTimeout>;

  function schedule(time: number) {
    if (!running) return;
    playThud(ctx, dest, time, 80, 0.005, 0.08, 0.65);
    playClick(ctx, dest, time, 300, 0.04, 0.3);
    const s2Time = time + interval * 0.35;
    playThud(ctx, dest, s2Time, 120, 0.003, 0.06, 0.5);
    playClick(ctx, dest, s2Time, 400, 0.03, 0.25);
    const murmurStart = s2Time + 0.04;
    const murmurDur = interval * 0.5;
    const noise = createNoise(ctx, murmurDur);
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, murmurStart);
    filter.Q.setValueAtTime(2, murmurStart);
    g.gain.setValueAtTime(0.001, murmurStart);
    g.gain.linearRampToValueAtTime(0.12, murmurStart + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, murmurStart + murmurDur);
    noise.connect(filter);
    filter.connect(g);
    g.connect(dest);
    noise.start(murmurStart);
    noise.stop(murmurStart + murmurDur + 0.01);
    timeout = setTimeout(() => {
      if (running) schedule(ctx.currentTime + 0.05);
    }, interval * 1000);
  }

  schedule(ctx.currentTime + 0.05);
  return { stop: () => { running = false; clearTimeout(timeout); } };
}

function synthesizeFrictionRub(ctx: AudioContext, dest: AudioNode, bpm: number) {
  const interval = 60 / bpm;
  let running = true;
  let timeout: ReturnType<typeof setTimeout>;

  function playRub(startTime: number, dur: number) {
    const noise = createNoise(ctx, dur);
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(500, startTime);
    filter.Q.setValueAtTime(8, startTime);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
    g.gain.linearRampToValueAtTime(0.12, startTime + dur * 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
    noise.connect(filter);
    filter.connect(g);
    g.connect(dest);
    noise.start(startTime);
    noise.stop(startTime + dur + 0.01);
  }

  function schedule(time: number) {
    if (!running) return;
    playThud(ctx, dest, time, 80, 0.005, 0.08, 0.5);
    playRub(time + 0.03, 0.08);
    const s2Time = time + interval * 0.35;
    playThud(ctx, dest, s2Time, 120, 0.003, 0.06, 0.4);
    playRub(s2Time + 0.03, 0.06);
    playRub(time + interval * 0.6, 0.07);
    timeout = setTimeout(() => {
      if (running) schedule(ctx.currentTime + 0.05);
    }, interval * 1000);
  }

  schedule(ctx.currentTime + 0.05);
  return { stop: () => { running = false; clearTimeout(timeout); } };
}

function synthesizeSplitS2(ctx: AudioContext, dest: AudioNode, bpm: number) {
  const interval = 60 / bpm;
  let running = true;
  let timeout: ReturnType<typeof setTimeout>;

  function schedule(time: number) {
    if (!running) return;
    playThud(ctx, dest, time, 80, 0.005, 0.08, 0.7);
    playClick(ctx, dest, time, 300, 0.04, 0.3);
    const s2aTime = time + interval * 0.35;
    playThud(ctx, dest, s2aTime, 130, 0.003, 0.05, 0.45);
    playClick(ctx, dest, s2aTime, 420, 0.025, 0.2);
    const s2pTime = s2aTime + 0.04;
    playThud(ctx, dest, s2pTime, 110, 0.003, 0.05, 0.4);
    playClick(ctx, dest, s2pTime, 380, 0.025, 0.18);
    timeout = setTimeout(() => {
      if (running) schedule(ctx.currentTime + 0.05);
    }, interval * 1000);
  }

  schedule(ctx.currentTime + 0.05);
  return { stop: () => { running = false; clearTimeout(timeout); } };
}

const HEART_SOUNDS: HeartSoundConfig[] = [
  {
    id: "normal-s1s2",
    name: "Normal S1 and S2",
    category: "normal",
    timing: "S1 at systole onset, S2 at diastole onset",
    location: "All cardiac areas",
    stethoscope: "diaphragm",
    pitch: "S1: low-pitched (lub), S2: higher-pitched (dub)",
    description: "S1 is produced by closure of the mitral and tricuspid valves (AV valves) at the beginning of systole. S2 is produced by closure of the aortic and pulmonic valves (semilunar valves) at the beginning of diastole. Together they create the classic 'lub-dub' pattern.",
    clinicalSignificance: "Normal finding. S1 is loudest at the apex (mitral area). S2 is loudest at the base (aortic area). Understanding normal sounds is essential for recognizing abnormalities.",
    auscultationTip: "Place the diaphragm firmly at each of the 5 auscultation areas (APE-TM). Listen for at least 5-10 cardiac cycles. S1 marks the start of systole and is best heard at the apex. S2 marks the start of diastole and is best heard at the base.",
    commonCauses: ["Normal cardiac function"],
    bpm: 72,
    synthesize: synthesizeNormalS1S2,
  },
  {
    id: "s3-gallop",
    name: "S3 (Ventricular Gallop)",
    category: "extra",
    timing: "Early diastole, shortly after S2",
    location: "Mitral area (apex), left lateral decubitus position",
    stethoscope: "bell",
    pitch: "Low-pitched thud",
    description: "S3 occurs during the rapid passive filling phase of the ventricle in early diastole. It sounds like 'lub-dub-ta' or the word 'Kentucky' (ken-TUC-ky). In adults over 40, it typically indicates ventricular volume overload and reduced compliance.",
    clinicalSignificance: "Pathologic in adults over 40 - strongly associated with heart failure (volume overload). Can be physiologic in children, young adults, athletes, and during pregnancy.",
    auscultationTip: "Use the bell of the stethoscope lightly placed at the apex (mitral area). Position the patient in the left lateral decubitus position to bring the apex closer to the chest wall. Listen specifically in early diastole, immediately after S2. Think 'Ken-TUC-ky' for the S1-S2-S3 rhythm.",
    commonCauses: ["Heart failure (systolic dysfunction)", "Mitral regurgitation", "Tricuspid regurgitation", "Physiologic in young adults and athletes"],
    bpm: 72,
    audioSrc: soundS3,
    synthesize: synthesizeS3,
  },
  {
    id: "s4-gallop",
    name: "S4 (Atrial Gallop)",
    category: "extra",
    timing: "Late diastole, just before S1",
    location: "Mitral area (apex)",
    stethoscope: "bell",
    pitch: "Low-pitched thud",
    description: "S4 occurs during atrial contraction (atrial kick) against a stiff, non-compliant ventricle in late diastole. It sounds like 'ta-lub-dub' or the word 'Tennessee' (TEN-nes-see). It is always pathologic and indicates decreased ventricular compliance.",
    clinicalSignificance: "Always pathologic. Indicates ventricular hypertrophy or stiffening (diastolic dysfunction). Absent in atrial fibrillation since the atrial kick is lost.",
    auscultationTip: "Use the bell at the apex with the patient in the left lateral decubitus position. Listen in late diastole, just before S1. The cadence is S4-S1-S2 ('TEN-nes-see'). Apply only light pressure with the bell -- pressing too hard converts it to a diaphragm and filters out the low-frequency S4.",
    commonCauses: ["Hypertension (left ventricular hypertrophy)", "Hypertrophic cardiomyopathy", "Aortic stenosis", "Acute myocardial infarction", "Coronary artery disease"],
    bpm: 72,
    audioSrc: soundS4,
    synthesize: synthesizeS4,
  },
  {
    id: "systolic-murmur",
    name: "Systolic Murmur (Crescendo-Decrescendo)",
    category: "murmur",
    timing: "Between S1 and S2 (systole)",
    location: "Aortic area (2nd ICS right sternal border), radiates to carotids",
    stethoscope: "diaphragm",
    pitch: "Medium to high-pitched, harsh, diamond-shaped",
    description: "A crescendo-decrescendo (diamond-shaped) systolic murmur that begins after S1 and ends before S2. The intensity increases then decreases, creating a 'whooshing' sound. This is the classic pattern of aortic stenosis, where the valve fails to open fully.",
    clinicalSignificance: "Aortic stenosis murmur radiates to the carotids. Severity correlates with the timing of peak intensity - later peaking indicates more severe stenosis. Grade III or louder murmurs require echocardiographic evaluation.",
    auscultationTip: "Use the diaphragm at the aortic area (2nd ICS, right sternal border). Have the patient sit up and lean forward. Listen for the crescendo-decrescendo 'diamond' shape between S1 and S2. Check for radiation by sliding the stethoscope up toward the carotid arteries.",
    commonCauses: ["Aortic stenosis (most common cause in elderly)", "Hypertrophic obstructive cardiomyopathy", "Pulmonic stenosis", "Innocent flow murmurs (grade I-II)"],
    bpm: 72,
    synthesize: synthesizeSystolicMurmur,
  },
  {
    id: "diastolic-murmur",
    name: "Diastolic Murmur (Decrescendo)",
    category: "murmur",
    timing: "After S2, during diastole",
    location: "Aortic area, left sternal border (Erb's point)",
    stethoscope: "diaphragm",
    pitch: "High-pitched, blowing, decrescendo",
    description: "A high-pitched, blowing decrescendo murmur heard best along the left sternal border with the patient sitting up and leaning forward. It begins immediately after S2 and fades. This pattern is classic for aortic regurgitation.",
    clinicalSignificance: "All diastolic murmurs are pathologic until proven otherwise. Must be reported immediately. Aortic regurgitation causes volume overload of the left ventricle and can lead to heart failure.",
    auscultationTip: "Use the diaphragm at Erb's point (3rd ICS, left sternal border). Have the patient sit up, lean forward, and exhale fully -- this brings the heart closer to the chest wall. Listen immediately after S2 for a blowing, fading sound. Diastolic murmurs are subtle and require a quiet environment.",
    commonCauses: ["Aortic regurgitation (insufficiency)", "Mitral stenosis (low-pitched rumble)", "Pulmonic regurgitation"],
    bpm: 72,
    synthesize: synthesizeDiastolicMurmur,
  },
  {
    id: "pericardial-friction-rub",
    name: "Pericardial Friction Rub",
    category: "abnormal",
    timing: "Systole and diastole (triphasic: atrial systole, ventricular systole, ventricular diastole)",
    location: "Left sternal border, 3rd-4th ICS",
    stethoscope: "diaphragm",
    pitch: "High-pitched, scratchy, grating - like sandpaper",
    description: "A harsh, scratchy, grating sound caused by inflamed pericardial layers rubbing against each other. Classically has three components but may have one or two. Best heard with the patient sitting up and leaning forward. Unlike pleural rubs, it persists when the patient holds their breath.",
    clinicalSignificance: "Indicates pericarditis (inflammation of the pericardium). Key differentiator from pleural friction rub: pericardial rub continues when the patient holds their breath, while pleural rub stops.",
    auscultationTip: "Use the diaphragm at the left sternal border, 3rd-4th ICS. Have the patient sit up and lean forward. Press firmly. To differentiate from a pleural rub, ask the patient to hold their breath -- a pericardial rub persists, while a pleural rub disappears.",
    commonCauses: ["Acute pericarditis (viral, bacterial, autoimmune)", "Post-MI (Dressler syndrome)", "Uremic pericarditis", "Post-cardiac surgery"],
    bpm: 80,
    synthesize: synthesizeFrictionRub,
  },
  {
    id: "split-s2",
    name: "Physiologic Split S2",
    category: "normal",
    timing: "S2 splits into A2 and P2 during inspiration",
    location: "Pulmonic area (2nd ICS left sternal border)",
    stethoscope: "diaphragm",
    pitch: "Two closely spaced high-pitched sounds during inspiration",
    description: "During inspiration, increased venous return to the right heart delays pulmonic valve closure (P2), while decreased return to the left heart slightly advances aortic valve closure (A2). This creates an audible split of S2 into two components during inspiration that merges back into a single sound during expiration.",
    clinicalSignificance: "Normal physiologic finding that varies with respiration. Fixed splitting (no change with respiration) suggests atrial septal defect. Paradoxical splitting (wider on expiration) suggests LBBB or severe aortic stenosis.",
    auscultationTip: "Use the diaphragm at the pulmonic area (2nd ICS, left sternal border). Ask the patient to breathe slowly and deeply. Listen for S2 splitting into two components during inspiration and merging back during expiration. If the split is fixed (does not change with respiration), suspect ASD.",
    commonCauses: ["Normal physiologic response to inspiration", "Fixed split: Atrial septal defect", "Wide split: Right bundle branch block", "Paradoxical split: Left bundle branch block"],
    bpm: 72,
    synthesize: synthesizeSplitS2,
  },
  {
    id: "acute-pericarditis",
    name: "Acute Pericarditis (Recording)",
    category: "abnormal",
    timing: "Throughout the cardiac cycle -- may have up to 3 components",
    location: "Left sternal border, 3rd-4th ICS",
    stethoscope: "diaphragm",
    pitch: "High-pitched, scratchy, leathery, grating",
    description: "This is a real recording of acute pericarditis. The pericardial friction rub has a characteristic scratchy, sandpaper-like quality caused by inflamed, roughened pericardial surfaces rubbing against each other. It may have up to three components corresponding to atrial systole, ventricular systole, and early ventricular diastole.",
    clinicalSignificance: "Pericarditis is often accompanied by diffuse ST elevation on ECG, pleuritic chest pain that improves with sitting forward, and sometimes a pericardial effusion. The rub may be transient and disappear as effusion increases.",
    auscultationTip: "Apply the diaphragm firmly at the left lower sternal border. Have the patient sit upright and lean forward during end-expiration. The rub is often evanescent -- listen repeatedly as it may come and go. Ask the patient to hold their breath to confirm it is pericardial (persists) versus pleural (stops).",
    commonCauses: ["Viral pericarditis (most common)", "Post-MI pericarditis (Dressler syndrome)", "Uremic pericarditis", "Autoimmune (lupus, rheumatoid arthritis)", "Post-cardiac surgery"],
    bpm: 72,
    audioSrc: soundAcutePericarditis,
  },
  {
    id: "aortic-regurgitation",
    name: "Aortic Regurgitation",
    category: "murmur",
    timing: "Early diastole, immediately after S2",
    location: "Aortic area and Erb's point (3rd ICS, left sternal border)",
    stethoscope: "diaphragm",
    pitch: "High-pitched, blowing, decrescendo",
    description: "A high-pitched, blowing decrescendo murmur beginning immediately after S2. Blood leaks backward through an incompetent aortic valve during diastole. The murmur fades as the pressure gradient between the aorta and ventricle decreases. Severe AR produces a wider pulse pressure and may have an Austin Flint murmur.",
    clinicalSignificance: "Causes left ventricular volume overload and dilation. Chronic AR may be well-tolerated for years before symptoms develop. Acute AR (e.g., from endocarditis or aortic dissection) is a surgical emergency.",
    auscultationTip: "Use the diaphragm pressed firmly at Erb's point (3rd ICS, left sternal border). Have the patient sit up, lean forward, and exhale completely. Listen immediately after S2 for a soft blowing sound that fades. In severe AR, also check for a low-pitched diastolic rumble at the apex (Austin Flint murmur).",
    commonCauses: ["Bicuspid aortic valve", "Aortic root dilation", "Infective endocarditis", "Rheumatic heart disease", "Marfan syndrome", "Aortic dissection (acute)"],
    bpm: 72,
    audioSrc: soundAorticRegurgitation,
  },
  {
    id: "aortic-regurgitation-severe",
    name: "Aortic Regurgitation (Severe)",
    category: "murmur",
    timing: "Early diastole, holodiastolic in severe cases",
    location: "Erb's point, may radiate to apex",
    stethoscope: "diaphragm",
    pitch: "High-pitched, blowing, longer duration than mild AR",
    description: "In severe aortic regurgitation, the murmur is louder, longer, and may become holodiastolic. Associated findings include a widened pulse pressure (e.g., 170/50), bounding 'water-hammer' pulses (Corrigan pulse), head bobbing with each heartbeat (de Musset sign), and nail bed capillary pulsations (Quincke sign).",
    clinicalSignificance: "Severe AR indicates significant valvular incompetence requiring surgical evaluation. Watch for signs of decompensated heart failure. An Austin Flint murmur at the apex suggests the regurgitant jet is striking the mitral valve leaflet.",
    auscultationTip: "Same positioning as mild AR -- diaphragm at Erb's point, patient sitting forward, end-expiration. In severe AR, the murmur is louder and lasts longer through diastole. Also auscultate the apex for an Austin Flint murmur (low-pitched diastolic rumble) using the bell.",
    commonCauses: ["Progressive bicuspid aortic valve disease", "Aortic root aneurysm", "Destructive endocarditis", "Chronic rheumatic valvular disease"],
    bpm: 72,
    audioSrc: soundAorticRegurgitation2,
  },
  {
    id: "aortic-sclerosis",
    name: "Aortic Sclerosis",
    category: "murmur",
    timing: "Mid-systolic, between S1 and S2",
    location: "Aortic area (2nd ICS right sternal border)",
    stethoscope: "diaphragm",
    pitch: "Soft, mid-frequency, short systolic murmur",
    description: "Aortic sclerosis is caused by thickening and calcification of the aortic valve leaflets without significant obstruction to flow. The murmur is typically grade I-II/VI, soft, and mid-systolic. Unlike aortic stenosis, there is no significant pressure gradient across the valve and the carotid upstrokes remain brisk and normal.",
    clinicalSignificance: "Present in up to 25% of adults over age 65. While not hemodynamically significant, aortic sclerosis is a marker for increased cardiovascular risk. Approximately 2% per year progress to true aortic stenosis.",
    auscultationTip: "Use the diaphragm at the aortic area. The murmur is soft and does NOT radiate to the carotids (unlike aortic stenosis). Check the carotid pulse -- in sclerosis, it remains brisk with a normal upstroke. A delayed, weak carotid upstroke (parvus et tardus) suggests true stenosis.",
    commonCauses: ["Age-related valve calcification", "Hyperlipidemia", "Hypertension", "Chronic kidney disease"],
    bpm: 72,
    audioSrc: soundAorticSclerosis,
  },
  {
    id: "aortic-stenosis",
    name: "Aortic Stenosis",
    category: "murmur",
    timing: "Mid-systolic, crescendo-decrescendo (ejection)",
    location: "Aortic area, radiates to carotids",
    stethoscope: "diaphragm",
    pitch: "Harsh, medium-to-high pitched, diamond-shaped",
    description: "A harsh crescendo-decrescendo systolic ejection murmur caused by turbulent blood flow through a narrowed aortic valve. The murmur begins after S1, peaks in mid-systole, and ends before S2. In severe stenosis, the peak shifts later in systole (late-peaking) and S2 may become diminished or absent.",
    clinicalSignificance: "The classic triad of severe aortic stenosis is syncope, angina, and heart failure. Once symptoms develop, prognosis without valve replacement is poor (2-5 year survival). A paradoxically soft murmur with severe symptoms suggests critical stenosis with low cardiac output.",
    auscultationTip: "Use the diaphragm at the aortic area (2nd ICS, right sternal border). Have the patient sit up and lean forward. Listen for the harsh, diamond-shaped murmur between S1 and S2. Slide the stethoscope up to the carotid arteries to check for radiation. Palpate the carotid pulse -- a delayed, weak upstroke (parvus et tardus) confirms severity.",
    commonCauses: ["Calcific degeneration (elderly)", "Bicuspid aortic valve (younger patients)", "Rheumatic heart disease"],
    bpm: 72,
    audioSrc: soundAorticStenosis,
  },
  {
    id: "aortic-stenosis-severe",
    name: "Aortic Stenosis (Severe)",
    category: "murmur",
    timing: "Late-peaking systolic ejection murmur",
    location: "Aortic area, radiates widely to carotids and apex",
    stethoscope: "diaphragm",
    pitch: "Loud, harsh, late-peaking crescendo-decrescendo",
    description: "Severe aortic stenosis produces a louder, later-peaking murmur with a diminished or absent A2 component of S2. The carotid upstroke is delayed and diminished (pulsus parvus et tardus). There may be a sustained, heaving apical impulse from left ventricular hypertrophy. The Gallavardin phenomenon can cause the murmur to sound musical at the apex.",
    clinicalSignificance: "Severe AS with a valve area less than 1.0 cm2 or a mean gradient greater than 40 mmHg requires evaluation for valve replacement. A soft murmur with severe symptoms (low-flow, low-gradient AS) is particularly dangerous and may indicate failing cardiac output.",
    auscultationTip: "Same positioning as moderate AS. In severe disease, note that S2 may be single (A2 is lost). The later the peak of the murmur, the more severe the stenosis. Compare the intensity at the aortic area versus the apex -- the Gallavardin phenomenon makes severe AS sound like mitral regurgitation at the apex.",
    commonCauses: ["Advanced calcific aortic valve disease", "Severe bicuspid valve stenosis", "Long-standing rheumatic disease"],
    bpm: 72,
    audioSrc: soundAorticStenosis2,
  },
  {
    id: "systolic-ejection-murmur",
    name: "Systolic Ejection Murmur",
    category: "murmur",
    timing: "Mid-systolic, crescendo-decrescendo",
    location: "Pulmonic or aortic area",
    stethoscope: "diaphragm",
    pitch: "Medium-pitched, blowing to harsh",
    description: "A systolic ejection murmur (SEM) is caused by turbulent flow across the semilunar valves during ventricular ejection. It characteristically has a crescendo-decrescendo (diamond) shape. Unlike pansystolic murmurs, it begins slightly after S1 and ends before S2, leaving both heart sounds intact and clearly audible.",
    clinicalSignificance: "Can be innocent (flow murmur in young patients, pregnancy, anemia, fever) or pathologic (aortic or pulmonic stenosis). Innocent SEMs are typically grade I-II, softer with position changes, and have no associated symptoms. Louder murmurs (grade III+) with radiation or symptoms need echocardiography.",
    auscultationTip: "Use the diaphragm at both the aortic and pulmonic areas. Listen for the diamond-shaped envelope with a clear gap after S1 and before S2. To distinguish innocent from pathologic: have the patient stand (innocent murmurs soften) or squat (innocent murmurs may increase). Check for radiation to carotids (aortic) or splitting of S2 (pulmonic).",
    commonCauses: ["Innocent flow murmur (children, young adults)", "Pregnancy or high-output states", "Anemia, fever, thyrotoxicosis", "Aortic stenosis", "Pulmonic stenosis"],
    bpm: 72,
    audioSrc: soundSystolicEjection,
  },
  {
    id: "pansystolic-murmur",
    name: "Pansystolic (Holosystolic) Murmur",
    category: "murmur",
    timing: "Throughout systole, S1 to S2 (no gap at either end)",
    location: "Apex (MR), left sternal border (TR, VSD)",
    stethoscope: "diaphragm",
    pitch: "High-pitched, blowing (MR/TR) or harsh (VSD)",
    description: "A pansystolic murmur occupies the entire systolic interval from S1 to S2 with uniform intensity (plateau-shaped). Unlike ejection murmurs, there is no gap between the murmur and S1 or S2. This occurs when there is a continuous pressure gradient between two chambers throughout systole, as in mitral regurgitation, tricuspid regurgitation, or ventricular septal defect.",
    clinicalSignificance: "Always pathologic. Mitral regurgitation at the apex radiating to the axilla is the most common cause. Tricuspid regurgitation at the lower left sternal border increases with inspiration (Carvallo sign). VSD produces a harsh murmur at the left sternal border.",
    auscultationTip: "Use the diaphragm. For suspected MR: listen at the apex and check for radiation to the left axilla. For suspected TR: listen at the lower left sternal border and ask the patient to inhale deeply -- the murmur increases with inspiration (Carvallo sign). For VSD: listen at the 3rd-4th ICS left sternal border for a harsh, loud murmur with a thrill.",
    commonCauses: ["Mitral regurgitation", "Tricuspid regurgitation", "Ventricular septal defect", "Mitral valve prolapse (late systolic variant)"],
    bpm: 72,
    audioSrc: soundPansystolicMurmur,
  },
  {
    id: "midsystolic-click",
    name: "Mid-Systolic Click (Mitral Valve Prolapse)",
    category: "abnormal",
    timing: "Mid-to-late systole",
    location: "Mitral area (apex)",
    stethoscope: "diaphragm",
    pitch: "Brief, high-pitched clicking sound",
    description: "A mid-systolic click is the hallmark of mitral valve prolapse (MVP). The click is produced when the redundant mitral valve leaflet billows past its normal closure point during systole. It may be followed by a late systolic murmur if mitral regurgitation is present. Maneuvers that decrease left ventricular volume (standing, Valsalva) cause the click to move earlier in systole.",
    clinicalSignificance: "MVP is the most common valvular abnormality, affecting 2-3% of the population. Most patients are asymptomatic. The click-murmur timing changes with maneuvers: standing and Valsalva move the click earlier; squatting moves it later. Significant MR from MVP may require surgical repair.",
    auscultationTip: "Use the diaphragm at the apex. Listen mid-systole for a brief, sharp click. To confirm MVP, perform dynamic auscultation: have the patient stand up (click moves earlier, murmur lengthens) then squat (click moves later, murmur shortens). This is because ventricular volume changes affect when the leaflet prolapses.",
    commonCauses: ["Mitral valve prolapse (primary)", "Connective tissue disorders (Marfan, Ehlers-Danlos)", "Myxomatous valve degeneration"],
    bpm: 72,
    audioSrc: soundMidsystolicClick,
  },
  {
    id: "innocent-murmur",
    name: "Innocent (Still's) Murmur",
    category: "normal",
    timing: "Early-to-mid systole",
    location: "Left sternal border, between apex and sternum",
    stethoscope: "both",
    pitch: "Low-to-medium pitched, musical, vibratory, 'twanging string'",
    description: "An innocent murmur (Still's murmur) is a benign flow murmur most commonly heard in children and young adults. It has a characteristic musical or vibratory quality described as a 'twanging string.' It is typically grade I-II/VI, short in duration, and has no associated symptoms. It decreases with standing and increases with lying down or fever.",
    clinicalSignificance: "Innocent murmurs require no treatment or follow-up. They are distinguished from pathologic murmurs by being soft (grade I-II), systolic only, position-dependent, and having no associated symptoms, thrills, or radiation. They are never diastolic.",
    auscultationTip: "Listen with either bell or diaphragm at the left lower sternal border. The murmur has a distinctive musical or vibratory quality. To confirm innocence: have the patient sit up or stand (murmur softens or disappears) then lie supine (murmur returns). No radiation, no thrill, normal S1 and S2, and normal splitting of S2 all support an innocent murmur.",
    commonCauses: ["Normal variant in children and young adults", "High-output states (fever, anemia, anxiety)", "Pregnancy", "Athletic heart"],
    bpm: 72,
    audioSrc: soundInnocentMurmur,
  },
  {
    id: "pleural-rub",
    name: "Pleural Friction Rub",
    category: "abnormal",
    timing: "Inspiratory and expiratory phases of respiration",
    location: "Lateral or posterior chest wall over affected area",
    stethoscope: "diaphragm",
    pitch: "Coarse, creaking, grating, like walking on fresh snow",
    description: "A pleural friction rub is produced by inflamed visceral and parietal pleural surfaces rubbing against each other during respiration. It sounds like a coarse, creaking, grating noise. Unlike a pericardial rub, it stops when the patient holds their breath because pleural movement ceases. It is loudest at the end of inspiration and beginning of expiration.",
    clinicalSignificance: "Indicates pleuritis (inflammation of the pleura). May be associated with pleuritic chest pain that worsens with deep breathing. As pleural effusion accumulates, the rub may disappear because fluid separates the inflamed surfaces.",
    auscultationTip: "Use the diaphragm pressed firmly over the affected area of the chest. Ask the patient to breathe deeply. The rub will be heard during both inspiration and expiration. To confirm it is pleural (not pericardial), ask the patient to hold their breath -- a pleural rub stops completely. Mark the location where it is loudest.",
    commonCauses: ["Pneumonia", "Pulmonary embolism", "Pleurisy (viral)", "Tuberculosis", "Post-thoracic surgery", "Lupus"],
    bpm: 72,
    audioSrc: soundPleuralRub,
  },
  {
    id: "asd",
    name: "Atrial Septal Defect (ASD)",
    category: "congenital",
    timing: "Mid-systolic ejection murmur with fixed split S2",
    location: "Pulmonic area (2nd ICS left sternal border)",
    stethoscope: "diaphragm",
    pitch: "Soft systolic ejection murmur, prominent fixed split S2",
    description: "ASD produces a systolic ejection murmur at the pulmonic area due to increased flow across the pulmonic valve. The hallmark finding is a fixed split S2 -- the S2 splitting does not change with respiration. This occurs because the ASD equalizes pressure changes between the atria, maintaining a constant right ventricular volume regardless of the respiratory cycle.",
    clinicalSignificance: "Fixed splitting of S2 is the most important auscultatory finding and distinguishes ASD from physiologic splitting. Large ASDs with a pulmonary-to-systemic flow ratio (Qp:Qs) greater than 1.5:1 typically require closure. Watch for right heart failure and paradoxical embolism.",
    auscultationTip: "Use the diaphragm at the pulmonic area (2nd ICS, left sternal border). The key finding is NOT the murmur -- it is the fixed split S2. Ask the patient to breathe slowly. In normal patients, S2 splitting widens with inspiration and narrows with expiration. In ASD, the split remains constant (fixed) regardless of respiration. Listen through multiple respiratory cycles to confirm.",
    commonCauses: ["Secundum ASD (most common, 75%)", "Primum ASD (associated with Down syndrome)", "Sinus venosus ASD", "Patent foramen ovale (PFO)"],
    bpm: 72,
    audioSrc: soundASD,
  },
  {
    id: "vsd",
    name: "Ventricular Septal Defect (VSD)",
    category: "congenital",
    timing: "Pansystolic (holosystolic)",
    location: "3rd-4th ICS, left sternal border",
    stethoscope: "diaphragm",
    pitch: "Harsh, loud, high-pitched with palpable thrill",
    description: "VSD produces a loud, harsh pansystolic murmur at the left sternal border, often with a palpable thrill (vibration). Paradoxically, smaller (restrictive) VSDs produce louder murmurs because the high-velocity jet creates more turbulence. Large VSDs may have softer murmurs but cause more hemodynamic compromise. The murmur is caused by blood shunting left-to-right through the septal defect.",
    clinicalSignificance: "The most common congenital heart defect. Small muscular VSDs often close spontaneously. Large VSDs cause pulmonary overcirculation and can lead to Eisenmenger syndrome (irreversible pulmonary hypertension with shunt reversal). Surgical closure is indicated for large defects with significant shunting.",
    auscultationTip: "Use the diaphragm at the 3rd-4th ICS along the left sternal border. Place your palm flat over the area to feel for a thrill (palpable vibration). The murmur is harsh and occupies all of systole from S1 to S2. A louder murmur paradoxically suggests a smaller, more restrictive VSD. Check for a diastolic flow rumble at the apex, which indicates significant left-to-right shunting.",
    commonCauses: ["Congenital (isolated or part of a syndrome)", "Post-myocardial infarction (acute)", "Traumatic"],
    bpm: 72,
    audioSrc: soundVSD,
  },
  {
    id: "pda",
    name: "Patent Ductus Arteriosus (PDA)",
    category: "congenital",
    timing: "Continuous -- systole and diastole ('machinery murmur')",
    location: "Left infraclavicular area, 2nd ICS left sternal border",
    stethoscope: "diaphragm",
    pitch: "Continuous, rumbling, 'machinery-like', peaks around S2",
    description: "PDA produces a characteristic continuous 'machinery' murmur that is heard throughout systole and diastole. The murmur peaks around S2 (when the aortic-pulmonary pressure gradient is highest) and has a waxing-waning quality. The ductus arteriosus normally closes within 24-48 hours of birth; when it persists, blood flows continuously from the high-pressure aorta to the low-pressure pulmonary artery.",
    clinicalSignificance: "A continuous murmur peaking at S2 in the left infraclavicular area is virtually pathognomonic for PDA. Common in premature infants. Indomethacin or ibuprofen can promote pharmacologic closure. Surgical or catheter-based closure is needed for hemodynamically significant PDAs that fail medical therapy.",
    auscultationTip: "Use the diaphragm at the left infraclavicular area or upper left sternal border. Listen for a murmur that continues without interruption through both systole AND diastole -- this is the hallmark of PDA. It peaks in intensity around S2 and has a rumbling, machine-like quality. A continuous murmur at this location is virtually diagnostic.",
    commonCauses: ["Prematurity (most common cause)", "Maternal rubella infection", "High altitude births", "Congenital (may be associated with other defects)"],
    bpm: 72,
    audioSrc: soundPDA,
  },
  {
    id: "ebsteins-anomaly",
    name: "Ebstein's Anomaly",
    category: "congenital",
    timing: "Systolic murmur with widely split S1 and S2",
    location: "Lower left sternal border, tricuspid area",
    stethoscope: "both",
    pitch: "Soft systolic murmur, prominent sail-like S1, scratchy quality",
    description: "Ebstein's anomaly is a rare congenital defect where the tricuspid valve is displaced downward into the right ventricle, creating an 'atrialized' portion of the RV. The auscultatory hallmark is a widely split S1 (the delayed tricuspid component creates a 'sail sound') and a systolic murmur of tricuspid regurgitation. Multiple clicks and a gallop rhythm may also be present.",
    clinicalSignificance: "Severity varies widely -- from asymptomatic to severe cyanosis and heart failure. Associated with Wolff-Parkinson-White (WPW) syndrome and atrial arrhythmias. The 'sail sound' (loud, delayed tricuspid closure) is the characteristic finding. Maternal lithium use during pregnancy is a risk factor.",
    auscultationTip: "Use both bell and diaphragm at the lower left sternal border and tricuspid area. Listen for: (1) widely split S1 with a loud second component ('sail sound'), (2) widely split S2, (3) multiple systolic clicks, and (4) a soft murmur of tricuspid regurgitation. The combination of these findings is distinctive for Ebstein's.",
    commonCauses: ["Congenital malformation of the tricuspid valve", "Associated with maternal lithium exposure", "May be associated with ASD or WPW syndrome"],
    bpm: 72,
    audioSrc: soundEbsteins,
  },
  {
    id: "coarctation-of-aorta",
    name: "Coarctation of the Aorta",
    category: "congenital",
    timing: "Mid-to-late systolic, may extend into diastole",
    location: "Left interscapular area (back), left sternal border",
    stethoscope: "diaphragm",
    pitch: "Soft to medium systolic murmur, may have continuous component",
    description: "Coarctation of the aorta is a narrowing of the aorta, typically just distal to the left subclavian artery at the ligamentum arteriosum. It produces a systolic murmur best heard over the left back between the scapulae. A continuous murmur may be present from collateral intercostal arteries. The hallmark clinical finding is upper extremity hypertension with diminished or delayed femoral pulses (arm-leg blood pressure gradient).",
    clinicalSignificance: "The key physical exam finding is a blood pressure differential -- upper extremity BP is higher than lower extremity BP (normal is the opposite). Rib notching on chest X-ray from dilated intercostal collateral arteries is a classic radiographic finding. Associated with bicuspid aortic valve (50-80% of cases) and Turner syndrome.",
    auscultationTip: "Auscultate the left interscapular area (posterior chest between the scapulae) using the diaphragm. Also listen at the left sternal border anteriorly. The murmur may be soft and easy to miss. The critical step is to check blood pressure in BOTH arms and at least one leg -- a systolic BP difference greater than 20 mmHg (arms higher than legs) is diagnostic. Always palpate femoral pulses -- they will be weak, delayed, or absent.",
    commonCauses: ["Congenital narrowing of the aortic isthmus", "Associated with bicuspid aortic valve", "Turner syndrome (45,X)", "May recur after repair"],
    bpm: 72,
    audioSrc: soundCoarctation,
  },
];

const AUSCULTATION_AREAS = [
  { id: "aortic", label: "Aortic", shortLabel: "A", cx: 198, cy: 115, description: "2nd intercostal space, right sternal border" },
  { id: "pulmonic", label: "Pulmonic", shortLabel: "P", cx: 228, cy: 115, description: "2nd intercostal space, left sternal border" },
  { id: "erbs", label: "Erb's Point", shortLabel: "E", cx: 223, cy: 145, description: "3rd intercostal space, left sternal border" },
  { id: "tricuspid", label: "Tricuspid", shortLabel: "T", cx: 218, cy: 175, description: "4th intercostal space, left sternal border" },
  { id: "mitral", label: "Mitral (Apex)", shortLabel: "M", cx: 240, cy: 200, description: "5th intercostal space, left midclavicular line" },
];

function HeartDiagram({ selectedArea, onSelectArea }: { selectedArea: string | null; onSelectArea: (id: string) => void }) {
  return (
    <svg viewBox="0 0 430 300" className="w-full max-w-sm mx-auto" data-testid="svg-heart-areas">
      <path d="M160,55 Q140,60 120,90 Q100,130 100,180 Q100,230 110,260 Q115,280 140,290 L290,290 Q315,280 320,260 Q330,230 330,180 Q330,130 310,90 Q290,60 270,55 Q250,50 215,48 Q180,50 160,55Z" fill="#f5e6d3" stroke="#c4a882" strokeWidth="1.5" />
      <line x1="215" y1="55" x2="215" y2="280" stroke="#e2cdb5" strokeWidth="0.8" strokeDasharray="4,4" />
      <ellipse cx="190" cy="108" rx="4" ry="3" fill="#c4a882" opacity="0.5" />
      <ellipse cx="240" cy="108" rx="4" ry="3" fill="#c4a882" opacity="0.5" />
      <path d="M195,140 C195,120 210,110 215,110 C220,110 235,120 235,140 C235,165 215,185 215,185 C215,185 195,165 195,140Z" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      {AUSCULTATION_AREAS.map(area => {
        const isSelected = selectedArea === area.id;
        return (
          <g key={area.id} onClick={() => onSelectArea(area.id)} style={{ cursor: "pointer" }} data-testid={`heart-area-${area.id}`}>
            <circle cx={area.cx} cy={area.cy} r={isSelected ? 14 : 11} fill={isSelected ? "#ef4444" : "#f87171"} opacity={isSelected ? 0.9 : 0.6} stroke={isSelected ? "#b91c1c" : "#ef4444"} strokeWidth={isSelected ? 2.5 : 1.5}>
              <animate attributeName="r" values={isSelected ? "14;16;14" : "11;11;11"} dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={area.cx} y={area.cy + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" style={{ pointerEvents: "none" }}>{area.shortLabel}</text>
          </g>
        );
      })}
      <text x="215" y="295" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="600">{t("components.heartSoundsPlayer.cardiacAuscultationAreas")}</text>
    </svg>
  );
}

function HeartSoundCard({ sound, allSounds }: { sound: HeartSoundConfig; allSounds: HeartSoundConfig[] }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<{ stop: () => void } | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping] = useState(true);
  const [bpm, setBpm] = useState(sound.bpm);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const gainRef = useRef<GainNode | null>(null);

  const usesAudioFile = !!sound.audioSrc;

  const startPlayback = useCallback(() => {
    if (usesAudioFile) {
      if (!audioElRef.current) {
        audioElRef.current = new Audio(sound.audioSrc);
        audioElRef.current.loop = true;
      }
      audioElRef.current.volume = isMuted ? 0 : volume;
      audioElRef.current.play().catch(() => {});
      setIsPlaying(true);
      return;
    }
    if (!sound.synthesize) return;
    if (stopRef.current) {
      stopRef.current.stop();
      stopRef.current = null;
    }
    const ctx = audioCtxRef.current || new AudioContext();
    audioCtxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();
    const gain = ctx.createGain();
    gain.gain.value = isMuted ? 0 : volume;
    gain.connect(ctx.destination);
    gainRef.current = gain;
    const stopper = sound.synthesize(ctx, gain, bpm);
    stopRef.current = stopper;
    setIsPlaying(true);
  }, [sound, bpm, volume, isMuted, usesAudioFile]);

  const stopPlayback = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
    }
    if (stopRef.current) {
      stopRef.current.stop();
      stopRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  useEffect(() => {
    if (usesAudioFile && audioElRef.current) {
      audioElRef.current.volume = isMuted ? 0 : volume;
    }
    if (gainRef.current) {
      gainRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, usesAudioFile]);

  useEffect(() => {
    return () => {
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current = null;
      }
      if (stopRef.current) stopRef.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !usesAudioFile) {
      stopPlayback();
      setTimeout(() => startPlayback(), 50);
    }
  }, [bpm]);

  const categoryColors: Record<string, string> = {
    normal: "bg-green-100 text-green-800 border-green-300",
    extra: "bg-amber-100 text-amber-800 border-amber-300",
    murmur: "bg-red-100 text-red-800 border-red-300",
    abnormal: "bg-purple-100 text-purple-800 border-purple-300",
    congenital: "bg-blue-100 text-blue-800 border-blue-300",
  };

  const quizOptions = quizMode
    ? fisherYatesShuffle(allSounds.filter(s => s.id !== sound.id).slice(0, 3).map(s => s.name).concat(sound.name))
    : [];

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow" data-testid={`heart-sound-${sound.id}`}>
      <div className="flex items-start gap-3 mb-3">
        <HeartPulse className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          {quizMode && !showAnswer ? (
            <p className="font-medium text-gray-900" data-testid="text-quiz-prompt">
              <HelpCircle className="w-4 h-4 inline mr-1 text-amber-500" />
              Identify this heart sound
            </p>
          ) : (
            <>
              <p className="font-medium text-gray-900" data-testid={`text-sound-title-${sound.id}`}>{sound.name}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColors[sound.category]}`}>
                  {sound.category === "normal" ? "Normal" : sound.category === "extra" ? "Extra Sound" : sound.category === "murmur" ? "Murmur" : sound.category === "congenital" ? "Congenital" : "Abnormal"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  {sound.stethoscope === "bell" ? "Bell" : sound.stethoscope === "diaphragm" ? "Diaphragm" : "Bell or Diaphragm"}
                </span>
                {sound.audioSrc && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Recording
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        <Button
          variant="ghost" size="sm"
          onClick={() => { setQuizMode(!quizMode); setSelectedAnswer(null); setShowAnswer(false); }}
          className={`text-xs shrink-0 ${quizMode ? "text-amber-600 bg-amber-50" : "text-gray-500"}`}
          data-testid={`button-quiz-toggle-${sound.id}`}
        >
          {quizMode ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
          {quizMode ? "Show" : "Test Me"}
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={togglePlay} data-testid={`button-play-${sound.id}`}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        {!usesAudioFile ? (
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">{bpm} BPM</span>
            <Slider
              value={[bpm]} min={50} max={120} step={1}
              onValueChange={(v) => setBpm(v[0])}
              className="flex-1"
              data-testid={`slider-bpm-${sound.id}`}
            />
          </div>
        ) : (
          <span className="flex-1 text-xs text-gray-400 italic">{t("components.heartSoundsPlayer.realAuscultationRecording")}</span>
        )}
      </div>

      <div className="flex items-center gap-1 justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMuted(!isMuted)} data-testid={`button-mute-${sound.id}`}>
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]} min={0} max={1} step={0.05}
            onValueChange={(v) => { setVolume(v[0]); setIsMuted(v[0] === 0); }}
            className="w-16"
            data-testid={`slider-volume-${sound.id}`}
          />
        </div>
        <Button
          variant="ghost" size="sm"
          className="text-xs h-7 px-2 text-gray-500"
          onClick={() => setExpanded(!expanded)}
          data-testid={`button-details-${sound.id}`}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
          Details
        </Button>
      </div>

      {expanded && !quizMode && (
        <div className="mt-3 pt-3 border-t space-y-2 text-sm" data-testid={`details-${sound.id}`}>
          <div><span className="font-semibold text-gray-700">{t("components.heartSoundsPlayer.timing")}</span> <span className="text-gray-600">{sound.timing}</span></div>
          <div><span className="font-semibold text-gray-700">{t("components.heartSoundsPlayer.location")}</span> <span className="text-gray-600">{sound.location}</span></div>
          <div><span className="font-semibold text-gray-700">{t("components.heartSoundsPlayer.pitch")}</span> <span className="text-gray-600">{sound.pitch}</span></div>
          <p className="text-gray-600">{sound.description}</p>
          <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-800 mb-1">{t("components.heartSoundsPlayer.clinicalSignificance")}</p>
            <p className="text-xs text-blue-700">{sound.clinicalSignificance}</p>
          </div>
          {sound.auscultationTip && (
            <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-xs font-semibold text-teal-800 mb-1 flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" /> {t("components.heartSoundsPlayer.howToAuscultate")}</p>
              <p className="text-xs text-teal-700">{sound.auscultationTip}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">{t("components.heartSoundsPlayer.commonCauses")}</p>
            <ul className="text-xs text-gray-600 space-y-0.5">
              {sound.commonCauses.map((c, i) => <li key={i} className="flex items-start gap-1"><span className="text-gray-400 mt-px">-</span>{c}</li>)}
            </ul>
          </div>
        </div>
      )}

      {quizMode && (
        <div className="mt-3 pt-3 border-t space-y-2" data-testid={`quiz-options-${sound.id}`}>
          {quizOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setSelectedAnswer(opt); setShowAnswer(true); }}
              disabled={showAnswer}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                showAnswer && opt === sound.name ? "bg-green-100 text-green-800 border border-green-300" :
                showAnswer && opt === selectedAnswer && opt !== sound.name ? "bg-red-100 text-red-800 border border-red-300" :
                selectedAnswer === opt ? "bg-primary/10 border border-primary/30" :
                "bg-gray-50 hover:bg-gray-100 border border-transparent"
              }`}
              data-testid={`button-quiz-option-${sound.id}-${i}`}
            >
              {showAnswer && opt === sound.name && <CheckCircle2 className="w-4 h-4 inline mr-2 text-green-600" />}
              {showAnswer && opt === selectedAnswer && opt !== sound.name && <XCircle className="w-4 h-4 inline mr-2 text-red-600" />}
              {opt}
            </button>
          ))}
          {showAnswer && (
            <p className="text-xs text-gray-500 mt-2 italic">
              {selectedAnswer === sound.name ? "Correct!" : `The correct answer is: ${sound.name}`}
              {" "}{sound.clinicalSignificance.split(".")[0]}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function HeartSoundsLibrary() {
  const [expanded, setExpanded] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredSounds = activeFilter === "all"
    ? HEART_SOUNDS
    : HEART_SOUNDS.filter(s => s.category === activeFilter);

  const selectedAreaInfo = AUSCULTATION_AREAS.find(a => a.id === selectedArea);

  return (
    <div className="space-y-6" data-testid="section-heart-sounds-library">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
        data-testid="button-toggle-heart-sounds"
      >
        <HeartPulse className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-bold text-gray-900 flex-1">{t("components.heartSoundsPlayer.heartSoundsAudioPractice")}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{HEART_SOUNDS.length} sounds</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <>
          <Card className="border-red-200 bg-gradient-to-b from-red-50/50 to-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-gray-900">{t("components.heartSoundsPlayer.cardiacAuscultationLandmarks")}</h4>
              </div>
              <p className="text-sm text-gray-500">{t("components.heartSoundsPlayer.tapALandmarkToLearn")}</p>
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <HeartDiagram selectedArea={selectedArea} onSelectArea={(id) => setSelectedArea(selectedArea === id ? null : id)} />
                <div className="space-y-3">
                  {selectedAreaInfo ? (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-2" data-testid={`panel-area-${selectedAreaInfo.id}`}>
                      <h4 className="font-bold text-red-900">{selectedAreaInfo.label}</h4>
                      <p className="text-sm text-gray-700">{selectedAreaInfo.description}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-sm text-gray-500">{t("components.heartSoundsPlayer.selectAnAreaOnThe")}</p>
                      <div className="mt-3 text-xs text-gray-400 space-y-1">
                        <p><strong>A</strong> {t("components.heartSoundsPlayer.aortic2ndIcsRight")}</p>
                        <p><strong>P</strong> {t("components.heartSoundsPlayer.pulmonic2ndIcsLeft")}</p>
                        <p><strong>E</strong> {t("components.heartSoundsPlayer.erbsPoint3rdIcsLeft")}</p>
                        <p><strong>T</strong> {t("components.heartSoundsPlayer.tricuspid4thIcsLeft")}</p>
                        <p><strong>M</strong> {t("components.heartSoundsPlayer.mitralapex5thIcsMcl")}</p>
                      </div>
                    </div>
                  )}
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs font-semibold text-amber-800 mb-1">{t("components.heartSoundsPlayer.auscultationTips")}</p>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>{t("components.heartSoundsPlayer.useTheDiaphragmForHighpitched")}</li>
                      <li>{t("components.heartSoundsPlayer.useTheBellForLowpitched")}</li>
                      <li>{t("components.heartSoundsPlayer.auscultateInAQuietEnvironment")}</li>
                      <li>{t("components.heartSoundsPlayer.listenToAtLeast510")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 flex-wrap" data-testid="filter-heart-sounds">
            {[
              { id: "all", label: "All Sounds" },
              { id: "normal", label: "Normal" },
              { id: "extra", label: "Extra Sounds" },
              { id: "murmur", label: "Murmurs" },
              { id: "abnormal", label: "Abnormal" },
              { id: "congenital", label: "Congenital" },
            ].map(f => (
              <Button
                key={f.id}
                variant={activeFilter === f.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(f.id)}
                className="text-xs"
                data-testid={`button-filter-${f.id}`}
              >
                {f.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2" data-testid="grid-heart-sounds">
            {filteredSounds.map(sound => (
              <HeartSoundCard key={sound.id} sound={sound} allSounds={HEART_SOUNDS} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
