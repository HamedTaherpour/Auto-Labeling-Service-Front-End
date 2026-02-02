import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnnotationClass } from "../../../entities/annotation";
import { Tag, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassManagerProps {
  classes: AnnotationClass[];
  selectedClass: AnnotationClass | null;
  onClassChange: (cls: AnnotationClass) => void;
  className?: string;
}

export function ClassManager({
  classes,
  selectedClass,
  onClassChange,
  className,
}: ClassManagerProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-5 w-5 text-[#FF6300]" />
          <h3 className="text-lg font-semibold text-white">Classes</h3>
        </div>
        <p className="text-sm text-gray-400">
          Select a class before drawing annotations
        </p>
      </div>

      {/* Class List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {classes.map((cls) => {
            const isSelected = selectedClass?.id === cls.id;

            return (
              <Button
                key={cls.id}
                variant="ghost"
                onClick={() => onClassChange(cls)}
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 text-left",
                  isSelected
                    ? "bg-[#FF6300]/10 border border-[#FF6300]/20"
                    : "hover:bg-[#1A1A1A]",
                )}
              >
                {/* Color Indicator */}
                <div
                  className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0"
                  style={{ backgroundColor: cls.color }}
                />

                {/* Class Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-[#FF6300]" : "text-white",
                      )}
                    >
                      {cls.name}
                    </span>

                    {/* Shortcut Badge */}
                    {cls.shortcut && (
                      <Badge
                        variant="secondary"
                        className="ml-2 text-xs bg-[#1A1A1A] border-[#2A2A2A] text-gray-400"
                      >
                        {cls.shortcut}
                      </Badge>
                    )}
                  </div>

                  {/* Color Hex */}
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {cls.color}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <Separator className="bg-[#1A1A1A]" />

      {/* Footer */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Palette className="h-4 w-4" />
          <span>{classes.length} classes loaded</span>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A]"
          >
            Add Class
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A]"
          >
            Import Classes
          </Button>
        </div>
      </div>
    </div>
  );
}
