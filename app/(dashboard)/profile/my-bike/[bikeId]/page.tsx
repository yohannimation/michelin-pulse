import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft2, InfoCircle, Scan } from "iconsax-react";

import { StatusBadge, WearGauge } from "@/components/garage-ui";
import { bikeStatus, getGarageBike, wearTone, type Tyre } from "@/lib/garage";
import { unregisterTyre } from "./actions";

export default async function BikeDetail({
  params,
}: {
  params: Promise<{ bikeId: string }>;
}) {
  const { bikeId } = await params;
  const bike = await getGarageBike(bikeId);
  if (!bike) notFound();

  const status = bikeStatus(bike);
  const subtitle = [
    bike.type,
    bike.size,
    bike.weight ? `${bike.weight.toLocaleString("fr-FR")} kg` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const front = bike.tyres.find((t) => t.position === "AVANT");
  const rear = bike.tyres.find((t) => t.position === "ARRIÈRE");
  const rearWearsFaster = front && rear && rear.wearPct > front.wearPct + 10;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-6 md:px-8 md:py-10">
      {/* En‑tête */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile/my-bike"
          aria-label="Retour au garage"
          className="-ml-1 flex size-9 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft2 size={24} color="currentColor" />
        </Link>
        <div
          className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground"
          aria-hidden
        >
          <InfoCircle size={20} color="currentColor" />
        </div>
      </div>

      {/* Photo */}
      <div
        className="mt-4 flex aspect-[16/9] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 9px, rgba(0,0,0,0.035) 9px, rgba(0,0,0,0.035) 10px)",
        }}
        aria-hidden
      >
        photo · {bike.name}
      </div>

      {/* Titre */}
      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold break-words md:text-3xl">{bike.name}</h1>
          {subtitle && (
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <StatusBadge label={status.label} tone={status.tone} className="mt-1" />
      </div>

      {bike.tyres.length === 0 ? (
        <NoTyres bikeId={bike.id} bikeKm={bike.stravaKm} />
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bike.tyres.map((t) => (
              <TyreCard key={t.position} tyre={t} bikeId={bike.id} />
            ))}
          </div>

          {rearWearsFaster && (
            <div
              className="mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
              style={{ backgroundColor: "#FEF6E0", color: "#7A6516" }}
            >
              <InfoCircle size={18} color="currentColor" className="mt-0.5 shrink-0" />
              <p>
                Le pneu arrière s&apos;use plus vite. Pensez à permuter
                avant/arrière pour équilibrer l&apos;usure.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TyreCard({ tyre, bikeId }: { tyre: Tyre; bikeId: string }) {
  const tone = wearTone(tyre.wearPct);
  const label = tyre.position === "AVANT" ? "PNEU AVANT" : "PNEU ARRIÈRE";
  const tyreStatus =
    tone === "replace" ? "À changer" : tone === "watch" ? "À surveiller" : "Bon état";

  return (
    <div className="rounded-2xl p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-4">
        <WearGauge pct={tyre.wearPct} tone={tone} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
              {label}
            </span>
            <StatusBadge label={tyreStatus} tone={tone} />
          </div>
          <p className="mt-1 font-bold leading-tight break-words">{tyre.model}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Km parcourus</p>
              <p className="font-semibold">{tyre.km.toLocaleString("fr-FR")} km</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vie restante</p>
              <p className="font-semibold" style={{ color: "#16A34A" }}>
                ≈ {tyre.remainingKm.toLocaleString("fr-FR")} km
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/profile/my-bike/${bikeId}/add?position=${encodeURIComponent(tyre.position)}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          <Scan size={18} color="currentColor" />
          Re-scanner
        </Link>
        <form action={unregisterTyre}>
          <input type="hidden" name="bikeId" value={bikeId} />
          <input type="hidden" name="position" value={tyre.position} />
          <button
            type="submit"
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            Retirer
          </button>
        </form>
      </div>
    </div>
  );
}

function NoTyres({ bikeId, bikeKm }: { bikeId: string; bikeKm: number }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
      <p className="font-semibold">Aucun pneu MICHELIN enregistré</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Ce vélo cumule {bikeKm.toLocaleString("fr-FR")} km sur Strava, mais aucun
        pneu MICHELIN n&apos;a encore été scanné — donc 0 km MICHELIN. Scannez
        vos pneus pour suivre leur usure et accumuler des km MICHELIN.
      </p>
      <Link
        href={`/profile/my-bike/${bikeId}/add`}
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        style={{ backgroundColor: "#27509B" }}
      >
        <Scan size={18} color="currentColor" />
        Scanner mes pneus
      </Link>
    </div>
  );
}
