export type CasperVideoResponseRecord = {
  id: string;
  sessionId: string;
  stationId: string;
  mimeType: string;
  createdAtIso: string;
  blobUrl: string;
};

const inMemoryVideoResponses = new Map<string, CasperVideoResponseRecord>();

export async function saveCasperVideoResponse(input: {
  sessionId: string;
  stationId: string;
  blob: Blob;
}): Promise<CasperVideoResponseRecord> {
  const id = `casper_video_${Date.now()}`;

  const record: CasperVideoResponseRecord = {
    id,
    sessionId: input.sessionId,
    stationId: input.stationId,
    mimeType: input.blob.type,
    createdAtIso: new Date().toISOString(),
    blobUrl: URL.createObjectURL(input.blob),
  };

  inMemoryVideoResponses.set(id, record);

  return record;
}

export async function listCasperVideoResponsesForSession(
  sessionId: string,
): Promise<CasperVideoResponseRecord[]> {
  return Array.from(inMemoryVideoResponses.values()).filter(
    (record) => record.sessionId === sessionId,
  );
}

export async function getCasperVideoResponse(
  id: string,
): Promise<CasperVideoResponseRecord | null> {
  return inMemoryVideoResponses.get(id) ?? null;
}
