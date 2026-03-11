import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";
import { seedDemoData } from "@/lib/seed";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    seedDemoData();
    const session = await getSession();
    if (!session.shopId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    const rfq = db.prepare(`
      SELECT r.*, c.company as customer_company, c.name as customer_name, c.email as customer_email, c.avg_margin as customer_avg_margin
      FROM rfqs r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.id = ? AND r.shop_id = ?
    `).get(Number(id), session.shopId);

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    const parts = db.prepare("SELECT * FROM rfq_parts WHERE rfq_id = ?").all(Number(id));

    return NextResponse.json({ rfq, parts });
  } catch (error) {
    console.error("RFQ detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
