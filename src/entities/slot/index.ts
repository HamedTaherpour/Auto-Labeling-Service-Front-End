// Slot entity types and re-exports
export interface Slot {
  id: string;
  slotName: string;
  fileId?: string; // Optional - slot can be empty
  layoutPosition: {
    row: number;
    col: number;
  };
  isActive: boolean; // For full-screen mode
}

export interface Layout {
  id: string;
  name: string; // e.g., "1x1", "1x2", "2x2", etc.
  rows: number;
  columns: number;
  isDefault?: boolean;
}

export interface SlotAssignment {
  itemId: string;
  slots: Slot[];
}

// Re-export UI components
export { SlotContainer } from './ui/SlotContainer';