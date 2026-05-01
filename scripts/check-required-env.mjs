#!/usr/bin/env node

const REQUIRED_VARS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
];

let missingCount = 0;

for (const name of REQUIRED_VARS) {
  const value = process.env[name];
  const status = typeof value === "string" && value.trim().length > 0 ? "set" : "missing";
  if (status === "missing") {
    missingCount += 1;
  }
  console.log(`[env:check] ${name}: ${status}`);
}

if (missingCount === 0) {
  console.log("[env:check] summary: all required variables are set");
} else {
  console.log(`[env:check] summary: ${missingCount} required variable(s) missing`);
  process.exitCode = 1;
}
