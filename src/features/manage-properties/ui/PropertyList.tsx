"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Type, List, CheckSquare, Hash } from 'lucide-react';
import { PropertySchema } from '@/entities/property';

interface PropertyListProps {
    properties: PropertySchema[];
    loading: boolean;
    onEdit: (property: PropertySchema) => void;
    onDelete: (propertyId: string) => void;
}

const getPropertyTypeIcon = (type: PropertySchema['type']) => {
    switch (type) {
        case 'text':
            return <Type className="h-4 w-4" />;
        case 'single_select':
            return <List className="h-4 w-4" />;
        case 'multi_select':
            return <CheckSquare className="h-4 w-4" />;
        case 'instance_id':
            return <Hash className="h-4 w-4" />;
        default:
            return null;
    }
};

const getPropertyTypeLabel = (type: PropertySchema['type']) => {
    switch (type) {
        case 'text':
            return 'Text';
        case 'single_select':
            return 'Single Select';
        case 'multi_select':
            return 'Multi Select';
        case 'instance_id':
            return 'Instance ID';
        default:
            return type;
    }
};

const PropertyRow: React.FC<{
    property: PropertySchema;
    onEdit: (property: PropertySchema) => void;
    onDelete: (propertyId: string) => void;
}> = ({ property, onEdit, onDelete }) => {
    const formatOptions = (property: PropertySchema) => {
        if (property.type === 'single_select' || property.type === 'multi_select') {
            return property.options?.join(', ') || 'No options';
        }
        if (property.type === 'text' && property.validation) {
            const validations = [];
            if (property.validation.minLength) validations.push(`Min: ${property.validation.minLength}`);
            if (property.validation.maxLength) validations.push(`Max: ${property.validation.maxLength}`);
            if (property.validation.pattern) validations.push('Pattern');
            return validations.join(', ') || 'No validation';
        }
        return '-';
    };

    return (
        <TableRow>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    {getPropertyTypeIcon(property.type)}
                    {property.name}
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="secondary" className="gap-1">
                    {getPropertyTypeIcon(property.type)}
                    {getPropertyTypeLabel(property.type)}
                </Badge>
            </TableCell>
            <TableCell>
                {property.required ? (
                    <Badge variant="destructive">Required</Badge>
                ) : (
                    <Badge variant="outline">Optional</Badge>
                )}
            </TableCell>
            <TableCell className="max-w-xs truncate">
                {formatOptions(property)}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(property)}
                        className="h-8 w-8 p-0"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(property.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};

export const PropertyList: React.FC<PropertyListProps> = ({
    properties,
    loading,
    onEdit,
    onDelete,
}) => {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                        <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Properties Defined</h3>
                        <p className="text-sm">
                            Add custom metadata fields to enrich your dataset items with additional information for better filtering and analysis.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Options/Validation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {properties.map((property) => (
                    <PropertyRow
                        key={property.id}
                        property={property}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </TableBody>
        </Table>
    );
};