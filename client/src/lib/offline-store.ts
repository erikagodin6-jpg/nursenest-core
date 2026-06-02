const DB_NAME = "nursenest-offline";
const DB_VERSION = 1;

interface OfflineQuestion {
  id: string;
  stem: string;
  options: any[];
  correctAnswer: any;
  rationale: string;
  topic: string;
  bodySystem: string;
  difficulty: number;
  tier: string;
  packId: string;
}

interface OfflineFlashcard {
  id: string;
  front: string;
  back: string;
  rationale?: string;
  tags: string[];
  deckId: string;
  packId: string;
}

interface OfflineProgress {
  id: string;
  questionId: string;
  isCorrect: boolean;
  answeredAt: number;
  synced: boolean;
  packId: string;
}

interface OfflinePack {
  id: string;
  type: "questions" | "flashcards";
  title: string;
  topic: string;
  tier: string;
  itemCount: number;
  downloadedAt: number;
  lastSyncedAt: number | null;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("questions")) {
        const qs = db.createObjectStore("questions", { keyPath: "id" });
        qs.createIndex("packId", "packId", { unique: false });
        qs.createIndex("topic", "topic", { unique: false });
      }
      if (!db.objectStoreNames.contains("flashcards")) {
        const fs = db.createObjectStore("flashcards", { keyPath: "id" });
        fs.createIndex("packId", "packId", { unique: false });
        fs.createIndex("deckId", "deckId", { unique: false });
      }
      if (!db.objectStoreNames.contains("progress")) {
        const ps = db.createObjectStore("progress", { keyPath: "id" });
        ps.createIndex("synced", "synced", { unique: false });
        ps.createIndex("packId", "packId", { unique: false });
      }
      if (!db.objectStoreNames.contains("packs")) {
        db.createObjectStore("packs", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("flashcard_progress")) {
        const fps = db.createObjectStore("flashcard_progress", { keyPath: "id" });
        fps.createIndex("synced", "synced", { unique: false });
      }
    };
  });
}

export async function saveQuestionPack(packId: string, title: string, topic: string, tier: string, questions: OfflineQuestion[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(["questions", "packs"], "readwrite");
  const questionStore = tx.objectStore("questions");
  const packStore = tx.objectStore("packs");

  for (const q of questions) {
    questionStore.put({ ...q, packId });
  }

  const pack: OfflinePack = {
    id: packId,
    type: "questions",
    title,
    topic,
    tier,
    itemCount: questions.length,
    downloadedAt: Date.now(),
    lastSyncedAt: null,
  };
  packStore.put(pack);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveFlashcardPack(packId: string, title: string, topic: string, tier: string, cards: OfflineFlashcard[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(["flashcards", "packs"], "readwrite");
  const cardStore = tx.objectStore("flashcards");
  const packStore = tx.objectStore("packs");

  for (const c of cards) {
    cardStore.put({ ...c, packId });
  }

  const pack: OfflinePack = {
    id: packId,
    type: "flashcards",
    title,
    topic,
    tier,
    itemCount: cards.length,
    downloadedAt: Date.now(),
    lastSyncedAt: null,
  };
  packStore.put(pack);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineQuestions(packId: string): Promise<OfflineQuestion[]> {
  const db = await openDB();
  const tx = db.transaction("questions", "readonly");
  const store = tx.objectStore("questions");
  const index = store.index("packId");
  const request = index.getAll(packId);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineFlashcards(packId: string): Promise<OfflineFlashcard[]> {
  const db = await openDB();
  const tx = db.transaction("flashcards", "readonly");
  const store = tx.objectStore("flashcards");
  const index = store.index("packId");
  const request = index.getAll(packId);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineProgress(questionId: string, isCorrect: boolean, packId: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("progress", "readwrite");
  const store = tx.objectStore("progress");
  store.put({
    id: `${questionId}-${Date.now()}`,
    questionId,
    isCorrect,
    answeredAt: Date.now(),
    synced: false,
    packId,
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUnsyncedProgress(): Promise<OfflineProgress[]> {
  const db = await openDB();
  const tx = db.transaction("progress", "readonly");
  const store = tx.objectStore("progress");
  const index = store.index("synced");
  const request = index.getAll(false);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function markProgressSynced(ids: string[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("progress", "readwrite");
  const store = tx.objectStore("progress");
  for (const id of ids) {
    const request = store.get(id);
    request.onsuccess = () => {
      if (request.result) {
        store.put({ ...request.result, synced: true });
      }
    };
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getDownloadedPacks(): Promise<OfflinePack[]> {
  const db = await openDB();
  const tx = db.transaction("packs", "readonly");
  const store = tx.objectStore("packs");
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePack(packId: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(["questions", "flashcards", "packs", "progress"], "readwrite");

  const questionStore = tx.objectStore("questions");
  const qIndex = questionStore.index("packId");
  const qRequest = qIndex.getAllKeys(packId);
  qRequest.onsuccess = () => {
    for (const key of qRequest.result) questionStore.delete(key);
  };

  const flashcardStore = tx.objectStore("flashcards");
  const fIndex = flashcardStore.index("packId");
  const fRequest = fIndex.getAllKeys(packId);
  fRequest.onsuccess = () => {
    for (const key of fRequest.result) flashcardStore.delete(key);
  };

  const progressStore = tx.objectStore("progress");
  const pIndex = progressStore.index("packId");
  const pRequest = pIndex.getAllKeys(packId);
  pRequest.onsuccess = () => {
    for (const key of pRequest.result) progressStore.delete(key);
  };

  tx.objectStore("packs").delete(packId);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function isOfflineAvailable(): Promise<boolean> {
  try {
    const packs = await getDownloadedPacks();
    return packs.length > 0;
  } catch {
    return false;
  }
}

export async function getOfflineStorageSize(): Promise<number> {
  if (navigator.storage && navigator.storage.estimate) {
    const est = await navigator.storage.estimate();
    return est.usage || 0;
  }
  return 0;
}
