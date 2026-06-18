// Logique pure d'usure pneu (aucune dépendance serveur), importable depuis
// des Client Components — contrairement à lib/garage.ts qui dépend de
// next/headers via lib/session.ts / lib/tyre-store.ts.

export type WearTone = "good" | "watch" | "replace" | "none";

/** Couleur associée à un niveau d'usure, pour barres et libellés.
 *  Couleurs fonctionnelles de la charte MICHELIN (valide / warning / danger). */
export const WEAR_COLOR: Record<WearTone, string> = {
  good: "var(--color-michelin-green)", // Valide
  watch: "var(--color-michelin-warning)", // Avertissement
  replace: "var(--color-michelin-danger)", // Danger
  none: "var(--color-muted-foreground)", // aucun pneu
};

/** Tonalité d'usure à partir d'un pourcentage. */
export function wearTone(pct: number): WearTone {
  if (pct >= 75) return "replace";
  if (pct >= 40) return "watch";
  return "good";
}
