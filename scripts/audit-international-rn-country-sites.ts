/**
 * Audit UK / Australia / Philippines RN foundation marketing hubs (static checks, no HTTP).
 *
 * Run from `nursenest-core/`: `npm run audit:international-rn`
 *
 * @see nursenest-core/src/lib/international-rn/intl-rn-country-site-matrix.ts
 */
import {
  auditInternationalRnCountrySites,
  formatInternationalRnAuditReport,
} from "../nursenest-core/src/lib/international-rn/intl-rn-country-site-audit.ts";

const result = auditInternationalRnCountrySites();
// eslint-disable-next-line no-console -- CLI audit output
console.log(formatInternationalRnAuditReport(result));
if (result.errors.length > 0) {
  process.exitCode = 1;
}
