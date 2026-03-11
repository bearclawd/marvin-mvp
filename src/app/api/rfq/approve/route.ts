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
    const rfq = db.getRFQ(rfqId);

    if (!rfq || rfq.shop_id !== session.shopId) {
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

    db.updateRFQStatus(rfqId, newStatus);

    return NextResponse.json({ success: true, newStatus });
  } catch (error) {
    console.error("RFQ approve error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
