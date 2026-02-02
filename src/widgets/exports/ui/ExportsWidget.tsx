"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import {
    Download,
    Plus,
    Code,
    Table,
    FileText,
    Archive,
    Database,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import type { ExportVersion, ExportFormat, ExportStatus } from '@/entities/export-release';
import { CreateExportModal } from '@/features/create-export';
import { exportApi } from '@/shared/api';
import { toast } from 'sonner';

interface ExportsWidgetProps {
    datasetId: string;
    exports: ExportVersion[];
    onRefresh: () => void;
    className?: string;
}

const formatIcons: Record<ExportFormat, React.ReactNode> = {
    darwin_json: <Code className="w-4 h-4" />,
    coco: <Database className="w-4 h-4" />,
    yolo: <FileText className="w-4 h-4" />,
    pascal_voc: <Archive className="w-4 h-4" />,
    csv: <Table className="w-4 h-4" />,
};

const formatLabels: Record<ExportFormat, string> = {
    darwin_json: 'Darwin JSON',
    coco: 'COCO',
    yolo: 'YOLO',
    pascal_voc: 'Pascal VOC',
    csv: 'CSV',
};

const statusConfig: Record<ExportStatus, { label: string; color: string; icon: React.ReactNode }> = {
    processing: {
        label: 'Processing',
        color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
        icon: <Clock className="w-3 h-3" />,
    },
    ready: {
        label: 'Ready',
        color: 'bg-green-500/10 text-green-700 border-green-500/20',
        icon: <CheckCircle className="w-3 h-3" />,
    },
    failed: {
        label: 'Failed',
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
        icon: <XCircle className="w-3 h-3" />,
    },
};

export function ExportsWidget({ datasetId, exports, onRefresh, className }: ExportsWidgetProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateExport = async (request: any) => {
        setIsCreating(true);
        try {
            await exportApi.createExport(datasetId, request);
            onRefresh();
        } catch (error) {
            console.error('Failed to create export:', error);
            throw error;
        } finally {
            setIsCreating(false);
        }
    };

    const handleDownload = async (exportId: string) => {
        try {
            const exportDetails = await exportApi.getExport(datasetId, exportId);
            if (exportDetails.downloadUrl) {
                window.open(exportDetails.downloadUrl, '_blank');
            } else {
                toast.error('Download URL not available');
            }
        } catch (error) {
            console.error('Failed to get download URL:', error);
            toast.error('Failed to get download URL');
        }
    };

    // Sort exports by creation date (newest first)
    const sortedExports = [...exports].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Export Versions</h2>
                    <p className="text-muted-foreground">
                        Manage and download your dataset exports
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Export
                </Button>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                {sortedExports.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No exports yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Create your first export to start versioning your dataset.
                            </p>
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Export
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {sortedExports.map((exportVersion, index) => (
                            <motion.div key={exportVersion.id} variants={itemVariants}>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                {/* Timeline dot */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${exportVersion.status === 'ready' ? 'bg-green-500' :
                                                            exportVersion.status === 'processing' ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                        }`} />
                                                    {index < sortedExports.length - 1 && (
                                                        <div className="w-px h-12 bg-border mt-2" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            {formatIcons[exportVersion.format]}
                                                            <span className="font-medium">
                                                                {formatLabels[exportVersion.format]}
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={statusConfig[exportVersion.status].color}
                                                        >
                                                            <div className="flex items-center space-x-1">
                                                                {statusConfig[exportVersion.status].icon}
                                                                <span>{statusConfig[exportVersion.status].label}</span>
                                                            </div>
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-muted-foreground">
                                                        <div>
                                                            <span className="font-medium">Created:</span>
                                                            <div>{format(new Date(exportVersion.createdAt), 'MMM dd, yyyy HH:mm')}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Items:</span>
                                                            <div>{exportVersion.itemCount.toLocaleString()}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Format:</span>
                                                            <div>{formatLabels[exportVersion.format]}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Created by:</span>
                                                            <div>{exportVersion.createdBy}</div>
                                                        </div>
                                                    </div>

                                                    {exportVersion.status === 'processing' && (
                                                        <div className="mb-4">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Spinner className="w-4 h-4" />
                                                                <span className="text-sm">Processing export...</span>
                                                            </div>
                                                            <Progress value={33} className="w-full" />
                                                        </div>
                                                    )}

                                                    {exportVersion.status === 'failed' && exportVersion.errorMessage && (
                                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                            <p className="text-sm text-red-700">{exportVersion.errorMessage}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-2">
                                                {exportVersion.status === 'ready' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleDownload(exportVersion.id)}
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </Button>
                                                )}
                                                {exportVersion.status === 'processing' && (
                                                    <Button size="sm" disabled>
                                                        <Spinner className="w-4 h-4 mr-2" />
                                                        Processing
                                                    </Button>
                                                )}
                                                {exportVersion.status === 'failed' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setIsCreateModalOpen(true)}
                                                    >
                                                        Retry
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            <CreateExportModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateExport={handleCreateExport}
                isLoading={isCreating}
            />
        </div>
    );
}