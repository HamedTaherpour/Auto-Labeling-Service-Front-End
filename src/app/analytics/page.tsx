"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  AnalyticsOverview,
  TeamMember,
  PerformanceMetric,
  AccuracyTrend,
  DatasetBurndown,
  AnalyticsFilters,
} from '@/entities/statistic';
import { MetricCard } from '@/entities/statistic/ui/MetricCard';
import { TeamStatsWidget } from '@/widgets/team-stats';
import {
  ThroughputChart,
  AccuracyTrendChart,
  BurndownChart,
} from '@/shared/ui/charts';
import { analyticsApi } from '@/shared/api';
import {
  CalendarIcon,
  Filter,
  RefreshCw,
  TrendingUp,
  Users,
  FileText,
  Target,
  Clock,
  BarChart3,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [accuracyTrends, setAccuracyTrends] = useState<AccuracyTrend[]>([]);
  const [burndownData, setBurndownData] = useState<DatasetBurndown[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [selectedDataset, setSelectedDataset] = useState<string>('all');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const loadAnalyticsData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const filters: Partial<AnalyticsFilters> = {
        dateRange: {
          start: dateRange.from.toISOString().split('T')[0],
          end: dateRange.to.toISOString().split('T')[0],
        },
        datasetIds: selectedDataset !== 'all' ? [selectedDataset] : undefined,
      };

      const [
        overviewData,
        teamData,
        performanceData,
        accuracyData,
        burndown,
      ] = await Promise.all([
        analyticsApi.getOverview(filters),
        analyticsApi.getTeamPerformance(filters),
        analyticsApi.getPerformanceMetrics(filters),
        analyticsApi.getAccuracyTrends(filters),
        analyticsApi.getDatasetBurndown(selectedDataset !== 'all' ? selectedDataset : undefined, filters),
      ]);

      setOverview(overviewData);
      setTeamMembers(teamData);
      setPerformanceMetrics(performanceData);
      setAccuracyTrends(accuracyData);
      setBurndownData(burndown);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, selectedDataset]);

  const handleRefresh = () => {
    loadAnalyticsData(true);
  };

  const getCompletionRate = () => {
    if (!overview) return 0;
    return (overview.completedFiles / overview.totalFiles) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse h-80">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-32 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor team performance and project progress
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Range Picker */}
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                      setDatePickerOpen(false);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Dataset Filter */}
            <Select value={selectedDataset} onValueChange={setSelectedDataset}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Datasets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Datasets</SelectItem>
                <SelectItem value="dataset-1">Urban Street Scenes</SelectItem>
                <SelectItem value="dataset-2">Retail Product Catalog</SelectItem>
                <SelectItem value="dataset-3">Medical X-Ray Analysis</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="icon"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Files"
              value={`${overview.totalFiles.toLocaleString()}`}
              icon={<FileText className="w-4 h-4" />}
              color="blue"
            />
            <MetricCard
              title="Completion Rate"
              value={`${getCompletionRate().toFixed(1)}%`}
              change={{
                value: 5.2,
                period: "last week",
                type: "increase",
              }}
              icon={<Target className="w-4 h-4" />}
              color="green"
            />
            <MetricCard
              title="Active Users"
              value={overview.activeUsers}
              icon={<Users className="w-4 h-4" />}
              color="orange"
            />
            <MetricCard
              title="Avg Accuracy"
              value={`${(overview.averageAccuracy * 100).toFixed(1)}%`}
              change={{
                value: 2.1,
                period: "last week",
                type: "increase",
              }}
              icon={<BarChart3 className="w-4 h-4" />}
              color="green"
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Throughput Chart */}
          <div className="lg:col-span-2">
            <ThroughputChart data={performanceMetrics} />
          </div>

          {/* Team Stats Widget */}
          <div className="lg:col-span-1">
            <TeamStatsWidget teamMembers={teamMembers} />
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccuracyTrendChart data={accuracyTrends} />
          <BurndownChart data={burndownData} />
        </div>

        {/* Additional Metrics */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Files in Review"
              value={overview.reviewPending}
              icon={<Clock className="w-4 h-4" />}
              color="yellow"
            />
            <MetricCard
              title="Annotations Today"
              value={overview.annotationsToday}
              icon={<TrendingUp className="w-4 h-4" />}
              color="blue"
            />
            <MetricCard
              title="Avg Time per Annotation"
              value={`${overview.averageTimePerAnnotation.toFixed(1)}m`}
              change={{
                value: -0.3,
                period: "last week",
                type: "decrease",
              }}
              icon={<Clock className="w-4 h-4" />}
              color="green"
            />
          </div>
        )}
      </div>
    </div>
  );
}