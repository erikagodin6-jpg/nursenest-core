import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateSeatUtilization,
  institutionTypeLabel,
  normalizeInstitutionType,
} from "@/lib/institutional/licensing-types";

test("institution type normalization keeps supported business categories stable", () => {
  assert.equal(normalizeInstitutionType("Nursing School"), "nursing_school");
  assert.equal(normalizeInstitutionType("health-system"), "health_system");
  assert.equal(institutionTypeLabel("residency_program"), "Residency Program");
});

test("seat utilization reports purchased, assigned, and available seats without negative availability", () => {
  assert.deepEqual(calculateSeatUtilization(25, 10), {
    seatCap: 25,
    assignedSeats: 10,
    availableSeats: 15,
    utilizationPct: 40,
  });
  assert.deepEqual(calculateSeatUtilization(3, 8), {
    seatCap: 3,
    assignedSeats: 8,
    availableSeats: 0,
    utilizationPct: 266.7,
  });
});
