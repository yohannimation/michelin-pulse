import { readSession } from "./session";
import {
  getAthleteStats,
  getDetailedAthlete,
  type StravaDetailedAthlete,
  type StravaStats,
} from "./strava";
import { readTyres } from "./tyre-store";

/** Palier de fidélité dérivé du kilométrage total Strava. */
export type Tier = "Bronze" | "Argent" | "Or";

export type ProfileData = {
  isConnected: boolean;
  /** Données Strava temps réel récupérées (false si token expiré / hors‑ligne). */
  isLive: boolean;
  name: string;
  initials: string;
  avatar?: string;
  /** Sous‑titre sous le nom (lieu Strava ; Strava ne fournit pas l'e‑mail). */
  subtitle?: string;
  tier: Tier;
  /** Km roulés sur pneus MICHELIN (loyalty). 0 tant qu'aucun pneu scanné. */
  michelinKm: number;
  /** Km vélo parcourus au total (cumul Strava), arrondis. */
  stravaKm: number;
  /** Nombre de sorties vélo enregistrées sur Strava. */
  rides: number;
  /** Nombre de vélos déclarés dans le garage Strava. */
  bikes: number;
};

const DEFAULT_AVATAR = "avatar/athlete/large.png"; // image par défaut Strava

function initialsOf(firstname?: string, lastname?: string) {
  const a = firstname?.trim()?.[0] ?? "";
  const b = lastname?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

/**
 * Palier de fidélité basé sur les km roulés sur pneus MICHELIN (pas le total
 * Strava) : ≥ 5 000 km → Or, ≥ 2 000 km → Argent, sinon Bronze.
 */
function tierFromKm(km: number): Tier {
  if (km >= 5000) return "Or";
  if (km >= 2000) return "Argent";
  return "Bronze";
}

function subtitleOf(athlete: StravaDetailedAthlete | undefined) {
  const parts = [athlete?.city, athlete?.country].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

/**
 * Construit les données de la page Profil à partir de la session et, quand le
 * token Strava est encore valide, des endpoints `/athlete` + `/stats`.
 *
 * Les appels Strava sont tolérants aux pannes : un access token expiré (durée
 * de vie ~6 h, non rafraîchissable depuis un Server Component) fait simplement
 * retomber sur les données stockées en session, sans casser le rendu.
 */
export async function getProfileData(): Promise<ProfileData | null> {
  const session = await readSession();
  if (!session) return null;

  const { athlete, accessToken } = session;
  const baseName = `${athlete.firstname} ${athlete.lastname}`.trim();
  const baseAvatar =
    athlete.profile && !athlete.profile.endsWith(DEFAULT_AVATAR)
      ? athlete.profile
      : undefined;

  let detailed: StravaDetailedAthlete | undefined;
  let stats: StravaStats | undefined;
  try {
    [detailed, stats] = await Promise.all([
      getDetailedAthlete(accessToken),
      getAthleteStats(athlete.id, accessToken),
    ]);
  } catch {
    // Token expiré ou Strava indisponible : on dégrade vers la session.
  }

  const stravaKm = Math.round((stats?.all_ride_totals.distance ?? 0) / 1000);

  // km MICHELIN = somme des km roulés sur les pneus enregistrés, calculée à
  // partir de l'odomètre Strava de chaque vélo. 0 tant qu'aucun pneu n'est scanné.
  const store = await readTyres();
  let michelinKm = 0;
  for (const bike of detailed?.bikes ?? []) {
    const bikeKm = Math.round(bike.distance / 1000);
    for (const reg of store[bike.id] ?? []) {
      michelinKm += Math.max(0, bikeKm - reg.baselineKm);
    }
  }

  return {
    isConnected: true,
    isLive: Boolean(detailed || stats),
    name: detailed ? `${detailed.firstname} ${detailed.lastname}`.trim() : baseName,
    initials: initialsOf(
      detailed?.firstname ?? athlete.firstname,
      detailed?.lastname ?? athlete.lastname
    ),
    avatar: baseAvatar ?? (detailed?.profile && !detailed.profile.endsWith(DEFAULT_AVATAR)
      ? detailed.profile
      : undefined),
    subtitle: subtitleOf(detailed),
    tier: tierFromKm(michelinKm),
    michelinKm,
    stravaKm,
    rides: stats?.all_ride_totals.count ?? 0,
    bikes: detailed?.bikes?.length ?? 0,
  };
}
