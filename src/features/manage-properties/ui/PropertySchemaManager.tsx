"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings } from 'lucide-react';
import { PropertyList } from './PropertyList';
import { CreatePropertyDialog } from './CreatePropertyDialog';
import { PropertySchema } from '@/entities/property';
import { getDatasetProperties, deleteProperty } from '@/shared/api/property-api';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

interface PropertySchemaManagerProps {
    className?: string;
}

export const PropertySchemaManager: React.FC<PropertySchemaManagerProps> = ({ className }) => {
    const [properties, setProperties] = useState<PropertySchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<PropertySchema | null>(null);
    const params = useParams();
    const datasetId = params.datasetId as string;

    const loadProperties = useCallback(async () => {
        try {
            setLoading(true);
            const props = await getDatasetProperties(datasetId);
            setProperties(props);
        } catch (error) {
            console.error('Failed to load properties:', error);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
        }
    }, [datasetId]);

    useEffect(() => {
        if (datasetId) {
            loadProperties();
        }
    }, [datasetId, loadProperties]);

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            await deleteProperty(propertyId);
            setProperties(prev => prev.filter(p => p.id !== propertyId));
            toast.success('Property deleted successfully');
        } catch (error) {
            console.error('Failed to delete property:', error);
            toast.error('Failed to delete property');
        }
    };

    const handlePropertyCreated = (property: PropertySchema) => {
        setProperties(prev => [...prev, property]);
        setCreateDialogOpen(false);
    };

    const handlePropertyUpdated = (property: PropertySchema) => {
        setProperties(prev => prev.map(p => p.id === property.id ? property : p));
        setEditingProperty(null);
    };

    return (
        <div className={className}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Dataset Properties
                            </CardTitle>
                            <CardDescription>
                                Define custom metadata fields for your dataset items. These properties will be available for filtering and analysis.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Property
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <PropertyList
                        properties={properties}
                        loading={loading}
                        onEdit={setEditingProperty}
                        onDelete={handleDeleteProperty}
                    />
                </CardContent>
            </Card>

            <CreatePropertyDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                datasetId={datasetId}
                onPropertyCreated={handlePropertyCreated}
            />

            {editingProperty && (
                <CreatePropertyDialog
                    open={!!editingProperty}
                    onOpenChange={(open: boolean) => !open && setEditingProperty(null)}
                    datasetId={datasetId}
                    property={editingProperty}
                    onPropertyCreated={handlePropertyUpdated}
                />
            )}
        </div>
    );
};