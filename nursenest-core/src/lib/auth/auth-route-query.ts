type QueryValue = string | string[] | undefined;

export type AuthRouteSearchParams = Record<string, QueryValue>;

export function authRouteQueryString(searchParams: AuthRouteSearchParams): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      if (value.trim()) query.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item.trim()) query.append(key, item);
      }
    }
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}
