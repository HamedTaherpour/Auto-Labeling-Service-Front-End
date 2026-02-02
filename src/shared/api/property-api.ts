import { apiClient } from "./client";
import type {
  PropertySchema,
  PropertyValue,
  ItemProperties,
  PropertyCounts,
  PropertyCount
} from "@/entities/property";

// Property Schema Management
export interface CreatePropertyRequest {
  name: string;
  type: PropertySchema['type'];
  required: boolean;
  description?: string;
  options?: string[]; // For select types
  allowCustomValues?: boolean; // For select types
  maxSelections?: number; // For multi-select
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}

// Mock data for development - replace with actual API calls when backend is ready
const MOCK_PROPERTIES: Record<string, PropertySchema[]> = {};

// Helper function to generate default properties for any dataset
const generateDefaultProperties = (datasetId: string): PropertySchema[] => [
  {
    id: `prop-${datasetId}-1`,
    name: 'Camera Model',
    type: 'single_select',
    required: true,
    description: 'The camera model used to capture the image',
    datasetId,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    options: ['Canon EOS R5', 'Nikon Z7 II', 'Sony A7R IV', 'Fujifilm X-T4'],
    allowCustomValues: true,
  },
  {
    id: `prop-${datasetId}-2`,
    name: 'Weather',
    type: 'single_select',
    required: false,
    description: 'Weather conditions during capture',
    datasetId,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    options: ['Sunny', 'Cloudy', 'Rainy', 'Foggy', 'Snowy'],
    allowCustomValues: false,
  },
  {
    id: `prop-${datasetId}-3`,
    name: 'Location',
    type: 'text',
    required: false,
    description: 'Geographic location or scene description',
    datasetId,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    validation: {
      maxLength: 200,
    },
  },
  {
    id: `prop-${datasetId}-4`,
    name: 'Tags',
    type: 'multi_select',
    required: false,
    description: 'Additional tags for categorization',
    datasetId,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    options: ['Urban', 'Nature', 'Indoor', 'Outdoor', 'Portrait', 'Landscape'],
    allowCustomValues: true,
    maxSelections: 5,
  },
];

// Get all properties for a dataset
export const getDatasetProperties = async (datasetId: string): Promise<PropertySchema[]> => {
  // Mock implementation - simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!MOCK_PROPERTIES[datasetId]) {
    MOCK_PROPERTIES[datasetId] = generateDefaultProperties(datasetId);
  }

  return MOCK_PROPERTIES[datasetId];
};

// Create a new property for a dataset
export const createProperty = async (datasetId: string, property: CreatePropertyRequest): Promise<PropertySchema> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  const newProperty: PropertySchema = {
    id: `prop-${Date.now()}`,
    ...property,
    datasetId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as PropertySchema;

  if (!MOCK_PROPERTIES[datasetId]) {
    MOCK_PROPERTIES[datasetId] = [];
  }
  MOCK_PROPERTIES[datasetId].push(newProperty);
  return newProperty;
};

// Update an existing property
export const updateProperty = async (propertyId: string, updates: UpdatePropertyRequest): Promise<PropertySchema> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));

  for (const datasetId in MOCK_PROPERTIES) {
    const propertyIndex = MOCK_PROPERTIES[datasetId].findIndex(p => p.id === propertyId);
    if (propertyIndex !== -1) {
      const existingProperty = MOCK_PROPERTIES[datasetId][propertyIndex];
      const updatedProperty: PropertySchema = {
        ...existingProperty,
        ...updates,
        updatedAt: new Date().toISOString(),
      } as PropertySchema;
      MOCK_PROPERTIES[datasetId][propertyIndex] = updatedProperty;
      return updatedProperty;
    }
  }

  throw new Error('Property not found');
};

// Delete a property
export const deleteProperty = async (propertyId: string): Promise<void> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));

  for (const datasetId in MOCK_PROPERTIES) {
    const propertyIndex = MOCK_PROPERTIES[datasetId].findIndex(p => p.id === propertyId);
    if (propertyIndex !== -1) {
      MOCK_PROPERTIES[datasetId].splice(propertyIndex, 1);
      return;
    }
  }

  throw new Error('Property not found');
};

// Get a single property by ID
export const getProperty = async (propertyId: string): Promise<PropertySchema> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));

  for (const datasetId in MOCK_PROPERTIES) {
    const property = MOCK_PROPERTIES[datasetId].find(p => p.id === propertyId);
    if (property) {
      return property;
    }
  }

  throw new Error('Property not found');
};

// Mock storage for item properties
const MOCK_ITEM_PROPERTIES: Record<string, ItemProperties> = {};

// Item Properties Management
export interface UpdateItemPropertiesRequest {
  properties: PropertyValue[];
}

// Update properties for a specific dataset item
export const updateItemProperties = async (
  propertyId: string,
  itemId: string,
  properties: PropertyValue[]
): Promise<ItemProperties> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));

  const itemKey = `${propertyId}-${itemId}`;
  const itemProperties: ItemProperties = {
    itemId,
    datasetId: propertyId, // Using propertyId as datasetId for mock
    properties,
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user',
  };

  MOCK_ITEM_PROPERTIES[itemKey] = itemProperties;
  return itemProperties;
};

// Get properties for a specific dataset item
export const getItemProperties = async (datasetId: string, itemId: string): Promise<ItemProperties> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));

  const itemKey = `${datasetId}-${itemId}`;
  return MOCK_ITEM_PROPERTIES[itemKey] || {
    itemId,
    datasetId,
    properties: [],
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user',
  };
};

// Property Statistics
export const getPropertyCounts = async (datasetId: string): Promise<PropertyCounts[]> => {
  // Mock implementation - generate mock statistics based on properties
  await new Promise(resolve => setTimeout(resolve, 500));

  const properties = MOCK_PROPERTIES[datasetId] || [];
  return properties.map(property => {
    let distribution: PropertyCount[] = [];

    if (property.type === 'single_select' || property.type === 'multi_select') {
      // Generate mock counts for select options
      distribution = (property.options || []).map(option => ({
        propertyId: property.id,
        value: option,
        count: Math.floor(Math.random() * 50) + 1,
        percentage: 0, // Will be calculated below
      }));
    } else {
      // For text/instance_id, generate some sample values
      distribution = [
        { propertyId: property.id, value: 'Sample Value 1', count: 15, percentage: 0 },
        { propertyId: property.id, value: 'Sample Value 2', count: 10, percentage: 0 },
        { propertyId: property.id, value: 'Sample Value 3', count: 8, percentage: 0 },
      ];
    }

    // Calculate percentages
    const total = distribution.reduce((sum, item) => sum + item.count, 0);
    distribution.forEach(item => {
      item.percentage = Math.round((item.count / total) * 100);
    });

    return {
      propertyId: property.id,
      distribution,
    };
  });
};

// Bulk operations
export interface BulkUpdatePropertiesRequest {
  itemIds: string[];
  properties: PropertyValue[];
}

export const bulkUpdateItemProperties = async (
  datasetId: string,
  updates: BulkUpdatePropertiesRequest
): Promise<ItemProperties[]> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 800));

  const updatedItems = updates.itemIds.map(itemId => {
    const itemProperties: ItemProperties = {
      itemId,
      datasetId,
      properties: updates.properties,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user',
    };

    const itemKey = `${datasetId}-${itemId}`;
    MOCK_ITEM_PROPERTIES[itemKey] = itemProperties;

    return itemProperties;
  });

  return updatedItems;
};