// Property entity types and discriminated unions for type-safe property values
export type PropertyType = 'text' | 'single_select' | 'multi_select' | 'instance_id';

// Base property schema
export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  required: boolean;
  description?: string;
  datasetId: string;
  createdAt: string;
  updatedAt: string;
}

// Discriminated unions for property configurations
export type TextProperty = Property & {
  type: 'text';
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
};

export type SingleSelectProperty = Property & {
  type: 'single_select';
  options: string[];
  allowCustomValues?: boolean;
};

export type MultiSelectProperty = Property & {
  type: 'multi_select';
  options: string[];
  allowCustomValues?: boolean;
  maxSelections?: number;
};

export type InstanceIdProperty = Property & {
  type: 'instance_id';
  // Instance ID properties are auto-generated UUIDs
};

// Union type for all property types
export type PropertySchema = TextProperty | SingleSelectProperty | MultiSelectProperty | InstanceIdProperty;

// Property values for items
export type PropertyValue = {
  propertyId: string;
  value: string | string[] | null; // null for unassigned, string for single values, string[] for multi-select
};

// Property values collection for a dataset item
export interface ItemProperties {
  itemId: string;
  datasetId: string;
  properties: PropertyValue[];
  updatedAt: string;
  updatedBy: string;
}

// Property statistics for filtering UI
export interface PropertyCount {
  propertyId: string;
  value: string;
  count: number;
  percentage: number;
}

export interface PropertyCounts {
  propertyId: string;
  distribution: PropertyCount[];
}

// Filter conditions for query builder
export type FilterOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'is_empty' | 'is_not_empty';

export interface PropertyFilter {
  propertyId: string;
  operator: FilterOperator;
  value?: string | string[]; // undefined for is_empty/is_not_empty
}

export interface ItemFilters {
  filters: PropertyFilter[];
  operator: 'AND' | 'OR'; // How to combine filters
}