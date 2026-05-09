#!/usr/bin/env node
/**
 * Prints the ordered NurseNest ecosystem QA command matrix (does not run tests).
 * @see docs/governance/ecosystem-qa-master-program.md
 */
const rows = [
  ["Ecosystem audit (curated Playwright)", "npm run test:e2e:ecosystem-audit"],
  ["Learner surfaces smoke", "npm run test:e2e:learner-surfaces-smoke"],
  ["Release gate (full)", "npm run qa:release-gate"],
  ["Release gate list", "npm run qa:release-gate:list"],
  ["Mobile E2E", "npm run test:e2e:mobile"],
  ["Tier matrix", "npm run test:e2e:tier-matrix"],
  ["Clinical scenarios", "npm run test:e2e:clinical-scenarios"],
  ["Site-wide audit (remote BASE_URL)", "PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npm run test:e2e:site-wide-audit"],
  ["Visual QA capture", "npm run visual-qa:capture"],
  ["Visual QA critical regression", "npm run visual-qa:critical"],
  ["CI master (paid creds)", "npm run test:e2e:ci-master"],
  ["Typecheck critical", "npm run typecheck:critical"],
];

console.log("NurseNest ecosystem QA matrix — run from nursenest-core/\n");
for (const [label, cmd] of rows) {
  console.log(`• ${label}`);
  console.log(`  ${cmd}\n`);
}
