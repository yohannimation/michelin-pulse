import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bike,
  History,
  Mountain,
  Scan,
  TrendingDown,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { readSession } from "@/lib/session";
import { getMonthlyCyclingStats, type CyclingStats } from "@/lib/strava";

/** Anneau de progression circulaire pour le pourcentage d'usure du pneu. */
function TireGauge({ percent }: { percent: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative flex size-28 shrink-0 items-center justify-center">
      <svg viewBox="0 0 112 112" className="size-28 -rotate-90">
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="rgba(39,80,155,0.45)"
          strokeWidth="8"
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="var(--color-michelin-yellow)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-heading text-3xl font-bold text-white">
          {percent}
        </span>
        <span className="text-[11px] text-white/70">%</span>
      </div>
    </div>
  );
}

function TrendBadge({ percent }: { percent: number }) {
  const isPositive = percent >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold",
        isPositive
          ? "bg-michelin-green/10 text-michelin-green"
          : "bg-michelin-danger/10 text-michelin-danger"
      )}
    >
      <Icon className="size-3" />
      {Math.abs(Math.round(percent))}%
    </span>
  );
}

const STAT_ROWS: {
  key: keyof CyclingStats;
  label: string;
  icon: LucideIcon;
  format: (stats: CyclingStats) => string;
}[] = [
  {
    key: "distanceKm",
    label: "Distance",
    icon: Bike,
    format: (s) => `${Math.round(s.distanceKm)} km`,
  },
  {
    key: "avgSpeedKmh",
    label: "Vitesse moyenne",
    icon: Zap,
    format: (s) => `${s.avgSpeedKmh.toFixed(1)} km/h`,
  },
  {
    key: "elevationGainM",
    label: "Dénivelé",
    icon: Mountain,
    format: (s) => `${Math.round(s.elevationGainM)} m`,
  },
];

export default async function Dashboard() {
  const session = await readSession();
  const athlete = session?.athlete;
  const firstName = athlete?.firstname ?? "Alex";
  const initials = `${athlete?.firstname?.[0] ?? "A"}${
    athlete?.lastname?.[0] ?? "L"
  }`.toUpperCase();

  // Le token peut avoir expiré (pas de refresh en Server Component) : on
  // dégrade silencieusement plutôt que de casser la page.
  const stats = session
    ? await getMonthlyCyclingStats(session.accessToken).catch(() => null)
    : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pt-4 pb-6 md:px-6 md:pt-8">
      {/* Barre du haut mobile — le desktop a déjà son propre header (SiteHeader). */}
      <div className="flex items-center justify-between md:hidden">
        <Image
          src="/michelin-18.svg"
          alt="Michelin"
          width={120}
          height={40}
          className="h-7 w-auto"
          unoptimized
          priority
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"
          >
            <Bell className="size-4" />
          </button>
          {athlete?.profile ? (
            <Image
              src={athlete.profile}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-1 ring-foreground/10"
              unoptimized
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-full bg-michelin-blue text-sm font-semibold text-white">
              {initials}
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Bonjour {firstName}</p>
        <h1 className="text-3xl uppercase">État de vos pneus</h1>
      </div>

      {/* Carte d'état du pneu actif — fond Midnight Blue (charte : "fonds immersifs"). */}
      <div className="flex items-center gap-4 rounded-2xl bg-michelin-midnight p-5 text-white">
        <TireGauge percent={73} />
        <div className="flex flex-1 flex-col gap-2">
          <p className="font-heading text-lg font-bold uppercase">
            Power Cup · 700×28c
          </p>
          <p className="text-sm text-white/70">
            Bon état — usure normale. Reste ≈ 1 400 km estimés.
          </p>
          <span className="inline-flex w-fit items-center rounded-full bg-michelin-yellow px-3 py-1 text-xs font-semibold text-michelin-midnight">
            Surveiller dans 3 sorties
          </span>
        </div>
      </div>

      {/* Statistiques du dernier mois — une ligne pleine largeur par stat. */}
      <div className="flex flex-col gap-3">
        {stats ? (
          STAT_ROWS.map(({ key, label, icon: Icon, format }) => {
            const trendPercent = stats.trend[key];
            return (
              <Card key={key} className="flex-row items-center gap-3 px-4 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-michelin-blue-light">
                  <Icon className="size-5 text-michelin-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-bold">{format(stats)}</p>
                </div>
                {trendPercent !== undefined && <TrendBadge percent={trendPercent} />}
              </Card>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">Statistiques indisponibles.</p>
        )}
      </div>

      {/* Actions principales — bouton Principal Groupe + Tertiaire (charte digitale, composants/bouton d'action). */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          size="lg"
          className="h-12 gap-2 rounded-xl bg-michelin-blue text-white hover:bg-michelin-blue/90"
        >
          <Scan className="size-5" />
          Scanner
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 gap-2 rounded-xl border-michelin-blue text-michelin-blue hover:bg-michelin-blue/5"
        >
          <Link href="/shop/history">
            <History className="size-5" />
            Historique
          </Link>
        </Button>
      </div>
    </div>
  );
}
