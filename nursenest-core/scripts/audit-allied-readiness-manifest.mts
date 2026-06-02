import { ALLIED_PROFESSIONS } from "../src/lib/allied/allied-professions-registry";
import { ALLIED_READINESS_MANIFEST, getAlliedReadinessAverage } from "../src/lib/allied/allied-readiness-manifest";

const REQUIRED_DOMAIN_KEYS = [
  "coreCurriculum",
  "dedicatedCatalog",
  "seoCoverage",
  "assessmentReadiness",
  "simulationReadiness",
  "remediationReadiness",
] as const;

const errors: string[] = [];
const warnings: string[] = [];

const professionKeys = new Set(ALLIED_PROFESSIONS.map((profession) => profession.professionKey));
const manifestKeys = new Set<string>();

for (const entry of ALLIED_READINESS_MANIFEST) {
  if (manifestKeys.has(entry.professionKey)) {
    errors.push(`Duplicate readiness entry for ${entry.professionKey}`);
  }
  manifestKeys.add(entry.professionKey);

  if (!professionKeys.has(entry.professionKey)) {
    errors.push(`Readiness entry ${entry.professionKey} does not exist in ALLIED_PROFESSIONS`);
  }

  if (!Number.isInteger(entry.percentComplete) || entry.percentComplete < 0 || entry.percentComplete > 100) {
    errors.push(`Readiness entry ${entry.professionKey} has invalid percentComplete=${entry.percentComplete}`);
  }

  if (entry.status === "complete" && entry.percentComplete < 100) {
    errors.push(`Readiness entry ${entry.professionKey} is marked complete but is below 100%`);
  }

  if (entry.status === "near_complete" && entry.percentComplete < 95) {
    errors.push(`Readiness entry ${entry.professionKey} is near_complete but below 95%`);
  }

  if (entry.status === "mature" && entry.percentComplete < 80) {
    errors.push(`Readiness entry ${entry.professionKey} is mature but below 80%`);
  }

  if (entry.strengths.length < 3) {
    errors.push(`Readiness entry ${entry.professionKey} must list at least 3 strengths`);
  }

  if (entry.remainingGaps.length < 1) {
    errors.push(`Readiness entry ${entry.professionKey} must list at least 1 remaining gap`);
  }

  for (const domainKey of REQUIRED_DOMAIN_KEYS) {
    const value = entry.domains[domainKey];
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      errors.push(`Readiness entry ${entry.professionKey} has invalid ${domainKey}=${value}`);
    }
  }

  if (entry.dedicatedCatalogFile) {
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === entry.professionKey);
    if (profession?.dedicatedCatalogFile && profession.dedicatedCatalogFile !== entry.dedicatedCatalogFile) {
      warnings.push(
        `Readiness entry ${entry.professionKey} expects ${entry.dedicatedCatalogFile}, registry has ${profession.dedicatedCatalogFile}`,
      );
    }
  }
}

for (const profession of ALLIED_PROFESSIONS) {
  if (!manifestKeys.has(profession.professionKey)) {
    warnings.push(`Profession ${profession.professionKey} does not have a readiness manifest entry`);
  }
}

const average = getAlliedReadinessAverage();
const belowNinetyFive = ALLIED_READINESS_MANIFEST.filter((entry) => entry.percentComplete < 95);

console.log(`allied-readiness: entries=${ALLIED_READINESS_MANIFEST.length}`);
console.log(`allied-readiness: average=${average}%`);
console.log(`allied-readiness: below95=${belowNinetyFive.length}`);

if (belowNinetyFive.length > 0) {
  for (const entry of belowNinetyFive) {
    console.log(`allied-readiness: below95 ${entry.professionKey}=${entry.percentComplete}%`);
  }
}

if (warnings.length > 0) {
  console.warn("allied-readiness warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error("allied-readiness errors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("allied-readiness: OK");
