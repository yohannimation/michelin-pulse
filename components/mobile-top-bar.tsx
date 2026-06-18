import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

/** Barre du haut mobile (logo + notifications + avatar) — le desktop a déjà son propre header (SiteHeader). */
export function MobileTopBar({
  avatar,
  initials,
}: {
  avatar?: string;
  initials: string;
}) {
  return (
    <div className="sticky top-0 z-40 -mx-4 flex items-center justify-between bg-background/85 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 backdrop-blur md:hidden">
      <Image
        src="/michelin-18.svg"
        alt="Michelin"
        width={120}
        height={40}
        className="h-7 w-auto"
        unoptimized
        priority
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <Bell className="size-4" />
        </button>
        <Link href="/profile" aria-label="Mon profil">
          {avatar ? (
            <Image
              src={avatar}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-1 ring-foreground/10"
              unoptimized
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-full bg-michelin-blue text-sm font-semibold text-white">
              {initials}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
