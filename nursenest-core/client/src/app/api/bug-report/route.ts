import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const report = await db.bugReport.create({
    data: {
      tenantId: body.tenantId,
      userId: body.userId,
      sessionId: body.sessionId,
      message: body.message,
      context: body.context,
      severity: body.severity ?? "low",
    },
  });

  return NextResponse.json(report);
}