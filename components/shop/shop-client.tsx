"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BIKE_FAMILIES,
  SHOP_CATALOG,
  familiesOf,
  formatPrice,
  priceOf,
  type BikeFamily,
  type ShopTyre,
} from "@/lib/shop/catalog";
import { TyreDetailModal } from "@/components/shop/tyre-detail-modal";

/** Visuel produit (photo locale dans /public/tyres), cliquable. */
function TyreVisual({ tyre, onOpen }: { tyre: ShopTyre; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Voir le détail du pneu MICHELIN ${tyre.name}`}
      className="relative block aspect-4/3 w-full cursor-pointer overflow-hidden rounded-t-xl bg-michelin-blue-light/40"
    >
      <Image
        src={tyre.image}
        alt={`MICHELIN ${tyre.name}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
      />
      {tyre.isNew && (
        <span className="absolute top-3 left-3 rounded-full bg-michelin-yellow px-2.5 py-1 text-[11px] font-bold tracking-wide text-michelin-blue-dark">
          NOUVEAU
        </span>
      )}
    </button>
  );
}

function TyreCard({ tyre }: { tyre: ShopTyre }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-lg">
      <TyreVisual tyre={tyre} onOpen={() => setOpen(true)} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {tyre.categories.slice(0, 2).map((c) => (
            <span
              key={c}
              className="rounded-full bg-michelin-blue-light px-2 py-0.5 text-[11px] font-semibold tracking-wide text-michelin-blue-dark"
            >
              {c}
            </span>
          ))}
          {tyre.gamme && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {tyre.gamme}
            </span>
          )}
        </div>
        <h3 className="font-heading text-base leading-snug font-semibold">
          MICHELIN {tyre.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{tyre.claim}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-heading text-lg font-bold text-michelin-blue">
            {formatPrice(priceOf(tyre))}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Voir les détails
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>
      {open && <TyreDetailModal tyre={tyre} onClose={() => setOpen(false)} />}
    </article>
  );
}

export function ShopClient() {
  const [family, setFamily] = useState<BikeFamily | null>(null);
  const [query, setQuery] = useState("");

  // Nombre de pneus par famille (pour les pastilles du suggesteur).
  const familyCounts = useMemo(() => {
    const counts = new Map<BikeFamily, number>();
    for (const t of SHOP_CATALOG) {
      for (const f of familiesOf(t)) counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    return counts;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SHOP_CATALOG.filter((t) => {
      const matchFamily = !family || familiesOf(t).includes(family);
      const matchQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.claim.toLowerCase().includes(q) ||
        t.categories.some((c) => c.toLowerCase().includes(q));
      return matchFamily && matchQuery;
    });
  }, [family, query]);

  const isFiltered = family !== null || query.trim() !== "";

  return (
    <div className="space-y-8">
      {/* Suggesteur : bande immersive bleu MICHELIN */}
      <section className="rounded-2xl bg-michelin-blue-dark p-5 text-white md:p-7">
        <div className="flex items-center gap-2 text-sm font-medium text-michelin-blue-light">
          <Sparkles className="size-4" />
          Suggesteur
        </div>
        <h2 className="mt-1 font-heading text-xl font-bold md:text-2xl">
          Trouvez le pneu fait pour votre vélo
        </h2>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-michelin-blue-dark/60" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un pneu, un usage…"
            className="h-12 w-full rounded-xl border-0 bg-white pr-4 pl-12 text-michelin-blue-dark outline-none ring-2 ring-transparent placeholder:text-michelin-blue-dark/50 focus:ring-michelin-yellow"
            aria-label="Rechercher un pneu"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <FamilyChip
            label="Tous"
            count={SHOP_CATALOG.length}
            active={family === null}
            onClick={() => setFamily(null)}
          />
          {BIKE_FAMILIES.map((f) => (
            <FamilyChip
              key={f}
              label={f}
              count={familyCounts.get(f) ?? 0}
              active={family === f}
              onClick={() => setFamily(family === f ? null : f)}
            />
          ))}
        </div>
      </section>

      {/* Catalogue complet / résultats filtrés */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-lg font-bold">
            {isFiltered ? "Résultats" : "Tout le catalogue"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {results.length} pneu{results.length > 1 ? "s" : ""}
          </span>
        </div>

        {results.length === 0 ? (
          <p className="mt-6 rounded-xl bg-muted/50 p-8 text-center text-sm text-muted-foreground">
            Aucun pneu ne correspond à votre recherche.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <TyreCard key={t.slug} tyre={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FamilyChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-michelin-yellow text-michelin-blue-dark"
          : "bg-white/10 text-white hover:bg-white/20"
      )}
    >
      {label}
      <span
        className={cn(
          "text-xs",
          active ? "text-michelin-blue-dark/70" : "text-michelin-blue-light/70"
        )}
      >
        {count}
      </span>
    </button>
  );
}
