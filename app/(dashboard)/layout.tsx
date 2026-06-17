import { SiteHeader } from "@/components/site-header";
import { readSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await readSession();

  return (
    <>
      <SiteHeader avatar={session?.athlete.profile} />
      {/* pb mobile : laisse la place à la barre de nav fixe du bas. */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </>
  );
}
