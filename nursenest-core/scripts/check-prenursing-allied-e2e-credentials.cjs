/**
 * Pre-flight for `qa:pathways:prenursing-allied` — generic paid QA or pre-nursing / allied-specific pairs.
 */
const { loadPlaywrightDotenv } = require("./playwright-dotenv-load.cjs");
loadPlaywrightDotenv();

function pairOk(emailVar, passVar) {
  const e = process.env[emailVar]?.trim();
  const p = process.env[passVar];
  return Boolean(e && p !== undefined && String(p).length > 0);
}

const GENERIC = [
  ["QA_PAID_EMAIL", "QA_PAID_PASSWORD"],
  ["E2E_PAID_EMAIL", "E2E_PAID_PASSWORD"],
  ["PLAYWRIGHT_TEST_EMAIL", "PLAYWRIGHT_TEST_PASSWORD"],
];

const PREFIXES = [
  "QA_PRENURSING",
  "QA_PAID_PRE_NURSING",
  "QA_ALLIED_US",
  "QA_ALLIED",
  "QA_PAID_ALLIED",
  "QA_ALLIED_CA",
  "QA_PAID_ALLIED_CA",
];

let ok = GENERIC.some(([e, p]) => pairOk(e, p));
if (!ok) ok = PREFIXES.some((prefix) => pairOk(`${prefix}_EMAIL`, `${prefix}_PASSWORD`));

if (!ok) {
  console.error(
    "qa:pathways:prenursing-allied requires QA_PAID_EMAIL+QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*), " +
      "or pathway-specific pairs (QA_PRENURSING_*, QA_ALLIED_US_*, QA_ALLIED_CA_*, QA_PAID_PRE_NURSING_*, …) — " +
      "see tests/e2e/helpers/pathway-prenursing-allied-matrix.ts. The suite asserts session tier/country per row.",
  );
  process.exit(1);
}
