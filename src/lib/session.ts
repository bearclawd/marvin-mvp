import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "./types";

const sessionOptions = {
  password: process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || "marvin-default-secret-change-me-in-production-32chars!",
  cookieName: "marvin_session",
  cookieOptions: {
    secure: true,
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  return session;
}
