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

const genericOk = GENERIC.some(([e, p]) => pairOk(e, p));
const pathwayHits = PREFIXES.filter((prefix) => pairOk(`${prefix}_EMAIL`, `${prefix}_PASSWORD`));
let ok = genericOk || pathwayHits.length > 0;

if (!ok) {
  console.error(
    "qa:pathways:prenursing-allied requires QA_PAID_EMAIL+QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*), " +
      "or pathway-specific pairs (QA_PRENURSING_*, QA_ALLIED_US_*, QA_ALLIED_CA_*, QA_PAID_PRE_NURSING_*, …) — " +
      "see tests/e2e/helpers/pathway-prenursing-allied-matrix.ts. The suite asserts session tier/country/profession per row.",
  );
  process.exit(1);
}

if (process.env.PW_PRENURSING_CREDENTIALS_VERBOSE === "1") {
  console.log(
    "[check-prenursing-allied-e2e-credentials]",
    genericOk ? "generic paid pair: yes" : "generic paid pair: no",
    pathwayHits.length > 0 ? `pathway prefixes: ${pathwayHits.join(", ")}` : "pathway prefixes: (none)",
  );
}
