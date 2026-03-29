/**
 * Minimal typings for optional / ambient integrations so strict `tsc` passes
 * without changing runtime (packages may be absent in some environments).
 */

declare module "node-fetch" {
  /** Align with global `fetch` / `Response` from `lib.dom` (project already includes `dom`). */
  export default function fetch(input: string | URL, init?: RequestInit): Promise<Response>;
}

declare module "@replit/object-storage" {
  export class Client {
    uploadFromBytes(objectPath: string, data: Buffer): Promise<void>;
  }
}
