import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Info,
  Recycle,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseEvent, PrincipleIcon } from "@/lib/events";

const PRINCIPLE_ICONS: Record<PrincipleIcon, LucideIcon> = {
  user: User,
  shield: Shield,
  recycle: Recycle,
  award: Award,
};

export function CourseEventDetail({
  event,
  hasScannedTyre,
}: {
  event: CourseEvent;
  hasScannedTyre: boolean;
}) {
  const locked = !event.isRegistered && !hasScannedTyre;

  return (
    <>
      <div className="relative">
        <span
          className={cn(
            "absolute top-3 left-3 z-10 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
            event.isRegistered
              ? "bg-michelin-green text-white"
              : "bg-michelin-yellow text-michelin-blue"
          )}
        >
          {event.badge}
        </span>
        {event.photoUrl ? (
          <div className="relative h-56 overflow-hidden rounded-2xl">
            <Image
              src={event.photoUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="flex h-56 items-center justify-center rounded-2xl border border-border bg-[repeating-linear-gradient(135deg,var(--color-muted)_0px,var(--color-muted)_8px,transparent_8px,transparent_16px)] text-xs tracking-wide text-muted-foreground"
            aria-hidden
          >
            visuel course
          </div>
        )}
      </div>

      <div className="rounded-2xl p-4 ring-1 ring-foreground/10">
        <p className="font-heading text-base font-bold">Le principe</p>
        <div className="mt-3 flex flex-col gap-3">
          {event.principle.map(({ icon, text }, index) => {
            const Icon = PRINCIPLE_ICONS[icon];
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-michelin-blue-light">
                  <Icon className="size-4 text-michelin-blue" />
                </div>
                <p className="pt-1.5 text-sm">{text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-michelin-green/10 px-4 py-3">
        <Recycle className="mt-0.5 size-5 shrink-0 text-michelin-green" />
        <div>
          <p className="text-sm font-bold text-michelin-green">100% recyclé</p>
          <p className="text-sm text-michelin-green/80">{event.recycledNote}</p>
        </div>
      </div>

      {locked && (
        <div
          className="flex items-start gap-2.5 rounded-xl bg-michelin-warning-light px-4 py-3 text-sm text-foreground"
        >
          <Info size={18} className="mt-0.5 shrink-0" />
          <p>
            Scannez un pneu MICHELIN sur un de vos vélos pour vous inscrire.{" "}
            <Link href="/profile/my-bike" className="font-semibold underline">
              Aller au garage
            </Link>
          </p>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-background p-4 md:bottom-0 md:left-1/2 md:max-w-2xl md:-translate-x-1/2 md:rounded-t-2xl md:border-x">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Inscription</p>
            <p className="font-heading text-xl font-bold">{event.priceLabel}</p>
          </div>
          <Button
            size="lg"
            disabled={locked}
            className="h-11 rounded-xl bg-michelin-yellow px-5 text-michelin-blue hover:bg-michelin-yellow/90 disabled:opacity-50"
          >
            {event.isRegistered ? "Voir mon inscription" : "S'inscrire à la course"}
          </Button>
        </div>
      </div>
      <div className="h-20" aria-hidden />
    </>
  );
}
