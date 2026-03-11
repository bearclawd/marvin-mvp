import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.shopId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rfqId, action } = await req.json();

    if (!rfqId || !action) {
      return NextResponse.json({ error: "rfqId and action required" }, { status: 400 });
    }

    const db = getDb();
    const rfq = db.prepare("SELECT * FROM rfqs WHERE id = ? AND shop_id = ?").get(rfqId, session.shopId);

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    let newStatus: string;
    switch (action) {
      case "approve":
        newStatus = "quoted";
        break;
      case "reject":
        newStatus = "lost";
        break;
      case "analyze":
        newStatus = "analysis";
        break;
      case "win":
        newStatus = "won";
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    db.prepare("UPDATE rfqs SET status = ?, updated_at = datetime('now') WHERE id = ?").run(newStatus, rfqId);

    db.prepare(
      "INSERT INTO activities (shop_id, type, title, description, icon) VALUES (?, ?, ?, ?, ?)"
    ).run(
      session.shopId,
      action === "approve" ? "quote" : action,
      action === "approve" ? "Quote approved" : action === "reject" ? "RFQ rejected" : action === "win" ? "Order won" : "RFQ sent to analysis",
      `RFQ #${rfqId} status changed to ${newStatus}`,
      action === "approve" ? "check-circle" : action === "reject" ? "x-circle" : "search"
    );

    return NextResponse.json({ success: true, newStatus });
  } catch (error) {
    console.error("RFQ approve error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
