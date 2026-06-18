"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BadgePercent,
  Check,
  CreditCard,
  MapPin,
  Package,
  Recycle,
  Search,
  Send,
  Store,
  Wrench,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { productUrl, type ShopTyre } from "@/lib/shop/catalog";
import {
  findCollectionPoints,
  type CollectionPoint,
} from "@/lib/shop/collection-points";

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

type Step = "locate" | "recycle" | "done";

export function TyreDetailModal({
  tyre,
  onClose,
}: {
  tyre: ShopTyre;
  onClose: () => void;
}) {
  const [address, setAddress] = useState("");
  const [searched, setSearched] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("locate");
  const [recycle, setRecycle] = useState(false);

  const points = useMemo(
    () => (searched ? findCollectionPoints(searched) : []),
    [searched]
  );
  const selected = points.find((p) => p.id === selectedId) ?? null;

  function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    const pts = findCollectionPoints(address);
    setSearched(address);
    setSelectedId(pts[0]?.id ?? null);
  }

  function finish(withRecycle: boolean) {
    setRecycle(withRecycle);
    setStep("done");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Commander le pneu MICHELIN ${tyre.name}`}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground backdrop-blur transition-colors hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        {/* En-tête produit */}
        <div className="flex items-center gap-4 border-b border-border p-5">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-michelin-blue-light/40">
            <Image
              src={tyre.image}
              alt={`MICHELIN ${tyre.name}`}
              fill
              sizes="80px"
              className="object-contain p-1.5"
            />
          </div>
          <div className="min-w-0 pr-8">
            <h2 className="font-heading text-lg leading-snug font-bold">
              MICHELIN {tyre.name}
            </h2>
            <a
              href={productUrl(tyre)}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-michelin-blue hover:underline"
            >
              Voir la fiche produit ↗
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {step === "locate" && (
            <LocateStep
              address={address}
              setAddress={setAddress}
              onSearch={runSearch}
              searched={Boolean(searched)}
              points={points}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}

          {step === "recycle" && selected && (
            <RecycleStep point={selected} onChoose={finish} />
          )}

          {step === "done" && selected && (
            <Confirmation tyre={tyre} point={selected} recycle={recycle} />
          )}
        </div>

        {/* Pied d'action */}
        {step === "locate" && searched && (
          <div className="border-t border-border p-4">
            <button
              type="button"
              disabled={!selected}
              onClick={() => setStep("recycle")}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-michelin-blue text-sm font-semibold text-white transition-colors hover:bg-michelin-blue/90 disabled:opacity-50"
            >
              Continuer
              {selected && ` · ${nf.format(selected.distanceKm)} km`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LocateStep({
  address,
  setAddress,
  onSearch,
  searched,
  points,
  selectedId,
  onSelect,
}: {
  address: string;
  setAddress: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  searched: boolean;
  points: CollectionPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <form onSubmit={onSearch}>
        <label htmlFor="mp-address" className="text-sm font-semibold">
          Votre adresse de retrait
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Nous cherchons les points de collecte les plus proches.
        </p>
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="mp-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="12 rue de la Paix, 75002 Paris"
              className="h-10 w-full rounded-lg border border-border bg-background pr-3 pl-9 text-sm outline-none focus:border-michelin-blue focus:ring-2 focus:ring-michelin-blue/20"
            />
          </div>
          <button
            type="submit"
            disabled={!address.trim()}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-michelin-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-michelin-blue/90 disabled:opacity-50"
          >
            <Search className="size-4" />
            Chercher
          </button>
        </div>
      </form>

      {searched && (
        <>
          <Section title="Points de vente MICHELIN" icon={Store}>
            {points
              .filter((p) => p.type === "michelin")
              .map((p) => (
                <PointRow
                  key={p.id}
                  point={p}
                  selected={selectedId === p.id}
                  onSelect={() => onSelect(p.id)}
                />
              ))}
          </Section>

          <Section title="Points relais" icon={Package}>
            {points
              .filter((p) => p.type === "relay")
              .map((p) => (
                <PointRow
                  key={p.id}
                  point={p}
                  selected={selectedId === p.id}
                  onSelect={() => onSelect(p.id)}
                />
              ))}
          </Section>
        </>
      )}
    </>
  );
}

function RecycleStep({
  point,
  onChoose,
}: {
  point: CollectionPoint;
  onChoose: (withRecycle: boolean) => void;
}) {
  const isRelay = point.type === "relay";
  const steps = [
    { icon: CreditCard, text: "Vous achetez vos pneus neufs (100 % du prix)." },
    { icon: Wrench, text: "Vous les recevez et les montez sur votre vélo." },
    {
      icon: Send,
      text: isRelay
        ? "Vous renvoyez vos anciens pneus via votre point relais."
        : "Vous rapportez vos anciens pneus en point de vente.",
    },
    {
      icon: BadgePercent,
      text: "Après réception, MICHELIN vous rembourse 5 % de votre achat.",
    },
  ];

  return (
    <div>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-michelin-green/15 text-michelin-green">
        <Recycle className="size-6" />
      </span>
      <h3 className="mt-3 font-heading text-lg font-bold">
        Recyclez vos anciens pneus
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Donnez une seconde vie à vos pneus usagés et profitez de{" "}
        <strong className="text-michelin-green">5 % remboursés</strong> sur cet
        achat.
      </p>

      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-michelin-blue-light text-michelin-blue">
              <s.icon className="size-4" />
            </span>
            <span className="pt-1.5 text-sm">{s.text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onChoose(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-michelin-green text-sm font-semibold text-white transition-colors hover:bg-michelin-green/90"
        >
          <Recycle className="size-4" />
          Oui, je recycle (−5 %)
        </button>
        <button
          type="button"
          onClick={() => onChoose(false)}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-muted"
        >
          Non merci
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
        <Icon className="size-4 text-michelin-blue" />
        {title}
      </h3>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

function PointRow({
  point,
  selected,
  onSelect,
}: {
  point: CollectionPoint;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
        selected
          ? "border-michelin-blue bg-michelin-blue-light/40"
          : "border-border hover:bg-muted"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-michelin-blue bg-michelin-blue" : "border-muted-foreground/40"
        )}
      >
        {selected && <span className="size-1.5 rounded-full bg-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{point.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {point.address}
        </span>
        <span className="block text-xs text-muted-foreground">{point.hours}</span>
      </span>
      <span className="shrink-0 text-xs font-semibold text-michelin-blue">
        {nf.format(point.distanceKm)} km
      </span>
    </button>
  );
}

function Confirmation({
  tyre,
  point,
  recycle,
}: {
  tyre: ShopTyre;
  point: CollectionPoint;
  recycle: boolean;
}) {
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-michelin-green/15 text-michelin-green">
        <Check className="size-7" />
      </span>
      <h3 className="mt-4 font-heading text-lg font-bold">Commande confirmée</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Votre pneu MICHELIN {tyre.name} vous attendra ici :
      </p>
      <div className="mt-4 rounded-xl border border-border p-4 text-left text-sm">
        <p className="font-semibold">{point.name}</p>
        <p className="text-muted-foreground">{point.address}</p>
        <p className="text-muted-foreground">{point.hours}</p>
        <p className="mt-1 text-xs font-semibold text-michelin-blue">
          à {nf.format(point.distanceKm)} km
        </p>
      </div>
      {recycle && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-michelin-green/10 p-3 text-left text-sm">
          <Recycle className="mt-0.5 size-4 shrink-0 text-michelin-green" />
          <span className="text-muted-foreground">
            Recyclage activé · une étiquette de retour vous sera fournie. MICHELIN
            vous remboursera{" "}
            <strong className="text-michelin-green">5 %</strong> après réception
            de vos anciens pneus.
          </span>
        </div>
      )}
    </div>
  );
}
