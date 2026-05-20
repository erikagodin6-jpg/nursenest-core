import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { getSpacesEndpoint, getSpacesRegion } from "./spaces-config";

let client: S3Client | null = null;

export function getSpacesS3Client(): S3Client {
  if (client) return client;
  const accessKeyId = process.env.SPACES_KEY?.trim();
  const secretAccessKey = process.env.SPACES_SECRET?.trim();
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("SPACES_KEY and SPACES_SECRET are required for S3 operations");
  }
  client = new S3Client({
    region: getSpacesRegion(),
    endpoint: getSpacesEndpoint(),
    forcePathStyle: false,
    credentials: { accessKeyId, secretAccessKey },
  });
  return client;
}
