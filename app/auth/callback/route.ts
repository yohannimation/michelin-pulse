import { NextResponse, type NextRequest } from "next/server";

import {
  AFTER_LOGIN_PATH,
  LOGIN_PATH,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  STATE_COOKIE,
  cookieOptions,
} from "@/lib/auth-config";
import { seal, type SessionData } from "@/lib/session";
import { exchangeCodeForToken, stravaFetch, type StravaAthlete } from "@/lib/strava";

function loginRedirect(request: NextRequest, error: string) {
  const url = new URL(LOGIN_PATH, request.nextUrl.origin);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // L'utilisateur a refusé l'accès sur Strava.
  if (error) return loginRedirect(request, "access_denied");

  // Vérification anti-CSRF du state.
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;
  if (!state || !expectedState || state !== expectedState) {
    return loginRedirect(request, "invalid_state");
  }
  if (!code) return loginRedirect(request, "missing_code");

  try {
    const token = await exchangeCodeForToken(code);

    // L'athlète arrive avec l'échange ; sinon on le récupère via l'API.
    const athlete: StravaAthlete =
      token.athlete ?? (await stravaFetch<StravaAthlete>("/athlete", token.access_token));

    const session: SessionData = {
      athlete: {
        id: athlete.id,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        profile: athlete.profile,
      },
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: token.expires_at,
    };

    const res = NextResponse.redirect(new URL(AFTER_LOGIN_PATH, request.nextUrl.origin));
    res.cookies.set(SESSION_COOKIE, seal(session), cookieOptions(SESSION_MAX_AGE));
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch {
    return loginRedirect(request, "token_exchange_failed");
  }
}
