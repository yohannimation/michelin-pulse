"use server";

import { redirect } from "next/navigation";

import { addTyre, type TyrePosition } from "@/lib/tyre-store";
import { tyreModelOf, type TyreModel } from "@/lib/tyres";
import { identifyTyreFromPhoto } from "@/lib/shop/vision";

/** Identifie un pneu MICHELIN photographié, par comparaison avec la boutique. */
export async function identifyScannedTyre(formData: FormData): Promise<TyreModel | null> {
  const file = formData.get("photo");
  if (!(file instanceof File)) return null;

  const tyre = await identifyTyreFromPhoto(file);
  return tyre ? tyreModelOf(tyre) : null;
}

function asPosition(v: FormDataEntryValue | null): TyrePosition {
  return v === "ARRIÈRE" ? "ARRIÈRE" : "AVANT";
}

/** Enregistre un pneu MICHELIN scanné, puis renvoie vers le vélo correspondant. */
export async function registerScannedTyre(formData: FormData) {
  const bikeId = String(formData.get("bikeId") ?? "");
  if (!bikeId) return;

  const position = asPosition(formData.get("position"));
  const model = String(formData.get("model") ?? "");
  const size = String(formData.get("size") ?? "");
  const lifespanKm = Math.max(500, Number(formData.get("lifespanKm")) || 5000);
  const bikeKm = Math.max(0, Number(formData.get("bikeKm")) || 0);
  const priorKm = Math.max(0, Number(formData.get("priorKm")) || 0);

  await addTyre(bikeId, {
    position,
    model,
    size,
    lifespanKm,
    baselineKm: bikeKm - priorKm,
  });

  redirect(`/profile/my-bike/${bikeId}`);
}
