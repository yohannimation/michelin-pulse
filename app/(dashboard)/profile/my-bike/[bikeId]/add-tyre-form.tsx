"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Keyboard, TickCircle } from "iconsax-react";

import type { TyrePosition } from "@/lib/garage";
import {
  identifyByCode,
  identifyByFingerprint,
  isValidCode,
  normalizeCode,
  type TyreModel,
} from "@/lib/tyres";
import { cn } from "@/lib/utils";
import { registerTyre } from "./actions";

const BLUE = "#27509B";
const POSITIONS: TyrePosition[] = ["AVANT", "ARRIÈRE"];

export function AddTyreForm({
  bikeId,
  bikeKm,
  takenPositions,
  preselect,
}: {
  bikeId: string;
  bikeKm: number;
  takenPositions: TyrePosition[];
  preselect: TyrePosition;
}) {
  const [position, setPosition] = useState<TyrePosition>(preselect);
  const [method, setMethod] = useState<"photo" | "code">("photo");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tyre, setTyre] = useState<TyreModel | null>(null);

  function reset() {
    setTyre(null);
    setPreview(null);
    setError(null);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));
    // Identification simulée à partir d'une empreinte du fichier.
    setTyre(identifyByFingerprint(`${file.name}-${file.size}`));
  }

  function submitCode() {
    if (!isValidCode(code)) {
      setError("Le code doit comporter 8 caractères (lettres ou chiffres).");
      return;
    }
    setError(null);
    setTyre(identifyByCode(code));
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Position */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground">Position</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {POSITIONS.map((p) => {
            const active = position === p;
            const taken = takenPositions.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                  active
                    ? "border-transparent text-white"
                    : "border-border hover:bg-muted"
                )}
                style={active ? { backgroundColor: BLUE } : undefined}
              >
                {p === "AVANT" ? "Avant" : "Arrière"}
                {taken && (
                  <span className={cn("ml-1.5 text-xs font-normal", active ? "text-white/80" : "text-muted-foreground")}>
                    · monté
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {takenPositions.includes(position) && (
          <p className="mt-2 text-xs text-muted-foreground">
            Un pneu est déjà monté à cette position : il sera remplacé.
          </p>
        )}
      </section>

      {!tyre ? (
        <>
          {/* Méthode */}
          <section>
            <div className="grid grid-cols-2 gap-2">
              <MethodTab
                active={method === "photo"}
                onClick={() => setMethod("photo")}
                icon={<Camera size={20} color="currentColor" variant="Bold" />}
                label="Photo"
              />
              <MethodTab
                active={method === "code"}
                onClick={() => setMethod("code")}
                icon={<Keyboard size={20} color="currentColor" variant="Bold" />}
                label="Code"
              />
            </div>

            {method === "photo" ? (
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/50">
                <Camera size={32} color={BLUE} variant="Bulk" />
                <span className="font-semibold">Photographier le pneu</span>
                <span className="text-sm text-muted-foreground">
                  Cadrez le flanc et le marquage MICHELIN
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onFile}
                />
              </label>
            ) : (
              <div className="mt-3">
                <input
                  inputMode="text"
                  autoCapitalize="characters"
                  placeholder="Ex. 8KM4P2ZQ"
                  value={code}
                  onChange={(e) => setCode(normalizeCode(e.target.value))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-center font-mono text-lg tracking-[0.3em] uppercase outline-none focus:border-ring"
                  maxLength={8}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  8 caractères, indiqués sur le flanc ou l&apos;emballage du pneu.
                </p>
                <button
                  type="button"
                  onClick={submitCode}
                  className="mt-3 w-full rounded-xl py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: BLUE }}
                >
                  Identifier le pneu
                </button>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          </section>
        </>
      ) : (
        <IdentifiedCard
          tyre={tyre}
          preview={preview}
          bikeId={bikeId}
          bikeKm={bikeKm}
          position={position}
          onReset={reset}
        />
      )}
    </div>
  );
}

function MethodTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
        active ? "border-transparent text-white" : "border-border hover:bg-muted"
      )}
      style={active ? { backgroundColor: BLUE } : undefined}
    >
      {icon}
      {label}
    </button>
  );
}

function IdentifiedCard({
  tyre,
  preview,
  bikeId,
  bikeKm,
  position,
  onReset,
}: {
  tyre: TyreModel;
  preview: string | null;
  bikeId: string;
  bikeKm: number;
  position: TyrePosition;
  onReset: () => void;
}) {
  return (
    <section className="rounded-2xl p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#15803D" }}>
        <TickCircle size={20} color="currentColor" variant="Bold" />
        Pneu identifié
      </div>

      <div className="mt-3 flex items-center gap-4">
        {preview ? (
          <Image
            src={preview}
            alt=""
            width={72}
            height={72}
            className="size-[72px] shrink-0 rounded-xl object-cover ring-1 ring-foreground/10"
            unoptimized
          />
        ) : (
          <div
            className="flex size-[72px] shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white"
            style={{ backgroundColor: BLUE }}
          >
            MICHELIN
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold leading-tight break-words">{tyre.model}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {tyre.terrain} · {tyre.size} · ~{tyre.lifespanKm.toLocaleString("fr-FR")} km de durée de vie
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Position : {position === "AVANT" ? "Avant" : "Arrière"}
          </p>
        </div>
      </div>

      <form action={registerTyre} className="mt-4 space-y-3">
        <input type="hidden" name="bikeId" value={bikeId} />
        <input type="hidden" name="position" value={position} />
        <input type="hidden" name="model" value={tyre.model} />
        <input type="hidden" name="size" value={tyre.size} />
        <input type="hidden" name="lifespanKm" value={tyre.lifespanKm} />
        <input type="hidden" name="bikeKm" value={bikeKm} />

        <label className="block">
          <span className="text-sm font-medium">Km déjà parcourus sur ce pneu</span>
          <input
            type="number"
            name="priorKm"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-ring"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Laissez 0 si le pneu est neuf. Les km suivants seront comptés
            automatiquement via Strava.
          </span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            Changer
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: BLUE }}
          >
            Enregistrer le pneu
          </button>
        </div>
      </form>
    </section>
  );
}
