import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft2 } from "iconsax-react";

import { getGarageBike, type TyrePosition } from "@/lib/garage";
import { AddTyreForm } from "../add-tyre-form";

export default async function AddTyre({
  params,
  searchParams,
}: {
  params: Promise<{ bikeId: string }>;
  searchParams: Promise<{ position?: string }>;
}) {
  const { bikeId } = await params;
  const { position } = await searchParams;
  const bike = await getGarageBike(bikeId);
  if (!bike) notFound();

  const taken = bike.tyres.map((t) => t.position);
  const preselect: TyrePosition =
    position === "ARRIÈRE" || position === "AVANT"
      ? position
      : taken.includes("AVANT") && !taken.includes("ARRIÈRE")
        ? "ARRIÈRE"
        : "AVANT";

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-6 md:px-8 md:py-10">
      <div className="flex items-center gap-2">
        <Link
          href={`/profile/my-bike/${bike.id}`}
          aria-label="Retour au vélo"
          className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft2 size={24} color="currentColor" />
        </Link>
        <h1 className="text-xl font-bold md:text-3xl">Ajouter un pneu</h1>
      </div>
      <p className="mt-3 text-muted-foreground">
        Sur <span className="font-semibold text-foreground">{bike.name}</span> —
        photographiez le flanc du pneu ou saisissez son code à 8 caractères.
      </p>

      <AddTyreForm
        bikeId={bike.id}
        bikeKm={bike.stravaKm}
        takenPositions={taken}
        preselect={preselect}
      />
    </div>
  );
}
