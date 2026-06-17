"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, ScanLine, ShoppingBag, X } from "lucide-react";

/**
 * Modale d'accueil affichée juste après la connexion Strava (`?welcome=1`).
 * Les vélos sont importés automatiquement ; on demande si l'utilisateur a déjà
 * des pneus MICHELIN. Sinon → invitation à s'équiper en boutique.
 */
export function OnboardingModal({ bikeCount }: { bikeCount: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<"ask" | "buy">("ask");

  if (!open) return null;

  function close() {
    setOpen(false);
    // Retire ?welcome=1 de l'URL sans recharger.
    router.replace("/");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        {step === "ask" ? (
          <>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-michelin-blue-light text-michelin-blue">
              <Bike className="size-6" />
            </span>
            <h2 className="mt-4 font-heading text-xl font-bold">
              {bikeCount > 0
                ? `${bikeCount} vélo${bikeCount > 1 ? "s" : ""} importé${bikeCount > 1 ? "s" : ""} depuis Strava`
                : "Bienvenue sur MICHELIN Pulse"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Avez-vous déjà des pneus MICHELIN montés sur vos vélos ? Nous
              suivrons leur usure grâce à vos sorties Strava.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => router.push("/profile/my-bike")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-michelin-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-michelin-blue/90"
              >
                <ScanLine className="size-4" />
                Oui, scanner mes pneus
              </button>
              <button
                type="button"
                onClick={() => setStep("buy")}
                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Non, pas encore
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-michelin-blue-light text-michelin-blue">
              <ShoppingBag className="size-6" />
            </span>
            <h2 className="mt-4 font-heading text-xl font-bold">
              Équipez-vous en pneus MICHELIN
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Montez des pneus MICHELIN pour obtenir l&apos;état de vos pneus en
              temps réel, suivre leur usure et accumuler des km MICHELIN.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => router.push("/shop")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-michelin-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-michelin-blue/90"
              >
                <ShoppingBag className="size-4" />
                Voir la boutique
              </button>
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Plus tard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
