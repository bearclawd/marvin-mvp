import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";
import { seedDemoData } from "@/lib/seed";

export async function GET() {
  try {
    seedDemoData();
    const session = await getSession();
    if (!session.shopId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const messages = db.prepare(
      "SELECT * FROM messages WHERE shop_id = ? ORDER BY created_at DESC"
    ).all(session.shopId);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Inbox error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
