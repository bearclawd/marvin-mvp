import { NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";
import { seedDemoData } from "@/lib/seed";

export async function POST(req: Request) {
  try {
    const { name, email, password, shopName } = await req.json();

    if (!name || !email || !password || !shopName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    seedDemoData();

    const db = getDb();

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const shopResult = db.prepare("INSERT INTO shops (name) VALUES (?)").run(shopName);
    const shopId = shopResult.lastInsertRowid as number;

    const passwordHash = hashSync(password, 10);
    const userResult = db.prepare(
      "INSERT INTO users (shop_id, email, password_hash, name) VALUES (?, ?, ?, ?)"
    ).run(shopId, email, passwordHash, name);
    const userId = userResult.lastInsertRowid as number;

    const session = await getSession();
    session.userId = userId;
    session.shopId = shopId;
    session.email = email;
    session.name = name;
    await session.save();

    return NextResponse.json({ success: true, user: { id: userId, name, email, shopName } });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
