import { NextResponse, type NextRequest } from "next/server";

import { AFTER_LOGIN_PATH, SESSION_COOKIE, SESSION_MAX_AGE, cookieOptions } from "@/lib/auth-config";
import { seal, type SessionData } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session: SessionData = {
    athlete: {
      id: 0,
      firstname: "Invité",
      lastname: "",
      profile: "",
    },
    accessToken: "",
    refreshToken: "",
    expiresAt: 0,
  };

  const res = NextResponse.redirect(new URL(AFTER_LOGIN_PATH, request.nextUrl.origin));
  res.cookies.set(SESSION_COOKIE, seal(session), cookieOptions(SESSION_MAX_AGE));
  return res;
}
