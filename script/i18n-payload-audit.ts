#!/usr/bin/env npx tsx
/**
 * Translation payload size & hygiene report (run after `npm run i18n:compile`).
 *
 * - Per-file size (client merged + Next shards)
 * - Longest string values (candidates to move to content system)
 * - Exact duplicate values (merge to one key + references)
 * - Prefix weight (where bytes concentrate)
 * - gzip/deflate size estimates for wire transfer
 *
 * Output: tools/i18n/reports/i18n-payload-audit.json
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { gzipSync } from "zlib";
import path from "path";
import {
  I18N_CONTENT_HEAVY_PREFIXES,
  I18N_PAYLOAD_LONG_VALUE_CHARS,
} from "../shared/i18n-payload-policy";
import { REPO_ROOT } from "./repo-root";

const REPORT_DIR = path.join(REPO_ROOT, "tools/i18n/reports");
const CLIENT_EN = path.join(REPO_ROOT, "client/public/i18n/en.json");
const NEXT_EN_DIR = path.join(REPO_ROOT, "nursenest-core/public/i18n/en");

function loadJson(p: string): Record<string, string> | null {
  if (!existsSync(p)) return null;
  try {
    const o = JSON.parse(readFileSync(p, "utf8"));
    if (o && typeof o === "object" && !Array.isArray(o)) return o as Record<string, string>;
  } catch {
    return null;
  }
  return null;
}

function firstSegment(k: string): string {
  const i = k.indexOf(".");
  return i === -1 ? k : k.slice(0, i);
}

function main(): void {
  mkdirSync(REPORT_DIR, { recursive: true });

  const merged = loadJson(CLIENT_EN);
  if (!merged) {
    console.error("[i18n-payload-audit] Missing", CLIENT_EN);
    process.exit(1);
  }

  const raw = JSON.stringify(merged);
  const buf = Buffer.from(raw, "utf8");
  const gz = gzipSync(buf, { level: 9 });

  const entries = Object.entries(merged).map(([key, value]) => ({
    key,
    len: value.length,
    value,
  }));
  entries.sort((a, b) => b.len - a.len);

  const long = entries.filter((e) => e.len >= I18N_PAYLOAD_LONG_VALUE_CHARS);
  const byPrefixBytes = new Map<string, number>();
  const byPrefixKeys = new Map<string, number>();
  for (const [k, v] of Object.entries(merged)) {
    const seg = firstSegment(k);
    byPrefixBytes.set(seg, (byPrefixBytes.get(seg) ?? 0) + k.length + v.length + 8);
    byPrefixKeys.set(seg, (byPrefixKeys.get(seg) ?? 0) + 1);
  }

  const prefixRows = [...byPrefixBytes.entries()]
    .map(([prefix, approxBytes]) => ({
      prefix,
      keys: byPrefixKeys.get(prefix) ?? 0,
      approxBytes,
    }))
    .sort((a, b) => b.approxBytes - a.approxBytes);

  const valueToKeys = new Map<string, string[]>();
  for (const [k, v] of Object.entries(merged)) {
    const list = valueToKeys.get(v);
    if (list) list.push(k);
    else valueToKeys.set(v, [k]);
  }
  const duplicates = [...valueToKeys.entries()]
    .filter(([, keys]) => keys.length > 1)
    .map(([value, keys]) => ({
      valuePreview: value.length > 120 ? `${value.slice(0, 117)}…` : value,
      valueChars: value.length,
      keyCount: keys.length,
      keys: keys.sort(),
      /** Approximate bytes saved if one canonical key + aliases (upper bound). */
      approxRedundantBytes: value.length * (keys.length - 1),
    }))
    .sort((a, b) => b.approxRedundantBytes - a.approxRedundantBytes)
    .slice(0, 80);

  const contentHeavy: Record<string, { keys: number; totalValueChars: number }> = {};
  for (const prefix of I18N_CONTENT_HEAVY_PREFIXES) {
    let keys = 0;
    let chars = 0;
    for (const [k, v] of Object.entries(merged)) {
      if (k.startsWith(prefix)) {
        keys += 1;
        chars += v.length;
      }
    }
    contentHeavy[prefix] = { keys, totalValueChars: chars };
  }

  const nextShardSizes: { name: string; bytes: number; keys: number }[] = [];
  if (existsSync(NEXT_EN_DIR)) {
    for (const name of readdirSync(NEXT_EN_DIR)) {
      if (!name.endsWith(".json")) continue;
      const fp = path.join(NEXT_EN_DIR, name);
      const st = statSync(fp);
      const part = loadJson(fp);
      nextShardSizes.push({
        name: name.replace(/\.json$/, ""),
        bytes: st.size,
        keys: part ? Object.keys(part).length : 0,
      });
    }
    nextShardSizes.sort((a, b) => b.bytes - a.bytes);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    clientMergedEn: {
      path: path.relative(REPO_ROOT, CLIENT_EN),
      keyCount: Object.keys(merged).length,
      jsonBytesUtf8: buf.length,
      gzipBytes: gz.length,
      longValueCount: long.length,
      longValueThresholdChars: I18N_PAYLOAD_LONG_VALUE_CHARS,
    },
    topLongKeys: entries.slice(0, 60).map((e) => ({
      key: e.key,
      chars: e.len,
      preview: e.value.length > 160 ? `${e.value.slice(0, 157)}…` : e.value,
    })),
    prefixWeight: prefixRows.slice(0, 25),
    duplicateValues: duplicates,
    contentHeavyPrefixes: contentHeavy,
    nextShardsEn: nextShardSizes,
  };

  const outPath = path.join(REPORT_DIR, "i18n-payload-audit.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`[i18n-payload-audit] ${report.clientMergedEn.keyCount} keys, ${report.clientMergedEn.jsonBytesUtf8} bytes JSON, ${report.clientMergedEn.gzipBytes} bytes gzip`);
  console.log(`[i18n-payload-audit] ${report.clientMergedEn.longValueCount} values ≥ ${I18N_PAYLOAD_LONG_VALUE_CHARS} chars`);
  console.log(`[i18n-payload-audit] ${duplicates.length} duplicate value groups (top 80 by redundant bytes)`);
  console.log(`[i18n-payload-audit] report → ${path.relative(REPO_ROOT, outPath)}`);
}

main();
