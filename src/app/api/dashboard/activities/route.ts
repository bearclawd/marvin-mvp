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
    const activities = db.prepare(
      "SELECT * FROM activities WHERE shop_id = ? ORDER BY created_at DESC LIMIT 20"
    ).all(session.shopId);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Activities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
