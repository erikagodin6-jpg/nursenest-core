import type { Prisma } from "@prisma/client";
import { BlogPostStatus, CountryCode } from "@prisma/client";

/** Build Prisma where for admin blog list / library filters (query string). */
export function buildAdminBlogListWhere(sp: URLSearchParams): Prisma.BlogPostWhereInput {
  const parts: Prisma.BlogPostWhereInput[] = [];

  const status = sp.get("status");
  if (status && Object.values(BlogPostStatus).includes(status as BlogPostStatus)) {
    parts.push({ postStatus: status as BlogPostStatus });
  }

  const exam = sp.get("exam")?.trim();
  if (exam) {
    parts.push({ exam: { contains: exam, mode: "insensitive" } });
  }

  const country = sp.get("country")?.trim();
  if (country === "US" || country === "CA") {
    parts.push({ countryTarget: country as CountryCode });
  } else if (country === "GLOBAL" || country === "NONE") {
    parts.push({ countryTarget: null });
  }

  const q = sp.get("q")?.trim();
  if (q) {
    parts.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { targetKeyword: { contains: q, mode: "insensitive" } },
        { keywordCluster: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  if (parts.length === 0) return {};
  return { AND: parts };
}

export function parseAdminBlogPagination(sp: URLSearchParams): { skip: number; take: number; page: number } {
  const page = Math.max(1, Math.floor(Number(sp.get("page") ?? "1")) || 1);
  const take = Math.min(100, Math.max(10, Math.floor(Number(sp.get("pageSize") ?? "40")) || 40));
  const skip = (page - 1) * take;
  return { page, take, skip };
}
