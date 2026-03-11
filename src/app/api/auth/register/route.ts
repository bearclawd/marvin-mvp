import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, shopName } = await req.json();

    if (!name || !email || !password || !shopName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const db = getDb();

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const shop = db.createShop({ name: shopName });
    const user = db.createUser(shop.id, email, password, name);

    // Create session token via cookie (same as login)
    const sessionData = { userId: user.id, shopId: shop.id, email, name };
    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64url");

    const response = NextResponse.json({ success: true, user: { id: user.id, name, email, shopName } });

    response.cookies.set("marvin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
