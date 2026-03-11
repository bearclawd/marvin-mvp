import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = getDb();
    const user = db.getUserByEmail(email);

    if (!user || !db.verifyPassword(user.password_hash, password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create session token
    const sessionData = { userId: user.id, shopId: user.shop_id, email: user.email, name: user.name };
    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64url");
    
    // Set cookie via response header (works in POST route handlers)
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error", detail: String(error) }, { status: 500 });
  }
}
