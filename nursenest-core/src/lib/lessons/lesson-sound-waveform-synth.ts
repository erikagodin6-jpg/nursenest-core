/**
 * WebAudio “teaching timbre” previews for lesson-embedded sound libraries.
 * Not a substitute for supervised auscultation practice.
 */

export type RespiratoryWaveformId =
  | "vesicular"
  | "bronchovesicular"
  | "bronchial"
  | "crackles-fine"
  | "crackles-coarse"
  | "inspiratory-crackles"
  | "wheeze"
  | "expiratory-wheeze"
  | "rhonchi"
  | "stridor"
  | "friction-rub"
  | "absent";

export type CardiacWaveformId =
  | "s1-s2-normal"
  | "s3-gallop"
  | "s4-gallop"
  | "systolic-ejection"
  | "holosystolic"
  | "early-diastolic-decrescendo"
  | "diastolic-rumble"
  | "pericardial-friction";

function resolveRespiratoryId(id: RespiratoryWaveformId): Exclude<RespiratoryWaveformId, "inspiratory-crackles" | "absent"> | null {
  if (id === "absent") return null;
  if (id === "inspiratory-crackles") return "crackles-fine";
  if (id === "expiratory-wheeze") return "wheeze";
  return id;
}

export function scheduleRespiratoryWaveform(
  ctx: AudioContext,
  id: RespiratoryWaveformId,
  duration: number,
  gainNode: GainNode,
): void {
  const resolved = resolveRespiratoryId(id);
  if (!resolved) return;
  const now = ctx.currentTime;
  const end = now + duration;

  switch (resolved) {
    case "vesicular": {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const phase = (t % 2) / 2;
        const envelope =
          phase < 0.75 ? Math.sin((phase * Math.PI) / 0.75) * 0.6 : Math.sin(((phase - 0.75) * Math.PI) / 0.25) * 0.2;
        data[i] = (Math.random() * 2 - 1) * envelope * 0.15;
      }
      noise.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 400;
      noise.connect(lp).connect(gainNode);
      noise.start(now);
      noise.stop(end);
      break;
    }
    case "bronchovesicular": {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const phase = (t % 2) / 2;
        const envelope =
          phase < 0.5 ? Math.sin((phase * Math.PI) / 0.5) * 0.5 : Math.sin(((phase - 0.5) * Math.PI) / 0.5) * 0.5;
        data[i] = (Math.random() * 2 - 1) * envelope * 0.2;
      }
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 500;
      bp.Q.value = 1;
      noise.connect(bp).connect(gainNode);
      noise.start(now);
      noise.stop(end);
      break;
    }
    case "bronchial": {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const phase = (t % 2) / 2;
        const envelope =
          phase < 0.35
            ? Math.sin((phase * Math.PI) / 0.35) * 0.4
            : phase < 0.4
              ? 0
              : Math.sin(((phase - 0.4) * Math.PI) / 0.6) * 0.7;
        data[i] = (Math.random() * 2 - 1) * envelope * 0.25;
      }
      noise.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 300;
      noise.connect(hp).connect(gainNode);
      noise.start(now);
      noise.stop(end);
      break;
    }
    case "crackles-fine": {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const cyclePos = (t % 2) / 2;
        let val = 0;
        if (cyclePos > 0.5 && cyclePos < 0.9) {
          if (Math.random() < 0.008) {
            const clickLen = Math.min(Math.floor(Math.random() * 60 + 20), data.length - i);
            for (let j = 0; j < clickLen && i + j < data.length; j++) {
              data[i + j] = (Math.random() * 2 - 1) * Math.exp(-j / 15) * 0.6;
            }
          }
        }
        val += (Math.random() * 2 - 1) * 0.02;
        data[i] = val;
      }
      noise.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 600;
      noise.connect(hp).connect(gainNode);
      noise.start(now);
      noise.stop(end);
      break;
    }
    case "crackles-coarse": {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const cyclePos = (t % 2) / 2;
        let val = 0;
        if (cyclePos > 0.1 && cyclePos < 0.8) {
          if (Math.random() < 0.005) {
            const clickLen = Math.min(Math.floor(Math.random() * 200 + 80), data.length - i);
            for (let j = 0; j < clickLen && i + j < data.length; j++) {
              data[i + j] = (Math.random() * 2 - 1) * Math.exp(-j / 60) * 0.8;
            }
          }
        }
        val += (Math.random() * 2 - 1) * 0.03;
        data[i] = val;
      }
      noise.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 500;
      noise.connect(lp).connect(gainNode);
      noise.start(now);
      noise.stop(end);
      break;
    }
    case "wheeze": {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 400;
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 50;
      lfo.connect(lfoGain).connect(osc.frequency);
      const modGain = ctx.createGain();
      modGain.gain.value = 0;
      const cycleLen = 2;
      const cycles = Math.ceil(duration / cycleLen);
      for (let c = 0; c < cycles; c++) {
        const cStart = now + c * cycleLen;
        modGain.gain.setValueAtTime(0.02, cStart);
        modGain.gain.linearRampToValueAtTime(0.02, cStart + 0.3);
        modGain.gain.linearRampToValueAtTime(0.25, cStart + 0.5);
        modGain.gain.linearRampToValueAtTime(0.3, cStart + 1.4);
        modGain.gain.linearRampToValueAtTime(0.05, cStart + 1.8);
        modGain.gain.linearRampToValueAtTime(0.02, cStart + 2.0);
      }
      osc.connect(modGain).connect(gainNode);
      osc.start(now);
      osc.stop(end);
      lfo.start(now);
      lfo.stop(end);
      break;
    }
    case "rhonchi": {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const base = Math.sin(2 * Math.PI * 80 * t) * 0.3 + Math.sin(2 * Math.PI * 120 * t) * 0.2;
        const envelope = Math.sin(((t % 2) * Math.PI) / 2) * 0.7;
        data[i] = (base + (Math.random() * 2 - 1) * 0.15) * envelope;
      }
      noise.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 300;
      noise.connect(lp).connect(gainNode);
      noise.start(now);
      noise.stop(end);
      break;
    }
    case "stridor": {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 700;
      const modGain = ctx.createGain();
      modGain.gain.value = 0;
      const cycleLen = 2;
      const cycles = Math.ceil(duration / cycleLen);
      for (let c = 0; c < cycles; c++) {
        const cStart = now + c * cycleLen;
        modGain.gain.setValueAtTime(0.02, cStart);
        modGain.gain.linearRampToValueAtTime(0.3, cStart + 0.3);
        modGain.gain.linearRampToValueAtTime(0.25, cStart + 0.8);
        modGain.gain.linearRampToValueAtTime(0.02, cStart + 1.0);
        modGain.gain.setValueAtTime(0.02, cStart + 1.0);
        modGain.gain.linearRampToValueAtTime(0.08, cStart + 1.3);
        modGain.gain.linearRampToValueAtTime(0.02, cStart + 1.8);
      }
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1200;
      osc.connect(modGain).connect(lp).connect(gainNode);
      osc.start(now);
      osc.stop(end);
      break;
    }
    case "friction-rub": {
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const cyclePos = (t % 2) / 2;
        let envelope = 0;
        if (cyclePos < 0.4) {
          const scrub = Math.sin((cyclePos * Math.PI) / 0.4);
          envelope = scrub * (0.5 + 0.5 * Math.sin(2 * Math.PI * 30 * t));
        } else if (cyclePos > 0.5 && cyclePos < 0.9) {
          const adj = (cyclePos - 0.5) / 0.4;
          const scrub = Math.sin(adj * Math.PI);
          envelope = scrub * (0.5 + 0.5 * Math.sin(2 * Math.PI * 25 * t));
        }
        data[i] = (Math.random() * 2 - 1) * envelope * 0.35;
      }
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 350;
      bp.Q.value = 2;
      noise.connect(bp).connect(gainNode);
      noise.start(now);
      noise.stop(end);
      break;
    }
    default:
      break;
  }
}

export function scheduleCardiacWaveform(
  ctx: AudioContext,
  id: CardiacWaveformId,
  duration: number,
  gainNode: GainNode,
): void {
  const now = ctx.currentTime;
  const end = now + duration;

  if (id === "s1-s2-normal") {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    const g = ctx.createGain();
    g.gain.value = 0;
    const hr = 72 / 60;
    const beat = 1 / hr;
    const cycles = Math.ceil(duration / beat);
    for (let i = 0; i < cycles; i++) {
      const b0 = now + i * beat;
      g.gain.setValueAtTime(0, b0);
      g.gain.linearRampToValueAtTime(0.35, b0 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, b0 + 0.12);
      g.gain.setValueAtTime(0, b0 + 0.18);
      g.gain.linearRampToValueAtTime(0.22, b0 + 0.24);
      g.gain.exponentialRampToValueAtTime(0.001, b0 + 0.38);
    }
    osc.frequency.value = 55;
    osc.connect(g).connect(gainNode);
    osc.start(now);
    osc.stop(end);
    return;
  }

  if (id === "s3-gallop" || id === "s4-gallop") {
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      const phase = (t % 0.85) / 0.85;
      const gallopDelay = id === "s3-gallop" ? 0.62 : 0.42;
      let env = 0;
      if (phase > gallopDelay && phase < gallopDelay + 0.12) {
        const u = (phase - gallopDelay) / 0.12;
        env = Math.sin(u * Math.PI) * 0.55;
      }
      data[i] = (Math.random() * 2 - 1) * env * 0.35;
    }
    noise.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 120;
    noise.connect(lp).connect(gainNode);
    noise.start(now);
    noise.stop(end);
    return;
  }

  if (id === "systolic-ejection" || id === "holosystolic") {
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      const c = (t % 0.85) / 0.85;
      let env = 0;
      if (id === "holosystolic") {
        if (c > 0.2 && c < 0.75) env = 0.55;
      } else if (c > 0.22 && c < 0.55) {
        const u = (c - 0.22) / 0.33;
        env = Math.sin(u * Math.PI) * 0.65;
      }
      data[i] = (Math.random() * 2 - 1) * env * 0.45;
    }
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = id === "holosystolic" ? 220 : 180;
    bp.Q.value = 1.2;
    noise.connect(bp).connect(gainNode);
    noise.start(now);
    noise.stop(end);
    return;
  }

  if (id === "early-diastolic-decrescendo") {
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      const c = (t % 0.85) / 0.85;
      let env = 0;
      if (c > 0.32 && c < 0.62) {
        const u = (c - 0.32) / 0.3;
        env = Math.sin(Math.PI * u) * (1 - u) * 0.55;
      }
      data[i] = (Math.random() * 2 - 1) * env * 0.35;
    }
    noise.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 180;
    noise.connect(hp).connect(gainNode);
    noise.start(now);
    noise.stop(end);
    return;
  }

  if (id === "diastolic-rumble") {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 90;
    const g = ctx.createGain();
    const beat = 60 / 70;
    const cycles = Math.ceil(duration / beat);
    for (let i = 0; i < cycles; i++) {
      const s = now + i * beat + 0.5;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.18, s + 0.05);
      g.gain.linearRampToValueAtTime(0.16, s + 0.25);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.45);
    }
    osc.connect(g).connect(gainNode);
    osc.start(now);
    osc.stop(end);
    return;
  }

  if (id === "pericardial-friction") {
    scheduleRespiratoryWaveform(ctx, "friction-rub", duration, gainNode);
  }
}
