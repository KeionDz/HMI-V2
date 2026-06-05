interface LayerSelectorProps {
  layers: number[];
  activeLayer: number;
  onLayerChange: (layer: number) => void;
  onAddLayer?: () => void; 
}

export function LayerSelector({ layers, activeLayer, onLayerChange, onAddLayer }: LayerSelectorProps) {
  return (
    <div className="bg-black border border-border/20 rounded-full p-1 flex w-full">
      {layers.map((layerNum) => (
        <button
          key={layerNum}
          onClick={() => onLayerChange(layerNum)}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            activeLayer === layerNum
              ? "bg-[#1d2338] text-foreground border border-border/50 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
          }`}
        >
          Layer {layerNum}
        </button>
      ))}
      
      {onAddLayer && (
        <button 
          onClick={onAddLayer}
          className="px-4 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          + Add
        </button>
      )}
    </div>
  );
}