/** UK ACP static long-tail generator — shared topic shape (no runtime deps). */
export type UkAcpTopic = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** Rich seed-specific copy (anchors); extras may reuse shorter blocks */
  clinicalAngle: string;
  differentialAngle: string;
  diagnosticsAngle: string;
  managementAngle: string;
  escalationAngle: string;
  documentationAngle: string;
  mdtAngle: string;
  examTrapsAngle: string;
};
