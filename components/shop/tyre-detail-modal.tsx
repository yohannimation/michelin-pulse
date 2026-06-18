"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  BadgePercent,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Package,
  Plus,
  Recycle,
  Search,
  Send,
  Store,
  Wrench,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatPrice,
  priceOf,
  productUrl,
  type ShopTyre,
} from "@/lib/shop/catalog";
import {
  findCollectionPoints,
  type CollectionPoint,
} from "@/lib/shop/collection-points";

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const MAX_QTY = 4;
const round2 = (n: number) => Math.round(n * 100) / 100;

type Step = "locate" | "recycle" | "pay" | "done";

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
  const [buyQty, setBuyQty] = useState(1);
  const [recycleQty, setRecycleQty] = useState(0);

  const unitPrice = priceOf(tyre);
  const subtotal = round2(unitPrice * buyQty);
  const refund = round2(unitPrice * 0.05 * recycleQty);

  const points = useMemo(
    () => (searched ? findCollectionPoints(searched) : []),
    [searched]
  );
  const selected = points.find((p) => p.id === selectedId) ?? null;

  function setQty(n: number) {
    const q = Math.max(1, Math.min(MAX_QTY, n));
    setBuyQty(q);
    setRecycleQty((r) => Math.min(r, q)); // on ne recycle jamais plus qu'on achète
  }

  function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    const pts = findCollectionPoints(address);
    setSearched(address);
    setSelectedId(pts[0]?.id ?? null);
  }

  if (typeof document === "undefined") return null;

  // Portail vers <body> : la modale échappe à tout conteneur (overflow,
  // transform…) et reste strictement dans le viewport.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-x-hidden bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Commander le pneu MICHELIN ${tyre.name}`}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg min-w-0 flex-col overflow-hidden rounded-t-3xl bg-card shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground backdrop-blur transition-colors hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        {/* En-tête produit */}
        <div className="flex items-center gap-3 border-b border-border p-4 pr-12 sm:gap-4 sm:p-5">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-michelin-blue-light/40 sm:size-20">
            <Image
              src={tyre.image}
              alt={`MICHELIN ${tyre.name}`}
              fill
              sizes="80px"
              className="object-contain p-1.5"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading text-base leading-snug font-bold sm:text-lg">
              MICHELIN {tyre.name}
            </h2>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="font-heading text-base font-bold text-michelin-blue">
                {formatPrice(unitPrice)}
              </span>
              <a
                href={productUrl(tyre)}
                target="_blank"
                rel="noreferrer"
                className="truncate text-xs font-medium text-michelin-blue hover:underline"
              >
                Fiche produit ↗
              </a>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {step === "locate" && (
            <LocateStep
              qty={buyQty}
              onQty={setQty}
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
            <RecycleStep
              point={selected}
              buyQty={buyQty}
              recycleQty={recycleQty}
              onRecycleQty={setRecycleQty}
              unitPrice={unitPrice}
              refund={refund}
            />
          )}

          {step === "pay" && selected && (
            <PayStep
              tyre={tyre}
              buyQty={buyQty}
              subtotal={subtotal}
              point={selected}
              recycleQty={recycleQty}
              refund={refund}
            />
          )}

          {step === "done" && selected && (
            <Confirmation
              tyre={tyre}
              buyQty={buyQty}
              subtotal={subtotal}
              point={selected}
              recycleQty={recycleQty}
              refund={refund}
            />
          )}
        </div>

        {/* Pied d'action */}
        {step === "locate" && searched && (
          <Footer>
            <ActionButton disabled={!selected} onClick={() => setStep("recycle")}>
              Continuer
              {selected && ` · ${nf.format(selected.distanceKm)} km`}
            </ActionButton>
          </Footer>
        )}

        {step === "recycle" && (
          <Footer>
            <ActionButton onClick={() => setStep("pay")}>Continuer</ActionButton>
          </Footer>
        )}

        {step === "pay" && (
          <Footer>
            <ActionButton onClick={() => setStep("done")}>
              <Lock className="size-4" />
              Payer {formatPrice(subtotal)}
            </ActionButton>
          </Footer>
        )}
      </div>
    </div>,
    document.body
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-border p-4">{children}</div>;
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-michelin-blue text-sm font-semibold text-white transition-colors hover:bg-michelin-blue/90 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-border">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Diminuer ${label}`}
        className="flex size-9 items-center justify-center text-michelin-blue transition-colors hover:bg-muted disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-9 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Augmenter ${label}`}
        className="flex size-9 items-center justify-center text-michelin-blue transition-colors hover:bg-muted disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function LocateStep({
  qty,
  onQty,
  address,
  setAddress,
  onSearch,
  searched,
  points,
  selectedId,
  onSelect,
}: {
  qty: number;
  onQty: (n: number) => void;
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
      <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3">
        <span className="text-sm font-semibold">Nombre de pneus</span>
        <Stepper value={qty} min={1} max={MAX_QTY} onChange={onQty} label="la quantité" />
      </div>

      <form onSubmit={onSearch} className="mt-5">
        <label htmlFor="mp-address" className="text-sm font-semibold">
          Votre adresse de retrait
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Nous cherchons les points de collecte les plus proches.
        </p>
        <div className="mt-2 flex gap-2">
          <div className="relative min-w-0 flex-1">
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
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-michelin-blue px-3 text-sm font-semibold text-white transition-colors hover:bg-michelin-blue/90 disabled:opacity-50 sm:px-4"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Chercher</span>
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
  buyQty,
  recycleQty,
  onRecycleQty,
  unitPrice,
  refund,
}: {
  point: CollectionPoint;
  buyQty: number;
  recycleQty: number;
  onRecycleQty: (n: number) => void;
  unitPrice: number;
  refund: number;
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
      text: "Après réception, MICHELIN vous rembourse 5 % par pneu repris.",
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
        <strong className="text-michelin-green">5 % remboursés</strong> par pneu
        repris (jusqu&apos;à {formatPrice(round2(unitPrice * 0.05))} / pneu).
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

      <div className="mt-5 rounded-xl border border-michelin-green/30 bg-michelin-green/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">
            Anciens pneus à recycler
          </span>
          <Stepper
            value={recycleQty}
            min={0}
            max={buyQty}
            onChange={onRecycleQty}
            label="les pneus à recycler"
          />
        </div>
        <p className="mt-2 text-sm">
          {recycleQty > 0 ? (
            <span className="font-semibold text-michelin-green">
              {recycleQty} pneu{recycleQty > 1 ? "s" : ""} repris ·{" "}
              {formatPrice(refund)} remboursés après réception
            </span>
          ) : (
            <span className="text-muted-foreground">
              Aucun pneu à recycler pour le moment.
            </span>
          )}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Maximum {buyQty} (vous ne pouvez pas recycler plus que vous n&apos;achetez).
        </p>
      </div>
    </div>
  );
}

function PayStep({
  tyre,
  buyQty,
  subtotal,
  point,
  recycleQty,
  refund,
}: {
  tyre: ShopTyre;
  buyQty: number;
  subtotal: number;
  point: CollectionPoint;
  recycleQty: number;
  refund: number;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">Récapitulatif</h3>
      <div className="mt-2 space-y-2 rounded-xl border border-border p-4 text-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block font-medium">
              {buyQty} × MICHELIN {tyre.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Retrait : {point.name}
            </span>
          </span>
          <span className="shrink-0 font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Livraison en point de collecte</span>
          <span>Offerte</span>
        </div>
        {recycleQty > 0 && (
          <div className="flex justify-between gap-3 text-michelin-green">
            <span>
              Reprise {recycleQty} pneu{recycleQty > 1 ? "s" : ""} (−5 %)
            </span>
            <span className="shrink-0 text-right">
              −{formatPrice(refund)} après réception
            </span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <span>À payer aujourd&apos;hui</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      <h3 className="mt-5 text-sm font-semibold">Paiement</h3>
      <div className="mt-2 space-y-2">
        <div className="relative">
          <CreditCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value="4242 4242 4242 4242"
            disabled
            aria-label="Numéro de carte (démo)"
            className="h-10 w-full rounded-lg border border-border bg-muted/40 pr-3 pl-9 text-sm text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          <input
            value="12 / 28"
            disabled
            aria-label="Expiration (démo)"
            className="h-10 w-full min-w-0 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground"
          />
          <input
            value="123"
            disabled
            aria-label="CVC (démo)"
            className="h-10 w-20 shrink-0 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground"
          />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" />
          Paiement de démonstration — aucune carte n&apos;est débitée.
        </p>
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
  buyQty,
  subtotal,
  point,
  recycleQty,
  refund,
}: {
  tyre: ShopTyre;
  buyQty: number;
  subtotal: number;
  point: CollectionPoint;
  recycleQty: number;
  refund: number;
}) {
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-michelin-green/15 text-michelin-green">
        <Check className="size-7" />
      </span>
      <h3 className="mt-4 font-heading text-lg font-bold">Commande confirmée</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatPrice(subtotal)} payés · {buyQty} pneu{buyQty > 1 ? "s" : ""}{" "}
        MICHELIN {tyre.name} vous attendr{buyQty > 1 ? "ont" : "a"} ici :
      </p>
      <div className="mt-4 rounded-xl border border-border p-4 text-left text-sm">
        <p className="font-semibold">{point.name}</p>
        <p className="text-muted-foreground">{point.address}</p>
        <p className="text-muted-foreground">{point.hours}</p>
        <p className="mt-1 text-xs font-semibold text-michelin-blue">
          à {nf.format(point.distanceKm)} km
        </p>
      </div>
      {recycleQty > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-michelin-green/10 p-3 text-left text-sm">
          <Recycle className="mt-0.5 size-4 shrink-0 text-michelin-green" />
          <span className="text-muted-foreground">
            Recyclage de {recycleQty} pneu{recycleQty > 1 ? "s" : ""} · une
            étiquette de retour vous sera fournie. MICHELIN vous remboursera{" "}
            <strong className="text-michelin-green">{formatPrice(refund)}</strong>{" "}
            après réception.
          </span>
        </div>
      )}
    </div>
  );
}
