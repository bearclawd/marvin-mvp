// Ultra-simple password hashing for prototype
// Uses a basic approach that works everywhere with zero dependencies

const SALT = "marvin-prototype-salt-2026";

export function hashPassword(password: string): string {
  let hash = 0;
  const str = password + SALT;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return "h_" + Math.abs(hash).toString(36);
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
