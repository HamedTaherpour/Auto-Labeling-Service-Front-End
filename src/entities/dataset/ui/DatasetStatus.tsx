import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DatasetStatusProps {
    status: 'In Progress' | 'Completed' | 'Annotating';
    className?: string;
}

const statusConfig = {
    'In Progress': {
        variant: 'secondary' as const,
        className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    'Completed': {
        variant: 'secondary' as const,
        className: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    'Annotating': {
        variant: 'secondary' as const,
        className: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    },
};

export function DatasetStatus({ status, className }: DatasetStatusProps) {
    const config = statusConfig[status];

    return (
        <Badge
            variant={config.variant}
            className={cn(
                'text-xs font-medium border',
                config.className,
                className
            )}
        >
            {status}
        </Badge>
    );
}
