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
    const rfqs = db.prepare(`
      SELECT r.*, c.company as customer_company
      FROM rfqs r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.shop_id = ?
      ORDER BY r.created_at DESC
    `).all(session.shopId);

    return NextResponse.json({ rfqs });
  } catch (error) {
    console.error("RFQ list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
