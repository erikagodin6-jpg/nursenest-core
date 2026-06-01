import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const outputDir = new URL("./", import.meta.url);

const html = String.raw`<!doctype html>
<html lang="en" data-theme="blossom">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blossom 2.0 Theme Preview</title>
    <style>
      :root {
        --blossom-primary: #ff5f9e;
        --blossom-secondary: #ff8ab5;
        --blossom-surface: #fff2f6;
        --blossom-accent-blue: #74d0f4;
        --blossom-accent-yellow: #ffd95a;
        --blossom-accent-peach: #ffb56b;
        --heading: #391226;
        --body: #4b3340;
        --muted: #775568;
        --border: color-mix(in srgb, var(--blossom-primary) 14%, #ffffff);
        --shadow: 0 18px 44px -24px rgba(255, 95, 158, 0.26), 0 1px 0 rgba(255, 95, 158, 0.1);
        --progress: linear-gradient(90deg, #ff5f9e 0%, #ffb56b 34%, #ffd95a 66%, #74d0f4 100%);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: var(--body);
        background:
          radial-gradient(780px 360px at 14% 0%, rgba(255, 95, 158, 0.12), transparent 58%),
          radial-gradient(700px 340px at 86% 8%, rgba(116, 208, 244, 0.14), transparent 62%),
          linear-gradient(135deg, #ffffff 0%, #fff2f6 44%, #fff8de 74%, #e6f7ff 100%);
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 22px 40px;
        border-bottom: 1px solid rgba(255, 95, 158, 0.16);
        background: rgba(255, 255, 255, 0.82);
        backdrop-filter: blur(16px);
      }
      .brand { color: var(--blossom-primary); font-size: 24px; font-weight: 800; }
      nav { display: flex; gap: 28px; font-weight: 700; color: var(--heading); }
      .cta {
        border: 1px solid rgba(255, 95, 158, 0.28);
        border-radius: 14px;
        background: var(--blossom-primary);
        color: var(--heading);
        padding: 11px 18px;
        font-weight: 800;
        box-shadow: 0 12px 28px -18px rgba(255, 95, 158, 0.5);
      }
      main { max-width: 1240px; margin: 0 auto; padding: 44px 28px 60px; }
      h1, h2, h3 { color: var(--heading); margin: 0; }
      h1 { max-width: 700px; font-size: clamp(42px, 5vw, 72px); line-height: 0.96; letter-spacing: 0; }
      h2 { font-size: 24px; }
      p { line-height: 1.6; }
      .hero { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 34px; align-items: center; min-height: 360px; }
      .eyebrow { color: #9d174d; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; }
      .panel, .card {
        border: 1px solid var(--border);
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: var(--shadow);
      }
      .panel { padding: 28px; }
      .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 30px; }
      .metric { padding: 22px; }
      .icon {
        width: 48px; height: 48px; border-radius: 50%;
        display: grid; place-items: center; margin-bottom: 18px; font-weight: 900; color: var(--heading);
      }
      .metric:nth-child(1) .icon, .metric:nth-child(1) .bar span { background: var(--blossom-primary); }
      .metric:nth-child(2) .icon, .metric:nth-child(2) .bar span { background: var(--blossom-accent-peach); }
      .metric:nth-child(3) .icon, .metric:nth-child(3) .bar span { background: var(--blossom-accent-yellow); }
      .metric:nth-child(4) .icon, .metric:nth-child(4) .bar span { background: var(--blossom-accent-blue); }
      .metric strong { display: block; color: var(--heading); font-size: 34px; }
      .bar { height: 7px; border-radius: 999px; overflow: hidden; background: #f7dde8; margin-top: 20px; }
      .bar span { display: block; height: 100%; border-radius: inherit; width: var(--value); }
      .sections { display: grid; grid-template-columns: 1.4fr 0.8fr; gap: 22px; margin-top: 22px; }
      .study-list { margin-top: 18px; border: 1px solid rgba(255,95,158,.12); border-radius: 18px; overflow: hidden; background: #fff; }
      .row { display: grid; grid-template-columns: 1fr 180px 92px; gap: 18px; align-items: center; padding: 18px; border-bottom: 1px solid rgba(255,95,158,.1); }
      .row:last-child { border-bottom: 0; }
      .row .bar { margin: 0; }
      .row .bar span { background: var(--progress); }
      .pill { display: inline-flex; border-radius: 999px; background: var(--blossom-surface); color: #9d174d; padding: 6px 10px; font-size: 12px; font-weight: 800; }
      .side-stack { display: grid; gap: 18px; }
      .focus .bar:nth-of-type(1) span { background: var(--blossom-accent-yellow); }
      .focus .bar:nth-of-type(2) span { background: var(--blossom-primary); }
      .focus .bar:nth-of-type(3) span { background: var(--blossom-accent-blue); }
      .learning-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 24px; }
      .learning-card { min-height: 180px; overflow: hidden; }
      .art { height: 76px; background: linear-gradient(135deg, rgba(255,95,158,.18), rgba(255,181,107,.18), rgba(116,208,244,.18)); }
      .learning-card div:last-child { padding: 16px; }
      .learning-card .bar span { background: var(--progress); }
      .report { margin-top: 22px; background: linear-gradient(135deg, rgba(255,95,158,.2), rgba(255,217,90,.18)); }
      .report .bar span { background: var(--progress); }
      @media (max-width: 820px) {
        header { padding: 18px 20px; }
        nav { display: none; }
        main { padding: 28px 18px 40px; }
        .hero, .sections { grid-template-columns: 1fr; }
        .metrics, .learning-grid { grid-template-columns: 1fr 1fr; }
        .row { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="brand">NurseNest</div>
      <nav><span>Dashboard</span><span>Lessons</span><span>Flashcards</span><span>Practice</span><span>CAT</span></nav>
      <button class="cta">Start studying</button>
    </header>
    <main>
      <section class="hero">
        <div>
          <div class="eyebrow">Blossom 2.0</div>
          <h1>Bright clinical learning for steady exam momentum.</h1>
          <p>Mostly white surfaces, cheerful Cherry Blossom accents, and color-rotated progress treatments across learning activity states.</p>
        </div>
        <div class="panel">
          <span class="pill">RN Adult Health</span>
          <h2 style="margin-top: 18px;">Today’s study plan</h2>
          <div class="study-list">
            <div class="row"><strong>Heart Failure</strong><div class="bar"><span style="--value: 75%"></span></div><span>75%</span></div>
            <div class="row"><strong>Practice Questions</strong><div class="bar"><span style="--value: 64%"></span></div><span>32/50</span></div>
            <div class="row"><strong>Pharmacology Flashcards</strong><div class="bar"><span style="--value: 42%"></span></div><span>8/20</span></div>
          </div>
        </div>
      </section>
      <section class="metrics">
        <article class="card metric"><div class="icon">L</div><span>Lessons Completed</span><strong>128</strong><div class="bar"><span style="--value: 72%"></span></div></article>
        <article class="card metric"><div class="icon">Q</div><span>Practice Questions</span><strong>1,482</strong><div class="bar"><span style="--value: 68%"></span></div></article>
        <article class="card metric"><div class="icon">S</div><span>Study Streak</span><strong>12</strong><div class="bar"><span style="--value: 62%"></span></div></article>
        <article class="card metric"><div class="icon">A</div><span>Average Score</span><strong>78%</strong><div class="bar"><span style="--value: 78%"></span></div></article>
      </section>
      <section class="sections">
        <div class="panel">
          <h2>Continue Learning</h2>
          <div class="learning-grid">
            <article class="card learning-card"><div class="art"></div><div><strong>Lesson</strong><p>Cardiac dysrhythmias</p><div class="bar"><span style="--value: 60%"></span></div></div></article>
            <article class="card learning-card"><div class="art"></div><div><strong>Flashcards</strong><p>Pharmacology deck</p><div class="bar"><span style="--value: 40%"></span></div></div></article>
            <article class="card learning-card"><div class="art"></div><div><strong>Practice</strong><p>Respiratory quiz</p><div class="bar"><span style="--value: 52%"></span></div></div></article>
            <article class="card learning-card"><div class="art"></div><div><strong>CAT</strong><p>Readiness check</p><div class="bar"><span style="--value: 71%"></span></div></div></article>
          </div>
        </div>
        <aside class="panel focus">
          <h2>Report Card</h2>
          <p>Pink = excellent, blue = strong, yellow = needs review, peach = in progress.</p>
          <p>Pharmacology 65%</p><div class="bar"><span style="--value:65%"></span></div>
          <p>Cardiovascular 70%</p><div class="bar"><span style="--value:70%"></span></div>
          <p>Respiratory 75%</p><div class="bar"><span style="--value:75%"></span></div>
        </aside>
      </section>
      <section class="panel report">
        <h2>You’re on fire.</h2>
        <p>Achievement and pricing highlight surfaces use warm pastel accents without turning the whole page pink.</p>
        <div class="bar"><span style="--value:88%"></span></div>
      </section>
    </main>
  </body>
</html>`;

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: new URL("after-desktop.png", outputDir).pathname, fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: new URL("after-mobile.png", outputDir).pathname, fullPage: true });

await browser.close();
