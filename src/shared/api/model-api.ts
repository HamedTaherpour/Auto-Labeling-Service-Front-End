import { apiClient } from './client';
import { Model } from '@/entities/model';

// Model API service
export const modelApi = {
  // Get all available models
  async getModels(): Promise<Model[]> {
    try {
      // Based on Postman collection, we'd call GET /api/v1/models
      // For now, return mock data based on available endpoints

      const mockModels: Model[] = [
        {
          id: 'rexomni-detection',
          name: 'RexOmni Detection',
          type: 'Object Detection',
          status: 'active',
          version: 'v2.1',
          accuracy: 0.92,
          description: 'High-precision object detection model',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          provider: 'rexomni',
          task: 'detection',
        },
        {
          id: 'rexomni-ocr',
          name: 'RexOmni OCR',
          type: 'OCR',
          status: 'active',
          version: 'v1.8',
          accuracy: 0.89,
          description: 'Optical character recognition for text extraction',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          provider: 'rexomni',
          task: 'ocr',
        },
        {
          id: 'rexomni-keypoint',
          name: 'RexOmni Keypoint',
          type: 'Keypoint Detection',
          status: 'active',
          version: 'v1.5',
          accuracy: 0.85,
          description: 'Human pose and keypoint detection',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          provider: 'rexomni',
          task: 'keypoint',
        },
        {
          id: 'florence-caption',
          name: 'Florence Caption',
          type: 'Caption',
          status: 'active',
          version: 'v2.0',
          accuracy: 0.88,
          description: 'Image captioning and description generation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          provider: 'florence',
          task: 'caption',
        },
        {
          id: 'florence-grounding',
          name: 'Florence Grounding',
          type: 'Caption Grounding',
          status: 'active',
          version: 'v2.0',
          accuracy: 0.87,
          description: 'Text-based object localization in images',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          provider: 'florence',
          task: 'caption_grounding',
        },
        {
          id: 'aura-sam',
          name: 'Aura-SAM-v2',
          type: 'Instance Segmentation',
          status: 'active',
          version: 'v2.0',
          accuracy: 0.94,
          description: 'Advanced instance segmentation with SAM',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          provider: 'custom',
          task: 'segmentation',
        },
      ];

      return mockModels;
    } catch (error) {
      console.error('Failed to fetch models:', error);
      throw error;
    }
  },

  // Get a specific model by ID
  async getModel(id: string): Promise<Model> {
    try {
      const models = await this.getModels();
      const model = models.find(m => m.id === id);
      if (!model) {
        throw new Error(`Model with id ${id} not found`);
      }
      return model;
    } catch (error) {
      console.error('Failed to fetch model:', error);
      throw error;
    }
  },

  // Trigger auto-annotation for a dataset
  async autoAnnotateDataset(
    datasetId: string,
    model: Model,
    confidenceThreshold: number
  ): Promise<{ jobId: string; annotations: any[] }> {
    try {
      // Based on requirements, this would call POST /api/v1/datasets/{id}/auto-annotate
      // For now, simulate the API call

      console.log('Triggering auto-annotation for dataset:', datasetId, 'with model:', model.name);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response
      return {
        jobId: `job-${Date.now()}`,
        annotations: [],
      };
    } catch (error) {
      console.error('Failed to trigger dataset auto-annotation:', error);
      throw error;
    }
  },

  // Trigger inference for a single file
  async inferFile(
    fileId: string,
    model: Model,
    confidenceThreshold: number
  ): Promise<{ annotations: any[] }> {
    try {
      // Based on requirements, this would call POST /api/v1/files/{id}/infer
      // For now, simulate based on Postman collection endpoints

      console.log('Running inference on file:', fileId, 'with model:', model.name);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock inference results based on model type
      let mockAnnotations: any[] = [];

      switch (model.task) {
        case 'detection':
          mockAnnotations = [
            {
              label: 'person',
              score: 0.98,
              bbox: [12, 34, 200, 400],
              system_generated: true,
            },
            {
              label: 'car',
              score: 0.92,
              bbox: [300, 150, 180, 120],
              system_generated: true,
            },
          ];
          break;

        case 'ocr':
          mockAnnotations = [
            {
              text: 'Hello World',
              score: 0.97,
              bbox: [10, 10, 100, 30],
              system_generated: true,
            },
          ];
          break;

        case 'keypoint':
          mockAnnotations = [
            {
              label: 'person',
              keypoints: [
                { name: 'nose', x: 100, y: 120, score: 0.98 },
                { name: 'left_eye', x: 90, y: 110, score: 0.95 },
              ],
              system_generated: true,
            },
          ];
          break;

        case 'segmentation':
          mockAnnotations = [
            {
              label: 'object',
              score: 0.94,
              mask: 'polygon_points_here',
              bbox: [50, 50, 150, 200],
              system_generated: true,
            },
          ];
          break;

        default:
          mockAnnotations = [];
      }

      // Filter by confidence threshold
      mockAnnotations = mockAnnotations.filter(ann => ann.score >= confidenceThreshold);

      return { annotations: mockAnnotations };
    } catch (error) {
      console.error('Failed to run inference on file:', error);
      throw error;
    }
  },

  // Get inference job status
  async getInferenceStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    result?: any;
  }> {
    try {
      // Based on Postman collection, this would call GET /api/jobs/{jobId}
      // For now, simulate status

      // Mock status progression
      const statuses = ['pending', 'processing', 'completed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        status: randomStatus as any,
        progress: randomStatus === 'completed' ? 100 : Math.random() * 100,
        result: randomStatus === 'completed' ? { annotations: [] } : undefined,
      };
    } catch (error) {
      console.error('Failed to get inference status:', error);
      throw error;
    }
  },
};