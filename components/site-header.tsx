"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Cup,
  Home2,
  Profile,
  Scan,
  ShoppingCart,
  type Icon as IconaxIcon,
} from "iconsax-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  Icon: IconaxIcon;
  isProfile?: boolean;
};

// Scan en 3e position : centré sur les deux formats (desktop et mobile
// partagent le même ordre).
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Accueil", Icon: Home2 },
  { href: "/event", label: "Événement", Icon: Calendar },
  { href: "/analysis", label: "Scan", Icon: Scan },
  { href: "/loyalty", label: "Fidélité", Icon: Cup },
  { href: "/shop", label: "Boutique", Icon: ShoppingCart },
  { href: "/profile", label: "Profil", Icon: Profile, isProfile: true },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function ItemIcon({
  item,
  active,
  avatar,
  size,
}: {
  item: NavItem;
  active: boolean;
  avatar?: string;
  size: number;
}) {
  if (item.isProfile && avatar) {
    return (
      <Image
        src={avatar}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full object-cover ring-1 ring-foreground/10",
          active && "ring-2 ring-michelin-blue"
        )}
        unoptimized
      />
    );
  }
  return (
    <item.Icon
      size={size}
      color="currentColor"
      variant={active ? "Bold" : "Linear"}
    />
  );
}

export function SiteHeader({ avatar }: { avatar?: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop : logo à gauche, items (texte) centrés. */}
      <header className="sticky top-0 z-50 hidden border-b border-border bg-background/85 backdrop-blur md:block">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
          <Link href="/" className="justify-self-start" aria-label="Accueil">
            <img
              src="/michelin-18.svg"
              alt="Michelin"
              className="h-[60px] w-auto"
            />
          </Link>

          <nav className="flex items-center justify-center gap-1">
            {NAV_ITEMS.filter((item) => !item.isProfile).map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-lg font-medium transition-colors",
                    active ? "text-michelin-blue" : "text-foreground hover:opacity-70"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Profil à droite */}
          {NAV_ITEMS.filter((item) => item.isProfile).map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex items-center justify-self-end rounded-lg px-4 py-2"
                aria-label={item.label}
              >
                <ItemIcon item={item} active={active} avatar={avatar} size={26} />
              </Link>
            );
          })}
        </div>
      </header>

      {/* Mobile : barre de navigation fixe en bas (icône au-dessus, label dessous). */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex items-stretch justify-around border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Navigation principale"
      >
        {NAV_ITEMS.filter((item) => !item.isProfile).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-michelin-blue" : "text-muted-foreground"
              )}
            >
              <ItemIcon item={item} active={active} avatar={avatar} size={24} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
