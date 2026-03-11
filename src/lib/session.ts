import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || "marvin-default-secret-change-me-in-prod";

export interface SessionData {
  userId?: number;
  shopId?: number;
  email?: string;
  name?: string;
}

function encode(data: SessionData): string {
  return Buffer.from(JSON.stringify(data)).toString("base64url");
}

function decode(token: string): SessionData {
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
  } catch {
    return {};
  }
}

export async function getSession(): Promise<SessionData & { save: () => Promise<void>; destroy: () => void }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("marvin_session")?.value;
  const data: SessionData = token ? decode(token) : {};
  
  return {
    ...data,
    save: async () => {
      const value = encode({ userId: data.userId, shopId: data.shopId, email: data.email, name: data.name });
      cookieStore.set("marvin_session", value, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    },
    destroy: () => {
      cookieStore.delete("marvin_session");
    },
  };
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  return session;
}
