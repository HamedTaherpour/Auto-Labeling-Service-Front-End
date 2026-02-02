import { apiClient } from './client';
import {
  VisionTask,
  VisionJob,
  VisionJobResult,
  VisionCapabilities,
  InferenceResult,
  VisionTaskType,
} from '@/entities/vision-task';

// Get available vision tasks and capabilities
export const getVisionCapabilities = async (): Promise<VisionCapabilities> => {
  const response = await apiClient.get('/api/jobs/tasks?model=florence');
  return response.data;
};

// Create a new vision job (async processing)
export const createVisionJob = async (taskData: {
  file: File;
  task: VisionTaskType;
  model: string;
  text_input?: string;
}): Promise<{ job_id: string }> => {
  const formData = new FormData();
  formData.append('file', taskData.file);
  formData.append('task', taskData.task);
  formData.append('model', taskData.model);

  if (taskData.text_input) {
    formData.append('text_input', taskData.text_input);
  }

  const response = await apiClient.post('/api/jobs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Get job status
export const getVisionJobStatus = async (jobId: string): Promise<VisionJob> => {
  const response = await apiClient.get(`/api/jobs/${jobId}`);
  return response.data;
};

// Get job result
export const getVisionJobResult = async (jobId: string): Promise<VisionJobResult> => {
  const response = await apiClient.get(`/api/jobs/${jobId}/result`);
  return response.data;
};

// Direct inference endpoints (real-time)

// RexOmni Detection
export const runRexOmniDetection = async (file: File, categories?: string): Promise<{
  detections: Array<{
    label: string;
    score: number;
    bbox: [number, number, number, number];
  }>;
  overlay_image?: Blob;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  if (categories) {
    formData.append('categories', categories);
  }

  const response = await apiClient.post('/vision/rexomni/detection', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob', // For image overlay
  });

  // Extract detections from header
  const detectionsHeader = response.headers['x-rex-detections'];
  const detections = detectionsHeader ? JSON.parse(detectionsHeader) : [];

  return {
    detections,
    overlay_image: response.data,
  };
};

// RexOmni OCR
export const runRexOmniOCR = async (
  file: File,
  outputFormat: string = 'Box',
  granularity: string = 'Word Level'
): Promise<{
  task: string;
  results: Array<{
    text: string;
    score: number;
    bbox: [number, number, number, number];
  }>;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ocr_output_format', outputFormat);
  formData.append('ocr_granularity', granularity);

  const response = await apiClient.post('/vision/rexomni/ocr', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// RexOmni Keypoint Detection
export const runRexOmniKeypoint = async (
  file: File,
  keypointType: string = 'human_pose',
  categories?: string
): Promise<{
  task: string;
  results: Array<{
    label?: string;
    keypoints: Array<{
      name: string;
      x: number;
      y: number;
      score: number;
    }>;
  }>;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('keypoint_type', keypointType);
  if (categories) {
    formData.append('categories', categories);
  }

  const response = await apiClient.post('/vision/rexomni/keypoint', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Florence Caption
export const runFlorenceCaption = async (
  file: File,
  visualize: boolean = true
): Promise<{
  caption: string;
  overlay_image?: Blob;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('visualize', visualize.toString());

  const response = await apiClient.post('/vision/florence/caption', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });

  // Extract caption from header
  const captionHeader = response.headers['x-florence-results'];
  const results = captionHeader ? JSON.parse(captionHeader) : [];
  const caption = results.length > 0 ? results[0].caption : '';

  return {
    caption,
    overlay_image: response.data,
  };
};

// Florence Caption Grounding
export const runFlorenceCaptionGrounding = async (
  file: File,
  textInput: string,
  visualize: boolean = true
): Promise<{
  results: Array<{
    phrase: string;
    bbox: [number, number, number, number];
    score: number;
  }>;
  image_bytes?: Blob;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('text_input', textInput);
  formData.append('visualize', visualize.toString());

  const response = await apiClient.post('/vision/florence/caption_grounding', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Unified inference endpoint (as mentioned in requirements)
export const runVisionInference = async (
  file: File,
  task: VisionTaskType,
  model: 'rexomni' | 'florence',
  options?: {
    text_input?: string;
    categories?: string;
    output_format?: string;
    granularity?: string;
    keypoint_type?: string;
    visualize?: boolean;
  }
): Promise<InferenceResult[]> => {
  switch (model) {
    case 'rexomni':
      switch (task) {
        case 'detection': {
          const result = await runRexOmniDetection(file, options?.categories);
          return result.detections.map(d => ({
            label: d.label,
            score: d.score,
            bbox: {
              x: d.bbox[0],
              y: d.bbox[1],
              width: d.bbox[2] - d.bbox[0],
              height: d.bbox[3] - d.bbox[1],
            },
          }));
        }
        case 'ocr': {
          const result = await runRexOmniOCR(file, options?.output_format, options?.granularity);
          return result.results.map(r => ({
            text: r.text,
            score: r.score,
            bbox: {
              x: r.bbox[0],
              y: r.bbox[1],
              width: r.bbox[2] - r.bbox[0],
              height: r.bbox[3] - r.bbox[1],
            },
          }));
        }
        case 'keypoint': {
          const result = await runRexOmniKeypoint(file, options?.keypoint_type, options?.categories);
          return result.results.map(r => ({
            keypoints: r.keypoints,
            label: r.label,
            score: Math.min(...r.keypoints.map(k => k.score)), // Use lowest confidence as overall score
          }));
        }
        default:
          throw new Error(`Task ${task} not supported for RexOmni model`);
      }

    case 'florence':
      switch (task) {
        case 'caption': {
          const result = await runFlorenceCaption(file, options?.visualize);
          return [{
            caption: result.caption,
            score: 1.0, // Caption doesn't have confidence score
          }];
        }
        case 'caption_grounding': {
          if (!options?.text_input) {
            throw new Error('text_input is required for caption_grounding task');
          }
          const result = await runFlorenceCaptionGrounding(file, options.text_input, options?.visualize);
          return result.results.map(r => ({
            phrase: r.phrase,
            score: r.score,
            bbox: {
              x: r.bbox[0],
              y: r.bbox[1],
              width: r.bbox[2] - r.bbox[0],
              height: r.bbox[3] - r.bbox[1],
            },
          }));
        }
        default:
          throw new Error(`Task ${task} not supported for Florence model`);
      }

    default:
      throw new Error(`Model ${model} not supported`);
  }
};