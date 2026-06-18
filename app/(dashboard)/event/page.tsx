import { MobileTopBar } from "@/components/mobile-top-bar";
import { getGarage } from "@/lib/garage";
import { readSession } from "@/lib/session";

import { EventTabs } from "./event-tabs";

export default async function Event() {
  const session = await readSession();
  const athlete = session?.athlete;
  const initials = `${athlete?.firstname?.[0] ?? "A"}${
    athlete?.lastname?.[0] ?? "L"
  }`.toUpperCase();

  const garage = await getGarage();
  const hasScannedTyre = garage.some((bike) => bike.tyres.length > 0);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-2 pt-2 pb-6 md:px-5 md:pt-5">
      <MobileTopBar avatar={athlete?.profile} initials={initials} />

      <EventTabs hasScannedTyre={hasScannedTyre} />
    </div>
  );
}
