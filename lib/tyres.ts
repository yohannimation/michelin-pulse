// Catalogue de pneus MICHELIN + identification (photo / code).
// Module PUR (pas de next/headers) : importable côté client comme serveur.

export type TyreModel = {
  model: string;
  /** Taille de référence, ex. « 700×28c ». */
  size: string;
  /** Durée de vie estimée du pneu, en km. */
  lifespanKm: number;
  /** Terrain conseillé. */
  terrain: string;
};

export const TYRE_CATALOG: TyreModel[] = [
  { model: "MICHELIN Power Cup", size: "700×28c", lifespanKm: 5000, terrain: "Route" },
  { model: "MICHELIN Power Road TLR", size: "700×30c", lifespanKm: 6000, terrain: "Route" },
  { model: "MICHELIN Power Gravel", size: "700×40c", lifespanKm: 4300, terrain: "Gravel" },
  { model: "MICHELIN Pro4 Endurance", size: "700×25c", lifespanKm: 7000, terrain: "Route" },
  { model: "MICHELIN Power All Season", size: "700×28c", lifespanKm: 6500, terrain: "Route" },
];

/** Normalise une saisie de code : majuscules, alphanumérique, 8 max. */
export function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

/** Un code valide = exactement 8 caractères alphanumériques. */
export function isValidCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Résout un code (déjà validé) vers un modèle du catalogue, de façon déterministe. */
export function identifyByCode(code: string): TyreModel {
  return TYRE_CATALOG[hash(code) % TYRE_CATALOG.length];
}

/**
 * Identification « photo » simulée : pas de vraie reconnaissance, on dérive un
 * modèle déterministe d'une empreinte du fichier (nom + taille).
 */
export function identifyByFingerprint(seed: string): TyreModel {
  return TYRE_CATALOG[hash(seed) % TYRE_CATALOG.length];
}
