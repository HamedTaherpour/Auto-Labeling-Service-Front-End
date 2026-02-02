import { apiClient } from './client';
import {
  AnalyticsOverview,
  TeamMember,
  PerformanceMetric,
  AccuracyTrend,
  DatasetBurndown,
  QualityReport,
  AnalyticsFilters,
} from '@/entities/statistic';

// Analytics API service
export const analyticsApi = {
  // Get analytics overview with KPIs
  async getOverview(filters?: Partial<AnalyticsFilters>): Promise<AnalyticsOverview> {
    try {
      // In a real implementation, this would call GET /api/v1/analytics/overview
      // For now, return mock data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockOverview: AnalyticsOverview = {
        totalDatasets: 8,
        totalFiles: 2450,
        completedFiles: 1890,
        activeUsers: 12,
        averageAccuracy: 0.87,
        totalAnnotations: 15750,
        annotationsToday: 234,
        reviewPending: 156,
        averageTimePerAnnotation: 2.3,
      };

      return mockOverview;
    } catch (error) {
      console.error('Failed to fetch analytics overview:', error);
      throw error;
    }
  },

  // Get team performance data
  async getTeamPerformance(filters?: Partial<AnalyticsFilters>): Promise<TeamMember[]> {
    try {
      // In a real implementation, this would call GET /api/v1/teams/performance
      // For now, return mock data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockTeam: TeamMember[] = [
        {
          id: 'user-1',
          name: 'Sarah Chen',
          email: 'sarah.chen@company.com',
          role: 'reviewer',
          avatar: '/avatars/sarah.jpg',
          isActive: true,
          lastActive: new Date().toISOString(),
          assignedFiles: 45,
          completedFiles: 42,
          averageTimePerAnnotation: 1.8,
          rejectionRate: 0.05,
          accuracy: 0.94,
          annotationsToday: 28,
          totalAnnotations: 1250,
        },
        {
          id: 'user-2',
          name: 'Marcus Rodriguez',
          email: 'marcus.r@company.com',
          role: 'annotator',
          avatar: '/avatars/marcus.jpg',
          isActive: true,
          lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
          assignedFiles: 38,
          completedFiles: 35,
          averageTimePerAnnotation: 2.1,
          rejectionRate: 0.08,
          accuracy: 0.89,
          annotationsToday: 22,
          totalAnnotations: 980,
        },
        {
          id: 'user-3',
          name: 'Priya Patel',
          email: 'priya.patel@company.com',
          role: 'annotator',
          avatar: '/avatars/priya.jpg',
          isActive: false,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          assignedFiles: 52,
          completedFiles: 48,
          averageTimePerAnnotation: 2.5,
          rejectionRate: 0.12,
          accuracy: 0.82,
          annotationsToday: 0,
          totalAnnotations: 1560,
        },
        {
          id: 'user-4',
          name: 'David Kim',
          email: 'david.kim@company.com',
          role: 'reviewer',
          avatar: '/avatars/david.jpg',
          isActive: true,
          lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          assignedFiles: 31,
          completedFiles: 29,
          averageTimePerAnnotation: 1.5,
          rejectionRate: 0.03,
          accuracy: 0.96,
          annotationsToday: 15,
          totalAnnotations: 890,
        },
        {
          id: 'user-5',
          name: 'Emma Thompson',
          email: 'emma.t@company.com',
          role: 'annotator',
          avatar: '/avatars/emma.jpg',
          isActive: true,
          lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
          assignedFiles: 29,
          completedFiles: 26,
          averageTimePerAnnotation: 2.8,
          rejectionRate: 0.15,
          accuracy: 0.78,
          annotationsToday: 18,
          totalAnnotations: 720,
        },
      ];

      return mockTeam;
    } catch (error) {
      console.error('Failed to fetch team performance:', error);
      throw error;
    }
  },

  // Get performance metrics over time
  async getPerformanceMetrics(filters?: Partial<AnalyticsFilters>): Promise<PerformanceMetric[]> {
    try {
      // In a real implementation, this would call GET /api/v1/analytics/performance-metrics
      // For now, return mock data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      const mockMetrics: PerformanceMetric[] = [];
      const users = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];
      const today = new Date();

      // Generate 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        users.forEach(userId => {
          mockMetrics.push({
            date: date.toISOString().split('T')[0],
            annotatorId: userId,
            annotationsCount: Math.floor(Math.random() * 50) + 10,
            averageTime: Math.random() * 2 + 1.5,
            accuracy: Math.random() * 0.3 + 0.7,
            rejectionRate: Math.random() * 0.2,
          });
        });
      }

      return mockMetrics;
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      throw error;
    }
  },

  // Get accuracy trends over time
  async getAccuracyTrends(filters?: Partial<AnalyticsFilters>): Promise<AccuracyTrend[]> {
    try {
      // In a real implementation, this would call GET /api/v1/analytics/accuracy-trends
      // For now, return mock data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));

      const mockTrends: AccuracyTrend[] = [];
      const models = ['Object Detection', 'Instance Segmentation', 'OCR'];
      const today = new Date();

      // Generate 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        models.forEach(modelType => {
          mockTrends.push({
            date: date.toISOString().split('T')[0],
            precision: Math.random() * 0.2 + 0.75,
            recall: Math.random() * 0.2 + 0.75,
            f1Score: Math.random() * 0.2 + 0.75,
            modelType,
          });
        });
      }

      return mockTrends;
    } catch (error) {
      console.error('Failed to fetch accuracy trends:', error);
      throw error;
    }
  },

  // Get dataset burndown data
  async getDatasetBurndown(datasetId?: string, filters?: Partial<AnalyticsFilters>): Promise<DatasetBurndown[]> {
    try {
      // In a real implementation, this would call GET /api/v1/analytics/dataset-burndown
      // For now, return mock data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockBurndown: DatasetBurndown[] = [];
      const today = new Date();
      const datasets = [
        { id: 'dataset-1', name: 'Urban Street Scenes', total: 150 },
        { id: 'dataset-2', name: 'Retail Product Catalog', total: 200 },
        { id: 'dataset-3', name: 'Medical X-Ray Analysis', total: 300 },
      ];

      // Generate 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        datasets.forEach(dataset => {
          const progress = Math.min(1, (30 - i) / 30); // Progress over time
          const completed = Math.floor(dataset.total * progress * 0.8);
          const reviewed = Math.floor(completed * 0.9);

          mockBurndown.push({
            date: date.toISOString().split('T')[0],
            totalFiles: dataset.total,
            completedFiles: completed,
            reviewedFiles: reviewed,
            pendingFiles: dataset.total - completed,
            datasetId: dataset.id,
            datasetName: dataset.name,
          });
        });
      }

      // Filter by dataset if specified
      if (datasetId) {
        return mockBurndown.filter(item => item.datasetId === datasetId);
      }

      return mockBurndown;
    } catch (error) {
      console.error('Failed to fetch dataset burndown:', error);
      throw error;
    }
  },

  // Get quality report for a dataset
  async getQualityReport(datasetId: string, filters?: Partial<AnalyticsFilters>): Promise<QualityReport> {
    try {
      // In a real implementation, this would call GET /api/v1/datasets/{id}/quality-report
      // For now, return mock data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      const mockReport: QualityReport = {
        datasetId,
        consensusScore: 0.85,
        interAnnotatorAgreement: 0.82,
        accuracyByClass: {
          car: 0.92,
          pedestrian: 0.88,
          bicycle: 0.85,
          traffic_light: 0.95,
          bus: 0.89,
        },
        errorTypes: {
          misclassification: 12,
          missed_annotation: 8,
          incorrect_bbox: 15,
          false_positive: 5,
        },
        reviewComments: [
          {
            fileId: 'file-123',
            reviewerId: 'user-1',
            comment: 'Bounding box too tight on car in frame 45',
            severity: 'medium',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
          {
            fileId: 'file-456',
            reviewerId: 'user-4',
            comment: 'Missing pedestrian annotation in bottom right',
            severity: 'high',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          },
        ],
      };

      return mockReport;
    } catch (error) {
      console.error('Failed to fetch quality report:', error);
      throw error;
    }
  },
};