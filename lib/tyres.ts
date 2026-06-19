// Identification de pneu (photo / code) à partir du catalogue boutique :
// seuls de vrais pneus MICHELIN peuvent être reconnus, puisque c'est la seule
// donnée dont on dispose (cf. lib/shop/catalog.ts).
// Module PUR (pas de next/headers) : importable côté client comme serveur.

import {
  lifespanKmOf,
  sizeOf,
  SHOP_CATALOG,
  terrainOf,
  type ShopTyre,
} from "@/lib/shop/catalog";

export type TyreModel = {
  model: string;
  /** Taille de référence, ex. « 700×28c ». */
  size: string;
  /** Durée de vie estimée du pneu, en km. */
  lifespanKm: number;
  /** Terrain conseillé. */
  terrain: string;
  /** Identifiant boutique du pneu, pour lier vers sa fiche. */
  slug: string;
};

/** Construit un `TyreModel` (usage scan/garage) à partir d'un pneu de la boutique. */
export function tyreModelOf(tyre: ShopTyre): TyreModel {
  return {
    model: `MICHELIN ${tyre.name}`,
    size: sizeOf(tyre),
    lifespanKm: lifespanKmOf(tyre),
    terrain: terrainOf(tyre),
    slug: tyre.slug,
  };
}

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
  return tyreModelOf(SHOP_CATALOG[hash(code) % SHOP_CATALOG.length]);
}

/**
 * Identification « photo » simulée : pas de vraie reconnaissance, on dérive un
 * modèle déterministe d'une empreinte du fichier (nom + taille). Utilisé par
 * le formulaire d'ajout manuel ; le Scan, lui, utilise la reconnaissance
 * d'image réelle (cf. lib/shop/vision.ts).
 */
export function identifyByFingerprint(seed: string): TyreModel {
  return tyreModelOf(SHOP_CATALOG[hash(seed) % SHOP_CATALOG.length]);
}

/**
 * Usure détectée sur la photo, en % (simulée à partir de la même empreinte
 * que l'identification — pas de vraie analyse de la profondeur de la gomme).
 */
export function detectWearPct(seed: string): number {
  return 5 + (hash(`wear-${seed}`) % 86);
}

/** Pression conseillée (indicative) par terrain — repère général, pas une consigne constructeur précise. */
const PRESSURE_ADVICE: Record<string, string> = {
  Route: "6 à 7 bar (87–101 psi)",
  Gravel: "2,5 à 3,5 bar (36–51 psi)",
  VTT: "1,5 à 2,2 bar (22–32 psi)",
  Électrique: "3,5 à 5 bar (51–73 psi)",
  "Ville & Rando": "3,5 à 4,5 bar (51–65 psi)",
  BMX: "3,5 à 4,5 bar (51–65 psi)",
  Enfant: "2,5 à 3,5 bar (36–51 psi)",
};

/** Pression conseillée pour un terrain donné, avec repli générique si inconnu. */
export function pressureAdviceFor(terrain: string): string {
  return PRESSURE_ADVICE[terrain] ?? "voir l'indication sur le flanc du pneu";
}
