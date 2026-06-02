#!/usr/bin/env npx tsx
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseDotenv } from "dotenv";

type EnvKey = "DATABASE_URL" | "DIRECT_URL" | "DATABASE_DIRECT_URL";

type UrlFacts = {
  present: boolean;
  parseOk: boolean;
  protocol: string | null;
  hostname: string | null;
  port: string | null;
  database: string | null;
  usernameLength: number;
  passwordLength: number;
  searchKeys: string[];
  issues: string[];
};

type EnvFileFacts = {
  path: string;
  exists: boolean;
  keys: Record<EnvKey, UrlFacts>;
};

const packageRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const envFiles = [
  resolve(packageRoot, ".env.local"),
  resolve(packageRoot, ".env.playwright.local"),
  resolve(packageRoot, ".env"),
];

function charIssues(raw: string): string[] {
  const issues: string[] = [];
  const weird = [...raw]
    .map((ch, index) => ({ index, code: ch.charCodeAt(0) }))
    .filter((row) => row.code < 32 || row.code > 126);
  if (weird.length > 0) {
    issues.push(
      `contains_non_ascii_or_control_chars:${weird
        .slice(0, 8)
        .map((row) => `${row.index}:U+${row.code.toString(16).padStart(4, "0")}`)
        .join(",")}`,
    );
  }
  if (raw !== raw.trim()) issues.push("leading_or_trailing_whitespace");
  if (raw.includes("\r")) issues.push("contains_cr");
  if (raw.includes("\n")) issues.push("contains_lf");
  return issues;
}

function authorityPortIssue(raw: string): string | null {
  const withoutQuery = raw.trim().split("?")[0] ?? "";
  const scheme = withoutQuery.match(/^postgres(?:ql)?:\/\//i);
  if (!scheme) return "not_postgres_scheme";
  const rest = withoutQuery.slice(scheme[0].length);
  const slash = rest.indexOf("/");
  if (slash < 0) return "missing_database_path";
  const authority = rest.slice(0, slash);
  const hostPort = authority.includes("@")
    ? authority.slice(authority.lastIndexOf("@") + 1)
    : authority;
  if (!hostPort) return "missing_host";
  const colon = hostPort.lastIndexOf(":");
  if (colon < 0) return null;
  const maybePort = hostPort.slice(colon + 1);
  if (!maybePort) return "port_empty_after_colon";
  if (!/^\d+$/.test(maybePort)) return `port_non_numeric:${maybePort.replace(/[A-Za-z0-9]/g, "x").slice(0, 32)}`;
  const n = Number(maybePort);
  if (!Number.isInteger(n) || n < 1 || n > 65535) return `port_out_of_range:${maybePort}`;
  return null;
}

function parseUrlFacts(raw: string | undefined): UrlFacts {
  if (!raw) {
    return {
      present: false,
      parseOk: false,
      protocol: null,
      hostname: null,
      port: null,
      database: null,
      usernameLength: 0,
      passwordLength: 0,
      searchKeys: [],
      issues: ["missing"],
    };
  }

  const issues = charIssues(raw);
  const portIssue = authorityPortIssue(raw);
  if (portIssue) issues.push(portIssue);

  try {
    const url = new URL(raw.trim());
    const database = decodeURIComponent(url.pathname.replace(/^\//, "").split("/")[0] ?? "");
    if (!url.hostname) issues.push("missing_hostname");
    if (!database) issues.push("missing_database_name");
    return {
      present: true,
      parseOk: true,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || "(default)",
      database: database || null,
      usernameLength: url.username.length,
      passwordLength: url.password.length,
      searchKeys: [...url.searchParams.keys()],
      issues,
    };
  } catch (error) {
    return {
      present: true,
      parseOk: false,
      protocol: null,
      hostname: null,
      port: null,
      database: null,
      usernameLength: 0,
      passwordLength: 0,
      searchKeys: [],
      issues: [...issues, error instanceof Error ? error.message : "url_parse_failed"],
    };
  }
}

function readEnvFileFacts(path: string): EnvFileFacts {
  const empty = {
    DATABASE_URL: parseUrlFacts(undefined),
    DIRECT_URL: parseUrlFacts(undefined),
    DATABASE_DIRECT_URL: parseUrlFacts(undefined),
  };
  if (!existsSync(path)) return { path, exists: false, keys: empty };
  const parsed = parseDotenv(readFileSync(path, "utf8"));
  return {
    path,
    exists: true,
    keys: {
      DATABASE_URL: parseUrlFacts(parsed.DATABASE_URL),
      DIRECT_URL: parseUrlFacts(parsed.DIRECT_URL),
      DATABASE_DIRECT_URL: parseUrlFacts(parsed.DATABASE_DIRECT_URL),
    },
  };
}

function inferLoadedSource(key: EnvKey, facts: EnvFileFacts[]): string {
  if (process.env[key]?.trim()) {
    const first = facts.find((file) => file.keys[key].present);
    return first ? first.path : "process.env shell/runtime";
  }
  if (key === "DIRECT_URL" && process.env.DATABASE_DIRECT_URL?.trim()) {
    const first = facts.find((file) => file.keys.DATABASE_DIRECT_URL.present);
    return first ? `${first.path} (DATABASE_DIRECT_URL)` : "process.env DATABASE_DIRECT_URL";
  }
  return "unset";
}

function publicFacts(facts: UrlFacts) {
  return {
    present: facts.present,
    parseOk: facts.parseOk,
    protocol: facts.protocol,
    hostname: facts.hostname,
    port: facts.port,
    database: facts.database,
    usernameLength: facts.usernameLength,
    passwordLength: facts.passwordLength,
    searchKeys: facts.searchKeys,
    issues: facts.issues,
  };
}

async function main() {
  await import("./load-dotenv-for-cli.mts");
  await import("../src/lib/db/env-bootstrap");

  const envFileFacts = envFiles.map(readEnvFileFacts);
  const effectiveDatabaseUrl = process.env.DATABASE_URL?.trim();
  const effectiveDirectUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_DIRECT_URL?.trim();

  const output = {
    cwd: process.cwd(),
    packageRoot,
    envFiles: envFileFacts.map((file) => ({
      path: file.path,
      exists: file.exists,
      DATABASE_URL: publicFacts(file.keys.DATABASE_URL),
      DIRECT_URL: publicFacts(file.keys.DIRECT_URL),
      DATABASE_DIRECT_URL: publicFacts(file.keys.DATABASE_DIRECT_URL),
    })),
    effective: {
      DATABASE_URL: {
        source: inferLoadedSource("DATABASE_URL", envFileFacts),
        ...publicFacts(parseUrlFacts(effectiveDatabaseUrl)),
      },
      DIRECT_URL: {
        source: inferLoadedSource("DIRECT_URL", envFileFacts),
        ...publicFacts(parseUrlFacts(effectiveDirectUrl)),
      },
    },
    prismaDatasource: {
      provider: "postgresql",
      url: "env(DATABASE_URL)",
      directUrl: "env(DIRECT_URL)",
    },
  };

  console.log(JSON.stringify(output, null, 2));

  if (process.argv.includes("--connect") || process.argv.includes("--write-test")) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("[debug-db-url] prisma_connect=ok");

      if (process.argv.includes("--write-test")) {
        const id = randomUUID();
        await prisma.$executeRaw`
          CREATE TEMP TABLE IF NOT EXISTS nn_db_url_publication_probe (
            id text PRIMARY KEY,
            created_at timestamptz NOT NULL DEFAULT now()
          )
        `;
        await prisma.$executeRaw`
          INSERT INTO nn_db_url_publication_probe (id) VALUES (${id})
        `;
        const rows = await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT id FROM nn_db_url_publication_probe WHERE id = ${id}
        `;
        if (rows[0]?.id !== id) throw new Error("write_test_readback_failed");
        await prisma.$executeRaw`
          DELETE FROM nn_db_url_publication_probe WHERE id = ${id}
        `;
        console.log("[debug-db-url] prisma_write_read_delete=ok");
      }
    } finally {
      await prisma.$disconnect();
    }
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
