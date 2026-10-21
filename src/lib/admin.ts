// Admin sign-in. There's one admin password (ADMIN_PASSWORD in .env.local and
// in Vercel). Signing in stores a cookie holding a signature of that password,
// so changing the password signs everyone out.
import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "sm_admin";

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!password || password.length < 12 || !secret) return null;
  return createHmac("sha256", secret).update(`admin:${password}`).digest("hex");
}

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function adminConfigured(): boolean {
  return expectedToken() !== null;
}

export async function isAdmin(): Promise<boolean> {
  const expected = expectedToken();
  const token = (await cookies()).get(COOKIE)?.value;
  return !!expected && !!token && same(token, expected);
}

export async function signIn(password: string): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD;
  const expected = expectedToken();
  // Slow down guessing a little.
  await new Promise((r) => setTimeout(r, 600));
  if (!real || !expected || !same(password, real)) return false;
  (await cookies()).set(COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 14,
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
