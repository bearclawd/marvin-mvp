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
    const suppliers = db.getSuppliers(session.shopId);

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("Suppliers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
