#!/usr/bin/env python3
"""Generate preview-screenshots/prenursing HTML + mirror to reports/ui-redesign-preview/prenursing/."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRE = ROOT / "preview-screenshots" / "prenursing"
REP = ROOT / "reports" / "ui-redesign-preview" / "prenursing"

WIRE = """/**
 * Static HTML previews: bridge [data-theme] for semantic tokens without globals.css.
 */
html[data-theme] {
  --bg-page: var(--theme-page-bg, #ffffff);
  --bg-card: var(--theme-card-bg, #ffffff);
  --bg-elevated: var(--theme-card-bg, #ffffff);
  --bg-section-alt: color-mix(in srgb, var(--theme-primary) 7%, var(--theme-page-bg, #ffffff));
  --border-subtle: color-mix(in srgb, var(--theme-border, #e5e7eb) 70%, var(--theme-page-bg, #ffffff));
  --shadow-card: 0 12px 36px -18px color-mix(in srgb, var(--theme-heading-text, #0f172a) 14%, transparent);
}
"""


def head(title: str, theme: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en" data-theme="{theme}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>{title} — NurseNest pre-nursing preview</title>
  <link rel="stylesheet" href="../../src/app/theme-palettes.css"/>
  <link rel="stylesheet" href="../../src/app/semantic-status-tokens.css"/>
  <link rel="stylesheet" href="./preview-wire.css"/>
  <style>
    body{{margin:0;font-family:system-ui,sans-serif;background:var(--semantic-bg-base);color:var(--semantic-text-primary);min-height:100vh}}
    .wrap{{max-width:72rem;margin:0 auto;padding:1.5rem}}
    h1{{font-size:clamp(1.75rem,3vw,2.25rem);font-weight:600;margin:0 0 .5rem}}
    .muted{{color:var(--semantic-text-muted);max-width:42rem}}
    .grid{{display:grid;gap:1rem;margin-top:1.5rem}}
    @media(min-width:640px){{.grid.cols-2{{grid-template-columns:repeat(2,1fr)}}}}
    @media(min-width:1024px){{.grid.cols-4{{grid-template-columns:repeat(4,1fr)}}}}
    .card{{display:flex;flex-direction:column;min-height:10rem;background:var(--semantic-surface-elevated);
      border:1px solid var(--semantic-border-soft);border-radius:.8125rem;padding:1.25rem;box-shadow:var(--semantic-shadow-soft)}}
    .card h2{{margin:0 0 .35rem;font-size:1.05rem;font-weight:600}}
    .card p{{margin:0;flex:1;color:var(--semantic-text-secondary);font-size:.9rem;line-height:1.45}}
    .cta{{margin-top:auto;padding-top:.75rem;font-weight:600;color:var(--semantic-brand)}}
    .pill{{display:inline-block;padding:.2rem .55rem;border-radius:999px;font-size:.75rem;font-weight:600;
      background:var(--semantic-panel-cool);color:var(--semantic-info-contrast);margin-bottom:.5rem}}
    .bar{{height:.45rem;border-radius:999px;background:var(--semantic-panel-muted);overflow:hidden;margin-top:.75rem}}
    .bar>span{{display:block;height:100%;width:66%;background:var(--semantic-chart-2);border-radius:999px}}
    .opts button{{display:block;width:100%;text-align:left;margin:.35rem 0;padding:.65rem .75rem;border-radius:.5rem;
      border:1px solid var(--semantic-border-soft);background:var(--semantic-surface);color:var(--semantic-text-primary)}}
    .opts button.ac{{border-color:color-mix(in srgb,var(--semantic-brand) 35%,var(--semantic-border-soft));
      background:color-mix(in srgb,var(--semantic-brand) 10%,var(--semantic-surface))}}
    .rationale{{margin-top:1rem;padding:.85rem;border-radius:.5rem;background:var(--semantic-panel-positive);
      color:var(--semantic-text-primary);font-size:.88rem}}
    nav.preview-nav a{{color:var(--semantic-brand);margin-right:1rem}}
  </style>
</head><body><div class="wrap">
"""

FOOT = "</div></body></html>"

PAGES = [
    ("hub.html", "Hub", "aurora"),
    ("teas-prep.html", "TEAS readiness framing", "sage-garden"),
    ("hesi-prep.html", "HESI readiness framing", "ocean"),
    ("anatomy.html", "Anatomy & Physiology module", "aurora"),
    ("chemistry.html", "Chemistry module", "ocean"),
    ("math.html", "Quantitative / science foundations", "sage-garden"),
    ("biology.html", "Biology cluster", "sage-garden"),
    ("quiz-practice.html", "Practice exam", "midnight"),
    ("flashcards.html", "Flashcards", "ocean"),
    ("mobile-hub.html", "Hub (mobile)", "aurora"),
]


def main() -> None:
    PRE.mkdir(parents=True, exist_ok=True)
    (PRE / "preview-wire.css").write_text(WIRE, encoding="utf-8")

    idx = head("Pre-nursing preview index", "ocean") + "<nav class='preview-nav'>" + "".join(
        f"<a href='{fn}'>{title}</a>" for fn, title, _ in PAGES
    ) + "<p class='muted' style='margin-top:1rem'>Static mocks. Canonical URLs: <code>/pre-nursing/*</code>.</p>" + FOOT
    (PRE / "index.html").write_text(idx, encoding="utf-8")

    (PRE / "hub.html").write_text(
        head("Pre-nursing hub", "aurora")
        + """<span class="pill">Aurora</span><h1>Pre-Nursing</h1><p class="muted">Choose how you want to study today.</p>
<div class="grid cols-2 cols-4">
<div class="card"><h2>Lessons</h2><p>Review concepts by topic across 30 modules.</p><div class="cta">Lessons →</div></div>
<div class="card"><h2>Flashcards</h2><p>Strengthen recall quickly.</p><div class="cta">Flashcards →</div></div>
<div class="card"><h2>Practice</h2><p>Drill static bank items when signed in.</p><div class="cta">Practice →</div></div>
<div class="card"><h2>Exams</h2><p>Mini adaptive exam.</p><div class="cta">Mini-CAT →</div></div>
</div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "teas-prep.html").write_text(
        head("TEAS readiness (framing)", "sage-garden")
        + """<span class="pill">No /teas route</span><h1>TEAS-style readiness</h1><p class="muted">Maps to terminology, chemistry, science-foundations, anatomy-physiology.</p>
<div class="grid cols-2"><div class="card"><h2>Reading</h2><p>Study strategies + research reading.</p><div class="cta">Continue</div></div>
<div class="card"><h2>Math-adjacent</h2><p>Science foundations + chemistry.</p><div class="cta">Continue</div></div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "hesi-prep.html").write_text(
        head("HESI readiness (framing)", "ocean")
        + """<span class="pill">No /hesi route</span><h1>HESI-style readiness</h1><p class="muted">A&amp;P, pathophysiology, health assessment, pharmacology emphasis.</p>
<div class="grid cols-2"><div class="card"><h2>Clinical spine</h2><p>Pathophysiology + fluids + infection control.</p><div class="cta">Modules</div></div>
<div class="card"><h2>Safety</h2><p>Ethics/legal + communication.</p><div class="cta">Modules</div></div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "anatomy.html").write_text(
        head("Anatomy & Physiology", "aurora")
        + """<h1>Anatomy &amp; Physiology</h1><p class="muted">Slug <code>anatomy-physiology</code>.</p>
<div class="card" style="max-width:40rem"><h2>Momentum</h2><p>Systems + homeostasis.</p><div class="bar"><span></span></div><div class="cta">Resume</div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "chemistry.html").write_text(
        head("Chemistry", "ocean")
        + """<h1>Chemistry</h1><p class="muted">Slug <code>chemistry</code> — bank-backed practice.</p>
<div class="card" style="max-width:40rem"><h2>Concept check</h2><p>Atomic structure &amp; bonding.</p><div class="cta">Practice</div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "math.html").write_text(
        head("Math & quantitative foundations", "sage-garden")
        + """<span class="pill">science-foundations</span><h1>Math readiness</h1><p class="muted">No <code>math</code> slug in registry.</p>
<div class="card" style="max-width:40rem"><h2>SI units</h2><p>Quantitative skills inside science-foundations.</p><div class="cta">Open</div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "biology.html").write_text(
        head("Biology cluster", "sage-garden")
        + """<h1>Biology cluster</h1><p class="muted"><code>cell-biology</code> + <code>microbiology</code>.</p>
<div class="grid cols-2"><div class="card"><h2>Cell biology</h2><p>Organelles &amp; transport.</p><div class="cta">Lessons</div></div>
<div class="card"><h2>Microbiology</h2><p>Pathogens.</p><div class="cta">Lessons</div></div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "quiz-practice.html").write_text(
        head("Practice / quiz runner", "midnight")
        + """<h1>Practice exam</h1><p class="muted"><code>/pre-nursing/practice/[slug]</code></p>
<div class="card" style="max-width:44rem"><div class="pill">Q3 of 10</div>
<p style="margin:.75rem 0 .5rem;font-weight:600">Which loop restores BP after orthostatic change?</p>
<div class="opts"><button>Positive feedback</button><button class="ac">Negative feedback</button><button>Feed-forward</button><button>Autocrine</button></div>
<div class="rationale"><strong>Rationale.</strong> Negative feedback reverses the initiating change.</div><div class="cta">Next →</div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    (PRE / "flashcards.html").write_text(
        head("Flashcards", "ocean")
        + """<h1>Flashcards</h1><p class="muted"><code>/flashcards</code> marketing; <code>/app/flashcards</code> paid.</p>
<div class="card" style="max-width:28rem"><h2>Deck: Terminology</h2><p>Learn mode.</p><div class="bar"><span style="width:40%;background:var(--semantic-chart-1)"></span></div><div class="cta">Reveal</div></div>"""
        + FOOT,
        encoding="utf-8",
    )

    mob = """<!DOCTYPE html>
<html lang="en" data-theme="aurora">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<title>Pre-nursing hub (mobile)</title>
<link rel="stylesheet" href="../../src/app/theme-palettes.css"/>
<link rel="stylesheet" href="../../src/app/semantic-status-tokens.css"/>
<link rel="stylesheet" href="./preview-wire.css"/>
<style>body{margin:0;font-family:system-ui,sans-serif;background:var(--semantic-bg-base);color:var(--semantic-text-primary)}
.wrap{padding:1rem;max-width:24rem;margin:0 auto}
.card{background:var(--semantic-surface-elevated);border:1px solid var(--semantic-border-soft);border-radius:.75rem;padding:1rem;margin-bottom:.75rem}</style>
</head><body><div class="wrap"><h1 style="font-size:1.35rem;font-weight:600">Pre-Nursing</h1>
<p style="color:var(--semantic-text-muted);font-size:.9rem">Mobile hub preview.</p>
<div class="card"><strong>Lessons</strong></div><div class="card"><strong>Mini-CAT</strong></div></div></body></html>"""
    (PRE / "mobile-hub.html").write_text(mob, encoding="utf-8")

    REP.mkdir(parents=True, exist_ok=True)
    for p in PRE.iterdir():
        if p.is_file():
            shutil.copy2(p, REP / p.name)
    print("ok", len(list(PRE.iterdir())), "files")


if __name__ == "__main__":
    main()
