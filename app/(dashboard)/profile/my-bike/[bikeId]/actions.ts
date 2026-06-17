"use server";

import { redirect } from "next/navigation";

import { addTyre, removeTyre, type TyrePosition } from "@/lib/tyre-store";

function asPosition(v: FormDataEntryValue | null): TyrePosition {
  return v === "ARRIÈRE" ? "ARRIÈRE" : "AVANT";
}

/** Enregistre un pneu MICHELIN sur un vélo, puis renvoie vers son détail. */
export async function registerTyre(formData: FormData) {
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
    // L'odomètre vélo au montage, moins les km déjà parcourus déclarés.
    baselineKm: bikeKm - priorKm,
  });

  redirect(`/profile/my-bike/${bikeId}`);
}

/** Retire le pneu d'une position. */
export async function unregisterTyre(formData: FormData) {
  const bikeId = String(formData.get("bikeId") ?? "");
  if (!bikeId) return;
  await removeTyre(bikeId, asPosition(formData.get("position")));
  redirect(`/profile/my-bike/${bikeId}`);
}
