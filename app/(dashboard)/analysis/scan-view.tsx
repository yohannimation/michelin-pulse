"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, GalleryAdd, TickCircle } from "iconsax-react";

import type { GarageBike, TyrePosition } from "@/lib/garage";
import { identifyByFingerprint, type TyreModel } from "@/lib/tyres";
import { cn } from "@/lib/utils";
import { registerScannedTyre } from "./actions";

const POSITIONS: TyrePosition[] = ["AVANT", "ARRIÈRE"];

export function ScanView({ bikes }: { bikes: GarageBike[] }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [tyre, setTyre] = useState<TyreModel | null>(null);
  const [bikeId, setBikeId] = useState<string | undefined>(bikes[0]?.id);
  const [position, setPosition] = useState<TyrePosition>("AVANT");
  const [cameraOpen, setCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const bike = bikes.find((b) => b.id === bikeId);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    // Identification simulée à partir d'une empreinte du fichier.
    setTyre(identifyByFingerprint(`${file.name}-${file.size}`));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      // Caméra indisponible ou refusée : on retombe sur la capture native.
      fileInputRef.current?.click();
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        handleFile(new File([blob], `pneu-${Date.now()}.jpg`, { type: "image/jpeg" }));
        closeCamera();
      },
      "image/jpeg",
      0.92
    );
  }

  function reset() {
    setPreview(null);
    setTyre(null);
  }

  if (tyre) {
    return (
      <IdentifiedCard
        tyre={tyre}
        preview={preview}
        bikes={bikes}
        bikeId={bikeId}
        bike={bike}
        position={position}
        onSelectBike={setBikeId}
        onSelectPosition={setPosition}
        onReset={reset}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile : wireframe de cadrage, puis bascule vers la caméra live. */}
      <div className="flex flex-col items-center gap-3 md:hidden">
        {cameraOpen ? (
          <>
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="size-full object-cover"
              />
              <ScanCorners tone="white" />
            </div>
            <button
              type="button"
              onClick={capturePhoto}
              aria-label="Prendre la photo"
              className="size-16 rounded-full border-4 border-white bg-white/10"
            />
            <button
              type="button"
              onClick={closeCamera}
              className="text-sm font-medium text-muted-foreground hover:underline"
            >
              Annuler
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </>
        ) : (
          <>
            <div className="relative flex aspect-[4/5] w-full max-w-sm flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-6 text-center">
              <ScanCorners tone="blue" />
              <Camera size={40} className="text-michelin-blue" variant="Bulk" />
              <span className="font-semibold">Cadrez le pneu dans la zone</span>
              <span className="text-sm text-muted-foreground">
                Centrez le flanc et le marquage MICHELIN avant de prendre la photo
              </span>
            </div>
            <button
              type="button"
              onClick={openCamera}
              className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-michelin-blue py-3 text-sm font-semibold text-white"
            >
              <Camera size={18} variant="Bold" />
              Ouvrir l&apos;appareil photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFile}
            />
          </>
        )}
      </div>

      {/* Desktop : pas de caméra, on importe une photo existante. */}
      <label className="hidden cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:bg-muted/50 md:flex">
        <GalleryAdd size={36} className="text-michelin-blue" variant="Bulk" />
        <span className="font-semibold">Importer une photo du pneu</span>
        <span className="text-sm text-muted-foreground">
          Choisissez une image nette du flanc et du marquage MICHELIN
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
    </div>
  );
}

function ScanCorners({ tone }: { tone: "white" | "blue" }) {
  const base = "pointer-events-none absolute size-6 border-2";
  const color = tone === "white" ? "border-white" : "border-michelin-blue";
  return (
    <>
      <span className={cn(base, color, "left-3 top-3 rounded-tl-md border-b-0 border-r-0")} />
      <span className={cn(base, color, "right-3 top-3 rounded-tr-md border-b-0 border-l-0")} />
      <span className={cn(base, color, "bottom-3 left-3 rounded-bl-md border-r-0 border-t-0")} />
      <span className={cn(base, color, "bottom-3 right-3 rounded-br-md border-l-0 border-t-0")} />
    </>
  );
}

function IdentifiedCard({
  tyre,
  preview,
  bikes,
  bikeId,
  bike,
  position,
  onSelectBike,
  onSelectPosition,
  onReset,
}: {
  tyre: TyreModel;
  preview: string | null;
  bikes: GarageBike[];
  bikeId: string | undefined;
  bike: GarageBike | undefined;
  position: TyrePosition;
  onSelectBike: (id: string) => void;
  onSelectPosition: (p: TyrePosition) => void;
  onReset: () => void;
}) {
  const taken = bike?.tyres.map((t) => t.position) ?? [];

  return (
    <section className="rounded-2xl p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-2 text-sm font-semibold text-michelin-green">
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
          <div className="flex size-[72px] shrink-0 items-center justify-center rounded-xl bg-michelin-blue text-xs font-semibold text-white">
            MICHELIN
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold leading-tight break-words">{tyre.model}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {tyre.terrain} · {tyre.size} · ~{tyre.lifespanKm.toLocaleString("fr-FR")} km de durée de vie
          </p>
        </div>
      </div>

      {bikes.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Aucun vélo dans votre garage — reconnectez Strava pour pouvoir
          enregistrer ce pneu.
        </p>
      ) : (
        <form action={registerScannedTyre} className="mt-4 space-y-3">
          <input type="hidden" name="bikeId" value={bikeId ?? ""} />
          <input type="hidden" name="position" value={position} />
          <input type="hidden" name="model" value={tyre.model} />
          <input type="hidden" name="size" value={tyre.size} />
          <input type="hidden" name="lifespanKm" value={tyre.lifespanKm} />
          <input type="hidden" name="bikeKm" value={bike?.stravaKm ?? 0} />

          <label className="block">
            <span className="text-sm font-medium">Vélo</span>
            <select
              value={bikeId}
              onChange={(e) => onSelectBike(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-ring"
            >
              {bikes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm font-medium">Position</span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {POSITIONS.map((p) => {
                const active = position === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onSelectPosition(p)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "border-transparent bg-michelin-blue text-white"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {p === "AVANT" ? "Avant" : "Arrière"}
                    {taken.includes(p) && (
                      <span className={cn("ml-1.5 text-xs font-normal", active ? "text-white/80" : "text-muted-foreground")}>
                        · monté
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Km déjà parcourus sur ce pneu</span>
            <input
              type="number"
              name="priorKm"
              min={0}
              defaultValue={0}
              className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-ring"
            />
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
              className="flex-1 rounded-xl bg-michelin-blue py-3 text-sm font-semibold text-white"
            >
              Enregistrer le pneu
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
