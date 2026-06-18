import { Clock, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ConcoursEvent } from "@/lib/events";

function LeaderboardRow({
  entry,
}: {
  entry: ConcoursEvent["leaderboard"][number];
}) {
  const onPodium = entry.rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5",
        entry.isMe && "bg-michelin-blue-light"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          onPodium
            ? "bg-michelin-yellow text-michelin-midnight"
            : "bg-muted text-muted-foreground"
        )}
      >
        {entry.rank}
      </span>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
          entry.isMe ? "bg-michelin-blue" : "bg-michelin-gray"
        )}
      >
        {entry.initials}
      </span>
      <span className="flex-1 truncate text-sm font-medium">{entry.name}</span>
      <span className="text-sm font-bold">
        {entry.km.toLocaleString("fr-FR")} km
      </span>
    </div>
  );
}

export function ConcoursEventDetail({
  event,
  meName,
  meInitials,
}: {
  event: ConcoursEvent;
  meName?: string;
  meInitials?: string;
}) {
  const leaderboard = event.leaderboard.map((entry) =>
    entry.isMe
      ? {
          ...entry,
          name: meName ?? entry.name,
          initials: meInitials || entry.initials,
        }
      : entry
  );
  const thirdPlace = leaderboard.find((e) => e.rank === 3);
  const me = leaderboard.find((e) => e.isMe);
  const remainingToPodium =
    thirdPlace && me ? Math.max(0, thirdPlace.km - me.km) : null;
  const progressPct = thirdPlace
    ? Math.min(100, Math.round((event.progress.valueKm / thirdPlace.km) * 100))
    : 0;

  return (
    <>
      <div className="rounded-2xl bg-michelin-midnight p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-fit items-center rounded-full bg-michelin-yellow px-3 py-1 text-xs font-semibold text-michelin-midnight">
              {event.badge}
            </span>
            {event.isRegistered && (
              <span className="inline-flex w-fit items-center rounded-full bg-michelin-green px-3 py-1 text-xs font-semibold text-white">
                Inscrit
              </span>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-white/70">
            <Clock className="size-3.5" />
            {event.reward.daysLeftLabel}
          </span>
        </div>
        <div className="mt-3 flex items-start gap-2.5">
          <Trophy className="mt-0.5 size-5 shrink-0 text-michelin-yellow" />
          <p className="font-heading text-base font-bold">{event.reward.text}</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 ring-1 ring-foreground/10">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-muted-foreground">{event.progress.label}</p>
          <p className="font-heading text-xl font-bold">
            {event.progress.valueKm.toLocaleString("fr-FR")} km
          </p>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-michelin-yellow"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {remainingToPodium !== null && (
          <p className="mt-2 text-sm text-muted-foreground">
            {remainingToPodium > 0
              ? `${remainingToPodium.toLocaleString("fr-FR")} km pour entrer dans le top 3`
              : "Vous êtes sur le podium !"}
          </p>
        )}
        {me && (
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Votre position</span>
            <span className="font-semibold">
              {me.rank}ᵉ sur {event.participantsLabel}
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="font-heading text-base font-bold">Classement</p>
        <div className="mt-3 flex flex-col gap-1">
          {leaderboard.map((entry) => (
            <LeaderboardRow key={entry.rank} entry={entry} />
          ))}
        </div>
      </div>
    </>
  );
}
