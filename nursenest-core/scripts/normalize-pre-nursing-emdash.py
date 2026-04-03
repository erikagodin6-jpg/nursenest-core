#!/usr/bin/env python3
"""
Replace em dashes (U+2014) in pre-nursing content with commas, periods, colons,
or parentheses.

Run from inner app root:
  python3 scripts/normalize-pre-nursing-emdash.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src" / "content" / "pre-nursing"
EM = "\u2014"

# Most specific first. Patterns use literal em dash (U+2014).
SUBSTITUTIONS: list[tuple[str, str]] = [
    # Study strategies: parenthetical double em dashes
    (
        f"from memory {EM} testing yourself {EM} is",
        "from memory (testing yourself) is",
    ),
    (
        f"Active recall {EM} forcing yourself to retrieve information from memory without looking at your notes {EM} is",
        "Active recall (forcing yourself to retrieve information from memory without looking at your notes) is",
    ),
    (
        f"mistake is passive review {EM} re-reading notes, highlighting text, and watching lectures without actively testing yourself.",
        "mistake is passive review: re-reading notes, highlighting text, and watching lectures without actively testing yourself.",
    ),
    (
        f"The spacing effect {EM} where memory is stronger when study sessions are distributed over time {EM} is one of the most robust findings in learning science.",
        "The spacing effect, where memory is stronger when study sessions are distributed over time, is one of the most robust findings in learning science.",
    ),
    # SBAR / CUS UI labels
    (f">S {EM} Situation", ">S: Situation"),
    (f">B {EM} Background", ">B: Background"),
    (f">A {EM} Assessment", ">A: Assessment"),
    (f">R {EM} Recommendation", ">R: Recommendation"),
    (f"CUS Framework {EM} Escalating", "CUS Framework: Escalating"),
    (f"<strong>C</strong> {EM} 'I am", "<strong>C</strong>: 'I am"),
    (f"<strong>U</strong> {EM} 'I am", "<strong>U</strong>: 'I am"),
    (f"<strong>S</strong> {EM} 'This is", "<strong>S</strong>: 'This is"),
    (f"(highest level {EM} stops the action)", "(highest level: stops the action)"),
    # Science module (verified)
    (f"cell death {EM} an orderly", "cell death, an orderly"),
    (f"double membrane {EM} the inner", "double membrane; the inner"),
    (f"in reverse {EM} from organism", "in reverse, from organism"),
    (f"lactic acid {EM} this is why", "lactic acid. This is why"),
    (f"uncontrollably {EM} the basis of", "uncontrollably, which is the basis of"),
    (f"homeostasis {EM} in Type 1", "homeostasis. In Type 1"),
    (f"hydrolysis {EM} enzymes add", "hydrolysis: enzymes add"),
    # Study strategies single em dashes
    (f"assessment tools {EM} they are learning", "assessment tools; they are learning"),
    (f"cumulative knowledge {EM} pharmacology", "cumulative knowledge; pharmacology"),
    (f"Changing answers {EM} your first", "Changing answers: your first"),
    (f"into the question {EM} answer based", "into the question: answer based"),
    (f"longest answer {EM} simplicity", "longest answer: simplicity"),
    (f"illusion of learning {EM} you recognize", "illusion of learning: you recognize"),
    (f"clinical reasoning {EM} the ability", "clinical reasoning: the ability"),
    (f"predict outcomes {EM} not recall", "predict outcomes, not recall"),
    (f"what you're solving for {EM} 'What is", "what you are solving for: 'What is"),
    (f"about to forget {EM} each retrieval", "about to forget: each retrieval"),
    (f"actually asking {EM} priority action", "actually asking: priority action"),
    (f"Identify cross-links {EM} these are the insights", "Identify cross-links: these are the insights"),
    (
        f"Nursing knowledge is cumulative {EM} later courses build on earlier material",
        "Nursing knowledge is cumulative: later courses build on earlier material",
    ),
    (
        f"Nursing decisions are rarely absolute {EM} qualifying words",
        "Nursing decisions are rarely absolute; qualifying words",
    ),
    # Cultural competency teach-back
    (f"?' {EM} confirms understanding", "?' This confirms understanding"),
    # Communication safety options
    (f"'This is a safety issue {EM} stop immediately.'", "'This is a safety issue: stop immediately.'"),
]

# After em dashes removed, fix a few comma splices introduced by older tooling.
POST_FIXES: list[tuple[str, str]] = [
    ("lactic acid, this is why", "lactic acid. This is why"),
    ("glucose homeostasis, in Type 1", "glucose homeostasis. In Type 1"),
]


def normalize(text: str) -> str:
    for old, new in SUBSTITUTIONS:
        text = text.replace(old, new)
    text = text.replace(f" {EM} ", ", ")
    text = text.replace(EM, ", ")
    for old, new in POST_FIXES:
        text = text.replace(old, new)
    return text


def main() -> int:
    if not ROOT.is_dir():
        print(f"Missing {ROOT}", file=sys.stderr)
        return 1
    changed = 0
    inner_root = ROOT.parent.parent.parent
    for path in sorted(ROOT.rglob("*")):
        if path.suffix not in {".tsx", ".ts", ".md"}:
            continue
        raw = path.read_text(encoding="utf-8")
        if EM not in raw:
            continue
        new = normalize(raw)
        if new != raw:
            path.write_text(new, encoding="utf-8", newline="\n")
            changed += 1
            print(path.relative_to(inner_root))
    print(f"Updated {changed} files.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
