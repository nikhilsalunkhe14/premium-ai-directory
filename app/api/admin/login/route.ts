import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSessionToken, isAdminPasswordValid, ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let password: string | undefined;

  if (contentType.includes("application/json")) {
    const body = await request.json();
    password = body?.password;
  } else {
    const formData = await request.formData();
    password = formData.get("password") as string | undefined;
  }

  if (!isAdminPasswordValid(password)) {
    return NextResponse.json({ success: false, message: "Invalid admin password." }, { status: 401 });
  }

  const token = createAdminSessionToken();
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
