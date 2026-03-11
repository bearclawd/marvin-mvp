import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session.shopId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    const rfq = db.getRFQ(Number(id));

    if (!rfq || rfq.shop_id !== session.shopId) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    const parts = db.getRFQParts(Number(id));

    return NextResponse.json({ rfq, parts });
  } catch (error) {
    console.error("RFQ detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
