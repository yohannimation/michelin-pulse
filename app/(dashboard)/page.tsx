import Image from "next/image";

import { Button } from "@/components/ui/button";
import { readSession } from "@/lib/session";

export default async function Dashboard() {
  const session = await readSession();
  const athlete = session?.athlete;

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-3">
        {athlete?.profile && (
          <Image
            src={athlete.profile}
            alt=""
            width={72}
            height={72}
            className="size-18 rounded-full ring-1 ring-foreground/10"
            unoptimized
          />
        )}
        <h1 className="text-2xl font-bold">
          Bonjour {athlete?.firstname ?? "athlète"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Connecté à Strava{athlete ? ` · #${athlete.id}` : ""}
        </p>
      </div>

      <form action="/api/auth/logout" method="post">
        <Button type="submit" variant="outline">
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}
