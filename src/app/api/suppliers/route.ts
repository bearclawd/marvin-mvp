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
    const suppliers = db.prepare(
      "SELECT * FROM suppliers WHERE shop_id = ? ORDER BY name"
    ).all(session.shopId);

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("Suppliers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
