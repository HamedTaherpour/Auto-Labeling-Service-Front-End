"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, X, Plus, Search } from 'lucide-react';
import { FilterBuilder } from './FilterBuilder';
import { PropertySchema, PropertyFilter, ItemFilters as ItemFiltersType } from '@/entities/property';
import { getDatasetProperties } from '@/shared/api/property-api';

interface ItemFiltersProps {
  datasetId: string;
  filters: ItemFiltersType;
  onFiltersChange: (filters: ItemFiltersType) => void;
  className?: string;
}

export const ItemFilters: React.FC<ItemFiltersProps> = ({
  datasetId,
  filters,
  onFiltersChange,
  className,
}) => {
  const [properties, setProperties] = useState<PropertySchema[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const props = await getDatasetProperties(datasetId);
        setProperties(props);
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [datasetId]);

  const handleAddFilter = (newFilter: PropertyFilter) => {
    const updatedFilters = {
      ...filters,
      filters: [...filters.filters, newFilter],
    };
    onFiltersChange(updatedFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = {
      ...filters,
      filters: filters.filters.filter((_, i) => i !== index),
    };
    onFiltersChange(updatedFilters);
  };

  const handleOperatorChange = (operator: 'AND' | 'OR') => {
    onFiltersChange({
      ...filters,
      operator,
    });
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || propertyId;
  };

  const getFilterDescription = (filter: PropertyFilter) => {
    const propertyName = getPropertyName(filter.propertyId);
    const operator = getOperatorLabel(filter.operator);

    if (filter.operator === 'is_empty' || filter.operator === 'is_not_empty') {
      return `${propertyName} ${operator}`;
    }

    const value = Array.isArray(filter.value)
      ? filter.value.join(', ')
      : filter.value;

    return `${propertyName} ${operator} "${value}"`;
  };

  const getOperatorLabel = (operator: PropertyFilter['operator']) => {
    switch (operator) {
      case 'equals': return 'equals';
      case 'not_equals': return 'does not equal';
      case 'contains': return 'contains';
      case 'not_contains': return 'does not contain';
      case 'in': return 'is one of';
      case 'not_in': return 'is not one of';
      case 'is_empty': return 'is empty';
      case 'is_not_empty': return 'is not empty';
      default: return operator;
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      filters: [],
      operator: 'AND',
    });
  };

  const hasActiveFilters = filters.filters.length > 0;

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Item Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Item Filters
            </CardTitle>
            <CardDescription>
              Filter dataset items by custom properties using advanced query building.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBuilder(!showBuilder)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Active Filters:</span>
              <Badge variant={filters.operator === 'AND' ? 'default' : 'secondary'}>
                {filters.operator}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOperatorChange(filters.operator === 'AND' ? 'OR' : 'AND')}
                className="h-6 px-2 text-xs"
              >
                Switch to {filters.operator === 'AND' ? 'OR' : 'AND'}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.filters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="gap-1 pr-1"
                >
                  <Search className="h-3 w-3" />
                  {getFilterDescription(filter)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFilter(index)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filter Builder */}
        {showBuilder && (
          <>
            <Separator />
            <FilterBuilder
              properties={properties}
              onAddFilter={handleAddFilter}
              onClose={() => setShowBuilder(false)}
            />
          </>
        )}

        {/* Empty State */}
        {!hasActiveFilters && !showBuilder && (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Active Filters</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add filters to narrow down your dataset items based on custom properties.
            </p>
            <Button onClick={() => setShowBuilder(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};