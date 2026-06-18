import Link from "next/link";
import { ArrowLeft2, Add } from "iconsax-react";

import { BikeThumb, StatusBadge, WearColumn } from "@/components/garage-ui";
import { bikeStatus, getGarage, wearTone, type GarageBike } from "@/lib/garage";

export default async function MyGarage() {
  const bikes = await getGarage();

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6 md:px-8 md:py-10">
      {/* En‑tête */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            aria-label="Retour au profil"
            className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-muted"
          >
            <ArrowLeft2 size={24} color="currentColor" />
          </Link>
          <h1 className="text-xl font-bold whitespace-nowrap md:text-3xl">
            Mon Garage
          </h1>
        </div>
        <Link
          href="/analysis/scan"
          aria-label="Ajouter un vélo"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-michelin-blue px-3 py-2.5 text-sm font-semibold text-white sm:px-4"
        >
          <Add size={20} color="currentColor" />
          <span className="hidden sm:inline">Vélo</span>
        </Link>
      </div>

      <p className="mt-4 max-w-prose text-muted-foreground">
        Vos vélos et l&apos;usure de chaque pneu MICHELIN, suivie via vos scans
        et vos km Strava.
      </p>

      {bikes.length === 0 ? (
        <EmptyGarage />
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {bikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      )}
    </div>
  );
}

function BikeCard({ bike }: { bike: GarageBike }) {
  const status = bikeStatus(bike);
  const subtitle = [bike.type, bike.size].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/profile/my-bike/${bike.id}`}
      className="block rounded-2xl p-4 ring-1 ring-foreground/10 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start gap-4">
        <BikeThumb className="size-[72px] shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-bold leading-tight break-words">{bike.name}</h2>
            <StatusBadge label={status.label} tone={status.tone} />
          </div>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
          <p className="mt-0.5 text-sm text-muted-foreground">
            {bike.michelinKm} km MICHELIN ·{" "}
            {bike.stravaKm.toLocaleString("fr-FR")} km Strava
          </p>
        </div>
      </div>

      {bike.tyres.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
          {bike.tyres.map((t) => (
            <WearColumn
              key={t.position}
              position={t.position}
              pct={t.wearPct}
              tone={wearTone(t.wearPct)}
              model={t.model}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Aucun pneu MICHELIN scanné — touchez pour scanner et suivre
          l&apos;usure.
        </div>
      )}
    </Link>
  );
}

function EmptyGarage() {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      <p className="font-semibold">Aucun vélo importé</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Reconnectez Strava pour autoriser l&apos;accès à votre garage, ou
        ajoutez un vélo manuellement.
      </p>
      <Link
        href="/api/auth/strava"
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        style={{ backgroundColor: "#FC4C02" }}
      >
        Reconnecter Strava
      </Link>
    </div>
  );
}
