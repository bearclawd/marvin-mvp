import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = getDb();
    const user = db.getUserByEmail(email);

    if (!user || !db.verifyPassword(user.password_hash, password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    try {
      const session = await getSession();
      session.userId = user.id;
      session.shopId = user.shop_id;
      session.email = user.email;
      session.name = user.name;
      await session.save();
    } catch (sessionError) {
      console.error("Session save error:", sessionError);
      // Return success even if session save fails — let client retry
      return NextResponse.json({ 
        success: true, 
        sessionError: String(sessionError),
        user: { id: user.id, name: user.name, email: user.email, shopName: user.shop_name } 
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, shopName: user.shop_name } });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error", detail: String(error) }, { status: 500 });
  }
}
