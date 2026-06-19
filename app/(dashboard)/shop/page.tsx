import { Suspense } from "react";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { ShopClient } from "@/components/shop/shop-client";
import { readSession } from "@/lib/session";

export default async function Shop() {
  const session = await readSession();
  const athlete = session?.athlete;
  const initials = `${athlete?.firstname?.[0] ?? "A"}${
    athlete?.lastname?.[0] ?? "L"
  }`.toUpperCase();

  return (
    <div className="mx-auto max-w-6xl px-2 pt-2 pb-5 md:px-5 md:pt-5">
      <MobileTopBar avatar={athlete?.profile} initials={initials} />

      <p className="mt-4 text-sm text-muted-foreground">
        Le catalogue pneus vélo MICHELIN, choisi pour votre monture.
      </p>
      <Suspense>
        <ShopClient />
      </Suspense>
    </div>
  );
}
