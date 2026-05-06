import { PrintableAccessSource, PrintableDownloadSource } from "@prisma/client";

export function printableDownloadSourceForEvent(params: {
  isFree: boolean;
  isPremiumIncluded: boolean;
  paidAccessSource: PrintableAccessSource | null;
}): PrintableDownloadSource {
  if (params.isFree) return PrintableDownloadSource.LEARNER;
  if (params.isPremiumIncluded) return PrintableDownloadSource.SUBSCRIPTION;
  if (params.paidAccessSource === PrintableAccessSource.PURCHASE) return PrintableDownloadSource.PURCHASE;
  if (params.paidAccessSource === PrintableAccessSource.SUBSCRIPTION) return PrintableDownloadSource.SUBSCRIPTION;
  return PrintableDownloadSource.LEARNER;
}
