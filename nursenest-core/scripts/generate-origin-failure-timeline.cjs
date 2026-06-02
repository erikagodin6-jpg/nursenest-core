#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const dir = process.argv[2] || path.join(process.cwd(), "reports", "origin-black-box-recorder");
const output = path.join(dir, "origin-failure-timeline.md");

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function listTimelineFiles() {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".jsonl") && !name.endsWith("-latest.jsonl"))
    .map((name) => path.join(dir, name));
}

function status(value) {
  return value == null ? "n/a" : String(value);
}

const rows = listTimelineFiles()
  .flatMap((file) => readJsonl(file).map((row) => ({ ...row, sourceFile: path.basename(file) })))
  .sort((a, b) => String(a.ts).localeCompare(String(b.ts)));

const lines = [];
lines.push("# Origin Failure Timeline");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");

if (rows.length === 0) {
  lines.push("No black-box recorder JSONL files were found.");
  lines.push("");
  lines.push("Expected location:");
  lines.push("");
  lines.push("```text");
  lines.push(dir);
  lines.push("```");
  lines.push("");
  lines.push("Deploy the recorder, reproduce the crawl failure, then rerun:");
  lines.push("");
  lines.push("```text");
  lines.push("node scripts/generate-origin-failure-timeline.cjs");
  lines.push("```");
} else {
  const first = rows[0];
  const last = rows[rows.length - 1];
  const maxRss = rows.reduce((max, row) => Math.max(max, row.rssMb || 0), 0);
  const maxHeap = rows.reduce((max, row) => Math.max(max, row.heapUsedMb || 0), 0);
  const maxLag = rows.reduce((max, row) => Math.max(max, row.eventLoopLagMaxMs || 0), 0);
  const maxActiveRequests = rows.reduce((max, row) => Math.max(max, row.maxActiveRequests || row.activeRequests || 0), 0);
  const shutdown = rows.filter((row) => /signal|exit|shutdown|child_process_exit/.test(String(row.event)));
  const readinessEvents = rows.filter((row) => /ready|readiness/.test(String(row.event)));

  lines.push("## Summary");
  lines.push("");
  lines.push(`- First event: ${first.ts}`);
  lines.push(`- Last event: ${last.ts}`);
  lines.push(`- Samples/events: ${rows.length}`);
  lines.push(`- Max RSS: ${maxRss} MB`);
  lines.push(`- Max heap used: ${maxHeap} MB`);
  lines.push(`- Max event-loop lag: ${maxLag} ms`);
  lines.push(`- Max active requests: ${maxActiveRequests}`);
  lines.push(`- Shutdown events: ${shutdown.length}`);
  lines.push(`- Readiness events: ${readinessEvents.length}`);
  lines.push("");

  lines.push("## Timeline");
  lines.push("");
  lines.push("| Time | Component | Event | RSS | Heap | CPU % | Lag Max | Active Req | Ready | Watchdog | Child | Source |");
  lines.push("|---|---|---|---:|---:|---:|---:|---:|---|---|---|---|");
  for (const row of rows) {
    lines.push(
      [
        row.ts,
        row.component,
        row.event,
        status(row.rssMb),
        status(row.heapUsedMb),
        status(row.cpuPercent),
        status(row.eventLoopLagMaxMs),
        status(row.activeRequests),
        status(row.readinessState),
        status(row.watchdogState),
        status(row.childProcessState),
        row.sourceFile,
      ]
        .map((cell) => String(cell ?? "n/a").replace(/\|/g, "\\|"))
        .join(" | ")
        .replace(/^/, "| ")
        .replace(/$/, " |"),
    );
  }
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(output, `${lines.join("\n")}\n`);
console.log(output);
