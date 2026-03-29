import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  frequency: z.string().optional(),
});

/**
 * Newsletter signup — validates input and accepts. Persistence/email provider
 * can be added without changing the client contract (legacy `/api/subscribe`).
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Subscribed" });
}
