// Catalogue boutique MICHELIN Vélo.
// 55 pneus extraits du catalogue michelin.fr/bicycle/browse-tyres (6 pages).
// Module PUR (pas de next/headers) : importable côté client comme serveur.
//
// NB photos : `image` pointe vers le CDN MICHELIN. Les visuels seront intégrés
// dans un second temps ; l'UI affiche un placeholder en attendant.

export type TyreGamme = "Competition" | "Performance" | "Racing" | "Access";

/** Famille de vélo, pour le suggesteur (cf. configurateur michelin.fr). */
export type BikeFamily =
  | "Route"
  | "Gravel"
  | "VTT"
  | "BMX"
  | "Électrique"
  | "Ville & Rando"
  | "Enfant";

export type ShopTyre = {
  /** Identifiant = dernier segment de l'URL produit michelin.fr. */
  slug: string;
  /** Nom commercial, sans la marque (ex. « Power Cup Competition Line »). */
  name: string;
  /** URL CDN MICHELIN du visuel principal (non câblé pour l'instant). */
  image: string;
  /** Badges d'usage MICHELIN (ex. « RACING », « E-ENDURO »). */
  categories: string[];
  /** Mis en avant comme nouveauté sur michelin.fr. */
  isNew: boolean;
  /** Niveau de gamme, déduit du suffixe « …-line » (null si absent). */
  gamme: TyreGamme | null;
  /** Accroche marketing. */
  claim: string;
};

export const SHOP_CATALOG: ShopTyre[] = [
  {
    slug: "michelin-power-cup-competition-line",
    name: "Power Cup Competition Line",
    image: "/tyres/michelinPowerCupCompetitionLine.webp",
    categories: ["RACING"],
    isNew: false,
    gamme: "Competition",
    claim: "Boostez votre confiance avec le pneu MICHELIN Power Cup pour la compétition et l’entraînement",
  },
  {
    slug: "michelin-pro5-tlr-competition-line",
    name: "Pro5 TLR Competition Line",
    image: "/tyres/michelinPro5TLRCompetitionLine.webp",
    categories: ["ENDURANCE", "E-ROAD"],
    isNew: false,
    gamme: "Competition",
    claim: "Prêt à aller plus loin en répondant à tous vos besoins",
  },
  {
    slug: "michelin-lithion-4-performance-line",
    name: "Lithion 4 Performance Line",
    image: "/tyres/MichelinLithion4PerformanceLine.webp",
    categories: ["ENDURANCE", "E-ROAD"],
    isNew: false,
    gamme: "Performance",
    claim: "Rouler avec facilité et tranquillité d' esprit",
  },
  {
    slug: "michelin-city-cargo-competition-line",
    name: "City Cargo Competition Line",
    image: "/tyres/MichelinCityCargoCompetitionLine.webp",
    categories: ["CARGO", "URBAN", "E-CARGO", "E-CITY"],
    isNew: true,
    gamme: "Competition",
    claim: "Le pneu de ville polyvalent pour les charges lourdes et les terrains urbains.",
  },
  {
    slug: "michelin-city-touring-competition-line-fb",
    name: "City Touring Competition Line (Foldable Bead)",
    image: "/tyres/MichelinCityTouringCompetitionLine.webp",
    categories: ["TOURING", "E-TOURING", "E-CITY", "SPEEDELEC"],
    isNew: true,
    gamme: null,
    claim: "Un pneu sur lequel vous pouvez compter",
  },
  {
    slug: "michelin-e-wild-rear-racing-line",
    name: "E-Wild Rear Racing Line",
    image: "/tyres/MichelinE-WildRearRacingLine.webp",
    categories: ["E-ENDURO"],
    isNew: false,
    gamme: "Racing",
    claim: "Adhérence maximale pour les randonnées de e-vtt les plus extrêmes",
  },
  {
    slug: "michelin-country-a-t-access-line",
    name: "Country A.T. Access Line",
    image: "/tyres/MichelinCountryATAccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Pneu polyvalent qui convient à la plupart des conditions de conduite.",
  },
  {
    slug: "michelin-power-protection-tlr-competition-line",
    name: "Power Protection TLR Competition Line",
    image: "/tyres/MichelinPowerProtectionTLRCompetitionLine.webp",
    categories: ["ENDURANCE", "ALL ROAD", "E-ROAD"],
    isNew: false,
    gamme: "Competition",
    claim: "Surmontez les conditions routières difficiles tout au long de l’année",
  },
  {
    slug: "michelin-pro5-competition-line",
    name: "Pro5 Competition Line",
    image: "/tyres/MichelinPro5CompetitionLine.webp",
    categories: ["ENDURANCE"],
    isNew: true,
    gamme: "Competition",
    claim: "Prêt à aller plus loin en répondant à tous vos besoins.",
  },
  {
    slug: "michelin-dynamic-sport-access-line",
    name: "Dynamic Sport Access Line",
    image: "/tyres/MichelinDynamicSportAccessLine.webp",
    categories: ["LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Robuste, léger et endurant",
  },
  {
    slug: "michelin-protek-cross-access-line",
    name: "Protek Cross Access Line",
    image: "/tyres/MichelinProtekCrossAccessLine.webp",
    categories: ["TREKKING"],
    isNew: false,
    gamme: "Access",
    claim: "Explorez tous les chemins en toutes circonstances",
  },
  {
    slug: "michelin-city-touring-performance-line",
    name: "City Touring Performance Line",
    image: "/tyres/MichelinCityTouringPerformanceLine.webp",
    categories: ["TOURING", "E-CITY", "E-TOURING"],
    isNew: true,
    gamme: "Performance",
    claim: "Un pneu sur lequel vous pouvez compter",
  },
  {
    slug: "michelin-dh-mud-racing-line",
    name: "DH Mud Racing Line",
    image: "/tyres/MichelinDHMudRacingLine.webp",
    categories: ["DOWNHILL", "ENDURO", "E-ENDURO"],
    isNew: false,
    gamme: "Racing",
    claim: "Le pneu Downhill conçu pour les descentes boueuses",
  },
  {
    slug: "michelin-pilot-sx-racing-line",
    name: "Pilot SX Racing Line",
    image: "/tyres/MichelinPilotSXRacingLine.webp",
    categories: ["BMX RACING"],
    isNew: false,
    gamme: "Racing",
    claim: "La gamme sans compromis pour gagner en BMX Race",
  },
  {
    slug: "michelin-force-xc2-racing-line",
    name: "Force XC2 Racing Line",
    image: "/tyres/MichelinForceXC2RacingLine.webp",
    categories: ["CROSS COUNTRY", "E-CROSS COUNTRY"],
    isNew: false,
    gamme: "Racing",
    claim: "Le pneu course, nouvelle génération MICHELIN XC assure stabilité, vitesse et maniabilité, quelles que soient les conditions",
  },
  {
    slug: "michelin-jet-xc2-racing-line",
    name: "Jet XC2 Racing Line",
    image: "/tyres/MichelinJetXC2RacingLine.webp",
    categories: ["CROSS COUNTRY", "E-CROSS COUNTRY"],
    isNew: false,
    gamme: "Racing",
    claim: "Le pneu MICHELIN XC Race de nouvelle génération qui booste votre vitesse et vos accélérations",
  },
  {
    slug: "michelin-pilot-pump-competition-line",
    name: "Pilot Pump Competition Line",
    image: "/tyres/MichelinPilotPumpCompetitionLine.webp",
    categories: ["FREESTYLE"],
    isNew: false,
    gamme: "Competition",
    claim: "Un grip optimisé, notamment sur les pumptracks bitumés et en skate parks",
  },
  {
    slug: "michelin-e-wild-rear-performance-line",
    name: "E-Wild Rear Performance Line",
    image: "/tyres/MichelinEWildRearPerformanceLine.webp",
    categories: ["E-ALL MOUNTAIN", "E-CROSS COUNTRY", "E-ENDURO"],
    isNew: true,
    gamme: "Performance",
    claim: "Un pneu arrière durable pour VTT électrique, pour encore plus de plaisir sur les sentiers.",
  },
  {
    slug: "michelin-wild-enduro-ms-performance-line",
    name: "Wild Enduro MS Performance Line",
    image: "/tyres/MichelinWildEnduroMSPerformanceLine.webp",
    categories: ["ENDURO", "E-ENDURO"],
    isNew: true,
    gamme: "Performance",
    claim: "Profitez pleinement de chaque sortie enduro.",
  },
  {
    slug: "michelin-force-xc2-performance-line",
    name: "Force XC2 Performance Line",
    image: "/tyres/MichelinForceXC2PerformanceLine.webp",
    categories: ["CROSS COUNTRY", "E-CROSS COUNTRY"],
    isNew: false,
    gamme: "Performance",
    claim: "Le pneu MICHELIN de la gamme cross-country pour toutes les conditions",
  },
  {
    slug: "michelin-dh34-bike-park-performance-line",
    name: "DH34 Bike Park Performance Line",
    image: "/tyres/MichelinDH34BikeParkPerformanceLine.webp",
    categories: ["DOWNHILL", "ENDURO", "E-ENDURO"],
    isNew: false,
    gamme: "Performance",
    claim: "Notre meilleur pneu MICHELIN DH pour les pistes de Bike Park",
  },
  {
    slug: "michelin-country-rock-access-line",
    name: "Country Rock Access Line",
    image: "/tyres/MichelinCountryRockAccessLine.webp",
    categories: ["TREKKING"],
    isNew: false,
    gamme: "Access",
    claim: "Le pneu le + roulant de la gamme Country pour un usage urbain ou entraînement",
  },
  {
    slug: "michelin-power-time-trial-racing-line",
    name: "Power Time Trial Racing Line",
    image: "/tyres/MichelinPowerTimeTrialRacingLine.webp",
    categories: ["RACING"],
    isNew: false,
    gamme: "Racing",
    claim: "Battez vos records de temps en contre-la-montre",
  },
  {
    slug: "michelin-protek-max-performance-line",
    name: "Protek Max Performance Line",
    image: "/tyres/MichelinProtekMaxPerformanceLine.webp",
    categories: ["TOURING"],
    isNew: false,
    gamme: "Performance",
    claim: "Sortez sur asphalte et sur piste avec un pneu plus renforcé et polyvalent",
  },
  {
    slug: "michelin-worldtour-access-line",
    name: "WorldTour Access Line",
    image: "/tyres/MichelinWorldTourAccessLine.webp",
    categories: ["TOURING"],
    isNew: false,
    gamme: "Access",
    claim: "Le plus classique de nos pneus city",
  },
  {
    slug: "michelin-wild-enduro-mh-racing-line",
    name: "Wild Enduro MH Racing Line",
    image: "/tyres/MichelinWildEnduroMHRacingLine.webp",
    categories: ["ENDURO", "E-ENDURO"],
    isNew: false,
    gamme: "Racing",
    claim: "Adhérence et fiabilité optimales pour gagner des courses",
  },
  {
    slug: "michelin-wild-enduro-ms-racing-line",
    name: "Wild Enduro MS Racing Line",
    image: "/tyres/MichelinWildEnduroMSRacingLine.webp",
    categories: ["ENDURO", "E-ENDURO"],
    isNew: false,
    gamme: "Racing",
    claim: "Adhérence et fiabilité optimales pour gagner des courses",
  },
  {
    slug: "michelin-dynamic-classic-access-line",
    name: "Dynamic Classic Access Line",
    image: "/tyres/MichelinDynamicClassicAccessLine.webp",
    categories: ["LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Style et kilomètres pour vos sorties vélo",
  },
  {
    slug: "michelin-country-j-access-line",
    name: "Country J Access Line",
    image: "/tyres/MichelinCountryJAccessLine.webp",
    categories: ["KIDS"],
    isNew: false,
    gamme: "Access",
    claim: "Comme les pros, je roule en Michelin et en toute sécurité",
  },
  {
    slug: "michelin-dh22-racing-line-foldable-bead",
    name: "DH22 Racing Line (Foldable Bead)",
    image: "/tyres/MichelinDH22RacingLineFoldableBead.webp",
    categories: ["DOWNHILL", "ENDURO", "E-ENDURO"],
    isNew: false,
    gamme: null,
    claim: "Choisissez une ligne et gagnez",
  },
  {
    slug: "michelin-pilot-sx-slick-racing-line",
    name: "Pilot SX Slick Racing Line",
    image: "/tyres/MichelinPilotSXSlickRacingLine.webp",
    categories: ["BMX RACING"],
    isNew: false,
    gamme: "Racing",
    claim: "La gamme sans compromis pour gagner en BMX Race",
  },
  {
    slug: "michelin-pilot-sx-racing-line-foldable-bead",
    name: "Pilot SX Racing Line (Foldable Bead)",
    image: "/tyres/MichelinPilotSXRacingLineFoldableBead.webp",
    categories: ["BMX RACING"],
    isNew: false,
    gamme: null,
    claim: "La gamme sans compromis pour gagner en BMX Race",
  },
  {
    slug: "michelin-pilot-freestyle-racing-line",
    name: "Pilot FreeStyle Racing Line",
    image: "/tyres/MichelinPilotFreestyleRacingLine.webp",
    categories: ["BMX FREESTYLE"],
    isNew: false,
    gamme: "Racing",
    claim: "Faites confiance à vos pneus pour envoyer !",
  },
  {
    slug: "michelin-wild-xc-racing-line",
    name: "Wild XC Racing Line",
    image: "/tyres/MichelinWildXCRacingLine.webp",
    categories: ["CROSS COUNTRY", "E-CROSS COUNTRY"],
    isNew: false,
    gamme: "Racing",
    claim: "Le pneu nouvelle génération, MICHELIN XC offre un maximum de grip sur les parcours qui sortent des sentiers battus",
  },
  {
    slug: "michelin-force-am2-competition-line",
    name: "Force AM2 Competition Line",
    image: "/tyres/MichelinForceAM2CompetitionLine.webp",
    categories: ["ALL MOUNTAIN/TRAIL", "E-ALL MOUNTAIN"],
    isNew: false,
    gamme: "Competition",
    claim: "Le pneu MICHELIN AM/TRAIL le plus rapide pour les terrains durs",
  },
  {
    slug: "michelin-wild-am2-competition-line",
    name: "Wild AM2 Competition Line",
    image: "/tyres/WildAM2CompetitionLine.webp",
    categories: ["ALL MOUNTAIN/TRAIL", "E-ALL MOUNTAIN", "E-CROSS COUNTRY"],
    isNew: false,
    gamme: "Competition",
    claim: "Du grip pour les terrains Mixed et soft",
  },
  {
    slug: "michelin-wild-enduro-mh-performance-line",
    name: "Wild Enduro MH Performance Line",
    image: "/tyres/MichelinWildEnduroMHPerformanceLine.webp",
    categories: ["ENDURO", "E-ENDURO"],
    isNew: true,
    gamme: "Performance",
    claim: "Profitez pleinement de chaque sortie enduro.",
  },
  {
    slug: "michelin-country-dry2-access-line",
    name: "Country Dry2 Access Line",
    image: "/tyres/MichelinCountryDry2AccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Profitez de vos sorties avec moins d’efforts sur les terrains secs et roulants",
  },
  {
    slug: "michelin-country-grip-r-access-line-foldable-bead",
    name: "Country Grip'R Access Line (Foldable Bead)",
    image: "/tyres/MichelinCountryGrip'RAccessLineMTB.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: null,
    claim: "Le + polyvalent des pneus VTT tringles souples pour un usage loisir sur tous les terrains",
  },
  {
    slug: "michelin-country-race-r-access-line",
    name: "Country Race'R Access Line",
    image: "/tyres/MichelinCountryRace'RAccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Pour un usage loisir sur les terrains secs et roulants avec un excellent équilibre grip/rendement",
  },
  {
    slug: "michelin-country-trail-access-line",
    name: "Country Trail Access Line",
    image: "/tyres/MichelinCountryTrailAccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Pour un usage loisir sur terrains Mixed",
  },
  {
    slug: "michelin-pilot-slope-competition-line",
    name: "Pilot Slope Competition Line",
    image: "/tyres/MichelinPilotSlopeCompetitionLine.webp",
    categories: ["FREESTYLE"],
    isNew: false,
    gamme: "Competition",
    claim: "Prenez de la hauteur et lâchez-vous avec le meilleur de nos pneus Freestyle",
  },
  {
    slug: "michelin-wild-enduro-rear-performance-line",
    name: "Wild Enduro Rear Performance Line",
    image: "/tyres/MichelinWildEnduroRearPerformanceLine.webp",
    categories: ["ENDURO", "E-ENDURO"],
    isNew: true,
    gamme: "Performance",
    claim: "Profitez pleinement de chaque sortie enduro.",
  },
  {
    slug: "michelin-force-am-performance-line",
    name: "Force AM Performance Line",
    image: "/tyres/MichelinForceAMPerformanceLine.webp",
    categories: ["ALL MOUNTAIN/TRAIL", "E-ALL MOUNTAIN"],
    isNew: false,
    gamme: "Performance",
    claim: "Le + agile des pneus AM pour un usage sportif",
  },
  {
    slug: "michelin-wild-am-performance-line",
    name: "Wild AM Performance Line",
    image: "/tyres/MichelinWildAMPerformanceLine.webp",
    categories: ["ALL MOUNTAIN/TRAIL", "E-ALL MOUNTAIN", "E-CROSS COUNTRY"],
    isNew: false,
    gamme: "Performance",
    claim: "+ de Grip pour un usage sportif et des sorties funs",
  },
  {
    slug: "michelin-force-access-line",
    name: "Force Access Line",
    image: "/tyres/MichelinForceAccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Le pneu de tous les jours offrant souplesse et rapidité sur les terrains durs",
  },
  {
    slug: "michelin-power-adventure-competition-line",
    name: "Power Adventure Competition Line",
    image: "/tyres/MichelinPowerAdventureCompetitionLine.webp",
    categories: ["SPEED", "TOURING", "E-GRAVEL"],
    isNew: false,
    gamme: "Competition",
    claim: "Soyez libres de vous aventurer hors des routes bitumées avec le MICHELIN Power Adventure",
  },
  {
    slug: "michelin-e-wild-front-racing-line",
    name: "E-Wild Front Racing Line",
    image: "/tyres/MichelinE-WildFrontRacingLine.webp",
    categories: ["E-ENDURO"],
    isNew: false,
    gamme: "Racing",
    claim: "Adhérence maximale pour les randonnées de e-vtt les plus extrêmes",
  },
  {
    slug: "michelin-e-wild-front-performance-line",
    name: "E-Wild Front Performance Line",
    image: "/tyres/MichelinE-WildFrontPerformanceLine.webp",
    categories: ["E-ALL MOUNTAIN", "E-CROSS COUNTRY", "E-ENDURO"],
    isNew: true,
    gamme: "Performance",
    claim: "Un pneu de VTT électrique durable pour plus de plaisir sur les sentiers.",
  },
  {
    slug: "michelin-wild-rock-r-performance-line",
    name: "Wild Rock'R Performance Line",
    image: "/tyres/MichelinWildRock'RPerformanceLine.webp",
    categories: ["CROSS COUNTRY"],
    isNew: false,
    gamme: "Performance",
    claim: "Grip et maîtrise du freinage impressionnants, même sur les terrains les plus extrêmes.",
  },
  {
    slug: "michelin-force-xc-performance-line",
    name: "Force XC Performance Line",
    image: "/tyres/MichelinForceXCPerformanceLine.webp",
    categories: ["CROSS COUNTRY"],
    isNew: false,
    gamme: "Performance",
    claim: "Le plus agile des pneus XC pour un usage sportif. Un profil similaire à la gamme compétition.",
  },
  {
    slug: "michelin-wild-xc-performance-line",
    name: "Wild XC Performance Line",
    image: "/tyres/MichelinWildXCPerformanceLine.webp",
    categories: ["CROSS COUNTRY", "E-CROSS COUNTRY"],
    isNew: false,
    gamme: "Performance",
    claim: "Le pneu MICHELIN de la gamme cross-country avec un grip qui booste la confiance",
  },
  {
    slug: "michelin-country-cross-access-line",
    name: "Country Cross Access Line",
    image: "/tyres/MichelinCountryCrossAccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Le pneu qui s'adapte aux conditions météorologiques sur tous les types de terrains",
  },
  {
    slug: "michelin-country-grip-r-access-line",
    name: "Country Grip'R Access Line",
    image: "/tyres/MichelinCountryGrip'RAccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Le + polyvalent des pneus VTT tringles rigides pour un usage loisir sur tous les terrains",
  },
  {
    slug: "michelin-wild-access-line",
    name: "Wild Access Line",
    image: "/tyres/WildAccessLine.webp",
    categories: ["MTB LEISURE"],
    isNew: false,
    gamme: "Access",
    claim: "Le pneu de tous les jours pour un grip parfait sur les terrains Soft et Mixed",
  },
];

/** Ordre d'affichage des familles dans le suggesteur. */
export const BIKE_FAMILIES: BikeFamily[] = [
  "Route",
  "Gravel",
  "VTT",
  "Électrique",
  "Ville & Rando",
  "BMX",
  "Enfant",
];

// Correspondance badge d'usage MICHELIN -> familles de vélo.
// Un badge « E-… » ajoute toujours la famille « Électrique » en plus de sa base.
const CATEGORY_FAMILIES: Record<string, BikeFamily[]> = {
  "RACING": ["Route"],
  "ENDURANCE": ["Route"],
  "ALL ROAD": ["Gravel"],
  "SPEED": ["Gravel"],
  "CARGO": ["Ville & Rando"],
  "URBAN": ["Ville & Rando"],
  "TOURING": ["Ville & Rando"],
  "TREKKING": ["Ville & Rando"],
  "LEISURE": ["Ville & Rando"],
  "SPEEDELEC": ["Ville & Rando", "Électrique"],
  "DOWNHILL": ["VTT"],
  "ENDURO": ["VTT"],
  "CROSS COUNTRY": ["VTT"],
  "ALL MOUNTAIN/TRAIL": ["VTT"],
  "MTB LEISURE": ["VTT"],
  "FREESTYLE": ["BMX"],
  "BMX RACING": ["BMX"],
  "BMX FREESTYLE": ["BMX"],
  "KIDS": ["Enfant"],
  "E-ROAD": ["Route", "Électrique"],
  "E-CITY": ["Ville & Rando", "Électrique"],
  "E-CARGO": ["Ville & Rando", "Électrique"],
  "E-TOURING": ["Ville & Rando", "Électrique"],
  "E-GRAVEL": ["Gravel", "Électrique"],
  "E-ENDURO": ["VTT", "Électrique"],
  "E-CROSS COUNTRY": ["VTT", "Électrique"],
  "E-ALL MOUNTAIN": ["VTT", "Électrique"],
};

/** Familles de vélo couvertes par un pneu, déduites de ses badges d'usage. */
export function familiesOf(tyre: ShopTyre): BikeFamily[] {
  const set = new Set<BikeFamily>();
  for (const cat of tyre.categories) {
    for (const fam of CATEGORY_FAMILIES[cat] ?? []) set.add(fam);
  }
  return BIKE_FAMILIES.filter((f) => set.has(f));
}

/** URL de la fiche produit sur michelin.fr. */
export function productUrl(tyre: ShopTyre): string {
  return `https://www.michelin.fr/bicycle/tyres/${tyre.slug}`;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Prix de base par niveau de gamme (€). Simulé : MICHELIN ne publie pas de
// tarif sur ce catalogue, on en dérive un déterministe pour le tunnel d'achat.
const GAMME_BASE_PRICE: Record<TyreGamme, number> = {
  Racing: 59.9,
  Competition: 49.9,
  Performance: 39.9,
  Access: 24.9,
};

/** Prix unitaire simulé d'un pneu, en euros (déterministe). */
export function priceOf(tyre: ShopTyre): number {
  const base = tyre.gamme ? GAMME_BASE_PRICE[tyre.gamme] : 34.9;
  return base + (hash(tyre.slug) % 5) * 5;
}

/** Formate un montant en euros (ex. « 54,90 € »). */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/** 3 pneus mis en avant en tête de boutique. */
export const FEATURED_SLUGS = [
  "michelin-power-cup-competition-line",
  "michelin-pro5-competition-line",
  "michelin-lithion-4-performance-line",
];
