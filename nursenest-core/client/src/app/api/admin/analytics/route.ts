import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const usage = await db.analyticsGameUsage.findMany();

  const totalSessions = usage.reduce((sum, u) => sum + u.sessionCount, 0);
  const totalDuration = usage.reduce((sum, u) => sum + u.totalDurationSeconds, 0);

  return NextResponse.json({
    totalSessions,
    totalDurationSeconds: totalDuration,
    byGame: usage,
  });
}