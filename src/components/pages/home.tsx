import { Navbar } from "../layout/navbar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { PalletManager } from "../sections/pallet-manager.tsx";
import { CameraFeed, type SelectedPallet } from "../sections/camera-feed.tsx";
 
export default function Home() {
  const [selectedPallet, setSelectedPallet] = useState<SelectedPallet | null>(null);
 
  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <Separator className="opacity-30" />
      <main className="flex flex-row flex-1 min-h-0 px-4 lg:px-8">
        <PalletManager
          onPalletSelect={setSelectedPallet}
          selectedPalletId={selectedPallet?.id ?? null}
        />
        <Separator orientation="vertical" className="opacity-30 mx-6" />
        <CameraFeed selectedPallet={selectedPallet} />
      </main>
    </div>
  );
}