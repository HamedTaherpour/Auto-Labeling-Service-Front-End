import { Button } from '@/components/ui/button';
import {
  MousePointer,
  Square,
  Pentagon,
  Zap,
  MessageCircle,
  Undo2,
  Save,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnotationToolbarProps {
  selectedTool: 'select' | 'bbox' | 'polygon' | 'ai' | 'comment';
  onToolChange: (tool: 'select' | 'bbox' | 'polygon' | 'ai' | 'comment') => void;
  onUndo: () => void;
  className?: string;
}

export function AnnotationToolbar({
  selectedTool,
  onToolChange,
  onUndo,
  className
}: AnnotationToolbarProps) {
  const tools = [
    {
      id: 'select' as const,
      icon: MousePointer,
      label: 'Select',
      shortcut: 'S',
    },
    {
      id: 'bbox' as const,
      icon: Square,
      label: 'Bounding Box',
      shortcut: 'B',
    },
    {
      id: 'polygon' as const,
      icon: Pentagon,
      label: 'Polygon',
      shortcut: 'P',
    },
    {
      id: 'comment' as const,
      icon: MessageCircle,
      label: 'Comment',
      shortcut: 'C',
    },
    {
      id: 'ai' as const,
      icon: Zap,
      label: 'Auto-Annotate',
      shortcut: 'A',
    },
  ];

  return (
    <div className={cn('flex flex-col items-center py-6 space-y-4', className)}>
      {/* Drawing Tools */}
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;

          return (
            <Button
              key={tool.id}
              variant="ghost"
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className={cn(
                'w-12 h-12 p-0 relative group',
                isSelected
                  ? 'bg-[#FF6300]/20 text-[#FF6300] border border-[#FF6300]/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
              )}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <Icon className="h-5 w-5" />

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#1A1A1A]">
                {tool.label}
                <div className="text-gray-400">{tool.shortcut}</div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-8 h-px bg-[#1A1A1A]" />

      {/* Action Tools */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          className="w-12 h-12 p-0 text-gray-400 hover:text-white hover:bg-[#1A1A1A] group relative"
          title="Undo (⌘Z)"
        >
          <Undo2 className="h-5 w-5" />

          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#1A1A1A]">
            Undo
            <div className="text-gray-400">⌘Z</div>
          </div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 text-gray-400 hover:text-white hover:bg-[#1A1A1A] group relative"
          title="Save Annotations"
        >
          <Save className="h-5 w-5" />

          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#1A1A1A]">
            Save
            <div className="text-gray-400">Auto-save enabled</div>
          </div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 text-gray-400 hover:text-white hover:bg-[#1A1A1A] group relative"
          title="Export Annotations"
        >
          <Download className="h-5 w-5" />

          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#1A1A1A]">
            Export
            <div className="text-gray-400">JSON / COCO</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
