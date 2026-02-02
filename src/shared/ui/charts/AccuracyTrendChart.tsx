import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { AccuracyTrend } from '@/entities/statistic';

interface AccuracyTrendChartProps {
  data: AccuracyTrend[];
  className?: string;
}

export function AccuracyTrendChart({ data, className }: AccuracyTrendChartProps) {
  // Process data to group by date and model type
  const processedData = data.reduce((acc, trend) => {
    const date = trend.date;
    const modelType = trend.modelType.replace(/\s+/g, '_').toLowerCase();

    if (!acc[date]) {
      acc[date] = { date };
    }

    acc[date][`${modelType}_precision`] = Math.round(trend.precision * 100);
    acc[date][`${modelType}_recall`] = Math.round(trend.recall * 100);
    acc[date][`${modelType}_f1`] = Math.round(trend.f1Score * 100);

    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(processedData).slice(-14); // Last 14 days

  // Get unique model types
  const modelTypes = [...new Set(data.map(d => d.modelType))];

  const colors = {
    object_detection: { precision: '#10b981', recall: '#059669', f1: '#047857' },
    instance_segmentation: { precision: '#f59e0b', recall: '#d97706', f1: '#b45309' },
    ocr: { precision: '#8b5cf6', recall: '#7c3aed', f1: '#6d28d9' },
  };

  return (
    <ChartWrapper
      title="AI Model Accuracy Trends"
      description="Precision, Recall, and F1-Score over time (last 14 days)"
      className={className}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
          label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number, name: string) => {
            const [model, metric] = name.split('_');
            const modelName = model.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const metricName = metric === 'f1' ? 'F1-Score' : metric.charAt(0).toUpperCase() + metric.slice(1);
            return [`${value}%`, `${modelName} ${metricName}`];
          }}
        />
        <Legend />
        {modelTypes.map((modelType) => {
          const key = modelType.replace(/\s+/g, '_').toLowerCase();
          const modelColors = colors[key as keyof typeof colors] || colors.object_detection;

          return (
            <>
              <Line
                key={`${key}_precision`}
                type="monotone"
                dataKey={`${key}_precision`}
                stroke={modelColors.precision}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                name={`${modelType} Precision`}
              />
              <Line
                key={`${key}_recall`}
                type="monotone"
                dataKey={`${key}_recall`}
                stroke={modelColors.recall}
                strokeWidth={2}
                strokeDasharray="10 5"
                dot={{ r: 3 }}
                name={`${modelType} Recall`}
              />
              <Line
                key={`${key}_f1`}
                type="monotone"
                dataKey={`${key}_f1`}
                stroke={modelColors.f1}
                strokeWidth={3}
                dot={{ r: 4 }}
                name={`${modelType} F1-Score`}
              />
            </>
          );
        })}
      </LineChart>
    </ChartWrapper>
  );
}