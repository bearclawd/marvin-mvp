import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import getDb from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ authenticated: false });
    }

    const db = getDb();
    const user = db.getUserById(session.userId);

    if (!user) {
      // Clear invalid session by deleting the cookie
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete("marvin_session");
      return response;
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
