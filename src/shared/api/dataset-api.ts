import { apiClient } from "./client";
import type { Annotation } from "@/entities/annotation";

// Types based on the job structure from Postman collection
export interface Dataset {
  id: string;
  name: string;
  status: "In Progress" | "Completed" | "Annotating";
  totalImages: number;
  annotatedImages: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  progress: number; // percentage
}

export interface DatasetStats {
  totalDatasets: number;
  inProgress: number;
  completed: number;
  annotating: number;
}

export interface DatasetFile {
  id: string;
  name: string;
  type: "image" | "video";
  size: number; // in bytes
  url: string;
  thumbnailUrl: string;
  status: "Unprocessed" | "Labeling" | "Review" | "Complete";
  annotations: number;
  lastModified: string;
  createdAt: string;
}

export interface DatasetWorkflowStats {
  unprocessed: number;
  labeling: number;
  review: number;
  complete: number;
  totalFiles: number;
}

export interface DatasetDetailedStats {
  totalAnnotations: number;
  averagePrecision: number;
  reviewProgress: number;
  totalFiles: number;
  processedFiles: number;
}

// Since the Postman collection doesn't have a datasets endpoint,
// we'll create a service that could work with jobs or use mock data
export const datasetApi = {
  // Get all datasets - using mock data for now based on job structure
  async getDatasets(params?: {
    status?: Dataset["status"];
    search?: string;
  }): Promise<Dataset[]> {
    try {
      // In a real implementation, this would call /api/v1/datasets
      // For now, we'll return mock data based on the job structure

      // You could also fetch jobs and transform them into datasets
      // const response = await apiClient.get('/api/jobs');
      // return transformJobsToDatasets(response.data);

      const mockDatasets: Dataset[] = [
        {
          id: "dataset-1",
          name: "Urban Street Scenes",
          status: "In Progress",
          totalImages: 150,
          annotatedImages: 87,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T14:30:00Z",
          description: "Collection of urban street images for object detection",
          progress: 58,
        },
        {
          id: "dataset-2",
          name: "Retail Product Catalog",
          status: "Completed",
          totalImages: 200,
          annotatedImages: 200,
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-18T16:45:00Z",
          description: "Product images for retail inventory management",
          progress: 100,
        },
        {
          id: "dataset-3",
          name: "Medical X-Ray Analysis",
          status: "Annotating",
          totalImages: 300,
          annotatedImages: 120,
          createdAt: "2024-01-12T11:15:00Z",
          updatedAt: "2024-01-21T10:20:00Z",
          description: "X-ray images for medical diagnosis assistance",
          progress: 40,
        },
        {
          id: "dataset-4",
          name: "Wildlife Monitoring",
          status: "In Progress",
          totalImages: 500,
          annotatedImages: 234,
          createdAt: "2024-01-08T13:30:00Z",
          updatedAt: "2024-01-19T09:15:00Z",
          description: "Wildlife camera trap images for species identification",
          progress: 47,
        },
      ];

      let filteredDatasets = mockDatasets;

      // Apply filters
      if (params?.status) {
        filteredDatasets = filteredDatasets.filter(
          (dataset) => dataset.status === params.status
        );
      }

      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredDatasets = filteredDatasets.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(searchTerm) ||
            dataset.description?.toLowerCase().includes(searchTerm)
        );
      }

      return filteredDatasets;
    } catch (error) {
      console.error("Failed to fetch datasets:", error);
      throw error;
    }
  },

  // Get dataset statistics
  async getDatasetStats(): Promise<DatasetStats> {
    try {
      const datasets = await this.getDatasets();

      const stats: DatasetStats = {
        totalDatasets: datasets.length,
        inProgress: datasets.filter((d) => d.status === "In Progress").length,
        completed: datasets.filter((d) => d.status === "Completed").length,
        annotating: datasets.filter((d) => d.status === "Annotating").length,
      };

      return stats;
    } catch (error) {
      console.error("Failed to fetch dataset stats:", error);
      throw error;
    }
  },

  // Get single dataset by ID
  async getDataset(id: string): Promise<Dataset> {
    try {
      const datasets = await this.getDatasets();
      const dataset = datasets.find((d) => d.id === id);

      if (!dataset) {
        throw new Error(`Dataset with id ${id} not found`);
      }

      return dataset;
    } catch (error) {
      console.error("Failed to fetch dataset:", error);
      throw error;
    }
  },

  // Get dataset files
  async getDatasetFiles(datasetId: string): Promise<DatasetFile[]> {
    try {
      // In a real implementation, this would call GET /api/v1/datasets/{datasetId}/files
      // For now, we'll return mock data

      const mockFiles: DatasetFile[] = [
        {
          id: "file-1",
          name: "urban-scene-001.jpg",
          type: "image",
          size: 2048576, // ~2MB
          url: "/api/files/file-1.jpg",
          thumbnailUrl: "/api/thumbnails/file-1-thumb.jpg",
          status: "Complete",
          annotations: 12,
          lastModified: "2024-01-20T14:30:00Z",
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "file-2",
          name: "urban-scene-002.jpg",
          type: "image",
          size: 1856432, // ~1.8MB
          url: "/api/files/file-2.jpg",
          thumbnailUrl: "/api/thumbnails/file-2-thumb.jpg",
          status: "Review",
          annotations: 8,
          lastModified: "2024-01-20T12:15:00Z",
          createdAt: "2024-01-15T10:15:00Z",
        },
        {
          id: "file-3",
          name: "urban-scene-003.jpg",
          type: "image",
          size: 2234512, // ~2.1MB
          url: "/api/files/file-3.jpg",
          thumbnailUrl: "/api/thumbnails/file-3-thumb.jpg",
          status: "Labeling",
          annotations: 5,
          lastModified: "2024-01-20T10:45:00Z",
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "file-4",
          name: "urban-scene-004.jpg",
          type: "image",
          size: 1987234, // ~1.9MB
          url: "/api/files/file-4.jpg",
          thumbnailUrl: "/api/thumbnails/file-4-thumb.jpg",
          status: "Unprocessed",
          annotations: 0,
          lastModified: "2024-01-15T11:00:00Z",
          createdAt: "2024-01-15T11:00:00Z",
        },
        {
          id: "file-5",
          name: "urban-scene-005.jpg",
          type: "image",
          size: 2156432, // ~2MB
          url: "/api/files/file-5.jpg",
          thumbnailUrl: "/api/thumbnails/file-5-thumb.jpg",
          status: "Complete",
          annotations: 15,
          lastModified: "2024-01-20T16:20:00Z",
          createdAt: "2024-01-15T11:15:00Z",
        },
        {
          id: "file-6",
          name: "urban-scene-006.jpg",
          type: "image",
          size: 1897234, // ~1.8MB
          url: "/api/files/file-6.jpg",
          thumbnailUrl: "/api/thumbnails/file-6-thumb.jpg",
          status: "Review",
          annotations: 9,
          lastModified: "2024-01-20T15:10:00Z",
          createdAt: "2024-01-15T11:30:00Z",
        },
      ];

      return mockFiles;
    } catch (error) {
      console.error("Failed to fetch dataset files:", error);
      throw error;
    }
  },

  // Get workflow stats for a dataset
  async getDatasetWorkflowStats(
    datasetId: string
  ): Promise<DatasetWorkflowStats> {
    try {
      const files = await this.getDatasetFiles(datasetId);

      const stats: DatasetWorkflowStats = {
        unprocessed: files.filter((f) => f.status === "Unprocessed").length,
        labeling: files.filter((f) => f.status === "Labeling").length,
        review: files.filter((f) => f.status === "Review").length,
        complete: files.filter((f) => f.status === "Complete").length,
        totalFiles: files.length,
      };

      return stats;
    } catch (error) {
      console.error("Failed to fetch workflow stats:", error);
      throw error;
    }
  },

  // Get detailed stats for a dataset
  async getDatasetDetailedStats(
    datasetId: string
  ): Promise<DatasetDetailedStats> {
    try {
      const files = await this.getDatasetFiles(datasetId);
      const totalAnnotations = files.reduce(
        (sum, file) => sum + file.annotations,
        0
      );

      // Mock realistic stats
      const stats: DatasetDetailedStats = {
        totalAnnotations,
        averagePrecision: 0.87, // Mock precision score
        reviewProgress:
          (files.filter((f) => f.status === "Review" || f.status === "Complete")
            .length /
            files.length) *
          100,
        totalFiles: files.length,
        processedFiles: files.filter((f) => f.status !== "Unprocessed").length,
      };

      return stats;
    } catch (error) {
      console.error("Failed to fetch detailed stats:", error);
      throw error;
    }
  },

  // Get annotations for a specific file
  async getFileAnnotations(fileId: string): Promise<Annotation[]> {
    try {
      // In a real implementation, this would call GET /api/v1/files/{fileId}/annotations
      // For now, we'll return mock data based on the file

      // Mock annotations based on file ID
      const mockAnnotations: Annotation[] = [
        {
          id: `ann-1-${fileId}`,
          fileId,
          type: "bbox",
          classId: "1", // Car
          coordinates: [100, 150, 80, 60],
          confidence: 0.95,
          createdAt: "2024-01-20T10:00:00Z",
          updatedAt: "2024-01-20T10:00:00Z",
        },
        {
          id: `ann-2-${fileId}`,
          fileId,
          type: "bbox",
          classId: "2", // Pedestrian
          coordinates: [300, 200, 40, 120],
          confidence: 0.88,
          createdAt: "2024-01-20T10:15:00Z",
          updatedAt: "2024-01-20T10:15:00Z",
        },
      ];

      return mockAnnotations;
    } catch (error) {
      console.error("Failed to fetch file annotations:", error);
      throw error;
    }
  },

  // Save annotations for a specific file
  async saveFileAnnotations(
    fileId: string,
    annotations: Omit<Annotation, "id" | "createdAt" | "updatedAt">[]
  ): Promise<Annotation[]> {
    try {
      // In a real implementation, this would call POST /api/v1/files/{fileId}/annotations
      // For now, we'll simulate saving and return the annotations with IDs

      const savedAnnotations: Annotation[] = annotations.map((ann, index) => ({
        ...ann,
        id: `saved-ann-${fileId}-${index}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      console.log("Saved annotations:", savedAnnotations);
      return savedAnnotations;
    } catch (error) {
      console.error("Failed to save file annotations:", error);
      throw error;
    }
  },

  // Update a specific annotation
  async updateAnnotation(
    annotationId: string,
    updates: Partial<Annotation>
  ): Promise<Annotation> {
    try {
      // In a real implementation, this would call PUT /api/v1/annotations/{annotationId}
      // For now, we'll simulate updating

      const updatedAnnotation: Annotation = {
        id: annotationId,
        fileId: updates.fileId || "",
        type: updates.type || "bbox",
        classId: updates.classId || "",
        coordinates: updates.coordinates || [],
        confidence: updates.confidence,
        createdAt: updates.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Updated annotation:", updatedAnnotation);
      return updatedAnnotation;
    } catch (error) {
      console.error("Failed to update annotation:", error);
      throw error;
    }
  },

  // Delete an annotation
  async deleteAnnotation(annotationId: string): Promise<void> {
    try {
      // In a real implementation, this would call DELETE /api/v1/annotations/{annotationId}
      console.log("Deleted annotation:", annotationId);
    } catch (error) {
      console.error("Failed to delete annotation:", error);
      throw error;
    }
  },

  // Submit review decision
  async submitReview(
    fileId: string,
    decision: "approve" | "reject" | "request_changes",
    comments: string
  ): Promise<void> {
    try {
      // In a real implementation, this would call POST /api/v1/reviews/submit
      const reviewData = {
        fileId,
        decision,
        comments,
        reviewerId: "current-user",
        timestamp: new Date().toISOString(),
      };

      console.log("Submitting review:", reviewData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to submit review:", error);
      throw error;
    }
  },

  // Get file history/audit trail
  async getFileHistory(fileId: string): Promise<any[]> {
    try {
      // In a real implementation, this would call GET /api/v1/files/{id}/history
      const mockHistory = [
        {
          id: "event-1",
          type: "annotation_created",
          userId: "user-1",
          userName: "John Doe",
          timestamp: "2024-01-20T10:00:00Z",
          details: "Created bounding box for car class",
        },
        {
          id: "event-2",
          type: "annotation_modified",
          userId: "user-1",
          userName: "John Doe",
          timestamp: "2024-01-20T10:15:00Z",
          details: "Adjusted bounding box coordinates",
        },
        {
          id: "event-3",
          type: "review_submitted",
          userId: "user-2",
          userName: "Jane Smith",
          timestamp: "2024-01-20T11:00:00Z",
          details: "Approved annotations with minor comments",
        },
      ];

      return mockHistory;
    } catch (error) {
      console.error("Failed to fetch file history:", error);
      throw error;
    }
  },

  // Update annotation status/metadata (PATCH)
  async patchAnnotation(
    annotationId: string,
    updates: Partial<Annotation>
  ): Promise<Annotation> {
    try {
      // In a real implementation, this would call PATCH /api/v1/annotations/{id}
      console.log("Updating annotation:", annotationId, updates);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        id: annotationId,
        fileId: updates.fileId || "",
        type: updates.type || "bbox",
        classId: updates.classId || "",
        coordinates: updates.coordinates || [],
        confidence: updates.confidence,
        createdAt: updates.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to update annotation:", error);
      throw error;
    }
  },
};
