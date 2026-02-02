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
import { PerformanceMetric } from '@/entities/statistic';

interface ThroughputChartProps {
  data: PerformanceMetric[];
  className?: string;
}

export function ThroughputChart({ data, className }: ThroughputChartProps) {
  // Process data to group by date and annotator
  const processedData = data.reduce((acc, metric) => {
    const date = metric.date;
    const annotatorId = metric.annotatorId;

    if (!acc[date]) {
      acc[date] = { date };
    }

    // Calculate annotations per hour (assuming 8-hour workday)
    acc[date][`user-${annotatorId}`] = Math.round((metric.annotationsCount / 8) * 100) / 100;

    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(processedData).slice(-14); // Last 14 days

  // Get unique user names for the legend
  const users = [...new Set(data.map(d => d.annotatorId))];

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];

  return (
    <ChartWrapper
      title="Team Throughput"
      description="Annotations per hour per team member (last 14 days)"
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
          tick={{ fontSize: 12 }}
          label={{ value: 'Annotations/Hour', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number, name: string) => [
            `${value.toFixed(1)} ann/hr`,
            `User ${name.split('-')[1]}`
          ]}
        />
        <Legend />
        {users.map((userId, index) => (
          <Line
            key={userId}
            type="monotone"
            dataKey={`user-${userId}`}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ChartWrapper>
  );
}