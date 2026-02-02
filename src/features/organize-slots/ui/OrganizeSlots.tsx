import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useLayoutStore } from '@/shared/store/layout-store';
import { SlotContainer } from '@/entities/slot';
import { DatasetFile } from '@/shared/api/dataset-api';
import { DraggableFileItem } from './DraggableFileItem';
import { cn } from '@/lib/utils';

interface OrganizeSlotsProps {
  datasetFiles: DatasetFile[];
  className?: string;
}

export function OrganizeSlots({ datasetFiles, className }: OrganizeSlotsProps) {
  const {
    slots,
    assignFileToSlot,
    removeFileFromSlot,
    swapSlots,
    toggleFullscreen,
    toggleSyncZoom,
    syncZoom
  } = useLayoutStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dragging a file over a slot
    if (activeId.startsWith('file-') && overId.startsWith('slot-')) {
      // This will be handled in drag end
      return;
    }

    // If dragging between slots
    if (activeId.startsWith('slot-') && overId.startsWith('slot-')) {
      // This will be handled in drag end
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle file to slot assignment
    if (activeId.startsWith('file-') && overId.startsWith('slot-')) {
      const fileId = activeId;
      const slotId = overId;

      assignFileToSlot(slotId, fileId);
      return;
    }

    // Handle slot to slot swapping
    if (activeId.startsWith('slot-') && overId.startsWith('slot-') && activeId !== overId) {
      const slot1Id = activeId;
      const slot2Id = overId;

      swapSlots(slot1Id, slot2Id);
      return;
    }
  };

  const handleFileDrop = (fileId: string, slotId: string) => {
    assignFileToSlot(slotId, fileId);
  };

  const handleRemoveFile = (slotId: string) => {
    removeFileFromSlot(slotId);
  };

  const handleToggleFullscreen = (slotId: string) => {
    toggleFullscreen(slotId);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Annotation Workspace</h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={syncZoom}
              onChange={toggleSyncZoom}
              className="rounded border-gray-600 text-[#FF6300] focus:ring-[#FF6300]"
            />
            Sync Zoom
          </label>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Slots Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
          }}
        >
          {slots.map((slot) => (
            <SlotContainer
              key={slot.id}
              slot={slot}
              onFileDrop={handleFileDrop}
              onRemoveFile={handleRemoveFile}
              onToggleFullscreen={handleToggleFullscreen}
              className="min-h-[250px]"
            />
          ))}
        </div>

        {/* File Gallery for Drag Source */}
        {datasetFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-white mb-3">Available Files</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {datasetFiles.map((file) => (
                <DraggableFileItem
                  key={file.id}
                  file={file}
                  isBeingDragged={activeId === file.id}
                />
              ))}
            </div>
          </div>
        )}
      </DndContext>
    </div>
  );
}