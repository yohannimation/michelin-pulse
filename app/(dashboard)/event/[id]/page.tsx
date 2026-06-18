import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft2 } from "iconsax-react";

import { getEventById } from "@/lib/events";
import { getGarage } from "@/lib/garage";
import { readSession } from "@/lib/session";
import { CourseEventDetail } from "./course-detail";
import { ConcoursEventDetail } from "./concours-detail";

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

  const session = await readSession();
  const athlete = session?.athlete;
  const meName = athlete ? `Vous · ${athlete.firstname}` : undefined;
  const meInitials = athlete
    ? `${athlete.firstname?.[0] ?? ""}${athlete.lastname?.[0] ?? ""}`.toUpperCase()
    : undefined;

  const garage = await getGarage();
  const hasScannedTyre = garage.some((bike) => bike.tyres.length > 0);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-3 pt-2 pb-6 md:px-5 md:pt-5">
      <div className="flex items-center gap-3">
        <Link
          href="/event"
          aria-label="Retour aux évènements"
          className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft2 size={24} color="currentColor" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold leading-tight">
            {event.title}
          </h1>
          {event.variant === "course" && (
            <p className="text-sm text-muted-foreground">
              {event.editionLabel} · {event.date} · {event.distanceKm} km
            </p>
          )}
        </div>
      </div>

      {event.variant === "course" ? (
        <CourseEventDetail event={event} hasScannedTyre={hasScannedTyre} />
      ) : (
        <ConcoursEventDetail event={event} meName={meName} meInitials={meInitials} />
      )}
    </div>
  );
}
