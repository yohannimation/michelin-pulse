"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Scan, Bike } from "lucide-react";
import { useRouter } from "next/navigation";
import { GarageBike } from "@/lib/garage";
import { Badge } from "@/components/ui/badge";

export function ScanBikeButton({ bikes }: { bikes: GarageBike[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleBikeSelect = (bikeId: string) => {
    setIsOpen(false);
    router.push(`/profile/my-bike/${bikeId}/add`);
  };

  return (
    <>
      <Button
        size={"xl"}
        className="mt-4 w-full rounded-3xl"
        onClick={() => setIsOpen(true)}
      >
        <Scan size="32" /> Scanner le code-barres d&apos;un pneu
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Choisir un vélo"
      >
        <div className="flex flex-col gap-3">
          {bikes.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucun vélo trouvé dans votre garage.
            </p>
          ) : (
            bikes.map((bike) => (
              <button
                key={bike.id}
                onClick={() => handleBikeSelect(bike.id)}
                className="flex items-center justify-between p-4 rounded-2xl border-2 border-border hover:border-michelin-blue transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted group-hover:bg-michelin-blue-light">
                    <Bike size={20} className="text-muted-foreground group-hover:text-michelin-blue" />
                  </div>
                  <div>
                    <p className="font-bold">{bike.name}</p>
                    <p className="text-xs text-muted-foreground">{bike.type || "Vélo"}</p>
                  </div>
                </div>
                <Badge variant="outline" className="group-hover:bg-michelin-blue group-hover:text-white transition-colors">
                  Choisir
                </Badge>
              </button>
            ))
          )}
        </div>
      </Modal>
    </>
  );
}
