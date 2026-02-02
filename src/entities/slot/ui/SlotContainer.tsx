import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Upload, X } from 'lucide-react';
import { Slot } from '../index';
import { cn } from '@/lib/utils';

interface SlotContainerProps {
    slot: Slot;
    onFileDrop?: (fileId: string, slotId: string) => void;
    onToggleFullscreen?: (slotId: string) => void;
    onRemoveFile?: (slotId: string) => void;
    isFullscreen?: boolean;
    className?: string;
}

export function SlotContainer({
    slot,
    onFileDrop,
    onToggleFullscreen,
    onRemoveFile,
    isFullscreen = false,
    className
}: SlotContainerProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const fileId = e.dataTransfer.getData('text/plain');
        if (fileId && onFileDrop) {
            onFileDrop(fileId, slot.id);
        }
    };

    const handleToggleFullscreen = () => {
        onToggleFullscreen?.(slot.id);
    };

    const handleRemoveFile = () => {
        onRemoveFile?.(slot.id);
    };

    return (
        <Card
            className={cn(
                "relative bg-[#0A0A0A] border-[#1A1A1A] transition-all duration-200",
                isDragOver && "border-[#FF6300] bg-[#FF6300]/5",
                isFullscreen && "fixed inset-4 z-50",
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header with controls */}
            <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFullscreen}
                    className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                >
                    {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                    ) : (
                        <Maximize2 className="h-4 w-4" />
                    )}
                </Button>

                {slot.fileId && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Content area */}
            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
                {slot.fileId ? (
                    <div className="w-full h-full">
                        {/* Placeholder for annotation canvas */}
                        <div className="w-full h-full bg-[#1A1A1A] rounded-md flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <div className="text-sm font-medium mb-1">File: {slot.fileId}</div>
                                <div className="text-xs">Annotation Canvas</div>
                                {/* This would be replaced with the actual AnnotationCanvas component */}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 p-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">Drop file here</div>
                        <div className="text-xs text-gray-600">or drag from gallery</div>
                    </div>
                )}
            </div>

            {/* Slot info overlay */}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded border border-white/20">
                {slot.slotName} ({slot.layoutPosition.row}, {slot.layoutPosition.col})
            </div>

            {/* Active slot indicator */}
            {slot.isActive && (
                <div className="absolute inset-0 border-2 border-[#FF6300] rounded-md pointer-events-none" />
            )}
        </Card>
    );
}