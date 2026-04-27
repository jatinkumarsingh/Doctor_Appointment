import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "auth_token";
const JWT_EXPIRES_IN = "7d";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function signAuthToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export async function setAuthCookie(token) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);

  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (!payload.userId || typeof payload.userId !== "string") {
    return null;
  }

  return payload.userId;
}

export async function requireAuthUserId() {
  const userId = await getAuthUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}