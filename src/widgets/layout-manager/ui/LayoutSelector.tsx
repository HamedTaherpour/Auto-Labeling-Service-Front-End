import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, Star } from 'lucide-react';
import { Layout } from '@/entities/slot';
import { useLayoutStore } from '@/shared/store/layout-store';
import { cn } from '@/lib/utils';

interface LayoutSelectorProps {
  className?: string;
}

export function LayoutSelector({ className }: LayoutSelectorProps) {
  const { currentLayout, availableLayouts, setLayout, saveDefaultLayout } = useLayoutStore();
  const [isSavingDefault, setIsSavingDefault] = useState(false);

  const handleLayoutSelect = (layout: Layout) => {
    setLayout(layout);
  };

  const handleSaveDefault = async (layout: Layout) => {
    setIsSavingDefault(true);
    try {
      await saveDefaultLayout(layout);
    } catch (error) {
      console.error('Failed to save default layout:', error);
    } finally {
      setIsSavingDefault(false);
    }
  };

  const renderGridPreview = (layout: Layout) => {
    const cells = [];
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        cells.push(
          <div
            key={`${row}-${col}`}
            className="aspect-square bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm"
          />
        );
      }
    }

    return (
      <div
        className="grid gap-1 p-3 bg-[#0A0A0A] rounded-md border border-[#1A1A1A]"
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
          gridTemplateRows: `repeat(${layout.rows}, 1fr)`
        }}
      >
        {cells}
      </div>
    );
  };

  return (
    <Card className={cn("bg-[#0A0A0A] border-[#1A1A1A]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Layout Selector
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-gray-400 mb-4">
          Choose a grid layout for your annotation workspace. Drag files from the gallery to assign them to slots.
        </div>

        {/* Current Layout Display */}
        <div className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Current Layout</span>
            <Badge variant="secondary" className="bg-[#FF6300]/10 text-[#FF6300] border-[#FF6300]/20">
              {currentLayout.name}
            </Badge>
          </div>
          {renderGridPreview(currentLayout)}
        </div>

        {/* Available Layouts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableLayouts.map((layout) => (
            <div
              key={layout.id}
              className={cn(
                "relative group cursor-pointer transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                currentLayout.id === layout.id && "ring-2 ring-[#FF6300] ring-offset-2 ring-offset-[#0A0A0A]"
              )}
              onClick={() => handleLayoutSelect(layout)}
            >
              <div className="aspect-square bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 hover:border-[#FF6300]/50 transition-colors">
                {renderGridPreview(layout)}

                {/* Layout name overlay */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
                      {layout.name}
                    </span>

                    {layout.isDefault && (
                      <Star className="h-3 w-3 text-[#FF6300] fill-current" />
                    )}
                  </div>
                </div>
              </div>

              {/* Set as Default button */}
              {!layout.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveDefault(layout);
                  }}
                  disabled={isSavingDefault}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-[#FF6300] hover:bg-[#FF6300]/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Layout Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Click any layout to apply it immediately</div>
          <div>• Hover over layouts to see set default option</div>
          <div>• Starred layouts are saved as your default</div>
        </div>
      </CardContent>
    </Card>
  );
}