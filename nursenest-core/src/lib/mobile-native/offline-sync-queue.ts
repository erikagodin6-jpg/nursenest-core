/**
 * Phase 9 — **offline sync queue** interface (no storage driver, no network).
 *
 * Queue items must be **bounded** (no unbounded JSON blobs). Premium lesson bodies belong on the server
 * after entitlement checks — see `offline-foundations.ts`.
 */

export type MobileNativeSyncQueueItemId = string;

export type MobileNativeSyncQueueItemStatus = "pending" | "in_flight" | "failed" | "completed" | "dead_letter";

export type MobileNativeSyncQueueItemBase = {
  readonly id: MobileNativeSyncQueueItemId;
  readonly status: MobileNativeSyncQueueItemStatus;
  readonly createdAtMs: number;
  readonly attemptCount: number;
  readonly lastErrorMessage?: string;
};

/**
 * Implementations may persist to SQLite, MMKV, IndexedDB, etc.
 * Must enforce max queue depth and max payload bytes at enqueue time.
 */
export interface MobileNativeOfflineSyncQueue {
  enqueue(
    item: Omit<MobileNativeSyncQueueItemBase, "status" | "attemptCount"> & {
      readonly status?: "pending";
      readonly attemptCount?: number;
    },
  ): Promise<void>;
  peekPending(limit: number): Promise<readonly MobileNativeSyncQueueItemBase[]>;
  markInFlight(id: MobileNativeSyncQueueItemId): Promise<void>;
  markCompleted(id: MobileNativeSyncQueueItemId): Promise<void>;
  markFailed(id: MobileNativeSyncQueueItemId, message: string, opts?: { readonly deadLetter?: boolean }): Promise<void>;
}
