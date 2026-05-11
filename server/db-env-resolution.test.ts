import { afterEach, describe, expect, it } from "vitest";

import { getDbInfo, hasSeparateProdDb } from "./db";

const ORIGINAL_DATABASE_URL = process.env.DATABASE_URL;
const ORIGINAL_PROD_DATABASE_URL = process.env.PROD_DATABASE_URL;

function restoreEnv() {
  if (ORIGINAL_DATABASE_URL === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = ORIGINAL_DATABASE_URL;
  }

  if (ORIGINAL_PROD_DATABASE_URL === undefined) {
    delete process.env.PROD_DATABASE_URL;
  } else {
    process.env.PROD_DATABASE_URL = ORIGINAL_PROD_DATABASE_URL;
  }
}

afterEach(() => {
  restoreEnv();
});

describe("db env resolution", () => {
  it("reads DATABASE_URL dynamically after module import", () => {
    delete process.env.DATABASE_URL;
    delete process.env.PROD_DATABASE_URL;

    expect(getDbInfo().devUrl).toBe("(not set)");

    process.env.DATABASE_URL =
      "postgresql://devuser:devpass@db.example.com:5432/devdb?sslmode=require";

    expect(getDbInfo().devUrl).toBe(
      "postgresql://***@db.example.com:5432/devdb?sslmode=require",
    );
    expect(hasSeparateProdDb()).toBe(false);
  });

  it("detects PROD_DATABASE_URL changes without re-importing the module", () => {
    process.env.DATABASE_URL =
      "postgresql://devuser:devpass@db.example.com:5432/devdb?sslmode=require";
    delete process.env.PROD_DATABASE_URL;

    expect(hasSeparateProdDb()).toBe(false);

    process.env.PROD_DATABASE_URL =
      "postgresql://produser:prodpass@prod.example.com:5432/proddb?sslmode=require";

    const info = getDbInfo();

    expect(hasSeparateProdDb()).toBe(true);
    expect(info.prodUrl).toBe(
      "postgresql://***@prod.example.com:5432/proddb?sslmode=require",
    );
  });
});
