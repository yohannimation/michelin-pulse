import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

import {
  CALLBACK_PATH,
  STATE_COOKIE,
  STATE_MAX_AGE,
  cookieOptions,
} from "@/lib/auth-config";
import { getAuthorizeUrl } from "@/lib/strava";

export async function GET(request: NextRequest) {
  // `state` anti-CSRF : on le pose en cookie et on le revérifie au callback.
  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = new URL(CALLBACK_PATH, request.nextUrl.origin).toString();

  const res = NextResponse.redirect(getAuthorizeUrl({ redirectUri, state }));
  res.cookies.set(STATE_COOKIE, state, cookieOptions(STATE_MAX_AGE));
  return res;
}
