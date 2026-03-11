import { createHash } from "crypto";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + "marvin-salt-2026").digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
