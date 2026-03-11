import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import getDb from "@/lib/db";
import { seedDemoData } from "@/lib/seed";

export async function GET() {
  try {
    seedDemoData();
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ authenticated: false });
    }

    const db = getDb();
    const user = db.prepare(
      "SELECT u.id, u.name, u.email, u.role, s.name as shop_name, s.id as shop_id FROM users u JOIN shops s ON u.shop_id = s.id WHERE u.id = ?"
    ).get(session.userId) as { id: number; name: string; email: string; role: string; shop_name: string; shop_id: number } | undefined;

    if (!user) {
      session.destroy();
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, shopName: user.shop_name, shopId: user.shop_id },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
