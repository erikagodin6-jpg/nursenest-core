import type {
  CasperSessionRecord,
  CasperSessionSummary,
} from "@/lib/casper/casper-session-types";

const inMemoryCasperSessions = new Map<string, CasperSessionRecord>();

export async function saveCasperSession(
  session: CasperSessionRecord,
): Promise<CasperSessionRecord> {
  inMemoryCasperSessions.set(session.id, session);
  return session;
}

export async function getCasperSessionById(
  id: string,
): Promise<CasperSessionRecord | null> {
  return inMemoryCasperSessions.get(id) ?? null;
}

export async function listCasperSessionsForLearner(
  learnerId: string,
): Promise<CasperSessionSummary[]> {
  return Array.from(inMemoryCasperSessions.values())
    .filter((session) => session.learnerId === learnerId)
    .map((session) => ({
      id: session.id,
      mode: session.mode,
      status: session.status,
      startedAtIso: session.startedAtIso,
      overallRating: session.overallRating,
    }))
    .sort((a, b) => {
      return b.startedAtIso.localeCompare(a.startedAtIso);
    });
}

export async function deleteCasperSession(id: string): Promise<void> {
  inMemoryCasperSessions.delete(id);
}
