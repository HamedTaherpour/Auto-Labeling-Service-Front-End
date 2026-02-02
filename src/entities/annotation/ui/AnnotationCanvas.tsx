"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas, Object, Image, Rect, Text } from "fabric";

interface PredictionShape {
  bbox?: { x: number; y: number; width: number; height: number };
  polygon?: Array<{ x: number; y: number }>;
  label?: string;
  score?: number;
  text?: string;
}

interface ShapeData {
  id?: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  classId?: string;
  confidence?: number;
  system_generated?: boolean;
  [key: string]: unknown;
}

export interface AnnotationCanvasRef {
  canvas: Canvas | null;
  addShape: (shape: ShapeData) => void;
  removeShape: (shape: Object) => void;
  clearCanvas: () => void;
  getObjects: () => Object[];
  loadAnnotations: (annotations: ShapeData[]) => void;
  filterByConfidence: (threshold: number) => void;
  addAIPredictions: (predictions: PredictionShape[]) => void;
  clearAIPredictions: () => void;
  setPredictionOpacity: (opacity: number) => void;
}

interface AnnotationCanvasProps {
  width: number;
  height: number;
  imageUrl?: string;
  onShapeCreated?: (shape: Object) => void;
  onShapeSelected?: (shape: Object | null) => void;
  onShapeModified?: (shape: Object) => void;
  onCanvasClick?: (point: { x: number; y: number }) => void;
  predictionOpacity?: number;
  className?: string;
}

export const AnnotationCanvas = forwardRef<
  AnnotationCanvasRef,
  AnnotationCanvasProps
>(
  (
    {
      width,
      height,
      imageUrl,
      onShapeCreated,
      onShapeSelected,
      onShapeModified,
      onCanvasClick,
      predictionOpacity = 0.7,
      className,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const aiPredictionObjects = useRef<Object[]>([]);

    useEffect(() => {
      if (!canvasRef.current) return;

      // Initialize Fabric.js canvas
      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#000000",
        selection: true,
        uniformScaling: false,
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      // Load background image if provided
      if (imageUrl) {
        Image.fromURL(imageUrl).then((img) => {
          if (img) {
            // Scale image to fit canvas while maintaining aspect ratio
            const scaleX = width / img.width!;
            const scaleY = height / img.height!;
            const scale = Math.min(scaleX, scaleY);

            img.scale(scale);
            img.set({
              left: (width - img.getScaledWidth()) / 2,
              top: (height - img.getScaledHeight()) / 2,
              selectable: false,
              evented: false,
            });

            canvas.add(img);
            canvas.sendObjectToBack(img);
            canvas.renderAll();
          }
        }).catch((error) => {
          console.error('Failed to load image:', error);
        });
      }

      // Event handlers
      canvas.on("object:added", (e) => {
        if (e.target && onShapeCreated) {
          onShapeCreated(e.target);
        }
      });

      canvas.on("selection:created", (e) => {
        if (onShapeSelected) {
          onShapeSelected(e.selected?.[0] || null);
        }
      });

      canvas.on("selection:updated", (e) => {
        if (onShapeSelected) {
          onShapeSelected(e.selected?.[0] || null);
        }
      });

      canvas.on("selection:cleared", () => {
        if (onShapeSelected) {
          onShapeSelected(null);
        }
      });

      canvas.on("object:modified", (e) => {
        if (e.target && onShapeModified) {
          onShapeModified(e.target);
        }
      });

      canvas.on("mouse:down", (e) => {
        if (onCanvasClick && (e as any).e) {
          const rect = canvas.getElement().getBoundingClientRect();
          const event = (e as any).e;
          onCanvasClick({
            x: event.offsetX || event.clientX - rect.left,
            y: event.offsetY || event.clientY - rect.top,
          });
        }
      });

      return () => {
        canvas.dispose();
      };
    }, [
      width,
      height,
      imageUrl,
      onShapeCreated,
      onShapeSelected,
      onShapeModified,
      onCanvasClick,
    ]);

    // Expose canvas methods via ref
    useImperativeHandle(ref, () => ({
      canvas: fabricCanvasRef.current,
      addShape: (shape: ShapeData) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        // Create a rectangle for bbox annotations
        if (shape.type === 'bbox') {
          const rect = new (require('fabric').Rect)({
            left: shape.x,
            top: shape.y,
            width: shape.width,
            height: shape.height,
            fill: 'transparent',
            stroke: '#FF6300',
            strokeWidth: shape.system_generated ? 3 : 2,
            strokeDashArray: shape.system_generated ? [5, 5] : undefined,
            opacity: (shape.confidence || 1.0) >= 0.85 ? 1.0 : 0.3, // Initial filter
          });

          // Store custom properties
          rect.confidence = shape.confidence || 1.0;
          rect.classId = shape.classId;
          rect.system_generated = shape.system_generated || false;
          rect.id = shape.id;

          canvas.add(rect);
          canvas.renderAll();
        }
        // Note: Only bbox shapes are currently supported
      },
      removeShape: (shape: Object) => {
        fabricCanvasRef.current?.remove(shape);
      },
      clearCanvas: () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.clear();
          fabricCanvasRef.current.backgroundColor = "#000000";
          fabricCanvasRef.current.renderAll();
        }
      },
      getObjects: () => {
        return fabricCanvasRef.current?.getObjects() || [];
      },
      loadAnnotations: (annotations: ShapeData[]) => {
        // This will be implemented to load annotations from API
        console.log("Loading annotations:", annotations);
      },
      filterByConfidence: (threshold: number) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const objects = canvas.getObjects();
        objects.forEach((obj) => {
          // Skip background image
          if ((obj as any).type === 'image') return;

          const confidence = (obj as any).confidence || 1.0;
          const shouldShow = confidence >= threshold;

          obj.set({
            visible: shouldShow,
            opacity: shouldShow ? 1.0 : 0.3,
          });
        });

        canvas.renderAll();
      },
      addAIPredictions: (predictions: PredictionShape[]) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        // Clear existing AI predictions
        aiPredictionObjects.current.forEach(obj => canvas.remove(obj));
        aiPredictionObjects.current = [];

        predictions.forEach((prediction: any) => {
          let shape: Object | null = null;

          if (prediction.bbox) {
            // Create bounding box
            shape = new Rect({
              left: prediction.bbox.x,
              top: prediction.bbox.y,
              width: prediction.bbox.width,
              height: prediction.bbox.height,
              fill: 'transparent',
              stroke: '#FF6300',
              strokeWidth: 2,
              strokeDashArray: [5, 5],
              opacity: predictionOpacity,
              selectable: false,
              evented: false,
              hoverCursor: 'default',
            });

            // Add label if available
            if (prediction.label) {
              const label = new Text(prediction.label, {
                left: prediction.bbox.x,
                top: prediction.bbox.y - 20,
                fontSize: 12,
                fill: '#FF6300',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: 2,
                selectable: false,
                evented: false,
              });
              aiPredictionObjects.current.push(label);
              canvas.add(label);
            }

            // Add confidence score
            if (prediction.score !== undefined) {
              const confidence = new Text(
                `${(prediction.score * 100).toFixed(1)}%`,
                {
                  left: prediction.bbox.x + prediction.bbox.width - 40,
                  top: prediction.bbox.y + prediction.bbox.height + 2,
                  fontSize: 10,
                  fill: '#FF6300',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: 1,
                  selectable: false,
                  evented: false,
                }
              );
              aiPredictionObjects.current.push(confidence);
              canvas.add(confidence);
            }
          } else if (prediction.polygon) {
            // Create polygon (simplified - would need proper polygon rendering)
            // For now, just show a placeholder
            console.log('Polygon predictions not yet implemented');
          }

          if (shape) {
            aiPredictionObjects.current.push(shape);
            canvas.add(shape);
          }
        });

        canvas.renderAll();
      },
      clearAIPredictions: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        aiPredictionObjects.current.forEach(obj => canvas.remove(obj));
        aiPredictionObjects.current = [];
        canvas.renderAll();
      },
      setPredictionOpacity: (opacity: number) => {
        aiPredictionObjects.current.forEach(obj => {
          obj.set({ opacity });
        });
        fabricCanvasRef.current?.renderAll();
      },
    }));

    return (
      <div className={`relative ${className}`}>
        <canvas
          ref={canvasRef}
          className="border border-gray-800"
          style={{ cursor: "crosshair" }}
        />
      </div>
    );
  },
);

AnnotationCanvas.displayName = "AnnotationCanvas";
