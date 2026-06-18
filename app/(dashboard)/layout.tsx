import { SiteHeader } from "@/components/site-header";
import { readSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await readSession();

  return (
    <>
      <SiteHeader avatar={session?.athlete.profile} />
      {/* Padding responsive aligné sur les points de rupture charte
          (360 / 600 / 960 / 1280 / 1920). pb mobile : place pour la nav fixe. */}
      <main className="flex-1 px-4 py-5 pb-16 sm:px-6 md:px-8 md:py-6 md:pb-0 lg:px-12 xl:px-20">
        {children}
      </main>
    </>
  );
}
