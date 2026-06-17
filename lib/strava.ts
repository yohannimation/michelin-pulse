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

export type StravaActivity = {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number; // mètres
  moving_time: number; // secondes
  total_elevation_gain: number; // mètres
  average_speed: number; // m/s
  start_date: string; // ISO 8601 UTC
};

const CYCLING_SPORT_TYPES = new Set([
  "Ride",
  "VirtualRide",
  "GravelRide",
  "MountainBikeRide",
  "EBikeRide",
]);

/** Activités de l'athlète sur la période donnée (paginé, plus récentes d'abord). */
export async function getActivities(
  accessToken: string,
  { after, before }: { after?: number; before?: number } = {}
): Promise<StravaActivity[]> {
  const perPage = 100;
  const activities: StravaActivity[] = [];

  for (let page = 1; page <= 5; page++) {
    const search = new URLSearchParams({ per_page: String(perPage), page: String(page) });
    if (after) search.set("after", String(after));
    if (before) search.set("before", String(before));

    const batch = await stravaFetch<StravaActivity[]>(
      `/athlete/activities?${search.toString()}`,
      accessToken
    );
    activities.push(...batch);
    if (batch.length < perPage) break;
  }

  return activities;
}

function monthsAgo(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

function toEpoch(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export type CyclingStats = {
  distanceKm: number;
  elevationGainM: number;
  avgSpeedKmh: number;
};

export type CyclingTrend = Partial<Record<keyof CyclingStats, number>>;

export type CyclingStatsWithTrend = CyclingStats & {
  /** % de variation vs le mois précédent. */
  trend: CyclingTrend;
};

function aggregateRides(rides: StravaActivity[]): CyclingStats {
  const distanceM = rides.reduce((sum, a) => sum + a.distance, 0);
  const movingTimeS = rides.reduce((sum, a) => sum + a.moving_time, 0);
  const elevationGainM = rides.reduce((sum, a) => sum + (a.total_elevation_gain ?? 0), 0);

  return {
    distanceKm: distanceM / 1000,
    elevationGainM,
    // Moyenne pondérée par le temps (plus juste qu'une moyenne des average_speed par sortie).
    avgSpeedKmh: movingTimeS > 0 ? (distanceM / movingTimeS) * 3.6 : 0,
  };
}

function percentChange(current: number, previous: number): number | undefined {
  if (previous === 0) return current === 0 ? 0 : undefined;
  return ((current - previous) / previous) * 100;
}

/** Stats vélo du dernier mois (+ tendance vs le mois précédent). */
export async function getMonthlyCyclingStats(
  accessToken: string
): Promise<CyclingStatsWithTrend> {
  const now = new Date();
  const filterRides = (activities: StravaActivity[]) =>
    activities.filter((a) => CYCLING_SPORT_TYPES.has(a.sport_type ?? a.type));

  const [currentActivities, previousActivities] = await Promise.all([
    getActivities(accessToken, { after: toEpoch(monthsAgo(now, 1)) }),
    getActivities(accessToken, {
      after: toEpoch(monthsAgo(now, 2)),
      before: toEpoch(monthsAgo(now, 1)),
    }),
  ]);

  const current = aggregateRides(filterRides(currentActivities));
  const previous = aggregateRides(filterRides(previousActivities));

  const trend: CyclingTrend = {
    distanceKm: percentChange(current.distanceKm, previous.distanceKm),
    elevationGainM: percentChange(current.elevationGainM, previous.elevationGainM),
    avgSpeedKmh: percentChange(current.avgSpeedKmh, previous.avgSpeedKmh),
  };

  return { ...current, trend };
}
