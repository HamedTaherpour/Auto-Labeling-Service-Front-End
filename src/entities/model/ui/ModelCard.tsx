import { Model } from '../index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ModelCardProps {
    model: Model;
    onSelect?: (model: Model) => void;
    isSelected?: boolean;
}

export function ModelCard({ model, onSelect, isSelected }: ModelCardProps) {
    const getStatusColor = (status: Model['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'inactive':
                return 'bg-gray-500';
            case 'training':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getProviderColor = (provider: Model['provider']) => {
        switch (provider) {
            case 'rexomni':
                return 'bg-blue-500';
            case 'florence':
                return 'bg-purple-500';
            case 'custom':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-orange-500' : ''
                }`}
            onClick={() => onSelect?.(model)}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                    <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                            {model.task}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`text-xs text-white ${getProviderColor(model.provider)}`}
                        >
                            {model.provider}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{model.type}</span>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`} />
                        <span className="text-xs capitalize">{model.status}</span>
                    </div>
                </div>

                {model.accuracy && (
                    <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Accuracy</span>
                            <span className="text-xs font-medium">{Math.round(model.accuracy * 100)}%</span>
                        </div>
                        <Progress value={model.accuracy * 100} className="h-1" />
                    </div>
                )}

                {model.version && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Version: {model.version}</span>
                        <span>{new Date(model.updatedAt).toLocaleDateString()}</span>
                    </div>
                )}

                {model.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {model.description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}