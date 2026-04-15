export function getE2eBaseURL(): string {
  return process.env.BASE_URL ?? "http://127.0.0.1:3000";
}
