// Données factices — à brancher sur l'API évènements une fois disponible.

export type PrincipleIcon = "user" | "shield" | "recycle" | "award";

export type CourseEvent = {
  variant: "course";
  id: string;
  badge: string;
  isRegistered?: boolean;
  title: string;
  editionLabel: string;
  date: string;
  location: string;
  distanceKm: number;
  photoUrl?: string;
  description: string;
  priceLabel: string;
  principle: { icon: PrincipleIcon; text: string }[];
  recycledNote: string;
};

export type LeaderboardEntry = {
  rank: number;
  initials: string;
  name: string;
  km: number;
  isMe?: boolean;
};

export type ConcoursEvent = {
  variant: "concours";
  id: string;
  badge: string;
  isRegistered?: boolean;
  title: string;
  period: string;
  participantsLabel: string;
  description: string;
  reward: {
    daysLeftLabel: string;
    text: string;
  };
  progress: {
    label: string;
    valueKm: number;
  };
  leaderboard: LeaderboardEntry[];
};

export type MichelinEvent = CourseEvent | ConcoursEvent;

export const EVENTS: MichelinEvent[] = [
  {
    variant: "course",
    id: "granfondo-lyon",
    badge: "Évènement privé",
    title: "Granfondo Lyon",
    editionLabel: "Édition MICHELIN",
    date: "28 juin",
    location: "Lyon",
    distanceKm: 120,
    photoUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop",
    description:
      "Pneus fournis par MICHELIN, rendus en fin de course pour recyclage.",
    priceLabel: "45 €",
    principle: [
      { icon: "user", text: "Les coureurs payent leur entrée (45 €)" },
      { icon: "shield", text: "MICHELIN fournit les pneus de course" },
      {
        icon: "recycle",
        text: "En fin de course, les pneus sont rendus pour recyclage",
      },
      {
        icon: "award",
        text: "Découvrez la performance de nos pneus en conditions réelles",
      },
    ],
    recycledNote:
      "Les pneus rendus repartent dans la filière de recyclage MICHELIN.",
  },
  {
    variant: "course",
    id: "etape-pyrenees",
    badge: "Course",
    isRegistered: true,
    title: "Étape Pyrénées",
    editionLabel: "Cyclo MICHELIN",
    date: "12 juillet",
    location: "Tarbes",
    distanceKm: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80&auto=format&fit=crop",
    description:
      "Ascension chronométrée, ravitaillement MICHELIN à chaque col.",
    priceLabel: "60 €",
    principle: [
      { icon: "user", text: "Votre inscription est réglée (60 €)" },
      { icon: "shield", text: "MICHELIN fournit les pneus de course" },
      {
        icon: "recycle",
        text: "En fin d'étape, les pneus sont rendus pour recyclage",
      },
      {
        icon: "award",
        text: "Suivez votre classement en temps réel sur l'appli",
      },
    ],
    recycledNote:
      "Les pneus rendus repartent dans la filière de recyclage MICHELIN.",
  },
  {
    variant: "concours",
    id: "defi-km-route-du-tour",
    badge: "Concours",
    isRegistered: true,
    title: "Défi km · Route du Tour",
    period: "Juin · 1 mois",
    participantsLabel: "2 480 inscrits",
    description:
      "Roulez le plus de km du mois. Le top 3 monte sur le podium MICHELIN.",
    reward: {
      daysLeftLabel: "9 jours restants",
      text: "Le top 3 monte dans la voiture officielle MICHELIN au Tour de France",
    },
    progress: {
      label: "Vos km ce mois",
      valueKm: 1204,
    },
    leaderboard: [
      { rank: 1, initials: "CR", name: "Camille R.", km: 1842 },
      { rank: 2, initials: "TB", name: "Thomas B.", km: 1790 },
      { rank: 3, initials: "IM", name: "Inès M.", km: 1655 },
      { rank: 12, initials: "V·", name: "Vous · Alex", km: 1204, isMe: true },
    ],
  },
];

export function getEventById(id: string): MichelinEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}
