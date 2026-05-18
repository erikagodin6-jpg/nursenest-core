import type { CasperSessionRecord } from "@/lib/casper/casper-session-types";
import type { CasperVideoResponseRecord } from "@/lib/casper/casper-video-storage";

export type CasperStorageProvider = {
  providerKey: string;
  saveSession(session: CasperSessionRecord): Promise<void>;
  getSession(id: string): Promise<CasperSessionRecord | null>;
  saveVideoResponse(
    response: CasperVideoResponseRecord,
  ): Promise<void>;
  listVideoResponses(
    sessionId: string,
  ): Promise<CasperVideoResponseRecord[]>;
};

const inMemorySessions = new Map<string, CasperSessionRecord>();
const inMemoryVideos = new Map<string, CasperVideoResponseRecord>();

export const inMemoryCasperStorageProvider: CasperStorageProvider = {
  providerKey: "in-memory",

  async saveSession(session) {
    inMemorySessions.set(session.id, session);
  },

  async getSession(id) {
    return inMemorySessions.get(id) ?? null;
  },

  async saveVideoResponse(response) {
    inMemoryVideos.set(response.id, response);
  },

  async listVideoResponses(sessionId) {
    return Array.from(inMemoryVideos.values()).filter(
      (response) => response.sessionId === sessionId,
    );
  },
};

export let activeCasperStorageProvider: CasperStorageProvider =
  inMemoryCasperStorageProvider;

export function setCasperStorageProvider(
  provider: CasperStorageProvider,
) {
  activeCasperStorageProvider = provider;
}
