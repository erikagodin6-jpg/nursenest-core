import { NextResponse } from "next/server";
import { z } from "zod";
import { JSON_BODY_TINY, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";

const bodySchema = z.object({
  email: z.string().email(),
  frequency: z.string().optional(),
});

/**
 * Newsletter signup — validates input and accepts. Persistence/email provider
 * can be added without changing the client contract (legacy `/api/subscribe`).
 */
export async function POST(req: Request) {
  const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_TINY);
  if (!bodyRead.ok) return bodyRead.response;

  const parsed = bodySchema.safeParse(bodyRead.value);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Subscribed" });
}
