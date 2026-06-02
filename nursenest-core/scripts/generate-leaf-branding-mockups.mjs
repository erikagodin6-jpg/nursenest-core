#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/leaf-branding-preview");

const LEAF = `<svg viewBox="0 0 50 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path class="nn-leaf-fill" d="M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z"/><path class="nn-leaf-vein" d="M11 40 C11 32.5 17 27 25 27 S39 32.5 39 40 Z"/></svg>`;

const themes = {
  ocean: {
    brand: "#1ca3d9",
    ink: "#1a2330",
    muted: "#5c6b78",
    bg: "#f4f9fc",
    card: "#ffffff",
    border: "#e2eaef",
    soft: "#e8f6fc",
    leafTint: "#1ca3d9",
    leafGlow: "rgba(28,163,217,0.14)",
    leafOp1: "0.09",
    leafOp2: "0.055",
    leafOpDepth: "0.045",
  },
  blossom: {
    brand: "#9b4dca",
    ink: "#1a2330",
    muted: "#5c5a68",
    bg: "#fdf8fc",
    card: "#ffffff",
    border: "#eadcf0",
    soft: "#f6e8f8",
    leafTint: "#b86fd4",
    leafGlow: "rgba(155,77,202,0.16)",
    leafOp1: "0.1",
    leafOp2: "0.06",
    leafOpDepth: "0.05",
  },
  midnight: {
    brand: "#5ec8ef",
    ink: "#eef4f8",
    muted: "#8fa3b0",
    bg: "#0c1016",
    card: "#141a22",
    border: "#24303c",
    soft: "#1a2430",
    leafTint: "#5ec8ef",
    leafGlow: "rgba(94,200,239,0.08)",
    leafOp1: "0.07",
    leafOp2: "0.04",
    leafOpDepth: "0.06",
  },
};

function shell(title, themeName, body, w = 1280) {
  const t = themes[themeName];
  return `<!DOCTYPE html>
<html lang="en" data-theme="${themeName}">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="leaf-shared.css"/>
<style>
:root {
  --brand: ${t.brand}; --ink: ${t.ink}; --muted: ${t.muted}; --bg: ${t.bg};
  --card: ${t.card}; --border: ${t.border}; --soft: ${t.soft};
  --leaf-tint: ${t.leafTint}; --leaf-glow: ${t.leafGlow};
  --leaf-op-1: ${t.leafOp1}; --leaf-op-2: ${t.leafOp2}; --leaf-op-depth: ${t.leafOpDepth};
}
body { font-family: "DM Sans", system-ui, sans-serif; background: var(--bg); color: var(--ink); margin: 0; width: ${w}px; }
.wrap { padding: 2rem 2.5rem; }
.label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.5rem; }
h1,h2 { font-weight: 800; letter-spacing: -0.02em; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 1.15rem; padding: 1.35rem; position: relative; }
.btn { display: inline-block; padding: 0.7rem 1.25rem; background: var(--brand); color: ${themeName === "midnight" ? "#0c1016" : "#fff"}; font-weight: 700; border-radius: 999px; text-decoration: none; }
</style>
</head>
<body>${body}</body>
</html>`;
}

const mockups = [
  {
    file: "01-homepage-hero-leaf-ocean.html",
    w: 1280,
    html: shell(
      "01 Homepage hero leaf",
      "ocean",
      `<div class="nn-surface nn-leaf-radial" style="min-height:720px">
  <div class="nn-leaf-layer nn-leaf--tr">${LEAF}</div>
  <div class="nn-leaf-layer nn-leaf--bl">${LEAF}</div>
  <div class="nn-leaf-layer nn-leaf--depth">${LEAF}</div>
  <div class="wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:center;padding-top:3rem">
    <div>
      <p class="label">Leaf branding · Ocean</p>
      <h1 style="font-size:2.75rem;line-height:1.08;max-width:14ch">Master nursing with <span style="color:var(--brand)">AI-powered</span> coaching</h1>
      <p style="color:var(--muted);max-width:42ch;margin:1rem 0 1.5rem">Corner + depth watermarks — subtle, not decorative clutter.</p>
      <a class="btn" href="#">Start free</a>
    </div>
    <div class="card" style="box-shadow:0 16px 48px -24px rgba(26,35,48,.14)">
      <div class="nn-leaf-card-accent">${LEAF}</div>
      <p class="label">Readiness</p>
      <p style="font-size:3rem;font-weight:800;color:var(--brand);margin:0">78%</p>
    </div>
  </div>
</div>`,
      1280,
    ),
  },
  {
    file: "02-dashboard-readiness-ocean.html",
    w: 1280,
    html: shell(
      "02 Dashboard readiness",
      "ocean",
      `<div class="wrap nn-surface nn-leaf-radial" style="min-height:600px">
  <div class="nn-leaf-layer nn-leaf--tr">${LEAF}</div>
  <p class="label">Learner dashboard · readiness band</p>
  <h2 style="font-size:1.75rem;margin-bottom:1.25rem">Your clinical readiness workspace</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
    <div class="card"><div class="nn-leaf-card-accent">${LEAF}</div><p style="font-size:.65rem;font-weight:700;color:var(--muted);text-transform:uppercase">Exam readiness</p><p style="font-size:2rem;font-weight:800;color:var(--brand)">78%</p></div>
    <div class="card"><p style="font-size:.65rem;font-weight:700;color:var(--muted);text-transform:uppercase">CAT trend</p><p style="font-size:2rem;font-weight:800">+6</p></div>
    <div class="card"><p style="font-size:.65rem;font-weight:700;color:var(--muted);text-transform:uppercase">Streak</p><p style="font-size:2rem;font-weight:800">9d</p></div>
  </div>
</div>`,
    ),
  },
  {
    file: "03-coaching-panel-ocean.html",
    w: 1280,
    html: shell(
      "03 Coaching panel",
      "ocean",
      `<div class="wrap"><div class="card nn-surface" style="padding:2rem;background:linear-gradient(165deg,var(--soft),var(--card));min-height:420px">
  <div class="nn-leaf-layer nn-leaf--br">${LEAF}</div>
  <div class="nn-leaf-layer nn-leaf--depth" style="opacity:0.03">${LEAF}</div>
  <p class="label">AI clinical coach</p>
  <h2 style="font-size:1.5rem;margin-bottom:.75rem">Next-best study actions</h2>
  <p style="color:var(--muted);max-width:50ch">Growth-oriented leaf accent near coaching command center — adaptive path metaphor.</p>
  <ul style="margin-top:1.25rem;color:var(--ink);line-height:1.8">
    <li>Review Pharmacology weak band (22 min)</li>
    <li>CAT session — readiness impact +4%</li>
  </ul>
</div></div>`,
    ),
  },
  {
    file: "04-cat-analytics-ocean.html",
    w: 1280,
    html: shell(
      "04 CAT analytics",
      "ocean",
      `<div class="wrap nn-surface" style="min-height:520px;background:var(--card);border:1px solid var(--border);border-radius:1.25rem;margin:2rem auto;max-width:72rem">
  <div class="nn-leaf-layer nn-leaf--tr" style="opacity:0.05;filter:blur(12px)">${LEAF}</div>
  <div style="padding:2rem">
    <p class="label">CAT report · geometric leaf abstraction</p>
    <h2 style="font-size:1.5rem">Performance trajectory</h2>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;margin-top:1.25rem">
      <div style="height:200px;border-radius:1rem;background:linear-gradient(180deg,var(--soft),var(--card));border:1px solid var(--border);position:relative">
        <div class="nn-leaf-layer" style="right:8%;top:10%;width:80px;opacity:0.12">${LEAF}</div>
      </div>
      <div class="card"><p style="font-size:.75rem;color:var(--muted)">Pass outlook</p><p style="font-size:2.25rem;font-weight:800;color:var(--brand)">68%</p></div>
    </div>
  </div>
</div>`,
    ),
  },
  {
    file: "05-empty-state-ocean.html",
    w: 480,
    html: shell(
      "05 Empty state",
      "ocean",
      `<div class="wrap" style="text-align:center;padding:3rem 2rem"><div class="nn-leaf-empty">${LEAF}</div>
  <h2 style="font-size:1.25rem">No sessions yet</h2>
  <p style="color:var(--muted);margin:.75rem 0 1.25rem">Start a CAT practice loop to see readiness grow.</p>
  <a class="btn" href="#">Begin CAT</a></div>`,
      480,
    ),
  },
  {
    file: "06-loading-state-ocean.html",
    w: 480,
    html: shell(
      "06 Loading",
      "ocean",
      `<div class="wrap" style="text-align:center;padding:3rem 2rem">
  <div class="nn-leaf-empty" style="opacity:0.5;animation:nn-leaf-pulse 2s ease-in-out infinite">${LEAF}</div>
  <style>@keyframes nn-leaf-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.55;transform:scale(1.04)}}</style>
  <p style="font-weight:700;margin-bottom:1rem">Adapting your study plan…</p>
  <div class="nn-leaf-loader-track" style="max-width:12rem;margin:0 auto"></div>
</div>`,
      480,
    ),
  },
  {
    file: "07-onboarding-ocean.html",
    w: 1280,
    html: shell(
      "07 Onboarding",
      "ocean",
      `<div class="nn-surface nn-leaf-radial" style="min-height:560px;display:flex;align-items:center;justify-content:center">
  <div class="nn-leaf-layer nn-leaf--depth">${LEAF}</div>
  <div class="card" style="max-width:28rem;text-align:center;padding:2.5rem">
    <div class="nn-leaf-empty" style="opacity:0.45">${LEAF}</div>
    <p class="label">Welcome</p>
    <h2 style="font-size:1.5rem">Build your adaptive readiness profile</h2>
    <p style="color:var(--muted);margin:1rem 0 1.5rem">Soft botanical depth behind onboarding — calm, premium, recognizable.</p>
    <a class="btn" href="#">Continue</a>
  </div>
</div>`,
    ),
  },
  {
    file: "08-blossom-organic-soft.html",
    w: 1280,
    html: shell(
      "08 Blossom",
      "blossom",
      `<div class="nn-surface nn-leaf-radial" style="min-height:640px">
  <div class="nn-leaf-layer nn-leaf--tr" style="opacity:0.11">${LEAF}</div>
  <div class="nn-leaf-layer nn-leaf--bl" style="opacity:0.07;filter:blur(10px)">${LEAF}</div>
  <div class="wrap" style="padding-top:3rem">
    <p class="label">Blossom · softer organic overlays</p>
    <h1 style="font-size:2.5rem;max-width:16ch">Warm, optimistic <span style="color:var(--brand)">clinical growth</span></h1>
    <p style="color:var(--muted);max-width:40ch">Warmer leaf tint + floral-soft radial — same structure, theme tokens only.</p>
  </div>
</div>`,
    ),
  },
  {
    file: "09-midnight-deep-silhouette.html",
    w: 1280,
    html: shell(
      "09 Midnight",
      "midnight",
      `<div class="nn-surface" style="min-height:640px;background:var(--bg)">
  <div class="nn-leaf-layer nn-leaf--tr" style="opacity:0.06;filter:blur(4px)">${LEAF}</div>
  <div class="nn-leaf-layer nn-leaf--depth" style="opacity:0.08;filter:blur(36px)">${LEAF}</div>
  <div class="wrap" style="padding-top:3rem">
    <p class="label">Midnight · deep silhouettes</p>
    <h1 style="font-size:2.5rem">Calm intelligence after dark</h1>
    <p style="color:var(--muted)">Low-contrast illuminated leaf accents — no muddy overlays.</p>
    <div class="card" style="margin-top:2rem;max-width:360px">
      <p style="font-size:2.5rem;font-weight:800;color:var(--brand)">78%</p>
      <p style="color:var(--muted);font-size:.875rem">Readiness · charts stay readable</p>
    </div>
  </div>
</div>`,
    ),
  },
  {
    file: "10-progress-growth-metaphor.html",
    w: 720,
    html: shell(
      "10 Progress growth",
      "ocean",
      `<div class="wrap"><p class="label">Progress · growth metaphor</p>
  <h2 style="font-size:1.35rem;margin-bottom:1rem">Adaptive pathway</h2>
  <div class="card">
    <div class="nn-leaf-progress" style="margin-bottom:1rem">
      <span class="dot on"></span><span class="dot on"></span><span class="dot on"></span><span class="dot"></span>
      ${LEAF.replace("<svg", '<svg style="width:1.25rem"')}
    </div>
    <p style="color:var(--muted);font-size:.9rem">Leaf marks mastery milestones — subtle, not gamified.</p>
  </div></div>`,
      720,
    ),
  },
  {
    file: "11-section-divider-gradient.html",
    w: 1280,
    html: shell(
      "11 Section divider",
      "ocean",
      `<div style="padding:0 0 2rem">
  <div class="nn-surface" style="height:120px;background:linear-gradient(180deg,var(--bg),var(--soft));position:relative">
    <div class="nn-leaf-layer" style="left:50%;top:50%;width:200px;transform:translate(-50%,-50%);opacity:0.06;filter:blur(8px)">${LEAF}</div>
  </div>
  <div class="wrap"><h2 style="font-size:1.5rem">Section transition</h2>
  <p style="color:var(--muted)">Organic divider between homepage story blocks — breaks flat white slabs.</p></div>
</div>`,
    ),
  },
  {
    file: "12-marketing-screenshot-composite.html",
    w: 1280,
    html: shell(
      "12 Marketing composite",
      "ocean",
      `<div class="nn-surface nn-leaf-radial" style="min-height:700px">
  <div class="nn-leaf-layer nn-leaf--tr">${LEAF}</div>
  <div class="nn-leaf-layer nn-leaf--bl">${LEAF}</div>
  <div class="wrap" style="padding-top:2rem">
    <p class="label">Screenshot-ready · distinctly NurseNest</p>
    <div style="display:grid;grid-template-columns:1.1fr 0.9fr;gap:1.5rem;align-items:start">
      <div>
        <h1 style="font-size:2.25rem;line-height:1.1">Premium adaptive NCLEX coaching</h1>
        <p style="color:var(--muted);margin:1rem 0">Layered leaf + analytics mockup = instant brand recognition.</p>
      </div>
      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:1.25rem;border-bottom:1px solid var(--border)">
          <div class="nn-leaf-card-accent">${LEAF}</div>
          <p style="font-size:2rem;font-weight:800;color:var(--brand)">78%</p>
        </div>
        <div style="height:140px;background:var(--soft);position:relative">
          <div class="nn-leaf-layer nn-leaf--depth" style="opacity:0.08;width:100%">${LEAF}</div>
        </div>
      </div>
    </div>
  </div>
</div>`,
    ),
  },
];

await mkdir(out, { recursive: true });
for (const m of mockups) {
  await writeFile(path.join(out, m.file), m.html, "utf8");
}
console.log(`Wrote ${mockups.length} mockups to ${out}`);
