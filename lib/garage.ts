import { readSession } from "./session";
import { frameTypeLabel, getDetailedAthlete, getGear } from "./strava";
import { readTyres, type RegisteredTyre } from "./tyre-store";

/** Calcule l'usure affichable d'un pneu enregistré à partir du km vélo Strava. */
function toDisplayTyre(reg: RegisteredTyre, bikeStravaKm: number): Tyre {
  const km = Math.max(0, bikeStravaKm - reg.baselineKm);
  const wearPct = Math.min(100, Math.round((km / reg.lifespanKm) * 100));
  return {
    position: reg.position,
    model: reg.model,
    wearPct,
    km,
    remainingKm: Math.max(0, reg.lifespanKm - km),
  };
}

// AVANT avant ARRIÈRE, pour un affichage stable.
const POSITION_ORDER: Record<RegisteredTyre["position"], number> = {
  AVANT: 0,
  ARRIÈRE: 1,
};

/** Position d'un pneu sur le vélo. */
export type TyrePosition = "AVANT" | "ARRIÈRE";

/**
 * Un pneu MICHELIN enregistré sur un vélo, avec son usure.
 *
 * Ces données ne viennent PAS de Strava : elles sont alimentées par les scans
 * MICHELIN côté app. Tant qu'aucun pneu n'est scanné, un vélo importé de Strava
 * n'a pas de pneu ici (→ 0 km MICHELIN).
 */
export type Tyre = {
  position: TyrePosition;
  /** Modèle MICHELIN, ex. « MICHELIN Power Cup ». */
  model: string;
  /** Usure en %, 0 (neuf) → 100 (à changer). */
  wearPct: number;
  /** Km parcourus sur ce pneu. */
  km: number;
  /** Estimation de la durée de vie restante, en km. */
  remainingKm: number;
};

export type GarageBike = {
  id: string;
  name: string;
  /** Type de cadre Strava (Route, Gravel…). */
  type?: string;
  /** Taille de pneu, ex. « 700×28c ». Donnée app (scan), inconnue à l'import. */
  size?: string;
  /** Poids en kg. Non fourni par Strava. */
  weight?: number;
  /** Cumul kilométrique Strava sur ce vélo. */
  stravaKm: number;
  /** Km roulés sur pneus MICHELIN (somme des pneus). 0 tant qu'aucun scan. */
  michelinKm: number;
  /** Pneus MICHELIN scannés (vide tant qu'aucun scan). */
  tyres: Tyre[];
};

export type WearTone = "good" | "watch" | "replace" | "none";

/** Couleur (hex) associée à un niveau d'usure, pour barres et libellés.
 *  Couleurs fonctionnelles de la charte MICHELIN (valide / warning / danger). */
export const WEAR_COLOR: Record<WearTone, string> = {
  good: "#2E7D32", // Valide
  watch: "#F9A825", // Avertissement
  replace: "#B71C1C", // Danger
  none: "#999999", // Gray Light 40 (aucun pneu)
};

/** Tonalité d'usure à partir d'un pourcentage. */
export function wearTone(pct: number): WearTone {
  if (pct >= 75) return "replace";
  if (pct >= 40) return "watch";
  return "good";
}

/** Libellé d'état d'un vélo selon l'usure max de ses pneus. */
export function bikeStatus(bike: GarageBike): { label: string; tone: WearTone } {
  if (bike.tyres.length === 0) return { label: "À scanner", tone: "none" };
  const max = Math.max(...bike.tyres.map((t) => t.wearPct));
  const tone = wearTone(max);
  const label =
    tone === "replace" ? "À changer" : tone === "watch" ? "À surveiller" : "Bon état";
  return { label, tone };
}

const M_PER_KM = 1000;

/**
 * Construit le garage à partir du gear Strava de l'athlète connecté.
 *
 * Nécessite le scope `profile:read_all` (sinon `bikes` est vide). Chaque vélo
 * est enrichi via `/gear/{id}` pour récupérer le type de cadre / la marque.
 * Les pneus MICHELIN restent vides : ils proviendront des scans.
 */
export async function getGarage(): Promise<GarageBike[]> {
  const session = await readSession();
  if (!session) return [];

  const { accessToken } = session;
  let bikes: { id: string; name: string; distance: number }[] = [];
  try {
    const athlete = await getDetailedAthlete(accessToken);
    bikes = athlete.bikes ?? [];
  } catch {
    return [];
  }

  // Détail de chaque vélo (type de cadre, marque/modèle). Tolérant aux pannes.
  const detailed = await Promise.all(
    bikes.map(async (b) => {
      try {
        return await getGear(b.id, accessToken);
      } catch {
        return undefined;
      }
    })
  );

  const store = await readTyres();

  return bikes.map((b, i) => {
    const d = detailed[i];
    const stravaKm = Math.round(b.distance / M_PER_KM);
    const tyres = (store[b.id] ?? [])
      .map((reg) => toDisplayTyre(reg, stravaKm))
      .sort((a, b2) => POSITION_ORDER[a.position] - POSITION_ORDER[b2.position]);
    return {
      id: b.id,
      name: b.name,
      type: frameTypeLabel(d?.frame_type),
      // Taille déduite du pneu monté (Strava ne la fournit pas).
      size: store[b.id]?.[0]?.size,
      weight: undefined, // non fourni par Strava
      stravaKm,
      michelinKm: tyres.reduce((sum, t) => sum + t.km, 0),
      tyres,
    };
  });
}

/** Récupère un vélo précis du garage (page détail). */
export async function getGarageBike(id: string): Promise<GarageBike | null> {
  const garage = await getGarage();
  return garage.find((b) => b.id === id) ?? null;
}
