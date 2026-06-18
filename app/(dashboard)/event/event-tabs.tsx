"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bike, Calendar, Clock, MapPin, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EVENTS, type ConcoursEvent, type CourseEvent } from "@/lib/events";

const TABS = [
  { key: "upcoming", label: "À venir" },
  { key: "registered", label: "Mes inscriptions" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function EventBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-michelin-yellow px-3 py-1 text-xs font-semibold text-michelin-midnight">
      {label}
    </span>
  );
}

function RegisteredPill() {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-michelin-green px-3 py-1 text-xs font-semibold text-white">
      Inscrit
    </span>
  );
}

function EventPhoto({ event }: { event: CourseEvent }) {
  if (event.photoUrl) {
    return (
      <div className="relative h-40">
        <Image
          src={event.photoUrl}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-40 items-center justify-center border-y border-border bg-[repeating-linear-gradient(135deg,var(--color-muted)_0px,var(--color-muted)_8px,transparent_8px,transparent_16px)] text-xs tracking-wide text-muted-foreground"
      aria-hidden
    >
      visuel évènement · course
    </div>
  );
}

function CourseEventCard({
  event,
  hasScannedTyre,
}: {
  event: CourseEvent;
  hasScannedTyre: boolean;
}) {
  const locked = !event.isRegistered && !hasScannedTyre;

  return (
    <Link href={`/event/${event.id}`} className="block">
      <Card className="p-0 transition-colors hover:bg-muted/40" size="sm">
        <div className="flex items-center gap-2 px-3 pt-3 md:px-4 md:pt-4">
          <EventBadge label={event.badge} />
          {event.isRegistered && <RegisteredPill />}
        </div>
        <EventPhoto event={event} />
        <div className="flex flex-col gap-3 px-3 pb-3 md:px-4 md:pb-4">
          <p className="font-heading text-lg font-bold">
            {event.title} — {event.editionLabel}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.location}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{event.description}</p>
          <div className="flex items-center justify-between pt-1">
            <p className="font-heading text-lg font-bold">{event.priceLabel}</p>
            {event.isRegistered ? (
              <Button variant="outline" className="border-michelin-green text-michelin-green hover:bg-michelin-green/5">
                Voir mon inscription
              </Button>
            ) : (
              <Button
                disabled={locked}
                className="bg-michelin-yellow text-michelin-midnight hover:bg-michelin-yellow/90 disabled:opacity-50"
              >
                S&apos;inscrire
              </Button>
            )}
          </div>
          {locked && (
            <p className="text-xs text-muted-foreground">
              Scannez un pneu MICHELIN sur un de vos vélos pour vous inscrire.
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

function ConcoursEventCard({ event }: { event: ConcoursEvent }) {
  return (
    <Link href={`/event/${event.id}`} className="block">
      <Card
        className="overflow-hidden p-0 transition-colors hover:bg-muted/40"
        size="sm"
      >
        <div className="relative overflow-hidden bg-michelin-midnight p-4 text-white md:p-5">
          <Trophy className="absolute -top-2 right-3 size-20 text-white/10" />
          <div className="relative flex items-center gap-2">
            <EventBadge label={event.badge} />
            {event.isRegistered && <RegisteredPill />}
          </div>
        </div>
        <div className="flex flex-col gap-3 px-3 py-3 md:px-4 md:py-4">
          <p className="font-heading text-lg font-bold">{event.title}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {event.period}
            </span>
            <span className="flex items-center gap-1.5">
              <Bike className="size-4" />
              {event.participantsLabel}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{event.description}</p>
          {event.isRegistered && (
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs text-muted-foreground">
                  {event.progress.label}
                </p>
                <p className="font-heading text-lg font-bold">
                  {event.progress.valueKm.toLocaleString("fr-FR")} km
                </p>
              </div>
              <Button
                variant="outline"
                className="border-michelin-green text-michelin-green hover:bg-michelin-green/5"
              >
                Voir mon classement
              </Button>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

function EventCard({
  event,
  hasScannedTyre,
}: {
  event: CourseEvent | ConcoursEvent;
  hasScannedTyre: boolean;
}) {
  return event.variant === "course" ? (
    <CourseEventCard event={event} hasScannedTyre={hasScannedTyre} />
  ) : (
    <ConcoursEventCard event={event} />
  );
}

export function EventTabs({ hasScannedTyre }: { hasScannedTyre: boolean }) {
  const [tab, setTab] = useState<TabKey>("upcoming");

  const events =
    tab === "upcoming" ? EVENTS : EVENTS.filter((event) => event.isRegistered);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
              tab === key
                ? "bg-background text-michelin-blue shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {events.length > 0 ? (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              hasScannedTyre={hasScannedTyre}
            />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Vous n&apos;êtes inscrit à aucun évènement pour le moment.
        </p>
      )}
    </div>
  );
}
