// Persistance des pneus MICHELIN enregistrés, dans un cookie chiffré
// (mêmes garanties que la session : AES‑256‑GCM, clé dérivée de SESSION_SECRET).
// Module SERVEUR uniquement (utilise next/headers).

import crypto from "node:crypto";
import { cookies } from "next/headers";

import { isProd } from "./auth-config";

export type TyrePosition = "AVANT" | "ARRIÈRE";

/**
 * Pneu enregistré sur un vélo. `baselineKm` = odomètre Strava du vélo au montage
 * MOINS les km déjà parcourus déclarés. Ainsi, à tout moment :
 *   kmPneu = kmStravaVélo − baselineKm   (croît avec les sorties Strava).
 */
export type RegisteredTyre = {
  position: TyrePosition;
  model: string;
  size: string;
  lifespanKm: number;
  baselineKm: number;
};

/** Carte bikeId → pneus enregistrés. */
export type TyreStore = Record<string, RegisteredTyre[]>;

const COOKIE = "mp_tyres";
const ALG = "aes-256-gcm";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 an

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET manquant (voir .env.local)");
  return crypto.createHash("sha256").update(secret).digest();
}

function seal(data: TyreStore): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, key(), iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

function unseal(token: string): TyreStore | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);
    const decipher = crypto.createDecipheriv(ALG, key(), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(dec.toString("utf8")) as TyreStore;
  } catch {
    return null;
  }
}

/** Lit tous les pneus enregistrés (lecture seule : OK en Server Component). */
export async function readTyres(): Promise<TyreStore> {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? unseal(token) ?? {} : {};
}

/** Écrit le cookie (à n'appeler que depuis une Server Action / Route Handler). */
async function writeTyres(store: TyreStore): Promise<void> {
  (await cookies()).set(COOKIE, seal(store), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Enregistre (ou remplace) un pneu pour une position donnée. */
export async function addTyre(bikeId: string, tyre: RegisteredTyre): Promise<void> {
  const store = await readTyres();
  const list = (store[bikeId] ?? []).filter((t) => t.position !== tyre.position);
  list.push(tyre);
  store[bikeId] = list;
  await writeTyres(store);
}

/** Retire le pneu d'une position. */
export async function removeTyre(bikeId: string, position: TyrePosition): Promise<void> {
  const store = await readTyres();
  store[bikeId] = (store[bikeId] ?? []).filter((t) => t.position !== position);
  if (store[bikeId].length === 0) delete store[bikeId];
  await writeTyres(store);
}
