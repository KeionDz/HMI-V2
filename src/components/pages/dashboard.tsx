import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PalletManager } from "../sections/pallet-manager";
import { CameraFeed, type SelectedPallet } from "../sections/camera-feed";
import AddNewPallet from "../sections/add-new-pallet";

export default function DashboardPage() {
  const [selectedPallet, setSelectedPallet] = useState<SelectedPallet | null>(
    null,
  );
  const [isCreatingPallet, setIsCreatingPallet] = useState(false);
  const isAdmin = false;

  return (
    <main className="flex flex-row flex-1 min-h-0">
      {/* Left Column: Pallet Management Board */}
      <div className="flex flex-1 px-4 py-6 lg:px-8">
        <PalletManager
          isAdmin={isAdmin}
          selectedPalletId={selectedPallet?.id ?? null}
          onPalletSelect={(pallet) => {
            setIsCreatingPallet(false); // Switch away from creation form
            setSelectedPallet(pallet);
          }}
          onAddNewPalletClick={() => {
            setSelectedPallet(null); // Clear selected item highlight
            setIsCreatingPallet(true); // Open creation panel
          }}
        />
      </div>

      <Separator orientation="vertical" className="opacity-30" />

      {/* Right Column: Dynamic Camera View or Setup Form Panel */}
      <div className="flex flex-1 px-4 py-6 lg:px-8">
        {isCreatingPallet ? (
          <AddNewPallet
            onCancel={() => setIsCreatingPallet(false)}
            onSave={(newData) => {
              console.log("New Pallet Payload Submitted:", newData);
              setIsCreatingPallet(false);
            }}
          />
        ) : (
          <CameraFeed isAdmin={isAdmin} selectedPallet={selectedPallet} />
        )}
      </div>
    </main>
  );
}
