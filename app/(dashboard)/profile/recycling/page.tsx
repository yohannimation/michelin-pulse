"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import ALL_STORES from "../../../../lib/data/resellers.json";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const MapComponent = dynamic(
  () => import("../../../../components/Michelin/ResellersMap"),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-foreground">Chargement de la carte...</div> }
);

export default function RecyclingPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  const recyclingStores = useMemo(() => {
    return ALL_STORES.filter(s => s.recycling);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8 md:py-10 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="flex size-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Points de Recyclage</h1>
          <p className="text-muted-foreground text-sm">Trouvez un partenaire agréé pour recycler vos anciens pneus.</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-2xl border border-border/50">
        <div className="hidden md:flex w-[350px] border-r border-border/50 bg-card overflow-y-auto p-4 flex-col gap-4">
          {recyclingStores.map(store => (
            <div 
              key={store.id} 
              onClick={() => setSelectedStoreId(store.id)}
              className={`p-4 rounded-xl cursor-pointer transition-colors border ${selectedStoreId === store.id ? 'border-primary bg-primary/5' : 'border-border/50 bg-background hover:bg-muted'}`}
            >
              <div className="font-bold mb-1">{store.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{store.street}, {store.city}</div>
              <div className="text-sm font-medium text-[#84bd00] flex items-center gap-2">
                <span>♻️</span> Point de collecte
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-muted relative">
          <MapComponent 
            stores={recyclingStores} 
            selectedStoreId={selectedStoreId} 
            onSelectStore={setSelectedStoreId} 
          />
        </div>
      </div>
    </div>
  );
}
