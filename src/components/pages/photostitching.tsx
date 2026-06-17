import React, { useState, useEffect, type TouchEvent } from "react";
import { ImageIcon, Loader2, UploadCloud, ChevronLeft, ChevronRight, Eye, AlertTriangle } from "lucide-react";

export default function PhotoStitchingPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [stitchedImage, setStitchedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which image is currently selected for the detailed view below the carousel
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // For touch swiping navigation on HMI screens
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Generate local preview URLs and handle memory cleanup
  useEffect(() => {
    if (!selectedFiles) {
      setImagePreviews([]);
      setActiveIndex(null);
      return;
    }

    const objectUrls = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews(objectUrls);
    setActiveIndex(0);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  // AUTOMATIC STITCH TRIGGER
  useEffect(() => {
    if (selectedFiles && selectedFiles.length >= 2) {
      handleUploadAndStitch();
    }
  }, [selectedFiles]);

  useEffect(() => {
    if (activeIndex === null || imagePreviews.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, imagePreviews]);

  // Navigation Logic
  const handlePrevImage = () => {
    setActiveIndex((prev) => 
      prev !== null ? (prev === 0 ? imagePreviews.length - 1 : prev - 1) : null
    );
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => 
      prev !== null ? (prev === imagePreviews.length - 1 ? 0 : prev + 1) : null
    );
  };

  // Touch handlers for direct HMI panel swiping
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStart === null) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      handleNextImage(); 
      setTouchStart(null);
    } else if (diff < -50) {
      handlePrevImage(); 
      setTouchStart(null);
    }
  };

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
    setError(null);
    setStitchedImage(null);
    
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/stitch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        try {
          const errData = await response.json();
          throw new Error(errData.detail || "OpenCV stitching routine failed.");
        } catch {
          throw new Error("ERR_HOMOGRAPHY_FAIL: Invalid image data or matching keypoints not found between adjacent frames.");
        }
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setStitchedImage(imageUrl);
    } catch (err: any) {
      console.error("Error processing images:", err);
      if (err.message && err.message.includes("Failed to fetch")) {
        setError("ERR_CONNECTION_REFUSED: Could not connect to OpenCV backend server.");
      } else {
        setError(err.message || "ERR_HOMOGRAPHY_FAIL: Invalid images. Keypoints could not be computed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 w-full h-full min-h-0">
        
        {/* LEFT PANEL: Controls & Settings */}
        <div className="flex flex-col justify-between p-8 border-r border-border overflow-y-auto h-full bg-card/30">
          <div className="flex-1 flex flex-col gap-6 min-h-0">
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
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-5 cursor-pointer hover:bg-muted/40 transition-all bg-card shadow-sm shrink-0">
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <span className="font-semibold text-sm">Select Images</span>
              <span className="text-xs text-muted-foreground mt-0.5">Select 2 or more consecutive photos</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </label>

            {/* Horizontal Scrollable Image Carousel Container */}
            {imagePreviews.length > 0 && (
              <div className="flex-1 flex flex-col gap-4 bg-card border border-border p-4 rounded-xl shadow-sm min-h-0">
                <div className="shrink-0">
                  <p className="text-sm font-semibold text-foreground">
                    Queued Batch ({imagePreviews.length} frames)
                  </p>
                  <p className="text-[11px] text-muted-foreground">Click a frame below to view independently</p>
                </div>
                
                {/* Track Strip */}
                <div className="flex gap-3 overflow-x-auto pb-1 shrink-0 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                  {imagePreviews.map((url, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveIndex(i)}
                      className={`flex-none w-20 h-20 relative rounded-lg border-2 overflow-hidden bg-muted transition-all cursor-pointer shadow-sm ${
                        activeIndex === i ? "border-primary scale-[0.98]" : "border-border hover:border-muted-foreground/40"
                      }`}
                    >
                      <img 
                        src={url} 
                        alt={`Preview fragment ${i + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded font-mono">
                        #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* BIGGER INLINE INDIVIDUAL IMAGE VIEW WINDOW */}
                {activeIndex !== null && (
                  <div 
                    className="flex-1 border border-border/80 rounded-lg bg-muted/20 relative overflow-hidden flex flex-col items-center justify-center p-4 min-h-[280px]"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                  >
                    {/* Left Swiping Arrow Trigger */}
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 hover:bg-background border border-border shadow-md transition-colors text-foreground/80 z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Active Mid Frame Viewport */}
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={imagePreviews[activeIndex]} 
                        alt={`Focused segment ${activeIndex + 1}`} 
                        className="max-w-full max-h-[380px] object-contain rounded border border-border shadow-sm bg-black/5 transition-all duration-200"
                      />
                    </div>

                    {/* Status Meta Info Badge */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border/80 shadow-sm">
                      <Eye className="w-3 h-3" />
                      Frame Segment {activeIndex + 1} of {imagePreviews.length}
                    </div>

                    {/* Right Swiping Arrow Trigger */}
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 hover:bg-background border border-border shadow-md transition-colors text-foreground/80 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Trigger at bottom left edge */}
          <div className="pt-6 mt-6 border-t border-border shrink-0">
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
                "Re-Stitch Frame Images"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Camera/Stitch Output Preview Area */}
        <div className="flex flex-col p-8 bg-muted/10 h-full min-h-0">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Stitched Live View</h2>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center border border-border rounded-xl bg-card/60 dark:bg-black/20 relative overflow-hidden shadow-inner p-6">
            {loading ? (
              <div className="text-center p-8 max-w-sm mx-auto flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <h3 className="text-sm font-semibold text-foreground/80">Stitching Pipeline Active</h3>
                <p className="text-xs text-muted-foreground">Uploading components and executing feature alignment...</p>
              </div>
            ) : error ? (
              /* STITCH FAILURE VIEWPORT WITH EXPLICIT KEYPOINT RUNTIME ERROR */
              <div className="text-center p-8 max-w-md mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <div className="mb-4 p-3 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                  <AlertTriangle className="w-10 h-10 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-destructive mb-1">Stitching Routine Failed</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  OpenCV could not process this batch sequence due to the following reason:
                </p>
                <div className="w-full bg-destructive/5 dark:bg-destructive/10 border border-destructive/20 text-destructive-foreground dark:text-red-400 font-mono text-xs px-4 py-3 rounded-lg text-left overflow-x-auto whitespace-pre-wrap max-h-[140px] shadow-inner select-text">
                  {error}
                </div>
              </div>
            ) : stitchedImage ? (
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