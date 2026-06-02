#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/landing-polish-preview");

const LEAF = `<svg viewBox="0 0 50 44"><path class="nn-leaf-fill" d="M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z"/><path class="nn-leaf-vein" d="M11 40 C11 32.5 17 27 25 27 S39 32.5 39 40 Z"/></svg>`;
const leafLayers = `<div class="nn-leaf-layer nn-leaf--tr">${LEAF}</div><div class="nn-leaf-layer nn-leaf--bl">${LEAF}</div><div class="nn-leaf-layer nn-leaf--depth">${LEAF}</div>`;

function head(title, palette) {
  return `<!DOCTYPE html><html lang="en" data-palette="${palette}"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="multi-tone-system.css"/>
</head>`;
}

const nav = `<header class="mkt-nav">
  <div class="logo">NurseNest</div>
  <nav class="nav-pills"><span class="nav-pill on">Home</span><span class="nav-pill">Pricing</span><span class="nav-pill">Lessons</span><span class="nav-pill">CAT</span></nav>
  <div style="display:flex;gap:.5rem;align-items:center"><a class="btn btn-ghost" href="#">Sign in</a><a class="btn btn-primary" href="#">Start free</a></div>
</header>`;

function kpiRow() {
  return `<div class="grid-4" style="margin-top:1rem">
    <div class="hue-card c1"><p class="tag">Readiness</p><p class="val">78%</p><div class="progress-bar"><span class="pb-brand"></span></div></div>
    <div class="hue-card c2"><p class="tag">CAT trend</p><p class="val">+6</p><div class="progress-bar"><span class="pb-teal"></span></div></div>
    <div class="hue-card c3"><p class="tag">Mastered</p><p class="val">124</p><div class="progress-bar"><span class="pb-lilac"></span></div></div>
    <div class="hue-card c4"><p class="tag">Streak</p><p class="val">9d</p><div class="progress-bar"><span class="pb-brand" style="width:90%"></span></div></div>
  </div>`;
}

function dashboardInner(palette) {
  return `
<div class="app-shell" data-palette="${palette}">
  <aside class="sidebar">
    <div class="logo">NurseNest</div>
    <a class="side-link on">Dashboard</a>
    <a class="side-link">Lessons</a>
    <a class="side-link">Flashcards</a>
    <a class="side-link">Questions</a>
    <a class="side-link">CAT</a>
    <a class="side-link">Readiness</a>
  </aside>
  <main class="app-main nn-surface">${leafLayers}
    <p class="eyebrow">Clinical study coach</p>
    <h1 style="font-size:1.65rem;margin-bottom:.35rem">Your adaptive readiness workspace</h1>
    <p class="lead" style="font-size:.9rem;margin-bottom:0">Multi-tone KPIs · coaching · charts — color across the full canvas.</p>
    ${kpiRow()}
    <div class="grid-2" style="margin-top:1rem">
      <div class="coach-panel">
        <p class="eyebrow" style="color:var(--c-brand)">AI coach</p>
        <h2 style="font-size:1.1rem;margin:.35rem 0 .75rem">Next-best study actions</h2>
        <p style="font-size:.85rem;color:var(--muted)">Review Pharmacology weak band · 22 min</p>
        <p style="font-size:.85rem;color:var(--muted);margin-top:.35rem">CAT session · readiness +4%</p>
        <div class="flash-row">
          <span class="flash-chip fc-mint">Remediation</span>
          <span class="flash-chip fc-sky">CAT</span>
          <span class="flash-chip fc-lilac">Labs</span>
        </div>
      </div>
      <div class="chart-panel">
        <p class="eyebrow">Performance</p>
        <h2 style="font-size:1.05rem">Weekly trajectory</h2>
        <div class="chart-bars">
          <i class="bar-1"></i><i class="bar-2"></i><i class="bar-3"></i><i class="bar-4"></i><i class="bar-5"></i>
        </div>
      </div>
    </div>
    <div class="grid-3" style="margin-top:1rem">
      <div class="hue-card c2" style="min-height:100px"><p class="tag">Flashcards due</p><p class="val" style="font-size:1.35rem">24</p></div>
      <div class="hue-card c3"><p class="tag">Practice accuracy</p><p class="val" style="font-size:1.35rem">82%</p></div>
      <div class="hue-card c4"><p class="tag">Weak systems</p><p class="val" style="font-size:1.15rem">Pharm · Med-Surg</p></div>
    </div>
  </main>
</div>`;
}

function dashboardMain(palette) {
  return `${head(`Dashboard ${palette}`, palette)}
<body class="nn-surface nn-leaf-radial" data-palette="${palette}">
${dashboardInner(palette)}
</body></html>`;
}

function marketingFull(palette, heroTitle, heroAccent) {
  return `${head(`Marketing ${palette}`, palette)}
<body class="nn-surface nn-leaf-radial">${leafLayers}
${nav}
<section class="section-hero-band nn-surface" style="position:relative;overflow:hidden">
  ${leafLayers}
  <div style="max-width:72rem;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:2.5rem;align-items:center">
    <div>
      <p class="eyebrow">Adaptive clinical readiness</p>
      <h1>${heroTitle} <span style="color:var(--c-mint)">${heroAccent}</span></h1>
      <p class="lead">Intentional multi-tone composition — not pink-only or flat white slabs. Premium healthcare AI at first glance.</p>
      <div style="display:flex;gap:.75rem;margin-top:1.25rem;flex-wrap:wrap">
        <a class="btn btn-primary" href="#">Start free</a>
        <a class="btn" href="#" style="background:#fff;color:var(--ink);border:1px solid rgba(255,255,255,.4)">View pricing</a>
      </div>
    </div>
    <div class="mock-device">
      <div style="padding:1rem;background:var(--band-3)">${kpiRow().replace('margin-top:1rem','margin-top:0')}</div>
      <div style="padding:1rem;background:linear-gradient(180deg,var(--c-cream),#fff)">
        <div class="coach-panel" style="margin:0"><p style="font-size:.75rem;font-weight:700;color:var(--c-teal)">LIVE COACH</p><p style="font-weight:800;margin-top:.25rem">Start CAT session →</p></div>
      </div>
    </div>
  </div>
</section>
<section class="section-band"><div style="max-width:72rem;margin:0 auto">
  <h2>Study loop — color across every surface</h2>
  <p class="lead" style="margin:.5rem 0 1.25rem">Lessons · practice · CAT · flashcards · readiness in one orchestrated palette.</p>
  <div class="grid-3">
    <div class="hue-card c1"><h3 style="font-size:1rem;margin-bottom:.35rem">Adaptive CAT</h3><p style="font-size:.85rem;color:var(--muted)">Exam-style difficulty</p><div class="flash-row"><span class="flash-chip fc-sky">Live</span></div></div>
    <div class="hue-card c2"><h3 style="font-size:1rem;margin-bottom:.35rem">AI coaching</h3><p style="font-size:.85rem;color:var(--muted)">Remediation paths</p><div class="flash-row"><span class="flash-chip fc-mint">Priority</span></div></div>
    <div class="hue-card c3"><h3 style="font-size:1rem;margin-bottom:.35rem">Readiness</h3><p style="font-size:.85rem;color:var(--muted)">Pass outlook bands</p><div class="flash-row"><span class="flash-chip fc-lilac">Analytics</span></div></div>
  </div>
</div></section>
<section class="section-rich"><div style="max-width:72rem;margin:0 auto" class="grid-2">
  <div>
    <h2>CAT readiness &amp; probability</h2>
    <p class="lead" style="font-size:.95rem">Layered sage · aqua · lilac section transition — visually alive.</p>
    <div class="flash-row" style="margin-top:1rem">
      <span class="flash-chip fc-pink">Pharm</span><span class="flash-chip fc-mint">Fundamentals</span>
      <span class="flash-chip fc-butter">Pediatrics</span><span class="flash-chip fc-lilac">Mental health</span>
    </div>
  </div>
  <div class="chart-panel" style="min-height:200px">
    <p class="tag" style="font-size:.65rem;font-weight:700;color:var(--c-brand)">PASS OUTLOOK</p>
    <p style="font-size:2.5rem;font-weight:800;color:var(--c-brand)">68%</p>
    <div class="chart-bars" style="height:70px"><i class="bar-1"></i><i class="bar-2"></i><i class="bar-3"></i><i class="bar-4"></i></div>
  </div>
</div></section>
<section style="padding:3rem 1.5rem;background:var(--band-1);color:#fff">
  <div style="max-width:72rem;margin:0 auto;text-align:center">
    <h2 style="color:#fff">Start your adaptive readiness journey</h2>
    <p style="color:#c5dce8;max-width:40ch;margin:.75rem auto 1.25rem">Screenshot-ready · investor-deck quality · unmistakably NurseNest.</p>
    <a class="btn btn-primary" href="#">Start free</a>
  </div>
</section>
</body></html>`;
}

const files = [
  { name: "01-marketing-ocean-full.html", html: marketingFull("ocean", "Master nursing with", "AI-powered coaching") },
  { name: "02-marketing-blossom-full.html", html: marketingFull("blossom", "Warm clinical readiness with", "adaptive coaching") },
  { name: "03-dashboard-ocean-full.html", html: dashboardMain("ocean") },
  { name: "04-dashboard-blossom-full.html", html: dashboardMain("blossom") },
  { name: "05-marketing-ocean-mobile.html", html: `${head("Mobile ocean", "ocean")}<body style="max-width:390px;margin:0 auto">${nav}
<section style="padding:1.5rem 1.15rem;background:var(--band-1);color:#fff">${leafLayers}
<p class="eyebrow" style="color:var(--c-mint)">Ocean · mobile</p>
<h1 style="font-size:1.65rem;color:#fff">AI-powered NCLEX coaching</h1>
<p style="color:#c5dce8;font-size:.9rem;margin:.75rem 0 1rem">Multi-hue chips &amp; cards — no monochrome stack.</p>
<a class="btn btn-primary" href="#" style="display:block;text-align:center">Start free</a>
</section>
<section style="padding:1.25rem;background:var(--band-3)">${kpiRow().replace('grid-4','grid-4').replace('repeat(4','repeat(2')}</section>
</body></html>` },
  { name: "06-pathway-hub-ocean.html", html: `${head("Pathway hub", "ocean")}<body class="nn-surface nn-leaf-radial">${leafLayers}${nav}
<section class="section-hero-band" style="padding:3rem 1.5rem"><div style="max-width:72rem;margin:0 auto">
<p class="eyebrow">United States · RN</p><h1>NCLEX-RN readiness hub</h1>
<p class="lead">Navy-to-teal hero · mint accents · sky study-mode cards.</p>
<div class="flash-row" style="margin-top:1rem"><span class="flash-chip fc-sky">CAT</span><span class="flash-chip fc-mint">Lessons</span><span class="flash-chip fc-lilac">Questions</span><span class="flash-chip fc-butter">Flashcards</span></div>
</div></section>
<section class="section-rich"><div style="max-width:72rem;margin:0 auto" class="grid-3">
<div class="hue-card c1"><h3>Adaptive CAT</h3><p style="font-size:.85rem;color:var(--muted)">Exam rhythm</p></div>
<div class="hue-card c2"><h3>Question bank</h3><p style="font-size:.85rem;color:var(--muted)">Topic filters</p></div>
<div class="hue-card c3"><h3>Lesson library</h3><p style="font-size:.85rem;color:var(--muted)">Clinical depth</p></div>
</div></section>
<section style="padding:2rem 1.5rem;background:var(--page-bg)"><div style="max-width:72rem;margin:0 auto" class="mock-device"><div style="padding:1rem;background:var(--band-3)">${kpiRow()}</div></div></section>
</body></html>` },
  { name: "07-pricing-multitone-ocean.html", html: `${head("Pricing", "ocean")}<body>${nav}
<section class="section-band" style="padding:3.5rem 1.5rem"><div style="max-width:72rem;margin:0 auto;text-align:center">
<h2>Plans with intentional color hierarchy</h2><p class="lead" style="margin:.75rem auto 2rem">Each tier uses a distinct hue — not identical white cards.</p>
<div class="grid-3" style="text-align:left">
<div class="hue-card c4"><h3>Free</h3><p class="val" style="font-size:1.75rem">$0</p></div>
<div class="hue-card c1" style="border:2px solid var(--c-brand)"><h3>Pro</h3><p class="val" style="font-size:1.75rem">Pro</p><a class="btn btn-primary" href="#" style="margin-top:1rem;display:inline-flex">Start trial</a></div>
<div class="hue-card c3"><h3>Team</h3><p class="val" style="font-size:1.75rem">Schools</p></div>
</div></div></section></body></html>` },
  { name: "08-flashcards-session-blossom.html", html: `${head("Flashcards blossom", "blossom")}<body class="nn-surface">${leafLayers}
<div class="app-shell"><aside class="sidebar"><div class="logo">NurseNest</div><a class="side-link on">Flashcards</a></aside>
<main class="app-main" style="background:var(--band-3)">
<p class="eyebrow">Flashcard session</p>
<div class="hue-card c1" style="max-width:36rem;margin:1rem auto;padding:2rem;min-height:220px">
<p class="tag">Pharmacology</p><h2 style="margin:.5rem 0 1rem">Which lab signals digoxin toxicity?</h2>
<div class="flash-row"><span class="flash-chip fc-pink">K+ low</span><span class="flash-chip fc-mint">BUN high</span><span class="flash-chip fc-lilac">Na+ low</span><span class="flash-chip fc-butter">Ca+ high</span></div>
</div>
<div class="grid-4" style="max-width:36rem;margin:0 auto">${kpiRow().match(/<div class="hue-card[\s\S]*?<\/div>\s*<\/div>/)[0] || ""}</div>
</main></div></body></html>` },
  { name: "09-cat-readiness-ocean.html", html: `${head("CAT readiness", "ocean")}<body class="app-shell"><aside class="sidebar"><div class="logo">NurseNest</div><a class="side-link on">CAT</a></aside>
<main class="app-main nn-surface">${leafLayers}
<p class="eyebrow">CAT readiness report</p><h1 style="font-size:1.5rem">Performance trajectory</h1>
<div class="grid-2" style="margin-top:1rem"><div class="chart-panel"><div class="chart-bars"><i class="bar-1"></i><i class="bar-2"></i><i class="bar-3"></i><i class="bar-4"></i><i class="bar-5"></i></div></div>
<div class="hue-card c1"><p class="tag">Pass outlook</p><p class="val">68%</p><p style="font-size:.8rem;color:var(--muted)">Indicative estimate</p></div></div>
${kpiRow()}
</main></body></html>` },
  { name: "10-marketing-blossom-mobile.html", html: `${head("Mobile blossom", "blossom")}<body style="max-width:390px;margin:0 auto">${nav}
<section style="padding:1.5rem;background:var(--band-1);color:#fff"><p class="eyebrow" style="color:var(--c-butter)">Blossom</p>
<h1 style="font-size:1.6rem;color:#fff">Mint · pink · lilac · sage</h1>
<p style="color:#f0e6f4;font-size:.9rem;margin:.75rem 0 1rem">Warm multi-tone at first glance.</p>
<a class="btn btn-primary" href="#" style="display:block;text-align:center">Start free</a></section>
<section style="padding:1rem;background:var(--band-3)"><div class="grid-4" style="grid-template-columns:1fr 1fr;gap:.5rem">
<div class="hue-card c1" style="padding:.85rem"><p class="tag">Ready</p><p class="val" style="font-size:1.25rem">78%</p></div>
<div class="hue-card c2" style="padding:.85rem"><p class="tag">CAT</p><p class="val" style="font-size:1.25rem">+6</p></div>
</div></section></body></html>` },
  { name: "11-coaching-panel-compare.html", html: `${head("Coaching compare", "ocean")}<body style="padding:1.5rem;background:#e8ecf0">
<div class="grid-2" style="max-width:1100px;margin:0 auto">
<div data-palette="ocean" style="padding:1rem;border-radius:1rem;background:var(--page-bg)"><p style="font-weight:800;margin-bottom:.75rem;color:var(--c-brand)">Ocean coach panel</p><div class="coach-panel"><p class="eyebrow">AI coach</p><h2 style="font-size:1rem">Next actions</h2><div class="flash-row"><span class="flash-chip fc-sky">CAT</span><span class="flash-chip fc-mint">Pharm</span></div></div></div>
<div data-palette="blossom" style="padding:1rem;border-radius:1rem;background:var(--page-bg)"><p style="font-weight:800;margin-bottom:.75rem;color:var(--c-brand)">Blossom coach panel</p><div class="coach-panel"><p class="eyebrow">AI coach</p><h2 style="font-size:1rem">Next actions</h2><div class="flash-row"><span class="flash-chip fc-pink">CAT</span><span class="flash-chip fc-mint">Fundamentals</span><span class="flash-chip fc-lilac">Labs</span></div></div></div>
</div></body></html>` },
  { name: "12-app-store-hero-composite.html", html: `${head("App store", "blossom")}<body class="nn-surface nn-leaf-radial" data-palette="blossom">${leafLayers}
<section style="padding:3rem 1.5rem;background:var(--band-1);min-height:640px">
<div style="max-width:72rem;margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:2rem;align-items:center">
<div><p class="eyebrow" style="color:var(--c-butter)">App Store preview</p>
<h1 style="color:#fff;font-size:2.25rem">Adaptive NCLEX coaching</h1>
<p style="color:#f0e8f4;margin:1rem 0 1.25rem">Full device frame · rich dashboard · unmistakable Blossom orchestration.</p></div>
<div class="mock-device" style="transform:perspective(800px) rotateY(-4deg)">${dashboardMain("blossom").includes("app-shell") ? "" : ""}</div>
</div></section></body></html>` },
];

// Fix file 12 - embed simplified app preview
files[11].html = `${head("App store composite", "blossom")}<body data-palette="blossom" class="nn-surface nn-leaf-radial">${leafLayers}
<section style="padding:2.5rem 1.5rem;background:var(--band-1);min-height:700px">
<div style="max-width:72rem;margin:0 auto;display:grid;grid-template-columns:.9fr 1.1fr;gap:2rem;align-items:center">
<div><p class="eyebrow" style="color:var(--c-butter)">Screenshot-ready</p>
<h1 style="color:#fff;font-size:2.1rem">Premium adaptive coaching</h1>
<p style="color:#f0e8f4;margin:1rem 0">Pink · mint · teal · lilac · butter · sage — orchestrated.</p>
<a class="btn btn-primary" href="#">Download</a></div>
<div class="mock-device"><div class="app-shell" style="min-height:480px;grid-template-columns:56px 1fr">
<aside class="sidebar" style="padding:.5rem"><div class="logo" style="font-size:.65rem">NN</div></aside>
<main class="app-main" style="padding:.75rem">${kpiRow().replace('grid-4','div style="display:grid;grid-template-columns:1fr 1fr;gap:.35rem"').replace('</div>\n  </div>', '</div></div>')}
<div class="coach-panel" style="margin-top:.5rem;padding:.75rem"><p style="font-size:.65rem;font-weight:700;color:var(--c-brand)">COACH</p></div>
</main></div></div>
</div></section></body></html>`;

// Fix file 08 - broken kpi extract
files[7].html = `${head("Flashcards blossom", "blossom")}<body data-palette="blossom" class="nn-surface">${leafLayers}
<div class="app-shell"><aside class="sidebar"><div class="logo">NurseNest</div><a class="side-link on">Flashcards</a><a class="side-link">Dashboard</a></aside>
<main class="app-main" style="background:var(--band-3)">
<p class="eyebrow">Flashcard session · Blossom</p>
<div class="hue-card c1" style="max-width:40rem;margin:1rem auto;padding:2rem;min-height:200px">
<p class="tag">Pharmacology</p><h2 style="margin:.5rem 0 1rem;font-size:1.2rem">Signs of digoxin toxicity?</h2>
<div class="flash-row"><span class="flash-chip fc-pink">Hypokalemia</span><span class="flash-chip fc-mint">Elevated BUN</span><span class="flash-chip fc-lilac">Hyponatremia</span><span class="flash-chip fc-butter">Hypercalcemia</span></div>
</div>
<div style="max-width:40rem;margin:0 auto" class="grid-4" style="grid-template-columns:repeat(4,1fr)">
<div class="hue-card c1" style="padding:.75rem"><p class="tag">Due</p><p class="val" style="font-size:1.1rem">24</p></div>
<div class="hue-card c2" style="padding:.75rem"><p class="tag">Streak</p><p class="val" style="font-size:1.1rem">9d</p></div>
<div class="hue-card c3" style="padding:.75rem"><p class="tag">Acc</p><p class="val" style="font-size:1.1rem">82%</p></div>
<div class="hue-card c4" style="padding:.75rem"><p class="tag">Left</p><p class="val" style="font-size:1.1rem">12</p></div>
</div>
</main></div></body></html>`;

files[10].html = `${head("Theme compare", "ocean")}<body style="padding:1.5rem;background:#dde4ea">
<p style="font-weight:800;text-align:center;margin-bottom:1.25rem;font-size:1.1rem">Ocean vs Blossom — multi-tone at first glance</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;max-width:1200px;margin:0 auto">
<div style="border-radius:1rem;overflow:hidden;box-shadow:0 12px 40px -16px rgba(0,0,0,.15)">${dashboardInner("ocean")}</div>
<div style="border-radius:1rem;overflow:hidden;box-shadow:0 12px 40px -16px rgba(0,0,0,.15)">${dashboardInner("blossom")}</div>
</div></body></html>`;

await mkdir(out, { recursive: true });
for (const f of files) {
  await writeFile(path.join(out, f.name), f.html, "utf8");
}
console.log("wrote", files.length, "files");
