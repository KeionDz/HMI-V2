import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LayerSelectorProps {
  layers: number[];
  activeLayer: number;
  onLayerChange: (layer: number) => void;
  isAdmin?: boolean;
  onDeleteLayer?: (layer: number) => void;
}

export function LayerSelector({ layers, activeLayer, onLayerChange, isAdmin = false, onDeleteLayer }: LayerSelectorProps) {
  // Compute total pagination batches of 3
  const itemsPerPage = 3;
  const totalPages = Math.ceil(layers.length / itemsPerPage);

  // Find what page contains the current active layer so it automatically centers on load
  const activeLayerIndex = layers.indexOf(activeLayer);
  const initialPage = activeLayerIndex !== -1 ? Math.floor(activeLayerIndex / itemsPerPage) : 0;
  
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Drag tracking state pointers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Slice down array segment to show only the 3 layers matching current page
  const visibleLayers = layers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Pagination navigation triggers
  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  // Swiping Evaluation Core Core Logic (Requires > 50px delta swipe throw)
  const minSwipeDistance = 50;

  const onDragStart = (clientX: number) => {
    touchStartX.current = clientX;
    isDragging.current = true;
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    touchEndX.current = clientX;
  };

  const onDragEnd = () => {
    if (!isDragging.current || !touchStartX.current || !touchEndX.current) {
      isDragging.current = false;
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextPage();
    } else if (isRightSwipe) {
      handlePrevPage();
    }

    // Clean tracking structures
    isDragging.current = false;
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex items-center gap-2 w-full select-none">
      {/* Visual Navigation Carousels Side Track Controls (Improves desktop usability) */}
      {currentPage > 0 && (
        <button
          type="button"
          onClick={handlePrevPage}
          className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 text-zinc-400 hover:text-foreground transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Primary Trackable Pill Container Wrapper */}
      <div 
        className="flex flex-1 rounded-full bg-zinc-900 p-1 gap-1 relative overflow-hidden touch-none active:cursor-grabbing cursor-grab"
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {visibleLayers.map((layer) => {
          const isActive = layer === activeLayer;
          return (
            <button
              key={layer}
              type="button"
              onClick={() => onLayerChange(layer)}
              className={`cursor-pointer flex-1 flex items-center justify-between px-4 py-1.5 rounded-full text-sm font-medium transition-colors min-w-[80px]
                ${isActive
                  ? "bg-zinc-700 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/30"
                }`}
            >
              {isAdmin && isActive && layers.length > 1 ? <span className="w-4 h-4 shrink-0" /> : null}
              <span className="flex-1 text-center">Layer {layer}</span>
              {isAdmin && isActive && layers.length > 1 && onDeleteLayer && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer);
                  }}
                  title="Delete layer"
                  className="w-4 h-4 rounded-full bg-zinc-500 hover:bg-red-500 flex items-center justify-center transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {currentPage < totalPages - 1 && (
        <button
          type="button"
          onClick={handleNextPage}
          className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 text-zinc-400 hover:text-foreground transition-colors shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}