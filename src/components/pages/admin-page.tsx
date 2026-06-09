import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PalletManager } from "../sections/pallet-manager";
import { CameraFeed, type SelectedPallet } from "../sections/camera-feed";
import AddNewPallet from "../sections/add-new-pallet"; // Don't forget to import this!

export default function AdminPage() {
  const [selectedPallet, setSelectedPallet] = useState<SelectedPallet | null>(null);
  const [isCreatingPallet, setIsCreatingPallet] = useState(false);

  return (
    <main className="flex flex-row flex-1 min-h-0">
      {/* Left Column: Admin Pallet Management Board */}
      <div className="flex flex-1 px-4 py-6 lg:px-8">
        <PalletManager
          isAdmin={true} // Explicitly passes true so admin capabilities show here
          selectedPalletId={selectedPallet?.id ?? null}
          onPalletSelect={(pallet) => {
            setIsCreatingPallet(false); // Close form if clicking a real asset card
            setSelectedPallet(pallet);
          }}
          onAddNewPalletClick={() => {
            setSelectedPallet(null); // Clear selected asset focus
            setIsCreatingPallet(true); // Mount form state panel
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
              console.log("Admin Dashboard - New Pallet Saved:", newData);
              setIsCreatingPallet(false);
            }}
          />
        ) : (
          <CameraFeed 
            isAdmin={true} // Explicitly passes true to allow descriptions editing
            selectedPallet={selectedPallet} 
          />
        )}
      </div>
    </main>
  );
}