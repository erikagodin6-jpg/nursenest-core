import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  TOPIC_OWNERSHIP_BASELINE,
  buildCertificationOwnershipMap,
  buildOwnershipDashboard,
  buildProfessionOwnershipMap,
  compareCompetitorOwnership,
  prioritizeTopicBuilds,
} from "../src/lib/authority/topic-ownership-engine";

const dashboard = buildOwnershipDashboard();
const professionMap = buildProfessionOwnershipMap();
const certificationMap = buildCertificationOwnershipMap();
const priorities = prioritizeTopicBuilds();
const competitorComparisons = TOPIC_OWNERSHIP_BASELINE.map(compareCompetitorOwnership);

function table(rows: readonly string[][]): string {
  return rows.map((row) => `| ${row.join(" |")} |`).join("\n");
}

const report = `# Topic Ownership & Authority Domination Engine

Generated: ${new Date().toISOString()}

## Implementation Summary

The topic ownership foundation is implemented in \`src/lib/authority/topic-ownership-engine.ts\`.

It supports:

- 0-100 topic ownership scoring.
- Required asset coverage for authority articles, lessons, flashcards, questions, SATA, matrix, bowtie, cases, simulations, skills, labs, pharmacology, care plans, concept maps, clinical reasoning, study guides, career relevance, placement relevance, and certification relevance.
- Profession-specific ownership for RN, RPN, NP, RT, paramedic, OT, PT, MLT, and PSW.
- Certification ownership for NCLEX, REx-PN, CNPLE, FNP, PMHNP, AGPCNP, WHNP, PNP-PC, TEAS, HESI, and CASPER.
- Competitor comparison against UWorld, Archer, Lecturio, Amboss, and Osmosis.
- Gap analysis and revenue-prioritized build recommendations.

## Ownership Dashboard

- Topics tracked: ${dashboard.rows.length}
- Average ownership: ${dashboard.averageOwnership}%
- Fully owned topics: ${dashboard.ownedTopics}
- Strongest topics: ${dashboard.strongestTopics.join(", ")}
- Weakest topics: ${dashboard.weakestTopics.join(", ")}

## Topic Ownership Snapshot

${table([
  ["Topic", "Ownership", "Status", "Strongest Profession", "Weakest Profession"],
  ...dashboard.rows.map((row) => [row.topic, `${row.score}%`, row.status, row.strongestProfession ?? "None", row.weakestProfession ?? "None"]),
])}

## If We Only Build 10 Things This Quarter

${table([
  ["Rank", "Topic", "Priority", "Ownership Gap", "Top Work"],
  ...dashboard.top10QuarterlyBuilds.map((item, index) => [
    String(index + 1),
    item.topic,
    `${item.priorityScore} (${item.buildPriority})`,
    `${item.ownershipGap}%`,
    item.recommendedWork.slice(0, 3).join("; "),
  ]),
])}

## If We Only Build 50 Things This Year

Current tracked backlog contains ${dashboard.top50AnnualBuilds.length} prioritized topic initiatives. As more topics are added, this same ranking model should select the top 50 by traffic potential, revenue potential, conversion potential, and ownership gap.

## Profession Ownership Highlights

- RN strongest: ${professionMap.RN.slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}
- RT strongest: ${professionMap.RT.slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}
- Paramedic strongest: ${professionMap.Paramedic.slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}
- MLT strongest: ${professionMap.MLT.slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}

## Certification Ownership Highlights

- NCLEX strongest: ${certificationMap.NCLEX.slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}
- REx-PN strongest: ${certificationMap["REx-PN"].slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}
- CNPLE strongest: ${certificationMap.CNPLE.slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}
- TEAS strongest: ${certificationMap.TEAS.slice(0, 3).map((item) => `${item.topic} ${item.score}%`).join(", ")}

## Competitor Ownership Signals

${table([
  ["Topic", "NurseNest", "Leader", "Leader Score", "Position", "Opportunity"],
  ...competitorComparisons.map((item) => [
    item.topic,
    `${item.nurseNestScore}%`,
    item.competitorLeader,
    `${item.competitorLeaderScore}%`,
    item.marketPosition,
    item.opportunity,
  ]),
])}

## Next Integration Points

1. Replace baseline scores with live counts from authority pages, lessons, flashcards, questions, simulations, labs, skills, and care plans.
2. Add an admin Topic Ownership dashboard using this scoring layer.
3. Feed priority recommendations into the content factory and SEO command center.
4. Add Search Console traffic and revenue attribution to refine build priority.
5. Expand tracked topics beyond the initial clinical and allied-health set.
`;

const reportPath = path.join(process.cwd(), "docs/reports/topic-ownership-authority-domination-engine.md");
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, report);
console.log(`Wrote ${reportPath}`);

