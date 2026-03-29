import { handlers } from "@/lib/auth";

// Use Node so runtime env from DigitalOcean (AUTH_*) is available; Edge can omit them.
export const runtime = "nodejs";

export const { GET, POST } = handlers;
