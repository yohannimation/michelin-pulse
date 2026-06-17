import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth-config";

export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl.origin));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
