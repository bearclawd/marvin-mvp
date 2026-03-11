import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const user = db.getUserByEmail("pascal@precision-cnc.ch");
    
    if (!user) {
      return NextResponse.json({ error: "Demo user not found" }, { status: 404 });
    }

    const sessionData = { userId: user.id, shopId: user.shop_id, email: user.email, name: user.name };
    const token = btoa(JSON.stringify(sessionData));

    const baseUrl = process.env.BASE_URL || "https://marvin-web-production.up.railway.app";
    const response = NextResponse.redirect(new URL("/dashboard", baseUrl));
    
    response.cookies.set("marvin_session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e), stack: (e as Error).stack }, { status: 500 });
  }
}
