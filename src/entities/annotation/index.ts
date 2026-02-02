// Annotation entity types and interfaces
export interface AnnotationClass {
  id: string;
  name: string;
  color: string;
  shortcut?: string;
}

export interface Annotation {
  id: string;
  fileId: string;
  type: 'bbox' | 'polygon';
  classId: string;
  coordinates: number[]; // [x1, y1, x2, y2] for bbox, or flattened polygon points
  confidence?: number;
  system_generated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnotationData {
  annotations: Annotation[];
  classes: AnnotationClass[];
}

// Re-export components and types
export { AnnotationCanvas } from './ui/AnnotationCanvas';
export { AnnotationShape } from './ui/AnnotationShape';
export type { AnnotationCanvasRef } from './ui/AnnotationCanvas';