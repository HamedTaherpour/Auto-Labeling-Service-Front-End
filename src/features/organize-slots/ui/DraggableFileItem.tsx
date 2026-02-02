import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatasetFile } from '@/shared/api/dataset-api';
import { FileImage, FileVideo, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableFileItemProps {
  file: DatasetFile;
  isBeingDragged?: boolean;
}

export function DraggableFileItem({ file, isBeingDragged }: DraggableFileItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: file.id,
    data: {
      type: 'file',
      file,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const getFileIcon = () => {
    return file.type === 'video' ? (
      <FileVideo className="h-4 w-4" />
    ) : (
      <FileImage className="h-4 w-4" />
    );
  };

  const getStatusColor = () => {
    switch (file.status) {
      case 'Complete':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Review':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Labeling':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Unprocessed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#FF6300]/30 transition-all duration-200 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 scale-105 shadow-lg border-[#FF6300]",
        isBeingDragged && "ring-2 ring-[#FF6300] ring-offset-2 ring-offset-[#0A0A0A]"
      )}
      {...listeners}
      {...attributes}
    >
      <div className="p-3 space-y-2">
        {/* Drag Handle */}
        <div className="flex items-center justify-between">
          <GripVertical className="h-4 w-4 text-gray-400" />
          {getFileIcon()}
        </div>

        {/* File Info */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-white truncate" title={file.name}>
            {file.name}
          </h4>

          <Badge className={cn("text-xs", getStatusColor())}>
            {file.status}
          </Badge>
        </div>

        {/* File Stats */}
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Annotations:</span>
            <span>{file.annotations}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{(file.size / 1024 / 1024).toFixed(1)}MB</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Preview */}
      {file.thumbnailUrl && (
        <div className="aspect-video bg-[#1A1A1A] rounded-b-md overflow-hidden">
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </Card>
  );
}