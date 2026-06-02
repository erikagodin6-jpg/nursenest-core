/**
 * Write one line to **stderr** without `console.error`.
 *
 * Next.js 16+ Dev Tools patches `console.error` in the browser; every call (including
 * RSC-replayed server logs) is counted in the bottom-left "N Issues" indicator. Use this
 * for operational / diagnostic lines that are not application failures.
 */
export function emitServerStderrLine(line: string): void {
  const text = line.endsWith("\n") ? line : `${line}\n`;
  try {
    if (typeof process !== "undefined" && typeof process.stderr?.write === "function") {
      process.stderr.write(text);
      return;
    }
  } catch {
    /* ignore */
  }
  try {
    // Rare (Edge / no TTY): avoid console.error so dev overlay does not treat as an "issue"
    console.warn(line.trimEnd());
  } catch {
    /* ignore */
  }
}
