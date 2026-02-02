import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { DatasetBurndown } from '@/entities/statistic';

interface BurndownChartProps {
  data: DatasetBurndown[];
  className?: string;
}

export function BurndownChart({ data, className }: BurndownChartProps) {
  // Process data to group by date and dataset
  const processedData = data.reduce((acc, burndown) => {
    const date = burndown.date;
    const datasetId = burndown.datasetId;

    if (!acc[date]) {
      acc[date] = { date };
    }

    acc[date][`${datasetId}_completed`] = burndown.completedFiles;
    acc[date][`${datasetId}_reviewed`] = burndown.reviewedFiles;
    acc[date][`${datasetId}_pending`] = burndown.pendingFiles;
    acc[date][`${datasetId}_total`] = burndown.totalFiles;

    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(processedData).slice(-21); // Last 21 days

  // Get unique dataset IDs
  const datasetIds = [...new Set(data.map(d => d.datasetId))];

  const colors = [
    { completed: '#10b981', reviewed: '#059669', pending: '#ec4899' },
    { completed: '#f59e0b', reviewed: '#d97706', pending: '#ef4444' },
    { completed: '#8b5cf6', reviewed: '#7c3aed', pending: '#f97316' },
  ];

  return (
    <ChartWrapper
      title="Dataset Burndown"
      description="Progress tracking across datasets (last 21 days)"
      className={className}
      height={350}
    >
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{ value: 'Files', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number, name: string) => {
            const [datasetId, status] = name.split('_');
            const datasetName = data.find(d => d.datasetId === datasetId)?.datasetName || datasetId;
            const statusName = status.charAt(0).toUpperCase() + status.slice(1);
            return [value, `${datasetName} ${statusName}`];
          }}
        />
        <Legend />
        {datasetIds.map((datasetId, index) => {
          const colorScheme = colors[index % colors.length];
          return (
            <>
              <Area
                key={`${datasetId}_pending`}
                type="monotone"
                dataKey={`${datasetId}_pending`}
                stackId={datasetId}
                stroke={colorScheme.pending}
                fill={colorScheme.pending}
                fillOpacity={0.6}
                name={`${datasetId} Pending`}
              />
              <Area
                key={`${datasetId}_completed`}
                type="monotone"
                dataKey={`${datasetId}_completed`}
                stackId={datasetId}
                stroke={colorScheme.completed}
                fill={colorScheme.completed}
                fillOpacity={0.8}
                name={`${datasetId} Completed`}
              />
              <Area
                key={`${datasetId}_reviewed`}
                type="monotone"
                dataKey={`${datasetId}_reviewed`}
                stackId={datasetId}
                stroke={colorScheme.reviewed}
                fill={colorScheme.reviewed}
                fillOpacity={1}
                name={`${datasetId} Reviewed`}
              />
            </>
          );
        })}
      </AreaChart>
    </ChartWrapper>
  );
}