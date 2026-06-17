import crypto from "node:crypto";
import { cookies } from "next/headers";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  cookieOptions,
} from "./auth-config";
import { refreshAccessToken, type StravaAthlete } from "./strava";

export type SessionData = {
  athlete: Pick<StravaAthlete, "id" | "firstname" | "lastname" | "profile">;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch seconds
};

const ALG = "aes-256-gcm";

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET manquant (voir .env.local)");
  return crypto.createHash("sha256").update(secret).digest();
}

/** Chiffre la session en une chaîne opaque base64url (iv | tag | data). */
export function seal(data: SessionData): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, key(), iv);
  const enc = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

/** Déchiffre et valide la session ; renvoie null si invalide/altérée. */
export function unseal(token: string): SessionData | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);
    const decipher = crypto.createDecipheriv(ALG, key(), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(dec.toString("utf8")) as SessionData;
  } catch {
    return null;
  }
}

/** Lit la session courante (Server Components, Route Handlers, Server Actions). */
export async function readSession(): Promise<SessionData | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? unseal(token) : null;
}

/**
 * Renvoie un access token valide, en rafraîchissant si expiré.
 * À utiliser dans un contexte capable d'écrire des cookies
 * (Route Handler ou Server Action), pas dans un Server Component.
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await readSession();
  if (!session) return null;

  // Marge de 60s pour éviter d'utiliser un token sur le point d'expirer.
  if (session.expiresAt - 60 > Math.floor(Date.now() / 1000)) {
    return session.accessToken;
  }

  const refreshed = await refreshAccessToken(session.refreshToken);
  const updated: SessionData = {
    ...session,
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token,
    expiresAt: refreshed.expires_at,
  };
  (await cookies()).set(SESSION_COOKIE, seal(updated), cookieOptions(SESSION_MAX_AGE));
  return updated.accessToken;
}
