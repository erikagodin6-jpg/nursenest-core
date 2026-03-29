export interface CitationData {
  title: string;
  author: string;
  authorCredentials: string;
  siteName: string;
  url: string;
  publishedDate: string | null;
  updatedDate: string | null;
}

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_ABBR = [
  "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
  "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec.",
];

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function getAuthorLastFirst(author: string): string {
  const parts = author.split(",").map((p) => p.trim());
  if (parts.length >= 2) return author;
  const nameParts = author.trim().split(/\s+/);
  if (nameParts.length === 1) return author;
  const last = nameParts[nameParts.length - 1];
  const initials = nameParts.slice(0, -1).map((n) => n.charAt(0).toUpperCase() + ".").join(" ");
  return `${last}, ${initials}`;
}

export function generateAPA(data: CitationData): string {
  const author = `${data.author}, ${data.authorCredentials}`;
  const pubDate = parseDate(data.publishedDate);
  const dateStr = pubDate
    ? `${pubDate.getFullYear()}, ${MONTHS_FULL[pubDate.getMonth()]} ${pubDate.getDate()}`
    : "n.d.";
  return `${author} (${dateStr}). ${data.title}. ${data.siteName}. ${data.url}`;
}

export function generateMLA(data: CitationData): string {
  const author = `${data.author}, ${data.authorCredentials}`;
  const pubDate = parseDate(data.publishedDate);
  const dateStr = pubDate
    ? `${pubDate.getDate()} ${MONTHS_ABBR[pubDate.getMonth()]} ${pubDate.getFullYear()}`
    : "";
  const datePart = dateStr ? `, ${dateStr}` : "";
  return `${author}. "${data.title}." ${data.siteName}${datePart}, ${data.url}.`;
}

export function generateChicago(data: CitationData): string {
  const author = `${data.author}, ${data.authorCredentials}`;
  const pubDate = parseDate(data.publishedDate);
  const updDate = parseDate(data.updatedDate);
  const year = pubDate ? `${pubDate.getFullYear()}` : "n.d.";
  const modifiedPart = updDate
    ? ` Last modified ${MONTHS_FULL[updDate.getMonth()]} ${updDate.getDate()}, ${updDate.getFullYear()}.`
    : pubDate
      ? ` Last modified ${MONTHS_FULL[pubDate.getMonth()]} ${pubDate.getDate()}, ${pubDate.getFullYear()}.`
      : "";
  return `${author}. ${year}. "${data.title}." ${data.siteName}.${modifiedPart} ${data.url}.`;
}

export function generateHarvard(data: CitationData): string {
  const author = `${data.author}, ${data.authorCredentials}`;
  const pubDate = parseDate(data.publishedDate);
  const year = pubDate ? `${pubDate.getFullYear()}` : "n.d.";
  const today = new Date();
  const accessedStr = `${today.getDate()} ${MONTHS_FULL[today.getMonth()]} ${today.getFullYear()}`;
  return `${author} (${year}) ${data.title}. Available at: ${data.url} (Accessed: ${accessedStr}).`;
}
