import { headers } from "next/headers";

export async function resolveLearnerRequestPathname(): Promise<string> {
  return (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
}
