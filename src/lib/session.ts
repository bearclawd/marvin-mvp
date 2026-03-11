import { cookies } from "next/headers";

export interface SessionData {
  userId?: number;
  shopId?: number;
  email?: string;
  name?: string;
}

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("marvin_session")?.value;
  if (!token) return {};
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
  } catch {
    return {};
  }
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  return session;
}
