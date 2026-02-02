import { create } from 'zustand';
import type { Slot, Layout, SlotAssignment } from '../../entities/slot';
import { layoutApi } from '../api/layout-api';

interface LayoutState {
  // Current layout configuration
  currentLayout: Layout;
  availableLayouts: Layout[];

  // Slots management
  slots: Slot[];
  activeSlotId: string | null; // For full-screen mode

  // View synchronization
  syncZoom: boolean;
  zoomLevel: number;
  panPosition: { x: number; y: number };

  // Actions
  setLayout: (layout: Layout) => void;
  updateSlots: (slots: Slot[]) => void;
  assignFileToSlot: (slotId: string, fileId: string) => void;
  removeFileFromSlot: (slotId: string) => void;
  swapSlots: (slotId1: string, slotId2: string) => void;
  toggleFullscreen: (slotId: string | null) => void;
  toggleSyncZoom: () => void;
  updateZoom: (zoom: number, pan?: { x: number; y: number }) => void;
  saveDefaultLayout: (layout: Layout) => Promise<void>;
  loadLayoutForItem: (itemId: string) => Promise<void>;
  saveSlotAssignment: (itemId: string, slots: Slot[]) => Promise<void>;
}

const defaultLayouts: Layout[] = [
  { id: '1x1', name: '1x1', rows: 1, columns: 1 },
  { id: '1x2', name: '1x2', rows: 1, columns: 2 },
  { id: '2x1', name: '2x1', rows: 2, columns: 1 },
  { id: '2x2', name: '2x2', rows: 2, columns: 2 },
  { id: '1x3', name: '1x3', rows: 1, columns: 3 },
  { id: '3x1', name: '3x1', rows: 3, columns: 1 },
  { id: '2x3', name: '2x3', rows: 2, columns: 3 },
  { id: '3x2', name: '3x2', rows: 3, columns: 2 },
  { id: '3x3', name: '3x3', rows: 3, columns: 3 },
  { id: '4x4', name: '4x4', rows: 4, columns: 4 },
];

export const useLayoutStore = create<LayoutState>()((set, get) => ({
  // Initial state
  currentLayout: defaultLayouts[0], // Start with 1x1
  availableLayouts: defaultLayouts,
  slots: [],
  activeSlotId: null,
  syncZoom: false,
  zoomLevel: 1,
  panPosition: { x: 0, y: 0 },

  // Actions
  setLayout: (layout: Layout) => {
    const newSlots = generateSlotsForLayout(layout);
    set({
      currentLayout: layout,
      slots: newSlots,
      activeSlotId: null // Reset fullscreen when changing layout
    });
  },

  updateSlots: (slots: Slot[]) => {
    set({ slots });
  },

  assignFileToSlot: (slotId: string, fileId: string) => {
    const { slots } = get();
    const updatedSlots = slots.map(slot =>
      slot.id === slotId
        ? { ...slot, fileId }
        : slot
    );
    set({ slots: updatedSlots });
  },

  removeFileFromSlot: (slotId: string) => {
    const { slots } = get();
    const updatedSlots = slots.map(slot =>
      slot.id === slotId
        ? { ...slot, fileId: undefined }
        : slot
    );
    set({ slots: updatedSlots });
  },

  swapSlots: (slotId1: string, slotId2: string) => {
    const { slots } = get();
    const slot1 = slots.find(s => s.id === slotId1);
    const slot2 = slots.find(s => s.id === slotId2);

    if (!slot1 || !slot2) return;

    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId1) {
        return { ...slot, fileId: slot2.fileId };
      }
      if (slot.id === slotId2) {
        return { ...slot, fileId: slot1.fileId };
      }
      return slot;
    });

    set({ slots: updatedSlots });
  },

  toggleFullscreen: (slotId: string | null) => {
    const { slots, activeSlotId } = get();

    // If toggling off fullscreen or switching to a different slot
    if (activeSlotId === slotId) {
      // Turn off fullscreen
      const updatedSlots = slots.map(slot => ({ ...slot, isActive: false }));
      set({ activeSlotId: null, slots: updatedSlots });
    } else {
      // Turn on fullscreen for the specified slot
      const updatedSlots = slots.map(slot => ({
        ...slot,
        isActive: slot.id === slotId
      }));
      set({ activeSlotId: slotId, slots: updatedSlots });
    }
  },

  toggleSyncZoom: () => {
    const { syncZoom } = get();
    set({ syncZoom: !syncZoom });
  },

  updateZoom: (zoom: number, pan?: { x: number; y: number }) => {
    const { syncZoom } = get();
    if (syncZoom) {
      set({
        zoomLevel: zoom,
        panPosition: pan || get().panPosition
      });
    }
  },

  saveDefaultLayout: async (layout: Layout) => {
    try {
      await layoutApi.setDefaultLayout(layout);

      // Update local state to reflect the change
      const updatedLayout = { ...layout, isDefault: true };
      const { availableLayouts } = get();
      const updatedLayouts = availableLayouts.map(l =>
        l.id === layout.id ? updatedLayout : { ...l, isDefault: false }
      );

      set({ availableLayouts: updatedLayouts, currentLayout: updatedLayout });
    } catch (error) {
      console.error('Failed to save default layout:', error);
      throw error;
    }
  },

  loadLayoutForItem: async (itemId: string) => {
    try {
      const itemSlots = await layoutApi.getItemSlots(itemId);

      // Update the current layout and slots
      const layout: Layout = {
        id: itemSlots.layout.id,
        name: itemSlots.layout.name,
        rows: itemSlots.layout.rows,
        columns: itemSlots.layout.columns,
        isDefault: itemSlots.layout.isDefault,
      };

      set({
        currentLayout: layout,
        slots: itemSlots.slots
      });
    } catch (error) {
      console.error('Failed to load layout for item:', error);
      // Fallback to current layout if API fails
      const { currentLayout } = get();
      const slots = generateSlotsForLayout(currentLayout);
      set({ slots });
      throw error;
    }
  },

  saveSlotAssignment: async (itemId: string, slots: Slot[]) => {
    try {
      await layoutApi.assignSlotsToItem(itemId, slots);
      set({ slots });
    } catch (error) {
      console.error('Failed to save slot assignment:', error);
      throw error;
    }
  },
}));

// Helper function to generate slots for a layout
function generateSlotsForLayout(layout: Layout): Slot[] {
  const slots: Slot[] = [];
  let slotIndex = 0;

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      slots.push({
        id: `slot-${row}-${col}`,
        slotName: `Slot ${slotIndex + 1}`,
        layoutPosition: { row, col },
        isActive: false,
      });
      slotIndex++;
    }
  }

  return slots;
}