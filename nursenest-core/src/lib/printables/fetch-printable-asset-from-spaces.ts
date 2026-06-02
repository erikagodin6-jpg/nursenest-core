import "server-only";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSpacesBucket } from "@/lib/storage/spaces-config";
import { getSpacesS3Client } from "@/lib/storage/spaces-s3-client";

export type PrintableAssetFetchOk = {
  body: Uint8Array;
  contentType: string;
  contentLength: number | undefined;
};

export type PrintableAssetFetchFn = (storageKey: string) => Promise<PrintableAssetFetchOk | null>;

let fetchOverride: PrintableAssetFetchFn | null = null;

/** Test-only: bypass Spaces while keeping entitlement + DB analytics real. */
export function setPrintableAssetFetchOverrideForTests(fn: PrintableAssetFetchFn | null): void {
  fetchOverride = fn;
}

export async function fetchPrintableAssetBodyFromSpaces(storageKey: string): Promise<PrintableAssetFetchOk | null> {
  if (fetchOverride) return fetchOverride(storageKey);
  const Key = storageKey.replace(/^\/+/, "");
  const client = getSpacesS3Client();
  const Bucket = getSpacesBucket();
  try {
    const out = await client.send(
      new GetObjectCommand({
        Bucket,
        Key,
      }),
    );
    const body = out.Body;
    if (!body) return null;
    const buf = await body.transformToByteArray();
    const contentType =
      typeof out.ContentType === "string" && out.ContentType.trim().length > 0
        ? out.ContentType.trim()
        : "application/octet-stream";
    return {
      body: buf,
      contentType,
      contentLength: typeof out.ContentLength === "number" ? out.ContentLength : buf.byteLength,
    };
  } catch (e: unknown) {
    const name = (e as { name?: string })?.name;
    const status = (e as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
    if (name === "NoSuchKey" || name === "NotFound" || status === 404) return null;
    throw e;
  }
}
