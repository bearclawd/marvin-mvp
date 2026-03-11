import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, time: new Date().toISOString() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ ok: true, received: body, time: new Date().toISOString() });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
