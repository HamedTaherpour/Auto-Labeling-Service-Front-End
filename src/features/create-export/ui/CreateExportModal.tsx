"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Code, Table, FileText, Archive, Database } from 'lucide-react';
import type { ExportFormat, CreateExportRequest } from '@/entities/export-release';
import { toast } from 'sonner';

const exportSchema = z.object({
    format: z.enum(['darwin_json', 'coco', 'yolo', 'pascal_voc', 'csv'] as const),
    completedOnly: z.boolean(),
    specificClasses: z.string().optional(),
    includeWorkerMetadata: z.boolean(),
});

type ExportFormData = z.infer<typeof exportSchema>;

interface CreateExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateExport: (request: CreateExportRequest) => Promise<void>;
    isLoading?: boolean;
}

const formatOptions: { value: ExportFormat; label: string; icon: React.ReactNode }[] = [
    { value: 'darwin_json', label: 'Darwin JSON', icon: <Code className="w-4 h-4" /> },
    { value: 'coco', label: 'COCO', icon: <Database className="w-4 h-4" /> },
    { value: 'yolo', label: 'YOLO', icon: <FileText className="w-4 h-4" /> },
    { value: 'pascal_voc', label: 'Pascal VOC', icon: <Archive className="w-4 h-4" /> },
    { value: 'csv', label: 'CSV', icon: <Table className="w-4 h-4" /> },
];

export const CreateExportModal: React.FC<CreateExportModalProps> = ({
    isOpen,
    onClose,
    onCreateExport,
    isLoading = false,
}) => {
    const form = useForm<ExportFormData>({
        resolver: zodResolver(exportSchema),
        defaultValues: {
            format: 'darwin_json',
            completedOnly: true,
            specificClasses: '',
            includeWorkerMetadata: true,
        },
    });

    const onSubmit = async (data: ExportFormData) => {
        try {
            const request: CreateExportRequest = {
                format: data.format,
                includeWorkerMetadata: data.includeWorkerMetadata,
                filters: {
                    completedOnly: data.completedOnly,
                    specificClasses: data.specificClasses
                        ? data.specificClasses.split(',').map(s => s.trim()).filter(Boolean)
                        : undefined,
                },
            };

            await onCreateExport(request);
            toast.success('Export created successfully');
            form.reset();
            onClose();
        } catch (error) {
            toast.error('Failed to create export');
            console.error('Export creation failed:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Export</DialogTitle>
                    <DialogDescription>
                        Export your dataset in the format of your choice with customizable filters.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="format"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Export Format</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select export format" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {formatOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        {option.icon}
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="completedOnly"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Export only completed items</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Only include items that have been fully reviewed and approved.
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="specificClasses"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Include Specific Classes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter class names separated by commas (e.g., person, car, bicycle)"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <p className="text-sm text-muted-foreground">
                                        Leave empty to include all classes. Only specified classes will be exported.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="includeWorkerMetadata"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Include Worker Metadata</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Include annotator and reviewer names in the export file.
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Export'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};