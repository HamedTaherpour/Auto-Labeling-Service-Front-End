// Analytics and Statistics entity types and interfaces
export interface AnalyticsOverview {
  totalDatasets: number;
  totalFiles: number;
  completedFiles: number;
  activeUsers: number;
  averageAccuracy: number;
  totalAnnotations: number;
  annotationsToday: number;
  reviewPending: number;
  averageTimePerAnnotation: number; // in minutes
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'annotator' | 'reviewer' | 'admin';
  avatar?: string;
  isActive: boolean;
  lastActive: string;
  assignedFiles: number;
  completedFiles: number;
  averageTimePerAnnotation: number; // in minutes
  rejectionRate: number; // percentage
  accuracy: number; // percentage
  annotationsToday: number;
  totalAnnotations: number;
}

export interface PerformanceMetric {
  date: string; // YYYY-MM-DD
  annotatorId: string;
  annotationsCount: number;
  averageTime: number; // minutes per annotation
  accuracy: number;
  rejectionRate: number;
}

export interface AccuracyTrend {
  date: string; // YYYY-MM-DD
  precision: number;
  recall: number;
  f1Score: number;
  modelType: string;
}

export interface DatasetBurndown {
  date: string; // YYYY-MM-DD
  totalFiles: number;
  completedFiles: number;
  reviewedFiles: number;
  pendingFiles: number;
  datasetId: string;
  datasetName: string;
}

export interface QualityReport {
  datasetId: string;
  consensusScore: number; // 0-1
  interAnnotatorAgreement: number; // 0-1
  accuracyByClass: Record<string, number>;
  errorTypes: Record<string, number>; // error_type -> count
  reviewComments: Array<{
    fileId: string;
    reviewerId: string;
    comment: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }>;
}

// Filter interfaces
export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  datasetIds?: string[];
  userIds?: string[];
  modelTypes?: string[];
}

// Re-export components
export { MetricCard } from './ui/MetricCard';