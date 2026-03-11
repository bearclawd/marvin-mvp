import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.shopId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const messages = db.getMessages(session.shopId);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Inbox error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
