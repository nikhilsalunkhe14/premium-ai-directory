import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "";

function getSecret() {
  if (!ADMIN_SESSION_SECRET) {
    throw new Error("Missing ADMIN_SESSION_SECRET environment variable.");
  }

  return ADMIN_SESSION_SECRET;
}

export function isAdminPasswordValid(password?: string) {
  return Boolean(password && ADMIN_PASSWORD && password === ADMIN_PASSWORD);
}

export function parseCookies(cookieHeader?: string) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...valueParts] = cookie.split("=");
      return [key.trim(), valueParts.join("=").trim()];
    })
  );
}

export function getTokenFromCookieHeader(cookieHeader?: string) {
  const cookies = parseCookies(cookieHeader);
  return cookies[ADMIN_COOKIE_NAME];
}

export function createAdminSessionToken() {
  const timestamp = `${Date.now()}`;
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(timestamp)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

export function isAdminSessionTokenValid(token?: string) {
  if (!token) {
    return false;
  }

  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) {
    return false;
  }

  let expected: string;
  try {
    expected = crypto
      .createHmac("sha256", getSecret())
      .update(timestamp)
      .digest("hex");
  } catch {
    return false;
  }

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  const age = Date.now() - Number(timestamp);
  return Number.isFinite(age) && age >= 0 && age < ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
}

export function isAdminSessionCookieValid(cookieHeader?: string) {
  const token = getTokenFromCookieHeader(cookieHeader);
  return isAdminSessionTokenValid(token);
}
