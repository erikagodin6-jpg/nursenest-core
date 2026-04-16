import type { Prisma } from "@prisma/client";
import { BlogPostStatus, CountryCode } from "@prisma/client";
import { API_LIST_PAGE_SIZE_HARD_MAX, parseBoundedPageSize, parseListPage } from "@/lib/api/api-pagination-limits";

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

/** Admin blog list: same hard max as other list APIs; default page size 40. */
export const ADMIN_BLOG_LIST_PAGE = {
  min: 10,
  max: API_LIST_PAGE_SIZE_HARD_MAX,
  default: 40,
} as const;

export function parseAdminBlogPagination(
  sp: URLSearchParams,
):
  | { ok: true; skip: number; take: number; page: number }
  | { ok: false; error: string; code: string } {
  const pageParsed = parseListPage(sp.get("page"));
  if (!pageParsed.ok) {
    return { ok: false, error: pageParsed.error, code: "invalid_page" };
  }
  const sizeParsed = parseBoundedPageSize(sp.get("pageSize"), ADMIN_BLOG_LIST_PAGE);
  if (!sizeParsed.ok) {
    return { ok: false, error: sizeParsed.error.message, code: sizeParsed.error.code };
  }
  const skip = (pageParsed.page - 1) * sizeParsed.pageSize;
  return { ok: true, skip, take: sizeParsed.pageSize, page: pageParsed.page };
}
