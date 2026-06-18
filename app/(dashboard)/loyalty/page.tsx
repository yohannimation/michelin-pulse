import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress";
import { Medal, TickCircle, Timer1 } from "iconsax-react";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { getProfileData } from "@/lib/profile";
import { getGarage } from "@/lib/garage";
import { ScanBikeButton } from "@/components/loyalty/ScanBikeButton";

interface LevelInterface {
  step: string
  state: "pending" | "current" | "complete"
  advantage: string
}

const LOYALTY_MILESTONES = [
  { km: 1000, advantage: "- 5%" },
  { km: 2500, advantage: "- 10%" },
  { km: 5000, advantage: "- 15%" },
  { km: 7500, advantage: "- 30€" },
  { km: 10000, advantage: "- 40€" },
];

export default async function Loyalty() {
  const [profile, bikes] = await Promise.all([
    getProfileData(),
    getGarage(),
  ]);

  if (!profile) {
    return <div className="p-8 text-center">Erreur lors du chargement du profil.</div>;
  }

  const { michelinKm, tier } = profile;
  const firstIncompleteIndex = LOYALTY_MILESTONES.findIndex(m => michelinKm < m.km);

  const levels: LevelInterface[] = LOYALTY_MILESTONES.map((m, index) => ({
    step: `${m.km.toLocaleString()} km`,
    state: michelinKm >= m.km ? "complete" : (index === firstIncompleteIndex ? "current" : "pending"),
    advantage: m.advantage
  }));

  // Progress Calculation
  let progressValue = 0;
  let currentAdvantageText = "Aucun";
  let nextAdvantageText = "1 000 km";
  let kmToNext = 0;

  if (firstIncompleteIndex === -1) {
    progressValue = 100;
    currentAdvantageText = LOYALTY_MILESTONES[LOYALTY_MILESTONES.length - 1].advantage;
    nextAdvantageText = "Objectif atteint !";
    kmToNext = 0;
  } else {
    const nextMilestone = LOYALTY_MILESTONES[firstIncompleteIndex];
    const prevKm = firstIncompleteIndex > 0 ? LOYALTY_MILESTONES[firstIncompleteIndex - 1].km : 0;

    progressValue = ((michelinKm - prevKm) / (nextMilestone.km - prevKm)) * 100;
    kmToNext = nextMilestone.km - michelinKm;
    currentAdvantageText = firstIncompleteIndex > 0 ? LOYALTY_MILESTONES[firstIncompleteIndex - 1].advantage : "Aucun";
    nextAdvantageText = `${kmToNext.toLocaleString()} km avant ${nextMilestone.advantage}`;
  }

  return (
    <div className="mx-auto max-w-5xl px-2 pt-2 md:px-5 md:pt-5">
      <MobileTopBar avatar={profile.avatar} initials={profile.initials} />

      <div className="grid grid-cols-3 gap-5 py-8">
        <div className="col-span-full xl:col-span-1">
          <div className="flex flex-col gap-5 p-6 rounded-3xl bg-michelin-blue text-white">
            <div className="flex justify-between items-center">
              <Badge>Membre {tier.toUpperCase()}</Badge>
              <Medal size="24" className="text-michelin-yellow" variant="Bold" />
            </div>
            <div>
              <p>
                <span className="font-heading text-5xl font-bold">
                  {michelinKm.toLocaleString()}
                </span>{" "}
                km
              </p>
              <p>Parcourus sur pneu Michelin vérifiés.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Progress value={progressValue} />
              <div className="flex justify-between">
                <span>Palier {currentAdvantageText}</span>
                <span>{nextAdvantageText}</span>
              </div>
            </div>
          </div>

          <ScanBikeButton bikes={bikes} />
          <p className="mt-1 text-center text-muted-foreground">Vérifiez l&apos;authenticité de vos pneu Michelin pour cumuler vos kilometres</p>
        </div>
        <div className="col-span-full xl:col-span-2">
          <h2 className="font-heading text-lg font-bold">Vos paliers de réduction</h2>
          <ul className="flex flex-col gap-3 mt-3">
            {
              levels.map((level, index) => (
                <li key={index}>
                  <Item variant={"outline"} className={level.state === "current" ? "border-2 border-michelin-blue" : ""}>
                    <ItemMedia variant="icon">
                      {
                        (level.state == "complete") ? (
                          <TickCircle className="text-michelin-eco" variant="Bold"/>
                        ) :
                        (level.state == "current") ? (
                          <Medal className="text-michelin-blue" variant="Bold"/>
                        ) : (
                          <Timer1 className="text-border" variant="Bold"/>
                        )
                      }
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="font-heading text-lg font-bold">{level.step}</ItemTitle>
                      <ItemDescription className="capitalize">{level.state}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge
                        variant={
                          level.state === "current" ?
                            "default" :
                            level.state === "complete" ?
                              "confirm" :
                              "outline"
                        }>{level.advantage}</Badge>
                    </ItemActions>
                  </Item>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
