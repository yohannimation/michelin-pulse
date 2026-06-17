// Constantes d'auth partagées. Aucun import Node : ce module doit rester
// importable depuis le proxy (runtime edge).

export const SESSION_COOKIE = "mp_session";
export const STATE_COOKIE = "mp_oauth_state";

// Scopes Strava :
//  - read                : profil public (nom, ville, avatar)
//  - profile:read_all     : profil complet, dont le GARAGE (vélos/gear)
//  - activity:read_all    : activités (y compris privées) pour les stats
// `profile:read_all` est indispensable pour importer les vélos : sans lui,
// le tableau `bikes` de `GET /athlete` revient vide.
export const STRAVA_SCOPES = "read,profile:read_all,activity:read_all";

export const STRAVA_AUTHORIZE_URL = "https://www.strava.com/oauth/authorize";
export const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
export const STRAVA_API_BASE = "https://www.strava.com/api/v3";

// Chemin du callback OAuth (sous le "Authorization Callback Domain" Strava).
export const CALLBACK_PATH = "/auth/callback";

// Où l'utilisateur atterrit une fois connecté / déconnecté.
export const AFTER_LOGIN_PATH = "/";
export const LOGIN_PATH = "/auth/login";

export const isProd = process.env.NODE_ENV === "production";

/** Options communes des cookies httpOnly. */
export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours
export const STATE_MAX_AGE = 60 * 10; // 10 minutes
