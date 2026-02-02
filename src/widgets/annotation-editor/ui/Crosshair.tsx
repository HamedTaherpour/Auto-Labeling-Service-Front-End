import { cn } from "@/lib/utils";

interface CrosshairProps {
  position: { x: number; y: number };
  visible: boolean;
  className?: string;
}

export function Crosshair({ position, visible, className }: CrosshairProps) {
  if (!visible) return null;

  return (
    <>
      {/* Vertical line */}
      <div
        className={cn(
          "fixed top-0 bottom-0 w-px bg-[#FF6300] pointer-events-none z-50",
          "shadow-[0_0_8px_rgba(255,99,0,0.5)]",
          className
        )}
        style={{
          left: position.x,
          transform: "translateX(-0.5px)",
        }}
      />

      {/* Horizontal line */}
      <div
        className={cn(
          "fixed left-0 right-0 h-px bg-[#FF6300] pointer-events-none z-50",
          "shadow-[0_0_8px_rgba(255,99,0,0.5)]",
          className
        )}
        style={{
          top: position.y,
          transform: "translateY(-0.5px)",
        }}
      />

      {/* Center dot */}
      <div
        className={cn(
          "fixed w-2 h-2 rounded-full bg-[#FF6300] pointer-events-none z-50",
          "shadow-[0_0_8px_rgba(255,99,0,0.5)]",
          className
        )}
        style={{
          left: position.x - 4,
          top: position.y - 4,
        }}
      />
    </>
  );
}
