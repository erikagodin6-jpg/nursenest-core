import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import test from "node:test";
import { isTransientDatabaseError, withRetry } from "./with-retry";

test("isTransientDatabaseError recognizes Prisma pool timeout", () => {
  const e = new Prisma.PrismaClientKnownRequestError("pool", {
    code: "P2024",
    clientVersion: "0.0.0",
  });
  assert.equal(isTransientDatabaseError(e), true);
});

test("isTransientDatabaseError rejects unique constraint", () => {
  const e = new Prisma.PrismaClientKnownRequestError("dup", {
    code: "P2002",
    clientVersion: "0.0.0",
  });
  assert.equal(isTransientDatabaseError(e), false);
});

test("withRetry does not retry non-transient errors", async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      withRetry(async () => {
        calls++;
        throw new Prisma.PrismaClientKnownRequestError("dup", {
          code: "P2002",
          clientVersion: "0.0.0",
        });
      }),
    Prisma.PrismaClientKnownRequestError,
  );
  assert.equal(calls, 1);
});

test("withRetry retries transient errors", async () => {
  let calls = 0;
  const result = await withRetry(async () => {
    calls++;
    if (calls < 2) {
      throw new Prisma.PrismaClientKnownRequestError("pool", {
        code: "P2024",
        clientVersion: "0.0.0",
      });
    }
    return "ok";
  });
  assert.equal(result, "ok");
  assert.equal(calls, 2);
});
