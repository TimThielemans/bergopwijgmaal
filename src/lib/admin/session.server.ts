import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Server-only admin auth. Admin accounts live in the `ADMIN_USERS` secret:
 *   email1:wachtwoord1;email2:wachtwoord2
 * Every account is a full admin. Sessions are encrypted cookies (`SESSION_SECRET`).
 */

export interface AdminSessionData {
  email?: string;
  createdAt?: string;
}

function sessionConfig() {
  const password = process.env["SESSION_SECRET"];
  if (!password || password.length < 32) throw new Error("SESSION_SECRET ontbreekt of is te kort");
  return {
    password,
    name: "bow-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export function adminSession() {
  return useSession<AdminSessionData>(sessionConfig());
}

function parseUsers(): Array<{ email: string; password: string }> {
  const raw = process.env["ADMIN_USERS"] ?? "";
  return raw
    .split(/[;\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const idx = entry.indexOf(":");
      return idx > 0
        ? { email: entry.slice(0, idx).trim().toLowerCase(), password: entry.slice(idx + 1) }
        : null;
    })
    .filter((u): u is { email: string; password: string } => !!u && !!u.password);
}

function same(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

export function verifyAdmin(email: string, password: string): string | null {
  const wanted = email.trim().toLowerCase();
  let match: string | null = null;
  for (const user of parseUsers()) {
    // Check every entry so timing does not reveal which emails exist.
    const ok = same(user.email, wanted) && same(user.password, password);
    if (ok) match = user.email;
  }
  return match;
}

/** Throws when the caller has no valid admin session. */
export async function requireAdmin(): Promise<string> {
  const session = await adminSession();
  const email = session.data.email;
  if (!email || !parseUsers().some((u) => u.email === email)) {
    throw new Error("Niet aangemeld als beheerder");
  }
  return email;
}
