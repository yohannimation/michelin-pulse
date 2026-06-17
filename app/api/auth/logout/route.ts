import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth-config";

export async function POST(request: NextRequest) {
  // 303 See Other : force le navigateur à faire un GET vers la page de login
  // (un 307 conserverait la méthode POST).
  const res = NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl.origin), 303);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
