import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("Not found", { status: 404 });
}

export const HEAD = GET;
