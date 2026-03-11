import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body", detail: String(e) }, { status: 400 });
    }
    
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    let db;
    try {
      db = getDb();
    } catch (e) {
      return NextResponse.json({ error: "DB init failed", detail: String(e) }, { status: 500 });
    }

    let user;
    try {
      user = db.getUserByEmail(email);
    } catch (e) {
      return NextResponse.json({ error: "User lookup failed", detail: String(e) }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    let passwordValid;
    try {
      passwordValid = db.verifyPassword(user.password_hash, password);
    } catch (e) {
      return NextResponse.json({ error: "Password verify failed", detail: String(e) }, { status: 500 });
    }

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create session token
    const sessionData = { userId: user.id, shopId: user.shop_id, email: user.email, name: user.name };
    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64url");
    
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email, shopName: user.shop_name } 
    });
    
    response.cookies.set("marvin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Unhandled error", detail: String(error), stack: (error as Error).stack }, { status: 500 });
  }
}
