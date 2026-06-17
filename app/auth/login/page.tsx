import type { Metadata } from "next";
import Image from "next/image";
import { Bike, Check, Droplet, Gauge, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Connexion · Michelin Pulse",
  description:
    "Connectez votre compte Strava pour personnaliser vos recommandations.",
};

const benefits = [
  { icon: Bike, label: "Vos parcours & distances" },
  { icon: Droplet, label: "Conditions météo rencontrées" },
  { icon: Gauge, label: "Puissance & vitesse moyenne" },
];

const errorMessages: Record<string, string> = {
  access_denied: "Connexion annulée. Vous pouvez réessayer.",
  invalid_state: "Session expirée, merci de réessayer.",
  missing_code: "La connexion à Strava a échoué. Réessayez.",
  token_exchange_failed: "Impossible de joindre Strava. Réessayez.",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] ?? errorMessages.missing_code : null;

  return (
    <div className="flex min-h-dvh justify-center bg-background">
      <div className="flex min-h-dvh w-[30vw] flex-col">
        {/* Header */}
      <header className="flex items-center gap-2 px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold tracking-tight">Connexion</h1>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col justify-center px-6">
        {/* Brand lockup */}
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/michelin-18.svg"
            alt="Michelin"
            width={260}
            height={80}
            className="h-20 w-auto"
            unoptimized
            priority
          />

          <span className="text-2xl font-light text-muted-foreground">x</span>

          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FC4C02] shadow-sm">
            <Zap className="size-8 fill-white text-white" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-7 text-center text-3xl font-bold tracking-tight">
          Connectez Strava
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-center text-[15px] leading-relaxed text-muted-foreground">
          On lit vos sorties pour personnaliser la recommandation.
        </p>

        {/* Benefits card */}
        <Card className="mt-8 gap-0 divide-y divide-border p-0">
          {benefits.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-4 first:pt-4 last:pb-4"
            >
              <Icon className="size-5 shrink-0 text-[#2D3F8F]" />
              <span className="flex-1 text-[15px] text-foreground">
                {label}
              </span>
              <Check className="size-5 shrink-0 text-green-600" />
            </div>
          ))}
        </Card>
      </main>

      {/* Footer / CTA */}
      <footer className="px-5 pt-4 pb-6">
        {errorMessage && (
          <p className="mb-3 rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <Button
          asChild
          size="lg"
          className="h-14 w-full gap-2 rounded-xl bg-[#FC4C02] text-base font-semibold text-white shadow-sm hover:bg-[#e34602]"
        >
          <a href="/api/auth/strava">
            <Zap className="size-5 fill-white" />
            Se connecter avec Strava
          </a>
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Lecture seule · révocable à tout moment · RGPD
        </p>
        </footer>
      </div>
    </div>
  );
}
