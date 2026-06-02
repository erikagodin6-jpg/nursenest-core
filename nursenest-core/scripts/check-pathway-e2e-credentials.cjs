/**
 * Pre-flight for `qa:pathways`: require at least one paid QA credential set — generic
 * (`QA_PAID_EMAIL` / `E2E_PAID_*` / `PLAYWRIGHT_TEST_*`) or pathway-specific (`QA_PAID_RN_EMAIL`, …).
 */
const { loadPlaywrightDotenv } = require("./playwright-dotenv-load.cjs");
loadPlaywrightDotenv();

function pairOk(emailVar, passVar) {
  const e = process.env[emailVar]?.trim();
  const p = process.env[passVar];
  return Boolean(e && p !== undefined && String(p).length > 0);
}

const GENERIC_PAIRS = [
  ["QA_PAID_EMAIL", "QA_PAID_PASSWORD"],
  ["E2E_PAID_EMAIL", "E2E_PAID_PASSWORD"],
  ["PLAYWRIGHT_TEST_EMAIL", "PLAYWRIGHT_TEST_PASSWORD"],
];

const PATHWAY_PREFIXES = [
  "QA_PAID_US_RN",
  "QA_PAID_RN",
  "QA_PAID_CA_RPN",
  "QA_PAID_RPN",
  "QA_PAID_US_PN",
  "QA_PAID_PN",
  "QA_PAID_LPN",
  "QA_PAID_NP",
  "QA_PAID_US_NP",
];

let ok = GENERIC_PAIRS.some(([e, p]) => pairOk(e, p));
if (!ok) {
  ok = PATHWAY_PREFIXES.some((prefix) => pairOk(`${prefix}_EMAIL`, `${prefix}_PASSWORD`));
}

if (!ok) {
  console.error(
    "qa:pathways requires QA_PAID_EMAIL+QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*), " +
      "or pathway-specific pairs such as QA_PAID_RN_EMAIL+QA_PAID_RN_PASSWORD — see pathway-content-access-matrix.ts.",
  );
  process.exit(1);
}
