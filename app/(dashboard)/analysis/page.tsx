import { MobileTopBar } from "@/components/mobile-top-bar";
import { getGarage } from "@/lib/garage";
import { readSession } from "@/lib/session";

import { ScanView } from "./scan-view";

export default async function Analysis() {
  const session = await readSession();
  const athlete = session?.athlete;
  const initials = `${athlete?.firstname?.[0] ?? "A"}${
    athlete?.lastname?.[0] ?? "L"
  }`.toUpperCase();

  const bikes = await getGarage();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-2 pt-2 pb-6 md:px-5 md:pt-5">
      <MobileTopBar avatar={athlete?.profile} initials={initials} />

      <div>
        <h1 className="font-heading text-xl font-bold">Scanner un pneu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Identifiez un pneu MICHELIN et suivez son usure sur votre vélo.
        </p>
      </div>

      <ScanView bikes={bikes} />
    </div>
  );
}
