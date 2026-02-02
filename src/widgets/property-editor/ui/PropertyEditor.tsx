"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, Save, X } from 'lucide-react';
import {
  PropertySchema,
  PropertyValue,
  ItemProperties,
  TextProperty,
  SingleSelectProperty,
  MultiSelectProperty,
  InstanceIdProperty
} from '@/entities/property';
import { getDatasetProperties, getItemProperties, updateItemProperties } from '@/shared/api/property-api';
import { toast } from 'sonner';

interface PropertyEditorProps {
  datasetId: string;
  itemId: string;
  className?: string;
  onPropertiesChange?: (properties: ItemProperties) => void;
}

interface PropertyFormData {
  [propertyId: string]: string | string[] | null;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  datasetId,
  itemId,
  className,
  onPropertiesChange,
}) => {
  const [properties, setProperties] = useState<PropertySchema[]>([]);
  const [itemProperties, setItemProperties] = useState<ItemProperties | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<PropertyFormData>({
    defaultValues: {},
  });

  // Load property schema and current values
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [schema, itemProps] = await Promise.all([
          getDatasetProperties(datasetId),
          getItemProperties(datasetId, itemId),
        ]);

        setProperties(schema);
        setItemProperties(itemProps);

        // Set form values from existing item properties
        const formValues: PropertyFormData = {};
        itemProps.properties.forEach((prop) => {
          formValues[prop.propertyId] = prop.value;
        });
        form.reset(formValues);
      } catch (error) {
        console.error('Failed to load property data:', error);
        toast.error('Failed to load property data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [datasetId, itemId, form]);

  const handleSave = async (data: PropertyFormData) => {
    try {
      setSaving(true);

      const propertyValues: PropertyValue[] = Object.entries(data).map(([propertyId, value]) => ({
        propertyId,
        value,
      }));

      const updatedItemProperties = await updateItemProperties(propertyId, itemId, propertyValues);
      setItemProperties(updatedItemProperties);
      onPropertiesChange?.(updatedItemProperties);

      toast.success('Properties saved successfully');
    } catch (error) {
      console.error('Failed to save properties:', error);
      toast.error('Failed to save properties');
    } finally {
      setSaving(false);
    }
  };

  const renderPropertyField = (property: PropertySchema) => {
    const fieldName = property.id;

    switch (property.type) {
      case 'text':
        return renderTextField(property as TextProperty, fieldName);

      case 'single_select':
        return renderSingleSelectField(property as SingleSelectProperty, fieldName);

      case 'multi_select':
        return renderMultiSelectField(property as MultiSelectProperty, fieldName);

      case 'instance_id':
        return renderInstanceIdField(property as InstanceIdProperty, fieldName);

      default:
        return null;
    }
  };

  const renderTextField = (property: TextProperty, fieldName: string) => (
    <FormField
      key={fieldName}
      control={form.control}
      name={fieldName}
      rules={{
        required: property.required ? `${property.name} is required` : false,
        minLength: property.validation?.minLength ? {
          value: property.validation.minLength,
          message: `Minimum length is ${property.validation.minLength} characters`,
        } : undefined,
        maxLength: property.validation?.maxLength ? {
          value: property.validation.maxLength,
          message: `Maximum length is ${property.validation.maxLength} characters`,
        } : undefined,
        pattern: property.validation?.pattern ? {
          value: new RegExp(property.validation.pattern),
          message: 'Invalid format',
        } : undefined,
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {property.name}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              value={field.value || ''}
              placeholder={`Enter ${property.name.toLowerCase()}...`}
              className="min-h-[60px] resize-none"
            />
          </FormControl>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderSingleSelectField = (property: SingleSelectProperty, fieldName: string) => (
    <FormField
      key={fieldName}
      control={form.control}
      name={fieldName}
      rules={{
        required: property.required ? `${property.name} is required` : false,
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {property.name}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ''}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${property.name.toLowerCase()}...`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {property.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderMultiSelectField = (property: MultiSelectProperty, fieldName: string) => {
    const currentValue = form.watch(fieldName) as string[] || [];

    return (
      <FormField
        key={fieldName}
        control={form.control}
        name={fieldName}
        rules={{
          required: property.required ? `${property.name} is required` : false,
          validate: property.maxSelections ? (value) => {
            const selected = Array.isArray(value) ? value.length : 0;
            return selected <= property.maxSelections! || `Maximum ${property.maxSelections} selections allowed`;
          } : undefined,
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              {property.name}
              {property.required && <span className="text-red-500 ml-1">*</span>}
              {property.maxSelections && (
                <span className="text-xs text-muted-foreground ml-2">
                  (max {property.maxSelections})
                </span>
              )}
            </FormLabel>
            <div className="space-y-2">
              {property.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldName}-${option}`}
                    checked={currentValue.includes(option)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...currentValue, option]
                        : currentValue.filter(v => v !== option);
                      field.onChange(newValue);
                    }}
                  />
                  <label
                    htmlFor={`${fieldName}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {property.description && (
              <p className="text-xs text-muted-foreground">{property.description}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderInstanceIdField = (property: InstanceIdProperty, fieldName: string) => (
    <FormField
      key={fieldName}
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {property.name}
            <Badge variant="outline" className="ml-2 text-xs">
              Auto-generated
            </Badge>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value || 'Will be auto-generated'}
              disabled
              className="bg-muted"
            />
          </FormControl>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </FormItem>
      )}
    />
  );

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Item Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Item Properties
          </CardTitle>
          <CardDescription>
            No custom properties have been defined for this dataset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure custom metadata fields in the Dataset Settings to enrich your dataset items with additional information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Item Properties
        </CardTitle>
        <CardDescription>
          Add metadata to this dataset item for better organization and filtering.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <ScrollArea className="max-h-96">
              <div className="space-y-4 pr-4">
                {properties.map((property) => (
                  <div key={property.id}>
                    {renderPropertyField(property)}
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Properties'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};