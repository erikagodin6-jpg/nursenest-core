import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildAuthorityTopic,
  buildDailyAuthorityPublishingPlan,
  type AuthorityLane,
  type AuthorityTopic,
} from "./authority-publishing-types.mjs";

const OUT_DIR = join(process.cwd(), "src/content/blog-static-longtail");

const LINKS = {
  ecg: [
    { label: "ECG Interpretation", href: "/ecg-interpretation" },
    { label: "Advanced ECG", href: "/advanced-ecg-nursing" },
    { label: "Practice Tests", href: "/app/practice-tests" },
  ],
  cnple: [
    { label: "CNPLE Simulation", href: "/canada/np/cnple/simulation" },
    { label: "NP Questions", href: "/canada/np/cnple/questions" },
  ],
  rexpn: [
    { label: "REx-PN Questions", href: "/canada/rpn/rex-pn/questions" },
    { label: "Practice Tests", href: "/app/practice-tests" },
  ],
  nclex: [
    { label: "NCLEX Questions", href: "/us/rn/nclex-rn/questions" },
    { label: "CAT Exams", href: "/us/rn/nclex-rn/cat" },
  ],
  rt: [
    { label: "RT Lessons", href: "/us/allied-health/rt/lessons" },
    { label: "ABG Practice", href: "/app/practice-tests" },
  ],
  pathophysiology: [
    { label: "Lessons", href: "/app/lessons" },
    { label: "Flashcards", href: "/app/flashcards" },
  ],
} as const;

function topic(lane: AuthorityLane, title: string): AuthorityTopic {
  return buildAuthorityTopic({
    lane,
    title,
    category: lane.toUpperCase(),
    tags: [lane, "nursing", "clinical reasoning"],
    internalLinks: [...LINKS[lane]],
    clinicalFocus: `${title} clinical reasoning and exam preparation`,
    learnerIntent: `Learn ${title} for exams and bedside practice`,
  });
}

const lanes: Record<AuthorityLane, AuthorityTopic[]> = {
  ecg: [
    topic("ecg", "Mobitz I vs Mobitz II Explained for Nurses"),
    topic("ecg", "Hyperkalemia ECG Changes Explained"),
    topic("ecg", "Atrial Flutter vs Atrial Fibrillation"),
  ],
  cnple: [
    topic("cnple", "Best Way to Study for the CNPLE"),
    topic("cnple", "CNPLE LOFT Simulation Explained"),
  ],
  rexpn: [
    topic("rexpn", "Best Way to Study for the REx-PN"),
  ],
  nclex: [
    topic("nclex", "NCLEX Prioritization Strategy"),
  ],
  rt: [
    topic("rt", "How to Interpret an ABG Step by Step"),
  ],
  pathophysiology: [
    topic("pathophysiology", "What Causes Peaked T Waves"),
  ],
};

const plan = buildDailyAuthorityPublishingPlan({
  startDate: "2026-05-17",
  days: 365,
  lanes,
});

mkdirSync(OUT_DIR, { recursive: true });

for (const day of plan) {
  for (const post of day.topics) {
    const internalLinks = post.internalLinks
      .map((l) => `- <a href="${l.href}">${l.label}</a>`)
      .join("\n");

    const md = `---
slug: ${post.slug}
title: "${post.title}"
excerpt: "${post.seoDescription}"
category: "${post.category}"
publishedAt: ${day.date}
updatedAt: ${day.date}
seoTitle: "${post.seoTitle}"
seoDescription: "${post.seoDescription}"
tags: "${post.tags.join(",")}" 
---

# ${post.title}

${post.clinicalFocus}.

## Key Concepts

- Mechanism
- Clinical interpretation
- Exam relevance
- Nursing priorities
- Differential diagnosis

## Related NurseNest Resources

${internalLinks}

## Clinical Reasoning

${post.learnerIntent}.
`;

    writeFileSync(join(OUT_DIR, `${post.slug}.md`), md, "utf8");
  }
}

console.log(`Generated ${plan.length} days of scheduled authority content.`);
