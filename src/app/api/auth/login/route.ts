import { NextResponse } from "next/server";
import { compareSync } from "bcryptjs";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";
import { seedDemoData } from "@/lib/seed";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    seedDemoData();

    const db = getDb();
    const user = db.prepare(
      "SELECT u.*, s.name as shop_name FROM users u JOIN shops s ON u.shop_id = s.id WHERE u.email = ?"
    ).get(email) as { id: number; shop_id: number; email: string; password_hash: string; name: string; shop_name: string } | undefined;

    if (!user || !compareSync(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const session = await getSession();
    session.userId = user.id;
    session.shopId = user.shop_id;
    session.email = user.email;
    session.name = user.name;
    await session.save();

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, shopName: user.shop_name } });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
