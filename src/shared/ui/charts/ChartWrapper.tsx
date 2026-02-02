import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    height?: number;
    description?: string;
}

export function ChartWrapper({
    title,
    children,
    className,
    height = 300,
    description,
}: ChartWrapperProps) {
    return (
        <Card className={cn('transition-all hover:shadow-md', className)}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    {children as React.ReactElement}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}