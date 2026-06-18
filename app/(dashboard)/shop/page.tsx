import { ShopClient } from "@/components/shop/shop-client";

export default function Shop() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Boutique</h1>
        <p className="text-sm text-muted-foreground">
          Le catalogue pneus vélo MICHELIN, choisi pour votre monture.
        </p>
      </header>
      <ShopClient />
    </div>
  );
}
