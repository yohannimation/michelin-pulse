import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight2,
  Medal,
  Notification,
  Bag2,
  Shield,
} from "iconsax-react";

import { Button } from "@/components/ui/button";
import { getProfileData } from "@/lib/profile";
import { cn } from "@/lib/utils";

// Signature commune aux pictos iconsax et à nos SVG maison (vélo / recyclage).
type IconProps = {
  size?: number;
  color?: string;
  variant?: "Linear" | "Bold" | "Bulk" | "Outline" | "Broken" | "TwoTone";
  className?: string;
};
type IconCmp = React.ComponentType<IconProps>;

const nf = new Intl.NumberFormat("fr-FR");

// Bleu Michelin utilisé pour l'avatar, les badges et les pictos.
const MICHELIN_BLUE = "#27509B";

export default async function Profile() {
  const data = await getProfileData();

  // Garde‑fou : le proxy protège déjà la route, mais on reste défensif.
  if (!data) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Aucune session Strava active.
        </p>
        <Button asChild className="mt-6">
          <Link href="/auth/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  // Lignes du menu. Les valeurs marquées « (placeholder) » n'ont pas encore de
  // source de données dans l'app ; les autres proviennent de Strava.
  const items: MenuItem[] = [
    {
      href: "/profile/my-bike",
      title: "Mon Garage",
      subtitle: data.bikes
        ? `${data.bikes} vélo${data.bikes > 1 ? "s" : ""} · pneus à scanner`
        : "Importez votre vélo Strava",
      Icon: BikeIcon,
      badge: data.bikes || undefined,
    },
    {
      href: "/shop/history",
      title: "Mes commandes",
      subtitle: "2 en cours", // placeholder
      Icon: Bag2,
    },
    {
      href: "/profile/my-bike",
      title: "Mes recyclages",
      subtitle: "1 remboursement en attente", // placeholder
      Icon: RecycleIcon,
    },
    {
      href: "/loyalty",
      title: "Fidélité",
      subtitle: `Membre ${data.tier} · ${nf.format(data.michelinKm)} km MICHELIN`,
      Icon: Medal,
    },
    {
      href: "/profile",
      title: "Notifications",
      subtitle: "Usure, météo, évènements", // placeholder
      Icon: Notification,
    },
    {
      href: "/profile",
      title: "Confidentialité & Strava",
      subtitle: data.isConnected ? "Connecté" : "Non connecté",
      Icon: Shield,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-6 md:px-8 md:py-10">
      {/* En‑tête de page */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold md:text-4xl">Profil</h1>
        <div
          className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground"
          aria-hidden
        >
          <Notification size={22} color="currentColor" variant="Linear" />
        </div>
      </div>

      <div className="mt-6 md:mt-8 md:grid md:grid-cols-[340px_1fr] md:items-start md:gap-8">
        {/* Colonne identité + stats */}
        <section className="md:sticky md:top-24">
          {/* Identité */}
          <div className="flex items-center gap-4">
            {data.avatar ? (
              <Image
                src={data.avatar}
                alt=""
                width={88}
                height={88}
                className="size-[88px] shrink-0 rounded-full object-cover ring-1 ring-foreground/10"
                unoptimized
              />
            ) : (
              <div
                className="flex size-[88px] shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: MICHELIN_BLUE }}
              >
                {data.initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-sans text-xl font-bold leading-tight break-words md:text-2xl">
                {data.name}
              </p>
              {data.subtitle && (
                <p className="truncate text-sm text-muted-foreground">
                  {data.subtitle}
                </p>
              )}
              <span
                className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
                style={{ backgroundColor: "#F7EEC3", color: "#7A6516" }}
              >
                Membre {data.tier}
              </span>
            </div>
          </div>

          {/* Stats : km MICHELIN (loyalty) vs km parcourus (Strava) + sorties. */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat value={nf.format(data.michelinKm)} label="km MICHELIN" />
            <Stat value={nf.format(data.stravaKm)} label="km parcourus" />
            <Stat value={nf.format(data.rides)} label="sorties" />
          </div>

          {/* Déconnexion (toujours visible desktop ; en bas sur mobile) */}
          <form
            action="/api/auth/logout"
            method="post"
            className="mt-6 hidden md:block"
          >
            <Button type="submit" variant="outline" className="w-full">
              Se déconnecter
            </Button>
          </form>
        </section>

        {/* Colonne menu */}
        <nav
          aria-label="Réglages du compte"
          className="mt-6 overflow-hidden rounded-2xl ring-1 ring-foreground/10 md:mt-0 md:rounded-none md:ring-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible"
        >
          {items.map((item, i) => (
            <MenuRow key={`${item.title}-${i}`} item={item} />
          ))}
        </nav>
      </div>

      {/* Déconnexion mobile */}
      <form
        action="/api/auth/logout"
        method="post"
        className="mt-6 md:hidden"
      >
        <Button type="submit" variant="outline" className="w-full">
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}

type MenuItem = {
  href: string;
  title: string;
  subtitle: string;
  Icon: IconCmp;
  badge?: number;
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl px-2 py-4 text-center ring-1 ring-foreground/10">
      <span className="text-xl font-bold leading-none md:text-2xl">{value}</span>
      <span className="mt-1.5 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const { Icon } = item;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50",
        // Séparateur entre lignes sur mobile ; carte autonome sur desktop.
        "not-first:border-t not-first:border-border",
        "md:rounded-2xl md:border-0 md:ring-1 md:ring-foreground/10 md:not-first:border-t-0"
      )}
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: "#E8F1FC", color: MICHELIN_BLUE }}
      >
        <Icon size={24} color="currentColor" variant="Bold" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold leading-tight">{item.title}</span>
        <span className="block truncate text-sm text-muted-foreground">
          {item.subtitle}
        </span>
      </span>
      {item.badge != null && (
        <span
          className="flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white"
          style={{ backgroundColor: MICHELIN_BLUE }}
        >
          {item.badge}
        </span>
      )}
      <ArrowRight2 size={20} className="shrink-0 text-muted-foreground" />
    </Link>
  );
}

/** Picto vélo (iconsax ne fournit pas de vélo). */
function BikeIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5 9 9h5l3 8.5M9 9l-1.5-3H6m8 3 1.2-3H17" />
    </svg>
  );
}

/** Picto recyclage. */
function RecycleIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 19H4.5a2 2 0 0 1-1.7-3l2-3.3M12 4.5l2 3.4M9 4.5h3.4a2 2 0 0 1 1.7 1l1.6 2.7" />
      <path d="m17.5 9 1.8 3.2a2 2 0 0 1 .2 1.6M14 19h3.5a2 2 0 0 0 1.7-1l.3-.5" />
      <path d="m4.5 12 .8-2.8 2.8.8M14 19l1.7-2.4 2.4 1.7M16 9.4l2.9-.6.6 2.9" />
    </svg>
  );
}
