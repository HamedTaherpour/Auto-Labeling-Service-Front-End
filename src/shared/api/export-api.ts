// Note: Using mock data for demonstration purposes
// In production, this would use apiClient from "./client"

// Export format types
export type ExportFormat = "darwin_json" | "coco" | "yolo" | "pascal_voc" | "csv";

// Export status types
export type ExportStatus = "processing" | "ready" | "failed";

// Export version interface
export interface ExportVersion {
  id: string;
  datasetId: string;
  status: ExportStatus;
  format: ExportFormat;
  itemCount: number;
  createdAt: string;
  createdBy: string;
  downloadUrl?: string;
  includeWorkerMetadata: boolean;
  filters: {
    completedOnly: boolean;
    specificClasses?: string[];
  };
  errorMessage?: string;
}

// Create export request interface
export interface CreateExportRequest {
  format: ExportFormat;
  includeWorkerMetadata: boolean;
  filters: {
    completedOnly: boolean;
    specificClasses?: string[];
  };
}

// Mock data for demonstration
const mockExports: Record<string, ExportVersion[]> = {
  "dataset-1": [
    {
      id: "export-1",
      datasetId: "dataset-1",
      status: "ready",
      format: "darwin_json",
      itemCount: 1250,
      createdAt: "2024-02-01T10:30:00Z",
      createdBy: "John Doe",
      downloadUrl: "#",
      includeWorkerMetadata: true,
      filters: {
        completedOnly: true,
        specificClasses: ["person", "car", "bicycle"]
      }
    },
    {
      id: "export-2",
      datasetId: "dataset-1",
      status: "processing",
      format: "coco",
      itemCount: 980,
      createdAt: "2024-01-31T15:45:00Z",
      createdBy: "Jane Smith",
      includeWorkerMetadata: false,
      filters: {
        completedOnly: true
      }
    },
    {
      id: "export-3",
      datasetId: "dataset-1",
      status: "failed",
      format: "yolo",
      itemCount: 0,
      createdAt: "2024-01-30T09:15:00Z",
      createdBy: "Bob Johnson",
      includeWorkerMetadata: true,
      filters: {
        completedOnly: false
      },
      errorMessage: "Export failed due to insufficient permissions"
    }
  ],
  "dataset-2": [
    {
      id: "export-4",
      datasetId: "dataset-2",
      status: "ready",
      format: "pascal_voc",
      itemCount: 756,
      createdAt: "2024-01-29T14:20:00Z",
      createdBy: "Alice Wilson",
      downloadUrl: "#",
      includeWorkerMetadata: true,
      filters: {
        completedOnly: true,
        specificClasses: ["dog", "cat"]
      }
    }
  ]
};

// Export API functions with mock data
export const exportApi = {
  // Create a new export
  createExport: async (datasetId: string, request: CreateExportRequest): Promise<ExportVersion> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newExport: ExportVersion = {
      id: `export-${Date.now()}`,
      datasetId,
      status: "processing",
      format: request.format,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
      includeWorkerMetadata: request.includeWorkerMetadata,
      filters: request.filters
    };

    // Add to mock data
    if (!mockExports[datasetId]) {
      mockExports[datasetId] = [];
    }
    mockExports[datasetId].unshift(newExport);

    // Simulate processing completion after 3 seconds
    setTimeout(() => {
      const exportIndex = mockExports[datasetId].findIndex(e => e.id === newExport.id);
      if (exportIndex !== -1) {
        mockExports[datasetId][exportIndex] = {
          ...mockExports[datasetId][exportIndex],
          status: "ready",
          itemCount: Math.floor(Math.random() * 2000) + 500,
          downloadUrl: "#"
        };
      }
    }, 3000);

    return newExport;
  },

  // Get all exports for a dataset
  getExports: async (datasetId: string): Promise<ExportVersion[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockExports[datasetId] || [];
  },

  // Get export details and download URL
  getExport: async (datasetId: string, exportId: string): Promise<ExportVersion> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const datasetExports = mockExports[datasetId];
    if (!datasetExports) {
      throw new Error("Dataset not found");
    }

    const exportData = datasetExports.find(e => e.id === exportId);
    if (!exportData) {
      throw new Error("Export not found");
    }

    return exportData;
  },
};