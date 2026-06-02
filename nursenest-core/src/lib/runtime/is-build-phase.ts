export function isBuildPhase(): boolean {
  const phase = process.env["NEXT_PHASE"];
  return Boolean(phase && !phase.endsWith("server"));
}
