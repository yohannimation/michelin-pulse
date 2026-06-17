import {
  STRAVA_API_BASE,
  STRAVA_AUTHORIZE_URL,
  STRAVA_SCOPES,
  STRAVA_TOKEN_URL,
} from "./auth-config";

export type StravaAthlete = {
  id: number;
  firstname: string;
  lastname: string;
  profile?: string;
  city?: string;
  country?: string;
};

/** Réponse d'échange/refresh de token Strava. */
export type StravaTokenResponse = {
  token_type: string;
  expires_at: number; // epoch seconds
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete?: StravaAthlete; // présent uniquement à l'échange initial
};

function clientId() {
  const id = process.env.STRAVA_CLIENT_ID;
  if (!id) throw new Error("STRAVA_CLIENT_ID manquant (voir .env.local)");
  return id;
}

function clientSecret() {
  const secret = process.env.STRAVA_CLIENT_SECRET;
  if (!secret) throw new Error("STRAVA_CLIENT_SECRET manquant (voir .env.local)");
  return secret;
}

/** URL d'autorisation vers laquelle on redirige l'utilisateur. */
export function getAuthorizeUrl(params: { redirectUri: string; state: string }) {
  const url = new URL(STRAVA_AUTHORIZE_URL);
  url.searchParams.set("client_id", clientId());
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("approval_prompt", "auto");
  url.searchParams.set("scope", STRAVA_SCOPES);
  url.searchParams.set("state", params.state);
  return url.toString();
}

/** Échange le `code` du callback contre des tokens. */
export async function exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId(),
      client_secret: clientSecret(),
      code,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Échange de token Strava échoué (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

/** Renouvelle l'access token à partir du refresh token. */
export async function refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId(),
      client_secret: clientSecret(),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Refresh de token Strava échoué (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

/** Appel authentifié à l'API Strava. */
export async function stravaFetch<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${STRAVA_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Appel Strava ${path} échoué (${res.status})`);
  }
  return res.json();
}
