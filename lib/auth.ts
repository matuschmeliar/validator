import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "idea_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export class AuthError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "AuthError";
  }
}

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 chars");
  }
  return new TextEncoder().encode(s);
}

export function getAccessCode(): string {
  const code = process.env.ACCESS_CODE;
  if (!code) throw new Error("ACCESS_CODE not configured");
  return code;
}

export function getAllowedDomain(): string | null {
  const d = process.env.ALLOWED_DOMAIN?.trim();
  return d && d.length > 0 ? d.toLowerCase() : null;
}

export async function signSession(email: string): Promise<string> {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_SECONDS}s`)
    .sign(secret());
}

export async function verifySession(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function setSessionCookie(email: string) {
  const token = await signSession(email);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function readSessionEmail(): Promise<string | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  return session?.email ?? null;
}

export async function requireUserEmail(): Promise<string> {
  const email = await readSessionEmail();
  if (!email) throw new AuthError("Unauthorized");
  return email;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
