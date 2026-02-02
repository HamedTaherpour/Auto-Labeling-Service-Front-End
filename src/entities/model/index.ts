// Model entity types and interfaces
export interface Model {
    id: string;
    name: string;
    type: 'Instance Segmentation' | 'Object Detection' | 'Keypoint Detection' | 'OCR' | 'Caption' | 'Caption Grounding';
    status: 'active' | 'inactive' | 'training' | 'error';
    version?: string;
    accuracy?: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
    provider: 'rexomni' | 'florence' | 'custom';
    task: string; // e.g., 'detection', 'ocr', 'keypoint', 'caption', 'caption_grounding'
}

export interface ModelVersion {
    id: string;
    modelId: string;
    version: string;
    accuracy: number;
    metrics: Record<string, number>;
    trainedAt: string;
    status: 'active' | 'deprecated';
}

// Re-export components
export { ModelCard } from './ui/ModelCard';