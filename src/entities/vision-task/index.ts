// Vision Task Entity Types
export { VisionStatus } from './ui/VisionStatus';
export type VisionTaskType =
  | 'detection'
  | 'ocr'
  | 'keypoint'
  | 'caption'
  | 'caption_grounding';

export type VisionJobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PolygonPoint {
  x: number;
  y: number;
}

export interface Polygon {
  points: PolygonPoint[];
}

export interface Keypoint {
  name: string;
  x: number;
  y: number;
  score: number;
}

export interface BaseInferenceResult {
  score: number;
  bbox?: BoundingBox;
  polygon?: Polygon;
}

// Detection result (bounding box with label)
export interface DetectionResult extends BaseInferenceResult {
  label: string;
}

// OCR result (text with bounding box)
export interface OCRResult extends BaseInferenceResult {
  text: string;
}

// Keypoint result (pose estimation)
export interface KeypointResult extends BaseInferenceResult {
  keypoints: Keypoint[];
  label?: string;
}

// Caption result (image description)
export interface CaptionResult {
  caption: string;
  score?: number;
}

// Caption grounding result (text-to-region)
export interface CaptionGroundingResult {
  phrase: string;
  bbox: BoundingBox;
  score: number;
}

// Union type for all inference results
export type InferenceResult =
  | DetectionResult
  | OCRResult
  | KeypointResult
  | CaptionResult
  | CaptionGroundingResult;

export interface VisionJob {
  id: string;
  task: VisionTaskType;
  model: string;
  status: VisionJobStatus;
  progress: number;
  error?: string;
  has_result: boolean;
  artifacts?: string[];
}

export interface VisionJobResult {
  job_id: string;
  task: VisionTaskType;
  model: string;
  annotations: InferenceResult[];
  artifacts?: {
    overlay?: string;
    mask?: string;
  };
}

export interface VisionTask {
  id: string;
  type: VisionTaskType;
  model: 'rexomni' | 'florence';
  input_file?: File;
  text_input?: string; // For caption_grounding
  parameters?: Record<string, any>; // Additional parameters like categories, ocr_format, etc.
}

// Vision capabilities response
export interface VisionCapabilities {
  tasks: VisionTaskType[];
  required_inputs: Record<VisionTaskType, string[]>;
}