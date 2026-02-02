import { apiClient } from "./client";
import type { Layout, Slot, SlotAssignment } from '../../entities/slot';

// Types for API responses
export interface LayoutConfig {
  id: string;
  name: string;
  rows: number;
  columns: number;
  isDefault: boolean;
}

export interface ItemSlotsResponse {
  itemId: string;
  layout: LayoutConfig;
  slots: Slot[];
}

// Layout management API
export const layoutApi = {
  // Set default layout preference
  async setDefaultLayout(layout: Layout): Promise<void> {
    try {
      const requestData = {
        layoutId: layout.id,
        name: layout.name,
        rows: layout.rows,
        columns: layout.columns,
      };

      await apiClient.post('/api/v1/layouts/set-default', requestData);
    } catch (error) {
      console.error("Failed to set default layout:", error);
      throw error;
    }
  },

  // Get default layout for user
  async getDefaultLayout(): Promise<Layout | null> {
    try {
      const response = await apiClient.get('/api/v1/layouts/default');
      const data = response.data;

      if (!data) return null;

      return {
        id: data.layoutId,
        name: data.name,
        rows: data.rows,
        columns: data.columns,
        isDefault: true,
      };
    } catch (error) {
      console.error("Failed to get default layout:", error);
      // Return null instead of throwing to allow fallback to default
      return null;
    }
  },

  // Get slots configuration for an item
  async getItemSlots(itemId: string): Promise<ItemSlotsResponse> {
    try {
      const response = await apiClient.get(`/api/v1/items/${itemId}/slots`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get slots for item ${itemId}:`, error);
      throw error;
    }
  },

  // Assign files to slots for an item
  async assignSlotsToItem(itemId: string, slots: Slot[]): Promise<void> {
    try {
      const requestData: SlotAssignment = {
        itemId,
        slots: slots.map(slot => ({
          ...slot,
          // Ensure we only send the necessary data
          id: slot.id,
          slotName: slot.slotName,
          fileId: slot.fileId,
          layoutPosition: slot.layoutPosition,
          isActive: slot.isActive,
        })),
      };

      await apiClient.put(`/api/v1/items/${itemId}/slots/assign`, requestData);
    } catch (error) {
      console.error(`Failed to assign slots for item ${itemId}:`, error);
      throw error;
    }
  },

  // Create a new layout configuration
  async createLayout(layout: Omit<Layout, 'id'>): Promise<Layout> {
    try {
      const requestData = {
        name: layout.name,
        rows: layout.rows,
        columns: layout.columns,
      };

      const response = await apiClient.post('/api/v1/layouts', requestData);
      const data = response.data;

      return {
        id: data.id,
        name: data.name,
        rows: data.rows,
        columns: data.columns,
        isDefault: data.isDefault || false,
      };
    } catch (error) {
      console.error("Failed to create layout:", error);
      throw error;
    }
  },

  // Get all available layouts
  async getLayouts(): Promise<Layout[]> {
    try {
      const response = await apiClient.get('/api/v1/layouts');
      const layouts = response.data.layouts || response.data;

      return layouts.map((layout: any) => ({
        id: layout.id || layout.layoutId,
        name: layout.name,
        rows: layout.rows,
        columns: layout.columns,
        isDefault: layout.isDefault || false,
      }));
    } catch (error) {
      console.error("Failed to get layouts:", error);
      // Return default layouts if API fails
      return [
        { id: '1x1', name: '1x1', rows: 1, columns: 1 },
        { id: '1x2', name: '1x2', rows: 1, columns: 2 },
        { id: '2x2', name: '2x2', rows: 2, columns: 2 },
        { id: '2x3', name: '2x3', rows: 2, columns: 3 },
        { id: '3x3', name: '3x3', rows: 3, columns: 3 },
      ];
    }
  },
};