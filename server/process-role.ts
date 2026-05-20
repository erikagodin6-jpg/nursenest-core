export type ProcessRole = "web" | "worker";

const VALID_ROLES: ProcessRole[] = ["web", "worker"];

export function getProcessRole(): ProcessRole {
  const role = process.env.PROCESS_ROLE;

  if (VALID_ROLES.includes(role as ProcessRole)) {
    return role as ProcessRole;
  }

  return "web";
}

export function isWebProcess(): boolean {
  return getProcessRole() === "web";
}

export function isWorkerProcess(): boolean {
  return getProcessRole() === "worker";
}