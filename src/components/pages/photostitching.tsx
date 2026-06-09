import React, { useState } from "react";
import { ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { Navbar } from "@/components/layout/navbar"; 

export default function PhotoStitchingPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [stitchedImage, setStitchedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUploadAndStitch = async () => {
    if (!selectedFiles || selectedFiles.length < 2) {
      alert("Please select at least 2 photos to stitch together.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/stitch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Stitching failed on the server.");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setStitchedImage(imageUrl);
    } catch (error) {
      console.error("Error processing images:", error);
      alert("An error occurred during image stitching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar /> 

      {/* Main Full-Height Dashboard Container */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 w-full h-full min-h-0">
        
        {/* LEFT PANEL: Controls & Settings */}
        <div className="flex flex-col justify-between p-8 border-r border-border overflow-y-auto h-full bg-card/30">
          <div className="flex flex-col gap-6">
            {/* Panel Header */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Photo Stitching Manager
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Upload consecutive panorama segments to process via OpenCV.
              </p>
            </div>

            {/* Dropzone area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-12 cursor-pointer hover:bg-muted/40 transition-all bg-card shadow-sm">
              <UploadCloud className="w-12 h-12 mb-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Select Images</span>
              <span className="text-xs text-muted-foreground mt-1">Select 2 or more consecutive photos</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </label>

            {/* Queued File List Container */}
            {selectedFiles && (
              <div className="flex flex-col gap-2 bg-card border border-border p-4 rounded-xl shadow-sm">
                <p className="text-sm font-semibold text-foreground">
                  Queued Batch ({selectedFiles.length} files)
                </p>
                <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                  {Array.from(selectedFiles).map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-border/50 truncate">
                      <span className="text-primary font-medium">#{i + 1}</span>
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger at bottom left edge */}
          <div className="pt-6 mt-6 border-t border-border">
            <button
              onClick={handleUploadAndStitch}
              disabled={loading || !selectedFiles}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 disabled:opacity-40 disabled:pointer-events-none shadow-md font-semibold tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing OpenCV Frame...
                </>
              ) : (
                "Stitch Frame Images"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Camera/Stitch Output Preview Area */}
        <div className="flex flex-col p-8 bg-muted/10 h-full min-h-0">
          {/* Section Label Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Stitched Live View</h2>
          </div>

          {/* Large Aspect Box Frame matching your layout image */}
          <div className="flex-1 flex flex-col items-center justify-center border border-border rounded-xl bg-card/60 dark:bg-black/20 relative overflow-hidden shadow-inner p-6">
            {stitchedImage ? (
              <div className="w-full h-full flex items-center justify-center p-2">
                <img 
                  src={stitchedImage} 
                  alt="Stitched output" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-border bg-black/10"
                />
              </div>
            ) : (
              <div className="text-center p-8 max-w-sm mx-auto">
                <ImageIcon className="w-14 h-14 mx-auto mb-4 text-muted-foreground/30 stroke-[1.5]" />
                <h3 className="text-sm font-semibold text-foreground/80 mb-1">No Stitched View Active</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select and execute an image stitching compilation on the left panel to render the live stream output here.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}