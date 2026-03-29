import fs from "fs";
import path from "path";

let fileStream: fs.WriteStream | null = null;
const LOG_TIMEZONE = "America/Toronto";
const TZ_PARTS = new Intl.DateTimeFormat("sv-SE", {
  timeZone: LOG_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const TZ_OFFSET = new Intl.DateTimeFormat("en-US", {
  timeZone: LOG_TIMEZONE,
  timeZoneName: "longOffset",
});

function getTorontoIsoTimestamp(date = new Date()): string {
  const parts = TZ_PARTS.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  const tzName =
    TZ_OFFSET.formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? "GMT-00:00";
  const offset = tzName.replace("GMT", "");
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}${offset}`;
}

/**
 * Optional second sink for structured JSON logs (one line per object).
 * - LOG_FILE_PATH: append JSON lines (rotation = external logrotate / platform).
 * - LOG_INGEST_URL + LOG_INGEST_ENABLED=true: fire-and-forget POST per line (generic HTTP ingest).
 */
export function initOptionalLogSinks(): void {
  const fp = process.env.LOG_FILE_PATH?.trim();
  if (fp) {
    try {
      fs.mkdirSync(path.dirname(fp), { recursive: true });
    } catch {
      /* file may be in cwd */
    }
    fileStream = fs.createWriteStream(fp, { flags: "a" });
    console.log(`[LogSink] Writing structured JSON lines to ${fp}`);
  }
}

export function emitStructuredLog(
  payload: Record<string, unknown>,
  stream: "log" | "warn" | "error" | "info" = "log",
): void {
  const enriched = {
    ...payload,
    timestampUtc: new Date().toISOString(),
    timestampToronto: getTorontoIsoTimestamp(),
    timezone: LOG_TIMEZONE,
  };
  const line = JSON.stringify(enriched);
  if (stream === "error") console.error(line);
  else if (stream === "warn") console.warn(line);
  else console.log(line);

  if (fileStream) {
    try {
      fileStream.write(`${line}\n`);
    } catch (e) {
      console.error("[LogSink] File write failed:", e instanceof Error ? e.message : e);
    }
  }

  const ingest = process.env.LOG_INGEST_URL?.trim();
  if (ingest && String(process.env.LOG_INGEST_ENABLED || "").toLowerCase() === "true") {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(process.env.LOG_INGEST_TOKEN
        ? { Authorization: `Bearer ${process.env.LOG_INGEST_TOKEN}` }
        : {}),
    };
    void fetch(ingest, {
      method: "POST",
      headers,
      body: line,
    }).catch(() => {});
  }
}
