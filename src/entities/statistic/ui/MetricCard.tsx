import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'orange';
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  trend,
  color = 'blue',
  className,
}: MetricCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'border-green-200 bg-green-50';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50';
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'blue':
        return 'border-blue-200 bg-blue-50';
      case 'orange':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTrendIcon = () => {
    if (change?.type === 'increase') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change?.type === 'decrease') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (change?.type === 'increase') return 'text-green-600';
    if (change?.type === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className={cn('transition-all hover:shadow-md', getColorClasses(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 text-xs mt-1">
            {getTrendIcon()}
            <span className={getTrendColor()}>
              {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
              {Math.abs(change.value)}%
            </span>
            <span className="text-muted-foreground">from {change.period}</span>
          </div>
        )}
        {trend === 'up' && !change && (
          <Badge variant="outline" className="mt-2 text-green-600 border-green-200">
            Improving
          </Badge>
        )}
        {trend === 'down' && !change && (
          <Badge variant="outline" className="mt-2 text-red-600 border-red-200">
            Declining
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}