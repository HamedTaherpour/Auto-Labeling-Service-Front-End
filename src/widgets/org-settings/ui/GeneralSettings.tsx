"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrganizationSettings {
    name: string;
    description: string;
    website: string;
    contactEmail: string;
}

const MOCK_SETTINGS: OrganizationSettings = {
    name: 'AuraVision Labs',
    description: 'Advanced computer vision and AI annotation platform for enterprise teams.',
    website: 'https://auravision.com',
    contactEmail: 'admin@auravision.com',
};

export const GeneralSettings: React.FC = () => {
    const [settings, setSettings] = useState<OrganizationSettings>(MOCK_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // In real app, this would call an API to update organization settings
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Organization settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof OrganizationSettings) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSettings(prev => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    General Settings
                </CardTitle>
                <CardDescription>
                    Configure your organization&apos;s basic information and preferences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="org-name">Organization Name</Label>
                        <Input
                            id="org-name"
                            value={settings.name}
                            onChange={handleInputChange('name')}
                            placeholder="Enter organization name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={settings.contactEmail}
                            onChange={handleInputChange('contactEmail')}
                            placeholder="admin@company.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={settings.website}
                        onChange={handleInputChange('website')}
                        placeholder="https://company.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={settings.description}
                        onChange={handleInputChange('description')}
                        placeholder="Brief description of your organization..."
                        className="resize-none"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};