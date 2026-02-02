"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { PropertySchema } from '@/entities/property';
import { createProperty, updateProperty } from '@/shared/api/property-api';
import { toast } from 'sonner';

interface CreatePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetId: string;
  property?: PropertySchema | null;
  onPropertyCreated: (property: PropertySchema) => void;
}

interface PropertyFormData {
  name: string;
  type: PropertySchema['type'];
  required: boolean;
  description: string;
  options: string[];
  allowCustomValues: boolean;
  maxSelections?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

const PROPERTY_TYPES = [
  { value: 'text', label: 'Text', description: 'Free-form text input' },
  { value: 'single_select', label: 'Single Select', description: 'Choose one option from a list' },
  { value: 'multi_select', label: 'Multi Select', description: 'Choose multiple options from a list' },
  { value: 'instance_id', label: 'Instance ID', description: 'Auto-generated unique identifier' },
] as const;

export const CreatePropertyDialog: React.FC<CreatePropertyDialogProps> = ({
  open,
  onOpenChange,
  datasetId,
  property,
  onPropertyCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [newOption, setNewOption] = useState('');

  const form = useForm<PropertyFormData>({
    defaultValues: {
      name: '',
      type: 'text',
      required: false,
      description: '',
      options: [],
      allowCustomValues: false,
      maxSelections: undefined,
      minLength: undefined,
      maxLength: undefined,
      pattern: '',
    },
  });

  const watchedType = form.watch('type');
  const watchedOptions = form.watch('options');

  // Reset form when dialog opens/closes or property changes
  useEffect(() => {
    if (open) {
      if (property) {
        // Editing existing property
        form.reset({
          name: property.name,
          type: property.type,
          required: property.required,
          description: property.description || '',
          options: (property.type === 'single_select' || property.type === 'multi_select')
            ? property.options || []
            : [],
          allowCustomValues: (property.type === 'single_select' || property.type === 'multi_select')
            ? property.allowCustomValues || false
            : false,
          maxSelections: property.type === 'multi_select' ? property.maxSelections : undefined,
          minLength: property.type === 'text' ? property.validation?.minLength : undefined,
          maxLength: property.type === 'text' ? property.validation?.maxLength : undefined,
          pattern: property.type === 'text' ? property.validation?.pattern || '' : '',
        });
      } else {
        // Creating new property
        form.reset({
          name: '',
          type: 'text',
          required: false,
          description: '',
          options: [],
          allowCustomValues: false,
          maxSelections: undefined,
          minLength: undefined,
          maxLength: undefined,
          pattern: '',
        });
      }
    }
  }, [open, property, form]);

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      setLoading(true);

      const propertyData = {
        name: data.name,
        type: data.type,
        required: data.required,
        description: data.description || undefined,
        ...(data.type === 'single_select' || data.type === 'multi_select' ? {
          options: data.options,
          allowCustomValues: data.allowCustomValues,
          ...(data.type === 'multi_select' && { maxSelections: data.maxSelections }),
        } : {}),
        ...(data.type === 'text' && {
          validation: {
            minLength: data.minLength,
            maxLength: data.maxLength,
            pattern: data.pattern || undefined,
          },
        }),
      };

      let result: PropertySchema;
      if (property) {
        result = await updateProperty(property.id, propertyData);
        toast.success('Property updated successfully');
      } else {
        result = await createProperty(datasetId, propertyData);
        toast.success('Property created successfully');
      }

      onPropertyCreated(result);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save property:', error);
      toast.error(property ? 'Failed to update property' : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (newOption.trim() && !watchedOptions.includes(newOption.trim())) {
      form.setValue('options', [...watchedOptions, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (option: string) => {
    form.setValue('options', watchedOptions.filter(o => o !== option));
  };

  const isEditing = !!property;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Property' : 'Create New Property'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the property configuration for your dataset.'
              : 'Define a new custom metadata field for your dataset items.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Property name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Camera Model, Weather, Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                rules={{ required: 'Property type is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this property is used for..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Required Property</FormLabel>
                    <FormDescription>
                      Users must fill in this property for all dataset items.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Text Property Configuration */}
            {watchedType === 'text' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Text Validation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="No limit"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="pattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern (Regex)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ^[A-Z]{2}-\d{4}$" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional regex pattern for input validation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Select Property Configuration */}
            {(watchedType === 'single_select' || watchedType === 'multi_select') && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Select Options</h4>

                <FormField
                  control={form.control}
                  name="allowCustomValues"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Custom Values</FormLabel>
                        <FormDescription>
                          Users can enter values not in the predefined list.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Options</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add option..."
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                    />
                    <Button type="button" onClick={addOption} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedOptions.map((option) => (
                      <Badge key={option} variant="secondary" className="gap-1">
                        {option}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeOption(option)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {watchedType === 'multi_select' && (
                  <FormField
                    control={form.control}
                    name="maxSelections"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Selections</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="No limit"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of options that can be selected (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};