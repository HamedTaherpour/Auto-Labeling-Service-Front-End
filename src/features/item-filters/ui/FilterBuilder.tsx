"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { PropertySchema, PropertyFilter, FilterOperator } from '@/entities/property';

interface FilterBuilderProps {
  properties: PropertySchema[];
  onAddFilter: (filter: PropertyFilter) => void;
  onClose: () => void;
}

interface FilterFormData {
  propertyId: string;
  operator: FilterOperator;
  value: string;
  multiValue: string[];
}

const OPERATORS_BY_TYPE: Record<PropertySchema['type'], FilterOperator[]> = {
  text: ['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty'],
  single_select: ['equals', 'not_equals', 'in', 'not_in', 'is_empty', 'is_not_empty'],
  multi_select: ['in', 'not_in', 'is_empty', 'is_not_empty'],
  instance_id: ['equals', 'not_equals', 'is_empty', 'is_not_empty'],
};

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  properties,
  onAddFilter,
  onClose,
}) => {
  const [newMultiValue, setNewMultiValue] = useState('');

  const form = useForm<FilterFormData>({
    defaultValues: {
      propertyId: '',
      operator: 'equals',
      value: '',
      multiValue: [],
    },
  });

  const watchedPropertyId = form.watch('propertyId');
  const watchedOperator = form.watch('operator');
  const watchedMultiValue = form.watch('multiValue');

  const selectedProperty = properties.find(p => p.id === watchedPropertyId);
  const availableOperators = selectedProperty ? OPERATORS_BY_TYPE[selectedProperty.type] : [];
  const requiresValue = !['is_empty', 'is_not_empty'].includes(watchedOperator);
  const isMultiValue = ['in', 'not_in'].includes(watchedOperator) &&
    (selectedProperty?.type === 'single_select' || selectedProperty?.type === 'multi_select');

  const handleSubmit = (data: FilterFormData) => {
    if (!selectedProperty) return;

    const filterValue = isMultiValue
      ? data.multiValue
      : data.value || undefined;

    const filter: PropertyFilter = {
      propertyId: data.propertyId,
      operator: data.operator,
      value: filterValue,
    };

    onAddFilter(filter);
    form.reset();
    onClose();
  };

  const addMultiValue = () => {
    if (newMultiValue.trim() && !watchedMultiValue.includes(newMultiValue.trim())) {
      form.setValue('multiValue', [...watchedMultiValue, newMultiValue.trim()]);
      setNewMultiValue('');
    }
  };

  const removeMultiValue = (value: string) => {
    form.setValue('multiValue', watchedMultiValue.filter(v => v !== value));
  };

  const getOperatorLabel = (operator: FilterOperator) => {
    switch (operator) {
      case 'equals': return 'Equals';
      case 'not_equals': return 'Does not equal';
      case 'contains': return 'Contains';
      case 'not_contains': return 'Does not contain';
      case 'in': return 'Is one of';
      case 'not_in': return 'Is not one of';
      case 'is_empty': return 'Is empty';
      case 'is_not_empty': return 'Is not empty';
      default: return operator;
    }
  };

  const getValuePlaceholder = () => {
    if (!selectedProperty) return '';

    switch (selectedProperty.type) {
      case 'text':
        return 'Enter text value...';
      case 'single_select':
      case 'multi_select':
        return 'Select or enter value...';
      case 'instance_id':
        return 'Enter instance ID...';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Build Filter</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Property Selection */}
          <Controller
            name="propertyId"
            control={form.control}
            rules={{ required: 'Please select a property' }}
            render={({ field }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Property</label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property..." />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        <div className="flex items-center gap-2">
                          <span>{property.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {property.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* Operator Selection */}
          <Controller
            name="operator"
            control={form.control}
            rules={{ required: 'Please select an operator' }}
            render={({ field }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <Select
                  onValueChange={(value) => field.onChange(value as FilterOperator)}
                  value={field.value}
                  disabled={!selectedProperty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperators.map((operator) => (
                      <SelectItem key={operator} value={operator}>
                        {getOperatorLabel(operator)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* Value Input */}
          {requiresValue && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              {isMultiValue ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder={getValuePlaceholder()}
                      value={newMultiValue}
                      onChange={(e) => setNewMultiValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMultiValue())}
                    />
                    <Button type="button" onClick={addMultiValue} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedMultiValue.map((value) => (
                      <Badge key={value} variant="secondary" className="gap-1">
                        {value}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeMultiValue(value)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : selectedProperty?.type === 'single_select' || selectedProperty?.type === 'multi_select' ? (
                <Controller
                  name="value"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select value..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProperty.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Controller
                  name="value"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={getValuePlaceholder()}
                    />
                  )}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Filter
          </Button>
        </div>
      </form>
    </div>
  );
};