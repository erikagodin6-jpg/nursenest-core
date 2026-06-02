import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;

const css = `
  :root {
    --semantic-background: #f8fafc;
    --semantic-surface: #ffffff;
    --semantic-surface-secondary: #f1f5f9;
    --semantic-border-soft: #dbe7ef;
    --semantic-text: #102033;
    --semantic-text-muted: #64748b;
    --semantic-primary: #1570ef;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: linear-gradient(180deg, #f8fbff 0%, #f6fafb 100%);
    color: var(--semantic-text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .page {
    min-height: 900px;
    padding: 32px;
  }
  .shell {
    max-width: 1180px;
    margin: 0 auto;
  }
  .eyebrow {
    width: 128px;
    height: 11px;
    border-radius: 999px;
  }
  .hero {
    border: 1px solid var(--semantic-border-soft);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 16px 44px rgba(15, 23, 42, 0.08);
    padding: 28px;
  }
  .grid { display: grid; gap: 18px; }
  .cols-2 { grid-template-columns: minmax(0, 1fr) 320px; }
  .cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .card {
    border: 1px solid var(--semantic-border-soft);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 12px 34px rgba(15, 23, 42, 0.06);
    padding: 20px;
  }
  .stack { display: grid; gap: 14px; }
  .row { display: flex; gap: 12px; align-items: center; }
  .between { display: flex; gap: 16px; align-items: center; justify-content: space-between; }
  .sk {
    display: block;
    border-radius: 12px;
    background:
      linear-gradient(90deg, rgba(226, 232, 240, 0.68) 0%, rgba(241, 245, 249, 0.96) 45%, rgba(226, 232, 240, 0.68) 100%);
    background-size: 220% 100%;
    animation: shimmer 1.45s ease-in-out infinite;
  }
  @keyframes shimmer {
    from { background-position: 180% 0; }
    to { background-position: -80% 0; }
  }
  .mt { margin-top: 20px; }
  .mt-lg { margin-top: 28px; }
  .w-30 { width: 30%; }
  .w-40 { width: 40%; }
  .w-50 { width: 50%; }
  .w-60 { width: 60%; }
  .w-70 { width: 70%; }
  .w-80 { width: 80%; }
  .w-100 { width: 100%; }
  .h-xs { height: 10px; }
  .h-sm { height: 14px; }
  .h-md { height: 22px; }
  .h-lg { height: 38px; }
  .h-xl { height: 72px; }
  .h-panel { height: 190px; }
  .h-chart { height: 260px; }
  .round { border-radius: 999px; }
  @media (max-width: 760px) {
    .page { padding: 18px; min-height: 844px; }
    .cols-2, .cols-3, .cols-4 { grid-template-columns: 1fr; }
    .hero { padding: 20px; border-radius: 20px; }
    .between { align-items: flex-start; flex-direction: column; }
  }
`;

const sections = {
  lessons: `
    <main class="page"><div class="shell">
      <section class="hero stack">
        <span class="sk eyebrow"></span>
        <span class="sk w-50 h-lg"></span>
        <span class="sk w-80 h-sm"></span>
      </section>
      <section class="grid cols-2 mt-lg">
        <div class="stack">
          <div class="card stack">
            <span class="sk w-40 h-md"></span>
            <span class="sk w-100 h-xl"></span>
            <span class="sk w-100 h-xl"></span>
            <span class="sk w-70 h-sm"></span>
          </div>
          <div class="grid cols-3">
            <div class="card stack"><span class="sk h-lg"></span><span class="sk h-sm"></span></div>
            <div class="card stack"><span class="sk h-lg"></span><span class="sk h-sm"></span></div>
            <div class="card stack"><span class="sk h-lg"></span><span class="sk h-sm"></span></div>
          </div>
        </div>
        <aside class="card stack"><span class="sk w-50 h-md"></span><span class="sk h-panel"></span><span class="sk h-lg"></span></aside>
      </section>
    </div></main>`,
  flashcards: `
    <main class="page"><div class="shell">
      <section class="hero stack">
        <span class="sk eyebrow"></span><span class="sk w-50 h-lg"></span><span class="sk w-80 h-sm"></span>
      </section>
      <section class="grid cols-2 mt-lg">
        <div class="card stack">
          <div class="between"><span class="sk w-40 h-md"></span><span class="sk" style="width:130px;height:38px;border-radius:10px"></span></div>
          <div class="grid cols-3">
            <div class="card stack"><span class="sk h-lg"></span><span class="sk w-80 h-sm"></span><span class="sk w-60 h-xs"></span></div>
            <div class="card stack"><span class="sk h-lg"></span><span class="sk w-80 h-sm"></span><span class="sk w-60 h-xs"></span></div>
            <div class="card stack"><span class="sk h-lg"></span><span class="sk w-80 h-sm"></span><span class="sk w-60 h-xs"></span></div>
          </div>
          <div class="grid cols-4">
            <span class="sk h-lg"></span><span class="sk h-lg"></span><span class="sk h-lg"></span><span class="sk h-lg"></span>
          </div>
        </div>
        <aside class="card stack"><span class="sk w-50 h-md"></span><span class="sk h-panel"></span><span class="sk h-lg"></span></aside>
      </section>
    </div></main>`,
  practice: `
    <main class="page"><div class="shell">
      <section class="hero stack"><span class="sk eyebrow"></span><span class="sk w-60 h-lg"></span><span class="sk w-80 h-sm"></span></section>
      <section class="grid cols-2 mt-lg">
        <div class="card stack">
          <div class="grid cols-3">
            <div class="card stack"><span class="sk h-lg"></span><span class="sk w-70 h-sm"></span><span class="sk w-90 h-xs"></span></div>
            <div class="card stack"><span class="sk h-lg"></span><span class="sk w-70 h-sm"></span><span class="sk w-90 h-xs"></span></div>
            <div class="card stack"><span class="sk h-lg"></span><span class="sk w-70 h-sm"></span><span class="sk w-90 h-xs"></span></div>
          </div>
          <span class="sk h-panel"></span>
          <span class="sk h-lg"></span>
        </div>
        <aside class="card stack"><span class="sk w-50 h-md"></span><span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-xl"></span></aside>
      </section>
    </div></main>`,
  cat: `
    <main class="page"><div class="shell">
      <section class="hero stack"><span class="sk eyebrow"></span><span class="sk w-50 h-lg"></span><span class="sk w-80 h-sm"></span></section>
      <section class="grid cols-2 mt-lg">
        <div class="card stack">
          <span class="sk w-100 h-xs round"></span>
          <span class="sk w-70 h-md"></span><span class="sk w-90 h-sm"></span>
          <span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-xl"></span>
        </div>
        <aside class="card stack"><span class="sk w-60 h-md"></span><span class="sk h-panel"></span><span class="sk h-lg"></span></aside>
      </section>
    </div></main>`,
  dashboard: `
    <main class="page"><div class="shell">
      <section class="hero between">
        <div class="stack" style="flex:1"><span class="sk eyebrow"></span><span class="sk w-50 h-lg"></span><span class="sk w-70 h-sm"></span></div>
        <span class="sk" style="width:150px;height:40px;border-radius:10px"></span>
      </section>
      <section class="grid cols-2 mt-lg">
        <div class="card stack">
          <div class="grid cols-3"><span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-xl"></span></div>
          <span class="sk h-chart"></span>
        </div>
        <aside class="card stack"><span class="sk w-50 h-md"></span><span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-xl"></span></aside>
      </section>
    </div></main>`,
  "study-plan": `
    <main class="page"><div class="shell">
      <section class="hero stack"><span class="sk eyebrow"></span><span class="sk w-50 h-lg"></span><span class="sk w-80 h-sm"></span></section>
      <section class="grid cols-2 mt-lg">
        <div class="card stack">
          <div class="between"><span class="sk w-40 h-md"></span><span class="sk" style="width:120px;height:36px;border-radius:10px"></span></div>
          <span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-xl"></span>
        </div>
        <aside class="card stack"><span class="sk w-50 h-md"></span><span class="sk h-xl"></span><span class="sk h-xl"></span><span class="sk h-lg"></span></aside>
      </section>
    </div></main>`,
};

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

for (const [name, body] of Object.entries(sections)) {
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`, {
    waitUntil: "domcontentloaded",
  });
  await page.screenshot({
    path: path.join(outDir, `${name}-loading-skeleton.png`),
    fullPage: false,
  });
}

await browser.close();
