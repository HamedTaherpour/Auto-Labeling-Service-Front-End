import { Annotation } from "../../../entities/annotation";
import { cn } from "@/lib/utils";

interface ConsensusOverlayProps {
  annotations: Annotation[][];
  className?: string;
}

// Colors for different annotation sources
const consensusColors = [
  { border: "border-blue-500", bg: "bg-blue-500/10", label: "AI Model 1" },
  { border: "border-green-500", bg: "bg-green-500/10", label: "AI Model 2" },
  {
    border: "border-purple-500",
    bg: "bg-purple-500/10",
    label: "Human Labeler A",
  },
  {
    border: "border-orange-500",
    bg: "bg-orange-500/10",
    label: "Human Labeler B",
  },
  { border: "border-pink-500", bg: "bg-pink-500/10", label: "Consensus" },
];

export function ConsensusOverlay({
  annotations,
  className,
}: ConsensusOverlayProps) {
  if (!annotations.length) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1A1A1A] rounded-lg p-3">
        <div className="text-sm font-medium text-white mb-2">
          Consensus View
        </div>
        <div className="space-y-1">
          {annotations.map((sourceAnnotations, sourceIndex) => {
            const color = consensusColors[sourceIndex % consensusColors.length];
            return (
              <div
                key={sourceIndex}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className={cn(
                    "w-3 h-3 border rounded",
                    color.border,
                    color.bg
                  )}
                />
                <span className="text-gray-300">{color.label}</span>
                <span className="text-gray-500">
                  ({sourceAnnotations.length})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Annotation Overlays */}
      {annotations.map((sourceAnnotations, sourceIndex) =>
        sourceAnnotations.map((annotation) => {
          const color = consensusColors[sourceIndex % consensusColors.length];
          const isBbox = annotation.type === "bbox";

          if (!isBbox) return null; // Only show bounding boxes for consensus

          const [x, y, width, height] = annotation.coordinates;

          return (
            <div
              key={`${sourceIndex}-${annotation.id}`}
              className={cn(
                "absolute border-2 pointer-events-none opacity-70",
                color.border
              )}
              style={{
                left: x,
                top: y,
                width,
                height,
                backgroundColor:
                  sourceIndex === annotations.length - 1
                    ? "rgba(255, 99, 0, 0.1)" // Consensus highlight
                    : undefined,
              }}
            >
              {/* Source Label */}
              <div
                className={cn(
                  "absolute -top-6 left-0 text-xs font-medium px-1 py-0.5 rounded",
                  color.bg,
                  color.border,
                  "border"
                )}
              >
                {consensusColors[sourceIndex % consensusColors.length].label}
              </div>
            </div>
          );
        })
      )}

      {/* Discrepancy Indicators */}
      <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1A1A1A] rounded-lg p-3">
        <div className="text-sm text-white mb-2">Discrepancy Analysis</div>
        <div className="space-y-1 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>High Agreement:</span>
            <span className="text-green-400">78%</span>
          </div>
          <div className="flex justify-between">
            <span>Medium Agreement:</span>
            <span className="text-yellow-400">15%</span>
          </div>
          <div className="flex justify-between">
            <span>Low Agreement:</span>
            <span className="text-red-400">7%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
