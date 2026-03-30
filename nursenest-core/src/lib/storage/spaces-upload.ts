import "server-only";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getSpacesBucket, publicCdnUrlForKey } from "./spaces-config";
import { getSpacesS3Client } from "./spaces-s3-client";
import type { UploadKind } from "./upload-limits";

function prefixForKind(kind: UploadKind): string {
  switch (kind) {
    case "pdf":
      return "uploads/pdfs";
    case "media":
      return "uploads/media";
    case "image":
    default:
      return "uploads/images";
  }
}

export function buildObjectKey(kind: UploadKind, extension: string): string {
  const ext = extension.replace(/^\./, "").toLowerCase().slice(0, 8) || "bin";
  const id = randomUUID();
  return `${prefixForKind(kind)}/${id}.${ext}`;
}

export async function putBufferToSpaces(params: {
  objectKey: string;
  body: Buffer;
  contentType: string;
}): Promise<{ objectKey: string; publicUrl: string }> {
  const client = getSpacesS3Client();
  const Bucket = getSpacesBucket();
  const Key = params.objectKey.replace(/^\/+/, "");

  await client.send(
    new PutObjectCommand({
      Bucket,
      Key,
      Body: params.body,
      ContentType: params.contentType,
      ACL: "public-read",
    }),
  );

  return { objectKey: Key, publicUrl: publicCdnUrlForKey(Key) };
}
