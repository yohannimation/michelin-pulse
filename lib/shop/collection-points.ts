// Points de collecte simulés pour la boutique.
// On part du principe que MICHELIN vend en direct : on propose donc des points
// de vente MICHELIN et des points relais (type Mondial Relay), dérivés de
// l'adresse saisie. Module PUR (pas de backend) : résultats déterministes.

export type PointType = "michelin" | "relay";

export type CollectionPoint = {
  id: string;
  type: PointType;
  name: string;
  address: string;
  /** Distance à vol d'oiseau, en km. */
  distanceKm: number;
  hours: string;
  /** Le point accepte la reprise des pneus usagés (recyclage). */
  recycling: boolean;
};

const MICHELIN_POINTS = [
  { name: "MICHELIN Store", hours: "Lun–Sam · 9h–19h" },
  { name: "Vélociste partenaire MICHELIN", hours: "Mar–Sam · 10h–18h30" },
  { name: "Atelier MICHELIN Bike", hours: "Lun–Ven · 8h30–18h" },
];

const RELAY_POINTS = [
  { name: "Mondial Relay — Supérette du Centre", hours: "7j/7 · 8h–21h" },
  { name: "Point Relais — Tabac de la Gare", hours: "Lun–Sam · 7h–20h" },
  { name: "Relais Colis — Presse du Marché", hours: "Lun–Sam · 8h–19h" },
  { name: "Point Relais — Pressing Express", hours: "Lun–Sam · 9h–19h" },
];

const STREETS = [
  "rue de la République",
  "avenue des Tilleuls",
  "place du Marché",
  "boulevard Voltaire",
  "rue des Lilas",
  "cours Lafayette",
  "rue Victor Hugo",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Devine la ville depuis l'adresse (dernier segment alphabétique non vide). */
function cityOf(address: string): string {
  const parts = address
    .split(/[,\n]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  // Retire un éventuel code postal en tête (« 75011 Paris » -> « Paris »).
  const city = last.replace(/^\s*\d{4,5}\s*/, "").trim();
  return city || "votre ville";
}

/**
 * Points de collecte proches d'une adresse : 2 points de vente MICHELIN
 * (reprise/recyclage acceptée) + 3 points relais, triés par distance.
 */
export function findCollectionPoints(address: string): CollectionPoint[] {
  const seed = hash(address.trim().toLowerCase());
  const city = cityOf(address);

  const make = (
    base: { name: string; hours: string },
    type: PointType,
    i: number,
    recycling: boolean
  ): CollectionPoint => {
    const k = (seed >> (i * 4)) >>> 0;
    const street = STREETS[k % STREETS.length];
    const num = 1 + (k % 88);
    const distanceKm = Math.round((((k >> 5) % 55) / 10 + 0.3) * 10) / 10;
    return {
      id: `${type}-${i}`,
      type,
      name: base.name,
      address: `${num} ${street}, ${city}`,
      distanceKm,
      hours: base.hours,
      recycling,
    };
  };

  const points = [
    make(MICHELIN_POINTS[0], "michelin", 0, true),
    make(MICHELIN_POINTS[1 + (seed % 2)], "michelin", 1, true),
    make(RELAY_POINTS[seed % RELAY_POINTS.length], "relay", 2, false),
    make(RELAY_POINTS[(seed + 1) % RELAY_POINTS.length], "relay", 3, true),
    make(RELAY_POINTS[(seed + 2) % RELAY_POINTS.length], "relay", 4, false),
  ];

  return points.sort((a, b) => a.distanceKm - b.distanceKm);
}
