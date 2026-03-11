import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const now = new Date().toISOString();
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields", time: now }, { status: 400 });
    }

    const db = getDb();
    const user = db.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found", time: now }, { status: 401 });
    }

    if (!db.verifyPassword(user.password_hash, password)) {
      return NextResponse.json({ error: "Invalid password", time: now }, { status: 401 });
    }

    const sessionData = { userId: user.id, shopId: user.shop_id, email: user.email, name: user.name };
    const sessionString = JSON.stringify(sessionData);
    // Use standard base64 that works in both Node and Edge
    const token = typeof btoa !== "undefined" 
      ? btoa(sessionString) 
      : Buffer.from(sessionString).toString("base64");
    
    const response = NextResponse.json({ 
      success: true, 
      time: now,
      user: { id: user.id, name: user.name, email: user.email, shopName: user.shop_name } 
    });
    
    response.cookies.set("marvin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Surgical fail", 
      message: error.message, 
      stack: error.stack,
      time: now 
    }, { status: 500 });
  }
}
