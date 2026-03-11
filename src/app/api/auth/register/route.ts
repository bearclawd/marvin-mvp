import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";

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

    const session = await getSession();
    session.userId = user.id;
    session.shopId = shop.id;
    session.email = email;
    session.name = name;
    await session.save();

    return NextResponse.json({ success: true, user: { id: user.id, name, email, shopName } });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
