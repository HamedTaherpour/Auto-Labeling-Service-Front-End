import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DatasetStatus } from './DatasetStatus';
import { Dataset } from '../index';
import { Calendar, Image, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DatasetCardProps {
    dataset: Dataset;
    className?: string;
}

export function DatasetCard({ dataset, className }: DatasetCardProps) {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <Card className={`bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#FF6300]/30 transition-colors ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-white text-lg font-semibold mb-1">
                            {dataset.name}
                        </CardTitle>
                        {dataset.description && (
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {dataset.description}
                            </p>
                        )}
                    </div>
                    <DatasetStatus status={dataset.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progress Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-medium">{dataset.progress}%</span>
                    </div>
                    <Progress
                        value={dataset.progress}
                        className="h-2 bg-[#1A1A1A]"
                    />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Total Images</p>
                            <p className="text-sm font-medium text-white">{dataset.totalImages}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <div>
                            <p className="text-xs text-gray-400">Annotated</p>
                            <p className="text-sm font-medium text-white">{dataset.annotatedImages}</p>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Created</p>
                            <p className="text-xs text-gray-300">{formatDate(dataset.createdAt)}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Updated</p>
                        <p className="text-xs text-gray-300">{formatDate(dataset.updatedAt)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
