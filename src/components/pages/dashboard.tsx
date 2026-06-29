import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PalletManager } from "../sections/pallet-manager";
import { CameraFeed, type SelectedPallet } from "../sections/camera-feed";

export default function DashboardPage() {
  const [selectedPallet, setSelectedPallet] = useState<SelectedPallet | null>(
    null,
  );

  return (
    <main className="flex flex-row flex-1 min-h-0">
      <div className="flex flex-1 px-4 py-6 lg:px-8">
        <PalletManager
          isAdmin={false}
          selectedPalletId={selectedPallet?.id ?? null}
          onPalletSelect={setSelectedPallet}
        />
      </div>

      <Separator orientation="vertical" className="opacity-30" />

      <div className="flex flex-1 px-4 py-6 lg:px-8">
        <CameraFeed isAdmin={false} selectedPallet={selectedPallet} />
      </div>
    </main>
  );
}
